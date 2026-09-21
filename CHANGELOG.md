# Changelog

## [Unreleased]

### Added
- **声明最低运行时与商店截图清单**：`package.json` 的 `dsh` 对象新增 `engines.dsh: ">=0.1.5-rc.2"`（README 标注的实测版本），dsh-market.com 的插件卡片、插件管理器的更新检查与 awesome-dsh-plugin 商店的 host-aware 过滤都会读取它，避免在不满足条件的宿主上被安装或被误判不兼容；仓库根新增 `screenshots.json` 指向 `docs/light.png` 与 `docs/dark.png`，供 dsh-market 等商店以 App Store 式截图展示——截图随仓库推送更新、商店夜间构建自动拾取，之后换图不必再提任何 PR。
- **模型选择器里 Gemini 行的名称改用 Google Sans Flex**：模型行自 0.2.7 起带厂商标识，但名称仍与其他行同一字体——「这是 Google 的模型」这个信号只给了一半，同一行里标识说厂商、字体说本主题。现在 Gemini 行的名称用上游 Google Sans Flex 的标准字重正体绘制，与标识构成同一个信号。字体由 `scripts/slim-google-sans.py`（手工工具，不进构建——它需要 Python 与 fontTools，而本仓库的 Node 构建必须保持零依赖）从 4.2 MB 的六轴可变字体得到：6 个轴全部钉在**字体自身的默认值**（wght 400 / slnt 0 / wdth 100 / GRAD 0 / ROND 0 / opsz 18，默认值读自 `fvar` 而非写死，上游改默认值时这里不会静默改变「标准」的含义），只保留拉丁字母、数字与标签用得到的标点（ASCII 可打印、不换行空格、间隔号、长/短破折号、弯引号、省略号），并且只保留 `kern` 特性——标签里不该发生连字替换。产物 9 KB，随 npm 包分发，采用 SIL OFL 1.1（`fonts/OFL-GoogleSansFlex.txt` 带上游版权声明与许可证全文）。家族名改为 `Google Sans Flex Picker`：上游没有声明 Reserved Font Name，子集沿用原名并不违规，但一个只含拉丁字符的同名字体会在页面上盖掉用户系统里安装的完整版。样式表的挂载点是行上的 `data-brand`（厂商标识 id）：今天只有 Gemini 解析到字体，其他厂商的行保持界面字体，将来给别的厂商加字体是加一行 CSS 的事；字体栈把界面字体留在后面，子集覆盖不到的字符逐个回落而不是变豆腐块。

### Changed
- **亮暗切换时输入框一带「先色后样」已修复**：皮肤为 hover/focus 调的 0.12s 边框/阴影过渡（composer 卡、输入域、附件轨、hero 托盘）在主题翻转时被重放——画布随 CSS 变量一帧重绘，输入框的边框与 halo 却慢半拍缓入，亮暗切换的瞬间输入区一带肉眼可见分两步换。现在翻转瞬间在 `<html>`/`<body>` 上挂一个只存活约 0.3s 的抑制属性（`html[data-dsh-theme-transitioning] body[data-dsh-claude-style][data-dsh-theme-transitioning] * { transition: none !important }`），并在同一微任务里强制刷一次样式后取消所有进行中的绘制类过渡（`getAnimations()` 里 `transitionProperty` 属于边框/阴影/颜色/背景的 `cancel()`）——属性当帧跳到终值，盖住抑制规则特异性够不着的几条高优先级规则（输入域 (0,6,1)、附件轨 (0,7,1)）。窗口结束即恢复，日常 hover/focus 的 0.12s 手感不受影响；只取消主题会改的绘制属性，transform/opacity 过渡（悬停、菜单反馈）照常运行。
- **composer 形态判断从 CSS 结构感知的 `:has()` 改为 JS 写属性，降低流式输出期间的样式重算开销**：皮肤原先用约 60 处 `[class*="composerStack"]` 上的 hero/inline 分支（`[class*="composerStack"]:has([class*="heroWorkspaceRow"])` 及其 `:not()` 形式）在 CSS 里判断输入卡处于主屏 hero 形态还是会话内联形态。流式输出时每秒几十次 DOM 变更，每次都要重算这些昂贵的选择器，是渲染压力的主要来源。现在 `syncSegments()` 在每轮 pass 里把同一个 `data-composer-variant="hero|inline"` 属性镜像写到卡片所属的 `composerStack` 祖先上（写前比对旧值避免同值重复写触发无谓的样式失效，同轮去重避免多卡命中同一栈反复写），CSS 改为直接读属性：hero 分支读 `[class*="composerStack"][data-composer-variant="hero"]`，inline 分支读 `[class*="composerStack"]:not([data-composer-variant="hero"])`。属性缺席时按 inline 渲染——inline 是流式高频路径，首帧不闪；hero 屏无流式，属性在首个 pass 补上即可。交互驱动与低频的 `:has()`（`:hover`、`:focus-within`、弹窗、placeholder）按原样保留。
- **设置页 Claude Style 导航 Tab 图标替换为 Claude 标识**：设置弹窗内「Claude Style」Tab 默认由宿主回退为通用的齿轮图标（`IconSettingsOutline16`）。现通过 CSS 蒙版与调度器轻量属性标记，将其替换为黑色的 Claude 经典星芒图标（亮色模式下为纯正墨黑，暗色模式下随文字主色白亮），与左侧导航栏其他选项的视觉语汇保持一致。
- **亮色模式背景层级色调调优**：为解决浅色界面在纯白控件反衬下局部偏黄的问题，将亮色模式的背景层级收敛至更清爽中性的象牙白阶梯：一级层级（`--dsw-alias-bg-layer-1`）对齐主画布采用 `#FCFCFB`，二级层级（`--dsw-alias-bg-layer-2`）调整为 `#FBFBF9`，三级层级（`--dsw-alias-bg-layer-3`）调整为 `#F9F9F6`；设置弹窗面板亦对齐主画布底色（`#FCFCFB`），保持整体视觉明净统一。
- **去 AI 化与精简**：清理 `.debug/` 临时调试日志与历史规划文档；移除 `src/overrides/` 拆分残留的旧章节编号与重复注释；精简 README 冗余功能表格并修正更新日志中对内部开发路径的提及。

### Fixed
- **新对话页只贴图不打字时 hint 发黑、位置跑到输入框外**：宿主只在「草稿为空**且**没有附件」时才渲染自己的 placeholder（`draft === "" && attachments.length === 0`），所以在新对话页贴一张图、不打字，它会把自己的 hint 摘掉，改由皮肤的兜底节点接手——可那个节点身上没有任何宿主类名，而皮肤原有的 hint 规则只覆盖对话里的单行输入框（`data-composer-variant="inline"`），于是它退回成普通块级元素：用卡片正文的墨色（看着发黑），并且排在输入框**下面**而不是里面。现在给 hero 变体的兜底节点补上宿主那套定位与墨色（`position: absolute` + 宿主自己的 `inset: 4px 8px auto 14px`，caption 灰、单行省略），hint 回到输入框首行。验证时把宿主 composer 的样式表与构建产物里的皮肤样式表拼成 mock，逐项对照兜底节点与宿主自带 placeholder 的计算样式（8 项检查，含「修复前不成立」的反证）。
- **inline 输入框聚焦时的底纹把输入框刷成了另一种颜色**：会话内单行输入框聚焦时，画布色的三层底纹（`box-shadow`）原本挂在 rail 上，而 rail 是 `z-index: 4`、输入框本体是 `z-index: 2`——底纹于是刷在输入框**上面**：盖住输入框自己的背景（两个盒子读起来不同色），也盖住草稿第一行。现在底纹移到卡片（`[data-composer-card]`）身上，与 hero 卡片同一位置，所有子元素共用一个底纹，谁也压不住谁；rail 那份去掉，亮暗两态的 rail 规则只保留描边色。
- **封号彩蛋语言选不动**：设置里选「中文」立刻弹回英文，且没有任何提示。根因是宿主半边（`lib/index.js`）只在 app 启动时被 import 一次，而它是后来才认识 `banLocale` 这个字段的——旧宿主半边的写入口不认这个键，把它丢掉之后按「没有可写字段」当成一次读取返回，客户端拿到原值就把刚做的选择覆盖回去了（浏览器半边每次刷新都是新的，宿主半边不是，两边版本就此错位）。现在 `banLocale` 与用户名走同一套浏览器本地兜底：宿主不认这个键时把选择存在本地（`localStorage`）并立刻按它渲染，页面刷新后仍在；等宿主半边重启、第一次读取时自动把待写入的值补写一次，宿主回显确认后本地兜底才清除——所以选择既不会丢，也不会和宿主长期打架。

## [0.3.0] - 2026-09-20

### Added
- **账户横条彩蛋：Claude 封号页**：侧栏底栏账户弹层顶部那条用户名横条现在可以点，点开是 Claude 官方「Your account is on hold」封号页的完整复刻（手绘锁形图标、`account_banned` 提示条、三步复核流程卡片、申请复核按钮、导出数据/删除账户两条操作）。它只是彩蛋——不改宿主状态、不碰会话与设置，只是一个挂在 `<body>` 上、退出时移除的全窗口浮层，因此能盖住标题栏、侧栏与输入区，也不会被侧栏列宽裁掉。退出全是明确动作：页面上的每个按钮（退出登录、申请复核、两条操作、提示条、窗口控制）都能关掉它，`Esc` 也能；点页面空白处不会关。**切走窗口不会关**——这页是用来读的，读者很可能要切出去查点东西，一失焦就消失比多留一会儿更糟，所以窗口失焦那条退出路径已经拿掉。品牌偏好同样生效——选 Anthropic 时页头换成 `A\` + ANTHROPIC 字标，选「关闭」时只留 Claude 字标。
- **`封号彩蛋语言` 设置**：彩蛋那页的语言由设置（`Ctrl+,` → Claude Style）单独决定，可选中文/英文，默认英文；文案仍走 `model-descriptions.json` 的 `ban` 块。之所以不让它跟随界面语言：那页复刻的是 Claude 的真实界面，按它本来的语言读才对。改语言会立刻重建已打开的那一页，时间戳的时钟也跟着换（英文 AM/PM、中文 24 小时制）；该值存在宿主设置命名空间的 `banLocale` 字段，读取端对未知值一律回落到英文，手改配置不会把页面变成空白。

### Changed
- **封号页的锁改为手绘描摹**：那页顶部的锁此前是 `rect` + `circle` 拼出来的标准图标，跟参考草图的手绘气质不搭。现在整把锁按参考图（89×92px）的墨迹中心线逐锚点描摹成三条三次贝塞尔路径——方框的每条「直」边都带一点自己的倾斜与漂移（顶边右低、底边微垂、左边下行时外移、右边绕过锁孔处外鼓再收回），四角用一小段斜线收口，锁梁里外两拱不同心、两条腿停在方框顶边上而不穿过它，锁孔的头部比正圆扁、腰身偏右、底座比头更宽。手绘感来自锚点本身，不是滤镜也不是随机抖动，所以缩放到任何尺寸都成立；锚点数值整体映射到图标集统一的 24 单位格（墨迹 15.3×20 单位居中），图标框 58px → 75px（墨迹 47.5px → 62.8px，约 +32%），描边 0.5 单位。选这两个数是量出来的：参考页里「锁的墨迹高 ÷ 标题墨迹高」是 3.08，改完是 2.70（此前 2.05）；参考页的「线宽 ÷ 锁高」是 0.025，改完实测 0.0250（此前 0.075，粗了近三倍）。
- **修掉 `banSvg` 的重复属性**：图标助手此前把 `stroke-width` 追加在 `<svg>` 已有的一条之后，形成重复属性——HTML 解析器只认第一条，于是覆盖静默失效，锁实际按图标集的 1.6 画（在 58px 框里近 3.9px），这正是它看起来「线条太粗」的原因。现在粗细是 `banSvg(body, strokeWidth)` 的形参，只发一条属性，杜绝属性覆盖失效。
- **点击展开的账户弹层不再被鼠标移出关掉**：此前点账户按钮展开弹层后，指针一离开按钮（弹层挂在按钮下方，指针必须离开）就被 `mouseleave` 关掉，等于点开即关、弹层里的条目够不着；现在点击展开的弹层改为由「点击别处」或「移出整个底栏」关闭，悬停展开仍按原来的延迟关闭逻辑。
- **账户弹层：账号名下的横线移出 hover 区**：弹层顶部原来是「整块（含横线）在 hover 时整体铺底」，指针扫过横线也会亮；现在横线是账号行的兄弟节点、归弹层所有（左右通栏到弹层内边距边缘），hover 底板只覆盖账号名那一行。
- **封号页排版**：内容列由靠左改为水平居中；页头（左上角品牌标 + 右上角 Sign out 与窗口控制）整体下移 30px。
- **行内代码片收紧**：行内代码（`` `npm run build` ``）的圆角矩形此前继承正文行高（15px 代码字号配 23px 行盒），上下各空出约 5px 底纹，显得虚胖。现在代码片自带 `line-height: 1.2`，行盒收到 18px、整片高度 27px → 22px，1px 内边距成为唯一的可见内缩；再小就开始切字形下伸部。底纹、描边、圆角、字号不变，正文段落/表格/标题的行距不受影响。

### Fixed
- **回退引用块的链接材质**：0.2.7 把 Markdown 引用块（`blockquote`）改成了链接材质（蓝字 + 蓝色下划线 + 蓝色底纹/竖条），但引用是**容器**而不是链接，这套样式会连同块内的行内代码、文件引用一起染蓝，等于让链接材质泄露进引用块。现回退为原来的中性灰：文字 `#B0AEA5`（亮色 `#6E6A60`）、灰底 + 灰竖条，块内的链接、行内代码片、文件引用各自保持自己的材质，互不串色。`padding` 也不再需要 `!important` 钉死。
- **文件引用（行内文件名）颜色与超链接不一致**：聊天里的 `` `CHANGELOG.md` `` 这类**文件引用**是宿主把行内代码里的文件路径解析成按钮（`.fileMention`）后的产物，但皮肤的通配行内代码规则（`code:not(pre code)`，特异性 (0,2,1)）压过宿主自己的链接色类（(0,1,0)），于是同一段话里文件引用是代码片的暖红、真正的超链接是链接蓝。现在文件引用的文字改用链接色（亮 `#184F95` / 暗 `#8AB4F8`）、字重 500，下划线沿用超链接那一套（静止态实线、链接色调 60%、1.5px、offset 2px；hover/focus 同样实线、换成不透明的链接色，**线宽与线位不变**），**代码片本身完全不动**——底纹、描边、圆角、内边距与普通行内代码逐项相同，只有文字颜色不同。hover 规则只改颜色：先前用 `text-decoration` 简写会把 `text-decoration-thickness` 重置为 `auto`，导致 hover 时下划线反而变细。普通行内代码仍是暖红代码片；宿主类名带哈希，故按仓库纪律取最长稳定片段 `[class*="_fileMention"]`。
- **修复 Markdown 表格左侧空隙**：删除旧的全局 `table { width:100% }`、`table th` 背景与 `td/th { padding: 0.6em 0.85em !important }` 规则，避免覆盖宿主 `th:first-child { padding-left: 0 }` 和 `width: max-content`，表格过宽时不再出现左侧空白与外部边框错位。 同时对全部 `.tableScroll` 包装器强制 table margin/padding/border-spacing 归零，首/末单元格恢复 16px 内边距，并把表头背景与行线覆盖到 `thead th/td` 和每行首末单元格（th 或 td），使首列的留白看起来是表格内部区域而不是空隙。 另外，窄表不再被宿主 `.tableFill` 拉满：`.tableScroll` 宽度限制到正文内容块 `--dsh-chat-content-width` 并居中，表格用 `min-width: 100%` 撑满内容块；宽表保持 `max-content` 并保留横向滚动。

## [0.2.7] - 2026-09-20

### Added
- **模型选择器厂商标识**：模型行显示**模型所属厂商**的标识（而非转售该模型的 provider），「更多模型」的 provider 分组标题显示该 provider 的标识。标识取自 [Lobe Icons](https://lobehub.com/icons) 的静态 SVG（`@lobehub/icons-static-svg`，MIT），按仓库既有架构在构建期内联进 bundle——`@lobehub/icons` 是 React 组件包，装它就要破坏「零依赖、零打包器、单文件产物」这条约束。用单色字形（`fill="currentColor"`）随主题文字色绘制，亮暗两画布都清晰，也不与「陶烬橙唯一强调色」冲突；彩色变体不做——OpenAI、Anthropic、xAI、Moonshot、Z.ai、Vercel、Groq 等 12 家上游本就没有彩色版，且部分厂商色在 `#141413` 画布上不可见。绑定关系仍是数据：`model-descriptions.json` 的 `brands.providers` / `brands.models`，构建期校验引用的标识都已 vendored，写错即构建失败。

### Changed
- **Markdown 引用块改用超链接材质**：引用（`blockquote`）此前是中性灰文字 + 灰底灰条，与超链接毫无关联；现改为与 Markdown 链接同一套材质——链接蓝文字（亮 `#184F95` / 暗 `#8AB4F8`）、静止态同色下划线（1.5px、offset 2px，与链接逐项一致），底纹与左侧竖条取该蓝色的淡色（亮 `rgba(24,79,149,.08)` / `.45`，暗 `rgba(138,180,248,.12)` / `.55`）。引用与链接本就是同一类信号（「这段内容来自别处」），故共用一种材质；正文衬线字体不变。同时把引用块 `padding` 钉死，宿主 `.markdown blockquote` 的 `padding-left: 14px` 不再吃掉右侧内边距，底纹左右等宽。
- **文本选区改为实色两态**：选中文字不再用半透明陶烬橙，改为平台式实色——窗口聚焦时蓝底白字（`#3366D0` / `#FFFFFF`），窗口失焦时灰底黑字（`#C7C7C6` / `#000000`），亮暗两画布一致。选区是瞬时操作而非界面表层，因此不跟随主题；两态都是实色且带 `!important`，覆盖底下的链接色、行内代码色与语法高亮色，避免"蓝底上保留原文字色"导致读不清。CSS 无法读取窗口焦点（Chromium 走内部 `-internal-inactive-selection-*`），故由新增的 `src/overrides/selection.js` 把焦点态镜像到文档属性上，样式表据此切换；失焦时选区本身保留，不消失。
- **接入 cc-switch 全量供应商图标**：`src/assets/icons/providers` 引入其 107 个图标，build 解析 `index.ts` / `metadata.ts` 生成 `PROVIDER_ICONS` / `PROVIDER_ICON_METADATA`，宿主新增 `/dsh-claude-style/icons/providers/*` 路由；模型选择器优先用 cc-switch 图标，缺失时回退 Lobe。
- **更多模型供应商标签改为推挤式 sticky**：每个供应商包成 section，滚动时上一个标签被下一个 section 往上推，而不是直接覆盖。
- **附件输入框接缝优化**：移除附件轨 focus 时 1px 内圈阴影，消除图片区与文字区之间的分界线和阴影。
- **更多模型子弹层**：适当提高弹层高度；供应商标签改为 sticky 顶部条，滚动时由下一个供应商标签替换。
- **更多模型 provider 标签强化**：provider 分组标题改为黑底白字圆角矩形；深色模式为白底黑字。
- **模型触发器 hover 去重**：删除 trailing 下针对 trigger/model 的额外 hover 规则，只保留模型触发器自身一层背景。
- **标题中文回退改为黑体**：SERIF 栈移除 CJK 衬线回退，中文落到 Noto Sans SC / 微软雅黑等黑体；西文仍保持 Anthropic Serif / Georgia / Times。
- **统计弹层合并**：统计行允许收缩省略（如 20轮...）；隐藏宿主两个独立弹层，改为一个自定义弹层：上下两个区块（会话统计 / Token 用量），每块 2×2 网格，无总标题，风格与权限弹层一致，内容字号加大。
- **统计区交互**：统计弹层改为 hover 打开；统计控件仅在鼠标位于整个对话窗口内时显示。 统计行占据中间剩余空间并居中，使到左侧按钮组和右侧模型选择器的距离一致。
- **输入区统计合并重绘**：会话统计与 token 统计合并为一条居中的紧凑文本（如 23轮439步 · 130tok/s · 125M tok · 99% Cache），隐藏宿主图标与原始标签，两个统计弹层同步重绘为同一套字体/圆角/边框。
- **模型选择器补充当前非官方模型**：当前选中模型不属于 DeepSeek 官方服务时，在官方模型与更多模型之间用横线分隔并额外显示一行 provider/model。 触发器同时去掉向下箭头，hover 背景只保留在整个触发器上。

## [0.2.6] - 2026-09-20

### Added
- **JetBrains Mono 免安装生效**：代码字体此前虽随包分发，但只在用户把字体装进系统后才解析；现由宿主半边新增 `/dsh-claude-style/fonts/*` 路由直接随包提供字体文件，浏览器半边以 `@font-face`（`font-display: swap`）注册为 webfont——未安装 JetBrains Mono 的系统上代码字体也立即生效，路由缺失时静默回退原系统字体栈。
- **Anthropic 字体可选免安装**：`fonts/*` 路由同时放行 `AnthropicSansWebText.ttf` / `AnthropicSerifWebText.ttf`（均不进 npm 包，版权仍属 Anthropic）。用户把这两个文件放进插件包的 `fonts/` 目录后，宿主即以 webfont 提供，与系统安装效果一致；文件缺失时路由 404，字体栈回退到系统安装的副本，不影响未放置字体的用户。

### Changed
- **代码块与表格样式对齐 Claude**：行内代码与代码块字号 -1px；代码块边框移到外层容器，语言标签与代码共用同一圆角边框；Markdown 表格字号提升一档（13px → 14px）、表头 #F0F0EF 背景、12px 圆角，并使用与内部横线一致的 0.5px 线条加外边框。
- **设置页支持自定义用户名**：新增用户名输入框，输入停顿后自动保存；默认用户名由宿主 OS 用户解析一次并缓存，不再解析工作区路径或轮询；宿主半边未重载时浏览器本地回退保留自定义值。
- **链接与行内代码样式对齐 Claude**：Markdown 链接下划线静止态 60% 不透明度、hover/focus-visible 恢复 100%，下划线加粗到 1.5px 并保留下划线避让；行内代码与代码块均改用 JetBrains Mono、字号强制与正文一致，并 +1 字重；代码字体栈补上正文 CJK 回退。行内代码背景矩形 padding 缩到 1px、背景色进一步减淡，边框与 composer 输入卡片非焦点态一致（1px solid --dsw-alias-border-l1）；Markdown 正文行高 -1px、段落间距 -4px，代码块外边距与行高同步对齐正文。新对话页 composer 卡片保留纯白填充与真实投影，仅移除背景色光晕阴影。排队消息、后台任务、目标栏提升到消息层之上，避免被消息卡片遮挡；排队 dock 上移 3px，使其下沿对齐输入卡片边框。
- **代码字体从 Anthropic Mono Variable 替换为 JetBrains Mono Variable**：选用 JetBrains Mono 可变字体（含 Italic）作为代码字体，随插件库一并分发，并保留 SIL OFL 许可证。
- **权限弹层改为 hover 态打开**：权限分段按钮悬停时打开权限弹层，移入弹层取消关闭，移出后延迟关闭；`autoPopover` 关闭时仍保持点击打开/关闭。

## [0.2.5] - 2026-09-20

### Added
- **模型文案改为运行时读取的数据文件**：文案表迁出 bundle，落到 `src/model-descriptions.json`（构建时校验后随包发布为 `lib/model-descriptions.json`）；宿主半边新增 `/dsh-claude-style/model-descriptions.json` 路由按请求读取该文件，浏览器半边在首次绘制模型选择器时 fetch 并按需缓存。此后扩充文案表无需重新构建、也不进 bundle（产物内已无任何模型文案）。解析按「精确条目 → 家族规则 → 档位规则 → 目录自带文本」逐级降级；精确条目按**归一化模型 id** 建键，同一模型被多个 provider 转售（`deepseek-v4-flash` 同时在 deepseek-official 与 opencode-go）折叠为一条；家族规则有序且锚定，且**一律不带最高级**——「最强/旗舰」只写在钉住版本的精确条目里，否则旧版本（如 `gemini-1.5-pro`）会被误称旗舰。取不到文档时静默回退目录自带文本，不影响选择器可用。
- **补充新模型线文案**：为 Artificial Analysis 榜单上此前未收录的模型线补写家族规则——Meta Muse Spark（Agent 与编码线，与 Llama 开源线区分）、Celeris-1 与 Inception Labs Mercury 2（扩散式 LLM，措辞按延迟而非能力展开）、Apodex（复杂专业工作的 Agent）、Motif 3（韩国 Motif Technologies 全自研开源权重 MoE，314B 总参 / 13.2B 激活）。榜单头部 40 个模型现已 100% 命中；仍未收录的新模型线按设计回退到目录自带文本，不编造文案。

### Fixed
- **模型文案的两处误判**：其一，参数量档位规则 `\d+b` 未锚定，把 MoE 命名里的激活参数当成总参——`qwen3.8-2.4t-a95b`（2.4T 总参）与 `k2-horizon-375b-a23b` 都被读成「小尺寸稠密模型」；现拆出 `a\d+b` 激活参数规则并让稠密规则要求数字前有分隔符。其二，provider 兜底对多产品线厂商过于宽松，`north-mini-code` 被按 provider 名匹配成 Cohere Command；现补 `north` 家族规则。另补 `gpt-oss` 开源权重系列规则，并去掉家族规则里的最高级表述（见上）。

### Changed
- **源码按特性级分片重构**：`src/overrides.js` 拆为 `overrides/*.js`（copy / permissions / model-picker / account-footer / scheduler + 共享 popover-utils），`src/context.js` 拆为 `context/*.js`（host / prefs / model-copy / i18n），CSS 按 composer 与 components 拆为独立文件；build.mjs 改为清单驱动并新增碎片守门（禁 import/export、强制 4 空格缩进）。调度器不再读取特性闭包变量，改为通过 `ui` 句柄注册表调用各特性的 sync/close/owns/reposition/invalidateCopy 等接口；`settings.js` 不再重复调用 `loadPrefs()`。构建产物 `lib/client.js` 仍为单文件，不引入新依赖。
- **模型文案跟随全局语言、单行显示**：描述按 shell 自身的 `locale` 服务取当前语言（`zh` / `en`），每行只渲染一条，不再中英两行叠加；并订阅 locale 变更，切换语言时已渲染的弹层即时重绘。选择器自身的 UI 文案（触发按钮 aria、加载中、空目录、推理等级、More models）走同一路径，bundle 内只保留取不到文档时的中性英文兜底。

### Fixed
- **塌缩态底栏插件控件压住 Claude 标**：皮肤把 `settingsArea` 压成零尺寸（保留 `overflow: visible` 让浮层可画），展开态下这足以把条目挤成 4px 细条；但设置插件带了自己的 rail 变体（`…_rail`），塌缩时拿到固定 36×36 并逃出零尺寸盒子，正好压在账户控件的 Claude 标上。现于塌缩态隐藏 `settingsArea` 内的按钮与 `triggerRow`；可达性不受影响——弹层镜像项用 `realTrigger.click()` 驱动真实触发器，`display:none` 不阻断。
- **塌缩态账户弹层被侧栏容器裁掉**：侧栏列宽 56px 且 `overflow: hidden`，弹层原本 `position: absolute` 锚在轨道右侧，越过轨道边缘即被整块裁掉（同时基础规则的百分比 `max-width` 以 59px 页脚为基准把它压成 43px 宽）。现塌缩态改为 `position: fixed`（祖先链无 `transform`/`contain`，故不受该 `overflow` 裁剪），坐标由 `positionAccountPopover()` 解析（内联 `!important`，因为样式表侧同样用 `!important` 锚定）；过渡桥同步由「朝下」转为「朝侧」。
- **修复设置页（含 SubAgent 分页）文字整页消失**：皮肤为隐藏侧栏底栏原按钮，把 `footArea` 下的 `settingsArea`/`footerActions` 容器压成零尺寸并写了 `font-size: 0 !important; line-height: 0 !important`（保留 `overflow: visible` 让浮层可画）。但宿主设置弹窗是**就地渲染**在 `settingsArea` 子树里的（弹窗 overlay 是触发行的兄弟节点，没有 portal），零字号/零行高沿子树继承——官方组件只给文本行设了 `font-size`、没设 `line-height`，继承到 0px 行高的行盒直接塌成 0 高，整页文字"消失"。现把两个容器的折叠拆开：`settingsArea` 只保留几何折叠（零宽高 + `overflow: visible`），字体度量恢复自然继承——它除了被 `display: none` 的触发行就只剩就地弹窗，无需零字号兜底；`footerActions` 仍托管着会被镜像改道的插件原始条目，散落的行内文字仍需零字号压住，维持完整折叠。

## [0.2.4] - 2026-09-19

### Changed
- **深色模式输入框焦点由"加深"改为"提亮"**：近黑画布上黑边毫无辨识度，深色焦点描边与 1px 晕边从纯黑改为亮象牙（`#faf9f5`，描边 45% / 晕边 18%），输入框聚焦时明显亮起，底栏托盘与键盘 `:focus-visible` 外框同步改为亮象牙；暗色投影保留作真实阴影深度。
- **权限弹层列表间距加宽**：Read / Edit / Auto 预设行为两行行（标签 + 说明），原先 2px 的行间距糊成整块；行间距加宽 4px 至 6px，弹层不再拥挤。
- **会话统计并入输入框工具栏同一行**：轮次/速率与 token/缓存两组统计 pill 原先在输入框下方独占一行，现移入工具栏行、居于左侧控件与右侧模型/状态组之间（行布局 space-between 自然居中），输入框区域由三行压为两行；宿主把 pill 放回原位时每轮同步自动归位，窄屏（≤820px）仍整体隐藏；host 全宽行依赖的 width/padding/margin 在行内规则中全部重置。
- **统计 pill 改为悬停出现**：两组统计平时隐藏（保留占位、无重排），鼠标移入对话窗口（composer）时淡入；pill 位于卡片内，悬停即保持可见可点。
- **附件轨与输入框之间的分界线消除**：有图片时卡片 8px flex 间隙会把画布透成一条接缝线；以负外边距闭合间隙并把 8px 移入输入框顶部内边距——文字与图片的距离、卡片总高均不变；附件态聚焦环改由附件轨独自承载，接缝不再出现第二条线。
- **非对话页隐藏整个底部输入区**：宿主把 composer 挂在会话根下、轨迹/上下文页同样渲染（还为其预留了底部空间）；现在仅对话页签激活时显示，其余页签隐藏整个 seat（宿主 `--dsh-composer-height` 随之归零，轨迹 ledger 的底部留白一起收起）。页签检测限定在会话根的 tablist（对话视图 order 0 恒为首个 tab，与语言无关）。
- **模型选择控件按 Claude 效果重构**：触发器去掉数据库图标、只保留模型名（+ 推理等级）与箭头，整体单一 hover 背景（不再是多块背景矩形叠加）；弹层不再两段 drilling，一级直接列出 DeepSeek 官方服务模型（名 + 描述 + 勾选），其下分界线、推理等级行（如有）与 More models 行；后两者唤出二级弹层并排在一级旁侧（视口不够自动翻到左侧）。整弹层改为悬停即开（与账户控件一致，带 180ms 跨窗宽容），列表字体/行高/间距/圆角/悬停与权限弹层完全一致。数据与提交直连宿主 `ctx.modelDirectories` 的每会话 ModelDirectory（与宿主菜单、`/model` 命令同源），选中态、目录与错误实时同步；宿主原座椅节点标记隐藏，React 换节点后自动重标记。

### Fixed
- **修复权限切换在 dsh 0.2+ 上完全失效**：当前会话选中态已移出 Session Controller（`sessions.list` 快照不再有 `current` 字段，改由 `uiSession` 服务以主视图绑定投影），`currentSession` 恒返回 null，点击权限菜单任意选项都静默无效、按钮标签永远停留在 `Accept edits`，而原生触发器被皮肤隐藏，GUI 内没有任何可用的切换入口。改为优先从 `uiSession` 主视图绑定读取当前会话 id，旧版宿主回退到 `list.current`；同时兼容 `permissions` 投影在 0.2+ 直接返回裸值（旧版包一层 `{ currentValue }`）的差异。
- **亮色用户消息气泡由蓝改灰**：宿主亮色气泡底色 token（`--dsw-specific-bubble`）是 DeepSeek 蓝（`deepseek-50`），皮肤此前未覆盖，故亮色下用户消息呈蓝色；现改取皮肤的按钮悬停灰（`--dsh-claude-hover-bg`，亮色 `rgba(0,0,0,0.08)`）。深色气泡宿主本就是中性灰，保持不变。
- **修复模型选择弹层永远停在「正在加载模型…」**：根因是把 store 的方法调在了实例上——宿主持有的每会话 `ModelDirectory` 实例只有 `load()` / `select()` 等，其响应式状态挂在它的 `.store`（快照 store）字段上（宿主给自家菜单注入的就是 `directory.store`）。皮肤却调用 `modelDir.subscribe()` / `modelDir.getSnapshot()`，前者抛 TypeError 被 catch 吞掉后还把刚取到的 directory 置回 null，后者恒失败 → 快照永远是 null → 触发器回落「选择模型」、弹层渲染 loading 行。现全部改走 `modelDir.store`；`load()`/`select()` 的异步 rejection 也按宿主做法补 `.catch()`。另外会话 id 读取改走 context.js 共享的 `currentSessionId()`（`uiSession` 投影优先、旧 `list.current` 回退），与权限切换同源、对新旧宿主都成立。
- **深色强调色回到陶烬橙**：皮肤的深色 token 块声明在 `body[data-dsh-claude-style]` 上，与宿主的 `body[data-ds-dark-theme]` 同为 (0,1,1) 权重；宿主主题样式表若排在皮肤之后，其蓝色强调（`--dsw-alias-state-business-primary`、`--dsw-alias-button-info-fill`、`--dsw-alias-link` 与品牌 "new color"）就会盖掉暖色盘。现把深色盘限定到 `[data-ds-dark-theme]`（(0,2,1)，与样式表顺序无关），并补上此前缺失的 `--dsw-alias-link` 与品牌 "new color" 两个强调 token；亮色盘补齐原先从深色基块继承的四个 token，外观不变。

## [0.2.3] - 2026-09-19

### Fixed
- 修复账户抽屉弹层在后台持续刷新时 hover / 点击失效的问题：弹层打开期间镜像内容保持静止，点击目标改为在点击瞬间实时解析。

## [0.2.2] - 2026-09-19

### Added
- **对话内输入框重设计**：在已有对话中，输入框压缩为紧凑的单行卡片，随内容自然向下撑高（支持平滑滚动）；右侧内置回车符号（`↵`）发送按钮，回车直接发送、Shift+Enter 换行，支持中文等 IME 正常选词；权限控制组件、指令 / 附件按钮与模型选择器合并到输入框下方同一行，自适应排列不重叠，权限弹出菜单支持 `Read only` / `Accept edits` / `Full access` 快捷切换与勾选；有附件时附件轨与输入框平滑连接为一体化卡片并撑高文本区，无附件时附件轨完全隐藏；宽度自适应，杜绝 Windows 系统及缩放比例下的异常横向滚动条；对话内占位符为 `Type / for commands`，点击卡片空白处即可聚焦。新会话页保持经典双层分段设计。
- **输入框焦点样式**：获得焦点时描边转为与输入框自身阴影一致的中性色细线（亮色为暖黑，暗色为纯黑），外扩 1px 同色晕边并加深投影，形成发光感；底栏托盘同步跟随，整体轮廓一体。深浅主题分别调校。
- **分时段首页欢迎语**：新会话页欢迎语随本地时间自动轮换——6–8 点 `Good morning, {用户名}!`（用户名取工作区路径，失败回退为 `User`）、8–9 点 `Happy {星期几}.`、9–12 点 `What are you working on?`、12–14 点 `What’s on the agenda today?`、14–18 点 `Coffee and Claude time?`、18–24 点 `Evening, how are things?`、0–6 点 `You are here!`；应用保持打开跨过整点时每 60 秒自动刷新手写欢迎语。
- **模型思考状态重塑**：收录 Claude Code 的 185 种思考动词（如 `Smooshing...`、`Boogieing...`、`Clauding...`、`Noodling...`），每轮思考随机抽取一个动词稳定展示；扫光从 DeepSeek 蓝渐变换为陶土橙与蜜桃暖色高光。
- **工作区运行中状态重塑**：会话运行时，侧栏会话状态加载动画从 DeepSeek 方形蓝色 LED 矩阵替换为 Windows 11 Fluent 风格的圆形圆弧旋转，深浅主题自适应。
- **可切换品牌标识**：设置页新增「Claude Style」分区，用分段控件在 Claude（默认，官方星芒）与 Anthropic（`A\` + ANTHROPIC 字标）两套品牌标识间切换，新会话页品牌标识随之切换并保持陶烬橙填充；选择保存在本地，重启应用后保持。

### Changed
- **源码拆分与构建化**：`lib/client.js` 改为构建产物（勿手改），源码拆分至 `src/`（五个 JS 片段 + `src/styles/` 六个纯 CSS 文件）；`npm run build` 内联拼装并做语法与令牌自检，发布前自动构建。新增 `scripts/probe.cjs` 无头浏览器回归探针，断言输入框吸底、单行起步、随内容增长等关键不变量（`npm run probe -- --token <launch-token>`）。
- **Anthropic 字体入仓库**：`fonts/` 提供 Anthropic Sans Web Text / Serif Web Text / Mono Variable 三个字体文件，随 Git 仓库分发、**不随 npm 包分发**（`files` 白名单排除）；安装到系统后皮肤字体栈即可生效——版权归 Anthropic，仅供个人使用，不适用 MIT 许可（见 LICENSE 字体声明）。

### Fixed
- 修复对话内输入框的多处布局问题：偏离底部不随消息流吸附、被固定为单行无法随内容增高、以及含图片附件时附件区出现双层边框。
- 修复上下文用量弹层被误压缩导致排版错乱的问题。
- 修复账户抽屉多项问题：侧栏底部非按钮控件未收纳进抽屉、插件条目被折叠成一项致按钮显示不全、条目图标与文本错位、条目随宿主重排后顺序错乱或点击错位、以及余额 / 配额等富控件型条目不显示或其内嵌按钮点击位置不符。
- 修复 dsh-agy-link 的 run_code 工具卡片头部与代码预览排版异常的问题。

## [0.2.1] - 2026-09-19

### Added
- 账户抽屉支持悬停展开与延迟关闭，移入弹层不打断浏览。

### Changed
- 权限控制器首段从 Plan 改名为 Read，与它映射的只读预设（read-only）名称一致。
- 新会话按钮改为与会话行同高的窄条：左对齐加号图标、常驻悬停底色。
- 会话行标题默认为次级灰，悬停或选中时回到主文字色。
- 账户底栏改为贯通侧栏的全宽分割线布局。

### Fixed
- 补齐 LICENSE 版权署名；修正 README 中无效的手工 patch 配置示例。

## [0.2.0] - 2026-09-19

### Added
- **Claude Code Desktop Theme**: 重构，从配色皮肤升级为完整的 Claude Code Desktop 视觉与交互复刻主题。
- **Plan / Edit / Auto 分段权限控制**：行内三段式控制器，支持快捷切换会话权限（Plan 只读、Edit 写入、Auto 完全权限并带安全确认）。
- **侧栏账户抽屉**：侧栏底部集成账户按钮与弹出菜单，支持一键打开设置（`Ctrl+,`）与管理插件。
- **视觉与文案重塑**：专属问候语、输入框引导文案与品牌星芒标识。

### Changed
- 项目重命名为 `dsh-claude-style`，与上游 `claude-style-skin` 区分。
- 优化亮色画布色值（`#FCFCFB`）与侧栏色值（`#FBFBF9`）。

## [0.1.0] - 2026-08-22

### Added
- 初始版本：暖调象牙白/暖黑双画布与陶烬橙强调色。
