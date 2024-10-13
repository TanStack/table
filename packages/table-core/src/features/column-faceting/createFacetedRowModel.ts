import { isDev, tableMemo } from '../../utils'
import { filterRows } from '../column-filtering/filterRowsUtils'
import { table_getState } from '../../core/table/Tables.utils'
import {
  table_getFilteredRowModel,
  table_getPreFilteredRowModel,
} from '../column-filtering/ColumnFiltering.utils'
import type { ColumnFiltersState } from '../column-filtering/ColumnFiltering.types'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../types/RowModel'
import type { Table } from '../../types/Table'
import type { Row } from '../../types/Row'

export function createFacetedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): (
  table: Table<TFeatures, TData>,
  columnId: string,
) => () => RowModel<TFeatures, TData> {
  return (table, columnId) =>
    tableMemo({
      debug: isDev && (table.options.debugAll ?? table.options.debugTable),
      fnName: 'createFacetedRowModel',
      memoDeps: () => [
        table_getPreFilteredRowModel(table),
        table_getState(table).columnFilters,
        table_getState(table).globalFilter,
        table_getFilteredRowModel(table),
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

function _createFacetedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData>,
  columnId: string,
  preRowModel: RowModel<TFeatures, TData>,
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

  const filterRowsImpl = (row: Row<TFeatures, TData>) => {
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
