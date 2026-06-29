import type { Row_ColumnVisibility } from '../features/column-visibility/columnVisibilityFeature.types'
import type { Row_ColumnPinning } from '../features/column-pinning/columnPinningFeature.types'
import type { Row_ColumnGrouping } from '../features/column-grouping/columnGroupingFeature.types'
import type { Row_ColumnFiltering } from '../features/column-filtering/columnFilteringFeature.types'
import type { RowData } from './type-utils'
import type { Row_RowExpanding } from '../features/row-expanding/rowExpandingFeature.types'
import type { Row_RowPinning } from '../features/row-pinning/rowPinningFeature.types'
import type { Row_RowSelection } from '../features/row-selection/rowSelectionFeature.types'
import type { ExtractFeatureMapTypes, TableFeatures } from './TableFeatures'
import type { Row_Row } from '../core/rows/coreRowsFeature.types'

export interface Row_Core<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> extends Row_Row<TFeatures, TData> {}

export interface Row_FeatureMap<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  columnFilteringFeature: Row_ColumnFiltering<TFeatures, TData>
  columnGroupingFeature: Row_ColumnGrouping
  columnPinningFeature: Row_ColumnPinning<TFeatures, TData>
  columnVisibilityFeature: Row_ColumnVisibility<TFeatures, TData>
  rowExpandingFeature: Row_RowExpanding
  rowPinningFeature: Row_RowPinning
  rowSelectionFeature: Row_RowSelection
}

export type Row<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Row_Core<TFeatures, TData> &
  ExtractFeatureMapTypes<TFeatures, Row_FeatureMap<TFeatures, TData>>
