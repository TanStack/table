import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import {
  FlexRender,
  createExpandedRowModel,
  createPaginatedRowModel,
  flexRenderComponent,
  injectTable,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  tableFeatures,
} from '@tanstack/angular-table'
import { ReactiveFormsModule } from '@angular/forms'
import { makeData } from './makeData'
import {
  ExpandableCell,
  ExpandableHeaderCell,
} from './expandable-cell/expandable-cell'
import type { Person } from './makeData'
import type { ColumnDef, ExpandedState } from '@tanstack/angular-table'

export const features = tableFeatures({
  rowExpandingFeature: rowExpandingFeature,
  rowPaginationFeature: rowPaginationFeature,
  rowSelectionFeature: rowSelectionFeature,
  paginatedRowModel: createPaginatedRowModel(),
  expandedRowModel: createExpandedRowModel(),
})

const defaultColumns: Array<ColumnDef<typeof features, Person>> = [
  {
    id: 'rowNumber',
    header: '#',
    cell: ({ row }) => row.getDisplayIndex() + 1,
  },
  {
    accessorKey: 'firstName',
    header: () =>
      flexRenderComponent(ExpandableHeaderCell, {
        inputs: {
          label: 'First name',
        },
      }),
    cell: () => flexRenderComponent(ExpandableCell),
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => 'Last Name',
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'visits',
    header: () => `Visits`,
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
]

@Component({
  selector: 'app-root',
  imports: [FlexRender, ReactiveFormsModule],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly data = signal<Array<Person>>(makeData(100, 5, 3))
  readonly expanded = signal<ExpandedState>({})

  readonly table = injectTable(() => ({
    features,
    data: this.data(),
    columns: defaultColumns,
    state: {
      expanded: this.expanded(),
    },
    onExpandedChange: (updater) =>
      typeof updater === 'function'
        ? this.expanded.update(updater)
        : this.expanded.set(updater),
    getSubRows: (row) => row.subRows,
    // initialState: { expanded: { '0': true } }, // expand rows on first render
    // atoms: { expanded: expandedAtom }, // preferred: own expanded state with an external atom
    // enableExpanding: false, // disable expanding for every row; default true
    // getRowCanExpand: row => row.original.subRows?.length > 0, // override which rows can expand
    // getIsRowExpanded: row => row.id === '0', // override whether a row is expanded
    // manualExpanding: true, // pass data that is already expanded, for example from a server
    // paginateExpandedRows: false, // keep expanded children on their parent page; default true
    // autoResetExpanded: false, // keep expanded rows after page-altering changes; default true
    // autoResetAll: false, // turn off every feature's automatic reset, including expansion
    // filterFromLeafRows: true, // with filtering, keep parents whose descendants match
    // maxLeafRowFilterDepth: 0, // with filtering, only filter root rows
    debugTable: true,
  }))

  stringifiedState() {
    return JSON.stringify(this.table.store.get(), null, 2)
  }

  onPageInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement
    const page = inputElement.value ? Number(inputElement.value) - 1 : 0
    this.table.setPageIndex(page)
  }

  onPageSizeChange(event: any): void {
    this.table.setPageSize(Number(event.target.value))
  }

  refreshData = () => this.data.set(makeData(100, 5, 3))
  stressTest = () => this.data.set(makeData(10_000, 5, 3))
}
