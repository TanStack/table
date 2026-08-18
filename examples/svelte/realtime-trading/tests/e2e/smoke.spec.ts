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

test('runs the Svelte realtime trading workload', async ({ page }) => {
  const server = await startExampleServer(exampleDir)
  const errors = collectPageErrors(page)

  try {
    await page.goto(server.url)

    const table = page.getByTestId('trading-table')
    const instrumentCount = page.getByTestId('instrument-count-select')
    const virtualScrollSelect = page.getByTestId('virtual-scroll-select')
    await expect(table).toBeVisible()
    await expect(instrumentCount).toHaveValue('100')
    await expect(page.locator('.brand')).toHaveText('MARKET MONITOR')
    await expect(virtualScrollSelect).toHaveValue('none')
    await expect(virtualScrollSelect).toBeEnabled()
    await expect(table.locator('tbody tr')).toHaveCount(100)
    await expect(table.locator('tbody')).toHaveCSS('user-select', 'none')
    await expect(table.locator('tbody tr').first()).toHaveCSS(
      'content-visibility',
      'auto',
    )
    await expect(page.getByTestId('virtual-scroll-footer')).toHaveCount(0)
    await instrumentCount.selectOption('250')
    await expect(virtualScrollSelect).toHaveValue('tanstack')
    await expect(virtualScrollSelect).toBeEnabled()
    await expect.poll(() => table.locator('tbody tr').count()).toBeLessThan(250)
    await expect(page.getByTestId('virtual-scroll-footer')).toBeVisible()
    await instrumentCount.selectOption('100')
    await expect(virtualScrollSelect).toHaveValue('none')
    await expect(table.locator('tbody tr')).toHaveCount(100)
    await expect(page.getByTestId('virtual-scroll-footer')).toHaveCount(0)
    await virtualScrollSelect.selectOption('tanstack')
    await expect.poll(() => table.locator('tbody tr').count()).toBeLessThan(100)
    await expect(table.locator('tbody tr').first()).toHaveCSS(
      'content-visibility',
      'auto',
    )
    await expect(page.getByTestId('virtual-scroll-footer')).toBeVisible()
    await virtualScrollSelect.selectOption('none')
    await expect(table.locator('tbody tr')).toHaveCount(100)
    await instrumentCount.selectOption('1500')
    await expect(virtualScrollSelect).toHaveValue('tanstack')
    await expect(virtualScrollSelect).toBeDisabled()
    await expect
      .poll(() => table.locator('tbody tr').count())
      .toBeLessThan(1500)
    await expect(page.getByTestId('virtual-scroll-footer')).toContainText(
      'Total · 1500 rows · 14 columns',
    )
    await expect(page.getByTestId('visible-row-range')).toHaveText(
      /^\s*Current · rows 0\.\.\d+\s*$/,
    )
    await table.locator('..').evaluate((element) => {
      element.scrollTop = 2_000
      element.dispatchEvent(new Event('scroll'))
    })
    await expect
      .poll(async () =>
        Number(
          await table
            .locator('tbody tr')
            .first()
            .getAttribute('data-virtual-index'),
        ),
      )
      .toBeGreaterThan(0)
    await expect(page.getByTestId('visible-row-range')).toHaveText(
      /^\s*Current · rows [1-9]\d*\.\.\d+\s*$/,
    )
    await instrumentCount.selectOption('100')
    await expect(page.getByTestId('virtual-scroll-footer')).toHaveCount(0)
    await expect(virtualScrollSelect).toHaveValue('none')
    await expect(virtualScrollSelect).toBeEnabled()
    await expect(table.locator('tbody tr')).toHaveCount(100)
    await expect(table.locator('thead tr')).toHaveCount(2)
    await expect(table.locator('thead tr').last().locator('th')).toHaveCount(14)
    await expect(table.locator('thead')).not.toContainText('Identity')
    await expect(table.locator('thead')).not.toContainText('Market Data')
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
    await expect(instrumentCount.locator('option[value="150"]')).toHaveCount(1)
    await expect(instrumentCount.locator('option[value="350"]')).toHaveCount(1)
    await expect(instrumentCount.locator('option[value="750"]')).toHaveCount(1)

    const targetRateSlider = page.getByTestId('target-rate-slider')
    await expect(targetRateSlider).toHaveAttribute('min', '0')
    await expect(targetRateSlider).toHaveAttribute('max', '9')
    await expect(targetRateSlider).toHaveAttribute('step', '1')
    await expect(targetRateSlider).toHaveValue('6')
    await targetRateSlider.fill('7')
    await expect(page.getByTestId('target-sample-rate')).toContainText(
      '25K samples/s',
    )
    await targetRateSlider.fill('8')
    await expect(page.getByTestId('target-sample-rate')).toContainText(
      '50K samples/s',
    )
    await targetRateSlider.fill('6')

    const sparklineInterval = page.getByTestId(
      'sparkline-sample-interval-select',
    )
    await expect(sparklineInterval).toHaveValue('16')
    await sparklineInterval.selectOption('100')
    await expect(sparklineInterval).toHaveValue('100')
    await sparklineInterval.selectOption('16')

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

    await instrumentCount.selectOption('750')
    await expect.poll(() => table.locator('tbody tr').count()).toBeLessThan(750)
    expect(
      await page.evaluate(
        () => performance.getEntriesByName('tanstack-row-model').length > 0,
      ),
    ).toBe(true)

    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})
