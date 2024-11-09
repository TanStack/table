import { assignAPIs, callMemoOrStaticFn, makeStateUpdater } from '../../utils'
import { table_getPinnedVisibleLeafColumns } from '../column-pinning/ColumnPinning.utils'
import {
  column_getAfter,
  column_getSize,
  column_getStart,
  column_resetSize,
  getDefaultColumnSizingColumnDef,
  getDefaultColumnSizingState,
  header_getSize,
  header_getStart,
  table_getCenterTotalSize,
  table_getLeftTotalSize,
  table_getRightTotalSize,
  table_getTotalSize,
  table_resetColumnSizing,
  table_setColumnSizing,
} from './ColumnSizing.utils'
import type { Table_Internal } from '../../types/Table'
import type { TableState_All } from '../../types/TableState'
import type {
  ColumnDef_ColumnSizing,
  ColumnSizingDefaultOptions,
  Header_ColumnSizing,
} from './ColumnSizing.types'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Header } from '../../types/Header'
import type { Column_Internal } from '../../types/Column'

/**
 * The Column Sizing feature adds column sizing state and APIs to the table, header, and column objects.
 *
 * **Note:** This does not include column resizing. The ColumnResizing feature has been split out into its own standalone feature.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing)
 * [Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)
 */
export const ColumnSizing: TableFeature = {
  getInitialState: (
    initialState: Partial<TableState_All>,
  ): Partial<TableState_All> => {
    return {
      columnSizing: getDefaultColumnSizingState(),
      ...initialState,
    }
  },

  getDefaultColumnDef: (): ColumnDef_ColumnSizing => {
    return getDefaultColumnSizingColumnDef()
  },

  getDefaultTableOptions: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    table: Table_Internal<TFeatures, TData>,
  ): ColumnSizingDefaultOptions => {
    return {
      onColumnSizingChange: makeStateUpdater('columnSizing', table),
    }
  },

  constructColumnAPIs: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column_Internal<TFeatures, TData, TValue>,
  ): void => {
    assignAPIs(column, [
      {
        fn: () => column_getSize(column),
      },
      {
        fn: (position) => column_getStart(column, position),
        memoDeps: (position) => [
          position,
          callMemoOrStaticFn(
            column.table,
            table_getPinnedVisibleLeafColumns,
            position
          ),
          column.table.options.state?.columnSizing,
        ],
      },
      {
        fn: (position) => column_getAfter(column, position),
        memoDeps: (position) => [
          position,
          callMemoOrStaticFn(
            column.table,
            table_getPinnedVisibleLeafColumns,
            position,
          ),
          column.table.options.state?.columnSizing,
        ],
      },
      {
        fn: () => column_resetSize(column),
      },
    ])
  },

  constructHeaderAPIs: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    header: Header<TFeatures, TData, TValue> & Partial<Header_ColumnSizing>,
  ): void => {
    assignAPIs(header, [
      {
        fn: () => header_getSize(header),
      },
      {
        fn: () => header_getStart(header),
      },
    ])
  },

  constructTableAPIs: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table_Internal<TFeatures, TData>,
  ): void => {
    assignAPIs(table, [
      {
        fn: (updater) => table_setColumnSizing(table, updater),
      },
      {
        fn: (defaultState) => table_resetColumnSizing(table, defaultState),
      },
      {
        fn: () => table_getTotalSize(table),
      },
      {
        fn: () => table_getLeftTotalSize(table),
      },
      {
        fn: () => table_getCenterTotalSize(table),
      },
      {
        fn: () => table_getRightTotalSize(table),
      },
    ])
  },
}
