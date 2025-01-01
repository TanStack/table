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
import type {
  CachedRowModel_Paginated,
  CreateRowModel_Paginated,
  TableOptions_RowPagination,
  TableState_RowPagination,
  Table_RowPagination,
} from './rowPaginationFeature.types'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'

interface RowPaginationFeatureConstructors {
  CachedRowModel: CachedRowModel_Paginated<TableFeatures, RowData>
  CreateRowModels: CreateRowModel_Paginated<TableFeatures, RowData>
  Table: Table_RowPagination<TableFeatures, RowData>
  TableOptions: TableOptions_RowPagination
  TableState: TableState_RowPagination
}

/**
 * The (Row) Pagination feature adds pagination state and APIs to the table object.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination)
 * [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
 */
export const rowPaginationFeature: TableFeature<RowPaginationFeatureConstructors> =
  {
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
      assignAPIs(table, [
        {
          fn: () => table_autoResetPageIndex(table),
        },
        {
          fn: (updater) => table_setPagination(table, updater),
        },
        {
          fn: (defaultState) => table_resetPagination(table, defaultState),
        },
        {
          fn: (updater) => table_setPageIndex(table, updater),
        },
        {
          fn: (defaultState) => table_resetPageIndex(table, defaultState),
        },
        {
          fn: (updater) => table_setPageSize(table, updater),
        },
        {
          fn: () => table_getPageCount(table),
        },
        {
          fn: (defaultState) => table_resetPageSize(table, defaultState),
        },
        {
          fn: () => table_getPageOptions(table),
        },
        {
          fn: () => table_getCanPreviousPage(table),
        },
        {
          fn: () => table_getCanNextPage(table),
        },
        {
          fn: () => table_previousPage(table),
        },
        {
          fn: () => table_nextPage(table),
        },
        {
          fn: () => table_firstPage(table),
        },
        {
          fn: () => table_lastPage(table),
        },
        {
          fn: () => table_getPageCount(table),
        },
        {
          fn: () => table_getRowCount(table),
        },
      ])
    },
  }
