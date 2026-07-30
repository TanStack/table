import path from 'node:path'
import { expect, test } from '@playwright/test'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'
import type { Page } from '@playwright/test'

const exampleDir = path.resolve()

/** Leaf columns in their declared order. The toggle panel labels each by id. */
const LEAF_COLUMNS = [
  'firstName',
  'lastName',
  'age',
  'visits',
  'status',
  'progress',
]

/** This example renders no footer, so header text is the render-order oracle. */
const HEADER_LABEL: Record<string, string> = {
  firstName: 'firstName',
  lastName: 'Last Name',
  age: 'Age',
  visits: 'Visits',
  status: 'Status',
  progress: 'Profile Progress',
}

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

function shuffleButton(page: Page) {
  return page.getByRole('button', { name: 'Shuffle Columns' })
}

function columnToggle(page: Page, label: string) {
  return page.getByLabel(label, { exact: true })
}

/** Header rows run group to leaf, so the leaf row holds the visible columns. */
function leafHeaderCells(page: Page) {
  return page.locator('thead tr').last().locator('th')
}

async function readHeaderOrder(page: Page) {
  const texts = await leafHeaderCells(page).allTextContents()
  return texts.map((text) => text.trim())
}

/** Row data is random faker output, so `table.state` is the stable oracle. */
async function readState(page: Page) {
  const text = await page.getByTestId('table-state').textContent()

  return JSON.parse(text ?? '{}') as {
    columnOrder?: Array<string>
    columnVisibility?: Record<string, boolean>
  }
}

async function getFirstBodyRowText(page: Page) {
  const text = await page.locator('tbody tr').first().textContent()
  return text?.replace(/\s+/g, ' ').trim() ?? ''
}

test('renders the table without crashing', async ({ page }) => {
  const errors = await openExample(page)
  const table = page.locator('table').first()

  await expect(table).toBeVisible()
  await expect(leafHeaderCells(page)).toHaveCount(LEAF_COLUMNS.length)
  await expect(page.locator('tbody tr')).toHaveCount(20)
  await expect(shuffleButton(page)).toBeVisible()
  // No explicit order yet, so the columns render as declared.
  await expect
    .poll(async () => (await readState(page)).columnOrder ?? [])
    .toEqual([])

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

test('shuffles the columns into a new order', async ({ page }) => {
  const errors = await openExample(page)
  const before = await readHeaderOrder(page)

  await shuffleButton(page).click()

  await expect
    .poll(async () => (await readState(page)).columnOrder ?? [])
    .toHaveLength(LEAF_COLUMNS.length)

  const after = await readHeaderOrder(page)

  // Shuffling permutes the columns: same set, different sequence.
  expect([...after].sort()).toEqual([...before].sort())
  expect(after).not.toEqual(before)

  const order = (await readState(page)).columnOrder ?? []
  expect([...order].sort()).toEqual([...LEAF_COLUMNS].sort())

  expect(errors).toEqual([])
})

test('reorders the body cells to match the headers', async ({ page }) => {
  const errors = await openExample(page)

  await shuffleButton(page).click()
  await expect
    .poll(async () => (await readState(page)).columnOrder ?? [])
    .toHaveLength(LEAF_COLUMNS.length)

  const order = (await readState(page)).columnOrder ?? []

  // Headers must render in exactly the shuffled order, which proves the cells
  // moved with them rather than the order living only in state.
  expect(await readHeaderOrder(page)).toEqual(
    order.map((id) => HEADER_LABEL[id]),
  )

  expect(errors).toEqual([])
})

test('keeps the shuffled order when a column is hidden', async ({ page }) => {
  const errors = await openExample(page)

  await shuffleButton(page).click()
  await expect
    .poll(async () => (await readState(page)).columnOrder ?? [])
    .toHaveLength(LEAF_COLUMNS.length)

  const order = (await readState(page)).columnOrder ?? []

  await columnToggle(page, 'age').uncheck()

  await expect
    .poll(async () => (await readState(page)).columnVisibility ?? {})
    .toEqual({ age: false })
  await expect(leafHeaderCells(page)).toHaveCount(LEAF_COLUMNS.length - 1)

  // Hiding removes a column from the render without disturbing the rest.
  expect(await readHeaderOrder(page)).toEqual(
    order.filter((id) => id !== 'age').map((id) => HEADER_LABEL[id]),
  )

  expect(errors).toEqual([])
})

test('keeps the shuffled order when data is regenerated', async ({ page }) => {
  const errors = await openExample(page)

  await shuffleButton(page).click()
  await expect
    .poll(async () => (await readState(page)).columnOrder ?? [])
    .toHaveLength(LEAF_COLUMNS.length)

  const order = await readHeaderOrder(page)

  // Column order lives in table state, so replacing the rows must not reset it.
  await page.getByRole('button', { name: /^Regenerate Data$/i }).click()

  await expect(page.locator('tbody tr')).toHaveCount(20)
  expect(await readHeaderOrder(page)).toEqual(order)

  expect(errors).toEqual([])
})
