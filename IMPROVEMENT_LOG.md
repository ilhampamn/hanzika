# Hanzika — UI Improvement Log

A running record of the UI/UX improvements made in this iteration, written so another tool (or model) can understand **what changed, why, and how**, and — most importantly — **follow the same conventions** going forward.

> **Canonical folder:** `Side project - Hanzika v2/` is the up-to-date copy. See **Sync status** at the bottom before editing the original folder.

---

## 0. Design principles established (READ FIRST — follow these)

These are the rules we converged on. Apply them to any new UI work.

1. **Two design "languages," never mixed:**
   - **Selection / active / "you are here" state → always ONE color: pink** (`--pink` / `--pink-dk` / `--pink-bg`). Nav items, tabs, chips, mode-tabs, selected options, primary CTAs. A user should learn "pink = the thing I picked / the main action" once and have it hold everywhere.
   - **Color variety (blue / green / orange / purple / yellow) is reserved for DATA** — category, progression, and status — never for selection. Example: a chapter label is gray→blue→green by *how far the learner has progressed*, not by whether it's selected.
   - We explicitly tried per-section nav colors (Vocab=blue, Study=orange, HSK=purple) and **reverted it** — it diluted the "pink = selected" signal and caused WCAG contrast misses. Don't reintroduce it.

2. **Accessibility / color:**
   - Never rely on color alone — pair it with text/icon/shape (badges keep their label, nav keeps its icon, etc.).
   - `--blue-dk` (#1899D6) and `--orange-dk` (#E2600A) are **below WCAG AA (4.5:1) for small text** on white. They're used in a few small-text spots inherited from the original app. If you author *new* small-text uses, prefer darker shades or larger/bolder text. (Known, pre-existing across the codebase — flagged, not yet globally fixed.)

3. **Shape language:** soft and "bubbly" — floating rounded cards with their own shadow, sitting on a `#FAFAFA` canvas. Pills (`border-radius:999px`) for buttons, circles for icon toggles. Corner radius is tokenized as `--bubble-radius` (22px).

4. **Authenticity over cleverness:** match how the domain really works (e.g. one 田字格 grid box per character, like a real Chinese practice sheet) rather than forcing content into a shape it doesn't fit.

5. **Feedback integrity:** a "revealed / gave-up" state must never look like a genuine "correct" state (see Question Lab #1).

---

## 1. Color palette tokens (`:root`)

**File:** `hanzika_18_hover_dictionary_stable.html` and `hanzika_question_type_playground.html`

Added the missing dark/bg variants so orange and purple match the existing green/blue/red/yellow/pink trios:

```css
--orange-dk: #E2600A;  --orange-bg: #FFEAD1;
--purple-dk: #8E3FE0;  --purple-bg: #F2E6FF;
```

These feed the data-color usages below.

---

## 2. Main app — shell & navigation

**File:** `hanzika_18_hover_dictionary_stable.html`
All CSS lives in clearly-marked appended blocks at the end of `<style>`; search for the banner comments.

### 2a. `SHELL REFRESH v2` block (sidebar + mobile tabbar polish)
- Sidebar: a **"MENU" caption** (`.sidebar-nav-label`), livelier nav links (hover nudge `translateX`, a pink **left accent bar** that grows in on the active item), utility toggles (sound + dictionary) restyled as a **matched rounded pair**, and a subtle hover lift on the user card.
- Mobile bottom tabbar: an **active-indicator bar** on the selected tab, icon lift/scale, top shadow for separation.

### 2b. `TOP-NAV + 3-COLUMN SHELL` block (the big restructure)
Reworked the whole app frame to: **top bar** over **three columns (left Nav · center Main · right AI)**.
- Added a persistent **`.top-nav`**: brand (moved out of the sidebar) on the left; on the right an **AI toggle** (`#assistantTopBtn`, "聊 Guide" with a live status dot + pressed state), the **sound/dict** toggles, and a **Profile** pill (`#profileTopBtn`, avatar + first name → jumps to Profile view).
- Wrapped sidebar/main/AI in **`.shell-body`** (the columns row). Markup: `#appShell` now contains `<header class="top-nav">` + `<div class="shell-body">…</div>`.
- The **AI assistant panel was already a docked flex column** in the markup — we replaced the old floating bubble (`.assistant-bubble{ display:none }`) with the top-nav toggle. When open → 3 columns; when closed → Main expands.
- Canvas background set to `#FAFAFA`; cards stay `#FFFFFF`.

**JS wiring** (in the assistant IIFE `initAssistantChat` + `renderUserChrome`):
- `topToggle` (`#assistantTopBtn`) toggles `openPanel`/`closePanel`; `openPanel`/`closePanel` add/remove `.is-pressed` and set `aria-pressed`; `setStatus` mirrors `is-ready`/`is-error` onto it.
- `renderUserChrome` mirrors the user initial/name into `#topProfileAvatar`/`#topProfileName`; `#profileTopBtn` → `goToView('profile')`.

### 2c. Bubbly floating cards (inside the same block, `@media (min-width:781px)`)
- Tokens: `--topnav-h:64px`, `--shell-gap:14px`, `--shell-pad:16px`, `--bubble-radius:22px`.
- Desktop: `.app-shell` becomes a padded flex frame; `.top-nav`, `.sidebar`, and `.assistant-panel` are **floating rounded cards** with their own borders/shadows, each **scrolling independently** (`.main` scrolls on its own; no page-level scroll).
- Buttons: icon toggles → circles; AI/Profile → pills.
- **Mobile is intentionally excluded** from the floating treatment (`@media (max-width:780px)` keeps a sticky flush top bar, bottom tabbar, and a full-screen AI sheet). One bug fixed here: `container-type:inline-size` on the panel collapsed its height when `height:auto`, so the mobile sheet uses an explicit `height:calc(100dvh - var(--topnav-h))`.

---

## 3. Main app — data-driven color (NOT selection)

**File:** `hanzika_18_hover_dictionary_stable.html`

- **Profile stat tiles** (`renderProfile`): each tile gets a `stat-tile--{blue|green|orange|pink}` class → colored top edge + tinted number. (Total words=blue, Mastered=green, Sessions=orange, Added-by-you=pink.)
- **Source pills** ("From HSK"=purple, "Added by you"=pink) via `source-pill--purple/--pink`.
- **Vocab badges:** `badge-hsk` → purple, `badge-custom` → pink. **Removed** a leftover rule (`/* Neutral by default… */`) that was flattening both badges to gray — this was the main cause of the "too monotone" complaint.
- **Vocab strength dots** (`renderVocabList`): the 5 dots are colored by the word's **maturity stage** (`statusOf(box)` → gray/yellow/blue/green) via a `--dot-color` inline var + `.strength i.on{ background:var(--dot-color) }`, instead of a flat green.
- **HSK level pill** (`.hsk-level-pill`) and chapter-card hover → purple (HSK's identity color).
- **HSK chapter labels** (`renderHskHome`): each chapter number is colored by **progression** — `hsk-chapter-number--new` (gray) / `--progress` (blue) / `--done` (green), computed from material-read / tests-passed. Verified live: marking a chapter studied turns its label blue.

---

## 4. Main app — flashcard 田字格 fix (v2 only — not yet synced)

**File:** `hanzika_18_hover_dictionary_stable.html` — `.tianzige` CSS + `buildCard()`

**Problem:** the 田字格 practice grid is for a *single* character, but the whole word was crammed into one box, so 3+ character words wrapped and overflowed the guide lines.

**Fix:** **one 田字格 box per character**, laid out as a practice-sheet row (`.tianzige-row`). `buildCard()` now maps `word.chars` → one `.tianzige` (with its own SVG guide lines) per char.
- The row is sized to the **card width** (`width:100%; padding:0 20px`) so boxes never overflow the card edges.
- Each box: `flex:1 1 0; aspect-ratio:1; max-width:190px; container-type:inline-size`.
- The glyph scales to its own box via **container-query units**: `.hanzi{ font-size:62cqw }` — so any character count and any screen size stays legible, no per-count font hacks.
- Verified 1/2/3/4-char words on desktop and 4-char at 320px mobile: clean, no wrap, no overflow.

---

## 5. Chapter Test Question Lab

**File:** `hanzika_question_type_playground.html` (standalone; own styles, no shared JS/data)
See the companion **`hanzika_question_lab_REVIEW.md`** for the full pedagogy review and open backlog (chief open item: the example content pool is too shallow / recycles ~2–3 sentences — a content-authoring task).

Implemented:
1. **Reveal-answer integrity fix** — added a separate `state.revealed` set; revealed answers show a neutral yellow **"Answer revealed"** banner (`.feedback.is-revealed`), never green "Correct," and are tracked separately from genuine correct answers.
2. **Item #9 (grammar) distractors rewritten** — realistic learner errors (English word-order transfer, e.g. stranding 为什么 at the end) instead of garbled strings; explanation expanded to name the common mistake.
3. **New type: Picture-choice listening** (`format:'Picture'`) — hear a word, tap the matching picture. Placeholder emoji stand in for the app's real vocab images. Removes the English/Hanzi crutch.
4. **New type: Reading comprehension** (`format:'Choice'` + `passage`) — short passage + a question needing the whole text. Fills the missing reading skill.
5. **New type: Functional response** (`format:'Choice'`) — pick the natural reply to a conversational prompt; distractors are grammatical but pragmatically wrong.
6. **New type: Error-spotting** (`format:'ErrorSpot'`) — tap the misplaced word; tests monitoring/proofreading.
7. **Pre-existing mobile bug fixed** — the horizontal catalog rail forced `.app`'s implicit grid column to `max-content`, blowing the layout past the viewport. Fixed with `.app{ grid-template-columns:minmax(0,1fr) }`.

Question count 11 → 15, reordered into: Listening → Reading → Vocabulary → Grammar → Communication/Monitoring → Production.

---

## 6. Study session playground — Flashcards · Translate · Write

**File:** `hanzika_study_session.html` (new standalone; self-contained, no shared JS from the main app)
**Data:** loads the real curriculum via `<script src>` — `hanzika_hsk_data.js` then `hanzika_hsk_study_data.js` (order matters: the second reads/extends the first and exports `window.HSK_STUDY_CURRICULUM`, all 15 HSK-2 chapters). Must be **served over http** (open the folder with a static server), not opened as a `file://`, or the data scripts won't load.

A clean-room rebuild of the app's study feature as an isolable page we can iterate on, mirroring the real behavior in `hanzika_18_hover_dictionary_stable.html` (`MODES`, `buildCard`, the commit-first flashcard flow, and `checkAnswer`) rather than inventing new mechanics.

**What it does:**
- **Setup:** mode tabs (Flashcards / Translate / Write), a *Which words* scope (All / New / Learning / Review — derived from a per-word Leitner `box`), an HSK-2 chapter multi-select rail (Ch. 1–15, "All" clears), and a session-length picker (5/10/15/20). A live meta line shows how many words match; Start disables when zero.
- **Flashcards — commit-first honesty flow (design principle §0.5):** front shows one 田字格 box per character; the user commits ("I know it" / "Don't know") *before* the reveal. "I know it" flips the card, then asks **"Be honest — did you actually know it?"** (Got it right / Missed it); "Don't know" records the miss, reveals for learning, then Continue. Keyboard 1/2, plus swipe-to-dismiss after reveal.
- **Translate:** English meaning → type Chinese. Accepts **pinyin (tone-lenient)** via `normalize()` (strips tone marks/numbers, ü→u, v→u) or exact hanzi.
- **Write:** meaning + tone-coloured pinyin hint → type the **hanzi** (intentionally strict — pinyin is rejected so the learner actively produces characters).
- **Shared:** pink session-progress bar, missed words **requeue** a few cards later (once per word) so they resurface same-session, and a summary (correct / missed / accuracy) with a 加油/好/棒 glyph by score + confetti.

**Conventions honoured:**
- Design tokens lifted verbatim from the main app's `:root`; canvas `#FAFAFA`, bubbly floating cards (`--bubble-radius`), pill buttons.
- **Pink = selection/active/primary only** — mode tabs, chapter/scope chips, count selector, all primary CTAs. **Data colours never used for selection:** HSK badge = purple (level identity), rate buttons green/red (answer feedback), pinyin/hanzi coloured by **tone** (`--t1..--t4`, neutral `--t0`).
- **Feedback integrity (§0.5):** "Show answer" yields a neutral **yellow "Answer revealed"**, never a green "Correct"; a revealed/missed item still lowers the word's box.
- Self-contained: vanilla JS + CSS animations (CSS `transform` flip, WAAPI confetti), **no GSAP/CDN**, so it runs offline. Honours `prefers-reduced-motion`.

**Notable implementation detail (bug found & fixed during verification):** stacked cards need the *top* card to paint above the peeking background cards. The background layers carried `z-index:2/1` while the base `.card` had none (auto = 0), so a background card rendered in front and the flip appeared to do nothing. Fixed by giving the base `.card` `z-index:3`. Verified live: all three modes end-to-end, reveal-integrity, requeue, and summary.

> Tooling added for live preview: `.claude/launch.json` + `.claude/static-server.js` (a ~20-line Node static server on :4599 — the sandbox blocks `python3 -m http.server`). Dev-only; not part of the app.

### 6a. Refinement pass 1 — legible progress + richer, still-authentic content

All within the same file; each verified live (flashcards, both quiz modes, mobile 375px, no console errors):

- **Per-word maturity strength** — the 5-dot indicator (`strengthDots()`), top-right on every flashcard, **data-coloured by Leitner stage** via `--dot-color` (new = gray `--border-2`, learning = `--yellow`, young = `--blue`, mastered = `--green`) — same convention as main-app §3, never pink. Verified: new words show 0 gray dots, a Review-scope word showed 3 blue dots.
- **Richer examples (authenticity preserved)** — the example pool now also mines each chapter's **listening-prompt sentences** (`question.audio`), not just the reading. Real chapter sentences only — no fabricated content. Coverage rose **109 → 116 / 140** words with ≥1 in-context sentence; the remaining 24 (never appear in any chapter sentence) simply show no example block.
- **Useful hint replaces a redundant one** — the front hint was "N characters," which the visible 田字格 boxes already show. Now an opt-in **"Meaning starts with '{letter}'"** nudge — a real recognition aid that doesn't fully spoil.
- **Resurfacing cue** — when a missed word requeues and comes back the same session, its card shows a yellow **"↻ Back for another look"** chip (attention = yellow data colour, not pink). Verified: missed card reappeared ~3 later with the chip; progress count grew 10 → 11 accordingly.
- **Accessibility** — added a visually-hidden `#srStatus` `role="status" aria-live="polite"` region; flashcard reveals and quiz verdicts announce the answer (hanzi + pinyin + meaning) to screen readers.

---

## 7. Streak & monthly report — honest low-performance behavior

**File:** `hanzika_streak_monthly_report_sample.html` (fixes) + new `hanzika_streak_monthly_report_sample_low_accuracy.html` (~16%-accuracy scenario, same component and logic, different sample inputs — for comparing how the report reads at the opposite end of the performance range).

Stress-testing the report (built in §prior session, see `hanzika_report_REVIEW.md`) against a struggling-learner scenario surfaced two places where it silently assumed good performance instead of actually reading the data — both are correctness fixes, not scope creep, so they were applied to **both** files:

1. **Win-banner was hardcoded to Recognition + always "solid."** It never checked whether Recognition was actually the best skill, and always used celebratory framing. Replaced with `bestSkill` (computed, not assumed) and a **4-tier message** by actual value: ≥85 🎉 excellent → ≥60 👍 strongest-area → ≥30 🌱 relatively-strongest-but-work-needed → <30 🧭 "Nothing is above N% yet — that's a signal, not a failure" + concrete advice (cut back on new words, repeat a small set until it sticks). The banner's color now follows the same tier (`.win-banner.is-good/.is-okay/.is-reset`, new `--red-dark` token added for readable text on `--red-bg`).
2. **History table's Accuracy column was hardcoded green** (`.accuracy-text{color:var(--green-dark)}`) regardless of the number — invisible in the original sample because its real accuracies happened to be 80–93%. Fixed to `style="color:${tone(pct)}"`, reusing the same traffic-light function already used for skills/chapters.
3. **KPI colors made data-driven**: "Words mastered" turns neutral gray (not green) at 0 — no false-positive celebration; "Retention" now uses the shared `tone()` scale instead of a fixed blue; "Words slipping" turns red at ≥40 instead of always orange.

**Low-accuracy sample calibration:** activity rounds recalibrated to the same 265-item volume as the original (for a fair side-by-side) but ~16% overall accuracy (42/265, verified by calculation); vocabulary funnel shifted to mostly New/Learning (128/30/5/2 of 165) with 0 mastered this month; weekly new-vs-review mix skewed toward "new" (mirrors a real failure mode — piling on new words instead of reviewing is part of *why* retention is low, a deliberate narrative link between panels, not just lower numbers everywhere).

**Verified live:** reloaded both files, confirmed no console errors, and read every panel's computed color/text via the DOM (not just visually) — mastered "0" in gray, retention/weakest-skill/slipping all correctly red, skills sorted worst-first topping out at 18%, closing banner correctly in the `is-reset` tier with the "signal, not a failure" copy, leech words at genuinely low ratios (0/11, 1/12), and the history table's per-round accuracy now red/orange throughout instead of green. Re-verified the original healthy sample afterward to confirm the fixes didn't change its (already-correct) output.

---

## Sync status (as of this log)

| Change area | v2 folder | original folder |
|---|---|---|
| Palette tokens, shell, top-nav, bubbly, data-colors (§1–3) | ✅ | ✅ (synced) |
| Flashcard 田字格 fix (§4) | ✅ | ❌ not yet |
| Question Lab: file + all improvements (§5) | ✅ | ❌ original has no playground file / no improvements |
| Study session playground (§6) | ✅ | ❌ standalone playground; not in original |
| Report honesty fixes + low-accuracy sample (§7) | ✅ | ❌ standalone concept files; not in original |

To bring the original folder fully up to date, port §4 and §5 (the review + `IMPROVEMENT_LOG.md` can be copied too). Everything is plain CSS/JS in the single HTML files; no build step. §6 is a standalone iteration surface — decide later whether/how to fold its refinements back into the main app's Study view. §7's two report files are concept/demo pages, not wired to the real app (see `hanzika_report_REVIEW.md` for the data-wiring plan).

---

## Verification method used

All changes were checked live in a browser preview (static `serve`): logged in via the demo account, walked each affected screen at desktop (1440px) and mobile (375px), confirmed no console errors, and spot-checked computed styles where visual inspection was ambiguous.
