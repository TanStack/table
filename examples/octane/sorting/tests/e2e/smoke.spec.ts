import path from 'node:path'
import { expect, test } from '@playwright/test'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'
import type { Page } from '@playwright/test'

const exampleDir = path.resolve()

/** Body cell index per column, matching the column order in `src/main.tsrx`. */
const COLUMN = {
  rowNumber: 0,
  firstName: 1,
  lastName: 2,
  email: 3,
  age: 4,
  visits: 5,
  status: 6,
  progress: 7,
  rank: 8,
  createdAt: 9,
} as const

type ColumnName = keyof typeof COLUMN

/** `sortStatusFn` in `src/main.tsrx` orders statuses this way, not alphabetically. */
const STATUS_ORDER = ['single', 'complicated', 'relationship']

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

/** The clickable header, which also carries the title and the sort glyph. */
function sortToggle(page: Page, column: ColumnName) {
  return page
    .locator('thead th')
    .nth(COLUMN[column])
    .locator('.sortable-header')
}

/** Visible body cell text for one column, in render order. */
async function readColumn(page: Page, column: ColumnName) {
  const cells = await page
    .locator(`tbody tr td:nth-child(${COLUMN[column] + 1})`)
    .allTextContents()

  return cells.map((cell) => cell.trim())
}

async function readNumericColumn(page: Page, column: ColumnName) {
  return (await readColumn(page, column)).map(Number)
}

/** Row data is random faker output, so `table.state` is the stable oracle. */
async function readSorting(page: Page) {
  const text = await page.getByTestId('table-state').textContent()
  const state = JSON.parse(text ?? '{}') as {
    sorting?: Array<{ id: string; desc: boolean }>
  }

  return state.sorting ?? []
}

async function expectSorting(
  page: Page,
  expected: Array<{ id: string; desc: boolean }>,
) {
  await expect.poll(() => readSorting(page)).toEqual(expected)
}

async function getFirstBodyRowText(page: Page) {
  const text = await page.locator('tbody tr').first().textContent()
  return text?.replace(/\s+/g, ' ').trim() ?? ''
}

test('renders the table without crashing', async ({ page }) => {
  const errors = await openExample(page)
  const table = page.locator('table').first()

  await expect(table).toBeVisible()
  await expect(table.locator('thead th')).toHaveCount(10)
  // The example renders 1,000 rows but only slices the first ten into the body.
  await expect(table.locator('tbody tr')).toHaveCount(10)
  await expect(page.getByText('1,000 Rows')).toBeVisible()
  await expectSorting(page, [])

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

test('infers the first sort direction from the column value type', async ({
  page,
}) => {
  const errors = await openExample(page)

  // String columns start ascending, every other value type starts descending.
  await expect(sortToggle(page, 'firstName')).toHaveAttribute(
    'title',
    'Sort ascending',
  )
  await expect(sortToggle(page, 'status')).toHaveAttribute(
    'title',
    'Sort ascending',
  )
  await expect(sortToggle(page, 'age')).toHaveAttribute(
    'title',
    'Sort descending',
  )
  await expect(sortToggle(page, 'createdAt')).toHaveAttribute(
    'title',
    'Sort descending',
  )

  // `sortDescFirst: false` overrides the inference on a nullable string column,
  // where the first row's value may be undefined and defeat auto detection.
  await expect(sortToggle(page, 'lastName')).toHaveAttribute(
    'title',
    'Sort ascending',
  )

  // The row number column has no accessor, so it cannot sort.
  await expect(sortToggle(page, 'rowNumber')).toHaveCount(0)

  expect(errors).toEqual([])
})

test('cycles a string column ascending, descending, then clears', async ({
  page,
}) => {
  const errors = await openExample(page)
  const toggle = sortToggle(page, 'firstName')

  await toggle.click()
  await expectSorting(page, [{ id: 'firstName', desc: false }])
  await expect(toggle).toContainText('🔼')
  await expect(toggle).toHaveAttribute('title', 'Sort descending')

  await toggle.click()
  await expectSorting(page, [{ id: 'firstName', desc: true }])
  await expect(toggle).toContainText('🔽')
  await expect(toggle).toHaveAttribute('title', 'Clear sort')

  await toggle.click()
  await expectSorting(page, [])
  await expect(toggle).not.toContainText('🔼')
  await expect(toggle).not.toContainText('🔽')
  await expect(toggle).toHaveAttribute('title', 'Sort ascending')

  expect(errors).toEqual([])
})

test('starts a numeric column descending', async ({ page }) => {
  const errors = await openExample(page)
  const toggle = sortToggle(page, 'age')

  await toggle.click()
  await expectSorting(page, [{ id: 'age', desc: true }])
  await expect(toggle).toContainText('🔽')

  await toggle.click()
  await expectSorting(page, [{ id: 'age', desc: false }])
  await expect(toggle).toContainText('🔼')

  await toggle.click()
  await expectSorting(page, [])

  expect(errors).toEqual([])
})

test('reorders rows to match the sorted column', async ({ page }) => {
  const errors = await openExample(page)
  const toggle = sortToggle(page, 'age')
  const unsorted = await readNumericColumn(page, 'age')

  await toggle.click()
  await expect(toggle).toContainText('🔽')

  const descending = await readNumericColumn(page, 'age')
  expect(descending).toEqual([...descending].sort((a, b) => b - a))
  // The top row now holds the maximum across all 1,000 rows, which is at least
  // the maximum of the ten that happened to be visible before sorting.
  expect(descending[0]).toBeGreaterThanOrEqual(Math.max(...unsorted))

  await toggle.click()
  await expect(toggle).toContainText('🔼')

  const ascending = await readNumericColumn(page, 'age')
  expect(ascending).toEqual([...ascending].sort((a, b) => a - b))
  expect(ascending[0]).toBeLessThanOrEqual(Math.min(...unsorted))

  expect(errors).toEqual([])
})

test('inverts the rendered order on the Rank column', async ({ page }) => {
  const errors = await openExample(page)
  const toggle = sortToggle(page, 'rank')
  const unsorted = await readNumericColumn(page, 'rank')

  await toggle.click()
  await expectSorting(page, [{ id: 'rank', desc: true }])
  await expect(toggle).toContainText('🔽')

  // `invertSorting: true` flips the comparison after the descending flip, so a
  // column marked descending renders ascending values. Golf scores, not typos.
  const ranks = await readNumericColumn(page, 'rank')
  expect(ranks).toEqual([...ranks].sort((a, b) => a - b))
  expect(ranks[0]).toBeLessThanOrEqual(Math.min(...unsorted))

  expect(errors).toEqual([])
})

test('keeps undefined values last in both sort directions', async ({
  page,
}) => {
  const errors = await openExample(page)
  const toggle = sortToggle(page, 'lastName')

  // Roughly a tenth of the 1,000 rows have an undefined last name. The default
  // `sortUndefined` would surface them at one end; `'last'` pins them to the
  // bottom regardless of direction, so neither direction shows a blank cell.
  await toggle.click()
  await expect(toggle).toContainText('🔼')

  const ascending = await readColumn(page, 'lastName')
  expect(ascending).toHaveLength(10)
  expect(ascending.filter((name) => name === '')).toEqual([])

  await toggle.click()
  await expect(toggle).toContainText('🔽')

  const descending = await readColumn(page, 'lastName')
  expect(descending).toHaveLength(10)
  expect(descending.filter((name) => name === '')).toEqual([])

  expect(errors).toEqual([])
})

test('sorts by a custom sort function', async ({ page }) => {
  const errors = await openExample(page)
  const toggle = sortToggle(page, 'status')

  // Ascending puts `single` first. An alphanumeric fallback would put
  // `complicated` there instead, so this fails if `sortStatusFn` is dropped.
  await toggle.click()
  await expectSorting(page, [{ id: 'status', desc: false }])
  await expect(toggle).toContainText('🔼')

  const ascending = await readColumn(page, 'status')
  expect([...new Set(ascending)]).toEqual([STATUS_ORDER[0]])

  await toggle.click()
  await expect(toggle).toContainText('🔽')

  const descending = await readColumn(page, 'status')
  expect([...new Set(descending)]).toEqual([STATUS_ORDER[2]])

  expect(errors).toEqual([])
})

test('multi-sorts with Shift-click', async ({ page }) => {
  const errors = await openExample(page)

  await sortToggle(page, 'status').click()
  await expectSorting(page, [{ id: 'status', desc: false }])

  // Shift appends a column rather than replacing the sort.
  await sortToggle(page, 'age').click({ modifiers: ['Shift'] })
  await expectSorting(page, [
    { id: 'status', desc: false },
    { id: 'age', desc: true },
  ])
  await expect(sortToggle(page, 'status')).toContainText('🔼')
  await expect(sortToggle(page, 'age')).toContainText('🔽')

  // A shifted column runs its own asc/desc/remove cycle.
  await sortToggle(page, 'age').click({ modifiers: ['Shift'] })
  await expectSorting(page, [
    { id: 'status', desc: false },
    { id: 'age', desc: false },
  ])

  await sortToggle(page, 'age').click({ modifiers: ['Shift'] })
  await expectSorting(page, [{ id: 'status', desc: false }])

  // An unshifted click on another column replaces the whole sort.
  await sortToggle(page, 'firstName').click()
  await expectSorting(page, [{ id: 'firstName', desc: false }])

  expect(errors).toEqual([])
})
