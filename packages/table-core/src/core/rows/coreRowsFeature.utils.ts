import { flattenBy } from '../../utils'
import { constructCell } from '../cells/constructCell'
import type { Table_Internal } from '../../types/Table'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Row } from '../../types/Row'
import type { Cell } from '../../types/Cell'

/**
 * Reads and caches this row's value for a column.
 *
 * The value is produced by the column accessor. Missing columns or display
 * columns without an accessor return `undefined`.
 *
 * @example
 * ```ts
 * const firstName = row_getValue(row, 'firstName')
 * ```
 */
export function row_getValue<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>, columnId: string) {
  if (row._valuesCache.hasOwnProperty(columnId)) {
    return row._valuesCache[columnId]
  }

  const column = row.table.getColumn(columnId)

  if (!column?.accessorFn) {
    return undefined
  }

  row._valuesCache[columnId] = column.accessorFn(row.original, row.index)

  return row._valuesCache[columnId]
}

/**
 * Reads and caches the values used by faceting/grouping for a column.
 *
 * If the column defines `getUniqueValues`, that result is used. Otherwise the
 * row's accessor value is wrapped in a single-item array.
 *
 * @example
 * ```ts
 * const values = row_getUniqueValues(row, 'tags')
 * ```
 */
export function row_getUniqueValues<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>, columnId: string) {
  if (row._uniqueValuesCache.hasOwnProperty(columnId)) {
    return row._uniqueValuesCache[columnId]
  }

  const column = row.table.getColumn(columnId)

  if (!column?.accessorFn) {
    return undefined
  }

  if (!column.columnDef.getUniqueValues) {
    row._uniqueValuesCache[columnId] = [row.getValue(columnId)]
    return row._uniqueValuesCache[columnId]
  }

  row._uniqueValuesCache[columnId] = column.columnDef.getUniqueValues(
    row.original,
    row.index,
  )

  return row._uniqueValuesCache[columnId]
}

/**
 * Returns a renderable row value for a column.
 *
 * If the accessor value is nullish, the table's `renderFallbackValue` is used
 * instead.
 *
 * @example
 * ```ts
 * const value = row_renderValue(row, 'firstName')
 * ```
 */
export function row_renderValue<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>, columnId: string) {
  return row.getValue(columnId) ?? row.table.options.renderFallbackValue
}

/**
 * Flattens this row's descendant tree into leaf rows.
 *
 * The row itself is not included; only nested `subRows` are walked.
 *
 * @example
 * ```ts
 * const descendants = row_getLeafRows(row)
 * ```
 */
export function row_getLeafRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>): Array<Row<TFeatures, TData>> {
  return flattenBy(row.subRows, (d) => d.subRows)
}

/**
 * Looks up this row's direct parent, if it has one.
 *
 * Parent lookup searches the pre-pagination row model so parent relationships
 * are available even when the parent is not on the current page.
 *
 * @example
 * ```ts
 * const parent = row_getParentRow(row)
 * ```
 */
export function row_getParentRow<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  return row.parentId ? row.table.getRow(row.parentId, true) : undefined
}

/**
 * Collects this row's ancestor chain from root to direct parent.
 *
 * The current row is not included. Rows without a parent return an empty array.
 *
 * @example
 * ```ts
 * const ancestors = row_getParentRows(row)
 * ```
 */
export function row_getParentRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  const parentRows: Array<Row<TFeatures, TData>> = []
  let currentRow = row
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (true) {
    const parentRow = currentRow.getParentRow()
    if (!parentRow) break
    parentRows.push(parentRow)
    currentRow = parentRow
  }
  return parentRows.reverse()
}

/**
 * Constructs one cell for each leaf column in this row.
 *
 * The result follows `table.getAllLeafColumns()` order and includes hidden
 * columns; visibility-specific APIs filter this list later.
 *
 * @example
 * ```ts
 * const cells = row_getAllCells(row)
 * ```
 */
export function row_getAllCells<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>): Array<Cell<TFeatures, TData, unknown>> {
  const columns = row.table.getAllLeafColumns()
  const cells: Array<Cell<TFeatures, TData, unknown>> = new Array(
    columns.length,
  )
  for (let i = 0; i < columns.length; i++) {
    cells[i] = constructCell(columns[i]!, row, row.table)
  }
  return cells
}

/**
 * Builds a lookup map of this row's cells keyed by column id.
 *
 * This is the static implementation behind `row.getAllCellsByColumnId()`.
 *
 * @example
 * ```ts
 * const cellsById = row_getAllCellsByColumnId(row)
 * ```
 */
export function row_getAllCellsByColumnId<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  const result: Record<string, Cell<TFeatures, TData, unknown>> = {}
  const cells = row.getAllCells()
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i]!
    result[cell.column.id] = cell
  }
  return result
}

/**
 * Resolves the stable id for a row.
 *
 * `options.getRowId` wins when provided. Otherwise root rows use their index
 * and child rows append their index to the parent id, such as `0.2`.
 *
 * @example
 * ```ts
 * const id = table_getRowId(originalRow, table, index, parentRow)
 * ```
 */
export function table_getRowId<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  originalRow: TData,
  table: Table_Internal<TFeatures, TData>,
  index: number,
  parent?: Row<TFeatures, TData>,
) {
  return (
    table.options.getRowId?.(originalRow, index, parent) ??
    `${parent ? [parent.id, index].join('.') : index}`
  )
}

/**
 * Looks up a row by id from the current or full row model.
 *
 * By default this searches `table.getRowModel()`. Passing `searchAll` searches
 * the pre-pagination model first, then falls back to the core model.
 *
 * @example
 * ```ts
 * const row = table_getRow(table, rowId, true)
 * ```
 */
export function table_getRow<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  rowId: string,
  searchAll?: boolean,
): Row<TFeatures, TData> {
  // TODO - simplify this across different row models
  let row = (searchAll ? table.getPrePaginatedRowModel() : table.getRowModel())
    .rowsById[rowId]

  if (!row) {
    row = table.getCoreRowModel().rowsById[rowId]
    if (!row) {
      if (process.env.NODE_ENV === 'development') {
        throw new Error(`getRow could not find row with ID: ${rowId}`)
      }
      throw new Error()
    }
  }

  return row
}
