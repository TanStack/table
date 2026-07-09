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
  table_getColumnOffsets,
  table_getEndTotalSize,
  table_getStartTotalSize,
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
      // O(1) lookups into the memoized table-level offsets, so no per-column
      // memos here
      column_getStart: {
        fn: (column, position) => column_getStart(column, position),
      },
      column_getAfter: {
        fn: (column, position) => column_getAfter(column, position),
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
        memoDeps: () => [
          table.options.columns,
          table.atoms.columnSizing?.get(),
          table.atoms.columnOrder?.get(),
          table.atoms.columnPinning?.get(),
          table.atoms.columnVisibility?.get(),
          table.atoms.grouping?.get(),
          table.options.groupedColumnMode,
        ],
      },
    })
  },

  constructTableAPIs: (table) => {
    assignTableAPIs('columnSizingFeature', table, {
      table_getColumnOffsets: {
        fn: () => table_getColumnOffsets(table),
        memoDeps: () => [
          table.options.columns,
          table.atoms.columnSizing?.get(),
          table.atoms.columnOrder?.get(),
          table.atoms.columnPinning?.get(),
          table.atoms.columnVisibility?.get(),
          table.atoms.grouping?.get(),
          table.options.groupedColumnMode,
        ],
      },
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
      table_getStartTotalSize: {
        fn: () => table_getStartTotalSize(table),
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
      table_getEndTotalSize: {
        fn: () => table_getEndTotalSize(table),
        memoDeps: () => [
          table.atoms.columnSizing?.get(),
          table.getHeaderGroups(),
        ],
      },
    })
  },
}
