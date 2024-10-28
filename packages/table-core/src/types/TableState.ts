import type { UnionToIntersection } from './type-utils'
import type { TableState_ColumnFiltering } from '../features/column-filtering/ColumnFiltering.types'
import type { TableState_ColumnGrouping } from '../features/column-grouping/ColumnGrouping.types'
import type { TableState_ColumnOrdering } from '../features/column-ordering/ColumnOrdering.types'
import type { TableState_ColumnPinning } from '../features/column-pinning/ColumnPinning.types'
import type { TableState_ColumnResizing } from '../features/column-resizing/ColumnResizing.types'
import type { TableState_ColumnSizing } from '../features/column-sizing/ColumnSizing.types'
import type { TableState_ColumnVisibility } from '../features/column-visibility/ColumnVisibility.types'
import type { TableState_GlobalFiltering } from '../features/global-filtering/GlobalFiltering.types'
import type { TableState_RowExpanding } from '../features/row-expanding/RowExpanding.types'
import type { TableState_RowPagination } from '../features/row-pagination/RowPagination.types'
import type { TableState_RowPinning } from '../features/row-pinning/RowPinning.types'
import type { TableState_RowSelection } from '../features/row-selection/RowSelection.types'
import type { TableState_RowSorting } from '../features/row-sorting/RowSorting.types'
import type { TableFeatures } from './TableFeatures'

export type _TableState<TFeatures extends TableFeatures> = {
  /**
   * @deprecated
   */
  _?: never
} & UnionToIntersection<
  | ('ColumnFiltering' extends keyof TFeatures
      ? TableState_ColumnFiltering
      : never)
  | ('ColumnGrouping' extends keyof TFeatures
      ? TableState_ColumnGrouping
      : never)
  | ('ColumnOrdering' extends keyof TFeatures
      ? TableState_ColumnOrdering
      : never)
  | ('ColumnPinning' extends keyof TFeatures ? TableState_ColumnPinning : never)
  | ('ColumnResizing' extends keyof TFeatures
      ? TableState_ColumnResizing
      : never)
  | ('ColumnSizing' extends keyof TFeatures ? TableState_ColumnSizing : never)
  | ('ColumnVisibility' extends keyof TFeatures
      ? TableState_ColumnVisibility
      : never)
  | ('GlobalFiltering' extends keyof TFeatures
      ? TableState_GlobalFiltering
      : never)
  | ('RowExpanding' extends keyof TFeatures ? TableState_RowExpanding : never)
  | ('RowPagination' extends keyof TFeatures ? TableState_RowPagination : never)
  | ('RowPinning' extends keyof TFeatures ? TableState_RowPinning : never)
  | ('RowSelection' extends keyof TFeatures ? TableState_RowSelection : never)
  | ('RowSorting' extends keyof TFeatures ? TableState_RowSorting : never)
>

export type TableState_All = Partial<
  TableState_ColumnFiltering &
    TableState_ColumnGrouping &
    TableState_ColumnOrdering &
    TableState_ColumnPinning &
    TableState_ColumnResizing &
    TableState_ColumnSizing &
    TableState_ColumnVisibility &
    TableState_GlobalFiltering &
    TableState_RowExpanding &
    TableState_RowPagination &
    TableState_RowPinning &
    TableState_RowSelection &
    TableState_RowSorting
>

export type TableState<TFeatures extends TableFeatures> =
  ('ColumnFiltering' extends keyof TFeatures
    ? TableState_ColumnFiltering
    : never) &
    ('ColumnGrouping' extends keyof TFeatures
      ? TableState_ColumnGrouping
      : never) &
    ('ColumnOrdering' extends keyof TFeatures
      ? TableState_ColumnOrdering
      : never) &
    ('ColumnPinning' extends keyof TFeatures
      ? TableState_ColumnPinning
      : never) &
    ('ColumnResizing' extends keyof TFeatures
      ? TableState_ColumnResizing
      : never) &
    ('ColumnSizing' extends keyof TFeatures ? TableState_ColumnSizing : never) &
    ('ColumnVisibility' extends keyof TFeatures
      ? TableState_ColumnVisibility
      : never) &
    ('GlobalFiltering' extends keyof TFeatures
      ? TableState_GlobalFiltering
      : never) &
    ('RowExpanding' extends keyof TFeatures ? TableState_RowExpanding : never) &
    ('RowPagination' extends keyof TFeatures
      ? TableState_RowPagination
      : never) &
    ('RowPinning' extends keyof TFeatures ? TableState_RowPinning : never) &
    ('RowSelection' extends keyof TFeatures ? TableState_RowSelection : never) &
    ('RowSorting' extends keyof TFeatures ? TableState_RowSorting : never)
