import React from 'react'

import {
  mergeProps,
  applyPropHooks,
  ensurePluginOrder,
  safeUseLayoutEffect,
} from '../utils'
import { actions, reducerHandlers } from '../hooks/useTable'

const pluginName = 'useRowSelect'

// Actions
actions.resetSelectedRows = 'resetSelectedRows'
actions.toggleRowSelectedAll = 'toggleRowSelectedAll'
actions.toggleRowSelected = 'toggleRowSelected'

// Reducer
reducerHandlers[pluginName] = (state, action) => {
  if (action.type === actions.init) {
    return {
      selectedRowPaths: [],
      ...state,
    }
  }

  if (action.type === actions.resetSelectedRows) {
    return {
      ...state,
      selectedRowPaths: [],
    }
  }

  if (action.type === actions.toggleRowSelectedAll) {
    const {
      selected,
      instanceRef: {
        current: { isAllRowsSelected, flatRowPaths },
      },
    } = action

    const selectAll =
      typeof selected !== 'undefined' ? selected : !isAllRowsSelected

    return {
      ...state,
      selectedRowPaths: selectAll ? flatRowPaths : [],
    }
  }

  if (action.type === actions.toggleRowSelected) {
    const {
      path,
      selected,
      instanceRef: {
        current: { flatRowPaths },
      },
    } = action

    const key = path.join('.')
    const childRowPrefixKey = [key, '.'].join('')

    // Join the paths of deep rows
    // to make a key, then manage all of the keys
    // in a flat object
    const exists = state.selectedRowPaths.includes(key)
    const shouldExist = typeof set !== 'undefined' ? selected : !exists
    let newSelectedRows = new Set(state.selectedRowPaths)

    if (!exists && shouldExist) {
      flatRowPaths.forEach(rowPath => {
        if (rowPath === key || rowPath.startsWith(childRowPrefixKey)) {
          newSelectedRows.add(rowPath)
        }
      })
    } else if (exists && !shouldExist) {
      flatRowPaths.forEach(rowPath => {
        if (rowPath === key || rowPath.startsWith(childRowPrefixKey)) {
          newSelectedRows.delete(rowPath)
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
    if (path.length > 1) updateParentRow(newSelectedRows, path)

    return {
      ...state,
      selectedRowPaths: [...newSelectedRows.values()],
    }
  }
}

export const useRowSelect = hooks => {
  hooks.getToggleRowSelectedProps = []
  hooks.getToggleAllRowsSelectedProps = []
  hooks.useRows.push(useRows)
  hooks.useMain.push(useMain)
}

useRowSelect.pluginName = pluginName

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

const defaultGetResetSelectedRowPathsDeps = ({ data }) => [data]

function useMain(instance) {
  const {
    hooks,
    manualRowSelectedKey = 'isSelected',
    plugins,
    flatRows,
    getResetSelectedRowPathsDeps = defaultGetResetSelectedRowPathsDeps,
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

  let isAllRowsSelected = !!flatRowPaths.length && !!selectedRowPaths.length

  if (isAllRowsSelected) {
    if (flatRowPaths.some(d => !selectedRowPaths.includes(d))) {
      isAllRowsSelected = false
    }
  }

  // Bypass any effects from firing when this changes
  const isMountedRef = React.useRef()
  safeUseLayoutEffect(() => {
    if (isMountedRef.current) {
      dispatch({ type: actions.resetSelectedRows })
    }
    isMountedRef.current = true
  }, [
    dispatch,
    ...(getResetSelectedRowPathsDeps
      ? getResetSelectedRowPathsDeps(instance)
      : []),
  ])

  const toggleRowSelectedAll = selected =>
    dispatch({ type: actions.toggleRowSelectedAll, selected })

  const toggleRowSelected = (path, selected) =>
    dispatch({ type: actions.toggleRowSelected, path, selected })

  // use reference to avoid memory leak in #1608
  const instanceRef = React.useRef()
  instanceRef.current = instance

  const getToggleAllRowsSelectedProps = props => {
    return mergeProps(
      {
        onChange: e => {
          toggleRowSelectedAll(e.target.checked)
        },
        style: {
          cursor: 'pointer',
        },
        checked: isAllRowsSelected,
        title: 'Toggle All Rows Selected',
      },
      applyPropHooks(
        instanceRef.current.hooks.getToggleAllRowsSelectedProps,
        instanceRef.current
      ),
      props
    )
  }

  hooks.prepareRow.push(row => {
    row.toggleRowSelected = set => toggleRowSelected(row.path, set)
    row.getToggleRowSelectedProps = props => {
      let checked = false

      if (row.original && row.original[manualRowSelectedKey]) {
        checked = true
      } else {
        checked = row.isSelected
      }

      return mergeProps(
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
        applyPropHooks(
          instanceRef.current.hooks.getToggleRowSelectedProps,
          row,
          instanceRef.current
        ),
        props
      )
    }

    return row
  })

  return {
    ...instance,
    flatRowPaths,
    toggleRowSelected,
    toggleRowSelectedAll,
    getToggleAllRowsSelectedProps,
    isAllRowsSelected,
  }
}

function getRowIsSelected(row, selectedRowPaths) {
  if (row.isAggregated) {
    return row.subRows.every(subRow =>
      getRowIsSelected(subRow, selectedRowPaths)
    )
  }

  return selectedRowPaths.includes(row.path.join('.'))
}
