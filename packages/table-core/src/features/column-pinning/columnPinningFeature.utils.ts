import {
  column_getIsVisible,
  row_getVisibleCells,
  row_getVisibleCellsByColumnId,
  table_getVisibleLeafColumns,
} from '../column-visibility/columnVisibilityFeature.utils'
import { buildHeaderGroups } from '../../core/headers/buildHeaderGroups'
import { callMemoOrStaticFn, cloneState } from '../../utils'
import type { Header } from '../../types/Header'
import type { HeaderGroup } from '../../types/HeaderGroup'
import type { Cell } from '../../types/Cell'
import type { Row } from '../../types/Row'
import type { CellData, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { Column, Column_Internal } from '../../types/Column'
import type {
  ColumnPinningPosition,
  ColumnPinningState,
} from './columnPinningFeature.types'

// State

/**
 * Creates the default column pinning state.
 *
 * Both pinning regions start empty. Reset APIs use this value when
 * `defaultState` is `true`.
 *
 * @example
 * ```ts
 * const pinning = getDefaultColumnPinningState()
 * ```
 */
export function getDefaultColumnPinningState(): ColumnPinningState {
  return {
    start: [],
    end: [],
  }
}

// Column APIs

/**
 * Moves this column's leaf column ids into a pinning region.
 *
 * Pinning a group column pins all of its leaves. The leaf ids are first removed
 * from both regions, then appended to the requested `'start'` or `'end'`
 * region. Passing `false` unpins them back to the center.
 *
 * `start` and `end` are logical positions. In LTR languages/layouts, `start`
 * usually corresponds to left and `end` to right. In RTL languages/layouts,
 * `start` usually corresponds to right and `end` to left.
 *
 * @example
 * ```ts
 * column_pin(column, 'start')
 * ```
 */
export function column_pin<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
  position: ColumnPinningPosition,
) {
  // Single pass: collect non-empty leaf-column ids.
  const leafColumns = column.getLeafColumns()
  const columnIds: Array<string> = []
  for (let i = 0; i < leafColumns.length; i++) {
    const id = leafColumns[i]!.id
    if (id) columnIds.push(id)
  }

  table_setColumnPinning(column.table, (old) => {
    if (position === 'end') {
      return {
        start: old.start.filter((d) => !columnIds.includes(d)),
        end: [...old.end.filter((d) => !columnIds.includes(d)), ...columnIds],
      }
    }

    if (position === 'start') {
      return {
        start: [
          ...old.start.filter((d) => !columnIds.includes(d)),
          ...columnIds,
        ],
        end: old.end.filter((d) => !columnIds.includes(d)),
      }
    }

    return {
      start: old.start.filter((d) => !columnIds.includes(d)),
      end: old.end.filter((d) => !columnIds.includes(d)),
    }
  })
}

/**
 * Checks whether this column or any of its leaf columns can be pinned.
 *
 * Column-level `enablePinning` and table `enableColumnPinning` both default to
 * `true`; at least one leaf column must allow pinning.
 *
 * @example
 * ```ts
 * const canPin = column_getCanPin(column)
 * ```
 */
export function column_getCanPin<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>) {
  const leafColumns = column.getLeafColumns() as Array<
    Column_Internal<TFeatures, TData, TValue>
  >

  return leafColumns.some(
    (leafColumn) =>
      (leafColumn.columnDef.enablePinning ?? true) &&
      (column.table.options.enableColumnPinning ?? true),
  )
}

/**
 * Reads this column's current pinning region.
 *
 * Group columns report `'start'` or `'end'` when any leaf column is pinned in
 * that region. Unpinned columns return `false`.
 *
 * `start` and `end` are logical positions. In LTR languages/layouts, `start`
 * usually corresponds to left and `end` to right. In RTL languages/layouts,
 * `start` usually corresponds to right and `end` to left.
 *
 * @example
 * ```ts
 * const position = column_getIsPinned(column)
 * ```
 */
export function column_getIsPinned<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
): ColumnPinningPosition | false {
  const leafColumns = column.getLeafColumns()

  const { start, end } =
    column.table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()

  for (let i = 0; i < leafColumns.length; i++) {
    if (start.includes(leafColumns[i]!.id)) {
      return 'start'
    }
  }
  for (let i = 0; i < leafColumns.length; i++) {
    if (end.includes(leafColumns[i]!.id)) {
      return 'end'
    }
  }
  return false
}

/**
 * Finds this column's index within its pinned region.
 *
 * Unpinned columns return `0`; pinned columns return their position in
 * `state.columnPinning.start` or `state.columnPinning.end`.
 *
 * @example
 * ```ts
 * const index = column_getPinnedIndex(column)
 * ```
 */
export function column_getPinnedIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>) {
  const position = column_getIsPinned(column)

  return position
    ? (column.table.atoms.columnPinning?.get()?.[position].indexOf(column.id) ??
        -1)
    : 0
}

// Row APIs

/**
 * Collects visible cells whose columns are not pinned start or end.
 *
 * The result preserves the row's visible-cell order for center columns.
 *
 * @example
 * ```ts
 * const centerCells = row_getCenterVisibleCells(row)
 * ```
 */
export function row_getCenterVisibleCells<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  const allCells = callMemoOrStaticFn(
    row,
    'getVisibleCells',
    row_getVisibleCells,
  )
  const { start, end } =
    row.table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()
  if (!start.length && !end.length) {
    return allCells
  }
  const startAndEnd: Array<string> = [...start, ...end]
  return allCells.filter((d) => !startAndEnd.includes(d.column.id))
}

/**
 * Collects visible cells for columns pinned to the start region.
 *
 * Cells are returned in `state.columnPinning.start` order and are marked with
 * `cell.position = 'start'`.
 *
 * @example
 * ```ts
 * const startCells = row_getStartVisibleCells(row)
 * ```
 */
export function row_getStartVisibleCells<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>): Array<Cell<TFeatures, TData, unknown>> {
  const { start } =
    row.table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()
  if (!start.length) return []
  const allVisibleCells = callMemoOrStaticFn(
    row,
    'getVisibleCellsByColumnId',
    row_getVisibleCellsByColumnId,
  )
  const cells: Array<Cell<TFeatures, TData, unknown>> = []
  for (let i = 0; i < start.length; i++) {
    const columnId = start[i]!
    const cell = allVisibleCells[columnId]
    if (cell) {
      // Assign position property directly to preserve prototype chain
      ;(cell as any).position = 'start'
      cells.push(cell)
    }
  }
  return cells
}

/**
 * Collects visible cells for columns pinned to the end region.
 *
 * Cells are returned in `state.columnPinning.end` order and are marked with
 * `cell.position = 'end'`.
 *
 * @example
 * ```ts
 * const endCells = row_getEndVisibleCells(row)
 * ```
 */
export function row_getEndVisibleCells<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  const { end } =
    row.table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()
  if (!end.length) return [] as Array<Cell<TFeatures, TData, unknown>>
  const allVisibleCells = callMemoOrStaticFn(
    row,
    'getVisibleCellsByColumnId',
    row_getVisibleCellsByColumnId,
  )
  const cells: Array<Cell<TFeatures, TData, unknown>> = []
  for (let i = 0; i < end.length; i++) {
    const columnId = end[i]!
    const cell = allVisibleCells[columnId]
    if (cell) {
      // Assign position property directly to preserve prototype chain
      ;(cell as any).position = 'end'
      cells.push(cell)
    }
  }
  return cells
}

// Table APIs

/**
 * Routes a column pinning updater through the table's pinning change handler.
 *
 * The updater may be a next `{ start, end }` state or a function of the
 * previous state, matching the instance `table.setColumnPinning` behavior.
 *
 * @example
 * ```ts
 * table_setColumnPinning(table, (old) => ({ ...old, start: ['select'] }))
 * ```
 */
export function table_setColumnPinning<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  updater: Updater<ColumnPinningState>,
) {
  table.options.onColumnPinningChange?.(updater)
}

/**
 * Resets `columnPinning` to the configured initial state or feature default.
 *
 * With no argument, the reset clones `table.initialState.columnPinning` when it
 * exists. Passing `true` ignores initial state and resets to empty start/end
 * arrays.
 *
 * @example
 * ```ts
 * table_resetColumnPinning(table)
 * table_resetColumnPinning(table, true)
 * ```
 */
export function table_resetColumnPinning<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, defaultState?: boolean) {
  table_setColumnPinning(
    table,
    defaultState
      ? getDefaultColumnPinningState()
      : cloneState(
          table.initialState.columnPinning ?? getDefaultColumnPinningState(),
        ),
  )
}

/**
 * Checks whether any columns are pinned.
 *
 * Omit `position` to check both sides, or pass `'start'`/`'end'` to inspect a
 * single pinning region.
 *
 * @example
 * ```ts
 * const hasPinnedColumns = table_getIsSomeColumnsPinned(table)
 * ```
 */
export function table_getIsSomeColumnsPinned<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, position?: ColumnPinningPosition) {
  const pinningState = table.atoms.columnPinning?.get()

  if (!position) {
    return Boolean(pinningState?.start.length || pinningState?.end.length)
  }
  return Boolean(pinningState?.[position].length)
}

// header groups

/**
 * Builds header groups for visible columns pinned to the start region.
 *
 * The leaf columns are read in `state.columnPinning.start` order and then passed
 * through the same header-group builder as the unpinned table.
 *
 * @example
 * ```ts
 * const headerGroups = table_getStartHeaderGroups(table)
 * ```
 */
export function table_getStartHeaderGroups<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const allColumns = table.getAllColumns()
  const leafColumnsById = table.getAllLeafColumnsById()
  const { start } =
    table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()

  const orderedLeafColumns: Array<Column<TFeatures, TData, unknown>> = []
  for (let i = 0; i < start.length; i++) {
    const column = leafColumnsById[start[i]!]
    if (
      column &&
      callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible)
    ) {
      orderedLeafColumns.push(column)
    }
  }

  return buildHeaderGroups(allColumns, orderedLeafColumns, table, 'start')
}

/**
 * Builds header groups for visible columns pinned to the end region.
 *
 * The leaf columns are read in `state.columnPinning.end` order and then
 * passed through the same header-group builder as the unpinned table.
 *
 * @example
 * ```ts
 * const headerGroups = table_getEndHeaderGroups(table)
 * ```
 */
export function table_getEndHeaderGroups<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const allColumns = table.getAllColumns()
  const leafColumnsById = table.getAllLeafColumnsById()
  const { end } =
    table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()

  const orderedLeafColumns: Array<Column<TFeatures, TData, unknown>> = []
  for (let i = 0; i < end.length; i++) {
    const column = leafColumnsById[end[i]!]
    if (
      column &&
      callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible)
    ) {
      orderedLeafColumns.push(column)
    }
  }

  return buildHeaderGroups(allColumns, orderedLeafColumns, table, 'end')
}

/**
 * Builds header groups for visible columns that are not pinned.
 *
 * Start- and end-pinned column ids are removed from the visible leaf column
 * list before header groups are built for the center region.
 *
 * @example
 * ```ts
 * const headerGroups = table_getCenterHeaderGroups(table)
 * ```
 */
export function table_getCenterHeaderGroups<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
): Array<HeaderGroup<TFeatures, TData>> {
  const allColumns = table.getAllColumns()
  let leafColumns = callMemoOrStaticFn(
    table,
    'getVisibleLeafColumns',
    table_getVisibleLeafColumns,
  )
  const { start, end } =
    table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()
  if (start.length || end.length) {
    const startAndEnd: Array<string> = [...start, ...end]
    leafColumns = leafColumns.filter(
      (column) => !startAndEnd.includes(column.id),
    )
  }
  return buildHeaderGroups(allColumns, leafColumns, table, 'center')
}

// footer groups

/**
 * Builds footer groups for the start pinned region.
 *
 * Footer groups reuse the start header groups in reverse order.
 *
 * @example
 * ```ts
 * const footerGroups = table_getStartFooterGroups(table)
 * ```
 */
export function table_getStartFooterGroups<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const headerGroups = callMemoOrStaticFn(
    table,
    'getStartHeaderGroups',
    table_getStartHeaderGroups,
  )
  return [...headerGroups].reverse()
}

/**
 * Builds footer groups for the end pinned region.
 *
 * Footer groups reuse the end header groups in reverse order.
 *
 * @example
 * ```ts
 * const footerGroups = table_getEndFooterGroups(table)
 * ```
 */
export function table_getEndFooterGroups<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const headerGroups = callMemoOrStaticFn(
    table,
    'getEndHeaderGroups',
    table_getEndHeaderGroups,
  )
  return [...headerGroups].reverse()
}

/**
 * Builds footer groups for the center, unpinned region.
 *
 * Footer groups reuse the center header groups in reverse order.
 *
 * @example
 * ```ts
 * const footerGroups = table_getCenterFooterGroups(table)
 * ```
 */
export function table_getCenterFooterGroups<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const headerGroups = callMemoOrStaticFn(
    table,
    'getCenterHeaderGroups',
    table_getCenterHeaderGroups,
  )
  return [...headerGroups].reverse()
}

// flat headers

/**
 * Flattens every header from the start pinned header groups.
 *
 * Parent headers and placeholder headers are included.
 *
 * @example
 * ```ts
 * const headers = table_getStartFlatHeaders(table)
 * ```
 */
export function table_getStartFlatHeaders<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const leftHeaderGroups = callMemoOrStaticFn(
    table,
    'getStartHeaderGroups',
    table_getStartHeaderGroups,
  )
  const result: Array<Header<TFeatures, TData, unknown>> = []
  for (let i = 0; i < leftHeaderGroups.length; i++) {
    const headers = leftHeaderGroups[i]!.headers
    for (let j = 0; j < headers.length; j++) {
      result.push(headers[j]!)
    }
  }
  return result
}

/**
 * Flattens every header from the end pinned header groups.
 *
 * Parent headers and placeholder headers are included.
 *
 * @example
 * ```ts
 * const headers = table_getEndFlatHeaders(table)
 * ```
 */
export function table_getEndFlatHeaders<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const rightHeaderGroups = callMemoOrStaticFn(
    table,
    'getEndHeaderGroups',
    table_getEndHeaderGroups,
  )
  const result: Array<Header<TFeatures, TData, unknown>> = []
  for (let i = 0; i < rightHeaderGroups.length; i++) {
    const headers = rightHeaderGroups[i]!.headers
    for (let j = 0; j < headers.length; j++) {
      result.push(headers[j]!)
    }
  }
  return result
}

/**
 * Flattens every header from the center header groups.
 *
 * Parent headers and placeholder headers are included.
 *
 * @example
 * ```ts
 * const headers = table_getCenterFlatHeaders(table)
 * ```
 */
export function table_getCenterFlatHeaders<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const centerHeaderGroups = callMemoOrStaticFn(
    table,
    'getCenterHeaderGroups',
    table_getCenterHeaderGroups,
  )
  const result: Array<Header<TFeatures, TData, unknown>> = []
  for (let i = 0; i < centerHeaderGroups.length; i++) {
    const headers = centerHeaderGroups[i]!.headers
    for (let j = 0; j < headers.length; j++) {
      result.push(headers[j]!)
    }
  }
  return result
}

// leaf headers

/**
 * Collects leaf headers for the start pinned region.
 *
 * Parent headers are filtered out from the start flat header list.
 *
 * @example
 * ```ts
 * const headers = table_getStartLeafHeaders(table)
 * ```
 */
export function table_getStartLeafHeaders<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return callMemoOrStaticFn(
    table,
    'getStartFlatHeaders',
    table_getStartFlatHeaders,
  ).filter((header) => !header.subHeaders.length)
}

/**
 * Collects leaf headers for the end pinned region.
 *
 * Parent headers are filtered out from the end flat header list.
 *
 * @example
 * ```ts
 * const headers = table_getEndLeafHeaders(table)
 * ```
 */
export function table_getEndLeafHeaders<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return callMemoOrStaticFn(
    table,
    'getEndFlatHeaders',
    table_getEndFlatHeaders,
  ).filter((header) => !header.subHeaders.length)
}

/**
 * Collects leaf headers for the center, unpinned region.
 *
 * Parent headers are filtered out from the center flat header list.
 *
 * @example
 * ```ts
 * const headers = table_getCenterLeafHeaders(table)
 * ```
 */
export function table_getCenterLeafHeaders<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return callMemoOrStaticFn(
    table,
    'getCenterFlatHeaders',
    table_getCenterFlatHeaders,
  ).filter((header) => !header.subHeaders.length)
}

// leaf columns

/**
 * Resolves leaf columns pinned to the start region.
 *
 * The result follows `state.columnPinning.start` order and skips stale ids that
 * no longer correspond to a leaf column.
 *
 * @example
 * ```ts
 * const columns = table_getStartLeafColumns(table)
 * ```
 */
export function table_getStartLeafColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const { start } =
    table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()
  const leafColumnsById = table.getAllLeafColumnsById()
  const result: Array<Column_Internal<TFeatures, TData, unknown>> = []
  for (let i = 0; i < start.length; i++) {
    const column = leafColumnsById[start[i]!]
    if (column) result.push(column)
  }
  return result
}

/**
 * Resolves leaf columns pinned to the end region.
 *
 * The result follows `state.columnPinning.end` order and skips stale ids that
 * no longer correspond to a leaf column.
 *
 * @example
 * ```ts
 * const columns = table_getEndLeafColumns(table)
 * ```
 */
export function table_getEndLeafColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const { end } =
    table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()
  const leafColumnsById = table.getAllLeafColumnsById()
  const result: Array<Column_Internal<TFeatures, TData, unknown>> = []
  for (let i = 0; i < end.length; i++) {
    const column = leafColumnsById[end[i]!]
    if (column) result.push(column)
  }
  return result
}

/**
 * Resolves leaf columns that are not pinned to either logical side.
 *
 * Start- and end-pinned ids are removed from `table.getAllLeafColumns()`.
 *
 * @example
 * ```ts
 * const columns = table_getCenterLeafColumns(table)
 * ```
 */
export function table_getCenterLeafColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const { start, end } =
    table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()
  if (!start.length && !end.length) {
    return table.getAllLeafColumns()
  }
  const startAndEnd: Array<string> = [...start, ...end]
  return table.getAllLeafColumns().filter((d) => !startAndEnd.includes(d.id))
}

/**
 * Resolves leaf columns for a requested pinning region.
 *
 * Pass `'start'`, `'center'`, or `'end'` for a partition, or pass `false` to
 * read all leaf columns without partitioning.
 *
 * @example
 * ```ts
 * const columns = table_getPinnedLeafColumns(table, 'center')
 * ```
 */
export function table_getPinnedLeafColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  position: ColumnPinningPosition | 'center',
) {
  return !position
    ? table.getAllLeafColumns()
    : position === 'start'
      ? callMemoOrStaticFn(
          table,
          'getStartLeafColumns',
          table_getStartLeafColumns,
        )
      : position === 'end'
        ? callMemoOrStaticFn(
            table,
            'getEndLeafColumns',
            table_getEndLeafColumns,
          )
        : callMemoOrStaticFn(
            table,
            'getCenterLeafColumns',
            table_getCenterLeafColumns,
          )
}

// visible leaf columns

/**
 * Resolves visible leaf columns pinned to the start region.
 *
 * Hidden pinned columns are filtered out after the start pin order is applied.
 *
 * @example
 * ```ts
 * const columns = table_getStartVisibleLeafColumns(table)
 * ```
 */
export function table_getStartVisibleLeafColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return callMemoOrStaticFn(
    table,
    'getStartLeafColumns',
    table_getStartLeafColumns,
  ).filter((column) =>
    callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible),
  )
}

/**
 * Resolves visible leaf columns pinned to the end region.
 *
 * Hidden pinned columns are filtered out after the end pin order is applied.
 *
 * @example
 * ```ts
 * const columns = table_getEndVisibleLeafColumns(table)
 * ```
 */
export function table_getEndVisibleLeafColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return callMemoOrStaticFn(
    table,
    'getEndLeafColumns',
    table_getEndLeafColumns,
  ).filter((column) =>
    callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible),
  )
}

/**
 * Resolves visible leaf columns that are not pinned.
 *
 * This is the center partition used by layouts that render pinned columns
 * separately from the scrollable middle region.
 *
 * @example
 * ```ts
 * const columns = table_getCenterVisibleLeafColumns(table)
 * ```
 */
export function table_getCenterVisibleLeafColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return callMemoOrStaticFn(
    table,
    'getCenterLeafColumns',
    table_getCenterLeafColumns,
  ).filter((column) =>
    callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible),
  )
}

/**
 * Resolves visible leaf columns for a requested pinning region.
 *
 * Omit `position` to get all visible leaf columns, or pass `'start'`, `'center'`,
 * or `'end'` to get one partition.
 *
 * @example
 * ```ts
 * const columns = table_getPinnedVisibleLeafColumns(table, 'start')
 * ```
 */
export function table_getPinnedVisibleLeafColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  position?: ColumnPinningPosition | 'center',
) {
  return !position
    ? callMemoOrStaticFn(
        table,
        'getVisibleLeafColumns',
        table_getVisibleLeafColumns,
      )
    : position === 'start'
      ? callMemoOrStaticFn(
          table,
          'getStartVisibleLeafColumns',
          table_getStartVisibleLeafColumns,
        )
      : position === 'end'
        ? callMemoOrStaticFn(
            table,
            'getEndVisibleLeafColumns',
            table_getEndVisibleLeafColumns,
          )
        : callMemoOrStaticFn(
            table,
            'getCenterVisibleLeafColumns',
            table_getCenterVisibleLeafColumns,
          )
}
