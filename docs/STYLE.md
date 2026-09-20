# Style Guide · 设计令牌

Design tokens for `dsh-claude-style`, recreating the Claude Code Desktop aesthetic.

## Palette

| Token | Value | Use |
|---|---|---|
| ivory light | `#FCFCFB` | light canvas |
| sidebar light | `#FBFBF9` | light sidebar |
| ivory | `#F0EEE6` | secondary surfaces |
| ivory dark | `#E8E6DC` | hover / section bg |
| slate dark | `#141413` | text (light mode), canvas (dark mode) |
| warm gray | `#B0AEA5` | metadata |
| clay | `#D97757` | single accent — CTA / links / focus |
| accent deep | `#C6613F` | accent hover |
| hairline | `#1414131a` | 1px warm border |

Rules:

- Never pure white, never pure black, never cool grays.
- Accent usage stays under ~10% of visible elements.

## Typography

- **Serif display** — headings / editorial statements (`--dsw-font-serif`).
- **Sans UI** — chrome, body (`--dsw-font-family`).
- **Mono** — code, technical labels (`--dsw-font-code`).

## Shapes

- Radius: 4 / 8 / 16 px; pills for CTAs (`9999px`).
- Borders: 1px warm hairline.
- Spacing: 4 px rhythm.
- Focus: the composer field lights up — its hairline goes to clay at ~60% alpha
  with a 1px warm bleed and a deeper drop shadow. The footer tray below follows
  the same hairline so the two tiers stay one outline.

## Implementation notes

- Every rule is scoped under `body[data-dsh-claude-style]`.
- Dark tokens are the base; light overrides use `:not([data-ds-dark-theme])`.

## Architecture · 源码结构

The shipped bundle `lib/client.js` is **generated** — never edit it directly.
Source lives in `src/` and `node scripts/build.mjs` (or `npm run build`)
assembles the bundle:

| Source | Zone | Content |
|---|---|---|
| `src/constants.js` | 1 | constants, spinner verbs, SVG masks (evaluated at build time to fill `%%TOKEN%%` placeholders in the stylesheets) |
| `src/styles/tokens.css` | 2.1 | design tokens (dark base + ivory light) |
| `src/styles/typography.css` | 2.2 | serif display / sans UI / mono code, editorial markdown |
| `src/styles/chrome.css` | 2.3 | canvas, hairlines, clay accent, chrome details |
| `src/styles/composer.css` | 2.3 | hero + in-conversation composer |
| `src/styles/sidebar.css` | 2.3 | sidebar brand, new-session row, workspace tree |
| `src/styles/components.css` | 2.4 | segments, permission popover, account drawer, settings section |
| `src/context.js` | 3 | host context & helpers |
| `src/overrides.js` | 4+5 | DOM overrides, MutationObserver scheduler, teardown |
| `src/settings.js` | 4.4 | settings section (brand switch) |
| `src/entry.js` | 6 | `apply()` + exports |

Fragments share one factory scope at runtime: keep the 4-space base
indentation and do not use `import`/`export` inside fragments. The build
script rejects unsubstituted `%%TOKENS%%` and refuses to emit a bundle that
fails to parse.

### Host selector discipline · 宿主选择器纪律

The host uses hashed CSS-module classes (`p_FcLG_row`, `_0cyzDW_viewArea`, …).
Substring matchers must use the **longest stable fragment**, and every new
rule should be checked for accidental hits:

- `[class*="_row"]`, never `[class*="row"]` — the bare substring also matches
  the composer growth wrapper `…_grow` and pinned the input field to 28px.
- Never override the host's active-phase layout contract on
  `[class*="viewArea"]` (`flex: 1 0 auto; min-height: auto`) — it is what
  keeps the sticky composer seat pinned to the scrollport bottom.

`node scripts/probe.cjs --token <launch-token>` drives a headless Chrome over
CDP and asserts the invariants (composer pinned at bottom, single-line start,
content growth). `node scripts/shoot.cjs --token <launch-token>` recaptures
the README screenshots (`docs/light.png` / `docs/dark.png`), swapping personal
data for neutral stand-ins in the DOM before any pixel is written.
