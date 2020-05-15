import React from 'react'

import {
  useGetLatest,
  functionalUpdate,
  getFirstDefined,
  buildHeaderGroups,
  recurseHeaderForSpans,
  flattenBy,
} from '../utils'

import {
  withColumnPinning as name,
  withColumnVisibility,
  withColumnOrder,
} from '../Constants'

export const withColumnPinning = {
  name,
  after: [withColumnVisibility, withColumnOrder],
  useReduceOptions,
  useInstanceAfterState,
  decorateColumn,
  useReduceLeafColumns,
  useReduceHeaderGroups,
  useReduceFooterGroups,
  useReduceFlatHeaders,
}

function useReduceOptions(options) {
  return {
    ...options,
    initialState: {
      columnPinning: {
        left: [],
        right: [],
      },
      ...options.initialState,
    },
  }
}

function useInstanceAfterState(instance) {
  const { setState } = instance

  const getInstance = useGetLatest(instance)

  instance.resetColumnPinning = React.useCallback(
    () =>
      setState(
        old => ({
          ...old,
          columnPinning: getInstance().initialState.columnPinning || [],
        }),
        {
          type: 'resetColumnPinning',
        }
      ),
    [getInstance, setState]
  )

  instance.setColumnPinning = React.useCallback(
    columnPinning =>
      setState(
        old => ({
          ...old,
          columnPinning: functionalUpdate(columnPinning, old.columnPinning),
        }),
        {
          type: 'setColumnPinning',
        }
      ),
    [setState]
  )

  instance.toggleColumnPinning = React.useCallback(
    (columnId, side, value) => {
      setState(
        old => {
          const isIncluded = old.columnPinning[side].includes(columnId)

          value = typeof value !== 'undefined' ? value : !isIncluded

          return {
            ...old,
            columnPinning: {
              ...old.columnPinning,
              [side]: value
                ? [...old.columnPinning[side], columnId]
                : old.columnPinning[side].filter(d => d !== columnId),
            },
          }
        },
        {
          type: 'setColumnPinning',
        }
      )
    },
    [setState]
  )

  instance.getColumnCanPin = React.useCallback(
    columnId => {
      const column = getInstance().leafColumns.find(d => d.id === columnId)

      if (!column) {
        return false
      }

      return getFirstDefined(
        getInstance().options.disablePinning ? false : undefined,
        column.disablePinning ? false : undefined,
        column.defaultCanPin,
        !!column.accessor
      )
    },
    [getInstance]
  )

  instance.getColumnIsPinned = React.useCallback(
    columnId =>
      getInstance().state.columnPinning.left.includes(columnId)
        ? 'left'
        : getInstance().state.columnPinning.right.includes(columnId)
        ? 'right'
        : false,
    [getInstance]
  )

  instance.getColumnPinnedIndex = React.useCallback(
    columnId => {
      const side = getInstance().getColumnIsPinned()
      return getInstance().state.columnPinning[side].indexOf(columnId)
    },
    [getInstance]
  )
}

function decorateColumn(column, { getInstance }) {
  column.getCanPin = () => getInstance().getColumnCanPin(column.id)
  column.getPinnedIndex = () => getInstance().getColumnPinnedIndex(column.id)
  column.getIsPinned = () => getInstance().getColumnIsPinned(column.id)
  column.togglePinning = (side, value) =>
    getInstance().toggleColumnPinning(column.id, side, value)
}

function useReduceLeafColumns(leafColumns, { getInstance }) {
  const {
    state: {
      columnPinning: { left, right },
    },
  } = getInstance()

  getInstance().centerLeafColumns = React.useMemo(() => {
    if (left.length || right.length) {
      return leafColumns.filter(
        column => !left.includes(column.id) && !right.includes(column.id)
      )
    }
    return leafColumns
  }, [leafColumns, left, right])

  getInstance().leftLeafColumns = React.useMemo(() => {
    return left
      .map(columnId => leafColumns.find(d => d.id === columnId))
      .filter(Boolean)
  }, [leafColumns, left])

  getInstance().rightLeafColumns = React.useMemo(() => {
    return right
      .map(columnId => leafColumns.find(d => d.id === columnId))
      .filter(Boolean)
  }, [leafColumns, right])

  return leafColumns
}

function useReduceHeaderGroups(headerGroups, { getInstance }) {
  const {
    columns,
    centerLeafColumns,
    leftLeafColumns,
    rightLeafColumns,
  } = getInstance()

  getInstance().centerHeaderGroups = React.useMemo(
    () => buildHeaderGroups(columns, centerLeafColumns, { getInstance }),
    [centerLeafColumns, columns, getInstance]
  )

  getInstance().leftHeaderGroups = React.useMemo(
    () => buildHeaderGroups(columns, leftLeafColumns, { getInstance }),
    [columns, getInstance, leftLeafColumns]
  )

  getInstance().rightHeaderGroups = React.useMemo(
    () => buildHeaderGroups(columns, rightLeafColumns, { getInstance }),
    [columns, getInstance, rightLeafColumns]
  )

  getInstance().centerHeaderGroups[0].headers.forEach(header =>
    recurseHeaderForSpans(header)
  )
  getInstance().leftHeaderGroups[0].headers.forEach(header =>
    recurseHeaderForSpans(header)
  )
  getInstance().rightHeaderGroups[0].headers.forEach(header =>
    recurseHeaderForSpans(header)
  )

  return headerGroups
}

function useReduceFooterGroups(headerGroups, { getInstance }) {
  const {
    centerHeaderGroups,
    leftHeaderGroups,
    rightHeaderGroups,
  } = getInstance()

  getInstance().centerHeaderGroups = React.useMemo(
    () => [...centerHeaderGroups].reverse(),
    [centerHeaderGroups]
  )

  getInstance().leftHeaderGroups = React.useMemo(
    () => [...leftHeaderGroups].reverse(),
    [leftHeaderGroups]
  )

  getInstance().rightHeaderGroups = React.useMemo(
    () => [...rightHeaderGroups].reverse(),
    [rightHeaderGroups]
  )

  return headerGroups
}

function useReduceFlatHeaders(_, { getInstance }) {
  const {
    centerHeaderGroups,
    leftHeaderGroups,
    rightHeaderGroups,
  } = getInstance()

  return flattenBy(
    [...centerHeaderGroups, ...leftHeaderGroups, ...rightHeaderGroups],
    'headers',
    true
  )
}
