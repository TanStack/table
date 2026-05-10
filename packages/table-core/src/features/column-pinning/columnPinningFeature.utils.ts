import {
  column_getIsVisible,
  row_getAllVisibleCells,
  table_getVisibleLeafColumns,
} from '../column-visibility/columnVisibilityFeature.utils'
import { buildHeaderGroups } from '../../core/headers/buildHeaderGroups'
import { callMemoOrStaticFn, cloneState } from '../../utils'
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
 * Returns the default column pinning state.
 *
 * Feature constructors use this value to initialize the table state or option defaults when no user value is provided.
 *
 * @example
 * ```ts
 * const initialValue = getDefaultColumnPinningState()
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
 * Pin. for a column.
 *
 * This is the static implementation behind the matching column instance API.
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
  const columnIds = column
    .getLeafColumns()
    .map((d) => d.id)
    .filter(Boolean)

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
 * Returns whether a column can use pin.
 *
 * This combines column options, table options, and any required accessor or feature state for the capability.
 *
 * @example
 * ```ts
 * const value = column_getCanPin(column)
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
 * Returns is pinned for a column.
 *
 * This derives the value from the column definition, table options, and the feature state atoms registered on the table.
 *
 * @example
 * ```ts
 * const value = column_getIsPinned(column)
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
 * Returns pinned index for a column.
 *
 * This derives the value from the column definition, table options, and the feature state atoms registered on the table.
 *
 * @example
 * ```ts
 * const value = column_getPinnedIndex(column)
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
 * Returns center visible cells for a row.
 *
 * This is the static implementation behind the matching row instance API and may read row caches or table state atoms.
 *
 * @example
 * ```ts
 * const value = row_getCenterVisibleCells(row)
 * ```
 */
export function row_getCenterVisibleCells<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  const allCells = callMemoOrStaticFn(
    row,
    'getAllVisibleCells',
    row_getAllVisibleCells,
  )
  const { left, right } =
    row.table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()
  const leftAndRight: Array<string> = [...left, ...right]
  return allCells.filter((d) => !leftAndRight.includes(d.column.id))
}

/**
 * Returns left visible cells for a row.
 *
 * This is the static implementation behind the matching row instance API and may read row caches or table state atoms.
 *
 * @example
 * ```ts
 * const value = row_getLeftVisibleCells(row)
 * ```
 */
export function row_getLeftVisibleCells<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>): Array<Cell<TFeatures, TData, unknown>> {
  const allCells = callMemoOrStaticFn(
    row,
    'getAllVisibleCells',
    row_getAllVisibleCells,
  )
  const { left } =
    row.table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()
  const cells = left
    .map((columnId) => allCells.find((cell) => cell.column.id === columnId)!)
    .filter(Boolean)
  // Assign position property directly to preserve prototype chain
  cells.forEach((cell) => {
    cell.position = 'left'
  })
  return cells as any
}

/**
 * Returns right visible cells for a row.
 *
 * This is the static implementation behind the matching row instance API and may read row caches or table state atoms.
 *
 * @example
 * ```ts
 * const value = row_getRightVisibleCells(row)
 * ```
 */
export function row_getRightVisibleCells<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  const allCells = callMemoOrStaticFn(
    row,
    'getAllVisibleCells',
    row_getAllVisibleCells,
  )
  const { right } =
    row.table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()
  const cells = right
    .map((columnId) => allCells.find((cell) => cell.column.id === columnId)!)
    .filter(Boolean)
  // Assign position property directly to preserve prototype chain
  cells.forEach((cell) => {
    cell.position = 'right'
  })
  return cells as any
}

// Table APIs

/**
 * Updates the table's column pinning state slice.
 *
 * The updater follows TanStack Table updater semantics and is routed through the corresponding `on*Change` option or backing atom.
 *
 * @example
 * ```ts
 * table_setColumnPinning(table, (old) => old)
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
 * Resets the table's column pinning state slice.
 *
 * By default the reset uses `table.initialState`; when supported, a blank/default reset bypasses the saved initial value.
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
 * Returns is some columns pinned for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getIsSomeColumnsPinned(table)
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
 * Returns left header groups for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getLeftHeaderGroups(table)
 * ```
 */
export function table_getLeftHeaderGroups<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const allColumns = table.getAllColumns()
  const leafColumns = callMemoOrStaticFn(
    table,
    'getVisibleLeafColumns',
    table_getVisibleLeafColumns,
  ) as Array<Column_Internal<TFeatures, TData, unknown>>
  const { left } =
    table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()

  const orderedLeafColumns = left
    .map((columnId) => leafColumns.find((d) => d.id === columnId)!)
    .filter(Boolean)

  return buildHeaderGroups(allColumns, orderedLeafColumns, table, 'left')
}

/**
 * Returns right header groups for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getRightHeaderGroups(table)
 * ```
 */
export function table_getRightHeaderGroups<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const allColumns = table.getAllColumns()
  const leafColumns = callMemoOrStaticFn(
    table,
    'getVisibleLeafColumns',
    table_getVisibleLeafColumns,
  ) as unknown as Array<Column_Internal<TFeatures, TData, unknown>>
  const { right } =
    table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()

  const orderedLeafColumns = right
    .map((columnId) => leafColumns.find((d) => d.id === columnId)!)
    .filter(Boolean)

  return buildHeaderGroups(allColumns, orderedLeafColumns, table, 'right')
}

/**
 * Returns center header groups for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getCenterHeaderGroups(table)
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
 * Returns left footer groups for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getLeftFooterGroups(table)
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
 * Returns right footer groups for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getRightFooterGroups(table)
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
 * Returns center footer groups for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getCenterFooterGroups(table)
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
 * Returns left flat headers for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getLeftFlatHeaders(table)
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
  return leftHeaderGroups
    .map((headerGroup) => {
      return headerGroup.headers
    })
    .flat()
}

/**
 * Returns right flat headers for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getRightFlatHeaders(table)
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
  return rightHeaderGroups
    .map((headerGroup) => {
      return headerGroup.headers
    })
    .flat()
}

/**
 * Returns center flat headers for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getCenterFlatHeaders(table)
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
  return centerHeaderGroups
    .map((headerGroup) => {
      return headerGroup.headers
    })
    .flat()
}

// leaf headers

/**
 * Returns left leaf headers for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getLeftLeafHeaders(table)
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
 * Returns right leaf headers for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getRightLeafHeaders(table)
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
 * Returns center leaf headers for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getCenterLeafHeaders(table)
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
 * Returns left leaf columns for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getLeftLeafColumns(table)
 * ```
 */
export function table_getLeftLeafColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const { left } =
    table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()
  return left
    .map(
      (columnId) =>
        table.getAllLeafColumns().find((column) => column.id === columnId)!,
    )
    .filter(Boolean)
}

/**
 * Returns right leaf columns for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getRightLeafColumns(table)
 * ```
 */
export function table_getRightLeafColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const { right } =
    table.atoms.columnPinning?.get() ?? getDefaultColumnPinningState()
  return right
    .map(
      (columnId) =>
        table.getAllLeafColumns().find((column) => column.id === columnId)!,
    )
    .filter(Boolean)
}

/**
 * Returns center leaf columns for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getCenterLeafColumns(table)
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
 * Returns pinned leaf columns for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getPinnedLeafColumns(table)
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
 * Returns left visible leaf columns for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getLeftVisibleLeafColumns(table)
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
 * Returns right visible leaf columns for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getRightVisibleLeafColumns(table)
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
 * Returns center visible leaf columns for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getCenterVisibleLeafColumns(table)
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
 * Returns pinned visible leaf columns for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getPinnedVisibleLeafColumns(table)
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
