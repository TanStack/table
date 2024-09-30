import type { Fns } from './Fns'
import type { TableOptions_Cell } from '../core/cells/Cells.types'
import type { TableOptions_Columns } from '../core/columns/Columns.types'
import type { TableOptions_Headers } from '../core/headers/Headers.types'
import type { TableOptions_Rows } from '../core/rows/Rows.types'
import type { TableOptions_Table } from '../core/table/Tables.types'
import type { TableOptions_ColumnFiltering } from '../features/column-filtering/ColumnFiltering.types'
import type { TableOptions_ColumnGrouping } from '../features/column-grouping/ColumnGrouping.types'
import type { TableOptions_ColumnOrdering } from '../features/column-ordering/ColumnOrdering.types'
import type { TableOptions_ColumnPinning } from '../features/column-pinning/ColumnPinning.types'
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
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
> extends TableOptions_Table<TFeatures, TFns, TData>,
    TableOptions_Cell,
    TableOptions_Columns<TFeatures, TFns, TData>,
    TableOptions_Rows<TFeatures, TFns, TData>,
    TableOptions_Headers {}

export type TableOptions<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
> = TableOptions_Core<TFeatures, TFns, TData> &
  UnionToIntersection<
    | ('ColumnFiltering' extends keyof TFeatures
        ? TableOptions_ColumnFiltering<TFeatures, TFns, TData>
        : never)
    | ('ColumnGrouping' extends keyof TFeatures
        ? TableOptions_ColumnGrouping
        : never)
    | ('ColumnOrdering' extends keyof TFeatures
        ? TableOptions_ColumnOrdering
        : never)
    | ('ColumnPinning' extends keyof TFeatures
        ? TableOptions_ColumnPinning
        : never)
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
        ? TableOptions_GlobalFiltering<TFeatures, TFns, TData>
        : never)
    | ('RowExpanding' extends keyof TFeatures
        ? TableOptions_RowExpanding<TFeatures, TFns, TData>
        : never)
    | ('RowPagination' extends keyof TFeatures
        ? TableOptions_RowPagination
        : never)
    | ('RowPinning' extends keyof TFeatures
        ? TableOptions_RowPinning<TFeatures, TFns, TData>
        : never)
    | ('RowSelection' extends keyof TFeatures
        ? TableOptions_RowSelection<TFeatures, TFns, TData>
        : never)
    | ('RowSorting' extends keyof TFeatures ? TableOptions_RowSorting : never)
  >

export type TableOptions_All<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
> = TableOptions_Core<TFeatures, TFns, TData> &
  Partial<
    TableOptions_ColumnFiltering<TFeatures, TFns, TData> &
      TableOptions_ColumnGrouping &
      TableOptions_ColumnOrdering &
      TableOptions_ColumnPinning &
      TableOptions_ColumnResizing &
      TableOptions_ColumnSizing &
      TableOptions_ColumnVisibility &
      TableOptions_GlobalFiltering<TFeatures, TFns, TData> &
      TableOptions_RowExpanding<TFeatures, TFns, TData> &
      TableOptions_RowPagination &
      TableOptions_RowPinning<TFeatures, TFns, TData> &
      TableOptions_RowSelection<TFeatures, TFns, TData> &
      TableOptions_RowSorting
  >
