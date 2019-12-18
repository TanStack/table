import React from 'react'

import {
  actions,
  makePropGetter,
  expandRows,
  useMountedLayoutEffect,
  useGetLatest,
} from '../utils'
import { useConsumeHookGetter, functionalUpdate } from '../publicUtils'

// Actions
actions.toggleExpanded = 'toggleExpanded'
actions.toggleAllExpanded = 'toggleAllExpanded'
actions.setExpanded = 'setExpanded'
actions.resetExpanded = 'resetExpanded'

export const useExpanded = hooks => {
  hooks.getExpandedToggleProps = [defaultGetExpandedToggleProps]
  hooks.stateReducers.push(reducer)
  hooks.useInstance.push(useInstance)
}

useExpanded.pluginName = 'useExpanded'

const defaultGetExpandedToggleProps = (props, { row }) => [
  props,
  {
    onClick: e => {
      e.persist()
      row.toggleExpanded()
    },
    style: {
      cursor: 'pointer',
    },
    title: 'Toggle Expanded',
  },
]

// Reducer
function reducer(state, action, previousState, instance) {
  if (action.type === actions.init) {
    return {
      expanded: {},
      ...state,
    }
  }

  if (action.type === actions.resetExpanded) {
    return {
      ...state,
      expanded: instance.initialState.expanded || {},
    }
  }

  if (action.type === actions.setExpanded) {
    return {
      ...state,
      expanded: functionalUpdate(action.expanded, state.expanded),
    }
  }

  if (action.type === actions.toggleExpanded) {
    const { id, expanded: setExpanded } = action
    const exists = state.expanded[id]

    const shouldExist =
      typeof setExpanded !== 'undefined' ? setExpanded : !exists

    if (!exists && shouldExist) {
      return {
        ...state,
        expanded: {
          ...state.expanded,
          [id]: true,
        },
      }
    } else if (exists && !shouldExist) {
      const { [id]: _, ...rest } = state.expanded
      return {
        ...state,
        expanded: rest,
      }
    } else {
      return state
    }
  }
}

function useInstance(instance) {
  const {
    data,
    rows,
    manualExpandedKey = 'expanded',
    paginateExpandedRows = true,
    expandSubRows = true,
    hooks,
    autoResetExpanded = true,
    state: { expanded },
    dispatch,
  } = instance

  const getAutoResetExpanded = useGetLatest(autoResetExpanded)

  // Bypass any effects from firing when this changes
  useMountedLayoutEffect(() => {
    if (getAutoResetExpanded()) {
      dispatch({ type: actions.resetExpanded })
    }
  }, [dispatch, data])

  const toggleExpanded = (id, expanded) => {
    dispatch({ type: actions.toggleExpanded, id, expanded })
  }

  // use reference to avoid memory leak in #1608
  const getInstance = useGetLatest(instance)

  const getExpandedTogglePropsHooks = useConsumeHookGetter(
    getInstance().hooks,
    'getExpandedToggleProps'
  )

  hooks.prepareRow.push(row => {
    row.toggleExpanded = set => instance.toggleExpanded(row.id, set)

    row.getExpandedToggleProps = makePropGetter(getExpandedTogglePropsHooks(), {
      instance: getInstance(),
      row,
    })
  })

  const expandedRows = React.useMemo(() => {
    if (paginateExpandedRows) {
      return expandRows(rows, { manualExpandedKey, expanded, expandSubRows })
    }

    return rows
  }, [paginateExpandedRows, rows, manualExpandedKey, expanded, expandSubRows])

  const expandedDepth = React.useMemo(() => findExpandedDepth(expanded), [
    expanded,
  ])

  Object.assign(instance, {
    preExpandedRows: rows,
    expandedRows,
    rows: expandedRows,
    toggleExpanded,
    expandedDepth,
  })
}

function findExpandedDepth(expanded) {
  let maxDepth = 0

  Object.keys(expanded).forEach(id => {
    const splitId = id.split('.')
    maxDepth = Math.max(maxDepth, splitId.length)
  })

  return maxDepth
}
