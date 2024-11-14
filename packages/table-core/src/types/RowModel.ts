import type {
  CachedRowModel_Faceted,
  CreateRowModel_Faceted,
} from '../features/column-faceting/columnFacetingFeature.types'
import type {
  CachedRowModel_Grouped,
  CreateRowModel_Grouped,
} from '../features/column-grouping/columnGroupingFeature.types'
import type {
  CachedRowModel_Filtered,
  CreateRowModel_Filtered,
} from '../features/column-filtering/columnFilteringFeature.types'
import type {
  CachedRowModel_Core,
  CreateRowModel_Core,
  RowModel,
} from '../core/row-models/rowModelsFeature.types'
import type {
  CachedRowModel_Expanded,
  CreateRowModel_Expanded,
} from '../features/row-expanding/rowExpandingFeature.types'
import type {
  CachedRowModel_Paginated,
  CreateRowModel_Paginated,
} from '../features/row-pagination/rowPaginationFeature.types'
import type {
  CachedRowModel_Sorted,
  CreateRowModel_Sorted,
} from '../features/row-sorting/rowSortingFeature.types'
import type { RowData, UnionToIntersection } from './type-utils'
import type { TableFeatures } from './TableFeatures'

export type CreateRowModels<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = CreateRowModel_Core<TFeatures, TData> &
  UnionToIntersection<
    | ('columnFacetingFeature' extends keyof TFeatures
        ? CreateRowModel_Faceted<TFeatures, TData>
        : never)
    | ('columnFilteringFeature' extends keyof TFeatures
        ? CreateRowModel_Filtered<TFeatures, TData>
        : never)
    | ('rowExpandingFeature' extends keyof TFeatures
        ? CreateRowModel_Expanded<TFeatures, TData>
        : never)
    | ('columnGroupingFeature' extends keyof TFeatures
        ? CreateRowModel_Grouped<TFeatures, TData>
        : never)
    | ('rowPaginationFeature' extends keyof TFeatures
        ? CreateRowModel_Paginated<TFeatures, TData>
        : never)
    | ('rowSortingFeature' extends keyof TFeatures
        ? CreateRowModel_Sorted<TFeatures, TData>
        : never)
  >

export type CreateRowModels_All<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = CreateRowModel_Core<TFeatures, TData> &
  CreateRowModel_Expanded<TFeatures, TData> &
  CreateRowModel_Faceted<TFeatures, TData> &
  CreateRowModel_Filtered<TFeatures, TData> &
  CreateRowModel_Grouped<TFeatures, TData> &
  CreateRowModel_Paginated<TFeatures, TData> &
  CreateRowModel_Sorted<TFeatures, TData>

export type CachedRowModels<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = {
  CachedRowModel_Core: () => RowModel<TFeatures, TData>
} & UnionToIntersection<
  | ('columnFacetingFeature' extends keyof TFeatures
      ? CachedRowModel_Faceted<TFeatures, TData>
      : never)
  | ('columnFilteringFeature' extends keyof TFeatures
      ? CachedRowModel_Filtered<TFeatures, TData>
      : never)
  | ('rowExpandingFeature' extends keyof TFeatures
      ? CachedRowModel_Expanded<TFeatures, TData>
      : never)
  | ('columnGroupingFeature' extends keyof TFeatures
      ? CachedRowModel_Grouped<TFeatures, TData>
      : never)
  | ('rowPaginationFeature' extends keyof TFeatures
      ? CachedRowModel_Paginated<TFeatures, TData>
      : never)
  | ('rowSortingFeature' extends keyof TFeatures
      ? CachedRowModel_Sorted<TFeatures, TData>
      : never)
>

export type CachedRowModel_All<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Partial<
  CachedRowModel_Core<TFeatures, TData> &
    CachedRowModel_Expanded<TFeatures, TData> &
    CachedRowModel_Faceted<TFeatures, TData> &
    CachedRowModel_Filtered<TFeatures, TData> &
    CachedRowModel_Grouped<TFeatures, TData> &
    CachedRowModel_Paginated<TFeatures, TData> &
    CachedRowModel_Sorted<TFeatures, TData>
>
