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
actions.toggleAllRowsSelected = 'toggleAllRowsSelected'
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
      indeterminate: row.isSomeSelected,
    },
  ]
}

const defaultGetToggleAllRowsSelectedProps = (props, instance) => [
  props,
  {
    onChange: e => {
      instance.toggleAllRowsSelected(e.target.checked)
    },
    style: {
      cursor: 'pointer',
    },
    checked: instance.isAllRowsSelected,
    title: 'Toggle All Rows Selected',
    indeterminate: Boolean(
      !instance.isAllRowsSelected && instance.state.selectedRowIds.size
    ),
  },
]

function reducer(state, action, previousState, instanceRef) {
  if (action.type === actions.init) {
    return {
      selectedRowIds: new Set(),
      ...state,
    }
  }

  if (action.type === actions.resetSelectedRows) {
    return {
      ...state,
      selectedRowIds: new Set(),
    }
  }

  if (action.type === actions.toggleAllRowsSelected) {
    const { selected } = action
    const { isAllRowsSelected, flatRowsById } = instanceRef.current

    const selectAll =
      typeof selected !== 'undefined' ? selected : !isAllRowsSelected

    return {
      ...state,
      selectedRowIds: selectAll ? new Set(flatRowsById.keys()) : new Set(),
    }
  }

  if (action.type === actions.toggleRowSelected) {
    const { id, selected } = action
    const { flatGroupedRowsById } = instanceRef.current

    // Join the ids of deep rows
    // to make a key, then manage all of the keys
    // in a flat object
    const row = flatGroupedRowsById.get(id)
    const isSelected = row.isSelected
    const shouldExist = typeof set !== 'undefined' ? selected : !isSelected

    if (isSelected === shouldExist) {
      return state
    }

    let newSelectedRowPaths = new Set(state.selectedRowIds)

    const handleRowById = id => {
      const row = flatGroupedRowsById.get(id)

      if (!row.isAggregated) {
        if (!isSelected && shouldExist) {
          newSelectedRowPaths.add(id)
        } else if (isSelected && !shouldExist) {
          newSelectedRowPaths.delete(id)
        }
      }

      if (row.subRows) {
        return row.subRows.forEach(row => handleRowById(row.id))
      }
    }

    handleRowById(id)

    return {
      ...state,
      selectedRowIds: newSelectedRowPaths,
    }
  }
}

function useRows(rows, instance) {
  const {
    state: { selectedRowIds },
  } = instance

  instance.selectedFlatRows = React.useMemo(() => {
    const selectedFlatRows = []

    rows.forEach(row => {
      const isSelected = getRowIsSelected(row, selectedRowIds)
      row.isSelected = !!isSelected
      row.isSomeSelected = isSelected === null

      if (isSelected) {
        selectedFlatRows.push(row)
      }
    })

    return selectedFlatRows
  }, [rows, selectedRowIds])

  return rows
}

function useInstance(instance) {
  const {
    data,
    hooks,
    plugins,
    flatRows,
    autoResetSelectedRows = true,
    state: { selectedRowIds },
    dispatch,
  } = instance

  ensurePluginOrder(
    plugins,
    ['useFilters', 'useGroupBy', 'useSortBy'],
    'useRowSelect',
    []
  )

  const [flatRowsById, flatGroupedRowsById] = React.useMemo(() => {
    const map = new Map()
    const groupedMap = new Map()

    flatRows.forEach(row => {
      if (!row.isAggregated) {
        map.set(row.id, row)
      }
      groupedMap.set(row.id, row)
    })

    return [map, groupedMap]
  }, [flatRows])

  let isAllRowsSelected = Boolean(flatRowsById.size && selectedRowIds.size)

  if (isAllRowsSelected) {
    if ([...flatRowsById.keys()].some(d => !selectedRowIds.has(d))) {
      isAllRowsSelected = false
    }
  }

  const getAutoResetSelectedRows = useGetLatest(autoResetSelectedRows)

  useMountedLayoutEffect(() => {
    if (getAutoResetSelectedRows()) {
      dispatch({ type: actions.resetSelectedRows })
    }
  }, [dispatch, data])

  const toggleAllRowsSelected = selected =>
    dispatch({ type: actions.toggleAllRowsSelected, selected })

  const toggleRowSelected = (id, selected) =>
    dispatch({ type: actions.toggleRowSelected, id, selected })

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
    row.toggleRowSelected = set => toggleRowSelected(row.id, set)

    row.getToggleRowSelectedProps = makePropGetter(
      getToggleRowSelectedPropsHooks(),
      getInstance(),
      row
    )
  })

  Object.assign(instance, {
    flatRowsById,
    flatGroupedRowsById,
    toggleRowSelected,
    toggleAllRowsSelected,
    getToggleAllRowsSelectedProps,
    isAllRowsSelected,
  })
}

function getRowIsSelected(row, selectedRowIds) {
  if (selectedRowIds.has(row.id)) {
    return true
  }

  if (row.isAggregated || (row.subRows && row.subRows.length)) {
    let allChildrenSelected = true
    let someSelected = false

    row.subRows.forEach(subRow => {
      // Bail out early if we know both of these
      if (someSelected && !allChildrenSelected) {
        return
      }

      if (getRowIsSelected(subRow, selectedRowIds)) {
        someSelected = true
      } else {
        allChildrenSelected = false
      }
    })
    return allChildrenSelected ? true : someSelected ? null : false
  }

  return false
}
