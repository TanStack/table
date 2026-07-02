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

async function getFirstBodyRowText(table: Locator) {
  const text = await table.locator('tbody tr').first().textContent()
  return text?.replace(/\s+/g, ' ').trim() ?? ''
}

test('renders the table without crashing', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    const table = page.locator('table').nth(1)

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
    const table = page.locator('table').nth(1)
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
