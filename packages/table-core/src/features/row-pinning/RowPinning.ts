import { getMemoOptions, makeStateUpdater, memo } from '../../utils'
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
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Row } from '../../types/Row'
import type {
  RowPinningDefaultOptions,
  TableState_RowPinning,
} from './RowPinning.types'

export const RowPinning: TableFeature = {
  _getInitialState: (state): TableState_RowPinning => {
    return {
      rowPinning: getDefaultRowPinningState(),
      ...state,
    }
  },

  _getDefaultOptions: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Partial<Table<TFeatures, TData>>,
  ): RowPinningDefaultOptions => {
    return {
      onRowPinningChange: makeStateUpdater('rowPinning', table),
    }
  },

  _createRow: <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData>,
    table: Table<TFeatures, TData>,
  ): void => {
    row.getCanPin = () => row_getCanPin(row, table)

    row.getIsPinned = () => row_getIsPinned(row, table)

    row.getPinnedIndex = memo(
      () => [table.getRowModel().rows, table.getState().rowPinning],
      (allRows, rowPinning) =>
        row_getPinnedIndex(row, table, allRows, rowPinning),
      getMemoOptions(table.options, 'debugRows', 'getPinnedIndex'),
    )

    row.pin = (position, includeLeafRows, includeParentRows) =>
      row_pin(row, table, position, includeLeafRows, includeParentRows)
  },

  _createTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData>,
  ): void => {
    table.setRowPinning = (updater) =>
      table.options.onRowPinningChange?.(updater)

    table.resetRowPinning = (defaultState) =>
      table_resetRowPinning(table, defaultState)

    table.getIsSomeRowsPinned = (position) =>
      table_getIsSomeRowsPinned(table, position)

    table.getTopRows = memo(
      () => [table.getRowModel().rows, table.getState().rowPinning.top],
      (allRows, topPinnedRowIds) =>
        table_getTopRows(table, allRows, topPinnedRowIds),
      getMemoOptions(table.options, 'debugRows', 'getTopRows'),
    )

    table.getBottomRows = memo(
      () => [table.getRowModel().rows, table.getState().rowPinning.bottom],
      (allRows, bottomPinnedRowIds) =>
        table_getBottomRows(table, allRows, bottomPinnedRowIds),
      getMemoOptions(table.options, 'debugRows', 'getBottomRows'),
    )

    table.getCenterRows = memo(
      () => [table.getRowModel().rows, table.getState().rowPinning],
      (allRows, rowPinning) => table_getCenterRows(allRows, rowPinning),
      getMemoOptions(table.options, 'debugRows', 'getCenterRows'),
    )
  },
}
