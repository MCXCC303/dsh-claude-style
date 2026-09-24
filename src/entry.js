    function apply(ctx) {
      var body = document.body
      var ui = {}
      /** Installed features in install order, as `{ name, stop }`. */
      var installed = []
      var disposed = false

      /**
       * Undo everything this generation installed. Idempotent: the host runs it
       * on dispose (the effect below), and apply() runs it itself when the
       * scheduler cannot be installed.
       */
      function teardown() {
        if (disposed) return
        disposed = true
        for (var i = installed.length - 1; i >= 0; i--) {
          try { installed[i].stop() } catch (error) { /* one teardown must not block the rest */ }
        }
        installed = []
        setHostContext(null)
        body.removeAttribute('data-dsh-claude-style')
        body.removeAttribute(BRAND_ATTR)
        body.removeAttribute(FOOTER_ATTR)
        body.removeAttribute(COMPOSER_ATTR)
        body.removeAttribute(WINDOW_BLUR_ATTR)
        var el = document.getElementById(STYLE_ID)
        if (el) el.remove()
      }

      // Registered before anything is installed: registered last, a feature that
      // threw half-way through left the stylesheet and every listener installed
      // so far on the page with no teardown the host could ever run.
      ctx.effect(function () {
        return teardown
      }, 'dsh-claude-style: Claude Code desktop theme')

      /**
       * Switch one feature off for the rest of this generation: run its own
       * teardown, and give back the host surface it had taken over. The footer
       * takeover and the composer restyle HIDE host controls (their gates are
       * body attributes the preferences and the permissions pass write), so with
       * the feature gone they must stop hiding them. The scheduler calls this for
       * a sync that keeps failing.
       *
       * `name` may be the install name or the handle name. The scheduler retires
       * a failing sync through the handle; a handle that differs from the install
       * name (settings → settingsNav) stops the sync alone — the failure counter
       * already refuses the next pass, and the install keeps running so the
       * settings page stays. That was the shipped behavior by accident; it is an
       * explicit branch here.
       */
      function retire(name) {
        for (var i = 0; i < installed.length; i++) {
          var entry = installed[i]
          if (entry.name !== name && entry.handle !== name) continue
          // A handle-only match does not tear the install down.
          if (entry.name !== name) return
          var stop = entry.stop
          installed.splice(i, 1)
          try { stop() } catch (error) { /* it was failing already */ }
          break
        }
        if (name === 'footer') retireFooterTakeover()
        if (name === 'permissions') retireComposerRestyle()
      }
      ui.retire = retire

      /**
       * Install one feature in isolation. One that throws is reported and
       * retired, and the rest of the skin carries on without it.
       * @returns whether the feature installed.
       */
      function install(feature) {
        var name = feature.name
        var handle = feature.handle || feature.name
        try {
          var stop = feature.install()
          if (typeof stop === 'function') installed.push({ name: name, handle: handle, stop: stop })
          return true
        } catch (error) {
          reportFeatureFailure(name, error)
          retire(name)
          return false
        }
      }

      body.setAttribute('data-dsh-claude-style', '')
      setHostContext(ctx)
      // Bind the official settings form before anything reads a preference:
      // 0.1.7+ serves namespaces through `ctx.configForms`, and a host without
      // it keeps the plugin's own route. The choice is made once, here.
      adoptSettingsForm(ctx)
      loadModelCopy()
      loadUsername()
      // Preferences are read asynchronously from the host settings namespace;
      // applying the defaults first keeps every gated rule in a defined state
      // for the frames before that read settles, and is exactly the shipped
      // behaviour when it never does.
      adoptPrefs(prefs)

      var old = document.getElementById(STYLE_ID)
      if (old && old.parentElement) old.parentElement.removeChild(old)

      var style = document.createElement('style')
      style.id = STYLE_ID
      style.dataset.skinChrome = 'dsh-claude-style-style'
      style.textContent = CSS
      document.head.appendChild(style)

      /**
       * Every feature the skin installs, in install order. `name` is the label
       * the failure report and the teardown use; `handle` is the name it
       * registers on `ui` when the two differ (settings → settingsNav). The
       * scheduler's pass order is this order filtered to handles that exist and
       * have a `sync` — the list the shipped PASS_FEATURES spelled out by hand.
       */
      var FEATURES = [
        { name: 'selection', install: installSelectionFocus },
        { name: 'copy', install: function () { return installCopy(ctx, ui) } },
        { name: 'permissions', install: function () { return installPermissions(ctx, ui) } },
        { name: 'model', install: function () { return installModelPicker(ctx, ui) } },
        { name: 'effort', install: function () { return installEffortPicker(ctx, ui) } },
        { name: 'heroMenu', install: function () { return installHeroMenu(ctx, ui) } }, // hero 行的目录/预设弹层：打标记给样式表用
        { name: 'quickProviders', install: function () { return installQuickProviders(ctx, ui) } }, // 设置页的「快捷供应商」多选弹层
        { name: 'footer', install: function () { return installAccountFooter(ctx, ui) } },
        { name: 'ban', install: function () { return installBanScreen(ctx, ui) } }, // 账户横条的封号彩蛋（账户弹层把点击交给 ui.ban）
        { name: 'themeFlip', install: installThemeFlip }, // 主题翻转瞬间抑制过渡，修掉「先色后样」
        { name: 'workspace', install: function () { return installWorkspaceView(ctx, ui) } }, // 侧栏工作区：进行中 / 已归档 分段 + 归档行删除
        { name: 'viewTabs', install: function () { return installViewTabs(ctx, ui) } }, // 对话区视图标签条：按实测把标签条放到标题那一行（放得下才放）
        { name: 'settings', handle: 'settingsNav', install: function () { return installSettingsSection(ctx, ui) } }
      ]

      // The scheduler's two ordered lists: `passFeatures` are the handles a pass
      // syncs (handle exists and has a `sync`), `hookFeatures` every installed
      // handle, for the event hooks that are not per-pass.
      var passFeatures = []
      var hookFeatures = []
      for (var fi = 0; fi < FEATURES.length; fi++) {
        var feature = FEATURES[fi]
        if (!install(feature)) continue
        var handleName = feature.handle || feature.name
        var handle = ui[handleName]
        if (!handle) continue
        hookFeatures.push(handleName)
        if (typeof handle.sync === 'function') passFeatures.push(handleName)
      }

      // Last: its passes read the `ui` handles lazily. Without it nothing syncs,
      // and a live stylesheet over overrides that never run is worse than no
      // skin at all — so if it cannot install, the whole skin rolls back.
      if (!install({ name: 'scheduler', install: function () { return installScheduler(ctx, ui, passFeatures, hookFeatures) } })) teardown()
    }

    exports.apply = apply
    return module.exports
