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
    // @ts-ignore - _lastSelectedRowId is row selection table instance data
    table._lastSelectedRowId = null
  },

  resetTableInstanceData: (table) => {
    // @ts-ignore - _lastSelectedRowId is row selection table instance data
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
        computed: (row) => row_getIsSomeSelected(row),
      },
      row_getIsAllSubRowsSelected: {
        computed: (row) => row_getIsAllSubRowsSelected(row),
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
        computed: () => table_getSelectedRowModel(table),
      },
      table_getFilteredSelectedRowModel: {
        computed: () => table_getFilteredSelectedRowModel(table),
      },
      table_getGroupedSelectedRowModel: {
        computed: () => table_getGroupedSelectedRowModel(table),
      },
      table_getSelectedRowIds: {
        computed: () => table_getSelectedRowIds(table),
      },
      table_getIsAllRowsSelected: {
        computed: () => table_getIsAllRowsSelected(table),
      },
      table_getIsAllPageRowsSelected: {
        computed: () => table_getIsAllPageRowsSelected(table),
      },
      table_getIsSomeRowsSelected: {
        computed: () => table_getIsSomeRowsSelected(table),
      },
      table_getIsSomePageRowsSelected: {
        computed: () => table_getIsSomePageRowsSelected(table),
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
