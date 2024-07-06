import { RowData, RowModel, Table } from '../../types'

export function table_getGlobalFacetedMinMaxValues<TData extends RowData>(
  table: Table<TData>,
) {
  return (
    table.options.getFacetedMinMaxValues?.(table, '__global__') ??
    (() => undefined)
  )
}

export function table_getGlobalFacetedRowModel<TData extends RowData>(
  table: Table<TData>,
): () => RowModel<TData> {
  return (
    table.options.getFacetedRowModel?.(table, '__global__') ??
    (() => table.getPreFilteredRowModel())
  )
}

export function table_getGlobalFacetedUniqueValues<TData extends RowData>(
  table: Table<TData>,
): () => Map<any, number> {
  return (
    table.options.getFacetedUniqueValues?.(table, '__global__') ??
    (() => new Map())
  )
}
