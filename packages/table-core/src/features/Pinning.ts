import { TableFeature } from '../core/table'
import {
  OnChangeFn,
  Updater,
  Table,
  Column,
  TableGenerics,
  Row,
  Cell,
  RowData,
} from '../types'
import { makeStateUpdater, memo } from '../utils'

export type ColumnPinningPosition = false | 'left' | 'right'

export type ColumnPinningState = {
  left?: string[]
  right?: string[]
}

export type ColumnPinningTableState = {
  columnPinning: ColumnPinningState
}

export type ColumnPinningOptions = {
  onColumnPinningChange?: OnChangeFn<ColumnPinningState>
  enablePinning?: boolean
}

export type ColumnPinningDefaultOptions = {
  onColumnPinningChange: OnChangeFn<ColumnPinningState>
}

export type ColumnPinningColumnDef = {
  enablePinning?: boolean
}

export type ColumnPinningColumn = {
  getCanPin: () => boolean
  getPinnedIndex: () => number
  getIsPinned: () => ColumnPinningPosition
  pin: (position: ColumnPinningPosition) => void
}

export type ColumnPinningRow<TData extends RowData> = {
  getLeftVisibleCells: () => Cell<TData>[]
  getCenterVisibleCells: () => Cell<TData>[]
  getRightVisibleCells: () => Cell<TData>[]
}

export type ColumnPinningInstance<TData extends RowData> = {
  setColumnPinning: (updater: Updater<ColumnPinningState>) => void
  resetColumnPinning: (defaultState?: boolean) => void
  getIsSomeColumnsPinned: (position?: ColumnPinningPosition) => boolean
  getLeftLeafColumns: () => Column<TData>[]
  getRightLeafColumns: () => Column<TData>[]
  getCenterLeafColumns: () => Column<TData>[]
}

//

const getDefaultPinningState = (): ColumnPinningState => ({
  left: [],
  right: [],
})

export const Pinning: TableFeature = {
  getInitialState: (state): ColumnPinningTableState => {
    return {
      columnPinning: getDefaultPinningState(),
      ...state,
    }
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): ColumnPinningDefaultOptions => {
    return {
      onColumnPinningChange: makeStateUpdater('columnPinning', table),
    }
  },

  createColumn: <TData extends RowData>(
    column: Column<TData>,
    table: Table<TData>
  ): ColumnPinningColumn => {
    return {
      pin: position => {
        const columnIds = column
          .getLeafColumns()
          .map(d => d.id)
          .filter(Boolean) as string[]

        table.setColumnPinning(old => {
          if (position === 'right') {
            return {
              left: (old?.left ?? []).filter(d => !columnIds?.includes(d)),
              right: [
                ...(old?.right ?? []).filter(d => !columnIds?.includes(d)),
                ...columnIds,
              ],
            }
          }

          if (position === 'left') {
            return {
              left: [
                ...(old?.left ?? []).filter(d => !columnIds?.includes(d)),
                ...columnIds,
              ],
              right: (old?.right ?? []).filter(d => !columnIds?.includes(d)),
            }
          }

          return {
            left: (old?.left ?? []).filter(d => !columnIds?.includes(d)),
            right: (old?.right ?? []).filter(d => !columnIds?.includes(d)),
          }
        })
      },

      getCanPin: () => {
        const leafColumns = column.getLeafColumns()

        return leafColumns.some(
          d =>
            (d.columnDef.enablePinning ?? true) &&
            (table.options.enablePinning ?? true)
        )
      },

      getIsPinned: () => {
        const leafColumnIds = column.getLeafColumns().map(d => d.id)

        const { left, right } = table.getState().columnPinning

        const isLeft = leafColumnIds.some(d => left?.includes(d))
        const isRight = leafColumnIds.some(d => right?.includes(d))

        return isLeft ? 'left' : isRight ? 'right' : false
      },

      getPinnedIndex: () => {
        const position = column.getIsPinned()

        return position
          ? table.getState().columnPinning?.[position]?.indexOf(column.id) ?? -1
          : 0
      },
    }
  },

  createRow: <TData extends RowData>(
    row: Row<TData>,
    table: Table<TData>
  ): ColumnPinningRow<TData> => {
    return {
      getCenterVisibleCells: memo(
        () => [
          row._getAllVisibleCells(),
          table.getState().columnPinning.left,
          table.getState().columnPinning.right,
        ],
        (allCells, left, right) => {
          const leftAndRight: string[] = [...(left ?? []), ...(right ?? [])]

          return allCells.filter(d => !leftAndRight.includes(d.column.id))
        },
        {
          key:
            process.env.NODE_ENV === 'production' &&
            'row.getCenterVisibleCells',
          debug: () => table.options.debugAll ?? table.options.debugRows,
        }
      ),
      getLeftVisibleCells: memo(
        () => [
          row._getAllVisibleCells(),
          table.getState().columnPinning.left,
          ,
        ],
        (allCells, left) => {
          const cells = (left ?? [])
            .map(
              columnId => allCells.find(cell => cell.column.id === columnId)!
            )
            .filter(Boolean)
            .map(d => ({ ...d, position: 'left' } as Cell<TData>))

          return cells
        },
        {
          key:
            process.env.NODE_ENV === 'production' && 'row.getLeftVisibleCells',
          debug: () => table.options.debugAll ?? table.options.debugRows,
        }
      ),
      getRightVisibleCells: memo(
        () => [row._getAllVisibleCells(), table.getState().columnPinning.right],
        (allCells, right) => {
          const cells = (right ?? [])
            .map(
              columnId => allCells.find(cell => cell.column.id === columnId)!
            )
            .filter(Boolean)
            .map(d => ({ ...d, position: 'left' } as Cell<TData>))

          return cells
        },
        {
          key:
            process.env.NODE_ENV === 'production' && 'row.getRightVisibleCells',
          debug: () => table.options.debugAll ?? table.options.debugRows,
        }
      ),
    }
  },

  createTable: <TData extends RowData>(
    table: Table<TData>
  ): ColumnPinningInstance<TData> => {
    return {
      setColumnPinning: updater =>
        table.options.onColumnPinningChange?.(updater),

      resetColumnPinning: defaultState =>
        table.setColumnPinning(
          defaultState
            ? getDefaultPinningState()
            : table.initialState?.columnPinning ?? getDefaultPinningState()
        ),

      getIsSomeColumnsPinned: position => {
        const pinningState = table.getState().columnPinning

        if (!position) {
          return Boolean(
            pinningState.left?.length || pinningState.right?.length
          )
        }
        return Boolean(pinningState[position]?.length)
      },

      getLeftLeafColumns: memo(
        () => [table.getAllLeafColumns(), table.getState().columnPinning.left],
        (allColumns, left) => {
          return (left ?? [])
            .map(columnId => allColumns.find(column => column.id === columnId)!)
            .filter(Boolean)
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getLeftLeafColumns',
          debug: () => table.options.debugAll ?? table.options.debugColumns,
        }
      ),

      getRightLeafColumns: memo(
        () => [table.getAllLeafColumns(), table.getState().columnPinning.right],
        (allColumns, right) => {
          return (right ?? [])
            .map(columnId => allColumns.find(column => column.id === columnId)!)
            .filter(Boolean)
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getRightLeafColumns',
          debug: () => table.options.debugAll ?? table.options.debugColumns,
        }
      ),

      getCenterLeafColumns: memo(
        () => [
          table.getAllLeafColumns(),
          table.getState().columnPinning.left,
          table.getState().columnPinning.right,
        ],
        (allColumns, left, right) => {
          const leftAndRight: string[] = [...(left ?? []), ...(right ?? [])]

          return allColumns.filter(d => !leftAndRight.includes(d.id))
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getCenterLeafColumns',
          debug: () => table.options.debugAll ?? table.options.debugColumns,
        }
      ),
    }
  },
}
