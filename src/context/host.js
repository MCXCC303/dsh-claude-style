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

    /** The sidebar footer, where the account row and the plugin footer entries live. */
    function findFootArea() {
      return document.querySelector('[class*="footArea"]')
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
     * Host-resolved identity.
     *
     * The host half resolves the name this instance runs as once — the
     * launcher's account name when one was published, the OS user otherwise —
     * and this side fetches it once and caches it. The same answer carries the
     * launcher account, whose picture the account row draws in place of the
     * mark. A custom username from the settings page always wins. No workspace
     * parsing, no polling.
     */
    var usernameFromHost = ''
    /** The launcher account behind that name, or null; see accountFromPayload. */
    var accountFromHost = null
    var usernameRequested = false
    var usernameListeners = []

    /**
     * Clamp the launcher account the host reported. Every field is display
     * copy or a switch: the skin picture itself is fetched separately, and the
     * absolute path behind it never reaches this side.
     */
    function accountFromPayload(raw) {
      if (raw === null || raw === undefined || typeof raw !== 'object') return null
      return {
        name: typeof raw.name === 'string' ? raw.name : '',
        vendor: typeof raw.vendor === 'string' ? raw.vendor : '',
        kind: typeof raw.kind === 'string' ? raw.kind : '',
        skin: typeof raw.skin === 'string' ? raw.skin : '',
        skinModel: typeof raw.skinModel === 'string' ? raw.skinModel : '',
        hasSkin: raw.hasSkin === true,
      }
    }

    function onUsernameLoaded(listener) {
      usernameListeners.push(listener)
      return function () {
        var index = usernameListeners.indexOf(listener)
        if (index !== -1) usernameListeners.splice(index, 1)
      }
    }

    function loadUsername() {
      if (usernameRequested) return
      usernameRequested = true
      if (typeof fetch !== 'function') return
      try {
        fetch(USERNAME_ROUTE, { credentials: 'same-origin' })
          .then(function (response) {
            if (!response.ok) throw new Error('HTTP ' + response.status)
            return response.json()
          })
          .then(function (data) {
            if (!data || data.ok !== true || typeof data.username !== 'string') return
            usernameFromHost = data.username.trim().slice(0, USERNAME_MAX)
            accountFromHost = accountFromPayload(data.account)
            var listeners = usernameListeners.slice()
            for (var i = 0; i < listeners.length; i++) {
              try { listeners[i](usernameFromHost) } catch (error) { /* listener error */ }
            }
          })
          .catch(function () { /* custom username or 'User' stays */ })
      } catch (error) { /* no fetch: fallback stays */ }
    }

    function getUsername() {
      var custom = readPrefs().username || readFallbackUsername()
      if (custom) return custom
      if (usernameFromHost) return usernameFromHost
      return 'User'
    }

    /** The launcher account this instance runs as, or null; null until the host answers. */
    function getHostAccount() {
      return accountFromHost
    }

    /**
     * Host context reference for services that need to read host state
     * (e.g. locale) outside of apply(ctx)'s direct call stack.
     */
    var hostCtx = null
    function setHostContext(ctx) {
      hostCtx = ctx
      // A new host context means a new user; the next apply resolves once again
      // rather than reusing the previous host's cached identity.
      usernameRequested = false
      usernameFromHost = ''
      accountFromHost = null
    }
