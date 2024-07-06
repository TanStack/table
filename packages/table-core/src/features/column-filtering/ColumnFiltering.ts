import { Column, Row, RowData, Table, TableFeature, Updater } from '../../types'
import { makeStateUpdater } from '../../utils'
import {
  ColumnDef_ColumnFiltering,
  TableOptions_ColumnFiltering,
  ColumnFiltersState,
  TableState_ColumnFiltering,
} from './ColumnFiltering.types'
import {
  column_getAutoFilterFn,
  column_getCanFilter,
  column_getFilterFn,
  column_getFilterIndex,
  column_getFilterValue,
  column_getIsFiltered,
  column_setFilterValue,
  table_getFilteredRowModel,
  table_getPreFilteredRowModel,
  table_resetColumnFilters,
  table_setColumnFilters,
} from './ColumnFiltering.utils'

export const ColumnFiltering: TableFeature = {
  _getDefaultColumnDef: <
    TData extends RowData,
  >(): ColumnDef_ColumnFiltering<TData> => {
    return {
      filterFn: 'auto',
    }
  },

  _getInitialState: (state): TableState_ColumnFiltering => {
    return {
      columnFilters: [],
      ...state,
    }
  },

  _getDefaultOptions: <TData extends RowData>(
    table: Partial<Table<TData>>
  ): TableOptions_ColumnFiltering<TData> => {
    return {
      onColumnFiltersChange: makeStateUpdater('columnFilters', table),
      filterFromLeafRows: false,
      maxLeafRowFilterDepth: 100,
    } as TableOptions_ColumnFiltering<TData>
  },

  _createColumn: <TData extends RowData>(
    column: Column<TData, unknown>,
    table: Table<TData>
  ): void => {
    column.getAutoFilterFn = () => column_getAutoFilterFn(column, table)

    column.getFilterFn = () => column_getFilterFn(column, table)

    column.getCanFilter = () => column_getCanFilter(column, table)

    column.getIsFiltered = () => column_getIsFiltered(column)

    column.getFilterValue = () => column_getFilterValue(column, table)

    column.getFilterIndex = () => column_getFilterIndex(column, table)

    column.setFilterValue = value => column_setFilterValue(column, table, value)
  },

  _createRow: <TData extends RowData>(
    row: Row<TData>,
    _table: Table<TData>
  ): void => {
    row.columnFilters = {}
    row.columnFiltersMeta = {}
  },

  _createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setColumnFilters = (updater: Updater<ColumnFiltersState>) =>
      table_setColumnFilters(table, updater)

    table.resetColumnFilters = defaultState =>
      table_resetColumnFilters(table, defaultState)

    table.getPreFilteredRowModel = () => table_getPreFilteredRowModel(table)

    table.getFilteredRowModel = () => table_getFilteredRowModel(table)
  },
}
