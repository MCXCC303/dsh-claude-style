# dsh-claude-style · Claude Code Desktop 主题

[![MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

为 DeepSeek Harness (DSH) Web 客户端深度复刻 Claude Code Desktop 视觉与交互体验的主题插件。

![light 亮色](docs/light.png)

## 特性

### 1. Claude 经典暖调视觉
- **象牙白 / 暖黑双画布**：亮色象牙白（`#FCFCFB`）与浅色侧栏（`#FBFBF9`），暗色暖黑（`#141413`），遵循系统亮暗模式切换。
- **陶烬橙点睛**：经典陶烬橙（`#D97757`，hover `#C6613F`）作为唯一操作强调色。
- **三字体系排版**：衬线展示标题（Serif）+ 无衬线界面（Sans）+ 等宽代码（Mono）。
- **细致质感**：精致发丝边框、8px 卡片圆角、全圆角胶囊 CTA 按钮。

### 2. Claude Code 交互复刻
- **Read / Edit / Auto 三段式权限控制器**：替换原生访问模式菜单，平滑切换只读（Read）、工作区写入（Edit）与完全权限（Auto，带安全确认弹窗）。
- **桌面端问候语与占位符**：专属对话问候语与输入框引导文案。
- **侧栏账户抽屉**：侧栏底部集成账户按钮与抽屉菜单，支持一键打开设置（快捷键 `Ctrl+,`）与管理插件。

![dark 暗色](docs/dark.png)

## 安装

```sh
dsh plugin --profile web add TaiyakiOffical/dsh-claude-style   # GitHub 源
# 或（若已发布到 npm）
dsh plugin --profile web add dsh-claude-style                    # npm 源
```

安装后**重启 `dsh web`**，刷新页面即生效。

## 切换与互斥

同一时刻只建议启用一个主题/皮肤。在 profile 的 `cordis.patch.yml` 中确保配置如下：

```yaml
# ~/.dsh/profiles/web/cordis.patch.yml
- id: ui-skin-claude-style
  name: dsh-claude-style
```

若需切换其他主题，可将本项设为 `disabled: true` 或使用 `dsh-skin-manager` 切换。

## 卸载

1. 删除 profile `cordis.patch.yml` 中 `ui-skin-claude-style` 的配置项
2. 执行卸载命令：
   ```sh
   dsh plugin --profile web remove dsh-claude-style
   ```
3. 重启 `dsh web`

## 许可

MIT
