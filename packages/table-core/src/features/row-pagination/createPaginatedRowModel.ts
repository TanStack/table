import { tableMemo } from '../../utils'
import { expandRows } from '../row-expanding/createExpandedRowModel'
import { getDefaultPaginationState } from './rowPaginationFeature.utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { Table } from '../../types/Table'
import type { Row } from '../../types/Row'
import type { RowData } from '../../types/type-utils'

type PaginatedRowModelFeatures = Partial<{
  rowPaginationFeature: TableFeature
  rowExpandingFeature: TableFeature
}>

/**
 * Creates a memoized paginated row model factory.
 *
 * The factory reads the relevant table state atoms and options, then returns a row model function used by the table row-model pipeline.
 */
export function createPaginatedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(): (table: Table<TFeatures, TData>) => () => RowModel<TFeatures, TData> {
  return (table) => {
    const featureTable = table as unknown as Table<
      PaginatedRowModelFeatures,
      TData
    >
    return tableMemo({
      feature: 'rowPaginationFeature',
      table,
      fnName: 'table.getPaginatedRowModel',
      memoDeps: () => [
        table.getPrePaginatedRowModel(),
        featureTable.atoms.pagination?.get(),
        featureTable.options.paginateExpandedRows
          ? featureTable.atoms.expanded?.get()
          : undefined,
      ],
      fn: () => _createPaginatedRowModel(table),
    })
  }
}

function _createPaginatedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(table: Table<TFeatures, TData>): RowModel<TFeatures, TData> {
  const featureTable = table as unknown as Table<
    PaginatedRowModelFeatures,
    TData
  >
  const prePaginatedRowModel = table.getPrePaginatedRowModel()
  const pagination = featureTable.atoms.pagination?.get()

  if (!prePaginatedRowModel.rows.length) {
    return prePaginatedRowModel
  }

  const { pageSize, pageIndex } = pagination ?? getDefaultPaginationState()
  const { rows, flatRows, rowsById } = prePaginatedRowModel
  const pageStart = pageSize * pageIndex
  const pageEnd = pageStart + pageSize

  const paginatedRows = rows.slice(pageStart, pageEnd)

  let paginatedRowModel: RowModel<TFeatures, TData>

  if (!featureTable.options.paginateExpandedRows) {
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
