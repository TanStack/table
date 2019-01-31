import { useState, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
//
import {
  defaultOrderByFn,
  defaultSortByFn,
  defaultGroupByFn,
  defaultFilterFn,
  flexRender,
  findExpandedDepth,
  applyHooks,
  mergeProps,
  warnUnknownProps,
} from './utils'

// Internal Hooks
import useControlledState from './hooks/useControlledState'
import useColumns from './hooks/useColumns'
import useTableMethods from './hooks/useTableMethods'
import useAccessedRows from './hooks/useAccessedRows'
import useGroupedRows from './hooks/useGroupedRows'
import useFilteredRows from './hooks/useFilteredRows'
import useSortedRows from './hooks/useSortedRows'
import useExpandedRows from './hooks/useExpandedRows'

const defaultFlex = 1
const renderErr =
  'You must specify a render "type". This could be "Header", "Filter", or any other custom renderers you have set on your column.'

export const actions = {
  sortByChange: '__sortByChange',
  updateAutoWidth: '__updateAutoWidth__',
  toggleGroupBy: '__toggleGroupBy__',
  toggleExpanded: '__toggleExpanded__',
  setExpanded: '__setExpanded__',
  setFilter: '__setFilter__',
  setAllFilters: '__setAllFilters__',
}

const propTypes = {
  // General
  data: PropTypes.any,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      aggregate: PropTypes.func,
      filterFn: PropTypes.func,
      filterAll: PropTypes.bool,
      sortByFn: PropTypes.func,
      resolvedDefaultSortDesc: PropTypes.bool,
      canSortBy: PropTypes.bool,
      canGroupBy: PropTypes.bool,
      Cell: PropTypes.any,
      Header: PropTypes.any,
      Filter: PropTypes.any,
    })
  ),
  defaultFilters: PropTypes.array,
  defaultSortBy: PropTypes.array,
  defaultGroupBy: PropTypes.array,

  groupBy: PropTypes.array,
  filters: PropTypes.array,
  sortBy: PropTypes.array,

  filterFn: PropTypes.func,
  sortByFn: PropTypes.func,
  orderByFn: PropTypes.func,
  groupByFn: PropTypes.func,

  manualGrouping: PropTypes.bool,
  manualFilters: PropTypes.bool,
  manualSorting: PropTypes.bool,

  disableGrouping: PropTypes.bool,
  disableFilters: PropTypes.bool,
  disableSorting: PropTypes.bool,

  defaultSortDesc: PropTypes.bool,
  disableMultiSort: PropTypes.bool,
  subRowsKey: PropTypes.string,
  expandedKey: PropTypes.string,
  userAggregations: PropTypes.object,

  debug: PropTypes.bool,
}

export default function useReactTable (props) {
  // Validate props
  PropTypes.checkPropTypes(propTypes, props, 'property', 'useReactTable')

  // Destructure props
  const {
    data = [],
    state: userState,
    columns: userColumns,
    sortBy: userSortBy,
    groupBy: userGroupBy,
    filters: userFilters,
    expanded: userExpanded,
    defaultSortBy = [],
    defaultGroupBy = [],
    defaultFilters = {},
    defaultExpanded = {},
    manualGrouping,
    manualFilters,
    manualSorting,
    disableSorting,
    disableGrouping,
    disableFilters,
    defaultSortDesc,
    disableMultiSort,
    subRowsKey = 'subRows',
    expandedKey = 'expanded',
    filterFn = defaultFilterFn,
    sortByFn = defaultSortByFn,
    orderByFn = defaultOrderByFn,
    groupByFn = defaultGroupByFn,
    userAggregations = {},
    debug,
    ...rest
  } = props

  warnUnknownProps(rest)

  const defaultState = useState({})

  const localState = userState || defaultState

  // Build the controllable state
  const [{
    sortBy, groupBy, filters, expanded,
  }, setState] = useControlledState(
    localState,
    {
      sortBy: defaultSortBy,
      groupBy: defaultGroupBy,
      filters: defaultFilters,
      expanded: defaultExpanded,
    },
    {
      sortBy: userSortBy,
      groupBy: userGroupBy,
      filters: userFilters,
      expanded: userExpanded,
    }
  )

  const expandedDepth = findExpandedDepth(expanded)
  const renderedCellInfoRef = useRef({})

  // Build the base column
  let { columns, headerGroups, headers } = useColumns({
    debug,
    groupBy,
    userColumns,
    defaultFlex,
    renderedCellInfoRef,
    disableSorting,
    disableGrouping,
    disableFilters,
  })

  // Use data and columns as memoization
  const accessedRows = useAccessedRows({
    debug,
    data,
    columns,
    subRowsKey,
  })

  // Use rows and groupBy as memoization for row grouping
  const groupedRows = useGroupedRows({
    debug,
    rows: accessedRows,
    groupBy,
    columns,
    groupByFn,
    manualGrouping,
    userAggregations,
  })

  const filteredRows = useFilteredRows({
    debug,
    rows: groupedRows,
    filters,
    columns,
    filterFn,
    manualFilters,
  })

  const sortedRows = useSortedRows({
    debug,
    rows: filteredRows,
    sortBy,
    columns,
    orderByFn,
    sortByFn,
    manualSorting,
  })

  const rows = useExpandedRows({
    debug,
    rows: sortedRows,
    expanded,
    expandedKey,
    columns,
    groupBy,
    setState,
    actions,
  })

  // Mutate columns to reflect sorting state
  columns.forEach(column => {
    const { id } = column
    column.sorted = sortBy.find(d => d.id === id)
    column.sortedIndex = sortBy.findIndex(d => d.id === id)
    column.sortedDesc = column.sorted ? column.sorted.desc : undefined
    column.filterVal = filters[id]
  })

  // Public API

  const {
    toggleExpandedByPath,
    toggleSortByID,
    toggleGroupBy,
    setFilter,
    setAllFilters,
  } = useTableMethods({
    debug,
    setState,
    actions,
    groupBy,
    columns,
    defaultSortDesc,
    filters,
  })

  const state = {
    // State
    columns,
    expandedDepth,
    accessedRows,
    groupedRows,
    filteredRows,
    sortedRows,
    rows,
    headerGroups,
    renderedCellInfoRef,
    disableMultiSort,

    // Controllable state
    groupBy,
    filters,
    sortBy,
    expanded,
  }

  const api = {
    // State manager,
    ...state,

    // Methods
    toggleExpandedByPath,
    toggleSortByID,
    toggleGroupBy,
    setFilter,
    setAllFilters,
  }

  columns.forEach(column => attachApi(column, api))
  headers.forEach(header => attachApi(header, api))

  const visibleColumns = columns.filter(column => {
    column.visible = typeof column.show === 'function' ? column.show(state) : !!column.show
    return column.visible
  })

  state.visibleColumns = visibleColumns
  api.visibleColumns = visibleColumns

  api.hooks = {
    getTableProps: [],
    getRowProps: [],
    getHeaderRowProps: [],
    getCellProps: [],
    getHeaderProps: [],
    getSortByToggleProps: [],
    getGroupByToggleProps: [],
  }

  api.getTableProps = props => mergeProps(
    {
      style: {
        overflowX: 'auto',
      },
    },
    applyHooks(api.hooks.getTableProps),
    props
  )

  api.getRowProps = props => mergeProps(applyHooks(api.hooks.getRowProps), props)

  // Filter out hidden header groups or header groups that
  // have no visible columns, then add the getRowProps method
  headerGroups = useMemo(
    () =>
      headerGroups.filter((headerGroup, i) => {
        headerGroup.headers = headerGroup.headers.filter(header => {
          const recurse = columns => columns.filter(column => {
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

        if (headerGroup.headers.length) {
          headerGroup.getRowProps = (props = {}) => mergeProps(
            {
              key: [`header${i}`].join('_'),
            },
            applyHooks(api.hooks.getHeaderRowProps, headerGroup),
            props
          )
          return true
        }

        return false
      }),
    [headerGroups]
  )

  // A function that mutates and prepares page rows with methods
  api.prepareRows = rows => {
    rows.forEach((row, i) => {
      const { path } = row
      row.getRowProps = props => mergeProps(
        { key: ['row', i].join('_') },
        applyHooks(api.hooks.getRowProps, row),
        props
      )

      row.toggleExpanded = set => toggleExpandedByPath(path, set)

      row.cells = row.cells.filter(cell => cell.column.visible);
      [row.groupByCell, ...row.cells].forEach(cell => {
        if (!cell) {
          return
        }

        const { column } = cell

        cell.getCellProps = props => {
          const columnPathStr = [i, column.id].join('_')
          return mergeProps(
            {
              key: ['cell', columnPathStr].join('_'),
            },
            applyHooks(api.hooks.getCellProps, cell),
            props
          )
        }

        cell.render = (type, userProps = {}) => {
          if (!type) {
            throw new Error(
              'You must specify a render "type". This could be "Cell", "Header", "Filter", "Aggregated" or any other custom renderers you have set on your column.'
            )
          }
          return flexRender(column[type], {
            ...api,
            ...cell,
            ...userProps,
          })
        }
      })
    })
  }

  const makeHook = api => {
    api.hook = (hook, ...args) => {
      const result = hook(api, ...args) || {}
      const newApi = {
        ...api,
        ...result,
      }
      makeHook(newApi)
      return newApi
    }
  }

  makeHook(api)

  return api
}

function attachApi (column, api) {
  const {
    id, canSortBy, canGroupBy, canFilter,
  } = column
  const { toggleSortByID, toggleGroupBy, setFilter } = api

  column.render = (type, userProps = {}) => {
    if (!type) {
      throw new Error(renderErr)
    }
    return flexRender(column[type], {
      ...api,
      ...column,
      ...userProps,
    })
  }

  if (canSortBy) {
    column.toggleSortBy = (desc, multi) => toggleSortByID(id, desc, multi)
  }
  if (canGroupBy) {
    column.toggleGroupBy = () => toggleGroupBy(id)
  }
  if (canFilter) {
    column.setFilter = val => setFilter(id, val)
  }

  column.getSortByToggleProps = props => mergeProps(
    {
      onClick: canSortBy
        ? e => {
          e.persist()
          column.toggleSortBy(undefined, !api.disableMultiSort && e.shiftKey)
        }
        : undefined,
      style: {
        cursor: canSortBy ? 'pointer' : undefined,
      },
      title: 'Toggle SortBy',
    },
    applyHooks(api.hooks.getSortByToggleProps, column),
    props
  )

  column.getGroupByToggleProps = props => mergeProps(
    {
      onClick: canGroupBy
        ? e => {
          e.persist()
          column.toggleGroupBy()
        }
        : undefined,
      style: {
        cursor: canGroupBy ? 'pointer' : undefined,
      },
      title: 'Toggle GroupBy',
    },
    applyHooks(api.hooks.getGroupByToggleProps, column),
    props
  )

  column.getHeaderProps = props => mergeProps(
    {
      key: ['header', column.id].join('_'),
    },
    applyHooks(api.hooks.getHeaderProps, column),
    props
  )
}
