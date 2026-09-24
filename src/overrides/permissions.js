    function installPermissions(ctx, ui) {
      var segments = null
      var permContainer = null
      var permBtn = null
      var permLabel = null
      var permPopover = null
      var permHoverIntent = null

      /**
       * Whether the host's permission catalog carries the live Auto review
       * preset (`auto`, registered by the auto-review plugin): true or false
       * once a catalog read settled, null until then. While unknown the rows
       * stay hidden, the way the shipped picker renders nothing before its
       * first catalog read.
       */
      var autoPresetLive = null
      /** The first catalog failure; thrown on the next sync to retire the feature. */
      var autoPresetError = null
      var catalogFiber = null
      var catalogChangedDisposer = null

      /** The Auto review rows are only offered while the host's catalog carries the preset. */
      function rowVisible(preset) {
        return preset !== AUTO_REVIEW_PRESET || autoPresetLive === true
      }

      /**
       * Mirror the availability onto a row as data-hidden; the stylesheet turns
       * that into display:none (an inline style would lose to the popover
       * item's own `display: flex !important`).
       */
      function syncRowVisibility(row, preset) {
        if (rowVisible(preset)) {
          if (row.hasAttribute('data-hidden')) row.removeAttribute('data-hidden')
        } else if (!row.hasAttribute('data-hidden')) {
          row.setAttribute('data-hidden', '')
        }
      }

      /**
       * Read the host's permission catalog and record whether it carries the
       * live Auto review preset. The shipped picker builds its rows from the
       * same catalog, so it is the authority on what is switchable. A rejected
       * read retries like the account profile's reads (the client connection
       * may still be coming up at install); once the retries are exhausted the
       * failure is remembered and thrown on the next sync, which retires this
       * feature and hands the shipped access button back (D12).
       */
      var AUTO_PRESET_RETRY_MS = [1000, 5000]
      var autoPresetRetries = 0
      var autoPresetRead = 0
      var autoPresetRetry = null

      /** Invalidate the read in flight and drop any retry still waiting. */
      function dropAutoPresetRead() {
        autoPresetRead++
        if (autoPresetRetry !== null) {
          clearTimeout(autoPresetRetry)
          autoPresetRetry = null
        }
      }

      function probeAutoPreset() {
        var namespace = null
        try { namespace = ctx.get('remote.permissionPresets') } catch (error) { namespace = null }
        if (namespace === null || namespace === void 0 || typeof namespace.catalog !== 'function') {
          if (typeof ctx.inject !== 'function') {
            autoPresetError = new Error('permission: the host exposes no remote.permissionPresets catalog')
            ui.schedule()
          }
          return
        }
        dropAutoPresetRead()
        var read = autoPresetRead
        namespace.catalog().then(function (result) {
          if (read !== autoPresetRead) return
          if (result === null || typeof result !== 'object' || result.ok !== true ||
              result.value === null || typeof result.value !== 'object' ||
              !Array.isArray(result.value.options)) {
            autoPresetError = new Error('permission: unexpected permissionPresets catalog shape')
            ui.schedule()
            return
          }
          autoPresetRetries = 0
          autoPresetError = null
          var live = false
          for (var i = 0; i < result.value.options.length; i++) {
            var option = result.value.options[i]
            if (option !== null && typeof option === 'object' && option.value === AUTO_REVIEW_PRESET) {
              live = true
              break
            }
          }
          autoPresetLive = live
          ui.schedule()
        }, function () {
          if (read !== autoPresetRead) return
          if (autoPresetRetries >= AUTO_PRESET_RETRY_MS.length) {
            autoPresetError = new Error('permission: the permissionPresets catalog read failed ' + (AUTO_PRESET_RETRY_MS.length + 1) + ' times')
            ui.schedule()
            return
          }
          autoPresetRetry = setTimeout(function () {
            autoPresetRetry = null
            probeAutoPreset()
          }, AUTO_PRESET_RETRY_MS[autoPresetRetries++])
        })
      }

      /**
       * The namespace may register after this plugin (the host registers each
       * remote namespace as its package loads), so wait for it the way the
       * account row waits for remote.account; a host without inject gets one
       * read now. The catalog-changed event re-reads when the auto-review
       * integration is registered or dropped while the page stays open.
       */
      function startAutoPresetProbe() {
        if (typeof ctx.inject === 'function') {
          catalogFiber = ctx.inject(['remote.permissionPresets'], function (scope) {
            scope.effect(function () {
              probeAutoPreset()
              return function () {}
            }, 'dsh-claude-style: permission catalog')
          })
        } else {
          probeAutoPreset()
        }
        var remoteRoot = null
        try { remoteRoot = ctx.get('remote') } catch (error) { remoteRoot = null }
        if (remoteRoot !== null && remoteRoot !== void 0 && typeof remoteRoot.$on === 'function') {
          catalogChangedDisposer = remoteRoot.$on('permission-presets/catalog-changed', function () {
            probeAutoPreset()
          })
        }
      }

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
        // A preset our option list does not carry (the host's `custom`, or a
        // row this host's catalog does not offer) shows its machine value.
        var matchedLabel = preset === null ? 'Accept edits' : preset
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
          var rowPreset = it.getAttribute('data-preset')
          var isCurrent = rowPreset === preset
          var check = it.querySelector('.dsh-claude-perm-check')
          if (check) {
            check.style.display = isCurrent ? 'inline' : 'none'
          }
          if (isCurrent) {
            it.setAttribute('data-active', '')
          } else {
            it.removeAttribute('data-active')
          }
          syncRowVisibility(it, rowPreset)
        }
      }

      function submitPreset(preset) {
        var session = currentSession(ctx)
        if (session === null) return
        var settled = session.command('/permission ' + preset)
        if (settled !== void 0 && typeof settled.then === 'function') settled.then(ui.schedule, ui.schedule)
      }

      /**
       * Drive the shipped access menu to its risk-gated row (Full access or Auto review),
       * so the switch runs through the shipped risk-confirmation dialog rather than a
       * skin-owned prompt. The trigger is hidden by this skin but still in
       * the tree, so a synthetic click still opens the menu; the row is then
       * picked by its label. A plain confirm stands in only when that menu
       * cannot be reached, which keeps the switch behind an explicit
       * acknowledgement either way.
       */
      var gateInFlight = false

      function openShippedGate(preset) {
        if (gateInFlight) return
        var isAuto = preset === AUTO_REVIEW_PRESET
        var targetLabels = isAuto ? AUTO_REVIEW_LABELS : FULL_ACCESS_LABELS
        var prompt = isAuto ? AUTO_REVIEW_PROMPT : GATED_PROMPT
        var trigger = findAccessTrigger()
        if (trigger === null) {
          if (window.confirm(prompt)) submitPreset(preset)
          return
        }
        gateInFlight = true
        trigger.click()
        var attempts = 0
        function seek() {
          // The skin's own popover is itself a role=menu whose row texts start
          // with the same labels, so it must stay out of this search — matching
          // it would click back into pick() and toggle the shipped menu every
          // frame. The shipped Auto review row concatenates its EXP badge into
          // the text ("Auto reviewEXP"), so the label matches as a prefix.
          var items = document.querySelectorAll('[role="menu"]:not(.dsh-claude-perm-popover) button[role="menuitem"]')
          for (var i = 0; i < items.length; i++) {
            var text = (items[i].textContent || '').trim()
            for (var j = 0; j < targetLabels.length; j++) {
              if (text.indexOf(targetLabels[j]) === 0) {
                items[i].click()
                gateInFlight = false
                return
              }
            }
          }
          attempts += 1
          if (attempts < 20) {
            requestAnimationFrame(seek)
            return
          }
          gateInFlight = false
          trigger.click()
          if (window.confirm(prompt)) submitPreset(preset)
        }
        requestAnimationFrame(seek)
      }

      function pick(preset) {
        var session = currentSession(ctx)
        if (session === null || preset === null) return
        if (preset === currentPreset(session)) return
        if (preset === GATED_PRESET || preset === AUTO_REVIEW_PRESET) {
          openShippedGate(preset)
          return
        }
        submitPreset(preset)
      }

      // Re-insert when a re-render swapped the host row, then mirror the running preset.
      function syncSegments() {
        var isHero = ui.composer.isHero()
        var composerOn = ui.composer.isActive()

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
            syncRowVisibility(item, item.getAttribute('data-preset'))
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

      ui.permissions = {
        sync: function () {
          if (autoPresetError !== null) throw autoPresetError
          stats.sync()
          syncSegments()
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

      // The composer restyle hides the host's access button and statistics
      // dialogs only while this says their replacement is installed.
      document.body.setAttribute(PERMISSIONS_ATTR, '')
      startAutoPresetProbe()

      return function () {
        stats.teardown()
        if (permHoverIntent) permHoverIntent.cancel()
        dropAutoPresetRead()
        if (catalogFiber !== null && typeof catalogFiber.dispose === 'function') {
          try { catalogFiber.dispose() } catch (error) { /* the fiber may already be gone */ }
          catalogFiber = null
        }
        if (catalogChangedDisposer !== null) {
          catalogChangedDisposer()
          catalogChangedDisposer = null
        }
        if (permDocPointerListener) {
          document.removeEventListener('pointerdown', permDocPointerListener)
          permDocPointerListener = null
        }
        if (permResizeListener) {
          window.removeEventListener('resize', permResizeListener)
          window.removeEventListener('scroll', permResizeListener, true)
          permResizeListener = null
        }
        removeStrayNodes(document, '.' + SEGMENTS_CLASS + '[data-composer-segments], .dsh-claude-perm-container', [])
        segments = null
        gateInFlight = false
        if (permPopover !== null && permPopover.parentElement !== null) permPopover.parentElement.removeChild(permPopover)
        permPopover = null
        permBtn = null
        permLabel = null
        permContainer = null
        document.body.removeAttribute(PERMISSIONS_ATTR)
      }
    }
