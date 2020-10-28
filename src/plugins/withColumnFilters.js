import React from 'react'

import {
  getFirstDefined,
  getFilterMethod,
  functionalUpdate,
  shouldAutoRemoveFilter,
  useMountedLayoutEffect,
  makeStateUpdater,
} from '../utils'

import { withColumnFilters as name, withColumnVisibility } from '../Constants'

import * as filterTypes from '../filterTypes'

export const withColumnFilters = {
  name,
  after: [withColumnVisibility],
  plugs: {
    useReduceOptions,
    useInstanceAfterState,
    useInstanceAfterDataModel,
    decorateColumn,
  },
}

function useReduceOptions(options) {
  return {
    onColumnFiltersChange: React.useCallback(
      makeStateUpdater('columnFilters'),
      []
    ),
    autoResetColumnFilters: true,
    ...options,
    initialState: {
      columnFilters: [],
      ...options.initialState,
    },
    defaultColumn: {
      filterType: 'text',
      ...options.defaultColumn,
    },
  }
}

function useInstanceAfterState(instance) {
  instance.setColumnFilters = React.useCallback(
    updater => {
      instance.options.onColumnFiltersChange(old => {
        const {
          leafColumns,
          options: { filterTypes: userFilterTypes },
        } = instance

        return functionalUpdate(updater, old).filter(filter => {
          const column = leafColumns.find(d => d.id === filter.id)
          const filterMethod = getFilterMethod(
            column.filterType,
            userFilterTypes || {},
            filterTypes
          )

          if (
            shouldAutoRemoveFilter(
              filterMethod.autoRemove,
              filter.value,
              column
            )
          ) {
            return false
          }
          return true
        })
      }, instance)
    },
    [instance]
  )

  const columnFilterResetDeps = [
    instance.options.manualColumnFilters ? null : instance.options.data,
  ]

  React.useMemo(() => {
    if (instance.options.autoResetColumnFilters) {
      instance.state.columnFilters = instance.options.initialState.columnFilters
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, columnFilterResetDeps)

  useMountedLayoutEffect(() => {
    if (instance.options.autoResetColumnFilters) {
      instance.resetColumnFilters()
    }
  }, columnFilterResetDeps)

  instance.getColumnCanFilter = React.useCallback(
    columnId => {
      const column = instance.leafColumns.find(d => d.id === columnId)

      if (!column) {
        return false
      }

      return getFirstDefined(
        instance.options.disableFilters ? false : undefined,
        instance.options.disableColumnFilters ? false : undefined,
        column.disableAllFilters ? false : undefined,
        column.disableFilter ? false : undefined,
        column.defaultCanFilter,
        column.defaultCanFilterColumn,
        !!column.accessor
      )
    },
    [
      instance.leafColumns,
      instance.options.disableColumnFilters,
      instance.options.disableFilters,
    ]
  )

  instance.getColumnIsFiltered = React.useCallback(
    columnId => instance.getColumnFilterIndex(columnId) > -1,
    [instance]
  )

  instance.getColumnFilterValue = React.useCallback(
    columnId =>
      instance.state.columnFilters.find(d => d.id === columnId)?.value,
    [instance.state.columnFilters]
  )

  instance.getColumnFilterIndex = React.useCallback(
    columnId => instance.state.columnFilters.findIndex(d => d.id === columnId),
    [instance.state.columnFilters]
  )

  instance.setColumnFilterValue = React.useCallback(
    (columnId, value) =>
      instance.setColumnFilters(
        old => {
          const {
            leafColumns,
            options: { filterTypes: userFilterTypes },
          } = instance

          const column = leafColumns.find(d => d.id === columnId)

          if (!column) {
            throw new Error(
              process.env.NODE_ENV !== 'production'
                ? `React-Table: Could not find a column with id: ${columnId}`
                : ''
            )
          }

          const filterMethod = getFilterMethod(
            column.filterType,
            userFilterTypes || {},
            filterTypes
          )

          const previousfilter = old.find(d => d.id === columnId)

          const newFilter = functionalUpdate(
            value,
            previousfilter && previousfilter.value
          )

          //
          if (
            shouldAutoRemoveFilter(filterMethod.autoRemove, newFilter, column)
          ) {
            return old.filter(d => d.id !== columnId)
          }

          if (previousfilter) {
            return old.map(d => {
              if (d.id === columnId) {
                return { id: columnId, value: newFilter }
              }
              return d
            })
          }

          return [...old, { id: columnId, value: newFilter }]
        },
        {
          type: 'setColumnFilterValue',
          columnId,
          value,
        }
      ),
    [instance]
  )

  instance.resetColumnFilters = React.useCallback(
    () =>
      setState(
        old => ({
          ...old,
          columnFilters: instance.options.initialState.columnFilters,
        }),
        {
          type: 'resetColumnFilters',
        }
      ),
    [instance]
  )
}

function useInstanceAfterDataModel(instance) {
  const {
    options: { manualColumnFilters },
    state: { columnFilters },
    rows,
    flatRows,
    rowsById,
  } = instance

  const [
    filteredRows,
    filteredFlatRows,
    filteredRowsById,
  ] = React.useMemo(() => {
    if (manualColumnFilters || !columnFilters.length) {
      return [rows, flatRows, rowsById]
    }

    if (process.env.NODE_ENV !== 'production' && instance.options.debug)
      console.info('Filtering...')

    const newFilteredFlatRows = []
    const newFilteredRowsById = {}

    const enableFacetedFilters = instance.options.enableFacetedFilters

    // Filters top level and nested rows
    const filterRows = (rowsToFilter, depth = 0) => {
      if (instance.options.filterFromChildrenUp) {
        rowsToFilter = rowsToFilter.filter(row => {
          if (!row.subRows?.length) {
            return true
          }

          row.subRows = filterRows(row.subRows, depth + 1)

          return row.subRows.length
        })
      }

      columnFilters.forEach(({ id: columnId, value: filterValue }) => {
        // Find the columnFilters column
        const column = instance.leafColumns.find(d => d.id === columnId)

        if (!column) {
          return
        }

        if (depth === 0 && enableFacetedFilters) {
          facetFilterValues(column, rowsToFilter, instance)
        }

        const filterMethod = getFilterMethod(
          column.filterType,
          instance.options.filterTypes || {},
          filterTypes
        )

        if (process.env.NODE_ENV !== 'production' && !filterMethod) {
          console.warn(
            `Could not find a valid 'column.filterType' for column with the ID: ${column.id}.`
          )
          return
        }

        // Pass the rows, id, filterValue and column to the filterMethod
        // to get the filtered rows back
        rowsToFilter = filterMethod(rowsToFilter, [columnId], filterValue)
      })

      // Apply the filter to any subRows
      // We technically could do this recursively in the above loop,
      // but that would severely hinder the API for the user, since they
      // would be required to do that recursion in some scenarios
      rowsToFilter.forEach(row => {
        newFilteredFlatRows.push(row)
        newFilteredRowsById[row.id] = row

        if (!instance.options.filterFromChildrenUp) {
          if (!row.subRows?.length) {
            return
          }

          row.subRows = filterRows(row.subRows, depth + 1)
        }
      })

      return rowsToFilter
    }

    return [filterRows(rows), newFilteredFlatRows, newFilteredRowsById]
  }, [columnFilters, flatRows, instance, manualColumnFilters, rows, rowsById])

  React.useMemo(() => {
    // Now that each filtered column has it's partially filtered rows,
    // lets assign the final filtered rows to all of the other columns
    const nonFilteredColumns = instance.leafColumns.filter(
      column => !columnFilters.find(d => d.id === column.id)
    )

    // This essentially enables faceted filter options to be built easily
    // using every column's preFilteredRows value

    const enableFacetedFilters = instance.options.enableFacetedFilters

    if (enableFacetedFilters) {
      nonFilteredColumns.forEach(column => {
        facetFilterValues(column, filteredRows, instance)

        // There are no more levels of filters, so duplicate the pre-filter
        // values as the standard ones
      })
    }
  }, [instance, columnFilters, filteredRows])

  Object.assign(instance, {
    preFilteredRows: rows,
    preFilteredFlatRows: flatRows,
    preFilteredRowsById: rowsById,
    filteredRows,
    filteredFlatRows,
    filteredRowsById,
    rows: filteredRows,
    flatRows: filteredFlatRows,
    rowsById: filteredRowsById,
  })
}

function facetFilterValues(column, rows, instance) {
  const enableUniqueValues =
    instance.options.enableUniqueValues || column.enableUniqueValues

  const enableMinMaxValues =
    instance.options.enableMinMaxValues || column.enableMinMaxValues

  column.preFilteredRows = rows

  if (enableUniqueValues) {
    column.preFilteredUniqueValues = new Map()
  }

  if (enableMinMaxValues) {
    column.preFilteredMinMaxValues = [
      rows[0]?.values[column.id],
      rows[0]?.values[column.id],
    ]
  }

  if (enableUniqueValues || enableMinMaxValues) {
    rows.forEach(row => {
      const value = row.values[column.id]

      if (enableUniqueValues) {
        if (column.preFilteredUniqueValues.has(value)) {
          column.preFilteredUniqueValues.set(
            value,
            column.preFilteredUniqueValues.get(value) + 1
          )
        } else {
          column.preFilteredUniqueValues.set(value, 1)
        }
      }

      if (enableMinMaxValues) {
        if (value < column.preFilteredMinMaxValues[0]) {
          column.preFilteredMinMaxValues[0] = value
        } else if (value > column.preFilteredMinMaxValues[1]) {
          column.preFilteredMinMaxValues[1] = value
        }
      }
    })
  }
}

function decorateColumn(column, { instance }) {
  column.getCanFilter = () => instance.getColumnCanFilter(column.id)
  column.getFilterIndex = () => instance.getColumnFilterIndex(column.id)
  column.getIsFiltered = () => instance.getColumnIsFiltered(column.id)
  column.getFilterValue = () => instance.getColumnFilterValue(column.id)
  column.setFilterValue = val => instance.setColumnFilterValue(column.id, val)
}
