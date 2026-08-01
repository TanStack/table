import path from 'node:path'
import { expect, test } from '@playwright/test'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'
import type { Page } from '@playwright/test'

const exampleDir = path.resolve()

const TOTAL_ROWS = 5_000

/** Header cell index per column, matching the column order in `src/main.tsrx`. */
const COLUMN = {
  rowNumber: 0,
  firstName: 1,
  lastName: 2,
  fullName: 3,
  age: 4,
  visits: 5,
  status: 6,
  progress: 7,
} as const

const STATUSES = ['complicated', 'relationship', 'single']

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

  await page.goto(server.url)

  return errors
}

function headerCell(page: Page, column: keyof typeof COLUMN) {
  return page.locator('thead th').nth(COLUMN[column])
}

function textFilter(page: Page, column: 'firstName' | 'lastName' | 'fullName') {
  return headerCell(page, column).locator('input[type="text"]')
}

function rangeFilter(
  page: Page,
  column: 'age' | 'visits' | 'progress',
  bound: 'Min' | 'Max',
) {
  return headerCell(page, column).getByPlaceholder(bound)
}

function statusFilter(page: Page) {
  return headerCell(page, 'status').locator('select')
}

/** The pre-paginated count, so it reflects filtering but not the page window. */
function rowCountLine(page: Page) {
  return page.getByTestId('row-count')
}

async function readFilteredRowCount(page: Page) {
  const text = await rowCountLine(page).textContent()
  return Number((text ?? '').replace(/\D/g, ''))
}

/** Row data is random faker output, so `table.state` is the stable oracle. */
async function readState(page: Page) {
  const text = await page.getByTestId('table-state').textContent()

  return JSON.parse(text ?? '{}') as {
    columnFilters?: Array<{ id: string; value: unknown }>
    pagination?: { pageIndex: number; pageSize: number }
  }
}

async function readColumnFilters(page: Page) {
  return (await readState(page)).columnFilters ?? []
}

async function expectColumnFilters(
  page: Page,
  expected: Array<{ id: string; value: unknown }>,
) {
  // Every filter control debounces by 500ms, so poll rather than sleeping.
  await expect.poll(() => readColumnFilters(page)).toEqual(expected)
}

async function readBodyColumn(page: Page, column: keyof typeof COLUMN) {
  const cells = await page
    .locator(`tbody tr td:nth-child(${COLUMN[column] + 1})`)
    .allTextContents()

  return cells.map((cell) => cell.trim())
}

async function getFirstBodyRowText(page: Page) {
  const text = await page.locator('tbody tr').first().textContent()
  return text?.replace(/\s+/g, ' ').trim() ?? ''
}

test('renders the table without crashing', async ({ page }) => {
  const errors = await openExample(page)
  const table = page.locator('table').first()

  await expect(table).toBeVisible()
  await expect(table.locator('thead th')).toHaveCount(8)
  await expect(page.locator('tbody tr')).toHaveCount(10)
  await expect(rowCountLine(page)).toHaveText('5,000 Rows')
  await expectColumnFilters(page, [])

  expect(errors).toEqual([])
})

test('regenerates table data', async ({ page }) => {
  const errors = await openExample(page)
  const regenerateButton = page.getByRole('button', {
    name: /^Regenerate Data$/i,
  })

  await expect(page.locator('tbody tr').first()).toBeVisible()

  const firstRowBefore = await getFirstBodyRowText(page)

  await regenerateButton.click()

  await expect.poll(() => getFirstBodyRowText(page)).not.toBe(firstRowBefore)
  await expect(page.locator('tbody tr')).toHaveCount(10)

  expect(errors).toEqual([])
})

test('renders a filter control for every filterable column', async ({
  page,
}) => {
  const errors = await openExample(page)

  // Three text columns, three range columns with a Min and a Max, one select.
  await expect(page.locator('thead input[type="text"]')).toHaveCount(3)
  await expect(page.locator('thead input[type="number"]')).toHaveCount(6)
  await expect(page.locator('thead select')).toHaveCount(1)

  await expect(textFilter(page, 'firstName')).toHaveAttribute(
    'placeholder',
    'Search...',
  )
  await expect(statusFilter(page).locator('option')).toHaveText([
    'All',
    ...STATUSES,
  ])

  // The row number column has no accessor, so it cannot be filtered.
  await expect(
    headerCell(page, 'rowNumber').locator('input, select'),
  ).toHaveCount(0)

  expect(errors).toEqual([])
})

test('filters by text after the debounce', async ({ page }) => {
  const errors = await openExample(page)

  // A fragment of a name that is actually present, so a match is guaranteed
  // even though the data is regenerated randomly on every load.
  const firstNames = await readBodyColumn(page, 'firstName')
  const fragment = (firstNames[0] ?? '').slice(0, 3).toLowerCase()
  expect(fragment).not.toBe('')

  await textFilter(page, 'firstName').fill(fragment)

  await expectColumnFilters(page, [{ id: 'firstName', value: fragment }])

  const filtered = await readFilteredRowCount(page)
  expect(filtered).toBeGreaterThan(0)
  expect(filtered).toBeLessThan(TOTAL_ROWS)

  for (const name of await readBodyColumn(page, 'firstName')) {
    expect(name.toLowerCase()).toContain(fragment)
  }

  // Emptying a text filter drops it from state rather than keeping a blank.
  await textFilter(page, 'firstName').fill('')

  await expectColumnFilters(page, [])
  await expect(rowCountLine(page)).toHaveText('5,000 Rows')

  expect(errors).toEqual([])
})

test('waits for the debounce before applying the filter', async ({ page }) => {
  const errors = await openExample(page)

  await textFilter(page, 'firstName').fill('zzz')

  // The 500ms debounce has not elapsed, so state is still untouched.
  expect(await readColumnFilters(page)).toEqual([])

  await expectColumnFilters(page, [{ id: 'firstName', value: 'zzz' }])

  expect(errors).toEqual([])
})

test('filters a numeric column by range', async ({ page }) => {
  const errors = await openExample(page)

  await rangeFilter(page, 'age', 'Min').fill('20')

  // An unset bound serialises as null, leaving the range open ended.
  await expectColumnFilters(page, [{ id: 'age', value: ['20', null] }])

  const minOnly = await readFilteredRowCount(page)
  expect(minOnly).toBeLessThan(TOTAL_ROWS)

  for (const age of await readBodyColumn(page, 'age')) {
    expect(Number(age)).toBeGreaterThanOrEqual(20)
  }

  await rangeFilter(page, 'age', 'Max').fill('25')

  await expectColumnFilters(page, [{ id: 'age', value: ['20', '25'] }])
  expect(await readFilteredRowCount(page)).toBeLessThan(minOnly)

  for (const age of await readBodyColumn(page, 'age')) {
    expect(Number(age)).toBeGreaterThanOrEqual(20)
    expect(Number(age)).toBeLessThanOrEqual(25)
  }

  // Clearing one bound keeps the filter, with that end left empty.
  await rangeFilter(page, 'age', 'Min').fill('')

  await expectColumnFilters(page, [{ id: 'age', value: ['', '25'] }])

  for (const age of await readBodyColumn(page, 'age')) {
    expect(Number(age)).toBeLessThanOrEqual(25)
  }

  await rangeFilter(page, 'age', 'Max').fill('')

  await expect.poll(() => readFilteredRowCount(page)).toBe(TOTAL_ROWS)

  expect(errors).toEqual([])
})

test('filters by the status select', async ({ page }) => {
  const errors = await openExample(page)
  const counts: Array<number> = []

  for (const status of STATUSES) {
    await statusFilter(page).selectOption(status)

    await expectColumnFilters(page, [{ id: 'status', value: status }])

    for (const cell of await readBodyColumn(page, 'status')) {
      expect(cell).toBe(status)
    }

    counts.push(await readFilteredRowCount(page))
  }

  // Every row has exactly one of the three statuses, so the parts must make up
  // the whole. This holds no matter what the random data happens to be.
  expect(counts.reduce((total, count) => total + count, 0)).toBe(TOTAL_ROWS)

  // The All option carries an empty value, which removes the filter entirely.
  await statusFilter(page).selectOption('')

  await expectColumnFilters(page, [])
  await expect(rowCountLine(page)).toHaveText('5,000 Rows')

  expect(errors).toEqual([])
})

test('combines filters and returns to the first page', async ({ page }) => {
  const errors = await openExample(page)

  await page.getByRole('button', { name: '>', exact: true }).click()
  await page.getByRole('button', { name: '>', exact: true }).click()
  await expect
    .poll(async () => (await readState(page)).pagination?.pageIndex)
    .toBe(2)

  await statusFilter(page).selectOption('single')

  await expectColumnFilters(page, [{ id: 'status', value: 'single' }])
  // `autoResetPageIndex` defaults to true, so filtering rewinds to page one.
  await expect
    .poll(async () => (await readState(page)).pagination?.pageIndex)
    .toBe(0)

  const statusOnly = await readFilteredRowCount(page)

  await rangeFilter(page, 'age', 'Min').fill('20')

  await expectColumnFilters(page, [
    { id: 'status', value: 'single' },
    { id: 'age', value: ['20', null] },
  ])
  // Filters intersect, so adding one can only narrow the result.
  expect(await readFilteredRowCount(page)).toBeLessThanOrEqual(statusOnly)

  for (const cell of await readBodyColumn(page, 'status')) {
    expect(cell).toBe('single')
  }

  for (const age of await readBodyColumn(page, 'age')) {
    expect(Number(age)).toBeGreaterThanOrEqual(20)
  }

  expect(errors).toEqual([])
})
