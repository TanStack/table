import { assignAPIs, makeStateUpdater } from '../../utils'
import {
  column_getAutoFilterFn,
  column_getCanFilter,
  column_getFilterFn,
  column_getFilterIndex,
  column_getFilterValue,
  column_getIsFiltered,
  column_setFilterValue,
  getDefaultColumnFiltersState,
  table_resetColumnFilters,
  table_setColumnFilters,
} from './columnFilteringFeature.utils'
import type { Table_Internal } from '../../types/Table'
import type { TableState_All } from '../../types/TableState'
import type { CellData, RowData, Updater } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Row } from '../../types/Row'
import type { Column } from '../../types/Column'
import type {
  ColumnDef_ColumnFiltering,
  ColumnFiltersState,
  Column_ColumnFiltering,
  Row_ColumnFiltering,
  TableOptions_ColumnFiltering,
} from './columnFilteringFeature.types'

/**
 * The Column Filtering feature adds column filtering state and APIs to the table, row, and column objects.
 *
 * **Note:** This does not include Global Filtering. The globalFilteringFeature feature has been split out into its own standalone feature.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering)
 * [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
 */
export const columnFilteringFeature: TableFeature = {
  getInitialState: (
    initialState: Partial<TableState_All>,
  ): Partial<TableState_All> => {
    return {
      columnFilters: getDefaultColumnFiltersState(),
      ...initialState,
    }
  },

  getDefaultColumnDef: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(): ColumnDef_ColumnFiltering<TFeatures, TData> => {
    return {
      filterFn: 'auto',
    }
  },

  getDefaultTableOptions: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    table: Table_Internal<TFeatures, TData>,
  ): TableOptions_ColumnFiltering<TFeatures, TData> => {
    return {
      onColumnFiltersChange: makeStateUpdater('columnFilters', table),
      filterFromLeafRows: false,
      maxLeafRowFilterDepth: 100,
    } as TableOptions_ColumnFiltering<TFeatures, TData>
  },

  constructColumnAPIs: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column<TFeatures, TData, TValue> &
      Partial<Column_ColumnFiltering<TFeatures, TData>>,
  ): void => {
    assignAPIs(column, [
      {
        fn: () => column_getAutoFilterFn(column),
      },
      {
        fn: () => column_getFilterFn(column),
      },
      {
        fn: () => column_getCanFilter(column),
      },
      {
        fn: () => column_getIsFiltered(column),
      },
      {
        fn: () => column_getFilterValue(column),
      },
      {
        fn: () => column_getFilterIndex(column),
      },
      {
        fn: (value) => column_setFilterValue(column, value),
      },
    ])
  },

  constructRowAPIs: <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData> & Partial<Row_ColumnFiltering<TFeatures, TData>>,
  ): void => {
    row.columnFilters = {}
    row.columnFiltersMeta = {}
  },

  constructTableAPIs: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table_Internal<TFeatures, TData>,
  ): void => {
    assignAPIs(table, [
      {
        fn: (updater: Updater<ColumnFiltersState>) =>
          table_setColumnFilters(table, updater),
      },
      {
        fn: (defaultState) => table_resetColumnFilters(table, defaultState),
      },
    ])
  },
}
