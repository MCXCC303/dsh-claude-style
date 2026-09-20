# src/assets/icons/lobe — vendored Lobe Icons brand marks

Mono brand marks for the model picker, taken from
[Lobe Icons](https://github.com/lobehub/lobe-icons) — the `@lobehub/icons-static-svg`
package (MIT), which is the static-asset half of the `@lobehub/icons` React
library. Upstream: <https://lobehub.com/icons>.

| | |
|---|---|
| Package | `@lobehub/icons-static-svg` |
| Version | `1.95.0` (pinned in `scripts/fetch-lobe-icons.mjs`) |
| Files | `<id>.svg`, mono variant (the unsuffixed file), `fill="currentColor"`, 24×24 viewBox |
| License | MIT (package). The logos themselves are trademarks of their owners — see below. |
| Refreshed by | `node scripts/fetch-lobe-icons.mjs` (networked, run by hand; never by the build) |

## Why vendored files instead of the React package

`@lobehub/icons` ships React components. This plugin cannot take a dependency on
it: `lib/client.js` is assembled by `scripts/build.mjs` into one self-contained
file because the DSH module loader has no relative requires and no asset URLs,
and this repo's rule is zero build tooling and zero runtime dependencies. So the
icons arrive the way the Anthropic wordmarks already do — as SVG sources in this
directory that the build inlines into the bundle.

The upstream files are normalised by the fetch script: `<title>` removed (the
row's own label is the accessible name), `style` and `width`/`height` removed
(CSS sizes the mark from its `viewBox`), whitespace collapsed, and a root fill
of `currentColor` guaranteed so the mark paints in the row's text colour. Mono
is the only variant used — the palette allows a single accent, so full-colour
vendor logos would fight the design.

## Which icons exist, and how they are referenced

The list lives in `scripts/fetch-lobe-icons.mjs`; the *bindings* live in
`src/model-descriptions.json`, not in code:

- `brands.providers` maps a provider route id (`deepseek-official`, `zai`, …) to
  an id here — that is the mark on a level-2 "More models" group header.
- `brands.models` is an ordered rule list matching a model id to an id here —
  that is the mark on a model row (the vendor that made the model, even when an
  aggregator resells it).

`scripts/build.mjs` fails the build when either references an id that is not
vendored, so the table cannot drift away from this directory. To add a vendor:
add its id to the fetch script, run it, then reference the id from the copy
document.

## Trademarks

These files are third-party brand assets redistributed for identification only.
Each logo remains the property of its owner and is not covered by this
repository's MIT license; the marks are used to identify the corresponding
model vendor or provider, not to imply endorsement. The MIT license above
covers the SVG packaging as published by Lobe Icons.
