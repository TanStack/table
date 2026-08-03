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

/** Header rows run group to leaf, so the leaf row holds the data columns. */
function leafHeaderCells(page: Page) {
  return page.locator('thead tr').last().locator('th')
}

function leafHeader(page: Page, name: string) {
  return leafHeaderCells(page).filter({ hasText: name })
}

/** An unpinned header offers `<=` and `=>`; a pinned one swaps in `X`. */
function pinButton(page: Page, name: string, label: '<=' | 'X' | '=>') {
  return leafHeader(page, name).getByRole('button', {
    name: label,
    exact: true,
  })
}

function scrollContainer(page: Page) {
  return page.locator('.table-container')
}

/** Row data is random faker output, so `table.state` is the stable oracle. */
async function readColumnPinning(page: Page) {
  const text = await page.getByTestId('table-state').textContent()
  const state = JSON.parse(text ?? '{}') as {
    columnPinning?: { start?: Array<string>; end?: Array<string> }
  }

  return {
    start: state.columnPinning?.start ?? [],
    end: state.columnPinning?.end ?? [],
  }
}

/**
 * Scrolls the container as far right as it goes and returns the distance
 * travelled. How much room there is depends on the viewport, so the tests work
 * from the real value rather than assuming one.
 */
async function scrollToEnd(page: Page) {
  const maxScroll = await scrollContainer(page).evaluate(
    (element) => element.scrollWidth - element.clientWidth,
  )

  expect(maxScroll).toBeGreaterThan(50)

  await scrollContainer(page).evaluate((element) => {
    element.scrollLeft = element.scrollWidth
    element.dispatchEvent(new Event('scroll'))
  })

  await expect
    .poll(() => scrollContainer(page).evaluate((element) => element.scrollLeft))
    .toBeGreaterThan(maxScroll - 2)

  return maxScroll
}

async function getFirstBodyRowText(page: Page) {
  const text = await page.locator('tbody tr').first().textContent()
  return text?.replace(/\s+/g, ' ').trim() ?? ''
}

test('renders the table without crashing', async ({ page }) => {
  const errors = await openExample(page)

  await expect(page.locator('table').first()).toBeVisible()
  await expect(page.locator('tbody tr')).toHaveCount(20)
  await expect(scrollContainer(page)).toBeVisible()
  expect(await readColumnPinning(page)).toEqual({ start: [], end: [] })
  // Unpinned columns scroll with the rest, so they are not sticky.
  await expect(leafHeaderCells(page).first()).toHaveCSS('position', 'relative')

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
  await expect(page.locator('tbody tr')).toHaveCount(20)

  expect(errors).toEqual([])
})

test('makes a pinned column sticky', async ({ page }) => {
  const errors = await openExample(page)

  await pinButton(page, 'Visits', '<=').click()

  await expect
    .poll(async () => (await readColumnPinning(page)).start)
    .toEqual(['visits'])
  // Pinning switches the cell from relative to sticky and gives it an offset,
  // which is what actually holds it in place while the rest scrolls.
  await expect(leafHeader(page, 'Visits')).toHaveCSS('position', 'sticky')
  await expect(leafHeader(page, 'Visits')).toHaveCSS('left', '0px')

  expect(errors).toEqual([])
})

test('holds a start pinned column in place while scrolling', async ({
  page,
}) => {
  const errors = await openExample(page)

  await pinButton(page, 'Visits', '<=').click()
  await expect(leafHeader(page, 'Visits')).toHaveCSS('position', 'sticky')

  const pinnedBefore = await leafHeader(page, 'Visits').boundingBox()
  const unpinnedBefore = await leafHeader(page, 'Status').boundingBox()

  const scrolled = await scrollToEnd(page)

  const pinnedAfter = await leafHeader(page, 'Visits').boundingBox()
  const unpinnedAfter = await leafHeader(page, 'Status').boundingBox()

  // The pinned header stays put while its unpinned neighbour travels left by
  // the full scroll distance. That difference is the whole point of sticky.
  expect(Math.abs((pinnedAfter?.x ?? 0) - (pinnedBefore?.x ?? 0))).toBeLessThan(
    2,
  )
  expect((unpinnedBefore?.x ?? 0) - (unpinnedAfter?.x ?? 0)).toBeGreaterThan(
    scrolled - 2,
  )

  expect(errors).toEqual([])
})

test('unpins a column back into the scrolling area', async ({ page }) => {
  const errors = await openExample(page)

  await pinButton(page, 'Visits', '<=').click()
  await expect(leafHeader(page, 'Visits')).toHaveCSS('position', 'sticky')

  await pinButton(page, 'Visits', 'X').click()

  await expect
    .poll(() => readColumnPinning(page))
    .toEqual({ start: [], end: [] })
  await expect(leafHeader(page, 'Visits')).toHaveCSS('position', 'relative')

  expect(errors).toEqual([])
})
