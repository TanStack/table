import { assignAPIs, makeStateUpdater } from '../../utils'
import {
  column_getCanResize,
  column_getIsResizing,
  getDefaultColumnSizingInfoState,
  header_getResizeHandler,
  table_resetHeaderSizeInfo,
  table_setColumnSizingInfo,
} from './ColumnResizing.utils'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Header } from '../../types/Header'
import type { Column } from '../../types/Column'
import type {
  ColumnResizingDefaultOptions,
  Column_ColumnResizing,
  Header_ColumnResizing,
  TableState_ColumnResizing,
  Table_ColumnResizing,
} from './ColumnResizing.types'

/**
 * The Column Resizing feature adds column resizing state and APIs to the table and column objects.
 *
 * **Note:** This is dependent on the Column Sizing feature.
 * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-resizing)
 * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-resizing)
 */
export const ColumnResizing: TableFeature = {
  _getInitialState: (state): TableState_ColumnResizing => {
    return {
      columnSizingInfo: getDefaultColumnSizingInfoState(),
      ...state,
    }
  },

  _getDefaultOptions: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData> & Partial<Table_ColumnResizing>,
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
    column: Column<TFeatures, TData, TValue> & Partial<Column_ColumnResizing>,
    table: Table<TFeatures, TData> & Partial<Table_ColumnResizing>,
  ): void => {
    // column.getCanResize = () => column_getCanResize(column, table)

    // column.getIsResizing = () => column_getIsResizing(column, table)
    assignAPIs(column, table, [
      {
        fn: () => column_getCanResize(column, table),
      },
    ])
  },

  _createHeader: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    header: Header<TFeatures, TData, TValue> & Partial<Header_ColumnResizing>,
    table: Table<TFeatures, TData> & Partial<Table_ColumnResizing>,
  ): void => {
    // header.getResizeHandler = (_contextDocument) =>
    //   header_getResizeHandler(header, table, _contextDocument)
    assignAPIs(header, table, [
      {
        fn: (_contextDocument) =>
          header_getResizeHandler(header, table, _contextDocument),
      },
    ])
  },

  _createTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData> & Partial<Table_ColumnResizing>,
  ): void => {
    // table.setColumnSizingInfo = (updater) =>
    //   table_setColumnSizingInfo(table, updater)

    // table.resetHeaderSizeInfo = (defaultState) =>
    //   table_resetHeaderSizeInfo(table, defaultState)

    assignAPIs(table, table, [
      {
        fn: (updater) => table_setColumnSizingInfo(table, updater),
      },
      {
        fn: (defaultState) => table_resetHeaderSizeInfo(table, defaultState),
      },
    ])
  },
}
