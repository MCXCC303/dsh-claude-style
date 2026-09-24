# Refactor plan: splitting the oversized fragments

**Status: adopted, in progress.** Drafted 2026-09-23 against `3900587` on
`fix/review-hardening`; reviewed and corrected against that same tree (every
size, handle shape and host-markup claim re-verified; see the errata in §7,
which are part of the plan). When the phases are done, record the conventions
in §2 and the contract in Phase 2 as **D13** in `docs/architecture.md`, then
delete this file. It sits at the repo root on purpose: `docs/` ships in the
npm package.

Suggested branch: `refactor/split-fragments`, cut from `fix/review-hardening`.

---

## 0. Fixed constraints (read before touching anything)

These stay as they are. The refactor works inside them, not around them.

- **D1: one output file.** The DSH loader loads exactly one `client.js` per
  plugin, and it can't resolve relative `require` or asset URLs.
  `scripts/build.mjs` concatenates `src/` fragments verbatim into a single
  factory scope, so there's no `import`/`export`. The fragments use ES5 style,
  4-space base indent, React only via `require('react')`, and `%%TOKEN%%`
  placeholders that the build replaces. **The refactor happens inside `src/`
  only.**
- **D6: one scheduler.** A single MutationObserver plus one pass per frame
  (rAF-coalesced) drives every feature's `sync()`. No feature may add its own
  observer or global listener.
- **D12: one broken feature switches off only itself.** Each feature's install
  and each `sync()` is wrapped in its own try/catch. A sync that fails 3 passes
  in a row is retired (`ui.retire`).
- **AGENTS.md rules:**
  - no fragment above ~750 lines (JS or CSS);
  - no third copy of the same host selector or DOM query;
  - `lib/` is generated: rebuild it and commit it together with `src/`;
  - one logical change per commit, message style `type(scope): 中文标题` plus a
    wrapped body;
  - CHANGELOG entries only for behavior changes.
- **Invariants the smoke test enforces:**
  - no scheduler pass runs while idle (a pass must never write DOM that
    hasn't changed);
  - teardown leaves no skin node, marker, body attribute or stylesheet;
  - host and user strings are written only with `textContent`.

**Non-goals:**
- a bundler or ES modules (D1 rules them out);
- loading several files at runtime;
- rewriting any feature's logic;
- a layer that wraps all host selectors. Measured below: they're already
  confined to one feature.

## 1. Where the mess actually is

### Sizes (lines)

| File | Lines | Status |
| --- | --- | --- |
| `src/overrides/account-footer.js` | 1357 | over 750, bug fixes only |
| `src/overrides/model-picker.js` | 900 | over |
| `src/overrides/permissions.js` | 868 | over |
| `src/overrides/model-effort.js` | 676 | close to the limit, leave it |
| `src/styles/composer/inline.css` | 847 | over |
| `src/styles/components/model-picker.css` | 767 | over |
| `src/styles/sidebar.css` | 650 | leave it |

### What is fine: the layering

The fragments form a clean, one-directional graph:

1. `constants.js` (58 names)
2. `context/*`: host, prefs, model-copy, i18n
3. helpers: `popover-utils` (`createHoverIntent`, `positionAnchoredPopover`),
   `model-brand`, `model-copy-lookup`, and `createEffortControl` in
   `model-effort`
4. features: each defines exactly one top-level name, `installX(ctx, ui)`
5. `scheduler.js`, `settings.js`, and `entry.js`, which puts everything together

No feature references another feature's top-level names. Keep it that way.

Host selectors are mostly confined to one feature: 42 distinct
`[class*="…"]` fragments with 68 uses in JS, and only `settingsArea`
(settings, account-footer) and `heroWorkspaceRow` (copy, hero-menu) are used
in more than one file.

### What is wrong

1. **Oversized closures.**
   - `account-footer.js` holds five separate jobs in one function:
     1. the account profile and stream;
     2. the bridge to the host's account menu;
     3. copying other plugins' footer entries into the drawer;
     4. the drawer shell;
     5. building the row.
   - `model-picker.js` also holds the model catalog and the row builders.
   - `permissions.js` also holds the whole session-stats card.
2. **The scheduler hard-codes every feature.**
   - `PASS_FEATURES` lists pass order by name, separately from the install
     order in `entry.js`.
   - It makes 21 different feature-specific calls:

     | Trigger | Calls |
     | --- | --- |
     | pointer press outside | `model.owns/close`, `effort.owns/close`, `footer.isOpen/owns/close`, `settingsNav.sync` |
     | Esc | `footer.close`, `permissions.closeMenu`, `model.close`, `effort.close`, `ban.close` |
     | Ctrl+, | `footer.openSettings` |
     | focus moves into the composer | `model.close`, `permissions.closeMenu`, `permissions.closeStats`, `footer.close`, `heroMenu.close`, `quickProviders.close` |
     | viewport scroll/resize | `model.reposition`, `heroMenu.reposition`, `footer.isOpen/reposition` |
     | locale / prefs / model-copy change | `model.invalidateCopy`; prefs change also `ban.refresh` |
     | input / compositionend events | `copy.syncAttachmentPlaceholder` |
     | every pass end | `footer.isOpen() && footer.reposition()` (the rail toggle moves the anchor without a viewport event) |
     | pointer press (any) | `settingsNav.sync` (class changes are outside the observer's attributeFilter, so no pass would fire) |

     (`copy.syncGreeting` is NOT scheduler-driven: it runs on a 60 s
     `setInterval` the scheduler owns. An earlier version of this table
     mis-filed it under "pass end" and missed the two rows above it.)

   - It has already drifted from the features: `ui.heroMenu.close` is called
     (guarded), but the hero menu's handle is `{ sync, reposition }`.
3. **`ui` is an undocumented service registry.** Handle shapes today:
   - `copy {sync, syncGreeting, syncAttachmentPlaceholder, isHeroView, isComposerActive}`
   - `permissions {sync, closeMenu, closeStats}`
   - `model {sync, close, seat, effort, settled, pickEffort, owns, reposition, providers, onProviders, invalidateCopy, teardown}`
   - `effort {sync, close, owns, reposition, teardown}`
   - `heroMenu {sync, reposition}`
   - `quickProviders {toggle, close, isOpen}`
   - `footer {sync, close, openSettings, owns, isOpen, reposition}`
   - `ban {open, close, isOpen, refresh}`
   - `workspace {sync}`, `viewTabs {sync}`, `settingsNav {sync}`
   - `schedule()`, `retire(name)`

   Cross-feature reads outside the scheduler:
   - effort → `model.{effort, pickEffort, seat, settled, close}`
   - model → `effort.close`, `copy.isComposerActive`
   - hero-menu and permissions → `copy.*`
   - quick-providers → `model.{providers, onProviders}`
   - footer → `ban.open`
4. **CSS in the wrong file.**
   - The shared menu-row styles (`.dsh-claude-popover-item`, "Popover Body &
     Items") live in `model-picker.css`. The account drawer, permissions and
     quick-providers all depend on them without saying so.
   - The effort picker's card, slider and trigger styles (about 400 lines)
     live there too.
5. **Leftovers:**
   - a stale `TEMP(exclusion)` comment above `effort-picker.js` in
     `build.mjs` (the file has been back in the build since `c0a7b3d`);
   - `accountMenuKey` reads the profile's variables straight out of the shared
     closure. The split turns that into an explicit `key` option.

## 2. Conventions for the split (the proposed D13)

- **Helper fragments export top-level `createX(...)` factories**, following
  `createHoverIntent` and `createEffortControl`:
  - A factory keeps its state in its own closure and returns a small object.
  - The feature's `installX` connects the factories.
  - A factory never reaches into another closure. It takes accessors and
    callbacks as parameters, such as `{ isOpen: fn, onChange: fn }`.
- **One subdirectory per split feature:** `src/overrides/account/*.js`,
  `src/overrides/model/*.js`. A feature that sheds exactly one helper
  fragment keeps it beside itself instead (`overrides/session-stats.js` for
  `permissions.js`) — a one-file folder is noise.
  - List them in `FRAGMENTS` right before the feature's own fragment.
  - The build already accepts paths like `context/host.js`.
  - Function declarations hoist within the factory, so their order is free.
    Top-level `var` initializers run in order, though (`prefs` reads the
    constants, for example), so keep fragments in dependency order.
- **Every top-level name is global to the bundle.** Name new ones after their
  feature (`createAccountProfile`, not `createProfile`), and check that no
  existing name collides.
- **Moves are moves.** Keep the "why" comments, style and names. Change a
  signature only where a closure variable has to become a parameter.
- **Splitting a stylesheet:** insert the new file in `STYLE_FILES` at the
  position of the section it came from, so the built CSS keeps its rule order.
  Composer files keep `gate: true`.

## 3. Phases

Each phase is its own series of commits and changes no behavior. Every commit
must pass `npm run build` and `npm run smoke`, and ship its rebuilt `lib/`
(check with a throwaway worktree: rebuild, then `git diff --exit-code lib/`).

### Phase 0: safety net (do this first)

Add a **`desktop`** case to `scripts/smoke.cjs`. The current stand-in page has
the web-style footer (a dialog settings button directly under `settingsArea`),
so none of the desktop account code is tested. The new page mirrors the real
0.1.7 desktop footer:

```html
<div class="_x_footArea_1">
  <div class="_x_footerActions_1"><div data-slot="sidebar.footer.action"></div></div>
  <div class="_x_settingsArea_1"><div data-slot="sidebar.settings">
    <div class="_s_triggerRow_1">
      <div data-slot="settings.launcher"><div class="_a_root_1"><span>
        <button aria-label="Account menu" aria-haspopup="menu" aria-expanded="false">…label…</button>
      </span></div></div>
      <button aria-label="Retry update">Retry update</button>
    </div>
  </div></div>
</div>
```

**Stand-in behavior:**
- Clicking the account button opens a `role="menu"` portal with the items
  Settings / Feedback / Sign out, and picking an item closes it, like the
  host's `onSelect`.
- The Sign out item carries the host's real sign-out icon markup: a 16px
  relative `span` holding a 13.664×13.571 `svg` at `position:absolute;
  left:1.168px; top:1.214px`.
- Picking Settings appends a `role="dialog"` inside `settingsArea`.
- The stand-in `ctx` provides:
  - `inject(deps, cb)`, which calls `cb(scope)` with `scope.effect`. This
    exercises the service-wait path, which the existing cases skip because
    their `ctx` has no `inject`.
  - `remote.$stream`, which wraps `remote.account.watch`.
  - `getProfile`, which counts its calls.

**Checks:**
- the host trigger row computes `display: none`;
- the drawer's own Settings row is `hidden`, and the host rows are listed;
- clicking the drawer's Settings opens the dialog, leaves no host menu open,
  and logs no page errors;
- Ctrl+, opens the dialog;
- exactly 1 profile read after the first frame, and still 1 after a repeated
  same-state frame;
- the sign-out icon's box lies inside its `.dsh-claude-popover-item-icon`;
- plus the common checks: idle 0 passes, clean teardown, no pass after
  teardown.

### Phase 1: split `account-footer.js` (1357 → about 540 + 3 new files)

| New fragment | Moves there | Lines (approx.) |
| --- | --- | --- |
| `overrides/account/profile.js` | `accountService`, `showAccount`, `dropAccountRead`, `retryAccount`, `loadAccount`, `onAccountState`, `stopFollowingAccount`, `followAccount`, the `ctx.inject(['remote.account'])` block, `ACCOUNT_RETRY_MS`, the hot-reload mark on `document.body.__dshAccountStream` | 190 |
| `overrides/account/host-menu.js` | `ACCOUNT_MENU_ATTR`, `DRIVING_ATTR`, `realClick`, `hostAccountTrigger`, `hostMenus`, `hostSettingsTrigger`, `accountMenuKey`, `withHostAccountMenu`, `SETTINGS_LABEL`, `openHostSettings`, `refreshAccountItems` (the reading half), `syncAccountMenuItems` (the re-read throttle), `ACCOUNT_REREAD_MS`, and the item state (`accountItems`, `accountReading`, `accountSignature`, `accountReadAt`, `accountMenuError`) | 230 |
| `overrides/account/footer-mirror.js` | `syncFooterActionVisibility`, `footerEntriesOf`, `markFooterHiddenBranches`, `syncMirrorItem`, `removeActionMirror`, `removeEmbedMirror`, `entryIsActionLike`, `textExcludingOverlays`, `syncEmbedMirror`, `INTERACTIVE_SELECTOR`, `resolveEmbedActivator`, `hasOverlayAncestor`, `findFooterTrigger`; the footer-entry loop and the reordering from `syncPopoverItems`; the marker cleanup from `dropAccountFooter` | 450 |
| `overrides/account-footer.js` (stays) | `installAccountFooter`: hover intent, open/close/toggle/position, avatar (`accountPhotoUrl`, `syncAccountAvatar`), the Settings row (label and step-aside), the drawer's account rows and their click handling (`renderAccountItems`, `accountItemsSignature`), a thin `syncPopoverItems`, `dropAccountFooter`, `syncAccountFooter`, the ban-screen row, `ui.footer`, teardown | 540 |

**Interfaces** (names are suggestions):

```js
// profile.js
function createAccountProfile(ctx, onChange) → {
  name(), avatar(), state(),   // accountName / accountAvatar / accountState
  service(),                   // remote.account or null (the sign-in and sign-out rows use it)
  apply(view),                 // onAccountState: the drawer's sign-out result goes here
  stop()                       // dispose the inject fiber + stopFollowingAccount
}
// host-menu.js
function createHostAccountMenu(options) → {
  trigger(), settingsTrigger(), items(),
  sync(),                      // the throttled re-read; calls options.onItems() after a read
  pick(text),                  // drive the menu and click the item labeled `text`
  openSettings()               // settings button, else the menu's 设置 / Settings item
}
// options: { key: () => profile's state|name|avatar, ownSettingsLabel: () => string|null, onItems: () => void }
// footer-mirror.js
function createFooterMirror(options) → { sync(footArea), clear(footArea) }
// options: { body: () => popoverBody, anchor: () => settingsItem, isOpen: () => bool, close: closePopover }
```

**Gotchas that must survive the move:**
- **Install must still throw on a broken API.** With no `ctx.inject`, the
  profile read happens synchronously during install. The smoke `install-fault`
  case depends on a non-promise `getProfile()` throwing all the way out of
  `installAccountFooter`, so that D12 switches the footer off.
- **Redirect always, copy only while closed.** The footer mirror must hide
  other plugins' footer entries in the sidebar on every pass, even while the
  drawer is open. It rebuilds or reorders the drawer copies only while the
  drawer is closed. `openPopover()` runs one sync right before the drawer
  appears.
- **Row order in the drawer:** copies of other plugins' entries go *before*
  the Settings row, and the host's account rows are appended *after* it.
  `renderAccountItems` doesn't rebuild rows while the drawer is open.
- **`ui.footer.openSettings` must close the drawer first**, because
  `openHostSettings` calls `closePopover()` today. Either keep that call in
  `account-footer.js`, or pass `close` in the options.
- **No writes without a change:** every DOM write stays guarded by an
  equality check. The smoke test's 0-passes-at-idle check catches mistakes.

### Phase 2: a feature contract for the scheduler (the real architecture fix)

**One table in `entry.js`** replaces both the install sequence and
`PASS_FEATURES`:

```js
var FEATURES = [ { name: 'selection', install: installSelectionFocus },
                 { name: 'copy', install: function () { return installCopy(ctx, ui) } }, … ]
```

Pass order is install order, filtered to handles that have `sync`. Keep the
current relative order: copy, permissions, model, effort, heroMenu, footer,
workspace, viewTabs, settingsNav.

**Handle hooks, all optional**, documented once as a JSDoc typedef in
`scheduler.js`:

| Hook | Called when | Replaces |
| --- | --- | --- |
| `sync()` | every pass | `PASS_FEATURES` |
| `owns(target)` + `close('outside')` | pointer press not owned by the feature | model, effort and footer branches |
| `onPointerDown(target)` | every pointer press, owned or not | `settingsNav.sync` (its class changes are outside the observer's attributeFilter) |
| `close('escape')` | Esc | 5 hard-coded calls |
| `close('composer')` | focus moves into the composer | 6 calls; the dead `heroMenu.close` goes |
| `onInput(target)` | input / compositionend inside the composer input | `copy.syncAttachmentPlaceholder` |
| `reposition()` | viewport scroll/resize (the feature checks whether it's open) | model, heroMenu, footer |
| `onCopyChange()` | locale / prefs / model-copy change | `model.invalidateCopy`, `ban.refresh` |
| `onKey(event)` → handled? | keydown | footer's Ctrl+, |

`close(reason)` lets each feature keep its exact current behavior. For
example, `permissions` closes its menu on escape and on composer focus, and
additionally closes the stats card on composer focus.

**Coverage notes the first draft missed** (re-verified against
scheduler.js on `3900587`):

- **Pass-end footer reposition is not a viewport trigger.** Today the pass
  ends with `footer.isOpen() && footer.reposition()` (the rail toggle moves
  the anchor without a scroll/resize). Fold it into the footer's own
  `sync()` — open ⇒ reposition — which runs in the same frame at the same
  relative point. No new hook.
- **`onCopyChange` widens `ban.refresh`'s triggers** from "prefs change"
  to all three copy sources. Accepted: a no-op while the overlay is closed,
  and a locale-driven rebuild of an open one is the more correct behaviour.
  Record the delta in the commit message.
- **Ctrl+, keeps its unconditional `preventDefault()`** in the scheduler,
  before the `onKey` dispatch; the hook's return value never gates it.
- **`permissions` must NOT grow `close('outside')`** — today nothing
  closes its menu on an outside press. Same for `quickProviders`: it
  implements `close('composer')` only.
- **Pointer-down order shifts:** `settingsNav.sync` moves from between
  effort and footer to feature order (last). The features touch disjoint
  DOM, so this is invisible; note it in the commit message.

**Write down today's behavior per trigger before migrating** (the corrected
table in §1.2 is the source), then move one trigger per commit.

Cross-feature reads stay as direct handle reads, but get listed in the typedef.
The FEATURES table maps entry names to handle names where they differ
(`settings` installs `ui.settingsNav`).

**Keep D12's retire semantics as they are:**
- A failing sync retires by handle name.
- Retiring `footer` or `permissions` must still force its body flag
  (`FOOTER_ATTR` / `COMPOSER_ATTR`) off.
- Retiring `settingsNav` only stops its sync; it must not unload the settings
  page.

Extend the smoke test to press Esc and click outside while the drawer is open.

### Phase 3: the other oversized files

- **`model-picker.js` (900 → about 580):**
  - `overrides/model/catalog.js`: `currentModelSessionId`,
    `dropModelSubscription`, `modelDirectory`, `modelSnapshot`,
    `modelProviders`, `notifyProviders`, `warmModelCatalog`, `modelCurrent`,
    `modelEffort` (about 150 lines).
  - `overrides/model/rows.js`: `MODEL_CHECK_SVG`, `MODEL_CHEVRON_SVG`,
    `byModelId`, `buildProviderRule`, `buildModelOption`, `buildModelCell`,
    `levelOneSections`, `remainingGroups` (about 170 lines).
  - List each function's free variables before moving it. Whatever it reads
    from the picker's closure becomes a parameter.
- **`permissions.js` (868 → about 580):** `overrides/session-stats.js` gets
  `statsEscape` through `syncStatsSummary`, including
  `sweepStrayStatsPopovers` and `bindStatsHover` (about 290 lines).
  `ui.permissions.closeStats` hands off to it (or, after Phase 2, it implements
  `close('composer')` itself).
- **`model-picker.css` (767):**
  - → `components/popover.css`: "Popover Body & Items" plus "Ensure popover
    items only display inside the popover" (about 85 lines, shared), AND the
    "Popover Header" section (lines ~635-657 — the first draft left it
    unassigned; it styles the shared popover chrome, not the picker).
  - → `components/effort-picker.css`: "The effort card", "Reasoning-effort
    slider" and "reasoning-effort trigger" (about 400 lines).
  - About 260 lines stay.
  - Insert the files in section order, or show that the one reordered section
    (the effort trigger, which today comes after the popover rows) shares no
    selectors with them. Check by comparing the built CSS string before and
    after with whitespace and comments stripped.
- **`composer/inline.css` (847):** "Model trigger in trailing", "combined
  composer stats" and "one type for the composer's bottom line" move to
  `composer/inline-bar.css` (about 345 lines, `gate: true`), placed right after
  `inline.css`. Build detail: `gateComposerScope` hard-codes
  `composer/inline.css` as the one synthetic (un-emitted) marker, so
  `inline-bar.css` must carry its own real `/* @composer-gate */` line
  above the moved sections — it lands in the bundle as a comment, which is
  fine — and only rules below it are gated.

### Phase 4: docs and cleanup (alongside each phase)

- `docs/architecture.md`: **D13**, covering the `createX()` convention, the
  one-folder-per-feature layout and the feature contract, with the reasons.
  Nothing earlier needs to be overturned: this stays within D1, D6 and D12.
- `docs/STYLE.md`: the source-layout table. `AGENTS.md`: the 仓库布局 line
  listing `overrides/*.js`.
- `scripts/build.mjs`: new `FRAGMENTS` / `STYLE_FILES` entries, and remove the
  stale `TEMP(exclusion)` comment.
- Delete this file.

## 4. Checks for every commit

1. `npm run build`. It checks syntax, `%%TOKEN%%` leftovers and the composer
   CSS gate.
2. `npm run smoke`. The Phase 0 `desktop` case must pass from Phase 1 onward.
3. **For pure moves:** the same set of top-level names before and after,
   except the new `createX` ones — compare `grep` output for the fragments'
   top-level declarations, not the built bundle (its byte stream shifts when a
   fragment boundary moves). For CSS: the same rule sequence.
4. **Live desktop check (manual):**
   - Row and drawer header show the account name and avatar.
   - The drawer lists Settings / Feedback / Sign out, and the sign-out icon
     sits inside its row.
   - Settings opens from the drawer, and Ctrl+, opens Settings.
   - Nothing from the host's own footer row shows.
   - Esc closes everything.
5. Commit `src/` together with the rebuilt `lib/`.

## 5. Notes from this session (local environment)

- **Host source:** `D:\Build\deepseek-harness` (0.1.7-rc.1). Useful files:
  - `packages/client/ui-settings-account/src/client/{AccountMenu,LogoutIcon}.tsx`
  - `packages/client/ui-primitives/src/Menu.tsx`
  - `packages/client/ui-settings-general/src/client/SettingsRoot.tsx`
  - `packages/api/gateway/src/client/remote-stream.ts`
  - `packages/credentials/deepseek-account-platform/src/index.ts`
- **The desktop profile `~/.dsh/profiles/desktop` links this repo.** The
  running desktop app hot-reloads `lib/client.js` after `npm run build`, with
  no manual reload.
- **Driving the desktop app:**
  - The renderer's own DevTools port (9222) is taken by another process. Go
    through the Electron main-process inspector at `127.0.0.1:9229` instead.
  - In that process, evaluate
    `process.getBuiltinModule('module').createRequire(process.execPath)('electron').webContents`.
    Find the `dsh-app://app/` contents and call `debugger.attach('1.3')`.
    Then `sendCommand('Input.dispatchMouseEvent' | 'Input.dispatchKeyEvent' |
    'Page.captureScreenshot' | 'Runtime.evaluate', …)`.
  - Always `detach()` when done.
  - To read a feature's private state: `DOMDebugger.getEventListeners` on one
    of its nodes, then `Runtime.getProperties` on the handler's `[[Scopes]]`.
- **The user may be using the app at the same time.**
  - Before driving it, check that no dialog is open and the composer is empty.
  - Never click Sign in or Sign out.
  - Close what you open (Esc).
- **Still open, not part of this plan:** the drawer's Feedback row matches
  `/反馈|contact|意见/`. That misses the English label "Feedback", so in
  English it falls back to the host's own item, while in Chinese it opens the
  skin's hard-coded form URL. This is inconsistent but not broken.

## 6. Open questions — decided at adoption

1. **Scope:** all of it now, in order: Phase 0 → 1 → 2 → 3, with Phase 4's
   docs landing alongside each phase (D13 itself lands with Phase 2, the
   contract it documents).
2. **CHANGELOG:** no entries — AGENTS.md logs behaviour changes only, and no
   phase changes behaviour (the two accepted deltas are commit-message
   material: `ban.refresh`'s wider triggers, settingsNav's pointer-down
   order). One exception: Phase 0 extends the smoke test, whose existing
   [Unreleased] entry enumerates its cases — amend THAT bullet in place
   instead of adding a new one.
3. **Branch:** `refactor/split-fragments`, cut from `fix/review-hardening`
   (the plan's own suggestion; the fix branch stays untouched for review).

## 7. Review amendments (folded into the text above)

Corrections from the adoption review; each is already edited into its
section, this list is the audit trail.

- §1.2: `copy.syncGreeting` is a 60 s interval, not a pass-end call; the
  table had missed the pass-end `footer.reposition()` and the pointer-down
  `settingsNav.sync()` rows. Both are Phase 2 coverage gaps — fixed in the
  hook table (`onPointerDown`, `onInput`; pass-end reposition folds into
  the footer's `sync()`).
- Phase 2: `onCopyChange` widens `ban.refresh` to three trigger sources
  (accepted delta); Ctrl+, keeps its unconditional `preventDefault()`;
  `permissions` must not grow `close('outside')`; FEATURES maps
  `settings` → `ui.settingsNav`.
- §2: the one-subdirectory rule is scoped to features with several
  fragments — `session-stats.js` stays beside `permissions.js`.
- Phase 3: the "Popover Header" section of `model-picker.css` (~23 lines)
  was unassigned — it moves to `components/popover.css`. `inline-bar.css`
  needs its own real `@composer-gate` marker (only `composer/inline.css`
  gets the build's synthetic-marker treatment).
- §4: the "same top-level names" check compares grep output, not the bundle.
- §4.4's live desktop check stays MANUAL (the user may be using the app);
  the subagents verify with `npm run build` + `npm run smoke` only.
