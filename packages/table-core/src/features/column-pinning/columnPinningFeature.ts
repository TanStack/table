import { assignAPIs, callMemoOrStaticFn, makeStateUpdater } from '../../utils'
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

interface ColumnPinningFeatureConstructors<
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
      }
    },

    getDefaultTableOptions: (table) => {
      return {
        onColumnPinningChange: makeStateUpdater('columnPinning', table),
      }
    },

    constructColumnAPIs: (column) => {
      assignAPIs('columnPinningFeature', column, [
        {
          fn: (position) => column_pin(column, position),
          fnName: 'column_pin',
        },
        {
          fn: () => column_getCanPin(column),
          fnName: 'column_getCanPin',
        },
        {
          fn: () => column_getPinnedIndex(column),
          fnName: 'column_getPinnedIndex',
        },
        {
          fn: () => column_getIsPinned(column),
          fnName: 'column_getIsPinned',
        },
      ])
    },

    constructRowAPIs: (row) => {
      assignAPIs('columnPinningFeature', row, [
        {
          fn: () => row_getCenterVisibleCells(row),
          fnName: 'row_getCenterVisibleCells',
          memoDeps: () => [
            row.getAllCells(),
            row._table.options.state?.columnPinning,
            row._table.options.state?.columnVisibility,
          ],
        },
        {
          fn: () => row_getLeftVisibleCells(row),
          fnName: 'row_getLeftVisibleCells',
          memoDeps: () => [
            row.getAllCells(),
            row._table.options.state?.columnPinning?.left,
            row._table.options.state?.columnVisibility,
          ],
        },
        {
          fn: () => row_getRightVisibleCells(row),
          fnName: 'row_getRightVisibleCells',
          memoDeps: () => [
            row.getAllCells(),
            row._table.options.state?.columnPinning?.right,
            row._table.options.state?.columnVisibility,
          ],
        },
      ])
    },

    constructTableAPIs: (table) => {
      assignAPIs('columnPinningFeature', table, [
        {
          fn: (updater) => table_setColumnPinning(table, updater),
          fnName: 'table_setColumnPinning',
        },
        {
          fn: (defaultState) => table_resetColumnPinning(table, defaultState),
          fnName: 'table_resetColumnPinning',
        },
        {
          fn: (position) => table_getIsSomeColumnsPinned(table, position),
          fnName: 'table_getIsSomeColumnsPinned',
        },
        // header groups
        {
          fn: () => table_getLeftHeaderGroups(table),
          fnName: 'table_getLeftHeaderGroups',
          memoDeps: () => [
            table.getAllColumns(),
            callMemoOrStaticFn(
              table,
              'getVisibleLeafColumns',
              table_getVisibleLeafColumns,
            ),
            table.options.state?.columnPinning?.left,
          ],
        },
        {
          fn: () => table_getCenterHeaderGroups(table),
          fnName: 'table_getCenterHeaderGroups',
          memoDeps: () => [
            table.getAllColumns(),
            callMemoOrStaticFn(
              table,
              'getVisibleLeafColumns',
              table_getVisibleLeafColumns,
            ),
            table.options.state?.columnPinning,
          ],
        },
        {
          fn: () => table_getRightHeaderGroups(table),
          fnName: 'table_getRightHeaderGroups',
          memoDeps: () => [
            table.getAllColumns(),
            callMemoOrStaticFn(
              table,
              'getVisibleLeafColumns',
              table_getVisibleLeafColumns,
            ),
            table.options.state?.columnPinning?.right,
          ],
        },
        // footer groups
        {
          fn: () => table_getLeftFooterGroups(table),
          fnName: 'table_getLeftFooterGroups',
          memoDeps: () => [
            callMemoOrStaticFn(
              table,
              'getLeftHeaderGroups',
              table_getLeftHeaderGroups,
            ),
          ],
        },
        {
          fn: () => table_getCenterFooterGroups(table),
          fnName: 'table_getCenterFooterGroups',
          memoDeps: () => [
            callMemoOrStaticFn(
              table,
              'getCenterHeaderGroups',
              table_getCenterHeaderGroups,
            ),
          ],
        },
        {
          fn: () => table_getRightFooterGroups(table),
          fnName: 'table_getRightFooterGroups',
          memoDeps: () => [
            callMemoOrStaticFn(
              table,
              'getRightHeaderGroups',
              table_getRightHeaderGroups,
            ),
          ],
        },
        // flat headers
        {
          fn: () => table_getLeftFlatHeaders(table),
          fnName: 'table_getLeftFlatHeaders',
          memoDeps: () => [
            callMemoOrStaticFn(
              table,
              'getLeftHeaderGroups',
              table_getLeftHeaderGroups,
            ),
          ],
        },
        {
          fn: () => table_getRightFlatHeaders(table),
          fnName: 'table_getRightFlatHeaders',
          memoDeps: () => [
            callMemoOrStaticFn(
              table,
              'getRightHeaderGroups',
              table_getRightHeaderGroups,
            ),
          ],
        },
        {
          fn: () => table_getCenterFlatHeaders(table),
          fnName: 'table_getCenterFlatHeaders',
          memoDeps: () => [
            callMemoOrStaticFn(
              table,
              'getCenterHeaderGroups',
              table_getCenterHeaderGroups,
            ),
          ],
        },
        // leaf headers
        {
          fn: () => table_getLeftLeafHeaders(table),
          fnName: 'table_getLeftLeafHeaders',
          memoDeps: () => [
            callMemoOrStaticFn(
              table,
              'getLeftHeaderGroups',
              table_getLeftHeaderGroups,
            ),
          ],
        },
        {
          fn: () => table_getRightLeafHeaders(table),
          fnName: 'table_getRightLeafHeaders',
          memoDeps: () => [
            callMemoOrStaticFn(
              table,
              'getRightHeaderGroups',
              table_getRightHeaderGroups,
            ),
          ],
        },
        {
          fn: () => table_getCenterLeafHeaders(table),
          fnName: 'table_getCenterLeafHeaders',
          memoDeps: () => [
            callMemoOrStaticFn(
              table,
              'getCenterHeaderGroups',
              table_getCenterHeaderGroups,
            ),
          ],
        },
        // leaf columns
        {
          fn: () => table_getLeftLeafColumns(table),
          fnName: 'table_getLeftLeafColumns',
          memoDeps: () => [
            table.options.columns,
            table.options.state?.columnPinning,
          ],
        },
        {
          fn: () => table_getRightLeafColumns(table),
          fnName: 'table_getRightLeafColumns',
          memoDeps: () => [
            table.options.columns,
            table.options.state?.columnPinning,
          ],
        },
        {
          fn: () => table_getCenterLeafColumns(table),
          fnName: 'table_getCenterLeafColumns',
          memoDeps: () => [
            table.options.columns,
            table.options.state?.columnPinning,
          ],
        },
        // visible leaf columns
        {
          fn: () => table_getLeftVisibleLeafColumns(table),
          fnName: 'table_getLeftVisibleLeafColumns',
          memoDeps: () => [
            table.options.columns,
            table.options.state?.columnPinning,
            table.options.state?.columnVisibility,
          ],
        },
        {
          fn: () => table_getCenterVisibleLeafColumns(table),
          fnName: 'table_getCenterVisibleLeafColumns',
          memoDeps: () => [
            table.options.columns,
            table.options.state?.columnPinning,
            table.options.state?.columnVisibility,
          ],
        },
        {
          fn: () => table_getRightVisibleLeafColumns(table),
          fnName: 'table_getRightVisibleLeafColumns',
          memoDeps: () => [
            table.options.columns,
            table.options.state?.columnPinning,
            table.options.state?.columnVisibility,
          ],
        },
      ])
    },
  }
}

/**
 * The Column Pinning feature adds column pinning state and APIs to the table, row, and column objects.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning)
 * [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
 */
export const columnPinningFeature = constructColumnPinningFeature()
