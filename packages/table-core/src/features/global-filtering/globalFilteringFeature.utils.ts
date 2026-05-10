import { filterFn_includesString } from '../../fns/filterFns'
import { cloneState, isFunction } from '../../utils'
import type { Column_Internal } from '../../types/Column'
import type { FilterFn } from '../column-filtering/columnFilteringFeature.types'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'

/**
 * Returns whether a column can use global filter.
 *
 * This combines column options, table options, and any required accessor or feature state for the capability.
 *
 * @example
 * ```ts
 * const value = column_getCanGlobalFilter(column)
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
 * Returns global auto filter fn for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getGlobalAutoFilterFn(table)
 * ```
 */
export function table_getGlobalAutoFilterFn() {
  return filterFn_includesString
}

/**
 * Returns global filter fn for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getGlobalFilterFn(table)
 * ```
 */
export function table_getGlobalFilterFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
): FilterFn<TFeatures, TData> | FilterFn<TFeatures, TData> | undefined {
  const { globalFilterFn: globalFilterFn } = table.options
  const filterFns: Record<string, FilterFn<TFeatures, TData>> | undefined =
    table._rowModelFns.filterFns

  return isFunction(globalFilterFn)
    ? globalFilterFn
    : globalFilterFn === 'auto'
      ? table_getGlobalAutoFilterFn()
      : filterFns?.[globalFilterFn as string]
}

/**
 * Updates the table's global filter state slice.
 *
 * The updater follows TanStack Table updater semantics and is routed through the corresponding `on*Change` option or backing atom.
 *
 * @example
 * ```ts
 * table_setGlobalFilter(table, (old) => old)
 * ```
 */
export function table_setGlobalFilter<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, updater: any) {
  table.options.onGlobalFilterChange?.(updater)
}

/**
 * Resets the table's global filter state slice.
 *
 * By default the reset uses `table.initialState`; when supported, a blank/default reset bypasses the saved initial value.
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
