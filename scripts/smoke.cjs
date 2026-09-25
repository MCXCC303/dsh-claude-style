#!/usr/bin/env node
/**
 * smoke.cjs — zero-dependency smoke test of the BUILT plugin (`lib/`); no running
 * DSH instance is needed.
 *
 * Host half, in Node: `lib/index.js` is applied to a fake cordis context and the
 * username and session-delete routes get the request shapes that matter
 * (docs/architecture.md D11) — a cross-site page, a LAN peer and the browser's
 * own same-origin fetch, plus the deletion route's own guards (POST only, the id
 * shape, an open session, a path-shaped id) and a real deletion against a
 * scratch harness home under .debug/ — once through a host that offers
 * `connection.requestRejection()` and once through the local stand-in.
 *
 * Browser half, in headless Chrome/Edge over CDP: `lib/client.js` is loaded into
 * a page that stands in for the host (module loader, ctx, a sidebar footer with
 * an account menu and two plugin entries, a composer whose editor handles Enter
 * the way the host's keymap does), and checked for:
 *   - boot       apply() installs every feature and registers its teardown;
 *   - idle       once settled, no scheduler pass runs — a pass that mutates the
 *                DOM schedules the next one, and then the page never idles;
 *   - enter      Enter on an open composer menu reaches the host, never "Send";
 *   - desktop    the 0.1.7 desktop footer: the host's own account row is the
 *                entry, and our container is injected into its account menu —
 *                first child, self-healing across a host re-render, reachable
 *                by the host's keyboard walk, and gone when the menu closes;
 *   - markup     strings from settings, the account service and plugins render
 *                as text, never as markup;
 *   - isolation  a host API that breaks one feature — at install or at sync —
 *                retires only that feature and hands its surface back (D12);
 *   - teardown   dispose leaves no skin node, marker, body attribute or
 *                stylesheet behind, and no pass runs afterwards.
 *
 * Usage: node scripts/smoke.cjs        (CHROME_PATH overrides the browser lookup)
 * Exit:  0 every check passed · 1 a check failed · 2 the browser half could not run
 */
'use strict'
const fs = require('fs')
const http = require('http')
const os = require('os')
const path = require('path')
const { Readable } = require('stream')
const { pathToFileURL } = require('url')
const { findChrome, launchChrome, connectTab } = require('./chrome.cjs')

const ROOT = path.resolve(__dirname, '..')
const CLIENT = path.join(ROOT, 'lib', 'client.js')
const HOST = path.join(ROOT, 'lib', 'index.js')
const MARKUP = '<img src=x onerror="window.__pwned=(window.__pwned||0)+1">'
/**
 * A 64×64 skin atlas with three landmarks, so a wrong crop cannot pass: the
 * head's front face (8,8–16,16) is red, the hat layer (40,8–48,16) is clear
 * except two green pixels that land at the box's opposite corners, and the
 * rest of the atlas is grey.
 */
const SKIN_FIXTURE = path.join(__dirname, 'fixtures', 'skin-64.png')
const SKIN_FACE = [255, 0, 0, 255]
const SKIN_HAT = [0, 255, 0, 255]

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

let failed = 0
function check(label, ok, detail) {
  if (!ok) failed += 1
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label}${ok || detail === undefined ? '' : `  — ${detail}`}`)
}

// ---------------------------------------------------------------------------
// Host half
// ---------------------------------------------------------------------------

/**
 * lib/index.js applied to a fake cordis context.
 *
 * @param mod - the host-half module.
 * @param options - `fenced` offers the host's own request check, `home` answers
 *   `dshHomePath` with a scratch harness home, `live` names the sessions the
 *   fake `sessions` service reports as open, and `launch` provides the launch
 *   environment's layers (as the harness's own snapshot does).
 */
function fakeHost(mod, options = {}) {
  const { fenced, home, live = [], launch } = options
  const routes = {}
  const settings = { configure: () => () => {} }
  // Modelled on the host's connection.requestRejection(): the Host/Origin fence
  // (loopback, no cross-site marker, Origin naming the Host), then the cookie.
  const connection = {
    requestRejection(req) {
      const h = req.headers
      if (!/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(h.host ?? '')) return 403
      if (h['sec-fetch-site'] === 'cross-site') return 403
      if (h.origin !== undefined && new URL(h.origin).host !== h.host) return 403
      return /dsh-auth-/.test(h.cookie ?? '') ? undefined : 401
    },
  }
  // The harness's launch environment, as its snapshot behaves: the canonical
  // order is process, project-env, user-env, and a layer left out of the asked
  // list stays unreachable.
  const launchEnvironment = launch === undefined ? undefined : {
    getFrom(name, sources) {
      for (const source of ['process', 'project-env', 'user-env']) {
        if (!sources.includes(source)) continue
        const values = launch[source]
        if (values !== undefined && Object.prototype.hasOwnProperty.call(values, name)) return { value: values[name], source }
      }
      return undefined
    },
  }
  const ctx = {
    fiber: { entry: { id: 'include:ui-skin-claude-style' } },
    logger: { warn() {} },
    get: (name) => {
      if (name === 'connection' && fenced) return connection
      if (name === 'dshHomePath' && home !== undefined) return (sub) => path.join(home, sub)
      if (name === 'sessions') return { get: (id) => (live.includes(id) ? {} : undefined) }
      if (name === 'launchEnvironment') return launchEnvironment
      return undefined
    },
    effect: (fn) => fn(),
    inject: (deps, cb) => cb({
      effect: (fn) => fn(),
      get: (name) => ctx.get(name),
      settings,
      webServer: { register(route) { routes[route.path] = route; return () => {} } },
    }),
  }
  mod.apply(ctx)
  return { routes }
}

/**
 * One request through a registered route; resolves with `{ status, body }`, and
 * with the answer's bytes as `raw` (a picture route answers with them).
 */
function request(host, route, method, body, headers) {
  const req = Readable.from(body ? [Buffer.from(body)] : [])
  Object.assign(req, { method, url: route, headers })
  return new Promise((resolve) => {
    const res = {
      status: 0,
      writeHead(status) { this.status = status },
      end(chunk) {
        const raw = chunk === undefined ? null : (Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
        resolve({ status: this.status, body: raw === null ? '' : raw.toString(), raw })
      },
    }
    Promise.resolve(host.routes[route].handler(req, res)).catch((error) => resolve({ status: -1, body: String(error), raw: null }))
  })
}

async function hostHalf() {
  const mod = await import(pathToFileURL(HOST).href)
  const PREFS = '/dsh-claude-style/prefs'
  const USER = '/dsh-claude-style/username'
  const browser = { host: '127.0.0.1:43120', origin: 'http://127.0.0.1:43120', 'sec-fetch-site': 'same-origin', cookie: 'dsh-auth-x=1' }
  const crossSite = { host: '127.0.0.1:43120', origin: 'https://attacker.example', 'sec-fetch-site': 'cross-site' }
  const lanPeer = { host: '192.168.1.23:43120' }
  const rebound = { host: 'attacker.example:43120', origin: 'http://attacker.example:43120', 'sec-fetch-site': 'same-origin' }

  // Session deletion: the route removes one stored session directory. The root
  // is a scratch harness home under .debug/, never the user's own.
  const DELETE = '/dsh-claude-style/session-delete'
  const scratchHome = path.join(ROOT, '.debug', 'smoke-home')
  const scratchCwd = path.join(scratchHome, 'sessions', '--D-smoke--')
  const scratchId = 'session-smoke-delete-0001'

  for (const fenced of [true, false]) {
    console.log(`\nhost half — ${fenced ? "through the host's connection.requestRejection()" : 'through the local stand-in (no connection service)'}`)
    const host = fakeHost(mod, { fenced, home: scratchHome })
    check('the preferences route is gone', host.routes[PREFS] === undefined)
    check('the session delete route is registered', host.routes[DELETE] !== undefined)
    for (const [label, headers] of [['cross-site page', crossSite], ['LAN peer', lanPeer], ['DNS-rebound page', rebound]]) {
      const r = await request(host, USER, 'GET', '', headers)
      check(`${label}: username read refused`, r.status === 401 || r.status === 403, `HTTP ${r.status}`)
    }
    const r = await request(host, USER, 'GET', '', browser)
    check('browser username read answered', r.status === 200 && JSON.parse(r.body).ok === true, `HTTP ${r.status}`)

    // The launcher's account contract. It arrives through the harness's launch
    // environment; the account name outranks the OS user, and the player's own
    // skin is served as bytes because the browser can never read a path.
    const SKIN = '/dsh-claude-style/skin'
    const contract = {
      HDSL_ACCOUNT_CONTRACT: '1',
      HDSL_ACCOUNT_NAME: 'Ada Lambert',
      HDSL_ACCOUNT_VENDOR: 'deepseek',
      HDSL_ACCOUNT_KIND: 'official',
      HDSL_ACCOUNT_SKIN: 'local',
      HDSL_ACCOUNT_SKIN_MODEL: 'default',
      HDSL_ACCOUNT_SKIN_FILE: SKIN_FIXTURE,
    }
    const withContract = (patch) => fakeHost(mod, {
      fenced, home: scratchHome, launch: { process: Object.assign({}, contract, patch) },
    })
    const who = JSON.parse((await request(withContract(), USER, 'GET', '', browser)).body)
    check('a launcher account names the instance', who.ok === true && who.username === 'Ada Lambert', JSON.stringify(who.username))
    check('the answer carries the account and whether it has a picture',
      who.account !== null && who.account.kind === 'official' && who.account.vendor === 'deepseek'
        && who.account.skin === 'local' && who.account.hasSkin === true,
      JSON.stringify(who.account))
    check('the skin path never reaches the browser', JSON.stringify(who).indexOf(SKIN_FIXTURE) === -1)
    const skin = await request(withContract(), SKIN, 'GET', '', browser)
    check("the skin route serves the launcher's picture",
      skin.status === 200 && Buffer.compare(skin.raw, fs.readFileSync(SKIN_FIXTURE)) === 0, `HTTP ${skin.status}`)
    const head = await request(withContract(), SKIN, 'HEAD', '', browser)
    check('the skin route answers a HEAD with no body', head.status === 200 && head.raw === null, `HTTP ${head.status}`)
    const posted = await request(withContract(), SKIN, 'POST', '', browser)
    check('the skin route refuses a write', posted.status === 405, `HTTP ${posted.status}`)
    for (const [label, headers] of [['cross-site page', crossSite], ['LAN peer', lanPeer], ['DNS-rebound page', rebound]]) {
      const refused = await request(withContract(), SKIN, 'GET', '', headers)
      check(`${label}: skin read refused`, refused.status === 401 || refused.status === 403, `HTTP ${refused.status}`)
    }
    // An offline account keeps its name and its picture. The launcher writes a
    // vendor for it as well (`offline`), so the kind is what says it has none.
    const offline = JSON.parse((await request(withContract({ HDSL_ACCOUNT_KIND: 'offline', HDSL_ACCOUNT_VENDOR: 'offline' }), USER, 'GET', '', browser)).body)
    check('an offline account still names the instance and reports its kind',
      offline.username === 'Ada Lambert' && offline.account.kind === 'offline', JSON.stringify(offline.account))
    // The project directory's `.env` must not be able to say who the player is,
    // nor to point the picture route at a file of its choosing.
    const spoofed = fakeHost(mod, {
      fenced,
      home: scratchHome,
      launch: {
        process: { HDSL_ACCOUNT_CONTRACT: '1' },
        'project-env': { HDSL_ACCOUNT_NAME: 'Mallory', HDSL_ACCOUNT_SKIN: 'local', HDSL_ACCOUNT_SKIN_FILE: SKIN_FIXTURE },
      },
    })
    const spoofedWho = JSON.parse((await request(spoofed, USER, 'GET', '', browser)).body)
    check('the project directory cannot name the player', spoofedWho.username === os.userInfo().username, JSON.stringify(spoofedWho.username))
    check('the project directory cannot supply a picture', spoofedWho.account.hasSkin === false, JSON.stringify(spoofedWho.account))
    check('the project directory cannot make the skin route serve a file',
      (await request(spoofed, SKIN, 'GET', '', browser)).status === 404)
    // Without a contract the OS user stands in, exactly as before a launcher.
    const bare = JSON.parse((await request(fakeHost(mod, { fenced, home: scratchHome }), USER, 'GET', '', browser)).body)
    check('without a contract the OS user stands in', bare.username === os.userInfo().username && bare.account === null, JSON.stringify(bare.username))
    // A picture that is gone, and a file that is not a picture.
    const gone = withContract({ HDSL_ACCOUNT_SKIN_FILE: path.join(scratchHome, 'deleted.png') })
    check('a skin that no longer exists is reported as missing',
      JSON.parse((await request(gone, USER, 'GET', '', browser)).body).account.hasSkin === false)
    check('a missing skin answers 404', (await request(gone, SKIN, 'GET', '', browser)).status === 404)
    const notAPicture = path.join(scratchHome, 'not-a-skin.png')
    fs.mkdirSync(scratchHome, { recursive: true })
    fs.writeFileSync(notAPicture, 'not a png')
    const wrong = withContract({ HDSL_ACCOUNT_SKIN_FILE: notAPicture })
    check('a file that is not a PNG is not served as one', (await request(wrong, SKIN, 'GET', '', browser)).status === 404)
    check('a file that is not a PNG is not advertised as a picture',
      JSON.parse((await request(wrong, USER, 'GET', '', browser)).body).account.hasSkin === false)

    fs.rmSync(scratchHome, { recursive: true, force: true })
    fs.mkdirSync(path.join(scratchCwd, scratchId), { recursive: true })
    fs.writeFileSync(path.join(scratchCwd, scratchId, 'session.v4.jsonl.zstd'), 'x')
    for (const [label, headers] of [['cross-site page', crossSite], ['LAN peer', lanPeer], ['DNS-rebound page', rebound]]) {
      const refused = await request(host, DELETE, 'POST', JSON.stringify({ sessionId: scratchId }), headers)
      check(`${label}: session delete refused`, refused.status === 401 || refused.status === 403, `HTTP ${refused.status}`)
    }
    const read = await request(host, DELETE, 'GET', '', browser)
    check('session delete answers 405 to a read', read.status === 405, `HTTP ${read.status}`)
    const traversal = await request(host, DELETE, 'POST', JSON.stringify({ sessionId: '../escape' }), browser)
    check('a path-shaped id is refused', traversal.status === 400, `HTTP ${traversal.status}`)
    const absent = await request(host, DELETE, 'POST', JSON.stringify({ sessionId: 'session-smoke-absent' }), browser)
    check('an unknown session is not found', absent.status === 404, `HTTP ${absent.status}`)
    const liveHost = fakeHost(mod, { fenced, home: scratchHome, live: [scratchId] })
    const live = await request(liveHost, DELETE, 'POST', JSON.stringify({ sessionId: scratchId }), browser)
    check('a live session is refused', live.status === 409, `HTTP ${live.status}`)
    check('the refused session is still on disk', fs.existsSync(path.join(scratchCwd, scratchId)) === true)
    const done = await request(host, DELETE, 'POST', JSON.stringify({ sessionId: scratchId }), browser)
    check('a stored session is deleted', done.status === 200 && JSON.parse(done.body).ok === true, `HTTP ${done.status}`)
    check('the session directory is gone', fs.existsSync(path.join(scratchCwd, scratchId)) === false)
  }
}

// ---------------------------------------------------------------------------
// Browser half
// ---------------------------------------------------------------------------

/**
 * Runs in the page before the bundle: counts the scheduler's frames, records
 * console errors, and stands in for the host — its account menu (a trigger
 * that portals a role=menu), its composer keymap (Enter picks an open menu's
 * item first), and the ctx services the skin reads. The case decides which
 * host API misbehaves.
 */
const STAND_IN = `(function () {
  var CASE = window.SMOKE_CASE
  var MARKUP = ${JSON.stringify(MARKUP)}
  window.__pwned = 0
  window.__passes = 0
  var raf = window.requestAnimationFrame.bind(window)
  window.requestAnimationFrame = function (cb) { return raf(function (t) { window.__passes++; cb(t) }) }
  window.__errors = []
  var consoleError = console.error
  console.error = function () {
    window.__errors.push(Array.prototype.map.call(arguments, String).join(' '))
    consoleError.apply(console, arguments)
  }

  var menu = null
  var menuViewport = null
  var hostRowsHtml = ''
  function closeHostMenu() {
    if (menu && menu.parentElement) menu.parentElement.removeChild(menu)
    menu = null
    menuViewport = null
  }
  function openHostSettingsDialog() {
    var area = document.querySelector('[class*="settingsArea"]')
    if (!area) return
    var dialog = document.createElement('div')
    dialog.setAttribute('role', 'dialog')
    dialog.textContent = 'Settings'
    area.appendChild(dialog)
  }
  function fillHostRows() {
    while (menuViewport.firstChild) menuViewport.removeChild(menuViewport.firstChild)
    menuViewport.innerHTML = hostRowsHtml
  }
  // The host re-renders its list from React: the viewport is emptied and the
  // host's own rows go back. Our injected container is dropped with them and the
  // skin has to re-insert it.
  window.__rerenderHostMenu = function () {
    if (menuViewport) fillHostRows()
  }
  var accountTrigger = document.getElementById('host-account')
  if (accountTrigger) accountTrigger.addEventListener('click', function () {
    if (menu) { closeHostMenu(); return }
    // The host's real Menu DOM (ui-primitives/Menu.tsx): a role=menu portal to
    // body, a role=presentation viewport, and itemWrap > button[role=menuitem].
    // Picking an item selects it and the menu closes itself (onSelect), so the
    // skin must not click the trigger again. The sign-out glyph copies
    // LogoutIcon.tsx's geometry: a 16px relative box holding a 13.664x13.571 svg
    // at (1.168, 1.214) absolute.
    hostRowsHtml = CASE === 'desktop'
      ? '<div class="itemWrap"><button type="button" role="menuitem">' +
          '<svg viewBox="0 0 16 16" width="16" height="16"></svg>Settings</button></div>' +
        '<div class="itemWrap"><button type="button" role="menuitem">' +
          '<svg viewBox="0 0 16 16" width="16" height="16"></svg>Feedback</button></div>' +
        '<div class="itemWrap"><button type="button" role="menuitem">' +
          '<span style="position:relative;display:inline-block;width:16px;height:16px">' +
            '<svg viewBox="0 0 13.664 13.571" width="13.664" height="13.571" style="position:absolute;left:1.168px;top:1.214px">' +
              '<path d="M1 1 L12.664 12.571" fill="none" stroke="currentColor" stroke-width="1.4"></path>' +
            '</svg></span>Sign out</button></div>'
      : '<div class="itemWrap"><button type="button" role="menuitem">Settings</button></div>' +
        '<div class="itemWrap"><button type="button" role="menuitem">Feedback</button></div>' +
        '<div class="itemWrap"><button type="button" role="menuitem">Sign out</button></div>'
    menu = document.createElement('div')
    menu.setAttribute('role', 'menu')
    menuViewport = document.createElement('div')
    menuViewport.className = 'viewport'
    menuViewport.setAttribute('role', 'presentation')
    menu.appendChild(menuViewport)
    fillHostRows()
    menu.addEventListener('click', function (e) {
      var item = e.target && e.target.closest ? e.target.closest('button[role="menuitem"]') : null
      if (!item) return
      if ((item.textContent || '').trim() === 'Settings') openHostSettingsDialog()
      closeHostMenu()
    })
    document.body.appendChild(menu)
  })
  // The host's Menu keyboard walk: every button in the list is reachable with
  // the direction keys, our injected rows included.
  document.addEventListener('keydown', function (e) {
    if (!menu) return
    if (e.key === 'Escape') { closeHostMenu(); return }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    var buttons = menuViewport.querySelectorAll('button:not(:disabled)')
    if (!buttons.length) return
    var idx = Array.prototype.indexOf.call(buttons, document.activeElement)
    var next = e.key === 'ArrowDown' ? idx + 1 : idx - 1
    if (next < 0) next = buttons.length - 1
    if (next >= buttons.length) next = 0
    buttons[next].focus()
  })
  // A press outside the menu closes it, the way the host's Menu does.
  document.addEventListener('pointerdown', function (e) {
    if (!menu) return
    if (menu.contains(e.target)) return
    closeHostMenu()
  }, true)

  window.__keys = []
  var menuOpen = true
  document.getElementById('editor').addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' || e.shiftKey) return
    e.preventDefault()
    window.__keys.push(menuOpen ? 'host picked the menu item' : 'host submitted')
    menuOpen = false
  })
  document.getElementById('send').addEventListener('click', function () { window.__keys.push('skin clicked Send') })

  if (CASE === 'markup') {
    var action = document.getElementById('plugin-action')
    action.setAttribute('aria-label', MARKUP)
    action.setAttribute('data-cordis-badge', MARKUP)
  }
  // The launcher cases leave the custom name empty on purpose: the name they
  // show is the one the host resolved from the launcher's contract.
  var username = CASE === 'markup' ? MARKUP : (CASE.indexOf('launcher') === 0 ? '' : 'Tester')
  var form = {
    getSnapshot: function () { return { status: 'ready', value: { username: username, collapseFooter: true } } },
    subscribe: function () { return function () {} },
    set: function () { return Promise.resolve(true) },
  }
  var profile = CASE === 'markup'
    ? { name: MARKUP, avatarUrl: 'https://cdn.example.invalid/a.png?"><img src=x onerror=window.__pwned=1> onmouseover=window.__pwned=1' }
    : { name: 'Ada', avatarUrl: 'https://cdn.example.invalid/a.png' }
  // The desktop account stream, driven by hand: remote.$stream wraps
  // remote.account.watch, and __pushAccountFrame hands the skin one frame.
  // A frame's accept is a no-op, and the next next() pends until the next
  // push, so the stream never spins.
  window.__profileReads = 0
  var accountFrameQueue = []
  var accountFramePending = null
  window.__pushAccountFrame = function (view) {
    var step = { done: false, value: { value: view, accept: function () {} } }
    if (accountFramePending !== null) {
      var resolve = accountFramePending
      accountFramePending = null
      resolve(step)
    } else {
      accountFrameQueue.push(step)
    }
  }
  function accountFrames() {
    return {
      next: function () {
        if (accountFrameQueue.length > 0) return Promise.resolve(accountFrameQueue.shift())
        return new Promise(function (resolve) { accountFramePending = resolve })
      },
    }
  }
  var account = {
    getProfile: CASE === 'install-fault'
      ? function () { return undefined } // host API drift: not a promise
      : function () {
          if (CASE === 'desktop') window.__profileReads++
          return Promise.resolve({ ok: true, value: { profile: { status: 'ready', value: profile } } })
        },
    watch: CASE === 'desktop'
      ? function () { return { [Symbol.asyncIterator]: accountFrames } }
      : undefined,
  }
  var remote = {
    $stream: function () {
      var stream = { dispose: function () {} }
      stream[Symbol.asyncIterator] = function () { return accountFrames() }
      return stream
    },
    $on: function () { return function () {} },
  }
  // The host's permission catalog: the configured presets, plus the live Auto
  // review preset only while the auto-review integration is registered, plus
  // the auto mode plugin's own preset in the cases that model it installed
  // (with a declared glyph in one of them, without one in the other). The
  // no-auto-review case models the plugin being disabled.
  var configuredPresetOptions = [
    { value: 'read-only', name: 'Read Only', description: 'read only' },
    { value: 'workspace-write', name: 'Workspace Write', description: 'workspace write' },
    { value: 'danger-full-access', name: 'Full access', description: 'full access' },
  ]
  // What each case's host catalog carries on top of the configured presets, and
  // the preset its session runs. Every case not listed here keeps the live Auto
  // review preset, which is the shipped shape; the auto mode cases model the
  // third-party tier being installed (with a declared glyph in one of them, and
  // together with the built-in one in the hero case, where the slot has to
  // choose). The conversation cases drive the popover, the hero case the
  // segment group.
  var PERMISSION_FIXTURES = {
    'no-auto-review': { extras: [], current: null },
    automode: { extras: [{ value: 'auto-mode', name: 'Auto mode', description: 'classified' }], current: 'workspace-write' },
    'automode-current': {
      extras: [{ value: 'auto-mode', name: 'Auto mode', description: 'classified', icon: 'M9 3 5 9h2l-1 5 4-6H8l1-5Z' }],
      current: 'auto-mode',
    },
    'automode-hero': {
      extras: [{ value: 'auto-mode', name: 'Auto mode', description: 'classified' }, { value: 'auto', name: 'Auto review' }],
      current: 'auto-mode',
    },
    'automode-roundtrip': {
      extras: [{ value: 'auto-mode', name: 'Auto mode', description: 'classified' }],
      current: 'workspace-write',
    },
  }
  var permissionFixture = PERMISSION_FIXTURES[CASE]
  var catalogExtras = permissionFixture === undefined ? [{ value: 'auto', name: 'Auto review' }] : permissionFixture.extras
  var permissionPresets = {
    catalog: function () {
      return Promise.resolve({
        ok: true,
        value: {
          options: configuredPresetOptions.concat(catalogExtras),
          defaultOptions: configuredPresetOptions,
          defaultPreset: 'workspace-write',
        },
      })
    },
  }
  // Host API drift at sync time: a session list that throws, which only the
  // permission control reads on every pass. The auto mode cases carry a real
  // session instead: the control reads the running preset from its projection
  // and switches through the host permission command; the case asserts both.
  var permissionCommands = []
  var sessions = CASE === 'sync-fault'
    ? { list: { getSnapshot: function () { throw new Error('session list unavailable') } }, binding: function () { return null } }
    : (permissionFixture !== undefined && permissionFixture.current !== null ? {
        list: { getSnapshot: function () { return { current: 'smoke-session' } } },
        binding: function () {
          return {
            session: {
              projections: {
                faceOf: function () {
                  return { getSnapshot: function () { return { currentValue: permissionFixture.current } } }
                },
              },
              command: function (line) { permissionCommands.push(line) },
            },
          }
        },
      } : undefined)
  var forms = {
    get: function () { return form },
    // The served-namespace mirror: the skin binds only a namespace listed here.
    describe: function () {
      return { getSnapshot: function () { return { view: { namespaces: [{ ns: 'ui-skin-claude-style' }] } } } }
    },
  }
  window.__ctx = {
    fiber: { entry: { id: 'ui-skin-claude-style' } },
    get: function (name) {
      if (name === 'configForms') return forms
      if (name === 'remote.account') return account
      if (name === 'remote.permissionPresets') return permissionPresets
      if (name === 'remote') return CASE === 'desktop' ? remote : undefined
      if (name === 'sessions') return sessions
      return undefined
    },
    effect: function (fn) { window.__dispose = fn() },
  }
  window.__permissionCommands = permissionCommands
  // The desktop account service mounts after this plugin does, so the skin waits
  // for it through ctx.inject; the other cases keep no inject, which is what
  // makes them read synchronously at install (the install-fault case depends on
  // that read throwing).
  if (CASE === 'desktop') {
    window.__ctx.inject = function (deps, cb) {
      var disposers = []
      cb({
        effect: function (fn) {
          var dispose = fn()
          if (typeof dispose === 'function') disposers.push(dispose)
          return dispose
        },
        get: function (name) { return window.__ctx.get(name) },
      })
      return {
        dispose: function () {
          for (var i = disposers.length - 1; i >= 0; i--) {
            try { disposers[i]() } catch (error) { /* already stopped */ }
          }
        },
      }
    }
  }
  // The host's two statistics dialogs. They mount on the pill's own click, and
  // the host commits them on its own schedule: the delay here is longer than the
  // skin's read window used to be, so a read that gives up early loses the
  // section (the 'card drops to Token usage only' bug).
  var STATS_DIALOG_DELAY_MS = 500
  function mountStatsDialog(pill) {
    var kind = pill.getAttribute('data-stats-kind')
    var dialog = document.createElement('div')
    dialog.setAttribute('role', 'dialog')
    dialog.setAttribute('aria-label', kind === 'details' ? '会话统计' : 'Token 用量')
    var list = document.createElement('dl')
    list.setAttribute(kind === 'details' ? 'data-session-stats-details' : 'data-session-stats-usage', '')
    list.innerHTML = kind === 'details'
      ? '<dt>模型用时</dt><dd>1.2s</dd><dt>工具调用用时</dt><dd>0.4s</dd>'
      : '<dt>缓存命中</dt><dd>90%</dd><dt>输出</dt><dd>105 tok</dd>'
    dialog.appendChild(list)
    document.body.appendChild(dialog)
    return dialog
  }
  var statsPills = document.querySelectorAll('[data-composer-stats] button[aria-haspopup="dialog"]')
  for (var sp = 0; sp < statsPills.length; sp++) {
    (function (pill, index) {
      pill.setAttribute('data-stats-kind', index === 0 ? 'details' : 'usage')
      var dialog = null
      var timer = null
      var presses = 0
      pill.addEventListener('click', function () {
        if (dialog !== null) {
          if (dialog.parentElement) dialog.parentElement.removeChild(dialog)
          dialog = null
          pill.setAttribute('aria-expanded', 'false')
          return
        }
        // The host re-renders the row on its own schedule, and a press that lands
        // on a node React has since replaced goes nowhere: the second pill's first
        // press is swallowed here, and the skin has to press the live node again.
        if (index === 1 && presses++ === 0) return
        pill.setAttribute('aria-expanded', 'true')
        if (timer) clearTimeout(timer)
        timer = setTimeout(function () {
          timer = null
          if (pill.getAttribute('aria-expanded') === 'true') dialog = mountStatsDialog(pill)
        }, STATS_DIALOG_DELAY_MS)
      })
    })(statsPills[sp], sp)
  }
  var react = {
    createElement: function () { return null },
    useState: function (v) { return [v, function () {}] },
    useEffect: function () {},
    useRef: function (v) { return { current: v } },
  }
  window.__ModuleLoader__ = {
    load: function (def) {
      window.__skin = def.factory(function (name) {
        if (name === 'react') return react
        throw new Error('no module ' + name)
      })
    },
  }
})()`

/** Runs in the page after the bundle: applies the skin and reports. */
const PROBE = `(function () {
  window.__applyError = null
  try { window.__skin.apply(window.__ctx) } catch (e) { window.__applyError = String((e && e.stack) || e) }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms) }) }
  function attrs(el) { return el ? Array.prototype.map.call(el.attributes, function (a) { return a.name }) : null }
  window.__smoke = (async function () {
    var r = { applyError: window.__applyError, teardownRegistered: typeof window.__dispose === 'function' }
    // The account menu is counted by content (its Sign out row), because the
    // model picker keeps a hidden role=menu portal in the page.
    function accountMenuOpen() {
      var menus = document.querySelectorAll('body > [role="menu"]')
      for (var mi = 0; mi < menus.length; mi++) {
        var items = menus[mi].querySelectorAll('[role="menuitem"]')
        for (var ii = 0; ii < items.length; ii++) {
          if ((items[ii].textContent || '').trim() === 'Sign out') return true
        }
      }
      return false
    }
    if (window.SMOKE_CASE === 'sync-fault') {
      // A sync is retired after failing three passes in a row: drive four.
      for (var n = 0; n < 4; n++) { document.body.appendChild(document.createElement('i')); await sleep(80) }
    }
    if (window.SMOKE_CASE === 'desktop') {
      // The footer entries are hidden in place from the first pass: nothing in
      // this case has opened the drawer yet, so this read is the state a fresh
      // page shows beside the account row. (The first pass runs on a frame.)
      await sleep(500)
      r.footerEntriesBeforeOpen = Array.prototype.map.call(
        document.querySelectorAll('[class*="footerActions"] [data-slot] > *'),
        function (entry) {
          return {
            hidden: entry.hasAttribute('data-dsh-claude-footer-hidden'),
            display: getComputedStyle(entry).display,
          }
        })
      // The first login frame makes the skin read the profile once.
      window.__pushAccountFrame({ status: 'credential-stored', attempt: { phase: 'succeeded', id: 'smoke-1' } })
      await sleep(500)
      r.profileReadsAfterFirst = window.__profileReads
      // The same state again (a reconnect): no second read.
      window.__pushAccountFrame({ status: 'credential-stored', attempt: { phase: 'succeeded', id: 'smoke-1' } })
      await sleep(500)
      r.profileReadsAfterRepeat = window.__profileReads
      // The host's own account row is the entry: visible, and the skin builds
      // neither a trigger nor a popover of its own.
      var hostRow = document.getElementById('host-account')
      r.hostRowDisplay = hostRow ? getComputedStyle(hostRow).display : null
      r.hostRowVisible = !!(hostRow && hostRow.getBoundingClientRect().width > 0)
      r.syntheticBtn = !!document.querySelector('.dsh-claude-account-btn')
      var triggerRow = document.querySelector('[class*="footArea"] [class*="triggerRow"]')
      r.triggerRowDisplay = triggerRow ? getComputedStyle(triggerRow).display : null
      r.hostRowText = hostRow ? (hostRow.textContent || '').trim() : null
      r.hostRowWidth = hostRow ? hostRow.getBoundingClientRect().width : null
      r.accountWidthVar = document.body.style.getPropertyValue('--dsh-claude-account-width').trim()
      // The hover preference is on in this stand-in: a pointer dwelling on the
      // host's account row opens the host menu, and leaving it dismisses the
      // menu the host had mounted.
      if (hostRow) hostRow.dispatchEvent(new MouseEvent('mouseenter'))
      await sleep(250)
      r.hoverOpenedMenu = accountMenuOpen()
      if (hostRow) hostRow.dispatchEvent(new MouseEvent('mouseleave'))
      await sleep(350)
      r.hoverClosedMenu = !accountMenuOpen()
      var styleEl = document.getElementById('dsh-claude-style-style')
      var cssText = styleEl ? styleEl.textContent : ''
      r.menuEntryKeyframes = cssText.indexOf('@keyframes dsh-claude-account-menu-in') !== -1
      r.menuEntryAnimation = cssText.indexOf('animation: dsh-claude-account-menu-in 0.15s ease') !== -1
      // Open the host's own menu; the skin injects our container into its list.
      if (hostRow) hostRow.click()
      await sleep(500)
      var viewport = document.querySelector('body > [role="menu"] [role="presentation"]')
      var inject = document.querySelector('.dsh-claude-account-inject')
      // The marker the stylesheet hangs the skin's card on. It sits on the
      // host's own role=menu card, derived from the list it injected into so a
      // hidden menu portal elsewhere in the page cannot answer for it.
      var accountMenu = viewport ? viewport.closest('[role="menu"]') : null
      r.accountMenuMarked = !!(accountMenu && accountMenu.hasAttribute('data-dsh-claude-account-menu'))
      r.menuCardWidth = accountMenu ? accountMenu.getBoundingClientRect().width : null
      r.injectInViewport = !!(viewport && inject && inject.parentElement === viewport)
      r.injectFirst = !!(viewport && viewport.firstElementChild === inject)
      r.injectRows = inject ? Array.prototype.map.call(inject.children, function (c) {
        if (c.hasAttribute('data-dsh-claude-ban-row')) return 'header'
        if (c.hasAttribute('data-action-index')) return 'action'
        if (c.hasAttribute('data-embed-index')) return 'embed'
        return 'other'
      }) : null
      var injectName = inject ? inject.querySelector('.dsh-claude-account-popover-name') : null
      r.injectName = injectName ? injectName.textContent : null
      var htmlBefore = inject ? inject.innerHTML : null
      // React re-renders the list: the host empties the viewport and puts its own
      // rows back. The skin must re-insert our container, unchanged, first.
      window.__rerenderHostMenu()
      await sleep(400)
      var viewport2 = document.querySelector('body > [role="menu"] [role="presentation"]')
      var inject2 = document.querySelector('.dsh-claude-account-inject')
      r.injectHealedFirst = !!(viewport2 && inject2 && viewport2.firstElementChild === inject2)
      r.injectHealedSame = !!(inject2 && inject2.innerHTML === htmlBefore)
      // The host's keyboard walk reaches our injected button.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }))
      await sleep(80)
      var focused = document.activeElement
      r.focusInInjected = !!(focused && inject2 && inject2.contains(focused) && focused.tagName === 'BUTTON')
      // Closing the host's menu (its own Escape) leaves no container behind.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
      await sleep(400)
      r.injectAfterClose = document.querySelectorAll('.dsh-claude-account-inject').length
      r.accountMenuMarkAfterClose = document.querySelectorAll('[data-dsh-claude-account-menu]').length
      // The model picker keeps a hidden role=menu portal in the page, so the
      // account menu is counted by content (its Sign out row), not by role.
      r.hostMenuAfterClose = Array.prototype.filter.call(document.querySelectorAll('body > [role="menu"]'), function (m) {
        var items = m.querySelectorAll('[role="menuitem"]')
        for (var mi = 0; mi < items.length; mi++) {
          if ((items[mi].textContent || '').trim() === 'Sign out') return true
        }
        return false
      }).length
      // Ctrl+, opens the host's settings dialog through the account menu.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: ',', ctrlKey: true, bubbles: true, cancelable: true }))
      await sleep(700)
      r.dialogAfterShortcut = document.querySelectorAll('[class*="settingsArea"] [role="dialog"]').length
    }
    await sleep(1200)
    var from = window.__passes
    await sleep(1000)
    r.idlePasses = window.__passes - from
    // The stats row's host mode and the two structures' treatment. Detailed
    // gets the merged sentence (icons hidden, our separator); compact keeps the
    // host's icon readings and spacing and opens no card.
    var statsRoot = document.querySelector('[data-composer-stats]')
    r.statsMode = statsRoot ? statsRoot.getAttribute('data-dsh-claude-stats-mode') : null
    r.statsIcons = statsRoot ? Array.prototype.map.call(statsRoot.querySelectorAll('svg'), function (svg) {
      return getComputedStyle(svg).display
    }) : null
    var statsSpans = statsRoot ? statsRoot.children : null
    r.statsSep = statsSpans && statsSpans.length > 1 ? getComputedStyle(statsSpans[1], '::before').content : null
    if (window.SMOKE_CASE === 'stats-compact' && statsRoot) {
      // Dwell past the 300 ms hover delay: a compact row has no trigger to read.
      statsRoot.dispatchEvent(new MouseEvent('mouseenter'))
      await sleep(450)
    }
    r.statsOpen = document.querySelectorAll('.dsh-claude-stats-popover[data-open="true"]').length
    if (window.SMOKE_CASE === 'stats-compact' && statsRoot) {
      statsRoot.dispatchEvent(new MouseEvent('mouseleave'))
      await sleep(150)
    }
    // The session list's leading seat. The host's newer rows render it through a
    // slot outlet, so an idle row's seat is not :empty — the circle has to hang
    // on the empty outlet anchor. A seat carrying the running status dot keeps
    // its own paint and gets no circle.
    var seats = document.querySelectorAll('[class*="sessionRow"] [class*="slot"]')
    function seatState(seat) {
      if (!seat) return null
      var outlet = seat.querySelector(':scope > [data-slot]')
      var target = outlet !== null ? outlet : seat
      var after = getComputedStyle(target, '::after')
      return { content: after.content, width: after.width, border: after.borderTopWidth, svgs: seat.querySelectorAll('svg').length }
    }
    r.seatIdle = seatState(seats[0])
    r.seatRunning = seatState(seats[1])
    if (window.SMOKE_CASE === 'default' && statsRoot) {
      // The host's panels mount on its own commit, later than the skin's old
      // read window: both sections must still reach the card.
      statsRoot.dispatchEvent(new MouseEvent('mouseenter'))
      await sleep(2600)
      r.statsCardOpen = document.querySelectorAll('.dsh-claude-stats-popover[data-open="true"]').length
      r.statsCardSections = Array.prototype.map.call(document.querySelectorAll('.dsh-claude-stats-popover-section'), function (s) {
        return (s.textContent || '').trim()
      })
      r.statsCardLabels = Array.prototype.map.call(document.querySelectorAll('.dsh-claude-stats-popover-label'), function (s) {
        return (s.textContent || '').trim()
      })
      statsRoot.dispatchEvent(new MouseEvent('mouseleave'))
      await sleep(300)
    }
    var drawer = document.querySelector('.dsh-claude-account-popover-body')
    r.drawer = drawer ? Array.prototype.map.call(drawer.children, function (c) {
      if (c.hasAttribute('data-action-index')) return 'action'
      if (c.hasAttribute('data-embed-index')) return 'embed'
      if (c.getAttribute('data-action') === 'settings') return 'settings'
      return 'other'
    }) : null
    var syntheticPopover = document.querySelector('.dsh-claude-account-popover')
    r.syntheticHeader = !!(syntheticPopover && syntheticPopover.querySelector('[data-dsh-claude-ban-row]'))
    // The closed drawer's rows are built and reconciled while it is closed, so
    // the panel sits over the account row with its icons in it: visibility has
    // to take that content out of the paint and hit-test tree.
    r.syntheticVisibility = syntheticPopover ? getComputedStyle(syntheticPopover).visibility : null
    r.syntheticRowVisibility = syntheticPopover && syntheticPopover.querySelector('.dsh-claude-popover-item')
      ? getComputedStyle(syntheticPopover.querySelector('.dsh-claude-popover-item')).visibility
      : null
    // offsetLeft/offsetWidth, not the rect: the closed drawer still carries its
    // translateY/scale transition, which would shrink a measured rect.
    var syntheticBtn = document.querySelector('.dsh-claude-account-btn')
    r.syntheticBox = (syntheticPopover && syntheticBtn) ? {
      popoverLeft: syntheticPopover.offsetLeft,
      popoverWidth: syntheticPopover.offsetWidth,
      buttonLeft: syntheticBtn.offsetLeft,
      buttonWidth: syntheticBtn.offsetWidth,
    } : null
    r.syntheticInject = document.querySelectorAll('.dsh-claude-account-inject').length
    var user = document.querySelector('.dsh-claude-account-user')
    r.accountUser = user ? user.textContent : null
    var avatar = document.querySelector('.dsh-claude-account-avatar')
    r.avatarAttrs = attrs(avatar)
    var photo = avatar ? avatar.querySelector('img') : null
    r.photo = photo ? { attrs: attrs(photo), referrerPolicy: photo.referrerPolicy } : null
    // The launcher's own skin, when the instance has one: a canvas cropped out
    // of the texture the host serves, sampled at the landmarks the fixture
    // carries so a wrong crop cannot pass.
    r.skinFlag = r.avatarAttrs !== null && r.avatarAttrs.indexOf('data-dsh-claude-skin') !== -1
    // The mask's shape: the head is drawn to the box's edges, so it must not be
    // rounded off the way the photo path's circle is.
    r.avatarRadius = avatar ? getComputedStyle(avatar).borderRadius : null
    var skinHead = avatar ? avatar.querySelector('canvas.dsh-claude-account-skin') : null
    r.skinCanvas = skinHead ? { width: skinHead.width, height: skinHead.height } : null
    r.skinPixels = null
    if (skinHead) {
      var skinContext = skinHead.getContext('2d')
      var pixelAt = function (x, y) {
        var data = skinContext.getImageData(x, y, 1, 1).data
        return [data[0], data[1], data[2], data[3]]
      }
      r.skinPixels = { face: pixelAt(32, 32), hatTop: pixelAt(2, 2), hatBottom: pixelAt(62, 62), margin: pixelAt(62, 30) }
    }
    var mirrored = drawer ? drawer.querySelector('[data-action-index]') : null
    r.mirroredText = mirrored ? mirrored.querySelector('.dsh-claude-popover-item-text').textContent : null
    var badge = mirrored ? mirrored.querySelector('.dsh-claude-popover-item-badge') : null
    r.mirroredBadge = badge ? badge.textContent : null
    r.stylesheet = !!document.getElementById('dsh-claude-style-style')
    // This stand-in host never carries the Windows titlebar marker, so the
    // skin must leave the body marker off and keep its measured placement.
    r.titlebarTabs = document.body.hasAttribute('data-dsh-titlebar-tabs')
    r.footerTakeover = document.body.hasAttribute('data-dsh-claude-footer-takeover')
    r.composerRestyle = document.body.hasAttribute('data-dsh-claude-composer-active')
    // The host's own access-mode button: the permission control stands in for
    // it while installed, and hands it back when switched off.
    var hostAccess = document.querySelector('button[aria-label^="Access mode"]')
    r.hostAccessVisible = hostAccess !== null && getComputedStyle(hostAccess).display !== 'none'
    // The permission ladder follows the host's catalog: a preset it does not
    // serve has no row at all, and one a plugin adds (the auto mode plugin's)
    // gets its own. Each row's shape is read so the names, the glyphs and the
    // active mark can be asserted.
    function permRowState(it) {
      return {
        preset: it.getAttribute('data-preset'),
        display: getComputedStyle(it).display,
        text: (it.textContent || '').trim(),
        active: it.hasAttribute('data-active'),
        glyphs: it.querySelectorAll('svg').length,
      }
    }
    var permAutoPopoverRow = document.querySelector('.dsh-claude-perm-popover [data-preset="auto"]')
    var permAutoSegment = document.querySelector('.dsh-claude-segment[data-preset="auto"]')
    r.permAutoRowDisplay = permAutoPopoverRow !== null ? getComputedStyle(permAutoPopoverRow).display : null
    r.permAutoSegmentDisplay = permAutoSegment !== null ? getComputedStyle(permAutoSegment).display : null
    r.permRows = Array.prototype.map.call(document.querySelectorAll('.dsh-claude-perm-popover [data-preset]'), permRowState)
    var permLabelEl = document.querySelector('.dsh-claude-perm-label')
    r.permLabel = permLabelEl === null ? null : permLabelEl.textContent
    r.permSegments = Array.prototype.map.call(document.querySelectorAll('.dsh-claude-segment'), function (it) {
      return { preset: it.getAttribute('data-preset'), text: it.textContent, active: it.hasAttribute('data-active') }
    })
    // The pick path, end to end: switch to the auto mode tier and read what the
    // control sent the session (the host's permission command line).
    var autoModeRow = document.querySelector('.dsh-claude-perm-popover [data-preset="auto-mode"]')
    if (autoModeRow !== null) {
      autoModeRow.click()
      await sleep(80)
    }
    r.permissionCommands = window.__permissionCommands.slice()
    // A round trip through the home view: the hero layout takes the trigger and
    // its popover out of the tree, and coming back builds a fresh, empty one
    // that has to be filled again.
    if (window.SMOKE_CASE === 'automode-roundtrip') {
      var wakePass = function () {
        var node = document.createElement('span')
        document.body.appendChild(node)
        document.body.removeChild(node)
      }
      var composerCard = document.querySelector('[data-composer-card]')
      r.rowsBeforeHome = Array.prototype.map.call(document.querySelectorAll('.dsh-claude-perm-popover [data-preset]'), function (it) {
        return it.getAttribute('data-preset')
      })
      composerCard.setAttribute('data-phase', 'hero')
      wakePass()
      await sleep(250)
      r.segmentsInHome = Array.prototype.map.call(document.querySelectorAll('.dsh-claude-segment'), function (it) {
        return it.getAttribute('data-preset')
      })
      r.popoversInHome = document.querySelectorAll('.dsh-claude-perm-popover').length
      composerCard.removeAttribute('data-phase')
      wakePass()
      await sleep(250)
      r.rowsAfterReturn = Array.prototype.map.call(document.querySelectorAll('.dsh-claude-perm-popover [data-preset]'), function (it) {
        return it.getAttribute('data-preset')
      })
    }
    // The host's own account row, when the host has one: the skin marks it and
    // repaints it as a Claude row, so the teardown has to hand it back exactly as
    // the host rendered it (D12).
    r.hostRowPresent = document.getElementById('host-account') !== null
    var hostRowAtRest = document.getElementById('host-account')
    r.hostRowMarked = !!(hostRowAtRest && hostRowAtRest.hasAttribute('data-dsh-claude-account-host-row'))
    var banRow = document.querySelector('[data-dsh-claude-ban-row]')
    if (banRow) banRow.click()
    var toast = document.querySelector('.dsh-claude-ban-toast-text')
    r.banToast = toast ? toast.textContent : null
    var dismiss = document.querySelector('.dsh-claude-ban [data-dsh-ban-dismiss]')
    if (dismiss) dismiss.click()
    var editor = document.getElementById('editor')
    editor.focus()
    editor.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
    r.keys = window.__keys.slice()
    await sleep(50)
    r.pwned = window.__pwned
    r.errors = window.__errors.slice()
    if (r.teardownRegistered) {
      // Dispose with a pass pending, the way a live page is disposed mid-stream:
      // the mutation's observer callback runs before the await resumes, so a
      // frame is already requested when the teardown starts.
      document.body.appendChild(document.createElement('i'))
      await Promise.resolve()
      window.__dispose()
      var before = window.__passes
      document.body.appendChild(document.createElement('i'))
      await sleep(200)
      r.passesAfterTeardown = window.__passes - before
      r.leftNodes = document.querySelectorAll('[class*="dsh-claude-"]').length
      r.leftMarkers = document.querySelectorAll('[data-dsh-claude-footer-entry], [data-dsh-claude-footer-hidden], [data-dsh-claude-footer-overlay], [data-dsh-claude-model-host], [data-dsh-claude-account-host-row], [data-dsh-claude-stats-mode]').length
      r.leftAttrs = Array.prototype.filter.call(document.body.attributes, function (a) { return /^data-dsh-(claude|window)/.test(a.name) }).map(function (a) { return a.name })
      r.leftStylesheet = !!document.getElementById('dsh-claude-style-style')
      var hostRowEnd = document.getElementById('host-account')
      r.hostRowEnd = hostRowEnd === null ? null : {
        visibility: getComputedStyle(hostRowEnd).visibility,
        pointerEvents: getComputedStyle(hostRowEnd).pointerEvents,
        display: getComputedStyle(hostRowEnd).display,
        width: hostRowEnd.getBoundingClientRect().width,
      }
    }
    return r
  })()
})()`

/** The stand-in page for one case: host footer, host composer, then the bundle. */
function page(name) {
  // The desktop footer mirrors 0.1.7's: the account menu lives in the
  // `settings.launcher` slot inside the host's `triggerRow`, and the settings
  // button the web-style footer has is gone. Every other case keeps the
  // web-style footer unchanged.
  var footerActions = '<div class="_x_footerActions_1"><div data-slot="sidebar.footer.action"><button id="plugin-action" aria-label="Cost meter" data-cordis-badge="3"><svg viewBox="0 0 8 8"><circle cx="4" cy="4" r="3"></circle></svg></button><div class="_p_balance_1" role="group"><span>Balance 10.07</span><div role="progressbar" aria-valuenow="40"></div></div></div></div>'
  var footer = name === 'desktop'
    ? '<div class="_x_footArea_1">' + footerActions +
        '<div class="_x_settingsArea_1"><div data-slot="sidebar.settings"><div class="_s_triggerRow_1">' +
          '<div data-slot="settings.launcher"><div class="_a_root_1"><span>' +
            '<button id="host-account" aria-label="Account menu" aria-haspopup="menu" aria-expanded="false">Ada</button>' +
          '</span></div></div>' +
          '<button aria-label="Retry update">Retry update</button>' +
        '</div></div></div>' +
      '</div>'
    : '<div class="_x_footArea_1">\n' +
        '  <div class="_x_settingsArea_1"><button aria-haspopup="dialog">Settings</button></div>\n' +
        '  ' + footerActions + '\n' +
      '</div>'
  // The host's statistics row (ui-chat StatsPills) in each of its two shapes.
  // Detailed wraps each pill in an anchor span and makes the dialog-carrying
  // ones buttons; compact renders bare icon+reading spans with no trigger. The
  // skin must leave compact's icons and spacing alone and keep its own merged
  // sentence for detailed.
  var stats = name === 'stats-compact'
    ? '<div data-composer-stats>' +
        '<span class="_p_pill_1"><svg viewBox="0 0 16 16" width="14" height="14"></svg>20 tok/s</span>' +
        '<span class="_p_pill_1"><svg viewBox="0 0 16 16" width="14" height="14"></svg>Cache hit 90%</span>' +
      '</div>'
    : '<div data-composer-stats>' +
        '<span class="_a_anchor_1"><button type="button" class="_p_pill_1" aria-haspopup="dialog" aria-expanded="false" aria-label="1 turns 1 steps">' +
          '<svg viewBox="0 0 16 16" width="14" height="14"></svg><span class="_l_label_1">1 turns 1 steps</span></button></span>' +
        '<span class="_a_anchor_1"><button type="button" class="_p_pill_1" aria-haspopup="dialog" aria-expanded="false" aria-label="105 tok · Cache hit 90%">' +
          '<svg viewBox="0 0 16 16" width="14" height="14"></svg><span class="_l_label_1">105 tok · Cache hit 90%</span></button></span>' +
      '</div>'
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>dsh-claude-style smoke: ${name}</title></head>
<body>
${footer}
<div class="_x_treeBody_1" role="tree">
  <div class="_x_sessionRow_1" role="treeitem"><span class="_x_slot_1"><div data-slot="sidebar.session.row.leading" style="display:contents"></div></span><span class="_x_title_1">idle session</span></div>
  <div class="_x_sessionRow_1" role="treeitem"><span class="_x_slot_1"><svg data-state="ongoing" viewBox="0 0 16 16" width="10" height="10"></svg></span><span class="_x_title_1">running session</span></div>
</div>
<div data-composer-card${name === 'automode-hero' ? ' data-phase="hero"' : ''}>
  <div class="_x_toolbar_1"><button aria-label="Access mode: Edit">Edit</button></div>
  <div data-composer-input contenteditable="true" id="editor">/comp</div>
  <button aria-label="Send" id="send">Send</button>
</div>
${stats}
<script>window.SMOKE_CASE = ${JSON.stringify(name)}</script>
<script>${STAND_IN}</script>
<script src="/client.js"></script>
<script>${PROBE}</script>
</body></html>`
}

/** Checks every case shares: a clean teardown and an idle scheduler. */
function commonChecks(r) {
  check('the idle session seat draws the status circle through the slot outlet',
    r.seatIdle !== null && r.seatIdle.content !== 'none' && r.seatIdle.width === '5px',
    JSON.stringify(r.seatIdle))
  check('a seat carrying the running status dot draws no circle',
    r.seatRunning !== null && r.seatRunning.content === 'none' && r.seatRunning.svgs > 0,
    JSON.stringify(r.seatRunning))
  check('scheduler idle once settled (0 passes in 1 s)', r.idlePasses === 0, `${r.idlePasses} passes`)
  check('no Windows titlebar marker: the body carries no data-dsh-titlebar-tabs',
    r.titlebarTabs === false, JSON.stringify(r.titlebarTabs))
  check('teardown registered with the host', r.teardownRegistered)
  if (!r.teardownRegistered) return
  check('teardown leaves no skin node, marker, body attribute or stylesheet',
    r.leftNodes === 0 && r.leftMarkers === 0 && r.leftAttrs.length === 0 && !r.leftStylesheet,
    `nodes ${r.leftNodes}, markers ${r.leftMarkers}, attrs ${JSON.stringify(r.leftAttrs)}, stylesheet ${r.leftStylesheet}`)
  check('no pass runs after teardown', r.passesAfterTeardown === 0, `${r.passesAfterTeardown} passes`)
  check("the host's own account row is handed back visible and clickable",
    !r.hostRowPresent || (r.hostRowEnd !== null && r.hostRowEnd.visibility === 'visible' &&
      r.hostRowEnd.pointerEvents === 'auto' && r.hostRowEnd.display !== 'none' && r.hostRowEnd.width > 0),
    JSON.stringify(r.hostRowEnd))
}

const CASES = {
  default(r) {
    check('apply() completes', r.applyError === null, r.applyError)
    check('stylesheet injected', r.stylesheet)
    check('no feature reported a failure', r.errors.length === 0, r.errors.join(' | '))
    check('detailed stats keep the merged sentence: host icons hidden, our separator in',
      r.statsMode === 'detailed' && r.statsIcons !== null && r.statsIcons.length === 2 &&
        r.statsIcons.every((d) => d === 'none') && r.statsSep !== null && r.statsSep.indexOf('·') !== -1,
      JSON.stringify({ mode: r.statsMode, icons: r.statsIcons, sep: r.statsSep }))
    check('synthetic path: the popover carries the header, the plugin rows and the settings row',
      r.drawer !== null && same(r.drawer, ['action', 'embed', 'settings']) && r.syntheticHeader === true,
      JSON.stringify({ drawer: r.drawer, header: r.syntheticHeader }))
    check('synthetic path injects nothing into a host menu', r.syntheticInject === 0, `${r.syntheticInject} containers`)
    check('account row names the signed-in profile', r.accountUser === 'Ada', JSON.stringify(r.accountUser))
    check('avatar is an <img> sent without a referrer', r.photo !== null && r.photo.referrerPolicy === 'no-referrer', JSON.stringify(r.photo))
    check('without a launcher skin the avatar keeps its round mask', r.avatarRadius === '50%', JSON.stringify(r.avatarRadius))
    check('the self-built drawer matches the account row box',
      r.syntheticBox !== null && r.syntheticBox.popoverLeft === r.syntheticBox.buttonLeft &&
        r.syntheticBox.popoverWidth === r.syntheticBox.buttonWidth,
      JSON.stringify(r.syntheticBox))
    check('Enter on an open composer menu reaches the host', same(r.keys, ['host picked the menu item']), JSON.stringify(r.keys))
    check("the permission control stands in for the host's access button", r.composerRestyle && !r.hostAccessVisible,
      JSON.stringify({ restyle: r.composerRestyle, hostAccess: r.hostAccessVisible }))
    check('the permission ladder is the catalog, in the skin order',
      same(r.permRows.map(function (row) { return row.preset }), ['read-only', 'workspace-write', 'auto', 'danger-full-access']),
      JSON.stringify(r.permRows))
    check('the Auto review tier is offered while the catalog carries the preset',
      r.permAutoRowDisplay !== null && r.permAutoRowDisplay !== 'none' &&
        r.permRows[2].text.indexOf('Auto review') === 0,
      JSON.stringify({ popoverRow: r.permAutoRowDisplay, row: r.permRows[2] }))
    check('the stats card keeps both sections when the host panels mount late',
      r.statsCardOpen === 1 && same(r.statsCardSections, ['会话统计', 'Token 用量']),
      JSON.stringify({ open: r.statsCardOpen, sections: r.statsCardSections }))
    check('the late card carries both sections\' rows',
      same(r.statsCardLabels, ['模型用时', '工具调用用时', '缓存命中', '输出']),
      JSON.stringify(r.statsCardLabels))
    check('the closed drawer takes its parked rows out of the paint tree',
      r.syntheticVisibility === 'hidden' && r.syntheticRowVisibility === 'hidden',
      JSON.stringify({ panel: r.syntheticVisibility, row: r.syntheticRowVisibility }))
    commonChecks(r)
  },
  'stats-compact'(r) {
    check('apply() completes', r.applyError === null, r.applyError)
    check('no feature reported a failure', r.errors.length === 0, r.errors.join(' | '))
    check('compact stats carry the skin sentence: icons hidden, our separator in',
      r.statsMode === 'compact' && r.statsIcons !== null && r.statsIcons.length === 2 &&
        r.statsIcons.every((d) => d === 'none') && r.statsSep.indexOf('·') !== -1,
      JSON.stringify({ mode: r.statsMode, icons: r.statsIcons, sep: r.statsSep }))
    check('a hover on compact stats opens no card', r.statsOpen === 0, r.statsOpen + ' open')
    commonChecks(r)
  },
  markup(r) {
    check('apply() completes', r.applyError === null, r.applyError)
    check('no injected markup executed', r.pwned === 0, `${r.pwned} executions`)
    check('account name rendered as text', r.accountUser === MARKUP, JSON.stringify(r.accountUser))
    check('mirrored plugin label and badge rendered as text', r.mirroredText === MARKUP && r.mirroredBadge === MARKUP, JSON.stringify([r.mirroredText, r.mirroredBadge]))
    check('account-hold toast renders the username as text', r.banToast === MARKUP + ': account_banned', JSON.stringify(r.banToast))
    check('avatar URL adds no attribute to the page',
      r.avatarAttrs !== null && r.avatarAttrs.every((a) => a === 'class' || a === 'data-dsh-claude-photo') &&
      (r.photo === null || r.photo.attrs.every((a) => !/^on/i.test(a))), JSON.stringify([r.avatarAttrs, r.photo]))
    commonChecks(r)
  },
  'install-fault'(r) {
    check('apply() completes although the account API is broken', r.applyError === null, r.applyError)
    check('only the account footer was switched off', r.errors.length === 1 && r.errors[0].includes('"footer"'), r.errors.join(' | '))
    check("the host's own footer is handed back", !r.footerTakeover && r.accountUser === null, JSON.stringify({ takeover: r.footerTakeover, row: r.accountUser }))
    check('the rest of the skin keeps running', r.stylesheet && r.composerRestyle && same(r.keys, ['host picked the menu item']))
    commonChecks(r)
  },
  'sync-fault'(r) {
    check('apply() completes', r.applyError === null, r.applyError)
    check('only the permission control was switched off', r.errors.length === 1 && r.errors[0].includes('"permissions"'), r.errors.join(' | '))
    check("the host's own access button is handed back", r.hostAccessVisible === true, JSON.stringify(r.hostAccessVisible))
    check('the composer restyle keeps running', r.composerRestyle === true, JSON.stringify(r.composerRestyle))
    check('the rest of the skin keeps running', r.stylesheet && r.accountUser === 'Ada', JSON.stringify(r.accountUser))
    commonChecks(r)
  },
  'no-auto-review'(r) {
    check('apply() completes', r.applyError === null, r.applyError)
    check('no feature reported a failure', r.errors.length === 0, r.errors.join(' | '))
    check("the permission control stands in for the host's access button", r.composerRestyle && !r.hostAccessVisible,
      JSON.stringify({ restyle: r.composerRestyle, hostAccess: r.hostAccessVisible }))
    check('a preset the catalog does not carry is not drawn at all',
      r.permAutoRowDisplay === null &&
        same(r.permRows.map(function (row) { return row.preset }), ['read-only', 'workspace-write', 'danger-full-access']),
      JSON.stringify(r.permRows))
    check('the rows the catalog does carry stay offered',
      r.permRows.every(function (row) { return row.display !== 'none' }),
      JSON.stringify(r.permRows))
    commonChecks(r)
  },
  desktop(r) {
    check('apply() completes', r.applyError === null, r.applyError)
    check('the footer entries are hidden in place before the drawer is ever opened',
      Array.isArray(r.footerEntriesBeforeOpen) && r.footerEntriesBeforeOpen.length === 2 &&
        r.footerEntriesBeforeOpen.every(function (entry) { return entry.hidden === true && entry.display === 'none' }),
      JSON.stringify(r.footerEntriesBeforeOpen))
    check("the host's own account row stays visible; the skin builds no trigger",
      r.hostRowVisible === true && r.hostRowDisplay !== 'none' && r.syntheticBtn === false,
      JSON.stringify({ visible: r.hostRowVisible, display: r.hostRowDisplay, synthetic: r.syntheticBtn }))
    check('the takeover marks the host account row for the stylesheet',
      r.hostRowMarked === true, JSON.stringify(r.hostRowMarked))
    check('the host trigger row is not hidden', r.triggerRowDisplay !== 'none', JSON.stringify(r.triggerRowDisplay))
    check('the open host account menu carries the skin marker',
      r.accountMenuMarked === true, JSON.stringify(r.accountMenuMarked))
    check("our container is injected as the list's first child",
      r.injectInViewport === true && r.injectFirst === true,
      JSON.stringify({ inViewport: r.injectInViewport, first: r.injectFirst }))
    check('the injected container carries the header and the plugin rows',
      same(r.injectRows, ['header', 'action', 'embed']) && r.injectName === 'Ada',
      JSON.stringify({ rows: r.injectRows, name: r.injectName }))
    check('the injected header names the same user as the host account row',
      r.injectName !== null && r.injectName === r.hostRowText,
      JSON.stringify({ header: r.injectName, row: r.hostRowText }))
    check('the account width variable is the account row box width',
      r.accountWidthVar === Math.round(r.hostRowWidth) + 'px',
      JSON.stringify({ variable: r.accountWidthVar, row: r.hostRowWidth }))
    check('the host menu card is as wide as the account row',
      r.menuCardWidth !== null && Math.round(r.menuCardWidth) === Math.round(r.hostRowWidth),
      JSON.stringify({ card: r.menuCardWidth, row: r.hostRowWidth }))
    check('hovering the host account row opens the host menu; leaving it closes',
      r.hoverOpenedMenu === true && r.hoverClosedMenu === true,
      JSON.stringify({ opened: r.hoverOpenedMenu, closed: r.hoverClosedMenu }))
    check('the host account menu carries the skin entry animation',
      r.menuEntryKeyframes === true && r.menuEntryAnimation === true,
      JSON.stringify({ keyframes: r.menuEntryKeyframes, animation: r.menuEntryAnimation }))
    check('a host re-render is healed: container first and rows unchanged',
      r.injectHealedFirst === true && r.injectHealedSame === true,
      JSON.stringify({ first: r.injectHealedFirst, same: r.injectHealedSame }))
    check("the host's keyboard walk reaches our injected button",
      r.focusInInjected === true, JSON.stringify(r.focusInInjected))
    check('closing the host menu leaves no injected container behind',
      r.injectAfterClose === 0 && r.hostMenuAfterClose === 0,
      JSON.stringify({ containers: r.injectAfterClose, menus: r.hostMenuAfterClose }))
    check('closing the host menu clears the skin marker',
      r.accountMenuMarkAfterClose === 0, JSON.stringify(r.accountMenuMarkAfterClose))
    check('Ctrl+, opens the host dialog', r.dialogAfterShortcut === 1, JSON.stringify(r.dialogAfterShortcut))
    check('the first account frame reads the profile exactly once',
      r.profileReadsAfterFirst === 1, JSON.stringify(r.profileReadsAfterFirst))
    check('a repeated same-state frame reads nothing more',
      r.profileReadsAfterRepeat === 1, JSON.stringify(r.profileReadsAfterRepeat))
    check('no feature reported a failure', r.errors.length === 0, r.errors.join(' | '))
    commonChecks(r)
  },
  // The auto mode cases: the ladder follows the host catalog, so a third-party
  // permission tier is a first-class row.
  automode(r) {
    check('apply() completes', r.applyError === null, r.applyError)
    check('no feature reported a failure', r.errors.length === 0, r.errors.join(' | '))
    check('the ladder takes the catalog, the third-party tier included',
      same(r.permRows.map(function (row) { return row.preset }), ['read-only', 'workspace-write', 'auto-mode', 'danger-full-access']),
      JSON.stringify(r.permRows))
    check('a tier the catalog does not carry is absent, not hidden',
      r.permRows.every(function (row) { return row.preset !== 'auto' }) && r.permAutoRowDisplay === null,
      JSON.stringify(r.permRows))
    check('the tier reads as a Claude name, not as its machine id',
      r.permRows[2].text.indexOf('Auto mode') === 0 && r.permRows[2].text.indexOf('分类器') !== -1 &&
        r.permRows[2].text.indexOf('auto-mode') === -1,
      JSON.stringify(r.permRows[2].text))
    check('the ladder stays one text list: no row draws a glyph',
      r.permRows.every(function (row) { return row.glyphs === 0 }),
      JSON.stringify(r.permRows.map(function (row) { return row.glyphs })))
    check('the running preset reads as its Claude name',
      r.permLabel === 'Accept edits', JSON.stringify(r.permLabel))
    check('picking the tier switches through the host permission command',
      same(r.permissionCommands, ['/permission auto-mode']), JSON.stringify(r.permissionCommands))
    commonChecks(r)
  },
  'automode-current'(r) {
    check('apply() completes', r.applyError === null, r.applyError)
    check('no feature reported a failure', r.errors.length === 0, r.errors.join(' | '))
    check('a session running the third-party tier names it instead of its id',
      r.permLabel === 'Auto mode', JSON.stringify(r.permLabel))
    check('the running tier is marked in the popover',
      r.permRows[2].active === true && r.permRows[0].active === false,
      JSON.stringify(r.permRows.map(function (row) { return [row.preset, row.active] })))
    check("a glyph the deployment declares is left out with the rest of them",
      r.permRows[2].preset === 'auto-mode' && r.permRows[2].glyphs === 0,
      JSON.stringify(r.permRows[2]))
    commonChecks(r)
  },
  'automode-hero'(r) {
    check('apply() completes', r.applyError === null, r.applyError)
    check('no feature reported a failure', r.errors.length === 0, r.errors.join(' | '))
    check('the Auto slot binds to the tier the deployment offers',
      same(r.permSegments.map(function (s) { return s.preset }), ['read-only', 'workspace-write', 'auto-mode', 'danger-full-access']),
      JSON.stringify(r.permSegments))
    check('the slot keeps its Claude label while carrying that tier',
      r.permSegments[2].text === 'Auto' && r.permSegments[2].active === true,
      JSON.stringify(r.permSegments[2]))
    check('the built-in review tier stays out of the slot while the deployment has its own',
      r.permSegments.every(function (s) { return s.preset !== 'auto' }) && r.permAutoSegmentDisplay === null,
      JSON.stringify(r.permSegments))
    commonChecks(r)
  },
  'automode-roundtrip'(r) {
    var ladder = ['read-only', 'workspace-write', 'auto-mode', 'danger-full-access']
    check('apply() completes', r.applyError === null, r.applyError)
    check('no feature reported a failure', r.errors.length === 0, r.errors.join(' | '))
    check('the ladder is drawn in the conversation view', same(r.rowsBeforeHome, ladder), JSON.stringify(r.rowsBeforeHome))
    check('the home view shows it as segments and leaves no popover behind',
      same(r.segmentsInHome, ladder) && r.popoversInHome === 0,
      JSON.stringify({ segments: r.segmentsInHome, popovers: r.popoversInHome }))
    check('returning to the conversation draws the ladder again',
      same(r.rowsAfterReturn, ladder), JSON.stringify(r.rowsAfterReturn))
    commonChecks(r)
  },
  // The launcher cases: the host answers with an account contract, and the
  // avatar circle has to become the player's own head.
  launcher(r) {
    check('apply() completes', r.applyError === null, r.applyError)
    check('no feature reported a failure', r.errors.length === 0, r.errors.join(' | '))
    check('the launcher account names the instance where no custom name is set',
      r.banToast === 'Ada Lambert: account_banned', JSON.stringify(r.banToast))
    check("the launcher's skin draws the head into the avatar circle",
      r.skinCanvas !== null && r.skinCanvas.width === 64 && r.skinFlag === true,
      JSON.stringify({ canvas: r.skinCanvas, flag: r.skinFlag }))
    check('the head takes the box from the account profile picture',
      r.photo === null, JSON.stringify(r.photo))
    check('the head is not cut by a round mask', r.avatarRadius === '0px', JSON.stringify(r.avatarRadius))
    check('the head is the atlas face, inset, with the hat layer over the whole box',
      same(r.skinPixels && r.skinPixels.face, SKIN_FACE) &&
        same(r.skinPixels && r.skinPixels.hatTop, SKIN_HAT) &&
        same(r.skinPixels && r.skinPixels.hatBottom, SKIN_HAT) &&
        same(r.skinPixels && r.skinPixels.margin, [0, 0, 0, 0]),
      JSON.stringify(r.skinPixels))
    commonChecks(r)
  },
  'launcher-noskin'(r) {
    check('apply() completes', r.applyError === null, r.applyError)
    check('the launcher account still names the instance',
      r.banToast === 'Ada Lambert: account_banned', JSON.stringify(r.banToast))
    check('a launcher figure with no picture leaves the circle to the profile',
      r.skinCanvas === null && r.skinFlag === false && r.photo !== null,
      JSON.stringify({ canvas: r.skinCanvas, flag: r.skinFlag, photo: r.photo }))
    commonChecks(r)
  },
  'launcher-broken'(r) {
    check('apply() completes', r.applyError === null, r.applyError)
    check('a picture that never arrives falls back to the profile photo, not an empty circle',
      r.skinCanvas === null && r.skinFlag === false && r.photo !== null,
      JSON.stringify({ canvas: r.skinCanvas, flag: r.skinFlag, photo: r.photo }))
    commonChecks(r)
  },
}

/**
 * The launcher contract each browser case is served, keyed by case name. A case
 * missing here reads as "no launcher published an account", which is what every
 * other case checks. `hasSkin` is what the host advertises, `picture` what the
 * skin route answers: they differ in `launcher-broken`, standing for a file
 * that is no longer there.
 */
const LAUNCHER = {
  launcher: { name: 'Ada Lambert', vendor: 'deepseek', kind: 'official', skin: 'local', skinModel: 'default', hasSkin: true, picture: true },
  'launcher-noskin': { name: 'Ada Lambert', vendor: 'deepseek', kind: 'offline', skin: 'default', skinModel: 'default', hasSkin: false, picture: false },
  'launcher-broken': { name: 'Ada Lambert', vendor: 'deepseek', kind: 'official', skin: 'local', skinModel: 'default', hasSkin: true, picture: false },
}

/** Load one case in a fresh tab and return the page's report. */
async function runCase(port, base, name) {
  const tab = await connectTab(port)
  try {
    await tab.send('Page.enable')
    await tab.send('Page.navigate', { url: `${base}/${name}` })
    for (let i = 0; i < 100; i++) {
      const out = await tab.send('Runtime.evaluate', { expression: 'window.__smoke', awaitPromise: true, returnByValue: true })
      const result = out.result && out.result.result
      if (result && result.type === 'object') return result.value
      await sleep(100)
    }
    throw new Error(`case "${name}" never reported`)
  } finally {
    await tab.close()
  }
}

async function browserHalf() {
  const browser = findChrome()
  if (!browser) {
    console.log('\nbrowser half — skipped: no Chrome/Edge found (set CHROME_PATH)')
    return false
  }
  // The identity routes the client half reads. They belong to the host half in
  // production; here the server stands in for it, per case, so the account row
  // can be driven from a contract the way a launcher-driven instance is.
  const IDENTITY = '/dsh-claude-style/username'
  const SKIN = '/dsh-claude-style/skin'
  let current = null
  const server = http.createServer((req, res) => {
    const pathname = new URL(req.url, 'http://x').pathname
    const name = pathname.slice(1)
    if (name === 'client.js') {
      res.writeHead(200, { 'content-type': 'text/javascript; charset=utf-8' })
      res.end(fs.readFileSync(CLIENT))
      return
    }
    if (Object.prototype.hasOwnProperty.call(CASES, name)) {
      current = name
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
      res.end(page(name))
      return
    }
    const contract = LAUNCHER[current]
    if (contract === undefined) {
      res.writeHead(404)
      res.end()
      return
    }
    if (pathname === IDENTITY) {
      const body = Buffer.from(JSON.stringify({
        ok: true,
        username: contract.name,
        account: {
          name: contract.name,
          vendor: contract.vendor,
          kind: contract.kind,
          skin: contract.skin,
          skinModel: contract.skinModel,
          hasSkin: contract.hasSkin,
        },
      }))
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'content-length': String(body.byteLength) })
      res.end(body)
      return
    }
    // The picture itself. `picture: false` stands for a file the player removed
    // after the launcher wrote the contract.
    if (pathname === SKIN && contract.picture === true) {
      const image = fs.readFileSync(SKIN_FIXTURE)
      res.writeHead(200, { 'content-type': 'image/png', 'content-length': String(image.byteLength) })
      res.end(image)
      return
    }
    res.writeHead(404, { 'cache-control': 'no-store' })
    res.end()
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const base = `http://127.0.0.1:${server.address().port}`
  const chrome = await launchChrome(browser, { name: 'smoke', width: 1280, height: 800 })
  try {
    for (const name of Object.keys(CASES)) {
      console.log(`\nbrowser half — ${name}`)
      CASES[name](await runCase(chrome.port, base, name))
    }
    return true
  } finally {
    server.close()
    await chrome.close()
  }
}

async function main() {
  await hostHalf()
  const ran = await browserHalf()
  console.log(failed === 0 ? `\nsmoke: all checks passed${ran ? '' : ' (browser half skipped)'}` : `\nsmoke: ${failed} check(s) failed`)
  process.exit(failed > 0 ? 1 : ran ? 0 : 2)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
