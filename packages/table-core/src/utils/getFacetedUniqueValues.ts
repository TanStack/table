import { TableInstance, TableGenerics } from '../types'
import { memo } from '../utils'

export function getFacetedUniqueValues<TGenerics extends TableGenerics>(): (
  instance: TableInstance<TGenerics>,
  columnId: string
) => () => Map<any, number> {
  return (instance, columnId) =>
    memo(
      () => [instance.getColumn(columnId).getFacetedRowModel()],
      facetedRowModel => {
        let facetedUniqueValues = new Map<any, number>()

        for (let i = 0; i < facetedRowModel.flatRows.length; i++) {
          const value = facetedRowModel.flatRows[i]?.getValue(columnId)

          if (facetedUniqueValues.has(value)) {
            facetedUniqueValues.set(
              value,
              (facetedUniqueValues.get(value) ?? 0) + 1
            )
          } else {
            facetedUniqueValues.set(value, 1)
          }
        }

        return facetedUniqueValues
      },
      {
        key:
          process.env.NODE_ENV === 'development' &&
          'getFacetedUniqueValues_' + columnId,
        debug: () => instance.options.debugAll ?? instance.options.debugTable,
        onChange: () => {},
      }
    )
}
