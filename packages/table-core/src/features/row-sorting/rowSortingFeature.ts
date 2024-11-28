import { assignAPIs, makeStateUpdater } from '../../utils'
import {
  column_clearSorting,
  column_getAutoSortDir,
  column_getAutoSortFn,
  column_getCanMultiSort,
  column_getCanSort,
  column_getFirstSortDir,
  column_getIsSorted,
  column_getNextSortingOrder,
  column_getSortFn,
  column_getSortIndex,
  column_getToggleSortingHandler,
  column_toggleSorting,
  getDefaultSortingState,
  table_resetSorting,
  table_setSorting,
} from './rowSortingFeature.utils'
import type { TableState_All } from '../../types/TableState'
import type {
  ColumnDef_RowSorting,
  TableOptions_RowSorting,
} from './rowSortingFeature.types'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { Column } from '../../types/Column'

/**
 * The (Row) Sorting feature adds sorting state and APIs to the table and column objects.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting)
 * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
 */
export const rowSortingFeature: TableFeature = {
  getInitialState: (
    state: Partial<TableState_All>,
  ): Partial<TableState_All> => {
    return {
      sorting: getDefaultSortingState(),
      ...state,
    }
  },

  getDefaultColumnDef: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(): ColumnDef_RowSorting<TFeatures, TData> => {
    return {
      sortFn: 'auto',
      sortUndefined: 1,
    }
  },

  getDefaultTableOptions: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    table: Table_Internal<TFeatures, TData>,
  ): TableOptions_RowSorting => {
    return {
      onSortingChange: makeStateUpdater('sorting', table),
      isMultiSortEvent: (e: unknown) => {
        return (e as MouseEvent).shiftKey
      },
    }
  },

  constructColumnAPIs: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column<TFeatures, TData, TValue>,
  ): void => {
    assignAPIs(column, [
      {
        fn: () => column_getAutoSortFn(column),
      },
      {
        fn: () => column_getAutoSortDir(column),
      },
      {
        fn: () => column_getSortFn(column),
      },
      {
        fn: (desc, multi) => column_toggleSorting(column, desc, multi),
      },
      {
        fn: () => column_getFirstSortDir(column),
      },
      {
        fn: (multi) => column_getNextSortingOrder(column, multi),
      },
      {
        fn: () => column_getCanSort(column),
      },
      {
        fn: () => column_getCanMultiSort(column),
      },
      {
        fn: () => column_getIsSorted(column),
      },
      {
        fn: () => column_getSortIndex(column),
      },
      {
        fn: () => column_clearSorting(column),
      },
      {
        fn: () => column_getToggleSortingHandler(column),
      },
    ])
  },

  constructTableAPIs: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table_Internal<TFeatures, TData>,
  ): void => {
    assignAPIs(table, [
      {
        fn: (updater) => table_setSorting(table, updater),
      },
      {
        fn: (defaultState) => table_resetSorting(table, defaultState),
      },
    ])
  },
}
