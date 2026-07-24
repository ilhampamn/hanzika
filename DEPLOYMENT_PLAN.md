# Hanzika — Path to Real Deployment: Phased Plan

**Written for:** taking Hanzika from its current state (a fully client-side prototype) to a real, deployed product with a real database and real users.
**Grounded in:** the actual current implementation — this isn't generic advice, every data shape and gap below is read directly from `hanzika_18_hover_dictionary_stable.html`.

---

## 0. Honest state of the current build (read this first)

Be clear-eyed about what "ready" means here — the *design and UX* are genuinely far along; the *engineering foundation for production* doesn't exist yet:

- **There is no backend and no real database.** Everything lives in browser `localStorage` via the `Store` module. Data is per-browser, per-device, not backed up, wiped on cache clear, and invisible across devices.
- **Auth is not production-safe.** `Store.login(email, password)` compares a plaintext password stored directly in `localStorage`. This must not go live as-is — it's fine for a prototype, not for real user accounts.
- **No server-side validation exists**, because there is no server. Every write today is trusted blindly from the client.
- **No version control.** The only git repo touching this folder is actually the user's entire home directory (`/Users/pam`), tracking unrelated projects — Hanzika itself has never been its own repo.
- **No tests, no CI, no build step.** The whole app is hand-authored HTML/CSS/JS in a handful of files. Fast to prototype in, riskier to wire a real backend into without breaking things.
- **Three related surfaces exist, at different levels of "real":**
  1. **Main app** (`hanzika_18_hover_dictionary_stable.html`) — the real product surface. This is what should go to production.
  2. **Question Lab** (`hanzika_question_type_playground.html`) — a standalone design exploration, not wired to the main app's data at all.
  3. **Streak/Monthly Report concept files** — mostly mocked data; only a small slice (the "Work on next" panel + activity modal) has actually been ported into the real app with real data.

None of this is a criticism — it's the normal, correct order of operations for a solo/small project (get the UX right cheaply before building the expensive backend). But it means "real deployment" is a genuine engineering project, not a deploy button.

---

## 1. Target architecture (recommended, not mandatory)

| Layer | Recommendation | Why |
|---|---|---|
| Database + Auth | **Supabase** (managed Postgres + built-in Auth + Row Level Security) | Fastest path to a real, secure backend for a solo/small project — replaces "write a custom auth system" with configuration. Alternative: Neon/Railway Postgres + Auth.js if you want more control. |
| API layer | Supabase's auto-generated REST/Realtime API + RLS policies for most operations; a **thin custom API** (e.g. Next.js API routes or a small Node/Express service) only for logic that shouldn't live in the client (e.g. SRS scheduling math, anything you don't want a savvy user reverse-engineering from network calls) | Minimizes backend code to write and maintain. |
| Frontend hosting | Vercel / Netlify / Cloudflare Pages | Static hosting, trivial CI/CD, free tier is enough at launch scale. |
| Environments | local → staging → production, **separate databases per environment** | Never test against real user data. |

This is a recommendation with clear tradeoffs, not a locked decision — see §6 for what's actually a decision point vs. what's a safe default.

---

## 2. Data model to formalize

Every shape below is read directly from the current `Store`/`HSKProgress` implementation — this is not speculative schema design, it's a direct translation of what already exists into real tables.

```
users
  id, email, password_hash, name, created_at, last_studied_at, sessions_completed

vocab_words                          -- shared/seed content + user-owned custom words
  id, owner_user_id (null = shared HSK content), chars, pinyin (jsonb), meaning,
  source ('hsk' | 'custom'), hsk_level, hsk_chapter, tags (jsonb), examples (jsonb), image_url

vocab_stats                          -- per-user progress on a word (today: word.stats)
  user_id, word_id, box, seen, correct, streak, due_at, last_reviewed_at, added_at

review_log                          -- today: reviewLogByUser[] — powers "Review activity" windows
  id, user_id, word_id, ts, knew

activities                          -- today: completionByUser[day].activities[] (flatten to rows)
  id, user_id, ts, date, kind, mode, mode_label, scope_label,
  item_count, unit, correct, incorrect, accuracy

hsk_progress                        -- today: HSKProgress.chapter(id).questions
  user_id, chapter_id, question_id, attempts, correct, skill

hsk_test_scores                     -- today: HSKProgress.chapter(id).testScores
  user_id, chapter_id, test_id, best_score, attempts
```

**Content tables (HSK chapters/questions/curriculum) — recommend staying static** (bundled JS, as today) for v1. Only move content into the DB once you want non-developer content editing; it's real scope you don't need to take on for launch.

---

## 3. Phased plan

### Phase 0 — Foundation (before any backend code)
- [ ] **Initialize a real, dedicated git repo for Hanzika** (currently has none of its own). Do this first — every later phase assumes real version control.
- [ ] Confirm the stack decision (§6) — or accept the Supabase recommendation and move on.
- [ ] Set up project accounts: hosting, database, error tracking (e.g. Sentry).
- [ ] Decide launch scope: **ship the main app only.** Treat the Question Lab and full mocked "monthly report" redesign as design references / roadmap (`IMPROVEMENT_PROPOSALS.md`), not launch blockers.

### Phase 1 — Schema & backend foundation
- [ ] Create the real schema (§2) in Postgres; set up migrations (don't hand-edit prod schema).
- [ ] Stand up real auth (hashed passwords, real sessions/tokens) — retire the plaintext `Store.login` comparison entirely.
- [ ] Build the API surface for what `Store` already does locally: signup/login, vocab CRUD, `reviewVocab`, `completeSession` (activity logging), `getCompletionDays`, HSK progress read/write.
- [ ] **Security pass**: hash passwords (bcrypt/argon2 via your auth provider), validate/sanitize every input server-side (today everything is trusted from the client — a real backend must not repeat that), rate-limit auth endpoints.

### Phase 2 — Frontend integration (swap `Store`'s guts, keep its shape)
This is the good news: `Store` already exposes a clean, function-based API (`login`, `signup`, `getVocab`, `addVocab`, `reviewVocab`, `completeSession`, `getCompletionDays`, `getTodayProgress`, `localDateKey`, …). The migration can be **surgical** — reimplement each function to call the real API instead of `localStorage`, keeping the same names/shapes wherever possible, so the large amount of calling code already built (`renderProfile`, `renderVocabList`, the study flows, HSK flows, the activity modal, "Work on next") barely has to change.
- [ ] Reimplement each `Store` function against the real API.
- [ ] Handle the sync→async shift: every `Store` call is synchronous today; real API calls are async. Every call site needs `await` + real loading/error states (today's UI assumes instant success — e.g. "Add word" updates immediately; you'll want optimistic UI with rollback on failure).
- [ ] Real session handling (httpOnly cookie or token) replacing today's simple "logged in" flag.

### Phase 3 — Feature parity for what's already built
- [ ] Port the activity modal + "Work on next" panel logic to the real API — minimal changes needed since it was written against `Store`'s existing contracts.
- [ ] Decide the fate of the "Try the demo account" flow (seeded real demo user server-side vs. a proper onboarding/sample-data experience).
- [ ] Decide on existing prototype-era localStorage data: recommend **no migration** (fresh start at real launch) unless specific testers have data they care about — flag if so.

### Phase 4 — Testing, staging, hardening
- [ ] Add minimal automated tests around the new API (auth, vocab CRUD, session completion) — there are currently zero tests anywhere in this project.
- [ ] Full manual QA on staging against the real backend: login, study flows (Flashcards/Translate/Write), HSK flows, streak calendar + activity modal, Work on Next.
- [ ] Re-check loading/error states now that network latency is real (it wasn't, with localStorage).
- [ ] Basic monitoring: error tracking, uptime check.

### Phase 5 — Launch
- [ ] Domain/DNS, production secrets, **backups enabled on the real DB** (this is the whole point of leaving localStorage — don't skip it).
- [ ] Soft launch + rollback plan.
- [ ] Post-launch roadmap: revisit `IMPROVEMENT_PROPOSALS.md`. Several proposals (retention %, skill-accuracy, confidence calibration) were explicitly blocked on "no real data capture yet" — a real backend is exactly what unblocks them, so they become natural v1.1+ candidates.

---

## 4. What does NOT need to change

Worth naming explicitly so this doesn't feel like a rewrite:
- The visual design system, component structure, and all UX flows (calendar, modal, study modes, HSK flows) stay as-is.
- The data *shapes* stay almost identical — this is a foundation swap (localStorage → real API/DB), not a redesign.
- `MODES`, `SCOPES`, curriculum content, and all the rendering functions built this session are reused, not rebuilt.

---

## 5. What's genuinely risky if skipped

- **Shipping the plaintext-password auth as-is.** Non-negotiable to fix before real users sign up.
- **No backups.** The entire reason to leave localStorage is durability — an unbacked-up Postgres instance recreates the same fragility with extra steps.
- **Trusting client input server-side.** Every `Store` function currently assumes good-faith input; a real API must validate everything independently.

---

## 6. Open decisions (flagged, not blocking this plan)

| Decision | Recommended default | Why it's still worth confirming |
|---|---|---|
| Backend/DB stack | Supabase | You may already have preferred hosting/infra from other work — say so if you do. |
| Curriculum content location | Stay static (bundled JS) | Only move to DB if you want non-dev content editing; real extra scope. |
| Question Lab & full mocked report | Stay as design references, not launch features | These need real data plumbing (skill tagging, retention tracking) that doesn't exist yet — see `IMPROVEMENT_PROPOSALS.md` A2/C2. |
| Timeline / solo vs. help | — | Changes how aggressively to parallelize phases. |
| Existing prototype data from testers | No migration | Only matters if real people have accumulated data you don't want to lose. |

---

## 7. Suggested immediate next step

Phase 0's first checkbox — **give Hanzika its own git repo** — is small, safe, and unblocks everything else (real commits, real deploy pipelines, real rollback). Good candidate to do before anything else, independent of any stack decision above.
