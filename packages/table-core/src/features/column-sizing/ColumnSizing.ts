import { assignAPIs, getMemoOptions, makeStateUpdater, memo } from '../../utils'
import { column_getVisibleLeafColumns } from '../column-visibility/ColumnVisibility.utils'
import { _table_getState } from '../../core/table/Tables.utils'
import {
  column_getAfter,
  column_getSize,
  column_getStart,
  column_resetSize,
  getDefaultColumnSizingState,
  header_getSize,
  header_getStart,
  table_getCenterTotalSize,
  table_getLeftTotalSize,
  table_getRightTotalSize,
  table_getTotalSize,
  table_resetColumnSizing,
  table_setColumnSizing,
} from './ColumnSizing.utils'
import type {
  ColumnDef_ColumnSizing,
  ColumnSizingDefaultOptions,
  Column_ColumnSizing,
  Header_ColumnSizing,
  TableState_ColumnSizing,
  Table_ColumnSizing,
} from './ColumnSizing.types'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Header } from '../../types/Header'
import type { Column } from '../../types/Column'

/**
 * The Column Sizing feature adds column sizing state and APIs to the table, header, and column objects.
 *
 * **Note:** This does not include column resizing. The ColumnResizing feature has been split out into its own standalone feature.
 * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing)
 * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)
 */
export const ColumnSizing: TableFeature = {
  _getInitialState: (state): TableState_ColumnSizing => {
    return {
      columnSizing: {},
      ...state,
    }
  },

  _getDefaultColumnDef: (): ColumnDef_ColumnSizing => {
    return getDefaultColumnSizingState()
  },

  _getDefaultOptions: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData> & Partial<Table_ColumnSizing>,
  ): ColumnSizingDefaultOptions => {
    return {
      onColumnSizingChange: makeStateUpdater('columnSizing', table),
    }
  },

  _createColumn: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column<TFeatures, TData, TValue> & Partial<Column_ColumnSizing>,
    table: Table<TFeatures, TData> & Partial<Table_ColumnSizing>,
  ): void => {
    assignAPIs(column, table, [
      {
        fn: () => column_getSize(column, table),
      },
      {
        fn: (position) => column_getStart(column, table, position),
        memoDeps: (position) => [
          position,
          column_getVisibleLeafColumns(table, position),
          _table_getState(table).columnSizing,
        ],
      },
      {
        fn: (position) => column_getAfter(column, table, position),
        memoDeps: (position) => [
          position,
          column_getVisibleLeafColumns(table, position),
          _table_getState(table).columnSizing,
        ],
      },
      {
        fn: () => column_resetSize(table, column),
      },
    ])
  },

  _createHeader: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    header: Header<TFeatures, TData, TValue> & Partial<Header_ColumnSizing>,
    table: Table<TFeatures, TData> & Partial<Table_ColumnSizing>,
  ): void => {
    header.getSize = () => header_getSize(header, table)

    header.getStart = () => header_getStart(header, table)
  },

  _createTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData> & Partial<Table_ColumnSizing>,
  ): void => {
    assignAPIs(table, table, [
      {
        fn: (updater) => table_setColumnSizing(table, updater),
      },
      {
        fn: (defaultState) => table_resetColumnSizing(table, defaultState),
      },
      {
        fn: () => table_getTotalSize(table),
      },
      {
        fn: () => table_getLeftTotalSize(table),
      },
      {
        fn: () => table_getCenterTotalSize(table),
      },
      {
        fn: () => table_getRightTotalSize(table),
      },
    ])
  },
}
