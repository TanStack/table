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
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  _autoResetPageIndex: () => void
  /**
   * Checks whether the current page index can move forward.
   */
  getCanNextPage: () => boolean
  /**
   * Checks whether the current page index can move backward.
   */
  getCanPreviousPage: () => boolean
  /**
   * Resolves the current page count from `options.pageCount` or row count and
   * page size.
   */
  getPageCount: () => number
  /**
   * Resolves the row count used for pagination math.
   *
   * `options.rowCount` wins; otherwise the pre-paginated row model is counted.
   */
  getRowCount: () => number
  /**
   * Builds zero-based page indexes for the current page count.
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
   * Resets `pagination.pageIndex` to initial state, or to `0` when
   * `defaultState` is `true`.
   */
  resetPageIndex: (defaultState?: boolean) => void
  /**
   * Resets `pagination.pageSize` to initial state, or to `10` when
   * `defaultState` is `true`.
   */
  resetPageSize: (defaultState?: boolean) => void
  /**
   * Resets `pagination` to `initialState.pagination`.
   *
   * Pass `true` to ignore initial state and reset to
   * `{ pageIndex: 0, pageSize: 10 }`.
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
   * Updates pagination state with a next state or updater function.
   */
  setPagination: (updater: Updater<PaginationState>) => void
}

export interface Table_RowModels_Paginated<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * Resolves the row model after pagination has sliced the current page.
   */
  getPaginatedRowModel: () => RowModel<TFeatures, TData>
  /**
   * Reads the row model immediately before pagination.
   */
  getPrePaginatedRowModel: () => RowModel<TFeatures, TData>
}

export interface CachedRowModel_Paginated<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  paginatedRowModel: () => RowModel<TFeatures, TData>
}
