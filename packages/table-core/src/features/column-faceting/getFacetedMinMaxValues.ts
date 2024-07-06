import { getMemoOptions, memo } from '../../utils'
import type { RowData, Table } from '../../types'

export function getFacetedMinMaxValues<TData extends RowData>(): (
  table: Table<TData>,
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
          const values = row.getUniqueValues<number>(columnId)

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
