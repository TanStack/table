import type { Table_RowModels } from '../core/row-models/rowModelsFeature.types'
import type { CachedRowModel_All, CreateRowModels_All } from './RowModel'
import type { ProcessingFns_All } from './ProcessingFns'
import type { TableState_All } from './TableState'
import type { RowData, UnionToIntersection } from './type-utils'
import type { TableFeatures } from './TableFeatures'
import type { Table_Columns } from '../core/columns/columnsFeature.types'
import type { Table_Headers } from '../core/headers/headersFeature.types'
import type { Table_Rows } from '../core/rows/rowsFeature.types'
import type { Table_Table } from '../core/table/tablesFeature.types'
import type { Table_ColumnFiltering } from '../features/column-filtering/columnFilteringFeature.types'
import type { Table_ColumnGrouping } from '../features/column-grouping/columnGroupingFeature.types'
import type { Table_ColumnOrdering } from '../features/column-ordering/columnOrderingFeature.types'
import type { Table_ColumnPinning } from '../features/column-pinning/columnPinningFeature.types'
import type { Table_ColumnResizing } from '../features/column-resizing/columnResizingFeature.types'
import type { Table_ColumnSizing } from '../features/column-sizing/columnSizingFeature.types'
import type { Table_ColumnVisibility } from '../features/column-visibility/columnVisibilityFeature.types'
import type { Table_GlobalFaceting } from '../features/global-faceting/globalFacetingFeature.types'
import type { Table_GlobalFiltering } from '../features/global-filtering/globalFilteringFeature.types'
import type { Table_RowExpanding } from '../features/row-expanding/rowExpandingFeature.types'
import type { Table_RowPagination } from '../features/row-pagination/rowPaginationFeature.types'
import type { Table_RowPinning } from '../features/row-pinning/rowPinningFeature.types'
import type { Table_RowSelection } from '../features/row-selection/rowSelectionFeature.types'
import type { Table_RowSorting } from '../features/row-sorting/rowSortingFeature.types'
import type { TableOptions_All } from './TableOptions'

export interface Table_Plugins {}

/**
 * The core table object that only includes the core table functionality such as column, header, row, and table APIS.
 * No features are included.
 */
export type Table_Core<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Table_Table<TFeatures, TData> &
  Table_Columns<TFeatures, TData> &
  Table_Rows<TFeatures, TData> &
  Table_RowModels<TFeatures, TData> &
  Table_Headers<TFeatures, TData> &
  Table_Plugins

/**
 * The table object that includes both the core table functionality and the features that are enabled via the `_features` table option.
 */
export type Table<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Table_Core<TFeatures, TData> &
  UnionToIntersection<
    | ('columnFilteringFeature' extends keyof TFeatures
        ? Table_ColumnFiltering<TFeatures, TData>
        : never)
    | ('columnGroupingFeature' extends keyof TFeatures
        ? Table_ColumnGrouping<TFeatures, TData>
        : never)
    | ('columnOrderingFeature' extends keyof TFeatures
        ? Table_ColumnOrdering<TFeatures, TData>
        : never)
    | ('columnPinningFeature' extends keyof TFeatures
        ? Table_ColumnPinning<TFeatures, TData>
        : never)
    | ('columnResizingFeature' extends keyof TFeatures
        ? Table_ColumnResizing
        : never)
    | ('columnSizingFeature' extends keyof TFeatures
        ? Table_ColumnSizing
        : never)
    | ('columnVisibilityFeature' extends keyof TFeatures
        ? Table_ColumnVisibility<TFeatures, TData>
        : never)
    | ('globalFacetingFeature' extends keyof TFeatures
        ? Table_GlobalFaceting<TFeatures, TData>
        : never)
    | ('globalFilteringFeature' extends keyof TFeatures
        ? Table_GlobalFiltering<TFeatures, TData>
        : never)
    | ('rowExpandingFeature' extends keyof TFeatures
        ? Table_RowExpanding<TFeatures, TData>
        : never)
    | ('rowPaginationFeature' extends keyof TFeatures
        ? Table_RowPagination<TFeatures, TData>
        : never)
    | ('rowPinningFeature' extends keyof TFeatures
        ? Table_RowPinning<TFeatures, TData>
        : never)
    | ('rowSelectionFeature' extends keyof TFeatures
        ? Table_RowSelection<TFeatures, TData>
        : never)
    | ('rowSortingFeature' extends keyof TFeatures
        ? Table_RowSorting<TFeatures, TData>
        : never)
  >

export type Table_Internal<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Table<TFeatures, TData> & {
  _processingFns: ProcessingFns_All<TFeatures, TData>
  _rowModels: CachedRowModel_All<TFeatures, TData>
  options: TableOptions_All<TFeatures, TData> & {
    _rowModels?: CreateRowModels_All<TFeatures, TData>
    state?: TableState_All
    initialState?: TableState_All
  }
  initialState: TableState_All
}
