    // ============================================================================
    // 插件入口与导出 (Plugin Entry & Export)
    // ============================================================================
    function apply(ctx) {
      var body = document.body
      body.setAttribute('data-dsh-claude-style', '')
      setHostContext(ctx)
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
      teardowns.push(installCopy(ctx, ui))
      teardowns.push(installPermissions(ctx, ui))
      teardowns.push(installModelPicker(ctx, ui))
      teardowns.push(installAccountFooter(ctx, ui))
      teardowns.push(installScheduler(ctx, ui)) // 最后装，回调中惰性读 ui 句柄
      var stopSettings = installSettingsSection(ctx)

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
          var el = document.getElementById(STYLE_ID)
          if (el) el.remove()
        }
      }, 'dsh-claude-style: Claude Code desktop theme')
    }

    exports.apply = apply
    return module.exports
