import path from 'node:path'
import { expect, test } from '@playwright/test'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'
import type { Locator, Page } from '@playwright/test'

const exampleDir = path.resolve()
const ROW_HEIGHT_FOR_TEST = 24

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

test('subtracts cells from a selection with Ctrl/Cmd', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    const start = cell(page, 1, 0)
    const end = cell(page, 3, 2)
    const center = cell(page, 2, 1)

    await start.click()
    await end.click({ modifiers: ['Shift'] })
    await expect(page.locator('[data-sheet-cell].cell-selected')).toHaveCount(9)

    await center.click({ modifiers: ['ControlOrMeta'] })

    await expect(page.locator('[data-sheet-cell].cell-selected')).toHaveCount(8)
    await expect(center).not.toHaveClass(/cell-selected/)
    await expect(center).toHaveClass(/cell-focused/)
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('keeps selection unchanged when opening a cell context menu', async ({
  page,
}) => {
  const { errors, server } = await openExample(page)

  try {
    const start = cell(page, 1, 0)
    const end = cell(page, 2, 1)
    const contextTarget = cell(page, 4, 3)

    await start.click()
    await end.click({ modifiers: ['Shift'] })
    await expect(page.locator('[data-sheet-cell].cell-selected')).toHaveCount(4)

    await contextTarget.click({ button: 'right' })

    await expect(page.getByRole('menu', { name: 'Cell actions' })).toBeVisible()
    await expect(page.locator('[data-sheet-cell].cell-selected')).toHaveCount(4)
    await expect(contextTarget).not.toHaveClass(/cell-selected|cell-focused/)
    await expect(start).toHaveClass(/cell-focused/)
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('selects ranges by dragging across column and row headers', async ({
  page,
}) => {
  const { errors, server } = await openExample(page)

  try {
    const columnA = page.getByRole('columnheader', { name: /^A/ })
    const columnC = page.getByRole('columnheader', { name: /^C/ })
    const columnABox = await columnA.boundingBox()
    const columnCBox = await columnC.boundingBox()
    if (!columnABox || !columnCBox)
      throw new Error('Column header drag bounds unavailable')

    await page.mouse.move(
      columnABox.x + columnABox.width / 2,
      columnABox.y + columnABox.height / 2,
    )
    await page.mouse.down()
    await page.mouse.move(
      columnCBox.x + columnCBox.width / 2,
      columnCBox.y + columnCBox.height / 2,
      { steps: 5 },
    )
    await page.mouse.up()

    for (const letter of ['A', 'B', 'C']) {
      await expect(
        page.getByRole('columnheader', { name: new RegExp(`^${letter}`) }),
      ).toHaveAttribute('aria-selected', 'true')
    }
    await expect(
      page.getByRole('columnheader', { name: /^D/ }),
    ).toHaveAttribute('aria-selected', 'false')

    const row2 = page.getByRole('button', {
      name: 'Select row 2',
      exact: true,
    })
    const row5 = page.getByRole('button', {
      name: 'Select row 5',
      exact: true,
    })
    const row2Box = await row2.boundingBox()
    const row5Box = await row5.boundingBox()
    if (!row2Box || !row5Box)
      throw new Error('Row header drag bounds unavailable')

    await page.mouse.move(
      row2Box.x + row2Box.width / 2,
      row2Box.y + row2Box.height / 2,
    )
    await page.mouse.down()
    await page.mouse.move(
      row5Box.x + row5Box.width / 2,
      row5Box.y + row5Box.height / 2,
      { steps: 5 },
    )
    await page.mouse.up()

    for (const rowNumber of [2, 3, 4, 5]) {
      await expect(
        page.getByRole('button', {
          name: `Select row ${rowNumber}`,
          exact: true,
        }),
      ).toHaveAttribute('aria-selected', 'true')
    }
    await expect(
      page.getByRole('button', { name: 'Select row 6', exact: true }),
    ).toHaveAttribute('aria-selected', 'false')
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

test('auto-fits a column beyond the default width cap on resize double-click', async ({
  page,
}) => {
  const { errors, server } = await openExample(page)

  try {
    const target = cell(page, 1, 0)
    const row = target.locator('..')
    const longValue = 'W'.repeat(80)

    await replaceCellValue(target, longValue)
    await expect(target).toHaveText(longValue)
    await expect(target.locator('.cell-value')).toHaveCSS(
      'white-space',
      'nowrap',
    )
    await expect(row).toHaveCSS('height', `${ROW_HEIGHT_FOR_TEST}px`)

    const widthBefore = (await target.boundingBox())?.width ?? 0
    await page.getByRole('separator', { name: 'Resize column A' }).dblclick()

    await expect
      .poll(async () => (await target.boundingBox())?.width ?? 0)
      .toBeGreaterThan(Math.max(420, widthBefore))
    await expect(row).toHaveCSS('height', `${ROW_HEIGHT_FOR_TEST}px`)
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
    await target.click()
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

test('uses scoped hotkeys for grid navigation and range extension', async ({
  page,
}) => {
  const { errors, server } = await openExample(page)

  try {
    await cell(page, 1, 1).click()
    await page.keyboard.press('ArrowRight')
    await expect(cell(page, 1, 2)).toHaveClass(/cell-focused/)

    await page.keyboard.press('Shift+ArrowDown')
    await expect(cell(page, 1, 2)).toHaveClass(/cell-selected/)
    await expect(cell(page, 2, 2)).toHaveClass(/cell-selected|cell-focused/)

    await page.keyboard.press('Tab')
    await expect(cell(page, 1, 3)).toHaveClass(/cell-focused/)
    await page.keyboard.press('Enter')
    await expect(cell(page, 2, 3)).toHaveClass(/cell-focused/)
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('uses hotkeys for editing, clearing, history, and select all', async ({
  page,
}) => {
  const { errors, server } = await openExample(page)

  try {
    const target = cell(page, 1, 0)
    const original = await target.textContent()

    await target.click()
    await page.keyboard.press('F2')
    const editor = target.getByRole('textbox')
    await expect(editor).toBeVisible()
    await editor.fill('Hotkey edit')
    await editor.press('Enter')
    await expect(target).toHaveText('Hotkey edit')

    await target.click()
    await page.keyboard.press('Backspace')
    await expect(target).toHaveText('')
    await page.keyboard.press('ControlOrMeta+z')
    await expect(target).toHaveText('Hotkey edit')
    await page.keyboard.press('ControlOrMeta+Shift+z')
    await expect(target).toHaveText('')
    await page.keyboard.press('ControlOrMeta+z')
    await expect(target).toHaveText('Hotkey edit')
    await page.keyboard.press('ControlOrMeta+y')
    await expect(target).toHaveText('')

    await cell(page, 1, 1).click()
    await page.keyboard.press('x')
    const replacementEditor = cell(page, 1, 1).getByRole('textbox')
    await expect(replacementEditor).toHaveValue('x')
    await replacementEditor.press('Escape')

    await target.click()
    await page.keyboard.press('ControlOrMeta+a')
    await expect(page.getByText('200,000 selected')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByText('0 selected')).toBeVisible()

    expect(original).not.toBeNull()
    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('keeps grid hotkeys out of editors and preserves native clipboard events', async ({
  page,
}) => {
  const { errors, server } = await openExample(page)

  try {
    const target = cell(page, 1, 0)
    await target.click()

    const valueBar = page.getByRole('textbox', { name: 'Cell value' })
    await valueBar.fill('Formula input')
    await valueBar.press('ArrowLeft')
    await expect(valueBar).toHaveValue('Formula input')

    await target.dblclick()
    const editor = target.getByRole('textbox')
    await editor.fill('Cell editor')
    await editor.press('ArrowLeft')
    await expect(editor).toHaveValue('Cell editor')
    await editor.press('Escape')

    const copied = await page.getByRole('grid').evaluate((grid) => {
      const data = new DataTransfer()
      grid.dispatchEvent(
        new ClipboardEvent('copy', {
          bubbles: true,
          cancelable: true,
          clipboardData: data,
        }),
      )
      return data.getData('text/plain')
    })
    expect(copied.length).toBeGreaterThan(0)
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

test('merges and unmerges cells Excel-style', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    const coveredValue = await cell(page, 2, 2).textContent()

    // Select B2:C3 (data rows 1-2, columns 1-2), away from the frozen row and
    // column, then merge from the ribbon.
    await cell(page, 1, 1).hover()
    await page.mouse.down()
    await cell(page, 2, 2).hover()
    await page.mouse.up()

    await page.getByRole('button', { name: /Merge & center/ }).click()

    const merged = page.locator('[data-merged-cell]')
    await expect(merged).toHaveCount(1)
    await expect(merged).toHaveAttribute('aria-rowspan', '2')
    await expect(merged).toHaveAttribute('aria-colspan', '2')

    // Covered cells stop rendering; the anchor renders as the merged cell.
    await expect(cell(page, 1, 2)).toHaveCount(0)
    await expect(cell(page, 2, 1)).toHaveCount(0)
    await expect(cell(page, 2, 2)).toHaveCount(0)
    await expect(cell(page, 1, 1)).toHaveAttribute('data-merged-cell', 'true')

    // The still-selected region now counts the merge once.
    await expect(page.locator('.selection-summary')).toContainText('1 selected')

    // The overlay is drawn in canvas coordinates: it must line up with the
    // grid geometry it replaces, spanning both columns and both rows.
    const mergedBox = (await merged.boundingBox())!
    const belowBox = (await cell(page, 3, 1).boundingBox())!
    const rightBox = (await cell(page, 1, 3).boundingBox())!
    expect(Math.abs(mergedBox.x - belowBox.x)).toBeLessThan(1.5)
    expect(Math.abs(mergedBox.y - rightBox.y)).toBeLessThan(1.5)
    expect(Math.abs(mergedBox.y + mergedBox.height - belowBox.y)).toBeLessThan(
      1.5,
    )
    expect(mergedBox.width).toBeGreaterThan(rightBox.x - mergedBox.x - 1.5)

    // The ribbon button flips to unmerge while the merge is selected.
    const unmergeButton = page.getByRole('button', { name: /Unmerge cells/ })
    await expect(unmergeButton).toHaveAttribute('aria-pressed', 'true')
    await unmergeButton.click()

    await expect(merged).toHaveCount(0)
    // Covered values were preserved, so unmerging restores them.
    await expect(cell(page, 2, 2)).toHaveText(coveredValue ?? '')

    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('expands selection and navigation across a merged cell', async ({
  page,
}) => {
  const { errors, server } = await openExample(page)

  try {
    await cell(page, 1, 1).hover()
    await page.mouse.down()
    await cell(page, 2, 2).hover()
    await page.mouse.up()
    await page.getByRole('button', { name: /Merge & center/ }).click()
    await expect(page.locator('[data-merged-cell]')).toHaveCount(1)

    // Drag from below the merge into it: the selection expands to the merge's
    // full 2x2 extent, so rows 1-4 across both columns select as one region.
    await cell(page, 4, 1).hover()
    await page.mouse.down()
    await cell(page, 1, 1).hover()
    await page.mouse.up()

    // One merge plus the four plain cells of rows 3-4.
    await expect(page.locator('.selection-summary')).toContainText('5 selected')
    await expect(page.locator('[data-merged-cell]')).toHaveClass(
      /cell-selected/,
    )

    // Arrow navigation treats the merge as a single stop: up from row 3
    // focuses the merge anchor in one step.
    await cell(page, 3, 1).click()
    await page.keyboard.press('ArrowUp')
    await expect(page.locator('[data-merged-cell]')).toHaveClass(/cell-focused/)

    // Ctrl/Cmd+M unmerges from the keyboard.
    await page.keyboard.press('ControlOrMeta+m')
    await expect(page.locator('[data-merged-cell]')).toHaveCount(0)

    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('merges a horizontal single-row selection', async ({ page }) => {
  const { errors, server } = await openExample(page)

  try {
    // Select B2:D2 (one data row, three columns) and merge.
    await cell(page, 1, 1).hover()
    await page.mouse.down()
    await cell(page, 1, 3).hover()
    await page.mouse.up()
    await page.getByRole('button', { name: /Merge & center/ }).click()

    const merged = page.locator('[data-merged-cell]')
    await expect(merged).toHaveCount(1)
    await expect(merged).toHaveAttribute('aria-rowspan', '1')
    await expect(merged).toHaveAttribute('aria-colspan', '3')

    // Covered neighbours stop rendering while the row keeps its geometry: the
    // merged cell spans from column B's left edge to column D's right edge.
    await expect(cell(page, 1, 2)).toHaveCount(0)
    await expect(cell(page, 1, 3)).toHaveCount(0)
    const mergedBox = (await merged.boundingBox())!
    const belowLeftBox = (await cell(page, 2, 1).boundingBox())!
    const belowRightBox = (await cell(page, 2, 3).boundingBox())!
    expect(Math.abs(mergedBox.x - belowLeftBox.x)).toBeLessThan(1.5)
    expect(
      Math.abs(
        mergedBox.x + mergedBox.width - (belowRightBox.x + belowRightBox.width),
      ),
    ).toBeLessThan(1.5)

    // Unmerge restores the individual cells.
    await page.getByRole('button', { name: /Unmerge cells/ }).click()
    await expect(merged).toHaveCount(0)
    await expect(cell(page, 1, 3)).toHaveCount(1)

    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('merges cells inside the frozen column and keeps them sticky', async ({
  page,
}) => {
  const { errors, server } = await openExample(page)

  try {
    // Select A2:A4, entirely inside the frozen first column, and merge.
    await cell(page, 1, 0).hover()
    await page.mouse.down()
    await cell(page, 3, 0).hover()
    await page.mouse.up()
    await page.getByRole('button', { name: /Merge & center/ }).click()

    const merged = page.locator('[data-merged-cell]')
    await expect(merged).toHaveCount(1)
    await expect(merged).toHaveAttribute('aria-rowspan', '3')
    await expect(cell(page, 2, 0)).toHaveCount(0)
    await expect(cell(page, 3, 0)).toHaveCount(0)

    // The merged cell sticks with the frozen column while the grid scrolls
    // horizontally.
    const before = (await merged.boundingBox())!
    await page.getByTestId('spreadsheet-grid').evaluate((element) => {
      element.scrollLeft = 400
      element.dispatchEvent(new Event('scroll'))
    })
    await expect
      .poll(async () => (await merged.boundingBox())!.x)
      .toBeLessThan(before.x + 1.5)
    expect(Math.abs((await merged.boundingBox())!.x - before.x)).toBeLessThan(
      1.5,
    )

    // A selection that mixes frozen and scrolling columns cannot merge.
    await cell(page, 5, 0).hover()
    await page.mouse.down()
    await cell(page, 6, 1).hover()
    await page.mouse.up()
    await expect(
      page.getByRole('button', { name: /Merge & center/ }),
    ).toBeDisabled()

    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})

test('clips a scrolling merged cell at the frozen column edge', async ({
  page,
}) => {
  const { errors, server } = await openExample(page)

  try {
    await cell(page, 1, 1).hover()
    await page.mouse.down()
    await cell(page, 3, 2).hover()
    await page.mouse.up()
    await page.getByRole('button', { name: /Merge & center/ }).click()
    await expect(page.locator('[data-merged-cell]')).toHaveCount(1)

    // Scrolling right slides the merge toward the sticky gutter and frozen
    // column; the layer's clip keeps it underneath instead of painting over.
    await page.getByTestId('spreadsheet-grid').evaluate((element) => {
      element.scrollLeft = 260
      element.dispatchEvent(new Event('scroll'))
    })

    await expect
      .poll(async () => {
        const grid = page.getByTestId('spreadsheet-grid')
        return grid.evaluate((element) => {
          const layer = element.querySelector<HTMLElement>('.merge-layer')
          return layer?.style.clipPath ?? ''
        })
      })
      .toContain('inset')

    // The frozen column's cells stay visible at the pinned edge: the topmost
    // element there is a pinned cell, not the merged overlay.
    const coveredByMerge = await page
      .getByTestId('spreadsheet-grid')
      .evaluate((element) => {
        const rect = element.getBoundingClientRect()
        const probe = document.elementFromPoint(rect.left + 80, rect.top + 80)
        return probe?.closest('[data-merged-cell]') !== null
      })
    expect(coveredByMerge).toBe(false)

    expect(errors).toEqual([])
  } finally {
    await server.close()
  }
})
