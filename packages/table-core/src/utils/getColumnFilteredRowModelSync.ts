import { TableInstance, RowModel, AnyGenerics, Row } from '../types'
import { memo } from '../utils'
import {
  filterRowModelFromLeafs,
  filterRowModelFromRoot,
} from './filterRowsUtils'

export function getColumnFilteredRowModelSync<
  TGenerics extends AnyGenerics
>(): (instance: TableInstance<TGenerics>) => () => RowModel<TGenerics> {
  return instance =>
    memo(
      () => [instance.getState().columnFilters, instance.getCoreRowModel()],
      (columnFilters, rowModel) => {
        const columnFilteredRowModel: RowModel<TGenerics> = (() => {
          if (!rowModel.rows.length || !columnFilters) {
            return rowModel
          }

          const filterFromLeafRows = instance.options.filterFromLeafRows

          const filterRows = (
            rowsToFilter: Row<TGenerics>[],
            depth: number
          ) => {
            for (let i = 0; i < columnFilters.length; i++) {
              const { id: columnId, value: filterValue } = columnFilters[i]
              // Find the columnFilters column
              const column = instance.getColumn(columnId)

              if (!column) {
                if (process.env.NODE_ENV !== 'production') {
                  console.warn(
                    `Table: Could not find a column with id: ${columnId}`
                  )
                }
                throw new Error()
              }

              if (depth === 0) {
                const preFilteredRows = [...rowsToFilter]
                column.getPreFilteredRows = () => preFilteredRows
              }

              const filterFn = instance.getColumnFilterFn(column.id)

              if (!filterFn) {
                if (process.env.NODE_ENV !== 'production') {
                  console.warn(
                    `Could not find a valid 'column.filterType' for column with the ID: ${column.id}.`
                  )
                }
                continue
              }

              // Pass the rows, id, filterValue and column to the filterFn
              // to get the filtered rows back
              rowsToFilter = filterFn(rowsToFilter, [columnId], filterValue)
            }

            return rowsToFilter
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
          column.getPreFilteredRows = () => columnFilteredRowModel.rows
        })

        return columnFilteredRowModel
      },
      {
        key: 'getColumnFilteredRowModelSync',
        debug: () => instance.options.debugAll ?? instance.options.debugTable,
        onChange: () => {
          instance._notifySortingReset()
        },
      }
    )
}
