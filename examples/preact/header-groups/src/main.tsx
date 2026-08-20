import { useState } from 'preact/hooks'
import { render } from 'preact'
import './index.css'
import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/preact-table'
import { makeData } from './makeData'
import type { Person } from './makeData'

const features = tableFeatures({})

const columnHelper = createColumnHelper<typeof features, Person>()

// A traditional header group setup: every leaf column sits under a top-level
// group, so the tree is even (2 header rows) and no placeholder headers are
// created.
const basicColumns = columnHelper.columns([
  columnHelper.group({
    header: 'Name',
    columns: columnHelper.columns([
      columnHelper.accessor('firstName', {
        header: 'First Name',
        footer: 'First Name',
      }),
      columnHelper.accessor((row) => row.lastName, {
        id: 'lastName',
        header: 'Last Name',
        footer: 'Last Name',
      }),
    ]),
  }),
  columnHelper.group({
    header: 'Stats',
    columns: columnHelper.columns([
      columnHelper.accessor('age', {
        header: 'Age',
        footer: 'Age',
      }),
      columnHelper.accessor('visits', {
        header: 'Visits',
        footer: 'Visits',
      }),
    ]),
  }),
  columnHelper.group({
    header: 'Profile',
    columns: columnHelper.columns([
      columnHelper.accessor('status', {
        header: 'Status',
        footer: 'Status',
      }),
      columnHelper.accessor('progress', {
        header: 'Profile Progress',
        footer: 'Profile Progress',
      }),
    ]),
  }),
])

// Groups nested inside groups, with every leaf column at the same depth. The
// tree stays even, so there are three header rows and still no placeholders,
// and each group's colSpan is the sum of its descendants.
const nestedColumns = columnHelper.columns([
  columnHelper.group({
    header: 'Person',
    columns: columnHelper.columns([
      columnHelper.group({
        header: 'Name',
        columns: columnHelper.columns([
          columnHelper.accessor('firstName', {
            header: 'First Name',
          }),
          columnHelper.accessor((row) => row.lastName, {
            id: 'lastName',
            header: 'Last Name',
          }),
        ]),
      }),
      columnHelper.group({
        header: 'Demographics',
        columns: columnHelper.columns([
          columnHelper.accessor('age', {
            header: 'Age',
          }),
        ]),
      }),
    ]),
  }),
  columnHelper.group({
    header: 'Activity',
    columns: columnHelper.columns([
      columnHelper.group({
        header: 'Engagement',
        columns: columnHelper.columns([
          columnHelper.accessor('visits', {
            header: 'Visits',
          }),
          columnHelper.accessor('status', {
            header: 'Status',
          }),
        ]),
      }),
      columnHelper.group({
        header: 'Progress',
        columns: columnHelper.columns([
          columnHelper.accessor('progress', {
            header: 'Profile Progress',
          }),
        ]),
      }),
    ]),
  }),
])

// use new columnHelper.columns method to create columns with the same TValue generic so TypeScript doesn't complain when passing columns to useTable
const columns = columnHelper.columns([
  columnHelper.group({
    id: 'hello',
    header: () => <span>Hello</span>,
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

// An uneven column tree: `fullName` and `progress` are top-level leaf columns
// while their siblings nest two and three levels deep. The placeholder at the
// top of each column's placeholder chain carries the chain's full
// `header.rowSpan`, and the headers it covers report a rowSpan of 0 so the
// renderer can skip them.
const unevenColumns = columnHelper.columns([
  columnHelper.accessor(
    (row) => [row.firstName, row.lastName].filter(Boolean).join(' '),
    {
      id: 'fullName',
      header: 'Full Name',
      cell: (info) => info.getValue(),
    },
  ),
  columnHelper.group({
    header: 'Info',
    columns: columnHelper.columns([
      columnHelper.accessor('age', {
        header: () => 'Age',
      }),
      columnHelper.group({
        header: 'More Info',
        columns: columnHelper.columns([
          columnHelper.accessor('visits', {
            header: () => <span>Visits</span>,
          }),
          columnHelper.accessor('status', {
            header: 'Status',
          }),
        ]),
      }),
    ]),
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
  }),
])

function App() {
  const [data, setData] = useState(() => makeData(5))
  const refreshData = () => setData(makeData(5))
  const stressTest = () => setData(makeData(1_000))

  const basicTable = useTable(
    {
      debugTable: true,
      features,
      columns: basicColumns,
      data,
    },
    (state) => state, // default selector
  )

  const nestedTable = useTable(
    {
      debugTable: true,
      features,
      columns: nestedColumns,
      data,
    },
    (state) => state, // default selector
  )

  const table = useTable(
    {
      debugTable: true,
      features,
      columns,
      data,
    },
    (state) => state, // default selector
  )

  const unevenTable = useTable(
    {
      debugTable: true,
      features,
      columns: unevenColumns,
      data,
    },
    (state) => state, // default selector
  )

  return (
    <div className="demo-root">
      <div>
        <button onClick={() => refreshData()} className="demo-button">
          Regenerate Data
        </button>
        <button onClick={() => stressTest()} className="demo-button">
          Stress Test (1k rows)
        </button>
      </div>
      <div className="spacer-md" />
      {/* The panels wrap into a grid whenever the viewport is wide enough. */}
      <div className="example-grid">
        <section className="example-panel">
          <h2 className="section-title">Basic Header Groups</h2>
          <table>
            <thead>
              {basicTable.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} colSpan={header.colSpan}>
                      <basicTable.FlexRender header={header} />
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {basicTable.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <td key={cell.id}>
                      <basicTable.FlexRender cell={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              {basicTable
                .getFooterGroups()
                .filter((footerGroup) =>
                  // Only the leaf columns declare footers, so skip the group
                  // row instead of rendering a blank one.
                  footerGroup.headers.some(
                    (header) =>
                      !header.isPlaceholder && header.column.columnDef.footer,
                  ),
                )
                .map((footerGroup) => (
                  <tr key={footerGroup.id}>
                    {footerGroup.headers.map((header) => (
                      <th key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                          <basicTable.FlexRender footer={header} />
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
            </tfoot>
          </table>
        </section>

        <section className="example-panel">
          <h2 className="section-title">Nested Header Groups</h2>
          <table>
            <thead>
              {nestedTable.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} colSpan={header.colSpan}>
                      <nestedTable.FlexRender header={header} />
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {nestedTable.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <td key={cell.id}>
                      <nestedTable.FlexRender cell={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="example-panel">
          <h2 className="section-title">Placeholder Headers</h2>
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <table.FlexRender header={header} />
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <td key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              {table.getFooterGroups().map((footerGroup) => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <table.FlexRender footer={header} />
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </tfoot>
          </table>
        </section>

        <section className="example-panel">
          <h2 className="section-title">Header Row Spanning</h2>
          <table>
            <thead>
              {unevenTable.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) =>
                    header.rowSpan === 0 ? null : (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        rowSpan={header.rowSpan}
                      >
                        <unevenTable.FlexRender header={header} />
                      </th>
                    ),
                  )}
                </tr>
              ))}
            </thead>
            <tbody>
              {unevenTable.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <td key={cell.id}>
                      <unevenTable.FlexRender cell={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
      <div className="spacer-md" />
    </div>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

render(<App />, rootElement)
