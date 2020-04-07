import React from 'react'
import styled from 'styled-components'
import { useTable, useGroupBy, useExpanded } from 'react-table'

import makeData from './makeData'

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
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
  }
`

function useControlledState(state, { instance }) {
  return React.useMemo(() => {
    if (state.groupBy.length) {
      return {
        ...state,
        hiddenColumns: [...state.hiddenColumns, ...state.groupBy].filter(
          (d, i, all) => all.indexOf(d) === i
        ),
      }
    }
    return state
  }, [state])
}

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
  } = useTable(
    {
      columns,
      data,
    },
    useGroupBy,
    useExpanded,
    // Our custom plugin to add the expander column
    hooks => {
      hooks.useControlledState.push(useControlledState)
      hooks.visibleColumns.push((columns, { instance }) => {
        if (!instance.state.groupBy.length) {
          return columns
        }

        return [
          {
            id: 'expander', // Make sure it has an ID
            // Build our expander column
            Header: ({ allColumns, state: { groupBy } }) => {
              return groupBy.map(columnId => {
                const column = allColumns.find(d => d.id === columnId)

                return (
                  <span {...column.getHeaderProps()}>
                    {column.canGroupBy ? (
                      // If the column can be grouped, let's add a toggle
                      <span {...column.getGroupByToggleProps()}>
                        {column.isGrouped ? '🛑 ' : '👊 '}
                      </span>
                    ) : null}
                    {column.render('Header')}{' '}
                  </span>
                )
              })
            },
            Cell: ({ row }) => {
              if (row.canExpand) {
                const groupedCell = row.allCells.find(d => d.isGrouped)

                return (
                  <span
                    {...row.getToggleRowExpandedProps({
                      style: {
                        // We can even use the row.depth property
                        // and paddingLeft to indicate the depth
                        // of the row
                        paddingLeft: `${row.depth * 2}rem`,
                      },
                    })}
                  >
                    {row.isExpanded ? '👇' : '👉'} {groupedCell.render('Cell')}{' '}
                    ({row.subRows.length})
                  </span>
                )
              }

              return null
            },
          },
          ...columns,
        ]
      })
    }
  )

  // We don't want to render all of the rows for this example, so cap
  // it at 100 for this use case
  const firstPageRows = rows.slice(0, 100)

  return (
    <>
      <pre>
        <code>{JSON.stringify({ state }, null, 2)}</code>
      </pre>
      <Legend />
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>
                  {column.canGroupBy ? (
                    // If the column can be grouped, let's add a toggle
                    <span {...column.getGroupByToggleProps()}>
                      {column.isGrouped ? '🛑 ' : '👊 '}
                    </span>
                  ) : null}
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td
                      // For educational purposes, let's color the
                      // cell depending on what type it is given
                      // from the useGroupBy hook
                      {...cell.getCellProps()}
                      style={{
                        background: cell.isGrouped
                          ? '#0aff0082'
                          : cell.isAggregated
                          ? '#ffa50078'
                          : cell.isPlaceholder
                          ? '#ff000042'
                          : 'white',
                      }}
                    >
                      {cell.isAggregated
                        ? // If the cell is aggregated, use the Aggregated
                          // renderer for cell
                          cell.render('Aggregated')
                        : cell.isPlaceholder
                        ? null // For cells with repeated values, render null
                        : // Otherwise, just render the regular cell
                          cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <br />
      <div>Showing the first 100 results of {rows.length} rows</div>
    </>
  )
}

function Legend() {
  return (
    <div
      style={{
        padding: '0.5rem 0',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          background: '#0aff0082',
          padding: '0.5rem',
        }}
      >
        Grouped
      </span>{' '}
      <span
        style={{
          display: 'inline-block',
          background: '#ffa50078',
          padding: '0.5rem',
        }}
      >
        Aggregated
      </span>{' '}
      <span
        style={{
          display: 'inline-block',
          background: '#ff000042',
          padding: '0.5rem',
        }}
      >
        Placeholder
      </span>
    </div>
  )
}

// This is a custom aggregator that
// takes in an array of leaf values and
// returns the rounded median
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
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'First Name',
            accessor: 'firstName',
            // Use a two-stage aggregator here to first
            // count the total rows being aggregated,
            // then sum any of those counts if they are
            // aggregated further
            aggregate: 'count',
            Aggregated: ({ value }) => `${value} Names`,
          },
          {
            Header: 'Last Name',
            accessor: 'lastName',
            // Use another two-stage aggregator here to
            // first count the UNIQUE values from the rows
            // being aggregated, then sum those counts if
            // they are aggregated further
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
            // Aggregate the average age of visitors
            aggregate: 'average',
            Aggregated: ({ value }) => `${value} (avg)`,
          },
          {
            Header: 'Visits',
            accessor: 'visits',
            // Aggregate the sum of all visits
            aggregate: 'sum',
            Aggregated: ({ value }) => `${value} (total)`,
          },
          {
            Header: 'Status',
            accessor: 'status',
          },
          {
            Header: 'Profile Progress',
            accessor: 'progress',
            // Use our custom roundedMedian aggregator
            aggregate: roundedMedian,
            Aggregated: ({ value }) => `${value} (med)`,
          },
        ],
      },
    ],
    []
  )

  const data = React.useMemo(() => makeData(100000), [])

  return (
    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
  )
}

export default App
