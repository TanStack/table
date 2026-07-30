import path from 'node:path'
import { expect, test } from '@playwright/test'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'
import type { Page } from '@playwright/test'

const exampleDir = path.resolve()

/** Leaf columns in render order. The toggle panel labels each by column id. */
const LEAF_COLUMNS = [
  'firstName',
  'lastName',
  'age',
  'visits',
  'status',
  'progress',
]

/** Leaf header text differs from column id wherever a custom header is set. */
const LEAF_HEADERS = [
  'firstName',
  'Last Name',
  'Age',
  'Visits',
  'Status',
  'Profile Progress',
]

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

function columnToggle(page: Page, label: string) {
  return page.getByLabel(label, { exact: true })
}

/** Header rows run group to leaf, so the leaf row is last. */
function leafHeaderCells(page: Page) {
  return page.locator('thead tr').last().locator('th')
}

/** Footer groups are the header groups reversed, so the leaf row is first. */
function leafFooterCells(page: Page) {
  return page.locator('tfoot tr').first().locator('th')
}

function groupHeaderCells(page: Page) {
  return page.locator('thead tr').first().locator('th')
}

function firstBodyRowCells(page: Page) {
  return page.locator('tbody tr').first().locator('td')
}

/** Row data is random faker output, so the full state dump is the stable oracle. */
async function readColumnVisibility(page: Page) {
  const text = await page.getByTestId('table-state').textContent()
  const state = JSON.parse(text ?? '{}') as {
    columnVisibility?: Record<string, boolean>
  }

  return state.columnVisibility ?? {}
}

async function expectColumnVisibility(
  page: Page,
  expected: Record<string, boolean>,
) {
  await expect.poll(() => readColumnVisibility(page)).toEqual(expected)
}

async function getFirstBodyRowText(page: Page) {
  const text = await page.locator('tbody tr').first().textContent()
  return text?.replace(/\s+/g, ' ').trim() ?? ''
}

test('renders the table without crashing', async ({ page }) => {
  const errors = await openExample(page)
  const table = page.locator('table').first()

  await expect(table).toBeVisible()
  // Two nested column groups produce three header rows.
  await expect(page.locator('thead tr')).toHaveCount(3)
  await expect(groupHeaderCells(page)).toHaveText(['Name', 'Info'])
  await expect(leafHeaderCells(page)).toHaveText(LEAF_HEADERS)
  await expect(leafFooterCells(page)).toHaveText(LEAF_COLUMNS)
  await expect(page.locator('tbody tr')).toHaveCount(20)
  await expect(firstBodyRowCells(page)).toHaveCount(6)
  await expectColumnVisibility(page, {})

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
  await expect(page.locator('tbody tr')).toHaveCount(20)

  expect(errors).toEqual([])
})

test('renders a toggle for every leaf column', async ({ page }) => {
  const errors = await openExample(page)

  // One checkbox per leaf column plus the panel's Toggle All.
  await expect(page.locator('.column-toggle-panel input')).toHaveCount(7)
  await expect(page.locator('.column-toggle-row label')).toHaveText(
    LEAF_COLUMNS,
  )

  await expect(columnToggle(page, 'Toggle All')).toBeChecked()

  for (const column of LEAF_COLUMNS) {
    await expect(columnToggle(page, column)).toBeChecked()
  }

  expect(errors).toEqual([])
})

test('hides and shows an individual column', async ({ page }) => {
  const errors = await openExample(page)

  await columnToggle(page, 'visits').uncheck()

  await expectColumnVisibility(page, { visits: false })
  await expect(leafHeaderCells(page)).toHaveText(
    LEAF_HEADERS.filter((header) => header !== 'Visits'),
  )
  await expect(firstBodyRowCells(page)).toHaveCount(5)
  await expect(leafFooterCells(page)).toHaveCount(5)
  // Toggle All is driven by `getIsAllColumnsVisible`, so it clears too.
  await expect(columnToggle(page, 'Toggle All')).not.toBeChecked()

  await columnToggle(page, 'visits').check()

  // Re-showing records `true` rather than dropping the key.
  await expectColumnVisibility(page, { visits: true })
  await expect(leafHeaderCells(page)).toHaveText(LEAF_HEADERS)
  await expect(firstBodyRowCells(page)).toHaveCount(6)
  await expect(columnToggle(page, 'Toggle All')).toBeChecked()

  expect(errors).toEqual([])
})

test('removes a header group when all of its columns are hidden', async ({
  page,
}) => {
  const errors = await openExample(page)

  await expect(groupHeaderCells(page)).toHaveText(['Name', 'Info'])

  await columnToggle(page, 'firstName').uncheck()
  await expect(groupHeaderCells(page)).toHaveText(['Name', 'Info'])

  // The group header only disappears once its last child is hidden.
  await columnToggle(page, 'lastName').uncheck()
  await expect(groupHeaderCells(page)).toHaveText(['Info'])
  await expect(leafHeaderCells(page)).toHaveText([
    'Age',
    'Visits',
    'Status',
    'Profile Progress',
  ])
  await expect(firstBodyRowCells(page)).toHaveCount(4)

  await columnToggle(page, 'firstName').check()
  await expect(groupHeaderCells(page)).toHaveText(['Name', 'Info'])

  expect(errors).toEqual([])
})

test('hides and shows every column with Toggle All', async ({ page }) => {
  const errors = await openExample(page)

  await columnToggle(page, 'Toggle All').uncheck()

  await expectColumnVisibility(
    page,
    Object.fromEntries(LEAF_COLUMNS.map((column) => [column, false])),
  )
  await expect(leafHeaderCells(page)).toHaveCount(0)
  await expect(firstBodyRowCells(page)).toHaveCount(0)
  // The rows survive; they simply have no visible cells left to render.
  await expect(page.locator('tbody tr')).toHaveCount(20)

  for (const column of LEAF_COLUMNS) {
    await expect(columnToggle(page, column)).not.toBeChecked()
  }

  await columnToggle(page, 'Toggle All').check()

  await expectColumnVisibility(
    page,
    Object.fromEntries(LEAF_COLUMNS.map((column) => [column, true])),
  )
  await expect(leafHeaderCells(page)).toHaveText(LEAF_HEADERS)
  await expect(firstBodyRowCells(page)).toHaveCount(6)

  expect(errors).toEqual([])
})

test('keeps column visibility when data is regenerated', async ({ page }) => {
  const errors = await openExample(page)

  await columnToggle(page, 'age').uncheck()
  await expect(firstBodyRowCells(page)).toHaveCount(5)

  // Visibility lives in table state, so replacing the rows must not reset it.
  await page.getByRole('button', { name: /^Regenerate Data$/i }).click()

  await expectColumnVisibility(page, { age: false })
  await expect(columnToggle(page, 'age')).not.toBeChecked()
  await expect(firstBodyRowCells(page)).toHaveCount(5)
  await expect(leafHeaderCells(page)).toHaveText(
    LEAF_HEADERS.filter((header) => header !== 'Age'),
  )

  expect(errors).toEqual([])
})
