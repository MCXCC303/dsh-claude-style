# dsh-claude-style · Claude Code Desktop Theme

[![MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A deep-customized theme plugin for the DeepSeek Harness (DSH) Web client, recreating the Claude Code Desktop visual and interaction experience.

![light](docs/light.png)

## Highlights

### 1. Claude Warm Editorial Aesthetics
- **Ivory / Warm-black Dual Canvas**: Ivory canvas (`#FCFCFB`) with muted sidebar (`#FBFBF9`) for light mode, warm-black (`#141413`) for dark mode, following system preferences.
- **Clay Ember Accent**: Signature clay ember (`#D97757`, hover `#C6613F`) for primary actions and focus states.
- **Three-Face Typography**: Serif display headings + sans-serif UI chrome + monospace code.
- **Editorial Rhythm**: Hairline borders, 8px card radii, and full-pill CTA buttons.

### 2. Claude Code Interaction Replicas
- **Plan / Edit / Auto Segmented Controls**: Replaces the shipped access mode menu with inline segments to switch between Plan (read-only), Edit (workspace write), and Auto (full access with safety confirmation).
- **Desktop Copy & Brand**: Custom new-conversation greeting, composer placeholder, and brand mark.
- **Sidebar Account Drawer**: Account button and popover drawer in the sidebar footer with quick access to Settings (`Ctrl+,`) and plugins.

![dark](docs/dark.png)

## Installation

```sh
dsh plugin --profile web add TaiyakiOffical/dsh-claude-style   # GitHub source
# or, if published to npm
dsh plugin --profile web add dsh-claude-style                    # npm source
```

After installation, **restart `dsh web`** and refresh the browser.

## Mutual Exclusion

Only one theme should be active at a time. Ensure the following entry is in your profile's `cordis.patch.yml`:

```yaml
# ~/.dsh/profiles/web/cordis.patch.yml
- id: ui-skin-claude-style
  name: dsh-claude-style
```

To switch to another theme, set `disabled: true` on this row or use `dsh-skin-manager`.

## Uninstallation

1. Remove the `ui-skin-claude-style` row from profile `cordis.patch.yml`
2. Run:
   ```sh
   dsh plugin --profile web remove dsh-claude-style
   ```
3. Restart `dsh web`

## License

MIT
