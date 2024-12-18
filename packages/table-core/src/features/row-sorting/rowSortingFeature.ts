import { assignAPIs, makeStateUpdater } from '../../utils'
import {
  column_clearSorting,
  column_getAutoSortDir,
  column_getAutoSortFn,
  column_getCanMultiSort,
  column_getCanSort,
  column_getFirstSortDir,
  column_getIsSorted,
  column_getNextSortingOrder,
  column_getSortFn,
  column_getSortIndex,
  column_getToggleSortingHandler,
  column_toggleSorting,
  getDefaultSortingState,
  table_resetSorting,
  table_setSorting,
} from './rowSortingFeature.utils'
// import type {
//   CachedRowModel_Sorted,
//   ColumnDef_RowSorting,
//   Column_RowSorting,
//   CreateRowModel_Sorted,
//   RowModelFns_RowSorting,
//   TableOptions_RowSorting,
//   TableState_RowSorting,
//   Table_RowSorting,
// } from './rowSortingFeature.types'
import type { TableFeature } from '../../types/TableFeatures'

/**
 * The (Row) Sorting feature adds sorting state and APIs to the table and column objects.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting)
 * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
 */
export const rowSortingFeature: TableFeature<{
  // CachedRowModel: CachedRowModel_Sorted<TableFeatures, RowData>
  // Column: Column_RowSorting<TableFeatures, RowData>
  // ColumnDef: ColumnDef_RowSorting<TableFeatures, RowData>
  // CreateRowModels: CreateRowModel_Sorted<TableFeatures, RowData>
  // RowModelFns: RowModelFns_RowSorting<TableFeatures, RowData>
  // Table: Table_RowSorting<TableFeatures, RowData>
  // TableOptions: TableOptions_RowSorting
  // TableState: TableState_RowSorting
}> = {
  getInitialState: (initialState) => {
    return {
      sorting: getDefaultSortingState(),
      ...initialState,
    }
  },

  getDefaultColumnDef: () => {
    return {
      sortFn: 'auto',
      sortUndefined: 1,
    }
  },

  getDefaultTableOptions: (table) => {
    return {
      onSortingChange: makeStateUpdater('sorting', table),
      isMultiSortEvent: (e: unknown) => {
        return (e as MouseEvent).shiftKey
      },
    }
  },

  constructColumnAPIs: (column) => {
    assignAPIs(column, [
      {
        fn: () => column_getAutoSortFn(column),
      },
      {
        fn: () => column_getAutoSortDir(column),
      },
      {
        fn: () => column_getSortFn(column),
      },
      {
        fn: (desc, multi) => column_toggleSorting(column, desc, multi),
      },
      {
        fn: () => column_getFirstSortDir(column),
      },
      {
        fn: (multi) => column_getNextSortingOrder(column, multi),
      },
      {
        fn: () => column_getCanSort(column),
      },
      {
        fn: () => column_getCanMultiSort(column),
      },
      {
        fn: () => column_getIsSorted(column),
      },
      {
        fn: () => column_getSortIndex(column),
      },
      {
        fn: () => column_clearSorting(column),
      },
      {
        fn: () => column_getToggleSortingHandler(column),
      },
    ])
  },

  constructTableAPIs: (table) => {
    assignAPIs(table, [
      {
        fn: (updater) => table_setSorting(table, updater),
      },
      {
        fn: (defaultState) => table_resetSorting(table, defaultState),
      },
    ])
  },
}
