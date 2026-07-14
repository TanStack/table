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
    await expect(page.getByLabel('Category filter:')).toBeVisible()

    const rowSource = page.getByLabel('Total rows:')
    await expect(rowSource).toHaveValue('filtered')
    await expect(rowSource.locator('option')).toHaveText([
      'Filtered rows',
      'All rows',
      'Visible page',
      'Filtered selected rows',
      'First three core rows',
    ])
    await rowSource.selectOption('all')
    await expect(table.locator('tfoot')).toContainText('all total')

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
