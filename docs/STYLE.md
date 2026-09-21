# Style Guide · 设计令牌

Design tokens for `dsh-claude-style`, recreating the Claude Code Desktop aesthetic.

## Palette

| Token | Value | Use |
|---|---|---|
| ivory light | `#FCFCFB` | light canvas / layer 1 |
| sidebar light | `#FBFBF9` | light sidebar / layer 2 |
| ivory neutral | `#F9F9F6` | layer 3 / section bg |
| ivory border | `#E8E6DC` | border l1 |
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
- **Vendor face** — one model name in the picker, where the row already wears the
  vendor's mark (`--dsw-font-brand-gemini`: a Latin-only Google Sans Flex subset,
  standard weight, SIL OFL 1.1). A vendor face is a *material*, not a new UI role:
  it never replaces the sans stack, it sits in front of it, so text the subset does
  not cover falls through instead of turning to tofu. Rebuilt with
  `scripts/slim-google-sans.py`; licence in `fonts/OFL-GoogleSansFlex.txt`.

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

## Text selection

Selection is the one surface that leaves the palette on purpose — it is a
transient gesture, not part of the interface, so it uses the platform's two
solid paints and looks the same on both canvases:

| State | Background | Text |
|---|---|---|
| Window focused | `#3366D0` | `#FFFFFF` |
| Window unfocused | `#C7C7C6` | `#000000` |

Both are solid (never translucent) and `!important`, so they override whatever
colour the text underneath carries — links, inline code, syntax tokens. CSS
cannot read window focus: Chromium reaches the inactive paint through its own
internal `-internal-inactive-selection-*` properties, which a stylesheet cannot
address. `src/overrides/selection.js` therefore mirrors `document.hasFocus()`
onto `data-dsh-window-blur` and the stylesheet switches on that attribute; the
selection itself survives the blur.

## Markdown material

A quote is a **container**, not a link: it keeps the prose face on a neutral bar
and wash (text `#B0AEA5`, light `#6E6A60`), and whatever sits inside it keeps its
own material — links stay blue, inline-code chips stay warm red, file mentions
stay link-blue. Never paint the quote itself with the link colour: the colour
inherits into the block's inline code and mentions, which is exactly the leak
that made every path inside a quote read as a link.

**Inline file mentions are links, not code.** The host resolves a file path
inside an inline code span to a button (`.fileMention`, hashed — match it with
`[class*="_fileMention"]`) and paints it with its link alias. The generic
inline-code chip rule is more specific than that class, so a mention inherits
the chip's warm red unless a rule names it. A mention takes the link blue, weight
500, and the link's underline (solid in the link tone at rest, solid and fully
opaque on hover, same thickness and offset — the same treatment the skin gives an
anchor); the chip itself is left alone — the same fill, hairline, radius and
padding as any other inline code. Plain inline code keeps its warm text. Note the
hover rule must set only `text-decoration-color`: the `text-decoration` shorthand
resets `text-decoration-thickness` to `auto` and thins the line mid-hover.

## Inline code

The chip hugs its glyphs. The host builds it as an `inline-flex` box that
inherits the prose line box — 23px for a 15px code size — which left ~5px of
empty wash above and below the text. The skin sets `line-height: 1.2` on inline
code (27px → 22px, with the 1px padding as the visible inset); lower values
start clipping descenders. The fill, hairline, radius and size are unchanged.

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
| `src/assets/brand/*.svg` | brand marks, inlined as CSS `url()` data URIs at build time (the loader exposes no asset URLs) |
| `src/assets/icons/combine/*.svg` | vendor lockups (Lobe Icons mark + wordmark composed into one SVG, MIT), inlined as JS markup tables at build time; bound to models by `model-descriptions.json` → `brands` |
| `src/assets/icons/combine-src/*.svg` | hand-provided lockup artwork (e.g. ChatGPT), which the vendoring step prefers over anything fetched; `brands.lockups` may also point a brand's two halves at different Lobe icons or crop a wordmark |
| `src/assets/icons/providers/*` | cc-switch provider icon set (MIT); only the icon keys ride the bundle, the metadata is brand-resolution data |
| `src/styles/tokens.css` | design tokens (dark base + ivory light) |
| `src/styles/typography.css` | serif display / sans UI / mono code, editorial markdown |
| `src/styles/chrome.css` | canvas, hairlines, clay accent, chrome details |
| `src/styles/composer/hero.css` | hero brand mark and headline |
| `src/styles/composer/card.css` | composer input card and footer tray (gated by composer preference) |
| `src/styles/composer/inline.css` | in-conversation single-line composer (gated by composer preference) |
| `src/styles/sidebar.css` | sidebar brand, new-session row, workspace tree |
| `src/styles/components/permissions.css` | permission segments and popover |
| `src/styles/components/account-footer.css` | account row and floating popover |
| `src/styles/components/ban-screen.css` | the account-hold easter egg (full-window overlay) |
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
| `src/overrides/ban-screen.js` | account-hold easter egg installer |
| `src/overrides/scheduler.js` | scheduler, observers, subscriptions, teardown |
| `src/overrides/selection.js` | mirrors the window's focus state onto the document for the two text-selection paints |
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

The same document carries the picker's **brand marks** under `brands`:
`brands.providers` is deliberately empty — a model no rule claims draws **no**
lockup rather than its provider's, because a reseller's own lockup on a model it did
not make reads as a wrong answer rather than a missing one. `brands.models` is an
ordered, anchored rule list matching a model id (the row's vendor — the vendor that
made the model, not the aggregator reselling it). Both name ids with a vendored lockup in
`src/assets/icons/combine/` or a provider icon key, and the build fails on an id
that is not there, so the binding cannot drift. A lockup carries the vendor's mark
and its wordmark as one piece of art: the colour mark on the ivory canvas, the
mono one in `currentColor` on the warm black canvas (where a brand colour like
`#000` would vanish), so the label stays legible on both.
palette to its single clay accent. Full-colour variants are deliberately not
used — a third of the vendors ship no colour version (OpenAI, Anthropic, xAI,
Moonshot, Z.ai, Vercel, Groq), and several brand colours are near-black on the
`#141413` canvas.

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
