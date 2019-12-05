import React from 'react'

import {
  actions,
  reducerHandlers,
  functionalUpdate,
  mergeProps,
  applyPropHooks,
} from '../utils'

const pluginName = 'useColumnVisibility'

actions.resetHiddenColumns = 'resetHiddenColumns'
actions.toggleHideColumn = 'toggleHideColumn'
actions.setHiddenColumns = 'setHiddenColumns'
actions.toggleHideAllColumns = 'toggleHideAllColumns'

reducerHandlers[pluginName] = (state, action) => {
  if (action.type === actions.init) {
    return {
      hiddenColumns: [],
      ...state,
    }
  }

  if (action.type === actions.resetHiddenColumns) {
    return {
      ...state,
      hiddenColumns: [],
    }
  }

  if (action.type === actions.toggleHideColumn) {
    const should =
      typeof action.value !== 'undefined'
        ? action.value
        : !state.hiddenColumns.includes(action.columnId)

    const hiddenColumns = should
      ? [...state.hiddenColumns, action.columnId]
      : state.hiddenColumns.filter(d => d !== action.columnId)

    return {
      ...state,
      hiddenColumns,
    }
  }

  if (action.type === actions.setHiddenColumns) {
    return {
      ...state,
      hiddenColumns: functionalUpdate(action.value, state.hiddenColumns),
    }
  }

  if (action.type === actions.toggleHideAllColumns) {
    const shouldAll =
      typeof action.value !== 'undefined'
        ? action.value
        : !state.hiddenColumns.length

    return {
      ...state,
      hiddenColumns: shouldAll
        ? action.instanceRef.current.flatColumns.map(d => d.id)
        : [],
    }
  }
}

export const useColumnVisibility = hooks => {
  hooks.columnsBeforeHeaderGroupsDeps.push((deps, instance) => [
    ...deps,
    instance.state.hiddenColumns,
  ])
  hooks.useInstanceBeforeDimensions.push(useInstanceBeforeDimensions)
  hooks.useInstance.push(useInstance)
  hooks.getToggleHiddenProps = []
  hooks.getToggleHideAllColumnsProps = []
}

useColumnVisibility.pluginName = pluginName

function useInstanceBeforeDimensions(instance) {
  const {
    headers,
    state: { hiddenColumns },
  } = instance

  const handleColumn = (column, parentVisible) => {
    column.isVisible = parentVisible && !hiddenColumns.includes(column.id)

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
  const {
    flatHeaders,
    dispatch,
    flatColumns,
    state: { hiddenColumns },
  } = instance

  const instanceRef = React.useRef()
  instanceRef.current = instance

  const allColumnsHidden = flatColumns.length === hiddenColumns.length

  flatHeaders.forEach(column => {
    column.toggleHidden = value => {
      dispatch({
        type: actions.toggleHideColumn,
        columnId: column.id,
        value,
      })
    }

    column.getToggleHiddenProps = props => {
      return mergeProps(
        {
          onChange: e => {
            column.toggleHidden(!e.target.checked)
          },
          style: {
            cursor: 'pointer',
          },
          checked: column.isVisible,
          title: 'Toggle Column Visible',
        },
        applyPropHooks(
          instanceRef.current.hooks.getToggleHiddenProps,
          instanceRef.current
        ),
        props
      )
    }
  })

  const toggleHideColumn = React.useCallback(
    (columnId, value) =>
      dispatch({ type: actions.toggleHideColumn, columnId, value }),
    [dispatch]
  )

  const setHiddenColumns = React.useCallback(
    value => dispatch({ type: actions.setHiddenColumns, value }),
    [dispatch]
  )

  const toggleHideAllColumns = React.useCallback(
    value => dispatch({ type: actions.toggleHideAllColumns, value }),
    [dispatch]
  )

  const getToggleHideAllColumnsProps = props => {
    return mergeProps(
      {
        onChange: e => {
          toggleHideAllColumns(!e.target.checked)
        },
        style: {
          cursor: 'pointer',
        },
        checked: !allColumnsHidden && !hiddenColumns.length,
        title: 'Toggle All Columns Hidden',
        indeterminate: !allColumnsHidden && hiddenColumns.length,
      },
      applyPropHooks(
        instanceRef.current.hooks.getToggleHideAllColumnsProps,
        instanceRef.current
      ),
      props
    )
  }

  return {
    ...instance,
    toggleHideColumn,
    setHiddenColumns,
    toggleHideAllColumns,
    getToggleHideAllColumnsProps,
  }
}
