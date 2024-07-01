import { Table, RowData, TableFeature } from '../../types'
import { getMemoOptions, makeStateUpdater, memo } from '../../utils'
import {
  PaginationDefaultOptions,
  PaginationTableState,
  getDefaultPaginationState,
} from './RowPagination.types'
import {
  table_autoResetPageIndex,
  table_firstPage,
  table_getCanNextPage,
  table_getCanPreviousPage,
  table_getPageCount,
  table_getPageOptions,
  table_getPaginationRowModel,
  table_getPrePaginationRowModel,
  table_getRowCount,
  table_lastPage,
  table_nextPage,
  table_previousPage,
  table_resetPageIndex,
  table_resetPageSize,
  table_resetPagination,
  table_setPageCount,
  table_setPageIndex,
  table_setPageSize,
  table_setPagination,
} from './RowPagination.utils'

export const RowPagination: TableFeature = {
  _getInitialState: (state): PaginationTableState => {
    return {
      ...state,
      pagination: {
        ...getDefaultPaginationState(),
        ...state?.pagination,
      },
    }
  },

  _getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): PaginationDefaultOptions => {
    return {
      onPaginationChange: makeStateUpdater('pagination', table),
    }
  },

  _createTable: <TData extends RowData>(table: Table<TData>): void => {
    let registered = false
    let queued = false

    table._autoResetPageIndex = () =>
      table_autoResetPageIndex(table, registered, queued)

    table.setPagination = updater => table_setPagination(table, updater)

    table.resetPagination = defaultState =>
      table_resetPagination(table, defaultState)

    table.setPageIndex = updater => table_setPageIndex(table, updater)

    table.resetPageIndex = defaultState =>
      table_resetPageIndex(table, defaultState)

    table.resetPageSize = defaultState =>
      table_resetPageSize(table, defaultState)

    table.setPageSize = updater => table_setPageSize(table, updater)

    //deprecated
    table.setPageCount = updater => table_setPageCount(table, updater)

    table.getPageOptions = memo(
      () => [table.getPageCount()],
      pageCount => table_getPageOptions(pageCount),
      getMemoOptions(table.options, 'debugTable', 'getPageOptions')
    )

    table.getCanPreviousPage = () => table_getCanPreviousPage(table)

    table.getCanNextPage = () => table_getCanNextPage(table)

    table.previousPage = () => table_previousPage(table)

    table.nextPage = () => table_nextPage(table)

    table.firstPage = () => table_firstPage(table)

    table.lastPage = () => table_lastPage(table)

    table.getPrePaginationRowModel = () => table_getPrePaginationRowModel(table)

    table.getPaginationRowModel = () => table_getPaginationRowModel(table)

    table.getPageCount = () => table_getPageCount(table)

    table.getRowCount = () => table_getRowCount(table)
  },
}
