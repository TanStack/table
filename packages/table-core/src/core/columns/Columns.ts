import { assignAPIs } from '../../utils'
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
import type { Table_Internal } from '../../types/Table'
import type { Column } from '../../types/Column'

export const Columns: TableFeature = {
  constructColumnAPIs: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column<TFeatures, TData, TValue>,
  ) => {
    const { table } = column
    assignAPIs(column, [
      {
        fn: () => column_getFlatColumns(column),
        memoDeps: () => [table.options.columns],
      },
      {
        fn: () => column_getLeafColumns(column),
        memoDeps: () => [
          table.getState().columnOrder,
          table.getState().grouping,
          table.options.columns,
          table.options.groupedColumnMode,
        ],
      },
    ])
  },

  constructTableAPIs: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table_Internal<TFeatures, TData>,
  ) => {
    assignAPIs(table, [
      {
        fn: () => table_getDefaultColumnDef(table),
        memoDeps: () => [table.options.defaultColumn],
      },
      {
        fn: () => table_getAllColumns(table),
        memoDeps: () => [table.options.columns],
      },
      {
        fn: () => table_getAllFlatColumns(table),
        memoDeps: () => [table.options.columns],
      },
      {
        fn: () => table_getAllFlatColumnsById(table),
        memoDeps: () => [table.options.columns],
      },
      {
        fn: () => table_getAllLeafColumns(table),
        memoDeps: () => [
          table.getState().columnOrder,
          table.getState().grouping,
          table.options.columns,
          table.options.groupedColumnMode,
        ],
      },
      {
        fn: (columnId) => table_getColumn(table, columnId),
      },
    ])
  },
}
