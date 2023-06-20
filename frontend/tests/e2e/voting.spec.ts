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
    await page
      .locator('#explore section')
      .getByRole('heading', {
        name: 'In This Nigerian Market, Young Women Find a Place of Their Own',
      })
      .click();

    //open on a link
    await expect(page).toHaveURL('/article/25');
    await page.getByRole('link', { name: 'Open' }).click();

    // go back to home page
    await page.goto('http://localhost:3000/');
    await expect(page).toHaveURL('/');

    // click on voting banner
    await page.locator('text=Vote Now').click();
    await expect(page).toHaveURL('/voting/participate');
    page.locator('button:has-text("Start")').click();
    await expect(page).toHaveURL('/voting/participate/list');

    //click on a link to vote
  });
});
