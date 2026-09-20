    // ============================================================================
    // Zone 3: 宿主上下文与通用辅助 (DSH Context & Helpers)
    // ============================================================================
    function findAccessTrigger() {
      var prefixes = ['访问模式', 'Access mode']
      var buttons = document.querySelectorAll('button[aria-label]')
      for (var i = 0; i < buttons.length; i++) {
        var label = buttons[i].getAttribute('aria-label') || ''
        for (var j = 0; j < prefixes.length; j++) {
          if (label.indexOf(prefixes[j]) === 0) return buttons[i]
        }
      }
      return null
    }

    /**
     * The current-session selection left the Session Controller in dsh 0.2:
     * the list snapshot no longer carries `current`, and the main-view
     * selection is projected by the `uiSession` service as a binding source
     * whose `value.key` is the selected session id (`undefined` when no
     * session is materialized). Read the new source first and fall back to
     * the legacy `list.current` so older hosts keep working.
     */
    function currentSessionId(ctx, sessions) {
      try {
        var uiSession = ctx.get('uiSession')
        var current = uiSession === void 0 || uiSession === null ? null : uiSession.current
        var value = current === void 0 || current === null ? null : current.value
        if (value !== void 0 && value !== null && typeof value.key === 'string') return value.key
      } catch (error) { /* fall through to the legacy snapshot field */ }
      return sessions.list.getSnapshot().current
    }

    function currentSession(ctx) {
      var sessions = ctx.get('sessions')
      if (sessions === void 0 || sessions === null) return null
      var id = currentSessionId(ctx, sessions)
      if (id === void 0 || id === null) return null
      var binding = sessions.binding(id)
      if (binding === void 0 || binding === null) return null
      return binding.session === void 0 ? null : binding.session
    }

    function currentPreset(session) {
      try {
        var snapshot = session.projections.faceOf('permissions').getSnapshot()
        if (snapshot === void 0 || snapshot === null) return null
        // dsh 0.2+ projection faces hand back the bare value (e.g. the preset
        // id string); older hosts wrapped it as `{ currentValue }`.
        if (typeof snapshot === 'object' && 'currentValue' in snapshot) return snapshot.currentValue
        return snapshot
      } catch (error) {
        return null
      }
    }

    /**
     * Skin preferences.
     *
     * The authoritative store is the host settings namespace `claude-style`,
     * reached through this plugin's own route: the configuration client
     * (`settingsScope`) only reaches namespaces the api-proxy exposes to it, and
     * a plugin's own namespace is not on that list. `src/../lib/index.js` owns
     * the namespace and the route; this side only reads and writes it.
     *
     * Every value is mirrored onto the document as an attribute, so the
     * stylesheet — not this module — decides what a preference means visually.
     * Until the first read settles (and if it fails) the defaults below hold,
     * which is exactly the shipped behaviour.
     */
    var prefs = {
      brand: DEFAULT_BRAND,
      collapseFooter: true,
      autoPopover: true,
      composerScope: 'all',
    }
    var prefsRevision
    var prefsAvailable = false
    var prefsListeners = []

    /** The current preferences (live object; treat as read-only). */
    function readPrefs() {
      return prefs
    }

    /** Observe preference changes; returns the unsubscriber. */
    function subscribePrefs(listener) {
      prefsListeners.push(listener)
      return function () {
        var index = prefsListeners.indexOf(listener)
        if (index !== -1) prefsListeners.splice(index, 1)
      }
    }

    /**
     * Adopt a preference set: mirror it onto the document, then notify.
     * @param next - resolved preferences from the host.
     */
    function adoptPrefs(next) {
      prefs = next
      // The brand is one attribute write; the other preferences gate rules the
      // stylesheet and the scheduler read directly.
      document.body.setAttribute(BRAND_ATTR, next.brand)
      if (next.collapseFooter) document.body.setAttribute(FOOTER_ATTR, '')
      else document.body.removeAttribute(FOOTER_ATTR)
      var listeners = prefsListeners.slice()
      for (var i = 0; i < listeners.length; i++) {
        try {
          listeners[i](next)
        } catch (error) { /* one bad listener must not stop the rest */ }
      }
    }

    /**
     * Read the preferences once. A failure keeps the defaults and leaves the
     * settings page to report that the store is unavailable.
     */
    function loadPrefs() {
      if (typeof fetch !== 'function') return
      try {
        fetch(PREFS_ROUTE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: '{}',
        })
          .then(function (response) {
            return response.json()
          })
          .then(function (data) {
            if (!data || data.ok !== true) return
            prefsRevision = data.revision
            prefsAvailable = data.available === true
            adoptPrefs(normalizePrefs(data.value))
          })
          .catch(function () { /* defaults stay */ })
      } catch (error) { /* no fetch: defaults stay */ }
    }

    /** Clamp one host value into the preference shape (the host already did this). */
    function normalizePrefs(value) {
      var section = value && typeof value === 'object' ? value : {}
      return {
        brand: section.brand === BRAND_ANTHROPIC || section.brand === BRAND_OFF ? section.brand : BRAND_CLAUDE,
        collapseFooter: section.collapseFooter !== false,
        autoPopover: section.autoPopover !== false,
        composerScope: COMPOSER_SCOPES.indexOf(section.composerScope) === -1 ? 'all' : section.composerScope,
      }
    }

    /**
     * Write a partial preference change.
     *
     * The revision travels with the write so a concurrent move of the namespace
     * is rejected rather than silently overwritten; on that rejection the
     * authoritative value is re-read.
     *
     * @param patch - preference keys to change.
     * @returns a promise for the resolved preferences, or null when unavailable.
     */
    function savePrefs(patch) {
      if (typeof fetch !== 'function') return Promise.resolve(null)
      var body = { revision: prefsRevision }
      for (var key in patch) body[key] = patch[key]
      return fetch(PREFS_ROUTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(body),
      })
        .then(function (response) {
          return response.json().then(function (data) {
            return { status: response.status, data: data }
          })
        })
        .then(function (result) {
          var data = result.data
          if (data && data.ok === true) {
            prefsRevision = data.revision
            prefsAvailable = data.available === true
            adoptPrefs(normalizePrefs(data.value))
            return prefs
          }
          // Conflict or refusal: re-read rather than guess.
          loadPrefs()
          return null
        })
        .catch(function () {
          return null
        })
    }

    /**
     * The brand to show. `off` leaves the brand area entirely to the host, so
     * the stylesheet matches neither brand variant for it.
     *
     * @param brand - the stored choice.
     * @returns the brand actually applied.
     */
    function applyBrand(brand) {
      var next = brand === BRAND_ANTHROPIC || brand === BRAND_OFF ? brand : BRAND_CLAUDE
      document.body.setAttribute(BRAND_ATTR, next)
      return next
    }

    /**
     * The client context exposes no user or account service, so the account
     * name is inferred from the home-directory segment of a workspace path or
     * a session cwd. Falls back to 'User'.
     */
    function getUsername(ctx) {
      try {
        if (ctx && typeof ctx.get === 'function') {
          var workspaces = ctx.get('workspaces')
          if (workspaces && workspaces.list && typeof workspaces.list.getSnapshot === 'function') {
            var items = workspaces.list.getSnapshot().items || []
            for (var i = 0; i < items.length; i++) {
              var m = (items[i].path || '').match(/[/\\](?:Users|home)[/\\]([^/\\]+)/i)
              if (m && m[1]) return m[1]
            }
          }
          var sessions = ctx.get('sessions')
          if (sessions && sessions.list && typeof sessions.list.getSnapshot === 'function') {
            var byId = sessions.list.getSnapshot().byId || {}
            for (var id in byId) {
              var m2 = (byId[id].cwd || '').match(/[/\\](?:Users|home)[/\\]([^/\\]+)/i)
              if (m2 && m2[1]) return m2[1]
            }
          }
        }
      } catch (e) {}
      return 'User'
    }

    /**
     * Host context reference for services that need to read host state
     * (e.g. locale) outside of apply(ctx)'s direct call stack.
     */
    var hostCtx = null
    function setHostContext(ctx) {
      hostCtx = ctx
    }

    /**
     * Model & settings localized copy.
     *
     * The copy document ships as `model-descriptions.json` beside the bundle.
     * Both the model picker (src/overrides.js) and the settings section
     * (src/settings.js) consume this copy, so the state lives here in Zone 3
     * where both zones can reach it.
     */
    var modelCopy = null
    var modelCopyRequested = false
    var modelCopyListeners = []

    function onModelCopyLoaded(listener) {
      modelCopyListeners.push(listener)
      return function () {
        var index = modelCopyListeners.indexOf(listener)
        if (index !== -1) modelCopyListeners.splice(index, 1)
      }
    }

    /**
     * Fetch the model copy document the host half serves.
     */
    function loadModelCopy() {
      if (modelCopyRequested) return
      modelCopyRequested = true
      if (typeof fetch !== 'function') return
      try {
        fetch(MODEL_COPY_ROUTE, { credentials: 'same-origin' })
          .then(function (response) {
            if (!response.ok) throw new Error('HTTP ' + response.status)
            return response.json()
          })
          .then(function (doc) {
            modelCopy = indexModelCopy(doc)
            if (modelCopy === null) return
            var listeners = modelCopyListeners.slice()
            for (var i = 0; i < listeners.length; i++) {
              try {
                listeners[i](modelCopy)
              } catch (error) { /* listener error */ }
            }
          })
          .catch(function () { /* fallback copy stays */ })
      } catch (error) { /* no fetch: fallback copy stays */ }
    }

    /**
     * Compile a copy document into the shape lookups want: a folded id index,
     * the alias table, and the rule lists with their regexps built once.
     * @param doc - parsed document; anything malformed is dropped, not fatal.
     * @returns the index, or null when the document is unusable.
     */
    function indexModelCopy(doc) {
      if (!doc || typeof doc !== 'object') return null
      var exact = doc.exact && typeof doc.exact === 'object' ? doc.exact : {}
      var index = {
        ui: doc.ui && typeof doc.ui === 'object' ? doc.ui : {},
        settings: doc.settings && typeof doc.settings === 'object' ? doc.settings : {},
        exact: exact,
        aliases: doc.aliases && typeof doc.aliases === 'object' ? doc.aliases : {},
        fallback: typeof doc.fallback === 'string' && doc.fallback ? doc.fallback : MODEL_COPY_FALLBACK_LOCALE,
        folded: {},
        foldedAliases: {},
        families: [],
        tiers: [],
      }
      for (var id in exact) index.folded[normalizeModelId(id)] = exact[id]
      for (var a in index.aliases) {
        index.foldedAliases[normalizeModelId(a)] = index.aliases[a]
        index.foldedAliases[a.toLowerCase()] = index.aliases[a]
      }
      var compile = function (rules) {
        var out = []
        for (var i = 0; i < (rules || []).length; i++) {
          var rule = rules[i]
          if (!rule || typeof rule.match !== 'string') continue
          try {
            out.push({ re: new RegExp(rule.match, 'i'), key: rule.key, text: rule.text })
          } catch (error) { /* a malformed rule is skipped, not fatal */ }
        }
        return out
      }
      index.families = compile(doc.families)
      index.tiers = compile(doc.tiers)
      return index
    }

    /** Fold case and separators so `glm-5.3-flash` and `glm-5-3-flash` agree. */
    function normalizeModelId(id) {
      return String(id === void 0 || id === null ? '' : id).toLowerCase().replace(/[^a-z0-9]/g, '')
    }

    /** The shell's active locale id, or the document fallback when it cannot be read. */
    function activeLocale(ctx) {
      var c = ctx || hostCtx
      try {
        if (c && typeof c.get === 'function') {
          var locale = c.get('locale')
          if (locale && typeof locale.getSnapshot === 'function') {
            var active = locale.getSnapshot().active
            if (typeof active === 'string' && active) return active
          }
        }
      } catch (error) { /* no locale service: keep the fallback language */ }
      return modelCopy === null ? MODEL_COPY_FALLBACK_LOCALE : modelCopy.fallback
    }

    /** One localized string out of a `{ locale: text }` pair, fallback locale last. */
    function localized(pair, ctx) {
      if (!pair || typeof pair !== 'object') return ''
      var loc = activeLocale(ctx)
      var text = pair[loc]
      if (typeof text === 'string' && text) return text
      var prefix = typeof loc === 'string' && loc.indexOf('-') !== -1 ? loc.split('-')[0] : (typeof loc === 'string' && loc.indexOf('_') !== -1 ? loc.split('_')[0] : '')
      if (prefix && typeof pair[prefix] === 'string' && pair[prefix]) return pair[prefix]
      var fallback = modelCopy === null ? MODEL_COPY_FALLBACK_LOCALE : modelCopy.fallback
      var backstop = pair[fallback]
      if (typeof backstop === 'string' && backstop) return backstop
      var fallbackPrefix = typeof fallback === 'string' && fallback.indexOf('-') !== -1 ? fallback.split('-')[0] : ''
      if (fallbackPrefix && typeof pair[fallbackPrefix] === 'string' && pair[fallbackPrefix]) return pair[fallbackPrefix]
      return ''
    }

    /**
     * One picker label: the document's localized string, else the neutral
     * English constant the bundle carries. `{name}` placeholders are filled
     * from `params`, so a label with a slot stays translatable.
     */
    function copyLabel(key, fallback, params) {
      var text = modelCopy === null || !modelCopy.ui ? '' : localized(modelCopy.ui[key])
      if (!text) text = fallback
      if (!params) return text
      return text.replace(/\{(\w+)\}/g, function (match, name) {
        return Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : match
      })
    }

    /**
     * One settings-page string. The settings copy rides the same document as
     * the picker copy, so the page follows the shell language too — and the
     * English constants stay as the fallback for a failed fetch.
     */
    function settingsCopy(key, fallback) {
      var text = modelCopy === null || !modelCopy.settings ? '' : localized(modelCopy.settings[key])
      return text || fallback
    }

