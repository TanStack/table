import React from 'react'

import {
  actions,
  makePropGetter,
  ensurePluginOrder,
  useGetLatest,
  useMountedLayoutEffect,
  useConsumeHookGetter,
} from '../utils'

const pluginName = 'useRowSelect'

// Actions
actions.resetSelectedRows = 'resetSelectedRows'
actions.toggleRowSelectedAll = 'toggleRowSelectedAll'
actions.toggleRowSelected = 'toggleRowSelected'

export const useRowSelect = hooks => {
  hooks.getToggleRowSelectedProps = [defaultGetToggleRowSelectedProps]
  hooks.getToggleAllRowsSelectedProps = [defaultGetToggleAllRowsSelectedProps]
  hooks.stateReducers.push(reducer)
  hooks.useRows.push(useRows)
  hooks.useInstance.push(useInstance)
}

useRowSelect.pluginName = pluginName

const defaultGetToggleRowSelectedProps = (props, instance, row) => {
  const { manualRowSelectedKey = 'isSelected' } = instance
  let checked = false

  if (row.original && row.original[manualRowSelectedKey]) {
    checked = true
  } else {
    checked = row.isSelected
  }

  return [
    props,
    {
      onChange: e => {
        row.toggleRowSelected(e.target.checked)
      },
      style: {
        cursor: 'pointer',
      },
      checked,
      title: 'Toggle Row Selected',
    },
  ]
}

const defaultGetToggleAllRowsSelectedProps = (props, instance) => [
  props,
  {
    onChange: e => {
      instance.toggleRowSelectedAll(e.target.checked)
    },
    style: {
      cursor: 'pointer',
    },
    checked: instance.isAllRowsSelected,
    title: 'Toggle All Rows Selected',
  },
]

function reducer(state, action, previousState, instanceRef) {
  if (action.type === actions.init) {
    return {
      selectedRowPaths: new Set(),
      ...state,
    }
  }

  if (action.type === actions.resetSelectedRows) {
    return {
      ...state,
      selectedRowPaths: new Set(),
    }
  }

  if (action.type === actions.toggleRowSelectedAll) {
    const { selected } = action
    const { isAllRowsSelected, flatRowPaths } = instanceRef.current

    const selectAll =
      typeof selected !== 'undefined' ? selected : !isAllRowsSelected

    return {
      ...state,
      selectedRowPaths: selectAll ? new Set(flatRowPaths) : new Set(),
    }
  }

  if (action.type === actions.toggleRowSelected) {
    const { path, selected } = action
    const { flatRowPaths } = instanceRef.current

    const key = path.join('.')
    const childRowPrefixKey = [key, '.'].join('')

    // Join the paths of deep rows
    // to make a key, then manage all of the keys
    // in a flat object
    const exists = state.selectedRowPaths.has(key)
    const shouldExist = typeof set !== 'undefined' ? selected : !exists

    let newSelectedRowPaths = new Set(state.selectedRowPaths)

    if (!exists && shouldExist) {
      flatRowPaths.forEach(rowPath => {
        if (rowPath === key || rowPath.startsWith(childRowPrefixKey)) {
          newSelectedRowPaths.add(rowPath)
        }
      })
    } else if (exists && !shouldExist) {
      flatRowPaths.forEach(rowPath => {
        if (rowPath === key || rowPath.startsWith(childRowPrefixKey)) {
          newSelectedRowPaths.delete(rowPath)
        }
      })
    } else {
      return state
    }

    const updateParentRow = (selectedRowPaths, path) => {
      const parentPath = path.slice(0, path.length - 1)
      const parentKey = parentPath.join('.')
      const selected =
        flatRowPaths.filter(rowPath => {
          const path = rowPath
          return (
            path !== parentKey &&
            path.startsWith(parentKey) &&
            !selectedRowPaths.has(path)
          )
        }).length === 0
      if (selected) {
        selectedRowPaths.add(parentKey)
      } else {
        selectedRowPaths.delete(parentKey)
      }
      if (parentPath.length > 1) updateParentRow(selectedRowPaths, parentPath)
    }

    // If the row is a subRow update
    // its parent row to reflect changes
    if (path.length > 1) updateParentRow(newSelectedRowPaths, path)

    return {
      ...state,
      selectedRowPaths: newSelectedRowPaths,
    }
  }
}

function useRows(rows, instance) {
  const {
    state: { selectedRowPaths },
  } = instance

  instance.selectedFlatRows = React.useMemo(() => {
    const selectedFlatRows = []

    rows.forEach(row => {
      row.isSelected = getRowIsSelected(row, selectedRowPaths)

      if (row.isSelected) {
        selectedFlatRows.push(row)
      }
    })

    return selectedFlatRows
  }, [rows, selectedRowPaths])

  return rows
}

function useInstance(instance) {
  const {
    data,
    hooks,
    plugins,
    flatRows,
    autoResetSelectedRows = true,
    state: { selectedRowPaths },
    dispatch,
  } = instance

  ensurePluginOrder(
    plugins,
    ['useFilters', 'useGroupBy', 'useSortBy'],
    'useRowSelect',
    []
  )

  const flatRowPaths = flatRows.map(d => d.path.join('.'))

  let isAllRowsSelected = !!flatRowPaths.length && !!selectedRowPaths.size

  if (isAllRowsSelected) {
    if (flatRowPaths.some(d => !selectedRowPaths.has(d))) {
      isAllRowsSelected = false
    }
  }

  const getAutoResetSelectedRows = useGetLatest(autoResetSelectedRows)

  useMountedLayoutEffect(() => {
    if (getAutoResetSelectedRows()) {
      dispatch({ type: actions.resetSelectedRows })
    }
  }, [dispatch, data])

  const toggleRowSelectedAll = selected =>
    dispatch({ type: actions.toggleRowSelectedAll, selected })

  const toggleRowSelected = (path, selected) =>
    dispatch({ type: actions.toggleRowSelected, path, selected })

  // use reference to avoid memory leak in #1608
  const getInstance = useGetLatest(instance)

  const getToggleAllRowsSelectedPropsHooks = useConsumeHookGetter(
    getInstance().hooks,
    'getToggleAllRowsSelectedProps'
  )

  const getToggleAllRowsSelectedProps = makePropGetter(
    getToggleAllRowsSelectedPropsHooks(),
    getInstance()
  )

  const getToggleRowSelectedPropsHooks = useConsumeHookGetter(
    getInstance().hooks,
    'getToggleRowSelectedProps'
  )

  hooks.prepareRow.push(row => {
    row.toggleRowSelected = set => toggleRowSelected(row.path, set)

    row.getToggleRowSelectedProps = makePropGetter(
      getToggleRowSelectedPropsHooks(),
      getInstance(),
      row
    )
  })

  Object.assign(instance, {
    flatRowPaths,
    toggleRowSelected,
    toggleRowSelectedAll,
    getToggleAllRowsSelectedProps,
    isAllRowsSelected,
  })
}

function getRowIsSelected(row, selectedRowPaths) {
  if (row.isAggregated) {
    return row.subRows.every(subRow =>
      getRowIsSelected(subRow, selectedRowPaths)
    )
  }

  return selectedRowPaths.has(row.path.join('.'))
}
