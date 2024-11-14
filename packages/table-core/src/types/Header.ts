import type { CellData, RowData, UnionToIntersection } from './type-utils'
import type { TableFeatures } from './TableFeatures'
import type { Header_Header } from '../core/headers/headersFeature.types'
import type { Header_ColumnResizing } from '../features/column-resizing/columnResizingFeature.types'
import type { Header_ColumnSizing } from '../features/column-sizing/columnSizingFeature.types'

export type Header<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = Header_Header<TFeatures, TData, TValue> &
  UnionToIntersection<
    | ('columnSizingFeature' extends keyof TFeatures
        ? Header_ColumnSizing
        : never)
    | ('columnResizingFeature' extends keyof TFeatures
        ? Header_ColumnResizing
        : never)
  >
