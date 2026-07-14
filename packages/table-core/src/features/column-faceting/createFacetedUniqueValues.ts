import { callMemoOrStaticFn, tableMemo } from '../../utils'
import { column_getCanGlobalFilter } from '../global-filtering/globalFilteringFeature.utils'
import {
  column_getFacetedRowModel,
  table_getGlobalFacetedRowModel,
} from './columnFacetingFeature.utils'
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
        if (columnId === '__global__') {
          return [
            callMemoOrStaticFn(
              table,
              'getGlobalFacetedRowModel',
              table_getGlobalFacetedRowModel,
            ).flatRows,
          ]
        }
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
      fn: (flatRows) => _createFacetedUniqueValues(table, columnId, flatRows),
    })
  }
}

function _createFacetedUniqueValues<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  table: Table_Internal<TFeatures, TData>,
  columnId: string,
  flatRows: Array<Row<TFeatures, TData>>,
): Map<any, number> {
  // The global context aggregates unique values across every column that
  // participates in global filtering
  const columnIds =
    columnId === '__global__'
      ? table
          .getAllLeafColumns()
          .filter((column) => column_getCanGlobalFilter(column))
          .map((column) => column.id)
      : [columnId]

  const facetedUniqueValues = new Map<any, number>()

  for (let i = 0; i < flatRows.length; i++) {
    for (let c = 0; c < columnIds.length; c++) {
      // the declared return type is Array, but rows return undefined for
      // columns without an accessor (e.g. display columns)
      const values = flatRows[i]!.getUniqueValues(columnIds[c]!) as
        | Array<unknown>
        | undefined
      if (!values) continue

      for (let j = 0; j < values.length; j++) {
        const value = values[j]
        const previousValue = facetedUniqueValues.get(value)
        facetedUniqueValues.set(
          value,
          previousValue === undefined ? 1 : previousValue + 1,
        )
      }
    }
  }

  return facetedUniqueValues
}
