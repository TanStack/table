import { tableMemo } from '../../utils'
import { filterRows } from '../column-filtering/filterRowsUtils'
import type { Table, Table_Internal } from '../../types/Table'
import type {
  ColumnFiltersState,
  Row_ColumnFiltering,
} from '../column-filtering/columnFilteringFeature.types'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { Row } from '../../types/Row'
import type { RowData } from '../../types/type-utils'

/**
 * Creates a memoized faceted row model factory.
 *
 * The factory reads the relevant table state atoms and options, then returns a row model function used by the table row-model pipeline.
 */
export function createFacetedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(): (
  table: Table<TFeatures, TData>,
  columnId: string,
) => () => RowModel<TFeatures, TData> {
  return (_table, columnId) => {
    const table = _table as unknown as Table_Internal<TFeatures, TData>
    return tableMemo({
      feature: 'columnFacetingFeature',
      table,
      fnName: 'createFacetedRowModel',
      memoDeps: () => [
        table.getPreFilteredRowModel(),
        table.atoms.columnFilters?.get(),
        table.atoms.globalFilter?.get(),
        table.getFilteredRowModel(),
      ],
      fn: (preRowModel, columnFilters, globalFilter) =>
        _createFacetedRowModel(
          table,
          columnId,
          preRowModel,
          columnFilters,
          globalFilter,
        ),
    })
  }
}

function _createFacetedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData = any,
>(
  table: Table_Internal<TFeatures, TData>,
  columnId: string,
  preRowModel: RowModel<TFeatures, TData>,
  columnFilters?: ColumnFiltersState,
  globalFilter?: string,
) {
  if (!preRowModel.rows.length || (!columnFilters?.length && !globalFilter)) {
    return preRowModel
  }

  const filterableIds: Array<string> = []
  if (columnFilters) {
    for (let i = 0; i < columnFilters.length; i++) {
      const id = columnFilters[i]!.id
      if (id !== columnId) filterableIds.push(id)
    }
  }
  if (globalFilter) filterableIds.push('__global__')

  const filterRowsImpl = (
    row: Row<TFeatures, TData> & Partial<Row_ColumnFiltering<TFeatures, TData>>,
  ) => {
    // Horizontally filter rows through each column
    for (let i = 0; i < filterableIds.length; i++) {
      if (row.columnFilters?.[filterableIds[i]!] === false) {
        return false
      }
    }
    return true
  }

  return filterRows(preRowModel.rows, filterRowsImpl, table)
}
