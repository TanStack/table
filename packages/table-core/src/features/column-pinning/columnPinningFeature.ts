import {
  assignPrototypeAPIs,
  assignTableAPIs,
  callMemoOrStaticFn,
  makeStateUpdater,
} from '../../utils'
import { table_getVisibleLeafColumns } from '../column-visibility/columnVisibilityFeature.utils'
import {
  column_getCanPin,
  column_getIsPinned,
  column_getPinnedIndex,
  column_pin,
  getDefaultColumnPinningState,
  row_getCenterVisibleCells,
  row_getLeftVisibleCells,
  row_getRightVisibleCells,
  table_getCenterFlatHeaders,
  table_getCenterFooterGroups,
  table_getCenterHeaderGroups,
  table_getCenterLeafColumns,
  table_getCenterLeafHeaders,
  table_getCenterVisibleLeafColumns,
  table_getIsSomeColumnsPinned,
  table_getLeftFlatHeaders,
  table_getLeftFooterGroups,
  table_getLeftHeaderGroups,
  table_getLeftLeafColumns,
  table_getLeftLeafHeaders,
  table_getLeftVisibleLeafColumns,
  table_getPinnedLeafColumns,
  table_getPinnedVisibleLeafColumns,
  table_getRightFlatHeaders,
  table_getRightFooterGroups,
  table_getRightHeaderGroups,
  table_getRightLeafColumns,
  table_getRightLeafHeaders,
  table_getRightVisibleLeafColumns,
  table_resetColumnPinning,
  table_setColumnPinning,
} from './columnPinningFeature.utils'
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
// import type {
//   ColumnDef_ColumnPinning,
//   Column_ColumnPinning,
//   Row_ColumnPinning,
//   TableOptions_ColumnPinning,
//   TableState_ColumnPinning,
//   Table_ColumnPinning,
// } from './columnPinningFeature.types'

export interface ColumnPinningFeatureConstructors<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  // Column: Column_ColumnPinning
  // ColumnDef: ColumnDef_ColumnPinning
  // Row: Row_ColumnPinning<TFeatures, TData>
  // Table: Table_ColumnPinning<TFeatures, TData>
  // TableOptions: TableOptions_ColumnPinning
  // TableState: TableState_ColumnPinning
}

export function constructColumnPinningFeature<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): TableFeature<ColumnPinningFeatureConstructors<TFeatures, TData>> {
  return {
    getInitialState: (initialState) => {
      return {
        columnPinning: {
          ...getDefaultColumnPinningState(),
          ...initialState.columnPinning,
        },
        ...initialState,
      }
    },

    getDefaultTableOptions: (table) => {
      return {
        onColumnPinningChange: makeStateUpdater('columnPinning', table),
      }
    },

    assignColumnPrototype: (prototype, table) => {
      assignPrototypeAPIs('columnPinningFeature', prototype, table, {
        column_pin: {
          fn: (column, position) => column_pin(column, position),
        },
        column_getCanPin: {
          fn: (column) => column_getCanPin(column),
        },
        column_getPinnedIndex: {
          fn: (column) => column_getPinnedIndex(column),
        },
        column_getIsPinned: {
          fn: (column) => column_getIsPinned(column),
        },
      })
    },

    assignRowPrototype: (prototype, table) => {
      assignPrototypeAPIs('columnPinningFeature', prototype, table, {
        row_getCenterVisibleCells: {
          fn: (row) => row_getCenterVisibleCells(row),
          memoDeps: (row) => [
            row.getAllCells(),
            row.table.atoms.columnPinning?.get(),
            row.table.atoms.columnVisibility?.get(),
          ],
        },
        row_getLeftVisibleCells: {
          fn: (row) => row_getLeftVisibleCells(row),
          memoDeps: (row) => [
            row.getAllCells(),
            row.table.atoms.columnPinning?.get()?.left,
            row.table.atoms.columnVisibility?.get(),
          ],
        },
        row_getRightVisibleCells: {
          fn: (row) => row_getRightVisibleCells(row),
          memoDeps: (row) => [
            row.getAllCells(),
            row.table.atoms.columnPinning?.get()?.right,
            row.table.atoms.columnVisibility?.get(),
          ],
        },
      })
    },

    constructTableAPIs: (table) => {
      assignTableAPIs('columnPinningFeature', table, {
        table_setColumnPinning: {
          fn: (updater) => table_setColumnPinning(table, updater),
        },
        table_resetColumnPinning: {
          fn: (defaultState) => table_resetColumnPinning(table, defaultState),
        },
        table_getIsSomeColumnsPinned: {
          fn: (position) => table_getIsSomeColumnsPinned(table, position),
        },
        // header groups
        table_getLeftHeaderGroups: {
          fn: () => table_getLeftHeaderGroups(table),
          memoDeps: () => [
            table.getAllColumns(),
            callMemoOrStaticFn(
              table,
              'getVisibleLeafColumns',
              table_getVisibleLeafColumns,
            ),
            table.atoms.columnPinning?.get()?.left,
            table.atoms.columnOrder?.get(),
          ],
        },
        table_getCenterHeaderGroups: {
          fn: () => table_getCenterHeaderGroups(table),
          memoDeps: () => [
            table.getAllColumns(),
            callMemoOrStaticFn(
              table,
              'getVisibleLeafColumns',
              table_getVisibleLeafColumns,
            ),
            table.atoms.columnPinning?.get(),
            table.atoms.columnOrder?.get(),
          ],
        },
        table_getRightHeaderGroups: {
          fn: () => table_getRightHeaderGroups(table),
          memoDeps: () => [
            table.getAllColumns(),
            callMemoOrStaticFn(
              table,
              'getVisibleLeafColumns',
              table_getVisibleLeafColumns,
            ),
            table.atoms.columnPinning?.get()?.right,
            table.atoms.columnOrder?.get(),
          ],
        },
        // footer groups
        table_getLeftFooterGroups: {
          fn: () => table_getLeftFooterGroups(table),
          memoDeps: () => [
            callMemoOrStaticFn(
              table,
              'getLeftHeaderGroups',
              table_getLeftHeaderGroups,
            ),
          ],
        },
        table_getCenterFooterGroups: {
          fn: () => table_getCenterFooterGroups(table),
          memoDeps: () => [
            callMemoOrStaticFn(
              table,
              'getCenterHeaderGroups',
              table_getCenterHeaderGroups,
            ),
          ],
        },
        table_getRightFooterGroups: {
          fn: () => table_getRightFooterGroups(table),
          memoDeps: () => [
            callMemoOrStaticFn(
              table,
              'getRightHeaderGroups',
              table_getRightHeaderGroups,
            ),
          ],
        },
        // flat headers
        table_getLeftFlatHeaders: {
          fn: () => table_getLeftFlatHeaders(table),
          memoDeps: () => [
            callMemoOrStaticFn(
              table,
              'getLeftHeaderGroups',
              table_getLeftHeaderGroups,
            ),
          ],
        },
        table_getRightFlatHeaders: {
          fn: () => table_getRightFlatHeaders(table),
          memoDeps: () => [
            callMemoOrStaticFn(
              table,
              'getRightHeaderGroups',
              table_getRightHeaderGroups,
            ),
          ],
        },
        table_getCenterFlatHeaders: {
          fn: () => table_getCenterFlatHeaders(table),
          memoDeps: () => [
            callMemoOrStaticFn(
              table,
              'getCenterHeaderGroups',
              table_getCenterHeaderGroups,
            ),
          ],
        },
        // leaf headers
        table_getLeftLeafHeaders: {
          fn: () => table_getLeftLeafHeaders(table),
          memoDeps: () => [
            callMemoOrStaticFn(
              table,
              'getLeftHeaderGroups',
              table_getLeftHeaderGroups,
            ),
          ],
        },
        table_getRightLeafHeaders: {
          fn: () => table_getRightLeafHeaders(table),
          memoDeps: () => [
            callMemoOrStaticFn(
              table,
              'getRightHeaderGroups',
              table_getRightHeaderGroups,
            ),
          ],
        },
        table_getCenterLeafHeaders: {
          fn: () => table_getCenterLeafHeaders(table),
          memoDeps: () => [
            callMemoOrStaticFn(
              table,
              'getCenterHeaderGroups',
              table_getCenterHeaderGroups,
            ),
          ],
        },
        // leaf columns
        table_getLeftLeafColumns: {
          fn: () => table_getLeftLeafColumns(table),
          memoDeps: () => [
            table.options.columns,
            table.atoms.columnPinning?.get(),
          ],
        },
        table_getRightLeafColumns: {
          fn: () => table_getRightLeafColumns(table),
          memoDeps: () => [
            table.options.columns,
            table.atoms.columnPinning?.get(),
          ],
        },
        table_getCenterLeafColumns: {
          fn: () => table_getCenterLeafColumns(table),
          memoDeps: () => [
            table.options.columns,
            table.atoms.columnPinning?.get(),
          ],
        },
        table_getPinnedLeafColumns: {
          fn: (position) => table_getPinnedLeafColumns(table, position),
          memoDeps: (position) => [
            position,
            table.options.columns,
            table.atoms.columnPinning?.get(),
          ],
        },
        // visible leaf columns
        table_getLeftVisibleLeafColumns: {
          fn: () => table_getLeftVisibleLeafColumns(table),
          memoDeps: () => [
            table.options.columns,
            table.atoms.columnPinning?.get(),
            table.atoms.columnVisibility?.get(),
          ],
        },
        table_getCenterVisibleLeafColumns: {
          fn: () => table_getCenterVisibleLeafColumns(table),
          memoDeps: () => [
            table.options.columns,
            table.atoms.columnPinning?.get(),
            table.atoms.columnVisibility?.get(),
          ],
        },
        table_getRightVisibleLeafColumns: {
          fn: () => table_getRightVisibleLeafColumns(table),
          memoDeps: () => [
            table.options.columns,
            table.atoms.columnPinning?.get(),
            table.atoms.columnVisibility?.get(),
          ],
        },
        table_getPinnedVisibleLeafColumns: {
          fn: (position) => table_getPinnedVisibleLeafColumns(table, position),
          memoDeps: (position) => [
            position,
            table.options.columns,
            table.atoms.columnPinning?.get(),
            table.atoms.columnVisibility?.get(),
          ],
        },
      })
    },
  }
}

/**
 * The Column Pinning feature adds column pinning state and APIs to the table, row, and column objects.
 */
export const columnPinningFeature = constructColumnPinningFeature()
