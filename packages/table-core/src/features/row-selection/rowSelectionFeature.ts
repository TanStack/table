import {
  assignPrototypeAPIs,
  assignTableAPIs,
  makeStateUpdater,
} from '../../utils'
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
  table_getSelectedRowIds,
  table_getSelectedRowModel,
  table_getToggleAllPageRowsSelectedHandler,
  table_getToggleAllRowsSelectedHandler,
  table_resetRowSelection,
  table_setRowSelection,
  table_toggleAllPageRowsSelected,
  table_toggleAllRowsSelected,
} from './rowSelectionFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'

/**
 * Feature that adds row selection state and APIs for row and page selection.
 */
export const rowSelectionFeature: TableFeature = {
  initTableInstanceData: (table) => {
    // @ts-expect-error - _lastSelectedRowId is a row selection table instance data
    table._lastSelectedRowId = null
  },

  resetTableInstanceData: (table) => {
    // @ts-expect-error - _lastSelectedRowId is a row selection table instance data
    table._lastSelectedRowId = null
  },

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
      enableRowRangeSelection: true,
      enableSubRowSelection: true,
      isRowRangeSelectionEvent: (event) => {
        const rangeEvent = event as {
          shiftKey?: boolean
          nativeEvent?: { shiftKey?: boolean }
        }
        return Boolean(rangeEvent.shiftKey || rangeEvent.nativeEvent?.shiftKey)
      },
    }
  },

  assignRowPrototype: (prototype, table) => {
    assignPrototypeAPIs('rowSelectionFeature', prototype, table, {
      row_toggleSelected: {
        fn: (row, value, opts) => row_toggleSelected(row, value, opts),
      },
      row_getIsSelected: {
        fn: (row) => row_getIsSelected(row),
      },
      row_getIsSomeSelected: {
        fn: (row) => row_getIsSomeSelected(row),
        memoDeps: (row) => [
          row.subRows,
          row.table.atoms.rowSelection?.get(),
          row.table.options.enableRowSelection,
        ],
      },
      row_getIsAllSubRowsSelected: {
        fn: (row) => row_getIsAllSubRowsSelected(row),
        memoDeps: (row) => [
          row.subRows,
          row.table.atoms.rowSelection?.get(),
          row.table.options.enableRowSelection,
        ],
      },
      row_getCanSelect: {
        fn: (row) => row_getCanSelect(row),
      },
      row_getCanSelectSubRows: {
        fn: (row) => row_getCanSelectSubRows(row),
      },
      row_getCanMultiSelect: {
        fn: (row) => row_getCanMultiSelect(row),
      },
      row_getToggleSelectedHandler: {
        fn: (row, opts) => row_getToggleSelectedHandler(row, opts),
      },
    })
  },

  constructTableAPIs: (table) => {
    assignTableAPIs('rowSelectionFeature', table, {
      table_setRowSelection: {
        fn: (updater) => table_setRowSelection(table, updater),
      },
      table_resetRowSelection: {
        fn: (defaultState) => table_resetRowSelection(table, defaultState),
      },
      table_toggleAllRowsSelected: {
        fn: (value, opts) => table_toggleAllRowsSelected(table, value, opts),
      },
      table_toggleAllPageRowsSelected: {
        fn: (value, opts) =>
          table_toggleAllPageRowsSelected(table, value, opts),
      },
      table_getPreSelectedRowModel: {
        fn: () => table_getPreSelectedRowModel(table),
      },
      table_getSelectedRowModel: {
        fn: () => table_getSelectedRowModel(table),
        memoDeps: () => [
          table.atoms.rowSelection?.get(),
          table.getCoreRowModel(),
        ],
      },
      table_getFilteredSelectedRowModel: {
        fn: () => table_getFilteredSelectedRowModel(table),
        memoDeps: () => [
          table.atoms.rowSelection?.get(),
          table.getFilteredRowModel(),
        ],
      },
      table_getGroupedSelectedRowModel: {
        fn: () => table_getGroupedSelectedRowModel(table),
        memoDeps: () => [
          table.atoms.rowSelection?.get(),
          table.getSortedRowModel(),
        ],
      },
      table_getSelectedRowIds: {
        fn: () => table_getSelectedRowIds(table),
        memoDeps: () => [table.atoms.rowSelection?.get()],
      },
      table_getIsAllRowsSelected: {
        fn: () => table_getIsAllRowsSelected(table),
        memoDeps: () => [
          table.atoms.rowSelection?.get(),
          table.getFilteredRowModel(),
          table.options.enableRowSelection,
        ],
      },
      table_getIsAllPageRowsSelected: {
        fn: () => table_getIsAllPageRowsSelected(table),
        memoDeps: () => [
          table.atoms.rowSelection?.get(),
          table.getPaginatedRowModel(),
          table.options.enableRowSelection,
        ],
      },
      table_getIsSomeRowsSelected: {
        fn: () => table_getIsSomeRowsSelected(table),
        memoDeps: () => [table.atoms.rowSelection?.get()],
      },
      table_getIsSomePageRowsSelected: {
        fn: () => table_getIsSomePageRowsSelected(table),
        memoDeps: () => [
          table.atoms.rowSelection?.get(),
          table.getPaginatedRowModel(),
          table.options.enableRowSelection,
        ],
      },
      table_getToggleAllRowsSelectedHandler: {
        fn: () => table_getToggleAllRowsSelectedHandler(table),
      },
      table_getToggleAllPageRowsSelectedHandler: {
        fn: () => table_getToggleAllPageRowsSelectedHandler(table),
      },
    })
  },
}
