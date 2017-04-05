import React from 'react'
import classnames from 'classnames'
//
import _ from './utils'
import lifecycle from './lifecycle'
import methods from './methods'
import defaults from './defaultProps'

export const ReactTableDefaults = defaults

export default React.createClass({
  ...lifecycle,
  ...methods,

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
      expanderColumnWidth,
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
      ExpanderComponent,
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
      sortedData
    } = resolvedState

    // Pagination
    const startRow = pageSize * page
    const endRow = startRow + pageSize
    const pageRows = manual ? resolvedData : sortedData.slice(startRow, endRow)
    const minRows = this.getMinRows()
    const padRows = _.range(Math.max(minRows - pageRows.length, 0))

    const hasColumnFooter = allVisibleColumns.some(d => d.footer)

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
      const flex = _.sum(column.columns.map(d => {
        const resized = resizing.find(x => x.id === d.id) || {}
        return d.width || resized.value ? 0 : d.minWidth
      }))
      const width = _.sum(column.columns.map(d => {
        const resized = resizing.find(x => x.id === d.id) || {}
        return _.getFirstDefined(resized.value, d.width, d.minWidth)
      }))
      const maxWidth = _.sum(column.columns.map(d => {
        const resized = resizing.find(x => x.id === d.id) || {}
        return _.getFirstDefined(resized.value, d.width, d.maxWidth)
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

      if (column.expander) {
        if (column.pivotColumns) {
          return (
            <ThComponent
              key={i}
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

      if (column.expander) {
        if (column.pivotColumns) {
          const pivotSort = sorting.find(d => d.id === column.id)
          return (
            <ThComponent
              key={i}
              className={classnames(
                'rt-pivot-header',
                'rt-resizable-header',
                column.sortable && '-cursor-pointer',
                classes,
                pivotSort ? (pivotSort.desc ? '-sort-desc' : '-sort-asc') : ''
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
              <div className='rt-resizable-header-content'>
                {column.pivotColumns.map((pivotColumn, i) => {
                  return (
                    <span key={pivotColumn.id}>
                      {_.normalizeComponent(pivotColumn.header, {
                        data: sortedData,
                        column: column
                      })}
                      {i < column.pivotColumns.length - 1 && (
                        <ExpanderComponent />
                      )}
                    </span>
                  )
                })}
              </div>
              {resizer}
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
            'rt-resizable-header',
            sort ? (sort.desc ? '-sort-desc' : '-sort-asc') : '',
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

      if (column.expander) {
        if (column.pivotColumns) {
          const pivotCols = []
          for (let i = 0; i < column.pivotColumns.length; i++) {
            const col = column.pivotColumns[i]
            const filter = filtering.find(filter => filter.id === column.id && filter.pivotId === col.id)
            pivotCols.push(
              <span key={col.id}
                style={{flex: 1}}>
                {!col.hideFilter ? (
                  _.normalizeComponent(col.filterRender,
                    {
                      col,
                      filter,
                      onFilterChange: (value) => (this.filterColumn(column, value, col))
                    },
                    defaults.column.filterRender
                  )
                ) : null}
              </span>
            )
            if (i < column.pivotColumns.length - 1) {
              pivotCols.push(<ExpanderComponent key={col.id + '-' + i} />)
            }
          }
          return (
            <ThComponent
              key={i}
              className={classnames(
                'rt-pivot-header',
                column.sortable && '-cursor-pointer',
                classes
              )}
              style={{
                ...styles,
                flex: `${width} 0 auto`,
                width: `${width}px`,
                maxWidth: `${maxWidth}px`,
                display: 'flex'
              }}
              {...rest}
            >
              {pivotCols}
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

      const filter = filtering.find(filter => filter.id === column.id)

      return (
        <ThComponent
          key={i}
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
              defaults.column.filterRender
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
                      key={i2}
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
                    key={i2}
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
                  {_.normalizeComponent(column.render, {
                    ...rowInfo,
                    value: rowInfo.rowValues[column.id]
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
              trProps.className,
            )}
            style={trProps.style || {}}
          >
            {allVisibleColumns.map((column, i2) => {
              const resized = resizing.find(x => x.id === column.id) || {}
              const show = typeof column.show === 'function' ? column.show() : column.show
              const width = _.getFirstDefined(resized.value, column.width, column.minWidth)
              const maxWidth = _.getFirstDefined(resized.value, column.width, column.maxWidth)
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
            {allVisibleColumns.map((column, i2) => {
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

              if (column.expander) {
                if (column.pivotColumns) {
                  return (
                    <TdComponent
                      key={i2}
                      className={classnames(
                        'rt-pivot',
                        classes
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
                      {_.normalizeComponent(column.footer)}
                    </TdComponent>
                  )
                }

                // Return the regular expander cell
                return (
                  <TdComponent
                    key={i2}
                    className={classnames(
                      classes,
                      {hidden: !show}
                    )}
                    style={{
                      ...styles,
                      flex: `0 0 auto`,
                      width: `${expanderColumnWidth}px`
                    }}
                  />
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
            })}
          </TrComponent>
        </TfootComponent>
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
          className={classnames(tableProps.className)}
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
})
