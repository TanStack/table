import type { TableFns_RowSorting } from '../features/row-sorting/RowSorting.types'
import type { TableFns_ColumnGrouping } from '../features/column-grouping/ColumnGrouping.types'
import type { RowData, UnionToIntersection } from './type-utils'
import type { TableFns_ColumnFiltering } from '../features/column-filtering/ColumnFiltering.types'
import type { TableFeatures } from './TableFeatures'

export type ProcessingFns<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = {
  /**
   * @deprecated
   */
  _?: never
} & Partial<
  UnionToIntersection<
    | ('ColumnFiltering' extends keyof TFeatures
        ? TableFns_ColumnFiltering<TFeatures, TData>
        : never)
    | ('ColumnGrouping' extends keyof TFeatures
        ? TableFns_ColumnGrouping<TFeatures, TData>
        : never)
    | ('RowSorting' extends keyof TFeatures
        ? TableFns_RowSorting<TFeatures, TData>
        : never)
  >
>

export type ProcessingFns_All<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Partial<
  TableFns_ColumnFiltering<TFeatures, TData> &
    TableFns_ColumnGrouping<TFeatures, TData> &
    TableFns_RowSorting<TFeatures, TData>
>
