import {
  column_getCanGlobalFilter,
  getGlobalFilteringDefaultOptions,
  table_getGlobalAutoFilterFn,
  table_getGlobalFilterFn,
  table_resetGlobalFilter,
  table_setGlobalFilter,
} from '../..'
import { Column, Table, RowData, TableFeature } from '../../types'
import {
  GlobalFilterOptions,
  GlobalFilterTableState,
} from './GlobalFiltering.types'

//

export const GlobalFiltering: TableFeature = {
  _getInitialState: (state): GlobalFilterTableState => {
    return {
      globalFilter: undefined,
      ...state,
    }
  },

  _getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): GlobalFilterOptions<TData> => getGlobalFilteringDefaultOptions(table),

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
