# Hanzika — Streak & Monthly Report: Learner-Perspective Review + Redesign

**File:** `hanzika_streak_monthly_report_sample.html`
**Lens:** reviewed as an actual Mandarin learner would use it — "what report helps me, and how do I use it to judge my own understanding?" — not as a styling pass.
**Status:** a redesign has been implemented on the sample (see CHANGELOG). This doc explains the *why* and maps each piece to real app data so it can be built for production.

---

## The core problem with the original report

Everything measured **activity / effort**: active days, completed rounds, items practised, weekly volume, practice-mix by study type. The only understanding signal was a single **"overall accuracy %"**, which is close to useless because it blends:
- words known cold for weeks (easy reviews) with words seen for the first time today,
- so a high number can just mean "I mostly reviewed easy stuff" — busy, not learning.

And the "Monthly highlights" panel, despite its own subtitle "useful signals, not vanity statistics," showed vanity: *best streak, strongest day, "quiz is most accurate."* None of it changes what the learner does tomorrow.

**A learner opens a report to answer four questions the original couldn't:**

1. **What do I actually know right now?** → a *knowledge state* (vocabulary by memory strength), not an activity log. "23 words moved to Mastered" is progress; "265 items practised" is not.
2. **What's slipping / what should I fix?** → a short, actionable list of weak chapters/skills and "leech" words I keep missing.
3. **Am I retaining or cramming?** → accuracy *on delayed review*, not on the day I first saw the word.
4. **Am I weak at recognizing, producing, or tones?** → accuracy **per skill**, because one global % hides the single thing most worth fixing.

**The shift: from "here's what you did" → "here's what you know, what's slipping, and what to do next."**

---

## How a learner *uses* the redesigned report (the loop that matters)

1. Glance at **Words mastered** → am I converting effort into durable knowledge, or just busy?
2. Read **Weakest skill / weakest chapter** → that *is* my next study session (report → action).
3. Clear the **slipping / leech** list before those words fully decay (retention defense).
4. Trust the number via **Retention %** (recall after a break) instead of same-day accuracy.
5. Over months, watch **Mastered count** and (future) HSK-goal coverage grow — outcome, not volume.

---

## Redesign implemented (panel by panel)

| Was (activity) | Now (understanding) |
|---|---|
| KPIs: active days · rounds · items · overall accuracy | **Words mastered (+23) · Retention (78%) · Weakest skill (60% Tones) · Words slipping (14)** |
| Practice mix (effort by study type) | **Accuracy by skill** — Recognition / Reading / Listening / Production / Tones, sorted weakest-first, traffic-light coloured (red <70, orange 70–84, green ≥85) |
| — (didn't exist) | **What you know now** — vocabulary mastery funnel (New/Learning/Young/Mastered) + "23 reached Mastered this month" |
| Weekly rhythm (items/week) | **Weekly rhythm** — stacked **new vs. review** per week (advancing vs. just maintaining) |
| Monthly highlights (vanity) | **Work on next** — 2 weakest chapters + weakest skill + "leech" word list + one genuine win |
| History table | kept as-is (still fine) |
| Calendar | kept as-is — genuinely good for the *consistency* habit; distinct, honest purpose |

Traffic-light thresholds and the weakest-first sort are deliberate: the most actionable info sits at the top and reads red.

---

## Mapping to REAL app data (for production implementation)

The good news: **the main app already stores everything this report needs** — the sample just faked it. Wire the report to these instead of the sample constants:

- **Vocabulary mastery funnel** → per-word `stats.box` (Leitner 0–5) + `statusOf(box)` (`new` / `learning` / `young` / `mastered`) — already used by the Profile "Vocabulary by status" bar. "Mastered this month" = words whose box reached 5 with a `lastReviewed` in-month.
- **Words slipping** → words where `stats.dueAt <= now` (due/overdue) — the app already tracks `dueAt`.
- **Retention %** → accuracy restricted to reviews where the word was first seen more than ~N days earlier (needs per-review timestamps; the app already logs round results — extend to tag first-see vs. delayed-review).
- **Accuracy by skill** → the Question Lab already defines the skill taxonomy (recognition / production / tones / listening / reading). Tag each quiz/flashcard round (or each item) with its skill and aggregate correct/seen per skill.
- **Accuracy by chapter** → rounds already carry `scope` (e.g. "HSK 2 · Chapter 8"); aggregate correct/seen per chapter.
- **Leech words** → per-word `stats.seen` and `stats.correct`: surface words with `seen >= ~5` and accuracy `< ~60%`.
- **Weekly new vs. review** → per round, split items into first-exposure vs. review (derivable from each word's prior `seen` at the time of the round).

Nothing here requires a new data model — mostly it requires **tagging rounds/items with skill + first-see-vs-review**, which is a small capture change, then aggregating existing per-word Leitner stats.

---

## Open follow-ups (not yet done)

- **HSK goal coverage** KPI ("187/300 HSK 2 words solid; ~3 weeks at current pace") — needs a per-level word inventory + goal setting.
- **Accuracy trend per chapter** in the history table (is a chapter improving across repeated attempts?).
- Design-system alignment (bubbly floating shell + strict pink=selection) was intentionally **not** done here per the reviewer's steer — this pass was about report substance. See `IMPROVEMENT_LOG.md` §0 for the color/shape conventions if/when this gets merged into the real Profile view. Note: this sample still uses pink as the "Quiz" category color, which conflicts with that convention.

---

## CHANGELOG (implemented on the sample)

1. Reframed report subtitle: "Not how much you did — what you actually know, what's slipping, and what to practise next."
2. KPIs → Words mastered / Retention / Weakest skill / Words slipping (coloured by data role).
3. New **What you know now** mastery funnel (New/Learning/Young/Mastered) + monthly-mastered caption.
4. **Practice mix → Accuracy by skill** (weakest-first, traffic-light bars).
5. **Weekly rhythm → new vs. review** stacked bars + legend.
6. **Monthly highlights → Work on next** (weak chapters + weakest skill + leech words + one win).
7. Added richer sample data (vocabulary mastery, per-skill, per-chapter, leeches, weekly new/review) to demonstrate all of the above.
8. Calendar, day-detail, and history table left intact and working. No console errors; verified at desktop and mobile widths.
