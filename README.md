<div align="center">

# DSH Claude Style

**为 DeepSeek Harness Web 复刻 Claude Code Desktop 风格与交互体验的主题插件。**

> **在 DSH 里，就是 Claude Code Desktop 的样子。**

[![简体中文](https://img.shields.io/badge/lang-%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87-red.svg)](README.md) [![English](https://img.shields.io/badge/lang-English-blue.svg)](README.en.md)

[![license](https://img.shields.io/badge/license-MIT-2EA44F?style=flat)](LICENSE)

</div>

> 本仓库是 **HDSL 本地构建**（包名 `hdsl-claude-style`）：不作为 npm 包发布，也没有可替换本构建的上游。安装方式见「[安装](#安装)」。

## 预览

<table>
  <tr>
    <td align="center" width="50%"><img src="./docs/light.png" alt="亮色画布 —— 暖调象牙" /></td>
    <td align="center" width="50%"><img src="./docs/dark.png" alt="暗色画布 —— 暖调黑" /></td>
  </tr>
</table>

> 亮色：象牙白画布 `#FCFCFB` 与浅色侧栏 `#FBFBF9`；暗色：暖黑 `#141413`。主题遵循系统亮暗模式切换，陶烬橙 `#D97757` 是两套画布唯一的操作强调色。

## 字体

> **重要：Anthropic 字体不随 npm 包分发，仅在仓库 [`fonts/`](fonts/) 供下载**——既可以直接安装到系统，也可以免安装：把两个 `.ttf` 放进插件包的 `fonts/` 目录，宿主会以同样的 webfont 方式提供它们（两种方式的字体文件完全一致，效果相同）。生效均需刷新 / 重启 web。

| 字体 | 用途 | 文件 |
|---|---|---|
| Anthropic Sans Web Text | 界面 / UI | [`fonts/AnthropicSansWebText.ttf`](https://github.com/Nwflower/dsh-claude-style/raw/main/fonts/AnthropicSansWebText.ttf) |
| Anthropic Serif Web Text | 对话正文 / Markdown | [`fonts/AnthropicSerifWebText.ttf`](https://github.com/Nwflower/dsh-claude-style/raw/main/fonts/AnthropicSerifWebText.ttf) |
| JetBrains Mono Variable | 代码 / 代码块 | [`fonts/JetBrainsMonoVariable.ttf`](https://github.com/Nwflower/dsh-claude-style/raw/main/fonts/JetBrainsMonoVariable.ttf)、[`fonts/JetBrainsMonoItalicVariable.ttf`](https://github.com/Nwflower/dsh-claude-style/raw/main/fonts/JetBrainsMonoItalicVariable.ttf) |

Anthropic 字体启用（二选一）：

① 安装到系统——Windows 双击 `.ttf` → 「安装」，macOS 用「字体册」导入；

② 免安装——把 `.ttf` 复制到插件包的 `fonts/` 目录。完成后刷新页面生效。

> Anthropic Sans/Serif 字体版权归 Anthropic 所有，仅供个人使用，不适用 MIT 许可。

## 安装

> 需要 dsh ≥ 0.1.7

本构建以本地 `.tgz` 分发，从 npm 或插件市场安装到的都是**另一个包**（上游 `dsh-claude-style`），不会覆盖本构建，也不受本构建的改动影响。

1. 在 HDSL 里安装：实例 → 插件 → **从文件安装插件**，选择 `hdsl-claude-style-0.7.0.tgz`。

2. 或者用终端安装（路径写绝对路径；启动器会把 tgz 复制进实例目录，之后源文件可以移走）：

```bash
dsh plugin --profile web add file:/绝对路径/hdsl-claude-style-0.7.0.tgz
```

同一时刻建议只启用一个主题。安装后**重启 `dsh web`** 并刷新页面即生效。

从上游切过来时，先卸载上游那份（`dsh plugin --profile web remove dsh-claude-style`）再装本构建，避免两个主题同时生效。

## 特点

1. **主题** —— 安装即全局生效，无需配置。亮色象牙白 `#FCFCFB`、暗色暖黑 `#141413`，两套画布共用同一个操作强调色陶烬橙 `#D97757`；亮暗跟随系统颜色模式切换。
2. **输入框** —— 输入框整块重做：权限分段控件（只读 / 编辑 / 自动 / Yolo）与它下方的档位列表、带品牌锁定标的模型触发器、工具栏与状态统计同一行排版，发送键与停止键统一成 7px 圆角。统计句与模型触发器共用一套字号与颜色。权限档位取自宿主的权限目录：宿主配置了哪几档就画哪几档，第三方插件注册的档位（例如 auto mode 插件的 `auto-mode`）会自动出现在列表里并占用「自动」那一格；列表保持纯文字，档位自己声明的图标不画。
3. **模型选择器** —— 全新的两级弹层：一级列官方服务与设置页勾选的快捷供应商，「更多模型」二级按供应商分组；每行带厂商锁定标与说明文案，底部是推理等级推条（无极滑动，松手对齐最近档位）与「更多模型」入口。二级底边与一级对齐，一级已显示的供应商不再重复；模型不支持思考时不画推条。悬停停留 50ms 打开、离开 150ms 关闭，两卡之间的空隙不算离开。
4. **工作区** —— 侧栏「工作区」标题改成 **进行中 / 已归档** 分段控件：进行中沿用宿主的会话树，已归档是皮肤自己的平铺列表（标题、时间、每行「取消归档」与「删除」两个图标按钮）。行排版与宿主的会话行逐项一致（行 x=12 / 宽 251 / 高 28 / 标题起点 x=36）。
5. **侧栏** —— 新会话与插件两行取 Claude 真机形状：默认无底色、hover 才有底色，新会话的「＋」套一枚圆形底，两行图标 hover 顺时针转 90°（四重对称图形，转回原位）；底部账户抽屉、封号彩蛋一并保留。
6. **账号区** —— 桌面端登录后显示**真实头像与昵称**（只在启动、热重载、登录与登出时向服务器读取，不轮询；失败回退手绘星芒）；账号弹层沿用宿主自带的那一个：宿主的账号行就是入口，弹层里依次是账号头部、其它插件的页脚条目与宿主自己的「设置 / 意见反馈 / 退出登录」，各行的文案、顺序与点击行为保持宿主原样；宿主没有账号区的环境（Web）由插件自建同样外观的弹层。弹层卡片为纯白背景、宽度与侧栏一致。
7. **启动器账号** —— 由启动器启动的实例会把玩家身份交给插件：账号位置画**玩家自己的皮肤头像**（按启动器账号列表同样的裁法取头部、帽子层一并叠上，方形绘制不被圆角裁切），新会话问候语与账号名在没有自定义用户名时用启动器的账号名。读到的只有名字、供应商、账号种类与「有没有头像」，皮肤文件路径不出进程；没有账号、头像文件被删、文件不是图片时依次回退到宿主账号头像与手绘标记。
8. **对话视图** —— 对话 / 轨迹控件在桌面 Windows 标题栏模式下居中常显在标题栏那一行（与新会话按钮同一行）；宽窗口且标题较短时它停在标题那一行，否则留在标题下方自己那一行。

## 停用与卸载

不停用安装、先暂停主题 —— 在 profile 的 `cordis.patch.yml`（`~/.dsh/profiles/web/cordis.patch.yml`）中加入：

```yaml
- id: ui-skin-claude-style
  disabled: true
```

保存后约 1 秒内热生效，刷新页面即回到原生外观。

```bash
dsh plugin --profile web remove hdsl-claude-style   # 卸载
```

然后重启 `dsh web`；若曾在 `cordis.patch.yml` 手工添加过本主题的条目，一并删除。

## 文档

| 文档 | 说明 |
| --- | --- |
| [设计令牌](docs/STYLE.md) | 调色板、字体、形状，源码结构与宿主选择器纪律（英文） |
| [架构决策](docs/architecture.md) | 单文件拼接、单一调度器、特性契约、账号表面等决策与权衡 |
| [更新日志](CHANGELOG.md) | 版本历史 |
| [贡献指南](CONTRIBUTING.md) | 如何从 `src/` 构建、提交规范与截图/回归工具（英文） |

## 友链

> 同时启用多个主题？推荐 [dsh-skin-manager](https://github.com/xiaoyangcheng84-svg/dsh-skin-manager)，在其设置页一键切换所有已安装主题。

> 想把 Claude Code / Codex 等外部代理的会话历史导入 DSH 接着聊？推荐作者的另一个插件 [dsh-chat-import](https://github.com/Nwflower/dsh-chat-import)。

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Nwflower/dsh-claude-style&type=Date)](https://star-history.com/#Nwflower/dsh-claude-style&Date)
