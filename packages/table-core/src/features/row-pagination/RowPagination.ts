import { getMemoOptions, makeStateUpdater, memo } from '../../utils'
import {
  getDefaultPaginationState,
  table_autoResetPageIndex,
  table_firstPage,
  table_getCanNextPage,
  table_getCanPreviousPage,
  table_getPageCount,
  table_getPageOptions,
  table_getPaginatedRowModel,
  table_getPrePaginationRowModel,
  table_getRowCount,
  table_lastPage,
  table_nextPage,
  table_previousPage,
  table_resetPageIndex,
  table_resetPageSize,
  table_resetPagination,
  table_setPageIndex,
  table_setPageSize,
  table_setPagination,
} from './RowPagination.utils'
import type {
  PaginationDefaultOptions,
  TableState_RowPagination,
} from './RowPagination.types'
import type { RowData, Table, TableFeature } from '../../types'

export const RowPagination: TableFeature = {
  _getInitialState: (state): TableState_RowPagination => {
    return {
      ...state,
      pagination: {
        ...getDefaultPaginationState(),
        ...state?.pagination,
      },
    }
  },

  _getDefaultOptions: <TData extends RowData>(
    table: Partial<Table<TData>>,
  ): PaginationDefaultOptions => {
    return {
      onPaginationChange: makeStateUpdater('pagination', table),
    }
  },

  _createTable: <TData extends RowData>(table: Table<TData>): void => {
    const registered = false
    const queued = false

    table._autoResetPageIndex = () =>
      table_autoResetPageIndex(table, registered, queued)

    table.setPagination = (updater) => table_setPagination(table, updater)

    table.resetPagination = (defaultState) =>
      table_resetPagination(table, defaultState)

    table.setPageIndex = (updater) => table_setPageIndex(table, updater)

    table.resetPageIndex = (defaultState) =>
      table_resetPageIndex(table, defaultState)

    table.resetPageSize = (defaultState) =>
      table_resetPageSize(table, defaultState)

    table.setPageSize = (updater) => table_setPageSize(table, updater)

    table.getPageOptions = memo(
      () => [table.getPageCount()],
      (pageCount) => table_getPageOptions(pageCount),
      getMemoOptions(table.options, 'debugTable', 'getPageOptions'),
    )

    table.getCanPreviousPage = () => table_getCanPreviousPage(table)

    table.getCanNextPage = () => table_getCanNextPage(table)

    table.previousPage = () => table_previousPage(table)

    table.nextPage = () => table_nextPage(table)

    table.firstPage = () => table_firstPage(table)

    table.lastPage = () => table_lastPage(table)

    table.getPrePaginationRowModel = () => table_getPrePaginationRowModel(table)

    table.getPaginatedRowModel = () => table_getPaginatedRowModel(table)

    table.getPageCount = () => table_getPageCount(table)

    table.getRowCount = () => table_getRowCount(table)
  },
}
