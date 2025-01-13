import { tableMemo } from '../../utils'
import { column_getFacetedRowModel } from './columnFacetingFeature.utils'
import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { Table_Internal } from '../../types/Table'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowData } from '../../types/type-utils'

export function createFacetedMinMaxValues<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(): (
  table: Table_Internal<TFeatures, TData>,
  columnId: string,
) => () => undefined | [number, number] {
  return (table, columnId) =>
    tableMemo({
      feature: 'columnFacetingFeature',
      fn: (facetedRowModel) =>
        _createFacetedMinMaxValues(columnId, facetedRowModel),
      fnName: 'table.getFacetedMinMaxValues',
      memoDeps: () => [
        // TODO fix
        column_getFacetedRowModel(table.getColumn(columnId), table)(),
      ],
      table,
    })
}

function _createFacetedMinMaxValues<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  columnId: string,
  facetedRowModel?: RowModel<TFeatures, TData>,
): undefined | [number, number] {
  if (!facetedRowModel) return undefined

  const uniqueValues = facetedRowModel.flatRows
    .flatMap((flatRow) => flatRow.getUniqueValues(columnId) ?? [])
    .map(Number)
    .filter((value) => !Number.isNaN(value))

  if (!uniqueValues.length) return

  let facetedMinValue = uniqueValues[0]!
  let facetedMaxValue = uniqueValues[uniqueValues.length - 1]!

  for (const value of uniqueValues) {
    if (value < facetedMinValue) facetedMinValue = value
    else if (value > facetedMaxValue) facetedMaxValue = value
  }

  return [facetedMinValue, facetedMaxValue]
}
