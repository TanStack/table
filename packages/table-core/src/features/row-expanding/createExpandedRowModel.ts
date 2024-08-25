import { getMemoOptions, memo } from '../../utils'
import { table_getState } from '../../core/table/Tables.utils'
import {
  row_getIsExpanded,
  table_getPreExpandedRowModel,
} from './RowExpanding.utils'
import type { TableOptions_RowExpanding } from './RowExpanding.types'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../types/RowModel'
import type { Table } from '../../types/Table'
import type { Row } from '../../types/Row'

export function createExpandedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): (
  table: Table<TFeatures, TData> & {
    options: TableOptions_RowExpanding<TFeatures, TData>
  },
) => () => RowModel<TFeatures, TData> {
  return (table) =>
    memo(
      () => [
        table_getState(table).expanded,
        table_getPreExpandedRowModel(table),
        table.options.paginateExpandedRows,
      ],
      (expanded, rowModel, paginateExpandedRows) => {
        if (
          !rowModel.rows.length ||
          (expanded !== true && !Object.keys(expanded ?? {}).length)
        ) {
          return rowModel
        }

        if (!paginateExpandedRows) {
          // Only expand rows at this point if they are being paginated
          return rowModel
        }

        return expandRows(rowModel, table)
      },
      getMemoOptions(table.options, 'debugTable', 'getExpandedRowModel'),
    )
}

export function expandRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(rowModel: RowModel<TFeatures, TData>, table: Table<TFeatures, TData>) {
  const expandedRows: Array<Row<TFeatures, TData>> = []

  const handleRow = (row: Row<TFeatures, TData>) => {
    expandedRows.push(row)

    if (row.subRows.length && row_getIsExpanded(row, table)) {
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
