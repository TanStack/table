import { tableMemo } from '../../utils'
import { row_getIsExpanded } from './rowExpandingFeature.utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { Table, Table_Internal } from '../../types/Table'
import type { Row } from '../../types/Row'
import type { RowData } from '../../types/type-utils'

/**
 * Creates a memoized expanded row model factory.
 *
 * The factory reads the relevant table state atoms and options, then returns a row model function used by the table row-model pipeline.
 */
export function createExpandedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(): (table: Table<TFeatures, TData>) => () => RowModel<TFeatures, TData> {
  return (_table) => {
    const table = _table as unknown as Table_Internal<TFeatures, TData>
    return tableMemo({
      feature: 'rowExpandingFeature',
      table,
      fnName: 'table.getExpandedRowModel',
      memoDeps: () => [
        table.atoms.expanded?.get(),
        table.getPreExpandedRowModel(),
        table.options.paginateExpandedRows,
      ],
      fn: () => _createExpandedRowModel(table),
    })
  }
}

function _createExpandedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  const rowModel = table.getPreExpandedRowModel()
  const expanded = table.atoms.expanded?.get()

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

/**
 * Expands a row model according to the current expanded row state.
 *
 * Expanded sub-rows are inserted into the flattened row order while preserving the original row hierarchy.
 */
export function expandRows<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(rowModel: RowModel<TFeatures, TData>): RowModel<TFeatures, TData> {
  const expandedRows: Array<Row<TFeatures, TData>> = []

  const handleRow = (row: Row<TFeatures, TData>) => {
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
