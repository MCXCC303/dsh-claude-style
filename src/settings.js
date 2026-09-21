    /**
     * The settings page section, mounted by the host into the `settings.section`
     * slot. That slot hands a section only `{ close }` plus the standard hooks,
     * so this component owns no store of its own: it reads and writes the skin
     * preferences through src/context/prefs.js, which owns the host round trip, and
     * follows changes the same way the rest of the skin does.
     *
     * Copy comes from the model copy document's `settings` block, so the page
     * follows the shell language like every other string the skin paints. The
     * English literals here are the fallback for a failed fetch.
     *
     * Both segmented controls reuse the shared `.dsh-claude-segments` /
     * `.dsh-claude-segment` classes — the same control the composer's permission
     * picker uses — so the two read as one design instead of two lookalikes.
     */
    function ClaudeStyleSettingsSection() {
      var state = React.useState(readPrefs())
      var prefs = state[0]
      var setPrefs = state[1]
      var errorState = React.useState(null)
      var error = errorState[0]
      var setError = errorState[1]
      var usernameState = React.useState(prefs.username)
      var username = usernameState[0]
      var setUsername = usernameState[1]
      var usernameTimer = React.useRef(null)

      // The skin's own apply-side writes land here too (a reload, a conflict
      // re-read), so the page never drifts from what the document says.
      React.useEffect(function () {
        syncSettingsNav()
        var alive = true
        var unsubscribe = subscribePrefs(function (next) {
          if (alive) {
            setPrefs(next)
            setUsername(next.username)
          }
        })
        var unsubscribeCopy = onModelCopyLoaded(function () {
          if (alive) setPrefs(function (p) { return Object.assign({}, p) })
        })
        return function () {
          alive = false
          unsubscribe()
          if (unsubscribeCopy) unsubscribeCopy()
          if (usernameTimer.current) clearTimeout(usernameTimer.current)
        }
      }, [])

      /**
       * Apply one change. The control flips immediately and the host write
       * follows; a refusal re-reads the authoritative value and says so.
       */
      var write = function (patch) {
        setError(null)
        setPrefs(Object.assign({}, prefs, patch))
        savePrefs(patch).then(function (result) {
          if (result === null) setError(settingsCopy('unavailable', 'The settings store is unavailable, so changes will not be saved.'))
        })
      }

      var saveUsernameNow = function (value) {
        var next = value.trim().slice(0, USERNAME_MAX)
        if (next === readPrefs().username) return
        setError(null)
        setPrefs(Object.assign({}, readPrefs(), { username: next }))
        savePrefs({ username: next }).then(function (result) {
          if (result === null) setError(settingsCopy('unavailable', 'The settings store is unavailable, so changes will not be saved.'))
        })
      }

      var queueUsernameSave = function (value) {
        if (usernameTimer.current) clearTimeout(usernameTimer.current)
        usernameTimer.current = setTimeout(function () {
          usernameTimer.current = null
          saveUsernameNow(value)
        }, 600)
      }

      var commitUsername = function () {
        if (usernameTimer.current) {
          clearTimeout(usernameTimer.current)
          usernameTimer.current = null
        }
        saveUsernameNow(username)
      }

      var segment = function (options, active, onPick) {
        var buttons = []
        for (var i = 0; i < options.length; i++) {
          buttons.push(React.createElement(
            'button',
            {
              key: options[i].value,
              type: 'button',
              className: SEGMENT_CLASS,
              'data-active': options[i].value === active ? '' : undefined,
              'aria-pressed': options[i].value === active ? 'true' : 'false',
              onClick: (function (value) {
                return function () {
                  if (value !== active) onPick(value)
                }
              })(options[i].value),
            },
            options[i].label,
          ))
        }
        return React.createElement('div', { className: SEGMENTS_CLASS, role: 'group' }, buttons)
      }

      var toggle = function (on, onPick) {
        return React.createElement(
          'button',
          {
            type: 'button',
            className: 'dsh-claude-settings-switch',
            role: 'switch',
            'aria-checked': on ? 'true' : 'false',
            'data-on': on ? '' : undefined,
            onClick: function () { onPick(!on) },
          },
          React.createElement('span', { className: 'dsh-claude-settings-switch-knob' }),
        )
      }

      var row = function (key, title, description, control) {
        return React.createElement(
          'div',
          { className: 'dsh-claude-settings-row', key: key },
          React.createElement(
            'div',
            { className: 'dsh-claude-settings-row-text' },
            React.createElement('div', { className: 'dsh-claude-settings-row-title' }, title),
            React.createElement('div', { className: 'dsh-claude-settings-row-desc' }, description),
          ),
          control,
        )
      }

      var brandOptions = [
        { value: BRAND_OFF, label: settingsCopy('brandOff', 'Off') },
        { value: BRAND_CLAUDE, label: settingsCopy('brandClaude', 'Claude') },
        { value: BRAND_ANTHROPIC, label: settingsCopy('brandAnthropic', 'Anthropic') },
      ]
      var scopeOptions = [
        { value: 'off', label: settingsCopy('scopeOff', 'Off') },
        { value: 'hero', label: settingsCopy('scopeHero', 'Home only') },
        { value: 'conversation', label: settingsCopy('scopeConversation', 'Conversation only') },
        { value: 'all', label: settingsCopy('scopeAll', 'All') },
      ]
      var banLocaleOptions = [
        { value: BAN_LOCALE_ZH, label: settingsCopy('banLocaleZh', '中文') },
        { value: BAN_LOCALE_EN, label: settingsCopy('banLocaleEn', 'English') },
      ]

      var rows = [
        row(
          'username',
          settingsCopy('usernameTitle', 'Username'),
          settingsCopy('usernameDesc', 'Shown in the new-conversation greeting. Leave empty to use the name resolved from the host user.'),
          React.createElement('input', {
            type: 'text',
            className: 'dsh-claude-settings-input',
            value: username,
            maxLength: USERNAME_MAX,
            placeholder: settingsCopy('usernamePlaceholder', 'Auto-detect from host user'),
            spellCheck: false,
            autoComplete: 'off',
            onChange: function (e) {
              setUsername(e.target.value)
              queueUsernameSave(e.target.value)
            },
            onBlur: commitUsername,
            onKeyDown: function (e) {
              if (e.key === 'Enter') {
                e.preventDefault()
                commitUsername()
                if (e.currentTarget && e.currentTarget.blur) e.currentTarget.blur()
              } else if (e.key === 'Escape') {
                setUsername(prefs.username)
                if (e.currentTarget && e.currentTarget.blur) e.currentTarget.blur()
              }
            },
          }),
        ),
        row(
          'brand',
          settingsCopy('brandTitle', 'Brand mark'),
          settingsCopy('brandDesc', 'Which brand mark the sidebar shows. "Off" leaves the host\'s own brand area untouched.'),
          segment(brandOptions, prefs.brand, function (value) { write({ brand: value }) }),
        ),
        row(
          'collapseFooter',
          settingsCopy('collapseTitle', 'Collapse the sidebar settings area'),
          settingsCopy('collapseDesc', 'Fold the sidebar footer\'s settings entry into the account popover. Off hands the footer back to the host entirely.'),
          toggle(prefs.collapseFooter, function (value) { write({ collapseFooter: value }) }),
        ),
        row(
          'autoPopover',
          settingsCopy('autoPopoverTitle', 'Open popovers on hover'),
          settingsCopy('autoPopoverDesc', 'Hover opens the account, model, and permission popovers. Off switches them to click-to-open.'),
          toggle(prefs.autoPopover, function (value) { write({ autoPopover: value }) }),
        ),
        row(
          'composerScope',
          settingsCopy('composerTitle', 'Composer restyle'),
          settingsCopy('composerDesc', 'Which input area the skin restyles: the new-conversation page, the conversation, or both.'),
          segment(scopeOptions, prefs.composerScope, function (value) { write({ composerScope: value }) }),
        ),
        row(
          'modelPicker',
          settingsCopy('pickerTitle', 'Redraw the model picker'),
          settingsCopy('pickerDesc', 'Replace the composer\'s model seat with the two-level Claude-style menu. Off hands the model menu back to the host; the rest of the composer restyle is unaffected.'),
          toggle(prefs.modelPicker, function (value) { write({ modelPicker: value }) }),
        ),
        row(
          'banLocale',
          settingsCopy('banLocaleTitle', 'Account-hold easter egg language'),
          settingsCopy('banLocaleDesc', 'The language the account-hold page (click the account row in the sidebar footer popover) is written in. It is its own choice, so the page reads the way Claude wrote it whatever the interface language is.'),
          segment(banLocaleOptions, prefs.banLocale, function (value) { write({ banLocale: value }) }),
        ),
      ]

      if (error !== null) {
        rows.push(React.createElement('div', { className: 'dsh-claude-settings-error', key: 'error' }, error))
      }

      return React.createElement(
        'div',
        { className: 'dsh-claude-settings' },
        React.createElement('div', { className: 'dsh-claude-settings-title' }, settingsCopy('title', 'Claude Style')),
        rows,
      )
    }

    /**
     * Register the settings section.
     *
     * Two waits are needed, and both are declarative rather than polling:
     *
     *   1. `ctx.inject(['slots'], …)` waits for the slot registry service. The
     *      renderer provides it, so reading `ctx.get('slots')` directly during
     *      `apply` could see nothing and silently drop the section.
     *   2. `slots.inject('settings.section', …)` waits for the slot *declaration*,
     *      which `dsh-client-ui-settings-general` publishes later. Registering
     *      eagerly instead would throw and fail the boot.
     *
    /**
     * Stamped onto the Claude Style nav button in the settings dialog so CSS
     * can replace the host's default settings gear with the black Claude mark.
     */
    function syncSettingsNav() {
      var navList = document.querySelector(':is([class*="settingsArea"], [class*="_overlay"], [class*="SettingsRoot"]) [class*="_navList"]')
      if (!navList) return
      var buttons = navList.querySelectorAll('button')
      var targetTitle = (typeof settingsCopy === 'function' ? settingsCopy('title', 'Claude Style') : 'Claude Style') || 'Claude Style'
      for (var i = 0; i < buttons.length; i++) {
        var btn = buttons[i]
        var label = btn.querySelector('[class*="_navLabel"]') || btn
        var text = (label.textContent || '').trim()
        if (text === 'Claude Style' || text === targetTitle) {
          if (btn.getAttribute('data-dsh-section') !== 'claude-style') {
            btn.setAttribute('data-dsh-section', 'claude-style')
          }
          return
        }
      }
    }

    function installSettingsSection(ctx, ui) {
      loadModelCopy()
      if (ui) {
        ui.settings = {
          sync: syncSettingsNav,
        }
      }
      if (typeof ctx.inject !== 'function') return function () {}
      var fiber = ctx.inject(['slots'], function (scope) {
        var slots = scope.get('slots')
        if (slots === void 0 || slots === null || typeof slots.inject !== 'function') return
        scope.effect(function () {
          return slots.inject('settings.section', function () {
            return slots.register(
              {
                name: 'settings.section',
                id: 'claude-style',
                order: 22,
                // A function, so the navigation entry localizes once the copy
                // document has arrived; the literal is the pre-fetch fallback.
                label: function () { return settingsCopy('title', 'Claude Style') },
              },
              ClaudeStyleSettingsSection,
            )
          })
        }, 'dsh-claude-style: settings section')
      })
      return function () {
        if (ui && ui.settings) {
          delete ui.settings
        }
        try {
          if (fiber && typeof fiber.dispose === 'function') fiber.dispose()
        } catch (error) {
          /* the fiber may already be gone during teardown */
        }
      }
    }
