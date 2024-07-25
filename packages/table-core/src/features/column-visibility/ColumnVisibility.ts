import { getMemoOptions, makeStateUpdater, memo } from '../../utils'
import { _table_getState } from '../../core/table/Tables.utils'
import {
  column_getCanHide,
  column_getIsVisible,
  column_getToggleVisibilityHandler,
  column_toggleVisibility,
  row_getAllVisibleCells,
  row_getVisibleCells,
  table_getIsAllColumnsVisible,
  table_getIsSomeColumnsVisible,
  table_getToggleAllColumnsVisibilityHandler,
  table_getVisibleFlatColumns,
  table_resetColumnVisibility,
  table_setColumnVisibility,
  table_toggleAllColumnsVisible,
} from './ColumnVisibility.utils'
import type { Row_RowExpanding } from '../row-expanding/RowExpanding.types'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Row } from '../../types/Row'
import type { Column } from '../../types/Column'
import type {
  Column_ColumnVisibility,
  TableState_ColumnVisibility,
  Table_ColumnVisibility,
  VisibilityDefaultOptions,
} from './ColumnVisibility.types'

/**
 * The Column Visibility feature adds column visibility state and APIs to the table, row, and column objects.
 * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility)
 */
export const ColumnVisibility: TableFeature = {
  _getInitialState: (state): TableState_ColumnVisibility => {
    return {
      columnVisibility: {},
      ...state,
    }
  },

  _getDefaultOptions: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData> &
      Partial<Table_ColumnVisibility<TFeatures, TData>>,
  ): VisibilityDefaultOptions => {
    return {
      onColumnVisibilityChange: makeStateUpdater('columnVisibility', table),
    }
  },

  _createColumn: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column<TFeatures, TData, TValue> & Partial<Column_ColumnVisibility>,
    table: Table<TFeatures, TData> &
      Partial<Table_ColumnVisibility<TFeatures, TData>>,
  ): void => {
    column.toggleVisibility = (visible) =>
      column_toggleVisibility(column, table, visible)

    column.getIsVisible = () => column_getIsVisible(column, table)

    column.getCanHide = () => column_getCanHide(column, table)

    column.getToggleVisibilityHandler = () =>
      column_getToggleVisibilityHandler(column, table)
  },

  _createRow: <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData> & Partial<Row_RowExpanding>,
    table: Table<TFeatures, TData> &
      Partial<Table_ColumnVisibility<TFeatures, TData>>,
  ): void => {
    row._getAllVisibleCells = memo(
      () => [row.getAllCells(), _table_getState(table).columnVisibility],
      () => row_getAllVisibleCells(row, table),
      getMemoOptions(table.options, 'debugRows', '_getAllVisibleCells'),
    )

    row.getVisibleCells = memo(
      () => [
        row.getLeftVisibleCells(),
        row.getCenterVisibleCells(),
        row.getRightVisibleCells(),
      ],
      (left, center, right) => row_getVisibleCells(left, center, right),
      getMemoOptions(table.options, 'debugRows', 'getVisibleCells'),
    )
  },

  _createTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData> &
      Partial<Table_ColumnVisibility<TFeatures, TData>>,
  ): void => {
    table.getVisibleFlatColumns = memo(
      () => [_table_getState(table).columnVisibility, table.options.columns],
      () => table_getVisibleFlatColumns(table),
      getMemoOptions(table.options, 'debugColumns', 'getVisibleFlatColumns'),
    )

    table.getVisibleLeafColumns = memo(
      () => [_table_getState(table).columnVisibility, table.options.columns],
      () => table_getVisibleFlatColumns(table),
      getMemoOptions(table.options, 'debugColumns', 'getVisibleLeafColumns'),
    )

    table.setColumnVisibility = (updater) =>
      table_setColumnVisibility(table, updater)

    table.resetColumnVisibility = (defaultState) =>
      table_resetColumnVisibility(table, defaultState)

    table.toggleAllColumnsVisible = (value) =>
      table_toggleAllColumnsVisible(table, value)

    table.getIsAllColumnsVisible = () => table_getIsAllColumnsVisible(table)

    table.getIsSomeColumnsVisible = () => table_getIsSomeColumnsVisible(table)

    table.getToggleAllColumnsVisibilityHandler = () =>
      table_getToggleAllColumnsVisibilityHandler(table)
  },
}
