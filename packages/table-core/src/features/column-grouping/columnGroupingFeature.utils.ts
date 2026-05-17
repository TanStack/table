import { cloneState, isFunction } from '../../utils'
import { table_getColumn } from '../../core/columns/coreColumnsFeature.utils'
import type { Column_Internal } from '../../types/Column'
import type { CellData, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { Row } from '../../types/Row'
import type { Cell } from '../../types/Cell'
import type {
  AggregationFn,
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
 * Chooses a built-in aggregation function from the first core row value.
 *
 * Numeric columns default to `sum`, date-like values default to `extent`, and
 * other value types leave aggregation unspecified.
 *
 * @example
 * ```ts
 * const aggregationFn = column_getAutoAggregationFn(column)
 * ```
 */
export function column_getAutoAggregationFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>) {
  const aggregationFns:
    | Record<string, AggregationFn<TFeatures, TData>>
    | undefined = column.table._rowModelFns.aggregationFns

  const firstRow = column.table.getCoreRowModel().flatRows[0]

  const value = firstRow?.getValue(column.id)

  if (typeof value === 'number') {
    return aggregationFns?.sum
  }

  if (Object.prototype.toString.call(value) === '[object Date]') {
    return aggregationFns?.extent
  }
}

/**
 * Resolves the aggregation function configured for a column.
 *
 * Function-valued `columnDef.aggregationFn` is returned directly, `'auto'`
 * delegates to `column_getAutoAggregationFn`, and string values are looked up in
 * the table's aggregation function registry.
 *
 * @example
 * ```ts
 * const aggregationFn = column_getAggregationFn(column)
 * ```
 */
export function column_getAggregationFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>) {
  const aggregationFns:
    | Record<string, AggregationFn<TFeatures, TData>>
    | undefined = column.table._rowModelFns.aggregationFns

  return isFunction(column.columnDef.aggregationFn)
    ? column.columnDef.aggregationFn
    : column.columnDef.aggregationFn === 'auto'
      ? column_getAutoAggregationFn(column)
      : aggregationFns?.[column.columnDef.aggregationFn as string]
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
  table.options.onGroupingChange?.(updater)
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
>(row: Row<TFeatures, TData> & Partial<Row_ColumnGrouping>) {
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
>(row: Row<TFeatures, TData> & Partial<Row_ColumnGrouping>, columnId: string) {
  if (row._groupingValuesCache?.hasOwnProperty(columnId)) {
    return row._groupingValuesCache[columnId]
  }

  const column = table_getColumn(row.table, columnId) as Column_Internal<
    TFeatures,
    TData
  >

  if (!column.columnDef.getGroupingValue) {
    return row.getValue(columnId)
  }

  if (row._groupingValuesCache) {
    row._groupingValuesCache[columnId] = column.columnDef.getGroupingValue(
      row.original,
    )
  }

  return row._groupingValuesCache?.[columnId]
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
  const row = cell.row as Row<TFeatures, TData> & Partial<Row_ColumnGrouping>
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

/**
 * Checks whether this cell should render an aggregated value.
 *
 * Aggregated cells are non-placeholder, non-grouped cells on rows that have
 * subRows.
 *
 * @example
 * ```ts
 * const isAggregated = cell_getIsAggregated(cell)
 * ```
 */
export function cell_getIsAggregated<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(cell: Cell<TFeatures, TData, TValue>) {
  return (
    !cell_getIsGrouped(cell) &&
    !cell_getIsPlaceholder(cell) &&
    !!cell.row.subRows.length
  )
}
