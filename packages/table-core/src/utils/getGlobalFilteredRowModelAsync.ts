import { TableInstance, RowModel, AnyGenerics, Row } from '../types'
import { incrementalMemo, memo } from '../utils'
import {
  filterRowModelFromLeafs,
  filterRowModelFromRoot,
} from './filterRowsUtils'

export function getGlobalFilteredRowModelAsync<
  TGenerics extends AnyGenerics
>(opts?: {
  initialSync?: boolean
}): (instance: TableInstance<TGenerics>) => () => RowModel<TGenerics> {
  return instance =>
    incrementalMemo(
      () => [instance.getState().globalFilter, instance.getCoreRowModel()],
      (_globalFilter, rowModel): RowModel<TGenerics> => {
        return {
          rows: rowModel.rows.slice(),
          flatRows: [],
          rowsById: rowModel.rowsById,
        }
      },
      (globalFilter, rowModel) => rowModelRef => scheduleTask => {
        // TODO: Figure out how to do scheduled filtering
        // The trick will be batching those tasks in a way
        // that makes them fast. JS work loops don't tend to do well with
        // a high number of tasks that do one thing. Instead, shoot for each
        // task to have a few thousand opts (or whatever amount is generally
        // fast for most devices).
        throw new Error('')

        // const globalFilteredRowModel: RowModel<TGenerics> = (() => {
        //   if (!rowModel.rows.length || !globalFilter) {
        //     return rowModel
        //   }

        //   const filterFromLeafRows = instance.options.filterFromLeafRows

        //   const filterFn = instance.getGlobalFilterFn()

        //   if (!filterFn) {
        //     if (process.env.NODE_ENV !== 'production') {
        //       console.warn(`Could not find a valid 'globalFilterType'`)
        //     }
        //     return rowModel
        //   }

        //   const filterableColumns = instance
        //     .getAllLeafColumns()
        //     .filter(column => column.getCanGlobalFilter())

        //   const filterableColumnIds = filterableColumns.map(d => d.id)

        //   const filterRows = (rows: Row<TGenerics>[]) => {
        //     return filterFn(rows, filterableColumnIds, globalFilter)
        //   }

        //   if (filterFromLeafRows) {
        //     filterRowModelFromLeafs(rowModel.rows, filterRows, instance)
        //   }

        //   return filterRowModelFromRoot(rowModel.rows, filterRows, instance)
        // })()

        // // Now that each filtered column has it's partially filtered rows,
        // // lets assign the final filtered rows to all of the other columns
        // const nonFilteredColumns = instance
        //   .getAllLeafColumns()
        //   .filter(
        //     column =>
        //       !instance.getState().columnFilters?.find(d => d.id === column.id)
        //   )

        // // This essentially enables faceted filter options to be built easily
        // // using every column's preFilteredRows value

        // nonFilteredColumns.forEach(column => {
        //   column.getPreFilteredRows = () => globalFilteredRowModel.rows
        // })

        // return globalFilteredRowModel
      },
      {
        key: 'getGlobalFilteredRowModelAsync',
        initialSync: opts?.initialSync,
        onProgress: progress => {
          instance.setState(old => ({ ...old, globalFilterProgress: progress }))
        },
        debug: () => instance.options.debugAll ?? instance.options.debugTable,
        onChange: () => {
          instance._notifySortingReset()
        },
      }
    )
}
