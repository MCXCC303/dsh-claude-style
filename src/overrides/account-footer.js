    function installAccountFooter(ctx, ui) {
      var profile = createAccountProfile(ctx, function () {
        if (typeof ui.schedule === 'function') ui.schedule()
      })
      var accountBtn = null
      var accountPopover = null
      var popoverBody = null
      var popoverHoverIntent = createHoverIntent(openPopover, closePopover, POPOVER_OPEN_DELAY, POPOVER_CLOSE_DELAY)
      // Whether the popover is up because it was CLICKED (rather than hovered).
      // Clicking the account row opens the ban-screen easter egg and leaves the
      // pointer inside the popover, so without this the row's own mouseleave
      // would tear the popover down behind the overlay; a click-opened popover
      // instead stays until the pointer leaves the whole footer.
      var popoverOpenedByClick = false

      function openPopover() {
        if (!accountPopover || !accountBtn) return
        cancelClosePopover()
        // Mirrors are frozen while the popover is open (syncPopoverItems
        // bails), so reconcile them here — before the reveal — to show fresh
        // content/order and bind click targets for the upcoming interaction.
        try {
          var footArea = document.querySelector('[class*="footArea"]')
          if (footArea) syncPopoverItems(footArea)
        } catch (error) { /* opening must never fail because of a mirror sync */ }
        // Resolve the rail anchor before the reveal so the panel never paints at
        // its stale coordinates for a frame.
        positionAccountPopover()
        accountPopover.setAttribute('data-open', 'true')
        accountBtn.setAttribute('data-open', 'true')
        accountBtn.setAttribute('aria-expanded', 'true')
      }

      function closePopover() {
        if (!accountPopover || !accountBtn) return
        cancelClosePopover()
        popoverOpenedByClick = false
        accountPopover.setAttribute('data-open', 'false')
        accountBtn.setAttribute('data-open', 'false')
        accountBtn.setAttribute('aria-expanded', 'false')
      }

      function togglePopover() {
        if (!accountPopover) return
        var isOpen = accountPopover.getAttribute('data-open') === 'true'
        if (isOpen) {
          closePopover()
        } else {
          // The pointer stays on the trigger after a click, and the popover
          // hangs below it, so the trigger's mouseleave must not close what the
          // click just opened — otherwise the panel is unreachable with a mouse.
          popoverOpenedByClick = true
          openPopover()
        }
      }

      function cancelClosePopover() {
        popoverHoverIntent.cancel()
      }

      function scheduleClosePopover() {
        popoverHoverIntent.scheduleClose()
      }

      /**
       * Anchor the account popover to its trigger while the sidebar is a rail.
       *
       * In the rail the popover is `position: fixed` (components/account-footer.css): the sidebar
       * column clips its overflow, so an absolutely positioned panel would be cut
       * off at the 56px rail edge and never seen. Its coordinates therefore have
       * to be resolved here — the same contract the model picker's popovers use.
       * The declarations are written `important` because the stylesheet anchors
       * the wide-sidebar popover with `!important` as well, and an author
       * `!important` beats a plain inline declaration.
       *
       * With the sidebar wide the CSS anchor is the right one, so the inline
       * overrides are dropped again and the footer rule takes over.
       */
      function positionAccountPopover() {
        if (!accountPopover || !accountBtn) return
        if (accountBtn.closest('[class*="collapsed"]') === null) {
          accountPopover.style.removeProperty('left')
          accountPopover.style.removeProperty('top')
          return
        }
        positionAnchoredPopover(accountBtn, accountPopover, { side: 'right', important: true })
      }

      /**
       * The profile picture's address, or null when there is none usable. It
       * comes from the account service, so only http(s) is accepted, and it is
       * handed to an `<img>` as a property — never written into markup.
       */
      function accountPhotoUrl(raw) {
        if (typeof raw !== 'string' || raw === '') return null
        try {
          var url = new URL(raw, window.location.href)
          return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null
        } catch (error) {
          return null
        }
      }

      /**
       * Paint (or clear) the picture inside the avatar circle. It is a real
       * `<img>` layered over the starburst rather than a CSS background: the
       * host's own avatar `<img>` carries `referrerPolicy="no-referrer"`, which
       * is what the picture host expects, and a background cannot drop the
       * referrer. A picture that fails to load hides itself, so the starburst
       * underneath shows instead of an empty circle.
       */
      function syncAccountAvatar(avatarEl) {
        if (avatarEl === null) return
        var src = accountPhotoUrl(profile.avatar())
        var photo = avatarEl.querySelector('.dsh-claude-account-photo')
        if (src === null) {
          if (photo !== null) avatarEl.removeChild(photo)
          if (avatarEl.hasAttribute('data-dsh-claude-photo')) avatarEl.removeAttribute('data-dsh-claude-photo')
          return
        }
        if (photo === null) {
          photo = document.createElement('img')
          photo.className = 'dsh-claude-account-photo'
          photo.alt = ''
          photo.decoding = 'async'
          photo.draggable = false
          photo.referrerPolicy = 'no-referrer'
          photo.addEventListener('load', function () { photo.hidden = false })
          photo.addEventListener('error', function () { photo.hidden = true })
          avatarEl.appendChild(photo)
        }
        if (photo.getAttribute('src') !== src) photo.src = src
        if (!avatarEl.hasAttribute('data-dsh-claude-photo')) avatarEl.setAttribute('data-dsh-claude-photo', '')
      }

      var hostMenu = createHostAccountMenu({
        key: function () {
          return [profile.state() || '', profile.name() || '', profile.avatar() || ''].join('|')
        },
        ownSettingsLabel: function () {
          return hostMenu.settingsTrigger() !== null && settingsItem !== null &&
            settingsItem.querySelector('.dsh-claude-popover-item-text') !== null
            ? settingsItem.querySelector('.dsh-claude-popover-item-text').textContent
            : null
        },
        onItems: function () { renderAccountItems() },
        close: closePopover
      })
      var mirror = createFooterMirror({
        body: function () { return popoverBody },
        anchor: function () { return settingsItem },
        isOpen: function () { return !!(accountPopover && accountPopover.getAttribute('data-open') === 'true') },
        close: closePopover
      })

      /**
       * What the account rows last drew. A rebuild is a DOM mutation, and every
       * mutation under <body> schedules the next pass — so rebuilding the same
       * rows on every pass kept the scheduler running every frame even at idle
       * (measured ~160 passes/s on the signed-in desktop).
       */
      var renderedAccountSignature = null

      function accountItemsSignature() {
        var parts = []
        for (var i = 0; i < hostMenu.items().length; i++) {
          var entry = hostMenu.items()[i]
          parts.push(entry.text + '\u0000' + (entry.disabled ? '1' : '0') + '\u0000' + entry.iconHtml)
        }
        return parts.join('\u0001')
      }

      /**
       * One drawer row per host item; clicking it clicks the host's own item.
       * Rows are rebuilt only when the set changed (or went missing), and never
       * under the pointer: while the drawer is open its rows stay put, since a
       * row replaced between pointerdown and pointerup swallows the click —
       * openPopover() runs one more sync right before the reveal.
       */
      function renderAccountItems() {
        if (!popoverBody) return
        var existing = popoverBody.querySelectorAll('[data-dsh-claude-account-item]')
        var signature = accountItemsSignature()
        if (signature === renderedAccountSignature && existing.length === hostMenu.items().length) return
        if (existing.length > 0 && accountPopover !== null && accountPopover.getAttribute('data-open') === 'true') return
        renderedAccountSignature = signature
        for (var e = 0; e < existing.length; e++) {
          if (existing[e].parentElement !== null) existing[e].parentElement.removeChild(existing[e])
        }
        for (var i = 0; i < hostMenu.items().length; i++) {
          (function (entry) {
            var row = document.createElement('button')
            row.type = 'button'
            row.className = 'dsh-claude-popover-item'
            row.setAttribute('data-dsh-claude-account-item', '')
            row.innerHTML =
              '<span class="dsh-claude-popover-item-icon"></span>' +
              '<span class="dsh-claude-popover-item-text"></span>'
            if (entry.icon !== null) row.querySelector('.dsh-claude-popover-item-icon').appendChild(entry.icon.cloneNode(true))
            row.querySelector('.dsh-claude-popover-item-text').textContent = entry.text
            if (entry.disabled) row.setAttribute('aria-disabled', 'true')
            row.addEventListener('click', function (event) {
              event.stopPropagation()
              closePopover()
              // 直连官方行为（与归档同一条思路：不再驱动宿主菜单）。
              var account = profile.service()
              if (/反馈|contact|意见/i.test(entry.text)) {
                var url = 'https://trtgsjkv6r.feishu.cn/share/base/form/shrcnlCoGElW7MQznGy9r3YYXcg'
                try { window.open(url, '_blank', 'noopener,noreferrer') } catch (error) { /* popup blocked */ }
                return
              }
              if (/退出|登出|sign ?out|log ?out|logout/i.test(entry.text)) {
                if (account !== null && typeof account.signOut === 'function') {
                  // The answer is the signed-out state: take it now rather than
                  // wait for the stream to report it.
                  account.signOut().then(function (result) {
                    if (result && result.ok === true) profile.apply(result.value)
                  }).catch(function () { /* stay signed in on failure */ })
                }
                return
              }
              if (/登录|sign ?in|login/i.test(entry.text)) {
                if (account !== null && typeof account.startSignIn === 'function') {
                  var origin = window.location.origin
                  try { var t = window.__DSH_TRANSPORT__; if (t && t.streamBaseUrl) origin = new URL(t.streamBaseUrl).origin } catch (error) { /* keep the default */ }
                  var locale = 'en'
                  try { locale = ctx.locale.getSnapshot().active === 'zh' ? 'zh' : 'en' } catch (error) { /* default */ }
                  account.startSignIn(locale, origin, 'desktop')
                }
                return
              }
              // 设置 has no call of its own — on the desktop the account menu is
              // the settings launcher, and there is no settings button to click —
              // and neither has an option the skin does not know: the host's own
              // item does it.
              hostMenu.pick(entry.text)
            })
            popoverBody.appendChild(row)
          })(hostMenu.items()[i])
        }
      }

      var settingsItem = null
      function syncPopoverItems(footArea) {
        if (!popoverBody || !footArea) return

        // Only the host's settings button can name and open this row. Any other
        // button in that slot is wrong: on the desktop the first one is the
        // ACCOUNT trigger (the row read "叶落风随" and opened the account menu),
        // and the next one is the update pill.
        var origSettingsTrigger = hostMenu.settingsTrigger()
        var labelText = '设置'
        if (origSettingsTrigger) {
          var txt = (origSettingsTrigger.textContent || '').trim()
          if (!txt) txt = origSettingsTrigger.getAttribute('aria-label') || ''
          if (txt) labelText = txt
        }

        if (!settingsItem) {
          settingsItem = document.createElement('button')
          settingsItem.type = 'button'
          settingsItem.className = 'dsh-claude-popover-item'
          settingsItem.setAttribute('data-action', 'settings')
          settingsItem.innerHTML =
            '<span class="dsh-claude-popover-item-icon">' +
              '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
                '<circle cx="12" cy="12" r="3"></circle>' +
                '<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>' +
              '</svg>' +
            '</span>' +
            '<span class="dsh-claude-popover-item-text"></span>' +
            '<span class="dsh-claude-popover-item-shortcut">Ctrl+,</span>'
          settingsItem.querySelector('.dsh-claude-popover-item-text').textContent = labelText

          settingsItem.addEventListener('click', function (e) {
            e.stopPropagation()
            hostMenu.openSettings()
          })
          popoverBody.appendChild(settingsItem)
        } else {
          var txtEl = settingsItem.querySelector('.dsh-claude-popover-item-text')
          if (txtEl && txtEl.textContent !== labelText) txtEl.textContent = labelText
        }

        hostMenu.sync()
        // No settings button, but the host's account menu has been read: that is
        // the desktop, whose menu carries 设置 itself, so its row stands in for
        // this one.
        var stepAside = origSettingsTrigger === null && hostMenu.items().length > 0
        if (settingsItem.hidden !== stepAside) settingsItem.hidden = stepAside

        // The takeover hides the host's account row with its settings slot; this
        // covers an account trigger that lives anywhere else. Clicking it would
        // open the host's own menu next to ours.
        var hostTrigger = hostMenu.trigger()
        if (hostTrigger !== null) {
          if (hostTrigger.style.visibility !== 'hidden') hostTrigger.style.visibility = 'hidden'
          if (hostTrigger.style.pointerEvents !== 'none') hostTrigger.style.pointerEvents = 'none'
        }
        mirror.sync(footArea)
      }
      /**
       * Hand the sidebar footer back to the host.
       *
       * The "Collapse the sidebar settings area" preference turns the whole
       * takeover off, so the skin's own nodes go and every marker it put on the
       * host's entries is removed — with the stylesheet's takeover rules gated
       * on the same attribute, the footer then renders exactly as shipped.
       */
      function dropAccountFooter(footArea) {
        cancelClosePopover()
        if (accountBtn !== null && accountBtn.parentElement !== null) accountBtn.parentElement.removeChild(accountBtn)
        if (accountPopover !== null && accountPopover.parentElement !== null) {
          accountPopover.parentElement.removeChild(accountPopover)
        }
        accountBtn = null
        accountPopover = null
        popoverBody = null
        settingsItem = null
        mirror.clear(footArea)
      }
      function syncAccountFooter() {
        var footArea = document.querySelector('[class*="footArea"]')
        if (footArea === null) return

        if (!readPrefs().collapseFooter) {
          dropAccountFooter(footArea)
          return
        }
        var username = profile.name() || getUsername(ctx)

        // Idempotent against a torn-down-less reload: client HMR drops the old
        // fiber's disposals instead of running them, so a previous generation's
        // button and popover are still in the DOM and this fresh scope knows
        // nothing of them. Sweep the strays before deciding whether to build —
        // otherwise the row renders twice (and the orphan keeps a stale name).
        var strayBtns = footArea.querySelectorAll('.dsh-claude-account-btn')
        for (var sb = 0; sb < strayBtns.length; sb++) {
          if (strayBtns[sb] !== accountBtn) strayBtns[sb].parentElement.removeChild(strayBtns[sb])
        }
        var strayPops = document.querySelectorAll('body > .dsh-claude-account-popover')
        for (var sp = 0; sp < strayPops.length; sp++) {
          if (strayPops[sp] !== accountPopover) strayPops[sp].parentElement.removeChild(strayPops[sp])
        }

        if (accountBtn === null || !footArea.contains(accountBtn)) {
          if (accountBtn && accountBtn.parentElement) accountBtn.parentElement.removeChild(accountBtn)
          accountBtn = document.createElement('div')
          accountBtn.className = 'dsh-claude-account-btn'
          accountBtn.setAttribute('role', 'button')
          accountBtn.setAttribute('tabindex', '0')
          accountBtn.setAttribute('aria-haspopup', 'menu')
          accountBtn.setAttribute('aria-expanded', 'false')
          accountBtn.innerHTML =
            '<span class="dsh-claude-account-avatar"></span>' +
            '<span class="dsh-claude-account-label">' +
              '<span class="dsh-claude-account-user"></span>' +
            '</span>' +
            '<span class="dsh-claude-account-chevron"></span>'

          // Hover is the default way in; the "Open popovers on hover"
          // preference turns it off, leaving the click handler below as the only
          // way in (and the only way out, so a click-opened popover does not
          // vanish when the pointer leaves). The account row is the one popover
          // the `account` scope keeps on hover.
          accountBtn.addEventListener('mouseenter', function () {
            if (readPrefs().autoPopover !== AUTO_POPOVER_OFF) popoverHoverIntent.scheduleOpen()
          })
          accountBtn.addEventListener('mouseleave', function () {
            if (readPrefs().autoPopover !== AUTO_POPOVER_OFF && !popoverOpenedByClick) scheduleClosePopover()
          })
          accountBtn.addEventListener('click', function (e) {
            e.stopPropagation()
            togglePopover()
          })
          footArea.appendChild(accountBtn)
        }
        // The name and the picture are user- and host-supplied (a preference, the
        // OS user, the account profile), so they are written as text and as an
        // image source, never spliced into markup — and synced on every pass, so a
        // profile that lands after the row was built still shows up.
        var userEl = accountBtn.querySelector('.dsh-claude-account-user')
        if (userEl && userEl.textContent !== username) userEl.textContent = username
        syncAccountAvatar(accountBtn.querySelector('.dsh-claude-account-avatar'))

        if (accountPopover === null || !footArea.contains(accountPopover)) {
          if (accountPopover && accountPopover.parentElement) accountPopover.parentElement.removeChild(accountPopover)
          accountPopover = document.createElement('div')
          accountPopover.id = 'dsh-claude-account-popover'
          accountPopover.className = 'dsh-claude-account-popover'
          accountPopover.setAttribute('data-open', 'false')

          accountPopover.addEventListener('mouseenter', function () {
            cancelClosePopover()
          })
          accountPopover.addEventListener('mouseleave', function () {
            scheduleClosePopover()
          })

          // The account row is the ban-screen easter egg's trigger
          // (src/overrides/ban-screen.js). The marker attribute stays on the
          // header (it is the row's stable hook, and the row keeps its
          // semantics), but the header is only a WRAPPER: the clickable strip is
          // the inner `.…-row`, and the divider is its SIBLING so the hover
          // plate covers the name alone instead of swallowing the rule.
          var header = document.createElement('div')
          header.className = 'dsh-claude-account-popover-header'
          header.setAttribute('data-dsh-claude-ban-row', '')

          var rowEl = document.createElement('div')
          rowEl.className = 'dsh-claude-account-popover-row'
          rowEl.setAttribute('role', 'button')
          rowEl.setAttribute('tabindex', '0')
          rowEl.setAttribute('aria-haspopup', 'dialog')

          var nameEl = document.createElement('div')
          nameEl.className = 'dsh-claude-account-popover-name'
          nameEl.textContent = username

          var divider = document.createElement('div')
          divider.className = 'dsh-claude-account-popover-divider'

          rowEl.appendChild(nameEl)
          header.appendChild(rowEl)
          header.appendChild(divider)
          accountPopover.appendChild(header)

          popoverBody = document.createElement('div')
          popoverBody.className = 'dsh-claude-account-popover-body'
          accountPopover.appendChild(popoverBody)

          footArea.appendChild(accountPopover)
        } else {
          var nameEl2 = accountPopover.querySelector('.dsh-claude-account-popover-name')
          if (nameEl2 && nameEl2.textContent !== username) nameEl2.textContent = username
        }

        // The account row is the ban-screen easter egg's trigger (ban-screen.js).
        // Bound OUTSIDE the build/refresh branch above so the pass that creates
        // the popover already wires the row — inside the `else` the very first
        // render would leave it dead until the next sync. `__dshBanBound` keeps
        // a later pass from binding it twice, which would open the overlay twice
        // per click.
        var banRow = accountPopover.querySelector('[data-dsh-claude-ban-row]')
        if (banRow && !banRow.__dshBanBound) {
          banRow.__dshBanBound = true
          banRow.addEventListener('click', function (e) {
            // The row's gesture is the easter egg, not a popover selection.
            e.preventDefault()
            e.stopPropagation()
            // Leave the popover up: the overlay is a full-window surface, so
            // what is behind it does not matter, and the footer is left as the
            // user had it once the screen is dismissed. The pointer is still
            // parked on the trigger, so the mouseleave close stays suspended
            // (popoverOpenedByClick) and the panel does not blink out from under
            // the overlay.
            popoverOpenedByClick = true
            if (ui.ban) ui.ban.open()
          })
          banRow.addEventListener('keydown', function (e) {
            if (e.key !== 'Enter' && e.key !== ' ') return
            e.preventDefault()
            e.stopPropagation()
            popoverOpenedByClick = true
            if (ui.ban) ui.ban.open()
          })
        }

        syncPopoverItems(footArea)
      }
      ui.footer = {
        sync: syncAccountFooter,
        /**
         * The drawer's dismiss routes: 'outside' (a press the footer does not
         * own), 'escape' and 'composer'. The shipped scheduler only closed an
         * OPEN drawer on an outside press, so that reason keeps the open check;
         * Esc and composer focus close regardless.
         */
        close: function (reason) {
          if (reason === 'outside' && !(accountPopover && accountPopover.getAttribute('data-open') === 'true')) return
          closePopover()
        },
        openSettings: hostMenu.openSettings,
        owns: function (target) {
          if (!target) return false
          return (accountBtn !== null && accountBtn.contains(target)) ||
                 (accountPopover !== null && accountPopover.contains(target))
        },
        isOpen: function () {
          return !!(accountPopover && accountPopover.getAttribute('data-open') === 'true')
        },
        /** Re-anchor an open drawer after a viewport change; a closed one has
         * nothing to place (the scheduler used to guard this itself). */
        reposition: function () {
          if (!(accountPopover && accountPopover.getAttribute('data-open') === 'true')) return
          positionAccountPopover()
        }
      }
      return function () {
        profile.stop()
        cancelClosePopover()
        var footArea = document.querySelector('[class*="footArea"]')
        if (footArea) {
          dropAccountFooter(footArea)
        } else {
          if (accountBtn !== null && accountBtn.parentElement !== null) accountBtn.parentElement.removeChild(accountBtn)
          if (accountPopover !== null && accountPopover.parentElement !== null) accountPopover.parentElement.removeChild(accountPopover)
          accountBtn = null
          accountPopover = null
          popoverBody = null
          settingsItem = null
        }
      }
    }
