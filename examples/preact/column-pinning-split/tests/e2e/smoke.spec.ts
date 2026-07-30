import path from 'node:path'
import { expect, test } from '@playwright/test'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'
import type { Page } from '@playwright/test'

const exampleDir = path.resolve()

const LEAF_COUNT = 6

/** The three tables render the start pinned, unpinned and end pinned columns. */
const START_TABLE = 0
const CENTER_TABLE = 1
const END_TABLE = 2

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

function tableAt(page: Page, index: number) {
  return page.locator('table.outlined-table').nth(index)
}

/** Header rows run group to leaf, so the leaf row holds the data columns. */
function leafHeaderCells(page: Page, tableIndex: number) {
  return tableAt(page, tableIndex).locator('thead tr').last().locator('th')
}

function leafHeader(page: Page, tableIndex: number, name: string) {
  return leafHeaderCells(page, tableIndex).filter({ hasText: name })
}

/** An unpinned header offers `<=` and `=>`; a pinned one swaps in `X`. */
function pinButton(
  page: Page,
  tableIndex: number,
  name: string,
  label: '<=' | 'X' | '=>',
) {
  return leafHeader(page, tableIndex, name).getByRole('button', {
    name: label,
    exact: true,
  })
}

/** Row data is random faker output, so `table.state` is the stable oracle. */
async function readColumnPinning(page: Page) {
  const text = await page.getByTestId('table-state').textContent()
  const state = JSON.parse(text ?? '{}') as {
    columnPinning?: { start?: Array<string>; end?: Array<string> }
  }

  return {
    start: state.columnPinning?.start ?? [],
    end: state.columnPinning?.end ?? [],
  }
}

async function leafCount(page: Page, tableIndex: number) {
  return leafHeaderCells(page, tableIndex).count()
}

async function getFirstBodyRowText(page: Page) {
  const text = await tableAt(page, CENTER_TABLE)
    .locator('tbody tr')
    .first()
    .textContent()
  return text?.replace(/\s+/g, ' ').trim() ?? ''
}

test('renders the table without crashing', async ({ page }) => {
  const errors = await openExample(page)

  // One table per pinning region, even when two of them are empty.
  await expect(page.locator('table.outlined-table')).toHaveCount(3)
  expect(await readColumnPinning(page)).toEqual({ start: [], end: [] })
  // Nothing is pinned, so every column lives in the centre table.
  expect(await leafCount(page, START_TABLE)).toBe(0)
  expect(await leafCount(page, CENTER_TABLE)).toBe(LEAF_COUNT)
  expect(await leafCount(page, END_TABLE)).toBe(0)

  expect(errors).toEqual([])
})

test('regenerates table data', async ({ page }) => {
  const errors = await openExample(page)
  const regenerateButton = page.getByRole('button', {
    name: /^Regenerate Data$/i,
  })

  await expect(
    tableAt(page, CENTER_TABLE).locator('tbody tr').first(),
  ).toBeVisible()

  const firstRowBefore = await getFirstBodyRowText(page)

  await regenerateButton.click()

  await expect.poll(() => getFirstBodyRowText(page)).not.toBe(firstRowBefore)

  expect(errors).toEqual([])
})

test('moves a column into the start table when pinned', async ({ page }) => {
  const errors = await openExample(page)

  await pinButton(page, CENTER_TABLE, 'Visits', '<=').click()

  await expect
    .poll(async () => (await readColumnPinning(page)).start)
    .toEqual(['visits'])
  // The column leaves the centre table and appears in the start table, so the
  // split is driven by pinning state rather than by a separate column list.
  await expect.poll(() => leafCount(page, START_TABLE)).toBe(1)
  expect(await leafCount(page, CENTER_TABLE)).toBe(LEAF_COUNT - 1)
  await expect(leafHeaderCells(page, START_TABLE)).toContainText(['Visits'])
  await expect(leafHeaderCells(page, CENTER_TABLE)).not.toContainText([
    'Visits',
  ])

  expect(errors).toEqual([])
})

test('moves a column into the end table when pinned', async ({ page }) => {
  const errors = await openExample(page)

  await pinButton(page, CENTER_TABLE, 'Age', '=>').click()

  await expect
    .poll(async () => (await readColumnPinning(page)).end)
    .toEqual(['age'])
  await expect.poll(() => leafCount(page, END_TABLE)).toBe(1)
  expect(await leafCount(page, CENTER_TABLE)).toBe(LEAF_COUNT - 1)
  await expect(leafHeaderCells(page, END_TABLE)).toContainText(['Age'])

  expect(errors).toEqual([])
})

test('returns a column to the centre table when unpinned', async ({ page }) => {
  const errors = await openExample(page)

  await pinButton(page, CENTER_TABLE, 'Visits', '<=').click()
  await expect.poll(() => leafCount(page, START_TABLE)).toBe(1)

  await pinButton(page, START_TABLE, 'Visits', 'X').click()

  await expect
    .poll(() => readColumnPinning(page))
    .toEqual({ start: [], end: [] })
  await expect.poll(() => leafCount(page, START_TABLE)).toBe(0)
  expect(await leafCount(page, CENTER_TABLE)).toBe(LEAF_COUNT)

  expect(errors).toEqual([])
})

test('keeps every table showing the same rows', async ({ page }) => {
  const errors = await openExample(page)

  await pinButton(page, CENTER_TABLE, 'Visits', '<=').click()
  await expect.poll(() => leafCount(page, START_TABLE)).toBe(1)
  await pinButton(page, CENTER_TABLE, 'Age', '=>').click()
  await expect.poll(() => leafCount(page, END_TABLE)).toBe(1)

  // The three tables are one table split three ways, so their bodies must stay
  // row for row aligned or the split would visibly tear.
  const rowCounts = await Promise.all(
    [START_TABLE, CENTER_TABLE, END_TABLE].map((index) =>
      tableAt(page, index).locator('tbody tr').count(),
    ),
  )

  expect(rowCounts[0]).toBeGreaterThan(0)
  expect(rowCounts[1]).toBe(rowCounts[0])
  expect(rowCounts[2]).toBe(rowCounts[0])

  expect(errors).toEqual([])
})
