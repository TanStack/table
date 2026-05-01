import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  columnSizingFeature,
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { makeData } from './makeData'
import type { Person } from './makeData'
import './index.css'

const _features = tableFeatures({ columnSizingFeature })

const columnHelper = createColumnHelper<typeof _features, Person>()

// This is not the Column Resizing Example, this is a simplified version that just sets static column sizes
function App() {
  const [data, setData] = React.useState(() => makeData(20))
  const refreshData = () => setData(makeData(20))
  const stressTest = () => setData(makeData(1_000))

  const columns = React.useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('firstName', {
          cell: (info) => info.getValue(),
          footer: (props) => props.column.id,
          size: 120, // initial size
        }),
        columnHelper.accessor((row) => row.lastName, {
          id: 'lastName',
          cell: (info) => info.getValue(),
          header: () => <span>Last Name</span>,
          footer: (props) => props.column.id,
          size: 120,
        }),
        columnHelper.accessor('age', {
          header: () => 'Age',
          footer: (props) => props.column.id,
          size: 100,
        }),
        columnHelper.accessor('visits', {
          header: () => <span>Visits</span>,
          footer: (props) => props.column.id,
          size: 80,
        }),
        columnHelper.accessor('status', {
          header: 'Status',
          footer: (props) => props.column.id,
          size: 200,
        }),
        columnHelper.accessor('progress', {
          header: 'Profile Progress',
          footer: (props) => props.column.id,
          size: 200,
        }),
      ]),
    [],
  )

  const rerender = React.useReducer(() => ({}), {})[1]

  const table = useTable(
    {
      _features,
      _rowModels: {},
      columns,
      data,
      debugTable: true,
      debugHeaders: true,
      debugColumns: true,
    },
    (state) => state,
  )

  return (
    <div className="demo-root">
      <div>
        <button onClick={() => refreshData()} className="demo-button">
          Regenerate Data
        </button>
        <button onClick={() => stressTest()} className="demo-button">
          Stress Test (1k rows)
        </button>
      </div>
      <div className="spacer-md" />
      <div className="button-row">
        <div className="section-title">{'Initial Column Sizes'}</div>
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
                    ...table.store.state.columnSizing,
                    [column.id]: Number(e.target.value),
                  })
                }}
                className="column-size-input"
              />
            </label>
          </div>
        ))}
      </div>
      <div className="controls"></div>
      <div className="spacer-md" />
      <div className="section-title">{'<table/>'}</div>
      <div className="scroll-container">
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
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
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
                    <table.FlexRender cell={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="spacer-md" />
      <div className="section-title">{'<div/> (relative)'}</div>
      <div className="scroll-container">
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
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
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
                    <table.FlexRender cell={cell} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="spacer-md" />
      <div className="section-title">{'<div/> (absolute positioning)'}</div>
      <div className="scroll-container">
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
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
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
                    <table.FlexRender cell={cell} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="spacer-md" />
      <button onClick={() => rerender()} className="demo-button">
        Rerender
      </button>
      <table.Subscribe selector={(state) => state}>
        {(state) => <pre>{JSON.stringify(state, null, 2)}</pre>}
      </table.Subscribe>
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
