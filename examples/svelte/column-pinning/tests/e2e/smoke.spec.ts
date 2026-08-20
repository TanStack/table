import path from 'node:path'
import { expect, test } from '@playwright/test'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'
import type { Page } from '@playwright/test'

const exampleDir = path.resolve()

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

/** Header rows run group to leaf, so the leaf row holds the data columns. */
function leafHeaderCells(page: Page) {
  return page.locator('thead tr').last().locator('th')
}

function leafHeader(page: Page, name: string) {
  return leafHeaderCells(page).filter({ hasText: name })
}

/** An unpinned header offers `<=` and `=>`; a pinned one swaps in `X`. */
function pinButton(page: Page, name: string, label: '<=' | 'X' | '=>') {
  return leafHeader(page, name).getByRole('button', {
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

async function readLeafOrder(page: Page) {
  const texts = await leafHeaderCells(page).allTextContents()
  // Strip the pin controls that share the header cell with its label.
  return texts.map((text) => text.replace(/<=|=>|X/g, '').trim())
}

async function getFirstBodyRowText(page: Page) {
  const text = await page.locator('tbody tr').first().textContent()
  return text?.replace(/\s+/g, ' ').trim() ?? ''
}

test('renders the table without crashing', async ({ page }) => {
  const errors = await openExample(page)
  const table = page.locator('table').first()

  await expect(table).toBeVisible()
  await expect(leafHeaderCells(page)).toHaveCount(LEAF_HEADERS.length)
  expect(await readLeafOrder(page)).toEqual(LEAF_HEADERS)
  expect(await readColumnPinning(page)).toEqual({ start: [], end: [] })
  // Nothing is pinned, so every header offers both directions and no unpin.
  await expect(pinButton(page, 'Visits', '<=')).toBeVisible()
  await expect(pinButton(page, 'Visits', '=>')).toBeVisible()
  await expect(pinButton(page, 'Visits', 'X')).toHaveCount(0)

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

  expect(errors).toEqual([])
})

test('pins a column to the start', async ({ page }) => {
  const errors = await openExample(page)

  await pinButton(page, 'Visits', '<=').click()

  await expect
    .poll(async () => (await readColumnPinning(page)).start)
    .toEqual(['visits'])
  // The pinned column jumps to the front, keeping the others in order.
  expect(await readLeafOrder(page)).toEqual([
    'Visits',
    'firstName',
    'Last Name',
    'Age',
    'Status',
    'Profile Progress',
  ])
  // A pinned header drops the direction it already occupies and gains unpin.
  await expect(pinButton(page, 'Visits', '<=')).toHaveCount(0)
  await expect(pinButton(page, 'Visits', 'X')).toBeVisible()
  await expect(pinButton(page, 'Visits', '=>')).toBeVisible()

  expect(errors).toEqual([])
})

test('pins a column to the end', async ({ page }) => {
  const errors = await openExample(page)

  await pinButton(page, 'Age', '=>').click()

  await expect
    .poll(async () => (await readColumnPinning(page)).end)
    .toEqual(['age'])
  expect(await readLeafOrder(page)).toEqual([
    'firstName',
    'Last Name',
    'Visits',
    'Status',
    'Profile Progress',
    'Age',
  ])
  await expect(pinButton(page, 'Age', '=>')).toHaveCount(0)
  await expect(pinButton(page, 'Age', 'X')).toBeVisible()

  expect(errors).toEqual([])
})

test('unpins a column', async ({ page }) => {
  const errors = await openExample(page)

  await pinButton(page, 'Visits', '<=').click()
  await expect
    .poll(async () => (await readColumnPinning(page)).start)
    .toEqual(['visits'])

  await pinButton(page, 'Visits', 'X').click()

  await expect
    .poll(() => readColumnPinning(page))
    .toEqual({ start: [], end: [] })
  // Unpinning restores the column to its declared position.
  expect(await readLeafOrder(page)).toEqual(LEAF_HEADERS)
  await expect(pinButton(page, 'Visits', 'X')).toHaveCount(0)

  expect(errors).toEqual([])
})

test('pins several columns in the order they were clicked', async ({
  page,
}) => {
  const errors = await openExample(page)

  await pinButton(page, 'Visits', '<=').click()
  await expect
    .poll(async () => (await readColumnPinning(page)).start)
    .toEqual(['visits'])

  await pinButton(page, 'Status', '<=').click()

  await expect
    .poll(async () => (await readColumnPinning(page)).start)
    .toEqual(['visits', 'status'])

  await pinButton(page, 'Age', '=>').click()

  await expect
    .poll(async () => (await readColumnPinning(page)).end)
    .toEqual(['age'])
  // Start pins lead, unpinned columns hold the middle, end pins trail.
  expect(await readLeafOrder(page)).toEqual([
    'Visits',
    'Status',
    'firstName',
    'Last Name',
    'Profile Progress',
    'Age',
  ])

  expect(errors).toEqual([])
})
