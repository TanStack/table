import React from 'react'
import ReactDOM from 'react-dom/client'
import { faker } from '@faker-js/faker'
import './index.css'
import {
  columnOrderingFeature,
  columnPinningFeature,
  columnVisibilityFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { makeData } from './makeData'
import type { ColumnDef } from '@tanstack/react-table'
import type { Person } from './makeData'

const _features = tableFeatures({
  columnVisibilityFeature,
  columnPinningFeature,
  columnOrderingFeature,
})

const defaultColumns: Array<ColumnDef<typeof _features, Person>> = [
  {
    header: 'Name',
    footer: (props) => props.column.id,
    columns: [
      {
        accessorKey: 'firstName',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.lastName,
        id: 'lastName',
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: (props) => props.column.id,
      },
    ],
  },
  {
    header: 'Info',
    footer: (props) => props.column.id,
    columns: [
      {
        accessorKey: 'age',
        header: () => 'Age',
        footer: (props) => props.column.id,
      },
      {
        header: 'More Info',
        columns: [
          {
            accessorKey: 'visits',
            header: () => <span>Visits</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorKey: 'status',
            header: 'Status',
            footer: (props) => props.column.id,
          },
          {
            accessorKey: 'progress',
            header: 'Profile Progress',
            footer: (props) => props.column.id,
          },
        ],
      },
    ],
  },
]

function App() {
  const [data, setData] = React.useState(() => makeData(5000))
  const [columns] = React.useState(() => [...defaultColumns])

  const rerender = () => setData(() => makeData(5000))

  const table = useTable({
    _features,
    _rowModels: {},
    columns,
    data,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  })

  const randomizeColumns = () => {
    table.setColumnOrder(
      faker.helpers.shuffle(table.getAllLeafColumns().map((d) => d.id)),
    )
  }

  return (
    <table.Subscribe
      selector={(state) => ({
        columnVisibility: state.columnVisibility,
        columnOrder: state.columnOrder,
        columnPinning: state.columnPinning,
      })}
    >
      {(_state) => (
        <div className="p-2">
          <div className="inline-block border border-black shadow rounded">
            <div className="px-1 border-b border-black">
              <label>
                <input
                  type="checkbox"
                  checked={table.getIsAllColumnsVisible()}
                  onChange={table.getToggleAllColumnsVisibilityHandler()}
                />{' '}
                Toggle All
              </label>
            </div>
            {table.getAllLeafColumns().map((column) => {
              return (
                <div key={column.id} className="px-1">
                  <label>
                    <input
                      type="checkbox"
                      checked={column.getIsVisible()}
                      onChange={column.getToggleVisibilityHandler()}
                    />{' '}
                    {column.id}
                  </label>
                </div>
              )
            })}
          </div>
          <div className="h-4" />
          <div className="flex flex-wrap gap-2">
            <button onClick={() => rerender()} className="border p-1">
              Regenerate
            </button>
            <button onClick={() => randomizeColumns()} className="border p-1">
              Shuffle Columns
            </button>
          </div>
          <div className="h-4" />
          <p className="text-sm mb-2">
            This example takes advantage of the "splitting" APIs. (APIs that
            have "left, "center", and "right" modifiers)
          </p>
          <div className="flex gap-4">
            <table className="border-2 border-black">
              <thead>
                {table.getLeftHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} colSpan={header.colSpan}>
                        <div className="whitespace-nowrap">
                          {header.isPlaceholder ? null : (
                            <table.FlexRender header={header} />
                          )}
                        </div>
                        {!header.isPlaceholder && header.column.getCanPin() && (
                          <div className="flex gap-1 justify-center">
                            {header.column.getIsPinned() !== 'left' ? (
                              <button
                                className="border rounded px-2"
                                onClick={() => {
                                  header.column.pin('left')
                                }}
                              >
                                {'<='}
                              </button>
                            ) : null}
                            {header.column.getIsPinned() ? (
                              <button
                                className="border rounded px-2"
                                onClick={() => {
                                  header.column.pin(false)
                                }}
                              >
                                X
                              </button>
                            ) : null}
                            {header.column.getIsPinned() !== 'right' ? (
                              <button
                                className="border rounded px-2"
                                onClick={() => {
                                  header.column.pin('right')
                                }}
                              >
                                {'=>'}
                              </button>
                            ) : null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, 20)
                  .map((row) => {
                    return (
                      <tr key={row.id}>
                        {row.getLeftVisibleCells().map((cell) => {
                          return (
                            <td key={cell.id}>
                              <table.FlexRender cell={cell} />
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
              </tbody>
            </table>
            <table className="border-2 border-black">
              <thead>
                {table.getCenterHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} colSpan={header.colSpan}>
                        <div className="whitespace-nowrap">
                          {header.isPlaceholder ? null : (
                            <table.FlexRender header={header} />
                          )}
                        </div>
                        {!header.isPlaceholder && header.column.getCanPin() && (
                          <div className="flex gap-1 justify-center">
                            {header.column.getIsPinned() !== 'left' ? (
                              <button
                                className="border rounded px-2"
                                onClick={() => {
                                  header.column.pin('left')
                                }}
                              >
                                {'<='}
                              </button>
                            ) : null}
                            {header.column.getIsPinned() ? (
                              <button
                                className="border rounded px-2"
                                onClick={() => {
                                  header.column.pin(false)
                                }}
                              >
                                X
                              </button>
                            ) : null}
                            {header.column.getIsPinned() !== 'right' ? (
                              <button
                                className="border rounded px-2"
                                onClick={() => {
                                  header.column.pin('right')
                                }}
                              >
                                {'=>'}
                              </button>
                            ) : null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, 20)
                  .map((row) => {
                    return (
                      <tr key={row.id}>
                        {row.getCenterVisibleCells().map((cell) => {
                          return (
                            <td key={cell.id}>
                              <table.FlexRender cell={cell} />
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
              </tbody>
            </table>
            <table className="border-2 border-black">
              <thead>
                {table.getRightHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} colSpan={header.colSpan}>
                        <div className="whitespace-nowrap">
                          {header.isPlaceholder ? null : (
                            <table.FlexRender header={header} />
                          )}
                        </div>
                        {!header.isPlaceholder && header.column.getCanPin() && (
                          <div className="flex gap-1 justify-center">
                            {header.column.getIsPinned() !== 'left' ? (
                              <button
                                className="border rounded px-2"
                                onClick={() => {
                                  header.column.pin('left')
                                }}
                              >
                                {'<='}
                              </button>
                            ) : null}
                            {header.column.getIsPinned() ? (
                              <button
                                className="border rounded px-2"
                                onClick={() => {
                                  header.column.pin(false)
                                }}
                              >
                                X
                              </button>
                            ) : null}
                            {header.column.getIsPinned() !== 'right' ? (
                              <button
                                className="border rounded px-2"
                                onClick={() => {
                                  header.column.pin('right')
                                }}
                              >
                                {'=>'}
                              </button>
                            ) : null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, 20)
                  .map((row) => {
                    return (
                      <tr key={row.id}>
                        {row.getRightVisibleCells().map((cell) => {
                          return (
                            <td key={cell.id}>
                              <table.FlexRender cell={cell} />
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
          <table.Subscribe selector={(state) => state}>
            {(state) => <pre>{JSON.stringify(state, null, 2)}</pre>}
          </table.Subscribe>
        </div>
      )}
    </table.Subscribe>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
