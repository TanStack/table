import React from 'react'

import {
  makePropGetter,
  ensurePluginOrder,
  useGetLatest,
  useMountedLayoutEffect,
} from '../publicUtils'

const pluginName = 'useRowSelect'

export const useRowSelect = hooks => {
  hooks.getToggleRowSelectedProps = [defaultGetToggleRowSelectedProps]
  hooks.getToggleAllRowsSelectedProps = [defaultGetToggleAllRowsSelectedProps]
  hooks.getInitialState.push(getInitialState)
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

function getInitialState(state) {
  return {
    selectedRowIds: {},
    ...state,
  }
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
    setState,
  } = instance

  ensurePluginOrder(
    plugins,
    ['useFilters', 'useGroupBy', 'useSortBy'],
    'useRowSelect'
  )

  const getInstance = useGetLatest(instance)

  const selectedFlatRows = React.useMemo(() => {
    const selectedFlatRows = []

    rows.forEach(row => {
      const isSelected = selectSubRows
        ? getRowIsSelected(row, selectedRowIds)
        : !!selectedRowIds[row.id]
      row.isSelected = !!isSelected
      row.isSomeSelected = isSelected === null

      if (isSelected) {
        selectedFlatRows.push(row)
      }
    })

    return selectedFlatRows
  }, [rows, selectSubRows, selectedRowIds])

  let isAllRowsSelected = Boolean(
    Object.keys(nonGroupedRowsById).length && Object.keys(selectedRowIds).length
  )

  if (isAllRowsSelected) {
    if (Object.keys(nonGroupedRowsById).some(id => !selectedRowIds[id])) {
      isAllRowsSelected = false
    }
  }

  const getAutoResetSelectedRows = useGetLatest(autoResetSelectedRows)

  const resetSelectedRows = React.useCallback(
    () =>
      setState(
        old => ({
          ...old,
          selectedRowIds: getInstance().initialState.selectedRowIds || {},
        }),
        {
          type: 'resetSelectedRows',
        }
      ),
    [getInstance, setState]
  )

  const toggleAllRowsSelected = React.useCallback(
    value =>
      setState(
        old => {
          const {
            isAllRowsSelected,
            rowsById,
            nonGroupedRowsById = rowsById,
          } = getInstance()

          value = typeof value !== 'undefined' ? value : !isAllRowsSelected

          // Only remove/add the rows that are visible on the screen
          //  Leave all the other rows that are selected alone.
          const selectedRowIds = Object.assign({}, old.selectedRowIds)

          if (value) {
            Object.keys(nonGroupedRowsById).forEach(rowId => {
              selectedRowIds[rowId] = true
            })
          } else {
            Object.keys(nonGroupedRowsById).forEach(rowId => {
              delete selectedRowIds[rowId]
            })
          }

          return [
            {
              ...old,
              selectedRowIds,
            },
            {
              value,
            },
          ]
        },
        {
          type: 'toggleAllRowsSelected',
        }
      ),
    [getInstance, setState]
  )

  const toggleRowSelected = React.useCallback(
    (id, value) =>
      setState(
        old => {
          const { rowsById, selectSubRows = true } = getInstance()

          // Join the ids of deep rows
          // to make a key, then manage all of the keys
          // in a flat object
          const row = rowsById[id]
          const isSelected = row.isSelected
          value = typeof value !== 'undefined' ? value : !isSelected

          if (isSelected === value) {
            return old
          }

          const newSelectedRowIds = { ...old.selectedRowIds }

          const handleRowById = id => {
            const row = rowsById[id]

            if (!row.isGrouped) {
              if (value) {
                newSelectedRowIds[id] = true
              } else {
                delete newSelectedRowIds[id]
              }
            }

            if (selectSubRows && row.subRows) {
              return row.subRows.forEach(row => handleRowById(row.id))
            }
          }

          handleRowById(id)

          return [
            {
              ...old,
              selectedRowIds: newSelectedRowIds,
            },
            {
              value,
            },
          ]
        },
        {
          type: 'toggleRowSelected',
        }
      ),
    [getInstance, setState]
  )

  const getToggleAllRowsSelectedProps = makePropGetter(
    getHooks().getToggleAllRowsSelectedProps,
    { instance: getInstance() }
  )

  useMountedLayoutEffect(() => {
    if (getAutoResetSelectedRows()) {
      resetSelectedRows()
    }
  }, [resetSelectedRows, data])

  Object.assign(instance, {
    selectedFlatRows,
    isAllRowsSelected,
    toggleRowSelected,
    toggleAllRowsSelected,
    getToggleAllRowsSelectedProps,
    resetSelectedRows,
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
