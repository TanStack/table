import { TableInstance, Row, RowModel, AnyGenerics } from '../types'
import {
  filterRowModelFromLeafs,
  filterRowModelFromRoot,
} from './filterRowsUtils'

export function globalFilterRowsFn<TGenerics extends AnyGenerics>(
  instance: TableInstance<TGenerics>,
  rowModel: RowModel<TGenerics>
): RowModel<TGenerics> {
  const globalFilter = instance.getState().globalFilter

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
    filterRowModelFromLeafs(rowModel.rows, filterRows, instance)
  }

  return filterRowModelFromRoot(rowModel.rows, filterRows, instance)
}
