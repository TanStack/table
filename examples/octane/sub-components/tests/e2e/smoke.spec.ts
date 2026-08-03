import path from 'node:path'
import { expect, test } from '@playwright/test'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'
import type { Page } from '@playwright/test'

const exampleDir = path.resolve()

const TOTAL_ROWS = 10

let server: Awaited<ReturnType<typeof startExampleServer>> | undefined

test.beforeAll(async () => {
  // One server for the whole file. A cold Vite start costs more than a test.
  test.setTimeout(180_000)
  server = await startExampleServer(exampleDir)
})

test.afterAll(async () => {
  await server?.close()
})

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
  if (!server) throw new Error('Example server failed to start')

  const errors = collectPageErrors(page)

  await page.goto(server.url)

  return errors
}

function bodyRows(page: Page) {
  return page.locator('tbody tr')
}

/** Every data row carries an expander in its first cell. */
function rowExpander(page: Page, index: number) {
  return bodyRows(page).nth(index).getByRole('button')
}

/** The sub component renders the row's own data as JSON inside a `<pre>`. */
function subComponents(page: Page) {
  return page.locator('tbody pre')
}

async function readSubComponentJson(page: Page, index: number) {
  const text = await subComponents(page).nth(index).textContent()
  return JSON.parse(text ?? '{}') as Record<string, unknown>
}

async function getFirstBodyRowText(page: Page) {
  const text = await bodyRows(page).first().textContent()
  return text?.replace(/\s+/g, ' ').trim() ?? ''
}

test('renders the table without crashing', async ({ page }) => {
  const errors = await openExample(page)
  const table = page.locator('table').first()

  await expect(table).toBeVisible()
  await expect(bodyRows(page)).toHaveCount(TOTAL_ROWS)
  // Nothing is expanded, so no sub component rows exist yet.
  await expect(subComponents(page)).toHaveCount(0)
  await expect(rowExpander(page, 0)).toHaveText('👉')

  expect(errors).toEqual([])
})

test('regenerates table data', async ({ page }) => {
  const errors = await openExample(page)
  const regenerateButton = page.getByRole('button', {
    name: /^Regenerate Data$/i,
  })

  await expect(bodyRows(page).first()).toBeVisible()

  const firstRowBefore = await getFirstBodyRowText(page)

  await regenerateButton.click()

  await expect.poll(() => getFirstBodyRowText(page)).not.toBe(firstRowBefore)
  await expect(bodyRows(page)).toHaveCount(TOTAL_ROWS)

  expect(errors).toEqual([])
})

test('expands a row to reveal its sub component', async ({ page }) => {
  const errors = await openExample(page)

  await rowExpander(page, 0).click()

  await expect(rowExpander(page, 0)).toHaveText('👇')
  await expect(subComponents(page)).toHaveCount(1)
  // The sub component adds a full width row directly beneath its parent.
  await expect(bodyRows(page)).toHaveCount(TOTAL_ROWS + 1)
  await expect(bodyRows(page).nth(1).locator('td')).toHaveCount(1)

  await rowExpander(page, 0).click()

  await expect(rowExpander(page, 0)).toHaveText('👉')
  await expect(subComponents(page)).toHaveCount(0)
  await expect(bodyRows(page)).toHaveCount(TOTAL_ROWS)

  expect(errors).toEqual([])
})

test('renders the expanded row own data in the sub component', async ({
  page,
}) => {
  const errors = await openExample(page)

  // Read a value straight out of the row before opening it, so the sub
  // component can be checked against its own parent rather than any row.
  const ageCell = await bodyRows(page)
    .first()
    .locator('td')
    .nth(3)
    .textContent()

  await rowExpander(page, 0).click()
  await expect(subComponents(page)).toHaveCount(1)

  const original = await readSubComponentJson(page, 0)
  expect(original['age']).toBe(Number(ageCell?.trim()))
  expect(original).toHaveProperty('firstName')
  expect(original).toHaveProperty('status')

  expect(errors).toEqual([])
})

test('keeps several sub components open at once', async ({ page }) => {
  const errors = await openExample(page)

  await rowExpander(page, 0).click()
  await expect(subComponents(page)).toHaveCount(1)

  // Row 1 is now the first sub component row, so the next data row is row 2.
  await rowExpander(page, 2).click()

  await expect(subComponents(page)).toHaveCount(2)
  await expect(bodyRows(page)).toHaveCount(TOTAL_ROWS + 2)
  await expect(rowExpander(page, 0)).toHaveText('👇')
  await expect(rowExpander(page, 2)).toHaveText('👇')

  // Collapsing one leaves the other open.
  await rowExpander(page, 0).click()

  await expect(subComponents(page)).toHaveCount(1)
  await expect(bodyRows(page)).toHaveCount(TOTAL_ROWS + 1)

  expect(errors).toEqual([])
})
