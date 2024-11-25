import { columnFacetingFeature } from './column-faceting/columnFacetingFeature'
import { columnFilteringFeature } from './column-filtering/columnFilteringFeature'
import { columnGroupingFeature } from './column-grouping/columnGroupingFeature'
import { columnOrderingFeature } from './column-ordering/columnOrderingFeature'
import { columnPinningFeature } from './column-pinning/columnPinningFeature'
import { columnResizingFeature } from './column-resizing/columnResizingFeature'
import { columnSizingFeature } from './column-sizing/columnSizingFeature'
import { columnVisibilityFeature } from './column-visibility/columnVisibilityFeature'
import { globalFacetingFeature } from './global-faceting/globalFacetingFeature'
import { globalFilteringFeature } from './global-filtering/globalFilteringFeature'
import { rowExpandingFeature } from './row-expanding/rowExpandingFeature'
import { rowPaginationFeature } from './row-pagination/rowPaginationFeature'
import { rowPinningFeature } from './row-pinning/rowPinningFeature'
import { rowSelectionFeature } from './row-selection/rowSelectionFeature'
import { rowSortingFeature } from './row-sorting/rowSortingFeature'
import type { StockTableFeatures } from '../types/TableFeatures'

export const stockFeatures: StockTableFeatures = {
  columnFacetingFeature,
  columnFilteringFeature,
  columnGroupingFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  globalFacetingFeature,
  globalFilteringFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowPinningFeature,
  rowSelectionFeature,
  rowSortingFeature,
}
