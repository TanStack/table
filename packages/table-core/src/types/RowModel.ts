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
} from '../core/row-models/coreRowModelsFeature.types'
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
import type { RowData } from './type-utils'
import type { ExtractFeatureTypes, TableFeatures } from './TableFeatures'

/**
 * Use this interface as a target for declaration merging to add your own plugin properties.
 * Note: This will affect the types of all tables in your project.
 */
export interface CreateRowModels_Plugins<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {}

export type CreateRowModels<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = CreateRowModel_Core<TFeatures, TData> &
  ExtractFeatureTypes<TFeatures, 'CreateRowModels'> &
  CreateRowModels_Plugins<TFeatures, TData>

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

export interface CachedRowModels_Plugins<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {}

export type CachedRowModels<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = ExtractFeatureTypes<TFeatures, 'CachedRowModel'> &
  CachedRowModels_Plugins<TFeatures, TData>

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
