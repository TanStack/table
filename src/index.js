import React from 'react'
import classnames from 'classnames'
//
import _ from './utils'

import Pagination from './pagination'

export const ReactTableDefaults = {
  // General
  data: [],
  loading: false,
  showPagination: true,
  showPageSizeOptions: true,
  pageSizeOptions: [5, 10, 20, 25, 50, 100],
  defaultPageSize: 20,
  showPageJump: true,
  expanderColumnWidth: 35,

  // Controlled State Overrides
  // page
  // pageSize
  // sorting

  // Controlled State Callbacks
  onExpandSubComponent: undefined,
  onPageChange: undefined,
  onPageSizeChange: undefined,
  onSortingChange: undefined,

  // Pivoting
  pivotBy: [],
  pivotColumnWidth: 200,
  pivotValKey: '_pivotVal',
  pivotIDKey: '_pivotID',
  subRowsKey: '_subRows',

  // Pivoting State Overrides
  // expandedRows: {},

  // Pivoting State Callbacks
  onExpandRow: undefined,

  // General Callbacks
  onChange: () => null,
  onTrClick: () => null,

  // Classes
  className: '-striped -highlight',
  tableClassName: '',
  theadClassName: '',
  tbodyClassName: '',
  trClassName: '',
  trClassCallback: d => null,
  thClassName: '',
  thGroupClassName: '',
  tdClassName: '',
  paginationClassName: '',

  // Styles
  style: {},
  tableStyle: {},
  theadStyle: {},
  tbodyStyle: {},
  trStyle: {},
  trStyleCallback: d => {},
  thStyle: {},
  tdStyle: {},
  paginationStyle: {},

  // Global Column Defaults
  column: {
    sortable: true,
    show: true,
    className: '',
    style: {},
    headerClassName: '',
    headerStyle: {},
    headerInnerClassName: '',
    headerInnerStyle: {},
    minWidth: 100
  },

  // Text
  previousText: 'Previous',
  nextText: 'Next',
  loadingText: 'Loading...',
  pageText: 'Page',
  ofText: 'of',
  rowsText: 'rows',

  // Components
  TableComponent: _.makeTemplateComponent('rt-table'),
  TheadComponent: _.makeTemplateComponent('rt-thead'),
  TbodyComponent: _.makeTemplateComponent('rt-tbody'),
  TrGroupComponent: _.makeTemplateComponent('rt-tr-group'),
  TrComponent: _.makeTemplateComponent('rt-tr'),
  ThComponent: ({toggleSort, className, children, ...rest}) => {
    return (
      <div
        className={classnames(className, 'rt-th')}
        onClick={e => {
          toggleSort && toggleSort(e)
        }}
        {...rest}
      >
        {children}
      </div>
    )
  },
  TdComponent: _.makeTemplateComponent('rt-td'),
  ExpanderComponent: ({isExpanded, ...rest}) => {
    return (
      <div
        className={classnames('rt-expander', isExpanded && '-open')}
        {...rest}
      >&bull;</div>
    )
  },
  PaginationComponent: Pagination,
  PreviousComponent: undefined,
  NextComponent: undefined,
  LoadingComponent: ({loading, loadingText}) => (
    <div className={classnames('-loading', {'-active': loading})}>
      <div className='-loading-inner'>
        {loadingText}
      </div>
    </div>
  )
}

export default React.createClass({
  getDefaultProps () {
    return ReactTableDefaults
  },

  getInitialState () {
    return {
      page: 0,
      pageSize: this.props.defaultPageSize || 10,
      sorting: [],
      expandedRows: {}
    }
  },

  getResolvedState (props, state) {
    const resolvedProps = {
      ...this.state,
      ...state,
      ...this.props,
      ...props
    }
    return resolvedProps
  },

  componentWillMount () {
    this.setStateWithData(this.getDataModel())
  },

  componentDidMount () {
    this.fireOnChange()
  },

  componentWillReceiveProps (nextProps, nextState) {
    const oldState = this.getResolvedState()
    const newState = this.getResolvedState(nextProps, nextState)
    // Props that trigger a data update
    if (
      oldState.data !== newState.data ||
      oldState.columns !== newState.columns ||
      oldState.pivotBy !== newState.pivotBy ||
      oldState.sorting !== newState.sorting
    ) {
      this.setStateWithData(this.getDataModel(nextProps, nextState))
    }
  },

  setStateWithData (newState, cb) {
    const oldState = this.getResolvedState()
    const newResolvedState = this.getResolvedState({}, newState)
    if (
      oldState.resolvedData !== newResolvedState.resolvedData ||
      oldState.sorting !== newResolvedState.sorting
    ) {
      Object.assign(newState, this.getSortedData({}, newState))
    }
    // Calculate pageSize all the time
    if (newResolvedState.resolvedData) {
      newState.pages = newResolvedState.manual ? newResolvedState.pages : Math.ceil(newResolvedState.resolvedData.length / newResolvedState.pageSize)
    }
    return this.setState(newState, cb)
  },

  shouldComponentUpdate (nextProps, nextState) {
    const oldState = this.getResolvedState()
    const newState = this.getResolvedState(nextProps, nextState)
    // State changes that trigger a render
    if (
      oldState.sortedData !== newState.sortedData ||
      oldState.page !== newState.page ||
      oldState.pageSize !== newState.pageSize ||
      oldState.expandedRows !== newState.expandedRows
    ) {
      return true
    }
    return false
  },

  render () {
    const resolvedProps = this.getResolvedState()
    const {
      className,
      style,
      tableClassName,
      tableStyle,
      theadGroupClassName,
      theadStyle,
      trClassName,
      trStyle,
      thClassname,
      thStyle,
      theadClassName,
      tbodyClassName,
      tbodyStyle,
      onTrClick,
      trClassCallback,
      trStyleCallback,
      tdStyle,
      showPagination,
      paginationClassName,
      expanderColumnWidth,
      manual,
      loadingText,
      // State
      loading,
      pageSize,
      page,
      sorting,
      pages,
      // Pivoting State
      pivotBy,
      pivotValKey,
      pivotIDKey,
      subRowsKey,
      expandedRows,
      onExpandRow,
      // Components
      TableComponent,
      TheadComponent,
      TbodyComponent,
      TrGroupComponent,
      TrComponent,
      ThComponent,
      TdComponent,
      ExpanderComponent,
      PaginationComponent,
      LoadingComponent,
      SubComponent,
      columnPercentage,
      // Data model
      pivotColumn,
      resolvedData,
      allVisibleColumns,
      headerGroups,
      standardColumns,
      allDecoratedColumns,
      hasHeaderGroups,
      // Sorted Data
      sortedData
    } = resolvedProps

    // Pagination
    const startRow = pageSize * page
    const endRow = startRow + pageSize
    const pageRows = manual ? resolvedData : sortedData.slice(startRow, endRow)
    const minRows = this.getMinRows()
    const padRows = pages > 1 ? _.range(pageSize - pageRows.length)
      : minRows ? _.range(Math.max(minRows - pageRows.length, 0))
      : []

    const recurseRowsViewIndex = (rows, path = [], index = -1) => {
      rows.forEach((row, i) => {
        index++
        row._viewIndex = index
        const newPath = path.concat([i])
        if (row[subRowsKey] && _.get(expandedRows, newPath)) {
          index = recurseRowsViewIndex(row[subRowsKey], newPath, index)
        }
      })
      return index
    }

    recurseRowsViewIndex(pageRows)

    const canPrevious = page > 0
    const canNext = page + 1 < pages

    const rowWidth = (SubComponent ? expanderColumnWidth : 0) + _.sum(allVisibleColumns.map(d => d.minWidth))

    let rowIndex = -1

    const makeHeaderGroup = () => (
      <TheadComponent
        className={classnames(theadGroupClassName, '-headerGroups')}
        style={Object.assign({}, theadStyle, {
          minWidth: `${rowWidth}px`
        })}
      >
        <TrComponent
          className={trClassName}
          style={trStyle}
        >
          {pivotBy.length ? (
            <ThComponent
              className={classnames(thClassname, 'rt-pivot-header')}
              style={_.prefixAll({
                flex: `${columnPercentage} 0 auto`,
                width: `${pivotColumn.minWidth}px`
              })}
            />
          ) : SubComponent ? (
            <ThComponent
              className={classnames(thClassname, 'rt-expander-header')}
              style={_.prefixAll({
                flex: `0 0 auto`,
                width: `${expanderColumnWidth}px`
              })}
            />
          ) : null}
          {headerGroups.map((column, i) => {
            return (
              <ThComponent
                key={i}
                className={classnames(thClassname, column.headerClassName)}
                style={Object.assign({}, thStyle, column.headerStyle, _.prefixAll({
                  flex: `${column.columns.length * columnPercentage} 0 auto`,
                  width: `${_.sum(column.columns.map(d => d.minWidth))}px`
                }))}
              >
                {typeof column.header === 'function' ? (
                  <column.header
                    data={sortedData}
                    column={column}
                  />
                ) : column.header}
              </ThComponent>
            )
          })}
        </TrComponent>
      </TheadComponent>
    )

    const makeHeader = () => {
      const pivotSort = pivotColumn && sorting.find(d => d.id === pivotColumn.id)
      return (
        <TheadComponent
          className={classnames(theadClassName, '-header')}
          style={Object.assign({}, theadStyle, {
            minWidth: `${rowWidth}px`
          })}
        >
          <TrComponent
            className={trClassName}
            style={trStyle}
          >
            {pivotBy.length ? (
              <ThComponent
                className={classnames(
                  thClassname,
                  'rt-pivot-header',
                  pivotSort ? (pivotSort.asc ? '-sort-asc' : '-sort-desc') : '',
                  pivotColumn.sortable && '-cursor-pointer'
                )}
                style={_.prefixAll({
                  flex: `${columnPercentage} 0 auto`,
                  width: `${pivotColumn.minWidth}px`
                })}
                toggleSort={(e) => {
                  pivotColumn.sortable && this.sortColumn(pivotColumn.pivotColumns, e.shiftKey)
                }}
              >
                {pivotColumn.pivotColumns.map((column, i) => {
                  return (
                    <span key={column.id}>
                      {typeof column.header === 'function' ? (
                        <column.header
                          data={sortedData}
                          column={column}
                        />
                      ) : column.header}
                      {i < pivotColumn.pivotColumns.length - 1 && (
                        <ExpanderComponent />
                      )}
                    </span>
                  )
                })}
              </ThComponent>
            ) : SubComponent ? (
              <ThComponent
                className={classnames(thClassname, 'rt-expander-header')}
                style={_.prefixAll({
                  flex: `0 0 auto`,
                  width: `${expanderColumnWidth}px`
                })}
              />
            ) : null}
            {standardColumns.map(makeHeaderGroupColumn)}
          </TrComponent>
        </TheadComponent>
      )
    }
    const makeHeaderGroupColumn = (column, i) => {
      const sort = sorting.find(d => d.id === column.id)
      const show = typeof column.show === 'function' ? column.show() : column.show
      return (
        <ThComponent
          key={i}
          className={classnames(
            thClassname,
            column.headerClassName,
            sort ? (sort.asc ? '-sort-asc' : '-sort-desc') : '',
            {
              '-cursor-pointer': column.sortable,
              '-hidden': !show
            }
          )}
          style={Object.assign({}, thStyle, column.headerStyle, _.prefixAll({
            flex: `${columnPercentage} 0 auto`,
            width: `${column.minWidth}px`
          }))}
          toggleSort={(e) => {
            column.sortable && this.sortColumn(column, e.shiftKey)
          }}
        >
          {typeof column.header === 'function' ? (
            <column.header
              data={sortedData}
              column={column}
            />
          ) : column.header}
        </ThComponent>
      )
    }

    const makePageRow = (row, i, path = []) => {
      const rowInfo = {
        row: row.__original,
        rowValues: row,
        index: row.__index,
        viewIndex: ++rowIndex,
        level: path.length,
        nestingPath: path.concat([i]),
        aggregated: !!row[subRowsKey],
        subRows: row[subRowsKey]
      }
      const isExpanded = _.get(expandedRows, rowInfo.nestingPath)
      const rowPivotColumn = allDecoratedColumns.find(d => d.id === row[pivotIDKey])
      const PivotCell = rowPivotColumn && rowPivotColumn.pivotRender
      return (
        <TrGroupComponent key={i}>
          <TrComponent
            onClick={event => onTrClick(rowInfo.row, event)}
            className={classnames(trClassName, trClassCallback(rowInfo), row._viewIndex % 2 ? '-even' : '-odd')}
            style={Object.assign({}, trStyle, trStyleCallback(rowInfo))}
          >
            {(pivotBy.length || SubComponent) && (
              <TdComponent
                className={classnames(thClassname, 'rt-pivot')}
                style={_.prefixAll({
                  paddingLeft: rowInfo.nestingPath.length === 1 ? undefined : `${30 * (rowInfo.nestingPath.length - 1)}px`,
                  flex: `${pivotColumn ? columnPercentage : 0} 0 auto`,
                  width: `${pivotColumn ? pivotColumn.minWidth : expanderColumnWidth}px`
                })}
                onClick={(e) => {
                  if (onExpandRow) {
                    return onExpandRow(rowInfo.nestingPath, e)
                  }
                  let newExpandedRows = _.clone(expandedRows)
                  if (isExpanded) {
                    return this.setStateWithData({
                      expandedRows: _.set(newExpandedRows, rowInfo.nestingPath, false)
                    })
                  }
                  return this.setStateWithData({
                    expandedRows: _.set(newExpandedRows, rowInfo.nestingPath, {})
                  })
                }}
              >
                {rowInfo.subRows ? (
                  <span>
                    <ExpanderComponent
                      isExpanded={isExpanded}
                    />
                    {rowPivotColumn && rowPivotColumn.pivotRender ? (
                      <PivotCell
                        {...rowInfo}
                        value={rowInfo.rowValues[pivotValKey]}
                      />
                    ) : <span>{row[pivotValKey]} ({rowInfo.subRows.length})</span>}
                  </span>
                ) : SubComponent ? (
                  <span>
                    <ExpanderComponent
                      isExpanded={isExpanded}
                    />
                  </span>
                ) : null}
              </TdComponent>
            )}
            {standardColumns.map((column, i2) => {
              const Cell = column.render
              const show = typeof column.show === 'function' ? column.show() : column.show
              return (
                <TdComponent
                  key={i2}
                  className={classnames(column.className, {hidden: !show})}
                  style={Object.assign({}, tdStyle, column.style, _.prefixAll({
                    flex: `${columnPercentage} 0 auto`,
                    width: `${column.minWidth}px`
                  }))}
                >
                  {typeof Cell === 'function' ? (
                    <Cell
                      {...rowInfo}
                      value={rowInfo.rowValues[column.id]}
                    />
                  ) : typeof Cell !== 'undefined' ? Cell
                  : rowInfo.rowValues[column.id]}
                </TdComponent>
              )
            })}
          </TrComponent>
          {(
            rowInfo.subRows &&
            isExpanded &&
            rowInfo.subRows.map((d, i) => makePageRow(d, i, rowInfo.nestingPath))
          )}
          {SubComponent && !rowInfo.subRows && isExpanded && SubComponent(rowInfo)}
        </TrGroupComponent>
      )
    }

    const makePadRow = (row, i) => {
      return (
        <TrGroupComponent
          key={i}
        >
          <TrComponent
            className={classnames(trClassName, '-padRow')}
            style={trStyle}
          >
            {SubComponent && (
              <ThComponent
                className={classnames(thClassname, 'rt-expander-header')}
                style={_.prefixAll({
                  flex: `0 0 auto`,
                  width: `${expanderColumnWidth}px`
                })}
              />
            )}
            {standardColumns.map((column, i2) => {
              const show = typeof column.show === 'function' ? column.show() : column.show
              return (
                <TdComponent
                  key={i2}
                  className={classnames(column.className, {hidden: !show})}
                  style={Object.assign({}, tdStyle, column.style, {
                    flex: `${columnPercentage} 0 auto`,
                    width: `${column.minWidth}px`
                  })}
                >
                  &nbsp;
                </TdComponent>
              )
            })}
          </TrComponent>
        </TrGroupComponent>
      )
    }

    return (
      <div
        className={classnames(className, 'ReactTable')}
        style={style}
      >
        <TableComponent
          className={classnames(tableClassName)}
          style={tableStyle}
        >
          {hasHeaderGroups && makeHeaderGroup()}
          {makeHeader()}
          <TbodyComponent
            className={classnames(tbodyClassName)}
            style={Object.assign({}, tbodyStyle, {
              minWidth: `${rowWidth}px`
            })}
          >
            {pageRows.map((d, i) => makePageRow(d, i))}
            {padRows.map(makePadRow)}
          </TbodyComponent>
        </TableComponent>
        {showPagination && (
          <PaginationComponent
            {...resolvedProps}
            pages={pages}
            canPrevious={canPrevious}
            canNext={canNext}
            onPageChange={this.onPageChange}
            onPageSizeChange={this.onPageSizeChange}
            className={paginationClassName}
          />
        )}
        <LoadingComponent
          loading={loading}
          loadingText={loadingText}
        />
      </div>
    )
  },

  // Helpers
  getDataModel (nextProps, nextState) {
    const {
      columns,
      pivotBy,
      data,
      pivotIDKey,
      pivotValKey,
      subRowsKey
    } = this.getResolvedState(nextProps, nextState)

    // Determine Header Groups
    let hasHeaderGroups = false
    columns.forEach(column => {
      if (column.columns) {
        hasHeaderGroups = true
      }
    })

    // Build Header Groups
    const headerGroups = []
    let currentSpan = []

    // A convenience function to add a header and reset the currentSpan
    const addHeader = (columns, column = {}) => {
      headerGroups.push(Object.assign({}, column, {
        columns: columns
      }))
      currentSpan = []
    }

    // Decorate the columns
    const decorateAndAddToAll = (col) => {
      const decoratedColumn = this.makeDecoratedColumn(col)
      allDecoratedColumns.push(decoratedColumn)
      return decoratedColumn
    }
    let allDecoratedColumns = []
    const decoratedColumns = columns.map((column, i) => {
      if (column.columns) {
        return {
          ...column,
          columns: column.columns.map(decorateAndAddToAll)
        }
      } else {
        decorateAndAddToAll(column)
      }
    })

    // Build the visible columns and headers and flat column list
    let visibleColumns = decoratedColumns.slice()
    let allVisibleColumns = []

    visibleColumns = visibleColumns.map((column, i) => {
      if (column.columns) {
        const visibleSubColumns = column.columns.filter(d => pivotBy.indexOf(d.id) > -1 ? false : _.getFirstDefined(d.show, true))
        return {
          ...column,
          columns: visibleSubColumns
        }
      }
      return column
    })

    visibleColumns = visibleColumns.filter(column => {
      return column.columns ? column.columns.length : pivotBy.indexOf(column.id) > -1 ? false : _.getFirstDefined(column.show, true)
    })

    // Build allVisible columns and HeaderGroups
    visibleColumns.forEach((column, i) => {
      if (column.columns) {
        allVisibleColumns = allVisibleColumns.concat(column.columns)
        if (currentSpan.length > 0) {
          addHeader(currentSpan)
        }
        addHeader(column.columns, column)
        return
      }
      allVisibleColumns.push(column)
      currentSpan.push(column)
    })
    if (hasHeaderGroups && currentSpan.length > 0) {
      addHeader(currentSpan)
    }

    // Move the pivot columns into a single column if needed
    if (pivotBy.length) {
      const pivotColumns = []
      for (var i = 0; i < allDecoratedColumns.length; i++) {
        if (pivotBy.indexOf(allDecoratedColumns[i].id) > -1) {
          pivotColumns.push(allDecoratedColumns[i])
        }
      }
      allVisibleColumns.unshift({
        ...pivotColumns[0],
        pivotColumns
      })
    }

    // Determine the flex percentage for each column
    const columnPercentage = 100 / allVisibleColumns.length

    // Access the data
    let resolvedData = data.map((d, i) => {
      const row = {
        __original: d,
        __index: i
      }
      allDecoratedColumns.forEach(column => {
        row[column.id] = column.accessor(d)
      })
      return row
    })

    // If pivoting, recursively group the data
    const aggregate = (rows) => {
      const aggregationValues = {}
      aggregatingColumns.forEach(column => {
        const values = rows.map(d => d[column.id])
        aggregationValues[column.id] = column.aggregate(values, rows)
      })
      return aggregationValues
    }
    let standardColumns = pivotBy.length ? allVisibleColumns.slice(1) : allVisibleColumns
    const aggregatingColumns = standardColumns.filter(d => d.aggregate)
    let pivotColumn
    if (pivotBy.length) {
      pivotColumn = allVisibleColumns[0]
      const groupRecursively = (rows, keys, i = 0) => {
        // This is the last level, just return the rows
        if (i === keys.length) {
          return rows
        }
        // Group the rows together for this level
        let groupedRows = Object.entries(
          _.groupBy(rows, keys[i]))
            .map(([key, value]) => {
              return {
                [pivotIDKey]: keys[i],
                [pivotValKey]: key,
                [keys[i]]: key,
                [subRowsKey]: value
              }
            }
        )
        // Recurse into the subRows
        groupedRows = groupedRows.map(rowGroup => {
          let subRows = groupRecursively(rowGroup[subRowsKey], keys, i + 1)
          return {
            ...rowGroup,
            [subRowsKey]: subRows,
            ...aggregate(subRows)
          }
        })
        return groupedRows
      }
      resolvedData = groupRecursively(resolvedData, pivotBy)
    }

    return {
      resolvedData,
      columnPercentage,
      pivotColumn,
      allVisibleColumns,
      headerGroups,
      standardColumns,
      allDecoratedColumns,
      hasHeaderGroups
    }
  },

  getSortedData (nextProps, nextState) {
    const {
      manual,
      sorting,
      allDecoratedColumns,
      resolvedData
    } = this.getResolvedState(nextProps, nextState)

    const resolvedSorting = sorting.length ? sorting : this.getInitSorting(allDecoratedColumns)

    // Resolve the data from either manual data or sorted data
    return {
      sortedData: manual ? resolvedData : this.sortData(resolvedData, resolvedSorting)
    }
  },

  fireOnChange () {
    this.props.onChange(this.getResolvedState(), this)
  },
  getPropOrState (key) {
    return _.getFirstDefined(this.props[key], this.state[key])
  },
  getStateOrProp (key) {
    return _.getFirstDefined(this.state[key], this.props[key])
  },
  getInitSorting (columns) {
    if (!columns) {
      return []
    }
    const initSorting = columns.filter(d => {
      return typeof d.sort !== 'undefined'
    }).map(d => {
      return {
        id: d.id,
        asc: d.sort === 'asc'
      }
    })

    return initSorting.length ? initSorting : [{
      id: columns[0].id,
      asc: true
    }]
  },
  sortData (data, sorting) {
    const sorted = _.sortBy(data, sorting.map(sort => {
      return row => {
        if (row[sort.id] === null || row[sort.id] === undefined) {
          return -Infinity
        }
        return typeof row[sort.id] === 'string' ? row[sort.id].toLowerCase() : row[sort.id]
      }
    }), sorting.map(d => d.asc ? 'asc' : 'desc'))

    return sorted.map(row => {
      if (!row[this.props.subRowsKey]) {
        return row
      }
      return {
        ...row,
        [this.props.subRowsKey]: this.sortData(row[this.props.subRowsKey], sorting)
      }
    })
  },
  makeDecoratedColumn (column) {
    const dcol = Object.assign({}, this.props.column, column)

    if (typeof dcol.accessor === 'string') {
      dcol.id = dcol.id || dcol.accessor
      const accessorString = dcol.accessor
      dcol.accessor = row => _.get(row, accessorString)
      return dcol
    }

    if (dcol.accessor && !dcol.id) {
      console.warn(dcol)
      throw new Error('A column id is required if using a non-string accessor for column above.')
    }

    if (!dcol.accessor) {
      dcol.accessor = d => undefined
    }

    return dcol
  },
  getMinRows () {
    return _.getFirstDefined(this.props.minRows, this.getStateOrProp('pageSize'))
  },

  // User actions
  onPageChange (page) {
    const { onPageChange } = this.props
    if (onPageChange) {
      return onPageChange(page)
    }
    this.setStateWithData({
      expandedRows: {},
      page
    }, () => {
      this.fireOnChange()
    })
  },
  onPageSizeChange (newPageSize) {
    const { onPageSizeChange } = this.props
    const { pageSize, page } = this.getResolvedState()

    // Normalize the page to display
    const currentRow = pageSize * page
    const newPage = Math.floor(currentRow / newPageSize)

    if (onPageSizeChange) {
      return onPageSizeChange(newPageSize, newPage)
    }

    this.setStateWithData({
      pageSize: newPageSize,
      page: newPage
    }, () => {
      this.fireOnChange()
    })
  },
  sortColumn (column, additive) {
    const { sorting } = this.getResolvedState()
    const { onSortingChange } = this.props
    if (onSortingChange) {
      return onSortingChange(column, additive)
    }
    let newSorting = _.clone(sorting || [])
    if (_.isArray(column)) {
      const existingIndex = newSorting.findIndex(d => d.id === column[0].id)
      if (existingIndex > -1) {
        const existing = newSorting[existingIndex]
        if (existing.asc) {
          column.forEach((d, i) => {
            newSorting[existingIndex + i].asc = false
          })
        } else {
          if (additive) {
            newSorting.splice(existingIndex, column.length)
          } else {
            column.forEach((d, i) => {
              newSorting[existingIndex + i].asc = true
            })
          }
        }
        if (!additive) {
          newSorting = newSorting.slice(existingIndex, column.length)
        }
      } else {
        if (additive) {
          newSorting = newSorting.concat(column.map(d => ({
            id: d.id,
            asc: true
          })))
        } else {
          newSorting = column.map(d => ({
            id: d.id,
            asc: true
          }))
        }
      }
    } else {
      const existingIndex = newSorting.findIndex(d => d.id === column.id)
      if (existingIndex > -1) {
        const existing = newSorting[existingIndex]
        if (existing.asc) {
          existing.asc = false
          if (!additive) {
            newSorting = [existing]
          }
        } else {
          if (additive) {
            newSorting.splice(existingIndex, 1)
          } else {
            existing.asc = true
            newSorting = [existing]
          }
        }
      } else {
        if (additive) {
          newSorting.push({
            id: column.id,
            asc: true
          })
        } else {
          newSorting = [{
            id: column.id,
            asc: true
          }]
        }
      }
    }
    this.setStateWithData({
      page: ((!sorting.length && newSorting.length) || !additive) ? 0 : this.state.page,
      sorting: newSorting
    }, () => {
      this.fireOnChange()
    })
  }
})
