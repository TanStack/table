import { TableOptions_ColumnFaceting } from './ColumnFaceting.types'
import { CellData, Column, RowData, RowModel, Table } from '../../types'

export function column_getFacetedMinMaxValues<
  TData extends RowData,
  TValue extends CellData,
>(
  column: Column<TData, TValue>,
  table: Table<TData> & {
    options: TableOptions_ColumnFaceting<TData>
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
    options: TableOptions_ColumnFaceting<TData>
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
    options: TableOptions_ColumnFaceting<TData>
  }
): () => Map<any, number> {
  return (
    table.options.getFacetedUniqueValues?.(table, column.id) ??
    (() => new Map<any, number>())
  )
}
