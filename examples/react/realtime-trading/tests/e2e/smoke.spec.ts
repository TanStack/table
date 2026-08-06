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

test('runs the same React workload across both table adapters', async ({
  page,
}) => {
  const server = await startExampleServer(exampleDir)
  const errors = collectPageErrors(page)

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

    const table = page.getByRole('table')
    await expect(table).toBeVisible()
    await expect(table.locator('tbody tr')).toHaveCount(250)
    await expect(table.locator('thead th')).toHaveCount(14)
    await expect(table.locator('thead')).toContainText('Ticker')
    await expect(table.locator('thead')).toContainText('Last Qty')
    await expect(table.locator('thead')).toContainText('Traded Value')
    const adapter = page.getByTestId('adapter-select')
    await expect(adapter).toHaveValue('local')
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

    const rowWorkload = page.getByTestId('row-workload-select')
    await rowWorkload.selectOption('rotating-filter')
    await expect(table.locator('tbody tr')).toHaveCount(200)
    await rowWorkload.selectOption('identity-churn')
    await expect(table.locator('tbody tr')).toHaveCount(250)
    await expect(
      table.locator('tbody tr[data-row-id*="-replacement-"]'),
    ).toHaveCount(25)
    await rowWorkload.selectOption('price-sort')
    await expect(table.locator('tbody tr')).toHaveCount(250)
    await rowWorkload.selectOption('stable')

    const coreRowModel = page.getByTestId('core-row-model-select')
    await coreRowModel.selectOption('filter')
    await expect(page.getByTestId('core-filter-input')).toHaveValue('ALP')
    await expect(table.locator('tbody tr')).toHaveCount(21)
    await page.getByTestId('core-filter-input').fill('CRN')
    await expect(table.locator('tbody tr')).toHaveCount(21)
    await coreRowModel.selectOption('none')
    await expect(table.locator('tbody tr')).toHaveCount(250)

    await expect
      .poll(async () => {
        const text = await page.getByTestId('total-events').textContent()
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
        Number(await page.getByTestId('raf-rate').textContent()),
      )
      .toBeGreaterThan(0)
    await expect
      .poll(async () =>
        Number(await page.getByTestId('table-render-rate').textContent()),
      )
      .toBeGreaterThan(0)

    for (const implementation of ['v8', 'local']) {
      await adapter.selectOption(implementation)
      await expect(adapter).toHaveValue(implementation)
      await expect(page.getByRole('table')).toBeVisible()
      await expect(page.locator('tbody tr')).toHaveCount(250)

      await coreRowModel.selectOption('filter')
      await page.getByTestId('core-filter-input').fill('ALP')
      await expect(page.locator('tbody tr')).toHaveCount(21)
      await coreRowModel.selectOption('none')
      await expect(page.locator('tbody tr')).toHaveCount(250)

      const firstPrice = page.locator('tbody tr').first().getByRole('button')
      const priceBeforeUpdate = await firstPrice.textContent()
      await expect
        .poll(() => firstPrice.textContent())
        .not.toBe(priceBeforeUpdate)
    }

    await page.locator('.config-section input[type="checkbox"]').first().check()
    await page.getByTestId('feed-toggle').click()
    await expect(page.getByTestId('feed-toggle')).toHaveText('START FEED')
    await expect(page.getByTestId('feed-status')).toHaveText('FEED PAUSED')

    await coreRowModel.selectOption('sort')
    const sortedPrices = await table.locator('tbody tr').evaluateAll((rows) =>
      rows.map((row) =>
        Number(row.querySelector<HTMLButtonElement>('.price-button')?.textContent),
      ),
    )
    expect(sortedPrices).toEqual([...sortedPrices].sort((a, b) => b - a))

    await instrumentCount.selectOption('750')
    await expect(table.locator('tbody tr')).toHaveCount(750)
    await page.getByTestId('scroll-stress-select').selectOption('vertical')
    await expect
      .poll(() =>
        page
          .locator('.table-scroll')
          .evaluate((element) => element.scrollTop),
      )
      .toBeGreaterThan(0)
    await expect
      .poll(async () =>
        Number(
          (await page.getByTestId('scroll-pressure-rate').textContent())
            ?.split('/')[0]
            .trim(),
        ),
      )
      .toBeGreaterThan(0)
    await page.getByTestId('scroll-stress-select').selectOption('off')

    await expect
      .poll(async () =>
        Number(await page.getByTestId('profiler-commit-rate').textContent()),
      )
      .toBeGreaterThan(0)
    expect(
      await page.evaluate(
        () =>
          performance.getEntriesByName('react-profiler-commit').length > 0 &&
          performance.getEntriesByName('tanstack-row-model').length > 0,
      ),
    ).toBe(true)

    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})
