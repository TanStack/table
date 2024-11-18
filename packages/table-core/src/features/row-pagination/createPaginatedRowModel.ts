import { isDev, tableMemo } from '../../utils'
import { expandRows } from '../row-expanding/createExpandedRowModel'
import { getDefaultPaginationState } from './rowPaginationFeature.utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/rowModelsFeature.types'
import type { Table_Internal } from '../../types/Table'
import type { Row } from '../../types/Row'

export function createPaginatedRowModel<TFeatures extends TableFeatures>(): (
  table: Table_Internal<TFeatures, any>,
) => () => RowModel<TFeatures, any> {
  return (table) =>
    tableMemo({
      debug: isDev && (table.options.debugAll ?? table.options.debugTable),
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

function _createPaginatedRowModel<TFeatures extends TableFeatures>(
  table: Table_Internal<TFeatures, any>,
): RowModel<TFeatures, any> {
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

  let paginatedRowModel: RowModel<TFeatures, any>

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

  const handleRow = (row: Row<TFeatures, any>) => {
    paginatedRowModel.flatRows.push(row)
    if (row.subRows.length) {
      row.subRows.forEach(handleRow)
    }
  }

  paginatedRowModel.rows.forEach(handleRow)

  return paginatedRowModel
}
