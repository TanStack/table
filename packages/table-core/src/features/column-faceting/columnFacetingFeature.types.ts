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
   * A function that **computes and returns** a `Map` of unique values and their occurrences derived from `column.getFacetedRowModel`. Useful for displaying faceted result values.
   */
  getFacetedUniqueValues: () => Map<any, number>
}

export interface Table_RowModels_Faceted<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * A function that **computes and returns** a min/max tuple derived from `column.getFacetedRowModel`. Useful for displaying faceted result values.
   * > ⚠️ Requires that you pass a valid `getFacetedMinMaxValues` function to `options.getFacetedMinMaxValues`. A default implementation is provided via the exported `getFacetedMinMaxValues` function.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-faceting#getfacetedminmaxvalues)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-faceting)
   */
  getFacetedMinMaxValues: () => undefined | [number, number]
  /**
   * Returns the row model with all other column filters applied, excluding its own filter. Useful for displaying faceted result counts.
   * > ⚠️ Requires that you pass a valid `getFacetedRowModel` function to `options.facetedRowModel`. A default implementation is provided via the exported `getFacetedRowModel` function.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-faceting#getfacetedrowmodel)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-faceting)
   */
  getFacetedRowModel: () => RowModel<TFeatures, TData>
  /**
   * A function that **computes and returns** a `Map` of unique values and their occurrences derived from `column.getFacetedRowModel`. Useful for displaying faceted result values.
   * > ⚠️ Requires that you pass a valid `getFacetedUniqueValues` function to `options.getFacetedUniqueValues`. A default implementation is provided via the exported `getFacetedUniqueValues` function.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-faceting#getfaceteduniquevalues)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-faceting)
   */
  getFacetedUniqueValues: () => Map<any, number>
}

export interface CreateRowModel_Faceted<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * This function is used to retrieve the faceted min/max values. If using server-side faceting, this function is not required. To use client-side faceting, pass the exported `getFacetedMinMaxValues()` from your adapter to your table or implement your own.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-faceting#getfacetedminmaxvalues)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-faceting)
   */
  facetedMinMaxValues?: (
    table: Table<TFeatures, TData>,
    columnId: string,
  ) => () => [number, number] | undefined
  /**
   * This function is used to retrieve the faceted row model. If using server-side faceting, this function is not required. To use client-side faceting, pass the exported `getFacetedRowModel()` from your adapter to your table or implement your own.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-faceting#getfacetedrowmodel)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-faceting)
   */
  facetedRowModel?: (
    table: Table<TFeatures, TData>,
    columnId: string,
  ) => () => RowModel<TFeatures, TData>
  /**
   * This function is used to retrieve the faceted unique values. If using server-side faceting, this function is not required. To use client-side faceting, pass the exported `getFacetedUniqueValues()` from your adapter to your table or implement your own.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-faceting#getfaceteduniquevalues)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-faceting)
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
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/global-faceting#getglobalfacetedminmaxvalues)
   * [Guide](https://tanstack.com/table/v8/docs/guide/global-faceting)
   */
  getGlobalFacetedMinMaxValues: () => undefined | [number, number]
  /**
   * Returns the row model for the table after **global** filtering has been applied.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/global-faceting#getglobalfacetedrowmodel)
   * [Guide](https://tanstack.com/table/v8/docs/guide/global-faceting)
   */
  getGlobalFacetedRowModel: () => RowModel<TFeatures, TData>
  /**
   * Returns the faceted unique values for the global filter.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/global-faceting#getglobalfaceteduniquevalues)
   * [Guide](https://tanstack.com/table/v8/docs/guide/global-faceting)
   */
  getGlobalFacetedUniqueValues: () => Map<any, number>
}
