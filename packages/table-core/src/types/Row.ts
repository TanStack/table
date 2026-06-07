import type { Row_ColumnVisibility } from '../features/column-visibility/columnVisibilityFeature.types'
import type { Row_ColumnPinning } from '../features/column-pinning/columnPinningFeature.types'
import type { Row_ColumnGrouping } from '../features/column-grouping/columnGroupingFeature.types'
import type { Row_ColumnFiltering } from '../features/column-filtering/columnFilteringFeature.types'
import type { RowData } from './type-utils'
import type { Row_RowExpanding } from '../features/row-expanding/rowExpandingFeature.types'
import type { Row_RowPinning } from '../features/row-pinning/rowPinningFeature.types'
import type { Row_RowSelection } from '../features/row-selection/rowSelectionFeature.types'
import type {
  ExtractFeatureMapTypes,
  ExtractFeatureTypes,
  TableFeatures,
} from './TableFeatures'
import type { Row_Row } from '../core/rows/coreRowsFeature.types'

/**
 * Use this interface as a target for declaration merging to add your own plugin properties.
 * Note: This will affect the types of all tables in your project.
 */
export interface Row_Plugins<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {}

export interface Row_Core<
  TFeatures extends TableFeatures,
  TData extends RowData,
> extends Row_Row<TFeatures, TData> {}

export interface Row_FeatureMap<
  TFeatures extends TableFeatures,
  TData extends RowData,
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
  ExtractFeatureMapTypes<TFeatures, Row_FeatureMap<TFeatures, TData>> &
  ExtractFeatureTypes<'Row', TFeatures> &
  Row_Plugins<TFeatures, TData>
