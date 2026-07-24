# Hanzika — Improvement Proposals (backlog)

Forward-looking ideas that are **proposed but NOT yet built**. This is the companion to `IMPROVEMENT_LOG.md` (which records what's already done). When a proposal here gets implemented, move it to the log.

Sources: distilled from `hanzika_question_lab_REVIEW.md`, `hanzika_report_REVIEW.md`, and session discussion.

**Priority:** 🔴 high (big learning value / unblocks other work) · 🟡 medium · ⚪ nice-to-have
**Effort:** S (hours) · M (a day) · L (multi-day / needs data-model work)

---

## A. Study & question types

### A1. 🔴 M — Tone-testing exercise (the app can't measure tones at all)
Today no study mode isolates whether the learner got the **tone** right — flashcards are self-rated, quizzes check meaning/hanzi, HSK tests cover listening/reading/vocab/grammar/production. So "Tones & pinyin" accuracy (shown in the report mock) is currently **impossible to populate with real data**.
**Build:** a new exercise type that scores tones separately — e.g. "hear the word → pick the tone contour," or "type the pinyin *with* tone number" and grade the tone independently of the syllable.
**Why:** tones are the #1 weak spot for most learners and are completely invisible in the current system. Unlocks the report's weakest-skill signal.

### A2. 🟡 M — Tag every round/item with a `skill` + `first-see vs. review`
Needed so **Accuracy-by-skill** and **Retention** in the report become real instead of mocked. Skill taxonomy already exists in the Question Lab (recognition / production / listening / reading / + tones from A1). "First-see vs. review" is derivable from the word's prior `stats.seen` at round time.
**Why:** small capture change that unblocks two of the most valuable report panels (see C1, C2).

### A3. 🟡 M — Question Lab: deepen the per-chapter content pool
Current playground reuses ~2–3 sentences across many items (e.g. `我觉得九月去北京旅游最好` drives items #1/#4/#5), so later items can be solved from memory, not comprehension. Author a wider, non-leaking item pool per chapter.
**Why:** biggest gap between "playground" and a real chapter test. **Content-authoring task**, good fit for the other tool. (Ref: question-lab review, "content recycled too tightly.")

### A4. 🟡 S — Per-distractor rationales
Explanations currently justify the right answer but rarely say *why each wrong option is wrong*. Add a short rationale per distractor (esp. grammar items).
**Why:** explaining the wrong answer measurably aids retention.

### A5. ⚪ M — Wire picture-choice listening to real vocab images
The new picture-choice type uses placeholder emoji. Connect it to the app's existing vocabulary images (`vocab-row-thumb` assets).

### A6. ⚪ S — Reading-comprehension from existing passages
The app already authors HSK chapter reading passages; reuse them to auto-generate reading-comprehension items instead of bespoke ones.

---

## B. Scoring / mastery integrity

### B1. 🟡 S — Don't let "reveal" or "wrong-then-corrected" count as mastery
If/when the Question Lab or study modes feed spaced-repetition or mastery tracking, ensure a revealed answer (already visually fixed to a neutral "Answer revealed" state) and a corrected-after-wrong attempt do **not** advance a word's Leitner box.
**Why:** protects the integrity of the mastery/retention numbers the report depends on.

---

## C. Report / Profile (understanding, not activity)

*(The report redesign itself is DONE — see IMPROVEMENT_LOG. These make it real + extend it.)*

### C1. 🔴 M — Wire the report to real app data
Replace the sample constants with live data. Mapping (all already stored except the tagging in A2):
- Mastery funnel → `stats.box` + `statusOf(box)`; "mastered this month" = box reached 5 with in-month `lastReviewed`.
- Words slipping → `stats.dueAt <= now`.
- Accuracy by skill / chapter → aggregated tagged rounds (A2) / round `scope`.
- Leech words → `stats.seen >= ~5` and accuracy `< ~60%`.
- Weekly new vs. review → per-round first-see vs. review split (A2).

### C2. 🟡 L — Retention metric (real)
Compute accuracy restricted to reviews where the word was first seen > N days earlier. Requires per-review timestamps (part of A2).
**Why:** distinguishes durable knowledge from same-day cramming — the number that makes the report trustworthy.

### C3. 🟡 L — HSK goal-coverage KPI
"187/300 HSK 2 words solid · ~3 weeks at current pace." Needs a per-level word inventory + a learner goal setting.
**Why:** situates effort against a real target instead of raw volume.

### C4. ⚪ M — Accuracy trend per chapter in the history table
Show whether a chapter is improving across repeated attempts (sparkline or ↑/↓), not just per-round accuracy.

### C5. ⚪ S — Mark "not-yet-tracked" skills honestly
Until A1 ships, either hide "Tones & pinyin" from Accuracy-by-skill or label it "not yet tracked — needs a tone exercise," so the report never implies data it doesn't have.

---

## D. Design-system alignment

### D1. 🟡 M — Bring the report/streak sample onto the design system
The streak+report sample predates our conventions: old flat shell (`#f3f3f5`, flush bordered sidebar, no bubbly cards) and it uses **pink as the "Quiz" category color** — which conflicts with the rule "pink = selection only; categories use other data colors." When merging into the real Profile view, apply the bubbly floating-card shell + `#FAFAFA` canvas and reassign the Quiz category off pink. (Ref: `IMPROVEMENT_LOG.md` §0.)

---

## E. Accessibility

### E1. 🟡 S — Fix sub-AA small-text colors
`--blue-dk` (#1899D6, ~3.2:1) and `--orange-dk` (#E2600A, ~3.55:1) fall below WCAG AA (4.5:1) for small text on white, and are used in several small-text spots inherited from the original app. Darken them, or restrict those hues to large/bold text and icons.

---

## G. Data-color correctness audit

### G1. 🟡 S — Sweep for other "assumed-good" hardcoded colors
Found (and fixed, §7 in the log) two spots in the streak/report sample that hardcoded an optimistic color instead of reading the actual value: the history table's Accuracy column was fixed green regardless of the number, and the "Work on next" closing banner always used celebratory pink/green framing regardless of whether the best skill was actually good. Both were invisible until tested against low-performance data. **Audit the main app and Study session playground for the same pattern** — anywhere a percentage/score is displayed, confirm the color is computed from the value (traffic-light `tone()`-style) rather than fixed.
**Why:** this class of bug only shows up when real usage produces bad numbers — exactly when the honest signal matters most.

---

## F. Housekeeping

### F1. 🟡 S — Sync v2 → original folder
`Side project - Hanzika v2/` is canonical. The original is behind on: the flashcard 田字格 fix, the Question Lab (file + improvements), and the streak/report redesign (+ the three review/log md files). Port these when ready. (Ref: IMPROVEMENT_LOG sync-status table.)
