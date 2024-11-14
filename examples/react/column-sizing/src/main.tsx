import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  columnSizingFeature,
  flexRender,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import './index.css'

const _features = tableFeatures({ columnSizingFeature })

type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const defaultData: Array<Person> = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
]

// This is not the Column Resizing Example, this is a simplified version that just sets static column sizes
function App() {
  const [data] = React.useState(() => [...defaultData])

  const columns = React.useMemo<Array<ColumnDef<typeof _features, Person>>>(
    () => [
      {
        accessorKey: 'firstName',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
        size: 120, // initial size
      },
      {
        accessorFn: (row) => row.lastName,
        id: 'lastName',
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: (props) => props.column.id,
        size: 120,
      },
      {
        accessorKey: 'age',
        header: () => 'Age',
        footer: (props) => props.column.id,
        size: 100,
      },
      {
        accessorKey: 'visits',
        header: () => <span>Visits</span>,
        footer: (props) => props.column.id,
        size: 80,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        footer: (props) => props.column.id,
        size: 200,
      },
      {
        accessorKey: 'progress',
        header: 'Profile Progress',
        footer: (props) => props.column.id,
        size: 200,
      },
    ],
    [],
  )

  const rerender = React.useReducer(() => ({}), {})[1]

  const table = useTable({
    _features,
    _rowModels: {},
    columns,
    data,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  })

  return (
    <div className="p-2">
      <div className="flex flex-wrap gap-2">
        <div className="text-xl">{'Initial Column Sizes'}</div>
        <br />
        {table.getAllColumns().map((column) => (
          <div key={column.id}>
            <label>
              {column.id}
              <input
                type="number"
                value={column.getSize()}
                onChange={(e) => {
                  // Don't actually do this to resize columns. This is just for demonstration purposes.
                  // See the Column Resizing Example for how to do this with dedicated resizing APIs efficiently.
                  table.setColumnSizing({
                    ...table.getState().columnSizing,
                    [column.id]: Number(e.target.value),
                  })
                }}
                className="border rounded p-1 w-24 ml-2"
              />
            </label>
          </div>
        ))}
      </div>
      <div className="flex gap-2"></div>
      <div className="h-4" />
      <div className="text-xl">{'<table/>'}</div>
      <div className="overflow-x-auto">
        <table
          style={{
            width: table.getCenterTotalSize(),
          }}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      width: header.getSize(),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    <div />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getAllCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{
                      width: cell.column.getSize(),
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="h-4" />
      <div className="text-xl">{'<div/> (relative)'}</div>
      <div className="overflow-x-auto">
        <div
          className="divTable"
          style={{
            width: table.getTotalSize(),
          }}
        >
          <div className="thead">
            {table.getHeaderGroups().map((headerGroup) => (
              <div key={headerGroup.id} className="tr">
                {headerGroup.headers.map((header) => (
                  <div
                    key={header.id}
                    className="th"
                    style={{
                      width: header.getSize(),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    <div />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="tbody">
            {table.getRowModel().rows.map((row) => (
              <div key={row.id} className="tr">
                {row.getAllCells().map((cell) => (
                  <div
                    key={cell.id}
                    className="td"
                    style={{
                      width: cell.column.getSize(),
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="h-4" />
      <div className="text-xl">{'<div/> (absolute positioning)'}</div>
      <div className="overflow-x-auto">
        <div
          className="divTable"
          style={{
            width: table.getTotalSize(),
          }}
        >
          <div className="thead">
            {table.getHeaderGroups().map((headerGroup) => (
              <div
                key={headerGroup.id}
                className="tr"
                style={{
                  position: 'relative',
                }}
              >
                {headerGroup.headers.map((header) => (
                  <div
                    key={header.id}
                    className="th"
                    style={{
                      position: 'absolute',
                      left: header.getStart(),
                      width: header.getSize(),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    <div />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="tbody">
            {table.getRowModel().rows.map((row) => (
              <div
                key={row.id}
                className="tr"
                style={{
                  position: 'relative',
                }}
              >
                {row.getAllCells().map((cell) => (
                  <div
                    key={cell.id}
                    className="td"
                    style={{
                      position: 'absolute',
                      left: cell.column.getStart(),
                      width: cell.column.getSize(),
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="h-4" />
      <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button>
      <pre>
        {JSON.stringify(
          {
            columnSizing: table.getState().columnSizing,
          },
          null,
          2,
        )}
      </pre>
    </div>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
