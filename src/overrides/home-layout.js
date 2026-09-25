    /**
     * The home page's second layout, and the usage panel that fills it.
     *
     * `classic` is the hero the skin has always drawn: brand mark and greeting
     * centred, composer under them, everything vertically centred in the scroll
     * body. `studio` is the dashboard form — the greeting moves to the top left,
     * the composer hugs the window's bottom edge, and the space between them
     * carries a usage panel. The two differ only in arrangement, so the switch
     * is one body attribute the stylesheet branches on; the host keeps owning the
     * hero's markup either way.
     *
     * The panel's own seat is `conversation.input.dock`, the host's list slot
     * rendered between the greeting and the composer card. It is the only seat in
     * the hero region that accepts a new entry (the brand mark, workspace and
     * preset seats are `single` and occupied), and it is scoped to a session, so
     * on the cold start screen — no session object yet — the host does not render
     * it at all and the studio layout simply shows the greeting and the composer.
     *
     * This fragment is the shell: the seat registration, the head (the
     * Overview/Models tabs and the All/30d/7d range pills), the tab switch and
     * the teardown. The numbers behind it come from `overrides/home/data.js`,
     * and the two tabs render from `overrides/home/overview.js` and
     * `overrides/home/models.js`.
     *
     * @param ctx - client context.
     * @param ui - shared handle table.
     * @returns teardown.
     */
    function installHomeLayout(ctx, ui) {
      /** The host's list slot between the hero greeting and the composer card. */
      var DOCK_SLOT = 'conversation.input.dock'

      var layout = DEFAULT_HOME_LAYOUT
      /** Whether the last pass saw the new-conversation hero, as of that reading. */
      var lastHero = false
      /**
       * The yardstick book's draw. It is held here, not in the panel: the dock
       * seat keeps the panel mounted inside a conversation too, and the draw is
       * renewed each time the page comes back to the new-conversation hero.
       */
      var bookPick = Math.random()
      var slotsFiber = null

      var usage = createHomeUsage(ctx)
      var overview = createHomeOverview()
      var models = createHomeModels()

      /**
       * Whether the page currently shows the new-conversation hero.
       *
       * The dock seat renders in both phases — the host puts it above the
       * composer inside a conversation too — so the layout alone is not enough:
       * the panel belongs to the home page, and only the hero phase is home. The
       * conversation root carries the phase (`data-phase="hero"`); the same
       * marker the composer feature reads, and the element test is qualified by
       * `_root` because the draft editor and the connection indicator carry a
       * `data-phase` of their own.
       */
      function heroPhase() {
        return document.querySelector('[class*="_root"][data-phase="hero"]') !== null
      }

      /** Write the layout onto the document and start loading when it needs data. */
      function setLayout(next) {
        layout = next
        lastHero = heroPhase()
        if (next === HOME_LAYOUT_STUDIO) document.body.setAttribute(HOME_LAYOUT_ATTR, HOME_LAYOUT_STUDIO)
        else document.body.removeAttribute(HOME_LAYOUT_ATTR)
        if (next === HOME_LAYOUT_STUDIO) usage.load(false)
        usage.notify()
      }

      /** Re-render on every store change. */
      function useUsage() {
        var pair = React.useState(0)
        var bump = pair[1]
        React.useEffect(function () {
          return usage.subscribe(function () { bump(function (count) { return count + 1 }) })
        }, [])
        return usage.state()
      }

      /**
       * The usage panel. It draws its frame — the head pills, the stat cells and
       * the empty heat grid — before any number arrives, and the frame's geometry
       * does not change when the numbers land, so the page never shifts under the
       * pointer.
       *
       * The head is Claude Code's own: an Overview/Models tab pair on the left,
       * the All/30d/7d range trio on the right. The range window filters the
       * tiles and the model list; the heat grid and the models chart keep their
       * own windows, the way Claude Code's do.
       */
      function HomeUsagePanel() {
        var state = useUsage()
        var tabState = React.useState('overview')
        var tab = tabState[0]
        var setTab = tabState[1]
        var rangeState = React.useState('all')
        var range = rangeState[0]
        var setRange = rangeState[1]
        if (layout !== HOME_LAYOUT_STUDIO || !heroPhase()) return null
        var data = homePanelData(state, usage.list(), range, bookPick)

        function tabButton(id, label) {
          return React.createElement('button', {
            key: id,
            type: 'button',
            className: 'dsh-claude-home-tab',
            'data-active': tab === id ? '' : undefined,
            'aria-pressed': tab === id,
            onClick: function () { setTab(id) },
          }, label)
        }

        return React.createElement(
          'section',
          {
            className: 'dsh-claude-home-panel',
            'data-dsh-claude-home-panel': '',
            'data-computing': state.computing ? '' : undefined,
            'aria-busy': state.computing || !data.known ? 'true' : 'false',
          },
          React.createElement(
            'div',
            { className: 'dsh-claude-home-panel-head' },
            React.createElement(
              'div',
              { className: 'dsh-claude-home-tabs' },
              tabButton('overview', copyLabel('homeTabOverview', 'Overview')),
              tabButton('models', copyLabel('homeTabModels', 'Models')),
            ),
            React.createElement(
              'div',
              { className: 'dsh-claude-home-panel-side' },
              React.createElement(
                'div',
                { className: 'dsh-claude-home-ranges' },
                HOME_RANGES.map(function (item) {
                  return React.createElement('button', {
                    key: item.id,
                    type: 'button',
                    className: 'dsh-claude-home-range',
                    'data-active': range === item.id ? '' : undefined,
                    'aria-pressed': range === item.id,
                    onClick: function () { setRange(item.id) },
                  }, copyLabel(item.labelKey, item.fallback))
                }),
              ),
            ),
          ),
          tab === 'models'
            ? React.createElement(models.component, { data: data })
            : overview.view(data),
        )
      }

      /**
       * Register the panel. The seat is declared by the host's conversation
       * package, so the registration waits for the declaration the same way the
       * settings section does; a host that never declares it simply keeps the
       * classic layout's spacing.
       */
      function registerPanel() {
        if (typeof ctx.inject !== 'function') return
        slotsFiber = ctx.inject(['slots'], function (scope) {
          var slots = scope.get('slots')
          if (slots === undefined || slots === null || typeof slots.inject !== 'function') return
          scope.effect(function () {
            return slots.inject(DOCK_SLOT, function () {
              // A list seat keys its entries by id; the dock also carries the
              // host's todo, queue and goal bars, so the id is what keeps this
              // panel's slot stable across their re-renders.
              return slots.register({ name: DOCK_SLOT, id: 'claude-style-usage', order: 40 }, HomeUsagePanel)
            })
          }, 'dsh-claude-style: home usage panel')
        })
      }

      /** Each pass reads the preference and the phase; only a change re-renders. */
      function sync() {
        var next = readPrefs().homeLayout
        if (next !== layout) {
          setLayout(next)
          return
        }
        // The hero/active phase flips without any preference change (opening a
        // session, or the new-session row), and the panel's visibility follows
        // it — so the flip has to reach the component.
        var hero = heroPhase()
        if (hero !== lastHero) {
          lastHero = hero
          if (hero) bookPick = Math.random()
          usage.notify()
        }
        if (next === HOME_LAYOUT_STUDIO) {
          usage.load(false)
          usage.loadList()
        }
      }

      ui.homeLayout = { sync: sync }

      registerPanel()
      setLayout(readPrefs().homeLayout)

      return function () {
        usage.stop()
        document.body.removeAttribute(HOME_LAYOUT_ATTR)
        if (slotsFiber !== null) {
          try {
            if (typeof slotsFiber.dispose === 'function') slotsFiber.dispose()
          } catch (error) { /* the fiber may already be gone during teardown */ }
          slotsFiber = null
        }
        delete ui.homeLayout
      }
    }
