import { tableMemo } from '../../utils'
import { table_getColumn } from '../../core/columns/coreColumnsFeature.utils'
import {
  column_getCanGlobalFilter,
  table_getGlobalFilterFn,
} from '../global-filtering/globalFilteringFeature.utils'
import { table_autoResetPageIndex } from '../row-pagination/rowPaginationFeature.utils'
import { filterRows } from './filterRowsUtils'
import { column_getFilterFn } from './columnFilteringFeature.utils'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { Table_Internal } from '../../types/Table'
import type { Row } from '../../types/Row'
import type {
  FilterFn,
  FilterFns,
  ResolvedColumnFilter,
  Row_ColumnFiltering,
} from './columnFilteringFeature.types'

export function createFilteredRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  filterFns: Record<keyof FilterFns, FilterFn<TFeatures, TData>>,
): (
  table: Table_Internal<TFeatures, TData>,
) => () => RowModel<TFeatures, TData> {
  return (table) => {
    if (!table._rowModelFns.filterFns) table._rowModelFns.filterFns = filterFns
    return tableMemo({
      feature: 'columnFilteringFeature',
      table,
      fnName: 'table.getFilteredRowModel',
      memoDeps: () => [
        table.getPreFilteredRowModel(),
        table.options.state?.columnFilters,
        table.options.state?.globalFilter,
      ],
      fn: () => _createFilteredRowModel(table),
      onAfterUpdate: () => table_autoResetPageIndex(table),
    })
  }
}

function _createFilteredRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  const rowModel = table.getPreFilteredRowModel()
  const { columnFilters, globalFilter } = table.options.state ?? {}

  if (!rowModel.rows.length || (!columnFilters?.length && !globalFilter)) {
    for (const row of rowModel.flatRows as Array<
      Row<TFeatures, TData> & Partial<Row_ColumnFiltering<TFeatures, TData>>
    >) {
      row.columnFilters = {}
      row.columnFiltersMeta = {}
    }
    return rowModel
  }

  const resolvedColumnFilters: Array<ResolvedColumnFilter<TFeatures, TData>> =
    []
  const resolvedGlobalFilters: Array<ResolvedColumnFilter<TFeatures, TData>> =
    []

  columnFilters?.forEach((columnFilter) => {
    const column = table_getColumn(table, columnFilter.id)

    if (!column) {
      return
    }

    const filterFn = column_getFilterFn(column)!

    resolvedColumnFilters.push({
      id: columnFilter.id,
      filterFn,
      resolvedValue:
        filterFn.resolveFilterValue?.(columnFilter.value) ?? columnFilter.value,
    })
  })

  const filterableIds = columnFilters?.map((d) => d.id) ?? []

  const globalFilterFn = table_getGlobalFilterFn(table)

  const globallyFilterableColumns = table
    .getAllLeafColumns()
    .filter((column) => column_getCanGlobalFilter(column))

  if (globalFilter && globalFilterFn && globallyFilterableColumns.length) {
    filterableIds.push('__global__')

    globallyFilterableColumns.forEach((column) => {
      resolvedGlobalFilters.push({
        id: column.id,
        filterFn: globalFilterFn,
        resolvedValue:
          globalFilterFn.resolveFilterValue?.(globalFilter) ?? globalFilter,
      })
    })
  }

  // Flag the pre-filtered row model with each filter state
  for (const row of rowModel.flatRows as Array<
    Row<TFeatures, TData> & Partial<Row_ColumnFiltering<TFeatures, TData>>
  >) {
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
            !row.columnFiltersMeta
              ? (row.columnFiltersMeta = {})
              : (row.columnFiltersMeta[id] = filterMeta)
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
              !row.columnFiltersMeta
                ? (row.columnFiltersMeta = {})
                : (row.columnFiltersMeta[id] = filterMeta)
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

  const filterRowsImpl = (
    row: Row<TFeatures, TData> & Row_ColumnFiltering<TFeatures, TData>,
  ) => {
    // Horizontally filter rows through each column
    for (const columnId of filterableIds) {
      if (row.columnFilters[columnId] === false) {
        return false
      }
    }
    return true
  }

  // Filter final rows using all of the active filters
  return filterRows(rowModel.rows, filterRowsImpl as any, table)
}
