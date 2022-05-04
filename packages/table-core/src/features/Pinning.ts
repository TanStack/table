import {
  OnChangeFn,
  Updater,
  TableInstance,
  Column,
  TableGenerics,
  Row,
  Cell,
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

export type ColumnPinningRow<TGenerics extends TableGenerics> = {
  getLeftVisibleCells: () => Cell<TGenerics>[]
  getCenterVisibleCells: () => Cell<TGenerics>[]
  getRightVisibleCells: () => Cell<TGenerics>[]
}

export type ColumnPinningInstance<TGenerics extends TableGenerics> = {
  setColumnPinning: (updater: Updater<ColumnPinningState>) => void
  resetColumnPinning: () => void
  pinColumn: (columnId: string, position: ColumnPinningPosition) => void
  getColumnCanPin: (columnId: string) => boolean
  getColumnIsPinned: (columnId: string) => ColumnPinningPosition
  getColumnPinnedIndex: (columnId: string) => number
  getIsSomeColumnsPinned: () => boolean
  getLeftLeafColumns: () => Column<TGenerics>[]
  getRightLeafColumns: () => Column<TGenerics>[]
  getCenterLeafColumns: () => Column<TGenerics>[]
}

//

export const Pinning = {
  getInitialState: (): ColumnPinningTableState => {
    return {
      columnPinning: {
        left: [],
        right: [],
      },
    }
  },

  getDefaultOptions: <TGenerics extends TableGenerics>(
    instance: TableInstance<TGenerics>
  ): ColumnPinningDefaultOptions => {
    return {
      onColumnPinningChange: makeStateUpdater('columnPinning', instance),
    }
  },

  createColumn: <TGenerics extends TableGenerics>(
    column: Column<TGenerics>,
    instance: TableInstance<TGenerics>
  ): ColumnPinningColumn => {
    return {
      getCanPin: () => instance.getColumnCanPin(column.id),
      getPinnedIndex: () => instance.getColumnPinnedIndex(column.id),
      getIsPinned: () => instance.getColumnIsPinned(column.id),
      pin: position => instance.pinColumn(column.id, position),
    }
  },

  createRow: <TGenerics extends TableGenerics>(
    row: Row<TGenerics>,
    instance: TableInstance<TGenerics>
  ): ColumnPinningRow<TGenerics> => {
    return {
      getCenterVisibleCells: memo(
        () => [
          row._getAllVisibleCells(),
          instance.getState().columnPinning.left,
          instance.getState().columnPinning.right,
        ],
        (allCells, left, right) => {
          const leftAndRight: string[] = [...(left ?? []), ...(right ?? [])]

          return allCells.filter(d => !leftAndRight.includes(d.columnId))
        },
        {
          key: 'row.getCenterVisibleCells',
          debug: () => instance.options.debugAll ?? instance.options.debugRows,
        }
      ),
      getLeftVisibleCells: memo(
        () => [
          row._getAllVisibleCells(),
          instance.getState().columnPinning.left,
          ,
        ],
        (allCells, left) => {
          const cells = (left ?? [])
            .map(columnId => allCells.find(cell => cell.columnId === columnId)!)
            .filter(Boolean)
            .map(d => ({ ...d, position: 'left' } as Cell<TGenerics>))

          return cells
        },
        {
          key: 'row.getLeftVisibleCells',
          debug: () => instance.options.debugAll ?? instance.options.debugRows,
        }
      ),
      getRightVisibleCells: memo(
        () => [
          row._getAllVisibleCells(),
          instance.getState().columnPinning.right,
        ],
        (allCells, right) => {
          const cells = (right ?? [])
            .map(columnId => allCells.find(cell => cell.columnId === columnId)!)
            .filter(Boolean)
            .map(d => ({ ...d, position: 'left' } as Cell<TGenerics>))

          return cells
        },
        {
          key: 'row.getRightVisibleCells',
          debug: () => instance.options.debugAll ?? instance.options.debugRows,
        }
      ),
    }
  },

  createInstance: <TGenerics extends TableGenerics>(
    instance: TableInstance<TGenerics>
  ): ColumnPinningInstance<TGenerics> => {
    return {
      setColumnPinning: updater =>
        instance.options.onColumnPinningChange?.(updater),

      resetColumnPinning: () =>
        instance.setColumnPinning(instance.initialState?.columnPinning ?? {}),

      pinColumn: (columnId, position) => {
        const column = instance.getColumn(columnId)

        const columnIds = column
          ?.getLeafColumns()
          .map(d => d.id)
          .filter(Boolean) as string[]

        instance.setColumnPinning(old => {
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

      getColumnCanPin: columnId => {
        const column = instance.getColumn(columnId)

        if (!column) {
          throw new Error()
        }

        const leafColumns = column.getLeafColumns()

        return leafColumns.some(
          d =>
            (d.enablePinning ?? true) &&
            (instance.options.enablePinning ?? true)
        )
      },

      getColumnIsPinned: columnId => {
        const column = instance.getColumn(columnId)

        if (!column) {
          throw new Error()
        }

        const leafColumnIds = column.getLeafColumns().map(d => d.id)

        const { left, right } = instance.getState().columnPinning

        const isLeft = leafColumnIds.some(d => left?.includes(d))
        const isRight = leafColumnIds.some(d => right?.includes(d))

        return isLeft ? 'left' : isRight ? 'right' : false
      },

      getColumnPinnedIndex: columnId => {
        const position = instance.getColumnIsPinned(columnId)

        return position
          ? instance.getState().columnPinning?.[position]?.indexOf(columnId) ??
              -1
          : 0
      },

      getIsSomeColumnsPinned: () => {
        const { left, right } = instance.getState().columnPinning

        return Boolean(left?.length || right?.length)
      },

      getLeftLeafColumns: memo(
        () => [
          instance.getAllLeafColumns(),
          instance.getState().columnPinning.left,
        ],
        (allColumns, left) => {
          return (left ?? [])
            .map(columnId => allColumns.find(column => column.id === columnId)!)
            .filter(Boolean)
        },
        {
          key: 'getLeftLeafColumns',
          debug: () =>
            instance.options.debugAll ?? instance.options.debugColumns,
        }
      ),

      getRightLeafColumns: memo(
        () => [
          instance.getAllLeafColumns(),
          instance.getState().columnPinning.right,
        ],
        (allColumns, right) => {
          return (right ?? [])
            .map(columnId => allColumns.find(column => column.id === columnId)!)
            .filter(Boolean)
        },
        {
          key: 'getRightLeafColumns',
          debug: () =>
            instance.options.debugAll ?? instance.options.debugColumns,
        }
      ),

      getCenterLeafColumns: memo(
        () => [
          instance.getAllLeafColumns(),
          instance.getState().columnPinning.left,
          instance.getState().columnPinning.right,
        ],
        (allColumns, left, right) => {
          const leftAndRight: string[] = [...(left ?? []), ...(right ?? [])]

          return allColumns.filter(d => !leftAndRight.includes(d.id))
        },
        {
          key: 'getCenterLeafColumns',
          debug: () =>
            instance.options.debugAll ?? instance.options.debugColumns,
        }
      ),
    }
  },
}
