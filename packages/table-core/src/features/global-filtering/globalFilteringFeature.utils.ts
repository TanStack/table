import { filterFn_includesString } from '../../fns/filterFns'
import { cloneState, isFunction } from '../../utils'
import type { Column_Internal } from '../../types/Column'
import type { FilterFn } from '../column-filtering/columnFilteringFeature.types'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'

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
>(column: Column_Internal<TFeatures, TData, TValue>): boolean {
  return (
    (column.columnDef.enableGlobalFilter ?? true) &&
    (column.table.options.enableGlobalFilter ?? true) &&
    (column.table.options.enableFilters ?? true) &&
    (column.table.options.getColumnCanGlobalFilter?.(column) ?? true) &&
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
>(
  table: Table_Internal<TFeatures, TData>,
): FilterFn<TFeatures, TData> | undefined {
  const { globalFilterFn: globalFilterFn } = table.options
  const filterFns: Record<string, FilterFn<TFeatures, TData>> | undefined =
    table._rowModelFns.filterFns

  const filterFn = isFunction(globalFilterFn)
    ? globalFilterFn
    : globalFilterFn === 'auto'
      ? table_getGlobalAutoFilterFn()
      : filterFns?.[globalFilterFn as string]

  return filterFn
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
>(table: Table_Internal<TFeatures, TData>, updater: any) {
  table.options.onGlobalFilterChange?.(updater)
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
>(table: Table_Internal<TFeatures, TData>, defaultState?: boolean) {
  table_setGlobalFilter(
    table,
    defaultState ? undefined : cloneState(table.initialState.globalFilter),
  )
}
