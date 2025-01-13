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
import type { ExtractFeatureTypes, TableFeatures } from './TableFeatures'

export interface TableOptions_Plugins<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {}

export interface TableOptions_Core<
  TFeatures extends TableFeatures,
  TData extends RowData,
> extends TableOptions_Table<TFeatures, TData>,
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

export type TableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = TableOptions_Core<TFeatures, TData> &
  UnionToIntersection<
    | ('columnFilteringFeature' extends keyof TFeatures
        ? TableOptions_ColumnFiltering<TFeatures, TData>
        : never)
    | ('columnGroupingFeature' extends keyof TFeatures
        ? TableOptions_ColumnGrouping
        : never)
    | ('columnOrderingFeature' extends keyof TFeatures
        ? TableOptions_ColumnOrdering
        : never)
    | ('columnPinningFeature' extends keyof TFeatures
        ? TableOptions_ColumnPinning
        : never)
    | ('columnResizingFeature' extends keyof TFeatures
        ? TableOptions_ColumnResizing
        : never)
    | ('columnSizingFeature' extends keyof TFeatures
        ? TableOptions_ColumnSizing
        : never)
    | ('columnVisibilityFeature' extends keyof TFeatures
        ? TableOptions_ColumnVisibility
        : never)
    | ('globalFilteringFeature' extends keyof TFeatures
        ? TableOptions_GlobalFiltering<TFeatures, TData>
        : never)
    | ('rowExpandingFeature' extends keyof TFeatures
        ? TableOptions_RowExpanding<TFeatures, TData>
        : never)
    | ('rowPaginationFeature' extends keyof TFeatures
        ? TableOptions_RowPagination
        : never)
    | ('rowPinningFeature' extends keyof TFeatures
        ? TableOptions_RowPinning<TFeatures, TData>
        : never)
    | ('rowSelectionFeature' extends keyof TFeatures
        ? TableOptions_RowSelection<TFeatures, TData>
        : never)
    | ('rowSortingFeature' extends keyof TFeatures
        ? TableOptions_RowSorting
        : never)
  > &
  ExtractFeatureTypes<'TableOptions', TFeatures> &
  TableOptions_Plugins<TFeatures, TData> &
  DebugOptions<TFeatures>

// export type TableOptions<
//   TFeatures extends TableFeatures,
//   TData extends RowData,
// > = TableOptions_Core<TFeatures, TData> &
//   ExtractFeatureTypes<'TableOptions', TFeatures> &
//   TableOptions_Plugins<TFeatures, TData>

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
      TableOptions_RowSorting
  >
