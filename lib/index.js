/**
 * Host half of dsh-claude-style.
 *
 * The skin's effect is browser-only. This half exists for the two things a
 * browser-only plugin cannot do:
 *
 *   1. Serve the model copy document. That table is DATA, not code — it ships
 *      beside the bundle as `model-descriptions.json` and the browser half
 *      fetches it at runtime, so the table grows without a rebuild and the
 *      bundle stays free of copy.
 *   2. Own the settings namespace. The configuration client (`settingsScope`)
 *      only reaches namespaces the api-proxy exposes to it, and a plugin's own
 *      namespace is not on that list — so the browser half reads and writes its
 *      preferences through the fenced route below, exactly as dsh-chat-import
 *      and dsh-better-sidebar do.
 *
 * Both registrations are defensive. A host without a web server, or with the
 * route prefix already taken, or with the settings service absent, must still
 * activate the plugin: a failed host fiber also drops the client bundle from
 * the module graph and the whole skin with it. The browser half falls back to
 * its defaults when either surface is missing.
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'dsh-claude-style'

/** Route prefix this plugin owns; the browser half reads `${ROUTE_PREFIX}/${COPY_FILE}`. */
const ROUTE_PREFIX = '/dsh-claude-style'
/** The copy document, built from `src/model-descriptions.json` by scripts/build.mjs. */
const COPY_FILE = 'model-descriptions.json'
/** Preferences route: `POST` reads when the body carries no write key, writes otherwise. */
const PREFS_PATH = `${ROUTE_PREFIX}/prefs`

/** Settings namespace owned by this plugin (appears in the user settings document). */
const SETTINGS_NAMESPACE = 'claude-style'

/** Where the settings-namespace registration got to; surfaced by the prefs route for diagnosis. */
let namespaceState = 'pending'
/** Accepted values, mirrored by src/constants.js. */
const BRANDS = ['off', 'claude', 'anthropic']
const COMPOSER_SCOPES = ['off', 'hero', 'conversation', 'all']

/** Defaults, mirrored by the browser half's constants. */
const PREFS_DEFAULT = Object.freeze({
  brand: 'claude',
  collapseFooter: true,
  autoPopover: true,
  composerScope: 'all',
})

/**
 * Resolve the schema package once.
 *
 * A settings namespace needs a real schema: the settings service serialises it
 * (`schema.toJSON()`) for configuration surfaces and walks it to redact
 * secrets, so a hand-rolled stand-in would break `describe` for every
 * namespace, not just this one. The package resolves through the Desktop's own
 * module hook (its shared fallback directory), and the import is dynamic so a
 * host that cannot provide it loses the settings page rather than the whole
 * skin.
 *
 * @returns the schema factory, or null when it cannot be resolved.
 */
async function loadSchema() {
  try {
    const module = await import('@deepseek-ai/schemastery')
    return module?.default ?? module?.Schema ?? null
  } catch {
    return null
  }
}

/**
 * Build the namespace schema.
 *
 * Every field is `any` with a default rather than a union of the accepted
 * values. A union resolves by rejection: one hand-edited or stale value in the
 * user settings document would throw during namespace resolution, which fails
 * registration and takes the whole settings surface down. The accepted set is
 * enforced where it is consumed instead — the write route drops unknown keys
 * and the browser half clamps what it reads.
 *
 * @param Schema - schema factory from `@deepseek-ai/schemastery`.
 * @returns the namespace schema.
 */
function buildPrefsSchema(Schema) {
  return Schema.object({
    brand: Schema.any().default(PREFS_DEFAULT.brand),
    collapseFooter: Schema.any().default(PREFS_DEFAULT.collapseFooter),
    autoPopover: Schema.any().default(PREFS_DEFAULT.autoPopover),
    composerScope: Schema.any().default(PREFS_DEFAULT.composerScope),
  })
}

/** Clamp one stored section into the preference shape (the schema stores `any`). */
function normalizePrefs(value) {
  const section = value !== null && typeof value === 'object' ? value : {}
  return {
    brand: BRANDS.includes(section.brand) ? section.brand : PREFS_DEFAULT.brand,
    collapseFooter: section.collapseFooter !== false,
    autoPopover: section.autoPopover !== false,
    composerScope: COMPOSER_SCOPES.includes(section.composerScope)
      ? section.composerScope
      : PREFS_DEFAULT.composerScope,
  }
}

/** Read the current preferences plus the namespace revision, or defaults when unavailable. */
function describePrefs(ctx) {
  const probe = { hasSettings: false, hasDescribe: false, count: -1, ns: null, error: null, namespaceState }
  try {
    const settings = ctx.get('settings')
    probe.hasSettings = settings !== undefined
    if (settings === undefined || typeof settings.describe !== 'function') {
      return { value: { ...PREFS_DEFAULT }, available: false, probe }
    }
    probe.hasDescribe = true
    const described = settings.describe({ redactSecrets: true })
    probe.count = Array.isArray(described) ? described.length : -1
    probe.ns = Array.isArray(described) ? described.map((e) => e && e.ns).join(',') : null
    const section = Array.isArray(described)
      ? described.find((entry) => entry && entry.ns === SETTINGS_NAMESPACE)
      : undefined
    if (section === undefined) {
      // Registered-but-absent and never-registered look the same here; either
      // way the defaults are what the browser half should run on.
      return { value: { ...PREFS_DEFAULT }, revision: undefined, available: false, probe }
    }
    return { value: normalizePrefs(section.value), revision: section.revision, available: true, probe }
  } catch (error) {
    probe.error = String(error?.message ?? error)
    return { value: { ...PREFS_DEFAULT }, available: false, probe }
  }
}

/**
 * Apply a partial write, then re-read.
 * @param ctx - host context.
 * @param patch - preference keys to write.
 * @param expectedRevision - optimistic-concurrency guard from the last read.
 * @returns the same view `describePrefs` returns.
 */
async function updatePrefs(ctx, patch, expectedRevision) {
  const settings = ctx.get('settings')
  if (settings === undefined || typeof settings.update !== 'function') {
    return { value: { ...PREFS_DEFAULT }, available: false }
  }
  await settings.update(SETTINGS_NAMESPACE, patch, expectedRevision)
  return describePrefs(ctx)
}

/** Collect a request body and parse it as JSON; an empty body reads as `{}`. */
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('error', reject)
    req.on('end', () => {
      const text = Buffer.concat(chunks).toString('utf8').trim()
      if (text === '') return resolve({})
      try {
        resolve(JSON.parse(text))
      } catch (error) {
        reject(new Error(`request body is not JSON: ${error.message}`))
      }
    })
  })
}

/** Send one JSON response. */
function sendJson(res, status, payload) {
  const body = Buffer.from(JSON.stringify(payload))
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': String(body.byteLength),
    'cache-control': 'no-store',
  })
  res.end(body)
}

/**
 * Register the plugin's host surfaces.
 * @param ctx - host plugin context.
 */
export function apply(ctx) {
  const file = join(dirname(fileURLToPath(import.meta.url)), COPY_FILE)

  const registerRoutes = (scope) => {
    scope.effect(() => {
      const disposers = []
      const warn = (message) => ctx.logger?.warn?.(`dsh-claude-style: ${message}`)

      try {
        disposers.push(scope.webServer.register({
          kind: 'prefix',
          path: ROUTE_PREFIX,
          handler: (req, res) => {
            if (req.method !== 'GET' && req.method !== 'HEAD') {
              res.writeHead(405, { allow: 'GET, HEAD' })
              res.end()
              return
            }
            let body
            try {
              // Read per request: the file is small, and an in-place edit then
              // shows up on reload without restarting the host.
              body = readFileSync(file)
            } catch {
              res.writeHead(404)
              res.end()
              return
            }
            res.writeHead(200, {
              'content-type': 'application/json; charset=utf-8',
              'content-length': String(body.byteLength),
              'cache-control': 'no-cache',
            })
            res.end(req.method === 'HEAD' ? undefined : body)
          },
        }))
      } catch (error) {
        warn(`model copy route unavailable: ${error?.message ?? error}`)
      }

      try {
        // The exact route wins over the prefix above, so the copy document keeps
        // its own GET handler while preferences get this POST.
        disposers.push(scope.webServer.register({
          kind: 'exact',
          path: PREFS_PATH,
          handler: async (req, res) => {
            if (req.method !== 'POST') {
              res.writeHead(405, { allow: 'POST' })
              res.end()
              return
            }
            let body
            try {
              body = await readJsonBody(req)
            } catch (error) {
              sendJson(res, 400, { ok: false, error: String(error?.message ?? error) })
              return
            }
            const patch = {}
            if (BRANDS.includes(body.brand)) patch.brand = body.brand
            if (typeof body.collapseFooter === 'boolean') patch.collapseFooter = body.collapseFooter
            if (typeof body.autoPopover === 'boolean') patch.autoPopover = body.autoPopover
            if (COMPOSER_SCOPES.includes(body.composerScope)) patch.composerScope = body.composerScope

            if (Object.keys(patch).length === 0) {
              const view = describePrefs(ctx)
              sendJson(res, 200, { ok: true, value: view.value, revision: view.revision, available: view.available, probe: view.probe })
              return
            }
            try {
              const expected = typeof body.revision === 'number' ? body.revision : undefined
              const view = await updatePrefs(ctx, patch, expected)
              sendJson(res, 200, { ok: true, value: view.value, revision: view.revision, available: view.available })
            } catch (error) {
              // A concurrent move of the namespace surfaces as the settings
              // service's conflict error; the client re-reads the authoritative
              // value instead of retrying blind.
              sendJson(res, 409, { ok: false, code: 'settings-conflict', error: String(error?.message ?? error) })
            }
          },
        }))
      } catch (error) {
        warn(`preferences route unavailable: ${error?.message ?? error}`)
      }

      return () => {
        for (const dispose of disposers) {
          try {
            dispose()
          } catch { /* the route may already be gone */ }
        }
      }
    }, 'dsh-claude-style: host routes')
  }

  if (ctx.get('webServer') === undefined) ctx.inject(['webServer'], registerRoutes)
  else registerRoutes(ctx)

  // Register the settings namespace lazily: `settings` is an optional service
  // that may mount after this plugin, and the schema package resolves through a
  // dynamic import (see loadSchema). The inject callback deliberately returns
  // nothing — cordis validates an inject callback's return value, and a plain
  // object throws "Invalid effect", which would take the whole plugin down.
  loadSchema().then((Schema) => {
    if (Schema === null) {
      namespaceState = 'schema-missing'
      ctx.logger?.warn?.('dsh-claude-style: @deepseek-ai/schemastery did not resolve; preferences fall back to defaults')
      return
    }
    namespaceState = 'schema-ready'
    if (typeof ctx.inject !== 'function') {
      namespaceState = 'no-inject'
      return
    }
    ctx.inject(['settings'], (scope) => {
      try {
        scope.settings.register(SETTINGS_NAMESPACE, buildPrefsSchema(Schema))
        namespaceState = 'registered'
      } catch (error) {
        namespaceState = `register-failed: ${error?.message ?? error}`
        ctx.logger?.warn?.(`dsh-claude-style: settings namespace unavailable: ${error?.message ?? error}`)
      }
    })
  }).catch((error) => {
    namespaceState = `schema-import-failed: ${error?.message ?? error}`
  })
}
