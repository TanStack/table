import { filterFns } from '../../fns/filterFns'
import { isFunction } from '../../utils'
import { table_getInitialState } from '../../core/table/Tables.utils'
import type { Fns } from '../../types/Fns'
import type { ColumnDefBase_All } from '../../types/ColumnDef'
import type { FilterFn } from '../column-filtering/ColumnFiltering.types'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
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
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TFns, TData, TValue> & {
    columnDef: ColumnDefBase_All<TFeatures, TFns, TData, TValue>
  },
  table: Table_Internal<TFeatures, TFns, TData>,
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
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TFns, TData>,
):
  | FilterFn<TFeatures, TFns, TData>
  | FilterFn<TFeatures, TFns, TData>
  | undefined {
  const { globalFilterFn: globalFilterFn } = table.options

  return isFunction(globalFilterFn)
    ? globalFilterFn
    : globalFilterFn === 'auto'
      ? table_getGlobalAutoFilterFn()
      : (table._fns.filterFns?.[globalFilterFn as string] ??
        filterFns[globalFilterFn as BuiltInFilterFn])
}

/**
 *
 * @param table
 * @param updater
 */
export function table_setGlobalFilter<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TFns, TData>, updater: any) {
  table.options.onGlobalFilterChange?.(updater)
}

/**
 *
 * @param table
 * @param defaultState
 */
export function table_resetGlobalFilter<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TFns, TData>, defaultState?: boolean) {
  table_setGlobalFilter(
    table,
    defaultState ? undefined : table_getInitialState(table).globalFilter,
  )
}
