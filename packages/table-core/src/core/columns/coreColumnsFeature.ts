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
        computed: (column) => {
          void column.table.options.columns
          return column_getFlatColumns(column)
        },
      },
      column_getLeafColumns: {
        computed: (column) => {
          void column.table.atoms.columnOrder?.get()
          void column.table.atoms.grouping?.get()
          void column.table.options.columns
          void column.table.options.groupedColumnMode
          return column_getLeafColumns(column)
        },
      },
    })
  },

  constructTableAPIs: (table) => {
    assignTableAPIs('coreColumnsFeature', table, {
      table_getDefaultColumnDef: {
        computed: () => table_getDefaultColumnDef(table),
      },
      table_getAllColumns: {
        computed: () => table_getAllColumns(table),
      },
      table_getAllFlatColumns: {
        computed: () => table_getAllFlatColumns(table),
      },
      table_getAllFlatColumnsById: {
        computed: () => table_getAllFlatColumnsById(table),
      },
      table_getAllLeafColumns: {
        computed: () => table_getAllLeafColumns(table),
      },
      table_getAllLeafColumnsById: {
        computed: () => table_getAllLeafColumnsById(table),
      },
      table_getColumn: {
        fn: (columnId) => table_getColumn(table, columnId),
      },
    })
  },
}
