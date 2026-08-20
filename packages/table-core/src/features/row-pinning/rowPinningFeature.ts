import {
  assignPrototypeAPIs,
  assignTableAPIs,
  makeStateUpdater,
} from '../../utils'
import {
  getDefaultRowPinningState,
  row_getCanPin,
  row_getIsPinned,
  row_getPinnedIndex,
  row_pin,
  table_getBottomRows,
  table_getCenterRows,
  table_getIsSomeRowsPinned,
  table_getTopRows,
  table_resetRowPinning,
  table_setRowPinning,
} from './rowPinningFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'

/**
 * Feature that adds row pinning state and APIs for top, center, and bottom rows.
 */
export const rowPinningFeature: TableFeature = {
  getInitialState: (initialState) => {
    return {
      ...initialState,
      rowPinning: {
        ...getDefaultRowPinningState(),
        ...initialState.rowPinning,
      },
    }
  },

  getDefaultTableOptions: (table) => {
    return {
      onRowPinningChange: makeStateUpdater('rowPinning', table),
    }
  },

  assignRowPrototype: (prototype, table) => {
    assignPrototypeAPIs('rowPinningFeature', prototype, table, {
      row_getCanPin: {
        fn: (row) => row_getCanPin(row),
      },
      row_getIsPinned: {
        fn: (row) => row_getIsPinned(row),
      },
      row_getPinnedIndex: {
        fn: (row) => row_getPinnedIndex(row),
        memoDeps: (row) => [
          row.table.getRowModel().rows,
          row.table.atoms.rowPinning?.get(),
        ],
      },
      row_pin: {
        fn: (row, position, includeLeafRows, includeParentRows) =>
          row_pin(row, position, includeLeafRows, includeParentRows),
      },
    })
  },

  constructTableAPIs: (table) => {
    assignTableAPIs('rowPinningFeature', table, {
      table_setRowPinning: {
        fn: (updater) => table_setRowPinning(table, updater),
      },
      table_resetRowPinning: {
        fn: (defaultState) => table_resetRowPinning(table, defaultState),
      },
      table_getIsSomeRowsPinned: {
        fn: (position) => table_getIsSomeRowsPinned(table, position),
      },
      table_getTopRows: {
        fn: () => table_getTopRows(table),
        memoDeps: () => [
          table.getRowModel().rows,
          table.atoms.rowPinning?.get()?.top,
        ],
      },
      table_getBottomRows: {
        fn: () => table_getBottomRows(table),
        memoDeps: () => [
          table.getRowModel().rows,
          table.atoms.rowPinning?.get()?.bottom,
        ],
      },
      table_getCenterRows: {
        fn: () => table_getCenterRows(table),
        memoDeps: () => [
          table.getRowModel().rows,
          table.atoms.rowPinning?.get(),
        ],
      },
    })
  },
}
