# Contributing

Thanks for helping improve `dsh-claude-style`!

## Report an issue

Open an issue with:

- Which theme (light / dark) and viewport you saw it in
- A screenshot (this project is visual — a screenshot beats 100 words)
- The DSH version (`dsh --version`) and install source (npm / GitHub)

## Suggest a change

Open an issue first and describe the rationale. This theme aims to faithfully replicate the Claude Code Desktop experience; changes should align with the [design tokens](docs/STYLE.md).

## Code changes

- Keep the bundle hand-written plain JS (`lib/client.js`) — no build step.
- Scope every CSS rule under `body[data-dsh-claude-style]`.
- Follow the native theme: dark tokens as the base, light overrides under `:not([data-ds-dark-theme])`.
- Run `node --check lib/client.js` before committing.
