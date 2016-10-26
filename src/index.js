import React from 'react'
import classnames from 'classnames'
//
const _ = {
  get,
  takeRight,
  last,
  orderBy,
  range,
  clone,
  remove
}

const defaultButton = (props) => (
  <button {...props} className='-btn'>{props.children}</button>
)

export const ReactTableDefaults = {
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
  //
  pageSize: 20,
  minRows: 0,
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
  // Components
  tableComponent: (props) => <table {...props}>{props.children}</table>,
  theadComponent: (props) => <thead {...props}>{props.children}</thead>,
  tbodyComponent: (props) => <tbody {...props}>{props.children}</tbody>,
  trComponent: (props) => <tr {...props}>{props.children}</tr>,
  thComponent: (props) => <th {...props}>{props.children}</th>,
  tdComponent: (props) => <td {...props}>{props.children}</td>,
  previousComponent: null,
  nextComponent: null,
  // Unlisted
  data: []
}

export default React.createClass({
  getDefaultProps () {
    return ReactTableDefaults
  },
  getInitialState () {
    return {
      sorting: false
    }
  },
  componentWillMount () {
    this.update(this.props)
  },
  componentWillReceiveProps (nextProps) {
    this.update(nextProps)
  },
  update (props) {
    const resetState = {
      loading: false,
      page: 0,
      pages: -1
      // columns: {}  for column hiding in the future
    }
    this.setState(resetState)
    const newState = Object.assign({}, this.state, resetState)
    this.isAsync = typeof props.data === 'function'
    this.buildColumns(props, newState)
    this.buildData(props, newState)
  },
  buildColumns (props) {
    this.hasHeaderGroups = false
    props.columns.forEach(column => {
      if (column.columns) {
        this.hasHeaderGroups = true
      }
    })

    this.headerGroups = []
    this.decoratedColumns = []
    let currentSpan = []

    const addHeader = (columns, column = {}) => {
      this.headerGroups.push(Object.assign({}, column, {
        columns: columns
      }))
      currentSpan = []
    }
    const makeDecoratedColumn = (column) => {
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

      dcol.accessor = d => undefined
      return dcol
    }

    props.columns.forEach((column, i) => {
      if (column.columns) {
        column.columns.forEach(nestedColumn => {
          this.decoratedColumns.push(makeDecoratedColumn(nestedColumn))
        })
        if (this.hasHeaderGroups) {
          if (currentSpan.length > 0) {
            addHeader(currentSpan)
          }
          addHeader(_.takeRight(this.decoratedColumns, column.columns.length), column)
        }
      } else {
        this.decoratedColumns.push(makeDecoratedColumn(column))
        currentSpan.push(_.last(this.decoratedColumns))
      }
    })

    if (this.hasHeaderGroups && currentSpan.length > 0) {
      addHeader(currentSpan)
    }
  },
  getInitSorting () {
    const initSorting = this.decoratedColumns.filter(d => {
      return typeof d.sort !== 'undefined'
    }).map(d => {
      return {
        id: d.id,
        asc: d.sort === 'asc'
      }
    })

    return initSorting.length ? initSorting : [{
      id: this.decoratedColumns[0].id,
      asc: true
    }]
  },
  buildData (props, state) {
    const sorting = state.sorting === false ? this.getInitSorting() : state.sorting

    const setData = (data) => {
      this.setState({
        sorting,
        data,
        page: state.page,
        loading: false
      })
    }

    if (this.isAsync) {
      this.setState({
        loading: true
      })

      const cb = (res) => {
        if (!res) {
          return Promise.reject('Uh Oh! Nothing was returned in ReactTable\'s data callback!')
        }
        if (res.pages) {
          this.setState({
            pages: res.pages
          })
        }
        // Only access the data. Sorting is done server side.
        const accessedData = this.accessData(res.rows)
        setData(accessedData)
      }

      // Fetch data with current state
      const dataRes = props.data({
        sorting,
        page: state.page || 0,
        pageSize: props.pageSize,
        pages: state.pages
      }, cb)

      if (dataRes && dataRes.then) {
        dataRes.then(cb)
      }
    } else {
      // Return locally accessed, sorted data
      const accessedData = this.accessData(props.data)
      const sortedData = this.sortData(accessedData, sorting)
      setData(sortedData)
    }
  },
  accessData (data) {
    return data.map((d, i) => {
      const row = {
        __original: d,
        __index: i
      }
      this.decoratedColumns.forEach(column => {
        row[column.id] = column.accessor(d)
      })
      return row
    })
  },
  sortData (data, sorting) {
    const resolvedSorting = sorting.length ? sorting : this.getInitSorting()
    return _.orderBy(data, resolvedSorting.map(sort => {
      return row => {
        if (row[sort.id] === null || row[sort.id] === undefined) {
          return -Infinity
        }
        return typeof row[sort.id] === 'string' ? row[sort.id].toLowerCase() : row[sort.id]
      }
    }), resolvedSorting.map(d => d.asc ? 'asc' : 'desc'))
  },
  setPage (page) {
    if (this.isAsync) {
      return this.buildData(this.props, Object.assign({}, this.state, {page}))
    }
    this.setState({
      page
    })
  },

  render () {
    const data = this.state.data ? this.state.data : []

    const pagesLength = this.isAsync ? this.state.pages : Math.ceil(data.length / this.props.pageSize)
    const startRow = this.props.pageSize * this.state.page
    const endRow = startRow + this.props.pageSize
    const pageRows = this.isAsync ? data.slice(0, this.props.pageSize) : data.slice(startRow, endRow)
    const padRows = pagesLength > 1 ? _.range(this.props.pageSize - pageRows.length)
      : this.props.minRows ? _.range(Math.max(this.props.minRows - pageRows.length, 0))
      : []

    const canPrevious = this.state.page > 0
    const canNext = this.state.page + 1 < pagesLength

    const TableComponent = this.props.tableComponent
    const TheadComponent = this.props.theadComponent
    const TbodyComponent = this.props.tbodyComponent
    const TrComponent = this.props.trComponent
    const ThComponent = this.props.thComponent
    const TdComponent = this.props.tdComponent

    const PreviousComponent = this.props.previousComponent || defaultButton
    const NextComponent = this.props.nextComponent || defaultButton

    return (
      <div
        className={classnames(this.props.className, 'ReactTable')}
        style={this.props.style}
      >
        <TableComponent
          className={classnames(this.props.tableClassName)}
          style={this.props.tableStyle}
        >
          {this.hasHeaderGroups && (
            <TheadComponent
              className={classnames(this.props.theadGroupClassName, '-headerGroups')}
              style={this.props.theadStyle}
            >
              <TrComponent
                className={this.props.trClassName}
                style={this.props.trStyle}
              >
                {this.headerGroups.map((column, i) => {
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
              {this.decoratedColumns.map((column, i) => {
                const sort = this.state.sorting.find(d => d.id === column.id)
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
                    onClick={(e) => {
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
            style={classnames(this.props.tbodyStyle)}
          >
            {pageRows.map((row, i) => {
              const rowInfo = {
                row: row.__original,
                index: row.__index,
                viewIndex: i
              }
              return (
                <TrComponent
                  key={i}
                  className={classnames(this.props.trClassName, this.props.trClassCallback(rowInfo))}
                  style={Object.assign({}, this.props.trStyle, this.props.trStyleCallback(rowInfo))}
                >
                  {this.decoratedColumns.map((column, i2) => {
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
                              value={row[column.id]}
                              {...rowInfo}
                            />
                            ) : typeof Cell !== 'undefined' ? Cell
                          : row[column.id]}
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
                  {this.decoratedColumns.map((column, i2) => {
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
        {pagesLength > 1 && (
          <div
            className={classnames(this.props.paginationClassName, '-pagination')}
            style={this.props.paginationStyle}
          >
            <div className='-left'>
              <PreviousComponent
                onClick={canPrevious && ((e) => this.previousPage(e))}
                disabled={!canPrevious}
              >
                {this.props.previousText}
              </PreviousComponent>
            </div>
            <div className='-center'>
              Page {this.state.page + 1} of {pagesLength}
            </div>
            <div className='-right'>
              <NextComponent
                onClick={canNext && ((e) => this.nextPage(e))}
                disabled={!canNext}
              >
                {this.props.nextText}
              </NextComponent>
            </div>
          </div>
        )}
        <div className={classnames('-loading', {'-active': this.state.loading})}>
          <div className='-loading-inner'>
            {this.props.loadingText}
          </div>
        </div>
      </div>
    )
  },
  sortColumn (column, additive) {
    const existingSorting = this.state.sorting || []
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
    this.buildData(this.props, Object.assign({}, this.state, {page, sorting}))
  },
  nextPage (e) {
    e.preventDefault()
    this.setPage(this.state.page + 1)
  },
  previousPage (e) {
    e.preventDefault()
    this.setPage(this.state.page - 1)
  }
})

// ########################################################################
// Utils
// ########################################################################

function remove (a, b) {
  return a.filter(function (o, i) {
    var r = b(o)
    if (r) {
      a.splice(i, 1)
      return true
    }
    return false
  })
}

function get (a, b) {
  if (isArray(b)) {
    b = b.join('.')
  }
  return b
    .replace('[', '.').replace(']', '')
    .split('.')
    .reduce(
      function (obj, property) {
        return obj[property]
      }, a
    )
}

function takeRight (arr, n) {
  const start = n > arr.length ? 0 : arr.length - n
  return arr.slice(start)
}

function last (arr) {
  return arr[arr.length - 1]
}

function range (n) {
  const arr = []
  for (let i = 0; i < n; i++) {
    arr.push(n)
  }
  return arr
}

function orderBy (arr, funcs, dirs) {
  return arr.sort((a, b) => {
    for (let i = 0; i < funcs.length; i++) {
      const comp = funcs[i]
      const ca = comp(a)
      const cb = comp(b)
      const desc = dirs[i] === false || dirs[i] === 'desc'
      if (ca > cb) {
        return desc ? -1 : 1
      }
      if (ca < cb) {
        return desc ? 1 : -1
      }
    }
    return 0
  })
}

function clone (a) {
  return JSON.parse(JSON.stringify(a, function (key, value) {
    if (typeof value === 'function') {
      return value.toString()
    }
    return value
  }))
}

// ########################################################################
// Helpers
// ########################################################################

function isArray (a) {
  return Array.isArray(a)
}
