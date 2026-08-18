import { For, Show, createSignal } from 'solid-js'
import { FlexRender, createTable, tableFeatures } from '@tanstack/solid-table'
import { makeData } from './makeData'
import type { ColumnDef } from '@tanstack/solid-table'
import type { Person } from './makeData'

const features = tableFeatures({})

// A traditional header group setup: every leaf column sits under a top-level
// group, so the tree is even (2 header rows) and no placeholder headers are
// created.
const basicColumns: Array<ColumnDef<typeof features, Person>> = [
  {
    header: 'Name',
    columns: [
      {
        accessorKey: 'firstName',
        header: 'First Name',
        footer: 'First Name',
      },
      {
        accessorFn: (row) => row.lastName,
        id: 'lastName',
        header: 'Last Name',
        footer: 'Last Name',
      },
    ],
  },
  {
    header: 'Stats',
    columns: [
      {
        accessorKey: 'age',
        header: 'Age',
        footer: 'Age',
      },
      {
        accessorKey: 'visits',
        header: 'Visits',
        footer: 'Visits',
      },
    ],
  },
  {
    header: 'Profile',
    columns: [
      {
        accessorKey: 'status',
        header: 'Status',
        footer: 'Status',
      },
      {
        accessorKey: 'progress',
        header: 'Profile Progress',
        footer: 'Profile Progress',
      },
    ],
  },
]

// Groups nested inside groups, with every leaf column at the same depth. The
// tree stays even, so there are three header rows and still no placeholders,
// and each group's colSpan is the sum of its descendants.
const nestedColumns: Array<ColumnDef<typeof features, Person>> = [
  {
    header: 'Person',
    columns: [
      {
        header: 'Name',
        columns: [
          { accessorKey: 'firstName', header: 'First Name' },
          {
            accessorFn: (row) => row.lastName,
            id: 'lastName',
            header: 'Last Name',
          },
        ],
      },
      {
        header: 'Demographics',
        columns: [{ accessorKey: 'age', header: 'Age' }],
      },
    ],
  },
  {
    header: 'Activity',
    columns: [
      {
        header: 'Engagement',
        columns: [
          { accessorKey: 'visits', header: 'Visits' },
          { accessorKey: 'status', header: 'Status' },
        ],
      },
      {
        header: 'Progress',
        columns: [{ accessorKey: 'progress', header: 'Profile Progress' }],
      },
    ],
  },
]

const defaultColumns: Array<ColumnDef<typeof features, Person>> = [
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

// An uneven column tree: `fullName` and `progress` are top-level leaf columns
// while their siblings nest two and three levels deep. The placeholder at the
// top of each column's placeholder chain carries the chain's full
// `header.rowSpan`, and the headers it covers report a rowSpan of 0 so the
// renderer can skip them.
const unevenColumns: Array<ColumnDef<typeof features, Person>> = [
  {
    accessorFn: (row) =>
      [row.firstName, row.lastName].filter(Boolean).join(' '),
    id: 'fullName',
    header: 'Full Name',
    cell: (info) => info.getValue(),
  },
  {
    header: 'Info',
    columns: [
      {
        accessorKey: 'age',
        header: () => 'Age',
      },
      {
        header: 'More Info',
        columns: [
          {
            accessorKey: 'visits',
            header: () => <span>Visits</span>,
          },
          {
            accessorKey: 'status',
            header: 'Status',
          },
        ],
      },
    ],
  },
  {
    accessorKey: 'progress',
    header: 'Profile Progress',
  },
]

function App() {
  const [data, setData] = createSignal(makeData(5))
  const refreshData = () => setData(makeData(5))
  const stressTest = () => setData(makeData(1_000))

  const basicTable = createTable({
    debugTable: true,
    features,
    get data() {
      return data()
    },
    columns: basicColumns,
  })

  const nestedTable = createTable({
    debugTable: true,
    features,
    get data() {
      return data()
    },
    columns: nestedColumns,
  })

  const table = createTable({
    debugTable: true,
    features,
    get data() {
      return data()
    },
    columns: defaultColumns,
  })

  const unevenTable = createTable({
    debugTable: true,
    features,
    get data() {
      return data()
    },
    columns: unevenColumns,
  })

  return (
    <div class="demo-root">
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (1k rows)</button>
      </div>
      <div class="spacer-md" />
      {/* The panels wrap into a grid whenever the viewport is wide enough. */}
      <div class="example-grid">
        <section class="example-panel">
          <h2 class="section-title">Basic Header Groups</h2>
          <table>
            <thead>
              <For each={basicTable.getHeaderGroups()}>
                {(headerGroup) => (
                  <tr>
                    <For each={headerGroup.headers}>
                      {(header) => (
                        <th colSpan={header.colSpan}>
                          <FlexRender header={header} />
                        </th>
                      )}
                    </For>
                  </tr>
                )}
              </For>
            </thead>
            <tbody>
              <For each={basicTable.getRowModel().rows}>
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
            <tfoot>
              <For
                each={basicTable
                  .getFooterGroups()
                  // Only the leaf columns declare footers, so skip the group
                  // row instead of rendering a blank one.
                  .filter((footerGroup) =>
                    footerGroup.headers.some(
                      (header) =>
                        !header.isPlaceholder && header.column.columnDef.footer,
                    ),
                  )}
              >
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
        </section>

        <section class="example-panel">
          <h2 class="section-title">Nested Header Groups</h2>
          <table>
            <thead>
              <For each={nestedTable.getHeaderGroups()}>
                {(headerGroup) => (
                  <tr>
                    <For each={headerGroup.headers}>
                      {(header) => (
                        <th colSpan={header.colSpan}>
                          <FlexRender header={header} />
                        </th>
                      )}
                    </For>
                  </tr>
                )}
              </For>
            </thead>
            <tbody>
              <For each={nestedTable.getRowModel().rows}>
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
        </section>

        <section class="example-panel">
          <h2 class="section-title">Placeholder Headers</h2>
          <table>
            <thead>
              <For each={table.getHeaderGroups()}>
                {(headerGroup) => (
                  <tr>
                    <For each={headerGroup.headers}>
                      {(header) => (
                        <th colSpan={header.colSpan}>
                          {header.isPlaceholder ? null : (
                            <FlexRender header={header} />
                          )}
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
                          {header.isPlaceholder ? null : (
                            <FlexRender footer={header} />
                          )}
                        </th>
                      )}
                    </For>
                  </tr>
                )}
              </For>
            </tfoot>
          </table>
        </section>

        <section class="example-panel">
          <h2 class="section-title">Header Row Spanning</h2>
          <table>
            <thead>
              <For each={unevenTable.getHeaderGroups()}>
                {(headerGroup) => (
                  <tr>
                    <For each={headerGroup.headers}>
                      {(header) => (
                        <Show when={header.rowSpan !== 0}>
                          <th colSpan={header.colSpan} rowSpan={header.rowSpan}>
                            <FlexRender header={header} />
                          </th>
                        </Show>
                      )}
                    </For>
                  </tr>
                )}
              </For>
            </thead>
            <tbody>
              <For each={unevenTable.getRowModel().rows}>
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
        </section>
      </div>
    </div>
  )
}

export default App
