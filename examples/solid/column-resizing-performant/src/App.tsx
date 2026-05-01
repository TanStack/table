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

const _features = tableFeatures({ columnSizingFeature, columnResizingFeature })

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
  const [data, setData] = createSignal(makeData(200))
  const refreshData = () => setData(makeData(200))
  const stressTest = () => setData(makeData(2_000))

  const table = createTable(
    {
      _features,
      _rowModels: {},
      columns,
      get data() {
        return data()
      },
      defaultColumn: { minSize: 60, maxSize: 800 },
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

  const columnSizeVars = createMemo(() => {
    const headers = table.getFlatHeaders()
    const colSizes: Record<string, number> = {}
    for (const header of headers) {
      colSizes[`--header-${header.id}-size`] = header.getSize()
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
    }
    return colSizes
  })

  return (
    <div class="demo-root">
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (2k rows)</button>
      </div>
      <i>
        This example has artificially slow cell renders to simulate complex
        usage
      </i>
      <div class="spacer-md" />
      <pre style={{ 'min-height': '10rem' }}>
        {JSON.stringify(table.store.state, null, 2)}
      </pre>
      <div class="spacer-md" />({data().length.toLocaleString()} rows)
      <div class="scroll-container">
        <div
          class="divTable"
          style={{
            ...columnSizeVars(),
            width: `${table.getTotalSize()}px`,
          }}
        >
          <div class="thead">
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <div class="tr">
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <div
                        class="th"
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
                          class={`resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`}
                        />
                      </div>
                    )}
                  </For>
                </div>
              )}
            </For>
          </div>
          <TableBody table={table} />
        </div>
      </div>
    </div>
  )
}

function TableBody({
  table,
}: {
  table: SolidTableType<typeof _features, Person>
}) {
  return (
    <div class="tbody">
      <For each={table.getRowModel().rows}>
        {(row) => (
          <div class="tr">
            <For each={row.getAllCells()}>
              {(cell) => {
                // simulate expensive render
                for (const _ of Array.from({ length: 10000 })) {
                  Math.random()
                }
                return (
                  <div
                    class="td"
                    style={{
                      width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                    }}
                  >
                    {cell.renderValue<any>()}
                  </div>
                )
              }}
            </For>
          </div>
        )}
      </For>
    </div>
  )
}

export default App
