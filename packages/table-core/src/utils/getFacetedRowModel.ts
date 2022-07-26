import { Table, RowModel, Row, RowData } from '../types'
import { memo } from '../utils'
import { filterRows } from './filterRowsUtils'

export function getFacetedRowModel<TData extends RowData>(): (
  table: Table<TData>,
  columnId: string
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
          (!columnFilters?.length && !globalFilter)
        ) {
          return preRowModel
        }

        const filterableIds = [
          ...columnFilters.map(d => d.id).filter(d => d !== columnId),
          globalFilter ? '__global__' : undefined,
        ].filter(Boolean) as string[]

        const filterRowsImpl = (row: Row<TData>) => {
          // Horizontally filter rows through each column
          for (let i = 0; i < filterableIds.length; i++) {
            if (row.columnFilters[filterableIds[i]!] === false) {
              return false
            }
          }
          return true
        }

        return filterRows(preRowModel.rows, filterRowsImpl, table)
      },
      {
        key:
          process.env.NODE_ENV === 'development' &&
          'getFacetedRowModel_' + columnId,
        debug: () => table.options.debugAll ?? table.options.debugTable,
        onChange: () => {},
      }
    )
}
