import React from 'react'
import styled from 'styled-components'
import matchSorter from 'match-sorter'
import { useTable } from 'react-table'

import makeData from './makeData'

import {
  DefaultColumnFilter,
  GlobalFilter,
  SelectColumnFilter,
  SliderColumnFilter,
  NumberRangeColumnFilter,
} from './Filters'

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

// Define a custom filterType function!
const filterGreaterThan = (rows, ids, filterValue) => {
  return rows.filter(row => {
    return ids.some(id => {
      const rowValue = row.values[id]
      return rowValue >= filterValue
    })
  })
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = val => typeof val !== 'number'

const filterFuzzy = (rows, ids, filterValue) => {
  return matchSorter(rows, filterValue, {
    keys: ids.map(id => row => row.values[id]),
  })
}
// Let the table remove the filter if the string is empty
filterFuzzy.autoRemove = val => !val

function roundedMedian(leafValues) {
  let min = leafValues[0] || 0
  let max = leafValues[0] || 0

  leafValues.forEach(value => {
    min = Math.min(min, value)
    max = Math.max(max, value)
  })

  return Math.round((min + max) / 2)
}

function App() {
  const [enableExpanderColumn, setEnableExpanderColumn] = React.useState(false)
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'First Name',
            accessor: 'firstName',
            aggregate: 'count',
            Aggregated: ({ value }) => `${value} Names`,
          },
          {
            Header: 'Last Name',
            accessor: 'lastName',
            filterType: 'fuzzy',
            aggregate: 'uniqueCount',
            Aggregated: ({ value }) => `${value} Unique Names`,
          },
        ],
      },
      {
        Header: 'Info',
        columns: [
          {
            Header: 'Age',
            accessor: 'age',
            Filter: SliderColumnFilter,
            filterType: 'equals',
            aggregate: 'average',
            Aggregated: ({ value }) => `${value} (avg)`,
            enableMinMaxValues: true,
          },
          {
            Header: 'Visits',
            accessor: 'visits',
            Filter: NumberRangeColumnFilter,
            filterType: 'between',
            aggregate: 'sum',
            Aggregated: ({ value }) => `${value} (total)`,
            enableMinMaxValues: true,
          },
          {
            Header: 'Status',
            accessor: 'status',
            Filter: SelectColumnFilter,
            filterType: 'includes',
            enableUniqueValues: true,
          },
          {
            Header: 'Profile Progress',
            accessor: 'progress',
            Filter: SliderColumnFilter,
            filterType: 'greaterThan',
            aggregate: roundedMedian,
            Aggregated: ({ value }) => `${value} (med)`,
            enableMinMaxValues: true,
          },
        ],
      },
    ],
    []
  )

  const data = React.useMemo(() => makeData(100000), [])

  const {
    headerGroups,
    visibilityColumns,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilterValue,
    getSelectedFlatRows,
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
  } = useTable({
    data,
    columns,
    defaultColumn: {
      Filter: DefaultColumnFilter,
    },
    filterTypes: {
      fuzzy: filterFuzzy,
      greaterThan: filterGreaterThan,
    },
    enableFacetedFilters: true,
    decorateFlatColumns: React.useCallback(
      flatColumns => {
        flatColumns.unshift({
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
        })

        if (enableExpanderColumn) {
          flatColumns.unshift({
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
                      // If the column can be grouped, let's add a toggle
                      <column.GroupingToggle>
                        {column.getIsGrouped() ? '🛑 ' : '👊 '}
                      </column.GroupingToggle>
                    ) : null}
                    {column.SortingToggle ? (
                      <column.SortingToggle>
                        {column.render('Header')}
                        {column.getIsSorted()
                          ? column.getIsSortedDesc()
                            ? ' 🔽'
                            : ' 🔼'
                          : ''}
                      </column.SortingToggle>
                    ) : (
                      column.render('Header')
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
                  {groupedCell.render('Cell')} ({row.subRows.length})
                </span>
              )
            },
          })
        }
      },
      [enableExpanderColumn]
    ),
  })

  const filterGroup = headerGroups[headerGroups.length - 1]

  React.useEffect(() => {
    window.getState = () => console.log(state)
    window.getSelectedFlatRows = () => console.log(getSelectedFlatRows())
  })

  return (
    <Styles>
      <h1>React Table</h1>
      <div>
        <h3>Options</h3>
        <label>
          <input
            type="checkbox"
            value={enableExpanderColumn}
            onChange={e => setEnableExpanderColumn(e.target.checked)}
          />{' '}
          Enable Expander Column
        </label>
      </div>
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
              {column.header.render('Header')}
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
                      {header.render('Header')}
                      {header.column.getIsSorted()
                        ? header.column.getIsSortedDesc()
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  ) : (
                    header.render('Header')
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
                  ? header.render('Filter')
                  : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody {...getTableBodyProps()}>
          {getPageRows().length ? (
            getPageRows().map((row, i) => (
              <tr key={row.id} {...row.getRowProps()}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} {...cell.getCellProps()}>
                    {cell.getIsGrouped() ? (
                      // If it's a grouped cell, add an expander and row count
                      <>
                        <span {...row.getToggleExpandedProps()}>
                          {row.getIsExpanded() ? '👇' : '👉'}
                        </span>{' '}
                        {cell.render('Cell')} ({row.subRows.length})
                      </>
                    ) : cell.getIsAggregated() ? (
                      // If the cell is aggregated, use the Aggregated
                      // renderer for cell
                      cell.render('Aggregated')
                    ) : cell.getIsPlaceholder() ? null : ( // For cells with repeated values, render null
                      // Otherwise, just render the regular cell
                      cell.render('Cell')
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
      <br />
      <h3>Console Commands</h3>
      <ul>
        <li>
          <pre>window.getState()</pre> - Dump the state of the table.
        </li>
        <li>
          <pre>window.getSelectedFlatRows()</pre> - Get a flat array of rows
          that are currently selected
        </li>
      </ul>
    </Styles>
  )
}

export default App
