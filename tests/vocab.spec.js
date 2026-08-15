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

  test('populates a missing image, reports progress, and persists it', async ({ page, testUser }) => {
    await page.route('**/api/images?**', route => route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        image: {
          url: 'https://images.example.test/playwright-camera.jpg',
          provider: 'Unsplash',
          source: 'https://unsplash.com/photos/test?utm_source=hanzika&utm_medium=referral',
          credit: 'Test Photographer',
          creditUrl: 'https://unsplash.com/@test?utm_source=hanzika&utm_medium=referral',
        },
      }),
    }));
    await page.route('https://images.example.test/**', route => route.fulfill({
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="pink"/></svg>',
    }));

    await login(page, testUser);
    await page.click('[data-view="vocab"]');
    await page.click('#addWordBtn');
    await fillAndVerify(page, '#fHanzi', '相机');
    await fillAndVerify(page, '#fMeaning', 'playwright camera');
    await page.click('#saveWordBtn');
    await expect(page.locator('#toast')).toContainText('Added', { timeout: 10_000 });

    const row = page.locator('.vocab-row', { hasText: '相机' });
    await expect(row.locator('[data-image-status]')).toHaveText('No image');
    await page.click('#populateImagesBtn');
    await expect(page.locator('#imagePopulatePanel')).toBeVisible();
    await expect(page.locator('#imagePopulateCount')).toHaveText('1 / 1', { timeout: 10_000 });
    await expect(page.locator('#imagePopulateDetail')).toContainText('1 saved');
    await expect(row.locator('[data-image-status]')).toHaveText('Image');
    await expect(row.locator('.image-credit')).toContainText('Photo by Test Photographer on Unsplash');

    await page.reload();
    await page.click('[data-view="vocab"]');
    const persistedRow = page.locator('.vocab-row', { hasText: '相机' });
    await expect(persistedRow.locator('[data-image-status]')).toHaveText('Image');
    await expect(persistedRow.locator('.image-credit')).toContainText('Photo by Test Photographer on Unsplash');
  });

  test('merges repeated Markdown rows into examples for one word', async ({ page, testUser }) => {
    const markdown = `| Hanzi | Pinyin | Meaning | Example (中文) | Translation | HSK | Tags |
|---|---|---|---|---|---|---|
| 测例 | cè lì | test example | 这是第一个例子。 | This is the first example. | 4 | testing |
| 测例 | cè lì | test example | 这是第二个例子。 | This is the second example. | 4 | testing |
| 测例 | cè lì | test example | 这是第三个例子。 | This is the third example. | 4 | testing |`;

    await login(page, testUser);
    await page.click('[data-view="vocab"]');
    await page.click('#importBtn');
    await page.setInputFiles('#importFileInput', {
      name: 'expanded-examples.md',
      mimeType: 'text/markdown',
      buffer: Buffer.from(markdown),
    });
    await expect(page.locator('#dropzoneSub')).toHaveText('1 word found');

    const persisted = page.waitForResponse(response =>
      response.url().endsWith('/api/data') && response.request().method() === 'POST' && response.ok()
    );
    await page.click('#importConfirmBtn');
    await persisted;

    await page.reload();
    await page.click('[data-view="vocab"]');
    const row = page.locator('.vocab-row', { hasText: '测例' });
    await expect(row).toBeVisible();
    await row.locator('[data-action="edit"]').click();
    await expect(page.locator('#exampleRows .example-row')).toHaveCount(3);
    const examples = page.locator('#exampleRows .ex-zh-input');
    await expect(examples.nth(0)).toHaveValue('这是第一个例子。');
    await expect(examples.nth(1)).toHaveValue('这是第二个例子。');
    await expect(examples.nth(2)).toHaveValue('这是第三个例子。');
  });
});
