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
  constructColumnAPIs: (column) => {
    const { table } = column
    assignAPIs(column, [
      {
        fn: () => column_getFlatColumns(column),
        memoDeps: () => [table.options.columns],
      },
      {
        fn: () => column_getLeafColumns(column),
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
          table.options.state?.columnOrder,
          table.options.state?.grouping,
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
