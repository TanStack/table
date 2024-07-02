import { BuiltInFilterFn, filterFns } from '../../fns/filterFns'
import { Column, RowData, Table } from '../../types'
import { isFunction, makeStateUpdater } from '../../utils'
import { GlobalFilterOptions } from './GlobalFiltering.types'

export function column_getCanGlobalFilter<TData extends RowData>(
  column: Column<TData, unknown>,
  table: Table<TData>
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
  table: Table<TData>
) {
  const { globalFilterFn: globalFilterFn } = table.options

  return isFunction(globalFilterFn)
    ? globalFilterFn
    : globalFilterFn === 'auto'
      ? table.getGlobalAutoFilterFn()
      : table.options.filterFns?.[globalFilterFn as string] ??
        filterFns[globalFilterFn as BuiltInFilterFn]
}

export function table_setGlobalFilter<TData extends RowData>(
  table: Table<TData>,
  updater: any
) {
  table.options.onGlobalFilterChange?.(updater)
}

export function table_resetGlobalFilter<TData extends RowData>(
  table: Table<TData>,
  defaultState?: boolean
) {
  table.setGlobalFilter(
    defaultState ? undefined : table.initialState.globalFilter
  )
}

export function getGlobalFilteringDefaultOptions<TData extends RowData>(
  table: Table<TData>
) {
  return {
    onGlobalFilterChange: makeStateUpdater('globalFilter', table),
    globalFilterFn: 'auto',
    getColumnCanGlobalFilter: column => {
      const value = table
        .getCoreRowModel()
        .flatRows[0]?._getAllCellsByColumnId()
        [column.id]?.getValue()

      return typeof value === 'string' || typeof value === 'number'
    },
  } as GlobalFilterOptions<TData>
}
