import { functionalUpdate, isDev, isFunction } from '../../utils'
import type { CellData, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { Column_Internal } from '../../types/Column'
import type {
  ColumnFiltersState,
  FilterFn,
} from './columnFilteringFeature.types'

export function getDefaultColumnFiltersState(): ColumnFiltersState {
  return structuredClone([])
}

export function column_getAutoFilterFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>) {
  const filterFns = column._table._rowModelFns.filterFns as
    | Record<string, FilterFn<TFeatures, TData>>
    | undefined

  const firstRow = column._table.getCoreRowModel().flatRows[0]

  const value = firstRow ? firstRow.getValue(column.id) : undefined

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
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
): FilterFn<TFeatures, TData> | undefined {
  let filterFn = null
  const filterFns = column._table._rowModelFns.filterFns as
    | Record<string, FilterFn<TFeatures, TData>>
    | undefined
  filterFn = isFunction(column.columnDef.filterFn)
    ? column.columnDef.filterFn
    : column.columnDef.filterFn === 'auto'
      ? column_getAutoFilterFn(column)
      : filterFns?.[column.columnDef.filterFn as string]

  if (isDev && !filterFn) {
    console.warn(
      `Could not find a valid 'column.filterFn' for column with the ID: ${column.id}.`,
    )
  }

  return filterFn
}

export function column_getCanFilter<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>) {
  return (
    (column.columnDef.enableColumnFilter ?? true) &&
    (column._table.options.enableColumnFilters ?? true) &&
    (column._table.options.enableFilters ?? true) &&
    !!column.accessorFn
  )
}

export function column_getIsFiltered<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>) {
  return column_getFilterIndex(column) > -1
}

export function column_getFilterValue<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>) {
  return column._table.options.state?.columnFilters?.find(
    (d) => d.id === column.id,
  )?.value
}

export function column_getFilterIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>): number {
  return (
    column._table.options.state?.columnFilters?.findIndex(
      (d) => d.id === column.id,
    ) ?? -1
  )
}

export function column_setFilterValue<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>, value: any) {
  table_setColumnFilters(column._table, (old) => {
    const filterFn = column_getFilterFn(column)
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
        const filterFn = column_getFilterFn(column)

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
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, defaultState?: boolean) {
  table_setColumnFilters(
    table,
    defaultState ? [] : (table.initialState.columnFilters ?? []),
  )
}

export function shouldAutoRemoveFilter<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  filterFn?: FilterFn<TFeatures, TData>,
  value?: any,
  column?: Column_Internal<TFeatures, TData, TValue>,
) {
  return (
    (filterFn && filterFn.autoRemove
      ? filterFn.autoRemove(
          value,
          column as Column_Internal<TFeatures, TData, unknown>,
        )
      : false) ||
    typeof value === 'undefined' ||
    (typeof value === 'string' && !value)
  )
}
