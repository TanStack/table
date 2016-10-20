import React from 'react'
import classnames from 'classnames'
//
import _ from './utils'

const defaultButton = (props) => (
  <button {...props} className='-btn'>{props.children}</button>
)

export const ReactTableDefaults = {
  className: '-striped -highlight',
  pageSize: 20,
  minRows: 0,
  data: [],
  previousComponent: defaultButton,
  nextComponent: defaultButton,
  previousText: 'Previous',
  nextText: 'Next',
  loadingComponent: <span>Loading...</span>,
  column: {
    sortable: true,
    show: true
  }
}

export default React.component({
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
      }
      if (!dcol.id) {
        console.warn('No column ID found for column: ', dcol)
      }
      if (!dcol.accessor) {
        console.warn('No column accessor found for column: ', dcol)
      }
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
    return data.map((d) => {
      const row = {
        __original: d
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

    const PreviousComponent = this.props.previousComponent
    const NextComponent = this.props.previousComponent

    return (
      <div className={classnames(this.props.className, 'ReactTable')}>
        <table>
          {this.hasHeaderGroups && (
            <thead className='-headerGroups'>
              <tr>
                {this.headerGroups.map((column, i) => {
                  return (
                    <th
                      key={i}
                      colSpan={column.columns.length}>
                      <div
                        className='-th-inner'>
                        {typeof column.header === 'function' ? (
                          <column.header
                            data={this.props.data}
                            column={column}
                          />
                        ) : column.header}
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
          )}
          <thead>
            <tr>
              {this.decoratedColumns.map((column, i) => {
                const sort = this.state.sorting.find(d => d.id === column.id)
                const show = typeof column.show === 'function' ? column.show() : column.show
                return (
                  <th
                    key={i}
                    className={classnames(
                      sort ? (sort.asc ? 'sort-asc' : 'sort-desc') : '',
                      {
                        'cursor-pointer': column.sortable,
                        'hidden': !show
                      }
                    )}
                    onClick={(e) => {
                      column.sortable && this.sortColumn(column, e.shiftKey)
                    }}>
                    <div
                      className='-th-inner'
                      style={{
                        width: column.width + 'px',
                        minWidth: column.minWidth + 'px'
                      }}>
                      {typeof column.header === 'function' ? (
                        <column.header
                          data={this.props.data}
                          column={column}
                        />
                      ) : column.header}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, i) => {
              return (
                <tr key={i}>
                  {this.decoratedColumns.map((column, i2) => {
                    const Cell = column.render
                    const show = typeof column.show === 'function' ? column.show() : column.show
                    return (
                      <td
                        className={classnames({hidden: !show})}
                        key={i2}>
                        <div
                          className='-td-inner'
                          style={{
                            width: column.width + 'px',
                            minWidth: column.minWidth + 'px'
                          }}>
                          {typeof Cell === 'function' ? (
                            <Cell
                              value={row[column.id]}
                              row={row.__original}
                              index={i}
                            />
                            ) : typeof Cell !== 'undefined' ? Cell
                          : row[column.id]}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
            {padRows.map((row, i) => {
              return (
                <tr key={i}>
                  {this.decoratedColumns.map((column, i2) => {
                    const show = typeof column.show === 'function' ? column.show() : column.show
                    return (
                      <td
                        className={classnames({hidden: !show})}
                        key={i2}>
                        <div
                          className='-td-inner'
                          style={{
                            width: column.width + 'px',
                            minWidth: column.minWidth + 'px'
                          }}>&nbsp;</div>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
        {pagesLength > 1 && (
          <div className='-pagination'>
            <div className='-left'>
              <PreviousComponent
                onClick={canPrevious && ((e) => this.previousPage(e))}
                disabled={!canPrevious}>
                {this.props.previousText}
              </PreviousComponent>
            </div>
            <div className='-center'>
              Page {this.state.page + 1} of {pagesLength}
            </div>
            <div className='-right'>
              <NextComponent
                onClick={canNext && ((e) => this.nextPage(e))}
                disabled={!canNext}>
                {this.props.nextText}
              </NextComponent>
            </div>
          </div>
        )}
        <div className={classnames('-loading', {'-active': this.state.loading})}>
          <div className='-loading-inner'>
            {this.props.loadingComponent}
          </div>
        </div>
      </div>
    )
  },
  sortColumn (column, additive) {
    const existingSorting = this.state.sorting || []
    const sorting = _.clone(this.state.sorting || [])
    const existingIndex = sorting.findIndex(d => d.id === column.id)
    if (existingIndex > -1) {
      const existing = sorting[existingIndex]
      if (existing.asc) {
        existing.asc = false
        if (!additive) {
          _.remove(sorting, d => d)
          sorting.push(existing)
        }
      } else {
        if (additive) {
          sorting.splice(existingIndex, 1)
        } else {
          existing.asc = true
        }
      }
    } else {
      if (additive) {
        sorting.push({
          id: column.id,
          asc: true
        })
      } else {
        _.remove(sorting, d => d)
        sorting.push({
          id: column.id,
          asc: true
        })
      }
    }
    const page = (existingIndex === 0 || (!existingSorting.length && sorting.length)) ? 0 : this.state.page
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
