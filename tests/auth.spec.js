import { test, expect } from './fixtures.js';

const APP_URL = '/hanzika_18_hover_dictionary_stable.html';

test.describe('auth', () => {
  test('login with valid credentials enters the app', async ({ page, testUser }) => {
    await page.goto(APP_URL);
    await page.fill('#authEmail', testUser.email);
    await page.fill('#authPassword', testUser.password);
    await page.click('#authForm button[type="submit"]');

    await expect(page.locator('#appShell')).toBeVisible();
    await expect(page.locator('#sidebarEmail')).toHaveText(testUser.email);
  });

  test('logout returns to the login screen and does not persist', async ({ page, testUser }) => {
    await page.goto(APP_URL);
    await page.fill('#authEmail', testUser.email);
    await page.fill('#authPassword', testUser.password);
    await page.click('#authForm button[type="submit"]');
    await expect(page.locator('#appShell')).toBeVisible();

    await page.click('#logoutBtnSidebar');
    await expect(page.locator('#authView')).toBeVisible();

    await page.reload();
    await expect(page.locator('#authView')).toBeVisible();
    await expect(page.locator('#appShell')).toBeHidden();
  });

  test('a logged-in session survives a page reload', async ({ page, testUser }) => {
    await page.goto(APP_URL);
    await page.fill('#authEmail', testUser.email);
    await page.fill('#authPassword', testUser.password);
    await page.click('#authForm button[type="submit"]');
    await expect(page.locator('#appShell')).toBeVisible();

    await page.reload();
    await expect(page.locator('#appShell')).toBeVisible();
    await expect(page.locator('#sidebarEmail')).toHaveText(testUser.email);
  });

  test('an incorrect password is rejected with a real error, not a silent failure', async ({ page, testUser }) => {
    await page.goto(APP_URL);
    await page.fill('#authEmail', testUser.email);
    await page.fill('#authPassword', 'definitely-the-wrong-password');
    await page.click('#authForm button[type="submit"]');

    await expect(page.locator('#authError')).toBeVisible();
    await expect(page.locator('#appShell')).toBeHidden();
  });

  // A real end-to-end signup (real email, real confirmation click, then real
  // login) is exercised manually — Supabase's free-tier email rate limit
  // (2/hour) makes that path inherently flaky to run repeatedly in an
  // automated suite. This test mocks only the network response for the
  // signup request itself, so it deterministically covers the app's own
  // logic (form validation → Store.signup → error rendering) without
  // depending on live email delivery. The "log in with a real confirmed
  // account" half of this flow is already covered by the other tests in
  // this file, which use accounts created via the same confirmed-user shape.
  test('signup that requires email confirmation shows the right message, not a silent failure', async ({ page }) => {
    const email = `pw-signup-${Date.now()}@gmail.com`;

    await page.route('**/auth/v1/signup*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'mock-user-id', email, confirmation_sent_at: new Date().toISOString() }),
      });
    });

    await page.goto(APP_URL);
    await page.click('.auth-tab[data-mode="signup"]');
    await page.fill('#authName', 'Signup Test');
    await page.fill('#authEmail', email);
    await page.fill('#authPassword', 'PlaywrightSignup123!');
    await page.click('#authForm button[type="submit"]');

    await expect(page.locator('#authError')).toContainText(/check your email/i);
    await expect(page.locator('#appShell')).toBeHidden();
  });
});
