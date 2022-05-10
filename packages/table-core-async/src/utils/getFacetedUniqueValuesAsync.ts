import { TableInstance, TableGenerics } from '../types'
import { batchLoop, incrementalMemo } from '../utils'

export function getFacetedUniqueValuesAsync<
  TGenerics extends TableGenerics
>(opts?: {
  initialSync?: boolean
}): (
  instance: TableInstance<TGenerics>,
  columnId: string
) => () => Map<any, number> {
  return (instance, columnId) =>
    incrementalMemo(
      () => [instance.getColumn(columnId).getFacetedRowModel()],
      () => () => new Map() as Map<any, number>,
      () => facetedRowModel => async scheduleTask => {
        const map = new Map<any, number>()

        await batchLoop(facetedRowModel.flatRows, 2500, scheduleTask, row => {
          const value = row?.getValue(columnId)

          if (map.has(value)) {
            map.set(value, (map.get(value) ?? 0) + 1)
          } else {
            map.set(value, 1)
          }
        })

        return map
      },
      {
        instance,
        priority: 'facets',
        keepPrevious: () => instance.options.keepPreviousData,
        key:
          process.env.NODE_ENV === 'development' &&
          columnId + 'getFacetedUniqueValuesAsync_ ' + columnId,

        onProgress: progress => {
          instance.setState(old => ({
            ...old,
            facetProgress: {
              ...old.facetProgress,
              ['getFacetedUniqueValuesAsync_' + columnId]: progress,
            },
          }))
        },
        debug: () => instance.options.debugAll ?? instance.options.debugTable,
        onChange: () => {},
      }
    )
}
