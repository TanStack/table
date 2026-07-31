import { constructRow } from '../rows/constructRow'
import { row_setSubRows } from '../rows/subRowsTracking'
import { makeObjectMap, tableMemo } from '../../utils'
import { table_autoResetCellSelection } from '../../features/cell-selection/cellSelectionFeature.utils'
import { table_autoResetPageIndex } from '../../features/row-pagination/rowPaginationFeature.utils'
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
      fn: () => {
        // `data` was the core row model's sole memo dependency before native
        // computeds. Read that slice reactively, then take the other row
        // construction callbacks from the already-installed options source.
        // This preserves the established contract that a render-created but
        // semantically unchanged `getRowId` callback does not rebuild every
        // row, while a later data change still uses the latest callbacks.
        const data = table.options.data
        const { getRowId, getSubRows } = table._reactivity.untrack(() => ({
          getRowId: table.options.getRowId,
          getSubRows: table.options.getSubRows,
        }))
        return _createCoreRowModel(table, data, getRowId, getSubRows)
      },
      onAfterUpdate: () => {
        table_autoResetPageIndex(table)
        // this memo recomputes only when `options.data` changes, which is
        // exactly when id-keyed cell ranges stop being meaningful
        table_autoResetCellSelection(table)
      },
    })
  }
}

function accessRows<TFeatures extends TableFeatures, TData extends RowData>(
  table: Table_Internal<TFeatures, TData>,
  rowModel: RowModel<TFeatures, TData>,
  originalRows: ReadonlyArray<TData>,
  getRowId:
    | ((
        originalRow: TData,
        index: number,
        parent?: Row<TFeatures, TData>,
      ) => string)
    | undefined,
  getSubRows:
    | ((originalRow: TData, index: number) => ReadonlyArray<TData> | undefined)
    | undefined,
  depth = 0,
  parentRow?: Row<TFeatures, TData>,
): Array<Row<TFeatures, TData>> {
  const rows = [] as Array<Row<TFeatures, TData>>

  for (let i = 0; i < originalRows.length; i++) {
    const originalRow = originalRows[i]!
    // Make the row
    const row = constructRow(
      table,
      getRowId?.(originalRow, i, parentRow) ??
        (parentRow ? `${parentRow.id}.${i}` : String(i)),
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
    if (getSubRows) {
      row.originalSubRows = getSubRows(originalRow, i)

      // Then recursively access them
      if (row.originalSubRows?.length) {
        row_setSubRows(
          row,
          accessRows(
            table,
            rowModel,
            row.originalSubRows,
            getRowId,
            getSubRows,
            depth + 1,
            row,
          ),
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
  getRowId:
    | ((
        originalRow: TData,
        index: number,
        parent?: Row<TFeatures, TData>,
      ) => string)
    | undefined,
  getSubRows:
    | ((originalRow: TData, index: number) => ReadonlyArray<TData> | undefined)
    | undefined,
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

  rowModel.rows = accessRows(table, rowModel, data, getRowId, getSubRows)

  return rowModel
}
