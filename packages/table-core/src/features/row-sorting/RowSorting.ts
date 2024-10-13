import { assignAPIs, makeStateUpdater } from '../../utils'
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
import type { TableState } from '../../types/TableState'
import type {
  ColumnDef_RowSorting,
  TableOptions_RowSorting,
  TableState_RowSorting,
} from './RowSorting.types'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Column } from '../../types/Column'

/**
 * The (Row) Sorting feature adds sorting state and APIs to the table and column objects.
 * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting)
 * @link [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
 */
export const RowSorting: TableFeature = {
  getInitialState: <TFeatures extends TableFeatures>(
    state: TableState<TFeatures>,
  ): TableState<TFeatures> & TableState_RowSorting => {
    return {
      sorting: [],
      ...state,
    }
  },

  getDefaultColumnDef: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(): ColumnDef_RowSorting<TFeatures, TData> => {
    return {
      sortingFn: 'auto',
      sortUndefined: 1,
    }
  },

  getDefaultTableOptions: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    table: Table<TFeatures, TData>,
  ): TableOptions_RowSorting => {
    return {
      onSortingChange: makeStateUpdater('sorting', table),
      isMultiSortEvent: (e: unknown) => {
        return (e as MouseEvent).shiftKey
      },
    }
  },

  constructColumn: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column<TFeatures, TData, TValue>,
    table: Table<TFeatures, TData>,
  ): void => {
    assignAPIs(column, table, [
      {
        fn: () => column_getAutoSortingFn(column, table),
      },
      {
        fn: () => column_getAutoSortDir(column, table),
      },
      {
        fn: () => column_getSortingFn(column, table),
      },
      {
        fn: (desc, multi) => column_toggleSorting(column, table, desc, multi),
      },
      {
        fn: () => column_getFirstSortDir(column, table),
      },
      {
        fn: (multi) => column_getNextSortingOrder(column, table, multi),
      },
      {
        fn: () => column_getCanSort(column, table),
      },
      {
        fn: () => column_getCanMultiSort(column, table),
      },
      {
        fn: () => column_getIsSorted(column, table),
      },
      {
        fn: () => column_getSortIndex(column, table),
      },
      {
        fn: () => column_clearSorting(column, table),
      },
      {
        fn: () => column_getToggleSortingHandler(column, table),
      },
    ])
  },

  constructTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData>,
  ): void => {
    assignAPIs(table, table, [
      {
        fn: (updater) => table_setSorting(table, updater),
      },
      {
        fn: (defaultState) => table_resetSorting(table, defaultState),
      },
      {
        fn: () => table_getPreSortedRowModel(table),
      },
      {
        fn: () => table_getSortedRowModel(table),
      },
    ])
  },
}
