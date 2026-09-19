# Contributing

Thanks for helping improve Claude Style! This is a small, focused skin —
most contributions fall into a few buckets.

## Report an issue

Open an issue with:

- which theme (light / dark) and viewport you saw it in
- a screenshot (this project is visual — a screenshot beats 100 words)
- the DSH version (`dsh --version`) and install source (npm / GitHub)

## Suggest a style change

Open an issue first and describe the rationale. This skin is deliberately
restrained (a single accent, three-face typography); changes that widen the
palette or add decoration are usually declined unless they follow the
[design tokens](docs/STYLE.md).

## Code changes

- Keep the bundle hand-written plain JS (`lib/client.js`) — no build step.
- Scope every CSS rule under `body[data-dsh-claude-style]`.
- Follow the native theme: dark tokens as the base, light overrides under
  `:not([data-ds-dark-theme])`.
- Run `node --check lib/client.js` before committing.

## Release checklist

See [PUBLISH.md](PUBLISH.md) for the npm / GitHub / market steps.
