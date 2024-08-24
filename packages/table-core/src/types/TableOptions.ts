import type { TableOptions_Cell } from '../core/cells/Cells.types'
import type { TableOptions_Columns } from '../core/columns/Columns.types'
import type { TableOptions_Headers } from '../core/headers/Headers.types'
import type { TableOptions_Rows } from '../core/rows/Rows.types'
import type { TableOptions_Table } from '../core/table/Tables.types'
import type {
  TableOptions_ColumnFiltering,
  TableOptions_ColumnFiltering_Unavailable,
} from '../features/column-filtering/ColumnFiltering.types'
import type {
  TableOptions_ColumnGrouping,
  TableOptions_ColumnGrouping_Unavailable,
} from '../features/column-grouping/ColumnGrouping.types'
import type {
  TableOptions_ColumnOrdering,
  TableOptions_ColumnOrdering_Unavailable,
} from '../features/column-ordering/ColumnOrdering.types'
import type {
  TableOptions_ColumnPinning,
  TableOptions_ColumnPinning_Unavailable,
} from '../features/column-pinning/ColumnPinning.types'
import type { TableOptions_ColumnResizing } from '../features/column-resizing/ColumnResizing.types'
import type { TableOptions_ColumnSizing } from '../features/column-sizing/ColumnSizing.types'
import type { TableOptions_ColumnVisibility } from '../features/column-visibility/ColumnVisibility.types'
import type { TableOptions_GlobalFiltering } from '../features/global-filtering/GlobalFiltering.types'
import type { TableOptions_RowExpanding } from '../features/row-expanding/RowExpanding.types'
import type { TableOptions_RowPagination } from '../features/row-pagination/RowPagination.types'
import type { TableOptions_RowPinning } from '../features/row-pinning/RowPinning.types'
import type { TableOptions_RowSelection } from '../features/row-selection/RowSelection.types'
import type { TableOptions_RowSorting } from '../features/row-sorting/RowSorting.types'
import type { RowData, UnionToIntersection } from './type-utils'
import type { TableFeatures } from './TableFeatures'

export interface TableOptions_Core<
  TFeatures extends TableFeatures,
  TData extends RowData,
> extends TableOptions_Table<TFeatures, TData>,
    TableOptions_Cell,
    TableOptions_Columns<TFeatures, TData>,
    TableOptions_Rows<TFeatures, TData>,
    TableOptions_Headers {}

export type TableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = TableOptions_Core<TFeatures, TData> &
  UnionToIntersection<
    | ('ColumnFiltering' extends keyof TFeatures
        ? TableOptions_ColumnFiltering<TFeatures, TData>
        : TableOptions_ColumnFiltering_Unavailable<TFeatures, TData>)
    | ('ColumnGrouping' extends keyof TFeatures
        ? TableOptions_ColumnGrouping<TFeatures, TData>
        : TableOptions_ColumnGrouping_Unavailable<TFeatures, TData>)
    | ('ColumnOrdering' extends keyof TFeatures
        ? TableOptions_ColumnOrdering
        : TableOptions_ColumnOrdering_Unavailable)
    | ('ColumnPinning' extends keyof TFeatures
        ? TableOptions_ColumnPinning
        : TableOptions_ColumnPinning_Unavailable)
    | ('ColumnResizing' extends keyof TFeatures
        ? TableOptions_ColumnResizing
        : never)
    | ('ColumnSizing' extends keyof TFeatures
        ? TableOptions_ColumnSizing
        : never)
    | ('ColumnVisibility' extends keyof TFeatures
        ? TableOptions_ColumnVisibility
        : never)
    | ('GlobalFiltering' extends keyof TFeatures
        ? TableOptions_GlobalFiltering<TFeatures, TData>
        : never)
    | ('RowExpanding' extends keyof TFeatures
        ? TableOptions_RowExpanding<TFeatures, TData>
        : never)
    | ('RowPagination' extends keyof TFeatures
        ? TableOptions_RowPagination
        : never)
    | ('RowPinning' extends keyof TFeatures
        ? TableOptions_RowPinning<TFeatures, TData>
        : never)
    | ('RowSelection' extends keyof TFeatures
        ? TableOptions_RowSelection<TFeatures, TData>
        : never)
    | ('RowSorting' extends keyof TFeatures
        ? TableOptions_RowSorting<TFeatures, TData>
        : never)
  >
