    // ============================================================================
    // 厂商标识：行与分组属于哪个厂商 (Model Brand)
    // ============================================================================
    // 从 model-picker.js 抽出（体量停止线：该文件已达 737/750 行）。碎片共享一个
    // 工厂作用域，所以这里能直接看到 context/model-copy.js 的 modelCopy 与构建生成
    // 的 COMBINE_SVGS / COMBINE_WORDS，
    // 不需要 import；函数声明会提升，所以本文件在 build.mjs 的 FRAGMENTS 里的位置
    // 不影响调用。
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
     * The brand mark for one model: the vendor that made it, not the route it is
     * resold through — an OpenRouter group listing Claude models shows Anthropic
     * marks on the rows, never OpenRouter's own.
     *
     * Rules are ordered and anchored in the document; the first match wins. There is
     * deliberately **no fallback to the provider route**: a model no rule claims
     * draws no lockup at all. The fallback used to put the reseller's lockup on a
     * model it did not make (an OpenCode row wearing OpenCode's mark beside
     * "LongCat-2.0"), which reads as a wrong answer rather than a missing one.
     *
     * @param groupId - provider route id (unused; kept for call-site symmetry).
     * @param modelId - catalog model id.
     * @returns the vendored lockup's id, or null when no rule claims it.
     */
    function modelBrand(groupId, modelId) {
      if (modelCopy !== null) {
        var id = String(modelId === void 0 || modelId === null ? '' : modelId).toLowerCase()
        for (var i = 0; i < modelCopy.brandRules.length; i++) {
          if (modelCopy.brandRules[i].re.test(id)) return modelCopy.brandRules[i].brand
        }
      }
      return null
    }

    /**
     * The vendor lockup a label should draw, if any.
     *
     * Every vendor with a vendored lockup has one, and the lockup carries both the
     * mark and the vendor's word as one piece of art — so it replaces that word
     * when the catalog spells it in the name, and leads the label when it does not
     * (Kimi's own catalog calls the model "K3").
     *
     * @param brand - resolved brand id, or null.
     * @param name - the catalog's display name (always a string; the caller guards).
     * @returns `{ id, word, svg, at }` — `at` is the word's index in the name, or -1.
     */
    function modelCombine(brand, name) {
      if (brand === null || !COMBINE_SVGS[brand]) return null
      var word = COMBINE_WORDS[brand]
      var at = word === void 0 ? -1 : name.toLowerCase().indexOf(word.toLowerCase())
      return { id: brand, word: word, svg: COMBINE_SVGS[brand], at: at }
    }

    /**
     * One row's label, with the vendor's lockup standing in for its name.
     *
     * The lockup is decoration in the DOM — it *is* the vendor's name, drawn as art
     * — so the word it stands in for stays in the accessibility tree as hidden
     * text, and the label keeps naming the vendor for assistive tech.
     *
     * @param name - the catalog's display name.
     * @param brand - resolved brand id, or null.
     * @returns the label element.
     */
    function buildModelLabel(name, brand) {
      var el = modelEl('span', 'dsh-claude-model-name')
      var text = typeof name === 'string' ? name : ''
      var mark = modelCombine(brand, text)
      if (mark === null) {
        el.textContent = text
        return el
      }
      var box = modelEl('span', 'dsh-claude-model-combine')
      box.setAttribute('aria-hidden', 'true')
      box.innerHTML = mark.svg
      var head = mark.at === -1 ? '' : text.slice(0, mark.at)
      // The word's own separator goes with the word: the lockup's margin stands in
      // for it, so the label does not end up with two gaps.
      var tail = mark.at === -1 ? text : text.slice(mark.at + mark.word.length).replace(/^[\s\-–—]+/, '')
      if (head) el.appendChild(document.createTextNode(head))
      el.appendChild(box)
      el.appendChild(document.createTextNode(tail))
      el.appendChild(modelEl('span', 'dsh-claude-model-combine-alt', tail ? mark.word + ' ' : mark.word))
      return el
    }
