import { getMemoOptions, makeStateUpdater, memo } from '../../utils'
import { column_getVisibleLeafColumns } from '../column-visibility/ColumnVisibility.utils'
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
import type {
  ColumnDef_ColumnSizing,
  ColumnSizingDefaultOptions,
  TableState_ColumnSizing,
} from './ColumnSizing.types'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Header } from '../../types/Header'
import type { Column } from '../../types/Column'

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

  _getDefaultOptions: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Partial<Table<TFeatures, TData>>,
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
    column: Column<TFeatures, TData, TValue>,
    table: Table<TFeatures, TData>,
  ): void => {
    column.getSize = () => column_getSize(column, table)

    column.getStart = memo(
      (position) => [
        position,
        column_getVisibleLeafColumns(table, position),
        table.getState().columnSizing,
      ],
      (position, columns) => column_getStart(columns, column, table, position),
      getMemoOptions(table.options, 'debugColumns', 'getStart'),
    )

    column.getAfter = memo(
      (position) => [
        position,
        column_getVisibleLeafColumns(table, position),
        table.getState().columnSizing,
      ],
      (position, columns) => column_getAfter(columns, column, table, position),
      getMemoOptions(table.options, 'debugColumns', 'getAfter'),
    )

    column.resetSize = () => column_resetSize(table, column)
  },

  _createHeader: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    header: Header<TFeatures, TData, TValue>,
    table: Table<TFeatures, TData>,
  ): void => {
    header.getSize = () => header_getSize(header, table)

    header.getStart = () => header_getStart(header)
  },

  _createTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData>,
  ): void => {
    table.setColumnSizing = (updater) => table_setColumnSizing(table, updater)

    table.resetColumnSizing = (defaultState) =>
      table_resetColumnSizing(table, defaultState)

    table.getTotalSize = () => table_getTotalSize(table)

    table.getLeftTotalSize = () => table_getLeftTotalSize(table)

    table.getCenterTotalSize = () => table_getCenterTotalSize(table)

    table.getRightTotalSize = () => table_getRightTotalSize(table)
  },
}
