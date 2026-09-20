    // ============================================================================
    // Zone 4.4: 设置页品牌分区 (Settings Section: Brand)
    // ============================================================================
    /**
     * The settings page section, mounted by the host into the `settings.section`
     * slot. That slot hands a section only `{ close }` plus the standard hooks, so
     * this component owns its state and persistence rather than reading a store.
     *
     * It renders a segmented control in the same visual language as the composer's
     * permission control: a single hairline track with the active segment plated.
     */
    function BrandSettingsSection() {
      var state = React.useState(readStoredBrand())
      var brand = state[0]
      var setBrand = state[1]

      var choose = function (next) {
        if (next === brand) return
        writeStoredBrand(next)
        applyBrand(next)
        setBrand(next)
      }

      var options = [
        { value: BRAND_CLAUDE, label: 'Claude' },
        { value: BRAND_ANTHROPIC, label: 'Anthropic' },
      ]

      var segments = []
      for (var i = 0; i < options.length; i++) {
        segments.push(
          React.createElement(
            'button',
            {
              key: options[i].value,
              type: 'button',
              className: 'dsh-claude-brand-option',
              'data-active': options[i].value === brand ? 'true' : 'false',
              'aria-pressed': options[i].value === brand ? 'true' : 'false',
              onClick: (function (value) {
                return function () {
                  choose(value)
                }
              })(options[i].value),
            },
            options[i].label,
          ),
        )
      }

      return React.createElement(
        'div',
        { className: 'dsh-claude-brand-section' },
        React.createElement('div', { className: 'dsh-claude-brand-title' }, 'Claude Style'),
        React.createElement(
          'div',
          { className: 'dsh-claude-brand-card' },
          React.createElement(
            'div',
            { className: 'dsh-claude-brand-card-text' },
            React.createElement('div', { className: 'dsh-claude-brand-card-title' }, 'Sidebar brand'),
            React.createElement(
              'div',
              { className: 'dsh-claude-brand-card-desc' },
              'Which brand mark the sidebar shows. Claude is the default.',
            ),
          ),
          React.createElement('div', { className: 'dsh-claude-brand-segments', role: 'group' }, segments),
        ),
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
      if (typeof ctx.inject !== 'function') return function () {}
      var fiber = ctx.inject(['slots'], function (scope) {
        var slots = scope.get('slots')
        if (slots === void 0 || slots === null || typeof slots.inject !== 'function') return
        scope.effect(function () {
          return slots.inject('settings.section', function () {
            return slots.register(
              { name: 'settings.section', id: 'claude-style', order: 22, label: function () { return 'Claude Style' } },
              BrandSettingsSection,
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
