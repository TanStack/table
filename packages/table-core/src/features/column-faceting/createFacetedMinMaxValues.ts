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
 * Creates a memoized faceted min max values helper for faceted filtering.
 *
 * The returned function derives facet data from the table row model and relevant filter state so filter UIs can display available values.
 */
export function createFacetedMinMaxValues<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(): (
  table: Table<TFeatures, TData>,
  columnId: string,
) => () => undefined | [number, number] {
  return (_table, columnId) => {
    const table = _table as unknown as Table_Internal<TFeatures, TData>
    return tableMemo({
      feature: 'columnFacetingFeature',
      fnName: 'table.getFacetedMinMaxValues',
      fn: () => {
        let flatRows: Array<Row<TFeatures, TData>>

        if (columnId === '__global__') {
          flatRows = callMemoOrStaticFn(
            table,
            'getGlobalFacetedRowModel',
            table_getGlobalFacetedRowModel,
          ).flatRows
        } else {
          const column = table.getColumn(columnId)
          flatRows = column
            ? callMemoOrStaticFn(
                column,
                'getFacetedRowModel',
                column_getFacetedRowModel,
                table,
              ).flatRows
            : table.getPreFilteredRowModel().flatRows
        }

        return _createFacetedMinMaxValues(table, columnId, flatRows)
      },
      table,
    })
  }
}

function _createFacetedMinMaxValues<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  table: Table_Internal<TFeatures, TData>,
  columnId: string,
  flatRows: Array<Row<TFeatures, TData>>,
): undefined | [number, number] {
  if (!flatRows.length) return undefined

  // The global context aggregates values across every column that
  // participates in global filtering
  const columnIds =
    columnId === '__global__'
      ? table
          .getAllLeafColumns()
          .filter((column) => column_getCanGlobalFilter(column))
          .map((column) => column.id)
      : [columnId]

  let facetedMinValue = Number.POSITIVE_INFINITY
  let facetedMaxValue = Number.NEGATIVE_INFINITY
  let foundAny = false

  for (let i = 0; i < flatRows.length; i++) {
    for (let c = 0; c < columnIds.length; c++) {
      const value = Number(flatRows[i]!.getValue(columnIds[c]!))
      if (Number.isNaN(value)) continue
      foundAny = true
      if (value < facetedMinValue) facetedMinValue = value
      if (value > facetedMaxValue) facetedMaxValue = value
    }
  }

  if (!foundAny) return undefined
  return [facetedMinValue, facetedMaxValue]
}
