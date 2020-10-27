import React from 'react'

import {
  useGetLatest,
  getFirstDefined,
  flattenBy,
  groupBy,
  useMountedLayoutEffect,
  makeRenderer,
} from '../utils'

import {
  withGrouping as name,
  withColumnVisibility,
  withColumnFilters,
  withGlobalFilter,
} from '../Constants'

import * as aggregationTypes from '../aggregationTypes'

const emptyArray = []
const emptyObject = {}

export const withGrouping = {
  name,
  after: [withColumnVisibility, withColumnFilters, withGlobalFilter],
  plugs: {
    useReduceOptions,
    useInstanceAfterState,
    useInstanceAfterDataModel,
    useReduceLeafColumns,
    decorateColumn,
    decorateRow,
    decorateCell,
  },
}

function useReduceOptions(options) {
  return {
    aggregationTypes: {},
    manualGrouping: false,
    autoResetGrouping: true,
    ...options,
    initialState: {
      grouping: [],
      ...options.initialState,
    },
  }
}

function useInstanceAfterState(instance) {
  const { setState } = instance

  const groupingResetDeps = [
    instance.options.manualGrouping ? null : instance.options.data,
  ]
  React.useMemo(() => {
    if (instance.options.autoResetGrouping) {
      instance.state.grouping = instance.getInitialState().grouping
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, groupingResetDeps)

  useMountedLayoutEffect(() => {
    if (instance.options.autoResetGrouping) {
      instance.resetGrouping()
    }
  }, groupingResetDeps)

  instance.getColumnCanGroup = React.useCallback(
    columnId => {
      const column = instance.leafColumns.find(d => d.id === columnId)

      if (!column) {
        return false
      }

      return getFirstDefined(
        instance.options.disableGrouping ? false : undefined,
        column.disableGrouping ? false : undefined,
        column.defaultCanGrouping,
        !!column.accessor
      )
    },
    [instance.leafColumns, instance.options.disableGrouping]
  )

  instance.getColumnIsGrouped = React.useCallback(
    columnId => instance.state.grouping.includes(columnId),
    [instance.state.grouping]
  )

  instance.getColumnGroupedIndex = React.useCallback(
    columnId => instance.state.grouping.indexOf(columnId),
    [instance.state.grouping]
  )

  instance.toggleColumnGrouping = React.useCallback(
    (columnId, value) => {
      setState(
        old => {
          value =
            typeof value !== 'undefined'
              ? value
              : !old.grouping.includes(columnId)

          if (value) {
            return [
              {
                ...old,
                grouping: [...old.grouping, columnId],
              },
              { value },
            ]
          }

          return [
            {
              ...old,
              grouping: old.grouping.filter(d => d !== columnId),
            },
            {
              value,
            },
          ]
        },
        {
          type: 'toggleColumnGrouping',
          columnId,
        }
      )
    },
    [setState]
  )

  instance.resetGrouping = React.useCallback(
    () =>
      setState(
        old => {
          return {
            ...old,
            grouping: instance.getInitialState().grouping,
          }
        },
        {
          type: 'resetGrouping',
        }
      ),
    [instance, setState]
  )
}

function useInstanceAfterDataModel(instance) {
  const {
    options: { manualGrouping },
    state: { grouping },
    leafColumns,
    rows,
    flatRows,
    rowsById,
  } = instance

  const [
    groupedRows,
    groupedFlatRows,
    groupedRowsById,
    onlyGroupedFlatRows,
    onlyGroupedRowsById,
    nonGroupedFlatRows,
    nonGroupedRowsById,
  ] = React.useMemo(() => {
    if (manualGrouping || !grouping.length) {
      return [
        rows,
        flatRows,
        rowsById,
        emptyArray,
        emptyObject,
        flatRows,
        rowsById,
      ]
    }

    if (process.env.NODE_ENV !== 'production' && instance.options.debug)
      console.info('Grouping...')

    // Ensure that the list of filtered columns exist
    const existingGrouping = grouping.filter(g =>
      leafColumns.find(col => col.id === g)
    )

    // Find the columns that can or are aggregating
    // Uses each column to aggregate rows into a single value
    const aggregateRowsToValues = (leafRows, groupedRows, depth) => {
      const values = {}

      leafColumns.forEach(column => {
        // Don't aggregate columns that are in the grouping
        if (existingGrouping.includes(column.id)) {
          values[column.id] = groupedRows[0]
            ? groupedRows[0].values[column.id]
            : null
          return
        }

        // Aggregate the values
        let aggregateFn =
          typeof column.aggregate === 'function'
            ? column.aggregate
            : instance.options.aggregationTypes[column.aggregate] ||
              aggregationTypes[column.aggregate]

        if (aggregateFn) {
          // Get the columnValues to aggregate
          const groupedValues = groupedRows.map(row => row.values[column.id])

          // Get the columnValues to aggregate
          const leafValues = leafRows.map(row => {
            let columnValue = row.values[column.id]

            if (!depth && column.aggregatedValue) {
              const aggregateValueFn =
                typeof column.aggregateValue === 'function'
                  ? column.aggregateValue
                  : instance.options.aggregationTypes[column.aggregateValue] ||
                    aggregationTypes[column.aggregateValue]

              if (!aggregateValueFn) {
                console.info({ column })
                throw new Error(
                  process.env.NODE_ENV !== 'production'
                    ? `React Table: Invalid column.aggregateValue option for column listed above`
                    : ''
                )
              }

              columnValue = aggregateValueFn(columnValue, row, column)
            }
            return columnValue
          })

          values[column.id] = aggregateFn(leafValues, groupedValues)
        } else if (column.aggregate) {
          console.info({ column })
          throw new Error(
            process.env.NODE_ENV !== 'production'
              ? `React Table: Invalid column.aggregate option for column listed above`
              : ''
          )
        } else {
          values[column.id] = null
        }
      })

      return values
    }

    let groupedFlatRows = []
    const groupedRowsById = {}
    const onlyGroupedFlatRows = []
    const onlyGroupedRowsById = {}
    const nonGroupedFlatRows = []
    const nonGroupedRowsById = {}

    // Recursively group the data
    const groupUpRecursively = (rows, depth = 0, parentId) => {
      // This is the last level, just return the rows
      if (depth === existingGrouping.length) {
        return rows
      }

      const columnId = existingGrouping[depth]

      // Group the rows together for this level
      let rowGroupsMap = groupBy(rows, columnId)

      // Peform aggregations for each group
      const aggregatedGroupedRows = Object.entries(rowGroupsMap).map(
        ([groupingVal, groupedRows], index) => {
          let id = `${columnId}:${groupingVal}`
          id = parentId ? `${parentId}>${id}` : id

          // First, Recurse to group sub rows before aggregation
          const subRows = groupUpRecursively(groupedRows, depth + 1, id)

          // Flatten the leaf rows of the rows in this group
          const leafRows = depth
            ? flattenBy(groupedRows, 'leafRows')
            : groupedRows

          const values = aggregateRowsToValues(leafRows, groupedRows, depth)

          const row = {
            id,
            groupingId: columnId,
            groupingVal,
            values,
            subRows,
            leafRows,
            depth,
            index,
          }

          subRows.forEach(subRow => {
            groupedFlatRows.push(subRow)
            groupedRowsById[subRow.id] = subRow
            if (subRow.getIsGrouped()) {
              onlyGroupedFlatRows.push(subRow)
              onlyGroupedRowsById[subRow.id] = subRow
            } else {
              nonGroupedFlatRows.push(subRow)
              nonGroupedRowsById[subRow.id] = subRow
            }
          })

          row.cells = []

          row.cells = leafColumns.map(column => {
            let value = row.values[column.id]

            const cell = {
              id: column.id,
              row,
              column,
              value,
            }

            cell.render = makeRenderer(instance, {
              cell,
              row,
              column,
              value,
            })

            instance.plugs.decorateCell(cell, { instance })

            return cell
          })

          row.getVisibleCells = () =>
            instance.leafColumns.map(column =>
              row.cells.find(cell => cell.column.id === column.id)
            )

          instance.plugs.decorateRow(row, { instance })

          return row
        }
      )

      return aggregatedGroupedRows
    }

    const groupedRows = groupUpRecursively(rows)

    groupedRows.forEach(subRow => {
      groupedFlatRows.push(subRow)
      groupedRowsById[subRow.id] = subRow
      if (subRow.getIsGrouped()) {
        onlyGroupedFlatRows.push(subRow)
        onlyGroupedRowsById[subRow.id] = subRow
      } else {
        nonGroupedFlatRows.push(subRow)
        nonGroupedRowsById[subRow.id] = subRow
      }
    })

    // Assign the new data
    return [
      groupedRows,
      groupedFlatRows,
      groupedRowsById,
      onlyGroupedFlatRows,
      onlyGroupedRowsById,
      nonGroupedFlatRows,
      nonGroupedRowsById,
    ]
  }, [
    manualGrouping,
    grouping,
    instance,
    rows,
    flatRows,
    rowsById,
    leafColumns,
  ])

  Object.assign(instance, {
    preGroupedRows: rows,
    preGroupedFlatRow: flatRows,
    preGroupedRowsById: rowsById,
    groupedRows,
    groupedFlatRows,
    groupedRowsById,
    onlyGroupedFlatRows,
    onlyGroupedRowsById,
    nonGroupedFlatRows,
    nonGroupedRowsById,
    rows: groupedRows,
    flatRows: groupedFlatRows,
    rowsById: groupedRowsById,
  })
}

function useReduceLeafColumns(orderedColumns, { instance }) {
  const {
    state: { grouping },
  } = instance

  return React.useMemo(() => {
    if (!grouping.length) {
      return orderedColumns
    }

    const expanderColumn = orderedColumns.find(d => d.isExpanderColumn)

    const groupingColumns = grouping
      .map(g => orderedColumns.find(col => col.id === g))
      .filter(Boolean)

    const nonGroupingColumns = orderedColumns.filter(
      col => !grouping.includes(col.id)
    )

    if (!expanderColumn) {
      nonGroupingColumns.unshift(...groupingColumns)
    }

    return nonGroupingColumns
  }, [grouping, orderedColumns])
}

function decorateColumn(column, { instance }) {
  column.Aggregated = column.Aggregated || column.Cell

  column.getCanGroup = () => instance.getColumnCanGroup(column.id)
  column.getGroupedIndex = () => instance.getColumnGroupedIndex(column.id)
  column.getIsGrouped = () => instance.getColumnIsGrouped(column.id)
  column.toggleGrouping = value =>
    instance.toggleColumnGrouping(column.id, value)
  column.getToggleGroupingProps = (props = {}) => {
    const canGroup = column.getCanGroup()

    return {
      onClick: canGroup
        ? e => {
            e.persist()
            column.toggleGrouping()
          }
        : undefined,
      title: 'Toggle Grouping',
      ...props,
    }
  }
}

function decorateRow(row) {
  row.getIsGrouped = () => !!row.groupingId
}

function decorateCell(cell) {
  // Grouped cells are in the grouping and the pivot cell for the row
  cell.getIsGrouped = () =>
    cell.column.getIsGrouped() && cell.column.id === cell.row.groupingId
  // Placeholder cells are any columns in the grouping that are not grouped
  cell.getIsPlaceholder = () =>
    !cell.getIsGrouped() && cell.column.getIsGrouped()
  // Aggregated cells are not grouped, not repeated, but still have subRows
  cell.getIsAggregated = () =>
    !cell.getIsGrouped() && !cell.getIsPlaceholder() && cell.row.getCanExpand()
}
