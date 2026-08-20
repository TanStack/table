import path from 'node:path'
import { expect, test } from '@playwright/test'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'
import type { Page } from '@playwright/test'

const exampleDir = path.resolve()

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

function headerCells(page: Page) {
  return page.locator('thead th')
}

/** Each resizable header carries a drag handle on its trailing edge. */
function resizer(page: Page, index: number) {
  return headerCells(page).nth(index).locator('.resizer')
}

async function widthOf(page: Page, index: number) {
  const box = await headerCells(page).nth(index).boundingBox()
  return box?.width ?? 0
}

/** Row data is random faker output, so `table.state` is the stable oracle. */
async function readState(page: Page) {
  const text = await page.getByTestId('table-state').first().textContent()

  return JSON.parse(text ?? '{}') as {
    columnSizing?: Record<string, number>
    columnResizing?: Record<string, unknown>
  }
}

async function dragResizer(page: Page, index: number, byPixels: number) {
  const box = await resizer(page, index).boundingBox()
  if (!box) throw new Error('Resizer bounds unavailable')

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(
    box.x + box.width / 2 + byPixels,
    box.y + box.height / 2,
    {
      steps: 5,
    },
  )
  await page.mouse.up()
}

async function getFirstBodyRowText(page: Page) {
  const text = await page.locator('tbody tr').first().textContent()
  return text?.replace(/\s+/g, ' ').trim() ?? ''
}

test('renders the table without crashing', async ({ page }) => {
  const errors = await openExample(page)

  await expect(page.locator('table').first()).toBeVisible()
  await expect(page.locator('tbody tr').first()).toBeVisible()
  // Every header offers a drag handle, and nothing is resized yet.
  await expect(page.locator('.resizer')).not.toHaveCount(0)
  expect((await readState(page)).columnSizing ?? {}).toEqual({})

  expect(errors).toEqual([])
})

test('regenerates table data', async ({ page }) => {
  const errors = await openExample(page)
  const regenerateButton = page.getByRole('button', {
    name: /^Regenerate Data$/i,
  })

  await expect(page.locator('tbody tr').first()).toBeVisible()

  const firstRowBefore = await getFirstBodyRowText(page)

  await regenerateButton.click()

  await expect.poll(() => getFirstBodyRowText(page)).not.toBe(firstRowBefore)

  expect(errors).toEqual([])
})

test('widens a column by dragging its resizer', async ({ page }) => {
  const errors = await openExample(page)
  const before = await widthOf(page, 0)

  await dragResizer(page, 0, 80)

  // The drag is recorded as an explicit size for that column.
  await expect
    .poll(async () => Object.keys((await readState(page)).columnSizing ?? {}))
    .toHaveLength(1)
  await expect.poll(() => widthOf(page, 0)).toBeGreaterThan(before + 40)

  expect(errors).toEqual([])
})

test('narrows a column by dragging its resizer back', async ({ page }) => {
  const errors = await openExample(page)

  await dragResizer(page, 0, 80)
  await expect
    .poll(async () => Object.keys((await readState(page)).columnSizing ?? {}))
    .toHaveLength(1)

  const widened = await widthOf(page, 0)

  await dragResizer(page, 0, -60)

  await expect.poll(() => widthOf(page, 0)).toBeLessThan(widened)

  expect(errors).toEqual([])
})

test('marks the handle while a drag is in progress', async ({ page }) => {
  const errors = await openExample(page)
  const box = await resizer(page, 0).boundingBox()
  if (!box) throw new Error('Resizer bounds unavailable')

  await expect(page.locator('.resizer.is-resizing')).toHaveCount(0)

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + 60, box.y + box.height / 2, { steps: 3 })

  // Exactly one handle is active mid-drag, which is what keeps the rest of the
  // header row from re-rendering.
  await expect(page.locator('.resizer.is-resizing')).toHaveCount(1)

  await page.mouse.up()

  await expect(page.locator('.resizer.is-resizing')).toHaveCount(0)

  expect(errors).toEqual([])
})

test('keeps column sizes when data is regenerated', async ({ page }) => {
  const errors = await openExample(page)

  await dragResizer(page, 0, 80)
  await expect
    .poll(async () => Object.keys((await readState(page)).columnSizing ?? {}))
    .toHaveLength(1)

  const sizing = (await readState(page)).columnSizing ?? {}

  // Sizing lives in table state, so replacing the rows must not reset it.
  await page.getByRole('button', { name: /^Regenerate Data$/i }).click()

  await expect(page.locator('tbody tr').first()).toBeVisible()
  expect((await readState(page)).columnSizing ?? {}).toEqual(sizing)

  expect(errors).toEqual([])
})
