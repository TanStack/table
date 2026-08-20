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

test('updates sorting indicators', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    const sortableHeader = page.locator('.sortable-header').first()

    await expect(sortableHeader).toBeVisible()
    await sortableHeader.click()
    await expect(sortableHeader).toContainText(/🔼|🔽/)
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('updates header and cell widths while resizing', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    const resizer = page.locator('.resizer').first()
    const header = resizer.locator('..')
    const cell = page.locator('tbody td:not(.left-column-spacer)').first()

    await expect(resizer).toBeVisible()
    await expect(cell).toBeVisible()

    const headerWidthBefore = await header.evaluate(
      (element) => element.getBoundingClientRect().width,
    )
    const cellWidthBefore = await cell.evaluate(
      (element) => element.getBoundingClientRect().width,
    )
    const box = await resizer.boundingBox()
    if (!box) throw new Error('Failed to measure the column resizer')

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    await expect(resizer).toHaveClass(/isResizing/)
    await page.mouse.move(box.x + box.width / 2 + 80, box.y + box.height / 2)

    await expect
      .poll(() =>
        header.evaluate((element) => element.getBoundingClientRect().width),
      )
      .toBeGreaterThan(headerWidthBefore + 40)
    await expect
      .poll(() =>
        cell.evaluate((element) => element.getBoundingClientRect().width),
      )
      .toBeGreaterThan(cellWidthBefore + 40)

    await page.mouse.up()
    await expect(resizer).not.toHaveClass(/isResizing/)
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})
