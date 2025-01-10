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
} from './coreColumnsFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'

export const coreColumnsFeature: TableFeature<{
  // Column: Column_Column<TableFeatures, RowData, CellData>
  // Table: Table_Columns<TableFeatures, RowData>
  // TableOptions: TableOptions_Columns<TableFeatures, RowData>
}> = {
  feature: 'coreColumnsFeature',

  constructColumnAPIs: (column) => {
    const { _table: table } = column
    assignAPIs('coreColumnsFeature', column, [
      {
        fn: () => column_getFlatColumns(column),
        fnName: 'column_getFlatColumns',
        memoDeps: () => [table.options.columns],
      },
      {
        fn: () => column_getLeafColumns(column),
        fnName: 'column_getLeafColumns',
        memoDeps: () => [
          table.options.state?.columnOrder,
          table.options.state?.grouping,
          table.options.columns,
          table.options.groupedColumnMode,
        ],
      },
    ])
  },

  constructTableAPIs: (table) => {
    assignAPIs('coreColumnsFeature', table, [
      {
        fn: () => table_getDefaultColumnDef(table),
        fnName: 'table_getDefaultColumnDef',
        memoDeps: () => [table.options.defaultColumn],
      },
      {
        fn: () => table_getAllColumns(table),
        fnName: 'table_getAllColumns',
        memoDeps: () => [table.options.columns],
      },
      {
        fn: () => table_getAllFlatColumns(table),
        fnName: 'table_getAllFlatColumns',
        memoDeps: () => [table.options.columns],
      },
      {
        fn: () => table_getAllFlatColumnsById(table),
        fnName: 'table_getAllFlatColumnsById',
        memoDeps: () => [table.options.columns],
      },
      {
        fn: () => table_getAllLeafColumns(table),
        fnName: 'table_getAllLeafColumns',
        memoDeps: () => [
          table.options.state?.columnOrder,
          table.options.state?.grouping,
          table.options.columns,
          table.options.groupedColumnMode,
        ],
      },
      {
        fn: (columnId) => table_getColumn(table, columnId),
        fnName: 'table_getColumn',
      },
    ])
  },
}
