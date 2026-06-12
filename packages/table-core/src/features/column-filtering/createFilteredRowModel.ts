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
import type { Table, Table_Internal } from '../../types/Table'
import type { Row } from '../../types/Row'
import type {
  ResolvedColumnFilter,
  Row_ColumnFiltering,
} from './columnFilteringFeature.types'

/**
 * Creates a memoized filtered row model factory.
 *
 * The factory reads the relevant table state atoms and options, then returns a row model function used by the table row-model pipeline.
 *
 * Register filter functions with the `filterFns` slot on the `features` option:
 * `tableFeatures({ columnFilteringFeature, filteredRowModel: createFilteredRowModel(), filterFns })`.
 */
export function createFilteredRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(): (table: Table<TFeatures, TData>) => () => RowModel<TFeatures, TData> {
  return (_table) => {
    const table = _table as unknown as Table_Internal<TFeatures, TData>
    return tableMemo({
      feature: 'columnFilteringFeature',
      table,
      fnName: 'table.getFilteredRowModel',
      memoDeps: () => [
        table.getPreFilteredRowModel(),
        table.atoms.columnFilters?.get(),
        table.atoms.globalFilter?.get(),
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
  const columnFilters = table.atoms.columnFilters?.get()
  const globalFilter = table.atoms.globalFilter?.get()

  if (!rowModel.rows.length || (!columnFilters?.length && !globalFilter)) {
    const flatRows = rowModel.flatRows as Array<
      Row<TFeatures, TData> & Partial<Row_ColumnFiltering<TFeatures, TData>>
    >
    for (let i = 0; i < flatRows.length; i++) {
      const row = flatRows[i]!
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
  const flatRows = rowModel.flatRows as Array<
    Row<TFeatures, TData> & Partial<Row_ColumnFiltering<TFeatures, TData>>
  >
  for (let i = 0; i < flatRows.length; i++) {
    const row = flatRows[i]!
    row.columnFilters = {}

    if (resolvedColumnFilters.length) {
      for (let j = 0; j < resolvedColumnFilters.length; j++) {
        const currentColumnFilter = resolvedColumnFilters[j]!
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
      for (let j = 0; j < resolvedGlobalFilters.length; j++) {
        const currentGlobalFilter = resolvedGlobalFilters[j]!
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
    for (let i = 0; i < filterableIds.length; i++) {
      if (row.columnFilters[filterableIds[i]!] === false) {
        return false
      }
    }
    return true
  }

  // Filter final rows using all of the active filters
  return filterRows(rowModel.rows, filterRowsImpl as any, table)
}
