import React from 'react'

import {
  getFirstDefined,
  getLeafHeaders,
  passiveEventSupported,
} from '../utils'

import { withColumnResizing as name, withColumnVisibility } from '../Constants'

export const withColumnResizing = {
  name,
  after: [withColumnVisibility],
  plugs: {
    useReduceOptions,
    useInstanceAfterState,
    decorateColumn,
    decorateHeader,
  },
}

function useReduceOptions(options) {
  return {
    ...options,
    initialState: {
      columnResizing: {
        columnWidths: {},
      },
      ...options.initialState,
    },
  }
}

function useInstanceAfterState(instance) {
  instance.getColumnCanResize = React.useCallback(
    columnId => {
      const column = instance.allColumns.find(d => d.id === columnId)

      return getFirstDefined(
        column.disableResizing === true ? false : undefined,
        instance.options.disableResizing === true ? false : undefined,
        true
      )
    },
    [instance.allColumns, instance.options.disableResizing]
  )

  instance.getColumnWidth = React.useCallback(
    columnId => {
      const column = instance.allColumns.find(d => d.id === columnId)

      return Math.min(
        Math.max(
          column.minWidth,
          instance.state.columnResizing.columnWidths[columnId] || column.width
        ),
        column.maxWidth
      )
    },
    [instance.allColumns, instance.state.columnResizing.columnWidths]
  )

  instance.getColumnIsResizing = React.useCallback(
    columnId => {
      return instance.state.columnResizing.isResizingColumn === columnId
    },
    [instance.state.columnResizing.isResizingColumn]
  )
}

function decorateColumn(column, { instance }) {
  column.getIsResizing = () => instance.getColumnIsResizing(column.id)
  column.getCanResize = () => instance.getColumnCanResize(column.id)
}

function decorateHeader(header, { instance }) {
  header.getIsResizing = () =>
    header?.column?.getIsResizing ? header.column.getIsResizing() : true
  header.getCanResize = () =>
    header?.column?.getCanResize ? header.column.getCanResize() : true

  header.getResizerProps = (props = {}) => {
    const onResizeStart = (e, header) => {
      let isTouchEvent = false
      if (e.type === 'touchstart') {
        // lets not respond to multiple touches (e.g. 2 or 3 fingers)
        if (e.touches && e.touches.length > 1) {
          return
        }
        isTouchEvent = true
      }
      const headersToResize = getLeafHeaders(header)
      const headerIdWidths = headersToResize.map(d => [d.id, d.getWidth()])

      const clientX = isTouchEvent
        ? Math.round(e.touches[0].clientX)
        : e.clientX

      const onMove = clientXPos =>
        instance.setState(
          old => {
            const {
              startX,
              columnWidth,
              headerIdWidths = [],
            } = old.columnResizing

            const deltaX = clientXPos - startX
            const percentageDeltaX = Math.max(deltaX / columnWidth, -0.999999)

            const newColumnWidths = {}

            headerIdWidths.forEach(([headerId, headerWidth]) => {
              newColumnWidths[headerId] = Math.max(
                headerWidth + headerWidth * percentageDeltaX,
                0
              )
            })

            return {
              ...old,
              columnResizing: {
                ...old.columnResizing,
                columnWidths: {
                  ...old.columnResizing.columnWidths,
                  ...newColumnWidths,
                },
              },
            }
          },
          {
            type: 'resizeColumnMove',
          }
        )

      const onEnd = () =>
        instance.setState(
          old => ({
            ...old,
            columnResizing: {
              ...old.columnResizing,
              startX: null,
              isResizingColumn: null,
            },
          }),
          {
            type: 'resizeColumnEnd',
          }
        )

      const handlersAndEvents = {
        mouse: {
          moveEvent: 'mousemove',
          moveHandler: e => onMove(e.clientX),
          upEvent: 'mouseup',
          upHandler: () => {
            document.removeEventListener(
              'mousemove',
              handlersAndEvents.mouse.moveHandler
            )
            document.removeEventListener(
              'mouseup',
              handlersAndEvents.mouse.upHandler
            )
            onEnd()
          },
        },
        touch: {
          moveEvent: 'touchmove',
          moveHandler: e => {
            if (e.cancelable) {
              e.preventDefault()
              e.stopPropagation()
            }
            onMove(e.touches[0].clientX)
            return false
          },
          upEvent: 'touchend',
          upHandler: () => {
            document.removeEventListener(
              handlersAndEvents.touch.moveEvent,
              handlersAndEvents.touch.moveHandler
            )
            document.removeEventListener(
              handlersAndEvents.touch.upEvent,
              handlersAndEvents.touch.upHandler
            )
            onEnd()
          },
        },
      }

      const events = isTouchEvent
        ? handlersAndEvents.touch
        : handlersAndEvents.mouse

      const passiveIfSupported = passiveEventSupported()
        ? { passive: false }
        : false
      document.addEventListener(
        events.moveEvent,
        events.moveHandler,
        passiveIfSupported
      )
      document.addEventListener(
        events.upEvent,
        events.upHandler,
        passiveIfSupported
      )

      instance.setState(
        old => ({
          ...old,
          columnResizing: {
            ...old.columnResizing,
            startX: clientX,
            headerIdWidths,
            columnWidth: header.getWidth(),
            isResizingColumn: header.id,
          },
        }),
        {
          type: 'resizeColumnStart',
        }
      )
    }

    return {
      onMouseDown: e => e.persist() || onResizeStart(e, header),
      onTouchStart: e => e.persist() || onResizeStart(e, header),
      draggable: false,
      role: 'separator',
      ...props,
    }
  }
}
