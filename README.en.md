# claude-style-skin · Claude Style

[![awesome · DSH plugin](https://awesome-dsh-plugin.com/badge.svg)](https://awesome-dsh-plugin.com)
[![MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

An Anthropic warm-editorial skin for the DeepSeek Harness Web GUI, distilled from anthropic.com: an ivory / warm-black canvas, a single clay ember accent, serif display headlines + sans UI + mono labels, hairline borders and pill CTAs, following the native light/dark theme.

![light](docs/light.png)

## Highlights

- **Ivory `#FAF9F5` (light) / warm-black `#141413` (dark)** canvas, all-warm grays
- **One clay ember accent `#D97757`**, deepening to `#C6613F` on hover; accent reserved for CTA / links / focus (<10%)
- **Serif display + sans UI + mono labels** — a three-face editorial hierarchy
- Warm hairline borders, 8px radii, full pill CTAs
- Editorial markdown: serif headings, serif italics for emphasis, clay-edged blockquotes, inline-code chips, horizontal-rule tables
- A clean brand area: whale + wordmark float on the canvas, no badge, no backing pill
- Light / dark themes, following the system

![dark](docs/dark.png)

## Install

```sh
dsh plugin --profile web add TaiyakiOffical/claude-style-skin   # GitHub source
# or, if published to npm
dsh plugin --profile web add claude-style-skin                   # npm source (market prefers)
```

Then **restart `dsh web`** and refresh the page.

## Mutual exclusion

Only one skin is active at a time. Add `disabled: true` to the insert row of any other skin in the profile's `cordis.patch.yml`, or switch via [dsh-market](https://github.com/dsh-market/dsh-market) / [dsh-skin-manager](https://github.com/xiaoyangcheng84-svg/dsh-skin-manager):

```yaml
# ~/.dsh/profiles/web/cordis.patch.yml
- id: ui-skin-claude-style
  name: claude-style-skin
```

## Uninstall

1. Remove the `ui-skin-claude-style` insert row from the profile's `cordis.patch.yml`
2. `dsh plugin --profile web remove claude-style-skin`
3. Restart `dsh web`

## License

MIT
