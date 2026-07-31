// Focused public declaration for the compiled useTable client/server modules.
// Keeping this specific to useTable avoids a wildcard ambient declaration for
// consumer-authored .tsrx modules.
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
