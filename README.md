# Hanzika

Hanzika is a static Mandarin-learning frontend backed by serverless functions and Neon Postgres.

## Local setup

1. Create a Neon project and copy its pooled connection string.
2. Copy `.env.example` to `.env` and set `DATABASE_URL`.
3. Install packages and initialize the database:

   ```sh
   npm install
   npm run db:migrate
   npm run db:seed-demo
   ```

4. Start the local server (the same API handlers are deployed as Vercel Functions):

   ```sh
   npm run dev
   ```

5. Open <http://localhost:5199>.

The demo button signs in as `demo@hanzika.app` using `DEMO_PASSWORD` (or `demo1234` when that variable is omitted). Set the same `DATABASE_URL`, `QWEN_API_KEY`, and `GEMINI_API_KEY` values in the Vercel project before deploying.

## Commands

- `npm run dev` — run the static site and serverless APIs locally
- `npm run db:migrate` — apply the idempotent Neon schema
- `npm run db:seed-demo` — create or reset the demo account password
- `npm run test:e2e` — run Playwright against a temporary Neon test user

`DATABASE_URL` is server-only. Never put it in browser code or commit `.env`.
