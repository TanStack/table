import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { FlexRender, injectTable, tableFeatures } from '@tanstack/angular-table'
import { makeData } from './makeData'
import type { ColumnDef } from '@tanstack/angular-table'
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
      { accessorKey: 'age', header: 'Age', footer: 'Age' },
      { accessorKey: 'visits', header: 'Visits', footer: 'Visits' },
    ],
  },
  {
    header: 'Profile',
    columns: [
      { accessorKey: 'status', header: 'Status', footer: 'Status' },
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
      { accessorKey: 'age', header: () => 'Age' },
      {
        header: 'More Info',
        columns: [
          { accessorKey: 'visits', header: () => 'Visits' },
          { accessorKey: 'status', header: 'Status' },
        ],
      },
    ],
  },
  { accessorKey: 'progress', header: 'Profile Progress' },
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
        header: () => 'Last Name',
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
            header: () => 'Visits',
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

@Component({
  selector: 'app-root',
  imports: [FlexRender],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly data = signal<Array<Person>>(makeData(5))

  readonly table = injectTable<typeof features, Person>(() => ({
    features,
    columns,
    data: this.data(),
    debugTable: true,
  }))

  readonly basicTable = injectTable<typeof features, Person>(() => ({
    features,
    columns: basicColumns,
    data: this.data(),
    debugTable: true,
  }))

  readonly nestedTable = injectTable<typeof features, Person>(() => ({
    features,
    columns: nestedColumns,
    data: this.data(),
    debugTable: true,
  }))

  readonly unevenTable = injectTable<typeof features, Person>(() => ({
    features,
    columns: unevenColumns,
    data: this.data(),
    debugTable: true,
  }))

  stringifiedState() {
    return JSON.stringify(this.table.store.get(), null, 2)
  }

  // Only the leaf columns declare footers, so skip the group row instead of
  // rendering a blank one.
  basicFooterGroups() {
    return this.basicTable
      .getFooterGroups()
      .filter((footerGroup) =>
        footerGroup.headers.some(
          (header) => !header.isPlaceholder && header.column.columnDef.footer,
        ),
      )
  }

  refreshData = () => this.data.set(makeData(5))
  stressTest = () => this.data.set(makeData(1_000))
}
