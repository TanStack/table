import React from 'react'
import { Column, TableColumn, TableInstance } from '../types'
//
import { flattenColumns, makeRenderer } from '../utils'

export const defaultColumn: Partial<TableColumn> = {
  Header: () => <>&nbsp;</>,
  Cell: ({ value = '' }: { value: unknown }) =>
    typeof value === 'boolean' ? value.toString() : value,
  defaultIsVisible: true,
  width: 150,
  minWidth: 20,
  maxWidth: Number.MAX_SAFE_INTEGER,
}

export default function useColumns(instance: TableInstance) {
  const {
    options: { columns },
    plugs: { useReduceColumns, useReduceAllColumns, useReduceLeafColumns },
  } = instance

  const prepColumn = (column: TableColumn) => {
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

    column.render = makeRenderer(instance, {
      column,
    })

    column.getWidth = () => instance.getColumnWidth(column.id)
  }

  instance.columns = React.useMemo(() => {
    if (process.env.NODE_ENV !== 'production' && instance.options.debug)
      console.info('Building Columns...')

    if (columns) {
      return recurseColumns(columns)
    }

    return []

    function recurseColumns(
      columns: Column[],
      parent?: TableColumn,
      depth = 0
    ): TableColumn[] {
      return columns.map(column => {
        const tableColumn: TableColumn = {
          ...column,
          parent,
          depth,
          originalColumn: column,
          columns: [],
        }

        tableColumn.columns = column.columns
          ? recurseColumns(column.columns, tableColumn, depth + 1)
          : []

        return tableColumn
      })
    }
  }, [columns, instance.options.debug])

  instance.columns = useReduceColumns(instance.columns, { instance })

  instance.allColumns = React.useMemo(
    () => flattenColumns(instance.columns, true),
    [instance.columns]
  )

  instance.allColumns = useReduceAllColumns(instance.allColumns, {
    instance,
  })

  instance.allColumns = React.useMemo(() => {
    return instance.allColumns.map(column => {
      Object.assign(column, {
        ...defaultColumn,
        ...(instance.options.defaultColumn || {}),
        ...column,
      })

      return column
    })
  }, [instance.allColumns, instance.options.defaultColumn])

  instance.allColumns.forEach(column => {
    prepColumn(column)
    instance.plugs.decorateColumn(column, { instance })
  })

  instance.leafColumns = React.useMemo(
    () =>
      instance.allColumns.filter(
        column => !column.columns || !column.columns.length
      ),
    [instance.allColumns]
  )

  instance.leafColumns = useReduceLeafColumns(instance.leafColumns, {
    instance,
  })

  // Check for duplicate columns
  if (process.env.NODE_ENV !== 'production') {
    const duplicateColumns = instance.leafColumns.filter((column, i) => {
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
