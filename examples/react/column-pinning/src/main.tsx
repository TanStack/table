import React from 'react'
import ReactDOM from 'react-dom/client'
import { faker } from '@faker-js/faker'
import './index.css'
import {
  columnOrderingFeature,
  columnPinningFeature,
  columnVisibilityFeature,
  createTableHook,
} from '@tanstack/react-table'
import { makeData } from './makeData'
import type { Person } from './makeData'

// Create table hook with features
const { useAppTable, createAppColumnHelper } = createTableHook({
  _features: {
    columnVisibilityFeature,
    columnPinningFeature,
    columnOrderingFeature,
  },
  _rowModels: {},
  debugTable: true,
  debugHeaders: true,
  debugColumns: true,
})

// Create column helper
const columnHelper = createAppColumnHelper<Person>()

// Define columns using columnHelper
const columns = columnHelper.columns([
  columnHelper.group({
    header: 'Name',
    footer: (props) => props.column.id,
    columns: columnHelper.columns([
      columnHelper.accessor('firstName', {
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => row.lastName, {
        id: 'lastName',
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: (props) => props.column.id,
      }),
    ]),
  }),
  columnHelper.group({
    header: 'Info',
    footer: (props) => props.column.id,
    columns: columnHelper.columns([
      columnHelper.accessor('age', {
        header: () => 'Age',
        footer: (props) => props.column.id,
      }),
      columnHelper.group({
        header: 'More Info',
        columns: columnHelper.columns([
          columnHelper.accessor('visits', {
            header: () => <span>Visits</span>,
            footer: (props) => props.column.id,
          }),
          columnHelper.accessor('status', {
            header: 'Status',
            footer: (props) => props.column.id,
          }),
          columnHelper.accessor('progress', {
            header: 'Profile Progress',
            footer: (props) => props.column.id,
          }),
        ]),
      }),
    ]),
  }),
])

function App() {
  const [data, setData] = React.useState(() => makeData(1_000))

  const refreshData = () => setData(makeData(1_000))
  const stressTest = () => setData(makeData(500_000))

  const table = useAppTable({
    debugTable: true,
    columns,
    data,
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
        <div className="demo-root">
          <div className="column-toggle-panel">
            <div className="column-toggle-panel-header">
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
                <div key={column.id} className="column-toggle-row">
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
          <div className="spacer-md" />
          <div className="button-row">
            <button
              onClick={() => refreshData()}
              className="demo-button demo-button-sm"
            >
              Regenerate Data
            </button>
            <button
              onClick={() => stressTest()}
              className="demo-button demo-button-sm"
            >
              Stress Test (500k rows)
            </button>
            <button
              onClick={() => randomizeColumns()}
              className="demo-button demo-button-sm"
            >
              Shuffle Columns
            </button>
          </div>
          <div className="spacer-md" />
          <p className="demo-note">
            This example using the non-split APIs. Columns are just reordered
            within 1 table instead of being split into 3 different tables.
          </p>
          <div className="table-row-group">
            <table className="outlined-table">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} colSpan={header.colSpan}>
                        <div className="nowrap">
                          {header.isPlaceholder ? null : (
                            <table.FlexRender header={header} />
                          )}
                        </div>
                        {!header.isPlaceholder && header.column.getCanPin() && (
                          <div className="pin-actions">
                            {header.column.getIsPinned() !== 'left' ? (
                              <button
                                className="pin-button"
                                onClick={() => {
                                  header.column.pin('left')
                                }}
                              >
                                {'<='}
                              </button>
                            ) : null}
                            {header.column.getIsPinned() ? (
                              <button
                                className="pin-button"
                                onClick={() => {
                                  header.column.pin(false)
                                }}
                              >
                                X
                              </button>
                            ) : null}
                            {header.column.getIsPinned() !== 'right' ? (
                              <button
                                className="pin-button"
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
                        {row.getVisibleCells().map((cell) => {
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
