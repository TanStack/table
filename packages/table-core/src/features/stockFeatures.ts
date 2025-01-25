import { columnFacetingFeature } from './column-faceting/columnFacetingFeature'
import { columnFilteringFeature } from './column-filtering/columnFilteringFeature'
import { columnGroupingFeature } from './column-grouping/columnGroupingFeature'
import { columnOrderingFeature } from './column-ordering/columnOrderingFeature'
import { columnPinningFeature } from './column-pinning/columnPinningFeature'
import { columnResizingFeature } from './column-resizing/columnResizingFeature'
import { columnSizingFeature } from './column-sizing/columnSizingFeature'
import { columnVisibilityFeature } from './column-visibility/columnVisibilityFeature'
import { globalFilteringFeature } from './global-filtering/globalFilteringFeature'
import { rowExpandingFeature } from './row-expanding/rowExpandingFeature'
import { rowPaginationFeature } from './row-pagination/rowPaginationFeature'
import { rowPinningFeature } from './row-pinning/rowPinningFeature'
import { rowSelectionFeature } from './row-selection/rowSelectionFeature'
import { rowSortingFeature } from './row-sorting/rowSortingFeature'

export interface StockFeatures {
  columnFacetingFeature: typeof columnFacetingFeature
  columnFilteringFeature: typeof columnFilteringFeature
  columnGroupingFeature: typeof columnGroupingFeature
  columnOrderingFeature: typeof columnOrderingFeature
  columnPinningFeature: typeof columnPinningFeature
  columnResizingFeature: typeof columnResizingFeature
  columnSizingFeature: typeof columnSizingFeature
  columnVisibilityFeature: typeof columnVisibilityFeature
  globalFilteringFeature: typeof globalFilteringFeature
  rowExpandingFeature: typeof rowExpandingFeature
  rowPaginationFeature: typeof rowPaginationFeature
  rowPinningFeature: typeof rowPinningFeature
  rowSelectionFeature: typeof rowSelectionFeature
  rowSortingFeature: typeof rowSortingFeature
}

export const stockFeatures: StockFeatures = {
  columnFacetingFeature,
  columnFilteringFeature,
  columnGroupingFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  globalFilteringFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowPinningFeature,
  rowSelectionFeature,
  rowSortingFeature,
} as const
