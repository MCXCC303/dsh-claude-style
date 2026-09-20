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
| clay | `#D97757` | single accent — CTA / links |
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
- Focus: the composer field lights up — its hairline takes the input box's own
  shadow colour (espresso `#141413` in light) with a 1px halo in the same tone
  and a deeper drop shadow. Dark inverts the face: on the near-black canvas a
  black edge carries no cue, so the hairline and halo become bright ivory —
  the field visibly lights up instead of deepening. The footer tray below
  follows the same hairline so the two tiers stay one outline. Accent is never
  used for focus strokes.

## Implementation notes

- Every rule is scoped under `body[data-dsh-claude-style]`.
- Dark tokens are the base; light overrides use `:not([data-ds-dark-theme])`.

## Architecture · 源码结构

The shipped bundle `lib/client.js` is **generated** — never edit it directly.
Source lives in `src/` and `node scripts/build.mjs` (or `npm run build`)
assembles the bundle:

| Source | Content |
|---|---|
| `src/constants.js` | constants, spinner verbs, shared token values (evaluated at build time to fill `%%TOKEN%%` placeholders) |
| `src/assets/*.svg` | brand marks, inlined as CSS `url()` data URIs at build time (the loader exposes no asset URLs) |
| `src/styles/tokens.css` | design tokens (dark base + ivory light) |
| `src/styles/typography.css` | serif display / sans UI / mono code, editorial markdown |
| `src/styles/chrome.css` | canvas, hairlines, clay accent, chrome details |
| `src/styles/composer/hero.css` | hero brand mark and headline |
| `src/styles/composer/card.css` | composer input card and footer tray (gated by composer preference) |
| `src/styles/composer/inline.css` | in-conversation single-line composer (gated by composer preference) |
| `src/styles/sidebar.css` | sidebar brand, new-session row, workspace tree |
| `src/styles/components/permissions.css` | permission segments and popover |
| `src/styles/components/account-footer.css` | account row and floating popover |
| `src/styles/components/model-picker.css` | model picker popovers |
| `src/styles/components/footer-takeover.css` | host footer takeover rules |
| `src/styles/components/third-party.css` | agy-link repair rules |
| `src/styles/components/settings.css` | settings page section |
| `src/context/host.js` | host accessors and helpers |
| `src/context/prefs.js` | preference store |
| `src/context/model-copy.js` | model copy document store |
| `src/context/i18n.js` | localized copy lookups |
| `src/overrides/popover-utils.js` | shared anchor positioning and hover intent |
| `src/overrides/copy.js` | composer/copy rewrites installer |
| `src/overrides/permissions.js` | permission segments/popover installer |
| `src/overrides/model-picker.js` | model picker installer |
| `src/overrides/account-footer.js` | account footer/popover installer |
| `src/overrides/scheduler.js` | scheduler, observers, subscriptions, teardown |
| `src/settings.js` | settings section (brand switch) |
| `src/entry.js` | `apply()` orchestrator + exports |
| `src/model-descriptions.json` | model copy (picker labels + per-model descriptions); validated at build time and **copied** to `lib/`, not inlined |

Fragments share one factory scope at runtime: keep the 4-space base
indentation and do not use `import`/`export` inside fragments. The build
script rejects unsubstituted `%%TOKENS%%` and refuses to emit a bundle that
fails to parse.

`src/model-descriptions.json` is the one thing that does **not** go into the
bundle. Model copy is data: the build validates it and copies it to
`lib/model-descriptions.json`, and the host half (`lib/index.js`) serves it at
`/dsh-claude-style/model-descriptions.json` for the browser half to fetch on
first use. So the table grows without a rebuild, and no model text ships inside
`lib/client.js`. Every entry is a `{ locale: text }` pair — the picker renders
one line in the language the shell's own `locale` service reports, falling back
to the document's `fallback` locale. Lookup descends exact → family → tier →
the catalog's own text; family rules are ordered and must stay anchored (the
`flash` rule is scoped to `deepseek`, or another vendor's flash tier inherits
DeepSeek's copy).

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
