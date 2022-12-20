import { test, expect } from '@playwright/test'

test('should should show a list of 10 links', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('#results')).toContainText('10 results')
})

test('should navigate to the login page', async ({ page }) => {
    await page.goto('/')

    await page.click('text=Login')

    await expect(page).toHaveURL('/signin')
    await expect(page.locator('h1')).toContainText('Sign in')
})

test('should navigate to the about page', async ({ page }) => {
  await page.goto('/')

  await page.click('text=Read more')

  await expect(page).toHaveURL('/about')
  await expect(page.locator('#exploring')).toContainText('Start Exploring')
})