import type { TableOptions_Cell } from '../core/cells/coreCellsFeature.types'
import type { TableOptions_Columns } from '../core/columns/coreColumnsFeature.types'
import type { TableOptions_Headers } from '../core/headers/coreHeadersFeature.types'
import type { TableOptions_Rows } from '../core/rows/coreRowsFeature.types'
import type { TableOptions_Table } from '../core/table/coreTablesFeature.types'
import type { TableOptions_ColumnFiltering } from '../features/column-filtering/columnFilteringFeature.types'
import type { TableOptions_ColumnGrouping } from '../features/column-grouping/columnGroupingFeature.types'
import type { TableOptions_ColumnOrdering } from '../features/column-ordering/columnOrderingFeature.types'
import type { TableOptions_ColumnPinning } from '../features/column-pinning/columnPinningFeature.types'
import type { TableOptions_ColumnResizing } from '../features/column-resizing/columnResizingFeature.types'
import type { TableOptions_ColumnSizing } from '../features/column-sizing/columnSizingFeature.types'
import type { TableOptions_ColumnVisibility } from '../features/column-visibility/columnVisibilityFeature.types'
import type { TableOptions_GlobalFiltering } from '../features/global-filtering/globalFilteringFeature.types'
import type { TableOptions_RowExpanding } from '../features/row-expanding/rowExpandingFeature.types'
import type { TableOptions_RowPagination } from '../features/row-pagination/rowPaginationFeature.types'
import type { TableOptions_RowPinning } from '../features/row-pinning/rowPinningFeature.types'
import type { TableOptions_RowSelection } from '../features/row-selection/rowSelectionFeature.types'
import type { TableOptions_RowSorting } from '../features/row-sorting/rowSortingFeature.types'
import type { RowData } from './type-utils'
import type { ExtractFeatureTypes, TableFeatures } from './TableFeatures'

export interface TableOptions_Plugins<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {}

export interface TableOptions_Core<
  TFeatures extends TableFeatures,
  TDataList extends Array<RowData>,
> extends TableOptions_Table<TFeatures, TDataList>,
    TableOptions_Cell,
    TableOptions_Columns<TFeatures, TDataList[number]>,
    TableOptions_Rows<TFeatures, TDataList[number]>,
    TableOptions_Headers {}

export type TableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = TableOptions_Core<TFeatures, Array<TData>> &
  ExtractFeatureTypes<TFeatures, 'TableOptions'> &
  TableOptions_Plugins<TFeatures, TData>

export type TableOptions_All<
  TFeatures extends TableFeatures,
  TDataList extends Array<RowData>,
> = TableOptions_Core<TFeatures, TDataList> &
  Partial<
    TableOptions_ColumnFiltering<TFeatures, TDataList[number]> &
      TableOptions_ColumnGrouping &
      TableOptions_ColumnOrdering &
      TableOptions_ColumnPinning &
      TableOptions_ColumnResizing &
      TableOptions_ColumnSizing &
      TableOptions_ColumnVisibility &
      TableOptions_GlobalFiltering<TFeatures, TDataList[number]> &
      TableOptions_RowExpanding<TFeatures, TDataList[number]> &
      TableOptions_RowPagination &
      TableOptions_RowPinning<TFeatures, TDataList[number]> &
      TableOptions_RowSelection<TFeatures, TDataList[number]> &
      TableOptions_RowSorting
  >
