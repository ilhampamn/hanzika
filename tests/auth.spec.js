import { test, expect, deleteTestUserByEmail } from './fixtures.js';

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

  test('renders cached app data immediately while fresh data syncs', async ({ page, testUser }) => {
    await page.goto(APP_URL);
    await page.fill('#authEmail', testUser.email);
    await page.fill('#authPassword', testUser.password);
    await page.click('#authForm button[type="submit"]');
    await expect(page.locator('#appShell')).toBeVisible();

    await page.route('**/api/data**', async route => {
      const url = new URL(route.request().url());
      if(route.request().method() === 'GET' && url.searchParams.get('scope') === 'bootstrap'){
        await new Promise(resolve => setTimeout(resolve, 700));
      }
      await route.continue();
    });
    await page.reload({ waitUntil:'domcontentloaded' });

    const immediateState = await page.evaluate(() => ({
      appVisible: !document.getElementById('appShell').hidden,
      email: document.getElementById('sidebarEmail').textContent,
      authVisible: getComputedStyle(document.getElementById('authView')).display !== 'none',
      hasLoader: Boolean(document.getElementById('sessionRestore')),
    }));
    expect(immediateState).toEqual({ appVisible:true, email:testUser.email, authVisible:false, hasLoader:false });

    await expect(page.locator('#appShell')).toBeVisible({ timeout:10_000 });
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

  test('signup creates an immediately usable account', async ({ page }) => {
    const email = `pw-signup-${Date.now()}@gmail.com`;
    try {
      await page.goto(APP_URL);
      await page.click('.auth-tab[data-mode="signup"]');
      await page.fill('#authName', 'Signup Test');
      await page.fill('#authEmail', email);
      await page.fill('#authPassword', 'PlaywrightSignup123!');
      await page.click('#authForm button[type="submit"]');
      await expect(page.locator('#appShell')).toBeVisible();
      await expect(page.locator('#sidebarEmail')).toHaveText(email);
    } finally {
      await deleteTestUserByEmail(email);
    }
  });
});
