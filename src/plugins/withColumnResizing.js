import React from 'react'

import { useGetLatest, getFirstDefined, getLeafHeaders } from '../utils'

export const withColumnResizing = {
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
      const column = getInstance().flatColumns.find(d => d.id === columnId)

      if (!column) {
        return false
      }

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
      const column = getInstance().flatColumns.find(d => d.id === columnId)

      if (!column) {
        return
      }

      return (
        getInstance().state.columnResizing.columnWidths[columnId] ||
        column.width
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
  header.getIsResizing = () => header.column.getIsResizing()
  header.getCanResize = () => header.column.getCanResize()

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
      const headerIdWidths = headersToResize.map(d => [d.id, d.totalWidth])

      const clientX = isTouchEvent
        ? Math.round(e.touches[0].clientX)
        : e.clientX

      const onMove = clientXPos =>
        getInstance().setState(
          old => {
            const { startX, columnWidth, headerIdWidths } = old.columnResizing

            const deltaX = clientXPos - startX
            const percentageDeltaX = deltaX / columnWidth

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

      document.addEventListener(events.moveEvent, events.moveHandler, {
        passive: false,
      })

      document.addEventListener(events.upEvent, events.upHandler, {
        passive: false,
      })

      getInstance().setState(
        old => ({
          ...old,
          columnResizing: {
            ...old.columnResizing,
            startX: clientX,
            headerIdWidths,
            columnWidth: header.totalWidth,
            isResizingColumn: header.id,
          },
        }),
        {
          type: 'resizeColumnStart',
        }
      )
    }

    return {
      ...props,
      onMouseDown: e => e.persist() || onResizeStart(e, header),
      onTouchStart: e => e.persist() || onResizeStart(e, header),
      draggable: false,
      role: 'separator',
    }
  }
}
