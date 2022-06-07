import { createSignal, For, Show } from 'solid-js'
import { makeData, Person } from './makeData'
import faker from '@faker-js/faker'
import {
  createTable,
  getCoreRowModel,
  createTableInstance,
  ColumnOrderState,
  VisibilityState,
} from '@tanstack/solid-table'

const table = createTable().setRowType<Person>()

const defaultColumns = [
  table.createGroup({
    header: 'Name',
    footer: props => props.column.id,
    columns: [
      table.createDataColumn('firstName', {
        cell: info => info.getValue(),
        footer: props => props.column.id,
      }),
      table.createDataColumn(row => row.lastName, {
        id: 'lastName',
        cell: info => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: props => props.column.id,
      }),
    ],
  }),
  table.createGroup({
    header: 'Info',
    footer: props => props.column.id,
    columns: [
      table.createDataColumn('age', {
        header: () => 'Age',
        footer: props => props.column.id,
      }),
      table.createGroup({
        header: 'More Info',
        columns: [
          table.createDataColumn('visits', {
            header: () => <span>Visits</span>,
            footer: props => props.column.id,
          }),
          table.createDataColumn('status', {
            header: 'Status',
            footer: props => props.column.id,
          }),
          table.createDataColumn('progress', {
            header: 'Profile Progress',
            footer: props => props.column.id,
          }),
        ],
      }),
    ],
  }),
]

function App() {
  const [data, setData] = createSignal(makeData(20))
  const [columnOrder, setColumnOrder] = createSignal<ColumnOrderState>([])
  const [columnVisibility, setColumnVisibility] = createSignal<VisibilityState>(
    {}
  )
  const rerender = () => setData(() => makeData(20))

  const instance = createTableInstance(table, {
    get data() {
      return data()
    },
    columns: defaultColumns,
    state: {
      get columnOrder() {
        return columnOrder()
      },
      get columnVisibility() {
        return columnVisibility()
      },
    },
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  })

  const randomizeColumns = () => {
    instance.setColumnOrder(
      faker.helpers.shuffle(instance.getAllLeafColumns().map(d => d.id))
    )
  }

  return (
    <div class="p-2">
      <div class="inline-block border border-black shadow rounded">
        <div class="px-1 border-b border-black">
          <label>
            <input
              checked={instance.getIsAllColumnsVisible()}
              onChange={instance.getToggleAllColumnsVisibilityHandler()}
              type="checkbox"
            />{' '}
            Toggle All
          </label>
        </div>
        <For each={instance.getAllLeafColumns()}>
          {column => (
            <div class="px-1">
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
      <div class="h-4" />
      <div class="flex flex-wrap gap-2">
        <button onClick={() => rerender()} class="border p-1">
          Regenerate
        </button>
        <button onClick={() => randomizeColumns()} class="border p-1">
          Shuffle Columns
        </button>
      </div>
      <div class="h-4" />
      <table>
        <thead>
          <For each={instance.getHeaderGroups()}>
            {headerGroup => (
              <tr>
                <For each={headerGroup.headers}>
                  {header => (
                    <th colSpan={header.colSpan}>
                      <Show when={!header.isPlaceholder}>
                        {header.renderHeader()}
                      </Show>
                    </th>
                  )}
                </For>
              </tr>
            )}
          </For>
        </thead>
        <tbody>
          <For each={instance.getRowModel().rows}>
            {row => (
              <tr>
                <For each={row.getVisibleCells()}>
                  {cell => <td>{cell.renderCell()}</td>}
                </For>
              </tr>
            )}
          </For>
        </tbody>
        <tfoot>
          <For each={instance.getFooterGroups()}>
            {footerGroup => (
              <tr>
                <For each={footerGroup.headers}>
                  {header => (
                    <th colSpan={header.colSpan}>
                      <Show when={!header.isPlaceholder}>
                        {header.renderFooter()}
                      </Show>
                    </th>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tfoot>
      </table>
      <div class="h-4" />
      <pre>{JSON.stringify(instance.getState().columnOrder, null, 2)}</pre>
    </div>
  )
}

export default App
