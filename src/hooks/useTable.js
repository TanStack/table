import React from 'react'
import PropTypes from 'prop-types'
//
import {
  applyHooks,
  applyPropHooks,
  mergeProps,
  flexRender,
  decorateColumnTree,
  makeHeaderGroups,
  findMaxDepth,
} from '../utils'

import { useTableState } from './useTableState'

const propTypes = {
  // General
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Cell: PropTypes.any,
      Header: PropTypes.any,
    })
  ).isRequired,
  defaultColumn: PropTypes.object,
  subRowsKey: PropTypes.string,
  debug: PropTypes.bool,
}

const renderErr =
  'You must specify a valid render component. This could be "column.Cell", "column.Header", "column.Filter", "column.Aggregated" or any other custom renderer component.'

export const useTable = (props, ...plugins) => {
  // Validate props
  PropTypes.checkPropTypes(propTypes, props, 'property', 'useTable')

  // Destructure props
  let {
    data,
    state: userState,
    columns: userColumns,
    defaultColumn = {},
    subRowsKey = 'subRows',
    debug,
  } = props

  debug = process.env.NODE_ENV === 'production' ? false : debug

  // Always provide a default state
  const defaultState = useTableState()

  // But use the users state if provided
  const state = userState || defaultState

  // These are hooks that plugins can use right before render
  const hooks = {
    beforeRender: [],
    columns: [],
    headers: [],
    headerGroups: [],
    rows: [],
    row: [],
    getTableProps: [],
    getRowProps: [],
    getHeaderGroupProps: [],
    getHeaderProps: [],
    getCellProps: [],
  }

  // The initial api
  let api = {
    ...props,
    data,
    state,
    hooks,
    plugins,
  }

  if (debug) console.time('hooks')
  // Loop through plugins to build the api out
  api = plugins.filter(Boolean).reduce((prev, next) => next(prev), api)
  if (debug) console.timeEnd('hooks')

  // Compute columns, headerGroups and headers
  const columnInfo = React.useMemo(
    () => {
      if (debug) console.info('buildColumns/headerGroup/headers')
      // Decorate All the columns
      let columnTree = decorateColumnTree(userColumns, defaultColumn)

      // Get the flat list of all columns
      let columns = flattenBy(columnTree, 'columns')

      // Allow hooks to decorate columns
      if (debug) console.time('hooks.columnsBeforeHeaderGroups')
      columns = applyHooks(api.hooks.columnsBeforeHeaderGroups, columns, api)
      if (debug) console.timeEnd('hooks.columnsBeforeHeaderGroups')

      // Make the headerGroups
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
    },
    [api, debug, defaultColumn, userColumns]
  )

  // Place the columns, headerGroups and headers on the api
  Object.assign(api, columnInfo)

  // Access the row model
  api.rows = React.useMemo(
    () => {
      if (debug) console.info('getAccessedRows')

      // Access the row's data
      const accessRow = (originalRow, i, depth = 0) => {
        // Keep the original reference around
        const original = originalRow

        // Process any subRows
        const subRows = originalRow[subRowsKey]
          ? originalRow[subRowsKey].map((d, i) => accessRow(d, i, depth + 1))
          : undefined

        const row = {
          original,
          index: i,
          path: [i], // used to create a key for each row even if not nested
          subRows,
          depth,
          cells: [{}], // This is a dummy cell
        }

        // Override common array functions (and the dummy cell's getCellProps function)
        // to show an error if it is accessed without calling prepareRow
        const unpreparedAccessWarning = () => {
          throw new Error(
            'React-Table: You have not called prepareRow(row) one or more rows you are attempting to render.'
          )
        }
        row.cells.map = unpreparedAccessWarning
        row.cells.filter = unpreparedAccessWarning
        row.cells.forEach = unpreparedAccessWarning
        row.cells[0].getCellProps = unpreparedAccessWarning

        // Create the cells and values
        row.values = {}
        api.columns.forEach(column => {
          row.values[column.id] = column.accessor
            ? column.accessor(originalRow, i, { subRows, depth, data })
            : undefined
        })

        return row
      }

      // Use the resolved data
      return data.map((d, i) => accessRow(d, i))
    },
    [debug, data, subRowsKey, api.columns]
  )

  // Determine column visibility
  api.columns.forEach(column => {
    column.visible =
      typeof column.show === 'function' ? column.show(api) : !!column.show
  })

  // Allow hooks to decorate columns
  if (debug) console.time('hooks.columns')
  api.columns = applyHooks(api.hooks.columns, api.columns, api)
  if (debug) console.timeEnd('hooks.columns')

  // Allow hooks to decorate headers
  if (debug) console.time('hooks.headers')
  api.headers = applyHooks(api.hooks.headers, api.headers, api)
  if (debug) console.timeEnd('hooks.headers')
  ;[...api.columns, ...api.headers].forEach(column => {
    // Give columns/headers rendering power
    column.render = (type, userProps = {}) => {
      const Comp = typeof type === 'string' ? column[type] : type

      if (typeof Comp === 'undefined') {
        throw new Error(renderErr)
      }

      return flexRender(Comp, {
        ...api,
        ...column,
        ...userProps,
      })
    }

    // Give columns/headers a default getHeaderProps
    column.getHeaderProps = props =>
      mergeProps(
        {
          key: ['header', column.id].join('_'),
          colSpan: column.columns ? column.columns.length : 1,
        },
        applyPropHooks(api.hooks.getHeaderProps, column, api),
        props
      )
  })

  // Allow hooks to decorate headerGroups
  if (debug) console.time('hooks.headerGroups')
  api.headerGroups = applyHooks(
    api.hooks.headerGroups,
    api.headerGroups,
    api
  ).filter((headerGroup, i) => {
    // Filter out any headers and headerGroups that don't have visible columns
    headerGroup.headers = headerGroup.headers.filter(header => {
      const recurse = columns =>
        columns.filter(column => {
          if (column.columns) {
            return recurse(column.columns)
          }
          return column.visible
        }).length
      if (header.columns) {
        return recurse(header.columns)
      }
      return header.visible
    })

    // Give headerGroups getRowProps
    if (headerGroup.headers.length) {
      headerGroup.getHeaderGroupProps = (props = {}) =>
        mergeProps(
          {
            key: [`header${i}`].join('_'),
          },
          applyPropHooks(api.hooks.getHeaderGroupProps, headerGroup, api),
          props
        )
      return true
    }

    return false
  })
  if (debug) console.timeEnd('hooks.headerGroups')

  // Run the rows (this could be a dangerous hook with a ton of data)
  if (debug) console.time('hooks.rows')
  api.rows = applyHooks(api.hooks.rows, api.rows, api)
  if (debug) console.timeEnd('hooks.rows')

  // The prepareRow function is absolutely necessary and MUST be called on
  // any rows the user wishes to be displayed.

  api.prepareRow = row => {
    const { path } = row
    row.getRowProps = props =>
      mergeProps(
        { key: ['row', ...path].join('_') },
        applyPropHooks(api.hooks.getRowProps, row, api),
        props
      )

    // need to apply any row specific hooks (useExpanded requires this)
    applyHooks(api.hooks.row, row, api)

    const visibleColumns = api.columns.filter(column => column.visible)

    // Build the cells for each row
    row.cells = visibleColumns.map(column => {
      const cell = {
        column,
        row,
        value: row.values[column.id],
      }

      // Give each cell a getCellProps base
      cell.getCellProps = props => {
        const columnPathStr = [path, column.id].join('_')
        return mergeProps(
          {
            key: ['cell', columnPathStr].join('_'),
          },
          applyPropHooks(api.hooks.getCellProps, cell, api),
          props
        )
      }

      // Give each cell a renderer function (supports multiple renderers)
      cell.render = (type, userProps = {}) => {
        const Comp = typeof type === 'string' ? column[type] : type

        if (typeof Comp === 'undefined') {
          throw new Error(renderErr)
        }

        return flexRender(Comp, {
          ...api,
          ...cell,
          ...userProps,
        })
      }

      return cell
    })
  }

  api.getTableProps = userProps =>
    mergeProps(applyPropHooks(api.hooks.getTableProps, api), userProps)

  return api
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
