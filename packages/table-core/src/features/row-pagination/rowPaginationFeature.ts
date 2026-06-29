import { assignTableAPIs, makeStateUpdater } from '../../utils'
import {
  getDefaultPaginationState,
  table_autoResetPageIndex,
  table_firstPage,
  table_getCanNextPage,
  table_getCanPreviousPage,
  table_getPageCount,
  table_getPageOptions,
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
} from './rowPaginationFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'

/**
 * Feature that adds pagination state and table APIs for page navigation.
 */
export const rowPaginationFeature: TableFeature = {
  getInitialState: (initialState) => {
    return {
      ...initialState,
      pagination: {
        ...getDefaultPaginationState(),
        ...initialState.pagination,
      },
    }
  },

  getDefaultTableOptions: (table) => {
    return {
      onPaginationChange: makeStateUpdater('pagination', table),
    }
  },

  constructTableAPIs: (table) => {
    assignTableAPIs('rowPaginationFeature', table, {
      table_autoResetPageIndex: {
        fn: () => table_autoResetPageIndex(table),
      },
      table_setPagination: {
        fn: (updater) => table_setPagination(table, updater),
      },
      table_resetPagination: {
        fn: (defaultState) => table_resetPagination(table, defaultState),
      },
      table_setPageIndex: {
        fn: (updater) => table_setPageIndex(table, updater),
      },
      table_resetPageIndex: {
        fn: (defaultState) => table_resetPageIndex(table, defaultState),
      },
      table_setPageSize: {
        fn: (updater) => table_setPageSize(table, updater),
      },
      table_getPageCount: {
        fn: () => table_getPageCount(table),
      },
      table_resetPageSize: {
        fn: (defaultState) => table_resetPageSize(table, defaultState),
      },
      table_getPageOptions: {
        fn: () => table_getPageOptions(table),
      },
      table_getCanPreviousPage: {
        fn: () => table_getCanPreviousPage(table),
      },
      table_getCanNextPage: {
        fn: () => table_getCanNextPage(table),
      },
      table_previousPage: {
        fn: () => table_previousPage(table),
      },
      table_nextPage: {
        fn: () => table_nextPage(table),
      },
      table_firstPage: {
        fn: () => table_firstPage(table),
      },
      table_lastPage: {
        fn: () => table_lastPage(table),
      },
      table_getRowCount: {
        fn: () => table_getRowCount(table),
      },
    })
  },
}
