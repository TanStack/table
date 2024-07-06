import { functionalUpdate } from '../../utils'
import type { RowData, Table, Updater } from '../../types'
import type { PaginationState } from './RowPagination.types'

const defaultPageIndex = 0
const defaultPageSize = 10

export function getDefaultPaginationState(): PaginationState {
  return structuredClone({
    pageIndex: defaultPageIndex,
    pageSize: defaultPageSize,
  })
}

export function table_autoResetPageIndex<TData extends RowData>(
  table: Table<TData>,
  registered: boolean,
  queued: boolean,
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
      table.resetPageIndex()
      queued = false
    })
  }
}

export function table_setPagination<TData extends RowData>(
  table: Table<TData>,
  updater: Updater<PaginationState>,
) {
  const safeUpdater: Updater<PaginationState> = (old) => {
    const newState = functionalUpdate(updater, old)

    return newState
  }

  return table.options.onPaginationChange?.(safeUpdater)
}

export function table_resetPagination<TData extends RowData>(
  table: Table<TData>,
  defaultState?: boolean,
) {
  table.setPagination(
    defaultState ? getDefaultPaginationState() : table.initialState.pagination,
  )
}

export function table_setPageIndex<TData extends RowData>(
  table: Table<TData>,
  updater: Updater<number>,
) {
  table.setPagination((old) => {
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

export function table_resetPageIndex<TData extends RowData>(
  table: Table<TData>,
  defaultState?: boolean,
) {
  table.setPageIndex(
    defaultState ? defaultPageIndex : table.initialState.pagination.pageIndex,
  )
}

export function table_resetPageSize<TData extends RowData>(
  table: Table<TData>,
  defaultState?: boolean,
) {
  table.setPageSize(
    defaultState ? defaultPageSize : table.initialState.pagination.pageSize,
  )
}

export function table_setPageSize<TData extends RowData>(
  table: Table<TData>,
  updater: Updater<number>,
) {
  table.setPagination((old) => {
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
 * @deprecated
 */
export function table_setPageCount<TData extends RowData>(
  table: Table<TData>,
  updater: Updater<number>,
) {
  return table.setPagination((old) => {
    let newPageCount = functionalUpdate(updater, table.options.pageCount ?? -1)

    if (typeof newPageCount === 'number') {
      newPageCount = Math.max(-1, newPageCount)
    }

    return {
      ...old,
      pageCount: newPageCount,
    }
  })
}

export function table_getPageOptions(pageCount: number) {
  let pageOptions: Array<number> = []
  if (pageCount && pageCount > 0) {
    pageOptions = [...new Array(pageCount)].fill(null).map((_, i) => i)
  }
  return pageOptions
}

export function table_getCanPreviousPage<TData extends RowData>(
  table: Table<TData>,
) {
  return table.getState().pagination.pageIndex > 0
}

export function table_getCanNextPage<TData extends RowData>(
  table: Table<TData>,
) {
  const { pageIndex } = table.getState().pagination

  const pageCount = table.getPageCount()

  if (pageCount === -1) {
    return true
  }

  if (pageCount === 0) {
    return false
  }

  return pageIndex < pageCount - 1
}

export function table_previousPage<TData extends RowData>(table: Table<TData>) {
  return table.setPageIndex((old) => old - 1)
}

export function table_nextPage<TData extends RowData>(table: Table<TData>) {
  return table.setPageIndex((old) => {
    return old + 1
  })
}

export function table_firstPage<TData extends RowData>(table: Table<TData>) {
  return table.setPageIndex(0)
}

export function table_lastPage<TData extends RowData>(table: Table<TData>) {
  return table.setPageIndex(table.getPageCount() - 1)
}

export function table_getPrePaginationRowModel<TData extends RowData>(
  table: Table<TData>,
) {
  return table.getExpandedRowModel()
}

export function table_getPaginationRowModel<TData extends RowData>(
  table: Table<TData>,
) {
  if (!table._getPaginationRowModel && table.options.getPaginationRowModel) {
    table._getPaginationRowModel = table.options.getPaginationRowModel(table)
  }

  if (table.options.manualPagination || !table._getPaginationRowModel) {
    return table.getPrePaginationRowModel()
  }

  return table._getPaginationRowModel()
}

export function table_getPageCount<TData extends RowData>(table: Table<TData>) {
  return (
    table.options.pageCount ??
    Math.ceil(table.getRowCount() / table.getState().pagination.pageSize)
  )
}

export function table_getRowCount<TData extends RowData>(table: Table<TData>) {
  return table.options.rowCount ?? table.getPrePaginationRowModel().rows.length
}
