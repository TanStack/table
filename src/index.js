import React from 'react'
import classnames from 'classnames'
//
import _ from './utils'

import Pagination from './pagination'

export const ReactTableDefaults = {
  // General
  data: [],
  loading: false,
  pageSize: 20,
  showPagination: true,
  showPageSizeOptions: true,
  pageSizeOptions: [5, 10, 20, 25, 50, 100],
  showPageJump: true,
  // Callbacks
  onChange: () => null,
  // Classes
  className: '-striped -highlight',
  tableClassName: '',
  theadClassName: '',
  tbodyClassName: '',
  trClassName: '',
  trClassCallback: d => null,
  onTrClick: () => null,
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
    innerClassName: '',
    innerStyle: {},
    headerClassName: '',
    headerStyle: {},
    headerInnerClassName: '',
    headerInnerStyle: {}
  },
  // Text
  previousText: 'Previous',
  nextText: 'Next',
  loadingText: 'Loading...',
  pageText: 'Page',
  ofText: 'of',
  rowsText: 'rows',
  // Components
  tableComponent: (props) => <table {...props}>{props.children}</table>,
  theadComponent: (props) => <thead {...props}>{props.children}</thead>,
  tbodyComponent: (props) => <tbody {...props}>{props.children}</tbody>,
  trComponent: (props) => <tr {...props}>{props.children}</tr>,
  thComponent: (props) => {
    const {toggleSort, ...rest} = props
    return (
      <th {...rest} onClick={e => {
        toggleSort && toggleSort(e)
      }}>{props.children}</th>
    )
  },
  tdComponent: (props) => <td {...props}>{props.children}</td>,
  previousComponent: null,
  nextComponent: null,
  loadingComponent: props => (
    <div className={classnames('-loading', {'-active': props.loading})}>
      <div className='-loading-inner'>
        {props.loadingText}
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
      sorting: false
    }
  },
  componentDidMount () {
    this.fireOnChange()
  },
  fireOnChange () {
    this.props.onChange({
      page: this.getPropOrState('page'),
      pageSize: this.getStateOrProp('pageSize'),
      pages: this.getPagesLength(),
      sorting: this.getSorting()
    }, this)
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
  render () {
    // Build Columns
    const decoratedColumns = []
    const headerGroups = []
    let currentSpan = []

    // Determine Header Groups
    let hasHeaderGroups = false
    this.props.columns
    .forEach(column => {
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
    const visibleColumns = this.props.columns.filter(d => _.getFirstDefined(d.show, true))
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

    if (hasHeaderGroups && currentSpan.length > 0) {
      addHeader(currentSpan)
    }

    const sorting = this.getSorting(decoratedColumns)
    const accessedData = this.props.data.map((d, i) => {
      const row = {
        __original: d,
        __index: i
      }
      decoratedColumns.forEach(column => {
        row[column.id] = column.accessor(d)
      })
      return row
    })
    const data = this.props.manual ? accessedData : this.sortData(accessedData, sorting)

    // Normalize state
    const currentPage = this.getPropOrState('page')
    const pageSize = this.getStateOrProp('pageSize')
    const pagesLength = this.getPagesLength()

    // Pagination
    const startRow = pageSize * currentPage
    const endRow = startRow + pageSize
    const pageRows = this.props.manual ? data : data.slice(startRow, endRow)
    const minRows = this.getMinRows()
    const padRows = pagesLength > 1 ? _.range(pageSize - pageRows.length)
      : minRows ? _.range(Math.max(minRows - pageRows.length, 0))
      : []

    const canPrevious = currentPage > 0
    const canNext = currentPage + 1 < pagesLength

    const TableComponent = this.props.tableComponent
    const TheadComponent = this.props.theadComponent
    const TbodyComponent = this.props.tbodyComponent
    const TrComponent = this.props.trComponent
    const ThComponent = this.props.thComponent
    const TdComponent = this.props.tdComponent
    const PreviousComponent = this.props.previousComponent
    const NextComponent = this.props.nextComponent
    const LoadingComponent = this.props.loadingComponent

    return (
      <div
        className={classnames(this.props.className, 'ReactTable')}
        style={this.props.style}
      >
        <TableComponent
          className={classnames(this.props.tableClassName)}
          style={this.props.tableStyle}
        >
          {hasHeaderGroups && (
            <TheadComponent
              className={classnames(this.props.theadGroupClassName, '-headerGroups')}
              style={this.props.theadStyle}
            >
              <TrComponent
                className={this.props.trClassName}
                style={this.props.trStyle}
              >
                {headerGroups.map((column, i) => {
                  return (
                    <ThComponent
                      key={i}
                      colSpan={column.columns.length}
                      className={classnames(this.props.thClassname, column.headerClassName)}
                      style={Object.assign({}, this.props.thStyle, column.headerStyle)}
                    >
                      <div
                        className={classnames(column.headerInnerClassName, '-th-inner')}
                        style={Object.assign({}, this.props.thInnerStyle, column.headerInnerStyle)}
                      >
                        {typeof column.header === 'function' ? (
                          <column.header
                            data={this.props.data}
                            column={column}
                          />
                        ) : column.header}
                      </div>
                    </ThComponent>
                  )
                })}
              </TrComponent>
            </TheadComponent>
          )}
          <TheadComponent
            className={classnames(this.props.theadClassName)}
            style={this.props.theadStyle}
          >
            <TrComponent
              className={this.props.trClassName}
              style={this.props.trStyle}
            >
              {decoratedColumns.map((column, i) => {
                const sort = sorting.find(d => d.id === column.id)
                const show = typeof column.show === 'function' ? column.show() : column.show
                return (
                  <ThComponent
                    key={i}
                    className={classnames(
                      this.props.thClassname,
                      column.headerClassName,
                      sort ? (sort.asc ? '-sort-asc' : '-sort-desc') : '',
                      {
                        '-cursor-pointer': column.sortable,
                        '-hidden': !show
                      }
                    )}
                    style={Object.assign({}, this.props.thStyle, column.headerStyle)}
                    toggleSort={(e) => {
                      column.sortable && this.sortColumn(column, e.shiftKey)
                    }}
                  >
                    <div
                      className={classnames(column.headerInnerClassName, '-th-inner')}
                      style={Object.assign({}, column.headerInnerStyle, {
                        minWidth: column.minWidth + 'px'
                      })}
                    >
                      {typeof column.header === 'function' ? (
                        <column.header
                          data={this.props.data}
                          column={column}
                        />
                      ) : column.header}
                    </div>
                  </ThComponent>
                )
              })}
            </TrComponent>
          </TheadComponent>
          <TbodyComponent
            className={classnames(this.props.tbodyClassName)}
            style={this.props.tbodyStyle}
          >
            {pageRows.map((row, i) => {
              const rowInfo = {
                row: row.__original,
                rowValues: row,
                index: row.__index,
                viewIndex: i
              }
              return (
                <TrComponent
                  key={i}
                  onClick={event => this.props.onTrClick(rowInfo.row, event)}
                  className={classnames(this.props.trClassName, this.props.trClassCallback(rowInfo))}
                  style={Object.assign({}, this.props.trStyle, this.props.trStyleCallback(rowInfo))}
                >
                  {decoratedColumns.map((column, i2) => {
                    const Cell = column.render
                    const show = typeof column.show === 'function' ? column.show() : column.show
                    return (
                      <TdComponent
                        key={i2}
                        className={classnames(column.className, {hidden: !show})}
                        style={Object.assign({}, this.props.tdStyle, column.style)}
                      >
                        <div
                          className={classnames(column.innerClassName, '-td-inner')}
                          style={Object.assign({}, column.innerStyle, {
                            minWidth: column.minWidth + 'px'
                          })}
                        >
                          {typeof Cell === 'function' ? (
                            <Cell
                              {...rowInfo}
                              value={rowInfo.rowValues[column.id]}
                            />
                          ) : typeof Cell !== 'undefined' ? Cell
                          : rowInfo.rowValues[column.id]}
                        </div>
                      </TdComponent>
                    )
                  })}
                </TrComponent>
              )
            })}
            {padRows.map((row, i) => {
              return (
                <TrComponent
                  key={i}
                  className={classnames(this.props.trClassName, '-padRow')}
                  style={this.props.trStyle}
                >
                  {decoratedColumns.map((column, i2) => {
                    const show = typeof column.show === 'function' ? column.show() : column.show
                    return (
                      <TdComponent
                        key={i2}
                        className={classnames(column.className, {hidden: !show})}
                        style={Object.assign({}, this.props.tdStyle, column.style)}
                      >
                        <div
                          className={classnames(column.innerClassName, '-td-inner')}
                          style={Object.assign({}, column.innerStyle, {
                            minWidth: column.minWidth + 'px'
                          })}
                        >&nbsp;</div>
                      </TdComponent>
                    )
                  })}
                </TrComponent>
              )
            })}
          </TbodyComponent>
        </TableComponent>
        {this.props.showPagination && (
          <Pagination
            currentPage={currentPage}
            pagesLength={pagesLength}
            pageSize={pageSize}
            showPageSizeOptions={this.props.showPageSizeOptions}
            pageSizeOptions={this.props.pageSizeOptions}
            showPageJump={this.props.showPageJump}
            canPrevious={canPrevious}
            canNext={canNext}
            previousText={this.props.previousText}
            nextText={this.props.nextText}
            pageText={this.props.pageText}
            ofText={this.props.ofText}
            rowsText={this.props.rowsText}
            previousComponent={PreviousComponent}
            nextComponent={NextComponent}
            //
            onChange={this.setPage}
            onPageSizeChange={this.setPageSize}
          />
        )}
        <LoadingComponent {...this.props} />
      </div>
    )
  },
  // User actions
  setPage (page) {
    this.setState({
      page
    }, () => {
      this.fireOnChange()
    })
  },
  setPageSize (pageSize) {
    const currentPageSize = this.getStateOrProp('pageSize')
    const currentPage = this.getPropOrState('page')
    const currentRow = currentPageSize * currentPage
    const page = Math.floor(currentRow / pageSize)
    this.setState({
      pageSize,
      page
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
