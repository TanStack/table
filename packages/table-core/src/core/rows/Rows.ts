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
} from './Rows.utils'
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Row } from '../../types/Row'

export const Rows: TableFeature = {
  constructRow: <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData>,
    table: Table<TFeatures, TData>,
  ): void => {
    assignAPIs(row, table, [
      {
        fn: () => row_getAllCellsByColumnId(row, table),
        memoDeps: () => [row.getAllCells()],
      },
      {
        fn: () => row_getAllCells(row, table),
        memoDeps: () => [table.getAllLeafColumns()],
      },
      {
        fn: () => row_getLeafRows(row),
      },
      {
        fn: () => row_getParentRow(row, table),
      },
      {
        fn: () => row_getParentRows(row, table),
      },
      {
        fn: (columnId) => row_getUniqueValues(row, table, columnId),
      },
      {
        fn: (columnId) => row_getValue(row, table, columnId),
      },
      {
        fn: (columnId) => row_renderValue(row, table, columnId),
      },
    ])
  },

  constructTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData>,
  ): void => {
    assignAPIs(table, table, [
      {
        fn: (row, index, parent) => table_getRowId(row, table, index, parent),
      },
      {
        // in next version, we should just pass in the row model as the optional 3rd arg
        fn: (id: string, searchAll?: boolean) =>
          table_getRow(table, id, searchAll),
      },
    ])
  },
}
