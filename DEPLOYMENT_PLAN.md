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

### Phase 0 — Foundation (before any backend code) ✅ done
- [x] **Initialize a real, dedicated git repo for Hanzika** — done, pushed to `github.com/ilhampamn/hanzika`.
- [x] Confirm the stack decision (§6) — Supabase, confirmed.
- [x] Set up project accounts: database — Supabase project live. Sentry set up in Phase 4. **Correction**: hosting was never actually set up, despite this box previously being checked — see Phase 5 below, that's still fully open.
- [x] Decide launch scope: **ship the main app only.**

### Phase 1 — Schema & backend foundation ✅ done
- [x] Create the real schema (§2) in Postgres via migrations — 7 tables + RLS policies, applied and verified.
- [x] Stand up real auth — Supabase Auth (real hashed passwords, real sessions), plaintext `Store.login` comparison fully retired.
- [x] Build the API surface for what `Store` already does locally — done via Supabase's auto-generated REST API + RLS, no custom backend needed.
- [x] **Security pass** — password hashing handled by Supabase Auth; RLS policies enforce per-user data isolation server-side (not just client-trust) for every table.
- [x] Seeded `vocab_words` with the real 161-word HSK1/HSK2 shared curriculum extracted from the app's own `demoVocab()`.

### Phase 2 — Frontend integration (swap `Store`'s guts, keep its shape) ✅ done
- [x] Reimplemented `Store` and `HSKProgress` against Supabase — cache-backed reads (sync, unchanged call sites), queued async background writes.
- [x] Handled the sync→async shift for the 3 call sites that needed it (login/signup/logout); ~35 read call sites needed zero changes thanks to the cache design.
- [x] Real session handling via Supabase Auth (JWT in localStorage) — **and** session restore on page load (`Store.restoreSession()`), so a returning user isn't asked to log in again.
- [x] Fixed a real race condition found during testing: concurrent same-row background writes (e.g. two rapid reviews of one question) could land out of order and silently drop an update. Added `queueWrite()` to serialize per-row writes.
- [x] Bonus, not originally scoped: added hash-based routing (`#/profile`, `#/vocab`, `#/study`, `#/hsk`) — back/forward and refresh now keep you on the right tab.

### Phase 3 — Feature parity for what's already built
- [x] Activity modal + "Work on next" panel — already written against `Store`'s contract, confirmed working against real data (verified live: 11 reviews, 82% accuracy, correct weak-word surfacing).
- [x] Decide the fate of the "Try the demo account" flow — seeded a real `demo@hanzika.app` Supabase user (pre-confirmed) with 5 days of realistic activity (35 reviews, 83% accuracy, a live 5-day streak). Verified end-to-end through the real login flow.
- [x] Decide on existing prototype-era localStorage data: **no migration** — confirmed, fresh start at real launch.

### Phase 4 — Testing, staging, hardening
- [x] Add minimal automated tests around the new API — Playwright e2e suite added (`tests/`, `npm run test:e2e`): auth (login, logout, session persistence, wrong password, signup-needs-confirmation), vocab CRUD (add/edit/delete, each verified to survive a reload), and a full flashcard study session (persists to `sessions_completed` + `review_log`). All against the real Supabase project, using throwaway pre-confirmed test accounts cleaned up after each run.
- [x] Re-check loading/error states now that network latency is real — **this caught two real bugs**, not hypothetical ones:
  - `deleteVocab` fired its Supabase delete in the background with no way to know when it landed; an immediate reload could race ahead of it and the "deleted" word would reappear. Same latent bug existed in `updateVocab`/`addVocab`. Fixed: these now expose an awaitable `._persisted` promise (via `queueWrite`), and the UI awaits it before showing success/failure in the toast — so a delete/edit/add now either genuinely succeeds or visibly says so if it doesn't.
  - Found and fixed during the same pass: a self-introduced ordering bug where the vocab list was re-rendered *before* the cache mutation that was supposed to appear in it.
- [ ] Full manual QA on staging against the real backend: login, study flows (Flashcards/Translate/Write), HSK flows, streak calendar + activity modal, Work on Next. (Auth, vocab CRUD, and one flashcard round are now covered by the e2e suite above; Translate/Write modes and the full HSK practice/test flow still want a manual pass.)
- [x] Basic monitoring: error tracking — Sentry wired in via `https://browser.sentry-cdn.com/8.9.2/bundle.min.js` (CDN, no build step needed, matching how Supabase's client is loaded), initialized as the very first script in `<head>` so it can catch errors from everything else. `environment` auto-detects `development` on localhost vs `production` elsewhere. Verified end-to-end: sent a real test error and confirmed Sentry's ingest endpoint returned 200 (check the dashboard for "Hanzika Sentry wiring test — safe to ignore/delete" and resolve it). Uptime check still open — not set up.

### Phase 5 — Launch

**0. Decisions — resolved:**
- **Dev/prod split: yes.** Production gets its own fresh Supabase project, separate from the one every test account and the demo account live in. Needs: create the project (dashboard action — same as the original setup, I can't create Supabase projects via API), then re-run `supabase/migrations/` against it and reseed the 161 HSK words (both fully scripted from this session, just pointed at a new project URL/keys).
- **Hosting: Vercel.** Zero-config for a static site, GitHub-connected, auto TLS, instant one-click rollback.

**1. Hosting & deploy**
- [ ] Create a Vercel account (if you don't already have one) and connect `github.com/ilhampamn/hanzika` (branch `main`) — both are account-level actions on your side; I can walk through the config once the project exists.
- [ ] Set the **publish directory to the repo root** (no build step — it's one HTML file + a few JS/asset files) and explicitly exclude `tests/`, `node_modules/`, `.env`, `supabase/` from being served (none are needed at runtime, and `.env` must never end up reachable over HTTP even though it's gitignored — worth a host-level deny rule as a second layer of protection, not just relying on git history).
- [ ] Point the production entry at `hanzika_18_hover_dictionary_stable.html` — either as the site's index (rename/alias) or via a redirect from `/`, so users don't need the full filename in the URL.
- [ ] Confirm the chosen host supports **one-click rollback to a previous deploy** (Vercel and Netlify both do, out of the box) — that *is* the rollback plan; no separate tooling needed for a static site.

**2. Domain & DNS**
- [ ] Decide the domain (a subdomain of something you own, or a new purchase) — not yet decided.
- [ ] Point DNS at the host, provision TLS (automatic on all three hosting options above).

**3. Supabase production readiness** (new project) ✅ mostly done
- [x] Created the new Supabase project — `vertgsgbmtvopwqtigty.supabase.co`.
- [x] Applied both migrations (`20260724130734_initial_schema.sql`, `20260724141900_hsk_chapter_state.sql`) — verified all 8 tables exist.
- [x] Reseeded the 161-word shared HSK vocabulary — verified count via REST.
- [x] `SUPABASE_URL`/`SUPABASE_ANON_KEY` are now environment-aware in `hanzika_18_hover_dictionary_stable.html` (`IS_LOCAL_DEV` check on `location.hostname`): `localhost`/`127.0.0.1` keeps using the original dev project (so local testing and the Playwright suite never touch real user data), everything else uses the new production project. Verified both the local-dev branch (still points at the old project, login still works) and the exact prod URL/key pair (reads all 161 rows with no error) directly from the browser.
- [ ] Add the real production URL to **Authentication → URL Configuration → Redirect URLs** on the *new* project (same step we did for `localhost:5187` earlier, now needs repeating there) — can't finalize until the domain is decided (§2) and the site is actually deployed (§1), since that's the exact URL to allow-list.
- [ ] Check the project's backup posture under Settings → Backups. Supabase's free tier has limited backup retention; if this project stays on free tier for launch, know that explicitly rather than assuming backups match a paid tier's guarantees. Decide now whether that's acceptable for real user data or whether Pro (with longer retention / PITR) is worth it before real signups start.
- [ ] Decide on email delivery: Supabase's built-in mailer is rate-limited (2/hour on free tier — we hit this multiple times this session). Fine for a slow launch; will not survive a real signup spike. If more than a trickle of signups is expected at launch, configure a custom SMTP provider (Resend, Postmark, etc.) in Auth settings ahead of time.
- [ ] Decide the demo account's fate at scale: it's currently one shared `demo@hanzika.app` account with seeded data (from this session). Fine for a soft launch; if it gets meaningfully more traffic, its stats will drift from the curated "5-day streak, 83% accuracy" story pretty fast, and every visitor edits the *same* account. Not urgent — just don't forget it's a shared mutable demo, not a sandbox.

**4. Soft launch**
- [ ] Decide initial audience (just you + a few named testers vs. a public link) and for how long before wider release.
- [ ] Watch Sentry (now wired in) and Supabase's own logs/dashboard actively during that window — this is the first time this app will see real network latency and real concurrent users, neither of which local testing fully replicates.

**5. Post-launch roadmap**
- [ ] Revisit `IMPROVEMENT_PROPOSALS.md`. Several proposals (retention %, skill-accuracy, confidence calibration) were explicitly blocked on "no real data capture yet" — a real backend is exactly what unblocks them, so they become natural v1.1+ candidates.
- [ ] The known-open manual QA (Translate/Write study modes, full HSK practice/test flow) from Phase 4 is worth finishing before or shortly after soft launch, not indefinitely deferred.

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
