import { table_getPaginatedRowModel } from '../../features/row-pagination/RowPagination.utils'
import { createCoreRowModel } from './createCoreRowModel'
import type { RowData, RowModel, Table } from '../../types'

export function table_getCoreRowModel<TData extends RowData>(
  table: Table<TData>,
): RowModel<TData> {
  if (!table._rowModels.Core) {
    table._rowModels.Core =
      table.options._rowModels?.Core?.(table) ??
      createCoreRowModel<TData>()(table)
  }

  return table._rowModels.Core()
}

export function table_getRowModel<TData extends RowData>(
  table: Table<TData>,
): RowModel<TData> {
  return table_getPaginatedRowModel(table)
}
