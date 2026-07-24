# Hanzika — Chapter Test Question Lab: Content & Pedagogy Review

**File reviewed:** `hanzika_question_type_playground.html`
**Scope of review:** substance/pedagogy of the question types, not visual styling.
**Reviewer note:** This doc is written to be handed to another model as context. It captures (a) findings, (b) the design intent worth preserving, and (c) a prioritized backlog. A first batch of changes has already been implemented — see the CHANGELOG at the bottom.

---

## What this tool actually is

It is a **test / retrieval-practice layer**, not an instruction layer. There is no teaching in the file itself (no new material, no worked example before the attempt). That is fine **only if** it sits downstream of the main app's chapter reading + vocabulary material (it does — the HSK chapter cards in the main app show "Material · practice · tests"). Retrieval practice (the "testing effect") is one of the most evidence-backed techniques in learning science, so the concept is sound.

The interaction taxonomy is genuinely good and follows a real **scaffolded release of responsibility** (recognition → context → production):

- Vocabulary recognition (isolated) → Vocabulary in context → Grammar pattern selection → Sentence ordering (active construction) → Guided written production (no scaffold).

The *bones* are solid. The weaknesses are in **content depth** and a few **feedback-integrity** details.

---

## Findings against the four review questions

### 1. Is this the best way to learn Chinese?
Retrieval practice + a recognition→production ladder is well-grounded. Caveat: it only works if genuine *instruction* happens before it (in the main app). As a standalone test surface it is good; it is not a substitute for teaching.

### 2. Is 11 question types enough?
As **interaction formats**, yes. As **skills coverage**, no — real gaps:
- **Reading comprehension is entirely absent.** Every original item is audio-based or a text cloze; none is "read a passage, answer a question." Odd, because the main app already authors chapter reading passages that could feed this.
- **Functional / pragmatic response** (e.g. "how would you naturally reply to X?") — zero coverage, but central to HSK 1–2.
- **Picture-choice listening** — real HSK listening uses hear-it→pick-the-image; the app already has vocabulary images unused for this.

### 3. New question types worth introducing (ranked by value ÷ effort)
1. **Picture-choice listening** — reuses existing vocab images, removes the English-translation crutch (sound→concept directly), matches the real exam.
2. **Functional response** — biggest content gap; HSK 1–2 leans on practical dialogue.
3. **Error-spotting** — "tap the wrong word"; tests *monitoring/noticing*, a different (harder) skill than choosing a right answer.
4. **Reading-passage comprehension** — cheapest to add; source passages already exist in the app.

### 4. Clarity of answer / feedback
**Good:** MCQ feedback shows the correct option (green) and the learner's wrong pick (red) simultaneously; every item has an `explanation` that teaches the *why*, not just restates the answer.

**Problems:**
- **"Reveal answer" was indistinguishable from a genuine correct answer.** Clicking Reveal set the answer *and* marked it checked, rendering the same green "Correct" banner. If this ever feeds spaced-repetition/mastery tracking, that is an integrity bug — a learner who gave up looked identical to one who recalled it. → **Fixed** (see changelog): revealed answers now show a neutral "Answer revealed" state, not green "Correct."
- **Explanations justify the right answer but rarely explain why distractors fail** — and item #9's wrong options were garbled word-soup rather than realistic learner errors, so there was nothing coherent to explain. Research on feedback shows explaining *why the wrong answer is wrong* improves retention. → **Partially fixed:** #9 distractors rewritten as realistic L1-transfer errors, explanation expanded.

---

## The deeper issue: content is recycled too tightly (still open)

The "11 types" are demonstrated on a pool of only ~2–3 sentences:
- `我觉得九月去北京旅游最好` is the audio for items #1, #4, **and** #5 — by item #5 a learner solves the cloze from memory, not by re-processing audio.
- `你为什么想去北京(旅游)？` is the target for #9, #10, **and** #11 — three formats, one grammar point, back to back.

This is acceptable for a **playground demonstrating interaction shapes**, but for a real chapter test each chapter needs a deeper, more varied item pool (more distinct sentences and grammar points, and items that don't leak each other's answers). **This is a content-authoring task, not a code task**, and is the single biggest thing standing between "playground" and "shippable chapter test."

---

## Recommended backlog (for the other model / future work)

**Content authoring (highest impact, not yet done):**
- Expand each chapter's item pool so no source sentence is reused across items that would leak answers.
- Author per-distractor rationales (why each wrong option fails), especially for grammar items.
- Add real reading passages + comprehension questions per chapter (source already exists in main app).

**Feature/code (partially started):**
- Wire picture-choice listening to the app's real vocabulary images (currently placeholder emoji in the playground).
- Consider a "difficulty/level" tag per item and per-test item selection logic.
- If/when scoring or SRS is added: ensure "reveal" and "wrong-then-corrected" do not count as mastery.

---

## CHANGELOG — implemented in this session

1. **Reveal-answer integrity fix** — added a distinct `revealed` state; revealed answers show a neutral "Answer revealed" banner (yellow), never the green "Correct" state, and are tracked separately from genuine correct answers.
2. **Item #9 (grammar pattern selection) rewritten** — distractors are now realistic learner errors (L1 word-order transfer, e.g. stranding 为什么 at the end) instead of garbled strings; explanation expanded to name the common mistake.
3. **New type: Picture-choice listening** — hear a word, tap the matching picture (placeholder emoji stand in for the app's real vocab images). Removes the English/Hanzi crutch.
4. **New type: Reading comprehension** — a short multi-sentence passage + a question that requires reading the whole text, not word-matching. Fills the missing reading skill.
5. **New type: Functional response** — pick the natural reply to a conversational prompt; distractors are grammatical but pragmatically wrong. Fills the communication gap.
6. **New type: Error-spotting** — tap the misused word in an incorrect sentence; tests monitoring/proofreading, distinct from picking a correct answer.
7. **Pre-existing mobile bug fixed** — the horizontal catalog rail forced the `.app` grid's implicit column to `max-content`, blowing the entire layout past the viewport on phones (already broken at 11 items; more items made it worse). Fixed by constraining the grid column to `minmax(0,1fr)` so the rail scrolls internally instead of expanding the page.

Question count went from 11 → 15, reordered into a clean skills progression: Listening → Reading → Vocabulary → Grammar → Communication/Monitoring → Production.
