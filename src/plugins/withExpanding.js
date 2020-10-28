import React from 'react'

import {
  findExpandedDepth,
  expandRows,
  useMountedLayoutEffect,
  makeStateUpdater,
} from '../utils'

import {
  withExpanding as name,
  withColumnVisibility,
  withColumnFilters,
  withGlobalFilter,
  withGrouping,
  withSorting,
} from '../Constants'

export const withExpanding = {
  name,
  after: [
    withColumnVisibility,
    withColumnFilters,
    withGlobalFilter,
    withGrouping,
    withSorting,
  ],
  plugs: {
    useReduceOptions,
    useInstanceAfterState,
    useInstanceAfterDataModel,
    useReduceLeafColumns,
    decorateRow,
  },
}

function useReduceOptions(options) {
  return {
    onExpandedChange: React.useCallback(makeStateUpdater('expanded'), []),
    manualExpandedKey: 'expanded',
    expandSubRows: true,
    ...options,
    initialState: {
      expanded: {},
      ...options.initialState,
    },
  }
}

function useInstanceAfterState(instance) {
  instance.setExpanded = React.useCallback(
    updater => {
      instance.options.onExpandedChange(updater, instance)
    },
    [instance]
  )

  const expandedResetDeps = [instance.options.data]

  React.useMemo(() => {
    if (instance.options.autoResetExpanded) {
      instance.state.expanded = instance.options.initialState.expanded
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, expandedResetDeps)

  useMountedLayoutEffect(() => {
    if (instance.options.autoResetExpanded) {
      instance.resetExpanded()
    }
  }, expandedResetDeps)

  instance.getIsAllRowsExpanded = React.useCallback(() => {
    let isAllRowsExpanded = Boolean(
      Object.keys(instance.rowsById).length &&
        Object.keys(instance.state.expanded).length
    )

    if (isAllRowsExpanded) {
      if (
        Object.keys(instance.rowsById).some(id => !instance.state.expanded[id])
      ) {
        isAllRowsExpanded = false
      }
    }

    return isAllRowsExpanded
  }, [instance.rowsById, instance.state.expanded])

  instance.getExpandedDepth = React.useCallback(
    () => findExpandedDepth(instance.state.expanded),
    [instance.state.expanded]
  )

  instance.toggleRowExpanded = React.useCallback(
    (id, value) => {
      instance.setExpanded(old => {
        const exists = old[id]

        value = typeof value !== 'undefined' ? value : !exists

        if (!exists && value) {
          return {
            ...old,
            [id]: true,
          }
        } else if (exists && !value) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [id]: _, ...rest } = old
          return rest
        } else {
          return old
        }
      })
    },
    [instance]
  )

  instance.toggleAllRowsExpanded = React.useCallback(
    value => {
      const { isAllRowsExpanded, rowsById } = instance

      value = typeof value !== 'undefined' ? value : !isAllRowsExpanded

      if (value) {
        const expanded = {}

        Object.keys(rowsById).forEach(rowId => {
          expanded[rowId] = true
        })

        instance.setExpanded(expanded)
      }
      instance.setExpanded({})
    },
    [instance]
  )

  instance.resetExpanded = React.useCallback(
    () => instance.setExpanded(instance.options.initialState.expanded),
    [instance]
  )

  instance.getToggleAllRowsExpandedProps = (props = {}) => ({
    title: 'Toggle All Rows Expanded',
    ...props,
    onClick: e => {
      instance.toggleAllRowsExpanded()
      if (props.onClick) props.onClick(e)
    },
  })
}

function useInstanceAfterDataModel(instance) {
  const {
    rows,
    state: { expanded },
    options: { paginateExpandedRows },
  } = instance

  const expandedRows = React.useMemo(() => {
    if (expanded) {
      // This is here to trigger the change detection
    }
    if (paginateExpandedRows) {
      if (process.env.NODE_ENV !== 'production' && instance.options.debug)
        console.info('Expanding...')
      return expandRows(rows, instance)
    }
    return rows
  }, [expanded, instance, paginateExpandedRows, rows])

  Object.assign(instance, {
    preExpandedRows: rows,
    expandedRows,
    rows: expandedRows,
  })
}

function useReduceLeafColumns(orderedColumns, { instance }) {
  return React.useMemo(() => {
    if (instance.state.grouping?.length) {
      return [
        orderedColumns.find(d => d.isExpanderColumn),
        ...orderedColumns.filter(d => d && !d.isExpanderColumn),
      ].filter(Boolean)
    }
    return orderedColumns
  }, [instance.state.grouping.length, orderedColumns])
}

useReduceLeafColumns.after = ['withGrouping']

function decorateRow(row, { instance }) {
  row.toggleExpanded = set => instance.toggleRowExpanded(row.id, set)

  row.getIsExpanded = () =>
    (row.original && row.original[instance.options.manualExpandedKey]) ||
    instance.state.expanded[row.id]

  row.getCanExpand = () => row.subRows && !!row.subRows.length

  row.getToggleExpandedProps = (props = {}) => ({
    onClick: e => e.stopPropagation() || row.toggleExpanded(),
    title: 'Toggle Row Expanded',
    ...props,
  })
}
