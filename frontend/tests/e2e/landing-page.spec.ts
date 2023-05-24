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

test('should click the "Sign In" link', async ({ page }) => {
  await page.goto('/');
  await page.locator('text=Sign In').last().click();
  await expect(page).toHaveURL('/auth/signin');
});


test('should click the "Register" link', async ({ page }) => {
  await page.goto('/');
  await page.locator('text=Register').last().click();
  await expect(page).toHaveURL('/auth/signup');
});

test('Explore should have 20 links', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Start Exploring');
  expect(await page.locator('article').count()).toEqual(20);
});
