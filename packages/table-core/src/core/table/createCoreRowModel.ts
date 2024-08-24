import { _createRow } from '../rows/createRow'
import { _memo, isDev, tableMemo } from '../../utils'
import { table_getRowId } from '../rows/Rows.utils'
import { table_autoResetPageIndex } from '../../features/row-pagination/RowPagination.utils'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../types/RowModel'
import type { Table } from '../../types/Table'
import type { Row } from '../../types/Row'

export function createCoreRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): (table: Table<TFeatures, TData>) => () => RowModel<TFeatures, TData> {
  return (table: Table<TFeatures, TData>) =>
    tableMemo({
      debug: isDev && (table.options.debugAll ?? table.options.debugTable),
      fnName: 'createCoreRowModel',
      memoDeps: () => [table.options.data],
      fn: (data) => _createCoreRowModel(table, data),
      onAfterUpdate: () =>
        queueMicrotask(() => table_autoResetPageIndex(table)),
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

    for (let i = 0; i < originalRows.length; i++) {
      const originalRow = originalRows[i]!
      // Make the row
      const row = _createRow(
        table,
        table_getRowId(originalRow, table, i, parentRow),
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
