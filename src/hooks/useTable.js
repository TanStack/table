import PropTypes from 'prop-types'
//
import { applyHooks, applyPropHooks, mergeProps, flexRender } from '../utils'

import { useTableState } from './useTableState'
import { useColumns } from './useColumns'
import { useRows } from './useRows'

const propTypes = {
  // General
  data: PropTypes.array.isRequired,
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
    useColumns: userUseColumns = useColumns,
    useRows: userUseRows = useRows,
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
  }

  if (debug) console.time('hooks')
  // Loop through plugins to build the api out
  api = [userUseColumns, userUseRows, ...plugins]
    .filter(Boolean)
    .reduce((prev, next) => next(prev), api)
  if (debug) console.timeEnd('hooks')

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
