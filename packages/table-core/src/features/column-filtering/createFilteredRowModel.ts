import { getMemoOptions, memo } from '../../utils'
import { table_getColumn } from '../../core/columns/Columns.utils'
import { table_getGlobalFilterFn } from '../global-filtering/GlobalFiltering.utils'
import { filterRows } from './filterRowsUtils'
import { column_getFilterFn } from './ColumnFiltering.utils'
import type { Row, RowData, RowModel, Table } from '../../types'
import type { ResolvedColumnFilter } from './ColumnFiltering.types'

export function createFilteredRowModel<TData extends RowData>(): (
  table: Table<TData>,
) => () => RowModel<TData> {
  return (table) =>
    memo(
      () => [
        table.getPreFilteredRowModel(),
        table.getState().columnFilters,
        table.getState().globalFilter,
      ],
      (rowModel, columnFilters, globalFilter) => {
        if (!rowModel.rows.length || (!columnFilters.length && !globalFilter)) {
          for (const row of rowModel.flatRows) {
            row.columnFilters = {}
            row.columnFiltersMeta = {}
          }
          return rowModel
        }

        const resolvedColumnFilters: Array<ResolvedColumnFilter<TData>> = []
        const resolvedGlobalFilters: Array<ResolvedColumnFilter<TData>> = []

        columnFilters.forEach((d) => {
          const column = table_getColumn(table, d.id)

          if (!column) {
            return
          }

          const filterFn = column_getFilterFn(column, table)

          if (!filterFn) {
            if (process.env.NODE_ENV !== 'production') {
              console.warn(
                `Could not find a valid 'column.filterFn' for column with the ID: ${column.id}.`,
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

        const filterableIds = columnFilters.map((d) => d.id)

        const globalFilterFn = table_getGlobalFilterFn(table)

        const globallyFilterableColumns = table
          .getAllLeafColumns()
          .filter((column) => column.getCanGlobalFilter())

        if (
          globalFilter &&
          globalFilterFn &&
          globallyFilterableColumns.length
        ) {
          filterableIds.push('__global__')

          globallyFilterableColumns.forEach((column) => {
            resolvedGlobalFilters.push({
              id: column.id,
              filterFn: globalFilterFn,
              resolvedValue:
                globalFilterFn.resolveFilterValue?.(globalFilter) ??
                globalFilter,
            })
          })
        }

        // Flag the prefiltered row model with each filter state
        for (const row of rowModel.flatRows) {
          row.columnFilters = {}

          if (resolvedColumnFilters.length) {
            for (const currentColumnFilter of resolvedColumnFilters) {
              const id = currentColumnFilter.id

              // Tag the row with the column filter state
              row.columnFilters[id] = currentColumnFilter.filterFn(
                row,
                id,
                currentColumnFilter.resolvedValue,
                (filterMeta) => {
                  row.columnFiltersMeta[id] = filterMeta
                },
              )
            }
          }

          if (resolvedGlobalFilters.length) {
            for (const currentGlobalFilter of resolvedGlobalFilters) {
              const id = currentGlobalFilter.id
              // Tag the row with the first truthy global filter state
              if (
                currentGlobalFilter.filterFn(
                  row,
                  id,
                  currentGlobalFilter.resolvedValue,
                  (filterMeta) => {
                    row.columnFiltersMeta[id] = filterMeta
                  },
                )
              ) {
                row.columnFilters.__global__ = true
                break
              }
            }

            if (row.columnFilters.__global__ !== true) {
              row.columnFilters.__global__ = false
            }
          }
        }

        const filterRowsImpl = (row: Row<TData>) => {
          // Horizontally filter rows through each column
          for (const columnId of filterableIds) {
            if (row.columnFilters[columnId] === false) {
              return false
            }
          }
          return true
        }

        // Filter final rows using all of the active filters
        return filterRows(rowModel.rows, filterRowsImpl, table)
      },
      getMemoOptions(table.options, 'debugTable', 'getFilteredRowModel', () =>
        table._autoResetPageIndex(),
      ),
    )
}
