import { getMemoOptions, makeStateUpdater, memo } from '../../utils'
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
  table_makeVisibleColumnsMethod,
  table_resetColumnVisibility,
  table_setColumnVisibility,
  table_toggleAllColumnsVisible,
} from './ColumnVisibility.utils'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Row } from '../../types/Row'
import type { Column } from '../../types/Column'
import type {
  TableState_ColumnVisibility,
  VisibilityDefaultOptions,
} from './ColumnVisibility.types'

export const ColumnVisibility: TableFeature = {
  _getInitialState: (state): TableState_ColumnVisibility => {
    return {
      columnVisibility: {},
      ...state,
    }
  },

  _getDefaultOptions: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Partial<Table<TFeatures, TData>>,
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
    column: Column<TFeatures, TData, TValue>,
    table: Table<TFeatures, TData>,
  ): void => {
    column.toggleVisibility = (value) =>
      column_toggleVisibility(column, table, value)

    column.getIsVisible = () => column_getIsVisible(column, table)

    column.getCanHide = () => column_getCanHide(column, table)

    column.getToggleVisibilityHandler = () =>
      column_getToggleVisibilityHandler(column, table)
  },

  _createRow: <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData>,
    table: Table<TFeatures, TData>,
  ): void => {
    row._getAllVisibleCells = memo(
      () => [row.getAllCells(), table.getState().columnVisibility],
      (cells) => row_getAllVisibleCells(cells, table),
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
    table: Table<TFeatures, TData>,
  ): void => {
    table.getVisibleFlatColumns = table_makeVisibleColumnsMethod(
      table,
      'getVisibleFlatColumns',
      () => table.getAllFlatColumns(),
    )

    table.getVisibleLeafColumns = table_makeVisibleColumnsMethod(
      table,
      'getVisibleLeafColumns',
      () => table.getAllLeafColumns(),
    )

    table.getLeftVisibleLeafColumns = table_makeVisibleColumnsMethod(
      table,
      'getLeftVisibleLeafColumns',
      () => table.getLeftLeafColumns(),
    )

    table.getRightVisibleLeafColumns = table_makeVisibleColumnsMethod(
      table,
      'getRightVisibleLeafColumns',
      () => table.getRightLeafColumns(),
    )

    table.getCenterVisibleLeafColumns = table_makeVisibleColumnsMethod(
      table,
      'getCenterVisibleLeafColumns',
      () => table.getCenterLeafColumns(),
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
