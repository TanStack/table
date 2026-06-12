import type { Column_RowSorting } from '../features/row-sorting/rowSortingFeature.types'
import type { Column_ColumnFaceting } from '../features/column-faceting/columnFacetingFeature.types'
import type { Column_ColumnFiltering } from '../features/column-filtering/columnFilteringFeature.types'
import type { Column_ColumnGrouping } from '../features/column-grouping/columnGroupingFeature.types'
import type { Column_ColumnOrdering } from '../features/column-ordering/columnOrderingFeature.types'
import type { Column_GlobalFiltering } from '../features/global-filtering/globalFilteringFeature.types'
import type { Column_ColumnPinning } from '../features/column-pinning/columnPinningFeature.types'
import type { Column_ColumnResizing } from '../features/column-resizing/columnResizingFeature.types'
import type { Column_ColumnSizing } from '../features/column-sizing/columnSizingFeature.types'
import type { Column_ColumnVisibility } from '../features/column-visibility/columnVisibilityFeature.types'
import type { ColumnDefBase_All } from './ColumnDef'
import type { RowData } from './type-utils'
import type { ExtractFeatureMapTypes, TableFeatures } from './TableFeatures'
import type { Column_Column } from '../core/columns/coreColumnsFeature.types'

export interface Column_Core<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
  TValue = unknown,
> extends Column_Column<TFeatures, TData, TValue> {}

export interface Column_FeatureMap<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  columnFacetingFeature: Column_ColumnFaceting<TFeatures, TData>
  columnFilteringFeature: Column_ColumnFiltering<TFeatures, TData>
  columnGroupingFeature: Column_ColumnGrouping<TFeatures, TData>
  columnOrderingFeature: Column_ColumnOrdering
  columnPinningFeature: Column_ColumnPinning
  columnResizingFeature: Column_ColumnResizing
  columnSizingFeature: Column_ColumnSizing
  columnVisibilityFeature: Column_ColumnVisibility
  globalFilteringFeature: Column_GlobalFiltering
  rowSortingFeature: Column_RowSorting<TFeatures, TData>
}

export type Column<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> = Column_Core<TFeatures, TData, TValue> &
  ExtractFeatureMapTypes<TFeatures, Column_FeatureMap<TFeatures, TData>>

export type Column_Internal<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> = Column<TFeatures, TData, TValue> & {
  columnDef: ColumnDefBase_All<TFeatures, TData, TValue>
}
