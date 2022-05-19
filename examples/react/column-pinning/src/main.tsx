import React from 'react'
import ReactDOM from 'react-dom'
import faker from '@faker-js/faker'

import './index.css'

import {
  ColumnOrderState,
  createTable,
  getCoreRowModel,
  useTableInstance,
  VisibilityState,
} from '@tanstack/react-table'
import { makeData, Person } from './makeData'

let table = createTable().setRowType<Person>()

const defaultColumns = [
  table.createGroup({
    header: 'Name',
    footer: props => props.column.id,
    columns: [
      table.createDataColumn('firstName', {
        cell: info => info.getValue(),
        footer: props => props.column.id,
      }),
      table.createDataColumn(row => row.lastName, {
        id: 'lastName',
        cell: info => info.getValue(),
        header: () => <span>Last Name</span>,
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
]

function App() {
  const [data, setData] = React.useState(() => makeData(5000))
  const [columns] = React.useState(() => [...defaultColumns])

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>([])
  const [columnPinning, setColumnPinning] = React.useState({})

  const [isSplit, setIsSplit] = React.useState(false)
  const rerender = () => setData(() => makeData(5000))

  const instance = useTableInstance(table, {
    data,
    columns,
    state: {
      columnVisibility,
      columnOrder,
      columnPinning,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  })

  const randomizeColumns = () => {
    instance.setColumnOrder(
      faker.helpers.shuffle(instance.getAllLeafColumns().map(d => d.id))
    )
  }

  return (
    <div className="p-2">
      <div className="inline-block border border-black shadow rounded">
        <div className="px-1 border-b border-black">
          <label>
            <input
              {...{
                type: 'checkbox',
                checked: instance.getIsAllColumnsVisible(),
                onChange: instance.getToggleAllColumnsVisibilityHandler(),
              }}
            />{' '}
            Toggle All
          </label>
        </div>
        {instance.getAllLeafColumns().map(column => {
          return (
            <div key={column.id} className="px-1">
              <label>
                <input
                  {...{
                    type: 'checkbox',
                    checked: instance.getIsAllColumnsVisible(),
                    onChange: instance.getToggleAllColumnsVisibilityHandler(),
                  }}
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
      <div>
        <label>
          <input
            type="checkbox"
            checked={isSplit}
            onChange={e => setIsSplit(e.target.checked)}
          />{' '}
          Split Mode
        </label>
      </div>
      <div className={`flex ${isSplit ? 'gap-4' : ''}`}>
        {isSplit ? (
          <table className="border-2 border-black">
            <thead>
              {instance.getLeftHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} colSpan={header.colSpan}>
                      <div className="whitespace-nowrap">
                        {header.isPlaceholder ? null : header.renderHeader()}
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
              {instance
                .getRowModel()
                .rows.slice(0, 20)
                .map(row => {
                  return (
                    <tr key={row.id}>
                      {row.getLeftVisibleCells().map(cell => {
                        return <td key={cell.id}>{cell.renderCell()}</td>
                      })}
                    </tr>
                  )
                })}
            </tbody>
          </table>
        ) : null}
        <table className="border-2 border-black">
          <thead>
            {(isSplit
              ? instance.getCenterHeaderGroups()
              : instance.getHeaderGroups()
            ).map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} colSpan={header.colSpan}>
                    <div className="whitespace-nowrap">
                      {header.isPlaceholder ? null : header.renderHeader()}
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
            {instance
              .getRowModel()
              .rows.slice(0, 20)
              .map(row => {
                return (
                  <tr key={row.id}>
                    {(isSplit
                      ? row.getCenterVisibleCells()
                      : row.getVisibleCells()
                    ).map(cell => {
                      return <td key={cell.id}>{cell.renderCell()}</td>
                    })}
                  </tr>
                )
              })}
          </tbody>
        </table>
        {isSplit ? (
          <table className="border-2 border-black">
            <thead>
              {instance.getRightHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} colSpan={header.colSpan}>
                      <div className="whitespace-nowrap">
                        {header.isPlaceholder ? null : header.renderHeader()}
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
              {instance
                .getRowModel()
                .rows.slice(0, 20)
                .map(row => {
                  return (
                    <tr key={row.id}>
                      {row.getRightVisibleCells().map(cell => {
                        return <td key={cell.id}>{cell.renderCell()}</td>
                      })}
                    </tr>
                  )
                })}
            </tbody>
          </table>
        ) : null}
      </div>
      <pre>{JSON.stringify(instance.getState().columnPinning, null, 2)}</pre>
    </div>
  )
}

ReactDOM.render(
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>,
  document.getElementById('root')
)
