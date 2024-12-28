import type { CellData, RowData } from './type-utils'
import type { ExtractFeatureTypes, TableFeatures } from './TableFeatures'
import type { Header_Header } from '../core/headers/coreHeadersFeature.types'

export interface Header_Plugins {}

export interface Header_Core<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> extends Header_Header<TFeatures, TData, TValue>,
    Header_Plugins {}

// export type Header<
//   TFeatures extends TableFeatures,
//   TData extends RowData,
//   TValue extends CellData = CellData,
// > = Header_Core<TFeatures, TData, TValue> &
//   UnionToIntersection<
//     | ('columnSizingFeature' extends keyof TFeatures
//         ? Header_ColumnSizing
//         : never)
//     | ('columnResizingFeature' extends keyof TFeatures
//         ? Header_ColumnResizing
//         : never)
//   >

export type Header<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = Header_Core<TFeatures, TData, TValue> &
  ExtractFeatureTypes<TFeatures, 'Header'>
