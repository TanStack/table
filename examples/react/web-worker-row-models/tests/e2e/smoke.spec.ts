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
  await page.waitForTimeout(250)
  if (errors.length) {
    throw new Error(`Page failed during hydration:\n${errors.join('\n')}`)
  }

  // SSR: wait for the jank meter's effect to prove hydration before interacting.
  // Do not depend on requestAnimationFrame, which browsers may throttle.
  try {
    await page.waitForFunction(
      () => {
        const dot = document.querySelector<HTMLElement>('.jank-dot')
        return dot?.dataset.hydrated === 'true'
      },
      undefined,
      { timeout: 5_000 },
    )
  } catch {
    const diagnostics = await page.evaluate(() => ({
      readyState: document.readyState,
      scripts: Array.from(document.scripts).map((script) => ({
        src: script.src,
        type: script.type,
      })),
    }))
    throw new Error(`Hydration diagnostics: ${JSON.stringify(diagnostics)}`)
  }

  return { errors, server }
}

async function getFirstBodyRowText(table: Locator) {
  const text = await table.locator('tbody tr').first().textContent()
  return text?.replace(/\s+/g, ' ').trim() ?? ''
}

test('renders worker-generated rows without crashing', async ({ page }) => {
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

test('sorts via the worker when a header is clicked', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    const table = page.locator('table').first()
    const bodyRows = table.locator('tbody tr')

    await expect(bodyRows.first()).toBeVisible()

    const firstRowBefore = await getFirstBodyRowText(table)

    await page.getByText('Age', { exact: true }).click()

    await expect.poll(() => getFirstBodyRowText(table)).not.toBe(firstRowBefore)
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('filters via the worker when typing in the search box', async ({
  page,
}) => {
  const { errors, server } = await openExample(page)

  try {
    const table = page.locator('table').first()
    const bodyRows = table.locator('tbody tr')

    await expect(bodyRows.first()).toBeVisible()

    await page.getByPlaceholder('Search name or status...').fill('complicated')

    await expect.poll(() => getFirstBodyRowText(table)).toContain('complicated')
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('groups via the worker when a grouping toggle is clicked', async ({
  page,
}) => {
  const { errors, server } = await openExample(page)

  try {
    const table = page.locator('table').first()
    const bodyRows = table.locator('tbody tr')

    await expect(bodyRows.first()).toBeVisible()

    // Group by Status: first row becomes a collapsed group row with an
    // expander and a leaf count.
    await page.locator('th', { hasText: 'Status' }).getByRole('button').click()

    await expect.poll(() => getFirstBodyRowText(table)).toContain('👉')
    await expect.poll(() => getFirstBodyRowText(table)).toMatch(/\(\d/)
    await expect.poll(() => getFirstBodyRowText(table)).toContain('Median')
    await expect.poll(() => getFirstBodyRowText(table)).toContain('Range')

    // Expand the first group: leaf rows appear beneath it.
    await table.locator('tbody button').first().click()
    await expect.poll(() => getFirstBodyRowText(table)).toContain('👇')

    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('selects rows on the main thread', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    const table = page.locator('table').first()
    const bodyRows = table.locator('tbody tr')

    await expect(bodyRows.first()).toBeVisible()

    const firstRowCheckbox = bodyRows.first().locator('input[type="checkbox"]')
    await firstRowCheckbox.check()

    await expect(firstRowCheckbox).toBeChecked()
    await expect(page.getByText(/1 selected/)).toBeVisible()

    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})
