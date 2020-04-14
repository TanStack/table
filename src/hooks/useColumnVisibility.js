import React from 'react'

import {
  functionalUpdate,
  useGetLatest,
  makePropGetter,
  useMountedLayoutEffect,
} from '../publicUtils'

export const useColumnVisibility = hooks => {
  hooks.getToggleHiddenProps = [defaultGetToggleHiddenProps]
  hooks.getToggleHideAllColumnsProps = [defaultGetToggleHideAllColumnsProps]
  hooks.getInitialState.push(getInitialState)
  hooks.useInstanceBeforeDimensions.push(useInstanceBeforeDimensions)
  hooks.headerGroupsDeps.push((deps, { instance }) => [
    ...deps,
    instance.state.hiddenColumns,
  ])
  hooks.useInstance.push(useInstance)
}

useColumnVisibility.pluginName = 'useColumnVisibility'

const defaultGetToggleHiddenProps = (props, { column }) => [
  props,
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
]

const defaultGetToggleHideAllColumnsProps = (props, { instance }) => [
  props,
  {
    onChange: e => {
      instance.toggleHideAllColumns(!e.target.checked)
    },
    style: {
      cursor: 'pointer',
    },
    checked: !instance.allColumnsHidden && !instance.state.hiddenColumns.length,
    title: 'Toggle All Columns Hidden',
    indeterminate:
      !instance.allColumnsHidden && instance.state.hiddenColumns.length,
  },
]

function getInitialState(state) {
  return {
    hiddenColumns: [],
    ...state,
  }
}

function useInstanceBeforeDimensions(instance) {
  const {
    headers,
    state: { hiddenColumns },
  } = instance

  const isMountedRef = React.useRef(false)

  if (!isMountedRef.current) {
  }

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
}

function useInstance(instance) {
  const {
    columns,
    flatHeaders,
    setState,
    allColumns,
    getHooks,
    state: { hiddenColumns },
    autoResetHiddenColumns = true,
  } = instance

  const getInstance = useGetLatest(instance)

  const allColumnsHidden = allColumns.length === hiddenColumns.length

  const toggleHideColumn = React.useCallback(
    (columnId, value) =>
      setState(old => {
        const should =
          typeof value !== 'undefined'
            ? value
            : !old.hiddenColumns.includes(columnId)

        const hiddenColumns = should
          ? [...old.hiddenColumns, columnId]
          : old.hiddenColumns.filter(d => d !== columnId)

        return {
          ...old,
          hiddenColumns,
        }
      }),
    [setState]
  )

  const setHiddenColumns = React.useCallback(
    value =>
      setState(old => ({
        ...old,
        hiddenColumns: functionalUpdate(value, old.hiddenColumns),
      })),
    [setState]
  )

  const toggleHideAllColumns = React.useCallback(
    value =>
      setState(old => {
        const shouldAll =
          typeof value !== 'undefined' ? value : !old.hiddenColumns.length

        return {
          ...old,
          hiddenColumns: shouldAll
            ? getInstance().allColumns.map(d => d.id)
            : [],
        }
      }),
    [getInstance, setState]
  )

  const getToggleHideAllColumnsProps = makePropGetter(
    getHooks().getToggleHideAllColumnsProps,
    { instance: getInstance() }
  )

  flatHeaders.forEach(column => {
    column.toggleHidden = value => toggleHideColumn(column.id, value)

    column.getToggleHiddenProps = makePropGetter(
      getHooks().getToggleHiddenProps,
      {
        instance: getInstance(),
        column,
      }
    )
  })

  const getAutoResetHiddenColumns = useGetLatest(autoResetHiddenColumns)

  useMountedLayoutEffect(() => {
    if (getAutoResetHiddenColumns()) {
      setState(old => ({
        ...old,
        hiddenColumns: instance.initialState.hiddenColumns || [],
      }))
    }
  }, [setState, columns])

  Object.assign(instance, {
    allColumnsHidden,
    toggleHideColumn,
    setHiddenColumns,
    toggleHideAllColumns,
    getToggleHideAllColumnsProps,
  })
}
