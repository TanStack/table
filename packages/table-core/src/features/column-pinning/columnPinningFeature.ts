import { assignAPIs, makeStateUpdater } from '../../utils'
import { table_getVisibleLeafColumns } from '../column-visibility/columnVisibilityFeature.utils'
import {
  column_getCanPin,
  column_getIsPinned,
  column_getPinnedIndex,
  column_pin,
  getDefaultColumnPinningState,
  row_getCenterVisibleCells,
  row_getLeftVisibleCells,
  row_getRightVisibleCells,
  table_getCenterFlatHeaders,
  table_getCenterFooterGroups,
  table_getCenterHeaderGroups,
  table_getCenterLeafColumns,
  table_getCenterLeafHeaders,
  table_getCenterVisibleLeafColumns,
  table_getIsSomeColumnsPinned,
  table_getLeftFlatHeaders,
  table_getLeftFooterGroups,
  table_getLeftHeaderGroups,
  table_getLeftLeafColumns,
  table_getLeftLeafHeaders,
  table_getLeftVisibleLeafColumns,
  table_getRightFlatHeaders,
  table_getRightFooterGroups,
  table_getRightHeaderGroups,
  table_getRightLeafColumns,
  table_getRightLeafHeaders,
  table_getRightVisibleLeafColumns,
  table_resetColumnPinning,
  table_setColumnPinning,
} from './columnPinningFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'
// import type {
//   ColumnDef_ColumnPinning,
//   Column_ColumnPinning,
//   Row_ColumnPinning,
//   TableOptions_ColumnPinning,
//   TableState_ColumnPinning,
//   Table_ColumnPinning,
// } from './columnPinningFeature.types'

/**
 * The Column Pinning feature adds column pinning state and APIs to the table, row, and column objects.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning)
 * [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
 */
export const columnPinningFeature: TableFeature<{
  // Column: Column_ColumnPinning
  // ColumnDef: ColumnDef_ColumnPinning
  // Row: Row_ColumnPinning<TableFeatures, RowData>
  // Table: Table_ColumnPinning<TableFeatures, RowData>
  // TableOptions: TableOptions_ColumnPinning
  // TableState: TableState_ColumnPinning
}> = {
  getInitialState: (initialState) => {
    return {
      ...initialState,
      columnPinning: {
        ...getDefaultColumnPinningState(),
        ...initialState.columnPinning,
      },
    }
  },

  getDefaultTableOptions: (table) => {
    return {
      onColumnPinningChange: makeStateUpdater('columnPinning', table),
    }
  },

  constructColumnAPIs: (column) => {
    assignAPIs(column, [
      {
        fn: (position) => column_pin(column, position),
      },
      {
        fn: () => column_getCanPin(column),
      },
      {
        fn: () => column_getPinnedIndex(column),
      },
      {
        fn: () => column_getIsPinned(column),
      },
    ])
  },

  constructRowAPIs: (row) => {
    assignAPIs(row, [
      {
        fn: () => row_getCenterVisibleCells(row),
        memoDeps: () => [
          row.getAllCells(),
          row.table.options.state?.columnPinning,
          row.table.options.state?.columnVisibility,
        ],
      },
      {
        fn: () => row_getLeftVisibleCells(row),
        memoDeps: () => [
          row.getAllCells(),
          row.table.options.state?.columnPinning?.left,
          row.table.options.state?.columnVisibility,
        ],
      },
      {
        fn: () => row_getRightVisibleCells(row),
        memoDeps: () => [
          row.getAllCells(),
          row.table.options.state?.columnPinning?.right,
          row.table.options.state?.columnVisibility,
        ],
      },
    ])
  },

  constructTableAPIs: (table) => {
    assignAPIs(table, [
      {
        fn: (updater) => table_setColumnPinning(table, updater),
      },
      {
        fn: (defaultState) => table_resetColumnPinning(table, defaultState),
      },
      {
        fn: (position) => table_getIsSomeColumnsPinned(table, position),
      },
      // header groups
      {
        fn: () => table_getLeftHeaderGroups(table),
        memoDeps: () => [
          table.getAllColumns(),
          table_getVisibleLeafColumns(table),
          table.options.state?.columnPinning?.left,
        ],
      },
      {
        fn: () => table_getCenterHeaderGroups(table),
        memoDeps: () => [
          table.getAllColumns(),
          table_getVisibleLeafColumns(table),
          table.options.state?.columnPinning,
        ],
      },
      {
        fn: () => table_getRightHeaderGroups(table),
        memoDeps: () => [
          table.getAllColumns(),
          table_getVisibleLeafColumns(table),
          table.options.state?.columnPinning?.right,
        ],
      },
      // footer groups
      {
        fn: () => table_getLeftFooterGroups(table),
        memoDeps: () => [table_getLeftHeaderGroups(table)],
      },
      {
        fn: () => table_getCenterFooterGroups(table),
        memoDeps: () => [table_getCenterHeaderGroups(table)],
      },
      {
        fn: () => table_getRightFooterGroups(table),
        memoDeps: () => [table_getRightHeaderGroups(table)],
      },
      // flat headers
      {
        fn: () => table_getLeftFlatHeaders(table),
        memoDeps: () => [table_getLeftHeaderGroups(table)],
      },
      {
        fn: () => table_getRightFlatHeaders(table),
        memoDeps: () => [table_getRightHeaderGroups(table)],
      },
      {
        fn: () => table_getCenterFlatHeaders(table),
        memoDeps: () => [table_getCenterHeaderGroups(table)],
      },
      // leaf headers
      {
        fn: () => table_getLeftLeafHeaders(table),
        memoDeps: () => [table_getLeftHeaderGroups(table)],
      },
      {
        fn: () => table_getRightLeafHeaders(table),
        memoDeps: () => [table_getRightHeaderGroups(table)],
      },
      {
        fn: () => table_getCenterLeafHeaders(table),
        memoDeps: () => [table_getCenterHeaderGroups(table)],
      },
      // leaf columns
      {
        fn: () => table_getLeftLeafColumns(table),
        memoDeps: () => [
          table.options.columns,
          table.options.state?.columnPinning,
        ],
      },
      {
        fn: () => table_getRightLeafColumns(table),
        memoDeps: () => [
          table.options.columns,
          table.options.state?.columnPinning,
        ],
      },
      {
        fn: () => table_getCenterLeafColumns(table),
        memoDeps: () => [
          table.options.columns,
          table.options.state?.columnPinning,
        ],
      },
      // visible leaf columns
      {
        fn: () => table_getLeftVisibleLeafColumns(table),
        memoDeps: () => [
          table.options.columns,
          table.options.state?.columnPinning,
          table.options.state?.columnVisibility,
        ],
      },
      {
        fn: () => table_getCenterVisibleLeafColumns(table),
        memoDeps: () => [
          table.options.columns,
          table.options.state?.columnPinning,
          table.options.state?.columnVisibility,
        ],
      },
      {
        fn: () => table_getRightVisibleLeafColumns(table),
        memoDeps: () => [
          table.options.columns,
          table.options.state?.columnPinning,
          table.options.state?.columnVisibility,
        ],
      },
    ])
  },
}