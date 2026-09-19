# dsh-claude-style · Claude Code Desktop 主题

[![MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

为 DeepSeek Harness (DSH) Web 客户端复刻 Claude Code Desktop 视觉与交互体验的主题插件。

![light 亮色](docs/light.png)

## 特性

### 1. Claude 经典暖调视觉
- **象牙白 / 暖黑双画布**：亮色象牙白（`#FCFCFB`）与浅色侧栏（`#FBFBF9`），暗色暖黑（`#141413`），遵循系统亮暗模式切换。
- **陶烬橙强调色**：经典陶烬橙（`#D97757`，hover `#C6613F`）作为唯一操作强调色。
- **三种字体分工**：衬线展示标题（Serif）+ 无衬线界面（Sans）+ 等宽代码（Mono）。
- **细致质感**：精致发丝边框、8px 卡片圆角、全圆角胶囊 CTA 按钮。

### 2. Claude Code 交互复刻
- **Read / Edit / Auto 三段式权限控制器**：替换原生访问模式菜单，平滑切换只读（Read）、工作区写入（Edit）与完全权限（Auto，带安全确认弹窗）。
- **桌面端问候语与占位符**：专属对话问候语与输入框引导文案。
- **侧栏账户抽屉**：侧栏底部集成账户按钮与抽屉菜单，支持一键打开设置（快捷键 `Ctrl+,`）与管理插件。

### 3. 可切换品牌标识
- **设置页「Claude Style」分区**：在设置对话框中新增独立分区，用分段控件在 **Claude** 与 **Anthropic** 两套品牌标识间切换。
- **默认 Claude**：侧栏使用 Claude 星芒 + Claude 字标，新会话页使用陶烬橙星芒。
- **Anthropic 备选**：切回 `A\` 标志 + ANTHROPIC 字标，保留原有观感。
- 选择写入浏览器本地存储，重启应用后保持。

![dark 暗色](docs/dark.png)

## 安装

```sh
dsh plugin --profile web add Nwflower/dsh-claude-style   # GitHub 源
# 或（若已发布到 npm）
dsh plugin --profile web add dsh-claude-style                    # npm 源
```

安装命令会把主题自动接入 profile 组合，无需手工配置。安装后**重启 `dsh web`**，刷新页面即生效。

## 禁用与切换

同一时刻建议只启用一个主题。停用本主题时，在 profile 的 `cordis.patch.yml`（`~/.dsh/profiles/web/cordis.patch.yml`）中加入：

```yaml
- id: ui-skin-claude-style
  disabled: true
```

保存后约 1 秒内热生效，刷新页面即回到原生外观。也可以安装 [dsh-skin-manager](https://github.com/xiaoyangcheng84-svg/dsh-skin-manager)，在设置页一键切换所有已安装的主题。

## 卸载

```sh
dsh plugin --profile web remove dsh-claude-style
```

然后重启 `dsh web`。若曾在 `cordis.patch.yml` 手工添加过本主题的条目，一并删除。

## 许可

MIT
