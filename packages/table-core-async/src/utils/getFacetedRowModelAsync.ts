import { TableInstance, RowModel, TableGenerics, Row } from '../types'
import { incrementalMemo } from '../utils'
import { filterRowsAsync } from './filterRowsUtils'

export function getFacetedRowModelAsync<
  TGenerics extends TableGenerics
>(opts?: {
  initialSync?: boolean
}): (
  instance: TableInstance<TGenerics>,
  columnId: string
) => () => RowModel<TGenerics> {
  return (instance, columnId) =>
    incrementalMemo(
      () => [
        instance.getPreFilteredRowModel(),
        instance.getState().columnFilters,
        instance.getState().globalFilter,
        instance.getFilteredRowModel(),
      ],
      () =>
        (preRowModel): RowModel<TGenerics> => {
          return {
            rows: preRowModel.rows.slice(),
            flatRows: [],
            rowsById: preRowModel.rowsById,
          }
        },
      () => (preRowModel, columnFilters, globalFilter) => async scheduleTask => {
        if (
          !preRowModel.rows.length ||
          (!columnFilters?.length && !globalFilter)
        ) {
          return preRowModel
        }

        const filterableIds = [
          ...columnFilters.map(d => d.id).filter(d => d !== columnId),
          globalFilter ? '__global__' : undefined,
        ].filter(Boolean) as string[]

        const filterRow = (row: Row<TGenerics>) => {
          // Horizontally filter rows through each column
          for (let i = 0; i < filterableIds.length; i++) {
            if (row.columnFilterMap[filterableIds[i]!] === false) {
              return false
            }
          }
          return true
        }

        return filterRowsAsync(
          preRowModel,
          500,
          scheduleTask,
          filterRow,
          instance
        )
      },
      {
        instance,
        priority: 'facets',
        keepPrevious: () => instance.options.keepPreviousData,
        key:
          process.env.NODE_ENV === 'development' &&
          'getFacetedRowModelAsync_' + columnId,

        onProgress: progress => {
          instance.setState(old => ({
            ...old,
            facetProgress: {
              ...old.facetProgress,
              [columnId]: progress,
            },
          }))
        },
        debug: () => instance.options.debugAll ?? instance.options.debugTable,
        onChange: () => {},
      }
    )
}
