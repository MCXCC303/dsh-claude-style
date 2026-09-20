    // ============================================================================
    // Zone 6: 插件入口与导出 (Plugin Entry & Export)
    // ============================================================================
    function apply(ctx) {
      var body = document.body
      body.setAttribute('data-dsh-claude-style', '')
      applyBrand(readStoredBrand())

      var old = document.getElementById(STYLE_ID)
      if (old && old.parentElement) old.parentElement.removeChild(old)

      var style = document.createElement('style')
      style.id = STYLE_ID
      style.dataset.skinChrome = 'dsh-claude-style-style'
      style.textContent = CSS
      document.head.appendChild(style)

      var stopOverrides = installOverrides(ctx)
      var stopSettings = installSettingsSection(ctx)

      ctx.effect(function () {
        return function () {
          stopOverrides()
          stopSettings()
          body.removeAttribute('data-dsh-claude-style')
          body.removeAttribute(BRAND_ATTR)
          var el = document.getElementById(STYLE_ID)
          if (el) el.remove()
        }
      }, 'dsh-claude-style: Claude Code Desktop theme')
    }

    exports.apply = apply
    return module.exports
