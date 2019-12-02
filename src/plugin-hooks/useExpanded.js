import React from 'react'

import {
  mergeProps,
  applyPropHooks,
  expandRows,
  safeUseLayoutEffect,
} from '../utils'
import { actions, reducerHandlers } from '../hooks/useTable'

const pluginName = 'useExpanded'

// Actions
actions.toggleExpandedByPath = 'toggleExpandedByPath'
actions.resetExpanded = 'resetExpanded'

// Reducer
reducerHandlers[pluginName] = (state, action) => {
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
    const shouldExist = typeof set !== 'undefined' ? expanded : !exists
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

export const useExpanded = hooks => {
  hooks.getExpandedToggleProps = []
  hooks.useMain.push(useMain)
}

useExpanded.pluginName = pluginName

const defaultGetResetExpandedDeps = ({ data }) => [data]

function useMain(instance) {
  const {
    debug,
    rows,
    manualExpandedKey = 'expanded',
    paginateExpandedRows = true,
    expandSubRows = true,
    hooks,
    state: { expanded },
    dispatch,
    getResetExpandedDeps = defaultGetResetExpandedDeps,
  } = instance

  // Bypass any effects from firing when this changes
  const isMountedRef = React.useRef()
  safeUseLayoutEffect(() => {
    if (isMountedRef.current) {
      dispatch({ type: actions.resetExpanded })
    }
    isMountedRef.current = true
  }, [
    dispatch,
    ...(getResetExpandedDeps ? getResetExpandedDeps(instance) : []),
  ])

  const toggleExpandedByPath = (path, expanded) => {
    dispatch({ type: actions.toggleExpandedByPath, path, expanded })
  }

  // use reference to avoid memory leak in #1608
  const instanceRef = React.useRef()
  instanceRef.current = instance

  hooks.prepareRow.push(row => {
    row.toggleExpanded = set => toggleExpandedByPath(row.path, set)
    row.getExpandedToggleProps = props => {
      return mergeProps(
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
        applyPropHooks(
          instanceRef.current.hooks.getExpandedToggleProps,
          row,
          instanceRef.current
        ),
        props
      )
    }
    return row
  })

  const expandedRows = React.useMemo(() => {
    if (process.env.NODE_ENV !== 'production' && debug)
      console.info('getExpandedRows')

    if (paginateExpandedRows) {
      return expandRows(rows, { manualExpandedKey, expanded, expandSubRows })
    }

    return rows
  }, [
    debug,
    paginateExpandedRows,
    rows,
    manualExpandedKey,
    expanded,
    expandSubRows,
  ])

  const expandedDepth = findExpandedDepth(expanded)

  return {
    ...instance,
    toggleExpandedByPath,
    expandedDepth,
    rows: expandedRows,
  }
}

function findExpandedDepth(expanded) {
  let maxDepth = 0

  expanded.forEach(key => {
    const path = key.split('.')
    maxDepth = Math.max(maxDepth, path.length)
  })

  return maxDepth
}
