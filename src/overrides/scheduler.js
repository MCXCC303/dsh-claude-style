    // ============================================================================
    // 响应式调度与生命周期清理 (Scheduler & Teardown)
    // ============================================================================
    function installScheduler(ctx, ui) {
      function onGlobalPointerDown(e) {
        var target = e.target
        // The model picker is hover-driven; a press anywhere outside its
        // trigger and both levels closes it (same discipline as the perm menu).
        if (target && ui.model && !ui.model.owns(target)) {
          ui.model.close()
        }
        if (!ui.footer || !ui.footer.isOpen()) return
        if (target && ui.footer.owns(target)) return
        ui.footer.close()
      }

      function onGlobalKeyDown(e) {
        if (e.key === 'Escape') {
          if (ui.footer) ui.footer.close()
          if (ui.permissions) ui.permissions.closeMenu()
          if (ui.model) ui.model.close()
        }
        if ((e.ctrlKey || e.metaKey) && e.key === ',') {
          e.preventDefault()
          var realTrigger = document.querySelector('[class*="footArea"] [class*="settingsArea"] button[aria-haspopup="dialog"]') ||
                            document.querySelector('[class*="footArea"] [class*="settingsArea"] button')
          if (realTrigger) {
            realTrigger.click()
          }
        }
        // Plain Enter in inline composer sends message; Shift+Enter creates newline; IME composition preserved
        if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
          if (e.isComposing || e.keyCode === 229) return
          var target = e.target
          if (target && (target.hasAttribute('data-composer-input') || (target.closest && target.closest('[data-composer-input]')))) {
            var card = target.closest('[data-composer-card]')
            if (card) {
              var sendBtn = card.querySelector('button[aria-label^="发送"], button[aria-label^="Send"], button[aria-label*="发送"], button[aria-label*="Send"], button[aria-label*="排队"], button[aria-label*="Queue"], button[aria-label*="插话"], button[aria-label*="Steer"], [class*="sendBtn"], [class*="sendButton"]')
              if (sendBtn && !sendBtn.disabled) {
                e.preventDefault()
                e.stopPropagation()
                sendBtn.click()
              }
            }
          }
        }
      }

      function onCardPointerDown(e) {
        var card = e.target.closest && e.target.closest('[data-composer-card][data-composer-variant="inline"]')
        if (!card) return
        if (e.target.closest('button, [role="button"], [role="menu"], [role="radiogroup"], input, select')) return
        var input = card.querySelector('[data-composer-input]')
        if (input && document.activeElement !== input) {
          input.focus()
        }
      }

      function onComposerInput(e) {
        var target = e.target
        if (!target) return
        if (target.hasAttribute && (target.hasAttribute('data-composer-input') || (target.closest && target.closest('[data-composer-input]')))) {
          if (ui.copy && ui.copy.syncAttachmentPlaceholder) ui.copy.syncAttachmentPlaceholder()
        }
      }

      document.addEventListener('pointerdown', onGlobalPointerDown)
      document.addEventListener('pointerdown', onCardPointerDown)
      document.addEventListener('keydown', onGlobalKeyDown, true)
      document.addEventListener('input', onComposerInput, true)
      document.addEventListener('compositionend', onComposerInput, true)

      // Both fixed popovers are anchored to their trigger; scroll of the page
      // (not the conversation's own auto-stick) and resizes move the anchor, so
      // whichever is open must re-resolve it.
      function onFixedPopoverViewportChange() {
        if (ui.model) ui.model.reposition()
        if (ui.footer && ui.footer.isOpen()) ui.footer.reposition()
      }
      window.addEventListener('resize', onFixedPopoverViewportChange)
      window.addEventListener('scroll', onFixedPopoverViewportChange, true)

      // The picker's copy follows the shell language, so a locale switch has to
      // rebuild the rows it already painted. Subscribing here (rather than
      // reading the locale at render time only) is what makes the change land
      // while a popover is open.
      var localeUnsubscribe = null
      function onLocaleChange() {
        if (ui.model) ui.model.invalidateCopy()
        schedule()
      }
      try {
        var localeService = ctx.get('locale')
        if (localeService && typeof localeService.subscribe === 'function') {
          localeUnsubscribe = localeService.subscribe(onLocaleChange)
        }
      } catch (error) { /* no locale service: the picker keeps the fallback language */ }

      // Preferences gate the stylesheet and this scheduler both — the footer
      // takeover adds or removes the account row, and the composer scope flips
      // an attribute the stylesheet reads — so a change re-runs the pass. The
      // first read also arrives through here, which is what replaces the
      // defaults with the stored values.
      var prefsUnsubscribe = null
      prefsUnsubscribe = subscribePrefs(function () {
        if (ui.model) ui.model.invalidateCopy()
        schedule()
      })
      loadPrefs()

      var modelCopyUnsubscribe = null
      modelCopyUnsubscribe = onModelCopyLoaded(function () {
        if (ui.model) ui.model.invalidateCopy()
        schedule()
      })

      // Chat streaming mutates the tree constantly; coalesce to one pass a frame.
      var scheduled = false
      var composerCardObserver = null
      var observedCard = null
      if (typeof ResizeObserver !== 'undefined') {
        composerCardObserver = new ResizeObserver(function () {
          var scroller = document.querySelector('[data-conversation-scroll], [class*="scrollBody"]')
          if (scroller) {
            var dist = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight
            if (dist < 150) {
              scroller.scrollTop = scroller.scrollHeight
            }
          }
        })
      }

      function schedule() {
        if (scheduled) return
        scheduled = true
        requestAnimationFrame(function () {
          scheduled = false
          if (ui.copy) ui.copy.sync()
          if (ui.permissions) ui.permissions.sync()
          if (ui.model) ui.model.sync()
          if (ui.footer) ui.footer.sync()
          // Covers the rail toggle (and any reflow) while the popover is open:
          // its anchor moved without a window resize or a page scroll.
          if (ui.footer && ui.footer.isOpen()) ui.footer.reposition()
          if (composerCardObserver) {
            var currentCard = document.querySelector('[data-composer-card]')
            if (currentCard !== observedCard) {
              if (observedCard) composerCardObserver.unobserve(observedCard)
              observedCard = currentCard
              if (observedCard) composerCardObserver.observe(observedCard)
            }
          }
        })
      }
      ui.schedule = schedule

      var observer = new MutationObserver(schedule)
      observer.observe(document.body, {
        childList: true,
        characterData: true,
        subtree: true,
        attributes: true,
        // The shipped trigger carries the current preset in its aria-label;
        // the conversation tabs carry the active view in aria-selected.
        attributeFilter: ['aria-label', 'aria-selected'],
      })
      schedule()

      // The hero greeting follows the clock: re-apply it every minute so the
      // line rolls over on the hour while the app stays open. rewriteHeadline
      // skips identical text, so this cannot feed the observer.
      var greetingTimer = setInterval(function () {
        if (ui.copy) ui.copy.syncGreeting()
      }, 60000)

      return function () {
        clearInterval(greetingTimer)
        greetingTimer = null
        window.removeEventListener('resize', onFixedPopoverViewportChange)
        window.removeEventListener('scroll', onFixedPopoverViewportChange, true)
        if (localeUnsubscribe !== null) {
          try { localeUnsubscribe() } catch (error) { /* already disposed */ }
          localeUnsubscribe = null
        }
        if (prefsUnsubscribe !== null) {
          try { prefsUnsubscribe() } catch (error) { /* already disposed */ }
          prefsUnsubscribe = null
        }
        if (modelCopyUnsubscribe !== null) {
          try { modelCopyUnsubscribe() } catch (error) { /* already disposed */ }
          modelCopyUnsubscribe = null
        }
        observer.disconnect()
        if (composerCardObserver) {
          composerCardObserver.disconnect()
          composerCardObserver = null
          observedCard = null
        }
        document.removeEventListener('pointerdown', onGlobalPointerDown)
        document.removeEventListener('pointerdown', onCardPointerDown)
        document.removeEventListener('keydown', onGlobalKeyDown, true)
        document.removeEventListener('input', onComposerInput, true)
        document.removeEventListener('compositionend', onComposerInput, true)
        // Safety-net DOM sweep. Feature teardowns run after this and tolerate
        // nodes already being detached.
        var leftoverItems = document.querySelectorAll('.dsh-claude-popover-item, .dsh-claude-popover-embed, .dsh-claude-account-popover, .dsh-claude-account-btn, .dsh-claude-perm-container, .dsh-claude-perm-popover, .dsh-claude-segments[data-composer-segments], .dsh-claude-model-btn, .dsh-claude-model-popover, [data-dsh-synthetic-placeholder]')
        for (var li = 0; li < leftoverItems.length; li++) {
          if (leftoverItems[li].parentElement) {
            leftoverItems[li].parentElement.removeChild(leftoverItems[li])
          }
        }
        // Un-hide host footer controls the popover redirection had hidden.
        var footerMarked = document.querySelectorAll('[data-dsh-claude-footer-entry], [data-dsh-claude-footer-hidden], [data-dsh-claude-footer-overlay]')
        for (var fm = 0; fm < footerMarked.length; fm++) {
          footerMarked[fm].removeAttribute('data-dsh-claude-footer-entry')
          footerMarked[fm].removeAttribute('data-dsh-claude-footer-hidden')
          footerMarked[fm].removeAttribute('data-dsh-claude-footer-overlay')
        }
      }
    }
