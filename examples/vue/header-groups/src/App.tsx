import { defineComponent, ref } from 'vue'
import { FlexRender, tableFeatures, useTable } from '@tanstack/vue-table'
import { makeData } from './makeData'
import type {
  Cell,
  ColumnDef,
  Header,
  HeaderGroup,
  Row,
} from '@tanstack/vue-table'
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

const columns: Array<ColumnDef<typeof features, Person>> = [
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

export default defineComponent({
  name: 'HeaderGroupsExample',
  setup() {
    const data = ref(makeData(5))

    const refreshData = () => {
      data.value = makeData(5)
    }

    const stressTest = () => {
      data.value = makeData(1_000)
    }

    const tableOptions = (
      tableColumns: Array<ColumnDef<typeof features, Person>>,
    ) => ({
      debugTable: true,
      features,
      columns: tableColumns,
      get data() {
        return data.value
      },
    })

    const basicTable = useTable(tableOptions(basicColumns))
    const nestedTable = useTable(tableOptions(nestedColumns))
    const table = useTable(tableOptions(columns))
    const unevenTable = useTable(tableOptions(unevenColumns))

    const renderBody = (
      bodyTable:
        | typeof basicTable
        | typeof nestedTable
        | typeof table
        | typeof unevenTable,
    ) => (
      <tbody>
        {bodyTable
          .getRowModel()
          .rows.map((row: Row<typeof features, Person>) => (
            <tr key={row.id}>
              {row
                .getAllCells()
                .map((cell: Cell<typeof features, Person, unknown>) => (
                  <td key={cell.id}>
                    <FlexRender cell={cell} />
                  </td>
                ))}
            </tr>
          ))}
      </tbody>
    )

    return () => (
      <div class="demo-root">
        <div class="button-row">
          <button class="demo-button" onClick={refreshData}>
            Regenerate Data
          </button>
          <button class="demo-button" onClick={stressTest}>
            Stress Test (1k rows)
          </button>
        </div>
        <div class="spacer-md" />
        {/* The panels wrap into a grid whenever the viewport is wide enough. */}
        <div class="example-grid">
          <section class="example-panel">
            <h2 class="section-title">Basic Header Groups</h2>
            <table>
              <thead>
                {basicTable
                  .getHeaderGroups()
                  .map((headerGroup: HeaderGroup<typeof features, Person>) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(
                        (header: Header<typeof features, Person, unknown>) => (
                          <th key={header.id} colspan={header.colSpan}>
                            <FlexRender header={header} />
                          </th>
                        ),
                      )}
                    </tr>
                  ))}
              </thead>
              {renderBody(basicTable)}
              <tfoot>
                {basicTable
                  .getFooterGroups()
                  // Only the leaf columns declare footers, so skip the group
                  // row instead of rendering a blank one.
                  .filter((footerGroup: HeaderGroup<typeof features, Person>) =>
                    footerGroup.headers.some(
                      (header: Header<typeof features, Person, unknown>) =>
                        !header.isPlaceholder && header.column.columnDef.footer,
                    ),
                  )
                  .map((footerGroup: HeaderGroup<typeof features, Person>) => (
                    <tr key={footerGroup.id}>
                      {footerGroup.headers.map(
                        (header: Header<typeof features, Person, unknown>) => (
                          <th key={header.id} colspan={header.colSpan}>
                            {header.isPlaceholder ? null : (
                              <FlexRender footer={header} />
                            )}
                          </th>
                        ),
                      )}
                    </tr>
                  ))}
              </tfoot>
            </table>
          </section>

          <section class="example-panel">
            <h2 class="section-title">Nested Header Groups</h2>
            <table>
              <thead>
                {nestedTable
                  .getHeaderGroups()
                  .map((headerGroup: HeaderGroup<typeof features, Person>) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(
                        (header: Header<typeof features, Person, unknown>) => (
                          <th key={header.id} colspan={header.colSpan}>
                            <FlexRender header={header} />
                          </th>
                        ),
                      )}
                    </tr>
                  ))}
              </thead>
              {renderBody(nestedTable)}
            </table>
          </section>

          <section class="example-panel">
            <h2 class="section-title">Placeholder Headers</h2>
            <table>
              <thead>
                {table
                  .getHeaderGroups()
                  .map((headerGroup: HeaderGroup<typeof features, Person>) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(
                        (header: Header<typeof features, Person, unknown>) => (
                          <th key={header.id} colspan={header.colSpan}>
                            {header.isPlaceholder ? null : (
                              <FlexRender header={header} />
                            )}
                          </th>
                        ),
                      )}
                    </tr>
                  ))}
              </thead>
              {renderBody(table)}
              <tfoot>
                {table
                  .getFooterGroups()
                  .map((footerGroup: HeaderGroup<typeof features, Person>) => (
                    <tr key={footerGroup.id}>
                      {footerGroup.headers.map(
                        (header: Header<typeof features, Person, unknown>) => (
                          <th key={header.id} colspan={header.colSpan}>
                            {header.isPlaceholder ? null : (
                              <FlexRender footer={header} />
                            )}
                          </th>
                        ),
                      )}
                    </tr>
                  ))}
              </tfoot>
            </table>
          </section>

          <section class="example-panel">
            <h2 class="section-title">Header Row Spanning</h2>
            <table>
              <thead>
                {unevenTable
                  .getHeaderGroups()
                  .map((headerGroup: HeaderGroup<typeof features, Person>) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(
                        (header: Header<typeof features, Person, unknown>) =>
                          header.rowSpan === 0 ? null : (
                            <th
                              key={header.id}
                              colspan={header.colSpan}
                              rowspan={header.rowSpan}
                            >
                              <FlexRender header={header} />
                            </th>
                          ),
                      )}
                    </tr>
                  ))}
              </thead>
              {renderBody(unevenTable)}
            </table>
          </section>
        </div>
      </div>
    )
  },
})
