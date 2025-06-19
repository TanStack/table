import React from 'react'

import {
  actions,
  defaultColumn,
  makePropGetter,
  useGetLatest,
  ensurePluginOrder,
  useMountedLayoutEffect,
} from '../publicUtils'

import { getFirstDefined, passiveEventSupported } from '../utils'

// Default Column
defaultColumn.canResize = true

// Actions
actions.columnStartResizing = 'columnStartResizing'
actions.columnResizing = 'columnResizing'
actions.columnDoneResizing = 'columnDoneResizing'
actions.resetResize = 'resetResize'

export const useResizeColumns = hooks => {
  hooks.getResizerProps = [defaultGetResizerProps]
  hooks.getHeaderProps.push({
    style: {
      position: 'relative',
    },
  })
  hooks.stateReducers.push(reducer)
  hooks.useInstance.push(useInstance)
  hooks.useInstanceBeforeDimensions.push(useInstanceBeforeDimensions)
}

const defaultGetResizerProps = (props, { instance, header }) => {
  const { dispatch } = instance

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

    let raf
    let mostRecentClientX

    const dispatchEnd = () => {
      window.cancelAnimationFrame(raf)
      raf = null
      dispatch({ type: actions.columnDoneResizing })
    }
    const dispatchMove = () => {
      window.cancelAnimationFrame(raf)
      raf = null
      dispatch({ type: actions.columnResizing, clientX: mostRecentClientX })
    }

    const scheduleDispatchMoveOnNextAnimationFrame = clientXPos => {
      mostRecentClientX = clientXPos
      if (!raf) {
        raf = window.requestAnimationFrame(dispatchMove)
      }
    }

    const handlersAndEvents = {
      mouse: {
        moveEvent: 'mousemove',
        moveHandler: e => scheduleDispatchMoveOnNextAnimationFrame(e.clientX),
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
          scheduleDispatchMoveOnNextAnimationFrame(e.touches[0].clientX)
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

    dispatch({
      type: actions.columnStartResizing,
      columnId: header.id,
      columnWidth: header.totalWidth,
      headerIdWidths,
      clientX,
    })
  }

  return [
    props,
    {
      onMouseDown: e => e.persist() || onResizeStart(e, header),
      onTouchStart: e => e.persist() || onResizeStart(e, header),
      style: {
        cursor: 'col-resize',
      },
      draggable: false,
      role: 'separator',
    },
  ]
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

  if (action.type === actions.resetResize) {
    return {
      ...state,
      columnResizing: {
        columnWidths: {},
      },
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
    const { startX, columnWidth, headerIdWidths = [] } = state.columnResizing

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
    header.width =
      columnResizing.columnWidths[header.id] ||
      header.originalWidth ||
      header.width
    header.isResizing = columnResizing.isResizingColumn === header.id

    if (canResize) {
      header.getResizerProps = makePropGetter(getHooks().getResizerProps, {
        instance: getInstance(),
        header,
      })
    }
  })
}

function useInstance(instance) {
  const { plugins, dispatch, autoResetResize = true, columns } = instance

  ensurePluginOrder(plugins, ['useAbsoluteLayout'], 'useResizeColumns')

  const getAutoResetResize = useGetLatest(autoResetResize)
  useMountedLayoutEffect(() => {
    if (getAutoResetResize()) {
      dispatch({ type: actions.resetResize })
    }
  }, [columns])

  const resetResizing = React.useCallback(
    () => dispatch({ type: actions.resetResize }),
    [dispatch]
  )

  Object.assign(instance, {
    resetResizing,
  })
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
