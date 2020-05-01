import React from 'react'
import styled from 'styled-components'

import {
  DefaultColumnFilter,
  GlobalFilter,
  SliderColumnFilter,
  SelectColumnFilter,
  NumberRangeColumnFilter,
} from './Filters'

//

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    thead {
      tr:last-child {
        th {
          border-bottom: 2px solid black;
        }
      }
    }

    tr {
      :last-child {
        th,
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }

    tfoot {
      tr:first-child {
        td {
          border-top: 2px solid black;
        }
      }
    }
  }
`

const FilterComponent = props => {
  if (props.column.filterUi === 'range') {
    return <SliderColumnFilter {...props} />
  } else if (props.column.filterUi === 'select') {
    return <SelectColumnFilter {...props} />
  } else if (props.column.filterUi === 'minMax') {
    return <NumberRangeColumnFilter {...props} />
  }
  return <DefaultColumnFilter {...props} />
}

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return <input type="checkbox" ref={resolvedRef} {...rest} />
  }
)

const expanderColumn = {
  id: 'expander',
  isExpanderColumn: true,
  Header: ({
    tableInstance: {
      flatColumns,
      state: { grouping },
    },
  }) => {
    return grouping.map(columnId => {
      const column = flatColumns.find(d => d.id === columnId)

      return (
        <span key={columnId}>
          {column.getCanGroup() ? (
            <span {...column.getToggleGroupingProps()}>
              {column.getIsGrouped() ? '🛑 ' : '👊 '}
            </span>
          ) : null}
          {column.getCanSort() ? (
            <span {...column.getToggleSortingProps()}>
              {column.render(column.Header)}
              {column.getIsSorted()
                ? column.getIsSortedDesc()
                  ? ' 🔽'
                  : ' 🔼'
                : ''}
            </span>
          ) : (
            column.render(column.Header)
          )}{' '}
        </span>
      )
    })
  },
  Cell: ({ row }) => {
    if (!row.getCanExpand()) {
      return null
    }

    const groupedCell = row.cells.find(cell => cell.getIsGrouped())

    return (
      <span
        {...row.getToggleExpandedProps({
          style: {
            // We can even use the row.depth property
            // and paddingLeft to indicate the depth
            // of the row
            paddingLeft: `${row.depth * 2}rem`,
          },
        })}
      >
        {row.getIsExpanded(0) ? '👇' : '👉'}{' '}
        {groupedCell.render(groupedCell.column.Cell)} ({row.subRows.length})
      </span>
    )
  },
}

const selectionColumn = {
  id: 'selection',
  isSelectionColumn: true,
  Header: ({ tableInstance: { getToggleAllRowsSelectedProps } }) => (
    <div>
      <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
    </div>
  ),
  Cell: ({ row }) => (
    <div>
      <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
    </div>
  ),
}

export const withBasicTable = {
  useOptions,
  decorateFlatColumns,
}

function useOptions(options) {
  return {
    ...options,
    defaultColumn: {
      Filter: FilterComponent,
      ...options.defaultColumn,
    },
  }
}

function decorateFlatColumns(flatColumns, { getInstance }) {
  flatColumns.unshift(
    ...(getInstance().options.enableExpanderColumn
      ? [selectionColumn, expanderColumn]
      : [selectionColumn])
  )
}

export function BasicTable({ instance }) {
  const {
    headerGroups,
    visibilityColumns,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilterValue,
    state,
    gotoPage,
    previousPage,
    getCanPreviousPage,
    nextPage,
    getPageRows,
    getCanNextPage,
    getPageCount,
    getPageOptions,
    setPageSize,
    getToggleAllColumnsVisibilityProps,
    getTableProps,
    getTableHeadProps,
    getTableBodyProps,
  } = instance

  const filterGroup = headerGroups[headerGroups.length - 1]

  return (
    <Styles>
      <div>
        <h3>Column Visibility</h3>
        <label>
          <strong>
            <IndeterminateCheckbox {...getToggleAllColumnsVisibilityProps()} />{' '}
            All
          </strong>
        </label>{' '}
        {visibilityColumns.map(column => (
          <span key={column.id}>
            <label>
              <input {...column.getToggleVisibilityProps()} />{' '}
              {column.header.render(column.Header)}
            </label>{' '}
          </span>
        ))}
      </div>
      <br />
      <br />
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilterValue={state.globalFilterValue}
        setGlobalFilterValue={setGlobalFilterValue}
      />
      <table {...getTableProps()}>
        <thead {...getTableHeadProps()}>
          {headerGroups.map(headerGroup => (
            <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(header => (
                <th key={header.id} {...header.getHeaderProps()}>
                  {header.column.getCanGroup() ? (
                    <span {...header.column.getToggleGroupingProps()}>
                      {header.column.getIsGrouped() ? '🛑 ' : '👊 '}
                    </span>
                  ) : null}
                  {header.column.getCanSort() ? (
                    <span {...header.column.getToggleSortingProps()}>
                      {header.render(header.column.Header)}
                      {header.column.getIsSorted()
                        ? header.column.getIsSortedDesc()
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  ) : (
                    header.render(header.column.Header)
                  )}
                </th>
              ))}
            </tr>
          ))}
          <tr {...filterGroup.getHeaderGroupProps()}>
            {filterGroup.headers.map(header => (
              <th
                key={header.id}
                style={{
                  position: 'relative',
                }}
              >
                {header.column.getIsFiltered() ? (
                  <span
                    css={`
                      position: absolute;
                      left: 0;
                      top: 0;
                      display: inline-block;
                      font-size: 0.5rem;
                      font-weight: bold;
                      padding: 0.1rem 0.2rem;
                      color: white;
                      background: gray;
                    `}
                  >
                    {header.column.getFilterIndex() + 1}
                  </span>
                ) : (
                  ''
                )}
                {header.column.getCanFilter() && header.column.Filter
                  ? header.render(header.column.Filter)
                  : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody {...getTableBodyProps()}>
          {getPageRows().length ? (
            getPageRows().map((row, i) => (
              <tr
                key={row.id}
                {...row.getRowProps({
                  style: {
                    background: row.getIsSelected() ? '#d2f4ff' : undefined,
                  },
                })}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} {...cell.getCellProps()}>
                    {cell.getIsGrouped() ? (
                      // If it's a grouped cell, add an expander and row count
                      <>
                        <span {...row.getToggleExpandedProps()}>
                          {row.getIsExpanded() ? '👇' : '👉'}
                        </span>{' '}
                        {cell.render(cell.column.Cell)} ({row.subRows.length})
                      </>
                    ) : cell.getIsAggregated() ? (
                      // If the cell is aggregated, use the Aggregated
                      // renderer for cell
                      cell.render(cell.column.Aggregated || cell.column.Cell)
                    ) : cell.getIsPlaceholder() ? null : ( // For cells with repeated values, render null
                      // Otherwise, just render the regular cell
                      cell.render(cell.column.Cell)
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={visibleColumns.length}>
                <em>No rows to display</em>
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={visibleColumns.length}>
              <div className="pagination">
                <button
                  onClick={() => gotoPage(0)}
                  disabled={!getCanPreviousPage()}
                >
                  {'<<'}
                </button>{' '}
                <button
                  onClick={() => previousPage()}
                  disabled={!getCanPreviousPage()}
                >
                  {'<'}
                </button>{' '}
                <button onClick={() => nextPage()} disabled={!getCanNextPage()}>
                  {'>'}
                </button>{' '}
                <button
                  onClick={() => gotoPage(getPageCount() - 1)}
                  disabled={!getCanNextPage()}
                >
                  {'>>'}
                </button>{' '}
                <span>
                  Page{' '}
                  <strong>
                    {state.pageIndex + 1} of {getPageOptions().length}
                  </strong>{' '}
                </span>
                <span>
                  | Go to page:{' '}
                  <input
                    type="number"
                    defaultValue={state.pageIndex + 1}
                    onChange={e => {
                      const page = e.target.value
                        ? Number(e.target.value) - 1
                        : 0
                      gotoPage(page)
                    }}
                    style={{ width: '100px' }}
                  />
                </span>{' '}
                <select
                  value={state.pageSize}
                  onChange={e => {
                    setPageSize(Number(e.target.value))
                  }}
                >
                  {[10, 20, 30, 40, 50].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </Styles>
  )
}
