import { buildHeaderGroups } from '../../core/headers/buildHeaderGroups'
import { getMemoOptions, makeStateUpdater, memo } from '../../utils'
import {
  column_getCanPin,
  column_getPinnedIndex,
  column_pin,
  getDefaultColumnPinningState,
  row_getCenterVisibleCells,
  row_getLeftVisibleCells,
  row_getRightVisibleCells,
  table_getCenterLeafColumns,
  table_getIsSomeColumnsPinned,
  table_getLeftLeafColumns,
  table_getRightLeafColumns,
  table_resetColumnPinning,
  table_setColumnPinning,
} from './ColumnPinning.utils'
import type { Column, Row, RowData, Table, TableFeature } from '../../types'
import type {
  ColumnPinningDefaultOptions,
  TableState_ColumnPinning,
} from './ColumnPinning.types'

const debug = 'debugHeaders'

export const ColumnPinning: TableFeature = {
  _getInitialState: (state): TableState_ColumnPinning => {
    return {
      columnPinning: getDefaultColumnPinningState(),
      ...state,
    }
  },

  _getDefaultOptions: <TData extends RowData>(
    table: Partial<Table<TData>>,
  ): ColumnPinningDefaultOptions => {
    return {
      onColumnPinningChange: makeStateUpdater('columnPinning', table),
    }
  },

  _createColumn: <TData extends RowData, TValue>(
    column: Column<TData, TValue>,
    table: Table<TData>,
  ): void => {
    column.pin = (position) => column_pin(column, table, position)

    column.getCanPin = () => column_getCanPin(column, table)

    column.getPinnedIndex = () => column_getPinnedIndex(column, table)
  },

  _createRow: <TData extends RowData>(
    row: Row<TData>,
    table: Table<TData>,
  ): void => {
    row.getCenterVisibleCells = memo(
      () => [
        row._getAllVisibleCells(),
        table.getState().columnPinning.left,
        table.getState().columnPinning.right,
      ],
      (allCells, left, right) =>
        row_getCenterVisibleCells(allCells, left, right),
      getMemoOptions(table.options, 'debugRows', 'getCenterVisibleCells'),
    )
    row.getLeftVisibleCells = memo(
      () => [row._getAllVisibleCells(), table.getState().columnPinning.left],
      (allCells, left) => row_getLeftVisibleCells(allCells, left),
      getMemoOptions(table.options, 'debugRows', 'getLeftVisibleCells'),
    )
    row.getRightVisibleCells = memo(
      () => [row._getAllVisibleCells(), table.getState().columnPinning.right],
      (allCells, right) => row_getRightVisibleCells(allCells, right),
      getMemoOptions(table.options, 'debugRows', 'getRightVisibleCells'),
    )
  },

  _createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setColumnPinning = (updater) => table_setColumnPinning(table, updater)

    table.resetColumnPinning = (defaultState) =>
      table_resetColumnPinning(table, defaultState)

    table.getIsSomeColumnsPinned = (position) =>
      table_getIsSomeColumnsPinned(table, position)

    table.getLeftLeafColumns = memo(
      () => [table.getAllLeafColumns(), table.getState().columnPinning.left],
      (allColumns, left) => table_getLeftLeafColumns(allColumns, left),
      getMemoOptions(table.options, 'debugColumns', 'getLeftLeafColumns'),
    )

    table.getRightLeafColumns = memo(
      () => [table.getAllLeafColumns(), table.getState().columnPinning.right],
      (allColumns, right) => table_getRightLeafColumns(allColumns, right),
      getMemoOptions(table.options, 'debugColumns', 'getRightLeafColumns'),
    )

    table.getCenterLeafColumns = memo(
      () => [
        table.getAllLeafColumns(),
        table.getState().columnPinning.left,
        table.getState().columnPinning.right,
      ],
      (allColumns, left, right) => table_getCenterLeafColumns(allColumns, left),
      getMemoOptions(table.options, 'debugColumns', 'getCenterLeafColumns'),
    )

    table.getCenterHeaderGroups = memo(
      () => [
        table.getAllColumns(),
        table.getVisibleLeafColumns(),
        table.getState().columnPinning.left,
        table.getState().columnPinning.right,
      ],
      (allColumns, leafColumns, left, right) => {
        leafColumns = leafColumns.filter(
          (column) => !left?.includes(column.id) && !right?.includes(column.id),
        )
        return buildHeaderGroups(allColumns, leafColumns, table, 'center')
      },
      getMemoOptions(table.options, debug, 'getCenterHeaderGroups'),
    )

    table.getLeftHeaderGroups = memo(
      () => [
        table.getAllColumns(),
        table.getVisibleLeafColumns(),
        table.getState().columnPinning.left,
      ],
      (allColumns, leafColumns, left) => {
        const orderedLeafColumns =
          left
            ?.map((columnId) => leafColumns.find((d) => d.id === columnId)!)
            .filter(Boolean) ?? []

        return buildHeaderGroups(allColumns, orderedLeafColumns, table, 'left')
      },
      getMemoOptions(table.options, debug, 'getLeftHeaderGroups'),
    )

    table.getRightHeaderGroups = memo(
      () => [
        table.getAllColumns(),
        table.getVisibleLeafColumns(),
        table.getState().columnPinning.right,
      ],
      (allColumns, leafColumns, right) => {
        const orderedLeafColumns =
          right
            ?.map((columnId) => leafColumns.find((d) => d.id === columnId)!)
            .filter(Boolean) ?? []

        return buildHeaderGroups(allColumns, orderedLeafColumns, table, 'right')
      },
      getMemoOptions(table.options, debug, 'getRightHeaderGroups'),
    )

    table.getLeftFooterGroups = memo(
      () => [table.getLeftHeaderGroups()],
      (headerGroups) => {
        return [...headerGroups].reverse()
      },
      getMemoOptions(table.options, debug, 'getLeftFooterGroups'),
    )

    table.getCenterFooterGroups = memo(
      () => [table.getCenterHeaderGroups()],
      (headerGroups) => {
        return [...headerGroups].reverse()
      },
      getMemoOptions(table.options, debug, 'getCenterFooterGroups'),
    )

    table.getRightFooterGroups = memo(
      () => [table.getRightHeaderGroups()],
      (headerGroups) => {
        return [...headerGroups].reverse()
      },
      getMemoOptions(table.options, debug, 'getRightFooterGroups'),
    )

    table.getLeftFlatHeaders = memo(
      () => [table.getLeftHeaderGroups()],
      (left) => {
        return left
          .map((headerGroup) => {
            return headerGroup.headers
          })
          .flat()
      },
      getMemoOptions(table.options, debug, 'getLeftFlatHeaders'),
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
      getMemoOptions(table.options, debug, 'getCenterFlatHeaders'),
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
      getMemoOptions(table.options, debug, 'getRightFlatHeaders'),
    )

    table.getCenterLeafHeaders = memo(
      () => [table.getCenterFlatHeaders()],
      (flatHeaders) => {
        return flatHeaders.filter((header) => !header.subHeaders.length)
      },
      getMemoOptions(table.options, debug, 'getCenterLeafHeaders'),
    )

    table.getLeftLeafHeaders = memo(
      () => [table.getLeftFlatHeaders()],
      (flatHeaders) => {
        return flatHeaders.filter((header) => !header.subHeaders.length)
      },
      getMemoOptions(table.options, debug, 'getLeftLeafHeaders'),
    )

    table.getRightLeafHeaders = memo(
      () => [table.getRightFlatHeaders()],
      (flatHeaders) => {
        return flatHeaders.filter((header) => !header.subHeaders.length)
      },
      getMemoOptions(table.options, debug, 'getRightLeafHeaders'),
    )
  },
}
