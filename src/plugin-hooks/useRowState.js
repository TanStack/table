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

function reducer(state, action, previousState, instance) {
  if (action.type === actions.init) {
    return {
      rowState: {},
      ...state,
    }
  }

  if (action.type === actions.resetRowState) {
    return {
      ...state,
      rowState: instance.initialState.rowState || {},
    }
  }

  if (action.type === actions.setRowState) {
    const { id, value } = action

    return {
      ...state,
      rowState: {
        ...state.rowState,
        [id]: functionalUpdate(value, state.rowState[id] || {}),
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
    (id, value, columnId) =>
      dispatch({
        type: actions.setRowState,
        id,
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
    if (row.original) {
      row.state =
        (typeof rowState[row.id] !== 'undefined'
          ? rowState[row.id]
          : initialRowStateAccessor && initialRowStateAccessor(row)) || {}

      row.setState = updater => {
        return setRowState(row.id, updater)
      }

      row.cells.forEach(cell => {
        cell.state = row.state.cellState || {}

        cell.setState = updater => {
          return setCellState(row.id, cell.column.id, updater)
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
