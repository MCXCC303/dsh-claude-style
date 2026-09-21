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

    /**
     * Vendors whose label draws a wordmark: brand id → the word the mark stands
     * in for. One SVG per brand id under src/assets/icons/wordmarks/, inlined by
     * the build into WORDMARK_SVGS.
     *
     * DeepSeek's is vendored even though the harness draws one of its own: the
     * host's `BrandWordmark` is a lockup rather than a bare wordmark — with
     * `includeMark: false` it still paints a rounded "HARNESS" badge after the
     * lettering — so a row that wants the vendor's name alone cannot use it as it
     * stands.
     */
    var MODEL_WORDMARKS = { kimi: 'Kimi', deepseek: 'DeepSeek', grok: 'Grok' }

    /**
     * The same table as an array, built once.
     *
     * The scan below runs per row per render, and the obvious shape — `for...in`
     * over the object with a dynamic keyed lookup per entry — measured about
     * three times the cost of everything else in the label build combined. An
     * indexed walk over a prepared array, with the lowercased word stored beside
     * the display one, keeps the per-row work to a compare and an `indexOf`.
     */
    var MODEL_WORDMARK_LIST = (function () {
      var out = []
      for (var id in MODEL_WORDMARKS) {
        if (!WORDMARK_SVGS[id]) continue
        out.push({ id: id, word: MODEL_WORDMARKS[id], key: MODEL_WORDMARKS[id].toLowerCase() })
      }
      return out
    })()

    /**
     * The wordmark a label should draw, if any.
     *
     * Matched by brand id — the provider route, or the model's own rule, claimed
     * the vendor — or by the word itself. That second path matters: a reseller
     * lists a Kimi model under its own provider, so the row's brand resolves
     * elsewhere while the catalog still spells the vendor in the name.
     *
     * @param brand - resolved brand id, or null.
     * @param name - the catalog's display name (always a string; the caller guards).
     * @returns `{ id, word }`, or null when no wordmark applies.
     */
    function modelWordmark(brand, name) {
      var lower = name.toLowerCase()
      for (var i = 0; i < MODEL_WORDMARK_LIST.length; i++) {
        var mark = MODEL_WORDMARK_LIST[i]
        if (brand === mark.id || lower.indexOf(mark.key) !== -1) return mark
      }
      return null
    }

    /**
     * One row's label.
     *
     * A vendor wordmark replaces the word it stands for, so the label keeps
     * naming the vendor — in the vendor's own hand — while the row already wears
     * the vendor's mark. A name that never spells the vendor (Kimi's own catalog
     * calls the model "K3") leads with the mark instead, and the separator the
     * word carried leaves with it, so the mark lands where the word was.
     *
     * The mark is decoration in the DOM, so the word it stands in for stays in
     * the accessibility tree as hidden text: a screen reader has to hear
     * "Kimi K3", not "K3", and the label is what names the row.
     *
     * @param name - the catalog's display name.
     * @param brand - resolved brand id, or null.
     * @returns the label element.
     */
    function buildModelName(name, brand) {
      var el = modelEl('span', 'dsh-claude-model-name')
      var text = typeof name === 'string' ? name : ''
      var mark = modelWordmark(brand, text)
      if (mark === null) {
        el.textContent = text
        return el
      }
      var at = text.toLowerCase().indexOf(mark.word.toLowerCase())
      // The word's own separator goes with the word: the mark's margin stands in
      // for it, so the label does not end up with two gaps.
      var tail = at === -1 ? text : text.slice(at + mark.word.length).replace(/^[\s\-–—]+/, '')
      var box = modelEl('span', 'dsh-claude-model-wordmark')
      // Decorative: the hidden word below carries the name for assistive tech.
      box.setAttribute('aria-hidden', 'true')
      box.innerHTML = WORDMARK_SVGS[mark.id]
      if (at > 0) el.appendChild(document.createTextNode(text.slice(0, at)))
      el.appendChild(modelEl('span', 'dsh-claude-model-wordmark-alt', tail ? mark.word + ' ' : mark.word))
      el.appendChild(box)
      el.appendChild(document.createTextNode(tail))
      return el
    }
