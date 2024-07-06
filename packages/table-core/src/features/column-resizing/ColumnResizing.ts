import { RowData, Column, Header, Table, TableFeature } from '../../types'
import { makeStateUpdater } from '../../utils'
import {
  ColumnResizingDefaultOptions,
  TableState_ColumnResizing,
} from './ColumnResizing.types'
import {
  column_getCanResize,
  column_getIsResizing,
  getDefaultColumnSizingInfoState,
  header_getResizeHandler,
  table_resetHeaderSizeInfo,
  table_setColumnSizingInfo,
} from './ColumnResizing.utils'

export const ColumnResizing: TableFeature = {
  _getInitialState: (state): TableState_ColumnResizing => {
    return {
      columnSizing: {},
      columnSizingInfo: getDefaultColumnSizingInfoState(),
      ...state,
    }
  },

  _getDefaultOptions: <TData extends RowData>(
    table: Partial<Table<TData>>,
  ): ColumnResizingDefaultOptions => {
    return {
      columnResizeMode: 'onEnd',
      columnResizeDirection: 'ltr',
      onColumnSizingInfoChange: makeStateUpdater('columnSizingInfo', table),
    }
  },

  _createColumn: <TData extends RowData, TValue>(
    column: Column<TData, TValue>,
    table: Table<TData>,
  ): void => {
    column.getCanResize = () => column_getCanResize(table, column)

    column.getIsResizing = () => column_getIsResizing(table, column)
  },

  _createHeader: <TData extends RowData, TValue>(
    header: Header<TData, TValue>,
    table: Table<TData>,
  ): void => {
    header.getResizeHandler = (_contextDocument) =>
      header_getResizeHandler(header, table, _contextDocument)
  },

  _createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setColumnSizingInfo = (updater) =>
      table_setColumnSizingInfo(table, updater)

    table.resetHeaderSizeInfo = (defaultState) =>
      table_resetHeaderSizeInfo(table, defaultState)
  },
}
