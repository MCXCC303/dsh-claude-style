# Style Guide · 设计令牌

Claude Style is a *warm editorial* skin distilled from anthropic.com.
This page documents the design tokens so contributions stay on-style.

## Palette

| Token | Value | Use |
|---|---|---|
| ivory light | `#FAF9F5` | light canvas |
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

- Radius: 4 / 8 / 16 px; pills for CTAs (`100vw`).
- Borders: 1px warm hairline.
- Spacing: 4 px rhythm.

## Implementation notes

- Every rule is scoped under `body[data-dsh-claude-style]`.
- Dark tokens are the base; light overrides use
  `:not([data-ds-dark-theme])`.
- Hand-written plain JS bundle (`lib/client.js`), no build step.
