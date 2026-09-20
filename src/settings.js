    // ============================================================================
    // 设置页 (Settings Section)
    // ============================================================================
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

      // The skin's own apply-side writes land here too (a reload, a conflict
      // re-read), so the page never drifts from what the document says.
      React.useEffect(function () {
        var alive = true
        var unsubscribe = subscribePrefs(function (next) {
          if (alive) setPrefs(next)
        })
        var unsubscribeCopy = onModelCopyLoaded(function () {
          if (alive) setPrefs(function (p) { return Object.assign({}, p) })
        })
        return function () {
          alive = false
          unsubscribe()
          if (unsubscribeCopy) unsubscribeCopy()
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

      var rows = [
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
          settingsCopy('autoPopoverDesc', 'Hover opens the account and model popovers. Off switches them to click-to-open.'),
          toggle(prefs.autoPopover, function (value) { write({ autoPopover: value }) }),
        ),
        row(
          'composerScope',
          settingsCopy('composerTitle', 'Composer restyle'),
          settingsCopy('composerDesc', 'Which input area the skin restyles: the new-conversation page, the conversation, or both.'),
          segment(scopeOptions, prefs.composerScope, function (value) { write({ composerScope: value }) }),
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
     * `order: 22` sorts the section after the shipped ones (general 0, models 10,
     * plugins 15, agent-presets 20, chat-import 21). The slot accepts no icon
     * field, so the navigation entry takes the host's default glyph.
     *
     * @param ctx - client root context.
     * @returns a disposer that tears the registration down.
     */
    function installSettingsSection(ctx) {
      loadModelCopy()
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
        try {
          if (fiber && typeof fiber.dispose === 'function') fiber.dispose()
        } catch (error) {
          /* the fiber may already be gone during teardown */
        }
      }
    }
