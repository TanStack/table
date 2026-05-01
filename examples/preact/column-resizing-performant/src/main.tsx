import { useMemo, useReducer, useState } from 'preact/hooks'
import { memo } from 'preact/compat'
import { render } from 'preact'
import {
  columnResizingFeature,
  columnSizingFeature,
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/preact-table'
import { makeData } from './makeData'
import type { Table } from '@tanstack/preact-table'
import './index.css'

const _features = tableFeatures({ columnSizingFeature, columnResizingFeature })

type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

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
])

function App() {
  const [data, setData] = useState(() => makeData(200))
  const refreshData = () => setData(makeData(200))
  const stressTest = () => setData(makeData(2_000))

  const rerender = useReducer(() => ({}), {})[1]

  const table = useTable(
    {
      _features,
      _rowModels: {},
      columns,
      data,
      defaultColumn: {
        minSize: 60,
        maxSize: 800,
      },
      columnResizeMode: 'onChange',
      debugTable: true,
      debugHeaders: true,
      debugColumns: true,
    },
    (state) => ({
      columnSizing: state.columnSizing,
      columnResizing: state.columnResizing,
    }),
  )

  /**
   * Instead of calling `column.getSize()` on every render for every header
   * and especially every data cell (very expensive),
   * we will calculate all column sizes at once at the root table level in a useMemo
   * and pass the column sizes down as CSS variables to the <table> element.
   */
  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders()
    const colSizes: { [key: string]: number } = {}
    for (const header of headers) {
      colSizes[`--header-${header.id}-size`] = header.getSize()
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
    }
    return colSizes
  }, [table.state.columnResizing, table.state.columnSizing])

  // demo purposes
  const [enableMemo, setEnableMemo] = useState(true)

  return (
    <div className="demo-root">
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (2k rows)</button>
      </div>
      <div className="spacer-md" />
      <i>
        This example has artificially slow cell renders to simulate complex
        usage
      </i>
      <div className="spacer-md" />
      <label>
        Memoize Table Body:{' '}
        <input
          type="checkbox"
          checked={enableMemo}
          onChange={() => setEnableMemo(!enableMemo)}
        />
      </label>
      <div className="spacer-md" />
      <button onClick={() => rerender(0)} className="demo-button">
        Rerender
      </button>
      <table.Subscribe selector={(state) => state}>
        {(state) => (
          <pre style={{ minHeight: '10rem' }}>
            {JSON.stringify(state, null, 2)}
          </pre>
        )}
      </table.Subscribe>
      <div className="spacer-md" />({data.length.toLocaleString()} rows)
      <div className="scroll-container">
        {/* Here in the <table> equivalent element (surrounds all table head and data cells), we will define our CSS variables for column sizes */}
        <div
          className="divTable"
          style={{
            ...columnSizeVars, // Define column sizes on the <table> element
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
                      width: `calc(var(--header-${header.id}-size) * 1px)`,
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                    <div
                      onDblClick={() => header.column.resetSize()}
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={`resizer ${
                        header.column.getIsResizing() ? 'isResizing' : ''
                      }`}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
          {/* When resizing any column we will render this special memoized version of our table body */}
          {table.store.state.columnResizing.isResizingColumn && enableMemo ? (
            <MemoizedTableBody table={table} />
          ) : (
            <TableBody table={table} />
          )}
        </div>
      </div>
    </div>
  )
}

// un-memoized normal table body component - see memoized version below
function TableBody({ table }: { table: Table<typeof _features, Person> }) {
  return (
    <div className="tbody">
      {table.getRowModel().rows.map((row) => (
        <div key={row.id} className="tr">
          {row.getAllCells().map((cell) => {
            // simulate expensive render
            for (const _ of Array(10000)) {
              Math.random()
            }

            return (
              <div
                key={cell.id}
                className="td"
                style={{
                  width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                }}
              >
                {cell.renderValue<any>()}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// special memoized wrapper for our table body that we will use during column resizing
export const MemoizedTableBody = memo(
  TableBody,
  (prev, next) => prev.table.options.data === next.table.options.data,
)

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

render(<App />, rootElement)
