import { expect, test } from '@playwright/test';

test.describe('Submit', () => {
  test('should submit a link', async ({ page }) => {
    // sign in
    await page.goto('/auth/signin');
    await page.getByLabel('username').fill('randomUsername');
    await page.getByLabel('password').fill('123Asdf#%@');
    await page.click('footer button');

    await expect(page).toHaveURL('/');

    await page.goto('/submission/create');
    await page.locator('text=start').click();
    await expect(page).toHaveURL('/submission/create/link');

    // paste url into input
    await page.locator('input[name="link"]').fill('https://www.google.com');
    await page.locator('text=continue').click();
    await expect(page).toHaveURL('/submission/create/category');

    // pick one category
    // await page.locator('Society').click();
    // await page.locator('text=continue').click();
    // await expect(page).toHaveURL('/submission/create/statement');

    // fill statement
    // await page
    //   .locator('textarea[name="statement"]')
    //   .fill('This is a statement');
    // await page.locator('text=Submit').click();

    // click on continue
    // await expect(page).toHaveURL('/submission/create/success');
    // await page.locator('text=Back to Explore').click();
    // await expect(page).toHaveURL('/');
  });
});
