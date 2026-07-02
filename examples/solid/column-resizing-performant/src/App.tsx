import {
  columnResizingFeature,
  columnSizingFeature,
  createColumnHelper,
  createTable,
  tableFeatures,
} from '@tanstack/solid-table'
import { For, createMemo, createSignal } from 'solid-js'
import { makeData } from './makeData'
import type { Table as SolidTableType } from '@tanstack/solid-table'
import type { Person } from './makeData'

/**
 * This example implements column resizing with fine-grained reactivity!
 * Solid only re-runs the single style binding that reads the CSS variable
 * memo, so a resize tick never re-renders any component
 */

const features = tableFeatures({ columnSizingFeature, columnResizingFeature })

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

function App() {
  const [data, setData] = createSignal(makeData(200))
  const refreshData = () => setData(makeData(200))
  const stressTest = () => setData(makeData(5_000))

  const table = createTable({
    features,
    columns,
    get data() {
      return data()
    },
    defaultColumn: { minSize: 60, maxSize: 800 },
    columnResizeMode: 'onChange',
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  })

  /**
   * All column widths flow through CSS variables computed in ONE memo and
   * bound to the <table> element's style. `header.getSize()` reads the
   * signal-backed columnSizing atom, so a resize tick re-runs only this memo
   * and its single style binding; header and data cells reference the
   * variables and never re-render.
   */
  const tableStyle = createMemo(() => {
    const styles: Record<string, string> = { display: 'grid' }
    for (const header of table.getFlatHeaders()) {
      styles[`--header-${header.id}-size`] = `${header.getSize()}`
      styles[`--col-${header.column.id}-size`] = `${header.column.getSize()}`
    }
    styles.width = `${table.getTotalSize()}px`
    return styles
  })

  return (
    <div class="demo-root">
      <div>
        <button onClick={() => refreshData()} class="demo-button">
          Regenerate Data
        </button>
        <button onClick={() => stressTest()} class="demo-button">
          Stress Test (5k rows)
        </button>
      </div>
      <div class="spacer-md" />
      {/* Only this text node updates per resize tick */}
      <pre style={{ height: '10rem', overflow: 'auto' }}>
        {JSON.stringify(table.store.get(), null, 2)}
      </pre>
      <div class="spacer-md" />({data().length.toLocaleString()} rows)
      <div class="scroll-container">
        {/* This example is using semantic table tags, but also CSS Grid/Flexbox layout for more absolute column widths */}
        <table style={tableStyle()}>
          <thead style={{ display: 'grid' }}>
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <tr
                  style={{
                    display: 'flex',
                    width: '100%',
                    height: '30px',
                  }}
                >
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <th
                        colspan={header.colSpan}
                        style={{
                          display: 'flex',
                          'flex-shrink': '0',
                          width: `calc(var(--header-${header.id}-size) * 1px)`, // use CSS variable so only the table style binding updates
                        }}
                      >
                        {header.isPlaceholder ? null : (
                          <table.FlexRender header={header} />
                        )}
                        {/* This class binding is its own fine-grained effect,
                            so a drag updates exactly one resizer's class */}
                        <div
                          onDblClick={() => header.column.resetSize()}
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          class={`resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`}
                        />
                      </th>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </thead>
          {/* No memoization needed: Solid components run once, and nothing in
              the body reads resize state */}
          <TableBody table={table} />
        </table>
      </div>
    </div>
  )
}

function TableBody({
  table,
}: {
  table: SolidTableType<typeof features, Person>
}) {
  return (
    <tbody style={{ display: 'grid' }}>
      <For each={table.getRowModel().rows}>
        {(row) => (
          <tr
            style={{
              display: 'flex',
              width: '100%',
              height: '30px',
              // Offscreen rows skip style recalc and layout entirely, so a
              // live column resize only lays out the rows actually on screen.
              'content-visibility': 'auto',
              'contain-intrinsic-height': 'auto 30px',
            }}
          >
            <For each={row.getAllCells()}>
              {(cell) => (
                <td
                  style={{
                    display: 'flex',
                    'flex-shrink': '0',
                    width: `calc(var(--col-${cell.column.id}-size) * 1px)`, // use CSS variable so only the table style binding updates
                  }}
                >
                  {cell.renderValue<any>()}
                </td>
              )}
            </For>
          </tr>
        )}
      </For>
    </tbody>
  )
}

export default App
