#!/usr/bin/env node
/**
 * fetch-lobe-icons.mjs — vendor the brand marks the model picker needs.
 *
 * The marks come from [Lobe Icons](https://github.com/lobehub/lobe-icons)
 * (`@lobehub/icons-static-svg`, MIT). That package is the static-asset half of
 * the `@lobehub/icons` React library: the same logos, as plain SVG files with
 * no React runtime attached.
 *
 * The React package itself is deliberately NOT a dependency of this plugin.
 * The shipped client bundle is assembled by scripts/build.mjs into one
 * self-contained file — the DSH module loader has no relative requires and no
 * asset URLs — so a component library would have to be bundled in, and this
 * repo's rule is zero build tooling and zero runtime dependencies. Vendoring
 * the SVG sources keeps that architecture: the marks are inlined into the
 * bundle at build time exactly like the Anthropic wordmarks in src/assets/.
 *
 * This script is the one networked step, and it is run by hand, never by the
 * build (a build must work offline). Re-running it is idempotent: every file is
 * rewritten from the pinned CDN version below.
 *
 * Usage:
 *   node scripts/fetch-lobe-icons.mjs           # (re)vendor every icon below
 *   node scripts/fetch-lobe-icons.mjs --check   # verify the tree matches the CDN
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const OUT_DIR = path.join(ROOT, 'src', 'assets', 'icons', 'lobe')

/** Pinned so a re-run reproduces the same bytes; bump deliberately. */
const PACKAGE = '@lobehub/icons-static-svg'
const VERSION = '1.95.0'
const SOURCE = (id) => `https://unpkg.com/${PACKAGE}@${VERSION}/icons/${id}.svg`

/**
 * The icon set, in the order the vendored files are written.
 *
 * Every id here is a lobe-icons *mono* mark (the unsuffixed file): one colour,
 * `fill="currentColor"`, drawn on a 24x24 viewBox. Mono is the only variant
 * this skin uses — the palette allows a single accent, so a row of full-colour
 * vendor logos would fight the design. The marks render in the row's own text
 * colour instead.
 *
 * The list covers two things:
 *   - provider routes the harness can serve models from (pi-ai's builtin
 *     catalog plus `deepseek-official`, see src/model-descriptions.json
 *     `providerBrands`);
 *   - model families the picker's rows name (see the `brand` field on that
 *     document's family rules).
 * Adding an icon is: add the id here, run this script, reference the id from
 * the copy document. The build fails if a referenced id is not vendored.
 */
const ICONS = [
  // First-party / official routes.
  'deepseek',
  'anthropic',
  'openai',
  'codex',
  'google',
  'vertexai',
  'gemini',
  // Aggregators, gateways and clouds.
  'openrouter',
  'bedrock',
  'azure',
  'cloudflare',
  'vercel',
  'together',
  'fireworks',
  'baseten',
  'cerebras',
  'groq',
  'nvidia',
  'huggingface',
  'githubcopilot',
  'opencode',
  // Model vendors.
  'zai',
  'moonshot',
  'kimi',
  'minimax',
  'qwen',
  'stepfun',
  'xai',
  'mistral',
  'bytedance',
  'baidu',
  'tencent',
  'antgroup',
  'xiaomimimo',
  'meta',
  'cohere',
  'microsoft',
  'nova',
  'perplexity',
  'inception',
  'celestoai',
]

/**
 * Normalise one upstream file into the shape the bundle inlines.
 *
 * Upstream ships a standalone document (`<title>`, `style`, `width`/`height`
 * in `em`, an `xmlns`); the bundle needs markup that drops into an existing
 * document and inherits its colour and size:
 *   - `<title>` is removed — the row's own label is the accessible name, and a
 *     title inside a decorative mark would be announced twice;
 *   - `style` and the `width`/`height` attributes are removed so CSS sizes the
 *     mark (the `viewBox` is what scales);
 *   - `xmlns` is kept: the markup is injected as `innerHTML`, and without it
 *     the parser does not treat the fragment as SVG.
 * A root `fill="none"` is preserved when every path carries its own fill.
 *
 * @param id - lobe-icons id, for diagnostics.
 * @param svg - upstream file contents.
 * @returns normalised single-line markup.
 */
function normalize(id, svg) {
  const fail = (message) => {
    throw new Error(`fetch-lobe-icons: ${id}.svg ${message}`)
  }
  if (!svg.includes('<svg')) fail('is not an SVG document')
  if (!svg.includes('viewBox=')) fail('has no viewBox; it cannot scale from CSS')

  let out = svg
    .replace(/\r\n/g, '\n')
    .replace(/<title>[\s\S]*?<\/title>/g, '')
    .replace(/\sstyle="[^"]*"/g, '')
    .replace(/\s(?:width|height)="[^"]*"/g, '')
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .trim()

  // A mono mark must be paintable by `color`; a mark that hard-codes a fill
  // would ignore the theme.
  const rootFill = /\sfill="([^"]*)"/.exec(out.slice(0, out.indexOf('>')))
  if (rootFill === null) {
    out = out.replace('<svg', '<svg fill="currentColor"')
  } else if (rootFill[1] !== 'currentColor' && rootFill[1] !== 'none') {
    fail(`hard-codes fill="${rootFill[1]}" instead of currentColor`)
  }
  if (/#[0-9a-fA-F]{3,8}/.test(out)) fail('carries a hard-coded colour')
  return out
}

/** Fetch one upstream icon. */
async function fetchIcon(id) {
  const response = await fetch(SOURCE(id))
  if (!response.ok) throw new Error(`fetch-lobe-icons: ${id} → HTTP ${response.status} (${SOURCE(id)})`)
  return response.text()
}

async function main() {
  const check = process.argv.includes('--check')
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const written = []
  for (const id of ICONS) {
    const markup = normalize(id, await fetchIcon(id))
    const file = path.join(OUT_DIR, `${id}.svg`)
    const body = markup + '\n'
    const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null
    if (current === body) continue
    if (check) throw new Error(`fetch-lobe-icons: src/assets/icons/lobe/${id}.svg differs from ${PACKAGE}@${VERSION}`)
    fs.writeFileSync(file, body)
    written.push(id)
  }
  // A vendored file that is no longer listed is dead weight in the bundle.
  const stale = fs.readdirSync(OUT_DIR)
    .filter((name) => name.endsWith('.svg') && !ICONS.includes(name.slice(0, -4)))
  if (stale.length > 0) {
    if (check) throw new Error(`fetch-lobe-icons: vendored but unlisted: ${stale.join(', ')}`)
    for (const name of stale) fs.rmSync(path.join(OUT_DIR, name))
  }

  const total = fs.readdirSync(OUT_DIR).filter((name) => name.endsWith('.svg')).length
  if (check) console.log(`lobe icons up to date (${total} files from ${PACKAGE}@${VERSION})`)
  else console.log(`vendored ${written.length} lobe icon(s) (${total} total) from ${PACKAGE}@${VERSION}${written.length ? ': ' + written.join(', ') : ''}`)
}

await main()
