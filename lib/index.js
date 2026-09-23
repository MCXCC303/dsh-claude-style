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
 *   2. Serve the bundled code font (and user-supplied text faces) as webfonts.
 *      The skin's code font stack names 'JetBrains Mono', which renders only
 *      when the family resolves — and most systems have never installed it.
 *      The font files already ship in this package (SIL OFL), so the route
 *      below hands them to the browser half's @font-face and the code face
 *      works with zero system installs. The Anthropic Sans/Serif text faces
 *      are NOT in the npm package (they remain Anthropic's property), but a
 *      user who drops them into this package's `fonts/` directory gets the
 *      same zero-install treatment; a missing file simply 404s and the stack
 *      falls back to a system-installed copy.
 *   3. Own the settings namespace. The configuration client (`settingsScope`)
 *      only reaches namespaces the api-proxy exposes to it, and a plugin's own
 *      namespace is not on that list — so the browser half reads and writes its
 *      preferences through the fenced route below, exactly as dsh-chat-import
 *      and dsh-better-sidebar do. That route (and the username route) run the
 *      host's own request fence first — see refusalOf().
 *
 * Both registrations are defensive. A host without a web server, or with the
 * route prefix already taken, or with the settings service absent, must still
 * activate the plugin: a failed host fiber also drops the client bundle from
 * the module graph and the whole skin with it. The browser half falls back to
 * its defaults when either surface is missing.
 */
import { readFileSync } from 'node:fs'
import { userInfo } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'dsh-claude-style'

/** Route prefix this plugin owns; the browser half reads `${ROUTE_PREFIX}/${COPY_FILE}`. */
const ROUTE_PREFIX = '/dsh-claude-style'
/** The copy document, built from `src/model-descriptions.json` by scripts/build.mjs. */
const COPY_FILE = 'model-descriptions.json'
/**
 * Webfonts this plugin serves under `${ROUTE_PREFIX}/fonts/`, mapped to their
 * content type. The table is a whitelist: the filename is the whole request
 * contract, so nothing below the package's `fonts/` directory is reachable
 * and no path traversal is possible. The JetBrains Mono files ship in the
 * npm package; the Anthropic faces do not (copyright) — their entries exist so
 * a user-supplied copy in `fonts/` is served, and readFileSync's ENOENT turns
 * into a 404 the browser half's font stacks fall back from.
 */
const FONT_FILES = {
  'JetBrainsMonoVariable.ttf': 'font/ttf',
  'JetBrainsMonoItalicVariable.ttf': 'font/ttf',
  'AnthropicSansWebText.ttf': 'font/ttf',
  'AnthropicSerifWebText.ttf': 'font/ttf',
}
/** Preferences route: `POST` reads when the body carries no write key, writes otherwise. */
const PREFS_PATH = `${ROUTE_PREFIX}/prefs`
/** One-shot host OS user route; the browser half caches the response. */
const USERNAME_PATH = `${ROUTE_PREFIX}/username`

/** The namespace an older host knows this plugin's preferences by. */
const LEGACY_SETTINGS_NAMESPACE = 'claude-style'
/** The id `cordis.patch.yml` inserts; the fallback when the loader entry cannot be read. */
const ENTRY_ID_FALLBACK = 'ui-skin-claude-style'

/**
 * The namespace the preferences are read and written under.
 *
 * 0.1.5-rc.2 and earlier let a plugin own a namespace by name, so this is
 * `claude-style`. 0.1.7 dropped `settings.register()`: a namespace IS a profile
 * entry id and its schema IS that entry's Config, so the id is read off this
 * plugin's own loader entry instead. Resolved during apply; the routes read it
 * later, at request time.
 */
let settingsNamespace = LEGACY_SETTINGS_NAMESPACE

/** This plugin's loader entry id, or the id the patch declares when it cannot be read. */
function entryIdOf(ctx) {
  try {
    const id = ctx?.fiber?.entry?.id
    if (typeof id === 'string' && id !== '') {
      // 0.1.7 reports the entry as "<kind>:<id>" — the profile carries the skin as
      // an `include` entry, so this reads "include:ui-skin-claude-style" — while
      // the settings service keys its namespaces by the BARE id (it lists
      // "ui-skin-claude-style"). Writing under the qualified name is what made
      // every save come back 409 `No configurable plugin entry`. Send the id the
      // service knows; on a host whose id has no kind prefix this is a no-op.
      const colon = id.lastIndexOf(':')
      return colon === -1 ? id : id.slice(colon + 1)
    }
  } catch { /* no loader entry: fall back to the id the patch declares */ }
  return ENTRY_ID_FALLBACK
}

/** Where the settings-namespace registration got to; surfaced by the prefs route for diagnosis. */
let namespaceState = 'pending'
/** Accepted values, mirrored by src/constants.js. */
const BRANDS = ['off', 'claude', 'anthropic']
const COMPOSER_SCOPES = ['off', 'hero', 'conversation', 'all']
const AUTO_POPOVER_SCOPES = ['off', 'account', 'all']
/** The official service id, mirrored by src/constants.js. */
const MODEL_OFFICIAL_GROUP = 'deepseek-official'
/** Languages the account-hold easter egg's page can be written in. */
const BAN_LOCALES = ['en', 'zh']
const USERNAME_MAX = 64
/** Most quick-provider ids kept, and the longest id accepted; mirrored by src/constants.js. */
const QUICK_PROVIDERS_MAX = 64
const PROVIDER_ID_MAX = 128
/** Largest preferences request body read; a real one is a few hundred bytes. */
const PREFS_BODY_MAX = 16 * 1024

/** Defaults, mirrored by the browser half's constants. */
const PREFS_DEFAULT = Object.freeze({
  brand: 'claude',
  collapseFooter: true,
  autoPopover: 'all',
  composerScope: 'all',
  modelPicker: true,
  quickProviders: [],
  username: '',
  banLocale: 'en',
})

/**
 * The schemastery instance the HARNESS itself resolves.
 *
 * A plugin installed by link (`link:D:/…`) resolves its realpath outside the
 * profile tree, so Node never walks the profile's `node_modules` and the plain
 * import fails outright — and the copy the profile's interception layer would
 * offer can belong to a DIFFERENT installation (on this machine the layer
 * points at the Desktop bundle, whose 3.18.2 has no `.volatile()`). The harness
 * always carries schemastery beside its own bin, and that copy is the instance
 * the settings domain validates forms against, so it is asked for first;
 * normal resolution stays as the fallback for a plainly installed plugin.
 *
 * @returns the schema factory, or null when neither path resolves.
 */
async function resolveSchemaFactory() {
  try {
    const { createRequire } = await import('node:module')
    const anchor = typeof process.argv[1] === 'string' && process.argv[1] !== '' ? process.argv[1] : process.execPath
    const factory = createRequire(anchor)('@deepseek-ai/schemastery')
    if (factory !== null && factory !== undefined && typeof factory.object === 'function') return factory
  } catch { /* the anchor carries no schemastery: try normal resolution */ }
  try {
    const module = await import('@deepseek-ai/schemastery')
    return module?.default ?? module?.Schema ?? null
  } catch {
    return null
  }
}

/**
 * The declared Config.
 *
 * 0.1.7+ derives every settings form from the profile entry's Config and
 * exposes only the fields marked `.volatile()`, so the preferences have to be
 * declared here — there is no imperative namespace registration any more.
 * schemastery only grew `volatile()` in 3.18.3 and the desktop bundle still
 * ships 3.18.2, so the marker is applied only when the installed factory
 * provides it; on the older host this same schema is handed to
 * `settings.register()` instead.
 *
 * The import is guarded and top-level-awaited for the same reason the rest of
 * this half is defensive: a host that cannot resolve schemastery must still
 * load the skin — it just loses the settings form.
 *
 * Field types stay permissive (plain string / boolean / array) on purpose: a
 * union resolves by rejection, so one stale value left in the profile patch by
 * an older build would fail resolution for the whole entry. The accepted sets
 * are enforced where they are consumed — the write route drops unknown keys and
 * the browser half clamps everything it reads.
 */
let SchemaFactory = await resolveSchemaFactory()

/** Mark one field editable by the settings page, where the factory supports it. */
function volatileField(field) {
  return typeof field?.volatile === 'function' ? field.volatile() : field
}

export const Config = SchemaFactory === null
  ? undefined
  : SchemaFactory.object({
      brand: volatileField(SchemaFactory.string().default(PREFS_DEFAULT.brand)),
      collapseFooter: volatileField(SchemaFactory.boolean().default(PREFS_DEFAULT.collapseFooter)),
      autoPopover: volatileField(SchemaFactory.string().default(PREFS_DEFAULT.autoPopover)),
      composerScope: volatileField(SchemaFactory.string().default(PREFS_DEFAULT.composerScope)),
      modelPicker: volatileField(SchemaFactory.boolean().default(PREFS_DEFAULT.modelPicker)),
      quickProviders: volatileField(SchemaFactory.array(SchemaFactory.string()).default([])),
      username: volatileField(SchemaFactory.string().default(PREFS_DEFAULT.username)),
      banLocale: volatileField(SchemaFactory.string().default(PREFS_DEFAULT.banLocale)),
    })

/**
 * Resolve the schema package once, for the legacy register path.
 *
 * A settings namespace needs a real schema: the settings service serialises it
 * (`schema.toJSON()`) for configuration surfaces and walks it to redact
 * secrets, so a hand-rolled stand-in would break `describe` for every
 * namespace, not just this one. Resolution goes through
 * {@link resolveSchemaFactory}, and it stays lazy so a host that cannot provide
 * the package loses the settings page rather than the whole skin.
 *
 * @returns the schema factory, or null when it cannot be resolved.
 */
async function loadSchema() {
  return await resolveSchemaFactory()
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
    modelPicker: Schema.any().default(PREFS_DEFAULT.modelPicker),
    quickProviders: Schema.any().default(PREFS_DEFAULT.quickProviders),
    username: Schema.any().default(PREFS_DEFAULT.username),
    banLocale: Schema.any().default(PREFS_DEFAULT.banLocale),
  })
}

/**
 * Clamp the hover-open preference. It used to be a boolean, and a value stored
 * in that shape still has to land on a scope: `true` meant every popover,
 * `false` meant click-only.
 */
function normalizeAutoPopover(value) {
  if (value === true) return 'all'
  if (value === false) return 'off'
  return AUTO_POPOVER_SCOPES.includes(value) ? value : PREFS_DEFAULT.autoPopover
}

/**
 * The provider ids the picker's first level carries: strings, deduped, order
 * kept. Ids rather than names so a catalog rename cannot drop the selection.
 * The official service is the picker's default, not a choice, so a stored id
 * for it is dropped — the first level shows it whenever nothing else is picked.
 */
function normalizeQuickProviders(value) {
  if (!Array.isArray(value)) return []
  const out = []
  for (const id of value) {
    if (out.length >= QUICK_PROVIDERS_MAX) break
    if (typeof id !== 'string' || id === '' || id.length > PROVIDER_ID_MAX) continue
    if (id === MODEL_OFFICIAL_GROUP || out.includes(id)) continue
    out.push(id)
  }
  return out
}

/** Clamp one stored section into the preference shape (the schema stores `any`). */
function normalizePrefs(value) {
  const section = value !== null && typeof value === 'object' ? value : {}
  return {
    brand: BRANDS.includes(section.brand) ? section.brand : PREFS_DEFAULT.brand,
    collapseFooter: section.collapseFooter !== false,
    autoPopover: normalizeAutoPopover(section.autoPopover),
    composerScope: COMPOSER_SCOPES.includes(section.composerScope)
      ? section.composerScope
      : PREFS_DEFAULT.composerScope,
    modelPicker: section.modelPicker !== false,
    quickProviders: normalizeQuickProviders(section.quickProviders),
    username: typeof section.username === 'string'
      ? section.username.trim().slice(0, USERNAME_MAX)
      : PREFS_DEFAULT.username,
    banLocale: BAN_LOCALES.includes(section.banLocale)
      ? section.banLocale
      : PREFS_DEFAULT.banLocale,
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
      ? described.find((entry) => entry && entry.ns === settingsNamespace)
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
  await settings.update(settingsNamespace, patch, expectedRevision)
  return describePrefs(ctx)
}

/**
 * Collect a request body and parse it as a JSON object; an empty body reads as
 * `{}`. A body over `limit` bytes is refused with status 413 without being
 * buffered, and anything that is not a JSON object with 400.
 */
function readJsonBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    let settled = false
    const fail = (status, message) => {
      if (settled) return
      settled = true
      reject(Object.assign(new Error(message), { status }))
    }
    req.on('data', (chunk) => {
      if (settled) return
      size += chunk.length
      if (size > limit) fail(413, 'request body too large')
      else chunks.push(chunk)
    })
    req.on('error', (error) => fail(400, String(error?.message ?? error)))
    req.on('end', () => {
      if (settled) return
      const text = Buffer.concat(chunks).toString('utf8').trim()
      if (text === '') {
        settled = true
        resolve({})
        return
      }
      let body
      try {
        body = JSON.parse(text)
      } catch (error) {
        fail(400, `request body is not JSON: ${error.message}`)
        return
      }
      if (body === null || typeof body !== 'object' || Array.isArray(body)) {
        fail(400, 'request body is not a JSON object')
        return
      }
      settled = true
      resolve(body)
    })
  })
}

/** Whether the request declares a JSON body, as the browser half always does. */
function isJsonRequest(req) {
  const type = String(req.headers['content-type'] ?? '').split(';')[0].trim().toLowerCase()
  return type === 'application/json'
}

/**
 * Why a request to one of this plugin's private routes must be refused, or
 * undefined when it may proceed.
 *
 * `webServer.register()` hands a plugin route raw requests: the host's own
 * `/api` sits behind a Host/Origin fence and the browser-session cookie, but
 * nothing puts a plugin route there, and these two routes write the settings
 * and read the OS user. So they borrow the host's own check,
 * `connection.requestRejection()` (present since 0.1.5-rc.2) — the fence and
 * authentication `/api` applies. The browser passes it with a same-origin
 * request that carries the session cookie; the desktop shell passes it because
 * it forwards to a loopback Host, drops the page's Origin and attaches the
 * cookie itself. A host without that service cannot authenticate anyone, so the
 * stand-in below serves loopback only: a loopback Host (which also defeats DNS
 * rebinding), no cross-site marker, and an Origin, when sent, naming that Host.
 *
 * @param ctx - host plugin context.
 * @param req - node request.
 * @returns 401 / 403, or undefined when the request may proceed.
 */
function refusalOf(ctx, req) {
  try {
    const connection = ctx.get('connection')
    if (typeof connection?.requestRejection === 'function') return connection.requestRejection(req)
  } catch { /* no connection service: the local fence below */ }
  const host = req.headers.host
  if (host !== undefined) {
    let name
    try {
      name = new URL(`http://${host}`).hostname
    } catch {
      return 403
    }
    if (name !== 'localhost' && name !== '[::1]' && !/^127\.\d+\.\d+\.\d+$/.test(name)) return 403
  }
  const site = req.headers['sec-fetch-site']
  if (site !== undefined && site !== 'same-origin' && site !== 'none') return 403
  const origin = req.headers.origin
  if (origin === undefined) return undefined
  try {
    return new URL(origin).host === host ? undefined : 403
  } catch {
    return 403
  }
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
  const here = dirname(fileURLToPath(import.meta.url))
  const file = join(here, COPY_FILE)
  const fontsDir = join(here, '..', 'fonts')

  /**
   * Answer one request under the route prefix with a static file.
   * @param res - node response.
   * @param method - request method; HEAD sends headers only.
   * @param path - absolute file to read.
   * @param headers - content-type / cache-control pair for the payload.
   */
  const sendFile = (res, method, path, headers) => {
    let body
    try {
      // Read per request: the files are small, and an in-place edit then
      // shows up on reload without restarting the host.
      body = readFileSync(path)
    } catch {
      res.writeHead(404)
      res.end()
      return
    }
    res.writeHead(200, {
      ...headers,
      'content-length': String(body.byteLength),
    })
    res.end(method === 'HEAD' ? undefined : body)
  }

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
            /* v8 ignore next -- node:http always sets url on server requests. */
            const sub = new URL(req.url ?? '/', 'http://x').pathname.slice(ROUTE_PREFIX.length)
            if (sub === `/${COPY_FILE}`) {
              sendFile(res, req.method, file, {
                'content-type': 'application/json; charset=utf-8',
                'cache-control': 'no-cache',
              })
              return
            }
            const font = sub.startsWith('/fonts/') ? FONT_FILES[sub.slice('/fonts/'.length)] : undefined
            if (font !== undefined) {
              // The filename changes with the package, so a long cache is safe
              // and keeps the code face off the network after first paint.
              sendFile(res, req.method, join(fontsDir, sub.slice('/fonts/'.length)), {
                'content-type': font,
                'cache-control': 'public, max-age=86400',
              })
              return
            }
            res.writeHead(404)
            res.end()
          },
        }))
      } catch (error) {
        warn(`model copy route unavailable: ${error?.message ?? error}`)
      }

      try {
        // One-shot OS user resolution for the browser half; it caches the
        // response and never polls. The exact route wins over the prefix above.
        disposers.push(scope.webServer.register({
          kind: 'exact',
          path: USERNAME_PATH,
          handler: (req, res) => {
            if (req.method !== 'GET' && req.method !== 'HEAD') {
              res.writeHead(405, { allow: 'GET, HEAD' })
              res.end()
              return
            }
            const refused = refusalOf(ctx, req)
            if (refused !== undefined) {
              sendJson(res, refused, { ok: false, error: refused === 401 ? 'unauthorized' : 'forbidden' })
              return
            }
            let username = ''
            try {
              username = userInfo().username || ''
            } catch { /* no OS user: the browser falls back to 'User' */ }
            const body = Buffer.from(JSON.stringify({ ok: true, username }))
            res.writeHead(200, {
              'content-type': 'application/json; charset=utf-8',
              'content-length': String(body.byteLength),
              'cache-control': 'no-cache',
            })
            res.end(req.method === 'HEAD' ? undefined : body)
          },
        }))
      } catch (error) {
        warn(`username route unavailable: ${error?.message ?? error}`)
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
            const refused = refusalOf(ctx, req)
            if (refused !== undefined) {
              sendJson(res, refused, { ok: false, error: refused === 401 ? 'unauthorized' : 'forbidden' })
              return
            }
            // A JSON content type is what a cross-site page cannot send without a
            // CORS preflight, which this route never answers.
            if (!isJsonRequest(req)) {
              sendJson(res, 415, { ok: false, error: 'expected application/json' })
              return
            }
            let body
            try {
              body = await readJsonBody(req, PREFS_BODY_MAX)
            } catch (error) {
              sendJson(res, error?.status === 413 ? 413 : 400, { ok: false, error: String(error?.message ?? error) })
              return
            }
            const patch = {}
            if (BRANDS.includes(body.brand)) patch.brand = body.brand
            if (typeof body.collapseFooter === 'boolean') patch.collapseFooter = body.collapseFooter
            if (typeof body.autoPopover === 'boolean' || AUTO_POPOVER_SCOPES.includes(body.autoPopover)) patch.autoPopover = body.autoPopover
            if (typeof body.modelPicker === 'boolean') patch.modelPicker = body.modelPicker
            if (Array.isArray(body.quickProviders)) patch.quickProviders = normalizeQuickProviders(body.quickProviders)
            if (COMPOSER_SCOPES.includes(body.composerScope)) patch.composerScope = body.composerScope
            if (typeof body.username === 'string') patch.username = body.username.trim().slice(0, USERNAME_MAX)
            if (BAN_LOCALES.includes(body.banLocale)) patch.banLocale = body.banLocale

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

  // Always register through inject, never on the bare ctx. `ctx.get()` reads a
  // service leniently (no inject declaration needed), but the PROPERTY access
  // inside registerRoutes (`scope.webServer`) is gated by the fiber's inject
  // declaration — so a host half that re-applies while the web server is
  // ALREADY running (a generation relink after a client-bundle rebuild) used to
  // take the `else registerRoutes(ctx)` branch, every registration threw
  // "cannot get property "webServer" without inject", and all three asset
  // routes stayed down for that generation. The browser half then fetched the
  // copy document in vain — and since loadModelCopy() is one-shot per client
  // generation, the picker rendered without the document (English labels, no
  // vendor lockups, catalog descriptions) until the next HMR. inject() waits
  // for the service and hands registerRoutes a scope that HAS the declaration,
  // so both a boot-time apply (web server not up yet) and a hot relink land on
  // the working path. A host without a web server simply waits forever here,
  // which keeps the defensive contract: the skin still activates.
  if (typeof ctx.inject === 'function') ctx.inject(['webServer'], registerRoutes)
  else registerRoutes(ctx)

  // Settings integration, for both host generations.
  //
  // 0.1.5-rc.2 and earlier own an imperative registry: the plugin registers a
  // schema under its own namespace name. 0.1.7 dropped `settings.register()` —
  // a namespace IS this entry's id and its schema IS the exported Config — so
  // the only thing left to declare is that the skin ships its own settings
  // page, which is what `configure({ auto: false })` says: without it a client
  // that projects pages from the schema would grow a second page beside ours.
  //
  // Both waits are declarative (`ctx.inject`) because `settings` may mount
  // after this plugin. The inject callbacks deliberately return nothing — a
  // plain object throws "Invalid effect" and would take the whole plugin down.
  if (typeof ctx.inject !== 'function') {
    namespaceState = 'no-inject'
  } else {
    ctx.inject(['settings'], (scope) => {
      const settings = scope.settings
      if (settings === undefined || settings === null) return
      if (typeof settings.register !== 'function') {
        settingsNamespace = entryIdOf(ctx)
        if (typeof settings.configure !== 'function') {
          namespaceState = 'settings-unsupported'
          return
        }
        try {
          scope.effect(
            () => settings.configure({ auto: false }, ctx.fiber),
            'dsh-claude-style: settings presentation',
          )
          namespaceState = `configured:${settingsNamespace}`
        } catch (error) {
          namespaceState = `configure-failed: ${error?.message ?? error}`
          ctx.logger?.warn?.(`dsh-claude-style: settings presentation unavailable: ${error?.message ?? error}`)
        }
        return
      }
      loadSchema().then((Schema) => {
        if (Schema === null) {
          namespaceState = 'schema-missing'
          ctx.logger?.warn?.('dsh-claude-style: @deepseek-ai/schemastery did not resolve; preferences fall back to defaults')
          return
        }
        try {
          settings.register(LEGACY_SETTINGS_NAMESPACE, buildPrefsSchema(Schema))
          settingsNamespace = LEGACY_SETTINGS_NAMESPACE
          namespaceState = 'registered'
        } catch (error) {
          namespaceState = `register-failed: ${error?.message ?? error}`
          ctx.logger?.warn?.(`dsh-claude-style: settings namespace unavailable: ${error?.message ?? error}`)
        }
      }).catch((error) => {
        namespaceState = `schema-import-failed: ${error?.message ?? error}`
      })
    })
  }
}
