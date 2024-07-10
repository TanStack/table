import { getMemoOptions, memo } from '../../utils'
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
import type {
  Row,
  RowData,
  Table,
  TableFeature,
  TableFeatures,
} from '../../types'

export const Rows: TableFeature = {
  _createRow: <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData>,
    table: Table<TFeatures, TData>,
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

  _createTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData>,
  ): void => {
    table._getRowId = (
      row: TData,
      index: number,
      parent?: Row<TFeatures, TData>,
    ) => table_getRowId(row, table, index, parent)

    //in next version, we should just pass in the row model as the optional 2nd arg
    table.getRow = (id: string, searchAll?: boolean) =>
      table_getRow(table, id, searchAll)
  },
}
