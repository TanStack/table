import type { RowModelFns_RowSorting } from '../features/row-sorting/rowSortingFeature.types'
import type { RowModelFns_ColumnGrouping } from '../features/column-grouping/columnGroupingFeature.types'
import type { RowData } from './type-utils'
import type { RowModelFns_ColumnFiltering } from '../features/column-filtering/columnFilteringFeature.types'
import type { ExtractFeatureTypes, TableFeatures } from './TableFeatures'

export interface RowModelFns_Plugins {}

export interface RowModelFns_Core extends RowModelFns_Plugins {}

// export type RowModelFns<
//   TFeatures extends TableFeatures,
//   TData extends RowData,
// > = RowModelFns_Plugins &
//   Partial<
//     UnionToIntersection<
//       | ('columnFilteringFeature' extends keyof TFeatures
//           ? RowModelFns_ColumnFiltering<TFeatures, TData>
//           : never)
//       | ('columnGroupingFeature' extends keyof TFeatures
//           ? RowModelFns_ColumnGrouping<TFeatures, TData>
//           : never)
//       | ('rowSortingFeature' extends keyof TFeatures
//           ? RowModelFns_RowSorting<TFeatures, TData>
//           : never)
//     >
//   >

export type RowModelFns<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = RowModelFns_Core & ExtractFeatureTypes<TFeatures, 'RowModelFns'>

export type RowModelFns_All<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Partial<
  RowModelFns_ColumnFiltering<TFeatures, TData> &
    RowModelFns_ColumnGrouping<TFeatures, TData> &
    RowModelFns_RowSorting<TFeatures, TData>
>
