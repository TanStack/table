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

  const onMouseDown = (e, header) => {
    const headersToResize = getLeafHeaders(header)
    const headerIdWidths = headersToResize.map(d => [d.id, d.totalWidth])

    const clientX = e.clientX

    const onMouseMove = e => {
      const clientX = e.clientX

      dispatch({ type: actions.columnResizing, clientX })
    }

    const onMouseUp = e => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)

      dispatch({ type: actions.columnDoneResizing })
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

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
            onMouseDown: e => e.persist() || onMouseDown(e, header),
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
