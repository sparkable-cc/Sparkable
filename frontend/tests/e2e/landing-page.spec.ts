/* eslint-disable quotes */
import { expect, test } from '@playwright/test';

test('should click the learn more link', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Learn more');
  await expect(page).toHaveURL('/about');
});

test('should click the "Start Exploring" button', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Start Exploring');
  await expect(page).toHaveURL('/#explore');
});

test('should click the "Join Now" link', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Join Now', { force: true });
  await expect(page).toHaveURL('/auth/signup');
});

test('should click the "Sign In" link', async ({ page }) => {
  await page.goto('/');
  await page.locator('text=Sign In').last().click();
  await expect(page).toHaveURL('/auth/signin');
});

test('Explore should have 10 links', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Start Exploring');
  expect(await page.locator('article').count()).toEqual(10);
});
