import { flattenBy } from '../../utils'
import { _createCell } from '../cells/createCell'
import {
  table_getAllLeafColumns,
  table_getColumn,
} from '../columns/Columns.utils'
import { table_getPrePaginationRowModel } from '../../features/row-pagination/RowPagination.utils'
import { table_getCoreRowModel, table_getRowModel } from '../table/Tables.utils'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Row } from '../../types/Row'
import type { Cell } from '../../types/Cell'
import type { Column } from '../../types/Column'

export function row_getValue<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  table: Table<TFeatures, TData>,
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

export function row_getUniqueValues<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  table: Table<TFeatures, TData>,
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

export function row_renderValue<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  table: Table<TFeatures, TData>,
  columnId: string,
) {
  return row_getValue(row, table, columnId) ?? table.options.renderFallbackValue
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
>(row: Row<TFeatures, TData>, table: Table<TFeatures, TData>) {
  return row.parentId ? table_getRow(table, row.parentId, true) : undefined
}

export function row_getParentRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>, table: Table<TFeatures, TData>) {
  const parentRows: Array<Row<TFeatures, TData>> = []
  let currentRow = row
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (true) {
    const parentRow = row_getParentRow(currentRow, table)
    if (!parentRow) break
    parentRows.push(parentRow)
    currentRow = parentRow
  }
  return parentRows.reverse()
}

export function row_getAllCells<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  table: Table<TFeatures, TData>,
): Array<Cell<TFeatures, TData, unknown>> {
  return table_getAllLeafColumns(table).map((column) => {
    return _createCell(column, row, table)
  })
}

export function row_getAllCellsByColumnId<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>, table: Table<TFeatures, TData>) {
  return row_getAllCells(row, table).reduce(
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
  table: Table<TFeatures, TData>,
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
  table: Table<TFeatures, TData>,
  rowId: string,
  searchAll?: boolean,
): Row<TFeatures, TData> {
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
