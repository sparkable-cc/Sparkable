import { expect, test } from '@playwright/test';
import { compose } from 'redux';

test.describe('Submit', () => {
  test('should submit a link', async ({ page }) => {
    // Generate a random identifier
    const randomId = Math.floor(Math.random() * 1000);
    const randomUrl = `https://www.youtube.com/watch?v=8BFdFeOS3oM&t=${randomId}`;

    await page.goto('/auth/signin');
    await page.getByLabel('username').fill('randomUsername');
    await page.getByLabel('password').fill('123Asdf#%@');
    await page.click('footer button');

    await expect(page).toHaveURL('/');

    await page.goto('/submission/create');
    page.locator('button:has-text("start")').click();
    await expect(page).toHaveURL('/submission/create/link');

    await page.locator('input[name="link"]').fill(randomUrl);

    page.locator('button:has-text("Continue")').click();
    await expect(page).toHaveURL('/submission/create/category');

    page.locator('button:has-text("Society")').click();
    page.locator('button:has-text("Continue")').click();
    await expect(page).toHaveURL('/submission/create/statement');

    page.locator('button:has-text("Submit")').click();

    await expect(page).toHaveURL('/submission/create/success');
    page.locator('button:has-text("Back to Explore")').click();
    await expect(page).toHaveURL('/');
  });
});
