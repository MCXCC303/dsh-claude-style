    /**
     * The usage panel's data: the host half's roll-up route, the session list's
     * own projections, and the small vocabulary the two views share.
     *
     * The route (`USAGE_ROUTE`) is the panel's first source: it folds the local
     * session logs (or reads the cost-meter ledger) and answers immediately with
     * whatever it already knows. A cold answer carries `computing`, and the panel
     * keeps its skeleton up and polls until the value lands — so the first paint
     * never waits on the aggregation, and a value that has not arrived yet is
     * never drawn as a zero.
     *
     * The session list is the second source. Every listed session carries the
     * host's token-usage and model-selection projections, so it answers even when
     * the route cannot (an older host half, or a failed fold). It is coarser —
     * one total per session, bucketed onto that session's last-activity day — so
     * the panel names the source it drew from.
     *
     * `homePanelData` is the one derivation both views read: the range window and
     * the figures it sums, the heat grid's cells, the ranked model list, and the
     * per-day per-model totals the models chart stacks.
     */
    /** Where the roll-up lands while the host half is still folding. */
    var HOME_POLL_MS = 800
    /** Polls per load; a cold fold over a large history takes a few seconds. */
    var HOME_POLL_MAX = 15
    /** Heat-grid columns: twenty-six weeks of days, Sunday first — Claude Code's span. */
    var HOME_HEAT_WEEKS = 26
    /** A day's heat is bucketed into four steps against the busiest day shown. */
    var HOME_HEAT_STEPS = 4
    /** The Hobbit's length in tokens, for Claude Code's own yardstick line. */
    var HOME_HOBBIT_TOKENS = 123000
    /** The models chart's own window, in days: Claude Code's chart spans a month. */
    var HOME_CHART_DAYS = 30
    /** Models the ranked list shows before its "show more" row. */
    var HOME_MODEL_ROWS = 6
    /** The range pills: all time, or the last 30/7 calendar days including today. */
    var HOME_RANGES = [
      { id: 'all', labelKey: 'homeRangeAll', fallback: 'All', days: 0 },
      { id: '30d', labelKey: 'homeRange30d', fallback: '30d', days: 30 },
      { id: '7d', labelKey: 'homeRange7d', fallback: '7d', days: 7 },
    ]

    /** A local calendar day, matching the host half's day keys. */
    function homeDayKey(date) {
      var pad = function (value) { return value < 10 ? '0' + value : String(value) }
      return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate())
    }

    /** The first day key of a range window; all time has none. */
    function homeRangeStart(windowDays) {
      if (!windowDays) return null
      var start = new Date()
      start.setHours(0, 0, 0, 0)
      start.setDate(start.getDate() - (windowDays - 1))
      return homeDayKey(start)
    }

    /** One token count, short enough for a stat cell or an axis label. */
    function formatHomeTokens(count) {
      var value = Number(count) || 0
      if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B'
      if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M'
      if (value >= 1e3) return (value / 1e3).toFixed(1) + 'K'
      return String(Math.round(value))
    }

    function formatHomeCount(count) {
      var value = Math.round(Number(count) || 0)
      return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    /** A settlement hour as Claude Code writes it: "5 AM" / "下午 3 点". */
    function formatHomeHour(hour) {
      var h12 = hour % 12 === 0 ? 12 : hour % 12
      return copyLabel(hour < 12 ? 'homeHourAm' : 'homeHourPm', hour < 12 ? '{hour} AM' : '{hour} PM', { hour: h12 })
    }

    /**
     * The tokens one day entry stands for. The host half's fold carries the four
     * buckets; the session list's roll-up can only carry one total per day, so it
     * is read when present.
     */
    function homeDayTokens(day) {
      if (day === null || day === undefined) return 0
      if (day.total !== undefined) return Number(day.total) || 0
      return (day.input || 0) + (day.output || 0) + (day.cacheRead || 0) + (day.cacheWrite || 0)
    }

    /** One model's bucket sum, for the ranked list's input and output columns. */
    function homeModelTokens(entry) {
      if (entry.tokens !== undefined) return Number(entry.tokens) || 0
      return (entry.input || 0) + (entry.output || 0) + (entry.cacheRead || 0) + (entry.cacheWrite || 0)
    }

    /**
     * The roll-up store: the route's answer, the list's answer, and the polling
     * that fills the first one in.
     *
     * @param ctx - client context.
     * @returns accessors, the loads, and a stop that ends polling and listeners.
     */
    function createHomeUsage(ctx) {
      /** What the panel draws: the last answer, whether more is coming, and why not. */
      var usage = { value: null, computing: false, error: null, loading: false, polls: 0 }
      var listSummary = null
      var listLoading = false
      var listeners = []
      var pollTimer = null
      var disposed = false

      function emit() {
        var current = listeners.slice()
        for (var i = 0; i < current.length; i++) {
          try {
            current[i]()
          } catch (error) { /* one bad listener must not stop the rest */ }
        }
      }

      function subscribe(listener) {
        listeners.push(listener)
        return function () {
          var index = listeners.indexOf(listener)
          if (index !== -1) listeners.splice(index, 1)
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
            if (usage.polls >= HOME_POLL_MAX) return
            usage.polls += 1
            stopPolling()
            pollTimer = setTimeout(function () {
              pollTimer = null
              loadUsage(true)
            }, HOME_POLL_MS)
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
       * list's fallback, since the roll-up route reports models only from the
       * half that folds them.
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
            var day = homeDayKey(new Date(at))
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

      return {
        state: function () { return usage },
        list: function () { return listSummary },
        listLoading: function () { return listLoading },
        subscribe: subscribe,
        /** Ask every view to re-render; a state change outside the store uses it. */
        notify: emit,
        load: loadUsage,
        loadList: loadSessionSummary,
        stop: function () {
          disposed = true
          stopPolling()
          listeners.length = 0
        },
      }
    }

    /**
     * The heat grid: one cell per day, weeks as columns, Sunday first, running
     * back HOME_HEAT_WEEKS weeks from today. Days the roll-up does not cover are
     * cells with no heat, which is exactly what an empty cell means.
     */
    function homeHeatGrid(days) {
      var byDate = {}
      var list = days === null || days === undefined ? [] : days
      for (var i = 0; i < list.length; i++) byDate[list[i].date] = homeDayTokens(list[i])
      var today = new Date()
      today.setHours(0, 0, 0, 0)
      var start = new Date(today)
      start.setDate(start.getDate() - (HOME_HEAT_WEEKS * 7 - 1))
      start.setDate(start.getDate() - start.getDay())
      var cells = []
      var peak = 0
      for (var cursor = new Date(start); cursor <= today; cursor.setDate(cursor.getDate() + 1)) {
        var key = homeDayKey(cursor)
        var tokens = byDate[key] || 0
        if (tokens > peak) peak = tokens
        cells.push({ date: key, tokens: tokens, level: 0 })
      }
      for (var c = 0; c < cells.length; c++) {
        if (cells[c].tokens === 0 || peak === 0) continue
        cells[c].level = Math.max(1, Math.min(HOME_HEAT_STEPS, Math.ceil(cells[c].tokens / peak * HOME_HEAT_STEPS)))
      }
      return { cells: cells, peak: peak }
    }

    /**
     * The ranked model list, from whichever source can answer.
     *
     * The host half's fold attributes every usage sample it can to its route, so
     * its answer carries each model's four buckets; the session list carries one
     * total per model and no split. Both are sorted by tokens.
     */
    function homeModelList(value, listed) {
      if (value !== null && Array.isArray(value.models) && value.models.length > 0) {
        return value.models.map(function (entry) {
          return {
            id: entry.id,
            input: entry.input || 0,
            output: entry.output || 0,
            cacheRead: entry.cacheRead || 0,
            cacheWrite: entry.cacheWrite || 0,
            tokens: homeModelTokens(entry),
            sessions: entry.sessions,
            lastAt: entry.lastAt,
          }
        })
      }
      if (listed === null) return null
      return listed.models.map(function (entry) {
        return { id: entry.id, tokens: entry.tokens, sessions: entry.sessions, lastAt: entry.lastAt }
      })
    }

    /**
     * The models chart's columns: the last HOME_CHART_DAYS days of the roll-up's
     * own per-day per-model totals, in calendar order.
     *
     * The fold attributes a sample only when the event names its route, so a day
     * whose samples are all unattributed carries no models and draws no stack —
     * its share of the day simply stays out of the chart.
     */
    function homeModelDays(value, windowDays) {
      if (value === null || !Array.isArray(value.days)) return null
      var span = windowDays > 0 && windowDays < HOME_CHART_DAYS ? windowDays : HOME_CHART_DAYS
      var start = homeRangeStart(span)
      var columns = []
      for (var i = 0; i < value.days.length; i++) {
        var day = value.days[i]
        if (day.date < start || day.models === undefined || day.models === null) continue
        columns.push({ date: day.date, models: day.models })
      }
      if (columns.length === 0) return null
      columns.sort(function (left, right) { return left.date < right.date ? -1 : 1 })
      return columns
    }

    /**
     * Every figure the panel draws, from the two sources and the picked range.
     *
     * @param state - the roll-up store's snapshot.
     * @param listed - the session list's roll-up, or null.
     * @param range - the picked range id ('all' / '30d' / '7d').
     * @returns the figures both views read.
     */
    function homePanelData(state, listed, range) {
      var value = state.value
      var ready = value !== null && value.totals !== undefined
      var totals = ready ? value.totals : null
      var known = ready || listed !== null
      var windowDays = 0
      for (var r = 0; r < HOME_RANGES.length; r++) {
        if (HOME_RANGES[r].id === range) windowDays = HOME_RANGES[r].days
      }
      var start = homeRangeStart(windowDays)
      var startMs = start === null ? null : new Date(start + 'T00:00:00').getTime()
      var inRange = function (date) { return start === null || date >= start }
      var tokens = 0
      var calls = null
      var sessions = null
      var activeDays = null
      if (ready && start === null) {
        // All time reads the fold's own totals; its session count is already the
        // distinct union over every day.
        tokens = homeDayTokens(totals)
        calls = totals.calls
        sessions = totals.sessions
        activeDays = totals.activeDays
      } else if (ready) {
        // A window sums the per-day buckets. Sessions union the per-day id lists
        // when the host half carries them on every day; an older host half has
        // none, and the per-day counts then sum to an upper bound rather than
        // reading zero.
        var ids = {}
        var everyDayHasIds = true
        var daySessions = 0
        calls = 0
        sessions = 0
        activeDays = 0
        for (var d = 0; d < value.days.length; d++) {
          var day = value.days[d]
          if (!inRange(day.date)) continue
          tokens += homeDayTokens(day)
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
      var allTokens = ready ? homeDayTokens(totals) : (listed === null ? 0 : listed.tokens)
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
        if (hourSum > 0) peakHour = formatHomeHour(bestHour)
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
      var fun = allTokens >= HOME_HOBBIT_TOKENS
        ? copyLabel('homeFunHobbit', "You've used ~{count}× more tokens than The Hobbit.", { count: formatHomeCount(Math.round(allTokens / HOME_HOBBIT_TOKENS)) })
        : null
      var models = homeModelList(value, listed)
      return {
        ready: ready,
        value: value,
        listed: listed,
        known: known,
        windowDays: windowDays,
        start: start,
        startMs: startMs,
        inRange: inRange,
        tokens: tokens,
        calls: calls,
        sessions: sessions,
        activeDays: activeDays,
        peakHour: peakHour,
        model: model,
        allTokens: allTokens,
        grid: homeHeatGrid(ready ? value.days : (listed === null ? null : listed.days)),
        fun: fun,
        models: models,
        modelDays: homeModelDays(value, windowDays),
      }
    }
