import type { CoreFeatures } from '../core/coreFeatures'
import type { TableOptions_Cell } from '../core/cells/coreCellsFeature.types'
import type { TableOptions_Columns } from '../core/columns/coreColumnsFeature.types'
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
import type { RowData, UnionToIntersection } from './type-utils'
import type {
  ExtractFeatureMapTypes,
  ExtractFeatureTypes,
  TableFeatures,
} from './TableFeatures'

export interface TableOptions_Plugins<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {}

/**
 * Core options that are always available on a table, before optional feature
 * options are mixed in.
 */
export interface TableOptions_Core<
  TFeatures extends TableFeatures,
  TData extends RowData,
>
  extends
    TableOptions_Table<TFeatures, TData>,
    TableOptions_Cell,
    TableOptions_Columns<TFeatures, TData>,
    TableOptions_Rows<TFeatures, TData> {}

type DebugKeysFor<TFeatures extends TableFeatures> = {
  [K in keyof TFeatures & string as `debug${Capitalize<K>}`]?: boolean
}

export type DebugOptions<TFeatures extends TableFeatures> = {
  debugAll?: boolean
  debugCache?: boolean
  debugCells?: boolean
  debugColumns?: boolean
  debugHeaders?: boolean
  debugRows?: boolean
  debugTable?: boolean
} & DebugKeysFor<CoreFeatures & TFeatures>

export interface TableOptions_FeatureMap<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  columnFilteringFeature: TableOptions_ColumnFiltering<TFeatures, TData>
  columnGroupingFeature: TableOptions_ColumnGrouping
  columnOrderingFeature: TableOptions_ColumnOrdering
  columnPinningFeature: TableOptions_ColumnPinning
  columnResizingFeature: TableOptions_ColumnResizing
  columnSizingFeature: TableOptions_ColumnSizing
  columnVisibilityFeature: TableOptions_ColumnVisibility
  globalFilteringFeature: TableOptions_GlobalFiltering<TFeatures, TData>
  rowExpandingFeature: TableOptions_RowExpanding<TFeatures, TData>
  rowPaginationFeature: TableOptions_RowPagination
  rowPinningFeature: TableOptions_RowPinning<TFeatures, TData>
  rowSelectionFeature: TableOptions_RowSelection<TFeatures, TData>
  rowSortingFeature: TableOptions_RowSorting
}

export type TableOptions_FeatureMap_All<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = UnionToIntersection<
  TableOptions_FeatureMap<TFeatures, TData>[keyof TableOptions_FeatureMap<
    TFeatures,
    TData
  >]
>

/**
 * Complete table options for a specific feature set.
 *
 * Feature options are included only when their feature is present in
 * `TFeatures`, then custom feature/plugin options and debug options are mixed
 * in.
 */
export type TableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = TableOptions_Core<TFeatures, TData> &
  ExtractFeatureMapTypes<TFeatures, TableOptions_FeatureMap<TFeatures, TData>> &
  ExtractFeatureTypes<'TableOptions', TFeatures> &
  TableOptions_Plugins<TFeatures, TData> &
  DebugOptions<TFeatures>

/**
 * Internal broad option shape used where feature code may need to read options
 * from features that are not present in the current generic feature set.
 */
export type TableOptions_All<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = TableOptions_Core<TFeatures, TData> &
  Partial<TableOptions_FeatureMap_All<TFeatures, TData>>
