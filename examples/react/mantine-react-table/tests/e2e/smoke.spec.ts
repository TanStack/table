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

async function getFirstEmailText(page: Page) {
  const text = await page.getByText(/@/).first().textContent()
  return text?.replace(/\s+/g, ' ').trim() ?? ''
}

test('renders the table without crashing', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    await expect(
      page.getByRole('heading', { name: /Mantine React Table/i }),
    ).toBeVisible()
    await expect(page.getByText('First Name').first()).toBeVisible()
    await expect(page.getByText('Last Name').first()).toBeVisible()
    await expect(page.getByText('Email').first()).toBeVisible()
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('regenerates table data', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    const regenerateButton = page.getByRole('button', {
      name: /^Regenerate Data$/i,
    })

    await expect(regenerateButton).toBeVisible()

    const firstEmailBefore = await getFirstEmailText(page)

    await regenerateButton.click()

    await expect.poll(() => getFirstEmailText(page)).not.toBe(firstEmailBefore)
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})
