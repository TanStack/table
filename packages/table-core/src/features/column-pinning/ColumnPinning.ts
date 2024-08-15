import { buildHeaderGroups } from '../../core/headers/buildHeaderGroups'
import { getMemoOptions, makeStateUpdater, memo } from '../../utils'
import { _table_getState } from '../../core/table/Tables.utils'
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
  _getInitialState: (state): TableState_ColumnPinning => {
    return {
      columnPinning: getDefaultColumnPinningState(),
      ...state,
    }
  },

  _getDefaultOptions: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData> &
      Partial<Table_ColumnPinning<TFeatures, TData>>,
  ): ColumnPinningDefaultOptions => {
    return {
      onColumnPinningChange: makeStateUpdater('columnPinning', table),
    }
  },

  _createColumn: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column<TFeatures, TData, TValue> & Partial<Column_ColumnPinning>,
    table: Table<TFeatures, TData> &
      Partial<Table_ColumnPinning<TFeatures, TData>>,
  ): void => {
    column.pin = (position) => column_pin(column, table, position)

    column.getCanPin = () => column_getCanPin(column, table)

    column.getPinnedIndex = () => column_getPinnedIndex(column, table)

    column.getIsPinned = () => column_getIsPinned(column, table)
  },

  _createRow: <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData> & Partial<Row_ColumnPinning<TFeatures, TData>>,
    table: Table<TFeatures, TData> &
      Partial<Table_ColumnPinning<TFeatures, TData>>,
  ): void => {
    row.getCenterVisibleCells = memo(
      () => [
        row_getAllCells(row, table),
        _table_getState(table).columnPinning,
        _table_getState(table).columnVisibility,
      ],
      () => row_getCenterVisibleCells(row, table),
      getMemoOptions(table.options, 'debugRows', 'getCenterVisibleCells'),
    )
    row.getLeftVisibleCells = memo(
      () => [
        row_getAllCells(row, table),
        _table_getState(table).columnPinning?.left,
        _table_getState(table).columnVisibility,
      ],
      () => row_getLeftVisibleCells(row, table),
      getMemoOptions(table.options, 'debugRows', 'getLeftVisibleCells'),
    )
    row.getRightVisibleCells = memo(
      () => [
        row_getAllCells(row, table),
        _table_getState(table).columnPinning?.right,
        _table_getState(table).columnVisibility,
      ],
      () => row_getRightVisibleCells(row, table),
      getMemoOptions(table.options, 'debugRows', 'getRightVisibleCells'),
    )
  },

  _createTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData> &
      Partial<Table_ColumnPinning<TFeatures, TData>>,
  ): void => {
    table.setColumnPinning = (updater) => table_setColumnPinning(table, updater)

    table.resetColumnPinning = (defaultState) =>
      table_resetColumnPinning(table, defaultState)

    table.getIsSomeColumnsPinned = (position) =>
      table_getIsSomeColumnsPinned(table, position)

    // header groups

    table.getLeftHeaderGroups = memo(
      () => [
        table_getAllColumns(table),
        table_getVisibleLeafColumns(table),
        _table_getState(table).columnPinning?.left,
      ],
      () => table_getLeftHeaderGroups(table),
      getMemoOptions(table.options, 'debugHeaders', 'getLeftHeaderGroups'),
    )

    table.getRightHeaderGroups = memo(
      () => [
        table_getAllColumns(table),
        table_getVisibleLeafColumns(table),
        _table_getState(table).columnPinning?.right,
      ],
      () => table_getRightHeaderGroups(table),
      getMemoOptions(table.options, 'debugHeaders', 'getRightHeaderGroups'),
    )

    table.getCenterHeaderGroups = memo(
      () => [
        table.getAllColumns(),
        table_getVisibleLeafColumns(table),
        _table_getState(table).columnPinning,
      ],
      () => table_getCenterHeaderGroups(table),
      getMemoOptions(table.options, 'debugHeaders', 'getCenterHeaderGroups'),
    )

    // footer groups

    table.getLeftFooterGroups = memo(
      () => [table_getLeftHeaderGroups(table)],
      (headerGroups) => table_getLeftFooterGroups(table),
      getMemoOptions(table.options, 'debugHeaders', 'getLeftFooterGroups'),
    )

    table.getCenterFooterGroups = memo(
      () => [table_getCenterHeaderGroups(table)],
      () => table_getCenterFooterGroups(table),
      getMemoOptions(table.options, 'debugHeaders', 'getCenterFooterGroups'),
    )

    table.getRightFooterGroups = memo(
      () => [table_getRightHeaderGroups(table)],
      () => table_getRightFooterGroups(table),
      getMemoOptions(table.options, 'debugHeaders', 'getRightFooterGroups'),
    )

    // flat headers

    table.getLeftFlatHeaders = memo(
      () => [table_getLeftHeaderGroups(table)],
      (left) => table_getLeftFlatHeaders(table),
      getMemoOptions(table.options, 'debugHeaders', 'getLeftFlatHeaders'),
    )

    table.getRightFlatHeaders = memo(
      () => [table_getRightHeaderGroups(table)],
      () => table_getRightFlatHeaders(table),
      getMemoOptions(table.options, 'debugHeaders', 'getRightFlatHeaders'),
    )

    table.getCenterFlatHeaders = memo(
      () => [table_getCenterHeaderGroups(table)],
      () => table_getCenterFlatHeaders(table),
      getMemoOptions(table.options, 'debugHeaders', 'getCenterFlatHeaders'),
    )

    // leaf headers

    table.getCenterLeafHeaders = memo(
      () => [table_getCenterFlatHeaders(table)],
      () => table_getCenterLeafHeaders(table),
      getMemoOptions(table.options, 'debugHeaders', 'getCenterLeafHeaders'),
    )

    table.getLeftLeafHeaders = memo(
      () => [table_getLeftFlatHeaders(table)],
      () => table_getLeftLeafHeaders(table),
      getMemoOptions(table.options, 'debugHeaders', 'getLeftLeafHeaders'),
    )

    table.getRightLeafHeaders = memo(
      () => [table_getRightFlatHeaders(table)],
      () => table_getRightLeafHeaders(table),
      getMemoOptions(table.options, 'debugHeaders', 'getRightLeafHeaders'),
    )

    // leaf columns

    table.getLeftLeafColumns = memo(
      () => [table.options.columns, _table_getState(table).columnPinning],
      () => table_getLeftLeafColumns(table),
      getMemoOptions(table.options, 'debugColumns', 'getLeftLeafColumns'),
    )

    table.getRightLeafColumns = memo(
      () => [table.options.columns, _table_getState(table).columnPinning],
      () => table_getRightLeafColumns(table),
      getMemoOptions(table.options, 'debugColumns', 'getRightLeafColumns'),
    )

    table.getCenterLeafColumns = memo(
      () => [table.options.columns, _table_getState(table).columnPinning],
      () => table_getCenterLeafColumns(table),
      getMemoOptions(table.options, 'debugColumns', 'getCenterLeafColumns'),
    )

    // visible leaf columns

    table.getLeftVisibleLeafColumns = memo(
      () => [
        table.options.columns,
        _table_getState(table).columnPinning,
        _table_getState(table).columnVisibility,
      ],
      () => table_getLeftVisibleLeafColumns(table),
      getMemoOptions(
        table.options,
        'debugColumns',
        'getLeftVisibleLeafColumns',
      ),
    )

    table.getCenterVisibleLeafColumns = memo(
      () => [
        table.options.columns,
        _table_getState(table).columnPinning,
        _table_getState(table).columnVisibility,
      ],
      () => table_getCenterVisibleLeafColumns(table),
      getMemoOptions(
        table.options,
        'debugColumns',
        'getCenterVisibleLeafColumns',
      ),
    )

    table.getRightVisibleLeafColumns = memo(
      () => [
        table.options.columns,
        _table_getState(table).columnPinning,
        _table_getState(table).columnVisibility,
      ],
      () => table_getRightVisibleLeafColumns(table),
      getMemoOptions(
        table.options,
        'debugColumns',
        'getRightVisibleLeafColumns',
      ),
    )
  },
}
