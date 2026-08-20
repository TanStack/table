import path from 'node:path'
import { expect, test } from '@playwright/test'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'
import type { Page } from '@playwright/test'

const exampleDir = path.resolve()

/** `makeData(100, 5, 3)`: 100 roots, 5 children each, 3 grandchildren each. */
const CHILDREN_PER_ROW = 5
const PAGE_SIZE = 10

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

function bodyRows(page: Page) {
  return page.locator('tbody tr')
}

/** The expander lives in each row's first name cell, beside the checkbox. */
function rowExpander(page: Page, index: number) {
  return bodyRows(page).nth(index).getByRole('button')
}

/** The wrapper whose padding encodes the row's depth. */
function rowIndent(page: Page, index: number) {
  return bodyRows(page).nth(index).locator('td').nth(1).locator('div').first()
}

/** The expand-all control sits in the first name header. */
function expandAllButton(page: Page) {
  return page.locator('thead th').nth(1).getByRole('button')
}

function rowCheckbox(page: Page, index: number) {
  return bodyRows(page).nth(index).locator('input[type="checkbox"]').first()
}

/** Row data is random faker output, so `table.state` is the stable oracle. */
async function readState(page: Page) {
  const text = await page.getByTestId('table-state').textContent()

  return JSON.parse(text ?? '{}') as {
    expanded?: Record<string, boolean> | true
    rowSelection?: Record<string, boolean>
  }
}

async function countExpanded(page: Page) {
  const expanded = (await readState(page)).expanded
  return expanded === true ? -1 : Object.keys(expanded ?? {}).length
}

async function countSelected(page: Page) {
  return Object.keys((await readState(page)).rowSelection ?? {}).length
}

async function getRowText(page: Page, index: number) {
  const text = await bodyRows(page).nth(index).textContent()
  return text?.replace(/\s+/g, ' ').trim() ?? ''
}

test('renders the table without crashing', async ({ page }) => {
  const errors = await openExample(page)
  const table = page.locator('table').first()

  await expect(table).toBeVisible()
  await expect(bodyRows(page)).toHaveCount(PAGE_SIZE)
  await expect.poll(async () => (await readState(page)).expanded).toEqual({})
  // Nothing is expanded yet, so every visible row is a root row.
  await expect(rowExpander(page, 0)).toHaveText('👉')
  await expect(rowIndent(page, 0)).toHaveCSS('padding-left', '0px')

  expect(errors).toEqual([])
})

test('regenerates table data', async ({ page }) => {
  const errors = await openExample(page)
  const regenerateButton = page.getByRole('button', {
    name: /^Regenerate Data$/i,
  })

  await expect(bodyRows(page).first()).toBeVisible()

  const firstRowBefore = await getRowText(page, 0)

  await regenerateButton.click()

  await expect.poll(() => getRowText(page, 0)).not.toBe(firstRowBefore)
  await expect(bodyRows(page)).toHaveCount(PAGE_SIZE)

  expect(errors).toEqual([])
})

test('expands and collapses a single row', async ({ page }) => {
  const errors = await openExample(page)
  const secondRowBefore = await getRowText(page, 1)

  await rowExpander(page, 0).click()

  await expect(rowExpander(page, 0)).toHaveText('👇')
  await expect.poll(() => countExpanded(page)).toBe(1)

  // Children are spliced in beneath their parent, but pagination still hands
  // back one page, so the rows below are pushed out of the window instead.
  await expect(bodyRows(page)).toHaveCount(PAGE_SIZE)
  expect(await getRowText(page, 1)).not.toBe(secondRowBefore)
  await expect(rowIndent(page, 1)).toHaveCSS('padding-left', '32px')

  await rowExpander(page, 0).click()

  await expect(rowExpander(page, 0)).toHaveText('👉')
  await expect.poll(() => countExpanded(page)).toBe(0)
  // Collapsing restores exactly the row that was displaced.
  expect(await getRowText(page, 1)).toBe(secondRowBefore)

  expect(errors).toEqual([])
})

test('indents each level of sub rows', async ({ page }) => {
  const errors = await openExample(page)

  await rowExpander(page, 0).click()
  await expect(rowExpander(page, 0)).toHaveText('👇')

  // Depth drives a 2rem indent per level, and this example sets the root font
  // size default, so each level adds 32px.
  await expect(rowIndent(page, 0)).toHaveCSS('padding-left', '0px')
  await expect(rowIndent(page, 1)).toHaveCSS('padding-left', '32px')

  await rowExpander(page, 1).click()

  await expect(rowExpander(page, 1)).toHaveText('👇')
  await expect(rowIndent(page, 2)).toHaveCSS('padding-left', '64px')
  await expect.poll(() => countExpanded(page)).toBe(2)

  expect(errors).toEqual([])
})

test('expands every row from the header', async ({ page }) => {
  const errors = await openExample(page)

  await expect(expandAllButton(page)).toHaveText('👉')

  await expandAllButton(page).click()

  await expect(expandAllButton(page)).toHaveText('👇')
  // Expanding everything is stored as `true` rather than a map of row ids.
  await expect.poll(async () => (await readState(page)).expanded).toBe(true)
  // The first page is now a root followed by its own descendants.
  await expect(rowIndent(page, 1)).toHaveCSS('padding-left', '32px')
  await expect(rowIndent(page, 2)).toHaveCSS('padding-left', '64px')

  await expandAllButton(page).click()

  await expect(expandAllButton(page)).toHaveText('👉')
  await expect(rowIndent(page, 1)).toHaveCSS('padding-left', '0px')

  expect(errors).toEqual([])
})

test('marks rows without children as leaves', async ({ page }) => {
  const errors = await openExample(page)

  await expandAllButton(page).click()
  await expect(expandAllButton(page)).toHaveText('👇')

  // The third level has no children of its own, so it renders a leaf marker
  // instead of an expander.
  await expect(page.locator('tbody').getByText('🔵').first()).toBeVisible()

  expect(errors).toEqual([])
})

test('selects sub rows along with their parent', async ({ page }) => {
  const errors = await openExample(page)

  await rowExpander(page, 0).click()
  await expect(rowExpander(page, 0)).toHaveText('👇')

  await rowCheckbox(page, 0).check()

  // Selecting a parent cascades to its whole subtree, so one click selects far
  // more than one row.
  await expect.poll(() => countSelected(page)).toBeGreaterThan(CHILDREN_PER_ROW)
  await expect(rowCheckbox(page, 1)).toBeChecked()

  await rowCheckbox(page, 0).uncheck()

  await expect.poll(() => countSelected(page)).toBe(0)
  await expect(rowCheckbox(page, 1)).not.toBeChecked()

  expect(errors).toEqual([])
})
