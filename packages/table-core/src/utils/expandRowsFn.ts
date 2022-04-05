import {
  TableInstance,
  Row,
  RowModel,
  AnyGenerics,
  PartialGenerics,
} from '../types'

export function expandRowsFn<TGenerics extends AnyGenerics>(
  instance: TableInstance<TGenerics>,
  sortedRowModel: RowModel<TGenerics>
): RowModel<TGenerics> {
  const expandedRows: Row<TGenerics>[] = []

  const handleRow = (row: Row<TGenerics>) => {
    expandedRows.push(row)

    if (
      instance.options.expandSubRows &&
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
