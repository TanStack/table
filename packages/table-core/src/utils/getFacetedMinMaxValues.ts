import { TableInstance, TableGenerics } from '../types'
import { memo } from '../utils'

export function getFacetedMinMaxValues<TGenerics extends TableGenerics>(): (
  instance: TableInstance<TGenerics>,
  columnId: string
) => () => undefined | [number, number] {
  return (instance, columnId) =>
    memo(
      () => [instance.getColumn(columnId).getFacetedRowModel()],
      facetedRowModel => {
        const firstValue = facetedRowModel.flatRows[0]?.getValue(columnId)

        if (typeof firstValue === 'undefined') {
          return undefined
        }

        let facetedMinMaxValues: [any, any] = [firstValue, firstValue]

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
