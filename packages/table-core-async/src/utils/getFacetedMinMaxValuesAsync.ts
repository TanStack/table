import { TableInstance, TableGenerics } from '../types'
import { batchLoop, incrementalMemo } from '../utils'

export function getFacetedMinMaxValuesAsync<
  TGenerics extends TableGenerics
>(opts?: {
  initialSync?: boolean
}): (
  instance: TableInstance<TGenerics>,
  columnId: string
) => () => undefined | [number, number] {
  return (instance, columnId) =>
    incrementalMemo(
      () => [instance.getColumn(columnId).getFacetedRowModel()],
      () => () => {
        return undefined
      },
      () => facetedRowModel => async scheduleTask => {
        const firstValue = facetedRowModel.flatRows[0]?.getValue(columnId)

        if (typeof firstValue === 'undefined') {
          return
        }

        const range: [number, number] = [firstValue, firstValue]

        await batchLoop(facetedRowModel.flatRows, 2500, scheduleTask, row => {
          const value = row?.getValue(columnId)

          if (value < range[0]) {
            range[0] = value
          } else if (value > range[1]) {
            range[1] = value
          }
        })

        return range
      },
      {
        instance,
        priority: 'facets',
        keepPrevious: () => instance.options.keepPreviousData,
        key:
          process.env.NODE_ENV === 'development' &&
          'getFacetedMinMaxValuesAsync_' + columnId,

        onProgress: progress => {
          instance.setState(old => ({
            ...old,
            facetProgress: {
              ...old.facetProgress,
              ['minMaxValues_' + columnId]: progress,
            },
          }))
        },
        debug: () => instance.options.debugAll ?? instance.options.debugTable,
        onChange: () => {},
      }
    )
}
