import { ColumnFacetingOptions } from './ColumnFaceting.types'
import { CellData, Column, RowData, RowModel, Table } from '../../types'

export function column_getFacetedMinMaxValues<
  TData extends RowData,
  TValue extends CellData,
>(
  column: Column<TData, TValue>,
  table: Table<TData> & {
    options: ColumnFacetingOptions<TData>
  }
): () => [number, number] | undefined {
  return (
    table.options.getFacetedMinMaxValues?.(table, column.id) ??
    (() => undefined)
  )
}

export function column_getFacetedRowModel<
  TData extends RowData,
  TValue extends CellData,
>(
  column: Column<TData, TValue>,
  table: Table<TData> & {
    options: ColumnFacetingOptions<TData>
  }
): () => RowModel<TData> {
  return (
    table.options.getFacetedRowModel?.(table, column.id) ??
    (() => table.getPreFilteredRowModel()) // TODO - reference static function
  )
}

export function column_getFacetedUniqueValues<
  TData extends RowData,
  TValue extends CellData,
>(
  column: Column<TData, TValue>,
  table: Table<TData> & {
    options: ColumnFacetingOptions<TData>
  }
): () => Map<any, number> {
  return (
    table.options.getFacetedUniqueValues?.(table, column.id) ??
    (() => new Map<any, number>())
  )
}
