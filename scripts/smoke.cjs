#!/usr/bin/env node
/**
 * smoke.cjs — zero-dependency smoke test of the BUILT plugin (`lib/`); no running
 * DSH instance is needed.
 *
 * Host half, in Node: `lib/index.js` is applied to a fake cordis context and its
 * private routes get the request shapes that matter (docs/architecture.md D11) —
 * a cross-site page, a LAN peer, a DNS-rebound page, the browser's own
 * same-origin fetch and the desktop shell's forwarded request — once through a
 * host that offers `connection.requestRejection()` and once through the local
 * stand-in.
 *
 * Browser half, in headless Chrome/Edge over CDP: `lib/client.js` is loaded into
 * a page that stands in for the host (module loader, ctx, a sidebar footer with
 * an account menu and two plugin entries, a composer whose editor handles Enter
 * the way the host's keymap does), and checked for:
 *   - boot       apply() installs every feature and registers its teardown;
 *   - idle       once settled, no scheduler pass runs — a pass that mutates the
 *                DOM schedules the next one, and then the page never idles;
 *   - enter      Enter on an open composer menu reaches the host, never "Send";
 *   - desktop    the 0.1.7 desktop footer: the host's account menu in the
 *                settings launcher slot, the drawer's mirrors of its rows,
 *                Ctrl+, and the account stream's read discipline;
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
const { spawn } = require('child_process')
const fs = require('fs')
const http = require('http')
const os = require('os')
const path = require('path')
const { Readable } = require('stream')
const { pathToFileURL } = require('url')

const ROOT = path.resolve(__dirname, '..')
const CLIENT = path.join(ROOT, 'lib', 'client.js')
const HOST = path.join(ROOT, 'lib', 'index.js')
const MARKUP = '<img src=x onerror="window.__pwned=(window.__pwned||0)+1">'

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

/** lib/index.js applied to a fake cordis context; `fenced` offers the host's own request check. */
function fakeHost(mod, fenced) {
  const routes = {}
  const store = { brand: 'claude', username: '', quickProviders: [] }
  let revision = 1
  const settings = {
    configure: () => () => {},
    describe: () => [{ ns: 'ui-skin-claude-style', value: { ...store }, revision }],
    async update(ns, patch) { Object.assign(store, patch); revision += 1 },
  }
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
  const ctx = {
    fiber: { entry: { id: 'include:ui-skin-claude-style' } },
    logger: { warn() {} },
    get: (name) => (name === 'settings' ? settings : name === 'connection' && fenced ? connection : undefined),
    effect: (fn) => fn(),
    inject: (deps, cb) => cb({
      effect: (fn) => fn(),
      get: (name) => ctx.get(name),
      settings,
      webServer: { register(route) { routes[route.path] = route; return () => {} } },
    }),
  }
  mod.apply(ctx)
  return { routes, store }
}

/** One request through a registered route; resolves with `{ status, body }`. */
function request(host, route, method, body, headers) {
  const req = Readable.from(body ? [Buffer.from(body)] : [])
  Object.assign(req, { method, url: route, headers })
  return new Promise((resolve) => {
    const res = {
      status: 0,
      writeHead(status) { this.status = status },
      end(chunk) { resolve({ status: this.status, body: chunk ? chunk.toString() : '' }) },
    }
    Promise.resolve(host.routes[route].handler(req, res)).catch((error) => resolve({ status: -1, body: String(error) }))
  })
}

async function hostHalf() {
  const mod = await import(pathToFileURL(HOST).href)
  const PREFS = '/dsh-claude-style/prefs'
  const USER = '/dsh-claude-style/username'
  const json = (value) => JSON.stringify(value)
  const browser = { host: '127.0.0.1:43120', origin: 'http://127.0.0.1:43120', 'sec-fetch-site': 'same-origin', 'content-type': 'application/json', cookie: 'dsh-auth-x=1' }
  const desktop = { host: '127.0.0.1:51234', 'content-type': 'application/json', cookie: 'dsh-auth-x=1' }
  const crossSite = { host: '127.0.0.1:43120', origin: 'https://attacker.example', 'sec-fetch-site': 'cross-site', 'content-type': 'text/plain;charset=UTF-8' }
  const lanPeer = { host: '192.168.1.23:43120', 'content-type': 'application/json' }
  const rebound = { host: 'attacker.example:43120', origin: 'http://attacker.example:43120', 'sec-fetch-site': 'same-origin', 'content-type': 'application/json' }

  for (const fenced of [true, false]) {
    console.log(`\nhost half — ${fenced ? "through the host's connection.requestRejection()" : 'through the local stand-in (no connection service)'}`)
    const host = fakeHost(mod, fenced)
    for (const [label, headers] of [['cross-site page (text/plain)', crossSite], ['LAN peer', lanPeer], ['DNS-rebound page', rebound]]) {
      const r = await request(host, PREFS, 'POST', json({ username: 'intruder' }), headers)
      check(`${label}: write refused`, (r.status === 401 || r.status === 403) && host.store.username === '', `HTTP ${r.status}, stored ${json(host.store.username)}`)
    }
    let r = await request(host, PREFS, 'POST', json({ username: 'Ada' }), browser)
    check('browser same-origin write accepted', r.status === 200 && host.store.username === 'Ada', `HTTP ${r.status}`)
    r = await request(host, PREFS, 'POST', json({ brand: 'anthropic' }), desktop)
    check('desktop-shell forwarded write accepted', r.status === 200 && host.store.brand === 'anthropic', `HTTP ${r.status}`)
    if (fenced) {
      const { cookie, ...noCookie } = browser
      r = await request(host, PREFS, 'POST', json({ username: 'x' }), noCookie)
      check("host's own verdict is used (no session cookie → 401)", r.status === 401, `HTTP ${r.status}`)
    }
    r = await request(host, PREFS, 'POST', json({ username: 'x' }), { ...browser, 'content-type': 'text/plain' })
    check('non-JSON write refused (415)', r.status === 415, `HTTP ${r.status}`)
    r = await request(host, PREFS, 'POST', json({ username: 'x'.repeat(20 * 1024) }), browser)
    check('oversized body refused (413)', r.status === 413, `HTTP ${r.status}`)
    r = await request(host, PREFS, 'POST', 'null', browser)
    check('non-object body refused (400)', r.status === 400, `HTTP ${r.status}`)
    const ids = ['y'.repeat(200)].concat(Array.from({ length: 300 }, (_, i) => `provider-${i}`))
    r = await request(host, PREFS, 'POST', json({ quickProviders: ids }), browser)
    check('quick providers capped (64 short ids)', r.status === 200 && host.store.quickProviders.length === 64 && host.store.quickProviders[0] === 'provider-0', `stored ${host.store.quickProviders.length}`)
    r = await request(host, USER, 'GET', '', { host: '127.0.0.1:43120', 'sec-fetch-site': 'cross-site' })
    check('cross-site username read refused', r.status === 401 || r.status === 403, `HTTP ${r.status}`)
    r = await request(host, USER, 'GET', '', browser)
    check('browser username read answered', r.status === 200 && JSON.parse(r.body).ok === true, `HTTP ${r.status}`)
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
  function closeHostMenu() {
    if (menu && menu.parentElement) menu.parentElement.removeChild(menu)
    menu = null
  }
  function openHostSettingsDialog() {
    var area = document.querySelector('[class*="settingsArea"]')
    if (!area) return
    var dialog = document.createElement('div')
    dialog.setAttribute('role', 'dialog')
    dialog.textContent = 'Settings'
    area.appendChild(dialog)
  }
  document.getElementById('host-account').addEventListener('click', function () {
    if (menu) { closeHostMenu(); return }
    menu = document.createElement('div')
    menu.setAttribute('role', 'menu')
    if (CASE === 'desktop') {
      // The host's real account menu: picking an item selects it and the menu
      // closes itself (onSelect), so the skin must not click the trigger again.
      // The sign-out glyph copies LogoutIcon.tsx's geometry: a 16px relative box
      // holding a 13.664x13.571 svg at (1.168, 1.214) absolute.
      menu.innerHTML =
        '<div role="menuitem"><svg viewBox="0 0 16 16" width="16" height="16"></svg>Settings</div>' +
        '<div role="menuitem"><svg viewBox="0 0 16 16" width="16" height="16"></svg>Feedback</div>' +
        '<div role="menuitem"><span style="position:relative;display:inline-block;width:16px;height:16px">' +
          '<svg viewBox="0 0 13.664 13.571" width="13.664" height="13.571" style="position:absolute;left:1.168px;top:1.214px">' +
            '<path d="M1 1 L12.664 12.571" fill="none" stroke="currentColor" stroke-width="1.4"></path>' +
          '</svg></span>Sign out</div>'
      menu.addEventListener('click', function (e) {
        var item = e.target && e.target.closest ? e.target.closest('[role="menuitem"]') : null
        if (!item) return
        if ((item.textContent || '').trim() === 'Settings') openHostSettingsDialog()
        closeHostMenu()
      })
    } else {
      menu.innerHTML = '<div role="menuitem"><svg></svg>Settings</div><div role="menuitem"><svg></svg>Feedback</div><div role="menuitem"><svg></svg>Sign out</div>'
    }
    document.body.appendChild(menu)
  })

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
  var username = CASE === 'markup' ? MARKUP : 'Tester'
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
  }
  // Host API drift at sync time: a session list that throws, which only the
  // permission control reads on every pass.
  var sessions = CASE === 'sync-fault'
    ? { list: { getSnapshot: function () { throw new Error('session list unavailable') } }, binding: function () { return null } }
    : undefined
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
      if (name === 'remote') return CASE === 'desktop' ? remote : undefined
      if (name === 'sessions') return sessions
      return undefined
    },
    effect: function (fn) { window.__dispose = fn() },
  }
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
    if (window.SMOKE_CASE === 'sync-fault') {
      // A sync is retired after failing three passes in a row: drive four.
      for (var n = 0; n < 4; n++) { document.body.appendChild(document.createElement('i')); await sleep(80) }
    }
    if (window.SMOKE_CASE === 'desktop') {
      // The first login frame makes the skin read the profile once.
      window.__pushAccountFrame({ status: 'credential-stored', attempt: { phase: 'succeeded', id: 'smoke-1' } })
      await sleep(500)
      r.profileReadsAfterFirst = window.__profileReads
      // The same state again (a reconnect): no second read.
      window.__pushAccountFrame({ status: 'credential-stored', attempt: { phase: 'succeeded', id: 'smoke-1' } })
      await sleep(500)
      r.profileReadsAfterRepeat = window.__profileReads
      var triggerRow = document.querySelector('[class*="footArea"] [class*="triggerRow"]')
      r.triggerRowDisplay = triggerRow ? getComputedStyle(triggerRow).display : null
      // Open the drawer and read what it mirrors.
      var accountBtn = document.querySelector('.dsh-claude-account-btn')
      if (accountBtn) accountBtn.click()
      await sleep(600)
      var ownSettings = document.querySelector('.dsh-claude-account-popover [data-action="settings"]')
      r.ownSettingsHidden = ownSettings ? ownSettings.hidden : null
      var accountRows = Array.prototype.slice.call(document.querySelectorAll('.dsh-claude-account-popover [data-dsh-claude-account-item]'))
      r.accountRowTexts = accountRows.map(function (row) {
        var text = row.querySelector('.dsh-claude-popover-item-text')
        return text ? text.textContent : null
      })
      // The sign-out glyph must stay inside its icon box (the drawer-corner bug).
      var signOut = null
      for (var si = 0; si < accountRows.length; si++) {
        if ((accountRows[si].textContent || '').indexOf('Sign out') !== -1) { signOut = accountRows[si]; break }
      }
      if (signOut) {
        var iconBox = signOut.querySelector('.dsh-claude-popover-item-icon')
        var iconSvg = iconBox ? iconBox.querySelector('svg') : null
        if (iconBox && iconSvg) {
          var ib = iconBox.getBoundingClientRect()
          var sb = iconSvg.getBoundingClientRect()
          r.signoutIcon = { icon: [ib.left, ib.top, ib.right, ib.bottom], svg: [sb.left, sb.top, sb.right, sb.bottom] }
          r.signoutContained = sb.left >= ib.left - 0.5 && sb.top >= ib.top - 0.5 &&
            sb.right <= ib.right + 0.5 && sb.bottom <= ib.bottom + 0.5
        }
      }
      // Picking the drawer's Settings row drives the host menu and opens the dialog.
      var settingsRow = null
      for (var ri = 0; ri < accountRows.length; ri++) {
        var rowText = accountRows[ri].querySelector('.dsh-claude-popover-item-text')
        if (rowText && rowText.textContent === 'Settings') { settingsRow = accountRows[ri]; break }
      }
      if (settingsRow) settingsRow.click()
      await sleep(600)
      r.dialogAfterRowClick = document.querySelectorAll('[class*="settingsArea"] [role="dialog"]').length
      // The permissions control keeps a role=menu of its own in the page, so the
      // host's account menu is the one carrying the Sign out item.
      r.hostAccountMenusAfterRowClick = Array.prototype.filter.call(document.querySelectorAll('[role="menu"]'), function (m) {
        var items = m.querySelectorAll('[role="menuitem"]')
        for (var mi = 0; mi < items.length; mi++) {
          if ((items[mi].textContent || '').trim() === 'Sign out') return true
        }
        return false
      }).length
      // Clear the host's dialog so the shortcut's own open is observable.
      Array.prototype.forEach.call(document.querySelectorAll('[class*="settingsArea"] [role="dialog"]'), function (dialog) {
        if (dialog.parentElement) dialog.parentElement.removeChild(dialog)
      })
      document.dispatchEvent(new KeyboardEvent('keydown', { key: ',', ctrlKey: true, bubbles: true, cancelable: true }))
      await sleep(600)
      r.dialogAfterShortcut = document.querySelectorAll('[class*="settingsArea"] [role="dialog"]').length
      // Esc closes an open drawer.
      if (accountBtn) accountBtn.click()
      await sleep(300)
      r.drawerOpenBeforeEsc = !!document.querySelector('.dsh-claude-account-popover[data-open="true"]')
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
      await sleep(300)
      r.drawerOpenAfterEsc = !!document.querySelector('.dsh-claude-account-popover[data-open="true"]')
      // A press on the body — outside the drawer and its trigger — closes a
      // reopened drawer.
      if (accountBtn) accountBtn.click()
      await sleep(300)
      r.drawerOpenBeforeOutside = !!document.querySelector('.dsh-claude-account-popover[data-open="true"]')
      document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }))
      await sleep(300)
      r.drawerOpenAfterOutside = !!document.querySelector('.dsh-claude-account-popover[data-open="true"]')
    }
    await sleep(1200)
    var from = window.__passes
    await sleep(1000)
    r.idlePasses = window.__passes - from
    var drawer = document.querySelector('.dsh-claude-account-popover-body')
    r.drawer = drawer ? Array.prototype.map.call(drawer.children, function (c) {
      if (c.hasAttribute('data-action-index')) return 'action'
      if (c.hasAttribute('data-embed-index')) return 'embed'
      if (c.getAttribute('data-action') === 'settings') return 'settings'
      return c.hasAttribute('data-dsh-claude-account-item') ? 'account' : 'other'
    }) : null
    var user = document.querySelector('.dsh-claude-account-user')
    r.accountUser = user ? user.textContent : null
    var avatar = document.querySelector('.dsh-claude-account-avatar')
    r.avatarAttrs = attrs(avatar)
    var photo = avatar ? avatar.querySelector('img') : null
    r.photo = photo ? { attrs: attrs(photo), referrerPolicy: photo.referrerPolicy } : null
    var mirrored = drawer ? drawer.querySelector('[data-action-index]') : null
    r.mirroredText = mirrored ? mirrored.querySelector('.dsh-claude-popover-item-text').textContent : null
    var badge = mirrored ? mirrored.querySelector('.dsh-claude-popover-item-badge') : null
    r.mirroredBadge = badge ? badge.textContent : null
    r.stylesheet = !!document.getElementById('dsh-claude-style-style')
    r.footerTakeover = document.body.hasAttribute('data-dsh-claude-footer-takeover')
    r.composerRestyle = document.body.hasAttribute('data-dsh-claude-composer-active')
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
      r.leftMarkers = document.querySelectorAll('[data-dsh-claude-footer-entry], [data-dsh-claude-footer-hidden], [data-dsh-claude-footer-overlay], [data-dsh-claude-model-host]').length
      r.leftAttrs = Array.prototype.filter.call(document.body.attributes, function (a) { return /^data-dsh-(claude|window)/.test(a.name) }).map(function (a) { return a.name })
      r.leftStylesheet = !!document.getElementById('dsh-claude-style-style')
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
        '  <button id="host-account" aria-haspopup="menu" aria-label="Account menu">Me</button>\n' +
      '</div>'
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>dsh-claude-style smoke: ${name}</title></head>
<body>
${footer}
<div data-composer-card>
  <div class="_x_toolbar_1"><button aria-label="Access mode: Edit">Edit</button></div>
  <div data-composer-input contenteditable="true" id="editor">/comp</div>
  <button aria-label="Send" id="send">Send</button>
</div>
<script>window.SMOKE_CASE = ${JSON.stringify(name)}</script>
<script>${STAND_IN}</script>
<script src="/client.js"></script>
<script>${PROBE}</script>
</body></html>`
}

/** Checks every case shares: a clean teardown and an idle scheduler. */
function commonChecks(r) {
  check('scheduler idle once settled (0 passes in 1 s)', r.idlePasses === 0, `${r.idlePasses} passes`)
  check('teardown registered with the host', r.teardownRegistered)
  if (!r.teardownRegistered) return
  check('teardown leaves no skin node, marker, body attribute or stylesheet',
    r.leftNodes === 0 && r.leftMarkers === 0 && r.leftAttrs.length === 0 && !r.leftStylesheet,
    `nodes ${r.leftNodes}, markers ${r.leftMarkers}, attrs ${JSON.stringify(r.leftAttrs)}, stylesheet ${r.leftStylesheet}`)
  check('no pass runs after teardown', r.passesAfterTeardown === 0, `${r.passesAfterTeardown} passes`)
}

const CASES = {
  default(r) {
    check('apply() completes', r.applyError === null, r.applyError)
    check('stylesheet injected', r.stylesheet)
    check('no feature reported a failure', r.errors.length === 0, r.errors.join(' | '))
    check('drawer: plugin entries, then Settings, then the host account items',
      same(r.drawer, ['action', 'embed', 'settings', 'account', 'account']), JSON.stringify(r.drawer))
    check('account row names the signed-in profile', r.accountUser === 'Ada', JSON.stringify(r.accountUser))
    check('avatar is an <img> sent without a referrer', r.photo !== null && r.photo.referrerPolicy === 'no-referrer', JSON.stringify(r.photo))
    check('Enter on an open composer menu reaches the host', same(r.keys, ['host picked the menu item']), JSON.stringify(r.keys))
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
    check("the host's own composer is handed back", !r.composerRestyle)
    check('the rest of the skin keeps running', r.stylesheet && r.accountUser === 'Ada', JSON.stringify(r.accountUser))
    commonChecks(r)
  },
  desktop(r) {
    check('apply() completes', r.applyError === null, r.applyError)
    check('the takeover hides the host trigger row',
      r.triggerRowDisplay === 'none', JSON.stringify(r.triggerRowDisplay))
    check("the drawer's own Settings row steps aside for the host menu's",
      r.ownSettingsHidden === true, JSON.stringify(r.ownSettingsHidden))
    check('the host account rows are mirrored in order',
      same(r.accountRowTexts, ['Settings', 'Feedback', 'Sign out']), JSON.stringify(r.accountRowTexts))
    check('the sign-out icon stays inside its icon box',
      r.signoutContained === true && r.signoutIcon !== undefined &&
      r.signoutIcon.icon[2] - r.signoutIcon.icon[0] > 1 && r.signoutIcon.svg[2] - r.signoutIcon.svg[0] > 1,
      JSON.stringify(r.signoutIcon))
    check("picking the drawer's Settings opens the host dialog and leaves no host account menu open",
      r.dialogAfterRowClick === 1 && r.hostAccountMenusAfterRowClick === 0,
      JSON.stringify({ dialogs: r.dialogAfterRowClick, accountMenus: r.hostAccountMenusAfterRowClick }))
    check('Ctrl+, opens the host dialog', r.dialogAfterShortcut === 1, JSON.stringify(r.dialogAfterShortcut))
    check('Esc closes an open drawer',
      r.drawerOpenBeforeEsc === true && r.drawerOpenAfterEsc === false,
      JSON.stringify({ before: r.drawerOpenBeforeEsc, after: r.drawerOpenAfterEsc }))
    check('a press outside the drawer and its trigger closes it',
      r.drawerOpenBeforeOutside === true && r.drawerOpenAfterOutside === false,
      JSON.stringify({ before: r.drawerOpenBeforeOutside, after: r.drawerOpenAfterOutside }))
    check('the first account frame reads the profile exactly once',
      r.profileReadsAfterFirst === 1, JSON.stringify(r.profileReadsAfterFirst))
    check('a repeated same-state frame reads nothing more',
      r.profileReadsAfterRepeat === 1, JSON.stringify(r.profileReadsAfterRepeat))
    check('account row names the signed-in profile', r.accountUser === 'Ada', JSON.stringify(r.accountUser))
    check('no feature reported a failure', r.errors.length === 0, r.errors.join(' | '))
    commonChecks(r)
  },
}

function findBrowser() {
  return [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean).find((candidate) => fs.existsSync(candidate))
}

/** The DevTools port Chrome picked for `--remote-debugging-port=0`. */
async function devtoolsPort(profile) {
  const file = path.join(profile, 'DevToolsActivePort')
  for (let i = 0; i < 150; i++) {
    try {
      const port = Number(fs.readFileSync(file, 'utf8').split('\n')[0])
      if (port > 0) return port
    } catch { /* not written yet */ }
    await sleep(100)
  }
  throw new Error('the browser never opened its DevTools port')
}

/** Load one case in a fresh tab and return the page's report. */
async function runCase(port, base, name) {
  const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json()
  const ws = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject })
  let seq = 0
  const pending = new Map()
  ws.onmessage = (message) => {
    const data = JSON.parse(message.data)
    if (data.id && pending.has(data.id)) { pending.get(data.id)(data); pending.delete(data.id) }
  }
  const send = (method, params = {}) => new Promise((resolve) => {
    const id = ++seq
    pending.set(id, resolve)
    ws.send(JSON.stringify({ id, method, params }))
  })
  try {
    await send('Page.enable')
    await send('Page.navigate', { url: `${base}/${name}` })
    for (let i = 0; i < 100; i++) {
      const out = await send('Runtime.evaluate', { expression: 'window.__smoke', awaitPromise: true, returnByValue: true })
      const result = out.result && out.result.result
      if (result && result.type === 'object') return result.value
      await sleep(100)
    }
    throw new Error(`case "${name}" never reported`)
  } finally {
    ws.close()
    await fetch(`http://127.0.0.1:${port}/json/close/${target.id}`).catch(() => {})
  }
}

async function browserHalf() {
  const browser = findBrowser()
  if (!browser) {
    console.log('\nbrowser half — skipped: no Chrome/Edge found (set CHROME_PATH)')
    return false
  }
  const server = http.createServer((req, res) => {
    const name = new URL(req.url, 'http://x').pathname.slice(1)
    if (name === 'client.js') {
      res.writeHead(200, { 'content-type': 'text/javascript; charset=utf-8' })
      res.end(fs.readFileSync(CLIENT))
    } else if (Object.prototype.hasOwnProperty.call(CASES, name)) {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
      res.end(page(name))
    } else {
      res.writeHead(404)
      res.end()
    }
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const base = `http://127.0.0.1:${server.address().port}`
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-claude-smoke-'))
  const chrome = spawn(browser, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
    '--no-first-run', '--no-default-browser-check', '--window-size=1280,800', 'about:blank'], { stdio: 'ignore' })
  try {
    const port = await devtoolsPort(profile)
    for (const name of Object.keys(CASES)) {
      console.log(`\nbrowser half — ${name}`)
      CASES[name](await runCase(port, base, name))
    }
    return true
  } finally {
    chrome.kill()
    server.close()
    await sleep(500)
    try { fs.rmSync(profile, { recursive: true, force: true }) } catch { /* the browser may still hold a file */ }
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
