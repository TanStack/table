import { getMemoOptions, memo } from '../../utils'
import { _createColumn } from './createColumn'
import {
  column_getFlatColumns,
  column_getLeafColumns,
  table_getAllColumns,
  table_getAllFlatColumns,
  table_getAllFlatColumnsById,
  table_getAllLeafColumns,
  table_getColumn,
  table_getDefaultColumnDef,
} from './Columns.utils'
import type {
  CellData,
  Column,
  RowData,
  Table,
  TableFeature,
  TableFeatures,
} from '../../types'

export const Columns: TableFeature = {
  _createColumn: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column<TFeatures, TData, TValue>,
    table: Table<TFeatures, TData>,
  ) => {
    column.getFlatColumns = memo(
      () => [true],
      () => column_getFlatColumns(column),
      getMemoOptions(table.options, 'debugColumns', 'column.getFlatColumns'),
    )

    //@ts-ignore - don't know
    column.getLeafColumns = memo(
      () => [table._getOrderColumnsFn()],
      (orderColumns) => column_getLeafColumns(column, orderColumns),
      getMemoOptions(table.options, 'debugColumns', 'column.getLeafColumns'),
    )
  },

  _createTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData>,
  ) => {
    table._getDefaultColumnDef = memo(
      () => [table.options.defaultColumn],
      (defaultColumn) => table_getDefaultColumnDef(table, defaultColumn),
      getMemoOptions(table.options, 'debugColumns', '_getDefaultColumnDef'),
    )

    table.getAllColumns = memo(
      () => [table.options.columns],
      (columnDefs) => table_getAllColumns(table, columnDefs),
      getMemoOptions(table.options, 'debugColumns', 'getAllColumns'),
    )

    table.getAllFlatColumns = memo(
      () => [table.getAllColumns()],
      (allColumns) => table_getAllFlatColumns(allColumns),
      getMemoOptions(table.options, 'debugColumns', 'getAllFlatColumns'),
    )

    table._getAllFlatColumnsById = memo(
      () => [table.getAllFlatColumns()],
      (flatColumns) => table_getAllFlatColumnsById(flatColumns),
      getMemoOptions(table.options, 'debugColumns', 'getAllFlatColumnsById'),
    )

    table.getAllLeafColumns = memo(
      () => [table.getAllColumns(), table._getOrderColumnsFn()],
      (allColumns, orderColumns) =>
        table_getAllLeafColumns(allColumns, orderColumns),
      getMemoOptions(table.options, 'debugColumns', 'getAllLeafColumns'),
    )

    table.getColumn = (columnId) => table_getColumn(table, columnId)
  },
}
