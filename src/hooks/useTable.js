import React from 'react'

//
import {
  actions,
  reduceHooks,
  loopHooks,
  makePropGetter,
  makeRenderer,
  decorateColumnTree,
  makeHeaderGroups,
  flattenBy,
  useGetLatest,
  useConsumeHookGetter,
} from '../utils'

import makeDefaultPluginHooks from '../makeDefaultPluginHooks'

import { useColumnVisibility } from './useColumnVisibility'

const defaultInitialState = {}
const defaultColumnInstance = {}
const defaultReducer = (state, action, prevState) => state
const defaultGetSubRows = (row, index) => row.subRows || []
const defaultGetRowId = (row, index, parent) =>
  `${parent ? [parent.id, index].join('.') : index}`
const defaultUseControlledState = d => d

function applyDefaults(props) {
  const {
    initialState = defaultInitialState,
    defaultColumn = defaultColumnInstance,
    getSubRows = defaultGetSubRows,
    getRowId = defaultGetRowId,
    stateReducer = defaultReducer,
    useControlledState = defaultUseControlledState,
    ...rest
  } = props

  return {
    ...rest,
    initialState,
    defaultColumn,
    getSubRows,
    getRowId,
    stateReducer,
    useControlledState,
  }
}

export const useTable = (props, ...plugins) => {
  // Apply default props
  props = applyDefaults(props)

  // Add core plugins
  plugins = [useColumnVisibility, ...plugins]

  // Create the table instance
  let instanceRef = React.useRef({})

  // Create a getter for the instance (helps avoid a lot of potential memory leaks)
  const getInstance = useGetLatest(instanceRef.current)

  // Assign the props, plugins and hooks to the instance
  Object.assign(getInstance(), {
    ...props,
    plugins,
    hooks: makeDefaultPluginHooks(),
  })

  // Allow plugins to register hooks as early as possible
  plugins.filter(Boolean).forEach(plugin => {
    plugin(getInstance().hooks)
  })

  const getUseOptionsHooks = useConsumeHookGetter(
    getInstance().hooks,
    'useOptions'
  )

  // Allow useOptions hooks to modify the options coming into the table
  Object.assign(
    getInstance(),
    reduceHooks(getUseOptionsHooks(), applyDefaults(props))
  )

  const {
    data,
    columns: userColumns,
    initialState,
    defaultColumn,
    getSubRows,
    getRowId,
    stateReducer,
    useControlledState,
  } = getInstance()

  // Snapshot hook and disallow more from being added
  const getStateReducers = useConsumeHookGetter(
    getInstance().hooks,
    'stateReducers'
  )

  // Setup user reducer ref
  const getStateReducer = useGetLatest(stateReducer)

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
        ...(Array.isArray(getStateReducer())
          ? getStateReducer()
          : [getStateReducer()]),
      ].reduce(
        (s, handler) => handler(s, action, state, getInstance()) || s,
        state
      )
    },
    [getStateReducers, getStateReducer, getInstance]
  )

  // Start the reducer
  const [reducerState, dispatch] = React.useReducer(reducer, undefined, () =>
    reducer(initialState, { type: actions.init })
  )

  // Snapshot hook and disallow more from being added
  const getUseControlledStateHooks = useConsumeHookGetter(
    getInstance().hooks,
    'useControlledState'
  )

  // Allow the user to control the final state with hooks
  const state = reduceHooks(
    [...getUseControlledStateHooks(), useControlledState],
    reducerState,
    { instance: getInstance() }
  )

  Object.assign(getInstance(), {
    state,
    dispatch,
  })

  // Snapshot hook and disallow more from being added
  const getColumnsHooks = useConsumeHookGetter(getInstance().hooks, 'columns')

  // Snapshot hook and disallow more from being added
  const getColumnsDepsHooks = useConsumeHookGetter(
    getInstance().hooks,
    'columnsDeps'
  )

  // Decorate All the columns
  let columns = React.useMemo(
    () =>
      decorateColumnTree(
        reduceHooks(getColumnsHooks(), userColumns, {
          instance: getInstance(),
        }),
        defaultColumn
      ),
    [
      defaultColumn,
      getColumnsHooks,
      getInstance,
      userColumns,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ...reduceHooks(getColumnsDepsHooks(), [], { instance: getInstance() }),
    ]
  )

  getInstance().columns = columns

  // Get the flat list of all columns and allow hooks to decorate
  // those columns (and trigger this memoization via deps)
  let flatColumns = React.useMemo(() => flattenBy(columns, 'columns'), [
    columns,
  ])

  getInstance().flatColumns = flatColumns

  // Access the row model
  const [rows, flatRows] = React.useMemo(() => {
    let flatRows = []

    // Access the row's data
    const accessRow = (originalRow, i, depth = 0, parent) => {
      // Keep the original reference around
      const original = originalRow

      const id = getRowId(originalRow, i, parent)

      const row = {
        id,
        original,
        index: i,
        depth,
        cells: [{}], // This is a dummy cell
      }

      flatRows.push(row)

      // Process any subRows
      let subRows = getSubRows(originalRow, i)

      if (subRows) {
        row.subRows = subRows.map((d, i) => accessRow(d, i, depth + 1, row))
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
      flatColumns.forEach(({ id, accessor }) => {
        row.values[id] = accessor
          ? accessor(originalRow, i, { subRows, depth, data })
          : undefined
      })

      return row
    }

    // Use the resolved data
    const accessedData = data.map((d, i) => accessRow(d, i))

    return [accessedData, flatRows]
  }, [data, flatColumns, getRowId, getSubRows])

  getInstance().rows = rows
  getInstance().flatRows = flatRows

  // Snapshot hook and disallow more from being added
  const flatColumnsHooks = useConsumeHookGetter(
    getInstance().hooks,
    'flatColumns'
  )

  // Snapshot hook and disallow more from being added
  const flatColumnsDepsHooks = useConsumeHookGetter(
    getInstance().hooks,
    'flatColumnsDeps'
  )

  // Get the flat list of all columns AFTER the rows
  // have been access, and allow hooks to decorate
  // those columns (and trigger this memoization via deps)
  flatColumns = React.useMemo(
    () =>
      reduceHooks(flatColumnsHooks(), flatColumns, { instance: getInstance() }),
    [
      flatColumns,
      flatColumnsHooks,
      getInstance,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ...reduceHooks(flatColumnsDepsHooks(), [], { instance: getInstance() }),
    ]
  )

  getInstance().flatColumns = flatColumns

  // Snapshot hook and disallow more from being added
  const getHeaderGroups = useConsumeHookGetter(
    getInstance().hooks,
    'headerGroups'
  )

  // Snapshot hook and disallow more from being added
  const getHeaderGroupsDeps = useConsumeHookGetter(
    getInstance().hooks,
    'headerGroupsDeps'
  )

  // Make the headerGroups
  const headerGroups = React.useMemo(
    () =>
      reduceHooks(
        getHeaderGroups(),
        makeHeaderGroups(flatColumns, defaultColumn),
        getInstance()
      ),
    [
      defaultColumn,
      flatColumns,
      getHeaderGroups,
      getInstance,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ...reduceHooks(getHeaderGroupsDeps(), [], { instance: getInstance() }),
    ]
  )

  getInstance().headerGroups = headerGroups

  const headers = React.useMemo(
    () => (headerGroups.length ? headerGroups[0].headers : []),
    [headerGroups]
  )

  getInstance().headers = headers

  // Provide a flat header list for utilities
  getInstance().flatHeaders = headerGroups.reduce(
    (all, headerGroup) => [...all, ...headerGroup.headers],
    []
  )

  // Snapshot hook and disallow more from being added
  const getUseInstanceBeforeDimensions = useConsumeHookGetter(
    getInstance().hooks,
    'useInstanceBeforeDimensions'
  )

  loopHooks(getUseInstanceBeforeDimensions(), getInstance())

  // Header Visibility is needed by this point
  const [
    totalColumnsMinWidth,
    totalColumnsWidth,
    totalColumnsMaxWidth,
  ] = calculateHeaderWidths(headers)

  getInstance().totalColumnsMinWidth = totalColumnsMinWidth
  getInstance().totalColumnsWidth = totalColumnsWidth
  getInstance().totalColumnsMaxWidth = totalColumnsMaxWidth

  // Snapshot hook and disallow more from being added
  const getUseInstance = useConsumeHookGetter(
    getInstance().hooks,
    'useInstance'
  )

  loopHooks(getUseInstance(), getInstance())

  // Snapshot hook and disallow more from being added
  const getHeaderPropsHooks = useConsumeHookGetter(
    getInstance().hooks,
    'getHeaderProps'
  )

  // Snapshot hook and disallow more from being added
  const getFooterPropsHooks = useConsumeHookGetter(
    getInstance().hooks,
    'getFooterProps'
  )

  // Each materialized header needs to be assigned a render function and other
  // prop getter properties here.
  ;[...getInstance().flatHeaders, ...getInstance().flatColumns].forEach(
    column => {
      // Give columns/headers rendering power
      column.render = makeRenderer(getInstance(), column)

      // Give columns/headers a default getHeaderProps
      column.getHeaderProps = makePropGetter(getHeaderPropsHooks(), {
        instance: getInstance(),
        column,
      })

      // Give columns/headers a default getFooterProps
      column.getFooterProps = makePropGetter(getFooterPropsHooks(), {
        instance: getInstance(),
        column,
      })
    }
  )

  // Snapshot hook and disallow more from being added
  const getHeaderGroupPropsHooks = useConsumeHookGetter(
    getInstance().hooks,
    'getHeaderGroupProps'
  )

  // Snapshot hook and disallow more from being added
  const getFooterGroupPropsHooks = useConsumeHookGetter(
    getInstance().hooks,
    'getFooterGroupProps'
  )

  getInstance().headerGroups = getInstance().headerGroups.filter(
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
        headerGroup.getHeaderGroupProps = makePropGetter(
          getHeaderGroupPropsHooks(),
          { instance: getInstance(), headerGroup, index: i }
        )

        headerGroup.getFooterGroupProps = makePropGetter(
          getFooterGroupPropsHooks(),
          { instance: getInstance(), headerGroup, index: i }
        )

        return true
      }

      return false
    }
  )

  getInstance().footerGroups = [...getInstance().headerGroups].reverse()

  // Run the rows (this could be a dangerous hook with a ton of data)

  // Snapshot hook and disallow more from being added
  const getUseRowsHooks = useConsumeHookGetter(getInstance().hooks, 'useRows')

  getInstance().rows = reduceHooks(getUseRowsHooks(), getInstance().rows, {
    instance: getInstance(),
  })

  // The prepareRow function is absolutely necessary and MUST be called on
  // any rows the user wishes to be displayed.

  // Snapshot hook and disallow more from being added
  const getPrepareRowHooks = useConsumeHookGetter(
    getInstance().hooks,
    'prepareRow'
  )

  // Snapshot hook and disallow more from being added
  const getRowPropsHooks = useConsumeHookGetter(
    getInstance().hooks,
    'getRowProps'
  )

  // Snapshot hook and disallow more from being added
  const getCellPropsHooks = useConsumeHookGetter(
    getInstance().hooks,
    'getCellProps'
  )

  // Snapshot hook and disallow more from being added
  const cellsHooks = useConsumeHookGetter(getInstance().hooks, 'cells')

  getInstance().prepareRow = React.useCallback(
    row => {
      row.getRowProps = makePropGetter(getRowPropsHooks(), {
        instance: getInstance(),
        row,
      })

      // Build the visible cells for each row
      row.allCells = flatColumns.map(column => {
        const cell = {
          column,
          row,
          value: row.values[column.id],
        }

        // Give each cell a getCellProps base
        cell.getCellProps = makePropGetter(getCellPropsHooks(), {
          instance: getInstance(),
          cell,
        })

        // Give each cell a renderer function (supports multiple renderers)
        cell.render = makeRenderer(getInstance(), column, {
          row,
          cell,
        })

        return cell
      })

      row.cells = reduceHooks(cellsHooks(), row.allCells, {
        instance: getInstance(),
      })

      // need to apply any row specific hooks (useExpanded requires this)
      loopHooks(getPrepareRowHooks(), row, { instance: getInstance() })
    },
    [
      getRowPropsHooks,
      getInstance,
      flatColumns,
      cellsHooks,
      getPrepareRowHooks,
      getCellPropsHooks,
    ]
  )

  // Snapshot hook and disallow more from being added
  const getTablePropsHooks = useConsumeHookGetter(
    getInstance().hooks,
    'getTableProps'
  )

  getInstance().getTableProps = makePropGetter(getTablePropsHooks(), {
    instance: getInstance(),
  })

  // Snapshot hook and disallow more from being added
  const getTableBodyPropsHooks = useConsumeHookGetter(
    getInstance().hooks,
    'getTableBodyProps'
  )

  getInstance().getTableBodyProps = makePropGetter(getTableBodyPropsHooks(), {
    instance: getInstance(),
  })

  // Snapshot hook and disallow more from being added
  const getUseFinalInstanceHooks = useConsumeHookGetter(
    getInstance().hooks,
    'useFinalInstance'
  )

  loopHooks(getUseFinalInstanceHooks(), getInstance())

  return getInstance()
}

function calculateHeaderWidths(headers, left = 0) {
  let sumTotalMinWidth = 0
  let sumTotalWidth = 0
  let sumTotalMaxWidth = 0

  headers.forEach(header => {
    let { headers: subHeaders } = header

    header.totalLeft = left

    if (subHeaders && subHeaders.length) {
      const [totalMinWidth, totalWidth, totalMaxWidth] = calculateHeaderWidths(
        subHeaders,
        left
      )
      header.totalMinWidth = totalMinWidth
      header.totalWidth = totalWidth
      header.totalMaxWidth = totalMaxWidth
    } else {
      header.totalMinWidth = header.minWidth
      header.totalWidth = Math.min(
        Math.max(header.minWidth, header.width),
        header.maxWidth
      )
      header.totalMaxWidth = header.maxWidth
    }
    if (header.isVisible) {
      left += header.totalWidth
      sumTotalMinWidth += header.totalMinWidth
      sumTotalWidth += header.totalWidth
      sumTotalMaxWidth += header.totalMaxWidth
    }
  })

  return [sumTotalMinWidth, sumTotalWidth, sumTotalMaxWidth]
}
