#!/usr/bin/env node
/**
 * build.mjs — assemble `lib/client.js` from `src/` fragments + `src/styles/*.css`.
 *
 * The shipped client bundle is a single self-contained file (the DSH module
 * loader has no relative requires and no asset URLs for plugin clients), so the
 * source is split for maintenance and inlined back at build time:
 *
 *   src/constants.js   Zone 1 — constants, masks, tokens (evaluated here to
 *                      substitute %%TOKEN%% placeholders in the stylesheets)
 *   src/styles/*.css   Zone 2 — plain CSS with %%TOKEN%% placeholders
 *   src/context.js     Zone 3 — host context & helpers
 *   src/overrides.js   Zone 4+5 — UI overrides, scheduler & teardown
 *   src/settings.js    Zone 4.4 — settings section (brand)
 *   src/entry.js       Zone 6 — apply() + exports
 *
 * Fragments are concatenated verbatim (they share one factory scope at
 * runtime), so each fragment must keep its 4-space base indentation and must
 * NOT use import/export.
 */
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'

const ROOT = path.resolve(import.meta.dirname, '..')
const SRC = path.join(ROOT, 'src')
const OUT = path.join(ROOT, 'lib', 'client.js')

const STYLE_FILES = [
  'tokens.css',
  'typography.css',
  'chrome.css',
  'composer.css',
  'sidebar.css',
  'components.css',
]

const HEADER = `/**
 * Claude Style — Claude Code Desktop theme for the DeepSeek Harness web GUI.
 *
 * GENERATED FILE — do not edit. Source lives in src/ (JS zones as fragments,
 * stylesheets as plain CSS); \`node scripts/build.mjs\` assembles this bundle.
 *   - src/constants.js   Zone 1: Constants & Tokens
 *   - src/styles/*.css   Zone 2: Stylesheets (tokens, typography, chrome,
 *                        composer, sidebar, components)
 *   - src/context.js     Zone 3: DSH Context & Helpers
 *   - src/overrides.js   Zone 4+5: UI Overrides, Scheduler & Teardown
 *   - src/settings.js    Settings Section (Brand)
 *   - src/entry.js       Zone 6: Plugin Entry & Export
 */
window.__ModuleLoader__.load({
  id: 'dsh-claude-style',
  factory: (require) => {
    'use strict'
    var module = { exports: {} }
    var exports = module.exports

    // React is resolved through the module loader's graph, so the settings
    // section can be a real component without a host half.
    var React = require('react')`

const FOOTER = `  },
})
`

/** Evaluate src/constants.js (pure, DOM-free) to obtain the %%TOKEN%% values. */
function loadTokens() {
  const constants = fs.readFileSync(path.join(SRC, 'constants.js'), 'utf8')
  const factory = new Function(`
    ${constants}
    return {
      SANS, SERIF, MONO, BRAND_ATTR, BRAND_ANTHROPIC,
      CLAUDE_MARK, CLAUDE_MARK_CLAY,
      ANTHROPIC_MARK, ANTHROPIC_BRAND_MARK, ANTHROPIC_BRAND_WORD,
    }
  `)
  return factory()
}

/** Substitute %%TOKEN%% placeholders in one stylesheet; throws on leftovers. */
function substitute(file, text, tokens) {
  const out = text.replace(/%%([A-Z_]+)%%/g, (match, name) => {
    if (!(name in tokens)) throw new Error(`build: unknown token %%${name}%% in src/styles/${file}`)
    return tokens[name]
  })
  if (out.includes('%%')) throw new Error(`build: unsubstituted token remains in src/styles/${file}`)
  return out
}

function main() {
  const tokens = loadTokens()

  const cssText = STYLE_FILES
    .map((file) => {
      const raw = fs.readFileSync(path.join(SRC, 'styles', file), 'utf8')
      return substitute(file, raw.replace(/\r\n/g, '\n'), tokens).replace(/\n+$/, '')
    })
    .join('\n\n')

  const cssDecl = [
    '    // ============================================================================',
    '    // Zone 2: 样式表（由 src/styles/*.css 内联生成，勿手改） (CSS Stylesheet)',
    '    // ============================================================================',
    '    var CSS = [',
    ...cssText.split('\n').map((line) => '      ' + JSON.stringify(line) + ','),
    "    ].join('\\n')",
  ].join('\n')

  const fragment = (name) => fs.readFileSync(path.join(SRC, name), 'utf8').replace(/\r\n/g, '\n').replace(/\n+$/, '')

  const bundle = [
    HEADER,
    fragment('constants.js'),
    cssDecl,
    fragment('context.js'),
    fragment('overrides.js'),
    fragment('settings.js'),
    fragment('entry.js'),
    FOOTER,
  ].join('\n\n')

  // Syntax gate: the bundle must parse before it is written.
  try {
    new vm.Script(bundle, { filename: 'lib/client.js' })
  } catch (error) {
    fs.writeFileSync(path.join(ROOT, '.debug', 'failed-bundle.js'), bundle)
    console.error('build: generated bundle failed to parse:', error.message)
    console.error('build: failing bundle written to .debug/failed-bundle.js')
    process.exit(1)
  }

  fs.writeFileSync(OUT, bundle)
  const lines = bundle.split('\n').length
  console.log(`built lib/client.js (${lines} lines, ${bundle.length} bytes) from src/ (${STYLE_FILES.length} stylesheets + 5 fragments)`)
}

main()
