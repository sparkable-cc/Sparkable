import {expect, test} from '@playwright/test'

const postUrl = process.env.SPARKABLE_BROWSER_POST_URL
const hasFixture = Boolean(
  postUrl && process.env.SPARKABLE_BROWSER_STORAGE_STATE,
)

test.skip(
  !hasFixture,
  'Set a signed-in storage state and a dedicated test post URL',
)

test('reaction picker shows six choices and selecting one updates the post', async ({
  page,
}, testInfo) => {
  if (!postUrl) throw new Error('SPARKABLE_BROWSER_POST_URL is required')
  await page.goto(postUrl)

  const spark = page.getByRole('button', {name: /^Spark \(/}).first()
  await expect(spark).toBeVisible()
  const originalCount = Number(
    (await spark.getAttribute('aria-label'))?.match(/Spark \((\d+)/)?.[1],
  )
  expect(Number.isFinite(originalCount)).toBe(true)

  if (testInfo.project.name === 'desktop-chromium') {
    await spark.hover()
  } else {
    await Promise.all([
      page.waitForResponse(
        response =>
          response.url().includes('/xrpc/com.atproto.repo.createRecord') &&
          response.ok(),
      ),
      spark.tap(),
    ])
  }

  const insight = page.getByRole('button', {name: 'React with Insight'})
  await expect(insight).toBeVisible()
  for (const name of ['Compassion', 'Joy', 'Inspiration', 'Hope', 'Respect']) {
    await expect(
      page.getByRole('button', {name: `React with ${name}`}),
    ).toBeVisible()
  }

  await Promise.all([
    page.waitForResponse(
      response =>
        response
          .url()
          .includes(
            testInfo.project.name === 'desktop-chromium'
              ? '/xrpc/com.atproto.repo.applyWrites'
              : '/xrpc/com.atproto.repo.putRecord',
          ) && response.ok(),
    ),
    insight.click(),
  ])
  await expect(
    page
      .getByRole('button', {
        name: new RegExp(`^Unspark \\(${originalCount + 1} sparks?\\)`),
      })
      .first(),
  ).toBeVisible()

  // Reload to verify the write reached the service, not just optimistic UI.
  await page.reload()
  const unspark = page.getByRole('button', {name: /^Unspark \(/}).first()
  await expect(unspark).toBeVisible()
  if (testInfo.project.name === 'desktop-chromium') await unspark.hover()
  else await unspark.tap()
  const remove = page.getByRole('button', {name: 'Remove Insight reaction'})
  await expect(remove).toBeVisible()
  await Promise.all([
    page.waitForResponse(
      response =>
        response.url().includes('/xrpc/com.atproto.repo.applyWrites') &&
        response.ok(),
    ),
    remove.click(),
  ])
  await expect(
    page
      .getByRole('button', {
        name: new RegExp(`^Spark \\(${originalCount} sparks?\\)`),
      })
      .first(),
  ).toBeVisible()
})
