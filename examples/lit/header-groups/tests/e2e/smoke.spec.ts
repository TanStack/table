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

const LEAF_FOOTERS = [
  'firstName',
  'lastName',
  'age',
  'visits',
  'status',
  'progress',
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

function headerRow(page: Page, index: number) {
  return page.locator('thead tr').nth(index).locator('th')
}

function footerRow(page: Page, index: number) {
  return page.locator('tfoot tr').nth(index).locator('th')
}

async function readColSpans(page: Page, selector: string) {
  return page
    .locator(selector)
    .evaluateAll((cells) =>
      cells.map((cell) => Number(cell.getAttribute('colspan') ?? '1')),
    )
}

async function getFirstBodyRowText(page: Page) {
  const text = await page.locator('tbody tr').first().textContent()
  return text?.replace(/\s+/g, ' ').trim() ?? ''
}

test('renders the table without crashing', async ({ page }) => {
  const errors = await openExample(page)
  const table = page.locator('table').first()

  await expect(table).toBeVisible()
  await expect(page.locator('tbody tr')).toHaveCount(20)
  await expect(page.locator('tbody tr').first().locator('td')).toHaveCount(
    LEAF_HEADERS.length,
  )

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

test('nests the header groups three rows deep', async ({ page }) => {
  const errors = await openExample(page)

  // Two top level groups, one of which nests a further group, so the deepest
  // leaf needs three header rows.
  await expect(page.locator('thead tr')).toHaveCount(3)

  await expect(headerRow(page, 0)).toHaveText(['Name', 'Info'])
  // Row two is mostly placeholders for the columns that have no middle group.
  await expect(headerRow(page, 1)).toHaveText(['', '', '', 'More Info'])
  await expect(headerRow(page, 2)).toHaveText(LEAF_HEADERS)

  expect(errors).toEqual([])
})

test('spans each group across the columns beneath it', async ({ page }) => {
  const errors = await openExample(page)

  // `Hello` covers two leaves, `Info` covers the other four.
  expect(await readColSpans(page, 'thead tr:nth-child(1) th')).toEqual([2, 4])
  // `More Info` covers the last three of `Info`'s four leaves.
  expect(await readColSpans(page, 'thead tr:nth-child(2) th')).toEqual([
    1, 1, 1, 3,
  ])
  expect(await readColSpans(page, 'thead tr:nth-child(3) th')).toEqual([
    1, 1, 1, 1, 1, 1,
  ])

  // Every header row must cover the same total width as the body rows.
  for (const row of [1, 2, 3]) {
    const spans = await readColSpans(page, `thead tr:nth-child(${row}) th`)
    expect(spans.reduce((total, span) => total + span, 0)).toBe(
      LEAF_HEADERS.length,
    )
  }

  expect(errors).toEqual([])
})

test('mirrors the header groups in the footer', async ({ page }) => {
  const errors = await openExample(page)

  // Footer groups are the header groups reversed, so leaves come first.
  await expect(page.locator('tfoot tr')).toHaveCount(3)
  await expect(footerRow(page, 0)).toHaveText(LEAF_FOOTERS)

  // Both groups declare a footer, and each still spans its own columns, which
  // is what keeps the footer aligned with the body.
  await expect(footerRow(page, 2)).toHaveText(['Name', 'Info'])
  expect(await readColSpans(page, 'tfoot tr:nth-child(3) th')).toEqual([2, 4])

  expect(errors).toEqual([])
})
