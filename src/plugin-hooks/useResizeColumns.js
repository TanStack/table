import {
  actions,
  defaultColumn,
  getFirstDefined,
  mergeProps,
  applyPropHooks,
  useGetLatest,
} from '../utils'

// Default Column
defaultColumn.canResize = true

// Actions
actions.columnStartResizing = 'columnStartResizing'
actions.columnResizing = 'columnResizing'
actions.columnDoneResizing = 'columnDoneResizing'

export const useResizeColumns = hooks => {
  hooks.stateReducers.push(reducer)
  hooks.useInstanceBeforeDimensions.push(useInstanceBeforeDimensions)
}

useResizeColumns.pluginName = 'useResizeColumns'

function reducer(state, action) {
  if (action.type === actions.init) {
    return {
      columnResizing: {
        columnWidths: {},
      },
      ...state,
    }
  }

  if (action.type === actions.columnStartResizing) {
    const { clientX, columnId, columnWidth, headerIdWidths } = action

    return {
      ...state,
      columnResizing: {
        ...state.columnResizing,
        startX: clientX,
        headerIdWidths,
        columnWidth,
        isResizingColumn: columnId,
      },
    }
  }

  if (action.type === actions.columnResizing) {
    const { clientX } = action
    const { startX, columnWidth, headerIdWidths } = state.columnResizing

    const deltaX = clientX - startX
    const percentageDeltaX = deltaX / columnWidth

    const newColumnWidths = {}

    headerIdWidths.forEach(([headerId, headerWidth]) => {
      newColumnWidths[headerId] = Math.max(
        headerWidth + headerWidth * percentageDeltaX,
        0
      )
    })

    return {
      ...state,
      columnResizing: {
        ...state.columnResizing,
        columnWidths: {
          ...state.columnResizing.columnWidths,
          ...newColumnWidths,
        },
      },
    }
  }

  if (action.type === actions.columnDoneResizing) {
    return {
      ...state,
      columnResizing: {
        ...state.columnResizing,
        startX: null,
        isResizingColumn: null,
      },
    }
  }
}

const useInstanceBeforeDimensions = instance => {
  instance.hooks.getResizerProps = []

  const {
    flatHeaders,
    disableResizing,
    hooks: { getHeaderProps },
    state: { columnResizing },
    dispatch,
  } = instance

  getHeaderProps.push(() => {
    return {
      style: {
        position: 'relative',
      },
    }
  })

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

    const dispatchMove = clientXPos => {
      dispatch({ type: actions.columnResizing, clientX: clientXPos })
    }
    const dispatchEnd = () => dispatch({ type: actions.columnDoneResizing })

    const handlersAndEvents = {
      mouse: {
        moveEvent: 'mousemove',
        moveHandler: e => dispatchMove(e.clientX),
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
          dispatchEnd()
        },
      },
      touch: {
        moveEvent: 'touchmove',
        moveHandler: e => {
          if (e.cancelable) {
            e.preventDefault()
            e.stopPropagation()
          }
          dispatchMove(e.touches[0].clientX)
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
          dispatchEnd()
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

    dispatch({
      type: actions.columnStartResizing,
      columnId: header.id,
      columnWidth: header.totalWidth,
      headerIdWidths,
      clientX,
    })
  }

  // use reference to avoid memory leak in #1608
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
      header.getResizerProps = userProps => {
        return mergeProps(
          {
            onMouseDown: e => e.persist() || onResizeStart(e, header),
            onTouchStart: e => e.persist() || onResizeStart(e, header),
            style: {
              cursor: 'ew-resize',
            },
            draggable: false,
          },
          applyPropHooks(
            getInstance().hooks.getResizerProps,
            header,
            getInstance()
          ),
          userProps
        )
      }
    }
  })

  return instance
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
