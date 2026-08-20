import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'

export interface Column_ColumnFaceting<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * Computes min/max numeric facet values for this column.
   */
  getFacetedMinMaxValues: () => undefined | [number, number]
  /**
   * Computes the row model used to derive this column's facet values.
   *
   * Other column filters are applied, while this column's own filter is
   * excluded.
   */
  getFacetedRowModel: () => RowModel<TFeatures, TData>
  /**
   * Computes unique facet values and occurrence counts for this column.
   */
  getFacetedUniqueValues: () => Map<any, number>
}

export interface Table_RowModels_Faceted<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * Computes min/max numeric facet values for the active faceting context.
   *
   * Requires a `facetedMinMaxValues` row-model factory on the `features` option.
   */
  getFacetedMinMaxValues: () => undefined | [number, number]
  /**
   * Computes the row model used to derive facet values.
   *
   * Requires a `facetedRowModel` row-model factory on the `features` option.
   */
  getFacetedRowModel: () => RowModel<TFeatures, TData>
  /**
   * Computes unique facet values and occurrence counts.
   *
   * Requires a `facetedUniqueValues` row-model factory on the `features` option.
   */
  getFacetedUniqueValues: () => Map<any, number>
}

export interface CachedRowModel_Faceted<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  facetedRowModels?: Record<string, () => RowModel<TFeatures, TData>>
  facetedMinMaxValues?: Record<string, () => undefined | [number, number]>
  facetedUniqueValues?: Record<string, () => Map<any, number>>
  globalFacetedRowModel?: () => RowModel<TFeatures, TData>
  globalFacetedMinMaxValues?: () => undefined | [number, number]
  globalFacetedUniqueValues?: () => Map<any, number>
}

export interface Table_ColumnFaceting<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * Returns the min and max values for the global filter.
   */
  getGlobalFacetedMinMaxValues: () => undefined | [number, number]
  /**
   * Computes the row model used to derive global facet values.
   */
  getGlobalFacetedRowModel: () => RowModel<TFeatures, TData>
  /**
   * Returns the faceted unique values for the global filter.
   */
  getGlobalFacetedUniqueValues: () => Map<any, number>
}
