import React, { Component } from 'react'
import classnames from 'classnames'
//
import _ from './utils'
import Lifecycle from './lifecycle'
import Methods from './methods'
import defaultProps from './defaultProps'
import propTypes from './propTypes'

export const ReactTableDefaults = defaultProps

export default class ReactTable extends Methods(Lifecycle(Component)) {
  static propTypes = propTypes
  static defaultProps = defaultProps

  constructor (props) {
    super()

    this.getResolvedState = this.getResolvedState.bind(this)
    this.getDataModel = this.getDataModel.bind(this)
    this.getSortedData = this.getSortedData.bind(this)
    this.fireFetchData = this.fireFetchData.bind(this)
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
      pageSize: props.defaultPageSize,
      sorted: props.defaultSorted,
      expanded: props.defaultExpanded,
      filtered: props.defaultFiltered,
      resized: props.defaultResized,
      currentlyResizing: false,
      skipNextSort: false,
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
      showPaginationTop,
      showPaginationBottom,
      manual,
      loadingText,
      noDataText,
      sortable,
      multiSort,
      resizable,
      filterable,
      // Pivoting State
      pivotIDKey,
      pivotValKey,
      pivotBy,
      subRowsKey,
      aggregatedKey,
      originalKey,
      indexKey,
      groupedByPivotKey,
      // State
      loading,
      pageSize,
      page,
      sorted,
      filtered,
      resized,
      expanded,
      pages,
      onExpandedChange,
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
      ExpanderComponent,
      PivotValueComponent,
      PivotComponent,
      AggregatedComponent,
      FilterComponent,
      PadRowComponent,
      // Data model
      resolvedData,
      allVisibleColumns,
      headerGroups,
      hasHeaderGroups,
      // Sorted Data
      sortedData,
      currentlyResizing,
    } = resolvedState

    // Pagination
    const startRow = pageSize * page
    const endRow = startRow + pageSize
    let pageRows = manual ? resolvedData : sortedData.slice(startRow, endRow)
    const minRows = this.getMinRows()
    const padRows = _.range(Math.max(minRows - pageRows.length, 0))

    const hasColumnFooter = allVisibleColumns.some(d => d.Footer)
    const hasFilters = filterable || allVisibleColumns.some(d => d.filterable)

    const recurseRowsViewIndex = (rows, path = [], index = -1) => ([
      rows.map((row, i) => {
        index += 1
        const rowWithViewIndex = {
          ...row,
          _viewIndex: index,
        }
        const newPath = path.concat([i])
        if (rowWithViewIndex[subRowsKey] && _.get(expanded, newPath)) {
          [rowWithViewIndex[subRowsKey], index] = recurseRowsViewIndex(
            rowWithViewIndex[subRowsKey],
            newPath,
            index,
          )
        }
        return rowWithViewIndex
      }),
      index,
    ])
    ;[pageRows] = recurseRowsViewIndex(pageRows)

    const canPrevious = page > 0
    const canNext = page + 1 < pages

    const rowMinWidth = _.sum(
      allVisibleColumns.map(d => {
        const resizedColumn = resized.find(x => x.id === d.id) || {}
        return _.getFirstDefined(resizedColumn.value, d.width, d.minWidth)
      }),
    )

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
      rowMinWidth,
    }

    const rootProps = _.splitProps(
      getProps(finalState, undefined, undefined, this),
    )
    const tableProps = _.splitProps(
      getTableProps(finalState, undefined, undefined, this),
    )
    const tBodyProps = _.splitProps(
      getTbodyProps(finalState, undefined, undefined, this),
    )
    const loadingProps = getLoadingProps(finalState, undefined, undefined, this)
    const noDataProps = getNoDataProps(finalState, undefined, undefined, this)

    // Visual Components

    const makeHeaderGroup = (column, i) => {
      const resizedValue = col =>
        (resized.find(x => x.id === col.id) || {}).value
      const flex = _.sum(
        column.columns.map(
          col => (col.width || resizedValue(col) ? 0 : col.minWidth),
        ),
      )
      const width = _.sum(
        column.columns.map(col =>
          _.getFirstDefined(resizedValue(col), col.width, col.minWidth),
        ),
      )
      const maxWidth = _.sum(
        column.columns.map(col =>
          _.getFirstDefined(resizedValue(col), col.width, col.maxWidth),
        ),
      )

      const theadGroupThProps = _.splitProps(
        getTheadGroupThProps(finalState, undefined, column, this),
      )
      const columnHeaderProps = _.splitProps(
        column.getHeaderProps(finalState, undefined, column, this),
      )

      const classes = [
        column.headerClassName,
        theadGroupThProps.className,
        columnHeaderProps.className,
      ]

      const styles = {
        ...column.headerStyle,
        ...theadGroupThProps.style,
        ...columnHeaderProps.style,
      }

      const rest = {
        ...theadGroupThProps.rest,
        ...columnHeaderProps.rest,
      }

      const flexStyles = {
        flex: `${flex} 0 auto`,
        width: _.asPx(width),
        maxWidth: _.asPx(maxWidth),
      }

      return (
        <ThComponent
          key={`${i}-${column.id}`}
          className={classnames(classes)}
          style={{
            ...styles,
            ...flexStyles,
          }}
          {...rest}
        >
          {_.normalizeComponent(column.Header, {
            data: sortedData,
            column,
          })}
        </ThComponent>
      )
    }

    const makeHeaderGroups = () => {
      const theadGroupProps = _.splitProps(
        getTheadGroupProps(finalState, undefined, undefined, this),
      )
      const theadGroupTrProps = _.splitProps(
        getTheadGroupTrProps(finalState, undefined, undefined, this),
      )
      return (
        <TheadComponent
          className={classnames('-headerGroups', theadGroupProps.className)}
          style={{
            ...theadGroupProps.style,
            minWidth: `${rowMinWidth}px`,
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

    const makeHeader = (column, i) => {
      const resizedCol = resized.find(x => x.id === column.id) || {}
      const sort = sorted.find(d => d.id === column.id)
      const show =
        typeof column.show === 'function' ? column.show() : column.show
      const width = _.getFirstDefined(
        resizedCol.value,
        column.width,
        column.minWidth,
      )
      const maxWidth = _.getFirstDefined(
        resizedCol.value,
        column.width,
        column.maxWidth,
      )
      const theadThProps = _.splitProps(
        getTheadThProps(finalState, undefined, column, this),
      )
      const columnHeaderProps = _.splitProps(
        column.getHeaderProps(finalState, undefined, column, this),
      )

      const classes = [
        column.headerClassName,
        theadThProps.className,
        columnHeaderProps.className,
      ]

      const styles = {
        ...column.headerStyle,
        ...theadThProps.style,
        ...columnHeaderProps.style,
      }

      const rest = {
        ...theadThProps.rest,
        ...columnHeaderProps.rest,
      }

      const isResizable = _.getFirstDefined(column.resizable, resizable, false)
      const resizer = isResizable
        ? (<ResizerComponent
          onMouseDown={e => this.resizeColumnStart(e, column, false)}
          onTouchStart={e => this.resizeColumnStart(e, column, true)}
          {...getResizerProps('finalState', undefined, column, this)}
        />)
        : null

      const isSortable = _.getFirstDefined(column.sortable, sortable, false)

      return (
        <ThComponent
          key={`${i}-${column.id}`}
          className={classnames(
            classes,
            isResizable && 'rt-resizable-header',
            sort ? (sort.desc ? '-sort-desc' : '-sort-asc') : '',
            isSortable && '-cursor-pointer',
            !show && '-hidden',
            pivotBy &&
              pivotBy.slice(0, -1).includes(column.id) &&
              'rt-header-pivot',
          )}
          style={{
            ...styles,
            flex: `${width} 0 auto`,
            width: _.asPx(width),
            maxWidth: _.asPx(maxWidth),
          }}
          toggleSort={e => {
            if (isSortable) this.sortColumn(column, multiSort ? e.shiftKey : false)
          }}
          {...rest}
        >
          <div className={classnames(isResizable && 'rt-resizable-header-content')}>
            {_.normalizeComponent(column.Header, {
              data: sortedData,
              column,
            })}
          </div>
          {resizer}
        </ThComponent>
      )
    }

    const makeHeaders = () => {
      const theadProps = _.splitProps(
        getTheadProps(finalState, undefined, undefined, this),
      )
      const theadTrProps = _.splitProps(
        getTheadTrProps(finalState, undefined, undefined, this),
      )
      return (
        <TheadComponent
          className={classnames('-header', theadProps.className)}
          style={{
            ...theadProps.style,
            minWidth: `${rowMinWidth}px`,
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

    const makeFilter = (column, i) => {
      const resizedCol = resized.find(x => x.id === column.id) || {}
      const width = _.getFirstDefined(
        resizedCol.value,
        column.width,
        column.minWidth,
      )
      const maxWidth = _.getFirstDefined(
        resizedCol.value,
        column.width,
        column.maxWidth,
      )
      const theadFilterThProps = _.splitProps(
        getTheadFilterThProps(finalState, undefined, column, this),
      )
      const columnHeaderProps = _.splitProps(
        column.getHeaderProps(finalState, undefined, column, this),
      )

      const classes = [
        column.headerClassName,
        theadFilterThProps.className,
        columnHeaderProps.className,
      ]

      const styles = {
        ...column.headerStyle,
        ...theadFilterThProps.style,
        ...columnHeaderProps.style,
      }

      const rest = {
        ...theadFilterThProps.rest,
        ...columnHeaderProps.rest,
      }

      const filter = filtered.find(filter => filter.id === column.id)

      const ResolvedFilterComponent = column.Filter || FilterComponent

      const isFilterable = _.getFirstDefined(
        column.filterable,
        filterable,
        false,
      )

      return (
        <ThComponent
          key={`${i}-${column.id}`}
          className={classnames(classes)}
          style={{
            ...styles,
            flex: `${width} 0 auto`,
            width: _.asPx(width),
            maxWidth: _.asPx(maxWidth),
          }}
          {...rest}
        >
          {isFilterable
            ? _.normalizeComponent(
              ResolvedFilterComponent,
              {
                column,
                filter,
                onChange: value => this.filterColumn(column, value),
              },
              defaultProps.column.Filter,
            )
            : null}
        </ThComponent>
      )
    }

    const makeFilters = () => {
      const theadFilterProps = _.splitProps(
        getTheadFilterProps(finalState, undefined, undefined, this),
      )
      const theadFilterTrProps = _.splitProps(
        getTheadFilterTrProps(finalState, undefined, undefined, this),
      )
      return (
        <TheadComponent
          className={classnames('-filters', theadFilterProps.className)}
          style={{
            ...theadFilterProps.style,
            minWidth: `${rowMinWidth}px`,
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

    const makePageRow = (row, i, path = []) => {
      const rowInfo = {
        original: row[originalKey],
        row,
        index: row[indexKey],
        viewIndex: rowIndex += 1,
        pageSize,
        page,
        level: path.length,
        nestingPath: path.concat([i]),
        aggregated: row[aggregatedKey],
        groupedByPivot: row[groupedByPivotKey],
        subRows: row[subRowsKey],
      }
      const isExpanded = _.get(expanded, rowInfo.nestingPath)
      const trGroupProps = getTrGroupProps(finalState, rowInfo, undefined, this)
      const trProps = _.splitProps(
        getTrProps(finalState, rowInfo, undefined, this),
      )
      return (
        <TrGroupComponent key={rowInfo.nestingPath.join('_')} {...trGroupProps}>
          <TrComponent
            className={classnames(
              trProps.className,
              row._viewIndex % 2 ? '-even' : '-odd',
            )}
            style={trProps.style}
            {...trProps.rest}
          >
            {allVisibleColumns.map((column, i2) => {
              const resizedCol = resized.find(x => x.id === column.id) || {}
              const show =
                typeof column.show === 'function' ? column.show() : column.show
              const width = _.getFirstDefined(
                resizedCol.value,
                column.width,
                column.minWidth,
              )
              const maxWidth = _.getFirstDefined(
                resizedCol.value,
                column.width,
                column.maxWidth,
              )
              const tdProps = _.splitProps(
                getTdProps(finalState, rowInfo, column, this),
              )
              const columnProps = _.splitProps(
                column.getProps(finalState, rowInfo, column, this),
              )

              const classes = [
                tdProps.className,
                column.className,
                columnProps.className,
              ]

              const styles = {
                ...tdProps.style,
                ...column.style,
                ...columnProps.style,
              }

              const cellInfo = {
                ...rowInfo,
                isExpanded,
                column: { ...column },
                value: rowInfo.row[column.id],
                pivoted: column.pivoted,
                expander: column.expander,
                resized,
                show,
                width,
                maxWidth,
                tdProps,
                columnProps,
                classes,
                styles,
              }

              const value = cellInfo.value

              let useOnExpanderClick
              let isBranch
              let isPreview

              const onExpanderClick = e => {
                let newExpanded = _.clone(expanded)
                if (isExpanded) {
                  newExpanded = _.set(newExpanded, cellInfo.nestingPath, false)
                } else {
                  newExpanded = _.set(newExpanded, cellInfo.nestingPath, {})
                }

                return this.setStateWithData(
                  {
                    expanded: newExpanded,
                  },
                  () => (
                    onExpandedChange &&
                      onExpandedChange(newExpanded, cellInfo.nestingPath, e)
                  ),
                )
              }

              // Default to a standard cell
              let resolvedCell = _.normalizeComponent(
                column.Cell,
                cellInfo,
                value,
              )

              // Resolve Renderers
              const ResolvedAggregatedComponent =
                column.Aggregated ||
                (!column.aggregate ? AggregatedComponent : column.Cell)
              const ResolvedExpanderComponent =
                column.Expander || ExpanderComponent
              const ResolvedPivotValueComponent =
                column.PivotValue || PivotValueComponent
              const DefaultResolvedPivotComponent =
                PivotComponent ||
                (props => (
                  <div>
                    <ResolvedExpanderComponent {...props} />
                    <ResolvedPivotValueComponent {...props} />
                  </div>
                ))
              const ResolvedPivotComponent =
                column.Pivot || DefaultResolvedPivotComponent

              // Is this cell expandable?
              if (cellInfo.pivoted || cellInfo.expander) {
                // Make it expandable by defualt
                cellInfo.expandable = true
                useOnExpanderClick = true
                // If pivoted, has no subRows, and does not have a subComponent,
                // do not make expandable
                if (cellInfo.pivoted && !cellInfo.subRows && !SubComponent) {
                  cellInfo.expandable = false
                }
              }

              if (cellInfo.pivoted) {
                // Is this column a branch?
                isBranch =
                  rowInfo.row[pivotIDKey] === column.id && cellInfo.subRows
                // Should this column be blank?
                isPreview =
                  pivotBy.indexOf(column.id) >
                    pivotBy.indexOf(rowInfo.row[pivotIDKey]) && cellInfo.subRows
                // Pivot Cell Render Override
                if (isBranch) {
                  // isPivot
                  resolvedCell = _.normalizeComponent(
                    ResolvedPivotComponent,
                    {
                      ...cellInfo,
                      value: row[pivotValKey],
                    },
                    row[pivotValKey],
                  )
                } else if (isPreview) {
                  // Show the pivot preview
                  resolvedCell = _.normalizeComponent(
                    ResolvedAggregatedComponent,
                    cellInfo,
                    value,
                  )
                } else {
                  resolvedCell = null
                }
              } else if (cellInfo.aggregated) {
                resolvedCell = _.normalizeComponent(
                  ResolvedAggregatedComponent,
                  cellInfo,
                  value,
                )
              }

              if (cellInfo.expander) {
                resolvedCell = _.normalizeComponent(
                  ResolvedExpanderComponent,
                  cellInfo,
                  row[pivotValKey],
                )
                if (pivotBy) {
                  if (cellInfo.groupedByPivot) {
                    resolvedCell = null
                  }
                  if (!cellInfo.subRows && !SubComponent) {
                    resolvedCell = null
                  }
                }
              }

              const resolvedOnExpanderClick = useOnExpanderClick
                ? onExpanderClick
                : () => {}

              // If there are multiple onClick events, make sure they don't
              // override eachother. This should maybe be expanded to handle all
              // function attributes
              const interactionProps = {
                onClick: resolvedOnExpanderClick,
              }

              if (tdProps.rest.onClick) {
                interactionProps.onClick = e => {
                  tdProps.rest.onClick(e, () => resolvedOnExpanderClick(e))
                }
              }

              if (columnProps.rest.onClick) {
                interactionProps.onClick = e => {
                  columnProps.rest.onClick(e, () => resolvedOnExpanderClick(e))
                }
              }

              // Return the cell
              return (
                <TdComponent
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${i2}-${column.id}`}
                  className={classnames(
                    classes,
                    !show && 'hidden',
                    cellInfo.expandable && 'rt-expandable',
                    (isBranch || isPreview) && 'rt-pivot',
                  )}
                  style={{
                    ...styles,
                    flex: `${width} 0 auto`,
                    width: _.asPx(width),
                    maxWidth: _.asPx(maxWidth),
                  }}
                  {...tdProps.rest}
                  {...columnProps.rest}
                  {...interactionProps}
                >
                  {resolvedCell}
                </TdComponent>
              )
            })}
          </TrComponent>
          {rowInfo.subRows &&
            isExpanded &&
            rowInfo.subRows.map((d, i) =>
              makePageRow(d, i, rowInfo.nestingPath),
            )}
          {SubComponent &&
            !rowInfo.subRows &&
            isExpanded &&
            SubComponent(rowInfo)}
        </TrGroupComponent>
      )
    }

    const makePadColumn = (column, i) => {
      const resizedCol = resized.find(x => x.id === column.id) || {}
      const show =
        typeof column.show === 'function' ? column.show() : column.show
      const width = _.getFirstDefined(
        resizedCol.value,
        column.width,
        column.minWidth,
      )
      const flex = width
      const maxWidth = _.getFirstDefined(
        resizedCol.value,
        column.width,
        column.maxWidth,
      )
      const tdProps = _.splitProps(
        getTdProps(finalState, undefined, column, this),
      )
      const columnProps = _.splitProps(
        column.getProps(finalState, undefined, column, this),
      )

      const classes = [
        tdProps.className,
        column.className,
        columnProps.className,
      ]

      const styles = {
        ...tdProps.style,
        ...column.style,
        ...columnProps.style,
      }

      return (
        <TdComponent
          key={`${i}-${column.id}`}
          className={classnames(classes, !show && 'hidden')}
          style={{
            ...styles,
            flex: `${flex} 0 auto`,
            width: _.asPx(width),
            maxWidth: _.asPx(maxWidth),
          }}
          {...tdProps.rest}
        >
          {_.normalizeComponent(PadRowComponent)}
        </TdComponent>
      )
    }

    const makePadRow = (row, i) => {
      const trGroupProps = getTrGroupProps(
        finalState,
        undefined,
        undefined,
        this,
      )
      const trProps = _.splitProps(
        getTrProps(finalState, undefined, undefined, this),
      )
      return (
        <TrGroupComponent key={i} {...trGroupProps}>
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

    const makeColumnFooter = (column, i) => {
      const resizedCol = resized.find(x => x.id === column.id) || {}
      const show =
        typeof column.show === 'function' ? column.show() : column.show
      const width = _.getFirstDefined(
        resizedCol.value,
        column.width,
        column.minWidth,
      )
      const maxWidth = _.getFirstDefined(
        resizedCol.value,
        column.width,
        column.maxWidth,
      )
      const tFootTdProps = _.splitProps(
        getTfootTdProps(finalState, undefined, undefined, this),
      )
      const columnProps = _.splitProps(
        column.getProps(finalState, undefined, column, this),
      )
      const columnFooterProps = _.splitProps(
        column.getFooterProps(finalState, undefined, column, this),
      )

      const classes = [
        tFootTdProps.className,
        column.className,
        columnProps.className,
        columnFooterProps.className,
      ]

      const styles = {
        ...tFootTdProps.style,
        ...column.style,
        ...columnProps.style,
        ...columnFooterProps.style,
      }

      return (
        <TdComponent
          key={`${i}-${column.id}`}
          className={classnames(classes, !show && 'hidden')}
          style={{
            ...styles,
            flex: `${width} 0 auto`,
            width: _.asPx(width),
            maxWidth: _.asPx(maxWidth),
          }}
          {...columnProps.rest}
          {...tFootTdProps.rest}
          {...columnFooterProps.rest}
        >
          {_.normalizeComponent(column.Footer, {
            data: sortedData,
            column,
          })}
        </TdComponent>
      )
    }

    const makeColumnFooters = () => {
      const tFootProps = getTfootProps(finalState, undefined, undefined, this)
      const tFootTrProps = _.splitProps(
        getTfootTrProps(finalState, undefined, undefined, this),
      )
      return (
        <TfootComponent
          className={tFootProps.className}
          style={{
            ...tFootProps.style,
            minWidth: `${rowMinWidth}px`,
          }}
          {...tFootProps.rest}
        >
          <TrComponent
            className={classnames(tFootTrProps.className)}
            style={tFootTrProps.style}
            {...tFootTrProps.rest}
          >
            {allVisibleColumns.map(makeColumnFooter)}
          </TrComponent>
        </TfootComponent>
      )
    }

    const makePagination = () => {
      const paginationProps = _.splitProps(
        getPaginationProps(finalState, undefined, undefined, this),
      )
      return (
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
      )
    }

    const makeTable = () => {
      const pagination = makePagination()
      return (
        <div
          className={classnames('ReactTable', className, rootProps.className)}
          style={{
            ...style,
            ...rootProps.style,
          }}
          {...rootProps.rest}
        >
          {showPagination && showPaginationTop
            ? <div className="pagination-top">
              {pagination}
            </div>
            : null}
          <TableComponent
            className={classnames(
              tableProps.className,
              currentlyResizing ? 'rt-resizing' : '',
            )}
            style={tableProps.style}
            {...tableProps.rest}
          >
            {hasHeaderGroups ? makeHeaderGroups() : null}
            {makeHeaders()}
            {hasFilters ? makeFilters() : null}
            <TbodyComponent
              className={classnames(tBodyProps.className)}
              style={{
                ...tBodyProps.style,
                minWidth: `${rowMinWidth}px`,
              }}
              {...tBodyProps.rest}
            >
              {pageRows.map((d, i) => makePageRow(d, i))}
              {padRows.map(makePadRow)}
            </TbodyComponent>
            {hasColumnFooter ? makeColumnFooters() : null}
          </TableComponent>
          {showPagination && showPaginationBottom
            ? <div className="pagination-bottom">
              {pagination}
            </div>
            : null}
          {!pageRows.length &&
            <NoDataComponent {...noDataProps}>
              {_.normalizeComponent(noDataText)}
            </NoDataComponent>}
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
  }
}
