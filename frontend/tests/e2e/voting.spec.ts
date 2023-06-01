import { expect, test } from '@playwright/test';

test.describe('Voting', () => {
  test('should vote on a submission', async ({ page }) => {
    // sign in
    await page.goto('/auth/signin');
    await page.getByLabel('username').fill('randomUsername');
    await page.getByLabel('password').fill('123Asdf#%@');
    await page.click('footer button');

    await expect(page).toHaveURL('/');

    //click on an article
    await page.locator('text=Start Exploring').click();
    await expect(page).toHaveURL('/#explore');

    //locate a link

    //open on a link

    // await page.locator('text=Butterfy').click();
    // await expect(page).toHaveURL('/article/21');

    // await page.locator('text=Open').click();

    // click on voting banner
    await page.locator('text=Vote Now').click();
    await expect(page).toHaveURL('/voting/participate');
    await page.locator('text=Start').click();
    await expect(page).toHaveURL('/voting/participate/list');
  });
});
