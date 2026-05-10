import { flattenBy } from '../../utils'
import { constructCell } from '../cells/constructCell'
import type { Table_Internal } from '../../types/Table'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Row } from '../../types/Row'
import type { Cell } from '../../types/Cell'

/**
 * Returns value for a row.
 *
 * This is the static implementation behind the matching row instance API and may read row caches or table state atoms.
 *
 * @example
 * ```ts
 * const value = row_getValue(row)
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
 * Returns unique values for a row.
 *
 * This is the static implementation behind the matching row instance API and may read row caches or table state atoms.
 *
 * @example
 * ```ts
 * const value = row_getUniqueValues(row)
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
 * const value = row_renderValue(row)
 * ```
 */
export function row_renderValue<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>, columnId: string) {
  return row.getValue(columnId) ?? row.table.options.renderFallbackValue
}

/**
 * Returns leaf rows for a row.
 *
 * This is the static implementation behind the matching row instance API and may read row caches or table state atoms.
 *
 * @example
 * ```ts
 * const value = row_getLeafRows(row)
 * ```
 */
export function row_getLeafRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>): Array<Row<TFeatures, TData>> {
  return flattenBy(row.subRows, (d) => d.subRows)
}

/**
 * Returns parent row for a row.
 *
 * This is the static implementation behind the matching row instance API and may read row caches or table state atoms.
 *
 * @example
 * ```ts
 * const value = row_getParentRow(row)
 * ```
 */
export function row_getParentRow<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  return row.parentId ? row.table.getRow(row.parentId, true) : undefined
}

/**
 * Returns parent rows for a row.
 *
 * This is the static implementation behind the matching row instance API and may read row caches or table state atoms.
 *
 * @example
 * ```ts
 * const value = row_getParentRows(row)
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
 * Returns all cells for a row.
 *
 * This is the static implementation behind the matching row instance API and may read row caches or table state atoms.
 *
 * @example
 * ```ts
 * const value = row_getAllCells(row)
 * ```
 */
export function row_getAllCells<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>): Array<Cell<TFeatures, TData, unknown>> {
  return row.table.getAllLeafColumns().map((column) => {
    return constructCell(column, row, row.table)
  })
}

/**
 * Returns all cells by column id for a row.
 *
 * This is the static implementation behind the matching row instance API and may read row caches or table state atoms.
 *
 * @example
 * ```ts
 * const value = row_getAllCellsByColumnId(row)
 * ```
 */
export function row_getAllCellsByColumnId<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  return row.getAllCells().reduce(
    (acc, cell) => {
      acc[cell.column.id] = cell
      return acc
    },
    {} as Record<string, Cell<TFeatures, TData, unknown>>,
  )
}

/**
 * Returns row id for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getRowId(table)
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
 * Returns row for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getRow(table)
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
