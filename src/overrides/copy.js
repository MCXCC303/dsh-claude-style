    // ============================================================================
    // 文案改写 (Copy Rewrites)
    // ============================================================================
    function installCopy(ctx, ui) {
      /** Shipped idle composer hints (zh / en, hero / default) this skin replaces. */
      var HINT_SOURCES = [
        '描述你想要构建的内容',
        '发消息或创建任务',
        'Describe what you want to build',
        'Message or run a task',
        'How can I help you today?',
        'Type / for commands',
      ]

      function rewriteHeadline() {
        var greeting = pickHeroGreeting(getUsername(ctx))
        var groups = document.querySelectorAll('[class*="titleGroup"]')
        for (var i = 0; i < groups.length; i++) {
          var spans = groups[i].children
          for (var j = 0; j < spans.length; j++) {
            var span = spans[j]
            var cls = span.getAttribute('class') || ''
            if (cls.indexOf('previewBadge') !== -1) continue
            if (span.textContent !== greeting) span.textContent = greeting
            break
          }
        }
      }

      function isHeroView() {
        var hasTurns = document.querySelector('[class*="turn"], [class*="message"], [data-turn], [data-message-id]') !== null
        return !hasTurns && (document.querySelector('[class*="composerHero"], [data-phase="hero"]') !== null)
      }

      function isComposerActive() {
        var isHero = isHeroView()
        var scope = readPrefs().composerScope
        return scope === 'all' || (isHero ? scope === 'hero' : scope === 'conversation')
      }

      function rewriteHint() {
        if (!isComposerActive()) return
        var isHero = document.querySelector('[class*="heroWorkspaceRow"], [class*="titleGroup"]') !== null
        var targetHint = isHero ? COMPOSER_HINT : 'Type / for commands'
        var hints = document.querySelectorAll('[data-composer-placeholder]')
        for (var i = 0; i < hints.length; i++) {
          var node = hints[i]
          var text = node.textContent || ''
          var idle = false
          for (var j = 0; j < HINT_SOURCES.length; j++) {
            if (text.indexOf(HINT_SOURCES[j]) === 0) {
              idle = true
              break
            }
          }
          if (idle && text !== targetHint) node.textContent = targetHint
        }
        syncAttachmentPlaceholder()
      }

      function syncAttachmentPlaceholder() {
        if (!isComposerActive()) {
          var synths = document.querySelectorAll('[data-dsh-synthetic-placeholder]')
          for (var si = 0; si < synths.length; si++) {
            if (synths[si].parentElement) synths[si].parentElement.removeChild(synths[si])
          }
          return
        }
        var isHero = document.querySelector('[class*="heroWorkspaceRow"], [class*="titleGroup"]') !== null
        var targetHint = isHero ? COMPOSER_HINT : 'Type / for commands'
        var cards = document.querySelectorAll('[data-composer-card]')
        for (var ci = 0; ci < cards.length; ci++) {
          var card = cards[ci]
          var input = card.querySelector('[data-composer-input]')
          if (!input) continue
          var text = (input.textContent || '').replace(/[\u200B-\u200D\uFEFF]/g, '').trim()
          var isEmpty = text.length === 0
          var placeholder = card.querySelector('[data-composer-placeholder]')
          var grow = input.closest ? input.closest('[class*="grow"]') : input.parentElement

          if (isEmpty) {
            if (!placeholder && grow) {
              placeholder = document.createElement('div')
              placeholder.setAttribute('data-composer-placeholder', '')
              placeholder.setAttribute('data-dsh-synthetic-placeholder', 'true')
              placeholder.textContent = targetHint
              grow.appendChild(placeholder)
            } else if (placeholder) {
              if (placeholder.style.display === 'none') placeholder.style.display = ''
              var curText = placeholder.textContent || ''
              var idle = false
              for (var j = 0; j < HINT_SOURCES.length; j++) {
                if (curText.indexOf(HINT_SOURCES[j]) === 0) {
                  idle = true
                  break
                }
              }
              if (idle && curText !== targetHint) placeholder.textContent = targetHint
            }
          } else {
            if (placeholder && placeholder.hasAttribute('data-dsh-synthetic-placeholder')) {
              if (placeholder.parentElement) placeholder.parentElement.removeChild(placeholder)
            }
          }
        }
      }

      /**
       * Claude Code spinner verbs: picks one random verb per session turn
       * and retains it stably for that turn's thinking duration.
       */
      function pickRandomSpinnerVerb() {
        return SPINNER_VERBS[Math.floor(Math.random() * SPINNER_VERBS.length)] + '...'
      }

      function rewriteTurnStatus() {
        var nodes = document.querySelectorAll('[role="status"][class*="turnStatus"], [class*="turnStatus"]:not([class*="Clock"]):not([class*="clock"])')
        for (var i = 0; i < nodes.length; i++) {
          var el = nodes[i]
          var cls = el.getAttribute('class') || ''
          if (cls.indexOf('Clock') !== -1 || cls.indexOf('clock') !== -1) continue
          var verb = el.getAttribute('data-dsh-spinner-verb')
          if (!verb) {
            verb = pickRandomSpinnerVerb()
            el.setAttribute('data-dsh-spinner-verb', verb)
          }
          for (var j = 0; j < el.childNodes.length; j++) {
            var child = el.childNodes[j]
            if (child.nodeType === Node.TEXT_NODE) {
              if (child.nodeValue !== verb) {
                child.nodeValue = verb
              }
              break
            }
          }
        }
      }


      ui.copy = {
        sync: function () {
          rewriteHeadline()
          rewriteHint()
          rewriteTurnStatus()
        },
        syncGreeting: function () {
          rewriteHeadline()
        },
        syncAttachmentPlaceholder: syncAttachmentPlaceholder,
        isHeroView: isHeroView,
        isComposerActive: isComposerActive
      }

      return function () {}
    }
