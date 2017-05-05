import React, { Component } from 'react'
import classnames from 'classnames'
//
import _ from './utils'
import Lifecycle from './lifecycle'
import Methods from './methods'
import defaultProps from './defaultProps'

export const ReactTableDefaults = defaultProps

export default class ReactTable extends Methods(Lifecycle(Component)) {
  static defaultProps = defaultProps

  constructor (props) {
    super()

    this.getResolvedState = this.getResolvedState.bind(this)
    this.getDataModel = this.getDataModel.bind(this)
    this.getSortedData = this.getSortedData.bind(this)
    this.fireOnChange = this.fireOnChange.bind(this)
    this.getPropOrState = this.getPropOrState.bind(this)
    this.getStateOrProp = this.getStateOrProp.bind(this)
    this.filterData = this.filterData.bind(this)
    this.sortData = this.sortData.bind(this)
    this.getMinRows = this.getMinRows.bind(this)
    this.onPageChange = this.onPageChange.bind(this)
    this.onPageSizeChange = this.onPageSizeChange.bind(this)
    this.sortColumn = this.sortColumn.bind(this)
    this.filterColumn = this.filterColumn.bind(this)
    this.resizeColumnStart = this.resizeColumnStart.bind(this)
    this.resizeColumnEnd = this.resizeColumnEnd.bind(this)
    this.resizeColumnMoving = this.resizeColumnMoving.bind(this)

    this.state = {
      page: 0,
      pageSize: props.defaultPageSize || 10,
      sorting: props.defaultSorting,
      expandedRows: {},
      filtering: props.defaultFiltering,
      resizing: props.defaultResizing,
      currentlyResizing: false,
      skipNextSort: false
    }
  }

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
      getTheadFilterProps,
      getTheadFilterTrProps,
      getTheadFilterThProps,
      getTbodyProps,
      getTrGroupProps,
      getTrProps,
      getTdProps,
      getTfootProps,
      getTfootTrProps,
      getTfootTdProps,
      getPaginationProps,
      getLoadingProps,
      getNoDataProps,
      getResizerProps,
      showPagination,
      manual,
      loadingText,
      noDataText,
      showFilters,
      resizable,
      // State
      loading,
      pageSize,
      page,
      sorting,
      filtering,
      resizing,
      pages,
      // Pivoting State
      pivotValKey,
      pivotBy,
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
      TfootComponent,
      PaginationComponent,
      LoadingComponent,
      SubComponent,
      NoDataComponent,
      ResizerComponent,
      // Data model
      resolvedData,
      allVisibleColumns,
      headerGroups,
      hasHeaderGroups,
      // Sorted Data
      sortedData,
      currentlyResizing
    } = resolvedState

    // Pagination
    const startRow = pageSize * page
    const endRow = startRow + pageSize
    let pageRows = manual ? resolvedData : sortedData.slice(startRow, endRow)
    const minRows = this.getMinRows()
    const padRows = _.range(Math.max(minRows - pageRows.length, 0))

    const hasColumnFooter = allVisibleColumns.some(d => d.footer || (d.pivotColumns && d.pivotColumns.some(e => e.footer)))

    const recurseRowsViewIndex = (rows, path = [], index = -1) => {
      return [
        rows.map((row, i) => {
          index++
          const rowWithViewIndex = {
            ...row,
            _viewIndex: index
          }
          const newPath = path.concat([i])
          if (rowWithViewIndex[subRowsKey] && _.get(expandedRows, newPath)) {
            [rowWithViewIndex[subRowsKey], index] = recurseRowsViewIndex(rowWithViewIndex[subRowsKey], newPath, index)
          }
          return rowWithViewIndex
        }),
        index
      ]
    }

    [pageRows] = recurseRowsViewIndex(pageRows)

    const canPrevious = page > 0
    const canNext = page + 1 < pages

    const rowMinWidth = _.sum(allVisibleColumns.map(d => {
      const resized = resizing.find(x => x.id === d.id) || {}
      return _.getFirstDefined(resized.value, d.width, d.minWidth)
    }))

    let rowIndex = -1

    const finalState = {
      ...resolvedState,
      startRow,
      endRow,
      pageRows,
      minRows,
      padRows,
      hasColumnFooter,
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
      const resizedValue = col => (resizing.find(x => x.id === col.id) || {}).value

      const flex = _.sum(column.columns.map(d => {
        const widthFunction = col => col.width || resizedValue(col) ? 0 : col.minWidth
        return d.pivotColumns ? _.sum(d.pivotColumns.map(widthFunction)) : widthFunction(d)
      }))

      const width = _.sum(column.columns.map(d => {
        const widthFunction = col => _.getFirstDefined(resizedValue(col), col.width, col.minWidth)
        return d.pivotColumns ? _.sum(d.pivotColumns.map(widthFunction)) : widthFunction(d)
      }))

      const maxWidth = _.sum(column.columns.map(d => {
        const widthFunction = col => _.getFirstDefined(resizedValue(col), col.width, col.maxWidth)
        return d.pivotColumns ? _.sum(d.pivotColumns.map(widthFunction)) : widthFunction(d)
      }))

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

      return (
        <ThComponent
          key={i + '-' + column.id}
          className={classnames(
            classes
          )}
          style={{
            ...styles,
            ...flexStyles
          }}
          {...rest}
        >
          {_.normalizeComponent(column.header, {
            data: sortedData,
            column: column
          })}
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
      const resized = resizing.find(x => x.id === column.id) || {}
      const sort = sorting.find(d => d.id === column.id)
      const show = typeof column.show === 'function' ? column.show() : column.show
      const width = _.getFirstDefined(resized.value, column.width, column.minWidth)
      const maxWidth = _.getFirstDefined(resized.value, column.width, column.maxWidth)
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

      const resizer = resizable ? (
        <ResizerComponent
          onMouseDown={e => this.resizeColumnStart(column, e, false)}
          onTouchStart={e => this.resizeColumnStart(column, e, true)}

          {...resizerProps}
        />
      ) : null

      if (column.pivotColumns) {
        return column.pivotColumns.map(makeHeader)
      }

      return (
        <ThComponent
          key={i + '-' + column.id}
          className={classnames(
            classes,
            'rt-resizable-header',
            sort ? (sort.desc ? '-sort-desc' : '-sort-asc') : '',
            column.sortable && '-cursor-pointer',
            !show && '-hidden',
            pivotBy && pivotBy.slice(0, -1).includes(column.id) && 'rt-header-pivot'
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
          <div className='rt-resizable-header-content'>
            {_.normalizeComponent(column.header, {
              data: sortedData,
              column: column
            })}
          </div>
          {resizer}
        </ThComponent>
      )
    }

    const makeFilters = () => {
      const theadFilterProps = _.splitProps(getTheadFilterProps(finalState, undefined, undefined, this))
      const theadFilterTrProps = _.splitProps(getTheadFilterTrProps(finalState, undefined, undefined, this))
      return (
        <TheadComponent
          className={classnames('-filters', theadFilterProps.className)}
          style={{
            ...theadFilterProps.style,
            minWidth: `${rowMinWidth}px`
          }}
          {...theadFilterProps.rest}
        >
          <TrComponent
            className={theadFilterTrProps.className}
            style={theadFilterTrProps.style}
            {...theadFilterTrProps.rest}
          >
            {allVisibleColumns.map(makeFilter)}
          </TrComponent>
        </TheadComponent>
      )
    }

    const makeFilter = (column, i) => {
      const resized = resizing.find(x => x.id === column.id) || {}
      const width = _.getFirstDefined(resized.value, column.width, column.minWidth)
      const maxWidth = _.getFirstDefined(resized.value, column.width, column.maxWidth)
      const theadFilterThProps = _.splitProps(getTheadFilterThProps(finalState, undefined, column, this))
      const columnHeaderProps = _.splitProps(column.getHeaderProps(finalState, undefined, column, this))

      const classes = [
        column.headerClassName,
        theadFilterThProps.className,
        columnHeaderProps.className
      ]

      const styles = {
        ...column.headerStyle,
        ...theadFilterThProps.style,
        ...columnHeaderProps.style
      }

      const rest = {
        ...theadFilterThProps.rest,
        ...columnHeaderProps.rest
      }

      if (!column.filterRender && column.pivotColumns) {
        return column.pivotColumns.map(makeFilter)
      }

      const filter = filtering.find(filter => filter.id === column.id)

      return (
        <ThComponent
          key={i + '-' + column.id}
          className={classnames(
            classes
          )}
          style={{
            ...styles,
            flex: `${width} 0 auto`,
            width: `${width}px`,
            maxWidth: `${maxWidth}px`
          }}
          {...rest}
        >
          {!column.hideFilter ? (
            _.normalizeComponent(column.filterRender,
              {
                column,
                filter,
                onFilterChange: (value) => (this.filterColumn(column, value))
              },
              defaultProps.column.filterRender
            )
          ) : null}
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
              const resized = resizing.find(x => x.id === column.id) || {}
              const show = typeof column.show === 'function' ? column.show() : column.show
              const width = _.getFirstDefined(resized.value, column.width, column.minWidth)
              const maxWidth = _.getFirstDefined(resized.value, column.width, column.maxWidth)
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

              const extraProps = {}

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

                extraProps['onClick'] = onTdClick

                if (column.pivotColumns) {
                  const pivotFlex = _.sum(column.pivotColumns.map(d => {
                    const resized = resizing.find(x => x.id === d.id) || {}
                    return d.width || resized.value ? 0 : d.minWidth
                  }))
                  const pivotWidth = _.sum(column.pivotColumns.map(d => {
                    const resized = resizing.find(x => x.id === d.id) || {}
                    return _.getFirstDefined(resized.value, d.width, d.minWidth)
                  }))
                  const pivotMaxWidth = _.sum(column.pivotColumns.map(d => {
                    const resized = resizing.find(x => x.id === d.id) || {}
                    return _.getFirstDefined(resized.value, d.width, d.maxWidth)
                  }))

                  // Return the pivot expander cell
                  return (
                    <TdComponent
                      key={i2}
                      className={classnames(
                        'rt-pivot',
                        classes
                      )}
                      style={{
                        ...styles,
                        paddingLeft: rowInfo.nestingPath.length === 1 ? undefined : `${30 * (rowInfo.nestingPath.length - 1)}px`,
                        flex: `${pivotFlex} 0 auto`,
                        width: `${pivotWidth}px`,
                        maxWidth: `${pivotMaxWidth}px`
                      }}
                      {...tdProps.rest}
                      onClick={onTdClick}
                    >
                      {rowInfo.subRows ? (
                        _.normalizeComponent(column.render, {
                          ...rowInfo,
                          value: row[pivotValKey],
                          isExpanded
                        }, rowInfo.rowValues[column.id])
                      ) : SubComponent ? (
                        _.normalizeComponent(column.render, {
                          ...rowInfo,
                          value: rowInfo.rowValues[column.id],
                          isExpanded
                        }, rowInfo.rowValues[column.id])
                      ) : null}
                    </TdComponent>
                  )
                }
              }

              // Return regular cell
              return (
                <TdComponent
                  key={i2 + '-' + column.id}
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
                  {...extraProps}
                >
                  {_.normalizeComponent(column.render, {
                    ...rowInfo,
                    value: rowInfo.rowValues[column.id],
                    isExpanded
                  }, rowInfo.rowValues[column.id])}
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
      return (
        <TrGroupComponent
          key={i}
          {...trGroupProps}
        >
          <TrComponent
            className={classnames(
              '-padRow',
              (pageRows.length + i) % 2 ? '-even' : '-odd',
              trProps.className,
            )}
            style={trProps.style || {}}
          >
            {allVisibleColumns.map(makePadColumn)}
          </TrComponent>
        </TrGroupComponent>
      )
    }

    const makePadColumn = (column, i) => {
      const resized = resizing.find(x => x.id === column.id) || {}
      const show = typeof column.show === 'function' ? column.show() : column.show
      let width = _.getFirstDefined(resized.value, column.width, column.minWidth)
      let flex = width
      let maxWidth = _.getFirstDefined(resized.value, column.width, column.maxWidth)
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

      if (column.pivotColumns) {
        flex = _.sum(column.pivotColumns.map(d => {
          const resized = resizing.find(x => x.id === d.id) || {}
          return d.width || resized.value ? 0 : d.minWidth
        }))
        width = _.sum(column.pivotColumns.map(d => {
          const resized = resizing.find(x => x.id === d.id) || {}
          return _.getFirstDefined(resized.value, d.width, d.minWidth)
        }))
        maxWidth = _.sum(column.pivotColumns.map(d => {
          const resized = resizing.find(x => x.id === d.id) || {}
          return _.getFirstDefined(resized.value, d.width, d.maxWidth)
        }))
      }

      return (
        <TdComponent
          key={i + '-' + column.id}
          className={classnames(
            classes,
            !show && 'hidden'
          )}
          style={{
            ...styles,
            flex: `${flex} 0 auto`,
            width: `${width}px`,
            maxWidth: `${maxWidth}px`
          }}
          {...tdProps.rest}
        >
          &nbsp;
        </TdComponent>
      )
    }

    const makeColumnFooters = () => {
      const tFootProps = getTfootProps(finalState, undefined, undefined, this)
      const tFootTrProps = _.splitProps(getTfootTrProps(finalState, undefined, undefined, this))
      return (
        <TfootComponent
          className={tFootProps.className}
          style={{
            ...tFootProps.style,
            minWidth: `${rowMinWidth}px`
          }}
          {...tFootProps.rest}
        >
          <TrComponent
            className={classnames(
              tFootTrProps.className
            )}
            style={tFootTrProps.style}
            {...tFootTrProps.rest}
          >
            {allVisibleColumns.map(makeColumnFooter)}
          </TrComponent>
        </TfootComponent>
      )
    }

    const makeColumnFooter = (column, i) => {
      const resized = resizing.find(x => x.id === column.id) || {}
      const show = typeof column.show === 'function' ? column.show() : column.show
      const width = _.getFirstDefined(resized.value, column.width, column.minWidth)
      const maxWidth = _.getFirstDefined(resized.value, column.width, column.maxWidth)
      const tFootTdProps = _.splitProps(getTfootTdProps(finalState, undefined, undefined, this))
      const columnProps = _.splitProps(column.getProps(finalState, undefined, column, this))
      const columnFooterProps = _.splitProps(column.getFooterProps(finalState, undefined, column, this))

      const classes = [
        tFootTdProps.className,
        column.className,
        columnProps.className,
        columnFooterProps.className
      ]

      const styles = {
        ...tFootTdProps.style,
        ...column.style,
        ...columnProps.style,
        ...columnFooterProps.style
      }

      if (!column.footer && column.pivotColumns) {
        return column.pivotColumns.map(makeColumnFooter)
      }

      return (
        <TdComponent
          key={i + '-' + column.id}
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
          {...columnProps.rest}
          {...tFootTdProps.rest}
          {...columnFooterProps.rest}
        >
          {_.normalizeComponent(column.footer, {
            data: sortedData,
            column: column
          })}
        </TdComponent>
      )
    }

    const rootProps = _.splitProps(getProps(finalState, undefined, undefined, this))
    const tableProps = _.splitProps(getTableProps(finalState, undefined, undefined, this))
    const tBodyProps = _.splitProps(getTbodyProps(finalState, undefined, undefined, this))
    const paginationProps = _.splitProps(getPaginationProps(finalState, undefined, undefined, this))
    const loadingProps = getLoadingProps(finalState, undefined, undefined, this)
    const noDataProps = getNoDataProps(finalState, undefined, undefined, this)
    const resizerProps = getResizerProps(finalState, undefined, undefined, this)

    const makeTable = () => (
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
          className={classnames(
            tableProps.className,
            currentlyResizing ? 'rt-resizing' : ''
          )}
          style={tableProps.style}
          {...tableProps.rest}
        >
          {hasHeaderGroups ? makeHeaderGroups() : null}
          {makeHeaders()}
          {showFilters ? makeFilters() : null}
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
          {hasColumnFooter ? makeColumnFooters() : null}
        </TableComponent>
        {showPagination ? (
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
        ) : null}
        {!pageRows.length && (
          <NoDataComponent
            {...noDataProps}
          >
            {_.normalizeComponent(noDataText)}
          </NoDataComponent>
        )}
        <LoadingComponent
          loading={loading}
          loadingText={loadingText}
          {...loadingProps}
        />
      </div>
    )

    // childProps are optionally passed to a function-as-a-child
    return children ? children(finalState, makeTable, this) : makeTable()
  }
}
