import { AnyGenerics, TableInstance, Row, RowModel } from '../types'
import {
  filterRowModelFromLeafs,
  filterRowModelFromRoot,
} from './filterRowsUtils'

export function columnFilterRowsFn<TGenerics extends AnyGenerics>(
  instance: TableInstance<TGenerics>,
  rowModel: RowModel<TGenerics>
): RowModel<TGenerics> {
  const columnFilters = instance.getState().columnFilters
  const filterFromLeafRows = instance.options.filterFromLeafRows

  const filterRows = (rowsToFilter: Row<TGenerics>[], depth: number) => {
    for (let i = 0; i < columnFilters.length; i++) {
      const { id: columnId, value: filterValue } = columnFilters[i]
      // Find the columnFilters column
      const column = instance.getColumn(columnId)

      if (!column) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`Table: Could not find a column with id: ${columnId}`)
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
}
