import React from 'react'

//
import {
  actions,
  applyHooks,
  applyPropHooks,
  mergeProps,
  flexRender,
  decorateColumnTree,
  makeHeaderGroups,
  flattenBy,
  useGetLatest,
  useConsumeHookGetter,
} from '../utils'

import { useColumnVisibility } from './useColumnVisibility'

let renderErr = 'Renderer Error'

const defaultInitialState = {}
const defaultColumnInstance = {}
const defaultReducer = (state, action, prevState) => state
const defaultGetSubRows = (row, index) => row.subRows || []
const defaultGetRowId = (row, index) => index
const defaultUseControlledState = d => d

export const useTable = (props, ...plugins) => {
  // Destructure props
  let {
    data,
    columns: userColumns,
    initialState = defaultInitialState,
    defaultColumn = defaultColumnInstance,
    getSubRows = defaultGetSubRows,
    getRowId = defaultGetRowId,
    stateReducer: userStateReducer = defaultReducer,
    useControlledState = defaultUseControlledState,
  } = props

  plugins = [useColumnVisibility, ...plugins]

  // The table instance
  let instanceRef = React.useRef({})

  Object.assign(instanceRef.current, {
    ...props,
    plugins,
    data,
    hooks: {
      stateReducers: [],
      columnsBeforeHeaderGroups: [],
      columnsBeforeHeaderGroupsDeps: [],
      useInstanceBeforeDimensions: [],
      useInstance: [],
      useRows: [],
      prepareRow: [],
      getTableProps: [],
      getTableBodyProps: [],
      getRowProps: [],
      getHeaderGroupProps: [],
      getFooterGroupProps: [],
      getHeaderProps: [],
      getFooterProps: [],
      getCellProps: [],
    },
  })

  // Allow plugins to register hooks as early as possible
  plugins.filter(Boolean).forEach(plugin => {
    plugin(instanceRef.current.hooks)
  })

  // Snapshot hook and disallow more from being added
  const getStateReducers = useConsumeHookGetter(
    instanceRef.current.hooks,
    'stateReducers'
  )

  // Setup user reducer ref
  const getUserStateReducer = useGetLatest(userStateReducer)

  // Build the reducer
  const reducer = React.useCallback(
    (state, action) => {
      // Detect invalid actions
      if (!action.type) {
        console.info({ action })
        throw new Error('Unknown Action 👆')
      }

      // Reduce the state from all plugin reducers
      return [
        ...getStateReducers(),
        // Allow the user to add their own state reducer(s)
        ...(Array.isArray(getUserStateReducer())
          ? getUserStateReducer()
          : [getUserStateReducer()]),
      ].reduce(
        (s, handler) => handler(s, action, state, instanceRef) || s,
        state
      )
    },
    [getStateReducers, getUserStateReducer]
  )

  // Start the reducer
  const [reducerState, dispatch] = React.useReducer(reducer, undefined, () =>
    reducer(initialState, { type: actions.init })
  )

  // Allow the user to control the final state with hooks
  const state = useControlledState(reducerState)

  Object.assign(instanceRef.current, {
    state, // The state dispatcher
    dispatch, // The resolved table state
  })

  // Decorate All the columns
  let columns = React.useMemo(
    () => decorateColumnTree(userColumns, defaultColumn),
    [defaultColumn, userColumns]
  )

  // Snapshot hook and disallow more from being added
  const getColumnsBeforeHeaderGroups = useConsumeHookGetter(
    instanceRef.current.hooks,
    'columnsBeforeHeaderGroups'
  )

  // Snapshot hook and disallow more from being added
  const getColumnsBeforeHeaderGroupsDeps = useConsumeHookGetter(
    instanceRef.current.hooks,
    'columnsBeforeHeaderGroupsDeps'
  )

  // Get the flat list of all columns and allow hooks to decorate
  // those columns (and trigger this memoization via deps)
  let flatColumns = React.useMemo(() => {
    let newColumns = applyHooks(
      getColumnsBeforeHeaderGroups(),
      flattenBy(columns, 'columns'),
      instanceRef.current
    )

    return newColumns
  }, [
    columns,
    getColumnsBeforeHeaderGroups,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...getColumnsBeforeHeaderGroupsDeps(),
  ])

  // Make the headerGroups
  const headerGroups = React.useMemo(
    () => makeHeaderGroups(flatColumns, defaultColumn),
    [defaultColumn, flatColumns]
  )

  const headers = React.useMemo(
    () => (headerGroups.length ? headerGroups[0].headers : []),
    [headerGroups]
  )

  Object.assign(instanceRef.current, {
    columns,
    flatColumns,
    headerGroups,
    headers,
  })

  // Access the row model
  const [rows, flatRows] = React.useMemo(() => {
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

    return [accessedData, flatRows]
  }, [data, getRowId, getSubRows, flatColumns])

  instanceRef.current.rows = rows
  instanceRef.current.flatRows = flatRows

  // Provide a flat header list for utilities
  instanceRef.current.flatHeaders = headerGroups.reduce(
    (all, headerGroup) => [...all, ...headerGroup.headers],
    []
  )

  // Snapshot hook and disallow more from being added
  const getUseInstanceBeforeDimensions = useConsumeHookGetter(
    instanceRef.current.hooks,
    'useInstanceBeforeDimensions'
  )

  instanceRef.current = applyHooks(
    getUseInstanceBeforeDimensions(),
    instanceRef.current
  )

  // Header Visibility is needed by this point
  calculateDimensions(instanceRef.current)

  // Snapshot hook and disallow more from being added
  const getUseInstance = useConsumeHookGetter(
    instanceRef.current.hooks,
    'useInstance'
  )

  instanceRef.current = applyHooks(getUseInstance(), instanceRef.current)

  // Snapshot hook and disallow more from being added
  const getHeaderPropsHooks = useConsumeHookGetter(
    instanceRef.current.hooks,
    'getHeaderProps'
  )

  // Snapshot hook and disallow more from being added
  const getFooterPropsHooks = useConsumeHookGetter(
    instanceRef.current.hooks,
    'getFooterProps'
  )

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
        applyPropHooks(getHeaderPropsHooks(), column, instanceRef.current),
        props
      )

    // Give columns/headers a default getFooterProps
    column.getFooterProps = props =>
      mergeProps(
        {
          key: ['footer', column.id].join('_'),
          colSpan: column.totalVisibleHeaderCount,
        },
        applyPropHooks(getFooterPropsHooks(), column, instanceRef.current),
        props
      )
  })

  // Snapshot hook and disallow more from being added
  const getHeaderGroupPropsHooks = useConsumeHookGetter(
    instanceRef.current.hooks,
    'getHeaderGroupProps'
  )

  // Snapshot hook and disallow more from being added
  const getFooterGroupsPropsHooks = useConsumeHookGetter(
    instanceRef.current.hooks,
    'getFooterGroupProps'
  )

  instanceRef.current.headerGroups = instanceRef.current.headerGroups.filter(
    (headerGroup, i) => {
      // Filter out any headers and headerGroups that don't have visible columns
      headerGroup.headers = headerGroup.headers.filter(column => {
        const recurse = headers =>
          headers.filter(column => {
            if (column.headers) {
              return recurse(column.headers)
            }
            return column.isVisible
          }).length
        if (column.headers) {
          return recurse(column.headers)
        }
        return column.isVisible
      })

      // Give headerGroups getRowProps
      if (headerGroup.headers.length) {
        headerGroup.getHeaderGroupProps = (props = {}) =>
          mergeProps(
            {
              key: [`header${i}`].join('_'),
            },
            applyPropHooks(
              getHeaderGroupPropsHooks(),
              headerGroup,
              instanceRef.current
            ),
            props
          )

        headerGroup.getFooterGroupProps = (props = {}) =>
          mergeProps(
            {
              key: [`footer${i}`].join('_'),
            },
            applyPropHooks(
              getFooterGroupsPropsHooks(),
              headerGroup,
              instanceRef.current
            ),
            props
          )

        return true
      }

      return false
    }
  )

  instanceRef.current.footerGroups = [
    ...instanceRef.current.headerGroups,
  ].reverse()

  // Run the rows (this could be a dangerous hook with a ton of data)

  // Snapshot hook and disallow more from being added
  const getUseRowsHooks = useConsumeHookGetter(
    instanceRef.current.hooks,
    'useRows'
  )

  instanceRef.current.rows = applyHooks(
    getUseRowsHooks(),
    instanceRef.current.rows,
    instanceRef.current
  )

  // The prepareRow function is absolutely necessary and MUST be called on
  // any rows the user wishes to be displayed.

  // Snapshot hook and disallow more from being added
  const getPrepareRowHooks = useConsumeHookGetter(
    instanceRef.current.hooks,
    'prepareRow'
  )

  // Snapshot hook and disallow more from being added
  const getRowPropsHooks = useConsumeHookGetter(
    instanceRef.current.hooks,
    'getRowProps'
  )

  // Snapshot hook and disallow more from being added
  const getCellPropsHooks = useConsumeHookGetter(
    instanceRef.current.hooks,
    'getCellProps'
  )

  instanceRef.current.prepareRow = React.useCallback(
    row => {
      row.getRowProps = props =>
        mergeProps(
          { key: ['row', ...row.path].join('_') },
          applyPropHooks(getRowPropsHooks(), row, instanceRef.current),
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
              applyPropHooks(getCellPropsHooks(), cell, instanceRef.current),
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
      applyHooks(getPrepareRowHooks(), row, instanceRef.current)
    },
    [getCellPropsHooks, getPrepareRowHooks, getRowPropsHooks]
  )

  // Snapshot hook and disallow more from being added
  const getTablePropsHooks = useConsumeHookGetter(
    instanceRef.current.hooks,
    'getTableProps'
  )

  instanceRef.current.getTableProps = userProps =>
    mergeProps(
      applyPropHooks(getTablePropsHooks(), instanceRef.current),
      userProps
    )

  // Snapshot hook and disallow more from being added
  const getTableBodyPropsHooks = useConsumeHookGetter(
    instanceRef.current.hooks,
    'getTableBodyProps'
  )

  instanceRef.current.getTableBodyProps = userProps =>
    mergeProps(
      applyPropHooks(getTableBodyPropsHooks(), instanceRef.current),
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
