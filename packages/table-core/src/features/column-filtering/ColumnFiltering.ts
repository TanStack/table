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
} from './ColumnFiltering.utils'
import type { TableState } from '../../types/TableState'
import type { CellData, RowData, Updater } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Row } from '../../types/Row'
import type { Column } from '../../types/Column'
import type {
  ColumnDef_ColumnFiltering,
  ColumnFiltersState,
  Column_ColumnFiltering,
  Row_ColumnFiltering,
  TableOptions_ColumnFiltering,
  TableState_ColumnFiltering,
  Table_ColumnFiltering,
} from './ColumnFiltering.types'

/**
 * The Column Filtering feature adds column filtering state and APIs to the table, row, and column objects.
 *
 * **Note:** This does not include Global Filtering. The GlobalFiltering feature has been split out into its own standalone feature.
 * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering)
 * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
 */
export const ColumnFiltering: TableFeature = {
  getInitialState: <TFeatures extends TableFeatures>(
    state: TableState<TFeatures>,
  ): TableState<TFeatures> & TableState_ColumnFiltering => {
    return {
      columnFilters: getDefaultColumnFiltersState(),
      ...state,
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
    table: Table<TFeatures, TData> &
      Partial<Table_ColumnFiltering<TFeatures, TData>>,
  ): TableOptions_ColumnFiltering<TFeatures, TData> => {
    return {
      onColumnFiltersChange: makeStateUpdater('columnFilters', table),
      filterFromLeafRows: false,
      maxLeafRowFilterDepth: 100,
    } as TableOptions_ColumnFiltering<TFeatures, TData>
  },

  constructColumn: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column<TFeatures, TData, TValue> &
      Partial<Column_ColumnFiltering<TFeatures, TData>>,
    table: Table<TFeatures, TData> &
      Partial<Table_ColumnFiltering<TFeatures, TData>>,
  ): void => {
    assignAPIs(column, table, [
      {
        fn: () => column_getAutoFilterFn(column, table),
      },
      {
        fn: () => column_getFilterFn(column, table),
      },
      {
        fn: () => column_getCanFilter(column, table),
      },
      {
        fn: () => column_getIsFiltered(column, table),
      },
      {
        fn: () => column_getFilterValue(column, table),
      },
      {
        fn: () => column_getFilterIndex(column, table),
      },
      {
        fn: (value) => column_setFilterValue(column, table, value),
      },
    ])
  },

  constructRow: <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData> & Partial<Row_ColumnFiltering<TFeatures, TData>>,
  ): void => {
    row.columnFilters = {}
    row.columnFiltersMeta = {}
  },

  constructTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData> &
      Partial<Table_ColumnFiltering<TFeatures, TData>>,
  ): void => {
    assignAPIs(table, table, [
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
