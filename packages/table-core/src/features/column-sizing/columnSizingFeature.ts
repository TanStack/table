import {
  assignPrototypeAPIs,
  assignTableAPIs,
  makeStateUpdater,
} from '../../utils'
import {
  column_getAfter,
  column_getSize,
  column_getStart,
  column_resetSize,
  getDefaultColumnSizingColumnDef,
  getDefaultColumnSizingState,
  header_getSize,
  header_getStart,
  table_getCenterTotalSize,
  table_getLeftTotalSize,
  table_getRightTotalSize,
  table_getTotalSize,
  table_resetColumnSizing,
  table_setColumnSizing,
} from './columnSizingFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'

/**
 * Feature that adds column sizing state, defaults, and size measurement APIs.
 */
export const columnSizingFeature: TableFeature = {
  getInitialState: (initialState) => {
    return {
      columnSizing: getDefaultColumnSizingState(),
      ...initialState,
    }
  },

  getDefaultColumnDef: () => {
    return getDefaultColumnSizingColumnDef()
  },

  getDefaultTableOptions: (table) => {
    return {
      onColumnSizingChange: makeStateUpdater('columnSizing', table),
    }
  },

  assignColumnPrototype: (prototype, table) => {
    assignPrototypeAPIs('columnSizingFeature', prototype, table, {
      column_getSize: {
        fn: (column) => column_getSize(column),
        memoDeps: (column) => [
          table.options.columns,
          table.atoms.columnSizing?.get()?.[column.id], // just this column's size state
        ],
      },
      column_getStart: {
        fn: (column, position) => column_getStart(column, position),
        memoDeps: (column, position) => [
          position,
          table.options.columns,
          table.atoms.columnSizing?.get(),
          table.atoms.columnOrder?.get(),
          table.atoms.columnPinning?.get(),
          table.atoms.columnVisibility?.get(),
        ],
      },
      column_getAfter: {
        fn: (column, position) => column_getAfter(column, position),
        memoDeps: (column, position) => [
          position,
          table.options.columns,
          table.atoms.columnSizing?.get(),
          table.atoms.columnOrder?.get(),
          table.atoms.columnPinning?.get(),
          table.atoms.columnVisibility?.get(),
        ],
      },
      column_resetSize: {
        fn: (column) => column_resetSize(column),
      },
    })
  },

  assignHeaderPrototype: (prototype, table) => {
    assignPrototypeAPIs('columnSizingFeature', prototype, table, {
      header_getSize: {
        fn: (header) => header_getSize(header),
        memoDeps: (header) => [
          table.options.columns,
          header.column.columns.length > 0
            ? table.atoms.columnSizing?.get() // must be all columns (sum child columns)
            : table.atoms.columnSizing?.get()?.[header.column.id], // can just check it's associated column size state
        ],
      },
      header_getStart: {
        fn: (header) => header_getStart(header),
        memoDeps: (header, position) => [
          position,
          table.options.columns,
          table.atoms.columnSizing?.get(),
          table.atoms.columnOrder?.get(),
          table.atoms.columnPinning?.get(),
          table.atoms.columnVisibility?.get(),
        ],
      },
    })
  },

  constructTableAPIs: (table) => {
    assignTableAPIs('columnSizingFeature', table, {
      table_setColumnSizing: {
        fn: (updater) => table_setColumnSizing(table, updater),
      },
      table_resetColumnSizing: {
        fn: (defaultState) => table_resetColumnSizing(table, defaultState),
      },
      table_getTotalSize: {
        fn: () => table_getTotalSize(table),
        memoDeps: () => [
          table.atoms.columnSizing?.get(),
          table.getHeaderGroups(),
        ],
      },
      table_getLeftTotalSize: {
        fn: () => table_getLeftTotalSize(table),
        memoDeps: () => [
          table.atoms.columnSizing?.get(),
          table.getHeaderGroups(),
        ],
      },
      table_getCenterTotalSize: {
        fn: () => table_getCenterTotalSize(table),
        memoDeps: () => [
          table.atoms.columnSizing?.get(),
          table.getHeaderGroups(),
        ],
      },
      table_getRightTotalSize: {
        fn: () => table_getRightTotalSize(table),
        memoDeps: () => [
          table.atoms.columnSizing?.get(),
          table.getHeaderGroups(),
        ],
      },
    })
  },
}
