import { isDev, tableMemo } from '../../utils'
import { column_getFacetedRowModel } from './ColumnFaceting.utils'
import type { RowModel } from '../../core/row-models/RowModels.types'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'

export function createFacetedUniqueValues<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): (
  table: Table<TFeatures, TData>,
  columnId: string,
) => () => Map<any, number> {
  return (table, columnId) =>
    tableMemo({
      debug: isDev && (table.options.debugAll ?? table.options.debugTable),
      fnName: 'table.getFacetedUniqueValues',
      memoDeps: () => [
        column_getFacetedRowModel(table.getColumn(columnId), table)(),
      ],
      fn: (facetedRowModel) =>
        _createFacetedUniqueValues(columnId, facetedRowModel),
    })
}

function _createFacetedUniqueValues<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  columnId: string,
  facetedRowModel: RowModel<TFeatures, TData> | undefined,
): Map<any, number> {
  if (!facetedRowModel) return new Map()

  const facetedUniqueValues = new Map<any, number>()

  for (const row of facetedRowModel.flatRows) {
    const values = row.getUniqueValues(columnId)

    for (const value of values) {
      if (facetedUniqueValues.has(value)) {
        facetedUniqueValues.set(
          value,
          (facetedUniqueValues.get(value) ?? 0) + 1,
        )
      } else {
        facetedUniqueValues.set(value, 1)
      }
    }
  }

  return facetedUniqueValues
}
