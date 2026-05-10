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
 * Returns the default grouping state.
 *
 * Feature constructors use this value to initialize the table state or option defaults when no user value is provided.
 *
 * @example
 * ```ts
 * const initialValue = getDefaultGroupingState()
 * ```
 */
export function getDefaultGroupingState(): GroupingState {
  return []
}

/**
 * Toggles grouping for a column.
 *
 * The update is applied through the owning table state slice and respects the feature options for that column.
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
 * Returns whether a column can use group.
 *
 * This combines column options, table options, and any required accessor or feature state for the capability.
 *
 * @example
 * ```ts
 * const value = column_getCanGroup(column)
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
 * Returns is grouped for a column.
 *
 * This derives the value from the column definition, table options, and the feature state atoms registered on the table.
 *
 * @example
 * ```ts
 * const value = column_getIsGrouped(column)
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
 * Returns grouped index for a column.
 *
 * This derives the value from the column definition, table options, and the feature state atoms registered on the table.
 *
 * @example
 * ```ts
 * const value = column_getGroupedIndex(column)
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
 * Returns an event handler for toggling grouping handler.
 *
 * The handler is intended for direct use in column header controls such as buttons or checkboxes.
 *
 * @example
 * ```ts
 * const value = column_getToggleGroupingHandler(column)
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
 * Infers aggregation fn for a column.
 *
 * The inference uses the column definition, table options, and sampled row values when needed.
 *
 * @example
 * ```ts
 * const value = column_getAutoAggregationFn(column)
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
 * Returns aggregation fn for a column.
 *
 * This derives the value from the column definition, table options, and the feature state atoms registered on the table.
 *
 * @example
 * ```ts
 * const value = column_getAggregationFn(column)
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
 * Updates the table's grouping state slice.
 *
 * The updater follows TanStack Table updater semantics and is routed through the corresponding `on*Change` option or backing atom.
 *
 * @example
 * ```ts
 * table_setGrouping(table, (old) => old)
 * ```
 */
export function table_setGrouping<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, updater: Updater<GroupingState>) {
  table.options.onGroupingChange?.(updater)
}

/**
 * Resets the table's grouping state slice.
 *
 * By default the reset uses `table.initialState`; when supported, a blank/default reset bypasses the saved initial value.
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
 * Returns is grouped for a row.
 *
 * This is the static implementation behind the matching row instance API and may read row caches or table state atoms.
 *
 * @example
 * ```ts
 * const value = row_getIsGrouped(row)
 * ```
 */
export function row_getIsGrouped<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData> & Partial<Row_ColumnGrouping>) {
  return !!row.groupingColumnId
}

/**
 * Returns grouping value for a row.
 *
 * This is the static implementation behind the matching row instance API and may read row caches or table state atoms.
 *
 * @example
 * ```ts
 * const value = row_getGroupingValue(row)
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
 * Returns is grouped for a cell.
 *
 * This is the static implementation behind the matching cell instance API and uses the owning row and column context.
 *
 * @example
 * ```ts
 * const value = cell_getIsGrouped(cell)
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
 * Returns is placeholder for a cell.
 *
 * This is the static implementation behind the matching cell instance API and uses the owning row and column context.
 *
 * @example
 * ```ts
 * const value = cell_getIsPlaceholder(cell)
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
 * Returns is aggregated for a cell.
 *
 * This is the static implementation behind the matching cell instance API and uses the owning row and column context.
 *
 * @example
 * ```ts
 * const value = cell_getIsAggregated(cell)
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
