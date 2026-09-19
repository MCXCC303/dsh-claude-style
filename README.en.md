# dsh-claude-style · Claude Code Desktop Theme

[![MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A theme plugin for the DeepSeek Harness (DSH) Web client, recreating the Claude Code Desktop visual and interaction experience.

![light](docs/light.png)

## Highlights

### 1. Claude Warm Editorial Aesthetics
- **Ivory / Warm-black Dual Canvas**: Ivory canvas (`#FCFCFB`) with muted sidebar (`#FBFBF9`) for light mode, warm-black (`#141413`) for dark mode, following system preferences.
- **Clay Ember Accent**: The clay ember (`#D97757`, hover `#C6613F`) as the single accent for actions and focus states.
- **Three Typefaces**: Serif display headings + sans-serif UI chrome + monospace code.
- **Editorial Rhythm**: Hairline borders, 8px card radii, and full-pill CTA buttons.

### 2. Claude Code Interaction Replicas
- **Read / Edit / Auto Segmented Controls**: Replaces the shipped access mode menu with inline segments to switch between Read (read-only), Edit (workspace write), and Auto (full access with safety confirmation).
- **Desktop Copy & Brand**: Custom new-conversation greeting, composer placeholder, and brand mark.
- **Sidebar Account Drawer**: Account button and popover drawer in the sidebar footer with quick access to Settings (`Ctrl+,`) and plugins.

![dark](docs/dark.png)

## Installation

```sh
dsh plugin --profile web add Nwflower/dsh-claude-style   # GitHub source
# or, if published to npm
dsh plugin --profile web add dsh-claude-style                    # npm source
```

The install command wires the theme into the profile composition automatically — no manual config. **Restart `dsh web`** and refresh the browser.

## Disable & Switch

Only one theme should be active at a time. To pause this one, add the following to your profile's `cordis.patch.yml` (`~/.dsh/profiles/web/cordis.patch.yml`):

```yaml
- id: ui-skin-claude-style
  disabled: true
```

It hot-reloads within about a second; refresh the page to return to the stock look. You can also install [dsh-skin-manager](https://github.com/xiaoyangcheng84-svg/dsh-skin-manager) and switch installed themes from its Settings page.

## Uninstallation

```sh
dsh plugin --profile web remove dsh-claude-style
```

Then restart `dsh web`. If you hand-added rows for this theme in `cordis.patch.yml`, remove them as well.

## License

MIT
