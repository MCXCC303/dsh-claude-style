    /**
     * The hero row's two pickers — the workspace (directory) chip and the
     * agent-preset seat — both open the host's shared menu primitive, which
     * portals its card to <body>. That card carries no marker of its own, so a
     * stylesheet cannot tell it apart from the host's other menus (sidebar row
     * menus, the settings permission row, submenus) — and it has to: this skin
     * redraws these two and leaves the rest alone.
     *
     * So the browser half stamps the open card rather than guessing in CSS.
     * While either trigger reports `aria-expanded="true"`, the one host menu
     * sitting in <body> is that card; HERO_MENU_ATTR is what
     * components/hero-menu.css switches on.
     *
     * The scheduler's attributeFilter does not watch `aria-expanded`, but the
     * card is inserted into <body> as it opens — a childList mutation the pass
     * already observes — so the stamp lands on the frame the menu appears. Two
     * candidates mean an unrelated menu is open as well: the pass then leaves
     * every card alone rather than stamping the wrong one.
     *
     * The host drops that card below its trigger, which is exactly where the
     * composer sits: it would land on the input area and on the controls in it.
     * This row is *above* the composer, so the card belongs beside the trigger
     * instead — bottom-aligned with it and growing upward into the empty hero
     * space. The host re-places the card from its own geometry on every frame
     * while the card is open, and an inline `left` / `top` written here would
     * live only until the host's next frame. The position therefore travels in
     * two custom properties, which the host's style writes never touch, and
     * components/hero-menu.css reads them with `!important`: an author
     * `!important` declaration outranks the host's plain inline value, so the
     * card holds this position from the pass that stamps it onward. The
     * scheduler's scroll/resize hook re-applies it when the anchor moves.
     *
     * Hover is the host's own click handler driven from here: the "Open popovers
     * on hover" preference's `all` scope covers these two, and the host offers no
     * hover of its own. The listeners are delegated from the document because
     * React replaces the triggers, and the close waits out the gap between the
     * trigger and the card so crossing it does not shut the menu.
     */
    function installHeroMenu(ctx, ui) {
      /** Air between the trigger and the card, and the viewport's own margin. */
      var GAP = 6
      var MARGIN = 12
      /** Long enough to cross the gap above, short enough to still read as hover. */
      var CLOSE_DELAY = POPOVER_CLOSE_DELAY
      /** The two triggers, and the card once it is stamped. */
      var TRIGGER_SELECTOR = '[class*="heroWorkspaceRow"] [aria-haspopup="menu"]'
      var CARD_SELECTOR = '[' + HERO_MENU_ATTR + ']'
      var stamped = null
      var stampedTrigger = null
      var closeTimer = null
      var openTimer = null
      var openedByHover = false

      function cancelHoverClose() {
        if (closeTimer === null) return
        clearTimeout(closeTimer)
        closeTimer = null
      }

      function cancelHoverOpen() {
        if (openTimer === null) return
        clearTimeout(openTimer)
        openTimer = null
      }

      /**
       * Open what hover asked for, once the pointer has stayed the dwell out.
       * The host's menu has no hover of its own — this clicks its trigger — so
       * the dwell is what keeps a pointer merely crossing the hero row from
       * unfolding the card.
       */
      function openFromHover(trigger) {
        openTimer = null
        if (!hoverEnabled()) return
        if (trigger.getAttribute('aria-expanded') === 'true') return
        trigger.click()
        openedByHover = true
      }

      function scheduleHoverOpen(trigger) {
        cancelHoverOpen()
        openTimer = setTimeout(function () { openFromHover(trigger) }, POPOVER_OPEN_DELAY)
      }

      /** Close what hover opened; a click-opened menu is left alone. */
      function closeFromHover() {
        closeTimer = null
        if (!openedByHover) return
        var trigger = openTrigger()
        if (trigger !== null) trigger.click()
        openedByHover = false
      }

      function scheduleHoverClose() {
        cancelHoverClose()
        closeTimer = setTimeout(closeFromHover, CLOSE_DELAY)
      }

      /** The `all` scope only, and only while the composer restyle is in play. */
      function hoverEnabled() {
        return readPrefs().autoPopover === AUTO_POPOVER_ALL &&
               ui.composer !== undefined && ui.composer.isActive()
      }

      function closestWithin(target, selector) {
        if (target === null || target === undefined || typeof target.closest !== 'function') return null
        return target.closest(selector)
      }

      function onHeroPointerOver(e) {
        if (!hoverEnabled()) return
        var target = e.target
        if (closestWithin(target, CARD_SELECTOR) !== null) {
          cancelHoverClose()
          return
        }
        var trigger = closestWithin(target, TRIGGER_SELECTOR)
        if (trigger === null) return
        cancelHoverClose()
        if (trigger.getAttribute('aria-expanded') !== 'true') scheduleHoverOpen(trigger)
      }

      function onHeroPointerOut(e) {
        if (!hoverEnabled()) return
        var target = e.target
        if (closestWithin(target, CARD_SELECTOR) === null && closestWithin(target, TRIGGER_SELECTOR) === null) return
        // Moving onto the other half — the card, or the trigger — is not a leave.
        var next = e.relatedTarget
        if (closestWithin(next, CARD_SELECTOR) !== null || closestWithin(next, TRIGGER_SELECTOR) !== null) return
        cancelHoverOpen()
        scheduleHoverClose()
      }

      document.addEventListener('mouseover', onHeroPointerOver, true)
      document.addEventListener('mouseout', onHeroPointerOut, true)

      function clearStamp() {
        if (stamped === null) return
        stamped.removeAttribute(HERO_MENU_ATTR)
        stamped = null
        stampedTrigger = null
      }

      /** The trigger whose picker is open, or null. */
      function openTrigger() {
        return document.querySelector('[class*="heroWorkspaceRow"] [aria-haspopup="menu"][aria-expanded="true"]') ||
               document.querySelector('[class*="cardWorkspaceTrigger"] [aria-expanded="true"]')
      }

      /**
       * Park the card beside its trigger: to its right, bottom-aligned so it
       * grows upward, flipped to the left when the viewport is tight, and clamped
       * to the viewport either way. A card that has not been laid out yet is left
       * for the next pass rather than pinned to a zero-sized guess.
       */
      function placeCard(trigger, card) {
        var rect = trigger.getBoundingClientRect()
        var width = card.offsetWidth
        var height = card.offsetHeight
        if (width === 0 || height === 0) return
        var left = rect.right + GAP
        if (left + width > window.innerWidth - MARGIN) left = rect.left - GAP - width
        left = Math.max(MARGIN, Math.min(left, window.innerWidth - width - MARGIN))
        var top = rect.bottom - height
        top = Math.max(MARGIN, Math.min(top, window.innerHeight - height - MARGIN))
        card.style.setProperty('--dsh-claude-hero-menu-x', Math.round(left) + 'px')
        card.style.setProperty('--dsh-claude-hero-menu-y', Math.round(top) + 'px')
      }

      /** Re-place an open card after a scroll or a resize moved its anchor. */
      function repositionHeroMenu() {
        if (stamped === null || stampedTrigger === null) return
        placeCard(stampedTrigger, stamped)
      }

      function syncHeroMenu() {
        var trigger = openTrigger()
        if (trigger === null) {
          // The menu is shut — by a click, by Escape or by an outside press — so
          // whatever hover opened it no longer owns it.
          openedByHover = false
          cancelHoverClose()
          clearStamp()
          return
        }
        // The skin's own popovers carry their own classes, so excluding them
        // leaves the host's menus only.
        var cards = document.querySelectorAll('body > [role="menu"]:not([class*="dsh-claude"])')
        if (cards.length !== 1) {
          clearStamp()
          return
        }
        if (stamped !== cards[0]) {
          clearStamp()
          stamped = cards[0]
          stampedTrigger = trigger
          stamped.setAttribute(HERO_MENU_ATTR, '')
        }
        placeCard(trigger, stamped)
      }

      ui.heroMenu = { sync: syncHeroMenu, reposition: repositionHeroMenu }
      return function () {
        cancelHoverClose()
        cancelHoverOpen()
        openedByHover = false
        clearStamp()
        document.removeEventListener('mouseover', onHeroPointerOver, true)
        document.removeEventListener('mouseout', onHeroPointerOut, true)
        delete ui.heroMenu
      }
    }