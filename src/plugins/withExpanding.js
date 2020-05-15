import React from 'react'

import {
  useGetLatest,
  findExpandedDepth,
  expandRows,
  useMountedLayoutEffect,
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
  useReduceOptions,
  useInstanceAfterState,
  useInstanceAfterDataModel,
  useReduceLeafColumns,
  decorateRow,
}

function useReduceOptions(options) {
  return {
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
  const { setState } = instance

  const getInstance = useGetLatest(instance)

  const expandedResetDeps = [instance.options.data]

  React.useMemo(() => {
    if (getInstance().options.autoResetExpanded) {
      getInstance().state.expanded = getInstance().getInitialState().expanded
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, expandedResetDeps)

  useMountedLayoutEffect(() => {
    if (getInstance().options.autoResetExpanded) {
      instance.resetExpanded()
    }
  }, expandedResetDeps)

  instance.getIsAllRowsExpanded = React.useCallback(() => {
    let isAllRowsExpanded = Boolean(
      Object.keys(getInstance().rowsById).length &&
        Object.keys(getInstance().state.expanded).length
    )

    if (isAllRowsExpanded) {
      if (
        Object.keys(getInstance().rowsById).some(
          id => !getInstance().state.expanded[id]
        )
      ) {
        isAllRowsExpanded = false
      }
    }

    return isAllRowsExpanded
  }, [getInstance])

  instance.getExpandedDepth = React.useCallback(
    () => findExpandedDepth(getInstance().state.expanded),
    [getInstance]
  )

  instance.toggleRowExpanded = React.useCallback(
    (id, value) => {
      setState(
        old => {
          const exists = old.expanded[id]

          value = typeof value !== 'undefined' ? value : !exists

          if (!exists && value) {
            return [
              {
                ...old,
                expanded: {
                  ...old.expanded,
                  [id]: true,
                },
              },
              {
                value,
              },
            ]
          } else if (exists && !value) {
            const { [id]: _, ...rest } = old.expanded
            return [
              {
                ...old,
                expanded: rest,
              },
              {
                value,
              },
            ]
          } else {
            return [old, { value }]
          }
        },
        {
          type: 'toggleRowExpanded',
          id,
        }
      )
    },
    [setState]
  )

  instance.toggleAllRowsExpanded = React.useCallback(
    value =>
      setState(
        old => {
          const { isAllRowsExpanded, rowsById } = getInstance()

          value = typeof value !== 'undefined' ? value : !isAllRowsExpanded

          if (value) {
            const expanded = {}

            Object.keys(rowsById).forEach(rowId => {
              expanded[rowId] = true
            })

            return [
              {
                ...old,
                expanded,
              },
              {
                value,
              },
            ]
          }

          return [
            {
              ...old,
              expanded: {},
            },
            {
              value,
            },
          ]
        },
        {
          type: 'toggleAllRowsExpanded',
        }
      ),
    [getInstance, setState]
  )

  instance.resetExpanded = React.useCallback(
    () =>
      setState(
        old => ({
          ...old,
          expanded: getInstance().getInitialState.expanded,
        }),
        {
          type: 'resetExpanded',
        }
      ),
    [getInstance, setState]
  )

  instance.getToggleAllRowsExpandedProps = (props = {}) => ({
    onClick: e => {
      instance.toggleAllRowsExpanded()
    },
    title: 'Toggle All Rows Expanded',
    ...props,
  })
}

function useInstanceAfterDataModel(instance) {
  const {
    rows,
    state: { expanded },
    options: { paginateExpandedRows },
  } = instance

  const getInstance = useGetLatest(instance)

  const expandedRows = React.useMemo(() => {
    if (expanded) {
      // This is here to trigger the change detection
    }
    if (paginateExpandedRows) {
      if (process.env.NODE_ENV !== 'production' && getInstance().options.debug)
        console.info('Expanding...')
      return expandRows(rows, getInstance)
    }
    return rows
  }, [expanded, getInstance, paginateExpandedRows, rows])

  Object.assign(instance, {
    preExpandedRows: rows,
    expandedRows,
    rows: expandedRows,
  })
}

function useReduceLeafColumns(orderedColumns, { getInstance }) {
  return React.useMemo(() => {
    if (getInstance().state.grouping?.length) {
      return [
        orderedColumns.find(d => d.isExpanderColumn),
        ...orderedColumns.filter(d => d && !d.isExpanderColumn),
      ].filter(Boolean)
    }
    return orderedColumns
  }, [getInstance, orderedColumns])
}

useReduceLeafColumns.after = ['withGrouping']

function decorateRow(row, { getInstance }) {
  row.toggleExpanded = set => getInstance().toggleRowExpanded(row.id, set)

  row.getIsExpanded = () =>
    (row.original && row.original[getInstance().options.manualExpandedKey]) ||
    getInstance().state.expanded[row.id]

  row.getCanExpand = () => row.subRows && !!row.subRows.length

  row.getToggleExpandedProps = (props = {}) => ({
    onClick: e => e.stopPropagation() || row.toggleExpanded(),
    title: 'Toggle Row Expanded',
    ...props,
  })
}
