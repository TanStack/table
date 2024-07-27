import type { RowData, UnionToIntersection } from './type-utils'
import type { TableFeatures } from './TableFeatures'
import type { Table_Columns } from '../core/columns/Columns.types'
import type { Table_Headers } from '../core/headers/Headers.types'
import type { Table_Rows } from '../core/rows/Rows.types'
import type { Table_Table } from '../core/table/Tables.types'
import type { Table_ColumnFiltering } from '../features/column-filtering/ColumnFiltering.types'
import type { Table_ColumnGrouping } from '../features/column-grouping/ColumnGrouping.types'
import type { Table_ColumnOrdering } from '../features/column-ordering/ColumnOrdering.types'
import type { Table_ColumnPinning } from '../features/column-pinning/ColumnPinning.types'
import type { Table_ColumnResizing } from '../features/column-resizing/ColumnResizing.types'
import type { Table_ColumnSizing } from '../features/column-sizing/ColumnSizing.types'
import type { Table_ColumnVisibility } from '../features/column-visibility/ColumnVisibility.types'
import type { Table_GlobalFaceting } from '../features/global-faceting/GlobalFaceting.types'
import type { Table_GlobalFiltering } from '../features/global-filtering/GlobalFiltering.types'
import type { Table_RowExpanding } from '../features/row-expanding/RowExpanding.types'
import type { Table_RowPagination } from '../features/row-pagination/RowPagination.types'
import type { Table_RowPinning } from '../features/row-pinning/RowPinning.types'
import type { Table_RowSelection } from '../features/row-selection/RowSelection.types'
import type { Table_RowSorting } from '../features/row-sorting/RowSorting.types'

/**
 * The core table object that only includes the core table functionality such as column, header, row, and table APIS.
 * No features are included.
 */
export interface Table_Core<
  TFeatures extends TableFeatures,
  TData extends RowData,
> extends Table_Table<TFeatures, TData>,
    Table_Columns<TFeatures, TData>,
    Table_Rows<TFeatures, TData>,
    Table_Headers<TFeatures, TData> {}

/**
 * The table object that includes both the core table functionality and the features that are enabled via the `_features` table option.
 */
export type _Table<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Table_Core<TFeatures, TData> &
  UnionToIntersection<
    | ('ColumnFiltering' extends keyof TFeatures
        ? Table_ColumnFiltering<TFeatures, TData>
        : never)
    | ('ColumnGrouping' extends keyof TFeatures
        ? Table_ColumnGrouping<TFeatures, TData>
        : never)
    | ('ColumnOrdering' extends keyof TFeatures
        ? Table_ColumnOrdering<TFeatures, TData>
        : never)
    | ('ColumnPinning' extends keyof TFeatures
        ? Table_ColumnPinning<TFeatures, TData>
        : never)
    | ('ColumnResizing' extends keyof TFeatures ? Table_ColumnResizing : never)
    | ('ColumnSizing' extends keyof TFeatures ? Table_ColumnSizing : never)
    | ('ColumnVisibility' extends keyof TFeatures
        ? Table_ColumnVisibility<TFeatures, TData>
        : never)
    | ('GlobalFaceting' extends keyof TFeatures
        ? Table_GlobalFaceting<TFeatures, TData>
        : never)
    | ('GlobalFiltering' extends keyof TFeatures
        ? Table_GlobalFiltering<TFeatures, TData>
        : never)
    | ('RowExpanding' extends keyof TFeatures
        ? Table_RowExpanding<TFeatures, TData>
        : never)
    | ('RowPagination' extends keyof TFeatures
        ? Table_RowPagination<TFeatures, TData>
        : never)
    | ('RowPinning' extends keyof TFeatures
        ? Table_RowPinning<TFeatures, TData>
        : never)
    | ('RowSelection' extends keyof TFeatures
        ? Table_RowSelection<TFeatures, TData>
        : never)
    | ('RowSorting' extends keyof TFeatures
        ? Table_RowSorting<TFeatures, TData>
        : never)
  >

export type Table_All<TData extends RowData> = _Table<TableFeatures, TData>

// temp - enable all features for types internally
export type Table<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Table_All<TData>
