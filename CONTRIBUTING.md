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

- `lib/client.js` is generated — never edit it by hand. Change `src/` and run `npm run build`, which also syntax-gates the bundle.
- Scope every CSS rule under `body[data-dsh-claude-style]`.
- Follow the native theme: dark tokens as the base, light overrides under `:not([data-ds-dark-theme])`.
- See docs/STYLE.md for the source layout and host-selector discipline, and AGENTS.md for the rules the build enforces.
- `npm run smoke` checks the built bundle without a running DSH: the host half's private-route fence, and — in headless Chrome/Edge against a stand-in host page — boot, an idle scheduler, no markup injection, Enter left to the host, feature isolation and a clean teardown.
- `node scripts/probe.cjs --token <launch-token>` re-checks the composer invariants against a running DSH web GUI.
