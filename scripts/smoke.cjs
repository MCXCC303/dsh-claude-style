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
    var drawer = document.querySelector('.dsh-claude-account-popover-body')
    r.drawer = drawer ? Array.prototype.map.call(drawer.children, function (c) {
      if (c.hasAttribute('data-action-index')) return 'action'
      if (c.hasAttribute('data-embed-index')) return 'embed'
      if (c.getAttribute('data-action') === 'settings') return 'settings'
      return 'other'
    }) : null
    var syntheticPopover = document.querySelector('.dsh-claude-account-popover')
    r.syntheticHeader = !!(syntheticPopover && syntheticPopover.querySelector('[data-dsh-claude-ban-row]'))
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
      r.leftMarkers = document.querySelectorAll('[data-dsh-claude-footer-entry], [data-dsh-claude-footer-hidden], [data-dsh-claude-footer-overlay], [data-dsh-claude-model-host], [data-dsh-claude-account-host-row]').length
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
    check('synthetic path: the popover carries the header, the plugin rows and the settings row',
      r.drawer !== null && same(r.drawer, ['action', 'embed', 'settings']) && r.syntheticHeader === true,
      JSON.stringify({ drawer: r.drawer, header: r.syntheticHeader }))
    check('synthetic path injects nothing into a host menu', r.syntheticInject === 0, `${r.syntheticInject} containers`)
    check('account row names the signed-in profile', r.accountUser === 'Ada', JSON.stringify(r.accountUser))
    check('avatar is an <img> sent without a referrer', r.photo !== null && r.photo.referrerPolicy === 'no-referrer', JSON.stringify(r.photo))
    check('the self-built drawer matches the account row box',
      r.syntheticBox !== null && r.syntheticBox.popoverLeft === r.syntheticBox.buttonLeft &&
        r.syntheticBox.popoverWidth === r.syntheticBox.buttonWidth,
      JSON.stringify(r.syntheticBox))
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
