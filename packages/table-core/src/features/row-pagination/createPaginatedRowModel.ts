import { getMemoOptions, memo } from '../../utils'
import { expandRows } from '../row-expanding/createExpandedRowModel'
import { table_getState } from '../../core/table/Tables.utils'
import {
  getDefaultPaginationState,
  table_getPrePaginationRowModel,
} from './RowPagination.utils'
import type { Fns } from '../../types/Fns'
import type { TableOptions_RowExpanding } from '../row-expanding/RowExpanding.types'
import type { TableOptions_RowPagination } from './RowPagination.types'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../types/RowModel'
import type { Table } from '../../types/Table'
import type { Row } from '../../types/Row'

export function createPaginatedRowModel<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(opts?: {
  initialSync: boolean
}): (
  table: Table<TFeatures, TFns, TData> & {
    options: Partial<TableOptions_RowPagination> &
      Partial<TableOptions_RowExpanding<TFeatures, TFns, TData>>
  },
) => () => RowModel<TFeatures, TFns, TData> {
  return (table) =>
    memo(
      () => [
        table_getState(table).pagination,
        table_getPrePaginationRowModel(table),
        table.options.paginateExpandedRows
          ? undefined
          : table_getState(table).expanded,
      ],
      (pagination, rowModel) => {
        if (!rowModel.rows.length) {
          return rowModel
        }

        const { pageSize, pageIndex } =
          pagination ?? getDefaultPaginationState()
        const { rows, flatRows, rowsById } = rowModel
        const pageStart = pageSize * pageIndex
        const pageEnd = pageStart + pageSize

        const paginatedRows = rows.slice(pageStart, pageEnd)

        let paginatedRowModel: RowModel<TFeatures, TFns, TData>

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

        const handleRow = (row: Row<TFeatures, TFns, TData>) => {
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
