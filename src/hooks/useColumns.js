import React from 'react'

//

import {
  useGetLatest,
  flattenColumns,
  makeRenderer,
  getFirstDefined,
} from '../utils'

export const defaultColumn = {
  Header: () => <>&nbsp;</>,
  Cell: ({ value = '' }) => value,
  minWidth: 0,
  maxWidth: Number.MAX_SAFE_INTEGER,
  defaultIsVisible: true,
  width: 150,
  filterType: 'text',
  sortType: 'basic',
  sortDescFirst: false,
}

export default function useColumns(instance) {
  const getInstance = useGetLatest(instance)
  const {
    getColumnIsVisible,
    state: { grouping, columnOrder },
    options: { columns },
    plugs: { decorateFlatColumns },
  } = instance

  // TODO: Derive the default table state from column initial state

  instance.columns = React.useMemo(() => {
    if (process.env.NODE_ENV !== 'production' && getInstance().options.debug)
      console.info('Building Columns...')

    return recurseColumns(columns)

    function recurseColumns(columns, parent, depth = 0) {
      return columns.map(column => {
        column = {
          ...column,
          parent,
          depth,
          originalColumn: column,
        }

        if (column.columns) {
          column.columns = recurseColumns(column.columns, column, depth + 1)
        }

        return column
      })
    }
  }, [columns, getInstance])

  instance.flatColumns = React.useMemo(() => {
    const flatColumns = flattenColumns(instance.columns)

    decorateFlatColumns(flatColumns, { getInstance })

    return flatColumns.map(column => {
      column = {
        ...defaultColumn,
        ...(getInstance().options.defaultColumn || {}),
        ...column,
      }

      column.Aggregated = column.Aggregated || column.Cell
      column.disableHiding = getFirstDefined(
        column.disableHiding,
        column.isSelectionColumn ? true : undefined,
        column.isExpanderColumn ? true : undefined
      )

      return column
    })
  }, [decorateFlatColumns, getInstance, instance.columns])

  instance.flatColumns.forEach(column => {
    if (typeof column.accessor === 'string') {
      column.id = column.id = column.id || column.accessor
      const key = column.accessor
      column.accessor = row => row[key]
    }

    if (!column.id && typeof column.Header === 'string' && column.Header) {
      column.id = column.id = column.Header
    }

    if (!column.id && column.columns) {
      console.error(column)
      throw new Error(
        process.env.NODE_ENV !== 'production'
          ? 'A column ID (or unique "Header" value) is required!'
          : ''
      )
    }

    if (!column.id) {
      console.error(column)
      throw new Error(
        process.env.NODE_ENV !== 'production'
          ? 'A column ID (or string accessor) is required!'
          : ''
      )
    }

    column.render = makeRenderer(getInstance, {
      column,
    })

    column.getCanHide = () => getInstance().getColumnCanHide(column.id)
    column.getIsVisible = () => getInstance().getColumnIsVisible(column.id)
    column.toggleVisibility = value =>
      getInstance().toggleColumnVisibility(column.id, value)

    column.getCanFilter = () => getInstance().getColumnCanFilter(column.id)
    column.getFilterIndex = () => getInstance().getColumnFilterIndex(column.id)
    column.getIsFiltered = () => getInstance().getColumnIsFiltered(column.id)
    column.getFilterValue = () => getInstance().getColumnFilterValue(column.id)
    column.setFilterValue = val =>
      getInstance().setColumnFilterValue(column.id, val)

    column.getCanGroup = () => getInstance().getColumnCanGroup(column.id)
    column.getGroupedIndex = () =>
      getInstance().getColumnGroupedIndex(column.id)
    column.getIsGrouped = () => getInstance().getColumnIsGrouped(column.id)
    column.toggleGrouping = value =>
      getInstance().toggleColumnGrouping(column.id, value)

    column.getCanSort = () => getInstance().getColumnCanSort(column.id)
    column.getSortedIndex = () => getInstance().getColumnSortedIndex(column.id)
    column.getIsSorted = () => getInstance().getColumnIsSorted(column.id)
    column.toggleSorting = (desc, multi) =>
      getInstance().toggleColumnSorting(column.id, desc, multi)
    column.clearSorting = () => getInstance().clearColumnSorting(column.id)
    column.getIsSortedDesc = () =>
      getInstance().getColumnIsSortedDesc(column.id)

    instance.plugs.decorateColumn(column, { getInstance })
  })

  instance.orderedColumns = React.useMemo(() => {
    // Sort grouped columns to the start of the column list
    // before the headers are built
    let orderedColumns = []

    // If there is no order, return the normal columns
    if (columnOrder?.length) {
      const columnOrderCopy = [...columnOrder]

      // If there is an order, make a copy of the columns
      const flatColumnsCopy = [...instance.flatColumns]

      // And make a new ordered array of the columns

      // Loop over the columns and place them in order into the new array
      while (flatColumnsCopy.length && columnOrderCopy.length) {
        const targetColumnId = columnOrderCopy.shift()
        const foundIndex = flatColumnsCopy.findIndex(
          d => d.id === targetColumnId
        )
        if (foundIndex > -1) {
          orderedColumns.push(flatColumnsCopy.splice(foundIndex, 1)[0])
        }
      }

      // If there are any columns left, add them to the end
      orderedColumns = [...orderedColumns, ...flatColumnsCopy]
    } else {
      orderedColumns = instance.flatColumns
    }

    const selectionColumn = orderedColumns.find(d => d.isSelectionColumn)
    const expanderColumn = orderedColumns.find(d => d.isExpanderColumn)

    const groupingColumns = grouping
      .map(g => orderedColumns.find(col => col.id === g))
      .filter(Boolean)

    const nonGroupingColumns = orderedColumns.filter(
      col => !grouping.includes(col.id)
    )

    orderedColumns = nonGroupingColumns.filter(
      d => d && !d.isSelectionColumn && !d.isExpanderColumn
    )

    if (grouping.length) {
      if (expanderColumn) {
        orderedColumns.unshift(expanderColumn)
      } else {
        orderedColumns.unshift(...groupingColumns)
      }
    }

    if (selectionColumn) {
      orderedColumns.unshift(selectionColumn)
    }

    getInstance().plugs.decorateOrderedColumns(orderedColumns, { getInstance })

    return orderedColumns
  }, [columnOrder, getInstance, grouping, instance.flatColumns])

  instance.visibilityColumns = React.useMemo(
    () =>
      instance.orderedColumns.filter(
        d => !d.isSelectionColumn && !d.isExpanderColumn && d.getCanHide()
      ),
    [instance.orderedColumns]
  )

  instance.visibleColumns = React.useMemo(() => {
    const visibleColumns = instance.orderedColumns.filter(column =>
      getColumnIsVisible(column.id)
    )

    getInstance().plugs.decorateOrderedColumns(visibleColumns, { getInstance })

    return visibleColumns
  }, [instance.orderedColumns, getInstance, getColumnIsVisible])

  // Check for duplicate columns
  if (process.env.NODE_ENV !== 'production') {
    const duplicateColumns = instance.flatColumns.filter((column, i, all) => {
      return instance.flatColumns.findIndex(d => d.id === column.id) !== i
    })

    if (duplicateColumns.length) {
      console.info(instance.flatColumns)
      throw new Error(
        process.env.NODE_ENV !== 'production'
          ? `Duplicate columns were found with ids: "${duplicateColumns
              .map(d => d.id)
              .join(', ')}" in the columns array above`
          : ''
      )
    }
  }
}
