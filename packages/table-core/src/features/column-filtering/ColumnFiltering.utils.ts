import { filterFns } from '../../fns/filterFns'
import { functionalUpdate, isFunction } from '../../utils'
import { row_getValue } from '../../core/rows/Rows.utils'
import {
  table_getCoreRowModel,
  table_getState,
} from '../../core/table/Tables.utils'
import type { BuiltInFilterFn } from '../../fns/filterFns'
import type { CellData, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../types/RowModel'
import type { Table_Internal } from '../../types/Table'
import type { Column } from '../../types/Column'
import type {
  ColumnDef_ColumnFiltering,
  ColumnFiltersState,
  FilterFn,
} from './ColumnFiltering.types'

export function column_getAutoFilterFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TData, TValue>,
  table: Table_Internal<TFeatures, TData>,
) {
  const firstRow = table_getCoreRowModel(table).flatRows[0]

  const value = firstRow ? row_getValue(firstRow, table, column.id) : undefined

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

export function column_getFilterFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TData, TValue> & {
    columnDef: ColumnDef_ColumnFiltering<TFeatures, TData>
  },
  table: Table_Internal<TFeatures, TData>,
): FilterFn<TFeatures, TData> | undefined {
  return isFunction(column.columnDef.filterFn)
    ? column.columnDef.filterFn
    : column.columnDef.filterFn === 'auto'
      ? column_getAutoFilterFn(column, table)
      : (table.options.filterFns?.[column.columnDef.filterFn as string] ??
        filterFns[column.columnDef.filterFn as BuiltInFilterFn])
}

export function column_getCanFilter<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TData, TValue> & {
    columnDef: ColumnDef_ColumnFiltering<TFeatures, TData>
  },
  table: Table_Internal<TFeatures, TData>,
) {
  return (
    (column.columnDef.enableColumnFilter ?? true) &&
    (table.options.enableColumnFilters ?? true) &&
    (table.options.enableFilters ?? true) &&
    !!column.accessorFn
  )
}

export function column_getIsFiltered<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TData, TValue> & {
    columnDef: ColumnDef_ColumnFiltering<TFeatures, TData>
  },
  table: Table_Internal<TFeatures, TData>,
) {
  return column_getFilterIndex(column, table) > -1
}

export function column_getFilterValue<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TData, TValue> & {
    columnDef: ColumnDef_ColumnFiltering<TFeatures, TData>
  },
  table: Table_Internal<TFeatures, TData>,
) {
  return table_getState(table).columnFilters?.find((d) => d.id === column.id)
    ?.value
}

export function column_getFilterIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TData, TValue> & {
    columnDef: ColumnDef_ColumnFiltering<TFeatures, TData>
  },
  table: Table_Internal<TFeatures, TData>,
): number {
  return (
    table_getState(table).columnFilters?.findIndex((d) => d.id === column.id) ??
    -1
  )
}

export function column_setFilterValue<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TData, TValue> & {
    columnDef: ColumnDef_ColumnFiltering<TFeatures, TData>
  },
  table: Table_Internal<TFeatures, TData>,
  value: any,
) {
  table_setColumnFilters(table, (old) => {
    const filterFn = column_getFilterFn(column, table)
    const previousFilter = old.find((d) => d.id === column.id)

    const newFilter = functionalUpdate(
      value,
      previousFilter ? previousFilter.value : undefined,
    )

    if (shouldAutoRemoveFilter(filterFn, newFilter, column)) {
      return old.filter((d) => d.id !== column.id)
    }

    const newFilterObj = { id: column.id, value: newFilter }

    if (previousFilter) {
      return old.map((d) => {
        if (d.id === column.id) {
          return newFilterObj
        }
        return d
      })
    }

    if (old.length) {
      return [...old, newFilterObj]
    }

    return [newFilterObj]
  })
}

export function table_setColumnFilters<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  updater: Updater<ColumnFiltersState>,
) {
  const leafColumns = table.getAllLeafColumns()

  const updateFn = (old: ColumnFiltersState) => {
    return functionalUpdate(updater, old).filter((filter) => {
      const column = leafColumns.find((d) => d.id === filter.id)

      if (column) {
        const filterFn = column_getFilterFn(column, table)

        if (shouldAutoRemoveFilter(filterFn, filter.value, column as any)) {
          return false
        }
      }

      return true
    })
  }

  table.options.onColumnFiltersChange?.(updateFn)
}

export function table_resetColumnFilters<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, defaultState?: boolean) {
  table_setColumnFilters(
    table,
    defaultState ? [] : (table.initialState.columnFilters ?? []),
  )
}

export function table_getPreFilteredRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return table_getCoreRowModel(table)
}

export function table_getFilteredRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  if (!table._rowModels.Filtered) {
    table._rowModels.Filtered = table.options._rowModels?.Filtered?.(table)
  }

  if (table.options.manualFiltering || !table._rowModels.Filtered) {
    return table_getPreFilteredRowModel(table)
  }

  return table._rowModels.Filtered()
}

export function shouldAutoRemoveFilter<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  filterFn?: FilterFn<TFeatures, TData>,
  value?: any,
  column?: Column<TFeatures, TData, TValue>,
) {
  return (
    (filterFn && filterFn.autoRemove
      ? filterFn.autoRemove(value, column as any) // TODO: fix this
      : false) ||
    typeof value === 'undefined' ||
    (typeof value === 'string' && !value)
  )
}
