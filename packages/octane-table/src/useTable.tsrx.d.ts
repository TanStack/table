// Declaration companion for useTable.tsrx.
//
// A SPECIFIC module declaration (resolved by relative path), not an ambient
// `declare module '*.tsrx'` — so it types only this module and doesn't pollute a
// consumer's own .tsrx imports. The runtime resolves the authored .tsrx source.
import type {
  RowData,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'
import type { OctaneTable } from './types'

export declare function useTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = TableState<TFeatures>,
>(
  tableOptions: TableOptions<TFeatures, TData>,
  selector?: (state: TableState<TFeatures>) => TSelected,
): OctaneTable<TFeatures, TData, TSelected>
