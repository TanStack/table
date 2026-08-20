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

test('renders generated columns and keeps sort, filter, and regeneration functional', async ({
  page,
}) => {
  const { errors, server } = await openExample(page)
  try {
    const headers = page.locator('thead th')
    await expect(headers.first()).toBeVisible()
    const rows = page.locator('tbody tr')
    await expect(rows).toHaveCount(15)

    const firstBeforeSort = await rows.first().innerText()
    await headers.first().locator('[title="Toggle sorting"]').click()
    await expect.poll(() => rows.first().innerText()).not.toBe(firstBeforeSort)

    const textFilter = page.locator('input[type="text"]').first()
    if (await textFilter.count()) {
      await textFilter.fill('a')
      await page.waitForTimeout(600)
      await expect(rows.first()).toBeVisible()
    }

    const beforeRefresh = await rows.first().innerText()
    await page.getByRole('button', { name: 'Regenerate Data' }).click()
    await expect.poll(() => rows.first().innerText()).not.toBe(beforeRefresh)
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})
