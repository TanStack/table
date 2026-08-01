import { callMemoOrStaticFn, isFunction, makeObjectMap } from '../../utils'
import type { Table_Internal } from '../../types/Table'
import type { Row } from '../../types/Row'
import type { Column } from '../../types/Column'
import type { Cell } from '../../types/Cell'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type {
  CellSpanIndex,
  ColSpanContext,
  ColumnDef_CellSpanning,
  RowSpanContext,
} from './cellSpanningFeature.types'

// Span index

const EMPTY_ROW_SPANS: Record<string, Int32Array> = makeObjectMap()
const EMPTY_COLUMN_INDEXES: Record<string, number> = makeObjectMap()
const EMPTY_COL_SPANS: Array<Int32Array | undefined> = []
const NO_SECTION_STARTS: ReadonlyArray<number> = []

/**
 * Resolves the rows in the order a renderer actually draws them, plus the
 * positions at which a new visual section begins.
 *
 * Without row pinning this is the final row model itself, returned by
 * reference so the common path allocates nothing. With row pinning it is the
 * concatenation the three-list renderer walks: `getTopRows()`,
 * `getCenterRows()`, `getBottomRows()`. `getCenterRows()` filters the row
 * model by the pinned ids, so no row appears in two sections and every row
 * gets exactly one position; with `keepPinnedRows` a pinned row that filtering
 * removed from the row model still appears exactly once, in its pinned
 * section.
 *
 * The pinning reads are optional-chained so the feature stays correct when
 * `rowPinningFeature` is not registered.
 */
function getRenderedRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
): {
  rows: ReadonlyArray<Row<TFeatures, TData>>
  sectionStarts: ReadonlyArray<number>
} {
  const rows = table.getRowModel().rows
  const rowPinning = table.atoms.rowPinning?.get()

  if (!rowPinning || (!rowPinning.top.length && !rowPinning.bottom.length)) {
    return { rows, sectionStarts: NO_SECTION_STARTS }
  }

  const pinnedTable = table as Table_Internal<TFeatures, TData> & {
    getTopRows?: () => Array<Row<TFeatures, TData>>
    getCenterRows?: () => Array<Row<TFeatures, TData>>
    getBottomRows?: () => Array<Row<TFeatures, TData>>
  }
  const top = pinnedTable.getTopRows?.() ?? []
  const center = pinnedTable.getCenterRows?.() ?? rows
  const bottom = pinnedTable.getBottomRows?.() ?? []

  return {
    rows: [...top, ...center, ...bottom],
    sectionStarts: [top.length, top.length + center.length],
  }
}

/**
 * Resolves the visible columns in the order cells render, plus the two
 * boundaries between the start-pinned, center, and end-pinned regions.
 *
 * Read off a rendered row's visible cells rather than re-derived, so the
 * ordering is the renderer's own by construction. `getVisibleCells` only
 * exists when `columnVisibilityFeature` is registered; without it renderers
 * walk `row.getAllCells()`, whose order is `table.getAllLeafColumns()`.
 */
function getRenderedColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, firstRow: Row<TFeatures, TData>) {
  const visibleRow = firstRow as Row<TFeatures, TData> & {
    getVisibleCells?: () => Array<Cell<TFeatures, TData, unknown>>
  }
  const cells = visibleRow.getVisibleCells?.() ?? firstRow.getAllCells()
  const columns: Array<Column<TFeatures, TData, unknown>> = new Array(
    cells.length,
  )
  for (let i = 0; i < cells.length; i++) columns[i] = cells[i]!.column

  const pinning = table.atoms.columnPinning?.get()
  let centerStart = 0
  let centerEnd = columns.length

  if (pinning) {
    while (
      centerStart < centerEnd &&
      pinning.start.includes(columns[centerStart]!.id)
    ) {
      centerStart++
    }
    while (
      centerEnd > centerStart &&
      pinning.end.includes(columns[centerEnd - 1]!.id)
    ) {
      centerEnd--
    }
  }

  return { columns, centerStart, centerEnd }
}

/**
 * Checks whether this column takes part in cell spanning.
 *
 * A column def opting out with `enableCellSpanning: false` wins over the table
 * option, matching how the other per-column enable flags resolve.
 *
 * @example
 * ```ts
 * const canSpan = column_getCanSpan(column)
 * ```
 */
export function column_getCanSpan<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column<TFeatures, TData, TValue>): boolean {
  const columnDef = column.columnDef as Partial<
    ColumnDef_CellSpanning<TFeatures, TData, TValue>
  >

  if (columnDef.enableCellSpanning === false) return false

  return column.table.options.enableCellSpanning ?? true
}

/**
 * Builds the table's cell span index for the rows that are currently rendered.
 *
 * Spans are always derived from scratch from the final row model, so sorting,
 * filtering, pagination, expansion, and row pinning only change adjacency and
 * the index follows. Nothing is persisted and there is nothing to configure.
 *
 * @example
 * ```ts
 * const spanIndex = table_getCellSpanIndex(table)
 * ```
 */
export function table_getCellSpanIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): CellSpanIndex<TFeatures, TData> {
  const { rows, sectionStarts } = getRenderedRows(table)
  const rowCount = rows.length

  const empty: CellSpanIndex<TFeatures, TData> = {
    colSpans: EMPTY_COL_SPANS,
    columnIndexes: EMPTY_COLUMN_INDEXES,
    rowSpans: EMPTY_ROW_SPANS,
    rows,
  }

  if (!rowCount || table.options.enableCellSpanning === false) return empty

  const { columns, centerStart, centerEnd } = getRenderedColumns(
    table,
    rows[0]!,
  )
  const columnCount = columns.length
  if (!columnCount) return empty

  const columnIndexes = makeObjectMap<number>()
  for (let c = 0; c < columnCount; c++) columnIndexes[columns[c]!.id] = c

  // Row positions plus the per-row "may not merge upward" flags, computed once
  // and shared by every spanning column.
  //
  // A row breaks the run above it when it opens a new pinned section, when it
  // sits at a different place in the row tree than its predecessor (a parent
  // and its sub-rows render at different indent levels, so merging them
  // swallows the tree), or when it is a grouped row (its accessor value comes
  // from an arbitrary leaf's original object and is not meaningful to
  // compare).
  const breaks = new Uint8Array(rowCount)
  for (let s = 0; s < sectionStarts.length; s++) {
    const start = sectionStarts[s]!
    if (start < rowCount) breaks[start] = 1
  }

  for (let r = 0; r < rowCount; r++) {
    const row = rows[r]! as Row<TFeatures, TData> & {
      _cellSpanRowIndex?: number
      getIsGrouped?: () => boolean
    }
    row._cellSpanRowIndex = r
    const prev = r > 0 ? rows[r - 1]! : undefined
    if (
      (prev && (row.depth !== prev.depth || row.parentId !== prev.parentId)) ||
      row.getIsGrouped?.() === true
    ) {
      breaks[r] = 1
    }
  }

  // Pass 1: column spans (explicit, per row). Runs first because a
  // horizontally covered cell must not take part in a vertical run, and
  // because summary rows are exactly the rows that should interrupt vertical
  // runs.
  const colSpans: Array<Int32Array | undefined> = []
  let anyColSpan = false

  for (let c = 0; c < columnCount; c++) {
    const column = columns[c]!
    const spanColumns = (
      column.columnDef as Partial<ColumnDef_CellSpanning<TFeatures, TData, any>>
    ).spanColumns
    if (spanColumns === undefined || !column_getCanSpan(column)) continue

    // A span may not cross a pinned-region boundary: the regions are separate
    // scroll contexts, so a cell reaching across them renders wrong.
    const regionEnd =
      c < centerStart ? centerStart : c < centerEnd ? centerEnd : columnCount

    for (let r = 0; r < rowCount; r++) {
      const existing = colSpans[r]
      if (existing && existing[c] === 0) continue

      const requested = isFunction(spanColumns)
        ? spanColumns({
            column,
            row: rows[r]!,
            table,
          } as ColSpanContext<TFeatures, TData, any>)
        : spanColumns
      if (!(requested > 1)) continue

      const span = Math.min(requested, regionEnd - c)
      if (span < 2) continue

      const target =
        existing ?? (colSpans[r] = new Int32Array(columnCount).fill(1))
      target[c] = span
      for (let k = c + 1; k < c + span; k++) target[k] = 0
      anyColSpan = true
    }
  }

  // Pass 2: row spans (value-derived, per column).
  const rowSpans = makeObjectMap<Int32Array>()

  for (let c = 0; c < columnCount; c++) {
    const column = columns[c]! as Column<TFeatures, TData, unknown> & {
      getIsGrouped?: () => boolean
    }
    const spanRows = (
      column.columnDef as Partial<ColumnDef_CellSpanning<TFeatures, TData, any>>
    ).spanRows
    if (!spanRows || !column_getCanSpan(column)) continue
    // Grouping already collapses this column's repeated values into group
    // rows; spanning them as well would merge twice.
    if (column.getIsGrouped?.() === true) continue

    const columnId = column.id
    const predicate = isFunction(spanRows) ? spanRows : undefined
    const spans = new Int32Array(rowCount).fill(1)
    let anyRun = false
    let anchorIndex = -1
    let anchorValue: unknown
    let anchorColSpan = 1

    for (let r = 0; r < rowCount; r++) {
      const row = rows[r]!
      const rowColSpans = anyColSpan ? colSpans[r] : undefined
      const cellColSpan = rowColSpans ? rowColSpans[c]! : 1

      // Covered by another cell's column span: contributes nothing to a
      // vertical run and ends any run in progress.
      if (cellColSpan === 0) {
        anchorIndex = -1
        continue
      }

      const value = row.getValue(columnId)

      if (
        anchorIndex !== -1 &&
        !breaks[r] &&
        // A merged block must be rectangular, so a cell only joins a vertical
        // run when its column span matches the run's. This is also what stops
        // a full-width summary row from merging into the data run above it.
        cellColSpan === anchorColSpan &&
        (predicate
          ? predicate({
              anchorRow: rows[anchorIndex]!,
              anchorValue,
              column,
              previousRow: rows[r - 1]!,
              row,
              table,
              value,
            } as RowSpanContext<TFeatures, TData, any>)
          : // Nullish never merges under the default comparison: a merged
            // block of blanks reads as a rendering bug and joins semantically
            // unrelated rows. A predicate can opt in.
            value != null && Object.is(value, anchorValue))
      ) {
        spans[r] = 0
        spans[anchorIndex] = spans[anchorIndex]! + 1
        anyRun = true
        continue
      }

      anchorIndex = r
      anchorValue = value
      anchorColSpan = cellColSpan
    }

    // A column whose every run had length 1 stores nothing; per-cell reads
    // then miss on the first lookup and return 1.
    if (anyRun) rowSpans[columnId] = spans
  }

  return { colSpans, columnIndexes, rowSpans, rows }
}

// Cell APIs

function resolveRowIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
>(
  index: CellSpanIndex<TFeatures, TData>,
  cell: Cell<TFeatures, TData, TValue>,
): number {
  const rowIndex = (
    cell.row as Row<TFeatures, TData> & {
      _cellSpanRowIndex?: number
    }
  )._cellSpanRowIndex
  // Identity guard: a row that was filtered or paged out keeps a stale
  // position, and a row never indexed keeps the initial -1. Either way the
  // cell reports a span of 1 rather than reading another row's slot.
  if (rowIndex === undefined || index.rows[rowIndex] !== cell.row) return -1
  return rowIndex
}

/**
 * Returns how many rows this cell spans.
 *
 * `1` when it does not span, and `0` when a spanning cell above it covers it,
 * matching the `header.rowSpan` convention where `0` means "skip this cell".
 *
 * Deliberately not memoized: a per-cell memo would allocate a closure and a
 * dependency array for every cell, costing more than the two lookups this
 * performs against the table-level span index.
 *
 * @example
 * ```ts
 * const rowSpan = cell_getRowSpan(cell)
 * ```
 */
export function cell_getRowSpan<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(cell: Cell<TFeatures, TData, TValue>): number {
  const table = cell.row.table
  const index = callMemoOrStaticFn(
    table,
    'getCellSpanIndex',
    table_getCellSpanIndex,
  )
  const spans = index.rowSpans[cell.column.id]
  if (!spans) return 1
  const rowIndex = resolveRowIndex(index, cell)
  if (rowIndex === -1) return 1
  return spans[rowIndex]!
}

/**
 * Returns how many columns this cell spans.
 *
 * `1` when it does not span, and `0` when another cell's column span covers
 * it.
 *
 * @example
 * ```ts
 * const colSpan = cell_getColSpan(cell)
 * ```
 */
export function cell_getColSpan<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(cell: Cell<TFeatures, TData, TValue>): number {
  const table = cell.row.table
  const index = callMemoOrStaticFn(
    table,
    'getCellSpanIndex',
    table_getCellSpanIndex,
  )
  const rowIndex = resolveRowIndex(index, cell)
  if (rowIndex === -1) return 1
  const spans = index.colSpans[rowIndex]
  if (!spans) return 1
  const columnIndex = index.columnIndexes[cell.column.id]
  return columnIndex === undefined ? 1 : spans[columnIndex]!
}

/**
 * Checks whether another cell's span covers this cell.
 *
 * Covered cells must not be rendered; the cell that covers them carries the
 * content and the span attributes.
 *
 * @example
 * ```ts
 * const isCovered = cell_getIsCovered(cell)
 * ```
 */
export function cell_getIsCovered<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(cell: Cell<TFeatures, TData, TValue>): boolean {
  return cell_getRowSpan(cell) === 0 || cell_getColSpan(cell) === 0
}
