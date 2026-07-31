import { useLayoutEffect, useRef, useState } from 'octane'
import { createRoot } from 'octane'
import {
  columnResizingFeature,
  columnSizingFeature,
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/octane-table'
import { makeData } from './makeData'
import type { Table } from '@tanstack/octane-table'
import type { Person } from './makeData'
import './index.css'

/**
 * This example implements column resizing with NO Octane re-renders!
 * Instead, we subscribe to the table store OUTSIDE of Octane and write CSS variables
 */

const features = tableFeatures({ columnResizingFeature, columnSizingFeature })

const columnHelper = createColumnHelper<typeof features, Person>()

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

function App() @{
  const [data, setData] = useState(() => makeData(200))
  const refreshData = () => setData(makeData(200))
  const stressTest = () => setData(makeData(5_000))

  const table = useTable(
    {
      features,
      columns,
      data,
      defaultColumn: {
        minSize: 60,
        maxSize: 800,
      },
      columnResizeMode: 'onChange',
      // initialState: { columnSizing: { firstName: 200 } }, // set column sizes on first render
      // atoms: { columnResizing: columnResizingAtom }, // preferred: own transient resize state with an external atom
      // state: { columnResizing }, // classic controlled state; pair with onColumnResizingChange
      // onColumnResizingChange: setColumnResizing,
      // columnResizeDirection: 'rtl', // calculate resize offsets right-to-left; default 'ltr'
      // enableColumnResizing: false, // disable resizing for every column; default true
      debugTable: true,
      debugHeaders: true,
      debugColumns: true,
    },
    () => ({}), // subscribe to nothing instead of re-rendering on every internal state change
  )

  const tableRef = useRef<HTMLTableElement | null>(null)

  /**
   * Instead of re-rendering Octane on every resize tick, we subscribe to the
   * table store OUTSIDE of Octane and write the column size CSS variables
   * directly onto the <table> element. Header and data cells reference the
   * variables, so the browser updates widths with zero Octane work per tick.
   * (The core resize handler already coalesces pointer events to one state
   * update per animation frame.)
   */
  useLayoutEffect(() => {
    const writeColumnSizeVars = () => {
      const tableEl = tableRef.current
      if (!tableEl) return
      for (const header of table.getFlatHeaders()) {
        tableEl.style.setProperty(
          `--header-${header.id}-size`,
          String(header.getSize()),
        )
        tableEl.style.setProperty(
          `--col-${header.column.id}-size`,
          String(header.column.getSize()),
        )
      }
      tableEl.style.width = `${table.getTotalSize()}px`
    }
    writeColumnSizeVars() // initial paint
    const { unsubscribe } =
      table.atoms.columnSizing.subscribe(writeColumnSizeVars)
    return () => unsubscribe()
  }, [table.store])

  <div className="demo-root">
      <div>
        <button onClick={() => refreshData()} className="demo-button">
          Regenerate Data
        </button>
        <button onClick={() => stressTest()} className="demo-button">
          Stress Test (5k rows)
        </button>
      </div>
      <div className="spacer-md" />
      {/* Only this little island re-renders per resize tick */}
      <table.Subscribe selector={(state) => state}>
        {(state) => (
          <pre style={{ height: '10rem', overflow: 'auto' }}>
            {JSON.stringify(state, null, 2)}
          </pre>
        )}
      </table.Subscribe>
      <div className="spacer-md" />({data.length.toLocaleString()} rows)
      <div className="scroll-container">
        {/* This example is using semantic table tags, but also CSS Grid/Flexbox layout for more absolute column widths */}
        <table ref={tableRef} style={{ display: 'grid' }}>
          <thead style={{ display: 'grid' }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                style={{ display: 'flex', width: '100%', height: 30 }}
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      display: 'flex',
                      flexShrink: 0,
                      width: `calc(var(--header-${header.id}-size) * 1px)`, // use CSS variable so not dependent on Octane re-rendering
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                    {/* Each resizer subscribes to just its own "am I being
                        resized?" boolean, so a drag re-renders exactly one
                        of these islands at drag start and end */}
                    <table.Subscribe
                      selector={(state) =>
                        state.columnResizing.isResizingColumn ===
                        header.column.id
                      }
                    >
                      {(isResizing) => (
                        <div
                          onDoubleClick={() => header.column.resetSize()}
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`resizer ${isResizing ? 'isResizing' : ''}`}
                        />
                      )}
                    </table.Subscribe>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {/* No memoization needed: the root subscribes to no table state,
              so the body only re-renders when `data` itself changes */}
          <TableBody table={table} />
        </table>
      </div>
    </div>
}

interface TableBodyProps {
  table: Table<typeof features, Person>
}

function TableBody({ table }: TableBodyProps) @{
  <tbody style={{ display: 'grid' }}>
      {table.getRowModel().rows.map((row) => (
        <tr
          key={row.id}
          style={{
            display: 'flex',
            width: '100%',
            height: 30,
            // Offscreen rows skip style recalc and layout entirely, so a live
            // column resize only lays out the rows actually on screen.
            contentVisibility: 'auto',
            containIntrinsicHeight: 'auto 30px',
          }}
        >
          {row.getAllCells().map((cell) => {
            return (
              <td
                key={cell.id}
                style={{
                  display: 'flex',
                  flexShrink: 0,
                  width: `calc(var(--col-${cell.column.id}-size) * 1px)`, // use CSS variable so not dependent on Octane re-rendering
                }}
              >
                {cell.renderValue<any>()}
              </td>
            )
          })}
        </tr>
      ))}
    </tbody>
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

createRoot(rootElement).render(App)
