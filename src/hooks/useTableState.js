import { useState, useMemo } from 'react'

export const defaultState = {}

const defaultReducer = (old, newState) => newState

export const useTableState = (
  initialState = {},
  overrides = {},
  { reducer = defaultReducer, useState: userUseState = useState } = {}
) => {
  let [state, setState] = userUseState({
    ...defaultState,
    ...initialState
  })

  const overriddenState = useMemo(() => {
    const newState = {
      ...state
    }
    Object.keys(overrides).forEach(key => {
      newState[key] = overrides[key]
    })
    return newState
  }, [state, ...Object.values(overrides)])

  const reducedSetState = (updater, type) =>
    setState(old => {
      const newState = updater(old)
      return reducer(old, newState, type)
    })

  return [overriddenState, reducedSetState]
}
