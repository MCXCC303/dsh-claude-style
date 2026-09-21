/**
 * Claude Style — Claude Code Desktop theme for the DeepSeek Harness web GUI.
 *
 * GENERATED FILE — do not edit. Source lives in src/ as feature fragments;
 * `node scripts/build.mjs` assembles this bundle.
 *
 * JS fragments (in assembly order):
 *   - src/assets/brand/*.svg   Brand marks (inlined as CSS url() data URIs at build time)
 *  *   - src/constants.js
 *   - src/context/host.js
 *   - src/context/prefs.js
 *   - src/context/model-copy.js
 *   - src/context/i18n.js
 *   - src/overrides/popover-utils.js
 *   - src/overrides/selection.js
 *   - src/overrides/copy.js
 *   - src/overrides/permissions.js
 *   - src/overrides/model-brand.js
 *   - src/overrides/model-picker.js
 *   - src/overrides/account-footer.js
 *   - src/overrides/ban-screen.js
 *   - src/overrides/theme-flip.js
 *   - src/overrides/scheduler.js
 *   - src/settings.js
 *   - src/entry.js
 *
 * Stylesheets (in assembly order):
 *  *   - src/styles/tokens.css
 *   - src/styles/typography.css
 *   - src/styles/chrome.css
 *   - src/styles/composer/hero.css
 *   - src/styles/composer/card.css
 *   - src/styles/composer/inline.css
 *   - src/styles/sidebar.css
 *   - src/styles/components/permissions.css
 *   - src/styles/components/account-footer.css
 *   - src/styles/components/ban-screen.css
 *   - src/styles/components/model-picker.css
 *   - src/styles/components/footer-takeover.css
 *   - src/styles/components/third-party.css
 *   - src/styles/components/settings.css
 *   - src/styles/components/theme-flip.css
 */
window.__ModuleLoader__.load({
  id: 'dsh-claude-style',
  factory: (require) => {
    'use strict'
    var module = { exports: {} }
    var exports = module.exports

    // React is resolved through the module loader's graph, so the settings
    // section can be a real component without a host half.
    var React = require('react')


    // ============================================================================
    // 常量与配置定义 (Constants & Tokens)
    // ============================================================================
    var STYLE_ID = 'dsh-claude-style-style'

    var COMPOSER_HINT = 'How can I help you today?'

    /**
     * Model picker copy.
     *
     * The copy itself is NOT here. It ships as `model-descriptions.json` beside
     * the bundle, and the browser half fetches it at runtime (the host half
     * serves it under MODEL_COPY_ROUTE), so the model table grows without a
     * rebuild and no copy enters the bundle. The language comes from the shell's
     * own `locale` service — one line per row, in the language the rest of the
     * UI is in — never two languages stacked.
     *
     * The constants below are the neutral fallbacks painted before that document
     * arrives, and kept if it never does. They are English because a failed
     * fetch has no locale to honour.
     */
    var MODEL_OFFICIAL_GROUP = 'deepseek-official'
    var MODEL_COPY_ROUTE = '/dsh-claude-style/model-descriptions.json'
    var MODEL_COPY_FALLBACK_LOCALE = 'en'
    var MODEL_FALLBACK_LABEL = 'Select model'
    var MODEL_LOADING_LABEL = 'Loading models…'
    var MODEL_EMPTY_LABEL = 'No models available.'
    var MODEL_EFFORT_LABEL = 'Reasoning effort'
    var MODEL_EFFORT_DEFAULT = 'Default'
    var MODEL_MORE_LABEL = 'More models'
    var MODEL_TRIGGER_LABEL = 'Select model, currently {model}'
    var MODEL_NO_EFFORT_LABEL = 'This model offers no reasoning levels.'

    /** English weekday names, indexed by Date#getDay() (0 = Sunday). */
    var WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    /**
     * Time-of-day hero greeting, à la Claude Code's rotating welcomes. Slots
     * cover all 24 hours; the eight o'clock slot salutes the current weekday
     * instead ("Happy Monday."). `username` fills the Good morning slot.
     */
    function pickHeroGreeting(username) {
      var now = new Date()
      var hour = now.getHours()
      if (hour >= 6 && hour < 8) return 'Good morning, ' + (username || 'User') + '!'
      if (hour >= 8 && hour < 9) return 'Happy ' + WEEKDAY_NAMES[now.getDay()] + '.'
      if (hour >= 9 && hour < 12) return 'What are you working on?'
      if (hour >= 12 && hour < 14) return 'What’s on the agenda today?'
      if (hour >= 14 && hour < 18) return 'Coffee and Claude time?'
      if (hour >= 18) return 'Evening, how are things?'
      return 'You are here!'
    }

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

    /**
     * Preferences, persisted in the host settings namespace `claude-style`
     * (lib/index.js owns it; src/context/prefs.js reads and writes it). Each value is
     * mirrored onto the document as an attribute so the stylesheet decides what
     * a preference means, and the defaults here are the shipped behaviour.
     */

    /** Brand marks selectable from the settings page. `claude` is the default. */
    var BRAND_CLAUDE = 'claude'
    var BRAND_ANTHROPIC = 'anthropic'
    /** Leave the brand area entirely to the host: neither brand variant matches. */
    var BRAND_OFF = 'off'
    var DEFAULT_BRAND = BRAND_CLAUDE
    /** The document attribute the stylesheet switches on. */
    var BRAND_ATTR = 'data-dsh-claude-brand'

    /** Present while the skin takes over the sidebar footer (settings area + account row). */
    var FOOTER_ATTR = 'data-dsh-claude-footer-takeover'
    /**
     * The language the account-hold easter egg (src/overrides/ban-screen.js) is
     * written in. It is its own preference rather than "follow the shell",
     * because the page reproduces a real Claude screen: the point is to read it
     * in the language Claude actually used, whatever the shell is set to. The
     * default is English for that reason.
     */
    var BAN_LOCALE_EN = 'en'
    var BAN_LOCALE_ZH = 'zh'
    var BAN_LOCALES = [BAN_LOCALE_EN, BAN_LOCALE_ZH]
    var DEFAULT_BAN_LOCALE = BAN_LOCALE_EN
    /** Present while the composer restyle applies to the page currently shown. */
    var COMPOSER_ATTR = 'data-dsh-claude-composer-active'
    /**
     * Present while the browser window does NOT hold focus.
     *
     * The window's focus state is the only thing that separates the two text
     * selection paints (gray on black unfocused, blue on white focused), and no
     * selector can read it — so src/overrides/selection.js mirrors it onto the
     * document and the stylesheet switches on this attribute.
     */
    var WINDOW_BLUR_ATTR = 'data-dsh-window-blur'
    /** Composer surfaces the restyle may cover, in settings order. */
    var COMPOSER_SCOPES = ['off', 'hero', 'conversation', 'all']
    /** Route the browser half reads and writes preferences through (lib/index.js). */
    var PREFS_ROUTE = '/dsh-claude-style/prefs'
    /** Route that resolves the host OS user once; never polled. */
    var USERNAME_ROUTE = '/dsh-claude-style/username'
    /** Longest accepted custom username; mirrored by lib/index.js. */
    var USERNAME_MAX = 64

    /** Wordmark aspect ratio; scripts/build.mjs sizes the sidebar word height from it (geometry lives in src/assets/claude-word.svg). */
    var CLAUDE_WORD_ASPECT = 512.22 / 121.54

    var SANS = "'Anthropic Sans Web Text','Noto Sans SC','Source Han Sans SC',-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei','Helvetica Neue',Helvetica,Arial,sans-serif"
    var SERIF = "'Anthropic Serif Web Text',Georgia,'Times New Roman','Noto Sans SC','Source Han Sans SC','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif"
    /**
     * Conversation prose: Claude sets Latin text in the serif face and lets
     * Chinese fall through to a sans CJK — the serif Latin faces carry no CJK
     * glyphs, so the stack leads with serif and names the sans CJK families
     * after it. UI chrome keeps SANS; only markdown prose uses this.
     */
    var PROSE = "'Anthropic Serif Web Text',Georgia,'Times New Roman','Noto Sans SC','Source Han Sans SC','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif"
    var MONO = "'JetBrains Mono','Noto Sans SC','Source Han Sans SC','PingFang SC','Hiragino Sans GB','Microsoft YaHei',ui-monospace,'SF Mono','Fira Code',Consolas,'Liberation Mono',Menlo,Courier,monospace"

    // ============================================================================
    // 样式表（由 src/styles/*.css 内联生成，勿手改） (CSS Stylesheet)
    // ============================================================================
    var CSS = [
      "/* --- 2.1 Design Tokens (Dark Base & Light Overrides) --- */",
      "/* ---------- typography tokens: theme-independent ---------- */",
      "body[data-dsh-claude-style] {",
      "  --dsw-font-family: 'Anthropic Sans Web Text','Noto Sans SC','Source Han Sans SC',-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei','Helvetica Neue',Helvetica,Arial,sans-serif;",
      "  --dsw-font-serif: 'Anthropic Serif Web Text',Georgia,'Times New Roman','Noto Sans SC','Source Han Sans SC','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif;",
      "  --dsw-font-prose: 'Anthropic Serif Web Text',Georgia,'Times New Roman','Noto Sans SC','Source Han Sans SC','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif;",
      "  --dsw-font-code: 'JetBrains Mono','Noto Sans SC','Source Han Sans SC','PingFang SC','Hiragino Sans GB','Microsoft YaHei',ui-monospace,'SF Mono','Fira Code',Consolas,'Liberation Mono',Menlo,Courier,monospace;",
      "  /* The picker's vendor face: a model row may wear the typeface of the vendor",
      "     that made the model, exactly as it already wears that vendor's mark. Only",
      "     Gemini has one today — a Latin-only Google Sans Flex subset (standard",
      "     weight, upright, SIL OFL 1.1, fonts/OFL-GoogleSansFlex.txt) — and the UI",
      "     face stays behind it in the stack, so a label carrying a character outside",
      "     the subset still renders instead of falling to tofu. */",
      "  --dsw-font-brand-gemini: 'Google Sans Flex Picker', var(--dsw-font-family);",
      "  /* Markdown document headings keep the host's own ladder, steepened from",
      "     21/19/18 toward Claude's measured ≈21/17/15; h1 and h4 keep the host's",
      "     values. The host reads these through a `font:` shorthand that names",
      "     --dsw-font-family directly, so overriding the `-font-family` sub-tokens",
      "     never reached the page — the shorthand itself is what has to be",
      "     re-declared. */",
      "  --dsw-font-markdown-h2: 700 calc(18px + var(--dsh-content-font-delta)) / calc(26px + var(--dsh-content-font-delta)) var(--dsw-font-prose);",
      "  --dsw-font-markdown-h3: 700 calc(16px + var(--dsh-content-font-delta)) / calc(24px + var(--dsh-content-font-delta)) var(--dsw-font-prose);",
      "}",
      "",
      "/* ---------- design tokens: warm-black (dark) palette ---------- */",
      "/* The dark palette is scoped to [data-ds-dark-theme] on purpose. The host",
      "   ships its own dark palette on body[data-ds-dark-theme] — the same (0,1,1)",
      "   weight as a bare body[data-dsh-claude-style] — so the two only tie, and",
      "   whichever stylesheet the loader appends last wins. When the host's lands",
      "   after this one its blue accents (--dsw-alias-state-business-primary,",
      "   --dsw-alias-button-info-fill, --dsw-alias-link and the brand \"new color\")",
      "   replace the warm palette. Naming the attribute keeps this block at (0,2,1)",
      "   and makes it order-independent. */",
      "body[data-dsh-claude-style][data-ds-dark-theme] {",
      "  --dsw-alias-bg-base: #141413;",
      "  --dsw-alias-bg-layer-1: #1c1b1a;",
      "  --dsw-alias-bg-layer-2: #242320;",
      "  --dsw-alias-bg-layer-3: #2e2c29;",
      "  --dsw-alias-bg-overlay: #242320;",
      "  --dsw-alias-border-l1: #242320;",
      "  --dsw-alias-border-l2: #2e2c29;",
      "  --dsw-alias-border-l3: #3a3833;",
      "  --dsw-alias-brand-primary: #d97757;",
      "  --dsw-alias-brand-text: #faf9f5;",
      "  --dsw-alias-button-elevated-fill: #242320;",
      "  --dsw-alias-button-floating-fill: #242320;",
      "  --dsw-alias-button-floating-hover: #2e2c29;",
      "  --dsw-alias-button-info-fill: #d97757;",
      "  --dsw-alias-button-info-hover: #e08a6d;",
      "  --dsw-alias-interactive-bg-active: rgba(217, 119, 87, 0.30);",
      "  --dsh-claude-hover-bg: rgba(255, 255, 255, 0.08);",
      "  --dsh-claude-inline-code-bg: rgba(255, 255, 255, 0.05);",
      "  --dsh-claude-inline-code-fg: #e8a08a;",
      "  --dsh-claude-link: #8ab4f8;",
      "  --dsh-claude-link-underline: rgba(138, 180, 248, 0.6);",
      "  /* The host pins the code-block surface on `pre.shiki` with !important, so it",
      "     is only reachable through its own token; #1c1b1a is the value the skin's",
      "     (inert) `pre { background }` rule always meant. */",
      "  --dsw-alias-markdown-code-block: #1c1b1a;",
      "  --dsw-alias-markdown-code-block-banner: #242320;",
      "  --dsw-alias-interactive-bg-hover: var(--dsh-claude-hover-bg);",
      "  --dsw-alias-interactive-bg-hover-solid: #2e2c29;",
      "  --dsw-alias-label-primary: #faf9f5;",
      "  --dsw-alias-label-primary-bluish: #faf9f5;",
      "  --dsw-alias-label-secondary: #b0aea5;",
      "  --dsw-alias-label-tertiary: #8f8d84;",
      "  --dsw-alias-label-caption: #6b6a65;",
      "  --dsw-alias-state-business-primary: #d97757;",
      "  --dsw-alias-state-business-tertiary: #3a2a22;",
      "  --dsw-alias-link: #e08a6d;",
      "  --dsw-shadow-lv2: 0 4px 16px rgba(0, 0, 0, 0.30), 0 1px 3px rgba(0, 0, 0, 0.14);",
      "  --dsw-specific-input-major: #0f0e0d;",
      "  --dsw-specific-selector: #2e2c29;",
      "  --dsw-specific-sidebar-fill: #141413;",
      "  /* The host's \"new color\" brand accent (shipped under this doubled suffix)",
      "     resolves to a deepseek blue in both palettes; the skin has one accent. */",
      "  --dsw-alias-brand-primary-new-colorprimary-new-color: #d97757;",
      "}",
      "",
      "/* ================= light variant: ivory editorial ================= */",
      "body[data-dsh-claude-style]:not([data-ds-dark-theme]) {",
      "  --dsw-alias-bg-base: #fcfcfb;",
      "  --dsw-alias-bg-layer-1: #fcfcfb;",
      "  --dsw-alias-bg-layer-2: #fbfbf9;",
      "  --dsw-alias-bg-layer-3: #f9f9f6;",
      "  --dsw-alias-bg-overlay: #ffffff;",
      "  --dsw-alias-border-l1: #e8e6dc;",
      "  --dsw-alias-border-l2: #dedcd2;",
      "  --dsw-alias-border-l3: #d0cdc1;",
      "  --dsw-alias-brand-primary: #d97757;",
      "  --dsw-alias-button-info-fill: #d97757;",
      "  --dsw-alias-button-info-hover: #c6613f;",
      "  --dsw-alias-button-floating-fill: #ffffff;",
      "  --dsw-alias-button-floating-hover: #ffffff;",
      "  --dsw-alias-label-primary: #141413;",
      "  --dsw-alias-label-primary-bluish: #141413;",
      "  --dsw-alias-label-secondary: #6e6a60;",
      "  --dsw-alias-label-tertiary: #8f8a7e;",
      "  --dsw-alias-label-caption: #a6a094;",
      "  --dsw-alias-state-business-primary: #d97757;",
      "  --dsw-alias-state-business-tertiary: #e9dfd2;",
      "  --dsw-alias-link: #c6613f;",
      "  --dsw-specific-input-major: #ffffff;",
      "  --dsw-specific-menu: #ffffff;",
      "  --dsw-specific-selector: #fbfbf9;",
      "  --dsw-specific-sidebar-fill: #fbfbf9;",
      "  --dsh-claude-hover-bg: rgba(0, 0, 0, 0.08);",
      "  --dsh-claude-inline-code-bg: rgba(0, 0, 0, 0.05);",
      "  --dsw-alias-interactive-bg-hover: var(--dsh-claude-hover-bg);",
      "  --dsw-shadow-lv2: 0 4px 18px rgba(20, 20, 19, 0.10), 0 1px 3px rgba(20, 20, 19, 0.05);",
      "  --dsw-alias-brand-primary-new-colorprimary-new-color: #d97757;",
      "  /* Carried over from the dark base block so the light palette stays complete",
      "     now that the dark palette is dark-scoped. */",
      "  --dsw-alias-brand-text: #faf9f5;",
      "  --dsw-alias-button-elevated-fill: #242320;",
      "  --dsw-alias-interactive-bg-active: rgba(217, 119, 87, 0.30);",
      "  --dsw-alias-interactive-bg-hover-solid: #2e2c29;",
      "  /* User message bubbles: the host's light bubble token is deepseek-50 (blue);",
      "     use the skin's button-hover gray instead. */",
      "  --dsw-specific-bubble: var(--dsh-claude-hover-bg);",
      "  /* Markdown surfaces, measured off Claude: a white code block, a neutral-gray",
      "     inline-code chip, and blue links. The chip colour is the same gray the",
      "     components hover with, so the two read as one material. */",
      "  --dsw-alias-markdown-code-block: #ffffff;",
      "  --dsw-alias-markdown-code-block-banner: #ffffff;",
      "  --dsh-claude-inline-code-fg: #943333;",
      "  --dsh-claude-link: #184f95;",
      "  --dsh-claude-link-underline: rgba(24, 79, 149, 0.6);",
      "}",
      "",
      "body[data-dsh-claude-style]:not([data-ds-dark-theme]) {",
      "  color: #141413;",
      "  background-color: #fcfcfb !important;",
      "}",
      "",
      "html:has(body[data-dsh-claude-style]:not([data-ds-dark-theme])),",
      "body[data-dsh-claude-style]:not([data-ds-dark-theme]) #root {",
      "  background-color: #fcfcfb !important;",
      "}",
      "",
      "body[data-dsh-claude-style]:not([data-ds-dark-theme]) :is([data-pane=\"sidebar\"], [class*=\"sidebarCol\"], .dshDesktopSidebarSurface) {",
      "  --dsw-specific-sidebar-fill: #fbfbf9 !important;",
      "  background: #fbfbf9 !important;",
      "  border-right: 1px solid #e8e6dc !important;",
      "}",
      "",
      "body[data-dsh-claude-style]:not([data-ds-dark-theme]) :is([data-pane=\"conversation\"], [class*=\"centerCol\"]) {",
      "  background: #fcfcfb !important;",
      "}",
      "",
      "body[data-dsh-claude-style]:not([data-ds-dark-theme]) a {",
      "  color: #c6613f;",
      "}",
      "",
      "body[data-dsh-claude-style]:not([data-ds-dark-theme]) a:hover {",
      "  color: #a94f2f;",
      "}",
      "",
      "body[data-dsh-claude-style]:not([data-ds-dark-theme]) button[class*=\"_brand\"],",
      "body[data-dsh-claude-style]:not([data-ds-dark-theme]) button[class*=\"_primary\"],",
      "body[data-dsh-claude-style]:not([data-ds-dark-theme]) [data-slot=\"sidebar.settings\"] > :is(button, [role=\"button\"]) {",
      "  background: #d97757;",
      "  color: #ffffff;",
      "}",
      "",
      "body[data-dsh-claude-style]:not([data-ds-dark-theme]) button[class*=\"_brand\"]:hover,",
      "body[data-dsh-claude-style]:not([data-ds-dark-theme]) button[class*=\"_primary\"]:hover,",
      "body[data-dsh-claude-style]:not([data-ds-dark-theme]) [data-slot=\"sidebar.settings\"] > :is(button, [role=\"button\"]):hover {",
      "  background: #c6613f;",
      "}",
      "",
      "body[data-dsh-claude-style]:not([data-ds-dark-theme]) blockquote {",
      "  color: #6e6a60;",
      "  border-left-color: var(--dsw-alias-label-caption);",
      "  background: rgba(20, 20, 19, 0.04);",
      "}",
      "",
      "body[data-dsh-claude-style]:not([data-ds-dark-theme]) pre {",
      "  border-color: #e8e6dc;",
      "}",
      "",
      "",
      "body[data-dsh-claude-style]:not([data-ds-dark-theme]) * {",
      "  scrollbar-color: rgba(208, 205, 193, 0.9) transparent;",
      "}",
      "",
      "body[data-dsh-claude-style]:not([data-ds-dark-theme]) ::-webkit-scrollbar-thumb {",
      "  background: rgba(208, 205, 193, 0.9);",
      "}",
      "",
      "body[data-dsh-claude-style]:not([data-ds-dark-theme]) ::-webkit-scrollbar-thumb:hover {",
      "  background: rgba(143, 138, 126, 0.8);",
      "}",
      "",
      "/* --- 2.2 Typography & Markdown Editorial --- */",
      "/* ---------- webfonts ---------- */",
      "/* The code font ships inside the plugin package and the host half serves it",
      "   under /dsh-claude-style/fonts/, so 'JetBrains Mono' resolves even on systems",
      "   that never installed it. @font-face cannot hang off the skin root — it is a",
      "   global registration — but the family is only referenced by the skin's own",
      "   font stacks, so nothing else on the page picks it up. When the route is",
      "   missing (host half unavailable) the fetch 404s and the stack's system",
      "   fallbacks take over exactly as before. */",
      "@font-face {",
      "  font-family: 'JetBrains Mono';",
      "  src: url('/dsh-claude-style/fonts/JetBrainsMonoVariable.ttf') format('truetype-variations');",
      "  font-weight: 100 800;",
      "  font-style: normal;",
      "  font-display: swap;",
      "}",
      "",
      "@font-face {",
      "  font-family: 'JetBrains Mono';",
      "  src: url('/dsh-claude-style/fonts/JetBrainsMonoItalicVariable.ttf') format('truetype-variations');",
      "  font-weight: 100 800;",
      "  font-style: italic;",
      "  font-display: swap;",
      "}",
      "",
      "/* The Anthropic text faces are NOT in the npm package (they remain Anthropic's",
      "   property), so these registrations resolve only when the user has dropped the",
      "   files into the plugin's fonts/ directory; otherwise the request 404s and the",
      "   stacks fall back to a system-installed copy. Both files are static Regular",
      "   cuts — a single 400 declaration covers them and the browser synthesizes the",
      "   heavier weights, exactly as it does for a system-installed copy. */",
      "@font-face {",
      "  font-family: 'Anthropic Sans Web Text';",
      "  src: url('/dsh-claude-style/fonts/AnthropicSansWebText.ttf') format('truetype');",
      "  font-weight: 400;",
      "  font-style: normal;",
      "  font-display: swap;",
      "}",
      "",
      "@font-face {",
      "  font-family: 'Anthropic Serif Web Text';",
      "  src: url('/dsh-claude-style/fonts/AnthropicSerifWebText.ttf') format('truetype');",
      "  font-weight: 400;",
      "  font-style: normal;",
      "  font-display: swap;",
      "}",
      "",
      "/* The one vendor typeface the skin borrows: a Gemini row's name is set in",
      "   Google Sans Flex, so the row reads as Google's model rather than as one more",
      "   Claude-labelled entry — the row already carries the vendor's mark, and the",
      "   label is the only string in the picker that names a model instead of the",
      "   shell. It ships in the package as a Latin-only subset (standard weight,",
      "   upright, kerned; ~9 KB from a 4.2 MB six-axis variable font) built by",
      "   scripts/slim-google-sans.py under SIL OFL 1.1 — fonts/OFL-GoogleSansFlex.txt.",
      "   Latin-only is the point: characters outside the subset fall through to the",
      "   stack in --dsw-font-brand-gemini, which is why this is a static 400 cut. */",
      "@font-face {",
      "  font-family: 'Google Sans Flex Picker';",
      "  src: url('/dsh-claude-style/fonts/GoogleSansFlexPicker.woff2') format('woff2');",
      "  font-weight: 400;",
      "  font-style: normal;",
      "  font-display: swap;",
      "}",
      "",
      "/* ---------- typography: serif display + sans UI + mono code ---------- */",
      "body[data-dsh-claude-style] {",
      "  font-family: var(--dsw-font-family);",
      "  color: #faf9f5;",
      "  background-color: #141413;",
      "}",
      "",
      "body[data-dsh-claude-style] :is(h1, h2, h3, h4, [class*=\"headline\"], [class*=\"title\"]) {",
      "  font-family: var(--dsw-font-serif);",
      "  font-weight: 500;",
      "  letter-spacing: -0.01em;",
      "  line-height: 1.25;",
      "}",
      "",
      "/* display headings sit at 500; the new-conversation headline drops one step",
      "   further to 400, and both keep the tighter display tracking */",
      "body[data-dsh-claude-style] :is(h1, [class*=\"headline\"]) {",
      "  font-weight: 500;",
      "  letter-spacing: -0.015em;",
      "}",
      "",
      "/* ---------- markdown document prose ---------- */",
      "/* Claude sets conversation prose — body and headings alike — in the serif",
      "   face and lets Chinese fall through to a sans CJK; the serif display rule",
      "   above stays for UI headlines. */",
      "body[data-dsh-claude-style] [class*=\"markdown\"] {",
      "  font-family: var(--dsw-font-prose);",
      "  line-height: calc(23px + var(--dsh-content-font-delta, 0px));",
      "}",
      "",
      "/* Claude keeps paragraph rhythm tight: 12px between blocks, not the host’s",
      "   16px. First/last-child zeroing stays with the host’s !important rules. */",
      "body[data-dsh-claude-style] [class*=\"markdown\"] p {",
      "  margin: 12px 0;",
      "}",
      "",
      "/* The host gives its markdown elements their own `font:` shorthand, so the",
      "   family has to be re-stated wherever those shorthands land. The heading",
      "   shorthand is re-asserted too, so the host's weight, size and line-height",
      "   survive the serif display rule above. */",
      "body[data-dsh-claude-style] [class*=\"markdown\"] h1 { font: var(--dsw-font-markdown-h1); font-family: var(--dsw-font-prose); }",
      "body[data-dsh-claude-style] [class*=\"markdown\"] h2 { font: var(--dsw-font-markdown-h2); font-family: var(--dsw-font-prose); }",
      "body[data-dsh-claude-style] [class*=\"markdown\"] h3 { font: var(--dsw-font-markdown-h3); font-family: var(--dsw-font-prose); }",
      "body[data-dsh-claude-style] [class*=\"markdown\"] h4 { font: var(--dsw-font-markdown-h4); font-family: var(--dsw-font-prose); }",
      "",
      "body[data-dsh-claude-style] [class*=\"markdown\"] :is(th, td) {",
      "  font-family: var(--dsw-font-prose);",
      "  /* One type step up from the host's secondary table size (13px → 14px),",
      "     not a literal +1px. */",
      "  font-size: var(--dsh-content-font-size, 14px);",
      "}",
      "",
      "body[data-dsh-claude-style] [class*=\"tableScroll\"] thead th,",
      "body[data-dsh-claude-style] [class*=\"tableScroll\"] thead td {",
      "  background: #f0f0ef !important;",
      "}",
      "",
      "body[data-dsh-claude-style][data-ds-dark-theme] [class*=\"tableScroll\"] thead th,",
      "body[data-dsh-claude-style][data-ds-dark-theme] [class*=\"tableScroll\"] thead td {",
      "  background: #242320 !important;",
      "}",
      "",
      "/* Table frame: same 0.5px line the host uses for row separators, rounded",
      "   like the code block. The scroll container already clips its content. */",
      "body[data-dsh-claude-style] [class*=\"tableScroll\"] {",
      "  border: 0.5px solid var(--dsw-alias-border-l2);",
      "  border-radius: 12px;",
      "  padding-left: 0 !important;",
      "  padding-right: 0 !important;",
      "  background-clip: padding-box;",
      "  /* Narrow tables stretch to the prose content block; wide tables keep",
      "     their natural max-content width and scroll inside this wrapper. */",
      "  width: 100% !important;",
      "  max-width: var(--dsh-chat-content-width, 100%) !important;",
      "  margin-left: auto !important;",
      "  margin-right: auto !important;",
      "}",
      "",
      "body[data-dsh-claude-style] [class*=\"tableScroll\"] table {",
      "  margin-left: 0 !important;",
      "  margin-right: 0 !important;",
      "  padding-left: 0 !important;",
      "  padding-right: 0 !important;",
      "  border-spacing: 0 !important;",
      "  border-collapse: collapse !important;",
      "  width: max-content !important;",
      "  min-width: 100% !important;",
      "  max-width: max-content !important;",
      "}",
      "",
      "/* Every first/last cell, whatever element the renderer used (th or td). */",
      "body[data-dsh-claude-style] [class*=\"tableScroll\"] tr > :first-child {",
      "  padding-left: 16px !important;",
      "}",
      "",
      "body[data-dsh-claude-style] [class*=\"tableScroll\"] tr > :last-child {",
      "  padding-right: 16px !important;",
      "}",
      "",
      "/* Heading rhythm. The host gives every heading a 32px top margin, which stacks",
      "   on the previous heading's 16px bottom margin: two consecutive headings open",
      "   ~36px of air where Claude keeps ~12px, and in the sample document that alone",
      "   pushed the last list past the viewport. A heading that directly follows",
      "   another tightens further, so a run of headings reads as one block. */",
      "body[data-dsh-claude-style] [class*=\"markdown\"] :is(h1, h2, h3) {",
      "  margin-top: 24px;",
      "  margin-bottom: 12px;",
      "}",
      "",
      "body[data-dsh-claude-style] [class*=\"markdown\"] :is(h1, h2, h3) + :is(h1, h2, h3) {",
      "  margin-top: 8px;",
      "}",
      "",
      "body[data-dsh-claude-style] [class*=\"markdown\"] :is(h4, h5, h6) {",
      "  margin-top: 16px;",
      "  margin-bottom: 8px;",
      "}",
      "",
      "body[data-dsh-claude-style] :is(pre, code, kbd, samp, [class*=\"mono\"], [class*=\"codeBlock\"], [class*=\"CodeBlock\"]) {",
      "  font-family: var(--dsw-font-code);",
      "}",
      "",
      "/* editorial captions */",
      "body[data-dsh-claude-style] :is([class*=\"caption\"], [class*=\"sectionLabel\"]) {",
      "  font-size: 12px;",
      "  font-weight: 500;",
      "}",
      "",
      "/* ---------- editorial markdown ---------- */",
      "/* Claude's quote keeps the prose face but stands upright on a neutral bar and",
      "   wash; the warm accent stays reserved for controls. Links, inline-code chips",
      "   and file mentions keep their own material inside a quote — the quote is a",
      "   container, not a link, so it never borrows the link colour. */",
      "body[data-dsh-claude-style] blockquote {",
      "  font-family: var(--dsw-font-prose);",
      "  font-style: normal;",
      "  color: #b0aea5;",
      "  border-left: 2px solid var(--dsw-alias-label-caption);",
      "  background: rgba(250, 249, 245, 0.06);",
      "  border-radius: 0 8px 8px 0;",
      "  padding: 0.6em 1em;",
      "}",
      "",
      "/* The fill rides the host's --dsw-alias-markdown-code-block token — the host",
      "   pins `pre.shiki` with !important, so a `background` here would never apply.",
      "   The frame lives on the wrapper so the language banner and the code share",
      "   one rounded outline, like Claude's code block. */",
      "body[data-dsh-claude-style] .md-code-block {",
      "  border: 1px solid var(--dsw-alias-border-l1);",
      "  border-radius: 12px;",
      "}",
      "",
      "/* Code blocks keep the same outer rhythm as body paragraphs: 12px between",
      "   blocks and the 23px + delta prose line box. The host ships 16px/19px,",
      "   so override both the wrapper margin and the pre line-height. */",
      "body[data-dsh-claude-style] .md-code-block {",
      "  margin: 12px 0;",
      "}",
      "",
      "body[data-dsh-claude-style] .md-code-block pre,",
      "body[data-dsh-claude-style] .md-code-block pre code {",
      "  line-height: calc(23px + var(--dsh-content-font-delta, 0px)) !important;",
      "  font-weight: 500 !important;",
      "}",
      "",
      "/* Code block type: one pixel below the surrounding body copy; the inner",
      "   <code> inherits from <pre> rather than compounding the calc(). */",
      "body[data-dsh-claude-style] pre {",
      "  font-size: calc(1em - 1px) !important;",
      "  font-weight: 500 !important;",
      "}",
      "",
      "body[data-dsh-claude-style] pre code {",
      "  font-size: inherit !important;",
      "  font-weight: 500 !important;",
      "}",
      "",
      "/* Claude's inline-code chip: warm red on the same neutral gray the components",
      "   hover with — both resolve per theme from the palette blocks. The chip hugs",
      "   its glyphs: the host makes it an inline-flex box that inherits the prose line",
      "   box (23px for a 15px code size), which left ~5px of empty wash above and",
      "   below the text. line-height 1.2 collapses that box onto the glyphs (27px →",
      "   22px) and leaves the 1px padding as the visible inset; lower values start",
      "   clipping descenders. */",
      "body[data-dsh-claude-style] code:not(pre code) {",
      "  font-family: var(--dsw-font-code);",
      "  background: var(--dsh-claude-inline-code-bg);",
      "  color: var(--dsh-claude-inline-code-fg);",
      "  border: 1px solid var(--dsw-alias-border-l1);",
      "  border-radius: 4px;",
      "  padding: 1px;",
      "  font-size: calc(1em - 1px) !important;",
      "  line-height: 1.2;",
      "}",
      "",
      "/* Claude's links: blue, underlined at rest, and without the host's",
      "   link-category glyph. */",
      "body[data-dsh-claude-style] [class*=\"linkIcon\"] {",
      "  display: none;",
      "}",
      "",
      "/* Inline file mentions (and URL-promoted inline code) are links, not code: the",
      "   host resolves a file path inside an inline code span to a button and paints",
      "   it with its own link alias. This rule has to name them because the generic",
      "   inline-code chip above is more specific than the host's own class, so without",
      "   it a path like `CHANGELOG.md` kept the chip's warm red while real links were",
      "   blue. The class is hashed (`_fileMention_kcgor_304`), hence the longest",
      "   stable fragment. The chip itself is untouched — the same wash and hairline as",
      "   any other inline code — only the text takes the link colour and the link's",
      "   own underline: solid in the link tone at rest, solid and fully opaque on",
      "   hover, at the same thickness and offset, exactly how the skin treats an",
      "   anchor. The hover rule therefore touches the colour only: the",
      "   `text-decoration` shorthand would reset `text-decoration-thickness` to",
      "   `auto` and thin the underline mid-hover. */",
      "body[data-dsh-claude-style] :is(code:not(pre code) > [class*=\"_fileMention\"], code:not(pre code) > a) {",
      "  color: var(--dsh-claude-link);",
      "  font-weight: 500;",
      "  text-decoration: underline;",
      "  text-decoration-color: var(--dsh-claude-link-underline);",
      "  text-decoration-thickness: 1.5px;",
      "  text-underline-offset: 2px;",
      "}",
      "",
      "body[data-dsh-claude-style] :is(code:not(pre code) > [class*=\"_fileMention\"], code:not(pre code) > a):hover,",
      "body[data-dsh-claude-style] :is(code:not(pre code) > [class*=\"_fileMention\"], code:not(pre code) > a):focus-visible {",
      "  text-decoration-color: var(--dsh-claude-link);",
      "}",
      "",
      "body[data-dsh-claude-style] [class*=\"markdown\"] :is(a, a:focus) {",
      "  color: var(--dsh-claude-link);",
      "  text-decoration: underline;",
      "  text-decoration-color: var(--dsh-claude-link-underline);",
      "  text-decoration-thickness: 1.5px;",
      "  text-underline-offset: 2px;",
      "}",
      "",
      "body[data-dsh-claude-style] [class*=\"markdown\"] :is(a:hover, a:focus-visible) {",
      "  text-decoration-color: var(--dsh-claude-link);",
      "}",
      "",
      "body[data-dsh-claude-style] hr {",
      "  border: none;",
      "  border-top: 1px solid rgba(20, 20, 19, 0.14);",
      "  margin: 1.6em 0;",
      "}",
      "",
      "",
      "/* tabs: subtle editorial weighting */",
      "body[data-dsh-claude-style] [role=\"tab\"] {",
      "  font-weight: 500;",
      "}",
      "",
      "/* technical meta (model selector, triggers) read as mono labels */",
      "body[data-dsh-claude-style] [class*=\"triggerLabel\"],",
      "body[data-dsh-claude-style] [class*=\"selectLabel\"],",
      "body[data-dsh-claude-style] [class*=\"monoLabel\"] {",
      "  font-family: var(--dsw-font-code);",
      "  font-size: 12px;",
      "  letter-spacing: 0;",
      "}",
      "",
      "/* --- 2.3 Host Chrome Restyling (Sidebar, Composer, Buttons) --- */",
      "/* ---------- canvas + hairline structure ---------- */",
      "body[data-dsh-claude-style] :is([data-pane=\"sidebar\"], [class*=\"sidebarCol\"], .dshDesktopSidebarSurface) {",
      "  --dsw-specific-sidebar-fill: #141413 !important;",
      "  background: #141413 !important;",
      "  border-right: 1px solid #242320 !important;",
      "}",
      "",
      "body[data-dsh-claude-style] :is([data-pane=\"conversation\"], [class*=\"centerCol\"]) {",
      "  background: #141413;",
      "}",
      "",
      "/* ---------- clay accent: one emphasis color, disciplined ---------- */",
      "body[data-dsh-claude-style] a {",
      "  color: #e08a6d;",
      "}",
      "",
      "body[data-dsh-claude-style] a:hover {",
      "  color: #f0a488;",
      "}",
      "",
      "body[data-dsh-claude-style] button[class*=\"brand\"] {",
      "  color: #d97757;",
      "}",
      "",
      "/* The baked-in wordmark \"HARNESS\" badge (a pill rect + its letter paths)",
      "   looks crowded next to the whale + wordmark. Hide the badge entirely so",
      "   the brand reads as a clean whale + wordmark on the clay pill. */",
      "body[data-dsh-claude-style] button[class*=\"brand\"] rect[fill=\"currentColor\"],",
      "body[data-dsh-claude-style] button[class*=\"brand\"] path[fill*=\"label-primary-inverted\"] {",
      "  display: none;",
      "}",
      "",
      "/* pill CTAs: send + settings sidebar actions */",
      "body[data-dsh-claude-style] button[class*=\"_brand\"],",
      "body[data-dsh-claude-style] button[class*=\"_primary\"],",
      "body[data-dsh-claude-style] [data-slot=\"sidebar.settings\"] > :is(button, [role=\"button\"]) {",
      "  border-radius: 9999px;",
      "  background: #d97757;",
      "  color: #ffffff;",
      "  font-weight: 500;",
      "}",
      "",
      "body[data-dsh-claude-style] button[class*=\"_brand\"]:hover,",
      "body[data-dsh-claude-style] button[class*=\"_primary\"]:hover,",
      "body[data-dsh-claude-style] [data-slot=\"sidebar.settings\"] > :is(button, [role=\"button\"]):hover {",
      "  background: #e08a6d;",
      "}",
      "",
      "/* Brand logo chip: drop the loud clay pill so the mark + wordmark sit on",
      "   the canvas. That pill also carried a 9999px radius, and together with the",
      "   button overflow:hidden its arc clipped the leading edge of the mark — so",
      "   the radius goes as well. Adaptive logo color: espresso on light, ivory",
      "   on dark. */",
      "body[data-dsh-claude-style]:not([data-ds-dark-theme]) button[class*=\"brand\"],",
      "body[data-dsh-claude-style][data-ds-dark-theme] button[class*=\"brand\"] {",
      "  background: transparent !important;",
      "  border: none;",
      "  border-radius: 0;",
      "}",
      "",
      "body[data-dsh-claude-style]:not([data-ds-dark-theme]) button[class*=\"brand\"] {",
      "  color: #141413 !important;",
      "}",
      "",
      "body[data-dsh-claude-style][data-ds-dark-theme] button[class*=\"brand\"] {",
      "  color: #faf9f5 !important;",
      "}",
      "",
      "/* badges: full pill */",
      "body[data-dsh-claude-style] :is([class*=\"badge\"], [class*=\"Badge\"], [class*=\"tag\"], [class*=\"Tag\"]) {",
      "  border-radius: 9999px;",
      "}",
      "",
      "/* ---------- chrome details ---------- */",
      "body[data-dsh-claude-style] * {",
      "  scrollbar-width: thin;",
      "  scrollbar-color: rgba(58, 56, 51, 0.9) transparent;",
      "}",
      "",
      "body[data-dsh-claude-style] ::-webkit-scrollbar {",
      "  width: 8px;",
      "  height: 8px;",
      "}",
      "",
      "body[data-dsh-claude-style] ::-webkit-scrollbar-track {",
      "  background: transparent;",
      "}",
      "",
      "body[data-dsh-claude-style] ::-webkit-scrollbar-thumb {",
      "  background: rgba(58, 56, 51, 0.9);",
      "  border-radius: 9999px;",
      "}",
      "",
      "body[data-dsh-claude-style] ::-webkit-scrollbar-thumb:hover {",
      "  background: rgba(107, 106, 101, 0.9);",
      "}",
      "",
      "/* Text selection: two solid paints, identical on both canvases.",
      "   Focused is white on blue, unfocused is black on gray. It replaces the",
      "   translucent clay wash this skin used before, and it deliberately ignores the",
      "   theme: a selection is a transient user gesture, not a surface, so it does not",
      "   follow the ivory/warm-black palette. Every value is a solid colour and",
      "   !important, because it has to override the colors the host and this skin put",
      "   on the text underneath (markdown links, inline code, syntax tokens) — a",
      "   selection that kept the underlying colour would be illegible on blue.",
      "   The unfocused rule is declared after the focused one and shares its weight,",
      "   so the attribute decides; the focus state itself is mirrored onto the",
      "   document by src/overrides/selection.js. */",
      "body[data-dsh-claude-style] ::selection {",
      "  background-color: #3366d0 !important;",
      "  color: #ffffff !important;",
      "}",
      "",
      "body[data-dsh-claude-style][data-dsh-window-blur] ::selection {",
      "  background-color: #c7c7c6 !important;",
      "  color: #000000 !important;",
      "}",
      "",
      "body[data-dsh-claude-style] :is(button, input, textarea, select, [role=\"button\"], [role=\"tab\"], [role=\"treeitem\"]) {",
      "  outline: none;",
      "}",
      "",
      "/* Keyboard focus ring: neutral, in the input box's own shadow colour",
      "   (espresso #141413 in light); dark inverts to bright ivory — a near-black",
      "   canvas gets a light ring, never a darker one. */",
      "body[data-dsh-claude-style] :is(button, input, textarea, select, [role=\"button\"], [role=\"tab\"], [role=\"treeitem\"]):focus-visible {",
      "  outline: 2px solid rgba(20, 20, 19, 0.45);",
      "  outline-offset: 1px;",
      "}",
      "",
      "body[data-dsh-claude-style][data-ds-dark-theme] :is(button, input, textarea, select, [role=\"button\"], [role=\"tab\"], [role=\"treeitem\"]):focus-visible {",
      "  outline-color: rgba(250, 249, 245, 0.60);",
      "}",
      "",
      "/* ---------- composer dock overlays: stay above the message layer ---------- */",
      "/* Queue, jobs and goal are full-width overlays that can visually extend over",
      "   the transcript. The message cards paint later in the DOM, so give each",
      "   overlay its own stacking layer above the chat content. */",
      "body[data-dsh-claude-style] [data-queue-dock],",
      "body[data-dsh-claude-style] [data-goal-bar],",
      "body[data-dsh-claude-style] [data-slot=\"conversation.input.dock\"] > * {",
      "  position: relative;",
      "  z-index: 100 !important;",
      "}",
      "",
      "body[data-dsh-claude-style] [data-slot=\"conversation.session.header.actions\"] > * {",
      "  position: relative;",
      "  z-index: 100 !important;",
      "}",
      "",
      "/* The shipped queue dock cancels the stack gap AND pulls 3px further, so the",
      "   composer card overlaps its open bottom edge and the card shadow reads as a",
      "   line across the dock. Cancel only the gap: the dock bottom then lands on",
      "   the card border and the two tiers share one seam. */",
      "body[data-dsh-claude-style] [data-queue-dock] {",
      "  margin-bottom: calc(0px - var(--dsh-composer-stack-gap, 6px)) !important;",
      "}",
      "",
      "/* ---------- Claude Code layout: hero brand mark ---------- */",
      "/* The new-conversation hero ships the DeepSeek fish; swap it for the selected",
      "   brand mark. Every child of the hitbox is hidden — the mark can sit behind a",
      "   slot wrapper, not always a bare svg — and the mark is painted on the hitbox,",
      "   so React keeps owning its own node. The hero keeps the clay fill in both",
      "   brands, matching the shipped accent treatment. */",
      "body[data-dsh-claude-style]:is([data-dsh-claude-brand=\"claude\"], [data-dsh-claude-brand=\"anthropic\"]) [class*=\"fishHitbox\"] > * {",
      "  display: none !important;",
      "}",
      "",
      "body[data-dsh-claude-style]:is([data-dsh-claude-brand=\"claude\"], [data-dsh-claude-brand=\"anthropic\"]) [class*=\"fishHitbox\"] svg {",
      "  display: none !important;",
      "}",
      "",
      "body[data-dsh-claude-style]:is([data-dsh-claude-brand=\"claude\"], [data-dsh-claude-brand=\"anthropic\"]) [class*=\"fishHitbox\"]::before {",
      "  content: \"\";",
      "  flex: none;",
      "  width: 42.5px;",
      "  height: 42.5px;",
      "  background-repeat: no-repeat;",
      "  background-position: center;",
      "  background-size: contain;",
      "}",
      "",
      "body[data-dsh-claude-style][data-dsh-claude-brand=\"claude\"] [class*=\"fishHitbox\"]::before {",
      "  background-image: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20148.09%20148.18'%3E%3Cg%20transform%3D'translate(-75.96%2C-223.53)'%3E%3Cpath%20fill%3D'%23D97757'%20d%3D'm%20105.01%2C322.07%2029.14%2C-16.35%200.49%2C-1.42%20-0.49%2C-0.79%20h%20-1.42%20l%20-4.87%2C-0.3%20-16.65%2C-0.45%20-14.44%2C-0.6%20-13.99%2C-0.75%20-3.52%2C-0.75%20-3.3%2C-4.35%200.34%2C-2.17%202.96%2C-1.99%204.24%2C0.37%209.37%2C0.64%2014.06%2C0.97%2010.2%2C0.6%2015.11%2C1.57%20h%202.4%20l%200.34%2C-0.97%20-0.82%2C-0.6%20-0.64%2C-0.6%20-14.55%2C-9.86%20-15.75%2C-10.42%20-8.25%2C-6%20-4.46%2C-3.04%20-2.25%2C-2.85%20-0.97%2C-6.22%204.05%2C-4.46%205.44%2C0.37%201.39%2C0.37%205.51%2C4.24%2011.77%2C9.11%2015.37%2C11.32%202.25%2C1.87%200.9%2C-0.64%200.11%2C-0.45%20-1.01%2C-1.69%20-8.36%2C-15.11%20-8.92%2C-15.37%20-3.97%2C-6.37%20-1.05%2C-3.82%20c%20-0.37%2C-1.57%20-0.64%2C-2.89%20-0.64%2C-4.5%20l%204.61%2C-6.26%202.55%2C-0.82%206.15%2C0.82%202.59%2C2.25%203.82%2C8.74%206.19%2C13.76%209.6%2C18.71%202.81%2C5.55%201.5%2C5.14%200.56%2C1.57%20h%200.97%20v%20-0.9%20l%200.79%2C-10.54%201.46%2C-12.94%201.42%2C-16.65%200.49%2C-4.69%202.32%2C-5.62%204.61%2C-3.04%203.6%2C1.72%202.96%2C4.24%20-0.41%2C2.74%20-1.76%2C11.44%20-3.45%2C17.92%20-2.25%2C12%20h%201.31%20l%201.5%2C-1.5%206.07%2C-8.06%2010.2%2C-12.75%204.5%2C-5.06%205.25%2C-5.59%203.37%2C-2.66%20h%206.37%20l%204.69%2C6.97%20-2.1%2C7.2%20-6.56%2C8.32%20-5.44%2C7.05%20-7.8%2C10.5%20-4.87%2C8.4%200.45%2C0.67%201.16%2C-0.11%2017.62%2C-3.75%209.52%2C-1.72%2011.36%2C-1.95%205.14%2C2.4%200.56%2C2.44%20-2.02%2C4.99%20-12.15%2C3%20-14.25%2C2.85%20-21.22%2C5.02%20-0.26%2C0.19%200.3%2C0.37%209.56%2C0.9%204.09%2C0.22%20h%2010.01%20l%2018.64%2C1.39%204.87%2C3.22%202.92%2C3.94%20-0.49%2C3%20-7.5%2C3.82%20-10.12%2C-2.4%20-23.62%2C-5.62%20-8.1%2C-2.02%20h%20-1.12%20v%200.67%20l%206.75%2C6.6%2012.37%2C11.17%2015.49%2C14.4%200.79%2C3.56%20-1.99%2C2.81%20-2.1%2C-0.3%20-13.61%2C-10.24%20-5.25%2C-4.61%20-11.89%2C-10.01%20h%20-0.79%20v%201.05%20l%202.74%2C4.01%2014.47%2C21.75%200.75%2C6.67%20-1.05%2C2.17%20-3.75%2C1.31%20-4.12%2C-0.75%20-8.47%2C-11.89%20-8.74%2C-13.39%20-7.05%2C-12%20-0.86%2C0.49%20-4.16%2C44.81%20-1.95%2C2.29%20-4.5%2C1.72%20-3.75%2C-2.85%20-1.99%2C-4.61%201.99%2C-9.11%202.4%2C-11.89%201.95%2C-9.45%201.76%2C-11.74%201.05%2C-3.9%20-0.07%2C-0.26%20-0.86%2C0.11%20-8.85%2C12.15%20-13.46%2C18.19%20-10.65%2C11.4%20-2.55%2C1.01%20-4.42%2C-2.29%200.41%2C-4.09%202.47%2C-3.64%2014.74%2C-18.75%208.89%2C-11.62%205.74%2C-6.71%20-0.04%2C-0.97%20h%20-0.34%20l%20-39.15%2C25.42%20-6.97%2C0.9%20-3%2C-2.81%200.37%2C-4.61%201.42%2C-1.5%2011.77%2C-8.1%20-0.04%2C0.04%20z'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\");",
      "}",
      "",
      "body[data-dsh-claude-style][data-dsh-claude-brand=\"anthropic\"] [class*=\"fishHitbox\"]::before {",
      "  background-image: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2024%2024'%3E%3Cpath%20d%3D'M4.709%2015.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0%2011.784l.055-.352.48-.321.686.06%201.52.103%202.278.158%201.652.097%202.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686%201.908%201.476%202.491%201.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97%202.97%200%2001-.104-.729L6.283.134%206.696%200l.996.134.42.364.62%201.414%201.002%202.229%201.555%203.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286%201.851-.559%202.903-.364%201.942h.212l.243-.242.985-1.306%201.652-2.064.73-.82.85-.904.547-.431h1.033l.76%201.129-.34%201.166-1.064%201.347-.881%201.142-1.264%201.7-.79%201.36.073.11.188-.02%202.856-.606%201.543-.28%201.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061%201.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093%201.068%202.006%201.81%202.509%202.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649%202.345%203.521.122%201.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674%207.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434%201.967-2.18%202.945-1.726%201.845-.414.164-.717-.37.067-.662.401-.589%202.388-3.036%201.44-1.882.93-1.086-.006-.158h-.055L4.132%2018.56l-1.13.146-.487-.456.061-.746.231-.243%201.908-1.312-.006.006z'%20fill%3D'%23D97757'%2F%3E%3C%2Fsvg%3E\");",
      "}",
      "",
      "/* The preview badge has no Claude Code counterpart. */",
      "body[data-dsh-claude-style] [class*=\"previewBadge\"] {",
      "  display: none !important;",
      "}",
      "",
      "/* Headline: the shipped 26px/32px editorial display, then 15% back off that",
      "   (52 -> 44.2) and one weight step below the display rule. */",
      "body[data-dsh-claude-style] [class*=\"headline\"]:has([class*=\"fishHitbox\"]) {",
      "  font-size: 44.2px;",
      "  line-height: 54.4px;",
      "  font-weight: 400;",
      "}",
      "",
      "/* ---------- Claude Code layout: composer input + buttons ---------- */",
      "/* @composer-gate */",
      "/* Everything from here down is the \"Composer restyle\" preference's territory:",
      "   the build stamps `[data-dsh-claude-composer-active]` onto every rule below",
      "   this marker, and the skin sets that attribute on <body> only while the page",
      "   on screen is a surface the preference covers. Above the marker sits the hero",
      "   brand mark and headline, which belong to the brand preference instead — a",
      "   composer scope of \"conversation only\" must not revert them. */",
      "/* The composer card is the input box: one step up in type size, pure white",
      "   so it separates from the canvas, and an outline 4px tighter than the",
      "   shipped 22px. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card] {",
      "  font-size: 15px;",
      "  border-radius: 18px;",
      "  border: 1px solid var(--dsw-alias-border-l1);",
      "  position: relative;",
      "  z-index: 2;",
      "  gap: 8px !important;",
      "  padding-bottom: 2px !important;",
      "  min-height: 0 !important;",
      "  height: auto !important;",
      "  transition: border-color 0.12s ease, box-shadow 0.12s ease;",
      "}",
      "",
      "/* Input height, by composer variant. The hero (new conversation) keeps the",
      "   tall 86px field it was tuned to. An active conversation instead hugs its",
      "   draft: the shipped 36px floor holds exactly one line, the contenteditable",
      "   then grows a line at a time, and .scroll caps the box at",
      "   --dsh-composer-text-max-height before it starts scrolling. Both hooks are",
      "   ancestors of the field, so :is() also keeps the tall field through the",
      "   settling frame, while an active composer matches neither. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] :is([class*=\"composerHero\"], [data-phase=\"hero\"]) [data-composer-input] {",
      "  min-height: 86px !important;",
      "}",
      "",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-input] {",
      "  min-height: 36px !important;",
      "  height: auto !important;",
      "}",
      "",
      "/* The hero's hint, for the times the skin has to supply it.",
      "   The host renders its own placeholder only while the draft is empty AND",
      "   nothing is attached (`draft === \"\" && attachments.length === 0`), so pasting",
      "   an image with no text removes it — and the skin's synthetic stand-in carries",
      "   none of the host's classes, so without this rule it fell back to a static",
      "   block in the card's own ink colour, below the field instead of on it. The",
      "   hero keeps the host's field metrics (the skin only raises its min-height), so",
      "   the stand-in takes the host's own inset — 4px down, 14px in — rather than the",
      "   inline variant's zero-origin line box. The host's `.grow` is already",
      "   `position: relative`, so the offsets resolve against the field. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"hero\"] [data-dsh-synthetic-placeholder] {",
      "  position: absolute !important;",
      "  top: 4px !important;",
      "  left: 14px !important;",
      "  right: 8px !important;",
      "  color: var(--dsw-alias-label-caption) !important;",
      "  white-space: nowrap !important;",
      "  text-overflow: ellipsis !important;",
      "  overflow: hidden !important;",
      "  pointer-events: none !important;",
      "  user-select: none !important;",
      "}",
      "",
      "/* Tight bottom padding below the button controls row. The selector must",
      "   be `[class*=\"_row\"]`: a bare `[class*=\"row\"]` substring-matches the",
      "   shipped input growth wrapper `.p_FcLG_grow` (\"grow\" contains \"row\"),",
      "   which pins the composer field to the toolbar-row metrics. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card] [class*=\"_row\"] {",
      "  padding-bottom: 2px !important;",
      "}",
      "",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active]:not([data-ds-dark-theme]) [data-composer-card] {",
      "  background: #ffffff;",
      "  box-shadow: 0 4px 12px rgba(20, 20, 19, 0.04), 0 1px 3px rgba(20, 20, 19, 0.02), 0 0 0 6px var(--dsw-alias-bg-base), 0 0 16px 10px var(--dsw-alias-bg-base), 0 0 48px 16px var(--dsw-alias-bg-base);",
      "}",
      "",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active][data-ds-dark-theme] [data-composer-card] {",
      "  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.30), 0 1px 3px rgba(0, 0, 0, 0.15), 0 0 0 6px var(--dsw-alias-bg-base), 0 0 16px 10px var(--dsw-alias-bg-base), 0 0 48px 16px var(--dsw-alias-bg-base);",
      "}",
      "",
      "/* Focus: the shipped field has no focus face at all — only the caret moves —",
      "   so this adds one, in the input box's own shadow colour rather than the",
      "   accent: the hairline takes the drop-shadow tint (espresso in light), a 1px",
      "   halo in the same tone hugs the edge, and the drop shadow deepens. Dark sits",
      "   on a near-black canvas, where black-on-black carries no cue at all — there",
      "   the focus face inverts to a BRIGHT ivory rim and halo, so the field visibly",
      "   lights up instead of deepening. The tray below continues the same hairline,",
      "   so its three edges follow whenever the card above it holds focus. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active]:not([data-ds-dark-theme]) [data-composer-card]:focus-within {",
      "  border-color: rgba(20, 20, 19, 0.18);",
      "  box-shadow: 0 0 0 1px rgba(20, 20, 19, 0.065), 0 6px 18px rgba(20, 20, 19, 0.03), 0 2px 6px rgba(20, 20, 19, 0.015), 0 0 0 6px var(--dsw-alias-bg-base), 0 0 16px 10px var(--dsw-alias-bg-base), 0 0 48px 16px var(--dsw-alias-bg-base);",
      "}",
      "",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active][data-ds-dark-theme] [data-composer-card]:focus-within {",
      "  border-color: rgba(250, 249, 245, 0.22);",
      "  box-shadow: 0 0 0 1px rgba(250, 249, 245, 0.09), 0 6px 24px rgba(0, 0, 0, 0.22), 0 2px 8px rgba(0, 0, 0, 0.11), 0 0 0 6px var(--dsw-alias-bg-base), 0 0 16px 10px var(--dsw-alias-bg-base), 0 0 48px 16px var(--dsw-alias-bg-base);",
      "}",
      "",
      "/* New-conversation composer: keep the pure card fill and the real drop",
      "   shadow; remove only the background-colored (--dsw-alias-bg-base) halo",
      "   layers, which are what read as a glow/shadow around the home dialog. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active]:not([data-ds-dark-theme]) [class*=\"composerStack\"][data-composer-variant=\"hero\"] [data-composer-card],",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active]:not([data-ds-dark-theme]) :is([class*=\"composerHero\"], [data-phase=\"hero\"]) [data-composer-card] {",
      "  box-shadow: 0 4px 12px rgba(20, 20, 19, 0.04), 0 1px 3px rgba(20, 20, 19, 0.02) !important;",
      "}",
      "",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active][data-ds-dark-theme] [class*=\"composerStack\"][data-composer-variant=\"hero\"] [data-composer-card],",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active][data-ds-dark-theme] :is([class*=\"composerHero\"], [data-phase=\"hero\"]) [data-composer-card] {",
      "  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.30), 0 1px 3px rgba(0, 0, 0, 0.15) !important;",
      "}",
      "",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active]:not([data-ds-dark-theme]) [class*=\"composerStack\"][data-composer-variant=\"hero\"] [data-composer-card]:focus-within,",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active]:not([data-ds-dark-theme]) :is([class*=\"composerHero\"], [data-phase=\"hero\"]) [data-composer-card]:focus-within {",
      "  box-shadow: 0 0 0 1px rgba(20, 20, 19, 0.065), 0 6px 18px rgba(20, 20, 19, 0.03), 0 2px 6px rgba(20, 20, 19, 0.015) !important;",
      "}",
      "",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active][data-ds-dark-theme] [class*=\"composerStack\"][data-composer-variant=\"hero\"] [data-composer-card]:focus-within,",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active][data-ds-dark-theme] :is([class*=\"composerHero\"], [data-phase=\"hero\"]) [data-composer-card]:focus-within {",
      "  box-shadow: 0 0 0 1px rgba(250, 249, 245, 0.09), 0 6px 24px rgba(0, 0, 0, 0.22), 0 2px 8px rgba(0, 0, 0, 0.11) !important;",
      "}",
      "",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active]:not([data-ds-dark-theme]) [class*=\"composerStack\"]:has([data-composer-card]:focus-within) > [class*=\"heroWorkspaceRow\"] {",
      "  border-color: rgba(20, 20, 19, 0.18);",
      "}",
      "",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active][data-ds-dark-theme] [class*=\"composerStack\"]:has([data-composer-card]:focus-within) > [class*=\"heroWorkspaceRow\"] {",
      "  border-color: rgba(250, 249, 245, 0.22);",
      "}",
      "",
      "/* The workspace-trigger variant paints its dashed ring through a masked svg",
      "   cut with rx=22; re-cut it so the ring tracks the 18px card. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card]:after {",
      "  border-radius: 18px;",
      "  -webkit-mask: url(\"data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27%3E%3Crect width=%27100%25%27 height=%27100%25%27 fill=%27none%27 rx=%2718%27 ry=%2718%27 stroke=%27black%27 stroke-width=%272%27 stroke-dasharray=%274 4%27/%3E%3C/svg%3E\");",
      "  mask: url(\"data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27%3E%3Crect width=%27100%25%27 height=%27100%25%27 fill=%27none%27 rx=%2718%27 ry=%2718%27 stroke=%27black%27 stroke-width=%272%27 stroke-dasharray=%274 4%27/%3E%3C/svg%3E\");",
      "}",
      "",
      "/* Commands and attach: 7px corners instead of the shipped full circle, no",
      "   resting fill, and a warm plate on hover. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] :is(button[aria-label=\"指令\"], button[aria-label=\"Commands\"], button[aria-label=\"添加附件\"], button[aria-label=\"Add attachment\"]) {",
      "  border-radius: 7px;",
      "}",
      "",
      "/* Send, and the stop/queue/steer labels that replace it while running: the",
      "   shipped 34px circle becomes a 7px rounded rectangle. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] :is(button[aria-label=\"发送消息\"], button[aria-label=\"Send message\"], button[aria-label=\"排队发送\"], button[aria-label=\"Queue message\"], button[aria-label=\"插话发送\"], button[aria-label=\"Steer message\"], button[aria-label=\"停止生成\"], button[aria-label=\"Stop generating\"]) {",
      "  border-radius: 7px;",
      "}",
      "",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active]:not([data-ds-dark-theme]) :is(button[aria-label=\"指令\"], button[aria-label=\"Commands\"], button[aria-label=\"添加附件\"], button[aria-label=\"Add attachment\"]) {",
      "  background: transparent;",
      "}",
      "",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active]:not([data-ds-dark-theme]) :is(button[aria-label=\"指令\"], button[aria-label=\"Commands\"], button[aria-label=\"添加附件\"], button[aria-label=\"Add attachment\"]):hover:not(:disabled) {",
      "  background: #f6f6f4;",
      "}",
      "",
      "/* Model selector: the same type size as the permission segments and the",
      "   same 7px corners; its chevron is dropped while the click target and the",
      "   menu it opens stay exactly as shipped. Its shipped hover token is only a",
      "   ~6% tint, so the hover plate matches the composer tool buttons. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card] [class*=\"trigger\"] {",
      "  font-size: 14px;",
      "  border-radius: 7px;",
      "}",
      "",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active]:not([data-ds-dark-theme]) [data-composer-card] [class*=\"trigger\"]:hover:not(:disabled) {",
      "  background: #f6f6f4;",
      "}",
      "",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card] [class*=\"_chevron\"] {",
      "  display: none !important;",
      "}",
      "",
      "/* ---------- Claude Code layout: composer footer bar ---------- */",
      "/* Reference layout: two-tier integrated tray. The top card is a pure white",
      "   rounded card with drop shadow (z-index: 2). The bottom tray is a seamless",
      "   equal-width tray (z-index: 1) attached directly to the bottom of the card,",
      "   with transparent background (inheriting the canvas tone #fcfcfb),",
      "   left/right/bottom border, and 18px rounded bottom corners. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"][data-composer-variant=\"hero\"] {",
      "  --dsh-claude-bar-h: 96px;",
      "}",
      "",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"][data-composer-variant=\"hero\"] *:has([data-composer-card]) {",
      "  order: 1;",
      "  padding-bottom: 0 !important;",
      "}",
      "",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"][data-composer-variant=\"hero\"] [data-composer-card] {",
      "  gap: 8px !important;",
      "  padding-bottom: 2px !important;",
      "  min-height: 0 !important;",
      "  height: auto !important;",
      "}",
      "",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"][data-composer-variant=\"hero\"] > [class*=\"heroWorkspaceRow\"] {",
      "  order: 2;",
      "  position: relative;",
      "  z-index: 1;",
      "  box-sizing: border-box;",
      "  height: calc(var(--dsh-claude-bar-h) + 18px);",
      "  width: calc(100% - var(--dsh-composer-side-clearance, 0px) - var(--dsh-composer-side-clearance, 0px));",
      "  max-width: var(--dsh-composer-card-max-width, 100%);",
      "  margin: calc(0px - var(--dsh-composer-stack-gap, 6px) - 18px) auto 0;",
      "  padding: 18px 16px 0 16px;",
      "  background: transparent;",
      "  border-left: 1px solid var(--dsw-alias-border-l1);",
      "  border-right: 1px solid var(--dsw-alias-border-l1);",
      "  border-bottom: 1px solid var(--dsw-alias-border-l1);",
      "  border-top: none;",
      "  border-radius: 0 0 18px 18px;",
      "  display: flex;",
      "  align-items: center;",
      "  justify-content: space-between;",
      "  transition: border-color 0.12s ease;",
      "}",
      "",
      "/* Muted typography and 7px corners for footer controls */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"heroWorkspaceRow\"] :is(button, [role=\"button\"]) {",
      "  font-size: 13px;",
      "  color: var(--dsw-alias-label-secondary);",
      "  border-radius: 7px;",
      "}",
      "",
      "/* Hide chevrons in the footer tray for a clean, minimal Claude Code look */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"heroWorkspaceRow\"] :is([class*=\"chevron\"], [class*=\"Chevron\"]) {",
      "  display: none !important;",
      "}",
      "",
      "/* ---------- Claude Code layout: composer send button ---------- */",
      "/* An empty composer keeps the send button in place but drops it to a ghost:",
      "   transparent plate, a hairline in the input box border colour, and the glyph",
      "   in the same colour the model control uses for its effort tier (low/high), so",
      "   it reads as not-ready instead of vanishing. Flat by design (no shadow), and",
      "   border-box keeps the outer 34px so the row does not shift. The stop/queue/",
      "   steer labels are untouched, so a running turn keeps its control even with an",
      "   empty draft. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card]:not([data-has-attachments=\"true\"]):has([data-composer-placeholder]) :is(button[aria-label=\"发送消息\"], button[aria-label=\"Send message\"]) {",
      "  box-sizing: border-box;",
      "  background: transparent;",
      "  color: var(--dsw-alias-label-caption);",
      "  border: 1px solid var(--dsw-alias-border-l2);",
      "  box-shadow: none;",
      "  cursor: default;",
      "}",
      "",
      "/* ---------- In-conversation single-line composer ---------- */",
      "/* In an active conversation, compress composer to a single-line input card,",
      "   render send button as an enter symbol ↵ inside the card on the right,",
      "   and display toolbar controls directly underneath on the canvas. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"],",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"]:focus-within,",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card],",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card]:focus-within {",
      "  background: transparent !important;",
      "  border: none !important;",
      "  /* The canvas wash lives HERE, on the card — the same place the hero card",
      "     carries it — so there is one wash behind every child and nothing can paint",
      "     over anything else. It used to sit on the rail and on the field separately,",
      "     and since the rail is z-index 4 while the field is z-index 2, the rail's",
      "     wash (three layers of the canvas colour) painted across the TOP of the",
      "     field: over the field's own background, which made the two boxes read as",
      "     different colours, and over the draft's first line. */",
      "  box-shadow: 0 0 0 6px var(--dsw-alias-bg-base), 0 0 16px 10px var(--dsw-alias-bg-base), 0 0 48px 16px var(--dsw-alias-bg-base) !important;",
      "  outline: none !important;",
      "  padding: 0 !important;",
      "  gap: 0 !important;",
      "  display: flex !important;",
      "  flex-direction: column !important;",
      "  position: relative !important;",
      "  width: 100% !important;",
      "  max-width: var(--dsh-composer-card-max-width, 100%) !important;",
      "  box-sizing: border-box !important;",
      "  overflow: visible !important;",
      "  height: auto !important;",
      "}",
      "/* Do NOT override the host viewArea flex contract here. In the active",
      "   phase the host uses `flex: 1 0 auto; min-height: auto` so the viewArea",
      "   is content-sized and the sticky composerSeat pins to the scrollport",
      "   bottom. An earlier override (`flex: 1 1 auto; min-height: 0`) let the",
      "   viewArea shrink to exactly viewport-minus-composer, which put the",
      "   composer seat near the TOP of the scroll content — sticky bottom:0",
      "   cannot pull an element down past its normal position, so the composer",
      "   appeared mid-scroll and never followed message growth. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) {",
      "  flex: 0 0 auto !important;",
      "  overflow: visible !important;",
      "  height: auto !important;",
      "  max-height: none !important;",
      "}",
      "/* Message body clearance: 40px placeholder space at the end of the",
      "   conversation view so the composer's upward shadow does not obscure",
      "   the action buttons (copy, retry, etc.) on the last turn. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"viewArea\"] {",
      "  padding-bottom: 40px !important;",
      "}",
      "/* The composer is a chat-view affordance. The host keeps the seat mounted on",
      "   every conversation tab (轨迹 / 上下文 even reserve room for it), but it",
      "   should only show on the chat tab — drop the whole bottom area otherwise.",
      "   Hiding the seat also zeroes the host's --dsh-composer-height, so the",
      "   trajectory ledger's bottom clearance collapses with it. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active][data-dsh-claude-composer-hidden] [data-composer-seat] {",
      "  display: none !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"]:not([data-has-attachments=\"true\"]) [class*=\"rail\"]:not([class*=\"trailing\"]),",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card]:not([data-has-attachments=\"true\"]) [class*=\"rail\"]:not([class*=\"trailing\"]) {",
      "  display: none !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"][data-has-attachments=\"true\"] [class*=\"rail\"]:not([class*=\"trailing\"]),",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card][data-has-attachments=\"true\"] [class*=\"rail\"]:not([class*=\"trailing\"]) {",
      "  background: var(--dsw-specific-input-major, #ffffff) !important;",
      "  border: 1px solid var(--dsw-alias-border-l1) !important;",
      "  border-bottom: none !important;",
      "  border-radius: 14px 14px 0 0 !important;",
      "  padding: 12px 14px 10px 14px !important;",
      "  margin: 0 !important;",
      "  width: 100% !important;",
      "  max-width: 100% !important;",
      "  box-sizing: border-box !important;",
      "  min-height: 162px !important;",
      "  height: auto !important;",
      "  overflow: visible !important;",
      "  /* No wash of its own: the card behind it carries the one wash (see the card",
      "     rule above), so the rail cannot paint the canvas colour over the field. */",
      "  box-shadow: none !important;",
      "  position: relative !important;",
      "  z-index: 4 !important;",
      "  transition: border-color 0.12s ease, box-shadow 0.12s ease !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active]:not([data-ds-dark-theme]) [data-composer-card][data-composer-variant=\"inline\"][data-has-attachments=\"true\"] [class*=\"rail\"]:not([class*=\"trailing\"]),",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active]:not([data-ds-dark-theme]) [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card][data-has-attachments=\"true\"] [class*=\"rail\"]:not([class*=\"trailing\"]) {",
      "  background: #ffffff !important;",
      "  border-color: #e8e6dc !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active]:not([data-ds-dark-theme]) [data-composer-card][data-composer-variant=\"inline\"]:focus-within [class*=\"rail\"]:not([class*=\"trailing\"]),",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active]:not([data-ds-dark-theme]) [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card]:focus-within [class*=\"rail\"]:not([class*=\"trailing\"]) {",
      "  border-color: rgba(20, 20, 19, 0.18) !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active][data-ds-dark-theme] [data-composer-card][data-composer-variant=\"inline\"]:focus-within [class*=\"rail\"]:not([class*=\"trailing\"]),",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active][data-ds-dark-theme] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card]:focus-within [class*=\"rail\"]:not([class*=\"trailing\"]) {",
      "  border-color: rgba(250, 249, 245, 0.22) !important;",
      "}",
      "/* The attachment rail nests two levels: ComposerAttachments' outer rail wraps",
      "   AttachmentRail's scrolling inner rail, and BOTH substring-match",
      "   `[class*=\"rail\"]`, so the block above would draw the card frame twice —",
      "   one box inside the other. Only the outer shell carries the frame; the",
      "   inner scrolling rail stays frameless. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"][data-has-attachments=\"true\"] [class*=\"rail\"]:not([class*=\"trailing\"]) [class*=\"rail\"]:not([class*=\"trailing\"]),",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card][data-has-attachments=\"true\"] [class*=\"rail\"]:not([class*=\"trailing\"]) [class*=\"rail\"]:not([class*=\"trailing\"]) {",
      "  background: transparent !important;",
      "  border: none !important;",
      "  box-shadow: none !important;",
      "  border-radius: 0 !important;",
      "  padding: 0 !important;",
      "  margin: 0 !important;",
      "  min-height: 140px !important;",
      "  height: auto !important;",
      "  display: flex !important;",
      "  align-items: center !important;",
      "  gap: 10px !important;",
      "  overflow-x: auto !important;",
      "  overflow-y: hidden !important;",
      "}",
      "/* Attachment thumbnail card: enlarged by 75% (~140px), matching non-focus border without shadow */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card] [class*=\"rail\"]:not([class*=\"trailing\"]) :is(._54WpYG_imageItem, [class*=\"imageItem\"], [class*=\"thumbnail\"], [class*=\"FileCard\"], [class*=\"item\"]:has(img), [class*=\"card\"]:has(img), [class*=\"attachment\"]:has(img)) {",
      "  width: 140px !important;",
      "  height: 140px !important;",
      "  min-width: 140px !important;",
      "  min-height: 140px !important;",
      "  max-width: 140px !important;",
      "  max-height: 140px !important;",
      "  border-radius: 12px !important;",
      "  border: 1px solid var(--dsw-alias-border-l1) !important;",
      "  box-shadow: none !important;",
      "  overflow: hidden !important;",
      "  position: relative !important;",
      "  z-index: 5 !important;",
      "  flex: 0 0 140px !important;",
      "  box-sizing: border-box !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active]:not([data-ds-dark-theme]) [data-composer-card] [class*=\"rail\"]:not([class*=\"trailing\"]) :is(._54WpYG_imageItem, [class*=\"imageItem\"], [class*=\"thumbnail\"], [class*=\"FileCard\"], [class*=\"item\"]:has(img), [class*=\"card\"]:has(img), [class*=\"attachment\"]:has(img)) {",
      "  border-color: #e8e6dc !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card] [class*=\"rail\"]:not([class*=\"trailing\"]) :is(._54WpYG_imageItem, [class*=\"imageItem\"], [class*=\"thumbnail\"], [class*=\"FileCard\"], [class*=\"item\"]:has(img), [class*=\"card\"]:has(img), [class*=\"attachment\"]:has(img)) :is(img, canvas, [class*=\"preview\"], [class*=\"image\"]) {",
      "  width: 100% !important;",
      "  height: 100% !important;",
      "  max-width: 100% !important;",
      "  max-height: 100% !important;",
      "  object-fit: cover !important;",
      "  display: block !important;",
      "  border-radius: 11px !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card] [class*=\"rail\"]:not([class*=\"trailing\"]) :is(._54WpYG_imageItem, [class*=\"imageItem\"], [class*=\"thumbnail\"], [class*=\"FileCard\"], [class*=\"item\"]:has(img), [class*=\"card\"]:has(img), [class*=\"attachment\"]:has(img)) :is(button, [role=\"button\"], [class*=\"close\"], [class*=\"delete\"], [class*=\"remove\"], [class*=\"badge\"], [class*=\"tag\"]) {",
      "  position: absolute !important;",
      "  z-index: 6 !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"] [data-input-scroll],",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card] [data-input-scroll] {",
      "  background: var(--dsw-specific-input-major, #ffffff) !important;",
      "  border: 1px solid var(--dsw-alias-border-l1) !important;",
      "  border-radius: 14px !important;",
      "  min-height: 38px !important;",
      "  height: auto !important;",
      "  max-height: var(--dsh-composer-text-max-height, 180px) !important;",
      "  box-sizing: border-box !important;",
      "  display: block !important;",
      "  width: 100% !important;",
      "  max-width: 100% !important;",
      "  overflow-y: auto !important;",
      "  overflow-x: hidden !important;",
      "  padding: 7px 36px 7px 14px !important;",
      "  margin: 0 !important;",
      "  position: relative !important;",
      "  z-index: 2 !important;",
      "  cursor: text !important;",
      "  box-shadow: 0 1px 3px rgba(20, 20, 19, 0.03), 0 0 0 6px var(--dsw-alias-bg-base), 0 0 16px 10px var(--dsw-alias-bg-base), 0 0 48px 16px var(--dsw-alias-bg-base) !important;",
      "  transition: border-color 0.12s ease, box-shadow 0.12s ease !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"][data-has-attachments=\"true\"] [data-input-scroll],",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card][data-has-attachments=\"true\"] [data-input-scroll] {",
      "  border-top: none !important;",
      "  border-radius: 0 0 14px 14px !important;",
      "  /* Seamless join with attachment rail above: 1px negative margin prevents subpixel seam without clipping thumbnails */",
      "  margin-top: -1px !important;",
      "  min-height: 32px !important;",
      "  padding: 8px 36px 6px 14px !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active]:not([data-ds-dark-theme]) [data-composer-card][data-composer-variant=\"inline\"] [data-input-scroll],",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active]:not([data-ds-dark-theme]) [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card] [data-input-scroll] {",
      "  background: #ffffff !important;",
      "  border-color: #e8e6dc !important;",
      "  box-shadow: 0 1px 3px rgba(20, 20, 19, 0.03), 0 0 0 6px var(--dsw-alias-bg-base), 0 0 16px 10px var(--dsw-alias-bg-base), 0 0 48px 16px var(--dsw-alias-bg-base) !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active][data-ds-dark-theme] [data-composer-card][data-composer-variant=\"inline\"] [data-input-scroll],",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active][data-ds-dark-theme] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card] [data-input-scroll] {",
      "  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15), 0 0 0 6px var(--dsw-alias-bg-base), 0 0 16px 10px var(--dsw-alias-bg-base), 0 0 48px 16px var(--dsw-alias-bg-base) !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active]:not([data-ds-dark-theme]) [data-composer-card][data-composer-variant=\"inline\"]:focus-within [data-input-scroll],",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active]:not([data-ds-dark-theme]) [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card]:focus-within [data-input-scroll] {",
      "  border-color: rgba(20, 20, 19, 0.18) !important;",
      "  box-shadow: 0 0 0 1px rgba(20, 20, 19, 0.065), 0 4px 12px rgba(20, 20, 19, 0.025), 0 0 0 6px var(--dsw-alias-bg-base), 0 0 16px 10px var(--dsw-alias-bg-base), 0 0 48px 16px var(--dsw-alias-bg-base) !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active][data-ds-dark-theme] [data-composer-card][data-composer-variant=\"inline\"]:focus-within [data-input-scroll],",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active][data-ds-dark-theme] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card]:focus-within [data-input-scroll] {",
      "  border-color: rgba(250, 249, 245, 0.22) !important;",
      "  box-shadow: 0 0 0 1px rgba(250, 249, 245, 0.09), 0 4px 16px rgba(0, 0, 0, 0.20), 0 0 0 6px var(--dsw-alias-bg-base), 0 0 16px 10px var(--dsw-alias-bg-base), 0 0 48px 16px var(--dsw-alias-bg-base) !important;",
      "}",
      "/* With attachments the rail already carries the card's focus ring, so the",
      "   input keeps only the deepened drop — its own 1px ring would paint a second",
      "   line across the seam between the thumbnails and the text. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active]:not([data-ds-dark-theme]) [data-composer-card][data-composer-variant=\"inline\"][data-has-attachments=\"true\"]:focus-within [data-input-scroll],",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active]:not([data-ds-dark-theme]) [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card][data-has-attachments=\"true\"]:focus-within [data-input-scroll] {",
      "  box-shadow: 0 4px 12px rgba(20, 20, 19, 0.025), 0 0 0 6px var(--dsw-alias-bg-base), 0 0 16px 10px var(--dsw-alias-bg-base), 0 0 48px 16px var(--dsw-alias-bg-base) !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active][data-ds-dark-theme] [data-composer-card][data-composer-variant=\"inline\"][data-has-attachments=\"true\"]:focus-within [data-input-scroll],",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active][data-ds-dark-theme] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card][data-has-attachments=\"true\"]:focus-within [data-input-scroll] {",
      "  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.20), 0 0 0 6px var(--dsw-alias-bg-base), 0 0 16px 10px var(--dsw-alias-bg-base), 0 0 48px 16px var(--dsw-alias-bg-base) !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"] [data-input-scroll] [class*=\"grow\"],",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card] [data-input-scroll] [class*=\"grow\"] {",
      "  width: 100% !important;",
      "  max-width: 100% !important;",
      "  min-height: 24px !important;",
      "  position: relative !important;",
      "  display: block !important;",
      "  box-sizing: border-box !important;",
      "  overflow-x: hidden !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"] [data-composer-input],",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card] [data-composer-input] {",
      "  min-height: 24px !important;",
      "  height: auto !important;",
      "  line-height: 24px !important;",
      "  padding: 0 !important;",
      "  font-size: 14px !important;",
      "  width: 100% !important;",
      "  max-width: 100% !important;",
      "  box-sizing: border-box !important;",
      "  cursor: text !important;",
      "  outline: none !important;",
      "  white-space: pre-wrap !important;",
      "  word-break: break-word !important;",
      "  overflow-wrap: anywhere !important;",
      "  overflow-x: hidden !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"] [data-composer-placeholder],",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card] [data-composer-placeholder] {",
      "  line-height: 24px !important;",
      "  height: 24px !important;",
      "  position: absolute !important;",
      "  top: 0 !important;",
      "  left: 0 !important;",
      "  right: 0 !important;",
      "  max-width: 100% !important;",
      "  box-sizing: border-box !important;",
      "  font-size: 14px !important;",
      "  color: var(--dsw-alias-label-caption) !important;",
      "  white-space: nowrap !important;",
      "  text-overflow: ellipsis !important;",
      "  overflow: hidden !important;",
      "  pointer-events: none !important;",
      "  user-select: none !important;",
      "}",
      "/* Pinned send button inside input box */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"] :is(button[aria-label^=\"发送\"], button[aria-label^=\"Send\"], button[aria-label*=\"发送\"], button[aria-label*=\"Send\"], button[aria-label*=\"排队\"], button[aria-label*=\"Queue\"], button[aria-label*=\"插话\"], button[aria-label*=\"Steer\"], [class*=\"sendBtn\"], [class*=\"sendButton\"]),",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card] :is(button[aria-label^=\"发送\"], button[aria-label^=\"Send\"], button[aria-label*=\"发送\"], button[aria-label*=\"Send\"], button[aria-label*=\"排队\"], button[aria-label*=\"Queue\"], button[aria-label*=\"插话\"], button[aria-label*=\"Steer\"], [class*=\"sendBtn\"], [class*=\"sendButton\"]) {",
      "  position: absolute !important;",
      "  bottom: 40px !important;",
      "  right: 8px !important;",
      "  top: auto !important;",
      "  left: auto !important;",
      "  width: 26px !important;",
      "  height: 26px !important;",
      "  min-width: 26px !important;",
      "  padding: 0 !important;",
      "  border-radius: 6px !important;",
      "  display: inline-flex !important;",
      "  align-items: center !important;",
      "  justify-content: center !important;",
      "  z-index: 10 !important;",
      "  box-shadow: none !important;",
      "  background: transparent !important;",
      "  color: var(--dsw-alias-label-caption) !important;",
      "  border: none !important;",
      "  cursor: pointer !important;",
      "  transition: color 0.12s ease, background-color 0.12s ease !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"] :is(button[aria-label^=\"发送\"], button[aria-label^=\"Send\"], button[aria-label*=\"发送\"], button[aria-label*=\"Send\"], button[aria-label*=\"排队\"], button[aria-label*=\"Queue\"], button[aria-label*=\"插话\"], button[aria-label*=\"Steer\"], [class*=\"sendBtn\"], [class*=\"sendButton\"]) :is(svg, [class*=\"chevron\"], span) {",
      "  display: none !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"] :is(button[aria-label^=\"发送\"], button[aria-label^=\"Send\"], button[aria-label*=\"发送\"], button[aria-label*=\"Send\"], button[aria-label*=\"排队\"], button[aria-label*=\"Queue\"], button[aria-label*=\"插话\"], button[aria-label*=\"Steer\"], [class*=\"sendBtn\"], [class*=\"sendButton\"])::after,",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card] :is(button[aria-label^=\"发送\"], button[aria-label^=\"Send\"], button[aria-label*=\"发送\"], button[aria-label*=\"Send\"], button[aria-label*=\"排队\"], button[aria-label*=\"Queue\"], button[aria-label*=\"插话\"], button[aria-label*=\"Steer\"], [class*=\"sendBtn\"], [class*=\"sendButton\"])::after {",
      "  content: \"↵\" !important;",
      "  font-family: var(--dsw-font-code, monospace) !important;",
      "  font-size: 16px !important;",
      "  font-weight: 500 !important;",
      "  line-height: 1 !important;",
      "  color: currentColor !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"] :is(button[aria-label^=\"发送\"], button[aria-label^=\"Send\"], button[aria-label*=\"发送\"], button[aria-label*=\"Send\"]):not(:disabled):hover,",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card] :is(button[aria-label^=\"发送\"], button[aria-label^=\"Send\"], button[aria-label*=\"发送\"], button[aria-label*=\"Send\"]):not(:disabled):hover {",
      "  background: var(--dsh-claude-hover-bg, rgba(0, 0, 0, 0.08)) !important;",
      "  color: var(--dsw-alias-label-primary) !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"]:not(:has([data-composer-placeholder])) :is(button[aria-label^=\"发送\"], button[aria-label^=\"Send\"], button[aria-label*=\"发送\"], button[aria-label*=\"Send\"]),",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"][data-has-attachments=\"true\"] :is(button[aria-label^=\"发送\"], button[aria-label^=\"Send\"], button[aria-label*=\"发送\"], button[aria-label*=\"Send\"]),",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card]:not(:has([data-composer-placeholder])) :is(button[aria-label^=\"发送\"], button[aria-label^=\"Send\"], button[aria-label*=\"发送\"], button[aria-label*=\"Send\"]),",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card][data-has-attachments=\"true\"] :is(button[aria-label^=\"发送\"], button[aria-label^=\"Send\"], button[aria-label*=\"发送\"], button[aria-label*=\"Send\"]) {",
      "  color: var(--dsw-alias-brand-primary, #d97757) !important;",
      "}",
      "/* Pinned stop button inside input box */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"] :is(button[aria-label*=\"停止\"], button[aria-label*=\"Stop\"]),",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card] :is(button[aria-label*=\"停止\"], button[aria-label*=\"Stop\"]) {",
      "  position: absolute !important;",
      "  bottom: 40px !important;",
      "  right: 8px !important;",
      "  top: auto !important;",
      "  left: auto !important;",
      "  width: 26px !important;",
      "  height: 26px !important;",
      "  min-width: 26px !important;",
      "  padding: 0 !important;",
      "  border-radius: 6px !important;",
      "  display: inline-flex !important;",
      "  align-items: center !important;",
      "  justify-content: center !important;",
      "  z-index: 10 !important;",
      "  background: var(--dsw-alias-interactive-bg-hover) !important;",
      "  color: var(--dsw-alias-brand-primary, #d97757) !important;",
      "  border: none !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"] :is(button[aria-label*=\"停止\"], button[aria-label*=\"Stop\"]) svg,",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card] :is(button[aria-label*=\"停止\"], button[aria-label*=\"Stop\"]) svg {",
      "  display: block !important;",
      "  width: 12px !important;",
      "  height: 12px !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"] :is(button[aria-label*=\"停止\"], button[aria-label*=\"Stop\"])::after,",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card] :is(button[aria-label*=\"停止\"], button[aria-label*=\"Stop\"])::after {",
      "  display: none !important;",
      "}",
      "/* Toolbar row below input card. `[class*=\"_row\"]` on purpose: a bare",
      "   `[class*=\"row\"]` substring-matches the shipped `.p_FcLG_grow` input",
      "   wrapper (\"grow\" contains \"row\"), and the fixed 28px height + flex",
      "   display here would pin the composer field to one line forever. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"] [class*=\"_row\"],",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card] [class*=\"_row\"] {",
      "  display: flex !important;",
      "  flex-wrap: nowrap !important;",
      "  justify-content: space-between !important;",
      "  align-items: center !important;",
      "  padding: 0 4px !important;",
      "  margin: 6px 0 0 0 !important;",
      "  background: transparent !important;",
      "  border: none !important;",
      "  box-shadow: none !important;",
      "  min-height: 28px !important;",
      "  height: 28px !important;",
      "  width: 100% !important;",
      "  max-width: 100% !important;",
      "  box-sizing: border-box !important;",
      "  overflow: visible !important;",
      "  position: relative !important;",
      "  z-index: 3 !important;",
      "}",
      "/* The context-occupancy meter renders its click-open panel INSIDE the inline",
      "   composer card, and its legend classes (`…_rows` / `…_row`) substring-match",
      "   the toolbar-row override above — which flattened the shipped definition",
      "   list into one 28px flex line and wrapped every label/value. Restore the",
      "   shipped legend layout: the list stacks vertically, each row keeps its",
      "   natural height and space-between distribution. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"] [class*=\"_rows\"],",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card] [class*=\"_rows\"] {",
      "  display: block !important;",
      "  height: auto !important;",
      "  min-height: 0 !important;",
      "  width: auto !important;",
      "  max-width: none !important;",
      "  padding: 0 !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"] [class*=\"_rows\"] [class*=\"_row\"],",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card] [class*=\"_rows\"] [class*=\"_row\"] {",
      "  display: flex !important;",
      "  height: auto !important;",
      "  min-height: 0 !important;",
      "  width: auto !important;",
      "  max-width: none !important;",
      "  padding: 2px 0 !important;",
      "  margin: 0 !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"] [class*=\"tools\"],",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card] [class*=\"tools\"] {",
      "  display: flex !important;",
      "  align-items: center !important;",
      "  gap: 8px !important;",
      "  flex: 0 0 auto !important;",
      "  overflow: visible !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"] [class*=\"modes\"],",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card] [class*=\"modes\"] {",
      "  order: 1 !important;",
      "  display: inline-flex !important;",
      "  align-items: center !important;",
      "  overflow: visible !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"] :is(button[aria-label=\"指令\"], button[aria-label=\"Commands\"]),",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card] :is(button[aria-label=\"指令\"], button[aria-label=\"Commands\"]) {",
      "  order: 2 !important;",
      "  width: 24px !important;",
      "  height: 24px !important;",
      "  border-radius: 6px !important;",
      "  background: transparent !important;",
      "  color: var(--dsw-alias-label-secondary) !important;",
      "  display: inline-flex !important;",
      "  align-items: center !important;",
      "  justify-content: center !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"] :is(button[aria-label=\"添加附件\"], button[aria-label=\"Add attachment\"]),",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card] :is(button[aria-label=\"添加附件\"], button[aria-label=\"Add attachment\"]) {",
      "  order: 3 !important;",
      "  width: 24px !important;",
      "  height: 24px !important;",
      "  border-radius: 6px !important;",
      "  background: transparent !important;",
      "  color: var(--dsw-alias-label-secondary) !important;",
      "  display: inline-flex !important;",
      "  align-items: center !important;",
      "  justify-content: center !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"] :is(button[aria-label=\"指令\"], button[aria-label=\"Commands\"], button[aria-label=\"添加附件\"], button[aria-label=\"Add attachment\"]):hover:not(:disabled),",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card] :is(button[aria-label=\"指令\"], button[aria-label=\"Commands\"], button[aria-label=\"添加附件\"], button[aria-label=\"Add attachment\"]):hover:not(:disabled) {",
      "  background: var(--dsh-claude-hover-bg, rgba(0, 0, 0, 0.08)) !important;",
      "  color: var(--dsw-alias-label-primary) !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"] [class*=\"trailing\"],",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card] [class*=\"trailing\"] {",
      "  display: flex !important;",
      "  align-items: center !important;",
      "  gap: 8px !important;",
      "  margin-left: auto !important;",
      "  flex: 0 0 auto !important;",
      "}",
      "/* Model trigger in trailing */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"] [class*=\"trailing\"] > :first-child,",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"] [class*=\"trailing\"] :is([class*=\"trigger\" i], [class*=\"model\" i], [class*=\"Model\"]) {",
      "  display: inline-flex !important;",
      "  align-items: center !important;",
      "  font-size: 13px !important;",
      "  color: var(--dsw-alias-label-secondary) !important;",
      "  border-radius: 7px !important;",
      "  cursor: pointer !important;",
      "  visibility: visible !important;",
      "  opacity: 1 !important;",
      "}",
      "/* The skin's own model trigger replaces the host's model seat (the host's",
      "   root is marked and hidden by syncModelControl). One button, one hover",
      "   background — the shipped seat stacks an icon + label + effort + chevron,",
      "   each with its own surface. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-dsh-claude-model-host] {",
      "  display: none !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"trailing\"] .dsh-claude-model-btn {",
      "  display: inline-flex !important;",
      "  align-items: center !important;",
      "  gap: 2px !important;",
      "  height: 28px !important;",
      "  max-width: 280px !important;",
      "  padding: 0 8px !important;",
      "  border: none !important;",
      "  border-radius: 7px !important;",
      "  background: transparent !important;",
      "  color: var(--dsw-alias-label-secondary) !important;",
      "  font-size: 13px !important;",
      "  font-weight: 500 !important;",
      "  line-height: 20px !important;",
      "  cursor: pointer !important;",
      "  box-sizing: border-box !important;",
      "  min-width: 0 !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"trailing\"] .dsh-claude-model-btn-label.dsh-claude-model-btn-loading {",
      "  color: var(--dsw-alias-label-caption, #a6a094) !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"trailing\"] .dsh-claude-model-btn:hover {",
      "  background: var(--dsh-claude-hover-bg, rgba(0, 0, 0, 0.08)) !important;",
      "  color: var(--dsw-alias-label-primary) !important;",
      "}",
      "",
      "/* Only the whole trigger gets the hover plate; its label/effort spans stay",
      "   transparent so no smaller inner background appears. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"trailing\"] .dsh-claude-model-btn > * {",
      "  background: transparent !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"trailing\"] .dsh-claude-model-btn-label {",
      "  text-overflow: ellipsis !important;",
      "  white-space: nowrap !important;",
      "  min-width: 0 !important;",
      "  overflow: hidden !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"trailing\"] .dsh-claude-model-btn-effort {",
      "  flex: none !important;",
      "  color: var(--dsw-alias-label-caption, #a6a094) !important;",
      "  font-weight: 400 !important;",
      "}",
      "/* Token stats pills — merged into the toolbar row (one line with the",
      "   controls). The base rule below is the fallback for the host's own",
      "   position (a full-width line under the card); once mergeStatsIntoRow()",
      "   has moved the pills into the row, the override after it resets every",
      "   geometry property the host's full-width line depends on. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"] ~ [data-composer-stats],",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-stats] {",
      "  position: relative !important;",
      "  z-index: 3 !important;",
      "  display: flex !important;",
      "  align-items: center !important;",
      "  justify-content: center !important;",
      "  gap: 12px !important;",
      "  font-size: 12px !important;",
      "  color: var(--dsw-alias-label-secondary) !important;",
      "  margin: 6px auto 0 !important;",
      "  height: 24px !important;",
      "  line-height: 24px !important;",
      "  pointer-events: auto !important;",
      "  width: 100% !important;",
      "  max-width: var(--dsh-composer-card-max-width, 100%) !important;",
      "  box-sizing: border-box !important;",
      "  overflow: hidden !important;",
      "  white-space: nowrap !important;",
      "  text-overflow: ellipsis !important;",
      "}",
      "/* In-row: the pills become an inline, shrinkable flex item between the left",
      "   tool cluster and the trailing model/status group (the row's space-between",
      "   centers them). Width, padding and margin come from the host's full-width",
      "   line, so all of them are reset; the pills keep their own hover/click. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"] [class*=\"_row\"] [data-composer-stats],",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-card] [class*=\"_row\"] [data-composer-stats] {",
      "  position: relative !important;",
      "  z-index: 3 !important;",
      "  width: auto !important;",
      "  max-width: none !important;",
      "  margin: 0 8px !important;",
      "  padding: 0 !important;",
      "  height: auto !important;",
      "  line-height: 20px !important;",
      "  /* Fill the space between the left tool cluster and the trailing model",
      "     group, then center the sentence in it: equal air on both sides. */",
      "  justify-content: center !important;",
      "  flex: 1 1 auto !important;",
      "  min-width: 0 !important;",
      "}",
      "/* The stats pills are on-demand: hidden unless the chat window (the composer)",
      "   is hovered, so the toolbar stays clean. Space is preserved — no reflow when",
      "   they fade in — and because the pills live inside the card, hovering them",
      "   keeps them visible long enough to click. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card] [class*=\"_row\"] [data-composer-stats] {",
      "  opacity: 0 !important;",
      "  visibility: hidden !important;",
      "  pointer-events: none !important;",
      "  transition: opacity 0.15s ease, visibility 0.15s ease !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-phase=\"active\"]:hover [data-composer-card] [class*=\"_row\"] [data-composer-stats],",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card] [class*=\"_row\"] [data-composer-stats]:hover {",
      "  opacity: 1 !important;",
      "  visibility: visible !important;",
      "  pointer-events: auto !important;",
      "}",
      "@media (max-width: 820px) {",
      "  body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card][data-composer-variant=\"inline\"] ~ [data-composer-stats],",
      "  body[data-dsh-claude-style][data-dsh-claude-composer-active] [class*=\"composerStack\"]:not([data-composer-variant=\"hero\"]) [data-composer-stats] {",
      "    display: none !important;",
      "  }",
      "}",
      "",
      "/* ---------- combined composer stats ---------- */",
      "/* The host ships two pills (time / usage) with icons and its own spacing.",
      "   We keep the two click targets but hide their internals and render one",
      "   centered sentence from the CSS variables syncStatsSummary() writes. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-stats] {",
      "  gap: 0 !important;",
      "  justify-content: center !important;",
      "  font-family: var(--dsw-font-family) !important;",
      "  font-size: 12px !important;",
      "  line-height: 20px !important;",
      "  color: var(--dsw-alias-label-tertiary) !important;",
      "}",
      "",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-stats] svg {",
      "  display: none !important;",
      "}",
      "",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-stats] button > span {",
      "  display: none !important;",
      "}",
      "",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-stats] button {",
      "  padding: 0 !important;",
      "  border-radius: 0 !important;",
      "  background: transparent !important;",
      "  color: inherit !important;",
      "  font: inherit !important;",
      "}",
      "",
      "/* Let the first segment shrink and ellipsize (e.g. 20轮...), while the",
      "   usage segment and the separator keep their width. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-stats] > span {",
      "  min-width: 0 !important;",
      "  overflow: hidden !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-stats] > span:first-child {",
      "  flex: 0 1 auto !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-stats] > span:last-child {",
      "  flex: 0 0 auto !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-stats] button {",
      "  display: block !important;",
      "  max-width: 100% !important;",
      "  min-width: 0 !important;",
      "  overflow: hidden !important;",
      "  text-overflow: ellipsis !important;",
      "  white-space: nowrap !important;",
      "}",
      "",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-stats] button:hover,",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-stats] button[aria-expanded=\"true\"] {",
      "  background: transparent !important;",
      "  color: var(--dsw-alias-label-secondary) !important;",
      "}",
      "",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-stats] > span:first-child button::after {",
      "  content: var(--dsh-stats-time, '');",
      "}",
      "",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-stats] > span:last-child button::after {",
      "  content: var(--dsh-stats-usage, '');",
      "}",
      "",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-stats] > span + span::before {",
      "  content: ' · ';",
      "  color: var(--dsw-alias-separator-primary);",
      "}",
      "",
      "/* The two buttons stay transparent; the hover plate belongs to the whole",
      "   merged line so the stats area has one feedback surface. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card] [class*=\"_row\"] [data-composer-stats] {",
      "  transition: background-color 0.12s ease;",
      "}",
      "",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [data-composer-card] [class*=\"_row\"] [data-composer-stats]:hover {",
      "  background: var(--dsh-claude-hover-bg, rgba(0, 0, 0, 0.08)) !important;",
      "  border-radius: 6px !important;",
      "}",
      "",
      "/* The host renders two separate stat dialogs; hide them and use one custom",
      "   combined popover instead. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [role=\"dialog\"]:has([data-session-stats-details]),",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] [role=\"dialog\"]:has([data-session-stats-usage]) {",
      "  display: none !important;",
      "}",
      "",
      "/* Combined stats popover, styled like the permission popover: title on top,",
      "   content below, roomy type. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] .dsh-claude-stats-popover {",
      "  position: fixed !important;",
      "  z-index: 100000 !important;",
      "  min-width: 260px !important;",
      "  max-width: min(380px, calc(100vw - 16px)) !important;",
      "  box-sizing: border-box !important;",
      "  padding: 8px !important;",
      "  background: var(--dsw-alias-bg-overlay, #ffffff) !important;",
      "  border: 1px solid var(--dsw-alias-border-l1, #e8e6dc) !important;",
      "  border-radius: 12px !important;",
      "  box-shadow: 0 8px 30px rgba(20, 20, 19, 0.12), 0 2px 8px rgba(20, 20, 19, 0.06) !important;",
      "  display: flex !important;",
      "  flex-direction: column !important;",
      "  gap: 4px !important;",
      "  opacity: 0 !important;",
      "  pointer-events: none !important;",
      "  transform: translateY(4px) scale(0.98) !important;",
      "  transition: opacity 0.15s ease, transform 0.15s ease !important;",
      "  font-family: var(--dsw-font-family) !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active][data-ds-dark-theme] .dsh-claude-stats-popover {",
      "  background: #1e1e1d !important;",
      "  border-color: #2e2c29 !important;",
      "  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3) !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] .dsh-claude-stats-popover[data-open=\"true\"] {",
      "  opacity: 1 !important;",
      "  pointer-events: auto !important;",
      "  transform: translateY(0) scale(1) !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] .dsh-claude-stats-popover-body {",
      "  display: flex !important;",
      "  flex-direction: column !important;",
      "  gap: 10px !important;",
      "  min-width: 0 !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] .dsh-claude-stats-popover-grid {",
      "  display: grid !important;",
      "  grid-template-columns: 1fr 1fr !important;",
      "  gap: 4px 8px !important;",
      "  min-width: 0 !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] .dsh-claude-stats-popover-section {",
      "  padding: 6px 6px 2px !important;",
      "  color: var(--dsw-alias-label-tertiary) !important;",
      "  font-size: 11px !important;",
      "  font-weight: 600 !important;",
      "  letter-spacing: 0.04em !important;",
      "  text-transform: uppercase !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] .dsh-claude-stats-popover-item {",
      "  display: flex !important;",
      "  flex-direction: column !important;",
      "  gap: 2px !important;",
      "  padding: 6px 8px !important;",
      "  border-radius: 8px !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] .dsh-claude-stats-popover-item:hover {",
      "  background: var(--dsh-claude-hover-bg, rgba(0, 0, 0, 0.08)) !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] .dsh-claude-stats-popover-label {",
      "  color: var(--dsw-alias-label-tertiary) !important;",
      "  font-size: 12px !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] .dsh-claude-stats-popover-value {",
      "  color: var(--dsw-alias-label-primary) !important;",
      "  font-size: 14px !important;",
      "  font-weight: 500 !important;",
      "  font-variant-numeric: tabular-nums !important;",
      "}",
      "",
      "/* ---------- Claude Code layout: sidebar brand ---------- */",
      "/* The shipped whale and wordmark give way to the selected brand. Each variant",
      "   is painted as an alpha mask over currentColor, so it follows the light/dark",
      "   label colour instead of carrying a baked-in one. The choice is switched by a",
      "   document attribute rather than by swapping the stylesheet, so the settings",
      "   page only has to flip one attribute and the whole UI follows.",
      "",
      "   Sizing: both marks are set to an 18px cap height to match the shipped",
      "   brandName box, and each wordmark takes its natural width from that height",
      "   via the artwork aspect ratios (Claude 4.214:1, ANTHROPIC ~8.94:1). The",
      "   wordmark keeps a max-width so a longer brand can never clip the row. */",
      "body[data-dsh-claude-style]:is([data-dsh-claude-brand=\"claude\"], [data-dsh-claude-brand=\"anthropic\"]) :is([class*=\"brandMark\"], [class*=\"railMark\"]) > * {",
      "  display: none !important;",
      "}",
      "",
      "body[data-dsh-claude-style]:is([data-dsh-claude-brand=\"claude\"], [data-dsh-claude-brand=\"anthropic\"]) :is([class*=\"brandMark\"], [class*=\"railMark\"])::before {",
      "  content: \"\";",
      "  display: block;",
      "  flex: none;",
      "  background-color: currentColor;",
      "  background-repeat: no-repeat;",
      "  background-position: center;",
      "  background-size: contain;",
      "}",
      "",
      "/* Claude (default): starburst mark + the Claude wordmark. */",
      "body[data-dsh-claude-style][data-dsh-claude-brand=\"claude\"] :is([class*=\"brandMark\"], [class*=\"railMark\"])::before {",
      "  width: 18px;",
      "  height: 18px;",
      "  -webkit-mask: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20148.09%20148.18'%3E%3Cg%20transform%3D'translate(-75.96%2C-223.53)'%3E%3Cpath%20d%3D'm%20105.01%2C322.07%2029.14%2C-16.35%200.49%2C-1.42%20-0.49%2C-0.79%20h%20-1.42%20l%20-4.87%2C-0.3%20-16.65%2C-0.45%20-14.44%2C-0.6%20-13.99%2C-0.75%20-3.52%2C-0.75%20-3.3%2C-4.35%200.34%2C-2.17%202.96%2C-1.99%204.24%2C0.37%209.37%2C0.64%2014.06%2C0.97%2010.2%2C0.6%2015.11%2C1.57%20h%202.4%20l%200.34%2C-0.97%20-0.82%2C-0.6%20-0.64%2C-0.6%20-14.55%2C-9.86%20-15.75%2C-10.42%20-8.25%2C-6%20-4.46%2C-3.04%20-2.25%2C-2.85%20-0.97%2C-6.22%204.05%2C-4.46%205.44%2C0.37%201.39%2C0.37%205.51%2C4.24%2011.77%2C9.11%2015.37%2C11.32%202.25%2C1.87%200.9%2C-0.64%200.11%2C-0.45%20-1.01%2C-1.69%20-8.36%2C-15.11%20-8.92%2C-15.37%20-3.97%2C-6.37%20-1.05%2C-3.82%20c%20-0.37%2C-1.57%20-0.64%2C-2.89%20-0.64%2C-4.5%20l%204.61%2C-6.26%202.55%2C-0.82%206.15%2C0.82%202.59%2C2.25%203.82%2C8.74%206.19%2C13.76%209.6%2C18.71%202.81%2C5.55%201.5%2C5.14%200.56%2C1.57%20h%200.97%20v%20-0.9%20l%200.79%2C-10.54%201.46%2C-12.94%201.42%2C-16.65%200.49%2C-4.69%202.32%2C-5.62%204.61%2C-3.04%203.6%2C1.72%202.96%2C4.24%20-0.41%2C2.74%20-1.76%2C11.44%20-3.45%2C17.92%20-2.25%2C12%20h%201.31%20l%201.5%2C-1.5%206.07%2C-8.06%2010.2%2C-12.75%204.5%2C-5.06%205.25%2C-5.59%203.37%2C-2.66%20h%206.37%20l%204.69%2C6.97%20-2.1%2C7.2%20-6.56%2C8.32%20-5.44%2C7.05%20-7.8%2C10.5%20-4.87%2C8.4%200.45%2C0.67%201.16%2C-0.11%2017.62%2C-3.75%209.52%2C-1.72%2011.36%2C-1.95%205.14%2C2.4%200.56%2C2.44%20-2.02%2C4.99%20-12.15%2C3%20-14.25%2C2.85%20-21.22%2C5.02%20-0.26%2C0.19%200.3%2C0.37%209.56%2C0.9%204.09%2C0.22%20h%2010.01%20l%2018.64%2C1.39%204.87%2C3.22%202.92%2C3.94%20-0.49%2C3%20-7.5%2C3.82%20-10.12%2C-2.4%20-23.62%2C-5.62%20-8.1%2C-2.02%20h%20-1.12%20v%200.67%20l%206.75%2C6.6%2012.37%2C11.17%2015.49%2C14.4%200.79%2C3.56%20-1.99%2C2.81%20-2.1%2C-0.3%20-13.61%2C-10.24%20-5.25%2C-4.61%20-11.89%2C-10.01%20h%20-0.79%20v%201.05%20l%202.74%2C4.01%2014.47%2C21.75%200.75%2C6.67%20-1.05%2C2.17%20-3.75%2C1.31%20-4.12%2C-0.75%20-8.47%2C-11.89%20-8.74%2C-13.39%20-7.05%2C-12%20-0.86%2C0.49%20-4.16%2C44.81%20-1.95%2C2.29%20-4.5%2C1.72%20-3.75%2C-2.85%20-1.99%2C-4.61%201.99%2C-9.11%202.4%2C-11.89%201.95%2C-9.45%201.76%2C-11.74%201.05%2C-3.9%20-0.07%2C-0.26%20-0.86%2C0.11%20-8.85%2C12.15%20-13.46%2C18.19%20-10.65%2C11.4%20-2.55%2C1.01%20-4.42%2C-2.29%200.41%2C-4.09%202.47%2C-3.64%2014.74%2C-18.75%208.89%2C-11.62%205.74%2C-6.71%20-0.04%2C-0.97%20h%20-0.34%20l%20-39.15%2C25.42%20-6.97%2C0.9%20-3%2C-2.81%200.37%2C-4.61%201.42%2C-1.5%2011.77%2C-8.1%20-0.04%2C0.04%20z'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\") center / contain no-repeat;",
      "  mask: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20148.09%20148.18'%3E%3Cg%20transform%3D'translate(-75.96%2C-223.53)'%3E%3Cpath%20d%3D'm%20105.01%2C322.07%2029.14%2C-16.35%200.49%2C-1.42%20-0.49%2C-0.79%20h%20-1.42%20l%20-4.87%2C-0.3%20-16.65%2C-0.45%20-14.44%2C-0.6%20-13.99%2C-0.75%20-3.52%2C-0.75%20-3.3%2C-4.35%200.34%2C-2.17%202.96%2C-1.99%204.24%2C0.37%209.37%2C0.64%2014.06%2C0.97%2010.2%2C0.6%2015.11%2C1.57%20h%202.4%20l%200.34%2C-0.97%20-0.82%2C-0.6%20-0.64%2C-0.6%20-14.55%2C-9.86%20-15.75%2C-10.42%20-8.25%2C-6%20-4.46%2C-3.04%20-2.25%2C-2.85%20-0.97%2C-6.22%204.05%2C-4.46%205.44%2C0.37%201.39%2C0.37%205.51%2C4.24%2011.77%2C9.11%2015.37%2C11.32%202.25%2C1.87%200.9%2C-0.64%200.11%2C-0.45%20-1.01%2C-1.69%20-8.36%2C-15.11%20-8.92%2C-15.37%20-3.97%2C-6.37%20-1.05%2C-3.82%20c%20-0.37%2C-1.57%20-0.64%2C-2.89%20-0.64%2C-4.5%20l%204.61%2C-6.26%202.55%2C-0.82%206.15%2C0.82%202.59%2C2.25%203.82%2C8.74%206.19%2C13.76%209.6%2C18.71%202.81%2C5.55%201.5%2C5.14%200.56%2C1.57%20h%200.97%20v%20-0.9%20l%200.79%2C-10.54%201.46%2C-12.94%201.42%2C-16.65%200.49%2C-4.69%202.32%2C-5.62%204.61%2C-3.04%203.6%2C1.72%202.96%2C4.24%20-0.41%2C2.74%20-1.76%2C11.44%20-3.45%2C17.92%20-2.25%2C12%20h%201.31%20l%201.5%2C-1.5%206.07%2C-8.06%2010.2%2C-12.75%204.5%2C-5.06%205.25%2C-5.59%203.37%2C-2.66%20h%206.37%20l%204.69%2C6.97%20-2.1%2C7.2%20-6.56%2C8.32%20-5.44%2C7.05%20-7.8%2C10.5%20-4.87%2C8.4%200.45%2C0.67%201.16%2C-0.11%2017.62%2C-3.75%209.52%2C-1.72%2011.36%2C-1.95%205.14%2C2.4%200.56%2C2.44%20-2.02%2C4.99%20-12.15%2C3%20-14.25%2C2.85%20-21.22%2C5.02%20-0.26%2C0.19%200.3%2C0.37%209.56%2C0.9%204.09%2C0.22%20h%2010.01%20l%2018.64%2C1.39%204.87%2C3.22%202.92%2C3.94%20-0.49%2C3%20-7.5%2C3.82%20-10.12%2C-2.4%20-23.62%2C-5.62%20-8.1%2C-2.02%20h%20-1.12%20v%200.67%20l%206.75%2C6.6%2012.37%2C11.17%2015.49%2C14.4%200.79%2C3.56%20-1.99%2C2.81%20-2.1%2C-0.3%20-13.61%2C-10.24%20-5.25%2C-4.61%20-11.89%2C-10.01%20h%20-0.79%20v%201.05%20l%202.74%2C4.01%2014.47%2C21.75%200.75%2C6.67%20-1.05%2C2.17%20-3.75%2C1.31%20-4.12%2C-0.75%20-8.47%2C-11.89%20-8.74%2C-13.39%20-7.05%2C-12%20-0.86%2C0.49%20-4.16%2C44.81%20-1.95%2C2.29%20-4.5%2C1.72%20-3.75%2C-2.85%20-1.99%2C-4.61%201.99%2C-9.11%202.4%2C-11.89%201.95%2C-9.45%201.76%2C-11.74%201.05%2C-3.9%20-0.07%2C-0.26%20-0.86%2C0.11%20-8.85%2C12.15%20-13.46%2C18.19%20-10.65%2C11.4%20-2.55%2C1.01%20-4.42%2C-2.29%200.41%2C-4.09%202.47%2C-3.64%2014.74%2C-18.75%208.89%2C-11.62%205.74%2C-6.71%20-0.04%2C-0.97%20h%20-0.34%20l%20-39.15%2C25.42%20-6.97%2C0.9%20-3%2C-2.81%200.37%2C-4.61%201.42%2C-1.5%2011.77%2C-8.1%20-0.04%2C0.04%20z'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\") center / contain no-repeat;",
      "}",
      "",
      "body[data-dsh-claude-style]:is([data-dsh-claude-brand=\"claude\"], [data-dsh-claude-brand=\"anthropic\"]) [class*=\"brandIdentity\"] > [class*=\"brandName\"] > * {",
      "  display: none !important;",
      "}",
      "",
      "body[data-dsh-claude-style]:is([data-dsh-claude-brand=\"claude\"], [data-dsh-claude-brand=\"anthropic\"]) [class*=\"brandIdentity\"] > [class*=\"brandName\"]::before {",
      "  content: \"\";",
      "  display: block;",
      "  flex: none;",
      "  background-color: currentColor;",
      "  background-repeat: no-repeat;",
      "  background-position: center;",
      "  background-size: contain;",
      "}",
      "",
      "body[data-dsh-claude-style][data-dsh-claude-brand=\"claude\"] [class*=\"brandIdentity\"] > [class*=\"brandName\"]::before {",
      "  width: 75.9px;",
      "  max-width: 100%;",
      "  height: 18px;",
      "  -webkit-mask: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'177.76%2014.09%20512.22%20121.54'%3E%3Cg%20transform%3D'translate(-75.96%2C-223.53)'%3E%3Cpath%20d%3D'm%20317.73%2C349.33%20c%20-18.82%2C0%20-31.69%2C-10.5%20-37.76%2C-26.66%20-3.17%2C-8.42%20-4.74%2C-17.36%20-4.61%2C-26.36%200%2C-27.11%2012.15%2C-45.94%2039%2C-45.94%2018.04%2C0%2029.17%2C7.87%2035.51%2C26.66%20h%207.72%20l%20-1.05%2C-25.91%20c%20-10.8%2C-6.97%20-24.3%2C-10.5%20-40.72%2C-10.5%20-23.14%2C0%20-42.82%2C10.35%20-53.77%2C29.02%20-5.66%2C9.86%20-8.53%2C21.07%20-8.32%2C32.44%200%2C20.74%209.79%2C39.11%2028.16%2C49.31%2010.06%2C5.37%2021.34%2C8.04%2032.74%2C7.72%2017.92%2C0%2032.14%2C-3.41%2044.74%2C-9.37%20l%203.26%2C-28.57%20h%20-7.87%20c%20-4.72%2C13.05%20-10.35%2C20.89%20-19.69%2C25.05%20-4.57%2C2.06%20-10.35%2C3.11%20-17.32%2C3.11%20z%20m%2081.18%2C-98.96%200.75%2C-12.75%20h%20-5.32%20l%20-23.7%2C7.12%20v%203.86%20l%2010.5%2C4.87%20v%2089.17%20c%200%2C6.07%20-3.11%2C7.42%20-11.25%2C8.44%20v%206.52%20h%2040.31%20v%20-6.52%20c%20-8.17%2C-1.01%20-11.25%2C-2.36%20-11.25%2C-8.44%20V%20250.4%20l%20-0.04%2C-0.04%20z%20m%20160.31%2C108.75%20h%203.11%20l%2027.26%2C-5.17%20v%20-6.67%20l%20-3.82%2C-0.3%20c%20-6.37%2C-0.6%20-8.02%2C-1.91%20-8.02%2C-7.12%20v%20-47.55%20l%200.75%2C-15.26%20h%20-4.31%20l%20-25.76%2C3.71%20v%206.52%20l%202.51%2C0.45%20c%206.97%2C1.01%209.04%2C2.96%209.04%2C7.84%20v%2042.37%20c%20-6.67%2C5.17%20-13.05%2C8.44%20-20.62%2C8.44%20-8.4%2C0%20-13.61%2C-4.27%20-13.61%2C-14.25%20v%20-39.79%20l%200.75%2C-15.26%20h%20-4.42%20l%20-25.8%2C3.71%20v%206.52%20l%202.66%2C0.45%20c%206.97%2C1.01%209.04%2C2.96%209.04%2C7.84%20v%2039.11%20c%200%2C16.57%209.37%2C24.45%2024.3%2C24.45%2011.4%2C0%2020.74%2C-6.07%2027.75%2C-14.51%20l%20-0.75%2C14.51%20-0.04%2C-0.04%20z%20M%20484.3%2C306.36%20c%200%2C-21.19%20-11.25%2C-29.32%20-31.57%2C-29.32%20-17.92%2C0%20-30.94%2C7.42%20-30.94%2C19.72%200%2C3.67%201.31%2C6.49%203.97%2C8.44%20l%2013.65%2C-1.8%20c%20-0.6%2C-4.12%20-0.9%2C-6.64%20-0.9%2C-7.69%200%2C-6.97%203.71%2C-10.5%2011.25%2C-10.5%2011.14%2C0%2016.76%2C7.84%2016.76%2C20.44%20v%204.12%20l%20-28.12%2C8.44%20c%20-9.37%2C2.55%20-14.7%2C4.76%20-18.26%2C9.94%20-1.89%2C3.17%20-2.8%2C6.82%20-2.62%2C10.5%200%2C12%208.25%2C20.47%2022.35%2C20.47%2010.2%2C0%2019.24%2C-4.61%2027.11%2C-13.35%202.81%2C8.74%207.12%2C13.35%2014.81%2C13.35%206.22%2C0%2011.85%2C-2.51%2016.87%2C-7.42%20l%20-1.5%2C-5.17%20c%20-2.17%2C0.6%20-4.27%2C0.9%20-6.49%2C0.9%20-4.31%2C0%20-6.37%2C-3.41%20-6.37%2C-10.09%20v%20-30.97%20z%20m%20-36%2C40.76%20c%20-7.69%2C0%20-12.45%2C-4.46%20-12.45%2C-12.3%200%2C-5.32%202.51%2C-8.44%207.87%2C-10.24%20l%2022.8%2C-7.24%20v%2021.9%20c%20-7.27%2C5.51%20-11.55%2C7.87%20-18.22%2C7.87%20z%20m%20237.36%2C6.82%20v%20-6.67%20l%20-3.86%2C-0.3%20c%20-6.37%2C-0.6%20-7.99%2C-1.91%20-7.99%2C-7.12%20v%20-89.47%20l%200.75%2C-12.75%20h%20-5.36%20l%20-23.7%2C7.12%20v%203.86%20l%2010.5%2C4.87%20v%2029.32%20c%20-5.91%2C-4.05%20-12.98%2C-6.08%20-20.14%2C-5.77%20-23.55%2C0%20-41.92%2C17.92%20-41.92%2C44.74%200%2C22.09%2013.2%2C37.35%2034.95%2C37.35%2011.25%2C0%2021.04%2C-5.47%2027.11%2C-13.95%20l%20-0.75%2C13.95%20h%203.15%20l%2027.26%2C-5.17%20v%200%20z%20m%20-49.35%2C-68.02%20c%2011.25%2C0%2019.69%2C6.52%2019.69%2C18.52%20v%2033.75%20c%20-5.18%2C5.16%20-12.23%2C8%20-19.54%2C7.87%20-16.12%2C0%20-24.3%2C-12.75%20-24.3%2C-29.77%200%2C-19.12%209.34%2C-30.37%2024.15%2C-30.37%20z%20M%20743.3%2C302.8%20c%20-2.1%2C-9.9%20-8.17%2C-15.52%20-16.61%2C-15.52%20-12.6%2C0%20-21.34%2C9.49%20-21.34%2C23.1%200%2C20.14%2010.65%2C33.19%2027.86%2C33.19%2011.48%2C-0.12%2022.04%2C-6.33%2027.71%2C-16.31%20l%205.02%2C1.35%20c%20-2.25%2C17.47%20-18.07%2C30.52%20-37.5%2C30.52%20-22.8%2C0%20-38.51%2C-16.87%20-38.51%2C-40.87%200%2C-24%2017.06%2C-41.21%2039.86%2C-41.21%2017.02%2C0%2029.02%2C10.24%2032.89%2C28.01%20l%20-59.4%2C18.22%20v%20-8.02%20l%2040.01%2C-12.41%20v%20-0.04%20z'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\") center / contain no-repeat;",
      "  mask: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'177.76%2014.09%20512.22%20121.54'%3E%3Cg%20transform%3D'translate(-75.96%2C-223.53)'%3E%3Cpath%20d%3D'm%20317.73%2C349.33%20c%20-18.82%2C0%20-31.69%2C-10.5%20-37.76%2C-26.66%20-3.17%2C-8.42%20-4.74%2C-17.36%20-4.61%2C-26.36%200%2C-27.11%2012.15%2C-45.94%2039%2C-45.94%2018.04%2C0%2029.17%2C7.87%2035.51%2C26.66%20h%207.72%20l%20-1.05%2C-25.91%20c%20-10.8%2C-6.97%20-24.3%2C-10.5%20-40.72%2C-10.5%20-23.14%2C0%20-42.82%2C10.35%20-53.77%2C29.02%20-5.66%2C9.86%20-8.53%2C21.07%20-8.32%2C32.44%200%2C20.74%209.79%2C39.11%2028.16%2C49.31%2010.06%2C5.37%2021.34%2C8.04%2032.74%2C7.72%2017.92%2C0%2032.14%2C-3.41%2044.74%2C-9.37%20l%203.26%2C-28.57%20h%20-7.87%20c%20-4.72%2C13.05%20-10.35%2C20.89%20-19.69%2C25.05%20-4.57%2C2.06%20-10.35%2C3.11%20-17.32%2C3.11%20z%20m%2081.18%2C-98.96%200.75%2C-12.75%20h%20-5.32%20l%20-23.7%2C7.12%20v%203.86%20l%2010.5%2C4.87%20v%2089.17%20c%200%2C6.07%20-3.11%2C7.42%20-11.25%2C8.44%20v%206.52%20h%2040.31%20v%20-6.52%20c%20-8.17%2C-1.01%20-11.25%2C-2.36%20-11.25%2C-8.44%20V%20250.4%20l%20-0.04%2C-0.04%20z%20m%20160.31%2C108.75%20h%203.11%20l%2027.26%2C-5.17%20v%20-6.67%20l%20-3.82%2C-0.3%20c%20-6.37%2C-0.6%20-8.02%2C-1.91%20-8.02%2C-7.12%20v%20-47.55%20l%200.75%2C-15.26%20h%20-4.31%20l%20-25.76%2C3.71%20v%206.52%20l%202.51%2C0.45%20c%206.97%2C1.01%209.04%2C2.96%209.04%2C7.84%20v%2042.37%20c%20-6.67%2C5.17%20-13.05%2C8.44%20-20.62%2C8.44%20-8.4%2C0%20-13.61%2C-4.27%20-13.61%2C-14.25%20v%20-39.79%20l%200.75%2C-15.26%20h%20-4.42%20l%20-25.8%2C3.71%20v%206.52%20l%202.66%2C0.45%20c%206.97%2C1.01%209.04%2C2.96%209.04%2C7.84%20v%2039.11%20c%200%2C16.57%209.37%2C24.45%2024.3%2C24.45%2011.4%2C0%2020.74%2C-6.07%2027.75%2C-14.51%20l%20-0.75%2C14.51%20-0.04%2C-0.04%20z%20M%20484.3%2C306.36%20c%200%2C-21.19%20-11.25%2C-29.32%20-31.57%2C-29.32%20-17.92%2C0%20-30.94%2C7.42%20-30.94%2C19.72%200%2C3.67%201.31%2C6.49%203.97%2C8.44%20l%2013.65%2C-1.8%20c%20-0.6%2C-4.12%20-0.9%2C-6.64%20-0.9%2C-7.69%200%2C-6.97%203.71%2C-10.5%2011.25%2C-10.5%2011.14%2C0%2016.76%2C7.84%2016.76%2C20.44%20v%204.12%20l%20-28.12%2C8.44%20c%20-9.37%2C2.55%20-14.7%2C4.76%20-18.26%2C9.94%20-1.89%2C3.17%20-2.8%2C6.82%20-2.62%2C10.5%200%2C12%208.25%2C20.47%2022.35%2C20.47%2010.2%2C0%2019.24%2C-4.61%2027.11%2C-13.35%202.81%2C8.74%207.12%2C13.35%2014.81%2C13.35%206.22%2C0%2011.85%2C-2.51%2016.87%2C-7.42%20l%20-1.5%2C-5.17%20c%20-2.17%2C0.6%20-4.27%2C0.9%20-6.49%2C0.9%20-4.31%2C0%20-6.37%2C-3.41%20-6.37%2C-10.09%20v%20-30.97%20z%20m%20-36%2C40.76%20c%20-7.69%2C0%20-12.45%2C-4.46%20-12.45%2C-12.3%200%2C-5.32%202.51%2C-8.44%207.87%2C-10.24%20l%2022.8%2C-7.24%20v%2021.9%20c%20-7.27%2C5.51%20-11.55%2C7.87%20-18.22%2C7.87%20z%20m%20237.36%2C6.82%20v%20-6.67%20l%20-3.86%2C-0.3%20c%20-6.37%2C-0.6%20-7.99%2C-1.91%20-7.99%2C-7.12%20v%20-89.47%20l%200.75%2C-12.75%20h%20-5.36%20l%20-23.7%2C7.12%20v%203.86%20l%2010.5%2C4.87%20v%2029.32%20c%20-5.91%2C-4.05%20-12.98%2C-6.08%20-20.14%2C-5.77%20-23.55%2C0%20-41.92%2C17.92%20-41.92%2C44.74%200%2C22.09%2013.2%2C37.35%2034.95%2C37.35%2011.25%2C0%2021.04%2C-5.47%2027.11%2C-13.95%20l%20-0.75%2C13.95%20h%203.15%20l%2027.26%2C-5.17%20v%200%20z%20m%20-49.35%2C-68.02%20c%2011.25%2C0%2019.69%2C6.52%2019.69%2C18.52%20v%2033.75%20c%20-5.18%2C5.16%20-12.23%2C8%20-19.54%2C7.87%20-16.12%2C0%20-24.3%2C-12.75%20-24.3%2C-29.77%200%2C-19.12%209.34%2C-30.37%2024.15%2C-30.37%20z%20M%20743.3%2C302.8%20c%20-2.1%2C-9.9%20-8.17%2C-15.52%20-16.61%2C-15.52%20-12.6%2C0%20-21.34%2C9.49%20-21.34%2C23.1%200%2C20.14%2010.65%2C33.19%2027.86%2C33.19%2011.48%2C-0.12%2022.04%2C-6.33%2027.71%2C-16.31%20l%205.02%2C1.35%20c%20-2.25%2C17.47%20-18.07%2C30.52%20-37.5%2C30.52%20-22.8%2C0%20-38.51%2C-16.87%20-38.51%2C-40.87%200%2C-24%2017.06%2C-41.21%2039.86%2C-41.21%2017.02%2C0%2029.02%2C10.24%2032.89%2C28.01%20l%20-59.4%2C18.22%20v%20-8.02%20l%2040.01%2C-12.41%20v%20-0.04%20z'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\") center / contain no-repeat;",
      "}",
      "",
      "/* Anthropic (alternate): the A\\ lockup + the ANTHROPIC wordmark. */",
      "body[data-dsh-claude-style][data-dsh-claude-brand=\"anthropic\"] :is([class*=\"brandMark\"], [class*=\"railMark\"])::before {",
      "  width: 25.9px;",
      "  height: 18px;",
      "  -webkit-mask: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2046%2032'%3E%3Cpath%20d%3D'M32.73%200H25.7846L38.4499%2032H45.3953L32.73%200Z'%2F%3E%3Cpath%20d%3D'M12.6653%200L0%2032H7.08167L9.67193%2025.28H22.9219L25.5122%2032H32.5939L19.9286%200H12.6653ZM11.9626%2019.3371L16.2969%208.09143L20.6313%2019.3371H11.9626Z'%2F%3E%3C%2Fsvg%3E\") center / contain no-repeat;",
      "  mask: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2046%2032'%3E%3Cpath%20d%3D'M32.73%200H25.7846L38.4499%2032H45.3953L32.73%200Z'%2F%3E%3Cpath%20d%3D'M12.6653%200L0%2032H7.08167L9.67193%2025.28H22.9219L25.5122%2032H32.5939L19.9286%200H12.6653ZM11.9626%2019.3371L16.2969%208.09143L20.6313%2019.3371H11.9626Z'%2F%3E%3C%2Fsvg%3E\") center / contain no-repeat;",
      "}",
      "",
      "body[data-dsh-claude-style][data-dsh-claude-brand=\"anthropic\"] [class*=\"brandIdentity\"] > [class*=\"brandName\"]::before {",
      "  width: 160.9px;",
      "  max-width: 100%;",
      "  height: 18px;",
      "  -webkit-mask: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20143%2016'%3E%3Cpath%20transform%3D'translate(18.299999237060547%2C0.27000001072883606)'%20d%3D'%20M10.716191291809082%2C10.829001426696777%20C10.716191291809082%2C10.829001426696777%203.756195545196533%2C0%203.756195545196533%2C0%20C3.756195545196533%2C0%200%2C0%200%2C0%20C0%2C0%200%2C15.470022201538086%200%2C15.470022201538086%20C0%2C15.470022201538086%203.2038140296936035%2C15.470022201538086%203.2038140296936035%2C15.470022201538086%20C3.2038140296936035%2C15.470022201538086%203.2038140296936035%2C4.6410064697265625%203.2038140296936035%2C4.6410064697265625%20C3.2038140296936035%2C4.6410064697265625%2010.163809776306152%2C15.470022201538086%2010.163809776306152%2C15.470022201538086%20C10.163809776306152%2C15.470022201538086%2013.919991493225098%2C15.470022201538086%2013.919991493225098%2C15.470022201538086%20C13.919991493225098%2C15.470022201538086%2013.919991493225098%2C0%2013.919991493225098%2C0%20C13.919991493225098%2C0%2010.716191291809082%2C0%2010.716191291809082%2C0%20C10.716191291809082%2C0%2010.716191291809082%2C10.829001426696777%2010.716191291809082%2C10.829001426696777%20C10.716191291809082%2C10.829001426696777%2010.716191291809082%2C10.829001426696777%2010.716191291809082%2C10.829001426696777z'%2F%3E%3Cpath%20transform%3D'translate(34.869998931884766%2C0.27000001072883606)'%20d%3D'%20M0%2C2.983504056930542%20C0%2C2.983504056930542%205.19273567199707%2C2.983504056930542%205.19273567199707%2C2.983504056930542%20C5.19273567199707%2C2.983504056930542%205.19273567199707%2C15.470022201538086%205.19273567199707%2C15.470022201538086%20C5.19273567199707%2C15.470022201538086%208.507256507873535%2C15.470022201538086%208.507256507873535%2C15.470022201538086%20C8.507256507873535%2C15.470022201538086%208.507256507873535%2C2.983504056930542%208.507256507873535%2C2.983504056930542%20C8.507256507873535%2C2.983504056930542%2013.700006484985352%2C2.983504056930542%2013.700006484985352%2C2.983504056930542%20C13.700006484985352%2C2.983504056930542%2013.700006484985352%2C0%2013.700006484985352%2C0%20C13.700006484985352%2C0%200%2C0%200%2C0%20C0%2C0%200%2C2.983504056930542%200%2C2.983504056930542%20C0%2C2.983504056930542%200%2C2.983504056930542%200%2C2.983504056930542z'%2F%3E%3Cpath%20transform%3D'translate(51.22999954223633%2C0.27000001072883606)'%20d%3D'%20M10.605714797973633%2C6.165900230407715%20C10.605714797973633%2C6.165900230407715%203.3142902851104736%2C6.165900230407715%203.3142902851104736%2C6.165900230407715%20C3.3142902851104736%2C6.165900230407715%203.3142902851104736%2C0%203.3142902851104736%2C0%20C3.3142902851104736%2C0%200%2C0%200%2C0%20C0%2C0%200%2C15.470022201538086%200%2C15.470022201538086%20C0%2C15.470022201538086%203.3142902851104736%2C15.470022201538086%203.3142902851104736%2C15.470022201538086%20C3.3142902851104736%2C15.470022201538086%203.3142902851104736%2C9.149404525756836%203.3142902851104736%2C9.149404525756836%20C3.3142902851104736%2C9.149404525756836%2010.605714797973633%2C9.149404525756836%2010.605714797973633%2C9.149404525756836%20C10.605714797973633%2C9.149404525756836%2010.605714797973633%2C15.470022201538086%2010.605714797973633%2C15.470022201538086%20C10.605714797973633%2C15.470022201538086%2013.919991493225098%2C15.470022201538086%2013.919991493225098%2C15.470022201538086%20C13.919991493225098%2C15.470022201538086%2013.919991493225098%2C0%2013.919991493225098%2C0%20C13.919991493225098%2C0%2010.605714797973633%2C0%2010.605714797973633%2C0%20C10.605714797973633%2C0%2010.605714797973633%2C6.165900230407715%2010.605714797973633%2C6.165900230407715%20C10.605714797973633%2C6.165900230407715%2010.605714797973633%2C6.165900230407715%2010.605714797973633%2C6.165900230407715z'%2F%3E%3Cpath%20transform%3D'translate(69.23999786376953%2C0.27000001072883606)'%20d%3D'%20M3.3151700496673584%2C2.983504056930542%20C3.3151700496673584%2C2.983504056930542%207.403865814208984%2C2.983504056930542%207.403865814208984%2C2.983504056930542%20C9.03934097290039%2C2.983504056930542%209.901290893554688%2C3.5801939964294434%209.901290893554688%2C4.707304000854492%20C9.901290893554688%2C5.834399700164795%209.03934097290039%2C6.431103706359863%207.403865814208984%2C6.431103706359863%20C7.403865814208984%2C6.431103706359863%203.3151700496673584%2C6.431103706359863%203.3151700496673584%2C6.431103706359863%20C3.3151700496673584%2C6.431103706359863%203.3151700496673584%2C2.983504056930542%203.3151700496673584%2C2.983504056930542%20C3.3151700496673584%2C2.983504056930542%203.3151700496673584%2C2.983504056930542%203.3151700496673584%2C2.983504056930542z%20M13.216461181640625%2C4.707304000854492%20C13.216461181640625%2C1.7900969982147217%2011.072648048400879%2C0%207.558576583862305%2C0%20C7.558576583862305%2C0%200%2C0%200%2C0%20C0%2C0%200%2C15.470022201538086%200%2C15.470022201538086%20C0%2C15.470022201538086%203.3151700496673584%2C15.470022201538086%203.3151700496673584%2C15.470022201538086%20C3.3151700496673584%2C15.470022201538086%203.3151700496673584%2C9.414593696594238%203.3151700496673584%2C9.414593696594238%20C3.3151700496673584%2C9.414593696594238%207.005825519561768%2C9.414593696594238%207.005825519561768%2C9.414593696594238%20C7.005825519561768%2C9.414593696594238%2010.321218490600586%2C15.470022201538086%2010.321218490600586%2C15.470022201538086%20C10.321218490600586%2C15.470022201538086%2013.990056991577148%2C15.470022201538086%2013.990056991577148%2C15.470022201538086%20C13.990056991577148%2C15.470022201538086%2010.319005966186523%2C8.953378677368164%2010.319005966186523%2C8.953378677368164%20C12.161579132080078%2C8.245061874389648%2013.216461181640625%2C6.753532409667969%2013.216461181640625%2C4.707304000854492%20C13.216461181640625%2C4.707304000854492%2013.216461181640625%2C4.707304000854492%2013.216461181640625%2C4.707304000854492z'%2F%3E%3Cpath%20transform%3D'translate(84.98999786376953%2C0)'%20d%3D'%20M7.622087478637695%2C12.906073570251465%20C5.015110492706299%2C12.906073570251465%203.4244225025177%2C11.049725532531738%203.4244225025177%2C8.022093772888184%20C3.4244225025177%2C4.95027494430542%205.015110492706299%2C3.0939269065856934%207.622087478637695%2C3.0939269065856934%20C10.206976890563965%2C3.0939269065856934%2011.775577545166016%2C4.95027494430542%2011.775577545166016%2C8.022093772888184%20C11.775577545166016%2C11.049725532531738%2010.206976890563965%2C12.906073570251465%207.622087478637695%2C12.906073570251465%20C7.622087478637695%2C12.906073570251465%207.622087478637695%2C12.906073570251465%207.622087478637695%2C12.906073570251465z%20M7.622087478637695%2C0%20C3.1593029499053955%2C0%200%2C3.3149218559265137%200%2C8.022093772888184%20C0%2C12.685078620910645%203.1593029499053955%2C16%207.622087478637695%2C16%20C12.062784194946289%2C16%2015.200028419494629%2C12.685078620910645%2015.200028419494629%2C8.022093772888184%20C15.200028419494629%2C3.3149218559265137%2012.062784194946289%2C0%207.622087478637695%2C0%20C7.622087478637695%2C0%207.622087478637695%2C0%207.622087478637695%2C0z'%2F%3E%3Cpath%20transform%3D'translate(103.29000091552734%2C0.27000001072883606)'%20d%3D'%20M7.405848026275635%2C6.873104095458984%20C7.405848026275635%2C6.873104095458984%203.3160574436187744%2C6.873104095458984%203.3160574436187744%2C6.873104095458984%20C3.3160574436187744%2C6.873104095458984%203.3160574436187744%2C2.983504056930542%203.3160574436187744%2C2.983504056930542%20C3.3160574436187744%2C2.983504056930542%207.405848026275635%2C2.983504056930542%207.405848026275635%2C2.983504056930542%20C9.04176139831543%2C2.983504056930542%209.90394115447998%2C3.646505117416382%209.90394115447998%2C4.928304195404053%20C9.90394115447998%2C6.2101030349731445%209.04176139831543%2C6.873104095458984%207.405848026275635%2C6.873104095458984%20C7.405848026275635%2C6.873104095458984%207.405848026275635%2C6.873104095458984%207.405848026275635%2C6.873104095458984z%20M7.5605998039245605%2C0%20C7.5605998039245605%2C0%200%2C0%200%2C0%20C0%2C0%200%2C15.470022201538086%200%2C15.470022201538086%20C0%2C15.470022201538086%203.3160574436187744%2C15.470022201538086%203.3160574436187744%2C15.470022201538086%20C3.3160574436187744%2C15.470022201538086%203.3160574436187744%2C9.85659408569336%203.3160574436187744%2C9.85659408569336%20C3.3160574436187744%2C9.85659408569336%207.5605998039245605%2C9.85659408569336%207.5605998039245605%2C9.85659408569336%20C11.07561206817627%2C9.85659408569336%2013.219999313354492%2C8.000200271606445%2013.219999313354492%2C4.928304195404053%20C13.219999313354492%2C1.8563942909240723%2011.07561206817627%2C0%207.5605998039245605%2C0%20C7.5605998039245605%2C0%207.5605998039245605%2C0%207.5605998039245605%2C0z'%2F%3E%3Cpath%20transform%3D'translate(128.0399932861328%2C0)'%20d%3D'%20M10.914844512939453%2C10.5414400100708%20C10.340370178222656%2C12.044201850891113%209.191434860229492%2C12.906073570251465%207.622706890106201%2C12.906073570251465%20C5.0155181884765625%2C12.906073570251465%203.4246866703033447%2C11.049725532531738%203.4246866703033447%2C8.022093772888184%20C3.4246866703033447%2C4.95027494430542%205.0155181884765625%2C3.0939269065856934%207.622706890106201%2C3.0939269065856934%20C9.191434860229492%2C3.0939269065856934%2010.340370178222656%2C3.9557981491088867%2010.914844512939453%2C5.458559989929199%20C10.914844512939453%2C5.458559989929199%2014.427860260009766%2C5.458559989929199%2014.427860260009766%2C5.458559989929199%20C13.566211700439453%2C2.1436522006988525%2010.981111526489258%2C0%207.622706890106201%2C0%20C3.1595458984375%2C0%200%2C3.3149218559265137%200%2C8.022093772888184%20C0%2C12.685078620910645%203.1595458984375%2C16%207.622706890106201%2C16%20C11.003214836120605%2C16%2013.588300704956055%2C13.834254264831543%2014.449976921081543%2C10.5414400100708%20C14.449976921081543%2C10.5414400100708%2010.914844512939453%2C10.5414400100708%2010.914844512939453%2C10.5414400100708%20C10.914844512939453%2C10.5414400100708%2010.914844512939453%2C10.5414400100708%2010.914844512939453%2C10.5414400100708z'%2F%3E%3Cpath%20transform%3D'translate(117.83000183105469%2C0.27000001072883606)'%20d%3D'%20M0%2C0%20C0%2C0%206.1677093505859375%2C15.470022201538086%206.1677093505859375%2C15.470022201538086%20C6.1677093505859375%2C15.470022201538086%209.550004005432129%2C15.470022201538086%209.550004005432129%2C15.470022201538086%20C9.550004005432129%2C15.470022201538086%203.382294178009033%2C0%203.382294178009033%2C0%20C3.382294178009033%2C0%200%2C0%200%2C0%20C0%2C0%200%2C0%200%2C0z'%2F%3E%3Cpath%20transform%3D'translate(0%2C0.27000001072883606)'%20d%3D'%20M5.824605464935303%2C9.348296165466309%20C5.824605464935303%2C9.348296165466309%207.93500280380249%2C3.911694288253784%207.93500280380249%2C3.911694288253784%20C7.93500280380249%2C3.911694288253784%2010.045400619506836%2C9.348296165466309%2010.045400619506836%2C9.348296165466309%20C10.045400619506836%2C9.348296165466309%205.824605464935303%2C9.348296165466309%205.824605464935303%2C9.348296165466309%20C5.824605464935303%2C9.348296165466309%205.824605464935303%2C9.348296165466309%205.824605464935303%2C9.348296165466309z%20M6.166755199432373%2C0%20C6.166755199432373%2C0%200%2C15.470022201538086%200%2C15.470022201538086%20C0%2C15.470022201538086%203.4480772018432617%2C15.470022201538086%203.4480772018432617%2C15.470022201538086%20C3.4480772018432617%2C15.470022201538086%204.709278583526611%2C12.22130012512207%204.709278583526611%2C12.22130012512207%20C4.709278583526611%2C12.22130012512207%2011.16093635559082%2C12.22130012512207%2011.16093635559082%2C12.22130012512207%20C11.16093635559082%2C12.22130012512207%2012.421928405761719%2C15.470022201538086%2012.421928405761719%2C15.470022201538086%20C12.421928405761719%2C15.470022201538086%2015.87000560760498%2C15.470022201538086%2015.87000560760498%2C15.470022201538086%20C15.87000560760498%2C15.470022201538086%209.703250885009766%2C0%209.703250885009766%2C0%20C9.703250885009766%2C0%206.166755199432373%2C0%206.166755199432373%2C0%20C6.166755199432373%2C0%206.166755199432373%2C0%206.166755199432373%2C0z'%2F%3E%3C%2Fsvg%3E\") center / contain no-repeat;",
      "  mask: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20143%2016'%3E%3Cpath%20transform%3D'translate(18.299999237060547%2C0.27000001072883606)'%20d%3D'%20M10.716191291809082%2C10.829001426696777%20C10.716191291809082%2C10.829001426696777%203.756195545196533%2C0%203.756195545196533%2C0%20C3.756195545196533%2C0%200%2C0%200%2C0%20C0%2C0%200%2C15.470022201538086%200%2C15.470022201538086%20C0%2C15.470022201538086%203.2038140296936035%2C15.470022201538086%203.2038140296936035%2C15.470022201538086%20C3.2038140296936035%2C15.470022201538086%203.2038140296936035%2C4.6410064697265625%203.2038140296936035%2C4.6410064697265625%20C3.2038140296936035%2C4.6410064697265625%2010.163809776306152%2C15.470022201538086%2010.163809776306152%2C15.470022201538086%20C10.163809776306152%2C15.470022201538086%2013.919991493225098%2C15.470022201538086%2013.919991493225098%2C15.470022201538086%20C13.919991493225098%2C15.470022201538086%2013.919991493225098%2C0%2013.919991493225098%2C0%20C13.919991493225098%2C0%2010.716191291809082%2C0%2010.716191291809082%2C0%20C10.716191291809082%2C0%2010.716191291809082%2C10.829001426696777%2010.716191291809082%2C10.829001426696777%20C10.716191291809082%2C10.829001426696777%2010.716191291809082%2C10.829001426696777%2010.716191291809082%2C10.829001426696777z'%2F%3E%3Cpath%20transform%3D'translate(34.869998931884766%2C0.27000001072883606)'%20d%3D'%20M0%2C2.983504056930542%20C0%2C2.983504056930542%205.19273567199707%2C2.983504056930542%205.19273567199707%2C2.983504056930542%20C5.19273567199707%2C2.983504056930542%205.19273567199707%2C15.470022201538086%205.19273567199707%2C15.470022201538086%20C5.19273567199707%2C15.470022201538086%208.507256507873535%2C15.470022201538086%208.507256507873535%2C15.470022201538086%20C8.507256507873535%2C15.470022201538086%208.507256507873535%2C2.983504056930542%208.507256507873535%2C2.983504056930542%20C8.507256507873535%2C2.983504056930542%2013.700006484985352%2C2.983504056930542%2013.700006484985352%2C2.983504056930542%20C13.700006484985352%2C2.983504056930542%2013.700006484985352%2C0%2013.700006484985352%2C0%20C13.700006484985352%2C0%200%2C0%200%2C0%20C0%2C0%200%2C2.983504056930542%200%2C2.983504056930542%20C0%2C2.983504056930542%200%2C2.983504056930542%200%2C2.983504056930542z'%2F%3E%3Cpath%20transform%3D'translate(51.22999954223633%2C0.27000001072883606)'%20d%3D'%20M10.605714797973633%2C6.165900230407715%20C10.605714797973633%2C6.165900230407715%203.3142902851104736%2C6.165900230407715%203.3142902851104736%2C6.165900230407715%20C3.3142902851104736%2C6.165900230407715%203.3142902851104736%2C0%203.3142902851104736%2C0%20C3.3142902851104736%2C0%200%2C0%200%2C0%20C0%2C0%200%2C15.470022201538086%200%2C15.470022201538086%20C0%2C15.470022201538086%203.3142902851104736%2C15.470022201538086%203.3142902851104736%2C15.470022201538086%20C3.3142902851104736%2C15.470022201538086%203.3142902851104736%2C9.149404525756836%203.3142902851104736%2C9.149404525756836%20C3.3142902851104736%2C9.149404525756836%2010.605714797973633%2C9.149404525756836%2010.605714797973633%2C9.149404525756836%20C10.605714797973633%2C9.149404525756836%2010.605714797973633%2C15.470022201538086%2010.605714797973633%2C15.470022201538086%20C10.605714797973633%2C15.470022201538086%2013.919991493225098%2C15.470022201538086%2013.919991493225098%2C15.470022201538086%20C13.919991493225098%2C15.470022201538086%2013.919991493225098%2C0%2013.919991493225098%2C0%20C13.919991493225098%2C0%2010.605714797973633%2C0%2010.605714797973633%2C0%20C10.605714797973633%2C0%2010.605714797973633%2C6.165900230407715%2010.605714797973633%2C6.165900230407715%20C10.605714797973633%2C6.165900230407715%2010.605714797973633%2C6.165900230407715%2010.605714797973633%2C6.165900230407715z'%2F%3E%3Cpath%20transform%3D'translate(69.23999786376953%2C0.27000001072883606)'%20d%3D'%20M3.3151700496673584%2C2.983504056930542%20C3.3151700496673584%2C2.983504056930542%207.403865814208984%2C2.983504056930542%207.403865814208984%2C2.983504056930542%20C9.03934097290039%2C2.983504056930542%209.901290893554688%2C3.5801939964294434%209.901290893554688%2C4.707304000854492%20C9.901290893554688%2C5.834399700164795%209.03934097290039%2C6.431103706359863%207.403865814208984%2C6.431103706359863%20C7.403865814208984%2C6.431103706359863%203.3151700496673584%2C6.431103706359863%203.3151700496673584%2C6.431103706359863%20C3.3151700496673584%2C6.431103706359863%203.3151700496673584%2C2.983504056930542%203.3151700496673584%2C2.983504056930542%20C3.3151700496673584%2C2.983504056930542%203.3151700496673584%2C2.983504056930542%203.3151700496673584%2C2.983504056930542z%20M13.216461181640625%2C4.707304000854492%20C13.216461181640625%2C1.7900969982147217%2011.072648048400879%2C0%207.558576583862305%2C0%20C7.558576583862305%2C0%200%2C0%200%2C0%20C0%2C0%200%2C15.470022201538086%200%2C15.470022201538086%20C0%2C15.470022201538086%203.3151700496673584%2C15.470022201538086%203.3151700496673584%2C15.470022201538086%20C3.3151700496673584%2C15.470022201538086%203.3151700496673584%2C9.414593696594238%203.3151700496673584%2C9.414593696594238%20C3.3151700496673584%2C9.414593696594238%207.005825519561768%2C9.414593696594238%207.005825519561768%2C9.414593696594238%20C7.005825519561768%2C9.414593696594238%2010.321218490600586%2C15.470022201538086%2010.321218490600586%2C15.470022201538086%20C10.321218490600586%2C15.470022201538086%2013.990056991577148%2C15.470022201538086%2013.990056991577148%2C15.470022201538086%20C13.990056991577148%2C15.470022201538086%2010.319005966186523%2C8.953378677368164%2010.319005966186523%2C8.953378677368164%20C12.161579132080078%2C8.245061874389648%2013.216461181640625%2C6.753532409667969%2013.216461181640625%2C4.707304000854492%20C13.216461181640625%2C4.707304000854492%2013.216461181640625%2C4.707304000854492%2013.216461181640625%2C4.707304000854492z'%2F%3E%3Cpath%20transform%3D'translate(84.98999786376953%2C0)'%20d%3D'%20M7.622087478637695%2C12.906073570251465%20C5.015110492706299%2C12.906073570251465%203.4244225025177%2C11.049725532531738%203.4244225025177%2C8.022093772888184%20C3.4244225025177%2C4.95027494430542%205.015110492706299%2C3.0939269065856934%207.622087478637695%2C3.0939269065856934%20C10.206976890563965%2C3.0939269065856934%2011.775577545166016%2C4.95027494430542%2011.775577545166016%2C8.022093772888184%20C11.775577545166016%2C11.049725532531738%2010.206976890563965%2C12.906073570251465%207.622087478637695%2C12.906073570251465%20C7.622087478637695%2C12.906073570251465%207.622087478637695%2C12.906073570251465%207.622087478637695%2C12.906073570251465z%20M7.622087478637695%2C0%20C3.1593029499053955%2C0%200%2C3.3149218559265137%200%2C8.022093772888184%20C0%2C12.685078620910645%203.1593029499053955%2C16%207.622087478637695%2C16%20C12.062784194946289%2C16%2015.200028419494629%2C12.685078620910645%2015.200028419494629%2C8.022093772888184%20C15.200028419494629%2C3.3149218559265137%2012.062784194946289%2C0%207.622087478637695%2C0%20C7.622087478637695%2C0%207.622087478637695%2C0%207.622087478637695%2C0z'%2F%3E%3Cpath%20transform%3D'translate(103.29000091552734%2C0.27000001072883606)'%20d%3D'%20M7.405848026275635%2C6.873104095458984%20C7.405848026275635%2C6.873104095458984%203.3160574436187744%2C6.873104095458984%203.3160574436187744%2C6.873104095458984%20C3.3160574436187744%2C6.873104095458984%203.3160574436187744%2C2.983504056930542%203.3160574436187744%2C2.983504056930542%20C3.3160574436187744%2C2.983504056930542%207.405848026275635%2C2.983504056930542%207.405848026275635%2C2.983504056930542%20C9.04176139831543%2C2.983504056930542%209.90394115447998%2C3.646505117416382%209.90394115447998%2C4.928304195404053%20C9.90394115447998%2C6.2101030349731445%209.04176139831543%2C6.873104095458984%207.405848026275635%2C6.873104095458984%20C7.405848026275635%2C6.873104095458984%207.405848026275635%2C6.873104095458984%207.405848026275635%2C6.873104095458984z%20M7.5605998039245605%2C0%20C7.5605998039245605%2C0%200%2C0%200%2C0%20C0%2C0%200%2C15.470022201538086%200%2C15.470022201538086%20C0%2C15.470022201538086%203.3160574436187744%2C15.470022201538086%203.3160574436187744%2C15.470022201538086%20C3.3160574436187744%2C15.470022201538086%203.3160574436187744%2C9.85659408569336%203.3160574436187744%2C9.85659408569336%20C3.3160574436187744%2C9.85659408569336%207.5605998039245605%2C9.85659408569336%207.5605998039245605%2C9.85659408569336%20C11.07561206817627%2C9.85659408569336%2013.219999313354492%2C8.000200271606445%2013.219999313354492%2C4.928304195404053%20C13.219999313354492%2C1.8563942909240723%2011.07561206817627%2C0%207.5605998039245605%2C0%20C7.5605998039245605%2C0%207.5605998039245605%2C0%207.5605998039245605%2C0z'%2F%3E%3Cpath%20transform%3D'translate(128.0399932861328%2C0)'%20d%3D'%20M10.914844512939453%2C10.5414400100708%20C10.340370178222656%2C12.044201850891113%209.191434860229492%2C12.906073570251465%207.622706890106201%2C12.906073570251465%20C5.0155181884765625%2C12.906073570251465%203.4246866703033447%2C11.049725532531738%203.4246866703033447%2C8.022093772888184%20C3.4246866703033447%2C4.95027494430542%205.0155181884765625%2C3.0939269065856934%207.622706890106201%2C3.0939269065856934%20C9.191434860229492%2C3.0939269065856934%2010.340370178222656%2C3.9557981491088867%2010.914844512939453%2C5.458559989929199%20C10.914844512939453%2C5.458559989929199%2014.427860260009766%2C5.458559989929199%2014.427860260009766%2C5.458559989929199%20C13.566211700439453%2C2.1436522006988525%2010.981111526489258%2C0%207.622706890106201%2C0%20C3.1595458984375%2C0%200%2C3.3149218559265137%200%2C8.022093772888184%20C0%2C12.685078620910645%203.1595458984375%2C16%207.622706890106201%2C16%20C11.003214836120605%2C16%2013.588300704956055%2C13.834254264831543%2014.449976921081543%2C10.5414400100708%20C14.449976921081543%2C10.5414400100708%2010.914844512939453%2C10.5414400100708%2010.914844512939453%2C10.5414400100708%20C10.914844512939453%2C10.5414400100708%2010.914844512939453%2C10.5414400100708%2010.914844512939453%2C10.5414400100708z'%2F%3E%3Cpath%20transform%3D'translate(117.83000183105469%2C0.27000001072883606)'%20d%3D'%20M0%2C0%20C0%2C0%206.1677093505859375%2C15.470022201538086%206.1677093505859375%2C15.470022201538086%20C6.1677093505859375%2C15.470022201538086%209.550004005432129%2C15.470022201538086%209.550004005432129%2C15.470022201538086%20C9.550004005432129%2C15.470022201538086%203.382294178009033%2C0%203.382294178009033%2C0%20C3.382294178009033%2C0%200%2C0%200%2C0%20C0%2C0%200%2C0%200%2C0z'%2F%3E%3Cpath%20transform%3D'translate(0%2C0.27000001072883606)'%20d%3D'%20M5.824605464935303%2C9.348296165466309%20C5.824605464935303%2C9.348296165466309%207.93500280380249%2C3.911694288253784%207.93500280380249%2C3.911694288253784%20C7.93500280380249%2C3.911694288253784%2010.045400619506836%2C9.348296165466309%2010.045400619506836%2C9.348296165466309%20C10.045400619506836%2C9.348296165466309%205.824605464935303%2C9.348296165466309%205.824605464935303%2C9.348296165466309%20C5.824605464935303%2C9.348296165466309%205.824605464935303%2C9.348296165466309%205.824605464935303%2C9.348296165466309z%20M6.166755199432373%2C0%20C6.166755199432373%2C0%200%2C15.470022201538086%200%2C15.470022201538086%20C0%2C15.470022201538086%203.4480772018432617%2C15.470022201538086%203.4480772018432617%2C15.470022201538086%20C3.4480772018432617%2C15.470022201538086%204.709278583526611%2C12.22130012512207%204.709278583526611%2C12.22130012512207%20C4.709278583526611%2C12.22130012512207%2011.16093635559082%2C12.22130012512207%2011.16093635559082%2C12.22130012512207%20C11.16093635559082%2C12.22130012512207%2012.421928405761719%2C15.470022201538086%2012.421928405761719%2C15.470022201538086%20C12.421928405761719%2C15.470022201538086%2015.87000560760498%2C15.470022201538086%2015.87000560760498%2C15.470022201538086%20C15.87000560760498%2C15.470022201538086%209.703250885009766%2C0%209.703250885009766%2C0%20C9.703250885009766%2C0%206.166755199432373%2C0%206.166755199432373%2C0%20C6.166755199432373%2C0%206.166755199432373%2C0%206.166755199432373%2C0z'%2F%3E%3C%2Fsvg%3E\") center / contain no-repeat;",
      "}",
      "",
      "/* ---------- Claude Code layout: new session button ---------- */",
      "/* Narrow height matching conversation row, persistent hover plate, left-aligned plus icon */",
      "body[data-dsh-claude-style] button[class*=\"newSession\"] {",
      "  display: flex !important;",
      "  align-items: center !important;",
      "  justify-content: flex-start !important;",
      "  text-align: left !important;",
      "  width: 100% !important;",
      "  box-sizing: border-box !important;",
      "  height: 28px !important;",
      "  line-height: 28px !important;",
      "  padding: 0 8px !important;",
      "  margin: 0 0 6px 0 !important;",
      "  border: none !important;",
      "  border-radius: 6px !important;",
      "  background: var(--dsh-claude-hover-bg, rgba(0, 0, 0, 0.08)) !important;",
      "  color: var(--dsw-alias-label-primary, #141413) !important;",
      "  font-family: var(--dsw-font-family) !important;",
      "  font-size: 13px !important;",
      "  font-weight: 500 !important;",
      "  cursor: pointer !important;",
      "  box-shadow: none !important;",
      "  transition: background-color 0.12s ease !important;",
      "}",
      "body[data-dsh-claude-style] button[class*=\"newSession\"]:hover {",
      "  background: rgba(0, 0, 0, 0.12) !important;",
      "}",
      "body[data-dsh-claude-style][data-ds-dark-theme] button[class*=\"newSession\"] {",
      "  color: #f5f4ef !important;",
      "}",
      "body[data-dsh-claude-style][data-ds-dark-theme] button[class*=\"newSession\"]:hover {",
      "  background: rgba(255, 255, 255, 0.12) !important;",
      "}",
      "body[data-dsh-claude-style] button[class*=\"newSession\"] svg {",
      "  display: none !important;",
      "}",
      "body[data-dsh-claude-style] button[class*=\"newSession\"]::before {",
      "  content: \"\";",
      "  display: inline-block !important;",
      "  width: 13px !important;",
      "  height: 13px !important;",
      "  margin-right: 6px !important;",
      "  flex: none !important;",
      "  background-color: currentColor !important;",
      "  -webkit-mask: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><line x1='12' y1='5' x2='12' y2='19'></line><line x1='5' y1='12' x2='19' y2='12'></line></svg>\") center / contain no-repeat !important;",
      "  mask: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><line x1='12' y1='5' x2='12' y2='19'></line><line x1='5' y1='12' x2='19' y2='12'></line></svg>\") center / contain no-repeat !important;",
      "}",
      "",
      "/* ---------- Claude Code layout: workspace & session sidebar ---------- */",
      "/* 1. Typography: Anthropic Sans and compact font sizes */",
      "body[data-dsh-claude-style] :is([data-pane=\"sidebar\"], [class*=\"sidebarCol\"], [class*=\"treeBody\"], [role=\"tree\"]) :is([class*=\"title\"], [class*=\"projectText\"], [class*=\"sectionLabel\"], [class*=\"sessionRow\"], [class*=\"projectRow\"], [class*=\"time\"]) {",
      "  font-family: var(--dsw-font-family) !important;",
      "}",
      "body[data-dsh-claude-style] [class*=\"projectRow\"] [class*=\"title\"] {",
      "  font-size: 13px !important;",
      "  line-height: 18px !important;",
      "  letter-spacing: normal !important;",
      "}",
      "body[data-dsh-claude-style] [class*=\"sessionRow\"] [class*=\"title\"] {",
      "  font-size: 13px !important;",
      "  line-height: 18px !important;",
      "  letter-spacing: normal !important;",
      "  color: var(--dsw-alias-label-secondary, #787672) !important;",
      "  transition: color 0.12s ease !important;",
      "}",
      "body[data-dsh-claude-style][data-ds-dark-theme] [class*=\"sessionRow\"] [class*=\"title\"] {",
      "  color: #8c8983 !important;",
      "}",
      "body[data-dsh-claude-style] [class*=\"sessionRow\"]:is(:hover, [class*=\"selected\"], [class*=\"active\"], [class*=\"menuOpen\"], [aria-selected=\"true\"], [data-selected=\"true\"]) [class*=\"title\"] {",
      "  color: var(--dsw-alias-label-primary, #141413) !important;",
      "}",
      "body[data-dsh-claude-style][data-ds-dark-theme] [class*=\"sessionRow\"]:is(:hover, [class*=\"selected\"], [class*=\"active\"], [class*=\"menuOpen\"], [aria-selected=\"true\"], [data-selected=\"true\"]) [class*=\"title\"] {",
      "  color: #f5f4ef !important;",
      "}",
      "body[data-dsh-claude-style] [class*=\"sessionRow\"] [class*=\"time\"] {",
      "  font-size: 11px !important;",
      "  line-height: 16px !important;",
      "}",
      "body[data-dsh-claude-style] [class*=\"sectionLabel\"] {",
      "  font-size: 12px !important;",
      "  line-height: 16px !important;",
      "}",
      "",
      "/* 2. Compact scale: shrunken heights, margins, and paddings */",
      "body[data-dsh-claude-style] [class*=\"projectRow\"] {",
      "  height: 28px !important;",
      "  min-height: 28px !important;",
      "  padding: 0 6px !important;",
      "  gap: 4px !important;",
      "  border-radius: 6px !important;",
      "}",
      "body[data-dsh-claude-style] [class*=\"sessionRow\"] {",
      "  height: 28px !important;",
      "  min-height: 28px !important;",
      "  padding: 0 6px !important;",
      "  gap: 0 !important;",
      "  border-radius: 6px !important;",
      "}",
      "body[data-dsh-claude-style] [class*=\"sessionRow\"] [class*=\"title\"] {",
      "  margin: 0 4px !important;",
      "}",
      "body[data-dsh-claude-style] [class*=\"groupSection\"] > * + * {",
      "  margin-top: 1px !important;",
      "}",
      "body[data-dsh-claude-style] [class*=\"groupSection\"] + [class*=\"groupSection\"] {",
      "  margin-top: 6px !important;",
      "}",
      "body[data-dsh-claude-style] [class*=\"projectRow\"] [class*=\"rowActions\"],",
      "body[data-dsh-claude-style] [class*=\"sessionRow\"] [class*=\"rowActions\"] {",
      "  gap: 6px !important;",
      "}",
      "body[data-dsh-claude-style] :is([class*=\"projectRow\"], [class*=\"sessionRow\"]) [class*=\"iconButton\"] {",
      "  width: 16px !important;",
      "  height: 16px !important;",
      "}",
      "",
      "/* 3. Hover & active background: session rows only. A folder row is a heading,",
      "   not a target, so it never takes a hover plate — its hover cue is the label",
      "   darkening (rule 4). This also cancels the shipped",
      "   .projectRow:hover{background:var(--dsw-alias-interactive-bg-hover)}. */",
      "body[data-dsh-claude-style] [class*=\"sessionRow\"]:hover,",
      "body[data-dsh-claude-style] [class*=\"sessionRow\"][class*=\"selected\"],",
      "body[data-dsh-claude-style] [class*=\"sessionRow\"][class*=\"menuOpen\"] {",
      "  background: var(--dsh-claude-hover-bg, rgba(0, 0, 0, 0.08)) !important;",
      "}",
      "",
      "body[data-dsh-claude-style] [class*=\"projectRow\"],",
      "body[data-dsh-claude-style] [class*=\"projectRow\"]:hover,",
      "body[data-dsh-claude-style] [class*=\"projectRow\"][class*=\"menuOpen\"],",
      "body[data-dsh-claude-style] [class*=\"projectRow\"][class*=\"selected\"] {",
      "  background: transparent !important;",
      "}",
      "",
      "/* 4. Folder header styling: grey font, remove folder icon, dropdown arrow */",
      "/* Folder text: muted grey */",
      "body[data-dsh-claude-style] [class*=\"projectRow\"] [class*=\"title\"] {",
      "  color: var(--dsw-alias-label-secondary, #787672) !important;",
      "  font-weight: 500 !important;",
      "}",
      "body[data-dsh-claude-style] [class*=\"projectRow\"]:hover [class*=\"title\"] {",
      "  color: var(--dsw-alias-label-primary, #141413) !important;",
      "}",
      "body[data-dsh-claude-style] [class*=\"projectRow\"] [class*=\"folderActive\"] {",
      "  color: inherit !important;",
      "}",
      "/* Cancel folder icon */",
      "body[data-dsh-claude-style] [class*=\"projectRow\"] [class*=\"folder\"] {",
      "  display: none !important;",
      "}",
      "/* Project row flex layout: Title on the left, dropdown arrow next to title */",
      "body[data-dsh-claude-style] [class*=\"projectRow\"] {",
      "  display: flex !important;",
      "  align-items: center !important;",
      "}",
      "body[data-dsh-claude-style] [class*=\"projectRow\"] [class*=\"projectText\"] {",
      "  order: 1 !important;",
      "  flex: 0 0 auto !important;",
      "  margin-right: 2px !important;",
      "}",
      "/* The chevron is a reveal-on-hover affordance, never a resting one. The",
      "   shipped CSS gates it on .projectRow:hover alone, which drops it the moment",
      "   the pointer moves down into the folder's conversation list; :has() on the",
      "   group section widens the trigger to the folder row or any row inside it. */",
      "body[data-dsh-claude-style] [class*=\"projectRow\"] [class*=\"chevron\"] {",
      "  order: 2 !important;",
      "  display: none !important;",
      "  width: 14px !important;",
      "  height: 14px !important;",
      "  align-items: center !important;",
      "  justify-content: center !important;",
      "  color: var(--dsw-alias-label-secondary, #787672) !important;",
      "}",
      "body[data-dsh-claude-style] [class*=\"groupSection\"]:has(:is([class*=\"projectRow\"], [class*=\"sessionRow\"]):hover) [class*=\"projectRow\"] [class*=\"chevron\"] {",
      "  display: inline-flex !important;",
      "}",
      "body[data-dsh-claude-style] [class*=\"projectRow\"] [class*=\"rowActions\"] {",
      "  order: 3 !important;",
      "  margin-left: auto !important;",
      "}",
      "/* Cancel solid lower triangle, replace with dropdown menu arrow */",
      "body[data-dsh-claude-style] [class*=\"projectRow\"] [class*=\"chevron\"] svg {",
      "  display: none !important;",
      "}",
      "body[data-dsh-claude-style] [class*=\"projectRow\"] [class*=\"chevron\"]::after {",
      "  content: \"\";",
      "  display: inline-block;",
      "  width: 12px;",
      "  height: 12px;",
      "  background: currentColor;",
      "  -webkit-mask: url(\"data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27none%27 stroke=%27black%27 stroke-width=%271.5%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpath d=%27M4 6l4 4 4-4%27/%3E%3C/svg%3E\") center / contain no-repeat;",
      "  mask: url(\"data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27none%27 stroke=%27black%27 stroke-width=%271.5%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpath d=%27M4 6l4 4 4-4%27/%3E%3C/svg%3E\") center / contain no-repeat;",
      "  transition: transform 0.15s var(--ds-ease-in-out, ease);",
      "}",
      "body[data-dsh-claude-style] [class*=\"projectRow\"][aria-expanded=\"false\"] [class*=\"chevron\"]::after {",
      "  transform: rotate(-90deg);",
      "}",
      "/* Session status circle indicator (matching Claude style) */",
      "body[data-dsh-claude-style] [class*=\"sessionRow\"] [class*=\"slot\"] {",
      "  width: 14px !important;",
      "  height: 16px !important;",
      "  display: inline-flex !important;",
      "  align-items: center !important;",
      "  justify-content: center !important;",
      "}",
      "body[data-dsh-claude-style] [class*=\"sessionRow\"] [class*=\"slot\"]:empty::after {",
      "  content: \"\";",
      "  display: inline-block;",
      "  width: 5px;",
      "  height: 5px;",
      "  border-radius: 50%;",
      "  border: 1.2px solid var(--dsw-alias-label-caption, #a6a094);",
      "  box-sizing: border-box;",
      "}",
      "",
      "/* Session status ongoing indicator: Windows 11 circular progress ring (replaces blue square matrix) */",
      "body[data-dsh-claude-style] svg[data-state=\"ongoing\"] {",
      "  width: 10px !important;",
      "  height: 10px !important;",
      "  box-sizing: border-box !important;",
      "  border-radius: 50% !important;",
      "  border: 1.5px solid rgba(255, 255, 255, 0.18) !important;",
      "  border-top-color: #faf9f5 !important;",
      "  animation: 0.85s linear infinite dsh-claude-win11-spin !important;",
      "  transform-origin: center center !important;",
      "  display: inline-block !important;",
      "  flex: none !important;",
      "  color: transparent !important;",
      "  fill: none !important;",
      "  background: transparent !important;",
      "}",
      "body[data-dsh-claude-style]:not([data-ds-dark-theme]) svg[data-state=\"ongoing\"] {",
      "  border-color: rgba(20, 20, 19, 0.12) !important;",
      "  border-top-color: #6e6a60 !important;",
      "}",
      "body[data-dsh-claude-style] svg[data-state=\"ongoing\"] * {",
      "  display: none !important;",
      "}",
      "@keyframes dsh-claude-win11-spin {",
      "  0% { transform: rotate(0deg); }",
      "  100% { transform: rotate(360deg); }",
      "}",
      "@media (prefers-reduced-motion: reduce) {",
      "  body[data-dsh-claude-style] svg[data-state=\"ongoing\"] {",
      "    animation: none !important;",
      "  }",
      "}",
      "",
      "/* Turn status: Claude thinking indicator (terracotta accent shimmer) */",
      "body[data-dsh-claude-style] [class*=\"turnStatus\"]:not([class*=\"Clock\"]):not([class*=\"clock\"]) {",
      "  background: linear-gradient(90deg, #d97757 0%, #d97757 40%, #f3b5a3 50%, #d97757 60%, #d97757 100%);",
      "  background-position: 100% 0;",
      "  background-size: 250% 100%;",
      "  -webkit-background-clip: text;",
      "  background-clip: text;",
      "  -webkit-text-fill-color: transparent;",
      "  color: transparent;",
      "  animation: 1.8s linear infinite dsh-claude-turn-status-shimmer;",
      "}",
      "@keyframes dsh-claude-turn-status-shimmer {",
      "  to { background-position: 0 0; }",
      "}",
      "@media (prefers-reduced-motion: reduce) {",
      "  body[data-dsh-claude-style] [class*=\"turnStatus\"]:not([class*=\"Clock\"]):not([class*=\"clock\"]) {",
      "    background-position: 0 0;",
      "    background-size: 100% 100%;",
      "    animation: none;",
      "  }",
      "}",
      "",
      "/* --- 2.4 Custom Components (Segments & Account Popover) --- */",
      "/* ---------- Claude Code layout: permission segments ---------- */",
      "/* The shipped access control is one popup-select button; it is replaced by",
      "   a Read | Edit | Auto segmented control over the same three presets. */",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] button[aria-label^=\"访问模式\"],",
      "body[data-dsh-claude-style][data-dsh-claude-composer-active] button[aria-label^=\"Access mode\"] {",
      "  display: none !important;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-segments {",
      "  flex: none;",
      "  align-items: center;",
      "  gap: 2px;",
      "  padding: 2px;",
      "  border-radius: 7px;",
      "  background: var(--dsw-specific-selector);",
      "  display: inline-flex;",
      "}",
      "",
      "body[data-dsh-claude-style]:not([data-ds-dark-theme]) .dsh-claude-segments {",
      "  background: #f6f6f4;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-segment {",
      "  appearance: none;",
      "  margin: 0;",
      "  border: 0;",
      "  cursor: pointer;",
      "  background: transparent;",
      "  color: var(--dsw-alias-label-secondary);",
      "  font: inherit;",
      "  font-size: 14px;",
      "  font-weight: 500;",
      "  line-height: 18px;",
      "  padding: 3px 12px;",
      "  border-radius: 7px;",
      "  transition: background-color .1s, color .1s;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-segment:hover:not([data-active]) {",
      "  color: var(--dsw-alias-label-primary);",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-segment[data-active] {",
      "  color: var(--dsw-alias-label-primary);",
      "  background: var(--dsw-alias-bg-layer-3);",
      "}",
      "",
      "body[data-dsh-claude-style]:not([data-ds-dark-theme]) .dsh-claude-segment[data-active] {",
      "  background: var(--dsw-alias-bg-overlay);",
      "  box-shadow: 0 1px 2px rgba(20, 20, 19, 0.08);",
      "}",
      "",
      "/* ---------- Claude Code layout: in-conversation permission popover ---------- */",
      "body[data-dsh-claude-style] .dsh-claude-perm-container {",
      "  position: relative !important;",
      "  display: inline-flex !important;",
      "  z-index: 20 !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-perm-btn {",
      "  display: inline-flex !important;",
      "  align-items: center !important;",
      "  gap: 4px !important;",
      "  height: 24px !important;",
      "  padding: 0 6px 0 6px !important;",
      "  border-radius: 6px !important;",
      "  border: none !important;",
      "  background: transparent !important;",
      "  color: var(--dsw-alias-label-primary, #141413) !important;",
      "  font-family: var(--dsw-font-family) !important;",
      "  font-size: 13px !important;",
      "  font-weight: 500 !important;",
      "  cursor: pointer !important;",
      "  user-select: none !important;",
      "  transition: background-color 0.12s ease !important;",
      "}",
      "body[data-dsh-claude-style][data-ds-dark-theme] .dsh-claude-perm-btn {",
      "  color: #faf9f5 !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-perm-btn:hover,",
      "body[data-dsh-claude-style] .dsh-claude-perm-btn[data-open=\"true\"] {",
      "  background: var(--dsh-claude-hover-bg, rgba(0, 0, 0, 0.08)) !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-perm-chevron {",
      "  width: 12px;",
      "  height: 12px;",
      "  display: inline-flex;",
      "  align-items: center;",
      "  justify-content: center;",
      "  color: var(--dsw-alias-label-secondary);",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-perm-chevron::after {",
      "  content: \"\";",
      "  display: inline-block;",
      "  width: 10px;",
      "  height: 10px;",
      "  background: currentColor;",
      "  -webkit-mask: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E\") center / contain no-repeat;",
      "  mask: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E\") center / contain no-repeat;",
      "  transition: transform 0.15s ease;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-perm-btn[data-open=\"true\"] .dsh-claude-perm-chevron::after {",
      "  transform: rotate(180deg);",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-perm-popover {",
      "  position: fixed !important;",
      "  min-width: 220px !important;",
      "  background: var(--dsw-alias-bg-overlay, #ffffff) !important;",
      "  border: 1px solid var(--dsw-alias-border-l1, #e8e6dc) !important;",
      "  border-radius: 12px !important;",
      "  box-shadow: 0 8px 30px rgba(20, 20, 19, 0.12), 0 2px 8px rgba(20, 20, 19, 0.06) !important;",
      "  padding: 6px !important;",
      "  box-sizing: border-box !important;",
      "  z-index: 99999 !important;",
      "  display: flex !important;",
      "  flex-direction: column !important;",
      "  /* Two-line preset rows (label + description) need air between them: the",
      "     2px gap read as one solid block, so each row is separated by 6px. */",
      "  gap: 6px !important;",
      "  opacity: 0 !important;",
      "  pointer-events: none !important;",
      "  transform: translateY(4px) scale(0.98) !important;",
      "  transform-origin: bottom left !important;",
      "  transition: opacity 0.15s ease, transform 0.15s ease !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-perm-popover[data-open=\"true\"] {",
      "  opacity: 1 !important;",
      "  pointer-events: auto !important;",
      "  transform: translateY(0) scale(1) !important;",
      "}",
      "body[data-dsh-claude-style][data-ds-dark-theme] .dsh-claude-perm-popover {",
      "  background: #1e1e1d !important;",
      "  border-color: #2e2c29 !important;",
      "  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3) !important;",
      "}",
      "",
      "/* ---------- Claude Code layout: account row & floating popover ---------- */",
      "/* footArea positioning with crisp hairline border spanning entire sidebar */",
      "body[data-dsh-claude-style] [class*=\"footArea\"] {",
      "  position: relative !important;",
      "  overflow: visible !important;",
      "  margin: 0 calc(-1 * var(--dsh-sidebar-inline-padding, 12px)) -6px !important;",
      "  padding: 8px var(--dsh-sidebar-inline-padding, 12px) 6px !important;",
      "  border-top: 1px solid var(--dsw-alias-border-l1, #e8e6dc) !important;",
      "  background: transparent !important;",
      "  box-sizing: border-box !important;",
      "}",
      "body[data-dsh-claude-style][data-ds-dark-theme] [class*=\"footArea\"] {",
      "  border-top-color: #2e2c29 !important;",
      "}",
      "",
      "/* Account trigger button in sidebar */",
      "body[data-dsh-claude-style] .dsh-claude-account-btn {",
      "  display: flex !important;",
      "  align-items: center !important;",
      "  width: 100% !important;",
      "  height: 32px !important;",
      "  box-sizing: border-box !important;",
      "  padding: 0 8px !important;",
      "  margin: 0 !important;",
      "  border-radius: 6px !important;",
      "  cursor: pointer !important;",
      "  user-select: none !important;",
      "  background: transparent !important;",
      "  transition: background-color 0.12s ease !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-account-btn:hover,",
      "body[data-dsh-claude-style] .dsh-claude-account-btn[data-open=\"true\"] {",
      "  background: var(--dsh-claude-hover-bg, rgba(0, 0, 0, 0.08)) !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-account-avatar {",
      "  width: 18px;",
      "  height: 18px;",
      "  background: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2024%2024'%3E%3Cpath%20d%3D'M4.709%2015.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0%2011.784l.055-.352.48-.321.686.06%201.52.103%202.278.158%201.652.097%202.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686%201.908%201.476%202.491%201.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97%202.97%200%2001-.104-.729L6.283.134%206.696%200l.996.134.42.364.62%201.414%201.002%202.229%201.555%203.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286%201.851-.559%202.903-.364%201.942h.212l.243-.242.985-1.306%201.652-2.064.73-.82.85-.904.547-.431h1.033l.76%201.129-.34%201.166-1.064%201.347-.881%201.142-1.264%201.7-.79%201.36.073.11.188-.02%202.856-.606%201.543-.28%201.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061%201.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093%201.068%202.006%201.81%202.509%202.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649%202.345%203.521.122%201.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674%207.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434%201.967-2.18%202.945-1.726%201.845-.414.164-.717-.37.067-.662.401-.589%202.388-3.036%201.44-1.882.93-1.086-.006-.158h-.055L4.132%2018.56l-1.13.146-.487-.456.061-.746.231-.243%201.908-1.312-.006.006z'%20fill%3D'%23D97757'%2F%3E%3C%2Fsvg%3E\") center / contain no-repeat;",
      "  flex: none;",
      "  margin-right: 8px;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-account-label {",
      "  flex: 1;",
      "  min-width: 0;",
      "  overflow: hidden;",
      "  text-overflow: ellipsis;",
      "  white-space: nowrap;",
      "  font-size: 13px;",
      "  line-height: 18px;",
      "  font-family: var(--dsw-font-family);",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-account-user {",
      "  font-weight: 500;",
      "  color: var(--dsw-alias-label-primary);",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-account-chevron {",
      "  width: 14px;",
      "  height: 14px;",
      "  flex: none;",
      "  color: var(--dsw-alias-label-secondary);",
      "  display: inline-flex;",
      "  align-items: center;",
      "  justify-content: center;",
      "  margin-left: auto;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-account-chevron::after {",
      "  content: \"\";",
      "  display: inline-block;",
      "  width: 12px;",
      "  height: 12px;",
      "  background: currentColor;",
      "  -webkit-mask: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E\") center / contain no-repeat;",
      "  mask: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E\") center / contain no-repeat;",
      "  transition: transform 0.15s ease;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-account-btn[data-open=\"true\"] .dsh-claude-account-chevron::after {",
      "  transform: rotate(180deg);",
      "}",
      "",
      "/* Floating Popover Container: Adaptive Width */",
      "body[data-dsh-claude-style] .dsh-claude-account-popover {",
      "  position: absolute !important;",
      "  bottom: calc(100% + 4px) !important;",
      "  left: 8px !important;",
      "  right: 8px !important;",
      "  width: auto !important;",
      "  max-width: calc(100% - 16px) !important;",
      "  min-width: 0 !important;",
      "  background: var(--dsw-alias-bg-overlay, #ffffff) !important;",
      "  border: 1px solid var(--dsw-alias-border-l1, #e8e6dc) !important;",
      "  border-radius: 12px !important;",
      "  box-shadow: 0 8px 30px rgba(20, 20, 19, 0.12), 0 2px 8px rgba(20, 20, 19, 0.06) !important;",
      "  padding: 6px !important;",
      "  box-sizing: border-box !important;",
      "  z-index: 1000 !important;",
      "  display: flex !important;",
      "  flex-direction: column !important;",
      "  gap: 2px !important;",
      "  opacity: 0 !important;",
      "  pointer-events: none !important;",
      "  transform: translateY(6px) scale(0.98) !important;",
      "  transform-origin: bottom left !important;",
      "  transition: opacity 0.15s ease, transform 0.15s ease !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-account-popover[data-open=\"true\"] {",
      "  opacity: 1 !important;",
      "  pointer-events: auto !important;",
      "  transform: translateY(0) scale(1) !important;",
      "}",
      "body[data-dsh-claude-style][data-ds-dark-theme] .dsh-claude-account-popover {",
      "  background: #1e1e1d !important;",
      "  border-color: #2e2c29 !important;",
      "  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3) !important;",
      "}",
      "/* Hover bridge between trigger and popover */",
      "body[data-dsh-claude-style] .dsh-claude-account-popover::after {",
      "  content: \"\";",
      "  position: absolute;",
      "  top: 100%;",
      "  left: 0;",
      "  right: 0;",
      "  height: 12px;",
      "  background: transparent;",
      "}",
      "",
      "/* The account row is the ban-screen easter egg's trigger",
      "   (src/overrides/ban-screen.js). The header is only the wrapper — the clickable",
      "   strip is the inner row, so the hover plate covers the name and not the divider",
      "   that follows it. */",
      "body[data-dsh-claude-style] .dsh-claude-account-popover-row {",
      "  padding: 6px 8px !important;",
      "  border-radius: 8px !important;",
      "  cursor: pointer !important;",
      "  transition: background-color 0.12s ease !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-account-popover-row:hover,",
      "body[data-dsh-claude-style] .dsh-claude-account-popover-row:focus-visible {",
      "  background: var(--dsh-claude-hover-bg, rgba(0, 0, 0, 0.08)) !important;",
      "  outline: none !important;",
      "}",
      "",
      "/* The rule under the account name belongs to the POPOVER, not to the row: it",
      "   spans the panel's full width (the negative inline margins cancel the popover's",
      "   6px padding) and sits outside the hover plate above. */",
      "body[data-dsh-claude-style] .dsh-claude-account-popover-header .dsh-claude-account-popover-divider {",
      "  margin: 0 -6px !important;",
      "}",
      "",
      "/* ---------- Claude Code layout: account-ban easter egg ---------- */",
      "/* A reproduction of Claude's own \"Your account is on hold\" page, shown when the",
      "   account row at the top of the sidebar's account popover is clicked. It is an",
      "   easter egg, not a real state (src/overrides/ban-screen.js), and it is a",
      "   full-window overlay rather than a page: `position: fixed` at the top of the",
      "   stacking order, so it covers the titlebar, sidebar and composer whatever the",
      "   host paints underneath, and can never be clipped by the sidebar column the",
      "   account popover itself has to dodge.",
      "",
      "   Palette: the page is Claude's ivory canvas, so the light rules carry the",
      "   measurements and the dark theme re-maps the same slots onto the skin's warm",
      "   black. Every colour is a custom property, which is what lets one set of rules",
      "   serve both canvases. */",
      "body[data-dsh-claude-style] .dsh-claude-ban {",
      "  --dsh-ban-canvas: #faf9f5;",
      "  --dsh-ban-text: #141413;",
      "  --dsh-ban-muted: #6e6a60;",
      "  --dsh-ban-card: #ffffff;",
      "  --dsh-ban-hairline: #e4e2d8;",
      "  --dsh-ban-hover: rgba(20, 20, 19, 0.05);",
      "  --dsh-ban-primary-fill: #141413;",
      "  --dsh-ban-primary-text: #faf9f5;",
      "  --dsh-ban-primary-hover: #2e2c29;",
      "  --dsh-ban-danger: #a8412b;",
      "  --dsh-ban-danger-hover: #8f3623;",
      "  --dsh-ban-toast-bg: #f6e3c0;",
      "  --dsh-ban-toast-border: #e6cfa1;",
      "  --dsh-ban-toast-text: #7a4f12;",
      "  --dsh-ban-toast-icon: #9a5a15;",
      "  --dsh-ban-toast-hover: rgba(20, 20, 19, 0.09);",
      "  /* The two brand marks are alpha masks over these slots, so the starburst",
      "     keeps the clay accent while the wordmark stays in the page's ink. */",
      "  --dsh-ban-mark: #d97757;",
      "  --dsh-ban-word: #141413;",
      "  position: fixed !important;",
      "  inset: 0 !important;",
      "  z-index: 2147483000 !important;",
      "  margin: 0 !important;",
      "  padding: 0 !important;",
      "  background: var(--dsh-ban-canvas) !important;",
      "  color: var(--dsh-ban-text);",
      "  font-family: var(--dsw-font-family);",
      "  font-size: 15px;",
      "  line-height: 1.6;",
      "  -webkit-font-smoothing: antialiased;",
      "  box-sizing: border-box;",
      "}",
      "",
      "body[data-dsh-claude-style][data-ds-dark-theme] .dsh-claude-ban {",
      "  --dsh-ban-canvas: #141413;",
      "  --dsh-ban-text: #faf9f5;",
      "  --dsh-ban-muted: #b0aea5;",
      "  --dsh-ban-card: #1c1b1a;",
      "  --dsh-ban-hairline: #2e2c29;",
      "  --dsh-ban-hover: rgba(255, 255, 255, 0.07);",
      "  --dsh-ban-primary-fill: #faf9f5;",
      "  --dsh-ban-primary-text: #141413;",
      "  --dsh-ban-primary-hover: #e8e6dc;",
      "  --dsh-ban-danger: #e08a6d;",
      "  --dsh-ban-danger-hover: #eb9f84;",
      "  --dsh-ban-toast-bg: #3a2a22;",
      "  --dsh-ban-toast-border: #55402f;",
      "  --dsh-ban-toast-text: #f0d8b8;",
      "  --dsh-ban-toast-icon: #e0a86a;",
      "  --dsh-ban-toast-hover: rgba(255, 255, 255, 0.08);",
      "  --dsh-ban-word: #faf9f5;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban *,",
      "body[data-dsh-claude-style] .dsh-claude-ban *::before,",
      "body[data-dsh-claude-style] .dsh-claude-ban *::after {",
      "  box-sizing: border-box;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban svg {",
      "  display: block;",
      "  width: 100%;",
      "  height: 100%;",
      "}",
      "",
      "/* ---------- top bar: brand lockup, sign out, window controls ---------- */",
      "/* The bar sits 30px down from the window edge: it reproduces the shipped app's",
      "   own titlebar row, which the real Claude page keeps clear of. */",
      "body[data-dsh-claude-style] .dsh-claude-ban-bar {",
      "  display: flex;",
      "  align-items: center;",
      "  justify-content: space-between;",
      "  gap: 16px;",
      "  padding: 40px 8px 10px 44px;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-brand {",
      "  display: flex;",
      "  align-items: center;",
      "  gap: 8px;",
      "  color: var(--dsh-ban-word);",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-mark {",
      "  flex: none;",
      "  width: 21px;",
      "  height: 21px;",
      "  background-color: var(--dsh-ban-mark);",
      "  -webkit-mask: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20148.09%20148.18'%3E%3Cg%20transform%3D'translate(-75.96%2C-223.53)'%3E%3Cpath%20d%3D'm%20105.01%2C322.07%2029.14%2C-16.35%200.49%2C-1.42%20-0.49%2C-0.79%20h%20-1.42%20l%20-4.87%2C-0.3%20-16.65%2C-0.45%20-14.44%2C-0.6%20-13.99%2C-0.75%20-3.52%2C-0.75%20-3.3%2C-4.35%200.34%2C-2.17%202.96%2C-1.99%204.24%2C0.37%209.37%2C0.64%2014.06%2C0.97%2010.2%2C0.6%2015.11%2C1.57%20h%202.4%20l%200.34%2C-0.97%20-0.82%2C-0.6%20-0.64%2C-0.6%20-14.55%2C-9.86%20-15.75%2C-10.42%20-8.25%2C-6%20-4.46%2C-3.04%20-2.25%2C-2.85%20-0.97%2C-6.22%204.05%2C-4.46%205.44%2C0.37%201.39%2C0.37%205.51%2C4.24%2011.77%2C9.11%2015.37%2C11.32%202.25%2C1.87%200.9%2C-0.64%200.11%2C-0.45%20-1.01%2C-1.69%20-8.36%2C-15.11%20-8.92%2C-15.37%20-3.97%2C-6.37%20-1.05%2C-3.82%20c%20-0.37%2C-1.57%20-0.64%2C-2.89%20-0.64%2C-4.5%20l%204.61%2C-6.26%202.55%2C-0.82%206.15%2C0.82%202.59%2C2.25%203.82%2C8.74%206.19%2C13.76%209.6%2C18.71%202.81%2C5.55%201.5%2C5.14%200.56%2C1.57%20h%200.97%20v%20-0.9%20l%200.79%2C-10.54%201.46%2C-12.94%201.42%2C-16.65%200.49%2C-4.69%202.32%2C-5.62%204.61%2C-3.04%203.6%2C1.72%202.96%2C4.24%20-0.41%2C2.74%20-1.76%2C11.44%20-3.45%2C17.92%20-2.25%2C12%20h%201.31%20l%201.5%2C-1.5%206.07%2C-8.06%2010.2%2C-12.75%204.5%2C-5.06%205.25%2C-5.59%203.37%2C-2.66%20h%206.37%20l%204.69%2C6.97%20-2.1%2C7.2%20-6.56%2C8.32%20-5.44%2C7.05%20-7.8%2C10.5%20-4.87%2C8.4%200.45%2C0.67%201.16%2C-0.11%2017.62%2C-3.75%209.52%2C-1.72%2011.36%2C-1.95%205.14%2C2.4%200.56%2C2.44%20-2.02%2C4.99%20-12.15%2C3%20-14.25%2C2.85%20-21.22%2C5.02%20-0.26%2C0.19%200.3%2C0.37%209.56%2C0.9%204.09%2C0.22%20h%2010.01%20l%2018.64%2C1.39%204.87%2C3.22%202.92%2C3.94%20-0.49%2C3%20-7.5%2C3.82%20-10.12%2C-2.4%20-23.62%2C-5.62%20-8.1%2C-2.02%20h%20-1.12%20v%200.67%20l%206.75%2C6.6%2012.37%2C11.17%2015.49%2C14.4%200.79%2C3.56%20-1.99%2C2.81%20-2.1%2C-0.3%20-13.61%2C-10.24%20-5.25%2C-4.61%20-11.89%2C-10.01%20h%20-0.79%20v%201.05%20l%202.74%2C4.01%2014.47%2C21.75%200.75%2C6.67%20-1.05%2C2.17%20-3.75%2C1.31%20-4.12%2C-0.75%20-8.47%2C-11.89%20-8.74%2C-13.39%20-7.05%2C-12%20-0.86%2C0.49%20-4.16%2C44.81%20-1.95%2C2.29%20-4.5%2C1.72%20-3.75%2C-2.85%20-1.99%2C-4.61%201.99%2C-9.11%202.4%2C-11.89%201.95%2C-9.45%201.76%2C-11.74%201.05%2C-3.9%20-0.07%2C-0.26%20-0.86%2C0.11%20-8.85%2C12.15%20-13.46%2C18.19%20-10.65%2C11.4%20-2.55%2C1.01%20-4.42%2C-2.29%200.41%2C-4.09%202.47%2C-3.64%2014.74%2C-18.75%208.89%2C-11.62%205.74%2C-6.71%20-0.04%2C-0.97%20h%20-0.34%20l%20-39.15%2C25.42%20-6.97%2C0.9%20-3%2C-2.81%200.37%2C-4.61%201.42%2C-1.5%2011.77%2C-8.1%20-0.04%2C0.04%20z'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\") center / contain no-repeat;",
      "  mask: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20148.09%20148.18'%3E%3Cg%20transform%3D'translate(-75.96%2C-223.53)'%3E%3Cpath%20d%3D'm%20105.01%2C322.07%2029.14%2C-16.35%200.49%2C-1.42%20-0.49%2C-0.79%20h%20-1.42%20l%20-4.87%2C-0.3%20-16.65%2C-0.45%20-14.44%2C-0.6%20-13.99%2C-0.75%20-3.52%2C-0.75%20-3.3%2C-4.35%200.34%2C-2.17%202.96%2C-1.99%204.24%2C0.37%209.37%2C0.64%2014.06%2C0.97%2010.2%2C0.6%2015.11%2C1.57%20h%202.4%20l%200.34%2C-0.97%20-0.82%2C-0.6%20-0.64%2C-0.6%20-14.55%2C-9.86%20-15.75%2C-10.42%20-8.25%2C-6%20-4.46%2C-3.04%20-2.25%2C-2.85%20-0.97%2C-6.22%204.05%2C-4.46%205.44%2C0.37%201.39%2C0.37%205.51%2C4.24%2011.77%2C9.11%2015.37%2C11.32%202.25%2C1.87%200.9%2C-0.64%200.11%2C-0.45%20-1.01%2C-1.69%20-8.36%2C-15.11%20-8.92%2C-15.37%20-3.97%2C-6.37%20-1.05%2C-3.82%20c%20-0.37%2C-1.57%20-0.64%2C-2.89%20-0.64%2C-4.5%20l%204.61%2C-6.26%202.55%2C-0.82%206.15%2C0.82%202.59%2C2.25%203.82%2C8.74%206.19%2C13.76%209.6%2C18.71%202.81%2C5.55%201.5%2C5.14%200.56%2C1.57%20h%200.97%20v%20-0.9%20l%200.79%2C-10.54%201.46%2C-12.94%201.42%2C-16.65%200.49%2C-4.69%202.32%2C-5.62%204.61%2C-3.04%203.6%2C1.72%202.96%2C4.24%20-0.41%2C2.74%20-1.76%2C11.44%20-3.45%2C17.92%20-2.25%2C12%20h%201.31%20l%201.5%2C-1.5%206.07%2C-8.06%2010.2%2C-12.75%204.5%2C-5.06%205.25%2C-5.59%203.37%2C-2.66%20h%206.37%20l%204.69%2C6.97%20-2.1%2C7.2%20-6.56%2C8.32%20-5.44%2C7.05%20-7.8%2C10.5%20-4.87%2C8.4%200.45%2C0.67%201.16%2C-0.11%2017.62%2C-3.75%209.52%2C-1.72%2011.36%2C-1.95%205.14%2C2.4%200.56%2C2.44%20-2.02%2C4.99%20-12.15%2C3%20-14.25%2C2.85%20-21.22%2C5.02%20-0.26%2C0.19%200.3%2C0.37%209.56%2C0.9%204.09%2C0.22%20h%2010.01%20l%2018.64%2C1.39%204.87%2C3.22%202.92%2C3.94%20-0.49%2C3%20-7.5%2C3.82%20-10.12%2C-2.4%20-23.62%2C-5.62%20-8.1%2C-2.02%20h%20-1.12%20v%200.67%20l%206.75%2C6.6%2012.37%2C11.17%2015.49%2C14.4%200.79%2C3.56%20-1.99%2C2.81%20-2.1%2C-0.3%20-13.61%2C-10.24%20-5.25%2C-4.61%20-11.89%2C-10.01%20h%20-0.79%20v%201.05%20l%202.74%2C4.01%2014.47%2C21.75%200.75%2C6.67%20-1.05%2C2.17%20-3.75%2C1.31%20-4.12%2C-0.75%20-8.47%2C-11.89%20-8.74%2C-13.39%20-7.05%2C-12%20-0.86%2C0.49%20-4.16%2C44.81%20-1.95%2C2.29%20-4.5%2C1.72%20-3.75%2C-2.85%20-1.99%2C-4.61%201.99%2C-9.11%202.4%2C-11.89%201.95%2C-9.45%201.76%2C-11.74%201.05%2C-3.9%20-0.07%2C-0.26%20-0.86%2C0.11%20-8.85%2C12.15%20-13.46%2C18.19%20-10.65%2C11.4%20-2.55%2C1.01%20-4.42%2C-2.29%200.41%2C-4.09%202.47%2C-3.64%2014.74%2C-18.75%208.89%2C-11.62%205.74%2C-6.71%20-0.04%2C-0.97%20h%20-0.34%20l%20-39.15%2C25.42%20-6.97%2C0.9%20-3%2C-2.81%200.37%2C-4.61%201.42%2C-1.5%2011.77%2C-8.1%20-0.04%2C0.04%20z'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\") center / contain no-repeat;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-word {",
      "  flex: none;",
      "  width: 89px;",
      "  height: 21px;",
      "  background-color: var(--dsh-ban-word);",
      "  -webkit-mask: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'177.76%2014.09%20512.22%20121.54'%3E%3Cg%20transform%3D'translate(-75.96%2C-223.53)'%3E%3Cpath%20d%3D'm%20317.73%2C349.33%20c%20-18.82%2C0%20-31.69%2C-10.5%20-37.76%2C-26.66%20-3.17%2C-8.42%20-4.74%2C-17.36%20-4.61%2C-26.36%200%2C-27.11%2012.15%2C-45.94%2039%2C-45.94%2018.04%2C0%2029.17%2C7.87%2035.51%2C26.66%20h%207.72%20l%20-1.05%2C-25.91%20c%20-10.8%2C-6.97%20-24.3%2C-10.5%20-40.72%2C-10.5%20-23.14%2C0%20-42.82%2C10.35%20-53.77%2C29.02%20-5.66%2C9.86%20-8.53%2C21.07%20-8.32%2C32.44%200%2C20.74%209.79%2C39.11%2028.16%2C49.31%2010.06%2C5.37%2021.34%2C8.04%2032.74%2C7.72%2017.92%2C0%2032.14%2C-3.41%2044.74%2C-9.37%20l%203.26%2C-28.57%20h%20-7.87%20c%20-4.72%2C13.05%20-10.35%2C20.89%20-19.69%2C25.05%20-4.57%2C2.06%20-10.35%2C3.11%20-17.32%2C3.11%20z%20m%2081.18%2C-98.96%200.75%2C-12.75%20h%20-5.32%20l%20-23.7%2C7.12%20v%203.86%20l%2010.5%2C4.87%20v%2089.17%20c%200%2C6.07%20-3.11%2C7.42%20-11.25%2C8.44%20v%206.52%20h%2040.31%20v%20-6.52%20c%20-8.17%2C-1.01%20-11.25%2C-2.36%20-11.25%2C-8.44%20V%20250.4%20l%20-0.04%2C-0.04%20z%20m%20160.31%2C108.75%20h%203.11%20l%2027.26%2C-5.17%20v%20-6.67%20l%20-3.82%2C-0.3%20c%20-6.37%2C-0.6%20-8.02%2C-1.91%20-8.02%2C-7.12%20v%20-47.55%20l%200.75%2C-15.26%20h%20-4.31%20l%20-25.76%2C3.71%20v%206.52%20l%202.51%2C0.45%20c%206.97%2C1.01%209.04%2C2.96%209.04%2C7.84%20v%2042.37%20c%20-6.67%2C5.17%20-13.05%2C8.44%20-20.62%2C8.44%20-8.4%2C0%20-13.61%2C-4.27%20-13.61%2C-14.25%20v%20-39.79%20l%200.75%2C-15.26%20h%20-4.42%20l%20-25.8%2C3.71%20v%206.52%20l%202.66%2C0.45%20c%206.97%2C1.01%209.04%2C2.96%209.04%2C7.84%20v%2039.11%20c%200%2C16.57%209.37%2C24.45%2024.3%2C24.45%2011.4%2C0%2020.74%2C-6.07%2027.75%2C-14.51%20l%20-0.75%2C14.51%20-0.04%2C-0.04%20z%20M%20484.3%2C306.36%20c%200%2C-21.19%20-11.25%2C-29.32%20-31.57%2C-29.32%20-17.92%2C0%20-30.94%2C7.42%20-30.94%2C19.72%200%2C3.67%201.31%2C6.49%203.97%2C8.44%20l%2013.65%2C-1.8%20c%20-0.6%2C-4.12%20-0.9%2C-6.64%20-0.9%2C-7.69%200%2C-6.97%203.71%2C-10.5%2011.25%2C-10.5%2011.14%2C0%2016.76%2C7.84%2016.76%2C20.44%20v%204.12%20l%20-28.12%2C8.44%20c%20-9.37%2C2.55%20-14.7%2C4.76%20-18.26%2C9.94%20-1.89%2C3.17%20-2.8%2C6.82%20-2.62%2C10.5%200%2C12%208.25%2C20.47%2022.35%2C20.47%2010.2%2C0%2019.24%2C-4.61%2027.11%2C-13.35%202.81%2C8.74%207.12%2C13.35%2014.81%2C13.35%206.22%2C0%2011.85%2C-2.51%2016.87%2C-7.42%20l%20-1.5%2C-5.17%20c%20-2.17%2C0.6%20-4.27%2C0.9%20-6.49%2C0.9%20-4.31%2C0%20-6.37%2C-3.41%20-6.37%2C-10.09%20v%20-30.97%20z%20m%20-36%2C40.76%20c%20-7.69%2C0%20-12.45%2C-4.46%20-12.45%2C-12.3%200%2C-5.32%202.51%2C-8.44%207.87%2C-10.24%20l%2022.8%2C-7.24%20v%2021.9%20c%20-7.27%2C5.51%20-11.55%2C7.87%20-18.22%2C7.87%20z%20m%20237.36%2C6.82%20v%20-6.67%20l%20-3.86%2C-0.3%20c%20-6.37%2C-0.6%20-7.99%2C-1.91%20-7.99%2C-7.12%20v%20-89.47%20l%200.75%2C-12.75%20h%20-5.36%20l%20-23.7%2C7.12%20v%203.86%20l%2010.5%2C4.87%20v%2029.32%20c%20-5.91%2C-4.05%20-12.98%2C-6.08%20-20.14%2C-5.77%20-23.55%2C0%20-41.92%2C17.92%20-41.92%2C44.74%200%2C22.09%2013.2%2C37.35%2034.95%2C37.35%2011.25%2C0%2021.04%2C-5.47%2027.11%2C-13.95%20l%20-0.75%2C13.95%20h%203.15%20l%2027.26%2C-5.17%20v%200%20z%20m%20-49.35%2C-68.02%20c%2011.25%2C0%2019.69%2C6.52%2019.69%2C18.52%20v%2033.75%20c%20-5.18%2C5.16%20-12.23%2C8%20-19.54%2C7.87%20-16.12%2C0%20-24.3%2C-12.75%20-24.3%2C-29.77%200%2C-19.12%209.34%2C-30.37%2024.15%2C-30.37%20z%20M%20743.3%2C302.8%20c%20-2.1%2C-9.9%20-8.17%2C-15.52%20-16.61%2C-15.52%20-12.6%2C0%20-21.34%2C9.49%20-21.34%2C23.1%200%2C20.14%2010.65%2C33.19%2027.86%2C33.19%2011.48%2C-0.12%2022.04%2C-6.33%2027.71%2C-16.31%20l%205.02%2C1.35%20c%20-2.25%2C17.47%20-18.07%2C30.52%20-37.5%2C30.52%20-22.8%2C0%20-38.51%2C-16.87%20-38.51%2C-40.87%200%2C-24%2017.06%2C-41.21%2039.86%2C-41.21%2017.02%2C0%2029.02%2C10.24%2032.89%2C28.01%20l%20-59.4%2C18.22%20v%20-8.02%20l%2040.01%2C-12.41%20v%20-0.04%20z'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\") center / contain no-repeat;",
      "  mask: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'177.76%2014.09%20512.22%20121.54'%3E%3Cg%20transform%3D'translate(-75.96%2C-223.53)'%3E%3Cpath%20d%3D'm%20317.73%2C349.33%20c%20-18.82%2C0%20-31.69%2C-10.5%20-37.76%2C-26.66%20-3.17%2C-8.42%20-4.74%2C-17.36%20-4.61%2C-26.36%200%2C-27.11%2012.15%2C-45.94%2039%2C-45.94%2018.04%2C0%2029.17%2C7.87%2035.51%2C26.66%20h%207.72%20l%20-1.05%2C-25.91%20c%20-10.8%2C-6.97%20-24.3%2C-10.5%20-40.72%2C-10.5%20-23.14%2C0%20-42.82%2C10.35%20-53.77%2C29.02%20-5.66%2C9.86%20-8.53%2C21.07%20-8.32%2C32.44%200%2C20.74%209.79%2C39.11%2028.16%2C49.31%2010.06%2C5.37%2021.34%2C8.04%2032.74%2C7.72%2017.92%2C0%2032.14%2C-3.41%2044.74%2C-9.37%20l%203.26%2C-28.57%20h%20-7.87%20c%20-4.72%2C13.05%20-10.35%2C20.89%20-19.69%2C25.05%20-4.57%2C2.06%20-10.35%2C3.11%20-17.32%2C3.11%20z%20m%2081.18%2C-98.96%200.75%2C-12.75%20h%20-5.32%20l%20-23.7%2C7.12%20v%203.86%20l%2010.5%2C4.87%20v%2089.17%20c%200%2C6.07%20-3.11%2C7.42%20-11.25%2C8.44%20v%206.52%20h%2040.31%20v%20-6.52%20c%20-8.17%2C-1.01%20-11.25%2C-2.36%20-11.25%2C-8.44%20V%20250.4%20l%20-0.04%2C-0.04%20z%20m%20160.31%2C108.75%20h%203.11%20l%2027.26%2C-5.17%20v%20-6.67%20l%20-3.82%2C-0.3%20c%20-6.37%2C-0.6%20-8.02%2C-1.91%20-8.02%2C-7.12%20v%20-47.55%20l%200.75%2C-15.26%20h%20-4.31%20l%20-25.76%2C3.71%20v%206.52%20l%202.51%2C0.45%20c%206.97%2C1.01%209.04%2C2.96%209.04%2C7.84%20v%2042.37%20c%20-6.67%2C5.17%20-13.05%2C8.44%20-20.62%2C8.44%20-8.4%2C0%20-13.61%2C-4.27%20-13.61%2C-14.25%20v%20-39.79%20l%200.75%2C-15.26%20h%20-4.42%20l%20-25.8%2C3.71%20v%206.52%20l%202.66%2C0.45%20c%206.97%2C1.01%209.04%2C2.96%209.04%2C7.84%20v%2039.11%20c%200%2C16.57%209.37%2C24.45%2024.3%2C24.45%2011.4%2C0%2020.74%2C-6.07%2027.75%2C-14.51%20l%20-0.75%2C14.51%20-0.04%2C-0.04%20z%20M%20484.3%2C306.36%20c%200%2C-21.19%20-11.25%2C-29.32%20-31.57%2C-29.32%20-17.92%2C0%20-30.94%2C7.42%20-30.94%2C19.72%200%2C3.67%201.31%2C6.49%203.97%2C8.44%20l%2013.65%2C-1.8%20c%20-0.6%2C-4.12%20-0.9%2C-6.64%20-0.9%2C-7.69%200%2C-6.97%203.71%2C-10.5%2011.25%2C-10.5%2011.14%2C0%2016.76%2C7.84%2016.76%2C20.44%20v%204.12%20l%20-28.12%2C8.44%20c%20-9.37%2C2.55%20-14.7%2C4.76%20-18.26%2C9.94%20-1.89%2C3.17%20-2.8%2C6.82%20-2.62%2C10.5%200%2C12%208.25%2C20.47%2022.35%2C20.47%2010.2%2C0%2019.24%2C-4.61%2027.11%2C-13.35%202.81%2C8.74%207.12%2C13.35%2014.81%2C13.35%206.22%2C0%2011.85%2C-2.51%2016.87%2C-7.42%20l%20-1.5%2C-5.17%20c%20-2.17%2C0.6%20-4.27%2C0.9%20-6.49%2C0.9%20-4.31%2C0%20-6.37%2C-3.41%20-6.37%2C-10.09%20v%20-30.97%20z%20m%20-36%2C40.76%20c%20-7.69%2C0%20-12.45%2C-4.46%20-12.45%2C-12.3%200%2C-5.32%202.51%2C-8.44%207.87%2C-10.24%20l%2022.8%2C-7.24%20v%2021.9%20c%20-7.27%2C5.51%20-11.55%2C7.87%20-18.22%2C7.87%20z%20m%20237.36%2C6.82%20v%20-6.67%20l%20-3.86%2C-0.3%20c%20-6.37%2C-0.6%20-7.99%2C-1.91%20-7.99%2C-7.12%20v%20-89.47%20l%200.75%2C-12.75%20h%20-5.36%20l%20-23.7%2C7.12%20v%203.86%20l%2010.5%2C4.87%20v%2029.32%20c%20-5.91%2C-4.05%20-12.98%2C-6.08%20-20.14%2C-5.77%20-23.55%2C0%20-41.92%2C17.92%20-41.92%2C44.74%200%2C22.09%2013.2%2C37.35%2034.95%2C37.35%2011.25%2C0%2021.04%2C-5.47%2027.11%2C-13.95%20l%20-0.75%2C13.95%20h%203.15%20l%2027.26%2C-5.17%20v%200%20z%20m%20-49.35%2C-68.02%20c%2011.25%2C0%2019.69%2C6.52%2019.69%2C18.52%20v%2033.75%20c%20-5.18%2C5.16%20-12.23%2C8%20-19.54%2C7.87%20-16.12%2C0%20-24.3%2C-12.75%20-24.3%2C-29.77%200%2C-19.12%209.34%2C-30.37%2024.15%2C-30.37%20z%20M%20743.3%2C302.8%20c%20-2.1%2C-9.9%20-8.17%2C-15.52%20-16.61%2C-15.52%20-12.6%2C0%20-21.34%2C9.49%20-21.34%2C23.1%200%2C20.14%2010.65%2C33.19%2027.86%2C33.19%2011.48%2C-0.12%2022.04%2C-6.33%2027.71%2C-16.31%20l%205.02%2C1.35%20c%20-2.25%2C17.47%20-18.07%2C30.52%20-37.5%2C30.52%20-22.8%2C0%20-38.51%2C-16.87%20-38.51%2C-40.87%200%2C-24%2017.06%2C-41.21%2039.86%2C-41.21%2017.02%2C0%2029.02%2C10.24%2032.89%2C28.01%20l%20-59.4%2C18.22%20v%20-8.02%20l%2040.01%2C-12.41%20v%20-0.04%20z'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\") center / contain no-repeat;",
      "}",
      "",
      "/* The brand preference applies here too: Anthropic swaps both marks, and \"off\"",
      "   keeps the Claude lockup with the starburst dropped (a bare text wordmark is",
      "   exactly what this page is). */",
      "body[data-dsh-claude-style][data-dsh-claude-brand=\"anthropic\"] .dsh-claude-ban-mark {",
      "  width: 30px;",
      "  background-color: var(--dsh-ban-word);",
      "  -webkit-mask: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2046%2032'%3E%3Cpath%20d%3D'M32.73%200H25.7846L38.4499%2032H45.3953L32.73%200Z'%2F%3E%3Cpath%20d%3D'M12.6653%200L0%2032H7.08167L9.67193%2025.28H22.9219L25.5122%2032H32.5939L19.9286%200H12.6653ZM11.9626%2019.3371L16.2969%208.09143L20.6313%2019.3371H11.9626Z'%2F%3E%3C%2Fsvg%3E\") center / contain no-repeat;",
      "  mask: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2046%2032'%3E%3Cpath%20d%3D'M32.73%200H25.7846L38.4499%2032H45.3953L32.73%200Z'%2F%3E%3Cpath%20d%3D'M12.6653%200L0%2032H7.08167L9.67193%2025.28H22.9219L25.5122%2032H32.5939L19.9286%200H12.6653ZM11.9626%2019.3371L16.2969%208.09143L20.6313%2019.3371H11.9626Z'%2F%3E%3C%2Fsvg%3E\") center / contain no-repeat;",
      "}",
      "",
      "body[data-dsh-claude-style][data-dsh-claude-brand=\"anthropic\"] .dsh-claude-ban-word {",
      "  width: 188px;",
      "  -webkit-mask: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20143%2016'%3E%3Cpath%20transform%3D'translate(18.299999237060547%2C0.27000001072883606)'%20d%3D'%20M10.716191291809082%2C10.829001426696777%20C10.716191291809082%2C10.829001426696777%203.756195545196533%2C0%203.756195545196533%2C0%20C3.756195545196533%2C0%200%2C0%200%2C0%20C0%2C0%200%2C15.470022201538086%200%2C15.470022201538086%20C0%2C15.470022201538086%203.2038140296936035%2C15.470022201538086%203.2038140296936035%2C15.470022201538086%20C3.2038140296936035%2C15.470022201538086%203.2038140296936035%2C4.6410064697265625%203.2038140296936035%2C4.6410064697265625%20C3.2038140296936035%2C4.6410064697265625%2010.163809776306152%2C15.470022201538086%2010.163809776306152%2C15.470022201538086%20C10.163809776306152%2C15.470022201538086%2013.919991493225098%2C15.470022201538086%2013.919991493225098%2C15.470022201538086%20C13.919991493225098%2C15.470022201538086%2013.919991493225098%2C0%2013.919991493225098%2C0%20C13.919991493225098%2C0%2010.716191291809082%2C0%2010.716191291809082%2C0%20C10.716191291809082%2C0%2010.716191291809082%2C10.829001426696777%2010.716191291809082%2C10.829001426696777%20C10.716191291809082%2C10.829001426696777%2010.716191291809082%2C10.829001426696777%2010.716191291809082%2C10.829001426696777z'%2F%3E%3Cpath%20transform%3D'translate(34.869998931884766%2C0.27000001072883606)'%20d%3D'%20M0%2C2.983504056930542%20C0%2C2.983504056930542%205.19273567199707%2C2.983504056930542%205.19273567199707%2C2.983504056930542%20C5.19273567199707%2C2.983504056930542%205.19273567199707%2C15.470022201538086%205.19273567199707%2C15.470022201538086%20C5.19273567199707%2C15.470022201538086%208.507256507873535%2C15.470022201538086%208.507256507873535%2C15.470022201538086%20C8.507256507873535%2C15.470022201538086%208.507256507873535%2C2.983504056930542%208.507256507873535%2C2.983504056930542%20C8.507256507873535%2C2.983504056930542%2013.700006484985352%2C2.983504056930542%2013.700006484985352%2C2.983504056930542%20C13.700006484985352%2C2.983504056930542%2013.700006484985352%2C0%2013.700006484985352%2C0%20C13.700006484985352%2C0%200%2C0%200%2C0%20C0%2C0%200%2C2.983504056930542%200%2C2.983504056930542%20C0%2C2.983504056930542%200%2C2.983504056930542%200%2C2.983504056930542z'%2F%3E%3Cpath%20transform%3D'translate(51.22999954223633%2C0.27000001072883606)'%20d%3D'%20M10.605714797973633%2C6.165900230407715%20C10.605714797973633%2C6.165900230407715%203.3142902851104736%2C6.165900230407715%203.3142902851104736%2C6.165900230407715%20C3.3142902851104736%2C6.165900230407715%203.3142902851104736%2C0%203.3142902851104736%2C0%20C3.3142902851104736%2C0%200%2C0%200%2C0%20C0%2C0%200%2C15.470022201538086%200%2C15.470022201538086%20C0%2C15.470022201538086%203.3142902851104736%2C15.470022201538086%203.3142902851104736%2C15.470022201538086%20C3.3142902851104736%2C15.470022201538086%203.3142902851104736%2C9.149404525756836%203.3142902851104736%2C9.149404525756836%20C3.3142902851104736%2C9.149404525756836%2010.605714797973633%2C9.149404525756836%2010.605714797973633%2C9.149404525756836%20C10.605714797973633%2C9.149404525756836%2010.605714797973633%2C15.470022201538086%2010.605714797973633%2C15.470022201538086%20C10.605714797973633%2C15.470022201538086%2013.919991493225098%2C15.470022201538086%2013.919991493225098%2C15.470022201538086%20C13.919991493225098%2C15.470022201538086%2013.919991493225098%2C0%2013.919991493225098%2C0%20C13.919991493225098%2C0%2010.605714797973633%2C0%2010.605714797973633%2C0%20C10.605714797973633%2C0%2010.605714797973633%2C6.165900230407715%2010.605714797973633%2C6.165900230407715%20C10.605714797973633%2C6.165900230407715%2010.605714797973633%2C6.165900230407715%2010.605714797973633%2C6.165900230407715z'%2F%3E%3Cpath%20transform%3D'translate(69.23999786376953%2C0.27000001072883606)'%20d%3D'%20M3.3151700496673584%2C2.983504056930542%20C3.3151700496673584%2C2.983504056930542%207.403865814208984%2C2.983504056930542%207.403865814208984%2C2.983504056930542%20C9.03934097290039%2C2.983504056930542%209.901290893554688%2C3.5801939964294434%209.901290893554688%2C4.707304000854492%20C9.901290893554688%2C5.834399700164795%209.03934097290039%2C6.431103706359863%207.403865814208984%2C6.431103706359863%20C7.403865814208984%2C6.431103706359863%203.3151700496673584%2C6.431103706359863%203.3151700496673584%2C6.431103706359863%20C3.3151700496673584%2C6.431103706359863%203.3151700496673584%2C2.983504056930542%203.3151700496673584%2C2.983504056930542%20C3.3151700496673584%2C2.983504056930542%203.3151700496673584%2C2.983504056930542%203.3151700496673584%2C2.983504056930542z%20M13.216461181640625%2C4.707304000854492%20C13.216461181640625%2C1.7900969982147217%2011.072648048400879%2C0%207.558576583862305%2C0%20C7.558576583862305%2C0%200%2C0%200%2C0%20C0%2C0%200%2C15.470022201538086%200%2C15.470022201538086%20C0%2C15.470022201538086%203.3151700496673584%2C15.470022201538086%203.3151700496673584%2C15.470022201538086%20C3.3151700496673584%2C15.470022201538086%203.3151700496673584%2C9.414593696594238%203.3151700496673584%2C9.414593696594238%20C3.3151700496673584%2C9.414593696594238%207.005825519561768%2C9.414593696594238%207.005825519561768%2C9.414593696594238%20C7.005825519561768%2C9.414593696594238%2010.321218490600586%2C15.470022201538086%2010.321218490600586%2C15.470022201538086%20C10.321218490600586%2C15.470022201538086%2013.990056991577148%2C15.470022201538086%2013.990056991577148%2C15.470022201538086%20C13.990056991577148%2C15.470022201538086%2010.319005966186523%2C8.953378677368164%2010.319005966186523%2C8.953378677368164%20C12.161579132080078%2C8.245061874389648%2013.216461181640625%2C6.753532409667969%2013.216461181640625%2C4.707304000854492%20C13.216461181640625%2C4.707304000854492%2013.216461181640625%2C4.707304000854492%2013.216461181640625%2C4.707304000854492z'%2F%3E%3Cpath%20transform%3D'translate(84.98999786376953%2C0)'%20d%3D'%20M7.622087478637695%2C12.906073570251465%20C5.015110492706299%2C12.906073570251465%203.4244225025177%2C11.049725532531738%203.4244225025177%2C8.022093772888184%20C3.4244225025177%2C4.95027494430542%205.015110492706299%2C3.0939269065856934%207.622087478637695%2C3.0939269065856934%20C10.206976890563965%2C3.0939269065856934%2011.775577545166016%2C4.95027494430542%2011.775577545166016%2C8.022093772888184%20C11.775577545166016%2C11.049725532531738%2010.206976890563965%2C12.906073570251465%207.622087478637695%2C12.906073570251465%20C7.622087478637695%2C12.906073570251465%207.622087478637695%2C12.906073570251465%207.622087478637695%2C12.906073570251465z%20M7.622087478637695%2C0%20C3.1593029499053955%2C0%200%2C3.3149218559265137%200%2C8.022093772888184%20C0%2C12.685078620910645%203.1593029499053955%2C16%207.622087478637695%2C16%20C12.062784194946289%2C16%2015.200028419494629%2C12.685078620910645%2015.200028419494629%2C8.022093772888184%20C15.200028419494629%2C3.3149218559265137%2012.062784194946289%2C0%207.622087478637695%2C0%20C7.622087478637695%2C0%207.622087478637695%2C0%207.622087478637695%2C0z'%2F%3E%3Cpath%20transform%3D'translate(103.29000091552734%2C0.27000001072883606)'%20d%3D'%20M7.405848026275635%2C6.873104095458984%20C7.405848026275635%2C6.873104095458984%203.3160574436187744%2C6.873104095458984%203.3160574436187744%2C6.873104095458984%20C3.3160574436187744%2C6.873104095458984%203.3160574436187744%2C2.983504056930542%203.3160574436187744%2C2.983504056930542%20C3.3160574436187744%2C2.983504056930542%207.405848026275635%2C2.983504056930542%207.405848026275635%2C2.983504056930542%20C9.04176139831543%2C2.983504056930542%209.90394115447998%2C3.646505117416382%209.90394115447998%2C4.928304195404053%20C9.90394115447998%2C6.2101030349731445%209.04176139831543%2C6.873104095458984%207.405848026275635%2C6.873104095458984%20C7.405848026275635%2C6.873104095458984%207.405848026275635%2C6.873104095458984%207.405848026275635%2C6.873104095458984z%20M7.5605998039245605%2C0%20C7.5605998039245605%2C0%200%2C0%200%2C0%20C0%2C0%200%2C15.470022201538086%200%2C15.470022201538086%20C0%2C15.470022201538086%203.3160574436187744%2C15.470022201538086%203.3160574436187744%2C15.470022201538086%20C3.3160574436187744%2C15.470022201538086%203.3160574436187744%2C9.85659408569336%203.3160574436187744%2C9.85659408569336%20C3.3160574436187744%2C9.85659408569336%207.5605998039245605%2C9.85659408569336%207.5605998039245605%2C9.85659408569336%20C11.07561206817627%2C9.85659408569336%2013.219999313354492%2C8.000200271606445%2013.219999313354492%2C4.928304195404053%20C13.219999313354492%2C1.8563942909240723%2011.07561206817627%2C0%207.5605998039245605%2C0%20C7.5605998039245605%2C0%207.5605998039245605%2C0%207.5605998039245605%2C0z'%2F%3E%3Cpath%20transform%3D'translate(128.0399932861328%2C0)'%20d%3D'%20M10.914844512939453%2C10.5414400100708%20C10.340370178222656%2C12.044201850891113%209.191434860229492%2C12.906073570251465%207.622706890106201%2C12.906073570251465%20C5.0155181884765625%2C12.906073570251465%203.4246866703033447%2C11.049725532531738%203.4246866703033447%2C8.022093772888184%20C3.4246866703033447%2C4.95027494430542%205.0155181884765625%2C3.0939269065856934%207.622706890106201%2C3.0939269065856934%20C9.191434860229492%2C3.0939269065856934%2010.340370178222656%2C3.9557981491088867%2010.914844512939453%2C5.458559989929199%20C10.914844512939453%2C5.458559989929199%2014.427860260009766%2C5.458559989929199%2014.427860260009766%2C5.458559989929199%20C13.566211700439453%2C2.1436522006988525%2010.981111526489258%2C0%207.622706890106201%2C0%20C3.1595458984375%2C0%200%2C3.3149218559265137%200%2C8.022093772888184%20C0%2C12.685078620910645%203.1595458984375%2C16%207.622706890106201%2C16%20C11.003214836120605%2C16%2013.588300704956055%2C13.834254264831543%2014.449976921081543%2C10.5414400100708%20C14.449976921081543%2C10.5414400100708%2010.914844512939453%2C10.5414400100708%2010.914844512939453%2C10.5414400100708%20C10.914844512939453%2C10.5414400100708%2010.914844512939453%2C10.5414400100708%2010.914844512939453%2C10.5414400100708z'%2F%3E%3Cpath%20transform%3D'translate(117.83000183105469%2C0.27000001072883606)'%20d%3D'%20M0%2C0%20C0%2C0%206.1677093505859375%2C15.470022201538086%206.1677093505859375%2C15.470022201538086%20C6.1677093505859375%2C15.470022201538086%209.550004005432129%2C15.470022201538086%209.550004005432129%2C15.470022201538086%20C9.550004005432129%2C15.470022201538086%203.382294178009033%2C0%203.382294178009033%2C0%20C3.382294178009033%2C0%200%2C0%200%2C0%20C0%2C0%200%2C0%200%2C0z'%2F%3E%3Cpath%20transform%3D'translate(0%2C0.27000001072883606)'%20d%3D'%20M5.824605464935303%2C9.348296165466309%20C5.824605464935303%2C9.348296165466309%207.93500280380249%2C3.911694288253784%207.93500280380249%2C3.911694288253784%20C7.93500280380249%2C3.911694288253784%2010.045400619506836%2C9.348296165466309%2010.045400619506836%2C9.348296165466309%20C10.045400619506836%2C9.348296165466309%205.824605464935303%2C9.348296165466309%205.824605464935303%2C9.348296165466309%20C5.824605464935303%2C9.348296165466309%205.824605464935303%2C9.348296165466309%205.824605464935303%2C9.348296165466309z%20M6.166755199432373%2C0%20C6.166755199432373%2C0%200%2C15.470022201538086%200%2C15.470022201538086%20C0%2C15.470022201538086%203.4480772018432617%2C15.470022201538086%203.4480772018432617%2C15.470022201538086%20C3.4480772018432617%2C15.470022201538086%204.709278583526611%2C12.22130012512207%204.709278583526611%2C12.22130012512207%20C4.709278583526611%2C12.22130012512207%2011.16093635559082%2C12.22130012512207%2011.16093635559082%2C12.22130012512207%20C11.16093635559082%2C12.22130012512207%2012.421928405761719%2C15.470022201538086%2012.421928405761719%2C15.470022201538086%20C12.421928405761719%2C15.470022201538086%2015.87000560760498%2C15.470022201538086%2015.87000560760498%2C15.470022201538086%20C15.87000560760498%2C15.470022201538086%209.703250885009766%2C0%209.703250885009766%2C0%20C9.703250885009766%2C0%206.166755199432373%2C0%206.166755199432373%2C0%20C6.166755199432373%2C0%206.166755199432373%2C0%206.166755199432373%2C0z'%2F%3E%3C%2Fsvg%3E\") center / contain no-repeat;",
      "  mask: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20143%2016'%3E%3Cpath%20transform%3D'translate(18.299999237060547%2C0.27000001072883606)'%20d%3D'%20M10.716191291809082%2C10.829001426696777%20C10.716191291809082%2C10.829001426696777%203.756195545196533%2C0%203.756195545196533%2C0%20C3.756195545196533%2C0%200%2C0%200%2C0%20C0%2C0%200%2C15.470022201538086%200%2C15.470022201538086%20C0%2C15.470022201538086%203.2038140296936035%2C15.470022201538086%203.2038140296936035%2C15.470022201538086%20C3.2038140296936035%2C15.470022201538086%203.2038140296936035%2C4.6410064697265625%203.2038140296936035%2C4.6410064697265625%20C3.2038140296936035%2C4.6410064697265625%2010.163809776306152%2C15.470022201538086%2010.163809776306152%2C15.470022201538086%20C10.163809776306152%2C15.470022201538086%2013.919991493225098%2C15.470022201538086%2013.919991493225098%2C15.470022201538086%20C13.919991493225098%2C15.470022201538086%2013.919991493225098%2C0%2013.919991493225098%2C0%20C13.919991493225098%2C0%2010.716191291809082%2C0%2010.716191291809082%2C0%20C10.716191291809082%2C0%2010.716191291809082%2C10.829001426696777%2010.716191291809082%2C10.829001426696777%20C10.716191291809082%2C10.829001426696777%2010.716191291809082%2C10.829001426696777%2010.716191291809082%2C10.829001426696777z'%2F%3E%3Cpath%20transform%3D'translate(34.869998931884766%2C0.27000001072883606)'%20d%3D'%20M0%2C2.983504056930542%20C0%2C2.983504056930542%205.19273567199707%2C2.983504056930542%205.19273567199707%2C2.983504056930542%20C5.19273567199707%2C2.983504056930542%205.19273567199707%2C15.470022201538086%205.19273567199707%2C15.470022201538086%20C5.19273567199707%2C15.470022201538086%208.507256507873535%2C15.470022201538086%208.507256507873535%2C15.470022201538086%20C8.507256507873535%2C15.470022201538086%208.507256507873535%2C2.983504056930542%208.507256507873535%2C2.983504056930542%20C8.507256507873535%2C2.983504056930542%2013.700006484985352%2C2.983504056930542%2013.700006484985352%2C2.983504056930542%20C13.700006484985352%2C2.983504056930542%2013.700006484985352%2C0%2013.700006484985352%2C0%20C13.700006484985352%2C0%200%2C0%200%2C0%20C0%2C0%200%2C2.983504056930542%200%2C2.983504056930542%20C0%2C2.983504056930542%200%2C2.983504056930542%200%2C2.983504056930542z'%2F%3E%3Cpath%20transform%3D'translate(51.22999954223633%2C0.27000001072883606)'%20d%3D'%20M10.605714797973633%2C6.165900230407715%20C10.605714797973633%2C6.165900230407715%203.3142902851104736%2C6.165900230407715%203.3142902851104736%2C6.165900230407715%20C3.3142902851104736%2C6.165900230407715%203.3142902851104736%2C0%203.3142902851104736%2C0%20C3.3142902851104736%2C0%200%2C0%200%2C0%20C0%2C0%200%2C15.470022201538086%200%2C15.470022201538086%20C0%2C15.470022201538086%203.3142902851104736%2C15.470022201538086%203.3142902851104736%2C15.470022201538086%20C3.3142902851104736%2C15.470022201538086%203.3142902851104736%2C9.149404525756836%203.3142902851104736%2C9.149404525756836%20C3.3142902851104736%2C9.149404525756836%2010.605714797973633%2C9.149404525756836%2010.605714797973633%2C9.149404525756836%20C10.605714797973633%2C9.149404525756836%2010.605714797973633%2C15.470022201538086%2010.605714797973633%2C15.470022201538086%20C10.605714797973633%2C15.470022201538086%2013.919991493225098%2C15.470022201538086%2013.919991493225098%2C15.470022201538086%20C13.919991493225098%2C15.470022201538086%2013.919991493225098%2C0%2013.919991493225098%2C0%20C13.919991493225098%2C0%2010.605714797973633%2C0%2010.605714797973633%2C0%20C10.605714797973633%2C0%2010.605714797973633%2C6.165900230407715%2010.605714797973633%2C6.165900230407715%20C10.605714797973633%2C6.165900230407715%2010.605714797973633%2C6.165900230407715%2010.605714797973633%2C6.165900230407715z'%2F%3E%3Cpath%20transform%3D'translate(69.23999786376953%2C0.27000001072883606)'%20d%3D'%20M3.3151700496673584%2C2.983504056930542%20C3.3151700496673584%2C2.983504056930542%207.403865814208984%2C2.983504056930542%207.403865814208984%2C2.983504056930542%20C9.03934097290039%2C2.983504056930542%209.901290893554688%2C3.5801939964294434%209.901290893554688%2C4.707304000854492%20C9.901290893554688%2C5.834399700164795%209.03934097290039%2C6.431103706359863%207.403865814208984%2C6.431103706359863%20C7.403865814208984%2C6.431103706359863%203.3151700496673584%2C6.431103706359863%203.3151700496673584%2C6.431103706359863%20C3.3151700496673584%2C6.431103706359863%203.3151700496673584%2C2.983504056930542%203.3151700496673584%2C2.983504056930542%20C3.3151700496673584%2C2.983504056930542%203.3151700496673584%2C2.983504056930542%203.3151700496673584%2C2.983504056930542z%20M13.216461181640625%2C4.707304000854492%20C13.216461181640625%2C1.7900969982147217%2011.072648048400879%2C0%207.558576583862305%2C0%20C7.558576583862305%2C0%200%2C0%200%2C0%20C0%2C0%200%2C15.470022201538086%200%2C15.470022201538086%20C0%2C15.470022201538086%203.3151700496673584%2C15.470022201538086%203.3151700496673584%2C15.470022201538086%20C3.3151700496673584%2C15.470022201538086%203.3151700496673584%2C9.414593696594238%203.3151700496673584%2C9.414593696594238%20C3.3151700496673584%2C9.414593696594238%207.005825519561768%2C9.414593696594238%207.005825519561768%2C9.414593696594238%20C7.005825519561768%2C9.414593696594238%2010.321218490600586%2C15.470022201538086%2010.321218490600586%2C15.470022201538086%20C10.321218490600586%2C15.470022201538086%2013.990056991577148%2C15.470022201538086%2013.990056991577148%2C15.470022201538086%20C13.990056991577148%2C15.470022201538086%2010.319005966186523%2C8.953378677368164%2010.319005966186523%2C8.953378677368164%20C12.161579132080078%2C8.245061874389648%2013.216461181640625%2C6.753532409667969%2013.216461181640625%2C4.707304000854492%20C13.216461181640625%2C4.707304000854492%2013.216461181640625%2C4.707304000854492%2013.216461181640625%2C4.707304000854492z'%2F%3E%3Cpath%20transform%3D'translate(84.98999786376953%2C0)'%20d%3D'%20M7.622087478637695%2C12.906073570251465%20C5.015110492706299%2C12.906073570251465%203.4244225025177%2C11.049725532531738%203.4244225025177%2C8.022093772888184%20C3.4244225025177%2C4.95027494430542%205.015110492706299%2C3.0939269065856934%207.622087478637695%2C3.0939269065856934%20C10.206976890563965%2C3.0939269065856934%2011.775577545166016%2C4.95027494430542%2011.775577545166016%2C8.022093772888184%20C11.775577545166016%2C11.049725532531738%2010.206976890563965%2C12.906073570251465%207.622087478637695%2C12.906073570251465%20C7.622087478637695%2C12.906073570251465%207.622087478637695%2C12.906073570251465%207.622087478637695%2C12.906073570251465z%20M7.622087478637695%2C0%20C3.1593029499053955%2C0%200%2C3.3149218559265137%200%2C8.022093772888184%20C0%2C12.685078620910645%203.1593029499053955%2C16%207.622087478637695%2C16%20C12.062784194946289%2C16%2015.200028419494629%2C12.685078620910645%2015.200028419494629%2C8.022093772888184%20C15.200028419494629%2C3.3149218559265137%2012.062784194946289%2C0%207.622087478637695%2C0%20C7.622087478637695%2C0%207.622087478637695%2C0%207.622087478637695%2C0z'%2F%3E%3Cpath%20transform%3D'translate(103.29000091552734%2C0.27000001072883606)'%20d%3D'%20M7.405848026275635%2C6.873104095458984%20C7.405848026275635%2C6.873104095458984%203.3160574436187744%2C6.873104095458984%203.3160574436187744%2C6.873104095458984%20C3.3160574436187744%2C6.873104095458984%203.3160574436187744%2C2.983504056930542%203.3160574436187744%2C2.983504056930542%20C3.3160574436187744%2C2.983504056930542%207.405848026275635%2C2.983504056930542%207.405848026275635%2C2.983504056930542%20C9.04176139831543%2C2.983504056930542%209.90394115447998%2C3.646505117416382%209.90394115447998%2C4.928304195404053%20C9.90394115447998%2C6.2101030349731445%209.04176139831543%2C6.873104095458984%207.405848026275635%2C6.873104095458984%20C7.405848026275635%2C6.873104095458984%207.405848026275635%2C6.873104095458984%207.405848026275635%2C6.873104095458984z%20M7.5605998039245605%2C0%20C7.5605998039245605%2C0%200%2C0%200%2C0%20C0%2C0%200%2C15.470022201538086%200%2C15.470022201538086%20C0%2C15.470022201538086%203.3160574436187744%2C15.470022201538086%203.3160574436187744%2C15.470022201538086%20C3.3160574436187744%2C15.470022201538086%203.3160574436187744%2C9.85659408569336%203.3160574436187744%2C9.85659408569336%20C3.3160574436187744%2C9.85659408569336%207.5605998039245605%2C9.85659408569336%207.5605998039245605%2C9.85659408569336%20C11.07561206817627%2C9.85659408569336%2013.219999313354492%2C8.000200271606445%2013.219999313354492%2C4.928304195404053%20C13.219999313354492%2C1.8563942909240723%2011.07561206817627%2C0%207.5605998039245605%2C0%20C7.5605998039245605%2C0%207.5605998039245605%2C0%207.5605998039245605%2C0z'%2F%3E%3Cpath%20transform%3D'translate(128.0399932861328%2C0)'%20d%3D'%20M10.914844512939453%2C10.5414400100708%20C10.340370178222656%2C12.044201850891113%209.191434860229492%2C12.906073570251465%207.622706890106201%2C12.906073570251465%20C5.0155181884765625%2C12.906073570251465%203.4246866703033447%2C11.049725532531738%203.4246866703033447%2C8.022093772888184%20C3.4246866703033447%2C4.95027494430542%205.0155181884765625%2C3.0939269065856934%207.622706890106201%2C3.0939269065856934%20C9.191434860229492%2C3.0939269065856934%2010.340370178222656%2C3.9557981491088867%2010.914844512939453%2C5.458559989929199%20C10.914844512939453%2C5.458559989929199%2014.427860260009766%2C5.458559989929199%2014.427860260009766%2C5.458559989929199%20C13.566211700439453%2C2.1436522006988525%2010.981111526489258%2C0%207.622706890106201%2C0%20C3.1595458984375%2C0%200%2C3.3149218559265137%200%2C8.022093772888184%20C0%2C12.685078620910645%203.1595458984375%2C16%207.622706890106201%2C16%20C11.003214836120605%2C16%2013.588300704956055%2C13.834254264831543%2014.449976921081543%2C10.5414400100708%20C14.449976921081543%2C10.5414400100708%2010.914844512939453%2C10.5414400100708%2010.914844512939453%2C10.5414400100708%20C10.914844512939453%2C10.5414400100708%2010.914844512939453%2C10.5414400100708%2010.914844512939453%2C10.5414400100708z'%2F%3E%3Cpath%20transform%3D'translate(117.83000183105469%2C0.27000001072883606)'%20d%3D'%20M0%2C0%20C0%2C0%206.1677093505859375%2C15.470022201538086%206.1677093505859375%2C15.470022201538086%20C6.1677093505859375%2C15.470022201538086%209.550004005432129%2C15.470022201538086%209.550004005432129%2C15.470022201538086%20C9.550004005432129%2C15.470022201538086%203.382294178009033%2C0%203.382294178009033%2C0%20C3.382294178009033%2C0%200%2C0%200%2C0%20C0%2C0%200%2C0%200%2C0z'%2F%3E%3Cpath%20transform%3D'translate(0%2C0.27000001072883606)'%20d%3D'%20M5.824605464935303%2C9.348296165466309%20C5.824605464935303%2C9.348296165466309%207.93500280380249%2C3.911694288253784%207.93500280380249%2C3.911694288253784%20C7.93500280380249%2C3.911694288253784%2010.045400619506836%2C9.348296165466309%2010.045400619506836%2C9.348296165466309%20C10.045400619506836%2C9.348296165466309%205.824605464935303%2C9.348296165466309%205.824605464935303%2C9.348296165466309%20C5.824605464935303%2C9.348296165466309%205.824605464935303%2C9.348296165466309%205.824605464935303%2C9.348296165466309z%20M6.166755199432373%2C0%20C6.166755199432373%2C0%200%2C15.470022201538086%200%2C15.470022201538086%20C0%2C15.470022201538086%203.4480772018432617%2C15.470022201538086%203.4480772018432617%2C15.470022201538086%20C3.4480772018432617%2C15.470022201538086%204.709278583526611%2C12.22130012512207%204.709278583526611%2C12.22130012512207%20C4.709278583526611%2C12.22130012512207%2011.16093635559082%2C12.22130012512207%2011.16093635559082%2C12.22130012512207%20C11.16093635559082%2C12.22130012512207%2012.421928405761719%2C15.470022201538086%2012.421928405761719%2C15.470022201538086%20C12.421928405761719%2C15.470022201538086%2015.87000560760498%2C15.470022201538086%2015.87000560760498%2C15.470022201538086%20C15.87000560760498%2C15.470022201538086%209.703250885009766%2C0%209.703250885009766%2C0%20C9.703250885009766%2C0%206.166755199432373%2C0%206.166755199432373%2C0%20C6.166755199432373%2C0%206.166755199432373%2C0%206.166755199432373%2C0z'%2F%3E%3C%2Fsvg%3E\") center / contain no-repeat;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-bar-actions {",
      "  display: flex;",
      "  align-items: center;",
      "  gap: 8px;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-signout {",
      "  appearance: none;",
      "  margin: 0;",
      "  border: 1px solid var(--dsh-ban-hairline);",
      "  border-radius: 8px;",
      "  background: var(--dsh-ban-card);",
      "  color: var(--dsh-ban-text);",
      "  padding: 6px 14px;",
      "  font: inherit;",
      "  font-size: 13px;",
      "  line-height: 18px;",
      "  cursor: pointer;",
      "  box-shadow: 0 1px 2px rgba(20, 20, 19, 0.05);",
      "  transition: background-color 0.12s ease;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-signout:hover {",
      "  background: var(--dsh-ban-hover);",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-window {",
      "  display: flex;",
      "  align-items: center;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-win {",
      "  appearance: none;",
      "  margin: 0;",
      "  border: 0;",
      "  background: transparent;",
      "  color: var(--dsh-ban-muted);",
      "  width: 34px;",
      "  height: 28px;",
      "  padding: 6px;",
      "  cursor: pointer;",
      "  border-radius: 4px;",
      "  transition: background-color 0.12s ease;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-win:hover {",
      "  background: var(--dsh-ban-hover);",
      "  color: var(--dsh-ban-text);",
      "}",
      "",
      "/* ---------- account_banned toast ---------- */",
      "body[data-dsh-claude-style] .dsh-claude-ban-toast {",
      "  position: absolute;",
      "  top: 94px;",
      "  right: 40px;",
      "  display: flex;",
      "  align-items: center;",
      "  gap: 10px;",
      "  max-width: 340px;",
      "  padding: 10px 12px;",
      "  border: 1px solid var(--dsh-ban-toast-border);",
      "  border-radius: 12px;",
      "  background: var(--dsh-ban-toast-bg);",
      "  color: var(--dsh-ban-toast-text);",
      "  font-size: 13px;",
      "  line-height: 18px;",
      "  cursor: pointer;",
      "  box-shadow: 0 4px 16px rgba(20, 20, 19, 0.08);",
      "  animation: dsh-claude-ban-toast-in 0.22s ease both;",
      "}",
      "",
      "@keyframes dsh-claude-ban-toast-in {",
      "  from { opacity: 0; transform: translateY(-6px); }",
      "  to { opacity: 1; transform: none; }",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-toast-icon {",
      "  flex: none;",
      "  width: 16px;",
      "  height: 16px;",
      "  color: var(--dsh-ban-toast-icon);",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-toast-text {",
      "  flex: 1;",
      "  min-width: 0;",
      "  overflow: hidden;",
      "  text-overflow: ellipsis;",
      "  white-space: nowrap;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-toast-close {",
      "  flex: none;",
      "  width: 14px;",
      "  height: 14px;",
      "  opacity: 0.7;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-toast:hover {",
      "  border-color: var(--dsh-ban-toast-icon);",
      "}",
      "",
      "/* ---------- content column ---------- */",
      "/* The page is one centred column: the card stack is the page's measure, so it",
      "   is centred in the window rather than pinned to a left inset, and capped so it",
      "   never stretches into a measure no one wants to read. */",
      "body[data-dsh-claude-style] .dsh-claude-ban-scroll {",
      "  position: absolute;",
      "  inset: 86px 0 0 0;",
      "  overflow-y: auto;",
      "  overflow-x: hidden;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-column {",
      "  width: 63%;",
      "  max-width: 1150px;",
      "  margin: 0 auto;",
      "  padding: 70px 40px 96px;",
      "}",
      "",
      "/* The icon box is the lock's size lever: the traced ink is 20 of the SVG's 24",
      "   units, so 75px here paints a ~61px lock — the reference page's lock, which",
      "   reads about a third larger than the 58px box did next to the same title. */",
      "body[data-dsh-claude-style] .dsh-claude-ban-lock {",
      "  display: block;",
      "  width: 75px;",
      "  height: 75px;",
      "  color: var(--dsh-ban-text);",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-title {",
      "  margin: 26px 0 0;",
      "  font-family: var(--dsw-font-serif);",
      "  font-size: 31px;",
      "  font-weight: 500;",
      "  line-height: 1.2;",
      "  letter-spacing: -0.015em;",
      "  color: var(--dsh-ban-text);",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-lead {",
      "  margin: 22px 0 0;",
      "  font-size: 15px;",
      "  line-height: 1.6;",
      "  color: var(--dsh-ban-text);",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-lead strong {",
      "  font-weight: 700;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-next {",
      "  margin: 32px 0 0;",
      "  font-size: 15px;",
      "  line-height: 1.6;",
      "  color: var(--dsh-ban-text);",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-subtitle {",
      "  margin: 44px 0 0;",
      "  font-family: var(--dsw-font-family);",
      "  font-size: 17px;",
      "  font-weight: 600;",
      "  line-height: 1.4;",
      "  letter-spacing: 0;",
      "  color: var(--dsh-ban-text);",
      "}",
      "",
      "/* ---------- cards: the numbered steps and the two account actions ---------- */",
      "body[data-dsh-claude-style] .dsh-claude-ban-card {",
      "  margin-top: 18px;",
      "  border: 1px solid var(--dsh-ban-hairline);",
      "  border-radius: 12px;",
      "  background: var(--dsh-ban-card);",
      "  overflow: hidden;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-step {",
      "  display: flex;",
      "  align-items: flex-start;",
      "  gap: 14px;",
      "  padding: 16px 24px;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-step-num {",
      "  flex: none;",
      "  width: 24px;",
      "  height: 24px;",
      "  margin-top: 1px;",
      "  border-radius: 50%;",
      "  background: var(--dsh-ban-hover);",
      "  color: var(--dsh-ban-text);",
      "  font-size: 12px;",
      "  line-height: 24px;",
      "  text-align: center;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-step-body {",
      "  display: block;",
      "  min-width: 0;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-step-title {",
      "  display: block;",
      "  font-size: 15px;",
      "  font-weight: 500;",
      "  line-height: 1.5;",
      "  color: var(--dsh-ban-text);",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-step-desc {",
      "  display: block;",
      "  margin-top: 2px;",
      "  font-size: 13.5px;",
      "  line-height: 1.5;",
      "  color: var(--dsh-ban-muted);",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-primary {",
      "  appearance: none;",
      "  display: inline-block;",
      "  margin: 26px 0 0;",
      "  border: 0;",
      "  border-radius: 8px;",
      "  background: var(--dsh-ban-primary-fill);",
      "  color: var(--dsh-ban-primary-text);",
      "  padding: 9px 18px;",
      "  font: inherit;",
      "  font-size: 14px;",
      "  font-weight: 500;",
      "  line-height: 20px;",
      "  cursor: pointer;",
      "  transition: background-color 0.12s ease;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-primary:hover {",
      "  background: var(--dsh-ban-primary-hover);",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-actions {",
      "  margin-top: 18px;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-action {",
      "  appearance: none;",
      "  display: flex;",
      "  align-items: flex-start;",
      "  gap: 16px;",
      "  width: 100%;",
      "  margin: 0;",
      "  border: 0;",
      "  background: transparent;",
      "  color: inherit;",
      "  padding: 18px 24px;",
      "  font: inherit;",
      "  text-align: left;",
      "  cursor: pointer;",
      "  transition: background-color 0.12s ease;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-action + .dsh-claude-ban-action {",
      "  border-top: 1px solid var(--dsh-ban-hairline);",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-action:hover {",
      "  background: var(--dsh-ban-hover);",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-action-icon {",
      "  flex: none;",
      "  width: 18px;",
      "  height: 18px;",
      "  margin-top: 2px;",
      "  color: var(--dsh-ban-muted);",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-action-text {",
      "  display: block;",
      "  flex: 1;",
      "  min-width: 0;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-action-title {",
      "  display: block;",
      "  font-size: 15px;",
      "  font-weight: 500;",
      "  line-height: 1.5;",
      "  color: var(--dsh-ban-text);",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-action-title-danger {",
      "  color: var(--dsh-ban-danger);",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-action:hover .dsh-claude-ban-action-title-danger {",
      "  color: var(--dsh-ban-danger-hover);",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-action-desc {",
      "  display: block;",
      "  margin-top: 3px;",
      "  font-size: 13.5px;",
      "  line-height: 1.5;",
      "  color: var(--dsh-ban-muted);",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-ban-action-chevron {",
      "  flex: none;",
      "  width: 18px;",
      "  height: 18px;",
      "  margin-top: 3px;",
      "  color: var(--dsh-ban-muted);",
      "}",
      "",
      "/* Narrow windows: drop the fixed left inset so the column keeps its measure",
      "   instead of being squeezed against the right edge. */",
      "@media (max-width: 1000px) {",
      "  body[data-dsh-claude-style] .dsh-claude-ban-column {",
      "    width: auto;",
      "    padding: 72px 32px 80px;",
      "  }",
      "",
      "  body[data-dsh-claude-style] .dsh-claude-ban-toast {",
      "    right: 24px;",
      "    max-width: calc(100% - 48px);",
      "  }",
      "}",
      "",
      "/* ---------- Claude Code layout: model picker ---------- */",
      "/* Replaces the host's two-pane model menu: level 1 carries the current",
      "   provider's models, a divider, the effort row and a More models row; both",
      "   rows open their level 2 beside this popover. Container metrics mirror the",
      "   permission popover so the two read as one design. */",
      "body[data-dsh-claude-style] .dsh-claude-model-popover {",
      "  position: fixed !important;",
      "  min-width: 248px !important;",
      "  max-width: min(360px, calc(100vw - 16px)) !important;",
      "  max-height: min(440px, calc(100vh - 96px)) !important;",
      "  overflow-y: auto !important;",
      "  background: var(--dsw-alias-bg-overlay, #ffffff) !important;",
      "  border: 1px solid var(--dsw-alias-border-l1, #e8e6dc) !important;",
      "  border-radius: 12px !important;",
      "  box-shadow: 0 8px 30px rgba(20, 20, 19, 0.12), 0 2px 8px rgba(20, 20, 19, 0.06) !important;",
      "  padding: 6px !important;",
      "  box-sizing: border-box !important;",
      "  z-index: 99999 !important;",
      "  display: flex !important;",
      "  flex-direction: column !important;",
      "  gap: 6px !important;",
      "  opacity: 0 !important;",
      "  pointer-events: none !important;",
      "  transform: translateY(4px) scale(0.98) !important;",
      "  transform-origin: bottom right !important;",
      "  transition: opacity 0.15s ease, transform 0.15s ease !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-model-popover[data-open=\"true\"] {",
      "  opacity: 1 !important;",
      "  pointer-events: auto !important;",
      "  transform: translateY(0) scale(1) !important;",
      "}",
      "body[data-dsh-claude-style][data-ds-dark-theme] .dsh-claude-model-popover {",
      "  background: #1e1e1d !important;",
      "  border-color: #2e2c29 !important;",
      "  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3) !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-model-popover-body {",
      "  display: flex !important;",
      "  flex-direction: column !important;",
      "  gap: 6px !important;",
      "  min-width: 0 !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-model-status {",
      "  color: var(--dsw-alias-label-tertiary, #8f8d84) !important;",
      "  font-size: 12px !important;",
      "  line-height: 20px !important;",
      "  padding: 4px 8px !important;",
      "}",
      "/* The sub popover is taller than the first level; its provider labels stay",
      "   pinned to the top while the list scrolls, the next provider replacing the",
      "   previous one. */",
      "body[data-dsh-claude-style] .dsh-claude-model-popover-sub {",
      "  max-height: min(540px, calc(100vh - 80px)) !important;",
      "  padding-top: 0 !important;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-model-group-section {",
      "  position: relative !important;",
      "  display: flex !important;",
      "  flex-direction: column !important;",
      "  gap: 6px !important;",
      "  min-width: 0 !important;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-model-group-row {",
      "  position: sticky !important;",
      "  top: 0 !important;",
      "  z-index: 6 !important;",
      "  align-self: stretch !important;",
      "  margin: 0 !important;",
      "  padding: 6px 8px 2px 8px !important;",
      "  background: var(--dsw-alias-bg-overlay, #ffffff) !important;",
      "}",
      "",
      "body[data-dsh-claude-style][data-ds-dark-theme] .dsh-claude-model-group-row {",
      "  background: #1e1e1d !important;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-model-group {",
      "  display: inline-flex !important;",
      "  align-items: center !important;",
      "  gap: 5px !important;",
      "  margin: 0 !important;",
      "  padding: 2px 8px !important;",
      "  background: #141413 !important;",
      "  color: #faf9f5 !important;",
      "  border-radius: 6px !important;",
      "  font-size: 11px !important;",
      "  font-weight: 600 !important;",
      "  line-height: 16px !important;",
      "}",
      "",
      "body[data-dsh-claude-style][data-ds-dark-theme] .dsh-claude-model-group {",
      "  background: #faf9f5 !important;",
      "  color: #141413 !important;",
      "}",
      "",
      "/* Vendor mark: a vendored Lobe Icons mono SVG stamped into the row by the",
      "   picker (src/assets/icons/lobe/README.md). The SVG is `fill=\"currentColor\"`, so the",
      "   surrounding colour paints it and there is no per-brand rule. The box is fixed",
      "   and always present, so a row whose vendor has no mark keeps the same text",
      "   column as its neighbours. */",
      "body[data-dsh-claude-style] .dsh-claude-model-brand {",
      "  display: inline-flex !important;",
      "  align-items: center !important;",
      "  justify-content: center !important;",
      "  width: 16px !important;",
      "  height: 16px !important;",
      "  flex: none !important;",
      "  color: var(--dsw-alias-label-secondary, #787672) !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-model-brand svg {",
      "  display: block !important;",
      "  width: 16px !important;",
      "  height: 16px !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-model-brand img {",
      "  display: block !important;",
      "  width: 16px !important;",
      "  height: 16px !important;",
      "  object-fit: contain !important;",
      "}",
      "/* Inside the provider pill the mark is part of the label: it takes the pill's",
      "   inverted colour and steps down to the label's own size. */",
      "body[data-dsh-claude-style] .dsh-claude-model-group .dsh-claude-model-brand {",
      "  width: 13px !important;",
      "  height: 13px !important;",
      "  color: inherit !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-model-group .dsh-claude-model-brand svg {",
      "  width: 13px !important;",
      "  height: 13px !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-model-group .dsh-claude-model-brand img {",
      "  width: 13px !important;",
      "  height: 13px !important;",
      "}",
      "/* Model / effort option: same row metrics and hover as the drawer items. */",
      "body[data-dsh-claude-style] .dsh-claude-model-option {",
      "  display: flex !important;",
      "  align-items: center !important;",
      "  gap: 8px !important;",
      "  width: 100% !important;",
      "  min-height: 32px !important;",
      "  padding: 4px 8px !important;",
      "  border: none !important;",
      "  border-radius: 6px !important;",
      "  background: transparent !important;",
      "  color: var(--dsw-alias-label-primary, #141413) !important;",
      "  font-size: 13px !important;",
      "  text-align: left !important;",
      "  cursor: pointer !important;",
      "  box-sizing: border-box !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-model-option:hover {",
      "  background: var(--dsh-claude-hover-bg, rgba(0, 0, 0, 0.08)) !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-model-copy {",
      "  display: flex !important;",
      "  flex-direction: column !important;",
      "  gap: 2px !important;",
      "  flex: 1 !important;",
      "  min-width: 0 !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-model-name {",
      "  font-size: 13px !important;",
      "  font-weight: 500 !important;",
      "  line-height: 16px !important;",
      "}",
      "/* A Gemini row wears Gemini's own face for its name. The row already carries the",
      "   vendor's mark, and the name is the one string in the picker that names a model",
      "   rather than the shell — so the vendor's typeface is the same signal in a second",
      "   material. `data-brand` is the mark id the picker stamps on the row",
      "   (src/overrides/model-picker.js); only Gemini resolves to a face today, and a",
      "   brand without one simply keeps the UI face. The stack is additive: a name with",
      "   a character outside the Latin subset falls through character by character. */",
      "body[data-dsh-claude-style] .dsh-claude-model-option[data-brand='gemini'] .dsh-claude-model-name {",
      "  font-family: var(--dsw-font-brand-gemini) !important;",
      "}",
      "/* The Kimi wordmark stands in for the word \"Kimi\" inside a row's label: the",
      "   vendor's own lettering, so the label keeps naming the vendor while the row",
      "   already wears its mark. Its height follows the label's own cap height — `cap`",
      "   is the font's cap-height unit, and the em value in front of it is the fallback",
      "   for browsers without that unit (Anthropic Sans measures cap 1440/2000, so the",
      "   two agree exactly on the shipped face). The 96×32 box scales from that height;",
      "   both declarations carry !important, or the fallback would win on order. */",
      "body[data-dsh-claude-style] .dsh-claude-model-wordmark {",
      "  display: inline-block !important;",
      "  height: 0.72em !important;",
      "  height: 1cap !important;",
      "  margin-right: 0.25em !important;",
      "  vertical-align: baseline !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-model-wordmark svg {",
      "  display: block !important;",
      "  height: 100% !important;",
      "  width: auto !important;",
      "}",
      "/* The word the mark stands in for stays in the accessibility tree: the mark is",
      "   decorative markup, so without this a screen reader would announce \"K3\" where",
      "   the row means \"Kimi K3\". */",
      "body[data-dsh-claude-style] .dsh-claude-model-wordmark-alt {",
      "  position: absolute !important;",
      "  width: 1px !important;",
      "  height: 1px !important;",
      "  overflow: hidden !important;",
      "  clip-path: inset(50%) !important;",
      "  white-space: nowrap !important;",
      "}",
      "/* The row carries one description line, in the shell's language: the copy",
      "   document is localized rather than stacked, so there is no second-language",
      "   rule to style. */",
      "body[data-dsh-claude-style] .dsh-claude-model-desc {",
      "  font-size: 11px !important;",
      "  line-height: 14px !important;",
      "  color: var(--dsw-alias-label-tertiary, #8f8d84) !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-model-check {",
      "  flex: none !important;",
      "  display: inline-flex !important;",
      "  align-items: center !important;",
      "  color: var(--dsw-alias-brand-primary, #d97757) !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-model-divider {",
      "  height: 1px !important;",
      "  background: var(--dsw-alias-border-l1, #e8e6dc) !important;",
      "  margin: 2px 4px !important;",
      "  flex: none !important;",
      "}",
      "/* Level-2 row: label + current value + chevron; hover opens its own level. */",
      "body[data-dsh-claude-style] .dsh-claude-model-cell {",
      "  display: flex !important;",
      "  align-items: center !important;",
      "  gap: 8px !important;",
      "  width: 100% !important;",
      "  min-height: 32px !important;",
      "  padding: 4px 8px !important;",
      "  border: none !important;",
      "  border-radius: 6px !important;",
      "  background: transparent !important;",
      "  color: var(--dsw-alias-label-primary, #141413) !important;",
      "  font-size: 13px !important;",
      "  text-align: left !important;",
      "  cursor: pointer !important;",
      "  box-sizing: border-box !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-model-cell:hover {",
      "  background: var(--dsh-claude-hover-bg, rgba(0, 0, 0, 0.08)) !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-model-cell-label {",
      "  flex: 1 !important;",
      "  min-width: 0 !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-model-cell-value {",
      "  flex: none !important;",
      "  color: var(--dsw-alias-label-tertiary, #8f8d84) !important;",
      "  font-size: 12px !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-model-cell-chevron {",
      "  flex: none !important;",
      "  display: inline-flex !important;",
      "  align-items: center !important;",
      "  color: var(--dsw-alias-label-caption, #a6a094) !important;",
      "}",
      "",
      "/* Popover Header. Vertical padding only: the clickable account row carries its",
      "   own inline padding (components/account-footer.css), and the divider below is a",
      "   full-bleed rule that must not be inset by this box. */",
      "body[data-dsh-claude-style] .dsh-claude-account-popover-header {",
      "  padding: 6px 0 !important;",
      "  display: flex !important;",
      "  flex-direction: column !important;",
      "  gap: 2px !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-account-popover-name {",
      "  font-size: 14px !important;",
      "  font-weight: 600 !important;",
      "  color: var(--dsw-alias-label-primary, #141413) !important;",
      "  line-height: 18px !important;",
      "  font-family: var(--dsw-font-family) !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-account-popover-divider {",
      "  height: 1px !important;",
      "  background: var(--dsw-alias-border-l1, #e8e6dc) !important;",
      "  margin: 2px 0 !important;",
      "  flex: none !important;",
      "}",
      "",
      "/* Popover Body & Items */",
      "body[data-dsh-claude-style] .dsh-claude-account-popover-body {",
      "  display: flex !important;",
      "  flex-direction: column !important;",
      "  gap: 2px !important;",
      "  max-height: 360px !important;",
      "  overflow-y: auto !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-popover-item {",
      "  width: 100% !important;",
      "  height: 32px !important;",
      "  min-height: 32px !important;",
      "  padding: 0 8px !important;",
      "  border-radius: 6px !important;",
      "  border: none !important;",
      "  background: transparent !important;",
      "  color: var(--dsw-alias-label-primary, #141413) !important;",
      "  font-size: 13px !important;",
      "  font-weight: 400 !important;",
      "  display: flex !important;",
      "  align-items: center !important;",
      "  justify-content: flex-start !important;",
      "  gap: 8px !important;",
      "  box-shadow: none !important;",
      "  cursor: pointer !important;",
      "  font-family: var(--dsw-font-family) !important;",
      "  transition: background-color 0.12s ease !important;",
      "  box-sizing: border-box !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-popover-item:hover {",
      "  background: var(--dsh-claude-hover-bg, rgba(0, 0, 0, 0.08)) !important;",
      "  color: var(--dsw-alias-label-primary, #141413) !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-popover-item-icon {",
      "  display: inline-flex !important;",
      "  align-items: center !important;",
      "  justify-content: center !important;",
      "  width: 16px !important;",
      "  height: 16px !important;",
      "  flex: none !important;",
      "  color: var(--dsw-alias-label-secondary, #787672) !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-popover-item-icon svg {",
      "  width: 16px !important;",
      "  height: 16px !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-popover-item-text {",
      "  flex: 1 !important;",
      "  min-width: 0 !important;",
      "  overflow: hidden !important;",
      "  text-overflow: ellipsis !important;",
      "  white-space: nowrap !important;",
      "  text-align: left !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-popover-item-shortcut {",
      "  margin-left: auto !important;",
      "  font-size: 11px !important;",
      "  color: var(--dsw-alias-label-tertiary, #a6a094) !important;",
      "  font-family: var(--ds-font-family-code, monospace) !important;",
      "  padding-left: 8px !important;",
      "}",
      "body[data-dsh-claude-style] .dsh-claude-popover-item-badge {",
      "  margin-left: auto !important;",
      "  font-size: 10px !important;",
      "  line-height: 14px !important;",
      "  padding: 0 5px !important;",
      "  border-radius: 8px !important;",
      "  background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.08)) !important;",
      "  color: var(--dsw-alias-label-secondary, #787672) !important;",
      "}",
      "",
      "/* Ensure popover items only display inside the popover */",
      "body[data-dsh-claude-style] [class*=\"footArea\"] > .dsh-claude-popover-item {",
      "  display: none !important;",
      "}",
      "",
      "/* ---------- Footer takeover ----------",
      "   Everything in this block modifies the HOST's own footer (it hides entries and",
      "   zeroes the containers that host them) and exists only because the skin",
      "   replaces that footer with its account row. The \"Collapse the sidebar settings",
      "   area\" preference turns the whole takeover off, so each rule below carries",
      "   data-dsh-claude-footer-takeover — the skin sets it on <body> only while the takeover is on,",
      "   and with it absent the host footer renders exactly as shipped. */",
      "/* Hide original trigger buttons in footArea while keeping containers intact for modals */",
      "body[data-dsh-claude-style][data-dsh-claude-footer-takeover] [class*=\"footArea\"] > [class*=\"settingsArea\"] > [class*=\"triggerRow\"],",
      "body[data-dsh-claude-style][data-dsh-claude-footer-takeover] [class*=\"footArea\"] > [class*=\"footerActions\"] :is([class*=\"footerButtons\"], > button) {",
      "  display: none !important;",
      "}",
      "/* Both containers stay mounted at zero size so the overlays they host keep",
      "   painting, but the collapse must stay geometric. font-size and line-height",
      "   inherit, and the settings dialog mounts IN PLACE inside settingsArea (the",
      "   host renders its overlay as a sibling of the trigger row — no portal): the",
      "   dialog inherited font-size: 0 with line-height: 0px, so every text line",
      "   that sets an explicit font-size without its own line-height (the SubAgent",
      "   page's rows, the onboarding overlay) collapsed to a 0px line box and",
      "   vanished. settingsArea hosts nothing besides its display:none'd trigger row",
      "   and those in-place overlays, so it keeps only the geometric collapse and",
      "   hands real inherited metrics down; footerActions still hosts plain plugin",
      "   entries whose stray in-flow text only the zeroing keeps invisible, so the",
      "   full collapse stays there. */",
      "body[data-dsh-claude-style][data-dsh-claude-footer-takeover] [class*=\"footArea\"] > [class*=\"settingsArea\"] {",
      "  position: static !important;",
      "  width: 0 !important;",
      "  height: 0 !important;",
      "  margin: 0 !important;",
      "  padding: 0 !important;",
      "  overflow: visible !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-footer-takeover] [class*=\"footArea\"] > [class*=\"footerActions\"] {",
      "  position: static !important;",
      "  width: 0 !important;",
      "  height: 0 !important;",
      "  margin: 0 !important;",
      "  padding: 0 !important;",
      "  line-height: 0 !important;",
      "  font-size: 0 !important;",
      "  overflow: visible !important;",
      "}",
      "",
      "/* Generic footer-action redirection. The `sidebar.footer.action` slot accepts",
      "   arbitrary plugin controls, not just buttons; overrides.js marks every",
      "   mirrored entry (`data-dsh-claude-footer-entry`) and hides it in place",
      "   (`data-dsh-claude-footer-hidden`) once it is redirected into the account",
      "   popover. Entries that host a floating overlay (a fixed panel or dialog)",
      "   keep their subtree visible — the overlay must stay reachable after the",
      "   mirrored popover item opens it — but the entry box itself collapses so it",
      "   never paints inside the zero-sized footerActions container. */",
      "body[data-dsh-claude-style][data-dsh-claude-footer-takeover] [class*=\"footArea\"] [data-dsh-claude-footer-hidden] {",
      "  display: none !important;",
      "}",
      "body[data-dsh-claude-style][data-dsh-claude-footer-takeover] [class*=\"footArea\"] [data-dsh-claude-footer-entry] {",
      "  width: 0 !important;",
      "  height: 0 !important;",
      "  min-width: 0 !important;",
      "  min-height: 0 !important;",
      "  margin: 0 !important;",
      "  padding: 0 !important;",
      "  border: none !important;",
      "  background: transparent !important;",
      "  box-shadow: none !important;",
      "  overflow: visible !important;",
      "}",
      "",
      "/* Collapsed rail mode adaptations */",
      "body[data-dsh-claude-style] [class*=\"root\"][class*=\"collapsed\"] .dsh-claude-account-btn {",
      "  width: 36px !important;",
      "  height: 36px !important;",
      "  padding: 0 !important;",
      "  justify-content: center !important;",
      "}",
      "body[data-dsh-claude-style] [class*=\"root\"][class*=\"collapsed\"] .dsh-claude-account-avatar {",
      "  margin-right: 0 !important;",
      "}",
      "body[data-dsh-claude-style] [class*=\"root\"][class*=\"collapsed\"] :is(.dsh-claude-account-label, .dsh-claude-account-chevron) {",
      "  display: none !important;",
      "}",
      "/* The rail's popover cannot stay an absolutely positioned child of the footer.",
      "   The sidebar column is 56px wide with `overflow: hidden`, so a panel anchored",
      "   past the rail edge is cut off the moment it crosses it — and the base rule's",
      "   percentage max-width, measured against the 59px footer, squashed it to 43px.",
      "   Fixed positioning lifts it out of that clip (no ancestor is a containing block",
      "   for it), and overrides.js anchors it to the trigger from there. left/right/",
      "   bottom are reset so the base rule's own `!important` anchors cannot fight the",
      "   resolved coordinates. */",
      "body[data-dsh-claude-style] [class*=\"root\"][class*=\"collapsed\"] .dsh-claude-account-popover {",
      "  position: fixed !important;",
      "  left: auto !important;",
      "  right: auto !important;",
      "  bottom: auto !important;",
      "  top: auto !important;",
      "  width: 220px !important;",
      "  max-width: min(220px, calc(100vw - 16px)) !important;",
      "  transform-origin: bottom left !important;",
      "}",
      "/* The rail opens the panel beside the trigger, not above it, so the hover bridge",
      "   has to span the horizontal gap: the base rule's downward strip would sit under",
      "   the panel and leave the pointer's 8px crossing uncovered. */",
      "body[data-dsh-claude-style] [class*=\"root\"][class*=\"collapsed\"] .dsh-claude-account-popover::after {",
      "  top: 0 !important;",
      "  bottom: 0 !important;",
      "  left: auto !important;",
      "  right: 100% !important;",
      "  width: 12px !important;",
      "  height: auto !important;",
      "}",
      "/* In the rail the account button is the only control; the settings entry lives",
      "   in the popover. The settings container is zero-sized rather than hidden (its",
      "   dialog must stay reachable), which is enough while the sidebar is wide — the",
      "   entry is squeezed to a 4px sliver. A plugin that ships its own rail variant",
      "   escapes that box instead: the settings plugin's `…_rail` trigger keeps its",
      "   full 36px square and lands straight on top of the Claude mark. Hide the entry",
      "   in the rail. Reachability is unaffected — the popover's settings item opens",
      "   the real trigger programmatically (`realTrigger.click()`), which",
      "   display:none does not block. */",
      "body[data-dsh-claude-style][data-dsh-claude-footer-takeover] [class*=\"root\"][class*=\"collapsed\"] [class*=\"footArea\"] [class*=\"settingsArea\"] :is(button, [class*=\"triggerRow\"]) {",
      "  display: none !important;",
      "}",
      "",
      "/* Embedded footer widgets: display-only plugin entries (progress bars,",
      "   status panels — the cost-meter balance/quota stack is the known case)",
      "   cannot collapse into a text menu item, so overrides.js embeds a live clone",
      "   of the entry into the popover. The embed sits above the action items with",
      "   a hairline separator; the cloned plugin markup keeps its own classes, so",
      "   the plugin's own stylesheet styles the content. */",
      "body[data-dsh-claude-style] .dsh-claude-popover-embed {",
      "  padding: 2px 2px 6px;",
      "  margin-bottom: 4px;",
      "  border-bottom: 1px solid var(--dsw-alias-border-l2, #2e2c29);",
      "  border-radius: 7px;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-popover-embed[data-clickable] {",
      "  cursor: pointer;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-popover-embed[data-clickable]:hover {",
      "  background: var(--dsh-claude-hover-bg, rgba(0, 0, 0, 0.08));",
      "}",
      "",
      "body[data-dsh-claude-style]:not([data-ds-dark-theme]) .dsh-claude-popover-embed {",
      "  border-bottom-color: #e8e6dc;",
      "}",
      "",
      "/* ---------- Third-party repair: dsh-agy-link run_code fallback card ---------- */",
      "/* The agy-link bridge replaces the host run_code tool card with its own keyed",
      "   toolview; its non-mirror fallback ships an unstyled header (two bare spans,",
      "   not even a gap) and a bare pre. Give the header the tool-row rhythm, the",
      "   tool name the skin's technical-meta mono voice (overriding the editorial",
      "   serif the `[class*=\"title\"]` rule lends it), the variant label a real",
      "   pill, and the code preview card padding. */",
      "body[data-dsh-claude-style] .agy-tv-header {",
      "  display: flex;",
      "  align-items: center;",
      "  gap: 8px;",
      "  min-height: 24px;",
      "}",
      "body[data-dsh-claude-style] .agy-tv-title {",
      "  font-family: var(--dsw-font-code);",
      "  font-weight: 500;",
      "  font-size: 12px;",
      "  letter-spacing: 0;",
      "  line-height: 24px;",
      "  color: var(--dsw-alias-label-secondary);",
      "}",
      "body[data-dsh-claude-style] .agy-tv-badge {",
      "  font-family: var(--dsw-font-code);",
      "  font-size: 11px;",
      "  line-height: 16px;",
      "  padding: 0 6px;",
      "  border-radius: 9999px;",
      "  background: var(--dsw-alias-interactive-bg-hover);",
      "  color: var(--dsw-alias-label-tertiary);",
      "}",
      "body[data-dsh-claude-style] .agy-tv-pre {",
      "  padding: 10px 12px;",
      "  overflow-x: auto;",
      "}",
      "",
      "/* ---------- Settings dialog: modal panel background ---------- */",
      "/* In light mode, the host dialog defaults to var(--dsw-alias-bg-layer-2);",
      "   align the dialog card with the main canvas (#fcfcfb). */",
      "body[data-dsh-claude-style]:not([data-ds-dark-theme]) :is([class*=\"settingsArea\"] [class*=\"_panel\"], [class*=\"settingsArea\"] [role=\"dialog\"], [class*=\"_overlay\"] > [class*=\"_panel\"]) {",
      "  background: var(--dsw-alias-bg-base) !important;",
      "}",
      "",
      "/* ---------- Settings dialog: Claude Style tab icon ---------- */",
      "/* Replace the host's default settings gear icon on the Claude Style nav tab",
      "   with the monochrome Claude starburst icon (black in light mode). */",
      "body[data-dsh-claude-style] button[data-dsh-section=\"claude-style\"] [class*=\"_navIcon\"] {",
      "  display: none !important;",
      "}",
      "",
      "body[data-dsh-claude-style] button[data-dsh-section=\"claude-style\"]::before {",
      "  content: \"\";",
      "  display: block;",
      "  flex: none;",
      "  width: 16px;",
      "  height: 16px;",
      "  background-color: currentColor;",
      "  -webkit-mask: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20148.09%20148.18'%3E%3Cg%20transform%3D'translate(-75.96%2C-223.53)'%3E%3Cpath%20d%3D'm%20105.01%2C322.07%2029.14%2C-16.35%200.49%2C-1.42%20-0.49%2C-0.79%20h%20-1.42%20l%20-4.87%2C-0.3%20-16.65%2C-0.45%20-14.44%2C-0.6%20-13.99%2C-0.75%20-3.52%2C-0.75%20-3.3%2C-4.35%200.34%2C-2.17%202.96%2C-1.99%204.24%2C0.37%209.37%2C0.64%2014.06%2C0.97%2010.2%2C0.6%2015.11%2C1.57%20h%202.4%20l%200.34%2C-0.97%20-0.82%2C-0.6%20-0.64%2C-0.6%20-14.55%2C-9.86%20-15.75%2C-10.42%20-8.25%2C-6%20-4.46%2C-3.04%20-2.25%2C-2.85%20-0.97%2C-6.22%204.05%2C-4.46%205.44%2C0.37%201.39%2C0.37%205.51%2C4.24%2011.77%2C9.11%2015.37%2C11.32%202.25%2C1.87%200.9%2C-0.64%200.11%2C-0.45%20-1.01%2C-1.69%20-8.36%2C-15.11%20-8.92%2C-15.37%20-3.97%2C-6.37%20-1.05%2C-3.82%20c%20-0.37%2C-1.57%20-0.64%2C-2.89%20-0.64%2C-4.5%20l%204.61%2C-6.26%202.55%2C-0.82%206.15%2C0.82%202.59%2C2.25%203.82%2C8.74%206.19%2C13.76%209.6%2C18.71%202.81%2C5.55%201.5%2C5.14%200.56%2C1.57%20h%200.97%20v%20-0.9%20l%200.79%2C-10.54%201.46%2C-12.94%201.42%2C-16.65%200.49%2C-4.69%202.32%2C-5.62%204.61%2C-3.04%203.6%2C1.72%202.96%2C4.24%20-0.41%2C2.74%20-1.76%2C11.44%20-3.45%2C17.92%20-2.25%2C12%20h%201.31%20l%201.5%2C-1.5%206.07%2C-8.06%2010.2%2C-12.75%204.5%2C-5.06%205.25%2C-5.59%203.37%2C-2.66%20h%206.37%20l%204.69%2C6.97%20-2.1%2C7.2%20-6.56%2C8.32%20-5.44%2C7.05%20-7.8%2C10.5%20-4.87%2C8.4%200.45%2C0.67%201.16%2C-0.11%2017.62%2C-3.75%209.52%2C-1.72%2011.36%2C-1.95%205.14%2C2.4%200.56%2C2.44%20-2.02%2C4.99%20-12.15%2C3%20-14.25%2C2.85%20-21.22%2C5.02%20-0.26%2C0.19%200.3%2C0.37%209.56%2C0.9%204.09%2C0.22%20h%2010.01%20l%2018.64%2C1.39%204.87%2C3.22%202.92%2C3.94%20-0.49%2C3%20-7.5%2C3.82%20-10.12%2C-2.4%20-23.62%2C-5.62%20-8.1%2C-2.02%20h%20-1.12%20v%200.67%20l%206.75%2C6.6%2012.37%2C11.17%2015.49%2C14.4%200.79%2C3.56%20-1.99%2C2.81%20-2.1%2C-0.3%20-13.61%2C-10.24%20-5.25%2C-4.61%20-11.89%2C-10.01%20h%20-0.79%20v%201.05%20l%202.74%2C4.01%2014.47%2C21.75%200.75%2C6.67%20-1.05%2C2.17%20-3.75%2C1.31%20-4.12%2C-0.75%20-8.47%2C-11.89%20-8.74%2C-13.39%20-7.05%2C-12%20-0.86%2C0.49%20-4.16%2C44.81%20-1.95%2C2.29%20-4.5%2C1.72%20-3.75%2C-2.85%20-1.99%2C-4.61%201.99%2C-9.11%202.4%2C-11.89%201.95%2C-9.45%201.76%2C-11.74%201.05%2C-3.9%20-0.07%2C-0.26%20-0.86%2C0.11%20-8.85%2C12.15%20-13.46%2C18.19%20-10.65%2C11.4%20-2.55%2C1.01%20-4.42%2C-2.29%200.41%2C-4.09%202.47%2C-3.64%2014.74%2C-18.75%208.89%2C-11.62%205.74%2C-6.71%20-0.04%2C-0.97%20h%20-0.34%20l%20-39.15%2C25.42%20-6.97%2C0.9%20-3%2C-2.81%200.37%2C-4.61%201.42%2C-1.5%2011.77%2C-8.1%20-0.04%2C0.04%20z'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\") center / contain no-repeat;",
      "  mask: url(\"data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20148.09%20148.18'%3E%3Cg%20transform%3D'translate(-75.96%2C-223.53)'%3E%3Cpath%20d%3D'm%20105.01%2C322.07%2029.14%2C-16.35%200.49%2C-1.42%20-0.49%2C-0.79%20h%20-1.42%20l%20-4.87%2C-0.3%20-16.65%2C-0.45%20-14.44%2C-0.6%20-13.99%2C-0.75%20-3.52%2C-0.75%20-3.3%2C-4.35%200.34%2C-2.17%202.96%2C-1.99%204.24%2C0.37%209.37%2C0.64%2014.06%2C0.97%2010.2%2C0.6%2015.11%2C1.57%20h%202.4%20l%200.34%2C-0.97%20-0.82%2C-0.6%20-0.64%2C-0.6%20-14.55%2C-9.86%20-15.75%2C-10.42%20-8.25%2C-6%20-4.46%2C-3.04%20-2.25%2C-2.85%20-0.97%2C-6.22%204.05%2C-4.46%205.44%2C0.37%201.39%2C0.37%205.51%2C4.24%2011.77%2C9.11%2015.37%2C11.32%202.25%2C1.87%200.9%2C-0.64%200.11%2C-0.45%20-1.01%2C-1.69%20-8.36%2C-15.11%20-8.92%2C-15.37%20-3.97%2C-6.37%20-1.05%2C-3.82%20c%20-0.37%2C-1.57%20-0.64%2C-2.89%20-0.64%2C-4.5%20l%204.61%2C-6.26%202.55%2C-0.82%206.15%2C0.82%202.59%2C2.25%203.82%2C8.74%206.19%2C13.76%209.6%2C18.71%202.81%2C5.55%201.5%2C5.14%200.56%2C1.57%20h%200.97%20v%20-0.9%20l%200.79%2C-10.54%201.46%2C-12.94%201.42%2C-16.65%200.49%2C-4.69%202.32%2C-5.62%204.61%2C-3.04%203.6%2C1.72%202.96%2C4.24%20-0.41%2C2.74%20-1.76%2C11.44%20-3.45%2C17.92%20-2.25%2C12%20h%201.31%20l%201.5%2C-1.5%206.07%2C-8.06%2010.2%2C-12.75%204.5%2C-5.06%205.25%2C-5.59%203.37%2C-2.66%20h%206.37%20l%204.69%2C6.97%20-2.1%2C7.2%20-6.56%2C8.32%20-5.44%2C7.05%20-7.8%2C10.5%20-4.87%2C8.4%200.45%2C0.67%201.16%2C-0.11%2017.62%2C-3.75%209.52%2C-1.72%2011.36%2C-1.95%205.14%2C2.4%200.56%2C2.44%20-2.02%2C4.99%20-12.15%2C3%20-14.25%2C2.85%20-21.22%2C5.02%20-0.26%2C0.19%200.3%2C0.37%209.56%2C0.9%204.09%2C0.22%20h%2010.01%20l%2018.64%2C1.39%204.87%2C3.22%202.92%2C3.94%20-0.49%2C3%20-7.5%2C3.82%20-10.12%2C-2.4%20-23.62%2C-5.62%20-8.1%2C-2.02%20h%20-1.12%20v%200.67%20l%206.75%2C6.6%2012.37%2C11.17%2015.49%2C14.4%200.79%2C3.56%20-1.99%2C2.81%20-2.1%2C-0.3%20-13.61%2C-10.24%20-5.25%2C-4.61%20-11.89%2C-10.01%20h%20-0.79%20v%201.05%20l%202.74%2C4.01%2014.47%2C21.75%200.75%2C6.67%20-1.05%2C2.17%20-3.75%2C1.31%20-4.12%2C-0.75%20-8.47%2C-11.89%20-8.74%2C-13.39%20-7.05%2C-12%20-0.86%2C0.49%20-4.16%2C44.81%20-1.95%2C2.29%20-4.5%2C1.72%20-3.75%2C-2.85%20-1.99%2C-4.61%201.99%2C-9.11%202.4%2C-11.89%201.95%2C-9.45%201.76%2C-11.74%201.05%2C-3.9%20-0.07%2C-0.26%20-0.86%2C0.11%20-8.85%2C12.15%20-13.46%2C18.19%20-10.65%2C11.4%20-2.55%2C1.01%20-4.42%2C-2.29%200.41%2C-4.09%202.47%2C-3.64%2014.74%2C-18.75%208.89%2C-11.62%205.74%2C-6.71%20-0.04%2C-0.97%20h%20-0.34%20l%20-39.15%2C25.42%20-6.97%2C0.9%20-3%2C-2.81%200.37%2C-4.61%201.42%2C-1.5%2011.77%2C-8.1%20-0.04%2C0.04%20z'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\") center / contain no-repeat;",
      "}",
      "",
      "body[data-dsh-claude-style]:not([data-ds-dark-theme]) button[data-dsh-section=\"claude-style\"]::before {",
      "  background-color: #141413;",
      "}",
      "",
      "/* ---------- Claude Code layout: settings page ---------- */",
      "/* The skin's own page in the settings dialog. Its segmented controls reuse the",
      "   composer permission picker's classes (`.dsh-claude-segments` /",
      "   `.dsh-claude-segment`), so the two are literally one control rather than two",
      "   lookalikes; only the row shell and the switch are new here. */",
      "body[data-dsh-claude-style] .dsh-claude-settings {",
      "  display: flex;",
      "  flex-direction: column;",
      "  gap: 16px;",
      "  padding: 20px 24px;",
      "  max-width: 640px;",
      "  box-sizing: border-box;",
      "  font-family: var(--dsw-font-family);",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-settings-title {",
      "  font-size: 15px;",
      "  font-weight: 600;",
      "  color: var(--dsw-alias-label-primary);",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-settings-row {",
      "  display: flex;",
      "  align-items: center;",
      "  gap: 12px;",
      "  padding: 12px 14px;",
      "  border: 1px solid var(--dsw-alias-border-l1);",
      "  border-radius: 12px;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-settings-row-text {",
      "  flex: 1;",
      "  min-width: 0;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-settings-row-title {",
      "  font-size: 13px;",
      "  font-weight: 600;",
      "  line-height: 1.5;",
      "  color: var(--dsw-alias-label-primary);",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-settings-row-desc {",
      "  margin-top: 4px;",
      "  font-size: 12px;",
      "  line-height: 1.5;",
      "  color: var(--dsw-alias-label-tertiary);",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-settings-error {",
      "  font-size: 12px;",
      "  line-height: 1.5;",
      "  color: var(--dsw-alias-state-error-primary, #c0392b);",
      "}",
      "",
      "/* The switch borrows the segment track's palette and radius so a page of rows",
      "   reads as one control set rather than two. */",
      "body[data-dsh-claude-style] .dsh-claude-settings-switch {",
      "  flex: none;",
      "  appearance: none;",
      "  margin: 0;",
      "  border: 0;",
      "  cursor: pointer;",
      "  width: 36px;",
      "  height: 20px;",
      "  padding: 2px;",
      "  box-sizing: border-box;",
      "  border-radius: 10px;",
      "  background: var(--dsw-specific-selector);",
      "  transition: background-color .12s ease;",
      "}",
      "",
      "body[data-dsh-claude-style]:not([data-ds-dark-theme]) .dsh-claude-settings-switch {",
      "  background: #f6f6f4;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-settings-switch[data-on] {",
      "  background: var(--dsw-alias-brand-primary, #d97757);",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-settings-switch-knob {",
      "  display: block;",
      "  width: 16px;",
      "  height: 16px;",
      "  border-radius: 50%;",
      "  background: var(--dsw-alias-bg-overlay, #ffffff);",
      "  box-shadow: 0 1px 2px rgba(20, 20, 19, 0.18);",
      "  transition: transform .12s ease;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-settings-switch[data-on] .dsh-claude-settings-switch-knob {",
      "  transform: translateX(16px);",
      "}",
      "",
      "/* Custom username input: same row rhythm as the switch/segments, but wide",
      "   enough to read a name and narrow enough not to push the description. */",
      "body[data-dsh-claude-style] .dsh-claude-settings-input {",
      "  flex: none;",
      "  width: 180px;",
      "  max-width: 45%;",
      "  box-sizing: border-box;",
      "  border: 1px solid var(--dsw-alias-border-l1);",
      "  border-radius: 8px;",
      "  background: var(--dsw-alias-bg-layer-1);",
      "  color: var(--dsw-alias-label-primary);",
      "  padding: 6px 10px;",
      "  font: inherit;",
      "  font-size: 13px;",
      "  line-height: 18px;",
      "  outline: none;",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-settings-input:focus {",
      "  border-color: var(--dsw-alias-brand-primary, #d97757);",
      "}",
      "",
      "body[data-dsh-claude-style] .dsh-claude-settings-input::placeholder {",
      "  color: var(--dsw-alias-label-caption);",
      "}",
      "",
      "/* ============================================================================",
      "   主题翻转：瞬时抑制过渡 (Theme Flip: Transition Suppression)",
      "   ============================================================================ */",
      "/* While a theme flip is in flight, every skin surface must swap in ONE",
      "   recalc: the composer card/input/rail keep 0.12s border/box-shadow",
      "   transitions for hover/focus, and without this flag they trail the canvas",
      "   repaint by a visible beat (\"colours first, styles later\"). The flag is",
      "   mounted for the flip only (~0.3s), never during ordinary interaction.",
      "   This rule only out-specifies the lower-specificity transition rules",
      "   (html[flag] body[skin][flag] * is (0,3,2)); the higher ones (input scroll",
      "   (0,6,1), attachment rail (0,7,1)) are covered by the forced-flush cancel",
      "   sweep in src/overrides/theme-flip.js. */",
      "html[data-dsh-theme-transitioning] body[data-dsh-claude-style][data-dsh-theme-transitioning] * {",
      "  transition: none !important;",
      "}",
    ].join('\n')

    // ============================================================================
    // 模型厂商标识（由 src/assets/icons/lobe/*.svg 内联生成，勿手改） (Brand marks)
    // ============================================================================
    var LOBE_BRAND_SVGS = {
      "antgroup": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M15.984 1.383c-.259.593-.877.914-1.334 1.348-.702.669-.998 1.726-1.218 2.682 3.37.775 5.995 3.532 6.486 7.025.566 4.016-1.85 7.859-5.744 9.134-3.894 1.276-8.153-.38-10.126-3.935A8.339 8.339 0 016.457 6.833a18.703 18.703 0 01-.376-.802l-.174-.408a8.698 8.698 0 01-.618-1.987 7.523 7.523 0 01-.051-.37 3.717 3.717 0 01-.024-.34 2.506 2.506 0 01.132-.872 1.26 1.26 0 01.384-.594.842.842 0 011.165.11c.694.82.169 2.078.142 3.02.009.575.111 1.144.301 1.684l-.103.052a8.404 8.404 0 001.318-.79c.28-.243.45-.742.781-.864.33-.121.682.146.946.297.278.145.587.219.901.214l.462.007c.076.002.152.005.226.011.212.01.422.026.63.05l.196-1.08c.04-.216.082-.43.126-.645l.141-.641c.14-.7.42-1.367.823-1.96.305-.431.75-.746 1.262-.89.877-.217 1.24.629.937 1.348zm-2.244 5.44c-2.841.002-4.898 2.532-4.628 5.64.27 3.11 2.781 5.642 5.613 5.666 2.832.024 4.932-2.512 4.658-5.644-.273-3.133-2.802-5.666-5.643-5.663zm.357.57a4.707 4.707 0 013.304 1.445 5.703 5.703 0 011.643 3.49 4.841 4.841 0 01-1.141 3.705v.015a3.923 3.923 0 01-2.808 1.303 4.664 4.664 0 01-3.367-1.387 5.678 5.678 0 01-1.71-3.518 4.832 4.832 0 011.14-3.753 3.923 3.923 0 012.813-1.3h.126z\"></path></svg>",
      "anthropic": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z\"></path></svg>",
      "azure": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M18.397 15.296H7.4a.51.51 0 00-.347.882l7.066 6.595c.206.192.477.298.758.298h6.226l-2.706-7.775z\" fill-opacity=\".75\"></path><path d=\"M8.295.857c-.477 0-.9.304-1.053.756L.495 21.605a1.11 1.11 0 001.052 1.466h5.43c.477 0 .9-.304 1.053-.755l1.341-3.975-2.318-2.163a.51.51 0 01.347-.882h3L15.271.857H8.295z\" fill-opacity=\".5\"></path><path d=\"M17.193 1.613a1.11 1.11 0 00-1.052-.756h-7.81.035c.477 0 .9.304 1.052.756l6.748 19.992a1.11 1.11 0 01-1.052 1.466h-.12 7.895a1.11 1.11 0 001.052-1.466L17.193 1.613z\"></path></svg>",
      "baidu": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M8.859 11.735c1.017-1.71 4.059-3.083 6.202.286 1.579 2.284 4.284 4.397 4.284 4.397s2.027 1.601.73 4.684c-1.24 2.956-5.64 1.607-6.005 1.49l-.024-.009s-1.746-.568-3.776-.112c-2.026.458-3.773.286-3.773.286l-.045-.001c-.328-.01-2.38-.187-3.001-2.968-.675-3.028 2.365-4.687 2.592-4.968.226-.288 1.802-1.37 2.816-3.085zm.986 1.738v2.032h-1.64s-1.64.138-2.213 2.014c-.2 1.252.177 1.99.242 2.148.067.157.596 1.073 1.927 1.342h3.078v-7.514l-1.394-.022zm3.588 2.191l-1.44.024v3.956s.064.985 1.44 1.344h3.541v-5.3h-1.528v3.979h-1.46s-.466-.068-.553-.447v-3.556zM9.82 16.715v3.06H8.58s-.863-.045-1.126-1.049c-.136-.445.02-.959.088-1.16.063-.203.353-.671.951-.85H9.82zm9.525-9.036c2.086 0 2.646 2.06 2.646 2.742 0 .688.284 3.597-2.309 3.655-2.595.057-2.704-1.77-2.704-3.08 0-1.374.277-3.317 2.367-3.317zM4.24 6.08c1.523-.135 2.645 1.55 2.762 2.513.07.625.393 3.486-1.975 4-2.364.515-3.244-2.249-2.984-3.544 0 0 .28-2.797 2.197-2.969zm8.847-1.483c.14-1.31 1.69-3.316 2.931-3.028 1.236.285 2.367 1.944 2.137 3.37-.224 1.428-1.345 3.313-3.095 3.082-1.748-.226-2.143-1.823-1.973-3.424zM9.425 1c1.307 0 2.364 1.519 2.364 3.398 0 1.879-1.057 3.4-2.364 3.4s-2.367-1.521-2.367-3.4C7.058 2.518 8.118 1 9.425 1z\"></path></svg>",
      "baseten": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M2.316 4.8h14.682v4.8H7.31a.302.302 0 00-.308.3v4.2c0 .171.14.3.308.3h9.688v4.8h-4.686a.302.302 0 00-.308.3v4.2c0 .171.141.3.308.3h4.378a.297.297 0 00.308-.3v-4.5h4.694a.302.302 0 00.308-.3v-4.2c0-.171-.14-.3-.308-.3h-4.694V9.6h4.694A.302.302 0 0022 9.3V5.1c0-.171-.14-.3-.308-.3h-4.694V.3c0-.171-.14-.3-.308-.3H2.316A.31.31 0 002 .3v4.2c0 .171.14.3.316.3z\"></path></svg>",
      "bedrock": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M13.05 15.513h3.08c.214 0 .389.177.389.394v1.82a1.704 1.704 0 011.296 1.661c0 .943-.755 1.708-1.685 1.708-.931 0-1.686-.765-1.686-1.708 0-.807.554-1.484 1.297-1.662v-1.425h-2.69v4.663a.395.395 0 01-.188.338l-2.69 1.641a.385.385 0 01-.405-.002l-4.926-3.086a.395.395 0 01-.185-.336V16.3L2.196 14.87A.395.395 0 012 14.555L2 14.528V9.406c0-.14.073-.27.192-.34l2.465-1.462V4.448c0-.129.062-.249.165-.322l.021-.014L9.77 1.058a.385.385 0 01.407 0l2.69 1.675a.395.395 0 01.185.336V7.6h3.856V5.683a1.704 1.704 0 01-1.296-1.662c0-.943.755-1.708 1.685-1.708.931 0 1.685.765 1.685 1.708 0 .807-.553 1.484-1.296 1.662v2.311a.391.391 0 01-.389.394h-4.245v1.806h6.624a1.69 1.69 0 011.64-1.313c.93 0 1.685.764 1.685 1.707 0 .943-.754 1.708-1.685 1.708a1.69 1.69 0 01-1.64-1.314H13.05v1.937h4.953l.915 1.18a1.66 1.66 0 01.84-.227c.931 0 1.685.764 1.685 1.707 0 .943-.754 1.708-1.685 1.708-.93 0-1.685-.765-1.685-1.708 0-.346.102-.668.276-.937l-.724-.935H13.05v1.806zM9.973 1.856L7.93 3.122V6.09h-.778V3.604L5.435 4.669v2.945l2.11 1.36L9.712 7.61V5.334h.778V7.83c0 .136-.07.263-.184.335L7.963 9.638v2.081l1.422 1.009-.446.646-1.406-.998-1.53 1.005-.423-.66 1.605-1.055v-1.99L5.038 8.29l-2.26 1.34v1.676l1.972-1.189.398.677-2.37 1.429V14.3l2.166 1.258 2.27-1.368.397.677-2.176 1.311V19.3l1.876 1.175 2.365-1.426.398.678-2.017 1.216 1.918 1.201 2.298-1.403v-5.78l-4.758 2.893-.4-.675 5.158-3.136V3.289L9.972 1.856zM16.13 18.47a.913.913 0 00-.908.92c0 .507.406.918.908.918a.913.913 0 00.907-.919.913.913 0 00-.907-.92zm3.63-3.81a.913.913 0 00-.908.92c0 .508.406.92.907.92a.913.913 0 00.908-.92.913.913 0 00-.908-.92zm1.555-4.99a.913.913 0 00-.908.92c0 .507.407.918.908.918a.913.913 0 00.907-.919.913.913 0 00-.907-.92zM17.296 3.1a.913.913 0 00-.907.92c0 .508.406.92.907.92a.913.913 0 00.908-.92.913.913 0 00-.908-.92z\"></path></svg>",
      "bytedance": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M14.944 18.587l-1.704-.445V10.01l1.824-.462c1-.254 1.84-.461 1.88-.453.032 0 .056 2.235.056 4.972v4.973l-.176-.008c-.104 0-.952-.207-1.88-.446z\"></path><path d=\"M7 16.542c0-2.736.024-4.98.064-4.98.032-.008.872.2 1.88.454l1.816.461-.016 4.05-.024 4.049-1.632.422c-.896.23-1.736.445-1.856.469L7 21.523v-4.98z\"></path><path d=\"M19.24 12.477c0-9.03.008-9.515.144-9.475.072.024.784.207 1.576.406.792.207 1.576.405 1.744.445l.296.08-.016 8.56-.024 8.568-1.624.414c-.888.23-1.728.437-1.856.47l-.24.055v-9.523z\"></path><path d=\"M1 12.509c0-4.678.024-8.505.064-8.505.032 0 .872.207 1.872.454l1.824.461v7.582c0 4.16-.016 7.574-.032 7.574-.024 0-.872.215-1.88.47L1 21.013v-8.505z\"></path></svg>",
      "celestoai": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M11.77.194c.044-.259.416-.259.46 0l1.081 6.45a.989.989 0 001.55.641l5.325-3.795c.213-.153.477.11.324.324L16.715 9.14a.989.989 0 00.641 1.549l6.45 1.082c.259.043.259.415 0 .458l-6.45 1.082a.989.989 0 00-.641 1.55l3.795 5.325c.153.213-.11.477-.324.324l-5.326-3.795a.989.989 0 00-1.549.641l-1.082 6.45c-.043.259-.415.259-.458 0l-1.082-6.45a.989.989 0 00-1.55-.641L3.815 20.51c-.214.153-.477-.11-.324-.324l3.795-5.326a.989.989 0 00-.641-1.549L.194 12.23c-.259-.043-.259-.415 0-.458l6.45-1.082a.989.989 0 00.641-1.55L3.49 3.815c-.153-.214.11-.477.324-.324L9.14 7.285a.989.989 0 001.549-.641L11.77.194z\"></path></svg>",
      "cerebras": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path clip-rule=\"evenodd\" d=\"M14.121 2.701a9.299 9.299 0 000 18.598V22.7c-5.91 0-10.7-4.791-10.7-10.701S8.21 1.299 14.12 1.299V2.7zm4.752 3.677A7.353 7.353 0 109.42 17.643l-.901 1.074a8.754 8.754 0 01-1.08-12.334 8.755 8.755 0 0112.335-1.08l-.901 1.075zm-2.255.844a5.407 5.407 0 00-5.048 9.563l-.656 1.24a6.81 6.81 0 016.358-12.043l-.654 1.24zM14.12 8.539a3.46 3.46 0 100 6.922v1.402a4.863 4.863 0 010-9.726v1.402z\"></path><path d=\"M15.407 10.836a2.24 2.24 0 00-.51-.409 1.084 1.084 0 00-.544-.152c-.255 0-.483.047-.684.14a1.58 1.58 0 00-.84.912c-.074.203-.11.416-.11.631 0 .218.036.43.11.631a1.594 1.594 0 00.84.913c.2.093.43.14.684.14.216 0 .417-.046.602-.135.188-.09.35-.225.475-.392l.928 1.006c-.14.14-.3.261-.482.363a3.367 3.367 0 01-1.083.38c-.17.026-.317.04-.44.04a3.315 3.315 0 01-1.182-.21 2.825 2.825 0 01-.961-.597 2.816 2.816 0 01-.644-.929 2.987 2.987 0 01-.238-1.21c0-.444.08-.847.238-1.21.15-.35.368-.666.643-.929.278-.261.605-.464.962-.596a3.315 3.315 0 011.182-.21c.355 0 .712.068 1.072.204.361.138.685.36.944.649l-.962.97z\"></path></svg>",
      "cloudflare": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M16.493 17.4c.135-.52.08-.983-.161-1.338-.215-.328-.592-.519-1.05-.519l-8.663-.109a.148.148 0 01-.135-.082c-.027-.054-.027-.109-.027-.163.027-.082.108-.164.189-.164l8.744-.11c1.05-.054 2.153-.9 2.556-1.937l.511-1.31c.027-.055.027-.11.027-.164C17.92 8.91 15.66 7 12.942 7c-2.503 0-4.628 1.638-5.381 3.903a2.432 2.432 0 00-1.803-.491c-1.21.109-2.153 1.092-2.287 2.32-.027.328 0 .628.054.9C1.56 13.688 0 15.326 0 17.319c0 .19.027.355.027.545 0 .082.08.137.161.137h15.983c.08 0 .188-.055.215-.164l.107-.437\"></path><path d=\"M19.238 11.75h-.242c-.054 0-.108.054-.135.109l-.35 1.2c-.134.52-.08.983.162 1.338.215.328.592.518 1.05.518l1.855.11c.054 0 .108.027.135.082.027.054.027.109.027.163-.027.082-.108.164-.188.164l-1.91.11c-1.05.054-2.153.9-2.557 1.937l-.134.355c-.027.055.026.137.107.137h6.592c.081 0 .162-.055.162-.137.107-.41.188-.846.188-1.31-.027-2.62-2.153-4.777-4.762-4.777\"></path></svg>",
      "codex": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path clip-rule=\"evenodd\" d=\"M8.086.457a6.105 6.105 0 013.046-.415c1.333.153 2.521.72 3.564 1.7a.117.117 0 00.107.029c1.408-.346 2.762-.224 4.061.366l.063.03.154.076c1.357.703 2.33 1.77 2.918 3.198.278.679.418 1.388.421 2.126a5.655 5.655 0 01-.18 1.631.167.167 0 00.04.155 5.982 5.982 0 011.578 2.891c.385 1.901-.01 3.615-1.183 5.14l-.182.22a6.063 6.063 0 01-2.934 1.851.162.162 0 00-.108.102c-.255.736-.511 1.364-.987 1.992-1.199 1.582-2.962 2.462-4.948 2.451-1.583-.008-2.986-.587-4.21-1.736a.145.145 0 00-.14-.032c-.518.167-1.04.191-1.604.185a5.924 5.924 0 01-2.595-.622 6.058 6.058 0 01-2.146-1.781c-.203-.269-.404-.522-.551-.821a7.74 7.74 0 01-.495-1.283 6.11 6.11 0 01-.017-3.064.166.166 0 00.008-.074.115.115 0 00-.037-.064 5.958 5.958 0 01-1.38-2.202 5.196 5.196 0 01-.333-1.589 6.915 6.915 0 01.188-2.132c.45-1.484 1.309-2.648 2.577-3.493.282-.188.55-.334.802-.438.286-.12.573-.22.861-.304a.129.129 0 00.087-.087A6.016 6.016 0 015.635 2.31C6.315 1.464 7.132.846 8.086.457zm-.804 7.85a.848.848 0 00-1.473.842l1.694 2.965-1.688 2.848a.849.849 0 001.46.864l1.94-3.272a.849.849 0 00.007-.854l-1.94-3.393zm5.446 6.24a.849.849 0 000 1.695h4.848a.849.849 0 000-1.696h-4.848z\"></path></svg>",
      "cohere": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path clip-rule=\"evenodd\" d=\"M8.128 14.099c.592 0 1.77-.033 3.398-.703 1.897-.781 5.672-2.2 8.395-3.656 1.905-1.018 2.74-2.366 2.74-4.18A4.56 4.56 0 0018.1 1H7.549A6.55 6.55 0 001 7.55c0 3.617 2.745 6.549 7.128 6.549z\"></path><path clip-rule=\"evenodd\" d=\"M9.912 18.61a4.387 4.387 0 012.705-4.052l3.323-1.38c3.361-1.394 7.06 1.076 7.06 4.715a5.104 5.104 0 01-5.105 5.104l-3.597-.001a4.386 4.386 0 01-4.386-4.387z\"></path><path d=\"M4.776 14.962A3.775 3.775 0 001 18.738v.489a3.776 3.776 0 007.551 0v-.49a3.775 3.775 0 00-3.775-3.775z\"></path></svg>",
      "deepseek": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M23.748 4.482c-.254-.124-.364.113-.512.234-.051.039-.094.09-.137.136-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.156-.708-.311-.955-.65-.172-.241-.219-.51-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.093.172.187.129.323-.082.28-.18.552-.266.833-.055.179-.137.217-.329.14a5.526 5.526 0 01-1.736-1.18c-.857-.828-1.631-1.742-2.597-2.458a11.365 11.365 0 00-.689-.471c-.985-.957.13-1.743.388-1.836.27-.098.093-.432-.779-.428-.872.004-1.67.295-2.687.684a3.055 3.055 0 01-.465.137 9.597 9.597 0 00-2.883-.102c-1.885.21-3.39 1.102-4.497 2.623C.082 8.606-.231 10.684.152 12.85c.403 2.284 1.569 4.175 3.36 5.653 1.858 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.133-.284 4.994-1.86.47.234.962.327 1.78.397.63.059 1.236-.03 1.705-.128.735-.156.684-.837.419-.961-2.155-1.004-1.682-.595-2.113-.926 1.096-1.296 2.746-2.642 3.392-7.003.05-.347.007-.565 0-.845-.004-.17.035-.237.23-.256a4.173 4.173 0 001.545-.475c1.396-.763 1.96-2.015 2.093-3.517.02-.23-.004-.467-.247-.588zM11.581 18c-2.089-1.642-3.102-2.183-3.52-2.16-.392.024-.321.471-.235.763.09.288.207.486.371.739.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.167-1.361-.802-2.5-1.86-3.301-3.307-.774-1.393-1.224-2.887-1.298-4.482-.02-.386.093-.522.477-.592a4.696 4.696 0 011.529-.039c2.132.312 3.946 1.265 5.468 2.774.868.86 1.525 1.887 2.202 2.891.72 1.066 1.494 2.082 2.48 2.914.348.292.625.514.891.677-.802.09-2.14.11-3.054-.614zm1-6.44a.306.306 0 01.415-.287.302.302 0 01.2.288.306.306 0 01-.31.307.303.303 0 01-.304-.308zm3.11 1.596c-.2.081-.399.151-.59.16a1.245 1.245 0 01-.798-.254c-.274-.23-.47-.358-.552-.758a1.73 1.73 0 01.016-.588c.07-.327-.008-.537-.239-.727-.187-.156-.426-.199-.688-.199a.559.559 0 01-.254-.078c-.11-.054-.2-.19-.114-.358.028-.054.16-.186.192-.21.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.391.451.462.576.685.914.176.265.336.537.445.848.067.195-.019.354-.25.452z\"></path></svg>",
      "fireworks": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path clip-rule=\"evenodd\" d=\"M14.8 5l-2.801 6.795L9.195 5H7.397l3.072 7.428a1.64 1.64 0 003.038.002L16.598 5H14.8zm1.196 10.352l5.124-5.244-.699-1.669-5.596 5.739a1.664 1.664 0 00-.343 1.807 1.642 1.642 0 001.516 1.012L16 17l8-.02-.699-1.669-7.303.041h-.002zM2.88 10.104l.699-1.669 5.596 5.739c.468.479.603 1.189.343 1.807a1.643 1.643 0 01-1.516 1.012l-8-.018-.002.002.699-1.669 7.303.042-5.122-5.246z\"></path></svg>",
      "gemini": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z\"></path></svg>",
      "githubcopilot": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M19.245 5.364c1.322 1.36 1.877 3.216 2.11 5.817.622 0 1.2.135 1.592.654l.73.964c.21.278.323.61.323.955v2.62c0 .339-.173.669-.453.868C20.239 19.602 16.157 21.5 12 21.5c-4.6 0-9.205-2.583-11.547-4.258-.28-.2-.452-.53-.453-.868v-2.62c0-.345.113-.679.321-.956l.73-.963c.392-.517.974-.654 1.593-.654l.029-.297c.25-2.446.81-4.213 2.082-5.52 2.461-2.54 5.71-2.851 7.146-2.864h.198c1.436.013 4.685.323 7.146 2.864zm-7.244 4.328c-.284 0-.613.016-.962.05-.123.447-.305.85-.57 1.108-1.05 1.023-2.316 1.18-2.994 1.18-.638 0-1.306-.13-1.851-.464-.516.165-1.012.403-1.044.996a65.882 65.882 0 00-.063 2.884l-.002.48c-.002.563-.005 1.126-.013 1.69.002.326.204.63.51.765 2.482 1.102 4.83 1.657 6.99 1.657 2.156 0 4.504-.555 6.985-1.657a.854.854 0 00.51-.766c.03-1.682.006-3.372-.076-5.053-.031-.596-.528-.83-1.046-.996-.546.333-1.212.464-1.85.464-.677 0-1.942-.157-2.993-1.18-.266-.258-.447-.661-.57-1.108-.32-.032-.64-.049-.96-.05zm-2.525 4.013c.539 0 .976.426.976.95v1.753c0 .525-.437.95-.976.95a.964.964 0 01-.976-.95v-1.752c0-.525.437-.951.976-.951zm5 0c.539 0 .976.426.976.95v1.753c0 .525-.437.95-.976.95a.964.964 0 01-.976-.95v-1.752c0-.525.437-.951.976-.951zM7.635 5.087c-1.05.102-1.935.438-2.385.906-.975 1.037-.765 3.668-.21 4.224.405.394 1.17.657 1.995.657h.09c.649-.013 1.785-.176 2.73-1.11.435-.41.705-1.433.675-2.47-.03-.834-.27-1.52-.63-1.813-.39-.336-1.275-.482-2.265-.394zm6.465.394c-.36.292-.6.98-.63 1.813-.03 1.037.24 2.06.675 2.47.968.957 2.136 1.104 2.776 1.11h.044c.825 0 1.59-.263 1.995-.657.555-.556.765-3.187-.21-4.224-.45-.468-1.335-.804-2.385-.906-.99-.088-1.875.058-2.265.394zM12 7.615c-.24 0-.525.015-.84.044.03.16.045.336.06.526l-.001.159a2.94 2.94 0 01-.014.25c.225-.022.425-.027.612-.028h.366c.187 0 .387.006.612.028-.015-.146-.015-.277-.015-.409.015-.19.03-.365.06-.526a9.29 9.29 0 00-.84-.044z\"></path></svg>",
      "google": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M23 12.245c0-.905-.075-1.565-.236-2.25h-10.54v4.083h6.186c-.124 1.014-.797 2.542-2.294 3.569l-.021.136 3.332 2.53.23.022C21.779 18.417 23 15.593 23 12.245z\"></path><path d=\"M12.225 23c3.03 0 5.574-.978 7.433-2.665l-3.542-2.688c-.948.648-2.22 1.1-3.891 1.1a6.745 6.745 0 01-6.386-4.572l-.132.011-3.465 2.628-.045.124C4.043 20.531 7.835 23 12.225 23z\"></path><path d=\"M5.84 14.175A6.65 6.65 0 015.463 12c0-.758.138-1.491.361-2.175l-.006-.147-3.508-2.67-.115.054A10.831 10.831 0 001 12c0 1.772.436 3.447 1.197 4.938l3.642-2.763z\"></path><path d=\"M12.225 5.253c2.108 0 3.529.892 4.34 1.638l3.167-3.031C17.787 2.088 15.255 1 12.225 1 7.834 1 4.043 3.469 2.197 7.062l3.63 2.763a6.77 6.77 0 016.398-4.572z\"></path></svg>",
      "groq": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M12.036 2c-3.853-.035-7 3-7.036 6.781-.035 3.782 3.055 6.872 6.908 6.907h2.42v-2.566h-2.292c-2.407.028-4.38-1.866-4.408-4.23-.029-2.362 1.901-4.298 4.308-4.326h.1c2.407 0 4.358 1.915 4.365 4.278v6.305c0 2.342-1.944 4.25-4.323 4.279a4.375 4.375 0 01-3.033-1.252l-1.851 1.818A7 7 0 0012.029 22h.092c3.803-.056 6.858-3.083 6.879-6.816v-6.5C18.907 4.963 15.817 2 12.036 2z\"></path></svg>",
      "huggingface": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M16.781 3.277c2.997 1.704 4.844 4.851 4.844 8.258 0 .995-.155 1.955-.443 2.857a1.332 1.332 0 011.125.4 1.41 1.41 0 01.2 1.723c.204.165.352.385.428.632l.017.062c.06.222.12.69-.2 1.166.244.37.279.836.093 1.236-.255.57-.893 1.018-2.128 1.5l-.202.078-.131.048c-.478.173-.89.295-1.061.345l-.086.024c-.89.243-1.808.375-2.732.394-1.32 0-2.3-.36-2.923-1.067a9.852 9.852 0 01-3.18.018C9.778 21.647 8.802 22 7.494 22a11.249 11.249 0 01-2.541-.343l-.221-.06-.273-.08a16.574 16.574 0 01-1.175-.405c-1.237-.483-1.875-.93-2.13-1.501-.186-.4-.151-.867.093-1.236a1.42 1.42 0 01-.2-1.166c.069-.273.226-.516.447-.694a1.41 1.41 0 01.2-1.722c.233-.248.557-.391.917-.407l.078-.001a9.385 9.385 0 01-.44-2.85c0-3.407 1.847-6.554 4.844-8.258a9.822 9.822 0 019.687 0zM4.188 14.758c.125.687 2.357 2.35 2.14 2.707-.19.315-.796-.239-.948-.386l-.041-.04-.168-.147c-.561-.479-2.304-1.9-2.74-1.432-.43.46.119.859 1.055 1.42l.784.467.136.083c1.045.643 1.12.84.95 1.113-.188.295-3.07-2.1-3.34-1.083-.27 1.011 2.942 1.304 2.744 2.006-.2.7-2.265-1.324-2.685-.537-.425.79 2.913 1.718 2.94 1.725l.16.04.175.042c1.227.284 3.565.65 4.435-.604.673-.973.64-1.709-.248-2.61l-.057-.057c-.945-.928-1.495-2.288-1.495-2.288l-.017-.058-.025-.072c-.082-.22-.284-.639-.63-.584-.46.073-.798 1.21.12 1.933l.05.038c.977.721-.195 1.21-.573.534l-.058-.104-.143-.25c-.463-.799-1.282-2.111-1.739-2.397-.532-.332-.907-.148-.782.541zm14.842-.541c-.533.335-1.563 2.074-1.94 2.751a.613.613 0 01-.687.302.436.436 0 01-.176-.098.303.303 0 01-.049-.06l-.014-.028-.008-.02-.007-.019-.003-.013-.003-.017a.289.289 0 01-.004-.048c0-.12.071-.266.25-.427.026-.024.054-.047.084-.07l.047-.036c.022-.016.043-.032.063-.049.883-.71.573-1.81.131-1.917l-.031-.006-.056-.004a.368.368 0 00-.062.006l-.028.005-.042.014-.039.017-.028.015-.028.019-.036.027-.023.02c-.173.158-.273.428-.31.542l-.016.054s-.53 1.309-1.439 2.234l-.054.054c-.365.358-.596.69-.702 1.018-.143.437-.066.868.21 1.353.055.097.117.195.187.296.882 1.275 3.282.876 4.494.59l.286-.07.25-.074c.276-.084.736-.233 1.2-.42l.188-.077.065-.028.064-.028.124-.056.081-.038c.529-.252.964-.543.994-.827l.001-.036a.299.299 0 00-.037-.139c-.094-.176-.271-.212-.491-.168l-.045.01c-.044.01-.09.024-.136.04l-.097.035-.054.022c-.559.23-1.238.705-1.607.745h.006a.452.452 0 01-.05.003h-.024l-.024-.003-.023-.005c-.068-.016-.116-.06-.14-.142a.22.22 0 01-.005-.1c.062-.345.958-.595 1.713-.91l.066-.028c.528-.224.97-.483.985-.832v-.04a.47.47 0 00-.016-.098c-.048-.18-.175-.251-.36-.251-.785 0-2.55 1.36-2.92 1.36-.025 0-.048-.007-.058-.024a.6.6 0 01-.046-.088c-.1-.238.068-.462 1.06-1.066l.209-.126c.538-.32 1.01-.588 1.341-.831.29-.212.475-.406.503-.6l.003-.028c.008-.113-.038-.227-.147-.344a.266.266 0 00-.07-.054l-.034-.015-.013-.005a.403.403 0 00-.13-.02c-.162 0-.369.07-.595.18-.637.313-1.431.952-1.826 1.285l-.249.215-.033.033c-.08.078-.288.27-.493.386l-.071.037-.041.019a.535.535 0 01-.122.036h.005a.346.346 0 01-.031.003l.01-.001-.013.001c-.079.005-.145-.021-.19-.095a.113.113 0 01-.014-.065c.027-.465 2.034-1.991 2.152-2.642l.009-.048c.1-.65-.271-.817-.791-.493zM11.938 2.984c-4.798 0-8.688 3.829-8.688 8.55 0 .692.083 1.364.24 2.008l.008-.009c.252-.298.612-.46 1.017-.46.355.008.699.117.993.312.22.14.465.384.715.694.261-.372.69-.598 1.15-.605.852 0 1.367.728 1.562 1.383l.047.105.06.127c.192.396.595 1.139 1.143 1.68 1.06 1.04 1.324 2.115.8 3.266a8.865 8.865 0 002.024-.014c-.505-1.12-.26-2.17.74-3.186l.066-.066c.695-.684 1.157-1.69 1.252-1.912.195-.655.708-1.383 1.56-1.383.46.007.889.233 1.15.605.25-.31.495-.553.718-.694a1.87 1.87 0 01.99-.312c.357 0 .682.126.925.36.14-.61.215-1.245.215-1.898 0-4.722-3.89-8.55-8.687-8.55zm1.857 8.926l.439-.212c.553-.264.89-.383.89.152 0 1.093-.771 3.208-3.155 3.262h-.184c-2.325-.052-3.116-2.06-3.156-3.175l-.001-.087c0-1.107 1.452.586 3.25.586.716 0 1.379-.272 1.917-.526zm4.017-3.143c.45 0 .813.358.813.8 0 .441-.364.8-.813.8a.806.806 0 01-.812-.8c0-.442.364-.8.812-.8zm-11.624 0c.448 0 .812.358.812.8 0 .441-.364.8-.812.8a.806.806 0 01-.813-.8c0-.442.364-.8.813-.8zm7.79-.841c.32-.384.846-.54 1.33-.394.483.146.83.564.878 1.06.048.495-.212.97-.659 1.203-.322.168-.447-.477-.767-.585l.002-.003c-.287-.098-.772.362-.925.079a1.215 1.215 0 01.14-1.36zm-4.323 0c.322.384.377.92.14 1.36-.152.283-.64-.177-.925-.079l.003.003c-.108.036-.194.134-.273.24l-.118.165c-.11.15-.22.262-.377.18a1.226 1.226 0 01-.658-1.204c.048-.495.395-.913.878-1.059a1.262 1.262 0 011.33.394z\"></path></svg>",
      "inception": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M14.767 1H7.884L1 7.883v6.884h6.884V7.883h6.883V1zM9.234 23h6.882L23 16.116V9.233h-6.884v6.883H9.234V23z\"></path></svg>",
      "kimi": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M21.846 0a1.923 1.923 0 110 3.846H20.15a.226.226 0 01-.227-.226V1.923C19.923.861 20.784 0 21.846 0z\"></path><path d=\"M11.065 11.199l7.257-7.2c.137-.136.06-.41-.116-.41H14.3a.164.164 0 00-.117.051l-7.82 7.756c-.122.12-.302.013-.302-.179V3.82c0-.127-.083-.23-.185-.23H3.186c-.103 0-.186.103-.186.23V19.77c0 .128.083.23.186.23h2.69c.103 0 .186-.102.186-.23v-3.25c0-.069.025-.135.069-.178l2.424-2.406a.158.158 0 01.205-.023l6.484 4.772a7.677 7.677 0 003.453 1.283c.108.012.2-.095.2-.23v-3.06c0-.117-.07-.212-.164-.227a5.028 5.028 0 01-2.027-.807l-5.613-4.064c-.117-.078-.132-.279-.028-.381z\"></path></svg>",
      "meta": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M6.897 4c1.915 0 3.516.932 5.43 3.376l.282-.373c.19-.246.383-.484.58-.71l.313-.35C14.588 4.788 15.792 4 17.225 4c1.273 0 2.469.557 3.491 1.516l.218.213c1.73 1.765 2.917 4.71 3.053 8.026l.011.392.002.25c0 1.501-.28 2.759-.818 3.7l-.14.23-.108.153c-.301.42-.664.758-1.086 1.009l-.265.142-.087.04a3.493 3.493 0 01-.302.118 4.117 4.117 0 01-1.33.208c-.524 0-.996-.067-1.438-.215-.614-.204-1.163-.56-1.726-1.116l-.227-.235c-.753-.812-1.534-1.976-2.493-3.586l-1.43-2.41-.544-.895-1.766 3.13-.343.592C7.597 19.156 6.227 20 4.356 20c-1.21 0-2.205-.42-2.936-1.182l-.168-.184c-.484-.573-.837-1.311-1.043-2.189l-.067-.32a8.69 8.69 0 01-.136-1.288L0 14.468c.002-.745.06-1.49.174-2.23l.1-.573c.298-1.53.828-2.958 1.536-4.157l.209-.34c1.177-1.83 2.789-3.053 4.615-3.16L6.897 4zm-.033 2.615l-.201.01c-.83.083-1.606.673-2.252 1.577l-.138.199-.01.018c-.67 1.017-1.185 2.378-1.456 3.845l-.004.022a12.591 12.591 0 00-.207 2.254l.002.188c.004.18.017.36.04.54l.043.291c.092.503.257.908.486 1.208l.117.137c.303.323.698.492 1.17.492 1.1 0 1.796-.676 3.696-3.641l2.175-3.4.454-.701-.139-.198C9.11 7.3 8.084 6.616 6.864 6.616zm10.196-.552l-.176.007c-.635.048-1.223.359-1.82.933l-.196.198c-.439.462-.887 1.064-1.367 1.807l.266.398c.18.274.362.56.55.858l.293.475 1.396 2.335.695 1.114c.583.926 1.03 1.6 1.408 2.082l.213.262c.282.326.529.54.777.673l.102.05c.227.1.457.138.718.138.176.002.35-.023.518-.073.338-.104.61-.32.813-.637l.095-.163.077-.162c.194-.459.29-1.06.29-1.785l-.006-.449c-.08-2.871-.938-5.372-2.2-6.798l-.176-.189c-.67-.683-1.444-1.074-2.27-1.074z\"></path></svg>",
      "microsoft": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M11.49 2H2v9.492h9.492V2h-.002z\"></path><path d=\"M22 2h-9.492v9.492H22V2z\"></path><path d=\"M11.49 12.508H2V22h9.492v-9.492h-.002z\"></path><path d=\"M22 12.508h-9.492V22H22v-9.492z\"></path></svg>",
      "minimax": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M16.278 2c1.156 0 2.093.927 2.093 2.07v12.501a.74.74 0 00.744.709.74.74 0 00.743-.709V9.099a2.06 2.06 0 012.071-2.049A2.06 2.06 0 0124 9.1v6.561a.649.649 0 01-.652.645.649.649 0 01-.653-.645V9.1a.762.762 0 00-.766-.758.762.762 0 00-.766.758v7.472a2.037 2.037 0 01-2.048 2.026 2.037 2.037 0 01-2.048-2.026v-12.5a.785.785 0 00-.788-.753.785.785 0 00-.789.752l-.001 15.904A2.037 2.037 0 0113.441 22a2.037 2.037 0 01-2.048-2.026V18.04c0-.356.292-.645.652-.645.36 0 .652.289.652.645v1.934c0 .263.142.506.372.638.23.131.514.131.744 0a.734.734 0 00.372-.638V4.07c0-1.143.937-2.07 2.093-2.07zm-5.674 0c1.156 0 2.093.927 2.093 2.07v11.523a.648.648 0 01-.652.645.648.648 0 01-.652-.645V4.07a.785.785 0 00-.789-.78.785.785 0 00-.789.78v14.013a2.06 2.06 0 01-2.07 2.048 2.06 2.06 0 01-2.071-2.048V9.1a.762.762 0 00-.766-.758.762.762 0 00-.766.758v3.8a2.06 2.06 0 01-2.071 2.049A2.06 2.06 0 010 12.9v-1.378c0-.357.292-.646.652-.646.36 0 .653.29.653.646V12.9c0 .418.343.757.766.757s.766-.339.766-.757V9.099a2.06 2.06 0 012.07-2.048 2.06 2.06 0 012.071 2.048v8.984c0 .419.343.758.767.758.423 0 .766-.339.766-.758V4.07c0-1.143.937-2.07 2.093-2.07z\"></path></svg>",
      "mistral": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path clip-rule=\"evenodd\" d=\"M3.428 3.4h3.429v3.428h3.429v3.429h-.002 3.431V6.828h3.427V3.4h3.43v13.714H24v3.429H13.714v-3.428h-3.428v-3.429h-3.43v3.428h3.43v3.429H0v-3.429h3.428V3.4zm10.286 13.715h3.428v-3.429h-3.427v3.429z\"></path></svg>",
      "moonshot": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M1.052 16.916l9.539 2.552a21.007 21.007 0 00.06 2.033l5.956 1.593a11.997 11.997 0 01-5.586.865l-.18-.016-.044-.004-.084-.009-.094-.01a11.605 11.605 0 01-.157-.02l-.107-.014-.11-.016a11.962 11.962 0 01-.32-.051l-.042-.008-.075-.013-.107-.02-.07-.015-.093-.019-.075-.016-.095-.02-.097-.023-.094-.022-.068-.017-.088-.022-.09-.024-.095-.025-.082-.023-.109-.03-.062-.02-.084-.025-.093-.028-.105-.034-.058-.019-.08-.026-.09-.031-.066-.024a6.293 6.293 0 01-.044-.015l-.068-.025-.101-.037-.057-.022-.08-.03-.087-.035-.088-.035-.079-.032-.095-.04-.063-.028-.063-.027a5.655 5.655 0 01-.041-.018l-.066-.03-.103-.047-.052-.024-.096-.046-.062-.03-.084-.04-.086-.044-.093-.047-.052-.027-.103-.055-.057-.03-.058-.032a6.49 6.49 0 01-.046-.026l-.094-.053-.06-.034-.051-.03-.072-.041-.082-.05-.093-.056-.052-.032-.084-.053-.061-.039-.079-.05-.07-.047-.053-.035a7.785 7.785 0 01-.054-.036l-.044-.03-.044-.03a6.066 6.066 0 01-.04-.028l-.057-.04-.076-.054-.069-.05-.074-.054-.056-.042-.076-.057-.076-.059-.086-.067-.045-.035-.064-.052-.074-.06-.089-.073-.046-.039-.046-.039a7.516 7.516 0 01-.043-.037l-.045-.04-.061-.053-.07-.062-.068-.06-.062-.058-.067-.062-.053-.05-.088-.084a13.28 13.28 0 01-.099-.097l-.029-.028-.041-.042-.069-.07-.05-.051-.05-.053a6.457 6.457 0 01-.168-.179l-.08-.088-.062-.07-.071-.08-.042-.049-.053-.062-.058-.068-.046-.056a7.175 7.175 0 01-.027-.033l-.045-.055-.066-.082-.041-.052-.05-.064-.02-.025a11.99 11.99 0 01-1.44-2.402zm-1.02-5.794l11.353 3.037a20.468 20.468 0 00-.469 2.011l10.817 2.894a12.076 12.076 0 01-1.845 2.005L.657 15.923l-.016-.046-.035-.104a11.965 11.965 0 01-.05-.153l-.007-.023a11.896 11.896 0 01-.207-.741l-.03-.126-.018-.08-.021-.097-.018-.081-.018-.09-.017-.084-.018-.094c-.026-.141-.05-.283-.071-.426l-.017-.118-.011-.083-.013-.102a12.01 12.01 0 01-.019-.161l-.005-.047a12.12 12.12 0 01-.034-2.145zm1.593-5.15l11.948 3.196c-.368.605-.705 1.231-1.01 1.875l11.295 3.022c-.142.82-.368 1.612-.668 2.365l-11.55-3.09L.124 10.26l.015-.1.008-.049.01-.067.015-.087.018-.098c.026-.148.056-.295.088-.442l.028-.124.02-.085.024-.097c.022-.09.045-.18.07-.268l.028-.102.023-.083.03-.1.025-.082.03-.096.026-.082.031-.095a11.896 11.896 0 011.01-2.232zm4.442-4.4L17.352 4.59a20.77 20.77 0 00-1.688 1.721l7.823 2.093c.267.852.442 1.744.513 2.665L2.106 5.213l.045-.065.027-.04.04-.055.046-.065.055-.076.054-.072.064-.086.05-.065.057-.073.055-.07.06-.074.055-.069.065-.077.054-.066.066-.077.053-.06.072-.082.053-.06.067-.074.054-.058.073-.078.058-.06.063-.067.168-.17.1-.098.059-.056.076-.071a12.084 12.084 0 012.272-1.677zM12.017 0h.097l.082.001.069.001.054.002.068.002.046.001.076.003.047.002.06.003.054.002.087.005.105.007.144.011.088.007.044.004.077.008.082.008.047.005.102.012.05.006.108.014.081.01.042.006.065.01.207.032.07.012.065.011.14.026.092.018.11.022.046.01.075.016.041.01L14.7.3l.042.01.065.015.049.012.071.017.096.024.112.03.113.03.113.032.05.015.07.02.078.024.073.023.05.016.05.016.076.025.099.033.102.036.048.017.064.023.093.034.11.041.116.045.1.04.047.02.06.024.041.018.063.026.04.018.057.025.11.048.1.046.074.035.075.036.06.028.092.046.091.045.102.052.053.028.049.026.046.024.06.033.041.022.052.029.088.05.106.06.087.051.057.034.053.032.096.059.088.055.098.062.036.024.064.041.084.056.04.027.062.042.062.043.023.017c.054.037.108.075.161.114l.083.06.065.048.056.043.086.065.082.064.04.03.05.041.086.069.079.065.085.071c.712.6 1.353 1.283 1.909 2.031L7.222.994l.062-.027.065-.028.081-.034.086-.035c.113-.045.227-.09.341-.131l.096-.035.093-.033.084-.03.096-.031c.087-.03.176-.058.264-.085l.091-.027.086-.025.102-.03.085-.023.1-.026L9.04.37l.09-.023.091-.022.095-.022.09-.02.098-.021.091-.02.095-.018.092-.018.1-.018.091-.016.098-.017.092-.014.097-.015.092-.013.102-.013.091-.012.105-.012.09-.01.105-.01c.093-.01.186-.018.28-.024l.106-.008.09-.005.11-.006.093-.004.1-.004.097-.002.099-.002.197-.002z\"></path></svg>",
      "nova": "<svg fill=\"none\" viewBox=\"0 0 33 32\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"m17.865 23.28 1.533 1.543c.07.07.092.175.055.267l-2.398 6.118A1.24 1.24 0 0 1 15.9 32c-.51 0-.969-.315-1.155-.793l-3.451-8.804-5.582 5.617a.246.246 0 0 1-.35 0l-1.407-1.415a.25.25 0 0 1 0-.352l6.89-6.932a1.3 1.3 0 0 1 .834-.398 1.25 1.25 0 0 1 1.232.79l2.992 7.63 1.557-3.977a.248.248 0 0 1 .408-.085zm8.224-19.3-5.583 5.617-3.45-8.805a1.24 1.24 0 0 0-1.43-.762c-.414.092-.744.407-.899.805l-2.38 6.072a.25.25 0 0 0 .055.267l1.533 1.543c.127.127.34.082.407-.085L15.9 4.655l2.991 7.629a1.24 1.24 0 0 0 2.035.425l6.922-6.965a.25.25 0 0 0 0-.352L26.44 3.977a.246.246 0 0 0-.35 0zM8.578 17.566l-3.953-1.567 7.582-3.01c.49-.195.815-.685.785-1.24a1.3 1.3 0 0 0-.395-.84l-6.886-6.93a.246.246 0 0 0-.35 0L3.954 5.395a.25.25 0 0 0 0 .353l5.583 5.617-8.75 3.472a1.25 1.25 0 0 0 0 2.325l6.079 2.412a.24.24 0 0 0 .266-.055l1.533-1.542a.25.25 0 0 0-.085-.41zm22.434-2.73-6.08-2.412a.24.24 0 0 0-.265.055l-1.533 1.542a.25.25 0 0 0 .084.41L27.172 16l-7.583 3.01a1.255 1.255 0 0 0-.785 1.24c.018.317.172.614.395.84l6.89 6.931a.246.246 0 0 0 .35 0l1.406-1.415a.25.25 0 0 0 0-.352l-5.582-5.617 8.75-3.472a1.25 1.25 0 0 0 0-2.325z\" fill=\"currentColor\"></path></svg>",
      "nvidia": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M10.212 8.976V7.62c.127-.01.256-.017.388-.021 3.596-.117 5.957 3.184 5.957 3.184s-2.548 3.647-5.282 3.647a3.227 3.227 0 01-1.063-.175v-4.109c1.4.174 1.681.812 2.523 2.258l1.873-1.627a4.905 4.905 0 00-3.67-1.846 6.594 6.594 0 00-.729.044m0-4.476v2.025c.13-.01.259-.019.388-.024 5.002-.174 8.261 4.226 8.261 4.226s-3.743 4.69-7.643 4.69c-.338 0-.675-.031-1.007-.092v1.25c.278.038.558.057.838.057 3.629 0 6.253-1.91 8.794-4.169.421.347 2.146 1.193 2.501 1.564-2.416 2.083-8.048 3.763-11.24 3.763-.308 0-.603-.02-.894-.048V19.5H24v-15H10.21zm0 9.756v1.068c-3.356-.616-4.287-4.21-4.287-4.21a7.173 7.173 0 014.287-2.138v1.172h-.005a3.182 3.182 0 00-2.502 1.178s.615 2.276 2.507 2.931m-5.961-3.3c1.436-1.935 3.604-3.148 5.961-3.336V6.523C5.81 6.887 2 10.723 2 10.723s2.158 6.427 8.21 7.015v-1.166C5.77 16 4.25 10.958 4.25 10.958h-.002z\"></path></svg>",
      "openai": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z\"></path></svg>",
      "opencode": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M16 6H8v12h8V6zm4 16H4V2h16v20z\"></path></svg>",
      "openrouter": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M18.654 3.87a5.087 5.087 0 110 10.174L23.7 19.09c.64.641.187 1.737-.72 1.737H8.48a8.479 8.479 0 010-16.958h10.175zM8.479 7.26a5.087 5.087 0 100 10.176 5.087 5.087 0 000-10.175z\"></path></svg>",
      "perplexity": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M19.785 0v7.272H22.5V17.62h-2.935V24l-7.037-6.194v6.145h-1.091v-6.152L4.392 24v-6.465H1.5V7.188h2.884V0l7.053 6.494V.19h1.09v6.49L19.786 0zm-7.257 9.044v7.319l5.946 5.234V14.44l-5.946-5.397zm-1.099-.08l-5.946 5.398v7.235l5.946-5.234V8.965zm8.136 7.58h1.844V8.349H13.46l6.105 5.54v2.655zm-8.982-8.28H2.59v8.195h1.8v-2.576l6.192-5.62zM5.475 2.476v4.71h5.115l-5.115-4.71zm13.219 0l-5.115 4.71h5.115v-4.71z\"></path></svg>",
      "qwen": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M12.604 1.34c.393.69.784 1.382 1.174 2.075a.18.18 0 00.157.091h5.552c.174 0 .322.11.446.327l1.454 2.57c.19.337.24.478.024.837-.26.43-.513.864-.76 1.3l-.367.658c-.106.196-.223.28-.04.512l2.652 4.637c.172.301.111.494-.043.77-.437.785-.882 1.564-1.335 2.34-.159.272-.352.375-.68.37-.777-.016-1.552-.01-2.327.016a.099.099 0 00-.081.05 575.097 575.097 0 01-2.705 4.74c-.169.293-.38.363-.725.364-.997.003-2.002.004-3.017.002a.537.537 0 01-.465-.271l-1.335-2.323a.09.09 0 00-.083-.049H4.982c-.285.03-.553-.001-.805-.092l-1.603-2.77a.543.543 0 01-.002-.54l1.207-2.12a.198.198 0 000-.197 550.951 550.951 0 01-1.875-3.272l-.79-1.395c-.16-.31-.173-.496.095-.965.465-.813.927-1.625 1.387-2.436.132-.234.304-.334.584-.335a338.3 338.3 0 012.589-.001.124.124 0 00.107-.063l2.806-4.895a.488.488 0 01.422-.246c.524-.001 1.053 0 1.583-.006L11.704 1c.341-.003.724.032.9.34zm-3.432.403a.06.06 0 00-.052.03L6.254 6.788a.157.157 0 01-.135.078H3.253c-.056 0-.07.025-.041.074l5.81 10.156c.025.042.013.062-.034.063l-2.795.015a.218.218 0 00-.2.116l-1.32 2.31c-.044.078-.021.118.068.118l5.716.008c.046 0 .08.02.104.061l1.403 2.454c.046.081.092.082.139 0l5.006-8.76.783-1.382a.055.055 0 01.096 0l1.424 2.53a.122.122 0 00.107.062l2.763-.02a.04.04 0 00.035-.02.041.041 0 000-.04l-2.9-5.086a.108.108 0 010-.113l.293-.507 1.12-1.977c.024-.041.012-.062-.035-.062H9.2c-.059 0-.073-.026-.043-.077l1.434-2.505a.107.107 0 000-.114L9.225 1.774a.06.06 0 00-.053-.031zm6.29 8.02c.046 0 .058.02.034.06l-.832 1.465-2.613 4.585a.056.056 0 01-.05.029.058.058 0 01-.05-.029L8.498 9.841c-.02-.034-.01-.052.028-.054l.216-.012 6.722-.012z\"></path></svg>",
      "stepfun": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM8.762 19.614H4.376v-4.386h4.386v4.386zm5.423 0H9.798v-4.386h4.387v4.386zm0-5.42H9.798V9.81h4.387v4.386zm0-5.418H9.798V4.39h4.387v4.386zm5.422-.004h-4.386V4.386h4.386v4.386z\"></path></svg>",
      "tencent": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M9.976 1L24 9.8l-10.587.015L10.723 23H5.489L8.18 9.8H3.244L1 5.4h8.077L9.976 1z\"></path></svg>",
      "together": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M23.197 4.503A6 6 0 0015 2.307a5.973 5.973 0 00-2.995 4.933l5.996.008v.515h-5.996c.039.937.298 1.87.8 2.74a6 6 0 1010.39-6z\"></path><path d=\"M.805 4.5A6 6 0 003 12.697a5.972 5.972 0 005.77.127L5.779 7.627l.446-.257 2.997 5.192A6 6 0 10.804 4.5z\"></path><path d=\"M12 23.894a6 6 0 005.999-6c0-2.13-1.1-3.996-2.775-5.06l-3.005 5.189-.444-.258 2.997-5.192A6 6 0 1012 23.894z\"></path></svg>",
      "vercel": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M12 0l12 20.785H0L12 0z\"></path></svg>",
      "vertexai": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M11.995 20.216a1.892 1.892 0 100 3.785 1.892 1.892 0 000-3.785zm0 2.806a.927.927 0 11.927-.914.914.914 0 01-.927.914z\"></path><path clip-rule=\"evenodd\" d=\"M21.687 14.144c.237.038.452.16.605.344a.978.978 0 01-.18 1.3l-8.24 6.082a1.892 1.892 0 00-1.147-1.508l8.28-6.08a.991.991 0 01.682-.138z\"></path><path clip-rule=\"evenodd\" d=\"M10.122 21.842l-8.217-6.066a.952.952 0 01-.206-1.287.978.978 0 011.287-.206l8.28 6.08a1.893 1.893 0 00-1.144 1.479z\"></path><path d=\"M4.273 4.475a.978.978 0 01-.965-.965V1.09a.978.978 0 111.943 0v2.42a.978.978 0 01-.978.965zM4.247 13.034a.978.978 0 100-1.956.978.978 0 000 1.956zM4.247 10.19a.978.978 0 100-1.956.978.978 0 000 1.956zM4.247 7.332a.978.978 0 100-1.956.978.978 0 000 1.956z\"></path><path d=\"M19.718 7.307a.978.978 0 01-.965-.979v-2.42a.965.965 0 011.93 0v2.42a.964.964 0 01-.965.979zM19.743 13.047a.978.978 0 100-1.956.978.978 0 000 1.956zM19.743 10.151a.978.978 0 100-1.956.978.978 0 000 1.956zM19.743 2.068a.978.978 0 100-1.956.978.978 0 000 1.956z\"></path><path d=\"M11.995 15.917a.978.978 0 01-.965-.965v-2.459a.978.978 0 011.943 0v2.433a.976.976 0 01-.978.991zM11.995 18.762a.978.978 0 100-1.956.978.978 0 000 1.956zM11.995 10.64a.978.978 0 100-1.956.978.978 0 000 1.956zM11.995 7.783a.978.978 0 100-1.956.978.978 0 000 1.956z\"></path><path d=\"M15.856 10.177a.978.978 0 01-.965-.965v-2.42a.977.977 0 011.702-.763.979.979 0 01.241.763v2.42a.978.978 0 01-.978.965zM15.869 4.913a.978.978 0 100-1.956.978.978 0 000 1.956zM15.869 15.853a.978.978 0 100-1.956.978.978 0 000 1.956zM15.869 12.996a.978.978 0 100-1.956.978.978 0 000 1.956z\"></path><path d=\"M8.121 15.853a.978.978 0 100-1.956.978.978 0 000 1.956zM8.121 7.783a.978.978 0 100-1.956.978.978 0 000 1.956zM8.121 4.913a.978.978 0 100-1.957.978.978 0 000 1.957zM8.134 12.996a.978.978 0 01-.978-.94V9.611a.965.965 0 011.93 0v2.445a.966.966 0 01-.952.94z\"></path></svg>",
      "xai": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M6.469 8.776L16.512 23h-4.464L2.005 8.776H6.47zm-.004 7.9l2.233 3.164L6.467 23H2l4.465-6.324zM22 2.582V23h-3.659V7.764L22 2.582zM22 1l-9.952 14.095-2.233-3.163L17.533 1H22z\"></path></svg>",
      "xiaomimimo": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M.958 15.936a.459.459 0 01.459.44v2.729a.46.46 0 01-.918 0v-2.729a.459.459 0 01.459-.44zm4.814-2.035a.46.46 0 01.553.45v4.754a.458.458 0 11-.918 0V15.48L3.74 17.202a.462.462 0 01-.655.016.462.462 0 01-.065-.082L.628 14.67a.459.459 0 01.658-.637l2.124 2.187 2.127-2.188a.46.46 0 01.235-.13zm2.068.004a.46.46 0 01.458.445v4.755a.46.46 0 01-.458.458.459.459 0 01-.458-.458V14.35a.459.459 0 01.458-.445zm1.973 2.014a.46.46 0 01.46.457v2.729a.46.46 0 01-.784.324.46.46 0 01-.134-.324v-2.729a.46.46 0 01.458-.458zm.002-2.045a.458.458 0 01.328.157l2.127 2.19 2.125-2.19a.459.459 0 01.784.318v4.756a.46.46 0 01-.455.458.46.46 0 01-.458-.458V15.48l-1.667 1.723a.46.46 0 01-.65.008l-.005-.005c0-.002-.002-.002-.004-.003l-2.455-2.534a.46.46 0 01-.008-.667.461.461 0 01.338-.128zm6.797 1.206a.46.46 0 01.53.651A1.966 1.966 0 0019.81 18.4a.462.462 0 01.623.18.46.46 0 01-.181.624 2.863 2.863 0 01-1.38.353l-.142-.004a2.88 2.88 0 01-2.393-4.263.461.461 0 01.274-.21zm.864-.931a2.884 2.884 0 013.915 3.914.46.46 0 01-.402.24l-.057-.004a.458.458 0 01-.164-.055.46.46 0 01-.182-.622 1.967 1.967 0 00-2.669-2.67.459.459 0 11-.441-.803zM9.59 6.368c1.481 0 1.696 1.202 1.696 1.654v2.648h-.917v-.432c-.26.346-.792.535-1.36.535-.133 0-1.289-.03-1.384-1.136-.082-.932.675-1.61 2.053-1.61h.691c0-.563-.367-.886-.983-.886-.44.013-.864.174-1.2.458l-.36-.664c.484-.379 1.012-.567 1.764-.567zm4.427.1c1.263 0 2.082.97 2.083 2.15 0 1.181-.824 2.154-2.083 2.154-1.26 0-2.084-.972-2.084-2.152 0-1.18.82-2.153 2.084-2.153zm6.801.015c.68 0 1.202.465 1.197 1.548v2.642H21.1V8.29c0-.312-.002-.98-.63-.98s-.628.667-.628.838v2.524h-.89V8.148c0-.17-.001-.838-.63-.838-.628 0-.628.668-.628.98v2.383h-.917v-4.03h.917V7a1.22 1.22 0 01.947-.516c.398 0 .76.193.982.686a1.321 1.321 0 011.195-.686zm-18.093.872l1.457-1.772H5.32L3.311 8.07l2.14 2.602H4.24L2.725 8.796 1.21 10.672H0L2.138 8.07.13 5.583h1.138l1.458 1.772zm4.149 3.317h-.916V6.644h.916v4.028zm16.99 0h-.916V6.644h.916v4.028zM9.925 8.71c-1.055 0-1.359.412-1.326.742.032.329.324.537.757.537a1.013 1.013 0 001.014-.968l.002-.31h-.447zM14.018 7.3c-.663 0-1.184.487-1.184 1.32 0 .832.52 1.32 1.184 1.32.662 0 1.182-.49 1.182-1.32 0-.832-.52-1.32-1.182-1.32zM6.417 5.001a.568.568 0 01.587.582.588.588 0 01-1.175 0A.57.57 0 016.417 5zm16.991 0a.57.57 0 01.592.582.588.588 0 01-1.174 0 .57.57 0 01.357-.542.572.572 0 01.225-.04z\"></path></svg>",
      "zai": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M12.105 2L9.927 4.953H.653L2.83 2h9.276zM23.254 19.048L21.078 22h-9.242l2.174-2.952h9.244zM24 2L9.264 22H0L14.736 2H24z\"></path></svg>",
    }

    // ============================================================================
    // 厂商字标（由 src/assets/icons/wordmarks/*.svg 内联生成，勿手改） (Vendor wordmarks)
    // ============================================================================
    var WORDMARK_SVGS = {
      "kimi": "<svg fill=\"currentColor\" viewBox=\"0 0 96 32\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M35.768 31.329c0 .37.3.671.67.671h4.305c.371 0 .672-.3.672-.671V.67c0-.37-.3-.671-.672-.671H36.44c-.37 0-.671.3-.671.671zm54.584 0c0 .37.3.671.67.671h4.305c.371 0 .672-.3.672-.671V.67c0-.37-.3-.671-.672-.671h-4.304c-.37 0-.671.3-.671.671zM73.256 0a.67.67 0 0 0-.652.512l-6.366 26.1c-.106.428-.607.428-.71 0L59.159.512A.67.67 0 0 0 58.511 0H47.725c-.37 0-.668.3-.668.671V31.33c0 .37.3.671.67.671h4.781c.37 0 .671-.292.671-.662V5.554c0-.515.604-.622.726-.127l6.358 26.06a.67.67 0 0 0 .653.513h9.931c.31 0 .58-.212.653-.512L77.855 5.43c.122-.495.726-.388.726.127v25.772c0 .37.3.671.671.671h4.78c.371 0 .672-.3.672-.671V.67c0-.37-.3-.671-.671-.671zM15.279 14.837 28.264 1.133A.671.671 0 0 0 27.777 0h-6.043a.67.67 0 0 0-.477.199L6.374 15.223c-.231.234-.573.025-.573-.35V.672c0-.37-.3-.671-.671-.671H.67a.67.67 0 0 0-.67.67V31.33c0 .37.3.671.671.671H5.13c.37 0 .671-.3.671-.671v-6.114a.5.5 0 0 1 .13-.35l4.594-4.69a.293.293 0 0 1 .386-.045l12.286 9.305c1.796 1.245 4.083 2.06 6.178 2.401a.645.645 0 0 0 .743-.648v-5.537a.7.7 0 0 0-.562-.677c-1.215-.262-2.565-.758-3.59-1.468L15.332 15.58c-.22-.152-.248-.544-.052-.744\"/></svg>",
    }

    // ============================================================================
    // 供应商/厂商图标（来自 cc-switch src/icons/extracted，勿手改） (Provider icons)
    // ============================================================================
    var PROVIDER_ICONS =     {
      "9527code": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 883 686\"><title>9527 CODE</title><path fill=\"currentColor\" opacity=\"0.82\" d=\"M282 0 499 0 622 235 622 238 381 238 336 328 670 328 807 593 883 584 856 686 622 686 502 454 220 561 0 561Z\"/><path fill=\"currentColor\" d=\"M282 1 498 3 220 559 1 560Z M693 380 697 381 854 685 622 685 614 671 502 453Z\"/></svg>",
      "aicodemirror": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 1017.97 1056.47\"><title>AICodeMirror</title><path fill=\"#E4906E\" fill-rule=\"nonzero\" d=\"M944.92 1014.53c-17.29,-9.23 -33.98,-19.28 -50.08,-30.16 -5.39,-3.65 -14.99,-11.7 -28.81,-24.16 -6.06,-5.47 -14.07,-13.51 -24.03,-24.13 -15.15,-16.17 -29.61,-29.9 -41.69,-40.4 -3.98,-3.46 -14.2,-11.02 -30.68,-22.69 -6.24,-4.42 -12.88,-12.15 -18.63,-19.09 -23.98,-29.04 -49.53,-58.44 -76.66,-88.19 -11.93,-13.1 -25.64,-26.11 -35.61,-36.5 -28.72,-29.92 -51.92,-51.96 -78.23,-79.66 -11.24,-11.83 -20.52,-21.3 -27.85,-28.41 -0.56,-0.53 -1.3,-0.84 -2.08,-0.84 -0.51,0 -1.02,0.14 -1.47,0.39 -9.76,5.54 -17.53,14.33 -24.91,23.31 -10.71,13.01 -21.86,26.65 -33.44,40.91 -4.37,5.38 -7.9,9.46 -10.56,12.24 -5.43,5.67 -9.83,10.88 -15.08,15.39 -9.57,8.23 -19.57,16.01 -29.98,23.31 -14.73,10.32 -29.07,20.29 -43.04,29.9 -5.22,3.61 -13.68,9.81 -20.14,15.41 -25.71,22.32 -53.59,46.12 -83.65,71.41 -9.46,7.95 -19.65,16.88 -34.02,29.22 -25.66,22.03 -52.94,40.06 -81.67,55.65 -7.71,4.19 -14.15,8.2 -19.32,12.01 -19.3,14.23 -33.84,25.65 -43.62,34.28 -25.99,22.91 -43.04,37.82 -51.16,44.73 -9.19,7.8 -18.6,17.05 -28.42,25.54 -2.71,2.35 -5.7,3.03 -8.96,2.01 -0.78,-0.24 -1.25,-1.02 -1.1,-1.82 0.36,-2 1.19,-4.1 2.47,-6.32 6.86,-11.81 14.46,-23.09 19.95,-36.03 3.48,-8.23 7.87,-16.52 13.18,-24.89 2.03,-3.19 4.73,-8.77 8.11,-16.74 2.98,-7.02 7.34,-15.05 13.07,-24.12 5.79,-9.14 16,-23.36 30.63,-42.67 7.66,-10.11 19.49,-23.6 35.49,-40.47 4.9,-5.16 12.21,-11.87 21.92,-20.14 12.12,-10.31 23.53,-21.19 34.23,-32.65 11.73,-12.54 16.99,-22.33 27.39,-40.8 2.37,-4.19 6.49,-9.43 12.37,-15.71 8.27,-8.82 17,-17.23 26.21,-25.23 30.11,-26.18 55.17,-47.43 75.17,-63.76 8.66,-7.08 26.42,-21.39 39.65,-30.77 17.11,-12.13 28.62,-20.44 34.53,-24.91 4.5,-3.4 8.93,-6.6 13.3,-10.56 26.03,-23.54 51.66,-45.71 77.28,-70.7 0.42,-0.41 0.51,-1.06 0.21,-1.58 -6.8,-11.78 -12.84,-21.8 -18.11,-30.06 -10.22,-15.99 -22.07,-29.65 -35.57,-40.99 -7.56,-6.36 -18.41,-13.85 -28.65,-20.43 -15.08,-9.66 -30.62,-21.97 -46.63,-36.9 -35.08,-32.73 -67.65,-71.22 -85.32,-115.42 -5.53,-13.85 -10.8,-29.31 -15.8,-46.37 -5.89,-20.13 -12.37,-35.63 -23.22,-51.27 -8.93,-12.9 -15.77,-21.94 -19.58,-35.93 -1.27,-4.67 -2.93,-12.75 -4.99,-24.23 -2.07,-11.54 -6.54,-22.62 -13.41,-33.25 -7.54,-11.68 -13.66,-21.04 -18.33,-28.08 -3.68,-5.53 -7.02,-12.39 -9.63,-18.53 -3.9,-9.18 -8.14,-15.7 -13.6,-23.37 -3.94,-5.53 -5.07,-12.75 0,-18.32 4.14,-4.57 17.49,-3.02 21.56,-1.13 3.86,1.81 8.1,5.13 12.71,9.94 16.16,16.88 26.41,27.77 30.74,32.66 4.69,5.31 11.21,13.79 16.69,19.94 20.19,22.63 36.17,39.74 47.36,59.71 10.46,18.66 16.41,30.42 29.84,44.67 9.32,9.92 17.94,19.33 25.85,28.23 9.01,10.15 19.25,22.95 30.72,38.39 7.54,10.17 13.89,20.11 19.05,29.84 6.39,12.05 10.8,30.19 15.13,41.41 4.88,12.67 12.52,23.25 22.92,31.75 0.58,0.47 6.79,5.44 18.62,14.89 13.54,10.82 23.74,23.47 30.61,37.96 4.55,9.58 7.82,16.16 9.8,19.74 6.62,11.85 14.64,22.05 24.07,30.59 8.99,8.14 17.47,13.2 31.06,22.64 4.28,2.96 6.68,5.98 10.65,2.54 7.08,-6.11 13.73,-10.71 17.96,-14.53 6.12,-5.54 11.71,-11.84 16.79,-18.92 3.5,-4.88 8.77,-10.16 15.19,-14.42 22.77,-15.02 38.17,-31.11 63.32,-55.15 22.13,-21.17 46.22,-47.56 69.25,-66.8 32.17,-26.89 54.99,-45.9 68.46,-57.01 17.15,-14.15 35.82,-30.97 56.02,-50.46 16.06,-15.5 29.25,-27.72 39.57,-36.66 9.78,-8.47 17.55,-14.8 23.31,-18.98 8.52,-6.2 18.55,-10.61 30.56,-15.03 12.34,-4.55 23.44,-11.06 35.67,-17.61 9.07,-4.85 19.76,-9.89 30.05,-8.84 0.5,0.06 0.97,0.32 1.3,0.72 0.85,1.07 1.01,2.48 0.48,4.23 -2.1,6.99 -5.15,13.55 -9.66,20.87 -6.42,10.42 -11.51,19.46 -15.29,27.11 -6.09,12.35 -9.66,19.49 -10.69,21.43 -7.78,14.65 -17.56,27.97 -29.34,39.97 -4.8,4.89 -12.93,12.92 -24.37,24.07 -14.23,13.87 -25.02,30.77 -37.12,50.78 -15.21,25.13 -29.56,48.47 -43.06,70.01 -5.21,8.29 -13.68,15.13 -21.58,21.47 -25.71,20.7 -46.75,41.48 -70.98,64.67 -1.97,1.88 -4.98,4.47 -9.03,7.76 -22.62,18.36 -45.88,35.93 -69.78,52.74 -5.96,4.2 -13.77,11.24 -23.42,21.11 -17.12,17.5 -25.93,26.56 -26.42,27.19 -1.22,1.54 -1.08,3.09 0.41,4.67 14.11,14.81 34.25,37.65 60.42,68.51 11.89,14.01 24.87,27.08 36.03,39.46 8.75,9.7 16.81,22.11 31.82,42.59 2.69,3.68 13.53,16.07 32.5,37.17 5.17,5.76 11.64,14.47 19.4,26.12 16.37,24.6 36.28,56.2 59.73,94.79 4.2,6.92 7.74,12.33 10.62,16.21 5.41,7.29 10.37,13.74 14.92,20.97 6.26,9.94 11.3,19.92 15.11,29.92 4.29,11.27 7.73,19.49 10.32,24.69 7.21,14.5 14.81,28.41 22.8,41.73 3.44,5.75 6.78,13.03 6.11,20.05 -0.07,0.76 -0.71,1.34 -1.48,1.34 -0.25,0 -0.49,-0.06 -0.71,-0.18l0 0.01z\"/></svg>",
      "aicodewith": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 512 512\"><title>AICodeWith</title><path fill=\"currentColor\" d=\"M98 62 97 63 82 63 82 64 74 65 72 67 69 67 69 68 61 71 56 76 54 76 43 87 43 89 40 91 39 95 37 96 37 98 36 98 36 100 35 100 35 102 33 104 31 114 30 114 30 120 29 120 29 345 30 345 32 358 33 358 33 360 35 362 36 367 38 368 41 375 45 378 45 380 52 387 54 387 56 390 58 390 59 392 61 392 62 394 66 395 68 397 71 397 71 398 74 398 74 399 77 399 77 400 81 400 81 401 87 401 87 402 151 402 151 455 152 455 152 459 154 460 155 463 157 463 159 465 167 465 167 464 171 463 172 461 174 461 175 459 177 459 178 457 180 457 181 455 183 455 188 450 190 450 196 444 198 444 199 442 204 440 210 434 212 434 213 432 218 430 220 427 225 425 227 422 232 420 234 417 239 415 241 412 246 410 248 407 250 407 251 405 253 405 255 403 258 403 258 402 410 402 410 401 420 400 420 399 423 399 423 398 426 398 428 396 431 396 431 395 435 394 436 392 441 390 443 387 445 387 451 381 451 379 455 376 455 374 457 373 457 371 458 371 458 369 459 369 459 367 460 367 460 365 463 361 463 358 464 358 464 355 465 355 465 350 466 350 466 344 467 344 467 302 464 299 457 299 457 300 453 301 451 304 449 304 443 310 443 316 442 316 442 343 441 343 439 353 438 353 436 359 434 360 434 362 427 369 425 369 424 371 422 371 422 372 420 372 416 375 413 375 413 376 379 376 379 377 377 377 377 376 375 376 375 377 374 376 253 376 253 377 248 377 248 378 242 380 241 382 239 382 238 384 236 384 234 387 232 387 230 390 225 392 223 395 221 395 220 397 215 399 213 402 211 402 210 404 205 406 203 409 201 409 200 411 195 413 193 416 191 416 190 418 188 418 187 420 185 420 181 423 177 420 177 390 176 390 176 383 172 378 169 378 169 377 166 377 166 376 85 376 85 375 82 375 82 374 79 374 79 373 75 372 70 367 68 367 63 362 63 360 61 359 61 357 58 354 58 351 57 351 56 345 55 345 55 335 54 335 54 124 55 124 55 118 56 118 57 112 58 112 59 108 61 107 61 105 63 104 63 102 68 97 70 97 72 94 74 94 77 91 87 89 87 88 408 88 408 89 413 89 413 90 419 91 419 92 423 93 424 95 426 95 434 103 435 107 437 108 437 110 439 112 441 122 442 122 442 165 443 165 443 169 449 175 451 175 452 177 454 177 455 179 458 179 458 180 464 179 467 175 467 121 466 121 466 115 465 115 465 111 464 111 464 107 462 105 462 102 461 102 458 94 456 93 454 88 449 84 448 81 446 81 441 75 439 75 435 71 433 71 433 70 431 70 431 69 429 69 429 68 427 68 425 66 422 66 422 65 418 65 418 64 414 64 414 63 397 63 397 62 373 62 373 63 370 63 370 62 365 62 365 63 357 63 357 62 355 62 355 63 208 63 208 62 206 62 206 63 156 63 156 62 146 62 145 63 145 62ZM169 142 165 143 161 147 161 150 159 152 159 155 158 155 158 158 156 160 154 169 152 171 150 180 148 182 146 191 144 193 144 197 142 199 138 214 136 216 136 220 134 222 134 225 133 225 132 231 130 233 127 245 126 245 125 250 123 252 119 267 117 269 114 281 112 283 108 298 106 300 106 303 105 303 105 306 103 308 101 317 99 319 98 327 100 329 129 329 129 328 131 328 134 325 135 321 136 321 138 311 140 309 140 306 141 306 141 303 142 303 142 300 143 300 143 297 144 297 144 294 145 294 145 291 146 291 147 288 214 287 214 288 217 289 217 292 219 294 219 298 221 300 221 303 222 303 222 306 223 306 223 309 224 309 224 312 225 312 225 315 226 315 226 318 227 318 227 321 228 321 228 324 230 325 230 327 240 328 240 329 249 329 249 328 250 329 254 329 254 328 255 329 261 329 261 328 264 328 264 320 263 320 261 311 259 309 256 297 254 295 252 286 250 284 248 275 246 273 246 269 245 269 244 264 242 262 239 250 237 248 233 233 231 231 227 216 225 214 221 199 219 197 217 188 215 186 215 183 214 183 212 174 210 172 210 169 209 169 209 166 208 166 208 163 207 163 207 160 206 160 206 157 205 157 205 154 203 152 202 147 200 146 200 144 195 143 195 142ZM297 142 294 144 294 326 297 329 329 329 331 327 331 144 330 144 330 142ZM402 192 399 195 397 195 397 197 395 199 393 199 393 201 391 203 389 203 388 206 382 212 380 212 380 214 378 214 378 216 376 216 376 218 359 234 358 240 359 240 360 244 400 284 408 285 414 279 414 270 383 239 383 237 413 208 413 206 415 204 414 197 411 193ZM452 193 449 194 445 198 445 200 444 200 445 207 475 237 475 240 445 269 444 276 445 276 446 280 451 284 457 284 498 244 499 235 496 232 496 230 493 229 474 210 474 208 472 208 472 206 462 196 460 196 457 193ZM181 185 184 187 184 190 185 190 185 193 186 193 186 196 187 196 187 199 188 199 192 214 194 216 194 220 195 220 195 223 196 223 196 226 197 226 197 229 198 229 198 232 199 232 199 235 200 235 200 238 201 238 204 250 205 250 205 255 158 255 157 254 158 250 159 250 159 247 160 247 160 244 161 244 161 241 162 241 162 238 163 238 163 235 164 235 164 232 165 232 165 229 166 229 166 226 167 226 167 223 168 223 168 220 169 220 169 217 170 217 170 214 171 214 171 211 172 211 172 208 173 208 173 205 174 205 174 202 175 202 175 199 176 199 176 196 177 196 177 193 178 193 178 190 179 190 179 187Z\"/></svg>",
      "aicoding": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 470 470\"><title>AICoding</title><path fill=\"#a78bfa\" d=\"M 33 73 L 137 13 L 263 83 L 159 143 Z\"/><path fill=\"#a78bfa\" opacity=\"0.92\" d=\"M 33 73 L 33 213 L 159 283 L 159 143 Z\"/><path fill=\"#fff\" d=\"M 207 247 L 311 187 L 431 257 L 327 317 Z\"/><path fill=\"#a78bfa\" opacity=\"0.92\" d=\"M 207 247 L 207 387 L 327 457 L 327 317 Z\"/><path fill=\"#fdba74\" d=\"M 327 317 L 431 257 L 431 397 L 327 457 Z\"/><path fill=\"none\" stroke=\"#2b1b4b\" stroke-width=\"22\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M 33 73 L 137 13 L 263 83 L 159 143 L 33 73\"/><path fill=\"none\" stroke=\"#2b1b4b\" stroke-width=\"22\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M 33 73 L 33 213 L 159 283 L 159 143\"/><path fill=\"none\" stroke=\"#2b1b4b\" stroke-width=\"22\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M 159 143 L 263 83 L 263 223\"/><path fill=\"none\" stroke=\"#2b1b4b\" stroke-width=\"22\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M 207 247 L 311 187 L 431 257 L 327 317 L 207 247\"/><path fill=\"none\" stroke=\"#2b1b4b\" stroke-width=\"22\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M 207 247 L 207 387 L 327 457 L 327 317\"/><path fill=\"none\" stroke=\"#2b1b4b\" stroke-width=\"22\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M 327 317 L 431 257 L 431 397 L 327 457\"/><path fill=\"none\" stroke=\"#2b1b4b\" stroke-width=\"22\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M 245 163 L 365 163\"/><path fill=\"none\" stroke=\"#2b1b4b\" stroke-width=\"22\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M 175 197 L 335 117\"/><path fill=\"none\" stroke=\"#2b1b4b\" stroke-width=\"22\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M 365 163 L 365 241\"/></svg>",
      "aigocode": "<svg height=\"1em\" width=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 648 564\" xmlns=\"http://www.w3.org/2000/svg\"><title>AiGoCode</title><g transform=\"translate(0,564) scale(0.1,-0.1)\"><path fill=\"#7C6AEF\" d=\"M5392 5379 c-26 -10 -36 -28 -56 -108 -24 -94 -47 -140 -101 -199 -56 -62 -117 -96 -219 -121 -101 -25 -116 -35 -116 -75 0 -45 21 -60 123 -89 190 -53 271 -147 336 -384 13 -46 38 -61 85 -49 25 6 36 28 56 111 7 28 23 72 36 99 13 28 21 54 18 58 -3 5 -2 7 3 6 4 -2 29 18 55 44 41 41 145 110 173 114 56 8 126 27 131 36 4 6 7 30 8 54 1 49 -5 54 -104 74 -164 33 -280 148 -320 320 -23 101 -52 129 -108 109z\"/><path fill=\"#5B7FFF\" d=\"M1770 4814 c-138 -25 -301 -93 -425 -177 -80 -55 -227 -197 -280 -272 -98 -138 -161 -279 -201 -447 -16 -66 -18 -164 -21 -1098 -4 -1130 -4 -1144 57 -1331 80 -242 222 -434 444 -598 l56 -42 0 -337 c0 -309 2 -340 19 -379 31 -66 87 -93 158 -74 22 6 202 117 404 249 200 131 398 259 439 285 144 89 48 81 1095 88 912 5 932 6 1012 27 243 64 441 178 599 344 166 176 274 408 304 648 13 110 13 2016 0 2120 -25 190 -83 347 -183 498 -160 240 -384 400 -677 484 l-75 22 -1325 2 c-1086 2 -1339 0 -1400 -12z m1068 -1455 l-3 -751 -71 -18 c-71 -18 -154 -55 -205 -91 -14 -10 -29 -16 -33 -12 -3 3 -6 91 -6 195 l0 188 -306 0 -305 0 -21 -47 c-11 -27 -33 -75 -48 -108 -16 -33 -44 -96 -62 -140 l-34 -80 -172 -3 c-101 -1 -172 1 -172 7 0 5 14 40 31 78 31 68 101 227 254 578 335 769 358 814 434 874 94 74 122 79 449 80 l272 1 -2 -751z m794 717 c41 -13 103 -42 139 -62 67 -40 202 -168 232 -221 l17 -31 -77 -65 c-43 -35 -101 -80 -129 -101 l-52 -36 -39 57 c-79 116 -204 177 -313 154 -66 -14 -105 -42 -130 -91 -19 -37 -20 -60 -20 -400 0 -339 1 -363 20 -399 26 -51 61 -78 128 -97 143 -42 327 52 366 186 l13 45 -163 3 -163 2 -3 157 c-2 111 0 157 9 160 6 2 263 3 570 1 487 -3 562 -5 593 -19 98 -45 125 -159 58 -244 -39 -50 -66 -55 -322 -55 l-236 0 -6 -27 c-18 -83 -29 -115 -62 -183 -69 -143 -230 -269 -402 -316 -81 -22 -271 -25 -350 -5 -173 43 -289 145 -341 298 -19 57 -20 81 -17 534 l3 474 33 67 c55 112 168 199 307 235 79 20 246 10 337 -21z m828 -1515 c67 -71 67 -73 -62 -396 -45 -110 -102 -254 -128 -320 -254 -639 -272 -681 -298 -702 -74 -62 -192 -15 -192 77 0 12 39 116 86 233 48 117 97 239 110 272 119 311 336 833 354 852 36 37 85 32 130 -16z m-1574 -205 c16 -13 19 -29 22 -128 l3 -113 -195 -155 c-108 -85 -196 -158 -196 -161 0 -4 17 -19 38 -35 128 -96 327 -272 339 -301 16 -39 17 -143 2 -177 -15 -33 -34 -39 -67 -22 -48 26 -566 446 -584 474 -23 35 -23 89 1 128 16 27 150 143 376 326 39 31 79 65 90 75 44 41 128 103 139 103 7 0 21 -6 32 -14z m713 -25 c52 -37 53 -33 -92 -551 -36 -129 -80 -289 -98 -355 -39 -143 -62 -175 -129 -175 -47 0 -92 20 -114 52 -24 34 -19 90 18 217 19 64 78 271 131 461 53 190 98 353 101 364 6 16 14 18 79 14 54 -4 81 -11 104 -27z m1116 -351 c55 -45 117 -98 138 -120 61 -64 48 -115 -50 -192 -32 -25 -118 -94 -191 -152 -136 -108 -163 -120 -217 -100 -26 10 -47 62 -39 97 10 46 22 62 94 119 36 29 93 77 128 106 l62 55 -65 59 c-71 65 -77 84 -49 141 24 47 44 67 68 67 12 0 66 -36 121 -80z\"/><path fill=\"#5B7FFF\" d=\"M2328 3755 c-37 -20 -54 -53 -153 -280 -48 -110 -96 -219 -106 -242 l-18 -43 234 0 235 0 0 290 0 290 -82 0 c-53 -1 -93 -6 -110 -15z\"/></g></svg>",
      "alibaba": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Alibaba</title><path d=\"M24 14.014c-2.8 1.512-5.62 2.896-8.759 3.524-.7.139-1.476.139-2.187.043-.678-.085-1.017-.682-.776-1.31.23-.585.536-1.181.93-1.671.852-1.065 1.814-2.034 2.678-3.088a15.75 15.75 0 001.422-2.054c.306-.511.164-1.129-.372-1.384-.897-.437-1.859-.745-2.81-1.075-.11-.043-.274.074-.492.149.273.244.47.425.743.67-2.821.48-5.49 1.16-8.08 2.098-.012.053-.033.095-.023.117.383.585.208 1.032-.35 1.394a2.365 2.365 0 00-.568.522c1.706.5 3.226.213 4.68-.735-.087-.127-.175-.244-.262-.372.546.096.874.394.918.862.011.107-.054.213-.087.32-.077-.086-.175-.17-.24-.267-.045-.064-.056-.138-.088-.245-1.728 1.15-3.587 1.438-5.632.842 0 .404-.022.745.011 1.075.022.287-.098.415-.36.564-.591.362-1.204.735-1.696 1.214-.59.585-.371 1.299.427 1.597.907.34 1.859.35 2.81.234 1.126-.139 2.23-.32 3.456-.49-1.433.67-2.844 1.14-4.33 1.33-1.04.14-2.078.214-3.106-.084-1.476-.415-2.133-1.501-1.75-2.96.361-1.363 1.236-2.449 2.176-3.45 3.139-3.332 7.108-5.024 11.7-5.365 1.072-.074 2.155.064 3.16.511 1.411.639 2.002 1.99 1.313 3.354-.448.905-1.072 1.735-1.695 2.555-.612.809-1.301 1.554-1.946 2.331-.186.234-.361.48-.503.745-.274.5-.088.83.492.778 1.213-.118 2.45-.213 3.62-.511 1.716-.437 3.389-1.054 5.084-1.597.175-.043.339-.107.492-.17z\" fill=\"#FF6003\" fill-rule=\"evenodd\"></path></svg>",
      "amux": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 128 128\" fill=\"none\"><title>Amux</title><path d=\"M4 96 C4 96, 24 12, 64 12 C104 12, 124 96, 124 96 Q124 102, 118 102 C94 102, 92 64, 64 64 C36 64, 34 102, 10 102 Q4 102, 4 96 Z\" fill=\"currentColor\"/></svg>",
      "anthropic": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Anthropic</title><path d=\"M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z\"></path></svg>",
      "aws": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>AWS</title><path d=\"M6.763 11.212c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 01-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 01-.287-.375 6.18 6.18 0 01-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.39-.384-.59-.894-.59-1.533 0-.678.24-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.4 2.4 0 01-.28.104.488.488 0 01-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 01.224-.167 4.577 4.577 0 011.005-.36 4.84 4.84 0 011.246-.151c.95 0 1.644.216 2.091.647.44.43.662 1.085.662 1.963v2.586h.016zm-3.24 1.214c.263 0 .534-.048.822-.144a1.78 1.78 0 00.758-.51 1.27 1.27 0 00.272-.512c.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 00-.735-.136 6.02 6.02 0 00-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 6.726a1.398 1.398 0 01-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 01.32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 01.311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 01-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 01-.303.08h-.687c-.15 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32L12.32 7.747l-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08l-.686.001zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 01-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.32.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 00.415-.758.777.777 0 00-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 01-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .36.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 01.24.2.43.43 0 01.071.263v.375c0 .168-.064.256-.184.256a.83.83 0 01-.303-.096 3.652 3.652 0 00-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.16.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926a2.157 2.157 0 01-.583.703c-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167z\"></path><path d=\"M.378 15.475c3.384 1.963 7.56 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.44-.2.814.287.383.607-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.272-.351zm23.531-.2c.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151l.175-.439c.343-.88.802-2.198.52-2.555-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399z\" fill=\"#F90\"></path></svg>",
      "azure": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Azure</title><path d=\"M7.242 1.613A1.11 1.11 0 018.295.857h6.977L8.03 22.316a1.11 1.11 0 01-1.052.755h-5.43a1.11 1.11 0 01-1.053-1.466L7.242 1.613z\" fill=\"url(#lobe-icons-azure-fill-0)\"></path><path d=\"M18.397 15.296H7.4a.51.51 0 00-.347.882l7.066 6.595c.206.192.477.298.758.298h6.226l-2.706-7.775z\" fill=\"#0078D4\"></path><path d=\"M15.272.857H7.497L0 23.071h7.775l1.596-4.73 5.068 4.73h6.665l-2.707-7.775h-7.998L15.272.857z\" fill=\"url(#lobe-icons-azure-fill-1)\"></path><path d=\"M17.193 1.613a1.11 1.11 0 00-1.052-.756h-7.81.035c.477 0 .9.304 1.052.756l6.748 19.992a1.11 1.11 0 01-1.052 1.466h-.12 7.895a1.11 1.11 0 001.052-1.466L17.193 1.613z\" fill=\"url(#lobe-icons-azure-fill-2)\"></path><defs><linearGradient gradientUnits=\"userSpaceOnUse\" id=\"lobe-icons-azure-fill-0\" x1=\"8.247\" x2=\"1.002\" y1=\"1.626\" y2=\"23.03\"><stop stop-color=\"#114A8B\"></stop><stop offset=\"1\" stop-color=\"#0669BC\"></stop></linearGradient><linearGradient gradientUnits=\"userSpaceOnUse\" id=\"lobe-icons-azure-fill-1\" x1=\"14.042\" x2=\"12.324\" y1=\"15.302\" y2=\"15.888\"><stop stop-opacity=\".3\"></stop><stop offset=\".071\" stop-opacity=\".2\"></stop><stop offset=\".321\" stop-opacity=\".1\"></stop><stop offset=\".623\" stop-opacity=\".05\"></stop><stop offset=\"1\" stop-opacity=\"0\"></stop></linearGradient><linearGradient gradientUnits=\"userSpaceOnUse\" id=\"lobe-icons-azure-fill-2\" x1=\"12.841\" x2=\"20.793\" y1=\"1.626\" y2=\"22.814\"><stop stop-color=\"#3CCBF4\"></stop><stop offset=\"1\" stop-color=\"#2892DF\"></stop></linearGradient></defs></svg>",
      "baidu": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Baidu</title><path d=\"M8.859 11.735c1.017-1.71 4.059-3.083 6.202.286 1.579 2.284 4.284 4.397 4.284 4.397s2.027 1.601.73 4.684c-1.24 2.956-5.64 1.607-6.005 1.49l-.024-.009s-1.746-.568-3.776-.112c-2.026.458-3.773.286-3.773.286l-.045-.001c-.328-.01-2.38-.187-3.001-2.968-.675-3.028 2.365-4.687 2.592-4.968.226-.288 1.802-1.37 2.816-3.085zm.986 1.738v2.032h-1.64s-1.64.138-2.213 2.014c-.2 1.252.177 1.99.242 2.148.067.157.596 1.073 1.927 1.342h3.078v-7.514l-1.394-.022zm3.588 2.191l-1.44.024v3.956s.064.985 1.44 1.344h3.541v-5.3h-1.528v3.979h-1.46s-.466-.068-.553-.447v-3.556zM9.82 16.715v3.06H8.58s-.863-.045-1.126-1.049c-.136-.445.02-.959.088-1.16.063-.203.353-.671.951-.85H9.82zm9.525-9.036c2.086 0 2.646 2.06 2.646 2.742 0 .688.284 3.597-2.309 3.655-2.595.057-2.704-1.77-2.704-3.08 0-1.374.277-3.317 2.367-3.317zM4.24 6.08c1.523-.135 2.645 1.55 2.762 2.513.07.625.393 3.486-1.975 4-2.364.515-3.244-2.249-2.984-3.544 0 0 .28-2.797 2.197-2.969zm8.847-1.483c.14-1.31 1.69-3.316 2.931-3.028 1.236.285 2.367 1.944 2.137 3.37-.224 1.428-1.345 3.313-3.095 3.082-1.748-.226-2.143-1.823-1.973-3.424zM9.425 1c1.307 0 2.364 1.519 2.364 3.398 0 1.879-1.057 3.4-2.364 3.4s-2.367-1.521-2.367-3.4C7.058 2.518 8.118 1 9.425 1z\" fill=\"#2932E1\" fill-rule=\"nonzero\"></path></svg>",
      "bytedance": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>ByteDance</title><path d=\"M14.944 18.587l-1.704-.445V10.01l1.824-.462c1-.254 1.84-.461 1.88-.453.032 0 .056 2.235.056 4.972v4.973l-.176-.008c-.104 0-.952-.207-1.88-.446z\" fill=\"#00C8D2\" fill-rule=\"nonzero\"></path><path d=\"M7 16.542c0-2.736.024-4.98.064-4.98.032-.008.872.2 1.88.454l1.816.461-.016 4.05-.024 4.049-1.632.422c-.896.23-1.736.445-1.856.469L7 21.523v-4.98z\" fill=\"#3C8CFF\" fill-rule=\"nonzero\"></path><path d=\"M19.24 12.477c0-9.03.008-9.515.144-9.475.072.024.784.207 1.576.406.792.207 1.576.405 1.744.445l.296.08-.016 8.56-.024 8.568-1.624.414c-.888.23-1.728.437-1.856.47l-.24.055v-9.523z\" fill=\"#78E6DC\" fill-rule=\"nonzero\"></path><path d=\"M1 12.509c0-4.678.024-8.505.064-8.505.032 0 .872.207 1.872.454l1.824.461v7.582c0 4.16-.016 7.574-.032 7.574-.024 0-.872.215-1.88.47L1 21.013v-8.505z\" fill=\"#325AB4\"></path></svg>",
      "chatglm": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>ChatGLM</title><defs><linearGradient id=\"lobe-icons-chat-glm-fill\" x1=\"-18.756%\" x2=\"70.894%\" y1=\"49.371%\" y2=\"90.944%\"><stop offset=\"0%\" stop-color=\"#504AF4\"></stop><stop offset=\"100%\" stop-color=\"#3485FF\"></stop></linearGradient></defs><path d=\"M9.917 2c4.906 0 10.178 3.947 8.93 10.58-.014.07-.037.14-.057.21l-.003-.277c-.083-3-1.534-8.934-8.87-8.934-3.393 0-8.137 3.054-7.93 8.158-.04 4.778 3.555 8.4 7.95 8.332l.073-.001c1.2-.033 2.763-.429 3.1-1.657.063-.031.26.534.268.598.048.256.112.369.192.34.981-.348 2.286-1.222 1.952-2.38-.176-.61-1.775-.147-1.921-.347.418-.979 2.234-.926 3.153-.716.443.102.657.38 1.012.442.29.052.981-.2.96.242-1.5 3.042-4.893 5.41-8.808 5.41C3.654 22 0 16.574 0 11.737 0 5.947 4.959 2 9.917 2zM9.9 5.3c.484 0 1.125.225 1.38.585 3.669.145 4.313 2.686 4.694 5.444.255 1.838.315 2.3.182 1.387l.083.59c.068.448.554.737.982.516.144-.075.254-.231.328-.47a.2.2 0 01.258-.13l.625.22a.2.2 0 01.124.238 2.172 2.172 0 01-.51.92c-.878.917-2.757.664-3.08-.62-.14-.554-.055-.626-.345-1.242-.292-.621-1.238-.709-1.69-.295-.345.315-.407.805-.406 1.282L12.6 15.9a.9.9 0 01-.9.9h-1.4a.9.9 0 01-.9-.9v-.65a1.15 1.15 0 10-2.3 0v.65a.9.9 0 01-.9.9H4.8a.9.9 0 01-.9-.9l.035-3.239c.012-1.884.356-3.658 2.47-4.134.2-.045.252.13.29.342.025.154.043.252.053.294.701 3.058 1.75 4.299 3.144 3.722l.66-.331.254-.13c.158-.082.25-.131.276-.15.012-.01-.165-.206-.407-.464l-1.012-1.067a8.925 8.925 0 01-.199-.216c-.047-.034-.116.068-.208.306-.074.157-.251.252-.272.326-.013.058.108.298.362.72.164.288.22.508-.31.343-1.04-.8-1.518-2.273-1.684-3.725-.004-.035-.162-1.913-.162-1.913a1.2 1.2 0 011.113-1.281L9.9 5.3zm12.994 8.68c.037.697-.403.704-1.213.591l-1.783-.276c-.265-.053-.385-.099-.313-.147.47-.315 3.268-.93 3.31-.168zm-.915-.083l-.926.042c-.85.077-1.452.24.338.336l.103.003c.815.012 1.264-.359.485-.381zm1.667-3.601h.01c.79.398.067 1.03-.65 1.393-.14.07-.491.176-1.052.315-.241.04-.457.092-.333.16l.01.005c1.952.958-3.123 1.534-2.495 1.285l.38-.148c.68-.266 1.614-.682 1.666-1.337.038-.48 1.253-.442 1.493-.968.048-.106 0-.236-.144-.389-.05-.047-.094-.094-.107-.148-.073-.305.7-.431 1.222-.168zm-2.568-.474c-.135 1.198-2.479 4.192-1.949 2.863l.017-.042c.298-.717.376-2.221 1.337-3.221.25-.26.636.035.595.4zm-7.976-.253c.02-.694 1.002-.968 1.346-.347.01-1.274-1.941-.768-1.346.347z\" fill=\"url(#lobe-icons-chat-glm-fill)\" fill-rule=\"evenodd\"></path></svg>",
      "claude": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Claude</title><path d=\"M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z\" fill=\"#D97757\" fill-rule=\"nonzero\"></path></svg>",
      "cloudflare": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Cloudflare</title><path d=\"M16.493 17.4c.135-.52.08-.983-.161-1.338-.215-.328-.592-.519-1.05-.519l-8.663-.109a.148.148 0 01-.135-.082c-.027-.054-.027-.109-.027-.163.027-.082.108-.164.189-.164l8.744-.11c1.05-.054 2.153-.9 2.556-1.937l.511-1.31c.027-.055.027-.11.027-.164C17.92 8.91 15.66 7 12.942 7c-2.503 0-4.628 1.638-5.381 3.903a2.432 2.432 0 00-1.803-.491c-1.21.109-2.153 1.092-2.287 2.32-.027.328 0 .628.054.9C1.56 13.688 0 15.326 0 17.319c0 .19.027.355.027.545 0 .082.08.137.161.137h15.983c.08 0 .188-.055.215-.164l.107-.437\" fill=\"#F38020\"></path><path d=\"M19.238 11.75h-.242c-.054 0-.108.054-.135.109l-.35 1.2c-.134.52-.08.983.162 1.338.215.328.592.518 1.05.518l1.855.11c.054 0 .108.027.135.082.027.054.027.109.027.163-.027.082-.108.164-.188.164l-1.91.11c-1.05.054-2.153.9-2.557 1.937l-.134.355c-.027.055.026.137.107.137h6.592c.081 0 .162-.055.162-.137.107-.41.188-.846.188-1.31-.027-2.62-2.153-4.777-4.762-4.777\" fill=\"#FCAD32\"></path></svg>",
      "cohere": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Cohere</title><path clip-rule=\"evenodd\" d=\"M8.128 14.099c.592 0 1.77-.033 3.398-.703 1.897-.781 5.672-2.2 8.395-3.656 1.905-1.018 2.74-2.366 2.74-4.18A4.56 4.56 0 0018.1 1H7.549A6.55 6.55 0 001 7.55c0 3.617 2.745 6.549 7.128 6.549z\" fill=\"#39594D\" fill-rule=\"evenodd\"></path><path clip-rule=\"evenodd\" d=\"M9.912 18.61a4.387 4.387 0 012.705-4.052l3.323-1.38c3.361-1.394 7.06 1.076 7.06 4.715a5.104 5.104 0 01-5.105 5.104l-3.597-.001a4.386 4.386 0 01-4.386-4.387z\" fill=\"#D18EE2\" fill-rule=\"evenodd\"></path><path d=\"M4.776 14.962A3.775 3.775 0 001 18.738v.489a3.776 3.776 0 007.551 0v-.49a3.775 3.775 0 00-3.775-3.775z\" fill=\"#FF7759\"></path></svg>",
      "copilot": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Copilot</title><path d=\"M17.533 1.829A2.528 2.528 0 0015.11 0h-.737a2.531 2.531 0 00-2.484 2.087l-1.263 6.937.314-1.08a2.528 2.528 0 012.424-1.833h4.284l1.797.706 1.731-.706h-.505a2.528 2.528 0 01-2.423-1.829l-.715-2.453z\" fill=\"url(#lobe-icons-copilot-fill-0)\" transform=\"translate(0 1)\"></path><path d=\"M6.726 20.16A2.528 2.528 0 009.152 22h1.566c1.37 0 2.49-1.1 2.525-2.48l.17-6.69-.357 1.228a2.528 2.528 0 01-2.423 1.83h-4.32l-1.54-.842-1.667.843h.497c1.124 0 2.113.75 2.426 1.84l.697 2.432z\" fill=\"url(#lobe-icons-copilot-fill-1)\" transform=\"translate(0 1)\"></path><path d=\"M15 0H6.252c-2.5 0-4 3.331-5 6.662-1.184 3.947-2.734 9.225 1.75 9.225H6.78c1.13 0 2.12-.753 2.43-1.847.657-2.317 1.809-6.359 2.713-9.436.46-1.563.842-2.906 1.43-3.742A1.97 1.97 0 0115 0\" fill=\"url(#lobe-icons-copilot-fill-2)\" transform=\"translate(0 1)\"></path><path d=\"M15 0H6.252c-2.5 0-4 3.331-5 6.662-1.184 3.947-2.734 9.225 1.75 9.225H6.78c1.13 0 2.12-.753 2.43-1.847.657-2.317 1.809-6.359 2.713-9.436.46-1.563.842-2.906 1.43-3.742A1.97 1.97 0 0115 0\" fill=\"url(#lobe-icons-copilot-fill-3)\" transform=\"translate(0 1)\"></path><path d=\"M9 22h8.749c2.5 0 4-3.332 5-6.663 1.184-3.948 2.734-9.227-1.75-9.227H17.22c-1.129 0-2.12.754-2.43 1.848a1149.2 1149.2 0 01-2.713 9.437c-.46 1.564-.842 2.907-1.43 3.743A1.97 1.97 0 019 22\" fill=\"url(#lobe-icons-copilot-fill-4)\" transform=\"translate(0 1)\"></path><path d=\"M9 22h8.749c2.5 0 4-3.332 5-6.663 1.184-3.948 2.734-9.227-1.75-9.227H17.22c-1.129 0-2.12.754-2.43 1.848a1149.2 1149.2 0 01-2.713 9.437c-.46 1.564-.842 2.907-1.43 3.743A1.97 1.97 0 019 22\" fill=\"url(#lobe-icons-copilot-fill-5)\" transform=\"translate(0 1)\"></path><defs><radialGradient cx=\"85.44%\" cy=\"100.653%\" fx=\"85.44%\" fy=\"100.653%\" gradientTransform=\"scale(-.8553 -1) rotate(50.927 2.041 -1.946)\" id=\"lobe-icons-copilot-fill-0\" r=\"105.116%\"><stop offset=\"9.6%\" stop-color=\"#00AEFF\"></stop><stop offset=\"77.3%\" stop-color=\"#2253CE\"></stop><stop offset=\"100%\" stop-color=\"#0736C4\"></stop></radialGradient><radialGradient cx=\"18.143%\" cy=\"32.928%\" fx=\"18.143%\" fy=\"32.928%\" gradientTransform=\"scale(.8897 1) rotate(52.069 .193 .352)\" id=\"lobe-icons-copilot-fill-1\" r=\"95.612%\"><stop offset=\"0%\" stop-color=\"#FFB657\"></stop><stop offset=\"63.4%\" stop-color=\"#FF5F3D\"></stop><stop offset=\"92.3%\" stop-color=\"#C02B3C\"></stop></radialGradient><radialGradient cx=\"82.987%\" cy=\"-9.792%\" fx=\"82.987%\" fy=\"-9.792%\" gradientTransform=\"scale(-1 -.9441) rotate(-70.872 .142 1.17)\" id=\"lobe-icons-copilot-fill-4\" r=\"140.622%\"><stop offset=\"6.6%\" stop-color=\"#8C48FF\"></stop><stop offset=\"50%\" stop-color=\"#F2598A\"></stop><stop offset=\"89.6%\" stop-color=\"#FFB152\"></stop></radialGradient><linearGradient id=\"lobe-icons-copilot-fill-2\" x1=\"39.465%\" x2=\"46.884%\" y1=\"12.117%\" y2=\"103.774%\"><stop offset=\"15.6%\" stop-color=\"#0D91E1\"></stop><stop offset=\"48.7%\" stop-color=\"#52B471\"></stop><stop offset=\"65.2%\" stop-color=\"#98BD42\"></stop><stop offset=\"93.7%\" stop-color=\"#FFC800\"></stop></linearGradient><linearGradient id=\"lobe-icons-copilot-fill-3\" x1=\"45.949%\" x2=\"50%\" y1=\"0%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#3DCBFF\"></stop><stop offset=\"24.7%\" stop-color=\"#0588F7\" stop-opacity=\"0\"></stop></linearGradient><linearGradient id=\"lobe-icons-copilot-fill-5\" x1=\"83.507%\" x2=\"83.453%\" y1=\"-6.106%\" y2=\"21.131%\"><stop offset=\"5.8%\" stop-color=\"#F8ADFA\"></stop><stop offset=\"70.8%\" stop-color=\"#A86EDD\" stop-opacity=\"0\"></stop></linearGradient></defs></svg>",
      "crazyrouter": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 563 648\"><title>CrazyRouter</title><path fill=\"currentColor\" d=\"M 167.5 190 L 276.5 190 L 277 191.5 L 253 234 L 247.5 235 L 246.5 234 L 235.5 234 L 230.5 235 L 229.5 234 L 217.5 234 L 215.5 234 L 191.5 234 L 189.5 235 L 186.5 234 L 164.5 235 L 150.5 239 Q 132.7 246.7 121 260.5 Q 108.2 275.2 102 296.5 L 99 312.5 L 99 335.5 L 102 351.5 L 110 371.5 Q 118.1 386.4 130.5 397 Q 143.5 409 164.5 413 L 173.5 413 L 174.5 414 L 258.5 414 L 314.5 318 L 433.5 318 Q 449.3 314.8 457 303.5 L 462 294.5 L 465 283.5 L 465 269.5 L 460 253.5 L 449.5 241 L 440.5 236 L 430.5 234 L 332.5 234 L 258.5 361 L 212.5 361 L 212 359.5 L 310.5 190 L 438.5 190 L 448.5 192 L 461.5 197 Q 476 205 486 217.5 L 496 233.5 L 502 250.5 L 504 260.5 L 504 268.5 L 505 269.5 L 505 283.5 L 504 284.5 L 503 297.5 L 499 311.5 Q 490.8 331.8 475.5 345 L 462.5 354 L 446 360.5 L 502 452.5 L 504 458 L 456.5 458 L 454 455.5 L 416 389.5 L 398.5 362 L 336.5 362 L 335 363.5 L 285 452.5 L 280.5 458 L 167.5 458 L 166.5 457 L 153.5 456 Q 112.4 445.6 90 416.5 Q 72.7 396.3 64 367.5 L 59 343.5 L 58 314.5 L 59 313.5 L 60 297.5 L 64 280.5 L 73 257.5 Q 85.3 233.8 104.5 217 Q 116.8 206.3 132.5 199 L 149.5 193 L 166.5 191 L 167.5 190 Z\"/></svg>",
      "cubence": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 179 203\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Cubence</title><rect width=\"100\" height=\"100\" rx=\"13\" transform=\"matrix(0.866025 -0.5 0 1 92 103)\" fill=\"#4B5563\"></rect><rect width=\"100\" height=\"100\" rx=\"13\" transform=\"matrix(0.866025 0.5 -0.866025 0.5 88.6025 -3)\" fill=\"#1F2937\"></rect><rect width=\"100\" height=\"100\" rx=\"13\" transform=\"matrix(0.866025 0.5 0 1 0 53)\" fill=\"#111827\"></rect><rect width=\"72.7816\" height=\"72.7816\" rx=\"13\" transform=\"matrix(0.866025 0.5 0 1 11 73)\" fill=\"#374151\"></rect><rect width=\"28.1436\" height=\"28.1436\" rx=\"3\" transform=\"matrix(0.866025 0.5 0 1 11 86)\" fill=\"#E5E7EB\" fill-opacity=\"0.9\"></rect><rect width=\"28.1436\" height=\"28.1436\" rx=\"3\" transform=\"matrix(0.866025 0.5 0 1 50 107)\" fill=\"#E5E7EB\" fill-opacity=\"0.9\"></rect><rect width=\"13.8564\" height=\"13.8564\" rx=\"3\" transform=\"matrix(0.866025 0.5 0 1 43 148)\" fill=\"#E5E7EB\" fill-opacity=\"0.9\"></rect></svg>",
      "deepseek": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>DeepSeek</title><path d=\"M23.748 4.482c-.254-.124-.364.113-.512.234-.051.039-.094.09-.137.136-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.156-.708-.311-.955-.65-.172-.241-.219-.51-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.093.172.187.129.323-.082.28-.18.552-.266.833-.055.179-.137.217-.329.14a5.526 5.526 0 01-1.736-1.18c-.857-.828-1.631-1.742-2.597-2.458a11.365 11.365 0 00-.689-.471c-.985-.957.13-1.743.388-1.836.27-.098.093-.432-.779-.428-.872.004-1.67.295-2.687.684a3.055 3.055 0 01-.465.137 9.597 9.597 0 00-2.883-.102c-1.885.21-3.39 1.102-4.497 2.623C.082 8.606-.231 10.684.152 12.85c.403 2.284 1.569 4.175 3.36 5.653 1.858 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.133-.284 4.994-1.86.47.234.962.327 1.78.397.63.059 1.236-.03 1.705-.128.735-.156.684-.837.419-.961-2.155-1.004-1.682-.595-2.113-.926 1.096-1.296 2.746-2.642 3.392-7.003.05-.347.007-.565 0-.845-.004-.17.035-.237.23-.256a4.173 4.173 0 001.545-.475c1.396-.763 1.96-2.015 2.093-3.517.02-.23-.004-.467-.247-.588zM11.581 18c-2.089-1.642-3.102-2.183-3.52-2.16-.392.024-.321.471-.235.763.09.288.207.486.371.739.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.167-1.361-.802-2.5-1.86-3.301-3.307-.774-1.393-1.224-2.887-1.298-4.482-.02-.386.093-.522.477-.592a4.696 4.696 0 011.529-.039c2.132.312 3.946 1.265 5.468 2.774.868.86 1.525 1.887 2.202 2.891.72 1.066 1.494 2.082 2.48 2.914.348.292.625.514.891.677-.802.09-2.14.11-3.054-.614zm1-6.44a.306.306 0 01.415-.287.302.302 0 01.2.288.306.306 0 01-.31.307.303.303 0 01-.304-.308zm3.11 1.596c-.2.081-.399.151-.59.16a1.245 1.245 0 01-.798-.254c-.274-.23-.47-.358-.552-.758a1.73 1.73 0 01.016-.588c.07-.327-.008-.537-.239-.727-.187-.156-.426-.199-.688-.199a.559.559 0 01-.254-.078c-.11-.054-.2-.19-.114-.358.028-.054.16-.186.192-.21.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.391.451.462.576.685.914.176.265.336.537.445.848.067.195-.019.354-.25.452z\" fill=\"#4D6BFE\"></path></svg>",
      "doubao": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Doubao</title><path d=\"M5.31 15.756c.172-3.75 1.883-5.999 2.549-6.739-3.26 2.058-5.425 5.658-6.358 8.308v1.12C1.501 21.513 4.226 24 7.59 24a6.59 6.59 0 002.2-.375c.353-.12.7-.248 1.039-.378.913-.899 1.65-1.91 2.243-2.992-4.877 2.431-7.974.072-7.763-4.5l.002.001z\" fill=\"#1E37FC\"></path><path d=\"M22.57 10.283c-1.212-.901-4.109-2.404-7.397-2.8.295 3.792.093 8.766-2.1 12.773a12.782 12.782 0 01-2.244 2.992c3.764-1.448 6.746-3.457 8.596-5.219 2.82-2.683 3.353-5.178 3.361-6.66a2.737 2.737 0 00-.216-1.084v-.002z\" fill=\"#37E1BE\"></path><path d=\"M14.303 1.867C12.955.7 11.248 0 9.39 0 7.532 0 5.883.677 4.545 1.807 2.791 3.29 1.627 5.557 1.5 8.125v9.201c.932-2.65 3.097-6.25 6.357-8.307.5-.318 1.025-.595 1.569-.829 1.883-.801 3.878-.932 5.746-.706-.222-2.83-.718-5.002-.87-5.617h.001z\" fill=\"#A569FF\"></path><path d=\"M17.305 4.961a199.47 199.47 0 01-1.08-1.094c-.202-.213-.398-.419-.586-.622l-1.333-1.378c.151.615.648 2.786.869 5.617 3.288.395 6.185 1.898 7.396 2.8-1.306-1.275-3.475-3.487-5.266-5.323z\" fill=\"#1E37FC\"></path></svg>",
      "gemini": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Gemini</title><path d=\"M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z\" fill=\"#3186FF\"></path><path d=\"M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z\" fill=\"url(#lobe-icons-gemini-fill-0)\"></path><path d=\"M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z\" fill=\"url(#lobe-icons-gemini-fill-1)\"></path><path d=\"M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z\" fill=\"url(#lobe-icons-gemini-fill-2)\"></path><defs><linearGradient gradientUnits=\"userSpaceOnUse\" id=\"lobe-icons-gemini-fill-0\" x1=\"7\" x2=\"11\" y1=\"15.5\" y2=\"12\"><stop stop-color=\"#08B962\"></stop><stop offset=\"1\" stop-color=\"#08B962\" stop-opacity=\"0\"></stop></linearGradient><linearGradient gradientUnits=\"userSpaceOnUse\" id=\"lobe-icons-gemini-fill-1\" x1=\"8\" x2=\"11.5\" y1=\"5.5\" y2=\"11\"><stop stop-color=\"#F94543\"></stop><stop offset=\"1\" stop-color=\"#F94543\" stop-opacity=\"0\"></stop></linearGradient><linearGradient gradientUnits=\"userSpaceOnUse\" id=\"lobe-icons-gemini-fill-2\" x1=\"3.5\" x2=\"17.5\" y1=\"13.5\" y2=\"12\"><stop stop-color=\"#FABC12\"></stop><stop offset=\".46\" stop-color=\"#FABC12\" stop-opacity=\"0\"></stop></linearGradient></defs></svg>",
      "gemma": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Gemma</title><defs><linearGradient id=\"lobe-icons-gemma-fill\" x1=\"24.419%\" x2=\"75.194%\" y1=\"75.581%\" y2=\"25.194%\"><stop offset=\"0%\" stop-color=\"#446EFF\"></stop><stop offset=\"36.661%\" stop-color=\"#2E96FF\"></stop><stop offset=\"83.221%\" stop-color=\"#B1C5FF\"></stop></linearGradient></defs><path d=\"M12.34 5.953a8.233 8.233 0 01-.247-1.125V3.72a8.25 8.25 0 015.562 2.232H12.34zm-.69 0c.113-.373.199-.755.257-1.145V3.72a8.25 8.25 0 00-5.562 2.232h5.304zm-5.433.187h5.373a7.98 7.98 0 01-.267.696 8.41 8.41 0 01-1.76 2.65L6.216 6.14zm-.264-.187H2.977v.187h2.915a8.436 8.436 0 00-2.357 5.767H0v.186h3.535a8.436 8.436 0 002.357 5.767H2.977v.186h2.976v2.977h.187v-2.915a8.436 8.436 0 005.767 2.357V24h.186v-3.535a8.436 8.436 0 005.767-2.357v2.915h.186v-2.977h2.977v-.186h-2.915a8.436 8.436 0 002.357-5.767H24v-.186h-3.535a8.436 8.436 0 00-2.357-5.767h2.915v-.187h-2.977V2.977h-.186v2.915a8.436 8.436 0 00-5.767-2.357V0h-.186v3.535A8.436 8.436 0 006.14 5.892V2.977h-.187v2.976zm6.14 14.326a8.25 8.25 0 005.562-2.233H12.34c-.108.367-.19.743-.247 1.126v1.107zm-.186-1.087a8.015 8.015 0 00-.258-1.146H6.345a8.25 8.25 0 005.562 2.233v-1.087zm-8.186-7.285h1.107a8.23 8.23 0 001.125-.247V6.345a8.25 8.25 0 00-2.232 5.562zm1.087.186H3.72a8.25 8.25 0 002.232 5.562v-5.304a8.012 8.012 0 00-1.145-.258zm15.47-.186a8.25 8.25 0 00-2.232-5.562v5.315c.367.108.743.19 1.126.247h1.107zm-1.086.186c-.39.058-.772.144-1.146.258v5.304a8.25 8.25 0 002.233-5.562h-1.087zm-1.332 5.69V12.41a7.97 7.97 0 00-.696.267 8.409 8.409 0 00-2.65 1.76l3.346 3.346zm0-6.18v-5.45l-.012-.013h-5.451c.076.235.162.468.26.696a8.698 8.698 0 001.819 2.688 8.698 8.698 0 002.688 1.82c.228.097.46.183.696.259zM6.14 17.848V12.41c.235.078.468.167.696.267a8.403 8.403 0 012.688 1.799 8.404 8.404 0 011.799 2.688c.1.228.19.46.267.696H6.152l-.012-.012zm0-6.245V6.326l3.29 3.29a8.716 8.716 0 01-2.594 1.728 8.14 8.14 0 01-.696.259zm6.257 6.257h5.277l-3.29-3.29a8.716 8.716 0 00-1.728 2.594 8.135 8.135 0 00-.259.696zm-2.347-7.81a9.435 9.435 0 01-2.88 1.96 9.14 9.14 0 012.88 1.94 9.14 9.14 0 011.94 2.88 9.435 9.435 0 011.96-2.88 9.14 9.14 0 012.88-1.94 9.435 9.435 0 01-2.88-1.96 9.434 9.434 0 01-1.96-2.88 9.14 9.14 0 01-1.94 2.88z\" fill=\"url(#lobe-icons-gemma-fill)\" fill-rule=\"evenodd\"></path></svg>",
      "github": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Github</title><path d=\"M12 0c6.63 0 12 5.276 12 11.79-.001 5.067-3.29 9.567-8.175 11.187-.6.118-.825-.25-.825-.56 0-.398.015-1.665.015-3.242 0-1.105-.375-1.813-.81-2.181 2.67-.295 5.475-1.297 5.475-5.822 0-1.297-.465-2.344-1.23-3.169.12-.295.54-1.503-.12-3.125 0 0-1.005-.324-3.3 1.209a11.32 11.32 0 00-3-.398c-1.02 0-2.04.133-3 .398-2.295-1.518-3.3-1.209-3.3-1.209-.66 1.622-.24 2.83-.12 3.125-.765.825-1.23 1.887-1.23 3.169 0 4.51 2.79 5.527 5.46 5.822-.345.294-.66.81-.765 1.577-.69.31-2.415.81-3.495-.973-.225-.354-.9-1.223-1.845-1.209-1.005.015-.405.56.015.781.51.28 1.095 1.327 1.23 1.666.24.663 1.02 1.93 4.035 1.385 0 .988.015 1.916.015 2.196 0 .31-.225.664-.825.56C3.303 21.374-.003 16.867 0 11.791 0 5.276 5.37 0 12 0z\"></path></svg>",
      "githubcopilot": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>GithubCopilot</title><path d=\"M19.245 5.364c1.322 1.36 1.877 3.216 2.11 5.817.622 0 1.2.135 1.592.654l.73.964c.21.278.323.61.323.955v2.62c0 .339-.173.669-.453.868C20.239 19.602 16.157 21.5 12 21.5c-4.6 0-9.205-2.583-11.547-4.258-.28-.2-.452-.53-.453-.868v-2.62c0-.345.113-.679.321-.956l.73-.963c.392-.517.974-.654 1.593-.654l.029-.297c.25-2.446.81-4.213 2.082-5.52 2.461-2.54 5.71-2.851 7.146-2.864h.198c1.436.013 4.685.323 7.146 2.864zm-7.244 4.328c-.284 0-.613.016-.962.05-.123.447-.305.85-.57 1.108-1.05 1.023-2.316 1.18-2.994 1.18-.638 0-1.306-.13-1.851-.464-.516.165-1.012.403-1.044.996a65.882 65.882 0 00-.063 2.884l-.002.48c-.002.563-.005 1.126-.013 1.69.002.326.204.63.51.765 2.482 1.102 4.83 1.657 6.99 1.657 2.156 0 4.504-.555 6.985-1.657a.854.854 0 00.51-.766c.03-1.682.006-3.372-.076-5.053-.031-.596-.528-.83-1.046-.996-.546.333-1.212.464-1.85.464-.677 0-1.942-.157-2.993-1.18-.266-.258-.447-.661-.57-1.108-.32-.032-.64-.049-.96-.05zm-2.525 4.013c.539 0 .976.426.976.95v1.753c0 .525-.437.95-.976.95a.964.964 0 01-.976-.95v-1.752c0-.525.437-.951.976-.951zm5 0c.539 0 .976.426.976.95v1.753c0 .525-.437.95-.976.95a.964.964 0 01-.976-.95v-1.752c0-.525.437-.951.976-.951zM7.635 5.087c-1.05.102-1.935.438-2.385.906-.975 1.037-.765 3.668-.21 4.224.405.394 1.17.657 1.995.657h.09c.649-.013 1.785-.176 2.73-1.11.435-.41.705-1.433.675-2.47-.03-.834-.27-1.52-.63-1.813-.39-.336-1.275-.482-2.265-.394zm6.465.394c-.36.292-.6.98-.63 1.813-.03 1.037.24 2.06.675 2.47.968.957 2.136 1.104 2.776 1.11h.044c.825 0 1.59-.263 1.995-.657.555-.556.765-3.187-.21-4.224-.45-.468-1.335-.804-2.385-.906-.99-.088-1.875.058-2.265.394zM12 7.615c-.24 0-.525.015-.84.044.03.16.045.336.06.526l-.001.159a2.94 2.94 0 01-.014.25c.225-.022.425-.027.612-.028h.366c.187 0 .387.006.612.028-.015-.146-.015-.277-.015-.409.015-.19.03-.365.06-.526a9.29 9.29 0 00-.84-.044z\"></path></svg>",
      "google": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Google</title><path d=\"M23 12.245c0-.905-.075-1.565-.236-2.25h-10.54v4.083h6.186c-.124 1.014-.797 2.542-2.294 3.569l-.021.136 3.332 2.53.23.022C21.779 18.417 23 15.593 23 12.245z\" fill=\"#4285F4\"></path><path d=\"M12.225 23c3.03 0 5.574-.978 7.433-2.665l-3.542-2.688c-.948.648-2.22 1.1-3.891 1.1a6.745 6.745 0 01-6.386-4.572l-.132.011-3.465 2.628-.045.124C4.043 20.531 7.835 23 12.225 23z\" fill=\"#34A853\"></path><path d=\"M5.84 14.175A6.65 6.65 0 015.463 12c0-.758.138-1.491.361-2.175l-.006-.147-3.508-2.67-.115.054A10.831 10.831 0 001 12c0 1.772.436 3.447 1.197 4.938l3.642-2.763z\" fill=\"#FBBC05\"></path><path d=\"M12.225 5.253c2.108 0 3.529.892 4.34 1.638l3.167-3.031C17.787 2.088 15.255 1 12.225 1 7.834 1 4.043 3.469 2.197 7.062l3.63 2.763a6.77 6.77 0 016.398-4.572z\" fill=\"#EB4335\"></path></svg>",
      "googlecloud": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>GoogleCloud</title><path d=\"M15.961 7.327l2.086-2.086.14-.879C14.384.905 8.34 1.297 4.913 5.18A9.643 9.643 0 002.88 8.991l.747-.105 4.172-.688.322-.33c1.856-2.038 4.994-2.312 7.137-.578l.703.037z\" fill=\"#EA4335\"></path><path d=\"M21.02 8.93a9.399 9.399 0 00-2.834-4.568L15.258 7.29a5.204 5.204 0 011.91 4.129v.52a2.606 2.606 0 012.607 2.605c0 1.44-1.167 2.577-2.606 2.577h-5.22l-.512.556v3.126l.513.49h5.219c3.743.03 6.802-2.952 6.83-6.695a6.778 6.778 0 00-2.98-5.668z\" fill=\"#4285F4\"></path><path d=\"M6.738 21.293h5.212v-4.172H6.738c-.371 0-.731-.08-1.069-.234l-.74.227-2.1 2.086-.183.71a6.763 6.763 0 004.092 1.383z\" fill=\"#34A853\"></path><path d=\"M6.738 7.759A6.778 6.778 0 002.646 19.91l3.023-3.023a2.606 2.606 0 113.448-3.448l3.023-3.023a6.771 6.771 0 00-5.402-2.657z\" fill=\"#FBBC05\"></path></svg>",
      "grok": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Grok</title><path d=\"M9.27 15.29l7.978-5.897c.391-.29.95-.177 1.137.272.98 2.369.542 5.215-1.41 7.169-1.951 1.954-4.667 2.382-7.149 1.406l-2.711 1.257c3.889 2.661 8.611 2.003 11.562-.953 2.341-2.344 3.066-5.539 2.388-8.42l.006.007c-.983-4.232.242-5.924 2.75-9.383.06-.082.12-.164.179-.248l-3.301 3.305v-.01L9.267 15.292M7.623 16.723c-2.792-2.67-2.31-6.801.071-9.184 1.761-1.763 4.647-2.483 7.166-1.425l2.705-1.25a7.808 7.808 0 00-1.829-1A8.975 8.975 0 005.984 5.83c-2.533 2.536-3.33 6.436-1.962 9.764 1.022 2.487-.653 4.246-2.34 6.022-.599.63-1.199 1.259-1.682 1.925l7.62-6.815\"></path></svg>",
      "huawei": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Huawei</title><path d=\"M10.341 17.042s.062-.061 0-.061C7.516 10.902 3.646 6.22 3.646 6.22S1.557 8.168 1.68 10.174c.061 1.52 1.228 2.37 1.228 2.37 1.843 1.763 6.266 4.012 7.31 4.499h.123zm-.737 1.52c0-.061-.123-.061-.123-.061l-7.371.243c.798 1.398 2.15 2.492 3.563 2.188.983-.243 3.194-1.763 3.87-2.25.123-.12.061-.12.061-.12zm.123-.67c.062-.06 0-.12 0-.12C6.471 15.581.206 12.3.206 12.3c-.553 1.763.184 3.161.184 3.161.798 1.702 2.334 2.189 2.334 2.189.676.303 1.413.303 1.413.303h5.529c.061 0 .061-.06.061-.06zm.492-14.831c-.308 0-1.168.243-1.168.243-1.965.486-2.395 2.249-2.395 2.249-.369 1.094 0 2.31 0 2.31.675 2.857 3.87 7.598 4.545 8.57l.062.062c.061 0 .061-.061.061-.061C12.43 5.796 10.22 3.06 10.22 3.06zm2.457 13.373c.061 0 .123-.061.123-.061.737-1.033 3.87-5.714 4.545-8.57 0 0 .369-1.399 0-2.31 0 0-.491-1.764-2.457-2.25 0 0-.553-.121-1.167-.243 0 0-2.211 2.796-1.106 13.312 0 .122.062.122.062.122zm1.72 2.067s-.062 0-.062.06v.122c.738.486 2.826 2.006 3.87 2.249 0 0 1.905.669 3.563-2.188l-7.371-.243zm9.398-6.261s-6.265 3.343-9.521 5.531c0 0-.062.06-.062.122 0 0 0 .06.062.06h5.651s.553 0 1.29-.303c0 0 1.536-.487 2.396-2.25 0-.06.737-1.458.184-3.16zM13.66 17.042s.061.06.122 0c1.045-.547 5.468-2.736 7.31-4.499 0 0 1.168-.911 1.23-2.37.122-2.067-1.967-3.951-1.967-3.951s-3.87 4.559-6.695 10.698c0 0-.062.06 0 .122z\" fill=\"#C7000B\"></path></svg>",
      "huggingface": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>HuggingFace</title><path d=\"M2.25 11.535c0-3.407 1.847-6.554 4.844-8.258a9.822 9.822 0 019.687 0c2.997 1.704 4.844 4.851 4.844 8.258 0 5.266-4.337 9.535-9.687 9.535S2.25 16.8 2.25 11.535z\" fill=\"#FF9D0B\"></path><path d=\"M11.938 20.086c4.797 0 8.687-3.829 8.687-8.551 0-4.722-3.89-8.55-8.687-8.55-4.798 0-8.688 3.828-8.688 8.55 0 4.722 3.89 8.55 8.688 8.55z\" fill=\"#FFD21E\"></path><path d=\"M11.875 15.113c2.457 0 3.25-2.156 3.25-3.263 0-.576-.393-.394-1.023-.089-.582.283-1.365.675-2.224.675-1.798 0-3.25-1.693-3.25-.586 0 1.107.79 3.263 3.25 3.263h-.003z\" fill=\"#FF323D\"></path><path d=\"M14.76 9.21c.32.108.445.753.767.585.447-.233.707-.708.659-1.204a1.235 1.235 0 00-.879-1.059 1.262 1.262 0 00-1.33.394c-.322.384-.377.92-.14 1.36.153.283.638-.177.925-.079l-.002.003zm-5.887 0c-.32.108-.448.753-.768.585a1.226 1.226 0 01-.658-1.204c.048-.495.395-.913.878-1.059a1.262 1.262 0 011.33.394c.322.384.377.92.14 1.36-.152.283-.64-.177-.925-.079l.003.003zm1.12 5.34a2.166 2.166 0 011.325-1.106c.07-.02.144.06.219.171l.192.306c.069.1.139.175.209.175.074 0 .15-.074.223-.172l.205-.302c.08-.11.157-.188.234-.165.537.168.986.536 1.25 1.026.932-.724 1.275-1.905 1.275-2.633 0-.508-.306-.426-.81-.19l-.616.296c-.52.24-1.148.48-1.824.48-.676 0-1.302-.24-1.823-.48l-.589-.283c-.52-.248-.838-.342-.838.177 0 .703.32 1.831 1.187 2.56l.18.14z\" fill=\"#3A3B45\"></path><path d=\"M17.812 10.366a.806.806 0 00.813-.8c0-.441-.364-.8-.813-.8a.806.806 0 00-.812.8c0 .442.364.8.812.8zm-11.624 0a.806.806 0 00.812-.8c0-.441-.364-.8-.812-.8a.806.806 0 00-.813.8c0 .442.364.8.813.8zM4.515 13.073c-.405 0-.765.162-1.017.46a1.455 1.455 0 00-.333.925 1.801 1.801 0 00-.485-.074c-.387 0-.737.146-.985.409a1.41 1.41 0 00-.2 1.722 1.302 1.302 0 00-.447.694c-.06.222-.12.69.2 1.166a1.267 1.267 0 00-.093 1.236c.238.533.81.958 1.89 1.405l.24.096c.768.3 1.473.492 1.478.494.89.243 1.808.375 2.732.394 1.465 0 2.513-.443 3.115-1.314.93-1.342.842-2.575-.274-3.763l-.151-.154c-.692-.684-1.155-1.69-1.25-1.912-.195-.655-.71-1.383-1.562-1.383-.46.007-.889.233-1.15.605-.25-.31-.495-.553-.715-.694a1.87 1.87 0 00-.993-.312zm14.97 0c.405 0 .767.162 1.017.46.216.262.333.588.333.925.158-.047.322-.071.487-.074.388 0 .738.146.985.409a1.41 1.41 0 01.2 1.722c.22.178.377.422.445.694.06.222.12.69-.2 1.166.244.37.279.836.093 1.236-.238.533-.81.958-1.889 1.405l-.239.096c-.77.3-1.475.492-1.48.494-.89.243-1.808.375-2.732.394-1.465 0-2.513-.443-3.115-1.314-.93-1.342-.842-2.575.274-3.763l.151-.154c.695-.684 1.157-1.69 1.252-1.912.195-.655.708-1.383 1.56-1.383.46.007.889.233 1.15.605.25-.31.495-.553.718-.694.244-.162.523-.265.814-.3l.176-.012z\" fill=\"#FF9D0B\"></path><path d=\"M9.785 20.132c.688-.994.638-1.74-.305-2.667-.945-.928-1.495-2.288-1.495-2.288s-.205-.788-.672-.714c-.468.074-.81 1.25.17 1.971.977.721-.195 1.21-.573.534-.375-.677-1.405-2.416-1.94-2.751-.532-.332-.907-.148-.782.541.125.687 2.357 2.35 2.14 2.707-.218.362-.983-.42-.983-.42S2.953 14.9 2.43 15.46c-.52.558.398 1.026 1.7 1.803 1.308.778 1.41.985 1.225 1.28-.187.295-3.07-2.1-3.34-1.083-.27 1.011 2.943 1.304 2.745 2.006-.2.7-2.265-1.324-2.685-.537-.425.79 2.913 1.718 2.94 1.725 1.075.276 3.813.859 4.77-.522zm4.432 0c-.687-.994-.64-1.74.305-2.667.943-.928 1.493-2.288 1.493-2.288s.205-.788.675-.714c.465.074.807 1.25-.17 1.971-.98.721.195 1.21.57.534.377-.677 1.407-2.416 1.94-2.751.532-.332.91-.148.782.541-.125.687-2.355 2.35-2.137 2.707.215.362.98-.42.98-.42S21.05 14.9 21.57 15.46c.52.558-.395 1.026-1.7 1.803-1.308.778-1.408.985-1.225 1.28.187.295 3.07-2.1 3.34-1.083.27 1.011-2.94 1.304-2.743 2.006.2.7 2.263-1.324 2.685-.537.423.79-2.912 1.718-2.94 1.725-1.077.276-3.815.859-4.77-.522z\" fill=\"#FFD21E\"></path></svg>",
      "hunyuan": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Hunyuan</title><circle cx=\"12\" cy=\"12\" fill=\"#0055E9\" r=\"12\"></circle><path d=\"M12 0c.518 0 1.028.033 1.528.096A6.188 6.188 0 0112.12 12.28l-.12.001c-2.99 0-5.242 2.179-5.554 5.11-.223 2.086.353 4.412 2.242 6.146C3.672 22.1 0 17.479 0 12 0 5.373 5.373 0 12 0z\" fill=\"#A8DFF5\"></path><path d=\"M5.286 5a2.438 2.438 0 01.682 3.38c-3.962 5.966-3.215 10.743 2.648 15.136C3.636 22.056 0 17.452 0 12c0-1.787.39-3.482 1.09-5.006.253-.435.525-.872.817-1.311A2.438 2.438 0 015.286 5z\" fill=\"#0055E9\"></path><path d=\"M12.98.04c.272.021.543.053.81.093.583.106 1.117.254 1.538.44 6.638 2.927 8.07 10.052 1.748 15.642a4.125 4.125 0 01-5.822-.358c-1.51-1.706-1.3-4.184.357-5.822.858-.848 3.108-1.223 4.045-2.441 1.257-1.634 2.122-6.009-2.523-7.506L12.98.039z\" fill=\"#00BCFF\"></path><path d=\"M13.528.096A6.187 6.187 0 0112 12.281a5.75 5.75 0 00-1.71.255c.147-.905.595-1.784 1.321-2.501.858-.848 3.108-1.223 4.045-2.441 1.27-1.651 2.14-6.104-2.676-7.554.184.014.367.033.548.056z\" fill=\"#ECECEE\"></path></svg>",
      "kimi": "<svg height=\"1em\" width=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 25\" xmlns=\"http://www.w3.org/2000/svg\"><title>Kimi</title><path d=\"M21.7202 0.939941C22.9502 0.939941 23.9502 1.93994 23.9502 3.16994C23.9502 4.39994 22.9502 5.39994 21.7202 5.39994H19.7502C19.6002 5.39994 19.4902 5.27994 19.4902 5.13994V3.16994C19.4902 1.93994 20.4902 0.939941 21.7202 0.939941Z\" fill=\"#1783FF\"></path><path d=\"M9.39 13.9501L17.82 5.59012C17.98 5.43012 17.89 5.12012 17.68 5.12012H13.14C13.14 5.12012 13.04 5.14012 13 5.18012L3.92 14.1901C3.78 14.3301 3.57 14.2101 3.57 13.9801V5.39012C3.57 5.24012 3.47 5.12012 3.35 5.12012H0.219999C0.0999993 5.12012 0 5.24012 0 5.39012V23.9201C0 24.0701 0.0999993 24.1901 0.219999 24.1901H3.35C3.47 24.1901 3.57 24.0701 3.57 23.9201V20.1401C3.57 20.0601 3.6 19.9801 3.65 19.9301L6.47 17.1401C6.54 17.0701 6.63 17.0601 6.71 17.1101L14.24 22.6501C15.47 23.4801 16.85 23.9901 18.25 24.1401C18.37 24.1501 18.48 24.0301 18.48 23.8701V20.3101C18.48 20.1701 18.4 20.0601 18.29 20.0501C17.47 19.9201 16.66 19.6001 15.94 19.1101L9.42 14.3901C9.28 14.3001 9.27 14.0701 9.39 13.9501Z\" fill=\"currentColor\"></path></svg>",
      "meta": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Meta</title><path d=\"M6.897 4h-.024l-.031 2.615h.022c1.715 0 3.046 1.357 5.94 6.246l.175.297.012.02 1.62-2.438-.012-.019a48.763 48.763 0 00-1.098-1.716 28.01 28.01 0 00-1.175-1.629C10.413 4.932 8.812 4 6.896 4z\" fill=\"url(#lobe-icons-meta-fill-0)\"></path><path d=\"M6.873 4C4.95 4.01 3.247 5.258 2.02 7.17a4.352 4.352 0 00-.01.017l2.254 1.231.011-.017c.718-1.083 1.61-1.774 2.568-1.785h.021L6.896 4h-.023z\" fill=\"url(#lobe-icons-meta-fill-1)\"></path><path d=\"M2.019 7.17l-.011.017C1.2 8.447.598 9.995.274 11.664l-.005.022 2.534.6.004-.022c.27-1.467.786-2.828 1.456-3.845l.011-.017L2.02 7.17z\" fill=\"url(#lobe-icons-meta-fill-2)\"></path><path d=\"M2.807 12.264l-2.533-.6-.005.022c-.177.918-.267 1.851-.269 2.786v.023l2.598.233v-.023a12.591 12.591 0 01.21-2.44z\" fill=\"url(#lobe-icons-meta-fill-3)\"></path><path d=\"M2.677 15.537a5.462 5.462 0 01-.079-.813v-.022L0 14.468v.024a8.89 8.89 0 00.146 1.652l2.535-.585a4.106 4.106 0 01-.004-.022z\" fill=\"url(#lobe-icons-meta-fill-4)\"></path><path d=\"M3.27 16.89c-.284-.31-.484-.756-.589-1.328l-.004-.021-2.535.585.004.021c.192 1.01.568 1.85 1.106 2.487l.014.017 2.018-1.745a2.106 2.106 0 01-.015-.016z\" fill=\"url(#lobe-icons-meta-fill-5)\"></path><path d=\"M10.78 9.654c-1.528 2.35-2.454 3.825-2.454 3.825-2.035 3.2-2.739 3.917-3.871 3.917a1.545 1.545 0 01-1.186-.508l-2.017 1.744.014.017C2.01 19.518 3.058 20 4.356 20c1.963 0 3.374-.928 5.884-5.33l1.766-3.13a41.283 41.283 0 00-1.227-1.886z\" fill=\"#0082FB\"></path><path d=\"M13.502 5.946l-.016.016c-.4.43-.786.908-1.16 1.416.378.483.768 1.024 1.175 1.63.48-.743.928-1.345 1.367-1.807l.016-.016-1.382-1.24z\" fill=\"url(#lobe-icons-meta-fill-6)\"></path><path d=\"M20.918 5.713C19.853 4.633 18.583 4 17.225 4c-1.432 0-2.637.787-3.723 1.944l-.016.016 1.382 1.24.016-.017c.715-.747 1.408-1.12 2.176-1.12.826 0 1.6.39 2.27 1.075l.015.016 1.589-1.425-.016-.016z\" fill=\"#0082FB\"></path><path d=\"M23.998 14.125c-.06-3.467-1.27-6.566-3.064-8.396l-.016-.016-1.588 1.424.015.016c1.35 1.392 2.277 3.98 2.361 6.971v.023h2.292v-.022z\" fill=\"url(#lobe-icons-meta-fill-7)\"></path><path d=\"M23.998 14.15v-.023h-2.292v.022c.004.14.006.282.006.424 0 .815-.121 1.474-.368 1.95l-.011.022 1.708 1.782.013-.02c.62-.96.946-2.293.946-3.91 0-.083 0-.165-.002-.247z\" fill=\"url(#lobe-icons-meta-fill-8)\"></path><path d=\"M21.344 16.52l-.011.02c-.214.402-.519.67-.917.787l.778 2.462a3.493 3.493 0 00.438-.182 3.558 3.558 0 001.366-1.218l.044-.065.012-.02-1.71-1.784z\" fill=\"url(#lobe-icons-meta-fill-9)\"></path><path d=\"M19.92 17.393c-.262 0-.492-.039-.718-.14l-.798 2.522c.449.153.927.222 1.46.222.492 0 .943-.073 1.352-.215l-.78-2.462c-.167.05-.341.075-.517.073z\" fill=\"url(#lobe-icons-meta-fill-10)\"></path><path d=\"M18.323 16.534l-.014-.017-1.836 1.914.016.017c.637.682 1.246 1.105 1.937 1.337l.797-2.52c-.291-.125-.573-.353-.9-.731z\" fill=\"url(#lobe-icons-meta-fill-11)\"></path><path d=\"M18.309 16.515c-.55-.642-1.232-1.712-2.303-3.44l-1.396-2.336-.011-.02-1.62 2.438.012.02.989 1.668c.959 1.61 1.74 2.774 2.493 3.585l.016.016 1.834-1.914a2.353 2.353 0 01-.014-.017z\" fill=\"url(#lobe-icons-meta-fill-12)\"></path><defs><linearGradient id=\"lobe-icons-meta-fill-0\" x1=\"75.897%\" x2=\"26.312%\" y1=\"89.199%\" y2=\"12.194%\"><stop offset=\".06%\" stop-color=\"#0867DF\"></stop><stop offset=\"45.39%\" stop-color=\"#0668E1\"></stop><stop offset=\"85.91%\" stop-color=\"#0064E0\"></stop></linearGradient><linearGradient id=\"lobe-icons-meta-fill-1\" x1=\"21.67%\" x2=\"97.068%\" y1=\"75.874%\" y2=\"23.985%\"><stop offset=\"13.23%\" stop-color=\"#0064DF\"></stop><stop offset=\"99.88%\" stop-color=\"#0064E0\"></stop></linearGradient><linearGradient id=\"lobe-icons-meta-fill-2\" x1=\"38.263%\" x2=\"60.895%\" y1=\"89.127%\" y2=\"16.131%\"><stop offset=\"1.47%\" stop-color=\"#0072EC\"></stop><stop offset=\"68.81%\" stop-color=\"#0064DF\"></stop></linearGradient><linearGradient id=\"lobe-icons-meta-fill-3\" x1=\"47.032%\" x2=\"52.15%\" y1=\"90.19%\" y2=\"15.745%\"><stop offset=\"7.31%\" stop-color=\"#007CF6\"></stop><stop offset=\"99.43%\" stop-color=\"#0072EC\"></stop></linearGradient><linearGradient id=\"lobe-icons-meta-fill-4\" x1=\"52.155%\" x2=\"47.591%\" y1=\"58.301%\" y2=\"37.004%\"><stop offset=\"7.31%\" stop-color=\"#007FF9\"></stop><stop offset=\"100%\" stop-color=\"#007CF6\"></stop></linearGradient><linearGradient id=\"lobe-icons-meta-fill-5\" x1=\"37.689%\" x2=\"61.961%\" y1=\"12.502%\" y2=\"63.624%\"><stop offset=\"7.31%\" stop-color=\"#007FF9\"></stop><stop offset=\"100%\" stop-color=\"#0082FB\"></stop></linearGradient><linearGradient id=\"lobe-icons-meta-fill-6\" x1=\"34.808%\" x2=\"62.313%\" y1=\"68.859%\" y2=\"23.174%\"><stop offset=\"27.99%\" stop-color=\"#007FF8\"></stop><stop offset=\"91.41%\" stop-color=\"#0082FB\"></stop></linearGradient><linearGradient id=\"lobe-icons-meta-fill-7\" x1=\"43.762%\" x2=\"57.602%\" y1=\"6.235%\" y2=\"98.514%\"><stop offset=\"0%\" stop-color=\"#0082FB\"></stop><stop offset=\"99.95%\" stop-color=\"#0081FA\"></stop></linearGradient><linearGradient id=\"lobe-icons-meta-fill-8\" x1=\"60.055%\" x2=\"39.88%\" y1=\"4.661%\" y2=\"69.077%\"><stop offset=\"6.19%\" stop-color=\"#0081FA\"></stop><stop offset=\"100%\" stop-color=\"#0080F9\"></stop></linearGradient><linearGradient id=\"lobe-icons-meta-fill-9\" x1=\"30.282%\" x2=\"61.081%\" y1=\"59.32%\" y2=\"33.244%\"><stop offset=\"0%\" stop-color=\"#027AF3\"></stop><stop offset=\"100%\" stop-color=\"#0080F9\"></stop></linearGradient><linearGradient id=\"lobe-icons-meta-fill-10\" x1=\"20.433%\" x2=\"82.112%\" y1=\"50.001%\" y2=\"50.001%\"><stop offset=\"0%\" stop-color=\"#0377EF\"></stop><stop offset=\"99.94%\" stop-color=\"#0279F1\"></stop></linearGradient><linearGradient id=\"lobe-icons-meta-fill-11\" x1=\"40.303%\" x2=\"72.394%\" y1=\"35.298%\" y2=\"57.811%\"><stop offset=\".19%\" stop-color=\"#0471E9\"></stop><stop offset=\"100%\" stop-color=\"#0377EF\"></stop></linearGradient><linearGradient id=\"lobe-icons-meta-fill-12\" x1=\"32.254%\" x2=\"68.003%\" y1=\"19.719%\" y2=\"84.908%\"><stop offset=\"27.65%\" stop-color=\"#0867DF\"></stop><stop offset=\"100%\" stop-color=\"#0471E9\"></stop></linearGradient></defs></svg>",
      "midjourney": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Midjourney</title><path d=\"M22.369 17.676c-1.387 1.259-3.17 2.378-5.332 3.417.044.03.086.057.13.083l.018.01.019.012c.216.123.42.184.641.184.222 0 .426-.061.642-.184l.018-.011.019-.011c.14-.084.266-.178.492-.366l.178-.148c.279-.232.426-.342.625-.456.304-.174.612-.266.949-.266.337 0 .645.092.949.266l.023.014c.188.109.334.219.602.442l.178.148c.221.184.346.278.483.36l.028.017.018.01c.21.12.407.181.62.185h.022a.31.31 0 110 .618c-.337 0-.645-.092-.95-.266a3.137 3.137 0 01-.09-.054l-.022-.014-.022-.013-.02-.014a5.356 5.356 0 01-.49-.377l-.159-.132a3.836 3.836 0 00-.483-.36l-.027-.017-.019-.01a1.256 1.256 0 00-.641-.185c-.222 0-.426.061-.641.184l-.02.011-.018.011c-.14.084-.266.178-.492.366l-.158.132a5.125 5.125 0 01-.51.39l-.022.014-.022.014-.09.054a1.868 1.868 0 01-.95.266c-.337 0-.644-.092-.949-.266a3.137 3.137 0 01-.09-.054l-.022-.014-.022-.013-.026-.017a4.881 4.881 0 01-.425-.325.308.308 0 01-.12-.1l-.098-.081a3.836 3.836 0 00-.483-.36l-.027-.017-.019-.01a1.256 1.256 0 00-.641-.185c-.222 0-.426.061-.642.184l-.018.011-.019.011c-.14.084-.266.178-.492.366l-.158.132a5.125 5.125 0 01-.51.39l-.023.014-.022.014-.09.054A1.868 1.868 0 0112 22c-.337 0-.645-.092-.949-.266a3.137 3.137 0 01-.09-.054l-.022-.014-.022-.013-.021-.014a5.356 5.356 0 01-.49-.377l-.158-.132a3.836 3.836 0 00-.483-.36l-.028-.017-.018-.01a1.256 1.256 0 00-.642-.185c-.221 0-.425.061-.641.184l-.019.011-.018.011c-.141.084-.266.178-.492.366l-.158.132a5.125 5.125 0 01-.511.39l-.022.014-.022.014-.09.054a1.868 1.868 0 01-.986.264c-.746-.09-1.319-.38-1.89-.866l-.035-.03c-.047-.041-.118-.106-.192-.174l-.196-.181-.107-.1-.011-.01a1.531 1.531 0 00-.336-.253.313.313 0 00-.095-.03h-.005c-.119.022-.238.059-.361.11a.308.308 0 01-.077.061l-.008.005a.309.309 0 01-.126.034 5.66 5.66 0 00-.774.518l-.416.324-.055.043a6.542 6.542 0 01-.324.236c-.305.207-.552.315-.8.315a.31.31 0 01-.01-.618h.01c.09 0 .235-.062.438-.198l.04-.027c.077-.054.163-.117.27-.199l.385-.301.06-.047c.268-.206.506-.373.73-.505l-.633-1.21a.309.309 0 01.254-.451l20.287-1.305a.309.309 0 01.228.537zm-1.118.14L2.369 19.03l.423.809c.128-.045.256-.078.388-.1a.31.31 0 01.052-.005c.132 0 .26.032.386.093.153.073.294.179.483.35l.016.015.092.086.144.134.097.089c.065.06.125.114.16.144.485.418.948.658 1.554.736h.011a1.25 1.25 0 00.6-.172l.021-.011.019-.011.018-.011c.141-.084.266-.178.492-.366l.178-.148c.279-.232.426-.342.625-.456.305-.174.612-.266.95-.266.336 0 .644.092.948.266l.023.014c.188.109.335.219.603.442l.177.148c.222.184.346.278.484.36l.027.017.019.01c.215.124.42.185.641.185.222 0 .426-.061.641-.184l.019-.011.018-.011c.141-.084.267-.178.493-.366l.177-.148c.28-.232.427-.342.626-.456.304-.174.612-.266.949-.266.337 0 .644.092.949.266l.025.015c.187.109.334.22.603.443 1.867-.878 3.448-1.811 4.73-2.832l.02-.016zM3.653 2.026C6.073 3.06 8.69 4.941 10.8 7.258c2.46 2.7 4.109 5.828 4.637 9.149a.31.31 0 01-.421.335c-2.348-.945-4.54-1.258-6.59-1.02-1.739.2-3.337.792-4.816 1.703-.294.182-.62-.182-.405-.454 1.856-2.355 2.581-4.99 2.343-7.794-.195-2.292-1.031-4.61-2.284-6.709a.31.31 0 01.388-.442zM10.04 4.45c1.778.543 3.892 2.102 5.782 4.243 1.984 2.248 3.552 4.934 4.347 7.582a.31.31 0 01-.401.38l-.022-.01-.386-.154a10.594 10.594 0 00-.291-.112l-.016-.006c-.68-.247-1.199-.291-1.944-.101a.31.31 0 01-.375-.218C15.378 11.123 13.073 7.276 9.775 5c-.291-.201-.072-.653.266-.55zM4.273 2.996l.008.015c1.028 1.94 1.708 4.031 1.885 6.113.213 2.513-.31 4.906-1.673 7.092l-.02.031.003-.001c1.198-.581 2.47-.969 3.825-1.132l.055-.006c1.981-.23 4.083.029 6.309.837l.066.025-.007-.039c-.593-2.95-2.108-5.737-4.31-8.179l-.07-.078c-1.785-1.96-3.944-3.6-6.014-4.65l-.057-.028zm7.92 3.238l.048.048c2.237 2.295 3.885 5.431 4.974 9.191l.038.132.022-.004c.71-.133 1.284-.063 1.963.18l.027.01.066.024.046.018-.025-.073c-.811-2.307-2.208-4.62-3.936-6.594l-.058-.065c-1.02-1.155-2.103-2.132-3.15-2.856l-.015-.011z\"></path></svg>",
      "minimax": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Minimax</title><defs><linearGradient id=\"lobe-icons-minimax-fill\" x1=\"0%\" x2=\"100.182%\" y1=\"50.057%\" y2=\"50.057%\"><stop offset=\"0%\" stop-color=\"#E2167E\"></stop><stop offset=\"100%\" stop-color=\"#FE603C\"></stop></linearGradient></defs><path d=\"M16.278 2c1.156 0 2.093.927 2.093 2.07v12.501a.74.74 0 00.744.709.74.74 0 00.743-.709V9.099a2.06 2.06 0 012.071-2.049A2.06 2.06 0 0124 9.1v6.561a.649.649 0 01-.652.645.649.649 0 01-.653-.645V9.1a.762.762 0 00-.766-.758.762.762 0 00-.766.758v7.472a2.037 2.037 0 01-2.048 2.026 2.037 2.037 0 01-2.048-2.026v-12.5a.785.785 0 00-.788-.753.785.785 0 00-.789.752l-.001 15.904A2.037 2.037 0 0113.441 22a2.037 2.037 0 01-2.048-2.026V18.04c0-.356.292-.645.652-.645.36 0 .652.289.652.645v1.934c0 .263.142.506.372.638.23.131.514.131.744 0a.734.734 0 00.372-.638V4.07c0-1.143.937-2.07 2.093-2.07zm-5.674 0c1.156 0 2.093.927 2.093 2.07v11.523a.648.648 0 01-.652.645.648.648 0 01-.652-.645V4.07a.785.785 0 00-.789-.78.785.785 0 00-.789.78v14.013a2.06 2.06 0 01-2.07 2.048 2.06 2.06 0 01-2.071-2.048V9.1a.762.762 0 00-.766-.758.762.762 0 00-.766.758v3.8a2.06 2.06 0 01-2.071 2.049A2.06 2.06 0 010 12.9v-1.378c0-.357.292-.646.652-.646.36 0 .653.29.653.646V12.9c0 .418.343.757.766.757s.766-.339.766-.757V9.099a2.06 2.06 0 012.07-2.048 2.06 2.06 0 012.071 2.048v8.984c0 .419.343.758.767.758.423 0 .766-.339.766-.758V4.07c0-1.143.937-2.07 2.093-2.07z\" fill=\"url(#lobe-icons-minimax-fill)\" fill-rule=\"nonzero\"></path></svg>",
      "zenmux": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>ZenMux</title><defs><linearGradient id=\"lobe-icons-zenmux-fill\" x1=\"0%\" x2=\"100%\" y1=\"0%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#6366F1\"></stop><stop offset=\"100%\" stop-color=\"#8B5CF6\"></stop></linearGradient></defs><rect fill=\"url(#lobe-icons-zenmux-fill)\" height=\"20\" rx=\"5\" width=\"20\" x=\"2\" y=\"2\"></rect><path d=\"M8.5 7.5h7l-7 9h7\" fill=\"none\" stroke=\"#FFFFFF\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\"></path></svg>",
      "mistral": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Mistral</title><path d=\"M3.428 3.4h3.429v3.428H3.428V3.4zm13.714 0h3.43v3.428h-3.43V3.4z\" fill=\"gold\"></path><path d=\"M3.428 6.828h6.857v3.429H3.429V6.828zm10.286 0h6.857v3.429h-6.857V6.828z\" fill=\"#FFAF00\"></path><path d=\"M3.428 10.258h17.144v3.428H3.428v-3.428z\" fill=\"#FF8205\"></path><path d=\"M3.428 13.686h3.429v3.428H3.428v-3.428zm6.858 0h3.429v3.428h-3.429v-3.428zm6.856 0h3.43v3.428h-3.43v-3.428z\" fill=\"#FA500F\"></path><path d=\"M0 17.114h10.286v3.429H0v-3.429zm13.714 0H24v3.429H13.714v-3.429z\" fill=\"#E10500\"></path></svg>",
      "newapi": "<svg fill-rule=\"evenodd\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>NewAPI</title><path d=\"M23.078 16.34c-.506 1.323-1.198 2.519-2.117 3.562-2.378 2.696-5.374 4.057-8.971 4.098a.037.037 0 01-.024-.01.041.041 0 01-.013-.023.041.041 0 01.003-.025.037.037 0 01.019-.019c1.886-.779 3.454-1.973 4.625-3.639a10.148 10.148 0 001.626-3.677c.217-.98.33-1.955.282-2.942-.048-1.018-.152-1.601-.484-2.565-.386-1.12-.915-2.16-1.627-3.089-.883-1.154-1.876-1.87-2.9-2.779-.995-.88-2.19-2.623-1.059-3.754.384-.384.997-.59 1.838-.621 2.478-.09 5.011 1.636 6.597 3.453.75.86 1.38 1.798 1.865 2.837.486 1.041.814 2.122.978 3.246.133.915.117 1.441.092 2.365a10.82 10.82 0 01-.73 3.582z\" fill=\"url(#lobe-icons-new-api-fill-0)\"></path><path d=\"M11.86.01a.041.041 0 01.009.049.038.038 0 01-.018.018C9.964.856 8.396 2.05 7.225 3.716a10.148 10.148 0 00-1.626 3.678c-.217.979-.33 1.955-.283 2.941.049 1.018.154 1.601.486 2.565.385 1.12.914 2.16 1.626 3.088.883 1.154 1.876 1.872 2.9 2.78.995.88 2.19 2.622 1.059 3.753-.385.385-.997.591-1.838.622-2.478.089-5.011-1.636-6.597-3.454-.75-.86-1.38-1.797-1.865-2.837a11.591 11.591 0 01-.978-3.246c-.133-.914-.117-1.44-.091-2.364.034-1.225.284-2.416.73-3.582.504-1.323 1.197-2.52 2.116-3.562C5.241 1.402 8.238.04 11.835 0c.009 0 .018.004.024.01z\" fill=\"url(#lobe-icons-new-api-fill-1)\"></path><path d=\"M8.721 11.903l2.455-.708.72-2.48a.066.066 0 01.127.002l.58 2.26c.776.437 1.65.755 2.622.956a.05.05 0 01.028.075.05.05 0 01-.024.019l-2.382.709a.163.163 0 00-.109.108l-.72 2.444a.034.034 0 01-.031.027.034.034 0 01-.034-.024l-.713-2.395a.183.183 0 00-.128-.128l-2.39-.705a.084.084 0 01-.044-.13.084.084 0 01.043-.03z\" fill=\"url(#lobe-icons-new-api-fill-2)\"></path><defs><linearGradient gradientUnits=\"userSpaceOnUse\" id=\"lobe-icons-new-api-fill-0\" x1=\"17.889\" x2=\"17.889\" y1=\".854\" y2=\"24\"><stop stop-color=\"#F85EAD\"></stop><stop offset=\"1\" stop-color=\"#FD75FD\"></stop></linearGradient><linearGradient gradientUnits=\"userSpaceOnUse\" id=\"lobe-icons-new-api-fill-1\" x1=\"5.936\" x2=\"5.936\" y1=\"0\" y2=\"23.146\"><stop offset=\".332\" stop-color=\"#11F5EF\"></stop><stop offset=\"1\" stop-color=\"#C738FB\"></stop></linearGradient><linearGradient gradientUnits=\"userSpaceOnUse\" id=\"lobe-icons-new-api-fill-2\" x1=\"11.961\" x2=\"11.961\" y1=\"8.666\" y2=\"15.315\"><stop offset=\".332\" stop-color=\"#11F5EF\"></stop><stop offset=\"1\" stop-color=\"#C738FB\"></stop></linearGradient></defs></svg>",
      "notion": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Notion</title><path clip-rule=\"evenodd\" d=\"M15.257.055l-13.31.98C.874 1.128.5 1.83.5 2.667v14.559c0 .654.233 1.213.794 1.96l3.129 4.06c.513.653.98.794 1.962.745l15.457-.932c1.307-.093 1.681-.7 1.681-1.727V4.954c0-.53-.21-.684-.829-1.135l-.106-.078L18.34.755c-1.027-.746-1.45-.84-3.083-.7zm-8.521 4.63c-1.263.086-1.549.105-2.266-.477L2.647 2.76c-.186-.187-.092-.42.375-.466l12.796-.933c1.074-.094 1.634.28 2.054.606l2.195 1.587c.093.047.326.326.047.326l-13.216.794-.162.01zM5.263 21.193V7.287c0-.606.187-.886.748-.933l15.176-.886c.515-.047.748.28.748.886v13.81c0 .609-.093 1.122-.934 1.168l-14.523.84c-.842.047-1.215-.232-1.215-.98zm14.338-13.16c.093.422 0 .842-.422.89l-.699.139v10.264c-.608.327-1.168.513-1.635.513-.747 0-.934-.232-1.495-.932l-4.576-7.185v6.952l1.448.327s0 .84-1.169.84l-3.221.186c-.094-.187 0-.654.327-.747l.84-.232V9.853L7.832 9.76c-.093-.42.14-1.026.794-1.073l3.456-.232 4.763 7.279v-6.44l-1.214-.14c-.094-.513.28-.887.747-.933l3.223-.187z\"></path></svg>",
      "ollama": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Ollama</title><path d=\"M7.905 1.09c.216.085.411.225.588.41.295.306.544.744.734 1.263.191.522.315 1.1.362 1.68a5.054 5.054 0 012.049-.636l.051-.004c.87-.07 1.73.087 2.48.474.101.053.2.11.297.17.05-.569.172-1.134.36-1.644.19-.52.439-.957.733-1.264a1.67 1.67 0 01.589-.41c.257-.1.53-.118.796-.042.401.114.745.368 1.016.737.248.337.434.769.561 1.287.23.934.27 2.163.115 3.645l.053.04.026.019c.757.576 1.284 1.397 1.563 2.35.435 1.487.216 3.155-.534 4.088l-.018.021.002.003c.417.762.67 1.567.724 2.4l.002.03c.064 1.065-.2 2.137-.814 3.19l-.007.01.01.024c.472 1.157.62 2.322.438 3.486l-.006.039a.651.651 0 01-.747.536.648.648 0 01-.54-.742c.167-1.033.01-2.069-.48-3.123a.643.643 0 01.04-.617l.004-.006c.604-.924.854-1.83.8-2.72-.046-.779-.325-1.544-.8-2.273a.644.644 0 01.18-.886l.009-.006c.243-.159.467-.565.58-1.12a4.229 4.229 0 00-.095-1.974c-.205-.7-.58-1.284-1.105-1.683-.595-.454-1.383-.673-2.38-.61a.653.653 0 01-.632-.371c-.314-.665-.772-1.141-1.343-1.436a3.288 3.288 0 00-1.772-.332c-1.245.099-2.343.801-2.67 1.686a.652.652 0 01-.61.425c-1.067.002-1.893.252-2.497.703-.522.39-.878.935-1.066 1.588a4.07 4.07 0 00-.068 1.886c.112.558.331 1.02.582 1.269l.008.007c.212.207.257.53.109.785-.36.622-.629 1.549-.673 2.44-.05 1.018.186 1.902.719 2.536l.016.019a.643.643 0 01.095.69c-.576 1.236-.753 2.252-.562 3.052a.652.652 0 01-1.269.298c-.243-1.018-.078-2.184.473-3.498l.014-.035-.008-.012a4.339 4.339 0 01-.598-1.309l-.005-.019a5.764 5.764 0 01-.177-1.785c.044-.91.278-1.842.622-2.59l.012-.026-.002-.002c-.293-.418-.51-.953-.63-1.545l-.005-.024a5.352 5.352 0 01.093-2.49c.262-.915.777-1.701 1.536-2.269.06-.045.123-.09.186-.132-.159-1.493-.119-2.73.112-3.67.127-.518.314-.95.562-1.287.27-.368.614-.622 1.015-.737.266-.076.54-.059.797.042zm4.116 9.09c.936 0 1.8.313 2.446.855.63.527 1.005 1.235 1.005 1.94 0 .888-.406 1.58-1.133 2.022-.62.375-1.451.557-2.403.557-1.009 0-1.871-.259-2.493-.734-.617-.47-.963-1.13-.963-1.845 0-.707.398-1.417 1.056-1.946.668-.537 1.55-.849 2.485-.849zm0 .896a3.07 3.07 0 00-1.916.65c-.461.37-.722.835-.722 1.25 0 .428.21.829.61 1.134.455.347 1.124.548 1.943.548.799 0 1.473-.147 1.932-.426.463-.28.7-.686.7-1.257 0-.423-.246-.89-.683-1.256-.484-.405-1.14-.643-1.864-.643zm.662 1.21l.004.004c.12.151.095.37-.056.49l-.292.23v.446a.375.375 0 01-.376.373.375.375 0 01-.376-.373v-.46l-.271-.218a.347.347 0 01-.052-.49.353.353 0 01.494-.051l.215.172.22-.174a.353.353 0 01.49.051zm-5.04-1.919c.478 0 .867.39.867.871a.87.87 0 01-.868.871.87.87 0 01-.867-.87.87.87 0 01.867-.872zm8.706 0c.48 0 .868.39.868.871a.87.87 0 01-.868.871.87.87 0 01-.867-.87.87.87 0 01.867-.872zM7.44 2.3l-.003.002a.659.659 0 00-.285.238l-.005.006c-.138.189-.258.467-.348.832-.17.692-.216 1.631-.124 2.782.43-.128.899-.208 1.404-.237l.01-.001.019-.034c.046-.082.095-.161.148-.239.123-.771.022-1.692-.253-2.444-.134-.364-.297-.65-.453-.813a.628.628 0 00-.107-.09L7.44 2.3zm9.174.04l-.002.001a.628.628 0 00-.107.09c-.156.163-.32.45-.453.814-.29.794-.387 1.776-.23 2.572l.058.097.008.014h.03a5.184 5.184 0 011.466.212c.086-1.124.038-2.043-.128-2.722-.09-.365-.21-.643-.349-.832l-.004-.006a.659.659 0 00-.285-.239h-.004z\"></path></svg>",
      "openai": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>OpenAI</title><path d=\"M21.55 10.004a5.416 5.416 0 00-.478-4.501c-1.217-2.09-3.662-3.166-6.05-2.66A5.59 5.59 0 0010.831 1C8.39.995 6.224 2.546 5.473 4.838A5.553 5.553 0 001.76 7.496a5.487 5.487 0 00.691 6.5 5.416 5.416 0 00.477 4.502c1.217 2.09 3.662 3.165 6.05 2.66A5.586 5.586 0 0013.168 23c2.443.006 4.61-1.546 5.361-3.84a5.553 5.553 0 003.715-2.66 5.488 5.488 0 00-.693-6.497v.001zm-8.381 11.558a4.199 4.199 0 01-2.675-.954c.034-.018.093-.05.132-.074l4.44-2.53a.71.71 0 00.364-.623v-6.176l1.877 1.069c.02.01.033.029.036.05v5.115c-.003 2.274-1.87 4.118-4.174 4.123zM4.192 17.78a4.059 4.059 0 01-.498-2.763c.032.02.09.055.131.078l4.44 2.53c.225.13.504.13.73 0l5.42-3.088v2.138a.068.068 0 01-.027.057L9.9 19.288c-1.999 1.136-4.552.46-5.707-1.51h-.001zM3.023 8.216A4.15 4.15 0 015.198 6.41l-.002.151v5.06a.711.711 0 00.364.624l5.42 3.087-1.876 1.07a.067.067 0 01-.063.005l-4.489-2.559c-1.995-1.14-2.679-3.658-1.53-5.63h.001zm15.417 3.54l-5.42-3.088L14.896 7.6a.067.067 0 01.063-.006l4.489 2.557c1.998 1.14 2.683 3.662 1.529 5.633a4.163 4.163 0 01-2.174 1.807V12.38a.71.71 0 00-.363-.623zm1.867-2.773a6.04 6.04 0 00-.132-.078l-4.44-2.53a.731.731 0 00-.729 0l-5.42 3.088V7.325a.068.068 0 01.027-.057L14.1 4.713c2-1.137 4.555-.46 5.707 1.513.487.833.664 1.809.499 2.757h.001zm-11.741 3.81l-1.877-1.068a.065.065 0 01-.036-.051V6.559c.001-2.277 1.873-4.122 4.181-4.12.976 0 1.92.338 2.671.954-.034.018-.092.05-.131.073l-4.44 2.53a.71.71 0 00-.365.623l-.003 6.173v.002zm1.02-2.168L12 9.25l2.414 1.375v2.75L12 14.75l-2.415-1.375v-2.75z\"></path></svg>",
      "openclaw": "<svg height=\"1em\" width=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 120 120\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><title>OpenClaw</title><defs><linearGradient id=\"oc-g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#ff4d4d\"/><stop offset=\"100%\" stop-color=\"#991b1b\"/></linearGradient></defs><path d=\"M60 10 C30 10 15 35 15 55 C15 75 30 95 45 100 L45 110 L55 110 L55 100 C55 100 60 102 65 100 L65 110 L75 110 L75 100 C90 95 105 75 105 55 C105 35 90 10 60 10Z\" fill=\"url(#oc-g)\"/><path d=\"M20 45 C5 40 0 50 5 60 C10 70 20 65 25 55 C28 48 25 45 20 45Z\" fill=\"url(#oc-g)\"/><path d=\"M100 45 C115 40 120 50 115 60 C110 70 100 65 95 55 C92 48 95 45 100 45Z\" fill=\"url(#oc-g)\"/><path d=\"M45 15 Q35 5 30 8\" stroke=\"#ff4d4d\" stroke-width=\"3\" stroke-linecap=\"round\"/><path d=\"M75 15 Q85 5 90 8\" stroke=\"#ff4d4d\" stroke-width=\"3\" stroke-linecap=\"round\"/><circle cx=\"45\" cy=\"35\" r=\"6\" fill=\"#050810\"/><circle cx=\"75\" cy=\"35\" r=\"6\" fill=\"#050810\"/><circle cx=\"46\" cy=\"34\" r=\"2.5\" fill=\"#00e5cc\"/><circle cx=\"76\" cy=\"34\" r=\"2.5\" fill=\"#00e5cc\"/></svg>",
      "packycode": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 145.55 113.29\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>PackyCode</title><path fill=\"currentColor\" stroke=\"currentColor\" stroke-miterlimit=\"10\" d=\"M144.68,38.49l-.06-.23c-.88-3.28-2.5-5.94-4.58-8.06.14,5.65-2.96,11.02-6.22,16.66l-.39.68c-2.26,3.91-4.66,7.94-6.57,11.1l-.86,1.38c-3.36,5.44-6.27,10.14-12.18,14.18-8.34,5.87-18.2,5.81-26.92,5.76-2.81-.02-5.48-.03-7.95.14l-.35.02c-3.22.06-5.96,1.57-8.17,4.49l-.14.18c-.86,1.06-1.7,2.26-2.58,3.54-3.43,4.92-7.69,11.04-16.17,12.42-4.37.86-9.98.84-14.94.83h-1.95c-.52,0-1.06,0-1.61,0-6.95,0-16.08-.89-21.94-6.55-.15-.15-.3-.3-.44-.45.5,4.73,2.33,8.64,5.44,11.65,5.86,5.66,14.98,6.55,21.94,6.55.55,0,1.09,0,1.61-.01h1.93c4.96.02,10.58.04,14.96-.83,8.48-1.37,12.74-7.5,16.17-12.42.88-1.27,1.72-2.48,2.58-3.54l.14-.18c2.21-2.92,4.95-4.43,8.17-4.49l.35-.02c2.47-.17,5.13-.16,7.95-.14,8.72.05,18.58.11,26.91-5.76,5.92-4.03,8.82-8.73,12.19-14.17l.86-1.39c1.91-3.15,4.3-7.18,6.57-11.09l.39-.69c3.81-6.6,7.41-12.84,5.86-19.57ZM120.9,23.02c-.28,0-.56,0-.83,0-9.68-.19-24.03-.09-35.57-.01l-2.04.02c-.93.01-1.82.02-2.67.03-8.36.08-14.4.13-23.33,3.82l-.27.12c-10.76,4.68-16.91,12.16-22.83,21.95-5.53,8.76-12.62,20.57-16.32,26.79-.41.69-.77,1.3-1.09,1.84l-.49.84c-1.49,2.53-3.23,5.49-4.21,8.95,3.98,1.9,8.52,2.65,12.71,2.91.27-.77.64-1.56,1.07-2.38.48-.94,1.05-1.9,1.63-2.89l.49-.84c.96-1.62,2.38-3.99,4.05-6.78,3.82-6.36,8.98-14.88,13.19-21.55l.07-.11c5.02-8.31,9.2-13.45,16.91-16.81l.11-.05c6.57-2.7,10.54-2.74,18.43-2.81.87-.01,1.78-.02,2.69-.03l1.99-.02c9.17-.06,20.13-.14,29.01-.07,2.26.01,4.39.04,6.32.08h.12s.11,0,.11,0c1.25-.01,2.91.11,4.61.46,1.03.22,2.08.52,3.05.93.21-.35.41-.71.62-1.06l.39-.68c1.92-3.33,3.79-6.57,4.97-9.82-4.08-1.92-8.7-2.76-12.89-2.82Z\"/><path fill=\"currentColor\" stroke=\"currentColor\" stroke-miterlimit=\"10\" d=\"M115.07,11.81c-9.7-.19-24.07-.09-35.62-.01h-1.99c-.93.03-1.82.04-2.67.04-8.36.08-14.4.14-23.33,3.83l-.27.12c-10.76,4.67-16.91,12.16-22.83,21.95-6.13,9.71-14.19,23.21-17.41,28.63l-.5.84c-2.08,3.55-4.68,7.97-4.94,13.39v.2s0,.21,0,.21c.01.81.06,1.61.15,2.38.14.15.29.3.44.45,1.53,1.47,3.28,2.63,5.15,3.52,3.98,1.9,8.52,2.65,12.71,2.91,1.41.09,2.78.12,4.08.12.55,0,1.09-.01,1.61-.01h1.95c4.95.01,10.57.03,14.94-.83,8.48-1.38,12.74-7.5,16.17-12.42.88-1.28,1.72-2.48,2.58-3.54l.14-.18c2.21-2.92,4.95-4.44,8.17-4.49l.35-.02c2.47-.17,5.14-.16,7.95-.14,8.71.05,18.58.1,26.92-5.76,5.91-4.04,8.82-8.74,12.18-14.18l.86-1.39c1.74-2.86,3.87-6.45,5.95-10.03.21-.35.41-.71.62-1.06l.39-.68c1.92-3.33,3.79-6.57,4.97-9.82.82-2.26,1.31-4.53,1.25-6.84-5.18-5.29-13.22-7.25-19.97-7.19ZM122.56,40.37l-.39.67c-2.21,3.81-4.55,7.77-6.39,10.79l-.84,1.36c-3.01,4.87-4.83,7.81-8.48,10.29l-.1.07c-4.94,3.49-11.95,3.45-19.38,3.41-2.88-.02-5.87-.04-8.79.16-7.1.19-13.51,3.58-18.07,9.57-1.13,1.4-2.12,2.83-3.08,4.21-2.92,4.18-4.71,6.57-7.64,7.02l-.31.06c-3.09.63-8.28.61-12.45.6h-2.16c-3.85.07-7.01-.16-9.45-.69-2.24-.48-3.87-1.22-4.89-2.2-.66-.64-1.54-1.81-1.63-4.65.11-1.35.71-2.82,1.52-4.35.48-.94,1.05-1.9,1.63-2.89l.49-.84c3.17-5.33,11.19-18.75,17.24-28.33l.07-.11c5.02-8.32,9.2-13.45,16.92-16.81l.1-.05c6.57-2.7,10.54-2.74,18.43-2.82.87,0,1.78,0,2.69-.03h1.94c11.52-.09,25.86-.19,35.38,0h.23c1.25-.01,2.92.11,4.61.46,3.15.66,6.4,2.12,7.27,5.02.2,1.2-.89,3.62-2.27,6.18-.7,1.31-1.48,2.65-2.2,3.9ZM120.07,23.01c-9.68-.19-24.03-.09-35.57-.01l-2.04.02c-.93.01-1.82.02-2.67.03-8.36.08-14.4.13-23.33,3.82l-.27.12c-10.76,4.68-16.91,12.16-22.83,21.95-5.53,8.76-12.62,20.57-16.32,26.79-.78-.35-1.41-.77-1.9-1.24-.66-.64-1.54-1.81-1.63-4.65.18-2.18,1.62-4.64,3.15-7.25l.49-.83c3.17-5.32,11.18-18.73,17.24-28.33l.07-.12c5.02-8.31,9.2-13.45,16.92-16.81l.1-.04c6.57-2.7,10.54-2.74,18.43-2.82.87-.01,1.78-.01,2.69-.03h1.99c11.5-.09,25.82-.19,35.33,0h.23c3.57-.04,10.55,1.02,11.88,5.48.14.84-.35,2.27-1.13,3.93-.28,0-.56,0-.83,0Z\"/><path fill=\"currentColor\" stroke=\"currentColor\" stroke-miterlimit=\"10\" d=\"M134.68,16.09l-.06-.23c-3.07-11.45-15.08-15.33-24.55-15.25-9.68-.19-24.03-.09-35.57-.01h-2.04c-.93.03-1.82.04-2.67.04-8.36.08-14.4.14-23.33,3.83l-.27.12c-10.76,4.67-16.91,12.16-22.83,21.95-6.14,9.73-14.2,23.22-17.41,28.62l-.49.85c-2.09,3.55-4.69,7.96-4.95,13.39v.2s0,.21,0,.21c.09,5.57,1.82,10.13,5.15,13.58.14.15.29.3.44.45,1.53,1.47,3.28,2.63,5.15,3.52,3.98,1.9,8.52,2.65,12.71,2.91,1.41.09,2.78.12,4.08.12.55,0,1.09-.01,1.61-.01h1.95c4.95.01,10.57.03,14.94-.83,8.48-1.38,12.74-7.5,16.17-12.42.88-1.28,1.72-2.48,2.58-3.54l.14-.18c2.21-2.92,4.95-4.44,8.17-4.49l.35-.02c2.47-.17,5.14-.16,7.95-.14,8.71.05,18.58.1,26.92-5.76,5.91-4.04,8.82-8.74,12.18-14.18l.86-1.39c1.74-2.86,3.87-6.45,5.95-10.03.21-.35.41-.71.62-1.06l.39-.68c1.92-3.33,3.79-6.57,4.97-9.82.82-2.26,1.31-4.53,1.25-6.84-.02-.96-.14-1.93-.36-2.91ZM119.76,25.27c-.7,1.31-1.48,2.65-2.2,3.9l-.39.67c-1.19,2.04-2.41,4.13-3.57,6.09-1.01,1.7-1.97,3.31-2.82,4.7l-.84,1.36c-3.01,4.87-4.83,7.81-8.48,10.29l-.1.07c-4.94,3.49-11.96,3.45-19.38,3.41-2.89-.02-5.87-.04-8.79.16-7.1.18-13.51,3.58-18.07,9.57-1.13,1.4-2.12,2.83-3.08,4.21-2.92,4.18-4.71,6.57-7.64,7.02l-.31.06c-3.09.63-8.27.61-12.45.6h-2.16c-3.85.07-7.01-.16-9.45-.69-1.16-.25-2.16-.57-2.99-.96-.78-.35-1.41-.77-1.9-1.24-.66-.64-1.54-1.81-1.63-4.65.18-2.18,1.62-4.64,3.15-7.25l.49-.83c3.17-5.32,11.18-18.73,17.24-28.33l.07-.12c5.02-8.31,9.2-13.45,16.92-16.81l.1-.04c6.57-2.7,10.54-2.74,18.43-2.82.87-.01,1.78-.01,2.69-.03h1.99c11.5-.09,25.82-.19,35.33,0h.23c3.57-.04,10.55,1.02,11.88,5.48.14.84-.35,2.27-1.13,3.93-.34.72-.73,1.48-1.14,2.25Z\"/></svg>",
      "palm": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>PaLM</title><path d=\"M12 22.926c.928 0 1.679-.752 1.679-1.68V6.696h-3.358v14.552c0 .927.751 1.679 1.679 1.679z\" fill=\"#F9AB00\"></path><path d=\"M18.69 12.005A5.819 5.819 0 0012 10.904l7.188 7.188c.296.296.807.179.933-.22a5.815 5.815 0 00-1.431-5.867z\" fill=\"#5BB974\"></path><path d=\"M5.31 12.005A5.819 5.819 0 0112 10.904l-7.188 7.188a.562.562 0 01-.933-.22 5.815 5.815 0 011.431-5.867z\" fill=\"#129EAF\"></path><path d=\"M18.157 6.426c-2.86 0-5.288 1.875-6.157 4.478h11.367a.629.629 0 00.565-.908c-1.08-2.12-3.26-3.57-5.775-3.57z\" fill=\"#AF5CF7\"></path><path d=\"M13.188 3.384c-2.023 2.024-2.414 5.064-1.188 7.52l8.038-8.039a.629.629 0 00-.242-1.042c-2.264-.735-4.83-.217-6.608 1.561z\" fill=\"#FF8BCB\"></path><path d=\"M10.812 3.384c2.023 2.024 2.414 5.064 1.188 7.52L3.962 2.865a.629.629 0 01.242-1.042c2.264-.735 4.83-.217 6.608 1.561z\" fill=\"#FA7B17\"></path><path d=\"M5.843 6.426c2.86 0 5.288 1.875 6.157 4.478H.633a.629.629 0 01-.565-.908c1.08-2.12 3.26-3.57 5.775-3.57z\" fill=\"#4285F4\"></path></svg>",
      "perplexity": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Perplexity</title><path d=\"M19.785 0v7.272H22.5V17.62h-2.935V24l-7.037-6.194v6.145h-1.091v-6.152L4.392 24v-6.465H1.5V7.188h2.884V0l7.053 6.494V.19h1.09v6.49L19.786 0zm-7.257 9.044v7.319l5.946 5.234V14.44l-5.946-5.397zm-1.099-.08l-5.946 5.398v7.235l5.946-5.234V8.965zm8.136 7.58h1.844V8.349H13.46l6.105 5.54v2.655zm-8.982-8.28H2.59v8.195h1.8v-2.576l6.192-5.62zM5.475 2.476v4.71h5.115l-5.115-4.71zm13.219 0l-5.115 4.71h5.115v-4.71z\" fill=\"#22B8CD\" fill-rule=\"nonzero\"></path></svg>",
      "pi": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 800 800\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Pi</title><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M165.29 165.29H517.36V400H400V517.36H282.65V634.72H165.29ZM282.65 282.65V400H400V282.65Z\"/><path fill=\"currentColor\" d=\"M517.36 400H634.72V634.72H517.36Z\"/></svg>",
      "qwen": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Qwen</title><path d=\"M12.604 1.34c.393.69.784 1.382 1.174 2.075a.18.18 0 00.157.091h5.552c.174 0 .322.11.446.327l1.454 2.57c.19.337.24.478.024.837-.26.43-.513.864-.76 1.3l-.367.658c-.106.196-.223.28-.04.512l2.652 4.637c.172.301.111.494-.043.77-.437.785-.882 1.564-1.335 2.34-.159.272-.352.375-.68.37-.777-.016-1.552-.01-2.327.016a.099.099 0 00-.081.05 575.097 575.097 0 01-2.705 4.74c-.169.293-.38.363-.725.364-.997.003-2.002.004-3.017.002a.537.537 0 01-.465-.271l-1.335-2.323a.09.09 0 00-.083-.049H4.982c-.285.03-.553-.001-.805-.092l-1.603-2.77a.543.543 0 01-.002-.54l1.207-2.12a.198.198 0 000-.197 550.951 550.951 0 01-1.875-3.272l-.79-1.395c-.16-.31-.173-.496.095-.965.465-.813.927-1.625 1.387-2.436.132-.234.304-.334.584-.335a338.3 338.3 0 012.589-.001.124.124 0 00.107-.063l2.806-4.895a.488.488 0 01.422-.246c.524-.001 1.053 0 1.583-.006L11.704 1c.341-.003.724.032.9.34zm-3.432.403a.06.06 0 00-.052.03L6.254 6.788a.157.157 0 01-.135.078H3.253c-.056 0-.07.025-.041.074l5.81 10.156c.025.042.013.062-.034.063l-2.795.015a.218.218 0 00-.2.116l-1.32 2.31c-.044.078-.021.118.068.118l5.716.008c.046 0 .08.02.104.061l1.403 2.454c.046.081.092.082.139 0l5.006-8.76.783-1.382a.055.055 0 01.096 0l1.424 2.53a.122.122 0 00.107.062l2.763-.02a.04.04 0 00.035-.02.041.041 0 000-.04l-2.9-5.086a.108.108 0 010-.113l.293-.507 1.12-1.977c.024-.041.012-.062-.035-.062H9.2c-.059 0-.073-.026-.043-.077l1.434-2.505a.107.107 0 000-.114L9.225 1.774a.06.06 0 00-.053-.031zm6.29 8.02c.046 0 .058.02.034.06l-.832 1.465-2.613 4.585a.056.056 0 01-.05.029.058.058 0 01-.05-.029L8.498 9.841c-.02-.034-.01-.052.028-.054l.216-.012 6.722-.012z\" fill=\"url(#lobe-icons-qwen-fill)\" fill-rule=\"nonzero\"></path><defs><linearGradient id=\"lobe-icons-qwen-fill\" x1=\"0%\" x2=\"100%\" y1=\"0%\" y2=\"0%\"><stop offset=\"0%\" stop-color=\"#6336E7\" stop-opacity=\".84\"></stop><stop offset=\"100%\" stop-color=\"#6F69F7\" stop-opacity=\".84\"></stop></linearGradient></defs></svg>",
      "soleapi": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 417 417\"><title>SoleAPI</title><path fill=\"currentColor\" d=\"M213 22C227 20 250 34 263 40C274 45 285 51 296 56C306 61 316 65 327 71C333 74 338 82 330 88C325 90 319 90 314 91C301 94 288 97 275 99C267 101 259 102 250 105C243 107 237 111 230 115L212 125C199 132 186 140 174 147C166 151 158 156 150 161C148 162 146 164 144 165C141 168 139 172 138 177C137 183 137 199 137 207L137 250C137 257 138 263 133 269C128 277 115 276 107 274C99 272 92 268 85 266C73 261 60 257 50 249C45 245 41 239 41 232C40 226 40 221 40 215L40 186L40 155C40 147 40 139 41 130C44 108 65 99 83 90C99 81 115 72 131 63L175 39L189 32C197 27 203 23 213 22Z\"/><path fill=\"currentColor\" d=\"M204 395C190 397 167 384 154 377C143 372 132 367 121 362C111 357 101 353 90 347C84 343 79 336 87 329C92 327 98 327 103 326C116 323 129 321 142 318C150 316 158 316 167 313C174 310 180 306 187 303L205 292C218 285 231 278 243 271C251 266 259 261 267 257C269 256 271 254 273 252C276 249 278 245 279 241C280 235 280 218 280 211L280 168C280 161 279 154 284 148C289 141 302 141 310 143C318 145 325 149 332 152C344 157 357 161 367 168C372 172 376 179 376 185C377 191 377 197 377 203L377 232L377 263C377 271 377 279 376 287C373 310 352 318 334 328C318 337 302 346 286 354L242 378L228 386C220 391 214 394 204 395Z\"/></svg>",
      "stability": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Stability</title><path d=\"M7.223 21c4.252 0 7.018-2.22 7.018-5.56 0-2.59-1.682-4.236-4.69-4.918l-1.93-.571c-1.694-.375-2.683-.825-2.45-1.975.194-.957.773-1.497 2.122-1.497 4.285 0 5.873 1.497 5.873 1.497v-3.6S11.62 3 7.293 3C3.213 3 1 5.07 1 8.273c0 2.59 1.534 4.097 4.645 4.812l.334.083c.473.144 1.112.335 1.916.572 1.59.375 1.999.773 1.999 1.966 0 1.09-1.15 1.71-2.67 1.71C2.841 17.416 1 15.231 1 15.231v3.989S2.152 21 7.223 21z\" fill=\"url(#lobe-icons-stability-fill)\"></path><path d=\"M20.374 20.73c1.505 0 2.626-1.073 2.626-2.526 0-1.484-1.089-2.526-2.626-2.526-1.505 0-2.594 1.042-2.594 2.526 0 1.484 1.089 2.526 2.594 2.526z\" fill=\"#E80000\"></path><defs><linearGradient id=\"lobe-icons-stability-fill\" x1=\"50%\" x2=\"50%\" y1=\"0%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#9D39FF\"></stop><stop offset=\"100%\" stop-color=\"#A380FF\"></stop></linearGradient></defs></svg>",
      "tencent": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Tencent</title><path d=\"M9.976 1L24 9.8l-10.587.015L10.723 23H5.489L8.18 9.8H3.244L1 5.4h8.077L9.976 1z\" fill=\"#0052D9\" fill-rule=\"evenodd\"></path></svg>",
      "vercel": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Vercel</title><path d=\"M12 0l12 20.785H0L12 0z\"></path></svg>",
      "wenxin": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Wenxin</title><path d=\"M11.32 1.176a1.4 1.4 0 011.36 0l8.64 4.843c.421.234.68.67.68 1.141v9.68c0 .472-.259.908-.68 1.143l-8.64 4.84a1.4 1.4 0 01-1.36 0l-8.64-4.84A1.31 1.31 0 012 16.84V7.159c0-.471.259-.907.68-1.142l8.64-4.84zm7.42 13.839V8.227L12.002 12 12 19.551l6.059-3.394a1.31 1.31 0 00.68-1.142zM12.68 4.833a1.393 1.393 0 00-1.36 0L5.944 7.846c-.421.235-.68.67-.68 1.142v6.027c0 .47.259.905.68 1.142l2.795 1.566V11.09a1.546 1.546 0 00.221.79 1.527 1.527 0 01-.216-.834l.004-.094.02-.15.018-.084.017-.062.039-.117.062-.142.035-.065.081-.13.094-.122.084-.091.08-.075.125-.1.071-.048.134-.076 5.87-3.29-2.796-1.566z\" fill=\"url(#lobe-icons-wenxin-fill)\"></path><path d=\"M12 11.088c0-.875-.73-1.584-1.631-1.584a1.66 1.66 0 00-.855.237c-.027.016-.055.033-.08.05a2.361 2.361 0 00-.123.093c-.022.02-.045.038-.066.059l-.048.045-.063.067c-.014.016-.028.031-.04.048a2.303 2.303 0 00-.094.125l-.042.069a1.7 1.7 0 00-.07.13l-.036.081a.764.764 0 00-.022.06c-.01.03-.02.058-.028.087l-.017.062a.883.883 0 00-.03.16c-.002.025-.007.05-.008.074a1.527 1.527 0 00.213.929c.302.508.85.792 1.414.792.277 0 .558-.068.814-.212l.815-.457v-.914L12 11.088z\" fill=\"#012F8D\"></path><defs><linearGradient id=\"lobe-icons-wenxin-fill\" x1=\"9.155%\" x2=\"90.531%\" y1=\"75.177%\" y2=\"25.028%\"><stop offset=\"0%\" stop-color=\"#0A51C3\"></stop><stop offset=\"100%\" stop-color=\"#23A4FB\"></stop></linearGradient></defs></svg>",
      "xai": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Grok</title><path d=\"M6.469 8.776L16.512 23h-4.464L2.005 8.776H6.47zm-.004 7.9l2.233 3.164L6.467 23H2l4.465-6.324zM22 2.582V23h-3.659V7.764L22 2.582zM22 1l-9.952 14.095-2.233-3.163L17.533 1H22z\"></path></svg>",
      "xiaomimimo": "<svg fill=\"currentColor\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 152 132\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Logo</title><g transform=\"translate(10 58)\"><path d=\"M64.9008 0.00138769C64.6875 -0.00400695 64.4753 0.0339904 64.2771 0.113075C64.0789 0.192159 63.8988 0.310682 63.7478 0.461454C63.5968 0.612226 63.478 0.792105 63.3985 0.990178C63.3191 1.18825 63.2808 1.40039 63.2858 1.61373C63.2858 2.04553 63.4574 2.45964 63.7627 2.76497C64.068 3.0703 64.4821 3.24183 64.9139 3.24183C65.3457 3.24183 65.7599 3.0703 66.0652 2.76497C66.3705 2.45964 66.542 2.04553 66.542 1.61373C66.5473 1.39811 66.5082 1.18371 66.4271 0.983812C66.3461 0.783917 66.2249 0.602783 66.0711 0.451629C65.9172 0.300476 65.734 0.182523 65.5327 0.105076C65.3314 0.027629 65.1163 -0.00766247 64.9008 0.00138769Z\"></path><path d=\"M66.1689 4.55469H63.6296V15.7255H66.1689V4.55469Z\"></path><path d=\"M38.8643 4.06641C35.3586 4.06641 33.0872 6.76065 33.0872 10.0326C33.0872 13.3045 35.3717 16.0014 38.8643 16.0014C42.3568 16.0014 44.6414 13.3072 44.6414 10.0326C44.6414 6.75802 42.3673 4.06641 38.8643 4.06641ZM38.8643 13.6932C37.0261 13.6932 35.5844 12.3408 35.5844 10.0326C35.5844 7.72437 37.0261 6.37463 38.8643 6.37463C40.7025 6.37463 42.1415 7.727 42.1415 10.0326C42.1415 12.3382 40.7025 13.6932 38.8643 13.6932Z\"></path><path d=\"M17.7909 0.000890693C17.5765 -0.00632181 17.3629 0.0303305 17.1631 0.108601C16.9634 0.186872 16.7817 0.305111 16.6293 0.456073C16.4768 0.607034 16.3568 0.787536 16.2766 0.986515C16.1964 1.18549 16.1577 1.39876 16.1628 1.61323C16.1628 2.04503 16.3343 2.45914 16.6397 2.76447C16.945 3.0698 17.3591 3.24133 17.7909 3.24133C18.2227 3.24133 18.6368 3.0698 18.9421 2.76447C19.2475 2.45914 19.419 2.04503 19.419 1.61323C19.4241 1.39876 19.3854 1.18549 19.3052 0.986515C19.225 0.787536 19.105 0.607034 18.9525 0.456073C18.8001 0.305111 18.6184 0.186872 18.4187 0.108601C18.2189 0.0303305 18.0053 -0.00632181 17.7909 0.000890693Z\"></path><path d=\"M11.7564 15.7252L0.359741 1.61328H3.51615L15.1124 15.7252H11.7564Z\"></path><path d=\"M3.35861 15.7252L14.7527 1.61328H11.5963L0 15.7252H3.35861Z\"></path><path d=\"M19.0618 4.55469H16.5225V15.7255H19.0618V4.55469Z\"></path><path d=\"M26.5905 3.78906C24.5055 3.78906 23.0454 4.31426 21.7009 5.36464L22.6988 7.20282C23.6328 6.41651 24.8055 5.96948 26.0259 5.93448C27.7354 5.93448 28.7543 6.82993 28.7543 8.38975H26.8347C23.0139 8.38975 20.9184 10.2699 21.1442 12.8539C21.4068 15.921 24.6158 16.005 24.9808 16.005C26.5563 16.005 28.0321 15.4799 28.7543 14.5214V15.7188H31.2936V8.37662C31.2936 7.12404 30.7001 3.78906 26.5905 3.78906ZM28.7543 11.1418C28.7231 11.8658 28.4128 12.5496 27.8885 13.05C27.3642 13.5503 26.6666 13.8282 25.9419 13.8255C24.7392 13.8255 23.9304 13.2504 23.8411 12.3366C23.7518 11.4227 24.5921 10.2831 27.5174 10.2831H28.7569L28.7543 11.1418Z\"></path><path d=\"M57.7238 4.11087C57.0499 4.09158 56.3837 4.25893 55.7989 4.59444C55.2141 4.92994 54.7334 5.42054 54.4099 6.01207C53.7954 4.64394 52.7923 4.11087 51.6868 4.11087C51.1688 4.13165 50.6626 4.2713 50.2072 4.51901C49.7519 4.76672 49.3596 5.11585 49.0608 5.5394V4.55203H46.5215V15.7255H49.0608V9.11859C49.0608 8.25464 49.0608 6.40071 50.8044 6.40071C52.5481 6.40071 52.5481 8.25465 52.5481 8.72732V15.7255H55.0139V8.72732C55.0139 8.25465 55.0139 6.40071 56.7575 6.40071C58.5011 6.40071 58.5038 8.25464 58.5038 9.11859V15.7255H61.0404V8.4017C61.0536 5.3976 59.6093 4.11087 57.7238 4.11087Z\"></path><path d=\"M73.7449 15.9987C73.4083 15.998 73.0857 15.8638 72.8479 15.6256C72.6101 15.3873 72.4766 15.0644 72.4766 14.7278V7.165C72.4914 6.83757 72.632 6.52848 72.869 6.30203C73.1059 6.07559 73.4211 5.94922 73.7488 5.94922C74.0766 5.94922 74.3918 6.07559 74.6287 6.30203C74.8657 6.52848 75.0062 6.83757 75.0211 7.165V14.7278C75.0208 14.895 74.9875 15.0606 74.9232 15.215C74.8588 15.3693 74.7647 15.5095 74.6462 15.6276C74.5277 15.7456 74.3871 15.8391 74.2325 15.9028C74.0778 15.9665 73.9122 15.9991 73.7449 15.9987Z\"></path><path d=\"M87.3607 15.9993C87.0234 15.9993 86.6998 15.8655 86.4611 15.6272C86.2223 15.389 86.0878 15.0657 86.0871 14.7284V4.67881L81.4654 9.45281C81.2304 9.69657 80.9081 9.83697 80.5695 9.84312C80.231 9.84928 79.9038 9.72069 79.6601 9.48563C79.4163 9.25058 79.2759 8.92832 79.2697 8.58976C79.2667 8.42211 79.2967 8.25551 79.358 8.09947C79.4194 7.94342 79.5108 7.80098 79.6272 7.68028L86.4469 0.661082C86.6229 0.478921 86.8494 0.35354 87.0973 0.301033C87.3451 0.248526 87.603 0.271291 87.8378 0.366403C88.0727 0.461516 88.2737 0.624637 88.4151 0.834827C88.5566 1.04502 88.632 1.29268 88.6317 1.54603V14.7284C88.6317 15.0655 88.4978 15.3887 88.2594 15.6271C88.021 15.8654 87.6978 15.9993 87.3607 15.9993Z\"></path><path d=\"M80.5514 9.82621C80.3824 9.82749 80.2149 9.79518 80.0584 9.73117C79.902 9.66716 79.7599 9.57272 79.6402 9.45332L72.8337 2.4315C72.599 2.18948 72.4701 1.86414 72.4752 1.52705C72.4804 1.18996 72.6193 0.868726 72.8613 0.634023C73.1033 0.399319 73.4287 0.270369 73.7658 0.27554C74.1028 0.280711 74.4241 0.419579 74.6588 0.661595L81.4653 7.66767C81.6389 7.84735 81.7558 8.07413 81.8015 8.31977C81.8472 8.56541 81.8196 8.81906 81.7222 9.04914C81.6248 9.27922 81.4618 9.47557 81.2537 9.61374C81.0455 9.75191 80.8013 9.8258 80.5514 9.82621Z\"></path><path d=\"M98.3029 15.9992C97.9659 15.9992 97.6426 15.8653 97.4042 15.627C97.1659 15.3886 97.032 15.0654 97.032 14.7283V7.1655C97.032 6.82842 97.1659 6.50514 97.4042 6.26679C97.6426 6.02844 97.9659 5.89453 98.3029 5.89453C98.64 5.89453 98.9633 6.02844 99.2017 6.26679C99.44 6.50514 99.5739 6.82842 99.5739 7.1655V14.7283C99.5739 15.0654 99.44 15.3886 99.2017 15.627C98.9633 15.8653 98.64 15.9992 98.3029 15.9992Z\"></path><path d=\"M111.916 16.0004C111.579 16.0004 111.256 15.8664 111.017 15.6281C110.779 15.3897 110.645 15.0665 110.645 14.7294V4.67982L106.023 9.45382C105.788 9.69584 105.467 9.83457 105.129 9.83949C104.792 9.84442 104.466 9.71513 104.224 9.48008C103.982 9.24503 103.844 8.92346 103.839 8.58613C103.834 8.24879 103.963 7.92331 104.198 7.6813L111.005 0.662093C111.181 0.483575 111.407 0.361405 111.653 0.311007C111.899 0.260609 112.155 0.284243 112.387 0.378925C112.62 0.473608 112.819 0.635093 112.96 0.842994C113.101 1.05089 113.177 1.29589 113.179 1.54704V14.7294C113.178 15.0649 113.045 15.3866 112.809 15.6246C112.572 15.8625 112.251 15.9976 111.916 16.0004Z\"></path><path d=\"M105.109 9.82618C104.94 9.82746 104.773 9.79516 104.616 9.73115C104.46 9.66713 104.318 9.57269 104.198 9.45329L97.3917 2.43147C97.2687 2.31326 97.1708 2.1715 97.1037 2.01463C97.0367 1.85777 97.0019 1.68901 97.0015 1.51842C97.001 1.34783 97.0349 1.1789 97.1012 1.02169C97.1674 0.864476 97.2646 0.722207 97.387 0.603357C97.5093 0.484507 97.6544 0.391509 97.8135 0.329905C97.9725 0.268302 98.1424 0.239353 98.3129 0.244785C98.4834 0.250217 98.6511 0.289918 98.8059 0.361522C98.9607 0.433126 99.0996 0.535168 99.2141 0.661566L106.023 7.66764C106.197 7.84732 106.314 8.0741 106.359 8.31974C106.405 8.56538 106.378 8.81903 106.28 9.04911C106.183 9.27919 106.02 9.47554 105.812 9.61371C105.603 9.75189 105.359 9.82577 105.109 9.82618Z\"></path><path d=\"M92.8305 15.9997C92.4935 15.9997 92.1702 15.8658 91.9318 15.6274C91.6935 15.3891 91.5596 15.0658 91.5596 14.7287V1.54636C91.5596 1.20928 91.6935 0.886001 91.9318 0.647648C92.1702 0.409296 92.4935 0.275391 92.8305 0.275391C93.1676 0.275391 93.4909 0.409296 93.7292 0.647648C93.9676 0.886001 94.1015 1.20928 94.1015 1.54636V14.7287C94.1015 14.8956 94.0686 15.0609 94.0048 15.2151C93.9409 15.3693 93.8473 15.5094 93.7292 15.6274C93.6112 15.7454 93.4711 15.839 93.3169 15.9029C93.1627 15.9668 92.9974 15.9997 92.8305 15.9997Z\"></path><path d=\"M123.42 15.9814C122.03 15.9865 120.663 15.6287 119.454 14.9433C118.244 14.2579 117.235 13.2687 116.525 12.0735C115.815 10.8783 115.43 9.5185 115.407 8.12863C115.384 6.73875 115.724 5.36692 116.393 4.1488C116.561 3.86356 116.833 3.65487 117.152 3.56707C117.471 3.47927 117.811 3.51928 118.101 3.67859C118.391 3.8379 118.608 4.10397 118.704 4.42026C118.801 4.73656 118.771 5.07816 118.62 5.3725C118.053 6.40664 117.836 7.59693 118.003 8.76468C118.169 9.93243 118.71 11.0147 119.544 11.8489C120.378 12.6831 121.46 13.2244 122.628 13.3914C123.795 13.5584 124.986 13.3421 126.02 12.7751C126.315 12.6125 126.663 12.5738 126.987 12.6676C127.311 12.7614 127.584 12.98 127.747 13.2753C127.909 13.5706 127.948 13.9184 127.854 14.2422C127.76 14.566 127.542 14.8393 127.246 15.0019C126.074 15.6455 124.758 15.9824 123.42 15.9814Z\"></path><path d=\"M129.287 12.5052C129.071 12.5044 128.86 12.4484 128.672 12.3424C128.378 12.1795 128.159 11.9066 128.066 11.5833C127.972 11.26 128.009 10.9126 128.171 10.6171C128.738 9.58297 128.955 8.39268 128.788 7.22493C128.622 6.05718 128.081 4.97496 127.247 4.14073C126.413 3.30649 125.331 2.76525 124.163 2.59825C122.996 2.43125 121.805 2.64749 120.771 3.21452C120.624 3.30059 120.462 3.3564 120.293 3.37863C120.125 3.40087 119.954 3.38908 119.79 3.34397C119.626 3.29886 119.473 3.22134 119.339 3.116C119.206 3.01066 119.095 2.87964 119.013 2.73069C118.931 2.58174 118.88 2.41788 118.863 2.24882C118.845 2.07975 118.862 1.90891 118.912 1.7464C118.962 1.58389 119.044 1.43301 119.153 1.3027C119.262 1.17238 119.396 1.06527 119.547 0.987704C121.064 0.155491 122.809 -0.162266 124.522 0.0821474C126.234 0.326561 127.822 1.11995 129.045 2.34319C130.268 3.56642 131.061 5.15347 131.306 6.86604C131.55 8.5786 131.232 10.3242 130.4 11.8408C130.291 12.0411 130.13 12.2084 129.934 12.3253C129.739 12.4422 129.515 12.5043 129.287 12.5052Z\"></path></g></svg>",
      "yi": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Yi</title><path d=\"M18.62 13.927c.611 0 1.107.505 1.107 1.128v5.817c0 .623-.496 1.128-1.108 1.128a1.118 1.118 0 01-1.108-1.128v-5.817c0-.623.496-1.128 1.108-1.128zM16.59 3.052a1.094 1.094 0 011.562-.129c.466.404.522 1.116.126 1.59l-5.938 7.111v9.147c0 .624-.496 1.129-1.108 1.129a1.118 1.118 0 01-1.108-1.129v-9.477l.003-.088.01-.087c.015-.232.102-.462.261-.654l6.192-7.413zM2.906 2.256a1.094 1.094 0 011.559.157l4.387 5.45a1.142 1.142 0 01-.155 1.587 1.094 1.094 0 01-1.559-.157l-4.387-5.45a1.144 1.144 0 01.06-1.498l.095-.09z\"></path><ellipse cx=\"20.146\" cy=\"10.692\" fill=\"#00FF25\" rx=\"1.354\" ry=\"1.379\"></ellipse></svg>",
      "zeroone": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>01.AI</title><path d=\"M5.246 12c0 .837-.086 1.554-.257 2.151-.172.598-.45 1.055-.837 1.373-.386.317-.898.476-1.534.476-.901 0-1.563-.353-1.985-1.059C.211 14.235 0 13.255 0 12c0-.837.086-1.554.257-2.151.172-.598.45-1.055.832-1.373C1.472 8.16 1.981 8 2.618 8c.894 0 1.555.351 1.985 1.053.429.702.643 1.685.643 2.947zm-3.883 0c0 .956.09 1.668.273 2.134.183.467.51.7.982.7.465 0 .792-.23.981-.694.19-.463.285-1.176.285-2.14 0-.956-.095-1.668-.285-2.134-.19-.467-.516-.7-.981-.7-.472 0-.8.233-.982.7-.182.466-.273 1.178-.273 2.134zm8.52 3.771H8.517l.011-6.295-1.823.324V8.571l2.04-.457h1.136v7.657zm2.497-1.6h.543c.3 0 .543.256.543.572v.571a.558.558 0 01-.543.572h-.543a.558.558 0 01-.543-.572v-.571c0-.316.243-.572.543-.572zm10.317-6.057H24v7.772h-1.303V8.114zm-3.692 0l2.606 7.772h-1.303l-.69-2.058h-3.073l-.69 2.058h-1.303l2.606-7.772h1.847zm.191 4.457l-1.115-3.323-1.114 3.323h2.23z\"></path></svg>",
      "zhipu": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Zhipu</title><path d=\"M11.991 23.503a.24.24 0 00-.244.248.24.24 0 00.244.249.24.24 0 00.245-.249.24.24 0 00-.22-.247l-.025-.001zM9.671 5.365a1.697 1.697 0 011.099 2.132l-.071.172-.016.04-.018.054c-.07.16-.104.32-.104.498-.035.71.47 1.279 1.186 1.314h.366c1.309.053 2.338 1.173 2.286 2.523-.052 1.332-1.152 2.38-2.478 2.327h-.174c-.715.018-1.274.64-1.239 1.368 0 .124.018.23.053.337.209.373.54.658.96.8.75.23 1.517-.125 1.9-.782l.018-.035c.402-.64 1.17-.96 1.92-.711.854.284 1.378 1.226 1.099 2.167a1.661 1.661 0 01-2.077 1.102 1.711 1.711 0 01-.907-.711l-.017-.035c-.2-.323-.463-.58-.851-.711l-.056-.018a1.646 1.646 0 00-1.954.746 1.66 1.66 0 01-1.065.764 1.677 1.677 0 01-1.989-1.279c-.209-.906.332-1.83 1.257-2.043a1.51 1.51 0 01.296-.035h.018c.68-.071 1.151-.622 1.116-1.333a1.307 1.307 0 00-.227-.693 2.515 2.515 0 01-.366-1.403 2.39 2.39 0 01.366-1.208c.14-.195.21-.444.227-.693.018-.71-.506-1.261-1.186-1.332l-.07-.018a1.43 1.43 0 01-.299-.07l-.05-.019a1.7 1.7 0 01-1.047-2.114 1.68 1.68 0 012.094-1.101zm-5.575 10.11c.26-.264.639-.367.994-.27.355.096.633.379.728.74.095.362-.007.748-.267 1.013-.402.41-1.053.41-1.455 0a1.062 1.062 0 010-1.482zm14.845-.294c.359-.09.738.024.992.297.254.274.344.665.237 1.025-.107.36-.396.634-.756.718-.551.128-1.1-.22-1.23-.781a1.05 1.05 0 01.757-1.26zm-.064-4.39c.314.32.49.753.49 1.206 0 .452-.176.886-.49 1.206-.315.32-.74.5-1.185.5-.444 0-.87-.18-1.184-.5a1.727 1.727 0 010-2.412 1.654 1.654 0 012.369 0zm-11.243.163c.364.484.447 1.128.218 1.691a1.665 1.665 0 01-2.188.923c-.855-.36-1.26-1.358-.907-2.228a1.68 1.68 0 011.33-1.038c.593-.08 1.183.169 1.547.652zm11.545-4.221c.368 0 .708.2.892.524.184.324.184.724 0 1.048a1.026 1.026 0 01-.892.524c-.568 0-1.03-.47-1.03-1.048 0-.579.462-1.048 1.03-1.048zm-14.358 0c.368 0 .707.2.891.524.184.324.184.724 0 1.048a1.026 1.026 0 01-.891.524c-.569 0-1.03-.47-1.03-1.048 0-.579.461-1.048 1.03-1.048zm10.031-1.475c.925 0 1.675.764 1.675 1.706s-.75 1.705-1.675 1.705-1.674-.763-1.674-1.705c0-.942.75-1.706 1.674-1.706zm-2.626-.684c.362-.082.653-.356.761-.718a1.062 1.062 0 00-.238-1.028 1.017 1.017 0 00-.996-.294c-.547.14-.881.7-.752 1.257.13.558.675.907 1.225.783zm0 16.876c.359-.087.644-.36.75-.72a1.062 1.062 0 00-.237-1.019 1.018 1.018 0 00-.985-.301 1.037 1.037 0 00-.762.717c-.108.361-.017.754.239 1.028.245.263.606.377.953.305l.043-.01zM17.19 3.5a.631.631 0 00.628-.64c0-.355-.279-.64-.628-.64a.631.631 0 00-.628.64c0 .355.28.64.628.64zm-10.38 0a.631.631 0 00.628-.64c0-.355-.28-.64-.628-.64a.631.631 0 00-.628.64c0 .355.279.64.628.64zm-5.182 7.852a.631.631 0 00-.628.64c0 .354.28.639.628.639a.63.63 0 00.627-.606l.001-.034a.62.62 0 00-.628-.64zm5.182 9.13a.631.631 0 00-.628.64c0 .355.279.64.628.64a.631.631 0 00.628-.64c0-.355-.28-.64-.628-.64zm10.38.018a.631.631 0 00-.628.64c0 .355.28.64.628.64a.631.631 0 00.628-.64c0-.355-.279-.64-.628-.64zm5.182-9.148a.631.631 0 00-.628.64c0 .354.279.639.628.639a.631.631 0 00.628-.64c0-.355-.28-.64-.628-.64zm-.384-4.992a.24.24 0 00.244-.249.24.24 0 00-.244-.249.24.24 0 00-.244.249c0 .142.122.249.244.249zM11.991.497a.24.24 0 00.245-.248A.24.24 0 0011.99 0a.24.24 0 00-.244.249c0 .133.108.236.223.247l.021.001zM2.011 6.36a.24.24 0 00.245-.249.24.24 0 00-.244-.249.24.24 0 00-.244.249.24.24 0 00.244.249zm0 11.263a.24.24 0 00-.243.248.24.24 0 00.244.249.24.24 0 00.244-.249.252.252 0 00-.244-.248zm19.995-.018a.24.24 0 00-.245.248.24.24 0 00.245.25.24.24 0 00.244-.25.252.252 0 00-.244-.248z\" fill=\"#3859FF\" fill-rule=\"nonzero\"></path></svg>",
      "openrouter": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>OpenRouter</title><path d=\"M16.804 1.957l7.22 4.105v.087L16.73 10.21l.017-2.117-.821-.03c-1.059-.028-1.611.002-2.268.11-1.064.175-2.038.577-3.147 1.352L8.345 11.03c-.284.195-.495.336-.68.455l-.515.322-.397.234.385.23.53.338c.476.314 1.17.796 2.701 1.866 1.11.775 2.083 1.177 3.147 1.352l.3.045c.694.091 1.375.094 2.825.033l.022-2.159 7.22 4.105v.087L16.589 22l.014-1.862-.635.022c-1.386.042-2.137.002-3.138-.162-1.694-.28-3.26-.926-4.881-2.059l-2.158-1.5a21.997 21.997 0 00-.755-.498l-.467-.28a55.927 55.927 0 00-.76-.43C2.908 14.73.563 14.116 0 14.116V9.888l.14.004c.564-.007 2.91-.622 3.809-1.124l1.016-.58.438-.274c.428-.28 1.072-.726 2.686-1.853 1.621-1.133 3.186-1.78 4.881-2.059 1.152-.19 1.974-.213 3.814-.138l.02-1.907z\"></path></svg>",
      "rc": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 128 128\"><title>RightCode</title><path fill=\"#EA6C2C\" fill-rule=\"evenodd\" d=\"M 67.00 124.35 L 65.00 124.65 L 63.00 124.31 L 60.87 122.00 L 60.51 120.00 L 60.62 119.00 L 61.63 117.00 L 63.64 115.00 L 63.65 23.00 L 63.40 22.00 L 60.71 20.00 L 59.73 18.00 L 59.66 16.00 L 61.18 13.00 L 63.00 11.70 L 65.00 11.36 L 67.00 11.68 L 69.00 13.07 L 70.24 15.00 L 70.43 17.00 L 69.35 20.00 L 66.75 22.00 L 66.53 23.00 L 66.56 115.00 L 69.38 118.00 L 69.69 120.00 L 69.38 122.00 L 67.00 124.35 Z M 65.38 19.00 L 66.99 18.00 L 67.30 16.00 L 66.00 14.66 L 64.00 14.69 L 62.79 16.00 L 62.66 17.00 L 64.00 18.73 L 65.38 19.00 Z M 72.00 53.03 L 71.70 52.00 L 71.56 35.00 L 70.00 33.71 L 68.79 32.00 L 68.52 30.00 L 69.00 28.15 L 70.00 26.71 L 72.00 25.59 L 74.00 25.45 L 75.00 25.70 L 76.75 27.00 L 77.50 28.00 L 78.15 30.00 L 77.18 33.00 L 74.81 35.00 L 74.60 50.00 L 72.00 53.03 Z M 74.12 32.00 L 75.11 31.00 L 75.31 30.00 L 74.77 29.00 L 74.00 28.40 L 72.00 28.65 L 71.35 30.00 L 71.45 31.00 L 73.00 32.26 L 74.12 32.00 Z M 58.00 52.97 L 55.68 50.00 L 55.65 40.00 L 52.89 37.00 L 52.36 35.00 L 52.62 33.00 L 54.00 31.03 L 57.00 29.77 L 60.00 30.84 L 61.03 32.00 L 61.64 34.00 L 61.21 37.00 L 58.49 40.00 L 58.47 52.00 L 58.00 52.97 Z M 58.43 36.00 L 59.06 35.00 L 58.91 34.00 L 58.00 32.96 L 57.00 32.66 L 56.00 33.10 L 55.29 34.00 L 55.19 35.00 L 55.64 36.00 L 57.00 36.59 L 58.43 36.00 Z M 57.00 89.45 L 46.00 89.35 L 37.24 77.00 L 36.00 75.99 L 35.00 75.93 L 28.00 75.93 L 27.12 77.00 L 27.14 88.00 L 26.80 89.00 L 26.00 89.36 L 18.00 89.36 L 16.89 89.00 L 16.66 48.00 L 17.00 46.90 L 44.00 46.73 L 48.00 47.67 L 50.00 48.57 L 53.23 51.00 L 55.44 54.00 L 56.34 56.00 L 57.07 59.00 L 56.95 64.00 L 56.15 67.00 L 54.34 70.00 L 52.00 72.26 L 48.83 74.00 L 48.06 75.00 L 57.06 88.00 L 57.53 89.00 L 57.00 89.45 Z M 110.00 89.13 L 109.00 89.65 L 90.00 89.61 L 85.00 89.18 L 80.00 87.40 L 77.00 85.39 L 74.64 83.00 L 72.64 80.00 L 70.76 75.00 L 70.20 70.00 L 70.36 65.00 L 70.81 62.00 L 72.61 57.00 L 74.49 54.00 L 77.36 51.00 L 81.00 48.62 L 84.00 47.54 L 88.00 46.77 L 109.00 46.64 L 109.79 47.00 L 110.13 48.00 L 110.00 55.15 L 109.00 55.68 L 91.00 55.74 L 87.00 56.77 L 84.11 59.00 L 82.59 61.00 L 81.36 64.00 L 80.64 69.00 L 81.62 74.00 L 82.58 76.00 L 85.00 78.66 L 88.00 80.22 L 92.00 80.64 L 109.00 80.64 L 109.80 81.00 L 110.13 82.00 L 110.00 89.13 Z M 43.29 67.00 L 44.89 66.00 L 46.00 64.70 L 46.86 62.00 L 46.50 59.00 L 45.00 56.77 L 43.00 55.56 L 40.00 55.18 L 28.00 55.17 L 27.12 56.00 L 27.16 67.00 L 28.00 67.65 L 40.00 67.63 L 43.29 67.00 Z M 74.00 105.20 L 72.00 105.09 L 70.13 104.00 L 68.71 102.00 L 68.54 101.00 L 68.69 99.00 L 70.00 97.06 L 71.42 96.00 L 71.71 95.00 L 71.70 86.00 L 72.00 84.36 L 74.56 87.00 L 74.64 95.00 L 75.00 95.97 L 77.39 98.00 L 78.12 100.00 L 77.32 103.00 L 76.00 104.37 L 74.00 105.20 Z M 59.00 111.05 L 57.00 111.40 L 55.00 111.01 L 52.89 109.00 L 52.36 107.00 L 53.00 104.45 L 55.51 102.00 L 55.65 93.00 L 55.88 92.00 L 57.00 91.64 L 58.28 92.00 L 58.49 93.00 L 58.63 102.00 L 61.00 104.14 L 61.65 106.00 L 61.26 109.00 L 59.00 111.05 Z M 74.39 102.00 L 75.23 101.00 L 75.00 99.65 L 74.00 98.65 L 73.00 98.54 L 72.06 99.00 L 71.39 100.00 L 71.39 101.00 L 72.00 101.96 L 73.00 102.38 L 74.39 102.00 Z M 58.51 108.00 L 59.09 107.00 L 58.83 106.00 L 58.00 105.18 L 57.00 104.85 L 55.33 106.00 L 55.18 107.00 L 56.00 108.39 L 57.00 108.65 L 58.51 108.00 Z M 65.09 122.00 L 66.75 121.00 L 67.14 120.00 L 66.00 118.36 L 65.00 118.16 L 63.54 119.00 L 63.28 120.00 L 63.47 121.00 L 65.09 122.00 Z\"/></svg>",
      "lioncc": "<svg width=\"1em\" height=\"1em\" viewBox=\"0 0 160 168\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><title>LionCC</title><path d=\"M12.3027 68.5326C12.3027 76.0702 13.8104 83.534 16.7396 90.4978C19.6689 97.4617 23.9623 103.789 29.3749 109.119C34.7874 114.449 41.213 118.677 48.2848 121.561C55.3567 124.446 62.9362 125.93 70.5907 125.93C78.2451 125.93 85.8247 124.446 92.8965 121.561C99.9683 118.677 106.394 114.449 111.806 109.119C117.219 103.789 121.512 97.4617 124.442 90.4978C127.371 83.534 128.879 76.0702 128.879 68.5326C128.879 60.995 127.371 53.5312 124.442 46.5674C121.512 39.6036 117.219 33.2761 111.806 27.9462C106.394 22.6163 99.9683 18.3884 92.8965 15.5039C85.8247 12.6194 78.2451 11.1348 70.5907 11.1348C62.9362 11.1348 55.3567 12.6194 48.2848 15.5039C41.213 18.3884 34.7874 22.6163 29.3749 27.9462C23.9623 33.2761 19.6689 39.6036 16.7396 46.5674C13.8104 53.5312 12.3027 60.995 12.3027 68.5326Z\" fill=\"#F9DA3C\"/><path d=\"M21.1572 37.0684C39.4999 11.1724 63.3411 2.55958 83.2979 4.96484C102.259 7.25086 117.938 19.6579 120.65 36.459C120.929 36.5519 121.229 36.656 121.547 36.7734C123.228 37.3962 125.482 38.417 127.618 40.001C129.758 41.5881 131.885 43.8212 133.107 46.8779C134.348 49.9826 134.546 53.6657 133.258 57.9121C132.437 60.6201 132.995 62.347 134.216 63.873C135.642 65.6567 138.025 67.2154 141.144 69.0488C141.532 69.2768 141.922 69.5041 142.312 69.7305C144.984 71.2852 148.007 73.0438 150.495 75.1836C153.439 77.7153 155.939 81.0232 156.501 85.5986C157.136 90.7682 156.531 94.8379 155.056 98.0859C153.578 101.339 151.341 103.51 149.152 105.066C147.664 106.125 145.983 107.021 144.732 107.688C144.274 107.932 143.873 108.145 143.561 108.324C143.046 108.62 142.738 108.832 142.559 108.978C142.571 109.471 142.6 110.081 142.635 110.782C142.758 113.325 142.942 117.076 142.537 120.906C142.171 124.37 141.018 127.113 138.972 129.326C137.005 131.454 134.405 132.877 131.579 134.099C128.739 135.327 125.585 135.43 122.68 135.069C119.749 134.706 116.832 133.841 114.297 132.891C111.75 131.936 109.502 130.863 107.896 130.032C107.615 129.887 107.353 129.748 107.111 129.618C97.2577 137.65 91.91 143.235 87.6299 150.193C86.1069 152.669 84.7007 155.35 83.2725 158.419L80.3477 164.706L77.7725 158.269L77.7715 158.267L77.7666 158.254L77.7451 158.2L77.6523 157.974C77.569 157.773 77.4448 157.473 77.2812 157.09C76.8222 156.019 76.3464 154.955 75.8555 153.898C74.6232 151.243 72.8756 147.723 70.8018 144.222C68.7136 140.696 66.3662 137.312 63.958 134.847C61.4527 132.283 59.3871 131.23 57.8623 131.23C55.8059 131.23 53.1869 130.389 50.5078 129.182C47.7189 127.925 44.4965 126.103 41.1221 123.789C34.3774 119.166 26.8442 112.46 20.8008 104.093C14.7537 95.7207 10.1238 85.5778 9.40332 74.1357C8.67929 62.6458 11.9162 50.1148 21.1572 37.0684ZM82.5801 10.916C65.0323 8.80097 43.2555 16.2395 26.0488 40.5332C17.5156 52.5805 14.7564 63.7755 15.3857 73.7598C16.0169 83.7921 20.0886 92.8712 25.6592 100.584C31.2333 108.301 38.2351 114.543 44.5117 118.847C45.5639 119.569 46.6358 120.261 47.7266 120.924C42.6242 114.059 39.1741 107.001 37.7236 98.458C35.6391 86.1739 37.76 71.2203 44.1367 49.8779L49.8799 51.5938C43.5697 72.7127 41.7855 86.5734 43.6328 97.4551C45.4028 107.884 50.5747 115.951 59.2607 125.339C62.7221 125.842 65.7793 128.136 68.2451 130.659C71.1347 133.617 73.7647 137.463 75.959 141.168C77.8584 144.375 79.4854 147.568 80.7207 150.16C81.2101 149.267 81.718 148.384 82.2441 147.513C82.6673 145.477 83.2489 143.232 83.832 140.98C84.1584 139.733 84.4759 138.483 84.7852 137.23C85.7022 133.474 86.4395 129.782 86.5498 126.346C86.6594 122.92 86.138 119.96 84.7266 117.527C83.345 115.147 80.9333 112.966 76.6699 111.39C70.849 109.237 67.0648 104.564 64.9844 98.8682C62.9202 93.2173 62.4605 86.4165 63.2637 79.4717C64.864 65.6329 71.5968 50.3044 82.4189 40.9092C84.7979 38.8443 85.8222 37.3362 86.1758 36.4102C86.4363 35.7276 86.2876 35.5686 86.2334 35.5107C86.2297 35.5068 86.2262 35.5021 86.2227 35.498C86.0063 35.2343 85.3444 34.7561 83.9014 34.4229C82.5277 34.1064 80.7695 34.0003 78.8379 34.165C74.8996 34.4995 70.9044 35.8924 68.5039 38.0068C67.3441 39.0282 66.6452 40.134 66.373 41.3027C66.1057 42.4517 66.1805 43.9569 67.085 45.9258L61.6377 48.4277C60.2789 45.468 59.9154 42.6018 60.5352 39.9424C61.1501 37.3022 62.6648 35.163 64.542 33.5088C68.2161 30.2735 73.5954 28.5952 78.3291 28.1924C80.7337 27.988 83.1365 28.0958 85.248 28.583C87.2895 29.0535 89.4376 29.9701 90.8545 31.6963C92.4493 33.6381 92.7114 36.0976 91.7754 38.5488C90.9105 40.8126 89.0403 43.098 86.3486 45.4355C76.8887 53.6482 70.6844 67.4732 69.2178 80.1602C68.4871 86.4787 68.9606 92.2845 70.6143 96.8115C72.2518 101.294 74.97 104.37 78.749 105.768C84.0863 107.741 87.7135 110.734 89.9102 114.519C92.0762 118.252 92.6722 122.447 92.541 126.538C92.4415 129.643 91.9185 132.809 91.2598 135.841C94.6432 132.317 98.701 128.722 103.811 124.577V104.574H109.805V124.262C110.085 124.413 110.367 124.563 110.65 124.709C112.112 125.465 114.136 126.43 116.4 127.278C118.677 128.131 121.114 128.836 123.418 129.122C125.746 129.411 127.707 129.244 129.2 128.599C131.788 127.48 133.462 126.457 134.57 125.258C135.6 124.144 136.323 122.678 136.576 120.277C136.929 116.937 136.789 114.121 136.667 111.68C136.611 110.574 136.561 109.545 136.561 108.579C136.561 107.005 137.281 105.799 138.094 104.954C138.844 104.175 139.781 103.584 140.574 103.129C141.153 102.799 141.737 102.481 142.327 102.172C143.447 101.577 144.515 101.01 145.679 100.183C147.274 99.048 148.676 97.6365 149.599 95.6064C150.524 93.5698 151.083 90.6545 150.553 86.3301C150.233 83.7276 148.843 81.6687 146.587 79.7285C144.55 77.9772 142.056 76.5228 139.338 74.9375C138.932 74.7008 138.522 74.4607 138.106 74.2168C135.104 72.4517 131.754 70.391 129.535 67.6172C127.111 64.5856 126.114 60.8156 127.522 56.1729C128.463 53.0701 128.219 50.7979 127.542 49.1035C126.846 47.3629 125.58 45.9522 124.048 44.8164C122.512 43.6778 120.815 42.895 119.464 42.3945C118.797 42.1476 118.235 41.9768 117.851 41.8701C117.658 41.8174 117.512 41.78 117.42 41.7578L117.343 41.7393L117.324 41.7354L117.317 41.7344L117.313 41.7324H117.309L115.159 41.2812L114.948 39.0879C113.574 24.821 100.358 13.0594 82.5801 10.916ZM95.9863 63.6895C92.3847 57.1988 109.133 55.4865 114.706 60.3906C120.837 65.7858 116.166 87.1661 110.872 80.9482C107.588 77.0913 111.552 72.0945 108.263 68.2412C104.943 64.352 98.4667 68.1602 95.9863 63.6895Z\" fill=\"#111111\"/></svg>",
      "longcat": "<svg fill=\"currentColor\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>LongCat</title><path clip-rule=\"evenodd\" d=\"M.507 19.883a.507.507 0 01-.489-.642L4.29 3.745a1.013 1.013 0 011.533-.578l5.622 3.687a1.013 1.013 0 001.11 0L18.2 3.165a1.013 1.013 0 011.532.58l4.25 15.497a.506.506 0 01-.49.64H18.07a6.297 6.297 0 001.53-4.115v-.177a6.09 6.09 0 00-1.513-4.017l-.697-3.495a.438.438 0 00-.694-.266L14.07 9.781a.748.748 0 01-.654.121 5.156 5.156 0 00-2.833 0 .746.746 0 01-.653-.121L7.302 7.81a.435.435 0 00-.688.269l-.675 3.652a5.36 5.36 0 00-1.539 3.76v.333c0 1.474.527 2.9 1.488 4.02l.032.038H.507z\" fill=\"#29E154\" fill-rule=\"evenodd\"></path><path d=\"M9.213 16.843h1.52v-3.546h-1.29l-.23 3.546zm5.573 0h-1.52v-3.546h1.29l.23 3.546z\"></path></svg>",
      "modelscope": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>ModelScope</title><path d=\"M0 7.967h2.667v2.667H0zM8 10.633h2.667V13.3H8z\" fill=\"#36CED0\"></path><path d=\"M0 10.633h2.667V13.3H0zM2.667 13.3h2.666v2.667H8v2.666H2.667V13.3zM2.667 5.3H8v2.667H5.333v2.666H2.667V5.3zM10.667 13.3h2.667v2.667h-2.667z\" fill=\"#624AFF\"></path><path d=\"M24 7.967h-2.667v2.667H24zM16 10.633h-2.667V13.3H16z\" fill=\"#36CED0\"></path><path d=\"M24 10.633h-2.667V13.3H24zM21.333 13.3h-2.666v2.667H16v2.666h5.333V13.3zM21.333 5.3H16v2.667h2.667v2.666h2.666V5.3z\" fill=\"#624AFF\"></path></svg>",
      "aihubmix": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>AiHubMix</title><path d=\"M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z\" fill=\"#006FFB\"></path><path clip-rule=\"evenodd\" d=\"M11.24 8.393c.095-.644.302-1.47.624-2.48L12 5.496l.136.417c.322 1.01.53 1.836.624 2.48.071.472.071 1.072 0 1.8-.072.731-.072 1.336 0 1.814.106.7.426 1.281.96 1.744a2.795 2.795 0 001.89.708 2.78 2.78 0 002.034-.84c.56-.559.842-1.234.848-2.024.003-.7.075-1.472.216-2.316.069-.422.14-.775.21-1.06l.095-.384.168.356a7.862 7.862 0 01.76 3.244v.16a7.84 7.84 0 01-.624 3.089 7.952 7.952 0 01-4.228 4.228 7.841 7.841 0 01-3.089.623 7.84 7.84 0 01-3.089-.623 7.952 7.952 0 01-4.228-4.228 7.84 7.84 0 01-.623-3.09v-.159a7.862 7.862 0 01.759-3.244l.169-.356.093.385c.072.284.143.637.211 1.059.141.844.213 1.616.216 2.316.006.79.29 1.465.848 2.024.563.56 1.241.84 2.035.84.715 0 1.345-.236 1.889-.708a2.79 2.79 0 00.96-1.744c.073-.478.073-1.083 0-1.814-.071-.728-.071-1.328 0-1.8zm.76 9.694c1.097 0 2.125-.26 3.085-.778a6.379 6.379 0 001.77-1.399c.063-.07-.01-.178-.101-.153-.37.1-.75.15-1.144.15a4.236 4.236 0 01-2.18-.59 4.253 4.253 0 01-1.35-1.233.099.099 0 00-.16 0 4.253 4.253 0 01-1.35 1.232 4.236 4.236 0 01-2.18.591c-.393 0-.774-.05-1.143-.15-.091-.025-.165.083-.102.153a6.38 6.38 0 001.77 1.399c.96.518 1.988.778 3.085.778z\" fill=\"#fff\" fill-rule=\"evenodd\"></path></svg>",
      "opencode": "<svg height=\"1em\" width=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 240 300\" xmlns=\"http://www.w3.org/2000/svg\"><title>OpenCode</title><g clip-path=\"url(#clip0_1401_86274)\"><mask id=\"mask0_1401_86274\" style=\"mask-type:luminance\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"240\" height=\"300\"><path d=\"M240 0H0V300H240V0Z\" fill=\"white\"/></mask><g mask=\"url(#mask0_1401_86274)\"><path d=\"M180 240H60V120H180V240Z\" fill=\"#CFCECD\"/><path d=\"M180 60H60V240H180V60ZM240 300H0V0H240V300Z\" fill=\"#211E1E\"/></g></g><defs><clipPath id=\"clip0_1401_86274\"><rect width=\"240\" height=\"300\" fill=\"white\"/></clipPath></defs></svg>",
      "siliconflow": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>SiliconCloud</title><path clip-rule=\"evenodd\" d=\"M22.956 6.521H12.522c-.577 0-1.044.468-1.044 1.044v3.13c0 .577-.466 1.044-1.043 1.044H1.044c-.577 0-1.044.467-1.044 1.044v4.174C0 17.533.467 18 1.044 18h10.434c.577 0 1.044-.467 1.044-1.043v-3.13c0-.578.466-1.044 1.043-1.044h9.391c.577 0 1.044-.467 1.044-1.044V7.565c0-.576-.467-1.044-1.044-1.044z\" fill=\"#6E29F6\" fill-rule=\"evenodd\"></path></svg>",
      "micu": "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"1em\" width=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 241.39 240.6\"><title>Micu</title><defs><style>.mc-1{fill:#068cde}.mc-2{fill:#fff}.mc-3{fill:#02a6ff}</style></defs><g><path class=\"mc-1\" d=\"M226.14,157.63c-3.62,0-7.24,0-10.95,0v-24.96c5.2,0,10.17,0,15.13,0,5.55-.01,8.52-4.01,10.18-8.16,1.34-3.37,1.36-7.51-1.34-11.1-3.16-4.2-7.23-5.72-12.25-5.63-3.87.07-7.74.01-11.66.01v-24.79c6.56-.43,12.93.45,19.3-1.13.4-.42.85-1.05,1.44-1.49,4.61-3.47,6.48-9.22,4.67-14.51-1.63-4.76-6.67-8.03-12.22-7.99-4.37.03-8.74,0-13.42,0,0-5.79.1-11.16-.04-16.54-.08-3.23-1.09-6.23-3.22-8.79-7.6-9.17-17.84-6.02-28.13-6.29-.39-.23-.63-1.14-.45-2.35.73-4.72.37-9.44-.24-14.13-.51-3.95-5.79-9.24-9.1-9.56-10.42-1-15.88,5.21-15.83,14.89.02,3.54,0,7.08,0,10.92h-24.44c-.76-1.03-.45-2.13-.42-3.19.15-5.2.71-10.35-1.11-15.5-2.15-6.08-11.68-9.27-17.05-5.79-5.27,3.41-7.22,7.95-6.99,13.99.14,3.56.53,7.22-.44,10.6h-23.98c-.22-.38-.37-.51-.37-.66-.05-4.56,0-9.12-.14-13.68-.15-5.18-4.72-10.76-9.31-11.57-8.81-1.55-15.64,4.23-15.64,13.24,0,4.11,0,8.21,0,12.61-4.92,0-9.32.08-13.72-.02-10.41-.22-18.81,7.79-17.84,18.57.39,4.32.06,8.7.06,13.34-5.17,0-9.9-.05-14.63.01-5.36.07-11.08,5.57-11.83,10.1-1.39,8.44,6.23,15.25,14.55,14.78,3.86-.22,7.74-.04,11.75-.04v24.92c-4.45,0-8.67-.07-12.89.02-3.2.07-6.5.62-8.75,2.93-3.6,3.69-6.1,8.11-4.12,13.5,2.13,5.8,6.42,8.43,12.98,8.43,4.21,0,8.42,0,12.83,0v24.95c-3.48,0-6.79-.12-10.08.03-3.74.18-7.43.36-10.78,2.69-4.11,2.87-6.48,8.21-5.32,12.83,1.1,4.36,7.17,9.83,11.59,9.41,4.82-.46,9.72-.1,14.69-.1,0,5.18.51,9.88-.1,14.44-1.36,10,8.64,18.06,17.22,17.5,4.62-.3,9.28-.05,14.15-.05,1.26,9.11-3.28,19.95,9.5,25.9,10.27,1.43,15.74-3.33,15.75-15.14,0-3.45,0-6.9,0-10.55h24.94c0,3.39,0,6.6,0,9.8,0,3.81.26,7.41,2.73,10.76,3.09,4.2,8.64,6.68,14,4.87,3.62-1.22,8.31-5.43,8.3-10.7,0-4.85,0-9.7,0-14.7h24.92c0,3.98-.14,7.7.03,11.41.22,4.83,1.4,9.35,5.68,12.32,5.16,3.59,12.81,2.96,17.28-2.41,3.93-7.43,2.05-14.57,2.39-21.58,5.71,0,11.1.03,16.49-.02,1.98-.02,4.05-.06,5.8-1.09,6.78-3.99,9.8-9.94,9.36-17.81-.23-4.18-.04-8.39-.04-12.56,8.59-1.68,18.23,2.96,24.73-6.3.08-.31.31-1.1.5-1.9.97-4.19,1.82-8.06-1.59-12.01-3.49-4.05-7.66-5.05-12.52-5.04ZM168.3,160.54c0,3.41-1.48,4.58-4.69,4.49-4.41-.12-8.82-.09-13.23-.05-3.15.03-4.43-1.39-4.41-4.56.06-16.85.02-33.69-.03-50.54,0-.99.44-2.13-.73-3.15-4.49,13.97-8.94,27.8-13.44,41.79h-21.8c-4.39-13.78-8.8-27.62-13.55-42.54-.15,1.94-.29,2.89-.29,3.84-.01,16.68-.08,33.36.04,50.04.03,3.7-1.18,5.38-5.05,5.16-5.51-.31-11.08.38-16.22-.44-1.24-1.59-1.21-2.95-1.21-4.26.07-27.3.18-54.6.22-81.9,0-2.16.89-3.46,2.97-3.48,9.9-.06,19.8,0,29.7.05.31,0,.63.19,1.39.44,4.22,14.29,8.51,28.79,12.8,43.3.29.05.58.1.87.15,4.53-14.59,9.07-29.17,13.66-43.95,10.35,0,20.48-.03,30.62.03,1.76.01,2.38,1.37,2.42,2.92.08,2.57.1,5.14.1,7.71-.06,24.98-.16,49.95-.15,74.93Z\"/><rect class=\"mc-3\" x=\"48.86\" y=\"48.46\" width=\"143.67\" height=\"143.67\" rx=\"10.57\" ry=\"10.57\"/><path class=\"mc-2\" d=\"M165.55,75.28c-10.14-.06-20.27-.03-30.62-.03-4.59,14.78-9.12,29.36-13.66,43.95-.29-.05-.58-.1-.87-.15-4.29-14.51-8.58-29.01-12.8-43.3-.77-.25-1.08-.44-1.39-.44-9.9-.04-19.8-.1-29.7-.05-2.08.01-2.96,1.32-2.97,3.48-.04,27.3-.15,54.6-.22,81.9,0,1.31-.03,2.67,1.21,4.26,5.13.82,10.7.13,16.22.44,3.87.22,5.07-1.46,5.05-5.16-.12-16.68-.06-33.36-.04-50.04,0-.95.14-1.9.29-3.84,4.75,14.91,9.16,28.76,13.55,42.54h21.8c4.5-13.99,8.94-27.82,13.44-41.79,1.18,1.01.73,2.16.73,3.15.04,16.85.09,33.69.03,50.54-.01,3.17,1.26,4.59,4.41,4.56,4.41-.04,8.82-.07,13.23.05,3.21.09,4.69-1.08,4.69-4.49-.01-24.98.09-49.95.15-74.93,0-2.57-.02-5.14-.1-7.71-.05-1.55-.67-2.91-2.42-2.92Z\"/></g></svg>",
      "ucloud": "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" height=\"1em\" width=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 172.11 172.11\"><title>UCloud</title><defs><style>.cls-1{fill:url(#uc-g56)}.cls-2{fill:url(#uc-g37)}.cls-3{fill:url(#uc-g37-2)}.cls-4{fill:url(#uc-g37-3)}.cls-5{fill:url(#uc-g37-4)}.cls-6{fill:url(#uc-g37-5)}.cls-7{fill:url(#uc-g37-6)}.cls-8{fill:url(#uc-g37-7)}.cls-9{fill:#fff}.cls-10{fill:url(#uc-g38)}</style><linearGradient id=\"uc-g56\" x1=\"86.06\" y1=\"-6.73\" x2=\"86.06\" y2=\"185.53\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#32303a\"/><stop offset=\".36\" stop-color=\"#34323d\"/><stop offset=\".62\" stop-color=\"#3a3946\"/><stop offset=\".85\" stop-color=\"#444556\"/><stop offset=\"1\" stop-color=\"#4e5065\"/></linearGradient><linearGradient id=\"uc-g37\" x1=\"143.96\" y1=\"73.06\" x2=\"71.52\" y2=\"34.1\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#4043ff\"/><stop offset=\"1\" stop-color=\"#f0f5fa\"/></linearGradient><linearGradient id=\"uc-g37-2\" x1=\"104.88\" y1=\"118.84\" x2=\"71.68\" y2=\"66.44\" xlink:href=\"#uc-g37\"/><linearGradient id=\"uc-g37-3\" x1=\"95.68\" y1=\"72.87\" x2=\"33.68\" y2=\"76.43\" xlink:href=\"#uc-g37\"/><linearGradient id=\"uc-g37-4\" x1=\"70\" y1=\"130.18\" x2=\"46.68\" y2=\"73.38\" xlink:href=\"#uc-g37\"/><linearGradient id=\"uc-g37-5\" x1=\"107.49\" y1=\"106.07\" x2=\"147.27\" y2=\"159.57\" xlink:href=\"#uc-g37\"/><linearGradient id=\"uc-g37-6\" x1=\"106.69\" y1=\"50.6\" x2=\"142.65\" y2=\"131.51\" xlink:href=\"#uc-g37\"/><linearGradient id=\"uc-g37-7\" x1=\"111.35\" y1=\"152.42\" x2=\"82.55\" y2=\"89.87\" xlink:href=\"#uc-g37\"/><linearGradient id=\"uc-g38\" x1=\"64.73\" y1=\"89.4\" x2=\"83.39\" y2=\"89.4\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#5b5dfe\"/><stop offset=\".18\" stop-color=\"#5b5dfe\" stop-opacity=\".99\"/><stop offset=\".31\" stop-color=\"#5b5dfe\" stop-opacity=\".95\"/><stop offset=\".43\" stop-color=\"#5b5cfe\" stop-opacity=\".89\"/><stop offset=\".54\" stop-color=\"#5b5cfe\" stop-opacity=\".8\"/><stop offset=\".64\" stop-color=\"#5b5bfe\" stop-opacity=\".68\"/><stop offset=\".74\" stop-color=\"#5b5afe\" stop-opacity=\".54\"/><stop offset=\".83\" stop-color=\"#5a59ff\" stop-opacity=\".38\"/><stop offset=\".92\" stop-color=\"#5a58ff\" stop-opacity=\".19\"/><stop offset=\"1\" stop-color=\"#5a57ff\" stop-opacity=\"0\"/></linearGradient></defs><rect class=\"cls-1\" width=\"172.11\" height=\"172.11\" rx=\"46.24\"/><polygon class=\"cls-2\" points=\"124.1 51.65 104.14 63.16 104.08 63.12 84.2 51.65 104.08 40.17 104.14 40.14 124.1 51.65\"/><path class=\"cls-3\" d=\"M111.61,90.51l-.1-.06-2.92-1.69a8.9,8.9,0,0,1-4.46-7.69l0-17.95L84.2,51.65l-.12.07V69.59a8.91,8.91,0,0,1-4.45,7.71L64.26,86.17v23l12.4-7.15,3.09-1.78a8.92,8.92,0,0,1,8.91,0l15.42,8.91.06,0,19.93-11.49h0Z\"/><path class=\"cls-4\" d=\"M84.08,66v3.55a8.91,8.91,0,0,1-4.45,7.71L64.26,86.17,44.32,74.68v0L64.26,63.17l12.41,7.15A4.94,4.94,0,0,0,84.08,66Z\"/><polygon class=\"cls-5\" points=\"64.26 86.17 64.26 109.2 44.32 97.7 44.32 74.68 64.26 86.17\"/><polygon class=\"cls-6\" points=\"124.1 97.7 124.1 120.72 124.08 120.72 104.14 132.23 104.08 132.21 104.08 109.25 104.14 109.2 124.08 97.7 124.1 97.7\"/><path class=\"cls-7\" d=\"M124.1,51.65v23h0l-12.48,7.21c-3.28,1.89-3,6.87-3,6.87a8.9,8.9,0,0,1-4.46-7.69l0-17.89.06,0Z\"/><path class=\"cls-8\" d=\"M104.08,109.18v23L84.2,120.72l-.12-.07V106.33a4.94,4.94,0,0,0-7.41-4.28l3-1.72a8.89,8.89,0,0,1,8.87,0Z\"/><path class=\"cls-9\" d=\"M85.28,81.09V91.24a2.56,2.56,0,0,0,3.85,2.22l8.81-5.09a2.56,2.56,0,0,0,0-4.44l-8.82-5.06A2.56,2.56,0,0,0,85.28,81.09Z\"/><path class=\"cls-10\" d=\"M84.08,69.59a8.91,8.91,0,0,1-4.45,7.71L64.26,86.17v23l12.4-7.15,3.09-1.78a8.82,8.82,0,0,1,4.33-1.19Z\"/></svg>",
      "sssaicode": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 512 512\"><title>SSAI Code</title><defs><linearGradient id=\"ssc-gradLeft\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#0ff5ce\" /><stop offset=\"100%\" stop-color=\"#147a8a\" /></linearGradient><linearGradient id=\"ssc-gradRight\" x1=\"100%\" y1=\"0%\" x2=\"0%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#d0e4f5\" /><stop offset=\"100%\" stop-color=\"#6a9ec4\" /></linearGradient><linearGradient id=\"ssc-gradTop\" x1=\"50%\" y1=\"0%\" x2=\"50%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#a0d8e8\" /><stop offset=\"100%\" stop-color=\"#4aafbf\" /></linearGradient><linearGradient id=\"ssc-gradText\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\"><stop offset=\"0%\" stop-color=\"#0ff5ce\" /><stop offset=\"35%\" stop-color=\"#4abfcf\" /><stop offset=\"65%\" stop-color=\"#7badd4\" /><stop offset=\"100%\" stop-color=\"#c0daf0\" /></linearGradient><linearGradient id=\"ssc-gradS\" x1=\"0%\" y1=\"0%\" x2=\"0%\" y2=\"100%\"><stop offset=\"0%\" stop-color=\"#f0f8ff\" /><stop offset=\"100%\" stop-color=\"#6cbfcf\" /></linearGradient><filter id=\"ssc-glow\" x=\"-30%\" y=\"-30%\" width=\"160%\" height=\"160%\"><feGaussianBlur stdDeviation=\"4\" result=\"blur\" /><feMerge><feMergeNode in=\"blur\" /><feMergeNode in=\"SourceGraphic\" /></feMerge></filter><pattern id=\"ssc-binL\" x=\"0\" y=\"0\" width=\"55\" height=\"16\" patternUnits=\"userSpaceOnUse\" patternTransform=\"rotate(-3)\"><text x=\"0\" y=\"11\" font-family=\"monospace\" font-size=\"8\" fill=\"rgba(0,255,210,0.25)\">1001 1101</text></pattern><pattern id=\"ssc-binR\" x=\"0\" y=\"0\" width=\"55\" height=\"16\" patternUnits=\"userSpaceOnUse\" patternTransform=\"rotate(3)\"><text x=\"0\" y=\"11\" font-family=\"monospace\" font-size=\"8\" fill=\"rgba(180,210,240,0.25)\">0110 1011</text></pattern><pattern id=\"ssc-binT\" x=\"0\" y=\"0\" width=\"50\" height=\"16\" patternUnits=\"userSpaceOnUse\"><text x=\"2\" y=\"11\" font-family=\"monospace\" font-size=\"8\" fill=\"rgba(120,200,220,0.2)\">10 110</text></pattern></defs><rect width=\"512\" height=\"512\" rx=\"72\" fill=\"#08080e\" /><polygon points=\"90,350 250,350 170,228\" fill=\"url(#ssc-gradLeft)\" opacity=\"0.8\" /><polygon points=\"90,350 250,350 170,228\" fill=\"url(#ssc-binL)\" /><polygon points=\"262,350 422,350 342,228\" fill=\"url(#ssc-gradRight)\" opacity=\"0.8\" /><polygon points=\"262,350 422,350 342,228\" fill=\"url(#ssc-binR)\" /><polygon points=\"176,290 336,290 256,168\" fill=\"none\" stroke=\"url(#ssc-gradTop)\" stroke-width=\"2.5\" opacity=\"0.85\" /><polygon points=\"192,280 320,280 256,184\" fill=\"none\" stroke=\"url(#ssc-gradTop)\" stroke-width=\"0.8\" opacity=\"0.35\" /><text x=\"256\" y=\"316\" text-anchor=\"middle\" font-family=\"Georgia, 'Times New Roman', serif\" font-size=\"120\" font-weight=\"bold\" fill=\"url(#ssc-gradS)\" filter=\"url(#ssc-glow)\">S</text><text x=\"256\" y=\"425\" text-anchor=\"middle\" font-family=\"'Helvetica Neue', 'Segoe UI', Arial, sans-serif\" font-size=\"40\" font-weight=\"300\" letter-spacing=\"5\" fill=\"url(#ssc-gradText)\">SSSAiCode</text></svg>",
      "stepfun": "<svg width=\"1em\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><title>StepFun</title><g clip-path=\"url(#clip0_10683_3111)\"><path d=\"M23.2964 14.7395H17.4448V23.2981H12.9565V13.2307H23.2964V14.7395ZM20.355 8.24341H10.4683V20.1165H0.63916V15.76H5.94385L5.94678 3.90942H20.355V8.24341ZM4.02002 12.5881H2.48779V2.51685H4.02002V12.5881ZM22.4272 1.60962H23.3394V2.51587H22.4272V4.32544H21.519V2.51587H19.6997V1.60962H21.519V0.702393H22.4272V1.60962Z\" fill=\"#005AFF\"/></g><defs><clipPath id=\"clip0_10683_3111\"><rect width=\"24\" height=\"24\" fill=\"white\"/></clipPath></defs></svg>",
      "catcoder": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>KwaiKAT</title><path d=\"M20.42 19.311h3.418V1l-6.781 4.177-6.778-4.111.026 7.868h3.418l-.026-2.222 3.42 2.035 3.303-2.035v12.6z\"></path><path d=\"M3.064 10.734c2.784-2.07 6.942-2.394 9.941.907l.01.01.01.013 9.16 12.24h-3.84l-7.69-10.217c-1.63-1.737-3.891-1.689-5.515-.638-1.624 1.05-2.563 3.073-1.548 5.28 1.494 3.246 6.152 3.275 7.725.108l.032-.064 2.02 2.629c-2.98 3.968-9.329 3.926-12.165-.552-2.395-3.78-.926-7.645 1.86-9.716z\"></path></svg>",
      "mcp": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>ModelContextProtocol</title><path d=\"M15.688 2.343a2.588 2.588 0 00-3.61 0l-9.626 9.44a.863.863 0 01-1.203 0 .823.823 0 010-1.18l9.626-9.44a4.313 4.313 0 016.016 0 4.116 4.116 0 011.204 3.54 4.3 4.3 0 013.609 1.18l.05.05a4.115 4.115 0 010 5.9l-8.706 8.537a.274.274 0 000 .393l1.788 1.754a.823.823 0 010 1.18.863.863 0 01-1.203 0l-1.788-1.753a1.92 1.92 0 010-2.754l8.706-8.538a2.47 2.47 0 000-3.54l-.05-.049a2.588 2.588 0 00-3.607-.003l-7.172 7.034-.002.002-.098.097a.863.863 0 01-1.204 0 .823.823 0 010-1.18l7.273-7.133a2.47 2.47 0 00-.003-3.537z\"></path><path d=\"M14.485 4.703a.823.823 0 000-1.18.863.863 0 00-1.204 0l-7.119 6.982a4.115 4.115 0 000 5.9 4.314 4.314 0 006.016 0l7.12-6.982a.823.823 0 000-1.18.863.863 0 00-1.204 0l-7.119 6.982a2.588 2.588 0 01-3.61 0 2.47 2.47 0 010-3.54l7.12-6.982z\"></path></svg>",
      "novita": "<svg width=\"1em\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 40 40\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><title>Novita</title><g clip-path=\"url(#clip0_3135_1230)\"><path d=\"M15.5564 8.26172V16.5239L2.1875 29.8928H15.5564V21.6302L23.8194 29.8928H37.1875L15.5564 8.26172Z\" fill=\"#000000\"/></g><defs><clipPath id=\"clip0_3135_1230\"><rect width=\"35\" height=\"21.6311\" fill=\"white\" transform=\"translate(2.1875 8.26172)\"/></clipPath></defs></svg>",
      "nvidia": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>Nvidia</title><path d=\"M10.212 8.976V7.62c.127-.01.256-.017.388-.021 3.596-.117 5.957 3.184 5.957 3.184s-2.548 3.647-5.282 3.647a3.227 3.227 0 01-1.063-.175v-4.109c1.4.174 1.681.812 2.523 2.258l1.873-1.627a4.905 4.905 0 00-3.67-1.846 6.594 6.594 0 00-.729.044m0-4.476v2.025c.13-.01.259-.019.388-.024 5.002-.174 8.261 4.226 8.261 4.226s-3.743 4.69-7.643 4.69c-.338 0-.675-.031-1.007-.092v1.25c.278.038.558.057.838.057 3.629 0 6.253-1.91 8.794-4.169.421.347 2.146 1.193 2.501 1.564-2.416 2.083-8.048 3.763-11.24 3.763-.308 0-.603-.02-.894-.048V19.5H24v-15H10.21zm0 9.756v1.068c-3.356-.616-4.287-4.21-4.287-4.21a7.173 7.173 0 014.287-2.138v1.172h-.005a3.182 3.182 0 00-2.502 1.178s.615 2.276 2.507 2.931m-5.961-3.3c1.436-1.935 3.604-3.148 5.961-3.336V6.523C5.81 6.887 2 10.723 2 10.723s2.158 6.427 8.21 7.015v-1.166C5.77 16 4.25 10.958 4.25 10.958h-.002z\" fill=\"#74B71B\" fill-rule=\"nonzero\"></path></svg>",
      "bailian": "<svg fill=\"currentColor\" fill-rule=\"evenodd\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>BaiLian</title><path d=\"M6.336 8.919v6.162l5.335-3.083L6.337 8.92z\" fill-opacity=\".4\"></path><path d=\"M21.394 5.288s-.006-.006-.01-.006L17.01 2.754 6.336 8.92l5.335 3.082 9.701-5.6.016-.01a.635.635 0 00.006-1.1v-.003z\" fill-opacity=\".8\"></path><path d=\"M21.71 12.465a.62.62 0 00-.316.085s-.006 0-.009.003l-4.375 2.528 5.05 2.915h.006a2.06 2.06 0 00.28-1.04v-3.855a.637.637 0 00-.636-.636z\"></path><path d=\"M22.06 17.996l-5.05-2.915L6.34 21.242l4.27 2.465s.016.006.022.012a2.102 2.102 0 002.093 0c.006-.003.016-.006.022-.012l8.538-4.93c.003 0 .006-.003.01-.006.321-.183.589-.45.775-.772h-.006l-.004-.003z\" fill-opacity=\".8\"></path><path d=\"M11.672 11.998l-5.336 3.083-1.444.832-3.605 2.083H1.28c.173.303.416.555.709.738l.078.044.016.01.02.012 4.232 2.442 10.671-6.161-5.335-3.082z\"></path><path d=\"M12.74.29c-.1-.06-.208-.107-.315-.148-.02-.006-.038-.016-.057-.022a2.121 2.121 0 00-.7-.12c-.233 0-.457.038-.668.11l-.031.01a2.196 2.196 0 00-.372.17L2.068 5.222s-.003 0-.006.003c-.324.183-.592.451-.781.773h.006l5.049 2.918L17.01 2.758 12.74.29z\" fill-opacity=\".6\"></path><path d=\"M1.287 6.001H1.28A2.06 2.06 0 001 7.041v9.915c0 .378.1.735.28 1.043h.007l5.049-2.918V8.919l-5.05-2.918z\" fill-opacity=\".3\"></path></svg>",
      "ppio": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>PPIO</title><path clip-rule=\"evenodd\" d=\"M12.002 0C5.377 0 0 5.37 0 11.994c0 3.266 1.309 6.232 3.43 8.395v-8.383c0-2.288.893-4.447 2.51-6.063a8.513 8.513 0 016.066-2.509h.07l-.074.008c4.735 0 8.575 3.84 8.575 8.571 0 .413-.03.818-.087 1.219l-4.844-4.86A5.12 5.12 0 0012.01 6.87a5.126 5.126 0 00-3.637 1.503 5.107 5.107 0 00-1.507 3.641c0 1.376.536 2.666 1.507 3.64a5.12 5.12 0 003.637 1.504 5.126 5.126 0 003.637-1.503 5.114 5.114 0 001.496-3.348l2.842 2.853c-1.256 3.18-4.353 5.433-7.978 5.433-1.879 0-3.671-.6-5.145-1.714v3.967c1.56.742 3.3 1.155 5.137 1.155C18.623 24 24 18.63 24 12.006 24.008 5.373 18.635.004 12.006.004L12.002 0z\" fill=\"#2874FF\" fill-rule=\"evenodd\"></path></svg>",
      "jiekou": "<svg height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 24 24\" width=\"1em\" xmlns=\"http://www.w3.org/2000/svg\"><title>JieKou AI</title><path d=\"M16 4H4V20H16C18.2091 20 20 18.2091 20 16V8H24V16C24 20.4183 20.4183 24 16 24H4C1.79086 24 0 22.2091 0 20V0H16V4Z\" fill=\"#000000\"></path><path d=\"M20 4H24V0H20V4Z\" fill=\"#0071E3\"></path></svg>",
      "qianwenai": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 28 28.003\" fill=\"none\"><defs><linearGradient x1=\"-0.948\" y1=\"-1.093\" x2=\"1.292\" y2=\"0.905\" id=\"master_svg0_831_9157\"><stop offset=\"0%\" stop-color=\"#082DFF\"/><stop offset=\"100%\" stop-color=\"#3FD2F9\"/></linearGradient><linearGradient x1=\"-0.444\" y1=\"-0.716\" x2=\"2.065\" y2=\"1.232\" id=\"master_svg2_831_9163\"><stop offset=\"0%\" stop-color=\"#082DFF\"/><stop offset=\"100%\" stop-color=\"#3FD2F9\"/></linearGradient><linearGradient x1=\"-0.127\" y1=\"0.114\" x2=\"1.362\" y2=\"2.9\" id=\"master_svg3_831_9166\"><stop offset=\"0%\" stop-color=\"#082DFF\"/><stop offset=\"100%\" stop-color=\"#3FD2F9\"/></linearGradient><linearGradient x1=\"0\" y1=\"-0.09\" x2=\"2.241\" y2=\"1.908\" id=\"master_svg4_831_9160\"><stop offset=\"0%\" stop-color=\"#082DFF\"/><stop offset=\"100%\" stop-color=\"#3FD2F9\"/></linearGradient><linearGradient x1=\"-0.503\" y1=\"-0.791\" x2=\"2.007\" y2=\"1.158\" id=\"master_svg5_831_9154\"><stop offset=\"0%\" stop-color=\"#082DFF\"/><stop offset=\"100%\" stop-color=\"#3FD2F9\"/></linearGradient><linearGradient x1=\"-2.119\" y1=\"-0.848\" x2=\"-0.63\" y2=\"1.939\" id=\"master_svg6_831_9170\"><stop offset=\"0%\" stop-color=\"#082DFF\"/><stop offset=\"100%\" stop-color=\"#3FD2F9\"/></linearGradient></defs><path d=\"M27.048,16.094L23.281,13.918C23.374,13.757,23.425,13.574,23.425,13.382L23.425,12.218C23.425,11.836,23.22,11.481,22.889,11.289L21.88,10.707C21.548,10.515,21.14,10.515,20.809,10.707L17.72,12.49C17.389,12.682,17.184,13.035,17.184,13.419L17.184,14.583C17.184,14.965,17.389,15.319,17.72,15.511L24.968,19.696C25.3,19.888,25.708,19.888,26.039,19.696L27.048,19.113C27.38,18.922,27.584,18.569,27.584,18.185L27.584,17.021C27.584,16.639,27.38,16.284,27.048,16.093L27.048,16.094Z\" fill=\"url(#master_svg0_831_9157)\"/><path d=\"M27.048,16.094L23.281,13.918C23.374,13.757,23.425,13.574,23.425,13.382L23.425,12.218C23.425,11.836,23.22,11.481,22.889,11.289L21.88,10.707C21.548,10.515,21.14,10.515,20.809,10.707L17.72,12.49C17.389,12.682,17.184,13.035,17.184,13.419L17.184,14.583C17.184,14.965,17.389,15.319,17.72,15.511L24.968,19.696C25.3,19.888,25.708,19.888,26.039,19.696L27.048,19.113C27.38,18.922,27.584,18.569,27.584,18.185L27.584,17.021C27.584,16.639,27.38,16.284,27.048,16.093L27.048,16.094Z\" fill=\"url(#master_svg0_831_9157)\"/><path d=\"M22.336,3.748L18.568,5.923C18.475,5.763,18.342,5.627,18.176,5.531L17.167,4.948C16.835,4.756,16.428,4.756,16.096,4.948L15.087,5.531C14.756,5.723,14.551,6.076,14.551,6.46L14.551,10.027C14.551,10.409,14.756,10.763,15.087,10.955L16.096,11.538C16.428,11.73,16.835,11.73,17.167,11.538L24.415,7.353C24.747,7.161,24.952,6.808,24.952,6.424L24.952,5.26C24.952,4.878,24.747,4.524,24.415,4.332L23.406,3.749C23.075,3.557,22.667,3.557,22.336,3.749L22.336,3.748Z\" fill=\"url(#master_svg2_831_9163)\"/><path d=\"M9.288,1.655L9.288,6.005C9.103,6.005,8.918,6.053,8.752,6.149L7.743,6.732C7.411,6.924,7.207,7.277,7.207,7.66L7.207,8.824C7.207,9.207,7.411,9.561,7.743,9.753L10.832,11.536C11.163,11.728,11.571,11.728,11.902,11.536L12.911,10.954C13.243,10.762,13.448,10.409,13.448,10.025L13.448,1.655C13.448,1.273,13.243,0.919,12.911,0.727L11.902,0.144C11.571,-0.048,11.163,-0.048,10.832,0.144L9.823,0.727C9.491,0.919,9.286,1.271,9.286,1.655L9.288,1.655Z\" fill=\"url(#master_svg3_831_9166)\"/><path d=\"M0.952,11.909L4.719,14.085C4.626,14.246,4.575,14.429,4.575,14.621L4.575,15.785C4.575,16.167,4.78,16.521,5.111,16.713L6.12,17.296C6.452,17.488,6.86,17.488,7.191,17.296L10.28,15.513C10.611,15.321,10.816,14.968,10.816,14.584L10.816,13.42C10.816,13.038,10.611,12.684,10.28,12.492L3.032,8.307C2.7,8.115,2.292,8.115,1.961,8.307L0.952,8.889C0.62,9.08,0.416,9.434,0.416,9.816L0.416,10.98C0.416,11.363,0.62,11.717,0.952,11.909Z\" fill=\"url(#master_svg4_831_9160)\"/><path d=\"M5.663,24.255L9.43,22.079C9.524,22.24,9.656,22.376,9.823,22.472L10.832,23.054C11.163,23.246,11.571,23.246,11.902,23.054L12.911,22.472C13.243,22.28,13.448,21.927,13.448,21.543L13.448,17.976C13.448,17.594,13.243,17.24,12.911,17.048L11.902,16.465C11.571,16.273,11.163,16.273,10.832,16.465L3.583,20.65C3.252,20.842,3.047,21.195,3.047,21.579L3.047,22.743C3.047,23.125,3.252,23.479,3.583,23.671L4.592,24.254C4.924,24.446,5.331,24.446,5.663,24.254L5.663,24.255Z\" fill=\"url(#master_svg5_831_9154)\"/><path d=\"M18.712,26.348L18.712,21.998C18.897,21.998,19.082,21.95,19.248,21.854L20.257,21.271C20.589,21.079,20.793,20.726,20.793,20.342L20.793,19.178C20.793,18.796,20.589,18.442,20.257,18.25L17.168,16.466C16.837,16.275,16.429,16.275,16.097,16.466L15.089,17.049C14.757,17.241,14.552,17.594,14.552,17.978L14.552,26.348C14.552,26.73,14.757,27.084,15.089,27.276L16.097,27.859C16.429,28.051,16.837,28.051,17.168,27.859L18.177,27.276C18.509,27.084,18.713,26.732,18.713,26.348L18.712,26.348Z\" fill=\"url(#master_svg6_831_9170)\"/></svg>",
      "qwencloud": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" style=\"flex:none;line-height:1\" viewBox=\"0 0 28 28\" fill=\"none\"><defs><clipPath id=\"master_svg0_946_6412\"><rect x=\"0.416\" y=\"0\" width=\"27.168\" height=\"28\" rx=\"0\"/></clipPath><linearGradient x1=\"-0.948\" y1=\"-1.094\" x2=\"1.293\" y2=\"0.905\" id=\"master_svg1_946_6315\"><stop offset=\"1%\" stop-color=\"#4F21FF\"/><stop offset=\"100%\" stop-color=\"#D75BFE\"/></linearGradient><linearGradient x1=\"-0.445\" y1=\"-0.717\" x2=\"2.066\" y2=\"1.232\" id=\"master_svg2_946_6328\"><stop offset=\"1%\" stop-color=\"#4F21FF\"/><stop offset=\"100%\" stop-color=\"#D75BFE\"/></linearGradient><linearGradient x1=\"-0.127\" y1=\"0.114\" x2=\"1.363\" y2=\"2.901\" id=\"master_svg3_946_6325\"><stop offset=\"1%\" stop-color=\"#4F21FF\"/><stop offset=\"100%\" stop-color=\"#D75BFE\"/></linearGradient><linearGradient x1=\"0\" y1=\"-0.09\" x2=\"2.241\" y2=\"1.908\" id=\"master_svg4_946_6318\"><stop offset=\"1%\" stop-color=\"#4F21FF\"/><stop offset=\"100%\" stop-color=\"#D75BFE\"/></linearGradient><linearGradient x1=\"-0.503\" y1=\"-0.792\" x2=\"2.007\" y2=\"1.157\" id=\"master_svg6_946_6331\"><stop offset=\"1%\" stop-color=\"#4F21FF\"/><stop offset=\"100%\" stop-color=\"#D75BFE\"/></linearGradient><linearGradient x1=\"-2.119\" y1=\"-0.848\" x2=\"-0.63\" y2=\"1.939\" id=\"master_svg7_946_6321\"><stop offset=\"1%\" stop-color=\"#4F21FF\"/><stop offset=\"100%\" stop-color=\"#D75BFE\"/></linearGradient></defs><g clip-path=\"url(#master_svg0_946_6412)\"><path d=\"M27.048,16.092L23.281,13.917C23.373,13.757,23.424,13.573,23.424,13.381L23.424,12.217C23.424,11.834,23.22,11.48,22.888,11.289L21.88,10.707C21.548,10.515,21.14,10.515,20.808,10.707L17.719,12.49C17.388,12.681,17.184,13.035,17.184,13.417L17.184,14.582C17.184,14.965,17.388,15.318,17.719,15.509L24.968,19.694C25.3,19.886,25.708,19.886,26.039,19.694L27.048,19.112C27.38,18.92,27.584,18.567,27.584,18.184L27.584,17.02C27.584,16.637,27.38,16.283,27.048,16.092L27.048,16.092Z\" fill=\"url(#master_svg1_946_6315)\"/><path d=\"M22.336,3.746L18.569,5.921C18.476,5.761,18.342,5.624,18.176,5.528L17.168,4.946C16.836,4.755,16.428,4.755,16.096,4.946L15.087,5.528C14.756,5.72,14.552,6.074,14.552,6.456L14.552,10.022C14.552,10.405,14.756,10.759,15.087,10.95L16.096,11.532C16.428,11.724,16.836,11.724,17.168,11.532L24.416,7.348C24.748,7.156,24.952,6.802,24.952,6.42L24.952,5.255C24.952,4.872,24.748,4.519,24.416,4.328L23.407,3.746C23.076,3.554,22.668,3.554,22.336,3.746L22.336,3.746Z\" fill=\"url(#master_svg2_946_6328)\"/><path d=\"M9.288,1.653L9.288,6.004C9.103,6.004,8.918,6.052,8.752,6.147L7.743,6.73C7.412,6.921,7.208,7.275,7.208,7.657L7.208,8.822C7.208,9.205,7.412,9.558,7.743,9.749L10.832,11.532C11.164,11.724,11.572,11.724,11.904,11.532L12.912,10.95C13.244,10.759,13.448,10.405,13.448,10.022L13.448,1.653C13.448,1.27,13.244,0.917,12.912,0.726L11.904,0.144C11.572,-0.048,11.164,-0.048,10.832,0.144L9.823,0.726C9.492,0.917,9.288,1.271,9.288,1.653Z\" fill=\"url(#master_svg3_946_6325)\"/><path d=\"M0.952,11.907L4.72,14.083C4.627,14.243,4.576,14.427,4.576,14.618L4.576,15.783C4.576,16.166,4.78,16.52,5.112,16.71L6.121,17.293C6.452,17.484,6.86,17.484,7.192,17.293L10.281,15.51C10.612,15.318,10.816,14.965,10.816,14.582L10.816,13.418C10.816,13.035,10.612,12.681,10.281,12.49L3.032,8.305C2.7,8.113,2.292,8.113,1.96,8.305L0.952,8.887C0.62,9.079,0.416,9.432,0.416,9.815L0.416,10.979C0.416,11.362,0.62,11.716,0.952,11.907L0.952,11.907Z\" fill=\"url(#master_svg4_946_6318)\"/><path d=\"M27.048,16.092L23.281,13.917C23.373,13.757,23.424,13.573,23.424,13.381L23.424,12.217C23.424,11.834,23.22,11.48,22.888,11.289L21.88,10.707C21.548,10.515,21.14,10.515,20.808,10.707L17.719,12.49C17.388,12.681,17.184,13.035,17.184,13.417L17.184,14.582C17.184,14.965,17.388,15.318,17.719,15.509L24.968,19.694C25.3,19.886,25.708,19.886,26.039,19.694L27.048,19.112C27.38,18.92,27.584,18.567,27.584,18.184L27.584,17.02C27.584,16.637,27.38,16.283,27.048,16.092L27.048,16.092Z\" fill=\"url(#master_svg1_946_6315)\"/><path d=\"M5.664,24.253L9.432,22.078C9.524,22.238,9.658,22.375,9.824,22.47L10.833,23.053C11.164,23.244,11.572,23.244,11.904,23.053L12.913,22.47C13.244,22.279,13.448,21.925,13.448,21.543L13.448,17.977C13.448,17.594,13.244,17.24,12.913,17.049L11.904,16.467C11.572,16.275,11.164,16.275,10.833,16.467L3.584,20.651C3.253,20.843,3.049,21.197,3.049,21.579L3.049,22.744C3.049,23.127,3.253,23.48,3.584,23.671L4.593,24.253C4.925,24.445,5.333,24.445,5.664,24.253L5.664,24.253Z\" fill=\"url(#master_svg6_946_6331)\"/><path d=\"M18.712,26.346L18.712,21.995C18.897,21.995,19.082,21.948,19.248,21.852L20.256,21.27C20.588,21.078,20.792,20.725,20.792,20.342L20.792,19.178C20.792,18.795,20.588,18.441,20.256,18.25L17.168,16.467C16.836,16.276,16.428,16.276,16.096,16.467L15.087,17.049C14.756,17.241,14.552,17.595,14.552,17.977L14.552,26.347C14.552,26.73,14.756,27.083,15.087,27.274L16.096,27.856C16.428,28.048,16.836,28.048,17.168,27.856L18.176,27.274C18.508,27.083,18.712,26.729,18.712,26.347L18.712,26.346Z\" fill=\"url(#master_svg7_946_6321)\"/></g></svg>",
      "a6api": "/dsh-claude-style/icons/providers/a6-icon.png",
      "apikeyfun": "/dsh-claude-style/icons/providers/apikeyfun.png",
      "apinebula": "/dsh-claude-style/icons/providers/apinebula_icon.png",
      "atlascloud": "/dsh-claude-style/icons/providers/atlascloud_icon.png",
      "byteplus": "/dsh-claude-style/icons/providers/byteplus.png",
      "ccsub": "/dsh-claude-style/icons/providers/ccsub.svg",
      "claudeapi": "/dsh-claude-style/icons/providers/ClaudeApi.png",
      "claudecn": "/dsh-claude-style/icons/providers/claudecn.png",
      "cherryin": "/dsh-claude-style/icons/providers/cherryin.png",
      "code0": "/dsh-claude-style/icons/providers/code0.png",
      "eflowcode": "/dsh-claude-style/icons/providers/eflowcode.png",
      "etok": "/dsh-claude-style/icons/providers/etok.png",
      "fenno": "/dsh-claude-style/icons/providers/fenno-icon.webp",
      "hermes": "/dsh-claude-style/icons/providers/hermes.png",
      "huoshan": "/dsh-claude-style/icons/providers/huoshan.png",
      "nekocode": "/dsh-claude-style/icons/providers/nekocode-icon.png",
      "pateway": "/dsh-claude-style/icons/providers/pateway.jpg",
      "pipellm": "/dsh-claude-style/icons/providers/pipellm.png",
      "qiniu": "/dsh-claude-style/icons/providers/qiniu.png",
      "relaxcode": "/dsh-claude-style/icons/providers/relaxcode.png",
      "runapi": "/dsh-claude-style/icons/providers/runapi.jpg",
      "shengsuanyun": "/dsh-claude-style/icons/providers/shengsuanyun.svg",
      "subrouter": "/dsh-claude-style/icons/providers/subrouter.svg",
      "sudocode": "/dsh-claude-style/icons/providers/sudocode.png",
      "sudocode-us": "/dsh-claude-style/icons/providers/sudocode-us.png",
      "teamorouter": "/dsh-claude-style/icons/providers/TeamoRouter-icon-dark.png",
      "unity2": "/dsh-claude-style/icons/providers/unity2.png",
      "xycai": "/dsh-claude-style/icons/providers/xycai-icon.png",
      "zetaapi": "/dsh-claude-style/icons/providers/zetaapi-icon.png"
    }
    var PROVIDER_ICON_URL_KEYS =     {
      "a6api": true,
      "apikeyfun": true,
      "apinebula": true,
      "atlascloud": true,
      "byteplus": true,
      "ccsub": true,
      "claudeapi": true,
      "claudecn": true,
      "cherryin": true,
      "code0": true,
      "eflowcode": true,
      "etok": true,
      "fenno": true,
      "hermes": true,
      "huoshan": true,
      "nekocode": true,
      "pateway": true,
      "pipellm": true,
      "qiniu": true,
      "relaxcode": true,
      "runapi": true,
      "shengsuanyun": true,
      "subrouter": true,
      "sudocode": true,
      "sudocode-us": true,
      "teamorouter": true,
      "unity2": true,
      "xycai": true,
      "zetaapi": true
    }
    var PROVIDER_ICON_METADATA =     {
      "9527code": {
        "name": "9527code",
        "displayName": "9527CODE",
        "category": "ai-provider",
        "keywords": [
          "9527code",
          "9527",
          "codes",
          "aggregator",
          "relay",
          "gateway"
        ],
        "defaultColor": "currentColor"
      },
      "a6api": {
        "name": "a6api",
        "displayName": "A6API",
        "category": "ai-provider",
        "keywords": [
          "a6api",
          "a6",
          "aggregator",
          "relay",
          "gateway",
          "claude"
        ],
        "defaultColor": "#3B82F6"
      },
      "aicodewith": {
        "name": "aicodewith",
        "displayName": "AICodeWith",
        "category": "ai-provider",
        "keywords": [
          "aicodewith",
          "ai code with",
          "aggregator",
          "relay",
          "gateway",
          "claude",
          "codex",
          "gemini"
        ],
        "defaultColor": "#3A3B40"
      },
      "aigocode": {
        "name": "aigocode",
        "displayName": "AIGoCode",
        "category": "ai-provider",
        "keywords": [
          "aigocode",
          "aigo",
          "code",
          "third-party"
        ],
        "defaultColor": "#5B7FFF"
      },
      "apikeyfun": {
        "name": "apikeyfun",
        "displayName": "APIKEY.FUN",
        "category": "ai-provider",
        "keywords": [
          "apikeyfun",
          "api key",
          "gateway",
          "relay",
          "claude",
          "codex",
          "gemini"
        ],
        "defaultColor": "#9C3F00"
      },
      "apinebula": {
        "name": "apinebula",
        "displayName": "APINebula",
        "category": "ai-provider",
        "keywords": [
          "apinebula",
          "api nebula",
          "gateway",
          "relay",
          "claude",
          "codex",
          "gemini"
        ],
        "defaultColor": "#C86F49"
      },
      "atlascloud": {
        "name": "atlascloud",
        "displayName": "AtlasCloud",
        "category": "ai-provider",
        "keywords": [
          "atlascloud",
          "atlas cloud",
          "coding plan",
          "openai",
          "anthropic",
          "codex",
          "claude"
        ],
        "defaultColor": "#111111"
      },
      "soleapi": {
        "name": "soleapi",
        "displayName": "SoleAPI",
        "category": "ai-provider",
        "keywords": [
          "soleapi",
          "sole",
          "aggregator",
          "relay",
          "gateway",
          "claude"
        ],
        "defaultColor": "currentColor"
      },
      "sudocode": {
        "name": "sudocode",
        "displayName": "SudoCode.chat",
        "category": "ai-provider",
        "keywords": [
          "sudocode",
          "sudo code",
          "chat",
          "gateway",
          "relay",
          "claude",
          "codex",
          "gemini",
          "openclaw"
        ],
        "defaultColor": "#111111"
      },
      "sudocode-us": {
        "name": "sudocode-us",
        "displayName": "SudoCode.us",
        "category": "ai-provider",
        "keywords": [
          "sudocode",
          "sudo code",
          "us",
          "gateway",
          "relay",
          "claude",
          "codex",
          "gemini",
          "openclaw"
        ],
        "defaultColor": "#111111"
      },
      "alibaba": {
        "name": "alibaba",
        "displayName": "Alibaba",
        "category": "ai-provider",
        "keywords": [
          "qwen",
          "tongyi"
        ],
        "defaultColor": "#FF6A00"
      },
      "amux": {
        "name": "amux",
        "displayName": "Amux",
        "category": "ai-provider",
        "keywords": [
          "amux",
          "amuxapi",
          "aggregator",
          "relay",
          "gateway",
          "gpt"
        ],
        "defaultColor": "#000000"
      },
      "anthropic": {
        "name": "anthropic",
        "displayName": "Anthropic",
        "category": "ai-provider",
        "keywords": [
          "claude"
        ],
        "defaultColor": "#D4915D"
      },
      "aws": {
        "name": "aws",
        "displayName": "AWS",
        "category": "cloud",
        "keywords": [
          "amazon",
          "cloud"
        ],
        "defaultColor": "#FF9900"
      },
      "azure": {
        "name": "azure",
        "displayName": "Azure",
        "category": "cloud",
        "keywords": [
          "microsoft",
          "cloud"
        ],
        "defaultColor": "#0078D4"
      },
      "baidu": {
        "name": "baidu",
        "displayName": "Baidu",
        "category": "ai-provider",
        "keywords": [
          "ernie",
          "wenxin"
        ],
        "defaultColor": "#2932E1"
      },
      "bailian": {
        "name": "bailian",
        "displayName": "Bailian",
        "category": "ai-provider",
        "keywords": [
          "bailian",
          "dashscope",
          "aliyun",
          "alibaba"
        ],
        "defaultColor": "#624AFF"
      },
      "bytedance": {
        "name": "bytedance",
        "displayName": "bytedance",
        "category": "other",
        "keywords": [],
        "defaultColor": "currentColor"
      },
      "huoshan": {
        "name": "huoshan",
        "displayName": "火山方舟",
        "category": "ai-provider",
        "keywords": [
          "huoshan",
          "volcengine",
          "ark",
          "agentplan",
          "byteplus"
        ],
        "defaultColor": "#3370FF"
      },
      "byteplus": {
        "name": "byteplus",
        "displayName": "BytePlus",
        "category": "ai-provider",
        "keywords": [
          "byteplus",
          "volcengine",
          "ark",
          "modelark"
        ],
        "defaultColor": "#3370FF"
      },
      "ccsub": {
        "name": "ccsub",
        "displayName": "CCSub",
        "category": "ai-provider",
        "keywords": [
          "ccsub",
          "aggregator",
          "relay",
          "claude",
          "codex",
          "gateway"
        ],
        "defaultColor": "#1E88E5"
      },
      "subrouter": {
        "name": "subrouter",
        "displayName": "SubRouter",
        "category": "ai-provider",
        "keywords": [
          "subrouter",
          "subrouter.ai",
          "aggregator",
          "relay",
          "claude",
          "codex",
          "gemini",
          "gateway"
        ],
        "defaultColor": "#0D9488"
      },
      "chatglm": {
        "name": "chatglm",
        "displayName": "chatglm",
        "category": "other",
        "keywords": [],
        "defaultColor": "currentColor"
      },
      "claude": {
        "name": "claude",
        "displayName": "Claude",
        "category": "ai-provider",
        "keywords": [
          "anthropic"
        ],
        "defaultColor": "#D4915D"
      },
      "cherryin": {
        "name": "cherryin",
        "displayName": "CherryIN",
        "category": "ai-provider",
        "keywords": [
          "cherryin",
          "cherry",
          "gateway",
          "relay",
          "newapi",
          "claude",
          "codex"
        ],
        "defaultColor": "#FB6354"
      },
      "claudeapi": {
        "name": "claudeapi",
        "displayName": "ClaudeAPI",
        "category": "ai-provider",
        "keywords": [
          "claudeapi",
          "claude",
          "anthropic",
          "bedrock"
        ]
      },
      "claudecn": {
        "name": "claudecn",
        "displayName": "ClaudeCN",
        "category": "ai-provider",
        "keywords": [
          "claudecn",
          "claude",
          "enterprise"
        ]
      },
      "cloudflare": {
        "name": "cloudflare",
        "displayName": "Cloudflare",
        "category": "cloud",
        "keywords": [
          "cloudflare",
          "cdn"
        ],
        "defaultColor": "#F38020"
      },
      "code0": {
        "name": "code0",
        "displayName": "Code0",
        "category": "ai-provider",
        "keywords": [
          "code0",
          "code0ai",
          "aggregator",
          "relay",
          "gateway",
          "gpt"
        ],
        "defaultColor": "#20C050"
      },
      "cohere": {
        "name": "cohere",
        "displayName": "Cohere",
        "category": "ai-provider",
        "keywords": [
          "cohere"
        ],
        "defaultColor": "#39594D"
      },
      "copilot": {
        "name": "copilot",
        "displayName": "copilot",
        "category": "other",
        "keywords": [],
        "defaultColor": "currentColor"
      },
      "etok": {
        "name": "etok",
        "displayName": "ETok",
        "category": "ai-provider",
        "keywords": [
          "etok",
          "ai",
          "programming"
        ],
        "defaultColor": "#F97316"
      },
      "fenno": {
        "name": "fenno",
        "displayName": "FennoAI",
        "category": "ai-provider",
        "keywords": [
          "fenno",
          "fennoai",
          "aggregator",
          "relay",
          "claude",
          "codex",
          "gpt",
          "gateway"
        ],
        "defaultColor": "#000000"
      },
      "zetaapi": {
        "name": "zetaapi",
        "displayName": "ZetaAPI",
        "category": "ai-provider",
        "keywords": [
          "zetaapi",
          "zeta",
          "aggregator",
          "relay",
          "claude",
          "gpt",
          "gateway"
        ],
        "defaultColor": "#000000"
      },
      "teamorouter": {
        "name": "teamorouter",
        "displayName": "TeamoRouter",
        "category": "ai-provider",
        "keywords": [
          "teamorouter",
          "teamo",
          "router",
          "aggregator",
          "relay",
          "gateway",
          "gpt"
        ],
        "defaultColor": "#000000"
      },
      "cubence": {
        "name": "cubence",
        "displayName": "Cubence",
        "category": "ai-provider",
        "keywords": [
          "cubence",
          "api",
          "relay"
        ],
        "defaultColor": "#4B5563"
      },
      "deepseek": {
        "name": "deepseek",
        "displayName": "DeepSeek",
        "category": "ai-provider",
        "keywords": [
          "deep",
          "seek"
        ],
        "defaultColor": "#1E88E5"
      },
      "doubao": {
        "name": "doubao",
        "displayName": "doubao",
        "category": "other",
        "keywords": [],
        "defaultColor": "currentColor"
      },
      "gemini": {
        "name": "gemini",
        "displayName": "Gemini",
        "category": "ai-provider",
        "keywords": [
          "google"
        ],
        "defaultColor": "#4285F4"
      },
      "gemma": {
        "name": "gemma",
        "displayName": "gemma",
        "category": "other",
        "keywords": [],
        "defaultColor": "currentColor"
      },
      "github": {
        "name": "github",
        "displayName": "GitHub",
        "category": "tool",
        "keywords": [
          "git",
          "version control"
        ],
        "defaultColor": "#181717"
      },
      "githubcopilot": {
        "name": "githubcopilot",
        "displayName": "githubcopilot",
        "category": "other",
        "keywords": [],
        "defaultColor": "currentColor"
      },
      "google": {
        "name": "google",
        "displayName": "Google",
        "category": "ai-provider",
        "keywords": [
          "gemini",
          "bard"
        ],
        "defaultColor": "#4285F4"
      },
      "googlecloud": {
        "name": "googlecloud",
        "displayName": "googlecloud",
        "category": "other",
        "keywords": [],
        "defaultColor": "currentColor"
      },
      "grok": {
        "name": "grok",
        "displayName": "grok",
        "category": "other",
        "keywords": [],
        "defaultColor": "currentColor"
      },
      "huawei": {
        "name": "huawei",
        "displayName": "Huawei",
        "category": "cloud",
        "keywords": [
          "huawei",
          "cloud"
        ],
        "defaultColor": "#FF0000"
      },
      "huggingface": {
        "name": "huggingface",
        "displayName": "Hugging Face",
        "category": "ai-provider",
        "keywords": [
          "huggingface",
          "hf"
        ],
        "defaultColor": "#FFD21E"
      },
      "hunyuan": {
        "name": "hunyuan",
        "displayName": "hunyuan",
        "category": "other",
        "keywords": [],
        "defaultColor": "currentColor"
      },
      "kimi": {
        "name": "kimi",
        "displayName": "Kimi",
        "category": "ai-provider",
        "keywords": [
          "moonshot"
        ],
        "defaultColor": "#1783FF"
      },
      "meta": {
        "name": "meta",
        "displayName": "Meta",
        "category": "ai-provider",
        "keywords": [
          "facebook",
          "llama"
        ],
        "defaultColor": "#0081FB"
      },
      "midjourney": {
        "name": "midjourney",
        "displayName": "midjourney",
        "category": "other",
        "keywords": [],
        "defaultColor": "currentColor"
      },
      "minimax": {
        "name": "minimax",
        "displayName": "MiniMax",
        "category": "ai-provider",
        "keywords": [
          "minimax"
        ],
        "defaultColor": "#FF6B6B"
      },
      "zenmux": {
        "name": "zenmux",
        "displayName": "ZenMux",
        "category": "ai-provider",
        "keywords": [
          "zenmux",
          "zen",
          "mux"
        ],
        "defaultColor": "#6366F1"
      },
      "mistral": {
        "name": "mistral",
        "displayName": "Mistral",
        "category": "ai-provider",
        "keywords": [
          "mistral"
        ],
        "defaultColor": "#FF7000"
      },
      "nekocode": {
        "name": "nekocode",
        "displayName": "NekoCode",
        "category": "ai-provider",
        "keywords": [
          "nekocode",
          "neko",
          "aggregator",
          "relay",
          "gateway",
          "gpt"
        ],
        "defaultColor": "#A64BC4"
      },
      "newapi": {
        "name": "newapi",
        "displayName": "newapi",
        "category": "other",
        "keywords": [],
        "defaultColor": "currentColor"
      },
      "notion": {
        "name": "notion",
        "displayName": "notion",
        "category": "other",
        "keywords": [],
        "defaultColor": "currentColor"
      },
      "ollama": {
        "name": "ollama",
        "displayName": "ollama",
        "category": "other",
        "keywords": [],
        "defaultColor": "currentColor"
      },
      "openai": {
        "name": "openai",
        "displayName": "OpenAI",
        "category": "ai-provider",
        "keywords": [
          "gpt",
          "chatgpt"
        ],
        "defaultColor": "currentColor"
      },
      "openclaw": {
        "name": "openclaw",
        "displayName": "OpenClaw",
        "category": "ai-provider",
        "keywords": [
          "openclaw",
          "lobster",
          "claw"
        ],
        "defaultColor": "#ff4f40"
      },
      "hermes": {
        "name": "hermes",
        "displayName": "Hermes",
        "category": "ai-provider",
        "keywords": [
          "hermes",
          "agent",
          "nous",
          "nousresearch"
        ],
        "defaultColor": "#000000"
      },
      "packycode": {
        "name": "packycode",
        "displayName": "PackyCode",
        "category": "ai-provider",
        "keywords": [
          "packycode",
          "packy",
          "packyapi"
        ],
        "defaultColor": "currentColor"
      },
      "pateway": {
        "name": "pateway",
        "displayName": "PatewayAI",
        "category": "ai-provider",
        "keywords": [
          "pateway",
          "patewayai",
          "claude",
          "codex"
        ]
      },
      "palm": {
        "name": "palm",
        "displayName": "palm",
        "category": "other",
        "keywords": [],
        "defaultColor": "currentColor"
      },
      "perplexity": {
        "name": "perplexity",
        "displayName": "Perplexity",
        "category": "ai-provider",
        "keywords": [
          "perplexity"
        ],
        "defaultColor": "#20808D"
      },
      "qianwenai": {
        "name": "qianwenai",
        "displayName": "千问AI平台",
        "category": "ai-provider",
        "keywords": [
          "qianwenai",
          "qianwen",
          "qwen",
          "aliyun",
          "alibaba"
        ],
        "defaultColor": "#624AFF"
      },
      "qwen": {
        "name": "qwen",
        "displayName": "qwen",
        "category": "other",
        "keywords": [],
        "defaultColor": "currentColor"
      },
      "qwencloud": {
        "name": "qwencloud",
        "displayName": "QwenCloud",
        "category": "ai-provider",
        "keywords": [
          "qwencloud",
          "qwen",
          "aliyun",
          "alibaba"
        ],
        "defaultColor": "#6336E7"
      },
      "stability": {
        "name": "stability",
        "displayName": "stability",
        "category": "other",
        "keywords": [],
        "defaultColor": "currentColor"
      },
      "tencent": {
        "name": "tencent",
        "displayName": "Tencent",
        "category": "ai-provider",
        "keywords": [
          "hunyuan"
        ],
        "defaultColor": "#00A4FF"
      },
      "unity2": {
        "name": "unity2",
        "displayName": "Unity2.ai",
        "category": "ai-provider",
        "keywords": [
          "unity2",
          "aggregator",
          "relay",
          "claude",
          "codex",
          "gateway"
        ],
        "defaultColor": "#000000"
      },
      "vercel": {
        "name": "vercel",
        "displayName": "vercel",
        "category": "other",
        "keywords": [],
        "defaultColor": "currentColor"
      },
      "wenxin": {
        "name": "wenxin",
        "displayName": "wenxin",
        "category": "other",
        "keywords": [],
        "defaultColor": "currentColor"
      },
      "xai": {
        "name": "xai",
        "displayName": "xai",
        "category": "other",
        "keywords": [],
        "defaultColor": "currentColor"
      },
      "yi": {
        "name": "yi",
        "displayName": "yi",
        "category": "other",
        "keywords": [],
        "defaultColor": "currentColor"
      },
      "zeroone": {
        "name": "zeroone",
        "displayName": "zeroone",
        "category": "other",
        "keywords": [],
        "defaultColor": "currentColor"
      },
      "zhipu": {
        "name": "zhipu",
        "displayName": "Zhipu AI",
        "category": "ai-provider",
        "keywords": [
          "chatglm",
          "glm"
        ],
        "defaultColor": "#0F62FE"
      },
      "openrouter": {
        "name": "openrouter",
        "displayName": "OpenRouter",
        "category": "ai-provider",
        "keywords": [
          "openrouter",
          "router",
          "aggregator"
        ],
        "defaultColor": "#6566F1"
      },
      "pipellm": {
        "name": "pipellm",
        "displayName": "PIPELLM",
        "category": "ai-provider",
        "keywords": [
          "pipellm",
          "pipe"
        ],
        "defaultColor": "currentColor"
      },
      "qiniu": {
        "name": "qiniu",
        "displayName": "七牛云",
        "category": "ai-provider",
        "keywords": [
          "qiniu",
          "qnaigc",
          "modelink",
          "aggregator",
          "relay",
          "claude",
          "codex",
          "gpt",
          "gemini",
          "gateway"
        ],
        "defaultColor": "#00AAE7"
      },
      "runapi": {
        "name": "runapi",
        "displayName": "RunAPI",
        "category": "ai-provider",
        "keywords": [
          "runapi",
          "run",
          "aggregator",
          "gateway"
        ]
      },
      "relaxcode": {
        "name": "relaxcode",
        "displayName": "RelaxyCode",
        "category": "ai-provider",
        "keywords": [
          "relaxycode",
          "relaxcode",
          "relax"
        ]
      },
      "eflowcode": {
        "name": "eflowcode",
        "displayName": "E-FlowCode",
        "category": "ai-provider",
        "keywords": [
          "eflowcode",
          "e-flowcode",
          "flow"
        ],
        "defaultColor": "currentColor"
      },
      "shengsuanyun": {
        "name": "shengsuanyun",
        "displayName": "Shengsuanyun",
        "category": "ai-provider",
        "keywords": [
          "shengsuanyun",
          "shengsuanyun"
        ],
        "defaultColor": "currentColor"
      },
      "lioncc": {
        "name": "lioncc",
        "displayName": "LionCC",
        "category": "ai-provider",
        "keywords": [
          "lioncc",
          "lion"
        ],
        "defaultColor": "#F9DA3C"
      },
      "longcat": {
        "name": "longcat",
        "displayName": "LongCat",
        "category": "ai-provider",
        "keywords": [
          "longcat",
          "long",
          "cat"
        ],
        "defaultColor": "#29E154"
      },
      "modelscope": {
        "name": "modelscope",
        "displayName": "ModelScope",
        "category": "ai-provider",
        "keywords": [
          "modelscope",
          "alibaba",
          "scope"
        ],
        "defaultColor": "#624AFF"
      },
      "aihubmix": {
        "name": "aihubmix",
        "displayName": "AiHubMix",
        "category": "ai-provider",
        "keywords": [
          "aihubmix",
          "hub",
          "mix",
          "aggregator"
        ],
        "defaultColor": "#006FFB"
      },
      "xiaomimimo": {
        "name": "xiaomimimo",
        "displayName": "Xiaomi MiMo",
        "category": "ai-provider",
        "keywords": [
          "xiaomimimo",
          "xiaomi",
          "mimo"
        ],
        "defaultColor": "#000000"
      },
      "novita": {
        "name": "novita",
        "displayName": "Novita AI",
        "category": "ai-provider",
        "keywords": [
          "novita",
          "novita ai"
        ],
        "defaultColor": "#000000"
      },
      "nvidia": {
        "name": "nvidia",
        "displayName": "NVIDIA",
        "category": "ai-provider",
        "keywords": [
          "nvidia",
          "nim",
          "gpu"
        ],
        "defaultColor": "#74B71B"
      },
      "stepfun": {
        "name": "stepfun",
        "displayName": "StepFun",
        "category": "ai-provider",
        "keywords": [
          "stepfun",
          "step",
          "jieyue",
          "阶跃星辰"
        ],
        "defaultColor": "#005AFF"
      },
      "ppio": {
        "name": "ppio",
        "displayName": "PPIO",
        "category": "ai-provider",
        "keywords": [
          "ppio",
          "派欧云"
        ],
        "defaultColor": "#2874FF"
      },
      "jiekou": {
        "name": "jiekou",
        "displayName": "JieKou AI",
        "category": "ai-provider",
        "keywords": [
          "jiekou",
          "jiekou ai",
          "interface ai",
          "aggregator"
        ],
        "defaultColor": "#000000"
      },
      "xycai": {
        "name": "xycai",
        "displayName": "XycAi",
        "category": "ai-provider",
        "keywords": [
          "xycai",
          "xyc",
          "aggregator",
          "relay",
          "gateway",
          "token"
        ],
        "defaultColor": "#1E88E5"
      }
    }

    // ============================================================================
    // 宿主上下文访问器与辅助 (Host Context & Helpers)
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

    /**
     * The current-session selection left the Session Controller in dsh 0.2:
     * the list snapshot no longer carries `current`, and the main-view
     * selection is projected by the `uiSession` service as a binding source
     * whose `value.key` is the selected session id (`undefined` when no
     * session is materialized). Read the new source first and fall back to
     * the legacy `list.current` so older hosts keep working.
     */
    function currentSessionId(ctx, sessions) {
      try {
        var uiSession = ctx.get('uiSession')
        var current = uiSession === void 0 || uiSession === null ? null : uiSession.current
        var value = current === void 0 || current === null ? null : current.value
        if (value !== void 0 && value !== null && typeof value.key === 'string') return value.key
      } catch (error) { /* fall through to the legacy snapshot field */ }
      return sessions.list.getSnapshot().current
    }

    function currentSession(ctx) {
      var sessions = ctx.get('sessions')
      if (sessions === void 0 || sessions === null) return null
      var id = currentSessionId(ctx, sessions)
      if (id === void 0 || id === null) return null
      var binding = sessions.binding(id)
      if (binding === void 0 || binding === null) return null
      return binding.session === void 0 ? null : binding.session
    }

    function currentPreset(session) {
      try {
        var snapshot = session.projections.faceOf('permissions').getSnapshot()
        if (snapshot === void 0 || snapshot === null) return null
        // dsh 0.2+ projection faces hand back the bare value (e.g. the preset
        // id string); older hosts wrapped it as `{ currentValue }`.
        if (typeof snapshot === 'object' && 'currentValue' in snapshot) return snapshot.currentValue
        return snapshot
      } catch (error) {
        return null
      }
    }

    /**
     * Host-resolved username.
     *
     * The host half owns the OS user (`os.userInfo().username`); this side
     * fetches it once and caches it. A custom username from the settings page
     * always wins. No workspace parsing, no polling.
     */
    var usernameFromHost = ''
    var usernameRequested = false
    var usernameListeners = []

    function onUsernameLoaded(listener) {
      usernameListeners.push(listener)
      return function () {
        var index = usernameListeners.indexOf(listener)
        if (index !== -1) usernameListeners.splice(index, 1)
      }
    }

    function loadUsername() {
      if (usernameRequested) return
      usernameRequested = true
      if (typeof fetch !== 'function') return
      try {
        fetch(USERNAME_ROUTE, { credentials: 'same-origin' })
          .then(function (response) {
            if (!response.ok) throw new Error('HTTP ' + response.status)
            return response.json()
          })
          .then(function (data) {
            if (!data || data.ok !== true || typeof data.username !== 'string') return
            usernameFromHost = data.username.trim().slice(0, USERNAME_MAX)
            var listeners = usernameListeners.slice()
            for (var i = 0; i < listeners.length; i++) {
              try { listeners[i](usernameFromHost) } catch (error) { /* listener error */ }
            }
          })
          .catch(function () { /* custom username or 'User' stays */ })
      } catch (error) { /* no fetch: fallback stays */ }
    }

    function getUsername() {
      var custom = readPrefs().username || readFallbackUsername()
      if (custom) return custom
      if (usernameFromHost) return usernameFromHost
      return 'User'
    }

    /**
     * Host context reference for services that need to read host state
     * (e.g. locale) outside of apply(ctx)'s direct call stack.
     */
    var hostCtx = null
    function setHostContext(ctx) {
      hostCtx = ctx
      // A new host context means a new OS user; the next apply resolves once
      // again rather than reusing the previous host's cached name.
      usernameRequested = false
      usernameFromHost = ''
    }

    /**
     * Skin preferences.
     *
     * The authoritative store is the host settings namespace `claude-style`,
     * reached through this plugin's own route: the configuration client
     * (`settingsScope`) only reaches namespaces the api-proxy exposes to it, and
     * a plugin's own namespace is not on that list. `src/../lib/index.js` owns
     * the namespace and the route; this side only reads and writes it.
     *
     * Every value is mirrored onto the document as an attribute, so the
     * stylesheet — not this module — decides what a preference means visually.
     * Until the first read settles (and if it fails) the defaults below hold,
     * which is exactly the shipped behaviour.
     */
    /**
     * Browser-local fallback for the account-hold page's language.
     *
     * Same contract as the username fallback below, and needed for the same
     * reason: this bundle reloads with the page, but the host half is imported
     * once when the app boots, so a running host half can predate the field.
     * Without the fallback the choice SILENTLY REVERTS — the old host half has
     * no `banLocale` in its accepted-key list, drops the unknown key, and
     * answers the write with its unchanged value, so the segment flips back
     * with nothing to explain it.
     */
    var BAN_LOCALE_STORAGE_KEY = 'dsh-claude-style.banLocale'
    var fallbackBanLocale = readStoredBanLocale()

    function readStoredBanLocale() {
      try {
        if (typeof localStorage === 'undefined') return ''
        var stored = localStorage.getItem(BAN_LOCALE_STORAGE_KEY) || ''
        return BAN_LOCALES.indexOf(stored) === -1 ? '' : stored
      } catch (error) {
        return ''
      }
    }

    /** Persist (or clear) the local language choice; anything else is refused. */
    function setFallbackBanLocale(value) {
      fallbackBanLocale = BAN_LOCALES.indexOf(value) === -1 ? '' : value
      try {
        if (typeof localStorage === 'undefined') return
        if (fallbackBanLocale) localStorage.setItem(BAN_LOCALE_STORAGE_KEY, fallbackBanLocale)
        else localStorage.removeItem(BAN_LOCALE_STORAGE_KEY)
      } catch (error) { /* storage may be unavailable */ }
    }

    /**
     * The language the account-hold page is written in.
     *
     * The local fallback outranks the host value while it exists: it is only
     * ever set when the host refused the write, and `savePrefs` clears it the
     * moment the host confirms the same value — so a stale host half cannot
     * revert the choice, and a reloaded one takes over on its own.
     */
    function resolveBanLocale(hostValue) {
      if (fallbackBanLocale) return fallbackBanLocale
      return BAN_LOCALES.indexOf(hostValue) === -1 ? DEFAULT_BAN_LOCALE : hostValue
    }

    var prefs = {
      brand: DEFAULT_BRAND,
      collapseFooter: true,
      autoPopover: true,
      composerScope: 'all',
      username: '',
      banLocale: fallbackBanLocale || DEFAULT_BAN_LOCALE,
    }
    var prefsRevision
    var prefsAvailable = false
    var prefsListeners = []

    /**
     * Browser-local fallback for the custom username.
     *
     * The host settings namespace is the authoritative store, but a running
     * host half may predate the `username` field. Persisting the value here
     * keeps the setting usable until the host is reloaded, and the host value
     * always wins once it carries a non-empty username.
     */
    var USERNAME_STORAGE_KEY = 'dsh-claude-style.username'
    var fallbackUsername = ''
    try {
      fallbackUsername = typeof localStorage === 'undefined' ? '' : (localStorage.getItem(USERNAME_STORAGE_KEY) || '')
    } catch (error) { fallbackUsername = '' }

    function readFallbackUsername() {
      return fallbackUsername
    }

    function setFallbackUsername(value) {
      fallbackUsername = value
      try {
        if (typeof localStorage === 'undefined') return
        if (value) localStorage.setItem(USERNAME_STORAGE_KEY, value)
        else localStorage.removeItem(USERNAME_STORAGE_KEY)
      } catch (error) { /* storage may be unavailable */ }
    }

    /** The current preferences (live object; treat as read-only). */
    function readPrefs() {
      return prefs
    }

    /** Observe preference changes; returns the unsubscriber. */
    function subscribePrefs(listener) {
      prefsListeners.push(listener)
      return function () {
        var index = prefsListeners.indexOf(listener)
        if (index !== -1) prefsListeners.splice(index, 1)
      }
    }

    /**
     * Adopt a preference set: mirror it onto the document, then notify.
     * @param next - resolved preferences from the host.
     */
    function adoptPrefs(next) {
      prefs = next
      // The brand is one attribute write; the other preferences gate rules the
      // stylesheet and the scheduler read directly.
      document.body.setAttribute(BRAND_ATTR, next.brand)
      if (next.collapseFooter) document.body.setAttribute(FOOTER_ATTR, '')
      else document.body.removeAttribute(FOOTER_ATTR)
      var listeners = prefsListeners.slice()
      for (var i = 0; i < listeners.length; i++) {
        try {
          listeners[i](next)
        } catch (error) { /* one bad listener must not stop the rest */ }
      }
    }

    /**
     * Read the preferences once. A failure keeps the defaults and leaves the
     * settings page to report that the store is unavailable.
     */
    function loadPrefs() {
      if (typeof fetch !== 'function') return
      try {
        fetch(PREFS_ROUTE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: '{}',
        })
          .then(function (response) {
            return response.json()
          })
          .then(function (data) {
            if (!data || data.ok !== true) return
            prefsRevision = data.revision
            prefsAvailable = data.available === true
            var hostName = data.value && typeof data.value.username === 'string' ? data.value.username.trim() : ''
            if (hostName) setFallbackUsername('')
            adoptPrefs(normalizePrefs(data.value))
            replayPendingBanLocale(data.value)
          })
          .catch(function () { /* defaults stay */ })
      } catch (error) { /* no fetch: defaults stay */ }
    }

    /** Clamp one host value into the preference shape (the host already did this). */
    function normalizePrefs(value) {
      var section = value && typeof value === 'object' ? value : {}
      return {
        brand: section.brand === BRAND_ANTHROPIC || section.brand === BRAND_OFF ? section.brand : BRAND_CLAUDE,
        collapseFooter: section.collapseFooter !== false,
        autoPopover: section.autoPopover !== false,
        composerScope: COMPOSER_SCOPES.indexOf(section.composerScope) === -1 ? 'all' : section.composerScope,
        username: (typeof section.username === 'string' ? section.username.trim().slice(0, USERNAME_MAX) : '') || fallbackUsername,
        banLocale: resolveBanLocale(section.banLocale),
      }
    }

    /**
     * Replay a language that was chosen while the running host half did not know
     * the field yet.
     *
     * Once per load, and only while a local fallback exists: on a host half that
     * still predates `banLocale` the write is dropped again (the fallback keeps
     * the choice), and on a reloaded one it lands, `savePrefs` sees the host echo
     * the value back and drops the fallback — so the setting migrates itself
     * instead of having to be picked again after the app restarts.
     */
    var banLocaleReplayed = false
    function replayPendingBanLocale(hostValue) {
      if (banLocaleReplayed || !fallbackBanLocale) return
      var hostLocale = hostValue && typeof hostValue.banLocale === 'string' ? hostValue.banLocale : ''
      if (hostLocale === fallbackBanLocale) return
      banLocaleReplayed = true
      savePrefs({ banLocale: fallbackBanLocale })
    }

    /**
     * Write a partial preference change.
     *
     * The revision travels with the write so a concurrent move of the namespace
     * is rejected rather than silently overwritten; on that rejection the
     * authoritative value is re-read.
     *
     * @param patch - preference keys to change.
     * @returns a promise for the resolved preferences, or null when unavailable.
     */
    function savePrefs(patch) {
      if (typeof fetch !== 'function') return Promise.resolve(null)
      var body = { revision: prefsRevision }
      for (var key in patch) body[key] = patch[key]
      return fetch(PREFS_ROUTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(body),
      })
        .then(function (response) {
          return response.json().then(function (data) {
            return { status: response.status, data: data }
          })
        })
        .then(function (result) {
          var data = result.data
          if (data && data.ok === true) {
            prefsRevision = data.revision
            prefsAvailable = data.available === true
            if (typeof patch.username === 'string') {
              var hostName = data.value && typeof data.value.username === 'string' ? data.value.username.trim() : ''
              setFallbackUsername(hostName ? '' : patch.username)
            }
            // The host echoing the value back is the only proof it knows the
            // field; anything else (no value at all, or a different one) means
            // the write did not land and the local fallback has to keep it.
            if (typeof patch.banLocale === 'string') {
              var hostLocale = data.value && typeof data.value.banLocale === 'string' ? data.value.banLocale : ''
              setFallbackBanLocale(hostLocale === patch.banLocale ? '' : patch.banLocale)
            }
            adoptPrefs(normalizePrefs(data.value))
            return prefs
          }
          // Conflict or refusal: re-read rather than guess.
          loadPrefs()
          return null
        })
        .catch(function () {
          return null
        })
    }

    /**
     * The brand to show. `off` leaves the brand area entirely to the host, so
     * the stylesheet matches neither brand variant for it.
     *
     * @param brand - the stored choice.
     * @returns the brand actually applied.
     */
    function applyBrand(brand) {
      var next = brand === BRAND_ANTHROPIC || brand === BRAND_OFF ? brand : BRAND_CLAUDE
      document.body.setAttribute(BRAND_ATTR, next)
      return next
    }

    /**
     * Model & settings localized copy.
     *
     * The copy document ships as `model-descriptions.json` beside the bundle.
     * Both the model picker (src/overrides/model-picker.js) and the settings section
     * (src/settings.js) consume this copy, so the state lives in the shared context.
     * where both zones can reach it.
     */
    var modelCopy = null
    var modelCopyRequested = false
    var modelCopyListeners = []

    function onModelCopyLoaded(listener) {
      modelCopyListeners.push(listener)
      return function () {
        var index = modelCopyListeners.indexOf(listener)
        if (index !== -1) modelCopyListeners.splice(index, 1)
      }
    }

    /**
     * Fetch the model copy document the host half serves.
     */
    function loadModelCopy() {
      if (modelCopyRequested) return
      modelCopyRequested = true
      if (typeof fetch !== 'function') return
      try {
        fetch(MODEL_COPY_ROUTE, { credentials: 'same-origin' })
          .then(function (response) {
            if (!response.ok) throw new Error('HTTP ' + response.status)
            return response.json()
          })
          .then(function (doc) {
            modelCopy = indexModelCopy(doc)
            if (modelCopy === null) return
            var listeners = modelCopyListeners.slice()
            for (var i = 0; i < listeners.length; i++) {
              try {
                listeners[i](modelCopy)
              } catch (error) { /* listener error */ }
            }
          })
          .catch(function () { /* fallback copy stays */ })
      } catch (error) { /* no fetch: fallback copy stays */ }
    }

    /**
     * Compile a copy document into the shape lookups want: a folded id index,
     * the alias table, and the rule lists with their regexps built once.
     * @param doc - parsed document; anything malformed is dropped, not fatal.
     * @returns the index, or null when the document is unusable.
     */
    function indexModelCopy(doc) {
      if (!doc || typeof doc !== 'object') return null
      var exact = doc.exact && typeof doc.exact === 'object' ? doc.exact : {}
      var brands = doc.brands && typeof doc.brands === 'object' ? doc.brands : {}
      var index = {
        ui: doc.ui && typeof doc.ui === 'object' ? doc.ui : {},
        settings: doc.settings && typeof doc.settings === 'object' ? doc.settings : {},
        // The account-hold easter egg's page copy rides the same document
        // (src/overrides/ban-screen.js). Every block the document carries has to
        // be listed here: this index IS what lookups read, so an unlisted block
        // would silently fall back to the bundle's English constants.
        ban: doc.ban && typeof doc.ban === 'object' ? doc.ban : {},
        exact: exact,
        aliases: doc.aliases && typeof doc.aliases === 'object' ? doc.aliases : {},
        fallback: typeof doc.fallback === 'string' && doc.fallback ? doc.fallback : MODEL_COPY_FALLBACK_LOCALE,
        folded: {},
        foldedAliases: {},
        families: [],
        tiers: [],
        providerBrands: brands.providers && typeof brands.providers === 'object' ? brands.providers : {},
        brandRules: [],
      }
      for (var id in exact) index.folded[normalizeModelId(id)] = exact[id]
      for (var a in index.aliases) {
        index.foldedAliases[normalizeModelId(a)] = index.aliases[a]
        index.foldedAliases[a.toLowerCase()] = index.aliases[a]
      }
      var compile = function (rules) {
        var out = []
        for (var i = 0; i < (rules || []).length; i++) {
          var rule = rules[i]
          if (!rule || typeof rule.match !== 'string') continue
          try {
            out.push({ re: new RegExp(rule.match, 'i'), key: rule.key, text: rule.text })
          } catch (error) { /* a malformed rule is skipped, not fatal */ }
        }
        return out
      }
      index.families = compile(doc.families)
      index.tiers = compile(doc.tiers)
      // Brand rules carry no copy, only the mark's id; the build has already
      // checked every id against the vendored marks.
      var brandRules = []
      for (var b = 0; b < (brands.models || []).length; b++) {
        var brandRule = brands.models[b]
        if (!brandRule || typeof brandRule.match !== 'string' || typeof brandRule.brand !== 'string') continue
        try {
          brandRules.push({ re: new RegExp(brandRule.match, 'i'), brand: brandRule.brand })
        } catch (error) { /* a malformed rule is skipped, not fatal */ }
      }
      index.brandRules = brandRules
      return index
    }

    /** Fold case and separators so `glm-5.3-flash` and `glm-5-3-flash` agree. */
    function normalizeModelId(id) {
      return String(id === void 0 || id === null ? '' : id).toLowerCase().replace(/[^a-z0-9]/g, '')
    }

    /** The shell's active locale id, or the document fallback when it cannot be read. */
    function activeLocale(ctx) {
      var c = ctx || hostCtx
      try {
        if (c && typeof c.get === 'function') {
          var locale = c.get('locale')
          if (locale && typeof locale.getSnapshot === 'function') {
            var active = locale.getSnapshot().active
            if (typeof active === 'string' && active) return active
          }
        }
      } catch (error) { /* no locale service: keep the fallback language */ }
      return modelCopy === null ? MODEL_COPY_FALLBACK_LOCALE : modelCopy.fallback
    }

    /** One localized string out of a `{ locale: text }` pair, fallback locale last. */
    function localized(pair, ctx) {
      if (!pair || typeof pair !== 'object') return ''
      var loc = activeLocale(ctx)
      var text = pair[loc]
      if (typeof text === 'string' && text) return text
      var prefix = typeof loc === 'string' && loc.indexOf('-') !== -1 ? loc.split('-')[0] : (typeof loc === 'string' && loc.indexOf('_') !== -1 ? loc.split('_')[0] : '')
      if (prefix && typeof pair[prefix] === 'string' && pair[prefix]) return pair[prefix]
      var fallback = modelCopy === null ? MODEL_COPY_FALLBACK_LOCALE : modelCopy.fallback
      var backstop = pair[fallback]
      if (typeof backstop === 'string' && backstop) return backstop
      var fallbackPrefix = typeof fallback === 'string' && fallback.indexOf('-') !== -1 ? fallback.split('-')[0] : ''
      if (fallbackPrefix && typeof pair[fallbackPrefix] === 'string' && pair[fallbackPrefix]) return pair[fallbackPrefix]
      return ''
    }

    /**
     * One picker label: the document's localized string, else the neutral
     * English constant the bundle carries. `{name}` placeholders are filled
     * from `params`, so a label with a slot stays translatable.
     */
    function copyLabel(key, fallback, params) {
      var text = modelCopy === null || !modelCopy.ui ? '' : localized(modelCopy.ui[key])
      if (!text) text = fallback
      if (!params) return text
      return text.replace(/\{(\w+)\}/g, function (match, name) {
        return Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : match
      })
    }

    /**
     * One settings-page string. The settings copy rides the same document as
     * the picker copy, so the page follows the shell language too — and the
     * English constants stay as the fallback for a failed fetch.
     */
    function settingsCopy(key, fallback) {
      var text = modelCopy === null || !modelCopy.settings ? '' : localized(modelCopy.settings[key])
      return text || fallback
    }

    /**
     * One account-hold easter-egg string, in the language the `banLocale`
     * preference names — NOT the shell's language. The page reproduces a real
     * Claude screen, so it is read in the language Claude wrote it in whatever
     * the rest of the UI is set to; `localized` is bypassed on purpose rather
     * than fed a fake locale, so a missing translation still falls through the
     * document's own fallback locale.
     */
    function banCopy(key, fallback, params) {
      var pair = modelCopy === null || !modelCopy.ban ? null : modelCopy.ban[key]
      var want = readPrefs().banLocale
      var text = pair && typeof pair === 'object' && typeof pair[want] === 'string' ? pair[want] : ''
      if (!text) text = localized(pair)
      if (!text) text = fallback
      if (!params) return text
      return text.replace(/\{(\w+)\}/g, function (match, name) {
        return Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : match
      })
    }

    // ============================================================================
    // 弹层共享辅助 (Shared Popover Helpers)
    // ============================================================================
    var POPOVER_MARGIN = 8

    /**
     * Position a fixed-position popover relative to its trigger.
     *
     * `side: 'right'` opens to the trigger's right and bottom-aligns it (the
     * account popover in the rail). The default `side: 'above'` right-aligns
     * the popover with the trigger and opens above it with `gap` spacing (the
     * model picker). `important` switches to `style.setProperty(..., 'important')`
     * and rounds the coordinates, as the account popover requires.
     *
     * @param trigger - element the popover is anchored to.
     * @param pop - the fixed-position popover element.
     * @param opts - `{ side, gap, important }`.
     * @returns the chosen `{ x, y }` in viewport coordinates.
     */
    function positionAnchoredPopover(trigger, pop, opts) {
      opts = opts || {}
      var rect = trigger.getBoundingClientRect()
      var width = pop.offsetWidth
      var height = pop.offsetHeight
      var margin = opts.margin || POPOVER_MARGIN
      var x
      var y
      if (opts.side === 'right') {
        x = rect.right + margin
        if (x + width > window.innerWidth - margin) {
          x = Math.max(margin, rect.left - margin - width)
        }
        y = Math.min(Math.max(margin, rect.bottom - height), Math.max(margin, window.innerHeight - height - margin))
      } else {
        x = Math.max(margin, Math.min(rect.right - width, window.innerWidth - width - margin))
        y = rect.top - (opts.gap || 0) - height
        if (y < margin) y = Math.min(rect.bottom + (opts.gap || 0), Math.max(margin, window.innerHeight - height - margin))
      }
      if (opts.important) {
        pop.style.setProperty('left', Math.round(x) + 'px', 'important')
        pop.style.setProperty('top', Math.round(y) + 'px', 'important')
      } else {
        pop.style.left = x + 'px'
        pop.style.top = y + 'px'
      }
      return { x: x, y: y }
    }

    /**
     * Hover-intent helper shared by the model picker and account popover.
     *
     * The `open` callback is part of the shared signature but the original
     * hover behaviour only schedules the close side (mouseenter calls the
     * feature's open function directly); keeping the parameter makes the two
     * call sites symmetrical.
     */
    function createHoverIntent(open, close, delay) {
      var timer = null
      return {
        cancel: function () {
          if (timer) {
            clearTimeout(timer)
            timer = null
          }
        },
        scheduleClose: function () {
          if (timer) clearTimeout(timer)
          timer = setTimeout(close, delay)
        },
      }
    }

    // ============================================================================
    // 文本选区焦点态 (Text Selection Focus State)
    // ============================================================================
    /**
     * Text selection has two paints and CSS cannot tell them apart: gray on
     * black while the browser window is unfocused, blue on white while it is
     * focused. Chromium reaches that difference through its own internal
     * selection colors (`-internal-inactive-selection-*`), which a stylesheet
     * cannot address — so the focus state is mirrored onto the document here
     * and `src/styles/chrome.css` switches on the attribute. Nothing else about
     * the selection is stateful; the paint itself stays pure CSS.
     *
     * `blur`/`focus` on the window are the events that matter (a click on
     * another window, Alt+Tab, a devtools focus), and `document.hasFocus()`
     * seeds the state so a page loaded in a background tab is unfocused from
     * its first paint instead of inheriting the focused default.
     */
    function installSelectionFocus() {
      var body = document.body

      function sync() {
        if (document.hasFocus()) body.removeAttribute(WINDOW_BLUR_ATTR)
        else body.setAttribute(WINDOW_BLUR_ATTR, '')
      }

      // Capture phase: the events are dispatched at the window, so the flag
      // records the transition before anything downstream can stop it.
      window.addEventListener('focus', sync, true)
      window.addEventListener('blur', sync, true)
      sync()

      return function () {
        window.removeEventListener('focus', sync, true)
        window.removeEventListener('blur', sync, true)
        body.removeAttribute(WINDOW_BLUR_ATTR)
      }
    }

    // ============================================================================
    // 文案改写 (Copy Rewrites)
    // ============================================================================
    function installCopy(ctx, ui) {
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
        var greeting = pickHeroGreeting(getUsername(ctx))
        var groups = document.querySelectorAll('[class*="titleGroup"]')
        for (var i = 0; i < groups.length; i++) {
          var spans = groups[i].children
          for (var j = 0; j < spans.length; j++) {
            var span = spans[j]
            var cls = span.getAttribute('class') || ''
            if (cls.indexOf('previewBadge') !== -1) continue
            if (span.textContent !== greeting) span.textContent = greeting
            break
          }
        }
      }

      function isHeroView() {
        var hasTurns = document.querySelector('[class*="turn"], [class*="message"], [data-turn], [data-message-id]') !== null
        return !hasTurns && (document.querySelector('[class*="composerHero"], [data-phase="hero"]') !== null)
      }

      function isComposerActive() {
        var isHero = isHeroView()
        var scope = readPrefs().composerScope
        return scope === 'all' || (isHero ? scope === 'hero' : scope === 'conversation')
      }

      function rewriteHint() {
        if (!isComposerActive()) return
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
        syncAttachmentPlaceholder()
      }

      function syncAttachmentPlaceholder() {
        if (!isComposerActive()) {
          var synths = document.querySelectorAll('[data-dsh-synthetic-placeholder]')
          for (var si = 0; si < synths.length; si++) {
            if (synths[si].parentElement) synths[si].parentElement.removeChild(synths[si])
          }
          return
        }
        var isHero = document.querySelector('[class*="heroWorkspaceRow"], [class*="titleGroup"]') !== null
        var targetHint = isHero ? COMPOSER_HINT : 'Type / for commands'
        var cards = document.querySelectorAll('[data-composer-card]')
        for (var ci = 0; ci < cards.length; ci++) {
          var card = cards[ci]
          var input = card.querySelector('[data-composer-input]')
          if (!input) continue
          var text = (input.textContent || '').replace(/[\u200B-\u200D\uFEFF]/g, '').trim()
          var isEmpty = text.length === 0
          var placeholder = card.querySelector('[data-composer-placeholder]')
          var grow = input.closest ? input.closest('[class*="grow"]') : input.parentElement

          if (isEmpty) {
            if (!placeholder && grow) {
              placeholder = document.createElement('div')
              placeholder.setAttribute('data-composer-placeholder', '')
              placeholder.setAttribute('data-dsh-synthetic-placeholder', 'true')
              placeholder.textContent = targetHint
              grow.appendChild(placeholder)
            } else if (placeholder) {
              if (placeholder.style.display === 'none') placeholder.style.display = ''
              var curText = placeholder.textContent || ''
              var idle = false
              for (var j = 0; j < HINT_SOURCES.length; j++) {
                if (curText.indexOf(HINT_SOURCES[j]) === 0) {
                  idle = true
                  break
                }
              }
              if (idle && curText !== targetHint) placeholder.textContent = targetHint
            }
          } else {
            if (placeholder && placeholder.hasAttribute('data-dsh-synthetic-placeholder')) {
              if (placeholder.parentElement) placeholder.parentElement.removeChild(placeholder)
            }
          }
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


      ui.copy = {
        sync: function () {
          rewriteHeadline()
          rewriteHint()
          rewriteTurnStatus()
        },
        syncGreeting: function () {
          rewriteHeadline()
        },
        syncAttachmentPlaceholder: syncAttachmentPlaceholder,
        isHeroView: isHeroView,
        isComposerActive: isComposerActive
      }

      return function () {}
    }

    // ============================================================================
    // 权限段控件与会话内弹层 (Permission Segments & Popover)
    // ============================================================================
    function installPermissions(ctx, ui) {
      var segments = null
      var permContainer = null
      var permBtn = null
      var permLabel = null
      var permPopover = null
      var permHoverIntent = null

      function buildSegments(onPick) {
        var group = document.createElement('div')
        group.className = SEGMENTS_CLASS
        group.setAttribute('role', 'radiogroup')
        group.setAttribute('aria-label', 'Permission')
        group.setAttribute('data-composer-segments', '')
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

      /** Every dismiss route (item pick, outside pointer, resize/scroll, Escape) closes the menu through this one path. */
      function closePermMenu() {
        if (permBtn === null || permPopover === null) return
        permBtn.removeAttribute('data-open')
        permBtn.setAttribute('aria-expanded', 'false')
        permPopover.removeAttribute('data-open')
      }

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
              closePermMenu()
              onPick(preset)
            }
          })(opt.preset))

          popover.appendChild(item)
        }

        function openPerm() {
          if (permHoverIntent) permHoverIntent.cancel()
          var rect = btn.getBoundingClientRect()
          popover.style.left = Math.max(8, rect.left) + 'px'
          popover.style.bottom = Math.max(8, window.innerHeight - rect.top + 6) + 'px'
          btn.setAttribute('data-open', 'true')
          btn.setAttribute('aria-expanded', 'true')
          popover.setAttribute('data-open', 'true')
        }

        permHoverIntent = createHoverIntent(openPerm, closePermMenu, 150)

        btn.addEventListener('mouseenter', function () {
          if (readPrefs().autoPopover) openPerm()
        })
        btn.addEventListener('mouseleave', function () {
          if (readPrefs().autoPopover) permHoverIntent.scheduleClose()
        })
        popover.addEventListener('mouseenter', function () {
          permHoverIntent.cancel()
        })
        popover.addEventListener('mouseleave', function () {
          permHoverIntent.scheduleClose()
        })

        btn.addEventListener('click', function (e) {
          e.stopPropagation()
          var isOpen = btn.getAttribute('data-open') === 'true'
          if (isOpen) {
            closePermMenu()
          } else {
            openPerm()
          }
        })

        if (!permDocPointerListener) {
          permDocPointerListener = function (e) {
            if (permPopover && permBtn && permPopover.getAttribute('data-open') === 'true') {
              if (!permBtn.contains(e.target) && !permPopover.contains(e.target)) closePermMenu()
            }
          }
          document.addEventListener('pointerdown', permDocPointerListener)
        }

        if (!permResizeListener) {
          permResizeListener = function () {
            if (permPopover && permBtn && permPopover.getAttribute('data-open') === 'true') closePermMenu()
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
        if (settled !== void 0 && typeof settled.then === 'function') settled.then(ui.schedule, ui.schedule)
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
        var active = ui.copy.isComposerActive()
        var cards = document.querySelectorAll('[data-composer-card]')
        for (var ci = 0; ci < cards.length; ci++) {
          var card = cards[ci]
          if (!active) {
            if (card.hasAttribute('data-has-attachments')) {
              card.removeAttribute('data-has-attachments')
            }
            continue
          }
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
        if (ui.copy && ui.copy.syncAttachmentPlaceholder) ui.copy.syncAttachmentPlaceholder()
      }

      /**
       * Merge the session-stats pills into the composer toolbar row so the
       * controls and the stats share ONE line. The host renders the pills
       * (the `conversation.composer.dock` slot) as the card's sibling — a
       * full-width line of their own below the input box; the skin moves
       * them into the row, right before the trailing model/status group.
       * A host re-render can put them back, so the move is re-applied on
       * every pass and is a no-op once they are in place.
       */
      function mergeStatsIntoRow() {
        var stats = document.querySelector('[data-composer-stats]')
        if (!stats) return
        var active = ui.copy.isComposerActive()
        if (!active) {
          if (stats.parentElement && stats.parentElement.matches && stats.parentElement.matches('[class*="_row"]')) {
            var card = stats.closest('[data-composer-card]')
            if (card && card.parentElement) {
              card.parentElement.insertBefore(stats, card.nextSibling)
            }
          }
          return
        }
        // `[class*="_row"]`, not `[class*="row"]`: the bare substring also
        // matches the input growth wrapper (`grow` contains `row`).
        var row = null
        if (stats.parentElement && stats.parentElement.matches && stats.parentElement.matches('[class*="_row"]')) {
          row = stats.parentElement
        } else {
          // Host default: the pills sit in a slot anchor beside the card.
          // Walk up to the nearest ancestor that also holds a composer card.
          var node = stats.parentElement
          while (node && node !== document.body && row === null) {
            var card = node.querySelector('[data-composer-card]')
            if (card) {
              var r = card.querySelector('[class*="_row"]')
              if (r) row = r
            }
            node = node.parentElement
          }
        }
        if (row === null) return
        var trailing = row.querySelector('[class*="trailing"]')
        var inPlace = stats.parentElement === row &&
          (trailing !== null ? stats.nextElementSibling === trailing : row.lastElementChild === stats)
        if (inPlace) return
        if (trailing !== null) row.insertBefore(stats, trailing)
        else row.appendChild(stats)
      }

      // Re-insert when a re-render swapped the host row, then mirror the running preset.
      function syncSegments() {
        var isHero = ui.copy.isHeroView()
        var value = isHero ? 'hero' : 'inline'
        var allCards = document.querySelectorAll('[data-composer-card]')
        // Mirror the variant onto the card's composerStack ancestor, so
        // stack-scoped rules read an attribute instead of re-deriving
        // hero/inline through :has() on every DOM mutation. Write only when
        // the value differs (re-setting the same value still invalidates
        // the element's styles), and once per stack even when several cards
        // share one.
        var syncedStacks = []
        for (var c = 0; c < allCards.length; c++) {
          var card = allCards[c]
          card.setAttribute('data-composer-variant', value)
          var stack = card.closest('[class*="composerStack"]')
          if (stack !== null && syncedStacks.indexOf(stack) === -1) {
            if (stack.getAttribute('data-composer-variant') !== value) {
              stack.setAttribute('data-composer-variant', value)
            }
            syncedStacks.push(stack)
          }
        }

        var composerOn = ui.copy.isComposerActive()
        if (composerOn) document.body.setAttribute(COMPOSER_ATTR, '')
        else document.body.removeAttribute(COMPOSER_ATTR)

        var existingPermContainers = document.querySelectorAll('.dsh-claude-perm-container')
        var existingSegments = document.querySelectorAll('.' + SEGMENTS_CLASS + '[data-composer-segments]')

        if (!composerOn) {
          for (var ep = 0; ep < existingPermContainers.length; ep++) {
            existingPermContainers[ep].remove()
          }
          if (permPopover && permPopover.parentElement) {
            permPopover.parentElement.removeChild(permPopover)
          }
          permContainer = null
          permBtn = null
          permLabel = null
          permPopover = null

          for (var es0 = 0; es0 < existingSegments.length; es0++) {
            existingSegments[es0].remove()
          }
          segments = null
          return
        }

        var trigger = findAccessTrigger()
        if (trigger === null) return
        var host = trigger.parentElement
        if (host === null) return

        var session = currentSession(ctx)
        var preset = session === null ? null : currentPreset(session)

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

      /**
       * The composer is chat-view-only. The host mounts the seat inside the
       * conversation root on every tab (轨迹 / 上下文 even reserve room for
       * it), so the skin reflects the active view on <body> and CSS drops the
       * whole bottom area unless the chat tab is selected.
       *
       * Scope: the conversation tablist lives in the panel header, which is
       * the root's first child — any other tablist (the trajectory detail
       * panel, say) renders later inside the ledger. The chat view registers
       * at order 0, so it is always the tablist's FIRST tab; reading that
       * tab's aria-selected is locale-independent. No tab bar at all (hero /
       * single view) means the chat surface is all there is.
       */
      function syncChatTabComposer() {
        if (!ui.copy.isComposerActive()) {
          document.body.removeAttribute('data-dsh-claude-composer-hidden')
          return
        }
        var chatActive = true
        var seat = document.querySelector('[data-composer-seat]')
        var root = seat && seat.closest ? seat.closest('[data-phase]') : null
        if (root) {
          var list = root.querySelector('[role="tablist"]')
          if (list) {
            var first = list.querySelector('[role="tab"]')
            if (first) chatActive = first.getAttribute('aria-selected') === 'true'
          }
        }
        if (chatActive) document.body.removeAttribute('data-dsh-claude-composer-hidden')
        else document.body.setAttribute('data-dsh-claude-composer-hidden', '')
      }


      /**
       * Merge the host's time and usage pills into one compact sentence and
       * write it into CSS variables. The host keeps ownership of the data and
       * the two click targets; CSS hides its icons/labels and renders the
       * combined text, so React never sees its own DOM rewritten.
       */
      var statsPopover = null
      var statsHideTimer = null

      function statsEscape(value) {
        return String(value === void 0 || value === null ? '' : value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
      }

      function statsRowsFrom(panel) {
        var rows = []
        if (panel === null) return rows
        var dts = panel.querySelectorAll('dt')
        for (var i = 0; i < dts.length; i++) {
          var dd = dts[i].nextElementSibling
          rows.push({
            label: (dts[i].textContent || '').trim(),
            value: dd === null ? '' : (dd.textContent || '').trim(),
          })
        }
        return rows
      }

      function statsPanelData(selector) {
        var panel = document.querySelector(selector)
        return {
          title: panel === null ? '' : (panel.getAttribute('aria-label') || ''),
          rows: statsRowsFrom(panel),
        }
      }

      function withStatsPanel(button, selector, done) {
        if (button === null) { done({ title: '', rows: [] }); return }
        if (button.getAttribute('aria-expanded') !== 'true') button.click()
        var attempts = 0
        function read() {
          var panel = document.querySelector(selector)
          if (panel === null && attempts < 15) {
            attempts += 1
            setTimeout(read, 20)
            return
          }
          var data = statsPanelData(selector)
          if (button.getAttribute('aria-expanded') === 'true') button.click()
          done(data)
        }
        setTimeout(read, 20)
      }

      function collectStatsData(done) {
        var root = document.querySelector('[data-composer-stats]')
        if (root === null) { done([]); return }
        var buttons = root.querySelectorAll('button')
        var timeBtn = null
        var usageBtn = null
        for (var i = 0; i < buttons.length; i++) {
          var aria = buttons[i].getAttribute('aria-label') || ''
          if (/轮|步|turns?|steps?/i.test(aria)) timeBtn = buttons[i]
          else usageBtn = buttons[i]
        }
        withStatsPanel(timeBtn, '[role="dialog"]:has([data-session-stats-details])', function (timeData) {
          withStatsPanel(usageBtn, '[role="dialog"]:has([data-session-stats-usage])', function (usageData) {
            var sections = []
            if (timeData.rows.length > 0) sections.push(timeData)
            if (usageData.rows.length > 0) sections.push(usageData)
            done(sections)
          })
        })
      }

      function ensureStatsPopover() {
        if (statsPopover !== null) return statsPopover
        statsPopover = document.createElement('div')
        statsPopover.className = 'dsh-claude-stats-popover'
        statsPopover.setAttribute('data-open', 'false')
        statsPopover.addEventListener('mouseenter', function () {
          if (statsHideTimer) {
            clearTimeout(statsHideTimer)
            statsHideTimer = null
          }
        })
        statsPopover.addEventListener('mouseleave', scheduleHideStatsPopover)
        document.body.appendChild(statsPopover)
        return statsPopover
      }

      function hideStatsPopover() {
        if (statsPopover !== null) statsPopover.setAttribute('data-open', 'false')
      }

      function scheduleHideStatsPopover() {
        if (statsHideTimer) clearTimeout(statsHideTimer)
        statsHideTimer = setTimeout(function () {
          statsHideTimer = null
          hideStatsPopover()
        }, 160)
      }

      function renderStatsPopover(sections) {
        var pop = ensureStatsPopover()
        var html = '<div class="dsh-claude-stats-popover-body">'
        for (var sIndex = 0; sIndex < sections.length; sIndex++) {
          var section = sections[sIndex]
          if (section.rows.length === 0) continue
          if (section.title) html += '<div class="dsh-claude-stats-popover-section">' + statsEscape(section.title) + '</div>'
          html += '<div class="dsh-claude-stats-popover-grid">'
          for (var r = 0; r < section.rows.length; r++) {
            html += '<div class="dsh-claude-stats-popover-item">'
              + '<div class="dsh-claude-stats-popover-label">' + statsEscape(section.rows[r].label) + '</div>'
              + '<div class="dsh-claude-stats-popover-value">' + statsEscape(section.rows[r].value) + '</div>'
              + '</div>'
          }
          html += '</div>'
        }
        html += '</div>'
        pop.innerHTML = html
      }

      function showStatsPopover(anchor) {
        if (statsHideTimer) {
          clearTimeout(statsHideTimer)
          statsHideTimer = null
        }
        collectStatsData(function (sections) {
          if (sections.length === 0) return
          renderStatsPopover(sections)
          var pop = ensureStatsPopover()
          pop.setAttribute('data-open', 'true')
          var live = document.querySelector('[data-composer-stats]') || anchor
          var rect = live.getBoundingClientRect()
          var width = pop.offsetWidth
          var height = pop.offsetHeight
          var left = Math.max(8, Math.min(rect.left + rect.width / 2 - width / 2, window.innerWidth - width - 8))
          var top = Math.max(8, rect.top - height - 8)
          pop.style.left = left + 'px'
          pop.style.top = top + 'px'
        })
      }

      function bindStatsHover(root) {
        if (root.__dshStatsHoverBound) return
        root.__dshStatsHoverBound = true
        root.addEventListener('mouseenter', function () { showStatsPopover(root) })
        root.addEventListener('mouseleave', scheduleHideStatsPopover)
      }

      function syncStatsSummary() {
        var root = document.querySelector('[data-composer-stats]')
        if (root === null) return
        var buttons = root.querySelectorAll('button')
        var timeText = ''
        var usageText = ''
        for (var i = 0; i < buttons.length; i++) {
          var button = buttons[i]
          var aria = button.getAttribute('aria-label') || ''
          var parts = aria.split(' · ')
          var isTime = /轮|步|turns?|steps?/i.test(aria)
          if (isTime) {
            var counts = (parts[0] || '').match(/\d[\d,]*/g) || []
            var turns = counts[0] || '0'
            var steps = counts[1] || '0'
            var tps = (parts[1] || '').match(/([\d.,]+[KMB]?)\s*tok\/s/i)
            timeText = turns + '轮' + steps + '步' + (tps ? ' · ' + tps[1] + 'tok/s' : '')
          } else {
            var total = (parts[0] || '').match(/([\d.,]+[KMB]?)\s*tok/i)
            var cache = (parts[1] || '').match(/([\d.]+)\s*%/)
            usageText = (total ? total[1] + ' tok' : (parts[0] || '')) + (cache ? ' · ' + cache[1] + '% Cache' : '')
          }
        }
        if (buttons.length === 1) {
          var only = timeText || usageText
          timeText = only
          usageText = only
        }
        // content: var(...) needs a quoted <string>; an unquoted token stream
        // is invalid and computes to `none`.
        root.style.setProperty('--dsh-stats-time', JSON.stringify(timeText))
        root.style.setProperty('--dsh-stats-usage', JSON.stringify(usageText))
        bindStatsHover(root)
      }

      ui.permissions = {
        sync: function () {
          syncAttachmentState()
          mergeStatsIntoRow()
          syncStatsSummary()
          syncSegments()
          syncChatTabComposer()
        },
        closeMenu: closePermMenu
      }

      return function () {
        if (statsHideTimer) {
          clearTimeout(statsHideTimer)
          statsHideTimer = null
        }
        if (statsPopover !== null && statsPopover.parentElement !== null) statsPopover.parentElement.removeChild(statsPopover)
        statsPopover = null
        if (permHoverIntent) permHoverIntent.cancel()
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
        if (permPopover !== null && permPopover.parentElement !== null) permPopover.parentElement.removeChild(permPopover)
        permPopover = null
        permBtn = null
        permLabel = null
        permContainer = null
      }
    }

    // ============================================================================
    // 厂商标识：行与分组属于哪个厂商 (Model Brand)
    // ============================================================================
    // 从 model-picker.js 抽出（体量停止线：该文件已达 737/750 行）。碎片共享一个
    // 工厂作用域，所以这里能直接看到 context/model-copy.js 的 modelCopy 与构建生成
    // 的 PROVIDER_ICONS / PROVIDER_ICON_METADATA / PROVIDER_ICON_URL_KEYS /
    // LOBE_BRAND_SVGS，不需要 import；函数声明会提升，所以本文件在 build.mjs 的
    // FRAGMENTS 里的位置不影响调用。
    //
    // modelEl 是行构建器共用的元素工厂，随它的消费者一起搬过来（原先与这些函数同
    // 在 installModelPicker 内）。

    function modelEl(tag, cls, text) {
      var el = document.createElement(tag)
      if (cls) el.className = cls
      if (text !== void 0 && text !== null) el.textContent = text
      return el
    }

    /**
     * The brand mark for a provider route, from the copy document's
     * `brands.providers`. That table is keyed by the same provider id the
     * picker receives as a group id, so this is an exact lookup.
     *
     * @param groupId - provider route id.
     * @returns the vendored mark's id, or null when this provider has none.
     */
    function normalizeIconKey(value) {
      return String(value === void 0 || value === null ? '' : value).toLowerCase().replace(/[^a-z0-9]+/g, '')
    }

    /**
     * Map one provider/model id to a vendored icon name by exact normalized
     * match. The copy document's `brands` table carries the curated
     * provider/model → icon mapping; this is only the fallback for ids the
     * table does not mention.
     */
    function providerIconName(value) {
      var raw = String(value === void 0 || value === null ? '' : value).toLowerCase()
      if (raw && PROVIDER_ICONS[raw]) return raw
      var key = normalizeIconKey(value)
      if (!key) return null
      if (PROVIDER_ICONS[key]) return key
      for (var name in PROVIDER_ICON_METADATA) {
        var meta = PROVIDER_ICON_METADATA[name]
        var candidates = [meta.name, meta.displayName]
        if (meta.keywords) candidates = candidates.concat(meta.keywords)
        for (var i = 0; i < candidates.length; i++) {
          if (normalizeIconKey(candidates[i]) === key) return name
        }
      }
      return null
    }

    function providerBrand(groupId) {
      var id = String(groupId === void 0 || groupId === null ? '' : groupId)
      var brand = modelCopy === null ? null : (modelCopy.providerBrands[id] || modelCopy.providerBrands[id.toLowerCase()])
      if (typeof brand === 'string' && brand) return brand
      return providerIconName(id)
    }

    /**
     * The brand mark for one model: the vendor that made it, not the route it
     * is resold through — an OpenRouter group listing Claude models shows
     * Anthropic marks on the rows and OpenRouter's own mark on the header.
     * Rules are ordered and anchored in the document; the first match wins,
     * and a model no rule claims falls back to its provider's mark.
     *
     * @param groupId - provider route id, the fallback's source.
     * @param modelId - catalog model id.
     * @returns the vendored mark's id, or null when neither table claims it.
     */
    function modelBrand(groupId, modelId) {
      if (modelCopy !== null) {
        var id = String(modelId === void 0 || modelId === null ? '' : modelId).toLowerCase()
        for (var i = 0; i < modelCopy.brandRules.length; i++) {
          if (modelCopy.brandRules[i].re.test(id)) return modelCopy.brandRules[i].brand
        }
      }
      return providerIconName(modelId) || providerBrand(groupId)
    }

    /**
     * The mark element for a row or a group header.
     *
     * The mark is stamped as markup rather than painted from CSS: the vendored
     * Lobe Icons marks are `fill="currentColor"`, so the surrounding text
     * colour paints them and no per-brand rule is needed. The box is always
     * created, even when nothing matched, so labels stay in one column.
     *
     * @param brand - vendored mark id, or null.
     * @returns the element to append.
     */
    function buildModelBrand(brand) {
      var el = modelEl('span', 'dsh-claude-model-brand')
      // Decorative: the row's label already names the model.
      el.setAttribute('aria-hidden', 'true')
      if (brand) {
        var providerIcon = PROVIDER_ICONS[brand]
        if (providerIcon && PROVIDER_ICON_URL_KEYS[brand]) {
          var img = document.createElement('img')
          img.src = providerIcon
          img.alt = ''
          el.appendChild(img)
        } else if (providerIcon) {
          el.innerHTML = providerIcon
        } else if (LOBE_BRAND_SVGS[brand]) {
          el.innerHTML = LOBE_BRAND_SVGS[brand]
        }
      }
      return el
    }

    /**
     * Vendors whose label draws a wordmark: brand id → the word the mark stands
     * in for. The markup itself is the build's WORDMARK_SVGS table, one file per
     * brand id under src/assets/icons/wordmarks/ (see scripts/build.mjs).
     */
    var MODEL_WORDMARKS = { kimi: 'Kimi' }

    /**
     * The wordmark a label should draw, if any.
     *
     * Matched by brand id — the provider route, or the model's own rule, claimed
     * the vendor — or by the word itself. That second path matters: a reseller
     * lists a Kimi model under its own provider, so the row's brand resolves
     * elsewhere while the catalog still spells the vendor in the name.
     *
     * @param brand - resolved brand id, or null.
     * @param name - the catalog's display name.
     * @returns `{ id, word }`, or null when no wordmark applies.
     */
    function modelWordmark(brand, name) {
      for (var id in MODEL_WORDMARKS) {
        var word = MODEL_WORDMARKS[id]
        if (!WORDMARK_SVGS[id]) continue
        if (brand === id || name.toLowerCase().indexOf(word.toLowerCase()) !== -1) return { id: id, word: word }
      }
      return null
    }

    /**
     * One row's label.
     *
     * A vendor wordmark replaces the word it stands for, so the label keeps
     * naming the vendor — in the vendor's own hand — while the row already wears
     * the vendor's mark. A name that never spells the vendor (Kimi's own catalog
     * calls the model "K3") leads with the mark instead, and the separator the
     * word carried leaves with it, so the mark lands where the word was.
     *
     * The mark is decoration in the DOM, so the word it stands in for stays in
     * the accessibility tree as hidden text: a screen reader has to hear
     * "Kimi K3", not "K3", and the label is what names the row.
     *
     * @param name - the catalog's display name.
     * @param brand - resolved brand id, or null.
     * @returns the label element.
     */
    function buildModelName(name, brand) {
      var el = modelEl('span', 'dsh-claude-model-name')
      var text = typeof name === 'string' ? name : ''
      var mark = modelWordmark(brand, text)
      if (mark === null) {
        el.textContent = text
        return el
      }
      var at = text.toLowerCase().indexOf(mark.word.toLowerCase())
      // The word's own separator goes with the word: the mark's margin stands in
      // for it, so the label does not end up with two gaps.
      var tail = at === -1 ? text : text.slice(at + mark.word.length).replace(/^[\s\-–—]+/, '')
      var box = modelEl('span', 'dsh-claude-model-wordmark')
      // Decorative: the hidden word below carries the name for assistive tech.
      box.setAttribute('aria-hidden', 'true')
      box.innerHTML = WORDMARK_SVGS[mark.id]
      if (at > 0) el.appendChild(document.createTextNode(text.slice(0, at)))
      el.appendChild(modelEl('span', 'dsh-claude-model-wordmark-alt', tail ? mark.word + ' ' : mark.word))
      el.appendChild(box)
      el.appendChild(document.createTextNode(tail))
      return el
    }

    // ============================================================================
    // 模型选择器 (Model Picker)
    // ============================================================================
    function installModelPicker(ctx, ui) {
      /**
       * The host's model seat is a click-triggered two-pane menu (Model /
       * Effort rows drilling into their own lists). The skin replaces it with
       * a Claude-style picker: hovering the trigger opens the first level —
       * the DeepSeek official provider's models, a divider, then the
       * reasoning-effort row (when the current model offers one) and a More
       * models row; both open their second level BESIDE the first level.
       *
       * Data and submission ride the host's own per-session ModelDirectory
       * (`ctx.modelDirectories`), the same store the host's menu and the
       * /model command read — so the current selection, catalog and errors
       * stay in sync without scraping the DOM. The host's seat is hidden and
       * marked; a React swap re-marks it on the next pass.
       */
      var modelBtn = null
      var modelPop = null
      var modelSubPop = null
      var modelBody = null
      var modelSubBody = null
      var modelHoverIntent = createHoverIntent(openModelPopover, closeModelPopovers, 180)
      var modelDir = null
      var modelSub = null
      var modelSessionId = null
      var modelSubKind = null
      var modelBodySig = ''
      var modelSubSig = ''

      /** Exact entry: `provider/model`, bare id, folded id, then the alias table. */
      function exactModelCopy(groupId, modelId) {
        if (modelCopy === null) return null
        var gid = String(groupId === void 0 || groupId === null ? '' : groupId).toLowerCase()
        var mid = String(modelId === void 0 || modelId === null ? '' : modelId)
        var midLower = mid.toLowerCase()
        var byProvider = modelCopy.exact[groupId + '/' + mid] || modelCopy.exact[gid + '/' + midLower]
        if (byProvider) return byProvider
        if (modelCopy.exact[mid]) return modelCopy.exact[mid]
        if (modelCopy.exact[midLower]) return modelCopy.exact[midLower]
        var folded = normalizeModelId(mid)
        if (modelCopy.folded[folded]) return modelCopy.folded[folded]
        var alias = modelCopy.aliases[mid] || modelCopy.aliases[midLower] || modelCopy.aliases[folded] || (modelCopy.foldedAliases && modelCopy.foldedAliases[folded])
        if (alias) {
          if (modelCopy.exact[alias]) return modelCopy.exact[alias]
          var foldedAlias = normalizeModelId(alias)
          if (modelCopy.folded[foldedAlias]) return modelCopy.folded[foldedAlias]
        }
        return null
      }

      /**
       * Family entry. The model id is tried alone first because it is the
       * stronger signal, then `provider/id` for ids that carry no brand of their
       * own (`abab6.5s-chat` under a provider called `minimax`).
       */
      function familyModelCopy(groupId, modelId) {
        if (modelCopy === null) return null
        var id = String(modelId === void 0 || modelId === null ? '' : modelId).toLowerCase()
        var haystacks = [id, String(groupId === void 0 || groupId === null ? '' : groupId).toLowerCase() + '/' + id]
        for (var h = 0; h < haystacks.length; h++) {
          for (var i = 0; i < modelCopy.families.length; i++) {
            var rule = modelCopy.families[i]
            if (!rule.re.test(haystacks[h])) continue
            if (rule.key) return modelCopy.exact[rule.key] || null
            return rule.text
          }
        }
        return null
      }

      /** Last-resort tier rule, read out of the id itself. */
      function tierModelCopy(modelId) {
        if (modelCopy === null) return null
        var id = String(modelId === void 0 || modelId === null ? '' : modelId).toLowerCase()
        for (var i = 0; i < modelCopy.tiers.length; i++) {
          if (modelCopy.tiers[i].re.test(id)) return modelCopy.tiers[i].text
        }
        return null
      }

      function cancelCloseModel() {
        modelHoverIntent.cancel()
      }

      function scheduleCloseModel() {
        modelHoverIntent.scheduleClose()
      }

      function closeModelPopovers() {
        cancelCloseModel()
        if (modelPop) modelPop.setAttribute('data-open', 'false')
        if (modelSubPop) modelSubPop.setAttribute('data-open', 'false')
        modelSubKind = null
      }

      function openModelPopover() {
        cancelCloseModel()
        modelDirectory()
        // load() is async — the host itself guards with .catch(() => {}); a bare
        // try/catch cannot see its rejection.
        if (modelDir && typeof modelDir.load === 'function') {
          try {
            var pending = modelDir.load()
            if (pending && typeof pending.catch === 'function') {
              pending.catch(function () { /* the store's error surface covers a failure */ })
            }
          } catch (error) { /* synchronous failure — the store's error surface covers it */ }
        }
        modelSubKind = null
        if (modelSubPop) modelSubPop.setAttribute('data-open', 'false')
        renderModelBody()
        positionModelPopovers()
        if (modelPop) modelPop.setAttribute('data-open', 'true')
      }

      function openModelSub(kind) {
        cancelCloseModel()
        modelSubKind = kind
        renderModelSub()
        positionModelPopovers()
        if (modelSubPop) modelSubPop.setAttribute('data-open', 'true')
      }

      /**
       * The current session id. The Session Controller dropped
       * `list.current` in dsh 0.2 (the main-view selection now comes from the
       * `uiSession` projection), so this MUST go through the shared
       * currentSessionId() in context.js — reading the legacy field directly
       * resolves to null on current hosts and the picker never loads.
       */
      function currentModelSessionId() {
        try {
          var sessions = ctx.get('sessions')
          if (sessions === void 0 || sessions === null) return null
          var id = currentSessionId(ctx, sessions)
          return id === void 0 || id === null ? null : id
        } catch (error) {
          return null
        }
      }

      function dropModelSubscription() {
        if (modelSub) {
          try { modelSub() } catch (error) { /* already disposed */ }
        }
        modelSub = null
      }

      /** Resolve the session's directory (and observe it) once per session. */
      function modelDirectory() {
        var id = currentModelSessionId()
        if (id === null) {
          dropModelSubscription()
          modelDir = null
          modelSessionId = null
          return null
        }
        if (modelSessionId === id && modelDir !== null) return modelDir
        dropModelSubscription()
        modelDir = null
        modelSessionId = null
        try {
          var dirs = ctx.get('modelDirectories')
          if (dirs && typeof dirs.directoryFor === 'function') {
            modelDir = dirs.directoryFor(id)
          }
        } catch (error) {
          modelDir = null
        }
        modelSessionId = id
        // The directory INSTANCE only carries load/select — its reactive state
        // hangs off the `.store` snapshot store (the host hands that same store
        // to its own menu as `directory`). Subscribe to the store, never to the
        // instance, and never let a subscribe failure discard the directory.
        if (modelDir !== null) {
          var store = modelDir.store
          if (store && typeof store.subscribe === 'function') {
            try {
              modelSub = store.subscribe(function () { if (ui.schedule) ui.schedule() })
            } catch (error) {
              modelSub = null
            }
          }
        }
        return modelDir
      }

      function modelSnapshot() {
        if (modelDir === null || !modelDir.store) return null
        try { return modelDir.store.getSnapshot() } catch (error) { return null }
      }

      /** The current selection resolved to its group + model entries. */
      function modelCurrent(snap) {
        if (!snap || snap.current === null) return null
        for (var g = 0; g < snap.groups.length; g++) {
          var group = snap.groups[g]
          if (group.id !== snap.current.provider) continue
          for (var m = 0; m < group.models.length; m++) {
            if (group.models[m].id === snap.current.model) return { group: group, model: group.models[m] }
          }
        }
        return null
      }

      /** Reasoning metadata + the effective effort for the current model. */
      function modelEffort(snap) {
        var current = modelCurrent(snap)
        if (current === null || !current.model.reasoning) return null
        var reasoning = current.model.reasoning
        var effective = snap.current.reasoningEffort !== void 0 ? snap.current.reasoningEffort : reasoning.defaultEffort
        var label = MODEL_EFFORT_DEFAULT
        if (effective !== void 0) {
          label = effective
          for (var i = 0; i < reasoning.efforts.length; i++) {
            if (reasoning.efforts[i].id === effective) {
              label = reasoning.efforts[i].name
              break
            }
          }
        }
        return { reasoning: reasoning, effective: effective, label: label }
      }

      /**
       * The description line for one catalog model, in the shell's language.
       *
       * Resolution descends: exact entry (one model resold by several providers
       * folds to a single key) → family rule → tier rule → the catalog's own
       * text. Family rules are ordered and anchored (see
       * src/model-descriptions.json) so another vendor's flash tier never
       * borrows DeepSeek's copy. A model this table has never seen and the
       * catalog does not describe resolves to an empty string on purpose: a
       * name-only row beats an invented line.
       */
      function modelDescription(groupId, model) {
        var id = typeof model.id === 'string' ? model.id : ''
        var pair = exactModelCopy(groupId, id) || familyModelCopy(groupId, id) || tierModelCopy(id)
        var text = localized(pair, ctx)
        if (text) return text
        return typeof model.description === 'string' ? model.description : ''
      }

      var MODEL_CHECK_SVG = '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.2 3.2L13 5"/></svg>'
      var MODEL_CHEVRON_SVG = '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4l4 4-4 4"/></svg>'

      /** One selectable model row: brand mark, name, description line and a check when current. */
      function buildModelOption(group, model, selected) {
        var item = modelEl('button', 'dsh-claude-model-option')
        item.type = 'button'
        item.setAttribute('role', 'menuitemradio')
        item.setAttribute('aria-checked', selected ? 'true' : 'false')
        var brand = modelBrand(group.id, model.id)
        // The mark id is also the hook the stylesheet needs to give a vendor's
        // rows their own typography (see .dsh-claude-model-name in
        // styles/components/model-picker.css). The mark itself stays markup: the
        // Lobe glyphs are `fill="currentColor"`, so no per-brand rule paints them.
        // The scheduler's attributeFilter does not watch data-*, so this write
        // cannot re-trigger a pass.
        if (brand) item.setAttribute('data-brand', brand)
        item.appendChild(buildModelBrand(brand))
        var copy = modelEl('span', 'dsh-claude-model-copy')
        copy.appendChild(buildModelName(model.name, brand))
        // One line, in the shell's language: the copy document is localized, so
        // the row never stacks two languages.
        var desc = modelDescription(group.id, model)
        if (desc) copy.appendChild(modelEl('span', 'dsh-claude-model-desc', desc))
        item.appendChild(copy)
        var check = modelEl('span', 'dsh-claude-model-check')
        check.innerHTML = selected ? MODEL_CHECK_SVG : ''
        item.appendChild(check)
        item.addEventListener('click', (function (g, m) {
          return function (e) {
            e.stopPropagation()
            pickModel(g, m)
          }
        })(group.id, model.id))
        return item
      }

      /** One level-2 row: label + current value + chevron, hover opens its level. */
      function buildModelCell(label, value, kind) {
        var cell = modelEl('button', 'dsh-claude-model-cell')
        cell.type = 'button'
        cell.setAttribute('role', 'menuitem')
        cell.appendChild(modelEl('span', 'dsh-claude-model-cell-label', label))
        if (value) cell.appendChild(modelEl('span', 'dsh-claude-model-cell-value', value))
        var chevron = modelEl('span', 'dsh-claude-model-cell-chevron')
        chevron.innerHTML = MODEL_CHEVRON_SVG
        cell.appendChild(chevron)
        cell.addEventListener('mouseenter', (function (k) {
          return function () {
            if (readPrefs().autoPopover) openModelSub(k)
          }
        })(kind))
        cell.addEventListener('click', (function (k) {
          return function (e) {
            e.stopPropagation()
            if (modelSubKind === k) closeModelPopovers()
            else openModelSub(k)
          }
        })(kind))
        return cell
      }

      function pickModel(provider, modelId) {
        var dir = modelDirectory()
        if (dir === null) return
        try {
          // select() is async and rejects on a failed selection; swallow the
          // rejection the way the host's own seat wrapper does.
          var pending = dir.select({ provider: provider, model: modelId })
          if (pending && typeof pending.catch === 'function') pending.catch(function () {})
        } catch (error) { /* rejected selections surface on the host's toast */ }
        closeModelPopovers()
      }

      function pickEffort(effort) {
        var dir = modelDirectory()
        var snap = modelSnapshot()
        if (dir === null || !snap || snap.current === null) return
        var selection = { provider: snap.current.provider, model: snap.current.model }
        if (effort !== void 0) selection.reasoningEffort = effort
        try {
          var pending = dir.select(selection)
          if (pending && typeof pending.catch === 'function') pending.catch(function () {})
        } catch (error) { /* rejected selections surface on the host's toast */ }
        closeModelPopovers()
      }

      /** Level 1: the official provider's models, divider, effort + more rows. */
      function renderModelBody() {
        if (!modelBody) return
        var snap = modelSnapshot()
        var status = snap ? snap.status : 'idle'
        var groups = (snap && snap.groups) || []
        var current = modelCurrent(snap)
        var effort = modelEffort(snap)
        var sig = [status, activeLocale(), current ? current.group.id + '/' + current.model.id : '', effort ? String(effort.effective) : ''].join('|')
        for (var g = 0; g < groups.length; g++) sig += ';' + groups[g].id + ':' + groups[g].models.length
        if (sig === modelBodySig) return
        modelBodySig = sig
        while (modelBody.firstChild) modelBody.removeChild(modelBody.firstChild)

        if (status === 'idle' || status === 'loading' || status === 'selecting') {
          modelBody.appendChild(modelEl('div', 'dsh-claude-model-status', copyLabel('loading', MODEL_LOADING_LABEL)))
        } else {
          var official = null
          for (var g2 = 0; g2 < groups.length; g2++) {
            if (groups[g2].id === MODEL_OFFICIAL_GROUP) { official = groups[g2]; break }
          }
          var rows = []
          if (official) {
            for (var m = 0; m < official.models.length; m++) rows.push({ group: official, model: official.models[m] })
          } else {
            for (var g3 = 0; g3 < groups.length; g3++) {
              for (var m2 = 0; m2 < groups[g3].models.length; m2++) rows.push({ group: groups[g3], model: groups[g3].models[m2] })
            }
          }
          if (rows.length === 0) {
            modelBody.appendChild(modelEl('div', 'dsh-claude-model-status', copyLabel('empty', MODEL_EMPTY_LABEL)))
          } else {
            for (var r = 0; r < rows.length; r++) {
              var selected = current !== null && current.group.id === rows[r].group.id && current.model.id === rows[r].model.id
              modelBody.appendChild(buildModelOption(rows[r].group, rows[r].model, selected))
            }
          }
          modelBody.appendChild(modelEl('div', 'dsh-claude-model-divider'))
          // When the active model is not on the official service, surface it
          // under the official list as `provider/model` so the current seat is
          // still visible before the effort/More rows.
          if (current !== null && current.group.id !== MODEL_OFFICIAL_GROUP) {
            var currentRow = modelEl('button', 'dsh-claude-model-option')
            currentRow.type = 'button'
            currentRow.setAttribute('role', 'menuitemradio')
            currentRow.setAttribute('aria-checked', 'true')
            currentRow.appendChild(buildModelBrand(modelBrand(current.group.id, current.model.id)))
            var currentCopy = modelEl('span', 'dsh-claude-model-copy')
            currentCopy.appendChild(modelEl('span', 'dsh-claude-model-name', current.group.id + '/' + current.model.id))
            currentRow.appendChild(currentCopy)
            var currentCheck = modelEl('span', 'dsh-claude-model-check')
            currentCheck.innerHTML = MODEL_CHECK_SVG
            currentRow.appendChild(currentCheck)
            currentRow.addEventListener('click', function (e) {
              e.stopPropagation()
              closeModelPopovers()
            })
            modelBody.appendChild(currentRow)
          }
          if (effort) modelBody.appendChild(buildModelCell(copyLabel('effortLabel', MODEL_EFFORT_LABEL), effort.label, 'effort'))
          modelBody.appendChild(buildModelCell(copyLabel('moreLabel', MODEL_MORE_LABEL), '', 'more'))
        }
      }

      /** Level 2: the effort ladder, or every provider group's models. */
      function renderModelSub() {
        if (!modelSubBody) return
        var snap = modelSnapshot()
        if (modelSubKind === 'effort') {
          var effort = modelEffort(snap)
          var sig = 'effort:' + (effort ? String(effort.effective) : 'none')
          if (sig === modelSubSig) return
          modelSubSig = sig
          while (modelSubBody.firstChild) modelSubBody.removeChild(modelSubBody.firstChild)
          if (effort === null) {
            modelSubBody.appendChild(modelEl('div', 'dsh-claude-model-status', copyLabel('noEffort', MODEL_NO_EFFORT_LABEL)))
            return
          }
          var levels = []
          if (effort.reasoning.defaultEffort === void 0) levels.push({ effort: void 0, label: MODEL_EFFORT_DEFAULT })
          for (var i = 0; i < effort.reasoning.efforts.length; i++) {
            levels.push({ effort: effort.reasoning.efforts[i].id, label: effort.reasoning.efforts[i].name })
          }
          for (var l = 0; l < levels.length; l++) {
            (function (level, active) {
              var item = modelEl('button', 'dsh-claude-model-option')
              item.type = 'button'
              item.setAttribute('role', 'menuitemradio')
              item.setAttribute('aria-checked', active ? 'true' : 'false')
              item.appendChild(modelEl('span', 'dsh-claude-model-copy', level.label))
              var check = modelEl('span', 'dsh-claude-model-check')
              check.innerHTML = active ? MODEL_CHECK_SVG : ''
              item.appendChild(check)
              item.addEventListener('click', function (e) {
                e.stopPropagation()
                pickEffort(level.effort)
              })
              modelSubBody.appendChild(item)
            })(levels[l], effort.effective === levels[l].effort)
          }
          return
        }
        // 'more': every provider group, headed by its name.
        var groups = (snap && snap.groups) || []
        var current = modelCurrent(snap)
        var sig2 = 'more'
        for (var g = 0; g < groups.length; g++) sig2 += ';' + groups[g].id + ':' + groups[g].models.length
        if (current) sig2 += '#' + current.group.id + '/' + current.model.id
        if (sig2 === modelSubSig) return
        modelSubSig = sig2
        while (modelSubBody.firstChild) modelSubBody.removeChild(modelSubBody.firstChild)
        for (var g2 = 0; g2 < groups.length; g2++) {
          var group = groups[g2]
          if (group.models.length === 0) continue
          var groupSection = modelEl('div', 'dsh-claude-model-group-section')
          var groupRow = modelEl('div', 'dsh-claude-model-group-row')
          var groupLabel = modelEl('div', 'dsh-claude-model-group')
          // The provider's own mark leads its label, so a level-2 list reads as
          // "which provider" before "which model".
          groupLabel.appendChild(buildModelBrand(providerBrand(group.id)))
          groupLabel.appendChild(modelEl('span', 'dsh-claude-model-group-name', group.name))
          groupRow.appendChild(groupLabel)
          groupSection.appendChild(groupRow)
          for (var m = 0; m < group.models.length; m++) {
            var selected = current !== null && current.group.id === group.id && current.model.id === group.models[m].id
            groupSection.appendChild(buildModelOption(group, group.models[m], selected))
          }
          modelSubBody.appendChild(groupSection)
        }
        if (modelSubBody.firstChild === null) {
            modelSubBody.appendChild(modelEl('div', 'dsh-claude-model-status', copyLabel('empty', MODEL_EMPTY_LABEL)))
        }
      }

      function positionModelPopovers() {
        if (!modelBtn || !modelPop) return
        var pos = positionAnchoredPopover(modelBtn, modelPop, { side: 'above', gap: 6 })
        if (modelSubPop && modelSubPop.getAttribute('data-open') === 'true') {
          var w2 = modelSubPop.offsetWidth
          var h2 = modelSubPop.offsetHeight
          // Beside the first level; flip to its left when the viewport is tight.
          var x2 = pos.x + modelPop.offsetWidth + 4
          if (x2 + w2 > window.innerWidth - POPOVER_MARGIN) x2 = Math.max(POPOVER_MARGIN, pos.x - 4 - w2)
          var y2 = Math.max(POPOVER_MARGIN, Math.min(pos.y, window.innerHeight - h2 - POPOVER_MARGIN))
          modelSubPop.style.left = x2 + 'px'
          modelSubPop.style.top = y2 + 'px'
        }
      }

      function ensureModelChrome() {
        if (modelPop === null) {
          modelPop = document.createElement('div')
          modelPop.className = 'dsh-claude-model-popover'
          modelPop.setAttribute('role', 'menu')
          modelPop.setAttribute('data-open', 'false')
          modelBody = document.createElement('div')
          modelBody.className = 'dsh-claude-model-popover-body'
          modelPop.appendChild(modelBody)
          modelPop.addEventListener('mouseenter', cancelCloseModel)
          modelPop.addEventListener('mouseleave', scheduleCloseModel)
          document.body.appendChild(modelPop)
        }
        if (modelSubPop === null) {
          modelSubPop = document.createElement('div')
          modelSubPop.className = 'dsh-claude-model-popover dsh-claude-model-popover-sub'
          modelSubPop.setAttribute('role', 'menu')
          modelSubPop.setAttribute('data-open', 'false')
          modelSubBody = document.createElement('div')
          modelSubBody.className = 'dsh-claude-model-popover-body'
          modelSubPop.appendChild(modelSubBody)
          modelSubPop.addEventListener('mouseenter', cancelCloseModel)
          modelSubPop.addEventListener('mouseleave', scheduleCloseModel)
          document.body.appendChild(modelSubPop)
        }
      }

      /** Build/refresh the trigger, its label and the popover rows. */
      function syncModelControl() {
        if (!ui.copy.isComposerActive()) {
          var allHosts = document.querySelectorAll('[data-dsh-claude-model-host]')
          for (var h = 0; h < allHosts.length; h++) {
            allHosts[h].removeAttribute('data-dsh-claude-model-host')
          }
          var allModelBtns = document.querySelectorAll('.dsh-claude-model-btn')
          for (var mb = 0; mb < allModelBtns.length; mb++) {
            allModelBtns[mb].remove()
          }
          modelBtn = null
          var allModelPops = document.querySelectorAll('.dsh-claude-model-popover')
          for (var mp = 0; mp < allModelPops.length; mp++) {
            allModelPops[mp].remove()
          }
          modelPop = null
          modelSubPop = null
          modelBody = null
          modelSubBody = null
          modelSubKind = null
          modelBodySig = ''
          modelSubSig = ''
          cancelCloseModel()
          dropModelSubscription()
          modelDir = null
          modelSessionId = null
          return
        }

        // The copy document is fetched on first paint of the picker rather than
        // at install, so a session that never opens it never pays for it.
        loadModelCopy()
        modelDirectory()
        var slot = document.querySelector('[data-slot="conversation.input.model"]')
        if (slot === null) return
        // Hide the host's own seat (React owns the node; re-mark on swap).
        var hostRoot = slot.firstElementChild
        if (hostRoot !== null && !hostRoot.hasAttribute('data-dsh-claude-model-host')) {
          hostRoot.setAttribute('data-dsh-claude-model-host', '')
        }
        if (modelBtn === null || modelBtn.parentElement !== slot) {
          if (modelBtn !== null && modelBtn.parentElement !== null) modelBtn.parentElement.removeChild(modelBtn)
          modelBtn = document.createElement('button')
          modelBtn.type = 'button'
          modelBtn.className = 'dsh-claude-model-btn'
          modelBtn.setAttribute('aria-haspopup', 'menu')
          modelBtn.innerHTML = '<span class="dsh-claude-model-btn-label"></span>'
          // Same contract as the account trigger: hover unless the preference
          // says click-only.
          modelBtn.addEventListener('mouseenter', function () {
            if (readPrefs().autoPopover) openModelPopover()
          })
          modelBtn.addEventListener('mouseleave', function () {
            if (readPrefs().autoPopover) scheduleCloseModel()
          })
          modelBtn.addEventListener('click', function (e) {
            e.stopPropagation()
            if (modelPop && modelPop.getAttribute('data-open') === 'true') closeModelPopovers()
            else openModelPopover()
          })
          slot.appendChild(modelBtn)
        }
        ensureModelChrome()

        var snap = modelSnapshot()
        var current = modelCurrent(snap)
        var effort = modelEffort(snap)
        var label = current ? current.model.name : copyLabel('fallbackLabel', MODEL_FALLBACK_LABEL)
        var labelEl = modelBtn.querySelector('.dsh-claude-model-btn-label')
        if (labelEl) {
          labelEl.textContent = label
          labelEl.classList.toggle('dsh-claude-model-btn-loading', !!(snap && (snap.status === 'loading' || snap.status === 'idle' || snap.status === 'selecting')))
        }
        var effortEl = modelBtn.querySelector('.dsh-claude-model-btn-effort')
        if (effort) {
          if (effortEl === null) {
            effortEl = modelEl('span', 'dsh-claude-model-btn-effort')
            modelBtn.insertBefore(effortEl, modelBtn.firstChild ? labelEl.nextSibling : null)
          }
          effortEl.textContent = '· ' + effort.label
        } else if (effortEl !== null && effortEl.parentElement) {
          effortEl.parentElement.removeChild(effortEl)
        }
        modelBtn.setAttribute('aria-label', copyLabel('triggerLabel', MODEL_TRIGGER_LABEL, { model: label }))
        modelBtn.disabled = false

        renderModelBody()
        if (modelSubKind !== null) {
          renderModelSub()
          if (modelSubPop && modelSubPop.getAttribute('data-open') === 'true') positionModelPopovers()
        }
        if (modelPop && modelPop.getAttribute('data-open') === 'true') positionModelPopovers()
      }


      ui.model = {
        sync: syncModelControl,
        close: closeModelPopovers,
        owns: function (target) {
          if (!target) return false
          return (modelBtn !== null && modelBtn.contains(target)) ||
                 (modelPop !== null && modelPop.contains(target)) ||
                 (modelSubPop !== null && modelSubPop.contains(target))
        },
        reposition: positionModelPopovers,
        invalidateCopy: function () {
          modelBodySig = ''
          modelSubSig = ''
        },
        teardown: function () {
          cancelCloseModel()
          dropModelSubscription()
          modelDir = null
          modelSessionId = null
          modelBtn = null
          modelPop = null
          modelSubPop = null
          modelBody = null
          modelSubBody = null
          modelSubKind = null
          modelBodySig = ''
          modelSubSig = ''
        }
      }

      return ui.model.teardown
    }

    // ============================================================================
    // 账户页脚与弹层 (Account Footer & Popover)
    // ============================================================================
    function installAccountFooter(ctx, ui) {
      var accountBtn = null
      var accountPopover = null
      var popoverBody = null
      var popoverHoverIntent = createHoverIntent(openPopover, closePopover, 150)
      // Whether the popover is up because it was CLICKED (rather than hovered).
      // Clicking the account row opens the ban-screen easter egg and leaves the
      // pointer inside the popover, so without this the row's own mouseleave
      // would tear the popover down behind the overlay; a click-opened popover
      // instead stays until the pointer leaves the whole footer.
      var popoverOpenedByClick = false

      function openPopover() {
        if (!accountPopover || !accountBtn) return
        cancelClosePopover()
        // Mirrors are frozen while the popover is open (syncPopoverItems
        // bails), so reconcile them here — before the reveal — to show fresh
        // content/order and bind click targets for the upcoming interaction.
        try {
          var footArea = document.querySelector('[class*="footArea"]')
          if (footArea) syncPopoverItems(footArea)
        } catch (error) { /* opening must never fail because of a mirror sync */ }
        // Resolve the rail anchor before the reveal so the panel never paints at
        // its stale coordinates for a frame.
        positionAccountPopover()
        accountPopover.setAttribute('data-open', 'true')
        accountBtn.setAttribute('data-open', 'true')
        accountBtn.setAttribute('aria-expanded', 'true')
      }

      function closePopover() {
        if (!accountPopover || !accountBtn) return
        cancelClosePopover()
        popoverOpenedByClick = false
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
          // The pointer stays on the trigger after a click, and the popover
          // hangs below it, so the trigger's mouseleave must not close what the
          // click just opened — otherwise the panel is unreachable with a mouse.
          popoverOpenedByClick = true
          openPopover()
        }
      }

      function cancelClosePopover() {
        popoverHoverIntent.cancel()
      }

      function scheduleClosePopover() {
        popoverHoverIntent.scheduleClose()
      }

      /**
       * Anchor the account popover to its trigger while the sidebar is a rail.
       *
       * In the rail the popover is `position: fixed` (components/account-footer.css): the sidebar
       * column clips its overflow, so an absolutely positioned panel would be cut
       * off at the 56px rail edge and never seen. Its coordinates therefore have
       * to be resolved here — the same contract the model picker's popovers use.
       * The declarations are written `important` because the stylesheet anchors
       * the wide-sidebar popover with `!important` as well, and an author
       * `!important` beats a plain inline declaration.
       *
       * With the sidebar wide the CSS anchor is the right one, so the inline
       * overrides are dropped again and the footer rule takes over.
       */
      function positionAccountPopover() {
        if (!accountPopover || !accountBtn) return
        if (accountBtn.closest('[class*="collapsed"]') === null) {
          accountPopover.style.removeProperty('left')
          accountPopover.style.removeProperty('top')
          return
        }
        positionAnchoredPopover(accountBtn, accountPopover, { side: 'right', important: true })
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
        var footerEntries = syncFooterActionVisibility(footerActions)

        // While the popover is open, its mirrors must stay completely static:
        // a content rewrite, reorder, or embedded-clone replacement under the
        // pointer cancels the browser's :hover state and can swallow the click
        // between pointerdown and pointerup. Sync runs only while closed;
        // openPopover runs one final pass right before the reveal — and the
        // sidebar-side redirection above stays live, so a newly mounted entry
        // keeps being hidden even with the popover open.
        if (accountPopover && accountPopover.getAttribute('data-open') === 'true') return

        var existingActionItems = popoverBody.querySelectorAll('[data-action-index], [data-embed-index]')
        for (var ea = 0; ea < existingActionItems.length; ea++) {
          var staleIdx = parseInt(existingActionItems[ea].getAttribute('data-action-index') || existingActionItems[ea].getAttribute('data-embed-index'), 10)
          if (isNaN(staleIdx) || staleIdx >= footerEntries.length) {
            existingActionItems[ea].parentElement.removeChild(existingActionItems[ea])
          }
        }

        for (var f = 0; f < footerEntries.length; f++) {
          try {
            (function (entry, idx) {
            var trigger = findFooterTrigger(entry)
            var hasContent = (entry.textContent || '').trim() !== '' ||
                             entry.querySelector('svg, img, canvas') !== null

            // Rich widgets (progress bars, stat panels) cannot collapse into
            // a text menu item — embed a live clone instead, forwarding
            // clicks to the entry's trigger when it has one (the cost-meter
            // balance stack is itself clickable).
            if (!entryIsActionLike(entry, trigger)) {
              removeActionMirror(idx)
              if (hasContent) {
                syncEmbedMirror(entry, idx, trigger)
              } else {
                removeEmbedMirror(idx)
              }
              return
            }
            removeEmbedMirror(idx)

            // The mirrored item activates the first interactive element
            // outside any overlay.
            var activator = trigger
            var item = popoverBody.querySelector('[data-action-index="' + idx + '"]')
            var iconEl = (trigger && trigger.querySelector('svg')) || entry.querySelector('svg')
            var iconHtml = iconEl ? iconEl.outerHTML : ''
            var text = activator.getAttribute('aria-label') || (activator.textContent || '').trim() || '插件'
            var badge = activator.getAttribute('data-cordis-badge') || entry.getAttribute('data-cordis-badge') || ''

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
                // The activator is rebound on every (closed-state) sync pass
                // (`item.__dshActivator`), never captured at creation — the
                // host re-sorts list slots by `order` on each render, so the
                // entry behind an index changes over time.
                var live = item.__dshActivator
                if (!live || typeof live.click !== 'function') {
                  // Safety net: re-resolve the current trigger for this index
                  // from the live footer DOM. Covers the rare case where the
                  // stored node was detached by a host re-render while the
                  // popover was open.
                  try {
                    var fa = document.querySelector('[class*="footArea"]')
                    var actions = fa ? fa.querySelector('[class*="footerActions"]') : null
                    var liveEntries = actions ? footerEntriesOf(actions) : []
                    var liveEntry = liveEntries[idx] || null
                    live = liveEntry ? findFooterTrigger(liveEntry) : null
                  } catch (error) {
                    live = null
                  }
                }
                if (live && typeof live.click === 'function') live.click()
              })
              popoverBody.insertBefore(item, settingsItem)
            } else {
              // Entries are reused by index: the host re-sorts list slots by
              // `order` on every render, so a re-sort can seat a different
              // plugin under an existing item — icon, text, badge AND the
              // click target must all re-sync, or the label shows one entry
              // while the click fires the previous occupant's trigger.
              var iEl = item.querySelector('.dsh-claude-popover-item-icon')
              if (iEl && iEl.innerHTML !== iconHtml) iEl.innerHTML = iconHtml
              var tEl = item.querySelector('.dsh-claude-popover-item-text')
              if (tEl && tEl.textContent !== text) tEl.textContent = text
              var bEl = item.querySelector('.dsh-claude-popover-item-badge')
              if (bEl && bEl.textContent !== badge) bEl.textContent = badge
            }
            // Rebind the click target to the entry currently behind this
            // index. Done on every pass, for new and reused items alike.
            item.__dshActivator = activator
            })(footerEntries[f], f)
          } catch (err) {
            // A single broken entry must not abort the rest of the mirror
            // sync (which would leave later items without a rebound
            // activator or un-ordered).
          }
        }

        // The host re-sorts list-slot outlets by `order` on every render
        // (stable, ties keep registration order), and plugins mount
        // progressively at startup — so the mirror nodes must track the live
        // footer order on every pass: a later re-sort would otherwise leave
        // the popover frozen in a stale order that no longer matches the
        // real controls. Re-append action items and embedded widgets in
        // entry-index order.
        var mirrors = []
        for (var mi = 0; mi < popoverBody.children.length; mi++) {
          var mirrorNode = popoverBody.children[mi]
          if (mirrorNode === settingsItem) continue
          if (mirrorNode.hasAttribute('data-action-index') || mirrorNode.hasAttribute('data-embed-index')) {
            mirrors.push(mirrorNode)
          }
        }
        mirrors.sort(function (a, b) {
          var ai = parseInt(a.getAttribute('data-action-index') || a.getAttribute('data-embed-index'), 10) || 0
          var bi = parseInt(b.getAttribute('data-action-index') || b.getAttribute('data-embed-index'), 10) || 0
          return ai - bi
        })
        for (var mr = 0; mr < mirrors.length; mr++) {
          popoverBody.insertBefore(mirrors[mr], settingsItem)
        }
      }

      // --- Footer action redirection helpers ---
      /**
       * The `sidebar.footer.action` list slot accepts arbitrary plugin
       * controls, not just buttons: a plugin may render a composite widget
       * (toggles, selects, status chips) straight into the sidebar footer.
       * Redirection therefore works on ENTRIES (direct children of
       * footerActions), not on `querySelectorAll('button')`:
       *   - every entry is marked `data-dsh-claude-footer-entry` (CSS
       *     collapses its box so nothing paints in the sidebar);
       *   - entries without a floating overlay are hidden wholesale via
       *     `data-dsh-claude-footer-hidden`;
       *   - entries hosting an overlay — a fixed-position panel (the cordis
       *     inventory panel) or a dialog/menu/listbox — stay visible, but
       *     every branch of their subtree that does not lead to the overlay
       *     is hidden, so only the overlay itself can surface.
       * Returns the live entry list for popover mirroring.
       */
      function syncFooterActionVisibility(footerActions) {
        if (!footerActions) return []
        var entries = footerEntriesOf(footerActions)
        for (var i = 0; i < entries.length; i++) {
          var entry = entries[i]
          entry.setAttribute('data-dsh-claude-footer-entry', '')
          var all = entry.querySelectorAll('*')
          for (var j = 0; j < all.length; j++) {
            var el = all[j]
            if (el.hasAttribute('data-dsh-claude-footer-overlay')) continue
            var role = el.getAttribute('role') || ''
            var overlay = role === 'dialog' || role === 'menu' || role === 'listbox'
            if (!overlay) {
              try { overlay = window.getComputedStyle(el).position === 'fixed' } catch (e) { overlay = false }
            }
            if (overlay) el.setAttribute('data-dsh-claude-footer-overlay', '')
          }
          markFooterHiddenBranches(entry)
        }
        return entries
      }

      /**
       * Mirrorable footer units. Every slot outlet renders inside a
       * `div[data-slot]` anchor with `display:contents`, so a list slot's
       * entries are the ANCHOR's children, not footerActions' — reading
       * `footerActions.children` directly collapses every registrant into a
       * single mirrorable unit and drops all but the first from the popover.
       * Dead cells (`data-slot-error`) never mirror.
       */
      function footerEntriesOf(footerActions) {
        var entries = []
        var kids = footerActions.children
        for (var i = 0; i < kids.length; i++) {
          var kid = kids[i]
          if (kid.hasAttribute('data-slot-error')) continue
          if (kid.hasAttribute('data-slot')) {
            var slotKids = kid.children
            for (var j = 0; j < slotKids.length; j++) {
              if (!slotKids[j].hasAttribute('data-slot-error')) entries.push(slotKids[j])
            }
          } else {
            entries.push(kid)
          }
        }
        return entries
      }

      /** Hide every branch of `el`'s subtree that does not carry an overlay. */
      function markFooterHiddenBranches(el) {
        if (el.hasAttribute('data-dsh-claude-footer-overlay')) {
          el.removeAttribute('data-dsh-claude-footer-hidden')
          return
        }
        if (el.querySelector('[data-dsh-claude-footer-overlay]') !== null) {
          el.removeAttribute('data-dsh-claude-footer-hidden')
          var kids = el.children
          for (var i = 0; i < kids.length; i++) markFooterHiddenBranches(kids[i])
          return
        }
        el.setAttribute('data-dsh-claude-footer-hidden', '')
      }

      /** Remove the mirrored text item for one entry index, if present. */
      function removeActionMirror(idx) {
        var item = popoverBody.querySelector('[data-action-index="' + idx + '"]')
        if (item && item.parentElement) item.parentElement.removeChild(item)
      }

      /** Remove the embedded widget clone for one entry index, if present. */
      function removeEmbedMirror(idx) {
        var embed = popoverBody.querySelector('[data-embed-index="' + idx + '"]')
        if (embed && embed.parentElement) embed.parentElement.removeChild(embed)
      }

      /**
       * Whether an entry reads as a plain ACTION (mirror it as a text menu
       * item) or as a rich WIDGET (embed a live clone). A text item is only
       * faithful when the trigger accounts for essentially all of the
       * entry's visible content: a clickable progress-bar stack (cost-meter
       * balance) would otherwise shrink to one label and lose its bars.
       * Overlay text is excluded so an open cordis panel does not flip its
       * own entry into a widget.
       */
      function entryIsActionLike(entry, trigger) {
        if (trigger === null) return false
        if (trigger === entry) {
          // Only genuinely interactive ROOTS count as actions; a clickable
          // container (a region or tabindex wrapper) is still a widget.
          var tag = entry.tagName
          var role = entry.getAttribute('role') || ''
          return tag === 'BUTTON' || tag === 'A' || role === 'button'
        }
        // Semantic meter markup is always a widget, however small.
        if (entry.querySelector('[role="progressbar"], [role="meter"], meter, progress') !== null) return false
        var entryText = textExcludingOverlays(entry)
        var triggerText = (trigger.textContent || '').trim()
        // Tight slack: the trigger must account for essentially all of the
        // entry's visible text. A balance box reading "余额¥10.07" beside an
        // icon-only trigger already exceeds it — and its bar must survive.
        return entryText.length - triggerText.length <= 2
      }

      /** Visible text of an entry, skipping overlay subtrees. */
      function textExcludingOverlays(entry) {
        var text = ''
        var walker = document.createTreeWalker(entry, 4 /* SHOW_TEXT */, {
          acceptNode: function (node) {
            var p = node.parentElement
            while (p && p !== entry) {
              if (p.hasAttribute('data-dsh-claude-footer-overlay')) return 2 // REJECT
              p = p.parentElement
            }
            return 1 // ACCEPT
          }
        })
        while (walker.nextNode()) text += walker.currentNode.nodeValue
        return text.trim()
      }

      /**
       * Embed a live clone of a display-only footer entry (a progress bar
       * reads as nothing as a text menu item — the cost-meter balance/quota
       * stack is the known case). The clone is replaced only when the
       * source's markup changes, so it tracks the plugin's re-renders without
       * churning the popover DOM. Skin marker attributes, ids, and overlay
       * subtrees are stripped from the copy: it must never be re-hidden by
       * the footArea hiding rule, double-register an id, or duplicate an
       * open panel next to the real one. Event listeners do not survive
       * cloning, so the embed forwards clicks back into the live entry —
       * path-mapped to the clicked sub-control (see resolveEmbedActivator) —
       * and deliberately leaves the popover open so the widget's response
       * stays visible; it still closes on pointer-leave as usual. The embed
       * is marked `data-clickable` for the cursor when the entry has a
       * trigger at all.
       */
      function syncEmbedMirror(entry, idx, forward) {
        var embed = popoverBody.querySelector('[data-embed-index="' + idx + '"]')
        if (!embed) {
          embed = document.createElement('div')
          embed.className = 'dsh-claude-popover-embed'
          embed.setAttribute('data-embed-index', idx)
          embed.addEventListener('click', function (e) {
            if (!embed.__dshEntry) return
            e.stopPropagation()
            var activator = resolveEmbedActivator(e.target, embed)
            if (activator) activator.click()
          })
          popoverBody.insertBefore(embed, settingsItem)
        }
        embed.__dshEntry = entry
        embed.__dshForward = forward || null
        if (forward) {
          embed.setAttribute('data-clickable', '')
        } else {
          embed.removeAttribute('data-clickable')
        }
        var clone = entry.cloneNode(true)
        clone.removeAttribute('id')
        clone.removeAttribute('data-dsh-claude-footer-entry')
        clone.removeAttribute('data-dsh-claude-footer-hidden')
        clone.removeAttribute('data-dsh-claude-footer-overlay')
        var overlays = clone.querySelectorAll('[data-dsh-claude-footer-overlay]')
        for (var o = 0; o < overlays.length; o++) {
          overlays[o].parentElement.removeChild(overlays[o])
        }
        var stripped = clone.querySelectorAll('[id], [data-dsh-claude-footer-hidden]')
        for (var s = 0; s < stripped.length; s++) {
          stripped[s].removeAttribute('id')
          stripped[s].removeAttribute('data-dsh-claude-footer-hidden')
        }
        var html = clone.outerHTML
        if (embed.getAttribute('data-embed-html') !== html) {
          embed.setAttribute('data-embed-html', html)
          while (embed.firstChild) embed.removeChild(embed.firstChild)
          embed.appendChild(clone)
        }
      }

      var INTERACTIVE_SELECTOR = 'button, [role="button"], a[href], [tabindex], input, select, summary'

      /**
       * Map a click inside the embedded clone back to the matching control
       * of the live entry. Forwarding every embed click to the entry's FIRST
       * trigger misfires for multi-control widgets (the cost-meter stack
       * carries refresh / collapse / tab buttons): the user clicks the
       * balance box but the first button in tree order fires. The clone
       * preserves the entry's tree shape, so the clicked node's child-index
       * path replays onto the original (tag-checked per level — overlay
       * stripping can shift siblings); the nearest interactive element at or
       * above the mapped node wins, and any mismatch falls back to the
       * entry's primary trigger.
       */
      function resolveEmbedActivator(clicked, embed) {
        var entry = embed.__dshEntry
        var cloneRoot = embed.firstChild
        if (!entry || !cloneRoot || !clicked || clicked.nodeType !== 1) return embed.__dshForward
        if (clicked === embed || clicked === cloneRoot) return embed.__dshForward
        // Child-index path from the clicked clone node up to the clone root.
        var path = []
        var node = clicked
        while (node && node !== cloneRoot) {
          var parent = node.parentElement
          if (!parent) return embed.__dshForward
          path.unshift(Array.prototype.indexOf.call(parent.children, node))
          node = parent
        }
        // Replay the path on the live entry, verifying shape level by level.
        var original = entry
        var cloneNode = cloneRoot
        for (var i = 0; i < path.length; i++) {
          var nextClone = cloneNode.children[path[i]]
          var nextOrig = original.children[path[i]]
          if (!nextClone || !nextOrig || nextClone.tagName !== nextOrig.tagName) {
            return embed.__dshForward
          }
          cloneNode = nextClone
          original = nextOrig
        }
        // Nearest interactive element at or above the mapped original,
        // bounded by the entry and never inside an overlay subtree.
        var target = original
        while (target) {
          if (target !== entry && target.matches && target.matches(INTERACTIVE_SELECTOR) &&
              !hasOverlayAncestor(target, entry)) {
            return target
          }
          if (target === entry) break
          target = target.parentElement
        }
        return embed.__dshForward
      }

      /** Whether `el` sits inside an overlay-marked subtree above `entry`. */
      function hasOverlayAncestor(el, entry) {
        var node = el
        while (node && node !== entry) {
          if (node.hasAttribute && node.hasAttribute('data-dsh-claude-footer-overlay')) return true
          node = node.parentElement
        }
        return false
      }

      /**
       * First interactive element of a footer entry that is not part of an
       * overlay subtree (an open panel may render action buttons of its own,
       * and those must never become the popover item's activation target).
       */
      function findFooterTrigger(entry) {
        var selector = INTERACTIVE_SELECTOR
        if (entry.matches && entry.matches(selector) &&
            !entry.hasAttribute('data-dsh-claude-footer-overlay')) {
          return entry
        }
        var found = entry.querySelectorAll(selector)
        for (var i = 0; i < found.length; i++) {
          var candidate = found[i]
          var node = candidate
          var insideOverlay = false
          while (node && node !== entry) {
            if (node.hasAttribute && node.hasAttribute('data-dsh-claude-footer-overlay')) {
              insideOverlay = true
              break
            }
            node = node.parentElement
          }
          if (!insideOverlay) return candidate
        }
        return null
      }

      /**
       * Hand the sidebar footer back to the host.
       *
       * The "Collapse the sidebar settings area" preference turns the whole
       * takeover off, so the skin's own nodes go and every marker it put on the
       * host's entries is removed — with the stylesheet's takeover rules gated
       * on the same attribute, the footer then renders exactly as shipped.
       */
      function dropAccountFooter(footArea) {
        cancelClosePopover()
        if (accountBtn !== null && accountBtn.parentElement !== null) accountBtn.parentElement.removeChild(accountBtn)
        if (accountPopover !== null && accountPopover.parentElement !== null) {
          accountPopover.parentElement.removeChild(accountPopover)
        }
        accountBtn = null
        accountPopover = null
        popoverBody = null
        settingsItem = null
        var marked = footArea.querySelectorAll(
          '[data-dsh-claude-footer-entry], [data-dsh-claude-footer-hidden], [data-dsh-claude-footer-overlay]',
        )
        for (var i = 0; i < marked.length; i++) {
          marked[i].removeAttribute('data-dsh-claude-footer-entry')
          marked[i].removeAttribute('data-dsh-claude-footer-hidden')
          marked[i].removeAttribute('data-dsh-claude-footer-overlay')
        }
      }
      function syncAccountFooter() {
        var footArea = document.querySelector('[class*="footArea"]')
        if (footArea === null) return

        if (!readPrefs().collapseFooter) {
          dropAccountFooter(footArea)
          return
        }
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

          // Hover is the default way in; the "Open popovers on hover"
          // preference turns it off, leaving the click handler below as the only
          // way in (and the only way out, so a click-opened popover does not
          // vanish when the pointer leaves).
          accountBtn.addEventListener('mouseenter', function () {
            if (readPrefs().autoPopover) openPopover()
          })
          accountBtn.addEventListener('mouseleave', function () {
            if (readPrefs().autoPopover && !popoverOpenedByClick) scheduleClosePopover()
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

          // The account row is the ban-screen easter egg's trigger
          // (src/overrides/ban-screen.js). The marker attribute stays on the
          // header (it is the row's stable hook, and the row keeps its
          // semantics), but the header is only a WRAPPER: the clickable strip is
          // the inner `.…-row`, and the divider is its SIBLING so the hover
          // plate covers the name alone instead of swallowing the rule.
          var header = document.createElement('div')
          header.className = 'dsh-claude-account-popover-header'
          header.setAttribute('data-dsh-claude-ban-row', '')

          var rowEl = document.createElement('div')
          rowEl.className = 'dsh-claude-account-popover-row'
          rowEl.setAttribute('role', 'button')
          rowEl.setAttribute('tabindex', '0')
          rowEl.setAttribute('aria-haspopup', 'dialog')

          var nameEl = document.createElement('div')
          nameEl.className = 'dsh-claude-account-popover-name'
          nameEl.textContent = username

          var divider = document.createElement('div')
          divider.className = 'dsh-claude-account-popover-divider'

          rowEl.appendChild(nameEl)
          header.appendChild(rowEl)
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

        // The account row is the ban-screen easter egg's trigger (ban-screen.js).
        // Bound OUTSIDE the build/refresh branch above so the pass that creates
        // the popover already wires the row — inside the `else` the very first
        // render would leave it dead until the next sync. `__dshBanBound` keeps
        // a later pass from binding it twice, which would open the overlay twice
        // per click.
        var banRow = accountPopover.querySelector('[data-dsh-claude-ban-row]')
        if (banRow && !banRow.__dshBanBound) {
          banRow.__dshBanBound = true
          banRow.addEventListener('click', function (e) {
            // The row's gesture is the easter egg, not a popover selection.
            e.preventDefault()
            e.stopPropagation()
            // Leave the popover up: the overlay is a full-window surface, so
            // what is behind it does not matter, and the footer is left as the
            // user had it once the screen is dismissed. The pointer is still
            // parked on the trigger, so the mouseleave close stays suspended
            // (popoverOpenedByClick) and the panel does not blink out from under
            // the overlay.
            popoverOpenedByClick = true
            if (ui.ban) ui.ban.open()
          })
          banRow.addEventListener('keydown', function (e) {
            if (e.key !== 'Enter' && e.key !== ' ') return
            e.preventDefault()
            e.stopPropagation()
            popoverOpenedByClick = true
            if (ui.ban) ui.ban.open()
          })
        }

        syncPopoverItems(footArea)
      }


      ui.footer = {
        sync: syncAccountFooter,
        close: closePopover,
        owns: function (target) {
          if (!target) return false
          return (accountBtn !== null && accountBtn.contains(target)) ||
                 (accountPopover !== null && accountPopover.contains(target))
        },
        isOpen: function () {
          return !!(accountPopover && accountPopover.getAttribute('data-open') === 'true')
        },
        reposition: positionAccountPopover
      }

      return function () {
        cancelClosePopover()
        var footArea = document.querySelector('[class*="footArea"]')
        if (footArea) {
          dropAccountFooter(footArea)
        } else {
          if (accountBtn !== null && accountBtn.parentElement !== null) accountBtn.parentElement.removeChild(accountBtn)
          if (accountPopover !== null && accountPopover.parentElement !== null) accountPopover.parentElement.removeChild(accountPopover)
          accountBtn = null
          accountPopover = null
          popoverBody = null
          settingsItem = null
        }
      }
    }

    // ============================================================================
    // 账户封禁彩蛋 (Account-ban Easter Egg)
    // ============================================================================
    /**
     * The "Your account is on hold" screen, reproduced from Claude's own
     * account-hold page. It is an EASTER EGG, not a real state: nothing here
     * touches the host, the session, or the preference store — the overlay is
     * one node appended to `<body>` and removed again on the way out.
     *
     * Entry is the account row at the top of the sidebar footer's account
     * popover (src/overrides/account-footer.js binds that row to
     * `ui.ban.open()`). Exit follows the way in — every control the page
     * paints ("Sign out", "Request a review", the two "What you can do" rows,
     * the toast's dismiss button, the window controls) closes it, and Esc
     * closes it (scheduler.js's global key handler). Nothing inside the overlay
     * performs the action its label names.
     *
     * Losing focus does NOT close it, on purpose. The page is something to
     * READ: the reader has to switch windows to look something up, and an
     * overlay that vanishes the moment they do is worse than one that waits.
     * Leaving is always an explicit act — a control on the page or Esc — so the
     * blur listener this used to carry is gone.
     *
     * Layout note: the overlay is `position: fixed` at the top of the stacking
     * order rather than a real page, so it covers the whole window (sidebar,
     * titlebar, composer) whatever the host renders underneath — and it can
     * never be clipped by the sidebar column, which the account popover itself
     * has to work around.
     */
    function installBanScreen(ctx, ui) {
      var banRoot = null

      /**
       * Close the easter egg. Safe to call at any time (teardown, a second
       * click, a missing overlay): everything is null-checked and the handle
       * is idempotent, so the caller never has to know the current state.
       */
      function closeBanScreen() {
        if (banRoot !== null && banRoot.parentElement !== null) {
          banRoot.parentElement.removeChild(banRoot)
        }
        banRoot = null
      }

      /** Whether `node` is one of the overlay's own dismiss controls. */
      function isBanDismissTarget(node) {
        var el = node
        while (el && el !== banRoot) {
          if (el.nodeType === 1 && el.hasAttribute('data-dsh-ban-dismiss')) return true
          el = el.parentElement
        }
        return false
      }

      /**
       * One inline SVG. The page's own icons: none of them ship as assets.
       *
       * `strokeWidth` is a PARAMETER, not an extra attribute: appending a second
       * `stroke-width` to the same `<svg>` produces a duplicate attribute, and
       * the HTML parser drops every attribute after the first — the override
       * silently does nothing and the icon keeps the set's own 1.6 (which is how
       * the lock shipped at nearly 4px instead of the traced weight).
       */
      function banSvg(body, strokeWidth) {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' +
          (strokeWidth === undefined ? 1.6 : strokeWidth) + '" ' +
          'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>'
      }

      /**
       * The lock is a HAND-DRAWN TRACE, not a `rect` + `circle` assembly: every
       * edge is a cubic whose anchors and handles carry the sketch's own wobble.
       * Nothing here is a filter or a jitter — the hand-drawn character lives in
       * the anchor points themselves, so it survives any scale, and the geometry
       * stays reviewable: each `C` below is one anchor with its two handles.
       *
       * What the anchors encode, read off the reference sketch: the body's top
       * edge slants down to the right while the bottom edge sags; the left side
       * drifts outward on the way down and the right side bows out around the
       * keyhole before coming back; a short diagonal cuts each corner so no two
       * strokes meet at a perfect right angle; the shackle's two arches are not
       * concentric and its legs stop on the body's top edge instead of crossing
       * it; the keyhole's head is flatter than a circle, its waist sits
       * off-centre, and its base flares wider than the head.
       *
       * The numbers are the reference's ink centrelines (measured off an 89x92
       * px drawing) mapped onto this icon set's 24-unit grid: the ink box
       * (58.5x76.3 px) becomes 15.3x20 units, centred. `stroke-width` is 0.5
       * units — the ban screen paints this in a 75px box, so the ink lands at
       * ~61px and the line at ~1.6px, which is the weight the reference itself
       * is drawn at (a 2px line on a 77px lock).
       */
      /** The overlay's icon set, in one place so the markup below stays readable. */
      var BAN_ICONS = {
        lock: banSvg(
          // body: top edge, right side (with its outward bow), bottom edge, left side
          '<path d="M4.412 9.025 C9.287 8.894 14.136 9.077 19.379 9.182' +
          ' C19.379 11.541 19.379 13.638 19.405 14.949' +
          ' C19.667 15.735 19.641 16.784 19.457 17.57' +
          ' C19.379 18.619 19.379 20.191 19.379 21.659' +
          ' C14.923 21.764 9.156 21.764 4.674 21.659' +
          ' C4.7 19.405 4.7 16.26 4.674 14.163' +
          ' C4.621 13.114 4.516 12.066 4.438 11.279' +
          ' C4.385 10.231 4.385 9.444 4.412 9.025 Z"></path>' +
          // shackle: outer arch, then the inner one, both ending on the top edge
          '<path d="M8.081 8.972 C7.95 7.872 7.95 6.561 8.081 5.25' +
          ' C8.212 3.94 8.789 2.734 9.837 2.341' +
          ' C10.676 2.105 12.721 2.131 13.507 2.315' +
          ' C14.503 2.603 15.29 3.258 15.394 4.071' +
          ' C15.499 5.25 15.499 6.561 15.526 9.156' +
          ' M9.89 9.025 C9.785 7.609 9.785 6.299 9.89 5.25' +
          ' C9.995 4.359 10.519 3.861 11.567 3.861' +
          ' C12.537 3.809 13.324 4.097 13.664 4.988' +
          ' C13.796 5.644 13.796 7.085 13.796 9.13"></path>' +
          // keyhole: head, right wall into the waist, base, left wall back up
          '<path d="M10.021 14.634 C9.864 14.32 9.811 14.11 9.811 13.9' +
          ' C9.759 13.245 9.916 12.485 10.729 12.092' +
          ' C11.253 11.882 12.197 11.882 12.695 12.092' +
          ' C13.271 12.301 13.691 12.983 13.664 13.9' +
          ' C13.664 14.11 13.612 14.32 13.35 14.634' +
          ' C13.166 14.844 12.773 15.001 12.695 15.316' +
          ' C12.668 15.84 13.455 17.046 13.927 18.383' +
          ' C12.433 18.592 10.86 18.566 9.68 18.435' +
          ' C10.152 17.151 10.702 16.417 10.598 15.683' +
          ' C10.519 15.263 10.257 14.949 10.021 14.634 Z"></path>',
          0.5
        ),
        warning: banSvg(
          '<path d="M10.3 3.9 2.6 17.2a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"></path>' +
          '<path d="M12 9v4.2"></path>' +
          '<path d="M12 16.8h.01"></path>'
        ),
        close: banSvg('<path d="M6.4 6.4 17.6 17.6"></path><path d="M17.6 6.4 6.4 17.6"></path>'),
        download: banSvg('<path d="M12 3.5v11"></path><path d="m7.5 10 4.5 4.5 4.5-4.5"></path><path d="M4.5 19.5h15"></path>'),
        trash: banSvg(
          '<path d="M4.5 6.8h15"></path>' +
          '<path d="M9.5 6.8V5.2a1.2 1.2 0 0 1 1.2-1.2h2.6a1.2 1.2 0 0 1 1.2 1.2v1.6"></path>' +
          '<path d="M6.8 6.8 7.7 19a1.5 1.5 0 0 0 1.5 1.4h5.6a1.5 1.5 0 0 0 1.5-1.4l.9-12.2"></path>' +
          '<path d="M10.3 10.4v6.2"></path><path d="M13.7 10.4v6.2"></path>'
        ),
        chevron: banSvg('<path d="m9.5 5.5 7 6.5-7 6.5"></path>'),
        minimize: banSvg('<path d="M4 12h16"></path>'),
        maximize: banSvg('<rect x="4.5" y="4.5" width="15" height="15" rx="2"></rect>'),
        restore: banSvg(
          '<rect x="4.5" y="8.5" width="11" height="11" rx="2"></rect>' +
          '<path d="M8.5 8.5V6a1.5 1.5 0 0 1 1.5-1.5h8A1.5 1.5 0 0 1 19.5 6v8a1.5 1.5 0 0 1-1.5 1.5h-2.5"></path>'
        ),
      }

      /**
       * The hold timestamp. The date part is Claude's own format ("Jul 4, 2026")
       * and is built by hand rather than through `toLocaleString`, because the
       * page is a fixed bilingual document and the stamp must not re-translate
       * itself into a third format when the browser's locale is neither of the
       * two. The time part follows the chosen language's own convention — the
       * AM/PM clock in English, the 24-hour clock in Chinese.
       */
      var BAN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      function formatBanStamp(date) {
        var datePart = BAN_MONTHS[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear()
        var timePart
        if (readPrefs().banLocale === BAN_LOCALE_ZH) {
          var hh = date.getHours()
          var mm = date.getMinutes()
          timePart = (hh < 10 ? '0' + hh : String(hh)) + ':' + (mm < 10 ? '0' + mm : String(mm))
        } else {
          var hours = date.getHours()
          var hour12 = hours % 12
          if (hour12 === 0) hour12 = 12
          var minutes = date.getMinutes()
          timePart = hour12 + ':' + (minutes < 10 ? '0' + minutes : String(minutes)) + ' ' + (hours < 12 ? 'AM' : 'PM')
        }
        return datePart + ', ' + timePart
      }

      /** When the open overlay is dated, so a refresh never re-dates the page. */
      var banOpenedAt = null

      /**
       * Show the screen.
       *
       * @param bannedAt - when the "hold" is dated; defaults to now. Exposed so
       *   a caller (or a probe) can pin the timestamp instead of reading it off
       *   the clock.
       */
      function openBanScreen(bannedAt) {
        closeBanScreen()
        if (typeof document === 'undefined' || document.body === null) return

        var root = document.createElement('div')
        root.className = 'dsh-claude-ban'
        root.setAttribute('role', 'dialog')
        root.setAttribute('aria-modal', 'true')
        root.setAttribute('data-dsh-ban', '')

        banOpenedAt = bannedAt instanceof Date ? bannedAt : new Date()
        var stamp = formatBanStamp(banOpenedAt)
        var username = getUsername(ctx)

        // The wordmark follows the brand preference like the sidebar does; the
        // "off" choice only drops the starburst, since a bare "Claude" text
        // wordmark is what the page is.
        var brand = readPrefs().brand
        var showMark = brand !== BRAND_OFF
        var useAnthropic = brand === BRAND_ANTHROPIC

        root.innerHTML =
          '<div class="dsh-claude-ban-bar">' +
            '<div class="dsh-claude-ban-brand">' +
              (showMark ? '<span class="dsh-claude-ban-mark"></span>' : '') +
              '<span class="dsh-claude-ban-word"></span>' +
            '</div>' +
            '<div class="dsh-claude-ban-bar-actions">' +
              '<button type="button" class="dsh-claude-ban-signout" data-dsh-ban-dismiss>' +
                banCopy('signOut', 'Sign out') +
              '</button>' +
              '<div class="dsh-claude-ban-window" aria-hidden="true">' +
                '<button type="button" class="dsh-claude-ban-win" tabindex="-1" data-dsh-ban-dismiss>' + BAN_ICONS.minimize + '</button>' +
                '<button type="button" class="dsh-claude-ban-win" tabindex="-1" data-dsh-ban-dismiss>' + BAN_ICONS.restore + '</button>' +
                '<button type="button" class="dsh-claude-ban-win" tabindex="-1" data-dsh-ban-dismiss>' + BAN_ICONS.close + '</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="dsh-claude-ban-toast" data-dsh-ban-dismiss role="status">' +
            '<span class="dsh-claude-ban-toast-icon">' + BAN_ICONS.warning + '</span>' +
            '<span class="dsh-claude-ban-toast-text">' + username + ': account_banned</span>' +
            '<span class="dsh-claude-ban-toast-close">' + BAN_ICONS.close + '</span>' +
          '</div>' +
          '<div class="dsh-claude-ban-scroll">' +
            '<div class="dsh-claude-ban-column">' +
              '<span class="dsh-claude-ban-lock">' + BAN_ICONS.lock + '</span>' +
              '<h1 class="dsh-claude-ban-title">' + banCopy('title', 'Your account is on hold') + '</h1>' +
              '<p class="dsh-claude-ban-lead">' +
                banCopy('lead', 'We put your account on hold on <strong>{time}</strong> because of unusual activity. Your chats and data are safe.', { time: stamp }) +
              '</p>' +
              '<p class="dsh-claude-ban-lead">' + banCopy('leadError', 'If you think this hold is an error, you can request an account review.') + '</p>' +
              '<p class="dsh-claude-ban-next">' + banCopy('nextLabel', 'What happens next:') + '</p>' +
              '<div class="dsh-claude-ban-card">' +
                '<div class="dsh-claude-ban-step">' +
                  '<span class="dsh-claude-ban-step-num">1</span>' +
                  '<span class="dsh-claude-ban-step-body">' +
                    '<span class="dsh-claude-ban-step-title">' + banCopy('step1Title', 'Request a review') + '</span>' +
                    '<span class="dsh-claude-ban-step-desc">' + banCopy('step1Desc', 'Tell us more about what happened.') + '</span>' +
                  '</span>' +
                '</div>' +
                '<div class="dsh-claude-ban-step">' +
                  '<span class="dsh-claude-ban-step-num">2</span>' +
                  '<span class="dsh-claude-ban-step-body">' +
                    '<span class="dsh-claude-ban-step-title">' + banCopy('step2Title', 'We\u2019ll review your account') + '</span>' +
                    '<span class="dsh-claude-ban-step-desc">' + banCopy('step2Desc', 'A team member will review your request and account activity together.') + '</span>' +
                  '</span>' +
                '</div>' +
                '<div class="dsh-claude-ban-step">' +
                  '<span class="dsh-claude-ban-step-num">3</span>' +
                  '<span class="dsh-claude-ban-step-body">' +
                    '<span class="dsh-claude-ban-step-title">' + banCopy('step3Title', 'We\u2019ll email you the outcome') + '</span>' +
                    '<span class="dsh-claude-ban-step-desc">' + banCopy('step3Desc', 'Reviews take about 10 days.') + '</span>' +
                  '</span>' +
                '</div>' +
              '</div>' +
              '<button type="button" class="dsh-claude-ban-primary" data-dsh-ban-dismiss>' +
                banCopy('review', 'Request a review') +
              '</button>' +
              '<h2 class="dsh-claude-ban-subtitle">' + banCopy('whatYouCanDo', 'What you can do') + '</h2>' +
              '<div class="dsh-claude-ban-card dsh-claude-ban-actions">' +
                '<button type="button" class="dsh-claude-ban-action" data-dsh-ban-dismiss>' +
                  '<span class="dsh-claude-ban-action-icon">' + BAN_ICONS.download + '</span>' +
                  '<span class="dsh-claude-ban-action-text">' +
                    '<span class="dsh-claude-ban-action-title">' + banCopy('exportTitle', 'Export your data') + '</span>' +
                    '<span class="dsh-claude-ban-action-desc">' + banCopy('exportDesc', 'We\u2019ll package up your conversations, projects, and settings for download. This might take some time to complete.') + '</span>' +
                  '</span>' +
                  '<span class="dsh-claude-ban-action-chevron">' + BAN_ICONS.chevron + '</span>' +
                '</button>' +
                '<button type="button" class="dsh-claude-ban-action" data-dsh-ban-dismiss>' +
                  '<span class="dsh-claude-ban-action-icon">' + BAN_ICONS.trash + '</span>' +
                  '<span class="dsh-claude-ban-action-text">' +
                    '<span class="dsh-claude-ban-action-title dsh-claude-ban-action-title-danger">' + banCopy('deleteTitle', 'Delete your account') + '</span>' +
                    '<span class="dsh-claude-ban-action-desc">' + banCopy('deleteDesc', 'You can permanently delete your account and data. This can\u2019t be undone.') + '</span>' +
                  '</span>' +
                  '<span class="dsh-claude-ban-action-chevron">' + BAN_ICONS.chevron + '</span>' +
                '</button>' +
              '</div>' +
            '</div>' +
          '</div>'

        // One listener for every way out that is a click: the markup marks each
        // control with `data-dsh-ban-dismiss`, and a click that lands on the
        // page's empty canvas stays put (so the page can still be read). The
        // keyboard way out is Esc, handled with the other overlays in
        // scheduler.js — deliberately not a window `blur`, which would close
        // the page the moment the reader switched windows to look something up.
        root.addEventListener('click', function (e) {
          if (isBanDismissTarget(e.target)) closeBanScreen()
        })

        banRoot = root
        document.body.appendChild(root)
      }

      // The account row reaches this through the shared `ui` handle registry —
      // the same discipline the scheduler and the other features use — so the
      // handle must be REGISTERED here, not merely returned. (The account row is
      // wired in account-footer.js before this runs, but it only reads
      // `ui.ban` at click time, so the order is safe either way.)
      ui.ban = {
        open: openBanScreen,
        close: closeBanScreen,
        isOpen: function () {
          return banRoot !== null
        },
        /**
         * Rebuild an OPEN overlay in place — the page is assembled once, so a
         * change of the language preference (or of the brand mark) would
         * otherwise only land the next time it is opened. A no-op while closed,
         * and the hold timestamp is kept so a re-render never re-dates the page
         * under the reader.
         */
        refresh: function () {
          if (banRoot === null) return
          openBanScreen(banOpenedAt === null ? new Date() : banOpenedAt)
        },
      }

      return closeBanScreen
    }

    // ============================================================================
    // 主题翻转：瞬时抑制过渡 (Theme Flip: Instant Swap)
    // ============================================================================
    /**
     * The skin's own 0.12s border/box-shadow transitions (composer card, input
     * scroll, attachment rail, hero tray) are worth keeping for hover/focus, but
     * a theme flip re-runs them: the canvas repaints in one recalc (CSS
     * variables swap with the attribute) while the borders and halos ease in
     * behind it — the staged "colours first, styles later" beat. Two layers
     * make the swap land in one frame:
     *
     * 1. An attribute on <html> and <body> suppresses every transition the
     *    suppression rule can out-specify (see styles/theme-flip.css).
     * 2. A forced style flush inside the flip's microtask, then cancelling
     *    every running paint transition: the flush makes the transitions the
     *    flip would start NOW (before any paint), and cancel() snaps
     *    their properties to the final values in the same frame. This covers
     *    the high-specificity rules the stylesheet cannot out-specify (the
     *    input scroll is (0,6,1), the rail (0,7,1)). A cancel in a rAF would
     *    be one frame late — recalc runs after rAF callbacks.
     *
     * Only paint properties themes actually change are cancelled; transform
     * and opacity transitions (hover/menu feedback) keep running. The flag
     * comes down after a short window, so everyday hover/focus feel is
     * untouched.
     *
     * The host flips `data-ds-dark-theme` on <body> itself; this observer only
     * times the suppression around that flip. It deliberately does NOT live
     * in the scheduler: the scheduler's pass observer only watches
     * aria-label/aria-selected (D9), and this flag must not feed it.
     */
    var THEME_FLIP_ATTR = 'data-dsh-theme-transitioning'
    var THEME_FLIP_MS = 300
    // Paint properties a theme flip changes; cancelling their transitions
    // snaps them to the new theme's values in one frame.
    var THEME_FLIP_PROPS = {
      'border-color': true,
      'border': true,
      'border-top-color': true,
      'border-right-color': true,
      'border-bottom-color': true,
      'border-left-color': true,
      'box-shadow': true,
      'color': true,
      'background-color': true,
      'background': true,
      'background-image': true,
      'outline-color': true,
      'fill': true,
      'stroke': true,
      'text-decoration-color': true,
      'caret-color': true
    }

    function installThemeFlip() {
      var body = document.body
      var root = document.documentElement
      var flipTimer = null

      // The flag lives on <html> AND <body> so the suppression selector can
      // out-specify the gated composer rules it can (html[flag] body[skin][flag] *).
      function setFlag(on) {
        if (on) {
          root.setAttribute(THEME_FLIP_ATTR, '')
          body.setAttribute(THEME_FLIP_ATTR, '')
        } else {
          root.removeAttribute(THEME_FLIP_ATTR)
          body.removeAttribute(THEME_FLIP_ATTR)
        }
      }

      function cancelThemeTransitions() {
        var anims = document.getAnimations()
        for (var i = 0; i < anims.length; i++) {
          var anim = anims[i]
          // CSSTransition carries transitionProperty; CSSAnimation does not.
          if (!anim || typeof anim.transitionProperty !== 'string') continue
          if (!THEME_FLIP_PROPS[anim.transitionProperty]) continue
          try { anim.cancel() } catch (error) { /* already finished */ }
        }
      }

      function onThemeFlip() {
        setFlag(true)
        // Force the flip's style recalc right now — inside this microtask,
        // before any paint — so every transition it would start has started.
        void root.offsetHeight
        cancelThemeTransitions()
        // The host may commit more of the flip after us; sweep the next two
        // frames to catch those starts as well.
        requestAnimationFrame(function () {
          cancelThemeTransitions()
          requestAnimationFrame(cancelThemeTransitions)
        })
        if (flipTimer !== null) clearTimeout(flipTimer)
        flipTimer = setTimeout(function () {
          setFlag(false)
          flipTimer = null
        }, THEME_FLIP_MS)
      }

      var themeObserver = new MutationObserver(onThemeFlip)
      themeObserver.observe(body, { attributes: true, attributeFilter: ['data-ds-dark-theme'] })

      return function () {
        themeObserver.disconnect()
        if (flipTimer !== null) clearTimeout(flipTimer)
        setFlag(false)
      }
    }

    // ============================================================================
    // 响应式调度与生命周期清理 (Scheduler & Teardown)
    // ============================================================================
    function installScheduler(ctx, ui) {
      function onGlobalPointerDown(e) {
        var target = e.target
        // The model picker is hover-driven; a press anywhere outside its
        // trigger and both levels closes it (same discipline as the perm menu).
        if (target && ui.model && !ui.model.owns(target)) {
          ui.model.close()
        }
        if (ui.settings) ui.settings.sync()
        if (!ui.footer || !ui.footer.isOpen()) return
        if (target && ui.footer.owns(target)) return
        ui.footer.close()
      }

      function onGlobalKeyDown(e) {
        if (e.key === 'Escape') {
          if (ui.footer) ui.footer.close()
          if (ui.permissions) ui.permissions.closeMenu()
          if (ui.model) ui.model.close()
          // The account-hold overlay is the one layer that does NOT close on a
          // window blur (it is meant to be read, and reading it may mean
          // switching windows), so Esc is its keyboard way out.
          if (ui.ban) ui.ban.close()
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

      function onComposerInput(e) {
        var target = e.target
        if (!target) return
        if (target.hasAttribute && (target.hasAttribute('data-composer-input') || (target.closest && target.closest('[data-composer-input]')))) {
          if (ui.copy && ui.copy.syncAttachmentPlaceholder) ui.copy.syncAttachmentPlaceholder()
        }
      }

      document.addEventListener('pointerdown', onGlobalPointerDown)
      document.addEventListener('pointerdown', onCardPointerDown)
      document.addEventListener('keydown', onGlobalKeyDown, true)
      document.addEventListener('input', onComposerInput, true)
      document.addEventListener('compositionend', onComposerInput, true)

      // Both fixed popovers are anchored to their trigger; scroll of the page
      // (not the conversation's own auto-stick) and resizes move the anchor, so
      // whichever is open must re-resolve it.
      function onFixedPopoverViewportChange() {
        if (ui.model) ui.model.reposition()
        if (ui.footer && ui.footer.isOpen()) ui.footer.reposition()
      }
      window.addEventListener('resize', onFixedPopoverViewportChange)
      window.addEventListener('scroll', onFixedPopoverViewportChange, true)

      // The picker's copy follows the shell language, so a locale switch has to
      // rebuild the rows it already painted. Subscribing here (rather than
      // reading the locale at render time only) is what makes the change land
      // while a popover is open.
      var localeUnsubscribe = null
      function onLocaleChange() {
        if (ui.model) ui.model.invalidateCopy()
        schedule()
      }
      try {
        var localeService = ctx.get('locale')
        if (localeService && typeof localeService.subscribe === 'function') {
          localeUnsubscribe = localeService.subscribe(onLocaleChange)
        }
      } catch (error) { /* no locale service: the picker keeps the fallback language */ }

      // Preferences gate the stylesheet and this scheduler both — the footer
      // takeover adds or removes the account row, and the composer scope flips
      // an attribute the stylesheet reads — so a change re-runs the pass. The
      // first read also arrives through here, which is what replaces the
      // defaults with the stored values.
      var prefsUnsubscribe = null
      prefsUnsubscribe = subscribePrefs(function () {
        if (ui.model) ui.model.invalidateCopy()
        // The account-hold page is assembled once per open, so a language change
        // has to rebuild an open one (a no-op while it is closed).
        if (ui.ban) ui.ban.refresh()
        schedule()
      })
      loadPrefs()

      var modelCopyUnsubscribe = null
      modelCopyUnsubscribe = onModelCopyLoaded(function () {
        if (ui.model) ui.model.invalidateCopy()
        schedule()
      })

      var usernameUnsubscribe = null
      usernameUnsubscribe = onUsernameLoaded(function () {
        schedule()
      })

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
          if (ui.copy) ui.copy.sync()
          if (ui.permissions) ui.permissions.sync()
          if (ui.model) ui.model.sync()
          if (ui.footer) ui.footer.sync()
          if (ui.settings) ui.settings.sync()
          // Covers the rail toggle (and any reflow) while the popover is open:
          // its anchor moved without a window resize or a page scroll.
          if (ui.footer && ui.footer.isOpen()) ui.footer.reposition()
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
      ui.schedule = schedule

      var observer = new MutationObserver(schedule)
      observer.observe(document.body, {
        childList: true,
        characterData: true,
        subtree: true,
        attributes: true,
        // The shipped trigger carries the current preset in its aria-label;
        // the conversation tabs carry the active view in aria-selected.
        attributeFilter: ['aria-label', 'aria-selected'],
      })
      schedule()

      // The hero greeting follows the clock: re-apply it every minute so the
      // line rolls over on the hour while the app stays open. rewriteHeadline
      // skips identical text, so this cannot feed the observer.
      var greetingTimer = setInterval(function () {
        if (ui.copy) ui.copy.syncGreeting()
      }, 60000)

      return function () {
        clearInterval(greetingTimer)
        greetingTimer = null
        window.removeEventListener('resize', onFixedPopoverViewportChange)
        window.removeEventListener('scroll', onFixedPopoverViewportChange, true)
        if (localeUnsubscribe !== null) {
          try { localeUnsubscribe() } catch (error) { /* already disposed */ }
          localeUnsubscribe = null
        }
        if (prefsUnsubscribe !== null) {
          try { prefsUnsubscribe() } catch (error) { /* already disposed */ }
          prefsUnsubscribe = null
        }
        if (modelCopyUnsubscribe !== null) {
          try { modelCopyUnsubscribe() } catch (error) { /* already disposed */ }
          modelCopyUnsubscribe = null
        }
        if (usernameUnsubscribe !== null) {
          try { usernameUnsubscribe() } catch (error) { /* already disposed */ }
          usernameUnsubscribe = null
        }
        observer.disconnect()
        if (composerCardObserver) {
          composerCardObserver.disconnect()
          composerCardObserver = null
          observedCard = null
        }
        document.removeEventListener('pointerdown', onGlobalPointerDown)
        document.removeEventListener('pointerdown', onCardPointerDown)
        document.removeEventListener('keydown', onGlobalKeyDown, true)
        document.removeEventListener('input', onComposerInput, true)
        document.removeEventListener('compositionend', onComposerInput, true)
        // Safety-net DOM sweep. Feature teardowns run after this and tolerate
        // nodes already being detached.
        var leftoverItems = document.querySelectorAll('.dsh-claude-popover-item, .dsh-claude-popover-embed, .dsh-claude-account-popover, .dsh-claude-account-btn, .dsh-claude-perm-container, .dsh-claude-perm-popover, .dsh-claude-segments[data-composer-segments], .dsh-claude-model-btn, .dsh-claude-model-popover, .dsh-claude-ban, [data-dsh-synthetic-placeholder]')
        for (var li = 0; li < leftoverItems.length; li++) {
          if (leftoverItems[li].parentElement) {
            leftoverItems[li].parentElement.removeChild(leftoverItems[li])
          }
        }
        // Un-hide host footer controls the popover redirection had hidden.
        var footerMarked = document.querySelectorAll('[data-dsh-claude-footer-entry], [data-dsh-claude-footer-hidden], [data-dsh-claude-footer-overlay]')
        for (var fm = 0; fm < footerMarked.length; fm++) {
          footerMarked[fm].removeAttribute('data-dsh-claude-footer-entry')
          footerMarked[fm].removeAttribute('data-dsh-claude-footer-hidden')
          footerMarked[fm].removeAttribute('data-dsh-claude-footer-overlay')
        }
      }
    }

    // ============================================================================
    // 设置页 (Settings Section)
    // ============================================================================
    /**
     * The settings page section, mounted by the host into the `settings.section`
     * slot. That slot hands a section only `{ close }` plus the standard hooks,
     * so this component owns no store of its own: it reads and writes the skin
     * preferences through src/context/prefs.js, which owns the host round trip, and
     * follows changes the same way the rest of the skin does.
     *
     * Copy comes from the model copy document's `settings` block, so the page
     * follows the shell language like every other string the skin paints. The
     * English literals here are the fallback for a failed fetch.
     *
     * Both segmented controls reuse the shared `.dsh-claude-segments` /
     * `.dsh-claude-segment` classes — the same control the composer's permission
     * picker uses — so the two read as one design instead of two lookalikes.
     */
    function ClaudeStyleSettingsSection() {
      var state = React.useState(readPrefs())
      var prefs = state[0]
      var setPrefs = state[1]
      var errorState = React.useState(null)
      var error = errorState[0]
      var setError = errorState[1]
      var usernameState = React.useState(prefs.username)
      var username = usernameState[0]
      var setUsername = usernameState[1]
      var usernameTimer = React.useRef(null)

      // The skin's own apply-side writes land here too (a reload, a conflict
      // re-read), so the page never drifts from what the document says.
      React.useEffect(function () {
        syncSettingsNav()
        var alive = true
        var unsubscribe = subscribePrefs(function (next) {
          if (alive) {
            setPrefs(next)
            setUsername(next.username)
          }
        })
        var unsubscribeCopy = onModelCopyLoaded(function () {
          if (alive) setPrefs(function (p) { return Object.assign({}, p) })
        })
        return function () {
          alive = false
          unsubscribe()
          if (unsubscribeCopy) unsubscribeCopy()
          if (usernameTimer.current) clearTimeout(usernameTimer.current)
        }
      }, [])

      /**
       * Apply one change. The control flips immediately and the host write
       * follows; a refusal re-reads the authoritative value and says so.
       */
      var write = function (patch) {
        setError(null)
        setPrefs(Object.assign({}, prefs, patch))
        savePrefs(patch).then(function (result) {
          if (result === null) setError(settingsCopy('unavailable', 'The settings store is unavailable, so changes will not be saved.'))
        })
      }

      var saveUsernameNow = function (value) {
        var next = value.trim().slice(0, USERNAME_MAX)
        if (next === readPrefs().username) return
        setError(null)
        setPrefs(Object.assign({}, readPrefs(), { username: next }))
        savePrefs({ username: next }).then(function (result) {
          if (result === null) setError(settingsCopy('unavailable', 'The settings store is unavailable, so changes will not be saved.'))
        })
      }

      var queueUsernameSave = function (value) {
        if (usernameTimer.current) clearTimeout(usernameTimer.current)
        usernameTimer.current = setTimeout(function () {
          usernameTimer.current = null
          saveUsernameNow(value)
        }, 600)
      }

      var commitUsername = function () {
        if (usernameTimer.current) {
          clearTimeout(usernameTimer.current)
          usernameTimer.current = null
        }
        saveUsernameNow(username)
      }

      var segment = function (options, active, onPick) {
        var buttons = []
        for (var i = 0; i < options.length; i++) {
          buttons.push(React.createElement(
            'button',
            {
              key: options[i].value,
              type: 'button',
              className: SEGMENT_CLASS,
              'data-active': options[i].value === active ? '' : undefined,
              'aria-pressed': options[i].value === active ? 'true' : 'false',
              onClick: (function (value) {
                return function () {
                  if (value !== active) onPick(value)
                }
              })(options[i].value),
            },
            options[i].label,
          ))
        }
        return React.createElement('div', { className: SEGMENTS_CLASS, role: 'group' }, buttons)
      }

      var toggle = function (on, onPick) {
        return React.createElement(
          'button',
          {
            type: 'button',
            className: 'dsh-claude-settings-switch',
            role: 'switch',
            'aria-checked': on ? 'true' : 'false',
            'data-on': on ? '' : undefined,
            onClick: function () { onPick(!on) },
          },
          React.createElement('span', { className: 'dsh-claude-settings-switch-knob' }),
        )
      }

      var row = function (key, title, description, control) {
        return React.createElement(
          'div',
          { className: 'dsh-claude-settings-row', key: key },
          React.createElement(
            'div',
            { className: 'dsh-claude-settings-row-text' },
            React.createElement('div', { className: 'dsh-claude-settings-row-title' }, title),
            React.createElement('div', { className: 'dsh-claude-settings-row-desc' }, description),
          ),
          control,
        )
      }

      var brandOptions = [
        { value: BRAND_OFF, label: settingsCopy('brandOff', 'Off') },
        { value: BRAND_CLAUDE, label: settingsCopy('brandClaude', 'Claude') },
        { value: BRAND_ANTHROPIC, label: settingsCopy('brandAnthropic', 'Anthropic') },
      ]
      var scopeOptions = [
        { value: 'off', label: settingsCopy('scopeOff', 'Off') },
        { value: 'hero', label: settingsCopy('scopeHero', 'Home only') },
        { value: 'conversation', label: settingsCopy('scopeConversation', 'Conversation only') },
        { value: 'all', label: settingsCopy('scopeAll', 'All') },
      ]
      var banLocaleOptions = [
        { value: BAN_LOCALE_ZH, label: settingsCopy('banLocaleZh', '中文') },
        { value: BAN_LOCALE_EN, label: settingsCopy('banLocaleEn', 'English') },
      ]

      var rows = [
        row(
          'username',
          settingsCopy('usernameTitle', 'Username'),
          settingsCopy('usernameDesc', 'Shown in the new-conversation greeting. Leave empty to use the name resolved from the host user.'),
          React.createElement('input', {
            type: 'text',
            className: 'dsh-claude-settings-input',
            value: username,
            maxLength: USERNAME_MAX,
            placeholder: settingsCopy('usernamePlaceholder', 'Auto-detect from host user'),
            spellCheck: false,
            autoComplete: 'off',
            onChange: function (e) {
              setUsername(e.target.value)
              queueUsernameSave(e.target.value)
            },
            onBlur: commitUsername,
            onKeyDown: function (e) {
              if (e.key === 'Enter') {
                e.preventDefault()
                commitUsername()
                if (e.currentTarget && e.currentTarget.blur) e.currentTarget.blur()
              } else if (e.key === 'Escape') {
                setUsername(prefs.username)
                if (e.currentTarget && e.currentTarget.blur) e.currentTarget.blur()
              }
            },
          }),
        ),
        row(
          'brand',
          settingsCopy('brandTitle', 'Brand mark'),
          settingsCopy('brandDesc', 'Which brand mark the sidebar shows. "Off" leaves the host\'s own brand area untouched.'),
          segment(brandOptions, prefs.brand, function (value) { write({ brand: value }) }),
        ),
        row(
          'collapseFooter',
          settingsCopy('collapseTitle', 'Collapse the sidebar settings area'),
          settingsCopy('collapseDesc', 'Fold the sidebar footer\'s settings entry into the account popover. Off hands the footer back to the host entirely.'),
          toggle(prefs.collapseFooter, function (value) { write({ collapseFooter: value }) }),
        ),
        row(
          'autoPopover',
          settingsCopy('autoPopoverTitle', 'Open popovers on hover'),
          settingsCopy('autoPopoverDesc', 'Hover opens the account, model, and permission popovers. Off switches them to click-to-open.'),
          toggle(prefs.autoPopover, function (value) { write({ autoPopover: value }) }),
        ),
        row(
          'composerScope',
          settingsCopy('composerTitle', 'Composer restyle'),
          settingsCopy('composerDesc', 'Which input area the skin restyles: the new-conversation page, the conversation, or both.'),
          segment(scopeOptions, prefs.composerScope, function (value) { write({ composerScope: value }) }),
        ),
        row(
          'banLocale',
          settingsCopy('banLocaleTitle', 'Account-hold easter egg language'),
          settingsCopy('banLocaleDesc', 'The language the account-hold page (click the account row in the sidebar footer popover) is written in. It is its own choice, so the page reads the way Claude wrote it whatever the interface language is.'),
          segment(banLocaleOptions, prefs.banLocale, function (value) { write({ banLocale: value }) }),
        ),
      ]

      if (error !== null) {
        rows.push(React.createElement('div', { className: 'dsh-claude-settings-error', key: 'error' }, error))
      }

      return React.createElement(
        'div',
        { className: 'dsh-claude-settings' },
        React.createElement('div', { className: 'dsh-claude-settings-title' }, settingsCopy('title', 'Claude Style')),
        rows,
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
    /**
     * Stamped onto the Claude Style nav button in the settings dialog so CSS
     * can replace the host's default settings gear with the black Claude mark.
     */
    function syncSettingsNav() {
      var navList = document.querySelector(':is([class*="settingsArea"], [class*="_overlay"], [class*="SettingsRoot"]) [class*="_navList"]')
      if (!navList) return
      var buttons = navList.querySelectorAll('button')
      var targetTitle = (typeof settingsCopy === 'function' ? settingsCopy('title', 'Claude Style') : 'Claude Style') || 'Claude Style'
      for (var i = 0; i < buttons.length; i++) {
        var btn = buttons[i]
        var label = btn.querySelector('[class*="_navLabel"]') || btn
        var text = (label.textContent || '').trim()
        if (text === 'Claude Style' || text === targetTitle) {
          if (btn.getAttribute('data-dsh-section') !== 'claude-style') {
            btn.setAttribute('data-dsh-section', 'claude-style')
          }
          return
        }
      }
    }

    function installSettingsSection(ctx, ui) {
      loadModelCopy()
      if (ui) {
        ui.settings = {
          sync: syncSettingsNav,
        }
      }
      if (typeof ctx.inject !== 'function') return function () {}
      var fiber = ctx.inject(['slots'], function (scope) {
        var slots = scope.get('slots')
        if (slots === void 0 || slots === null || typeof slots.inject !== 'function') return
        scope.effect(function () {
          return slots.inject('settings.section', function () {
            return slots.register(
              {
                name: 'settings.section',
                id: 'claude-style',
                order: 22,
                // A function, so the navigation entry localizes once the copy
                // document has arrived; the literal is the pre-fetch fallback.
                label: function () { return settingsCopy('title', 'Claude Style') },
              },
              ClaudeStyleSettingsSection,
            )
          })
        }, 'dsh-claude-style: settings section')
      })
      return function () {
        if (ui && ui.settings) {
          delete ui.settings
        }
        try {
          if (fiber && typeof fiber.dispose === 'function') fiber.dispose()
        } catch (error) {
          /* the fiber may already be gone during teardown */
        }
      }
    }

    // ============================================================================
    // 插件入口与导出 (Plugin Entry & Export)
    // ============================================================================
    function apply(ctx) {
      var body = document.body
      body.setAttribute('data-dsh-claude-style', '')
      setHostContext(ctx)
      loadModelCopy()
      loadUsername()
      // Preferences are read asynchronously from the host settings namespace;
      // applying the defaults first keeps every gated rule in a defined state
      // for the frames before that read settles, and is exactly the shipped
      // behaviour when it never does.
      adoptPrefs(prefs)

      var old = document.getElementById(STYLE_ID)
      if (old && old.parentElement) old.parentElement.removeChild(old)

      var style = document.createElement('style')
      style.id = STYLE_ID
      style.dataset.skinChrome = 'dsh-claude-style-style'
      style.textContent = CSS
      document.head.appendChild(style)

      var ui = {}
      var teardowns = []
      teardowns.push(installSelectionFocus())
      teardowns.push(installCopy(ctx, ui))
      teardowns.push(installPermissions(ctx, ui))
      teardowns.push(installModelPicker(ctx, ui))
      teardowns.push(installAccountFooter(ctx, ui))
      teardowns.push(installBanScreen(ctx, ui)) // 账户横条的封号彩蛋（账户弹层把点击交给 ui.ban）
      teardowns.push(installThemeFlip()) // 主题翻转瞬间抑制过渡，修掉「先色后样」
      var stopSettings = installSettingsSection(ctx, ui)
      teardowns.push(installScheduler(ctx, ui)) // 最后装，回调中惰性读 ui 句柄

      ctx.effect(function () {
        return function () {
          for (var i = teardowns.length - 1; i >= 0; i--) {
            try { teardowns[i]() } catch (error) { /* one teardown must not block the rest */ }
          }
          stopSettings()
          setHostContext(null)
          body.removeAttribute('data-dsh-claude-style')
          body.removeAttribute(BRAND_ATTR)
          body.removeAttribute(FOOTER_ATTR)
          body.removeAttribute(COMPOSER_ATTR)
          body.removeAttribute(WINDOW_BLUR_ATTR)
          var el = document.getElementById(STYLE_ID)
          if (el) el.remove()
        }
      }, 'dsh-claude-style: Claude Code desktop theme')
    }

    exports.apply = apply
    return module.exports

  },
})
