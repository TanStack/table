import React from 'react'

import {
  useGetLatest,
  getFirstDefined,
  getLeafHeaders,
  passiveEventSupported,
} from '../utils'

import { withColumnResizing as name, withColumnVisibility } from '../Constants'

export const withColumnResizing = {
  name,
  after: [withColumnVisibility],
  useReduceOptions,
  useInstanceAfterState,
  decorateColumn,
  decorateHeader,
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
  const getInstance = useGetLatest(instance)

  instance.getColumnCanResize = React.useCallback(
    columnId => {
      const column = getInstance().allColumns.find(d => d.id === columnId)

      return getFirstDefined(
        column.disableResizing === true ? false : undefined,
        getInstance().options.disableResizing === true ? false : undefined,
        true
      )
    },
    [getInstance]
  )

  instance.getColumnWidth = React.useCallback(
    columnId => {
      const column = getInstance().allColumns.find(d => d.id === columnId)

      return Math.min(
        Math.max(
          column.minWidth,
          getInstance().state.columnResizing.columnWidths[columnId] ||
            column.width
        ),
        column.maxWidth
      )
    },
    [getInstance]
  )

  instance.getColumnIsResizing = React.useCallback(
    columnId => {
      return getInstance().state.columnResizing.isResizingColumn === columnId
    },
    [getInstance]
  )
}

function decorateColumn(column, { getInstance }) {
  column.getIsResizing = () => getInstance().getColumnIsResizing(column.id)
  column.getCanResize = () => getInstance().getColumnCanResize(column.id)
}

function decorateHeader(header, { getInstance }) {
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
        getInstance().setState(
          old => {
            const { startX, columnWidth, headerIdWidths } = old.columnResizing

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
        getInstance().setState(
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
          upHandler: e => {
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
          upHandler: e => {
            document.removeEventListener(
              handlersAndEvents.touch.moveEvent,
              handlersAndEvents.touch.moveHandler
            )
            document.removeEventListener(
              handlersAndEvents.touch.upEvent,
              handlersAndEvents.touch.moveHandler
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

      getInstance().setState(
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
