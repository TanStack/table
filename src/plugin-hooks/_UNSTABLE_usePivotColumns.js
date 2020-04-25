/* istanbul ignore file */
import React from 'react'

import {
  makePropGetter,
  ensurePluginOrder,
  useMountedLayoutEffect,
  useGetLatest,
} from '../utils'

import { flattenColumns, getFirstDefined } from '../utils'

export const _UNSTABLE_usePivotColumns = hooks => {
  hooks.getPivotToggleProps = [defaultGetPivotToggleProps]
  hooks.getInitialState.push(getInitialState)
  hooks.useInstanceAfterData.push(useInstanceAfterData)
  hooks.flatColumns.push(flatColumns)
  hooks.accessValue.push(accessValue)
  hooks.materializedColumns.push(materializedColumns)
  hooks.materializedColumnsDeps.push(materializedColumnsDeps)
  hooks.visibleColumns.push(visibleColumns)
  hooks.visibleColumnsDeps.push(visibleColumnsDeps)
  hooks.useInstance.push(useInstance)
  hooks.prepareRow.push(prepareRow)
}

_UNSTABLE_usePivotColumns.pluginName = 'usePivotColumns'

const defaultPivotColumns = []

const defaultGetPivotToggleProps = (props, { header }) => [
  props,
  {
    onClick: header.canPivot
      ? e => {
          e.persist()
          header.togglePivot()
        }
      : undefined,
    style: {
      cursor: header.canPivot ? 'pointer' : undefined,
    },
    title: 'Toggle Pivot',
  },
]

function getInitialState(state) {
  return {
    pivotColumns: defaultPivotColumns,
    ...state,
  }
}

function useInstanceAfterData(instance) {
  instance.flatColumns.forEach(column => {
    column.isPivotSource = instance.state.pivotColumns.includes(column.id)
  })
}

function flatColumns(columns, { instance }) {
  columns.forEach(column => {
    column.isPivotSource = instance.state.pivotColumns.includes(column.id)
    column.uniqueValues = new Set()
  })
  return columns
}

function accessValue(value, { column }) {
  if (column.uniqueValues && typeof value !== 'undefined') {
    column.uniqueValues.add(value)
  }
  return value
}

function materializedColumns(materialized, { instance }) {
  const { flatColumns, state } = instance

  if (!state.pivotColumns.length || !state.grouping || !state.grouping.length) {
    return materialized
  }

  const pivotColumns = state.pivotColumns
    .map(id => flatColumns.find(d => d.id === id))
    .filter(Boolean)

  const sourceColumns = flatColumns.filter(
    d =>
      !d.isPivotSource &&
      !state.grouping.includes(d.id) &&
      !state.pivotColumns.includes(d.id)
  )

  const buildPivotColumns = (depth = 0, parent, pivotFilters = []) => {
    const pivotColumn = pivotColumns[depth]

    if (!pivotColumn) {
      return sourceColumns.map(sourceColumn => {
        // TODO: We could offer support here for renesting pivoted
        // columns inside copies of their header groups. For now,
        // that seems like it would be (1) overkill on nesting, considering
        // you already get nesting for every pivot level and (2)
        // really hard. :)

        return {
          ...sourceColumn,
          canPivot: false,
          isPivoted: true,
          parent,
          depth: depth,
          id: `${parent ? `${parent.id}.${sourceColumn.id}` : sourceColumn.id}`,
          accessor: (originalRow, i, row) => {
            if (pivotFilters.every(filter => filter(row))) {
              return row.values[sourceColumn.id]
            }
          },
        }
      })
    }

    const uniqueValues = Array.from(pivotColumn.uniqueValues).sort()

    return uniqueValues.map(uniqueValue => {
      const columnGroup = {
        ...pivotColumn,
        Header:
          pivotColumn.PivotHeader || typeof pivotColumn.header === 'string'
            ? `${pivotColumn.Header}: ${uniqueValue}`
            : uniqueValue,
        isPivotGroup: true,
        parent,
        depth,
        id: parent
          ? `${parent.id}.${pivotColumn.id}.${uniqueValue}`
          : `${pivotColumn.id}.${uniqueValue}`,
        pivotValue: uniqueValue,
      }

      columnGroup.columns = buildPivotColumns(depth + 1, columnGroup, [
        ...pivotFilters,
        row => row.values[pivotColumn.id] === uniqueValue,
      ])

      return columnGroup
    })
  }

  const newMaterialized = flattenColumns(buildPivotColumns())

  return [...materialized, ...newMaterialized]
}

function materializedColumnsDeps(
  deps,
  {
    instance: {
      state: { pivotColumns, grouping },
    },
  }
) {
  return [...deps, pivotColumns, grouping]
}

function visibleColumns(visibleColumns, { instance: { state } }) {
  visibleColumns = visibleColumns.filter(d => !d.isPivotSource)

  if (state.pivotColumns.length && state.grouping && state.grouping.length) {
    visibleColumns = visibleColumns.filter(
      column => column.getIsGrouped() || column.getIsPivoted()
    )
  }

  return visibleColumns
}

function visibleColumnsDeps(deps, { instance }) {
  return [...deps, instance.state.pivotColumns, instance.state.grouping]
}

function useInstance(instance) {
  const {
    columns,
    flatColumns,
    flatHeaders,
    // pivotFn = defaultPivotFn,
    // manualPivot,
    getHooks,
    plugins,
    setState,
    autoResetPivot = true,
    manaulPivot,
    disablePivot,
    defaultCanPivot,
  } = instance

  ensurePluginOrder(plugins, ['useGrouping'], 'usePivotColumns')

  const getInstance = useGetLatest(instance)

  flatColumns.forEach(column => {
    const {
      accessor,
      defaultPivot: defaultColumnPivot,
      disablePivot: columnDisablePivot,
    } = column

    column.canPivot = accessor
      ? getFirstDefined(
          column.canPivot,
          columnDisablePivot === true ? false : undefined,
          disablePivot === true ? false : undefined,
          true
        )
      : getFirstDefined(
          column.canPivot,
          defaultColumnPivot,
          defaultCanPivot,
          false
        )

    if (column.canPivot) {
      column.togglePivot = () => instance.togglePivot(column.id)
    }

    column.Aggregated = column.Aggregated || column.Cell
  })

  const togglePivot = (columnId, value) =>
    setState(
      old => {
        value =
          typeof value !== 'undefined'
            ? value
            : !old.pivotColumns.includes(columnId)

        if (value) {
          return [
            {
              ...old,
              pivotColumns: [...old.pivotColumns, columnId],
            },
            {
              value,
            },
          ]
        }

        return [
          {
            ...old,
            pivotColumns: old.pivotColumns.filter(d => d !== columnId),
          },
          {
            value,
          },
        ]
      },
      { type: 'togglePivot', columnId }
    )

  flatHeaders.forEach(header => {
    header.getPivotToggleProps = makePropGetter(
      getHooks().getPivotToggleProps,
      {
        instance: getInstance(),
        header,
      }
    )
  })

  const resetPivot = React.useCallback(
    () =>
      setState(
        old => ({
          ...old,
          pivotColumns:
            getInstance().initialState.pivotColumns || defaultPivotColumns,
        }),
        {
          type: 'resetPivot',
        }
      ),
    [getInstance, setState]
  )

  const getAutoResetPivot = useGetLatest(autoResetPivot)

  useMountedLayoutEffect(() => {
    if (getAutoResetPivot()) {
      resetPivot()
    }
  }, [resetPivot, manaulPivot ? null : columns])

  Object.assign(instance, {
    togglePivot,
    resetPivot,
  })
}

function prepareRow(row) {
  row.allCells.forEach(cell => {
    // Grouped cells are in the pivotColumns and the pivot cell for the row
    cell.isPivoted = cell.column.isPivoted
  })
}
