import { table_getPaginationRowModel } from '../../features/row-pagination/RowPagination.utils'
import type { RowData, RowModel, Table } from '../../types'

export function table_getCoreRowModel<TData extends RowData>(
  table: Table<TData>,
): RowModel<TData> {
  if (!table._getCoreRowModel) {
    table._getCoreRowModel = table.options.getCoreRowModel(table)
  }

  return table._getCoreRowModel()
}

export function table_getRowModel<TData extends RowData>(
  table: Table<TData>,
): RowModel<TData> {
  return table_getPaginationRowModel(table)
}
