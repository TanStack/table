import { assignAPIs, makeStateUpdater } from '../../utils'
import { table_getCoreRowModel } from '../../core/table/Tables.utils'
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
  TableState_GlobalFiltering,
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
  _getInitialState: <TFeatures extends TableFeatures>(
    state: TableState<TFeatures>,
  ): TableState<TFeatures> & TableState_GlobalFiltering => {
    return {
      globalFilter: undefined,
      ...state,
    }
  },

  _getDefaultOptions: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData> &
      Partial<Table_GlobalFiltering<TFeatures, TData>>,
  ): TableOptions_GlobalFiltering<TFeatures, TData> => {
    return {
      onGlobalFilterChange: makeStateUpdater('globalFilter', table),
      globalFilterFn: 'auto',
      getColumnCanGlobalFilter: (column) => {
        const value = table_getCoreRowModel(table as Table<TFeatures, TData>)
          .flatRows[0]?.getAllCellsByColumnId()
          [column.id]?.getValue()

        return typeof value === 'string' || typeof value === 'number'
      },
    }
  },

  _createColumn: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column<TFeatures, TData, TValue> & Partial<Column_GlobalFiltering>,
    table: Table<TFeatures, TData> &
      Partial<Table_GlobalFiltering<TFeatures, TData>>,
  ): void => {
    assignAPIs(column, table, [
      {
        fn: () => column_getCanGlobalFilter(column, table),
      },
    ])
  },

  _createTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData> &
      Partial<Table_GlobalFiltering<TFeatures, TData>>,
  ): void => {
    assignAPIs(table, table, [
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
