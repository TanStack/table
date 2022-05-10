import { TableInstance, TableGenerics } from '../types'
import { batchLoop, incrementalMemo } from '../utils'

export function getFacetedMinMaxValuesAsync<
  TGenerics extends TableGenerics
>(opts?: {
  initialSync?: boolean
}): (
  instance: TableInstance<TGenerics>,
  columnId: string
) => () => [number, number] {
  return (instance, columnId) =>
    incrementalMemo(
      () => [instance.getColumn(columnId).getFacetedRowModel()],
      () => facetedRowModel =>
        [
          facetedRowModel.flatRows[0]?.getValue(columnId) ?? undefined,
          facetedRowModel.flatRows[0]?.getValue(columnId) ?? undefined,
        ],
      () => facetedRowModel => async scheduleTask => {
        const range = [
          facetedRowModel.flatRows[0]?.getValue(columnId) ?? undefined,
          facetedRowModel.flatRows[0]?.getValue(columnId) ?? undefined,
        ] as [number, number]

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
