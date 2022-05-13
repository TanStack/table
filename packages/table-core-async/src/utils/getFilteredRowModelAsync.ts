import { ResolvedColumnFilter } from '../features/Filters'
import { TableInstance, RowModel, TableGenerics, Row } from '../types'
import { batchLoop, incrementalMemo } from '../utils'
import {
  filterRowModelFromLeafsAsync,
  filterRowModelFromRootAsync,
  filterRowsAsync,
} from './filterRowsUtils'

export function getFilteredRowModelAsync<
  TGenerics extends TableGenerics
>(opts?: {
  initialSync?: boolean
}): (instance: TableInstance<TGenerics>) => () => RowModel<TGenerics> {
  return instance =>
    incrementalMemo(
      () => [
        instance.getPreFilteredRowModel(),
        instance.getState().columnFilters,
        instance.getState().globalFilter,
      ],
      () =>
        (preRowModel): RowModel<TGenerics> => {
          return preRowModel
        },
      () => (preRowModel, columnFilters, globalFilter) => async scheduleTask => {
        if (
          !preRowModel.rows.length ||
          (!columnFilters?.length && !globalFilter)
        ) {
          return preRowModel
        }

        const resolvedColumnFilters: ResolvedColumnFilter<TGenerics>[] = []
        const resolvedGlobalFilters: ResolvedColumnFilter<TGenerics>[] = []

        ;(columnFilters ?? []).forEach(d => {
          const column = instance.getColumn(d.id)

          if (!column) {
            if (process.env.NODE_ENV !== 'production') {
              console.warn(
                `Table: Could not find a column to filter with columnId: ${d.id}`
              )
            }
          }

          const filterFn = column.getFilterFn()!

          if (!filterFn) {
            if (process.env.NODE_ENV !== 'production') {
              console.warn(
                `Could not find a valid 'column.filterFn' for column with the ID: ${column.id}.`
              )
            }
            return
          }

          resolvedColumnFilters.push({
            id: d.id,
            filterFn,
            resolvedValue: filterFn.resolveFilterValue?.(d.value) ?? d.value,
          })
        })

        const filterableIds = columnFilters.map(d => d.id)

        const globalFilterFn = instance.getGlobalFilterFn()

        const globallyFilterableColumns = instance
          .getAllLeafColumns()
          .filter(column => column.getCanGlobalFilter())

        if (
          globalFilter &&
          globalFilterFn &&
          globallyFilterableColumns.length
        ) {
          filterableIds.push('__global__')

          globallyFilterableColumns.forEach(column => {
            resolvedGlobalFilters.push({
              id: column.id,
              filterFn: globalFilterFn,
              resolvedValue:
                globalFilterFn.resolveFilterValue?.(globalFilter) ??
                globalFilter,
            })
          })
        }

        let currentColumnFilter
        let currentGlobalFilter

        await batchLoop(preRowModel.flatRows, 1000, scheduleTask, row => {
          row.columnFilterMap = {}

          if (resolvedColumnFilters.length) {
            for (let i = 0; i < resolvedColumnFilters.length; i++) {
              currentColumnFilter = resolvedColumnFilters[i]!

              // Tag the row with the column filter state
              row.columnFilterMap[currentColumnFilter.id] =
                currentColumnFilter.filterFn(
                  row,
                  currentColumnFilter.id,
                  currentColumnFilter.resolvedValue
                )
            }
          }

          if (resolvedGlobalFilters.length) {
            for (let i = 0; i < resolvedGlobalFilters.length; i++) {
              currentGlobalFilter = resolvedGlobalFilters[i]!
              // Tag the row with the first truthy global filter state
              if (
                currentGlobalFilter.filterFn(
                  row,
                  currentGlobalFilter.id,
                  currentGlobalFilter.resolvedValue
                )
              ) {
                row.columnFilterMap.__global__ = true
                break
              }
            }

            if (row.columnFilterMap.__global__ !== true) {
              row.columnFilterMap.__global__ = false
            }
          }
        })

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
          1000,
          scheduleTask,
          filterRow,
          instance
        )
      },
      {
        instance,
        priority: 'data',
        keepPrevious: () => instance.options.keepPreviousData,
        key:
          process.env.NODE_ENV === 'production' && 'getFilteredRowModelAsync',
        onProgress: progress => {
          instance.setState(old => ({
            ...old,
            filtersProgress: progress,
          }))
        },
        debug: () => instance.options.debugAll ?? instance.options.debugTable,
        onChange: () => {
          instance._autoResetPageIndex()
        },
      }
    )
}
