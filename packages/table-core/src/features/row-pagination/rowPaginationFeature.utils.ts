import { cloneState, functionalUpdate } from '../../utils'
import type { RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { PaginationState } from './rowPaginationFeature.types'

const defaultPageIndex = 0
const defaultPageSize = 10

/**
 * Returns the default pagination state.
 *
 * Feature constructors use this value to initialize the table state or option defaults when no user value is provided.
 *
 * @example
 * ```ts
 * const initialValue = getDefaultPaginationState()
 * ```
 */
export function getDefaultPaginationState(): PaginationState {
  return {
    pageIndex: defaultPageIndex,
    pageSize: defaultPageSize,
  }
}

/**
 * Schedules an automatic reset for page index.
 *
 * The reset only runs when the related feature options allow automatic resets for the current table state change.
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
    table_resetPageIndex(table)
  }
}

/**
 * Updates the table's pagination state slice.
 *
 * The updater follows TanStack Table updater semantics and is routed through the corresponding `on*Change` option or backing atom.
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
  const safeUpdater: Updater<PaginationState> = (old) => {
    const newState = functionalUpdate(updater, old)

    return newState
  }

  return table.options.onPaginationChange?.(safeUpdater)
}

/**
 * Resets the table's pagination state slice.
 *
 * By default the reset uses `table.initialState`; when supported, a blank/default reset bypasses the saved initial value.
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
 * Updates the table's page index state slice.
 *
 * The updater follows TanStack Table updater semantics and is routed through the corresponding `on*Change` option or backing atom.
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
 * Resets the table's page index state slice.
 *
 * By default the reset uses `table.initialState`; when supported, a blank/default reset bypasses the saved initial value.
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
  const currentPageIndex =
    table.atoms.pagination?.get()?.pageIndex ?? defaultPageIndex
  const newPageIndex = defaultState
    ? defaultPageIndex
    : (table.initialState.pagination?.pageIndex ?? defaultPageIndex)
  if (newPageIndex === currentPageIndex) return
  table_setPageIndex(table, newPageIndex)
}

/**
 * Resets the table's page size state slice.
 *
 * By default the reset uses `table.initialState`; when supported, a blank/default reset bypasses the saved initial value.
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
  const currentPageSize =
    table.atoms.pagination?.get()?.pageSize ?? defaultPageSize
  const newPageSize = defaultState
    ? defaultPageSize
    : (table.initialState.pagination?.pageSize ?? defaultPageSize)
  if (newPageSize === currentPageSize) return
  table_setPageSize(table, newPageSize)
}

/**
 * Updates the table's page size state slice.
 *
 * The updater follows TanStack Table updater semantics and is routed through the corresponding `on*Change` option or backing atom.
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
    const topRowIndex = old.pageSize * old.pageIndex
    const pageIndex = Math.floor(topRowIndex / pageSize)

    return {
      ...old,
      pageIndex,
      pageSize,
    }
  })
}

/**
 * Returns page options for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getPageOptions(table)
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
 * Returns can previous page for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getCanPreviousPage(table)
 * ```
 */
export function table_getCanPreviousPage<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return (table.atoms.pagination?.get()?.pageIndex ?? 0) > 0
}

/**
 * Returns can next page for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getCanNextPage(table)
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
 * The target page is derived from `table_getPageCount(table) - 1`.
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
  return table_setPageIndex(table, table_getPageCount(table) - 1)
}

/**
 * Returns page count for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getPageCount(table)
 * ```
 */
export function table_getPageCount<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return (
    table.options.pageCount ??
    Math.ceil(
      table_getRowCount(table) /
        (table.atoms.pagination?.get()?.pageSize ?? defaultPageSize),
    )
  )
}

/**
 * Returns row count for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getRowCount(table)
 * ```
 */
export function table_getRowCount<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return table.options.rowCount ?? table.getPrePaginatedRowModel().rows.length
}
