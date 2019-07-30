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

function Table({ columns, data }) {
  const {
    getTableProps,
    headerGroups,
    rows,
    prepareRow,
    state: [{ groupBy, expanded }],
  } = useTable(
    {
      columns,
      data,
    },
    useGroupBy,
    useExpanded
  )

  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  const firstPageRows = rows.slice()

  return (
    <>
      <pre>
        <code>{JSON.stringify({ groupBy, expanded }, null, 2)}</code>
      </pre>
      <Legend />
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps()}>
                  {column.canGroupBy ? (
                    <span {...column.getGroupByToggleProps()}>
                      {column.grouped ? '🛑' : '👊'}
                    </span>
                  ) : null}
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.sorted ? (column.sortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {firstPageRows.map(
            (row, i) =>
              prepareRow(row) || (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        style={{
                          background: cell.grouped
                            ? '#0aff0082'
                            : cell.aggregated
                            ? '#ffa50078'
                            : cell.repeatedValue
                            ? '#ff000042'
                            : 'white',
                        }}
                      >
                        {cell.grouped ? (
                          // Add an expander and row count to the grouped cell
                          <>
                            <span
                              style={{
                                cursor: 'pointer',
                              }}
                              onClick={() => row.toggleExpanded()}
                            >
                              {row.isExpanded ? '👇' : '👉'}
                            </span>
                            {cell.render('Cell')} ({row.subRows.length})
                          </>
                        ) : cell.aggregated ? (
                          // Use the Aggregated renderer for cells that have
                          // aggregated values
                          cell.render('Aggregated')
                        ) : cell.repeatedValue ? null : ( // For cells with repeated values, render null
                          // Otherwise, just render the regular cell
                          cell.render('Cell')
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
          )}
        </tbody>
      </table>
      <br />
      <div>Showing the first 20 results of {rows.length} rows</div>
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
        Repeated Value
      </span>
    </div>
  )
}

function roundedMedian(values) {
  let min = values[0] || ''
  let max = values[0] || ''

  values.forEach(value => {
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
            aggregate: ['sum', 'count'],
            Aggregated: ({ value }) => `${value} Names`,
          },
          {
            Header: 'Last Name',
            accessor: 'lastName',
            // Use another two-stage aggregator here to
            // first count the UNIQUE values from the rows
            // being aggregated, then sum those counts if
            // they are aggregated further
            aggregate: ['sum', 'uniqueCount'],
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

  const data = React.useMemo(() => makeData(100), [])

  return (
    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
  )
}

export default App
