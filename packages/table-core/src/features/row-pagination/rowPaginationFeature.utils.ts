import {
  cloneState,
  functionalUpdate,
  setStateSlice,
  stateSlicesEqual,
} from '../../utils'
import type { RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { PaginationState } from './rowPaginationFeature.types'

const defaultPageIndex = 0
const defaultPageSize = 10

/**
 * Creates the default pagination state used by the pagination feature.
 *
 * The feature default starts at the first page with a page size of 10. Reset
 * APIs use this value when `defaultState` is `true`.
 *
 * @example
 * ```ts
 * const pagination = getDefaultPaginationState()
 * ```
 */
export function getDefaultPaginationState(): PaginationState {
  return {
    pageIndex: defaultPageIndex,
    pageSize: defaultPageSize,
  }
}

/**
 * Resets the page index when a page-altering change should return to page 0.
 *
 * The reset runs when `autoResetAll`, `autoResetPageIndex`, or the default
 * client-side pagination behavior allows it. Manual pagination opts out unless
 * the reset options explicitly opt back in.
 *
 * @example
 * ```ts
 * table_autoResetPageIndex(table)
 * ```
 */
export function table_autoResetPageIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  if (
    table.options.autoResetAll ??
    table.options.autoResetPageIndex ??
    !table.options.manualPagination
  ) {
    // Auto resets are fire-and-forget, so skip the reset entirely when
    // already on the default page. Routing a no-op through the pagination
    // handler would still run user `onPaginationChange` side effects (such
    // as refetching) on every data, filter, sort, or grouping change.
    const currentPageIndex =
      table.atoms.pagination?.get()?.pageIndex ?? defaultPageIndex
    if (currentPageIndex === defaultPageIndex) return
    table_resetPageIndex(table, true)
  }
}

/**
 * Routes a pagination updater through the table's pagination change handler.
 *
 * The updater may be a next state object or a function of the previous
 * `PaginationState`; controlled state and external atoms observe the same
 * updater path as the instance API.
 *
 * @example
 * ```ts
 * table_setPagination(table, (old) => old)
 * ```
 */
export function table_setPagination<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, updater: Updater<PaginationState>) {
  setStateSlice(table, 'pagination', updater, stateSlicesEqual)
}

/**
 * Resets `pagination` to the configured initial state or feature default.
 *
 * With no argument, the reset clones `table.initialState.pagination` when it
 * exists. Passing `true` ignores initial state and resets to
 * `{ pageIndex: 0, pageSize: 10 }`.
 *
 * @example
 * ```ts
 * table_resetPagination(table)
 * table_resetPagination(table, true)
 * ```
 */
export function table_resetPagination<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, defaultState?: boolean) {
  table_setPagination(
    table,
    defaultState
      ? getDefaultPaginationState()
      : cloneState(
          table.initialState.pagination ?? getDefaultPaginationState(),
        ),
  )
}

/**
 * Updates `pagination.pageIndex` and clamps it to the known page range.
 *
 * Unknown page counts (`undefined` or `-1`) allow any non-negative page index.
 * Known page counts clamp the index between `0` and `pageCount - 1`.
 *
 * @example
 * ```ts
 * table_setPageIndex(table, (old) => old)
 * ```
 */
export function table_setPageIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, updater: Updater<number>) {
  table_setPagination(table, (old) => {
    let pageIndex = functionalUpdate(updater, old.pageIndex)

    const maxPageIndex =
      typeof table.options.pageCount === 'undefined' ||
      table.options.pageCount === -1
        ? Number.MAX_SAFE_INTEGER
        : table.options.pageCount - 1

    pageIndex = Math.max(0, Math.min(pageIndex, maxPageIndex))

    return {
      ...old,
      pageIndex,
    }
  })
}

/**
 * Resets only `pagination.pageIndex`.
 *
 * With no argument, the reset uses `table.initialState.pagination?.pageIndex`
 * or `0`. Passing `true` always resets the page index to `0`.
 *
 * @example
 * ```ts
 * table_resetPageIndex(table)
 * table_resetPageIndex(table, true)
 * ```
 */
export function table_resetPageIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, defaultState?: boolean) {
  table_setPageIndex(
    table,
    defaultState
      ? defaultPageIndex
      : (table.initialState.pagination?.pageIndex ?? defaultPageIndex),
  )
}

/**
 * Resets only `pagination.pageSize`.
 *
 * With no argument, the reset uses `table.initialState.pagination?.pageSize`
 * or `10`. Passing `true` always resets the page size to `10`.
 *
 * @example
 * ```ts
 * table_resetPageSize(table)
 * table_resetPageSize(table, true)
 * ```
 */
export function table_resetPageSize<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, defaultState?: boolean) {
  table_setPageSize(
    table,
    defaultState
      ? defaultPageSize
      : (table.initialState.pagination?.pageSize ?? defaultPageSize),
  )
}

/**
 * Updates `pagination.pageSize` while preserving the current top row.
 *
 * The new size is clamped to at least `1`, and `pageIndex` is recalculated so
 * the row that was previously at the top of the page remains in view.
 *
 * @example
 * ```ts
 * table_setPageSize(table, (old) => old)
 * ```
 */
export function table_setPageSize<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, updater: Updater<number>) {
  table_setPagination(table, (old) => {
    const pageSize = Math.max(1, functionalUpdate(updater, old.pageSize))
    const topRowIndex =
      old.pageSize === Infinity ? 0 : old.pageSize * old.pageIndex
    const pageIndex =
      pageSize === Infinity ? 0 : Math.floor(topRowIndex / pageSize)

    return {
      ...old,
      pageIndex,
      pageSize,
    }
  })
}

/**
 * Builds the zero-based page indexes available for the current page count.
 *
 * Unknown or empty page counts return an empty array; otherwise the result is
 * `[0, 1, ...pageCount - 1]`.
 *
 * @example
 * ```ts
 * const pageIndexes = table_getPageOptions(table)
 * ```
 */
export function table_getPageOptions<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const pageCount = table_getPageCount(table)
  let pageOptions: Array<number> = []
  if (pageCount && pageCount > 0) {
    pageOptions = [...new Array(pageCount)].fill(null).map((_, i) => i)
  }
  return pageOptions
}

/**
 * Checks whether the current page index can move backward.
 *
 * The first page is page index `0`, so only positive page indexes can navigate
 * to a previous page.
 *
 * @example
 * ```ts
 * const canGoBack = table_getCanPreviousPage(table)
 * ```
 */
export function table_getCanPreviousPage<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return (table.atoms.pagination?.get()?.pageIndex ?? 0) > 0
}

/**
 * Checks whether the current page index can move forward.
 *
 * A `pageCount` of `-1` means the caller does not know the total page count, so
 * this returns `true`. A page count of `0` returns `false`.
 *
 * @example
 * ```ts
 * const canGoForward = table_getCanNextPage(table)
 * ```
 */
export function table_getCanNextPage<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const pageIndex = table.atoms.pagination?.get()?.pageIndex ?? defaultPageIndex

  const pageCount = table_getPageCount(table)

  if (pageCount === -1) {
    return true
  }

  if (pageCount === 0) {
    return false
  }

  return pageIndex < pageCount - 1
}

/**
 * Checks whether a known, finite last page exists after the current page.
 *
 * Unknown (`-1`), empty, and non-finite page counts do not have a navigable
 * last page.
 *
 * @example
 * ```ts
 * const canGoToLastPage = table_getCanLastPage(table)
 * ```
 */
export function table_getCanLastPage<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const pageIndex = table.atoms.pagination?.get()?.pageIndex ?? defaultPageIndex
  const pageCount = table_getPageCount(table)

  return (
    Number.isFinite(pageCount) && pageCount > 0 && pageIndex < pageCount - 1
  )
}

/**
 * Moves the table to the previous page.
 *
 * This delegates to `table_setPageIndex` so pagination state ownership and
 * updater semantics remain consistent.
 *
 * @example
 * ```ts
 * table_previousPage(table)
 * ```
 */
export function table_previousPage<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return table_setPageIndex(table, (old) => old - 1)
}

/**
 * Moves the table to the next page.
 *
 * This delegates to `table_setPageIndex` so pagination state ownership and
 * updater semantics remain consistent.
 *
 * @example
 * ```ts
 * table_nextPage(table)
 * ```
 */
export function table_nextPage<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return table_setPageIndex(table, (old) => {
    return old + 1
  })
}

/**
 * Moves the table to the first page.
 *
 * This is a convenience wrapper around `table_setPageIndex(table, 0)`.
 *
 * @example
 * ```ts
 * table_firstPage(table)
 * ```
 */
export function table_firstPage<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return table_setPageIndex(table, 0)
}

/**
 * Moves the table to the last known page.
 *
 * Unknown, empty, and non-finite page counts do not have a navigable last
 * page, so this does nothing for those states.
 *
 * @example
 * ```ts
 * table_lastPage(table)
 * ```
 */
export function table_lastPage<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const pageCount = table_getPageCount(table)

  if (!Number.isFinite(pageCount) || pageCount <= 0) {
    return
  }

  return table_setPageIndex(table, pageCount - 1)
}

/**
 * Resolves the number of pages for the current pagination state.
 *
 * `options.pageCount` wins for manual pagination. Otherwise the value is
 * calculated from `table_getRowCount(table)` and the current `pageSize`.
 *
 * @example
 * ```ts
 * const pages = table_getPageCount(table)
 * ```
 */
export function table_getPageCount<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const configuredPageCount = table.options.pageCount
  if (configuredPageCount != null) {
    return configuredPageCount
  }

  const rowCount = table_getRowCount(table)
  const pageSize = table.atoms.pagination?.get()?.pageSize ?? defaultPageSize

  if (pageSize === Infinity && Number.isFinite(rowCount) && rowCount > 0) {
    return 1
  }

  return Math.ceil(rowCount / pageSize)
}

/**
 * Resolves the total row count used for pagination math.
 *
 * `options.rowCount` wins for manual pagination. Otherwise the count comes
 * from the pre-paginated row model so filtering, grouping, sorting, and
 * expansion are reflected before the page slice is applied.
 *
 * @example
 * ```ts
 * const rows = table_getRowCount(table)
 * ```
 */
export function table_getRowCount<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return table.options.rowCount ?? table.getPrePaginatedRowModel().rows.length
}
