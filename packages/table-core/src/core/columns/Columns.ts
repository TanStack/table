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
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Column } from '../../types/Column'

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
      () => [table.options.columns],
      () => column_getFlatColumns(column),
      getMemoOptions(table.options, 'debugColumns', 'column.getFlatColumns'),
    )

    column.getLeafColumns = memo(
      () => [
        table.getState().columnOrder,
        table.getState().grouping,
        table.options.columns,
        table.options.groupedColumnMode,
      ],
      () => column_getLeafColumns(column, table),
      getMemoOptions(table.options, 'debugColumns', 'column.getLeafColumns'),
    )
  },

  _createTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData>,
  ) => {
    table._getDefaultColumnDef = memo(
      () => [table.options.defaultColumn],
      () => table_getDefaultColumnDef(table),
      getMemoOptions(table.options, 'debugColumns', '_getDefaultColumnDef'),
    )

    table.getAllColumns = memo(
      () => [table.options.columns],
      () => table_getAllColumns(table),
      getMemoOptions(table.options, 'debugColumns', 'getAllColumns'),
    )

    table.getAllFlatColumns = memo(
      () => [table.options.columns],
      () => table_getAllFlatColumns(table),
      getMemoOptions(table.options, 'debugColumns', 'getAllFlatColumns'),
    )

    table._getAllFlatColumnsById = memo(
      () => [table.options.columns],
      () => table_getAllFlatColumnsById(table),
      getMemoOptions(table.options, 'debugColumns', 'getAllFlatColumnsById'),
    )

    table.getAllLeafColumns = memo(
      () => [
        table.getState().columnOrder,
        table.getState().grouping,
        table.options.columns,
        table.options.groupedColumnMode,
      ],
      () => table_getAllLeafColumns(table),
      getMemoOptions(table.options, 'debugColumns', 'getAllLeafColumns'),
    )

    table.getColumn = (columnId) => table_getColumn(table, columnId)
  },
}
