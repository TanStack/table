import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'

import { ColumnDef } from '@tanstack/react-table'
import { makeData, Person, tableColumns } from './makeData'
import { FixedHeightTable } from './FixedHeightTable'
import { WindowHeightTable } from './WindowHeightTable'

function App() {
  const rerender = React.useReducer(() => ({}), {})[1]

  const columns = React.useMemo<ColumnDef<Person>[]>(() => tableColumns, [])

  const [data, setData] = React.useState(() => makeData(50_000))
  const refreshData = () => setData(() => makeData(50_000))

  const [tableType, setTableType] = React.useState<'fixed' | 'window'>('fixed')

  return (
    <div className="p-2">
      <div className="example-instructions">
        <p>
          This demo shows a virtualised table with 50,000 rows. There are two
          versions, one is a fixed height table using{' '}
          <strong>useVirtualizer</strong>, the other is a window height table
          using <strong>useWindowVirtualizer</strong>.
        </p>
        <p style={{ marginTop: 10 }}>
          <label htmlFor="table_type">
            <strong>Table Type:</strong>
          </label>
          <select
            name="table_type"
            onChange={event =>
              setTableType(event.target.value == 'fixed' ? 'fixed' : 'window')
            }
            value={tableType}
          >
            <option value="fixed">Fixed Height</option>
            <option value="window">Window Height</option>
          </select>
        </p>
      </div>
      <div className="h-2" />
      {tableType === 'fixed' ? (
        <FixedHeightTable data={data} columns={columns} height={500} />
      ) : (
        <WindowHeightTable data={data} columns={columns} />
      )}
      <div>{data.length} Rows</div>
      <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>
      <div>
        <button onClick={() => refreshData()}>Refresh Data</button>
      </div>
    </div>
  )
}

const rootElement = document.getElementById('root')

if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
