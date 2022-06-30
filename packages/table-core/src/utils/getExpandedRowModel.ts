import { Table, Row, RowModel, TableGenerics, RowData } from '../types'
import { memo } from '../utils'

export function getExpandedRowModel<TData extends RowData>(): (
  instance: Table<TData>
) => () => RowModel<TData> {
  return instance =>
    memo(
      () => [
        instance.getState().expanded,
        instance.getPreExpandedRowModel(),
        instance.options.paginateExpandedRows,
      ],
      (expanded, rowModel, paginateExpandedRows) => {
        if (
          !rowModel.rows.length ||
          // Do not expand if rows are not included in pagination
          !paginateExpandedRows ||
          (expanded !== true && !Object.keys(expanded ?? {}).length)
        ) {
          return rowModel
        }

        return expandRows(rowModel, instance)
      },
      {
        key: process.env.NODE_ENV === 'development' && 'getExpandedRowModel',
        debug: () => instance.options.debugAll ?? instance.options.debugTable,
      }
    )
}

export function expandRows<TData extends RowData>(
  rowModel: RowModel<TData>,
  instance: Table<TData>
) {
  const expandedRows: Row<TData>[] = []

  const handleRow = (row: Row<TData>) => {
    expandedRows.push(row)

    if (row.subRows?.length && row.getIsExpanded()) {
      row.subRows.forEach(handleRow)
    }
  }

  rowModel.rows.forEach(handleRow)

  return {
    rows: expandedRows,
    flatRows: rowModel.flatRows,
    rowsById: rowModel.rowsById,
  }
}
