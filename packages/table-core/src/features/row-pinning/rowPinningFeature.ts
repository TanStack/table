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
// import type {
//   Row_RowPinning,
//   TableOptions_RowPinning,
//   TableState_RowPinning,
//   Table_RowPinning,
// } from './rowPinningFeature.types'

interface RowPinningFeatureConstructors<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  // Row: Row_RowPinning
  // Table: Table_RowPinning<TFeatures, RowData>
  // TableOptions: TableOptions_RowPinning<TFeatures, RowData>
  // TableState: TableState_RowPinning
}

export function constructRowPinningFeature<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): TableFeature<RowPinningFeatureConstructors<TFeatures, TData>> {
  return {
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
      assignAPIs('rowPinningFeature', row, [
        {
          fn: () => row_getCanPin(row),
          fnName: 'row_getCanPin',
        },
        {
          fn: () => row_getIsPinned(row),
          fnName: 'row_getIsPinned',
        },
        {
          fn: () => row_getPinnedIndex(row),
          fnName: 'row_getPinnedIndex',
          memoDeps: () => [
            row._table.getRowModel().rows,
            row._table.options.state?.rowPinning,
          ],
        },
        {
          fn: (position, includeLeafRows, includeParentRows) =>
            row_pin(row, position, includeLeafRows, includeParentRows),
          fnName: 'row_pin',
        },
      ])
    },

    constructTableAPIs: (table) => {
      assignAPIs('rowPinningFeature', table, [
        {
          fn: (updater) => table_setRowPinning(table, updater),
          fnName: 'table_setRowPinning',
        },
        {
          fn: (defaultState) => table_resetRowPinning(table, defaultState),
          fnName: 'table_resetRowPinning',
        },
        {
          fn: (position) => table_getIsSomeRowsPinned(table, position),
          fnName: 'table_getIsSomeRowsPinned',
        },
        {
          fn: () => table_getTopRows(table),
          fnName: 'table_getTopRows',
          memoDeps: () => [
            table.getRowModel().rows,
            table.options.state?.rowPinning?.top,
          ],
        },
        {
          fn: () => table_getBottomRows(table),
          fnName: 'table_getBottomRows',
          memoDeps: () => [
            table.getRowModel().rows,
            table.options.state?.rowPinning?.bottom,
          ],
        },
        {
          fn: () => table_getCenterRows(table),
          fnName: 'table_getCenterRows',
          memoDeps: () => [
            table.getRowModel().rows,
            table.options.state?.rowPinning,
          ],
        },
      ])
    },
  }
}

/**
 * The Row Pinning feature adds row pinning state and APIs to the table and row objects.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning)
 * [Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)
 */
export const rowPinningFeature = constructRowPinningFeature()
