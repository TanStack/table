import { tableMemo } from '../../utils'
import { expandRows } from '../row-expanding/createExpandedRowModel'
import { getDefaultPaginationState } from './rowPaginationFeature.utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { Table_Internal } from '../../types/Table'
import type { Row } from '../../types/Row'
import type { RowData } from '../../types/type-utils'

export function createPaginatedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(): (
  table: Table_Internal<TFeatures, TData>,
) => () => RowModel<TFeatures, TData> {
  return (table) =>
    tableMemo({
      feature: 'rowPaginationFeature',
      table,
      fnName: 'table.getPaginatedRowModel',
      memoDeps: () => [
        table.getPrePaginatedRowModel(),
        table.options.state?.pagination,
        table.options.paginateExpandedRows
          ? table.options.state?.expanded
          : undefined,
      ],
      fn: () => _createPaginatedRowModel(table),
    })
}

function _createPaginatedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  const prePaginatedRowModel = table.getPrePaginatedRowModel()
  const pagination = table.options.state?.pagination

  if (!prePaginatedRowModel.rows.length) {
    return prePaginatedRowModel
  }

  const { pageSize, pageIndex } = pagination ?? getDefaultPaginationState()
  const { rows, flatRows, rowsById } = prePaginatedRowModel
  const pageStart = pageSize * pageIndex
  const pageEnd = pageStart + pageSize

  const paginatedRows = rows.slice(pageStart, pageEnd)

  let paginatedRowModel: RowModel<TFeatures, TData>

  if (!table.options.paginateExpandedRows) {
    paginatedRowModel = expandRows({
      rows: paginatedRows,
      flatRows,
      rowsById,
    })
  } else {
    paginatedRowModel = {
      rows: paginatedRows,
      flatRows,
      rowsById,
    }
  }

  paginatedRowModel.flatRows = []

  const handleRow = (row: Row<TFeatures, TData>) => {
    paginatedRowModel.flatRows.push(row)
    if (row.subRows.length) {
      row.subRows.forEach(handleRow)
    }
  }

  paginatedRowModel.rows.forEach(handleRow)

  return paginatedRowModel
}
