import type { RowModelFns_RowSorting } from '../features/row-sorting/rowSortingFeature.types'
import type { RowModelFns_ColumnGrouping } from '../features/column-grouping/columnGroupingFeature.types'
import type { RowData } from './type-utils'
import type { RowModelFns_ColumnFiltering } from '../features/column-filtering/columnFilteringFeature.types'
import type { ExtractFeatureMapTypes, TableFeatures } from './TableFeatures'

export interface RowModelFns_Core {}

export interface RowModelFns_FeatureMap<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  columnFilteringFeature: RowModelFns_ColumnFiltering<TFeatures, TData>
  columnGroupingFeature: RowModelFns_ColumnGrouping<TFeatures, TData>
  rowSortingFeature: RowModelFns_RowSorting<TFeatures, TData>
}

export type RowModelFns<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Partial<
  ExtractFeatureMapTypes<TFeatures, RowModelFns_FeatureMap<TFeatures, TData>>
>

export type RowModelFns_All<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Partial<
  RowModelFns_ColumnFiltering<TFeatures, TData> &
    RowModelFns_ColumnGrouping<TFeatures, TData> &
    RowModelFns_RowSorting<TFeatures, TData>
>
