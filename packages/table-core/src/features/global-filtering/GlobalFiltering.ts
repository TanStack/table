import { makeStateUpdater } from '../../utils'
import {
  column_getCanGlobalFilter,
  table_getGlobalAutoFilterFn,
  table_getGlobalFilterFn,
  table_resetGlobalFilter,
  table_setGlobalFilter,
} from './GlobalFiltering.utils'
import type { Column, RowData, Table, TableFeature } from '../../types'
import type {
  TableOptions_GlobalFiltering,
  TableState_GlobalFiltering,
} from './GlobalFiltering.types'

export const GlobalFiltering: TableFeature = {
  _getInitialState: (state): TableState_GlobalFiltering => {
    return {
      globalFilter: undefined,
      ...state,
    }
  },

  _getDefaultOptions: <TData extends RowData>(
    table: Partial<Table<TData>>,
  ): TableOptions_GlobalFiltering<TData> => {
    return {
      onGlobalFilterChange: makeStateUpdater('globalFilter', table),
      globalFilterFn: 'auto',
      getColumnCanGlobalFilter: (column) => {
        const value = table.getCoreRowModel!()
          .flatRows[0]?._getAllCellsByColumnId()
          [column.id]?.getValue()

        return typeof value === 'string' || typeof value === 'number'
      },
    }
  },

  _createColumn: <TData extends RowData>(
    column: Column<TData, unknown>,
    table: Table<TData>,
  ): void => {
    column.getCanGlobalFilter = () => column_getCanGlobalFilter(column, table)
  },

  _createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.getGlobalAutoFilterFn = () => table_getGlobalAutoFilterFn()

    table.getGlobalFilterFn = () => table_getGlobalFilterFn(table)

    table.setGlobalFilter = (updater) => table_setGlobalFilter(table, updater)

    table.resetGlobalFilter = (defaultState) =>
      table_resetGlobalFilter(table, defaultState)
  },
}
