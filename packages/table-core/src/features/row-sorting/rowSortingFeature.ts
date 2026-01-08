import {
  assignPrototypeAPIs,
  assignTableAPIs,
  makeStateUpdater,
} from '../../utils'
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
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
// import type {
//   CachedRowModel_Sorted,
//   ColumnDef_RowSorting,
//   Column_RowSorting,
//   CreateRowModel_Sorted,
//   RowModelFns_RowSorting,
//   TableOptions_RowSorting,
//   TableState_RowSorting,
//   Table_RowSorting,
// } from './rowSortingFeature.types'

interface RowSortingFeatureConstructors<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  // CachedRowModel: CachedRowModel_Sorted<TFeatures, TData>
  // Column: Column_RowSorting<TFeatures, TData>
  // ColumnDef: ColumnDef_RowSorting<TFeatures, TData>
  // CreateRowModels: CreateRowModel_Sorted<TFeatures, TData>
  // RowModelFns: RowModelFns_RowSorting<TFeatures, TData>
  // Table: Table_RowSorting<TFeatures, TData>
  // TableOptions: TableOptions_RowSorting
  // TableState: TableState_RowSorting
}

export function constructRowSortingFeature<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): TableFeature<RowSortingFeatureConstructors<TFeatures, TData>> {
  return {
    getInitialState(initialState) {
      return {
        sorting: getDefaultSortingState(),
        ...initialState,
      }
    },

    getDefaultColumnDef() {
      return {
        sortFn: 'auto',
        sortUndefined: 1,
      }
    },

    getDefaultTableOptions(table) {
      return {
        onSortingChange: makeStateUpdater('sorting', table),
        isMultiSortEvent: (e: unknown) => {
          return (e as MouseEvent).shiftKey
        },
      }
    },

    assignColumnPrototype(prototype, table) {
      assignPrototypeAPIs('rowSortingFeature', prototype, table, {
        'column.getAutoSortFn': {
          fn: (column) => column_getAutoSortFn(column),
        },
        'column.getAutoSortDir': {
          fn: (column) => column_getAutoSortDir(column),
        },
        column_getSortFn: {
          fn: (column) => column_getSortFn(column),
        },
        column_toggleSorting: {
          fn: (column, desc, multi) =>
            column_toggleSorting(column, desc, multi),
        },
        column_getFirstSortDir: {
          fn: (column) => column_getFirstSortDir(column),
        },
        column_getNextSortingOrder: {
          fn: (column, multi) => column_getNextSortingOrder(column, multi),
        },
        column_getCanSort: {
          fn: (column) => column_getCanSort(column),
        },
        column_getCanMultiSort: {
          fn: (column) => column_getCanMultiSort(column),
        },
        column_getIsSorted: {
          fn: (column) => column_getIsSorted(column),
        },
        column_getSortIndex: {
          fn: (column) => column_getSortIndex(column),
        },
        column_clearSorting: {
          fn: (column) => column_clearSorting(column),
        },
        column_getToggleSortingHandler: {
          fn: (column) => column_getToggleSortingHandler(column),
        },
      })
    },

    constructTableAPIs(table) {
      assignTableAPIs('rowSortingFeature', table, {
        table_setSorting: {
          fn: (updater) => table_setSorting(table, updater),
        },
        table_resetSorting: {
          fn: (defaultState) => table_resetSorting(table, defaultState),
        },
      })
    },
  }
}

/**
 * The (Row) Sorting feature adds sorting state and APIs to the table and column objects.
 */
export const rowSortingFeature = constructRowSortingFeature()
