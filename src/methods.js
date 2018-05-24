import React from 'react'
import _ from './utils'

export default Base =>
  class extends Base {
    getResolvedState (props, state) {
      const resolvedState = {
        ..._.compactObject(this.state),
        ..._.compactObject(this.props),
        ..._.compactObject(state),
        ..._.compactObject(props),
      }
      return resolvedState
    }

    getDataModel (newState, dataChanged) {
      const {
        columns,
        pivotBy = [],
        data,
        resolveData,
        pivotIDKey,
        pivotValKey,
        subRowsKey,
        aggregatedKey,
        nestingLevelKey,
        originalKey,
        indexKey,
        groupedByPivotKey,
        SubComponent,
      } = newState

      // Determine Header Groups
      let hasHeaderGroups = false
      columns.forEach(column => {
        if (column.columns) {
          hasHeaderGroups = true
        }
      })

      let columnsWithExpander = [...columns]

      let expanderColumn = columns.find(
        col => col.expander || (col.columns && col.columns.some(col2 => col2.expander))
      )
      // The actual expander might be in the columns field of a group column
      if (expanderColumn && !expanderColumn.expander) {
        expanderColumn = expanderColumn.columns.find(col => col.expander)
      }

      // If we have SubComponent's we need to make sure we have an expander column
      if (SubComponent && !expanderColumn) {
        expanderColumn = { expander: true }
        columnsWithExpander = [expanderColumn, ...columnsWithExpander]
      }

      const makeDecoratedColumn = (column, parentColumn) => {
        let dcol
        if (column.expander) {
          dcol = {
            ...this.props.column,
            ...this.props.expanderDefaults,
            ...column,
          }
        } else {
          dcol = {
            ...this.props.column,
            ...column,
          }
        }

        // Ensure minWidth is not greater than maxWidth if set
        if (dcol.maxWidth < dcol.minWidth) {
          dcol.minWidth = dcol.maxWidth
        }

        if (parentColumn) {
          dcol.parentColumn = parentColumn
        }

        // First check for string accessor
        if (typeof dcol.accessor === 'string') {
          dcol.id = dcol.id || dcol.accessor
          const accessorString = dcol.accessor
          dcol.accessor = row => _.get(row, accessorString)
          return dcol
        }

        // Fall back to functional accessor (but require an ID)
        if (dcol.accessor && !dcol.id) {
          console.warn(dcol)
          throw new Error(
            'A column id is required if using a non-string accessor for column above.'
          )
        }

        // Fall back to an undefined accessor
        if (!dcol.accessor) {
          dcol.accessor = () => undefined
        }

        return dcol
      }

      const allDecoratedColumns = []

      // Decorate the columns
      const decorateAndAddToAll = (column, parentColumn) => {
        const decoratedColumn = makeDecoratedColumn(column, parentColumn)
        allDecoratedColumns.push(decoratedColumn)
        return decoratedColumn
      }

      const decoratedColumns = columnsWithExpander.map(column => {
        if (column.columns) {
          return {
            ...column,
            columns: column.columns.map(d => decorateAndAddToAll(d, column)),
          }
        }
        return decorateAndAddToAll(column)
      })

      // Build the visible columns, headers and flat column list
      let visibleColumns = decoratedColumns.slice()
      let allVisibleColumns = []

      visibleColumns = visibleColumns.map(column => {
        if (column.columns) {
          const visibleSubColumns = column.columns.filter(
            d => (pivotBy.indexOf(d.id) > -1 ? false : _.getFirstDefined(d.show, true))
          )
          return {
            ...column,
            columns: visibleSubColumns,
          }
        }
        return column
      })

      visibleColumns = visibleColumns.filter(
        column =>
          column.columns
            ? column.columns.length
            : pivotBy.indexOf(column.id) > -1
              ? false
              : _.getFirstDefined(column.show, true)
      )

      // Find any custom pivot location
      const pivotIndex = visibleColumns.findIndex(col => col.pivot)

      // Handle Pivot Columns
      if (pivotBy.length) {
        // Retrieve the pivot columns in the correct pivot order
        const pivotColumns = []
        pivotBy.forEach(pivotID => {
          const found = allDecoratedColumns.find(d => d.id === pivotID)
          if (found) {
            pivotColumns.push(found)
          }
        })

        const PivotParentColumn = pivotColumns.reduce(
          (prev, current) => prev && prev === current.parentColumn && current.parentColumn,
          pivotColumns[0].parentColumn
        )

        let PivotGroupHeader = hasHeaderGroups && PivotParentColumn.Header
        PivotGroupHeader = PivotGroupHeader || (() => <strong>Pivoted</strong>)

        let pivotColumnGroup = {
          Header: PivotGroupHeader,
          columns: pivotColumns.map(col => ({
            ...this.props.pivotDefaults,
            ...col,
            pivoted: true,
          })),
        }

        // Place the pivotColumns back into the visibleColumns
        if (pivotIndex >= 0) {
          pivotColumnGroup = {
            ...visibleColumns[pivotIndex],
            ...pivotColumnGroup,
          }
          visibleColumns.splice(pivotIndex, 1, pivotColumnGroup)
        } else {
          visibleColumns.unshift(pivotColumnGroup)
        }
      }

      // Build Header Groups
      const headerGroups = []
      let currentSpan = []

      // A convenience function to add a header and reset the currentSpan
      const addHeader = (columns, column) => {
        headerGroups.push({
          ...this.props.column,
          ...column,
          columns,
        })
        currentSpan = []
      }

      // Build flast list of allVisibleColumns and HeaderGroups
      visibleColumns.forEach(column => {
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
      const accessRow = (d, i, level = 0) => {
        const row = {
          [originalKey]: d,
          [indexKey]: i,
          [subRowsKey]: d[subRowsKey],
          [nestingLevelKey]: level,
        }
        allDecoratedColumns.forEach(column => {
          if (column.expander) return
          row[column.id] = column.accessor(d)
        })
        if (row[subRowsKey]) {
          row[subRowsKey] = row[subRowsKey].map((d, i) => accessRow(d, i, level + 1))
        }
        return row
      }

      // // If the data hasn't changed, just use the cached data
      let resolvedData = this.resolvedData
      // If the data has changed, run the data resolver and cache the result
      if (!this.resolvedData || dataChanged) {
        resolvedData = resolveData(data)
        this.resolvedData = resolvedData
      }
      // Use the resolved data
      resolvedData = resolvedData.map((d, i) => accessRow(d, i))

      // TODO: Make it possible to fabricate nested rows without pivoting
      const aggregatingColumns = allVisibleColumns.filter(d => !d.expander && d.aggregate)

      // If pivoting, recursively group the data
      const aggregate = rows => {
        const aggregationValues = {}
        aggregatingColumns.forEach(column => {
          const values = rows.map(d => d[column.id])
          aggregationValues[column.id] = column.aggregate(values, rows)
        })
        return aggregationValues
      }
      if (pivotBy.length) {
        const groupRecursively = (rows, keys, i = 0) => {
          // This is the last level, just return the rows
          if (i === keys.length) {
            return rows
          }
          // Group the rows together for this level
          let groupedRows = Object.entries(_.groupBy(rows, keys[i])).map(([key, value]) => ({
            [pivotIDKey]: keys[i],
            [pivotValKey]: key,
            [keys[i]]: key,
            [subRowsKey]: value,
            [nestingLevelKey]: i,
            [groupedByPivotKey]: true,
          }))
          // Recurse into the subRows
          groupedRows = groupedRows.map(rowGroup => {
            const subRows = groupRecursively(rowGroup[subRowsKey], keys, i + 1)
            return {
              ...rowGroup,
              [subRowsKey]: subRows,
              [aggregatedKey]: true,
              ...aggregate(subRows),
            }
          })
          return groupedRows
        }
        resolvedData = groupRecursively(resolvedData, pivotBy)
      }

      return {
        ...newState,
        resolvedData,
        allVisibleColumns,
        headerGroups,
        allDecoratedColumns,
        hasHeaderGroups,
      }
    }

    getSortedData (resolvedState) {
      const {
        manual,
        sorted,
        filtered,
        defaultFilterMethod,
        resolvedData,
        allVisibleColumns,
        allDecoratedColumns,
      } = resolvedState

      const sortMethodsByColumnID = {}

      allDecoratedColumns.filter(col => col.sortMethod).forEach(col => {
        sortMethodsByColumnID[col.id] = col.sortMethod
      })

      // Resolve the data from either manual data or sorted data
      return {
        sortedData: manual
          ? resolvedData
          : this.sortData(
            this.filterData(resolvedData, filtered, defaultFilterMethod, allVisibleColumns),
            sorted,
            sortMethodsByColumnID
          ),
      }
    }

    fireFetchData () {
      this.props.onFetchData(this.getResolvedState(), this)
    }

    getPropOrState (key) {
      return _.getFirstDefined(this.props[key], this.state[key])
    }

    getStateOrProp (key) {
      return _.getFirstDefined(this.state[key], this.props[key])
    }

    filterData (data, filtered, defaultFilterMethod, allVisibleColumns) {
      let filteredData = data

      if (filtered.length) {
        filteredData = filtered.reduce((filteredSoFar, nextFilter) => {
          const column = allVisibleColumns.find(x => x.id === nextFilter.id)

          // Don't filter hidden columns or columns that have had their filters disabled
          if (!column || column.filterable === false) {
            return filteredSoFar
          }

          const filterMethod = column.filterMethod || defaultFilterMethod

          // If 'filterAll' is set to true, pass the entire dataset to the filter method
          if (column.filterAll) {
            return filterMethod(nextFilter, filteredSoFar, column)
          }
          return filteredSoFar.filter(row => filterMethod(nextFilter, row, column))
        }, filteredData)

        // Apply the filter to the subrows if we are pivoting, and then
        // filter any rows without subcolumns because it would be strange to show
        filteredData = filteredData
          .map(row => {
            if (!row[this.props.subRowsKey]) {
              return row
            }
            return {
              ...row,
              [this.props.subRowsKey]: this.filterData(
                row[this.props.subRowsKey],
                filtered,
                defaultFilterMethod,
                allVisibleColumns
              ),
            }
          })
          .filter(row => {
            if (!row[this.props.subRowsKey]) {
              return true
            }
            return row[this.props.subRowsKey].length > 0
          })
      }

      return filteredData
    }

    sortData (data, sorted, sortMethodsByColumnID = {}) {
      if (!sorted.length) {
        return data
      }

      const sortedData = (this.props.orderByMethod || _.orderBy)(
        data,
        sorted.map(sort => {
          // Support custom sorting methods for each column
          if (sortMethodsByColumnID[sort.id]) {
            return (a, b) => sortMethodsByColumnID[sort.id](a[sort.id], b[sort.id], sort.desc)
          }
          return (a, b) => this.props.defaultSortMethod(a[sort.id], b[sort.id], sort.desc)
        }),
        sorted.map(d => !d.desc),
        this.props.indexKey
      )

      sortedData.forEach(row => {
        if (!row[this.props.subRowsKey]) {
          return
        }
        row[this.props.subRowsKey] = this.sortData(
          row[this.props.subRowsKey],
          sorted,
          sortMethodsByColumnID
        )
      })

      return sortedData
    }

    getMinRows () {
      return _.getFirstDefined(this.props.minRows, this.getStateOrProp('pageSize'))
    }

    // User actions
    onPageChange (page) {
      const { onPageChange, collapseOnPageChange } = this.props

      const newState = { page }
      if (collapseOnPageChange) {
        newState.expanded = {}
      }
      this.setStateWithData(newState, () => onPageChange && onPageChange(page))
    }

    onPageSizeChange (newPageSize) {
      const { onPageSizeChange } = this.props
      const { pageSize, page } = this.getResolvedState()

      // Normalize the page to display
      const currentRow = pageSize * page
      const newPage = Math.floor(currentRow / newPageSize)

      this.setStateWithData(
        {
          pageSize: newPageSize,
          page: newPage,
        },
        () => onPageSizeChange && onPageSizeChange(newPageSize, newPage)
      )
    }

    sortColumn (column, additive) {
      const { sorted, skipNextSort, defaultSortDesc } = this.getResolvedState()

      const firstSortDirection = Object.prototype.hasOwnProperty.call(column, 'defaultSortDesc')
        ? column.defaultSortDesc
        : defaultSortDesc
      const secondSortDirection = !firstSortDirection

      // we can't stop event propagation from the column resize move handlers
      // attached to the document because of react's synthetic events
      // so we have to prevent the sort function from actually sorting
      // if we click on the column resize element within a header.
      if (skipNextSort) {
        this.setStateWithData({
          skipNextSort: false,
        })
        return
      }

      const { onSortedChange } = this.props

      let newSorted = _.clone(sorted || []).map(d => {
        d.desc = _.isSortingDesc(d)
        return d
      })
      if (!_.isArray(column)) {
        // Single-Sort
        const existingIndex = newSorted.findIndex(d => d.id === column.id)
        if (existingIndex > -1) {
          const existing = newSorted[existingIndex]
          if (existing.desc === secondSortDirection) {
            if (additive) {
              newSorted.splice(existingIndex, 1)
            } else {
              existing.desc = firstSortDirection
              newSorted = [existing]
            }
          } else {
            existing.desc = secondSortDirection
            if (!additive) {
              newSorted = [existing]
            }
          }
        } else if (additive) {
          newSorted.push({
            id: column.id,
            desc: firstSortDirection,
          })
        } else {
          newSorted = [
            {
              id: column.id,
              desc: firstSortDirection,
            },
          ]
        }
      } else {
        // Multi-Sort
        const existingIndex = newSorted.findIndex(d => d.id === column[0].id)
        // Existing Sorted Column
        if (existingIndex > -1) {
          const existing = newSorted[existingIndex]
          if (existing.desc === secondSortDirection) {
            if (additive) {
              newSorted.splice(existingIndex, column.length)
            } else {
              column.forEach((d, i) => {
                newSorted[existingIndex + i].desc = firstSortDirection
              })
            }
          } else {
            column.forEach((d, i) => {
              newSorted[existingIndex + i].desc = secondSortDirection
            })
          }
          if (!additive) {
            newSorted = newSorted.slice(existingIndex, column.length)
          }
          // New Sort Column
        } else if (additive) {
          newSorted = newSorted.concat(
            column.map(d => ({
              id: d.id,
              desc: firstSortDirection,
            }))
          )
        } else {
          newSorted = column.map(d => ({
            id: d.id,
            desc: firstSortDirection,
          }))
        }
      }

      this.setStateWithData(
        {
          page: (!sorted.length && newSorted.length) || !additive ? 0 : this.state.page,
          sorted: newSorted,
        },
        () => onSortedChange && onSortedChange(newSorted, column, additive)
      )
    }

    filterColumn (column, value) {
      const { filtered } = this.getResolvedState()
      const { onFilteredChange } = this.props

      // Remove old filter first if it exists
      const newFiltering = (filtered || []).filter(x => x.id !== column.id)

      if (value !== '') {
        newFiltering.push({
          id: column.id,
          value,
        })
      }

      this.setStateWithData(
        {
          filtered: newFiltering,
        },
        () => onFilteredChange && onFilteredChange(newFiltering, column, value)
      )
    }

    resizeColumnStart (event, column, isTouch) {
      event.stopPropagation()
      const parentWidth = event.target.parentElement.getBoundingClientRect().width

      let pageX
      if (isTouch) {
        pageX = event.changedTouches[0].pageX
      } else {
        pageX = event.pageX
      }

      this.trapEvents = true
      this.setStateWithData(
        {
          currentlyResizing: {
            id: column.id,
            startX: pageX,
            parentWidth,
          },
        },
        () => {
          if (isTouch) {
            document.addEventListener('touchmove', this.resizeColumnMoving)
            document.addEventListener('touchcancel', this.resizeColumnEnd)
            document.addEventListener('touchend', this.resizeColumnEnd)
          } else {
            document.addEventListener('mousemove', this.resizeColumnMoving)
            document.addEventListener('mouseup', this.resizeColumnEnd)
            document.addEventListener('mouseleave', this.resizeColumnEnd)
          }
        }
      )
    }

    resizeColumnMoving (event) {
      event.stopPropagation()
      const { onResizedChange } = this.props
      const { resized, currentlyResizing } = this.getResolvedState()

      // Delete old value
      const newResized = resized.filter(x => x.id !== currentlyResizing.id)

      let pageX

      if (event.type === 'touchmove') {
        pageX = event.changedTouches[0].pageX
      } else if (event.type === 'mousemove') {
        pageX = event.pageX
      }

      // Set the min size to 10 to account for margin and border or else the
      // group headers don't line up correctly
      const newWidth = Math.max(
        currentlyResizing.parentWidth + pageX - currentlyResizing.startX,
        11
      )

      newResized.push({
        id: currentlyResizing.id,
        value: newWidth,
      })

      this.setStateWithData(
        {
          resized: newResized,
        },
        () => onResizedChange && onResizedChange(newResized, event)
      )
    }

    resizeColumnEnd (event) {
      event.stopPropagation()
      const isTouch = event.type === 'touchend' || event.type === 'touchcancel'

      if (isTouch) {
        document.removeEventListener('touchmove', this.resizeColumnMoving)
        document.removeEventListener('touchcancel', this.resizeColumnEnd)
        document.removeEventListener('touchend', this.resizeColumnEnd)
      }

      // If its a touch event clear the mouse one's as well because sometimes
      // the mouseDown event gets called as well, but the mouseUp event doesn't
      document.removeEventListener('mousemove', this.resizeColumnMoving)
      document.removeEventListener('mouseup', this.resizeColumnEnd)
      document.removeEventListener('mouseleave', this.resizeColumnEnd)

      // The touch events don't propagate up to the sorting's onMouseDown event so
      // no need to prevent it from happening or else the first click after a touch
      // event resize will not sort the column.
      if (!isTouch) {
        this.setStateWithData({
          skipNextSort: true,
          currentlyResizing: false,
        })
      }
    }
  }
