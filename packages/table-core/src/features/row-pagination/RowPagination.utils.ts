import { functionalUpdate } from '../../utils'
import { table_getExpandedRowModel } from '../row-expanding/RowExpanding.utils'
import {
  table_getInitialState,
  table_getState,
} from '../../core/table/Tables.utils'
import type { RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../types/RowModel'
import type { Table } from '../../types/Table'
import type {
  PaginationState,
  TableOptions_RowPagination,
} from './RowPagination.types'

const defaultPageIndex = 0
const defaultPageSize = 10

/**
 *
 * @returns
 */
export function getDefaultPaginationState(): PaginationState {
  return structuredClone({
    pageIndex: defaultPageIndex,
    pageSize: defaultPageSize,
  })
}

/**
 *
 * @param table
 * @param registered
 * @param queued
 * @returns
 */
export function table_autoResetPageIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowPagination>
  },
  registered?: boolean,
  queued?: boolean,
) {
  if (!registered) {
    table._queue(() => {
      registered = true
    })
    return
  }

  if (
    table.options.autoResetAll ??
    table.options.autoResetPageIndex ??
    !table.options.manualPagination
  ) {
    if (queued) return
    queued = true
    table._queue(() => {
      table_resetPageIndex(table)
      queued = false
    })
  }
}

/**
 *
 * @param table
 * @param updater
 * @returns
 */
export function table_setPagination<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowPagination>
  },
  updater: Updater<PaginationState>,
) {
  const safeUpdater: Updater<PaginationState> = (old) => {
    const newState = functionalUpdate(updater, old)

    return newState
  }

  return table.options.onPaginationChange?.(safeUpdater)
}

/**
 *
 * @param table
 * @param defaultState
 */
export function table_resetPagination<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowPagination>
  },
  defaultState?: boolean,
) {
  table_setPagination(
    table,
    defaultState
      ? getDefaultPaginationState()
      : (table_getInitialState(table).pagination ??
          getDefaultPaginationState()),
  )
}

/**
 *
 * @param table
 * @param updater
 */
export function table_setPageIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowPagination>
  },
  updater: Updater<number>,
) {
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
 *
 * @param table
 * @param defaultState
 */
export function table_resetPageIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowPagination>
  },
  defaultState?: boolean,
) {
  table_setPageIndex(
    table,
    defaultState
      ? defaultPageIndex
      : (table_getInitialState(table).pagination?.pageIndex ??
          defaultPageIndex),
  )
}

/**
 *
 * @param table
 * @param defaultState
 */
export function table_resetPageSize<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowPagination>
  },
  defaultState?: boolean,
) {
  table_setPageSize(
    table,
    defaultState
      ? defaultPageSize
      : (table_getInitialState(table).pagination?.pageSize ?? defaultPageSize),
  )
}

/**
 *
 * @param table
 * @param updater
 */
export function table_setPageSize<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowPagination>
  },
  updater: Updater<number>,
) {
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
 *
 * @param table
 * @returns
 */
export function table_getPageOptions<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  const pageCount = table_getPageCount(table)
  let pageOptions: Array<number> = []
  if (pageCount && pageCount > 0) {
    pageOptions = [...new Array(pageCount)].fill(null).map((_, i) => i)
  }
  return pageOptions
}

/**
 *
 * @param table
 * @returns
 */
export function table_getCanPreviousPage<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowPagination>
  },
) {
  return (table_getState(table).pagination?.pageIndex ?? 0) > 0
}

/**
 *
 * @param table
 * @returns
 */
export function table_getCanNextPage<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowPagination>
  },
) {
  const pageIndex =
    table_getState(table).pagination?.pageIndex ?? defaultPageIndex

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
 *
 * @param table
 * @returns
 */
export function table_previousPage<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowPagination>
  },
) {
  return table_setPageIndex(table, (old) => old - 1)
}

/**
 *
 * @param table
 * @returns
 */
export function table_nextPage<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowPagination>
  },
) {
  return table_setPageIndex(table, (old) => {
    return old + 1
  })
}

/**
 *
 * @param table
 * @returns
 */
export function table_firstPage<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowPagination>
  },
) {
  return table_setPageIndex(table, 0)
}

/**
 *
 * @param table
 * @returns
 */
export function table_lastPage<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowPagination>
  },
) {
  return table_setPageIndex(table, table_getPageCount(table) - 1)
}

/**
 *
 * @param table
 * @returns
 */
export function table_getPrePaginationRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowPagination>
  },
): RowModel<TFeatures, TData> {
  return table_getExpandedRowModel(table)
}

/**
 *
 * @param table
 * @returns
 */
export function table_getPaginatedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowPagination>
  },
): RowModel<TFeatures, TData> {
  if (!table._rowModels.Paginated) {
    table._rowModels.Paginated = table.options._rowModels?.Paginated?.(table)
  }

  if (table.options.manualPagination || !table._rowModels.Paginated) {
    return table_getPrePaginationRowModel(table)
  }

  return table._rowModels.Paginated()
}

/**
 *
 * @param table
 * @returns
 */
export function table_getPageCount<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowPagination>
  },
) {
  return (
    table.options.pageCount ??
    Math.ceil(
      table_getRowCount(table) /
        (table_getState(table).pagination?.pageSize ?? defaultPageSize),
    )
  )
}

/**
 *
 * @param table
 * @returns
 */
export function table_getRowCount<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowPagination>
  },
) {
  return (
    table.options.rowCount ?? table_getPrePaginationRowModel(table).rows.length
  )
}
