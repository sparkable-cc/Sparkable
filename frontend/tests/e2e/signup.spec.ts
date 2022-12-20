import { test, expect } from '@playwright/test'

test.describe('Sign Up', () => {
  const randomUsername= Math.random().toString(20).substr(2, 10)

  test('should register a user', async ({ page }) => {
    await page.goto('/signup')

    await page.getByLabel('email').fill(randomUsername + '@admin.com')
    await page.getByLabel('username').fill(randomUsername)
    await page.getByLabel('password').fill('12345678')
    await page.click('button')

    await expect(page.locator('#error')).toContainText('User created!')
    await expect(page).toHaveURL('/')
  })

  test('should error if the user exists', async ({ page }) => {
    await page.goto('/signup')

    await page.getByLabel('email').fill(randomUsername + '@admin.com')
    await page.getByLabel('username').fill(randomUsername)
    await page.getByLabel('password').fill('12345678')
    await page.click('button')

    await expect(page.locator('#error')).toContainText('User exist!')
  })

})