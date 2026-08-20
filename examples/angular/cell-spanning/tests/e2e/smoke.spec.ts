import path from 'node:path'
import { expect, test } from '@playwright/test'
import { startExampleServer } from '../../../../../tests/e2e/helpers/startExampleServer'
import type { Locator, Page } from '@playwright/test'

const exampleDir = path.resolve()

const LEAF_HEADERS = ['Region', 'Team', 'Shift', 'Employee', 'Hours', 'Status']
const DEFAULT_PAGE_SIZE = 12
/** Rows are emitted region-major: 3 teams x 3 shifts per region. */
const REGION_RUN = 9

let server: Awaited<ReturnType<typeof startExampleServer>> | undefined

test.beforeAll(async () => {
  // One server for the whole file. A cold Angular dev-server start costs more
  // than a test.
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

/** Panel one renders spans; panel two renders the same instance flat. */
function spanTable(page: Page) {
  return page.getByTestId('span-table')
}

function referenceTable(page: Page) {
  return page.getByTestId('reference-table')
}

function summaryTable(page: Page) {
  return page.getByTestId('summary-table')
}

/** Row data is random faker output, so `table.state` is the stable oracle. */
async function readState(page: Page) {
  const text = await page.getByTestId('table-state').textContent()

  return JSON.parse(text ?? '{}') as {
    sorting?: Array<{ id: string; desc: boolean }>
    columnFilters?: Array<{ id: string; value: unknown }>
    columnVisibility?: Record<string, boolean>
    pagination?: { pageIndex: number; pageSize: number }
  }
}

async function visibleLeafCount(page: Page) {
  const text = await page.getByTestId('visible-leaf-count').textContent()
  return Number(text ?? '0')
}

type SpanReport = {
  /** [row][column] resolved text, covered slots filled by their covering cell. */
  grid: Array<Array<string>>
  /** [row][column] id of the cell that owns the slot, for maximality checks. */
  origins: Array<Array<string>>
  /** Rows that contain a horizontally spanning cell (summary rows). */
  spannedRows: Array<number>
  structuralErrors: Array<string>
  geometryErrors: Array<string>
  zeroSpanCells: number
  rowSpanningCells: number
  tallestRowSpan: number
  cellCounts: Array<number>
}

/**
 * Rebuilds the logical table grid from the DOM the way the HTML table model
 * does, then checks it against the laid-out geometry. Browsers silently repair
 * malformed span tables (clamping overflow, sliding later cells into holes),
 * so the attributes alone are not enough: the grid says the attributes
 * describe a valid table, and the rects say the browser drew the table we
 * described.
 */
async function readSpanReport(table: Locator): Promise<SpanReport> {
  return table.evaluate((tableEl) => {
    const rows = Array.from(tableEl.querySelectorAll('tbody tr'))
    const leafHeaders = Array.from(
      tableEl.querySelectorAll('thead tr:last-child th'),
    ) as Array<HTMLTableCellElement>
    const headerRects = leafHeaders.map((th) => th.getBoundingClientRect())

    const grid: Array<Array<string>> = rows.map(() => [])
    const origins: Array<Array<string>> = rows.map(() => [])
    const spannedRows: Array<number> = []
    const structuralErrors: Array<string> = []
    const geometryErrors: Array<string> = []
    const cellCounts: Array<number> = []
    let zeroSpanCells = 0
    let rowSpanningCells = 0
    let tallestRowSpan = 1

    rows.forEach((rowEl, rowIndex) => {
      const cells = Array.from(rowEl.children) as Array<HTMLTableCellElement>
      cellCounts.push(cells.length)

      let column = 0

      cells.forEach((cellEl, cellIndex) => {
        // An attribute of 0 is a bug: `rowspan="0"` means "span to the end of
        // the row group" in HTML, so a covered cell must be skipped, not
        // rendered with a zero span.
        if (
          cellEl.getAttribute('rowspan') === '0' ||
          cellEl.getAttribute('colspan') === '0'
        ) {
          zeroSpanCells++
        }

        const rowSpan = cellEl.rowSpan || 1
        const colSpan = cellEl.colSpan || 1
        const text = (cellEl.textContent ?? '').replace(/\s+/g, ' ').trim()
        const id = `${rowIndex}:${cellIndex}`

        if (rowSpan > 1) rowSpanningCells++
        if (rowSpan > tallestRowSpan) tallestRowSpan = rowSpan
        if (colSpan > 1 && !spannedRows.includes(rowIndex)) {
          spannedRows.push(rowIndex)
        }

        while (grid[rowIndex]![column] !== undefined) column++

        for (let r = rowIndex; r < rowIndex + rowSpan; r++) {
          if (!grid[r]) {
            structuralErrors.push(
              `cell ${id} spans ${rowSpan} rows past the end of the tbody`,
            )
            break
          }
          for (let c = column; c < column + colSpan; c++) {
            if (grid[r]![c] !== undefined) {
              structuralErrors.push(`cell ${id} overlaps slot ${r},${c}`)
            }
            grid[r]![c] = text
            origins[r]![c] = id
          }
        }

        const start = headerRects[column]
        const end = headerRects[column + colSpan - 1]
        const rect = cellEl.getBoundingClientRect()

        if (rect.width <= 0 || rect.height <= 0) {
          geometryErrors.push(`cell ${id} has no box`)
        } else if (!start || !end) {
          geometryErrors.push(
            `cell ${id} starts at column ${column} with no matching header`,
          )
        } else {
          if (Math.abs(rect.left - start.left) > 1.5) {
            geometryErrors.push(
              `cell ${id} left ${rect.left} does not align with column ${column}`,
            )
          }
          if (Math.abs(rect.right - end.right) > 1.5) {
            geometryErrors.push(
              `cell ${id} right ${rect.right} does not span ${colSpan} columns`,
            )
          }
        }

        column += colSpan
      })
    })

    return {
      grid,
      origins,
      spannedRows,
      structuralErrors,
      geometryErrors,
      zeroSpanCells,
      rowSpanningCells,
      tallestRowSpan,
      cellCounts,
    }
  })
}

/** The grid is well formed and the browser drew it as declared. */
function expectWellFormed(report: SpanReport, columnCount: number) {
  expect(report.structuralErrors).toEqual([])
  expect(report.geometryErrors).toEqual([])
  expect(report.zeroSpanCells).toBe(0)

  report.grid.forEach((row, index) => {
    let occupied = 0
    for (let c = 0; c < columnCount; c++) {
      if (row[c] !== undefined) occupied++
    }
    // Rendered cells plus inherited spans must cover every visible column,
    // with no holes and no overflow past the last column.
    expect({ row: index, occupied, width: row.length }).toEqual({
      row: index,
      occupied: columnCount,
      width: columnCount,
    })
  })
}

/**
 * A span must be maximal: two vertically adjacent slots holding the same
 * value in a span-enabled column must belong to the same cell, otherwise the
 * feature under-merged. Grid equality alone cannot catch under-merging (an
 * unmerged table trivially matches the flat reference).
 */
function expectMaximalSpans(report: SpanReport, columns: Array<number>) {
  const underMerged: Array<string> = []

  for (const column of columns) {
    for (let row = 1; row < report.grid.length; row++) {
      if (report.spannedRows.includes(row)) continue
      if (report.spannedRows.includes(row - 1)) continue
      if (report.grid[row]![column] !== report.grid[row - 1]![column]) continue
      if (report.origins[row]![column] === report.origins[row - 1]![column]) {
        continue
      }
      underMerged.push(
        `column ${column} repeats "${report.grid[row]![column]}" at rows ${row - 1} and ${row}`,
      )
    }
  }

  expect(underMerged).toEqual([])
}

/** The spanning panel and the flat panel share one table instance. */
async function expectGridsMatch(page: Page) {
  const columnCount = await visibleLeafCount(page)
  const spans = await readSpanReport(spanTable(page))
  const reference = await readSpanReport(referenceTable(page))

  expectWellFormed(spans, columnCount)
  expectWellFormed(reference, columnCount)
  expect(spans.grid).toEqual(reference.grid)

  return spans
}

test('renders the spanning, reference, and summary tables without crashing', async ({
  page,
}) => {
  const errors = await openExample(page)

  await expect(spanTable(page)).toBeVisible()
  await expect(referenceTable(page)).toBeVisible()
  await expect(summaryTable(page)).toBeVisible()

  await expect(spanTable(page).locator('thead th')).toHaveText(LEAF_HEADERS)
  await expect(spanTable(page).locator('tbody tr')).toHaveCount(
    DEFAULT_PAGE_SIZE,
  )
  await expect(referenceTable(page).locator('tbody tr')).toHaveCount(
    DEFAULT_PAGE_SIZE,
  )
  expect(await visibleLeafCount(page)).toBe(LEAF_HEADERS.length)

  expect(errors).toEqual([])
})

test('covers every column in every row and matches the flat reference', async ({
  page,
}) => {
  const errors = await openExample(page)

  const spans = await expectGridsMatch(page)

  // The natural order is region-major, so page one holds the full North run
  // plus the start of South: two region runs and four team runs of three.
  expect(spans.rowSpanningCells).toBe(6)
  expect(spans.tallestRowSpan).toBe(REGION_RUN)
  expectMaximalSpans(spans, [0, 1])

  // The spanning panel renders strictly fewer cells than the flat panel.
  const spanCells = spans.cellCounts.reduce((total, count) => total + count, 0)
  expect(spanCells).toBeLessThan(DEFAULT_PAGE_SIZE * LEAF_HEADERS.length)

  expect(errors).toEqual([])
})

test('never renders a zero span attribute', async ({ page }) => {
  const errors = await openExample(page)

  // `rowspan="0"` is valid HTML and means "span to the end of the row group",
  // so a covered cell must be skipped rather than rendered with a 0 span.
  const attributes = await spanTable(page)
    .locator('tbody td')
    .evaluateAll((cells) =>
      cells.map((cell) => [
        cell.getAttribute('rowspan'),
        cell.getAttribute('colspan'),
      ]),
    )

  expect(attributes.flat().filter((value) => value === '0')).toEqual([])

  expect(errors).toEqual([])
})

test('recomputes spans when sorting changes adjacency', async ({ page }) => {
  const errors = await openExample(page)

  const before = await expectGridsMatch(page)
  expect(before.rowSpanningCells).toBe(6)

  // Sorting by shift makes every rendered row share one shift value: page one
  // becomes twelve Evening rows, so the shift column (whose predicate only
  // merges while sorted) forms one page-tall run, regions re-cluster into
  // runs of three, and teams stop merging entirely.
  await spanTable(page)
    .getByRole('button', { name: 'Shift', exact: true })
    .click()
  await expect
    .poll(async () => (await readState(page)).sorting ?? [])
    .toEqual([{ id: 'shift', desc: false }])

  const sorted = await expectGridsMatch(page)
  expect(sorted.tallestRowSpan).toBe(DEFAULT_PAGE_SIZE)
  expect(sorted.rowSpanningCells).toBe(5)
  expectMaximalSpans(sorted, [0, 1])

  expect(errors).toEqual([])
})

test('recomputes spans when a filter removes rows', async ({ page }) => {
  const errors = await openExample(page)

  await expectGridsMatch(page)

  await page.getByTestId('status-filter').selectOption('Approved')
  await expect
    .poll(async () => (await readState(page)).columnFilters ?? [])
    .toEqual([{ id: 'status', value: 'Approved' }])

  const filtered = await expectGridsMatch(page)
  expectMaximalSpans(filtered, [0, 1])

  await page.getByTestId('status-filter').selectOption('')
  await expect
    .poll(async () => (await readState(page)).columnFilters ?? [])
    .toEqual([])

  const restored = await expectGridsMatch(page)
  expect(restored.rowSpanningCells).toBe(6)

  expect(errors).toEqual([])
})

test('never spans across a page boundary', async ({ page }) => {
  const errors = await openExample(page)

  await expect
    .poll(async () => (await readState(page)).pagination?.pageSize)
    .toBe(DEFAULT_PAGE_SIZE)

  const firstPage = await expectGridsMatch(page)
  const lastRegionOnPageOne = firstPage.grid.at(-1)![0]

  // A page of 12 slices a 9-row region run, so a run continues onto page 2.
  expect(firstPage.grid.length).toBe(DEFAULT_PAGE_SIZE)
  expect(DEFAULT_PAGE_SIZE % REGION_RUN).not.toBe(0)

  await page.getByRole('button', { name: '>', exact: true }).click()
  await expect
    .poll(async () => (await readState(page)).pagination?.pageIndex)
    .toBe(1)

  const secondPage = await expectGridsMatch(page)

  // The run continues, so page two must open its own Region cell instead of
  // inheriting a span from a row that is no longer rendered.
  expect(secondPage.grid[0]![0]).toBe(lastRegionOnPageOne)
  expect(secondPage.origins[0]![0]).toBe('0:0')
  expectMaximalSpans(secondPage, [0, 1])

  expect(errors).toEqual([])
})

test('recomputes spans when the page size changes', async ({ page }) => {
  const errors = await openExample(page)

  await page.getByTestId('page-size').selectOption('36')
  await expect
    .poll(async () => (await readState(page)).pagination?.pageSize)
    .toBe(36)

  const report = await expectGridsMatch(page)
  expect(report.grid.length).toBe(36)
  // A whole region run now fits on one page: four region runs of nine and
  // twelve team runs of three.
  expect(report.tallestRowSpan).toBe(REGION_RUN)
  expect(report.rowSpanningCells).toBe(16)
  expectMaximalSpans(report, [0, 1])

  expect(errors).toEqual([])
})

test('keeps rows full width when a spanning column is hidden', async ({
  page,
}) => {
  const errors = await openExample(page)

  await page.getByLabel('Team', { exact: true }).uncheck()
  await expect
    .poll(async () => (await readState(page)).columnVisibility ?? {})
    .toEqual({ team: false })

  expect(await visibleLeafCount(page)).toBe(LEAF_HEADERS.length - 1)

  const report = await expectGridsMatch(page)
  // Region is still column 0 after Team disappears.
  expectMaximalSpans(report, [0])

  expect(errors).toEqual([])
})

test('renders one cell per column when spanning is turned off', async ({
  page,
}) => {
  const errors = await openExample(page)

  await page.getByLabel('Row spanning', { exact: true }).uncheck()

  // The uncheck resolves when the DOM event is dispatched, not when the
  // framework has re-rendered, so poll until the spans are gone before
  // snapshotting the grid.
  await expect
    .poll(async () => (await readSpanReport(spanTable(page))).rowSpanningCells)
    .toBe(0)

  const columnCount = await visibleLeafCount(page)
  const spans = await readSpanReport(spanTable(page))
  const reference = await readSpanReport(referenceTable(page))

  expectWellFormed(spans, columnCount)
  expect(spans.rowSpanningCells).toBe(0)
  expect(spans.cellCounts).toEqual(reference.cellCounts)
  expect(spans.grid).toEqual(reference.grid)

  expect(errors).toEqual([])
})

test('spans summary rows across every remaining column', async ({ page }) => {
  const errors = await openExample(page)
  const table = summaryTable(page)

  const columnCount = await table.locator('thead tr:last-child th').count()
  const report = await readSpanReport(table)

  expectWellFormed(report, columnCount)
  // Each subtotal row renders a full-width label plus nothing else... except
  // the label column only spans the columns its resolver reaches, so the row
  // renders fewer cells than the column count.
  expect(report.spannedRows.length).toBeGreaterThan(0)
  for (const row of report.spannedRows) {
    expect(report.cellCounts[row]!).toBeLessThan(columnCount)
  }

  expect(errors).toEqual([])
})

test('regenerates table data', async ({ page }) => {
  const errors = await openExample(page)
  const regenerateButton = page.getByRole('button', {
    name: /^Regenerate Data$/i,
  })

  const employeeBefore = await spanTable(page)
    .locator('tbody tr')
    .first()
    .locator('td')
    .nth(3)
    .textContent()

  await regenerateButton.click()

  await expect
    .poll(async () =>
      spanTable(page)
        .locator('tbody tr')
        .first()
        .locator('td')
        .nth(3)
        .textContent(),
    )
    .not.toBe(employeeBefore)

  await expectGridsMatch(page)

  expect(errors).toEqual([])
})

async function readSelectedCount(page: Page) {
  const text = await page.getByTestId('selected-count').textContent()
  return Number(text ?? '-1')
}

test('expands a drag selection to enclose merged cells', async ({ page }) => {
  const errors = await openExample(page)
  const table = spanTable(page)

  // Row 1 renders neither a Region nor a Team cell (the merges above cover
  // both), so its first td is the Shift column. Drag from there onto the
  // merged Region cell, crossing the Region and Team merges.
  const shiftCell = table.locator('tbody tr').nth(1).locator('td').first()
  const mergedRegionCell = table
    .locator('tbody tr')
    .nth(0)
    .locator('td')
    .first()

  await shiftCell.hover()
  await page.mouse.down()
  await mergedRegionCell.hover()
  await page.mouse.up()

  // The Region merge spans the whole 9-row North run, so the selection
  // expands to rows 0-8 across Region, Team, and Shift. That area renders as
  // one Region merge, three 3-row Team merges, and nine Shift cells.
  await expect.poll(() => readSelectedCount(page)).toBe(13)

  await expect(mergedRegionCell).toHaveClass(/cell-selected/)
  // Exactly the rendered cells of the expansion are tinted: no covered cell
  // renders, and no cell outside the expanded rectangle is selected.
  await expect(table.locator('tbody td.cell-selected')).toHaveCount(13)

  // The spanned grid still describes a well-formed table while selected.
  const report = await expectGridsMatch(page)
  expectMaximalSpans(report, [0, 1])

  expect(errors).toEqual([])
})

test('re-derives the same stored selection when spanning is toggled off', async ({
  page,
}) => {
  const errors = await openExample(page)
  const table = spanTable(page)

  const shiftCell = table.locator('tbody tr').nth(1).locator('td').first()
  const mergedRegionCell = table
    .locator('tbody tr')
    .nth(0)
    .locator('td')
    .first()

  await shiftCell.hover()
  await page.mouse.down()
  await mergedRegionCell.hover()
  await page.mouse.up()

  await expect.poll(() => readSelectedCount(page)).toBe(13)

  // Expansion happens at derivation time, so the stored corners survive the
  // toggle and collapse back to the raw 2x3 rectangle they describe.
  await page.getByLabel('Row spanning', { exact: true }).uncheck()
  await expect.poll(() => readSelectedCount(page)).toBe(6)

  await page.getByLabel('Row spanning', { exact: true }).check()
  await expect.poll(() => readSelectedCount(page)).toBe(13)

  expect(errors).toEqual([])
})
