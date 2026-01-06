import {
  assignPrototypeAPIs,
  assignTableAPIs,
  callMemoOrStaticFn,
  makeStateUpdater,
} from '../../utils'
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

    assignColumnPrototype: (prototype, table) => {
      assignPrototypeAPIs('columnSizingFeature', prototype, table, {
        column_getSize: {
          fn: (column) => column_getSize(column),
        },
        column_getStart: {
          fn: (column, position) => column_getStart(column, position),
          memoDeps: (column, position) => [
            position,
            callMemoOrStaticFn(
              column.table,
              'getPinnedVisibleLeafColumns',
              table_getPinnedVisibleLeafColumns,
              position,
            ),
            column.table.store.state.columnSizing,
          ],
        },
        column_getAfter: {
          fn: (column, position) => column_getAfter(column, position),
          memoDeps: (column, position) => [
            position,
            callMemoOrStaticFn(
              column.table,
              'getPinnedVisibleLeafColumns',
              table_getPinnedVisibleLeafColumns,
              position,
            ),
            column.table.store.state.columnSizing,
          ],
        },
        column_resetSize: {
          fn: (column) => column_resetSize(column),
        },
      })
    },

    assignHeaderPrototype: (prototype, table) => {
      assignPrototypeAPIs('columnSizingFeature', prototype, table, {
        header_getSize: {
          fn: (header) => header_getSize(header),
        },
        header_getStart: {
          fn: (header) => header_getStart(header),
        },
      })
    },

    constructTableAPIs: (table) => {
      assignTableAPIs('columnSizingFeature', table, {
        table_setColumnSizing: {
          fn: (updater) => table_setColumnSizing(table, updater),
        },
        table_resetColumnSizing: {
          fn: (defaultState) => table_resetColumnSizing(table, defaultState),
        },
        table_getTotalSize: {
          fn: () => table_getTotalSize(table),
        },
        table_getLeftTotalSize: {
          fn: () => table_getLeftTotalSize(table),
        },
        table_getCenterTotalSize: {
          fn: () => table_getCenterTotalSize(table),
        },
        table_getRightTotalSize: {
          fn: () => table_getRightTotalSize(table),
        },
      })
    },
  }
}

/**
 * The Column Sizing feature adds column sizing state and APIs to the table, header, and column objects.
 * **Note:** This does not include column resizing. The columnResizingFeature feature has been split out into its own standalone feature.
 */
export const columnSizingFeature = constructColumnSizingFeature()
