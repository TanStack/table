import { assignAPIs, callMemoOrStaticFn, makeStateUpdater } from '../../utils'
import { table_getPinnedVisibleLeafColumns } from '../column-pinning/columnPinningFeature.utils'
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
} from './columnSizingFeature.utils'
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
// import type {
//   ColumnDef_ColumnSizing,
//   Column_ColumnSizing,
//   Header_ColumnSizing,
//   TableOptions_ColumnSizing,
//   TableState_ColumnSizing,
//   Table_ColumnSizing,
// } from './columnSizingFeature.types'

interface ColumnSizingFeatureConstructors<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  // ColumnDef: ColumnDef_ColumnSizing
  // Column: Column_ColumnSizing
  // Header: Header_ColumnSizing
  // Table: Table_ColumnSizing
  // TableOptions: TableOptions_ColumnSizing
  // TableState: TableState_ColumnSizing
}

export function constructColumnSizingFeature<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): TableFeature<ColumnSizingFeatureConstructors<TFeatures, TData>> {
  return {
    getInitialState: (initialState) => {
      return {
        columnSizing: getDefaultColumnSizingState(),
        ...initialState,
      }
    },

    getDefaultColumnDef: () => {
      return getDefaultColumnSizingColumnDef()
    },

    getDefaultTableOptions: (table) => {
      return {
        onColumnSizingChange: makeStateUpdater('columnSizing', table),
      }
    },

    constructColumnAPIs: (column) => {
      assignAPIs('columnSizingFeature', column, [
        {
          fn: () => column_getSize(column),
          fnName: 'column_getSize',
        },
        {
          fn: (position) => column_getStart(column, position),
          fnName: 'column_getStart',
          memoDeps: (position) => [
            position,
            callMemoOrStaticFn(
              column._table,
              'getPinnedVisibleLeafColumns',
              table_getPinnedVisibleLeafColumns,
              position,
            ),
            column._table.options.state?.columnSizing,
          ],
        },
        {
          fn: (position) => column_getAfter(column, position),
          fnName: 'column_getAfter',
          memoDeps: (position) => [
            position,
            callMemoOrStaticFn(
              column._table,
              'getPinnedVisibleLeafColumns',
              table_getPinnedVisibleLeafColumns,
              position,
            ),
            column._table.options.state?.columnSizing,
          ],
        },
        {
          fn: () => column_resetSize(column),
          fnName: 'column_resetSize',
        },
      ])
    },

    constructHeaderAPIs: (header) => {
      assignAPIs('columnSizingFeature', header, [
        {
          fn: () => header_getSize(header),
          fnName: 'header_getSize',
        },
        {
          fn: () => header_getStart(header),
          fnName: 'header_getStart',
        },
      ])
    },

    constructTableAPIs: (table) => {
      assignAPIs('columnSizingFeature', table, [
        {
          fn: (updater) => table_setColumnSizing(table, updater),
          fnName: 'table_setColumnSizing',
        },
        {
          fn: (defaultState) => table_resetColumnSizing(table, defaultState),
          fnName: 'table_resetColumnSizing',
        },
        {
          fn: () => table_getTotalSize(table),
          fnName: 'table_getTotalSize',
        },
        {
          fn: () => table_getLeftTotalSize(table),
          fnName: 'table_getLeftTotalSize',
        },
        {
          fn: () => table_getCenterTotalSize(table),
          fnName: 'table_getCenterTotalSize',
        },
        {
          fn: () => table_getRightTotalSize(table),
          fnName: 'table_getRightTotalSize',
        },
      ])
    },
  }
}

/**
 * The Column Sizing feature adds column sizing state and APIs to the table, header, and column objects.
 *
 * **Note:** This does not include column resizing. The columnResizingFeature feature has been split out into its own standalone feature.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing)
 * [Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)
 */
export const columnSizingFeature = constructColumnSizingFeature()
