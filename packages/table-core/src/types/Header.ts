import type { Fns } from './Fns'
import type { CellData, RowData, UnionToIntersection } from './type-utils'
import type { TableFeatures } from './TableFeatures'
import type { Header_Header } from '../core/headers/Headers.types'
import type { Header_ColumnResizing } from '../features/column-resizing/ColumnResizing.types'
import type { Header_ColumnSizing } from '../features/column-sizing/ColumnSizing.types'

export type Header<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
  TValue extends CellData = CellData,
> = Header_Header<TFeatures, TFns, TData, TValue> &
  UnionToIntersection<
    | ('ColumnSizing' extends keyof TFeatures ? Header_ColumnSizing : never)
    | ('ColumnResizing' extends keyof TFeatures ? Header_ColumnResizing : never)
  >
