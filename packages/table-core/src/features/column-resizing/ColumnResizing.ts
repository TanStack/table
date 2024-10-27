import { assignAPIs, makeStateUpdater } from '../../utils'
import {
  column_getCanResize,
  column_getIsResizing,
  getDefaultColumnResizingState,
  header_getResizeHandler,
  table_resetHeaderSizeInfo,
  table_setColumnResizing,
} from './ColumnResizing.utils'
import type { TableState } from '../../types/TableState'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Header } from '../../types/Header'
import type { Column } from '../../types/Column'
import type {
  ColumnResizingDefaultOptions,
  Column_ColumnResizing,
  Header_ColumnResizing,
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
  getInitialState: <TFeatures extends TableFeatures>(
    state: TableState<TFeatures>,
  ): TableState<TFeatures> => {
    return {
      columnResizing: getDefaultColumnResizingState(),
      ...state,
    }
  },

  getDefaultTableOptions: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    table: Table<TFeatures, TData> & Partial<Table_ColumnResizing>,
  ): ColumnResizingDefaultOptions => {
    return {
      columnResizeMode: 'onEnd',
      columnResizeDirection: 'ltr',
      onColumnResizingChange: makeStateUpdater('columnResizing', table),
    }
  },

  constructColumnAPIs: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column<TFeatures, TData, TValue> & Partial<Column_ColumnResizing>,
  ): void => {
    assignAPIs(column, [
      {
        fn: () => column_getCanResize(column),
      },
      {
        fn: () => column_getIsResizing(column),
      },
    ])
  },

  constructHeaderAPIs: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    header: Header<TFeatures, TData, TValue> & Partial<Header_ColumnResizing>,
  ): void => {
    assignAPIs(header, [
      {
        fn: (_contextDocument) =>
          header_getResizeHandler(header, _contextDocument),
      },
    ])
  },

  constructTableAPIs: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData> & Partial<Table_ColumnResizing>,
  ): void => {
    assignAPIs(table, [
      {
        fn: (updater) => table_setColumnResizing(table, updater),
      },
      {
        fn: (defaultState) => table_resetHeaderSizeInfo(table, defaultState),
      },
    ])
  },
}
