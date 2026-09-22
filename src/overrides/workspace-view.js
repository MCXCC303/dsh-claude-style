    /**
     * The sidebar's workspace section: a 进行中 / 已归档 segment control that drives
     * the HOST's own archived filter, plus a delete button on archived rows.
     *
     * The host already ships the filter — 视图选项 → 显示已归档 / 仅显示已归档 — and
     * its tree then renders the archived conversations itself, titles, times and
     * all. Re-listing them here would have meant a second, worse copy of that
     * list; driving the filter makes the whole feature "one filter plus one
     * button". The segment control replaces the section's label, clicks the
     * host's menu item for the state the user asked for, and reads the state back
     * out of the tree so a change made in the host's own menu shows up here too.
     *
     * @param ctx - client context.
     * @param ui - shared handle table.
     * @returns teardown.
     */
    function installWorkspaceView(ctx, ui) {
      /** Trash can on an archived row. */
      var DELETE_SVG = '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.6 4.2h10.8"/><path d="M6.4 4.2V3a.8.8 0 0 1 .8-.8h1.6a.8.8 0 0 1 .8.8v1.2"/><path d="M4.2 4.2l.6 8.3a1 1 0 0 0 1 .9h4.4a1 1 0 0 0 1-.9l.6-8.3"/><path d="M6.7 6.8v4M9.3 6.8v4"/></svg>'
      var VIEW_ATTR = 'data-dsh-claude-ws-view'
      var LABEL_ATTR = 'data-dsh-claude-ws-label'
      var ROW_ATTR = 'data-dsh-claude-archive-row'
      var SEGMENTS = [
        { id: 'active', key: 'archiveActive', fallback: 'Active' },
        { id: 'archived', key: 'archiveArchived', fallback: 'Archived' }
      ]
      /** The host's two filter items and its options button, in both locales. */
      var ITEM_ONLY = ['仅显示已归档', 'Archived only']
      var ITEM_SHOW = ['显示已归档', 'Show archived']
      var OPTIONS_LABEL = ['视图选项', 'View options']
      var LABEL_TEXTS = ['工作区', 'Workspace']
      var view = 'active'
      var control = null
      var markedLabel = null
      var markedTree = null
      /** Session ids the registry reports as archived; `null` until it answers. */
      var archived = null
      var loading = false
      var disposed = false
      var retryTimer = null
      /** The row set the archived ids were last read against. */
      var rowSig = ''

      function service(name) {
        try { return ctx.get(name) } catch (error) { return undefined }
      }

      function labelText(key, fallback) {
        return copyLabel(key, fallback)
      }

      function matches(text, pair) {
        var value = (text || '').trim()
        return value === pair[0] || value === pair[1]
      }

      function findSection() {
        var labels = document.querySelectorAll('[class*="sectionLabel"]')
        var first = null
        for (var i = 0; i < labels.length; i++) {
          var text = (labels[i].textContent || '').trim()
          if (first === null) first = labels[i]
          for (var t = 0; t < LABEL_TEXTS.length; t++) {
            if (text === LABEL_TEXTS[t]) return labels[i]
          }
        }
        return first
      }

      function findTree(label) {
        var region = label.parentElement
        while (region !== null && region !== document.body) {
          var tree = region.querySelector('[role="tree"], [class*="list"]')
          // Any row counts, not just a session row: the archived filter groups by
          // workspace, and a collapsed group renders project rows only.
          if (tree !== null && tree.querySelector('[data-row-key]') !== null) return tree
          region = region.parentElement
        }
        return null
      }

      function rowIds() {
        var rows = document.querySelectorAll('[data-row-key^="session:"]')
        var ids = []
        for (var i = 0; i < rows.length; i++) ids.push(rows[i].getAttribute('data-row-key').slice(8))
        return ids
      }

      /** The host's options button: the header's button that is neither ours nor search. */
      function optionsButton(header) {
        var buttons = header.querySelectorAll('button')
        for (var i = 0; i < buttons.length; i++) {
          var button = buttons[i]
          if (button.className.indexOf('dsh-claude-ws-segment') !== -1) continue
          if (button.className.indexOf('searchButton') !== -1) continue
          if (matches(button.getAttribute('aria-label'), OPTIONS_LABEL)) return button
          if (button.querySelector('svg') !== null && buttons.length > 0 && i === buttons.length - 2) return button
        }
        return null
      }

      function menuItems() {
        var items = document.querySelectorAll('[class*="viewOptionsMenu"] [role="menuitem"]')
        if (items.length === 0) items = document.querySelectorAll('[class*="viewOptionsMenu"] button')
        return items
      }

      function findItem(pair) {
        var items = menuItems()
        for (var i = 0; i < items.length; i++) {
          if (matches(items[i].textContent, pair)) return items[i]
        }
        return null
      }

      function isSelected(item) {
        return item !== null && String(item.className).indexOf('_selected_') !== -1
      }

      /** The filter the open menu is showing: 'default' | 'show' | 'only'. */
      function menuFilter() {
        if (isSelected(findItem(ITEM_ONLY))) return 'only'
        if (isSelected(findItem(ITEM_SHOW))) return 'show'
        return 'default'
      }

      function waitFor(test, tries, delay) {
        return new Promise(function (resolve) {
          var left = tries
          function step() {
            if (disposed) { resolve(false); return }
            if (test()) { resolve(true); return }
            if (left-- <= 0) { resolve(false); return }
            retryTimer = setTimeout(step, delay)
          }
          step()
        })
      }

      /**
       * Drive the host's filter to `target` through its own menu. The items
       * toggle, so the item that is currently on is switched off first and the
       * wanted one switched on — one click each, never a guess.
       */
      function pickFilter(target) {
        var label = findSection()
        if (label === null || label.parentElement === null) return
        var button = optionsButton(label.parentElement)
        if (button === null) return
        button.click()
        waitFor(function () { return findItem(ITEM_ONLY) !== null }, 25, 60).then(function (opened) {
          if (!opened) return
          var current = menuFilter()
          if (current === 'only') findItem(ITEM_ONLY).click()
          else if (current === 'show') findItem(ITEM_SHOW).click()
          if (target === 'only') findItem(ITEM_ONLY).click()
          button.click()
          archived = null
        })
      }

      function loadArchived(attempt) {
        function retry() {
          if (disposed || attempt >= 4) {
            archived = []
            loading = false
            return
          }
          loading = true
          retryTimer = setTimeout(function () {
            retryTimer = null
            loadArchived(attempt + 1)
          }, 600)
        }
        var registry = service('remote.workspaceRegistry')
        if (registry === undefined || registry === null || typeof registry.archivedSessionMetadata !== 'function') {
          retry()
          return
        }
        loading = true
        registry.archivedSessionMetadata().then(function (result) {
          if (!result || result.ok !== true) throw new Error('archived metadata unavailable')
          var rows = (result.value && result.value.items) || []
          var set = {}
          for (var i = 0; i < rows.length; i++) set[rows[i].sessionId] = true
          archived = set
          loading = false
          sync()
        }).catch(function () { retry() })
      }

      function removeArchived(id) {
        var registry = service('remote.workspaceRegistry')
        if (registry === undefined || registry === null || typeof registry.deleteSession !== 'function') return
        registry.deleteSession(id).then(function (result) {
          if (!result || result.ok !== true) return
          if (archived !== null) delete archived[id]
          markRows()
        }).catch(function () { /* the row stays; the next read tells the truth */ })
      }

      /** Stamp the delete button onto every archived session row. */
      function markRows() {
        var rows = document.querySelectorAll('[data-row-key^="session:"]')
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i]
          var id = row.getAttribute('data-row-key').slice(8)
          var isArchived = archived !== null && archived[id] === true
          var button = row.querySelector('.dsh-claude-archive-delete')
          if (!isArchived) {
            if (button !== null) button.parentElement.removeChild(button)
            row.removeAttribute(ROW_ATTR)
            continue
          }
          if (row.getAttribute(ROW_ATTR) !== '') row.setAttribute(ROW_ATTR, '')
          if (button !== null) continue
          button = modelEl('button', 'dsh-claude-archive-delete')
          button.type = 'button'
          button.setAttribute('aria-label', labelText('archiveDelete', 'Delete conversation'))
          button.innerHTML = DELETE_SVG
          button.addEventListener('click', function (event) {
            event.stopPropagation()
            event.preventDefault()
            var owner = event.currentTarget.parentElement
            var sessionId = owner === null ? null : owner.getAttribute('data-row-key')
            if (sessionId !== null) removeArchived(sessionId.slice(8))
          })
          row.appendChild(button)
        }
      }

      function buildControl() {
        var group = modelEl('div', 'dsh-claude-ws-segments')
        group.setAttribute('role', 'radiogroup')
        for (var i = 0; i < SEGMENTS.length; i++) {
          var item = modelEl('button', 'dsh-claude-ws-segment', '')
          item.type = 'button'
          item.setAttribute('role', 'radio')
          item.setAttribute('data-view', SEGMENTS[i].id)
          group.appendChild(item)
        }
        group.addEventListener('click', function (event) {
          var target = event.target
          var item = target !== null && typeof target.closest === 'function' ? target.closest('.dsh-claude-ws-segment') : null
          if (item === null) return
          event.stopPropagation()
          event.preventDefault()
          var next = item.getAttribute('data-view')
          if (next === view) return
          view = next
          archived = null
          sync()
          pickFilter(view === 'archived' ? 'only' : 'default')
        })
        return group
      }

      /** Which state the tree is actually in, read back from its rows. */
      function treeView() {
        if (archived === null) return view
        var ids = rowIds()
        // Nothing rendered to read — the archived filter groups by workspace and
        // a collapsed group shows no session row at all. Keep what we asked for
        // rather than flipping the control back on a guess.
        if (ids.length === 0) return view
        for (var i = 0; i < ids.length; i++) {
          if (archived[ids[i]] === true) return 'archived'
        }
        return 'active'
      }

      function sync() {
        var label = findSection()
        if (label === null || label.parentElement === null) return
        var header = label.parentElement
        if (markedLabel !== label) {
          if (markedLabel !== null) markedLabel.removeAttribute(LABEL_ATTR)
          markedLabel = label
          label.setAttribute(LABEL_ATTR, '')
        }
        if (control === null || control.parentElement !== header) {
          if (control !== null && control.parentElement !== null) control.parentElement.removeChild(control)
          control = buildControl()
          header.insertBefore(control, header.firstChild)
        }
        for (var i = 0; i < control.children.length; i++) {
          var item = control.children[i]
          var id = item.getAttribute('data-view')
          for (var s = 0; s < SEGMENTS.length; s++) {
            if (SEGMENTS[s].id !== id) continue
            var text = labelText(SEGMENTS[s].key, SEGMENTS[s].fallback)
            if (item.textContent !== text) item.textContent = text
          }
          var on = id === view
          if (item.getAttribute('aria-checked') !== (on ? 'true' : 'false')) item.setAttribute('aria-checked', on ? 'true' : 'false')
        }
        var tree = findTree(label)
        if (tree === null) return
        if (markedTree !== tree) {
          if (markedTree !== null) markedTree.removeAttribute(VIEW_ATTR)
          markedTree = tree
          tree.setAttribute(VIEW_ATTR, '')
        }
        // The archived ids are read against the row set they describe: the tree
        // changes whenever anything is archived, unarchived or deleted, so that
        // is exactly when the set has to be re-read.
        var sig = rowIds().join(',')
        if (sig !== rowSig) {
          rowSig = sig
          if (archived === null && !loading) loadArchived(0)
        }
        if (archived !== null) {
          var inferred = treeView()
          if (inferred !== view) {
            view = inferred
            for (var j = 0; j < control.children.length; j++) {
              var seg = control.children[j]
              var checked = seg.getAttribute('data-view') === view
              if (seg.getAttribute('aria-checked') !== (checked ? 'true' : 'false')) seg.setAttribute('aria-checked', checked ? 'true' : 'false')
            }
          }
          markRows()
        }
      }

      ui.workspace = { sync: sync }

      return function () {
        disposed = true
        if (retryTimer !== null) {
          clearTimeout(retryTimer)
          retryTimer = null
        }
        if (control !== null && control.parentElement !== null) control.parentElement.removeChild(control)
        var stamped = document.querySelectorAll('[' + ROW_ATTR + ']')
        for (var i = 0; i < stamped.length; i++) {
          stamped[i].removeAttribute(ROW_ATTR)
          var button = stamped[i].querySelector('.dsh-claude-archive-delete')
          if (button !== null) button.parentElement.removeChild(button)
        }
        if (markedLabel !== null) markedLabel.removeAttribute(LABEL_ATTR)
        if (markedTree !== null) markedTree.removeAttribute(VIEW_ATTR)
        control = null
        markedLabel = null
        markedTree = null
        delete ui.workspace
      }
    }
