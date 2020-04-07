import React from 'react'
import styled from 'styled-components'
import {
  useTable,
  useGroupBy,
  useExpanded,
  _UNSTABLE_usePivotColumns,
} from 'react-table'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import makeData from './makeData'

dayjs.extend(localizedFormat)

const Styles = styled.div`
  padding: 1rem;
  white-space: nowrap;

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

const renderHeaderToggles = headers => (
  <>
    {headers.map(column => (
      <div key={column.id}>
        <label>
          <input type="checkbox" {...column.getToggleHiddenProps()} />{' '}
          {column.id}
        </label>
        {column.headers && column.headers.length ? (
          <div
            style={{
              paddingLeft: '2rem',
            }}
          >
            {renderHeaderToggles(column.headers)}
          </div>
        ) : null}
      </div>
    ))}
  </>
)

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    visibleColumns,
    allColumns,
    toggleGroupBy,
    togglePivot,
    getToggleHideAllColumnsProps,
    headers,
  } = useTable(
    {
      columns,
      data,
    },
    useGroupBy,
    _UNSTABLE_usePivotColumns,
    useExpanded // useGroupBy and _UNSTABLE_usePivotColumns would be pretty useless without useExpanded ;)
  )

  // We don't want to render all of the rows for this example, so cap
  // it at 20 for this use case
  const firstPageRows = rows.slice(0, 25)

  const options = allColumns.filter(
    d => !d.isGrouped && !d.isPivoted && !d.isPivotSource
  )

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          <tr>
            <td colSpan={visibleColumns.length}>
              Group By:{' '}
              {state.groupBy.map(columnId => {
                const column = allColumns.find(d => d.id === columnId)
                return (
                  <span key={column.id}>
                    <button onClick={() => column.toggleGroupBy()}>
                      🛑 {column.render('Header')}
                    </button>{' '}
                  </span>
                )
              })}
              <select
                onChange={e => toggleGroupBy(e.target.value, true)}
                value=""
              >
                <option disabled selected value="">
                  Add column...{' '}
                </option>
                {options.map(column => (
                  <option key={column.id} value={column.id}>
                    {column.render('Header')}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <td colSpan={visibleColumns.length}>
              Pivot Columns:
              {state.pivotColumns.map(columnId => {
                const column = allColumns.find(d => d.id === columnId)
                return (
                  <span key={column.id}>
                    <button onClick={() => column.togglePivot()}>
                      🛑 {column.render('Header')}
                    </button>{' '}
                  </span>
                )
              })}
              <select
                onChange={e => togglePivot(e.target.value, true)}
                value=""
              >
                <option disabled selected value="">
                  Add column...{' '}
                </option>
                {options.map(column => (
                  <option key={column.id} value={column.id}>
                    {column.render('Header')}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <td colSpan={visibleColumns.length}>
              <div>
                <IndeterminateCheckbox {...getToggleHideAllColumnsProps()} />{' '}
                Toggle All
              </div>
              {renderHeaderToggles(headers)}
            </td>
          </tr>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
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
                    <td {...cell.getCellProps()}>
                      {cell.isGrouped ? (
                        <>
                          <span {...row.getToggleRowExpandedProps()}>
                            {row.isExpanded ? '👇' : '👉'} {cell.render('Cell')}{' '}
                            ({row.subRows.length})
                          </span>
                        </>
                      ) : cell.isAggregated ? (
                        cell.render('Aggregated')
                      ) : cell.isPlaceholder ? null : (
                        cell.render('Cell')
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <br />
      <div>Showing the first 25 results of {rows.length} rows</div>
      <pre>
        <code>{JSON.stringify(state, null, 2)}</code>
      </pre>
    </>
  )
}

function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Order Date',
        id: 'date',
        accessor: d => new Date(d.date),
        sortType: 'basic',
        aggregate: 'count',
        Cell: ({ value }) => (value ? dayjs(value).format('l') : ''),
        Aggregated: ({ value }) => `${value} Orders`,
      },
      {
        Header: 'Employee',
        accessor: 'rep',
        aggregate: 'uniqueCount',
      },
      {
        Header: 'Region',
        accessor: 'region',
        aggregate: 'uniqueCount',
      },
      {
        Header: 'Item',
        accessor: 'item',
        aggregate: 'count',
      },
      {
        Header: 'Units',
        accessor: 'units',
        aggregate: 'sum',
      },
      {
        Header: 'Unit Cost',
        accessor: 'unitCost',
        aggregate: 'average',
        Cell: ({ value }) =>
          typeof value !== 'undefined' ? (
            <div
              style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}
            >
              ${(Math.floor(value * 100) / 100).toLocaleString()}
            </div>
          ) : null,
      },
      {
        Header: 'Total',
        accessor: 'total',
        aggregate: 'sum',
        Cell: ({ value }) =>
          typeof value !== 'undefined' ? (
            <div
              style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}
            >
              ${(Math.floor(value * 100) / 100).toLocaleString()}
            </div>
          ) : null,
      },
    ],
    []
  )

  const data = React.useMemo(() => makeData(10000), [])

  return (
    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
  )
}

export default App
