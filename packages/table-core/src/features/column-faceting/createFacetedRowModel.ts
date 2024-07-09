import { getMemoOptions, memo } from '../../utils'
import { filterRows } from '../column-filtering/filterRowsUtils'
import type { Row, RowData, RowModel, Table } from '../../types'

export function createFacetedRowModel<TData extends RowData>(): (
  table: Table<TData>,
  columnId: string,
) => () => RowModel<TData> {
  return (table, columnId) =>
    memo(
      () => [
        table.getPreFilteredRowModel(),
        table.getState().columnFilters,
        table.getState().globalFilter,
        table.getFilteredRowModel(),
      ],
      (preRowModel, columnFilters, globalFilter) => {
        if (
          !preRowModel.rows.length ||
          (!columnFilters.length && !globalFilter)
        ) {
          return preRowModel
        }

        const filterableIds = [
          ...columnFilters.map((d) => d.id).filter((d) => d !== columnId),
          globalFilter ? '__global__' : undefined,
        ].filter(Boolean) as Array<string>

        const filterRowsImpl = (row: Row<TData>) => {
          // Horizontally filter rows through each column
          for (const colId of filterableIds) {
            if (row.columnFilters[colId] === false) {
              return false
            }
          }
          return true
        }

        return filterRows(preRowModel.rows, filterRowsImpl, table)
      },
      getMemoOptions(table.options, 'debugTable', 'getFacetedRowModel'),
    )
}
