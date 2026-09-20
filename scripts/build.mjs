#!/usr/bin/env node
/**
 * build.mjs — assemble `lib/client.js` from `src/` fragments + `src/styles/*.css`.
 *
 * The shipped client bundle is a single self-contained file (the DSH module
 * loader has no relative requires and no asset URLs for plugin clients), so the
 * source is split for maintenance and inlined back at build time:
 *
 *   src/constants.js   Zone 1 — constants & tokens (evaluated to substitute
 *                      %%TOKEN%% placeholders); brand SVGs live in src/assets/
 *   src/styles/*.css   Zone 2 — plain CSS with %%TOKEN%% placeholders
 *   src/context.js     Zone 3 — host context & helpers
 *   src/overrides.js   Zone 4+5 — UI overrides, scheduler & teardown
 *   src/settings.js    Zone 4.4 — settings section (brand)
 *   src/entry.js       Zone 6 — apply() + exports
 *
 * `src/model-descriptions.json` is not a fragment: it is validated here and
 * copied to `lib/`, where the host half serves it to the browser half at
 * runtime. Model copy is data, so it must not enter the bundle.
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
const ASSETS = path.join(SRC, 'assets')
const LIB = path.join(ROOT, 'lib')
const OUT = path.join(LIB, 'client.js')

/**
 * Model copy ships as DATA beside the bundle, not inside it: the browser half
 * fetches it at runtime (the host half serves it), so the table grows without
 * touching this build. It is validated here so a malformed table fails the
 * build instead of the picker.
 */
const MODEL_COPY = 'model-descriptions.json'

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
 *   - src/assets/*.svg   Brand marks (inlined as CSS url() data URIs at build time)
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
      SANS, SERIF, PROSE, MONO, BRAND_ATTR, BRAND_ANTHROPIC,
      CLAUDE_WORD_WIDTH: (18 * CLAUDE_WORD_ASPECT).toFixed(1),
    }
  `)
  return factory()
}

/**
 * Brand marks ship as runtime-inlined data URIs (the DSH loader exposes no
 * relative requires / asset URLs), so each src/assets/*.svg is encoded into a
 * CSS url() %%TOKEN%% value here, at build time.
 */
const SVG_TOKENS = {
  CLAUDE_MARK: 'claude-mark.svg',
  CLAUDE_WORD: 'claude-word.svg',
  CLAUDE_MARK_CLAY: 'claude-mark-clay.svg',
  ANTHROPIC_MARK: 'anthropic-mark.svg',
  ANTHROPIC_BRAND_MARK: 'anthropic-brand-mark.svg',
  ANTHROPIC_BRAND_WORD: 'anthropic-brand-word.svg',
}

/** Read one SVG source and wrap it as a CSS url() data URI. */
function loadSvgAssets() {
  const out = {}
  for (const [token, file] of Object.entries(SVG_TOKENS)) {
    const svg = fs.readFileSync(path.join(ASSETS, file), 'utf8').replace(/\r\n/g, '\n').trim()
    out[token] = 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")'
  }
  return out
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

/**
 * Check the model copy document before it ships. Every failure here is one the
 * picker could otherwise only express as a silently missing or wrong line, so
 * they all throw: a `families[].key` or `aliases` target that names no entry,
 * a rule whose `match` is not a compilable regexp, a `{zh, en}` pair missing a
 * language, or a document with no `exact` table at all.
 * @param doc - parsed `src/model-descriptions.json`.
 * @returns the number of exact entries, for the build log.
 */
function validateModelCopy(doc) {
  const fail = (message) => {
    throw new Error(`build: ${MODEL_COPY} ${message}`)
  }
  if (typeof doc !== 'object' || doc === null) fail('is not an object')
  if (typeof doc.fallback !== 'string' || doc.fallback === '') fail('needs a non-empty "fallback" locale id')
  if (typeof doc.exact !== 'object' || doc.exact === null) fail('needs an "exact" table')

  const locales = new Set([doc.fallback])
  const requirePair = (where, pair) => {
    if (typeof pair !== 'object' || pair === null) fail(`${where} is not a {locale: string} object`)
    for (const [locale, text] of Object.entries(pair)) {
      locales.add(locale)
      if (typeof text !== 'string' || text.trim() === '') fail(`${where}.${locale} is not a non-empty string`)
    }
  }

  for (const [id, pair] of Object.entries(doc.exact)) requirePair(`exact["${id}"]`, pair)
  for (const [key, pair] of Object.entries(doc.ui ?? {})) requirePair(`ui["${key}"]`, pair)
  for (const [from, to] of Object.entries(doc.aliases ?? {})) {
    if (typeof to !== 'string' || !(to in doc.exact)) fail(`alias "${from}" points at unknown entry "${to}"`)
  }
  for (const list of ['families', 'tiers']) {
    for (const [index, rule] of (doc[list] ?? []).entries()) {
      const where = `${list}[${index}]`
      if (typeof rule?.match !== 'string') fail(`${where} needs a string "match"`)
      try {
        new RegExp(rule.match)
      } catch (error) {
        fail(`${where} has an uncompilable "match": ${error.message}`)
      }
      if (rule.key !== undefined && !(rule.key in doc.exact)) fail(`${where} points at unknown entry "${rule.key}"`)
      if (rule.key === undefined) requirePair(`${where}.text`, rule.text)
    }
  }
  if (locales.size < 2) fail('carries fewer than two locales; i18n needs at least the fallback and one translation')
  return Object.keys(doc.exact).length
}

function main() {
  const tokens = { ...loadTokens(), ...loadSvgAssets() }

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

  const copy = JSON.parse(fs.readFileSync(path.join(SRC, MODEL_COPY), 'utf8'))
  const exact = validateModelCopy(copy)
  fs.writeFileSync(path.join(LIB, MODEL_COPY), JSON.stringify(copy, null, 2) + '\n')
  console.log(`built lib/${MODEL_COPY} (${exact} exact entries, ${copy.families.length} family rules, ${copy.tiers.length} tier rules)`)
}

main()
