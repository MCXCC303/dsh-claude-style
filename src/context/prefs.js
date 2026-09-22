    /**
     * Skin preferences.
     *
     * The authoritative store is the host settings namespace, reached one of two
     * ways depending on the host generation:
     *
     *   * 0.1.7+ serves every registered namespace to the browser through
     *     `ctx.configForms`, whose per-entry controller carries the values, the
     *     write queue and the revision fence. That is the transport used
     *     whenever the service is present.
     *   * 0.1.5-rc.2 and earlier expose only the namespaces the api-proxy lists,
     *     and a plugin's own is not among them, so this side falls back to the
     *     route its host half registers (`lib/index.js`).
     *
     * Both transports carry the same eight fields, so everything below stays
     * transport-agnostic: `loadPrefs`/`savePrefs` pick one, and the rest of the
     * skin keeps reading the mirrored `prefs` object.
     *
     * Every value is mirrored onto the document as an attribute, so the
     * stylesheet — not this module — decides what a preference means visually.
     * Until the first read settles (and if it fails) the defaults below hold,
     * which is exactly the shipped behaviour.
     */
    /**
     * Browser-local fallback for the account-hold page's language.
     *
     * Same contract as the username fallback below, and needed for the same
     * reason: this bundle reloads with the page, but the host half is imported
     * once when the app boots, so a running host half can predate the field.
     * Without the fallback the choice SILENTLY REVERTS — the old host half has
     * no `banLocale` in its accepted-key list, drops the unknown key, and
     * answers the write with its unchanged value, so the segment flips back
     * with nothing to explain it.
     */
    var BAN_LOCALE_STORAGE_KEY = 'dsh-claude-style.banLocale'
    var fallbackBanLocale = readStoredBanLocale()

    function readStoredBanLocale() {
      try {
        if (typeof localStorage === 'undefined') return ''
        var stored = localStorage.getItem(BAN_LOCALE_STORAGE_KEY) || ''
        return BAN_LOCALES.indexOf(stored) === -1 ? '' : stored
      } catch (error) {
        return ''
      }
    }

    /** Persist (or clear) the local language choice; anything else is refused. */
    function setFallbackBanLocale(value) {
      fallbackBanLocale = BAN_LOCALES.indexOf(value) === -1 ? '' : value
      try {
        if (typeof localStorage === 'undefined') return
        if (fallbackBanLocale) localStorage.setItem(BAN_LOCALE_STORAGE_KEY, fallbackBanLocale)
        else localStorage.removeItem(BAN_LOCALE_STORAGE_KEY)
      } catch (error) { /* storage may be unavailable */ }
    }

    /**
     * The language the account-hold page is written in.
     *
     * The local fallback outranks the host value while it exists: it is only
     * ever set when the host refused the write, and `savePrefs` clears it the
     * moment the host confirms the same value — so a stale host half cannot
     * revert the choice, and a reloaded one takes over on its own.
     */
    function resolveBanLocale(hostValue) {
      if (fallbackBanLocale) return fallbackBanLocale
      return BAN_LOCALES.indexOf(hostValue) === -1 ? DEFAULT_BAN_LOCALE : hostValue
    }

    var prefs = {
      brand: DEFAULT_BRAND,
      collapseFooter: true,
      autoPopover: DEFAULT_AUTO_POPOVER,
      composerScope: 'all',
      modelPicker: true,
      quickProviders: [],
      username: '',
      banLocale: fallbackBanLocale || DEFAULT_BAN_LOCALE,
    }
    var prefsRevision
    var prefsAvailable = false
    var prefsListeners = []

    /**
     * The official settings form, when this host has one.
     *
     * 0.1.7 replaced the imperative namespace registry with Config-derived
     * forms: `ctx.configForms.get(entryId)` hands back a controller carrying the
     * values, a write queue and a revision fence, and the namespace is this
     * plugin's profile entry id. The older host has no such service, so this
     * stays null there and the route below is the transport instead.
     */
    var prefsForm = null

    /** This plugin's settings namespace: the loader entry id, or the patch's id. */
    function settingsEntryId(ctx) {
      try {
        var entry = ctx && ctx.fiber ? ctx.fiber.entry : null
        var id = entry ? entry.id : null
        if (typeof id === 'string' && id !== '') return id
      } catch (error) { /* no loader entry: fall back to the id the patch declares */ }
      return SETTINGS_ENTRY_FALLBACK
    }

    /** Whether this host serves namespaces to the browser (0.1.7+). */
    function hostConfigForms(ctx) {
      try {
        if (!ctx || typeof ctx.get !== 'function') return null
        var forms = ctx.get('configForms')
        return forms !== null && forms !== undefined && typeof forms.get === 'function' ? forms : null
      } catch (error) {
        return null
      }
    }

    /** The form's current field values, or null while it is not ready. */
    function readFormValue() {
      if (prefsForm === null) return null
      try {
        var snapshot = prefsForm.getSnapshot()
        if (snapshot === null || snapshot === undefined) return null
        if (snapshot.status !== 'ready') return null
        return snapshot.value && typeof snapshot.value === 'object' ? snapshot.value : null
      } catch (error) {
        return null
      }
    }

    /**
     * Bind the official form when the host offers one.
     *
     * Called once per install, before the first read. A host that serves the
     * service later (or never) simply keeps the route transport, so this never
     * blocks or fails the skin.
     */
    function adoptSettingsForm(ctx) {
      if (prefsForm !== null) return true
      var forms = hostConfigForms(ctx)
      if (forms === null) return false
      var form = null
      try {
        form = forms.get(settingsEntryId(ctx))
      } catch (error) {
        form = null
      }
      if (form === null || form === undefined || typeof form.getSnapshot !== 'function') return false
      prefsForm = form
      if (typeof form.subscribe === 'function') {
        try {
          form.subscribe(function () {
            var value = readFormValue()
            if (value === null) return
            prefsAvailable = true
            adoptPrefs(normalizePrefs(value))
            replayPendingBanLocale(value)
          })
        } catch (error) { /* no subscribe face: reads stay on demand */ }
      }
      return true
    }

    /**
     * Browser-local fallback for the custom username.
     *
     * The host settings namespace is the authoritative store, but a running
     * host half may predate the `username` field. Persisting the value here
     * keeps the setting usable until the host is reloaded, and the host value
     * always wins once it carries a non-empty username.
     */
    var USERNAME_STORAGE_KEY = 'dsh-claude-style.username'
    var fallbackUsername = ''
    try {
      fallbackUsername = typeof localStorage === 'undefined' ? '' : (localStorage.getItem(USERNAME_STORAGE_KEY) || '')
    } catch (error) { fallbackUsername = '' }

    function readFallbackUsername() {
      return fallbackUsername
    }

    function setFallbackUsername(value) {
      fallbackUsername = value
      try {
        if (typeof localStorage === 'undefined') return
        if (value) localStorage.setItem(USERNAME_STORAGE_KEY, value)
        else localStorage.removeItem(USERNAME_STORAGE_KEY)
      } catch (error) { /* storage may be unavailable */ }
    }

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
     *
     * The official form is read first when it exists: its subscription already
     * re-reads on every host change, so this call only has to cover the case
     * where the values are ready before the subscription settles.
     */
    function loadPrefs() {
      if (prefsForm !== null) {
        var formValue = readFormValue()
        if (formValue !== null) {
          prefsAvailable = true
          var formName = typeof formValue.username === 'string' ? formValue.username.trim() : ''
          if (formName) setFallbackUsername('')
          adoptPrefs(normalizePrefs(formValue))
          replayPendingBanLocale(formValue)
        }
        return
      }
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
            var hostName = data.value && typeof data.value.username === 'string' ? data.value.username.trim() : ''
            if (hostName) setFallbackUsername('')
            adoptPrefs(normalizePrefs(data.value))
            replayPendingBanLocale(data.value)
          })
          .catch(function () { /* defaults stay */ })
      } catch (error) { /* no fetch: defaults stay */ }
    }

    /**
     * Clamp the hover-open preference. It used to be a boolean, and a value
     * stored in that shape still has to land on a scope: `true` meant every
     * popover, `false` meant click-only.
     */
    function normalizeAutoPopover(value) {
      if (value === true) return AUTO_POPOVER_ALL
      if (value === false) return AUTO_POPOVER_OFF
      return AUTO_POPOVER_SCOPES.indexOf(value) === -1 ? DEFAULT_AUTO_POPOVER : value
    }

    /**
     * The provider ids the picker's first level carries. Ids rather than names:
     * a provider can be renamed by the catalog at any time, and the stored
     * selection has to survive that. Order is the caller's, duplicates dropped.
     * The official service is the picker's default, not a choice, so a stored
     * id for it is dropped: the first level shows it whenever nothing else is
     * picked, which is what "default" means.
     */
    function normalizeQuickProviders(value) {
      if (!Array.isArray(value)) return []
      var out = []
      for (var i = 0; i < value.length; i++) {
        var id = value[i]
        if (typeof id !== 'string' || id === '' || id === MODEL_OFFICIAL_GROUP || out.indexOf(id) !== -1) continue
        out.push(id)
      }
      return out
    }

    /** Clamp one host value into the preference shape (the host already did this). */
    function normalizePrefs(value) {
      var section = value && typeof value === 'object' ? value : {}
      return {
        brand: section.brand === BRAND_ANTHROPIC || section.brand === BRAND_OFF ? section.brand : BRAND_CLAUDE,
        collapseFooter: section.collapseFooter !== false,
        autoPopover: normalizeAutoPopover(section.autoPopover),
        composerScope: COMPOSER_SCOPES.indexOf(section.composerScope) === -1 ? 'all' : section.composerScope,
        modelPicker: section.modelPicker !== false,
        quickProviders: normalizeQuickProviders(section.quickProviders),
        username: (typeof section.username === 'string' ? section.username.trim().slice(0, USERNAME_MAX) : '') || fallbackUsername,
        banLocale: resolveBanLocale(section.banLocale),
      }
    }

    /**
     * Replay a language that was chosen while the running host half did not know
     * the field yet.
     *
     * Once per load, and only while a local fallback exists: on a host half that
     * still predates `banLocale` the write is dropped again (the fallback keeps
     * the choice), and on a reloaded one it lands, `savePrefs` sees the host echo
     * the value back and drops the fallback — so the setting migrates itself
     * instead of having to be picked again after the app restarts.
     */
    var banLocaleReplayed = false
    function replayPendingBanLocale(hostValue) {
      if (banLocaleReplayed || !fallbackBanLocale) return
      var hostLocale = hostValue && typeof hostValue.banLocale === 'string' ? hostValue.banLocale : ''
      if (hostLocale === fallbackBanLocale) return
      banLocaleReplayed = true
      savePrefs({ banLocale: fallbackBanLocale })
    }

    /**
     * Write a partial change through the official form.
     *
     * One `set()` per field, chained: the controller owns the write queue and
     * takes its revision fence from the last settlement, so a burst of toggles
     * cannot interleave or lose a field. `set()` also validates the field path
     * against the entry's Config before anything crosses the wire, which is why
     * an unknown key is dropped here rather than sent.
     *
     * @param patch - preference keys to change.
     * @returns a promise for the resolved preferences, or null when refused.
     */
    function savePrefsViaForm(patch) {
      var keys = []
      for (var key in patch) {
        if (Object.prototype.hasOwnProperty.call(patch, key)) keys.push(key)
      }
      var step = function (name) {
        return function (accepted) {
          if (accepted === false) return false
          try {
            var pending = prefsForm.set(name, patch[name])
            return pending && typeof pending.then === 'function'
              ? pending.then(function (ok) { return ok === true })
              : true
          } catch (error) {
            return false
          }
        }
      }
      var run = Promise.resolve(true)
      for (var i = 0; i < keys.length; i++) run = run.then(step(keys[i]))
      return run.then(function (accepted) {
        if (accepted === false) {
          // Refused (a stale revision, or a field this Config does not carry):
          // re-read rather than guess, the way the route path does.
          loadPrefs()
          return null
        }
        var value = readFormValue()
        if (value !== null) {
          prefsAvailable = true
          if (typeof patch.username === 'string') {
            var hostName = typeof value.username === 'string' ? value.username.trim() : ''
            setFallbackUsername(hostName ? '' : patch.username)
          }
          // The host echoing the value back is the only proof it knows the
          // field; anything else means the write did not land and the local
          // fallback has to keep it.
          if (typeof patch.banLocale === 'string') {
            var hostLocale = typeof value.banLocale === 'string' ? value.banLocale : ''
            setFallbackBanLocale(hostLocale === patch.banLocale ? '' : patch.banLocale)
          }
          adoptPrefs(normalizePrefs(value))
        }
        return prefs
      })
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
      if (prefsForm !== null) return savePrefsViaForm(patch)
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
            if (typeof patch.username === 'string') {
              var hostName = data.value && typeof data.value.username === 'string' ? data.value.username.trim() : ''
              setFallbackUsername(hostName ? '' : patch.username)
            }
            // The host echoing the value back is the only proof it knows the
            // field; anything else (no value at all, or a different one) means
            // the write did not land and the local fallback has to keep it.
            if (typeof patch.banLocale === 'string') {
              var hostLocale = data.value && typeof data.value.banLocale === 'string' ? data.value.banLocale : ''
              setFallbackBanLocale(hostLocale === patch.banLocale ? '' : patch.banLocale)
            }
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
