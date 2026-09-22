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
      /** The context meter this skin last moved out of the host's dock line. */
      var dockedMeter = null
      /** Identity of the stats bindings THIS generation installed (see bindStatsHover). */
      var statsBindingToken = {}

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

        permHoverIntent = createHoverIntent(openPerm, closePermMenu, 150)

        btn.addEventListener('mouseenter', function () {
          if (readPrefs().autoPopover === AUTO_POPOVER_ALL) openPerm()
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
        permLabel.textContent = matchedLabel

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
       * Merge the session-stats pills into the composer toolbar row so the
       * controls and the stats share ONE line. The host renders the pills
       * (the `conversation.composer.dock` slot) as the card's sibling — a
       * full-width line of their own below the input box; the skin moves
       * them into the row, right before the trailing model/status group.
       * A host re-render can put them back, so the move is re-applied on
       * every pass and is a no-op once they are in place.
       */
      function mergeStatsIntoRow() {
        var stats = document.querySelector('[data-composer-stats]')
        if (!stats) return
        var active = ui.copy.isComposerActive()
        if (!active) {
          if (stats.parentElement && stats.parentElement.matches && stats.parentElement.matches('[class*="_row"]')) {
            var card = stats.closest('[data-composer-card]')
            if (card && card.parentElement) {
              card.parentElement.insertBefore(stats, card.nextSibling)
            }
          }
          return
        }
        // `[class*="_row"]`, not `[class*="row"]`: the bare substring also
        // matches the input growth wrapper (`grow` contains `row`).
        var row = null
        if (stats.parentElement && stats.parentElement.matches && stats.parentElement.matches('[class*="_row"]')) {
          row = stats.parentElement
        } else {
          // Host default: the pills sit in a slot anchor beside the card.
          // Walk up to the nearest ancestor that also holds a composer card.
          var node = stats.parentElement
          while (node && node !== document.body && row === null) {
            var card = node.querySelector('[data-composer-card]')
            if (card) {
              var r = card.querySelector('[class*="_row"]')
              if (r) row = r
            }
            node = node.parentElement
          }
        }
        if (row === null) return
        var trailing = row.querySelector('[class*="trailing"]')
        var inPlace = stats.parentElement === row &&
          (trailing !== null ? stats.nextElementSibling === trailing : row.lastElementChild === stats)
        if (inPlace) return
        if (trailing !== null) row.insertBefore(stats, trailing)
        else row.appendChild(stats)
      }

      /** The composer's dock line: the stack child that is not the card. The host
       * parks the stats pills there, and since 0.1.7 the context meter too. */
      function composerDock(card) {
        var stack = card.parentElement
        if (stack === null) return null
        for (var i = 0; i < stack.children.length; i++) {
          if (stack.children[i] !== card) return stack.children[i]
        }
        return null
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

      /**
       * Merge the context-occupancy meter into the toolbar row beside the stats.
       * DSH 0.1.7 moved the meter out of the input bar's trailing cluster into
       * the dock line below the card, so a skin that merges only the stats
       * leaves it alone on a line of its own — a stray marker on a second row.
       * Older hosts keep it inside the card, where this finds nothing to move.
       * A host re-render can put it back, so the move is re-applied every pass.
       */
      function mergeContextMeterIntoRow() {
        var card = document.querySelector('[data-composer-card]')
        if (card === null) return
        var dock = composerDock(card)
        var row = card.querySelector('[class*="_row"]')
        if (row === null) return
        if (!ui.copy.isComposerActive()) {
          if (dockedMeter !== null && dock !== null && row.contains(dockedMeter)) dock.appendChild(dockedMeter)
          return
        }
        var meter = dockedContextMeter(dock)
        if (meter === null) return
        dockedMeter = meter
        // The stamp is what the stylesheet hangs the shared composer-line type
        // on: the host's own class names are hashed per build, and the ring's
        // trigger has no other stable hook.
        meter.setAttribute('data-dsh-claude-context-meter', '')
        var trailing = row.querySelector('[class*="trailing"]')
        if (trailing === null) { row.appendChild(meter); return }
        // Right of the model trigger, which lives inside the trailing cluster:
        // park the ring after whichever trailing child owns that trigger (our
        // own button when the skin draws the seat, the host's cluster when the
        // picker preference hands it back).
        var anchor = trailing.querySelector('[class*="standardControls"]')
        var modelBtn = trailing.querySelector('.dsh-claude-model-btn')
        if (modelBtn !== null) {
          var node = modelBtn
          while (node.parentElement !== null && node.parentElement !== trailing) node = node.parentElement
          if (node.parentElement === trailing) anchor = node
        }
        if (anchor !== null) trailing.insertBefore(meter, anchor.nextSibling)
        else trailing.appendChild(meter)
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


      /**
       * Merge the host's time and usage pills into one compact sentence and
       * write it into CSS variables. The host keeps ownership of the data and
       * the two click targets; CSS hides its icons/labels and renders the
       * combined text, so React never sees its own DOM rewritten.
       */
      var statsPopover = null
      var statsHideTimer = null

      function statsEscape(value) {
        return String(value === void 0 || value === null ? '' : value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
      }

      function statsRowsFrom(panel) {
        var rows = []
        if (panel === null) return rows
        var dts = panel.querySelectorAll('dt')
        for (var i = 0; i < dts.length; i++) {
          var dd = dts[i].nextElementSibling
          rows.push({
            label: (dts[i].textContent || '').trim(),
            value: dd === null ? '' : (dd.textContent || '').trim(),
          })
        }
        return rows
      }

      function statsPanelData(selector) {
        var panel = document.querySelector(selector)
        return {
          title: panel === null ? '' : (panel.getAttribute('aria-label') || ''),
          rows: statsRowsFrom(panel),
        }
      }

      function withStatsPanel(button, selector, done) {
        if (button === null) { done({ title: '', rows: [] }); return }
        if (button.getAttribute('aria-expanded') !== 'true') button.click()
        var attempts = 0
        function read() {
          var panel = document.querySelector(selector)
          if (panel === null && attempts < 15) {
            attempts += 1
            setTimeout(read, 20)
            return
          }
          var data = statsPanelData(selector)
          if (button.getAttribute('aria-expanded') === 'true') button.click()
          done(data)
        }
        setTimeout(read, 20)
      }

      function collectStatsData(done) {
        var root = document.querySelector('[data-composer-stats]')
        if (root === null) { done([]); return }
        var buttons = root.querySelectorAll('button')
        var timeBtn = null
        var usageBtn = null
        for (var i = 0; i < buttons.length; i++) {
          var aria = buttons[i].getAttribute('aria-label') || ''
          if (/轮|步|turns?|steps?/i.test(aria)) timeBtn = buttons[i]
          else usageBtn = buttons[i]
        }
        withStatsPanel(timeBtn, '[role="dialog"]:has([data-session-stats-details])', function (timeData) {
          withStatsPanel(usageBtn, '[role="dialog"]:has([data-session-stats-usage])', function (usageData) {
            var sections = []
            if (timeData.rows.length > 0) sections.push(timeData)
            if (usageData.rows.length > 0) sections.push(usageData)
            done(sections)
          })
        })
      }

      function ensureStatsPopover() {
        if (statsPopover !== null) return statsPopover
        statsPopover = document.createElement('div')
        statsPopover.className = 'dsh-claude-stats-popover'
        statsPopover.setAttribute('data-open', 'false')
        statsPopover.addEventListener('mouseenter', function () {
          if (statsHideTimer) {
            clearTimeout(statsHideTimer)
            statsHideTimer = null
          }
        })
        statsPopover.addEventListener('mouseleave', scheduleHideStatsPopover)
        document.body.appendChild(statsPopover)
        return statsPopover
      }

      function hideStatsPopover() {
        if (statsPopover !== null) statsPopover.setAttribute('data-open', 'false')
      }

      /**
       * Drop stats cards left behind by a previous client generation.
       *
       * Client HMR drops the old fiber's disposals, so the teardown never runs:
       * the previous generation's card stays in <body> holding its last content
       * and `data-open="true"` — a second, frozen popover sitting beside the
       * live one (which is why the two read differently: the stale card shows
       * whatever sections it was last rendered with). The model picker and the
       * account footer sweep their own strays the same way; the stats card was
       * the one that did not.
       */
      function sweepStrayStatsPopovers() {
        var strays = document.querySelectorAll('body > .dsh-claude-stats-popover')
        for (var i = 0; i < strays.length; i++) {
          if (strays[i] !== statsPopover) strays[i].parentElement.removeChild(strays[i])
        }
      }

      function scheduleHideStatsPopover() {
        if (statsHideTimer) clearTimeout(statsHideTimer)
        statsHideTimer = setTimeout(function () {
          statsHideTimer = null
          hideStatsPopover()
        }, 160)
      }

      function renderStatsPopover(sections) {
        var pop = ensureStatsPopover()
        var html = '<div class="dsh-claude-stats-popover-body">'
        for (var sIndex = 0; sIndex < sections.length; sIndex++) {
          var section = sections[sIndex]
          if (section.rows.length === 0) continue
          if (section.title) html += '<div class="dsh-claude-stats-popover-section">' + statsEscape(section.title) + '</div>'
          html += '<div class="dsh-claude-stats-popover-grid">'
          for (var r = 0; r < section.rows.length; r++) {
            html += '<div class="dsh-claude-stats-popover-item">'
              + '<div class="dsh-claude-stats-popover-label">' + statsEscape(section.rows[r].label) + '</div>'
              + '<div class="dsh-claude-stats-popover-value">' + statsEscape(section.rows[r].value) + '</div>'
              + '</div>'
          }
          html += '</div>'
        }
        html += '</div>'
        pop.innerHTML = html
      }

      function showStatsPopover(anchor) {
        if (statsHideTimer) {
          clearTimeout(statsHideTimer)
          statsHideTimer = null
        }
        collectStatsData(function (sections) {
          if (sections.length === 0) return
          renderStatsPopover(sections)
          var pop = ensureStatsPopover()
          pop.setAttribute('data-open', 'true')
          var live = document.querySelector('[data-composer-stats]') || anchor
          var rect = live.getBoundingClientRect()
          var width = pop.offsetWidth
          var height = pop.offsetHeight
          var left = Math.max(8, Math.min(rect.left + rect.width / 2 - width / 2, window.innerWidth - width - 8))
          var top = Math.max(8, rect.top - height - 8)
          pop.style.left = left + 'px'
          pop.style.top = top + 'px'
        })
      }

      function bindStatsHover(root) {
        // Generation-scoped, not a plain boolean: the host owns the stats node
        // and reuses it across a client HMR reload, so a boolean left by the
        // previous generation made this one skip binding entirely — the OLD
        // closure kept serving the card (its content, its stale node) while this
        // generation's listeners never existed.
        if (root.__dshStatsHoverToken === statsBindingToken) return
        root.__dshStatsHoverToken = statsBindingToken
        var openTimer = null
        function cancelOpen() {
          if (openTimer) {
            clearTimeout(openTimer)
            openTimer = null
          }
        }
        // Hover still opens the card under "All" — the setting promises exactly
        // that — but only after a deliberate dwell: the stats sentence sits in
        // the MIDDLE of the composer row, so a pointer on its way from the
        // permission selector to the model trigger used to unfold the card on
        // the way past. A passing pointer never stays the dwell out; a pointer
        // the user actually parked there does.
        root.addEventListener('mouseenter', function () {
          cancelOpen()
          if (readPrefs().autoPopover !== AUTO_POPOVER_ALL) return
          openTimer = setTimeout(function () {
            openTimer = null
            showStatsPopover(root)
          }, 300)
        })
        root.addEventListener('mouseleave', function () {
          cancelOpen()
          // Unconditional, unlike the open side: a card opened by CLICK has to
          // close when the pointer leaves, whatever the hover switch says.
          scheduleHideStatsPopover()
        })
        // The host's own stats dialogs are hidden by the stylesheet, so a click
        // has to land somewhere: it opens this card — the only stats surface
        // left when the hover switch is off or scoped to the account rail.
        //
        // Only a REAL click counts. Collecting the card's content means clicking
        // the host's two pills to open their dialogs, and those synthetic clicks
        // bubble back up to this listener: re-entering the collection from
        // inside itself made two reads race, which is why sections went missing
        // (the card kept flipping between "会话统计 + Token 用量" and "Token 用量"
        // alone) and why the card stopped closing — every re-entry cancelled the
        // pending hide.
        root.addEventListener('click', function (event) {
          if (event && event.isTrusted === false) return
          cancelOpen()
          showStatsPopover(root)
        })
      }

      function syncStatsSummary() {
        var root = document.querySelector('[data-composer-stats]')
        if (root === null) return
        var buttons = root.querySelectorAll('button')
        var timeText = ''
        var usageText = ''
        for (var i = 0; i < buttons.length; i++) {
          var button = buttons[i]
          var aria = button.getAttribute('aria-label') || ''
          var parts = aria.split(' · ')
          var isTime = /轮|步|turns?|steps?/i.test(aria)
          if (isTime) {
            var counts = (parts[0] || '').match(/\d[\d,]*/g) || []
            var turns = counts[0] || '0'
            var steps = counts[1] || '0'
            var tps = (parts[1] || '').match(/([\d.,]+[KMB]?)\s*tok\/s/i)
            timeText = turns + '轮' + steps + '步' + (tps ? ' · ' + tps[1] + 'tok/s' : '')
          } else {
            var total = (parts[0] || '').match(/([\d.,]+[KMB]?)\s*tok/i)
            var cache = (parts[1] || '').match(/([\d.]+)\s*%/)
            usageText = (total ? total[1] + ' tok' : (parts[0] || '')) + (cache ? ' · ' + cache[1] + '% Cache' : '')
          }
        }
        if (buttons.length === 1) {
          var only = timeText || usageText
          timeText = only
          usageText = only
        }
        // content: var(...) needs a quoted <string>; an unquoted token stream
        // is invalid and computes to `none`.
        root.style.setProperty('--dsh-stats-time', JSON.stringify(timeText))
        root.style.setProperty('--dsh-stats-usage', JSON.stringify(usageText))
        bindStatsHover(root)
      }

      ui.permissions = {
        sync: function () {
          syncAttachmentState()
          mergeStatsIntoRow()
          mergeContextMeterIntoRow()
          sweepStrayStatsPopovers()
          syncStatsSummary()
          syncSegments()
          syncChatTabComposer()
        },
        closeMenu: closePermMenu,
        closeStats: hideStatsPopover
      }

      return function () {
        if (statsHideTimer) {
          clearTimeout(statsHideTimer)
          statsHideTimer = null
        }
        if (statsPopover !== null && statsPopover.parentElement !== null) statsPopover.parentElement.removeChild(statsPopover)
        statsPopover = null
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
      }
    }
