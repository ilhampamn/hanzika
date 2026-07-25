import { defineConfig } from '@playwright/test';

const PORT = 5199;

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // tests hit the same real Supabase project; avoid cross-test noise
  // Supabase's admin REST API (used only by test setup/teardown to create and
  // delete throwaway users) intermittently returns a transient "bad_jwt" 403
  // on their end — seen even outside Playwright, in plain curl calls, earlier
  // in this project's manual testing. Not something in our control; retry
  // absorbs it instead of failing the suite on Supabase-side noise.
  retries: 2,
  reporter: 'list',
  use: {
    baseURL: process.env.BASE_URL || `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: `python3 -m http.server ${PORT} --directory .`,
    port: PORT,
    reuseExistingServer: true,
    timeout: 10_000,
  },
});
