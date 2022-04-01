import { TableInstance, Row, RowModel, AnyGenerics } from '../types'

export function expandRowsFn<TGenerics extends AnyGenerics>(
  instance: TableInstance<TGenerics>,
  sortedRowModel: RowModel<TGenerics>
): RowModel<TGenerics> {
  const expandedRows: Row<TGenerics>[] = []

  const { expandSubRows } = instance.options

  const handleRow = (row: Row<TGenerics>) => {
    expandedRows.push(row)

    if (
      expandSubRows &&
      row.subRows?.length &&
      instance.getIsRowExpanded(row.id)
    ) {
      row.subRows.forEach(handleRow)
    }
  }

  sortedRowModel.rows.forEach(handleRow)

  return {
    rows: expandedRows,
    flatRows: sortedRowModel.flatRows,
    rowsById: sortedRowModel.rowsById,
  }
}
