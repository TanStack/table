import { RowData, Column, Header, Table, TableFeature } from '../../types'
import { getMemoOptions, makeStateUpdater, memo } from '../../utils'
import { column_getVisibleLeafColumns } from '../column-visibility/ColumnVisibility.utils'
import {
  ColumnSizingColumnDef,
  ColumnSizingDefaultOptions,
  ColumnSizingTableState,
} from './ColumnSizing.types'
import {
  column_getAfter,
  column_getCanResize,
  column_getIsResizing,
  column_getSize,
  column_getStart,
  column_resetSize,
  defaultColumnSizing,
  getDefaultColumnSizingInfoState,
  header_getResizeHandler,
  header_getSize,
  header_getStart,
  table_getCenterTotalSize,
  table_getLeftTotalSize,
  table_getRightTotalSize,
  table_getTotalSize,
  table_resetColumnSizing,
  table_resetHeaderSizeInfo,
  table_setColumnSizing,
  table_setColumnSizingInfo,
} from './ColumnSizing.utils'

export const ColumnSizing: TableFeature = {
  _getDefaultColumnDef: (): ColumnSizingColumnDef => {
    return defaultColumnSizing
  },
  _getInitialState: (state): ColumnSizingTableState => {
    return {
      columnSizing: {},
      columnSizingInfo: getDefaultColumnSizingInfoState(),
      ...state,
    }
  },

  _getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): ColumnSizingDefaultOptions => {
    return {
      columnResizeMode: 'onEnd',
      columnResizeDirection: 'ltr',
      onColumnSizingChange: makeStateUpdater('columnSizing', table),
      onColumnSizingInfoChange: makeStateUpdater('columnSizingInfo', table),
    }
  },

  _createColumn: <TData extends RowData, TValue>(
    column: Column<TData, TValue>,
    table: Table<TData>
  ): void => {
    column.getSize = () => column_getSize(column, table)

    column.getStart = memo(
      position => [
        position,
        column_getVisibleLeafColumns(table, position),
        table.getState().columnSizing,
      ],
      (position, columns) => column_getStart(columns, column, position),
      getMemoOptions(table.options, 'debugColumns', 'getStart')
    )

    column.getAfter = memo(
      position => [
        position,
        column_getVisibleLeafColumns(table, position),
        table.getState().columnSizing,
      ],
      (position, columns) => column_getAfter(columns, column, position),
      getMemoOptions(table.options, 'debugColumns', 'getAfter')
    )

    column.resetSize = () => column_resetSize(table, column)

    column.getCanResize = () => column_getCanResize(table, column)

    column.getIsResizing = () => column_getIsResizing(table, column)
  },

  _createHeader: <TData extends RowData, TValue>(
    header: Header<TData, TValue>,
    table: Table<TData>
  ): void => {
    header.getSize = () => header_getSize(header)

    header.getStart = () => header_getStart(header)

    header.getResizeHandler = _contextDocument =>
      header_getResizeHandler(header, table, _contextDocument)
  },

  _createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setColumnSizing = updater => table_setColumnSizing(table, updater)

    table.setColumnSizingInfo = updater =>
      table_setColumnSizingInfo(table, updater)

    table.resetColumnSizing = defaultState =>
      table_resetColumnSizing(table, defaultState)

    table.resetHeaderSizeInfo = defaultState =>
      table_resetHeaderSizeInfo(table, defaultState)

    table.getTotalSize = () => table_getTotalSize(table)

    table.getLeftTotalSize = () => table_getLeftTotalSize(table)

    table.getCenterTotalSize = () => table_getCenterTotalSize(table)

    table.getRightTotalSize = () => table_getRightTotalSize(table)
  },
}
