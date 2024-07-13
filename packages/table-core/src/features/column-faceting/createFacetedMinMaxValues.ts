import { getMemoOptions, memo } from '../../utils'
import { row_getUniqueValues } from '../../core/rows/Rows.utils'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'

export function createFacetedMinMaxValues<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): (
  table: Table<TFeatures, TData>,
  columnId: string,
) => () => undefined | [number, number] {
  return (table, columnId) =>
    memo(
      () => [table.getColumn(columnId)?.getFacetedRowModel()],
      (facetedRowModel) => {
        if (!facetedRowModel) return undefined

        const firstValue =
          facetedRowModel.flatRows[0]?.getUniqueValues(columnId)

        if (typeof firstValue === 'undefined') {
          return undefined
        }

        const facetedMinMaxValues: [any, any] = [firstValue, firstValue]

        for (const row of facetedRowModel.flatRows) {
          const values = row_getUniqueValues(row, table, columnId)

          for (const value of values) {
            if (value < facetedMinMaxValues[0]) {
              facetedMinMaxValues[0] = value
            } else if (value > facetedMinMaxValues[1]) {
              facetedMinMaxValues[1] = value
            }
          }
        }

        return facetedMinMaxValues
      },
      getMemoOptions(table.options, 'debugTable', 'getFacetedMinMaxValues'),
    )
}
