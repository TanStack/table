import { functionalUpdate } from '../../utils'
import type { RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { TableOptions } from '../../types/TableOptions'
import type { TableState } from '../../types/TableState'

export function table_reset<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): void {
  table.setState(table.initialState)
}

export function table_mergeOptions<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  newOptions: TableOptions<TFeatures, TData>,
) {
  if (table.options.mergeOptions) {
    return table.options.mergeOptions(table.options, newOptions)
  }

  return {
    ...table.options,
    ...newOptions,
  }
}

export function table_setOptions<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  updater: Updater<TableOptions<TFeatures, TData>>,
): void {
  const newOptions = functionalUpdate(updater, table.options)
  // any used to override type error with looser options available with _rowModels
  // This is needed atm for allowing _rowModels to use TData or not
  table.options = table_mergeOptions(table, newOptions) as any
}

export function table_getInitialState<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): TableState<TFeatures> {
  return structuredClone(table.initialState)
}

export function table_getState<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): TableState<TFeatures> {
  return table.options.state as TableState<TFeatures>
}

export function table_setState<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  updater: Updater<TableState<TFeatures>>,
): void {
  table.options.onStateChange?.(updater)
}
