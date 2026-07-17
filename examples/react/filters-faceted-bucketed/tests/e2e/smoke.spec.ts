import { expect, test } from '@playwright/test'
import path from 'node:path'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'

const exampleDir = path.resolve()

test('renders and filters by a facet bucket', async ({ page }) => {
  const server = await startExampleServer(exampleDir)
  const errors: Array<string> = []

  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })

  try {
    await page.route(
      'https://unpkg.com/react-scan/dist/auto.global.js',
      (route) =>
        route.fulfill({
          contentType: 'application/javascript',
          body: '',
        }),
    )
    await page.goto(server.url)

    const todayCheckbox = page.getByRole('checkbox', { name: /Today/ })
    const todayLabel = page.locator('label').filter({ has: todayCheckbox })
    const todayCount = Number(
      (await todayLabel.locator('.count').textContent())!,
    )

    await expect(
      page.getByRole('heading', { name: 'Bucketed faceted filters' }),
    ).toBeVisible()
    await expect(page.locator('tbody tr')).toHaveCount(10)

    await todayCheckbox.check()

    await expect(todayCheckbox).toBeChecked()
    await expect(
      page.getByText(`${todayCount} Rows`, { exact: true }),
    ).toBeVisible()
    await expect(page.locator('tbody tr')).toHaveCount(Math.min(todayCount, 10))

    const storageCounts = await page
      .locator('.facet-options')
      .nth(1)
      .locator('.count')
      .allTextContents()
    expect(storageCounts.reduce((sum, count) => sum + Number(count), 0)).toBe(
      todayCount,
    )
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})
