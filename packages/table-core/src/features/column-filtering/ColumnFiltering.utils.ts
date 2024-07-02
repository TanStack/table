import { BuiltInFilterFn, filterFns } from '../../fns/filterFns'
import { Column, RowData, Table, Updater } from '../../types'
import { functionalUpdate, isFunction } from '../../utils'
import { ColumnFiltersState, FilterFn } from './ColumnFiltering.types'

export function column_getAutoFilterFn<TData extends RowData>(
  column: Column<TData, unknown>,
  table: Table<TData>
) {
  const firstRow = table.getCoreRowModel().flatRows[0]

  const value = firstRow?.getValue(column.id)

  if (typeof value === 'string') {
    return filterFns.includesString
  }

  if (typeof value === 'number') {
    return filterFns.inNumberRange
  }

  if (typeof value === 'boolean') {
    return filterFns.equals
  }

  if (value !== null && typeof value === 'object') {
    return filterFns.equals
  }

  if (Array.isArray(value)) {
    return filterFns.arrIncludes
  }

  return filterFns.weakEquals
}

export function column_getFilterFn<TData extends RowData>(
  column: Column<TData, unknown>,
  table: Table<TData>
) {
  return isFunction(column.columnDef.filterFn)
    ? column.columnDef.filterFn
    : column.columnDef.filterFn === 'auto'
      ? column.getAutoFilterFn()
      : table.options.filterFns?.[column.columnDef.filterFn as string] ??
        filterFns[column.columnDef.filterFn as BuiltInFilterFn]
}

export function column_getCanFilter<TData extends RowData>(
  column: Column<TData, unknown>,
  table: Table<TData>
) {
  return (
    (column.columnDef.enableColumnFilter ?? true) &&
    (table.options.enableColumnFilters ?? true) &&
    (table.options.enableFilters ?? true) &&
    !!column.accessorFn
  )
}

export function column_getIsFiltered<TData extends RowData>(
  column: Column<TData, unknown>
) {
  return column.getFilterIndex() > -1
}

export function column_getFilterValue<TData extends RowData>(
  column: Column<TData, unknown>,
  table: Table<TData>
) {
  return table.getState().columnFilters?.find(d => d.id === column.id)?.value
}

export function column_getFilterIndex<TData extends RowData>(
  column: Column<TData, unknown>,
  table: Table<TData>
) {
  return (
    table.getState().columnFilters?.findIndex(d => d.id === column.id) ?? -1
  )
}

export function column_setFilterValue<TData extends RowData>(
  column: Column<TData, unknown>,
  table: Table<TData>,
  value: any
) {
  table.setColumnFilters(old => {
    const filterFn = column.getFilterFn()
    const previousFilter = old?.find(d => d.id === column.id)

    const newFilter = functionalUpdate(
      value,
      previousFilter ? previousFilter.value : undefined
    )

    if (
      shouldAutoRemoveFilter(filterFn as FilterFn<TData>, newFilter, column)
    ) {
      return old?.filter(d => d.id !== column.id) ?? []
    }

    const newFilterObj = { id: column.id, value: newFilter }

    if (previousFilter) {
      return (
        old?.map(d => {
          if (d.id === column.id) {
            return newFilterObj
          }
          return d
        }) ?? []
      )
    }

    if (old?.length) {
      return [...old, newFilterObj]
    }

    return [newFilterObj]
  })
}

export function table_setColumnFilters<TData extends RowData>(
  table: Table<TData>,
  updater: Updater<ColumnFiltersState>
) {
  const leafColumns = table.getAllLeafColumns()

  const updateFn = (old: ColumnFiltersState) => {
    return functionalUpdate(updater, old)?.filter(filter => {
      const column = leafColumns.find(d => d.id === filter.id)

      if (column) {
        const filterFn = column.getFilterFn()

        if (shouldAutoRemoveFilter(filterFn, filter.value, column)) {
          return false
        }
      }

      return true
    })
  }

  table.options.onColumnFiltersChange?.(updateFn)
}

export function table_resetColumnFilters<TData extends RowData>(
  table: Table<TData>,
  defaultState?: boolean
) {
  table.setColumnFilters(
    defaultState ? [] : table.initialState?.columnFilters ?? []
  )
}

export function table_getPreFilteredRowModel<TData extends RowData>(
  table: Table<TData>
) {
  return table.getCoreRowModel()
}

export function table_getFilteredRowModel<TData extends RowData>(
  table: Table<TData>
) {
  if (!table._getFilteredRowModel && table.options.getFilteredRowModel) {
    table._getFilteredRowModel = table.options.getFilteredRowModel(table)
  }

  if (table.options.manualFiltering || !table._getFilteredRowModel) {
    return table.getPreFilteredRowModel()
  }

  return table._getFilteredRowModel()
}

export function shouldAutoRemoveFilter<TData extends RowData>(
  filterFn?: FilterFn<TData>,
  value?: any,
  column?: Column<TData, unknown>
) {
  return (
    (filterFn && filterFn.autoRemove
      ? filterFn.autoRemove(value, column)
      : false) ||
    typeof value === 'undefined' ||
    (typeof value === 'string' && !value)
  )
}
