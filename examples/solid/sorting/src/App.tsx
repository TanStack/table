import {
  FlexRender,
  createSortedRowModel,
  createTable,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/solid-table'
import { For, Show, createSignal } from 'solid-js'
import { makeData } from './makeData'
import type { ColumnDef } from '@tanstack/solid-table'
import type { Person } from './makeData'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

function App() {
  const [data, setData] = createSignal(makeData(1_000))
  const refreshData = () => setData(makeData(1_000))
  const stressTest = () => setData(makeData(1_000_000))

  const columns: Array<ColumnDef<typeof features, Person>> = [
    {
      id: 'rowNumber',
      header: '#',
      cell: ({ row }) => row.getDisplayIndex() + 1,
    },
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
        {
          accessorKey: 'email',
          header: 'Email',
          sortFn: 'alphanumeric',
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

  const table = createTable({
    features,
    get data() {
      return data()
    },
    columns,
    // initialState: { sorting: [{ id: 'firstName', desc: false }] }, // set the initial sort once
    // atoms: { sorting: sortingAtom }, // preferred: own sorting state with an external atom
    // state: { sorting }, // classic controlled state; pair with onSortingChange
    // onSortingChange: setSorting,
    // enableSorting: false, // disable sorting for every column; default true
    // sortDescFirst: true, // start every sort cycle with descending order; inferred by column data by default
    // enableSortingRemoval: false, // keep a sorted column sorted when toggling; default true
    // enableMultiSort: false, // disable Shift-click multi-sorting; default true
    // enableMultiRemove: false, // prevent a multi-sort toggle from removing a sorted column; default true
    // isMultiSortEvent: () => true, // make every sort interaction a multi-sort; default requires Shift
    // maxMultiSortColCount: 3, // limit multi-sorting to three columns; default Infinity
    // manualSorting: true, // pass data that is already sorted, for example from a server
    // autoResetPageIndex: false, // with pagination, keep the current page when sorting changes; default true
    debugTable: true,
  })

  return (
    <div class="demo-root">
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (1M rows)</button>
      </div>
      <table>
        <thead>
          <For each={table.getHeaderGroups()}>
            {(headerGroup) => (
              <tr>
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th colSpan={header.colSpan}>
                      <Show when={!header.isPlaceholder}>
                        <div
                          class={
                            header.column.getCanSort()
                              ? 'sortable-header'
                              : undefined
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <FlexRender header={header} />
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
          <For each={table.getRowModel().rows.slice(0, 10)}>
            {(row) => (
              <tr>
                <For each={row.getAllCells()}>
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
      </table>
      <div>{table.getRowModel().rows.length.toLocaleString()} Rows</div>
      <pre>{JSON.stringify(table.store.get(), null, 2)}</pre>
    </div>
  )
}

export default App
