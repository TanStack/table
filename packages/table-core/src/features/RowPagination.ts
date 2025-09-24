import {
  OnChangeFn,
  Table,
  RowModel,
  Updater,
  RowData,
  TableFeature,
} from '../types'
import {
  functionalUpdate,
  getMemoOptions,
  makeStateUpdater,
  memo,
} from '../utils'

export interface PaginationState {
  pageIndex: number
  pageSize: number
}

export interface PaginationTableState {
  pagination: PaginationState
}

export interface PaginationInitialTableState {
  pagination?: Partial<PaginationState>
}

export interface PaginationOptions {
  /**
   * If set to `true`, pagination will be reset to the first page when page-altering state changes eg. `data` is updated, filters change, grouping changes, etc.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#autoresetpageindex)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
   */
  autoResetPageIndex?: boolean
  /**
   * Returns the row model after pagination has taken place, but no further.
   *
   * Pagination columns are automatically reordered by default to the start of the columns list. If you would rather remove them or leave them as-is, set the appropriate mode here.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#getpaginationrowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
   */
  getPaginationRowModel?: (table: Table<any>) => () => RowModel<any>
  /**
   * Enables manual pagination. If this option is set to `true`, the table will not automatically paginate rows using `getPaginationRowModel()` and instead will expect you to manually paginate the rows before passing them to the table. This is useful if you are doing server-side pagination and aggregation.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#manualpagination)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
   */
  manualPagination?: boolean
  /**
   * If this function is provided, it will be called when the pagination state changes and you will be expected to manage the state yourself. You can pass the managed state back to the table via the `tableOptions.state.pagination` option.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#onpaginationchange)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
   */
  onPaginationChange?: OnChangeFn<PaginationState>
  /**
   * When manually controlling pagination, you can supply a total `pageCount` value to the table if you know it (Or supply a `rowCount` and `pageCount` will be calculated). If you do not know how many pages there are, you can set this to `-1`.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#pagecount)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
   */
  pageCount?: number
  /**
   * When manually controlling pagination, you can supply a total `rowCount` value to the table if you know it. The `pageCount` can be calculated from this value and the `pageSize`.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#rowcount)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
   */
  rowCount?: number
}

export interface PaginationDefaultOptions {
  onPaginationChange: OnChangeFn<PaginationState>
}

export interface PaginationInstance<TData extends RowData> {
  _autoResetPageIndex: () => void
  _getPaginationRowModel?: () => RowModel<TData>
  /**
   * Returns whether the table can go to the next page.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#getcannextpage)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
   */
  getCanNextPage: () => boolean
  /**
   * Returns whether the table can go to the previous page.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#getcanpreviouspage)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
   */
  getCanPreviousPage: () => boolean
  /**
   * Returns the page count. If manually paginating or controlling the pagination state, this will come directly from the `options.pageCount` table option, otherwise it will be calculated from the table data using the total row count and current page size.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#getpagecount)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
   */
  getPageCount: () => number
  /**
   * Returns the row count. If manually paginating or controlling the pagination state, this will come directly from the `options.rowCount` table option, otherwise it will be calculated from the table data.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#getrowcount)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
   */
  getRowCount: () => number
  /**
   * Returns an array of page options (zero-index-based) for the current page size.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#getpageoptions)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
   */
  getPageOptions: () => number[]
  /**
   * Returns the row model for the table after pagination has been applied.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#getpaginationrowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
   */
  getPaginationRowModel: () => RowModel<TData>
  /**
   * Returns the row model for the table before any pagination has been applied.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#getprepaginationrowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
   */
  getPrePaginationRowModel: () => RowModel<TData>
  /**
   * Increments the page index by one, if possible.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#nextpage)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
   */
  nextPage: () => void
  /**
   * Decrements the page index by one, if possible.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#previouspage)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
   */
  previousPage: () => void
  /**
   * Sets the page index to `0`.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#firstpage)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
   */
  firstPage: () => void
  /**
   * Sets the page index to the last page.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#lastpage)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
   */
  lastPage: () => void
  /**
   * Resets the page index to its initial state. If `defaultState` is `true`, the page index will be reset to `0` regardless of initial state.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#resetpageindex)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
   */
  resetPageIndex: (defaultState?: boolean) => void
  /**
   * Resets the page size to its initial state. If `defaultState` is `true`, the page size will be reset to `10` regardless of initial state.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#resetpagesize)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
   */
  resetPageSize: (defaultState?: boolean) => void
  /**
   * Resets the **pagination** state to `initialState.pagination`, or `true` can be passed to force a default blank state reset to `[]`.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#resetpagination)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
   */
  resetPagination: (defaultState?: boolean) => void
  /**
   * @deprecated The page count no longer exists in the pagination state. Just pass as a table option instead.
   */
  setPageCount: (updater: Updater<number>) => void
  /**
   * Updates the page index using the provided function or value in the `state.pagination.pageIndex` state.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#setpageindex)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
   */
  setPageIndex: (updater: Updater<number>) => void
  /**
   * Updates the page size using the provided function or value in the `state.pagination.pageSize` state.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#setpagesize)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
   */
  setPageSize: (updater: Updater<number>) => void
  /**
   * Sets or updates the `state.pagination` state.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#setpagination)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
   */
  setPagination: (updater: Updater<PaginationState>) => void
}

//

const defaultPageIndex = 0
const defaultPageSize = 10

const getDefaultPaginationState = (): PaginationState => ({
  pageIndex: defaultPageIndex,
  pageSize: defaultPageSize,
})

export const RowPagination: TableFeature = {
  getInitialState: (state): PaginationTableState => {
    return {
      ...state,
      pagination: {
        ...getDefaultPaginationState(),
        ...state?.pagination,
      },
    }
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): PaginationDefaultOptions => {
    return {
      onPaginationChange: makeStateUpdater('pagination', table),
    }
  },

  createTable: <TData extends RowData>(table: Table<TData>): void => {
    let registered = false
    let queued = false

    table._autoResetPageIndex = () => {
      if (!registered) {
        table._queue(() => {
          registered = true
        })
        return
      }

      if (
        table.getState().pagination &&
        !table.options.manualPagination
      ) {
        if (queued) return
        queued = true
        table._queue(() => {
          if (
            table.options.autoResetAll ??
            table.options.autoResetPageIndex
          ) {
            table.resetPageIndex()
          } else {
            const currentPageIndex = table.getState().pagination.pageIndex
            const lastPageIndex = table.getPageCount() - 1
            if (currentPageIndex > lastPageIndex) {
              table.setPageIndex(lastPageIndex)
            }
          }
          queued = false
        })
      }
    }
    table.setPagination = updater => {
      const safeUpdater: Updater<PaginationState> = old => {
        let newState = functionalUpdate(updater, old)

        return newState
      }

      return table.options.onPaginationChange?.(safeUpdater)
    }
    table.resetPagination = defaultState => {
      table.setPagination(
        defaultState
          ? getDefaultPaginationState()
          : table.initialState.pagination ?? getDefaultPaginationState()
      )
    }
    table.setPageIndex = updater => {
      table.setPagination(old => {
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
    table.resetPageIndex = defaultState => {
      table.setPageIndex(
        defaultState
          ? defaultPageIndex
          : table.initialState?.pagination?.pageIndex ?? defaultPageIndex
      )
    }
    table.resetPageSize = defaultState => {
      table.setPageSize(
        defaultState
          ? defaultPageSize
          : table.initialState?.pagination?.pageSize ?? defaultPageSize
      )
    }
    table.setPageSize = updater => {
      table.setPagination(old => {
        const pageSize = Math.max(1, functionalUpdate(updater, old.pageSize))
        const topRowIndex = old.pageSize * old.pageIndex!
        const pageIndex = Math.floor(topRowIndex / pageSize)

        return {
          ...old,
          pageIndex,
          pageSize,
        }
      })
    }
    //deprecated
    table.setPageCount = updater =>
      table.setPagination(old => {
        let newPageCount = functionalUpdate(
          updater,
          table.options.pageCount ?? -1
        )

        if (typeof newPageCount === 'number') {
          newPageCount = Math.max(-1, newPageCount)
        }

        return {
          ...old,
          pageCount: newPageCount,
        }
      })

    table.getPageOptions = memo(
      () => [table.getPageCount()],
      pageCount => {
        let pageOptions: number[] = []
        if (pageCount && pageCount > 0) {
          pageOptions = [...new Array(pageCount)].fill(null).map((_, i) => i)
        }
        return pageOptions
      },
      getMemoOptions(table.options, 'debugTable', 'getPageOptions')
    )

    table.getCanPreviousPage = () => table.getState().pagination.pageIndex > 0

    table.getCanNextPage = () => {
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

    table.previousPage = () => {
      return table.setPageIndex(old => old - 1)
    }

    table.nextPage = () => {
      return table.setPageIndex(old => {
        return old + 1
      })
    }

    table.firstPage = () => {
      return table.setPageIndex(0)
    }

    table.lastPage = () => {
      return table.setPageIndex(table.getPageCount() - 1)
    }

    table.getPrePaginationRowModel = () => table.getExpandedRowModel()
    table.getPaginationRowModel = () => {
      if (
        !table._getPaginationRowModel &&
        table.options.getPaginationRowModel
      ) {
        table._getPaginationRowModel =
          table.options.getPaginationRowModel(table)
      }

      if (table.options.manualPagination || !table._getPaginationRowModel) {
        return table.getPrePaginationRowModel()
      }

      return table._getPaginationRowModel()
    }

    table.getPageCount = () => {
      return (
        table.options.pageCount ??
        Math.ceil(table.getRowCount() / table.getState().pagination.pageSize)
      )
    }

    table.getRowCount = () => {
      return (
        table.options.rowCount ?? table.getPrePaginationRowModel().rows.length
      )
    }
  },
}
