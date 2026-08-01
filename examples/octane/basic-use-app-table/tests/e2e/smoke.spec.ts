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

test('renders registered composition components and context renderers', async ({
  page,
}) => {
  const { errors, server } = await openExample(page)
  try {
    await expect(page.locator('[data-registered-header]')).toHaveCount(6)
    await expect(page.locator('[data-registered-cell]')).toHaveCount(24)
    await expect(page.locator('tbody td').first()).toContainText('tanner')
    await expect(page.locator('tfoot th').first()).toContainText('firstName')
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})
