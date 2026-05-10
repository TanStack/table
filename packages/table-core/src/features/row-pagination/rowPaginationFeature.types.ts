import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { Table } from '../../types/Table'
import type { OnChangeFn, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'

export interface PaginationState {
  pageIndex: number
  pageSize: number
}

export interface TableState_RowPagination {
  pagination: PaginationState
}

export interface TableOptions_RowPagination {
  /**
   * If set to `true`, pagination will be reset to the first page when page-altering state changes eg. `data` is updated, filters change, grouping changes, etc.
   */
  autoResetPageIndex?: boolean
  /**
   * Enables manual pagination. If this option is set to `true`, the table will not automatically paginate rows using `getPaginatedRowModel()` and instead will expect you to manually paginate the rows before passing them to the table. This is useful if you are doing server-side pagination and aggregation.
   */
  manualPagination?: boolean
  /**
   * Called with an updater when pagination state changes. Pair this with
   * `state.pagination` when using external state; external atoms can own the
   * slice without this callback.
   */
  onPaginationChange?: OnChangeFn<PaginationState>
  /**
   * When manually controlling pagination, you can supply a total `pageCount` value to the table if you know it (Or supply a `rowCount` and `pageCount` will be calculated). If you do not know how many pages there are, you can set this to `-1`.
   */
  pageCount?: number
  /**
   * When manually controlling pagination, you can supply a total `rowCount` value to the table if you know it. The `pageCount` can be calculated from this value and the `pageSize`.
   */
  rowCount?: number
}

export interface PaginationDefaultOptions {
  onPaginationChange: OnChangeFn<PaginationState>
}

export interface Table_RowPagination<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  _autoResetPageIndex: () => void
  /**
   * Returns whether the table can go to the next page.
   */
  getCanNextPage: () => boolean
  /**
   * Returns whether the table can go to the previous page.
   */
  getCanPreviousPage: () => boolean
  /**
   * Returns the page count. If manually paginating or controlling the pagination state, this will come directly from the `options.pageCount` table option, otherwise it will be calculated from the table data using the total row count and current page size.
   */
  getPageCount: () => number
  /**
   * Returns the row count. If manually paginating or controlling the pagination state, this will come directly from the `options.rowCount` table option, otherwise it will be calculated from the table data.
   */
  getRowCount: () => number
  /**
   * Returns an array of page options (zero-index-based) for the current page size.
   */
  getPageOptions: () => Array<number>
  /**
   * Increments the page index by one, if possible.
   */
  nextPage: () => void
  /**
   * Decrements the page index by one, if possible.
   */
  previousPage: () => void
  /**
   * Sets the page index to `0`.
   */
  firstPage: () => void
  /**
   * Sets the page index to the last page.
   */
  lastPage: () => void
  /**
   * Resets the page index to its initial state. If `defaultState` is `true`, the page index will be reset to `0` regardless of initial state.
   */
  resetPageIndex: (defaultState?: boolean) => void
  /**
   * Resets the page size to its initial state. If `defaultState` is `true`, the page size will be reset to `10` regardless of initial state.
   */
  resetPageSize: (defaultState?: boolean) => void
  /**
   * Resets pagination state to `initialState.pagination`. Pass `true` to reset
   * to the feature default of `{ pageIndex: 0, pageSize: 10 }`.
   */
  resetPagination: (defaultState?: boolean) => void
  /**
   * Updates `pagination.pageIndex` using a value or updater.
   */
  setPageIndex: (updater: Updater<number>) => void
  /**
   * Updates `pagination.pageSize` using a value or updater.
   */
  setPageSize: (updater: Updater<number>) => void
  /**
   * Sets pagination state using a value or updater.
   */
  setPagination: (updater: Updater<PaginationState>) => void
}

export interface Table_RowModels_Paginated<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Returns the row model for the table after pagination has been applied.
   */
  getPaginatedRowModel: () => RowModel<TFeatures, TData>
  /**
   * Returns the row model for the table before any pagination has been applied.
   */
  getPrePaginatedRowModel: () => RowModel<TFeatures, TData>
}

export interface CreateRowModel_Paginated<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Factory used to retrieve the paginated row model. If using server-side
   * pagination, this is not required. To use client-side pagination, pass
   * `createPaginatedRowModel()` or implement your own factory.
   */
  paginatedRowModel?: (
    table: Table<TFeatures, TData>,
  ) => () => RowModel<TFeatures, TData>
}

export interface CachedRowModel_Paginated<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  paginatedRowModel: () => RowModel<TFeatures, TData>
}
