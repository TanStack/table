import { makeStateUpdater } from '../../utils'
import {
  column_getCanResize,
  column_getIsResizing,
  getDefaultColumnSizingInfoState,
  header_getResizeHandler,
  table_resetHeaderSizeInfo,
  table_setColumnSizingInfo,
} from './ColumnResizing.utils'
import type {
  CellData,
  Column,
  Header,
  RowData,
  Table,
  TableFeature,
  TableFeatures,
} from '../../types'
import type {
  ColumnResizingDefaultOptions,
  TableState_ColumnResizing,
} from './ColumnResizing.types'

export const ColumnResizing: TableFeature = {
  _getInitialState: (state): TableState_ColumnResizing => {
    return {
      columnSizingInfo: getDefaultColumnSizingInfoState(),
      ...state,
    }
  },

  _getDefaultOptions: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Partial<Table<TFeatures, TData>>,
  ): ColumnResizingDefaultOptions => {
    return {
      columnResizeMode: 'onEnd',
      columnResizeDirection: 'ltr',
      onColumnSizingInfoChange: makeStateUpdater('columnSizingInfo', table),
    }
  },

  _createColumn: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column<TFeatures, TData, TValue>,
    table: Table<TFeatures, TData>,
  ): void => {
    column.getCanResize = () => column_getCanResize(table, column)

    column.getIsResizing = () => column_getIsResizing(table, column)
  },

  _createHeader: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    header: Header<TFeatures, TData, TValue>,
    table: Table<TFeatures, TData>,
  ): void => {
    header.getResizeHandler = (_contextDocument) =>
      header_getResizeHandler(header, table, _contextDocument)
  },

  _createTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData>,
  ): void => {
    table.setColumnSizingInfo = (updater) =>
      table_setColumnSizingInfo(table, updater)

    table.resetHeaderSizeInfo = (defaultState) =>
      table_resetHeaderSizeInfo(table, defaultState)
  },
}
