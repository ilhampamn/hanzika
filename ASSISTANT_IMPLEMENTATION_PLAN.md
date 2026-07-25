# Hanzika Assistant ("Guide") — Implementation Plan

## 0. What already exists

The frontend (`hanzika_18_hover_dictionary_stable.html`, `initAssistantChat()`) is fully built —
UI, conversation history (localStorage per-user), the "Guide" bubble/top-nav button, suggestion
chips, typing indicator, mobile modal behavior. It has never been wired to anything real: it
calls two endpoints that don't exist in this repo. That's the entire gap. Nothing here requires
touching the frontend beyond, at most, minor polish.

**Exact contract the frontend already expects** (read directly from the code, not assumed):

### `GET /api/status`
No body. Frontend treats non-2xx or a JSON parse failure as "unavailable" and shows an error
state (this is today's behavior, and works correctly — it's *supposed* to fail closed).
```ts
// response, 200:
{ qwen: boolean, gemini: boolean, qwenChatModel?: string, geminiChatModel?: string }
```
`ready` becomes true if either `qwen` or `gemini` is `true`. Qwen is treated as primary, Gemini
as backup — the status text says "Gemini backup ready" when Qwen is up, or "backup mode" when
only Gemini is.

### `POST /api/chat`
```ts
// request body:
{ messages: Array<{ role: 'user' | 'assistant', content: string }> }
// (already trimmed client-side: last 12 messages, each capped at 1600 chars, no system role)

// response, 200:
{
  answer: string,          // required, non-empty
  inScope: boolean,         // false renders the answer with a "rejected/off-topic" style
  provider: 'qwen' | 'gemini',
  model: string,
  fallbackUsed: boolean,    // true if Qwen failed and Gemini answered instead
  suggestions?: string[],   // up to 3 follow-up question chips, filtered to strings client-side
}
// response, non-2xx:
{ error: string }           // shown to the user as "I could not answer right now: {error}"
```

Declared scope (from the welcome message already in the code): **Mandarin, hanzi, grammar,
idioms, Chinese traditions, history, literature, food culture, and etiquette.** `inScope: false`
is how the backend flags a question that's off that topic — the frontend still shows the answer,
just styled differently, so the model should still answer (briefly, redirecting toward the app's
actual purpose) rather than refuse outright.

---

## 1. Decisions needed before writing code

- **Providers**: the frontend already hardcodes Qwen-primary/Gemini-backup labels
  (`chatModelLabel()`). Confirming that pairing, or swapping to something else, is a real decision
  — Qwen (Alibaba DashScope) needs an account there; Gemini needs a Google AI Studio key. Both are
  external accounts I can't create for you.
- **Auth-gating**: should `/api/chat` require a logged-in Supabase session, or is it open to anyone
  who loads the page? The frontend already checks `Store.isAuthed()` before letting a user *open*
  the panel, but that's client-side only — nothing stops a direct `POST /api/chat` call today. My
  recommendation: require a valid Supabase access token (sent as a header from the client, verified
  server-side against the project's JWT secret) so the API keys can't be burned by an anonymous
  script hitting the endpoint directly. This is genuinely necessary before shipping, not optional
  hardening — LLM API calls cost real money per request.
- **Rate limiting**: beyond auth-gating, worth a basic per-user cap (e.g. N messages/hour) to bound
  cost from a single compromised or careless account. Simple to add once auth-gating exists (a row
  per user in a new Supabase table, or Vercel KV if you want it entirely outside Postgres).

## 2. Architecture

- **Vercel Serverless Functions** — already on Vercel, zero new infra. Add:
  - `api/status.js`
  - `api/chat.js`
  
  (Vercel auto-detects a top-level `api/` directory as functions; this coexists fine with
  `vercel.json`'s static config for everything else.)
- **Env vars** (set in Vercel project settings, never committed): `QWEN_API_KEY`, `GEMINI_API_KEY`,
  and whatever's needed to verify a Supabase JWT server-side (the project's JWT secret, or just
  re-validate the token against Supabase's `/auth/v1/user` endpoint with the token as Bearer —
  simpler, no extra secret to manage, one extra HTTP round-trip per chat request).

## 3. `api/status.js`

Cheap, no external API calls needed — just report which env vars are present:
```js
export default function handler(req, res) {
  const qwen = Boolean(process.env.QWEN_API_KEY);
  const gemini = Boolean(process.env.GEMINI_API_KEY);
  res.status(200).json({
    qwen, gemini,
    qwenChatModel: qwen ? 'qwen3.7-plus' : undefined,
    geminiChatModel: gemini ? 'gemini-3.1-flash-lite' : undefined,
  });
}
```
(Model id strings should match whatever's actually configured in `api/chat.js` — the frontend
just displays them via `chatModelLabel()`, already written to expect exactly these two.)

## 4. `api/chat.js`

1. **Verify the caller is authenticated** — read an `Authorization: Bearer <token>` header (client
   needs a small addition: attach `supa.auth.getSession()`'s access token to the fetch call, which
   isn't in the frontend yet — the one real frontend change this feature needs). Verify it against
   Supabase (`GET {SUPABASE_URL}/auth/v1/user` with that Bearer token + the anon key as `apikey`);
   reject with 401 if invalid.
2. **Validate the request body** — `messages` must be a non-empty array of `{role, content}`;
   reject malformed input with 400 rather than forwarding garbage to a paid API.
3. **Build the system prompt** — scope instructions (the topic list above), tone, and an
   instruction to respond with a small JSON envelope so `inScope`/`suggestions` can be extracted
   reliably rather than guessed at from free text. Both Qwen and Gemini support constrained/JSON
   output modes — use that rather than hoping the model's prose happens to parse.
4. **Call Qwen first.** On any failure (timeout, non-2xx, malformed response), catch it and retry
   the same request against Gemini, setting `fallbackUsed: true`.
5. **Parse the model's JSON envelope** into `{answer, inScope, suggestions}`. If parsing fails even
   after a provider responds, treat it as `inScope: true` with the raw text as `answer` and no
   suggestions — degrade gracefully rather than erroring the whole request over a formatting slip.
6. **Return the shape above.** On total failure (both providers failed), return a non-2xx with
   `{ error: "..." }` — the frontend already handles this path correctly.

## 5. Rate limiting (once auth-gating exists)

Simplest v1: a `assistant_usage` table (`user_id`, `date`, `count`), incremented per request,
checked before calling either provider — reject with 429 past a daily cap. This is a small,
independent addition after the core endpoints work; doesn't block initial launch of the feature.

## 6. Testing

- Manual: the existing UI already has a full conversation flow to click through once the
  endpoints exist — no new frontend testing surface.
- Worth one Playwright test once this is real: mock `/api/status` and `/api/chat` (same pattern
  already used for the signup-confirmation-email test) to verify the panel opens, sends a message,
  and renders a response — without spending real API credits on every test run.

## 7. Rollout order

1. Confirm the two decisions in §1 (providers, auth-gating approach).
2. Get `QWEN_API_KEY` / `GEMINI_API_KEY` (your side — account creation).
3. I implement `api/status.js` + `api/chat.js` + the one frontend change (attach the auth token to
   the `/api/chat` fetch).
4. Set the env vars in Vercel, deploy, verify the "Guide" button goes from "unavailable" to
   showing a real model name.
5. Manual QA pass on a real conversation (on-topic and deliberately off-topic questions, to check
   the `inScope` styling actually differs).
6. Rate limiting (§5) as a fast follow, not a launch blocker.
