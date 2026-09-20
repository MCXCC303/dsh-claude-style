# dsh-claude-style 架构重构规划

> 交付给开发 Agent 的执行文档。目标：在不改变任何运行时行为的前提下，把
> 现有"Zone 级"分片细化为"特性级"分片，消除单文件冗长和闭包隐式耦合。
>
> **总原则：阶段 1–3 必须做到构建产物 lib/client.js 逐字节不变；阶段 4
> 只允许结构变化，不允许行为变化。**

## 1. 背景与硬约束（先读）

- 运行时约束：DSH 模块加载器**没有相对 require、没有资产 URL**，所以
  `scripts/build.mjs` 把 `src/` 碎片**按固定顺序逐字拼接**进一个工厂函数
  作用域，生成单文件 `lib/client.js`。**这个架构保留**，不引入
  esbuild/rollup 等打包器，不引入任何新依赖。
- 碎片规则（现状即如此，重构后继续遵守，并在 build 里加守门）：
  - 所有碎片共享一个工厂作用域，**禁止使用 import/export**；
  - 每个碎片保持 **4 空格基础缩进**；
  - 风格保持 ES5（var、function 声明），与现状一致；
  - 跨碎片引用靠共享作用域：function 声明会提升，且运行时调用都发生在
    apply() 之后，因此顺序安全；但清单顺序仍须按 §6 固定。
- 宿主端 `lib/index.js`、文案数据 `src/model-descriptions.json`、
  `skin.json`、`cordis.patch.yml` **不在本次重构范围内**。

## 2. 现状问题（重构动机，仅供理解）

| 文件 | 行数 | 问题 |
|---|---|---|
| `src/overrides.js` | 1928 | 一个 `installOverrides(ctx)` 函数塞了 5 个特性；Zone 5 调度器直接读各特性的闭包变量（`modelBtn`/`modelPop`/`accountPopover`/`modelBodySig` 等）；`var MARGIN = 8` 在同一作用域重复声明（986、1223 行）；章节编号已乱（4.4 排在 4.3 前） |
| `src/context.js` | 357 | 混合 4 种职责：宿主访问器、prefs store、model copy store、i18n |
| `src/styles/components.css` | 742 | 权限段、账户弹层、模型选择器、页脚接管、第三方修复、设置页 6 块混排 |
| `src/styles/composer.css` | 710 | hero / 输入卡片 / 会话内单行 composer 3 块混排 |

## 3. 目标目录结构

```
src/
  constants.js                  # 不变（原 Zone 1）
  context/
    host.js                     # 宿主访问器
    prefs.js                    # 偏好 store
    model-copy.js               # 文案文档 store
    i18n.js                     # 本地化取值
  overrides/
    popover-utils.js            # 锚定定位 + 悬停开闭（新提取的共享帮助器）
    copy.js                     # 原 4.1 文案改写
    permissions.js              # 原 4.2 权限段控件 + 会话内弹层
    model-picker.js             # 原 4.4 模型选择器
    account-footer.js           # 原 4.3 账户页脚 + 弹层
    scheduler.js                # 原 Zone 5 调度与生命周期
  settings.js                   # 不变（设置页）
  entry.js                      # 重写为编排器（见 §5）
  styles/
    tokens.css                  # 不变
    typography.css              # 不变
    chrome.css                  # 不变
    composer/
      hero.css                  # composer.css 第 1–45 行（hero 品牌区，gate 标记之前）
      card.css                  # composer.css 第 46–246 行（含 @composer-gate 标记）
      inline.css                # composer.css 第 247 行至末尾
    sidebar.css                 # 不变
    components/
      permissions.css           # components.css 第 1–136 行
      account-footer.css        # components.css 第 137–261 行
      model-picker.css          # components.css 第 262–501 行
      footer-takeover.css       # components.css 第 502–648 行
      third-party.css           # components.css 第 649–683 行（agy-link 修复）
      settings.css              # components.css 第 684 行至末尾
```

**CSS 切分必须严格按上表边界整块移动**，保证拼接后的最终 CSS 与现状
逐字节一致（仅文件衔接处的空行可差）。行号以切分当时的文件为准，动手前
先以各 `/* ---------- ... ---------- */` 区块注释复核边界。

## 4. 逐文件映射（JS）

### context/（来自 src/context.js，纯移动、不改逻辑）

| 新文件 | 移入的函数/变量 |
|---|---|
| `context/host.js` | `findAccessTrigger`、`currentSessionId`、`currentSession`、`currentPreset`、`getUsername`、`hostCtx`、`setHostContext` |
| `context/prefs.js` | `prefs`、`prefsRevision`、`prefsAvailable`、`prefsListeners`、`readPrefs`、`subscribePrefs`、`adoptPrefs`、`loadPrefs`、`normalizePrefs`、`savePrefs`、`applyBrand` |
| `context/model-copy.js` | `modelCopy`/`modelCopyRequested`/`modelCopyListeners`、`onModelCopyLoaded`、`loadModelCopy`、`indexModelCopy`、`normalizeModelId` |
| `context/i18n.js` | `activeLocale`、`localized`、`copyLabel`、`settingsCopy` |

依赖方向：i18n → model-copy → constants；prefs → constants。清单顺序即此序。

### overrides/（来自 src/overrides.js，阶段 4，含结构重构）

| 新文件 | 移入内容 |
|---|---|
| `popover-utils.js` | 新提取：`POPOVER_MARGIN = 8`（替换两处重复的 `var MARGIN`）；`positionAnchoredPopover(trigger, pop, opts)` 统一 `positionModelPopovers`/`positionAccountPopover` 的锚定几何；`createHoverIntent(open, close, delay)` 统一 `scheduleCloseModel`/`cancelCloseModel` 与 `scheduleClosePopover`/`cancelClosePopover` 两套定时 |
| `copy.js` | `HINT_SOURCES`、`rewriteHeadline`、`isHeroView`、`isComposerActive`、`rewriteHint`、`pickRandomSpinnerVerb`、`rewriteTurnStatus` |
| `permissions.js` | `buildSegments`、`closePermMenu`、`buildPermTriggerAndPopover`、`openPerm`、`updatePermState`、`submitPreset`、`openShippedGate`、`seek`、`pick`、`syncAttachmentState`、`mergeStatsIntoRow`、`syncSegments`、`syncChatTabComposer` |
| `model-picker.js` | `exactModelCopy`、`familyModelCopy`、`tierModelCopy`、`cancelCloseModel`、`scheduleCloseModel`、`closeModelPopovers`、`openModelPopover`、`openModelSub`、`currentModelSessionId`、`dropModelSubscription`、`modelDirectory`、`modelSnapshot`、`modelCurrent`、`modelEffort`、`modelDescription`、`modelEl`、`MODEL_CHECK_SVG`/`MODEL_CHEVRON_SVG`/`MODEL_CHEVRON_DOWN_SVG`、`buildModelOption`、`buildModelCell`、`pickModel`、`pickEffort`、`renderModelBody`、`renderModelSub`、`positionModelPopovers`、`ensureModelChrome`、`syncModelControl`，以及原 565–579 行的特性状态变量 |
| `account-footer.js` | `openPopover`、`closePopover`、`togglePopover`、`scheduleClosePopover`、`cancelClosePopover`、`positionAccountPopover`、`syncPopoverItems`、`syncFooterActionVisibility`、`footerEntriesOf`、`markFooterHiddenBranches`、`removeActionMirror`、`removeEmbedMirror`、`entryIsActionLike`、`textExcludingOverlays`、`syncEmbedMirror`、`INTERACTIVE_SELECTOR`、`resolveEmbedActivator`、`hasOverlayAncestor`、`findFooterTrigger`、`dropAccountFooter`、`syncAccountFooter`，以及原 1138–1139 行的特性状态变量 |
| `scheduler.js` | `onGlobalPointerDown`、`onGlobalKeyDown`、`onCardPointerDown`、`onFixedPopoverViewportChange`、`onLocaleChange`、`schedule`、MutationObserver/ResizeObserver 装配、问候语定时器、全部退订清理 |

## 5. 核心设计变更：ui 句柄注册表（阶段 4 的灵魂）

现状 Zone 5 直接读各特性的闭包变量。重构后每个特性是一个顶层安装函数，
**入参 (ctx, ui)，返回 teardown 函数**，并把自己的对外句柄挂到 ui 上。
调度器只认识句柄，不认识任何特性内部变量。

### 句柄契约（签名固定，不得增减）

```js
ui.copy = {
  sync: ...,          // rewriteHeadline + rewriteHint + rewriteTurnStatus
  syncGreeting: ...,  // 仅 rewriteHeadline（给每分钟滚动的问候语定时器）
}
ui.permissions = {
  sync: ...,          // syncAttachmentState + mergeStatsIntoRow + syncSegments + syncChatTabComposer
  closeMenu: ...,     // closePermMenu
}
ui.model = {
  sync: ...,            // syncModelControl
  close: ...,           // closeModelPopovers
  owns: ...,            // (target) => target 是否落在 modelBtn/modelPop/modelSubPop 任一之内
  reposition: ...,      // positionModelPopovers
  invalidateCopy: ...,  // modelBodySig = '' ; modelSubSig = '' （locale/prefs/copy 变化时）
  teardown: ...,        // cancelCloseModel + dropModelSubscription + 状态归零（现 teardown 中模型相关段）
}
ui.footer = {
  sync: ...,          // syncAccountFooter
  close: ...,         // closePopover
  owns: ...,          // (target) => target 是否落在 accountBtn/accountPopover 内
  isOpen: ...,        // () => accountPopover 存在且 data-open === 'true'
  reposition: ...,    // positionAccountPopover
}
```

### entry.js 重写为编排器

`apply(ctx)` 内的装配顺序固定为：

```js
var ui = {}
var teardowns = []
teardowns.push(installCopy(ctx, ui))
teardowns.push(installPermissions(ctx, ui))
teardowns.push(installModelPicker(ctx, ui))
teardowns.push(installAccountFooter(ctx, ui))
teardowns.push(installScheduler(ctx, ui))   // 最后装，回调中惰性读 ui 句柄
var stopSettings = installSettingsSection(ctx)
// ctx.effect 清理：倒序跑 teardowns + stopSettings + 现有 body 属性清理
```

`installOverrides` 这个名字随 Zone 概念一起废弃。

### scheduler.js 的职责边界

- 拥有：RAF 合并的 `schedule()`（体内改为调用 `ui.copy.sync()`、
  `ui.permissions.sync()`、`ui.model.sync()`、`ui.footer.sync()`，以及
  `ui.footer.isOpen() && ui.footer.reposition()`）、MutationObserver、
  composer 卡片的 ResizeObserver、问候语 setInterval（调
  `ui.copy.syncGreeting()`）、全局 pointerdown/keydown/resize/scroll
  监听、locale/prefs/modelCopy 三个订阅（回调统一为：先
  `ui.model.invalidateCopy()` 再 `schedule()`）。
- 全局事件中的特性判断一律走句柄：`onGlobalPointerDown` 用
  `ui.model.owns(target)` / `ui.footer.owns(target)`；Escape 用三个
  close 句柄。
- Enter 发送、Ctrl+, 打开设置、卡片点击聚焦这三个全局键鼠逻辑**留在
  scheduler**（它们是全局行为，不属于任何单一特性）。
- 注意现状 `loadPrefs()` 被 Zone 5 和 `installSettingsSection` 各调一次：
  重构后由 scheduler 统一调用，`installSettingsSection` 里的那次删除。
  （`loadModelCopy` 有 `modelCopyRequested` 幂等保护，两处保留无妨；
  `loadPrefs` 没有幂等保护，必须只留一处。）

## 6. build.mjs 改造（阶段 1）

1. 顶部新增两个有序清单，替换 `main()` 里硬编码的 `fragment(...)` 调用
   和现有 `STYLE_FILES`：

```js
const FRAGMENTS = [
  'constants.js',
  'context/host.js',
  'context/prefs.js',
  'context/model-copy.js',
  'context/i18n.js',
  'overrides/popover-utils.js',
  'overrides/copy.js',
  'overrides/permissions.js',
  'overrides/model-picker.js',
  'overrides/account-footer.js',
  'overrides/scheduler.js',
  'settings.js',
  'entry.js',
]

// gate: true 表示该样式表内含 /* @composer-gate */ 标记，走 gateComposerScope
const STYLE_FILES = [
  { file: 'tokens.css' },
  { file: 'typography.css' },
  { file: 'chrome.css' },
  { file: 'composer/hero.css' },
  { file: 'composer/card.css', gate: true },
  { file: 'composer/inline.css', gate: true },
  { file: 'sidebar.css' },
  { file: 'components/permissions.css' },
  { file: 'components/account-footer.css' },
  { file: 'components/model-picker.css' },
  { file: 'components/footer-takeover.css' },
  { file: 'components/third-party.css' },
  { file: 'components/settings.css' },
]
```

   注意：`@composer-gate` 标记**只保留在 composer/card.css**（它在原文件
   第 47 行，正好落在 card 段首）；hero 段在标记之前、不需要门；inline 段
   原本全在标记之后——切分时要为 inline.css 重新处理：把整段视为已盖门
   内容，做法是**给 inline.css 文件首行补一个 @composer-gate 标记并设
   gate: true**（这样 hero/card/inline 三个文件全部 gate: true，清单更
   一致，守门逻辑不变）。拼接顺序必须严格等于上表——这是产物逐字节不变
   的前提。

2. `HEADER` 里的目录注释改为从两个清单自动生成，杜绝文档漂移。
3. 新增碎片守门（任一违规即构建失败）：
   - 碎片匹配 `/^[ \t]*(import|export)[ \t]/m` → 报错并指出文件；
   - 碎片的非空行若不以前 4 个空格开头（注释续行 ` * ` 也满足，因为它
     以空格开头）→ 报错并指出文件与行号。
4. 构建日志改为报告碎片数与样式表数（从清单取长度）。

## 7. 分阶段执行与验收

### 阶段 0：基线
- 跑 `npm run build`，把 `lib/client.js` 复制为 `.debug/baseline-client.js`。

### 阶段 1：build.mjs 清单化 + 守门（不改任何 src 内容）
- 清单先填**现有**文件名（constants.js、context.js、overrides.js、
  settings.js、entry.js 与现有 6 个 css）。
- 验收：`npm run build` 后 `lib/client.js` 与基线**逐字节相同**
  （`git diff --no-index` 为空）。

### 阶段 2：context.js 拆分（纯移动）
- 按 §4 表移动，不改任何函数体。
- 验收：构建产物与基线逐字节相同。

### 阶段 3：CSS 拆分（纯移动）
- 按 §3 边界整块移动，更新 STYLE_FILES。
- 验收：构建产物与基线逐字节相同；`gateComposerScope` 的"未盖门即报错"
  检查仍然生效（可故意删一条规则的门验证报错，再还原）。

### 阶段 4：overrides.js 拆分 + ui 注册表（唯一动结构的阶段）
- 先做纯移动把 5 个特性切成文件（此时调度器仍在原位置、仍读闭包变量，
  产物可保持逐字节一致），再做 ui 句柄化与 entry 编排器化。
- `popover-utils.js` 的 `positionAnchoredPopover`/`createHoverIntent`
  提取放本阶段；提取时必须保持两处弹层现有定位结果像素级一致
  （先抽象、逐参数对照，再替换调用点）。
- 验收：
  1. `npm run build` 通过（vm 语法门）；
  2. 无 `MARGIN` 重复声明；scheduler.js 中 grep 不到
     `modelBtn`/`modelPop`/`accountPopover`/`modelBodySig` 等特性内部
     变量；
  3. 人工冒烟清单（§8）全过。

### 阶段 5（可选，单独提交）：文案数据外移
- `SPINNER_VERBS`、`PERMISSION_SEGMENTS`/`PERMISSION_OPTIONS`、
  `HINT_SOURCES` 迁入 `src/copy.json`，由 build.mjs 读取、校验后以内联
  var 声明注入 bundle（复用现有 JSON 校验思路）。**不做也不影响验收。**

## 8. 人工冒烟清单（阶段 4 验收用）

在 DSH web GUI 中逐项验证（与重构前行为完全一致才算过）：

1. 新会话页：时段问候语出现且每分钟翻转不错位；composer hint 被改写；
2. 发送一条消息：思考中显示 Claude spinner 动词且同一轮内稳定；
3. 权限段控件：Read/Edit/Auto 三态切换；会话内弹层可开可关；
   Auto 触发宿主的风险确认；
4. 模型选择器：两级弹层开/关、悬停桥、选模型、选推理档位、描述行跟随
   界面语言；Escape 与点击外部均关闭；
5. 账户页脚：悬停/点击开弹层（受 autoPopover 偏好控制）、定位不漂移、
   折叠 rail 模式正常；
6. Ctrl+, 打开设置；设置页 4 个控件（品牌/折叠页脚/悬停弹层/输入区
   范围）切换后刷新仍保持；
7. Enter 发送、Shift+Enter 换行、IME 组合输入不被截获；
8. 切换界面语言后模型选择器文案即时跟随；
9. 重载插件（或刷新页面）后无残留 DOM/监听，控制台无报错。

## 9. 收尾

- grep 全仓 "Zone" 字样的注释与文档（含 `docs/STYLE.md`、README、
  build.mjs 头注释），按新结构改写；
- 变更写入 `CHANGELOG.md`；
- 完成后每个 src 文件应 ≤ 约 650 行，最大的应是
  `overrides/model-picker.js` 与 `overrides/account-footer.js`（各约
  550–600 行）；若超过，再评估二次拆分，不在本次范围。

## 10. 非目标（明确不做）

- 不改任何视觉样式与交互行为；
- 不引入打包器/依赖/TypeScript；
- 不动 `lib/index.js`（宿主端）、`src/model-descriptions.json`；
- 不动 `src/settings.js` 的组件实现（仅它在清单中的位置不变）。
