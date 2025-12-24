import { assignAPIs, makeStateUpdater } from '../../utils'
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
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
// import type {
//   CachedRowModel_Paginated,
//   CreateRowModel_Paginated,
//   TableOptions_RowPagination,
//   TableState_RowPagination,
//   Table_RowPagination,
// } from './rowPaginationFeature.types'

interface RowPaginationFeatureConstructors<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  // CachedRowModel: CachedRowModel_Paginated<TFeatures, TData>
  // CreateRowModels: CreateRowModel_Paginated<TFeatures, TData>
  // Table: Table_RowPagination<TFeatures, TData>
  // TableOptions: TableOptions_RowPagination<TFeatures, TData>
  // TableState: TableState_RowPagination
}

export function constructRowPaginationFeature<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): TableFeature<RowPaginationFeatureConstructors<TFeatures, TData>> {
  return {
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
      assignAPIs('rowPaginationFeature', table, {
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
}

/**
 * The (Row) Pagination feature adds pagination state and APIs to the table object.
 */
export const rowPaginationFeature = constructRowPaginationFeature()
