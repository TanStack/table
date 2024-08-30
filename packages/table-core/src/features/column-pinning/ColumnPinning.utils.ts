import {
  column_getIsVisible,
  row_getAllVisibleCells,
  table_getVisibleLeafColumns,
} from '../column-visibility/ColumnVisibility.utils'
import { table_getAllColumns } from '../../core/columns/Columns.utils'
import {
  table_getInitialState,
  table_getState,
} from '../../core/table/Tables.utils'
import { buildHeaderGroups } from '../../core/headers/buildHeaderGroups'
import type { Row } from '../../types/Row'
import type { CellData, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Cell } from '../../types/Cell'
import type { Column } from '../../types/Column'
import type {
  ColumnDef_ColumnPinning,
  ColumnPinningPosition,
  ColumnPinningState,
  TableOptions_ColumnPinning,
} from './ColumnPinning.types'

// State

export function getDefaultColumnPinningState(): ColumnPinningState {
  return structuredClone({
    left: [],
    right: [],
  })
}

export function column_pin<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TData, TValue>,
  table: Table<TFeatures, TData>,
  position: ColumnPinningPosition,
) {
  const columnIds = column
    .getLeafColumns()
    .map((d) => d.id)
    .filter(Boolean)

  table_setColumnPinning(table, (old) => {
    if (position === 'right') {
      return {
        left: old.left.filter((d) => !columnIds.includes(d)),
        right: [
          ...old.right.filter((d) => !columnIds.includes(d)),
          ...columnIds,
        ],
      }
    }

    if (position === 'left') {
      return {
        left: [...old.left.filter((d) => !columnIds.includes(d)), ...columnIds],
        right: old.right.filter((d) => !columnIds.includes(d)),
      }
    }

    return {
      left: old.left.filter((d) => !columnIds.includes(d)),
      right: old.right.filter((d) => !columnIds.includes(d)),
    }
  })
}

export function column_getCanPin<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TData, TValue> & {
    columnDef: ColumnDef_ColumnPinning
  },
  table: Table<TFeatures, TData> & { options: TableOptions_ColumnPinning },
) {
  const leafColumns = column.getLeafColumns() as Array<
    Column<TFeatures, TData, TValue> & { columnDef: ColumnDef_ColumnPinning }
  >

  return leafColumns.some(
    (leafColumn) =>
      (leafColumn.columnDef.enablePinning ?? true) &&
      (table.options.enableColumnPinning ?? true),
  )
}

export function column_getIsPinned<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TData, TValue>,
  table: Table<TFeatures, TData>,
): ColumnPinningPosition | false {
  const leafColumnIds = column.getLeafColumns().map((d) => d.id)

  const { left, right } =
    table_getState(table).columnPinning ?? getDefaultColumnPinningState()

  const isLeft = leafColumnIds.some((d) => left.includes(d))
  const isRight = leafColumnIds.some((d) => right.includes(d))

  return isLeft ? 'left' : isRight ? 'right' : false
}

export function column_getPinnedIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column<TFeatures, TData, TValue>, table: Table<TFeatures, TData>) {
  const position = column_getIsPinned(column, table)

  return position
    ? table_getState(table).columnPinning?.[position].indexOf(column.id) ?? -1
    : 0
}

export function row_getCenterVisibleCells<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>, table: Table<TFeatures, TData>) {
  const allCells = row_getAllVisibleCells(row, table)
  const { left, right } =
    table_getState(table).columnPinning ?? getDefaultColumnPinningState()
  const leftAndRight: Array<string> = [...left, ...right]
  return allCells.filter((d) => !leftAndRight.includes(d.column.id))
}

export function row_getLeftVisibleCells<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>, table: Table<TFeatures, TData>) {
  const allCells = row_getAllVisibleCells(row, table)
  const { left } =
    table_getState(table).columnPinning ?? getDefaultColumnPinningState()
  const cells = left
    .map((columnId) => allCells.find((cell) => cell.column.id === columnId)!)
    .filter(Boolean)
    .map((d) => ({ ...d, position: 'left' }) as Cell<TFeatures, TData, unknown>)

  return cells
}

export function row_getRightVisibleCells<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>, table: Table<TFeatures, TData>) {
  const allCells = row_getAllVisibleCells(row, table)
  const { right } =
    table_getState(table).columnPinning ?? getDefaultColumnPinningState()
  const cells = right
    .map((columnId) => allCells.find((cell) => cell.column.id === columnId)!)
    .filter(Boolean)
    .map(
      (d) => ({ ...d, position: 'right' }) as Cell<TFeatures, TData, unknown>,
    )

  return cells
}

export function table_setColumnPinning<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & { options: TableOptions_ColumnPinning },
  updater: Updater<ColumnPinningState>,
) {
  table.options.onColumnPinningChange?.(updater)
}

export function table_resetColumnPinning<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & { options: TableOptions_ColumnPinning },
  defaultState?: boolean,
) {
  table_setColumnPinning(
    table,
    defaultState
      ? getDefaultColumnPinningState()
      : table_getInitialState(table).columnPinning ??
          getDefaultColumnPinningState(),
  )
}

export function table_getIsSomeColumnsPinned<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, position?: ColumnPinningPosition) {
  const pinningState = table_getState(table).columnPinning

  if (!position) {
    return Boolean(pinningState?.left.length || pinningState?.right.length)
  }
  return Boolean(pinningState?.[position].length)
}

// header groups

export function table_getLeftHeaderGroups<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  const allColumns = table_getAllColumns(table)
  const leafColumns = table_getVisibleLeafColumns(table)
  const { left } =
    table_getState(table).columnPinning ?? getDefaultColumnPinningState()

  const orderedLeafColumns = left
    .map((columnId) => leafColumns.find((d) => d.id === columnId)!)
    .filter(Boolean)

  return buildHeaderGroups(allColumns, orderedLeafColumns, table, 'left')
}

export function table_getRightHeaderGroups<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  const allColumns = table_getAllColumns(table)
  const leafColumns = table_getVisibleLeafColumns(table)
  const { right } =
    table_getState(table).columnPinning ?? getDefaultColumnPinningState()

  const orderedLeafColumns = right
    .map((columnId) => leafColumns.find((d) => d.id === columnId)!)
    .filter(Boolean)

  return buildHeaderGroups(allColumns, orderedLeafColumns, table, 'right')
}

export function table_getCenterHeaderGroups<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  const allColumns = table_getAllColumns(table)
  let leafColumns = table_getVisibleLeafColumns(table)
  const { left, right } =
    table_getState(table).columnPinning ?? getDefaultColumnPinningState()
  const leftAndRight: Array<string> = [...left, ...right]

  leafColumns = leafColumns.filter(
    (column) => !leftAndRight.includes(column.id),
  )
  return buildHeaderGroups(allColumns, leafColumns, table, 'center')
}

// footer groups

export function table_getLeftFooterGroups<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  const headerGroups = table_getLeftHeaderGroups(table)
  return [...headerGroups].reverse()
}

export function table_getRightFooterGroups<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  const headerGroups = table_getRightHeaderGroups(table)
  return [...headerGroups].reverse()
}

export function table_getCenterFooterGroups<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  const headerGroups = table_getCenterHeaderGroups(table)
  return [...headerGroups].reverse()
}

// flat headers

export function table_getLeftFlatHeaders<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  const leftHeaderGroups = table_getLeftHeaderGroups(table)
  return leftHeaderGroups
    .map((headerGroup) => {
      return headerGroup.headers
    })
    .flat()
}

export function table_getRightFlatHeaders<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  const rightHeaderGroups = table_getRightHeaderGroups(table)
  return rightHeaderGroups
    .map((headerGroup) => {
      return headerGroup.headers
    })
    .flat()
}

export function table_getCenterFlatHeaders<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  const centerHeaderGroups = table_getCenterHeaderGroups(table)
  return centerHeaderGroups
    .map((headerGroup) => {
      return headerGroup.headers
    })
    .flat()
}

// leaf headers

export function table_getLeftLeafHeaders<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  return table_getLeftFlatHeaders(table).filter(
    (header) => !header.subHeaders.length,
  )
}

export function table_getRightLeafHeaders<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  return table_getRightFlatHeaders(table).filter(
    (header) => !header.subHeaders.length,
  )
}

export function table_getCenterLeafHeaders<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  return table_getCenterFlatHeaders(table).filter(
    (header) => !header.subHeaders.length,
  )
}

// leaf columns

export function table_getLeftLeafColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  const { left } =
    table_getState(table).columnPinning ?? getDefaultColumnPinningState()
  return left
    .map(
      (columnId) =>
        table_getAllColumns(table).find((column) => column.id === columnId)!,
    )
    .filter(Boolean)
}

export function table_getRightLeafColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  const { right } =
    table_getState(table).columnPinning ?? getDefaultColumnPinningState()
  return right
    .map(
      (columnId) =>
        table_getAllColumns(table).find((column) => column.id === columnId)!,
    )
    .filter(Boolean)
}

export function table_getCenterLeafColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  const { left, right } =
    table_getState(table).columnPinning ?? getDefaultColumnPinningState()
  const leftAndRight: Array<string> = [...left, ...right]
  return table_getAllColumns(table).filter((d) => !leftAndRight.includes(d.id))
}

// visible leaf columns

export function table_getLeftVisibleLeafColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  return table_getLeftLeafColumns(table).filter((column) =>
    column_getIsVisible(column, table),
  )
}

export function table_getRightVisibleLeafColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  return table_getRightLeafColumns(table).filter((column) =>
    column_getIsVisible(column, table),
  )
}

export function table_getCenterVisibleLeafColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>) {
  return table_getCenterLeafColumns(table).filter((column) =>
    column_getIsVisible(column, table),
  )
}
