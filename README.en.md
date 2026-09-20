<div align="center">
# DSH Claude Style

**A Claude Code Desktop theme for the DeepSeek Harness (DSH) web client — the warm ivory editorial canvas, the clay ember accent, and the Claude Code interaction model rebuilt on DSH.**

> **Coffee and Claude time?**

[![English](https://img.shields.io/badge/lang-English-blue.svg)](README.en.md) [![简体中文](https://img.shields.io/badge/lang-%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87-red.svg)](README.md)

[![GitHub stars](https://img.shields.io/github/stars/Nwflower/dsh-claude-style?style=flat&label=%E2%98%85&color=08C)](https://github.com/Nwflower/dsh-claude-style)
[![license](https://img.shields.io/badge/license-MIT-2EA44F?style=flat)](LICENSE)

</div>

## Preview

<table>
  <tr>
    <td align="center" width="50%"><img src="./docs/light.png" alt="Light canvas — warm ivory" /></td>
    <td align="center" width="50%"><img src="./docs/dark.png" alt="Dark canvas — warm black" /></td>
  </tr>
</table>

> Light: ivory canvas `#FCFCFB` with a muted sidebar `#FBFBF9`. Dark: warm black `#141413`. The theme follows the system color scheme; clay ember `#D97757` is the single accent on both canvases.

## Fonts

> **Important: the npm package does NOT ship the font files.** They live in the repository's [`fonts/`](fonts/) folder for download; the skin's font stack (Anthropic Sans UI / Serif body / Mono code) only takes effect once the fonts are installed into the system, then refresh / restart the web GUI.

| Font | Used for | File |
|---|---|---|
| Anthropic Sans Web Text | UI chrome | [`fonts/AnthropicSansWebText.ttf`](https://github.com/Nwflower/dsh-claude-style/raw/main/fonts/AnthropicSansWebText.ttf) |
| Anthropic Serif Web Text | Conversation body / markdown | [`fonts/AnthropicSerifWebText.ttf`](https://github.com/Nwflower/dsh-claude-style/raw/main/fonts/AnthropicSerifWebText.ttf) |
| Anthropic Mono Variable | Code / code blocks | [`fonts/AnthropicMonoVariable.ttf`](https://github.com/Nwflower/dsh-claude-style/raw/main/fonts/AnthropicMonoVariable.ttf) |

Install: double-click the `.ttf` on Windows → *Install*; on macOS import via *Font Book*. Refresh the page afterwards.

> The typefaces are Anthropic's property, provided for personal use only and not covered by the MIT license above (see the font notice in [LICENSE](LICENSE)).

## Install

> Tested on dsh 0.1.5-rc.2

1. Install via terminal

```bash
dsh plugin --profile web add dsh-claude-style                  # npm package (recommended)
dsh plugin --profile web add Nwflower/dsh-claude-style         # GitHub source
```

2. Install via [Plugin Marketplace](https://github.com/dsh-market/dsh-market)

Only one theme should be active at a time. After installing, **restart `dsh web`** and refresh the page.

## Usage

1. **Theme** — applies the whole canvas automatically after install; no configuration needed. Light and dark follow the system color scheme.
2. **Permission segments** — the composer gets a Read | Edit | Auto segmented control replacing the shipped access-mode menu: read-only, workspace write, and full access (Auto is switched through the shipped risk-confirmation dialog).
3. **Brand switch** — Settings (`Ctrl+,`) → **Claude Style**: the sidebar brand flips between the Claude starburst + the official Claude wordmark and Anthropic (`A\` + ANTHROPIC wordmark); the hero mark follows the choice with the clay fill. The choice persists in the browser; `claude` is the default.
4. **Account drawer** — the sidebar footer button opens a hover popover with quick access to Settings (`Ctrl+,`) and plugin management.
5. **Status polish** — thinking turns pick one of Claude Code's 185 spinner verbs per turn; the workspace loading state uses a Fluent-style circular indicator.

## Disable & Uninstall

Pause the theme without uninstalling — add the following to the profile's `cordis.patch.yml` (`~/.dsh/profiles/web/cordis.patch.yml`):

```yaml
- id: ui-skin-claude-style
  disabled: true
```

It hot-reloads within about a second; refresh to return to the stock look.

```bash
dsh plugin --profile web remove dsh-claude-style   # uninstall
```

Then restart `dsh web`; remove hand-added rows for this theme from `cordis.patch.yml` as well.

## Docs

| Document | Description |
| --- | --- |
| [Design Tokens](docs/STYLE.md) | Palette, typography, shapes, plus the bundle source layout and host-selector discipline |
| [Changelog](CHANGELOG.md) | Version history |
| [Contributing](CONTRIBUTING.md) | How to build from `src/`, commit rules, and the screenshot/regression tooling |
| [AGENTS.md](AGENTS.md) | Development guide for AI assistants: build commands, fragment rules, host-selector discipline, and the release flow (Chinese) |

## Related Links

> Running several themes side by side? Recommended: [dsh-skin-manager](https://github.com/xiaoyangcheng84-svg/dsh-skin-manager) — switch all installed themes from its Settings page.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Nwflower/dsh-claude-style&type=Date)](https://www.star-history.com/?type=date&repos=Nwflower%2Fdsh-claude-style)
