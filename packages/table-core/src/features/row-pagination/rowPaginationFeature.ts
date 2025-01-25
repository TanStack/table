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
      assignAPIs('rowPaginationFeature', table, [
        {
          fn: () => table_autoResetPageIndex(table),
          fnName: 'table_autoResetPageIndex',
        },
        {
          fn: (updater) => table_setPagination(table, updater),
          fnName: 'table_setPagination',
        },
        {
          fn: (defaultState) => table_resetPagination(table, defaultState),
          fnName: 'table_resetPagination',
        },
        {
          fn: (updater) => table_setPageIndex(table, updater),
          fnName: 'table_setPageIndex',
        },
        {
          fn: (defaultState) => table_resetPageIndex(table, defaultState),
          fnName: 'table_resetPageIndex',
        },
        {
          fn: (updater) => table_setPageSize(table, updater),
          fnName: 'table_setPageSize',
        },
        {
          fn: () => table_getPageCount(table),
          fnName: 'table_getPageCount',
        },
        {
          fn: (defaultState) => table_resetPageSize(table, defaultState),
          fnName: 'table_resetPageSize',
        },
        {
          fn: () => table_getPageOptions(table),
          fnName: 'table_getPageOptions',
        },
        {
          fn: () => table_getCanPreviousPage(table),
          fnName: 'table_getCanPreviousPage',
        },
        {
          fn: () => table_getCanNextPage(table),
          fnName: 'table_getCanNextPage',
        },
        {
          fn: () => table_previousPage(table),
          fnName: 'table_previousPage',
        },
        {
          fn: () => table_nextPage(table),
          fnName: 'table_nextPage',
        },
        {
          fn: () => table_firstPage(table),
          fnName: 'table_firstPage',
        },
        {
          fn: () => table_lastPage(table),
          fnName: 'table_lastPage',
        },
        {
          fn: () => table_getPageCount(table),
          fnName: 'table_getPageCount',
        },
        {
          fn: () => table_getRowCount(table),
          fnName: 'table_getRowCount',
        },
      ])
    },
  }
}

/**
 * The (Row) Pagination feature adds pagination state and APIs to the table object.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination)
 * [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
 */
export const rowPaginationFeature = constructRowPaginationFeature()
