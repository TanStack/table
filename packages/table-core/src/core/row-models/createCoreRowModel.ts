import { constructRow } from '../rows/constructRow'
import { tableMemo } from '../../utils'
import { table_autoResetPageIndex } from '../../features/row-pagination/rowPaginationFeature.utils'
import type { Table_Internal } from '../../types/Table'
import type { RowModel } from './coreRowModelsFeature.types'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Row } from '../../types/Row'
import type { RowData } from '../../types/type-utils'

export function createCoreRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): (
  table: Table_Internal<TFeatures, TData>,
) => () => RowModel<TFeatures, TData> {
  return (table: Table_Internal<TFeatures, TData>) =>
    tableMemo({
      feature: 'coreRowModelsFeature',
      fn: (data) => _createCoreRowModel(table, data),
      fnName: 'table.getCoreRowModel',
      memoDeps: () => [table.options.data],
      onAfterUpdate: () => table_autoResetPageIndex(table),
      table,
    })
}

function _createCoreRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  data: Array<TData>,
): {
  rows: Array<Row<TFeatures, TData>>
  flatRows: Array<Row<TFeatures, TData>>
  rowsById: Record<string, Row<TFeatures, TData>>
} {
  const rowModel: RowModel<TFeatures, TData> = {
    rows: [],
    flatRows: [],
    rowsById: {},
  }

  const accessRows = (
    originalRows: Array<TData>,
    depth = 0,
    parentRow?: Row<TFeatures, TData>,
  ): Array<Row<TFeatures, TData>> => {
    const rows = [] as Array<Row<TFeatures, TData>>

    for (let i = 0; i < originalRows.length; i++) {
      const originalRow = originalRows[i]!
      // Make the row
      const row = constructRow(
        table,
        table.getRowId(originalRow, i, parentRow),
        originalRow,
        i,
        depth,
        undefined,
        parentRow?.id,
      )

      // Keep track of every row in a flat array
      rowModel.flatRows.push(row)
      // Also keep track of every row by its ID
      rowModel.rowsById[row.id] = row
      // Push table row into parent
      rows.push(row)

      // Get the original subrows
      if (table.options.getSubRows) {
        row.originalSubRows = table.options.getSubRows(originalRow, i)

        // Then recursively access them
        if (row.originalSubRows?.length) {
          row.subRows = accessRows(row.originalSubRows, depth + 1, row)
        }
      }
    }

    return rows
  }

  rowModel.rows = accessRows(data)

  return rowModel
}
