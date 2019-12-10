import React from 'react'

import {
  actions,
  makePropGetter,
  expandRows,
  useMountedLayoutEffect,
  useGetLatest,
} from '../utils'
import { useConsumeHookGetter } from '../publicUtils'

// Actions
actions.toggleExpandedByPath = 'toggleExpandedByPath'
actions.resetExpanded = 'resetExpanded'

export const useExpanded = hooks => {
  hooks.getExpandedToggleProps = [defaultGetExpandedToggleProps]
  hooks.stateReducers.push(reducer)
  hooks.useInstance.push(useInstance)
}

useExpanded.pluginName = 'useExpanded'

const defaultGetExpandedToggleProps = (props, instance, row) => [
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
function reducer(state, action) {
  if (action.type === actions.init) {
    return {
      expanded: [],
      ...state,
    }
  }

  if (action.type === actions.resetExpanded) {
    return {
      ...state,
      expanded: [],
    }
  }

  if (action.type === actions.toggleExpandedByPath) {
    const { path, expanded } = action
    const key = path.join('.')
    const exists = state.expanded.includes(key)
    const shouldExist = typeof expanded !== 'undefined' ? expanded : !exists
    let newExpanded = new Set(state.expanded)

    if (!exists && shouldExist) {
      newExpanded.add(key)
    } else if (exists && !shouldExist) {
      newExpanded.delete(key)
    } else {
      return state
    }

    return {
      ...state,
      expanded: [...newExpanded.values()],
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

  const toggleExpandedByPath = (path, expanded) => {
    dispatch({ type: actions.toggleExpandedByPath, path, expanded })
  }

  // use reference to avoid memory leak in #1608
  const getInstance = useGetLatest(instance)

  const getExpandedTogglePropsHooks = useConsumeHookGetter(
    getInstance().hooks,
    'getExpandedToggleProps'
  )

  hooks.prepareRow.push(row => {
    row.toggleExpanded = set => instance.toggleExpandedByPath(row.path, set)

    row.getExpandedToggleProps = makePropGetter(
      getExpandedTogglePropsHooks(),
      getInstance(),
      row
    )
  })

  const expandedRows = React.useMemo(() => {
    if (paginateExpandedRows) {
      return expandRows(rows, { manualExpandedKey, expanded, expandSubRows })
    }

    return rows
  }, [paginateExpandedRows, rows, manualExpandedKey, expanded, expandSubRows])

  const expandedDepth = findExpandedDepth(expanded)

  Object.assign(instance, {
    toggleExpandedByPath,
    preExpandedRows: rows,
    expandedRows,
    rows: expandedRows,
    expandedDepth,
  })
}

function findExpandedDepth(expanded) {
  let maxDepth = 0

  expanded.forEach(key => {
    const path = key.split('.')
    maxDepth = Math.max(maxDepth, path.length)
  })

  return maxDepth
}
