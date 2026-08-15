import { test, expect } from './fixtures.js';

const APP_URL = '/hanzika_18_hover_dictionary_stable.html';

async function login(page, testUser){
  await page.goto(APP_URL);
  await page.fill('#authEmail', testUser.email);
  await page.fill('#authPassword', testUser.password);
  await page.click('#authForm button[type="submit"]');
  await expect(page.locator('#appShell')).toBeVisible();
}

// fill() can race the modal's open transition in some runs — assert the value
// actually stuck (auto-retrying) before moving on, instead of trusting fill()
// blindly.
async function fillAndVerify(page, selector, value){
  await expect(page.locator(selector)).toBeVisible();
  await page.fill(selector, value);
  await expect(page.locator(selector)).toHaveValue(value);
}

test.describe('vocab CRUD', () => {
  test('adding a custom word saves it and shows up in the list', async ({ page, testUser }) => {
    await login(page, testUser);
    await page.click('[data-view="vocab"]');
    await page.click('#addWordBtn');

    await fillAndVerify(page, '#fHanzi', '测试');
    await fillAndVerify(page, '#fMeaning', 'playwright test word');
    await page.click('#saveWordBtn');

    const row = page.locator('.vocab-row', { hasText: '测试' });
    await expect(row).toBeVisible();
    await expect(row).toContainText('playwright test word');

    // Wait for the real "added" confirmation (fires only once the Neon
    // insert actually lands) before reloading, then confirm it actually
    // persisted to Neon, not just the in-memory cache.
    await expect(page.locator('#toast')).toContainText('Added', { timeout: 10_000 });
    await page.reload();
    await page.click('[data-view="vocab"]');
    await expect(page.locator('.vocab-row', { hasText: '测试' })).toBeVisible();
  });

  test('editing a word updates its meaning', async ({ page, testUser }) => {
    await login(page, testUser);
    await page.click('[data-view="vocab"]');
    await page.click('#addWordBtn');
    await fillAndVerify(page, '#fHanzi', '编辑');
    await fillAndVerify(page, '#fMeaning', 'original meaning');
    await page.click('#saveWordBtn');
    await expect(page.locator('#toast')).toContainText('Added', { timeout: 10_000 });

    await page.locator('.vocab-row', { hasText: '编辑' }).locator('[data-action="edit"]').click();
    await fillAndVerify(page, '#fMeaning', 'updated meaning');
    await page.click('#saveWordBtn');

    const row = page.locator('.vocab-row', { hasText: '编辑' });
    await expect(row).toContainText('updated meaning');
    // Same real-completion wait as the add flow, this time for the update.
    await expect(page.locator('#toast')).toContainText('Saved changes', { timeout: 10_000 });

    await page.reload();
    await page.click('[data-view="vocab"]');
    await expect(page.locator('.vocab-row', { hasText: '编辑' })).toContainText('updated meaning');
  });

  test('deleting a word removes it from the list and from storage', async ({ page, testUser }) => {
    await login(page, testUser);
    await page.click('[data-view="vocab"]');
    await page.click('#addWordBtn');
    await fillAndVerify(page, '#fHanzi', '删除');
    await fillAndVerify(page, '#fMeaning', 'to delete');
    await page.click('#saveWordBtn');
    await expect(page.locator('.vocab-row', { hasText: '删除' })).toBeVisible();

    page.once('dialog', dialog => dialog.accept());
    await page.locator('.vocab-row', { hasText: '删除' }).locator('[data-action="delete"]').click();

    await expect(page.locator('.vocab-row', { hasText: '删除' })).toHaveCount(0);
    // Wait for the real "deleted" confirmation (fires only once the Neon
    // delete actually lands) before reloading — otherwise the reload can race
    // ahead of the background write and the word would incorrectly reappear.
    await expect(page.locator('#toast')).toContainText('Deleted', { timeout: 10_000 });

    await page.reload();
    await page.click('[data-view="vocab"]');
    await expect(page.locator('.vocab-row', { hasText: '删除' })).toHaveCount(0);
  });
});
