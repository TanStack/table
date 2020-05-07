import React from 'react'

//

import { useGetLatest, flattenColumns, makeRenderer } from '../utils'

export const defaultColumn = {
  Header: () => <>&nbsp;</>,
  Cell: ({ value = '' }) =>
    typeof value === 'boolean' ? value.toString() : value,
  defaultIsVisible: true,
  width: 150,
  minWidth: 20,
  maxWidth: Number.MAX_SAFE_INTEGER,
}

export default function useColumns(instance) {
  const getInstance = useGetLatest(instance)
  const {
    getColumnIsVisible,
    state: { grouping, columnOrder },
    options: { columns },
    plugs: {
      decorateAllColumns,
      decorateOrderedColumns,
      decorateVisibleColumns,
    },
  } = instance

  const prepColumn = React.useCallback(
    column => {
      if (column.prepared) {
        return
      }

      column.prepared = true

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

      column.getWidth = () => getInstance().getColumnWidth(column.id)
    },
    [getInstance]
  )

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

  instance.allColumns = React.useMemo(() => {
    const allColumns = flattenColumns(instance.columns, true)

    decorateAllColumns(allColumns, { getInstance })

    return allColumns.map(column => {
      Object.assign(column, {
        ...defaultColumn,
        ...(getInstance().options.defaultColumn || {}),
        ...column,
      })

      return column
    })
  }, [decorateAllColumns, getInstance, instance.columns])

  instance.allColumns.forEach(column => {
    prepColumn(column)
    instance.plugs.decorateColumn(column, { getInstance })
  })

  instance.leafColumns = React.useMemo(
    () =>
      instance.allColumns.filter(
        column => !column.columns || !column.columns.length
      ),
    [instance.allColumns]
  )

  instance.orderedColumns = React.useMemo(() => {
    // Sort grouped columns to the start of the column list
    // before the headers are built
    let orderedColumns = []

    // If there is no order, return the normal columns
    if (columnOrder?.length) {
      const columnOrderCopy = [...columnOrder]

      // If there is an order, make a copy of the columns
      const leafColumnsCopy = [...instance.leafColumns]

      // And make a new ordered array of the columns

      // Loop over the columns and place them in order into the new array
      while (leafColumnsCopy.length && columnOrderCopy.length) {
        const targetColumnId = columnOrderCopy.shift()
        const foundIndex = leafColumnsCopy.findIndex(
          d => d.id === targetColumnId
        )
        if (foundIndex > -1) {
          orderedColumns.push(leafColumnsCopy.splice(foundIndex, 1)[0])
        }
      }

      // If there are any columns left, add them to the end
      orderedColumns = [...orderedColumns, ...leafColumnsCopy]
    } else {
      orderedColumns = instance.leafColumns
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

    decorateOrderedColumns(orderedColumns, { getInstance })

    return orderedColumns
  }, [
    columnOrder,
    decorateOrderedColumns,
    getInstance,
    grouping,
    instance.leafColumns,
  ])

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

    decorateVisibleColumns(visibleColumns, { getInstance })

    return visibleColumns
  }, [
    instance.orderedColumns,
    decorateVisibleColumns,
    getInstance,
    getColumnIsVisible,
  ])

  // Check for duplicate columns
  if (process.env.NODE_ENV !== 'production') {
    const duplicateColumns = instance.leafColumns.filter((column, i, all) => {
      return instance.leafColumns.findIndex(d => d.id === column.id) !== i
    })

    if (duplicateColumns.length) {
      console.info(instance.leafColumns)
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
