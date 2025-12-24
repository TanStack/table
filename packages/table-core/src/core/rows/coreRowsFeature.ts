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
      assignAPIs('coreRowsFeature', row, {
        row_getAllCellsByColumnId: {
          fn: () => row_getAllCellsByColumnId(row),
          memoDeps: () => [row.getAllCells()],
        },
        row_getAllCells: {
          fn: () => row_getAllCells(row),
          memoDeps: () => [row._table.getAllLeafColumns()],
        },
        row_getLeafRows: {
          fn: () => row_getLeafRows(row),
        },
        row_getParentRow: {
          fn: () => row_getParentRow(row),
        },
        row_getParentRows: {
          fn: () => row_getParentRows(row),
        },
        row_getUniqueValues: {
          fn: (columnId) => row_getUniqueValues(row, columnId),
        },
        row_getValue: {
          fn: (columnId) => row_getValue(row, columnId),
        },
        row_renderValue: {
          fn: (columnId) => row_renderValue(row, columnId),
        },
      })
    },
    constructTableAPIs: (table) => {
      assignAPIs('coreRowsFeature', table, {
        table_getRowId: {
          fn: (originalRow, index, parent) =>
            table_getRowId(originalRow, table, index, parent),
        },
        table_getRow: {
          fn: (id: string, searchAll?: boolean) =>
            table_getRow(table, id, searchAll),
        },
      })
    },
  }
}

/**
 * The Core Rows feature provides the core row functionality.
 */
export const coreRowsFeature = constructCoreRowsFeature()
