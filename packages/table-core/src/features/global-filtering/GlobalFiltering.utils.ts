import { filterFns } from '../../fns/filterFns'
import { isFunction } from '../../utils'
import { _table_getInitialState } from '../../core/table/Tables.utils'
import type {
  ColumnDef_GlobalFiltering,
  TableOptions_GlobalFiltering,
} from './GlobalFiltering.types'
import type {
  ColumnDef_ColumnFiltering,
  FilterFn,
  TableOptions_ColumnFiltering,
} from '../column-filtering/ColumnFiltering.types'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Column } from '../../types/Column'
import type { BuiltInFilterFn } from '../../fns/filterFns'

/**
 *
 * @param column
 * @param table
 * @returns
 */
export function column_getCanGlobalFilter<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TData, TValue> & {
    columnDef: Partial<
      ColumnDef_GlobalFiltering & ColumnDef_ColumnFiltering<TFeatures, TData>
    >
  },
  table: Table<TFeatures, TData> & {
    options: Partial<
      TableOptions_GlobalFiltering<TFeatures, TData> &
        TableOptions_ColumnFiltering<TFeatures, TData>
    >
  },
): boolean {
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

/**
 *
 * @param table
 * @returns
 */
export function table_getGlobalFilterFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<
      TableOptions_GlobalFiltering<TFeatures, TData> &
        TableOptions_ColumnFiltering<TFeatures, TData>
    >
  },
): FilterFn<TFeatures, TData> | FilterFn<TFeatures, TData> | undefined {
  const { globalFilterFn: globalFilterFn } = table.options

  return isFunction(globalFilterFn)
    ? globalFilterFn
    : globalFilterFn === 'auto'
      ? table_getGlobalAutoFilterFn()
      : table.options.filterFns?.[globalFilterFn as string] ??
        filterFns[globalFilterFn as BuiltInFilterFn]
}

/**
 *
 * @param table
 * @param updater
 */
export function table_setGlobalFilter<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_GlobalFiltering<TFeatures, TData>>
  },
  updater: any,
) {
  table.options.onGlobalFilterChange?.(updater)
}

/**
 *
 * @param table
 * @param defaultState
 */
export function table_resetGlobalFilter<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<
      TableOptions_GlobalFiltering<TFeatures, TData> &
        TableOptions_ColumnFiltering<TFeatures, TData>
    >
  },
  defaultState?: boolean,
) {
  table_setGlobalFilter(
    table,
    defaultState ? undefined : _table_getInitialState(table).globalFilter,
  )
}
