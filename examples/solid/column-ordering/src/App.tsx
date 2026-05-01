import { For, Show, createSignal } from 'solid-js'
import { faker } from '@faker-js/faker'
import {
  FlexRender,
  columnOrderingFeature,
  columnVisibilityFeature,
  createTable,
  tableFeatures,
} from '@tanstack/solid-table'
import { makeData } from './makeData'
import type { Person } from './makeData'
import type { ColumnDef } from '@tanstack/solid-table'

const _features = tableFeatures({
  columnOrderingFeature,
  columnVisibilityFeature,
})

const defaultColumns: Array<ColumnDef<typeof _features, Person>> = [
  {
    header: 'Name',
    footer: (props) => props.column.id,
    columns: [
      {
        accessorKey: 'firstName',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.lastName,
        id: 'lastName',
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: (props) => props.column.id,
      },
    ],
  },
  {
    header: 'Info',
    footer: (props) => props.column.id,
    columns: [
      {
        accessorKey: 'age',
        header: () => 'Age',
        footer: (props) => props.column.id,
      },
      {
        header: 'More Info',
        columns: [
          {
            accessorKey: 'visits',
            header: () => <span>Visits</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorKey: 'status',
            header: 'Status',
            footer: (props) => props.column.id,
          },
          {
            accessorKey: 'progress',
            header: 'Profile Progress',
            footer: (props) => props.column.id,
          },
        ],
      },
    ],
  },
]

function App() {
  const [data, setData] = createSignal(makeData(20))
  const refreshData = () => setData(makeData(20))
  const stressTest = () => setData(makeData(1_000))

  const table = createTable({
    debugTable: true,
    _features,
    get data() {
      return data()
    },
    columns: defaultColumns,
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
              checked={table.getIsAllColumnsVisible()}
              onChange={table.getToggleAllColumnsVisibilityHandler()}
              type="checkbox"
            />{' '}
            Toggle All
          </label>
        </div>
        <For each={table.getAllLeafColumns()}>
          {(column) => (
            <div class="column-toggle-row">
              <label>
                <input
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                  type="checkbox"
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
          Stress Test (1k rows)
        </button>
        <button
          onClick={() => randomizeColumns()}
          class="demo-button demo-button-sm"
        >
          Shuffle Columns
        </button>
      </div>
      <div class="spacer-md" />
      <table>
        <thead>
          <For each={table.getHeaderGroups()}>
            {(headerGroup) => (
              <tr>
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th colSpan={header.colSpan}>
                      <Show when={!header.isPlaceholder}>
                        <FlexRender header={header} />
                      </Show>
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
                <For each={row.getVisibleCells()}>
                  {(cell) => (
                    <td>
                      <FlexRender cell={cell} />
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
        <tfoot>
          <For each={table.getFooterGroups()}>
            {(footerGroup) => (
              <tr>
                <For each={footerGroup.headers}>
                  {(header) => (
                    <th colSpan={header.colSpan}>
                      <Show when={!header.isPlaceholder}>
                        <FlexRender footer={header} />
                      </Show>
                    </th>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tfoot>
      </table>
      <div class="spacer-md" />
      <pre>{JSON.stringify(table.store.state, null, 2)}</pre>
    </div>
  )
}

export default App
