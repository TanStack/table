import { assignAPIs, makeStateUpdater } from '../../utils'
import {
  getDefaultRowSelectionState,
  row_getCanMultiSelect,
  row_getCanSelect,
  row_getCanSelectSubRows,
  row_getIsAllSubRowsSelected,
  row_getIsSelected,
  row_getIsSomeSelected,
  row_getToggleSelectedHandler,
  row_toggleSelected,
  table_getFilteredSelectedRowModel,
  table_getGroupedSelectedRowModel,
  table_getIsAllPageRowsSelected,
  table_getIsAllRowsSelected,
  table_getIsSomePageRowsSelected,
  table_getIsSomeRowsSelected,
  table_getPreSelectedRowModel,
  table_getSelectedRowModel,
  table_getToggleAllPageRowsSelectedHandler,
  table_getToggleAllRowsSelectedHandler,
  table_resetRowSelection,
  table_setRowSelection,
  table_toggleAllPageRowsSelected,
  table_toggleAllRowsSelected,
} from './rowSelectionFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'
// import type {
//   Row_RowSelection,
//   TableOptions_RowSelection,
//   TableState_RowSelection,
//   Table_RowSelection,
// } from './rowSelectionFeature.types'

/**
 * The Row Selection feature adds row selection state and APIs to the table and row objects.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection)
 * [Guide](https://tanstack.com/table/v8/docs/guide/row-selection)
 
 */
export const rowSelectionFeature: TableFeature<{
  // Row: Row_RowSelection
  // Table: Table_RowSelection<TableFeatures, RowData>
  // TableOptions: TableOptions_RowSelection<TableFeatures, RowData>
  // TableState: TableState_RowSelection
}> = {
  getInitialState: (initialState) => {
    return {
      rowSelection: getDefaultRowSelectionState(),
      ...initialState,
    }
  },

  getDefaultTableOptions: (table) => {
    return {
      onRowSelectionChange: makeStateUpdater('rowSelection', table),
      enableRowSelection: true,
      enableMultiRowSelection: true,
      enableSubRowSelection: true,
    }
  },

  constructRowAPIs: (row) => {
    assignAPIs(row, [
      {
        fn: (value, opts) => row_toggleSelected(row, value, opts),
      },
      {
        fn: () => row_getIsSelected(row),
      },
      {
        fn: () => row_getIsSomeSelected(row),
      },
      {
        fn: () => row_getIsAllSubRowsSelected(row),
      },
      {
        fn: () => row_getCanSelect(row),
      },
      {
        fn: () => row_getCanSelectSubRows(row),
      },
      {
        fn: () => row_getCanMultiSelect(row),
      },
      {
        fn: () => row_getToggleSelectedHandler(row),
      },
    ])
  },

  constructTableAPIs: (table) => {
    assignAPIs(table, [
      {
        fn: (updater) => table_setRowSelection(table, updater),
      },
      {
        fn: (defaultState) => table_resetRowSelection(table, defaultState),
      },
      {
        fn: (value) => table_toggleAllRowsSelected(table, value),
      },
      {
        fn: (value) => table_toggleAllPageRowsSelected(table, value),
      },
      {
        fn: () => table_getPreSelectedRowModel(table),
      },
      {
        fn: () => table_getSelectedRowModel(table),
        memoDeps: () => [
          table.options.state?.rowSelection,
          table.getCoreRowModel(),
        ],
      },
      {
        fn: () => table_getFilteredSelectedRowModel(table),
        memoDeps: () => [
          table.options.state?.rowSelection,
          table.getFilteredRowModel(),
        ],
      },
      {
        fn: () => table_getGroupedSelectedRowModel(table),
        memoDeps: () => [
          table.options.state?.rowSelection,
          table.getSortedRowModel(),
        ],
      },
      {
        fn: () => table_getIsAllRowsSelected(table),
      },
      {
        fn: () => table_getIsAllPageRowsSelected(table),
      },
      {
        fn: () => table_getIsSomeRowsSelected(table),
      },
      {
        fn: () => table_getIsSomePageRowsSelected(table),
      },
      {
        fn: () => table_getToggleAllRowsSelectedHandler(table),
      },
      {
        fn: () => table_getToggleAllPageRowsSelectedHandler(table),
      },
    ])
  },
}
