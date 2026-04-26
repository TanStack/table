import { callMemoOrStaticFn, tableMemo } from '../../utils'
import { column_getFacetedRowModel } from './columnFacetingFeature.utils'
import type { Row } from '../../types/Row'
import type { Table, Table_Internal } from '../../types/Table'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowData } from '../../types/type-utils'

export function createFacetedUniqueValues<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(): (
  table: Table<TFeatures, TData>,
  columnId: string,
) => () => Map<any, number> {
  return (_table, columnId) => {
    const table: Table_Internal<TFeatures, TData> = _table
    return tableMemo({
      feature: 'columnFacetingFeature',
      table,
      fnName: 'table.getFacetedUniqueValues',
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
      fn: (flatRows) => _createFacetedUniqueValues(columnId, flatRows),
    })
  }
}

function _createFacetedUniqueValues<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(columnId: string, flatRows: Array<Row<TFeatures, TData>>): Map<any, number> {
  const facetedUniqueValues = new Map<any, number>()

  for (const row of flatRows) {
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
