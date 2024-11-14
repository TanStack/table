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
import type { Table_Internal } from '../../types/Table'
import type { TableState_All } from '../../types/TableState'
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Row } from '../../types/Row'
import type {
  Row_RowExpanding,
  TableOptions_RowExpanding,
} from './rowExpandingFeature.types'

/**
 * The Row Expanding feature adds row expanding state and APIs to the table and row objects.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/row-expanding)
 * [Guide](https://tanstack.com/table/v8/docs/guide/row-expanding)
 */
export const rowExpandingFeature: TableFeature = {
  getInitialState: (
    initialState: Partial<TableState_All>,
  ): Partial<TableState_All> => {
    return {
      expanded: getDefaultExpandedState(),
      ...initialState,
    }
  },

  getDefaultTableOptions: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    table: Table_Internal<TFeatures, TData>,
  ): TableOptions_RowExpanding<TFeatures, TData> => {
    return {
      onExpandedChange: makeStateUpdater('expanded', table),
      paginateExpandedRows: true,
    }
  },

  constructRowAPIs: <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData> & Partial<Row_RowExpanding>,
  ): void => {
    assignAPIs(row, [
      {
        fn: (expanded) => row_toggleExpanded(row, expanded),
      },
      {
        fn: () => row_getIsExpanded(row),
      },
      {
        fn: () => row_getCanExpand(row),
      },
      {
        fn: () => row_getIsAllParentsExpanded(row),
      },
      {
        fn: () => row_getToggleExpandedHandler(row),
      },
    ])
  },

  constructTableAPIs: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table_Internal<TFeatures, TData>,
  ): void => {
    assignAPIs(table, [
      {
        fn: () => table_autoResetExpanded(table),
      },
      {
        fn: (updater) => table_setExpanded(table, updater),
      },
      {
        fn: (expanded) => table_toggleAllRowsExpanded(table, expanded),
      },
      {
        fn: (defaultState) => table_resetExpanded(table, defaultState),
      },
      {
        fn: () => table_getCanSomeRowsExpand(table),
      },
      {
        fn: () => table_getToggleAllRowsExpandedHandler(table),
      },
      {
        fn: () => table_getIsSomeRowsExpanded(table),
      },
      {
        fn: () => table_getIsAllRowsExpanded(table),
      },
      {
        fn: () => table_getExpandedDepth(table),
      },
    ])
  },
}
