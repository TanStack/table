import type { RowModelFns_RowSorting } from '../features/row-sorting/rowSortingFeature.types'
import type { RowModelFns_ColumnGrouping } from '../features/column-grouping/columnGroupingFeature.types'
import type { RowData, UnionToIntersection } from './type-utils'
import type { RowModelFns_ColumnFiltering } from '../features/column-filtering/columnFilteringFeature.types'
import type { ExtractFeatureTypes, TableFeatures } from './TableFeatures'

/**
 * Use this interface as a target for declaration merging to add your own plugin properties.
 * Note: This will affect the types of all tables in your project.
 */
export interface RowModelFns_Plugins<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {}

export interface RowModelFns_Core {}

export type RowModelFns<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Partial<
  UnionToIntersection<
    | ('columnFilteringFeature' extends keyof TFeatures
        ? RowModelFns_ColumnFiltering<TFeatures, TData>
        : never)
    | ('columnGroupingFeature' extends keyof TFeatures
        ? RowModelFns_ColumnGrouping<TFeatures, TData>
        : never)
    | ('rowSortingFeature' extends keyof TFeatures
        ? RowModelFns_RowSorting<TFeatures, TData>
        : never)
  > &
    ExtractFeatureTypes<'RowModelFns', TFeatures> &
    RowModelFns_Plugins<TFeatures, TData>
>

// export type RowModelFns<
//   TFeatures extends TableFeatures,
//   TData extends RowData,
// > = RowModelFns_Core &
//   ExtractFeatureTypes<'RowModelFns', TFeatures> &
//   RowModelFns_Plugins<TFeatures, TData>

export type RowModelFns_All<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Partial<
  RowModelFns_ColumnFiltering<TFeatures, TData> &
    RowModelFns_ColumnGrouping<TFeatures, TData> &
    RowModelFns_RowSorting<TFeatures, TData>
>
