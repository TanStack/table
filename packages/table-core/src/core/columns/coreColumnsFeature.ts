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
}

/**
 * The Core Columns feature provides the core column functionality.
 */
export const coreColumnsFeature = constructCoreColumnsFeature()
