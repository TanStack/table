import { constructRow } from '../rows/constructRow'
import { makeObjectMap, tableMemo } from '../../utils'
import { table_autoResetCellSelection } from '../../features/cell-selection/cellSelectionFeature.utils'
import { table_autoResetPageIndex } from '../../features/row-pagination/rowPaginationFeature.utils'
import { table_autoResetSorting } from '../../features/row-sorting/rowSortingFeature.utils'
import type { Table_Internal } from '../../types/Table'
import type { RowModel } from './coreRowModelsFeature.types'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Row } from '../../types/Row'
import type { RowData } from '../../types/type-utils'

/**
 * Creates a memoized core row model factory.
 *
 * The factory reads the relevant table state atoms and options, then returns a row model function used by the table row-model pipeline.
 */
export function createCoreRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): (
  table: Table_Internal<TFeatures, TData>,
) => () => RowModel<TFeatures, TData> {
  return (table) => {
    return tableMemo({
      feature: 'coreRowModelsFeature',
      table,
      fnName: 'table.getCoreRowModel',
      memoDeps: () => [table.options.data],
      fn: () => _createCoreRowModel(table, table.options.data),
      onAfterUpdate: () => {
        table_autoResetPageIndex(table)
        table_autoResetSorting(table)
        table_autoResetCellSelection(table)
      },
    })
  }
}

function accessRows<TFeatures extends TableFeatures, TData extends RowData>(
  table: Table_Internal<TFeatures, TData>,
  rowModel: RowModel<TFeatures, TData>,
  originalRows: ReadonlyArray<TData>,
  depth = 0,
  parentRow?: Row<TFeatures, TData>,
): Array<Row<TFeatures, TData>> {
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
        row.subRows = accessRows(
          table,
          rowModel,
          row.originalSubRows,
          depth + 1,
          row,
        )
      }
    }
  }

  return rows
}

function _createCoreRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  data: ReadonlyArray<TData>,
): {
  rows: Array<Row<TFeatures, TData>>
  flatRows: Array<Row<TFeatures, TData>>
  rowsById: Record<string, Row<TFeatures, TData>>
} {
  const rowModel: RowModel<TFeatures, TData> = {
    rows: [],
    flatRows: [],
    rowsById: makeObjectMap(),
  }

  rowModel.rows = accessRows(table, rowModel, data)

  return rowModel
}
