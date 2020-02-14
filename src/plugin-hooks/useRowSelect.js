import React from 'react'

import {
  actions,
  makePropGetter,
  ensurePluginOrder,
  useGetLatest,
  useMountedLayoutEffect,
} from '../publicUtils'

const pluginName = 'useRowSelect'

// Actions
actions.resetSelectedRows = 'resetSelectedRows'
actions.toggleAllRowsSelected = 'toggleAllRowsSelected'
actions.toggleRowSelected = 'toggleRowSelected'

export const useRowSelect = hooks => {
  hooks.getToggleRowSelectedProps = [defaultGetToggleRowSelectedProps]
  hooks.getToggleAllRowsSelectedProps = [defaultGetToggleAllRowsSelectedProps]
  hooks.stateReducers.push(reducer)
  hooks.useInstance.push(useInstance)
  hooks.prepareRow.push(prepareRow)
}

useRowSelect.pluginName = pluginName

const defaultGetToggleRowSelectedProps = (props, { instance, row }) => {
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

const defaultGetToggleAllRowsSelectedProps = (props, { instance }) => [
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
      !instance.isAllRowsSelected &&
        Object.keys(instance.state.selectedRowIds).length
    ),
  },
]

function reducer(state, action, previousState, instance) {
  if (action.type === actions.init) {
    return {
      selectedRowIds: {},
      ...state,
    }
  }

  if (action.type === actions.resetSelectedRows) {
    return {
      ...state,
      selectedRowIds: instance.initialState.selectedRowIds || {},
    }
  }

  if (action.type === actions.toggleAllRowsSelected) {
    const { value: setSelected } = action
    const { isAllRowsSelected, flatRowsById } = instance

    const selectAll =
      typeof setSelected !== 'undefined' ? setSelected : !isAllRowsSelected

    if (selectAll) {
      const selectedRowIds = {}

      Object.keys(flatRowsById).forEach(rowId => {
        selectedRowIds[rowId] = true
      })

      return {
        ...state,
        selectedRowIds,
      }
    }

    return {
      ...state,
      selectedRowIds: {},
    }
  }

  if (action.type === actions.toggleRowSelected) {
    const { id, value: setSelected } = action
    const { flatGroupedRowsById } = instance

    // Join the ids of deep rows
    // to make a key, then manage all of the keys
    // in a flat object
    const row = flatGroupedRowsById[id]
    const isSelected = row.isSelected
    const shouldExist =
      typeof setSelected !== 'undefined' ? setSelected : !isSelected

    if (isSelected === shouldExist) {
      return state
    }

    let newSelectedRowIds = { ...state.selectedRowIds }

    const handleRowById = id => {
      const row = flatGroupedRowsById[id]

      if (!row.isGrouped) {
        if (!isSelected && shouldExist) {
          newSelectedRowIds[id] = true
        } else if (isSelected && !shouldExist) {
          delete newSelectedRowIds[id]
        }
      }

      if (row.subRows) {
        return row.subRows.forEach(row => handleRowById(row.id))
      }
    }

    handleRowById(id)

    return {
      ...state,
      selectedRowIds: newSelectedRowIds,
    }
  }
}

function useInstance(instance) {
  const {
    data,
    rows,
    getHooks,
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
    const all = {}
    const grouped = {}

    flatRows.forEach(row => {
      if (!row.isGrouped) {
        all[row.id] = row
      }
      grouped[row.id] = row
    })

    return [all, grouped]
  }, [flatRows])

  const selectedFlatRows = React.useMemo(() => {
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

  let isAllRowsSelected = Boolean(
    Object.keys(flatRowsById).length && Object.keys(selectedRowIds).length
  )

  if (isAllRowsSelected) {
    if (Object.keys(flatRowsById).some(id => !selectedRowIds[id])) {
      isAllRowsSelected = false
    }
  }

  const getAutoResetSelectedRows = useGetLatest(autoResetSelectedRows)

  useMountedLayoutEffect(() => {
    if (getAutoResetSelectedRows()) {
      dispatch({ type: actions.resetSelectedRows })
    }
  }, [dispatch, data])

  const toggleAllRowsSelected = React.useCallback(
    value => dispatch({ type: actions.toggleAllRowsSelected, value }),
    [dispatch]
  )

  const toggleRowSelected = React.useCallback(
    (id, value) =>
      dispatch({ type: actions.toggleRowSelected, id, value }),
    [dispatch]
  )

  const getInstance = useGetLatest(instance)

  const getToggleAllRowsSelectedProps = makePropGetter(
    getHooks().getToggleAllRowsSelectedProps,
    { instance: getInstance() }
  )

  Object.assign(instance, {
    flatRowsById,
    flatGroupedRowsById,
    selectedFlatRows,
    toggleRowSelected,
    toggleAllRowsSelected,
    getToggleAllRowsSelectedProps,
    isAllRowsSelected,
  })
}

function prepareRow(row, { instance }) {
  row.toggleRowSelected = set => instance.toggleRowSelected(row.id, set)

  row.getToggleRowSelectedProps = makePropGetter(
    instance.getHooks().getToggleRowSelectedProps,
    { instance: instance, row }
  )
}

function getRowIsSelected(row, selectedRowIds) {
  if (selectedRowIds[row.id]) {
    return true
  }

  if (row.subRows && row.subRows.length) {
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
