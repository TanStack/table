import type { Table } from '../../types/Table'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'

export interface Column_ColumnFaceting<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * A function that **computes and returns** a min/max tuple derived from `column.getFacetedRowModel`. Useful for displaying faceted result values.
   */
  getFacetedMinMaxValues: () => undefined | [number, number]
  /**
   * A function that **computes and returns** a row model with all other column filters applied, excluding its own filter. Useful for displaying faceted result counts.
   */
  getFacetedRowModel: () => RowModel<TFeatures, TData>
  /**
   * Returns a `Map` of unique values and their occurrences derived from `column.getFacetedRowModel`. Useful for displaying faceted result values.
   */
  getFacetedUniqueValues: () => Map<any, number>
}

export interface Table_RowModels_Faceted<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * A function that **computes and returns** a min/max tuple derived from `column.getFacetedRowModel`. Useful for displaying faceted result values.
   * > Requires that you pass a valid `facetedMinMaxValues` row model factory in `_rowModels`. A default implementation is provided via the exported `createFacetedMinMaxValues` function.
   */
  getFacetedMinMaxValues: () => undefined | [number, number]
  /**
   * Returns the row model with all other column filters applied, excluding its own filter. Useful for displaying faceted result counts.
   * > Requires that you pass a valid `facetedRowModel` row model factory in `_rowModels`. A default implementation is provided via the exported `createFacetedRowModel` function.
   */
  getFacetedRowModel: () => RowModel<TFeatures, TData>
  /**
   * A function that **computes and returns** a `Map` of unique values and their occurrences derived from `column.getFacetedRowModel`. Useful for displaying faceted result values.
   * > Requires that you pass a valid `facetedUniqueValues` row model factory in `_rowModels`. A default implementation is provided via the exported `createFacetedUniqueValues` function.
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
   * Returns the row model for the table after **global** filtering has been applied.
   */
  getGlobalFacetedRowModel: () => RowModel<TFeatures, TData>
  /**
   * Returns the faceted unique values for the global filter.
   */
  getGlobalFacetedUniqueValues: () => Map<any, number>
}
