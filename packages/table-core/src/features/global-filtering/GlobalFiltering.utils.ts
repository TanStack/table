import { filterFns } from '../../fns/filterFns'
import { isFunction } from '../../utils'
import type { FilterFn } from '../column-filtering/ColumnFiltering.types'
import type { Column, RowData, Table } from '../../types'
import type { BuiltInFilterFn } from '../../fns/filterFns'

export function column_getCanGlobalFilter<TData extends RowData>(
  column: Column<TData, unknown>,
  table: Table<TData>,
) {
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

export function table_getGlobalFilterFn<TData extends RowData>(
  table: Table<TData>,
): FilterFn<any> | FilterFn<TData> | undefined {
  const { globalFilterFn: globalFilterFn } = table.options

  return isFunction(globalFilterFn)
    ? globalFilterFn
    : globalFilterFn === 'auto'
      ? table_getGlobalAutoFilterFn()
      : table.options.filterFns?.[globalFilterFn as string] ??
        filterFns[globalFilterFn as BuiltInFilterFn]
}

export function table_setGlobalFilter<TData extends RowData>(
  table: Table<TData>,
  updater: any,
) {
  table.options.onGlobalFilterChange?.(updater)
}

export function table_resetGlobalFilter<TData extends RowData>(
  table: Table<TData>,
  defaultState?: boolean,
) {
  table_setGlobalFilter(
    table,
    defaultState ? undefined : table.initialState.globalFilter,
  )
}
