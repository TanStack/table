import { assignAPIs, makeStateUpdater } from '../../utils'
import {
  column_getCanGlobalFilter,
  table_getGlobalAutoFilterFn,
  table_getGlobalFilterFn,
  table_resetGlobalFilter,
  table_setGlobalFilter,
} from './GlobalFiltering.utils'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { TableState } from '../../types/TableState'
import type { Column } from '../../types/Column'
import type {
  Column_GlobalFiltering,
  TableOptions_GlobalFiltering,
  Table_GlobalFiltering,
} from './GlobalFiltering.types'

/**
 * The Global Filtering feature adds global filtering state and APIs to the table and column objects.
 *
 * **Note:** This is dependent on the ColumnFiltering feature.
 * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering)
 * @link [Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)
 */
export const GlobalFiltering: TableFeature = {
  getInitialState: <TFeatures extends TableFeatures>(
    state: Partial<TableState<TFeatures>>,
  ): Partial<TableState<TFeatures>> => {
    return {
      globalFilter: undefined,
      ...state,
    }
  },

  getDefaultTableOptions: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    table: Table<TFeatures, TData> &
      Partial<Table_GlobalFiltering<TFeatures, TData>>,
  ): TableOptions_GlobalFiltering<TFeatures, TData> => {
    return {
      onGlobalFilterChange: makeStateUpdater('globalFilter', table),
      globalFilterFn: 'auto',
      getColumnCanGlobalFilter: (column) => {
        const value = table
          .getCoreRowModel()
          .flatRows[0]?.getAllCellsByColumnId()
          [column.id]?.getValue()

        return typeof value === 'string' || typeof value === 'number'
      },
    }
  },

  constructColumnAPIs: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column<TFeatures, TData, TValue> & Partial<Column_GlobalFiltering>,
  ): void => {
    assignAPIs(column, [
      {
        fn: () => column_getCanGlobalFilter(column),
      },
    ])
  },

  constructTableAPIs: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData> &
      Partial<Table_GlobalFiltering<TFeatures, TData>>,
  ): void => {
    assignAPIs(table, [
      {
        fn: () => table_getGlobalAutoFilterFn(),
      },
      {
        fn: () => table_getGlobalFilterFn(table),
      },
      {
        fn: (updater) => table_setGlobalFilter(table, updater),
      },
      {
        fn: (defaultState) => table_resetGlobalFilter(table, defaultState),
      },
    ])
  },
}
