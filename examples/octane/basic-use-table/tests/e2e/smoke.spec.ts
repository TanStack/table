import path from 'node:path'
import { expect, test } from '@playwright/test'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'
import type { Page } from '@playwright/test'

const exampleDir = path.resolve()

function collectPageErrors(page: Page) {
  const errors: Array<string> = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  return errors
}

async function openExample(page: Page) {
  const server = await startExampleServer(exampleDir)
  const errors = collectPageErrors(page)
  await page.goto(server.url)
  return { errors, server }
}

test('renders headers, rows, cells, and footers without errors', async ({
  page,
}) => {
  const { errors, server } = await openExample(page)
  try {
    const table = page.locator('table')
    await expect(table).toBeVisible()
    await expect(table.locator('thead th')).toHaveCount(6)
    await expect(table.locator('tbody tr')).toHaveCount(4)
    await expect(table.locator('tbody td').first()).toHaveText('tanner')
    await expect(table.locator('tfoot')).toBeVisible()
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})
