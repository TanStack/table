import React from 'react'

import {
  useGetLatest,
  getFirstDefined,
  getFilterMethod,
  functionalUpdate,
  shouldAutoRemoveFilter,
  useMountedLayoutEffect,
} from '../utils'

import {
  withGlobalFilter as name,
  withColumnVisibility,
  withColumnFilters,
} from '../Constants'

import * as filterTypes from '../filterTypes'

export const withGlobalFilter = {
  name,
  after: [withColumnVisibility, withColumnFilters],
  plugs: {
    useReduceOptions,
    useInstanceAfterState,
    useInstanceAfterDataModel,
  },
}

function useReduceOptions(options) {
  return {
    autoResetGlobalFilter: true,
    globalFilterType: 'text',
    ...options,
    initialState: {
      globalFilterValue: '',
      ...options.initialState,
    },
  }
}

function useInstanceAfterState(instance) {
  const { setState } = instance

  const globalFilterResetDeps = [
    instance.options.manualGlobalFilter ? null : instance.options.data,
  ]

  React.useMemo(() => {
    if (instance.options.autoResetGlobalFilter) {
      instance.state.globalFilterValue = instance.getInitialState().globalFilterValue
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, globalFilterResetDeps)

  useMountedLayoutEffect(() => {
    if (instance.options.autoResetGlobalFilter) {
      instance.resetGlobalFilter()
    }
  }, globalFilterResetDeps)

  instance.getCanGlobalFilterColumn = React.useCallback(
    columnId => {
      const column = instance.leafColumns.find(d => d.id === columnId)

      if (!column) {
        return false
      }

      return getFirstDefined(
        instance.options.disableFilters ? false : undefined,
        instance.options.disableGlobalFilters ? false : undefined,
        column.disableAllFilters ? false : undefined,
        column.disableGlobalFilter ? false : undefined,
        column.defaultCanFilter,
        column.defaultCanGlobalFilter,
        !!column.accessor
      )
    },
    [
      instance.leafColumns,
      instance.options.disableFilters,
      instance.options.disableGlobalFilters,
    ]
  )

  instance.setGlobalFilterValue = React.useCallback(
    value =>
      setState(
        old => {
          const filterMethod = getFilterMethod(
            instance.options.globalFilterType,
            instance.options.filterTypes || {},
            filterTypes
          )

          const newFilter = functionalUpdate(value, old.globalFilterValue)

          //
          if (shouldAutoRemoveFilter(filterMethod.autoRemove, newFilter)) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { globalFilterValue, ...stateWithout } = old
            return stateWithout
          }

          return {
            ...old,
            globalFilterValue: newFilter,
          }
        },
        {
          type: 'setGlobalFilterValue',
          value,
        }
      ),
    [instance.options.filterTypes, instance.options.globalFilterType, setState]
  )

  instance.resetGlobalFilter = React.useCallback(
    () =>
      setState(
        old => ({
          ...old,
          globalFilterValue: instance.getInitialState().globalFilterValue,
        }),
        {
          type: 'resetGlobalFilter',
        }
      ),
    [instance, setState]
  )
}

function useInstanceAfterDataModel(instance) {
  const {
    options: { manualGlobalFilter, globalFilterType },
    state: { globalFilterValue },
    rows,
    flatRows,
    rowsById,
    leafColumns,
  } = instance

  const [
    globalFilteredRows,
    globalFilteredFlatRows,
    globalFilteredRowsById,
  ] = React.useMemo(() => {
    if (manualGlobalFilter || !globalFilterValue) {
      return [rows, flatRows, rowsById]
    }

    if (process.env.NODE_ENV !== 'production' && instance.options.debug)
      console.info('Global Filtering...')

    const filteredFlatRows = []
    const filteredRowsById = {}

    const filterMethod = getFilterMethod(
      globalFilterType,
      instance.options.filterTypes || {},
      filterTypes
    )

    if (!filterMethod) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`Could not find a valid 'globalFilterType' option.`)
      }
      return rows
    }

    const filterableColumns = leafColumns.filter(c =>
      instance.getCanGlobalFilterColumn(c.id)
    )

    // Filters top level and nested rows
    const filterRows = filteredRows => {
      filteredRows = filterMethod(
        filteredRows,
        filterableColumns.map(d => d.id),
        globalFilterValue
      )

      filteredRows.forEach(row => {
        filteredFlatRows.push(row)
        filteredRowsById[row.id] = row

        row.subRows =
          row.subRows && row.subRows.length
            ? filterRows(row.subRows)
            : row.subRows
      })

      return filteredRows
    }

    return [filterRows(rows), filteredFlatRows, filteredRowsById]
  }, [
    manualGlobalFilter,
    globalFilterValue,
    instance,
    globalFilterType,
    leafColumns,
    rows,
    flatRows,
    rowsById,
  ])

  Object.assign(instance, {
    preGlobalFilteredRows: rows,
    preGlobalFilteredFlatRows: flatRows,
    preGlobalFilteredRowsById: rowsById,
    globalFilteredRows,
    globalFilteredFlatRows,
    globalFilteredRowsById,
    rows: globalFilteredRows,
    flatRows: globalFilteredFlatRows,
    rowsById: globalFilteredRowsById,
  })
}
