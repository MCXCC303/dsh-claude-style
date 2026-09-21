    // ============================================================================
    // 厂商标识：行与分组属于哪个厂商 (Model Brand)
    // ============================================================================
    // 从 model-picker.js 抽出（体量停止线：该文件已达 737/750 行）。碎片共享一个
    // 工厂作用域，所以这里能直接看到 context/model-copy.js 的 modelCopy 与构建生成
    // 的 PROVIDER_ICONS / PROVIDER_ICON_METADATA / PROVIDER_ICON_URL_KEYS /
    // LOBE_BRAND_SVGS，不需要 import；函数声明会提升，所以本文件在 build.mjs 的
    // FRAGMENTS 里的位置不影响调用。
    //
    // modelEl 是行构建器共用的元素工厂，随它的消费者一起搬过来（原先与这些函数同
    // 在 installModelPicker 内）。

    function modelEl(tag, cls, text) {
      var el = document.createElement(tag)
      if (cls) el.className = cls
      if (text !== void 0 && text !== null) el.textContent = text
      return el
    }

    /**
     * The brand mark for a provider route, from the copy document's
     * `brands.providers`. That table is keyed by the same provider id the
     * picker receives as a group id, so this is an exact lookup.
     *
     * @param groupId - provider route id.
     * @returns the vendored mark's id, or null when this provider has none.
     */
    function normalizeIconKey(value) {
      return String(value === void 0 || value === null ? '' : value).toLowerCase().replace(/[^a-z0-9]+/g, '')
    }

    /**
     * Map one provider/model id to a vendored icon name by exact normalized
     * match. The copy document's `brands` table carries the curated
     * provider/model → icon mapping; this is only the fallback for ids the
     * table does not mention.
     */
    function providerIconName(value) {
      var raw = String(value === void 0 || value === null ? '' : value).toLowerCase()
      if (raw && PROVIDER_ICONS[raw]) return raw
      var key = normalizeIconKey(value)
      if (!key) return null
      if (PROVIDER_ICONS[key]) return key
      for (var name in PROVIDER_ICON_METADATA) {
        var meta = PROVIDER_ICON_METADATA[name]
        var candidates = [meta.name, meta.displayName]
        if (meta.keywords) candidates = candidates.concat(meta.keywords)
        for (var i = 0; i < candidates.length; i++) {
          if (normalizeIconKey(candidates[i]) === key) return name
        }
      }
      return null
    }

    function providerBrand(groupId) {
      var id = String(groupId === void 0 || groupId === null ? '' : groupId)
      var brand = modelCopy === null ? null : (modelCopy.providerBrands[id] || modelCopy.providerBrands[id.toLowerCase()])
      if (typeof brand === 'string' && brand) return brand
      return providerIconName(id)
    }

    /**
     * The brand mark for one model: the vendor that made it, not the route it
     * is resold through — an OpenRouter group listing Claude models shows
     * Anthropic marks on the rows and OpenRouter's own mark on the header.
     * Rules are ordered and anchored in the document; the first match wins,
     * and a model no rule claims falls back to its provider's mark.
     *
     * @param groupId - provider route id, the fallback's source.
     * @param modelId - catalog model id.
     * @returns the vendored mark's id, or null when neither table claims it.
     */
    function modelBrand(groupId, modelId) {
      if (modelCopy !== null) {
        var id = String(modelId === void 0 || modelId === null ? '' : modelId).toLowerCase()
        for (var i = 0; i < modelCopy.brandRules.length; i++) {
          if (modelCopy.brandRules[i].re.test(id)) return modelCopy.brandRules[i].brand
        }
      }
      return providerIconName(modelId) || providerBrand(groupId)
    }

    /**
     * The mark element for a row or a group header.
     *
     * The mark is stamped as markup rather than painted from CSS: the vendored
     * Lobe Icons marks are `fill="currentColor"`, so the surrounding text
     * colour paints them and no per-brand rule is needed. The box is always
     * created, even when nothing matched, so labels stay in one column.
     *
     * @param brand - vendored mark id, or null.
     * @returns the element to append.
     */
    function buildModelBrand(brand) {
      var el = modelEl('span', 'dsh-claude-model-brand')
      // Decorative: the row's label already names the model.
      el.setAttribute('aria-hidden', 'true')
      if (brand) {
        var providerIcon = PROVIDER_ICONS[brand]
        if (providerIcon && PROVIDER_ICON_URL_KEYS[brand]) {
          var img = document.createElement('img')
          img.src = providerIcon
          img.alt = ''
          el.appendChild(img)
        } else if (providerIcon) {
          el.innerHTML = providerIcon
        } else if (LOBE_BRAND_SVGS[brand]) {
          el.innerHTML = LOBE_BRAND_SVGS[brand]
        }
      }
      return el
    }
