import {
  OnChangeFn,
  Updater,
  TableInstance,
  Column,
  AnyGenerics,
  PartialGenerics,
} from '../types'
import { functionalUpdate, makeStateUpdater } from '../utils'

type ColumnPinningPosition = false | 'left' | 'right'

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
  defaultCanPin?: boolean
}

export type ColumnPinningColumn = {
  getCanPin: () => boolean
  getPinnedIndex: () => number
  getIsPinned: () => ColumnPinningPosition
  pin: (position: ColumnPinningPosition) => void
}

export type ColumnPinningInstance<TGenerics extends AnyGenerics> = {
  setColumnPinning: (updater: Updater<ColumnPinningState>) => void
  resetColumnPinning: () => void
  pinColumn: (columnId: string, position: ColumnPinningPosition) => void
  getColumnCanPin: (columnId: string) => boolean
  getColumnIsPinned: (columnId: string) => ColumnPinningPosition
  getColumnPinnedIndex: (columnId: string) => number
  getIsSomeColumnsPinned: () => boolean
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

  getDefaultOptions: <TGenerics extends AnyGenerics>(
    instance: TableInstance<TGenerics>
  ): ColumnPinningDefaultOptions => {
    return {
      onColumnPinningChange: makeStateUpdater('columnPinning', instance),
    }
  },

  createColumn: <TGenerics extends AnyGenerics>(
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

  getInstance: <TGenerics extends AnyGenerics>(
    instance: TableInstance<TGenerics>
  ): ColumnPinningInstance<TGenerics> => {
    return {
      setColumnPinning: updater =>
        instance.options.onColumnPinningChange?.(
          updater,
          functionalUpdate(updater, instance.getState().columnPinning)
        ),

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
            d.enablePinning ??
            instance.options.enablePinning ??
            d.defaultCanPin ??
            !!d.accessorFn
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
    }
  },
}
