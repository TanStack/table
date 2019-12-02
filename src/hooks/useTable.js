import React from 'react'

//
import {
  applyHooks,
  applyPropHooks,
  mergeProps,
  flexRender,
  decorateColumnTree,
  makeHeaderGroups,
  flattenBy,
  determineHeaderVisibility,
} from '../utils'

const renderErr =
  'You must specify a valid render component. This could be "column.Cell", "column.Header", "column.Filter", "column.Aggregated" or any other custom renderer component.'

export const actions = {
  init: 'init',
}
export const defaultState = {}
export const reducerHandlers = {}

const defaultInitialState = {}
const defaultColumnInstance = {}
const defaultReducer = (state, action, prevState) => state
const defaultGetSubRows = (row, index) => row.subRows || []
const defaultGetRowId = (row, index) => index

export const useTable = (props, ...plugins) => {
  // Destructure props
  let {
    data,
    columns: userColumns,
    initialState = defaultInitialState,
    defaultColumn = defaultColumnInstance,
    getSubRows = defaultGetSubRows,
    getRowId = defaultGetRowId,
    reducer: userReducer = defaultReducer,
    debug,
  } = props

  debug = process.env.NODE_ENV === 'production' ? false : debug

  const reducer = (state, action) => {
    let nextState = Object.keys(reducerHandlers)
      .map(key => reducerHandlers[key])
      .reduce((state, handler) => handler(state, action) || state, state)

    nextState = userReducer(nextState, action, state)

    if (process.env.NODE_ENV !== 'production' && debug) {
      console.log('')
      console.log('React Table Action: ', action)
      console.log('New State: ', nextState)
    }
    return nextState
  }

  // But use the users table state if provided
  const [state, originalDispatch] = React.useReducer(reducer, undefined, () =>
    reducer(initialState, { type: actions.init })
  )

  // The table instance ref
  let instanceRef = React.useRef({})

  const dispatch = React.useCallback(action => {
    if (!action.type) {
      if (process.env.NODE_ENV !== 'production') {
        console.info({ action })
        throw new Error('Unknown Action Type! 👆')
      }
      throw new Error()
    }
    originalDispatch({ ...action, instanceRef })
  }, [])

  Object.assign(instanceRef.current, {
    ...props,
    data, // The raw data
    state, // The state dispatcher
    dispatch, // The resolved table state
    plugins, // All resolved plugins
    hooks: {
      columnsBeforeHeaderGroups: [],
      columnsBeforeHeaderGroupsDeps: [],
      useBeforeDimensions: [],
      useMain: [],
      useRows: [],
      prepareRow: [],
      getTableProps: [],
      getTableBodyProps: [],
      getRowProps: [],
      getHeaderGroupProps: [],
      getHeaderProps: [],
      getCellProps: [],
    },
  })

  // Allow plugins to register hooks
  if (process.env.NODE_ENV !== 'production' && debug) console.time('plugins')

  plugins.filter(Boolean).forEach(plugin => {
    plugin(instanceRef.current.hooks)
  })

  if (process.env.NODE_ENV !== 'production' && debug) console.timeEnd('plugins')

  // Decorate All the columns
  let columns = React.useMemo(
    () => decorateColumnTree(userColumns, defaultColumn),
    [defaultColumn, userColumns]
  )

  // Get the flat list of all columns and allow hooks to decorate
  // those columns (and trigger this memoization via deps)
  let flatColumns = React.useMemo(() => {
    if (process.env.NODE_ENV !== 'production' && debug)
      console.time('hooks.columnsBeforeHeaderGroups')

    let newColumns = applyHooks(
      instanceRef.current.hooks.columnsBeforeHeaderGroups,
      flattenBy(columns, 'columns'),
      instanceRef.current
    )

    if (process.env.NODE_ENV !== 'production' && debug)
      console.timeEnd('hooks.columnsBeforeHeaderGroups')
    return newColumns
  }, [
    columns,
    debug,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...applyHooks(
      instanceRef.current.hooks.columnsBeforeHeaderGroupsDeps,
      [],
      instanceRef.current
    ),
  ])

  // Make the headerGroups
  const headerGroups = React.useMemo(
    () => makeHeaderGroups(flatColumns, defaultColumn),
    [defaultColumn, flatColumns]
  )

  const headers = React.useMemo(() => headerGroups[0].headers, [headerGroups])

  Object.assign(instanceRef.current, {
    columns,
    flatColumns,
    headerGroups,
    headers,
  })

  // Access the row model
  const [rows, flatRows] = React.useMemo(() => {
    if (process.env.NODE_ENV !== 'production' && debug)
      console.time('getAccessedRows')

    let flatRows = []

    // Access the row's data
    const accessRow = (originalRow, i, depth = 0, parentPath = []) => {
      // Keep the original reference around
      const original = originalRow

      const rowId = getRowId(originalRow, i)

      // Make the new path for the row
      const path = [...parentPath, rowId]

      const row = {
        original,
        index: i,
        path, // used to create a key for each row even if not nested
        depth,
        cells: [{}], // This is a dummy cell
      }

      flatRows.push(row)

      // Process any subRows
      let subRows = getSubRows(originalRow, i)

      if (subRows) {
        row.subRows = subRows.map((d, i) => accessRow(d, i, depth + 1, path))
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
      flatColumns.forEach(column => {
        row.values[column.id] = column.accessor
          ? column.accessor(originalRow, i, { subRows, depth, data })
          : undefined
      })

      return row
    }

    // Use the resolved data
    const accessedData = data.map((d, i) => accessRow(d, i))
    if (process.env.NODE_ENV !== 'production' && debug)
      console.timeEnd('getAccessedRows')
    return [accessedData, flatRows]
  }, [debug, data, getRowId, getSubRows, flatColumns])

  instanceRef.current.rows = rows
  instanceRef.current.flatRows = flatRows

  // Determine column visibility
  determineHeaderVisibility(instanceRef.current)

  // Provide a flat header list for utilities
  instanceRef.current.flatHeaders = headerGroups.reduce(
    (all, headerGroup) => [...all, ...headerGroup.headers],
    []
  )

  if (process.env.NODE_ENV !== 'production' && debug)
    console.time('hooks.useBeforeDimensions')
  instanceRef.current = applyHooks(
    instanceRef.current.hooks.useBeforeDimensions,
    instanceRef.current
  )
  if (process.env.NODE_ENV !== 'production' && debug)
    console.timeEnd('hooks.useBeforeDimensions')

  calculateDimensions(instanceRef.current)

  if (process.env.NODE_ENV !== 'production' && debug)
    console.time('hooks.useMain')
  instanceRef.current = applyHooks(
    instanceRef.current.hooks.useMain,
    instanceRef.current
  )
  if (process.env.NODE_ENV !== 'production' && debug)
    console.timeEnd('hooks.useMain')

  // Each materialized header needs to be assigned a render function and other
  // prop getter properties here.
  instanceRef.current.flatHeaders.forEach(column => {
    // Give columns/headers rendering power
    column.render = (type, userProps = {}) => {
      const Comp = typeof type === 'string' ? column[type] : type

      if (typeof Comp === 'undefined') {
        throw new Error(renderErr)
      }

      return flexRender(Comp, {
        ...instanceRef.current,
        column,
        ...userProps,
      })
    }

    // Give columns/headers a default getHeaderProps
    column.getHeaderProps = props =>
      mergeProps(
        {
          key: ['header', column.id].join('_'),
          colSpan: column.totalVisibleHeaderCount,
        },
        applyPropHooks(
          instanceRef.current.hooks.getHeaderProps,
          column,
          instanceRef.current
        ),
        props
      )
  })

  instanceRef.current.headerGroups.forEach((headerGroup, i) => {
    // Filter out any headers and headerGroups that don't have visible columns
    headerGroup.headers = headerGroup.headers.filter(header => {
      const recurse = headers =>
        headers.filter(header => {
          if (header.headers) {
            return recurse(header.headers)
          }
          return header.isVisible
        }).length
      if (header.headers) {
        return recurse(header.headers)
      }
      return header.isVisible
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
  })

  // Run the rows (this could be a dangerous hook with a ton of data)
  if (process.env.NODE_ENV !== 'production' && debug)
    console.time('hooks.useRows')
  instanceRef.current.rows = applyHooks(
    instanceRef.current.hooks.useRows,
    instanceRef.current.rows,
    instanceRef.current
  )
  if (process.env.NODE_ENV !== 'production' && debug)
    console.timeEnd('hooks.useRows')

  // The prepareRow function is absolutely necessary and MUST be called on
  // any rows the user wishes to be displayed.

  instanceRef.current.prepareRow = React.useCallback(row => {
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

    // Build the visible cells for each row
    row.cells = instanceRef.current.flatColumns
      .filter(d => d.isVisible)
      .map(column => {
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
            column,
            row,
            cell,
            ...userProps,
          })
        }

        return cell
      })

    // need to apply any row specific hooks (useExpanded requires this)
    applyHooks(instanceRef.current.hooks.prepareRow, row, instanceRef.current)
  }, [])

  instanceRef.current.getTableProps = userProps =>
    mergeProps(
      applyPropHooks(
        instanceRef.current.hooks.getTableProps,
        instanceRef.current
      ),
      userProps
    )

  instanceRef.current.getTableBodyProps = userProps =>
    mergeProps(
      applyPropHooks(
        instanceRef.current.hooks.getTableBodyProps,
        instanceRef.current
      ),
      userProps
    )

  return instanceRef.current
}

function calculateDimensions(instance) {
  const { headers } = instance

  instance.totalColumnsWidth = calculateHeaderWidths(headers)
}

function calculateHeaderWidths(headers, left = 0) {
  let sumTotalWidth = 0

  headers.forEach(header => {
    let { headers: subHeaders } = header

    header.totalLeft = left

    if (subHeaders && subHeaders.length) {
      header.totalWidth = calculateHeaderWidths(subHeaders, left)
    } else {
      header.totalWidth = Math.min(
        Math.max(header.minWidth, header.width),
        header.maxWidth
      )
    }
    if (header.isVisible) {
      left += header.totalWidth
      sumTotalWidth += header.totalWidth
    }
  })

  return sumTotalWidth
}
