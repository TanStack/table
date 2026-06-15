import type { ReadonlyStore } from '@tanstack/store'
import type { Table_ColumnFaceting } from '../features/column-faceting/columnFacetingFeature.types'
import type { Table_ColumnResizing } from '../features/column-resizing/columnResizingFeature.types'
import type { Table_ColumnFiltering } from '../features/column-filtering/columnFilteringFeature.types'
import type { Table_ColumnGrouping } from '../features/column-grouping/columnGroupingFeature.types'
import type { Table_ColumnPinning } from '../features/column-pinning/columnPinningFeature.types'
import type { Table_ColumnOrdering } from '../features/column-ordering/columnOrderingFeature.types'
import type { Table_ColumnVisibility } from '../features/column-visibility/columnVisibilityFeature.types'
import type { Table_ColumnSizing } from '../features/column-sizing/columnSizingFeature.types'
import type { Table_RowPinning } from '../features/row-pinning/rowPinningFeature.types'
import type { Table_GlobalFiltering } from '../features/global-filtering/globalFilteringFeature.types'
import type { Table_RowExpanding } from '../features/row-expanding/rowExpandingFeature.types'
import type { Table_RowPagination } from '../features/row-pagination/rowPaginationFeature.types'
import type { Table_RowSelection } from '../features/row-selection/rowSelectionFeature.types'
import type { Table_RowSorting } from '../features/row-sorting/rowSortingFeature.types'
import type { Table_RowModels } from '../core/row-models/coreRowModelsFeature.types'
import type { RowData } from './type-utils'
import type { ExtractFeatureMapTypes, TableFeatures } from './TableFeatures'
import type { Table_Columns } from '../core/columns/coreColumnsFeature.types'
import type { Table_Headers } from '../core/headers/coreHeadersFeature.types'
import type { Table_Rows } from '../core/rows/coreRowsFeature.types'
import type { Table_Table } from '../core/table/coreTablesFeature.types'

/**
 * The core table object that only includes the core table functionality such as column, header, row, and table APIS.
 * No features are included.
 */
export interface Table_Core<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
>
  extends
    Table_Table<TFeatures, TData>,
    Table_Columns<TFeatures, TData>,
    Table_Rows<TFeatures, TData>,
    Table_RowModels<TFeatures, TData>,
    Table_Headers<TFeatures, TData> {}

export interface Table_FeatureMap<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  columnFilteringFeature: Table_ColumnFiltering
  columnGroupingFeature: Table_ColumnGrouping<TFeatures, TData>
  columnOrderingFeature: Table_ColumnOrdering<TFeatures, TData>
  columnPinningFeature: Table_ColumnPinning<TFeatures, TData>
  columnResizingFeature: Table_ColumnResizing
  columnSizingFeature: Table_ColumnSizing
  columnVisibilityFeature: Table_ColumnVisibility<TFeatures, TData>
  columnFacetingFeature: Table_ColumnFaceting<TFeatures, TData>
  globalFilteringFeature: Table_GlobalFiltering<TFeatures, TData>
  rowExpandingFeature: Table_RowExpanding<TFeatures, TData>
  rowPaginationFeature: Table_RowPagination<TFeatures, TData>
  rowPinningFeature: Table_RowPinning<TFeatures, TData>
  rowSelectionFeature: Table_RowSelection<TFeatures, TData>
  rowSortingFeature: Table_RowSorting<TFeatures, TData>
}

/**
 * The table object that includes both the core table functionality and the features that are enabled via the `features` table option.
 */
export type Table<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Table_Core<TFeatures, TData> &
  ExtractFeatureMapTypes<TFeatures, Table_FeatureMap<TFeatures, TData>>
