import React from 'react'
import PropTypes from 'prop-types'

import { addActions, actions } from '../actions'
import { defaultState } from '../hooks/useTableState'

defaultState.columnOrder = []

addActions('setColumnOrder')

const propTypes = {
  initialRowStateAccessor: PropTypes.func,
}

export const useColumnOrder = hooks => {
  hooks.columnsBeforeHeaderGroupsDeps.push((deps, instance) => {
    return [...deps, instance.state[0].columnOrder]
  })
  hooks.columnsBeforeHeaderGroups.push(columnsBeforeHeaderGroups)
  hooks.useMain.push(useMain)
}

useColumnOrder.pluginName = 'useColumnOrder'

function columnsBeforeHeaderGroups(columns, instance) {
  const {
    state: [{ columnOrder }],
  } = instance

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
    const targetColumnID = columnOrderCopy.shift()
    const foundIndex = columnsCopy.findIndex(d => d.id === targetColumnID)
    if (foundIndex > -1) {
      columnsInOrder.push(columnsCopy.splice(foundIndex, 1)[0])
    }
  }

  // If there are any columns left, add them to the end
  return [...columnsInOrder, ...columnsCopy]
}

function useMain(instance) {
  PropTypes.checkPropTypes(propTypes, instance, 'property', 'useColumnOrder')

  const {
    state: [, setState],
  } = instance

  const setColumnOrder = React.useCallback(
    updater => {
      return setState(old => {
        return {
          ...old,
          columnOrder:
            typeof updater === 'function' ? updater(old.columnOrder) : updater,
        }
      }, actions.setColumnOrder)
    },
    [setState]
  )

  return {
    ...instance,
    setColumnOrder,
  }
}
