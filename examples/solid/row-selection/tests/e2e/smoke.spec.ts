import path from 'node:path'
import { expect, test } from '@playwright/test'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'
import type { Locator, Page } from '@playwright/test'

const exampleDir = path.resolve()

/** `makeData(1_000)` with a uuid `getRowId`, ten rows to a page. */
const TOTAL_ROWS = '1,000'
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

function rowCheckboxes(page: Page) {
  return page.locator('tbody tr td:first-child input[type="checkbox"]')
}

/** Bound to `getIsAllRowsSelected`, so it spans every page. */
function headerCheckbox(page: Page) {
  return page.locator('thead input[type="checkbox"]').first()
}

/** Bound to `getIsAllPageRowsSelected`, so it spans the current page only. */
function footerCheckbox(page: Page) {
  return page.locator('tfoot input[type="checkbox"]')
}

/** Anchored so the regex cannot also match an ancestor with extra text. */
function selectionSummary(page: Page) {
  return page
    .locator('div')
    .filter({
      hasText: /^\s*[\d,]+\s+of\s+[\d,]+\s+Total\s+Rows\s+Selected\s*$/,
    })
}

function pageRowsLabel(page: Page) {
  return page.locator('tfoot td').nth(1)
}

function globalFilterInput(page: Page) {
  return page.getByPlaceholder('Search all columns...')
}

function pageButton(page: Page, label: '<<' | '<' | '>' | '>>') {
  return page.getByRole('button', { name: label, exact: true })
}

function isIndeterminate(checkbox: Locator) {
  return checkbox.evaluate((el) => (el as HTMLInputElement).indeterminate)
}

async function expectIndeterminate(checkbox: Locator, expected: boolean) {
  await expect.poll(() => isIndeterminate(checkbox)).toBe(expected)
}

/** Row ids are uuids, so only the number of selected keys is assertable. */
async function readSelectionCount(page: Page) {
  const text = await page.getByTestId('table-state').textContent()
  const state = JSON.parse(text ?? '{}') as {
    rowSelection?: Record<string, boolean>
  }

  return Object.keys(state.rowSelection ?? {}).length
}

async function expectSelectionCount(page: Page, expected: number) {
  await expect.poll(() => readSelectionCount(page)).toBe(expected)
  await expect(selectionSummary(page)).toHaveText(
    `${expected.toLocaleString('en-US')} of ${TOTAL_ROWS} Total Rows Selected`,
  )
}

async function readGlobalFilter(page: Page) {
  const text = await page.getByTestId('table-state').textContent()
  const state = JSON.parse(text ?? '{}') as { globalFilter?: string }

  return state.globalFilter ?? ''
}

async function getFirstBodyRowText(page: Page) {
  const text = await page.locator('tbody tr').first().textContent()
  return text?.replace(/\s+/g, ' ').trim() ?? ''
}

test('renders the table without crashing', async ({ page }) => {
  const errors = await openExample(page)
  const table = page.locator('table').first()

  await expect(table).toBeVisible()
  await expect(page.locator('tbody tr')).toHaveCount(PAGE_SIZE)
  await expect(pageRowsLabel(page)).toHaveText(`Page Rows (${PAGE_SIZE})`)
  await expectSelectionCount(page, 0)
  await expect(headerCheckbox(page)).not.toBeChecked()
  await expectIndeterminate(headerCheckbox(page), false)

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
  await expect(page.locator('tbody tr')).toHaveCount(PAGE_SIZE)

  expect(errors).toEqual([])
})

test('selects and deselects a single row', async ({ page }) => {
  const errors = await openExample(page)
  const firstRow = rowCheckboxes(page).first()

  await firstRow.check()

  await expect(firstRow).toBeChecked()
  await expectSelectionCount(page, 1)
  // One of many rows selected leaves both select-all boxes partially filled.
  await expectIndeterminate(headerCheckbox(page), true)
  await expectIndeterminate(footerCheckbox(page), true)
  await expect(headerCheckbox(page)).not.toBeChecked()

  await firstRow.uncheck()

  await expect(firstRow).not.toBeChecked()
  await expectSelectionCount(page, 0)
  await expectIndeterminate(headerCheckbox(page), false)
  await expectIndeterminate(footerCheckbox(page), false)

  expect(errors).toEqual([])
})

test('selects an inclusive range with Shift-click', async ({ page }) => {
  const errors = await openExample(page)
  const checkboxes = rowCheckboxes(page)

  await checkboxes.nth(1).check()
  await expectSelectionCount(page, 1)

  // The range covers both endpoints, so rows 1 through 5 is five rows.
  await checkboxes.nth(5).click({ modifiers: ['Shift'] })

  await expectSelectionCount(page, 5)

  for (const index of [1, 2, 3, 4, 5]) {
    await expect(checkboxes.nth(index)).toBeChecked()
  }

  // Rows outside the range are untouched.
  await expect(checkboxes.nth(0)).not.toBeChecked()
  await expect(checkboxes.nth(6)).not.toBeChecked()

  expect(errors).toEqual([])
})

test('selects every row on the current page from the footer', async ({
  page,
}) => {
  const errors = await openExample(page)

  await footerCheckbox(page).check()

  await expectSelectionCount(page, PAGE_SIZE)
  await expect(footerCheckbox(page)).toBeChecked()
  await expectIndeterminate(footerCheckbox(page), false)
  // Ten of a thousand rows is still only a partial selection overall.
  await expect(headerCheckbox(page)).not.toBeChecked()
  await expectIndeterminate(headerCheckbox(page), true)

  for (let index = 0; index < PAGE_SIZE; index++) {
    await expect(rowCheckboxes(page).nth(index)).toBeChecked()
  }

  // Clearing a single row drops the footer back to a partial state.
  await rowCheckboxes(page).nth(3).uncheck()
  await expectSelectionCount(page, PAGE_SIZE - 1)
  await expect(footerCheckbox(page)).not.toBeChecked()
  await expectIndeterminate(footerCheckbox(page), true)

  await footerCheckbox(page).check()
  await expectSelectionCount(page, PAGE_SIZE)

  expect(errors).toEqual([])
})

test('selects every row across all pages from the header', async ({ page }) => {
  const errors = await openExample(page)

  await headerCheckbox(page).check()

  await expectSelectionCount(page, 1_000)
  await expect(headerCheckbox(page)).toBeChecked()
  await expectIndeterminate(headerCheckbox(page), false)
  await expect(footerCheckbox(page)).toBeChecked()

  // Selection is keyed by row id rather than position, so the next page's rows
  // come back already selected.
  await pageButton(page, '>').click()

  await expect(footerCheckbox(page)).toBeChecked()
  await expectSelectionCount(page, 1_000)

  for (let index = 0; index < PAGE_SIZE; index++) {
    await expect(rowCheckboxes(page).nth(index)).toBeChecked()
  }

  await headerCheckbox(page).uncheck()
  await expectSelectionCount(page, 0)

  expect(errors).toEqual([])
})

test('keeps selection when the global filter narrows the rows', async ({
  page,
}) => {
  const errors = await openExample(page)

  await rowCheckboxes(page).first().check()
  await expectSelectionCount(page, 1)

  // The first name of the row that was just selected, so it survives the
  // filter. The input debounces, so poll the state rather than sleeping.
  const firstName =
    (
      await page.locator('tbody tr').first().locator('td').nth(1).textContent()
    )?.trim() ?? ''

  await globalFilterInput(page).fill(firstName)

  await expect.poll(() => readGlobalFilter(page)).toBe(firstName)
  await expect(page.locator('tbody tr').first()).toBeVisible()
  // The summary counts pre-filtered rows, so the denominator does not move.
  await expectSelectionCount(page, 1)

  await globalFilterInput(page).fill('')

  await expect.poll(() => readGlobalFilter(page)).toBe('')
  await expectSelectionCount(page, 1)

  expect(errors).toEqual([])
})

test('tracks the page size in the footer row count', async ({ page }) => {
  const errors = await openExample(page)
  const select = page.locator('.controls select')

  await expect(pageRowsLabel(page)).toHaveText('Page Rows (10)')

  await select.selectOption('20')

  await expect(page.locator('tbody tr')).toHaveCount(20)
  await expect(pageRowsLabel(page)).toHaveText('Page Rows (20)')

  // Selecting the page now covers twenty rows rather than ten.
  await footerCheckbox(page).check()
  await expectSelectionCount(page, 20)

  expect(errors).toEqual([])
})
