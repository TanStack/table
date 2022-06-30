import { Table, RowModel, TableGenerics, Row, RowData } from '../types'
import { memo } from '../utils'
import { filterRows } from './filterRowsUtils'

export function getFacetedRowModel<TData extends RowData>(): (
  instance: Table<TData>,
  columnId: string
) => () => RowModel<TData> {
  return (instance, columnId) =>
    memo(
      () => [
        instance.getPreFilteredRowModel(),
        instance.getState().columnFilters,
        instance.getState().globalFilter,
        instance.getFilteredRowModel(),
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

        return filterRows(preRowModel.rows, filterRowsImpl, instance)
      },
      {
        key:
          process.env.NODE_ENV === 'development' &&
          'getFacetedRowModel_' + columnId,
        debug: () => instance.options.debugAll ?? instance.options.debugTable,
        onChange: () => {},
      }
    )
}
