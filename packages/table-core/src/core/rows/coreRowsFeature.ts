import { assignPrototypeAPIs, assignTableAPIs } from '../../utils'
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
import type { TableFeature } from '../../types/TableFeatures'

/**
 * Core feature that creates row APIs for values, cells, and tree traversal.
 */
export const coreRowsFeature: TableFeature = {
  assignRowPrototype: (prototype, table) => {
    assignPrototypeAPIs('coreRowsFeature', prototype, table, {
      row_getAllCellsByColumnId: {
        fn: (row) => row_getAllCellsByColumnId(row),
        memoDeps: (row) => [row.getAllCells()],
      },
      row_getAllCells: {
        fn: (row) => row_getAllCells(row),
        memoDeps: (row) => [row.table.getAllLeafColumns()],
      },
      row_getLeafRows: {
        fn: (row) => row_getLeafRows(row),
      },
      row_getParentRow: {
        fn: (row) => row_getParentRow(row),
      },
      row_getParentRows: {
        fn: (row) => row_getParentRows(row),
      },
      row_getUniqueValues: {
        fn: (row, columnId) => row_getUniqueValues(row, columnId),
      },
      row_getValue: {
        fn: (row, columnId) => row_getValue(row, columnId),
      },
      row_renderValue: {
        fn: (row, columnId) => row_renderValue(row, columnId),
      },
    })
  },
  constructTableAPIs: (table) => {
    assignTableAPIs('coreRowsFeature', table, {
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
