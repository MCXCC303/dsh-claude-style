    /**
     * The reasoning-effort slider that sits at the foot of the model picker's
     * first level.
     *
     * The catalog describes a model's reasoning as a discrete ladder
     * (`reasoning.efforts` plus the level in force), and this control draws that
     * ladder as a track: the label carries the level's name, `Faster` / `Smarter`
     * name the direction of travel, and the knob follows the pointer
     * CONTINUOUSLY rather than hopping stop to stop. The value settles only when
     * the gesture ends — release, or the pointer leaving the control — and it
     * settles on the NEAREST level, so dragging never reads as a hard switch
     * between fixed positions.
     *
     * The face of the control follows Claude Desktop's effort slider: a filled
     * portion grows from the left end to the knob, one tick dot marks every
     * stop the ladder offers, and the TOP rung is special — reaching it swaps
     * the plain fill for a dot-matrix that twinkles in Claude's Ultracode
     * violet (the grid is solved in whole device pixels, the phases scattered
     * by hash, the entrance swept in from the right, in the manner of the
     * community skin-switcher plugin), tints the knob, and colours the level's
     * name. The violet is the one deliberate exception to the skin's single
     * clay accent, at the user's request.
     *
     * A model that offers no levels still gets the slider, because the picker
     * always wears the same shape at its foot: the knob travels the same way and
     * eases back to its resting end, but there is nothing to snap to and nothing
     * to select.
     *
     * The element is built once and reused across the picker's re-renders: a
     * rebuild mid-gesture would detach it and drop the pointer capture, so the
     * picker skips its render pass while a drag is in flight (see
     * src/overrides/model-picker.js).
     *
     * @param opts - `{ read, onPick, onDragStart }`. `read()` returns the model
     *   picker's `modelEffort()` result for the current seat (or null), and
     *   `onPick(levelId)` commits one level — `undefined` is the model's own
     *   default level.
     * @returns `{ el, update, isDragging }`.
     */
    function createEffortControl(opts) {
      var root = modelEl('div', 'dsh-claude-effort')
      var head = modelEl('div', 'dsh-claude-effort-head')
      var labelEl = modelEl('span', 'dsh-claude-effort-label')
      var valueEl = modelEl('span', 'dsh-claude-effort-value')
      var ends = modelEl('div', 'dsh-claude-effort-ends')
      var fasterEl = modelEl('span', 'dsh-claude-effort-end')
      var smarterEl = modelEl('span', 'dsh-claude-effort-end')
      var track = modelEl('div', 'dsh-claude-effort-track')
      var fill = modelEl('div', 'dsh-claude-effort-fill')
      var ticks = modelEl('div', 'dsh-claude-effort-ticks')
      var matrix = modelEl('div', 'dsh-claude-effort-matrix')
      var knob = modelEl('div', 'dsh-claude-effort-knob')

      head.appendChild(labelEl)
      head.appendChild(valueEl)
      ends.appendChild(fasterEl)
      ends.appendChild(smarterEl)
      /* Paint order is DOM order: the fill under the ticks, the matrix over
         both, and the opaque knob on top — it covers whatever it rides over. */
      track.appendChild(fill)
      track.appendChild(ticks)
      track.appendChild(matrix)
      track.appendChild(knob)
      root.appendChild(head)
      root.appendChild(ends)
      root.appendChild(track)
      track.setAttribute('role', 'slider')
      track.setAttribute('tabindex', '0')

      /** The ladder in force, the level it is on, and the words around it. */
      var steps = []
      var selected = -1
      var live = -1
      var dragging = false
      var painted = false
      var pointerId = null
      /** The dash shown when there is no level to name; cached, not re-read per move. */
      var noneLabel = ''
      /** Whether the top-rung treatment (the matrix) is on. */
      var apexOn = false
      /**
       * The grid the matrix is built for, '`widthDev@dpr`'; '' while unbuilt.
       * The picker's width is fixed, so a built grid is reused for the whole
       * mount; a device-pixel-ratio change (window dragged across monitors)
       * changes the signature and forces one rebuild on the next apex entry.
       */
      var matrixSig = ''
      /** The track width the ticks were laid out for, so a late layout re-does them. */
      var ticksWidth = -1
      /**
       * The level just committed, and whether the host has echoed it back yet.
       * The host's catalog snapshot TRAILS the commit — its selection RPC is
       * slow (seconds, on some providers) — so between the release and the echo
       * the snapshot still names the OLD level. Following it there would drag
       * the knob back to where the gesture started, then forward again once the
       * echo lands: the "bounce" on release. While this flag is set, update()
       * keeps the knob on the committed level; the echo (or the safety timeout,
       * for a commit that never lands) ends the wait.
       */
      var pendingEcho = false
      var pendingId = void 0
      var pendingTimer = 0
      /** Longest a commit waits for its echo before the host is trusted again.
          Host selections have been measured at up to ~8s on slow providers. */
      var PENDING_ECHO_MS = 12000

      /**
       * The ladder as ordered steps, the step in force, and the words. A model
       * with no reasoning (or one whose catalog entry has not loaded) resolves to
       * an empty ladder: the slider is still shown, it just has nothing to
       * select. The catalog may leave out a default level (`defaultEffort` is
       * undefined) — that "Default" is a real position on the track, so it leads
       * the steps with an undefined id.
       */
      function state() {
        var effort = opts.read()
        var list = []
        var index = -1
        if (effort !== null) {
          if (effort.reasoning.defaultEffort === void 0) list.push({ id: void 0, name: MODEL_EFFORT_DEFAULT })
          for (var i = 0; i < effort.reasoning.efforts.length; i++) {
            list.push({ id: effort.reasoning.efforts[i].id, name: effort.reasoning.efforts[i].name })
          }
          index = 0
          for (var s = 0; s < list.length; s++) {
            if (list[s].id === effort.effective) { index = s; break }
          }
        }
        return {
          steps: list,
          index: index,
          labels: {
            label: copyLabel('effortLabel', MODEL_EFFORT_LABEL),
            faster: copyLabel('effortFaster', MODEL_EFFORT_FASTER),
            smarter: copyLabel('effortSmarter', MODEL_EFFORT_SMARTER),
            none: MODEL_EFFORT_NONE,
          },
        }
      }

      /** How wide the knob is, and how far its centre may travel. */
      function geometry() {
        var size = knob.offsetWidth || 16
        return { size: size, span: Math.max(0, track.clientWidth - size) }
      }

      /** The knob's x for one level. No levels (or a single one) rest at the end. */
      function positionFor(index) {
        var box = geometry()
        if (index < 0 || steps.length < 2) return box.span
        return (index / (steps.length - 1)) * box.span
      }

      /**
       * Move the knob. While the gesture runs this is ONE compositor write:
       * the stylesheet already forces `transition: none` for `data-dragging`,
       * so an inline transition dance (and the forced reflow it needs to take
       * effect) would be pure overhead on every pointermove. The inline dance
       * survives only for the rare non-drag instant move (a ladder swap on
       * first paint), where the stylesheet's transition would otherwise
       * animate the jump.
       */
      var lastTransform = ''
      var lastWidth = ''

      function place(x, animate) {
        var px = Math.round(x)
        var value = 'translateX(' + px + 'px)'
        /* The fill runs from the track's left end to the knob's centre (+8 is
           half the 16px knob from the stylesheet) and disappears under the
           opaque knob, so its right end is never seen. An empty ladder selects
           nothing, and nothing stays unfilled. */
        var width = steps.length === 0 ? '0px' : (px + 8) + 'px'
        /* Same-value guard: update() runs on every scheduler pass, and re-writing
           an unchanged position would run the transition dance's forced reflow
           for nothing — worse, mid-glide it cancels the transition and snaps the
           knob to its end. Only a real change touches the DOM. */
        if (value === lastTransform && width === lastWidth) return
        lastTransform = value
        lastWidth = width
        if (animate || dragging) {
          knob.style.transform = value
          fill.style.width = width
          return
        }
        knob.style.transition = 'none'
        fill.style.transition = 'none'
        knob.style.transform = value
        fill.style.width = width
        void knob.offsetWidth
        knob.style.transition = ''
        fill.style.transition = ''
      }

      /** Where the pointer sits along the track, in knob-travel units. */
      function pointerTravel(clientX) {
        var box = geometry()
        var raw = clientX - track.getBoundingClientRect().left - box.size / 2
        return Math.max(0, Math.min(box.span, raw))
      }

      /** The level nearest a travel position: the one a release settles on. */
      function nearest(x) {
        if (steps.length === 0) return -1
        if (steps.length === 1) return 0
        var box = geometry()
        var ratio = box.span === 0 ? 0 : x / box.span
        return Math.max(0, Math.min(steps.length - 1, Math.round(ratio * (steps.length - 1))))
      }

      /* ---------- The top rung's dot matrix ---------- */

      /**
       * Scatter one cell's phase. A linear rule such as `(7r + 13c) % 29` maps
       * neighbours onto a regular lattice, which the eye reads as diagonal
       * bands; avalanching both coordinates first scatters them instead. The
       * result is continuous rather than quantised into buckets, so no two
       * cells are forced to flip in the very same instant every round.
       */
      function cellUnit(r, c, seed) {
        var h = Math.imul(r + 1, 0x9e3779b1) ^ Math.imul(c + 1, 0x85ebca6b) ^ Math.imul(seed + 1, 0x27d4eb2f)
        h = Math.imul(h ^ (h >>> 15), 0x2545f491)
        h ^= h >>> 13
        return (h >>> 0) / 4294967296
      }

      /**
       * The matrix's left-to-right mask: the right end is solid, the left end
       * dissolves back into the bare track, so the grid reads as a gradient
       * rather than a wall of blocks.
       */
      function cellFade(fx) {
        if (fx <= 0.05) return 0
        if (fx >= 0.75) return 1
        var t = (fx - 0.05) / 0.7
        return t * t * (3 - 2 * t)
      }

      /**
       * Solve the grid in whole device pixels. Rounding here — instead of
       * handing the browser a fractional remainder — is what keeps the matrix
       * uniform: a fractional pitch rasterizes as alternating gaps, and a
       * centred fractional remainder leaves one edge with a different gap. The
       * vertical rest goes back into the top/bottom padding, so the blocks
       * stay square and centred inside the groove whatever the device ratio.
       */
      function solveMatrix(wDev, dpr) {
        /* Five rows of ~4px blocks on the 26px groove: chunky enough for the
           grid to read as PIXELS (Claude's own matrix is similarly coarse);
           six rows solved to 3px blocks and blurred into a texture. */
        var ROWS = 5
        var gap = Math.max(1, Math.round(1 * dpr))
        var margin = Math.max(1, Math.round(0.5 * dpr))
        var hDev = Math.round(26 * dpr)
        var block = Math.max(3, Math.floor((hDev - 2 * margin - (ROWS - 1) * gap) / ROWS))
        var cols = Math.max(1, Math.floor((wDev + gap) / (block + gap)))
        var restX = wDev - (cols * block + (cols - 1) * gap)
        var restY = hDev - (ROWS * block + (ROWS - 1) * gap)
        return {
          cols: cols,
          rows: ROWS,
          sq: block / dpr,
          gap: gap / dpr,
          padTop: Math.floor(restY / 2) / dpr,
          padBottom: (restY - Math.floor(restY / 2)) / dpr,
          padLeft: Math.floor(restX / 2) / dpr,
          padRight: (restX - Math.floor(restX / 2)) / dpr,
        }
      }

      /**
       * (Re)build the matrix for the track's current device-pixel size. Returns
       * false when the track has no layout yet (the picker is still hidden);
       * the caller then keeps the apex treatment off, and the next paintValue
       * retries — the attribute never marks a grid that is not there.
       */
      function ensureMatrix() {
        var w = track.clientWidth
        if (!w) return false
        var dpr = window.devicePixelRatio > 0 ? window.devicePixelRatio : 1
        var sig = Math.round(w * dpr) + '@' + dpr
        if (sig === matrixSig) return true
        var lay = solveMatrix(Math.round(w * dpr), dpr)
        while (matrix.firstChild) matrix.removeChild(matrix.firstChild)
        matrix.style.gap = lay.gap + 'px'
        matrix.style.padding = lay.padTop + 'px ' + lay.padRight + 'px ' + lay.padBottom + 'px ' + lay.padLeft + 'px'
        matrix.style.gridTemplateColumns = 'repeat(' + lay.cols + ', ' + lay.sq + 'px)'
        matrix.style.gridAutoRows = lay.sq + 'px'
        for (var r = 0; r < lay.rows; r++) {
          for (var c = 0; c < lay.cols; c++) {
            var fx = lay.cols > 1 ? c / (lay.cols - 1) : 1
            var cell = modelEl('div', 'dsh-claude-effort-matrix-cell')
            /* The entrance sweeps in from the right — the end the knob reached
               for — with a whisper of row scatter so it does not read as a wipe. */
            /* !important inline: the stylesheet's animation shorthand is
               !important (which resets delay/duration to 0s/1.45s), so a plain
               inline assignment would silently lose. */
            cell.style.setProperty('animation-delay', (((1 - fx) * 0.45) + cellUnit(r, c, 4) * 0.08).toFixed(3) + 's', 'important')
            var sq = modelEl('div', 'dsh-claude-effort-matrix-sq')
            /* The mask fade is a STATIC opacity; the flash animates colour
               through it (see the stylesheet for why it is not an opacity dip). */
            sq.style.opacity = cellFade(fx).toFixed(3)
            /* Only a tone BUCKET is picked here — the colours themselves live in
               the stylesheet, so nothing can go stale in the DOM. */
            sq.setAttribute('data-tone', String(Math.floor(cellUnit(r, c, 1) * 4) % 4))
            sq.style.setProperty('animation-delay', (cellUnit(r, c, 2) * 1.38 + 0.3).toFixed(3) + 's', 'important')
            sq.style.setProperty('animation-duration', (1.45 * (0.92 + cellUnit(r, c, 3) * 0.16)).toFixed(3) + 's', 'important')
            cell.appendChild(sq)
            matrix.appendChild(cell)
          }
        }
        matrixSig = sig
        return true
      }

      /**
       * The top rung is the slider's showpiece: reaching it (a settled level or
       * a drag's live position alike) swaps the plain fill for the matrix,
       * tints the knob and colours the level's name. Everything hangs off
       * `data-apex`; the guard keeps the attribute writes — which the
       * scheduler's observer sees — to actual transitions.
       */
      function paintApex(at) {
        var want = steps.length > 1 && at === steps.length - 1
        if (want === apexOn) return
        if (want && !ensureMatrix()) return
        apexOn = want
        if (want) root.setAttribute('data-apex', '')
        else root.removeAttribute('data-apex')
      }

      /**
       * One tick dot per stop, centred on the stop's resting position. Rebuilt
       * when the ladder changes or the track's width moved out from under the
       * last layout (first paint can run before the picker has its width).
       * The dots carry no state: the fill they share a colour with swallows
       * the passed ones, and the opaque knob swallows the current one.
       */
      function paintTicks() {
        var w = track.clientWidth
        if (!w || w === ticksWidth) return
        ticksWidth = w
        while (ticks.firstChild) ticks.removeChild(ticks.firstChild)
        var box = geometry()
        for (var i = 0; i < steps.length; i++) {
          var dot = modelEl('span', 'dsh-claude-effort-tick')
          dot.style.left = Math.round(positionFor(i) + box.size / 2) + 'px'
          ticks.appendChild(dot)
        }
      }

      /**
       * The level's name while the gesture runs, the committed one otherwise.
       * Same-value guard: the write runs per frame while dragging, and an
       * identical textContent assignment still replaces the text node — the
       * resulting mutation would feed the scheduler's observer and keep a full
       * pass running every frame. A real change re-arms the name's blur-in.
       */
      function paintValue() {
        var at = dragging ? live : selected
        var text = at >= 0 && steps[at] ? steps[at].name : noneLabel
        if (valueEl.textContent !== text) {
          valueEl.textContent = text
          /* Re-arm the name's blur-in — but not mid-gesture, where a blur per
             stop crossing reads as smear; a dragged change simply stays crisp.
             The stylesheet's animation carries !important, so the reset must
             be an !important inline too — a plain inline 'none' loses the
             cascade and the restart is a no-op. */
          if (!dragging) {
            valueEl.style.setProperty('animation', 'none', 'important')
            void valueEl.offsetWidth
            valueEl.style.removeProperty('animation')
          }
        }
        paintApex(at)
      }

      function paintAria(labels) {
        noneLabel = labels.none
        // Same-value guards throughout: update() runs on every scheduler pass,
        // and an identical write here (in particular the aria-label, which is
        // in the observer's attributeFilter) re-schedules the next pass — a
        // self-sustaining one-pass-per-frame loop.
        if (labelEl.textContent !== labels.label) labelEl.textContent = labels.label
        if (fasterEl.textContent !== labels.faster) fasterEl.textContent = labels.faster
        if (smarterEl.textContent !== labels.smarter) smarterEl.textContent = labels.smarter
        if (track.getAttribute('aria-label') !== labels.label) track.setAttribute('aria-label', labels.label)
        if (steps.length === 0) {
          root.setAttribute('data-empty', '')
          track.setAttribute('aria-disabled', 'true')
          track.removeAttribute('aria-valuemin')
          track.removeAttribute('aria-valuemax')
          track.removeAttribute('aria-valuenow')
          track.removeAttribute('aria-valuetext')
          return
        }
        var at = Math.max(0, selected)
        root.removeAttribute('data-empty')
        track.removeAttribute('aria-disabled')
        track.setAttribute('aria-valuemin', '0')
        track.setAttribute('aria-valuemax', String(steps.length - 1))
        track.setAttribute('aria-valuenow', String(at))
        track.setAttribute('aria-valuetext', steps[at] ? steps[at].name : '')
      }

      /** Drop the wait for the host's echo (echo seen, ladder changed, or timeout). */
      function clearPending() {
        if (pendingTimer !== 0) {
          clearTimeout(pendingTimer)
          pendingTimer = 0
        }
        pendingEcho = false
        pendingId = void 0
      }

      /** Commit one level, once: the host is told only when the level moved. */
      function commit(index) {
        if (index < 0 || index >= steps.length || index === selected) return
        selected = index
        /* Hold the knob here until the host's snapshot agrees (see pendingEcho). */
        pendingEcho = true
        pendingId = steps[index].id
        if (pendingTimer !== 0) clearTimeout(pendingTimer)
        pendingTimer = setTimeout(clearPending, PENDING_ECHO_MS)
        opts.onPick(steps[index].id)
      }

      function releaseCapture() {
        try {
          if (pointerId !== null && track.hasPointerCapture && track.hasPointerCapture(pointerId)) {
            track.releasePointerCapture(pointerId)
          }
        } catch (error) { /* the capture may already be gone */ }
        pointerId = null
      }

      /** The gesture ends: the knob lands on the nearest level and commits it. */
      function settle() {
        if (!dragging) return
        if (moveQueued) {
          // Land the still-pending position first, so the release settles on
          // where the pointer actually is rather than one event behind.
          cancelAnimationFrame(pendingFrame)
          moveQueued = false
          pendingFrame = 0
          applyPending()
          if (!dragging) return
        }
        dragging = false
        root.removeAttribute('data-dragging')
        releaseCapture()
        var index = live
        live = -1
        /* Commit FIRST, then paint ONCE on the committed level. Painting before
           the commit read the OLD `selected`: the name went back to the level
           the gesture started from (replaying its blur-in), and the apex
           attribute flipped off and on, which hid the matrix and restarted its
           entrance sweep — a visible double take on every release. */
        commit(index)
        place(positionFor(selected), true)
        paintValue()
      }

      function onPointerDown(e) {
        if (e.button !== 0) return
        e.preventDefault()
        e.stopPropagation()
        dragging = true
        painted = true
        root.setAttribute('data-dragging', '')
        pointerId = e.pointerId
        try { track.setPointerCapture(e.pointerId) } catch (error) { /* capture is a nicety */ }
        if (typeof opts.onDragStart === 'function') opts.onDragStart()
        var x = pointerTravel(e.clientX)
        place(x, false)
        live = nearest(x)
        paintValue()
      }

      /**
       * The gesture's latest pointer position. pointermove fires faster than
       * frames render; the event stores the position and ONE animation-frame
       * callback applies it — reads first (boundary box, travel geometry),
       * writes after (one transform + the level name) — so the drag costs one
       * layout flush per frame instead of one forced reflow per event.
       */
      var pendingFrame = 0
      var moveQueued = false
      var pendingX = 0
      var pendingY = 0

      function applyPending() {
        if (!dragging) return
        var box = root.getBoundingClientRect()
        // Leaving the control ends the gesture where it stands — the knob
        // settles on the nearest level instead of trailing the pointer away.
        if (pendingX < box.left - 6 || pendingX > box.right + 6 || pendingY < box.top - 6 || pendingY > box.bottom + 6) {
          settle()
          return
        }
        var x = pointerTravel(pendingX)
        place(x, false)
        live = nearest(x)
        paintValue()
      }

      function onPointerMove(e) {
        if (!dragging) return
        pendingX = e.clientX
        pendingY = e.clientY
        if (moveQueued) return
        moveQueued = true
        pendingFrame = requestAnimationFrame(function () {
          moveQueued = false
          pendingFrame = 0
          applyPending()
        })
      }

      track.addEventListener('pointerdown', onPointerDown)
      track.addEventListener('pointermove', onPointerMove)
      track.addEventListener('pointerup', function () { settle() })
      track.addEventListener('pointercancel', function () { settle() })
      track.addEventListener('keydown', function (e) {
        if (steps.length === 0) return
        var base = selected < 0 ? 0 : selected
        var next = base
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = Math.max(0, base - 1)
        else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = Math.min(steps.length - 1, base + 1)
        else if (e.key === 'Home') next = 0
        else if (e.key === 'End') next = steps.length - 1
        else return
        e.preventDefault()
        e.stopPropagation()
        commit(next)
        place(positionFor(next), true)
        paintAria(state().labels)
        paintValue()
      })

      /**
       * Re-point the control at the model in force. The ladder is rebuilt only
       * when the levels themselves change; the knob is only animated when the
       * selected level moved on its own (the host echoing a selection back).
       */
      function update() {
        var next = state()
        var changed = next.steps.length !== steps.length
        if (!changed) {
          for (var i = 0; i < next.steps.length; i++) {
            if (next.steps[i].id !== steps[i].id) { changed = true; break }
          }
        }
        if (changed) {
          steps = next.steps.slice()
          ticksWidth = -1
          /* A different ladder is a different question; the old commit's echo
             will never come. */
          clearPending()
        }
        /* The echo test: the snapshot now names the level we committed. */
        if (pendingEcho && next.index >= 0 && next.steps[next.index] !== void 0 && next.steps[next.index].id === pendingId) {
          clearPending()
        }
        if (!dragging && !pendingEcho) {
          var moved = painted && !changed && selected !== next.index
          selected = next.index
          place(positionFor(selected), moved)
          painted = true
        }
        paintTicks()
        paintAria(next.labels)
        paintValue()
      }

      return {
        el: root,
        update: update,
        isDragging: function () { return dragging },
      }
    }
