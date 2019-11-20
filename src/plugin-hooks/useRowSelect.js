import React from 'react'

import {
  mergeProps,
  applyPropHooks,
  ensurePluginOrder,
  safeUseLayoutEffect,
} from '../utils'
import { addActions, actions } from '../actions'
import { defaultState } from '../hooks/useTable'

defaultState.selectedRowPaths = []

addActions('toggleRowSelected', 'toggleRowSelectedAll')

export const useRowSelect = hooks => {
  hooks.getToggleRowSelectedProps = []
  hooks.getToggleAllRowsSelectedProps = []
  hooks.useRows.push(useRows)
  hooks.useMain.push(useMain)
}

useRowSelect.pluginName = 'useRowSelect'

function useRows(rows, instance) {
  const {
    state: { selectedRowPaths },
  } = instance

  instance.selectedFlatRows = React.useMemo(() => {
    const selectedFlatRows = []
    rows.forEach(row => {
      if (row.isAggregated) {
        const subRowPaths = row.subRows.map(row => row.path)
        row.isSelected = subRowPaths.every(path =>
          selectedRowPaths.includes(path.join('.'))
        )
      } else {
        row.isSelected = selectedRowPaths.includes(row.path.join('.'))
      }
      if (row.isSelected) {
        selectedFlatRows.push(row)
      }
    })

    return selectedFlatRows
  }, [rows, selectedRowPaths])

  return rows
}

const defaultGetResetSelectedRowPathsDeps = ({ rows }) => [rows]

function useMain(instance) {
  const {
    hooks,
    manualRowSelectedKey = 'isSelected',
    plugins,
    flatRows,
    getResetSelectedRowPathsDeps = defaultGetResetSelectedRowPathsDeps,
    state: { selectedRowPaths },
    setState,
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
      setState(
        old => ({
          ...old,
          selectedRowPaths: [],
        }),
        actions.pageChange
      )
    }
    isMountedRef.current = true
  }, [
    setState,
    ...(getResetSelectedRowPathsDeps
      ? getResetSelectedRowPathsDeps(instance)
      : []),
  ])

  const toggleRowSelectedAll = set => {
    setState(old => {
      const selectAll = typeof set !== 'undefined' ? set : !isAllRowsSelected
      return {
        ...old,
        selectedRowPaths: selectAll ? flatRowPaths : [],
      }
    }, actions.toggleRowSelectedAll)
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

  const toggleRowSelected = (path, set) => {
    const key = path.join('.')
    const childRowPrefixKey = [key, '.'].join('')

    return setState(old => {
      // Join the paths of deep rows
      // to make a key, then manage all of the keys
      // in a flat object
      const exists = old.selectedRowPaths.includes(key)
      const shouldExist = typeof set !== 'undefined' ? set : !exists
      let newSelectedRows = new Set(old.selectedRowPaths)

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
        return old
      }

      // If the row is a subRow update
      // its parent row to reflect changes
      if (path.length > 1) updateParentRow(newSelectedRows, path)

      return {
        ...old,
        selectedRowPaths: [...newSelectedRows.values()],
      }
    }, actions.toggleRowSelected)
  }

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
      applyPropHooks(instance.hooks.getToggleAllRowsSelectedProps, instance),
      props
    )
  }

  hooks.prepareRow.push(row => {
    // Aggregate rows have entirely different select logic
    if (row.isAggregated) {
      const subRowPaths = row.subRows.map(row => row.path)
      row.toggleRowSelected = set => {
        set = typeof set !== 'undefined' ? set : !row.isSelected
        subRowPaths.forEach(path => {
          toggleRowSelected(path, set)
        })
      }
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
            instance.hooks.getToggleRowSelectedProps,
            row,
            instance
          ),
          props
        )
      }
    } else {
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
            instance.hooks.getToggleRowSelectedProps,
            row,
            instance
          ),
          props
        )
      }
    }

    return row
  })

  return {
    ...instance,
    toggleRowSelected,
    toggleRowSelectedAll,
    getToggleAllRowsSelectedProps,
    isAllRowsSelected,
  }
}
