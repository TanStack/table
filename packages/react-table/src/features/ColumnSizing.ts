import React, {
  ComponentProps,
  MouseEvent as ReactMouseEvent,
  PropsWithoutRef,
  PropsWithRef,
  TouchEvent as ReactTouchEvent,
} from 'react'
import {
  Column,
  Getter,
  Header,
  OnChangeFn,
  PropGetterValue,
  ReactTable,
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

export type HeaderResizerProps = {
  title?: string
  onMouseDown?: (e: ReactMouseEvent) => void
  onTouchStart?: (e: ReactTouchEvent) => void
  draggable?: boolean
  role?: string
}

export type ColumnSizingInstance<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
> = {
  setColumnSizing: (updater: Updater<ColumnSizing>) => void
  setColumnSizingInfo: (updater: Updater<ColumnSizingInfoState>) => void
  resetColumnSizing: () => void
  resetColumnSize: (columnId: string) => void
  resetHeaderSize: (headerId: string) => void
  resetHeaderSizeInfo: () => void
  getColumnCanResize: (columnId: string) => boolean
  getHeaderCanResize: (headerId: string) => boolean
  getHeaderResizerProps: <TGetter extends Getter<HeaderResizerProps>>(
    columnId: string,
    userProps?: TGetter
  ) => undefined | PropGetterValue<HeaderResizerProps, TGetter>
  getColumnIsResizing: (columnId: string) => boolean
  getHeaderIsResizing: (headerId: string) => boolean
}

export type ColumnSizingColumnDef = {
  enableResizing?: boolean
  defaultCanResize?: boolean
}

export type ColumnSizingColumn<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
> = {
  getCanResize: () => boolean
  getIsResizing: () => boolean
  resetSize: () => void
}

export type ColumnSizingHeader<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
> = {
  getCanResize: () => boolean
  getIsResizing: () => boolean
  getResizerProps: <TGetter extends Getter<HeaderResizerProps>>(
    userProps?: TGetter
  ) => undefined | PropGetterValue<HeaderResizerProps, TGetter>
  resetSize: () => void
}

//

export const defaultColumnSizing = {
  width: 150,
  minWidth: 20,
  maxWidth: Number.MAX_SAFE_INTEGER,
}

export function getInitialState(): ColumnSizingTableState {
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
}

export function getDefaultOptions<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
): ColumnSizingDefaultOptions {
  return {
    columnResizeMode: 'onEnd',
    onColumnSizingChange: makeStateUpdater('columnSizing', instance),
    onColumnSizingInfoChange: makeStateUpdater('columnSizingInfo', instance),
  }
}

export function getInstance<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
): ColumnSizingInstance<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
> {
  return {
    setColumnSizing: updater =>
      instance.options.onColumnSizingChange?.(
        updater,
        functionalUpdate(updater, instance.getState().columnSizing)
      ),
    setColumnSizingInfo: updater =>
      instance.options.onColumnSizingInfoChange?.(
        updater,
        functionalUpdate(updater, instance.getState().columnSizingInfo)
      ),
    resetColumnSizing: () => {
      instance.setColumnSizing(instance.initialState.columnSizing ?? {})
    },
    resetHeaderSizeInfo: () => {
      instance.setColumnSizingInfo(instance.initialState.columnSizingInfo ?? {})
    },
    resetColumnSize: columnId => {
      instance.setColumnSizing(({ [columnId]: _, ...rest }) => {
        return rest
      })
    },
    resetHeaderSize: headerId => {
      const header = instance.getHeader(headerId)

      if (!header) {
        return
      }

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

      return instance.getState().columnSizingInfo.isResizingColumn === columnId
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

      if (!header) {
        return
      }

      const column = instance.getColumn(header.column.id)

      if (!column) {
        return
      }

      const canResize = column.getCanResize()

      const onResizeStart = (e: ReactMouseEvent | ReactTouchEvent) => {
        if (isTouchStartEvent(e)) {
          // lets not respond to multiple touches (e.g. 2 or 3 fingers)
          if (e.touches && e.touches.length > 1) {
            return
          }
        }

        const columnSizingStart: [string, number][] = header
          .getLeafHeaders()
          .map(d => [d.column.id, d.getWidth()])

        const clientX = isTouchStartEvent(e)
          ? Math.round(e.touches[0].clientX)
          : e.clientX

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
              newColumnSizing[columnId] = Math.max(
                headerWidth + headerWidth * deltaPercentage,
                0
              )
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

        const onMove = (clientXPos?: number) => updateOffset('move', clientXPos)

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
          startSize: header.getWidth(),
          deltaOffset: 0,
          deltaPercentage: 0,
          columnSizingStart,
          isResizingColumn: header.column.id,
        }))
      }

      const initialProps: HeaderResizerProps = canResize
        ? {
            title: 'Toggle Grouping',
            draggable: false,
            role: 'separator',
            onMouseDown: (e: ReactMouseEvent) => {
              e.persist()
              onResizeStart(e)
            },
            onTouchStart: (e: ReactTouchEvent) => {
              e.persist()
              onResizeStart(e)
            },
          }
        : {}

      return propGetter(initialProps, userProps)
    },
  }
}

export function createColumn<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  column: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
  instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
): ColumnSizingColumn<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> {
  return {
    getIsResizing: () => instance.getColumnIsResizing(column.id),
    getCanResize: () => instance.getColumnCanResize(column.id),
    resetSize: () => instance.resetColumnSize(column.id),
  }
}

export function createHeader<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  header: Header<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
  instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
): ColumnSizingHeader<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> {
  return {
    getIsResizing: () => instance.getHeaderIsResizing(header.id),
    getCanResize: () => instance.getHeaderCanResize(header.id),
    getResizerProps: userProps =>
      instance.getHeaderResizerProps(header.id, userProps),
    resetSize: () => instance.resetHeaderSize(header.id),
  }
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

function isTouchStartEvent(
  e: ReactTouchEvent | ReactMouseEvent
): e is ReactTouchEvent {
  return e.type === 'touchstart'
}
