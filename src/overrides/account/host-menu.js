    /**
     * The host's account menu (设置 / 意见反馈 / 退出登录, or 登录 when signed out)
     * lives in a portal that exists only while its trigger is open, and the
     * trigger listens on pointer events — a bare `click()` does nothing. The
     * skin drives it the way a pointer would, reads whatever items the host
     * renders (never a hard-coded list, so a future option shows up on its own)
     * and clicks one back when the user picks it. A body flag keeps the drive
     * out of sight.
     */
    function createHostAccountMenu(options) {
      var ACCOUNT_MENU_ATTR = 'data-dsh-claude-account-menu'
      var DRIVING_ATTR = 'data-dsh-claude-account-driving'
      var accountItems = []
      var accountMenuError = false
      var accountReading = false
      var accountSignature = ''

      /** A click the host's React handlers actually see (pointerdown + click). */
      function realClick(el) {
        if (el === null || el === undefined) return
        var rect = el.getBoundingClientRect()
        var init = {
          bubbles: true, cancelable: true, composed: true, button: 0, buttons: 1,
          clientX: Math.round(rect.left + rect.width / 2),
          clientY: Math.round(rect.top + rect.height / 2)
        }
        try { el.dispatchEvent(new PointerEvent('pointerdown', init)) } catch (error) { /* older engines */ }
        el.dispatchEvent(new MouseEvent('mousedown', init))
        try { el.dispatchEvent(new PointerEvent('pointerup', init)) } catch (error) { /* older engines */ }
        el.dispatchEvent(new MouseEvent('mouseup', init))
        el.click()
      }

      /**
       * The host's account trigger: the menu anchor inside the FOOTER, which is
       * where the account row lives. Taking "the first menu anchor that is not
       * ours" was wrong — the shell has several (the open-in-app picker, the
       * workspace selector), and on a host without the desktop account the skin
       * then mirrored THAT menu into the account drawer. The takeover hides the
       * row it sits in (footer-takeover.css), but it stays in the DOM, and the
       * drive dispatches its events at it directly.
       */
      function hostAccountTrigger() {
        var foot = document.querySelector('[class*="footArea"]')
        var scopes = [foot, document]
        // The account menu names itself ("账号菜单" / "Account menu"): the shell
        // has several menu anchors (open-in-app, workspace picker) and "the first
        // one that is not ours" picked the wrong one on hosts whose account row is
        // not in the footer. Match the label first, and only then fall back to
        // "the first non-ours anchor in the footer".
        for (var s = 0; s < scopes.length; s++) {
          if (scopes[s] === null || scopes[s] === undefined) continue
          var anchors = scopes[s].querySelectorAll('[aria-haspopup="menu"]')
          for (var i = 0; i < anchors.length; i++) {
            var el = anchors[i]
            if (String(el.className || '').indexOf('dsh-claude-') !== -1) continue
            if (/账号|account/i.test(el.getAttribute('aria-label') || '')) return el
          }
        }
        // No fallback. The skin replaces the host's account row, so on a host
        // without the desktop account there is simply no account menu to mirror —
        // and "the first non-ours anchor in the footer" picked the open-in-app
        // menu instead, filling the drawer with Cursor / VS Code / … Returning
        // null is the honest answer: the drawer keeps only its own 设置 row.
        return null
      }

      function hostMenus() {
        return Array.prototype.slice.call(document.querySelectorAll('[role="menu"]'))
      }

      /**
       * The host's settings button, a dialog trigger in the footer, or null. The
       * desktop has none: its account menu took that slot and carries 设置
       * itself, and "any button that is not a menu anchor" there is the update
       * pill beside it — the settings row read "Retry update" and clicked it.
       */
      function hostSettingsTrigger() {
        return document.querySelector('[class*="footArea"] [class*="settingsArea"] button[aria-haspopup="dialog"]')
      }

      /**
       * What the host's menu lists depends on the account — its last row reads
       * 退出登录 or 登录 — and the host re-renders it from its own copy of the
       * account stream, which can land after ours. So a read is keyed on the
       * account state and on what the host's trigger shows (the name label, or
       * the picture in the rail): one made before the host caught up is made
       * again once the trigger changes.
       */
      function accountMenuKey() {
        var trigger = hostAccountTrigger()
        var photo = trigger !== null ? trigger.querySelector('img') : null
        return [
          options.key(),
          trigger !== null ? (trigger.textContent || '').trim() : '',
          photo !== null ? photo.getAttribute('src') || '' : ''
        ].join('|')
      }

      /**
       * Open the host's account menu out of sight, hand its items to `read`, close
       * it again. Asynchronous on purpose: the host renders the portal on a later
       * tick, so a synchronous wait would block the very render it waits for.
       * `read` returns true when it clicked an item: the host's own selection
       * closes the menu then, and the trigger's click would open it again.
       */
      function withHostAccountMenu(read) {
        return new Promise(function (resolve) {
          var trigger = hostAccountTrigger()
          if (trigger === null) { resolve(false); return }
          var before = hostMenus()
          document.body.setAttribute(DRIVING_ATTR, '')
          realClick(trigger)
          var tries = 0
          function finish(ok, picked) {
            if (!picked) realClick(trigger)
            document.body.removeAttribute(DRIVING_ATTR)
            resolve(ok)
          }
          function look() {
            var menu = null
            var now = hostMenus()
            for (var i = 0; i < now.length; i++) {
              if (before.indexOf(now[i]) === -1) menu = now[i]
            }
            var items = menu !== null ? menu.querySelectorAll('[role="menuitem"]') : []
            if (menu !== null && items.length > 0) {
              menu.setAttribute(ACCOUNT_MENU_ATTR, '')
              finish(true, read(menu, items) === true)
              return
            }
            if (tries++ > 20) { finish(false); return }
            setTimeout(look, 40)
          }
          setTimeout(look, 40)
        })
      }

      /**
       * Open the host's settings: its settings button where it has one, or else
       * the 设置 item of its account menu — the desktop, where that menu is the
       * settings launcher. The menu's rows carry no ids, so the item is found by
       * the host's own label in its two locales. The drawer's settings row
       * comes through here; "the first button in the settings slot" was the
       * account trigger on the desktop, and that opened the account menu.
       */
      var SETTINGS_LABEL = /^(设置|settings)$/i
      function openHostSettings() {
        options.close()
        var trigger = hostSettingsTrigger()
        if (trigger !== null) {
          trigger.click()
          return
        }
        withHostAccountMenu(function (menu, menuItems) {
          for (var k = 0; k < menuItems.length; k++) {
            if (SETTINGS_LABEL.test((menuItems[k].textContent || '').trim())) { realClick(menuItems[k]); return true }
          }
          return false
        })
      }

      /** Read the host's items (once per account state) and re-render the rows. */
      function refreshAccountItems() {
        if (accountReading) return
        accountReading = true
        var key = accountMenuKey()
        withHostAccountMenu(function (menu, items) {
          // The drawer's own settings row stands for the host's settings button
          // where there is one, and the menu's copy would
          // list 设置 twice. Without that button (the desktop) the menu's 设置 is
          // the only way to settings, and the drawer's own row steps aside.
          var ownSettings = options.ownSettingsLabel()
          var next = []
          for (var i = 0; i < items.length; i++) {
            var text = (items[i].textContent || '').trim()
            if (ownSettings !== null && text === ownSettings) continue
            var icon = items[i].querySelector('svg')
            next.push({
              text: text,
              // The host disables its own sign-out row while its flow is busy;
              // the skin's row stays enabled, or the drawer would dead-end the
              // very action the user is reaching for.
              disabled: false,
              // A detached copy of the host's node, not its markup: the menu is
              // closed again right after this read, and a copy never re-parses.
              icon: icon !== null ? icon.cloneNode(true) : null,
              iconHtml: icon !== null ? icon.outerHTML : ''
            })
          }
          accountItems = next
        }).then(function (ok) {
          accountReading = false
          accountMenuError = !ok
          accountReadAt = Date.now()
          accountSignature = key
          options.onItems()
        })
      }
      /**
       * Read the host's menu when there is one to read: once, again whenever the
       * account changes, and — after a read that came back empty — at most every
       * ACCOUNT_REREAD_MS. Each read opens and closes the host's menu, so an
       * empty result must not turn into a read on every pass.
       */
      var ACCOUNT_REREAD_MS = 5000
      var accountReadAt = 0
      function sync() {
        if (!accountReading && hostAccountTrigger() !== null) {
          var stale = accountMenuKey() !== accountSignature
          var retry = accountItems.length === 0 && Date.now() - accountReadAt > ACCOUNT_REREAD_MS
          if (stale || retry) refreshAccountItems()
        }
        options.onItems()
      }

      /** Drive the host's menu and click the item whose text is `text`. */
      function pick(text) {
        return withHostAccountMenu(function (menu, menuItems) {
          for (var k = 0; k < menuItems.length; k++) {
            if ((menuItems[k].textContent || '').trim() === text) { realClick(menuItems[k]); return true }
          }
          return false
        })
      }
      return {
        trigger: hostAccountTrigger,
        settingsTrigger: hostSettingsTrigger,
        items: function () { return accountItems },
        sync: sync,
        pick: pick,
        openSettings: openHostSettings
      }
    }
