import {
  createTable,
  getCoreRowModel,
  createTable,
  VisibilityState,
} from '@tanstack/solid-table'
import { createSignal, For, Show } from 'solid-js'

type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const table = createTable().setRowType<Person>()

const defaultData: Person[] = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
]

const defaultColumns: ColumnDef<Person>[] = [
  {
    header: 'Name',
    footer: props => props.column.id,
    columns: [
      {
        accessorKey: 'firstName',
        cell: info => info.getValue(),
        footer: props => props.column.id,
      },
      {
        accessorFn: row => row.lastName,
        id: 'lastName',
        cell: info => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: props => props.column.id,
      },
    ],
  },
  {
    header: 'Info',
    footer: props => props.column.id,
    columns: [
      {
        accessorKey: 'age',
        header: () => 'Age',
        footer: props => props.column.id,
      },
      {
        header: 'More Info',
        columns: [
          {
            accessorKey: 'visits',
            header: () => <span>Visits</span>,
            footer: props => props.column.id,
          },
          {
            accessorKey: 'status',
            header: 'Status',
            footer: props => props.column.id,
          },
          {
            accessorKey: 'progress',
            header: 'Profile Progress',
            footer: props => props.column.id,
          },
        ],
      },
    ],
  },
]

function App() {
  const [data, setData] = createSignal(defaultData)
  const [columnVisibility, setColumnVisibility] = createSignal<VisibilityState>(
    {}
  )
  const rerender = () => setData(defaultData)

  const instance = createTable(table, {
    get data() {
      return data()
    },
    columns: defaultColumns,
    state: {
      get columnVisibility() {
        return columnVisibility()
      },
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  })

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
      <button onClick={() => rerender()} class="border p-2">
        Rerender
      </button>
      <div class="h-4" />
      <pre>{JSON.stringify(instance.getState().columnVisibility, null, 2)}</pre>
    </div>
  )
}

export default App
