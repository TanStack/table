import { assignPrototypeAPIs, assignTableAPIs } from '../../utils'
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
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
// import type {
//   Column_Column,
//   TableOptions_Columns,
//   Table_Columns,
// } from './coreColumnsFeature.types'

interface CoreColumnsFeatureConstructors<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  // Column: Column_Column<TFeatures, TData>
  // Table: Table_Columns<TFeatures, TData>
  // TableOptions: TableOptions_Columns<TFeatures, TData>
}

export function constructCoreColumnsFeature<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): TableFeature<CoreColumnsFeatureConstructors<TFeatures, TData>> {
  return {
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
        table_getColumn: {
          fn: (columnId) => table_getColumn(table, columnId),
        },
      })
    },
  }
}

/**
 * The Core Columns feature provides the core column functionality.
 */
export const coreColumnsFeature = constructCoreColumnsFeature()
