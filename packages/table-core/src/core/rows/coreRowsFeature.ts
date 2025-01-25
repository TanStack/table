import { assignAPIs } from '../../utils'
import {
  row_getAllCells,
  row_getAllCellsByColumnId,
  row_getLeafRows,
  row_getParentRow,
  row_getParentRows,
  row_getUniqueValues,
  row_getValue,
  row_renderValue,
  table_getRow,
  table_getRowId,
} from './coreRowsFeature.utils'
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
// import type {
//   Row_Row,
//   TableOptions_Rows,
//   Table_Rows,
// } from './coreRowsFeature.types'

interface CoreRowsFeatureConstructors<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  // Row: Row_Row<TFeatures, TData>
  // TableOptions: TableOptions_Rows<TFeatures, TData>
  // Table: Table_Rows<TFeatures, TData>
}

export function constructCoreRowsFeature<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): TableFeature<CoreRowsFeatureConstructors<TFeatures, TData>> {
  return {
    constructRowAPIs: (row) => {
      assignAPIs('coreRowsFeature', row, [
        {
          fn: () => row_getAllCellsByColumnId(row),
          fnName: 'row_getAllCellsByColumnId',
          memoDeps: () => [row.getAllCells()],
        },
        {
          fn: () => row_getAllCells(row),
          fnName: 'row_getAllCells',
          memoDeps: () => [row._table.getAllLeafColumns()],
        },
        {
          fn: () => row_getLeafRows(row),
          fnName: 'row_getLeafRows',
        },
        {
          fn: () => row_getParentRow(row),
          fnName: 'row_getParentRow',
        },
        {
          fn: () => row_getParentRows(row),
          fnName: 'row_getParentRows',
        },
        {
          fn: (columnId) => row_getUniqueValues(row, columnId),
          fnName: 'row_getUniqueValues',
        },
        {
          fn: (columnId) => row_getValue(row, columnId),
          fnName: 'row_getValue',
        },
        {
          fn: (columnId) => row_renderValue(row, columnId),
          fnName: 'row_renderValue',
        },
      ])
    },

    constructTableAPIs: (table) => {
      assignAPIs('coreRowsFeature', table, [
        {
          fn: (row, index, parent) => table_getRowId(row, table, index, parent),
          fnName: 'table_getRowId',
        },
        {
          fn: (id: string, searchAll?: boolean) =>
            table_getRow(table, id, searchAll),
          fnName: 'table_getRow',
        },
      ])
    },
  }
}

/**
 * The Core Rows feature provides the core row functionality.
 */
export const coreRowsFeature = constructCoreRowsFeature()
