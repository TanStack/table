import {
  assignPrototypeAPIs,
  assignTableAPIs,
  callMemoOrStaticFn,
  makeStateUpdater,
} from '../../utils'
import { table_getVisibleLeafColumns } from '../column-visibility/columnVisibilityFeature.utils'
import {
  column_getCanPin,
  column_getIsPinned,
  column_getPinnedIndex,
  column_pin,
  getDefaultColumnPinningState,
  row_getCenterVisibleCells,
  row_getEndVisibleCells,
  row_getStartVisibleCells,
  table_getCenterFlatHeaders,
  table_getCenterFooterGroups,
  table_getCenterHeaderGroups,
  table_getCenterLeafColumns,
  table_getCenterLeafHeaders,
  table_getCenterVisibleLeafColumns,
  table_getEndFlatHeaders,
  table_getEndFooterGroups,
  table_getEndHeaderGroups,
  table_getEndLeafColumns,
  table_getEndLeafHeaders,
  table_getEndVisibleLeafColumns,
  table_getIsSomeColumnsPinned,
  table_getPinnedLeafColumns,
  table_getPinnedVisibleLeafColumns,
  table_getStartFlatHeaders,
  table_getStartFooterGroups,
  table_getStartHeaderGroups,
  table_getStartLeafColumns,
  table_getStartLeafHeaders,
  table_getStartVisibleLeafColumns,
  table_resetColumnPinning,
  table_setColumnPinning,
} from './columnPinningFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'

/**
 * Feature that adds column pinning state and APIs for start, center, and end regions.
 */
export const columnPinningFeature: TableFeature = {
  getInitialState: (initialState) => {
    return {
      columnPinning: {
        ...getDefaultColumnPinningState(),
        ...initialState.columnPinning,
      },
      ...initialState,
    }
  },

  getDefaultTableOptions: (table) => {
    return {
      onColumnPinningChange: makeStateUpdater('columnPinning', table),
    }
  },

  assignColumnPrototype: (prototype, table) => {
    assignPrototypeAPIs('columnPinningFeature', prototype, table, {
      column_pin: {
        fn: (column, position) => column_pin(column, position),
      },
      column_getCanPin: {
        fn: (column) => column_getCanPin(column),
      },
      column_getPinnedIndex: {
        fn: (column) => column_getPinnedIndex(column),
      },
      column_getIsPinned: {
        fn: (column) => column_getIsPinned(column),
      },
    })
  },

  assignRowPrototype: (prototype, table) => {
    assignPrototypeAPIs('columnPinningFeature', prototype, table, {
      row_getCenterVisibleCells: {
        fn: (row) => row_getCenterVisibleCells(row),
        memoDeps: (row) => [
          row.getAllCells(),
          row.table.atoms.columnPinning?.get(),
          row.table.atoms.columnVisibility?.get(),
        ],
      },
      row_getStartVisibleCells: {
        fn: (row) => row_getStartVisibleCells(row),
        memoDeps: (row) => [
          row.getAllCells(),
          row.table.atoms.columnPinning?.get()?.start,
          row.table.atoms.columnVisibility?.get(),
        ],
      },
      row_getEndVisibleCells: {
        fn: (row) => row_getEndVisibleCells(row),
        memoDeps: (row) => [
          row.getAllCells(),
          row.table.atoms.columnPinning?.get()?.end,
          row.table.atoms.columnVisibility?.get(),
        ],
      },
    })
  },

  constructTableAPIs: (table) => {
    assignTableAPIs('columnPinningFeature', table, {
      table_setColumnPinning: {
        fn: (updater) => table_setColumnPinning(table, updater),
      },
      table_resetColumnPinning: {
        fn: (defaultState) => table_resetColumnPinning(table, defaultState),
      },
      table_getIsSomeColumnsPinned: {
        fn: (position) => table_getIsSomeColumnsPinned(table, position),
      },
      // header groups
      table_getStartHeaderGroups: {
        fn: () => table_getStartHeaderGroups(table),
        memoDeps: () => [
          table.getAllColumns(),
          callMemoOrStaticFn(
            table,
            'getVisibleLeafColumns',
            table_getVisibleLeafColumns,
          ),
          table.atoms.columnPinning?.get()?.start,
          table.atoms.columnOrder?.get(),
        ],
      },
      table_getCenterHeaderGroups: {
        fn: () => table_getCenterHeaderGroups(table),
        memoDeps: () => [
          table.getAllColumns(),
          callMemoOrStaticFn(
            table,
            'getVisibleLeafColumns',
            table_getVisibleLeafColumns,
          ),
          table.atoms.columnPinning?.get(),
          table.atoms.columnOrder?.get(),
        ],
      },
      table_getEndHeaderGroups: {
        fn: () => table_getEndHeaderGroups(table),
        memoDeps: () => [
          table.getAllColumns(),
          callMemoOrStaticFn(
            table,
            'getVisibleLeafColumns',
            table_getVisibleLeafColumns,
          ),
          table.atoms.columnPinning?.get()?.end,
          table.atoms.columnOrder?.get(),
        ],
      },
      // footer groups
      table_getStartFooterGroups: {
        fn: () => table_getStartFooterGroups(table),
        memoDeps: () => [
          callMemoOrStaticFn(
            table,
            'getStartHeaderGroups',
            table_getStartHeaderGroups,
          ),
        ],
      },
      table_getCenterFooterGroups: {
        fn: () => table_getCenterFooterGroups(table),
        memoDeps: () => [
          callMemoOrStaticFn(
            table,
            'getCenterHeaderGroups',
            table_getCenterHeaderGroups,
          ),
        ],
      },
      table_getEndFooterGroups: {
        fn: () => table_getEndFooterGroups(table),
        memoDeps: () => [
          callMemoOrStaticFn(
            table,
            'getEndHeaderGroups',
            table_getEndHeaderGroups,
          ),
        ],
      },
      // flat headers
      table_getStartFlatHeaders: {
        fn: () => table_getStartFlatHeaders(table),
        memoDeps: () => [
          callMemoOrStaticFn(
            table,
            'getStartHeaderGroups',
            table_getStartHeaderGroups,
          ),
        ],
      },
      table_getEndFlatHeaders: {
        fn: () => table_getEndFlatHeaders(table),
        memoDeps: () => [
          callMemoOrStaticFn(
            table,
            'getEndHeaderGroups',
            table_getEndHeaderGroups,
          ),
        ],
      },
      table_getCenterFlatHeaders: {
        fn: () => table_getCenterFlatHeaders(table),
        memoDeps: () => [
          callMemoOrStaticFn(
            table,
            'getCenterHeaderGroups',
            table_getCenterHeaderGroups,
          ),
        ],
      },
      // leaf headers
      table_getStartLeafHeaders: {
        fn: () => table_getStartLeafHeaders(table),
        memoDeps: () => [
          callMemoOrStaticFn(
            table,
            'getStartHeaderGroups',
            table_getStartHeaderGroups,
          ),
        ],
      },
      table_getEndLeafHeaders: {
        fn: () => table_getEndLeafHeaders(table),
        memoDeps: () => [
          callMemoOrStaticFn(
            table,
            'getEndHeaderGroups',
            table_getEndHeaderGroups,
          ),
        ],
      },
      table_getCenterLeafHeaders: {
        fn: () => table_getCenterLeafHeaders(table),
        memoDeps: () => [
          callMemoOrStaticFn(
            table,
            'getCenterHeaderGroups',
            table_getCenterHeaderGroups,
          ),
        ],
      },
      // leaf columns
      table_getStartLeafColumns: {
        fn: () => table_getStartLeafColumns(table),
        memoDeps: () => [
          table.options.columns,
          table.atoms.columnPinning?.get(),
          table.atoms.columnOrder?.get(),
          table.atoms.grouping?.get(),
          table.options.groupedColumnMode,
        ],
      },
      table_getEndLeafColumns: {
        fn: () => table_getEndLeafColumns(table),
        memoDeps: () => [
          table.options.columns,
          table.atoms.columnPinning?.get(),
          table.atoms.columnOrder?.get(),
          table.atoms.grouping?.get(),
          table.options.groupedColumnMode,
        ],
      },
      table_getCenterLeafColumns: {
        fn: () => table_getCenterLeafColumns(table),
        memoDeps: () => [
          table.options.columns,
          table.atoms.columnPinning?.get(),
          table.atoms.columnOrder?.get(),
          table.atoms.grouping?.get(),
          table.options.groupedColumnMode,
        ],
      },
      table_getPinnedLeafColumns: {
        fn: (position) => table_getPinnedLeafColumns(table, position),
        // must not memo here as it's just a shortcut function
      },
      // visible leaf columns
      table_getStartVisibleLeafColumns: {
        fn: () => table_getStartVisibleLeafColumns(table),
        memoDeps: () => [
          table.options.columns,
          table.atoms.columnPinning?.get(),
          table.atoms.columnVisibility?.get(),
          table.atoms.columnOrder?.get(),
          table.atoms.grouping?.get(),
          table.options.groupedColumnMode,
        ],
      },
      table_getCenterVisibleLeafColumns: {
        fn: () => table_getCenterVisibleLeafColumns(table),
        memoDeps: () => [
          table.options.columns,
          table.atoms.columnPinning?.get(),
          table.atoms.columnVisibility?.get(),
          table.atoms.columnOrder?.get(),
          table.atoms.grouping?.get(),
          table.options.groupedColumnMode,
        ],
      },
      table_getEndVisibleLeafColumns: {
        fn: () => table_getEndVisibleLeafColumns(table),
        memoDeps: () => [
          table.options.columns,
          table.atoms.columnPinning?.get(),
          table.atoms.columnVisibility?.get(),
          table.atoms.columnOrder?.get(),
          table.atoms.grouping?.get(),
          table.options.groupedColumnMode,
        ],
      },
      table_getPinnedVisibleLeafColumns: {
        fn: (position) => table_getPinnedVisibleLeafColumns(table, position),
        // must not memo here as it's just a shortcut function
      },
    })
  },
}
