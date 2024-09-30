import { isDev, tableMemo } from '../../utils'
import { row_getUniqueValues } from '../../core/rows/Rows.utils'
import { column_getFacetedRowModel } from './ColumnFaceting.utils'
import type { Fns } from '../../types/Fns'
import type { RowModel } from '../../types/RowModel'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'

export function createFacetedMinMaxValues<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(): (
  table: Table<TFeatures, TFns, TData>,
  columnId: string,
) => () => undefined | [number, number] {
  return (table, columnId) =>
    tableMemo({
      debug: isDev && (table.options.debugAll ?? table.options.debugTable),
      fnName: 'createFacetedMinMaxValues',
      memoDeps: () => [
        column_getFacetedRowModel(table.getColumn(columnId), table)(),
      ],
      fn: (facetedRowModel) =>
        _createFacetedMinMaxValues(table, columnId, facetedRowModel),
    })
}

function _createFacetedMinMaxValues<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
>(
  table: Table<TFeatures, TFns, TData>,
  columnId: string,
  facetedRowModel?: RowModel<TFeatures, TFns, TData>,
): undefined | [number, number] {
  if (!facetedRowModel) return undefined

  const uniqueValues = facetedRowModel.flatRows
    .flatMap((flatRow) => row_getUniqueValues(flatRow, table, columnId) ?? [])
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
