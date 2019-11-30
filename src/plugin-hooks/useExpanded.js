import React from 'react'

import {
  mergeProps,
  applyPropHooks,
  expandRows,
  safeUseLayoutEffect,
} from '../utils'
import { addActions, actions } from '../actions'
import { defaultState } from '../hooks/useTable'

defaultState.expanded = []

addActions('toggleExpanded', 'useExpanded')

export const useExpanded = hooks => {
  hooks.getExpandedToggleProps = []
  hooks.useMain.push(useMain)
}

useExpanded.pluginName = 'useExpanded'

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
    setState,
    getResetExpandedDeps = defaultGetResetExpandedDeps,
  } = instance

  // Bypass any effects from firing when this changes
  const isMountedRef = React.useRef()
  safeUseLayoutEffect(() => {
    if (isMountedRef.current) {
      setState(
        old => ({
          ...old,
          expanded: [],
        }),
        actions.pageChange
      )
    }
    isMountedRef.current = true
  }, [
    setState,
    ...(getResetExpandedDeps ? getResetExpandedDeps(instance) : []),
  ])

  const toggleExpandedByPath = (path, set) => {
    const key = path.join('.')

    return setState(old => {
      const exists = old.expanded.includes(key)
      const shouldExist = typeof set !== 'undefined' ? set : !exists
      let newExpanded = new Set(old.expanded)

      if (!exists && shouldExist) {
        newExpanded.add(key)
      } else if (exists && !shouldExist) {
        newExpanded.delete(key)
      } else {
        return old
      }

      return {
        ...old,
        expanded: [...newExpanded.values()],
      }
    }, actions.toggleExpanded)
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
    if (process.env.NODE_ENV === 'development' && debug)
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
