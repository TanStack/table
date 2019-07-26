import { useMemo } from 'react'
import PropTypes from 'prop-types'

import { getBy } from '../utils'

const propTypes = {
  // General
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Cell: PropTypes.any,
      Header: PropTypes.any,
    })
  ),
  defaultColumn: PropTypes.any,
}

// Find the depth of the columns
function findMaxDepth(columns, depth = 0) {
  return columns.reduce((prev, curr) => {
    if (curr.columns) {
      return Math.max(prev, findMaxDepth(curr.columns, depth + 1))
    }
    return depth
  }, 0)
}

function decorateColumn(column, defaultColumn, parent, depth, index) {
  // Apply the defaultColumn
  column = { ...defaultColumn, ...column }

  // First check for string accessor
  let { id, accessor, Header } = column

  if (typeof accessor === 'string') {
    id = id || accessor
    const accessorString = accessor
    accessor = row => getBy(row, accessorString)
  }

  if (!id && typeof Header === 'string') {
    id = Header
  }

  if (!id && column.columns) {
    console.error(column)
    throw new Error('A column ID (or unique "Header" value) is required!')
  }

  if (!id) {
    console.error(column)
    throw new Error('A column ID (or string accessor) is required!')
  }

  column = {
    Header: ({ id }) => id,
    Cell: ({ value }) => value,
    show: true,
    ...column,
    id,
    accessor,
    parent,
    depth,
    index,
  }

  return column
}

// Build the visible columns, headers and flat column list
function decorateColumnTree(columns, defaultColumn, parent, depth = 0) {
  return columns.map((column, columnIndex) => {
    column = decorateColumn(column, defaultColumn, parent, depth, columnIndex)
    if (column.columns) {
      column.columns = decorateColumnTree(
        column.columns,
        defaultColumn,
        column,
        depth + 1
      )
    }
    return column
  })
}

// Build the header groups from the bottom up
function makeHeaderGroups(columns, maxDepth, defaultColumn) {
  const headerGroups = []

  const removeChildColumns = column => {
    delete column.columns
    if (column.parent) {
      removeChildColumns(column.parent)
    }
  }
  columns.forEach(removeChildColumns)

  const buildGroup = (columns, depth = 0) => {
    const headerGroup = {
      headers: [],
    }

    const parentColumns = []

    const hasParents = columns.some(col => col.parent)

    columns.forEach(column => {
      const isFirst = !parentColumns.length
      let latestParentColumn = [...parentColumns].reverse()[0]

      // If the column has a parent, add it if necessary
      if (column.parent) {
        if (isFirst || latestParentColumn.originalID !== column.parent.id) {
          parentColumns.push({
            ...column.parent,
            originalID: column.parent.id,
            id: [column.parent.id, parentColumns.length].join('_'),
          })
        }
      } else if (hasParents) {
        // If other columns have parents, add a place holder if necessary
        const placeholderColumn = decorateColumn(
          {
            originalID: [column.id, 'placeholder', maxDepth - depth].join('_'),
            id: [
              column.id,
              'placeholder',
              maxDepth - depth,
              parentColumns.length,
            ].join('_'),
          },
          defaultColumn
        )
        if (
          isFirst ||
          latestParentColumn.originalID !== placeholderColumn.originalID
        ) {
          parentColumns.push(placeholderColumn)
        }
      }

      // Establish the new columns[] relationship on the parent
      if (column.parent || hasParents) {
        latestParentColumn = [...parentColumns].reverse()[0]
        latestParentColumn.columns = latestParentColumn.columns || []
        if (!latestParentColumn.columns.includes(column)) {
          latestParentColumn.columns.push(column)
        }
      }

      headerGroup.headers.push(column)
    })

    headerGroups.push(headerGroup)

    if (parentColumns.length) {
      buildGroup(parentColumns)
    }
  }

  buildGroup(columns)

  return headerGroups.reverse()
}

export const useColumns = props => {
  const {
    debug,
    columns: userColumns,
    defaultColumn = {},
    state: [{ groupBy }],
  } = props

  PropTypes.checkPropTypes(propTypes, props, 'property', 'useColumns')

  const { columns, headerGroups, headers } = useMemo(() => {
    if (debug) console.info('getColumns')

    // Decorate All the columns
    let columnTree = decorateColumnTree(userColumns, defaultColumn)

    // Get the flat list of all columns
    let columns = flattenBy(columnTree, 'columns')

    columns = [
      ...groupBy.map(g => columns.find(col => col.id === g)),
      ...columns.filter(col => !groupBy.includes(col.id)),
    ]

    // Get headerGroups
    const headerGroups = makeHeaderGroups(
      columns,
      findMaxDepth(columnTree),
      defaultColumn
    )

    const headers = flattenBy(headerGroups, 'headers')

    return {
      columns,
      headerGroups,
      headers,
    }
  }, [debug, defaultColumn, groupBy, userColumns])

  return {
    ...props,
    columns,
    headerGroups,
    headers,
  }

  function flattenBy(columns, childKey) {
    const flatColumns = []

    const recurse = columns => {
      columns.forEach(d => {
        if (!d[childKey]) {
          flatColumns.push(d)
        } else {
          recurse(d[childKey])
        }
      })
    }

    recurse(columns)

    return flatColumns
  }
}
