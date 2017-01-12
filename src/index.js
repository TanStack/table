import React from 'react'
import classnames from 'classnames'
import prefixAll from 'inline-style-prefixer/static'
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
  expanderColumnWidth: 30,

  // Controlled State Overrides
  // page
  // pageSize
  // sorting
  // visibleSubComponents

  // Controlled State Callbacks
  onExpand: undefined,
  onPageChange: undefined,
  onPageSizeChange: undefined,

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
  ExpanderComponent: ({isExpanded, toggle, ...rest}) => {
    return (
      <div
        className={classnames('rt-expander', isExpanded && '-open')}
        {...rest}
      />
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
      sorting: false,
      visibleSubComponents: []
    }
  },

  componentDidMount () {
    this.fireOnChange()
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
      data,
      columns,
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
      onExpand,
      // State
      visibleSubComponents,
      loading,
      pageSize,
      page,
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
      SubComponent
    } = resolvedProps

    // Build Columns
    const decoratedColumns = []
    const headerGroups = []
    let currentSpan = []

    // Determine Header Groups
    let hasHeaderGroups = false
    columns.forEach(column => {
      if (column.columns) {
        hasHeaderGroups = true
      }
    })

    // A convenience function to add a header and reset the currentSpan
    const addHeader = (columns, column = {}) => {
      headerGroups.push(Object.assign({}, column, {
        columns: columns
      }))
      currentSpan = []
    }

    // Build the columns and headers
    const visibleColumns = columns.filter(d => _.getFirstDefined(d.show, true))
    visibleColumns.forEach((column, i) => {
      if (column.columns) {
        const nestedColumns = column.columns.filter(d => _.getFirstDefined(d.show, true))
        nestedColumns.forEach(nestedColumn => {
          decoratedColumns.push(this.makeDecoratedColumn(nestedColumn))
        })
        if (hasHeaderGroups) {
          if (currentSpan.length > 0) {
            addHeader(currentSpan)
          }
          addHeader(_.takeRight(decoratedColumns, nestedColumns.length), column)
        }
      } else {
        decoratedColumns.push(this.makeDecoratedColumn(column))
        currentSpan.push(_.last(decoratedColumns))
      }
    })

    const columnPercentage = 100 / decoratedColumns.length

    if (hasHeaderGroups && currentSpan.length > 0) {
      addHeader(currentSpan)
    }

    const sorting = this.getSorting(decoratedColumns)
    const accessedData = data.map((d, i) => {
      const row = {
        __original: d,
        __index: i
      }
      decoratedColumns.forEach(column => {
        row[column.id] = column.accessor(d)
      })
      return row
    })
    const resolvedData = manual ? accessedData : this.sortData(accessedData, sorting)

    // Normalize state
    const pagesLength = this.getPagesLength()

    // Pagination
    const startRow = pageSize * page
    const endRow = startRow + pageSize
    const pageRows = manual ? resolvedData : resolvedData.slice(startRow, endRow)
    const minRows = this.getMinRows()
    const padRows = pagesLength > 1 ? _.range(pageSize - pageRows.length)
      : minRows ? _.range(Math.max(minRows - pageRows.length, 0))
      : []

    const canPrevious = page > 0
    const canNext = page + 1 < pagesLength

    const rowWidth = (SubComponent ? expanderColumnWidth : 0) + _.sum(decoratedColumns.map(d => d.minWidth))

    return (
      <div
        className={classnames(className, 'ReactTable')}
        style={style}
      >
        <TableComponent
          className={classnames(tableClassName)}
          style={tableStyle}
        >
          {hasHeaderGroups && (
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
                {SubComponent && (
                  <ThComponent
                    className={classnames(thClassname, 'rt-expander-header')}
                    style={prefixAll({
                      flex: `0 0 auto`,
                      width: `${expanderColumnWidth}px`
                    })}
                  />
                )}
                {headerGroups.map((column, i) => {
                  return (
                    <ThComponent
                      key={i}
                      className={classnames(thClassname, column.headerClassName)}
                      style={Object.assign({}, thStyle, column.headerStyle, prefixAll({
                        flex: `${column.columns.length * columnPercentage} 0 auto`,
                        width: `${_.sum(column.columns.map(d => d.minWidth))}px`
                      }))}
                    >
                      {typeof column.header === 'function' ? (
                        <column.header
                          data={resolvedData}
                          column={column}
                        />
                      ) : column.header}
                    </ThComponent>
                  )
                })}
              </TrComponent>
            </TheadComponent>
          )}
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
              {SubComponent && (
                <ThComponent
                  className={classnames(thClassname, 'rt-expander-header')}
                  style={prefixAll({
                    flex: `0 0 auto`,
                    width: `${expanderColumnWidth}px`
                  })}
                />
              )}
              {decoratedColumns.map((column, i) => {
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
                    style={Object.assign({}, thStyle, column.headerStyle, prefixAll({
                      flex: `${columnPercentage} 0 auto`,
                      width: `${column.minWidth}px`
                    }))}
                    toggleSort={(e) => {
                      column.sortable && this.sortColumn(column, e.shiftKey)
                    }}
                  >
                    {typeof column.header === 'function' ? (
                      <column.header
                        data={resolvedData}
                        column={column}
                      />
                    ) : column.header}
                  </ThComponent>
                )
              })}
            </TrComponent>
          </TheadComponent>
          <TbodyComponent
            className={classnames(tbodyClassName)}
            style={Object.assign({}, tbodyStyle, {
              minWidth: `${rowWidth}px`
            })}
          >
            {pageRows.map((row, i) => {
              const rowInfo = {
                row: row.__original,
                rowValues: row,
                index: row.__index,
                viewIndex: i
              }
              const visibleSubComponentIndex = visibleSubComponents.indexOf(i)
              const isExpanded = visibleSubComponentIndex > -1
              return (
                <TrGroupComponent key={i}>
                  <TrComponent
                    onClick={event => onTrClick(rowInfo.row, event)}
                    className={classnames(trClassName, trClassCallback(rowInfo))}
                    style={Object.assign({}, trStyle, trStyleCallback(rowInfo))}
                  >
                    {SubComponent && (
                      <ThComponent
                        className={classnames(thClassname, 'rt-expander-wrap')}
                        style={prefixAll({
                          flex: `0 0 auto`,
                          width: `${expanderColumnWidth}px`
                        })}
                        onClick={(e) => {
                          if (onExpand) {
                            return onExpand(i, e)
                          }
                          if (isExpanded) {
                            return this.setState({
                              visibleSubComponents: [
                              ...visibleSubComponents.slice(0, visibleSubComponentIndex - 1),
                              ...visibleSubComponents.slice(visibleSubComponentIndex + 1)
                              ]
                            })
                          }
                          this.setState({
                            visibleSubComponents: [
                            ...visibleSubComponents,
                            i
                            ]
                          })
                        }}
                      >
                        <ExpanderComponent
                          isExpanded={isExpanded}
                        />
                      </ThComponent>
                    )}
                    {decoratedColumns.map((column, i2) => {
                      const Cell = column.render
                      const show = typeof column.show === 'function' ? column.show() : column.show
                      return (
                        <TdComponent
                          key={i2}
                          className={classnames(column.className, {hidden: !show})}
                          style={Object.assign({}, tdStyle, column.style, prefixAll({
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
                  {SubComponent && isExpanded ? (
                    SubComponent(rowInfo)
                  ) : null}
                </TrGroupComponent>
              )
            })}
            {padRows.map((row, i) => {
              return (
                <TrComponent
                  key={i}
                  className={classnames(trClassName, '-padRow')}
                  style={trStyle}
                >
                  {SubComponent && (
                    <ThComponent
                      className={classnames(thClassname, 'rt-expander-header')}
                      style={prefixAll({
                        flex: `0 0 auto`,
                        width: `${expanderColumnWidth}px`
                      })}
                    />
                  )}
                  {decoratedColumns.map((column, i2) => {
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
              )
            })}
          </TbodyComponent>
        </TableComponent>
        {showPagination && (
          <PaginationComponent
            {...resolvedProps}
            pagesLength={pagesLength}
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
  getResolvedState () {
    return {
      ...this.state,
      ...this.props,
      pages: this.getPagesLength(),
      sorting: this.getSorting()
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
    return _.orderBy(data, sorting.map(sort => {
      return row => {
        if (row[sort.id] === null || row[sort.id] === undefined) {
          return -Infinity
        }
        return typeof row[sort.id] === 'string' ? row[sort.id].toLowerCase() : row[sort.id]
      }
    }), sorting.map(d => d.asc ? 'asc' : 'desc'))
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
  getSorting (columns) {
    return this.props.sorting || (this.state.sorting && this.state.sorting.length ? this.state.sorting : this.getInitSorting(columns))
  },
  getPagesLength () {
    return this.props.manual ? this.props.pages
      : Math.ceil(this.props.data.length / this.getStateOrProp('pageSize'))
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
    this.setState({
      visibleSubComponents: [],
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
    const newPage = Math.floor(currentRow / pageSize)

    if (onPageSizeChange) {
      return onPageSizeChange(newPageSize, newPage)
    }

    this.setState({
      pageSize: newPageSize,
      page: newPage
    }, () => {
      this.fireOnChange()
    })
  },
  sortColumn (column, additive) {
    const existingSorting = this.getSorting()
    let sorting = _.clone(this.state.sorting || [])
    const existingIndex = sorting.findIndex(d => d.id === column.id)
    if (existingIndex > -1) {
      const existing = sorting[existingIndex]
      if (existing.asc) {
        existing.asc = false
        if (!additive) {
          sorting = [existing]
        }
      } else {
        if (additive) {
          sorting.splice(existingIndex, 1)
        } else {
          existing.asc = true
          sorting = [existing]
        }
      }
    } else {
      if (additive) {
        sorting.push({
          id: column.id,
          asc: true
        })
      } else {
        sorting = [{
          id: column.id,
          asc: true
        }]
      }
    }
    const page = (existingIndex === 0 || (!existingSorting.length && sorting.length) || !additive) ? 0 : this.state.page
    this.setState({
      page,
      sorting
    }, () => {
      this.fireOnChange()
    })
  }
})
