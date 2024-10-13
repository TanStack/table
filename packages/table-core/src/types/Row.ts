import type { RowData, UnionToIntersection } from './type-utils'
import type { TableFeatures } from './TableFeatures'
import type { Row_Row } from '../core/rows/Rows.types'
import type { Row_ColumnFiltering } from '../features/column-filtering/ColumnFiltering.types'
import type { Row_ColumnGrouping } from '../features/column-grouping/ColumnGrouping.types'
import type { Row_ColumnPinning } from '../features/column-pinning/ColumnPinning.types'
import type { Row_ColumnVisibility } from '../features/column-visibility/ColumnVisibility.types'
import type { Row_RowExpanding } from '../features/row-expanding/RowExpanding.types'
import type { Row_RowPinning } from '../features/row-pinning/RowPinning.types'
import type { Row_RowSelection } from '../features/row-selection/RowSelection.types'

export type Row<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Row_Row<TFeatures, TData> &
  UnionToIntersection<
    | ('ColumnFiltering' extends keyof TFeatures
        ? Row_ColumnFiltering<TFeatures, TData>
        : never)
    | ('ColumnGrouping' extends keyof TFeatures ? Row_ColumnGrouping : never)
    | ('ColumnPinning' extends keyof TFeatures
        ? Row_ColumnPinning<TFeatures, TData>
        : never)
    | ('ColumnVisibility' extends keyof TFeatures
        ? Row_ColumnVisibility<TFeatures, TData>
        : never)
    | ('RowExpanding' extends keyof TFeatures ? Row_RowExpanding : never)
    | ('RowPinning' extends keyof TFeatures ? Row_RowPinning : never)
    | ('RowSelection' extends keyof TFeatures ? Row_RowSelection : never)
  >

export type Row_Internal<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Row_Row<TFeatures, TData> & Partial<Row_ColumnFiltering<TFeatures, TData>>
