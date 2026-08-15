import { test, expect } from './fixtures.js';

const APP_URL = '/hanzika_18_hover_dictionary_stable.html';

// Card state (front/confirm/continue) can flip between our visibility check
// and the click itself, since each transition fires fast — so attempt each
// possible action with its own short timeout and just retry the loop on a
// miss, rather than trusting a check-then-click pair to stay valid.
async function tryClick(page, selector){
  try { await page.click(selector, { timeout: 500 }); return true; }
  catch { return false; }
}

// Drives one full flashcard round using the "Not yet" / "I was wrong" path
// throughout (a single click per card, no drag), advancing through whichever
// state the card is currently in until the round's summary screen appears.
async function completeFlashcardRound(page){
  await page.click('#startStudyBtn');
  for (let i = 0; i < 60; i++){
    if (await page.locator('#studySummary').isVisible().catch(() => false)) return;
    await tryClick(page, '#commitBtns .rate-btn[data-act="dont"]')
      || await tryClick(page, '#confirmBtns .rate-btn[data-act="wrong"]')
      || await tryClick(page, '#continueBtn');
    // Always settle, even after a successful click — a departing card's exit
    // animation can visually overlap the next card's already-active buttons.
    await page.waitForTimeout(400);
  }
  throw new Error('Flashcard round never reached the summary screen');
}

test.describe('study session', () => {
  test('completing a flashcard round records real progress', async ({ page, testUser }) => {
    test.setTimeout(60_000);
    // The app itself collapses every GSAP duration to ~0.01x under
    // prefers-reduced-motion (const D = RM ? 0.01 : 1) — use that instead of
    // guessing sleep durations against real animation timing.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(APP_URL);
    await page.fill('#authEmail', testUser.email);
    await page.fill('#authPassword', testUser.password);
    await page.click('#authForm button[type="submit"]');
    await expect(page.locator('#appShell')).toBeVisible();

    await page.click('[data-view="study"]');
    await completeFlashcardRound(page);
    await expect(page.locator('#studySummary')).toBeVisible();

    // Reload and check the profile — this is the real signal: did the round
    // actually persist to Neon (sessions_completed, review_log, activities),
    // not just update the in-memory session that's about to be thrown away.
    await page.reload();
    await page.click('[data-view="profile"]');

    const sessionsCompleted = await page.evaluate(() => Store.currentUser().sessionsCompleted);
    expect(sessionsCompleted).toBeGreaterThanOrEqual(1);

    const reviewStats = await page.evaluate(() => Store.getReviewStats());
    expect(reviewStats.lifetime.n).toBeGreaterThan(0);
  });
});
