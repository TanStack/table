import path from 'node:path'
import { expect, test } from '@playwright/test'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'
import type { Page } from '@playwright/test'

const exampleDir = path.resolve()

function collectPageErrors(page: Page) {
  const errors: Array<string> = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  return errors
}

test('runs the Solid realtime trading workload', async ({ page }) => {
  const server = await startExampleServer(exampleDir)
  const errors = collectPageErrors(page)

  try {
    await page.goto(server.url)

    const table = page.getByTestId('trading-table')
    await expect(table).toBeVisible()
    await expect(table.locator('tbody tr')).toHaveCount(250)
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
    await expect(page.getByTestId('feed-status')).toHaveText('FEED LIVE')
    const instrumentCount = page.getByTestId('instrument-count-select')
    await expect(instrumentCount.locator('option[value="150"]')).toHaveCount(1)
    await expect(instrumentCount.locator('option[value="350"]')).toHaveCount(1)
    await expect(instrumentCount.locator('option[value="750"]')).toHaveCount(1)

    const loadProfile = page.getByTestId('load-profile-select')
    await expect(loadProfile).toHaveValue('high')
    await loadProfile.selectOption('very-high')
    await expect(page.getByTestId('target-rate-slider')).toHaveValue('25000')
    await loadProfile.selectOption('high')

    const sparklineInterval = page.getByTestId(
      'sparkline-sample-interval-select',
    )
    await expect(sparklineInterval).toHaveValue('250')
    await sparklineInterval.selectOption('500')
    await expect(sparklineInterval).toHaveValue('500')
    await sparklineInterval.selectOption('250')

    const publishInterval = page.getByTestId('publish-interval-select')
    await expect(publishInterval.locator('option[value="500"]')).toHaveCount(1)
    await expect(publishInterval.locator('option[value="1000"]')).toHaveCount(1)

    await expect
      .poll(async () => {
        const text = await page.getByTestId('row-update-rate').textContent()
        return Number(text?.replace(/\D/g, '') ?? 0)
      })
      .toBeGreaterThan(0)
    await expect
      .poll(async () => {
        const text = await page.getByTestId('worker-messages').textContent()
        return Number(text?.replace(/\D/g, '') ?? 0)
      })
      .toBeGreaterThan(0)
    await expect
      .poll(async () =>
        Number(await page.getByTestId('message-rate').textContent()),
      )
      .toBeGreaterThan(0)
    await expect
      .poll(async () =>
        Number(await page.getByTestId('table-render-rate').textContent()),
      )
      .toBeGreaterThan(0)

    const firstPrice = page.locator('tbody tr').first().getByRole('button')
    const priceBeforeUpdate = await firstPrice.textContent()
    await expect
      .poll(() => firstPrice.textContent())
      .not.toBe(priceBeforeUpdate)

    await page.locator('.config-section input[type="checkbox"]').first().check()
    await page.getByTestId('feed-toggle').click()
    await expect(page.getByTestId('feed-toggle')).toHaveText('START FEED')
    await expect(page.getByTestId('feed-status')).toHaveText('FEED PAUSED')

    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})
