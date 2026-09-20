    // ============================================================================
    // 4.3: 账户页脚与弹层 (Account Footer & Popover)
    // ============================================================================
    function installAccountFooter(ctx, ui) {
      // --- 4.3 Account Footer & Popover ---
      var accountBtn = null
      var accountPopover = null
      var popoverBody = null
      var popoverHoverIntent = createHoverIntent(openPopover, closePopover, 150)
      // Whether the popover is up because it was CLICKED (rather than hovered).
      // Clicking the account row opens the ban-screen easter egg and leaves the
      // pointer inside the popover, so without this the row's own mouseleave
      // would tear the popover down behind the overlay; a click-opened popover
      // instead stays until the pointer leaves the whole footer.
      var popoverOpenedByClick = false

      function openPopover() {
        if (!accountPopover || !accountBtn) return
        cancelClosePopover()
        // Mirrors are frozen while the popover is open (syncPopoverItems
        // bails), so reconcile them here — before the reveal — to show fresh
        // content/order and bind click targets for the upcoming interaction.
        try {
          var footArea = document.querySelector('[class*="footArea"]')
          if (footArea) syncPopoverItems(footArea)
        } catch (error) { /* opening must never fail because of a mirror sync */ }
        // Resolve the rail anchor before the reveal so the panel never paints at
        // its stale coordinates for a frame.
        positionAccountPopover()
        accountPopover.setAttribute('data-open', 'true')
        accountBtn.setAttribute('data-open', 'true')
        accountBtn.setAttribute('aria-expanded', 'true')
      }

      function closePopover() {
        if (!accountPopover || !accountBtn) return
        cancelClosePopover()
        popoverOpenedByClick = false
        accountPopover.setAttribute('data-open', 'false')
        accountBtn.setAttribute('data-open', 'false')
        accountBtn.setAttribute('aria-expanded', 'false')
      }

      function togglePopover() {
        if (!accountPopover) return
        var isOpen = accountPopover.getAttribute('data-open') === 'true'
        if (isOpen) {
          closePopover()
        } else {
          // The pointer stays on the trigger after a click, and the popover
          // hangs below it, so the trigger's mouseleave must not close what the
          // click just opened — otherwise the panel is unreachable with a mouse.
          popoverOpenedByClick = true
          openPopover()
        }
      }

      function cancelClosePopover() {
        popoverHoverIntent.cancel()
      }

      function scheduleClosePopover() {
        popoverHoverIntent.scheduleClose()
      }

      /**
       * Anchor the account popover to its trigger while the sidebar is a rail.
       *
       * In the rail the popover is `position: fixed` (components/account-footer.css): the sidebar
       * column clips its overflow, so an absolutely positioned panel would be cut
       * off at the 56px rail edge and never seen. Its coordinates therefore have
       * to be resolved here — the same contract the model picker's popovers use.
       * The declarations are written `important` because the stylesheet anchors
       * the wide-sidebar popover with `!important` as well, and an author
       * `!important` beats a plain inline declaration.
       *
       * With the sidebar wide the CSS anchor is the right one, so the inline
       * overrides are dropped again and the footer rule takes over.
       */
      function positionAccountPopover() {
        if (!accountPopover || !accountBtn) return
        if (accountBtn.closest('[class*="collapsed"]') === null) {
          accountPopover.style.removeProperty('left')
          accountPopover.style.removeProperty('top')
          return
        }
        positionAnchoredPopover(accountBtn, accountPopover, { side: 'right', important: true })
      }

      var settingsItem = null
      function syncPopoverItems(footArea) {
        if (!popoverBody || !footArea) return

        var origSettingsTrigger = footArea.querySelector('[class*="settingsArea"] button[aria-haspopup="dialog"]') ||
                                  footArea.querySelector('[class*="settingsArea"] button')
        var labelText = '设置'
        if (origSettingsTrigger) {
          var txt = (origSettingsTrigger.textContent || '').trim()
          if (!txt) txt = origSettingsTrigger.getAttribute('aria-label') || ''
          if (txt) labelText = txt
        }

        if (!settingsItem) {
          settingsItem = document.createElement('button')
          settingsItem.type = 'button'
          settingsItem.className = 'dsh-claude-popover-item'
          settingsItem.setAttribute('data-action', 'settings')
          settingsItem.innerHTML =
            '<span class="dsh-claude-popover-item-icon">' +
              '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
                '<circle cx="12" cy="12" r="3"></circle>' +
                '<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>' +
              '</svg>' +
            '</span>' +
            '<span class="dsh-claude-popover-item-text">' + labelText + '</span>' +
            '<span class="dsh-claude-popover-item-shortcut">Ctrl+,</span>'

          settingsItem.addEventListener('click', function (e) {
            e.stopPropagation()
            closePopover()
            var realTrigger = footArea.querySelector('[class*="settingsArea"] button[aria-haspopup="dialog"]') ||
                              footArea.querySelector('[class*="settingsArea"] button')
            if (realTrigger) {
              realTrigger.click()
            }
          })
          popoverBody.appendChild(settingsItem)
        } else {
          var txtEl = settingsItem.querySelector('.dsh-claude-popover-item-text')
          if (txtEl && txtEl.textContent !== labelText) txtEl.textContent = labelText
        }

        var footerActions = footArea.querySelector('[class*="footerActions"]')
        var footerEntries = syncFooterActionVisibility(footerActions)

        // While the popover is open, its mirrors must stay completely static:
        // a content rewrite, reorder, or embedded-clone replacement under the
        // pointer cancels the browser's :hover state and can swallow the click
        // between pointerdown and pointerup. Sync runs only while closed;
        // openPopover runs one final pass right before the reveal — and the
        // sidebar-side redirection above stays live, so a newly mounted entry
        // keeps being hidden even with the popover open.
        if (accountPopover && accountPopover.getAttribute('data-open') === 'true') return

        var existingActionItems = popoverBody.querySelectorAll('[data-action-index], [data-embed-index]')
        for (var ea = 0; ea < existingActionItems.length; ea++) {
          var staleIdx = parseInt(existingActionItems[ea].getAttribute('data-action-index') || existingActionItems[ea].getAttribute('data-embed-index'), 10)
          if (isNaN(staleIdx) || staleIdx >= footerEntries.length) {
            existingActionItems[ea].parentElement.removeChild(existingActionItems[ea])
          }
        }

        for (var f = 0; f < footerEntries.length; f++) {
          try {
            (function (entry, idx) {
            var trigger = findFooterTrigger(entry)
            var hasContent = (entry.textContent || '').trim() !== '' ||
                             entry.querySelector('svg, img, canvas') !== null

            // Rich widgets (progress bars, stat panels) cannot collapse into
            // a text menu item — embed a live clone instead, forwarding
            // clicks to the entry's trigger when it has one (the cost-meter
            // balance stack is itself clickable).
            if (!entryIsActionLike(entry, trigger)) {
              removeActionMirror(idx)
              if (hasContent) {
                syncEmbedMirror(entry, idx, trigger)
              } else {
                removeEmbedMirror(idx)
              }
              return
            }
            removeEmbedMirror(idx)

            // The mirrored item activates the first interactive element
            // outside any overlay.
            var activator = trigger
            var item = popoverBody.querySelector('[data-action-index="' + idx + '"]')
            var iconEl = (trigger && trigger.querySelector('svg')) || entry.querySelector('svg')
            var iconHtml = iconEl ? iconEl.outerHTML : ''
            var text = activator.getAttribute('aria-label') || (activator.textContent || '').trim() || '插件'
            var badge = activator.getAttribute('data-cordis-badge') || entry.getAttribute('data-cordis-badge') || ''

            if (!item) {
              item = document.createElement('button')
              item.type = 'button'
              item.className = 'dsh-claude-popover-item'
              item.setAttribute('data-action-index', idx)
              item.innerHTML =
                '<span class="dsh-claude-popover-item-icon">' + iconHtml + '</span>' +
                '<span class="dsh-claude-popover-item-text">' + text + '</span>' +
                (badge ? '<span class="dsh-claude-popover-item-badge">' + badge + '</span>' : '')

              item.addEventListener('click', function (e) {
                e.stopPropagation()
                closePopover()
                // The activator is rebound on every (closed-state) sync pass
                // (`item.__dshActivator`), never captured at creation — the
                // host re-sorts list slots by `order` on each render, so the
                // entry behind an index changes over time.
                var live = item.__dshActivator
                if (!live || typeof live.click !== 'function') {
                  // Safety net: re-resolve the current trigger for this index
                  // from the live footer DOM. Covers the rare case where the
                  // stored node was detached by a host re-render while the
                  // popover was open.
                  try {
                    var fa = document.querySelector('[class*="footArea"]')
                    var actions = fa ? fa.querySelector('[class*="footerActions"]') : null
                    var liveEntries = actions ? footerEntriesOf(actions) : []
                    var liveEntry = liveEntries[idx] || null
                    live = liveEntry ? findFooterTrigger(liveEntry) : null
                  } catch (error) {
                    live = null
                  }
                }
                if (live && typeof live.click === 'function') live.click()
              })
              popoverBody.insertBefore(item, settingsItem)
            } else {
              // Entries are reused by index: the host re-sorts list slots by
              // `order` on every render, so a re-sort can seat a different
              // plugin under an existing item — icon, text, badge AND the
              // click target must all re-sync, or the label shows one entry
              // while the click fires the previous occupant's trigger.
              var iEl = item.querySelector('.dsh-claude-popover-item-icon')
              if (iEl && iEl.innerHTML !== iconHtml) iEl.innerHTML = iconHtml
              var tEl = item.querySelector('.dsh-claude-popover-item-text')
              if (tEl && tEl.textContent !== text) tEl.textContent = text
              var bEl = item.querySelector('.dsh-claude-popover-item-badge')
              if (bEl && bEl.textContent !== badge) bEl.textContent = badge
            }
            // Rebind the click target to the entry currently behind this
            // index. Done on every pass, for new and reused items alike.
            item.__dshActivator = activator
            })(footerEntries[f], f)
          } catch (err) {
            // A single broken entry must not abort the rest of the mirror
            // sync (which would leave later items without a rebound
            // activator or un-ordered).
          }
        }

        // The host re-sorts list-slot outlets by `order` on every render
        // (stable, ties keep registration order), and plugins mount
        // progressively at startup — so the mirror nodes must track the live
        // footer order on every pass: a later re-sort would otherwise leave
        // the popover frozen in a stale order that no longer matches the
        // real controls. Re-append action items and embedded widgets in
        // entry-index order.
        var mirrors = []
        for (var mi = 0; mi < popoverBody.children.length; mi++) {
          var mirrorNode = popoverBody.children[mi]
          if (mirrorNode === settingsItem) continue
          if (mirrorNode.hasAttribute('data-action-index') || mirrorNode.hasAttribute('data-embed-index')) {
            mirrors.push(mirrorNode)
          }
        }
        mirrors.sort(function (a, b) {
          var ai = parseInt(a.getAttribute('data-action-index') || a.getAttribute('data-embed-index'), 10) || 0
          var bi = parseInt(b.getAttribute('data-action-index') || b.getAttribute('data-embed-index'), 10) || 0
          return ai - bi
        })
        for (var mr = 0; mr < mirrors.length; mr++) {
          popoverBody.insertBefore(mirrors[mr], settingsItem)
        }
      }

      // --- Footer action redirection helpers ---
      /**
       * The `sidebar.footer.action` list slot accepts arbitrary plugin
       * controls, not just buttons: a plugin may render a composite widget
       * (toggles, selects, status chips) straight into the sidebar footer.
       * Redirection therefore works on ENTRIES (direct children of
       * footerActions), not on `querySelectorAll('button')`:
       *   - every entry is marked `data-dsh-claude-footer-entry` (CSS
       *     collapses its box so nothing paints in the sidebar);
       *   - entries without a floating overlay are hidden wholesale via
       *     `data-dsh-claude-footer-hidden`;
       *   - entries hosting an overlay — a fixed-position panel (the cordis
       *     inventory panel) or a dialog/menu/listbox — stay visible, but
       *     every branch of their subtree that does not lead to the overlay
       *     is hidden, so only the overlay itself can surface.
       * Returns the live entry list for popover mirroring.
       */
      function syncFooterActionVisibility(footerActions) {
        if (!footerActions) return []
        var entries = footerEntriesOf(footerActions)
        for (var i = 0; i < entries.length; i++) {
          var entry = entries[i]
          entry.setAttribute('data-dsh-claude-footer-entry', '')
          var all = entry.querySelectorAll('*')
          for (var j = 0; j < all.length; j++) {
            var el = all[j]
            if (el.hasAttribute('data-dsh-claude-footer-overlay')) continue
            var role = el.getAttribute('role') || ''
            var overlay = role === 'dialog' || role === 'menu' || role === 'listbox'
            if (!overlay) {
              try { overlay = window.getComputedStyle(el).position === 'fixed' } catch (e) { overlay = false }
            }
            if (overlay) el.setAttribute('data-dsh-claude-footer-overlay', '')
          }
          markFooterHiddenBranches(entry)
        }
        return entries
      }

      /**
       * Mirrorable footer units. Every slot outlet renders inside a
       * `div[data-slot]` anchor with `display:contents`, so a list slot's
       * entries are the ANCHOR's children, not footerActions' — reading
       * `footerActions.children` directly collapses every registrant into a
       * single mirrorable unit and drops all but the first from the popover.
       * Dead cells (`data-slot-error`) never mirror.
       */
      function footerEntriesOf(footerActions) {
        var entries = []
        var kids = footerActions.children
        for (var i = 0; i < kids.length; i++) {
          var kid = kids[i]
          if (kid.hasAttribute('data-slot-error')) continue
          if (kid.hasAttribute('data-slot')) {
            var slotKids = kid.children
            for (var j = 0; j < slotKids.length; j++) {
              if (!slotKids[j].hasAttribute('data-slot-error')) entries.push(slotKids[j])
            }
          } else {
            entries.push(kid)
          }
        }
        return entries
      }

      /** Hide every branch of `el`'s subtree that does not carry an overlay. */
      function markFooterHiddenBranches(el) {
        if (el.hasAttribute('data-dsh-claude-footer-overlay')) {
          el.removeAttribute('data-dsh-claude-footer-hidden')
          return
        }
        if (el.querySelector('[data-dsh-claude-footer-overlay]') !== null) {
          el.removeAttribute('data-dsh-claude-footer-hidden')
          var kids = el.children
          for (var i = 0; i < kids.length; i++) markFooterHiddenBranches(kids[i])
          return
        }
        el.setAttribute('data-dsh-claude-footer-hidden', '')
      }

      /** Remove the mirrored text item for one entry index, if present. */
      function removeActionMirror(idx) {
        var item = popoverBody.querySelector('[data-action-index="' + idx + '"]')
        if (item && item.parentElement) item.parentElement.removeChild(item)
      }

      /** Remove the embedded widget clone for one entry index, if present. */
      function removeEmbedMirror(idx) {
        var embed = popoverBody.querySelector('[data-embed-index="' + idx + '"]')
        if (embed && embed.parentElement) embed.parentElement.removeChild(embed)
      }

      /**
       * Whether an entry reads as a plain ACTION (mirror it as a text menu
       * item) or as a rich WIDGET (embed a live clone). A text item is only
       * faithful when the trigger accounts for essentially all of the
       * entry's visible content: a clickable progress-bar stack (cost-meter
       * balance) would otherwise shrink to one label and lose its bars.
       * Overlay text is excluded so an open cordis panel does not flip its
       * own entry into a widget.
       */
      function entryIsActionLike(entry, trigger) {
        if (trigger === null) return false
        if (trigger === entry) {
          // Only genuinely interactive ROOTS count as actions; a clickable
          // container (a region or tabindex wrapper) is still a widget.
          var tag = entry.tagName
          var role = entry.getAttribute('role') || ''
          return tag === 'BUTTON' || tag === 'A' || role === 'button'
        }
        // Semantic meter markup is always a widget, however small.
        if (entry.querySelector('[role="progressbar"], [role="meter"], meter, progress') !== null) return false
        var entryText = textExcludingOverlays(entry)
        var triggerText = (trigger.textContent || '').trim()
        // Tight slack: the trigger must account for essentially all of the
        // entry's visible text. A balance box reading "余额¥10.07" beside an
        // icon-only trigger already exceeds it — and its bar must survive.
        return entryText.length - triggerText.length <= 2
      }

      /** Visible text of an entry, skipping overlay subtrees. */
      function textExcludingOverlays(entry) {
        var text = ''
        var walker = document.createTreeWalker(entry, 4 /* SHOW_TEXT */, {
          acceptNode: function (node) {
            var p = node.parentElement
            while (p && p !== entry) {
              if (p.hasAttribute('data-dsh-claude-footer-overlay')) return 2 // REJECT
              p = p.parentElement
            }
            return 1 // ACCEPT
          }
        })
        while (walker.nextNode()) text += walker.currentNode.nodeValue
        return text.trim()
      }

      /**
       * Embed a live clone of a display-only footer entry (a progress bar
       * reads as nothing as a text menu item — the cost-meter balance/quota
       * stack is the known case). The clone is replaced only when the
       * source's markup changes, so it tracks the plugin's re-renders without
       * churning the popover DOM. Skin marker attributes, ids, and overlay
       * subtrees are stripped from the copy: it must never be re-hidden by
       * the footArea hiding rule, double-register an id, or duplicate an
       * open panel next to the real one. Event listeners do not survive
       * cloning, so the embed forwards clicks back into the live entry —
       * path-mapped to the clicked sub-control (see resolveEmbedActivator) —
       * and deliberately leaves the popover open so the widget's response
       * stays visible; it still closes on pointer-leave as usual. The embed
       * is marked `data-clickable` for the cursor when the entry has a
       * trigger at all.
       */
      function syncEmbedMirror(entry, idx, forward) {
        var embed = popoverBody.querySelector('[data-embed-index="' + idx + '"]')
        if (!embed) {
          embed = document.createElement('div')
          embed.className = 'dsh-claude-popover-embed'
          embed.setAttribute('data-embed-index', idx)
          embed.addEventListener('click', function (e) {
            if (!embed.__dshEntry) return
            e.stopPropagation()
            var activator = resolveEmbedActivator(e.target, embed)
            if (activator) activator.click()
          })
          popoverBody.insertBefore(embed, settingsItem)
        }
        embed.__dshEntry = entry
        embed.__dshForward = forward || null
        if (forward) {
          embed.setAttribute('data-clickable', '')
        } else {
          embed.removeAttribute('data-clickable')
        }
        var clone = entry.cloneNode(true)
        clone.removeAttribute('id')
        clone.removeAttribute('data-dsh-claude-footer-entry')
        clone.removeAttribute('data-dsh-claude-footer-hidden')
        clone.removeAttribute('data-dsh-claude-footer-overlay')
        var overlays = clone.querySelectorAll('[data-dsh-claude-footer-overlay]')
        for (var o = 0; o < overlays.length; o++) {
          overlays[o].parentElement.removeChild(overlays[o])
        }
        var stripped = clone.querySelectorAll('[id], [data-dsh-claude-footer-hidden]')
        for (var s = 0; s < stripped.length; s++) {
          stripped[s].removeAttribute('id')
          stripped[s].removeAttribute('data-dsh-claude-footer-hidden')
        }
        var html = clone.outerHTML
        if (embed.getAttribute('data-embed-html') !== html) {
          embed.setAttribute('data-embed-html', html)
          while (embed.firstChild) embed.removeChild(embed.firstChild)
          embed.appendChild(clone)
        }
      }

      var INTERACTIVE_SELECTOR = 'button, [role="button"], a[href], [tabindex], input, select, summary'

      /**
       * Map a click inside the embedded clone back to the matching control
       * of the live entry. Forwarding every embed click to the entry's FIRST
       * trigger misfires for multi-control widgets (the cost-meter stack
       * carries refresh / collapse / tab buttons): the user clicks the
       * balance box but the first button in tree order fires. The clone
       * preserves the entry's tree shape, so the clicked node's child-index
       * path replays onto the original (tag-checked per level — overlay
       * stripping can shift siblings); the nearest interactive element at or
       * above the mapped node wins, and any mismatch falls back to the
       * entry's primary trigger.
       */
      function resolveEmbedActivator(clicked, embed) {
        var entry = embed.__dshEntry
        var cloneRoot = embed.firstChild
        if (!entry || !cloneRoot || !clicked || clicked.nodeType !== 1) return embed.__dshForward
        if (clicked === embed || clicked === cloneRoot) return embed.__dshForward
        // Child-index path from the clicked clone node up to the clone root.
        var path = []
        var node = clicked
        while (node && node !== cloneRoot) {
          var parent = node.parentElement
          if (!parent) return embed.__dshForward
          path.unshift(Array.prototype.indexOf.call(parent.children, node))
          node = parent
        }
        // Replay the path on the live entry, verifying shape level by level.
        var original = entry
        var cloneNode = cloneRoot
        for (var i = 0; i < path.length; i++) {
          var nextClone = cloneNode.children[path[i]]
          var nextOrig = original.children[path[i]]
          if (!nextClone || !nextOrig || nextClone.tagName !== nextOrig.tagName) {
            return embed.__dshForward
          }
          cloneNode = nextClone
          original = nextOrig
        }
        // Nearest interactive element at or above the mapped original,
        // bounded by the entry and never inside an overlay subtree.
        var target = original
        while (target) {
          if (target !== entry && target.matches && target.matches(INTERACTIVE_SELECTOR) &&
              !hasOverlayAncestor(target, entry)) {
            return target
          }
          if (target === entry) break
          target = target.parentElement
        }
        return embed.__dshForward
      }

      /** Whether `el` sits inside an overlay-marked subtree above `entry`. */
      function hasOverlayAncestor(el, entry) {
        var node = el
        while (node && node !== entry) {
          if (node.hasAttribute && node.hasAttribute('data-dsh-claude-footer-overlay')) return true
          node = node.parentElement
        }
        return false
      }

      /**
       * First interactive element of a footer entry that is not part of an
       * overlay subtree (an open panel may render action buttons of its own,
       * and those must never become the popover item's activation target).
       */
      function findFooterTrigger(entry) {
        var selector = INTERACTIVE_SELECTOR
        if (entry.matches && entry.matches(selector) &&
            !entry.hasAttribute('data-dsh-claude-footer-overlay')) {
          return entry
        }
        var found = entry.querySelectorAll(selector)
        for (var i = 0; i < found.length; i++) {
          var candidate = found[i]
          var node = candidate
          var insideOverlay = false
          while (node && node !== entry) {
            if (node.hasAttribute && node.hasAttribute('data-dsh-claude-footer-overlay')) {
              insideOverlay = true
              break
            }
            node = node.parentElement
          }
          if (!insideOverlay) return candidate
        }
        return null
      }

      /**
       * Hand the sidebar footer back to the host.
       *
       * The "Collapse the sidebar settings area" preference turns the whole
       * takeover off, so the skin's own nodes go and every marker it put on the
       * host's entries is removed — with the stylesheet's takeover rules gated
       * on the same attribute, the footer then renders exactly as shipped.
       */
      function dropAccountFooter(footArea) {
        cancelClosePopover()
        if (accountBtn !== null && accountBtn.parentElement !== null) accountBtn.parentElement.removeChild(accountBtn)
        if (accountPopover !== null && accountPopover.parentElement !== null) {
          accountPopover.parentElement.removeChild(accountPopover)
        }
        accountBtn = null
        accountPopover = null
        popoverBody = null
        settingsItem = null
        var marked = footArea.querySelectorAll(
          '[data-dsh-claude-footer-entry], [data-dsh-claude-footer-hidden], [data-dsh-claude-footer-overlay]',
        )
        for (var i = 0; i < marked.length; i++) {
          marked[i].removeAttribute('data-dsh-claude-footer-entry')
          marked[i].removeAttribute('data-dsh-claude-footer-hidden')
          marked[i].removeAttribute('data-dsh-claude-footer-overlay')
        }
      }
      function syncAccountFooter() {
        var footArea = document.querySelector('[class*="footArea"]')
        if (footArea === null) return

        if (!readPrefs().collapseFooter) {
          dropAccountFooter(footArea)
          return
        }
        var username = getUsername(ctx)

        if (accountBtn === null || !footArea.contains(accountBtn)) {
          if (accountBtn && accountBtn.parentElement) accountBtn.parentElement.removeChild(accountBtn)
          accountBtn = document.createElement('div')
          accountBtn.className = 'dsh-claude-account-btn'
          accountBtn.setAttribute('role', 'button')
          accountBtn.setAttribute('tabindex', '0')
          accountBtn.setAttribute('aria-haspopup', 'menu')
          accountBtn.setAttribute('aria-expanded', 'false')
          accountBtn.innerHTML =
            '<span class="dsh-claude-account-avatar"></span>' +
            '<span class="dsh-claude-account-label">' +
              '<span class="dsh-claude-account-user">' + username + '</span>' +
            '</span>' +
            '<span class="dsh-claude-account-chevron"></span>'

          // Hover is the default way in; the "Open popovers on hover"
          // preference turns it off, leaving the click handler below as the only
          // way in (and the only way out, so a click-opened popover does not
          // vanish when the pointer leaves).
          accountBtn.addEventListener('mouseenter', function () {
            if (readPrefs().autoPopover) openPopover()
          })
          accountBtn.addEventListener('mouseleave', function () {
            if (readPrefs().autoPopover && !popoverOpenedByClick) scheduleClosePopover()
          })
          accountBtn.addEventListener('click', function (e) {
            e.stopPropagation()
            togglePopover()
          })
          footArea.appendChild(accountBtn)
        } else {
          var userEl = accountBtn.querySelector('.dsh-claude-account-user')
          if (userEl && userEl.textContent !== username) userEl.textContent = username
        }

        if (accountPopover === null || !footArea.contains(accountPopover)) {
          if (accountPopover && accountPopover.parentElement) accountPopover.parentElement.removeChild(accountPopover)
          accountPopover = document.createElement('div')
          accountPopover.id = 'dsh-claude-account-popover'
          accountPopover.className = 'dsh-claude-account-popover'
          accountPopover.setAttribute('data-open', 'false')

          accountPopover.addEventListener('mouseenter', function () {
            cancelClosePopover()
          })
          accountPopover.addEventListener('mouseleave', function () {
            scheduleClosePopover()
          })

          // The account row is the ban-screen easter egg's trigger
          // (src/overrides/ban-screen.js). The marker attribute stays on the
          // header (it is the row's stable hook, and the row keeps its
          // semantics), but the header is only a WRAPPER: the clickable strip is
          // the inner `.…-row`, and the divider is its SIBLING so the hover
          // plate covers the name alone instead of swallowing the rule.
          var header = document.createElement('div')
          header.className = 'dsh-claude-account-popover-header'
          header.setAttribute('data-dsh-claude-ban-row', '')

          var rowEl = document.createElement('div')
          rowEl.className = 'dsh-claude-account-popover-row'
          rowEl.setAttribute('role', 'button')
          rowEl.setAttribute('tabindex', '0')
          rowEl.setAttribute('aria-haspopup', 'dialog')

          var nameEl = document.createElement('div')
          nameEl.className = 'dsh-claude-account-popover-name'
          nameEl.textContent = username

          var divider = document.createElement('div')
          divider.className = 'dsh-claude-account-popover-divider'

          rowEl.appendChild(nameEl)
          header.appendChild(rowEl)
          header.appendChild(divider)
          accountPopover.appendChild(header)

          popoverBody = document.createElement('div')
          popoverBody.className = 'dsh-claude-account-popover-body'
          accountPopover.appendChild(popoverBody)

          footArea.appendChild(accountPopover)
        } else {
          var nameEl2 = accountPopover.querySelector('.dsh-claude-account-popover-name')
          if (nameEl2 && nameEl2.textContent !== username) nameEl2.textContent = username
        }

        // The account row is the ban-screen easter egg's trigger (ban-screen.js).
        // Bound OUTSIDE the build/refresh branch above so the pass that creates
        // the popover already wires the row — inside the `else` the very first
        // render would leave it dead until the next sync. `__dshBanBound` keeps
        // a later pass from binding it twice, which would open the overlay twice
        // per click.
        var banRow = accountPopover.querySelector('[data-dsh-claude-ban-row]')
        if (banRow && !banRow.__dshBanBound) {
          banRow.__dshBanBound = true
          banRow.addEventListener('click', function (e) {
            // The row's gesture is the easter egg, not a popover selection.
            e.preventDefault()
            e.stopPropagation()
            // Leave the popover up: the overlay is a full-window surface, so
            // what is behind it does not matter, and the footer is left as the
            // user had it once the screen is dismissed. The pointer is still
            // parked on the trigger, so the mouseleave close stays suspended
            // (popoverOpenedByClick) and the panel does not blink out from under
            // the overlay.
            popoverOpenedByClick = true
            if (ui.ban) ui.ban.open()
          })
          banRow.addEventListener('keydown', function (e) {
            if (e.key !== 'Enter' && e.key !== ' ') return
            e.preventDefault()
            e.stopPropagation()
            popoverOpenedByClick = true
            if (ui.ban) ui.ban.open()
          })
        }

        syncPopoverItems(footArea)
      }


      ui.footer = {
        sync: syncAccountFooter,
        close: closePopover,
        owns: function (target) {
          if (!target) return false
          return (accountBtn !== null && accountBtn.contains(target)) ||
                 (accountPopover !== null && accountPopover.contains(target))
        },
        isOpen: function () {
          return !!(accountPopover && accountPopover.getAttribute('data-open') === 'true')
        },
        reposition: positionAccountPopover
      }

      return function () {
        cancelClosePopover()
        var footArea = document.querySelector('[class*="footArea"]')
        if (footArea) {
          dropAccountFooter(footArea)
        } else {
          if (accountBtn !== null && accountBtn.parentElement !== null) accountBtn.parentElement.removeChild(accountBtn)
          if (accountPopover !== null && accountPopover.parentElement !== null) accountPopover.parentElement.removeChild(accountPopover)
          accountBtn = null
          accountPopover = null
          popoverBody = null
          settingsItem = null
        }
      }
    }
