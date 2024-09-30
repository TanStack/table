import type { TableFns_RowSorting } from '../features/row-sorting/RowSorting.types'
import type { TableFns_ColumnGrouping } from '../features/column-grouping/ColumnGrouping.types'
import type { RowData, UnionToIntersection } from './type-utils'
import type { TableFns_ColumnFiltering } from '../features/column-filtering/ColumnFiltering.types'
import type { TableFeatures } from './TableFeatures'

export type Fns<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
> = UnionToIntersection<
  | ('ColumnFiltering' extends keyof TFeatures
      ? TableFns_ColumnFiltering<TFeatures, TFns, TData>
      : never)
  | ('ColumnGrouping' extends keyof TFeatures
      ? TableFns_ColumnGrouping<TFeatures, TFns, TData>
      : never)
  | ('RowSorting' extends keyof TFeatures
      ? TableFns_RowSorting<TFeatures, TFns, TData>
      : never)
>

export type Fns_All<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
> = Partial<
  TableFns_ColumnFiltering<TFeatures, any, TData> &
    TableFns_ColumnGrouping<TFeatures, any, TData> &
    TableFns_RowSorting<TFeatures, any, TData>
>
