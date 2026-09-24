# AGENTS.md

`dsh-claude-style` 是 DeepSeek Harness（DSH）Web GUI 的主题插件：复刻 Claude Code Desktop 的视觉与交互。

本文件中的每一条规则都是强制性的。违反任何一条都算违反：临时的、一次性的违反同样算；没被当场发现也算；出于好意、为了进度、为了帮忙的违反也算。规则之间的冲突优先级见「原则」末节。

## 行文规则

- 未被要求对比时，禁止使用「不是……而是……」「要……而不是……」等对比句式；没有需要对比的对象，就不出现对比。
- 方案必须充分考虑、一步到位；禁止「第一版先怎么样，观察后再怎么样」的措辞；确需提出多个方案时，几个方案必须各自成立、互相平行，禁止按稳妥到激进排列档位。
- 搜索与排查中被排除、不满足要求的结果，不再列举汇报。
- 回答不总起、不总结：禁止「一句话总结」「上述内容是某种概述，下面详细拆开」这类句子。
- 用词必须使用两个字及以上的完整形式（崩溃、终止、判定、推断、抛出、挂起、卡死），禁止单字缩写；代码标识符保持英文原名；禁止生造缩略说法；描述具体操作时使用完整的动宾结构，写清动作与对象。
- 禁用「落地」「钉死」「对齐」等黑话，使用不从事互联网行业的普通人也能看懂的常用词。
- 禁用「栈」字（技术栈、模型栈），直接说明具体事物。
- 禁止评判工作量：思考、回复、文档里都不出现「这是大重写」「工作量很大」这类说法。
- 禁止用 ASCII art 画示意图与表格；确需画图时使用 mermaid。

## 行为红线

- 需要的库直接 import；禁止用 try/catch 守卫 import。已记录的例外：docs/architecture.md D10 的双世代设置层；新增例外必须先写进该文件。
- 禁止擅自进入 plan mode。
- 禁止用 Git 回滚任何代码。用户所说的「回滚」一律指用编辑工具手动把代码恢复到上一个状态。
- 禁止读写系统临时目录；中间产物写到 `.debug/`（已 gitignore）。
- 用户给出网页链接时，先读完链接内的完整内容再开始执行；发现库的用法错误时，先重新读完该链接的完整内容。
- 不要求最小化依赖；禁止用造轮子的方式绕开依赖（本仓库「零构建工具链、零运行时依赖」是 D1 的架构约束，不在此列）。
- 代码 fast-fail：在出错位置就地抛错，不吞错误、不做静默 fallback。已记录的例外：docs/architecture.md D12 的特性级失败隔离是刻意决策，各特性 install/sync 的兜底保留。
- 禁止使用 mock、假实现、只为通过测试的 workaround。
- 用户会随时撤回或修改你的改动：继续编辑前先重新读取文件，在用户留下的最新状态上接着改；被用户删掉的内容不加回。
- 执行任务途中用户插问别的事：能马上回答就直接回答，答完立刻继续原任务，不干一半丢下。
- 修复文档或代码的错误时，更新不保留任何错误痕迹。
- 任何功能必须实施、运行、测试、迭代到正确运行为止；禁止初步实现后停下来要求用户测试。本仓库的验证门禁见「修改流程」。
- 禁止在命令行里内联超长多行脚本；需要执行脚本时先写成文件（放 `.debug/`）再运行。
- Python 文件开头不写 docstring、不写 shebang；注释用中文、术语保留英文；不过度注释。
- 禁止用程序化方式修改代码（heredoc、python 脚本、sed、perl 等），即使用户要求也不允许；一切代码修改走编辑工具。
- 禁止手写 parser 以字符串或字节流形式解析成熟文件格式；用第三方库解析，或者避免解析。
- 用户以疑问句结尾的话是问题：只回答问题；不顺便提出更优方案、不反问、不在结尾说「准备好了我就开始」。
- 被用户指出错误后，基于「该处是错的」的前提继续工作，不复述错误为什么错。
- 输出保持干净的最终态：回复、代码、注释、提交信息里不残留先前错误与修正过程的任何痕迹——被用户指出多做了的东西，删掉即结束，提交标题与注释里不再提起它。

## 原则

- 本仓库只做 Web 主题插件，不修改 DSH 引擎、apiproxy 或官方 UI 包；一切效果通过 CSS 覆盖与客户端 DOM override 在浏览器半边实现。
- 零构建工具链、零运行时依赖：`scripts/build.mjs` 把 `src/` 碎片按固定顺序逐字拼接成单文件 `lib/client.js`。不引入 esbuild/rollup 等打包器，不引入任何新依赖（DSH 模块加载器没有相对 require、没有资产 URL，这个架构必须保留，见 docs/architecture.md D1）。
- `lib/client.js`、`lib/model-descriptions.json`、`lib/claude-mark.svg` 是构建产物，禁止手改；改 `src/` 后跑 `npm run build`。`lib/index.js` 是手写的宿主半边，可以直接编辑。
- npm 包不分发 Anthropic Sans/Serif 字体；`fonts/` 仅供仓库下载，Anthropic 字体版权归 Anthropic 所有，不适用 MIT。JetBrains Mono 代码字体随插件包分发，采用 SIL OFL。
- 公开文档（README 双语、docs、CHANGELOG）不出现内部编号。
- 本地调试脚本、截图、中间产物一律收进 `.debug/`，不入库。
- 结构性改动前先读 `docs/architecture.md`（架构决策与权衡），不违背已记录的决策；确需推翻时先在该文档说明旧决策为何失效。
- 冲突优先级：用户当次指令 > 仓库代码现状 > 本文件 > docs/。被当次指令推翻的约定，由用户决定是否回填进文档，AI 不现场猜。

## 体量停止线（机械触发，不靠判断）

- `src/` 下任一碎片（.js/.css）接近 750 行：停止往里加新功能，先输出拆分提案等用户确认；提案未批准前该文件只做 bugfix。拆分布局与搬运纪律见 docs/architecture.md D13。
- 同一宿主选择器模式、同一 DOM 查询逻辑出现第 3 处副本：同样停下来提合并提案，不写第 4 处。
- 这两条是给执行模型的硬停止线，触发即停，不需要先判断「是否值得」。

## 命令

```sh
npm run build            # 拼接 src/ → lib/client.js，校验 %%TOKEN%%、CSS gate、语法与 model-descriptions.json
npm run smoke            # 对 lib/ 产物冒烟：宿主半边私有路由的栅栏；无头 Chrome 里启动、空闲 0 pass、不注入 markup、回车归宿主、特性隔离、teardown 干净
node scripts/probe.cjs --token <launch-token>   # 无头 Chrome 对运行中的 GUI 断言 composer 不变量
node scripts/probe-timing.cjs --token <launch-token>   # 分项计时：启动长任务与资源、模型目录就绪、打开延迟、行构成、锁定标 markup 解析、堆
node scripts/shoot.cjs --token <launch-token>   # 重拍 README 截图（docs/light.png / docs/dark.png）
```

probe / shoot 需要一个正在运行的 `dsh web` 实例，token 取自 GUI URL 的 `/?token=…`（或环境变量 `DSH_WEB_TOKEN`）；smoke 不需要，它用替身宿主页面检查产物。三者都需要本机有 Chrome/Edge（可用 `CHROME_PATH` 指定）。

## 仓库布局

- `src/` 全部源码：`constants.js`（常量与 185 个思考动词，构建期求值填 token）、`context/*.js`（host/prefs/model-copy/i18n）、`overrides/*.js`（selection/copy/permissions/model-brand/model-copy-lookup/model-effort/model-picker/effort-picker/hero-menu/quick-providers/account-footer/ban-screen/theme-flip/workspace-view/view-tabs/scheduler + 共享 popover-utils；拆出的辅助碎片：account-footer 的 profile/host-menu/footer-mirror 收在 `account/` 子目录，model-picker 的 catalog/rows 收在 `model/` 子目录，permissions 的 session-stats.js 放在特性旁边——拆分布局见 docs/architecture.md D13）、`settings.js`（设置页品牌切换）、`entry.js`（`apply()` 编排器）、`styles/**/*.css`（按 composer 与 components 拆分：composer/{hero,card,inline,inline-bar}、components/{permissions,account-footer,ban-screen,model-picker,effort-picker,popover,hero-menu,footer-takeover,third-party,settings,theme-flip}）、`assets/brand/*.svg`（品牌标识，构建期内联为 data URI）、`assets/icons/combine/*.svg`（厂商锁定标：图标 + 厂商字标合成为一个 SVG，构建期内联为 JS markup 表）、`assets/icons/*.svg`（手工提供的锁定标资产，与生成的 `combine/` 同级，vendoring 时优先于联网抓取）、`model-descriptions.json`（模型文案数据 + `brands` 品牌绑定与 `brands.lockups` 覆写表）。
- `lib/` 产物：`client.js`（生成）、`index.js`（宿主半边，手写，提供 `/dsh-claude-style/model-descriptions.json` 等私有路由，安全约束见 docs/architecture.md D11）、`model-descriptions.json`（构建期复制）、`claude-mark.svg`（构建期从 `src/assets/brand/claude-mark-clay.svg` 复制，即 `package.json` 的 `icon`——0.1.7 插件清单读它做插件卡片图标）。
- `locale/`（插件元数据本地化）：`<语言>.json` 的 `meta.title` / `meta.description`，0.1.7 插件卡片与详情页读它；`exports` 必须用通配 `"./locale/*"` 覆盖——宿主逐文件走 exports 解析，漏一个就会在枚举时抛错，并把整份元数据（含图标）降级成 `meta.error`。
- `skin.json` 皮肤清单；`cordis.patch.yml` 把 `ui-skin-claude-style` 插入 web roster。
- `scripts/` 构建与回归工具（`fetch-lobe-combines.py` 是唯一联网脚本，手工运行、不进构建；它按 `model-descriptions.json` 的品牌表抓取 Lobe 素材并合成锁定标）；`docs/` 文档与截图；`fonts/` 字体文件（JetBrains Mono 已入包，Anthropic 字体仅仓库下载）。
- `.debug/`、`node_modules/` 不入库。

## 核心约定

### CSS

- 每条规则必须挂在 `body[data-dsh-claude-style]` 之下；暗色 token 为基础，亮色覆盖写在 `:not([data-ds-dark-theme])` 下。亮色主画布 `#FCFCFB`、暗色 `#141413`、强调色陶烬橙 `#D97757`，不用纯白纯黑和冷灰。
- composer 相关规则必须位于 `/* @composer-gate */` 标记之下；构建会把 `[%%COMPOSER_ATTR%%]` 门控盖到标记以下每条规则上，漏盖即构建失败（见 docs/architecture.md D4）。
- 设计令牌与形状规则见 `docs/STYLE.md`，改视觉先读它。

### 宿主选择器纪律

宿主使用带哈希的 CSS-module 类名。两条不可违反：子串匹配只用**最长稳定片段**（`[class*="_row"]`，绝不写 `[class*="row"]`）；不得覆盖 `[class*="viewArea"]` 上宿主的活跃期布局契约。新增子串选择器后必须检查误伤。事故背景与细则见 `docs/STYLE.md` 与 docs/architecture.md D3。

### JS 碎片

所有碎片共享一个工厂作用域：**禁止 import/export**，保持 4 空格基础缩进与 ES5 风格；`%%TOKEN%%` 由构建替换，产物不得有残留；React 只能经加载器 `require('react')` 取得。碎片清单与拼接顺序见 `scripts/build.mjs`；辅助碎片导出顶层 `createX(...)` 工厂、特性经 entry.js 的 FEATURES 表统一安装与排序，契约见 docs/architecture.md D13。

### 模型文案是数据，不进 bundle

- `src/model-descriptions.json` 构建期校验后**复制**到 `lib/`，浏览器半边首次绘制选择器时经宿主路由 fetch。扩文案表不需要改 JS。
- 每条是 `{ locale: text }`；查找按 精确条目 → 家族规则 → 档位规则 → 目录自带文本 逐级降级。
- 文案是产品线的文案：按名字模式映射，版本迭代与退场都不改这句话；不写自行添加的档位前缀（「旗舰档：」之类）；不重复行里已有的模型名。
- 家族规则有序且必须锚定（如 `flash` 规则限定在 deepseek 内）；**一律不写「最强/旗舰」等最高级**——最高级只允许出现在绑定具体版本号的精确条目里，否则旧模型会被误称旗舰。完整口径见 docs/architecture.md D5。

### 截图与隐私

- `shoot.cjs` 落盘前把工作区名/会话标题/用户名/盘符路径/余额替换为中性替身并做泄漏扫描，扫描不过即失败，不得绕过。

## 修改流程

1. 改 `src/`（CSS 或 JS 碎片），不碰 `lib/client.js`。
2. `npm run build` 重新生成产物并过语法门禁。
3. `npm run smoke` 对产物跑替身宿主冒烟；有 `dsh web` 实例时再跑 `node scripts/probe.cjs --token <token>` 断言 composer 不变量（固定底部、单行起步、随内容增长、清空还原）。
4. 视觉变更由用户人工核对亮/暗两态；README 截图过时则用 `shoot.cjs` 重拍。
5. 同步文档：README 双语（`README.md` 中文 / `README.en.md` 英文）一起改；行为变更记入 `CHANGELOG.md` 的 `[Unreleased]` 节，版式见「Git 与发布」。
6. 功能以全部门禁通过、行为验证正确为完成标准；门禁不过就继续修，不交给用户测试。

## Git 与发布

- 使用 conventional commit 前缀（`fix(scope):` / `refactor(scope):` / `docs(scope):` / `chore(release):` 等），一个逻辑变更一个 commit，不提交 WIP，不混入无关改动。
- 提交前必过：`npm run build` 成功且 `lib/` 产物与 `src/` 同步（产物随源码一起提交）；工作树无杂物。
- 发布流程：更新 CHANGELOG → `npm version patch|minor` → 打 tag → `npm publish`（`prepublishOnly` 自动重跑构建）→ GitHub Release，发布说明取自 CHANGELOG 对应版本节。
- CHANGELOG 版式（与 dsh 上游发布说明同规范）：
  - 版本节：`## [x.y.z] - YYYY-MM-DD`，最新在最上；开发中的改动记入 `## [Unreleased]`。
  - 每节双语同页：先 `[中文](#cn-x.y.z) | [English](#en-x.y.z)` 语言切换行，再 `<h3 id="cn-x.y.z">新增功能</h3>`（中文）与 `<h3 id="en-x.y.z">New Features</h3>`（英文）两个锚点——锚点 id 必须带版本号，避免同页多节同名冲突；每种语言内的后续分组用普通 `###` 标题。
  - 分组固定、顺序不变：中文 `新增功能` / `体验优化` / `问题修复` / `安全` / `移除` / `其他变更`，英文 `New Features` / `Improvements` / `Bug Fixes` / `Security` / `Removals` / `Chores`；没有内容的分组整组省略。
  - 节尾：`**Full Changelog**: [v上次...v本次](compare 链接)`。
  - 内容口径：一条一个可验证的行为或契约，不写实现流水账；对外契约变化（设置项、私有路由、宿主版本要求）必须显式点名；性能类改动带本机实测数字；面向用户的行为变更与 README 双语、docs 同步。
  - 不写内部编号，不写「AI 化」套话与自述性说明文字（版式说明写在规范里，不写在版本节里）。
