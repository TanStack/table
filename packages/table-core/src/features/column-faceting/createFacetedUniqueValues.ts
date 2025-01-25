import { tableMemo } from '../../utils'
import { column_getFacetedRowModel } from './columnFacetingFeature.utils'
import type { Table_Internal } from '../../types/Table'
import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowData } from '../../types/type-utils'

export function createFacetedUniqueValues<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(): (
  table: Table_Internal<TFeatures, TData>,
  columnId: string,
) => () => Map<any, number> {
  return (table, columnId) =>
    tableMemo({
      feature: 'columnFacetingFeature',
      table,
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
  TData extends RowData = any,
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
