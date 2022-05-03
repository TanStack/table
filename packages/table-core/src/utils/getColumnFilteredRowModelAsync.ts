import { TableInstance, RowModel, TableGenerics, Row } from '../types'
import { incrementalMemo } from '../utils'

export function getColumnFilteredRowModelAsync<
  TGenerics extends TableGenerics
>(opts?: {
  initialSync?: boolean
}): (instance: TableInstance<TGenerics>) => () => RowModel<TGenerics> {
  return instance =>
    incrementalMemo(
      () => [
        instance.getState().columnFilters,
        instance.getPreColumnFilteredRowModel(),
      ],
      (_sorting, rowModel): RowModel<TGenerics> => {
        return {
          rows: rowModel.rows.slice(),
          flatRows: [],
          rowsById: rowModel.rowsById,
        }
      },
      (columnFilters, rowModel) => rowModelRef => scheduleTask => {
        // TODO: Figure out how to do scheduled filtering
        // The trick will be batching those tasks in a way
        // that makes them fast. JS work loops don't tend to do well with
        // a high number of tasks that do one thing. Instead, shoot for each
        // task to have a few thousand opts (or whatever amount is generally
        // fast for most devices).
        throw new Error('')

        // if (!rowModel.rows.length || !columnFilters) {
        //   rowModelRef.current = rowModel
        // } else {
        //   const filterFromLeafRows = instance.options.filterFromLeafRows

        //   const filterRows = (
        //     rowsToFilter: Row<TGenerics>[],
        //     depth: number
        //   ) => {
        //     for (let i = 0; i < columnFilters.length; i++) {
        //       const { id: columnId, value: filterValue } = columnFilters[i]
        //       // Find the columnFilters column
        //       const column = instance.getColumn(columnId)

        //       if (!column) {
        //         if (process.env.NODE_ENV !== 'production') {
        //           console.warn(
        //             `Table: Could not find a column with id: ${columnId}`
        //           )
        //         }
        //         throw new Error()
        //       }

        //       if (depth === 0) {
        //         const preFilteredRows = [...rowsToFilter]
        //         column.getPreFilteredRows = () => preFilteredRows
        //       }

        //       const filterFn = instance.getColumnFilterFn(column.id)

        //       if (!filterFn) {
        //         if (process.env.NODE_ENV !== 'production') {
        //           console.warn(
        //             `Could not find a valid 'column.filterFn' for column with the ID: ${column.id}.`
        //           )
        //         }
        //         continue
        //       }

        //       // Pass the rows, id, filterValue and column to the filterFn
        //       // to get the filtered rows back
        //       rowsToFilter = filterFn(rowsToFilter, [columnId], filterValue)
        //     }

        //     return rowsToFilter
        //   }

        //   if (filterFromLeafRows) {
        //     return filterRowModelFromLeafs(rowModel.rows, filterRows, instance)
        //   }

        //   return filterRowModelFromRoot(rowModel.rows, filterRows, instance)
        // }

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
        //   column.getPreFilteredRows = () => rowModelRef.current.rows
        // })
      },
      {
        key: 'getColumnFilteredRowModelAsync',
        initialSync: opts?.initialSync,
        onProgress: progress => {
          instance.setState(old => ({
            ...old,
            columnFiltersProgress: progress,
          }))
        },
        debug: () => instance.options.debugAll ?? instance.options.debugTable,
        onChange: () => {
          instance.queue(() => {
            instance.queueResetSorting()
          })
        },
      }
    )
}
