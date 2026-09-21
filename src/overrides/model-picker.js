    // ============================================================================
    // 模型选择器 (Model Picker)
    // ============================================================================
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
      var modelSubBody = null
      var modelHoverIntent = createHoverIntent(openModelPopover, closeModelPopovers, 180)
      var modelDir = null
      var modelSub = null
      var modelSessionId = null
      var modelWarmRequested = false
      var modelSubKind = null
      var modelBodySig = ''
      var modelSubSig = ''

      /** Exact entry: `provider/model`, bare id, folded id, then the alias table. */
      function exactModelCopy(groupId, modelId) {
        if (modelCopy === null) return null
        var gid = String(groupId === void 0 || groupId === null ? '' : groupId).toLowerCase()
        var mid = String(modelId === void 0 || modelId === null ? '' : modelId)
        var midLower = mid.toLowerCase()
        var byProvider = modelCopy.exact[groupId + '/' + mid] || modelCopy.exact[gid + '/' + midLower]
        if (byProvider) return byProvider
        if (modelCopy.exact[mid]) return modelCopy.exact[mid]
        if (modelCopy.exact[midLower]) return modelCopy.exact[midLower]
        var folded = normalizeModelId(mid)
        if (modelCopy.folded[folded]) return modelCopy.folded[folded]
        var alias = modelCopy.aliases[mid] || modelCopy.aliases[midLower] || modelCopy.aliases[folded] || (modelCopy.foldedAliases && modelCopy.foldedAliases[folded])
        if (alias) {
          if (modelCopy.exact[alias]) return modelCopy.exact[alias]
          var foldedAlias = normalizeModelId(alias)
          if (modelCopy.folded[foldedAlias]) return modelCopy.folded[foldedAlias]
        }
        return null
      }

      /**
       * Family entry. The model id is tried alone first because it is the
       * stronger signal, then `provider/id` for ids that carry no brand of their
       * own (`abab6.5s-chat` under a provider called `minimax`).
       */
      function familyModelCopy(groupId, modelId) {
        if (modelCopy === null) return null
        var id = String(modelId === void 0 || modelId === null ? '' : modelId).toLowerCase()
        var haystacks = [id, String(groupId === void 0 || groupId === null ? '' : groupId).toLowerCase() + '/' + id]
        for (var h = 0; h < haystacks.length; h++) {
          for (var i = 0; i < modelCopy.families.length; i++) {
            var rule = modelCopy.families[i]
            if (!rule.re.test(haystacks[h])) continue
            if (rule.key) return modelCopy.exact[rule.key] || null
            return rule.text
          }
        }
        return null
      }

      /** Last-resort tier rule, read out of the id itself. */
      function tierModelCopy(modelId) {
        if (modelCopy === null) return null
        var id = String(modelId === void 0 || modelId === null ? '' : modelId).toLowerCase()
        for (var i = 0; i < modelCopy.tiers.length; i++) {
          if (modelCopy.tiers[i].re.test(id)) return modelCopy.tiers[i].text
        }
        return null
      }

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
        modelSubKind = null
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
        modelSubKind = null
        if (modelSubPop) modelSubPop.setAttribute('data-open', 'false')
        renderModelBody()
        positionModelPopovers()
        if (modelPop) modelPop.setAttribute('data-open', 'true')
      }

      function openModelSub(kind) {
        cancelCloseModel()
        modelSubKind = kind
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
              modelSub = store.subscribe(function () { if (ui.schedule) ui.schedule() })
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
       * The description line for one catalog model, in the shell's language.
       *
       * Resolution descends: exact entry (one model resold by several providers
       * folds to a single key) → family rule → tier rule → the catalog's own
       * text. Family rules are ordered and anchored (see
       * src/model-descriptions.json) so another vendor's flash tier never
       * borrows DeepSeek's copy. A model this table has never seen and the
       * catalog does not describe resolves to an empty string on purpose: a
       * name-only row beats an invented line.
       */
      function modelDescription(groupId, model) {
        var id = typeof model.id === 'string' ? model.id : ''
        var pair = exactModelCopy(groupId, id) || familyModelCopy(groupId, id) || tierModelCopy(id)
        var text = localized(pair, ctx)
        if (text) return text
        return typeof model.description === 'string' ? model.description : ''
      }

      var MODEL_CHECK_SVG = '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.2 3.2L13 5"/></svg>'
      var MODEL_CHEVRON_SVG = '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4l4 4-4 4"/></svg>'

      /** One selectable model row: brand mark, name, optional description line and a check when current. */
      function buildModelOption(group, model, selected, withDescription) {
        var item = modelEl('button', 'dsh-claude-model-option')
        item.type = 'button'
        item.setAttribute('role', 'menuitemradio')
        item.setAttribute('aria-checked', selected ? 'true' : 'false')
        var brand = modelBrand(group.id, model.id)
        // The mark id is also the hook the stylesheet needs to give a vendor's
        // rows their own typography (see .dsh-claude-model-name in
        // styles/components/model-picker.css). The mark itself stays markup: the
        // Lobe glyphs are `fill="currentColor"`, so no per-brand rule paints them.
        // The scheduler's attributeFilter does not watch data-*, so this write
        // cannot re-trigger a pass.
        if (brand) item.setAttribute('data-brand', brand)
        item.appendChild(buildModelBrand(brand))
        var copy = modelEl('span', 'dsh-claude-model-copy')
        copy.appendChild(buildModelName(model.name, brand))
        // The description belongs to level 1 only: that list is the official
        // catalog, short enough that the line is what tells the models apart,
        // while "More models" is every provider's full catalog and reads better
        // as names alone. One line, in the shell's language — the copy document is
        // localized rather than stacked, so a row never carries two languages.
        var desc = withDescription ? modelDescription(group.id, model) : ''
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

      /** One level-2 row: label + current value + chevron, hover opens its level. */
      function buildModelCell(label, value, kind) {
        var cell = modelEl('button', 'dsh-claude-model-cell')
        cell.type = 'button'
        cell.setAttribute('role', 'menuitem')
        cell.appendChild(modelEl('span', 'dsh-claude-model-cell-label', label))
        if (value) cell.appendChild(modelEl('span', 'dsh-claude-model-cell-value', value))
        var chevron = modelEl('span', 'dsh-claude-model-cell-chevron')
        chevron.innerHTML = MODEL_CHEVRON_SVG
        cell.appendChild(chevron)
        cell.addEventListener('mouseenter', (function (k) {
          return function () {
            if (readPrefs().autoPopover) openModelSub(k)
          }
        })(kind))
        cell.addEventListener('click', (function (k) {
          return function (e) {
            e.stopPropagation()
            if (modelSubKind === k) closeModelPopovers()
            else openModelSub(k)
          }
        })(kind))
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
        closeModelPopovers()
      }

      /** Level 1: the official provider's models, divider, effort + more rows. */
      function renderModelBody() {
        if (!modelBody) return
        var snap = modelSnapshot()
        var status = snap ? snap.status : 'idle'
        var groups = (snap && snap.groups) || []
        var current = modelCurrent(snap)
        var effort = modelEffort(snap)
        var sig = [status, activeLocale(), current ? current.group.id + '/' + current.model.id : '', effort ? String(effort.effective) : ''].join('|')
        for (var g = 0; g < groups.length; g++) sig += ';' + groups[g].id + ':' + groups[g].models.length
        if (sig === modelBodySig) return
        modelBodySig = sig
        while (modelBody.firstChild) modelBody.removeChild(modelBody.firstChild)

        if (status === 'idle' || status === 'loading' || status === 'selecting') {
          modelBody.appendChild(modelEl('div', 'dsh-claude-model-status', copyLabel('loading', MODEL_LOADING_LABEL)))
        } else {
          var official = null
          for (var g2 = 0; g2 < groups.length; g2++) {
            if (groups[g2].id === MODEL_OFFICIAL_GROUP) { official = groups[g2]; break }
          }
          var rows = []
          if (official) {
            for (var m = 0; m < official.models.length; m++) rows.push({ group: official, model: official.models[m] })
          } else {
            for (var g3 = 0; g3 < groups.length; g3++) {
              for (var m2 = 0; m2 < groups[g3].models.length; m2++) rows.push({ group: groups[g3], model: groups[g3].models[m2] })
            }
          }
          if (rows.length === 0) {
            modelBody.appendChild(modelEl('div', 'dsh-claude-model-status', copyLabel('empty', MODEL_EMPTY_LABEL)))
          } else {
            for (var r = 0; r < rows.length; r++) {
              var selected = current !== null && current.group.id === rows[r].group.id && current.model.id === rows[r].model.id
              modelBody.appendChild(buildModelOption(rows[r].group, rows[r].model, selected, true))
            }
          }
          modelBody.appendChild(modelEl('div', 'dsh-claude-model-divider'))
          // When the active model is not on the official service, surface it under
          // the official list so the current seat is still visible before the
          // effort/More rows. It reads `model (provider)` in display names, never
          // ids, and the provider trails the model instead of leading it: a
          // wordmark may stand at the front of the label, and the seat has to say
          // both which model it is on and which provider serves it — a wordmark
          // names the vendor, not the route. It carries a description like any
          // level-1 row, because this is the row the seat is read from.
          if (current !== null && current.group.id !== MODEL_OFFICIAL_GROUP) {
            var currentRow = modelEl('button', 'dsh-claude-model-option')
            currentRow.type = 'button'
            currentRow.setAttribute('role', 'menuitemradio')
            currentRow.setAttribute('aria-checked', 'true')
            var currentBrand = modelBrand(current.group.id, current.model.id)
            var currentName = current.model.name || current.model.id
            // The brand id is the row's styling hook here too, so this row wears
            // the same vendor mark and face as the list entry it stands for.
            if (currentBrand) currentRow.setAttribute('data-brand', currentBrand)
            currentRow.appendChild(buildModelBrand(currentBrand))
            var currentCopy = modelEl('span', 'dsh-claude-model-copy')
            var currentLabel = buildModelName(currentName, currentBrand)
            // The provider's own display name; the route id only stands in when
            // the catalog gives the group no name.
            var currentProvider = current.group.name || current.group.id
            if (currentProvider) currentLabel.appendChild(document.createTextNode(' (' + currentProvider + ')'))
            currentCopy.appendChild(currentLabel)
            var currentDesc = modelDescription(current.group.id, current.model)
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
          if (effort) modelBody.appendChild(buildModelCell(copyLabel('effortLabel', MODEL_EFFORT_LABEL), effort.label, 'effort'))
          modelBody.appendChild(buildModelCell(copyLabel('moreLabel', MODEL_MORE_LABEL), '', 'more'))
        }
      }

      /** Level 2: the effort ladder, or every provider group's models. */
      function renderModelSub() {
        if (!modelSubBody) return
        var snap = modelSnapshot()
        if (modelSubKind === 'effort') {
          var effort = modelEffort(snap)
          var sig = 'effort:' + (effort ? String(effort.effective) : 'none')
          if (sig === modelSubSig) return
          modelSubSig = sig
          while (modelSubBody.firstChild) modelSubBody.removeChild(modelSubBody.firstChild)
          if (effort === null) {
            modelSubBody.appendChild(modelEl('div', 'dsh-claude-model-status', copyLabel('noEffort', MODEL_NO_EFFORT_LABEL)))
            return
          }
          var levels = []
          if (effort.reasoning.defaultEffort === void 0) levels.push({ effort: void 0, label: MODEL_EFFORT_DEFAULT })
          for (var i = 0; i < effort.reasoning.efforts.length; i++) {
            levels.push({ effort: effort.reasoning.efforts[i].id, label: effort.reasoning.efforts[i].name })
          }
          for (var l = 0; l < levels.length; l++) {
            (function (level, active) {
              var item = modelEl('button', 'dsh-claude-model-option')
              item.type = 'button'
              item.setAttribute('role', 'menuitemradio')
              item.setAttribute('aria-checked', active ? 'true' : 'false')
              item.appendChild(modelEl('span', 'dsh-claude-model-copy', level.label))
              var check = modelEl('span', 'dsh-claude-model-check')
              check.innerHTML = active ? MODEL_CHECK_SVG : ''
              item.appendChild(check)
              item.addEventListener('click', function (e) {
                e.stopPropagation()
                pickEffort(level.effort)
              })
              modelSubBody.appendChild(item)
            })(levels[l], effort.effective === levels[l].effort)
          }
          return
        }
        // 'more': every provider group, headed by its name.
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
          // The provider's own mark leads its label, so a level-2 list reads as
          // "which provider" before "which model".
          groupLabel.appendChild(buildModelBrand(providerBrand(group.id)))
          groupLabel.appendChild(modelEl('span', 'dsh-claude-model-group-name', group.name))
          groupRow.appendChild(groupLabel)
          groupSection.appendChild(groupRow)
          for (var m = 0; m < group.models.length; m++) {
            var selected = current !== null && current.group.id === group.id && current.model.id === group.models[m].id
            groupSection.appendChild(buildModelOption(group, group.models[m], selected, false))
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
        if (modelPop === null) {
          modelPop = document.createElement('div')
          modelPop.className = 'dsh-claude-model-popover'
          modelPop.setAttribute('role', 'menu')
          modelPop.setAttribute('data-open', 'false')
          modelBody = document.createElement('div')
          modelBody.className = 'dsh-claude-model-popover-body'
          modelPop.appendChild(modelBody)
          modelPop.addEventListener('mouseenter', cancelCloseModel)
          modelPop.addEventListener('mouseleave', scheduleCloseModel)
          document.body.appendChild(modelPop)
        }
        if (modelSubPop === null) {
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
        }
      }

      /** Build/refresh the trigger, its label and the popover rows. */
      function syncModelControl() {
        if (!ui.copy.isComposerActive()) {
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
          modelSubBody = null
          modelSubKind = null
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
          // Same contract as the account trigger: hover unless the preference
          // says click-only.
          modelBtn.addEventListener('mouseenter', function () {
            if (readPrefs().autoPopover) openModelPopover()
          })
          modelBtn.addEventListener('mouseleave', function () {
            if (readPrefs().autoPopover) scheduleCloseModel()
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
        if (modelSubKind !== null) {
          renderModelSub()
          if (modelSubPop && modelSubPop.getAttribute('data-open') === 'true') positionModelPopovers()
        }
        if (modelPop && modelPop.getAttribute('data-open') === 'true') positionModelPopovers()
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
          modelSubBody = null
          modelSubKind = null
          modelBodySig = ''
          modelSubSig = ''
        }
      }

      return ui.model.teardown
    }
