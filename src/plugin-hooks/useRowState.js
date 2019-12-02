import React from 'react'

//

import { actions, reducerHandlers } from '../hooks/useTable'
import { functionalUpdate, safeUseLayoutEffect } from '../utils'

const pluginName = 'useRowState'

// Actions
actions.setRowState = 'setRowState'
actions.resetRowState = 'resetRowState'

// Reducer
reducerHandlers[pluginName] = (state, action) => {
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
        [pathKey]: functionalUpdate(value, state.rowState[pathKey]),
      },
    }
  }
}

export const useRowState = hooks => {
  hooks.useMain.push(useMain)
}

useRowState.pluginName = pluginName

const defaultGetResetRowStateDeps = ({ data }) => [data]

function useMain(instance) {
  const {
    hooks,
    initialRowStateAccessor,
    getResetRowStateDeps = defaultGetResetRowStateDeps,
    state: { rowState },
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
    (rowPath, columnId, updater) => {
      return setRowState(
        rowPath,
        old => {
          return {
            ...old,
            cellState: {
              ...old.cellState,
              [columnId]:
                typeof updater === 'function'
                  ? updater(old.cellState[columnId])
                  : updater,
            },
          }
        },
        columnId
      )
    },
    [setRowState]
  )

  const rowsMountedRef = React.useRef()

  // When data changes, reset row and cell state
  safeUseLayoutEffect(() => {
    if (rowsMountedRef.current) {
      dispatch({ type: actions.resetRowState })
    }

    rowsMountedRef.current = true
  }, [
    dispatch,
    ...(getResetRowStateDeps ? getResetRowStateDeps(instance) : []),
  ])

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

    return row
  })

  return {
    ...instance,
    setRowState,
    setCellState,
  }
}
