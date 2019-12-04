import React from 'react'

import { actions, reducerHandlers, functionalUpdate } from '../utils'

const pluginName = 'useColumnVisibility'

actions.resetColumnVisibility = 'resetColumnVisibility'
actions.setColumnVisibility = 'setColumnVisibility'
actions.toggleColumnVisibility = 'toggleColumnVisibility'

reducerHandlers[pluginName] = (state, action) => {
  if (action.type === actions.init) {
    return {
      columnVisibility: {},
      ...state,
    }
  }

  if (action.type === actions.resetColumnVisibility) {
    return {
      ...state,
      columnVisibility: {},
    }
  }

  if (action.type === actions.setColumnVisibility) {
    if (action.columnId) {
      return {
        ...state,
        columnVisibility: {
          ...state.columnVisibility,
          [action.columnId]: functionalUpdate(
            action.value,
            state.columnVisibility[action.columnId]
          ),
        },
      }
    }

    return {
      ...state,
      columnVisibility: functionalUpdate(action.value, state.columnVisibility),
    }
  }
}

export const useColumnVisibility = hooks => {
  hooks.useInstanceBeforeDimensions.push(useInstanceBeforeDimensions)
  hooks.useInstance.push(useInstance)
}

useColumnVisibility.pluginName = pluginName

function useInstanceBeforeDimensions(instance) {
  const {
    headers,
    state: { columnVisibility },
  } = instance

  const handleColumn = (column, parentVisible) => {
    column.isVisible = parentVisible && columnVisibility[column.id] !== false

    let totalVisibleHeaderCount = 0

    if (column.headers && column.headers.length) {
      column.headers.forEach(
        subColumn =>
          (totalVisibleHeaderCount += handleColumn(subColumn, column.isVisible))
      )
    } else {
      totalVisibleHeaderCount = column.isVisible ? 1 : 0
    }

    column.totalVisibleHeaderCount = totalVisibleHeaderCount

    return totalVisibleHeaderCount
  }

  let totalVisibleHeaderCount = 0

  headers.forEach(
    subHeader => (totalVisibleHeaderCount += handleColumn(subHeader, true))
  )

  return instance
}

function useInstance(instance) {
  const { flatHeaders, dispatch } = instance

  flatHeaders.forEach(column => {
    column.setVisibility = value => {
      dispatch({
        action: actions.setColumnVisibility,
        columnId: column.id,
        value,
      })
    }

    column.toggleColumnVisibility = () =>
      dispatch({ type: actions.toggleColumnVisibility, columnId: column.id })
  })

  const setColumnVisibility = React.useCallback(
    value => dispatch({ type: actions.setColumnVisibility, value }),
    [dispatch]
  )

  return {
    ...instance,
    setColumnVisibility,
  }
}
