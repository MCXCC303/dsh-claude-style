# Provider icons

Vendored from [farion1231/cc-switch](https://github.com/farion1231/cc-switch)
`src/icons/extracted/` (MIT License, Copyright (c) 2025 Jason Young).

- `index.ts` declares the inline SVG / imported asset table.
- `metadata.ts` carries display names, categories, keywords and default colours.
- `scripts/build.mjs` parses both and emits `PROVIDER_ICON_KEYS` (the id set the
  picker resolves a provider route against) and `PROVIDER_ICON_METADATA` (display
  names, keywords, default colours) into the bundle. The icon markup itself no
  longer ships: model rows draw a vendored lockup from `src/assets/icons/combine/`.
- Imported/raster files are copied to `lib/icons/providers/` and served by the host
  half under `/dsh-claude-style/icons/providers/`.

Brand names and logos remain trademarks of their respective owners.
