import { Row, RowData, Table, TableFeature } from '../../types'
import { getMemoOptions, memo } from '../../utils'
import {
  row_getAllCells,
  row_getAllCellsByColumnId,
  row_getLeafRows,
  row_getParentRow,
  row_getParentRows,
  table_getRow,
  row_getUniqueValues,
  row_getValue,
  row_renderValue,
  table_getRowId,
} from './Rows.utils'

export const Rows: TableFeature = {
  _createRow: <TData extends RowData>(
    row: Row<TData>,
    table: Table<TData>,
  ): void => {
    row._getAllCellsByColumnId = memo(
      () => [row.getAllCells()],
      (allCells) => row_getAllCellsByColumnId(allCells),
      getMemoOptions(table.options, 'debugRows', 'getAllCellsByColumnId'),
    )

    row.getAllCells = memo(
      () => [table.getAllLeafColumns()],
      (leafColumns) => row_getAllCells(row, table, leafColumns),
      getMemoOptions(table.options, 'debugRows', 'getAllCells'),
    )

    row.getLeafRows = () => row_getLeafRows(row)

    row.getParentRow = () => row_getParentRow(row, table)

    row.getParentRows = () => row_getParentRows(row, table)

    row.getUniqueValues = (columnId) =>
      row_getUniqueValues(row, table, columnId)

    row.getValue = (columnId) => row_getValue(row, table, columnId)

    row.renderValue = (columnId) => row_renderValue(row, table, columnId)
  },

  _createTable: <TData extends RowData>(table: Table<TData>): void => {
    table._getRowId = (row: TData, index: number, parent?: Row<TData>) =>
      table_getRowId(row, table, index, parent)

    //in next version, we should just pass in the row model as the optional 2nd arg
    table.getRow = (id: string, searchAll?: boolean) =>
      table_getRow(table, id, searchAll)
  },
}
