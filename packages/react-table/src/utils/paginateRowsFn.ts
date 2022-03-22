import { ReactTable, RowModel } from '../types'
import { expandRowsFn } from './expandRowsFn'

export function paginateRowsFn<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
  rowModel: RowModel<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
): RowModel<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> {
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
