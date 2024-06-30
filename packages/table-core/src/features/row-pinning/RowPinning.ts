import { Table, Row, RowData, TableFeature } from '../../types'
import { getMemoOptions, makeStateUpdater, memo } from '../../utils'
import {
  RowPinningDefaultOptions,
  RowPinningTableState,
} from './RowPinning.types'
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
} from './RowPinning.utils'

export const RowPinning: TableFeature = {
  _getInitialState: (state): RowPinningTableState => {
    return {
      rowPinning: getDefaultRowPinningState(),
      ...state,
    }
  },

  _getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): RowPinningDefaultOptions => {
    return {
      onRowPinningChange: makeStateUpdater('rowPinning', table),
    }
  },

  _createRow: <TData extends RowData>(
    row: Row<TData>,
    table: Table<TData>
  ): void => {
    row.getCanPin = () => row_getCanPin(row, table)

    row.getIsPinned = () => row_getIsPinned(row, table)

    row.getPinnedIndex = () => row_getPinnedIndex(row, table)

    row.pin = (position, includeLeafRows, includeParentRows) =>
      row_pin(row, table, position, includeLeafRows, includeParentRows)
  },

  _createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setRowPinning = updater => table.options.onRowPinningChange?.(updater)

    table.resetRowPinning = defaultState =>
      table_resetRowPinning(table, defaultState)

    table.getIsSomeRowsPinned = position =>
      table_getIsSomeRowsPinned(table, position)

    table.getTopRows = memo(
      () => [table.getRowModel().rows, table.getState().rowPinning.top],
      (allRows, topPinnedRowIds) =>
        table_getTopRows(table, allRows, topPinnedRowIds),
      getMemoOptions(table.options, 'debugRows', 'getTopRows')
    )

    table.getBottomRows = memo(
      () => [table.getRowModel().rows, table.getState().rowPinning.bottom],
      (allRows, bottomPinnedRowIds) =>
        table_getBottomRows(table, allRows, bottomPinnedRowIds),
      getMemoOptions(table.options, 'debugRows', 'getBottomRows')
    )

    table.getCenterRows = memo(
      () => [table.getRowModel().rows, table.getState().rowPinning],
      (allRows, rowPinning) => table_getCenterRows(allRows, rowPinning),
      getMemoOptions(table.options, 'debugRows', 'getCenterRows')
    )
  },
}
