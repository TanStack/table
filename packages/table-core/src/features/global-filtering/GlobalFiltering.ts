import { makeStateUpdater } from '../../utils'
import { table_getCoreRowModel } from '../../core/table/Tables.utils'
import {
  column_getCanGlobalFilter,
  table_getGlobalAutoFilterFn,
  table_getGlobalFilterFn,
  table_resetGlobalFilter,
  table_setGlobalFilter,
} from './GlobalFiltering.utils'
import type {
  CellData,
  Column,
  RowData,
  Table,
  TableFeature,
  TableFeatures,
  TableState,
} from '../../types'
import type {
  Column_GlobalFiltering,
  TableOptions_GlobalFiltering,
  TableState_GlobalFiltering,
  Table_GlobalFiltering,
} from './GlobalFiltering.types'

export const GlobalFiltering: TableFeature = {
  _getInitialState: <TFeatures extends TableFeatures>(
    state: TableState<TFeatures> & Partial<TableState_GlobalFiltering>,
  ): TableState_GlobalFiltering => {
    return {
      globalFilter: undefined,
      ...state,
    }
  },

  _getDefaultOptions: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Partial<Table<TFeatures, TData>>,
  ): TableOptions_GlobalFiltering<TFeatures, TData> => {
    return {
      onGlobalFilterChange: makeStateUpdater('globalFilter', table),
      globalFilterFn: 'auto',
      getColumnCanGlobalFilter: (column) => {
        const value = table_getCoreRowModel(table as Table<TFeatures, TData>)
          .flatRows[0]?._getAllCellsByColumnId()
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
    table: Table<TFeatures, TData>,
  ): void => {
    column.getCanGlobalFilter = () => column_getCanGlobalFilter(column, table)
  },

  _createTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData> &
      Partial<Table_GlobalFiltering<TFeatures, TData>>,
  ): void => {
    table.getGlobalAutoFilterFn = () => table_getGlobalAutoFilterFn()

    table.getGlobalFilterFn = () => table_getGlobalFilterFn(table)

    table.setGlobalFilter = (updater) => table_setGlobalFilter(table, updater)

    table.resetGlobalFilter = (defaultState) =>
      table_resetGlobalFilter(table, defaultState)
  },
}
