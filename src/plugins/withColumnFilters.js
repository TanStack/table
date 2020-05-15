import React from 'react'

import {
  useGetLatest,
  getFirstDefined,
  getFilterMethod,
  functionalUpdate,
  shouldAutoRemoveFilter,
  useMountedLayoutEffect,
} from '../utils'

import { withColumnFilters as name, withColumnVisibility } from 'constants'

import * as filterTypes from '../filterTypes'

export const withColumnFilters = {
  name,
  after: [withColumnVisibility],
  useReduceOptions,
  useInstanceAfterState,
  useInstanceAfterDataModel,
  decorateColumn,
}

function useReduceOptions(options) {
  return {
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
  const { setState } = instance

  const getInstance = useGetLatest(instance)

  const columnFilterResetDeps = [
    instance.options.manualColumnFilters ? null : instance.options.data,
  ]
  React.useMemo(() => {
    if (getInstance().options.autoResetColumnFilters) {
      getInstance().state.columnFilters = getInstance().getInitialState().columnFilters
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, columnFilterResetDeps)

  useMountedLayoutEffect(() => {
    if (getInstance().options.autoResetColumnFilters) {
      instance.resetColumnFilters()
    }
  }, columnFilterResetDeps)

  instance.getColumnCanFilter = React.useCallback(
    columnId => {
      const column = getInstance().leafColumns.find(d => d.id === columnId)

      if (!column) {
        return false
      }

      return getFirstDefined(
        getInstance().options.disableFilters ? false : undefined,
        getInstance().options.disableColumnFilters ? false : undefined,
        column.disableAllFilters ? false : undefined,
        column.disableFilter ? false : undefined,
        column.defaultCanFilter,
        column.defaultCanFilterColumn,
        !!column.accessor
      )
    },
    [getInstance]
  )

  instance.getColumnIsFiltered = React.useCallback(
    columnId => getInstance().getColumnFilterIndex(columnId) > -1,
    [getInstance]
  )

  instance.getColumnFilterValue = React.useCallback(
    columnId =>
      getInstance().state.columnFilters.find(d => d.id === columnId)?.value,
    [getInstance]
  )

  instance.getColumnFilterIndex = React.useCallback(
    columnId =>
      getInstance().state.columnFilters.findIndex(d => d.id === columnId),
    [getInstance]
  )

  instance.setColumnFilterValue = React.useCallback(
    (columnId, value) =>
      setState(
        old => {
          const {
            leafColumns,
            options: { filterTypes: userFilterTypes },
          } = getInstance()

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

          const previousfilter = old.columnFilters.find(d => d.id === columnId)

          const newFilter = functionalUpdate(
            value,
            previousfilter && previousfilter.value
          )

          //
          if (
            shouldAutoRemoveFilter(filterMethod.autoRemove, newFilter, column)
          ) {
            return {
              ...old,
              columnFilters: old.columnFilters.filter(d => d.id !== columnId),
            }
          }

          if (previousfilter) {
            return {
              ...old,
              columnFilters: old.columnFilters.map(d => {
                if (d.id === columnId) {
                  return { id: columnId, value: newFilter }
                }
                return d
              }),
            }
          }

          return {
            ...old,
            columnFilters: [
              ...old.columnFilters,
              { id: columnId, value: newFilter },
            ],
          }
        },
        {
          type: 'setColumnFilterValue',
          columnId,
          value,
        }
      ),
    [getInstance, setState]
  )

  instance.setColumnFilters = React.useCallback(
    columnFilters =>
      setState(
        old => {
          const {
            leafColumns,
            options: { filterTypes: userFilterTypes },
          } = getInstance()

          return {
            ...old,
            // Filter out undefined values
            columnFilters: functionalUpdate(
              columnFilters,
              old.columnFilters
            ).filter(filter => {
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
            }),
          }
        },
        {
          type: 'setColumnFilters',
        }
      ),
    [getInstance, setState]
  )

  instance.resetColumnFilters = React.useCallback(
    () =>
      setState(
        old => ({
          ...old,
          columnFilters: getInstance().getInitialState().columnFilters,
        }),
        {
          type: 'resetColumnFilters',
        }
      ),
    [getInstance, setState]
  )
}

function useInstanceAfterDataModel(instance) {
  const getInstance = useGetLatest(instance)

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

    if (process.env.NODE_ENV !== 'production' && getInstance().options.debug)
      console.info('Filtering...')

    const filteredFlatRows = []
    const filteredRowsById = {}

    const enableFacetedFilters = getInstance().options.enableFacetedFilters

    // Filters top level and nested rows
    const filterRows = (rows, depth = 0) => {
      let filteredRows = rows

      if (getInstance().options.filterFromChildrenUp) {
        rows = rows.filter(row => {
          if (!row.subRows?.length) {
            return true
          }

          row.subRows = filterRows(row.subRows, depth + 1)

          return row.subRows.length
        })
      }

      columnFilters.forEach(({ id: columnId, value: filterValue }) => {
        // Find the columnFilters column
        const column = getInstance().leafColumns.find(d => d.id === columnId)

        if (!column) {
          return
        }

        if (depth === 0 && enableFacetedFilters) {
          facetFilterValues(column, filteredRows, getInstance)
        }

        const filterMethod = getFilterMethod(
          column.filterType,
          getInstance().options.filterTypes || {},
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
        const newFilteredRows = filterMethod(
          filteredRows,
          [columnId],
          filterValue
        )

        filteredRows = newFilteredRows
      }, rows)

      // Apply the filter to any subRows
      // We technically could do this recursively in the above loop,
      // but that would severely hinder the API for the user, since they
      // would be required to do that recursion in some scenarios
      filteredRows.forEach(row => {
        filteredFlatRows.push(row)
        filteredRowsById[row.id] = row

        if (!getInstance().options.filterFromChildrenUp) {
          if (!row.subRows?.length) {
            return
          }

          row.subRows = filterRows(row.subRows, depth + 1)
        }
      })

      return filteredRows
    }

    return [filterRows(rows), filteredFlatRows, filteredRowsById]
  }, [
    columnFilters,
    flatRows,
    getInstance,
    manualColumnFilters,
    rows,
    rowsById,
  ])

  React.useMemo(() => {
    // Now that each filtered column has it's partially filtered rows,
    // lets assign the final filtered rows to all of the other columns
    const nonFilteredColumns = getInstance().leafColumns.filter(
      column => !columnFilters.find(d => d.id === column.id)
    )

    // This essentially enables faceted filter options to be built easily
    // using every column's preFilteredRows value

    const enableFacetedFilters = getInstance().options.enableFacetedFilters

    if (enableFacetedFilters) {
      nonFilteredColumns.forEach(column => {
        facetFilterValues(column, filteredRows, getInstance)

        // There are no more levels of filters, so duplicate the pre-filter
        // values as the standard ones
      })
    }
  }, [filteredRows, columnFilters, getInstance])

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

function facetFilterValues(column, rows, getInstance) {
  const enableUniqueValues =
    getInstance().options.enableUniqueValues || column.enableUniqueValues

  const enableMinMaxValues =
    getInstance().options.enableMinMaxValues || column.enableMinMaxValues

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

function decorateColumn(column, { getInstance }) {
  column.getCanFilter = () => getInstance().getColumnCanFilter(column.id)
  column.getFilterIndex = () => getInstance().getColumnFilterIndex(column.id)
  column.getIsFiltered = () => getInstance().getColumnIsFiltered(column.id)
  column.getFilterValue = () => getInstance().getColumnFilterValue(column.id)
  column.setFilterValue = val =>
    getInstance().setColumnFilterValue(column.id, val)
}
