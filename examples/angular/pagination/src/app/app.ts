import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import {
  FlexRender,
  createPaginatedRowModel,
  injectTable,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/angular-table'
import { makeData } from './makeData'
import type { ColumnDef } from '@tanstack/angular-table'
import type { Person } from './makeData'

const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

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
  readonly data = signal<Array<Person>>(makeData(100_000))
  readonly allPageSize = Infinity
  readonly pageSizes = [10, 20, 30, 40, 50, Infinity]

  readonly table = injectTable<typeof features, Person>(() => ({
    features,
    columns,
    data: this.data(),
    // initialState: { pagination: { pageIndex: 1, pageSize: 20 } }, // set the initial page once
    // atoms: { pagination: paginationAtom }, // preferred: own pagination state with an external atom
    // state: { pagination }, // classic controlled state; pair with onPaginationChange
    // onPaginationChange: setPagination,
    // autoResetPageIndex: false, // keep the current page after page-altering changes; default true
    // autoResetAll: false, // turn off every feature's automatic reset, including page index
    // manualPagination: true, // pass data that is already paginated, for example from a server
    // pageCount: 10, // total pages for manual pagination; use -1 when unknown
    // rowCount: 1_000, // total rows for manual pagination; pageCount is calculated from this and pageSize
    debugTable: true,
  }))

  stringifiedState() {
    return JSON.stringify(this.table.store.get(), null, 2)
  }

  refreshData = () => this.data.set(makeData(100_000))
  stressTest = () => this.data.set(makeData(1_000_000))

  onPageInputChange(event: Event): void {
    const page = (event.target as HTMLInputElement).value
      ? Number((event.target as HTMLInputElement).value) - 1
      : 0
    this.table.setPageIndex(page)
  }

  onPageSizeChange(event: Event): void {
    this.table.setPageSize(Number((event.target as HTMLSelectElement).value))
  }
}
