import { TableInstance, Row, RowModel, TableGenerics } from '../types'
import { memo } from '../utils'

export function getExpandedRowModel<TGenerics extends TableGenerics>(): (
  instance: TableInstance<TGenerics>
) => () => RowModel<TGenerics> {
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

export function expandRows<TGenerics extends TableGenerics>(
  rowModel: RowModel<TGenerics>,
  instance: TableInstance<TGenerics>
) {
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

  rowModel.rows.forEach(handleRow)

  return {
    rows: expandedRows,
    flatRows: rowModel.flatRows,
    rowsById: rowModel.rowsById,
  }
}
