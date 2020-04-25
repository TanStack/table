import {
  getFirstDefined,
  defaultColumn,
  makePropGetter,
  useGetLatest,
  ensurePluginOrder,
} from '../utils'

// Default Column
defaultColumn.canResize = true

export const useResizeColumns = hooks => {
  hooks.getResizerProps = [defaultGetResizerProps]
  hooks.getHeaderProps.push({
    style: {
      position: 'relative',
    },
  })
  hooks.getInitialState.push(getInitialState)
  hooks.useInstance.push(useInstance)
  hooks.useInstanceBeforeDimensions.push(useInstanceBeforeDimensions)
}

const defaultGetResizerProps = (props, { instance, header }) => {
  const { setState } = instance

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

    const clientX = isTouchEvent ? Math.round(e.touches[0].clientX) : e.clientX

    const onMove = clientXPos =>
      setState(
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
      setState(
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

    setState(
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

  return [
    props,
    {
      onMouseDown: e => e.persist() || onResizeStart(e, header),
      onTouchStart: e => e.persist() || onResizeStart(e, header),
      style: {
        cursor: 'ew-resize',
      },
      draggable: false,
      role: 'separator',
    },
  ]
}

useResizeColumns.pluginName = 'useResizeColumns'

function getInitialState(state, action) {
  return {
    columnResizing: {
      columnWidths: {},
    },
    ...state,
  }
}

const useInstanceBeforeDimensions = instance => {
  const {
    flatHeaders,
    disableResizing,
    getHooks,
    state: { columnResizing },
  } = instance

  const getInstance = useGetLatest(instance)

  flatHeaders.forEach(header => {
    const canResize = getFirstDefined(
      header.disableResizing === true ? false : undefined,
      disableResizing === true ? false : undefined,
      true
    )

    header.canResize = canResize
    header.width = columnResizing.columnWidths[header.id] || header.width
    header.isResizing = columnResizing.isResizingColumn === header.id

    if (canResize) {
      header.getResizerProps = makePropGetter(getHooks().getResizerProps, {
        instance: getInstance(),
        header,
      })
    }
  })
}

function useInstance({ plugins }) {
  ensurePluginOrder(plugins, ['useAbsoluteLayout'], 'useResizeColumns')
}

function getLeafHeaders(header) {
  const leafHeaders = []
  const recurseHeader = header => {
    if (header.columns && header.columns.length) {
      header.columns.map(recurseHeader)
    }
    leafHeaders.push(header)
  }
  recurseHeader(header)
  return leafHeaders
}
