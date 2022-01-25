import { ReactTable, Row, RowModel } from '../types'
import { Options } from '../types'
import { ExpandedState } from '../features/Expanding'

export const expandRowsFn: Options<any, any, {}, {}, {}>['expandRowsFn'] = <
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
  _expandedState: ExpandedState,
  sortedRowModel: RowModel<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >
): RowModel<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> => {
  const expandedRows: Row<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[] = []

  const { expandSubRows } = instance.options

  const handleRow = (
    row: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  ) => {
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
