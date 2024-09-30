import type { Fns, Fns_All } from './Fns'
import type { TableState_All } from './TableState'
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
import type { TableOptions_All } from './TableOptions'

/**
 * The core table object that only includes the core table functionality such as column, header, row, and table APIS.
 * No features are included.
 */
export interface Table_Core<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
> extends Table_Table<TFeatures, TFns, TData>,
    Table_Columns<TFeatures, TFns, TData>,
    Table_Rows<TFeatures, TFns, TData>,
    Table_Headers<TFeatures, TFns, TData> {}

/**
 * The table object that includes both the core table functionality and the features that are enabled via the `_features` table option.
 */
export type Table<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
> = Table_Core<TFeatures, TFns, TData> &
  UnionToIntersection<
    | ('ColumnFiltering' extends keyof TFeatures
        ? Table_ColumnFiltering<TFeatures, TFns, TData>
        : never)
    | ('ColumnGrouping' extends keyof TFeatures
        ? Table_ColumnGrouping<TFeatures, TFns, TData>
        : never)
    | ('ColumnOrdering' extends keyof TFeatures
        ? Table_ColumnOrdering<TFeatures, TFns, TData>
        : never)
    | ('ColumnPinning' extends keyof TFeatures
        ? Table_ColumnPinning<TFeatures, TFns, TData>
        : never)
    | ('ColumnResizing' extends keyof TFeatures ? Table_ColumnResizing : never)
    | ('ColumnSizing' extends keyof TFeatures ? Table_ColumnSizing : never)
    | ('ColumnVisibility' extends keyof TFeatures
        ? Table_ColumnVisibility<TFeatures, TFns, TData>
        : never)
    | ('GlobalFaceting' extends keyof TFeatures
        ? Table_GlobalFaceting<TFeatures, TFns, TData>
        : never)
    | ('GlobalFiltering' extends keyof TFeatures
        ? Table_GlobalFiltering<TFeatures, TFns, TData>
        : never)
    | ('RowExpanding' extends keyof TFeatures
        ? Table_RowExpanding<TFeatures, TFns, TData>
        : never)
    | ('RowPagination' extends keyof TFeatures
        ? Table_RowPagination<TFeatures, TFns, TData>
        : never)
    | ('RowPinning' extends keyof TFeatures
        ? Table_RowPinning<TFeatures, TFns, TData>
        : never)
    | ('RowSelection' extends keyof TFeatures
        ? Table_RowSelection<TFeatures, TFns, TData>
        : never)
    | ('RowSorting' extends keyof TFeatures
        ? Table_RowSorting<TFeatures, TFns, TData>
        : never)
  >

export type Table_Internal<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
> = Table<TFeatures, TFns, TData> & {
  _fns: Fns_All<TFeatures, TFns, TData>
  getState: () => TableState_All
  options: TableOptions_All<TFeatures, TFns, TData>
}
