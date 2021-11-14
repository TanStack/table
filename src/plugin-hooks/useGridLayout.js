import { actions } from '../publicUtils'

// Actions
actions.columnStartResizing = 'columnStartResizing'
actions.columnResizing = 'columnResizing'
actions.columnDoneResizing = 'columnDoneResizing'
actions.resetResize = 'resetResize'

export function useGridLayout(hooks) {
  hooks.stateReducers.push(reducer)
  hooks.getTableProps.push(getTableProps)
  hooks.getHeaderProps.push(getHeaderProps)
  hooks.getRowProps.push(getRowProps)
}

useGridLayout.pluginName = 'useGridLayout'

const getTableProps = (props, { instance }) => {
  const gridTemplateColumns = instance.visibleColumns.map(column => {
    if (instance.state.gridLayout.columnWidths[column.id])
      return `${instance.state.gridLayout.columnWidths[column.id]}px`
    // When resizing, lock the width of all unset columns
    // instead of using user-provided width or defaultColumn width,
    // which could potentially be 'auto' or 'fr' units that don't scale linearly
    if (instance.state.columnResizing?.isResizingColumn)
      return `${instance.state.gridLayout.startWidths[column.id]}px`
    if (typeof column.width === 'number') return `${column.width}px`
    return column.width
  })
  return [
    props,
    {
      style: {
        display: `grid`,
        gridTemplateColumns: gridTemplateColumns.join(` `),
      },
    },
  ]
}

const getHeaderProps = (props, { column }) => [
  props,
  {
    id: `header-cell-${column.id}`,
    style: {
      position: `sticky`, //enables a scroll wrapper to be placed around the table and have sticky headers
      gridColumn: `span ${column.totalVisibleHeaderCount}`,
    },
  },
]

const getRowProps = (props, { row }) => {
  if (row.isExpanded) {
    return [
      props,
      {
        style: {
          gridColumn: `1 / ${row.cells.length + 1}`,
        },
      },
    ]
  }
  return [props, {}]
}

function reducer(state, action, previousState, instance) {
  if (action.type === actions.init) {
    return {
      gridLayout: {
        columnWidths: {},
      },
      ...state,
    }
  }

  if (action.type === actions.resetResize) {
    return {
      ...state,
      gridLayout: {
        columnWidths: {},
      },
    }
  }

  if (action.type === actions.columnStartResizing) {
    const { columnId, headerIdWidths } = action
    const columnWidth = getElementWidth(columnId)

    if (columnWidth !== undefined) {
      const startWidths = instance.visibleColumns.reduce(
        (acc, column) => ({
          ...acc,
          [column.id]: getElementWidth(column.id),
        }),
        {}
      )
      const minWidths = instance.visibleColumns.reduce(
        (acc, column) => ({
          ...acc,
          [column.id]: column.minWidth,
        }),
        {}
      )
      const maxWidths = instance.visibleColumns.reduce(
        (acc, column) => ({
          ...acc,
          [column.id]: column.maxWidth,
        }),
        {}
      )

      const headerIdGridWidths = headerIdWidths.map(([headerId]) => [
        headerId,
        getElementWidth(headerId),
      ])

      return {
        ...state,
        gridLayout: {
          ...state.gridLayout,
          startWidths,
          minWidths,
          maxWidths,
          headerIdGridWidths,
          columnWidth,
        },
      }
    } else {
      return state
    }
  }

  if (action.type === actions.columnResizing) {
    const { clientX } = action
    const { startX } = state.columnResizing
    const {
      columnWidth,
      minWidths,
      maxWidths,
      headerIdGridWidths = [],
    } = state.gridLayout

    const deltaX = clientX - startX
    const percentageDeltaX = deltaX / columnWidth

    const newColumnWidths = {}

    headerIdGridWidths.forEach(([headerId, headerWidth]) => {
      newColumnWidths[headerId] = Math.min(
        Math.max(
          minWidths[headerId],
          headerWidth + headerWidth * percentageDeltaX
        ),
        maxWidths[headerId]
      )
    })

    return {
      ...state,
      gridLayout: {
        ...state.gridLayout,
        columnWidths: {
          ...state.gridLayout.columnWidths,
          ...newColumnWidths,
        },
      },
    }
  }

  if (action.type === actions.columnDoneResizing) {
    return {
      ...state,
      gridLayout: {
        ...state.gridLayout,
        startWidths: {},
        minWidths: {},
        maxWidths: {},
      },
    }
  }
}

function getElementWidth(columnId) {
  const width = document.getElementById(`header-cell-${columnId}`)?.offsetWidth

  if (width !== undefined) {
    return width
  }
}
