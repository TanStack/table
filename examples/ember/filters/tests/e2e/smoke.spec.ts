import { expect, test } from '@playwright/test'
import type { Locator, Page } from '@playwright/test'
import path from 'node:path'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'

const exampleDir = path.resolve()

/** Header cell index per column, matching the column order in `application.gts`. */
const COLUMN = {
  rowNumber: 0,
  firstName: 1,
  lastName: 2,
  age: 3,
  visits: 4,
  status: 5,
  progress: 6,
  birthDate: 7,
} as const

let server: Awaited<ReturnType<typeof startExampleServer>> | undefined

test.beforeAll(async () => {
  // One server for the whole file. A cold Vite start costs more than a test.
  test.setTimeout(180_000)
  server = await startExampleServer(exampleDir)
})

test.afterAll(async () => {
  await server?.close()
})

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
  if (!server) throw new Error('Example server failed to start')

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

  return errors
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

function dateRangeFilter(page: Page, bound: 'min' | 'max') {
  return page.locator(`input[aria-label="birthDate ${bound}"]`)
}

/** Row data is random faker output, so the rendered filter state is the oracle. */
async function readColumnFilters(page: Page) {
  const text = await page.locator('pre').textContent()
  return JSON.parse(text ?? '[]') as Array<{ id: string; value: unknown }>
}

async function expectColumnFilters(
  page: Page,
  expected: Array<{ id: string; value: unknown }>,
) {
  await expect.poll(() => readColumnFilters(page)).toEqual(expected)
}

async function readBodyColumn(page: Page, column: keyof typeof COLUMN) {
  const cells = await page
    .locator(`tbody tr td:nth-child(${COLUMN[column] + 1})`)
    .allTextContents()

  return cells.map((cell) => cell.trim())
}

test('renders the table without crashing', async ({ page }) => {
  const errors = await openExample(page)

  const table = getTable(page)
  const bodyRows = getBodyRows(table)

  await expect(table).toBeVisible()
  await expect(getHeaderCells(table)).toHaveCount(8)
  await expect(bodyRows.first()).toBeVisible()

  const regenerateButton = page
    .getByRole('button', { name: /^Regenerate Data$/i })
    .first()

  if ((await regenerateButton.count()) > 0) {
    await expect(regenerateButton).toBeVisible()

    const firstRowBefore = await getFirstBodyRowData(table)

    await regenerateButton.click()

    await expect.poll(() => getFirstBodyRowData(table)).not.toBe(firstRowBefore)
    await expect(bodyRows.first()).toBeVisible()
  }

  expect(errors).toEqual([])
})

test('filters a date column by range', async ({ page }) => {
  const errors = await openExample(page)

  // One min and one max date input, both inside the birthDate header cell.
  await expect(page.locator('thead input[type="date"]')).toHaveCount(2)

  // Cells render ISO dates (YYYY-MM-DD), so string order is date order. Use
  // a bound from the visible data so a match is guaranteed despite random rows.
  const dates = (await readBodyColumn(page, 'birthDate')).sort()
  const minDate = dates[Math.floor(dates.length / 2)]!
  expect(minDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)

  await dateRangeFilter(page, 'min').fill(minDate)

  // An unset bound serialises as null, leaving the range open ended.
  await expectColumnFilters(page, [{ id: 'birthDate', value: [minDate, null] }])

  for (const date of await readBodyColumn(page, 'birthDate')) {
    expect(date >= minDate).toBe(true)
  }

  // The largest visible date keeps the range ordered and non-empty.
  const maxDate = dates[dates.length - 1]!
  await dateRangeFilter(page, 'max').fill(maxDate)

  await expectColumnFilters(page, [
    { id: 'birthDate', value: [minDate, maxDate] },
  ])

  for (const date of await readBodyColumn(page, 'birthDate')) {
    expect(date >= minDate).toBe(true)
    expect(date <= maxDate).toBe(true)
  }

  // Clearing both bounds auto-removes the filter entirely.
  await dateRangeFilter(page, 'min').fill('')
  await dateRangeFilter(page, 'max').fill('')

  await expectColumnFilters(page, [])

  expect(errors).toEqual([])
})
