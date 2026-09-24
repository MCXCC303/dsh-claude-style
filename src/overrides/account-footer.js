    /**
     * The account area of the sidebar footer.
     *
     * One row model, two mount points (account/surface.js): on a host that has
     * an account row (Desktop 0.1.7+) that row is the entry and our container is
     * injected into the host's own account menu; on a host without one (Web /
     * 0.1.5) the skin self-builds the trigger and the popover and the popover's
     * body is the container. The rows themselves — the account header with the
     * hold-screen easter egg, the plugin footer entries (account/footer-mirror.js)
     * and, on the self-built path only, the settings row — are shared.
     */
    function installAccountFooter(ctx, ui) {
      /** The marker the stylesheet hangs the host account row's Claude shape on. */
      var HOST_ROW_ATTR = 'data-dsh-claude-account-host-row'
      var profile = createAccountProfile(ctx, function () {
        if (typeof ui.schedule === 'function') ui.schedule()
      })
      var accountBtn = null
      var accountPopover = null
      var popoverBody = null
      var settingsItem = null
      var popoverHoverIntent = createHoverIntent(openPopover, closePopover, POPOVER_OPEN_DELAY, POPOVER_CLOSE_DELAY)
      // Whether the popover is up because it was CLICKED (rather than hovered).
      // Clicking the account row opens the ban-screen easter egg and leaves the
      // pointer inside the popover, so without this the row's own mouseleave
      // would tear the popover down behind the overlay; a click-opened popover
      // instead stays until the pointer leaves the whole footer.
      var popoverOpenedByClick = false

      function isPopoverOpen() {
        return !!(accountPopover && accountPopover.getAttribute('data-open') === 'true')
      }

      function openPopover() {
        if (!accountPopover || !accountBtn) return
        cancelClosePopover()
        // Mirrors are frozen while the popover is open (footer-mirror.sync
        // bails), so reconcile them here — before the reveal — to show fresh
        // content/order and bind click targets for the upcoming interaction.
        try {
          var footArea = document.querySelector('[class*="footArea"]')
          if (footArea) mirror.sync(footArea)
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
        if (isPopoverOpen()) {
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

      var hostMenu = createHostAccountMenu({ close: closePopover })
      var surface = createAccountSurface({
        hostTrigger: hostMenu.trigger,
        findMenu: hostMenu.findMenu,
        menuViewport: hostMenu.menuViewport,
        buildContainer: buildHostContainer,
        syntheticContainer: function () { return popoverBody },
        onMode: onSurfaceMode
      })
      var mirror = createFooterMirror({
        body: function () { return surface.container() },
        anchor: function () { return settingsItem },
        isOpen: function () { return surface.mode() === 'synthetic' && isPopoverOpen() },
        close: closeSurface
      })

      /**
       * The account header: the nickname and the hold-screen easter egg's entry.
       * It is the first row of whichever container is active — the injected
       * container on the host path, the popover's own header on the self-built
       * one. The header is only a WRAPPER: the clickable strip is the inner row,
       * so the hover plate covers the name and not the divider that follows it.
       */
      function buildAccountHeader(username) {
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
        return header
      }

      /**
       * Sync the header of the active container: the nickname and the easter
       * egg's binding. Bound OUTSIDE the build branch so the pass that creates
       * the container already wires the row; `__dshBanBound` keeps a later pass
       * from binding it twice, which would open the overlay twice per click.
       */
      function syncAccountHeader(root) {
        if (root === null) return
        var nameEl = root.querySelector('.dsh-claude-account-popover-name')
        var username = profile.name() || getUsername(ctx)
        if (nameEl && nameEl.textContent !== username) nameEl.textContent = username
        var banRow = root.querySelector('[data-dsh-claude-ban-row]')
        if (banRow && !banRow.__dshBanBound) {
          banRow.__dshBanBound = true
          banRow.addEventListener('click', function (e) {
            // The row's gesture is the easter egg, not a menu selection.
            e.preventDefault()
            e.stopPropagation()
            // Leave the surface up: the overlay is a full-window surface, so
            // what is behind it does not matter, and the footer is left as the
            // user had it once the screen is dismissed.
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
      }

      /** The container injected at the head of the host's account menu. */
      function buildHostContainer() {
        var container = document.createElement('div')
        container.className = 'dsh-claude-account-inject'
        container.appendChild(buildAccountHeader(profile.name() || getUsername(ctx)))
        return container
      }

      /** The settings row, needed on the self-built path only. */
      function buildSettingsItem() {
        var item = document.createElement('button')
        item.type = 'button'
        item.className = 'dsh-claude-popover-item'
        item.setAttribute('data-action', 'settings')
        item.innerHTML =
          '<span class="dsh-claude-popover-item-icon">' +
            '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
              '<circle cx="12" cy="12" r="3"></circle>' +
              '<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>' +
            '</svg>' +
          '</span>' +
          '<span class="dsh-claude-popover-item-text"></span>'
        item.addEventListener('click', function (e) {
          e.stopPropagation()
          hostMenu.openSettings()
        })
        return item
      }

      /**
       * The settings row names and opens whatever the host's settings entry is:
       * its settings button, or the 设置 item of its account menu. The
       * self-built path is used exactly when the host has no account area, so
       * there is no host copy of this row to step aside for.
       */
      function syncSettingsItem() {
        if (settingsItem === null) return
        var labelText = '设置'
        var trigger = hostMenu.settingsTrigger()
        if (trigger) {
          var txt = (trigger.textContent || '').trim()
          if (!txt) txt = trigger.getAttribute('aria-label') || ''
          if (txt) labelText = txt
        }
        var txtEl = settingsItem.querySelector('.dsh-claude-popover-item-text')
        if (txtEl && txtEl.textContent !== labelText) txtEl.textContent = labelText
      }

      /**
       * Build (or reuse) the self-built trigger and popover and return the
       * popover body. Idempotent against a torn-down-less reload: client HMR
       * drops the old fiber's disposals instead of running them, so a previous
       * generation's button and popover are still in the DOM and this fresh
       * scope knows nothing of them. Sweep the strays before deciding whether to
       * build — otherwise the row renders twice (and the orphan keeps a stale
       * name).
       */
      function ensureSynthetic(footArea) {
        var username = profile.name() || getUsername(ctx)
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

          accountPopover.appendChild(buildAccountHeader(username))

          popoverBody = document.createElement('div')
          popoverBody.className = 'dsh-claude-account-popover-body'
          accountPopover.appendChild(popoverBody)

          settingsItem = null
          footArea.appendChild(accountPopover)
        }

        if (settingsItem === null || !popoverBody.contains(settingsItem)) {
          settingsItem = buildSettingsItem()
          popoverBody.appendChild(settingsItem)
        }
        syncSettingsItem()
        return popoverBody
      }

      /** Remove the self-built trigger and popover (the host path's shape). */
      function dropSynthetic() {
        cancelClosePopover()
        if (accountBtn !== null && accountBtn.parentElement !== null) accountBtn.parentElement.removeChild(accountBtn)
        if (accountPopover !== null && accountPopover.parentElement !== null) {
          accountPopover.parentElement.removeChild(accountPopover)
        }
        var strays = document.querySelectorAll('.dsh-claude-account-btn, body > .dsh-claude-account-popover')
        for (var s = 0; s < strays.length; s++) {
          if (strays[s].parentElement) strays[s].parentElement.removeChild(strays[s])
        }
        accountBtn = null
        accountPopover = null
        popoverBody = null
        settingsItem = null
      }

      /**
       * Close the active surface after one of OUR rows was picked. The host's
       * menu belongs to the host: it is dismissed the way the host dismisses it
       * (an Escape its own Menu handles), never by driving its trigger. The
       * self-built popover is ours and closes directly.
       */
      function closeSurface() {
        if (surface.mode() === 'host') {
          var menu = hostMenu.findMenu()
          if (menu !== null) {
            menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
          }
          return
        }
        closePopover()
      }

      function onSurfaceMode(mode) {
        // The host's account row is the entry on that host, so the self-built
        // trigger and popover have no job there.
        if (mode === 'host') dropSynthetic()
      }

      /**
       * Hand the sidebar footer back to the host.
       *
       * The "Collapse the sidebar settings area" preference turns the whole
       * takeover off, so the skin's own nodes and injected container go and
       * every marker it put on the host's entries is removed — with the
       * stylesheet's takeover rules gated on the same attribute, the footer then
       * renders exactly as shipped.
       */
      function dropAccountFooter(footArea) {
        cancelClosePopover()
        dropSynthetic()
        // The menu marker goes with the takeover: an open host menu must not
        // keep the skin's card styling after the footer is handed back.
        surface.clearMenu()
        var injected = document.querySelectorAll('.dsh-claude-account-inject')
        for (var i = 0; i < injected.length; i++) {
          if (injected[i].parentElement) injected[i].parentElement.removeChild(injected[i])
        }
        var marked = document.querySelectorAll('[' + HOST_ROW_ATTR + ']')
        for (var m = 0; m < marked.length; m++) marked[m].removeAttribute(HOST_ROW_ATTR)
        if (footArea) mirror.clear(footArea)
      }

      function syncAccountFooter() {
        var footArea = document.querySelector('[class*="footArea"]')
        if (footArea === null) return

        if (!readPrefs().collapseFooter) {
          dropAccountFooter(footArea)
          return
        }
        surface.sync()
        if (surface.mode() === 'host') {
          dropSynthetic()
        } else {
          ensureSynthetic(footArea)
        }

        // The host's own account row is the entry on the host path: mark it so
        // the stylesheet can repaint it as a Claude row. It is left in the host's
        // DOM and flow, never moved or copied.
        var hostTrigger = hostMenu.trigger()
        if (hostTrigger !== null && !hostTrigger.hasAttribute(HOST_ROW_ATTR)) hostTrigger.setAttribute(HOST_ROW_ATTR, '')

        var root = surface.mode() === 'host' ? surface.container() : accountPopover
        if (root === null) return
        syncAccountHeader(root)
        mirror.sync(footArea)
        // The rail toggle (and any reflow) moves the anchor without a window
        // resize or a page scroll, so an open drawer re-resolves its position at
        // the end of its own pass.
        if (isPopoverOpen()) positionAccountPopover()
      }

      ui.footer = {
        sync: syncAccountFooter,
        /**
         * The self-built drawer's dismiss routes: 'outside' (a press the footer
         * does not own), 'escape' and 'composer'. The shipped scheduler only
         * closed an OPEN drawer on an outside press, so that reason keeps the
         * open check; Esc and composer focus close regardless. On the host path
         * the drawer is null, so this is a no-op and the host keeps its own
         * dismissal.
         */
        close: function (reason) {
          if (reason === 'outside' && !isPopoverOpen()) return
          closePopover()
        },
        openSettings: hostMenu.openSettings,
        /**
         * Ctrl+, opens settings. The scheduler's keydown handler owns the
         * unconditional preventDefault; this returns whether it acted, which the
         * scheduler does not gate on.
         */
        onKey: function (e) {
          if ((e.ctrlKey || e.metaKey) && e.key === ',') {
            hostMenu.openSettings()
            return true
          }
          return false
        },
        owns: function (target) {
          if (!target) return false
          if (accountBtn !== null && accountBtn.contains(target)) return true
          if (accountPopover !== null && accountPopover.contains(target)) return true
          var container = surface.container()
          return container !== null && container.contains(target)
        },
        isOpen: function () { return isPopoverOpen() },
        /** Re-anchor an open drawer after a viewport change; a closed one has
         * nothing to place. */
        reposition: function () {
          if (!isPopoverOpen()) return
          positionAccountPopover()
        }
      }
      return function () {
        profile.stop()
        var footArea = document.querySelector('[class*="footArea"]')
        dropAccountFooter(footArea)
      }
    }
