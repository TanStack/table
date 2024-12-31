import { flattenBy, isDev } from '../../utils'
import { constructCell } from '../cells/constructCell'
import type { Table_Internal } from '../../types/Table'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Row } from '../../types/Row'
import type { Cell } from '../../types/Cell'

export function row_getValue<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>, columnId: string) {
  if (row._valuesCache.hasOwnProperty(columnId)) {
    return row._valuesCache[columnId]
  }

  const column = row._table.getColumn(columnId)

  if (!column?.accessorFn) {
    return undefined
  }

  row._valuesCache[columnId] = column.accessorFn(row.original, row.index)

  return row._valuesCache[columnId]
}

export function row_getUniqueValues<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>, columnId: string) {
  if (row._uniqueValuesCache.hasOwnProperty(columnId)) {
    return row._uniqueValuesCache[columnId]
  }

  const column = row._table.getColumn(columnId)

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

export function row_renderValue<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>, columnId: string) {
  return row.getValue(columnId) ?? row._table.options.renderFallbackValue
}

export function row_getLeafRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>): Array<Row<TFeatures, TData>> {
  return flattenBy(row.subRows, (d) => d.subRows)
}

export function row_getParentRow<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  return row.parentId ? row._table.getRow(row.parentId, true) : undefined
}

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

export function row_getAllCells<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>): Array<Cell<TFeatures, TData, unknown>> {
  return row._table.getAllLeafColumns().map((column) => {
    return constructCell(column, row, row._table)
  })
}

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
      if (isDev) {
        throw new Error(`getRow could not find row with ID: ${rowId}`)
      }
      throw new Error()
    }
  }

  return row
}
