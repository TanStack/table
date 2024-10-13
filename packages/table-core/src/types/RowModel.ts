import type { RowData } from './type-utils'
import type { TableFeatures } from './TableFeatures'
import type { Row } from './Row'
import type { Table } from './Table'

export interface RowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  rows: Array<Row<TFeatures, TData>>
  flatRows: Array<Row<TFeatures, TData>>
  rowsById: Record<string, Row<TFeatures, TData>>
}

export interface RowModelOptions<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * This required option is a factory for a function that computes and returns the core row model for the table.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/table#getcorerowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  Core?: (table: Table<TFeatures, TData>) => () => RowModel<TFeatures, TData>
  /**
   * This function is responsible for returning the expanded row model. If this function is not provided, the table will not expand rows. You can use the default exported `getExpandedRowModel` function to get the expanded row model or implement your own.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getexpandedrowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
   */
  Expanded?: (
    table: Table<TFeatures, TData>,
  ) => () => RowModel<TFeatures, TData>
  /**
   * If provided, this function is called **once** per table and should return a **new function** which will calculate and return the row model for the table when it's filtered.
   * - For server-side filtering, this function is unnecessary and can be ignored since the server should already return the filtered row model.
   * - For client-side filtering, this function is required. A default implementation is provided via any table adapter's `{ getFilteredRowModel }` export.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#getfilteredrowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
   */
  Filtered?: (
    table: Table<TFeatures, TData>,
  ) => () => RowModel<TFeatures, TData>
  /**
   * Returns the row model after grouping has taken place, but no further.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getgroupedrowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  Grouped?: (table: Table<TFeatures, TData>) => () => RowModel<TFeatures, TData>
  /**
   * Returns the row model after pagination has taken place, but no further.
   *
   * Pagination columns are automatically reordered by default to the start of the columns list. If you would rather remove them or leave them as-is, set the appropriate mode here.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#getPaginatedRowModel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
   */
  Paginated?: (
    table: Table<TFeatures, TData>,
  ) => () => RowModel<TFeatures, TData>
  /**
   * This function is used to retrieve the sorted row model. If using server-side sorting, this function is not required. To use client-side sorting, pass the exported `getSortedRowModel()` from your adapter to your table or implement your own.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#getsortedrowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  Sorted?: (table: Table<TFeatures, TData>) => () => RowModel<TFeatures, TData>
  /**
   * This function is used to retrieve the faceted min/max values. If using server-side faceting, this function is not required. To use client-side faceting, pass the exported `getFacetedMinMaxValues()` from your adapter to your table or implement your own.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-faceting#getfacetedminmaxvalues)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-faceting)
   */
  FacetedMinMax?: (
    table: Table<TFeatures, TData>,
    columnId: string,
  ) => () => [number, number] | undefined
  /**
   * This function is used to retrieve the faceted row model. If using server-side faceting, this function is not required. To use client-side faceting, pass the exported `getFacetedRowModel()` from your adapter to your table or implement your own.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-faceting#getfacetedrowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-faceting)
   */
  Faceted?: (
    table: Table<TFeatures, TData>,
    columnId: string,
  ) => () => RowModel<TFeatures, TData>
  /**
   * This function is used to retrieve the faceted unique values. If using server-side faceting, this function is not required. To use client-side faceting, pass the exported `getFacetedUniqueValues()` from your adapter to your table or implement your own.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-faceting#getfaceteduniquevalues)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-faceting)
   */
  FacetedUnique?: (
    table: Table<TFeatures, TData>,
    columnId: string,
  ) => () => Map<any, number>
}

export interface CachedRowModels<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  Core?: () => RowModel<TFeatures, TData>
  Expanded?: () => RowModel<TFeatures, TData>
  Filtered?: () => RowModel<TFeatures, TData>
  Grouped?: () => RowModel<TFeatures, TData>
  Paginated?: () => RowModel<TFeatures, TData>
  Sorted?: () => RowModel<TFeatures, TData>
  FacetedMinMax?: (columnId: string) => [number, number]
  Faceted?: (columnId: string) => RowModel<TFeatures, TData>
  FacetedUnique?: (columnId: string) => Map<any, number>
}
