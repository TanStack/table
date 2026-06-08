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
import type { Column_Internal } from '../../types/Column'
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
    left: [],
    right: [],
  }
}

// Column APIs

/**
 * Moves this column's leaf column ids into a pinning region.
 *
 * Pinning a group column pins all of its leaves. The leaf ids are first removed
 * from both regions, then appended to the requested `'left'` or `'right'`
 * region. Passing `false` unpins them back to the center.
 *
 * @example
 * ```ts
 * column_pin(column, 'left')
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
    if (position === 'right') {
      return {
        left: old.left.filter((d) => !columnIds.includes(d)),
        right: [
          ...old.right.filter((d) => !columnIds.includes(d)),
          ...columnIds,
        ],
      }
    }

    if (position === 'left') {
      return {
        left: [...old.left.filter((d) => !columnIds.includes(d)), ...columnIds],
        right: old.right.filter((d) => !columnIds.includes(d)),
      }
    }

    return {
      left: old.left.filter((d) => !columnIds.includes(d)),
      right: old.right.filter((d) => !columnIds.includes(d)),
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
 * Group columns report `'left'` or `'right'` when any leaf column is pinned in
 * that region. Unpinned columns return `false`.
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
  const leafColumnIds = column.getLeafColumns().map((d) => d.id)

  const { left, right } =
    column.table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()

  const isLeft = leafColumnIds.some((d) => left.includes(d))
  const isRight = leafColumnIds.some((d) => right.includes(d))

  return isLeft ? 'left' : isRight ? 'right' : false
}

/**
 * Finds this column's index within its pinned region.
 *
 * Unpinned columns return `0`; pinned columns return their position in
 * `state.columnPinning.left` or `state.columnPinning.right`.
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
 * Collects visible cells whose columns are not pinned left or right.
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
  const { left, right } =
    row.table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()
  const leftAndRight: Array<string> = [...left, ...right]
  return allCells.filter((d) => !leftAndRight.includes(d.column.id))
}

/**
 * Collects visible cells for columns pinned to the left region.
 *
 * Cells are returned in `state.columnPinning.left` order and are marked with
 * `cell.position = 'left'`.
 *
 * @example
 * ```ts
 * const leftCells = row_getLeftVisibleCells(row)
 * ```
 */
export function row_getLeftVisibleCells<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>): Array<Cell<TFeatures, TData, unknown>> {
  const { left } =
    row.table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()
  if (!left.length) return []
  const allVisibleCells = callMemoOrStaticFn(
    row,
    'getVisibleCellsByColumnId',
    row_getVisibleCellsByColumnId,
  )
  const cells: Array<Cell<TFeatures, TData, unknown>> = []
  for (let i = 0; i < left.length; i++) {
    const columnId = left[i]!
    const cell = allVisibleCells[columnId]
    if (cell) {
      // Assign position property directly to preserve prototype chain
      ;(cell as any).position = 'left'
      cells.push(cell)
    }
  }
  return cells
}

/**
 * Collects visible cells for columns pinned to the right region.
 *
 * Cells are returned in `state.columnPinning.right` order and are marked with
 * `cell.position = 'right'`.
 *
 * @example
 * ```ts
 * const rightCells = row_getRightVisibleCells(row)
 * ```
 */
export function row_getRightVisibleCells<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  const { right } =
    row.table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()
  if (!right.length) return [] as Array<Cell<TFeatures, TData, unknown>>
  const allVisibleCells = callMemoOrStaticFn(
    row,
    'getVisibleCellsByColumnId',
    row_getVisibleCellsByColumnId,
  )
  const cells: Array<Cell<TFeatures, TData, unknown>> = []
  for (let i = 0; i < right.length; i++) {
    const columnId = right[i]!
    const cell = allVisibleCells[columnId]
    if (cell) {
      // Assign position property directly to preserve prototype chain
      ;(cell as any).position = 'right'
      cells.push(cell)
    }
  }
  return cells
}

// Table APIs

/**
 * Routes a column pinning updater through the table's pinning change handler.
 *
 * The updater may be a next `{ left, right }` state or a function of the
 * previous state, matching the instance `table.setColumnPinning` behavior.
 *
 * @example
 * ```ts
 * table_setColumnPinning(table, (old) => ({ ...old, left: ['select'] }))
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
 * exists. Passing `true` ignores initial state and resets to empty left/right
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
 * Omit `position` to check both sides, or pass `'left'`/`'right'` to inspect a
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
    return Boolean(pinningState?.left.length || pinningState?.right.length)
  }
  return Boolean(pinningState?.[position].length)
}

// header groups

/**
 * Builds header groups for visible columns pinned to the left region.
 *
 * The leaf columns are read in `state.columnPinning.left` order and then passed
 * through the same header-group builder as the unpinned table.
 *
 * @example
 * ```ts
 * const headerGroups = table_getLeftHeaderGroups(table)
 * ```
 */
export function table_getLeftHeaderGroups<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const allColumns = table.getAllColumns()
  const leafColumnsById = table.getAllLeafColumnsById() as Record<
    string,
    Column_Internal<TFeatures, TData, unknown>
  >
  const { left } =
    table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()

  const orderedLeafColumns: Array<Column_Internal<TFeatures, TData, unknown>> =
    []
  for (let i = 0; i < left.length; i++) {
    const column = leafColumnsById[left[i]!]
    if (
      column &&
      callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible)
    ) {
      orderedLeafColumns.push(column)
    }
  }

  return buildHeaderGroups(allColumns, orderedLeafColumns, table, 'left')
}

/**
 * Builds header groups for visible columns pinned to the right region.
 *
 * The leaf columns are read in `state.columnPinning.right` order and then
 * passed through the same header-group builder as the unpinned table.
 *
 * @example
 * ```ts
 * const headerGroups = table_getRightHeaderGroups(table)
 * ```
 */
export function table_getRightHeaderGroups<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const allColumns = table.getAllColumns()
  const leafColumnsById = table.getAllLeafColumnsById() as Record<
    string,
    Column_Internal<TFeatures, TData, unknown>
  >
  const { right } =
    table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()

  const orderedLeafColumns: Array<Column_Internal<TFeatures, TData, unknown>> =
    []
  for (let i = 0; i < right.length; i++) {
    const column = leafColumnsById[right[i]!]
    if (
      column &&
      callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible)
    ) {
      orderedLeafColumns.push(column)
    }
  }

  return buildHeaderGroups(allColumns, orderedLeafColumns, table, 'right')
}

/**
 * Builds header groups for visible columns that are not pinned.
 *
 * Left- and right-pinned column ids are removed from the visible leaf column
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
  ) as unknown as Array<Column_Internal<TFeatures, TData, unknown>>
  const { left, right } =
    table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()
  const leftAndRight: Array<string> = [...left, ...right]

  leafColumns = leafColumns.filter(
    (column) => !leftAndRight.includes(column.id),
  )
  return buildHeaderGroups(allColumns, leafColumns, table, 'center')
}

// footer groups

/**
 * Builds footer groups for the left pinned region.
 *
 * Footer groups reuse the left header groups in reverse order.
 *
 * @example
 * ```ts
 * const footerGroups = table_getLeftFooterGroups(table)
 * ```
 */
export function table_getLeftFooterGroups<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const headerGroups = callMemoOrStaticFn(
    table,
    'getLeftHeaderGroups',
    table_getLeftHeaderGroups,
  )
  return [...headerGroups].reverse()
}

/**
 * Builds footer groups for the right pinned region.
 *
 * Footer groups reuse the right header groups in reverse order.
 *
 * @example
 * ```ts
 * const footerGroups = table_getRightFooterGroups(table)
 * ```
 */
export function table_getRightFooterGroups<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const headerGroups = callMemoOrStaticFn(
    table,
    'getRightHeaderGroups',
    table_getRightHeaderGroups,
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
 * Flattens every header from the left pinned header groups.
 *
 * Parent headers and placeholder headers are included.
 *
 * @example
 * ```ts
 * const headers = table_getLeftFlatHeaders(table)
 * ```
 */
export function table_getLeftFlatHeaders<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const leftHeaderGroups = callMemoOrStaticFn(
    table,
    'getLeftHeaderGroups',
    table_getLeftHeaderGroups,
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
 * Flattens every header from the right pinned header groups.
 *
 * Parent headers and placeholder headers are included.
 *
 * @example
 * ```ts
 * const headers = table_getRightFlatHeaders(table)
 * ```
 */
export function table_getRightFlatHeaders<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const rightHeaderGroups = callMemoOrStaticFn(
    table,
    'getRightHeaderGroups',
    table_getRightHeaderGroups,
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
 * Collects leaf headers for the left pinned region.
 *
 * Parent headers are filtered out from the left flat header list.
 *
 * @example
 * ```ts
 * const headers = table_getLeftLeafHeaders(table)
 * ```
 */
export function table_getLeftLeafHeaders<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return callMemoOrStaticFn(
    table,
    'getLeftFlatHeaders',
    table_getLeftFlatHeaders,
  ).filter((header) => !header.subHeaders.length)
}

/**
 * Collects leaf headers for the right pinned region.
 *
 * Parent headers are filtered out from the right flat header list.
 *
 * @example
 * ```ts
 * const headers = table_getRightLeafHeaders(table)
 * ```
 */
export function table_getRightLeafHeaders<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return callMemoOrStaticFn(
    table,
    'getRightFlatHeaders',
    table_getRightFlatHeaders,
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
 * Resolves leaf columns pinned to the left region.
 *
 * The result follows `state.columnPinning.left` order and skips stale ids that
 * no longer correspond to a leaf column.
 *
 * @example
 * ```ts
 * const columns = table_getLeftLeafColumns(table)
 * ```
 */
export function table_getLeftLeafColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const { left } =
    table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()
  const leafColumnsById = table.getAllLeafColumnsById()
  const result: Array<Column_Internal<TFeatures, TData, unknown>> = []
  for (let i = 0; i < left.length; i++) {
    const column = leafColumnsById[left[i]!]
    if (column) result.push(column)
  }
  return result
}

/**
 * Resolves leaf columns pinned to the right region.
 *
 * The result follows `state.columnPinning.right` order and skips stale ids that
 * no longer correspond to a leaf column.
 *
 * @example
 * ```ts
 * const columns = table_getRightLeafColumns(table)
 * ```
 */
export function table_getRightLeafColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const { right } =
    table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()
  const leafColumnsById = table.getAllLeafColumnsById()
  const result: Array<Column_Internal<TFeatures, TData, unknown>> = []
  for (let i = 0; i < right.length; i++) {
    const column = leafColumnsById[right[i]!]
    if (column) result.push(column)
  }
  return result
}

/**
 * Resolves leaf columns that are not pinned to either side.
 *
 * Left- and right-pinned ids are removed from `table.getAllLeafColumns()`.
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
  const { left, right } =
    table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()
  const leftAndRight: Array<string> = [...left, ...right]
  return table.getAllLeafColumns().filter((d) => !leftAndRight.includes(d.id))
}

/**
 * Resolves leaf columns for a requested pinning region.
 *
 * Pass `'left'`, `'center'`, or `'right'` for a partition, or pass `false` to
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
    : position === 'left'
      ? callMemoOrStaticFn(
          table,
          'getLeftLeafColumns',
          table_getLeftLeafColumns,
        )
      : position === 'right'
        ? callMemoOrStaticFn(
            table,
            'getRightLeafColumns',
            table_getRightLeafColumns,
          )
        : callMemoOrStaticFn(
            table,
            'getCenterLeafColumns',
            table_getCenterLeafColumns,
          )
}

// visible leaf columns

/**
 * Resolves visible leaf columns pinned to the left region.
 *
 * Hidden pinned columns are filtered out after the left pin order is applied.
 *
 * @example
 * ```ts
 * const columns = table_getLeftVisibleLeafColumns(table)
 * ```
 */
export function table_getLeftVisibleLeafColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return callMemoOrStaticFn(
    table,
    'getLeftLeafColumns',
    table_getLeftLeafColumns,
  ).filter((column) =>
    callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible),
  )
}

/**
 * Resolves visible leaf columns pinned to the right region.
 *
 * Hidden pinned columns are filtered out after the right pin order is applied.
 *
 * @example
 * ```ts
 * const columns = table_getRightVisibleLeafColumns(table)
 * ```
 */
export function table_getRightVisibleLeafColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return callMemoOrStaticFn(
    table,
    'getRightLeafColumns',
    table_getRightLeafColumns,
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
 * Omit `position` to get all visible leaf columns, or pass `'left'`, `'center'`,
 * or `'right'` to get one partition.
 *
 * @example
 * ```ts
 * const columns = table_getPinnedVisibleLeafColumns(table, 'left')
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
    : position === 'left'
      ? callMemoOrStaticFn(
          table,
          'getLeftVisibleLeafColumns',
          table_getLeftVisibleLeafColumns,
        )
      : position === 'right'
        ? callMemoOrStaticFn(
            table,
            'getRightVisibleLeafColumns',
            table_getRightVisibleLeafColumns,
          )
        : callMemoOrStaticFn(
            table,
            'getCenterVisibleLeafColumns',
            table_getCenterVisibleLeafColumns,
          )
}
