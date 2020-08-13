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
actions.toggleAllPageRowsSelected = 'toggleAllPageRowsSelected'

export const useRowSelect = hooks => {
  hooks.getToggleRowSelectedProps = [defaultGetToggleRowSelectedProps]
  hooks.getToggleAllRowsSelectedProps = [defaultGetToggleAllRowsSelectedProps]
  hooks.getToggleAllPageRowsSelectedProps = [
    defaultGetToggleAllPageRowsSelectedProps,
  ]
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

const defaultGetToggleAllPageRowsSelectedProps = (props, { instance }) => [
  props,
  {
    onChange(e) {
      instance.toggleAllPageRowsSelected(e.target.checked)
    },
    style: {
      cursor: 'pointer',
    },
    checked: instance.isAllPageRowsSelected,
    title: 'Toggle All Current Page Rows Selected',
    indeterminate: Boolean(
      !instance.isAllPageRowsSelected &&
        instance.page.some(({ id }) => instance.state.selectedRowIds[id])
    ),
  },
]

// eslint-disable-next-line max-params
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
    const {
      isAllRowsSelected,
      rowsById,
      nonGroupedRowsById = rowsById,
    } = instance

    const selectAll =
      typeof setSelected !== 'undefined' ? setSelected : !isAllRowsSelected

    // Only remove/add the rows that are visible on the screen
    //  Leave all the other rows that are selected alone.
    const selectedRowIds = Object.assign({}, state.selectedRowIds)

    if (selectAll) {
      Object.keys(nonGroupedRowsById).forEach(rowId => {
        selectedRowIds[rowId] = true
      })
    } else {
      Object.keys(nonGroupedRowsById).forEach(rowId => {
        delete selectedRowIds[rowId]
      })
    }

    return {
      ...state,
      selectedRowIds,
    }
  }

  if (action.type === actions.toggleRowSelected) {
    const { id, value: setSelected } = action
    const { rowsById, selectSubRows = true, getSubRows } = instance

    // Join the ids of deep rows
    // to make a key, then manage all of the keys
    // in a flat object
    const row = rowsById[id]
    const isSelected = row.isSelected
    const shouldExist =
      typeof setSelected !== 'undefined' ? setSelected : !isSelected

    if (isSelected === shouldExist) {
      return state
    }

    const newSelectedRowIds = { ...state.selectedRowIds }

    const handleRowById = id => {
      const row = rowsById[id]

      if (!row.isGrouped) {
        if (shouldExist) {
          newSelectedRowIds[id] = true
        } else {
          delete newSelectedRowIds[id]
        }
      }

      if (selectSubRows && getSubRows(row)) {
        return getSubRows(row).forEach(row => handleRowById(row.id))
      }
    }

    handleRowById(id)

    return {
      ...state,
      selectedRowIds: newSelectedRowIds,
    }
  }

  if (action.type === actions.toggleAllPageRowsSelected) {
    const { value: setSelected } = action
    const {
      page,
      rowsById,
      selectSubRows = true,
      isAllPageRowsSelected,
      getSubRows,
    } = instance

    const selectAll =
      typeof setSelected !== 'undefined' ? setSelected : !isAllPageRowsSelected

    const newSelectedRowIds = { ...state.selectedRowIds }

    const handleRowById = id => {
      const row = rowsById[id]

      if (!row.isGrouped) {
        if (selectAll) {
          newSelectedRowIds[id] = true
        } else {
          delete newSelectedRowIds[id]
        }
      }

      if (selectSubRows && getSubRows(row)) {
        return getSubRows(row).forEach(row => handleRowById(row.id))
      }
    }

    page.forEach(row => handleRowById(row.id))

    return {
      ...state,
      selectedRowIds: newSelectedRowIds,
    }
  }
  return state
}

function useInstance(instance) {
  const {
    data,
    rows,
    getHooks,
    plugins,
    rowsById,
    nonGroupedRowsById = rowsById,
    autoResetSelectedRows = true,
    state: { selectedRowIds },
    selectSubRows = true,
    dispatch,
    page,
    getSubRows,
  } = instance

  ensurePluginOrder(
    plugins,
    ['useFilters', 'useGroupBy', 'useSortBy', 'useExpanded', 'usePagination'],
    'useRowSelect'
  )

  const selectedFlatRows = React.useMemo(() => {
    const selectedFlatRows = []

    rows.forEach(row => {
      const isSelected = selectSubRows
        ? getRowIsSelected(row, selectedRowIds, getSubRows)
        : !!selectedRowIds[row.id]
      row.isSelected = !!isSelected
      row.isSomeSelected = isSelected === null

      if (isSelected) {
        selectedFlatRows.push(row)
      }
    })

    return selectedFlatRows
  }, [rows, selectSubRows, selectedRowIds, getSubRows])

  let isAllRowsSelected = Boolean(
    Object.keys(nonGroupedRowsById).length && Object.keys(selectedRowIds).length
  )

  let isAllPageRowsSelected = isAllRowsSelected

  if (isAllRowsSelected) {
    if (Object.keys(nonGroupedRowsById).some(id => !selectedRowIds[id])) {
      isAllRowsSelected = false
    }
  }

  if (!isAllRowsSelected) {
    if (page && page.length && page.some(({ id }) => !selectedRowIds[id])) {
      isAllPageRowsSelected = false
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

  const toggleAllPageRowsSelected = React.useCallback(
    value => dispatch({ type: actions.toggleAllPageRowsSelected, value }),
    [dispatch]
  )

  const toggleRowSelected = React.useCallback(
    (id, value) => dispatch({ type: actions.toggleRowSelected, id, value }),
    [dispatch]
  )

  const getInstance = useGetLatest(instance)

  const getToggleAllRowsSelectedProps = makePropGetter(
    getHooks().getToggleAllRowsSelectedProps,
    { instance: getInstance() }
  )

  const getToggleAllPageRowsSelectedProps = makePropGetter(
    getHooks().getToggleAllPageRowsSelectedProps,
    { instance: getInstance() }
  )

  Object.assign(instance, {
    selectedFlatRows,
    isAllRowsSelected,
    isAllPageRowsSelected,
    toggleRowSelected,
    toggleAllRowsSelected,
    getToggleAllRowsSelectedProps,
    getToggleAllPageRowsSelectedProps,
    toggleAllPageRowsSelected,
  })
}

function prepareRow(row, { instance }) {
  row.toggleRowSelected = set => instance.toggleRowSelected(row.id, set)

  row.getToggleRowSelectedProps = makePropGetter(
    instance.getHooks().getToggleRowSelectedProps,
    { instance: instance, row }
  )
}

function getRowIsSelected(row, selectedRowIds, getSubRows) {
  if (selectedRowIds[row.id]) {
    return true
  }

  const subRows = getSubRows(row)

  if (subRows && subRows.length) {
    let allChildrenSelected = true
    let someSelected = false

    subRows.forEach(subRow => {
      // Bail out early if we know both of these
      if (someSelected && !allChildrenSelected) {
        return
      }

      if (getRowIsSelected(subRow, selectedRowIds, getSubRows)) {
        someSelected = true
      } else {
        allChildrenSelected = false
      }
    })
    return allChildrenSelected ? true : someSelected ? null : false
  }

  return false
}
