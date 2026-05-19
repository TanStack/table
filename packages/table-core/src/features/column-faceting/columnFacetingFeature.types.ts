import type { Table } from '../../types/Table'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'

export interface Column_ColumnFaceting<
  TFeatures extends TableFeatures,
  TData extends RowData,
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
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Computes min/max numeric facet values for the active faceting context.
   *
   * Requires a `facetedMinMaxValues` row-model factory in `_rowModels`.
   */
  getFacetedMinMaxValues: () => undefined | [number, number]
  /**
   * Computes the row model used to derive facet values.
   *
   * Requires a `facetedRowModel` row-model factory in `_rowModels`.
   */
  getFacetedRowModel: () => RowModel<TFeatures, TData>
  /**
   * Computes unique facet values and occurrence counts.
   *
   * Requires a `facetedUniqueValues` row-model factory in `_rowModels`.
   */
  getFacetedUniqueValues: () => Map<any, number>
}

export interface CreateRowModel_Faceted<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Factory used to retrieve faceted min/max values. If using server-side
   * faceting, this is not required. To use client-side faceting, pass
   * `createFacetedMinMaxValues()` or implement your own factory.
   */
  facetedMinMaxValues?: (
    table: Table<TFeatures, TData>,
    columnId: string,
  ) => () => [number, number] | undefined
  /**
   * Factory used to retrieve the faceted row model. If using server-side
   * faceting, this is not required. To use client-side faceting, pass
   * `createFacetedRowModel()` or implement your own factory.
   */
  facetedRowModel?: (
    table: Table<TFeatures, TData>,
    columnId: string,
  ) => () => RowModel<TFeatures, TData>
  /**
   * Factory used to retrieve faceted unique values. If using server-side
   * faceting, this is not required. To use client-side faceting, pass
   * `createFacetedUniqueValues()` or implement your own factory.
   */
  facetedUniqueValues?: (
    table: Table<TFeatures, TData>,
    columnId: string,
  ) => () => Map<any, number>
}

export interface CachedRowModel_Faceted<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  facetedRowModel?: (columnId: string) => () => RowModel<TFeatures, TData>
  facetedMinMaxValues?: (columnId: string) => [number, number]
  facetedUniqueValues?: (columnId: string) => Map<any, number>
}

export interface Table_ColumnFaceting<
  TFeatures extends TableFeatures,
  TData extends RowData,
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
