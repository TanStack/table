import {
  assignTableAPIs,
  assignPrototypeAPIs,
  makeStateUpdater,
} from '../../utils'
import {
  getDefaultExpandedState,
  row_getCanExpand,
  row_getIsAllParentsExpanded,
  row_getIsExpanded,
  row_getToggleExpandedHandler,
  row_toggleExpanded,
  table_autoResetExpanded,
  table_getCanSomeRowsExpand,
  table_getExpandedDepth,
  table_getIsAllRowsExpanded,
  table_getIsSomeRowsExpanded,
  table_getToggleAllRowsExpandedHandler,
  table_resetExpanded,
  table_setExpanded,
  table_toggleAllRowsExpanded,
} from './rowExpandingFeature.utils'
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
// import type {
//   CachedRowModel_Expanded,
//   CreateRowModel_Expanded,
//   Row_RowExpanding,
//   TableOptions_RowExpanding,
//   TableState_RowExpanding,
//   Table_RowExpanding,
// } from './rowExpandingFeature.types'

interface RowExpandingFeatureConstructors<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  // CachedRowModel: CachedRowModel_Expanded<TFeatures, TData>
  // CreateRowModels: CreateRowModel_Expanded<TFeatures, TData>
  // Row: Row_RowExpanding
  // Table: Table_RowExpanding<TFeatures, TData>
  // TableOptions: TableOptions_RowExpanding<TFeatures, TData>
  // TableState: TableState_RowExpanding
}

export function constructRowExpandingFeature<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): TableFeature<RowExpandingFeatureConstructors<TFeatures, TData>> {
  return {
    getInitialState: (initialState) => {
      return {
        expanded: getDefaultExpandedState(),
        ...initialState,
      }
    },

    getDefaultTableOptions: (table) => {
      return {
        onExpandedChange: makeStateUpdater('expanded', table),
        paginateExpandedRows: true,
      }
    },

    assignRowPrototype: (prototype, table) => {
      assignPrototypeAPIs('rowExpandingFeature', prototype, table, {
        row_toggleExpanded: {
          fn: (row, expanded) => row_toggleExpanded(row, expanded),
        },
        row_getIsExpanded: {
          fn: (row) => row_getIsExpanded(row),
        },
        row_getCanExpand: {
          fn: (row) => row_getCanExpand(row),
        },
        row_getIsAllParentsExpanded: {
          fn: (row) => row_getIsAllParentsExpanded(row),
        },
        row_getToggleExpandedHandler: {
          fn: (row) => row_getToggleExpandedHandler(row),
        },
      })
    },

    constructTableAPIs: (table) => {
      assignTableAPIs('rowExpandingFeature', table, {
        table_autoResetExpanded: {
          fn: () => table_autoResetExpanded(table),
        },
        table_setExpanded: {
          fn: (updater) => table_setExpanded(table, updater),
        },
        table_toggleAllRowsExpanded: {
          fn: (expanded) => table_toggleAllRowsExpanded(table, expanded),
        },
        table_resetExpanded: {
          fn: (defaultState) => table_resetExpanded(table, defaultState),
        },
        table_getCanSomeRowsExpand: {
          fn: () => table_getCanSomeRowsExpand(table),
        },
        table_getToggleAllRowsExpandedHandler: {
          fn: () => table_getToggleAllRowsExpandedHandler(table),
        },
        table_getIsSomeRowsExpanded: {
          fn: () => table_getIsSomeRowsExpanded(table),
        },
        table_getIsAllRowsExpanded: {
          fn: () => table_getIsAllRowsExpanded(table),
        },
        table_getExpandedDepth: {
          fn: () => table_getExpandedDepth(table),
        },
      })
    },
  }
}

/**
 * The Row Expanding feature adds row expanding state and APIs to the table and row objects.
 */
export const rowExpandingFeature = constructRowExpandingFeature()
