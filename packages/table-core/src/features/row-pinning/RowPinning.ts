import { getMemoOptions, makeStateUpdater, memo } from '../../utils'
import { _table_getState } from '../../core/table/Tables.utils'
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
} from './RowPinning.utils'
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Row } from '../../types/Row'
import type {
  RowPinningDefaultOptions,
  Row_RowPinning,
  TableState_RowPinning,
  Table_RowPinning,
} from './RowPinning.types'

/**
 * The Row Pinning feature adds row pinning state and APIs to the table and row objects.
 * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/row-pinning)
 * @link [Guide](https://tanstack.com/table/v8/docs/guide/row-pinning)
 */
export const RowPinning: TableFeature = {
  _getInitialState: (state): TableState_RowPinning => {
    return {
      rowPinning: getDefaultRowPinningState(),
      ...state,
    }
  },

  _getDefaultOptions: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData> &
      Partial<Table_RowPinning<TFeatures, TData>>,
  ): RowPinningDefaultOptions => {
    return {
      onRowPinningChange: makeStateUpdater('rowPinning', table),
    }
  },

  _createRow: <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData> & Partial<Row_RowPinning>,
    table: Table<TFeatures, TData> &
      Partial<Table_RowPinning<TFeatures, TData>>,
  ): void => {
    row.getCanPin = () => row_getCanPin(row, table)

    row.getIsPinned = () => row_getIsPinned(row, table)

    row.getPinnedIndex = memo(
      () => [table.getRowModel().rows, _table_getState(table).rowPinning],
      () => row_getPinnedIndex(row, table),
      getMemoOptions(table.options, 'debugRows', 'getPinnedIndex'),
    )

    row.pin = (position, includeLeafRows, includeParentRows) =>
      row_pin(row, table, position, includeLeafRows, includeParentRows)
  },

  _createTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData> &
      Partial<Table_RowPinning<TFeatures, TData>>,
  ): void => {
    table.setRowPinning = (updater) => table_setRowPinning(table, updater)

    table.resetRowPinning = (defaultState) =>
      table_resetRowPinning(table, defaultState)

    table.getIsSomeRowsPinned = (position) =>
      table_getIsSomeRowsPinned(table, position)

    table.getTopRows = memo(
      () => [table.getRowModel().rows, _table_getState(table).rowPinning?.top],
      () => table_getTopRows(table),
      getMemoOptions(table.options, 'debugRows', 'getTopRows'),
    )

    table.getBottomRows = memo(
      () => [
        table.getRowModel().rows,
        _table_getState(table).rowPinning?.bottom,
      ],
      () => table_getBottomRows(table),
      getMemoOptions(table.options, 'debugRows', 'getBottomRows'),
    )

    table.getCenterRows = memo(
      () => [table.getRowModel().rows, _table_getState(table).rowPinning],
      () => table_getCenterRows(table),
      getMemoOptions(table.options, 'debugRows', 'getCenterRows'),
    )
  },
}
