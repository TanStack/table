import { constructRow } from '../rows/constructRow'
import { isDev, tableMemo } from '../../utils'
import { table_autoResetPageIndex } from '../../features/row-pagination/RowPagination.utils'
import type { RowModel } from './RowModels.types'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Row } from '../../types/Row'

export function createCoreRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): (table: Table<TFeatures, TData>) => () => RowModel<TFeatures, TData> {
  return (table: Table<TFeatures, TData>) =>
    tableMemo({
      debug: isDev && (table.options.debugAll ?? table.options.debugTable),
      fnName: 'table.getCoreRowModel',
      memoDeps: () => [table.options.data],
      fn: (data) => _createCoreRowModel(table, data),
      onAfterUpdate: () => table_autoResetPageIndex(table),
    })
}

function _createCoreRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData>,
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

    console.time('constructing rows')
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
    console.timeEnd('constructing rows')

    return rows
  }

  rowModel.rows = accessRows(data)

  return rowModel
}
