import path from 'node:path'
import { expect, test } from '@playwright/test'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'
import type { Page } from '@playwright/test'

const exampleDir = path.resolve()

const TOTAL_ROWS = 10_000
const STATUS_COUNT = 3

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

/** Each header carries a toggle: `👊` when ungrouped, `🛑(index)` when grouped. */
function groupToggle(page: Page, header: string) {
  return page
    .locator('thead th')
    .filter({ hasText: header })
    .getByRole('button')
}

function bodyRows(page: Page) {
  return page.locator('tbody tr')
}

/** Row data is random faker output, so `table.state` is the stable oracle. */
async function readState(page: Page) {
  const text = await page.getByTestId('table-state').textContent()

  return JSON.parse(text ?? '{}') as {
    grouping?: Array<string>
    expanded?: Record<string, boolean> | true
  }
}

async function expectGrouping(page: Page, expected: Array<string>) {
  await expect
    .poll(async () => (await readState(page)).grouping ?? [])
    .toEqual(expected)
}

/** The `(1,234)` leaf count rendered inside each group row's expander. */
async function readGroupCounts(page: Page) {
  const texts = await bodyRows(page).locator('td button').allTextContents()

  return texts.map((text) => {
    const match = text.match(/\(([\d,]+)\)/)
    return match ? Number((match[1] ?? '0').replace(/,/g, '')) : 0
  })
}

async function getFirstBodyRowText(page: Page) {
  const text = await bodyRows(page).first().textContent()
  return text?.replace(/\s+/g, ' ').trim() ?? ''
}

test('renders the table without crashing', async ({ page }) => {
  const errors = await openExample(page)
  const table = page.locator('table').first()

  await expect(table).toBeVisible()
  await expect(table.locator('thead th')).toHaveCount(6)
  await expect(bodyRows(page).first()).toBeVisible()
  await expectGrouping(page, [])
  // Every header offers a grouping toggle, all of them ungrouped.
  await expect(page.locator('thead th button')).toHaveCount(6)
  await expect(groupToggle(page, 'Status')).toHaveText('👊')

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

  expect(errors).toEqual([])
})

test('groups rows by a column', async ({ page }) => {
  const errors = await openExample(page)

  await groupToggle(page, 'Status').click()

  await expectGrouping(page, ['status'])
  // The toggle now reports this column's position in the grouping list.
  await expect(groupToggle(page, 'Status')).toHaveText('🛑(0)')

  // Three statuses collapse ten thousand rows into three group rows.
  await expect(bodyRows(page)).toHaveCount(STATUS_COUNT)
  await expect(bodyRows(page).first()).toContainText('👉')
  await expect(bodyRows(page).first()).toContainText(/\([\d,]+\)/)

  expect(errors).toEqual([])
})

test('group leaf counts add up to every row', async ({ page }) => {
  const errors = await openExample(page)

  await groupToggle(page, 'Status').click()
  await expectGrouping(page, ['status'])
  await expect(bodyRows(page)).toHaveCount(STATUS_COUNT)

  // Grouping partitions the rows, so the parts must make up the whole. This
  // holds no matter what the random data happens to be.
  const counts = await readGroupCounts(page)
  expect(counts).toHaveLength(STATUS_COUNT)
  expect(counts.reduce((total, count) => total + count, 0)).toBe(TOTAL_ROWS)

  expect(errors).toEqual([])
})

test('expands a group to reveal its leaf rows', async ({ page }) => {
  const errors = await openExample(page)

  await groupToggle(page, 'Status').click()
  await expect(bodyRows(page)).toHaveCount(STATUS_COUNT)

  await bodyRows(page).first().locator('td button').first().click()

  await expect(bodyRows(page).first()).toContainText('👇')
  // Leaf rows now sit under the expanded group, so the page fills up.
  await expect.poll(() => bodyRows(page).count()).toBeGreaterThan(STATUS_COUNT)

  await bodyRows(page).first().locator('td button').first().click()

  await expect(bodyRows(page).first()).toContainText('👉')
  await expect(bodyRows(page)).toHaveCount(STATUS_COUNT)

  expect(errors).toEqual([])
})

test('nests a second grouping level', async ({ page }) => {
  const errors = await openExample(page)

  await groupToggle(page, 'Status').click()
  await expectGrouping(page, ['status'])

  await groupToggle(page, 'Age').click()

  await expectGrouping(page, ['status', 'age'])
  await expect(groupToggle(page, 'Status')).toHaveText('🛑(0)')
  await expect(groupToggle(page, 'Age')).toHaveText('🛑(1)')
  // The outer grouping still decides the top level row count.
  await expect(bodyRows(page)).toHaveCount(STATUS_COUNT)

  expect(errors).toEqual([])
})

test('ungroups a column', async ({ page }) => {
  const errors = await openExample(page)

  await groupToggle(page, 'Status').click()
  await expectGrouping(page, ['status'])
  await expect(bodyRows(page)).toHaveCount(STATUS_COUNT)

  await groupToggle(page, 'Status').click()

  await expectGrouping(page, [])
  await expect(groupToggle(page, 'Status')).toHaveText('👊')
  // Back to flat rows, so the page fills up again.
  await expect(bodyRows(page)).toHaveCount(10)

  expect(errors).toEqual([])
})
