import { isDev, tableMemo } from '../../utils'
import { filterRows } from '../column-filtering/filterRowsUtils'
import type { Table_Internal } from '../../types/Table'
import type {
  ColumnFiltersState,
  Row_ColumnFiltering,
} from '../column-filtering/columnFilteringFeature.types'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/rowModelsFeature.types'
import type { Row } from '../../types/Row'

export function createFacetedRowModel<TFeatures extends TableFeatures>(): (
  table: Table_Internal<TFeatures, any>,
  columnId: string,
) => () => RowModel<TFeatures, any> {
  return (table, columnId) =>
    tableMemo({
      debug: isDev && (table.options.debugAll ?? table.options.debugTable),
      fnName: 'createFacetedRowModel',
      memoDeps: () => [
        table.getPreFilteredRowModel(),
        table.options.state?.columnFilters,
        table.options.state?.globalFilter,
        table.getFilteredRowModel(),
      ],
      fn: (preRowModel, columnFilters, globalFilter) =>
        _createFacetedRowModel(
          table,
          columnId,
          preRowModel,
          columnFilters,
          globalFilter,
        ),
    })
}

function _createFacetedRowModel<TFeatures extends TableFeatures>(
  table: Table_Internal<TFeatures, any>,
  columnId: string,
  preRowModel: RowModel<TFeatures, any>,
  columnFilters?: ColumnFiltersState,
  globalFilter?: string,
) {
  if (!preRowModel.rows.length || (!columnFilters?.length && !globalFilter)) {
    return preRowModel
  }

  const filterableIds = [
    ...(columnFilters?.map((d) => d.id).filter((d) => d !== columnId) ?? []),
    globalFilter ? '__global__' : undefined,
  ].filter(Boolean) as Array<string>

  const filterRowsImpl = (
    row: Row<TFeatures, any> & Partial<Row_ColumnFiltering<TFeatures, any>>,
  ) => {
    // Horizontally filter rows through each column
    for (const colId of filterableIds) {
      if (row.columnFilters?.[colId] === false) {
        return false
      }
    }
    return true
  }

  return filterRows(preRowModel.rows, filterRowsImpl, table)
}
