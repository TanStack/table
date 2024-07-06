import { RowData, Column, Header, Table, TableFeature } from '../../types'
import { getMemoOptions, makeStateUpdater, memo } from '../../utils'
import { column_getVisibleLeafColumns } from '../column-visibility/ColumnVisibility.utils'
import {
  ColumnDef_ColumnSizing,
  ColumnSizingDefaultOptions,
  TableState_ColumnSizing,
} from './ColumnSizing.types'
import {
  column_getAfter,
  column_getSize,
  column_getStart,
  column_resetSize,
  defaultColumnSizing,
  header_getSize,
  header_getStart,
  table_getCenterTotalSize,
  table_getLeftTotalSize,
  table_getRightTotalSize,
  table_getTotalSize,
  table_resetColumnSizing,
  table_setColumnSizing,
} from './ColumnSizing.utils'

export const ColumnSizing: TableFeature = {
  _getDefaultColumnDef: (): ColumnDef_ColumnSizing => {
    return defaultColumnSizing
  },
  _getInitialState: (state): TableState_ColumnSizing => {
    return {
      columnSizing: {},
      ...state,
    }
  },

  _getDefaultOptions: <TData extends RowData>(
    table: Partial<Table<TData>>
  ): ColumnSizingDefaultOptions => {
    return {
      onColumnSizingChange: makeStateUpdater('columnSizing', table),
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
  },

  _createHeader: <TData extends RowData, TValue>(
    header: Header<TData, TValue>,
    table: Table<TData>
  ): void => {
    header.getSize = () => header_getSize(header)

    header.getStart = () => header_getStart(header)
  },

  _createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setColumnSizing = updater => table_setColumnSizing(table, updater)

    table.resetColumnSizing = defaultState =>
      table_resetColumnSizing(table, defaultState)

    table.getTotalSize = () => table_getTotalSize(table)

    table.getLeftTotalSize = () => table_getLeftTotalSize(table)

    table.getCenterTotalSize = () => table_getCenterTotalSize(table)

    table.getRightTotalSize = () => table_getRightTotalSize(table)
  },
}
