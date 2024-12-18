import { assignAPIs, makeStateUpdater } from '../../utils'
import {
  getDefaultExpandedState,
  row_getCanExpand,
  row_getIsAllParentsExpanded,
  row_getIsExpanded,
  row_getToggleExpandedHandler,
  row_toggleExpanded,
  table_autoResetExpanded,
  table_getCanSomeRowsExpand,
  table_getExpandedDepth,
  table_getIsAllRowsExpanded,
  table_getIsSomeRowsExpanded,
  table_getToggleAllRowsExpandedHandler,
  table_resetExpanded,
  table_setExpanded,
  table_toggleAllRowsExpanded,
} from './rowExpandingFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'
// import type {
//   CachedRowModel_Expanded,
//   CreateRowModel_Expanded,
//   Row_RowExpanding,
//   TableOptions_RowExpanding,
//   TableState_RowExpanding,
//   Table_RowExpanding,
// } from './rowExpandingFeature.types'

/**
 * The Row Expanding feature adds row expanding state and APIs to the table and row objects.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/row-expanding)
 * [Guide](https://tanstack.com/table/v8/docs/guide/row-expanding)
 */
export const rowExpandingFeature: TableFeature<{
  // CachedRowModel: CachedRowModel_Expanded<TableFeatures, RowData>
  // CreateRowModels: CreateRowModel_Expanded<TableFeatures, RowData>
  // Row: Row_RowExpanding
  // Table: Table_RowExpanding<TableFeatures, RowData>
  // TableOptions: TableOptions_RowExpanding<TableFeatures, RowData>
  // TableState: TableState_RowExpanding
}> = {
  getInitialState: (initialState) => {
    return {
      expanded: getDefaultExpandedState(),
      ...initialState,
    }
  },

  getDefaultTableOptions: (table) => {
    return {
      onExpandedChange: makeStateUpdater('expanded', table),
      paginateExpandedRows: true,
    }
  },

  constructRowAPIs: (row) => {
    assignAPIs(row, [
      {
        fn: (expanded) => row_toggleExpanded(row, expanded),
      },
      {
        fn: () => row_getIsExpanded(row),
      },
      {
        fn: () => row_getCanExpand(row),
      },
      {
        fn: () => row_getIsAllParentsExpanded(row),
      },
      {
        fn: () => row_getToggleExpandedHandler(row),
      },
    ])
  },

  constructTableAPIs: (table) => {
    assignAPIs(table, [
      {
        fn: () => table_autoResetExpanded(table),
      },
      {
        fn: (updater) => table_setExpanded(table, updater),
      },
      {
        fn: (expanded) => table_toggleAllRowsExpanded(table, expanded),
      },
      {
        fn: (defaultState) => table_resetExpanded(table, defaultState),
      },
      {
        fn: () => table_getCanSomeRowsExpand(table),
      },
      {
        fn: () => table_getToggleAllRowsExpandedHandler(table),
      },
      {
        fn: () => table_getIsSomeRowsExpanded(table),
      },
      {
        fn: () => table_getIsAllRowsExpanded(table),
      },
      {
        fn: () => table_getExpandedDepth(table),
      },
    ])
  },
}
