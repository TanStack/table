import { buildHeaderGroups } from '../../core/headers/buildHeaderGroups'
import { getMemoOptions, makeStateUpdater, memo } from '../../utils'
import { _table_getState } from '../../core/table/Tables.utils'
import {
  column_getCanPin,
  column_getIsPinned,
  column_getPinnedIndex,
  column_pin,
  getDefaultColumnPinningState,
  row_getCenterVisibleCells,
  row_getLeftVisibleCells,
  row_getRightVisibleCells,
  table_getCenterLeafColumns,
  table_getCenterVisibleLeafColumns,
  table_getIsSomeColumnsPinned,
  table_getLeftLeafColumns,
  table_getLeftVisibleLeafColumns,
  table_getRightLeafColumns,
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
      () => [row._getAllVisibleCells(), _table_getState(table).columnPinning],
      () => row_getCenterVisibleCells(row, table),
      getMemoOptions(table.options, 'debugRows', 'getCenterVisibleCells'),
    )
    row.getLeftVisibleCells = memo(
      () => [
        row._getAllVisibleCells(),
        _table_getState(table).columnPinning?.left,
      ],
      () => row_getLeftVisibleCells(row, table),
      getMemoOptions(table.options, 'debugRows', 'getLeftVisibleCells'),
    )
    row.getRightVisibleCells = memo(
      () => [
        row._getAllVisibleCells(),
        _table_getState(table).columnPinning?.right,
      ],
      () => row_getRightVisibleCells(row, table),
      getMemoOptions(table.options, 'debugRows', 'getRightVisibleCells'),
    )
  },

  _createTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData> &
      Partial<Table_ColumnPinning<TFeatures, TData>>,
  ): void => {
    const { columnPinning, columnVisibility } = table.getState()
    const columns = table.options.columns

    table.setColumnPinning = (updater) => table_setColumnPinning(table, updater)

    table.resetColumnPinning = (defaultState) =>
      table_resetColumnPinning(table, defaultState)

    table.getIsSomeColumnsPinned = (position) =>
      table_getIsSomeColumnsPinned(table, position)

    // header groups

    table.getLeftHeaderGroups = memo(
      () => [
        table.getAllColumns(),
        table.getVisibleLeafColumns(),
        _table_getState(table).columnPinning?.left,
      ],
      (allColumns, leafColumns, left) => {
        const orderedLeafColumns =
          left
            ?.map((columnId) => leafColumns.find((d) => d.id === columnId)!)
            .filter(Boolean) ?? []

        return buildHeaderGroups(allColumns, orderedLeafColumns, table, 'left')
      },
      getMemoOptions(table.options, 'debugHeaders', 'getLeftHeaderGroups'),
    )

    table.getRightHeaderGroups = memo(
      () => [
        table.getAllColumns(),
        table.getVisibleLeafColumns(),
        _table_getState(table).columnPinning?.right,
      ],
      (allColumns, leafColumns, right) => {
        const orderedLeafColumns =
          right
            ?.map((columnId) => leafColumns.find((d) => d.id === columnId)!)
            .filter(Boolean) ?? []

        return buildHeaderGroups(allColumns, orderedLeafColumns, table, 'right')
      },
      getMemoOptions(table.options, 'debugHeaders', 'getRightHeaderGroups'),
    )

    table.getCenterHeaderGroups = memo(
      () => [
        table.getAllColumns(),
        table.getVisibleLeafColumns(),
        _table_getState(table).columnPinning?.left,
        _table_getState(table).columnPinning?.right,
      ],
      (allColumns, leafColumns, left, right) => {
        leafColumns = leafColumns.filter(
          (column) => !left?.includes(column.id) && !right?.includes(column.id),
        )
        return buildHeaderGroups(allColumns, leafColumns, table, 'center')
      },
      getMemoOptions(table.options, 'debugHeaders', 'getCenterHeaderGroups'),
    )

    // footer groups

    table.getLeftFooterGroups = memo(
      () => [table.getLeftHeaderGroups()],
      (headerGroups) => {
        return [...headerGroups].reverse()
      },
      getMemoOptions(table.options, 'debugHeaders', 'getLeftFooterGroups'),
    )

    table.getCenterFooterGroups = memo(
      () => [table.getCenterHeaderGroups()],
      (headerGroups) => {
        return [...headerGroups].reverse()
      },
      getMemoOptions(table.options, 'debugHeaders', 'getCenterFooterGroups'),
    )

    table.getRightFooterGroups = memo(
      () => [table.getRightHeaderGroups()],
      (headerGroups) => {
        return [...headerGroups].reverse()
      },
      getMemoOptions(table.options, 'debugHeaders', 'getRightFooterGroups'),
    )

    // flat headers

    table.getLeftFlatHeaders = memo(
      () => [table.getLeftHeaderGroups()],
      (left) => {
        return left
          .map((headerGroup) => {
            return headerGroup.headers
          })
          .flat()
      },
      getMemoOptions(table.options, 'debugHeaders', 'getLeftFlatHeaders'),
    )

    table.getRightFlatHeaders = memo(
      () => [table.getRightHeaderGroups()],
      (left) => {
        return left
          .map((headerGroup) => {
            return headerGroup.headers
          })
          .flat()
      },
      getMemoOptions(table.options, 'debugHeaders', 'getRightFlatHeaders'),
    )

    table.getCenterFlatHeaders = memo(
      () => [table.getCenterHeaderGroups()],
      (left) => {
        return left
          .map((headerGroup) => {
            return headerGroup.headers
          })
          .flat()
      },
      getMemoOptions(table.options, 'debugHeaders', 'getCenterFlatHeaders'),
    )

    // leaf headers

    table.getCenterLeafHeaders = memo(
      () => [table.getCenterFlatHeaders()],
      (flatHeaders) => {
        return flatHeaders.filter((header) => !header.subHeaders.length)
      },
      getMemoOptions(table.options, 'debugHeaders', 'getCenterLeafHeaders'),
    )

    table.getLeftLeafHeaders = memo(
      () => [table.getLeftFlatHeaders()],
      (flatHeaders) => {
        return flatHeaders.filter((header) => !header.subHeaders.length)
      },
      getMemoOptions(table.options, 'debugHeaders', 'getLeftLeafHeaders'),
    )

    table.getRightLeafHeaders = memo(
      () => [table.getRightFlatHeaders()],
      (flatHeaders) => {
        return flatHeaders.filter((header) => !header.subHeaders.length)
      },
      getMemoOptions(table.options, 'debugHeaders', 'getRightLeafHeaders'),
    )

    // leaf columns

    table.getLeftLeafColumns = memo(
      () => [columns, columnPinning],
      () => table_getLeftLeafColumns(table),
      getMemoOptions(table.options, 'debugColumns', 'getLeftLeafColumns'),
    )

    table.getRightLeafColumns = memo(
      () => [columns, columnPinning],
      () => table_getRightLeafColumns(table),
      getMemoOptions(table.options, 'debugColumns', 'getRightLeafColumns'),
    )

    table.getCenterLeafColumns = memo(
      () => [columns, columnPinning],
      () => table_getCenterLeafColumns(table),
      getMemoOptions(table.options, 'debugColumns', 'getCenterLeafColumns'),
    )

    // visible leaf columns

    table.getLeftVisibleLeafColumns = memo(
      () => [columns, columnPinning, columnVisibility],
      () => table_getLeftVisibleLeafColumns(table),
      getMemoOptions(
        table.options,
        'debugColumns',
        'getLeftVisibleLeafColumns',
      ),
    )

    table.getCenterVisibleLeafColumns = memo(
      () => [columns, columnPinning, columnVisibility],
      () => table_getCenterVisibleLeafColumns(table),
      getMemoOptions(
        table.options,
        'debugColumns',
        'getCenterVisibleLeafColumns',
      ),
    )

    table.getRightVisibleLeafColumns = memo(
      () => [columns, columnPinning, columnVisibility],
      () => table_getRightVisibleLeafColumns(table),
      getMemoOptions(
        table.options,
        'debugColumns',
        'getRightVisibleLeafColumns',
      ),
    )
  },
}
