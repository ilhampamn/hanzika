import { defineConfig } from '@playwright/test';

const PORT = 5199;

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // tests share one Neon branch; keep mutations easy to diagnose
  // Retries absorb transient network or serverless cold-start failures while
  // still using isolated throwaway users for every test.
  retries: 2,
  reporter: 'list',
  use: {
    baseURL: process.env.BASE_URL || `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: `npm run dev`,
    port: PORT,
    reuseExistingServer: true,
    timeout: 10_000,
  },
});
