import React, {
  ComponentProps,
  MouseEvent as ReactMouseEvent,
  PropsWithoutRef,
  PropsWithRef,
  TouchEvent as ReactTouchEvent,
} from 'react'

import { getLeafHeaders, makeStateUpdater } from '../utils'

import { withColumnResizing as name, withColumnVisibility } from '../Constants'
import {
  ColumnId,
  ColumnResizing,
  ReduceColumn,
  ReduceHeader,
  Header,
  MakeInstance,
  GetDefaultOptions,
} from '../types'

let passiveSupported: boolean | null = null

export function passiveEventSupported() {
  // memoize support to avoid adding multiple test events
  if (typeof passiveSupported === 'boolean') return passiveSupported

  let supported = false
  try {
    const options = {
      get passive() {
        supported = true
        return false
      },
    }

    window.addEventListener('test', noop, options)
    window.removeEventListener('test', noop)
  } catch (err) {
    supported = false
  }
  passiveSupported = supported
  return passiveSupported
}

const getDefaultOptions: GetDefaultOptions = options => {
  return {
    onColumnResizingChange: React.useCallback(
      makeStateUpdater('columnResizing'),
      []
    ),
    ...options,
    initialState: {
      columnResizing: {
        columnWidths: {},
      },
      ...options.initialState,
    },
  }
}

const extendInstance: MakeInstance = instance => {
  instance.setColumnResizing = React.useCallback(
    updater => instance.options.onColumnResizingChange?.(updater, instance),
    [instance]
  )

  instance.getColumnCanResize = React.useCallback(
    columnId => {
      const column = instance.allColumns.find(d => d.id === columnId)

      if (!column) return false

      return (
        (column.disableResizing ? false : undefined) ??
        (instance.options?.disableResizing ? false : undefined) ??
        column.defaultCanResize ??
        true
      )
    },
    [instance.allColumns, instance.options.disableResizing]
  )

  instance.getColumnWidth = React.useCallback(
    columnId => {
      if (!columnId) return 0
      const { allColumns } = instance
      const column = allColumns.find(d => d.id === columnId)
      const columnWidths = instance.state.columnResizing?.columnWidths

      if (!column) return 0

      return Math.min(
        Math.max(
          column?.minWidth ?? 0,
          (columnWidths?.[columnId] ?? 0) || (column.width ?? 0)
        ),
        column.maxWidth ?? 0
      )
    },
    [instance]
  )

  const isResizingColumn = instance.state.columnResizing?.isResizingColumn
  instance.getColumnIsResizing = React.useCallback(
    columnId => {
      return isResizingColumn === columnId
    },
    [isResizingColumn]
  )

  return instance
}

const reduceColumn: ReduceColumn = (column, { instance }) => {
  column.getIsResizing = () => instance.getColumnIsResizing(column.id)
  column.getCanResize = () => instance.getColumnCanResize(column.id)

  return column
}

const reduceHeader: ReduceHeader = (header, { instance }) => {
  header.getIsResizing = () =>
    header?.column?.getIsResizing ? header.column.getIsResizing() : true
  header.getCanResize = () =>
    header?.column?.getCanResize ? header.column.getCanResize() : true

  function isTouchStartEvent(
    e: ReactTouchEvent | ReactMouseEvent
  ): e is ReactTouchEvent {
    return e.type === 'touchstart'
  }

  header.getResizerProps = (props = {}) => {
    const onResizeStart = (
      e: ReactMouseEvent | ReactTouchEvent,
      header: Header
    ) => {
      if (isTouchStartEvent(e)) {
        // lets not respond to multiple touches (e.g. 2 or 3 fingers)
        if (e.touches && e.touches.length > 1) {
          return
        }
      }
      const headersToResize = getLeafHeaders(header)
      const headerIdWidths: [ColumnId, number][] = headersToResize.map(d => [
        d.id,
        d.getWidth(),
      ])

      const clientX = isTouchStartEvent(e)
        ? Math.round(e.touches[0].clientX)
        : e.clientX

      const onMove = (clientXPos?: number) => {
        if (typeof clientXPos !== 'number') {
          return
        }

        return instance.setColumnResizing(old => {
          const deltaX = clientXPos - (old?.startX ?? 0)
          const percentageDeltaX = Math.max(
            deltaX / (old?.columnWidth ?? 0),
            -0.999999
          )

          const newColumnWidths: ColumnResizing['columnWidths'] = {}
          ;(old?.headerIdWidths ?? []).forEach(([headerId, headerWidth]) => {
            newColumnWidths[headerId] = Math.max(
              headerWidth + headerWidth * percentageDeltaX,
              0
            )
          })

          return {
            ...old,
            columnWidths: {
              ...(old?.columnWidths ?? {}),
              ...newColumnWidths,
            },
          }
        })
      }

      const onEnd = () =>
        instance.setColumnResizing(old => ({
          ...old,
          startX: null,
          isResizingColumn: false,
        }))

      const mouseEvents = {
        moveHandler: (e: MouseEvent) => onMove(e.clientX),
        upHandler: () => {
          document.removeEventListener('mousemove', mouseEvents.moveHandler)
          document.removeEventListener('mouseup', mouseEvents.upHandler)
          onEnd()
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
        upHandler: () => {
          document.removeEventListener('touchmove', touchEvents.moveHandler)
          document.removeEventListener('touchend', touchEvents.upHandler)
          onEnd()
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

      instance.setColumnResizing(old => ({
        ...old,
        startX: clientX,
        headerIdWidths,
        columnWidth: header.getWidth(),
        isResizingColumn: header.id,
      }))
    }

    return {
      onMouseDown: (e: ReactMouseEvent) => {
        e.persist()
        onResizeStart(e, header)
      },
      onTouchStart: (e: ReactTouchEvent) => {
        e.persist()
        onResizeStart(e, header)
      },
      draggable: false,
      role: 'separator',
      ...props,
    }
  }

  return header
}

export const withColumnResizing = {
  name,
  after: [withColumnVisibility],
  plugs: {
    getDefaultOptions,
    extendInstance,
    reduceColumn,
    reduceHeader,
  },
}
