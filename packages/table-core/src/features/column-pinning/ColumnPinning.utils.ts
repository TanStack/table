import type { Cell, Column, RowData, Table, Updater } from '../../types'
import type {
  ColumnPinningPosition,
  ColumnPinningState,
} from './ColumnPinning.types'

export function column_pin<TData extends RowData, TValue>(
  column: Column<TData, TValue>,
  table: Table<TData>,
  position: ColumnPinningPosition,
) {
  const columnIds = column
    .getLeafColumns()
    .map((d) => d.id)
    .filter(Boolean)

  table_setColumnPinning(table, (old) => {
    if (position === 'right') {
      return {
        left: (old.left ?? []).filter((d) => !columnIds.includes(d)),
        right: [
          ...(old.right ?? []).filter((d) => !columnIds.includes(d)),
          ...columnIds,
        ],
      }
    }

    if (position === 'left') {
      return {
        left: [
          ...(old.left ?? []).filter((d) => !columnIds.includes(d)),
          ...columnIds,
        ],
        right: (old.right ?? []).filter((d) => !columnIds.includes(d)),
      }
    }

    return {
      left: (old.left ?? []).filter((d) => !columnIds.includes(d)),
      right: (old.right ?? []).filter((d) => !columnIds.includes(d)),
    }
  })
}

export function column_getCanPin<TData extends RowData, TValue>(
  column: Column<TData, TValue>,
  table: Table<TData>,
) {
  const leafColumns = column.getLeafColumns()

  return leafColumns.some(
    (d) =>
      (d.columnDef.enablePinning ?? true) &&
      (table.options.enableColumnPinning ??
        table.options.enablePinning ??
        true),
  )
}

export function column_getIsPinned<TData extends RowData, TValue>(
  column: Column<TData, TValue>,
  table: Table<TData>,
) {
  column.getIsPinned = () => {
    const leafColumnIds = column.getLeafColumns().map((d) => d.id)

    const { left, right } = table.getState().columnPinning

    const isLeft = leafColumnIds.some((d) => left?.includes(d))
    const isRight = leafColumnIds.some((d) => right?.includes(d))

    return isLeft ? 'left' : isRight ? 'right' : false
  }
}

export function column_getPinnedIndex<TData extends RowData, TValue>(
  column: Column<TData, TValue>,
  table: Table<TData>,
) {
  const position = column.getIsPinned()

  return position
    ? table.getState().columnPinning[position]?.indexOf(column.id) ?? -1
    : 0
}

export function row_getCenterVisibleCells<TData extends RowData>(
  allCells: Array<Cell<TData, unknown>>,
  left?: Array<string>,
  right?: Array<string>,
) {
  const leftAndRight: Array<string> = [...(left ?? []), ...(right ?? [])]
  return allCells.filter((d) => !leftAndRight.includes(d.column.id))
}

export function row_getLeftVisibleCells<TData extends RowData>(
  allCells: Array<Cell<TData, unknown>>,
  left?: Array<string>,
) {
  const cells = (left ?? [])
    .map((columnId) => allCells.find((cell) => cell.column.id === columnId)!)
    .filter(Boolean)
    .map((d) => ({ ...d, position: 'left' }) as Cell<TData, unknown>)

  return cells
}

export function row_getRightVisibleCells<TData extends RowData>(
  allCells: Array<Cell<TData, unknown>>,
  right?: Array<string>,
) {
  const cells = (right ?? [])
    .map((columnId) => allCells.find((cell) => cell.column.id === columnId)!)
    .filter(Boolean)
    .map((d) => ({ ...d, position: 'right' }) as Cell<TData, unknown>)

  return cells
}

export function table_setColumnPinning<TData extends RowData>(
  table: Table<TData>,
  updater: Updater<ColumnPinningState>,
) {
  table.options.onColumnPinningChange?.(updater)
}

export function table_resetColumnPinning<TData extends RowData>(
  table: Table<TData>,
  defaultState?: boolean,
) {
  table_setColumnPinning(
    table,
    defaultState
      ? getDefaultColumnPinningState()
      : table.initialState.columnPinning,
  )
}

export function table_getIsSomeColumnsPinned<TData extends RowData>(
  table: Table<TData>,
  position?: ColumnPinningPosition,
) {
  const pinningState = table.getState().columnPinning

  if (!position) {
    return Boolean(pinningState.left?.length || pinningState.right?.length)
  }
  return Boolean(pinningState[position]?.length)
}

export function table_getLeftLeafColumns<TData extends RowData>(
  allColumns: Array<Column<TData, unknown>>,
  left?: Array<string>,
) {
  return (left ?? [])
    .map((columnId) => allColumns.find((column) => column.id === columnId)!)
    .filter(Boolean)
}

export function table_getRightLeafColumns<TData extends RowData>(
  allColumns: Array<Column<TData, unknown>>,
  right?: Array<string>,
) {
  return (right ?? [])
    .map((columnId) => allColumns.find((column) => column.id === columnId)!)
    .filter(Boolean)
}

export function table_getCenterLeafColumns<TData extends RowData>(
  allColumns: Array<Column<TData, unknown>>,
  left?: Array<string>,
  right?: Array<string>,
) {
  const leftAndRight: Array<string> = [...(left ?? []), ...(right ?? [])]
  return allColumns.filter((d) => !leftAndRight.includes(d.id))
}

export function getDefaultColumnPinningState(): ColumnPinningState {
  return structuredClone({
    left: [],
    right: [],
  })
}
