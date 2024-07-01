import { Table, Column, Row, RowData, TableFeature } from '../../types'
import { getMemoOptions, makeStateUpdater, memo } from '../../utils'
import {
  ColumnPinningDefaultOptions,
  ColumnPinningTableState,
} from './ColumnPinning.types'
import {
  column_getCanPin,
  column_getPinnedIndex,
  column_pin,
  getDefaultColumnPinningState,
  row_getCenterVisibleCells,
  row_getLeftVisibleCells,
  row_getRightVisibleCells,
  table_getCenterLeafColumns,
  table_getIsSomeColumnsPinned,
  table_getLeftLeafColumns,
  table_getRightLeafColumns,
  table_resetColumnPinning,
  table_setColumnPinning,
} from './ColumnPinning.utils'

export const ColumnPinning: TableFeature = {
  _getInitialState: (state): ColumnPinningTableState => {
    return {
      columnPinning: getDefaultColumnPinningState(),
      ...state,
    }
  },

  _getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): ColumnPinningDefaultOptions => {
    return {
      onColumnPinningChange: makeStateUpdater('columnPinning', table),
    }
  },

  _createColumn: <TData extends RowData, TValue>(
    column: Column<TData, TValue>,
    table: Table<TData>
  ): void => {
    column.pin = position => column_pin(column, table, position)

    column.getCanPin = () => column_getCanPin(column, table)

    column.getPinnedIndex = () => column_getPinnedIndex(column, table)
  },

  _createRow: <TData extends RowData>(
    row: Row<TData>,
    table: Table<TData>
  ): void => {
    row.getCenterVisibleCells = memo(
      () => [
        row._getAllVisibleCells(),
        table.getState().columnPinning.left,
        table.getState().columnPinning.right,
      ],
      (allCells, left, right) =>
        row_getCenterVisibleCells(allCells, left, right),
      getMemoOptions(table.options, 'debugRows', 'getCenterVisibleCells')
    )
    row.getLeftVisibleCells = memo(
      () => [row._getAllVisibleCells(), table.getState().columnPinning.left],
      (allCells, left) => row_getLeftVisibleCells(allCells, left),
      getMemoOptions(table.options, 'debugRows', 'getLeftVisibleCells')
    )
    row.getRightVisibleCells = memo(
      () => [row._getAllVisibleCells(), table.getState().columnPinning.right],
      (allCells, right) => row_getRightVisibleCells(allCells, right),
      getMemoOptions(table.options, 'debugRows', 'getRightVisibleCells')
    )
  },

  _createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setColumnPinning = updater => table_setColumnPinning(table, updater)

    table.resetColumnPinning = defaultState =>
      table_resetColumnPinning(table, defaultState)

    table.getIsSomeColumnsPinned = position =>
      table_getIsSomeColumnsPinned(table, position)

    table.getLeftLeafColumns = memo(
      () => [table.getAllLeafColumns(), table.getState().columnPinning.left],
      (allColumns, left) => table_getLeftLeafColumns(allColumns, left),
      getMemoOptions(table.options, 'debugColumns', 'getLeftLeafColumns')
    )

    table.getRightLeafColumns = memo(
      () => [table.getAllLeafColumns(), table.getState().columnPinning.right],
      (allColumns, right) => table_getRightLeafColumns(allColumns, right),
      getMemoOptions(table.options, 'debugColumns', 'getRightLeafColumns')
    )

    table.getCenterLeafColumns = memo(
      () => [
        table.getAllLeafColumns(),
        table.getState().columnPinning.left,
        table.getState().columnPinning.right,
      ],
      (allColumns, left, right) => table_getCenterLeafColumns(allColumns, left),
      getMemoOptions(table.options, 'debugColumns', 'getCenterLeafColumns')
    )
  },
}
