import type { Header_ColumnSizing } from '../features/column-sizing/columnSizingFeature.types'
import type { CellData, RowData } from './type-utils'
import type { ExtractFeatureMapTypes, TableFeatures } from './TableFeatures'
import type { Header_Header } from '../core/headers/coreHeadersFeature.types'
import type { Header_ColumnResizing } from '../features/column-resizing/columnResizingFeature.types'

export interface Header_Core<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
  TValue extends CellData = CellData,
> extends Header_Header<TFeatures, TData, TValue> {}

export interface Header_FeatureMap {
  columnSizingFeature: Header_ColumnSizing
  columnResizingFeature: Header_ColumnResizing
}

export type Header<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = Header_Core<TFeatures, TData, TValue> &
  ExtractFeatureMapTypes<TFeatures, Header_FeatureMap>
