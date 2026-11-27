import { constructRow } from '../../core/rows/constructRow'
import { makeObjectMap, tableMemo } from '../../utils'
import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { Row } from '../../types/Row'
import type { Table_Internal } from '../../types/Table'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowData } from '../../types/type-utils'
import type {
  MissingRowRangesOptions,
  SparseRowRange,
} from './sparseRowsFeature.types'

const placeholderRowIdPrefix = '__placeholder_'

function getSparseRowCount<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): number {
  const { data, rowCount } = table.options

  return rowCount !== undefined && rowCount >= 0 && rowCount < Infinity
    ? Math.floor(rowCount)
    : data.length
}

function accessSubRows<TFeatures extends TableFeatures, TData extends RowData>(
  table: Table_Internal<TFeatures, TData>,
  rowModel: RowModel<TFeatures, TData>,
  parentRow: Row<TFeatures, TData>,
): void {
  const originalSubRows = table.options.getSubRows!(
    parentRow.original,
    parentRow.index,
  )
  parentRow.originalSubRows = originalSubRows

  if (!originalSubRows) return

  for (let i = 0; i < originalSubRows.length; i++) {
    const originalRow = originalSubRows[i]!
    const row = constructRow(
      table,
      table.getRowId(originalRow, i, parentRow),
      originalRow,
      i,
      parentRow.depth + 1,
      undefined,
      parentRow.id,
    )

    rowModel.flatRows.push(row)
    rowModel.rowsById[row.id] = row
    parentRow.subRows.push(row)
    accessSubRows(table, rowModel, row)
  }
}

/**
 * Creates the memoized core row model for a table with sparse rows.
 *
 * It does not run the `autoReset*` behaviors when `data` changes, because a
 * change usually means that more rows are loaded, not that the rows are new.
 */
export function table_createSparseRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): () => RowModel<TFeatures, TData> {
  // A placeholder row depends only on its index, so each one is made once and
  // used again each time `data` changes.
  const placeholderRows: Array<Row<TFeatures, TData>> = []
  let hasWarnedClientRowModels = false
  let lastWarnedDuplicateId: string | undefined

  return tableMemo({
    feature: 'sparseRowsFeature',
    table,
    fnName: 'table.getCoreRowModel',
    memoDeps: () => [table.options.data, getSparseRowCount(table)],
    fn: (data, rowCount) => {
      const rowModel: RowModel<TFeatures, TData> = {
        rows: [],
        flatRows: [],
        rowsById: makeObjectMap(),
      }
      const { getSubRows } = table.options
      let duplicateId: string | undefined
      let hasPlaceholderRow = false

      placeholderRows.length = Math.min(placeholderRows.length, rowCount)

      for (let i = 0; i < rowCount; i++) {
        const originalRow = data[i]
        let row: Row<TFeatures, TData>

        if (originalRow === undefined) {
          hasPlaceholderRow = true
          row = placeholderRows[i] ??= constructRow(
            table,
            placeholderRowIdPrefix + i,
            undefined as unknown as TData,
            i,
            0,
          )
        } else {
          row = constructRow(
            table,
            table.getRowId(originalRow, i),
            originalRow,
            i,
            0,
          )
          if (
            process.env.NODE_ENV === 'development' &&
            rowModel.rowsById[row.id]
          ) {
            duplicateId ??= row.id
          }
        }

        rowModel.rows.push(row)
        rowModel.flatRows.push(row)
        rowModel.rowsById[row.id] = row

        if (getSubRows && originalRow !== undefined) {
          accessSubRows(table, rowModel, row)
        }
      }

      if (process.env.NODE_ENV === 'development') {
        const { features, manualFiltering, manualGrouping, manualSorting } =
          table.options

        if (
          hasPlaceholderRow &&
          !hasWarnedClientRowModels &&
          ((features.filteredRowModel && !manualFiltering) ||
            (features.groupedRowModel && !manualGrouping) ||
            (features.sortedRowModel && !manualSorting))
        ) {
          hasWarnedClientRowModels = true
          console.warn(
            'sparseRowsFeature: a client-side filtered, grouped, or sorted row model only sees the rows that are loaded, so its result is wrong. Filter, group, and sort on the server and set manualFiltering, manualGrouping, and manualSorting.',
          )
        }

        if (
          duplicateId !== undefined &&
          duplicateId !== lastWarnedDuplicateId
        ) {
          console.warn(
            `sparseRowsFeature: getRowId returned '${duplicateId}' for more than one loaded row. The loaded ranges probably overlap because rows were added or removed on the server between two requests.`,
          )
        }
        lastWarnedDuplicateId = duplicateId
      }

      return rowModel
    },
  })
}

/**
 * Returns the ranges between `startIndex` and `endIndex` (both included) that
 * `data` has no rows for.
 *
 * With `blockSize`, the result has one range for each block that has a missing
 * row in the requested range. A block range can be larger than the requested
 * range, but it never goes past the last row.
 *
 * @example
 * ```ts
 * table_getMissingRowRanges(table, { startIndex: 120, endIndex: 160, blockSize: 50 })
 * // [{ startIndex: 100, endIndex: 149 }, { startIndex: 150, endIndex: 199 }]
 * ```
 */
export function table_getMissingRowRanges<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  { startIndex, endIndex, blockSize }: MissingRowRangesOptions,
): Array<SparseRowRange> {
  const data = table.options.data
  const lastIndex = getSparseRowCount(table) - 1
  const first = Math.max(0, Math.ceil(startIndex))
  const last = Math.min(lastIndex, Math.floor(endIndex))
  const size =
    blockSize !== undefined && blockSize >= 1 && blockSize < Infinity
      ? Math.floor(blockSize)
      : 0
  const ranges: Array<SparseRowRange> = []

  for (let i = first; i <= last; i++) {
    if (data[i] !== undefined) continue

    let rangeStart = i
    let rangeEnd = i

    if (size) {
      rangeStart = i - (i % size)
      rangeEnd = Math.min(rangeStart + size - 1, lastIndex)
    } else {
      while (rangeEnd < last && data[rangeEnd + 1] === undefined) rangeEnd++
    }

    ranges.push({ startIndex: rangeStart, endIndex: rangeEnd })
    i = rangeEnd
  }

  return ranges
}

/**
 * Checks whether a row stands in for a row that is not loaded. `data` has no
 * row for an index when the entry is a hole or `undefined`.
 */
export function row_getIsPlaceholder<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>): boolean {
  return (row.original as TData | undefined) === undefined
}
