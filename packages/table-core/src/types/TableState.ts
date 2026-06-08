import type { TableState_ColumnFiltering } from '../features/column-filtering/columnFilteringFeature.types'
import type { TableState_ColumnGrouping } from '../features/column-grouping/columnGroupingFeature.types'
import type { TableState_ColumnOrdering } from '../features/column-ordering/columnOrderingFeature.types'
import type { TableState_ColumnPinning } from '../features/column-pinning/columnPinningFeature.types'
import type { TableState_ColumnResizing } from '../features/column-resizing/columnResizingFeature.types'
import type { TableState_ColumnSizing } from '../features/column-sizing/columnSizingFeature.types'
import type { TableState_ColumnVisibility } from '../features/column-visibility/columnVisibilityFeature.types'
import type { TableState_GlobalFiltering } from '../features/global-filtering/globalFilteringFeature.types'
import type { TableState_RowExpanding } from '../features/row-expanding/rowExpandingFeature.types'
import type { TableState_RowPagination } from '../features/row-pagination/rowPaginationFeature.types'
import type { TableState_RowPinning } from '../features/row-pinning/rowPinningFeature.types'
import type { TableState_RowSelection } from '../features/row-selection/rowSelectionFeature.types'
import type { TableState_RowSorting } from '../features/row-sorting/rowSortingFeature.types'
import type { ExtractFeatureMapTypes, TableFeatures } from './TableFeatures'

export interface TableState_FeatureMap {
  columnFilteringFeature: TableState_ColumnFiltering
  columnGroupingFeature: TableState_ColumnGrouping
  columnOrderingFeature: TableState_ColumnOrdering
  columnPinningFeature: TableState_ColumnPinning
  columnResizingFeature: TableState_ColumnResizing
  columnSizingFeature: TableState_ColumnSizing
  columnVisibilityFeature: TableState_ColumnVisibility
  globalFilteringFeature: TableState_GlobalFiltering
  rowExpandingFeature: TableState_RowExpanding
  rowPaginationFeature: TableState_RowPagination
  rowPinningFeature: TableState_RowPinning
  rowSelectionFeature: TableState_RowSelection
  rowSortingFeature: TableState_RowSorting
}

/**
 * Complete table state for a specific feature set.
 *
 * State slices are included only when their feature is present in `TFeatures`,
 * then custom feature/plugin state is mixed in.
 */
export type TableState<TFeatures extends TableFeatures> =
  ExtractFeatureMapTypes<TFeatures, TableState_FeatureMap>

/**
 * Internal broad state shape containing every registered feature state slice.
 *
 * Feature internals use this when they may need to inspect optional slices owned
 * by other features.
 */
export type TableState_All = Partial<TableState<TableFeatures>>
