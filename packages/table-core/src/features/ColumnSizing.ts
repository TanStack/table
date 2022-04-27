import {
  Column,
  Getter,
  Header,
  OnChangeFn,
  AnyGenerics,
  PartialGenerics,
  PropGetterValue,
  TableInstance,
  Updater,
} from '../types'
import { functionalUpdate, makeStateUpdater, memo, propGetter } from '../utils'

//

export type ColumnSizing = Record<string, number>

export type ColumnSizingInfoState = {
  startOffset: null | number
  startSize: null | number
  deltaOffset: null | number
  deltaPercentage: null | number
  isResizingColumn: false | string
  columnSizingStart: [string, number][]
}

export type ColumnSizingTableState = {
  columnSizing: ColumnSizing
  columnSizingInfo: ColumnSizingInfoState
}

export type ColumnResizeMode = 'onChange' | 'onEnd'

export type ColumnSizingOptions = {
  enableColumnResizing?: boolean
  columnResizeMode?: ColumnResizeMode
  onColumnSizingChange?: OnChangeFn<ColumnSizing>
  onColumnSizingInfoChange?: OnChangeFn<ColumnSizingInfoState>
}

export type ColumnSizingDefaultOptions = {
  columnResizeMode: ColumnResizeMode
  onColumnSizingChange: OnChangeFn<ColumnSizing>
  onColumnSizingInfoChange: OnChangeFn<ColumnSizingInfoState>
}

export type ColumnResizerProps = {
  title?: string
  onMouseDown?: (e: MouseEvent) => void
  onTouchStart?: (e: TouchEvent) => void
  draggable?: boolean
  role?: string
}

export type ColumnSizingInstance<TGenerics extends AnyGenerics> = {
  getColumnWidth: (columnId: string) => number
  setColumnSizing: (updater: Updater<ColumnSizing>) => void
  setColumnSizingInfo: (updater: Updater<ColumnSizingInfoState>) => void
  resetColumnSizing: () => void
  resetColumnSize: (columnId: string) => void
  resetHeaderSize: (headerId: string) => void
  resetHeaderSizeInfo: () => void
  getColumnCanResize: (columnId: string) => boolean
  getHeaderCanResize: (headerId: string) => boolean
  getHeaderResizerProps: <TGetter extends Getter<ColumnResizerProps>>(
    headerId: string,
    userProps?: TGetter
  ) => undefined | PropGetterValue<ColumnResizerProps, TGetter>
  getColumnIsResizing: (columnId: string) => boolean
  getHeaderIsResizing: (headerId: string) => boolean
}

export type ColumnSizingColumnDef = {
  enableResizing?: boolean
  defaultCanResize?: boolean
  width?: number
  minWidth?: number
  maxWidth?: number
}

export type ColumnSizingColumn<TGenerics extends AnyGenerics> = {
  getCanResize: () => boolean
  getIsResizing: () => boolean
  resetSize: () => void
}

export type ColumnSizingHeader<TGenerics extends AnyGenerics> = {
  getCanResize: () => boolean
  getIsResizing: () => boolean
  getResizerProps: <TGetter extends Getter<ColumnResizerProps>>(
    userProps?: TGetter
  ) => undefined | PropGetterValue<ColumnResizerProps, TGetter>
  resetSize: () => void
}

//

export const defaultColumnSizing = {
  width: 150,
  minWidth: 20,
  maxWidth: Number.MAX_SAFE_INTEGER,
}

export const ColumnSizing = {
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

  getDefaultOptions: <TGenerics extends AnyGenerics>(
    instance: TableInstance<TGenerics>
  ): ColumnSizingDefaultOptions => {
    return {
      columnResizeMode: 'onEnd',
      onColumnSizingChange: makeStateUpdater('columnSizing', instance),
      onColumnSizingInfoChange: makeStateUpdater('columnSizingInfo', instance),
    }
  },

  getInstance: <TGenerics extends AnyGenerics>(
    instance: TableInstance<TGenerics>
  ): ColumnSizingInstance<TGenerics> => {
    return {
      getColumnWidth: (columnId: string) => {
        const column = instance.getColumn(columnId)

        if (!column) {
          throw new Error()
        }

        const columnSize = instance.getState().columnSizing[column.id]

        return Math.min(
          Math.max(
            column.minWidth ?? defaultColumnSizing.minWidth,
            columnSize ?? column.width ?? defaultColumnSizing.width
          ),
          column.maxWidth ?? defaultColumnSizing.maxWidth
        )
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

      getHeaderResizerProps: (headerId, userProps) => {
        const header = instance.getHeader(headerId)
        const column = instance.getColumn(header.column.id)

        const canResize = column.getCanResize()

        const onResizeStart = (e: unknown) => {
          if (isTouchStartEvent(e)) {
            // lets not respond to multiple touches (e.g. 2 or 3 fingers)
            if (e.touches && e.touches.length > 1) {
              return
            }
          }

          const header = headerId ? instance.getHeader(headerId) : undefined

          const startSize = header ? header.getWidth() : column.getWidth()

          const columnSizingStart: [string, number][] = header
            ? header.getLeafHeaders().map(d => [d.column.id, d.getWidth()])
            : [[column.id, column.getWidth()]]

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

            let newColumnSizing: ColumnSizing = {}

            instance.setColumnSizingInfo(old => {
              const deltaOffset = clientXPos - (old?.startOffset ?? 0)
              const deltaPercentage = Math.max(
                deltaOffset / (old?.startSize ?? 0),
                -0.999999
              )

              old.columnSizingStart.forEach(([columnId, headerWidth]) => {
                newColumnSizing[columnId] =
                  Math.round(
                    Math.max(headerWidth + headerWidth * deltaPercentage, 0) *
                      100
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

        const initialProps: ColumnResizerProps = canResize
          ? {
              title: 'Toggle Grouping',
              draggable: false,
              role: 'separator',
              onMouseDown: (e: MouseEvent) => {
                ;(e as any).persist?.()
                onResizeStart(e)
              },
              onTouchStart: (e: TouchEvent) => {
                ;(e as any).persist?.()
                onResizeStart(e)
              },
            }
          : {}

        return propGetter(initialProps, userProps)
      },
    }
  },

  createColumn: <TGenerics extends AnyGenerics>(
    column: Column<TGenerics>,
    instance: TableInstance<TGenerics>
  ): ColumnSizingColumn<TGenerics> => {
    return {
      getIsResizing: () => instance.getColumnIsResizing(column.id),
      getCanResize: () => instance.getColumnCanResize(column.id),
      resetSize: () => instance.resetColumnSize(column.id),
    }
  },

  createHeader: <TGenerics extends AnyGenerics>(
    header: Header<TGenerics>,
    instance: TableInstance<TGenerics>
  ): ColumnSizingHeader<TGenerics> => {
    return {
      getIsResizing: () => instance.getColumnIsResizing(header.column.id),
      getCanResize: () => instance.getColumnCanResize(header.column.id),
      resetSize: () => instance.resetColumnSize(header.column.id),
      getResizerProps: userProps =>
        instance.getHeaderResizerProps(header.id, userProps),
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
