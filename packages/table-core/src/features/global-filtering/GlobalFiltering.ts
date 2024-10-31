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
import type { Table_Internal } from '../../types/Table'
import type { TableState_All } from '../../types/TableState'
import type { Column } from '../../types/Column'
import type {
  Column_GlobalFiltering,
  TableOptions_GlobalFiltering,
} from './GlobalFiltering.types'

/**
 * The Global Filtering feature adds global filtering state and APIs to the table and column objects.
 *
 * **Note:** This is dependent on the ColumnFiltering feature.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering)
 * [Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)
 */
export const GlobalFiltering: TableFeature = {
  getInitialState: (
    initialState: Partial<TableState_All>,
  ): Partial<TableState_All> => {
    return {
      globalFilter: undefined,
      ...initialState,
    }
  },

  getDefaultTableOptions: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    table: Table_Internal<TFeatures, TData>,
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
    table: Table_Internal<TFeatures, TData>,
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
