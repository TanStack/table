import { functionalUpdate, isFunction } from '../../utils'
import { row_getValue } from '../../core/rows/Rows.utils'
import {
  table_getCoreRowModel,
  table_getState,
} from '../../core/table/Tables.utils'
import type { Fns } from '../../types/Fns'
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

export function getDefaultColumnFiltersState(): ColumnFiltersState {
  return structuredClone([])
}

export function column_getAutoFilterFn<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TFns, TData, TValue>,
  table: Table_Internal<TFeatures, TFns, TData>,
) {
  const filterFns = table._fns.filterFns as
    | Record<string, FilterFn<TFeatures, TFns, TData>>
    | undefined

  const firstRow = table_getCoreRowModel(table).flatRows[0]

  const value = firstRow ? row_getValue(firstRow, table, column.id) : undefined

  if (typeof value === 'string') {
    return filterFns?.includesString
  }

  if (typeof value === 'number') {
    return filterFns?.inNumberRange
  }

  if (typeof value === 'boolean') {
    return filterFns?.equals
  }

  if (value !== null && typeof value === 'object') {
    return filterFns?.equals
  }

  if (Array.isArray(value)) {
    return filterFns?.arrIncludes
  }

  return filterFns?.weakEquals
}

export function column_getFilterFn<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TFns, TData, TValue> & {
    columnDef: ColumnDef_ColumnFiltering<TFeatures, TFns, TData>
  },
  table: Table_Internal<TFeatures, TFns, TData>,
): FilterFn<TFeatures, TFns, TData> | undefined {
  const filterFns = table._fns.filterFns as
    | Record<string, FilterFn<TFeatures, TFns, TData>>
    | undefined
  return isFunction(column.columnDef.filterFn)
    ? column.columnDef.filterFn
    : column.columnDef.filterFn === 'auto'
      ? column_getAutoFilterFn(column, table)
      : filterFns?.[column.columnDef.filterFn as string]
}

export function column_getCanFilter<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TFns, TData, TValue> & {
    columnDef: ColumnDef_ColumnFiltering<TFeatures, TFns, TData>
  },
  table: Table_Internal<TFeatures, TFns, TData>,
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
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TFns, TData, TValue> & {
    columnDef: ColumnDef_ColumnFiltering<TFeatures, TFns, TData>
  },
  table: Table_Internal<TFeatures, TFns, TData>,
) {
  return column_getFilterIndex(column, table) > -1
}

export function column_getFilterValue<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TFns, TData, TValue> & {
    columnDef: ColumnDef_ColumnFiltering<TFeatures, TFns, TData>
  },
  table: Table_Internal<TFeatures, TFns, TData>,
) {
  return table_getState(table).columnFilters?.find((d) => d.id === column.id)
    ?.value
}

export function column_getFilterIndex<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TFns, TData, TValue> & {
    columnDef: ColumnDef_ColumnFiltering<TFeatures, TFns, TData>
  },
  table: Table_Internal<TFeatures, TFns, TData>,
): number {
  return (
    table_getState(table).columnFilters?.findIndex((d) => d.id === column.id) ??
    -1
  )
}

export function column_setFilterValue<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TFns, TData, TValue> & {
    columnDef: ColumnDef_ColumnFiltering<TFeatures, TFns, TData>
  },
  table: Table_Internal<TFeatures, TFns, TData>,
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
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TFns, TData>,
  updater: Updater<ColumnFiltersState>,
) {
  const leafColumns = table.getAllLeafColumns()

  const updateFn = (old: ColumnFiltersState) => {
    return functionalUpdate(updater, old).filter((filter) => {
      const column = leafColumns.find((d) => d.id === filter.id)

      if (column) {
        const filterFn = column_getFilterFn(column, table)

        if (shouldAutoRemoveFilter(filterFn, filter.value, column)) {
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
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TFns, TData>, defaultState?: boolean) {
  table_setColumnFilters(
    table,
    defaultState ? [] : (table.initialState.columnFilters ?? []),
  )
}

export function table_getPreFilteredRowModel<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TFns, TData>) {
  return table_getCoreRowModel(table)
}

export function table_getFilteredRowModel<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TFns, TData>,
): RowModel<TFeatures, TFns, TData> {
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
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  filterFn?: FilterFn<TFeatures, TFns, TData>,
  value?: any,
  column?: Column<TFeatures, TFns, TData, TValue>,
) {
  return (
    (filterFn && filterFn.autoRemove
      ? filterFn.autoRemove(
          value,
          column as Column<TFeatures, TFns, TData, unknown>,
        )
      : false) ||
    typeof value === 'undefined' ||
    (typeof value === 'string' && !value)
  )
}
