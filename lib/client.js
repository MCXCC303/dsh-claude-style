/**
 * Claude Style — Claude Code Desktop theme for the DeepSeek Harness web GUI.
 *
 * Single-file zero-build architecture divided into 6 functional zones:
 *   - Zone 1: Constants & Tokens
 *   - Zone 2: CSS Stylesheet (Tokens, Editorial, Host Chrome, Custom Components)
 *   - Zone 3: DSH Context & Helpers
 *   - Zone 4: UI Overrides (Copy, Segments, Account Popover)
 *   - Zone 5: Scheduler & Teardown
 *   - Zone 6: Plugin Entry & Export
 */
window.__ModuleLoader__.load({
  id: 'dsh-claude-style',
  factory: (require) => {
    'use strict'
    var module = { exports: {} }
    var exports = module.exports

    // React is resolved through the module loader's graph, so the settings
    // section can be a real component without a build step or a host half.
    var React = require('react')

    // ============================================================================
    // Zone 1: 常量与配置定义 (Constants & Tokens)
    // ============================================================================
    var STYLE_ID = 'dsh-claude-style-style'

    var HERO_HEADLINE = 'Coffee and Claude time?'
    var COMPOSER_HINT = 'How can I help you today?'

    /**
     * Claude Code's 185 playful spinner verbs displayed while thinking / executing.
     * Recreates the iconic CLI waiting experience in the DSH web interface.
     */
    var SPINNER_VERBS = [
      // Cooking (22)
      'Baking', 'Blanching', 'Brewing', 'Caramelizing', 'Cooking', 'Fermenting', 'Flambeing', 'Frosting',
      'Garnishing', 'Infusing', 'Julienning', 'Kneading', 'Leavening', 'Marinating', 'Proofing', 'Sauteing',
      'Seasoning', 'Simmering', 'Stewing', 'Tempering', 'Whisking', 'Zesting',
      // Thinking (21)
      'Cerebrating', 'Cogitating', 'Considering', 'Contemplating', 'Deciphering', 'Deliberating', 'Determining',
      'Envisioning', 'Ideating', 'Imagining', 'Inferring', 'Mulling', 'Musing', 'Noodling', 'Perusing',
      'Philosophising', 'Pondering', 'Pontificating', 'Puzzling', 'Ruminating', 'Thinking',
      // Dancing / Movement (20)
      "Beboppin'", 'Boogieing', 'Frolicking', 'Gallivanting', 'Galloping', 'Grooving', 'Jitterbugging',
      'Meandering', 'Moonwalking', 'Moseying', 'Perambulating', 'Scampering', 'Scurrying', 'Shimmying',
      'Skedaddling', 'Slithering', 'Sock-hopping', 'Waddling', 'Wandering', 'Zigzagging',
      // Playful (26)
      'Befuddling', 'Bloviating', 'Boondoggling', 'Booping', 'Canoodling', 'Combobulating', 'Dilly-dallying',
      'Discombobulating', 'Fiddle-faddling', 'Finagling', 'Flibbertigibbeting', 'Flummoxing', 'Honking',
      'Hullaballooing', 'Lollygagging', 'Puttering', 'Razzle-dazzling', 'Razzmatazzing', 'Recombobulating',
      'Schlepping', 'Shenaniganing', 'Smooshing', 'Tomfoolering', 'Topsy-turvying', 'Whatchamacalliting',
      'Wibbling',
      // Science (12)
      'Crystallizing', 'Evaporating', 'Ionizing', 'Nebulizing', 'Nucleating', 'Osmosing', 'Photosynthesizing',
      'Pollinating', 'Precipitating', 'Quantumizing', 'Sublimating', 'Synthesizing',
      // Nature (15)
      'Billowing', 'Cascading', 'Drizzling', 'Ebbing', 'Flowing', 'Fluttering', 'Germinating', 'Gusting',
      'Misting', 'Sprouting', 'Swirling', 'Swooping', 'Thundering', 'Undulating', 'Whirlpooling',
      // Magic / Fantasy (12)
      'Channeling', 'Channelling', 'Enchanting', 'Hyperspacing', 'Levitating', 'Manifesting', 'Metamorphosing',
      'Orbiting', 'Prestidigitating', 'Transfiguring', 'Transmuting', 'Warping',
      // Productive / Work (25)
      'Accomplishing', 'Actioning', 'Actualizing', 'Architecting', 'Bootstrapping', 'Calculating', 'Churning',
      'Composing', 'Computing', 'Concocting', 'Crafting', 'Creating', 'Crunching', 'Doing', 'Effecting',
      'Elucidating', 'Forging', 'Forming', 'Generating', 'Hashing', 'Hatching', 'Orchestrating', 'Processing',
      'Working', 'Wrangling',
      // Creative (8)
      'Choreographing', 'Cultivating', 'Doodling', 'Embellishing', 'Harmonizing', 'Improvising', 'Sketching',
      'Tinkering',
      // Animal (6)
      'Burrowing', 'Herding', 'Nesting', 'Pouncing', 'Roosting', 'Symbioting',
      // Claude specific (3)
      'Clauding', 'Gitifying', 'Reticulating',
      // Other (13)
      'Beaming', 'Catapulting', 'Coalescing', 'Incubating', 'Mustering', 'Newspapering', 'Propagating',
      'Spinning', 'Twisting', 'Unfurling', 'Unravelling', 'Vibing', 'Whirring'
    ]

    /** Anthropic's starburst mark as an inline data URI, keeping the skin a single-file bundle with no asset request. */
    var ANTHROPIC_MARK = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z' fill='%23D97757'/%3E%3C/svg%3E\")"

    /** Segment label and the shipped /permission preset it selects. */
    var PERMISSION_SEGMENTS = [
      { label: 'Read', preset: 'read-only' },
      { label: 'Edit', preset: 'workspace-write' },
      { label: 'Auto', preset: 'danger-full-access' },
    ]

    /** In-conversation permission popover options matching Claude Code desktop style. */
    var PERMISSION_OPTIONS = [
      {
        preset: 'read-only',
        label: 'Read only',
        desc: '仅读取文件与分析，不修改代码'
      },
      {
        preset: 'workspace-write',
        label: 'Accept edits',
        desc: '允许编辑工作区文件'
      },
      {
        preset: 'danger-full-access',
        label: 'Full access',
        desc: '自动执行，无需反复确认'
      }
    ]

    /** The one preset the shipped UI gates behind its risk-confirmation dialog. */
    var GATED_PRESET = 'danger-full-access'
    /** Shipped full-access row labels, used to find that row in the shipped menu. */
    var FULL_ACCESS_LABELS = ['完全权限', 'Full access']
    /** Fallback prompt, used only when the shipped menu cannot be reached. */
    var GATED_PROMPT = '启用完全权限（Auto）？\n\n智能体将减少确认步骤，可直接执行敏感操作、文件修改或外部命令。仅建议在你信任当前任务时使用。'

    /** Skin-owned class names, so nothing couples to hashed CSS-module classes. */
    var SEGMENTS_CLASS = 'dsh-claude-segments'
    var SEGMENT_CLASS = 'dsh-claude-segment'

    /** Brand marks selectable from the settings page. `claude` is the default. */
    var BRAND_CLAUDE = 'claude'
    var BRAND_ANTHROPIC = 'anthropic'
    var DEFAULT_BRAND = BRAND_CLAUDE
    /** localStorage key holding the chosen brand. */
    var BRAND_STORAGE_KEY = 'dsh-claude-style:brand'
    /** The document attribute the stylesheet switches on. */
    var BRAND_ATTR = 'data-dsh-claude-brand'

    /**
     * Claude's own brand lockup, taken from the official artwork (claude.ai via
     * Wikimedia Commons, public domain as a simple geometric/text logo). The mark
     * and the wordmark ship as two separate alpha masks so each can be sized
     * independently: the sidebar pairs the starburst with the wordmark, while the
     * new-conversation hero uses the starburst alone with the clay fill baked in.
     *
     * Two details are load-bearing:
     *   - The source paths live in the artwork's own coordinate space and are
     *     wrapped in a group transform, so every mask has to carry that same
     *     `translate` or the tight viewBox crops the geometry away entirely.
     *   - `#` and `'` stay percent-encoded inside the data URI. A literal `#`
     *     starts a fragment and truncates the URI at that point.
     */
    var CLAUDE_TRANSFORM = "translate(-75.96,-223.53)"
    /** Tight viewBox of the starburst alone (148.09 x 148.18 user units). */
    var CLAUDE_MARK_VIEWBOX = '0 0 148.09 148.18'
    /** Tight viewBox of the wordmark alone, excluding the starburst. */
    var CLAUDE_WORD_VIEWBOX = '177.76 14.09 512.22 121.54'
    /** Aspect ratio of the wordmark, so callers can size it from the height. */
    var CLAUDE_WORD_ASPECT = 512.22 / 121.54
    /** Aspect ratio of the full mark+wordmark lockup. */
    var CLAUDE_LOCKUP_ASPECT = 689.98 / 148.18

    /** Starburst path, in the artwork's own (pre-transform) coordinates. */
    var CLAUDE_MARK_PATH = 'm 105.01,322.07 29.14,-16.35 0.49,-1.42 -0.49,-0.79 h -1.42 l -4.87,-0.3 -16.65,-0.45 -14.44,-0.6 -13.99,-0.75 -3.52,-0.75 -3.3,-4.35 0.34,-2.17 2.96,-1.99 4.24,0.37 9.37,0.64 14.06,0.97 10.2,0.6 15.11,1.57 h 2.4 l 0.34,-0.97 -0.82,-0.6 -0.64,-0.6 -14.55,-9.86 -15.75,-10.42 -8.25,-6 -4.46,-3.04 -2.25,-2.85 -0.97,-6.22 4.05,-4.46 5.44,0.37 1.39,0.37 5.51,4.24 11.77,9.11 15.37,11.32 2.25,1.87 0.9,-0.64 0.11,-0.45 -1.01,-1.69 -8.36,-15.11 -8.92,-15.37 -3.97,-6.37 -1.05,-3.82 c -0.37,-1.57 -0.64,-2.89 -0.64,-4.5 l 4.61,-6.26 2.55,-0.82 6.15,0.82 2.59,2.25 3.82,8.74 6.19,13.76 9.6,18.71 2.81,5.55 1.5,5.14 0.56,1.57 h 0.97 v -0.9 l 0.79,-10.54 1.46,-12.94 1.42,-16.65 0.49,-4.69 2.32,-5.62 4.61,-3.04 3.6,1.72 2.96,4.24 -0.41,2.74 -1.76,11.44 -3.45,17.92 -2.25,12 h 1.31 l 1.5,-1.5 6.07,-8.06 10.2,-12.75 4.5,-5.06 5.25,-5.59 3.37,-2.66 h 6.37 l 4.69,6.97 -2.1,7.2 -6.56,8.32 -5.44,7.05 -7.8,10.5 -4.87,8.4 0.45,0.67 1.16,-0.11 17.62,-3.75 9.52,-1.72 11.36,-1.95 5.14,2.4 0.56,2.44 -2.02,4.99 -12.15,3 -14.25,2.85 -21.22,5.02 -0.26,0.19 0.3,0.37 9.56,0.9 4.09,0.22 h 10.01 l 18.64,1.39 4.87,3.22 2.92,3.94 -0.49,3 -7.5,3.82 -10.12,-2.4 -23.62,-5.62 -8.1,-2.02 h -1.12 v 0.67 l 6.75,6.6 12.37,11.17 15.49,14.4 0.79,3.56 -1.99,2.81 -2.1,-0.3 -13.61,-10.24 -5.25,-4.61 -11.89,-10.01 h -0.79 v 1.05 l 2.74,4.01 14.47,21.75 0.75,6.67 -1.05,2.17 -3.75,1.31 -4.12,-0.75 -8.47,-11.89 -8.74,-13.39 -7.05,-12 -0.86,0.49 -4.16,44.81 -1.95,2.29 -4.5,1.72 -3.75,-2.85 -1.99,-4.61 1.99,-9.11 2.4,-11.89 1.95,-9.45 1.76,-11.74 1.05,-3.9 -0.07,-0.26 -0.86,0.11 -8.85,12.15 -13.46,18.19 -10.65,11.4 -2.55,1.01 -4.42,-2.29 0.41,-4.09 2.47,-3.64 14.74,-18.75 8.89,-11.62 5.74,-6.71 -0.04,-0.97 h -0.34 l -39.15,25.42 -6.97,0.9 -3,-2.81 0.37,-4.61 1.42,-1.5 11.77,-8.1 -0.04,0.04 z'

    /** Wordmark path, in the artwork's own (pre-transform) coordinates. */
    var CLAUDE_WORD_PATH = 'm 317.73,349.33 c -18.82,0 -31.69,-10.5 -37.76,-26.66 -3.17,-8.42 -4.74,-17.36 -4.61,-26.36 0,-27.11 12.15,-45.94 39,-45.94 18.04,0 29.17,7.87 35.51,26.66 h 7.72 l -1.05,-25.91 c -10.8,-6.97 -24.3,-10.5 -40.72,-10.5 -23.14,0 -42.82,10.35 -53.77,29.02 -5.66,9.86 -8.53,21.07 -8.32,32.44 0,20.74 9.79,39.11 28.16,49.31 10.06,5.37 21.34,8.04 32.74,7.72 17.92,0 32.14,-3.41 44.74,-9.37 l 3.26,-28.57 h -7.87 c -4.72,13.05 -10.35,20.89 -19.69,25.05 -4.57,2.06 -10.35,3.11 -17.32,3.11 z m 81.18,-98.96 0.75,-12.75 h -5.32 l -23.7,7.12 v 3.86 l 10.5,4.87 v 89.17 c 0,6.07 -3.11,7.42 -11.25,8.44 v 6.52 h 40.31 v -6.52 c -8.17,-1.01 -11.25,-2.36 -11.25,-8.44 V 250.4 l -0.04,-0.04 z m 160.31,108.75 h 3.11 l 27.26,-5.17 v -6.67 l -3.82,-0.3 c -6.37,-0.6 -8.02,-1.91 -8.02,-7.12 v -47.55 l 0.75,-15.26 h -4.31 l -25.76,3.71 v 6.52 l 2.51,0.45 c 6.97,1.01 9.04,2.96 9.04,7.84 v 42.37 c -6.67,5.17 -13.05,8.44 -20.62,8.44 -8.4,0 -13.61,-4.27 -13.61,-14.25 v -39.79 l 0.75,-15.26 h -4.42 l -25.8,3.71 v 6.52 l 2.66,0.45 c 6.97,1.01 9.04,2.96 9.04,7.84 v 39.11 c 0,16.57 9.37,24.45 24.3,24.45 11.4,0 20.74,-6.07 27.75,-14.51 l -0.75,14.51 -0.04,-0.04 z M 484.3,306.36 c 0,-21.19 -11.25,-29.32 -31.57,-29.32 -17.92,0 -30.94,7.42 -30.94,19.72 0,3.67 1.31,6.49 3.97,8.44 l 13.65,-1.8 c -0.6,-4.12 -0.9,-6.64 -0.9,-7.69 0,-6.97 3.71,-10.5 11.25,-10.5 11.14,0 16.76,7.84 16.76,20.44 v 4.12 l -28.12,8.44 c -9.37,2.55 -14.7,4.76 -18.26,9.94 -1.89,3.17 -2.8,6.82 -2.62,10.5 0,12 8.25,20.47 22.35,20.47 10.2,0 19.24,-4.61 27.11,-13.35 2.81,8.74 7.12,13.35 14.81,13.35 6.22,0 11.85,-2.51 16.87,-7.42 l -1.5,-5.17 c -2.17,0.6 -4.27,0.9 -6.49,0.9 -4.31,0 -6.37,-3.41 -6.37,-10.09 v -30.97 z m -36,40.76 c -7.69,0 -12.45,-4.46 -12.45,-12.3 0,-5.32 2.51,-8.44 7.87,-10.24 l 22.8,-7.24 v 21.9 c -7.27,5.51 -11.55,7.87 -18.22,7.87 z m 237.36,6.82 v -6.67 l -3.86,-0.3 c -6.37,-0.6 -7.99,-1.91 -7.99,-7.12 v -89.47 l 0.75,-12.75 h -5.36 l -23.7,7.12 v 3.86 l 10.5,4.87 v 29.32 c -5.91,-4.05 -12.98,-6.08 -20.14,-5.77 -23.55,0 -41.92,17.92 -41.92,44.74 0,22.09 13.2,37.35 34.95,37.35 11.25,0 21.04,-5.47 27.11,-13.95 l -0.75,13.95 h 3.15 l 27.26,-5.17 v 0 z m -49.35,-68.02 c 11.25,0 19.69,6.52 19.69,18.52 v 33.75 c -5.18,5.16 -12.23,8 -19.54,7.87 -16.12,0 -24.3,-12.75 -24.3,-29.77 0,-19.12 9.34,-30.37 24.15,-30.37 z M 743.3,302.8 c -2.1,-9.9 -8.17,-15.52 -16.61,-15.52 -12.6,0 -21.34,9.49 -21.34,23.1 0,20.14 10.65,33.19 27.86,33.19 11.48,-0.12 22.04,-6.33 27.71,-16.31 l 5.02,1.35 c -2.25,17.47 -18.07,30.52 -37.5,30.52 -22.8,0 -38.51,-16.87 -38.51,-40.87 0,-24 17.06,-41.21 39.86,-41.21 17.02,0 29.02,10.24 32.89,28.01 l -59.4,18.22 v -8.02 l 40.01,-12.41 v -0.04 z'

    /**
     * Build a CSS `url()` for one Claude mask.
     *
     * `encodeURIComponent` does the escaping, which is why the paths above are kept
     * as raw literals rather than pre-baked data URIs: every `#`, `'` and `<` gets
     * escaped exactly once, so no fill colour can accidentally terminate the URI.
     * `fill` defaults to `currentColor`, letting the mask follow the theme.
     *
     * @param viewBox - tight viewBox of the geometry being drawn.
     * @param paths - one or more path `d` strings to include.
     * @param fill - optional paint; omit for a currentColor alpha mask.
     * @returns a quoted CSS url() value.
     */
    function claudeMask(viewBox, paths, fill) {
      var body = ''
      for (var i = 0; i < paths.length; i++) {
        body += "<path" + (fill ? " fill='" + fill + "'" : '') + " d='" + paths[i] + "'/>"
      }
      var svg =
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='" + viewBox + "'>" +
        "<g transform='" + CLAUDE_TRANSFORM + "'>" + body + '</g></svg>'
      return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")'
    }

    /** The starburst alone, as a currentColor alpha mask. */
    var CLAUDE_MARK = claudeMask(CLAUDE_MARK_VIEWBOX, [CLAUDE_MARK_PATH])
    /** The wordmark alone, as a currentColor alpha mask. */
    var CLAUDE_WORD = claudeMask(CLAUDE_WORD_VIEWBOX, [CLAUDE_WORD_PATH])
    /** The full lockup (starburst + wordmark) as one currentColor alpha mask. */
    var CLAUDE_LOCKUP = claudeMask('0 0 689.98 148.18', [CLAUDE_MARK_PATH, CLAUDE_WORD_PATH])
    /** The starburst with the clay accent baked in, for the new-conversation hero. */
    var CLAUDE_MARK_CLAY = claudeMask(CLAUDE_MARK_VIEWBOX, [CLAUDE_MARK_PATH], '#D97757')

    /** Anthropic's A\ lockup mark (the alternate sidebar brand), as an alpha mask. */
    var ANTHROPIC_BRAND_MARK = "url(\"data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 46 32%27%3E%3Cpath d=%27M32.73 0H25.7846L38.4499 32H45.3953L32.73 0Z%27/%3E%3Cpath d=%27M12.6653 0L0 32H7.08167L9.67193 25.28H22.9219L25.5122 32H32.5939L19.9286 0H12.6653ZM11.9626 19.3371L16.2969 8.09143L20.6313 19.3371H11.9626Z%27/%3E%3C/svg%3E\")"

    /** The ANTHROPIC wordmark (the alternate sidebar brand), as an alpha mask. */
    var ANTHROPIC_BRAND_WORD = "url(\"data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 143 16%27%3E%3Cpath transform=%27translate(18.299999237060547,0.27000001072883606)%27 d=%27 M10.716191291809082,10.829001426696777 C10.716191291809082,10.829001426696777 3.756195545196533,0 3.756195545196533,0 C3.756195545196533,0 0,0 0,0 C0,0 0,15.470022201538086 0,15.470022201538086 C0,15.470022201538086 3.2038140296936035,15.470022201538086 3.2038140296936035,15.470022201538086 C3.2038140296936035,15.470022201538086 3.2038140296936035,4.6410064697265625 3.2038140296936035,4.6410064697265625 C3.2038140296936035,4.6410064697265625 10.163809776306152,15.470022201538086 10.163809776306152,15.470022201538086 C10.163809776306152,15.470022201538086 13.919991493225098,15.470022201538086 13.919991493225098,15.470022201538086 C13.919991493225098,15.470022201538086 13.919991493225098,0 13.919991493225098,0 C13.919991493225098,0 10.716191291809082,0 10.716191291809082,0 C10.716191291809082,0 10.716191291809082,10.829001426696777 10.716191291809082,10.829001426696777 C10.716191291809082,10.829001426696777 10.716191291809082,10.829001426696777 10.716191291809082,10.829001426696777z%27/%3E%3Cpath transform=%27translate(34.869998931884766,0.27000001072883606)%27 d=%27 M0,2.983504056930542 C0,2.983504056930542 5.19273567199707,2.983504056930542 5.19273567199707,2.983504056930542 C5.19273567199707,2.983504056930542 5.19273567199707,15.470022201538086 5.19273567199707,15.470022201538086 C5.19273567199707,15.470022201538086 8.507256507873535,15.470022201538086 8.507256507873535,15.470022201538086 C8.507256507873535,15.470022201538086 8.507256507873535,2.983504056930542 8.507256507873535,2.983504056930542 C8.507256507873535,2.983504056930542 13.700006484985352,2.983504056930542 13.700006484985352,2.983504056930542 C13.700006484985352,2.983504056930542 13.700006484985352,0 13.700006484985352,0 C13.700006484985352,0 0,0 0,0 C0,0 0,2.983504056930542 0,2.983504056930542 C0,2.983504056930542 0,2.983504056930542 0,2.983504056930542z%27/%3E%3Cpath transform=%27translate(51.22999954223633,0.27000001072883606)%27 d=%27 M10.605714797973633,6.165900230407715 C10.605714797973633,6.165900230407715 3.3142902851104736,6.165900230407715 3.3142902851104736,6.165900230407715 C3.3142902851104736,6.165900230407715 3.3142902851104736,0 3.3142902851104736,0 C3.3142902851104736,0 0,0 0,0 C0,0 0,15.470022201538086 0,15.470022201538086 C0,15.470022201538086 3.3142902851104736,15.470022201538086 3.3142902851104736,15.470022201538086 C3.3142902851104736,15.470022201538086 3.3142902851104736,9.149404525756836 3.3142902851104736,9.149404525756836 C3.3142902851104736,9.149404525756836 10.605714797973633,9.149404525756836 10.605714797973633,9.149404525756836 C10.605714797973633,9.149404525756836 10.605714797973633,15.470022201538086 10.605714797973633,15.470022201538086 C10.605714797973633,15.470022201538086 13.919991493225098,15.470022201538086 13.919991493225098,15.470022201538086 C13.919991493225098,15.470022201538086 13.919991493225098,0 13.919991493225098,0 C13.919991493225098,0 10.605714797973633,0 10.605714797973633,0 C10.605714797973633,0 10.605714797973633,6.165900230407715 10.605714797973633,6.165900230407715 C10.605714797973633,6.165900230407715 10.605714797973633,6.165900230407715 10.605714797973633,6.165900230407715z%27/%3E%3Cpath transform=%27translate(69.23999786376953,0.27000001072883606)%27 d=%27 M3.3151700496673584,2.983504056930542 C3.3151700496673584,2.983504056930542 7.403865814208984,2.983504056930542 7.403865814208984,2.983504056930542 C9.03934097290039,2.983504056930542 9.901290893554688,3.5801939964294434 9.901290893554688,4.707304000854492 C9.901290893554688,5.834399700164795 9.03934097290039,6.431103706359863 7.403865814208984,6.431103706359863 C7.403865814208984,6.431103706359863 3.3151700496673584,6.431103706359863 3.3151700496673584,6.431103706359863 C3.3151700496673584,6.431103706359863 3.3151700496673584,2.983504056930542 3.3151700496673584,2.983504056930542 C3.3151700496673584,2.983504056930542 3.3151700496673584,2.983504056930542 3.3151700496673584,2.983504056930542z M13.216461181640625,4.707304000854492 C13.216461181640625,1.7900969982147217 11.072648048400879,0 7.558576583862305,0 C7.558576583862305,0 0,0 0,0 C0,0 0,15.470022201538086 0,15.470022201538086 C0,15.470022201538086 3.3151700496673584,15.470022201538086 3.3151700496673584,15.470022201538086 C3.3151700496673584,15.470022201538086 3.3151700496673584,9.414593696594238 3.3151700496673584,9.414593696594238 C3.3151700496673584,9.414593696594238 7.005825519561768,9.414593696594238 7.005825519561768,9.414593696594238 C7.005825519561768,9.414593696594238 10.321218490600586,15.470022201538086 10.321218490600586,15.470022201538086 C10.321218490600586,15.470022201538086 13.990056991577148,15.470022201538086 13.990056991577148,15.470022201538086 C13.990056991577148,15.470022201538086 10.319005966186523,8.953378677368164 10.319005966186523,8.953378677368164 C12.161579132080078,8.245061874389648 13.216461181640625,6.753532409667969 13.216461181640625,4.707304000854492 C13.216461181640625,4.707304000854492 13.216461181640625,4.707304000854492 13.216461181640625,4.707304000854492z%27/%3E%3Cpath transform=%27translate(84.98999786376953,0)%27 d=%27 M7.622087478637695,12.906073570251465 C5.015110492706299,12.906073570251465 3.4244225025177,11.049725532531738 3.4244225025177,8.022093772888184 C3.4244225025177,4.95027494430542 5.015110492706299,3.0939269065856934 7.622087478637695,3.0939269065856934 C10.206976890563965,3.0939269065856934 11.775577545166016,4.95027494430542 11.775577545166016,8.022093772888184 C11.775577545166016,11.049725532531738 10.206976890563965,12.906073570251465 7.622087478637695,12.906073570251465 C7.622087478637695,12.906073570251465 7.622087478637695,12.906073570251465 7.622087478637695,12.906073570251465z M7.622087478637695,0 C3.1593029499053955,0 0,3.3149218559265137 0,8.022093772888184 C0,12.685078620910645 3.1593029499053955,16 7.622087478637695,16 C12.062784194946289,16 15.200028419494629,12.685078620910645 15.200028419494629,8.022093772888184 C15.200028419494629,3.3149218559265137 12.062784194946289,0 7.622087478637695,0 C7.622087478637695,0 7.622087478637695,0 7.622087478637695,0z%27/%3E%3Cpath transform=%27translate(103.29000091552734,0.27000001072883606)%27 d=%27 M7.405848026275635,6.873104095458984 C7.405848026275635,6.873104095458984 3.3160574436187744,6.873104095458984 3.3160574436187744,6.873104095458984 C3.3160574436187744,6.873104095458984 3.3160574436187744,2.983504056930542 3.3160574436187744,2.983504056930542 C3.3160574436187744,2.983504056930542 7.405848026275635,2.983504056930542 7.405848026275635,2.983504056930542 C9.04176139831543,2.983504056930542 9.90394115447998,3.646505117416382 9.90394115447998,4.928304195404053 C9.90394115447998,6.2101030349731445 9.04176139831543,6.873104095458984 7.405848026275635,6.873104095458984 C7.405848026275635,6.873104095458984 7.405848026275635,6.873104095458984 7.405848026275635,6.873104095458984z M7.5605998039245605,0 C7.5605998039245605,0 0,0 0,0 C0,0 0,15.470022201538086 0,15.470022201538086 C0,15.470022201538086 3.3160574436187744,15.470022201538086 3.3160574436187744,15.470022201538086 C3.3160574436187744,15.470022201538086 3.3160574436187744,9.85659408569336 3.3160574436187744,9.85659408569336 C3.3160574436187744,9.85659408569336 7.5605998039245605,9.85659408569336 7.5605998039245605,9.85659408569336 C11.07561206817627,9.85659408569336 13.219999313354492,8.000200271606445 13.219999313354492,4.928304195404053 C13.219999313354492,1.8563942909240723 11.07561206817627,0 7.5605998039245605,0 C7.5605998039245605,0 7.5605998039245605,0 7.5605998039245605,0z%27/%3E%3Cpath transform=%27translate(128.0399932861328,0)%27 d=%27 M10.914844512939453,10.5414400100708 C10.340370178222656,12.044201850891113 9.191434860229492,12.906073570251465 7.622706890106201,12.906073570251465 C5.0155181884765625,12.906073570251465 3.4246866703033447,11.049725532531738 3.4246866703033447,8.022093772888184 C3.4246866703033447,4.95027494430542 5.0155181884765625,3.0939269065856934 7.622706890106201,3.0939269065856934 C9.191434860229492,3.0939269065856934 10.340370178222656,3.9557981491088867 10.914844512939453,5.458559989929199 C10.914844512939453,5.458559989929199 14.427860260009766,5.458559989929199 14.427860260009766,5.458559989929199 C13.566211700439453,2.1436522006988525 10.981111526489258,0 7.622706890106201,0 C3.1595458984375,0 0,3.3149218559265137 0,8.022093772888184 C0,12.685078620910645 3.1595458984375,16 7.622706890106201,16 C11.003214836120605,16 13.588300704956055,13.834254264831543 14.449976921081543,10.5414400100708 C14.449976921081543,10.5414400100708 10.914844512939453,10.5414400100708 10.914844512939453,10.5414400100708 C10.914844512939453,10.5414400100708 10.914844512939453,10.5414400100708 10.914844512939453,10.5414400100708z%27/%3E%3Cpath transform=%27translate(117.83000183105469,0.27000001072883606)%27 d=%27 M0,0 C0,0 6.1677093505859375,15.470022201538086 6.1677093505859375,15.470022201538086 C6.1677093505859375,15.470022201538086 9.550004005432129,15.470022201538086 9.550004005432129,15.470022201538086 C9.550004005432129,15.470022201538086 3.382294178009033,0 3.382294178009033,0 C3.382294178009033,0 0,0 0,0 C0,0 0,0 0,0z%27/%3E%3Cpath transform=%27translate(0,0.27000001072883606)%27 d=%27 M5.824605464935303,9.348296165466309 C5.824605464935303,9.348296165466309 7.93500280380249,3.911694288253784 7.93500280380249,3.911694288253784 C7.93500280380249,3.911694288253784 10.045400619506836,9.348296165466309 10.045400619506836,9.348296165466309 C10.045400619506836,9.348296165466309 5.824605464935303,9.348296165466309 5.824605464935303,9.348296165466309 C5.824605464935303,9.348296165466309 5.824605464935303,9.348296165466309 5.824605464935303,9.348296165466309z M6.166755199432373,0 C6.166755199432373,0 0,15.470022201538086 0,15.470022201538086 C0,15.470022201538086 3.4480772018432617,15.470022201538086 3.4480772018432617,15.470022201538086 C3.4480772018432617,15.470022201538086 4.709278583526611,12.22130012512207 4.709278583526611,12.22130012512207 C4.709278583526611,12.22130012512207 11.16093635559082,12.22130012512207 11.16093635559082,12.22130012512207 C11.16093635559082,12.22130012512207 12.421928405761719,15.470022201538086 12.421928405761719,15.470022201538086 C12.421928405761719,15.470022201538086 15.87000560760498,15.470022201538086 15.87000560760498,15.470022201538086 C15.87000560760498,15.470022201538086 9.703250885009766,0 9.703250885009766,0 C9.703250885009766,0 6.166755199432373,0 6.166755199432373,0 C6.166755199432373,0 6.166755199432373,0 6.166755199432373,0z%27/%3E%3C/svg%3E\")"


    var SANS = "'Anthropic Sans Web Text','Noto Sans SC','Source Han Sans SC',-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei','Helvetica Neue',Helvetica,Arial,sans-serif"
    var SERIF = "'Anthropic Serif Web Text',Georgia,'Times New Roman','Noto Serif SC','Source Han Serif SC','Songti SC','SimSun',serif"
    var MONO = "'Anthropic Mono Variable',ui-monospace,'SF Mono','JetBrains Mono','Fira Code',Consolas,'Liberation Mono',Menlo,Courier,monospace"

    // ============================================================================
    // Zone 2: 样式表内联定义 (CSS Stylesheet)
    // ============================================================================
    var CSS = [
      '/* --- 2.1 Design Tokens (Dark Base & Light Overrides) --- */',
      '/* ---------- design tokens: warm-black (dark) base ---------- */',
      'body[data-dsh-claude-style] {',
      '  --dsw-font-family: ' + SANS + ';',
      '  --dsw-font-serif: ' + SERIF + ';',
      '  --dsw-font-code: ' + MONO + ';',
      '  --dsw-font-markdown-h1-font-family: var(--dsw-font-serif);',
      '  --dsw-font-markdown-h2-font-family: var(--dsw-font-serif);',
      '  --dsw-font-markdown-h3-font-family: var(--dsw-font-serif);',
      '  --dsw-font-markdown-h4-font-family: var(--dsw-font-serif);',
      '  --dsw-font-markdown-base-font-family: var(--dsw-font-family);',
      '  --dsw-font-markdown-small-font-family: var(--dsw-font-family);',
      '  --dsw-font-markdown-table-font-family: var(--dsw-font-family);',
      '  --dsw-alias-bg-base: #141413;',
      '  --dsw-alias-bg-layer-1: #1c1b1a;',
      '  --dsw-alias-bg-layer-2: #242320;',
      '  --dsw-alias-bg-layer-3: #2e2c29;',
      '  --dsw-alias-bg-overlay: #242320;',
      '  --dsw-alias-border-l1: #242320;',
      '  --dsw-alias-border-l2: #2e2c29;',
      '  --dsw-alias-border-l3: #3a3833;',
      '  --dsw-alias-brand-primary: #d97757;',
      '  --dsw-alias-brand-text: #faf9f5;',
      '  --dsw-alias-button-elevated-fill: #242320;',
      '  --dsw-alias-button-floating-fill: #242320;',
      '  --dsw-alias-button-floating-hover: #2e2c29;',
      '  --dsw-alias-button-info-fill: #d97757;',
      '  --dsw-alias-button-info-hover: #e08a6d;',
      '  --dsw-alias-interactive-bg-active: rgba(217, 119, 87, 0.30);',
      '  --dsh-claude-hover-bg: rgba(255, 255, 255, 0.08);',
      '  --dsw-alias-interactive-bg-hover: var(--dsh-claude-hover-bg);',
      '  --dsw-alias-interactive-bg-hover-solid: #2e2c29;',
      '  --dsw-alias-label-primary: #faf9f5;',
      '  --dsw-alias-label-primary-bluish: #faf9f5;',
      '  --dsw-alias-label-secondary: #b0aea5;',
      '  --dsw-alias-label-tertiary: #8f8d84;',
      '  --dsw-alias-label-caption: #6b6a65;',
      '  --dsw-alias-state-business-primary: #d97757;',
      '  --dsw-alias-state-business-tertiary: #3a2a22;',
      '  --dsw-shadow-lv2: 0 4px 16px rgba(0, 0, 0, 0.30), 0 1px 3px rgba(0, 0, 0, 0.14);',
      '  --dsw-specific-input-major: #0f0e0d;',
      '  --dsw-specific-selector: #2e2c29;',
      '  --dsw-specific-sidebar-fill: #141413;',
      '}',
      '',
      '/* ================= light variant: ivory editorial ================= */',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) {',
      '  --dsw-alias-bg-base: #fcfcfb;',
      '  --dsw-alias-bg-layer-1: #f5f3ee;',
      '  --dsw-alias-bg-layer-2: #f0eee6;',
      '  --dsw-alias-bg-layer-3: #e8e6dc;',
      '  --dsw-alias-bg-overlay: #ffffff;',
      '  --dsw-alias-border-l1: #e8e6dc;',
      '  --dsw-alias-border-l2: #dedcd2;',
      '  --dsw-alias-border-l3: #d0cdc1;',
      '  --dsw-alias-brand-primary: #d97757;',
      '  --dsw-alias-button-info-fill: #d97757;',
      '  --dsw-alias-button-info-hover: #c6613f;',
      '  --dsw-alias-button-floating-fill: #ffffff;',
      '  --dsw-alias-button-floating-hover: #ffffff;',
      '  --dsw-alias-label-primary: #141413;',
      '  --dsw-alias-label-primary-bluish: #141413;',
      '  --dsw-alias-label-secondary: #6e6a60;',
      '  --dsw-alias-label-tertiary: #8f8a7e;',
      '  --dsw-alias-label-caption: #a6a094;',
      '  --dsw-alias-state-business-primary: #d97757;',
      '  --dsw-alias-state-business-tertiary: #e9dfd2;',
      '  --dsw-specific-input-major: #ffffff;',
      '  --dsw-specific-menu: #ffffff;',
      '  --dsw-specific-selector: #f0eee6;',
      '  --dsw-specific-sidebar-fill: #fbfbf9;',
      '  --dsh-claude-hover-bg: rgba(0, 0, 0, 0.08);',
      '  --dsw-alias-interactive-bg-hover: var(--dsh-claude-hover-bg);',
      '  --dsw-shadow-lv2: 0 4px 18px rgba(20, 20, 19, 0.10), 0 1px 3px rgba(20, 20, 19, 0.05);',
      '}',
      '',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) {',
      '  color: #141413;',
      '  background-color: #fcfcfb !important;',
      '}',
      '',
      'html:has(body[data-dsh-claude-style]:not([data-ds-dark-theme])),',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) #root {',
      '  background-color: #fcfcfb !important;',
      '}',
      '',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) :is([data-pane="sidebar"], [class*="sidebarCol"], .dshDesktopSidebarSurface) {',
      '  --dsw-specific-sidebar-fill: #fbfbf9 !important;',
      '  background: #fbfbf9 !important;',
      '  border-right: 1px solid #e8e6dc !important;',
      '}',
      '',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) :is([data-pane="conversation"], [class*="centerCol"]) {',
      '  background: #fcfcfb !important;',
      '}',
      '',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) a {',
      '  color: #c6613f;',
      '}',
      '',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) a:hover {',
      '  color: #a94f2f;',
      '}',
      '',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) button[class*="_brand"],',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) button[class*="_primary"],',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) [data-slot="sidebar.settings"] > :is(button, [role="button"]) {',
      '  background: #d97757;',
      '  color: #ffffff;',
      '}',
      '',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) button[class*="_brand"]:hover,',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) button[class*="_primary"]:hover,',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) [data-slot="sidebar.settings"] > :is(button, [role="button"]):hover {',
      '  background: #c6613f;',
      '}',
      '',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) blockquote {',
      '  color: #6e6a60;',
      '  border-left-color: #c6613f;',
      '  background: rgba(198, 97, 63, 0.05);',
      '}',
      '',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) pre {',
      '  background: #f5f3ee;',
      '  border-color: #e8e6dc;',
      '}',
      '',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) code:not(pre code) {',
      '  background: #e8e6dc;',
      '}',
      '',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) table th {',
      '  background: #f0eee6;',
      '}',
      '',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) * {',
      '  scrollbar-color: rgba(208, 205, 193, 0.9) transparent;',
      '}',
      '',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) ::-webkit-scrollbar-thumb {',
      '  background: rgba(208, 205, 193, 0.9);',
      '}',
      '',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) ::-webkit-scrollbar-thumb:hover {',
      '  background: rgba(143, 138, 126, 0.8);',
      '}',
      '',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) ::selection {',
      '  background: rgba(217, 119, 87, 0.22);',
      '}',
      '',
      '/* --- 2.2 Typography & Markdown Editorial --- */',
      '/* ---------- typography: serif display + sans UI + mono code ---------- */',
      'body[data-dsh-claude-style] {',
      '  font-family: var(--dsw-font-family);',
      '  color: #faf9f5;',
      '  background-color: #141413;',
      '}',
      '',
      'body[data-dsh-claude-style] :is(h1, h2, h3, h4, [class*="headline"], [class*="title"]) {',
      '  font-family: var(--dsw-font-serif);',
      '  font-weight: 500;',
      '  letter-spacing: -0.01em;',
      '  line-height: 1.25;',
      '}',
      '',
      '/* display headings sit at 500; the new-conversation headline drops one step',
      '   further to 400, and both keep the tighter display tracking */',
      'body[data-dsh-claude-style] :is(h1, [class*="headline"]) {',
      '  font-weight: 500;',
      '  letter-spacing: -0.015em;',
      '}',
      '',
      'body[data-dsh-claude-style] :is(pre, code, kbd, samp, [class*="mono"], [class*="codeBlock"], [class*="CodeBlock"]) {',
      '  font-family: var(--dsw-font-code);',
      '}',
      '',
      '/* editorial captions */',
      'body[data-dsh-claude-style] :is([class*="caption"], [class*="sectionLabel"]) {',
      '  font-size: 12px;',
      '  font-weight: 500;',
      '}',
      '',
      '/* ---------- editorial markdown ---------- */',
      'body[data-dsh-claude-style] blockquote {',
      '  font-family: var(--dsw-font-serif);',
      '  font-style: italic;',
      '  color: #b0aea5;',
      '  border-left: 2px solid #d97757;',
      '  background: rgba(217, 119, 87, 0.06);',
      '  border-radius: 0 8px 8px 0;',
      '  padding: 0.6em 1em;',
      '}',
      '',
      'body[data-dsh-claude-style] pre {',
      '  background: #1c1b1a;',
      '  border: 1px solid #242320;',
      '  border-radius: 8px;',
      '}',
      '',
      'body[data-dsh-claude-style] code:not(pre code) {',
      '  background: #2e2c29;',
      '  border-radius: 4px;',
      '  padding: 0.15em 0.4em;',
      '  font-size: 0.88em;',
      '}',
      '',
      'body[data-dsh-claude-style] hr {',
      '  border: none;',
      '  border-top: 1px solid rgba(20, 20, 19, 0.14);',
      '  margin: 1.6em 0;',
      '}',
      '',
      'body[data-dsh-claude-style] table {',
      '  border-collapse: collapse;',
      '  font-size: 0.92em;',
      '  width: 100%;',
      '}',
      '',
      'body[data-dsh-claude-style] table th {',
      '  background: rgba(250, 249, 245, 0.06);',
      '  font-weight: 600;',
      '  text-align: left;',
      '}',
      '',
      'body[data-dsh-claude-style] table td, body[data-dsh-claude-style] table th {',
      '  border: none;',
      '  border-bottom: 1px solid rgba(20, 20, 19, 0.12);',
      '  padding: 0.6em 0.85em !important;',
      '}',
      '',
      '/* tabs: subtle editorial weighting */',
      'body[data-dsh-claude-style] [role="tab"] {',
      '  font-weight: 500;',
      '}',
      '',
      '/* technical meta (model selector, triggers) read as mono labels */',
      'body[data-dsh-claude-style] [class*="triggerLabel"],',
      'body[data-dsh-claude-style] [class*="selectLabel"],',
      'body[data-dsh-claude-style] [class*="monoLabel"] {',
      '  font-family: var(--dsw-font-code);',
      '  font-size: 12px;',
      '  letter-spacing: 0;',
      '}',
      '',
      '/* --- 2.3 Host Chrome Restyling (Sidebar, Composer, Buttons) --- */',
      '/* ---------- canvas + hairline structure ---------- */',
      'body[data-dsh-claude-style] :is([data-pane="sidebar"], [class*="sidebarCol"], .dshDesktopSidebarSurface) {',
      '  --dsw-specific-sidebar-fill: #141413 !important;',
      '  background: #141413 !important;',
      '  border-right: 1px solid #242320 !important;',
      '}',
      '',
      'body[data-dsh-claude-style] :is([data-pane="conversation"], [class*="centerCol"]) {',
      '  background: #141413;',
      '}',
      '',
      '/* ---------- clay accent: one emphasis color, disciplined ---------- */',
      'body[data-dsh-claude-style] a {',
      '  color: #e08a6d;',
      '}',
      '',
      'body[data-dsh-claude-style] a:hover {',
      '  color: #f0a488;',
      '}',
      '',
      'body[data-dsh-claude-style] button[class*="brand"] {',
      '  color: #d97757;',
      '}',
      '',
      '/* The baked-in wordmark "HARNESS" badge (a pill rect + its letter paths)',
      '   looks crowded next to the whale + wordmark. Hide the badge entirely so',
      '   the brand reads as a clean whale + wordmark on the clay pill. */',
      'body[data-dsh-claude-style] button[class*="brand"] rect[fill="currentColor"],',
      'body[data-dsh-claude-style] button[class*="brand"] path[fill*="label-primary-inverted"] {',
      '  display: none;',
      '}',
      '',
      '/* pill CTAs: send + settings sidebar actions */',
      'body[data-dsh-claude-style] button[class*="_brand"],',
      'body[data-dsh-claude-style] button[class*="_primary"],',
      'body[data-dsh-claude-style] [data-slot="sidebar.settings"] > :is(button, [role="button"]) {',
      '  border-radius: 9999px;',
      '  background: #d97757;',
      '  color: #ffffff;',
      '  font-weight: 500;',
      '}',
      '',
      'body[data-dsh-claude-style] button[class*="_brand"]:hover,',
      'body[data-dsh-claude-style] button[class*="_primary"]:hover,',
      'body[data-dsh-claude-style] [data-slot="sidebar.settings"] > :is(button, [role="button"]):hover {',
      '  background: #e08a6d;',
      '}',
      '',
      '/* Brand logo chip: drop the loud clay pill so the mark + wordmark sit on',
      '   the canvas. That pill also carried a 9999px radius, and together with the',
      '   button overflow:hidden its arc clipped the leading edge of the mark — so',
      '   the radius goes as well. Adaptive logo color: espresso on light, ivory',
      '   on dark. */',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) button[class*="brand"],',
      'body[data-dsh-claude-style][data-ds-dark-theme] button[class*="brand"] {',
      '  background: transparent !important;',
      '  border: none;',
      '  border-radius: 0;',
      '}',
      '',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) button[class*="brand"] {',
      '  color: #141413 !important;',
      '}',
      '',
      'body[data-dsh-claude-style][data-ds-dark-theme] button[class*="brand"] {',
      '  color: #faf9f5 !important;',
      '}',
      '',
      '/* badges: full pill */',
      'body[data-dsh-claude-style] :is([class*="badge"], [class*="Badge"], [class*="tag"], [class*="Tag"]) {',
      '  border-radius: 9999px;',
      '}',
      '',
      '/* ---------- chrome details ---------- */',
      'body[data-dsh-claude-style] * {',
      '  scrollbar-width: thin;',
      '  scrollbar-color: rgba(58, 56, 51, 0.9) transparent;',
      '}',
      '',
      'body[data-dsh-claude-style] ::-webkit-scrollbar {',
      '  width: 8px;',
      '  height: 8px;',
      '}',
      '',
      'body[data-dsh-claude-style] ::-webkit-scrollbar-track {',
      '  background: transparent;',
      '}',
      '',
      'body[data-dsh-claude-style] ::-webkit-scrollbar-thumb {',
      '  background: rgba(58, 56, 51, 0.9);',
      '  border-radius: 9999px;',
      '}',
      '',
      'body[data-dsh-claude-style] ::-webkit-scrollbar-thumb:hover {',
      '  background: rgba(107, 106, 101, 0.9);',
      '}',
      '',
      'body[data-dsh-claude-style] ::selection {',
      '  background: rgba(217, 119, 87, 0.30);',
      '  color: inherit;',
      '}',
      '',
      'body[data-dsh-claude-style] :is(button, input, textarea, select, [role="button"], [role="tab"], [role="treeitem"]) {',
      '  outline: none;',
      '}',
      '',
      'body[data-dsh-claude-style] :is(button, input, textarea, select, [role="button"], [role="tab"], [role="treeitem"]):focus-visible {',
      '  outline: 2px solid rgba(217, 119, 87, 0.75);',
      '  outline-offset: 1px;',
      '}',
      '',
      '',
      '/* ---------- Claude Code layout: hero brand mark ---------- */',
      '/* The new-conversation hero ships the DeepSeek fish; swap it for the selected',
      '   brand mark. Every child of the hitbox is hidden — the mark can sit behind a',
      '   slot wrapper, not always a bare svg — and the mark is painted on the hitbox,',
      '   so React keeps owning its own node. The hero keeps the clay fill in both',
      '   brands, matching the shipped accent treatment. */',
      'body[data-dsh-claude-style] [class*="fishHitbox"] > * {',
      '  display: none !important;',
      '}',
      '',
      'body[data-dsh-claude-style] [class*="fishHitbox"] svg {',
      '  display: none !important;',
      '}',
      '',
      'body[data-dsh-claude-style] [class*="fishHitbox"]::before {',
      '  content: "";',
      '  flex: none;',
      '  width: 42.5px;',
      '  height: 42.5px;',
      '  background-repeat: no-repeat;',
      '  background-position: center;',
      '  background-size: contain;',
      '}',
      '',
      'body[data-dsh-claude-style]:not([' + BRAND_ATTR + '="' + BRAND_ANTHROPIC + '"]) [class*="fishHitbox"]::before {',
      '  background-image: ' + CLAUDE_MARK_CLAY + ';',
      '}',
      '',
      'body[data-dsh-claude-style][' + BRAND_ATTR + '="' + BRAND_ANTHROPIC + '"] [class*="fishHitbox"]::before {',
      '  background-image: ' + ANTHROPIC_MARK + ';',
      '}',
      '',
      '/* The preview badge has no Claude Code counterpart. */',
      'body[data-dsh-claude-style] [class*="previewBadge"] {',
      '  display: none !important;',
      '}',
      '',
      '/* Headline: the shipped 26px/32px editorial display, then 15% back off that',
      '   (52 -> 44.2) and one weight step below the display rule. */',
      'body[data-dsh-claude-style] [class*="headline"]:has([class*="fishHitbox"]) {',
      '  font-size: 44.2px;',
      '  line-height: 54.4px;',
      '  font-weight: 400;',
      '}',
      '',
      '/* ---------- Claude Code layout: composer input + buttons ---------- */',
      '/* The composer card is the input box: one step up in type size, pure white',
      '   so it separates from the canvas, and an outline 4px tighter than the',
      '   shipped 22px. */',
      'body[data-dsh-claude-style] [data-composer-card] {',
      '  font-size: 15px;',
      '  border-radius: 18px;',
      '  border: 1px solid var(--dsw-alias-border-l1);',
      '  position: relative;',
      '  z-index: 2;',
      '  gap: 8px !important;',
      '  padding-bottom: 2px !important;',
      '  min-height: 0 !important;',
      '  height: auto !important;',
      '  transition: border-color 0.12s ease, box-shadow 0.12s ease;',
      '}',
      '',
      '/* Input height, by composer variant. The hero (new conversation) keeps the',
      '   tall 86px field it was tuned to. An active conversation instead hugs its',
      '   draft: the shipped 36px floor holds exactly one line, the contenteditable',
      '   then grows a line at a time, and .scroll caps the box at',
      '   --dsh-composer-text-max-height before it starts scrolling. Both hooks are',
      '   ancestors of the field, so :is() also keeps the tall field through the',
      '   settling frame, while an active composer matches neither. */',
      'body[data-dsh-claude-style] :is([class*="composerHero"], [data-phase="hero"]) [data-composer-input] {',
      '  min-height: 86px !important;',
      '}',
      '',
      'body[data-dsh-claude-style] [data-composer-input] {',
      '  min-height: 36px !important;',
      '  height: auto !important;',
      '}',
      '',
      '/* Tight bottom padding below the button controls row */',
      'body[data-dsh-claude-style] [data-composer-card] [class*="row"] {',
      '  padding-bottom: 2px !important;',
      '}',
      '',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) [data-composer-card] {',
      '  background: #ffffff;',
      '  box-shadow: 0 4px 12px rgba(20, 20, 19, 0.04), 0 1px 3px rgba(20, 20, 19, 0.02);',
      '}',
      '',
      '/* Focus: the shipped field has no focus face at all — only the caret moves —',
      '   so this adds one, and it reads as a glow rather than a neutral ring: the',
      '   hairline goes to the clay accent at a high alpha, a 1px warm bleed hugs the',
      '   edge, and the drop shadow deepens. The tray below continues the same',
      '   outline, so it warms its three edges whenever the card above it holds',
      '   focus. Dark sits on a near-black canvas, so there the glow leans on the',
      '   warm edge and a deeper ambient shadow instead of the light bleed. */',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) [data-composer-card]:focus-within {',
      '  border-color: rgba(217, 119, 87, 0.60);',
      '  box-shadow: 0 0 0 1px rgba(217, 119, 87, 0.22), 0 6px 18px rgba(20, 20, 19, 0.10), 0 2px 6px rgba(20, 20, 19, 0.05);',
      '}',
      '',
      'body[data-dsh-claude-style][data-ds-dark-theme] [data-composer-card]:focus-within {',
      '  border-color: rgba(217, 119, 87, 0.64);',
      '  box-shadow: 0 0 0 1px rgba(217, 119, 87, 0.30), 0 6px 20px rgba(0, 0, 0, 0.45);',
      '}',
      '',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) [class*="composerStack"]:has([data-composer-card]:focus-within) > [class*="heroWorkspaceRow"] {',
      '  border-color: rgba(217, 119, 87, 0.60);',
      '}',
      '',
      'body[data-dsh-claude-style][data-ds-dark-theme] [class*="composerStack"]:has([data-composer-card]:focus-within) > [class*="heroWorkspaceRow"] {',
      '  border-color: rgba(217, 119, 87, 0.64);',
      '}',
      '',
      '/* The workspace-trigger variant paints its dashed ring through a masked svg',
      '   cut with rx=22; re-cut it so the ring tracks the 18px card. */',
      'body[data-dsh-claude-style] [data-composer-card]:after {',
      '  border-radius: 18px;',
      '  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27%3E%3Crect width=%27100%25%27 height=%27100%25%27 fill=%27none%27 rx=%2718%27 ry=%2718%27 stroke=%27black%27 stroke-width=%272%27 stroke-dasharray=%274 4%27/%3E%3C/svg%3E");',
      '  mask: url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27%3E%3Crect width=%27100%25%27 height=%27100%25%27 fill=%27none%27 rx=%2718%27 ry=%2718%27 stroke=%27black%27 stroke-width=%272%27 stroke-dasharray=%274 4%27/%3E%3C/svg%3E");',
      '}',
      '',
      '/* Commands and attach: 7px corners instead of the shipped full circle, no',
      '   resting fill, and a warm plate on hover. */',
      'body[data-dsh-claude-style] :is(button[aria-label="指令"], button[aria-label="Commands"], button[aria-label="添加附件"], button[aria-label="Add attachment"]) {',
      '  border-radius: 7px;',
      '}',
      '',
      '/* Send, and the stop/queue/steer labels that replace it while running: the',
      '   shipped 34px circle becomes a 7px rounded rectangle. */',
      'body[data-dsh-claude-style] :is(button[aria-label="发送消息"], button[aria-label="Send message"], button[aria-label="排队发送"], button[aria-label="Queue message"], button[aria-label="插话发送"], button[aria-label="Steer message"], button[aria-label="停止生成"], button[aria-label="Stop generating"]) {',
      '  border-radius: 7px;',
      '}',
      '',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) :is(button[aria-label="指令"], button[aria-label="Commands"], button[aria-label="添加附件"], button[aria-label="Add attachment"]) {',
      '  background: transparent;',
      '}',
      '',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) :is(button[aria-label="指令"], button[aria-label="Commands"], button[aria-label="添加附件"], button[aria-label="Add attachment"]):hover:not(:disabled) {',
      '  background: #f6f6f4;',
      '}',
      '',
      '/* Model selector: the same type size as the permission segments and the',
      '   same 7px corners; its chevron is dropped while the click target and the',
      '   menu it opens stay exactly as shipped. Its shipped hover token is only a',
      '   ~6% tint, so the hover plate matches the composer tool buttons. */',
      'body[data-dsh-claude-style] [data-composer-card] [class*="trigger"] {',
      '  font-size: 14px;',
      '  border-radius: 7px;',
      '}',
      '',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) [data-composer-card] [class*="trigger"]:hover:not(:disabled) {',
      '  background: #f6f6f4;',
      '}',
      '',
      'body[data-dsh-claude-style] [data-composer-card] [class*="_chevron"] {',
      '  display: none !important;',
      '}',
      '',
      '/* ---------- Claude Code layout: composer footer bar ---------- */',
      '/* Reference layout: two-tier integrated tray. The top card is a pure white',
      '   rounded card with drop shadow (z-index: 2). The bottom tray is a seamless',
      '   equal-width tray (z-index: 1) attached directly to the bottom of the card,',
      '   with transparent background (inheriting the canvas tone #fcfcfb),',
      '   left/right/bottom border, and 18px rounded bottom corners. */',
      'body[data-dsh-claude-style] [class*="composerStack"]:has([class*="heroWorkspaceRow"]) {',
      '  --dsh-claude-bar-h: 96px;',
      '}',
      '',
      'body[data-dsh-claude-style] [class*="composerStack"]:has([class*="heroWorkspaceRow"]) *:has([data-composer-card]) {',
      '  order: 1;',
      '  padding-bottom: 0 !important;',
      '}',
      '',
      'body[data-dsh-claude-style] [class*="composerStack"]:has([class*="heroWorkspaceRow"]) [data-composer-card] {',
      '  gap: 8px !important;',
      '  padding-bottom: 2px !important;',
      '  min-height: 0 !important;',
      '  height: auto !important;',
      '}',
      '',
      'body[data-dsh-claude-style] [class*="composerStack"]:has([class*="heroWorkspaceRow"]) > [class*="heroWorkspaceRow"] {',
      '  order: 2;',
      '  position: relative;',
      '  z-index: 1;',
      '  box-sizing: border-box;',
      '  height: calc(var(--dsh-claude-bar-h) + 18px);',
      '  width: calc(100% - var(--dsh-composer-side-clearance, 0px) - var(--dsh-composer-side-clearance, 0px));',
      '  max-width: var(--dsh-composer-card-max-width, 100%);',
      '  margin: calc(0px - var(--dsh-composer-stack-gap, 6px) - 18px) auto 0;',
      '  padding: 18px 16px 0 16px;',
      '  background: transparent;',
      '  border-left: 1px solid var(--dsw-alias-border-l1);',
      '  border-right: 1px solid var(--dsw-alias-border-l1);',
      '  border-bottom: 1px solid var(--dsw-alias-border-l1);',
      '  border-top: none;',
      '  border-radius: 0 0 18px 18px;',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: space-between;',
      '  transition: border-color 0.12s ease;',
      '}',
      '',
      '/* Muted typography and 7px corners for footer controls */',
      'body[data-dsh-claude-style] [class*="heroWorkspaceRow"] :is(button, [role="button"]) {',
      '  font-size: 13px;',
      '  color: var(--dsw-alias-label-secondary);',
      '  border-radius: 7px;',
      '}',
      '',
      '/* Hide chevrons in the footer tray for a clean, minimal Claude Code look */',
      'body[data-dsh-claude-style] [class*="heroWorkspaceRow"] :is([class*="chevron"], [class*="Chevron"]) {',
      '  display: none !important;',
      '}',
      '',
      '/* ---------- Claude Code layout: composer send button ---------- */',
      '/* An empty composer keeps the send button in place but drops it to a ghost:',
      '   transparent plate, a hairline in the input box border colour, and the glyph',
      '   in the same colour the model control uses for its effort tier (low/high), so',
      '   it reads as not-ready instead of vanishing. Flat by design (no shadow), and',
      '   border-box keeps the outer 34px so the row does not shift. The stop/queue/',
      '   steer labels are untouched, so a running turn keeps its control even with an',
      '   empty draft. */',
      'body[data-dsh-claude-style] [data-composer-card]:has([data-composer-placeholder]) :is(button[aria-label="发送消息"], button[aria-label="Send message"]) {',
      '  box-sizing: border-box;',
      '  background: transparent;',
      '  color: var(--dsw-alias-label-caption);',
      '  border: 1px solid var(--dsw-alias-border-l2);',
      '  box-shadow: none;',
      '  cursor: default;',
      '}',
      '',
      '/* ---------- In-conversation single-line composer ---------- */',
      '/* In an active conversation, compress composer to a single-line input card,',
      '   render send button as an enter symbol ↵ inside the card on the right,',
      '   and display toolbar controls directly underneath on the canvas. */',
      'body[data-dsh-claude-style] [data-composer-card][data-composer-variant="inline"],',
      'body[data-dsh-claude-style] [data-composer-card][data-composer-variant="inline"]:focus-within,',
      'body[data-dsh-claude-style] [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-card],',
      'body[data-dsh-claude-style] [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-card]:focus-within {',
      '  background: transparent !important;',
      '  border: none !important;',
      '  box-shadow: none !important;',
      '  outline: none !important;',
      '  padding: 0 !important;',
      '  gap: 0 !important;',
      '  display: flex !important;',
      '  flex-direction: column !important;',
      '  position: relative !important;',
      '  width: 100% !important;',
      '  max-width: var(--dsh-composer-card-max-width, 100%) !important;',
      '  box-sizing: border-box !important;',
      '  overflow: visible !important;',
      '  height: auto !important;',
      '}',
      '/* Do NOT override the host viewArea flex contract here. In the active',
      '   phase the host uses `flex: 1 0 auto; min-height: auto` so the viewArea',
      '   is content-sized and the sticky composerSeat pins to the scrollport',
      '   bottom. An earlier override (`flex: 1 1 auto; min-height: 0`) let the',
      '   viewArea shrink to exactly viewport-minus-composer, which put the',
      '   composer seat near the TOP of the scroll content — sticky bottom:0',
      '   cannot pull an element down past its normal position, so the composer',
      '   appeared mid-scroll and never followed message growth. */',
      'body[data-dsh-claude-style] [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) {',
      '  flex: 0 0 auto !important;',
      '  overflow: visible !important;',
      '  height: auto !important;',
      '  max-height: none !important;',
      '}',
      'body[data-dsh-claude-style] [data-composer-card][data-composer-variant="inline"]:not([data-has-attachments="true"]) [class*="rail"]:not([class*="trailing"]),',
      'body[data-dsh-claude-style] [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-card]:not([data-has-attachments="true"]) [class*="rail"]:not([class*="trailing"]) {',
      '  display: none !important;',
      '}',
      'body[data-dsh-claude-style] [data-composer-card][data-composer-variant="inline"][data-has-attachments="true"] [class*="rail"]:not([class*="trailing"]),',
      'body[data-dsh-claude-style] [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-card][data-has-attachments="true"] [class*="rail"]:not([class*="trailing"]) {',
      '  background: var(--dsw-specific-input-major, #ffffff) !important;',
      '  border: 1px solid var(--dsw-alias-border-l1) !important;',
      '  border-bottom: none !important;',
      '  border-radius: 14px 14px 0 0 !important;',
      '  padding: 8px 12px 2px 12px !important;',
      '  margin: 0 !important;',
      '  width: 100% !important;',
      '  max-width: 100% !important;',
      '  box-sizing: border-box !important;',
      '  box-shadow: 0 1px 3px rgba(20, 20, 19, 0.03) !important;',
      '  transition: border-color 0.12s ease, box-shadow 0.12s ease !important;',
      '}',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) [data-composer-card][data-composer-variant="inline"][data-has-attachments="true"] [class*="rail"]:not([class*="trailing"]),',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-card][data-has-attachments="true"] [class*="rail"]:not([class*="trailing"]) {',
      '  background: #ffffff !important;',
      '  border-color: #e8e6dc !important;',
      '}',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) [data-composer-card][data-composer-variant="inline"]:focus-within [class*="rail"]:not([class*="trailing"]),',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-card]:focus-within [class*="rail"]:not([class*="trailing"]) {',
      '  border-color: rgba(217, 119, 87, 0.60) !important;',
      '  box-shadow: 0 0 0 1px rgba(217, 119, 87, 0.22), 0 4px 12px rgba(20, 20, 19, 0.08) !important;',
      '}',
      'body[data-dsh-claude-style][data-ds-dark-theme] [data-composer-card][data-composer-variant="inline"]:focus-within [class*="rail"]:not([class*="trailing"]),',
      'body[data-dsh-claude-style][data-ds-dark-theme] [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-card]:focus-within [class*="rail"]:not([class*="trailing"]) {',
      '  border-color: rgba(217, 119, 87, 0.64) !important;',
      '  box-shadow: 0 0 0 1px rgba(217, 119, 87, 0.30), 0 4px 14px rgba(0, 0, 0, 0.45) !important;',
      '}',
      'body[data-dsh-claude-style] [data-composer-card][data-composer-variant="inline"] [data-input-scroll],',
      'body[data-dsh-claude-style] [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-card] [data-input-scroll] {',
      '  background: var(--dsw-specific-input-major, #ffffff) !important;',
      '  border: 1px solid var(--dsw-alias-border-l1) !important;',
      '  border-radius: 14px !important;',
      '  min-height: 38px !important;',
      '  height: auto !important;',
      '  max-height: var(--dsh-composer-text-max-height, 180px) !important;',
      '  box-sizing: border-box !important;',
      '  display: block !important;',
      '  width: 100% !important;',
      '  max-width: 100% !important;',
      '  overflow-y: auto !important;',
      '  overflow-x: hidden !important;',
      '  padding: 7px 36px 7px 14px !important;',
      '  margin: 0 !important;',
      '  position: relative !important;',
      '  cursor: text !important;',
      '  transition: border-color 0.12s ease, box-shadow 0.12s ease !important;',
      '}',
      'body[data-dsh-claude-style] [data-composer-card][data-composer-variant="inline"][data-has-attachments="true"] [data-input-scroll],',
      'body[data-dsh-claude-style] [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-card][data-has-attachments="true"] [data-input-scroll] {',
      '  border-top: none !important;',
      '  border-radius: 0 0 14px 14px !important;',
      '  min-height: 32px !important;',
      '  padding: 2px 36px 6px 14px !important;',
      '}',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) [data-composer-card][data-composer-variant="inline"] [data-input-scroll],',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-card] [data-input-scroll] {',
      '  background: #ffffff !important;',
      '  border-color: #e8e6dc !important;',
      '  box-shadow: 0 1px 3px rgba(20, 20, 19, 0.03) !important;',
      '}',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) [data-composer-card][data-composer-variant="inline"]:focus-within [data-input-scroll],',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-card]:focus-within [data-input-scroll] {',
      '  border-color: rgba(217, 119, 87, 0.60) !important;',
      '  box-shadow: 0 0 0 1px rgba(217, 119, 87, 0.22), 0 4px 12px rgba(20, 20, 19, 0.08) !important;',
      '}',
      'body[data-dsh-claude-style][data-ds-dark-theme] [data-composer-card][data-composer-variant="inline"]:focus-within [data-input-scroll],',
      'body[data-dsh-claude-style][data-ds-dark-theme] [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-card]:focus-within [data-input-scroll] {',
      '  border-color: rgba(217, 119, 87, 0.64) !important;',
      '  box-shadow: 0 0 0 1px rgba(217, 119, 87, 0.30), 0 4px 14px rgba(0, 0, 0, 0.45) !important;',
      '}',
      'body[data-dsh-claude-style] [data-composer-card][data-composer-variant="inline"] [data-input-scroll] [class*="grow"],',
      'body[data-dsh-claude-style] [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-card] [data-input-scroll] [class*="grow"] {',
      '  width: 100% !important;',
      '  max-width: 100% !important;',
      '  min-height: 24px !important;',
      '  position: relative !important;',
      '  display: block !important;',
      '  box-sizing: border-box !important;',
      '  overflow-x: hidden !important;',
      '}',
      'body[data-dsh-claude-style] [data-composer-card][data-composer-variant="inline"] [data-composer-input],',
      'body[data-dsh-claude-style] [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-card] [data-composer-input] {',
      '  min-height: 24px !important;',
      '  height: auto !important;',
      '  line-height: 24px !important;',
      '  padding: 0 !important;',
      '  font-size: 14px !important;',
      '  width: 100% !important;',
      '  max-width: 100% !important;',
      '  box-sizing: border-box !important;',
      '  cursor: text !important;',
      '  outline: none !important;',
      '  white-space: pre-wrap !important;',
      '  word-break: break-word !important;',
      '  overflow-wrap: anywhere !important;',
      '  overflow-x: hidden !important;',
      '}',
      'body[data-dsh-claude-style] [data-composer-card][data-composer-variant="inline"] [data-composer-placeholder],',
      'body[data-dsh-claude-style] [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-card] [data-composer-placeholder] {',
      '  line-height: 24px !important;',
      '  height: 24px !important;',
      '  position: absolute !important;',
      '  top: 0 !important;',
      '  left: 0 !important;',
      '  right: 0 !important;',
      '  max-width: 100% !important;',
      '  box-sizing: border-box !important;',
      '  font-size: 14px !important;',
      '  color: var(--dsw-alias-label-caption) !important;',
      '  white-space: nowrap !important;',
      '  text-overflow: ellipsis !important;',
      '  overflow: hidden !important;',
      '  pointer-events: none !important;',
      '  user-select: none !important;',
      '}',
      '/* Pinned send button inside input box */',
      'body[data-dsh-claude-style] [data-composer-card][data-composer-variant="inline"] :is(button[aria-label^="发送"], button[aria-label^="Send"], button[aria-label*="发送"], button[aria-label*="Send"], button[aria-label*="排队"], button[aria-label*="Queue"], button[aria-label*="插话"], button[aria-label*="Steer"], [class*="sendBtn"], [class*="sendButton"]),',
      'body[data-dsh-claude-style] [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-card] :is(button[aria-label^="发送"], button[aria-label^="Send"], button[aria-label*="发送"], button[aria-label*="Send"], button[aria-label*="排队"], button[aria-label*="Queue"], button[aria-label*="插话"], button[aria-label*="Steer"], [class*="sendBtn"], [class*="sendButton"]) {',
      '  position: absolute !important;',
      '  bottom: 40px !important;',
      '  right: 8px !important;',
      '  top: auto !important;',
      '  left: auto !important;',
      '  width: 26px !important;',
      '  height: 26px !important;',
      '  min-width: 26px !important;',
      '  padding: 0 !important;',
      '  border-radius: 6px !important;',
      '  display: inline-flex !important;',
      '  align-items: center !important;',
      '  justify-content: center !important;',
      '  z-index: 10 !important;',
      '  box-shadow: none !important;',
      '  background: transparent !important;',
      '  color: var(--dsw-alias-label-caption) !important;',
      '  border: none !important;',
      '  cursor: pointer !important;',
      '  transition: color 0.12s ease, background-color 0.12s ease !important;',
      '}',
      'body[data-dsh-claude-style] [data-composer-card][data-composer-variant="inline"] :is(button[aria-label^="发送"], button[aria-label^="Send"], button[aria-label*="发送"], button[aria-label*="Send"], button[aria-label*="排队"], button[aria-label*="Queue"], button[aria-label*="插话"], button[aria-label*="Steer"], [class*="sendBtn"], [class*="sendButton"]) :is(svg, [class*="chevron"], span) {',
      '  display: none !important;',
      '}',
      'body[data-dsh-claude-style] [data-composer-card][data-composer-variant="inline"] :is(button[aria-label^="发送"], button[aria-label^="Send"], button[aria-label*="发送"], button[aria-label*="Send"], button[aria-label*="排队"], button[aria-label*="Queue"], button[aria-label*="插话"], button[aria-label*="Steer"], [class*="sendBtn"], [class*="sendButton"])::after,',
      'body[data-dsh-claude-style] [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-card] :is(button[aria-label^="发送"], button[aria-label^="Send"], button[aria-label*="发送"], button[aria-label*="Send"], button[aria-label*="排队"], button[aria-label*="Queue"], button[aria-label*="插话"], button[aria-label*="Steer"], [class*="sendBtn"], [class*="sendButton"])::after {',
      '  content: "↵" !important;',
      '  font-family: var(--dsw-font-code, monospace) !important;',
      '  font-size: 16px !important;',
      '  font-weight: 500 !important;',
      '  line-height: 1 !important;',
      '  color: currentColor !important;',
      '}',
      'body[data-dsh-claude-style] [data-composer-card][data-composer-variant="inline"] :is(button[aria-label^="发送"], button[aria-label^="Send"], button[aria-label*="发送"], button[aria-label*="Send"]):not(:disabled):hover,',
      'body[data-dsh-claude-style] [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-card] :is(button[aria-label^="发送"], button[aria-label^="Send"], button[aria-label*="发送"], button[aria-label*="Send"]):not(:disabled):hover {',
      '  background: var(--dsh-claude-hover-bg, rgba(0, 0, 0, 0.08)) !important;',
      '  color: var(--dsw-alias-label-primary) !important;',
      '}',
      'body[data-dsh-claude-style] [data-composer-card][data-composer-variant="inline"]:not(:has([data-composer-placeholder])) :is(button[aria-label^="发送"], button[aria-label^="Send"], button[aria-label*="发送"], button[aria-label*="Send"]),',
      'body[data-dsh-claude-style] [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-card]:not(:has([data-composer-placeholder])) :is(button[aria-label^="发送"], button[aria-label^="Send"], button[aria-label*="发送"], button[aria-label*="Send"]) {',
      '  color: var(--dsw-alias-brand-primary, #d97757) !important;',
      '}',
      '/* Pinned stop button inside input box */',
      'body[data-dsh-claude-style] [data-composer-card][data-composer-variant="inline"] :is(button[aria-label*="停止"], button[aria-label*="Stop"]),',
      'body[data-dsh-claude-style] [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-card] :is(button[aria-label*="停止"], button[aria-label*="Stop"]) {',
      '  position: absolute !important;',
      '  bottom: 40px !important;',
      '  right: 8px !important;',
      '  top: auto !important;',
      '  left: auto !important;',
      '  width: 26px !important;',
      '  height: 26px !important;',
      '  min-width: 26px !important;',
      '  padding: 0 !important;',
      '  border-radius: 6px !important;',
      '  display: inline-flex !important;',
      '  align-items: center !important;',
      '  justify-content: center !important;',
      '  z-index: 10 !important;',
      '  background: var(--dsw-alias-interactive-bg-hover) !important;',
      '  color: var(--dsw-alias-brand-primary, #d97757) !important;',
      '  border: none !important;',
      '}',
      'body[data-dsh-claude-style] [data-composer-card][data-composer-variant="inline"] :is(button[aria-label*="停止"], button[aria-label*="Stop"]) svg,',
      'body[data-dsh-claude-style] [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-card] :is(button[aria-label*="停止"], button[aria-label*="Stop"]) svg {',
      '  display: block !important;',
      '  width: 12px !important;',
      '  height: 12px !important;',
      '}',
      'body[data-dsh-claude-style] [data-composer-card][data-composer-variant="inline"] :is(button[aria-label*="停止"], button[aria-label*="Stop"])::after,',
      'body[data-dsh-claude-style] [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-card] :is(button[aria-label*="停止"], button[aria-label*="Stop"])::after {',
      '  display: none !important;',
      '}',
      '/* Toolbar row below input card */',
      'body[data-dsh-claude-style] [data-composer-card][data-composer-variant="inline"] [class*="row"],',
      'body[data-dsh-claude-style] [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-card] [class*="row"] {',
      '  display: flex !important;',
      '  flex-wrap: nowrap !important;',
      '  justify-content: space-between !important;',
      '  align-items: center !important;',
      '  padding: 0 4px !important;',
      '  margin: 6px 0 0 0 !important;',
      '  background: transparent !important;',
      '  border: none !important;',
      '  box-shadow: none !important;',
      '  min-height: 28px !important;',
      '  height: 28px !important;',
      '  width: 100% !important;',
      '  max-width: 100% !important;',
      '  box-sizing: border-box !important;',
      '  overflow: visible !important;',
      '}',
      'body[data-dsh-claude-style] [data-composer-card][data-composer-variant="inline"] [class*="tools"],',
      'body[data-dsh-claude-style] [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-card] [class*="tools"] {',
      '  display: flex !important;',
      '  align-items: center !important;',
      '  gap: 8px !important;',
      '  flex: 0 0 auto !important;',
      '  overflow: visible !important;',
      '}',
      'body[data-dsh-claude-style] [data-composer-card][data-composer-variant="inline"] [class*="modes"],',
      'body[data-dsh-claude-style] [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-card] [class*="modes"] {',
      '  order: 1 !important;',
      '  display: inline-flex !important;',
      '  align-items: center !important;',
      '  overflow: visible !important;',
      '}',
      'body[data-dsh-claude-style] [data-composer-card][data-composer-variant="inline"] :is(button[aria-label="指令"], button[aria-label="Commands"]),',
      'body[data-dsh-claude-style] [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-card] :is(button[aria-label="指令"], button[aria-label="Commands"]) {',
      '  order: 2 !important;',
      '  width: 24px !important;',
      '  height: 24px !important;',
      '  border-radius: 6px !important;',
      '  background: transparent !important;',
      '  color: var(--dsw-alias-label-secondary) !important;',
      '  display: inline-flex !important;',
      '  align-items: center !important;',
      '  justify-content: center !important;',
      '}',
      'body[data-dsh-claude-style] [data-composer-card][data-composer-variant="inline"] :is(button[aria-label="添加附件"], button[aria-label="Add attachment"]),',
      'body[data-dsh-claude-style] [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-card] :is(button[aria-label="添加附件"], button[aria-label="Add attachment"]) {',
      '  order: 3 !important;',
      '  width: 24px !important;',
      '  height: 24px !important;',
      '  border-radius: 6px !important;',
      '  background: transparent !important;',
      '  color: var(--dsw-alias-label-secondary) !important;',
      '  display: inline-flex !important;',
      '  align-items: center !important;',
      '  justify-content: center !important;',
      '}',
      'body[data-dsh-claude-style] [data-composer-card][data-composer-variant="inline"] :is(button[aria-label="指令"], button[aria-label="Commands"], button[aria-label="添加附件"], button[aria-label="Add attachment"]):hover:not(:disabled),',
      'body[data-dsh-claude-style] [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-card] :is(button[aria-label="指令"], button[aria-label="Commands"], button[aria-label="添加附件"], button[aria-label="Add attachment"]):hover:not(:disabled) {',
      '  background: var(--dsh-claude-hover-bg, rgba(0, 0, 0, 0.08)) !important;',
      '  color: var(--dsw-alias-label-primary) !important;',
      '}',
      'body[data-dsh-claude-style] [data-composer-card][data-composer-variant="inline"] [class*="trailing"],',
      'body[data-dsh-claude-style] [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-card] [class*="trailing"] {',
      '  display: flex !important;',
      '  align-items: center !important;',
      '  gap: 8px !important;',
      '  margin-left: auto !important;',
      '  flex: 0 0 auto !important;',
      '}',
      '/* Model trigger in trailing */',
      'body[data-dsh-claude-style] [data-composer-card][data-composer-variant="inline"] [class*="trailing"] > :first-child,',
      'body[data-dsh-claude-style] [data-composer-card][data-composer-variant="inline"] [class*="trailing"] :is([class*="trigger" i], [class*="model" i], [class*="Model"]) {',
      '  display: inline-flex !important;',
      '  align-items: center !important;',
      '  font-size: 13px !important;',
      '  color: var(--dsw-alias-label-secondary) !important;',
      '  border-radius: 7px !important;',
      '  cursor: pointer !important;',
      '  visibility: visible !important;',
      '  opacity: 1 !important;',
      '}',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) [data-composer-card][data-composer-variant="inline"] [class*="trailing"] > :first-child:hover:not(:disabled),',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) [data-composer-card][data-composer-variant="inline"] [class*="trailing"] :is([class*="trigger" i], [class*="model" i], [class*="Model"]):hover:not(:disabled) {',
      '  background: var(--dsh-claude-hover-bg, rgba(0, 0, 0, 0.06)) !important;',
      '  color: var(--dsw-alias-label-primary) !important;',
      '}',
      '/* Separate Token stats row below the composer card */',
      'body[data-dsh-claude-style] [data-composer-card][data-composer-variant="inline"] ~ [data-composer-stats],',
      'body[data-dsh-claude-style] [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-stats] {',
      '  display: flex !important;',
      '  align-items: center !important;',
      '  justify-content: center !important;',
      '  gap: 12px !important;',
      '  font-size: 12px !important;',
      '  color: var(--dsw-alias-label-secondary) !important;',
      '  margin: 6px auto 0 !important;',
      '  height: 24px !important;',
      '  line-height: 24px !important;',
      '  pointer-events: auto !important;',
      '  width: 100% !important;',
      '  max-width: var(--dsh-composer-card-max-width, 100%) !important;',
      '  box-sizing: border-box !important;',
      '  overflow: hidden !important;',
      '  white-space: nowrap !important;',
      '  text-overflow: ellipsis !important;',
      '}',
      '@media (max-width: 820px) {',
      '  body[data-dsh-claude-style] [data-composer-card][data-composer-variant="inline"] ~ [data-composer-stats],',
      '  body[data-dsh-claude-style] [class*="composerStack"]:not(:has([class*="heroWorkspaceRow"])) [data-composer-stats] {',
      '    display: none !important;',
      '  }',
      '}',

      '',
      '/* ---------- Claude Code layout: sidebar brand ---------- */',
      '/* The shipped whale and wordmark give way to the selected brand. Each variant',
      '   is painted as an alpha mask over currentColor, so it follows the light/dark',
      '   label colour instead of carrying a baked-in one. The choice is switched by a',
      '   document attribute rather than by swapping the stylesheet, so the settings',
      '   page only has to flip one attribute and the whole UI follows.',
      '',
      '   Sizing: both marks are set to an 18px cap height to match the shipped',
      '   brandName box, and each wordmark takes its natural width from that height',
      '   via the artwork aspect ratios (Claude 4.214:1, ANTHROPIC ~8.94:1). The',
      '   wordmark keeps a max-width so a longer brand can never clip the row. */',
      'body[data-dsh-claude-style] :is([class*="brandMark"], [class*="railMark"]) > * {',
      '  display: none !important;',
      '}',
      '',
      'body[data-dsh-claude-style] :is([class*="brandMark"], [class*="railMark"])::before {',
      '  content: "";',
      '  display: block;',
      '  flex: none;',
      '  background-color: currentColor;',
      '  background-repeat: no-repeat;',
      '  background-position: center;',
      '  background-size: contain;',
      '}',
      '',
      '/* Claude (default): starburst mark + the Claude wordmark. */',
      'body[data-dsh-claude-style]:not([' + BRAND_ATTR + '="' + BRAND_ANTHROPIC + '"]) :is([class*="brandMark"], [class*="railMark"])::before {',
      '  width: 18px;',
      '  height: 18px;',
      '  -webkit-mask: ' + CLAUDE_MARK + ' center / contain no-repeat;',
      '  mask: ' + CLAUDE_MARK + ' center / contain no-repeat;',
      '}',
      '',
      'body[data-dsh-claude-style] [class*="brandIdentity"] > [class*="brandName"] > * {',
      '  display: none !important;',
      '}',
      '',
      'body[data-dsh-claude-style] [class*="brandIdentity"] > [class*="brandName"]::before {',
      '  content: "";',
      '  display: block;',
      '  flex: none;',
      '  background-color: currentColor;',
      '  background-repeat: no-repeat;',
      '  background-position: center;',
      '  background-size: contain;',
      '}',
      '',
      'body[data-dsh-claude-style]:not([' + BRAND_ATTR + '="' + BRAND_ANTHROPIC + '"]) [class*="brandIdentity"] > [class*="brandName"]::before {',
      '  width: ' + (18 * CLAUDE_WORD_ASPECT).toFixed(1) + 'px;',
      '  max-width: 100%;',
      '  height: 18px;',
      '  -webkit-mask: ' + CLAUDE_WORD + ' center / contain no-repeat;',
      '  mask: ' + CLAUDE_WORD + ' center / contain no-repeat;',
      '}',
      '',
      '/* Anthropic (alternate): the A\\ lockup + the ANTHROPIC wordmark. */',
      'body[data-dsh-claude-style][' + BRAND_ATTR + '="' + BRAND_ANTHROPIC + '"] :is([class*="brandMark"], [class*="railMark"])::before {',
      '  width: 25.9px;',
      '  height: 18px;',
      '  -webkit-mask: ' + ANTHROPIC_BRAND_MARK + ' center / contain no-repeat;',
      '  mask: ' + ANTHROPIC_BRAND_MARK + ' center / contain no-repeat;',
      '}',
      '',
      'body[data-dsh-claude-style][' + BRAND_ATTR + '="' + BRAND_ANTHROPIC + '"] [class*="brandIdentity"] > [class*="brandName"]::before {',
      '  width: 160.9px;',
      '  max-width: 100%;',
      '  height: 18px;',
      '  -webkit-mask: ' + ANTHROPIC_BRAND_WORD + ' center / contain no-repeat;',
      '  mask: ' + ANTHROPIC_BRAND_WORD + ' center / contain no-repeat;',
      '}',
      '',
      '/* ---------- Claude Code layout: new session button ---------- */',
      '/* Narrow height matching conversation row, persistent hover plate, left-aligned plus icon */',
      'body[data-dsh-claude-style] button[class*="newSession"] {',
      '  display: flex !important;',
      '  align-items: center !important;',
      '  justify-content: flex-start !important;',
      '  text-align: left !important;',
      '  width: 100% !important;',
      '  box-sizing: border-box !important;',
      '  height: 28px !important;',
      '  line-height: 28px !important;',
      '  padding: 0 8px !important;',
      '  margin: 0 0 6px 0 !important;',
      '  border: none !important;',
      '  border-radius: 6px !important;',
      '  background: var(--dsh-claude-hover-bg, rgba(0, 0, 0, 0.08)) !important;',
      '  color: var(--dsw-alias-label-primary, #141413) !important;',
      '  font-family: var(--dsw-font-family) !important;',
      '  font-size: 13px !important;',
      '  font-weight: 500 !important;',
      '  cursor: pointer !important;',
      '  box-shadow: none !important;',
      '  transition: background-color 0.12s ease !important;',
      '}',
      'body[data-dsh-claude-style] button[class*="newSession"]:hover {',
      '  background: rgba(0, 0, 0, 0.12) !important;',
      '}',
      'body[data-dsh-claude-style][data-ds-dark-theme] button[class*="newSession"] {',
      '  color: #f5f4ef !important;',
      '}',
      'body[data-dsh-claude-style][data-ds-dark-theme] button[class*="newSession"]:hover {',
      '  background: rgba(255, 255, 255, 0.12) !important;',
      '}',
      'body[data-dsh-claude-style] button[class*="newSession"] svg {',
      '  display: none !important;',
      '}',
      'body[data-dsh-claude-style] button[class*="newSession"]::before {',
      '  content: "";',
      '  display: inline-block !important;',
      '  width: 13px !important;',
      '  height: 13px !important;',
      '  margin-right: 6px !important;',
      '  flex: none !important;',
      '  background-color: currentColor !important;',
      '  -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'black\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><line x1=\'12\' y1=\'5\' x2=\'12\' y2=\'19\'></line><line x1=\'5\' y1=\'12\' x2=\'19\' y2=\'12\'></line></svg>") center / contain no-repeat !important;',
      '  mask: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'black\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><line x1=\'12\' y1=\'5\' x2=\'12\' y2=\'19\'></line><line x1=\'5\' y1=\'12\' x2=\'19\' y2=\'12\'></line></svg>") center / contain no-repeat !important;',
      '}',
      '',
      '/* ---------- Claude Code layout: workspace & session sidebar ---------- */',
      '/* 1. Typography: Anthropic Sans and compact font sizes */',
      'body[data-dsh-claude-style] :is([data-pane="sidebar"], [class*="sidebarCol"], [class*="treeBody"], [role="tree"]) :is([class*="title"], [class*="projectText"], [class*="sectionLabel"], [class*="sessionRow"], [class*="projectRow"], [class*="time"]) {',
      '  font-family: var(--dsw-font-family) !important;',
      '}',
      'body[data-dsh-claude-style] [class*="projectRow"] [class*="title"] {',
      '  font-size: 13px !important;',
      '  line-height: 18px !important;',
      '  letter-spacing: normal !important;',
      '}',
      'body[data-dsh-claude-style] [class*="sessionRow"] [class*="title"] {',
      '  font-size: 13px !important;',
      '  line-height: 18px !important;',
      '  letter-spacing: normal !important;',
      '  color: var(--dsw-alias-label-secondary, #787672) !important;',
      '  transition: color 0.12s ease !important;',
      '}',
      'body[data-dsh-claude-style][data-ds-dark-theme] [class*="sessionRow"] [class*="title"] {',
      '  color: #8c8983 !important;',
      '}',
      'body[data-dsh-claude-style] [class*="sessionRow"]:is(:hover, [class*="selected"], [class*="active"], [class*="menuOpen"], [aria-selected="true"], [data-selected="true"]) [class*="title"] {',
      '  color: var(--dsw-alias-label-primary, #141413) !important;',
      '}',
      'body[data-dsh-claude-style][data-ds-dark-theme] [class*="sessionRow"]:is(:hover, [class*="selected"], [class*="active"], [class*="menuOpen"], [aria-selected="true"], [data-selected="true"]) [class*="title"] {',
      '  color: #f5f4ef !important;',
      '}',
      'body[data-dsh-claude-style] [class*="sessionRow"] [class*="time"] {',
      '  font-size: 11px !important;',
      '  line-height: 16px !important;',
      '}',
      'body[data-dsh-claude-style] [class*="sectionLabel"] {',
      '  font-size: 12px !important;',
      '  line-height: 16px !important;',
      '}',
      '',
      '/* 2. Compact scale: shrunken heights, margins, and paddings */',
      'body[data-dsh-claude-style] [class*="projectRow"] {',
      '  height: 28px !important;',
      '  min-height: 28px !important;',
      '  padding: 0 6px !important;',
      '  gap: 4px !important;',
      '  border-radius: 6px !important;',
      '}',
      'body[data-dsh-claude-style] [class*="sessionRow"] {',
      '  height: 28px !important;',
      '  min-height: 28px !important;',
      '  padding: 0 6px !important;',
      '  gap: 0 !important;',
      '  border-radius: 6px !important;',
      '}',
      'body[data-dsh-claude-style] [class*="sessionRow"] [class*="title"] {',
      '  margin: 0 4px !important;',
      '}',
      'body[data-dsh-claude-style] [class*="groupSection"] > * + * {',
      '  margin-top: 1px !important;',
      '}',
      'body[data-dsh-claude-style] [class*="groupSection"] + [class*="groupSection"] {',
      '  margin-top: 6px !important;',
      '}',
      'body[data-dsh-claude-style] [class*="projectRow"] [class*="rowActions"],',
      'body[data-dsh-claude-style] [class*="sessionRow"] [class*="rowActions"] {',
      '  gap: 6px !important;',
      '}',
      'body[data-dsh-claude-style] :is([class*="projectRow"], [class*="sessionRow"]) [class*="iconButton"] {',
      '  width: 16px !important;',
      '  height: 16px !important;',
      '}',
      '',
      '/* 3. Hover & active background: session rows only. A folder row is a heading,',
      '   not a target, so it never takes a hover plate — its hover cue is the label',
      '   darkening (rule 4). This also cancels the shipped',
      '   .projectRow:hover{background:var(--dsw-alias-interactive-bg-hover)}. */',
      'body[data-dsh-claude-style] [class*="sessionRow"]:hover,',
      'body[data-dsh-claude-style] [class*="sessionRow"][class*="selected"],',
      'body[data-dsh-claude-style] [class*="sessionRow"][class*="menuOpen"] {',
      '  background: var(--dsh-claude-hover-bg, rgba(0, 0, 0, 0.08)) !important;',
      '}',
      '',
      'body[data-dsh-claude-style] [class*="projectRow"],',
      'body[data-dsh-claude-style] [class*="projectRow"]:hover,',
      'body[data-dsh-claude-style] [class*="projectRow"][class*="menuOpen"],',
      'body[data-dsh-claude-style] [class*="projectRow"][class*="selected"] {',
      '  background: transparent !important;',
      '}',
      '',
      '/* 4. Folder header styling: grey font, remove folder icon, dropdown arrow */',
      '/* Folder text: muted grey */',
      'body[data-dsh-claude-style] [class*="projectRow"] [class*="title"] {',
      '  color: var(--dsw-alias-label-secondary, #787672) !important;',
      '  font-weight: 500 !important;',
      '}',
      'body[data-dsh-claude-style] [class*="projectRow"]:hover [class*="title"] {',
      '  color: var(--dsw-alias-label-primary, #141413) !important;',
      '}',
      'body[data-dsh-claude-style] [class*="projectRow"] [class*="folderActive"] {',
      '  color: inherit !important;',
      '}',
      '/* Cancel folder icon */',
      'body[data-dsh-claude-style] [class*="projectRow"] [class*="folder"] {',
      '  display: none !important;',
      '}',
      '/* Project row flex layout: Title on the left, dropdown arrow next to title */',
      'body[data-dsh-claude-style] [class*="projectRow"] {',
      '  display: flex !important;',
      '  align-items: center !important;',
      '}',
      'body[data-dsh-claude-style] [class*="projectRow"] [class*="projectText"] {',
      '  order: 1 !important;',
      '  flex: 0 0 auto !important;',
      '  margin-right: 2px !important;',
      '}',
      '/* The chevron is a reveal-on-hover affordance, never a resting one. The',
      '   shipped CSS gates it on .projectRow:hover alone, which drops it the moment',
      '   the pointer moves down into the folder\'s conversation list; :has() on the',
      '   group section widens the trigger to the folder row or any row inside it. */',
      'body[data-dsh-claude-style] [class*="projectRow"] [class*="chevron"] {',
      '  order: 2 !important;',
      '  display: none !important;',
      '  width: 14px !important;',
      '  height: 14px !important;',
      '  align-items: center !important;',
      '  justify-content: center !important;',
      '  color: var(--dsw-alias-label-secondary, #787672) !important;',
      '}',
      'body[data-dsh-claude-style] [class*="groupSection"]:has(:is([class*="projectRow"], [class*="sessionRow"]):hover) [class*="projectRow"] [class*="chevron"] {',
      '  display: inline-flex !important;',
      '}',
      'body[data-dsh-claude-style] [class*="projectRow"] [class*="rowActions"] {',
      '  order: 3 !important;',
      '  margin-left: auto !important;',
      '}',
      '/* Cancel solid lower triangle, replace with dropdown menu arrow */',
      'body[data-dsh-claude-style] [class*="projectRow"] [class*="chevron"] svg {',
      '  display: none !important;',
      '}',
      'body[data-dsh-claude-style] [class*="projectRow"] [class*="chevron"]::after {',
      '  content: "";',
      '  display: inline-block;',
      '  width: 12px;',
      '  height: 12px;',
      '  background: currentColor;',
      '  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27none%27 stroke=%27black%27 stroke-width=%271.5%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpath d=%27M4 6l4 4 4-4%27/%3E%3C/svg%3E") center / contain no-repeat;',
      '  mask: url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27none%27 stroke=%27black%27 stroke-width=%271.5%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpath d=%27M4 6l4 4 4-4%27/%3E%3C/svg%3E") center / contain no-repeat;',
      '  transition: transform 0.15s var(--ds-ease-in-out, ease);',
      '}',
      'body[data-dsh-claude-style] [class*="projectRow"][aria-expanded="false"] [class*="chevron"]::after {',
      '  transform: rotate(-90deg);',
      '}',
      '/* Session status circle indicator (matching Claude style) */',
      'body[data-dsh-claude-style] [class*="sessionRow"] [class*="slot"] {',
      '  width: 14px !important;',
      '  height: 16px !important;',
      '  display: inline-flex !important;',
      '  align-items: center !important;',
      '  justify-content: center !important;',
      '}',
      'body[data-dsh-claude-style] [class*="sessionRow"] [class*="slot"]:empty::after {',
      '  content: "";',
      '  display: inline-block;',
      '  width: 5px;',
      '  height: 5px;',
      '  border-radius: 50%;',
      '  border: 1.2px solid var(--dsw-alias-label-caption, #a6a094);',
      '  box-sizing: border-box;',
      '}',
      '',
      '/* Session status ongoing indicator: Windows 11 circular progress ring (replaces blue square matrix) */',
      'body[data-dsh-claude-style] svg[data-state="ongoing"] {',
      '  width: 10px !important;',
      '  height: 10px !important;',
      '  box-sizing: border-box !important;',
      '  border-radius: 50% !important;',
      '  border: 1.5px solid rgba(255, 255, 255, 0.18) !important;',
      '  border-top-color: #faf9f5 !important;',
      '  animation: 0.85s linear infinite dsh-claude-win11-spin !important;',
      '  transform-origin: center center !important;',
      '  display: inline-block !important;',
      '  flex: none !important;',
      '  color: transparent !important;',
      '  fill: none !important;',
      '  background: transparent !important;',
      '}',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) svg[data-state="ongoing"] {',
      '  border-color: rgba(20, 20, 19, 0.12) !important;',
      '  border-top-color: #6e6a60 !important;',
      '}',
      'body[data-dsh-claude-style] svg[data-state="ongoing"] * {',
      '  display: none !important;',
      '}',
      '@keyframes dsh-claude-win11-spin {',
      '  0% { transform: rotate(0deg); }',
      '  100% { transform: rotate(360deg); }',
      '}',
      '@media (prefers-reduced-motion: reduce) {',
      '  body[data-dsh-claude-style] svg[data-state="ongoing"] {',
      '    animation: none !important;',
      '  }',
      '}',
      '',
      '/* Turn status: Claude thinking indicator (terracotta accent shimmer) */',
      'body[data-dsh-claude-style] [class*="turnStatus"]:not([class*="Clock"]):not([class*="clock"]) {',
      '  background: linear-gradient(90deg, #d97757 0%, #d97757 40%, #f3b5a3 50%, #d97757 60%, #d97757 100%);',
      '  background-position: 100% 0;',
      '  background-size: 250% 100%;',
      '  -webkit-background-clip: text;',
      '  background-clip: text;',
      '  -webkit-text-fill-color: transparent;',
      '  color: transparent;',
      '  animation: 1.8s linear infinite dsh-claude-turn-status-shimmer;',
      '}',
      '@keyframes dsh-claude-turn-status-shimmer {',
      '  to { background-position: 0 0; }',
      '}',
      '@media (prefers-reduced-motion: reduce) {',
      '  body[data-dsh-claude-style] [class*="turnStatus"]:not([class*="Clock"]):not([class*="clock"]) {',
      '    background-position: 0 0;',
      '    background-size: 100% 100%;',
      '    animation: none;',
      '  }',
      '}',
      '',
      '/* --- 2.4 Custom Components (Segments & Account Popover) --- */',
      '/* ---------- Claude Code layout: permission segments ---------- */',
      '/* The shipped access control is one popup-select button; it is replaced by',
      '   a Read | Edit | Auto segmented control over the same three presets. */',
      'body[data-dsh-claude-style] button[aria-label^="访问模式"],',
      'body[data-dsh-claude-style] button[aria-label^="Access mode"] {',
      '  display: none !important;',
      '}',
      '',
      'body[data-dsh-claude-style] .dsh-claude-segments {',
      '  flex: none;',
      '  align-items: center;',
      '  gap: 2px;',
      '  padding: 2px;',
      '  border-radius: 7px;',
      '  background: var(--dsw-specific-selector);',
      '  display: inline-flex;',
      '}',
      '',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) .dsh-claude-segments {',
      '  background: #f6f6f4;',
      '}',
      '',
      'body[data-dsh-claude-style] .dsh-claude-segment {',
      '  appearance: none;',
      '  margin: 0;',
      '  border: 0;',
      '  cursor: pointer;',
      '  background: transparent;',
      '  color: var(--dsw-alias-label-secondary);',
      '  font: inherit;',
      '  font-size: 14px;',
      '  font-weight: 500;',
      '  line-height: 18px;',
      '  padding: 3px 12px;',
      '  border-radius: 7px;',
      '  transition: background-color .1s, color .1s;',
      '}',
      '',
      'body[data-dsh-claude-style] .dsh-claude-segment:hover:not([data-active]) {',
      '  color: var(--dsw-alias-label-primary);',
      '}',
      '',
      'body[data-dsh-claude-style] .dsh-claude-segment[data-active] {',
      '  color: var(--dsw-alias-label-primary);',
      '  background: var(--dsw-alias-bg-layer-3);',
      '}',
      '',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) .dsh-claude-segment[data-active] {',
      '  background: var(--dsw-alias-bg-overlay);',
      '  box-shadow: 0 1px 2px rgba(20, 20, 19, 0.08);',
      '}',
      '',
      '/* ---------- Claude Code layout: in-conversation permission popover ---------- */',
      'body[data-dsh-claude-style] .dsh-claude-perm-container {',
      '  position: relative !important;',
      '  display: inline-flex !important;',
      '  z-index: 20 !important;',
      '}',
      'body[data-dsh-claude-style] .dsh-claude-perm-btn {',
      '  display: inline-flex !important;',
      '  align-items: center !important;',
      '  gap: 4px !important;',
      '  height: 24px !important;',
      '  padding: 0 6px 0 6px !important;',
      '  border-radius: 6px !important;',
      '  border: none !important;',
      '  background: transparent !important;',
      '  color: var(--dsw-alias-label-primary, #141413) !important;',
      '  font-family: var(--dsw-font-family) !important;',
      '  font-size: 13px !important;',
      '  font-weight: 500 !important;',
      '  cursor: pointer !important;',
      '  user-select: none !important;',
      '  transition: background-color 0.12s ease !important;',
      '}',
      'body[data-dsh-claude-style][data-ds-dark-theme] .dsh-claude-perm-btn {',
      '  color: #faf9f5 !important;',
      '}',
      'body[data-dsh-claude-style] .dsh-claude-perm-btn:hover,',
      'body[data-dsh-claude-style] .dsh-claude-perm-btn[data-open="true"] {',
      '  background: var(--dsh-claude-hover-bg, rgba(0, 0, 0, 0.08)) !important;',
      '}',
      'body[data-dsh-claude-style] .dsh-claude-perm-chevron {',
      '  width: 12px;',
      '  height: 12px;',
      '  display: inline-flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  color: var(--dsw-alias-label-secondary);',
      '}',
      'body[data-dsh-claude-style] .dsh-claude-perm-chevron::after {',
      '  content: "";',
      '  display: inline-block;',
      '  width: 10px;',
      '  height: 10px;',
      '  background: currentColor;',
      '  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 16\' fill=\'none\' stroke=\'black\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M4 6l4 4 4-4\'/%3E%3C/svg%3E") center / contain no-repeat;',
      '  mask: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 16\' fill=\'none\' stroke=\'black\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M4 6l4 4 4-4\'/%3E%3C/svg%3E") center / contain no-repeat;',
      '  transition: transform 0.15s ease;',
      '}',
      'body[data-dsh-claude-style] .dsh-claude-perm-btn[data-open="true"] .dsh-claude-perm-chevron::after {',
      '  transform: rotate(180deg);',
      '}',
      'body[data-dsh-claude-style] .dsh-claude-perm-popover {',
      '  position: fixed !important;',
      '  min-width: 220px !important;',
      '  background: var(--dsw-alias-bg-overlay, #ffffff) !important;',
      '  border: 1px solid var(--dsw-alias-border-l1, #e8e6dc) !important;',
      '  border-radius: 12px !important;',
      '  box-shadow: 0 8px 30px rgba(20, 20, 19, 0.12), 0 2px 8px rgba(20, 20, 19, 0.06) !important;',
      '  padding: 6px !important;',
      '  box-sizing: border-box !important;',
      '  z-index: 99999 !important;',
      '  display: flex !important;',
      '  flex-direction: column !important;',
      '  gap: 2px !important;',
      '  opacity: 0 !important;',
      '  pointer-events: none !important;',
      '  transform: translateY(4px) scale(0.98) !important;',
      '  transform-origin: bottom left !important;',
      '  transition: opacity 0.15s ease, transform 0.15s ease !important;',
      '}',
      'body[data-dsh-claude-style] .dsh-claude-perm-popover[data-open="true"] {',
      '  opacity: 1 !important;',
      '  pointer-events: auto !important;',
      '  transform: translateY(0) scale(1) !important;',
      '}',
      'body[data-dsh-claude-style][data-ds-dark-theme] .dsh-claude-perm-popover {',
      '  background: #1e1e1d !important;',
      '  border-color: #2e2c29 !important;',
      '  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3) !important;',
      '}',
      '',
      '/* ---------- Claude Code layout: account row & floating popover ---------- */',
      '/* footArea positioning with crisp hairline border spanning entire sidebar */',
      'body[data-dsh-claude-style] [class*="footArea"] {',
      '  position: relative !important;',
      '  overflow: visible !important;',
      '  margin: 0 calc(-1 * var(--dsh-sidebar-inline-padding, 12px)) -6px !important;',
      '  padding: 8px var(--dsh-sidebar-inline-padding, 12px) 6px !important;',
      '  border-top: 1px solid var(--dsw-alias-border-l1, #e8e6dc) !important;',
      '  background: transparent !important;',
      '  box-sizing: border-box !important;',
      '}',
      'body[data-dsh-claude-style][data-ds-dark-theme] [class*="footArea"] {',
      '  border-top-color: #2e2c29 !important;',
      '}',
      '',
      '/* Account trigger button in sidebar */',
      'body[data-dsh-claude-style] .dsh-claude-account-btn {',
      '  display: flex !important;',
      '  align-items: center !important;',
      '  width: 100% !important;',
      '  height: 32px !important;',
      '  box-sizing: border-box !important;',
      '  padding: 0 8px !important;',
      '  margin: 0 !important;',
      '  border-radius: 6px !important;',
      '  cursor: pointer !important;',
      '  user-select: none !important;',
      '  background: transparent !important;',
      '  transition: background-color 0.12s ease !important;',
      '}',
      'body[data-dsh-claude-style] .dsh-claude-account-btn:hover,',
      'body[data-dsh-claude-style] .dsh-claude-account-btn[data-open="true"] {',
      '  background: var(--dsh-claude-hover-bg, rgba(0, 0, 0, 0.08)) !important;',
      '}',
      'body[data-dsh-claude-style] .dsh-claude-account-avatar {',
      '  width: 18px;',
      '  height: 18px;',
      '  background: ' + ANTHROPIC_MARK + ' center / contain no-repeat;',
      '  flex: none;',
      '  margin-right: 8px;',
      '}',
      'body[data-dsh-claude-style] .dsh-claude-account-label {',
      '  flex: 1;',
      '  min-width: 0;',
      '  overflow: hidden;',
      '  text-overflow: ellipsis;',
      '  white-space: nowrap;',
      '  font-size: 13px;',
      '  line-height: 18px;',
      '  font-family: var(--dsw-font-family);',
      '}',
      'body[data-dsh-claude-style] .dsh-claude-account-user {',
      '  font-weight: 500;',
      '  color: var(--dsw-alias-label-primary);',
      '}',
      'body[data-dsh-claude-style] .dsh-claude-account-chevron {',
      '  width: 14px;',
      '  height: 14px;',
      '  flex: none;',
      '  color: var(--dsw-alias-label-secondary);',
      '  display: inline-flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  margin-left: auto;',
      '}',
      'body[data-dsh-claude-style] .dsh-claude-account-chevron::after {',
      '  content: "";',
      '  display: inline-block;',
      '  width: 12px;',
      '  height: 12px;',
      '  background: currentColor;',
      '  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 16\' fill=\'none\' stroke=\'black\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M4 6l4 4 4-4\'/%3E%3C/svg%3E") center / contain no-repeat;',
      '  mask: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 16\' fill=\'none\' stroke=\'black\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M4 6l4 4 4-4\'/%3E%3C/svg%3E") center / contain no-repeat;',
      '  transition: transform 0.15s ease;',
      '}',
      'body[data-dsh-claude-style] .dsh-claude-account-btn[data-open="true"] .dsh-claude-account-chevron::after {',
      '  transform: rotate(180deg);',
      '}',
      '',
      '/* Floating Popover Container: Adaptive Width */',
      'body[data-dsh-claude-style] .dsh-claude-account-popover {',
      '  position: absolute !important;',
      '  bottom: calc(100% + 4px) !important;',
      '  left: 8px !important;',
      '  right: 8px !important;',
      '  width: auto !important;',
      '  max-width: calc(100% - 16px) !important;',
      '  min-width: 0 !important;',
      '  background: var(--dsw-alias-bg-overlay, #ffffff) !important;',
      '  border: 1px solid var(--dsw-alias-border-l1, #e8e6dc) !important;',
      '  border-radius: 12px !important;',
      '  box-shadow: 0 8px 30px rgba(20, 20, 19, 0.12), 0 2px 8px rgba(20, 20, 19, 0.06) !important;',
      '  padding: 6px !important;',
      '  box-sizing: border-box !important;',
      '  z-index: 1000 !important;',
      '  display: flex !important;',
      '  flex-direction: column !important;',
      '  gap: 2px !important;',
      '  opacity: 0 !important;',
      '  pointer-events: none !important;',
      '  transform: translateY(6px) scale(0.98) !important;',
      '  transform-origin: bottom left !important;',
      '  transition: opacity 0.15s ease, transform 0.15s ease !important;',
      '}',
      'body[data-dsh-claude-style] .dsh-claude-account-popover[data-open="true"] {',
      '  opacity: 1 !important;',
      '  pointer-events: auto !important;',
      '  transform: translateY(0) scale(1) !important;',
      '}',
      'body[data-dsh-claude-style][data-ds-dark-theme] .dsh-claude-account-popover {',
      '  background: #1e1e1d !important;',
      '  border-color: #2e2c29 !important;',
      '  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3) !important;',
      '}',
      '/* Hover bridge between trigger and popover */',
      'body[data-dsh-claude-style] .dsh-claude-account-popover::after {',
      '  content: "";',
      '  position: absolute;',
      '  top: 100%;',
      '  left: 0;',
      '  right: 0;',
      '  height: 12px;',
      '  background: transparent;',
      '}',
      '',
      '/* Popover Header */',
      'body[data-dsh-claude-style] .dsh-claude-account-popover-header {',
      '  padding: 6px 8px 6px 8px !important;',
      '  display: flex !important;',
      '  flex-direction: column !important;',
      '  gap: 2px !important;',
      '}',
      'body[data-dsh-claude-style] .dsh-claude-account-popover-name {',
      '  font-size: 14px !important;',
      '  font-weight: 600 !important;',
      '  color: var(--dsw-alias-label-primary, #141413) !important;',
      '  line-height: 18px !important;',
      '  font-family: var(--dsw-font-family) !important;',
      '}',
      'body[data-dsh-claude-style] .dsh-claude-account-popover-divider {',
      '  height: 1px !important;',
      '  background: var(--dsw-alias-border-l1, #e8e6dc) !important;',
      '  margin: 2px 0 4px 0 !important;',
      '  flex: none !important;',
      '}',
      '',
      '/* Popover Body & Items */',
      'body[data-dsh-claude-style] .dsh-claude-account-popover-body {',
      '  display: flex !important;',
      '  flex-direction: column !important;',
      '  gap: 2px !important;',
      '  max-height: 360px !important;',
      '  overflow-y: auto !important;',
      '}',
      'body[data-dsh-claude-style] .dsh-claude-popover-item {',
      '  width: 100% !important;',
      '  height: 32px !important;',
      '  min-height: 32px !important;',
      '  padding: 0 8px !important;',
      '  border-radius: 6px !important;',
      '  border: none !important;',
      '  background: transparent !important;',
      '  color: var(--dsw-alias-label-primary, #141413) !important;',
      '  font-size: 13px !important;',
      '  font-weight: 400 !important;',
      '  display: flex !important;',
      '  align-items: center !important;',
      '  justify-content: flex-start !important;',
      '  gap: 8px !important;',
      '  box-shadow: none !important;',
      '  cursor: pointer !important;',
      '  font-family: var(--dsw-font-family) !important;',
      '  transition: background-color 0.12s ease !important;',
      '  box-sizing: border-box !important;',
      '}',
      'body[data-dsh-claude-style] .dsh-claude-popover-item:hover {',
      '  background: var(--dsh-claude-hover-bg, rgba(0, 0, 0, 0.08)) !important;',
      '  color: var(--dsw-alias-label-primary, #141413) !important;',
      '}',
      'body[data-dsh-claude-style] .dsh-claude-popover-item-icon {',
      '  display: inline-flex !important;',
      '  align-items: center !important;',
      '  justify-content: center !important;',
      '  width: 16px !important;',
      '  height: 16px !important;',
      '  flex: none !important;',
      '  color: var(--dsw-alias-label-secondary, #787672) !important;',
      '}',
      'body[data-dsh-claude-style] .dsh-claude-popover-item-icon svg {',
      '  width: 16px !important;',
      '  height: 16px !important;',
      '}',
      'body[data-dsh-claude-style] .dsh-claude-popover-item-text {',
      '  flex: 1 !important;',
      '  min-width: 0 !important;',
      '  overflow: hidden !important;',
      '  text-overflow: ellipsis !important;',
      '  white-space: nowrap !important;',
      '  text-align: left !important;',
      '}',
      'body[data-dsh-claude-style] .dsh-claude-popover-item-shortcut {',
      '  margin-left: auto !important;',
      '  font-size: 11px !important;',
      '  color: var(--dsw-alias-label-tertiary, #a6a094) !important;',
      '  font-family: var(--ds-font-family-code, monospace) !important;',
      '  padding-left: 8px !important;',
      '}',
      'body[data-dsh-claude-style] .dsh-claude-popover-item-badge {',
      '  margin-left: auto !important;',
      '  font-size: 10px !important;',
      '  line-height: 14px !important;',
      '  padding: 0 5px !important;',
      '  border-radius: 8px !important;',
      '  background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.08)) !important;',
      '  color: var(--dsw-alias-label-secondary, #787672) !important;',
      '}',
      '',
      '/* Ensure popover items only display inside the popover */',
      'body[data-dsh-claude-style] [class*="footArea"] > .dsh-claude-popover-item {',
      '  display: none !important;',
      '}',
      '',
      '/* Hide original trigger buttons in footArea while keeping containers intact for modals */',
      'body[data-dsh-claude-style] [class*="footArea"] > [class*="settingsArea"] > [class*="triggerRow"],',
      'body[data-dsh-claude-style] [class*="footArea"] > [class*="footerActions"] :is([class*="footerButtons"], > button) {',
      '  display: none !important;',
      '}',
      'body[data-dsh-claude-style] [class*="footArea"] > [class*="settingsArea"],',
      'body[data-dsh-claude-style] [class*="footArea"] > [class*="footerActions"] {',
      '  position: static !important;',
      '  width: 0 !important;',
      '  height: 0 !important;',
      '  margin: 0 !important;',
      '  padding: 0 !important;',
      '  line-height: 0 !important;',
      '  font-size: 0 !important;',
      '  overflow: visible !important;',
      '}',
      '',
      '/* Collapsed rail mode adaptations */',
      'body[data-dsh-claude-style] [class*="root"][class*="collapsed"] .dsh-claude-account-btn {',
      '  width: 36px !important;',
      '  height: 36px !important;',
      '  padding: 0 !important;',
      '  justify-content: center !important;',
      '}',
      'body[data-dsh-claude-style] [class*="root"][class*="collapsed"] .dsh-claude-account-avatar {',
      '  margin-right: 0 !important;',
      '}',
      'body[data-dsh-claude-style] [class*="root"][class*="collapsed"] :is(.dsh-claude-account-label, .dsh-claude-account-chevron) {',
      '  display: none !important;',
      '}',
      'body[data-dsh-claude-style] [class*="root"][class*="collapsed"] .dsh-claude-account-popover {',
      '  left: calc(100% + 8px) !important;',
      '  bottom: 0 !important;',
      '  right: auto !important;',
      '  width: 220px !important;',
      '  transform-origin: bottom left !important;',
      '}',
      '',
      '/* ---------- Claude Code layout: settings section (brand) ---------- */',
      '/* The skin\'s own page in the settings dialog. It borrows the composer\'s',
      '   segment language so the two controls read as one design. */',
      'body[data-dsh-claude-style] .dsh-claude-brand-section {',
      '  display: flex;',
      '  flex-direction: column;',
      '  gap: 16px;',
      '  padding: 20px 24px;',
      '  max-width: 640px;',
      '  box-sizing: border-box;',
      '  font-family: var(--dsw-font-family);',
      '}',
      '',
      'body[data-dsh-claude-style] .dsh-claude-brand-title {',
      '  font-size: 15px;',
      '  font-weight: 600;',
      '  color: var(--dsw-alias-label-primary);',
      '}',
      '',
      'body[data-dsh-claude-style] .dsh-claude-brand-card {',
      '  display: flex;',
      '  align-items: center;',
      '  gap: 12px;',
      '  padding: 12px 14px;',
      '  border: 1px solid var(--dsw-alias-border-l1);',
      '  border-radius: 12px;',
      '}',
      '',
      'body[data-dsh-claude-style] .dsh-claude-brand-card-text {',
      '  flex: 1;',
      '  min-width: 0;',
      '}',
      '',
      'body[data-dsh-claude-style] .dsh-claude-brand-card-title {',
      '  font-size: 13px;',
      '  font-weight: 600;',
      '  line-height: 1.5;',
      '  color: var(--dsw-alias-label-primary);',
      '}',
      '',
      'body[data-dsh-claude-style] .dsh-claude-brand-card-desc {',
      '  margin-top: 4px;',
      '  font-size: 12px;',
      '  line-height: 1.5;',
      '  color: var(--dsw-alias-label-tertiary);',
      '}',
      '',
      'body[data-dsh-claude-style] .dsh-claude-brand-segments {',
      '  flex: none;',
      '  display: inline-flex;',
      '  align-items: center;',
      '  gap: 2px;',
      '  padding: 2px;',
      '  border-radius: 7px;',
      '  background: var(--dsw-specific-selector);',
      '}',
      '',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) .dsh-claude-brand-segments {',
      '  background: #f6f6f4;',
      '}',
      '',
      'body[data-dsh-claude-style] .dsh-claude-brand-option {',
      '  appearance: none;',
      '  margin: 0;',
      '  border: 0;',
      '  cursor: pointer;',
      '  background: transparent;',
      '  color: var(--dsw-alias-label-secondary);',
      '  font: inherit;',
      '  font-size: 13px;',
      '  font-weight: 500;',
      '  line-height: 18px;',
      '  padding: 3px 12px;',
      '  border-radius: 7px;',
      '  transition: background-color .1s, color .1s;',
      '}',
      '',
      'body[data-dsh-claude-style] .dsh-claude-brand-option:hover:not([data-active="true"]) {',
      '  color: var(--dsw-alias-label-primary);',
      '}',
      '',
      'body[data-dsh-claude-style] .dsh-claude-brand-option[data-active="true"] {',
      '  color: var(--dsw-alias-label-primary);',
      '  background: var(--dsw-alias-bg-layer-3);',
      '}',
      '',
      'body[data-dsh-claude-style]:not([data-ds-dark-theme]) .dsh-claude-brand-option[data-active="true"] {',
      '  background: var(--dsw-alias-bg-overlay);',
      '  box-shadow: 0 1px 2px rgba(20, 20, 19, 0.08);',
      '}',
      '',
    
    ].join('\n')

    // ============================================================================
    // Zone 3: 宿主上下文与通用辅助 (DSH Context & Helpers)
    // ============================================================================
    function findAccessTrigger() {
      var prefixes = ['访问模式', 'Access mode']
      var buttons = document.querySelectorAll('button[aria-label]')
      for (var i = 0; i < buttons.length; i++) {
        var label = buttons[i].getAttribute('aria-label') || ''
        for (var j = 0; j < prefixes.length; j++) {
          if (label.indexOf(prefixes[j]) === 0) return buttons[i]
        }
      }
      return null
    }

    function currentSession(ctx) {
      var sessions = ctx.get('sessions')
      if (sessions === void 0 || sessions === null) return null
      var id = sessions.list.getSnapshot().current
      if (id === void 0) return null
      var binding = sessions.binding(id)
      if (binding === void 0 || binding === null) return null
      return binding.session === void 0 ? null : binding.session
    }

    function currentPreset(session) {
      try {
        var snapshot = session.projections.faceOf('permissions').getSnapshot()
        return snapshot === void 0 ? null : snapshot.currentValue
      } catch (error) {
        return null
      }
    }

    /**
     * Read the persisted brand choice.
     *
     * Storage is the renderer's own localStorage, which DSH backs with the
     * `persist:dsh-desktop-renderer` partition, so the value survives an app
     * restart. Every access is guarded: a locked-down or full store must not
     * break the theme, so an unreadable value simply falls back to the default.
     *
     * @returns one of BRAND_CLAUDE / BRAND_ANTHROPIC.
     */
    function readStoredBrand() {
      try {
        var raw = window.localStorage.getItem(BRAND_STORAGE_KEY)
        if (raw === BRAND_ANTHROPIC) return BRAND_ANTHROPIC
        if (raw === BRAND_CLAUDE) return BRAND_CLAUDE
      } catch (error) {
        /* storage unavailable — fall through to the default */
      }
      return DEFAULT_BRAND
    }

    /** Persist the brand choice, ignoring a store that refuses writes. */
    function writeStoredBrand(brand) {
      try {
        window.localStorage.setItem(BRAND_STORAGE_KEY, brand)
      } catch (error) {
        /* storage unavailable — the session still shows the chosen brand */
      }
    }

    /**
     * Apply a brand to the document. The stylesheet keys off the attribute, so
     * this is the single mutation that repaints the sidebar brand; keeping it to
     * one attribute write is what makes the switch cheap and idempotent.
     *
     * @param brand - the brand to show; unknown values fall back to the default.
     * @returns the brand actually applied.
     */
    function applyBrand(brand) {
      var next = brand === BRAND_ANTHROPIC ? BRAND_ANTHROPIC : BRAND_CLAUDE
      document.body.setAttribute(BRAND_ATTR, next)
      return next
    }

    /**
     * The client context exposes no user or account service, so the account
     * name is inferred from the home-directory segment of a workspace path or
     * a session cwd. Falls back to 'User'.
     */
    function getUsername(ctx) {
      try {
        if (ctx && typeof ctx.get === 'function') {
          var workspaces = ctx.get('workspaces')
          if (workspaces && workspaces.list && typeof workspaces.list.getSnapshot === 'function') {
            var items = workspaces.list.getSnapshot().items || []
            for (var i = 0; i < items.length; i++) {
              var m = (items[i].path || '').match(/[/\\](?:Users|home)[/\\]([^/\\]+)/i)
              if (m && m[1]) return m[1]
            }
          }
          var sessions = ctx.get('sessions')
          if (sessions && sessions.list && typeof sessions.list.getSnapshot === 'function') {
            var byId = sessions.list.getSnapshot().byId || {}
            for (var id in byId) {
              var m2 = (byId[id].cwd || '').match(/[/\\](?:Users|home)[/\\]([^/\\]+)/i)
              if (m2 && m2[1]) return m2[1]
            }
          }
        }
      } catch (e) {}
      return 'User'
    }

    // ============================================================================
    // Zone 4: Claude Code UI 重塑与交互增强 (UI Overrides)
    // ============================================================================
    /**
     * Install the Claude Code surface rewrites: the copy slots (hero headline,
     * composer hint), the permission segmented control, and the account footer.
     * All of them sit in React-rendered trees — the headline and hint re-render
     * on locale switches, the hint unmounts while a draft exists, and the
     * composer re-renders the access trigger on every preset change — so one
     * MutationObserver re-applies them after each render. Every rewrite is
     * idempotent (a node already in the target state is left alone, and the
     * controls are only inserted when absent), so the observer cannot feed
     * itself.
     */
    function installOverrides(ctx) {
      // --- 4.1 Copy Overrides ---
      /** Shipped idle composer hints (zh / en, hero / default) this skin replaces. */
      var HINT_SOURCES = [
        '描述你想要构建的内容',
        '发消息或创建任务',
        'Describe what you want to build',
        'Message or run a task',
        'How can I help you today?',
        'Type / for commands',
      ]

      function rewriteHeadline() {
        var groups = document.querySelectorAll('[class*="titleGroup"]')
        for (var i = 0; i < groups.length; i++) {
          var spans = groups[i].children
          for (var j = 0; j < spans.length; j++) {
            var span = spans[j]
            var cls = span.getAttribute('class') || ''
            if (cls.indexOf('previewBadge') !== -1) continue
            if (span.textContent !== HERO_HEADLINE) span.textContent = HERO_HEADLINE
            break
          }
        }
      }

      function rewriteHint() {
        var isHero = document.querySelector('[class*="heroWorkspaceRow"], [class*="titleGroup"]') !== null
        var targetHint = isHero ? COMPOSER_HINT : 'Type / for commands'
        var hints = document.querySelectorAll('[data-composer-placeholder]')
        for (var i = 0; i < hints.length; i++) {
          var node = hints[i]
          var text = node.textContent || ''
          var idle = false
          for (var j = 0; j < HINT_SOURCES.length; j++) {
            if (text.indexOf(HINT_SOURCES[j]) === 0) {
              idle = true
              break
            }
          }
          if (idle && text !== targetHint) node.textContent = targetHint
        }
      }

      /**
       * Claude Code spinner verbs: picks one random verb per session turn
       * and retains it stably for that turn's thinking duration.
       */
      function pickRandomSpinnerVerb() {
        return SPINNER_VERBS[Math.floor(Math.random() * SPINNER_VERBS.length)] + '...'
      }

      function rewriteTurnStatus() {
        var nodes = document.querySelectorAll('[role="status"][class*="turnStatus"], [class*="turnStatus"]:not([class*="Clock"]):not([class*="clock"])')
        for (var i = 0; i < nodes.length; i++) {
          var el = nodes[i]
          var cls = el.getAttribute('class') || ''
          if (cls.indexOf('Clock') !== -1 || cls.indexOf('clock') !== -1) continue
          var verb = el.getAttribute('data-dsh-spinner-verb')
          if (!verb) {
            verb = pickRandomSpinnerVerb()
            el.setAttribute('data-dsh-spinner-verb', verb)
          }
          for (var j = 0; j < el.childNodes.length; j++) {
            var child = el.childNodes[j]
            if (child.nodeType === Node.TEXT_NODE) {
              if (child.nodeValue !== verb) {
                child.nodeValue = verb
              }
              break
            }
          }
        }
      }

      // --- 4.2 Permission Segments & In-Conversation Popover ---
      var segments = null
      var permContainer = null
      var permBtn = null
      var permLabel = null
      var permPopover = null

      function buildSegments(onPick) {
        var group = document.createElement('div')
        group.className = SEGMENTS_CLASS
        group.setAttribute('role', 'radiogroup')
        group.setAttribute('aria-label', 'Permission')
        for (var i = 0; i < PERMISSION_SEGMENTS.length; i++) {
          var spec = PERMISSION_SEGMENTS[i]
          var item = document.createElement('button')
          item.type = 'button'
          item.className = SEGMENT_CLASS
          item.setAttribute('role', 'radio')
          item.setAttribute('data-preset', spec.preset)
          item.textContent = spec.label
          group.appendChild(item)
        }
        group.addEventListener('click', function (event) {
          var target = event.target
          var item = target !== null && typeof target.closest === 'function' ? target.closest('.' + SEGMENT_CLASS) : null
          if (item === null || !group.contains(item)) return
          onPick(item.getAttribute('data-preset'))
        })
        return group
      }

      var permDocPointerListener = null
      var permResizeListener = null

      function buildPermTriggerAndPopover(onPick) {
        var container = document.createElement('div')
        container.className = 'dsh-claude-perm-container'

        var btn = document.createElement('button')
        btn.type = 'button'
        btn.className = 'dsh-claude-perm-btn'
        btn.setAttribute('aria-haspopup', 'menu')
        btn.setAttribute('aria-expanded', 'false')

        var label = document.createElement('span')
        label.className = 'dsh-claude-perm-label'
        label.textContent = 'Accept edits'

        var chevron = document.createElement('span')
        chevron.className = 'dsh-claude-perm-chevron'
        chevron.setAttribute('aria-hidden', 'true')

        btn.appendChild(label)
        btn.appendChild(chevron)

        var popover = document.createElement('div')
        popover.className = 'dsh-claude-perm-popover'
        popover.setAttribute('role', 'menu')

        for (var i = 0; i < PERMISSION_OPTIONS.length; i++) {
          var opt = PERMISSION_OPTIONS[i]
          var item = document.createElement('button')
          item.type = 'button'
          item.className = 'dsh-claude-popover-item'
          item.setAttribute('role', 'menuitem')
          item.setAttribute('data-preset', opt.preset)

          var col = document.createElement('div')
          col.style.cssText = 'display:flex; flex-direction:column; gap:2px; flex:1; text-align:left; min-width:0;'

          var itemTitle = document.createElement('span')
          itemTitle.style.cssText = 'font-weight:500; font-size:13px; line-height:16px;'
          itemTitle.textContent = opt.label

          var itemDesc = document.createElement('span')
          itemDesc.style.cssText = 'font-size:11px; line-height:14px; color:var(--dsw-alias-label-tertiary);'
          itemDesc.textContent = opt.desc

          col.appendChild(itemTitle)
          col.appendChild(itemDesc)
          item.appendChild(col)

          var check = document.createElement('span')
          check.className = 'dsh-claude-perm-check'
          check.style.cssText = 'font-size:12px; color:var(--dsw-alias-brand-primary, #d97757); margin-left:8px; display:none;'
          check.textContent = '✓'
          item.appendChild(check)

          item.addEventListener('click', (function (preset) {
            return function (e) {
              e.stopPropagation()
              closePerm()
              onPick(preset)
            }
          })(opt.preset))

          popover.appendChild(item)
        }

        function closePerm() {
          btn.removeAttribute('data-open')
          btn.setAttribute('aria-expanded', 'false')
          popover.removeAttribute('data-open')
        }

        function openPerm() {
          var rect = btn.getBoundingClientRect()
          popover.style.left = Math.max(8, rect.left) + 'px'
          popover.style.bottom = Math.max(8, window.innerHeight - rect.top + 6) + 'px'
          btn.setAttribute('data-open', 'true')
          btn.setAttribute('aria-expanded', 'true')
          popover.setAttribute('data-open', 'true')
        }

        btn.addEventListener('click', function (e) {
          e.stopPropagation()
          var isOpen = btn.getAttribute('data-open') === 'true'
          if (isOpen) {
            closePerm()
          } else {
            openPerm()
          }
        })

        if (!permDocPointerListener) {
          permDocPointerListener = function (e) {
            if (permPopover && permBtn && permPopover.getAttribute('data-open') === 'true') {
              if (!permBtn.contains(e.target) && !permPopover.contains(e.target)) {
                permBtn.removeAttribute('data-open')
                permBtn.setAttribute('aria-expanded', 'false')
                permPopover.removeAttribute('data-open')
              }
            }
          }
          document.addEventListener('pointerdown', permDocPointerListener)
        }

        if (!permResizeListener) {
          permResizeListener = function () {
            if (permPopover && permBtn && permPopover.getAttribute('data-open') === 'true') {
              permBtn.removeAttribute('data-open')
              permBtn.setAttribute('aria-expanded', 'false')
              permPopover.removeAttribute('data-open')
            }
          }
          window.addEventListener('resize', permResizeListener)
          window.addEventListener('scroll', permResizeListener, true)
        }

        container.appendChild(btn)
        document.body.appendChild(popover)

        return {
          container: container,
          btn: btn,
          label: label,
          popover: popover
        }
      }

      function updatePermState(preset) {
        if (!permLabel || !permPopover) return
        var matchedLabel = 'Accept edits'
        for (var i = 0; i < PERMISSION_OPTIONS.length; i++) {
          if (PERMISSION_OPTIONS[i].preset === preset) {
            matchedLabel = PERMISSION_OPTIONS[i].label
            break
          }
        }
        permLabel.textContent = matchedLabel

        var items = permPopover.querySelectorAll('[data-preset]')
        for (var j = 0; j < items.length; j++) {
          var it = items[j]
          var isCurrent = it.getAttribute('data-preset') === preset
          var check = it.querySelector('.dsh-claude-perm-check')
          if (check) {
            check.style.display = isCurrent ? 'inline' : 'none'
          }
          if (isCurrent) {
            it.setAttribute('data-active', '')
          } else {
            it.removeAttribute('data-active')
          }
        }
      }

      function submitPreset(preset) {
        var session = currentSession(ctx)
        if (session === null) return
        var settled = session.command('/permission ' + preset)
        if (settled !== void 0 && typeof settled.then === 'function') settled.then(schedule, schedule)
      }

      /**
       * Drive the shipped access menu to its full-access row, so the switch
       * runs through the shipped risk-confirmation dialog rather than a
       * skin-owned prompt. The trigger is hidden by this skin but still in
       * the tree, so a synthetic click still opens the menu; the row is then
       * picked by its label. A plain confirm stands in only when that menu
       * cannot be reached, which keeps the switch behind an explicit
       * acknowledgement either way.
       */
      function openShippedGate() {
        var trigger = findAccessTrigger()
        if (trigger === null) {
          if (window.confirm(GATED_PROMPT)) submitPreset(GATED_PRESET)
          return
        }
        trigger.click()
        var attempts = 0
        function seek() {
          var items = document.querySelectorAll('[role="menu"] button[role="menuitem"]')
          for (var i = 0; i < items.length; i++) {
            var text = (items[i].textContent || '').trim()
            for (var j = 0; j < FULL_ACCESS_LABELS.length; j++) {
              if (text === FULL_ACCESS_LABELS[j]) {
                items[i].click()
                return
              }
            }
          }
          attempts += 1
          if (attempts < 20) {
            requestAnimationFrame(seek)
            return
          }
          trigger.click()
          if (window.confirm(GATED_PROMPT)) submitPreset(GATED_PRESET)
        }
        requestAnimationFrame(seek)
      }

      function pick(preset) {
        var session = currentSession(ctx)
        if (session === null || preset === null) return
        if (preset === currentPreset(session)) return
        if (preset === GATED_PRESET) {
          openShippedGate()
          return
        }
        submitPreset(preset)
      }

      function syncAttachmentState() {
        var cards = document.querySelectorAll('[data-composer-card]')
        for (var ci = 0; ci < cards.length; ci++) {
          var card = cards[ci]
          var hasAtt = card.querySelector('._54WpYG_imageItem, [class*="imageItem"], [class*="thumbnail"], [class*="FileCard"], [class*="rail"]:not([class*="trailing"]) [class*="item"], [class*="rail"]:not([class*="trailing"]) img, [class*="rail"]:not([class*="trailing"]) [class*="card"]') !== null
          if (hasAtt) {
            if (card.getAttribute('data-has-attachments') !== 'true') {
              card.setAttribute('data-has-attachments', 'true')
            }
          } else {
            if (card.hasAttribute('data-has-attachments')) {
              card.removeAttribute('data-has-attachments')
            }
          }
        }
      }

      function restoreStatsPosition() {
        var stats = document.querySelector('[data-composer-stats]')
        if (stats && stats.parentElement && (stats.parentElement.matches && stats.parentElement.matches('[class*="row"]') || stats.parentElement.querySelector('[class*="tools"]'))) {
          var card = stats.closest('[data-composer-card]')
          if (card && card.parentNode) {
            card.parentNode.insertBefore(stats, card.nextSibling)
          }
        }
      }

      // Re-insert when a re-render swapped the host row, then mirror the running preset.
      function syncSegments() {
        var hasTurns = document.querySelector('[class*="turn"], [class*="message"], [data-turn], [data-message-id]') !== null
        var isHero = !hasTurns && (document.querySelector('[class*="composerHero"], [data-phase="hero"]') !== null)
        var allCards = document.querySelectorAll('[data-composer-card]')
        for (var c = 0; c < allCards.length; c++) {
          allCards[c].setAttribute('data-composer-variant', isHero ? 'hero' : 'inline')
        }

        var trigger = findAccessTrigger()
        if (trigger === null) return
        var host = trigger.parentElement
        if (host === null) return

        var session = currentSession(ctx)
        var preset = session === null ? null : currentPreset(session)

        var existingPermContainers = document.querySelectorAll('.dsh-claude-perm-container')
        var existingSegments = document.querySelectorAll('.' + SEGMENTS_CLASS)

        if (isHero) {
          for (var i = 0; i < existingPermContainers.length; i++) {
            existingPermContainers[i].remove()
          }
          if (permPopover && permPopover.parentElement) {
            permPopover.parentElement.removeChild(permPopover)
          }
          permContainer = null
          permBtn = null
          permLabel = null
          permPopover = null

          if (existingSegments.length > 1) {
            for (var s = 1; s < existingSegments.length; s++) existingSegments[s].remove()
          }
          if (existingSegments.length === 1 && host.contains(existingSegments[0])) {
            segments = existingSegments[0]
          } else {
            for (var s2 = 0; s2 < existingSegments.length; s2++) existingSegments[s2].remove()
            segments = buildSegments(pick)
            host.insertBefore(segments, host.firstChild)
          }
          for (var j = 0; j < segments.children.length; j++) {
            var item = segments.children[j]
            if (item.getAttribute('data-preset') === preset) {
              item.setAttribute('data-active', '')
              item.setAttribute('aria-checked', 'true')
            } else {
              item.removeAttribute('data-active')
              item.setAttribute('aria-checked', 'false')
            }
          }
        } else {
          for (var es = 0; es < existingSegments.length; es++) {
            existingSegments[es].remove()
          }
          segments = null

          var allExisting = document.querySelectorAll('.dsh-claude-perm-container')
          if (allExisting.length > 0) {
            permContainer = allExisting[0]
            for (var p = 1; p < allExisting.length; p++) {
              allExisting[p].remove()
            }
            if (permContainer.parentElement !== host) {
              host.insertBefore(permContainer, host.firstChild)
            }
            permBtn = permContainer.querySelector('.dsh-claude-perm-btn')
            permLabel = permContainer.querySelector('.dsh-claude-perm-label')
          } else {
            var res = buildPermTriggerAndPopover(pick)
            permContainer = res.container
            permBtn = res.btn
            permLabel = res.label
            permPopover = res.popover
            host.insertBefore(permContainer, host.firstChild)
          }
          updatePermState(preset)
        }
      }

      // --- 4.3 Account Footer & Popover ---
      var accountBtn = null
      var accountPopover = null
      var popoverBody = null
      var popoverTimer = null

      function openPopover() {
        if (!accountPopover || !accountBtn) return
        if (popoverTimer) {
          clearTimeout(popoverTimer)
          popoverTimer = null
        }
        accountPopover.setAttribute('data-open', 'true')
        accountBtn.setAttribute('data-open', 'true')
        accountBtn.setAttribute('aria-expanded', 'true')
      }

      function closePopover() {
        if (!accountPopover || !accountBtn) return
        if (popoverTimer) {
          clearTimeout(popoverTimer)
          popoverTimer = null
        }
        accountPopover.setAttribute('data-open', 'false')
        accountBtn.setAttribute('data-open', 'false')
        accountBtn.setAttribute('aria-expanded', 'false')
      }

      function togglePopover() {
        if (!accountPopover) return
        var isOpen = accountPopover.getAttribute('data-open') === 'true'
        if (isOpen) {
          closePopover()
        } else {
          openPopover()
        }
      }

      function scheduleClosePopover() {
        if (popoverTimer) clearTimeout(popoverTimer)
        popoverTimer = setTimeout(function () {
          closePopover()
        }, 150)
      }

      function cancelClosePopover() {
        if (popoverTimer) {
          clearTimeout(popoverTimer)
          popoverTimer = null
        }
      }

      var settingsItem = null
      function syncPopoverItems(footArea) {
        if (!popoverBody || !footArea) return

        var origSettingsTrigger = footArea.querySelector('[class*="settingsArea"] button[aria-haspopup="dialog"]') ||
                                  footArea.querySelector('[class*="settingsArea"] button')
        var labelText = '设置'
        if (origSettingsTrigger) {
          var txt = (origSettingsTrigger.textContent || '').trim()
          if (!txt) txt = origSettingsTrigger.getAttribute('aria-label') || ''
          if (txt) labelText = txt
        }

        if (!settingsItem) {
          settingsItem = document.createElement('button')
          settingsItem.type = 'button'
          settingsItem.className = 'dsh-claude-popover-item'
          settingsItem.setAttribute('data-action', 'settings')
          settingsItem.innerHTML =
            '<span class="dsh-claude-popover-item-icon">' +
              '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
                '<circle cx="12" cy="12" r="3"></circle>' +
                '<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>' +
              '</svg>' +
            '</span>' +
            '<span class="dsh-claude-popover-item-text">' + labelText + '</span>' +
            '<span class="dsh-claude-popover-item-shortcut">Ctrl+,</span>'

          settingsItem.addEventListener('click', function (e) {
            e.stopPropagation()
            closePopover()
            var realTrigger = footArea.querySelector('[class*="settingsArea"] button[aria-haspopup="dialog"]') ||
                              footArea.querySelector('[class*="settingsArea"] button')
            if (realTrigger) {
              realTrigger.click()
            }
          })
          popoverBody.appendChild(settingsItem)
        } else {
          var txtEl = settingsItem.querySelector('.dsh-claude-popover-item-text')
          if (txtEl && txtEl.textContent !== labelText) txtEl.textContent = labelText
        }

        var footerActions = footArea.querySelector('[class*="footerActions"]')
        var footerButtons = footerActions ? footerActions.querySelectorAll('button') : []

        var existingActionItems = popoverBody.querySelectorAll('[data-action-index]')
        for (var ea = 0; ea < existingActionItems.length; ea++) {
          var actionIdx = parseInt(existingActionItems[ea].getAttribute('data-action-index'), 10)
          if (isNaN(actionIdx) || actionIdx >= footerButtons.length) {
            existingActionItems[ea].parentElement.removeChild(existingActionItems[ea])
          }
        }

        for (var f = 0; f < footerButtons.length; f++) {
          (function (origBtn, idx) {
            var item = popoverBody.querySelector('[data-action-index="' + idx + '"]')
            var iconEl = origBtn.querySelector('svg')
            var iconHtml = iconEl ? iconEl.outerHTML : ''
            var text = origBtn.getAttribute('aria-label') || origBtn.textContent.trim() || '插件'
            var badge = origBtn.getAttribute('data-cordis-badge') || ''

            if (!item) {
              item = document.createElement('button')
              item.type = 'button'
              item.className = 'dsh-claude-popover-item'
              item.setAttribute('data-action-index', idx)
              item.innerHTML =
                '<span class="dsh-claude-popover-item-icon">' + iconHtml + '</span>' +
                '<span class="dsh-claude-popover-item-text">' + text + '</span>' +
                (badge ? '<span class="dsh-claude-popover-item-badge">' + badge + '</span>' : '')

              item.addEventListener('click', function (e) {
                e.stopPropagation()
                closePopover()
                origBtn.click()
              })
              popoverBody.insertBefore(item, settingsItem)
            } else {
              var tEl = item.querySelector('.dsh-claude-popover-item-text')
              if (tEl && tEl.textContent !== text) tEl.textContent = text
              var bEl = item.querySelector('.dsh-claude-popover-item-badge')
              if (bEl && bEl.textContent !== badge) bEl.textContent = badge
            }
          })(footerButtons[f], f)
        }
      }

      function syncAccountFooter() {
        var footArea = document.querySelector('[class*="footArea"]')
        if (footArea === null) return

        var username = getUsername(ctx)

        if (accountBtn === null || !footArea.contains(accountBtn)) {
          if (accountBtn && accountBtn.parentElement) accountBtn.parentElement.removeChild(accountBtn)
          accountBtn = document.createElement('div')
          accountBtn.className = 'dsh-claude-account-btn'
          accountBtn.setAttribute('role', 'button')
          accountBtn.setAttribute('tabindex', '0')
          accountBtn.setAttribute('aria-haspopup', 'menu')
          accountBtn.setAttribute('aria-expanded', 'false')
          accountBtn.innerHTML =
            '<span class="dsh-claude-account-avatar"></span>' +
            '<span class="dsh-claude-account-label">' +
              '<span class="dsh-claude-account-user">' + username + '</span>' +
            '</span>' +
            '<span class="dsh-claude-account-chevron"></span>'

          accountBtn.addEventListener('mouseenter', function () {
            openPopover()
          })
          accountBtn.addEventListener('mouseleave', function () {
            scheduleClosePopover()
          })
          accountBtn.addEventListener('click', function (e) {
            e.stopPropagation()
            togglePopover()
          })
          footArea.appendChild(accountBtn)
        } else {
          var userEl = accountBtn.querySelector('.dsh-claude-account-user')
          if (userEl && userEl.textContent !== username) userEl.textContent = username
        }

        if (accountPopover === null || !footArea.contains(accountPopover)) {
          if (accountPopover && accountPopover.parentElement) accountPopover.parentElement.removeChild(accountPopover)
          accountPopover = document.createElement('div')
          accountPopover.id = 'dsh-claude-account-popover'
          accountPopover.className = 'dsh-claude-account-popover'
          accountPopover.setAttribute('data-open', 'false')

          accountPopover.addEventListener('mouseenter', function () {
            cancelClosePopover()
          })
          accountPopover.addEventListener('mouseleave', function () {
            scheduleClosePopover()
          })

          var header = document.createElement('div')
          header.className = 'dsh-claude-account-popover-header'

          var nameEl = document.createElement('div')
          nameEl.className = 'dsh-claude-account-popover-name'
          nameEl.textContent = username

          var divider = document.createElement('div')
          divider.className = 'dsh-claude-account-popover-divider'

          header.appendChild(nameEl)
          header.appendChild(divider)
          accountPopover.appendChild(header)

          popoverBody = document.createElement('div')
          popoverBody.className = 'dsh-claude-account-popover-body'
          accountPopover.appendChild(popoverBody)

          footArea.appendChild(accountPopover)
        } else {
          var nameEl2 = accountPopover.querySelector('.dsh-claude-account-popover-name')
          if (nameEl2 && nameEl2.textContent !== username) nameEl2.textContent = username
        }

        syncPopoverItems(footArea)
      }

      // ============================================================================
      // Zone 5: 响应式调度与生命周期清理 (Scheduler & Teardown)
      // ============================================================================
      function onGlobalPointerDown(e) {
        if (!accountPopover || !accountBtn) return
        var target = e.target
        if (target && (accountBtn.contains(target) || accountPopover.contains(target))) return
        closePopover()
      }

      function onGlobalKeyDown(e) {
        if (e.key === 'Escape') {
          closePopover()
          if (permPopover && permBtn) {
            permBtn.removeAttribute('data-open')
            permBtn.setAttribute('aria-expanded', 'false')
            permPopover.removeAttribute('data-open')
          }
        }
        if ((e.ctrlKey || e.metaKey) && e.key === ',') {
          e.preventDefault()
          var realTrigger = document.querySelector('[class*="footArea"] [class*="settingsArea"] button[aria-haspopup="dialog"]') ||
                            document.querySelector('[class*="footArea"] [class*="settingsArea"] button')
          if (realTrigger) {
            realTrigger.click()
          }
        }
        // Plain Enter in inline composer sends message; Shift+Enter creates newline; IME composition preserved
        if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
          if (e.isComposing || e.keyCode === 229) return
          var target = e.target
          if (target && (target.hasAttribute('data-composer-input') || (target.closest && target.closest('[data-composer-input]')))) {
            var card = target.closest('[data-composer-card]')
            if (card) {
              var sendBtn = card.querySelector('button[aria-label^="发送"], button[aria-label^="Send"], button[aria-label*="发送"], button[aria-label*="Send"], button[aria-label*="排队"], button[aria-label*="Queue"], button[aria-label*="插话"], button[aria-label*="Steer"], [class*="sendBtn"], [class*="sendButton"]')
              if (sendBtn && !sendBtn.disabled) {
                e.preventDefault()
                e.stopPropagation()
                sendBtn.click()
              }
            }
          }
        }
      }

      function onCardPointerDown(e) {
        var card = e.target.closest && e.target.closest('[data-composer-card][data-composer-variant="inline"]')
        if (!card) return
        if (e.target.closest('button, [role="button"], [role="menu"], [role="radiogroup"], input, select')) return
        var input = card.querySelector('[data-composer-input]')
        if (input && document.activeElement !== input) {
          input.focus()
        }
      }

      document.addEventListener('pointerdown', onGlobalPointerDown)
      document.addEventListener('pointerdown', onCardPointerDown)
      document.addEventListener('keydown', onGlobalKeyDown, true)

      // Chat streaming mutates the tree constantly; coalesce to one pass a frame.
      var scheduled = false
      var composerCardObserver = null
      var observedCard = null
      if (typeof ResizeObserver !== 'undefined') {
        composerCardObserver = new ResizeObserver(function () {
          var scroller = document.querySelector('[data-conversation-scroll], [class*="scrollBody"]')
          if (scroller) {
            var dist = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight
            if (dist < 150) {
              scroller.scrollTop = scroller.scrollHeight
            }
          }
        })
      }

      function schedule() {
        if (scheduled) return
        scheduled = true
        requestAnimationFrame(function () {
          scheduled = false
          rewriteHeadline()
          rewriteHint()
          rewriteTurnStatus()
          syncAttachmentState()
          restoreStatsPosition()
          syncSegments()
          syncAccountFooter()
          if (composerCardObserver) {
            var currentCard = document.querySelector('[data-composer-card]')
            if (currentCard !== observedCard) {
              if (observedCard) composerCardObserver.unobserve(observedCard)
              observedCard = currentCard
              if (observedCard) composerCardObserver.observe(observedCard)
            }
          }
        })
      }

      var observer = new MutationObserver(schedule)
      observer.observe(document.body, {
        childList: true,
        characterData: true,
        subtree: true,
        attributes: true,
        // The shipped trigger carries the current preset in its aria-label.
        attributeFilter: ['aria-label'],
      })
      schedule()

      return function () {
        observer.disconnect()
        if (composerCardObserver) {
          composerCardObserver.disconnect()
          composerCardObserver = null
          observedCard = null
        }
        if (popoverTimer) {
          clearTimeout(popoverTimer)
          popoverTimer = null
        }
        document.removeEventListener('pointerdown', onGlobalPointerDown)
        document.removeEventListener('pointerdown', onCardPointerDown)
        document.removeEventListener('keydown', onGlobalKeyDown, true)
        if (permDocPointerListener) {
          document.removeEventListener('pointerdown', permDocPointerListener)
          permDocPointerListener = null
        }
        if (permResizeListener) {
          window.removeEventListener('resize', permResizeListener)
          window.removeEventListener('scroll', permResizeListener, true)
          permResizeListener = null
        }
        if (segments !== null && segments.parentElement !== null) segments.parentElement.removeChild(segments)
        segments = null
        if (permPopover !== null && permPopover.parentElement !== null) {
          permPopover.parentElement.removeChild(permPopover)
        }
        permPopover = null
        permBtn = null
        permLabel = null
        permContainer = null
        if (accountPopover !== null && accountPopover.parentElement !== null) {
          accountPopover.parentElement.removeChild(accountPopover)
        }
        accountPopover = null
        popoverBody = null
        if (accountBtn !== null && accountBtn.parentElement !== null) {
          accountBtn.parentElement.removeChild(accountBtn)
        }
        accountBtn = null
        var leftoverItems = document.querySelectorAll('.dsh-claude-popover-item, .dsh-claude-account-popover, .dsh-claude-account-btn, .dsh-claude-perm-container, .dsh-claude-perm-popover, .dsh-claude-segments')
        for (var li = 0; li < leftoverItems.length; li++) {
          if (leftoverItems[li].parentElement) {
            leftoverItems[li].parentElement.removeChild(leftoverItems[li])
          }
        }
      }
    }

    // ============================================================================
    // Zone 4.4: 设置页品牌分区 (Settings Section: Brand)
    // ============================================================================
    /**
     * The settings page section, mounted by the host into the `settings.section`
     * slot. That slot hands a section only `{ close }` plus the standard hooks, so
     * this component owns its state and persistence rather than reading a store.
     *
     * It renders a segmented control in the same visual language as the composer's
     * permission control: a single hairline track with the active segment plated.
     */
    function BrandSettingsSection() {
      var state = React.useState(readStoredBrand())
      var brand = state[0]
      var setBrand = state[1]

      var choose = function (next) {
        if (next === brand) return
        writeStoredBrand(next)
        applyBrand(next)
        setBrand(next)
      }

      var options = [
        { value: BRAND_CLAUDE, label: 'Claude' },
        { value: BRAND_ANTHROPIC, label: 'Anthropic' },
      ]

      var segments = []
      for (var i = 0; i < options.length; i++) {
        segments.push(
          React.createElement(
            'button',
            {
              key: options[i].value,
              type: 'button',
              className: 'dsh-claude-brand-option',
              'data-active': options[i].value === brand ? 'true' : 'false',
              'aria-pressed': options[i].value === brand ? 'true' : 'false',
              onClick: (function (value) {
                return function () {
                  choose(value)
                }
              })(options[i].value),
            },
            options[i].label,
          ),
        )
      }

      return React.createElement(
        'div',
        { className: 'dsh-claude-brand-section' },
        React.createElement('div', { className: 'dsh-claude-brand-title' }, 'Claude Style'),
        React.createElement(
          'div',
          { className: 'dsh-claude-brand-card' },
          React.createElement(
            'div',
            { className: 'dsh-claude-brand-card-text' },
            React.createElement('div', { className: 'dsh-claude-brand-card-title' }, 'Sidebar brand'),
            React.createElement(
              'div',
              { className: 'dsh-claude-brand-card-desc' },
              'Which brand mark the sidebar shows. Claude is the default.',
            ),
          ),
          React.createElement('div', { className: 'dsh-claude-brand-segments', role: 'group' }, segments),
        ),
      )
    }

    /**
     * Register the settings section.
     *
     * Two waits are needed, and both are declarative rather than polling:
     *
     *   1. `ctx.inject(['slots'], …)` waits for the slot registry service. The
     *      renderer provides it, so reading `ctx.get('slots')` directly during
     *      `apply` could see nothing and silently drop the section.
     *   2. `slots.inject('settings.section', …)` waits for the slot *declaration*,
     *      which `dsh-client-ui-settings-general` publishes later. Registering
     *      eagerly instead would throw and fail the boot.
     *
     * `order: 22` sorts the section after the shipped ones (general 0, models 10,
     * plugins 15, agent-presets 20, chat-import 21). The slot accepts no icon
     * field, so the navigation entry takes the host's default glyph.
     *
     * @param ctx - client root context.
     * @returns a disposer that tears the registration down.
     */
    function installSettingsSection(ctx) {
      if (typeof ctx.inject !== 'function') return function () {}
      var fiber = ctx.inject(['slots'], function (scope) {
        var slots = scope.get('slots')
        if (slots === void 0 || slots === null || typeof slots.inject !== 'function') return
        scope.effect(function () {
          return slots.inject('settings.section', function () {
            return slots.register(
              { name: 'settings.section', id: 'claude-style', order: 22, label: function () { return 'Claude Style' } },
              BrandSettingsSection,
            )
          })
        }, 'dsh-claude-style: settings section')
      })
      return function () {
        try {
          if (fiber && typeof fiber.dispose === 'function') fiber.dispose()
        } catch (error) {
          /* the fiber may already be gone during teardown */
        }
      }
    }

    // ============================================================================
    // Zone 6: 插件入口与导出 (Plugin Entry & Export)
    // ============================================================================
    function apply(ctx) {
      var body = document.body
      body.setAttribute('data-dsh-claude-style', '')
      applyBrand(readStoredBrand())

      var old = document.getElementById(STYLE_ID)
      if (old && old.parentElement) old.parentElement.removeChild(old)

      var style = document.createElement('style')
      style.id = STYLE_ID
      style.dataset.skinChrome = 'dsh-claude-style-style'
      style.textContent = CSS
      document.head.appendChild(style)

      var stopOverrides = installOverrides(ctx)
      var stopSettings = installSettingsSection(ctx)

      ctx.effect(function () {
        return function () {
          stopOverrides()
          stopSettings()
          body.removeAttribute('data-dsh-claude-style')
          body.removeAttribute(BRAND_ATTR)
          var el = document.getElementById(STYLE_ID)
          if (el) el.remove()
        }
      }, 'dsh-claude-style: Claude Code Desktop theme')
    }

    exports.apply = apply
    return module.exports
  },
})
