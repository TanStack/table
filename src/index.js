import React from 'react'
import classnames from 'classnames'
//
import _ from './utils'

import componentMethods from './componentMethods'
import Pagination from './pagination'

const emptyObj = () => ({})

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
  // page: undefined,
  // pageSize: undefined,
  // sorting: undefined,

  // Controlled State Callbacks
  onExpandSubComponent: undefined,
  onPageChange: undefined,
  onPageSizeChange: undefined,
  onSortingChange: undefined,

  // Pivoting
  pivotBy: undefined,
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

  // Classes
  className: '',
  style: {},

  // Component decorators
  getProps: emptyObj,
  getTableProps: emptyObj,
  getTheadGroupProps: emptyObj,
  getTheadGroupTrProps: emptyObj,
  getTheadGroupThProps: emptyObj,
  getTheadProps: emptyObj,
  getTheadTrProps: emptyObj,
  getTheadThProps: emptyObj,
  getTbodyProps: emptyObj,
  getTrGroupProps: emptyObj,
  getTrProps: emptyObj,
  getThProps: emptyObj,
  getTdProps: emptyObj,
  getPaginationProps: emptyObj,
  getLoadingProps: emptyObj,

  // Global Column Defaults
  column: {
    sortable: true,
    show: true,
    minWidth: 100,
    // Cells only
    render: undefined,
    className: '',
    style: {},
    getProps: () => ({}),
    // Headers only
    header: undefined,
    headerClassName: '',
    headerStyle: {},
    getHeaderProps: () => ({})
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
  LoadingComponent: ({className, loading, loadingText, ...rest}) => (
    <div className={classnames(
      '-loading',
      {'-active': loading},
      className
    )}
      {...rest}
    >
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
    const resolvedState = {
      ...this.state,
      ...state,
      ...this.props,
      ...props
    }
    return resolvedState
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
    const resolvedState = this.getResolvedState()
    const {
      children,
      className,
      style,
      getProps,
      getTableProps,
      getTheadGroupProps,
      getTheadGroupTrProps,
      getTheadGroupThProps,
      getTheadProps,
      getTheadTrProps,
      getTheadThProps,
      getTbodyProps,
      getTrGroupProps,
      getTrProps,
      getThProps,
      getTdProps,
      getPaginationProps,
      getLoadingProps,
      showPagination,
      expanderColumnWidth,
      manual,
      loadingText,
      // State
      loading,
      pageSize,
      page,
      resolvedSorting,
      pages,
      // Pivoting State
      pivotValKey,
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
      // Data model
      resolvedData,
      allVisibleColumns,
      headerGroups,
      hasHeaderGroups,
      // Sorted Data
      sortedData
    } = resolvedState

    // Determine the flex percentage for each column
    // const columnPercentage = 100 / allVisibleColumns.length

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

    const rowMinWidth = _.sum(allVisibleColumns.map(d => _.getFirstDefined(d.width, d.minWidth)))

    let rowIndex = -1

    const finalState = {
      ...resolvedState,
      startRow,
      endRow,
      pageRows,
      minRows,
      padRows,
      canPrevious,
      canNext,
      rowMinWidth
    }

    // Visual Components

    const makeHeaderGroups = () => {
      const theadGroupProps = _.splitProps(getTheadGroupProps(finalState, undefined, undefined, this))
      const theadGroupTrProps = _.splitProps(getTheadGroupTrProps(finalState, undefined, undefined, this))
      return (
        <TheadComponent
          className={classnames('-headerGroups', theadGroupProps.className)}
          style={{
            ...theadGroupProps.style,
            minWidth: `${rowMinWidth}px`
          }}
          {...theadGroupProps.rest}
        >
          <TrComponent
            className={theadGroupTrProps.className}
            style={theadGroupTrProps.style}
            {...theadGroupTrProps.rest}
          >
            {headerGroups.map(makeHeaderGroup)}
          </TrComponent>
        </TheadComponent>
      )
    }

    const makeHeaderGroup = (column, i) => {
      const flex = _.sum(column.columns.map(d => d.width ? 0 : d.minWidth))
      const width = _.sum(column.columns.map(d => _.getFirstDefined(d.width, d.minWidth)))
      const maxWidth = _.sum(column.columns.map(d => _.getFirstDefined(d.width, d.maxWidth)))
      const theadGroupThProps = _.splitProps(getTheadGroupThProps(finalState, undefined, column, this))
      const columnHeaderProps = _.splitProps(column.getHeaderProps(finalState, undefined, column, this))

      const classes = [
        column.headerClassName,
        theadGroupThProps.className,
        columnHeaderProps.className
      ]

      const styles = {
        ...column.headerStyle,
        ...theadGroupThProps.style,
        ...columnHeaderProps.style
      }

      const rest = {
        ...theadGroupThProps.rest,
        ...columnHeaderProps.rest
      }

      const flexStyles = {
        flex: `${flex} 0 auto`,
        width: `${width}px`,
        maxWidth: `${maxWidth}px`
      }

      if (column.expander) {
        if (column.pivotColumns) {
          return (
            <ThComponent
              className={classnames(
                'rt-pivot-header',
                classes
              )}
              style={{
                ...styles,
                ...flexStyles
              }}
              {...rest}
            />
          )
        }
        return (
          <ThComponent
            className={classnames(
              'rt-expander-header',
              classes
            )}
            style={{
              ...styles,
              flex: `0 0 auto`,
              width: `${expanderColumnWidth}px`
            }}
            {...rest}
          />
        )
      }
      return (
        <ThComponent
          key={i}
          className={classnames(
            classes
          )}
          style={{
            ...styles,
            ...flexStyles
          }}
          {...rest}
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

    const makeHeaders = () => {
      const theadProps = _.splitProps(getTheadProps(finalState, undefined, undefined, this))
      const theadTrProps = _.splitProps(getTheadTrProps(finalState, undefined, undefined, this))
      return (
        <TheadComponent
          className={classnames('-header', theadProps.className)}
          style={{
            ...theadProps.style,
            minWidth: `${rowMinWidth}px`
          }}
          {...theadProps.rest}
        >
          <TrComponent
            className={theadTrProps.className}
            style={theadTrProps.style}
            {...theadTrProps.rest}
          >
            {allVisibleColumns.map(makeHeader)}
          </TrComponent>
        </TheadComponent>
      )
    }

    const makeHeader = (column, i) => {
      const sort = resolvedSorting.find(d => d.id === column.id)
      const show = typeof column.show === 'function' ? column.show() : column.show
      const width = _.getFirstDefined(column.width, column.minWidth)
      const maxWidth = _.getFirstDefined(column.width, column.maxWidth)
      const theadThProps = _.splitProps(getTheadThProps(finalState, undefined, column, this))
      const columnHeaderProps = _.splitProps(column.getHeaderProps(finalState, undefined, column, this))

      const classes = [
        column.headerClassName,
        theadThProps.className,
        columnHeaderProps.className
      ]

      const styles = {
        ...column.headerStyle,
        ...theadThProps.style,
        ...columnHeaderProps.style
      }

      const rest = {
        ...theadThProps.rest,
        ...columnHeaderProps.rest
      }

      if (column.expander) {
        if (column.pivotColumns) {
          const pivotSort = resolvedSorting.find(d => d.id === column.id)
          return (
            <ThComponent
              key={i}
              className={classnames(
                'rt-pivot-header',
                column.sortable && '-cursor-pointer',
                classes,
                pivotSort ? (pivotSort.asc ? '-sort-asc' : '-sort-desc') : ''
              )}
              style={{
                ...styles,
                flex: `${width} 0 auto`,
                width: `${width}px`,
                maxWidth: `${maxWidth}px`
              }}
              toggleSort={(e) => {
                column.sortable && this.sortColumn(column.pivotColumns, e.shiftKey)
              }}
              {...rest}
            >
              {column.pivotColumns.map((pivotColumn, i) => {
                return (
                  <span key={pivotColumn.id}>
                    {typeof pivotColumn.header === 'function' ? (
                      <pivotColumn.header
                        data={sortedData}
                        column={pivotColumn}
                      />
                    ) : pivotColumn.header}
                    {i < column.pivotColumns.length - 1 && (
                      <ExpanderComponent />
                    )}
                  </span>
                )
              })}
            </ThComponent>
          )
        }
        return (
          <ThComponent
            key={i}
            className={classnames(
              'rt-expander-header',
              classes
            )}
            style={{
              ...styles,
              flex: `0 0 auto`,
              width: `${expanderColumnWidth}px`
            }}
            {...rest}
          />
        )
      }

      return (
        <ThComponent
          key={i}
          className={classnames(
            classes,
            sort ? (sort.asc ? '-sort-asc' : '-sort-desc') : '',
            column.sortable && '-cursor-pointer',
            !show && '-hidden',
          )}
          style={{
            ...styles,
            flex: `${width} 0 auto`,
            width: `${width}px`,
            maxWidth: `${maxWidth}px`
          }}
          toggleSort={(e) => {
            column.sortable && this.sortColumn(column, e.shiftKey)
          }}
          {...rest}
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
      const trGroupProps = getTrGroupProps(finalState, rowInfo, undefined, this)
      const trProps = _.splitProps(getTrProps(finalState, rowInfo, undefined, this))
      return (
        <TrGroupComponent
          key={rowInfo.nestingPath.join('_')}
          {...trGroupProps}
        >
          <TrComponent
            className={classnames(
              trProps.className,
              row._viewIndex % 2 ? '-even' : '-odd'
            )}
            style={trProps.style}
            {...trProps.rest}
          >
            {allVisibleColumns.map((column, i2) => {
              const Cell = column.render
              const show = typeof column.show === 'function' ? column.show() : column.show
              const width = _.getFirstDefined(column.width, column.minWidth)
              const maxWidth = _.getFirstDefined(column.width, column.maxWidth)
              const tdProps = _.splitProps(getTdProps(finalState, rowInfo, column, this))
              const columnProps = _.splitProps(column.getProps(finalState, rowInfo, column, this))

              const classes = [
                tdProps.className,
                column.className,
                columnProps.className
              ]

              const styles = {
                ...tdProps.style,
                ...column.style,
                ...columnProps.style
              }

              if (column.expander) {
                const onTdClick = (e) => {
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
                }

                if (column.pivotColumns) {
                  // Return the pivot expander cell
                  const PivotCell = column.pivotRender
                  return (
                    <TdComponent
                      className={classnames(
                        'rt-pivot',
                        classes
                      )}
                      style={{
                        ...styles,
                        paddingLeft: rowInfo.nestingPath.length === 1 ? undefined : `${30 * (rowInfo.nestingPath.length - 1)}px`,
                        flex: `${width} 0 auto`,
                        width: `${width}px`,
                        maxWidth: `${maxWidth}px`
                      }}
                      {...tdProps.rest}
                      onClick={onTdClick}
                    >
                      {rowInfo.subRows ? (
                        <span>
                          <ExpanderComponent
                            isExpanded={isExpanded}
                          />
                          {column && column.pivotRender ? (
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
                  )
                }

                // Return the regular expander cell
                return (
                  <TdComponent
                    className={classnames(
                      classes,
                      {hidden: !show}
                    )}
                    style={{
                      ...styles,
                      flex: `0 0 auto`,
                      width: `${expanderColumnWidth}px`
                    }}
                    onClick={onTdClick}
                  >
                    <span>
                      <ExpanderComponent
                        isExpanded={isExpanded}
                      />
                    </span>
                  </TdComponent>
                )
              }

              // Return regular cell
              return (
                <TdComponent
                  key={i2}
                  className={classnames(
                    classes,
                    !show && 'hidden'
                  )}
                  style={{
                    ...styles,
                    flex: `${width} 0 auto`,
                    width: `${width}px`,
                    maxWidth: `${maxWidth}px`
                  }}
                  {...tdProps.rest}
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
      const trGroupProps = getTrGroupProps(finalState, undefined, undefined, this)
      const trProps = _.splitProps(getTrProps(finalState, undefined, undefined, this))
      const thProps = _.splitProps(getThProps(finalState, undefined, undefined, this))
      return (
        <TrGroupComponent
          key={i}
          {...trGroupProps}
        >
          <TrComponent
            className={classnames(
              '-padRow',
              trProps.className,
            )}
            style={trProps.style || {}}
          >
            {SubComponent && (
              <ThComponent
                className={classnames(
                  'rt-expander-header',
                  thProps.className
                )}
                style={{
                  ...thProps.style,
                  flex: `0 0 auto`,
                  width: `${expanderColumnWidth}px`
                }}
                {...thProps.rest}
              />
            )}
            {allVisibleColumns.map((column, i2) => {
              const show = typeof column.show === 'function' ? column.show() : column.show
              const width = _.getFirstDefined(column.width, column.minWidth)
              const maxWidth = _.getFirstDefined(column.width, column.maxWidth)
              const tdProps = _.splitProps(getTdProps(finalState, undefined, column, this))
              const columnProps = _.splitProps(column.getProps(finalState, undefined, column, this))

              const classes = [
                tdProps.className,
                column.className,
                columnProps.className
              ]

              const styles = {
                ...tdProps.style,
                ...column.style,
                ...columnProps.style
              }

              return (
                <TdComponent
                  key={i2}
                  className={classnames(
                    classes,
                    !show && 'hidden'
                  )}
                  style={{
                    ...styles,
                    flex: `${width} 0 auto`,
                    width: `${width}px`,
                    maxWidth: `${maxWidth}px`
                  }}
                  {...tdProps.rest}
                >
                  &nbsp;
                </TdComponent>
              )
            })}
          </TrComponent>
        </TrGroupComponent>
      )
    }

    const makeTable = () => {
      const rootProps = _.splitProps(getProps(finalState, undefined, undefined, this))
      const tableProps = _.splitProps(getTableProps(finalState, undefined, undefined, this))
      const tBodyProps = _.splitProps(getTbodyProps(finalState, undefined, undefined, this))
      const paginationProps = _.splitProps(getPaginationProps(finalState, undefined, undefined, this))
      const loadingProps = getLoadingProps(finalState, undefined, undefined, this)
      return (
        <div
          className={classnames(
            'ReactTable',
            className,
            rootProps.className
          )}
          style={{
            ...style,
            ...rootProps.style
          }}
          {...rootProps.rest}
        >
          <TableComponent
            className={classnames(tableProps.className)}
            style={tableProps.style}
            {...tableProps.rest}
          >
            {hasHeaderGroups && makeHeaderGroups()}
            {makeHeaders()}
            <TbodyComponent
              className={classnames(tBodyProps.className)}
              style={{
                ...tBodyProps.style,
                minWidth: `${rowMinWidth}px`
              }}
              {...tBodyProps.rest}
            >
              {pageRows.map((d, i) => makePageRow(d, i))}
              {padRows.map(makePadRow)}
            </TbodyComponent>
          </TableComponent>
          {showPagination && (
            <PaginationComponent
              {...resolvedState}
              pages={pages}
              canPrevious={canPrevious}
              canNext={canNext}
              onPageChange={this.onPageChange}
              onPageSizeChange={this.onPageSizeChange}
              className={paginationProps.className}
              style={paginationProps.style}
              {...paginationProps.rest}
            />
          )}
          <LoadingComponent
            loading={loading}
            loadingText={loadingText}
            {...loadingProps}
          />
        </div>
      )
    }

    // childProps are optionally passed to a function-as-a-child
    return children ? children(finalState, makeTable, this) : makeTable()
  },

  // Helpers
  ...componentMethods

})
