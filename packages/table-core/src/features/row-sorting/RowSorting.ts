import {
  column_clearSorting,
  column_getAutoSortDir,
  column_getAutoSortingFn,
  column_getCanMultiSort,
  column_getCanSort,
  column_getFirstSortDir,
  column_getIsSorted,
  column_getNextSortingOrder,
  column_getSortIndex,
  column_getSortingFn,
  column_getToggleSortingHandler,
  column_toggleSorting,
  table_getPreSortedRowModel,
  table_getSortedRowModel,
  table_resetSorting,
  table_setSorting,
} from './RowSorting.utils'
import {
  ColumnDef_RowSorting,
  TableOptions_RowSorting,
  TableState_RowSorting,
} from './RowSorting.types'
import { Column, Table, RowData, TableFeature } from '../../types'
import { makeStateUpdater } from '../../utils'

export const RowSorting: TableFeature = {
  _getInitialState: (state): TableState_RowSorting => {
    return {
      sorting: [],
      ...state,
    }
  },

  _getDefaultColumnDef: <
    TData extends RowData,
  >(): ColumnDef_RowSorting<TData> => {
    return {
      sortingFn: 'auto',
      sortUndefined: 1,
    }
  },

  _getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): TableOptions_RowSorting<TData> => {
    return {
      onSortingChange: makeStateUpdater('sorting', table),
      isMultiSortEvent: (e: unknown) => {
        return (e as MouseEvent).shiftKey
      },
    }
  },

  _createColumn: <TData extends RowData, TValue>(
    column: Column<TData, TValue>,
    table: Table<TData>
  ): void => {
    column.getAutoSortingFn = () => column_getAutoSortingFn(column, table)

    column.getAutoSortDir = () => column_getAutoSortDir(column, table)

    column.getSortingFn = () => column_getSortingFn(column, table)

    column.toggleSorting = (desc, multi) =>
      column_toggleSorting(column, table, desc, multi)

    column.getFirstSortDir = () => column_getFirstSortDir(column, table)

    column.getNextSortingOrder = (multi?: boolean) =>
      column_getNextSortingOrder(column, table)

    column.getCanSort = () => column_getCanSort(column, table)

    column.getCanMultiSort = () => column_getCanMultiSort(column, table)

    column.getIsSorted = () => column_getIsSorted(column, table)

    column.getSortIndex = () => column_getSortIndex(column, table)

    column.clearSorting = () => column_clearSorting(column, table)

    column.getToggleSortingHandler = () =>
      column_getToggleSortingHandler(column, table)
  },

  _createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setSorting = updater => table_setSorting(table, updater)

    table.resetSorting = defaultState => table_resetSorting(table, defaultState)

    table.getPreSortedRowModel = () => table_getPreSortedRowModel(table)

    table.getSortedRowModel = () => table_getSortedRowModel(table)
  },
}
