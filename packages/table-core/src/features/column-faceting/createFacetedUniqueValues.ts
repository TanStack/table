import { isDev, tableMemo } from '../../utils'
import { column_getFacetedRowModel } from './columnFacetingFeature.utils'
import type { Table_Internal } from '../../types/Table'
import type { RowModel } from '../../core/row-models/rowModelsFeature.types'
import type { TableFeatures } from '../../types/TableFeatures'

export function createFacetedUniqueValues<TFeatures extends TableFeatures>(): (
  table: Table_Internal<TFeatures, any>,
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

function _createFacetedUniqueValues<TFeatures extends TableFeatures>(
  columnId: string,
  facetedRowModel: RowModel<TFeatures, any> | undefined,
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
