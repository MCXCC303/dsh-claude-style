    /**
     * The sidebar's workspace section, re-cut as a two-state view.
     *
     * 进行中 needs no filtering of its own: the host's tree already leaves
     * archived sessions out (measured on 0.1.7-alpha.1 — 10 rows, 6 archived, zero
     * overlap). 已归档 is the skin's own flat list of archived conversations, built
     * from the archive registry (ids) plus the session list (titles and times),
     * with a delete button on every row.
     *
     * The host DOES ship this filter, but its state lives in a store created per
     * view instance (`createWorkspaceViewStore`) and is not reachable as a client
     * service — the only way to use it is to click its options menu, which flashes
     * a popover in the user's face and still leaves the archived rows buried in
     * collapsed workspace groups. Listing them here is quieter and flat.
     *
     * @param ctx - client context.
     * @param ui - shared handle table.
     * @returns teardown.
     */
    function installWorkspaceView(ctx, ui) {
      /** Trash can for one archived row. */
      var DELETE_SVG = '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.6 4.2h10.8"/><path d="M6.4 4.2V3a.8.8 0 0 1 .8-.8h1.6a.8.8 0 0 1 .8.8v1.2"/><path d="M4.2 4.2l.6 8.3a1 1 0 0 0 1 .9h4.4a1 1 0 0 0 1-.9l.6-8.3"/><path d="M6.7 6.8v4M9.3 6.8v4"/></svg>'
      /** Tray with an up arrow: put this conversation back among the live ones. */
      var RESTORE_SVG = '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.6 9.2v3.4a1 1 0 0 0 1 1h8.8a1 1 0 0 0 1-1V9.2"/><path d="M8 10.4V2.6"/><path d="M5.2 5.4L8 2.6l2.8 2.8"/></svg>'
      /**
       * The host's own Tooltip and icons, reached through the plugin loader's
       * `require` — the same packages its UI uses, so these row actions look and
       * behave like the host's. `@deepseek-ai/dsh-client-ui-primitives` exports
       * `Tooltip`, `IconUnarchiveOutlineRegular` and `IconTrashOutlineRegular`.
       * Guarded: a loader that hands over nothing leaves the skin's own SVG and a
       * native title in place.
       */
      var primitives = null
      var react = null
      var reactDom = null
      try { primitives = require('@deepseek-ai/dsh-client-ui-primitives') } catch (error) { primitives = null }
      try { react = require('react') } catch (error) { react = null }
      try { reactDom = require('react-dom/client') } catch (error) { reactDom = null }
      /** React roots holding the row actions, unmounted when the list is rebuilt. */
      var actionRoots = []
      var VIEW_ATTR = 'data-dsh-claude-ws-view'
      var LABEL_ATTR = 'data-dsh-claude-ws-label'
      var TREE_ATTR = 'data-dsh-claude-ws-tree'
      var SEGMENTS = [
        { id: 'active', key: 'archiveActive', fallback: 'Active' },
        { id: 'archived', key: 'archiveArchived', fallback: 'Archived' }
      ]
      var LABEL_TEXTS = ['工作区', 'Workspace']
      var view = 'active'
      var control = null
      var listHost = null
      var markedLabel = null
      var markedTree = null
      /** `null` until the registry answers; then `[{ id, title, at }]`. */
      var items = null
      var loading = false
      /**
       * Whether this host archives conversations at all. Until the archive
       * service answers, the section keeps its plain label instead of growing a
       * control that can only ever show an empty list. `null` = not known yet.
       */
      var supported = null
      var disposed = false
      var retryTimer = null

      function service(name) {
        try { return ctx.get(name) } catch (error) { return undefined }
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

      /**
       * The tree's rows. `data-row-key` is what the host stamps on them; the row
       * CLASSES are the stable fallback, and the skin's own stylesheet already
       * keys off them.
       */
      var TREE_ROW_SELECTOR = '[data-row-key], [class*="sessionRow"], [class*="projectRow"]'

      function findTree(label) {
        var region = label.parentElement
        while (region !== null && region !== document.body) {
          var tree = region.querySelector('[role="tree"], [class*="list"]')
          if (tree !== null && tree.querySelector(TREE_ROW_SELECTOR) !== null) return tree
          region = region.parentElement
        }
        return null
      }

      function relativeTime(at) {
        if (typeof at !== 'number' || !isFinite(at)) return ''
        var minutes = Math.floor((Date.now() - at) / 60000)
        if (minutes < 1) return copyLabel('archiveJustNow', 'Just now')
        if (minutes < 60) return copyLabel('archiveMinutes', '{count} min', { count: minutes })
        var hours = Math.floor(minutes / 60)
        if (hours < 24) return copyLabel('archiveHours', '{count} h', { count: hours })
        return copyLabel('archiveDays', '{count} d', { count: Math.floor(hours / 24) })
      }

      /** Ids → `{ title, updatedAt }`, from the session list the shell already has. */
      function titlesFor() {
        var sessions = service('remote.session')
        if (sessions === undefined || sessions === null || typeof sessions.list !== 'function') return Promise.resolve({})
        return sessions.list({}).then(function (result) {
          var map = {}
          var rows = (result && result.ok === true && result.value && result.value.items) || []
          for (var i = 0; i < rows.length; i++) {
            var values = rows[i].projections && rows[i].projections.values
            map[rows[i].sessionId] = { title: values ? values.title : null, updatedAt: rows[i].updatedAt }
          }
          return map
        }).catch(function () { return {} })
      }

      function loadArchived(attempt) {
        // Archiving is a DSH feature, not a third-party one: the official client
        // service carries the registry-global archived set as `archivedSessionIds`.
        // The old `remote.workspaceRegistry` route belongs to the archive-manager
        // plugin and simply 404s without it — which used to be read as "this host
        // cannot archive" and took the segment control away on 0.1.7-rc.1.
        var official = service('workspaces')
        var officialSnapshot = null
        try {
          officialSnapshot = official !== undefined && official !== null && official.list ? official.list.getSnapshot() : null
        } catch (error) { officialSnapshot = null }
        if (officialSnapshot !== null && officialSnapshot.archivedSessionIds !== undefined) {
          supported = true
          loading = false
          items = officialSnapshot.archivedSessionIds.map(function (id) { return { id: id, title: null, at: null } })
          renderList()
          fillTitles(0)
          return
        }
        function retry() {
          if (disposed || attempt >= 4) {
            // No archive service answered: this host does not have one, so the
            // section goes back to being a plain label.
            supported = false
            items = []
            loading = false
            renderList()
            return
          }
          loading = true
          renderList()
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
        renderList()
        registry.archivedSessionMetadata().then(function (result) {
          if (!result || result.ok !== true) throw new Error('archived metadata unavailable')
          var rows = (result.value && result.value.items) || []
          supported = true
          items = rows.map(function (row) { return { id: row.sessionId, title: null, at: row.createdAt } })
          items.sort(function (a, b) { return (b.at || 0) - (a.at || 0) })
          loading = false
          renderList()
          return fillTitles(0)
        }).catch(function () { retry() })
      }

      /**
       * Titles and times ride the session list, which the shell may still be
       * loading when the registry answers — a row falls back to its id until they
       * land, and a couple of re-reads fill them in. Bounded, and abandoned the
       * moment the view is left or the fragment is torn down.
       */
      function fillTitles(attempt) {
        return titlesFor().then(function (titles) {
          if (items === null) return
          var missing = false
          for (var i = 0; i < items.length; i++) {
            var meta = titles[items[i].id]
            if (meta && meta.title) items[i].title = meta.title
            if (meta && meta.updatedAt) items[i].at = meta.updatedAt
            if (!items[i].title) missing = true
          }
          items.sort(function (a, b) { return (b.at || 0) - (a.at || 0) })
          renderList()
          if (!missing || attempt >= 4 || view !== 'archived' || disposed) return
          return new Promise(function (resolve) {
            retryTimer = setTimeout(resolve, 500)
          }).then(function () {
            retryTimer = null
            if (disposed || view !== 'archived') return
            return fillTitles(attempt + 1)
          })
        })
      }

      function openArchived(id) {
        var sessions = service('sessions')
        if (sessions !== undefined && sessions !== null && typeof sessions.open === 'function') sessions.open(id)
      }

      /**
       * The route that can delete a stored session, or null when the host offers
       * none. DSH 0.1.7 gives the browser no session-deletion API of its own: the
       * workspace controller exposes archive and unarchive, and the agent
       * protocol's session delete is where the harness delegates to an ACP agent
       * that owns the storage. The archived row therefore carries a delete button
       * only while such a provider is on the page.
       */
      function deleteProvider() {
        var registry = service('remote.workspaceRegistry')
        return registry !== undefined && registry !== null && typeof registry.deleteSession === 'function' ? registry : null
      }

      function removeArchived(id) {
        var registry = deleteProvider()
        if (registry === null) return
        registry.deleteSession(id).then(function (result) {
          if (!result || result.ok !== true) return
          if (items !== null) items = items.filter(function (row) { return row.id !== id })
          renderList()
        }).catch(function () { /* the row stays; the next read tells the truth */ })
      }

      /** Put a conversation back among the live ones; it leaves this list. */
      function restoreArchived(id) {
        var official = service('workspaces')
        if (official !== undefined && official !== null && typeof official.unarchiveSession === 'function') {
          official.unarchiveSession(id).then(function () {
            if (items !== null) items = items.filter(function (row) { return row.id !== id })
            renderList()
          }).catch(function () { /* the row stays; the next read tells the truth */ })
          return
        }
        var registry = service('remote.workspaceRegistry')
        if (registry === undefined || registry === null || typeof registry.unarchiveSession !== 'function') return
        registry.unarchiveSession(id).then(function (result) {
          if (!result || result.ok !== true) return
          if (items !== null) items = items.filter(function (row) { return row.id !== id })
          renderList()
          // The host's own tree has to be told to pick the conversation back up.
          var sessions = service('sessions')
          if (sessions !== undefined && sessions !== null && typeof sessions.refresh === 'function') sessions.refresh()
        }).catch(function () { /* the row stays; the next read tells the truth */ })
      }

      /**
       * One row action: the host's icon inside the host's tooltip when the loader
       * gives us both, and the skin's own SVG plus a native title when it does not.
       */
      function actionButton(kind, label, fallbackSvg, onClick) {
        var wrapper = modelEl('span', 'dsh-claude-archive-action')
        var className = kind === 'restore' ? 'dsh-claude-archive-restore' : 'dsh-claude-archive-delete'
        var Icon = primitives === null ? null : (kind === 'restore' ? primitives.IconUnarchiveOutlineRegular : primitives.IconTrashOutlineRegular)
        if (react !== null && reactDom !== null && primitives !== null && primitives.Tooltip && Icon) {
          var root = reactDom.createRoot(wrapper)
          actionRoots.push(root)
          root.render(react.createElement(primitives.Tooltip, { label: label, side: 'top', delayMs: 500 },
            react.createElement('button', { type: 'button', className: className, 'aria-label': label, title: label, onClick: onClick },
              react.createElement(Icon, { size: 14 }))))
          return wrapper
        }
        var button = modelEl('button', className)
        button.type = 'button'
        button.setAttribute('aria-label', label)
        button.setAttribute('title', label)
        button.innerHTML = fallbackSvg
        button.addEventListener('click', onClick)
        wrapper.appendChild(button)
        return wrapper
      }

      function buildArchivedRow(item) {
        var row = modelEl('div', 'dsh-claude-archive-row')
        row.setAttribute('role', 'button')
        row.setAttribute('tabindex', '0')
        row.setAttribute('data-session-id', item.id)
        row.appendChild(modelEl('span', 'dsh-claude-archive-title', item.title || copyLabel('archiveUntitled', 'Untitled conversation')))
        row.appendChild(modelEl('span', 'dsh-claude-archive-time', relativeTime(item.at)))
        // The host's archived rows offer an unarchive action; the skin's list
        // carries the same pair, so leaving the archived view is not the only way
        // back to a conversation.
        row.appendChild(actionButton('restore', copyLabel('archiveRestore', 'Unarchive conversation'), RESTORE_SVG, function (event) {
          event.stopPropagation()
          restoreArchived(item.id)
        }))
        if (deleteProvider() !== null) {
          row.appendChild(actionButton('delete', copyLabel('archiveDelete', 'Delete conversation'), DELETE_SVG, function (event) {
            event.stopPropagation()
            removeArchived(item.id)
          }))
        }
        row.addEventListener('click', function () { openArchived(item.id) })
        return row
      }

      function renderList() {
        if (listHost === null) return
        // The actions live in React roots; drop them before the rows go, or every
        // rebuild would leave a tree behind.
        for (var r = 0; r < actionRoots.length; r++) {
          try { actionRoots[r].unmount() } catch (error) { /* already gone */ }
        }
        actionRoots = []
        while (listHost.firstChild) listHost.removeChild(listHost.firstChild)
        if (loading) {
          listHost.appendChild(modelEl('div', 'dsh-claude-archive-status', copyLabel('archiveLoading', 'Loading…')))
          return
        }
        if (items === null) return
        if (items.length === 0) {
          listHost.appendChild(modelEl('div', 'dsh-claude-archive-status', copyLabel('archiveEmpty', 'No archived conversations')))
          return
        }
        for (var i = 0; i < items.length; i++) listHost.appendChild(buildArchivedRow(items[i]))
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
          setView(item.getAttribute('data-view'))
        })
        return group
      }

      function setView(next) {
        if (next !== 'active' && next !== 'archived') return
        if (next === view) return
        view = next
        if (view === 'archived' && items === null && !loading) loadArchived(0)
        sync()
      }

      function sync() {
        var label = findSection()
        if (label === null || label.parentElement === null) return
        var header = label.parentElement
        // Find out whether this host archives at all, once, on the first pass —
        // the answer decides whether the section keeps its label.
        if (supported === null && !loading) loadArchived(0)
        if (supported !== true) {
          if (control !== null) {
            if (control.parentElement !== null) control.parentElement.removeChild(control)
            control = null
          }
          if (listHost !== null) {
            if (listHost.parentElement !== null) listHost.parentElement.removeChild(listHost)
            listHost = null
          }
          if (markedLabel !== null) {
            markedLabel.removeAttribute(LABEL_ATTR)
            markedLabel = null
          }
          return
        }
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
            var text = copyLabel(SEGMENTS[s].key, SEGMENTS[s].fallback)
            if (item.textContent !== text) item.textContent = text
          }
          var on = id === view
          if (item.getAttribute('aria-checked') !== (on ? 'true' : 'false')) item.setAttribute('aria-checked', on ? 'true' : 'false')
        }
        var tree = findTree(label)
        if (tree === null) return
        if (markedTree !== tree) {
          if (markedTree !== null) markedTree.removeAttribute(TREE_ATTR)
          markedTree = tree
          tree.setAttribute(TREE_ATTR, '')
        }
        var host = tree.parentElement
        if (host === null) return
        if (listHost === null || listHost.parentElement !== host) {
          if (listHost !== null && listHost.parentElement !== null) listHost.parentElement.removeChild(listHost)
          listHost = modelEl('div', 'dsh-claude-archive-list')
          host.insertBefore(listHost, tree.nextSibling)
          renderList()
        }
        // The sidebar re-renders its own way: when React replaces the container
        // that held the list, the old copy can stay in the document while a new
        // one is built elsewhere. Sweep every copy but the live one, the same way
        // the stats popover sweeps its strays.
        removeStrayNodes(document, '.dsh-claude-archive-list', [listHost])
        if (host.getAttribute(VIEW_ATTR) !== view) host.setAttribute(VIEW_ATTR, view)
      }

      ui.workspace = { sync: sync }

      return function () {
        disposed = true
        for (var r = 0; r < actionRoots.length; r++) {
          try { actionRoots[r].unmount() } catch (error) { /* already gone */ }
        }
        actionRoots = []
        if (retryTimer !== null) {
          clearTimeout(retryTimer)
          retryTimer = null
        }
        if (control !== null && control.parentElement !== null) control.parentElement.removeChild(control)
        if (listHost !== null && listHost.parentElement !== null) listHost.parentElement.removeChild(listHost)
        if (markedLabel !== null) markedLabel.removeAttribute(LABEL_ATTR)
        if (markedTree !== null) markedTree.removeAttribute(TREE_ATTR)
        control = null
        listHost = null
        markedLabel = null
        markedTree = null
        delete ui.workspace
      }
    }
