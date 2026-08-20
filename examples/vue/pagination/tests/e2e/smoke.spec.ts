import path from 'node:path'
import { expect, test } from '@playwright/test'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'
import type { Page } from '@playwright/test'

const exampleDir = path.resolve()

/** `makeData(1_000)` at the default page size of 10 gives exactly 100 pages. */
const TOTAL_ROWS = 1_000
const PAGE_SIZES = [10, 20, 30, 40, 50]

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

/** `<` is a prefix of `<<`, so every page button match has to be exact. */
function pageButton(page: Page, label: '<<' | '<' | '>' | '>>') {
  return page.getByRole('button', { name: label, exact: true })
}

/** The `{pageIndex + 1} of {pageCount}` readout. */
function pageStatus(page: Page) {
  return page.locator('.controls strong')
}

function goToPageInput(page: Page) {
  return page.getByRole('spinbutton')
}

function pageSizeSelect(page: Page) {
  return page.locator('.controls select')
}

function rowCountLine(page: Page) {
  return page.getByText(/Showing .* Rows/)
}

function bodyRows(page: Page) {
  return page.locator('tbody tr')
}

/** Row data is random faker output, so `table.state` is the stable oracle. */
async function readPagination(page: Page) {
  const text = await page.getByTestId('table-state').textContent()
  const state = JSON.parse(text ?? '{}') as {
    pagination?: { pageIndex: number; pageSize: number }
  }

  return state.pagination
}

async function expectPagination(
  page: Page,
  expected: { pageIndex: number; pageSize: number },
) {
  await expect.poll(() => readPagination(page)).toEqual(expected)
}

async function getFirstBodyRowText(page: Page) {
  const text = await bodyRows(page).first().textContent()
  return text?.replace(/\s+/g, ' ').trim() ?? ''
}

test('renders the table without crashing', async ({ page }) => {
  const errors = await openExample(page)
  const table = page.locator('table').first()

  await expect(table).toBeVisible()
  await expect(page.locator('thead tr').last().locator('th')).toHaveCount(7)
  await expect(bodyRows(page)).toHaveCount(10)
  await expect(rowCountLine(page)).toHaveText('Showing 10 of 1,000 Rows')
  await expectPagination(page, { pageIndex: 0, pageSize: 10 })

  expect(errors).toEqual([])
})

test('regenerates table data', async ({ page }) => {
  const errors = await openExample(page)
  const regenerateButton = page.getByRole('button', {
    name: /^Regenerate Data$/i,
  })

  await expect(bodyRows(page).first()).toBeVisible()

  const firstRowBefore = await getFirstBodyRowText(page)

  await regenerateButton.click()

  await expect.poll(() => getFirstBodyRowText(page)).not.toBe(firstRowBefore)
  await expect(bodyRows(page)).toHaveCount(10)

  expect(errors).toEqual([])
})

test('disables the first and previous buttons on the first page', async ({
  page,
}) => {
  const errors = await openExample(page)

  await expect(pageStatus(page)).toHaveText('1 of 100')
  await expect(pageButton(page, '<<')).toBeDisabled()
  await expect(pageButton(page, '<')).toBeDisabled()
  await expect(pageButton(page, '>')).toBeEnabled()
  await expect(pageButton(page, '>>')).toBeEnabled()

  expect(errors).toEqual([])
})

test('advances and rewinds one page at a time', async ({ page }) => {
  const errors = await openExample(page)

  await expect(pageStatus(page)).toHaveText('1 of 100')

  await pageButton(page, '>').click()
  await expect(pageStatus(page)).toHaveText('2 of 100')
  await expectPagination(page, { pageIndex: 1, pageSize: 10 })
  // Reaching page two enables the backwards buttons.
  await expect(pageButton(page, '<<')).toBeEnabled()
  await expect(pageButton(page, '<')).toBeEnabled()
  // The controlled input tracks the page rather than going stale.
  await expect(goToPageInput(page)).toHaveValue('2')

  const secondPageFirstRow = await getFirstBodyRowText(page)

  await pageButton(page, '>').click()
  await expect(pageStatus(page)).toHaveText('3 of 100')

  await pageButton(page, '<').click()
  await expect(pageStatus(page)).toHaveText('2 of 100')
  // Returning to a page shows the same rows, so paging does not reshuffle.
  expect(await getFirstBodyRowText(page)).toBe(secondPageFirstRow)

  // The page window slides but its size and the total do not.
  await expect(bodyRows(page)).toHaveCount(10)
  await expect(rowCountLine(page)).toHaveText('Showing 10 of 1,000 Rows')

  expect(errors).toEqual([])
})

test('jumps to the last and first pages', async ({ page }) => {
  const errors = await openExample(page)

  await pageButton(page, '>>').click()
  await expect(pageStatus(page)).toHaveText('100 of 100')
  await expectPagination(page, { pageIndex: 99, pageSize: 10 })
  await expect(bodyRows(page)).toHaveCount(10)
  await expect(pageButton(page, '>')).toBeDisabled()
  await expect(pageButton(page, '>>')).toBeDisabled()
  await expect(pageButton(page, '<<')).toBeEnabled()
  await expect(pageButton(page, '<')).toBeEnabled()

  await pageButton(page, '<<').click()
  await expect(pageStatus(page)).toHaveText('1 of 100')
  await expectPagination(page, { pageIndex: 0, pageSize: 10 })
  await expect(pageButton(page, '<<')).toBeDisabled()
  await expect(pageButton(page, '<')).toBeDisabled()

  expect(errors).toEqual([])
})

test('goes to an arbitrary page via the Go to page input', async ({ page }) => {
  const errors = await openExample(page)
  const input = goToPageInput(page)

  await expect(input).toHaveAttribute('min', '1')
  await expect(input).toHaveAttribute('max', '100')
  await expect(input).toHaveValue('1')

  await input.fill('42')
  await expect(pageStatus(page)).toHaveText('42 of 100')
  await expectPagination(page, { pageIndex: 41, pageSize: 10 })

  await input.fill('1')
  await expect(pageStatus(page)).toHaveText('1 of 100')
  await expect(pageButton(page, '<')).toBeDisabled()

  // Clearing the field falls back to the first page rather than NaN.
  await input.fill('7')
  await expect(pageStatus(page)).toHaveText('7 of 100')
  await input.fill('')
  await expectPagination(page, { pageIndex: 0, pageSize: 10 })
  await expect(pageStatus(page)).toHaveText('1 of 100')

  expect(errors).toEqual([])
})

test('recomputes the page index when the page size changes', async ({
  page,
}) => {
  const errors = await openExample(page)
  const select = pageSizeSelect(page)

  await expect(select.locator('option')).toHaveText([
    ...PAGE_SIZES.map((size) => `Show ${size}`),
    'Show All',
  ])
  await expect(select).toHaveValue('10')

  await select.selectOption('20')
  await expect(bodyRows(page)).toHaveCount(20)
  await expect(pageStatus(page)).toHaveText('1 of 50')
  await expect(rowCountLine(page)).toHaveText('Showing 20 of 1,000 Rows')
  await expectPagination(page, { pageIndex: 0, pageSize: 20 })

  await select.selectOption('50')
  await expect(bodyRows(page)).toHaveCount(50)
  await expect(pageStatus(page)).toHaveText('1 of 20')
  await expect(rowCountLine(page)).toHaveText('Showing 50 of 1,000 Rows')

  // `setPageSize` keeps the row at the top of the page in view by deriving the
  // new page index from the old top row index, rather than resetting to page 1.
  await select.selectOption('10')
  await goToPageInput(page).fill('5')
  await expect(pageStatus(page)).toHaveText('5 of 100')

  // Top row index is 4 * 10 = 40, so 20 rows per page lands on page 3.
  await select.selectOption('20')
  await expect(pageStatus(page)).toHaveText('3 of 50')
  await expectPagination(page, { pageIndex: 2, pageSize: 20 })

  // Top row index is still 2 * 20 = 40, so 50 rows per page lands on page 1.
  await select.selectOption('50')
  await expect(pageStatus(page)).toHaveText('1 of 20')
  await expectPagination(page, { pageIndex: 0, pageSize: 50 })

  expect(errors).toEqual([])
})

test('shows all rows when the All page size is selected', async ({ page }) => {
  const errors = await openExample(page)
  const select = pageSizeSelect(page)

  await pageButton(page, '>').click()
  await expect(pageStatus(page)).toHaveText('2 of 100')

  await select.selectOption('Infinity')

  await expect(select).toHaveValue('Infinity')
  await expect(bodyRows(page)).toHaveCount(TOTAL_ROWS)
  await expect(pageStatus(page)).toHaveText('1 of 1')
  await expect(rowCountLine(page)).toHaveText(
    `Showing ${TOTAL_ROWS.toLocaleString('en-US')} of ${TOTAL_ROWS.toLocaleString('en-US')} Rows`,
  )
  await expect(pageButton(page, '<<')).toBeDisabled()
  await expect(pageButton(page, '<')).toBeDisabled()
  await expect(pageButton(page, '>')).toBeDisabled()
  await expect(pageButton(page, '>>')).toBeDisabled()

  expect(errors).toEqual([])
})

test('resets to the first page when data is regenerated', async ({ page }) => {
  const errors = await openExample(page)

  await goToPageInput(page).fill('5')
  await expect(pageStatus(page)).toHaveText('5 of 100')

  // `autoResetPageIndex` defaults to true, so new data returns to page one.
  await page.getByRole('button', { name: /^Regenerate Data$/i }).click()

  await expect(pageStatus(page)).toHaveText('1 of 100')
  await expectPagination(page, { pageIndex: 0, pageSize: 10 })
  await expect(rowCountLine(page)).toHaveText(
    `Showing 10 of ${TOTAL_ROWS.toLocaleString('en-US')} Rows`,
  )

  expect(errors).toEqual([])
})
