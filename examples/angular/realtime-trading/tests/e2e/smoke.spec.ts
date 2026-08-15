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

test('runs the Angular realtime trading workload', async ({ page }) => {
  const server = await startExampleServer(exampleDir)
  const errors = collectPageErrors(page)

  try {
    await page.goto(server.url)

    const table = page.getByTestId('trading-table')
    const instrumentCount = page.getByTestId('instrument-count-select')
    const virtualScrollMode = page.getByTestId('virtual-scroll-mode')
    const virtualScrollToggle = page.getByTestId('virtual-scroll-toggle')
    await expect(table).toBeVisible()
    await instrumentCount.selectOption('250')
    await expect(virtualScrollMode).toContainText('Full DOM')
    await expect(virtualScrollToggle).toBeEnabled()
    await expect(virtualScrollToggle).not.toBeChecked()
    await expect(table.locator('tbody tr')).toHaveCount(250)
    await expect(table.locator('tbody tr').first()).toHaveCSS(
      'content-visibility',
      'auto',
    )
    await expect(page.getByTestId('virtual-scroll-footer')).toHaveCount(0)
    await virtualScrollToggle.check()
    await expect(virtualScrollMode).toContainText('TanStack Virtual')
    await expect.poll(() => table.locator('tbody tr').count()).toBeLessThan(250)
    await expect(table.locator('tbody tr').first()).toHaveCSS(
      'content-visibility',
      'auto',
    )
    await expect(page.getByTestId('virtual-scroll-footer')).toBeVisible()
    await virtualScrollToggle.uncheck()
    await expect(virtualScrollMode).toContainText('Full DOM')
    await instrumentCount.selectOption('1000')
    await expect(virtualScrollMode).toContainText('Full DOM')
    await expect(table.locator('tbody tr')).toHaveCount(1_000)
    await instrumentCount.selectOption('1500')
    await expect(virtualScrollMode).toContainText('TanStack Virtual')
    await expect(virtualScrollToggle).toBeChecked()
    await expect(virtualScrollToggle).toBeDisabled()
    await expect
      .poll(() => table.locator('tbody tr').count())
      .toBeLessThan(1_500)
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
    await instrumentCount.selectOption('250')
    await expect(page.getByTestId('virtual-scroll-footer')).toHaveCount(0)
    await expect(table.locator('tbody tr')).toHaveCount(250)
    await expect(table.locator('thead tr').last().locator('th')).toHaveCount(14)
    await expect(table.locator('thead')).toContainText('Market')
    await expect(table.locator('thead')).toContainText('Bid Vol')
    await expect(table.locator('thead')).toContainText('Intraday')

    const selectionStart = table.locator('tbody tr').nth(0).locator('td').nth(1)
    const selectionEnd = table.locator('tbody tr').nth(2).locator('td').nth(3)
    const selectedSymbol = await table
      .locator('tbody tr')
      .nth(0)
      .getAttribute('data-symbol')
    const selectionStartBox = await selectionStart.boundingBox()
    const selectionEndBox = await selectionEnd.boundingBox()
    if (!selectionStartBox || !selectionEndBox) {
      throw new Error('Expected visible cells for the drag-selection check')
    }
    await page.mouse.move(
      selectionStartBox.x + selectionStartBox.width / 2,
      selectionStartBox.y + selectionStartBox.height / 2,
    )
    await page.mouse.down()
    await page.mouse.move(
      selectionEndBox.x + selectionEndBox.width / 2,
      selectionEndBox.y + selectionEndBox.height / 2,
      { steps: 4 },
    )
    await page.mouse.up()
    await expect(table.locator('td[aria-selected="true"]')).toHaveCount(9)
    await expect(page.getByTestId('selected-instrument')).toContainText(
      selectedSymbol ?? '',
    )

    await expect(page.getByTestId('feed-status')).toHaveText('FEED LIVE')
    await expect(instrumentCount.locator('option[value="150"]')).toHaveCount(1)
    await expect(instrumentCount.locator('option[value="350"]')).toHaveCount(1)
    await expect(instrumentCount.locator('option[value="750"]')).toHaveCount(1)
    await expect(instrumentCount.locator('option[value="1500"]')).toHaveCount(1)

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
    await expect(page.getByTestId('long-frame-count')).toHaveText(
      /^\s*(?:N\/A|\d+)\s*$/,
    )

    const tableWorker = page.getByTestId('table-worker-toggle')
    await expect(tableWorker).toBeEnabled()
    await tableWorker.check()
    await expect(page.getByText('ROW MODEL WORKER ON')).toBeVisible()
    await expect(table.locator('tbody tr')).toHaveCount(250)
    await instrumentCount.selectOption('1500')
    await expect
      .poll(() => table.locator('tbody tr').count())
      .toBeLessThan(1_500)
    await instrumentCount.selectOption('250')
    await expect(table.locator('tbody tr')).toHaveCount(250)
    await page.getByTestId('feed-toggle').click()
    await expect
      .poll(() =>
        page
          .locator('app-worker-trading-table [data-table-worker-pending]')
          .getAttribute('data-table-worker-compute-ms'),
      )
      .not.toBeNull()
    await expect(
      page.locator('app-worker-trading-table [data-table-worker-pending]'),
    ).toHaveAttribute('data-table-worker-pending', 'false')
    await page.getByTestId('feed-toggle').click()
    await tableWorker.uncheck()

    await expect(tableWorker).toBeEnabled()
    await instrumentCount.selectOption('1500')
    await expect
      .poll(() => table.locator('tbody tr').count())
      .toBeLessThan(1_500)
    await expect(page.getByTestId('virtual-scroll-footer')).toBeVisible()
    const firstPrice = table.locator('tbody tr').first().getByRole('button')
    const priceBeforeUpdate = await firstPrice.textContent()
    await expect
      .poll(() => firstPrice.textContent())
      .not.toBe(priceBeforeUpdate)
    await instrumentCount.selectOption('250')
    await expect(table.locator('tbody tr')).toHaveCount(250)

    await page
      .getByLabel(
        'Swap Tick component A ↔ B destroy and recreate when direction changes',
      )
      .check()
    await page.getByTestId('feed-toggle').click()
    await expect(page.getByTestId('feed-toggle')).toHaveText('START FEED')
    await expect(page.getByTestId('feed-status')).toHaveText('FEED PAUSED')

    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})
