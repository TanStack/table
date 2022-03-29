import { PartialGenerics, TableInstance, RowModel } from '../types'
import { expandRowsFn } from './expandRowsFn'

export function paginateRowsFn<TGenerics extends PartialGenerics>(
  instance: TableInstance<TGenerics>,
  rowModel: RowModel<TGenerics>
): RowModel<TGenerics> {
  const { pageSize, pageIndex } = instance.getState().pagination
  let { rows, flatRows, rowsById } = rowModel
  const pageStart = pageSize * pageIndex
  const pageEnd = pageStart + pageSize

  rows = rows.slice(pageStart, pageEnd)

  if (!instance.options.paginateExpandedRows) {
    return expandRowsFn(instance, {
      rows,
      flatRows,
      rowsById,
    })
  }

  return {
    rows,
    flatRows,
    rowsById,
  }
}
