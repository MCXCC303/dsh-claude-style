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


## Shapes

- Radius: 4 / 8 / 16 px; pills for CTAs (`9999px`).
- Borders: 1px warm hairline.
- Spacing: 4 px rhythm.
- Bottom edge: the transcript never fades behind the composer by shadow. The
  composer seat paints an opaque `var(--dsw-alias-bg-base)` bar across its own
  box (so the bar's height *is* the composer's height) and one
  `--dsh-composer-fade-h` (40px) gradient band above it, running to transparent.
  The same token is the transcript's bottom clearance, so the last turn rests
  exactly at the band's top edge. Never re-add background-coloured halo shadows
  to the card to hide the transcript: they have to be restated in every
  light / dark / focus / attachment rule, and every rule that resets the card's
  `box-shadow` inherits the job.
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

## Popovers · 多选一弹层

Every single-choice popover in the skin — the permission menu, the model picker,
the account drawer, the session-stats card, and the host's own menu primitive
under the hero row's workspace and preset pickers — is meant to start from one
recipe. New popovers take it rather than inventing a card.

**Card**

| Property | Value |
|---|---|
| background | `var(--dsw-alias-bg-overlay)`; dark `#1e1e1d` |
| border | `1px solid var(--dsw-alias-border-l1)`; dark `#2e2c29` |
| radius | 12px |
| shadow | `0 8px 30px rgba(20,20,19,.12), 0 2px 8px rgba(20,20,19,.06)`; dark `rgba(0,0,0,.5)` / `rgba(0,0,0,.3)` |
| padding | 6px |
| layout | flex column, `gap: 6px` |
| z-index | 99999, above the host's own menus (1100) |
| open | `opacity 0 → 1`, `translateY(4px) scale(.98) → none`, `.15s ease`, origin on the anchor's side |

**Row**

| Property | Value |
|---|---|
| min-height | 32px — a floor, not a cap: a two-line row grows |
| padding | `2px 7px` |
| radius | 6px |
| text | 13px / 20px, `var(--dsw-alias-label-primary)` |
| hover | `var(--dsh-claude-hover-bg, rgba(0, 0, 0, .08))` |
| icon | 16px, `var(--dsw-alias-label-secondary)` |
| two-line row | name 13px / 16px at 500; description 11px / 14px in `label-tertiary` |
| current row | trailing `IconCheckOutline16` in `var(--dsw-alias-brand-primary)` — the accent is what marks the choice |
| disabled | `opacity: .4`, `cursor: not-allowed` |

**Heading, separator, footer**

- heading row: 11px / 16px at 600, `letter-spacing: .04em`, uppercase, `label-tertiary`, `padding: 6px 7px 2px`
- separator: 1px `var(--dsw-alias-border-l1)`, `margin: 2px 4px`
- pinned footer: `margin-top` / `padding-top` 4px, `1px solid var(--dsw-alias-border-l1)` above

**Host surfaces**

The host's dropdown menus are one shared primitive (primitives' `Menu`), and its
two class-name families hash in opposite directions: the primitive ships inside
the web shell as `_<local>_<hash>_<n>` (`_itemWrap_1nxmc_92`,
`_itemLabel_1nxmc_174`), while the client-ui packages hash as `<hash>_<local>`
(`daogkW_itemName`, `p_FcLG_cardWorkspaceTrigger`). A substring matcher therefore
takes the longest stable piece of whichever family it targets — `_itemWrap_`,
`_itemLabel_`, `_viewport_` on one side, `_itemName`, `_itemDesc` on the other —
never the bare local name.

The hero row's two pickers are that primitive, portaled to `<body>` with no
marker of their own. `src/overrides/hero-menu.js` stamps the open card with
`data-dsh-claude-hero-menu` and `components/hero-menu.css` restyles it; the
host's other menus (sidebar row menus, the settings permission row, submenus)
keep the host's own design on purpose. What that replaces: a 20px radius card
with 4px padding, 40px rows at 10px radius, and 14px text.

**All five are aligned**: the account drawer and the stats card were the outliers
(8px row radius, 2px and 4px card gap, 8px padding, 220 / 260px min-width,
z-index 1000 and 100000) and now follow the table above. The hero row's pickers are the host's own menu primitive, which differs in
two ways that CSS cannot change: it mounts instead of toggling a `data-open`
attribute, so it takes the same fade/scale as a one-shot `0.15s` animation; and
the host places it *below* its trigger, which is where the composer sits — so
`src/overrides/hero-menu.js` re-places it beside the trigger (bottom-aligned,
growing upward into the empty hero space, flipping left when the viewport is
tight) with an `important` inline write that outranks the host's own.

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
| `src/assets/icons/*.svg` | hand-provided lockup artwork (e.g. ChatGPT), which the vendoring step prefers over anything fetched; `brands.lockups` may also point a brand's two halves at different Lobe icons or crop a wordmark |
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
| `src/styles/components/hero-menu.css` | the host's menu primitive under the hero row's workspace/preset pickers (composer-gated) |
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
| `src/overrides/hero-menu.js` | stamps the host menu card the hero row's pickers open |
| `src/overrides/account-footer.js` | account footer/popover installer |
| `src/overrides/ban-screen.js` | account-hold easter egg installer |
| `src/overrides/scheduler.js` | scheduler, observers, subscriptions, teardown |
| `src/overrides/selection.js` | mirrors the window's focus state onto the document for the two text-selection paints |
| `src/settings.js` | settings section (brand switch) |
| `src/entry.js` | `apply()` orchestrator + exports |
| `src/model-descriptions.json` | model copy (picker labels + per-model descriptions); validated at build time and **copied** to `lib/`, not inlined |

Fragments share one factory scope at runtime — no `import`/`export`, 4-space
base indent; the build rejects unsubstituted `%%TOKENS%%` and refuses to emit a
bundle that fails to parse. The hard rules for fragments, model copy and host
selectors live in `AGENTS.md` (the selector section below is the detail page it
points to); the reasoning behind them is in `docs/architecture.md` (D1, D3, D5).

Model copy is the one thing that does **not** go into the bundle: the build
copies `src/model-descriptions.json` to `lib/` and the host half serves it, so
the table grows without a rebuild. The picker's brand bindings ride the same
document under `brands`; the note inside the file explains why a model no rule
claims draws no lockup at all.

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
