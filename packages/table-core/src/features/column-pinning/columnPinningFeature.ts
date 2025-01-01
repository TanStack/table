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
import type {
  ColumnDef_ColumnPinning,
  Column_ColumnPinning,
  Row_ColumnPinning,
  TableOptions_ColumnPinning,
  TableState_ColumnPinning,
  Table_ColumnPinning,
} from './columnPinningFeature.types'

interface ColumnPinningFeatureConstructors {
  Column: Column_ColumnPinning
  ColumnDef: ColumnDef_ColumnPinning
  Row: Row_ColumnPinning<TableFeatures, RowData>
  Table: Table_ColumnPinning<TableFeatures, RowData>
  TableOptions: TableOptions_ColumnPinning
  TableState: TableState_ColumnPinning
}

/**
 * The Column Pinning feature adds column pinning state and APIs to the table, row, and column objects.
 * [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning)
 * [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
 */
export const columnPinningFeature: TableFeature<ColumnPinningFeatureConstructors> =
  {
    getInitialState: (initialState) => {
      return {
        ...initialState,
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
      assignAPIs(column, [
        {
          fn: (position) => column_pin(column, position),
        },
        {
          fn: () => column_getCanPin(column),
        },
        {
          fn: () => column_getPinnedIndex(column),
        },
        {
          fn: () => column_getIsPinned(column),
        },
      ])
    },

    constructRowAPIs: (row) => {
      assignAPIs(row, [
        {
          fn: () => row_getCenterVisibleCells(row),
          memoDeps: () => [
            row.getAllCells(),
            row._table.options.state?.columnPinning,
            row._table.options.state?.columnVisibility,
          ],
        },
        {
          fn: () => row_getLeftVisibleCells(row),
          memoDeps: () => [
            row.getAllCells(),
            row._table.options.state?.columnPinning?.left,
            row._table.options.state?.columnVisibility,
          ],
        },
        {
          fn: () => row_getRightVisibleCells(row),
          memoDeps: () => [
            row.getAllCells(),
            row._table.options.state?.columnPinning?.right,
            row._table.options.state?.columnVisibility,
          ],
        },
      ])
    },

    constructTableAPIs: (table) => {
      assignAPIs(table, [
        {
          fn: (updater) => table_setColumnPinning(table, updater),
        },
        {
          fn: (defaultState) => table_resetColumnPinning(table, defaultState),
        },
        {
          fn: (position) => table_getIsSomeColumnsPinned(table, position),
        },
        // header groups
        {
          fn: () => table_getLeftHeaderGroups(table),
          memoDeps: () => [
            table.getAllColumns(),
            callMemoOrStaticFn(table, table_getVisibleLeafColumns),
            table.options.state?.columnPinning?.left,
          ],
        },
        {
          fn: () => table_getCenterHeaderGroups(table),
          memoDeps: () => [
            table.getAllColumns(),
            callMemoOrStaticFn(table, table_getVisibleLeafColumns),
            table.options.state?.columnPinning,
          ],
        },
        {
          fn: () => table_getRightHeaderGroups(table),
          memoDeps: () => [
            table.getAllColumns(),
            callMemoOrStaticFn(table, table_getVisibleLeafColumns),
            table.options.state?.columnPinning?.right,
          ],
        },
        // footer groups
        {
          fn: () => table_getLeftFooterGroups(table),
          memoDeps: () => [
            callMemoOrStaticFn(table, table_getLeftHeaderGroups),
          ],
        },
        {
          fn: () => table_getCenterFooterGroups(table),
          memoDeps: () => [
            callMemoOrStaticFn(table, table_getCenterHeaderGroups),
          ],
        },
        {
          fn: () => table_getRightFooterGroups(table),
          memoDeps: () => [
            callMemoOrStaticFn(table, table_getRightHeaderGroups),
          ],
        },
        // flat headers
        {
          fn: () => table_getLeftFlatHeaders(table),
          memoDeps: () => [
            callMemoOrStaticFn(table, table_getLeftHeaderGroups),
          ],
        },
        {
          fn: () => table_getRightFlatHeaders(table),
          memoDeps: () => [
            callMemoOrStaticFn(table, table_getRightHeaderGroups),
          ],
        },
        {
          fn: () => table_getCenterFlatHeaders(table),
          memoDeps: () => [
            callMemoOrStaticFn(table, table_getCenterHeaderGroups),
          ],
        },
        // leaf headers
        {
          fn: () => table_getLeftLeafHeaders(table),
          memoDeps: () => [
            callMemoOrStaticFn(table, table_getLeftHeaderGroups),
          ],
        },
        {
          fn: () => table_getRightLeafHeaders(table),
          memoDeps: () => [
            callMemoOrStaticFn(table, table_getRightHeaderGroups),
          ],
        },
        {
          fn: () => table_getCenterLeafHeaders(table),
          memoDeps: () => [
            callMemoOrStaticFn(table, table_getCenterHeaderGroups),
          ],
        },
        // leaf columns
        {
          fn: () => table_getLeftLeafColumns(table),
          memoDeps: () => [
            table.options.columns,
            table.options.state?.columnPinning,
          ],
        },
        {
          fn: () => table_getRightLeafColumns(table),
          memoDeps: () => [
            table.options.columns,
            table.options.state?.columnPinning,
          ],
        },
        {
          fn: () => table_getCenterLeafColumns(table),
          memoDeps: () => [
            table.options.columns,
            table.options.state?.columnPinning,
          ],
        },
        // visible leaf columns
        {
          fn: () => table_getLeftVisibleLeafColumns(table),
          memoDeps: () => [
            table.options.columns,
            table.options.state?.columnPinning,
            table.options.state?.columnVisibility,
          ],
        },
        {
          fn: () => table_getCenterVisibleLeafColumns(table),
          memoDeps: () => [
            table.options.columns,
            table.options.state?.columnPinning,
            table.options.state?.columnVisibility,
          ],
        },
        {
          fn: () => table_getRightVisibleLeafColumns(table),
          memoDeps: () => [
            table.options.columns,
            table.options.state?.columnPinning,
            table.options.state?.columnVisibility,
          ],
        },
      ])
    },
  }
