import { TableFeature } from '../core/table'
import { RowData, Column, Header, OnChangeFn, Table, Updater } from '../types'
import { makeStateUpdater } from '../utils'
import { ColumnPinningPosition } from './Pinning'

//

export interface ColumnSizingTableState {
  columnSizing: ColumnSizingState
  columnSizingInfo: ColumnSizingInfoState
}

export type ColumnSizingState = Record<string, number>

export interface ColumnSizingInfoState {
  startOffset: null | number
  startSize: null | number
  deltaOffset: null | number
  deltaPercentage: null | number
  isResizingColumn: false | string
  columnSizingStart: [string, number][]
}

export type ColumnResizeMode = 'onChange' | 'onEnd'

export interface ColumnSizingOptions {
  enableColumnResizing?: boolean
  columnResizeMode?: ColumnResizeMode
  onColumnSizingChange?: OnChangeFn<ColumnSizingState>
  onColumnSizingInfoChange?: OnChangeFn<ColumnSizingInfoState>
}

export interface ColumnSizingDefaultOptions {
  columnResizeMode: ColumnResizeMode
  onColumnSizingChange: OnChangeFn<ColumnSizingState>
  onColumnSizingInfoChange: OnChangeFn<ColumnSizingInfoState>
}

export interface ColumnSizingInstance {
  setColumnSizing: (updater: Updater<ColumnSizingState>) => void
  setColumnSizingInfo: (updater: Updater<ColumnSizingInfoState>) => void
  resetColumnSizing: (defaultState?: boolean) => void
  resetHeaderSizeInfo: (defaultState?: boolean) => void
  getTotalSize: () => number
  getLeftTotalSize: () => number
  getCenterTotalSize: () => number
  getRightTotalSize: () => number
}

export interface ColumnSizingColumnDef {
  enableResizing?: boolean
  size?: number
  minSize?: number
  maxSize?: number
}

export interface ColumnSizingColumn {
  getSize: () => number
  getStart: (position?: ColumnPinningPosition) => number
  getCanResize: () => boolean
  getIsResizing: () => boolean
  resetSize: () => void
}

export interface ColumnSizingHeader {
  getSize: () => number
  getStart: (position?: ColumnPinningPosition) => number
  getResizeHandler: () => (event: unknown) => void
}

//

export const defaultColumnSizing = {
  size: 150,
  minSize: 20,
  maxSize: Number.MAX_SAFE_INTEGER,
}

const getDefaultColumnSizingInfoState = (): ColumnSizingInfoState => ({
  startOffset: null,
  startSize: null,
  deltaOffset: null,
  deltaPercentage: null,
  isResizingColumn: false,
  columnSizingStart: [],
})

export const ColumnSizing: TableFeature = {
  getDefaultColumnDef: (): ColumnSizingColumnDef => {
    return defaultColumnSizing
  },
  getInitialState: (state): ColumnSizingTableState => {
    return {
      columnSizing: {},
      columnSizingInfo: getDefaultColumnSizingInfoState(),
      ...state,
    }
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): ColumnSizingDefaultOptions => {
    return {
      columnResizeMode: 'onEnd',
      onColumnSizingChange: makeStateUpdater('columnSizing', table),
      onColumnSizingInfoChange: makeStateUpdater('columnSizingInfo', table),
    }
  },

  createColumn: <TData extends RowData, TValue>(
    column: Column<TData, TValue>,
    table: Table<TData>
  ): ColumnSizingColumn => {
    return {
      getSize: () => {
        const columnSize = table.getState().columnSizing[column.id]

        return Math.min(
          Math.max(
            column.columnDef.minSize ?? defaultColumnSizing.minSize,
            columnSize ?? column.columnDef.size ?? defaultColumnSizing.size
          ),
          column.columnDef.maxSize ?? defaultColumnSizing.maxSize
        )
      },
      getStart: position => {
        const columns = !position
          ? table.getVisibleLeafColumns()
          : position === 'left'
          ? table.getLeftVisibleLeafColumns()
          : table.getRightVisibleLeafColumns()

        const index = columns.findIndex(d => d.id === column.id)

        if (index > 0) {
          const prevSiblingColumn = columns[index - 1]!

          return (
            prevSiblingColumn.getStart(position) + prevSiblingColumn.getSize()
          )
        }

        return 0
      },
      resetSize: () => {
        table.setColumnSizing(({ [column.id]: _, ...rest }) => {
          return rest
        })
      },
      getCanResize: () => {
        return (
          (column.columnDef.enableResizing ?? true) &&
          (table.options.enableColumnResizing ?? true)
        )
      },
      getIsResizing: () => {
        return table.getState().columnSizingInfo.isResizingColumn === column.id
      },
    }
  },

  createHeader: <TData extends RowData, TValue>(
    header: Header<TData, TValue>,
    table: Table<TData>
  ): ColumnSizingHeader => {
    return {
      getSize: () => {
        let sum = 0

        const recurse = (header: Header<TData, TValue>) => {
          if (header.subHeaders.length) {
            header.subHeaders.forEach(recurse)
          } else {
            sum += header.column.getSize() ?? 0
          }
        }

        recurse(header)

        return sum
      },
      getStart: () => {
        if (header.index > 0) {
          const prevSiblingHeader =
            header.headerGroup.headers[header.index - 1]!
          return prevSiblingHeader.getStart() + prevSiblingHeader.getSize()
        }

        return 0
      },
      getResizeHandler: () => {
        const column = table.getColumn(header.column.id)
        const canResize = column?.getCanResize()

        return (e: unknown) => {
          if (!column || !canResize) {
            return
          }

          ;(e as any).persist?.()

          if (isTouchStartEvent(e)) {
            // lets not respond to multiple touches (e.g. 2 or 3 fingers)
            if (e.touches && e.touches.length > 1) {
              return
            }
          }

          const startSize = header.getSize()

          const columnSizingStart: [string, number][] = header
            ? header
                .getLeafHeaders()
                .map(d => [d.column.id, d.column.getSize()])
            : [[column.id, column.getSize()]]

          const clientX = isTouchStartEvent(e)
            ? Math.round(e.touches[0]!.clientX)
            : (e as MouseEvent).clientX

          const newColumnSizing: ColumnSizingState = {}

          const updateOffset = (
            eventType: 'move' | 'end',
            clientXPos?: number
          ) => {
            if (typeof clientXPos !== 'number') {
              return
            }

            table.setColumnSizingInfo(old => {
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
              table.options.columnResizeMode === 'onChange' ||
              eventType === 'end'
            ) {
              table.setColumnSizing(old => ({
                ...old,
                ...newColumnSizing,
              }))
            }
          }

          const onMove = (clientXPos?: number) =>
            updateOffset('move', clientXPos)

          const onEnd = (clientXPos?: number) => {
            updateOffset('end', clientXPos)

            table.setColumnSizingInfo(old => ({
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
              onMove(e.touches[0]!.clientX)
              return false
            },
            upHandler: (e: TouchEvent) => {
              document.removeEventListener('touchmove', touchEvents.moveHandler)
              document.removeEventListener('touchend', touchEvents.upHandler)
              if (e.cancelable) {
                e.preventDefault()
                e.stopPropagation()
              }
              onEnd(e.touches[0]?.clientX)
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

          table.setColumnSizingInfo(old => ({
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
    }
  },

  createTable: <TData extends RowData>(
    table: Table<TData>
  ): ColumnSizingInstance => {
    return {
      setColumnSizing: updater => table.options.onColumnSizingChange?.(updater),
      setColumnSizingInfo: updater =>
        table.options.onColumnSizingInfoChange?.(updater),
      resetColumnSizing: defaultState => {
        table.setColumnSizing(
          defaultState ? {} : table.initialState.columnSizing ?? {}
        )
      },
      resetHeaderSizeInfo: defaultState => {
        table.setColumnSizingInfo(
          defaultState
            ? getDefaultColumnSizingInfoState()
            : table.initialState.columnSizingInfo ??
                getDefaultColumnSizingInfoState()
        )
      },
      getTotalSize: () =>
        table.getHeaderGroups()[0]?.headers.reduce((sum, header) => {
          return sum + header.getSize()
        }, 0) ?? 0,
      getLeftTotalSize: () =>
        table.getLeftHeaderGroups()[0]?.headers.reduce((sum, header) => {
          return sum + header.getSize()
        }, 0) ?? 0,
      getCenterTotalSize: () =>
        table.getCenterHeaderGroups()[0]?.headers.reduce((sum, header) => {
          return sum + header.getSize()
        }, 0) ?? 0,
      getRightTotalSize: () =>
        table.getRightHeaderGroups()[0]?.headers.reduce((sum, header) => {
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
