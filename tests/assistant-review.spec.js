import { test, expect } from './fixtures.js';

const APP_URL = '/hanzika_18_hover_dictionary_stable.html';

async function login(page, testUser){
  await page.goto(APP_URL);
  await page.fill('#authEmail', testUser.email);
  await page.fill('#authPassword', testUser.password);
  await page.click('#authForm button[type="submit"]');
  await expect(page.locator('#appShell')).toBeVisible();
}

test('Qwen task reviews every vocabulary example and reports progress', async ({ page, testUser }) => {
  await page.route('**/api/status', route => route.fulfill({
    contentType:'application/json',
    body:JSON.stringify({ qwen:true, gemini:false, qwenChatModel:'qwen-plus' }),
  }));
  await page.route('**/api/review-examples', async route => {
    const examples = route.request().postDataJSON().examples;
    await new Promise(resolve => setTimeout(resolve,150));
    await route.fulfill({
      contentType:'application/json',
      body:JSON.stringify({
        provider:'qwen',
        model:'qwen-plus',
        reviews:examples.map(example => ({
          id:example.id,
          natural:true,
          severity:'ok',
          issue:'',
          suggestedChinese:'',
          suggestedTranslation:'',
        })),
      }),
    });
  });

  await login(page,testUser);
  await page.click('[data-view="vocab"]');
  await page.click('#addWordBtn');
  await page.fill('#fHanzi','自然');
  await page.fill('#fMeaning','natural');
  await page.fill('#exampleRows .ex-zh-input','这个句子很自然。');
  await page.fill('#exampleRows .ex-en-input','This sentence sounds natural.');
  await page.click('#saveWordBtn');
  await expect(page.locator('#toast')).toContainText('Added',{timeout:10_000});

  await page.click('#assistantTopBtn');
  await expect(page.locator('#reviewExamplesTask')).toBeEnabled();
  await expect(page.locator('#reviewExamplesTaskCount')).toHaveText('1 example');
  await page.click('#reviewExamplesTask');
  await expect(page.locator('#reviewExamplesProgress')).toBeVisible();
  await expect(page.locator('#reviewExamplesProgressCount')).toHaveText('1 / 1');
  await expect(page.locator('#reviewExamplesProgressLabel')).toHaveText('Review complete');
  await expect(page.locator('#assistantMessages')).toContainText('Qwen vocabulary example review');
  await expect(page.locator('#assistantMessages')).toContainText('Natural: 1');
});
