    function installModelPicker(ctx, ui) {
      /**
       * The host's model seat is a click-triggered two-pane menu (Model /
       * Effort rows drilling into their own lists). The skin replaces it with
       * a Claude-style picker: hovering the trigger opens the first level —
       * the DeepSeek official provider's models, a divider, then the
       * reasoning-effort row (when the current model offers one) and a More
       * models row; both open their second level BESIDE the first level.
       *
       * Data and submission ride the host's own per-session ModelDirectory
       * (`ctx.modelDirectories`), the same store the host's menu and the
       * /model command read — so the current selection, catalog and errors
       * stay in sync without scraping the DOM. The host's seat is hidden and
       * marked; a React swap re-marks it on the next pass.
       */
      var modelBtn = null
      var modelPop = null
      var modelSubPop = null
      var modelBody = null
      var modelFooter = null
      var effortSlider = null
      var modelSubBody = null
      var modelHoverIntent = createHoverIntent(openModelPopover, closeModelPopovers, 180)
      var modelDir = null
      var modelSub = null
      var modelSessionId = null
      var modelWarmRequested = false
      var modelBodySig = ''
      var modelSubSig = ''
      /** Settings-page listeners waiting on the provider list. */
      var providerListeners = []

      function cancelCloseModel() {
        modelHoverIntent.cancel()
      }

      function scheduleCloseModel() {
        modelHoverIntent.scheduleClose()
      }

      function closeModelPopovers() {
        cancelCloseModel()
        if (modelPop) modelPop.setAttribute('data-open', 'false')
        if (modelSubPop) modelSubPop.setAttribute('data-open', 'false')
      }

      function openModelPopover() {
        cancelCloseModel()
        modelDirectory()
        // load() is async — the host itself guards with .catch(() => {}); a bare
        // try/catch cannot see its rejection.
        if (modelDir && typeof modelDir.load === 'function') {
          try {
            var pending = modelDir.load()
            if (pending && typeof pending.catch === 'function') {
              pending.catch(function () { /* the store's error surface covers a failure */ })
            }
          } catch (error) { /* synchronous failure — the store's error surface covers it */ }
        }
        if (modelSubPop) modelSubPop.setAttribute('data-open', 'false')
        renderModelBody()
        positionModelPopovers()
        if (modelPop) modelPop.setAttribute('data-open', 'true')
      }

      function openModelSub() {
        cancelCloseModel()
        renderModelSub()
        positionModelPopovers()
        if (modelSubPop) modelSubPop.setAttribute('data-open', 'true')
      }

      /**
       * The current session id. The Session Controller dropped
       * `list.current` in dsh 0.2 (the main-view selection now comes from the
       * `uiSession` projection), so this MUST go through the shared
       * currentSessionId() in context.js — reading the legacy field directly
       * resolves to null on current hosts and the picker never loads.
       */
      function currentModelSessionId() {
        try {
          var sessions = ctx.get('sessions')
          if (sessions === void 0 || sessions === null) return null
          var id = currentSessionId(ctx, sessions)
          return id === void 0 || id === null ? null : id
        } catch (error) {
          return null
        }
      }

      function dropModelSubscription() {
        if (modelSub) {
          try { modelSub() } catch (error) { /* already disposed */ }
        }
        modelSub = null
      }

      /** Resolve the session's directory (and observe it) once per session. */
      function modelDirectory() {
        var id = currentModelSessionId()
        if (id === null) {
          dropModelSubscription()
          modelDir = null
          modelSessionId = null
          return null
        }
        if (modelSessionId === id && modelDir !== null) return modelDir
        dropModelSubscription()
        modelDir = null
        modelSessionId = null
        try {
          var dirs = ctx.get('modelDirectories')
          if (dirs && typeof dirs.directoryFor === 'function') {
            modelDir = dirs.directoryFor(id)
          }
        } catch (error) {
          modelDir = null
        }
        modelSessionId = id
        // The directory INSTANCE only carries load/select — its reactive state
        // hangs off the `.store` snapshot store (the host hands that same store
        // to its own menu as `directory`). Subscribe to the store, never to the
        // instance, and never let a subscribe failure discard the directory.
        if (modelDir !== null) {
          var store = modelDir.store
          if (store && typeof store.subscribe === 'function') {
            try {
              modelSub = store.subscribe(function () { notifyProviders(); if (ui.schedule) ui.schedule() })
            } catch (error) {
              modelSub = null
            }
          }
        }
        return modelDir
      }

      function modelSnapshot() {
        if (modelDir === null || !modelDir.store) return null
        try { return modelDir.store.getSnapshot() } catch (error) { return null }
      }

      /**
       * The catalog's providers, in catalog order, each with its model count.
       *
       * The settings page's quick-provider picker is the other consumer, and it
       * may be opened before the picker itself ever was — so this resolves the
       * directory and starts the shared catalog load rather than requiring a
       * first popover open.
       */
      function modelProviders() {
        modelDirectory()
        warmModelCatalog()
        var snap = modelSnapshot()
        var groups = (snap && snap.groups) || []
        var out = []
        for (var i = 0; i < groups.length; i++) {
          if (groups[i].models.length === 0) continue
          out.push({ id: groups[i].id, name: groups[i].name || groups[i].id, count: groups[i].models.length })
        }
        return out
      }

      /** Tell the settings picker the provider list moved (catalog arrived, changed). */
      function notifyProviders() {
        if (providerListeners.length === 0) return
        var list = modelProviders()
        var listeners = providerListeners.slice()
        for (var i = 0; i < listeners.length; i++) {
          try { listeners[i](list) } catch (error) { /* one listener must not block the rest */ }
        }
      }

      /**
       * Start the host's model catalog load as soon as a session resolves, rather
       * than waiting for the first popover open.
       *
       * The catalog is one RPC per Host generation (`remote.session.modelCatalog`)
       * and nothing else fetches it: the host kicks it off from its own menu's
       * `show()`, and this skin hides that seat — so the first open used to pay the
       * whole round-trip, which is seconds on a cold start. Starting it here moves
       * that wait into the startup the user is already sitting through, and the
       * trigger's label needs the same catalog anyway: the current model's name
       * comes out of it. The load is shared and cached host-side, so the popover's
       * own `load()` becomes a no-op instead of a second request.
       *
       * Failures are the store's to report — the popover shows the error and the
       * host offers a retry — so this only has to avoid throwing into a pass.
       */
      function warmModelCatalog() {
        if (modelWarmRequested || modelDir === null || typeof modelDir.load !== 'function') return
        modelWarmRequested = true
        try {
          var pending = modelDir.load()
          if (pending && typeof pending.catch === 'function') {
            pending.catch(function () { /* surfaced by the store, not here */ })
          }
        } catch (error) { /* synchronous failure — the store's error surface covers it */ }
      }

      /** The current selection resolved to its group + model entries. */
      function modelCurrent(snap) {
        if (!snap || snap.current === null) return null
        for (var g = 0; g < snap.groups.length; g++) {
          var group = snap.groups[g]
          if (group.id !== snap.current.provider) continue
          for (var m = 0; m < group.models.length; m++) {
            if (group.models[m].id === snap.current.model) return { group: group, model: group.models[m] }
          }
        }
        return null
      }

      /** Reasoning metadata + the effective effort for the current model. */
      function modelEffort(snap) {
        var current = modelCurrent(snap)
        if (current === null || !current.model.reasoning) return null
        var reasoning = current.model.reasoning
        var effective = snap.current.reasoningEffort !== void 0 ? snap.current.reasoningEffort : reasoning.defaultEffort
        var label = MODEL_EFFORT_DEFAULT
        if (effective !== void 0) {
          label = effective
          for (var i = 0; i < reasoning.efforts.length; i++) {
            if (reasoning.efforts[i].id === effective) {
              label = reasoning.efforts[i].name
              break
            }
          }
        }
        return { reasoning: reasoning, effective: effective, label: label }
      }

      /**
       * The effort slider (src/overrides/model-effort.js). It is handed a reader
       * rather than the seat itself: the control re-reads the catalog on every
       * pass, so a selection the host echoes back lands on the knob without the
       * picker having to push it.
       */
      function effortControlElement() {
        if (effortSlider === null) {
          effortSlider = createEffortControl({
            read: function () { return modelEffort(modelSnapshot()) },
            onPick: pickEffort,
            // A drag must not be cut short by the hover-close timer: the pointer
            // is inside the control the whole time.
            onDragStart: cancelCloseModel,
          })
        }
        return effortSlider.el
      }

      /** Re-point the slider at the current seat (every render pass). */
      function updateEffortControl() {
        if (effortSlider !== null) effortSlider.update()
      }

      var MODEL_CHECK_SVG = '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.2 3.2L13 5"/></svg>'
      var MODEL_CHEVRON_SVG = '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4l4 4-4 4"/></svg>'

      /** Catalog order is whatever the provider happened to send; id order is scannable. */
      function byModelId(a, b) {
        var left = String(a.id)
        var right = String(b.id)
        return left < right ? -1 : left > right ? 1 : 0
      }

      /**
       * The rule that separates one provider's models from the next. The provider
       * name rides the rule itself rather than trailing the model in parentheses:
       * one quiet line above the group says who serves it, and the model names
       * stay clean.
       */
      function buildProviderRule(name) {
        var rule = modelEl('div', 'dsh-claude-model-rule')
        if (name) rule.appendChild(modelEl('span', 'dsh-claude-model-rule-name', name))
        return rule
      }

      /** One selectable model row: brand mark, name, optional description line and a check when current. */
      function buildModelOption(group, model, selected, withDescription) {
        var item = modelEl('button', 'dsh-claude-model-option')
        item.type = 'button'
        item.setAttribute('role', 'menuitemradio')
        item.setAttribute('aria-checked', selected ? 'true' : 'false')
        var brand = modelBrand(model.id)
        // The brand id is the row's styling hook — it is what gives a vendor's rows
        // their own typography (see .dsh-claude-model-name in
        // styles/components/model-picker.css). The vendor's mark is no longer drawn
        // here: it rides inside the label's lockup. The scheduler's attributeFilter
        // does not watch data-*, so this write cannot re-trigger a pass.
        if (brand) item.setAttribute('data-brand', brand)
        var copy = modelEl('span', 'dsh-claude-model-copy')
        copy.appendChild(buildModelLabel(model.name, brand))
        // The description belongs to level 1 only: that list is the official
        // catalog, short enough that the line is what tells the models apart,
        // while "More models" is every provider's full catalog and reads better
        // as names alone. One line, in the shell's language — the copy document is
        // localized rather than stacked, so a row never carries two languages.
        var desc = withDescription ? modelDescription(ctx, group.id, model) : ''
        if (desc) copy.appendChild(modelEl('span', 'dsh-claude-model-desc', desc))
        item.appendChild(copy)
        var check = modelEl('span', 'dsh-claude-model-check')
        check.innerHTML = selected ? MODEL_CHECK_SVG : ''
        item.appendChild(check)
        item.addEventListener('click', (function (g, m) {
          return function (e) {
            e.stopPropagation()
            pickModel(g, m)
          }
        })(group.id, model.id))
        return item
      }

      /** The More-models row: label + chevron, hover opens the second level. */
      function buildModelCell(label) {
        var cell = modelEl('button', 'dsh-claude-model-cell')
        cell.type = 'button'
        cell.setAttribute('role', 'menuitem')
        cell.appendChild(modelEl('span', 'dsh-claude-model-cell-label', label))
        var chevron = modelEl('span', 'dsh-claude-model-cell-chevron')
        chevron.innerHTML = MODEL_CHEVRON_SVG
        cell.appendChild(chevron)
        cell.addEventListener('mouseenter', function () {
          if (readPrefs().autoPopover === AUTO_POPOVER_ALL) openModelSub()
        })
        cell.addEventListener('click', function (e) {
          e.stopPropagation()
          if (modelSubPop && modelSubPop.getAttribute('data-open') === 'true') closeModelPopovers()
          else openModelSub()
        })
        return cell
      }

      function pickModel(provider, modelId) {
        var dir = modelDirectory()
        if (dir === null) return
        try {
          // select() is async and rejects on a failed selection; swallow the
          // rejection the way the host's own seat wrapper does.
          var pending = dir.select({ provider: provider, model: modelId })
          if (pending && typeof pending.catch === 'function') pending.catch(function () {})
        } catch (error) { /* rejected selections surface on the host's toast */ }
        closeModelPopovers()
      }

      /** Commit one reasoning level. The slider stays open for the next nudge. */
      function pickEffort(effort) {
        var dir = modelDirectory()
        var snap = modelSnapshot()
        if (dir === null || !snap || snap.current === null) return
        var selection = { provider: snap.current.provider, model: snap.current.model }
        if (effort !== void 0) selection.reasoningEffort = effort
        try {
          var pending = dir.select(selection)
          if (pending && typeof pending.catch === 'function') pending.catch(function () {})
        } catch (error) { /* rejected selections surface on the host's toast */ }
      }

      /** Level 1: the provider sections, the divider, the effort slider, More models. */
      function renderModelBody() {
        if (!modelBody) return
        // A drag in flight owns the slider: rebuilding the footer would detach it
        // and drop its pointer capture mid-gesture. The pass that ends the drag —
        // settle commits, the host answers, a pass is scheduled — picks it up.
        if (effortSlider !== null && effortSlider.isDragging()) return
        var snap = modelSnapshot()
        var status = snap ? snap.status : 'idle'
        var groups = (snap && snap.groups) || []
        var current = modelCurrent(snap)
        var effort = modelEffort(snap)
        var sig = [status, activeLocale(), current ? current.group.id + '/' + current.model.id : '', effort ? String(effort.effective) : '', readPrefs().quickProviders.join(',')].join('|')
        for (var g = 0; g < groups.length; g++) sig += ';' + groups[g].id + ':' + groups[g].models.length
        if (sig === modelBodySig) {
          // The list is unchanged, but the slider still has to follow the seat:
          // its geometry tracks the card's width, its value a selection the host
          // echoed back.
          updateEffortControl()
          return
        }
        modelBodySig = sig
        while (modelBody.firstChild) modelBody.removeChild(modelBody.firstChild)
        while (modelFooter && modelFooter.firstChild) modelFooter.removeChild(modelFooter.firstChild)

        if (status === 'idle' || status === 'loading' || status === 'selecting') {
          modelBody.appendChild(modelEl('div', 'dsh-claude-model-status', copyLabel('loading', MODEL_LOADING_LABEL)))
        } else {
          // Level 1 always leads with the official service: it is the default
          // provider, not a choice in the settings, so it stays first no matter
          // what else is picked. The quick providers the settings page picked
          // follow it, each under its own rule. Only when the catalog has no
          // (non-empty) official service at all does the list fall back to the
          // picked providers, and with none picked to every provider.
          var sections = []
          var chosen = readPrefs().quickProviders
          for (var g0 = 0; g0 < groups.length; g0++) {
            if (groups[g0].id === MODEL_OFFICIAL_GROUP && groups[g0].models.length > 0) {
              sections.push(groups[g0])
              break
            }
          }
          for (var g2 = 0; g2 < groups.length; g2++) {
            if (chosen.indexOf(groups[g2].id) === -1 || groups[g2].id === MODEL_OFFICIAL_GROUP || groups[g2].models.length === 0) continue
            sections.push(groups[g2])
          }
          if (sections.length === 0) {
            for (var g4 = 0; g4 < groups.length; g4++) {
              if (groups[g4].models.length > 0) sections.push(groups[g4])
            }
          }
          if (sections.length === 0) {
            modelBody.appendChild(modelEl('div', 'dsh-claude-model-status', copyLabel('empty', MODEL_EMPTY_LABEL)))
          } else {
            for (var s = 0; s < sections.length; s++) {
              var section = sections[s]
              // The official source needs no naming, and the first section needs
              // no rule: a bare line above the list would be one line too many.
              var sectionLabel = section.id === MODEL_OFFICIAL_GROUP ? '' : (section.name || section.id)
              if (sectionLabel !== '' || s > 0) modelBody.appendChild(buildProviderRule(sectionLabel))
              var sectionModels = section.models.slice().sort(byModelId)
              for (var m = 0; m < sectionModels.length; m++) {
                var selected = current !== null && current.group.id === section.id && current.model.id === sectionModels[m].id
                modelBody.appendChild(buildModelOption(section, sectionModels[m], selected, true))
              }
            }
          }
          // The current seat is surfaced under the list when none of the sections
          // above already carries it, so the row the seat is read from is always
          // on screen. Its provider rides a rule of its own rather than trailing
          // the model in parentheses — the same idiom the sections use. It stays
          // above the divider: the divider closes the model list, so anything
          // that belongs to the list has to sit on its side of it.
          var currentListed = false
          for (var c = 0; c < sections.length; c++) {
            if (current !== null && sections[c].id === current.group.id) currentListed = true
          }
          if (current !== null && !currentListed) {
            // The divider above already draws a line, so a provider that needs no
            // naming (the official source) adds nothing here.
            var currentRuleName = current.group.id === MODEL_OFFICIAL_GROUP ? '' : (current.group.name || current.group.id)
            if (currentRuleName !== '') modelBody.appendChild(buildProviderRule(currentRuleName))
            var currentRow = modelEl('button', 'dsh-claude-model-option')
            currentRow.type = 'button'
            currentRow.setAttribute('role', 'menuitemradio')
            currentRow.setAttribute('aria-checked', 'true')
            var currentBrand = modelBrand(current.model.id)
            var currentName = current.model.name || current.model.id
            // The brand id is the row's styling hook here too, so this row wears
            // the same vendor lockup and face as the list entry it stands for.
            if (currentBrand) currentRow.setAttribute('data-brand', currentBrand)
            var currentCopy = modelEl('span', 'dsh-claude-model-copy')
            var currentLabel = buildModelLabel(currentName, currentBrand)
            currentCopy.appendChild(currentLabel)
            var currentDesc = modelDescription(ctx, current.group.id, current.model)
            if (currentDesc) currentCopy.appendChild(modelEl('span', 'dsh-claude-model-desc', currentDesc))
            currentRow.appendChild(currentCopy)
            var currentCheck = modelEl('span', 'dsh-claude-model-check')
            currentCheck.innerHTML = MODEL_CHECK_SVG
            currentRow.appendChild(currentCheck)
            currentRow.addEventListener('click', function (e) {
              e.stopPropagation()
              closeModelPopovers()
            })
            modelBody.appendChild(currentRow)
          }
          // The divider closes the model list and the two drill rows follow it;
          // all three live in the footer, OUTSIDE the scroll area — the list
          // above scrolls under them while the controls stay reachable.
          if (modelFooter) {
            modelFooter.appendChild(modelEl('div', 'dsh-claude-model-divider'))
            // The effort control is a slider, and it is always there: a model that
            // offers no levels simply has nothing on the track to settle on.
            modelFooter.appendChild(effortControlElement())
            modelFooter.appendChild(buildModelCell(copyLabel('moreLabel', MODEL_MORE_LABEL)))
          }
        }
        updateEffortControl()
      }

      /** Level 2: every provider group's models, each headed by its provider name. */
      function renderModelSub() {
        if (!modelSubBody) return
        var snap = modelSnapshot()
        var groups = (snap && snap.groups) || []
        var current = modelCurrent(snap)
        var sig2 = 'more'
        for (var g = 0; g < groups.length; g++) sig2 += ';' + groups[g].id + ':' + groups[g].models.length
        if (current) sig2 += '#' + current.group.id + '/' + current.model.id
        if (sig2 === modelSubSig) return
        modelSubSig = sig2
        while (modelSubBody.firstChild) modelSubBody.removeChild(modelSubBody.firstChild)
        for (var g2 = 0; g2 < groups.length; g2++) {
          var group = groups[g2]
          if (group.models.length === 0) continue
          var groupSection = modelEl('div', 'dsh-claude-model-group-section')
          var groupRow = modelEl('div', 'dsh-claude-model-group-row')
          var groupLabel = modelEl('div', 'dsh-claude-model-group')
          // The group label is the provider's name alone: a mark there would repeat
          // what the rows below already carry inside their lockups.
          groupLabel.appendChild(modelEl('span', 'dsh-claude-model-group-name', group.name))
          groupRow.appendChild(groupLabel)
          groupSection.appendChild(groupRow)
          // A provider's models read in id order, so the list is scannable and stays
          // put between visits; the catalog's own order is whatever the provider
          // happened to send. Sorted on a copy — the snapshot belongs to the store.
          var groupModels = group.models.slice().sort(byModelId)
          for (var m = 0; m < groupModels.length; m++) {
            var selected = current !== null && current.group.id === group.id && current.model.id === groupModels[m].id
            groupSection.appendChild(buildModelOption(group, groupModels[m], selected, false))
          }
          modelSubBody.appendChild(groupSection)
        }
        if (modelSubBody.firstChild === null) {
            modelSubBody.appendChild(modelEl('div', 'dsh-claude-model-status', copyLabel('empty', MODEL_EMPTY_LABEL)))
        }
      }

      function positionModelPopovers() {
        if (!modelBtn || !modelPop) return
        var pos = positionAnchoredPopover(modelBtn, modelPop, { side: 'above', gap: 6 })
        if (modelSubPop && modelSubPop.getAttribute('data-open') === 'true') {
          var w2 = modelSubPop.offsetWidth
          var h2 = modelSubPop.offsetHeight
          // Beside the first level; flip to its left when the viewport is tight.
          var x2 = pos.x + modelPop.offsetWidth + 4
          if (x2 + w2 > window.innerWidth - POPOVER_MARGIN) x2 = Math.max(POPOVER_MARGIN, pos.x - 4 - w2)
          var y2 = Math.max(POPOVER_MARGIN, Math.min(pos.y, window.innerHeight - h2 - POPOVER_MARGIN))
          modelSubPop.style.left = x2 + 'px'
          modelSubPop.style.top = y2 + 'px'
        }
      }

      function ensureModelChrome() {
        // Idempotence guard, not just a null check: the picker's own teardown
        // sweep, or a hot-reload generation's stray sweep, can REMOVE the
        // popover node while the closure still references it. With a null-only
        // check the reference stays non-null-but-detached and is never rebuilt
        // — the trigger then toggles a popover that is not in the document and
        // the picker silently loses its click effect. The account footer's
        // equivalent guard (footArea.contains) is the established pattern.
        // Rebuilding also re-points the body/footer children and resets the
        // render signatures so the next pass repaints into the fresh nodes.
        if (modelPop === null || modelPop.parentElement === null) {
          if (modelPop !== null && modelPop.parentElement !== null) modelPop.parentElement.removeChild(modelPop)
          modelPop = document.createElement('div')
          modelPop.className = 'dsh-claude-model-popover'
          modelPop.setAttribute('role', 'menu')
          modelPop.setAttribute('data-open', 'false')
          modelBody = document.createElement('div')
          modelBody.className = 'dsh-claude-model-popover-body'
          modelPop.appendChild(modelBody)
          modelFooter = document.createElement('div')
          modelFooter.className = 'dsh-claude-model-footer'
          modelPop.appendChild(modelFooter)
          modelPop.addEventListener('mouseenter', cancelCloseModel)
          modelPop.addEventListener('mouseleave', function () {
            // A drag in flight must not be cut short by the hover-close timer: the
            // pointer is working the slider, not leaving the card.
            if (effortSlider !== null && effortSlider.isDragging()) return
            scheduleCloseModel()
          })
          document.body.appendChild(modelPop)
          modelBodySig = ''
        }
        if (modelSubPop === null || modelSubPop.parentElement === null) {
          if (modelSubPop !== null && modelSubPop.parentElement !== null) modelSubPop.parentElement.removeChild(modelSubPop)
          modelSubPop = document.createElement('div')
          modelSubPop.className = 'dsh-claude-model-popover dsh-claude-model-popover-sub'
          modelSubPop.setAttribute('role', 'menu')
          modelSubPop.setAttribute('data-open', 'false')
          modelSubBody = document.createElement('div')
          modelSubBody.className = 'dsh-claude-model-popover-body'
          modelSubPop.appendChild(modelSubBody)
          modelSubPop.addEventListener('mouseenter', cancelCloseModel)
          modelSubPop.addEventListener('mouseleave', scheduleCloseModel)
          document.body.appendChild(modelSubPop)
          modelSubSig = ''
        }
      }

      /** Build/refresh the trigger, its label and the popover rows. */
      function syncModelControl() {
        // Two ways to be off: the composer restyle does not apply to this page, or
        // the picker preference is off. Both hand the host's own model seat and
        // menu back, so both run the same sweep.
        if (!ui.copy.isComposerActive() || !readPrefs().modelPicker) {
          var allHosts = document.querySelectorAll('[data-dsh-claude-model-host]')
          for (var h = 0; h < allHosts.length; h++) {
            allHosts[h].removeAttribute('data-dsh-claude-model-host')
          }
          var allModelBtns = document.querySelectorAll('.dsh-claude-model-btn')
          for (var mb = 0; mb < allModelBtns.length; mb++) {
            allModelBtns[mb].remove()
          }
          modelBtn = null
          var allModelPops = document.querySelectorAll('.dsh-claude-model-popover')
          for (var mp = 0; mp < allModelPops.length; mp++) {
            allModelPops[mp].remove()
          }
          modelPop = null
          modelSubPop = null
          modelBody = null
          modelFooter = null
          modelSubBody = null
          modelBodySig = ''
          modelSubSig = ''
          cancelCloseModel()
          dropModelSubscription()
          modelDir = null
          modelSessionId = null
          return
        }

        // The copy document is fetched on first paint of the picker rather than
        // at install, so a session that never opens it never pays for it.
        loadModelCopy()
        modelDirectory()
        warmModelCatalog()
        var slot = document.querySelector('[data-slot="conversation.input.model"]')
        if (slot === null) return
        // Hide the host's own seat (React owns the node; re-mark on swap).
        // Idempotent against a torn-down-less reload, like the account footer:
        // client HMR drops the old fiber's disposals, so a previous generation's
        // trigger and popovers are still in the DOM while this fresh scope starts
        // from null. Sweep the strays, or the seat renders twice.
        var strayBtns = slot.querySelectorAll('.dsh-claude-model-btn')
        for (var sb = 0; sb < strayBtns.length; sb++) {
          if (strayBtns[sb] !== modelBtn) strayBtns[sb].parentElement.removeChild(strayBtns[sb])
        }
        var strayPops = document.querySelectorAll('body > .dsh-claude-model-popover')
        for (var sp = 0; sp < strayPops.length; sp++) {
          if (strayPops[sp] !== modelPop && strayPops[sp] !== modelSubPop) strayPops[sp].parentElement.removeChild(strayPops[sp])
        }
        var hostRoot = slot.firstElementChild
        if (hostRoot !== null && !hostRoot.hasAttribute('data-dsh-claude-model-host')) {
          hostRoot.setAttribute('data-dsh-claude-model-host', '')
        }
        if (modelBtn === null || modelBtn.parentElement !== slot) {
          if (modelBtn !== null && modelBtn.parentElement !== null) modelBtn.parentElement.removeChild(modelBtn)
          modelBtn = document.createElement('button')
          modelBtn.type = 'button'
          modelBtn.className = 'dsh-claude-model-btn'
          modelBtn.setAttribute('aria-haspopup', 'menu')
          modelBtn.innerHTML = '<span class="dsh-claude-model-btn-label"></span>'
          // Same contract as the account trigger: hover under the "All" scope,
          // click-only otherwise.
          modelBtn.addEventListener('mouseenter', function () {
            if (readPrefs().autoPopover === AUTO_POPOVER_ALL) openModelPopover()
          })
          modelBtn.addEventListener('mouseleave', function () {
            if (readPrefs().autoPopover === AUTO_POPOVER_ALL) scheduleCloseModel()
          })
          modelBtn.addEventListener('click', function (e) {
            e.stopPropagation()
            if (modelPop && modelPop.getAttribute('data-open') === 'true') closeModelPopovers()
            else openModelPopover()
          })
          slot.appendChild(modelBtn)
        }
        ensureModelChrome()

        var snap = modelSnapshot()
        var current = modelCurrent(snap)
        var effort = modelEffort(snap)
        var label = current ? current.model.name : copyLabel('fallbackLabel', MODEL_FALLBACK_LABEL)
        var labelEl = modelBtn.querySelector('.dsh-claude-model-btn-label')
        if (labelEl) {
          labelEl.textContent = label
          labelEl.classList.toggle('dsh-claude-model-btn-loading', !!(snap && (snap.status === 'loading' || snap.status === 'idle' || snap.status === 'selecting')))
        }
        var effortEl = modelBtn.querySelector('.dsh-claude-model-btn-effort')
        if (effort) {
          if (effortEl === null) {
            effortEl = modelEl('span', 'dsh-claude-model-btn-effort')
            modelBtn.insertBefore(effortEl, modelBtn.firstChild ? labelEl.nextSibling : null)
          }
          effortEl.textContent = '· ' + effort.label
        } else if (effortEl !== null && effortEl.parentElement) {
          effortEl.parentElement.removeChild(effortEl)
        }
        modelBtn.setAttribute('aria-label', copyLabel('triggerLabel', MODEL_TRIGGER_LABEL, { model: label }))
        modelBtn.disabled = false

        renderModelBody()
        if (modelSubPop && modelSubPop.getAttribute('data-open') === 'true') {
          renderModelSub()
          positionModelPopovers()
        } else if (modelPop && modelPop.getAttribute('data-open') === 'true') {
          positionModelPopovers()
        }
      }


      ui.model = {
        sync: syncModelControl,
        close: closeModelPopovers,
        owns: function (target) {
          if (!target) return false
          return (modelBtn !== null && modelBtn.contains(target)) ||
                 (modelPop !== null && modelPop.contains(target)) ||
                 (modelSubPop !== null && modelSubPop.contains(target))
        },
        reposition: positionModelPopovers,
        providers: modelProviders,
        onProviders: function (listener) {
          providerListeners.push(listener)
          return function () {
            var at = providerListeners.indexOf(listener)
            if (at !== -1) providerListeners.splice(at, 1)
          }
        },
        invalidateCopy: function () {
          modelBodySig = ''
          modelSubSig = ''
        },
        teardown: function () {
          cancelCloseModel()
          dropModelSubscription()
          modelDir = null
          modelSessionId = null
          modelWarmRequested = false
          modelBtn = null
          modelPop = null
          modelSubPop = null
          modelBody = null
          modelFooter = null
          effortSlider = null
          modelSubBody = null
          modelBodySig = ''
          modelSubSig = ''
        }
      }

      return ui.model.teardown
    }
