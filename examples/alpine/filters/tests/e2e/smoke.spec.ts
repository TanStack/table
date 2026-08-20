import { expect, test } from '@playwright/test'
import type { Locator, Page } from '@playwright/test'
import path from 'node:path'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'

const exampleDir = path.resolve()

function collectPageErrors(page: Page) {
  const errors: Array<string> = []

  page.on('pageerror', (error) => {
    errors.push(error.message)
  })

  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text())
    }
  })

  return errors
}

async function openExample(page: Page) {
  const server = await startExampleServer(exampleDir)
  const errors = collectPageErrors(page)

  await page.route(
    'https://unpkg.com/react-scan/dist/auto.global.js',
    (route) =>
      route.fulfill({
        contentType: 'application/javascript',
        body: '',
      }),
  )

  await page.goto(server.url)

  return { errors, server }
}

function getTable(page: Page) {
  return page
    .locator('table:visible, .divTable:visible')
    .filter({ has: page.locator('thead th, .thead .th') })
    .filter({ has: page.locator('tbody tr, .tbody .tr') })
    .first()
}

function getHeaderCells(table: Locator) {
  return table.locator('thead th, .thead .th')
}

function getBodyRows(table: Locator) {
  return table.locator('tbody tr, .tbody .tr')
}

function dateRangeFilter(page: Page, bound: 'min' | 'max') {
  return page.locator(`thead input[aria-label="birthDate ${bound}"]`)
}

/**
 * The birth date column is the ninth column in `src/main.ts`. Alpine keeps the
 * `x-for` template element in each row, so count cells with `nth-of-type`.
 */
async function readBirthDates(page: Page) {
  const cells = await page
    .locator('tbody tr td:nth-of-type(9)')
    .allTextContents()

  return cells.map((cell) => cell.trim())
}

/** Row data is random faker output, so the table state dump is the oracle. */
async function readColumnFilters(page: Page) {
  const text = await page.getByTestId('table-state').textContent()

  const state = JSON.parse(text ?? '{}') as {
    columnFilters?: Array<{ id: string; value: unknown }>
  }

  return state.columnFilters ?? []
}

async function expectColumnFilters(
  page: Page,
  expected: Array<{ id: string; value: unknown }>,
) {
  await expect.poll(() => readColumnFilters(page)).toEqual(expected)
}

async function getFirstBodyRowData(table: Locator) {
  const row = getBodyRows(table).first()
  const firstInput = row
    .locator('input:not([type="checkbox"]):not([type="radio"])')
    .first()

  if ((await firstInput.count()) > 0 && (await firstInput.isVisible())) {
    return firstInput.inputValue()
  }

  const text = await row.textContent()
  return text?.replace(/\s+/g, ' ').trim() ?? ''
}

test('renders the table without crashing', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    const table = getTable(page)
    const bodyRows = getBodyRows(table)

    await expect(table).toBeVisible()
    await expect(getHeaderCells(table).first()).toBeVisible()
    await expect(bodyRows.first()).toBeVisible()

    const regenerateButton = page
      .getByRole('button', { name: /^Regenerate Data$/i })
      .first()

    if ((await regenerateButton.count()) > 0) {
      await expect(regenerateButton).toBeVisible()

      const firstRowBefore = await getFirstBodyRowData(table)

      await regenerateButton.click()

      await expect
        .poll(() => getFirstBodyRowData(table))
        .not.toBe(firstRowBefore)
      await expect(bodyRows.first()).toBeVisible()
    }

    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('filters a date column by range', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    const table = getTable(page)

    await expect(getBodyRows(table).first()).toBeVisible()

    // One date input per bound renders for the birth date column.
    await expect(page.locator('thead input[type="date"]')).toHaveCount(2)

    // Cells render ISO dates (YYYY-MM-DD), so string order is date order. Use
    // a bound from the visible data so a match is guaranteed despite random rows.
    const dates = (await readBirthDates(page)).sort()
    const minDate = dates[Math.floor(dates.length / 2)]!
    expect(minDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)

    await dateRangeFilter(page, 'min').fill(minDate)

    // An unset bound serialises as null, leaving the range open ended.
    await expectColumnFilters(page, [
      { id: 'birthDate', value: [minDate, null] },
    ])

    for (const date of await readBirthDates(page)) {
      expect(date >= minDate).toBe(true)
    }

    // The largest visible date keeps the range ordered and non-empty.
    const maxDate = dates[dates.length - 1]!
    await dateRangeFilter(page, 'max').fill(maxDate)

    await expectColumnFilters(page, [
      { id: 'birthDate', value: [minDate, maxDate] },
    ])

    for (const date of await readBirthDates(page)) {
      expect(date >= minDate).toBe(true)
      expect(date <= maxDate).toBe(true)
    }

    // Clearing both bounds auto-removes the filter entirely.
    await dateRangeFilter(page, 'min').fill('')
    await dateRangeFilter(page, 'max').fill('')

    await expectColumnFilters(page, [])
    await expect(getBodyRows(table)).toHaveCount(10)

    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})
