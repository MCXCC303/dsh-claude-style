# DSH Claude Style

**为 DeepSeek Harness Web 复刻 Claude Code Desktop 风格与交互体验的主题插件。**

<div align="center">

> **Coffee and Claude time?**

[![English](https://img.shields.io/badge/lang-English-blue.svg)](README.en.md) [![简体中文](https://img.shields.io/badge/lang-%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87-red.svg)](README.md)

[![GitHub stars](https://img.shields.io/github/stars/Nwflower/dsh-claude-style?style=flat&label=%E2%98%85&color=08C)](https://github.com/Nwflower/dsh-claude-style)
[![license](https://img.shields.io/badge/license-MIT-2EA44F?style=flat)](LICENSE)

</div>

## 预览

<table>
  <tr>
    <td align="center" width="50%"><img src="./docs/light.png" alt="亮色画布 —— 暖调象牙" /></td>
    <td align="center" width="50%"><img src="./docs/dark.png" alt="暗色画布 —— 暖调黑" /></td>
  </tr>
</table>

> 亮色：象牙白画布 `#FCFCFB` 与浅色侧栏 `#FBFBF9`；暗色：暖黑 `#141413`。主题遵循系统亮暗模式切换，陶烬橙 `#D97757` 是两套画布唯一的操作强调色。

## 字体

> **重要：JetBrains Mono 代码字体随插件库分发，由插件宿主以 webfont 形式直接提供给浏览器，无需安装。Anthropic 字体（Sans/Serif）不随 npm 包分发，仅在仓库 [`fonts/`](fonts/) 供下载**——既可以直接安装到系统，也可以免安装：把两个 `.ttf` 放进插件包的 `fonts/` 目录，宿主会以同样的 webfont 方式提供它们（两种方式的字体文件完全一致，效果相同）。生效均需刷新 / 重启 web。

| 字体 | 用途 | 文件 |
|---|---|---|
| Anthropic Sans Web Text | 界面 / UI | [`fonts/AnthropicSansWebText.ttf`](https://github.com/Nwflower/dsh-claude-style/raw/main/fonts/AnthropicSansWebText.ttf) |
| Anthropic Serif Web Text | 对话正文 / Markdown | [`fonts/AnthropicSerifWebText.ttf`](https://github.com/Nwflower/dsh-claude-style/raw/main/fonts/AnthropicSerifWebText.ttf) |
| JetBrains Mono Variable | 代码 / 代码块 | [`fonts/JetBrainsMonoVariable.ttf`](https://github.com/Nwflower/dsh-claude-style/raw/main/fonts/JetBrainsMonoVariable.ttf)、[`fonts/JetBrainsMonoItalicVariable.ttf`](https://github.com/Nwflower/dsh-claude-style/raw/main/fonts/JetBrainsMonoItalicVariable.ttf) |

Anthropic 字体启用（二选一）：① 安装到系统——Windows 双击 `.ttf` → 「安装」，macOS 用「字体册」导入；② 免安装——把 `.ttf` 复制到插件包的 `fonts/` 目录（与 `JetBrainsMonoVariable.ttf` 同目录）。完成后刷新页面生效。

> JetBrains Mono 以 [SIL Open Font License](fonts/OFL.txt) 分发；Anthropic Sans/Serif 字体版权归 Anthropic 所有，仅供个人使用，不适用 MIT 许可（详见 [LICENSE](LICENSE) 字体声明）。

## 安装

> 已在 dsh 0.1.5-rc.2 上测试

1. 通过终端安装

```bash
dsh plugin --profile web add dsh-claude-style                  # npm 包（推荐）
dsh plugin --profile web add Nwflower/dsh-claude-style         # GitHub 源
```

2. 通过[插件市场](https://github.com/dsh-market/dsh-market)安装

同一时刻建议只启用一个主题。安装后**重启 `dsh web`** 并刷新页面即生效。

## 使用

1. **主题** —— 安装即全局生效，无需配置；亮暗跟随系统颜色模式。
2. **权限分段** —— 输入框以 Read | Edit | Auto 三段式控制器替换原生的访问模式菜单：只读、工作区写入与完全权限（Auto 经宿主的安全确认弹窗切换）。
3. **模型选择器** —— 输入框的模型席位换成 Claude 风格的两级弹层：一级列出 DeepSeek 官方模型、分隔线、推理等级与「更多模型」，二级在右侧展开。每个模型行显示**所属厂商**的标识（不是转售该模型的 provider），「更多模型」的分组标题显示 provider 的标识。标识取自 [Lobe Icons](https://lobehub.com/icons) 的单色字形，跟随主题文字色绘制，因此亮暗两套画布都清晰；不引入 React 组件依赖，也不使用彩色 logo。
4. **品牌切换** —— 设置（`Ctrl+,`）→ **Claude Style**：侧栏品牌在 Claude（官方星芒 + Claude 字标）与 Anthropic（`A\` + ANTHROPIC 字标）之间切换，新会话页标识随所选品牌保持陶烬橙星芒；选择保存在浏览器本地，默认 Claude。
5. **账户抽屉** —— 侧栏底栏的账户按钮悬停展开弹层，一键打开设置（`Ctrl+,`）与管理插件；弹层顶部那条用户名横条是个彩蛋：点开会看到 Claude 官方的「账户已暂停」页（纯本地复刻，不碰任何真实状态，点页面上任意按钮或按 `Esc` 退出；切走窗口**不会**关，方便你切出去照着它看）。这页的语言在设置里单独选（**封号彩蛋语言**，中文/英文，默认英文）。
6. **状态细节** —— 思考状态每轮从 Claude Code 的 185 个思考动词随机抽取一个稳定展示；工作区运行中状态使用 Fluent 风格的圆形加载动画。

## 停用与卸载

不停用安装、先暂停主题 —— 在 profile 的 `cordis.patch.yml`（`~/.dsh/profiles/web/cordis.patch.yml`）中加入：

```yaml
- id: ui-skin-claude-style
  disabled: true
```

保存后约 1 秒内热生效，刷新页面即回到原生外观。

```bash
dsh plugin --profile web remove dsh-claude-style   # 卸载
```

然后重启 `dsh web`；若曾在 `cordis.patch.yml` 手工添加过本主题的条目，一并删除。

## 文档

| 文档 | 说明 |
| --- | --- |
| [设计令牌](docs/STYLE.md) | 调色板、字体、形状，源码结构与宿主选择器纪律（英文） |
| [更新日志](CHANGELOG.md) | 版本历史 |
| [贡献指南](CONTRIBUTING.md) | 如何从 `src/` 构建、提交规范与截图/回归工具（英文） |
| [AGENTS.md](AGENTS.md) | AI 助手的开发指南：构建命令、碎片规则、宿主选择器纪律与发布流程 |

## 友链

> 同时启用多个主题？推荐 [dsh-skin-manager](https://github.com/xiaoyangcheng84-svg/dsh-skin-manager)，在其设置页一键切换所有已安装主题。

## Star History

<a href="https://www.star-history.com/?type=date&repos=Nwflower%2Fdsh-claude-style">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=Nwflower/dsh-claude-style&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=Nwflower/dsh-claude-style&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=Nwflower/dsh-claude-style&type=date&legend=top-left" />
 </picture>
</a>
