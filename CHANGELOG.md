# Changelog

All notable changes to `dsh-claude-style` are documented here, newest first.

## [Unreleased]

[中文](#cn-unreleased) | [English](#en-unreleased)

<h3 id="cn-unreleased">问题修复</h3>

- 修复 **关闭插件或关掉「折叠侧栏设置区」后，桌面端自带的账号区没有还原**：交出页脚时摘掉皮肤打在宿主账号行上的标记，宿主行恢复自带的外观与点击。

### 移除

- **移除插件自带的 Ctrl+, 快捷键提示**：账号抽屉的设置行保留（点击仍可打开设置），但不再显示快捷键提示。

<h3 id="en-unreleased">Bug Fixes</h3>

- Fix **the desktop's own account area not coming back after the plugin is disabled or "Collapse the sidebar settings area" is turned off**: handing the footer back drops the skin's marker from the host's account row, which returns to its shipped look and click behavior.

### Removals

- **Remove the plugin's Ctrl+, shortcut hint**: the drawer's settings row stays (a click still opens settings) but no longer shows the hint.

## [0.5.2] - 2026-09-23

[中文](#cn-0.5.2) | [English](#en-0.5.2)

<h3 id="cn-0.5.2">新增功能</h3>

- **冒烟测试新增 `desktop` 桌面端页脚用例**：覆盖 0.1.7 桌面端页脚接管、抽屉镜像与账号资料首帧读取。

### 问题修复

- 修复 **切到插件页后档位触发器浮在页面上**：座位消失时隐藏触发器并归还预留边距。
- 修复 **窗口宽度变化时档位触发器慢半拍**：随 resize 与卡片尺寸变化和 CSS 同帧重定位。
- 修复 **按住滑块拖出卡片边界时卡片提前收起**：悬停关闭改看物理按住，松开按键才收起。
- 修复 **模型名、档位与后续控件间距忽大忽小**：统一到该行自身的 12px 节奏。
- 修复 **桌面端 Ctrl+, 弹出账号菜单而非设置**：快捷键与抽屉设置行共用入口，改为驱动宿主菜单。
- 修复 **账号抽屉的登出图标跑到左上角**：图标位自己作定位参照，按宿主尺寸绘制。
- 修复 **登录时账号资料请求被中止**：等服务就绪并订阅账号状态流，只在首帧、登录与登出读取。
- 修复 **桌面端从抽屉打不开设置**：设置行只认宿主设置按钮，桌面端让位给镜像的宿主设置行。
- 修复 **宿主账号行叠在皮肤账号行上**：选择器穿过插槽锚点整行隐藏。

### 其他变更

- **内部结构拆分，行为无变化**：超限碎片按 D13 约定拆开，调度器改由 `entry.js` 的 FEATURES 表统一安装与 pass 序。

<h3 id="en-0.5.2">New Features</h3>

- **New `desktop` footer smoke-test case**: covers 0.1.7 desktop footer takeover, drawer mirroring and the first account-profile read.

### Bug Fixes

- Fix **the effort trigger lingering on the plugins page**: hide it with its seat and give the reserved margin back.
- Fix **the effort trigger lagging on window resize**: reposition it in the same frame as CSS on resize and card-size changes.
- Fix **the card closing while the slider is still held**: hover-close now tracks the physical press and closes only on release.
- Fix **uneven spacing between model, effort and later controls**: unify them on the row's own 12px rhythm.
- Fix **Ctrl+, opening the account menu instead of settings on desktop**: the shortcut and drawer row now share one entry that drives the host menu.
- Fix **the sign-out icon landing in the drawer's top-left corner**: the icon slot is now the positioning context and draws at the host's size.
- Fix **the account profile request being aborted at sign-in**: wait for the service and subscribe to the account state stream, reading only on first frame, sign-in and sign-out.
- Fix **settings not opening from the drawer on desktop**: the settings row accepts only the host settings button and yields to the mirrored host row on desktop.
- Fix **the host account row stacking over the skin's row**: the selector now reaches through the slot anchor and hides the whole row.

### Chores

- **Internal restructuring, no behavior change**: oversized fragments were split per D13, and the scheduler now installs and orders passes from a FEATURES table in `entry.js`.

**Full Changelog**: [v0.5.1...v0.5.2](https://github.com/Nwflower/dsh-claude-style/compare/v0.5.1...v0.5.2)

## [0.5.1] - 2026-09-23

[中文](#cn-0.5.1) | [English](#en-0.5.1)

<h3 id="cn-0.5.1">新增功能</h3>

- **冒烟测试 `npm run smoke`**：零依赖检查宿主路由栅栏与浏览器半边的启动、空闲、teardown 不变量。
- **账号行显示真实头像与昵称**：桌面端登录后取官方资料，正圆头像与昵称以 60 秒轮询保持新鲜。
- **账号抽屉接管宿主账号菜单**：动态镜像宿主菜单条目并直连官方行为。

### 体验优化

- **档位名换档改成交换动画**：旧名向上模糊淡出、新名自下模糊淡入，拖动中也逐档滚动。
- **档位两端文案随语境本地化**：中文显示「更快 / 更强」，英文仍是 `Faster` / `Smarter`。
- **最高档的点阵动画改为纯哈希粒子**：无排序方向，羽流形状由逐块静态透明度承担。
- **座位里模型与档位两枚触发器靠拢**：名字与档位之间只剩 4px。
- **推理等级拆成独立触发器与弹层**：新碎片 `effort-picker.js` 只向 `ui.model` 要座位、档位与提交。
- **推条手感三处打磨**：圆角收小、按住放大 10%、档位点加阻尼。
- **推理推条换脸成 Claude Desktop 同款**：填充段 + 档位刻点 + 胶囊旋钮，最高档触发点阵动画。
- **输入框底部阴影改由座位自绘横条与渐变**：座位高度即横条高度，不再逐态重写卡片阴影。
- **模型介绍文案整体校订一轮**：修中英语义冲突与生硬措辞，统一单位与术语。

### 问题修复

- 修复 **0.1.7 设置页选项能显示但存不进去**：命名空间改从 `configForms` 已服务的名单挑选，失败回落自建路由。
- 修复 **斜杠命令 / @ 提及菜单打开时回车直接发送**：删除皮肤对回车的拦截，交给宿主处理。
- 修复 **关掉插件或热重载后皮肤又画了回来**：teardown 取消排队中的那一帧，之后的 `schedule()` 一律不生效。
- 修复 **一个特性出错导致整张皮半挂**：teardown 最先注册，每个特性单独安装与同步、失败即退役。
- 修复 **调度器空闲时仍每帧跑 pass**：账号行按需重建、排序只挪错位项，空闲 pass 降为 0。
- 修复 **非桌面端把「在应用中打开」菜单收进抽屉**：改按账号标签匹配触发器。
- 修复 **「设置」行变成账号名并弹出账号菜单**：只接受带 `aria-haspopup="dialog"` 的按钮。
- 修复 **图标型登出按钮没被排除**：同时读 `aria-label` / `title` / 类名，并跳过宿主账号区。
- 修复 **设置存储误报不可用**：读路径不再做可用性判定，仅写入失败才提示。
- 修复 **松开推条后旋钮弹回原档位再跳回**：等待回声期间不跟随滞后快照，超时或换梯后恢复。
- 修复 **松手瞬间档位名连跳两下**：footer 只换推条以外的节点，且先提交再只画一次。
- 修复 **拖动时滑块冲出终点线并与填充脱开**：位移改用独立 `translate` 属性，填充右端改为直角。
- 修复 **点击两档之间可能让档位选择器崩溃**：目录未 settle 期间不摘触发器也不关卡片。
- 修复 **点击滑槽其他位置时滑块瞬移**：把按下与拖动拆成两个状态，按下时仍有过渡动画。

### 安全

- **用户名、昵称、头像与插件条目不再拼进 HTML**：一律以文本写入，头像改用真正的 `<img>`。
- **设置与用户名路由不再对任何人敞开**：先过宿主请求栅栏，并限制内容类型、体积与数组长度。

<h3 id="en-0.5.1">New Features</h3>

- **Smoke test `npm run smoke`**: a dependency-free check of the host route fence and the browser half's boot, idle and teardown invariants.
- **The account row shows the real avatar and nickname**: on desktop sign-in it reads the official profile and keeps the round avatar and nickname fresh by polling every 60s.
- **The account drawer takes over the host account menu**: it mirrors the host menu's entries and drives the official actions directly.

### Improvements

- **Effort-name changes now swap**: the old name blurs upward while the new one blurs in from below, scrolling step by step while dragging.
- **Effort end labels are localized**: Chinese now shows localized labels, English stays `Faster` / `Smarter`.
- **The apex dot animation is now pure hashed particles**: no ordering or direction, with the plume shape carried by per-block static opacity.
- **The model and effort triggers in the seat move closer**: only 4px is left between the model name and the effort name.
- **Reasoning effort splits into its own trigger and popover**: the new `effort-picker.js` asks `ui.model` only for the seat, effort and commit.
- **Three slider feel tweaks**: smaller corners, a 10% scale-up while held, and damping around each step.
- **The effort slider is restyled to match Claude Desktop**: fill, step ticks and a capsule knob, with the apex step triggering the dot animation.
- **The composer's bottom shadow now comes from the seat's own bar and gradient**: the seat height is the bar height, no per-state card shadows.
- **The model descriptions got a full copy-editing pass**: fixing CN/EN conflicts and awkward wording, unifying units and terms.

### Bug Fixes

- Fix **settings showing but not saving on 0.1.7**: the namespace is now picked from the namespaces `configForms` serves, falling back to the plugin route.
- Fix **Enter sending half-typed text while the slash or @ menu is open**: the skin's Enter interception is removed and the host handles it.
- Fix **the skin repainting itself after disable or hot reload**: teardown cancels the queued frame and later `schedule()` calls no longer take effect.
- Fix **one failing feature leaving the whole skin half-mounted**: teardown registers first, and each feature installs and syncs alone, retiring on failure.
- Fix **the scheduler running a pass every frame while idle**: the account row rebuilds only on change and sorting moves only misplaced entries, so idle passes drop to 0.
- Fix **the "Open in app" menu being pulled into the drawer on non-desktop**: triggers are now matched by the account label.
- Fix **the settings row turning into the account name and opening the account menu**: it now accepts only buttons with `aria-haspopup="dialog"`.
- Fix **icon-only sign-out buttons not being excluded**: it now reads `aria-label` / `title` / class names and skips the host account area.
- Fix **settings storage falsely reporting unavailable**: the read path no longer judges availability, only a failed write warns.
- Fix **the knob snapping back to the old step after release**: it no longer follows the lagging snapshot while waiting for the echo, resuming on echo, ladder change or timeout.
- Fix **the effort name jumping twice on release**: the footer now replaces only non-slider nodes, and commit happens before a single paint.
- Fix **the knob overshooting the track end and detaching from the fill while dragging**: position now uses the standalone `translate` property and the fill's right end is square.
- Fix **clicking between two steps sometimes crashing the effort picker**: while the catalog has not settled it no longer removes the trigger or closes the card.
- Fix **the knob teleporting when clicking elsewhere on the track**: press and drag are split into two states, so a press still animates.

### Security

- **Usernames, nicknames, avatars and plugin entries are no longer spliced into HTML**: all are written as text and the avatar uses a real `<img>`.
- **The settings and username routes are no longer open to anyone**: they pass the host request fence and cap content type, body size and array length.

**Full Changelog**: [v0.5.0...v0.5.1](https://github.com/Nwflower/dsh-claude-style/compare/v0.5.0...v0.5.1)

## [0.5.0] - 2026-09-22

[中文](#cn-0.5.0) | [English](#en-0.5.0)

<h3 id="cn-0.5.0">新增功能</h3>

- **插件页有了自己的图标**：`package.json` 填陶烬橙星芒的相对路径，构建期复制到 `lib/`。
- **插件卡片有了本地化的标题与描述**：`locale/*.json` 提供 `meta.title` 与描述，`exports` 用通配避免降级。
- **侧栏「工作区」改成进行中 / 已归档分段控件**：驱动宿主筛选并从树里读回选中态，归档行挂删除按钮。

### 体验优化

- **推理等级改成一级弹层底部的推条**：无极滑动、松手对齐最近档位，键盘可用，二级弹层只剩「更多模型」。
- **`model-picker.js` 拆出两块回到停止线内**：推条与文案解析各成新碎片，二级档位状态一并删除。
- **推条的滑槽与旋钮几乎等高**：滑槽从 6px 细线改为 14px 圆角槽，对齐 Claude 真机比例。
- **弹层悬停时间统一**：停留 50ms 打开、离开 100ms 关闭，统计卡片仍 300ms 打开。
- **「更多模型」二级弹层收口**：底对齐、不重复供应商、没得列就整行去掉，不支持思考时不画推条。

### 问题修复

- 修复 **真圆被画成鹅卵石**：给六处真圆与滑槽补上 `corner-shape: round`。
- 修复 **全屏面板下顶栏标签与后台任务数浮在面板之上**：该行 `z-index` 从 100 降到 9。
- 修复 **热重载后模型选择器失去点击效果**：弹层节点重建判据改为「为空或已脱离文档」，并重置渲染签名。
- 修复 **热重链后宿主半边资产路由整代失联**：改为无条件经 `ctx.inject(['webServer'])` 注册路由。
- 修复 **推条拖动掉帧、不跟手**：拖动位移并入每帧一次 rAF，并对同值写入加护栏。
- 修复 **二级弹层悬停打开后不随指针移开收起**：一级弹层委托 `mouseover`，指针离开入口即收起。
- 修复 **切换档位后模型选择器一段时间不可用**：只在解析不出席位且无分组时才显示加载行。
- 修复 **composer 获焦时 `ui.heroMenu.close` 抛错**：调用前补存在性护栏。
- 修复 **0.1.7 上上下文标记被落在第二层**：新增 `mergeContextMeterIntoRow()` 归位到模型触发器右侧。
- 修复 **composer 底行三种控件字型不一**：统一为同一字体、13px、500 字重、20px 行高。
- 修复 **统计句盒子横跨半个行**：改用 `flex: 0 1 auto` 与自动外边距，盒子贴合文字。
- 修复 **0.1.7 上设置静默失效**：宿主半边导出 `Config`，设置按宿主世代分流到官方表单或旧注册制。
- 修复 **统计卡片内容缺块、关不掉、易误触发**：只认真实点击，悬停需停留 300ms，并按世代清扫遗留卡片。
- 修复 **软链安装下 schemastery 解析不到**：改按 harness 自己的解析基准取 schemastery。
- 修复 **0.1.7 上输入框的「＋」失去皮肤样式与位置**：标签列表补子串匹配，恢复 24px 与顺序。
- 修复 **侧栏两行形状不一致**：统一度量、静止透明 / hover 才铺底色，图标盒统一为 20px。
- 修复 **侧栏两行图标 hover 转 90°**：加 `transition: transform .25s`，指针离开自动转回。

### 移除

- **模型行的厂商字体整块移除**：字体资产、子集化脚本、令牌与 `@font-face` 一并删除。

<h3 id="en-0.5.0">New Features</h3>

- **The plugins page gets its own icon**: `package.json` points at the clay starburst's relative path, copied into `lib/` at build time.
- **The plugin card gets localized title and description**: `locale/*.json` supplies `meta.title` and description, exported via a wildcard to avoid a downgrade.
- **The sidebar "Workspaces" title becomes an Active / Archived segmented control**: it drives the host filter and reads selection back from the tree, with a delete button on archived rows.

### Improvements

- **Reasoning effort becomes a slider at the bottom of the first-level popover**: it slides freely and snaps on release, is keyboard-accessible, and the submenu holds only "More models".
- **`model-picker.js` splits into two fragments and returns under the stop line**: the slider and copy lookup become new fragments, and the submenu effort state is removed.
- **The slider track and knob are now nearly the same height**: the track goes from a 6px line to a 14px rounded groove, matching Claude's real proportions.
- **Popover hover timing is unified**: 50ms dwell to open and 100ms to close, while the stats card keeps its 300ms open dwell.
- **The "More models" submenu is tightened up**: bottom-aligned, no repeated providers, hidden when empty, and no slider when the model lacks reasoning.

### Bug Fixes

- Fix **circles rendering as pebbles**: six true circles and the slider track now declare `corner-shape: round`.
- Fix **the header preset label and background-task count floating above a fullscreen panel**: that row's `z-index` drops from 100 to 9.
- Fix **the model picker losing its click effect after hot reload**: popover nodes now rebuild when null or detached, and the render signature is reset.
- Fix **host-side asset routes losing a whole generation after a hot re-chain**: routes now always register through `ctx.inject(['webServer'])`.
- Fix **the effort slider dropping frames and lagging while dragging**: moves are batched into one rAF per frame and same-value writes are guarded.
- Fix **the submenu staying open after the pointer moves away**: the first-level popover delegates `mouseover` and closes it once the pointer leaves the entry.
- Fix **the model picker being unusable for a while after an effort change**: the loading row shows only when no seat and no groups can be resolved.
- Fix **`ui.heroMenu.close` throwing on every composer focus**: an existence guard now precedes the call.
- Fix **the context meter dropping to a second layer on 0.1.7**: a new `mergeContextMeterIntoRow()` returns it to the model trigger's right.
- Fix **the composer's bottom-row controls using different type**: they now share one font at 13px / 500 / 20px line height.
- Fix **the stats sentence box spanning half the row**: `flex: 0 1 auto` with auto margins now shrink-wraps it to the text.
- Fix **settings silently failing on 0.1.7**: the host half exports `Config` and splits settings by host generation between the official form and the old registry.
- Fix **the stats card missing content, refusing to close and misfiring**: it now accepts only trusted clicks, needs a 300ms dwell, and sweeps stale cards per generation.
- Fix **schemastery not resolving under a symlinked install**: it is now resolved from the harness's own resolution base.
- Fix **the composer "+" losing its skin styling and position on 0.1.7**: substring label matches restore its 24px size and order.
- Fix **the sidebar's two rows not matching**: shared metrics, transparent until hover, and a uniform 20px icon box.
- Fix **the sidebar rows' icons rotating 90° on hover**: add `transition: transform .25s` so they turn back on pointer leave.

### Removals

- **The model row's vendor font is removed entirely**: the font asset, subsetting script, token and `@font-face` are all deleted.

**Full Changelog**: [v0.4.0...v0.5.0](https://github.com/Nwflower/dsh-claude-style/compare/v0.4.0...v0.5.0)

## [0.4.0] - 2026-09-21

[中文](#cn-0.4.0) | [English](#en-0.4.0)

<h3 id="cn-0.4.0">新增功能</h3>

- **快捷供应商多选弹层**：设置页新增多选弹层，勾选者的模型直接列进一级弹层，按供应商分组、组名领在分隔线前。
- **当前模型行**：供应商改由自己的分隔线承载，席位不在已列供应商时在列表末尾补一行；二级弹层高度随内容自适应。
- **重做模型选择器开关**：设置页新增开关（默认开），关掉后交回宿主自己的模型菜单，只影响弹层。
- **首页目录与预设弹层**：改用皮肤弹层样式，触发器展开时给卡片打标记并重绘。
- **Popovers 规范**：`docs/STYLE.md` 新增「多选一弹层」的卡片、行、分隔与页脚度量表及类名匹配纪律。
- **hero 弹层位置**：改从触发器旁边弹出、底边对齐并向上生长，视口不够时翻到左侧，滚动缩放时重算。
- **首页弹层纳入自动弹出**：悬停触发器即展开、移开即收起，与对话框重绘门控一致。
- **快捷供应商清单**：官方服务始终不列入，残留的已下线供应商带「已移除」标记，取消勾选即从存储清除。
- **焦点收起弹层**：`focusin` 落进对话卡片时关闭权限、模型、会话统计、账户抽屉、hero 菜单与快捷供应商弹层。

### 体验优化

- **一级弹层滚动区**：只滚动模型列表，分隔线与「推理程度 / 更多模型」钉在卡片底部，高度随内容自适应。
- **自动弹出三档**：关闭 / 仅账号区 / 全部（默认全部），旧布尔值读取时归一。
- **弹层度量统一**：账户抽屉、会话统计与权限弹层对齐规范的行高、圆角、间距、最小宽度与 `z-index`。

### 问题修复

- 修复 **热重载重复渲染**：账户区与模型席位改为 DOM 幂等，更新前清扫上一代同名节点。

### 其他变更

- **清理开发期痕迹**：删除未调用的 `applyBrand`、未用参数与过时注释，行为无变化。

<h3 id="en-0.4.0">New Features</h3>

- **Quick-provider multi-select popover**: pick providers in settings and their models list directly in the first-level popover, grouped with the provider name leading each divider.
- **The current-model row**: the provider now rides its own divider; a seat outside the listed providers gets one appended at the end.
- **Redo model picker toggle**: a new setting (on by default) hands the model seat and both popovers back to the host's own menu.
- **Hero directory and preset popovers**: restyled to the skin's popover language via a marker set when the trigger reports `aria-expanded="true"`.
- **Popover spec**: `docs/STYLE.md` gained card, row, divider and footer metrics plus the class-name matching rules.
- **Hero popover placement**: it now opens beside the trigger, growing upward, flipping left when space is short, and repositions on scroll or zoom.
- **Hero popovers follow auto-popover**: hovering the trigger opens them and leaving closes them, gated like the composer restyle.
- **Quick-provider list**: official services never appear, and a removed provider stays flagged until unchecked and cleared from storage.
- **Focus closes popovers**: a `focusin` inside the chat card dismisses the permission, model, stats, account, hero-menu and quick-provider popovers.

### Improvements

- **First-level popover scroll region**: only the model list scrolls while the divider, reasoning effort and "More models" stay pinned at the card bottom.
- **Auto-popover has three levels**: Off / Account area only / All (default All), with old booleans normalized on read.
- **Popover metrics unified**: the account drawer, session stats and permission popover now share the spec's row height, radius, spacing, min width and `z-index`.

### Bug Fixes

- Fix **Duplicate renders on HMR**: the account area and model seat are now DOM-idempotent, sweeping the previous generation's nodes before updating.

### Chores

- **Dev leftovers removed**: deleted the unused `applyBrand`, an unused parameter and stale comments, with no behavior change.

**Full Changelog**: [v0.3.2...v0.4.0](https://github.com/Nwflower/dsh-claude-style/compare/v0.3.2...v0.4.0)

## [0.3.2] - 2026-09-21

[中文](#cn-0.3.2) | [English](#en-0.3.2)

<h3 id="cn-0.3.2">新增功能</h3>

- **会话统计跟随自动弹出**：与账户、模型、权限三个弹层对齐，关闭开关后悬停不再弹出。
- **更多模型弹层收紧**：列间距、分组间距与分组标题上边距各收到 4px。
- **锁定标不再回退**：没有规则命中的模型不画标，未用到的品牌一并删除。
- **新增 `longcat` 品牌**：补 `mimo` → `xiaomimimo` 规则，OpenCode 的 MiMo 与 LongCat 现在命中。
- **OpenAI 标不可见**：vendoring 清掉本地资产里带 `fill` 的内联 style，再补 `currentColor`。
- **更多模型排序**：行内边距收到 3px，同供应商模型按 id 升序排列。
- **锁定标多处修正**：Meta 漂移、混元高光与 `hy-mt2` 解析，新增 Gemma / Nano Banana 两个品牌。
- **厂商锁定标合成**：按 Lobe 的合成比例生成 `combine/<厂商>.svg`，图标与字标合为一件图形，自建字标与供应商图标删除。
- **Claude 行锁定标**：改画 Claude 自己的字标，`anthropic` 仍作 `anthropic` 路由兜底。
- **新增家族规则**：`gemma` 与 `nano-?banana` 各补一条官网口径文案，不再掉到档位规则。
- **Fable 与 Mythos 规则**：两条各用官网定位句，不再掉到兜底文案。

### 问题修复

- 修复 **过时模型说法**：修正 DeepSeek 下线版本、Grok 4.5、文心 5.0 与 `kimi-for-coding` 的过时文案。
- 修复 **插件加载即崩**：清掉对已删除 `WORDMARK_SVGS` 的加载期引用，并补一条加载校验脚本。
- 修复 **锁定标占位不显示**：把根的绘制属性重新包一层 `<g>`，并去掉会变提示的 `<title>`。
- 修复 **当前模型行丢供应商**：格式定为 `模型 (供应商)`，描述只在第一级显示，一级那行补上描述。
- 修复 **冷启动后选择器空等**：会话一解析出来就预热模型目录，把等待挪进启动过程。
- 修复 **Grok 行显示 xAI 标识**：`brands.models` 改指 Grok 自己的标记，provider 分组标题仍用 xAI。
- 修复 **当前模型行显示 id 串**：改用与其他行同一套外显名与厂商标记逻辑，无名字才退回 id。

### 其他变更

- **抽出 `model-brand.js`**：把品牌判定整块搬进新碎片，`model-picker.js` 回落到停止线以内。
- **字标扫描改预置数组**：加载时构建词表，并新增 `scripts/probe-timing.cjs` 分项计时。
- **模型简介按官网重写**：19 条精确条目与 54 条家族规则逐条对齐官网，家族文案不写最高级与版本数字。
- **文案改按线映射**：DeepSeek 删除旧版精确条目，改为 Flash / Pro / 其余三条线级文案。
- **去掉档位前缀**：不再用「旗舰档：」等自家定位话术，改用厂商自己的定位句。
- **描述不再重复模型名**：共 50 条去掉「X 系列：」式开头。
- **规格条目补用途**：10 条只剩参数与价格的条目按「面向…的…」形状并回官网用途句。

<h3 id="en-0.3.2">New Features</h3>

- **Session stats follow auto-popover**: it now matches the account, model and permission popovers, so with the setting off hover no longer opens it.
- **More-models popover tightened**: column, group and group-title spacing all reduced to 4px.
- **No lockup fallback**: a model with no matching rule draws no mark, and unused brands are dropped.
- **New `longcat` brand**: plus a `mimo` → `xiaomimimo` rule, so OpenCode's MiMo and LongCat now resolve.
- **Invisible OpenAI mark**: vendoring now strips inline `fill` styles from local assets and adds `currentColor`.
- **More-models ordering**: row padding reduced to 3px and each provider's models sort by id.
- **Multiple lockup fixes**: Meta drift, Hunyuan highlight and `hy-mt2` lookup, plus the Gemma and Nano Banana brands.
- **Combined vendor lockups**: `combine/<vendor>.svg` is generated from Lobe's own ratios, merging icon and wordmark; hand-built wordmarks and provider icons are gone.
- **Claude row lockup**: it now draws Claude's own wordmark, with `anthropic` kept as the fallback for the `anthropic` route.
- **New family rules**: `gemma` and `nano-?banana` each get an official one-liner instead of falling through to tier rules.
- **Fable and Mythos rules**: each uses its official positioning line instead of the generic fallback.

### Bug Fixes

- Fix **Stale model claims corrected**: retired DeepSeek versions move to line mapping, and Grok 4.5, ERNIE 5.0 and `kimi-for-coding` follow official naming.
- Fix **the plugin crashing on load**: the load-time reference to the removed `WORDMARK_SVGS` is gone, with a load-check script added to catch it.
- Fix **lockups reserving space but not showing**: root paint attributes are re-wrapped in a `<g>` and the tooltip-making `<title>` is dropped.
- Fix **the current-model row losing its provider**: the label is now `model (provider)`, descriptions show only at the first level, and that row gained one.
- Fix **the model picker waiting seconds after a cold start**: the catalog is warmed as soon as a session resolves, folding the wait into startup.
- Fix **the Grok row showing xAI's mark**: `brands.models` now points at Grok's own, while provider group headers still use xAI.
- Fix **the current-model row showing an id string**: it now uses the same display-name and brand logic as other rows, falling back to the id only when unnamed.

### Chores

- **`model-brand.js` extracted**: the whole brand-resolution block moved into a new fragment, bringing `model-picker.js` back under the size limit.
- **Wordmark scan prebuilt into an array**: the word list is built at load time, plus a new `scripts/probe-timing.cjs` for per-stage timings.
- **Model blurbs rewritten from vendor sites**: 19 exact entries and 54 family rules now match official pages, with no superlatives or version numbers in family copy.
- **Copy mapped by line, not version**: DeepSeek's old exact entries are gone, replaced by Flash, Pro and a shared line-level blurb.
- **Tier prefixes removed**: our own "flagship tier:" framing is gone in favour of vendor positioning.
- **Blurbs no longer repeat the model name**: 50 entries dropped the "X series:" prefix.
- **Spec-only blurbs gained a purpose**: 10 entries that had only specs now lead with the official use case.

**Full Changelog**: [v0.3.1...v0.3.2](https://github.com/Nwflower/dsh-claude-style/compare/v0.3.1...v0.3.2)

## [0.3.1] - 2026-09-21

[中文](#cn-0.3.1) | [English](#en-0.3.1)

<h3 id="cn-0.3.1">新增功能</h3>

- **声明最低运行时**：`package.json` 新增最低宿主版本，仓库根新增 `screenshots.json` 供商店取图。
- **Gemini 行改用 Google Sans Flex**：子集随包分发，家族名改为 `Google Sans Flex Picker`，按 `data-brand` 挂载。

### 问题修复

- 修复 **贴图时 hint 发黑跑位**：给 hero 兜底节点补上宿主的定位与墨色，hint 回到输入框首行。
- 修复 **聚焦底纹盖住输入框**：底纹从 rail 移到卡片，与 hero 卡片同一位置。
- 修复 **封号彩蛋语言选不动**：`banLocale` 走浏览器本地兜底，宿主不认该键时先本地保存渲染，待其重启后补写。

### 其他变更

- **亮暗切换先色后样**：翻转瞬间抑制过渡并取消进行中的绘制动画，约 0.3s 后恢复。
- **composer 形态改属性**：由 JS 写 `data-composer-variant`，CSS 直接读，降低流式重算开销。
- **设置页 Tab 图标**：用 CSS 蒙版把通用齿轮换成 Claude 星芒，亮暗各自取色。
- **亮色背景层级调优**：一级 `#FCFCFB`、二级 `#FBFBF9`、三级 `#F9F9F6`，设置面板对齐画布。
- **去 AI 化与精简**：清理临时调试日志与历史规划文档，移除残留编号与重复注释，精简 README。

<h3 id="en-0.3.1">New Features</h3>

- **Minimum runtime declared**: `package.json` gained `engines.dsh: ">=0.1.5-rc.2"`, and a root `screenshots.json` feeds store screenshots.
- **Gemini row set in Google Sans Flex**: a subset ships with the package under the family name `Google Sans Flex Picker`, mounted by `data-brand`.

### Bug Fixes

- Fix **the hint turning dark and escaping the box on image-only drafts**: the hero fallback node gets the host's positioning and ink, returning the hint to the first line.
- Fix **the focus underlay painting over the inline input**: the underlay moves from the rail to the card, matching the hero card.
- Fix **the ban-page language refusing to change**: `banLocale` falls back to `localStorage`, renders locally, and is written back once the host half restarts.

### Chores

- **Theme-flip colour-before-style**: transitions are suppressed during the flip and running paint animations cancelled, restoring after about 0.3s.
- **Composer variant via attribute**: JS writes `data-composer-variant` for CSS to read, cutting restyle cost during streaming.
- **Settings tab icon**: a CSS mask swaps the generic gear for Claude's starburst, coloured per theme.
- **Light-theme layer tones tuned**: layers are `#FCFCFB`, `#FBFBF9` and `#F9F9F6`, with the settings panel matching the canvas.
- **AI-tells and cruft removed**: temporary debug logs and old planning docs are gone, along with stale numbering and duplicated comments.

**Full Changelog**: [v0.3.0...v0.3.1](https://github.com/Nwflower/dsh-claude-style/compare/v0.3.0...v0.3.1)

## [0.3.0] - 2026-09-20

[中文](#cn-0.3.0) | [English](#en-0.3.0)

<h3 id="cn-0.3.0">新增功能</h3>

- **Claude 封号页彩蛋**：账户弹层顶部用户名横条可点开完整复刻页，全为明确退出动作，品牌偏好同样生效。
- **封号彩蛋语言设置**：可选中/英（默认英文），改动立刻重建页面并切换时间戳制式。

### 问题修复

- 修复 **回退引用块材质**：引用块恢复中性灰文字、灰底灰条，块内链接与代码各自保持材质。
- 修复 **文件引用颜色不一致**：文件引用改用链接色与同款下划线，代码片本身不动。
- 修复 **Markdown 表格左侧空隙**：删掉全局表格覆盖，首末单元格恢复内边距，窄表不再被拉满。

### 其他变更

- **封号页锁改手绘**：按参考图墨迹逐锚点描摹成三条贝塞尔路径，映射到 24 单位格。
- **修掉 `banSvg` 重复属性**：粗细改为形参只发一条属性，覆盖不再静默失效。
- **点击展开弹层不再即关**：改由点击别处或移出整个底栏关闭，悬停展开保持原逻辑。
- **账号横线移出 hover 区**：横线改为账号行的兄弟节点，hover 底板只覆盖账号名那行。
- **封号页排版**：内容列改为水平居中，页头整体下移 30px。
- **行内代码片收紧**：自带 `line-height: 1.2`，行盒收到 18px，上下不再虚胖。

<h3 id="en-0.3.0">New Features</h3>

- **Claude account-hold page easter egg**: the username strip opens a full replica with explicit exits, honouring the brand preference.
- **Ban-page language setting**: Chinese or English (default English), rebuilding the open page and timestamp format on change.

### Bug Fixes

- Fix **the blockquote material rolled back**: quotes return to neutral grey text, background and bar, leaving inner links and code untouched.
- Fix **file mentions not matching hyperlinks**: they take the link colour and underline, while the code chip stays unchanged.
- Fix **the left gap in Markdown tables**: global table overrides are gone, first and last cells regain padding, and narrow tables are no longer stretched.

### Chores

- **Ban-page lock redrawn by hand**: three Bézier paths traced from the reference ink and mapped to the 24-unit grid.
- **`banSvg` duplicate attribute fixed**: stroke width is now a parameter emitted once, so the override no longer silently fails.
- **Click-opened account popover no longer closes on mouse-out**: it closes on an outside click or leaving the footer, while hover keeps its old delay.
- **Account divider out of the hover area**: it is now a sibling of the account row, so the hover surface covers only the name.
- **Ban-page layout**: the content column is centred and the header drops 30px.
- **Inline code chips tightened**: they carry `line-height: 1.2` and an 18px line box, removing the extra padding.

**Full Changelog**: [v0.2.7...v0.3.0](https://github.com/Nwflower/dsh-claude-style/compare/v0.2.7...v0.3.0)

## [0.2.7] - 2026-09-20

[中文](#cn-0.2.7) | [English](#en-0.2.7)

<h3 id="cn-0.2.7">新增功能</h3>

- **模型选择器厂商标识**：模型行显示所属厂商标识，`brands.providers` / `brands.models` 驱动，构建期校验。

### 其他变更

- **引用块改用链接材质**：引用共用链接蓝文字与下划线，底纹与竖条取淡色。
- **文本选区实色两态**：聚焦蓝底白字、失焦灰底黑字，由 `selection.js` 镜像焦点态。
- **接入 cc-switch 图标**：引入 107 个供应商图标并新增宿主路由，选择器优先用它们、缺失回退 Lobe。
- **供应商标签推挤 sticky**：滚动时上一个标签被下一个 section 推上去。
- **附件轨接缝优化**：移除 focus 时 1px 内圈阴影，消除图片区与文字区分界。
- **更多模型子弹层**：提高弹层高度，供应商标签改为 sticky 顶部条。
- **provider 标签强化**：分组标题改为黑底白字圆角矩形，暗色反相。
- **模型触发器 hover 去重**：删掉 trailing 下的额外 hover 规则，只留一层背景。
- **标题中文回退黑体**：SERIF 栈移除 CJK 衬线回退，西文仍用 Anthropic Serif。
- **统计弹层合并**：两个宿主弹层合并为一个自定义弹层，上下两区块各 2×2 网格。
- **统计区交互**：弹层改为 hover 打开，控件仅在指针位于对话窗口内时显示，统计行居中。
- **输入区统计合并**：会话与 token 统计并成一条居中紧凑文本，隐藏宿主图标与标签。
- **补充当前非官方模型**：非官方选中模型在官方与更多模型之间单独一行显示，触发器去掉箭头。

<h3 id="en-0.2.7">New Features</h3>

- **Vendor marks in the model picker**: rows show the model's vendor via `brands.providers` / `brands.models`, validated at build time.

### Chores

- **Blockquotes use the link material**: quotes share the link blue, underline, tinted background and bar.
- **Text selection in two solid states**: blue-on-white focused, grey-on-black blurred, mirrored by `selection.js`.
- **cc-switch provider icons wired in**: 107 icons plus a host route, preferred over Lobe with a fallback.
- **Provider labels as push-sticky**: each scrolling section pushes the previous label up.
- **Attachment rail seam fixed**: the 1px focus inset shadow is gone, removing the divider between image and text.
- **More-models submenu**: taller popover with provider labels as sticky headers.
- **Provider labels strengthened**: group headers become rounded black-on-white blocks, inverted in dark mode.
- **Model trigger hover de-duplicated**: the extra trailing hover rule is gone, leaving one background.
- **Heading CJK fallback to sans**: the serif stack drops its CJK fallback while Latin keeps Anthropic Serif.
- **Stats popovers merged**: the host's two become one custom popover with two 2×2 blocks.
- **Stats interaction**: the popover opens on hover, controls show only inside the chat window, and the row centres.
- **Composer stats merged**: session and token stats become one centred compact line, hiding host icons and labels.
- **Current non-official model added**: it gets its own row between official and more models, and the trigger loses its arrow.

**Full Changelog**: [v0.2.6...v0.2.7](https://github.com/Nwflower/dsh-claude-style/compare/v0.2.6...v0.2.7)

## [0.2.6] - 2026-09-20

[中文](#cn-0.2.6) | [English](#en-0.2.6)

<h3 id="cn-0.2.6">新增功能</h3>

- **JetBrains Mono 免安装**：宿主半边新增字体路由，以 `@font-face` 注册为 webfont，缺失时回退系统字体栈。
- **Anthropic 字体可选免安装**：两个字体文件放进插件 `fonts/` 即以 webfont 提供，缺失时 404 回退。

### 其他变更

- **代码块与表格对齐 Claude**：行内代码与代码块字号 -1px，边框移到外层容器，表格字号与圆角上调。
- **自定义用户名**：设置页新增输入框，输入停顿后自动保存，宿主未重载时本地兜底。
- **链接与行内代码对齐 Claude**：链接下划线静止 60%、hover 100% 并加粗到 1.5px，代码改用 JetBrains Mono。
- **代码字体换 JetBrains Mono**：改用 JetBrains Mono Variable（含 Italic），随插件分发并保留 SIL OFL。
- **权限弹层 hover 打开**：悬停分段按钮即打开、移入取消关闭、移出延迟关闭，`autoPopover` 关闭时仍可点击。

<h3 id="en-0.2.6">New Features</h3>

- **JetBrains Mono without installing**: a host `/dsh-claude-style/fonts/*` route plus `@font-face`, falling back to the system stack when absent.
- **Optional Anthropic fonts without installing**: dropping the two files into the plugin's `fonts/` serves them as webfonts, with a 404 fallback.

### Chores

- **Code blocks and tables aligned to Claude**: code shrinks 1px, borders move to the outer container, and tables gain a size and radius.
- **Custom username**: a settings field autosaves after a pause, with a local fallback until the host half reloads.
- **Links and inline code aligned to Claude**: link underlines go from 60% to 100% on hover and thicken to 1.5px, and code moves to JetBrains Mono.
- **Code font switched to JetBrains Mono**: the variable font with italics ships with the plugin under SIL OFL.
- **Permission popover opens on hover**: hovering opens it, moving in cancels closing and leaving delays it; clicking still works with `autoPopover` off.

**Full Changelog**: [v0.2.5...v0.2.6](https://github.com/Nwflower/dsh-claude-style/compare/v0.2.5...v0.2.6)

## [0.2.5] - 2026-09-20

[中文](#cn-0.2.5) | [English](#en-0.2.5)

<h3 id="cn-0.2.5">新增功能</h3>

- **模型文案改为运行时读取的数据文件**：文案表迁出 bundle，宿主按请求读取、浏览器半边按需缓存。
- **补充新模型线文案**：为榜单上未收录的模型线补写家族规则，未收录的仍回退目录文本。

### 体验优化

- **模型文案跟随全局语言、单行显示**：按 shell locale 取语言，每行只渲染一条，切换语言即时重绘。

### 问题修复

- 修复 **模型文案的两处误判**：锚定激活参数与稠密规则，并补 `north`、`gpt-oss` 规则。
- 修复 **塌缩态底栏插件控件压住 Claude 标**：塌缩时隐藏设置区内的按钮与触发器行。
- 修复 **塌缩态账户弹层被侧栏容器裁掉**：弹层改 `position: fixed`，坐标由脚本解析。
- 修复 **设置页文字整页消失**：折叠拆开，设置区不再继承零字号，文本恢复自然行高。

### 其他变更

- **源码按特性级分片重构**：`overrides`、`context` 与 CSS 拆成独立文件，调度器改走 `ui` 句柄。

<h3 id="en-0.2.5">New Features</h3>

- **Model copy is now a runtime data file**: the table left the bundle, is served by the host on request and cached on demand.
- **Copy for newly added model lines**: family rules added for the leaderboard's missing lines; unknown lines fall back to catalog text.

### Improvements

- **Model copy follows the global language, one line per row**: the shell locale picks the language and a switch redraws instantly.

### Bug Fixes

- Fix **two model-copy misreads**: anchor the active-parameter and dense rules, and add `north` / `gpt-oss` rules.
- Fix **a collapsed-sidebar plugin control covering the Claude mark**: hide the settings-area buttons and trigger row while collapsed.
- Fix **the collapsed-sidebar account popover being clipped by the sidebar**: it is now `position: fixed` with script-resolved coordinates.
- Fix **the whole settings page's text disappearing**: the collapse is split so the settings area no longer inherits zero font size.

### Chores

- **Source split into per-feature files**: `overrides`, `context` and CSS became separate files and the scheduler now uses the `ui` handle.

**Full Changelog**: [v0.2.4...v0.2.5](https://github.com/Nwflower/dsh-claude-style/compare/v0.2.4...v0.2.5)

## [0.2.4] - 2026-09-19

[中文](#cn-0.2.4) | [English](#en-0.2.4)

<h3 id="cn-0.2.4">体验优化</h3>

- **深色输入框焦点由「加深」改为「提亮」**：焦点描边与晕边改用亮象牙，聚焦时明显亮起。
- **权限弹层列表间距加宽**：行间距由 2px 加宽到 6px，预设说明不再糊成整块。
- **会话统计并入输入框工具栏同一行**：两组 pill 移入工具栏、居中排列，输入区由三行压为两行。
- **统计 pill 改为悬停出现**：平时隐藏但保留占位，指针移入对话窗口时淡入。
- **消除附件轨与输入框之间的分界线**：以负外边距闭合间隙，卡片总高不变。
- **非对话页隐藏整个底部输入区**：仅对话页签激活时显示，宿主底部留白随之归零。
- **模型选择控件按 Claude 效果重构**：触发器只留模型名，弹层一级直列官方模型、二级旁侧展开，悬停即开。

### 问题修复

- 修复 **权限切换在 dsh 0.2+ 上完全失效**：当前会话改从 `uiSession` 主视图读取，兼容裸值投影。
- 修复 **亮色用户消息气泡由蓝改灰**：气泡底色改用皮肤的悬停灰，深色保持不变。
- 修复 **模型选择弹层永远停在「正在加载模型…」**：改走 `modelDir.store` 读写快照，并补上 rejection 处理。
- 修复 **深色强调色回到陶烬橙**：深色盘限定到 `[data-ds-dark-theme]`，不再被宿主蓝色盖掉。

<h3 id="en-0.2.4">Improvements</h3>

- **Dark-mode input focus now brightens instead of deepening**: the focus outline and halo use bright ivory and light up clearly.
- **Wider rows in the permissions popover**: row spacing grew from 2px to 6px so the preset descriptions no longer blur together.
- **Session stats merged into the composer toolbar row**: both pills moved into the toolbar, centered, cutting the composer to two rows.
- **Stats pills appear on hover**: hidden by default with their space reserved, they fade in when the pointer enters the conversation.
- **The seam between the attachment rail and the input is gone**: a negative margin closes the gap without changing the card height.
- **Composer hidden off the conversation page**: it shows only on the active conversation tab, and the host's reserved bottom space goes.
- **Model picker matches Claude**: the trigger keeps the model name, the first level lists official models and the second opens beside it.

### Bug Fixes

- Fix **permission switching broken on dsh 0.2+**: read the current session from the `uiSession` binding, tolerating bare-value projections.
- Fix **the light-mode user bubble being blue**: its fill now uses the skin's hover grey; dark mode is unchanged.
- Fix **the model popover stuck on "Loading models…"**: state now goes through `modelDir.store`, with rejection handling added.
- Fix **the dark accent returning to clay orange**: scope the dark palette to `[data-ds-dark-theme]` so the host's blue no longer wins.

**Full Changelog**: [v0.2.3...v0.2.4](https://github.com/Nwflower/dsh-claude-style/compare/v0.2.3...v0.2.4)

## [0.2.3] - 2026-09-19

[中文](#cn-0.2.3) | [English](#en-0.2.3)

<h3 id="cn-0.2.3">问题修复</h3>

- 修复 **账户抽屉弹层刷新时 hover / 点击失效**：弹层打开期间镜像内容保持静止，点击目标在点击瞬间解析。

<h3 id="en-0.2.3">Bug Fixes</h3>

- Fix **account drawer popover losing hover / click**: mirrored content stays still while open and click targets resolve on click.

**Full Changelog**: [v0.2.2...v0.2.3](https://github.com/Nwflower/dsh-claude-style/compare/v0.2.2...v0.2.3)

## [0.2.2] - 2026-09-19

[中文](#cn-0.2.2) | [English](#en-0.2.2)

<h3 id="cn-0.2.2">新增功能</h3>

- **对话内输入框重设计**：压缩为单行卡片、随内容增高，权限、附件与模型选择合并到下方同一行。
- **输入框焦点样式**：聚焦时描边转为中性色细线，外扩 1px 同色晕边并加深投影。
- **分时段首页欢迎语**：欢迎语随本地时间自动轮换，跨过整点时每 60 秒刷新。
- **模型思考状态重塑**：收录 Claude Code 的 185 种思考动词，扫光改为陶土橙与蜜桃暖色。
- **工作区运行中状态重塑**：侧栏加载动画改为 Windows 11 Fluent 风格的圆形圆弧旋转。
- **可切换品牌标识**：设置页新增 Claude Style 分区，在 Claude 与 Anthropic 两套标识间切换并本地保存。

### 问题修复

- 修复 **对话内输入框的多处布局问题**：吸附底部、随内容增高，附件区不再出现双层边框。
- 修复 **上下文用量弹层被误压缩**：弹层不再被挤扁，排版恢复正常。
- 修复 **账户抽屉多项问题**：非按钮控件与富控件条目正常收纳，图标、顺序与点击位置对齐。
- 修复 **`dsh-agy-link` 的 run_code 工具卡片排版异常**：卡片头部与代码预览恢复正常。

### 其他变更

- **源码拆分与构建化**：`lib/client.js` 改为构建产物，源码拆到 `src/`，新增无头回归探针。
- **Anthropic 字体入仓库**：`fonts/` 提供三个字体文件，随 Git 分发但不随 npm 包分发。

<h3 id="en-0.2.2">New Features</h3>

- **In-conversation composer redesigned**: a single-line card that grows with content, permissions, attachments and the model picker below.
- **Composer focus styling**: on focus the outline becomes a neutral hairline with a 1px same-color halo and a deeper shadow.
- **Time-of-day home greetings**: the greeting rotates with local time and refreshes every 60 seconds across an hour boundary.
- **Thinking status reshaped**: 185 Claude Code thinking verbs are included and the sweep turns clay-orange and peach.
- **Running-session status reshaped**: the sidebar loading animation became a Windows 11 Fluent-style circular arc spinner.
- **Switchable brand marks**: a Claude Style section switches between the Claude and Anthropic marks and saves the choice locally.

### Bug Fixes

- Fix **several composer layout issues**: it sticks to the bottom, grows with content, and the attachment area loses its double border.
- Fix **the context-usage popover being wrongly compressed**: it is no longer squeezed and lays out correctly again.
- Fix **several account drawer issues**: non-button and rich controls are collected properly, and icons, order and click targets line up.
- Fix **broken `dsh-agy-link` run_code tool card layout**: the card header and code preview render correctly again.

### Chores

- **Source split and a build step**: `lib/client.js` became a build artifact, source moved to `src/`, and a headless probe was added.
- **Anthropic fonts added to the repo**: `fonts/` ships three font files with Git but not with the npm package.

**Full Changelog**: [v0.2.1...v0.2.2](https://github.com/Nwflower/dsh-claude-style/compare/v0.2.1...v0.2.2)

## [0.2.1] - 2026-09-19

[中文](#cn-0.2.1) | [English](#en-0.2.1)

<h3 id="cn-0.2.1">新增功能</h3>

- **账户抽屉悬停展开**：支持悬停展开与延迟关闭，移入弹层不打断浏览。

### 体验优化

- **权限控制器首段由 Plan 改名为 Read**：与它映射的只读预设名称一致。
- **新会话按钮改为与会话行同高的窄条**：左对齐加号图标、常驻悬停底色。
- **会话行标题默认为次级灰**：悬停或选中时回到主文字色。
- **账户底栏改为全宽分割线布局**：分割线贯通侧栏。

### 问题修复

- 修复 **LICENSE 版权署名缺失与 README 无效示例**：补齐署名并修正 patch 配置示例。

<h3 id="en-0.2.1">New Features</h3>

- **Account drawer hover opening**: it opens on hover and closes after a delay, and moving into the popover does not interrupt browsing.

### Improvements

- **The permissions control's first segment renamed from Plan to Read**: it now matches the read-only preset it maps to.
- **The new-session button became a narrow bar matching the session-row height**: a left-aligned plus icon with a persistent hover fill.
- **Session row titles default to secondary grey**: they return to the primary text color on hover or selection.
- **The account footer became a full-width divider layout**: the divider spans the sidebar.

### Bug Fixes

- Fix **the missing LICENSE attribution and an invalid README example**: attribution added and the manual patch sample corrected.

**Full Changelog**: [v0.2.0...v0.2.1](https://github.com/Nwflower/dsh-claude-style/compare/v0.2.0...v0.2.1)

## [0.2.0] - 2026-09-19

[中文](#cn-0.2.0) | [English](#en-0.2.0)

<h3 id="cn-0.2.0">新增功能</h3>

- **Claude Code Desktop Theme**：从配色皮肤升级为完整的 Claude Code Desktop 视觉与交互复刻主题。
- **Plan / Edit / Auto 分段权限控制**：行内三段式控制器，支持快捷切换会话权限。
- **侧栏账户抽屉**：侧栏底部集成账户按钮与弹出菜单，可打开设置与管理插件。
- **视觉与文案重塑**：专属问候语、输入框引导文案与品牌星芒标识。

### 体验优化

- **优化亮色画布与侧栏色值**：画布取 `#FCFCFB`，侧栏取 `#FBFBF9`。

### 其他变更

- **项目重命名为 `dsh-claude-style`**：与上游 `claude-style-skin` 区分。

<h3 id="en-0.2.0">New Features</h3>

- **Claude Code Desktop Theme**: upgraded from a color skin into a full Claude Code Desktop visual and interaction replica.
- **Plan / Edit / Auto segmented permission control**: an inline three-segment controller for quick session permission switching.
- **Sidebar account drawer**: an account button and popup menu at the sidebar bottom, opening settings and plugin management.
- **Visual and copy refresh**: dedicated greetings, composer placeholder copy and the brand star mark.

### Improvements

- **Light canvas and sidebar colors tuned**: the canvas uses `#FCFCFB` and the sidebar `#FBFBF9`.

### Chores

- **Project renamed to `dsh-claude-style`**: to distinguish it from the upstream `claude-style-skin`.

## [0.1.0] - 2026-08-22

[中文](#cn-0.1.0) | [English](#en-0.1.0)

<h3 id="cn-0.1.0">新增功能</h3>

- **初始版本**：暖调象牙白 / 暖黑双画布与陶烬橙强调色。

<h3 id="en-0.1.0">New Features</h3>

- **Initial release**: warm ivory / warm black dual canvas with a clay-orange accent.
