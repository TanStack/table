import { assignAPIs, makeStateUpdater } from '../../utils'
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

    constructRowAPIs: (row) => {
      assignAPIs('rowExpandingFeature', row, [
        {
          fn: (expanded) => row_toggleExpanded(row, expanded),
          fnName: 'row_toggleExpanded',
        },
        {
          fn: () => row_getIsExpanded(row),
          fnName: 'row_getIsExpanded',
        },
        {
          fn: () => row_getCanExpand(row),
          fnName: 'row_getCanExpand',
        },
        {
          fn: () => row_getIsAllParentsExpanded(row),
          fnName: 'row_getIsAllParentsExpanded',
        },
        {
          fn: () => row_getToggleExpandedHandler(row),
          fnName: 'row_getToggleExpandedHandler',
        },
      ])
    },

    constructTableAPIs: (table) => {
      assignAPIs('rowExpandingFeature', table, [
        {
          fn: () => table_autoResetExpanded(table),
          fnName: 'table_autoResetExpanded',
        },
        {
          fn: (updater) => table_setExpanded(table, updater),
          fnName: 'table_setExpanded',
        },
        {
          fn: (expanded) => table_toggleAllRowsExpanded(table, expanded),
          fnName: 'table_toggleAllRowsExpanded',
        },
        {
          fn: (defaultState) => table_resetExpanded(table, defaultState),
          fnName: 'table_resetExpanded',
        },
        {
          fn: () => table_getCanSomeRowsExpand(table),
          fnName: 'table_getCanSomeRowsExpand',
        },
        {
          fn: () => table_getToggleAllRowsExpandedHandler(table),
          fnName: 'table_getToggleAllRowsExpandedHandler',
        },
        {
          fn: () => table_getIsSomeRowsExpanded(table),
          fnName: 'table_getIsSomeRowsExpanded',
        },
        {
          fn: () => table_getIsAllRowsExpanded(table),
          fnName: 'table_getIsAllRowsExpanded',
        },
        {
          fn: () => table_getExpandedDepth(table),
          fnName: 'table_getExpandedDepth',
        },
      ])
    },
  }
}

/**
 * The Row Expanding feature adds row expanding state and APIs to the table and row objects.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/row-expanding)
 * [Guide](https://tanstack.com/table/v8/docs/guide/row-expanding)
 */
export const rowExpandingFeature = constructRowExpandingFeature()
