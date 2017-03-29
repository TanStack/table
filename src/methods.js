import _ from './utils'

export default {
  getDataModel (newState) {
    const {
      columns,
      pivotBy = [],
      data,
      pivotIDKey,
      pivotValKey,
      subRowsKey,
      expanderColumnWidth,
      SubComponent,
      page,
      pages,
      pageSize
    } = newState

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
          })
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

    const newPages = _.getFirstDefined(pages, Math.ceil(resolvedData.length / pageSize))
    const newPage = page > newPages ? newPage - 1 : page

    return {
      ...newState,
      resolvedData,
      pivotColumn,
      allVisibleColumns,
      headerGroups,
      allDecoratedColumns,
      hasHeaderGroups,
      page: Math.max(newPage, 0)
    }
  },
  getSortedData (resolvedState) {
    const {
      manual,
      sorting,
      filtering,
      showFilters,
      defaultFilterMethod,
      resolvedData,
      allVisibleColumns
    } = resolvedState

    // Resolve the data from either manual data or sorted data
    return {
      sortedData: manual ? resolvedData : this.sortData(this.filterData(resolvedData, showFilters, filtering, defaultFilterMethod, allVisibleColumns), sorting)
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
  filterData (data, showFilters, filtering, defaultFilterMethod, allVisibleColumns) {
    let filteredData = data

    if (showFilters && filtering.length) {
      filteredData = filtering.reduce(
        (filteredSoFar, nextFilter) => {
          return filteredSoFar.filter(
            (row) => {
              let column

              if (nextFilter.pivotId) {
                const parentColumn = allVisibleColumns.find(x => x.id === nextFilter.id)
                column = parentColumn.pivotColumns.find(x => x.id === nextFilter.pivotId)
              } else {
                column = allVisibleColumns.find(x => x.id === nextFilter.id)
              }

              const filterMethod = column.filterMethod || defaultFilterMethod

              return filterMethod(nextFilter, row, column)
            })
        }
        , filteredData
      )

      // Apply the filter to the subrows if we are pivoting, and then
      // filter any rows without subcolumns because it would be strange to show
      filteredData = filteredData.map(row => {
        if (!row[this.props.subRowsKey]) {
          return row
        }
        return {
          ...row,
          [this.props.subRowsKey]: this.filterData(row[this.props.subRowsKey], showFilters, filtering, defaultFilterMethod, allVisibleColumns)
        }
      }).filter(row => {
        if (!row[this.props.subRowsKey]) {
          return true
        }
        return row[this.props.subRowsKey].length > 0
      })
    }

    return filteredData
  },
  sortData (data, sorting) {
    if (!sorting.length) {
      return data
    }

    const sorted = _.orderBy(data, sorting.map(sort => {
      return row => {
        if (row[sort.id] === null || row[sort.id] === undefined) {
          return -Infinity
        }
        return typeof row[sort.id] === 'string' ? row[sort.id].toLowerCase() : row[sort.id]
      }
    }), sorting.map(d => !d.desc))

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
    const {onPageChange, collapseOnPageChange} = this.props
    if (onPageChange) {
      return onPageChange(page)
    }
    const newState = {page}
    if (collapseOnPageChange) {
      newState.expandedRows = {}
    }
    this.setStateWithData(
      newState
      , () => {
        this.fireOnChange()
      })
  },
  onPageSizeChange (newPageSize) {
    const {onPageSizeChange} = this.props
    const {pageSize, page} = this.getResolvedState()

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
    const {sorting} = this.getResolvedState()
    const {onSortingChange} = this.props
    if (onSortingChange) {
      return onSortingChange(column, additive)
    }
    let newSorting = _.clone(sorting || []).map(d => {
      d.desc = _.isSortingDesc(d)
      return d
    })
    if (!_.isArray(column)) {
      // Single-Sort
      const existingIndex = newSorting.findIndex(d => d.id === column.id)
      if (existingIndex > -1) {
        const existing = newSorting[existingIndex]
        if (existing.desc) {
          if (additive) {
            newSorting.splice(existingIndex, 1)
          } else {
            existing.desc = false
            newSorting = [existing]
          }
        } else {
          existing.desc = true
          if (!additive) {
            newSorting = [existing]
          }
        }
      } else {
        if (additive) {
          newSorting.push({
            id: column.id,
            desc: false
          })
        } else {
          newSorting = [{
            id: column.id,
            desc: false
          }]
        }
      }
    } else {
      // Multi-Sort
      const existingIndex = newSorting.findIndex(d => d.id === column[0].id)
      // Existing Sorted Column
      if (existingIndex > -1) {
        const existing = newSorting[existingIndex]
        if (existing.desc) {
          if (additive) {
            newSorting.splice(existingIndex, column.length)
          } else {
            column.forEach((d, i) => {
              newSorting[existingIndex + i].desc = false
            })
          }
        } else {
          column.forEach((d, i) => {
            newSorting[existingIndex + i].desc = true
          })
        }
        if (!additive) {
          newSorting = newSorting.slice(existingIndex, column.length)
        }
      } else {
        // New Sort Column
        if (additive) {
          newSorting = newSorting.concat(column.map(d => ({
            id: d.id,
            desc: false
          })))
        } else {
          newSorting = column.map(d => ({
            id: d.id,
            desc: false
          }))
        }
      }
    }
    this.setStateWithData({
      page: ((!sorting.length && newSorting.length) || !additive) ? 0 : this.state.page,
      sorting: newSorting
    }, () => {
      this.fireOnChange()
    })
  },
  filterColumn (column, event, pivotColumn) {
    const {filtering} = this.getResolvedState()
    const {onFilteringChange} = this.props

    if (onFilteringChange) {
      return onFilteringChange(column, event)
    }

    // Remove old filter first if it exists
    const newFiltering = (filtering || []).filter(x => {
      if (x.id !== column.id) {
        return true
      }
      if (x.pivotId) {
        if (pivotColumn) {
          return x.pivotId !== pivotColumn.id
        }
        return true
      }
    })

    if (event.target.value !== '') {
      newFiltering.push({
        id: column.id,
        value: event.target.value,
        pivotId: pivotColumn ? pivotColumn.id : undefined
      })
    }

    this.setStateWithData({
      page: 0,
      filtering: newFiltering
    }, () => {
      this.fireOnChange()
    })
  }
}
