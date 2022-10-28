import { Table, RowData } from '../types'
import { memo } from '../utils'

export function getFacetedUniqueValues<TData extends RowData>(): (
  table: Table<TData>,
  columnId: string
) => () => Map<any, number> {
  return (table, columnId) =>
    memo(
      () => [table.getColumn(columnId).getFacetedRowModel()],
      facetedRowModel => {
        let facetedUniqueValues = new Map<any, number>()

        for (let i = 0; i < facetedRowModel.flatRows.length; i++) {
          const values =
            facetedRowModel.flatRows[i]!.getUniqueValues<number>(columnId)

          for (let j = 0; j < values.length; j++) {
            const value = values[j]!

            if (facetedUniqueValues.has(value)) {
              facetedUniqueValues.set(
                value,
                (facetedUniqueValues.get(value) ?? 0) + 1
              )
            } else {
              facetedUniqueValues.set(value, 1)
            }
          }
        }

        return facetedUniqueValues
      },
      {
        key:
          process.env.NODE_ENV === 'development' &&
          'getFacetedUniqueValues_' + columnId,
        debug: () => table.options.debugAll ?? table.options.debugTable,
        onChange: () => {},
      }
    )
}
