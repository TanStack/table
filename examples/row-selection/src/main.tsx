import React, { HTMLAttributes } from 'react'
import ReactDOM from 'react-dom'

import './index.css'

import { makeData } from './makeData'

import {
  Column,
  columnFilterRowsFn,
  createTable,
  globalFilterRowsFn,
  ReactTable,
} from '@tanstack/react-table'
type Row = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

let table = createTable()
  .RowType<Row>()
  .AggregationFns({
    testAggregationFn: (rows: Row[]) =>
      rows.reduce((acc, row) => acc + row.age, 0),
  })

function App() {
  const rerender = React.useReducer(() => ({}), {})[1]

  const [rowSelection, setRowSelection] = React.useState({})
  const [columnFilters, setColumnFilters] = React.useState([])
  const [globalFilter, setGlobalFilter] = React.useState('')

  const columns = React.useMemo(
    () =>
      table.createColumns([
        table.createDisplayColumn({
          id: 'select',
          header: ({ instance }) => (
            <IndeterminateCheckbox
              {...instance.getToggleAllRowsSelectedProps()}
            />
          ),
          cell: ({ row }) => (
            <div className="px-1">
              <IndeterminateCheckbox {...row.getToggleSelectedProps()} />
            </div>
          ),
        }),
        table.createGroup({
          header: 'Name',
          footer: props => props.column.id,
          columns: [
            table.createDataColumn('firstName', {
              cell: info => info.value,
              footer: props => props.column.id,
            }),
            table.createDataColumn(row => row.lastName, {
              id: 'lastName',
              cell: info => info.value,
              header: <span>Last Name</span>,
              footer: props => props.column.id,
            }),
          ],
        }),
        table.createGroup({
          header: 'Info',
          footer: props => props.column.id,
          columns: [
            table.createDataColumn('age', {
              header: () => 'Age',
              footer: props => props.column.id,
            }),
            table.createGroup({
              header: 'More Info',
              columns: [
                table.createDataColumn('visits', {
                  header: () => <span>Visits</span>,
                  footer: props => props.column.id,
                }),
                table.createDataColumn('status', {
                  header: 'Status',
                  footer: props => props.column.id,
                }),
                table.createDataColumn('progress', {
                  header: 'Profile Progress',
                  footer: props => props.column.id,
                }),
              ],
            }),
          ],
        }),
      ]),
    []
  )

  const [data, refreshData] = React.useReducer(
    () => makeData(10000),
    undefined,
    () => makeData(10000)
  )

  const instance = table.useTable({
    data,
    columns,
    state: {
      rowSelection,
      columnFilters,
      globalFilter,
    },
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    columnFilterRowsFn: columnFilterRowsFn,
    globalFilterRowsFn: globalFilterRowsFn,
  })

  return (
    <div className="p-2">
      <div>
        <input
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          className="p-2 font-lg shadow border border-block"
          placeholder="Search all columns..."
        />
      </div>
      <div className="h-2" />
      <table {...instance.getTableProps({})}>
        <thead>
          {instance.getHeaderGroups().map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(header => {
                return (
                  <th {...header.getHeaderProps()}>
                    {header.isPlaceholder ? null : (
                      <>
                        {header.renderHeader()}
                        {header.column.getCanColumnFilter() ? (
                          <div>
                            <Filter
                              column={header.column}
                              instance={instance}
                            />
                          </div>
                        ) : null}
                      </>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody {...instance.getTableBodyProps()}>
          {instance
            .getRows()
            .slice(0, 10)
            .map(row => {
              return (
                <tr {...row.getRowProps()}>
                  {row.getVisibleCells().map(cell => {
                    return <td {...cell.getCellProps()}>{cell.renderCell()}</td>
                  })}
                </tr>
              )
            })}
        </tbody>
      </table>
      <br />
      <div>
        {Object.keys(rowSelection).length} of{' '}
        {instance.getPreFilteredRows().length} Total Rows Selected
      </div>
      <hr />
      <br />
      <div>
        <button className="border rounded p-2 mb-2" onClick={() => rerender()}>
          Force Rerender
        </button>
      </div>
      <div>
        <button
          className="border rounded p-2 mb-2"
          onClick={() => refreshData()}
        >
          Refresh Data
        </button>
      </div>
      <div>
        <button
          className="border rounded p-2 mb-2"
          onClick={() => console.log('rowSelection', rowSelection)}
        >
          Log `rowSelection` state
        </button>
      </div>
      <div>
        <button
          className="border rounded p-2 mb-2"
          onClick={() =>
            console.log(
              'instance.getSelectedFlatRows()',
              instance.getSelectedFlatRows()
            )
          }
        >
          Log instance.getSelectedFlatRows()
        </button>
      </div>
    </div>
  )
}

function Filter({
  column,
  instance,
}: {
  column: Column<any, any, any, any, any>
  instance: ReactTable<any, any, any, any, any>
}) {
  const firstValue =
    instance.getPreColumnFilteredFlatRows()[0].values[column.id]

  return typeof firstValue === 'number' ? (
    <div className="flex space-x-2">
      <input
        type="number"
        min={Number(column.getPreFilteredMinMaxValues()[0])}
        max={Number(column.getPreFilteredMinMaxValues()[1])}
        value={(column.getColumnFilterValue()?.[0] ?? '') as string}
        onChange={e =>
          column.setColumnFilterValue(old => [e.target.value, old?.[1]])
        }
        placeholder={`Min (${column.getPreFilteredMinMaxValues()[0]})`}
        className="w-24 border shadow rounded"
      />
      <input
        type="number"
        min={Number(column.getPreFilteredMinMaxValues()[0])}
        max={Number(column.getPreFilteredMinMaxValues()[1])}
        value={(column.getColumnFilterValue()?.[1] ?? '') as string}
        onChange={e =>
          column.setColumnFilterValue(old => [old?.[0], e.target.value])
        }
        placeholder={`Max (${column.getPreFilteredMinMaxValues()[1]})`}
        className="w-24 border shadow rounded"
      />
    </div>
  ) : (
    <input
      type="text"
      value={(column.getColumnFilterValue() ?? '') as string}
      onChange={e => column.setColumnFilterValue(e.target.value)}
      placeholder={`Search... (${column.getPreFilteredUniqueValues().size})`}
      className="w-36 border shadow rounded"
    />
  )
}

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate: boolean } & HTMLAttributes<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!)

  React.useEffect(() => {
    ref.current.indeterminate = indeterminate
  }, [ref, indeterminate])

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + ' cursor-pointer'}
      {...rest}
    />
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
