import { Table, RowModel, TableGenerics, Row, RowData } from '../types'
import { memo } from '../utils'
import { expandRows } from './getExpandedRowModel'

export function getPaginationRowModel<TData extends RowData>(opts?: {
  initialSync: boolean
}): (instance: Table<TData>) => () => RowModel<TData> {
  return instance =>
    memo(
      () => [
        instance.getState().pagination,
        instance.getPrePaginationRowModel(),
      ],
      (pagination, rowModel) => {
        if (!rowModel.rows.length) {
          return rowModel
        }

        const { pageSize, pageIndex } = pagination
        let { rows, flatRows, rowsById } = rowModel
        const pageStart = pageSize * pageIndex
        const pageEnd = pageStart + pageSize

        rows = rows.slice(pageStart, pageEnd)

        let paginatedRowModel: RowModel<TData>

        if (!instance.options.paginateExpandedRows) {
          paginatedRowModel = expandRows(
            {
              rows,
              flatRows,
              rowsById,
            },
            instance
          )
        } else {
          paginatedRowModel = {
            rows,
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
      {
        key: process.env.NODE_ENV === 'development' && 'getPaginationRowModel',
        debug: () => instance.options.debugAll ?? instance.options.debugTable,
      }
    )
}
