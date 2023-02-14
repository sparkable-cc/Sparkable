import { test, expect } from '@playwright/test'

test.describe('Sign Up', () => {
  const randomUsername= Math.random().toString(15)

  // test('should register a user', async ({ page }) => {
  //   await page.goto('/auth/signup')

  //   await page.getByLabel('email').fill(randomUsername + '@admin.com')
  //   await page.getByLabel('username').fill(randomUsername)
  //   await page.getByLabel('password').fill('123485678')
  //   await page.click('button[type="submit"]')

  //   await expect(page.locator('#message')).toContainText('User created!')
  //   await expect(page).toHaveURL('/')
  // })

  // test('should error if the user exists', async ({ page }) => {
  //   await page.goto('/auth/signup')

  //   await page.getByLabel('email').fill(randomUsername + '@admin.com')
  //   await page.getByLabel('username').fill(randomUsername)
  //   await page.getByLabel('password').fill('12345678')
  //   await page.click('button[type="submit"]')

  //   await expect(page.locator('#message')).toContainText('User exist!')
  // })

})