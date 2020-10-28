import React from 'react'

import {
  getFirstDefined,
  getFilterMethod,
  functionalUpdate,
  shouldAutoRemoveFilter,
  useMountedLayoutEffect,
  makeStateUpdater,
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
    onGlobalFilterChange: React.useCallback(
      makeStateUpdater('globalFilter'),
      []
    ),
    autoResetGlobalFilter: true,
    globalFilterType: 'text',
    ...options,
    initialState: {
      globalFilter: '',
      ...options.initialState,
    },
  }
}

function useInstanceAfterState(instance) {
  const globalFilterResetDeps = [
    instance.options.manualGlobalFilter ? null : instance.options.data,
  ]

  React.useMemo(() => {
    if (instance.options.autoResetGlobalFilter) {
      instance.state.globalFilter = instance.options.initialState.globalFilter
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, globalFilterResetDeps)

  useMountedLayoutEffect(() => {
    if (instance.options.autoResetGlobalFilter) {
      instance.resetGlobalFilter()
    }
  }, globalFilterResetDeps)

  instance.setGlobalFilter = React.useCallback(
    updater =>
      instance.onGlobalFilterChange(old => {
        const filterMethod = getFilterMethod(
          instance.options.globalFilterType,
          instance.options.filterTypes || {},
          filterTypes
        )

        const newFilter = functionalUpdate(updater, old)

        //
        if (shouldAutoRemoveFilter(filterMethod.autoRemove, newFilter)) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { globalFilter, ...stateWithout } = old
          return stateWithout
        }

        return newFilter
      }),
    [instance]
  )

  instance.resetGlobalFilter = React.useCallback(
    () => instance.setGlobalFilter(instance.options.initialState.globalFilter),
    [instance]
  )

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
}

function useInstanceAfterDataModel(instance) {
  const {
    options: { manualGlobalFilter, globalFilterType },
    state: { globalFilter },
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
    if (manualGlobalFilter || !globalFilter) {
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
        globalFilter
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
    globalFilter,
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
