import React from 'react'

import { functionalUpdate, useGetLatest } from '../publicUtils'

export const useColumnOrder = hooks => {
  hooks.getInitialState.push(getInitialState)
  hooks.visibleColumnsDeps.push((deps, { instance }) => {
    return [...deps, instance.state.columnOrder]
  })
  hooks.visibleColumns.push(visibleColumns)
  hooks.useInstance.push(useInstance)
}

useColumnOrder.pluginName = 'useColumnOrder'

function getInitialState(state) {
  return {
    columnOrder: [],
    ...state,
  }
}

function visibleColumns(
  columns,
  {
    instance: {
      state: { columnOrder },
    },
  }
) {
  // If there is no order, return the normal columns
  if (!columnOrder || !columnOrder.length) {
    return columns
  }

  const columnOrderCopy = [...columnOrder]

  // If there is an order, make a copy of the columns
  const columnsCopy = [...columns]

  // And make a new ordered array of the columns
  const columnsInOrder = []

  // Loop over the columns and place them in order into the new array
  while (columnsCopy.length && columnOrderCopy.length) {
    const targetColumnId = columnOrderCopy.shift()
    const foundIndex = columnsCopy.findIndex(d => d.id === targetColumnId)
    if (foundIndex > -1) {
      columnsInOrder.push(columnsCopy.splice(foundIndex, 1)[0])
    }
  }

  // If there are any columns left, add them to the end
  return [...columnsInOrder, ...columnsCopy]
}

function useInstance(instance) {
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
