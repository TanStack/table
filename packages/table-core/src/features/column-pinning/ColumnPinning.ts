import { assignAPIs, makeStateUpdater } from '../../utils'
import { table_getState } from '../../core/table/Tables.utils'
import { table_getVisibleLeafColumns } from '../column-visibility/ColumnVisibility.utils'
import { table_getAllColumns } from '../../core/columns/Columns.utils'
import { row_getAllCells } from '../../core/rows/Rows.utils'
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
} from './ColumnPinning.utils'
import type { Fns } from '../../types/Fns'
import type { TableState } from '../../types/TableState'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Row } from '../../types/Row'
import type { Column } from '../../types/Column'
import type {
  ColumnPinningDefaultOptions,
  Column_ColumnPinning,
  Row_ColumnPinning,
  TableState_ColumnPinning,
  Table_ColumnPinning,
} from './ColumnPinning.types'

/**
 * The Column Pinning feature adds column pinning state and APIs to the table, row, and column objects.
 * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning)
 * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-pinning)
 */
export const ColumnPinning: TableFeature = {
  getInitialState: <TFeatures extends TableFeatures>(
    state: TableState<TFeatures>,
  ): TableState<TFeatures> & TableState_ColumnPinning => {
    return {
      columnPinning: getDefaultColumnPinningState(),
      ...state,
    }
  },

  getDefaultOptions: <
    TFeatures extends TableFeatures,
    TFns extends Fns<TFeatures, TFns, TData>,
    TData extends RowData,
  >(
    table: Table<TFeatures, TFns, TData> &
      Partial<Table_ColumnPinning<TFeatures, TFns, TData>>,
  ): ColumnPinningDefaultOptions => {
    return {
      onColumnPinningChange: makeStateUpdater('columnPinning', table),
    }
  },

  constructColumn: <
    TFeatures extends TableFeatures,
    TFns extends Fns<TFeatures, TFns, TData>,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column<TFeatures, TFns, TData, TValue> &
      Partial<Column_ColumnPinning>,
    table: Table<TFeatures, TFns, TData> &
      Partial<Table_ColumnPinning<TFeatures, TFns, TData>>,
  ): void => {
    assignAPIs(column, table, [
      {
        fn: (position) => column_pin(column, table, position),
      },
      {
        fn: () => column_getCanPin(column, table),
      },
      {
        fn: () => column_getPinnedIndex(column, table),
      },
      {
        fn: () => column_getIsPinned(column, table),
      },
    ])
  },

  constructRow: <
    TFeatures extends TableFeatures,
    TFns extends Fns<TFeatures, TFns, TData>,
    TData extends RowData,
  >(
    row: Row<TFeatures, TFns, TData> &
      Partial<Row_ColumnPinning<TFeatures, TFns, TData>>,
    table: Table<TFeatures, TFns, TData> &
      Partial<Table_ColumnPinning<TFeatures, TFns, TData>>,
  ): void => {
    assignAPIs(row, table, [
      {
        fn: () => row_getCenterVisibleCells(row, table),
        memoDeps: () => [
          row_getAllCells(row, table),
          table_getState(table).columnPinning,
          table_getState(table).columnVisibility,
        ],
      },
      {
        fn: () => row_getLeftVisibleCells(row, table),
        memoDeps: () => [
          row_getAllCells(row, table),
          table_getState(table).columnPinning?.left,
          table_getState(table).columnVisibility,
        ],
      },
      {
        fn: () => row_getRightVisibleCells(row, table),
        memoDeps: () => [
          row_getAllCells(row, table),
          table_getState(table).columnPinning?.right,
          table_getState(table).columnVisibility,
        ],
      },
    ])
  },

  constructTable: <
    TFeatures extends TableFeatures,
    TFns extends Fns<TFeatures, TFns, TData>,
    TData extends RowData,
  >(
    table: Table<TFeatures, TFns, TData> &
      Partial<Table_ColumnPinning<TFeatures, TFns, TData>>,
  ): void => {
    assignAPIs(table, table, [
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
          table_getAllColumns(table),
          table_getVisibleLeafColumns(table),
          table_getState(table).columnPinning?.left,
        ],
      },
      {
        fn: () => table_getCenterHeaderGroups(table),
        memoDeps: () => [
          table_getAllColumns(table),
          table_getVisibleLeafColumns(table),
          table_getState(table).columnPinning,
        ],
      },
      {
        fn: () => table_getRightHeaderGroups(table),
        memoDeps: () => [
          table_getAllColumns(table),
          table_getVisibleLeafColumns(table),
          table_getState(table).columnPinning?.right,
        ],
      },
      // footer groups
      {
        fn: () => table_getLeftFooterGroups(table),
        memoDeps: () => [table_getLeftHeaderGroups(table)],
      },
      {
        fn: () => table_getCenterFooterGroups(table),
        memoDeps: () => [table_getCenterHeaderGroups(table)],
      },
      {
        fn: () => table_getRightFooterGroups(table),
        memoDeps: () => [table_getRightHeaderGroups(table)],
      },
      // flat headers
      {
        fn: () => table_getLeftFlatHeaders(table),
        memoDeps: () => [table_getLeftHeaderGroups(table)],
      },
      {
        fn: () => table_getRightFlatHeaders(table),
        memoDeps: () => [table_getRightHeaderGroups(table)],
      },
      {
        fn: () => table_getCenterFlatHeaders(table),
        memoDeps: () => [table_getCenterHeaderGroups(table)],
      },
      // leaf headers
      {
        fn: () => table_getLeftLeafHeaders(table),
        memoDeps: () => [table_getLeftHeaderGroups(table)],
      },
      {
        fn: () => table_getRightLeafHeaders(table),
        memoDeps: () => [table_getRightHeaderGroups(table)],
      },
      {
        fn: () => table_getCenterLeafHeaders(table),
        memoDeps: () => [table_getCenterHeaderGroups(table)],
      },
      // leaf columns
      {
        fn: () => table_getLeftLeafColumns(table),
        memoDeps: () => [
          table.options.columns,
          table_getState(table).columnPinning,
        ],
      },
      {
        fn: () => table_getRightLeafColumns(table),
        memoDeps: () => [
          table.options.columns,
          table_getState(table).columnPinning,
        ],
      },
      {
        fn: () => table_getCenterLeafColumns(table),
        memoDeps: () => [
          table.options.columns,
          table_getState(table).columnPinning,
        ],
      },
      // visible leaf columns
      {
        fn: () => table_getLeftVisibleLeafColumns(table),
        memoDeps: () => [
          table.options.columns,
          table_getState(table).columnPinning,
          table_getState(table).columnVisibility,
        ],
      },
      {
        fn: () => table_getCenterVisibleLeafColumns(table),
        memoDeps: () => [
          table.options.columns,
          table_getState(table).columnPinning,
          table_getState(table).columnVisibility,
        ],
      },
      {
        fn: () => table_getRightVisibleLeafColumns(table),
        memoDeps: () => [
          table.options.columns,
          table_getState(table).columnPinning,
          table_getState(table).columnVisibility,
        ],
      },
    ])
  },
}
