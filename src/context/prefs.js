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
      autoPopover: true,
      composerScope: 'all',
      username: '',
      banLocale: fallbackBanLocale || DEFAULT_BAN_LOCALE,
    }
    var prefsRevision
    var prefsAvailable = false
    var prefsListeners = []

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
            var hostName = data.value && typeof data.value.username === 'string' ? data.value.username.trim() : ''
            if (hostName) setFallbackUsername('')
            adoptPrefs(normalizePrefs(data.value))
            replayPendingBanLocale(data.value)
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
