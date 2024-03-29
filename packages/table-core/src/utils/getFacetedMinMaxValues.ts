import { Table, RowData } from '../types'
import { getMemoOptions, memo } from '../utils'

export function getFacetedMinMaxValues<TData extends RowData>(): (
  table: Table<TData>,
  columnId: string
) => () => undefined | [number, number] {
  return (table, columnId) =>
    memo(
      () => [table.getColumn(columnId)?.getFacetedRowModel()],
      facetedRowModel => {
        if (!facetedRowModel) return undefined

        const firstValue =
          facetedRowModel.flatRows[0]?.getUniqueValues(columnId)

        if (typeof firstValue === 'undefined') {
          return undefined
        }

        let facetedMinMaxValues: [any, any] = [firstValue, firstValue]

        for (let i = 0; i < facetedRowModel.flatRows.length; i++) {
          const values =
            facetedRowModel.flatRows[i]!.getUniqueValues<number>(columnId)

          for (let j = 0; j < values.length; j++) {
            const value = values[j]!

            if (value < facetedMinMaxValues[0]) {
              facetedMinMaxValues[0] = value
            } else if (value > facetedMinMaxValues[1]) {
              facetedMinMaxValues[1] = value
            }
          }
        }

        return facetedMinMaxValues
      },
      getMemoOptions(table.options, 'debugTable', 'getFacetedMinMaxValues')
    )
}
