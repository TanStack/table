import { callMemoOrStaticFn, tableMemo } from '../../utils'
import { column_getFacetedRowModel } from './columnFacetingFeature.utils'
import type { Row } from '../../types/Row'
import type { Table, Table_Internal } from '../../types/Table'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowData } from '../../types/type-utils'

/**
 * Creates a memoized faceted unique values helper for faceted filtering.
 *
 * The returned function derives facet data from the table row model and relevant filter state so filter UIs can display available values.
 */
export function createFacetedUniqueValues<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(): (
  table: Table<TFeatures, TData>,
  columnId: string,
) => () => Map<any, number> {
  return (_table, columnId) => {
    const table = _table as unknown as Table_Internal<TFeatures, TData>
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

  for (let i = 0; i < flatRows.length; i++) {
    const values = flatRows[i]!.getUniqueValues(columnId)

    for (let j = 0; j < values.length; j++) {
      const value = values[j]
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
