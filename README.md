# DSH Claude Style

**为 DeepSeek Harness Web 复刻 Claude Code Desktop 风格与交互体验的主题插件。**

<div align="center">

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

1. 通过终端安装

```bash
dsh plugin --profile web add dsh-claude-style                  # npm 包（推荐）
dsh plugin --profile web add Nwflower/dsh-claude-style         # GitHub 源
```

2. 通过[插件市场](https://github.com/dsh-market/dsh-market)安装

同一时刻建议只启用一个主题。安装后**重启 `dsh web`** 并刷新页面即生效。

## 特点

1. **主题** —— 安装即全局生效，无需配置。亮色象牙白 `#FCFCFB`、暗色暖黑 `#141413`，两套画布共用同一个操作强调色陶烬橙 `#D97757`；亮暗跟随系统颜色模式切换。
2. **输入框** —— 输入框整块重做：权限分段控件（完全权限 / 只读 / …）、带品牌锁定标的模型触发器、工具栏与状态统计同一行排版，发送键与停止键统一成 7px 圆角。统计句与模型触发器共用一套字号与颜色。
3. **模型选择器** —— 全新的两级弹层：一级列官方服务与设置页勾选的快捷供应商，「更多模型」二级按供应商分组；每行带厂商锁定标与说明文案，底部是推理等级推条（无极滑动，松手对齐最近档位）与「更多模型」入口。二级底边与一级对齐，一级已显示的供应商不再重复；模型不支持思考时不画推条。悬停停留 50ms 打开、离开 150ms 关闭，两卡之间的空隙不算离开。
4. **工作区** —— 侧栏「工作区」标题改成 **进行中 / 已归档** 分段控件：进行中沿用宿主的会话树，已归档是皮肤自己的平铺列表（标题、时间、每行「取消归档」与「删除」两个图标按钮）。行排版与宿主的会话行逐项一致（行 x=12 / 宽 251 / 高 28 / 标题起点 x=36）。宿主没有归档能力时（如 0.1.5 的某些构建）不显示控件、保留原标题。
5. **侧栏** —— 新会话与插件两行取 Claude 真机形状：默认无底色、hover 才有底色，新会话的「＋」套一枚圆形底，两行图标 hover 顺时针转 90°（四重对称图形，转回原位）；底部账户抽屉、封号彩蛋一并保留。
6. **账号区** —— 桌面端登录后显示**真实头像与昵称**（只在启动、热重载、登录与登出时向服务器读取，不轮询；失败回退手绘星芒）；账号抽屉接管宿主账号菜单：**动态镜像**「设置 / 意见反馈 / 退出登录（或登录）」，点击直连官方行为（官方问卷、账号登出、宿主设置页），宿主自己的账号行（连同同一行里的连接 / 更新提示）隐藏不出现在界面上；非桌面端自动只保留「设置」入口。

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

## 友链

> 同时启用多个主题？推荐 [dsh-skin-manager](https://github.com/xiaoyangcheng84-svg/dsh-skin-manager)，在其设置页一键切换所有已安装主题。
