    function apply(ctx) {
      var body = document.body
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

      var ui = {}
      var teardowns = []
      teardowns.push(installSelectionFocus())
      teardowns.push(installCopy(ctx, ui))
      teardowns.push(installPermissions(ctx, ui))
      teardowns.push(installModelPicker(ctx, ui))
      // TEMP(exclusion): 与构建清单的排除配对 —— 碎片不在产物里，调用也不能在。
      teardowns.push(installEffortPicker(ctx, ui))
      teardowns.push(installHeroMenu(ctx, ui)) // hero 行的目录/预设弹层：打标记给样式表用
      teardowns.push(installQuickProviders(ctx, ui)) // 设置页的「快捷供应商」多选弹层
      teardowns.push(installAccountFooter(ctx, ui))
      teardowns.push(installBanScreen(ctx, ui)) // 账户横条的封号彩蛋（账户弹层把点击交给 ui.ban）
      teardowns.push(installThemeFlip()) // 主题翻转瞬间抑制过渡，修掉「先色后样」
      teardowns.push(installWorkspaceView(ctx, ui)) // 侧栏工作区：进行中 / 已归档 分段 + 归档行删除
      teardowns.push(installViewTabs(ctx, ui)) // 对话区视图标签条：按实测把标签条放到标题那一行（放得下才放）
      var stopSettings = installSettingsSection(ctx, ui)
      teardowns.push(installScheduler(ctx, ui)) // 最后装，回调中惰性读 ui 句柄

      ctx.effect(function () {
        return function () {
          for (var i = teardowns.length - 1; i >= 0; i--) {
            try { teardowns[i]() } catch (error) { /* one teardown must not block the rest */ }
          }
          stopSettings()
          setHostContext(null)
          body.removeAttribute('data-dsh-claude-style')
          body.removeAttribute(BRAND_ATTR)
          body.removeAttribute(FOOTER_ATTR)
          body.removeAttribute(COMPOSER_ATTR)
          body.removeAttribute(WINDOW_BLUR_ATTR)
          var el = document.getElementById(STYLE_ID)
          if (el) el.remove()
        }
      }, 'dsh-claude-style: Claude Code desktop theme')
    }

    exports.apply = apply
    return module.exports
