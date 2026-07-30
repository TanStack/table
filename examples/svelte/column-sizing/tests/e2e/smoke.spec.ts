import path from 'node:path'
import { expect, test } from '@playwright/test'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'
import type { Page } from '@playwright/test'

const exampleDir = path.resolve()

/** Declared `size` per column, in render order. */
const INITIAL_SIZES: Record<string, number> = {
  firstName: 120,
  lastName: 120,
  age: 100,
  visits: 80,
  status: 200,
  progress: 200,
}

const LEAF_COLUMNS = Object.keys(INITIAL_SIZES)

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

/** One number input per column in the Initial Column Sizes panel. */
function sizeInput(page: Page, column: string) {
  // Located by position rather than by label text, which carries template
  // whitespace that varies between frameworks.
  return page
    .locator('input.column-size-input')
    .nth(LEAF_COLUMNS.indexOf(column))
}

/** The example renders the same table three ways to prove they stay in sync. */
function nativeHeader(page: Page, index: number) {
  return page.locator('table thead th').nth(index)
}

function relativeDivHeader(page: Page, index: number) {
  return page.locator('.divTable').first().locator('.th').nth(index)
}

function absoluteDivHeader(page: Page, index: number) {
  return page.locator('.divTable').nth(1).locator('.th').nth(index)
}

/** Row data is random faker output, so `table.state` is the stable oracle. */
async function readColumnSizing(page: Page) {
  const text = await page.getByTestId('table-state').textContent()
  const state = JSON.parse(text ?? '{}') as {
    columnSizing?: Record<string, number>
  }

  return state.columnSizing ?? {}
}

async function widthOf(page: Page, index: number) {
  const box = await nativeHeader(page, index).boundingBox()
  return box?.width ?? 0
}

async function getFirstBodyRowText(page: Page) {
  const text = await page.locator('tbody tr').first().textContent()
  return text?.replace(/\s+/g, ' ').trim() ?? ''
}

test('renders the table without crashing', async ({ page }) => {
  const errors = await openExample(page)

  await expect(page.locator('table').first()).toBeVisible()
  await expect(page.locator('tbody tr')).toHaveCount(20)
  // No overrides applied yet, so sizes come straight from the column defs.
  expect(await readColumnSizing(page)).toEqual({})

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

test('renders each column at its declared size', async ({ page }) => {
  const errors = await openExample(page)

  for (const [index, column] of LEAF_COLUMNS.entries()) {
    const expected = INITIAL_SIZES[column] ?? 0
    await expect(sizeInput(page, column)).toHaveValue(String(expected))
    // This example lets the table stretch to fill, so the rendered width tracks
    // the declared size within a few pixels rather than matching it exactly.
    expect(Math.abs((await widthOf(page, index)) - expected)).toBeLessThan(8)
  }

  expect(errors).toEqual([])
})

test('resizes a column from the size panel', async ({ page }) => {
  const errors = await openExample(page)
  const before = await widthOf(page, 0)
  const untouchedBefore = await widthOf(page, 2)

  await sizeInput(page, 'firstName').fill('300')

  await expect.poll(() => readColumnSizing(page)).toEqual({ firstName: 300 })
  await expect.poll(() => widthOf(page, 0)).toBeGreaterThan(before + 100)
  // This example lets the native table stretch to fill its container, so the
  // rendered width tracks the declared size rather than matching it exactly.
  // Its neighbours stay put instead of growing with it.
  expect(Math.abs((await widthOf(page, 2)) - untouchedBefore)).toBeLessThan(4)

  expect(errors).toEqual([])
})

test('keeps all three table renderings the same width', async ({ page }) => {
  const errors = await openExample(page)

  await sizeInput(page, 'status').fill('260')

  await expect.poll(() => readColumnSizing(page)).toEqual({ status: 260 })

  // The native table, the relative div table and the absolutely positioned div
  // table all read the same column size, so a change has to land in all three.
  const relative = await relativeDivHeader(page, 4).boundingBox()
  const absolute = await absoluteDivHeader(page, 4).boundingBox()

  // The two div renderings size straight from the column size, so they agree
  // with each other. The native table stretches to fill, so it is left out of
  // this comparison.
  expect(
    Math.abs((relative?.width ?? 0) - (absolute?.width ?? 0)),
  ).toBeLessThan(2)
  expect(relative?.width ?? 0).toBeGreaterThan(240)

  expect(errors).toEqual([])
})

test('keeps column sizes when data is regenerated', async ({ page }) => {
  const errors = await openExample(page)

  await sizeInput(page, 'age').fill('180')
  await expect.poll(() => readColumnSizing(page)).toEqual({ age: 180 })

  // Sizing lives in table state, so replacing the rows must not reset it.
  await page.getByRole('button', { name: /^Regenerate Data$/i }).click()

  await expect(page.locator('tbody tr')).toHaveCount(20)
  expect(await readColumnSizing(page)).toEqual({ age: 180 })
  expect(await widthOf(page, 2)).toBeGreaterThan(140)

  expect(errors).toEqual([])
})
