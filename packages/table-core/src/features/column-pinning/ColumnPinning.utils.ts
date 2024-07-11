import type {
  Cell,
  CellData,
  Column,
  RowData,
  Table,
  TableFeatures,
  Updater,
} from '../../types'
import type {
  ColumnPinningPosition,
  ColumnPinningState,
} from './ColumnPinning.types'

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

export function column_getCanPin<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column<TFeatures, TData, TValue>, table: Table<TFeatures, TData>) {
  const leafColumns = column.getLeafColumns()

  return leafColumns.some(
    (d) =>
      (d.columnDef.enablePinning ?? true) &&
      (table.options.enableColumnPinning ??
        table.options.enablePinning ??
        true),
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

  const { left, right } = table.getState().columnPinning

  const isLeft = leafColumnIds.some((d) => left?.includes(d))
  const isRight = leafColumnIds.some((d) => right?.includes(d))

  return isLeft ? 'left' : isRight ? 'right' : false
}

export function column_getPinnedIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column<TFeatures, TData, TValue>, table: Table<TFeatures, TData>) {
  const position = column_getIsPinned(column, table)

  return position
    ? table.getState().columnPinning[position]?.indexOf(column.id) ?? -1
    : 0
}

export function row_getCenterVisibleCells<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  allCells: Array<Cell<TFeatures, TData, unknown>>,
  left?: Array<string>,
  right?: Array<string>,
) {
  const leftAndRight: Array<string> = [...(left ?? []), ...(right ?? [])]
  return allCells.filter((d) => !leftAndRight.includes(d.column.id))
}

export function row_getLeftVisibleCells<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(allCells: Array<Cell<TFeatures, TData, unknown>>, left?: Array<string>) {
  const cells = (left ?? [])
    .map((columnId) => allCells.find((cell) => cell.column.id === columnId)!)
    .filter(Boolean)
    .map((d) => ({ ...d, position: 'left' }) as Cell<TFeatures, TData, unknown>)

  return cells
}

export function row_getRightVisibleCells<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(allCells: Array<Cell<TFeatures, TData, unknown>>, right?: Array<string>) {
  const cells = (right ?? [])
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
>(table: Table<TFeatures, TData>, updater: Updater<ColumnPinningState>) {
  table.options.onColumnPinningChange?.(updater)
}

export function table_resetColumnPinning<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, defaultState?: boolean) {
  table_setColumnPinning(
    table,
    defaultState
      ? getDefaultColumnPinningState()
      : table.initialState.columnPinning ?? getDefaultColumnPinningState(),
  )
}

export function table_getIsSomeColumnsPinned<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table<TFeatures, TData>, position?: ColumnPinningPosition) {
  const pinningState = table.getState().columnPinning

  if (!position) {
    return Boolean(pinningState.left?.length || pinningState.right?.length)
  }
  return Boolean(pinningState[position]?.length)
}

export function table_getLeftLeafColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(allColumns: Array<Column<TFeatures, TData, unknown>>, left?: Array<string>) {
  return (left ?? [])
    .map((columnId) => allColumns.find((column) => column.id === columnId)!)
    .filter(Boolean)
}

export function table_getRightLeafColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(allColumns: Array<Column<TFeatures, TData, unknown>>, right?: Array<string>) {
  return (right ?? [])
    .map((columnId) => allColumns.find((column) => column.id === columnId)!)
    .filter(Boolean)
}

export function table_getCenterLeafColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  allColumns: Array<Column<TFeatures, TData, unknown>>,
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
