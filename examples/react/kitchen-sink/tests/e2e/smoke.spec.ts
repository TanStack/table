import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
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

test('exposes cell selection and spans adjacent status values', async ({
  page,
}) => {
  const { errors, server } = await openExample(page)

  try {
    const table = page.locator('table').first()
    await expect(
      table.locator('tbody td.cell-selectable').first(),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Select all cells' }),
    ).toBeVisible()

    const statusHeader = table.locator('th').filter({ hasText: 'Status' })
    await statusHeader.locator('.sortable-header').click()
    await expect(table.locator('tbody td[rowspan="2"]').first()).toBeVisible()
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('does not render undefined names on grouped rows', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    const table = page.locator('table').first()
    const visitsHeader = table.locator('th').filter({ hasText: 'Visits' })

    await visitsHeader.getByTitle('Group by this column').click()

    await expect(table.locator('tbody')).not.toContainText('undefined')
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})
