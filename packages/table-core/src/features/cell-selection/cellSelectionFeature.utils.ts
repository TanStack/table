import {
  callMemoOrStaticFn,
  cloneState,
  makeObjectMap,
  setStateSlice,
} from '../../utils'
import { table_getVisibleLeafColumns } from '../column-visibility/columnVisibilityFeature.utils'
import {
  applyCellSelectionBoundsOperations,
  expandCellSelectionBounds,
} from './cellSelectionGeometry'
import type { CellSelectionBoundsOperation } from './cellSelectionGeometry'
import type { CellData, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { Row } from '../../types/Row'
import type { Cell } from '../../types/Cell'
import type { Column } from '../../types/Column'
import type {
  CellSelectionBounds,
  CellSelectionDirection,
  CellSelectionEdges,
  CellSelectionRange,
  CellSelectionState,
  ColumnDef_CellSelection,
  SelectCellRangeOptions,
} from './cellSelectionFeature.types'

// State APIs

/**
 * Creates the default cell selection state.
 *
 * The feature default is an empty selection. Reset APIs use this value when
 * `defaultState` is `true`.
 *
 * @example
 * ```ts
 * const selection = getDefaultCellSelectionState()
 * ```
 */
export function getDefaultCellSelectionState(): CellSelectionState {
  return []
}

/**
 * Routes a cell selection updater through the table's selection change handler.
 *
 * @example
 * ```ts
 * table_setCellSelection(table, (old) => old.slice(0, -1))
 * ```
 */
export function table_setCellSelection<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  updater: Updater<CellSelectionState>,
) {
  setStateSlice(table, 'cellSelection', updater)
}

/**
 * Resets `cellSelection` to the configured initial state or feature default.
 *
 * With no argument, the reset clones `table.initialState.cellSelection` when it
 * exists. Passing `true` ignores initial state and resets to an empty selection.
 *
 * @example
 * ```ts
 * table_resetCellSelection(table, true)
 * ```
 */
export function table_resetCellSelection<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, defaultState?: boolean) {
  table_setCellSelection(
    table,
    defaultState
      ? getDefaultCellSelectionState()
      : (cloneState(table.initialState.cellSelection) ??
          getDefaultCellSelectionState()),
  )
}

/**
 * Schedules a cell selection reset after `data` changes.
 *
 * Ranges are stored as row and column ids, so without this a data swap would
 * leave a selection pointing at rows that no longer exist, or silently
 * re-select cells whenever new data reuses ids. The reset runs when
 * `autoResetAll` or `autoResetCellSelection` allows it, defaulting to on.
 *
 * Resetting to `initialState.cellSelection` rather than to empty means the
 * first row-model computation is a no-op, matching `table_autoResetExpanded`.
 *
 * @example
 * ```ts
 * table_autoResetCellSelection(table)
 * ```
 */
export function table_autoResetCellSelection<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  // skip entirely when the feature is not registered
  if (!table.atoms.cellSelection) return

  if (
    table.options.autoResetAll ??
    table.options.autoResetCellSelection ??
    true
  ) {
    table._reactivity.schedule(() => table_resetCellSelection(table))
  }
}

// Index caches

/**
 * Returns the visible leaf columns in the order their cells actually render.
 *
 * This is deliberately not `getVisibleLeafColumns()`, which is
 * visibility-filtered but *not* pinning-reordered, and not `column_getIndex()`,
 * which indexes that same unpinned list. Cells render start-pinned first, then
 * center, then end (see `row_getVisibleCells`), so indexing a selection in the
 * unpinned order would make a dragged rectangle contiguous in index space but
 * visually scattered the moment a column is pinned.
 *
 * The pinning read is inlined rather than delegated to the column pinning
 * utils so this stays correct when that feature is absent, and so the ordering
 * provably matches `row_getVisibleCells`.
 */
function getDisplayOrderedColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
): ReadonlyArray<Column<TFeatures, TData, unknown>> {
  const columns = callMemoOrStaticFn(
    table,
    'getVisibleLeafColumns',
    table_getVisibleLeafColumns,
  )
  const pinning = table.atoms.columnPinning?.get()

  if (!pinning || (!pinning.start.length && !pinning.end.length)) {
    return columns
  }

  const byId = makeObjectMap<Column<TFeatures, TData, unknown>>()
  for (let i = 0; i < columns.length; i++) {
    byId[columns[i]!.id] = columns[i]!
  }

  const start: Array<Column<TFeatures, TData, unknown>> = []
  for (let i = 0; i < pinning.start.length; i++) {
    const column = byId[pinning.start[i]!]
    if (column) start.push(column)
  }

  const end: Array<Column<TFeatures, TData, unknown>> = []
  for (let i = 0; i < pinning.end.length; i++) {
    const column = byId[pinning.end[i]!]
    if (column) end.push(column)
  }

  const center: Array<Column<TFeatures, TData, unknown>> = []
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i]!
    if (
      !pinning.start.includes(column.id) &&
      !pinning.end.includes(column.id)
    ) {
      center.push(column)
    }
  }

  return [...start, ...center, ...end]
}

/**
 * Builds a column id to render-order index map.
 *
 * Registered by this feature so the lookup stays memoized even when
 * `columnOrderingFeature` is absent, since that feature's `getColumnIndexes`
 * static rebuilds all four maps on every call, which would make per-cell reads
 * O(columns).
 *
 * @example
 * ```ts
 * const index = table_getCellSelectionColumnIndexes(table)[columnId]
 * ```
 */
export function table_getCellSelectionColumnIndexes<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): Record<string, number> {
  const columns = getDisplayOrderedColumns(table)
  const indexes = makeObjectMap<number>()
  for (let i = 0; i < columns.length; i++) {
    indexes[columns[i]!.id] = i
  }
  return indexes
}

const EMPTY_MERGE_BOUNDS: Array<CellSelectionBounds> = []

/**
 * The shape of `cellSpanningFeature`'s span index that selection reads.
 *
 * Declared structurally rather than imported so cell selection never depends
 * on the cell spanning module: the probe below only ever calls the API that
 * `cellSpanningFeature` installs on the table, and resolves to nothing when
 * that feature is not registered.
 */
interface ProbedCellSpanIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  colSpans: Array<Int32Array | undefined>
  columnIndexes: Record<string, number>
  rowSpans: Record<string, Int32Array>
  rows: ReadonlyArray<Row<TFeatures, TData>>
}

function probeCellSpanIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
): ProbedCellSpanIndex<TFeatures, TData> | undefined {
  return (
    table as Table_Internal<TFeatures, TData> & {
      getCellSpanIndex?: () => ProbedCellSpanIndex<TFeatures, TData>
    }
  ).getCellSpanIndex?.()
}

/**
 * Resolves the merged-cell rectangles of the rendered rows into selection's
 * own index space.
 *
 * The span index positions rows by their paginated render order while
 * selection positions them by pre-paginated display order, so each merge is
 * mapped through `row.getDisplayIndex()`. A merge whose rows do not map to a
 * contiguous display range is skipped defensively; it then behaves like
 * unmerged cells instead of corrupting the geometry.
 *
 * Returns an empty array when `cellSpanningFeature` is not registered, which
 * keeps every selection code path identical to the span-unaware behavior.
 *
 * @example
 * ```ts
 * const merges = table_getCellSelectionMergeBounds(table)
 * ```
 */
export function table_getCellSelectionMergeBounds<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): Array<CellSelectionBounds> {
  const spanIndex = probeCellSpanIndex(table)

  if (!spanIndex) return EMPTY_MERGE_BOUNDS

  const columnIndexes = callMemoOrStaticFn(
    table,
    'getCellSelectionColumnIndexes',
    table_getCellSelectionColumnIndexes,
  )
  const merges: Array<CellSelectionBounds> = []

  // Vertical runs, each widened by any column span on its anchor so a
  // row-and-column merge maps to one rectangle.
  for (const columnId in spanIndex.rowSpans) {
    const columnIndex = columnIndexes[columnId]
    if (columnIndex === undefined) continue

    const spans = spanIndex.rowSpans[columnId]!
    const spanColumnIndex = spanIndex.columnIndexes[columnId]

    for (let r = 0; r < spans.length; r++) {
      const span = spans[r]!
      if (span <= 1) continue

      const startRow = spanIndex.rows[r]!.getDisplayIndex()
      const endRow = spanIndex.rows[r + span - 1]!.getDisplayIndex()
      if (startRow < 0 || endRow - startRow !== span - 1) continue

      const colSpan =
        spanColumnIndex === undefined
          ? 1
          : Math.max(spanIndex.colSpans[r]?.[spanColumnIndex] ?? 1, 1)

      merges.push({
        minRowIndex: startRow,
        maxRowIndex: endRow,
        minColumnIndex: columnIndex,
        maxColumnIndex: columnIndex + colSpan - 1,
      })
    }
  }

  // Horizontal-only spans on rows whose anchor has no vertical run.
  if (spanIndex.colSpans.length) {
    const columnIdBySpanIndex: Array<string> = []
    for (const columnId in spanIndex.columnIndexes) {
      columnIdBySpanIndex[spanIndex.columnIndexes[columnId]!] = columnId
    }

    for (let r = 0; r < spanIndex.colSpans.length; r++) {
      const rowColSpans = spanIndex.colSpans[r]
      if (!rowColSpans) continue

      const displayRow = spanIndex.rows[r]?.getDisplayIndex() ?? -1
      if (displayRow < 0) continue

      for (let c = 0; c < rowColSpans.length; c++) {
        const span = rowColSpans[c]!
        if (span <= 1) continue

        const columnId = columnIdBySpanIndex[c]
        if (columnId === undefined) continue
        // Vertical runs already emitted this anchor as a full rectangle, and
        // their covered rows sit inside it.
        const vertical = spanIndex.rowSpans[columnId]
        if (vertical && vertical[r] !== 1) continue

        const columnIndex = columnIndexes[columnId]
        if (columnIndex === undefined) continue

        merges.push({
          minRowIndex: displayRow,
          maxRowIndex: displayRow,
          minColumnIndex: columnIndex,
          maxColumnIndex: columnIndex + span - 1,
        })
      }
    }
  }

  return merges
}

function findMergeBoundsAt(
  merges: ReadonlyArray<CellSelectionBounds>,
  rowIndex: number,
  columnIndex: number,
): CellSelectionBounds | undefined {
  for (let i = 0; i < merges.length; i++) {
    const merge = merges[i]!
    if (
      rowIndex >= merge.minRowIndex &&
      rowIndex <= merge.maxRowIndex &&
      columnIndex >= merge.minColumnIndex &&
      columnIndex <= merge.maxColumnIndex
    ) {
      return merge
    }
  }
  return undefined
}

/**
 * Resolves a row id to its display-order index, or `-1` when it no longer
 * identifies a row in the current order.
 *
 * Callers must have already called `table.getRowsInDisplayOrder()`, which is
 * what populates the display index cache each row reads.
 */
function resolveRowIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  rows: ReadonlyArray<Row<TFeatures, TData>>,
  rowId: string,
): number {
  const row =
    table.getPrePaginatedRowModel().rowsById[rowId] ??
    table.getCoreRowModel().rowsById[rowId]

  if (!row) return -1

  const index = row.getDisplayIndex()

  if (index < 0 || index >= rows.length || rows[index]?.id !== rowId) {
    return -1
  }

  return index
}

/**
 * Resolves ordered range operations into disjoint, positive display-order
 * index rectangles.
 *
 * This is the single cache every per-cell read goes through, so index lookups
 * happen once per invalidation rather than once per cell. A range whose corners
 * no longer resolve, for example because its anchor row was filtered out, is
 * omitted rather than clamped, so it contributes nothing while remaining in
 * state and returns intact when the filter clears.
 *
 * @example
 * ```ts
 * const bounds = table_getCellSelectionBounds(table)
 * ```
 */
export function table_getCellSelectionBounds<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): Array<CellSelectionBounds> {
  const ranges = table.atoms.cellSelection?.get()

  if (!ranges?.length) return []

  const rows = table.getRowsInDisplayOrder()
  const columnIndexes = callMemoOrStaticFn(
    table,
    'getCellSelectionColumnIndexes',
    table_getCellSelectionColumnIndexes,
  )

  const operations: Array<CellSelectionBoundsOperation> = []

  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i]!
    const anchorRowIndex = resolveRowIndex(table, rows, range.anchorRowId)
    const focusRowIndex = resolveRowIndex(table, rows, range.focusRowId)
    const anchorColumnIndex = columnIndexes[range.anchorColumnId] ?? -1
    const focusColumnIndex = columnIndexes[range.focusColumnId] ?? -1

    if (
      anchorRowIndex < 0 ||
      focusRowIndex < 0 ||
      anchorColumnIndex < 0 ||
      focusColumnIndex < 0
    ) {
      continue
    }

    operations.push({
      minRowIndex: Math.min(anchorRowIndex, focusRowIndex),
      maxRowIndex: Math.max(anchorRowIndex, focusRowIndex),
      minColumnIndex: Math.min(anchorColumnIndex, focusColumnIndex),
      maxColumnIndex: Math.max(anchorColumnIndex, focusColumnIndex),
      operation: range.operation ?? 'include',
    })
  }

  // Merged cells are all-or-nothing: every operation's rectangle, include and
  // exclude alike, grows to enclose the merges it touches before the algebra
  // runs. Expanding here rather than at write time keeps the stored corners
  // stable while sorting, paging, or toggling spanning changes the merges.
  const merges = callMemoOrStaticFn(
    table,
    'getCellSelectionMergeBounds',
    table_getCellSelectionMergeBounds,
  )

  if (merges.length) {
    for (let i = 0; i < operations.length; i++) {
      const operation = operations[i]!
      const expanded = expandCellSelectionBounds(operation, merges)
      operation.minRowIndex = expanded.minRowIndex
      operation.maxRowIndex = expanded.maxRowIndex
      operation.minColumnIndex = expanded.minColumnIndex
      operation.maxColumnIndex = expanded.maxColumnIndex
    }
  }

  return applyCellSelectionBoundsOperations(operations)
}

/**
 * Tests whether an index pair falls inside any resolved rectangle.
 */
function isWithinBounds(
  bounds: ReadonlyArray<CellSelectionBounds>,
  rowIndex: number,
  columnIndex: number,
): boolean {
  for (let i = 0; i < bounds.length; i++) {
    const bound = bounds[i]!
    if (
      rowIndex >= bound.minRowIndex &&
      rowIndex <= bound.maxRowIndex &&
      columnIndex >= bound.minColumnIndex &&
      columnIndex <= bound.maxColumnIndex
    ) {
      return true
    }
  }
  return false
}

// Cell APIs

/**
 * Checks whether this cell can currently be selected.
 *
 * A column def opting out with `enableCellSelection: false` wins over the table
 * option, matching how the other per-column enable flags resolve.
 *
 * @example
 * ```ts
 * const canSelect = cell_getCanSelect(cell)
 * ```
 */
export function cell_getCanSelect<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(cell: Cell<TFeatures, TData, TValue>): boolean {
  const columnDef = cell.column.columnDef as Partial<ColumnDef_CellSelection>

  if (columnDef.enableCellSelection === false) return false

  const enabled = cell.table.options.enableCellSelection

  if (typeof enabled === 'function') return enabled(cell as any)

  return enabled ?? true
}

/**
 * Resolves a cell to the coordinates every selection read needs.
 *
 * Shared by `getIsSelected` and `getSelectionEdges` so a render pass resolves
 * each cell once. Resolving in both meant every cell paid for the bounds memo,
 * the display index, and the column index map twice over.
 *
 * Returns `null` when the cell cannot participate in a selection at all.
 */
function resolveCellPosition<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  cell: Cell<TFeatures, TData, TValue>,
): {
  bounds: ReadonlyArray<CellSelectionBounds>
  columnIndex: number
  rowIndex: number
} | null {
  const table = cell.table
  const bounds = callMemoOrStaticFn(
    table,
    'getCellSelectionBounds',
    table_getCellSelectionBounds,
  )

  if (!bounds.length) return null
  if (!callMemoOrStaticFn(cell, 'getCanSelect', cell_getCanSelect)) return null

  const rowIndex = cell.row.getDisplayIndex()

  if (rowIndex < 0) return null

  const columnIndex =
    callMemoOrStaticFn(
      table,
      'getCellSelectionColumnIndexes',
      table_getCellSelectionColumnIndexes,
    )[cell.column.id] ?? -1

  if (columnIndex < 0) return null

  return { bounds, rowIndex, columnIndex }
}

/**
 * Checks whether this cell falls inside the final positive selection.
 *
 * Deliberately not memoized. Registering this through `assignPrototypeAPIs`
 * with `memoDeps` would allocate a memo closure and dependency array per cell,
 * which costs more than the handful of integer comparisons it would save.
 *
 * @example
 * ```ts
 * const isSelected = cell_getIsSelected(cell)
 * ```
 */
export function cell_getIsSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(cell: Cell<TFeatures, TData, TValue>): boolean {
  const position = resolveCellPosition(cell)

  if (!position) return false

  return isWithinBounds(
    position.bounds,
    position.rowIndex,
    position.columnIndex,
  )
}

/**
 * Checks whether this cell is the active cell.
 *
 * @example
 * ```ts
 * const isFocused = cell_getIsFocused(cell)
 * ```
 */
export function cell_getIsFocused<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(cell: Cell<TFeatures, TData, TValue>): boolean {
  const ranges = cell.table.atoms.cellSelection?.get()
  const active = ranges?.[ranges.length - 1]

  if (!active) return false

  return (
    active.anchorRowId === cell.row.id &&
    active.anchorColumnId === cell.column.id
  )
}

/**
 * Returns `0` for the focused cell and `-1` otherwise, for roving tabindex.
 *
 * @example
 * ```ts
 * const tabIndex = cell_getTabIndex(cell)
 * ```
 */
export function cell_getTabIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(cell: Cell<TFeatures, TData, TValue>): number {
  return callMemoOrStaticFn(cell, 'getIsFocused', cell_getIsFocused) ? 0 : -1
}

/**
 * Returns which sides of this cell sit on the outer boundary of the selection.
 *
 * A side is an edge when the neighbouring cell in that direction is not itself
 * covered by a range, which is what lets a consumer draw a single outline
 * around an arbitrary union of rectangles.
 *
 * @example
 * ```ts
 * const { top, right, bottom, left } = cell_getSelectionEdges(cell)
 * ```
 */
export function cell_getSelectionEdges<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(cell: Cell<TFeatures, TData, TValue>): CellSelectionEdges {
  const none: CellSelectionEdges = {
    top: false,
    right: false,
    bottom: false,
    left: false,
  }

  const position = resolveCellPosition(cell)

  if (!position) return none

  const { bounds, rowIndex, columnIndex } = position

  if (!isWithinBounds(bounds, rowIndex, columnIndex)) return none

  const merges = callMemoOrStaticFn(
    cell.table,
    'getCellSelectionMergeBounds',
    table_getCellSelectionMergeBounds,
  )
  const merge = merges.length
    ? findMergeBoundsAt(merges, rowIndex, columnIndex)
    : undefined

  if (!merge) {
    return {
      top: !isWithinBounds(bounds, rowIndex - 1, columnIndex),
      right: !isWithinBounds(bounds, rowIndex, columnIndex + 1),
      bottom: !isWithinBounds(bounds, rowIndex + 1, columnIndex),
      left: !isWithinBounds(bounds, rowIndex, columnIndex - 1),
    }
  }

  // A merged cell renders once but occupies a rectangle, so each side probes
  // the full strip beyond that rectangle. A side is an edge when any strip
  // cell falls outside the selection, since the single rendered border cannot
  // be split into segments.
  return {
    top: isStripOutside(
      bounds,
      merge.minRowIndex - 1,
      merge.minColumnIndex,
      merge.maxColumnIndex,
      true,
    ),
    right: isStripOutside(
      bounds,
      merge.maxColumnIndex + 1,
      merge.minRowIndex,
      merge.maxRowIndex,
      false,
    ),
    bottom: isStripOutside(
      bounds,
      merge.maxRowIndex + 1,
      merge.minColumnIndex,
      merge.maxColumnIndex,
      true,
    ),
    left: isStripOutside(
      bounds,
      merge.minColumnIndex - 1,
      merge.minRowIndex,
      merge.maxRowIndex,
      false,
    ),
  }
}

function isStripOutside(
  bounds: ReadonlyArray<CellSelectionBounds>,
  fixedIndex: number,
  from: number,
  to: number,
  fixedIsRow: boolean,
): boolean {
  for (let i = from; i <= to; i++) {
    const rowIndex = fixedIsRow ? fixedIndex : i
    const columnIndex = fixedIsRow ? i : fixedIndex
    if (!isWithinBounds(bounds, rowIndex, columnIndex)) return true
  }
  return false
}

// Focus APIs

/**
 * Returns the active cell, i.e. the anchor of the most recent operation.
 *
 * Focus is derived rather than stored: in spreadsheet semantics, dragging from
 * A1 to C5 leaves the active cell at A1, so the active range's anchor already
 * is the active cell.
 *
 * @example
 * ```ts
 * const cell = table_getFocusedCell(table)
 * ```
 */
export function table_getFocusedCell<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
): Cell<TFeatures, TData, any> | undefined {
  const ranges = table.atoms.cellSelection?.get()
  const active = ranges?.[ranges.length - 1]

  if (!active) return undefined

  const row =
    table.getPrePaginatedRowModel().rowsById[active.anchorRowId] ??
    table.getCoreRowModel().rowsById[active.anchorRowId]

  return row?.getAllCellsByColumnId()[active.anchorColumnId]
}

/**
 * Collapses the selection to a single cell at the given coordinates.
 *
 * @example
 * ```ts
 * table_setFocusedCell(table, '3', 'firstName')
 * ```
 */
export function table_setFocusedCell<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, rowId: string, columnId: string) {
  table_selectCellRange(table, {
    anchorRowId: rowId,
    anchorColumnId: columnId,
    focusRowId: rowId,
    focusColumnId: columnId,
  })
}

// Selection writes

/**
 * Selects a rectangle using replace, include, or exclude semantics.
 *
 * @example
 * ```ts
 * table_selectCellRange(table, range, { mode: 'exclude' })
 * ```
 */
export function table_selectCellRange<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  range: CellSelectionRange,
  opts?: SelectCellRangeOptions,
) {
  const mode = opts?.mode ?? (opts?.additive ? 'include' : 'replace')
  const { operation: _operation, ...coordinates } = range
  const nextRange: CellSelectionRange =
    mode === 'exclude' ? { ...coordinates, operation: 'exclude' } : coordinates

  table_setCellSelection(table, (old) =>
    mode === 'replace' ? [nextRange] : [...old, nextRange],
  )
}

/**
 * Returns the visible leaf columns that permit selection, in display order.
 *
 * A column-level opt-out is enough to exclude a column here; a per-cell
 * predicate is not consulted, since navigation and select-all work in column
 * space rather than cell space.
 */
function getSelectableColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
): Array<Column<TFeatures, TData, unknown>> {
  const columns = getDisplayOrderedColumns(table)

  if (table.options.enableCellSelection === false) return []

  return columns.filter(
    (column) =>
      (column.columnDef as Partial<ColumnDef_CellSelection>)
        .enableCellSelection !== false,
  )
}

/**
 * Selects every selectable cell in the table as one range.
 *
 * @example
 * ```ts
 * table_selectAllCells(table)
 * ```
 */
export function table_selectAllCells<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const rows = table.getRowsInDisplayOrder()
  const columns = getSelectableColumns(table)

  if (!rows.length || !columns.length) return

  table_selectCellRange(table, {
    anchorRowId: rows[0]!.id,
    anchorColumnId: columns[0]!.id,
    focusRowId: rows[rows.length - 1]!.id,
    focusColumnId: columns[columns.length - 1]!.id,
  })
}

/**
 * Resolves a direction into row and column deltas.
 */
function getDirectionDelta(direction: CellSelectionDirection): {
  rowDelta: number
  columnDelta: number
} {
  switch (direction) {
    case 'up':
      return { rowDelta: -1, columnDelta: 0 }
    case 'down':
      return { rowDelta: 1, columnDelta: 0 }
    case 'left':
      return { rowDelta: 0, columnDelta: -1 }
    default:
      return { rowDelta: 0, columnDelta: 1 }
  }
}

/**
 * Steps one cell in a direction from a starting coordinate.
 *
 * Columns that cannot be selected are skipped over rather than landed on, so
 * arrow navigation never parks on an opted-out column. Returns `null` when the
 * step would leave the grid or find no selectable column.
 */
function stepCoordinate<TFeatures extends TableFeatures, TData extends RowData>(
  table: Table_Internal<TFeatures, TData>,
  rowId: string,
  columnId: string,
  direction: CellSelectionDirection,
): { rowId: string; columnId: string } | null {
  // Navigation is constrained to the final row model. In particular, the
  // pre-pagination display-order model contains rows from every page and
  // would let ArrowDown move focus into a row that is not rendered.
  const rows = table.getRowModel().rows
  const columns = getDisplayOrderedColumns(table)

  if (!rows.length || !columns.length) return null

  const { rowDelta, columnDelta } = getDirectionDelta(direction)
  const rowIndex = rows.findIndex((row) => row.id === rowId)
  const columnIndex = columns.findIndex((column) => column.id === columnId)

  if (rowIndex < 0 || columnIndex < 0) return null

  // A merged cell is one navigation stop: step from its far edge in the
  // travel direction so a single press crosses the whole merge, and snap any
  // landing inside a merge to the merge's anchor.
  const merges = callMemoOrStaticFn(
    table,
    'getCellSelectionMergeBounds',
    table_getCellSelectionMergeBounds,
  )
  let fromRowIndex = rows[rowIndex]!.getDisplayIndex()
  let fromColumnIndex = columnIndex

  if (merges.length) {
    const startMerge = findMergeBoundsAt(merges, rowIndex, columnIndex)
    if (startMerge) {
      if (rowDelta > 0) fromRowIndex = startMerge.maxRowIndex
      if (rowDelta < 0) fromRowIndex = startMerge.minRowIndex
      if (columnDelta > 0) fromColumnIndex = startMerge.maxColumnIndex
      if (columnDelta < 0) fromColumnIndex = startMerge.minColumnIndex
    }
  }

  let nextRowIndex = rowIndex + rowDelta

  if (rowDelta && fromRowIndex !== rows[rowIndex]!.getDisplayIndex()) {
    const edgeRowIndex = rows.findIndex(
      (row) => row.getDisplayIndex() === fromRowIndex,
    )
    if (edgeRowIndex < 0) return null
    nextRowIndex = edgeRowIndex + rowDelta
  }

  if (nextRowIndex < 0 || nextRowIndex >= rows.length) {
    return null
  }

  const selectableColumnIds = new Set(
    getSelectableColumns(table).map((column) => column.id),
  )

  if (!selectableColumnIds.size) return null

  let nextColumnIndex = fromColumnIndex

  if (columnDelta) {
    do {
      nextColumnIndex += columnDelta
    } while (
      nextColumnIndex >= 0 &&
      nextColumnIndex < columns.length &&
      !selectableColumnIds.has(columns[nextColumnIndex]!.id)
    )
  } else if (!selectableColumnIds.has(columnId)) {
    // A programmatically restored anchor may point at a column that has since
    // opted out. Snap vertical navigation to the closest selectable column.
    for (let distance = 1; distance < columns.length; distance++) {
      const before = columns[columnIndex - distance]
      const after = columns[columnIndex + distance]

      if (before && selectableColumnIds.has(before.id)) {
        nextColumnIndex = columnIndex - distance
        break
      }
      if (after && selectableColumnIds.has(after.id)) {
        nextColumnIndex = columnIndex + distance
        break
      }
    }
  }

  if (
    nextColumnIndex < 0 ||
    nextColumnIndex >= columns.length ||
    !selectableColumnIds.has(columns[nextColumnIndex]!.id)
  ) {
    return null
  }

  let landingRowIndex = nextRowIndex
  let landingColumnIndex = nextColumnIndex

  if (merges.length) {
    const landingDisplayRowIndex = rows[nextRowIndex]!.getDisplayIndex()
    const landingMerge = findMergeBoundsAt(
      merges,
      landingDisplayRowIndex,
      nextColumnIndex,
    )
    if (landingMerge) {
      landingRowIndex = rows.findIndex(
        (row) => row.getDisplayIndex() === landingMerge.minRowIndex,
      )
      if (landingRowIndex < 0) return null
      landingColumnIndex = landingMerge.minColumnIndex
    }
  }

  const landingRow = rows[landingRowIndex]
  const landingColumn = columns[landingColumnIndex]

  if (!landingRow || !landingColumn) return null

  return {
    rowId: landingRow.id,
    columnId: landingColumn.id,
  }
}

/**
 * Moves the selection one step in a direction, collapsing it to a single cell.
 *
 * With nothing selected, this selects the first selectable cell so keyboard
 * navigation has somewhere to start.
 *
 * @example
 * ```ts
 * table_moveCellSelection(table, 'down')
 * ```
 */
export function table_moveCellSelection<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, direction: CellSelectionDirection) {
  const ranges = table.atoms.cellSelection?.get()
  const active = ranges?.[ranges.length - 1]

  if (!active) {
    const rows = table.getRowModel().rows
    const columns = getSelectableColumns(table)

    if (!rows.length || !columns.length) return

    table_setFocusedCell(table, rows[0]!.id, columns[0]!.id)
    return
  }

  const next = stepCoordinate(
    table,
    active.anchorRowId,
    active.anchorColumnId,
    direction,
  )

  if (!next) return

  table_setFocusedCell(table, next.rowId, next.columnId)
}

/**
 * Extends the active range one step in a direction, keeping its anchor fixed.
 *
 * @example
 * ```ts
 * table_extendCellSelection(table, 'right')
 * ```
 */
export function table_extendCellSelection<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, direction: CellSelectionDirection) {
  const ranges = table.atoms.cellSelection?.get()
  const active = ranges?.[ranges.length - 1]

  if (!active) {
    table_moveCellSelection(table, direction)
    return
  }

  const next = stepCoordinate(
    table,
    active.focusRowId,
    active.focusColumnId,
    direction,
  )

  if (!next) return

  table_setCellSelection(table, (old) => {
    if (!old.length) return old

    const nextRanges = old.slice(0, -1)

    nextRanges.push({
      ...old[old.length - 1]!,
      focusRowId: next.rowId,
      focusColumnId: next.columnId,
    })

    return nextRanges
  })
}

// Derived selection data

/**
 * Walks each final positive region, invoking a visitor per selectable cell.
 *
 * Every expansion API shares this so the per-cell enable predicate is applied
 * in exactly one place.
 */
function forEachSelectedCell<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  visit: (
    cell: Cell<TFeatures, TData, any>,
    rangeIndex: number,
    rowOffset: number,
    columnOffset: number,
  ) => void,
  // Skip cells another cell's span covers, so ids and counts match what
  // renders. Ranges data keeps them: covered cells still carry real values,
  // and dropping them would misalign the row-major grid.
  skipCovered = false,
) {
  const bounds = callMemoOrStaticFn(
    table,
    'getCellSelectionBounds',
    table_getCellSelectionBounds,
  )

  if (!bounds.length) return

  const rows = table.getRowsInDisplayOrder()
  const columns = getDisplayOrderedColumns(table)

  for (let i = 0; i < bounds.length; i++) {
    const bound = bounds[i]!

    for (
      let rowIndex = bound.minRowIndex;
      rowIndex <= bound.maxRowIndex;
      rowIndex++
    ) {
      const row = rows[rowIndex]
      if (!row) continue

      const cellsByColumnId = row.getAllCellsByColumnId()

      for (
        let columnIndex = bound.minColumnIndex;
        columnIndex <= bound.maxColumnIndex;
        columnIndex++
      ) {
        const column = columns[columnIndex]
        if (!column) continue

        const cell = cellsByColumnId[column.id]
        if (!cell) continue
        if (!callMemoOrStaticFn(cell, 'getCanSelect', cell_getCanSelect)) {
          continue
        }
        if (
          skipCovered &&
          (
            cell as Cell<TFeatures, TData, any> & {
              getIsCovered?: () => boolean
            }
          ).getIsCovered?.()
        ) {
          continue
        }

        visit(
          cell,
          i,
          rowIndex - bound.minRowIndex,
          columnIndex - bound.minColumnIndex,
        )
      }
    }
  }
}

/**
 * Returns the ids of all selected cells, in row-major order.
 *
 * Cells covered by overlapping ranges are returned once, at their first
 * occurrence.
 *
 * @example
 * ```ts
 * const ids = table_getSelectedCellIds(table)
 * ```
 */
export function table_getSelectedCellIds<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): Array<string> {
  const ids: Array<string> = []
  const seen = new Set<string>()

  forEachSelectedCell(
    table,
    (cell) => {
      if (seen.has(cell.id)) return
      seen.add(cell.id)
      ids.push(cell.id)
    },
    true,
  )

  return ids
}

/**
 * Returns each final positive region's values as a row-major grid.
 *
 * This is the raw material for clipboard export. Serializing it to text is left
 * to userland, since the delimiter, the null representation, and whether values
 * containing delimiters get quoted are all application decisions.
 *
 * @example
 * ```ts
 * const [firstRange] = table_getSelectedCellRangesData(table)
 * ```
 */
export function table_getSelectedCellRangesData<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): Array<Array<Array<unknown>>> {
  const grids: Array<Array<Array<unknown>>> = []

  forEachSelectedCell(table, (cell, rangeIndex, rowOffset) => {
    const grid = (grids[rangeIndex] ??= [])
    const row = (grid[rowOffset] ??= [])
    row.push(cell.getValue())
  })

  return grids
}

/**
 * Returns the number of selected cells.
 *
 * Uses rectangle arithmetic over the normalized, disjoint positive regions.
 * A per-cell `enableCellSelection` predicate requires enumeration.
 *
 * @example
 * ```ts
 * const count = table_getSelectedCellCount(table)
 * ```
 */
export function table_getSelectedCellCount<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): number {
  if (table.options.enableCellSelection === false) return 0

  const bounds = callMemoOrStaticFn(
    table,
    'getCellSelectionBounds',
    table_getCellSelectionBounds,
  )

  if (!bounds.length) return 0

  const merges = callMemoOrStaticFn(
    table,
    'getCellSelectionMergeBounds',
    table_getCellSelectionMergeBounds,
  )

  // A per-cell predicate requires enumeration, and so do merged cells: a
  // merge counts once, and after subtraction a merge can straddle several
  // final rectangles, which breaks per-rectangle arithmetic.
  if (
    typeof table.options.enableCellSelection === 'function' ||
    merges.length
  ) {
    const ids = new Set<string>()
    forEachSelectedCell(table, (cell) => ids.add(cell.id), true)
    return ids.size
  }

  const columns = getDisplayOrderedColumns(table)
  let count = 0
  for (const bound of bounds) {
    let selectableColumns = 0
    for (
      let columnIndex = bound.minColumnIndex;
      columnIndex <= bound.maxColumnIndex;
      columnIndex++
    ) {
      const column = columns[columnIndex]
      if (!column) continue
      const columnDef = column.columnDef as Partial<ColumnDef_CellSelection>
      if (columnDef.enableCellSelection !== false) selectableColumns++
    }
    count += (bound.maxRowIndex - bound.minRowIndex + 1) * selectableColumns
  }

  return count
}

/**
 * Returns the ids of all rows intersected by the selection.
 *
 * @example
 * ```ts
 * const rowIds = table_getCellSelectionRowIds(table)
 * ```
 */
export function table_getCellSelectionRowIds<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): Array<string> {
  const bounds = callMemoOrStaticFn(
    table,
    'getCellSelectionBounds',
    table_getCellSelectionBounds,
  )

  if (!bounds.length) return []

  const rows = table.getRowsInDisplayOrder()
  const seen = new Set<string>()
  const ids: Array<string> = []

  for (let i = 0; i < bounds.length; i++) {
    const bound = bounds[i]!
    for (let index = bound.minRowIndex; index <= bound.maxRowIndex; index++) {
      const row = rows[index]
      if (!row || seen.has(row.id)) continue
      seen.add(row.id)
      ids.push(row.id)
    }
  }

  return ids
}

/**
 * Returns the ids of all columns intersected by the selection.
 *
 * @example
 * ```ts
 * const columnIds = table_getCellSelectionColumnIds(table)
 * ```
 */
export function table_getCellSelectionColumnIds<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): Array<string> {
  const bounds = callMemoOrStaticFn(
    table,
    'getCellSelectionBounds',
    table_getCellSelectionBounds,
  )

  if (!bounds.length) return []

  const columns = getDisplayOrderedColumns(table)
  const seen = new Set<string>()
  const ids: Array<string> = []

  for (let i = 0; i < bounds.length; i++) {
    const bound = bounds[i]!
    for (
      let index = bound.minColumnIndex;
      index <= bound.maxColumnIndex;
      index++
    ) {
      const column = columns[index]
      if (!column || seen.has(column.id)) continue
      const columnDef = column.columnDef as Partial<ColumnDef_CellSelection>
      if (columnDef.enableCellSelection === false) continue
      seen.add(column.id)
      ids.push(column.id)
    }
  }

  return ids
}

// Handlers

/**
 * Creates a handler that begins a selection at this cell.
 *
 * Follows `header_getResizeHandler`: the enable check is resolved once outside
 * the returned closure and guarded again inside it, the document is injectable
 * for SSR and cross-document rendering, and the document-level `mouseup`
 * listener is attached here so a drag released outside the table still ends.
 *
 * @example
 * ```tsx
 * <td onMouseDown={cell.getSelectionStartHandler()} />
 * ```
 */
export function cell_getSelectionStartHandler<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(cell: Cell<TFeatures, TData, TValue>, _contextDocument?: Document) {
  const canSelect = cell_getCanSelect(cell)

  return (e: unknown) => {
    if (!canSelect) return

    const table = cell.table
    const options = table.options
    const contextDocument =
      _contextDocument ?? (typeof document !== 'undefined' ? document : null)

    const isRangeEvent =
      options.enableCellRangeSelection !== false &&
      (options.isCellRangeSelectionEvent?.(e) ?? false)
    const isMultiRangeEvent =
      options.enableMultiCellRangeSelection !== false &&
      (options.isMultiCellRangeSelectionEvent?.(e) ?? false)
    const dragEnabled =
      options.enableCellSelectionDrag !== false &&
      options.enableCellRangeSelection !== false

    if (dragEnabled && contextDocument) {
      // the open-drag flag is instance data, so closing it never writes state
      // @ts-ignore - _isSelectingCells is part of the CellSelection feature
      table._isSelectingCells = true

      const upHandler = () => {
        contextDocument.removeEventListener('mouseup', upHandler)
        // @ts-ignore - _isSelectingCells is part of the CellSelection feature
        table._isSelectingCells = false
      }
      contextDocument.addEventListener('mouseup', upHandler)
    }

    const rowId = cell.row.id
    const columnId = cell.column.id
    const shouldExclude =
      isMultiRangeEvent &&
      callMemoOrStaticFn(cell, 'getIsSelected', cell_getIsSelected)

    table_setCellSelection(table, (old) => {
      const active = old[old.length - 1]

      // shift-extend keeps the active anchor and moves only its focus
      if (isRangeEvent && active) {
        const ranges = old.slice(0, -1)
        ranges.push({ ...active, focusRowId: rowId, focusColumnId: columnId })
        return ranges
      }

      const range: CellSelectionRange = {
        anchorRowId: rowId,
        anchorColumnId: columnId,
        focusRowId: rowId,
        focusColumnId: columnId,
        ...(shouldExclude ? { operation: 'exclude' as const } : {}),
      }

      return isMultiRangeEvent ? [...old, range] : [range]
    })
  }
}

/**
 * Creates a handler that extends the active range to this cell during a drag.
 *
 * No rAF coalescing is needed here, unlike the resize handler: `mouseenter`
 * fires once per cell boundary crossed rather than continuously, and deferring
 * it by a frame would only delay the highlight.
 *
 * @example
 * ```tsx
 * <td onMouseEnter={cell.getSelectionExtendHandler()} />
 * ```
 */
export function cell_getSelectionExtendHandler<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(cell: Cell<TFeatures, TData, TValue>) {
  const canSelect = cell_getCanSelect(cell)

  return (_e: unknown) => {
    if (!canSelect) return

    const table = cell.table

    // @ts-ignore - _isSelectingCells is part of the CellSelection feature
    if (!table._isSelectingCells) return

    const ranges = table.atoms.cellSelection?.get()
    const active = ranges?.[ranges.length - 1]

    if (!active) return

    const rowId = cell.row.id
    const columnId = cell.column.id

    table_setCellSelection(table, (old) => {
      if (!old.length) return old

      const next = old.slice(0, -1)

      next.push({
        ...old[old.length - 1]!,
        focusRowId: rowId,
        focusColumnId: columnId,
      })

      return next
    })
  }
}
