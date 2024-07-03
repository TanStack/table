import {
  column_getCanGlobalFilter,
  getGlobalFilteringDefaultOptions,
  table_getGlobalAutoFilterFn,
  table_getGlobalFilterFn,
  table_resetGlobalFilter,
  table_setGlobalFilter,
} from './GlobalFiltering.utils'
import { Column, Table, RowData, TableFeature } from '../../types'
import {
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
    table: Table<TData>
  ): TableOptions_GlobalFiltering<TData> =>
    getGlobalFilteringDefaultOptions(table),

  _createColumn: <TData extends RowData>(
    column: Column<TData, unknown>,
    table: Table<TData>
  ): void => {
    column.getCanGlobalFilter = () => column_getCanGlobalFilter(column, table)
  },

  _createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.getGlobalAutoFilterFn = () => table_getGlobalAutoFilterFn()

    table.getGlobalFilterFn = () => table_getGlobalFilterFn(table)

    table.setGlobalFilter = updater => table_setGlobalFilter(table, updater)

    table.resetGlobalFilter = defaultState =>
      table_resetGlobalFilter(table, defaultState)
  },
}
