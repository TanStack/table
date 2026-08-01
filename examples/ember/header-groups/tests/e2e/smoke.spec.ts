import { expect, test } from '@playwright/test'
import type { Locator, Page } from '@playwright/test'
import path from 'node:path'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'

const exampleDir = path.resolve()

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
  const server = await startExampleServer(exampleDir)
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

  return { errors, server }
}

function getTable(page: Page) {
  return page
    .locator('table:visible, .divTable:visible')
    .filter({ has: page.locator('thead th, .thead .th') })
    .filter({ has: page.locator('tbody tr, .tbody .tr') })
    .first()
}

function getHeaderCells(table: Locator) {
  return table.locator('thead th, .thead .th')
}

function getBodyRows(table: Locator) {
  return table.locator('tbody tr, .tbody .tr')
}

async function getFirstBodyRowData(table: Locator) {
  const row = getBodyRows(table).first()
  const firstInput = row
    .locator('input:not([type="checkbox"]):not([type="radio"])')
    .first()

  if ((await firstInput.count()) > 0 && (await firstInput.isVisible())) {
    return firstInput.inputValue()
  }

  const text = await row.textContent()
  return text?.replace(/\s+/g, ' ').trim() ?? ''
}

test('renders the table without crashing', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    const table = getTable(page)
    const bodyRows = getBodyRows(table)

    await expect(table).toBeVisible()
    await expect(getHeaderCells(table).first()).toBeVisible()
    await expect(bodyRows.first()).toBeVisible()

    const regenerateButton = page
      .getByRole('button', { name: /^Regenerate Data$/i })
      .first()

    if ((await regenerateButton.count()) > 0) {
      await expect(regenerateButton).toBeVisible()

      const firstRowBefore = await getFirstBodyRowData(table)

      await regenerateButton.click()

      await expect
        .poll(() => getFirstBodyRowData(table))
        .not.toBe(firstRowBefore)
      await expect(bodyRows.first()).toBeVisible()
    }

    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

// The example renders four tables: an even tree with no placeholders, an even
// tree of nested groups, an uneven tree that keeps placeholder headers as
// empty cells, and an uneven tree that merges headers vertically via
// `header.rowSpan`.
function tableAt(page: Page, index: number) {
  return page.locator('table').nth(index)
}

function headerRow(table: Locator, index: number) {
  return table.locator('thead tr').nth(index).locator('th')
}

async function readSpans(cells: Locator, attribute: 'colspan' | 'rowspan') {
  return cells.evaluateAll((elements, attributeName) => {
    return elements.map((element) =>
      Number(element.getAttribute(attributeName) ?? '1'),
    )
  }, attribute)
}

test('renders each header group layout', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    const basicTable = tableAt(page, 0)
    const nestedTable = tableAt(page, 1)
    const placeholderTable = tableAt(page, 2)
    const rowSpanTable = tableAt(page, 3)

    await expect(page.locator('table')).toHaveCount(4)

    // Even tree: two header rows, no placeholders.
    await expect(basicTable.locator('thead tr')).toHaveCount(2)
    await expect(headerRow(basicTable, 0)).toHaveText([
      'Name',
      'Stats',
      'Profile',
    ])
    expect(await readSpans(headerRow(basicTable, 0), 'colspan')).toEqual([
      2, 2, 2,
    ])

    // Groups inside groups, still even: three header rows, no placeholders.
    await expect(nestedTable.locator('thead tr')).toHaveCount(3)
    await expect(headerRow(nestedTable, 0)).toHaveText(['Person', 'Activity'])
    await expect(headerRow(nestedTable, 1)).toHaveText([
      'Name',
      'Demographics',
      'Engagement',
      'Progress',
    ])
    expect(await readSpans(headerRow(nestedTable, 0), 'colspan')).toEqual([
      3, 3,
    ])

    // Uneven tree: the middle row is mostly empty placeholder cells.
    await expect(placeholderTable.locator('thead tr')).toHaveCount(3)
    await expect(headerRow(placeholderTable, 1)).toHaveText([
      '',
      '',
      '',
      'More Info',
    ])

    // Uneven tree merged vertically: shallow leaf headers span extra rows and
    // the headers they cover are skipped.
    await expect(rowSpanTable.locator('thead tr')).toHaveCount(3)
    await expect(headerRow(rowSpanTable, 0)).toHaveText([
      'Full Name',
      'Info',
      'Profile Progress',
    ])
    expect(await readSpans(headerRow(rowSpanTable, 0), 'rowspan')).toEqual([
      3, 1, 3,
    ])
    expect(await readSpans(headerRow(rowSpanTable, 1), 'rowspan')).toEqual([
      2, 1,
    ])

    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})
