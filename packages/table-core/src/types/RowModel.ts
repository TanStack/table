import type { CachedRowModel_Faceted } from '../features/column-faceting/columnFacetingFeature.types'
import type { CachedRowModel_Grouped } from '../features/column-grouping/columnGroupingFeature.types'
import type { CachedRowModel_Filtered } from '../features/column-filtering/columnFilteringFeature.types'
import type {
  CachedRowModel_Core,
  RowModel,
} from '../core/row-models/coreRowModelsFeature.types'
import type { CachedRowModel_Expanded } from '../features/row-expanding/rowExpandingFeature.types'
import type { CachedRowModel_Paginated } from '../features/row-pagination/rowPaginationFeature.types'
import type { CachedRowModel_Sorted } from '../features/row-sorting/rowSortingFeature.types'
import type { RowData } from './type-utils'
import type { ExtractFeatureMapTypes, TableFeatures } from './TableFeatures'

export interface CachedRowModels_FeatureMap<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  columnFacetingFeature: CachedRowModel_Faceted<TFeatures, TData>
  columnFilteringFeature: CachedRowModel_Filtered<TFeatures, TData>
  rowExpandingFeature: CachedRowModel_Expanded<TFeatures, TData>
  columnGroupingFeature: CachedRowModel_Grouped<TFeatures, TData>
  rowPaginationFeature: CachedRowModel_Paginated<TFeatures, TData>
  rowSortingFeature: CachedRowModel_Sorted<TFeatures, TData>
}

export type CachedRowModels<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = {
  CachedRowModel_Core: () => RowModel<TFeatures, TData>
} & ExtractFeatureMapTypes<
  TFeatures,
  CachedRowModels_FeatureMap<TFeatures, TData>
>

export type CachedRowModel_All<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
> = Partial<
  CachedRowModel_Core<TFeatures, TData> &
    CachedRowModel_Expanded<TFeatures, TData> &
    CachedRowModel_Faceted<TFeatures, TData> &
    CachedRowModel_Filtered<TFeatures, TData> &
    CachedRowModel_Grouped<TFeatures, TData> &
    CachedRowModel_Paginated<TFeatures, TData> &
    CachedRowModel_Sorted<TFeatures, TData>
>
