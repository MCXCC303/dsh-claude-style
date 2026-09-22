# DSH Claude Style

**A theme plugin that recreates the look and feel of Claude Code Desktop for the DeepSeek Harness Web GUI.**

<div align="center">

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

> Light: ivory canvas `#FCFCFB` with a pale sidebar `#FBFBF9`; dark: warm black `#141413`. The theme follows the system light/dark mode, and ember orange `#D97757` is the single action accent on both canvases.

## Fonts

> **Important: the Anthropic fonts are not distributed with the npm package — they live in this repository under [`fonts/`](fonts/).** You can install them system-wide, or skip the install entirely: drop the two `.ttf` files into the plugin package's `fonts/` directory and the host serves them as webfonts the same way (identical files, identical result). Either way, refresh / restart the web UI.

| Font | Used for | File |
|---|---|---|
| Anthropic Sans Web Text | Interface / UI | [`fonts/AnthropicSansWebText.ttf`](https://github.com/Nwflower/dsh-claude-style/raw/main/fonts/AnthropicSansWebText.ttf) |
| Anthropic Serif Web Text | Conversation body / Markdown | [`fonts/AnthropicSerifWebText.ttf`](https://github.com/Nwflower/dsh-claude-style/raw/main/fonts/AnthropicSerifWebText.ttf) |
| JetBrains Mono Variable | Code / code blocks | [`fonts/JetBrainsMonoVariable.ttf`](https://github.com/Nwflower/dsh-claude-style/raw/main/fonts/JetBrainsMonoVariable.ttf), [`fonts/JetBrainsMonoItalicVariable.ttf`](https://github.com/Nwflower/dsh-claude-style/raw/main/fonts/JetBrainsMonoItalicVariable.ttf) |

Enabling the Anthropic fonts (pick one):

① Install system-wide — on Windows, double-click the `.ttf` → "Install"; on macOS, import it with Font Book.

② No install — copy the `.ttf` files into the plugin package's `fonts/` directory. Refresh the page afterwards.

> The Anthropic Sans/Serif fonts are copyright Anthropic, licensed for personal use only, and are not covered by the MIT license.

## Installation

1. From a terminal

```bash
dsh plugin --profile web add dsh-claude-style                  # npm package (recommended)
dsh plugin --profile web add Nwflower/dsh-claude-style         # GitHub source
```

2. From the [plugin market](https://github.com/dsh-market/dsh-market)

Keep only one theme enabled at a time. After installing, **restart `dsh web`** and refresh the page.

## Features

1. **Theme** — global the moment it is installed, nothing to configure. Ivory `#FCFCFB` in light mode, warm black `#141413` in dark mode, with the same ember orange `#D97757` action accent on both; light/dark follows the system colour mode.
2. **Composer** — the input box is rebuilt end to end: a permission segment control (Full access / Read only / …), a model trigger carrying the vendor lockup, and the tool row and the stats sharing one line, with the send and stop keys unified into a 7px rounded rectangle. The stats sentence and the model trigger share one type size and colour.
3. **Model picker** — a new two-level popover: level one lists the official service plus the quick providers picked in settings, and the "More models" second level groups the rest by provider. Every row carries its vendor lockup and description; the foot holds the reasoning-effort slider (stepless — it settles on the nearest level when you let go) and the "More models" entry. Level two is bottom-aligned with level one, providers already shown in level one are not repeated, and a model without thinking support draws no slider at all. Hover opens after a 50ms dwell and closes after 150ms, and the sliver between the two cards does not count as leaving.
4. **Workspace** — the sidebar's "Workspace" heading becomes an **Active / Archived** segment control: Active keeps the host's own session tree, while Archived is the skin's own flat list (title, time, and an unarchive plus a delete button on every row). The rows line up with the host's own session rows item by item (row x=12 / width 251 / height 28 / title x=36). On a host without archiving support the control is not drawn and the plain heading stays.
5. **Sidebar** — the New session and Plugins rows take Claude's own shape: no plate at rest, a plate on hover, the "＋" of New session set in a circular chip, and both icons turning 90° clockwise on hover (four-fold symmetric glyphs, so they land back on themselves); the account drawer and the ban-screen easter egg stay as they were.

## Disabling and uninstalling

To pause the theme without uninstalling it, add this to the profile's `cordis.patch.yml` (`~/.dsh/profiles/web/cordis.patch.yml`):

```yaml
- id: ui-skin-claude-style
  disabled: true
```

It takes effect within about a second; refresh the page to get the stock look back.

```bash
dsh plugin --profile web remove dsh-claude-style   # uninstall
```

Then restart `dsh web`; if you added this theme's entry to `cordis.patch.yml` by hand, remove that too.

## Documentation

| Document | What it covers |
| --- | --- |
| [Design tokens](docs/STYLE.md) | Palette, fonts, shapes, source layout and the host-selector discipline (in English) |
| [Changelog](CHANGELOG.md) | Version history |
| [Contributing](CONTRIBUTING.md) | Building from `src/`, commit conventions, screenshot and regression tooling (in English) |

## Friends

> Running several themes at once? Try [dsh-skin-manager](https://github.com/xiaoyangcheng84-svg/dsh-skin-manager) — it switches between every installed theme from one settings page.