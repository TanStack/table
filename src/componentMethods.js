import _ from './utils'

export default {
  getDataModel (nextProps, nextState) {
    const {
      columns,
      pivotBy = [],
      data,
      pivotIDKey,
      pivotValKey,
      subRowsKey,
      expanderColumnWidth,
      SubComponent
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
    const addHeader = (columns, column = columns[0]) => {
      headerGroups.push({
        ...this.props.column,
        ...column,
        columns: columns
      })
      currentSpan = []
    }

    const noSubExpanderColumns = columns.map(col => {
      return {
        ...col,
        columns: col.columns ? col.columns.filter(d => !d.expander) : undefined
      }
    })

    let expanderColumnIndex = columns.findIndex(col => col.expander)
    const needsExpander = (SubComponent || pivotBy.length) && expanderColumnIndex === -1
    const columnsWithExpander = needsExpander ? [{expander: true}, ...noSubExpanderColumns] : noSubExpanderColumns
    if (needsExpander) {
      expanderColumnIndex = 0
    }

    const makeDecoratedColumn = (column) => {
      const dcol = {
        ...this.props.column,
        ...column
      }

      if (dcol.expander) {
        dcol.width = expanderColumnWidth
        return dcol
      }

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

      // Ensure minWidth is not greater than maxWidth if set
      if (dcol.maxWidth < dcol.minWidth) {
        dcol.minWidth = dcol.maxWidth
      }

      return dcol
    }

    // Decorate the columns
    const decorateAndAddToAll = (col) => {
      const decoratedColumn = makeDecoratedColumn(col)
      allDecoratedColumns.push(decoratedColumn)
      return decoratedColumn
    }
    let allDecoratedColumns = []
    const decoratedColumns = columnsWithExpander.map((column, i) => {
      if (column.columns) {
        return {
          ...column,
          columns: column.columns.map(decorateAndAddToAll)
        }
      } else {
        return decorateAndAddToAll(column)
      }
    })

    // Build the visible columns, headers and flat column list
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

    // Move the pivot columns into a single column if needed
    if (pivotBy.length) {
      const pivotColumns = []
      for (var i = 0; i < allDecoratedColumns.length; i++) {
        if (pivotBy.indexOf(allDecoratedColumns[i].id) > -1) {
          pivotColumns.push(allDecoratedColumns[i])
        }
      }
      const pivotColumn = {
        ...pivotColumns[0],
        pivotColumns,
        expander: true
      }
      visibleColumns[expanderColumnIndex] = pivotColumn
    }

    // Build flast list of allVisibleColumns and HeaderGroups
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

    // Access the data
    let resolvedData = data.map((d, i) => {
      const row = {
        __original: d,
        __index: i
      }
      allDecoratedColumns.forEach(column => {
        if (column.expander) return
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
      pivotColumn,
      allVisibleColumns,
      headerGroups,
      allDecoratedColumns,
      hasHeaderGroups
    }
  },
  getSortedData (state) {
    const {
      manual,
      sorting,
      allDecoratedColumns,
      resolvedData
    } = state

    const resolvedSorting = sorting.length ? sorting : this.getInitSorting(allDecoratedColumns)

    // Resolve the data from either manual data or sorted data
    return {
      resolvedSorting,
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

    return initSorting

    // return initSorting.length ? initSorting : [{
    //   id: columns.find(d => d.id).id,
    //   asc: true
    // }]
  },
  sortData (data, sorting) {
    const sorted = _.orderBy(data, sorting.map(sort => {
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
}
