import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import {chromium, expect} from '@playwright/test'

const baseUrl = process.env.SPARKABLE_BROWSER_BASE_URL
const handle = process.env.SPARKABLE_TEST_HANDLE
const password = process.env.SPARKABLE_TEST_PASSWORD
const stateFile = process.env.SPARKABLE_BROWSER_STORAGE_STATE

if (!baseUrl || !handle || !password || !stateFile) {
  throw new Error(
    'Browser test URL, handle, password, and storage path are required',
  )
}

;(async () => {
  const browser = await chromium.launch()
  try {
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto(baseUrl)
    await page.getByRole('button', {name: 'Sign in'}).click()
    await page
      .locator('input[aria-label="Username or email address"]')
      .fill(handle)
    await page.locator('input[aria-label="Password"]').fill(password)
    await page.getByRole('button', {name: 'Sign in'}).click()
    await expect(page.getByRole('link', {name: 'Profile'})).toBeVisible({
      timeout: 45_000,
    })
    fs.mkdirSync(path.dirname(stateFile), {recursive: true})
    await context.storageState({path: stateFile, indexedDB: true})
  } finally {
    await browser.close()
  }
})().catch(error => {
  console.error(
    `Browser test sign-in failed: ${error instanceof Error ? error.message : String(error)}`,
  )
  process.exitCode = 1
})
