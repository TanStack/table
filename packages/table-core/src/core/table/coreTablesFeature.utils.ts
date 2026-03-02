import { functionalUpdate } from '../../utils'
import type { RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { TableOptions } from '../../types/TableOptions'

export function table_reset<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): void {
  table.baseStore.setState(() => structuredClone(table.initialState))
}

export function table_mergeOptions<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  newOptions: TableOptions<TFeatures, TData>,
) {
  if (table.latestOptions.mergeOptions) {
    return table.latestOptions.mergeOptions(table.latestOptions, newOptions)
  }

  return {
    ...table.latestOptions,
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
  const newOptions = functionalUpdate(updater, table.latestOptions)
  const mergedOptions = table_mergeOptions(table, newOptions)
  table.latestOptions = mergedOptions
  table.optionsStore.setState(() => mergedOptions)
}
