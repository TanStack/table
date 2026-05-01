import {
  columnSizingFeature,
  createColumnHelper,
  createTable,
  tableFeatures,
} from '@tanstack/solid-table'
import { For, createSignal } from 'solid-js'
import { makeData } from './makeData'
import type { Person } from './makeData'

const _features = tableFeatures({ columnSizingFeature })

const columnHelper = createColumnHelper<typeof _features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
    size: 120,
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
])

function App() {
  const [data, setData] = createSignal(makeData(20))
  const refreshData = () => setData(makeData(20))
  const stressTest = () => setData(makeData(1_000))

  const table = createTable(
    {
      _features,
      _rowModels: {},
      columns,
      get data() {
        return data()
      },
      debugTable: true,
      debugHeaders: true,
      debugColumns: true,
    },
    (state) => state,
  )

  return (
    <div class="demo-root">
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (1k rows)</button>
      </div>
      <div class="spacer-md" />
      <div class="button-row">
        <div class="section-title">{'Initial Column Sizes'}</div>
        <br />
        <For each={table.getAllColumns()}>
          {(column) => (
            <div>
              <label>
                {column.id}
                <input
                  type="number"
                  value={column.getSize()}
                  onInput={(e) => {
                    table.setColumnSizing({
                      ...table.store.state.columnSizing,
                      [column.id]: Number(e.currentTarget.value),
                    })
                  }}
                  class="column-size-input"
                />
              </label>
            </div>
          )}
        </For>
      </div>
      <div class="controls" />
      <div class="spacer-md" />
      <div class="section-title">{'<table/>'}</div>
      <div class="scroll-container">
        <table
          style={{
            width: `${table.getCenterTotalSize()}px`,
          }}
        >
          <thead>
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <tr>
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <th
                        colSpan={header.colSpan}
                        style={{ width: `${header.getSize()}px` }}
                      >
                        {header.isPlaceholder ? null : (
                          <table.FlexRender header={header} />
                        )}
                        <div />
                      </th>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </thead>
          <tbody>
            <For each={table.getRowModel().rows}>
              {(row) => (
                <tr>
                  <For each={row.getAllCells()}>
                    {(cell) => (
                      <td style={{ width: `${cell.column.getSize()}px` }}>
                        <table.FlexRender cell={cell} />
                      </td>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
      <div class="spacer-md" />
      <div class="section-title">{'<div/> (relative)'}</div>
      <div class="scroll-container">
        <div class="divTable" style={{ width: `${table.getTotalSize()}px` }}>
          <div class="thead">
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <div class="tr">
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <div
                        class="th"
                        style={{ width: `${header.getSize()}px` }}
                      >
                        {header.isPlaceholder ? null : (
                          <table.FlexRender header={header} />
                        )}
                        <div />
                      </div>
                    )}
                  </For>
                </div>
              )}
            </For>
          </div>
          <div class="tbody">
            <For each={table.getRowModel().rows}>
              {(row) => (
                <div class="tr">
                  <For each={row.getAllCells()}>
                    {(cell) => (
                      <div
                        class="td"
                        style={{ width: `${cell.column.getSize()}px` }}
                      >
                        <table.FlexRender cell={cell} />
                      </div>
                    )}
                  </For>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
      <div class="spacer-md" />
      <div class="section-title">{'<div/> (absolute positioning)'}</div>
      <div class="scroll-container">
        <div class="divTable" style={{ width: `${table.getTotalSize()}px` }}>
          <div class="thead">
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <div class="tr" style={{ position: 'relative' }}>
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <div
                        class="th"
                        style={{
                          position: 'absolute',
                          left: `${header.getStart()}px`,
                          width: `${header.getSize()}px`,
                        }}
                      >
                        {header.isPlaceholder ? null : (
                          <table.FlexRender header={header} />
                        )}
                        <div />
                      </div>
                    )}
                  </For>
                </div>
              )}
            </For>
          </div>
          <div class="tbody">
            <For each={table.getRowModel().rows}>
              {(row) => (
                <div class="tr" style={{ position: 'relative' }}>
                  <For each={row.getAllCells()}>
                    {(cell) => (
                      <div
                        class="td"
                        style={{
                          position: 'absolute',
                          left: `${cell.column.getStart()}px`,
                          width: `${cell.column.getSize()}px`,
                        }}
                      >
                        <table.FlexRender cell={cell} />
                      </div>
                    )}
                  </For>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
      <div class="spacer-md" />
      <pre>{JSON.stringify(table.store.state, null, 2)}</pre>
    </div>
  )
}

export default App
