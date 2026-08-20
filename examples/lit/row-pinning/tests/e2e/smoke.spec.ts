import path from 'node:path'
import { expect, test } from '@playwright/test'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'
import type { Page } from '@playwright/test'

const exampleDir = path.resolve()

/**
 * `makeData(1_000, 2, 2)` gives each row two children and each of those two
 * children, so pinning one row pins a subtree of seven while the include-leaf
 * and include-parent options are on.
 */
const SUBTREE_SIZE = 7

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

  await page.route(
    'https://unpkg.com/react-scan/dist/auto.global.js',
    (route) =>
      route.fulfill({
        contentType: 'application/javascript',
        body: '',
      }),
  )

  await page.goto(server.url)

  return errors
}

function bodyRows(page: Page) {
  return page.locator('tbody tr')
}

/**
 * The pin controls sit in each row's first cell. An unpinned row shows ⬆️ then
 * ⬇️; a pinned row shows a single ❌. Locating by position avoids matching on
 * emoji accessible names, which do not survive name normalisation.
 */
function pinControls(page: Page, rowIndex: number) {
  return bodyRows(page).nth(rowIndex).locator('td').first().getByRole('button')
}

function pageButton(page: Page, label: '<<' | '<' | '>' | '>>') {
  return page.getByRole('button', { name: label, exact: true })
}

/** Row data is random faker output, so `table.state` is the stable oracle. */
async function readRowPinning(page: Page) {
  const text = await page.getByTestId('table-state').textContent()
  const state = JSON.parse(text ?? '{}') as {
    rowPinning?: { top?: Array<string>; bottom?: Array<string> }
  }

  return {
    top: state.rowPinning?.top ?? [],
    bottom: state.rowPinning?.bottom ?? [],
  }
}

async function getRowText(page: Page, index: number) {
  const text = await bodyRows(page).nth(index).textContent()
  return text?.replace(/\s+/g, ' ').trim() ?? ''
}

test('renders the table without crashing', async ({ page }) => {
  const errors = await openExample(page)
  const table = page.locator('table').first()

  await expect(table).toBeVisible()
  await expect(bodyRows(page).first()).toBeVisible()
  expect(await readRowPinning(page)).toEqual({ top: [], bottom: [] })
  // An unpinned row offers both pin directions and no unpin control.
  await expect(pinControls(page, 0)).toHaveCount(2)
  await expect(pinControls(page, 0).nth(0)).toHaveText('⬆️')
  await expect(pinControls(page, 0).nth(1)).toHaveText('⬇️')

  expect(errors).toEqual([])
})

test('regenerates table data', async ({ page }) => {
  const errors = await openExample(page)
  const regenerateButton = page.getByRole('button', {
    name: /^Regenerate Data$/i,
  })

  await expect(bodyRows(page).first()).toBeVisible()

  const firstRowBefore = await getRowText(page, 0)

  await regenerateButton.click()

  await expect.poll(() => getRowText(page, 0)).not.toBe(firstRowBefore)

  expect(errors).toEqual([])
})

test('pins a row to the top', async ({ page }) => {
  const errors = await openExample(page)

  await pinControls(page, 2).nth(0).click()

  // Include-leaf and include-parent are on by default, so the row arrives with
  // its two children and their two children apiece.
  await expect
    .poll(async () => (await readRowPinning(page)).top)
    .toHaveLength(SUBTREE_SIZE)
  expect((await readRowPinning(page)).top[0]).toBe('2')
  expect((await readRowPinning(page)).bottom).toEqual([])

  // The pinned row is lifted to the front and swaps its controls for an unpin.
  await expect(pinControls(page, 0)).toHaveCount(1)
  await expect(pinControls(page, 0)).toHaveText('❌')

  expect(errors).toEqual([])
})

test('pins a row to the bottom', async ({ page }) => {
  const errors = await openExample(page)

  await pinControls(page, 1).nth(1).click()

  await expect
    .poll(async () => (await readRowPinning(page)).bottom)
    .toHaveLength(SUBTREE_SIZE)
  expect((await readRowPinning(page)).top).toEqual([])

  // The pinned subtree now sits at the very end of the table body.
  const lastIndex = (await bodyRows(page).count()) - 1
  await expect(pinControls(page, lastIndex)).toHaveText('❌')
  await expect(pinControls(page, 0)).toHaveCount(2)

  expect(errors).toEqual([])
})

test('unpins a row', async ({ page }) => {
  const errors = await openExample(page)

  await pinControls(page, 2).nth(0).click()
  await expect
    .poll(async () => (await readRowPinning(page)).top)
    .toHaveLength(SUBTREE_SIZE)

  await pinControls(page, 0).click()

  // Unpinning the parent releases the descendants that were pinned with it.
  await expect.poll(async () => (await readRowPinning(page)).top).toEqual([])
  await expect(pinControls(page, 0)).toHaveCount(2)
  await expect(pinControls(page, 0).nth(0)).toHaveText('⬆️')
  await expect(pinControls(page, 0).nth(1)).toHaveText('⬇️')

  expect(errors).toEqual([])
})

test('keeps pinned rows visible across pages', async ({ page }) => {
  const errors = await openExample(page)

  await pinControls(page, 2).nth(0).click()
  await expect
    .poll(async () => (await readRowPinning(page)).top)
    .toHaveLength(SUBTREE_SIZE)

  const pinnedText = await getRowText(page, 0)

  // `keepPinnedRows` is on by default, so paging away keeps the row on screen.
  await pageButton(page, '>').click()

  await expect.poll(() => getRowText(page, 0)).toBe(pinnedText)
  await expect(pinControls(page, 0)).toHaveText('❌')
  await expect
    .poll(async () => (await readRowPinning(page)).top)
    .toHaveLength(SUBTREE_SIZE)

  expect(errors).toEqual([])
})

// This example does not ship the keepPinnedRows / includeLeafRows /
// includeParentRows / copyPinnedRows option panel that the React example has,
// so the copy-pinned-rows behaviour is not covered here.
