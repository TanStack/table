import { TableInstance, RowModel, TableGenerics, Row } from '../types'
import { memo } from '../utils'
import {
  filterRowModelFromLeafs,
  filterRowModelFromRoot,
} from './filterRowsUtils'

export function getGlobalFilteredRowModelSync<
  TGenerics extends TableGenerics
>(): (instance: TableInstance<TGenerics>) => () => RowModel<TGenerics> {
  return instance =>
    memo(
      () => [
        instance.getState().globalFilter,
        instance.getPreGlobalFilteredRowModel(),
      ],
      (globalFilter, rowModel) => {
        const globalFilteredRowModel: RowModel<TGenerics> = (() => {
          if (!rowModel.rows.length || !globalFilter) {
            return rowModel
          }

          const filterFromLeafRows = instance.options.filterFromLeafRows

          const filterFn = instance.getGlobalFilterFn()

          if (!filterFn) {
            if (process.env.NODE_ENV !== 'production') {
              console.warn(`Could not find a valid 'globalFilterType'`)
            }
            return rowModel
          }

          const filterableColumns = instance
            .getAllLeafColumns()
            .filter(column => column.getCanGlobalFilter())

          const filterableColumnIds = filterableColumns.map(d => d.id)

          const filterRows = (rows: Row<TGenerics>[]) => {
            return filterFn(rows, filterableColumnIds, globalFilter)
          }

          if (filterFromLeafRows) {
            return filterRowModelFromLeafs(rowModel.rows, filterRows, instance)
          }

          return filterRowModelFromRoot(rowModel.rows, filterRows, instance)
        })()

        // Now that each filtered column has it's partially filtered rows,
        // lets assign the final filtered rows to all of the other columns
        const nonFilteredColumns = instance
          .getAllLeafColumns()
          .filter(
            column =>
              !instance.getState().columnFilters?.find(d => d.id === column.id)
          )

        // This essentially enables faceted filter options to be built easily
        // using every column's preFilteredRows value

        nonFilteredColumns.forEach(column => {
          column.getPreFilteredRows = () => globalFilteredRowModel.rows
        })

        return globalFilteredRowModel
      },
      {
        key: 'getGlobalFilteredRowModelSync',
        debug: () => instance.options.debugAll ?? instance.options.debugTable,
        onChange: () => {
          instance.queue(() => {
            instance.queueResetSorting()
          })
        },
      }
    )
}
