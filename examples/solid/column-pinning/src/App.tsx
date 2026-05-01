import { faker } from '@faker-js/faker'
import {
  columnOrderingFeature,
  columnPinningFeature,
  columnVisibilityFeature,
  createTableHook,
} from '@tanstack/solid-table'
import { For, createSignal } from 'solid-js'
import { makeData } from './makeData'
import type { Person } from './makeData'

const { createAppTable, createAppColumnHelper } = createTableHook({
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

const columnHelper = createAppColumnHelper<Person>()

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
  const [data, setData] = createSignal(makeData(1_000))
  const refreshData = () => setData(makeData(1_000))
  const stressTest = () => setData(makeData(500_000))

  const table = createAppTable({
    debugTable: true,
    columns,
    get data() {
      return data()
    },
  })

  const randomizeColumns = () => {
    table.setColumnOrder(
      faker.helpers.shuffle(table.getAllLeafColumns().map((d) => d.id)),
    )
  }

  return (
    <div class="demo-root">
      <div class="column-toggle-panel">
        <div class="column-toggle-panel-header">
          <label>
            <input
              type="checkbox"
              checked={table.getIsAllColumnsVisible()}
              onChange={table.getToggleAllColumnsVisibilityHandler()}
            />{' '}
            Toggle All
          </label>
        </div>
        <For each={table.getAllLeafColumns()}>
          {(column) => (
            <div class="column-toggle-row">
              <label>
                <input
                  type="checkbox"
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                />{' '}
                {column.id}
              </label>
            </div>
          )}
        </For>
      </div>
      <div class="spacer-md" />
      <div class="button-row">
        <button
          onClick={() => refreshData()}
          class="demo-button demo-button-sm"
        >
          Regenerate Data
        </button>
        <button onClick={() => stressTest()} class="demo-button demo-button-sm">
          Stress Test (500k rows)
        </button>
        <button
          onClick={() => randomizeColumns()}
          class="demo-button demo-button-sm"
        >
          Shuffle Columns
        </button>
      </div>
      <div class="spacer-md" />
      <p class="demo-note">
        This example using the non-split APIs. Columns are just reordered within
        1 table instead of being split into 3 different tables.
      </p>
      <div class="table-row-group">
        <table class="outlined-table">
          <thead>
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <tr>
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <th colSpan={header.colSpan}>
                        <div class="nowrap">
                          {header.isPlaceholder ? null : (
                            <table.FlexRender header={header} />
                          )}
                        </div>
                        {!header.isPlaceholder && header.column.getCanPin() && (
                          <div class="pin-actions">
                            {header.column.getIsPinned() !== 'left' ? (
                              <button
                                class="pin-button"
                                onClick={() => header.column.pin('left')}
                              >
                                {'<='}
                              </button>
                            ) : null}
                            {header.column.getIsPinned() ? (
                              <button
                                class="pin-button"
                                onClick={() => header.column.pin(false)}
                              >
                                X
                              </button>
                            ) : null}
                            {header.column.getIsPinned() !== 'right' ? (
                              <button
                                class="pin-button"
                                onClick={() => header.column.pin('right')}
                              >
                                {'=>'}
                              </button>
                            ) : null}
                          </div>
                        )}
                      </th>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </thead>
          <tbody>
            <For each={table.getRowModel().rows.slice(0, 20)}>
              {(row) => (
                <tr>
                  <For each={row.getVisibleCells()}>
                    {(cell) => (
                      <td>
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
      <pre>{JSON.stringify(table.store.state, null, 2)}</pre>
    </div>
  )
}

export default App
