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

  try {
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
  } catch (error) {
    await server.close()
    throw error
  }
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
    await expect(table).toHaveCSS('border-collapse', 'collapse')
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

test('selects an inclusive cell range with Shift-click', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    const table = getTable(page)
    const rows = getBodyRows(table)

    await expect(rows.first()).toBeVisible()

    await rows.nth(0).locator('td').nth(0).click()
    await rows
      .nth(2)
      .locator('td')
      .nth(2)
      .click({ modifiers: ['Shift'] })

    // the rectangle covers 3 rows x 3 columns, and its anchor stays put
    await expect(page.locator('td.cell-selected')).toHaveCount(9)
    await expect(
      page.locator('td.cell-selected:not(.cell-focused)').first(),
    ).toHaveCSS('background-color', 'rgb(219, 234, 254)')
    await expect(rows.nth(0).locator('td').nth(0)).toHaveClass(/cell-focused/)
    await expect(rows.nth(3).locator('td').nth(0)).not.toHaveClass(
      /cell-selected/,
    )
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('updates column layout without entering a reactive loop', async ({
  page,
}) => {
  const { errors, server } = await openExample(page)

  try {
    const table = getTable(page)
    const headers = getHeaderCells(table)

    await expect(headers.first()).toContainText('First Name')

    await page.getByRole('button', { name: 'Reverse Column Order' }).click()
    await expect(headers.first()).toContainText('Salary')

    const ageHeader = headers.filter({
      has: page.getByRole('button', { name: 'Age', exact: true }),
    })
    await ageHeader.getByRole('button', { name: '<=', exact: true }).click()
    await expect(headers.first()).toContainText('Age')

    await page.getByRole('checkbox', { name: 'email', exact: true }).uncheck()
    await expect(
      headers.filter({
        has: page.getByRole('button', { name: 'Email', exact: true }),
      }),
    ).toHaveCount(0)

    const firstNameSortButton = table
      .getByRole('button', { name: /^First Name/ })
      .first()
    await firstNameSortButton.click()
    await expect(firstNameSortButton).toContainText('🔼')

    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})
