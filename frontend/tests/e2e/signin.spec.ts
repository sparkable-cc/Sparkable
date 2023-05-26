import { expect, test } from '@playwright/test';

test.describe('Sign In', () => {
  test('should sign in a user', async ({ page }) => {
    await page.goto('/auth/signin');

    await page.getByLabel('username').fill('randomUsername');
    await page.getByLabel('password').fill('123Asdf#%@');
    await page.click('footer button');

    await expect(
      page.locator('role=alert').locator('div').nth(-1),
    ).toContainText('Authorized successfully!');
    await expect(page).toHaveURL('/');
  });

  test('should error if the password is incorrect', async ({ page }) => {
    await page.goto('/auth/signin');

    await page.getByLabel('username').fill('randomUsername');
    await page.getByLabel('password').fill('123Asdf#%@ 2');
    await page.click('footer button');

    await expect(
      page.locator('role=alert').locator('div').nth(-1),
    ).toContainText('Sign in not successful!');
    await expect(page).toHaveURL('/auth/signin');
  });

  test('should error if user is not registered', async ({ page }) => {
    await page.goto('/auth/signin');

    await page.getByLabel('username').fill('randomUsername 3');
    await page.getByLabel('password').fill('123Asdf#%@');
    await page.click('footer button');

    await expect(
      page.locator('role=alert').locator('div').nth(-1),
    ).toContainText('Sign in not successful!');
    await expect(page).toHaveURL('/auth/signin');
  });
});
