import {defineConfig, devices} from '@playwright/test'

export default defineConfig({
  testDir: './tests/browser',
  timeout: 90_000,
  expect: {timeout: 20_000},
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  use: {
    baseURL: process.env.SPARKABLE_BROWSER_BASE_URL || 'http://localhost:8081',
    storageState: process.env.SPARKABLE_BROWSER_STORAGE_STATE || undefined,
    trace: process.env.CI ? 'off' : 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {name: 'desktop-chromium', use: {...devices['Desktop Chrome']}},
    {
      name: 'mobile-chromium',
      use: {...devices['iPhone 13'], defaultBrowserType: 'chromium'},
    },
    {name: 'mobile-webkit', use: {...devices['iPhone 13']}},
  ],
})
