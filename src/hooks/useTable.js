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
  flattenBy,
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

  // The initial api
  let instanceRef = React.useRef({})

  Object.assign(instanceRef.current, {
    ...props,
    data,
    state,
    plugins,
    hooks: {
      columnsBeforeHeaderGroups: [],
      columnsBeforeHeaderGroupsDeps: [],
      useMain: [],
      useColumns: [],
      useHeaders: [],
      useHeaderGroups: [],
      useRows: [],
      prepareRow: [],
      getTableProps: [],
      getRowProps: [],
      getHeaderGroupProps: [],
      getHeaderProps: [],
      getCellProps: [],
    },
  })

  // Allow plugins to register hooks
  if (debug) console.time('plugins')
  plugins.filter(Boolean).forEach(plugin => {
    plugin(instanceRef.current.hooks)
  })
  if (debug) console.timeEnd('plugins')

  if (debug) console.info('buildColumns/headerGroup/headers')
  // Decorate All the columns
  let columnTree = React.useMemo(
    () => decorateColumnTree(userColumns, defaultColumn),
    [defaultColumn, userColumns]
  )

  // Get the flat list of all columns
  let columns = React.useMemo(() => flattenBy(columnTree, 'columns'), [
    columnTree,
  ])

  // Allow hooks to decorate columns (and trigger this memoization via deps)
  columns = React.useMemo(
    () => {
      if (debug) console.time('hooks.columnsBeforeHeaderGroups')
      const newColumns = applyHooks(
        instanceRef.current.hooks.columnsBeforeHeaderGroups,
        columns,
        instanceRef.current
      )
      if (debug) console.timeEnd('hooks.columnsBeforeHeaderGroups')
      return newColumns
    },
    [
      columns,
      debug,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ...applyHooks(
        instanceRef.current.hooks.columnsBeforeHeaderGroupsDeps,
        [],
        instanceRef.current
      ),
    ]
  )

  // Make the headerGroups
  const headerGroups = React.useMemo(
    () => makeHeaderGroups(columns, findMaxDepth(columnTree), defaultColumn),
    [columnTree, columns, defaultColumn]
  )

  const headers = React.useMemo(() => flattenBy(headerGroups, 'headers'), [
    headerGroups,
  ])

  Object.assign(instanceRef.current, {
    columns,
    headerGroups,
    headers,
  })

  // Access the row model
  instanceRef.current.rows = React.useMemo(
    () => {
      if (debug) console.time('getAccessedRows')
      // Access the row's data
      const accessRow = (originalRow, i, depth = 0, parentPath = []) => {
        // Keep the original reference around
        const original = originalRow

        // Make the new path for the row
        const path = [...parentPath, i]

        // Process any subRows
        const subRows = originalRow[subRowsKey]
          ? originalRow[subRowsKey].map((d, i) =>
              accessRow(d, i, depth + 1, path)
            )
          : []

        const row = {
          original,
          index: i,
          path, // used to create a key for each row even if not nested
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
        instanceRef.current.columns.forEach(column => {
          row.values[column.id] = column.accessor
            ? column.accessor(originalRow, i, { subRows, depth, data })
            : undefined
        })

        return row
      }

      // Use the resolved data
      const accessedData = data.map((d, i) => accessRow(d, i))
      if (debug) console.timeEnd('getAccessedRows')
      return accessedData
    },
    [debug, data, subRowsKey]
  )

  // Determine column visibility
  instanceRef.current.columns.forEach(column => {
    column.visible =
      typeof column.show === 'function'
        ? column.show(instanceRef.current)
        : !!column.show
  })

  if (debug) console.time('hooks.useMain')
  instanceRef.current = applyHooks(
    instanceRef.current.hooks.useMain,
    instanceRef.current
  )
  if (debug)
    console.timeEnd('hooks.useMain')

    // // Allow hooks to decorate columns
    // if (debug) console.time('hooks.useColumns')
    // instanceRef.current.columns = applyHooks(
    //   instanceRef.current.hooks.useColumns,
    //   instanceRef.current.columns,
    //   instanceRef.current
    // )
    // if (debug) console.timeEnd('hooks.useColumns')

    // // Allow hooks to decorate headers
    // if (debug) console.time('hooks.useHeaders')
    // instanceRef.current.headers = applyHooks(
    //   instanceRef.current.hooks.useHeaders,
    //   instanceRef.current.headers,
    //   instanceRef.current
    // )
    // if (debug) console.timeEnd('hooks.useHeaders')
  ;[...instanceRef.current.columns, ...instanceRef.current.headers].forEach(
    column => {
      // Give columns/headers rendering power
      column.render = (type, userProps = {}) => {
        const Comp = typeof type === 'string' ? column[type] : type

        if (typeof Comp === 'undefined') {
          throw new Error(renderErr)
        }

        return flexRender(Comp, {
          ...instanceRef.current,
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
          applyPropHooks(
            instanceRef.current.hooks.getHeaderProps,
            column,
            instanceRef.current
          ),
          props
        )
    }
  )

  // // Allow hooks to decorate headerGroups
  // if (debug) console.time('hooks.useHeaderGroups')
  // instanceRef.current.headerGroups = applyHooks(
  //   instanceRef.current.hooks.useHeaderGroups,
  //   instanceRef.current.headerGroups,
  //   instanceRef.current
  // )

  instanceRef.current.headerGroups.filter((headerGroup, i) => {
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
          applyPropHooks(
            instanceRef.current.hooks.getHeaderGroupProps,
            headerGroup,
            instanceRef.current
          ),
          props
        )
      return true
    }

    return false
  })
  // if (debug) console.timeEnd('hooks.useHeaderGroups')

  // Run the rows (this could be a dangerous hook with a ton of data)
  if (debug) console.time('hooks.useRows')
  instanceRef.current.rows = applyHooks(
    instanceRef.current.hooks.useRows,
    instanceRef.current.rows,
    instanceRef.current
  )
  if (debug) console.timeEnd('hooks.useRows')

  // The prepareRow function is absolutely necessary and MUST be called on
  // any rows the user wishes to be displayed.

  instanceRef.current.prepareRow = row => {
    row.getRowProps = props =>
      mergeProps(
        { key: ['row', ...row.path].join('_') },
        applyPropHooks(
          instanceRef.current.hooks.getRowProps,
          row,
          instanceRef.current
        ),
        props
      )

    const visibleColumns = instanceRef.current.columns.filter(
      column => column.visible
    )

    // Build the cells for each row
    row.cells = visibleColumns.map(column => {
      const cell = {
        column,
        row,
        value: row.values[column.id],
      }

      // Give each cell a getCellProps base
      cell.getCellProps = props => {
        const columnPathStr = [...row.path, column.id].join('_')
        return mergeProps(
          {
            key: ['cell', columnPathStr].join('_'),
          },
          applyPropHooks(
            instanceRef.current.hooks.getCellProps,
            cell,
            instanceRef.current
          ),
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
          ...instanceRef.current,
          ...cell,
          ...userProps,
        })
      }

      return cell
    })

    // need to apply any row specific hooks (useExpanded requires this)
    applyHooks(instanceRef.current.hooks.prepareRow, row, instanceRef.current)
  }

  instanceRef.current.getTableProps = userProps =>
    mergeProps(
      applyPropHooks(
        instanceRef.current.hooks.getTableProps,
        instanceRef.current
      ),
      userProps
    )

  return instanceRef.current
}
