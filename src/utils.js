import React from 'react'
import { decorateColumn } from './publicUtils'

export * from './publicUtils'

// Find the depth of the columns
export function findMaxDepth(columns, depth = 0) {
  return columns.reduce((prev, curr) => {
    if (curr.columns) {
      return Math.max(prev, findMaxDepth(curr.columns, depth + 1))
    }
    return depth
  }, 0)
}

// Build the visible columns, headers and flat column list
export function decorateColumnTree(columns, defaultColumn, parent, depth = 0) {
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
export function makeHeaderGroups(flatColumns, defaultColumn) {
  const headerGroups = []

  // Build each header group from the bottom up
  const buildGroup = (columns, depth) => {
    const headerGroup = {
      headers: [],
    }

    const parentColumns = []

    // Do any of these columns have parents?
    const hasParents = columns.some(col => col.parent)

    columns.forEach(column => {
      // Are we the first column in this group?
      const isFirst = !parentColumns.length

      // What is the latest (last) parent column?
      let latestParentColumn = [...parentColumns].reverse()[0]

      // If the column has a parent, add it if necessary
      if (column.parent) {
        const similarParentColumns = parentColumns.filter(
          d => d.originalId === column.parent.id
        )
        if (isFirst || latestParentColumn.originalId !== column.parent.id) {
          parentColumns.push({
            ...column.parent,
            originalId: column.parent.id,
            id: [column.parent.id, similarParentColumns.length].join('_'),
          })
        }
      } else if (hasParents) {
        // If other columns have parents, we'll need to add a place holder if necessary
        const originalId = [column.id, 'placeholder'].join('_')
        const similarParentColumns = parentColumns.filter(
          d => d.originalId === originalId
        )
        const placeholderColumn = decorateColumn(
          {
            originalId,
            id: [column.id, 'placeholder', similarParentColumns.length].join(
              '_'
            ),
            placeholderOf: column,
          },
          defaultColumn
        )
        if (
          isFirst ||
          latestParentColumn.originalId !== placeholderColumn.originalId
        ) {
          parentColumns.push(placeholderColumn)
        }
      }

      // Establish the new headers[] relationship on the parent
      if (column.parent || hasParents) {
        latestParentColumn = [...parentColumns].reverse()[0]
        latestParentColumn.headers = latestParentColumn.headers || []
        if (!latestParentColumn.headers.includes(column)) {
          latestParentColumn.headers.push(column)
        }
      }

      column.totalHeaderCount = column.headers
        ? column.headers.reduce(
            (sum, header) => sum + header.totalHeaderCount,
            0
          )
        : 1 // Leaf node columns take up at least one count
      headerGroup.headers.push(column)
    })

    headerGroups.push(headerGroup)

    if (parentColumns.length) {
      buildGroup(parentColumns, depth + 1)
    }
  }

  buildGroup(flatColumns, 0)

  return headerGroups.reverse()
}

export function getFirstDefined(...args) {
  for (let i = 0; i < args.length; i += 1) {
    if (typeof args[i] !== 'undefined') {
      return args[i]
    }
  }
}

export function getElementDimensions(element) {
  const rect = element.getBoundingClientRect()
  const style = window.getComputedStyle(element)
  const margins = {
    left: parseInt(style.marginLeft),
    right: parseInt(style.marginRight),
  }
  const padding = {
    left: parseInt(style.paddingLeft),
    right: parseInt(style.paddingRight),
  }
  return {
    left: Math.ceil(rect.left),
    width: Math.ceil(rect.width),
    outerWidth: Math.ceil(
      rect.width + margins.left + margins.right + padding.left + padding.right
    ),
    marginLeft: margins.left,
    marginRight: margins.right,
    paddingLeft: padding.left,
    paddingRight: padding.right,
    scrollWidth: element.scrollWidth,
  }
}

export function flexRender(Comp, props) {
  return isReactComponent(Comp) ? <Comp {...props} /> : Comp
}

function isClassComponent(component) {
  return (
    typeof component === 'function' &&
    !!(() => {
      let proto = Object.getPrototypeOf(component)
      return proto.prototype && proto.prototype.isReactComponent
    })()
  )
}

function isFunctionComponent(component) {
  return typeof component === 'function'
}

function isReactComponent(component) {
  return isClassComponent(component) || isFunctionComponent(component)
}

export function isFunction(a) {
  if (typeof a === 'function') {
    return a
  }
}

export function flattenBy(columns, childKey) {
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

export function expandRows(
  rows,
  { manualExpandedKey, expanded, expandSubRows = true }
) {
  const expandedRows = []

  const handleRow = row => {
    const key = row.path.join('.')

    row.isExpanded =
      (row.original && row.original[manualExpandedKey]) ||
      expanded.includes(key)

    row.canExpand = row.subRows && !!row.subRows.length

    expandedRows.push(row)

    if (expandSubRows && row.subRows && row.subRows.length && row.isExpanded) {
      row.subRows.forEach(handleRow)
    }
  }

  rows.forEach(handleRow)

  return expandedRows
}
