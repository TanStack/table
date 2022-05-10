import { TableInstance, TableGenerics } from '../types'
import { memo } from '../utils'

export function getFacetedMinMaxValues<TGenerics extends TableGenerics>(): (
  instance: TableInstance<TGenerics>,
  columnId: string
) => () => [number, number] {
  return (instance, columnId) =>
    memo(
      () => [instance.getColumn(columnId).getFacetedRowModel()],
      facetedRowModel => {
        let facetedMinMaxValues: [any, any] = [
          facetedRowModel.flatRows[0]?.getValue(columnId) ?? null,
          facetedRowModel.flatRows[0]?.getValue(columnId) ?? null,
        ]

        for (let i = 0; i < facetedRowModel.flatRows.length; i++) {
          const value = facetedRowModel.flatRows[i]?.getValue(columnId)

          if (value < facetedMinMaxValues[0]) {
            facetedMinMaxValues[0] = value
          } else if (value > facetedMinMaxValues[1]) {
            facetedMinMaxValues[1] = value
          }
        }

        return facetedMinMaxValues
      },
      {
        key:
          process.env.NODE_ENV === 'development' &&
          'getFacetedMinMaxValues_' + columnId,
        debug: () => instance.options.debugAll ?? instance.options.debugTable,
        onChange: () => {},
      }
    )
}
