import React from 'react'
//
import { types } from '../actions'

export const defaultState = {}

const defaultReducer = (old, newState) => newState

export const useTableState = (
  initialState = {},
  overrides,
  { reducer = defaultReducer, useState: userUseState = React.useState } = {}
) => {
  let [state, setState] = userUseState({
    ...defaultState,
    ...initialState,
  })

  const overriddenState = React.useMemo(() => {
    const newState = {
      ...state,
    }
    if (overrides) {
      Object.keys(overrides).forEach(key => {
        newState[key] = overrides[key]
      })
    }
    return newState
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overrides, state])

  const reducedSetState = React.useCallback(
    (updater, type) => {
      return setState(old => {
        if (!types[type]) {
          console.info({
            stateUpdaterFn: updater,
            actionType: type,
            currentState: old,
          })
          throw new Error('Detected an unknown table action! (Details Above)')
        }
        const newState = updater(old)
        return reducer(old, newState, type)
      })
    },
    [reducer, setState]
  )

  return React.useMemo(() => [overriddenState, reducedSetState], [
    overriddenState,
    reducedSetState,
  ])
}
