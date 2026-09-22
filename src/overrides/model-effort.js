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
      var knob = modelEl('div', 'dsh-claude-effort-knob')

      head.appendChild(labelEl)
      head.appendChild(valueEl)
      ends.appendChild(fasterEl)
      ends.appendChild(smarterEl)
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
      function place(x, animate) {
        var value = 'translateX(' + Math.round(x) + 'px)'
        if (animate || dragging) {
          knob.style.transform = value
          return
        }
        knob.style.transition = 'none'
        knob.style.transform = value
        void knob.offsetWidth
        knob.style.transition = ''
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

      /**
       * The level's name while the gesture runs, the committed one otherwise.
       * Same-value guard: the write runs per frame while dragging, and an
       * identical textContent assignment still replaces the text node — the
       * resulting mutation would feed the scheduler's observer and keep a full
       * pass running every frame.
       */
      function paintValue() {
        var at = dragging ? live : selected
        var text = at >= 0 && steps[at] ? steps[at].name : noneLabel
        if (valueEl.textContent !== text) valueEl.textContent = text
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

      /** Commit one level, once: the host is told only when the level moved. */
      function commit(index) {
        if (index < 0 || index >= steps.length || index === selected) return
        selected = index
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
        place(positionFor(index), true)
        paintValue()
        commit(index)
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
        if (changed) steps = next.steps.slice()
        if (!dragging) {
          var moved = painted && !changed && selected !== next.index
          selected = next.index
          place(positionFor(selected), moved)
          painted = true
        }
        paintAria(next.labels)
        paintValue()
      }

      return {
        el: root,
        update: update,
        isDragging: function () { return dragging },
      }
    }
