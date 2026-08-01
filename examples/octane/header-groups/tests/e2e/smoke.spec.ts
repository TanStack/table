import path from 'node:path'
import { expect, test } from '@playwright/test'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'
import type { Locator, Page } from '@playwright/test'

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

// The example renders four tables: an even tree with no placeholders, an even
// tree of nested groups, an uneven tree that keeps placeholder headers as
// empty cells, and an uneven tree that merges headers vertically via
// `header.rowSpan`.
function basicTable(page: Page) {
  return page.locator('table').nth(0)
}

function nestedTable(page: Page) {
  return page.locator('table').nth(1)
}

function placeholderTable(page: Page) {
  return page.locator('table').nth(2)
}

function rowSpanTable(page: Page) {
  return page.locator('table').nth(3)
}

function headerRow(table: Locator, index: number) {
  return table.locator('thead tr').nth(index).locator('th')
}

function footerRow(table: Locator, index: number) {
  return table.locator('tfoot tr').nth(index).locator('th')
}

async function readSpans(cells: Locator, attribute: 'colspan' | 'rowspan') {
  return cells.evaluateAll((elements, attributeName) => {
    return elements.map((element) =>
      Number(element.getAttribute(attributeName) ?? '1'),
    )
  }, attribute)
}

async function getFirstBodyRowText(table: Locator) {
  const text = await table.locator('tbody tr').first().textContent()
  return text?.replace(/\s+/g, ' ').trim() ?? ''
}

test('renders all four tables without crashing', async ({ page }) => {
  const errors = await openExample(page)

  await expect(basicTable(page)).toBeVisible()
  await expect(nestedTable(page)).toBeVisible()
  await expect(placeholderTable(page)).toBeVisible()
  await expect(rowSpanTable(page)).toBeVisible()

  await expect(nestedTable(page).locator('tbody tr')).toHaveCount(5)
  await expect(
    nestedTable(page).locator('tbody tr').first().locator('td'),
  ).toHaveCount(LEAF_HEADERS.length)

  await expect(basicTable(page).locator('tbody tr')).toHaveCount(5)
  await expect(
    basicTable(page).locator('tbody tr').first().locator('td'),
  ).toHaveCount(LEAF_HEADERS.length)

  await expect(placeholderTable(page).locator('tbody tr')).toHaveCount(5)
  await expect(
    placeholderTable(page).locator('tbody tr').first().locator('td'),
  ).toHaveCount(LEAF_HEADERS.length)

  await expect(rowSpanTable(page).locator('tbody tr')).toHaveCount(5)
  await expect(
    rowSpanTable(page).locator('tbody tr').first().locator('td'),
  ).toHaveCount(5)

  expect(errors).toEqual([])
})

test('regenerates table data', async ({ page }) => {
  const errors = await openExample(page)
  const regenerateButton = page.getByRole('button', {
    name: /^Regenerate Data$/i,
  })

  await expect(placeholderTable(page).locator('tbody tr').first()).toBeVisible()

  const firstRowBefore = await getFirstBodyRowText(placeholderTable(page))

  await regenerateButton.click()

  await expect
    .poll(() => getFirstBodyRowText(placeholderTable(page)))
    .not.toBe(firstRowBefore)
  await expect(placeholderTable(page).locator('tbody tr')).toHaveCount(5)

  expect(errors).toEqual([])
})

test('groups leaf headers evenly with no placeholders', async ({ page }) => {
  const errors = await openExample(page)
  const table = basicTable(page)

  // Every leaf column belongs to a top-level group, so the tree is even: two
  // header rows and no empty placeholder cells.
  await expect(table.locator('thead tr')).toHaveCount(2)

  await expect(headerRow(table, 0)).toHaveText(['Name', 'Stats', 'Profile'])
  await expect(headerRow(table, 1)).toHaveText([
    'First Name',
    'Last Name',
    'Age',
    'Visits',
    'Status',
    'Profile Progress',
  ])

  expect(await readSpans(headerRow(table, 0), 'colspan')).toEqual([2, 2, 2])
  // An even tree never produces spanning chains, so every rowSpan is 1.
  expect(await readSpans(headerRow(table, 0), 'rowspan')).toEqual([1, 1, 1])

  // Only the leaf columns declare footers and the render loop skips footer
  // rows without content, so the group row never renders in the tfoot.
  await expect(table.locator('tfoot tr')).toHaveCount(1)
  await expect(footerRow(table, 0)).toHaveText([
    'First Name',
    'Last Name',
    'Age',
    'Visits',
    'Status',
    'Profile Progress',
  ])

  expect(errors).toEqual([])
})

test('nests groups inside groups with no placeholders', async ({ page }) => {
  const errors = await openExample(page)
  const table = nestedTable(page)

  // Groups inside groups, every leaf at the same depth: three header rows and
  // still no placeholder cells.
  await expect(table.locator('thead tr')).toHaveCount(3)

  await expect(headerRow(table, 0)).toHaveText(['Person', 'Activity'])
  await expect(headerRow(table, 1)).toHaveText([
    'Name',
    'Demographics',
    'Engagement',
    'Progress',
  ])
  await expect(headerRow(table, 2)).toHaveText([
    'First Name',
    'Last Name',
    'Age',
    'Visits',
    'Status',
    'Profile Progress',
  ])

  // Each group spans the sum of its descendants.
  expect(await readSpans(headerRow(table, 0), 'colspan')).toEqual([3, 3])
  expect(await readSpans(headerRow(table, 1), 'colspan')).toEqual([2, 1, 2, 1])
  // An even tree never produces spanning chains.
  expect(await readSpans(headerRow(table, 0), 'rowspan')).toEqual([1, 1])

  expect(errors).toEqual([])
})

test('nests the header groups three rows deep', async ({ page }) => {
  const errors = await openExample(page)
  const table = placeholderTable(page)

  // Two top level groups, one of which nests a further group, so the deepest
  // leaf needs three header rows.
  await expect(table.locator('thead tr')).toHaveCount(3)

  await expect(headerRow(table, 0)).toHaveText(['Hello', 'Info'])
  // Row two is mostly placeholders for the columns that have no middle group.
  await expect(headerRow(table, 1)).toHaveText(['', '', '', 'More Info'])
  await expect(headerRow(table, 2)).toHaveText(LEAF_HEADERS)

  expect(errors).toEqual([])
})

test('spans each group across the columns beneath it', async ({ page }) => {
  const errors = await openExample(page)
  const table = placeholderTable(page)

  // `Hello` covers two leaves, `Info` covers the other four.
  expect(await readSpans(headerRow(table, 0), 'colspan')).toEqual([2, 4])
  // `More Info` covers the last three of `Info`'s four leaves.
  expect(await readSpans(headerRow(table, 1), 'colspan')).toEqual([1, 1, 1, 3])
  expect(await readSpans(headerRow(table, 2), 'colspan')).toEqual([
    1, 1, 1, 1, 1, 1,
  ])

  // Every header row must cover the same total width as the body rows.
  for (const row of [0, 1, 2]) {
    const spans = await readSpans(headerRow(table, row), 'colspan')
    expect(spans.reduce((total, span) => total + span, 0)).toBe(
      LEAF_HEADERS.length,
    )
  }

  expect(errors).toEqual([])
})

test('mirrors the header groups in the footer', async ({ page }) => {
  const errors = await openExample(page)
  const table = placeholderTable(page)

  // Footer groups are the header groups reversed, so leaves come first.
  await expect(table.locator('tfoot tr')).toHaveCount(3)
  await expect(footerRow(table, 0)).toHaveText(LEAF_FOOTERS)

  // The `hello` group declares a header but no footer, so its footer cell is
  // empty, while `Info` declares both. The cell is still rendered and still
  // spans its columns, which is what keeps the footer aligned with the body.
  await expect(footerRow(table, 2)).toHaveText(['', 'Info'])
  expect(await readSpans(footerRow(table, 2), 'colspan')).toEqual([2, 4])

  expect(errors).toEqual([])
})

test('spans shallow leaf headers across rows in the second table', async ({
  page,
}) => {
  const errors = await openExample(page)
  const table = rowSpanTable(page)

  await expect(table.locator('thead tr')).toHaveCount(3)

  // Placeholder headers are skipped, so each row only renders real headers.
  await expect(headerRow(table, 0)).toHaveText([
    'Full Name',
    'Info',
    'Profile Progress',
  ])
  await expect(headerRow(table, 1)).toHaveText(['Age', 'More Info'])
  await expect(headerRow(table, 2)).toHaveText(['Visits', 'Status'])

  // Top-level leaves span all three rows, `Age` spans the bottom two.
  expect(await readSpans(headerRow(table, 0), 'rowspan')).toEqual([3, 1, 3])
  expect(await readSpans(headerRow(table, 1), 'rowspan')).toEqual([2, 1])
  expect(await readSpans(headerRow(table, 2), 'rowspan')).toEqual([1, 1])

  expect(await readSpans(headerRow(table, 0), 'colspan')).toEqual([1, 3, 1])
  expect(await readSpans(headerRow(table, 1), 'colspan')).toEqual([1, 2])

  expect(errors).toEqual([])
})
