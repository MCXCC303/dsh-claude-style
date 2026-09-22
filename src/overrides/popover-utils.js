    var POPOVER_MARGIN = 8

    /**
     * Position a fixed-position popover relative to its trigger.
     *
     * `side: 'right'` opens to the trigger's right and bottom-aligns it (the
     * account popover in the rail). The default `side: 'above'` right-aligns
     * the popover with the trigger and opens above it with `gap` spacing (the
     * model picker). `important` switches to `style.setProperty(..., 'important')`
     * and rounds the coordinates, as the account popover requires.
     *
     * @param trigger - element the popover is anchored to.
     * @param pop - the fixed-position popover element.
     * @param opts - `{ side, gap, important }`.
     * @returns the chosen `{ x, y }` in viewport coordinates.
     */
    function positionAnchoredPopover(trigger, pop, opts) {
      opts = opts || {}
      var rect = trigger.getBoundingClientRect()
      var width = pop.offsetWidth
      var height = pop.offsetHeight
      var margin = opts.margin || POPOVER_MARGIN
      var x
      var y
      if (opts.side === 'right') {
        x = rect.right + margin
        if (x + width > window.innerWidth - margin) {
          x = Math.max(margin, rect.left - margin - width)
        }
        y = Math.min(Math.max(margin, rect.bottom - height), Math.max(margin, window.innerHeight - height - margin))
      } else {
        x = Math.max(margin, Math.min(rect.right - width, window.innerWidth - width - margin))
        y = rect.top - (opts.gap || 0) - height
        if (y < margin) y = Math.min(rect.bottom + (opts.gap || 0), Math.max(margin, window.innerHeight - height - margin))
      }
      // Same-value guard: this runs on every scheduler pass while a popover is
      // open, and an identical write still dirties layout — the next geometry
      // read (the drag paths read rect/offset every frame) would then force a
      // synchronous recalc. Skip the write when the anchor did not move.
      var leftValue = Math.round(x) + 'px'
      var topValue = Math.round(y) + 'px'
      if (opts.important) {
        if (pop.style.left !== leftValue) pop.style.setProperty('left', leftValue, 'important')
        if (pop.style.top !== topValue) pop.style.setProperty('top', topValue, 'important')
      } else {
        if (pop.style.left !== leftValue) pop.style.left = leftValue
        if (pop.style.top !== topValue) pop.style.top = topValue
      }
      return { x: x, y: y }
    }

    /**
     * Hover-intent helper shared by the model picker and account popover.
     *
     * The `open` callback is part of the shared signature but the original
     * hover behaviour only schedules the close side (mouseenter calls the
     * feature's open function directly); keeping the parameter makes the two
     * call sites symmetrical.
     */
    function createHoverIntent(open, close, delay) {
      var timer = null
      return {
        cancel: function () {
          if (timer) {
            clearTimeout(timer)
            timer = null
          }
        },
        scheduleClose: function () {
          if (timer) clearTimeout(timer)
          timer = setTimeout(close, delay)
        },
      }
    }
