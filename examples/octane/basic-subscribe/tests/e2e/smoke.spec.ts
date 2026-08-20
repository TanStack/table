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

test('updates global-filter, projected, identity, and whole-store islands independently', async ({
  page,
}) => {
  const { errors, server } = await openExample(page)
  try {
    const rows = page.locator('[data-testid="row-model-subscription"] tr')
    await expect(rows).toHaveCount(10)

    const globalFilter = page.getByRole('textbox', { name: 'Global filter' })
    await globalFilter.fill('tanner')
    await expect.poll(() => rows.count()).toBeLessThan(10)
    await globalFilter.fill('')
    await expect(rows).toHaveCount(10)

    const rowCheckbox = page
      .getByRole('checkbox', { name: /^Select row / })
      .first()
    await rowCheckbox.check()
    await expect(
      page.locator('[data-testid="identity-source-subscription"]'),
    ).toContainText('1 of')
    await expect(
      page.locator('[data-testid="whole-store-subscription"]'),
    ).toContainText('"rowSelection"')
    await expect(rowCheckbox).toBeChecked()
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})
