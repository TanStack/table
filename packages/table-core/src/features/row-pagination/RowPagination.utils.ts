import { functionalUpdate } from '../../utils'
import { table_getExpandedRowModel } from '../row-expanding/RowExpanding.utils'
import type {
  RowData,
  RowModel,
  Table,
  TableFeatures,
  Updater,
} from '../../types'
import type { PaginationState } from './RowPagination.types'

const defaultPageIndex = 0
const defaultPageSize = 10

export function getDefaultPaginationState(): PaginationState {
  return structuredClone({
    pageIndex: defaultPageIndex,
    pageSize: defaultPageSize,
  })
}

export function table_autoResetPageIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, registered: boolean, queued: boolean) {
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

export function table_setPagination<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, updater: Updater<PaginationState>) {
  const safeUpdater: Updater<PaginationState> = (old) => {
    const newState = functionalUpdate(updater, old)

    return newState
  }

  return table.options.onPaginationChange?.(safeUpdater)
}

export function table_resetPagination<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, defaultState?: boolean) {
  table_setPagination(
    table,
    defaultState ? getDefaultPaginationState() : table.initialState.pagination,
  )
}

export function table_setPageIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, updater: Updater<number>) {
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

export function table_resetPageIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, defaultState?: boolean) {
  table_setPageIndex(
    table,
    defaultState ? defaultPageIndex : table.initialState.pagination.pageIndex,
  )
}

export function table_resetPageSize<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, defaultState?: boolean) {
  table_setPageSize(
    table,
    defaultState ? defaultPageSize : table.initialState.pagination.pageSize,
  )
}

export function table_setPageSize<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, updater: Updater<number>) {
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

export function table_getPageOptions(pageCount: number) {
  let pageOptions: Array<number> = []
  if (pageCount && pageCount > 0) {
    pageOptions = [...new Array(pageCount)].fill(null).map((_, i) => i)
  }
  return pageOptions
}

export function table_getCanPreviousPage<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  return table.getState().pagination.pageIndex > 0
}

export function table_getCanNextPage<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  const { pageIndex } = table.getState().pagination

  const pageCount = table_getPageCount(table)

  if (pageCount === -1) {
    return true
  }

  if (pageCount === 0) {
    return false
  }

  return pageIndex < pageCount - 1
}

export function table_previousPage<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  return table_setPageIndex(table, (old) => old - 1)
}

export function table_nextPage<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  return table_setPageIndex(table, (old) => {
    return old + 1
  })
}

export function table_firstPage<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  return table_setPageIndex(table, 0)
}

export function table_lastPage<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  return table_setPageIndex(table, table_getPageCount(table) - 1)
}

export function table_getPrePaginationRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>): RowModel<TFeatures, TData> {
  return table_getExpandedRowModel(table)
}

export function table_getPaginatedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>): RowModel<TFeatures, TData> {
  if (!table._getPaginatedRowModel) {
    table._getPaginatedRowModel = table.options._rowModels?.Paginated?.(table)
  }

  if (table.options.manualPagination || !table._getPaginatedRowModel) {
    return table_getPrePaginationRowModel(table)
  }

  return table._getPaginatedRowModel()
}

export function table_getPageCount<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  return (
    table.options.pageCount ??
    Math.ceil(table_getRowCount(table) / table.getState().pagination.pageSize)
  )
}

export function table_getRowCount<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  return (
    table.options.rowCount ?? table_getPrePaginationRowModel(table).rows.length
  )
}
