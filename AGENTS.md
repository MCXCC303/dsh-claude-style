# AGENTS.md

`dsh-claude-style` 是 DeepSeek Harness（DSH）Web GUI 的主题插件：复刻 Claude Code Desktop 的视觉与交互（象牙白/暖黑双画布、陶烬橙唯一强调色、衬线/无衬线/等宽三字体分工、权限分段控件、品牌切换、账户抽屉、模型选择器等）。

## 原则

- 本仓库只做 Web 主题插件，不修改 DSH 引擎、apiproxy 或官方 UI 包；一切效果通过 CSS 覆盖与客户端 DOM override 在浏览器半边实现。
- 零构建工具链、零运行时依赖：`scripts/build.mjs` 把 `src/` 碎片按固定顺序逐字拼接成单文件 `lib/client.js`。**不引入 esbuild/rollup 等打包器，不引入任何新依赖**（DSH 模块加载器没有相对 require、没有资产 URL，这个架构必须保留）。
- `lib/` 是构建产物，**禁止手改**；改 `src/` 后跑 `npm run build`。
- npm 包不分发 Anthropic Sans/Serif 字体；`fonts/` 供仓库下载，Anthropic 字体版权归 Anthropic 所有，不适用 MIT。JetBrains Mono 代码字体随插件库分发，采用 SIL OFL。

## 命令

```sh
npm run build            # 拼接 src/ → lib/client.js，校验 %%TOKEN%%、CSS gate、语法与 model-descriptions.json
node scripts/probe.cjs --token <launch-token>   # 无头 Chrome 对运行中的 GUI 断言 composer 不变量
node scripts/shoot.cjs --token <launch-token>   # 重拍 README 截图（docs/light.png / docs/dark.png）
```

probe / shoot 需要一个正在运行的 `dsh web` 实例，token 取自 GUI URL 的 `/?token=…`（或环境变量 `DSH_WEB_TOKEN`）；本机需有 Chrome/Edge（可用 `CHROME_PATH` 指定）。

## 仓库布局

- `src/` 全部源码：`constants.js`（常量与 185 个思考动词，构建期求值填 token）、`context/*.js`（host/prefs/model-copy/i18n）、`overrides/*.js`（copy/permissions/model-picker/account-footer/scheduler + 共享 popover-utils）、`settings.js`（设置页品牌切换）、`entry.js`（`apply()` 编排器）、`styles/**/*.css`（按 composer 与 components 拆分）、`assets/*.svg`（品牌标识，构建期内联为 data URI）、`assets/lobe/*.svg`（模型厂商标识，Lobe Icons 单色字形，构建期内联为 JS markup 表）、`model-descriptions.json`（模型文案数据 + `brands` 标识绑定）。
- `lib/` 产物：`client.js`（生成）、`index.js`（宿主半边，手写，提供 `/dsh-claude-style/model-descriptions.json` 路由）、`model-descriptions.json`（构建期复制）。
- `skin.json` 皮肤清单；`cordis.patch.yml` 把 `ui-skin-claude-style` 插入 web roster。
- `scripts/` 构建与回归工具（`fetch-lobe-icons.mjs` 是唯一联网脚本，手工运行、不进构建）；`docs/` 文档与截图；`fonts/` 字体文件（JetBrains Mono 已入包，Anthropic 字体仅仓库下载）。
- `.debug/`、`node_modules/` 不入库。

## 核心约定

### CSS

- 每条规则必须挂在 `body[data-dsh-claude-style]` 之下；暗色 token 为基础，亮色覆盖写在 `:not([data-ds-dark-theme])` 下。亮色主画布 `#FCFCFB`、暗色 `#141413`、强调色陶烬橙 `#D97757`，不用纯白纯黑和冷灰。
- composer 相关规则必须位于 `/* @composer-gate */` 标记之下；构建会把 `[%%COMPOSER_ATTR%%]` 门控盖到标记以下每条规则上，漏盖即构建失败。
- 设计令牌与形状规则见 `docs/STYLE.md`，改视觉先读它。

### 宿主选择器纪律

宿主使用带哈希的 CSS-module 类名。两条不可违反：子串匹配只用**最长稳定片段**（`[class*="_row"]`，绝不写 `[class*="row"]`）；不得覆盖 `[class*="viewArea"]` 上宿主的活跃期布局契约。新增子串选择器后必须检查误伤。事故背景与细则见 `docs/STYLE.md`。

### JS 碎片

所有碎片共享一个工厂作用域：**禁止 import/export**，保持 4 空格基础缩进与 ES5 风格；`%%TOKEN%%` 由构建替换，产物不得有残留；React 只能经加载器 `require('react')` 取得。碎片清单与拼接顺序见 `scripts/build.mjs`，完整布局见 `docs/STYLE.md`。

### 模型文案是数据，不进 bundle

- `src/model-descriptions.json` 构建期校验后**复制**到 `lib/`，浏览器半边首次绘制选择器时经宿主路由 fetch。扩文案表不需要改 JS。
- 每条是 `{ locale: text }`；查找按 精确条目 → 家族规则 → 档位规则 → 目录自带文本 逐级降级。
- 家族规则有序且必须锚定（如 `flash` 规则限定在 deepseek 内）；**一律不写「最强/旗舰」等最高级**——最高级只出现在钉住版本的精确条目里，否则旧模型会被误称旗舰。

### 截图与隐私

- `shoot.cjs` 落盘前把工作区名/会话标题/用户名/盘符路径/余额替换为中性替身并做泄漏扫描，扫描不过即失败，不得绕过。

## 修改流程

1. 改 `src/`（CSS 或 JS 碎片），不碰 `lib/client.js`。
2. `npm run build` 重新生成产物并过语法门禁。
3. 有 `dsh web` 实例时跑 `node scripts/probe.cjs --token <token>` 验证 composer 不变量（钉底、单行起步、随内容增长、清空还原）。
4. 视觉变更人工核对亮/暗两态；README 截图过时则用 `shoot.cjs` 重拍。
5. 同步文档：README 双语（`README.md` 中文 / `README.en.md` 英文）一起改；行为变更记入 `CHANGELOG.md` 的 `[Unreleased]` 节（Keep a Changelog 格式，用户语言写"为什么"）。

## Git 与发布

- 一个逻辑变更一个 commit，不提交 WIP，不混入无关改动。
- 提交前必过：`npm run build` 成功且 `lib/` 产物与 `src/` 同步（产物要随源码一起提交）。
- 发布：更新 CHANGELOG → `npm version patch|minor` → 打 tag → `npm publish`（`prepublishOnly` 会自动重跑构建）。
