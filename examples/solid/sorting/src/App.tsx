import {
  createTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  createTableInstance,
} from '@tanstack/solid-table'
import { makeData, Person } from './makeData'
import { createSignal, For, Show } from 'solid-js'

const table = createTable().setRowType<Person>()

function App() {
  const [data, setData] = createSignal(makeData(100_000))
  const [sorting, setSorting] = createSignal<SortingState>([])
  const refreshData = () => setData(makeData(100_000))

  const columns = [
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

  const instance = createTableInstance(table, {
    get data() {
      return data()
    },
    columns,
    state: {
      get sorting() {
        return sorting()
      },
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  })

  return (
    <div class="p-2">
      <table>
        <thead>
          <For each={instance.getHeaderGroups()}>
            {headerGroup => (
              <tr>
                <For each={headerGroup.headers}>
                  {header => (
                    <th colSpan={header.colSpan}>
                      <Show when={!header.isPlaceholder}>
                        <div
                          class={
                            header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : undefined
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {header.renderHeader()}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </Show>
                    </th>
                  )}
                </For>
              </tr>
            )}
          </For>
        </thead>
        <tbody>
          <For each={instance.getRowModel().rows.slice(0, 10)}>
            {row => (
              <tr>
                <For each={row.getVisibleCells()}>
                  {cell => <td>{cell.renderCell()}</td>}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
      <div>{instance.getRowModel().rows.length} Rows</div>
      <div>
        <button onClick={() => refreshData()}>Refresh Data</button>
      </div>
      <pre>{JSON.stringify(sorting(), null, 2)}</pre>
    </div>
  )
}

export default App
