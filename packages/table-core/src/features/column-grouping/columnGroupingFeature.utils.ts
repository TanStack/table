import { cloneState, hasOwn, makeObjectMap, setStateSlice } from '../../utils'
import { row_getValue } from '../../core/rows/coreRowsFeature.utils'
import { table_getColumn } from '../../core/columns/coreColumnsFeature.utils'
import { aggregateColumnValue } from '../row-aggregation/rowAggregationFeature.utils'
import type { Column_Internal } from '../../types/Column'
import type { CellData, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { Row } from '../../types/Row'
import type { Cell } from '../../types/Cell'
import type {
  GroupingState,
  Row_ColumnGrouping,
} from './columnGroupingFeature.types'

/**
 * Creates the default grouping state.
 *
 * The feature default is an empty array, meaning no columns are grouped. Reset
 * APIs use this value when `defaultState` is `true`.
 *
 * @example
 * ```ts
 * const grouping = getDefaultGroupingState()
 * ```
 */
export function getDefaultGroupingState(): GroupingState {
  return []
}

/**
 * Adds or removes this column id from the grouping state.
 *
 * Existing grouped columns keep their order. A column already present in
 * `state.grouping` is removed; otherwise it is appended.
 *
 * @example
 * ```ts
 * column_toggleGrouping(column)
 * ```
 */
export function column_toggleGrouping<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>) {
  table_setGrouping(column.table, (old) => {
    // Find any existing grouping for this column
    if (old.includes(column.id)) {
      return old.filter((d) => d !== column.id)
    }

    return [...old, column.id]
  })
}

/**
 * Checks whether this column can be used for grouping.
 *
 * Grouping must be enabled at the column and table level, and the column must
 * either have an accessor or provide `getGroupingValue`.
 *
 * @example
 * ```ts
 * const canGroup = column_getCanGroup(column)
 * ```
 */
export function column_getCanGroup<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>) {
  return (
    (column.columnDef.enableGrouping ?? true) &&
    (column.table.options.enableGrouping ?? true) &&
    (!!column.accessorFn || !!column.columnDef.getGroupingValue)
  )
}

/**
 * Checks whether this column id is present in `state.grouping`.
 *
 * The result only reflects grouping state, not whether the grouped row model has
 * been calculated yet.
 *
 * @example
 * ```ts
 * const isGrouped = column_getIsGrouped(column)
 * ```
 */
export function column_getIsGrouped<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>): boolean {
  return !!column.table.atoms.grouping?.get()?.includes(column.id)
}

/**
 * Finds this column's position in the ordered grouping state.
 *
 * The result is `-1` when the column is not grouped.
 *
 * @example
 * ```ts
 * const index = column_getGroupedIndex(column)
 * ```
 */
export function column_getGroupedIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>): number {
  return column.table.atoms.grouping?.get()?.indexOf(column.id) ?? -1
}

/**
 * Creates a header/control handler that toggles grouping for this column.
 *
 * The handler is a no-op when `column_getCanGroup(column)` is false.
 *
 * @example
 * ```ts
 * const onClick = column_getToggleGroupingHandler(column)
 * ```
 */
export function column_getToggleGroupingHandler<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>) {
  const canGroup = column_getCanGroup(column)

  return () => {
    if (!canGroup) return
    column_toggleGrouping(column)
  }
}

/**
 * Routes a grouping updater through the table's grouping change handler.
 *
 * The updater may be a next `GroupingState` array or a function of the previous
 * grouping state, matching the instance `table.setGrouping` behavior.
 *
 * @example
 * ```ts
 * table_setGrouping(table, (old) => [...old, 'status'])
 * ```
 */
export function table_setGrouping<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, updater: Updater<GroupingState>) {
  setStateSlice(table, 'grouping', updater)
}

/**
 * Resets `grouping` to the configured initial state or feature default.
 *
 * With no argument, the reset clones `table.initialState.grouping` when it
 * exists. Passing `true` ignores initial state and resets to `[]`.
 *
 * @example
 * ```ts
 * table_resetGrouping(table)
 * table_resetGrouping(table, true)
 * ```
 */
export function table_resetGrouping<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, defaultState?: boolean) {
  table_setGrouping(
    table,
    defaultState ? [] : cloneState(table.initialState.grouping ?? []),
  )
}

/**
 * Checks whether this row was created as a grouped row.
 *
 * Grouped rows carry a `groupingColumnId`; ordinary leaf rows do not.
 *
 * @example
 * ```ts
 * const isGrouped = row_getIsGrouped(row)
 * ```
 */
export function row_getIsGrouped<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData> & Partial<Row_ColumnGrouping<TFeatures, TData>>) {
  return !!row.groupingColumnId
}

/**
 * Reads and caches this row's grouping value for a column.
 *
 * `columnDef.getGroupingValue` wins when provided; otherwise the normal row
 * accessor value is used.
 *
 * @example
 * ```ts
 * const groupValue = row_getGroupingValue(row, 'status')
 * ```
 */
export function row_getGroupingValue<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData> & Partial<Row_ColumnGrouping<TFeatures, TData>>,
  columnId: string,
) {
  if (row._groupingValuesCache && hasOwn(row._groupingValuesCache, columnId)) {
    return row._groupingValuesCache[columnId]
  }

  const column = row.table.getColumn(columnId) as Column_Internal<
    TFeatures,
    TData
  >

  if (!column.columnDef.getGroupingValue) {
    return row.getValue(columnId)
  }

  // Allocated on first use; the slot is declared at construction so this is
  // a value write.
  const groupingValuesCache = (row._groupingValuesCache ??= makeObjectMap())
  groupingValuesCache[columnId] = column.columnDef.getGroupingValue(
    row.original,
    row.index,
    row,
  )

  return groupingValuesCache[columnId]
}

/**
 * Grouping-aware implementation behind `row.getValue` when the grouping
 * feature is registered.
 *
 * Leaf rows fall through to the core accessor read. Grouped rows resolve
 * grouping-column values from their partition and other columns from the
 * aggregation cache, replacing the per-row `getValue` closure the grouped row
 * model used to install (an own property that forked row hidden classes).
 */
export function row_getGroupingAwareValue<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData> & Partial<Row_ColumnGrouping<TFeatures, TData>>,
  columnId: string,
) {
  if (row.groupingColumnId === undefined) {
    return row_getValue(row, columnId)
  }
  return row_getGroupedValue(row, columnId)
}

/**
 * Resolves `row.getValue` for a grouped row.
 *
 * The active grouping column and ancestor grouping columns expose their
 * inherited grouping values (cached in `_valuesCache`). Other columns resolve
 * through the aggregation cache, computing and caching the aggregation on
 * first read when the aggregation feature is registered.
 *
 * Leaf rows must use `row_getValue` (or `row_getGroupingAwareValue`, which
 * branches on `groupingColumnId`) instead.
 */
export function row_getGroupedValue<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData> & Partial<Row_ColumnGrouping<TFeatures, TData>>,
  columnId: string,
) {
  const table = row.table

  // Mirror the grouped row model's `existingGrouping` filter (grouping ids
  // whose columns exist) without allocating the filtered array: resolve this
  // column's index among the existing grouped columns.
  const grouping = table.atoms.grouping?.get() ?? []
  let groupingIndex = -1
  let existingIndex = 0
  for (let i = 0; i < grouping.length; i++) {
    const groupedColumnId = grouping[i]!
    if (!table_getColumn(table, groupedColumnId)) continue
    if (groupedColumnId === columnId) {
      groupingIndex = existingIndex
      break
    }
    existingIndex++
  }

  // Columns grouped at deeper levels than this row are still eligible for
  // aggregation below.
  if (groupingIndex !== -1 && groupingIndex <= row.depth) {
    if (hasOwn(row._valuesCache, columnId)) {
      return row._valuesCache[columnId]
    }

    const groupedRows = row._groupedRows
    if (groupedRows?.[0]) {
      row._valuesCache[columnId] =
        groupedRows[0].getValue(columnId) ?? undefined
    }

    return row._valuesCache[columnId]
  }

  const aggregationCache = row._aggregationValuesCache
  if (aggregationCache && hasOwn(aggregationCache, columnId)) {
    return aggregationCache[columnId]
  }

  const column = table.getColumn(columnId)
  if (typeof (column as any)?.getAggregationFns !== 'function') {
    return undefined
  }

  const cache = (row._aggregationValuesCache ??= makeObjectMap())
  cache[columnId] = aggregateColumnValue({
    subRows: row.subRows,
    column: column!,
    groupingRow: row,
    rows: row._groupedRows ?? row.leafRows ?? [],
    uniqueRows: true,
  })
  return cache[columnId]
}

/**
 * Checks whether this cell represents the grouped column for a grouped row.
 *
 * This is the cell that usually renders the grouped value and expansion control.
 *
 * @example
 * ```ts
 * const isGroupedCell = cell_getIsGrouped(cell)
 * ```
 */
export function cell_getIsGrouped<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(cell: Cell<TFeatures, TData, TValue>) {
  const row = cell.row as Row<TFeatures, TData> &
    Partial<Row_ColumnGrouping<TFeatures, TData>>
  return (
    column_getIsGrouped(cell.column) && cell.column.id === row.groupingColumnId
  )
}

/**
 * Checks whether this cell is a placeholder hidden by grouping.
 *
 * Placeholder cells belong to grouped columns other than the row's active
 * grouping column.
 *
 * @example
 * ```ts
 * const isPlaceholder = cell_getIsPlaceholder(cell)
 * ```
 */
export function cell_getIsPlaceholder<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(cell: Cell<TFeatures, TData, TValue>) {
  return !cell_getIsGrouped(cell) && column_getIsGrouped(cell.column)
}
