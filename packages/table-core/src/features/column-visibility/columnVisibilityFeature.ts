import {
  assignPrototypeAPIs,
  assignTableAPIs,
  makeStateUpdater,
} from '../../utils'
import {
  column_getCanHide,
  column_getIsVisible,
  column_getToggleVisibilityHandler,
  column_toggleVisibility,
  getDefaultColumnVisibilityState,
  row_getVisibleCells,
  row_getVisibleCellsByColumnId,
  table_getIsAllColumnsVisible,
  table_getIsSomeColumnsVisible,
  table_getToggleAllColumnsVisibilityHandler,
  table_getVisibleFlatColumns,
  table_getVisibleLeafColumns,
  table_resetColumnVisibility,
  table_setColumnVisibility,
  table_toggleAllColumnsVisible,
} from './columnVisibilityFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'

/**
 * Feature that adds column visibility state and APIs for hiding and showing columns.
 */
export const columnVisibilityFeature: TableFeature = {
  getInitialState: (initialState) => {
    return {
      columnVisibility: getDefaultColumnVisibilityState(),
      ...initialState,
    }
  },

  getDefaultTableOptions: (table) => {
    return {
      onColumnVisibilityChange: makeStateUpdater('columnVisibility', table),
    }
  },

  assignColumnPrototype: (prototype, table) => {
    assignPrototypeAPIs('columnVisibilityFeature', prototype, table, {
      column_getIsVisible: {
        fn: (column) => column_getIsVisible(column),
        memoDeps: (column) => [
          table.options.columns,
          table.atoms.columnVisibility?.get(),
          column.columns,
        ],
      },
      column_getCanHide: {
        fn: (column) => column_getCanHide(column),
      },
      column_getToggleVisibilityHandler: {
        fn: (column) => column_getToggleVisibilityHandler(column),
      },
      column_toggleVisibility: {
        fn: (column, visible) => column_toggleVisibility(column, visible),
      },
    })
  },

  assignRowPrototype: (prototype, table) => {
    assignPrototypeAPIs('columnVisibilityFeature', prototype, table, {
      row_getVisibleCells: {
        fn: (row) => row_getVisibleCells(row),
        memoDeps: (row) => [
          row.getAllCells(),
          table.atoms.columnPinning?.get(),
          table.atoms.columnVisibility?.get(),
        ],
      },
      row_getVisibleCellsByColumnId: {
        fn: (row) => row_getVisibleCellsByColumnId(row),
        memoDeps: (row) => [
          row.getAllCells(),
          table.atoms.columnVisibility?.get(),
        ],
      },
    })
  },

  constructTableAPIs: (table) => {
    assignTableAPIs('columnVisibilityFeature', table, {
      table_getVisibleFlatColumns: {
        fn: () => table_getVisibleFlatColumns(table),
        memoDeps: () => [
          table.atoms.columnVisibility?.get(),
          table.atoms.columnOrder?.get(),
          table.options.columns,
        ],
      },
      table_getVisibleLeafColumns: {
        fn: () => table_getVisibleLeafColumns(table),
        memoDeps: () => [
          table.atoms.columnVisibility?.get(),
          table.atoms.columnOrder?.get(),
          table.options.columns,
        ],
      },
      table_setColumnVisibility: {
        fn: (updater) => table_setColumnVisibility(table, updater),
      },
      table_resetColumnVisibility: {
        fn: (defaultState) => table_resetColumnVisibility(table, defaultState),
      },
      table_toggleAllColumnsVisible: {
        fn: (value) => table_toggleAllColumnsVisible(table, value),
      },
      table_getIsAllColumnsVisible: {
        fn: () => table_getIsAllColumnsVisible(table),
      },
      table_getIsSomeColumnsVisible: {
        fn: () => table_getIsSomeColumnsVisible(table),
      },
      table_getToggleAllColumnsVisibilityHandler: {
        fn: () => table_getToggleAllColumnsVisibilityHandler(table),
      },
    })
  },
}
