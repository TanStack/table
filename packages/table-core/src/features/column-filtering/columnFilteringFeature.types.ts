import type { BuiltInFilterFn } from '../../fns/filterFns'
import type {
  CellData,
  OnChangeFn,
  RowData,
  Updater,
} from '../../types/type-utils'
import type { IsAny, TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { Row } from '../../types/Row'
import type { Column } from '../../types/Column'

export interface FilterMeta {}

/**
 * Resolves the type of the filter meta attached to rows for a feature set.
 *
 * When the features object declares a `filterMeta` type-only slot
 * (`tableFeatures({ ..., filterMeta: {} as MyFilterMeta })`), that type wins.
 * Otherwise this falls back to the global declaration-merged `FilterMeta`
 * interface.
 */
export type ExtractFilterMeta<TFeatures extends TableFeatures> =
  IsAny<TFeatures> extends true
    ? FilterMeta
    : TFeatures extends { filterMeta: infer TFilterMeta extends object }
      ? TFilterMeta
      : FilterMeta

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
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  filterFn: FilterFn<TFeatures, TData>
  id: string
  resolvedValue: unknown
}

export interface RowModelFns_ColumnFiltering<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  filterFns: Record<string, FilterFn<TFeatures, TData>>
}

export interface FilterFn<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  (
    row: Row<TFeatures, TData>,
    columnId: string,
    filterValue: any,
    addMeta?: (meta: ExtractFilterMeta<TFeatures>) => void,
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

/**
 * Resolves the valid string names for `columnDef.filterFn` and
 * `options.globalFilterFn` for a feature set.
 *
 * When the features object declares a `filterFns` registry
 * (`tableFeatures({ ..., filterFns })`), its keys are the only valid names; a
 * name is only assignable if a filter function is actually registered for it.
 * Otherwise this falls back to the global declaration-merged `FilterFns`
 * interface.
 */
export type ExtractFilterFnKeys<TFeatures extends TableFeatures> =
  IsAny<TFeatures> extends true
    ? keyof FilterFns | BuiltInFilterFn
    : TFeatures extends { filterFns: infer TFilterFns extends object }
      ? Extract<keyof TFilterFns, string>
      : keyof FilterFns

export type FilterFnOption<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = 'auto' | ExtractFilterFnKeys<TFeatures> | FilterFn<TFeatures, TData>

export interface ColumnDef_ColumnFiltering<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * Enables this column to participate in column-specific filtering.
   *
   * Defaults to `true`; table-level `enableColumnFilters` and `enableFilters`
   * must also allow filtering.
   */
  enableColumnFilter?: boolean
  /**
   * The filter function to use with this column. Can be the name of a built-in filter function or a custom filter function.
   */
  filterFn?: FilterFnOption<TFeatures, TData>
}

export interface Column_ColumnFiltering<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * Returns an automatically calculated filter function for the column based off of the columns first known value.
   */
  getAutoFilterFn: () => FilterFn<TFeatures, TData>
  /**
   * Checks whether this accessor column can currently be column-filtered.
   */
  getCanFilter: () => boolean
  /**
   * Returns the filter function (either user-defined or automatic, depending on configuration) for the columnId specified.
   */
  getFilterFn: () => FilterFn<TFeatures, TData>
  /**
   * Returns the index (including `-1`) of the column filter in the table's `state.columnFilters` array.
   */
  getFilterIndex: () => number
  /**
   * Reads this column's current value from `state.columnFilters`.
   */
  getFilterValue: () => unknown
  /**
   * Checks whether this column has an active entry in `state.columnFilters`.
   */
  getIsFiltered: () => boolean
  /**
   * Adds, updates, or removes this column's filter value.
   *
   * Updater functions receive the previous filter value. Values that satisfy
   * the filter function's `autoRemove` rule are removed from filter state.
   */
  setFilterValue: (updater: Updater<any>) => void
}

export interface Row_ColumnFiltering<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * The column filters map for the row. This object tracks whether a row is passing/failing specific filters by their column ID.
   */
  columnFilters: Record<string, boolean>
  /**
   * The column filters meta map for the row. This object tracks any filter meta for a row as optionally provided during the filtering process.
   */
  columnFiltersMeta: Record<string, ExtractFilterMeta<TFeatures>>
}

export interface TableOptions_ColumnFiltering<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * Enables column-specific filtering for all columns that also allow it.
   */
  enableColumnFilters?: boolean
  /**
   * Enables all filtering features for the table.
   *
   * Set this to `false` to disable both column filtering and global filtering.
   */
  enableFilters?: boolean
  /**
   * By default, filtering is done from parent rows down (so if a parent row is filtered out, all of its children will be filtered out as well). Setting this option to `true` will cause filtering to be done from leaf rows up (which means parent rows will be included so long as one of their child or grand-child rows is also included).
   */
  filterFromLeafRows?: boolean
  /**
   * Disables the `getFilteredRowModel` from being used to filter data. This may be useful if your table needs to dynamically support both client-side and server-side filtering.
   */
  manualFiltering?: boolean
  /**
     * By default, filtering is done for all rows (max depth of 100), no matter if they are root level parent rows or the child leaf rows of a parent row. Setting this option to `0` will cause filtering to only be applied to the root level parent rows, with all sub-rows remaining unfiltered. Similarly, setting this option to `1` will cause filtering to only be applied to child leaf rows 1 level deep, and so on.

     * This is useful for situations where you want a row's entire child hierarchy to be visible regardless of the applied filter.
     */
  maxLeafRowFilterDepth?: number
  /**
   * Called with an updater when column filter state changes. Pair this with
   * `state.columnFilters` when using external state; external atoms can own the
   * slice without this callback.
   */
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
}

export interface Table_ColumnFiltering {
  /**
   * Resets `columnFilters` to `initialState.columnFilters`.
   *
   * Pass `true` to ignore initial state and reset to `[]`.
   */
  resetColumnFilters: (defaultState?: boolean) => void
  /**
   * Updates column filter state with a next array or updater function.
   */
  setColumnFilters: (updater: Updater<ColumnFiltersState>) => void
}

export interface Table_RowModels_Filtered<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * Resolves the row model after column and global filters have been applied.
   */
  getFilteredRowModel: () => RowModel<TFeatures, TData>
  /**
   * Reads the row model immediately before filtering.
   */
  getPreFilteredRowModel: () => RowModel<TFeatures, TData>
}

export interface CachedRowModel_Filtered<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  filteredRowModel: () => RowModel<TFeatures, TData>
}
