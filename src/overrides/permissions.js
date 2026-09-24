    function installPermissions(ctx, ui) {
      var segments = null
      var permContainer = null
      var permBtn = null
      var permLabel = null
      var permPopover = null
      var permHoverIntent = null

      function buildSegments(onPick) {
        var group = document.createElement('div')
        group.className = SEGMENTS_CLASS
        group.setAttribute('role', 'radiogroup')
        group.setAttribute('aria-label', 'Permission')
        group.setAttribute('data-composer-segments', '')
        for (var i = 0; i < PERMISSION_SEGMENTS.length; i++) {
          var spec = PERMISSION_SEGMENTS[i]
          var item = document.createElement('button')
          item.type = 'button'
          item.className = SEGMENT_CLASS
          item.setAttribute('role', 'radio')
          item.setAttribute('data-preset', spec.preset)
          item.textContent = spec.label
          group.appendChild(item)
        }
        group.addEventListener('click', function (event) {
          var target = event.target
          var item = target !== null && typeof target.closest === 'function' ? target.closest('.' + SEGMENT_CLASS) : null
          if (item === null || !group.contains(item)) return
          onPick(item.getAttribute('data-preset'))
        })
        return group
      }

      var permDocPointerListener = null
      var permResizeListener = null
      /** The session-stats card (src/overrides/session-stats.js). */
      var stats = createSessionStats()

      /** Every dismiss route (item pick, outside pointer, resize/scroll, Escape) closes the menu through this one path. */
      function closePermMenu() {
        if (permBtn === null || permPopover === null) return
        permBtn.removeAttribute('data-open')
        permBtn.setAttribute('aria-expanded', 'false')
        permPopover.removeAttribute('data-open')
      }

      function buildPermTriggerAndPopover(onPick) {
        var container = document.createElement('div')
        container.className = 'dsh-claude-perm-container'

        var btn = document.createElement('button')
        btn.type = 'button'
        btn.className = 'dsh-claude-perm-btn'
        btn.setAttribute('aria-haspopup', 'menu')
        btn.setAttribute('aria-expanded', 'false')

        var label = document.createElement('span')
        label.className = 'dsh-claude-perm-label'
        label.textContent = 'Accept edits'

        var chevron = document.createElement('span')
        chevron.className = 'dsh-claude-perm-chevron'
        chevron.setAttribute('aria-hidden', 'true')

        btn.appendChild(label)
        btn.appendChild(chevron)

        var popover = document.createElement('div')
        popover.className = 'dsh-claude-perm-popover'
        popover.setAttribute('role', 'menu')

        for (var i = 0; i < PERMISSION_OPTIONS.length; i++) {
          var opt = PERMISSION_OPTIONS[i]
          var item = document.createElement('button')
          item.type = 'button'
          item.className = 'dsh-claude-popover-item'
          item.setAttribute('role', 'menuitem')
          item.setAttribute('data-preset', opt.preset)

          var col = document.createElement('div')
          col.style.cssText = 'display:flex; flex-direction:column; gap:2px; flex:1; text-align:left; min-width:0;'

          var itemTitle = document.createElement('span')
          itemTitle.style.cssText = 'font-weight:500; font-size:13px; line-height:16px;'
          itemTitle.textContent = opt.label

          var itemDesc = document.createElement('span')
          itemDesc.style.cssText = 'font-size:11px; line-height:14px; color:var(--dsw-alias-label-tertiary);'
          itemDesc.textContent = opt.desc

          col.appendChild(itemTitle)
          col.appendChild(itemDesc)
          item.appendChild(col)

          var check = document.createElement('span')
          check.className = 'dsh-claude-perm-check'
          check.style.cssText = 'font-size:12px; color:var(--dsw-alias-brand-primary, #d97757); margin-left:8px; display:none;'
          check.textContent = '✓'
          item.appendChild(check)

          item.addEventListener('click', (function (preset) {
            return function (e) {
              e.stopPropagation()
              closePermMenu()
              onPick(preset)
            }
          })(opt.preset))

          popover.appendChild(item)
        }

        function openPerm() {
          if (permHoverIntent) permHoverIntent.cancel()
          var rect = btn.getBoundingClientRect()
          popover.style.left = Math.max(8, rect.left) + 'px'
          popover.style.bottom = Math.max(8, window.innerHeight - rect.top + 6) + 'px'
          btn.setAttribute('data-open', 'true')
          btn.setAttribute('aria-expanded', 'true')
          popover.setAttribute('data-open', 'true')
        }

        permHoverIntent = createHoverIntent(openPerm, closePermMenu, POPOVER_OPEN_DELAY, POPOVER_CLOSE_DELAY)

        btn.addEventListener('mouseenter', function () {
          if (readPrefs().autoPopover === AUTO_POPOVER_ALL) permHoverIntent.scheduleOpen()
        })
        btn.addEventListener('mouseleave', function () {
          if (readPrefs().autoPopover === AUTO_POPOVER_ALL) permHoverIntent.scheduleClose()
        })
        popover.addEventListener('mouseenter', function () {
          permHoverIntent.cancel()
        })
        popover.addEventListener('mouseleave', function () {
          permHoverIntent.scheduleClose()
        })

        btn.addEventListener('click', function (e) {
          e.stopPropagation()
          var isOpen = btn.getAttribute('data-open') === 'true'
          if (isOpen) {
            closePermMenu()
          } else {
            openPerm()
          }
        })

        if (!permDocPointerListener) {
          permDocPointerListener = function (e) {
            if (permPopover && permBtn && permPopover.getAttribute('data-open') === 'true') {
              if (!permBtn.contains(e.target) && !permPopover.contains(e.target)) closePermMenu()
            }
          }
          document.addEventListener('pointerdown', permDocPointerListener)
        }

        if (!permResizeListener) {
          permResizeListener = function () {
            if (permPopover && permBtn && permPopover.getAttribute('data-open') === 'true') closePermMenu()
          }
          window.addEventListener('resize', permResizeListener)
          window.addEventListener('scroll', permResizeListener, true)
        }

        container.appendChild(btn)
        document.body.appendChild(popover)

        return {
          container: container,
          btn: btn,
          label: label,
          popover: popover
        }
      }

      function updatePermState(preset) {
        if (!permLabel || !permPopover) return
        var matchedLabel = 'Accept edits'
        for (var i = 0; i < PERMISSION_OPTIONS.length; i++) {
          if (PERMISSION_OPTIONS[i].preset === preset) {
            matchedLabel = PERMISSION_OPTIONS[i].label
            break
          }
        }
        // Same-value guard: this runs on every pass, and an identical
        // textContent write still replaces the text node — a mutation that
        // schedules the next pass, so the page never went idle.
        if (permLabel.textContent !== matchedLabel) permLabel.textContent = matchedLabel

        var items = permPopover.querySelectorAll('[data-preset]')
        for (var j = 0; j < items.length; j++) {
          var it = items[j]
          var isCurrent = it.getAttribute('data-preset') === preset
          var check = it.querySelector('.dsh-claude-perm-check')
          if (check) {
            check.style.display = isCurrent ? 'inline' : 'none'
          }
          if (isCurrent) {
            it.setAttribute('data-active', '')
          } else {
            it.removeAttribute('data-active')
          }
        }
      }

      function submitPreset(preset) {
        var session = currentSession(ctx)
        if (session === null) return
        var settled = session.command('/permission ' + preset)
        if (settled !== void 0 && typeof settled.then === 'function') settled.then(ui.schedule, ui.schedule)
      }

      /**
       * Drive the shipped access menu to its full-access row, so the switch
       * runs through the shipped risk-confirmation dialog rather than a
       * skin-owned prompt. The trigger is hidden by this skin but still in
       * the tree, so a synthetic click still opens the menu; the row is then
       * picked by its label. A plain confirm stands in only when that menu
       * cannot be reached, which keeps the switch behind an explicit
       * acknowledgement either way.
       */
      function openShippedGate() {
        var trigger = findAccessTrigger()
        if (trigger === null) {
          if (window.confirm(GATED_PROMPT)) submitPreset(GATED_PRESET)
          return
        }
        trigger.click()
        var attempts = 0
        function seek() {
          var items = document.querySelectorAll('[role="menu"] button[role="menuitem"]')
          for (var i = 0; i < items.length; i++) {
            var text = (items[i].textContent || '').trim()
            for (var j = 0; j < FULL_ACCESS_LABELS.length; j++) {
              if (text === FULL_ACCESS_LABELS[j]) {
                items[i].click()
                return
              }
            }
          }
          attempts += 1
          if (attempts < 20) {
            requestAnimationFrame(seek)
            return
          }
          trigger.click()
          if (window.confirm(GATED_PROMPT)) submitPreset(GATED_PRESET)
        }
        requestAnimationFrame(seek)
      }

      function pick(preset) {
        var session = currentSession(ctx)
        if (session === null || preset === null) return
        if (preset === currentPreset(session)) return
        if (preset === GATED_PRESET) {
          openShippedGate()
          return
        }
        submitPreset(preset)
      }

      function syncAttachmentState() {
        var active = ui.copy.isComposerActive()
        var cards = document.querySelectorAll('[data-composer-card]')
        for (var ci = 0; ci < cards.length; ci++) {
          var card = cards[ci]
          if (!active) {
            if (card.hasAttribute('data-has-attachments')) {
              card.removeAttribute('data-has-attachments')
            }
            continue
          }
          var hasAtt = card.querySelector('._54WpYG_imageItem, [class*="imageItem"], [class*="thumbnail"], [class*="FileCard"], [class*="rail"]:not([class*="trailing"]) [class*="item"], [class*="rail"]:not([class*="trailing"]) img, [class*="rail"]:not([class*="trailing"]) [class*="card"]') !== null
          if (hasAtt) {
            if (card.getAttribute('data-has-attachments') !== 'true') {
              card.setAttribute('data-has-attachments', 'true')
            }
          } else {
            if (card.hasAttribute('data-has-attachments')) {
              card.removeAttribute('data-has-attachments')
            }
          }
        }
        if (ui.copy && ui.copy.syncAttachmentPlaceholder) ui.copy.syncAttachmentPlaceholder()
      }

      /**
       * The composer's dock line, which the host renders right after the card
       * (a notice line, when there is one, sits before it).
       */
      function composerDock(card) {
        return card.nextElementSibling
      }

      /** The meter the host parks in that dock, or null when it is not there. */
      function dockedContextMeter(dock) {
        if (dock === null) return null
        var triggers = dock.querySelectorAll('button[aria-haspopup="dialog"]')
        for (var i = 0; i < triggers.length; i++) {
          // The meter's trigger IS the occupancy reading ("42%") and no stats
          // pill ever is, so the label alone identifies it without a class name
          // (the host hashes those per build).
          if (!/^\d{1,3}%$/.test((triggers[i].textContent || '').trim())) continue
          var node = triggers[i]
          while (node.parentElement !== null && node.parentElement !== dock) node = node.parentElement
          return node
        }
        return null
      }

      /** The room the meter takes at the toolbar row's right end, as last written. */
      var meterRoom = ''

      /**
       * Stamp the context-occupancy meter and keep its room on the toolbar row.
       *
       * The meter stays in the host's dock line, its native React parent: moving
       * it out crashed React's unmount (Node.removeChild). The stylesheet lays
       * the dock over the toolbar row and puts the meter at the row's right end,
       * after the model and effort triggers; the trailing cluster keeps that
       * room free through --dsh-claude-meter-room — the meter's width plus the
       * cluster's own 8px gap, written only on a change.
       */
      function stampContextMeter() {
        var card = document.querySelector('[data-composer-card]')
        var meter = card === null ? null : dockedContextMeter(composerDock(card))
        var room = ''
        if (meter !== null) {
          if (!meter.hasAttribute('data-dsh-claude-context-meter')) meter.setAttribute('data-dsh-claude-context-meter', '')
          if (ui.copy.isComposerActive() && meter.offsetWidth > 0) room = (meter.offsetWidth + 8) + 'px'
        }
        if (room === meterRoom) return
        meterRoom = room
        if (room === '') document.body.style.removeProperty('--dsh-claude-meter-room')
        else document.body.style.setProperty('--dsh-claude-meter-room', room)
      }

      // Re-insert when a re-render swapped the host row, then mirror the running preset.
      function syncSegments() {
        var isHero = ui.copy.isHeroView()
        var value = isHero ? 'hero' : 'inline'
        var allCards = document.querySelectorAll('[data-composer-card]')
        // Mirror the variant onto the card's composerStack ancestor, so
        // stack-scoped rules read an attribute instead of re-deriving
        // hero/inline through :has() on every DOM mutation. Write only when
        // the value differs (re-setting the same value still invalidates
        // the element's styles), and once per stack even when several cards
        // share one.
        var syncedStacks = []
        for (var c = 0; c < allCards.length; c++) {
          var card = allCards[c]
          card.setAttribute('data-composer-variant', value)
          var stack = card.closest('[class*="composerStack"]')
          if (stack !== null && syncedStacks.indexOf(stack) === -1) {
            if (stack.getAttribute('data-composer-variant') !== value) {
              stack.setAttribute('data-composer-variant', value)
            }
            syncedStacks.push(stack)
          }
        }

        var composerOn = ui.copy.isComposerActive()
        if (composerOn) document.body.setAttribute(COMPOSER_ATTR, '')
        else document.body.removeAttribute(COMPOSER_ATTR)

        var existingPermContainers = document.querySelectorAll('.dsh-claude-perm-container')
        var existingSegments = document.querySelectorAll('.' + SEGMENTS_CLASS + '[data-composer-segments]')

        if (!composerOn) {
          for (var ep = 0; ep < existingPermContainers.length; ep++) {
            existingPermContainers[ep].remove()
          }
          if (permPopover && permPopover.parentElement) {
            permPopover.parentElement.removeChild(permPopover)
          }
          permContainer = null
          permBtn = null
          permLabel = null
          permPopover = null

          for (var es0 = 0; es0 < existingSegments.length; es0++) {
            existingSegments[es0].remove()
          }
          segments = null
          return
        }

        var trigger = findAccessTrigger()
        if (trigger === null) return
        var host = trigger.parentElement
        if (host === null) return

        var session = currentSession(ctx)
        var preset = session === null ? null : currentPreset(session)

        if (isHero) {
          for (var i = 0; i < existingPermContainers.length; i++) {
            existingPermContainers[i].remove()
          }
          if (permPopover && permPopover.parentElement) {
            permPopover.parentElement.removeChild(permPopover)
          }
          permContainer = null
          permBtn = null
          permLabel = null
          permPopover = null

          if (existingSegments.length > 1) {
            for (var s = 1; s < existingSegments.length; s++) existingSegments[s].remove()
          }
          if (existingSegments.length === 1 && host.contains(existingSegments[0])) {
            segments = existingSegments[0]
          } else {
            for (var s2 = 0; s2 < existingSegments.length; s2++) existingSegments[s2].remove()
            segments = buildSegments(pick)
            host.insertBefore(segments, host.firstChild)
          }
          for (var j = 0; j < segments.children.length; j++) {
            var item = segments.children[j]
            if (item.getAttribute('data-preset') === preset) {
              item.setAttribute('data-active', '')
              item.setAttribute('aria-checked', 'true')
            } else {
              item.removeAttribute('data-active')
              item.setAttribute('aria-checked', 'false')
            }
          }
        } else {
          for (var es = 0; es < existingSegments.length; es++) {
            existingSegments[es].remove()
          }
          segments = null

          var allExisting = document.querySelectorAll('.dsh-claude-perm-container')
          if (allExisting.length > 0) {
            permContainer = allExisting[0]
            for (var p = 1; p < allExisting.length; p++) {
              allExisting[p].remove()
            }
            if (permContainer.parentElement !== host) {
              host.insertBefore(permContainer, host.firstChild)
            }
            permBtn = permContainer.querySelector('.dsh-claude-perm-btn')
            permLabel = permContainer.querySelector('.dsh-claude-perm-label')
          } else {
            var res = buildPermTriggerAndPopover(pick)
            permContainer = res.container
            permBtn = res.btn
            permLabel = res.label
            permPopover = res.popover
            host.insertBefore(permContainer, host.firstChild)
          }
          updatePermState(preset)
        }
      }

      /**
       * The composer is chat-view-only. The host mounts the seat inside the
       * conversation root on every tab (轨迹 / 上下文 even reserve room for
       * it), so the skin reflects the active view on <body> and CSS drops the
       * whole bottom area unless the chat tab is selected.
       *
       * Scope: the conversation tablist lives in the panel header, which is
       * the root's first child — any other tablist (the trajectory detail
       * panel, say) renders later inside the ledger. The chat view registers
       * at order 0, so it is always the tablist's FIRST tab; reading that
       * tab's aria-selected is locale-independent. No tab bar at all (hero /
       * single view) means the chat surface is all there is.
       */
      function syncChatTabComposer() {
        if (!ui.copy.isComposerActive()) {
          document.body.removeAttribute('data-dsh-claude-composer-hidden')
          return
        }
        var chatActive = true
        var seat = document.querySelector('[data-composer-seat]')
        var root = seat && seat.closest ? seat.closest('[data-phase]') : null
        if (root) {
          var list = root.querySelector('[role="tablist"]')
          if (list) {
            var first = list.querySelector('[role="tab"]')
            if (first) chatActive = first.getAttribute('aria-selected') === 'true'
          }
        }
        if (chatActive) document.body.removeAttribute('data-dsh-claude-composer-hidden')
        else document.body.setAttribute('data-dsh-claude-composer-hidden', '')
      }


      ui.permissions = {
        sync: function () {
          syncAttachmentState()
          stampContextMeter()
          stats.sync()
          syncSegments()
          syncChatTabComposer()
        },
        /**
         * Esc closes the menu; composer focus additionally closes the stats
         * card. There is deliberately no 'outside' route — the menu runs its
         * own document pointerdown listener (see buildPermTriggerAndPopover).
         */
        close: function (reason) {
          closePermMenu()
          if (reason === 'composer') stats.close()
        }
      }

      return function () {
        stats.teardown()
        if (permHoverIntent) permHoverIntent.cancel()
        if (permDocPointerListener) {
          document.removeEventListener('pointerdown', permDocPointerListener)
          permDocPointerListener = null
        }
        if (permResizeListener) {
          window.removeEventListener('resize', permResizeListener)
          window.removeEventListener('scroll', permResizeListener, true)
          permResizeListener = null
        }
        if (segments !== null && segments.parentElement !== null) segments.parentElement.removeChild(segments)
        segments = null
        if (permPopover !== null && permPopover.parentElement !== null) permPopover.parentElement.removeChild(permPopover)
        permPopover = null
        permBtn = null
        permLabel = null
        permContainer = null
        var stampedMeters = document.querySelectorAll('[data-dsh-claude-context-meter]')
        for (var sm = 0; sm < stampedMeters.length; sm++) stampedMeters[sm].removeAttribute('data-dsh-claude-context-meter')
        if (meterRoom !== '') {
          meterRoom = ''
          document.body.style.removeProperty('--dsh-claude-meter-room')
        }
      }
    }
