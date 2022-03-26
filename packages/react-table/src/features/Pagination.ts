import {
  Column,
  OnChangeFn,
  PartialGenerics,
  TableInstance,
  Row,
  RowModel,
  TableState,
  Updater,
} from '../types'
import { functionalUpdate, makeStateUpdater, memo } from '../utils'

export type PaginationState = {
  pageIndex: number
  pageSize: number
  pageCount: number
}

export type PaginationTableState = {
  pagination: PaginationState
}

export type PaginationOptions<TGenerics extends PartialGenerics> = {
  onPaginationChange?: OnChangeFn<PaginationState>
  autoResetPageIndex?: boolean
  paginateRowsFn?: (
    instance: TableInstance<TGenerics>,
    rowModel: RowModel<TGenerics>
  ) => RowModel<TGenerics>
}

export type PaginationDefaultOptions = {
  onPaginationChange: OnChangeFn<PaginationState>
  autoResetPageIndex: boolean
}

export type PaginationInstance<TGenerics extends PartialGenerics> = {
  _notifyPageIndexReset: () => void
  setPagination: (updater: Updater<PaginationState>) => void
  resetPagination: () => void
  setPageIndex: (updater: Updater<number>) => void
  resetPageIndex: () => void
  setPageSize: (updater: Updater<number>) => void
  resetPageSize: () => void
  setPageCount: (updater: Updater<number>) => void
  getPageOptions: () => number[]
  getCanPreviousPage: () => boolean
  getCanNextPage: () => boolean
  previousPage: () => void
  nextPage: () => void
  getPrePaginationRowModel: () => RowModel<TGenerics>
  getPaginationRowModel: () => RowModel<TGenerics>
  getPageCount: () => number
}

//

export function getInitialState(): PaginationTableState {
  return {
    pagination: {
      pageCount: -1,
      pageIndex: 0,
      pageSize: 10,
    },
  }
}

export function getDefaultOptions<TGenerics extends PartialGenerics>(
  instance: TableInstance<TGenerics>
): PaginationDefaultOptions {
  return {
    onPaginationChange: makeStateUpdater('pagination', instance),
    autoResetPageIndex: true,
  }
}

export function getInstance<TGenerics extends PartialGenerics>(
  instance: TableInstance<TGenerics>
): PaginationInstance<TGenerics> {
  let registered = false
  return {
    _notifyPageIndexReset: () => {
      if (!registered) {
        registered = true
        return
      }

      if (instance.options.autoResetAll === false) {
        return
      }

      if (
        instance.options.autoResetAll === true ||
        instance.options.autoResetPageIndex
      ) {
        instance.resetPageIndex()
      }
    },
    setPagination: updater => {
      const safeUpdater: Updater<PaginationState> = old => {
        let newState = functionalUpdate(updater, old)

        return newState
      }

      return instance.options.onPaginationChange?.(
        safeUpdater,
        functionalUpdate(safeUpdater, instance.getState().pagination)
      )
    },
    resetPagination: () => {
      instance.setPagination(
        instance.initialState.pagination ?? {
          pageIndex: 0,
          pageSize: 10,
          pageCount: -1,
        }
      )
    },
    setPageIndex: updater => {
      instance.setPagination(old => {
        let pageIndex = functionalUpdate(updater, old.pageIndex)

        const maxPageIndex =
          old.pageCount && old.pageCount > 0
            ? old.pageCount - 1
            : Number.MAX_SAFE_INTEGER

        pageIndex = Math.min(Math.max(0, pageIndex), maxPageIndex)

        return {
          ...old,
          pageIndex,
        }
      })
    },
    resetPageIndex: () => {
      instance.setPageIndex(0)
    },
    resetPageSize: () => {
      instance.setPageSize(instance.initialState?.pagination?.pageSize ?? 10)
    },
    setPageSize: updater => {
      instance.setPagination(old => {
        const pageSize = Math.max(1, functionalUpdate(updater, old.pageSize))
        const topRowIndex = old.pageSize * old.pageIndex!
        const pageIndex = Math.floor(topRowIndex / pageSize)

        return {
          ...old,
          pageIndex,
          pageSize,
        }
      })
    },
    setPageCount: updater =>
      instance.setPagination(old => {
        let newPageCount = functionalUpdate(updater, old.pageCount)

        if (typeof newPageCount === 'number') {
          newPageCount = Math.max(-1, newPageCount)
        }

        return {
          ...old,
          pageCount: newPageCount,
        }
      }),

    getPageOptions: memo(
      () => [
        instance.getState().pagination.pageSize,
        instance.getState().pagination.pageCount,
      ],
      (pageSize, pageCount) => {
        let pageOptions: number[] = []
        if (pageCount && pageCount > 0) {
          pageOptions = [...new Array(pageCount)].fill(null).map((_, i) => i)
        }
        return pageOptions
      },
      {
        key: 'getPageOptions',
        debug: () => instance.options.debugAll ?? instance.options.debugTable,
      }
    ),

    getCanPreviousPage: () => instance.getState().pagination.pageIndex > 0,

    getCanNextPage: () => {
      const { pageIndex, pageCount, pageSize } = instance.getState().pagination

      if (pageCount === -1) {
        return true
      }

      if (pageCount === 0) {
        return false
      }

      return (
        pageIndex <
        Math.ceil(instance.getPrePaginationRowModel().rows.length / pageSize) -
          1
      )
    },

    previousPage: () => {
      return instance.setPageIndex(old => old - 1)
    },

    nextPage: () => {
      return instance.setPageIndex(old => {
        return old + 1
      })
    },

    getPrePaginationRowModel: () => instance.getExpandedRowModel(),
    getPaginationRowModel: memo(
      () => [
        instance.getState().pagination,
        instance.getExpandedRowModel(),
        instance.options.paginateRowsFn,
      ],
      (_pagination, rowModel, paginateRowsFn) => {
        if (!paginateRowsFn || !rowModel.rows.length) {
          return rowModel
        }

        return paginateRowsFn(instance, rowModel)
      },
      {
        key: 'getPaginationRowModel',
        debug: () => instance.options.debugAll ?? instance.options.debugTable,
      }
    ),

    getPageCount: () => {
      const { pageCount } = instance.getState().pagination
      if (pageCount > 0) {
        return pageCount
      }

      return Math.ceil(
        instance.getPrePaginationRowModel().rows.length /
          instance.getState().pagination.pageSize
      )
    },
  }
}
