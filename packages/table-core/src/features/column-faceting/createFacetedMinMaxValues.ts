import { callMemoOrStaticFn, tableMemo } from '../../utils'
import { column_getFacetedRowModel } from './columnFacetingFeature.utils'
import type { Row } from '../../types/Row'
import type { Table, Table_Internal } from '../../types/Table'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowData } from '../../types/type-utils'

export function createFacetedMinMaxValues<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(): (
  table: Table<TFeatures, TData>,
  columnId: string,
) => () => undefined | [number, number] {
  return (_table, columnId) => {
    const table: Table_Internal<TFeatures, TData> = _table
    return tableMemo({
      feature: 'columnFacetingFeature',
      fn: (flatRows) => _createFacetedMinMaxValues(columnId, flatRows),
      fnName: 'table.getFacetedMinMaxValues',
      memoDeps: () => {
        const column = table.getColumn(columnId)
        if (!column) return [table.getPreFilteredRowModel().flatRows]
        return [
          callMemoOrStaticFn(
            column,
            'getFacetedRowModel',
            column_getFacetedRowModel,
            table,
          ).flatRows,
        ]
      },
      table,
    })
  }
}

function _createFacetedMinMaxValues<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  columnId: string,
  flatRows: Array<Row<TFeatures, TData>>,
): undefined | [number, number] {
  if (!flatRows.length) return undefined

  const numericValues = flatRows
    .map((flatRow) => flatRow.getValue(columnId))
    .map(Number)
    .filter((value) => !Number.isNaN(value))

  if (!numericValues.length) return undefined

  let facetedMinValue = numericValues[0]!
  let facetedMaxValue = numericValues[0]!

  for (const value of numericValues) {
    if (value < facetedMinValue) facetedMinValue = value
    if (value > facetedMaxValue) facetedMaxValue = value
  }

  return [facetedMinValue, facetedMaxValue]
}
