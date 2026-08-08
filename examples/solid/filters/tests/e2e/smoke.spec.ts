import path from 'node:path'
import { expect, test } from '@playwright/test'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'
import type { Locator, Page } from '@playwright/test'

const exampleDir = path.resolve()

const TOTAL_ROWS = 1_000

/** birthDate is the last leaf column, matching the column order in `src/App.tsx`. */
const BIRTH_DATE_COLUMN = 8

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

async function readBirthDates(page: Page) {
  const cells = await page
    .locator(`tbody tr td:nth-child(${BIRTH_DATE_COLUMN})`)
    .allTextContents()

  return cells.map((cell) => cell.trim())
}

/** Row data is random faker output, so the rendered table state is the stable oracle. */
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
  // Every filter control debounces by 500ms, so poll rather than sleeping.
  await expect.poll(() => readColumnFilters(page)).toEqual(expected)
}

/** The pre-paginated count, so it reflects filtering but not the page window. */
async function readFilteredRowCount(page: Page) {
  const text = await page
    .locator('div')
    .filter({ hasText: /^Showing [\d,]+ of [\d,]+ Rows$/ })
    .textContent()
  const match = /of ([\d,]+) Rows/.exec(text ?? '')

  return Number((match?.[1] ?? '').replace(/,/g, ''))
}

test('renders the table without crashing', async ({ page }) => {
  const errors = await openExample(page)

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

    await expect.poll(() => getFirstBodyRowData(table)).not.toBe(firstRowBefore)
    await expect(bodyRows.first()).toBeVisible()
  }

  expect(errors).toEqual([])
})

test('filters a date column by range', async ({ page }) => {
  const errors = await openExample(page)

  await expect(getBodyRows(getTable(page)).first()).toBeVisible()
  await expect(dateRangeFilter(page, 'min')).toHaveCount(1)
  await expect(dateRangeFilter(page, 'max')).toHaveCount(1)

  // Cells render ISO dates (YYYY-MM-DD), so string order is date order. Use
  // a bound from the visible data so a match is guaranteed despite random rows.
  const dates = (await readBirthDates(page)).sort()
  const minDate = dates[Math.floor(dates.length / 2)]!
  expect(minDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)

  await dateRangeFilter(page, 'min').fill(minDate)

  // An unset bound serialises as null, leaving the range open ended.
  await expectColumnFilters(page, [{ id: 'birthDate', value: [minDate, null] }])

  const minOnly = await readFilteredRowCount(page)
  expect(minOnly).toBeGreaterThan(0)
  expect(minOnly).toBeLessThan(TOTAL_ROWS)

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

  // Clearing both bounds auto-removes the filter entirely. Both inputs share
  // one debouncer, so wait for each cleared bound to land before the next.
  await dateRangeFilter(page, 'min').fill('')

  await expectColumnFilters(page, [{ id: 'birthDate', value: ['', maxDate] }])

  await dateRangeFilter(page, 'max').fill('')

  await expectColumnFilters(page, [])
  await expect.poll(() => readFilteredRowCount(page)).toBe(TOTAL_ROWS)

  expect(errors).toEqual([])
})
