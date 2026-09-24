    var STYLE_ID = 'dsh-claude-style-style'

    /**
     * Settings identity, for both host generations.
     *
     * 0.1.5-rc.2 and earlier let a plugin own a namespace by name
     * (`claude-style`, registered host-side). 0.1.7 dropped that registry: a
     * settings namespace IS a profile entry id and its schema IS the entry's
     * Config, so the id below is what both halves address — read off the
     * running loader entry where possible, with the id `cordis.patch.yml`
     * inserts as the fallback.
     *
     * PACKAGE_NAME is the other half of the 0.1.7 contract: a bundle's own
     * configuration is a `plugins.bundle.config` entry keyed by the bundle's
     * package name, which is what makes it render on this plugin's page.
     */
    var SETTINGS_ENTRY_FALLBACK = 'ui-skin-claude-style'
    var PACKAGE_NAME = 'dsh-claude-style'
    var BUNDLE_CONFIG_SLOT = 'plugins.bundle.config'
    var SETTINGS_SECTION_SLOT = 'settings.section'

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
    /** The effort slider's two ends. Kept in English in every locale: they name
     *  the axis, not a level, and the level's own name rides beside the label. */
    var MODEL_EFFORT_FASTER = 'Faster'
    var MODEL_EFFORT_SMARTER = 'Smarter'
    /** What the slider reads when the model offers no levels at all. */
    var MODEL_EFFORT_NONE = '—'
    var MODEL_MORE_LABEL = 'More models'
    var MODEL_TRIGGER_LABEL = 'Select model, currently {model}'

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
     * Stamped on the host's own account menu card while it is open (Desktop
     * 0.1.7+). That card is the host's shared Menu portal and its class names
     * are hashed, so src/overrides/account/surface.js stamps this attribute and
     * components/account-footer.css repaints the card, its rows and its
     * separators with the skin's popover language.
     */
    var ACCOUNT_MENU_ATTR = 'data-dsh-claude-account-menu'
    /**
     * Stamped on the host's shared menu card while it is the hero row's picker
     * (the workspace chip or the agent-preset seat opened it). The host portals
     * that card to <body> with no marker of its own, so the stylesheet cannot
     * tell it from the host's other menus; src/overrides/hero-menu.js stamps it
     * and components/hero-menu.css switches on this attribute.
     */
    var HERO_MENU_ATTR = 'data-dsh-claude-hero-menu'
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
    /**
     * How eagerly the skin's popovers open on hover: `off` is click-only,
     * `account` auto-opens the sidebar account popover alone, and `all` adds the
     * permission, model, session-stats and the host's two hero-row pickers.
     */
    var AUTO_POPOVER_OFF = 'off'
    var AUTO_POPOVER_ACCOUNT = 'account'
    var AUTO_POPOVER_ALL = 'all'
    var AUTO_POPOVER_SCOPES = [AUTO_POPOVER_OFF, AUTO_POPOVER_ACCOUNT, AUTO_POPOVER_ALL]
    var DEFAULT_AUTO_POPOVER = AUTO_POPOVER_ALL
    /** Route the browser half reads and writes preferences through (lib/index.js). */
    var PREFS_ROUTE = '/dsh-claude-style/prefs'
    /** Route that resolves the host OS user once; never polled. */
    var USERNAME_ROUTE = '/dsh-claude-style/username'
    /** Longest accepted custom username; mirrored by lib/index.js. */
    var USERNAME_MAX = 64
    /** Most quick-provider ids kept, and the longest id accepted; mirrored by lib/index.js. */
    var QUICK_PROVIDERS_MAX = 64
    var PROVIDER_ID_MAX = 128

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
