import { assignAPIs, makeStateUpdater } from '../../utils'
import {
  row_getCanExpand,
  row_getIsAllParentsExpanded,
  row_getIsExpanded,
  row_getToggleExpandedHandler,
  row_toggleExpanded,
  table_autoResetExpanded,
  table_getCanSomeRowsExpand,
  table_getExpandedDepth,
  table_getExpandedRowModel,
  table_getIsAllRowsExpanded,
  table_getIsSomeRowsExpanded,
  table_getPreExpandedRowModel,
  table_getToggleAllRowsExpandedHandler,
  table_resetExpanded,
  table_setExpanded,
  table_toggleAllRowsExpanded,
} from './RowExpanding.utils'
import type { Fns } from '../../types/Fns'
import type { TableState } from '../../types/TableState'
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Row } from '../../types/Row'
import type {
  Row_RowExpanding,
  TableOptions_RowExpanding,
  TableState_RowExpanding,
  Table_RowExpanding,
} from './RowExpanding.types'

/**
 * The Row Expanding feature adds row expanding state and APIs to the table and row objects.
 * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/row-expanding)
 * @link [Guide](https://tanstack.com/table/v8/docs/guide/row-expanding)
 */
export const RowExpanding: TableFeature = {
  getInitialState: <TFeatures extends TableFeatures>(
    state: TableState<TFeatures>,
  ): TableState<TFeatures> => {
    return {
      expanded: {},
      ...state,
    }
  },

  getDefaultOptions: <
    TFeatures extends TableFeatures,
    TFns extends Fns<TFeatures, TFns, TData>,
    TData extends RowData,
  >(
    table: Table<TFeatures, TFns, TData> &
      Partial<Table_RowExpanding<TFeatures, TFns, TData>>,
  ): TableOptions_RowExpanding<TFeatures, TFns, TData> => {
    return {
      onExpandedChange: makeStateUpdater('expanded', table),
      paginateExpandedRows: true,
    }
  },

  constructRow: <
    TFeatures extends TableFeatures,
    TFns extends Fns<TFeatures, TFns, TData>,
    TData extends RowData,
  >(
    row: Row<TFeatures, TFns, TData> & Partial<Row_RowExpanding>,
    table: Table<TFeatures, TFns, TData> &
      Partial<Table_RowExpanding<TFeatures, TFns, TData>>,
  ): void => {
    assignAPIs(row, table, [
      {
        fn: (expanded) => row_toggleExpanded(row, table, expanded),
      },
      {
        fn: () => row_getIsExpanded(row, table),
      },
      {
        fn: () => row_getCanExpand(row, table),
      },
      {
        fn: () => row_getIsAllParentsExpanded(row, table),
      },
      {
        fn: () => row_getToggleExpandedHandler(row, table),
      },
    ])
  },

  constructTable: <
    TFeatures extends TableFeatures,
    TFns extends Fns<TFeatures, TFns, TData>,
    TData extends RowData,
  >(
    table: Table<TFeatures, TFns, TData> &
      Partial<Table_RowExpanding<TFeatures, TFns, TData>>,
  ): void => {
    assignAPIs(table, table, [
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
      {
        fn: () => table_getPreExpandedRowModel(table),
      },
      {
        fn: () => table_getExpandedRowModel(table),
      },
    ])
  },
}
