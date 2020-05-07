import React from 'react'

import { useGetLatest, functionalUpdate } from '../utils'

export const withColumnOrder = {
  name: 'withColumnOrder',
  after: [],
  useReduceOptions,
  useInstanceAfterState,
}

function useReduceOptions(options) {
  return {
    ...options,
    initialState: {
      columnOrder: [],
      ...options.initialState,
    },
  }
}

function useInstanceAfterState(instance) {
  const { setState } = instance

  const getInstance = useGetLatest(instance)

  instance.resetColumnOrder = React.useCallback(
    () =>
      setState(
        old => ({
          ...old,
          columnOrder: getInstance().initialState.columnOrder || [],
        }),
        {
          type: 'resetColumnOrder',
        }
      ),
    [getInstance, setState]
  )

  instance.setColumnOrder = React.useCallback(
    columnOrder =>
      setState(
        old => ({
          ...old,
          columnOrder: functionalUpdate(columnOrder, old.columnOrder),
        }),
        {
          type: 'setColumnOrder',
        }
      ),
    [setState]
  )
}
