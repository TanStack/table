import { filterFn_includesString } from '../../fns/filterFns'
import { cloneState, isFunction } from '../../utils'
import type { Column } from '../../types/Column'
import type { FilterFn } from '../column-filtering/columnFilteringFeature.types'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'

type GlobalFilteringFeatures = Partial<{
  globalFilteringFeature: TableFeature
  columnFilteringFeature: TableFeature
}>

/**
 * Checks whether this accessor column participates in global filtering.
 *
 * The column must have an accessor and pass column-level, table-level, and
 * optional `getColumnCanGlobalFilter` checks.
 *
 * @example
 * ```ts
 * const canGlobalFilter = column_getCanGlobalFilter(column)
 * ```
 */
export function column_getCanGlobalFilter<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column<TFeatures, TData, TValue>): boolean {
  const featureColumn = column as unknown as Column<
    GlobalFilteringFeatures,
    TData,
    TValue
  >
  return (
    (featureColumn.columnDef.enableGlobalFilter ?? true) &&
    (featureColumn.table.options.enableGlobalFilter ?? true) &&
    (featureColumn.table.options.enableFilters ?? true) &&
    (featureColumn.table.options.getColumnCanGlobalFilter?.(column as any) ??
      true) &&
    !!column.accessorFn
  )
}

/**
 * Provides the built-in automatic global filter function.
 *
 * Global filtering defaults to `includesString`, which gives search-box style
 * matching across globally filterable columns.
 *
 * @example
 * ```ts
 * const filterFn = table_getGlobalAutoFilterFn()
 * ```
 */
export function table_getGlobalAutoFilterFn() {
  return filterFn_includesString
}

/**
 * Resolves the filter function used for global filtering.
 *
 * Function-valued `options.globalFilterFn` is returned directly, `'auto'`
 * delegates to `table_getGlobalAutoFilterFn`, and string values are looked up in
 * the table's filter function registry.
 *
 * @example
 * ```ts
 * const filterFn = table_getGlobalFilterFn(table)
 * ```
 */
export function table_getGlobalFilterFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>): FilterFn<TFeatures, TData> | undefined {
  const featureTable = table as unknown as Table<GlobalFilteringFeatures, TData>
  const { globalFilterFn: globalFilterFn } = featureTable.options
  const filterFns: Record<string, FilterFn<TFeatures, TData>> | undefined =
    featureTable._rowModelFns.filterFns as
      | Record<string, FilterFn<TFeatures, TData>>
      | undefined

  const filterFn = isFunction(globalFilterFn)
    ? globalFilterFn
    : globalFilterFn === 'auto'
      ? table_getGlobalAutoFilterFn()
      : globalFilterFn
        ? filterFns?.[globalFilterFn]
        : undefined

  return filterFn as FilterFn<TFeatures, TData> | undefined
}

/**
 * Routes a global filter updater through the table's global filter handler.
 *
 * The updater may be a next value or a function of the previous value, matching
 * the instance `table.setGlobalFilter` behavior.
 *
 * @example
 * ```ts
 * table_setGlobalFilter(table, 'search text')
 * ```
 */
export function table_setGlobalFilter<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, updater: any) {
  const featureTable = table as unknown as Table<GlobalFilteringFeatures, TData>
  featureTable.options.onGlobalFilterChange?.(updater)
}

/**
 * Resets `globalFilter` to the configured initial state or feature default.
 *
 * With no argument, the reset clones `table.initialState.globalFilter`. Passing
 * `true` ignores initial state and resets to `undefined`.
 *
 * @example
 * ```ts
 * table_resetGlobalFilter(table)
 * table_resetGlobalFilter(table, true)
 * ```
 */
export function table_resetGlobalFilter<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, defaultState?: boolean) {
  const featureTable = table as unknown as Table<GlobalFilteringFeatures, TData>
  table_setGlobalFilter(
    table,
    defaultState
      ? undefined
      : cloneState(featureTable.initialState.globalFilter),
  )
}
