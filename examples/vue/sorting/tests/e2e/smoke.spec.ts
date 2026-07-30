import path from 'node:path'
import { expect, test } from '@playwright/test'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'
import type { Page } from '@playwright/test'

const exampleDir = path.resolve()

/**
 * Leaf cell index per column. This example nests its columns under `Name` and
 * `Info` groups, so the leaf header row is the last of the three.
 */
const COLUMN = {
  rowNumber: 0,
  firstName: 1,
  lastName: 2,
  email: 3,
  age: 4,
  visits: 5,
  status: 6,
  progress: 7,
} as const

type ColumnName = keyof typeof COLUMN

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

function leafHeaderCells(page: Page) {
  return page.locator('thead tr').last().locator('th')
}

/** This example puts the sortable class and click handler on the `th` itself. */
function sortToggle(page: Page, column: ColumnName) {
  return leafHeaderCells(page).nth(COLUMN[column])
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

/** Row data is random faker output, so the table store is the stable oracle. */
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
  // A flat header row over eight leaves.
  await expect(leafHeaderCells(page)).toHaveCount(8)
  // The row number column has no accessor, so it cannot sort.
  await expect(page.locator('.sortable-header')).toHaveCount(7)
  // The example holds 1,000 rows but only slices the first ten into the body.
  await expect(page.locator('tbody tr')).toHaveCount(10)
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

test('cycles a string column ascending, descending, then clears', async ({
  page,
}) => {
  const errors = await openExample(page)
  const toggle = sortToggle(page, 'firstName')

  await toggle.click()
  await expectSorting(page, [{ id: 'firstName', desc: false }])
  await expect(toggle).toContainText('🔼')

  await toggle.click()
  await expectSorting(page, [{ id: 'firstName', desc: true }])
  await expect(toggle).toContainText('🔽')

  await toggle.click()
  await expectSorting(page, [])
  await expect(toggle).not.toContainText('🔼')
  await expect(toggle).not.toContainText('🔽')

  expect(errors).toEqual([])
})

test('starts a numeric column descending', async ({ page }) => {
  const errors = await openExample(page)
  const toggle = sortToggle(page, 'age')

  // Sort direction is inferred from the value type: strings start ascending,
  // every other type starts descending.
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

test('sorts a string column alphabetically', async ({ page }) => {
  const errors = await openExample(page)
  const toggle = sortToggle(page, 'email')

  await toggle.click()
  await expectSorting(page, [{ id: 'email', desc: false }])

  // This column registers `sortFn: 'alphanumeric'`, so the rendered order has
  // to be non-decreasing.
  const ascending = await readColumn(page, 'email')
  expect(ascending).toEqual([...ascending].sort())

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

  // A shifted column runs its own ascending, descending, remove cycle.
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
