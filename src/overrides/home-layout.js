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
     * The numbers come from the host half's roll-up route (`USAGE_ROUTE`), which
     * answers immediately with whatever it already knows. A cold answer carries
     * `computing`, and the panel keeps its skeleton up and polls until the value
     * lands — so the first paint never waits on the aggregation, and a value that
     * has not arrived yet is never drawn as a zero.
     *
     * @param ctx - client context.
     * @param ui - shared handle table.
     * @returns teardown.
     */
    function installHomeLayout(ctx, ui) {
      /** The host's list slot between the hero greeting and the composer card. */
      var DOCK_SLOT = 'conversation.input.dock'
      /** Where the roll-up lands while the host half is still folding. */
      var POLL_MS = 800
      /** Polls per load; a cold fold over a large history takes a few seconds. */
      var POLL_MAX = 15
      /** Heat-grid columns: thirty weeks of days, Sunday first — Claude Code's span. */
      var HEAT_WEEKS = 26
      /** A day's heat is bucketed into four steps against the busiest day shown. */
      var HEAT_STEPS = 4
      /** The Hobbit's length in tokens, for Claude Code's own yardstick line. */
      var HOBBIT_TOKENS = 123000

      var layout = DEFAULT_HOME_LAYOUT
      /** Whether the last pass saw the new-conversation hero, as of that reading. */
      var lastHero = false
      /** What the panel draws: the last answer, whether more is coming, and why not. */
      var usage = { value: null, computing: false, error: null, loading: false, polls: 0 }
      /**
       * The session list's own roll-up. Every listed session carries the host's
       * token-usage and model-selection projections, so this answers even when
       * the host half's route cannot (an older host half, or a failed fold), and
       * it is the only source of the model cell.
       */
      var listSummary = null
      var listLoading = false
      var usageListeners = []
      var pollTimer = null
      var disposed = false
      var slotsFiber = null

      function emit() {
        var listeners = usageListeners.slice()
        for (var i = 0; i < listeners.length; i++) {
          try {
            listeners[i]()
          } catch (error) { /* one bad listener must not stop the rest */ }
        }
      }

      function subscribe(listener) {
        usageListeners.push(listener)
        return function () {
          var index = usageListeners.indexOf(listener)
          if (index !== -1) usageListeners.splice(index, 1)
        }
      }

      function stopPolling() {
        if (pollTimer !== null) {
          clearTimeout(pollTimer)
          pollTimer = null
        }
      }

      /**
       * One read of the roll-up. `computing` schedules the next poll, so the
       * panel fills in as soon as the host half has the numbers.
       */
      function loadUsage(force) {
        if (disposed || usage.loading) return
        if (!force && usage.value !== null && !usage.computing) return
        usage.loading = true
        var request
        try {
          request = fetch(USAGE_ROUTE, { credentials: 'same-origin', headers: { accept: 'application/json' } })
        } catch (error) {
          usage.loading = false
          usage.error = 'unavailable'
          emit()
          return
        }
        request.then(function (response) {
          return response !== null && response.ok === true ? response.json() : null
        }).then(function (body) {
          usage.loading = false
          if (disposed) return
          if (body === null || body.ok !== true) {
            usage.error = 'unavailable'
            emit()
            return
          }
          usage.value = body.value === undefined ? null : body.value
          usage.computing = body.computing === true
          usage.error = body.error === undefined ? null : body.error
          emit()
          if (usage.computing) {
            if (usage.polls >= POLL_MAX) return
            usage.polls += 1
            stopPolling()
            pollTimer = setTimeout(function () {
              pollTimer = null
              loadUsage(true)
            }, POLL_MS)
          }
        }).catch(function () {
          usage.loading = false
          if (disposed) return
          usage.error = 'unavailable'
          emit()
        })
      }

      /**
       * The session list's roll-up.
       *
       * The host's list rows carry their own projection block
       * (`projections.values`): `tokenUsage` with its four disjoint buckets,
       * `modelSelection` with the route the session last used, and
       * `sessionListMetadata` with the blank flag and the last prompt time.
       * Summing them gives the panel a second, cheaper source — and the model
       * cell's only source, since the roll-up route reports tokens rather than
       * models.
       *
       * A session's whole total is bucketed onto its own last-activity day: the
       * list has no per-day split, so this is coarser than the host half's fold,
       * which is exactly why the panel names the source it drew from.
       */
      function summarizeSessionList(rows) {
        var tokens = 0
        var dayCount = {}
        var byDay = {}
        var byModel = {}
        var entries = []
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i]
          var values = row !== null && row !== undefined && row.projections !== undefined && row.projections !== null
            ? row.projections.values
            : null
          if (values === null || values === undefined) continue
          var meta = values.sessionListMetadata
          if (meta !== null && meta !== undefined && meta.blank === true) continue
          var bucket = values.tokenUsage
          var total = bucket === null || bucket === undefined ? 0
            : (bucket.uncachedInputTokens || 0) + (bucket.outputTokens || 0)
              + (bucket.cacheReadTokens || 0) + (bucket.cacheWriteTokens || 0)
          tokens += total
          var at = meta !== null && meta !== undefined && typeof meta.lastPromptAt === 'number'
            ? meta.lastPromptAt
            : row.updatedAt
          var selection = values.modelSelection
          var picked = selection !== null && selection !== undefined ? (selection.next || selection.lastUsed) : null
          var id = picked !== null && picked !== undefined && typeof picked.model === 'string' ? picked.model : null
          entries.push({ at: typeof at === 'number' ? at : 0, tokens: total, model: id })
          if (typeof at === 'number') {
            var day = dayKey(new Date(at))
            dayCount[day] = true
            byDay[day] = (byDay[day] || 0) + total
          }
          if (id !== null) {
            var cell = byModel[id]
            if (cell === undefined) {
              cell = { tokens: 0, sessions: 0, lastAt: 0 }
              byModel[id] = cell
            }
            cell.tokens += total
            cell.sessions += 1
            if (typeof at === 'number' && at > cell.lastAt) cell.lastAt = at
          }
        }
        var favorite = null
        var best = 0
        var models = []
        for (var name in byModel) {
          models.push({ id: name, tokens: byModel[name].tokens, sessions: byModel[name].sessions, lastAt: byModel[name].lastAt })
          if (byModel[name].sessions > best) {
            best = byModel[name].sessions
            favorite = name
          }
        }
        models.sort(function (left, right) { return right.tokens - left.tokens })
        var days = []
        for (var date in byDay) days.push({ date: date, total: byDay[date] })
        return { tokens: tokens, sessions: entries.length, activeDays: Object.keys(dayCount).length, model: favorite, models: models, days: days, entries: entries }
      }

      /** Read the session list once; a host without the remote service keeps the route's answer. */
      function loadSessionSummary() {
        if (disposed || listLoading || listSummary !== null) return
        var sessions
        try {
          sessions = ctx.get('remote.session')
        } catch (error) {
          sessions = undefined
        }
        if (sessions === undefined || sessions === null || typeof sessions.list !== 'function') return
        listLoading = true
        sessions.list({}).then(function (result) {
          listLoading = false
          if (disposed) return
          var items = result !== null && result !== undefined && result.ok === true
            && result.value !== null && result.value !== undefined && Array.isArray(result.value.items)
            ? result.value.items
            : null
          if (items === null) return
          listSummary = summarizeSessionList(items)
          emit()
        }).catch(function () {
          listLoading = false
        })
      }

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
        if (next === HOME_LAYOUT_STUDIO) loadUsage(false)
        emit()
      }

      /** One token count, short enough for a stat cell. */
      function formatTokens(count) {
        var value = Number(count) || 0
        if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B'
        if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M'
        if (value >= 1e3) return (value / 1e3).toFixed(1) + 'K'
        return String(Math.round(value))
      }

      function formatCount(count) {
        var value = Math.round(Number(count) || 0)
        return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }

      /** A local calendar day, matching the host half's day keys. */
      function dayKey(date) {
        var pad = function (value) { return value < 10 ? '0' + value : String(value) }
        return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate())
      }

      /** The range pills: all time, or the last 30/7 calendar days including today. */
      var HOME_RANGES = [
        { id: 'all', labelKey: 'homeRangeAll', fallback: 'All', days: 0 },
        { id: '30d', labelKey: 'homeRange30d', fallback: '30d', days: 30 },
        { id: '7d', labelKey: 'homeRange7d', fallback: '7d', days: 7 },
      ]

      /** The first day key of a range window; all time has none. */
      function rangeStart(windowDays) {
        if (!windowDays) return null
        var start = new Date()
        start.setHours(0, 0, 0, 0)
        start.setDate(start.getDate() - (windowDays - 1))
        return dayKey(start)
      }

      /** A settlement hour as Claude Code writes it: "5 AM" / "下午 3 点". */
      function formatHour(hour) {
        var h12 = hour % 12 === 0 ? 12 : hour % 12
        return copyLabel(hour < 12 ? 'homeHourAm' : 'homeHourPm', hour < 12 ? '{hour} AM' : '{hour} PM', { hour: h12 })
      }

      /**
       * The heat grid: one cell per day, weeks as columns, Sunday first, running
       * back HEAT_WEEKS weeks from today. Days the roll-up does not cover are
       * cells with no heat, which is exactly what an empty cell means.
       */
      function heatGrid(days) {
        var byDate = {}
        var list = days === null || days === undefined ? [] : days
        for (var i = 0; i < list.length; i++) {
          var entry = list[i]
          // The host half's fold carries the four buckets; the session list's
          // roll-up can only carry one total per day, so it is read when present.
          byDate[entry.date] = entry.total !== undefined
            ? entry.total
            : (entry.input || 0) + (entry.output || 0) + (entry.cacheRead || 0) + (entry.cacheWrite || 0)
        }
        var today = new Date()
        today.setHours(0, 0, 0, 0)
        var start = new Date(today)
        start.setDate(start.getDate() - (HEAT_WEEKS * 7 - 1))
        start.setDate(start.getDate() - start.getDay())
        var cells = []
        var peak = 0
        for (var cursor = new Date(start); cursor <= today; cursor.setDate(cursor.getDate() + 1)) {
          var key = dayKey(cursor)
          var tokens = byDate[key] || 0
          if (tokens > peak) peak = tokens
          cells.push({ date: key, tokens: tokens, level: 0 })
        }
        for (var c = 0; c < cells.length; c++) {
          if (cells[c].tokens === 0 || peak === 0) continue
          cells[c].level = Math.max(1, Math.min(HEAT_STEPS, Math.ceil(cells[c].tokens / peak * HEAT_STEPS)))
        }
        return { cells: cells, peak: peak }
      }

      /** Re-render on every store change. */
      function useUsage() {
        var pair = React.useState(0)
        var bump = pair[1]
        React.useEffect(function () {
          return subscribe(function () { bump(function (count) { return count + 1 }) })
        }, [])
        return usage
      }

      function statCell(key, label, text, skeleton) {
        return React.createElement(
          'div',
          { key: key, className: 'dsh-claude-home-stat', 'data-skeleton': skeleton ? '' : undefined },
          React.createElement('span', { className: 'dsh-claude-home-stat-label' }, label),
          React.createElement('span', { className: 'dsh-claude-home-stat-value', title: skeleton ? undefined : text }, skeleton ? '' : text),
        )
      }

      /**
       * The usage panel. It draws its frame — the head pills, the stat cells and
       * the empty heat grid — before any number arrives, and the frame's geometry
       * does not change when the numbers land, so the page never shifts under the
       * pointer.
       *
       * The head is Claude Code's own: an Overview/Models tab pair on the left,
       * the All/30d/7d range trio on the right. The range
       * window filters the tiles (the heat grid keeps its own twenty-six-week
       * window); the Models tab lists the session list's per-model totals.
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
        var value = state.value
        // The roll-up route first; the session list's own projections are the
        // second source, and the model cells' only one.
        var ready = value !== null && value.totals !== undefined
        var listed = listSummary
        var totals = ready ? value.totals : null
        var known = ready || listed !== null
        // The range window: a start day key, or null for all time.
        var windowDays = 0
        for (var r = 0; r < HOME_RANGES.length; r++) {
          if (HOME_RANGES[r].id === range) windowDays = HOME_RANGES[r].days
        }
        var start = rangeStart(windowDays)
        var startMs = start === null ? null : new Date(start + 'T00:00:00').getTime()
        var inRange = function (date) { return start === null || date >= start }
        var tokens = 0
        var calls = null
        var sessions = null
        var activeDays = null
        if (ready && start === null) {
          // All time reads the fold's own totals; its session count is already
          // the distinct union over every day.
          tokens = (totals.input || 0) + (totals.output || 0) + (totals.cacheRead || 0) + (totals.cacheWrite || 0)
          calls = totals.calls
          sessions = totals.sessions
          activeDays = totals.activeDays
        } else if (ready) {
          // A window sums the per-day buckets. Sessions union the per-day id
          // lists when the host half carries them on every day; an older host
          // half has none, and the per-day counts then sum to an upper bound
          // rather than reading zero.
          var ids = {}
          var everyDayHasIds = true
          var daySessions = 0
          calls = 0
          sessions = 0
          activeDays = 0
          for (var d = 0; d < value.days.length; d++) {
            var day = value.days[d]
            if (!inRange(day.date)) continue
            tokens += (day.input || 0) + (day.output || 0) + (day.cacheRead || 0) + (day.cacheWrite || 0)
            calls += day.calls || 0
            activeDays += 1
            if (Array.isArray(day.sessionIds)) {
              for (var s = 0; s < day.sessionIds.length; s++) ids[day.sessionIds[s]] = true
            } else {
              everyDayHasIds = false
            }
            daySessions += day.sessions || 0
          }
          sessions = everyDayHasIds ? Object.keys(ids).length : daySessions
        } else if (listed !== null) {
          // The list's fall-back: a session's whole total rides its last-activity
          // day, so the window keeps the sessions whose last prompt falls inside.
          sessions = 0
          activeDays = 0
          for (var e = 0; e < listed.entries.length; e++) {
            var item = listed.entries[e]
            if (startMs !== null && item.at < startMs) continue
            tokens += item.tokens
            sessions += 1
          }
          for (var ld = 0; ld < listed.days.length; ld++) {
            if (inRange(listed.days[ld].date)) activeDays += 1
          }
        }
        // The yardstick line reads the all-time total, whatever the window is.
        var allTokens = ready
          ? (totals.input || 0) + (totals.output || 0) + (totals.cacheRead || 0) + (totals.cacheWrite || 0)
          : (listed === null ? 0 : listed.tokens)
        // The hour histogram is the fold's own; the cost-meter answer has none.
        var peakHour = null
        if (ready && Array.isArray(value.hours)) {
          var bestHour = 0
          var hourSum = 0
          for (var h = 0; h < 24; h++) {
            var hourCount = Number(value.hours[h]) || 0
            hourSum += hourCount
            if (hourCount > (Number(value.hours[bestHour]) || 0)) bestHour = h
          }
          if (hourSum > 0) peakHour = formatHour(bestHour)
        }
        var model = null
        if (listed !== null) {
          if (start === null) model = listed.model
          else {
            var bestSessions = 0
            for (var m = 0; m < listed.models.length; m++) {
              var windowed = listed.models[m]
              if (windowed.lastAt < startMs || windowed.sessions <= bestSessions) continue
              bestSessions = windowed.sessions
              model = windowed.id
            }
          }
        }
        if (model === null && ready && typeof value.model === 'string') model = value.model
        var grid = heatGrid(ready ? value.days : (listed === null ? null : listed.days))
        var fun = allTokens >= HOBBIT_TOKENS
          ? copyLabel('homeFunHobbit', "You've used ~{count}× more tokens than The Hobbit.", { count: formatCount(Math.round(allTokens / HOBBIT_TOKENS)) })
          : null

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

        function overviewView() {
          return React.createElement(
            React.Fragment,
            null,
            React.createElement(
              'div',
              { className: 'dsh-claude-home-stats' },
              // A figure the source cannot answer is a dash, not a zero and not a
              // skeleton: the skeleton means "still loading", which this is not.
              statCell('sessions', copyLabel('homeSessions', 'Sessions'), sessions === null ? '—' : formatCount(sessions), !known),
              statCell('calls', copyLabel('homeCalls', 'Calls'), calls === null ? '—' : formatCount(calls), !known),
              statCell('tokens', copyLabel('homeTokens', 'Tokens'), formatTokens(tokens), !known),
              statCell('days', copyLabel('homeActiveDays', 'Active days'), activeDays === null ? '—' : formatCount(activeDays), !known),
              statCell('peak', copyLabel('homePeakHour', 'Peak hour'), peakHour === null ? '—' : peakHour, !known),
              statCell('model', copyLabel('homeTopModel', 'Top model'), model === null ? '—' : model, !known),
            ),
            React.createElement(
              'div',
              { className: 'dsh-claude-home-heat', 'data-skeleton': known ? undefined : '' },
              grid.cells.map(function (cell) {
                return React.createElement('span', {
                  key: cell.date,
                  className: 'dsh-claude-home-heat-cell',
                  'data-level': cell.level,
                  title: cell.date + ' · ' + formatTokens(cell.tokens),
                })
              }),
            ),
            fun === null ? null : React.createElement('span', { className: 'dsh-claude-home-fun' }, fun),
          )
        }

        function modelsView() {
          var models = listed === null ? null : listed.models.filter(function (entry) {
            return startMs === null || entry.lastAt >= startMs
          })
          if (models !== null && models.length > 0) {
            var peak = models[0].tokens
            return React.createElement(
              'div',
              { className: 'dsh-claude-home-models' },
              models.map(function (entry) {
                return React.createElement(
                  'div',
                  {
                    key: entry.id,
                    className: 'dsh-claude-home-model',
                    title: entry.id + ' · ' + copyLabel('homeModelSessions', '{count} sessions', { count: formatCount(entry.sessions) }),
                  },
                  React.createElement('span', { className: 'dsh-claude-home-model-name' }, entry.id),
                  React.createElement(
                    'span',
                    { className: 'dsh-claude-home-model-track' },
                    React.createElement('span', {
                      className: 'dsh-claude-home-model-fill',
                      style: { width: (peak > 0 ? Math.max(2, Math.round(entry.tokens / peak * 100)) : 2) + '%' },
                    }),
                  ),
                  React.createElement('span', { className: 'dsh-claude-home-model-value' }, formatTokens(entry.tokens)),
                )
              }),
            )
          }
          if (models !== null || (!listLoading && !state.computing)) {
            return React.createElement('div', { className: 'dsh-claude-home-models-empty' }, copyLabel('homeModelsEmpty', 'No model data yet'))
          }
          // The list is still being read: three share bars at stand-in widths.
          var widths = ['72%', '48%', '60%']
          return React.createElement(
            'div',
            { className: 'dsh-claude-home-models', 'data-skeleton': '' },
            widths.map(function (width, index) {
              return React.createElement(
                'div',
                { key: index, className: 'dsh-claude-home-model' },
                React.createElement('span', { className: 'dsh-claude-home-model-name' }, ''),
                React.createElement(
                  'span',
                  { className: 'dsh-claude-home-model-track' },
                  React.createElement('span', { className: 'dsh-claude-home-model-fill', style: { width: width } }),
                ),
                React.createElement('span', { className: 'dsh-claude-home-model-value' }, ''),
              )
            }),
          )
        }

        return React.createElement(
          'section',
          {
            className: 'dsh-claude-home-panel',
            'data-dsh-claude-home-panel': '',
            'data-computing': state.computing ? '' : undefined,
            'aria-busy': state.computing || !known ? 'true' : 'false',
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
          tab === 'models' ? modelsView() : overviewView(),
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
          emit()
        }
        if (next === HOME_LAYOUT_STUDIO) {
          loadUsage(false)
          loadSessionSummary()
        }
      }

      ui.homeLayout = { sync: sync }

      registerPanel()
      setLayout(readPrefs().homeLayout)

      return function () {
        disposed = true
        stopPolling()
        usageListeners.length = 0
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
