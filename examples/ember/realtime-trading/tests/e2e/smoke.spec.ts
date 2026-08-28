import path from 'node:path'
import { expect, test } from '@playwright/test'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'
import { pausedFeedUrl } from '../../../../../tests/e2e/helpers/setRangeValue'
import type { Page } from '@playwright/test'

const exampleDir = path.resolve()

let server: Awaited<ReturnType<typeof startExampleServer>>

function collectPageErrors(page: Page) {
  const errors: Array<string> = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  return errors
}

test.beforeAll(async () => {
  test.setTimeout(120_000)
  server = await startExampleServer(exampleDir)
  await fetch(pausedFeedUrl(server.url))
})

test.afterAll(async () => {
  await server.close()
})

test('loads the Ember realtime trading table', async ({ page }) => {
  test.setTimeout(60_000)
  const errors = collectPageErrors(page)

  await page.goto(pausedFeedUrl(server.url))

  const table = page.getByTestId('trading-table')
  await expect(table).toBeVisible()
  await expect(page.locator('.brand')).toHaveText('MARKET MONITOR')
  await expect(table.locator('tbody tr')).toHaveCount(100)
  await expect(table.locator('thead tr')).toHaveCount(2)
  await expect(table.locator('thead tr').last().locator('th')).toHaveCount(14)
  await expect(table.locator('thead')).toContainText('Market')
  await expect(table.locator('thead')).toContainText('Bid Vol')
  await expect(table.locator('thead')).toContainText('Intraday')

  const selectedRow = table.locator('tbody tr').first()
  const selectedSymbol = await selectedRow.getAttribute('data-symbol')
  await selectedRow.locator('td').nth(1).click()
  await expect(page.getByTestId('selected-instrument')).toContainText(
    selectedSymbol ?? '',
  )

  expect(
    await page.evaluate(
      () => performance.getEntriesByName('tanstack-row-model').length > 0,
    ),
  ).toBe(true)
  expect(errors).toEqual([])
})
