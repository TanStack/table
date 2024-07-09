import { flattenBy } from '../../utils'
import { _createCell } from '../cells/createCell'
import { table_getColumn } from '../columns/Columns.utils'
import { table_getPrePaginationRowModel } from '../../features/row-pagination/RowPagination.utils'
import { table_getCoreRowModel, table_getRowModel } from '../table/Tables.utils'
import type { Cell, Column, Row, RowData, Table } from '../../types'

export function row_getValue<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>,
  columnId: string,
) {
  if (row._valuesCache.hasOwnProperty(columnId)) {
    return row._valuesCache[columnId]
  }

  const column = table_getColumn(table, columnId)

  if (!column?.accessorFn) {
    return undefined
  }

  row._valuesCache[columnId] = column.accessorFn(row.original, row.index)

  return row._valuesCache[columnId] as any
}

export function row_getUniqueValues<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>,
  columnId: string,
) {
  if (row._uniqueValuesCache.hasOwnProperty(columnId)) {
    return row._uniqueValuesCache[columnId]
  }

  const column = table_getColumn(table, columnId)

  if (!column?.accessorFn) {
    return undefined
  }

  if (!column.columnDef.getUniqueValues) {
    row._uniqueValuesCache[columnId] = [row_getValue(row, table, columnId)]
    return row._uniqueValuesCache[columnId]
  }

  row._uniqueValuesCache[columnId] = column.columnDef.getUniqueValues(
    row.original,
    row.index,
  )

  return row._uniqueValuesCache[columnId] as any
}

export function row_renderValue<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>,
  columnId: string,
) {
  return row_getValue(row, table, columnId) ?? table.options.renderFallbackValue
}

export function row_getLeafRows<TData extends RowData>(
  row: Row<TData>,
): Array<Row<TData>> {
  return flattenBy(row.subRows, (d) => d.subRows)
}

export function row_getParentRow<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>,
) {
  return row.parentId ? table_getRow(table, row.parentId, true) : undefined
}

export function row_getParentRows<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>,
) {
  const parentRows: Array<Row<TData>> = []
  let currentRow = row
  // eslint-disable-next-line ts/no-unnecessary-condition
  while (true) {
    const parentRow = row_getParentRow(currentRow, table)
    if (!parentRow) break
    parentRows.push(parentRow)
    currentRow = parentRow
  }
  return parentRows.reverse()
}

export function row_getAllCells<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>,
  leafColumns: Array<Column<TData, unknown>>,
): Array<Cell<TData, unknown>> {
  return leafColumns.map((column) => {
    return _createCell(column, row, table)
  })
}

export function row_getAllCellsByColumnId<TData extends RowData>(
  allCells: Array<Cell<TData, unknown>>,
) {
  return allCells.reduce(
    (acc, cell) => {
      acc[cell.column.id] = cell
      return acc
    },
    {} as Record<string, Cell<TData, unknown>>,
  )
}

export function table_getRowId<TData extends RowData>(
  originalRow: TData,
  table: Table<TData>,
  index: number,
  parent?: Row<TData>,
) {
  return (
    table.options.getRowId?.(originalRow, index, parent) ??
    `${parent ? [parent.id, index].join('.') : index}`
  )
}

export function table_getRow<TData extends RowData>(
  table: Table<TData>,
  rowId: string,
  searchAll?: boolean,
): Row<TData> {
  let row = (
    searchAll ? table_getPrePaginationRowModel(table) : table_getRowModel(table)
  ).rowsById[rowId]

  if (!row) {
    row = table_getCoreRowModel(table).rowsById[rowId]
    if (!row) {
      if (process.env.NODE_ENV !== 'production') {
        throw new Error(`getRow could not find row with ID: ${rowId}`)
      }
      throw new Error()
    }
  }

  return row
}
