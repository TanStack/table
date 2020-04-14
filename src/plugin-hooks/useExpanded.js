import React from 'react'

import { expandRows } from '../utils'

import {
  useGetLatest,
  useMountedLayoutEffect,
  makePropGetter,
  ensurePluginOrder,
} from '../publicUtils'

export const useExpanded = hooks => {
  hooks.getToggleAllRowsExpandedProps = [defaultGetToggleAllRowsExpandedProps]
  hooks.getToggleRowExpandedProps = [defaultGetToggleRowExpandedProps]
  hooks.getInitialState.push(getInitialState)
  hooks.useInstance.push(useInstance)
  hooks.prepareRow.push(prepareRow)
}

useExpanded.pluginName = 'useExpanded'

const defaultGetToggleAllRowsExpandedProps = (props, { instance }) => [
  props,
  {
    onClick: e => {
      instance.toggleAllRowsExpanded()
    },
    style: {
      cursor: 'pointer',
    },
    title: 'Toggle All Rows Expanded',
  },
]

const defaultGetToggleRowExpandedProps = (props, { row }) => [
  props,
  {
    onClick: () => {
      row.toggleRowExpanded()
    },
    style: {
      cursor: 'pointer',
    },
    title: 'Toggle Row Expanded',
  },
]

// Reducer
function getInitialState(state) {
  return {
    expanded: {},
    ...state,
  }
}

function useInstance(instance) {
  const {
    data,
    rows,
    rowsById,
    manualExpandedKey = 'expanded',
    paginateExpandedRows = true,
    expandSubRows = true,
    autoResetExpanded = true,
    getHooks,
    plugins,
    state: { expanded },
    setState,
  } = instance

  ensurePluginOrder(
    plugins,
    ['useSortBy', 'useGroupBy', 'usePivotColumns', 'useGlobalFilter'],
    'useExpanded'
  )

  const getAutoResetExpanded = useGetLatest(autoResetExpanded)
  const getInstance = useGetLatest(instance)

  let isAllRowsExpanded = Boolean(
    Object.keys(rowsById).length && Object.keys(expanded).length
  )

  if (isAllRowsExpanded) {
    if (Object.keys(rowsById).some(id => !expanded[id])) {
      isAllRowsExpanded = false
    }
  }

  const resetExpanded = React.useCallback(
    () =>
      setState(old => ({
        ...old,
        expanded: getInstance().initialState.expanded || {},
      })),
    [getInstance, setState]
  )

  // Bypass any effects from firing when this changes
  useMountedLayoutEffect(() => {
    if (getAutoResetExpanded()) {
      resetExpanded()
    }
  }, [resetExpanded, data])

  const toggleRowExpanded = React.useCallback(
    (id, value) => {
      setState(old => {
        const exists = old.expanded[id]

        const shouldExist = typeof value !== 'undefined' ? value : !exists

        if (!exists && shouldExist) {
          return {
            ...old,
            expanded: {
              ...old.expanded,
              [id]: true,
            },
          }
        } else if (exists && !shouldExist) {
          const { [id]: _, ...rest } = old.expanded
          return {
            ...old,
            expanded: rest,
          }
        } else {
          return old
        }
      })
    },
    [setState]
  )

  const toggleAllRowsExpanded = React.useCallback(
    value =>
      setState(old => {
        const { isAllRowsExpanded, rowsById } = getInstance()

        const expandAll =
          typeof value !== 'undefined' ? value : !isAllRowsExpanded

        if (expandAll) {
          const expanded = {}

          Object.keys(rowsById).forEach(rowId => {
            expanded[rowId] = true
          })

          return {
            ...old,
            expanded,
          }
        }

        return {
          ...old,
          expanded: {},
        }
      }),
    [getInstance, setState]
  )

  const expandedRows = React.useMemo(() => {
    if (paginateExpandedRows) {
      return expandRows(rows, { manualExpandedKey, expanded, expandSubRows })
    }

    return rows
  }, [paginateExpandedRows, rows, manualExpandedKey, expanded, expandSubRows])

  const expandedDepth = React.useMemo(() => findExpandedDepth(expanded), [
    expanded,
  ])

  const getToggleAllRowsExpandedProps = makePropGetter(
    getHooks().getToggleAllRowsExpandedProps,
    { instance: getInstance() }
  )

  Object.assign(instance, {
    preExpandedRows: rows,
    expandedRows,
    rows: expandedRows,
    expandedDepth,
    isAllRowsExpanded,
    toggleRowExpanded,
    toggleAllRowsExpanded,
    getToggleAllRowsExpandedProps,
  })
}

function prepareRow(row, { instance: { getHooks }, instance }) {
  row.toggleRowExpanded = set => instance.toggleRowExpanded(row.id, set)

  row.getToggleRowExpandedProps = makePropGetter(
    getHooks().getToggleRowExpandedProps,
    {
      instance,
      row,
    }
  )
}

function findExpandedDepth(expanded) {
  let maxDepth = 0

  Object.keys(expanded).forEach(id => {
    const splitId = id.split('.')
    maxDepth = Math.max(maxDepth, splitId.length)
  })

  return maxDepth
}
