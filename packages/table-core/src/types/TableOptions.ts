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
  NonFeatureKeys,
  TableFeatures,
} from './TableFeatures'

/**
 * Core options that are always available on a table, before optional feature
 * options are mixed in.
 */
export interface TableOptions_Core<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
>
  extends
    TableOptions_Table<TFeatures, TData>,
    TableOptions_Cell,
    TableOptions_Columns<TFeatures, TData>,
    TableOptions_Rows<TFeatures, TData> {}

type DebugKeysFor<TFeatures extends TableFeatures> = {
  [K in Exclude<
    keyof TFeatures & string,
    NonFeatureKeys // meta, row model, and fn registry slots, not real features
  > as `debug${Capitalize<K>}`]?: boolean
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
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
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

type TableOptions_StockFeatureKeys =
  | 'columnFilteringFeature'
  | 'columnGroupingFeature'
  | 'columnOrderingFeature'
  | 'columnPinningFeature'
  | 'columnResizingFeature'
  | 'columnSizingFeature'
  | 'columnVisibilityFeature'
  | 'globalFilteringFeature'
  | 'rowExpandingFeature'
  | 'rowPaginationFeature'
  | 'rowPinningFeature'
  | 'rowSelectionFeature'
  | 'rowSortingFeature'

/**
 * Plugin entries declaration-merged into `TableOptions_FeatureMap`, i.e. keys
 * beyond the stock set. Resolves to `unknown` (an intersection no-op) when no
 * plugins are merged so the common case skips the union-to-intersection work.
 */
type TableOptions_PluginFeatureMapTypes<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = [
  Exclude<
    keyof TableOptions_FeatureMap<TFeatures, TData>,
    TableOptions_StockFeatureKeys
  >,
] extends [never]
  ? unknown
  : UnionToIntersection<
      TableOptions_FeatureMap<TFeatures, TData>[Exclude<
        keyof TableOptions_FeatureMap<TFeatures, TData>,
        TableOptions_StockFeatureKeys
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
  DebugOptions<TFeatures>

/**
 * Internal broad option shape used where feature code may need to read options
 * from features that are not present in the current generic feature set.
 */
export type TableOptions_All<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = TableOptions_Core<TFeatures, TData> &
  Partial<
    TableOptions_ColumnFiltering<TFeatures, TData> &
      TableOptions_ColumnGrouping &
      TableOptions_ColumnOrdering &
      TableOptions_ColumnPinning &
      TableOptions_ColumnResizing &
      TableOptions_ColumnSizing &
      TableOptions_ColumnVisibility &
      TableOptions_GlobalFiltering<TFeatures, TData> &
      TableOptions_RowExpanding<TFeatures, TData> &
      TableOptions_RowPagination &
      TableOptions_RowPinning<TFeatures, TData> &
      TableOptions_RowSelection<TFeatures, TData> &
      TableOptions_RowSorting &
      TableOptions_PluginFeatureMapTypes<TFeatures, TData>
  >
