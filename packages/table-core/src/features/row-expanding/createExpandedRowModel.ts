import { isDev, tableMemo } from '../../utils'
import { row_getIsExpanded } from './rowExpandingFeature.utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/rowModelsFeature.types'
import type { Table_Internal } from '../../types/Table'
import type { Row } from '../../types/Row'

export function createExpandedRowModel<TFeatures extends TableFeatures>(): (
  table: Table_Internal<TFeatures, any>,
) => () => RowModel<TFeatures, any> {
  return (table) =>
    tableMemo({
      debug: isDev && (table.options.debugAll ?? table.options.debugTable),
      fnName: 'table.getExpandedRowModel',
      memoDeps: () => [
        table.options.state?.expanded,
        table.getPreExpandedRowModel(),
        table.options.paginateExpandedRows,
      ],
      fn: () => _createExpandedRowModel(table),
    })
}

export function _createExpandedRowModel<TFeatures extends TableFeatures>(
  table: Table_Internal<TFeatures, any>,
): RowModel<TFeatures, any> {
  const rowModel = table.getPreExpandedRowModel()
  const expanded = table.options.state?.expanded

  if (
    !rowModel.rows.length ||
    (expanded !== true && !Object.keys(expanded ?? {}).length)
  ) {
    return rowModel
  }

  if (!table.options.paginateExpandedRows) {
    // Only expand rows at this point if they are being paginated
    return rowModel
  }

  return expandRows(rowModel)
}

export function expandRows<TFeatures extends TableFeatures>(
  rowModel: RowModel<TFeatures, any>,
) {
  const expandedRows: Array<Row<TFeatures, any>> = []

  const handleRow = (row: Row<TFeatures, any>) => {
    expandedRows.push(row)

    if (row.subRows.length && row_getIsExpanded(row)) {
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
