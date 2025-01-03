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
import type { RowData } from '../../types/type-utils'
import type {
  CachedRowModel_Sorted,
  ColumnDef_RowSorting,
  Column_RowSorting,
  CreateRowModel_Sorted,
  RowModelFns_RowSorting,
  TableOptions_RowSorting,
  TableState_RowSorting,
  Table_RowSorting,
} from './rowSortingFeature.types'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'

interface RowSortingFeatureConstructors {
  CachedRowModel: CachedRowModel_Sorted<TableFeatures, RowData>
  Column: Column_RowSorting<TableFeatures, RowData>
  ColumnDef: ColumnDef_RowSorting<TableFeatures, RowData>
  CreateRowModels: CreateRowModel_Sorted<TableFeatures, RowData>
  RowModelFns: RowModelFns_RowSorting<TableFeatures, RowData>
  Table: Table_RowSorting<TableFeatures, RowData>
  TableOptions: TableOptions_RowSorting
  TableState: TableState_RowSorting
}

/**
 * The (Row) Sorting feature adds sorting state and APIs to the table and column objects.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting)
 * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
 */
export const rowSortingFeature: TableFeature<RowSortingFeatureConstructors> = {
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
        fnName: 'column.getAutoSortFn',
      },
      {
        fn: () => column_getAutoSortDir(column),
        fnName: 'column.getAutoSortDir',
      },
      {
        fn: () => column_getSortFn(column),
        fnName: 'column_getSortFn',
      },
      {
        fn: (desc, multi) => column_toggleSorting(column, desc, multi),
        fnName: 'column_toggleSorting',
      },
      {
        fn: () => column_getFirstSortDir(column),
        fnName: 'column_getFirstSortDir',
      },
      {
        fn: (multi) => column_getNextSortingOrder(column, multi),
        fnName: 'column_getNextSortingOrder',
      },
      {
        fn: () => column_getCanSort(column),
        fnName: 'column_getCanSort',
      },
      {
        fn: () => column_getCanMultiSort(column),
        fnName: 'column_getCanMultiSort',
      },
      {
        fn: () => column_getIsSorted(column),
        fnName: 'column_getIsSorted',
      },
      {
        fn: () => column_getSortIndex(column),
        fnName: 'column_getSortIndex',
      },
      {
        fn: () => column_clearSorting(column),
        fnName: 'column_clearSorting',
      },
      {
        fn: () => column_getToggleSortingHandler(column),
        fnName: 'column_getToggleSortingHandler',
      },
    ])
  },

  constructTableAPIs: (table) => {
    assignAPIs(table, [
      {
        fn: (updater) => table_setSorting(table, updater),
        fnName: 'table_setSorting',
      },
      {
        fn: (defaultState) => table_resetSorting(table, defaultState),
        fnName: 'table_resetSorting',
      },
    ])
  },
}