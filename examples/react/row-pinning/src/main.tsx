import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'

import { makeData, Person } from './makeData'

import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  RowPinningState,
  Table,
  useReactTable,
} from '@tanstack/react-table'

function App() {
  const rerender = React.useReducer(() => ({}), {})[1]

  const [rowPinning, setRowPinning] = React.useState<RowPinningState>({
    top: [],
    bottom: [],
  })

  console.log(rowPinning)

  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [
      {
        id: 'pin',
        header: () => 'Pin',
        cell: ({ row }) =>
          row.getIsPinned() ? (
            <button onClick={() => row.pin(false)}>❌</button>
          ) : (
            <div>
              <button onClick={() => row.pin('top')}>👆</button>
              <button onClick={() => row.pin('bottom')}>👇</button>
            </div>
          ),
      },
      {
        accessorKey: 'firstName',
        cell: info => info.getValue(),
      },
      {
        accessorFn: row => row.lastName,
        id: 'lastName',
        cell: info => info.getValue(),
        header: () => <span>Last Name</span>,
      },
      {
        accessorKey: 'age',
        header: () => 'Age',
        size: 50,
      },
      {
        accessorKey: 'visits',
        header: () => <span>Visits</span>,
        size: 50,
      },
      {
        accessorKey: 'status',
        header: 'Status',
      },
      {
        accessorKey: 'progress',
        header: 'Profile Progress',
        size: 80,
      },
    ],
    []
  )

  const [data, setData] = React.useState(() => makeData(1000))
  const refreshData = () => setData(() => makeData(1000))

  const table = useReactTable({
    data,
    columns,
    state: {
      rowPinning,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowPinningChange: setRowPinning,
    debugTable: true,
  })

  return (
    <div>
      <div className="p-2 container">
        <div className="h-2" />
        <table>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanFilter() ? (
                            <div>
                              <Filter column={header.column} table={table} />
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
          <tbody>
            {table.getTopRows().map(row => {
              return (
                <tr
                  key={row.id}
                  style={{
                    backgroundColor: 'lightblue',
                    boxShadow: '0 0 3px 1px black',
                    position: 'sticky',
                    top: `${row.getPinnedIndex() * 25 + 48}px`,
                  }}
                >
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
            {table.getCenterRows().map(row => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
            {table.getBottomRows().map(row => {
              return (
                <tr
                  key={row.id}
                  style={{
                    backgroundColor: 'lightblue',
                    boxShadow: '0 0 3px 1px black',
                    position: 'sticky',
                    bottom: `${row.getPinnedIndex() * 25}px`,
                  }}
                >
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td
                        key={cell.id}
                        style={{ position: 'sticky', bottom: 0 }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="h-2" />
      <br />
      <div>
        {Object.keys(rowPinning).length} of{' '}
        {table.getPreFilteredRowModel().rows.length} Total Rows Selected
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
          onClick={() => console.info('rowPinning', rowPinning)}
        >
          Log `rowPinning` state
        </button>
      </div>
    </div>
  )
}

function Filter({
  column,
  table,
}: {
  column: Column<any, any>
  table: Table<any>
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  return typeof firstValue === 'number' ? (
    <div className="flex space-x-2">
      <input
        type="number"
        value={((column.getFilterValue() as any)?.[0] ?? '') as string}
        onChange={e =>
          column.setFilterValue((old: any) => [e.target.value, old?.[1]])
        }
        placeholder={`Min`}
        className="w-24 border shadow rounded"
      />
      <input
        type="number"
        value={((column.getFilterValue() as any)?.[1] ?? '') as string}
        onChange={e =>
          column.setFilterValue((old: any) => [old?.[0], e.target.value])
        }
        placeholder={`Max`}
        className="w-24 border shadow rounded"
      />
    </div>
  ) : (
    <input
      type="text"
      value={(column.getFilterValue() ?? '') as string}
      onChange={e => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="w-36 border shadow rounded"
    />
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
