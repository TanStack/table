import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  columnVisibilityFeature,
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { makeData } from './makeData'
import type { Person } from './makeData'
import './index.css'

const _features = tableFeatures({ columnVisibilityFeature })

const columnHelper = createColumnHelper<typeof _features, Person>()

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
  const [data, setData] = React.useState(() => makeData(20))
  const refreshData = () => setData(makeData(20))
  const stressTest = () => setData(makeData(1_000))
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
    <table.Subscribe
      selector={(state) => ({
        columnVisibility: state.columnVisibility,
      })}
    >
      {(_state) => (
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
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <table.FlexRender header={header} />
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              {table.getFooterGroups().map((footerGroup) => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <table.FlexRender footer={header} />
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </tfoot>
          </table>
          <div className="spacer-md" />
          <button onClick={() => rerender()} className="demo-button">
            Rerender
          </button>
          <div className="spacer-md" />
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
