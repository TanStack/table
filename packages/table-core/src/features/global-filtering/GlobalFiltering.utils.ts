import { filterFns } from '../../fns/filterFns'
import { isFunction } from '../../utils'
import type { FilterFn } from '../column-filtering/ColumnFiltering.types'
import type { Column, RowData, Table, TableFeatures } from '../../types'
import type { BuiltInFilterFn } from '../../fns/filterFns'

export function column_getCanGlobalFilter<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(column: Column<TFeatures, TData, unknown>, table: Table<TFeatures, TData>) {
  return (
    (column.columnDef.enableGlobalFilter ?? true) &&
    (table.options.enableGlobalFilter ?? true) &&
    (table.options.enableFilters ?? true) &&
    (table.options.getColumnCanGlobalFilter?.(column) ?? true) &&
    !!column.accessorFn
  )
}

export function table_getGlobalAutoFilterFn() {
  return filterFns.includesString
}

export function table_getGlobalFilterFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData>,
): FilterFn<TFeatures, TData> | FilterFn<TFeatures, TData> | undefined {
  const { globalFilterFn: globalFilterFn } = table.options

  return isFunction(globalFilterFn)
    ? globalFilterFn
    : globalFilterFn === 'auto'
      ? table_getGlobalAutoFilterFn()
      : table.options.filterFns?.[globalFilterFn as string] ??
        filterFns[globalFilterFn as BuiltInFilterFn]
}

export function table_setGlobalFilter<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, updater: any) {
  table.options.onGlobalFilterChange?.(updater)
}

export function table_resetGlobalFilter<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, defaultState?: boolean) {
  table_setGlobalFilter(
    table,
    defaultState ? undefined : table.initialState.globalFilter,
  )
}