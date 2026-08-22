import type {
  CellContext as CoreCellContext,
  CellData,
  HeaderContext as CoreHeaderContext,
  RowData,
  TableFeatures,
} from '@tanstack/table-core'
import type { ReactTable } from './useTable'

export type ReactCellContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = Omit<CoreCellContext<TFeatures, TData, TValue>, 'table'> & {
  table: ReactTable<TFeatures, TData>
}

export type ReactHeaderContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = Omit<CoreHeaderContext<TFeatures, TData, TValue>, 'table'> & {
  table: ReactTable<TFeatures, TData>
}
