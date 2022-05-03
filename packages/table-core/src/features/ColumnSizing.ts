import {
  Column,
  Header,
  OnChangeFn,
  TableGenerics,
  TableInstance,
  Updater,
  TableFeature,
} from '../types'
import { makeStateUpdater } from '../utils'
import { ColumnPinningPosition } from './Pinning'

//

export type ColumnSizingTableState = {
  columnSizing: ColumnSizingState
  columnSizingInfo: ColumnSizingInfoState
}

export type ColumnSizingState = Record<string, number>

export type ColumnSizingInfoState = {
  startOffset: null | number
  startSize: null | number
  deltaOffset: null | number
  deltaPercentage: null | number
  isResizingColumn: false | string
  columnSizingStart: [string, number][]
}

export type ColumnResizeMode = 'onChange' | 'onEnd'

export type ColumnSizingOptions = {
  enableColumnResizing?: boolean
  columnResizeMode?: ColumnResizeMode
  onColumnSizingChange?: OnChangeFn<ColumnSizingState>
  onColumnSizingInfoChange?: OnChangeFn<ColumnSizingInfoState>
}

export type ColumnSizingDefaultOptions = {
  columnResizeMode: ColumnResizeMode
  onColumnSizingChange: OnChangeFn<ColumnSizingState>
  onColumnSizingInfoChange: OnChangeFn<ColumnSizingInfoState>
}

export type ColumnSizingInstance<TGenerics extends TableGenerics> = {
  getColumnSize: (columnId: string) => number
  getColumnStart: (columnId: string, position?: ColumnPinningPosition) => number
  setColumnSizing: (updater: Updater<ColumnSizingState>) => void
  setColumnSizingInfo: (updater: Updater<ColumnSizingInfoState>) => void
  resetColumnSizing: () => void
  resetColumnSize: (columnId: string) => void
  resetHeaderSize: (headerId: string) => void
  resetHeaderSizeInfo: () => void
  getColumnCanResize: (columnId: string) => boolean
  getHeaderCanResize: (headerId: string) => boolean
  getResizeHandler: (headerId: string) => (event: unknown) => void
  getColumnIsResizing: (columnId: string) => boolean
  getHeaderIsResizing: (headerId: string) => boolean
  getTotalSize: () => number
  getLeftTotalSize: () => number
  getCenterTotalSize: () => number
  getRightTotalSize: () => number
}

export type ColumnSizingColumnDef = {
  enableResizing?: boolean
  defaultCanResize?: boolean
  size?: number
  minSize?: number
  maxSize?: number
}

export type ColumnSizingColumn<TGenerics extends TableGenerics> = {
  getSize: () => number
  getStart: (position?: ColumnPinningPosition) => number
  getCanResize: () => boolean
  getIsResizing: () => boolean
  resetSize: () => void
}

export type ColumnSizingHeader<TGenerics extends TableGenerics> = {
  getCanResize: () => boolean
  getIsResizing: () => boolean
  getResizeHandler: () => (event: unknown) => void
  resetSize: () => void
}

//

export const defaultColumnSizing = {
  size: 150,
  minSize: 20,
  maxSize: Number.MAX_SAFE_INTEGER,
}

export const ColumnSizing: TableFeature = {
  getDefaultColumn: (): ColumnSizingColumnDef => {
    return defaultColumnSizing
  },
  getInitialState: (): ColumnSizingTableState => {
    return {
      columnSizing: {},
      columnSizingInfo: {
        startOffset: null,
        startSize: null,
        deltaOffset: null,
        deltaPercentage: null,
        isResizingColumn: false,
        columnSizingStart: [],
      },
    }
  },

  getDefaultOptions: <TGenerics extends TableGenerics>(
    instance: TableInstance<TGenerics>
  ): ColumnSizingDefaultOptions => {
    return {
      columnResizeMode: 'onEnd',
      onColumnSizingChange: makeStateUpdater('columnSizing', instance),
      onColumnSizingInfoChange: makeStateUpdater('columnSizingInfo', instance),
    }
  },

  createColumn: <TGenerics extends TableGenerics>(
    column: Column<TGenerics>,
    instance: TableInstance<TGenerics>
  ): ColumnSizingColumn<TGenerics> => {
    return {
      getSize: () => instance.getColumnSize(column.id),
      getStart: position => instance.getColumnStart(column.id, position),
      getIsResizing: () => instance.getColumnIsResizing(column.id),
      getCanResize: () => instance.getColumnCanResize(column.id),
      resetSize: () => instance.resetColumnSize(column.id),
    }
  },

  createHeader: <TGenerics extends TableGenerics>(
    header: Header<TGenerics>,
    instance: TableInstance<TGenerics>
  ): ColumnSizingHeader<TGenerics> => {
    return {
      getIsResizing: () => instance.getColumnIsResizing(header.column.id),
      getCanResize: () => instance.getColumnCanResize(header.column.id),
      resetSize: () => instance.resetColumnSize(header.column.id),
      getResizeHandler: () => instance.getResizeHandler(header.id),
    }
  },

  createInstance: <TGenerics extends TableGenerics>(
    instance: TableInstance<TGenerics>
  ): ColumnSizingInstance<TGenerics> => {
    return {
      getColumnSize: (columnId: string) => {
        const column = instance.getColumn(columnId)

        if (!column) {
          throw new Error()
        }

        const columnSize = instance.getState().columnSizing[column.id]

        return Math.min(
          Math.max(
            column.minSize ?? defaultColumnSizing.minSize,
            columnSize ?? column.size ?? defaultColumnSizing.size
          ),
          column.maxSize ?? defaultColumnSizing.maxSize
        )
      },
      getColumnStart: (columnId, position) => {
        const column = instance.getColumn(columnId)

        if (!column) {
          throw new Error()
        }

        const columns = !position
          ? instance.getVisibleLeafColumns()
          : position === 'left'
          ? instance.getLeftVisibleLeafColumns()
          : instance.getRightVisibleLeafColumns()

        const index = columns.findIndex(d => d.id === columnId)

        if (index > 0) {
          const prevSiblingColumn = columns[index - 1]

          return (
            instance.getColumnStart(prevSiblingColumn.id, position) +
            prevSiblingColumn.getSize()
          )
        }

        return 0
      },
      setColumnSizing: updater =>
        instance.options.onColumnSizingChange?.(updater),
      setColumnSizingInfo: updater =>
        instance.options.onColumnSizingInfoChange?.(updater),
      resetColumnSizing: () => {
        instance.setColumnSizing(instance.initialState.columnSizing ?? {})
      },
      resetHeaderSizeInfo: () => {
        instance.setColumnSizingInfo(
          instance.initialState.columnSizingInfo ?? {}
        )
      },
      resetColumnSize: columnId => {
        instance.setColumnSizing(({ [columnId]: _, ...rest }) => {
          return rest
        })
      },
      resetHeaderSize: headerId => {
        const header = instance.getHeader(headerId)

        return instance.resetColumnSize(header.column.id)
      },
      getHeaderCanResize: headerId => {
        const header = instance.getHeader(headerId)

        if (!header) {
          throw new Error()
        }

        return instance.getColumnCanResize(header.column.id)
      },
      getColumnCanResize: columnId => {
        const column = instance.getColumn(columnId)

        if (!column) {
          throw new Error()
        }

        return (
          column.enableResizing ??
          instance.options.enableColumnResizing ??
          column.defaultCanResize ??
          true
        )
      },
      getColumnIsResizing: columnId => {
        const column = instance.getColumn(columnId)

        if (!column) {
          throw new Error()
        }

        return (
          instance.getState().columnSizingInfo.isResizingColumn === columnId
        )
      },
      getHeaderIsResizing: headerId => {
        const header = instance.getHeader(headerId)

        if (!header) {
          throw new Error()
        }

        return instance.getColumnIsResizing(header.column.id)
      },
      getResizeHandler: (headerId: string) => {
        const header = instance.getHeader(headerId)
        const column = instance.getColumn(header.column.id)
        const canResize = column.getCanResize()

        return (e: unknown) => {
          if (!canResize) {
            return
          }

          ;(e as any).persist?.()

          if (isTouchStartEvent(e)) {
            // lets not respond to multiple touches (e.g. 2 or 3 fingers)
            if (e.touches && e.touches.length > 1) {
              return
            }
          }

          const header = headerId ? instance.getHeader(headerId) : undefined

          const startSize = header ? header.getSize() : column.getSize()

          const columnSizingStart: [string, number][] = header
            ? header.getLeafHeaders().map(d => [d.column.id, d.getSize()])
            : [[column.id, column.getSize()]]

          const clientX = isTouchStartEvent(e)
            ? Math.round(e.touches[0].clientX)
            : (e as MouseEvent).clientX

          const updateOffset = (
            eventType: 'move' | 'end',
            clientXPos?: number
          ) => {
            if (typeof clientXPos !== 'number') {
              return
            }

            let newColumnSizing: ColumnSizingState = {}

            instance.setColumnSizingInfo(old => {
              const deltaOffset = clientXPos - (old?.startOffset ?? 0)
              const deltaPercentage = Math.max(
                deltaOffset / (old?.startSize ?? 0),
                -0.999999
              )

              old.columnSizingStart.forEach(([columnId, headerSize]) => {
                newColumnSizing[columnId] =
                  Math.round(
                    Math.max(headerSize + headerSize * deltaPercentage, 0) * 100
                  ) / 100
              })

              return {
                ...old,
                deltaOffset,
                deltaPercentage,
              }
            })

            if (
              instance.options.columnResizeMode === 'onChange' ||
              eventType === 'end'
            ) {
              instance.setColumnSizing(old => ({
                ...old,
                ...newColumnSizing,
              }))
            }
          }

          const onMove = (clientXPos?: number) =>
            updateOffset('move', clientXPos)

          const onEnd = (clientXPos?: number) => {
            updateOffset('end', clientXPos)

            instance.setColumnSizingInfo(old => ({
              ...old,
              isResizingColumn: false,
              startOffset: null,
              startSize: null,
              deltaOffset: null,
              deltaPercentage: null,
              columnSizingStart: [],
            }))
          }

          const mouseEvents = {
            moveHandler: (e: MouseEvent) => onMove(e.clientX),
            upHandler: (e: MouseEvent) => {
              document.removeEventListener('mousemove', mouseEvents.moveHandler)
              document.removeEventListener('mouseup', mouseEvents.upHandler)
              onEnd(e.clientX)
            },
          }

          const touchEvents = {
            moveHandler: (e: TouchEvent) => {
              if (e.cancelable) {
                e.preventDefault()
                e.stopPropagation()
              }
              onMove(e.touches[0].clientX)
              return false
            },
            upHandler: (e: TouchEvent) => {
              document.removeEventListener('touchmove', touchEvents.moveHandler)
              document.removeEventListener('touchend', touchEvents.upHandler)
              if (e.cancelable) {
                e.preventDefault()
                e.stopPropagation()
              }
              onEnd(e.touches[0].clientX)
            },
          }

          const passiveIfSupported = passiveEventSupported()
            ? { passive: false }
            : false

          if (isTouchStartEvent(e)) {
            document.addEventListener(
              'touchmove',
              touchEvents.moveHandler,
              passiveIfSupported
            )
            document.addEventListener(
              'touchend',
              touchEvents.upHandler,
              passiveIfSupported
            )
          } else {
            document.addEventListener(
              'mousemove',
              mouseEvents.moveHandler,
              passiveIfSupported
            )
            document.addEventListener(
              'mouseup',
              mouseEvents.upHandler,
              passiveIfSupported
            )
          }

          instance.setColumnSizingInfo(old => ({
            ...old,
            startOffset: clientX,
            startSize,
            deltaOffset: 0,
            deltaPercentage: 0,
            columnSizingStart,
            isResizingColumn: column.id,
          }))
        }
      },
      getTotalSize: () =>
        instance.getHeaderGroups()[0]?.headers.reduce((sum, header) => {
          return sum + header.getSize()
        }, 0) ?? 0,
      getLeftTotalSize: () =>
        instance.getLeftHeaderGroups()[0]?.headers.reduce((sum, header) => {
          return sum + header.getSize()
        }, 0) ?? 0,
      getCenterTotalSize: () =>
        instance.getCenterHeaderGroups()[0]?.headers.reduce((sum, header) => {
          return sum + header.getSize()
        }, 0) ?? 0,
      getRightTotalSize: () =>
        instance.getRightHeaderGroups()[0]?.headers.reduce((sum, header) => {
          return sum + header.getSize()
        }, 0) ?? 0,
    }
  },
}

let passiveSupported: boolean | null = null
export function passiveEventSupported() {
  if (typeof passiveSupported === 'boolean') return passiveSupported

  let supported = false
  try {
    const options = {
      get passive() {
        supported = true
        return false
      },
    }

    const noop = () => {}

    window.addEventListener('test', noop, options)
    window.removeEventListener('test', noop)
  } catch (err) {
    supported = false
  }
  passiveSupported = supported
  return passiveSupported
}

function isTouchStartEvent(e: unknown): e is TouchEvent {
  return (e as TouchEvent).type === 'touchstart'
}
