import { expect, test } from '@playwright/test';
import { compose } from 'redux';

test.describe('Sign Up', () => {
  let randomUsername = Math.random().toString(15);
  randomUsername = randomUsername.split('.').join('');

  test('should register a user', async ({ page }) => {
    await page.goto('/auth/signup');

    await page.getByLabel('email').fill(randomUsername + '@admin.com');
    await page.getByLabel('username').fill(randomUsername);
    await page.getByLabel('password').fill('123Asdf#%@');
    await page.click('footer button');

    await expect(page.locator('role=alert').locator('div').nth(-1)).toContainText('User created!');
    await expect(page).toHaveURL('/auth/signin');
  });

  test('should error if the user exists', async ({ page }) => {
    await page.goto('/auth/signup');

    await page.getByLabel('email').fill(randomUsername + '@admin.com');
    await page.getByLabel('username').fill(randomUsername);
    await page.getByLabel('password').fill('123Asdf#%@');
    await page.click('footer button');

    await expect(page.locator('role=alert').locator('div').nth(-1)).toContainText('User exist!');
    await expect(page).toHaveURL('/auth/signup');
  });

});