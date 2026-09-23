    function installScheduler(ctx, ui) {
      function onGlobalPointerDown(e) {
        var target = e.target
        // The model picker is hover-driven; a press anywhere outside its
        // trigger and both levels closes it (same discipline as the perm menu).
        if (target && ui.model && !ui.model.owns(target)) {
          ui.model.close()
        }
        // The effort card is its own popover with its own trigger, so it closes
        // on the same press-anywhere-outside rule.
        if (target && ui.effort && !ui.effort.owns(target)) {
          ui.effort.close()
        }
        if (ui.settings) ui.settings.sync()
        if (!ui.footer || !ui.footer.isOpen()) return
        if (target && ui.footer.owns(target)) return
        ui.footer.close()
      }

      function onGlobalKeyDown(e) {
        if (e.key === 'Escape') {
          if (ui.footer) ui.footer.close()
          if (ui.permissions) ui.permissions.closeMenu()
          if (ui.model) ui.model.close()
          if (ui.effort) ui.effort.close()
          // The account-hold overlay is the one layer that does NOT close on a
          // window blur (it is meant to be read, and reading it may mean
          // switching windows), so Esc is its keyboard way out.
          if (ui.ban) ui.ban.close()
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

      // Focus moving into the composer means the user is about to type: every
      // popover the skin keeps open around the card is in the way there, so all
      // of them close. `focusin` bubbles (unlike focus), so one listener covers
      // the card and everything inside it; the observer's attributeFilter does
      // not watch focus events, so this cannot feed itself another pass.
      function onComposerFocusIn(e) {
        var target = e.target
        if (!target || typeof target.closest !== 'function') return
        if (target.closest('[data-composer-card]') === null) return
        if (ui.model) ui.model.close()
        if (ui.permissions) ui.permissions.closeMenu()
        if (ui.permissions && ui.permissions.closeStats) ui.permissions.closeStats()
        if (ui.footer) ui.footer.close()
        // The hero menu has no close of its own — it lives and dies with the
        // host's hover state, and syncHeroMenu notices when it is gone — so the
        // call is guarded like closeStats above. Unguarded it threw a TypeError
        // on every composer focus-in, which also aborted the rest of this
        // handler for that event.
        if (ui.heroMenu && ui.heroMenu.close) ui.heroMenu.close()
        if (ui.quickProviders) ui.quickProviders.close()
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
      document.addEventListener('focusin', onComposerFocusIn, true)

      // Both fixed popovers are anchored to their trigger; scroll of the page
      // (not the conversation's own auto-stick) and resizes move the anchor, so
      // whichever is open must re-resolve it.
      function onFixedPopoverViewportChange() {
        if (ui.model) ui.model.reposition()
        if (ui.heroMenu) ui.heroMenu.reposition()
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
        // The account-hold page is assembled once per open, so a language change
        // has to rebuild an open one (a no-op while it is closed).
        if (ui.ban) ui.ban.refresh()
        schedule()
      })
      loadPrefs()

      var modelCopyUnsubscribe = null
      modelCopyUnsubscribe = onModelCopyLoaded(function () {
        if (ui.model) ui.model.invalidateCopy()
        schedule()
      })

      var usernameUnsubscribe = null
      usernameUnsubscribe = onUsernameLoaded(function () {
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
        if (ui.effort) ui.effort.sync()
          if (ui.heroMenu) ui.heroMenu.sync()
          if (ui.footer) ui.footer.sync()
          if (ui.workspace) ui.workspace.sync()
          if (ui.viewTabs) ui.viewTabs.sync()
          if (ui.settings) ui.settings.sync()
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
        if (usernameUnsubscribe !== null) {
          try { usernameUnsubscribe() } catch (error) { /* already disposed */ }
          usernameUnsubscribe = null
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
        document.removeEventListener('focusin', onComposerFocusIn, true)
        // Safety-net DOM sweep. Feature teardowns run after this and tolerate
        // nodes already being detached.
        var leftoverItems = document.querySelectorAll('.dsh-claude-popover-item, .dsh-claude-popover-embed, .dsh-claude-account-popover, .dsh-claude-account-btn, .dsh-claude-perm-container, .dsh-claude-perm-popover, .dsh-claude-segments[data-composer-segments], .dsh-claude-model-btn, .dsh-claude-model-popover, .dsh-claude-ban, [data-dsh-synthetic-placeholder]')
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
