/**
 * Host half of dsh-claude-style.
 *
 * The skin's effect is browser-only. This half exists for the three things a
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
 *   3. Resolve the name this instance runs as, once, for the browser half. The
 *      username route answers a single GET and the browser caches it; it runs
 *      the host's own request fence first — see refusalOf(). A launcher that
 *      published an account contract wins over the OS user, and its own skin is
 *      served as a picture by a second route (the browser cannot read a path).
 *
 * The registrations are defensive. A host without a web server, or with the
 * route prefix already taken, or with the settings service absent, must still
 * activate the plugin: a failed host fiber also drops the client bundle from
 * the module graph and the whole skin with it. The browser half falls back to
 * its defaults when either surface is missing.
 */
import { readFileSync, readdirSync, rmSync, statSync } from 'node:fs'
import { homedir, userInfo } from 'node:os'
import { dirname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'hdsl-claude-style'

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
/** One-shot identity route; the browser half caches the response. */
const USERNAME_PATH = `${ROUTE_PREFIX}/username`
/**
 * The player's own skin, when the launcher published one for this instance.
 *
 * The launcher stores a normalized texture atlas (`skins/<hash>.png`) and hands
 * its absolute path to the host through the launch environment; the browser
 * cannot read a path, so the bytes are served here. The file is the one the
 * environment names — never anything a request asked for.
 */
const SKIN_PATH = `${ROUTE_PREFIX}/skin`
/** Longest accepted custom username; mirrored by src/constants.js. */
const USERNAME_MAX = 64
/** First eight bytes of every PNG; the launcher's skins are PNG atlases. */
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

/**
 * The account contract a launcher publishes for one launch.
 *
 * The harness owns the layer this is read through: `ctx.launchEnvironment` is a
 * snapshot of the inherited process environment, the invoking directory's
 * `.env` and the harness home's `.env`, in that order of trust. Reading the
 * contract through the snapshot rather than the flattened `process.env` is what
 * keeps the project directory from declaring who the player is, so only the two
 * trusted layers are consulted and an omitted layer stays unreachable.
 */
const LAUNCH_ENVIRONMENT_KEY = 'launchEnvironment'
/** Layers an identity may come from, most trusted first. */
const IDENTITY_SOURCES = ['process', 'user-env']

/** One launch-environment variable from a trusted layer, or '' when absent. */
function launchValue(ctx, name) {
  try {
    const snapshot = ctx.get(LAUNCH_ENVIRONMENT_KEY)
    if (snapshot === null || snapshot === undefined || typeof snapshot.getFrom !== 'function') return ''
    const entry = snapshot.getFrom(name, IDENTITY_SOURCES)
    return entry !== null && entry !== undefined && typeof entry.value === 'string' ? entry.value : ''
  } catch {
    return ''
  }
}

/**
 * The account this instance runs as, or null.
 *
 * `HDSL_ACCOUNT_CONTRACT` is the gate: without it no launcher published an
 * account (a hand-started `dsh web`, a host that cannot read the launch
 * environment), and every field below is ignored. The kind is read rather than
 * inferred from an absent vendor — an offline account still carries a vendor
 * (`offline`) — so an absent vendor proves nothing.
 *
 * @param ctx - host plugin context.
 * @returns the account, with `skinFile` kept out of every response.
 */
function launchAccount(ctx) {
  if (launchValue(ctx, 'HDSL_ACCOUNT_CONTRACT') !== '1') return null
  const skin = launchValue(ctx, 'HDSL_ACCOUNT_SKIN')
  return {
    name: launchValue(ctx, 'HDSL_ACCOUNT_NAME').trim().slice(0, USERNAME_MAX),
    vendor: launchValue(ctx, 'HDSL_ACCOUNT_VENDOR'),
    kind: launchValue(ctx, 'HDSL_ACCOUNT_KIND'),
    skin,
    skinModel: launchValue(ctx, 'HDSL_ACCOUNT_SKIN_MODEL'),
    // Only a chosen local picture has a file; the launcher omits the variable
    // entirely for its built-in figures, whose pixels it does not ship.
    skinFile: skin === 'local' ? launchValue(ctx, 'HDSL_ACCOUNT_SKIN_FILE') : '',
  }
}

/** The account as the browser may see it: no paths, only whether a picture exists. */
function accountPayload(account) {
  if (account === null) return null
  return {
    name: account.name,
    vendor: account.vendor,
    kind: account.kind,
    skin: account.skin,
    skinModel: account.skinModel,
    hasSkin: readSkin(account.skinFile) !== null,
  }
}

/**
 * The skin file's bytes, or null when there is nothing to serve.
 *
 * Two conditions, and both are answered here so the advertised picture and the
 * served one cannot disagree: the file has to be readable, and it has to be a
 * PNG — the only thing the launcher ever points this at. A picture that fails
 * either check is reported as missing, which is what the square underneath is
 * for.
 */
function readSkin(path) {
  if (path === '') return null
  try {
    const image = readFileSync(path)
    return image.subarray(0, 8).equals(PNG_SIGNATURE) ? image : null
  } catch {
    return null
  }
}
/**
 * Session deletion.
 *
 * The harness gives the browser half no deletion API of its own: the workspace
 * controller archives and unarchives, and the agent protocol's session delete is
 * the host delegating to an ACP agent that owns the storage. The archived row's
 * delete button therefore comes here, where the stored session directory under
 * the harness home can be removed. The path is also spelled in
 * src/constants.js (SESSION_DELETE_ROUTE) for the browser half; keep the two in
 * step.
 */
const SESSION_DELETE_PATH = `${ROUTE_PREFIX}/session-delete`
/** Session ids are the harness's own shape; anything else is refused before it reaches a path. */
const SESSION_ID_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,199}$/
/** Largest deletion request body read; a real one carries one id. */
const DELETE_BODY_MAX = 4096

/** The namespace an older host knows this plugin's preferences by. */
const LEGACY_SETTINGS_NAMESPACE = 'claude-style'
/** The id `cordis.patch.yml` inserts; the fallback when the loader entry cannot be read. */
const ENTRY_ID_FALLBACK = 'ui-skin-claude-style'

/**
 * The namespace the preferences are read and written under.
 *
 * A namespace IS a profile entry id and its schema IS that entry's Config, so
 * the id is read off this plugin's own loader entry; a host that still owns the
 * imperative registry gets `claude-style` instead. Resolved during apply.
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
 * Why a request to the username route must be refused, or undefined when it
 * may proceed.
 *
 * `webServer.register()` hands a plugin route raw requests: the host's own
 * `/api` sits behind a Host/Origin fence and the browser-session cookie, but
 * nothing puts a plugin route there, and this route reads the OS user. So it
 * borrows the host's own check, `connection.requestRejection()` — the fence and
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

/** The harness sessions root: `<DSH home>/sessions`, resolved the host's own way. */
function sessionsRoot(ctx) {
  try {
    const dshHomePath = ctx.get('dshHomePath')
    if (typeof dshHomePath === 'function') return dshHomePath('sessions')
  } catch { /* no home-path service: fall back to the environment */ }
  const home = process.env.DSH_HOME ?? join(homedir(), '.dsh')
  return join(home, 'sessions')
}

/**
 * Whether the host holds this session open right now.
 *
 * A live session's log is open and being appended to, so its directory must not
 * be removed under the writer. When the live set cannot be read, the answer is
 * "live": an unreadable set cannot authorize the deletion.
 */
function sessionIsLive(ctx, sessionId) {
  let sessions = null
  try {
    sessions = ctx.get('sessions')
  } catch {
    sessions = null
  }
  if (sessions === null || sessions === undefined) return false
  try {
    if (typeof sessions.get === 'function') {
      const found = sessions.get(sessionId)
      return found !== undefined && found !== null
    }
    if (typeof sessions.list === 'function') {
      const listed = sessions.list()
      if (Array.isArray(listed)) {
        return listed.some((item) => (typeof item === 'string' ? item : item?.id ?? item?.sessionId) === sessionId)
      }
    }
  } catch {
    return true
  }
  return true
}

/** One bounded request body, or null when it is oversized or unreadable. */
function readRequestBody(req, limit) {
  return new Promise((settle) => {
    const chunks = []
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > limit) {
        settle(null)
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => settle(Buffer.concat(chunks).toString('utf8')))
    req.on('error', () => settle(null))
  })
}

/**
 * Delete one stored session: the directory named by the id under one of the
 * sessions root's working-directory directories.
 *
 * The id never reaches a path unchecked — it must match the harness's own
 * shape, the lookup is by exact name, and the resolved directory must stay
 * inside the sessions root.
 */
async function deleteSession(ctx, req, res) {
  const refused = refusalOf(ctx, req)
  if (refused !== undefined) {
    sendJson(res, refused, { ok: false, error: refused === 401 ? 'unauthorized' : 'forbidden' })
    return
  }
  const raw = await readRequestBody(req, DELETE_BODY_MAX)
  let request = null
  try {
    request = raw === null ? null : JSON.parse(raw)
  } catch {
    request = null
  }
  const sessionId = request !== null && typeof request.sessionId === 'string' ? request.sessionId : ''
  if (!SESSION_ID_RE.test(sessionId)) {
    sendJson(res, 400, { ok: false, error: 'invalid session id' })
    return
  }
  if (sessionIsLive(ctx, sessionId)) {
    sendJson(res, 409, { ok: false, error: 'session is open' })
    return
  }
  const root = resolve(sessionsRoot(ctx))
  let dir = null
  try {
    for (const entry of readdirSync(root)) {
      const candidate = join(root, entry, sessionId)
      let stat
      try {
        stat = statSync(candidate)
      } catch {
        continue
      }
      if (stat.isDirectory()) {
        dir = candidate
        break
      }
    }
  } catch {
    dir = null
  }
  if (dir === null || !resolve(dir).startsWith(root + sep)) {
    sendJson(res, 404, { ok: false, error: 'session not found' })
    return
  }
  try {
    rmSync(dir, { recursive: true, force: true })
  } catch (error) {
    sendJson(res, 500, { ok: false, error: String(error?.message ?? error) })
    return
  }
  sendJson(res, 200, { ok: true })
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
        // One-shot identity resolution for the browser half; it caches the
        // response and never polls. The exact route wins over the prefix above.
        // A launcher account outranks the OS user: it is the name this instance
        // was started as. The account block rides the same answer, so the
        // browser needs one read for both the name and the picture's existence.
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
            const account = launchAccount(ctx)
            let username = account === null ? '' : account.name
            if (username === '') {
              try {
                username = userInfo().username || ''
              } catch { /* no OS user: the browser falls back to 'User' */ }
            }
            const body = Buffer.from(JSON.stringify({
              ok: true,
              username,
              account: accountPayload(account),
            }))
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
        // The player's own skin. The launcher normalizes every import into one
        // 64×64 (or integer-multiple) PNG atlas and points the environment at
        // that copy, so this route only ever hands over a PNG it read from the
        // launcher's own file — and never a path a request named.
        disposers.push(scope.webServer.register({
          kind: 'exact',
          path: SKIN_PATH,
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
            const account = launchAccount(ctx)
            const image = readSkin(account === null ? '' : account.skinFile)
            if (image === null) {
              res.writeHead(404, { 'cache-control': 'no-store' })
              res.end()
              return
            }
            res.writeHead(200, {
              'content-type': 'image/png',
              'content-length': String(image.byteLength),
              // The player can replace the picture between launches, so the
              // answer is revalidated instead of cached for a day.
              'cache-control': 'no-cache',
              'x-content-type-options': 'nosniff',
            })
            res.end(req.method === 'HEAD' ? undefined : image)
          },
        }))
      } catch (error) {
        warn(`skin route unavailable: ${error?.message ?? error}`)
      }

      try {
        // The archived row's delete button. POST only: the browser half sends
        // one id, and a GET must never reach the filesystem.
        disposers.push(scope.webServer.register({
          kind: 'exact',
          path: SESSION_DELETE_PATH,
          handler: (req, res) => {
            if (req.method !== 'POST') {
              res.writeHead(405, { allow: 'POST' })
              res.end()
              return
            }
            void deleteSession(ctx, req, res).catch((error) => {
              try {
                sendJson(res, 500, { ok: false, error: String(error?.message ?? error) })
              } catch { /* the response may already be gone */ }
            })
          },
        }))
      } catch (error) {
        warn(`session delete route unavailable: ${error?.message ?? error}`)
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

  // Settings integration.
  //
  // A host that owns the imperative registry registers a schema under its own
  // namespace name; 0.1.7 dropped `settings.register()` — a namespace IS this
  // entry's id and its schema IS the exported Config — so the only thing left
  // to declare is that the skin ships its own settings page, which is what
  // `configure({ auto: false })` says: without it a client that projects pages
  // from the schema would grow a second page beside ours.
  //
  // The wait is declarative (`ctx.inject`) because `settings` may mount after
  // this plugin. The inject callback deliberately returns nothing — a plain
  // object throws "Invalid effect" and would take the whole plugin down.
  if (typeof ctx.inject === 'function') {
    ctx.inject(['settings'], (scope) => {
      const settings = scope.settings
      if (settings === undefined || settings === null) return
      if (typeof settings.register !== 'function') {
        settingsNamespace = entryIdOf(ctx)
        if (typeof settings.configure !== 'function') return
        try {
          scope.effect(
            () => settings.configure({ auto: false }, ctx.fiber),
            'dsh-claude-style: settings presentation',
          )
        } catch (error) {
          ctx.logger?.warn?.(`dsh-claude-style: settings presentation unavailable: ${error?.message ?? error}`)
        }
        return
      }
      loadSchema().then((Schema) => {
        if (Schema === null) {
          ctx.logger?.warn?.('dsh-claude-style: @deepseek-ai/schemastery did not resolve; preferences fall back to defaults')
          return
        }
        try {
          settings.register(LEGACY_SETTINGS_NAMESPACE, buildPrefsSchema(Schema))
          settingsNamespace = LEGACY_SETTINGS_NAMESPACE
        } catch (error) {
          ctx.logger?.warn?.(`dsh-claude-style: settings namespace unavailable: ${error?.message ?? error}`)
        }
      }).catch((error) => {
        ctx.logger?.warn?.(`dsh-claude-style: settings schema import failed: ${error?.message ?? error}`)
      })
    })
  }
}
