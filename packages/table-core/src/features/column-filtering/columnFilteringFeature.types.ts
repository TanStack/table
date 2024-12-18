import type { Table } from '../../types/Table'
import type { BuiltInFilterFn } from '../../fns/filterFns'
import type {
  CellData,
  OnChangeFn,
  RowData,
  Updater,
} from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { Row } from '../../types/Row'
import type { Column } from '../../types/Column'

export interface FilterMeta {}

export interface FilterFns {}

export interface TableState_ColumnFiltering {
  columnFilters: ColumnFiltersState
}

export type ColumnFiltersState = Array<ColumnFilter>

export interface ColumnFilter {
  id: string
  value: unknown
}

export interface ResolvedColumnFilter<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  filterFn: FilterFn<TFeatures, TData>
  id: string
  resolvedValue: unknown
}

export interface RowModelFns_ColumnFiltering<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  filterFns: Record<keyof FilterFns, FilterFn<TFeatures, TData>>
}

export interface FilterFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  (
    row: Row<TFeatures, TData>,
    columnId: string,
    filterValue: any,
    addMeta?: (meta: FilterMeta) => void,
  ): boolean
  autoRemove?: ColumnFilterAutoRemoveTestFn<TFeatures, TData>
  resolveFilterValue?: TransformFilterValueFn<TFeatures, TData>
}

export type TransformFilterValueFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = (value: any, column?: Column<TFeatures, TData, TValue>) => TValue

export type ColumnFilterAutoRemoveTestFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = (value: any, column?: Column<TFeatures, TData, TValue>) => boolean

export type CustomFilterFns<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Record<string, FilterFn<TFeatures, TData>>

export type FilterFnOption<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = 'auto' | BuiltInFilterFn | keyof FilterFns | FilterFn<TFeatures, TData>

export interface ColumnDef_ColumnFiltering<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Enables/disables the **column** filter for this column.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#enablecolumnfilter)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
   */
  enableColumnFilter?: boolean
  /**
   * The filter function to use with this column. Can be the name of a built-in filter function or a custom filter function.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#filterfn)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
   */
  filterFn?: FilterFnOption<TFeatures, TData>
}

export interface Column_ColumnFiltering<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Returns an automatically calculated filter function for the column based off of the columns first known value.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#getautofilterfn)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
   */
  getAutoFilterFn: () => FilterFn<TFeatures, TData>
  /**
   * Returns whether or not the column can be **column** filtered.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#getcanfilter)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
   */
  getCanFilter: () => boolean
  /**
   * Returns the filter function (either user-defined or automatic, depending on configuration) for the columnId specified.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#getfilterfn)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
   */
  getFilterFn: () => FilterFn<TFeatures, TData>
  /**
   * Returns the index (including `-1`) of the column filter in the table's `state.columnFilters` array.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#getfilterindex)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
   */
  getFilterIndex: () => number
  /**
   * Returns the current filter value for the column.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#getfiltervalue)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
   */
  getFilterValue: () => unknown
  /**
   * Returns whether or not the column is currently filtered.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#getisfiltered)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
   */
  getIsFiltered: () => boolean
  /**
   * A function that sets the current filter value for the column. You can pass it a value or an updater function for immutability-safe operations on existing values.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#setfiltervalue)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
   */
  setFilterValue: (updater: Updater<any>) => void
}

export interface Row_ColumnFiltering<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * The column filters map for the row. This object tracks whether a row is passing/failing specific filters by their column ID.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#columnfilters)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
   */
  columnFilters: Record<string, boolean>
  /**
   * The column filters meta map for the row. This object tracks any filter meta for a row as optionally provided during the filtering process.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#columnfiltersmeta)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
   */
  columnFiltersMeta: Record<string, FilterMeta>
}

export interface TableOptions_ColumnFiltering<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Enables/disables **column** filtering for all columns.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#enablecolumnfilters)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
   */
  enableColumnFilters?: boolean
  /**
   * Enables/disables all filtering for the table.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#enablefilters)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
   */
  enableFilters?: boolean
  /**
   * By default, filtering is done from parent rows down (so if a parent row is filtered out, all of its children will be filtered out as well). Setting this option to `true` will cause filtering to be done from leaf rows up (which means parent rows will be included so long as one of their child or grand-child rows is also included).
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#filterfromleafrows)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
   */
  filterFromLeafRows?: boolean
  /**
   * Disables the `getFilteredRowModel` from being used to filter data. This may be useful if your table needs to dynamically support both client-side and server-side filtering.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#manualfiltering)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
   */
  manualFiltering?: boolean
  /**
     * By default, filtering is done for all rows (max depth of 100), no matter if they are root level parent rows or the child leaf rows of a parent row. Setting this option to `0` will cause filtering to only be applied to the root level parent rows, with all sub-rows remaining unfiltered. Similarly, setting this option to `1` will cause filtering to only be applied to child leaf rows 1 level deep, and so on.

     * This is useful for situations where you want a row's entire child hierarchy to be visible regardless of the applied filter.
      * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#maxleafrowfilterdepth)
      * [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
     */
  maxLeafRowFilterDepth?: number
  /**
   * If provided, this function will be called with an `updaterFn` when `state.columnFilters` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#oncolumnfilterschange)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
   */
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
}

export interface Table_ColumnFiltering<> {
  /**
   * Resets the **columnFilters** state to `initialState.columnFilters`, or `true` can be passed to force a default blank state reset to `[]`.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#resetcolumnfilters)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
   */
  resetColumnFilters: (defaultState?: boolean) => void
  /**
   * Sets or updates the `state.columnFilters` state.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#setcolumnfilters)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
   */
  setColumnFilters: (updater: Updater<ColumnFiltersState>) => void
}

export interface Table_RowModels_Filtered<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Returns the row model for the table after **column** filtering has been applied.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#getfilteredrowmodel)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
   */
  getFilteredRowModel: () => RowModel<TFeatures, TData>
  /**
   * Returns the row model for the table before any **column** filtering has been applied.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#getprefilteredrowmodel)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
   */
  getPreFilteredRowModel: () => RowModel<TFeatures, TData>
}

export interface CreateRowModel_Filtered<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * If provided, this function is called **once** per table and should return a **new function** which will calculate and return the row model for the table when it's filtered.
   * - For server-side filtering, this function is unnecessary and can be ignored since the server should already return the filtered row model.
   * - For client-side filtering, this function is required. A default implementation is provided via any table adapter's `{ getFilteredRowModel }` export.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#getfilteredrowmodel)
   * [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
   */
  filteredRowModel?: (
    table: Table<TFeatures, TData>,
  ) => () => RowModel<TFeatures, TData>
}

export interface CachedRowModel_Filtered<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  filteredRowModel: () => RowModel<TFeatures, TData>
}
