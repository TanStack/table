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
  useReduceOptions,
  useInstanceAfterState,
  useInstanceAfterDataModel,
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

  const getInstance = useGetLatest(instance)

  const globalFilterResetDeps = [
    instance.options.manualGlobalFilter ? null : instance.options.data,
  ]
  React.useMemo(() => {
    if (getInstance().options.autoResetGlobalFilter) {
      getInstance().state.globalFilterValue = getInstance().getInitialState().globalFilterValue
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, globalFilterResetDeps)

  useMountedLayoutEffect(() => {
    if (getInstance().options.autoResetGlobalFilter) {
      instance.resetGlobalFilter()
    }
  }, globalFilterResetDeps)

  instance.getCanGlobalFilterColumn = React.useCallback(
    columnId => {
      const column = getInstance().leafColumns.find(d => d.id === columnId)

      if (!column) {
        return false
      }

      return getFirstDefined(
        getInstance().options.disableFilters ? false : undefined,
        getInstance().options.disableGlobalFilters ? false : undefined,
        column.disableAllFilters ? false : undefined,
        column.disableGlobalFilter ? false : undefined,
        column.defaultCanFilter,
        column.defaultCanGlobalFilter,
        !!column.accessor
      )
    },
    [getInstance]
  )

  instance.setGlobalFilterValue = React.useCallback(
    value =>
      setState(
        old => {
          const filterMethod = getFilterMethod(
            getInstance().options.globalFilterType,
            getInstance().options.filterTypes || {},
            filterTypes
          )

          const newFilter = functionalUpdate(value, old.globalFilterValue)

          //
          if (shouldAutoRemoveFilter(filterMethod.autoRemove, newFilter)) {
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
    [getInstance, setState]
  )

  instance.resetGlobalFilter = React.useCallback(
    () =>
      setState(
        old => ({
          ...old,
          globalFilterValue: getInstance().getInitialState().globalFilterValue,
        }),
        {
          type: 'resetGlobalFilter',
        }
      ),
    [getInstance, setState]
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

  const getInstance = useGetLatest(instance)

  const [
    globalFilteredRows,
    globalFilteredFlatRows,
    globalFilteredRowsById,
  ] = React.useMemo(() => {
    if (manualGlobalFilter || !globalFilterValue) {
      return [rows, flatRows, rowsById]
    }

    if (process.env.NODE_ENV !== 'production' && getInstance().options.debug)
      console.info('Global Filtering...')

    const filteredFlatRows = []
    const filteredRowsById = {}

    const filterMethod = getFilterMethod(
      globalFilterType,
      getInstance().options.filterTypes || {},
      filterTypes
    )

    if (!filterMethod) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`Could not find a valid 'globalFilterType' option.`)
      }
      return rows
    }

    const filterableColumns = leafColumns.filter(c =>
      getInstance().getCanGlobalFilterColumn(c.id)
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
    globalFilterType,
    getInstance,
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
