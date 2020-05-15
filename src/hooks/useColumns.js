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
    options: { columns },
    plugs: { useReduceColumns, useReduceAllColumns, useReduceLeafColumns },
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

  instance.columns = useReduceColumns(instance.columns, { getInstance })

  instance.allColumns = React.useMemo(
    () => flattenColumns(instance.columns, true),
    [instance.columns]
  )

  instance.allColumns = useReduceAllColumns(instance.allColumns, {
    getInstance,
  })

  instance.allColumns = React.useMemo(() => {
    return instance.allColumns.map(column => {
      Object.assign(column, {
        ...defaultColumn,
        ...(getInstance().options.defaultColumn || {}),
        ...column,
      })

      return column
    })
  }, [getInstance, instance.allColumns])

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

  instance.leafColumns = useReduceLeafColumns(instance.leafColumns, {
    getInstance,
  })

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
