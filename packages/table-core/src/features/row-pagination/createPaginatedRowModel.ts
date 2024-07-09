import { getMemoOptions, memo } from '../../utils'
import { expandRows } from '../row-expanding/createExpandedRowModel'
import type { Row, RowData, RowModel, Table } from '../../types'

export function createPaginatedRowModel<TData extends RowData>(opts?: {
  initialSync: boolean
}): (table: Table<TData>) => () => RowModel<TData> {
  return (table) =>
    memo(
      () => [
        table.getState().pagination,
        table.getPrePaginationRowModel(),
        table.options.paginateExpandedRows
          ? undefined
          : table.getState().expanded,
      ],
      (pagination, rowModel) => {
        if (!rowModel.rows.length) {
          return rowModel
        }

        const { pageSize, pageIndex } = pagination
        const { rows, flatRows, rowsById } = rowModel
        const pageStart = pageSize * pageIndex
        const pageEnd = pageStart + pageSize

        const paginatedRows = rows.slice(pageStart, pageEnd)

        let paginatedRowModel: RowModel<TData>

        if (!table.options.paginateExpandedRows) {
          paginatedRowModel = expandRows(
            {
              rows: paginatedRows,
              flatRows,
              rowsById,
            },
            table,
          )
        } else {
          paginatedRowModel = {
            rows: paginatedRows,
            flatRows,
            rowsById,
          }
        }

        paginatedRowModel.flatRows = []

        const handleRow = (row: Row<TData>) => {
          paginatedRowModel.flatRows.push(row)
          if (row.subRows.length) {
            row.subRows.forEach(handleRow)
          }
        }

        paginatedRowModel.rows.forEach(handleRow)

        return paginatedRowModel
      },
      getMemoOptions(table.options, 'debugTable', 'getPaginatedRowModel'),
    )
}
