import React from 'react'

import {
  actions,
  functionalUpdate,
  mergeProps,
  applyPropHooks,
  useGetLatest,
} from '../utils'

actions.resetHiddenColumns = 'resetHiddenColumns'
actions.toggleHideColumn = 'toggleHideColumn'
actions.setHiddenColumns = 'setHiddenColumns'
actions.toggleHideAllColumns = 'toggleHideAllColumns'

export const useColumnVisibility = hooks => {
  hooks.getToggleHiddenProps = []
  hooks.getToggleHideAllColumnsProps = []

  hooks.stateReducers.push(reducer)
  hooks.useInstanceBeforeDimensions.push(useInstanceBeforeDimensions)
  hooks.headerGroupsDeps.push((deps, instance) => [
    ...deps,
    instance.state.hiddenColumns,
  ])
  hooks.useInstance.push(useInstance)
}

useColumnVisibility.pluginName = 'useColumnVisibility'

function reducer(state, action, previousState, instanceRef) {
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
        ? instanceRef.current.flatColumns.map(d => d.id)
        : [],
    }
  }
}

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

  const getInstance = useGetLatest(instance)

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
        applyPropHooks(getInstance().hooks.getToggleHiddenProps, getInstance()),
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
        getInstance().hooks.getToggleHideAllColumnsProps,
        getInstance()
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
