import { Cell, Column, Row, RowData, Table } from '../../types'
import { flattenBy } from '../../utils'
import { _createCell } from '../cells/Cells'

export function row_getValue<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>,
  columnId: string
) {
  if (row._valuesCache.hasOwnProperty(columnId)) {
    return row._valuesCache[columnId]
  }

  const column = table.getColumn(columnId)

  if (!column?.accessorFn) {
    return undefined
  }

  row._valuesCache[columnId] = column.accessorFn(
    row.original as TData,
    row.index
  )

  return row._valuesCache[columnId] as any
}

export function row_getUniqueValues<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>,
  columnId: string
) {
  if (row._uniqueValuesCache.hasOwnProperty(columnId)) {
    return row._uniqueValuesCache[columnId]
  }

  const column = table.getColumn(columnId)

  if (!column?.accessorFn) {
    return undefined
  }

  if (!column.columnDef.getUniqueValues) {
    row._uniqueValuesCache[columnId] = [row.getValue(columnId)]
    return row._uniqueValuesCache[columnId]
  }

  row._uniqueValuesCache[columnId] = column.columnDef.getUniqueValues(
    row.original as TData,
    row.index
  )

  return row._uniqueValuesCache[columnId] as any
}

export function row_renderValue<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>,
  columnId: string
) {
  return row_getValue(row, table, columnId) ?? table.options.renderFallbackValue
}

export function row_getLeafRows<TData extends RowData>(
  row: Row<TData>
): Row<TData>[] {
  return flattenBy(row.subRows, d => d.subRows)
}

export function row_getParentRow<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>
) {
  return row.parentId ? table.getRow(row.parentId, true) : undefined
}

export function row_getParentRows<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>
) {
  let parentRows: Row<TData>[] = []
  let currentRow = row
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
  leafColumns: Column<TData, unknown>[]
): Cell<TData, unknown>[] {
  return leafColumns.map(column => {
    return _createCell(table, row as Row<TData>, column, column.id)
  })
}

export function row_getAllCellsByColumnId<TData extends RowData>(
  allCells: Cell<TData, unknown>[]
) {
  return allCells.reduce(
    (acc, cell) => {
      acc[cell.column.id] = cell
      return acc
    },
    {} as Record<string, Cell<TData, unknown>>
  )
}

export function table_getRowId<TData extends RowData>(
  row: TData,
  table: Table<TData>,
  index: number,
  parent?: Row<TData>
) {
  return (
    table.options.getRowId?.(row, index, parent) ??
    `${parent ? [parent.id, index].join('.') : index}`
  )
}

export function table_getRow<TData extends RowData>(
  table: Table<TData>,
  rowId: string,
  searchAll?: boolean
) {
  let row = (searchAll ? table.getPrePaginationRowModel() : table.getRowModel())
    .rowsById[rowId]

  if (!row) {
    row = table.getCoreRowModel().rowsById[rowId]
    if (!row) {
      if (process.env.NODE_ENV !== 'production') {
        throw new Error(`getRow could not find row with ID: ${rowId}`)
      }
      throw new Error()
    }
  }

  return row
}
