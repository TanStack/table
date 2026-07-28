import path from 'node:path'
import { expect, test } from '@playwright/test'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'
import type { Locator, Page } from '@playwright/test'

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

async function getFirstBodyRowText(table: Locator) {
  const text = await table.locator('tbody tr').first().textContent()
  return text?.replace(/\s+/g, ' ').trim() ?? ''
}

test('renders the table without crashing', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    const table = page.locator('table').first()

    await expect(table).toBeVisible()
    await expect(table.locator('thead th').first()).toBeVisible()
    await expect(table.locator('tbody tr').first()).toBeVisible()
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('regenerates table data', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    const table = page.locator('table').first()
    const bodyRows = table.locator('tbody tr')
    const regenerateButton = page.getByRole('button', {
      name: /^Regenerate Data$/i,
    })

    await expect(table).toBeVisible()
    await expect(bodyRows.first()).toBeVisible()
    await expect(regenerateButton).toBeVisible()

    const firstRowBefore = await getFirstBodyRowText(table)

    await regenerateButton.click()

    await expect.poll(() => getFirstBodyRowText(table)).not.toBe(firstRowBefore)
    await expect(bodyRows.first()).toBeVisible()
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('selects an inclusive cell range with Shift-click', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    const rows = page.locator('table').first().locator('tbody tr')
    await expect(rows.first()).toBeVisible()

    await rows.nth(0).locator('td').nth(0).click()
    await rows
      .nth(2)
      .locator('td')
      .nth(2)
      .click({ modifiers: ['Shift'] })

    await expect(page.locator('td.cell-selected')).toHaveCount(9)
    await expect(rows.nth(0).locator('td').nth(0)).toHaveClass(/cell-focused/)
    await expect(rows.nth(3).locator('td').nth(0)).not.toHaveClass(
      /cell-selected/,
    )
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})
