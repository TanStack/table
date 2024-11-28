import { constructRow } from '../rows/constructRow'
import { isDev, tableMemo } from '../../utils'
import { table_autoResetPageIndex } from '../../features/row-pagination/rowPaginationFeature.utils'
import type { Table_Internal } from '../../types/Table'
import type { RowModel } from './coreRowModelsFeature.types'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Row } from '../../types/Row'

export function createCoreRowModel<TFeatures extends TableFeatures>(): (
  table: Table_Internal<TFeatures, any>,
) => () => RowModel<TFeatures, any> {
  return (table: Table_Internal<TFeatures, any>) =>
    tableMemo({
      debug: isDev && (table.options.debugAll ?? table.options.debugTable),
      fnName: 'table.getCoreRowModel',
      memoDeps: () => [table.options.data],
      fn: (data) => _createCoreRowModel(table, data),
      onAfterUpdate: () => table_autoResetPageIndex(table),
    })
}

function _createCoreRowModel<TFeatures extends TableFeatures>(
  table: Table_Internal<TFeatures, any>,
  data: Array<any>,
): {
  rows: Array<Row<TFeatures, any>>
  flatRows: Array<Row<TFeatures, any>>
  rowsById: Record<string, Row<TFeatures, any>>
} {
  const rowModel: RowModel<TFeatures, any> = {
    rows: [],
    flatRows: [],
    rowsById: {},
  }

  const accessRows = (
    originalRows: Array<any>,
    depth = 0,
    parentRow?: Row<TFeatures, any>,
  ): Array<Row<TFeatures, any>> => {
    const rows = [] as Array<Row<TFeatures, any>>

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
