import path from 'node:path'
import { expect, test } from '@playwright/test'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'
import type { Locator, Page } from '@playwright/test'

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

  try {
    await page.goto(server.url)
    await expect(page.getByRole('grid')).toBeVisible()
    return { errors, server }
  } catch (error) {
    await server.close()
    throw error
  }
}

function cell(page: Page, rowIndex: number, columnIndex: number) {
  return page.locator(
    `[data-row-id="row-7-${rowIndex}"][data-column-id="column-${columnIndex}"]`,
  )
}

function displayedCell(page: Page, rowIndex: number, columnIndex: number) {
  return page.locator(
    `[data-row-index="${rowIndex}"] [data-column-id="column-${columnIndex}"]`,
  )
}

async function replaceCellValue(target: Locator, value: string) {
  await target.dblclick()
  const editor = target.getByRole('textbox')
  await editor.fill(value)
  await editor.press('Enter')
}

test('renders a virtualized spreadsheet without page errors', async ({
  page,
}) => {
  const { errors, server } = await openExample(page)

  try {
    await expect(page.getByText('TanStack Sheet')).toBeVisible()
    await expect(page.getByText('2,000 × 100')).toBeVisible()
    await expect(page.getByRole('columnheader', { name: /^A/ })).toBeVisible()
    await expect(cell(page, 0, 0)).toBeVisible()
    await expect(cell(page, 0, 0)).toHaveText('Account')
    await expect(cell(page, 0, 1)).toHaveText('Owner')
    await expect(page.getByRole('grid')).toHaveCSS('user-select', 'none')

    const renderedCells = await page.locator('[data-sheet-cell]').count()
    expect(renderedCells).toBeGreaterThan(0)
    expect(renderedCells).toBeLessThan(2_000)
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('edits a cell and supports atomic undo and redo', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    const target = cell(page, 1, 0)
    const original = await target.textContent()

    await replaceCellValue(target, 'Edited account')
    await expect(target).toContainText('Edited account')

    await page.getByRole('button', { name: 'Undo' }).click()
    await expect(target).toHaveText(original ?? '')

    await page.getByRole('button', { name: 'Redo' }).click()
    await expect(target).toContainText('Edited account')
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('edits the active cell from the fx value bar', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    const target = cell(page, 1, 0)
    const original = await target.textContent()

    await target.click()
    const valueBar = page.getByRole('textbox', { name: 'Cell value' })
    await expect(valueBar).toHaveValue(original ?? '')
    await valueBar.fill('Edited from fx')
    await expect(valueBar).toHaveValue('Edited from fx')
    await valueBar.press('Enter')

    await expect(target).toHaveText('Edited from fx')
    await page.getByRole('button', { name: 'Undo' }).click()
    await expect(target).toHaveText(original ?? '')
    await page.getByRole('button', { name: 'Redo' }).click()
    await expect(target).toHaveText('Edited from fx')
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('adds, switches, and navigates sheets and changes the zoom', async ({
  page,
}) => {
  const { errors, server } = await openExample(page)

  try {
    const sheet1 = page.getByRole('tab', { name: 'Sheet1' })
    await expect(sheet1).toHaveAttribute('aria-selected', 'true')

    await page.getByRole('button', { name: 'Add sheet' }).click()
    const sheet2 = page.getByRole('tab', { name: 'Sheet2' })
    await expect(sheet2).toHaveAttribute('aria-selected', 'true')

    const sheet2Target = displayedCell(page, 1, 0)
    await expect(sheet2Target).toHaveText('')
    await replaceCellValue(sheet2Target, 'Saved on Sheet2')

    await page.getByRole('button', { name: 'Previous sheet' }).click()
    await expect(sheet1).toHaveAttribute('aria-selected', 'true')
    await expect(displayedCell(page, 1, 0)).not.toHaveText('Saved on Sheet2')

    await page.getByRole('button', { name: 'Next sheet' }).click()
    await expect(sheet2).toHaveAttribute('aria-selected', 'true')
    await expect(displayedCell(page, 1, 0)).toHaveText('Saved on Sheet2')

    await sheet1.click()
    await expect(sheet1).toHaveAttribute('aria-selected', 'true')
    await sheet2.click()
    await expect(sheet2).toHaveAttribute('aria-selected', 'true')

    const canvas = page.locator('.spreadsheet-canvas')
    const widthAt100 =
      (await displayedCell(page, 0, 0).boundingBox())?.width ?? 0
    await page.getByRole('button', { name: 'Zoom in' }).click()
    await expect(page.locator('.zoom-control output')).toHaveText('110%')
    await expect(canvas).toHaveAttribute('data-zoom', '110')

    await page.getByRole('button', { name: 'Zoom out' }).click()
    await expect(page.locator('.zoom-control output')).toHaveText('100%')

    await page.getByRole('slider', { name: 'Zoom' }).fill('125')
    await expect(page.locator('.zoom-control output')).toHaveText('125%')
    await expect(canvas).toHaveAttribute('data-zoom', '125')
    await expect
      .poll(
        async () => (await displayedCell(page, 0, 0).boundingBox())?.width ?? 0,
      )
      .toBeGreaterThan(widthAt100 * 1.2)
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('extends a numeric series with the fill handle', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    await replaceCellValue(cell(page, 1, 5), '1')
    await replaceCellValue(cell(page, 2, 5), '3')

    await cell(page, 1, 5).click()
    await cell(page, 2, 5).click({ modifiers: ['Shift'] })

    const handle = page.getByTestId('fill-handle')
    const target = cell(page, 4, 5)
    await expect(handle).toBeVisible()
    await expect(target).toBeVisible()

    const handleBox = await handle.boundingBox()
    const targetBox = await target.boundingBox()
    if (!handleBox || !targetBox)
      throw new Error('Fill drag bounds unavailable')

    await page.mouse.move(
      handleBox.x + handleBox.width / 2,
      handleBox.y + handleBox.height / 2,
    )
    await page.mouse.down()
    await page.mouse.move(
      targetBox.x + targetBox.width / 2,
      targetBox.y + targetBox.height / 2,
      { steps: 5 },
    )
    await page.mouse.up()

    await expect(cell(page, 3, 5)).toHaveText('5')
    await expect(cell(page, 4, 5)).toHaveText('7')
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('filters and sorts from a column header menu', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    await page.getByRole('button', { name: 'Open C column menu' }).click()
    await page
      .getByRole('textbox', { name: 'Filter values containing' })
      .fill('North')
    await page.keyboard.press('Escape')

    await expect(cell(page, 0, 2)).toHaveText('Region')
    await expect(cell(page, 1, 2)).toHaveText('North')
    await expect(page.getByRole('grid')).toHaveAttribute('aria-rowcount', '401')

    const revenueBefore = Number(
      (await cell(page, 1, 4).textContent())?.replaceAll(',', ''),
    )
    await page.getByRole('button', { name: 'Open E column menu' }).click()
    await page.getByRole('button', { name: 'Sort Z → A' }).click()
    const revenueAfter = Number(
      (
        await page
          .locator('[data-row-index="1"] [data-column-id="column-4"]')
          .textContent()
      )?.replaceAll(',', ''),
    )

    expect(revenueAfter).toBeGreaterThanOrEqual(revenueBefore)
    await expect(cell(page, 0, 4)).toHaveText('Revenue')
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('keeps frozen rows and columns visible during two-axis scrolling', async ({
  page,
}) => {
  const { errors, server } = await openExample(page)

  try {
    const grid = page.getByRole('grid')
    const frozenCell = cell(page, 0, 0)
    const before = await frozenCell.boundingBox()
    if (!before) throw new Error('Frozen cell bounds unavailable')

    await grid.evaluate((element) => {
      element.scrollTop = 4_000
      element.scrollLeft = 4_000
      element.dispatchEvent(new Event('scroll'))
    })

    await expect
      .poll(() => grid.evaluate((element) => element.scrollTop))
      .toBeGreaterThan(3_000)
    await expect
      .poll(() => grid.evaluate((element) => element.scrollLeft))
      .toBeGreaterThan(3_000)

    await expect(frozenCell).toBeVisible()
    const after = await frozenCell.boundingBox()
    if (!after) throw new Error('Frozen cell bounds unavailable after scroll')

    expect(Math.abs(after.x - before.x)).toBeLessThan(2)
    expect(Math.abs(after.y - before.y)).toBeLessThan(2)
    await expect(
      page.locator('[data-column-id="column-30"]').first(),
    ).toBeVisible()
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('resizes a column without breaking the virtualized layout', async ({
  page,
}) => {
  const { errors, server } = await openExample(page)

  try {
    const target = cell(page, 0, 0)
    const before = await target.boundingBox()
    const resizer = page.getByRole('separator', { name: 'Resize column A' })
    const resizerBox = await resizer.boundingBox()
    if (!before || !resizerBox) throw new Error('Resize bounds unavailable')

    await page.mouse.move(
      resizerBox.x + resizerBox.width / 2,
      resizerBox.y + resizerBox.height / 2,
    )
    await page.mouse.down()
    await page.mouse.move(
      resizerBox.x + 50,
      resizerBox.y + resizerBox.height / 2,
    )
    await page.mouse.up()

    await expect
      .poll(async () => (await target.boundingBox())?.width ?? 0)
      .toBeGreaterThan(before.width + 30)
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('provides Excel-style ribbon and cell context actions', async ({
  page,
}) => {
  const { errors, server } = await openExample(page)

  try {
    await page.getByRole('tab', { name: 'View' }).click()
    await page.getByRole('combobox', { name: 'Freeze rows' }).selectOption('2')
    await expect(
      page.locator('.spreadsheet-row-frozen [data-sheet-cell]'),
    ).not.toHaveCount(0)

    const target = cell(page, 1, 0)
    await target.click({ button: 'right' })
    const menu = page.getByRole('menu', { name: 'Cell actions' })
    await expect(menu).toBeVisible()
    await expect(menu.getByRole('menuitem', { name: /Cut/ })).toBeVisible()
    await expect(menu.getByRole('menuitem', { name: /Copy/ })).toBeVisible()
    await expect(menu.getByRole('menuitem', { name: /Paste/ })).toBeVisible()

    const original = await target.textContent()
    await menu.getByRole('menuitem', { name: 'Clear contents' }).click()
    await expect(target).toHaveText('')
    await page.getByRole('button', { name: 'Undo' }).click()
    await expect(target).toHaveText(original ?? '')
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('keeps the 10k × 250 stress grid interactive', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    await page.getByRole('button', { name: 'Stress data' }).click()

    const grid = page.getByRole('grid')
    await expect(page.getByText('10,000 × 250')).toBeVisible()
    await expect(grid).toHaveAttribute('aria-rowcount', '10000')
    await expect(grid).toHaveAttribute('aria-colcount', '250')

    await page.getByRole('button', { name: 'Select all cells' }).click()
    await expect(page.getByText('2,500,000 selected')).toBeVisible()

    await grid.evaluate((element) => {
      element.scrollTop = 200_000
      element.scrollLeft = 20_000
      element.dispatchEvent(new Event('scroll'))
    })

    await expect
      .poll(() => grid.evaluate((element) => element.scrollTop))
      .toBeGreaterThan(150_000)
    await expect
      .poll(() => grid.evaluate((element) => element.scrollLeft))
      .toBeGreaterThan(15_000)

    const renderedCells = await page.locator('[data-sheet-cell]').count()
    expect(renderedCells).toBeGreaterThan(0)
    expect(renderedCells).toBeLessThan(2_000)
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})
