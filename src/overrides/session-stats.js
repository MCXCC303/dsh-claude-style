    /**
     * Session-stats card: the composer's merged time/usage sentence and the
     * combined popover it opens.
     *
     * Split out of installPermissions (src/overrides/permissions.js); this
     * fragment is the stats half of that feature. It takes no options: the card
     * reads no cross-feature handle — its only external reads are module-level
     * (readPrefs, AUTO_POPOVER_ALL, POPOVER_CLOSE_DELAY). The ui.copy reads that
     * move the pills live in the menu half (mergeStatsIntoRow /
     * mergeContextMeterIntoRow) and stay in installPermissions.
     *
     * @returns { sync, close, teardown }.
     */
    function createSessionStats() {
        var statsPopover = null
        var statsHideTimer = null
        /** Identity of the stats bindings THIS generation installed (see bindStatsHover). */
        var statsBindingToken = {}
        /**
         * The stats row's host mode, stamped by syncStatsSummary. The host keeps
         * the performanceUsage preference in its React state and never puts it
         * on the DOM, so the stylesheet and the hover binding read this marker.
         */
        var STATS_MODE_ATTR = 'data-dsh-claude-stats-mode'

        /** The host's stats root, or null when this conversation has no row. */
        function statsRoot() {
          return document.querySelector('[data-composer-stats]')
        }

        /**
         * Merge the host's time and usage pills into one compact sentence and
         * write it into CSS variables. The host keeps ownership of the data and
         * the two click targets; CSS hides its icons/labels and renders the
         * combined text, so React never sees its own DOM rewritten.
         */
        function statsEscape(value) {
          return String(value === void 0 || value === null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
        }

        function statsRowsFrom(panel) {
          var rows = []
          if (panel === null) return rows
          var dts = panel.querySelectorAll('dt')
          for (var i = 0; i < dts.length; i++) {
            var dd = dts[i].nextElementSibling
            rows.push({
              label: (dts[i].textContent || '').trim(),
              value: dd === null ? '' : (dd.textContent || '').trim(),
            })
          }
          return rows
        }

        function statsPanelData(selector) {
          var panel = document.querySelector(selector)
          return {
            title: panel === null ? '' : (panel.getAttribute('aria-label') || ''),
            rows: statsRowsFrom(panel),
          }
        }

        function withStatsPanel(button, selector, done) {
          if (button === null) { done({ title: '', rows: [] }); return }
          if (button.getAttribute('aria-expanded') !== 'true') button.click()
          var attempts = 0
          function read() {
            var panel = document.querySelector(selector)
            if (panel === null && attempts < 15) {
              attempts += 1
              setTimeout(read, 20)
              return
            }
            var data = statsPanelData(selector)
            if (button.getAttribute('aria-expanded') === 'true') button.click()
            done(data)
          }
          setTimeout(read, 20)
        }

        function collectStatsData(done) {
          var root = statsRoot()
          if (root === null) { done([]); return }
          var buttons = root.querySelectorAll('button')
          var timeBtn = null
          var usageBtn = null
          for (var i = 0; i < buttons.length; i++) {
            var aria = buttons[i].getAttribute('aria-label') || ''
            if (/轮|步|turns?|steps?/i.test(aria)) timeBtn = buttons[i]
            else usageBtn = buttons[i]
          }
          withStatsPanel(timeBtn, '[role="dialog"]:has([data-session-stats-details])', function (timeData) {
            withStatsPanel(usageBtn, '[role="dialog"]:has([data-session-stats-usage])', function (usageData) {
              var sections = []
              if (timeData.rows.length > 0) sections.push(timeData)
              if (usageData.rows.length > 0) sections.push(usageData)
              done(sections)
            })
          })
        }

        function ensureStatsPopover() {
          if (statsPopover !== null) return statsPopover
          statsPopover = document.createElement('div')
          statsPopover.className = 'dsh-claude-stats-popover'
          statsPopover.setAttribute('data-open', 'false')
          statsPopover.addEventListener('mouseenter', function () {
            if (statsHideTimer) {
              clearTimeout(statsHideTimer)
              statsHideTimer = null
            }
          })
          statsPopover.addEventListener('mouseleave', scheduleHideStatsPopover)
          document.body.appendChild(statsPopover)
          return statsPopover
        }

        function hideStatsPopover() {
          if (statsPopover !== null) statsPopover.setAttribute('data-open', 'false')
        }

        /**
         * Drop stats cards left behind by a previous client generation.
         *
         * Client HMR drops the old fiber's disposals, so the teardown never runs:
         * the previous generation's card stays in <body> holding its last content
         * and `data-open="true"` — a second, frozen popover sitting beside the
         * live one (which is why the two read differently: the stale card shows
         * whatever sections it was last rendered with). The model picker and the
         * account footer sweep their own strays the same way; the stats card was
         * the one that did not.
         */
        function sweepStrayStatsPopovers() {
          var strays = document.querySelectorAll('body > .dsh-claude-stats-popover')
          for (var i = 0; i < strays.length; i++) {
            if (strays[i] !== statsPopover) strays[i].parentElement.removeChild(strays[i])
          }
        }

        function scheduleHideStatsPopover() {
          if (statsHideTimer) clearTimeout(statsHideTimer)
          statsHideTimer = setTimeout(function () {
            statsHideTimer = null
            hideStatsPopover()
          }, POPOVER_CLOSE_DELAY)
        }

        function renderStatsPopover(sections) {
          var pop = ensureStatsPopover()
          var html = '<div class="dsh-claude-stats-popover-body">'
          for (var sIndex = 0; sIndex < sections.length; sIndex++) {
            var section = sections[sIndex]
            if (section.rows.length === 0) continue
            if (section.title) html += '<div class="dsh-claude-stats-popover-section">' + statsEscape(section.title) + '</div>'
            html += '<div class="dsh-claude-stats-popover-grid">'
            for (var r = 0; r < section.rows.length; r++) {
              html += '<div class="dsh-claude-stats-popover-item">'
                + '<div class="dsh-claude-stats-popover-label">' + statsEscape(section.rows[r].label) + '</div>'
                + '<div class="dsh-claude-stats-popover-value">' + statsEscape(section.rows[r].value) + '</div>'
                + '</div>'
            }
            html += '</div>'
          }
          html += '</div>'
          pop.innerHTML = html
        }

        /** The last full read; a thinner one never replaces it while the card is up. */

        var statsSections = null

        var statsSectionsAt = 0


        function showStatsPopover(anchor) {
          // The card reads the host's two dialogs, which only the detailed row
          // renders. A compact row has no trigger and no panel, so a hover or a
          // click there must not start a read.
          var modeRoot = statsRoot() || anchor
          if (modeRoot === null || modeRoot.getAttribute(STATS_MODE_ATTR) !== 'detailed') return
          if (statsHideTimer) {
            clearTimeout(statsHideTimer)
            statsHideTimer = null
          }
          collectStatsData(function (sections) {
            if (sections.length === 0) return
            // A click re-collects, and the host's two pills can be mid-flight then: a read
            // that comes back with fewer sections than the card already shows must not
            // shrink it — that is the 'click and it drops to Token usage only' bug.
            var fresh = Date.now() - statsSectionsAt < 180000
            if (statsSections !== null && fresh && sections.length < statsSections.length) {
              sections = statsSections
            } else {
              statsSections = sections
              statsSectionsAt = Date.now()
            }
            renderStatsPopover(sections)
            var pop = ensureStatsPopover()
            pop.setAttribute('data-open', 'true')
            var live = statsRoot() || anchor
            var rect = live.getBoundingClientRect()
            var width = pop.offsetWidth
            var height = pop.offsetHeight
            var left = Math.max(8, Math.min(rect.left + rect.width / 2 - width / 2, window.innerWidth - width - 8))
            var top = Math.max(8, rect.top - height - 8)
            pop.style.left = left + 'px'
            pop.style.top = top + 'px'
          })
        }

        function bindStatsHover(root) {
          // Generation-scoped, not a plain boolean: the host owns the stats node
          // and reuses it across a client HMR reload, so a boolean left by the
          // previous generation made this one skip binding entirely — the OLD
          // closure kept serving the card (its content, its stale node) while this
          // generation's listeners never existed.
          if (root.__dshStatsHoverToken === statsBindingToken) return
          root.__dshStatsHoverToken = statsBindingToken
          var openTimer = null
          function cancelOpen() {
            if (openTimer) {
              clearTimeout(openTimer)
              openTimer = null
            }
          }
          // Hover still opens the card under "All" — the setting promises exactly
          // that — but only after a deliberate dwell: the stats sentence sits in
          // the MIDDLE of the composer row, so a pointer on its way from the
          // permission selector to the model trigger used to unfold the card on
          // the way past. A passing pointer never stays the dwell out; a pointer
          // the user actually parked there does.
          root.addEventListener('mouseenter', function () {
            cancelOpen()
            if (readPrefs().autoPopover !== AUTO_POPOVER_ALL) return
            openTimer = setTimeout(function () {
              openTimer = null
              showStatsPopover(root)
            }, 300)
          })
          root.addEventListener('mouseleave', function () {
            cancelOpen()
            // Unconditional, unlike the open side: a card opened by CLICK has to
            // close when the pointer leaves, whatever the hover switch says.
            scheduleHideStatsPopover()
          })
          // The host's own stats dialogs are hidden by the stylesheet, so a click
          // has to land somewhere: it opens this card — the only stats surface
          // left when the hover switch is off or scoped to the account rail.
          //
          // Only a REAL click counts. Collecting the card's content means clicking
          // the host's two pills to open their dialogs, and those synthetic clicks
          // bubble back up to this listener: re-entering the collection from
          // inside itself made two reads race, which is why sections went missing
          // (the card kept flipping between "会话统计 + Token 用量" and "Token 用量"
          // alone) and why the card stopped closing — every re-entry cancelled the
          // pending hide.
          root.addEventListener('click', function (event) {
            if (event && event.isTrusted === false) return
            cancelOpen()
            showStatsPopover(root)
          })
        }

        /**
         * Whether the host rendered its DETAILED statistics row.
         *
         * The host keeps the performanceUsage mode in React state and puts no
         * marker on the DOM, so the two structures have to be told apart by
         * shape. Detailed wraps each pill in an anchor span and, when a pill
         * has dialog rows, makes it a button[aria-haspopup="dialog"]; its open
         * dialogs carry the data-session-stats-* markers. Compact renders bare
         * span pills (icon + reading) directly under the root, with no trigger
         * and no panel. The wrapper check catches the detailed pill whose
         * dialog has no rows yet — a static span, not a button — so the two
         * modes never collapse onto one another.
         */
        function hostStatsDetailed(root) {
          if (root.querySelector('button[aria-haspopup="dialog"]') !== null) return true
          if (document.querySelector('[data-session-stats-details], [data-session-stats-usage]') !== null) return true
          var children = root.children
          for (var i = 0; i < children.length; i++) {
            if (children[i].querySelector('button, span') !== null) return true
          }
          return false
        }

        function syncStatsSummary() {
          var root = statsRoot()
          if (root === null) return
          var mode = hostStatsDetailed(root) ? 'detailed' : 'compact'
          if (root.getAttribute(STATS_MODE_ATTR) !== mode) root.setAttribute(STATS_MODE_ATTR, mode)
          if (mode === 'compact') {
            // The host draws its own icon readings with its own spacing, and
            // there is no trigger to open and no panel data to read: leave the
            // row alone and close any card a detailed session left up.
            hideStatsPopover()
            return
          }
          var buttons = root.querySelectorAll('button')
          var timeText = ''
          var usageText = ''
          for (var i = 0; i < buttons.length; i++) {
            var button = buttons[i]
            var aria = button.getAttribute('aria-label') || ''
            var parts = aria.split(' · ')
            var isTime = /轮|步|turns?|steps?/i.test(aria)
            if (isTime) {
              var counts = (parts[0] || '').match(/\d[\d,]*/g) || []
              var turns = counts[0] || '0'
              var steps = counts[1] || '0'
              var tps = (parts[1] || '').match(/([\d.,]+[KMB]?)\s*tok\/s/i)
              timeText = turns + '轮' + steps + '步' + (tps ? ' · ' + tps[1] + 'tok/s' : '')
            } else {
              var total = (parts[0] || '').match(/([\d.,]+[KMB]?)\s*tok/i)
              var cache = (parts[1] || '').match(/([\d.]+)\s*%/)
              usageText = (total ? total[1] + ' tok' : (parts[0] || '')) + (cache ? ' · ' + cache[1] + '% Cache' : '')
            }
          }
          if (buttons.length === 1) {
            var only = timeText || usageText
            timeText = only
            usageText = only
          }
          // content: var(...) needs a quoted <string>; an unquoted token stream
          // is invalid and computes to `none`.
          root.style.setProperty('--dsh-stats-time', JSON.stringify(timeText))
          root.style.setProperty('--dsh-stats-usage', JSON.stringify(usageText))
          bindStatsHover(root)
        }

        return {
            /** Re-sweep strays left by a previous generation, then refresh the sentence. */
            sync: function () {
                sweepStrayStatsPopovers()
                syncStatsSummary()
            },
            /** Close the card (composer focus). */
            close: hideStatsPopover,
            /** Remove the card and its hide timer. */
            teardown: function () {
                if (statsHideTimer) {
                    clearTimeout(statsHideTimer)
                    statsHideTimer = null
                }
                if (statsPopover !== null && statsPopover.parentElement !== null) statsPopover.parentElement.removeChild(statsPopover)
                statsPopover = null
                // Hand the host node back unmarked: the mode attribute is ours.
                var root = statsRoot()
                if (root !== null) root.removeAttribute(STATS_MODE_ATTR)
            }
        }
    }
