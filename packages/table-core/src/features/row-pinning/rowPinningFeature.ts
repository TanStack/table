import { assignAPIs, makeStateUpdater } from '../../utils'
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
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type {
  Row_RowPinning,
  TableOptions_RowPinning,
  TableState_RowPinning,
  Table_RowPinning,
} from './rowPinningFeature.types'

/**
 * The Row Pinning feature adds row pinning state and APIs to the table and row objects.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning)
 * [Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)
 */
export const rowPinningFeature: TableFeature<{
  Row: Row_RowPinning
  Table: Table_RowPinning<TableFeatures, RowData>
  TableOptions: TableOptions_RowPinning<TableFeatures, RowData>
  TableState: TableState_RowPinning
}> = {
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

  constructRowAPIs: (row) => {
    assignAPIs(row, [
      {
        fn: () => row_getCanPin(row),
      },
      {
        fn: () => row_getIsPinned(row),
      },
      {
        fn: () => row_getPinnedIndex(row),
        memoDeps: () => [
          row.table.getRowModel().rows,
          row.table.options.state?.rowPinning,
        ],
      },
      {
        fn: (position, includeLeafRows, includeParentRows) =>
          row_pin(row, position, includeLeafRows, includeParentRows),
      },
    ])
  },

  constructTableAPIs: (table) => {
    assignAPIs(table, [
      {
        fn: (updater) => table_setRowPinning(table, updater),
      },
      {
        fn: (defaultState) => table_resetRowPinning(table, defaultState),
      },
      {
        fn: (position) => table_getIsSomeRowsPinned(table, position),
      },
      {
        fn: () => table_getTopRows(table),
        memoDeps: () => [
          table.getRowModel().rows,
          table.options.state?.rowPinning?.top,
        ],
      },
      {
        fn: () => table_getBottomRows(table),
        memoDeps: () => [
          table.getRowModel().rows,
          table.options.state?.rowPinning?.bottom,
        ],
      },
      {
        fn: () => table_getCenterRows(table),
        memoDeps: () => [
          table.getRowModel().rows,
          table.options.state?.rowPinning,
        ],
      },
    ])
  },
}
