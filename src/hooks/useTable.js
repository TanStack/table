import React from 'react'

//

import {
  functionalUpdate,
  useGetLatest,
  defaultGroupingFn,
  defaultOrderByFn,
  getRowIsSelected,
} from '../utils'

import useStateSync from './useStateSync'
import useTableMethods from './useTableMethods'
import useColumns from './useColumns'
import useHeadersAndFooters from './useHeadersAndFooters'
import useAccessRows from './useAccessRows'
import useColumnFilters from './useColumnFilters'
import useGlobalFilter from './useGlobalFilter'
import useGrouping from './useGrouping'
import useSorting from './useSorting'
import useExpanded from './useExpanded'
import useHeaderWidths from './useHeaderWidths'

//

const noop = () => {}
const defaultInitialState = {
  columnVisibility: {},
  columnFilters: [],
  globalFilterValue: '',
  grouping: [],
  expanded: {},
  sorting: [],
  columnOrder: [],
  selection: {},
  pageIndex: 0,
  pageSize: 10,
  pageCount: -1,
}
const defaultInitialUserState = {}
const defaultOnStateChange = d => d
const defaultGetSubRows = (row, index) => row.subRows || []
const defaultGetRowId = (row, index, parent) =>
  `${parent ? [parent.id, index].join('.') : index}`
const defaultAggregationTypes = {}

const applyDefaults = ({
  initialState = defaultInitialState,
  state: userState = defaultInitialUserState,
  onStateChange = defaultOnStateChange,
  getSubRows = defaultGetSubRows,
  getRowId = defaultGetRowId,
  decorateInstance = noop,
  decorateFlatColumns = noop,
  decorateColumn = noop,
  decorateOrderedColumns = noop,
  decorateVisibleColumns = noop,
  decorateRow = noop,
  decorateCell = noop,
  enableFilters = true,
  globalFilterType = 'text',
  autoResetColumnFilters = true,
  autoResetGlobalFilter = true,
  aggregationTypes = defaultAggregationTypes,
  groupingFn = defaultGroupingFn,
  manualGrouping = false,
  autoResetGrouping = true,
  expandSubRows = true,
  paginateExpandedRows = true,
  manualExpandedKey = 'expanded',
  isMultiSortEvent = e => e.shiftKey,
  autoResetSorting = true,
  orderByFn = defaultOrderByFn,
  manualRowSelectedKey = 'isSelected',
  selectSubRows = true,
  autoResetPage = true,
  ...rest
} = {}) => ({
  initialState,
  userState,
  onStateChange,
  getSubRows,
  getRowId,
  decorateInstance,
  decorateFlatColumns,
  decorateColumn,
  decorateOrderedColumns,
  decorateVisibleColumns,
  decorateRow,
  decorateCell,
  enableFilters,
  globalFilterType,
  autoResetColumnFilters,
  autoResetGlobalFilter,
  aggregationTypes,
  groupingFn,
  manualGrouping,
  autoResetGrouping,
  expandSubRows,
  paginateExpandedRows,
  manualExpandedKey,
  isMultiSortEvent,
  autoResetSorting,
  orderByFn,
  manualRowSelectedKey,
  selectSubRows,
  autoResetPage,
  ...rest,
})

export const useTable = options => {
  const instanceRef = React.useRef()

  // Create and keep track of the table instance
  if (!instanceRef.current) {
    instanceRef.current = {}
  }
  const instance = instanceRef.current

  // Apply the defaults to our options
  instance.options = applyDefaults(options)

  const oldDecorateColumn = instance.options.decorateColumn
  instance.options.decorateColumn = React.useCallback(
    (...args) => {
      decorateColumn(...args)
      oldDecorateColumn(...args)
    },
    [oldDecorateColumn]
  )

  const oldDecorateRow = instance.options.decorateRow
  instance.options.decorateRow = React.useCallback(
    (...args) => {
      decorateRow(...args)
      oldDecorateRow(...args)
    },
    [oldDecorateRow]
  )

  const oldDecorateCell = instance.options.decorateCell
  instance.options.decorateCell = React.useCallback(
    (...args) => {
      decorateCell(...args)
      oldDecorateCell(...args)
    },
    [oldDecorateCell]
  )

  // Getters allow us to bypass auto deps linting
  const getInstance = useGetLatest(instance)

  // Get the users initialState for the table
  instance.getInitialState = React.useCallback(
    () => functionalUpdate(getInstance().options.initialState),
    [getInstance]
  )

  // A home for our automatic internal table state
  const [autoState, setAutoState] = React.useState(instance.getInitialState)

  // The computed state with any conrolled state overrides from the user
  instance.state = React.useMemo(
    () => ({
      ...autoState,
      ...instance.options.userState,
    }),
    [autoState, instance.options.userState]
  )

  useStateSync(instance)

  // Our super cool setState function with meta and onStateChange callback support
  instance.setState = React.useCallback(
    (updater, meta) => {
      const {
        state: old,
        options: { onStateChange },
      } = getInstance()

      const newState = functionalUpdate(updater, old)

      const [newStateNoMeta, moreMeta] = Array.isArray(newState)
        ? newState
        : [newState, {}]

      const resolvedState = onStateChange(newStateNoMeta, old, {
        ...meta,
        ...moreMeta,
      })

      if (resolvedState && resolvedState !== old) {
        setAutoState(resolvedState)
      }
    },
    [getInstance]
  )

  useTableMethods(instance)
  useColumns(instance)
  useHeadersAndFooters(instance)
  useAccessRows(instance)
  useColumnFilters(instance)
  useGlobalFilter(instance)
  useGrouping(instance)
  useSorting(instance)
  useExpanded(instance)
  useHeaderWidths(instance)

  instance.getTableHeadProps = (props = {}) => ({ ...props })
  instance.getTableFooterProps = (props = {}) => ({ ...props })
  instance.getTableBodyProps = (props = {}) => ({ ...props })
  instance.getTableProps = (props = {}) => ({ ...props })

  instance.getToggleAllColumnsVisibilityProps = React.useCallback(
    (props = {}) => {
      return {
        onChange: e => {
          getInstance().toggleAllColumnsVisible(e.target.checked)
        },
        style: {
          cursor: 'pointer',
        },
        title: 'Toggle visibility for all columns',
        checked: getInstance().getIsAllColumnsVisible(),
        indeterminate:
          !getInstance().getIsAllColumnsVisible() &&
          getInstance().getIsSomeColumnsVisible(),
        ...props,
      }
    },
    [getInstance]
  )

  instance.getToggleAllRowsExpandedProps = (props = {}) => ({
    onClick: e => {
      instance.toggleAllRowsExpanded()
    },
    style: {
      cursor: 'pointer',
    },
    title: 'Toggle All Rows Expanded',
    ...props,
  })

  if (process.env.NODE_ENV !== 'production') {
    const duplicateColumns = instance.flatColumns.filter((column, i, all) => {
      return instance.flatColumns.findIndex(d => d.id === column.id) !== i
    })

    if (duplicateColumns.length) {
      console.info(instance.flatColumns)
      throw new Error(
        `Duplicate columns were found with ids: "${duplicateColumns
          .map(d => d.id)
          .join(', ')}" in the columns array above`
      )
    }
  }

  instance.getToggleAllRowsSelectedProps = props => ({
    onChange: e => {
      getInstance().toggleAllRowsSelected(e.target.checked)
    },
    style: {
      cursor: 'pointer',
    },
    checked: getInstance().getIsAllRowsSelected(),
    title: 'Toggle All Rows Selected',
    indeterminate: Boolean(
      !getInstance().getIsAllRowsSelected() &&
        Object.keys(getInstance().state.selection).length
    ),
    ...props,
  })

  instance.getIsAllRowsSelected = React.useCallback(() => {
    let isAllRowsSelected = Boolean(
      Object.keys(instance.nonGroupedRowsById).length &&
        Object.keys(instance.state.selection).length
    )
    if (isAllRowsSelected) {
      if (
        Object.keys(instance.nonGroupedRowsById).some(
          id => !instance.state.selection[id]
        )
      ) {
        isAllRowsSelected = false
      }
    }

    return isAllRowsSelected
  }, [instance.nonGroupedRowsById, instance.state.selection])

  instance.options.decorateInstance(instance)

  return instance
}

function decorateColumn(column, getInstance) {
  column.getToggleVisibilityProps = (props = {}) => ({
    onChange: e => {
      column.toggleVisibility(e.target.checked)
    },
    style: {
      cursor: 'pointer',
    },
    checked: column.getIsVisible(),
    title: 'Toggle Column Visible',
    ...props,
  })

  column.getToggleGroupingProps = (props = {}) => {
    const canGroup = column.getCanGroup()

    return {
      onClick: canGroup
        ? e => {
            e.persist()
            column.toggleGrouping()
          }
        : undefined,
      style: {
        cursor: canGroup ? 'pointer' : undefined,
      },
      title: 'Toggle Grouping',
      ...props,
    }
  }

  column.getToggleSortingProps = (props = {}) => {
    const canSort = column.getCanSort()

    return {
      onClick: canSort
        ? e => {
            e.persist()
            column.toggleSorting(
              undefined,
              !getInstance().options.disableMultiSort &&
                getInstance().options.isMultiSortEvent(e)
            )
          }
        : undefined,
      style: {
        cursor: canSort ? 'pointer' : undefined,
      },
      title: canSort ? 'Toggle Sorting' : undefined,
      ...props,
    }
  }
}

// We have to do this here, because tecnically, rows are created by both the
// data accessor phase and also the grouping phase
function decorateRow(row, getInstance) {
  row.getRowProps = (props = {}) => ({ ...props })

  row.getIsSelected = () =>
    getInstance().options.selectSubRows
      ? getRowIsSelected(row, getInstance().state.selection)
      : !!getInstance().state.selection[row.id]

  row.getIsSomeSelected = () => row.getIsSelected() === null

  row.getIsGrouped = () => !!row.groupingId

  row.toggleExpanded = set => getInstance().toggleRowExpanded(row.id, set)

  row.getIsExpanded = () =>
    (row.original && row.original[getInstance().options.manualExpandedKey]) ||
    getInstance().state.expanded[row.id]

  row.getCanExpand = () => row.subRows && !!row.subRows.length

  row.getToggleExpandedProps = (props = {}) => ({
    onClick: () => {
      row.toggleExpanded()
    },
    style: {
      cursor: 'pointer',
    },
    title: 'Toggle Row Expanded',
    ...props,
  })

  row.toggleRowSelected = set => getInstance().toggleRowSelected(row.id, set)

  row.getToggleRowSelectedProps = props => {
    const {
      options: { manualRowSelectedKey },
    } = getInstance()

    let checked = false

    if (row.original?.[manualRowSelectedKey]) {
      checked = true
    } else {
      checked = row.getIsSelected()
    }

    return {
      onChange: e => {
        row.toggleRowSelected(e.target.checked)
      },
      style: {
        cursor: 'pointer',
      },
      checked,
      title: 'Toggle Row Selected',
      indeterminate: row.getIsSomeSelected(),
      ...props,
    }
  }
}

function decorateCell(cell, getInstance) {
  // Grouped cells are in the grouping and the pivot cell for the row
  cell.getIsGrouped = () =>
    cell.column.getIsGrouped() && cell.column.id === cell.row.groupingId
  // Placeholder cells are any columns in the grouping that are not grouped
  cell.getIsPlaceholder = () =>
    !cell.getIsGrouped() && cell.column.getIsGrouped()
  // Aggregated cells are not grouped, not repeated, but still have subRows
  cell.getIsAggregated = () =>
    !cell.getIsGrouped() && !cell.getIsPlaceholder() && cell.row.getCanExpand()
}
