# 架构决策记录

本文件记录本仓库**为什么**是现在这个样子：每条决策写背景、决定、代价，以及什么情况下允许重审。
操作手册看 README，硬性规则看 AGENTS.md，视觉令牌看 docs/STYLE.md；本文件只管「权衡」。

执行约束：

- 任何重构/拆分方案若与本文件已记录的决策冲突，必须先修改对应条目、说明旧决策为何失效，再动手。禁止静默推翻。
- 新决策追加在文末，编号递增，不删旧条目；被推翻的条目改为「已废弃 + 指向新决策」。

---

## D1. 零构建工具链，构建期逐字拼接

- **背景**：DSH Web 的模块加载器没有相对 require、没有资产 URL 机制，常规打包器（esbuild/rollup）产出的 chunk 拆分与资产引用无处安放。
- **决定**：`scripts/build.mjs` 把 `src/` 碎片按固定顺序逐字拼接成单个 `lib/client.js`；所有碎片共享一个工厂作用域，禁止 import/export，React 只能经加载器 `require('react')` 取得；资产（SVG/字体）构建期内联为 data URI 或走宿主路由。
- **代价**：碎片写法受限（ES5 风格、4 空格基础缩进、`%%TOKEN%%` 占位）；没有 tree-shaking，bundle 体积靠自律控制。
- **重审条件**：DSH 加载器原生支持 ES module 相对导入与资产 URL 之时。

## D2. 纯浏览器半边实现，不动宿主

- **背景**：主题是皮肤，不应 fork DSH；宿主升级要快跟随。
- **决定**：一切效果通过 CSS 覆盖与客户端 DOM override 实现；宿主半边（`lib/index.js`）只提供静态路由（模型文案 JSON、位图图标）。（后来宿主半边还承担了字体、设置读写与系统用户名路由；私有路由的安全约束见 D11。）
- **代价**：依赖宿主带哈希的 CSS-module 类名，宿主改版可能击穿选择器——用 D3 的纪律和 probe 回归对冲。
- **重审条件**：DSH 官方开放主题 API / 插槽覆盖所 target 的区域时，逐步迁移过去。

## D3. 宿主选择器纪律：最长稳定片段

- **背景**：宿主类名带哈希（`_54WpYG_imageItem`），短子串（`[class*="row"]`）极易误伤不相关组件，曾出过事故。
- **决定**：子串匹配只用最长稳定片段（`[class*="_row"]`）；不得覆盖 `[class*="viewArea"]` 的活跃期布局契约；新增子串选择器必须检查误伤面。
- **代价**：选择器冗长；需要人肉维护「哪些片段稳定」的经验。
- **重审条件**：宿主提供稳定的 data-* 契约后全面迁移。

## D4. composer 样式构建期门控（composer-gate）

- **背景**：composer 是性能与正确性最敏感的区域；皮肤规则若在未启用皮肤时泄漏到宿主 DOM 会造成事故。
- **决定**：composer 相关规则必须位于 `/* @composer-gate */` 标记之下，构建把 `[%%COMPOSER_ATTR%%]` 门控盖到标记以下每条规则，漏盖即构建失败。
- **代价**：写 composer 样式多一道心智负担；构建脚本要维护门控逻辑。
- **重审条件**：无（这是安全网，不是权衡）。

## D5. 模型文案是数据，不进 bundle

- **背景**：模型目录日新月异，文案更新不应要求改 JS 发版。
- **决定**：`src/model-descriptions.json` 构建期校验后复制到 `lib/`，浏览器首次绘制选择器时经宿主路由 fetch；查找按 精确条目 → 家族规则 → 档位规则 → 目录自带文本 逐级降级；不写「最强/旗舰」等最高级（钉住版本的精确条目除外）。两条附加纪律：**文案是「线」的文案，不是「版本」的文案**——同一条产品线（如 DeepSeek 的 Flash / Pro）按名字模式映射到同一句，版本迭代与退场都不改这句话，因为过时版本会命中同一条规则，给某个版本写的描述最终会挂在别的版本上；**不写我们自己加的档位前缀**（「旗舰档：」「顶级档位：」），文案要么是厂商自己的定位句，要么直接说它做什么——前缀是我们的定位话术，会随产品线换代变成假话；**描述也不重复模型名**——行里已经写着模型名，文案再以「X 系列：」「X 档：」开头就是重复，只写后半句（Kimi K3 那条就是官网模型页标题去掉「Kimi K3：」之后的部分）。
- **代价**：首次绘制选择器有一次异步 fetch；文案体系有学习成本。
- **重审条件**：宿主模型目录 API 直接提供本地化文案时。

## D6. 单一 scheduler 统一所有 override 的生命周期

- **背景**：多个 override 各自挂 observer/listener 会互相踩踏、泄漏、重复扫树。
- **决定**：`overrides/scheduler.js` 持有唯一的 MutationObserver（body 子树、attributes 过滤到 aria-label/aria-selected），用 requestAnimationFrame 合并为每帧一次 pass，统一驱动各 `ui.*.sync()`；teardown 统一清理。
- **代价**：每个 sync 必须有廉价的 early-out；新增 override 要接入同一调度器而不是自立门户。
- **已知代价与对策**：流式输出期间每帧一次全量 pass 是性能热点，见 D9。

## D7. UI 行为优化内置在本插件，不拆独立插件

- **背景**：模型选择器、权限分段、账户抽屉等「UI 优化」与皮肤共享同一套宿主锚点（选择器纪律）、同一调度器（D6）、同一 popover 工具与 teardown。
- **决定**：行为层（`src/overrides/`）与皮肤层（`src/styles/`、tokens、品牌资产）在源码内保持分离，但发布为同一个包。不想要 Claude 皮肤的用户用设置里的品牌切换回到接近宿主的观感。
- **代价**：包名与主题绑定，「只用 UI 优化不要皮」的诉求没有独立入口。
- **重审条件**：出现第二个真实消费者（另一个主题包或宿主官方）需要复用 overrides 层时，把 overrides 抽成独立包，皮肤包依赖它。

## D8. 多主题走「单仓库构建期分包」

- **背景与决定**：做第二个主题时，多合一会让包名（claude）名不副实，分仓库会让共享机制（build.mjs、scheduler、popover-utils、选择器纪律）多处漂移，抽 npm 运行时公共包则违反 D1。所以届时把本仓库改为单仓库多主题：共享碎片留仓库级 `src/`，主题私有碎片（tokens、品牌资产、copy、主题特有 overrides）收进 `themes/<name>/`，`build.mjs` 参数化 `--theme`，每个主题产出自包含单文件、各自发 npm 包；`dsh-claude-style` 包名不动。具体改造步骤到立项时再写。
- **触发条件**：仅当新主题有**行为分叉**（不同的 DOM override、不同的 composer 结构）才动手。若只是换色板与 logo，先用现有品牌切换机制（settings.js）在包内消化，不提前改造。
- **代价**：改造时 build.mjs 与目录布局有一次性手术；两个主题之后共享碎片的改动需要双主题回归。

## D9. composer 的 :has() 分支改 JS 写属性

- **背景**：皮肤在流式输出期间的渲染压力主要来自两处：D6 的每帧全量 pass，以及 CSS 中约 70 处对 DOM 结构敏感的 `:has()`（绝大多数是 `[class*="composerStack"]` 上的 hero/inline 分支）——每次 DOM 变更都触发昂贵的选择器重算。
- **决定**：把「结构感知」从 CSS 移到 JS：`permissions.js` 的 `syncSegments()` 在 scheduler 每轮 pass 里为 composerStack 祖先写 `data-composer-variant="hero|inline"` 属性（observer 的 attributeFilter 不含 data-*，不会反触发；写前比较旧值防抖动；同轮去重避免多卡命中同一 stack 反复写），CSS 改为读属性。交互敏感的 `:has()`（`:hover`、`:focus-within`）与低频的 dialog `:has()` 保留。
- **落地**：已执行完毕。仍未消除的结构感知 `:has()` 只剩 placeholder 那条（`card` 上的 `:not(:has([data-composer-placeholder]))`）：`copy.js` 本就管理 placeholder，可在它的 sync 里同步写 `data-has-placeholder` 再改 CSS，属可选的后续优化。
- **重审条件**：实测证明 :has() 不再是热点，或宿主提供 hero/inline 的稳定属性契约。

## D10. 设置按宿主世代分流：官方 Config 表单 + 旧版命名空间注册

- **背景**：0.1.7 删掉了 `settings.register(ns, schema)`——命名空间不再是插件自取的名字，而是 profile entry id，schema 就是插件导出的 `Config`，只有 `.volatile()` 字段进表单，值写进 profile 的 Cordis patch；客户端服务 `settingsScope` 改名 `configForms`，插件设置席位从 `settings.plugin.item` 变成 `plugins.bundle.config`（键 = 包名）/ `plugins.row.config`。旧宿主（0.1.5-rc.2，桌面端内置）仍是注册制，且其 schemastery 3.18.2 没有 `.volatile()`——两套 API 互斥，`.volatile()` 在旧版上会直接抛错。
- **决定**：设置层按宿主世代走两条路，探测点各只有一个——宿主半边看 `settings.register` 是否存在，客户端看 `ctx.get('configForms')` 是否可用。
  - 宿主半边导出 `Config`：八个偏好字段，`volatileField()` 逐字段探测 `.volatile()` 存在才加标记；schemastery 用顶层 await 守卫导入，解析不到就让 `Config` 为 `undefined`，皮肤照常加载。新宿主把命名空间取成 `ctx.fiber.entry.id`（读不到回落 patch 里的常量），只调 `settings.configure({ auto: false }, ctx.fiber)` 声明自带页面；旧宿主仍 `register('claude-style', schema)`。两条路共用同一个可变命名空间，`describePrefs/updatePrefs` 与自建 prefs 路由都读它。
  - 客户端：`ctx.configForms.get(entryId)` 可用就用官方表单（值 + 写队列 + revision 栅栏），否则回落到自建路由；设置界面在 0.1.7 注册成 `plugins.bundle.config`（键 = 包名，渲染在插件页上），旧宿主注册成 `settings.section` 整页。分流靠 `slots.inject` 的「槽被声明才触发」语义（旧宿主从不声明前者），再用 `configForms` 是否存在否决后者在 0.1.7 上的重复注册。
- **代价**：设置层有两套传输与两套席位，回归必须覆盖两种宿主形态（`.debug/settings-bridge-check.cjs` 跑宿主半边两代，`.debug/client-settings-check.cjs` 在无头浏览器里跑客户端两代）；`Config` 的顶层 await 让宿主半边模块求值晚一步（loader 本就 await 导入，无实际影响）。
- **重审条件**：不再支持 0.1.5-rc.2（桌面端内置升级到 0.1.7+）时，删掉旧路径与两处探测，只留 `Config` + `plugins.bundle.config`。

## D11. 插件自有路由借宿主的请求栅栏；宿主/用户来源的字符串只以文本上屏

- **背景**：`webServer.register()` 交给插件的是裸请求。宿主自己的 `/api` 挂在 Host/Origin 栅栏与浏览器会话 cookie 之后（`connection.requestRejection()`），插件路由不在其内。本插件的 `/prefs`（写设置）与 `/username`（读系统用户名）因此曾经完全无鉴权：跨站页面用 `text/plain` 发 POST 无需预检即可写入设置，`dsh web` 绑定 `0.0.0.0` 时局域网里任何人都能直接写。写进去的用户名又被客户端拼进 `innerHTML`——实测在 GUI 页面里执行了脚本，而这个页面能驱动执行 shell 命令的智能体。
- **决定**：两层各守一道。宿主半边：`/prefs` 与 `/username` 处理前先调 `ctx.get('connection').requestRejection(req)`（0.1.5-rc.2 起即有），拒绝即回 401/403；`/prefs` 另要求 `Content-Type: application/json`（跨站页面发不出不经预检的 JSON）、请求体上限 16 KiB、快捷供应商至多 64 个短 id。宿主没有该服务时，插件自带的替身只服务回环（回环 Host、无跨站标记、Origin 与 Host 一致）。模型文案与字体等静态资产保持公开。客户端：一切来自设置、账号服务、系统或第三方插件的字符串只用 `textContent` / 元素属性写入，图标复制节点而非重新解析 markup。
- **代价**：路由依赖宿主的 connection 服务。已核对两种壳都能通过：浏览器同源请求带会话 cookie；0.1.7 桌面壳经 `forwardWebRequest` 转发到回环 Host、剥掉页面 Origin 并自带 cookie（宿主真实的 `isTrustedApiRequest` 对这两种请求放行，对跨站与 DNS 重绑定请求拒绝）。0.1.5-rc.2 桌面端根本不把插件路径路由到 webServer（非 `/api` 一律走静态资产），不受影响。
- **重审条件**：宿主为插件提供自带鉴权的路由注册（如 `connection.fetch.register`）时，迁移过去并删掉本地替身。

## D12. 特性级失败隔离：一个特性出错只关掉它自己

- **背景**：`apply()` 依次装 14 个特性，teardown 却在最后才交给 `ctx.effect`；每轮 pass 里各 `sync()` 也没有逐个兜底——一个抛错，排在它后面的全部跳过，而且每轮如此。实测：宿主 `remote.account.getProfile()` 返回非 Promise 时 `apply()` 中途抛错，样式表与 body 属性留在页面上、调度器没装上、teardown 没注册（关掉插件也清不掉），前面装好的特性的监听器一并泄漏。effort-picker 那次「Loading plugins…」卡死是同一类问题。
- **决定**：
  - teardown 最先经 `ctx.effect` 注册且幂等；每个特性单独 try/catch 安装，装不上的报一次 `console.error` 并退役。调度器本身装不上时整体回滚到宿主原样——没有调度器，其余特性都不会同步，留着只是一张半套的皮。
  - 每轮 pass 里每个特性的 `sync()` 单独 try/catch，连续失败 3 轮即报一次并退役（`ui.retire`）。
  - 退役 = 跑该特性自己的 teardown，并把它接管的宿主界面还回去。页脚接管（`FOOTER_ATTR`，由偏好写）与 composer 重绘（`COMPOSER_ATTR`，由 permissions 的 pass 写）都会隐藏宿主控件，所以退役 `footer` / `permissions` 时对应的闸门强制关闭、不再随偏好打开。特性的 teardown 因此必须撤干净自己的 DOM 与标记（模型选择器此前只清变量，已补上）；只做装饰的 pass 用自己的句柄名（`ui.settingsNav`），退役它不会卸掉设置页。
- **代价**：特性失效时界面上没有提示，只有控制台一行；依赖它的特性（例如都读 `ui.copy.isComposerActive()`）会各自连续失败、依次退役——降级而非崩溃。
- **重审条件**：宿主提供插件级的错误上报 / 健康面板时，把报告接过去。

## D13. 特性碎片的拆分布局与调度契约

- **背景**：重构开始时，三个特性碎片都越过 750 行上限——`account-footer.js` 1357 行（账户资料、宿主账号菜单桥接、其他插件页脚条目的镜像、抽屉壳、行构建五份工作挤在一个闭包里）、`model-picker.js` 900 行（模型目录订阅与行构建也塞在里面）、`permissions.js` 868 行（会话统计卡也在里面）；`composer/inline.css` 847 行与 `components/model-picker.css` 767 行两条 CSS 同样超限。调度器同时把每个特性的触发调用硬编码在手写清单里：`PASS_FEATURES` 按名列 pass 序、与 entry.js 的安装序分开维护，另有 21 处特性专属调用散在各触发分支里，而且已经与特性漂移——`ui.heroMenu.close` 是被守卫着的死调用（heroMenu 的句柄只有 `{ sync, reposition }`）。`ui` 是跨特性共享的服务注册表，却没有任何文档说明句柄有哪些方法、谁可以读谁。
- **决定**（重构 Phase 0–3 已落地）：
  - **辅助碎片导出顶层 `createX(...)` 工厂**，仿 popover-utils 的 `createHoverIntent` 与 model-effort 的 `createEffortControl`：状态收在工厂自己的闭包里，返回一个小对象；访问器与回调经参数传入（如 `{ isOpen: fn, onChange: fn }`），绝不伸手进别的闭包。特性的 `installX` 负责把工厂接起来（现有六个：`createAccountProfile`、`createHostAccountMenu`、`createFooterMirror`、`createModelCatalog`、`createModelRows`、`createSessionStats`）。
  - **拆出多个碎片的特性建一个子目录**（`overrides/account/`、`overrides/model/`）；只拆出一个辅助碎片的特性把它放在特性旁边（`overrides/session-stats.js`）——单文件目录是噪音。FRAGMENTS 里列在特性碎片紧前面；顶层名对整个 bundle 全局唯一、以特性起名（`createAccountProfile`，不是 `createProfile`）。移动就是移动：注释随行、风格与名字不变，只有闭包变量必须变成参数时才改签名。
  - **特性契约**：entry.js 的 FEATURES 表（`{ name, handle?, install }`）统一安装序与 pass 序——pass 序就是安装序过滤出句柄带 `sync` 的特性（`settings` 安装到 `ui.settingsNav`）。scheduler 只认 FeatureHandle 的可选钩子（typedef 在 scheduler.js 头部）：`sync` / `owns` + `close('outside')` / `onPointerDown` / `close('escape')` / `close('composer')` / `onInput` / `reposition` / `onCopyChange` / `onKey`；没实现的钩子直接跳过，每个特性保住自己原有的关闭路线（permissions 没有外部点击关闭，quickProviders 只在 composer 聚焦时关）。`retire` 按 name 或 handle 匹配：纯 handle 命中只停 sync、不拆安装（settingsNav 的显式分支——失败计数器已拒绝后续 pass，安装继续跑、设置页不卸）；退役 `footer` / `permissions` 仍强制归还 body 属性（FOOTER_ATTR / COMPOSER_ATTR）。
- **理由**：拆分前「加一个特性」要改两处清单（entry.js 安装序列 + scheduler 的 PASS_FEATURES）再往各触发分支加调用；现在变成往 FEATURES 表加一行、在句柄上实现钩子——scheduler 不再认识任何具体特性，手写清单无从漂移。拆分把千行闭包变成状态自持的工厂加薄编排，750 行上限重新可守。移动就是移动（注释随行、闭包变量变参数才改签名），搬运提交的 diff 因此可审：搬运里不该出现逻辑改动。代价是多一层间接——特性内部状态要经工厂参数表交接，动状态时多过一遍参数。本决策不推翻 D1/D6/D12：仍是单文件逐字拼接（D1）、仍是单一调度器统一驱动（D6，钩子只是把硬编码调用变成句柄方法）、特性级失败隔离与 retire 语义原样保留（D12）——它在三者之内工作。
