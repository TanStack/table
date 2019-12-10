import React from 'react'

import {
  actions,
  functionalUpdate,
  useMountedLayoutEffect,
  useGetLatest,
} from '../utils'

// Actions
actions.setRowState = 'setRowState'
actions.resetRowState = 'resetRowState'

export const useRowState = hooks => {
  hooks.stateReducers.push(reducer)
  hooks.useInstance.push(useInstance)
}

useRowState.pluginName = 'useRowState'

function reducer(state, action) {
  if (action.type === actions.init) {
    return {
      rowState: {},
      ...state,
    }
  }

  if (action.type === actions.resetRowState) {
    return {
      ...state,
      rowState: {},
    }
  }

  if (action.type === actions.setRowState) {
    const { path, value } = action

    const pathKey = path.join('.')

    return {
      ...state,
      rowState: {
        ...state.rowState,
        [pathKey]: functionalUpdate(value, state.rowState[pathKey] || {}),
      },
    }
  }
}

function useInstance(instance) {
  const {
    hooks,
    initialRowStateAccessor,
    autoResetRowState = true,
    state: { rowState },
    data,
    dispatch,
  } = instance

  const setRowState = React.useCallback(
    (path, value, columnId) =>
      dispatch({
        type: actions.setRowState,
        path,
        value,
        columnId,
      }),
    [dispatch]
  )

  const setCellState = React.useCallback(
    (rowPath, columnId, value) => {
      return setRowState(
        rowPath,
        old => {
          return {
            ...old,
            cellState: {
              ...old.cellState,
              [columnId]: functionalUpdate(
                value,
                (old.cellState || {})[columnId] || {}
              ),
            },
          }
        },
        columnId
      )
    },
    [setRowState]
  )

  hooks.prepareRow.push(row => {
    const pathKey = row.path.join('.')

    if (row.original) {
      row.state =
        (typeof rowState[pathKey] !== 'undefined'
          ? rowState[pathKey]
          : initialRowStateAccessor && initialRowStateAccessor(row)) || {}

      row.setState = updater => {
        return setRowState(row.path, updater)
      }

      row.cells.forEach(cell => {
        cell.state = row.state.cellState || {}

        cell.setState = updater => {
          return setCellState(row.path, cell.column.id, updater)
        }
      })
    }
  })

  const getAutoResetRowState = useGetLatest(autoResetRowState)

  useMountedLayoutEffect(() => {
    if (getAutoResetRowState()) {
      dispatch({ type: actions.resetRowState })
    }
  }, [data])

  Object.assign(instance, {
    setRowState,
    setCellState,
  })
}
