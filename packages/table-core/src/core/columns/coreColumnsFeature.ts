import { assignPrototypeAPIs, assignTableAPIs } from '../../utils'
import {
  column_getFlatColumns,
  column_getLeafColumns,
  table_getAllColumns,
  table_getAllFlatColumns,
  table_getAllFlatColumnsById,
  table_getAllLeafColumns,
  table_getAllLeafColumnsById,
  table_getColumn,
  table_getDefaultColumnDef,
} from './coreColumnsFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'

/**
 * Core feature that builds the column tree and exposes table/column column APIs.
 */
export const coreColumnsFeature: TableFeature = {
  assignColumnPrototype: (prototype, table) => {
    assignPrototypeAPIs('coreColumnsFeature', prototype, table, {
      column_getFlatColumns: {
        fn: (column) => column_getFlatColumns(column),
        memoDeps: (column) => [column.table.options.columns],
      },
      column_getLeafColumns: {
        fn: (column) => column_getLeafColumns(column),
        memoDeps: (column) => [
          column.table.atoms.columnOrder?.get(),
          column.table.atoms.grouping?.get(),
          column.table.options.columns,
          column.table.options.groupedColumnMode,
        ],
      },
    })
  },

  constructTableAPIs: (table) => {
    assignTableAPIs('coreColumnsFeature', table, {
      table_getDefaultColumnDef: {
        fn: () => table_getDefaultColumnDef(table),
        memoDeps: () => [table.options.defaultColumn],
      },
      table_getAllColumns: {
        fn: () => table_getAllColumns(table),
        memoDeps: () => [table.options.columns],
      },
      table_getAllFlatColumns: {
        fn: () => table_getAllFlatColumns(table),
        memoDeps: () => [table.options.columns],
      },
      table_getAllFlatColumnsById: {
        fn: () => table_getAllFlatColumnsById(table),
        memoDeps: () => [table.options.columns],
      },
      table_getAllLeafColumns: {
        fn: () => table_getAllLeafColumns(table),
        memoDeps: () => [
          table.atoms.columnOrder?.get(),
          table.atoms.grouping?.get(),
          table.options.columns,
          table.options.groupedColumnMode,
        ],
      },
      table_getAllLeafColumnsById: {
        fn: () => table_getAllLeafColumnsById(table),
        memoDeps: () => [table.getAllLeafColumns()],
      },
      table_getColumn: {
        fn: (columnId) => table_getColumn(table, columnId),
      },
    })
  },
}
