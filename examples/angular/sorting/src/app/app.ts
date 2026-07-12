import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import {
  FlexRender,
  createSortedRowModel,
  injectTable,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/angular-table'
import { makeData } from './makeData'
import type { ColumnDef, SortFn } from '@tanstack/angular-table'
import type { Person } from './makeData'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const sortStatusFn: SortFn<typeof features, Person> = (rowA, rowB) => {
  const statusOrder = ['single', 'complicated', 'relationship']
  return (
    statusOrder.indexOf(rowA.original.status) -
    statusOrder.indexOf(rowB.original.status)
  )
}

const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    id: 'rowNumber',
    header: '#',
    cell: ({ row }) => row.getDisplayIndex() + 1,
  },
  { accessorKey: 'firstName', cell: (info) => info.getValue() },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => 'Last Name',
    sortUndefined: 'last',
    sortDescFirst: false,
  },
  { accessorKey: 'email', header: 'Email', sortFn: 'alphanumeric' },
  { accessorKey: 'age', header: () => 'Age' },
  { accessorKey: 'visits', header: () => 'Visits', sortUndefined: 'last' },
  { accessorKey: 'status', header: 'Status', sortFn: sortStatusFn },
  { accessorKey: 'progress', header: 'Profile Progress' },
  { accessorKey: 'rank', header: 'Rank', invertSorting: true },
  { accessorKey: 'createdAt', header: 'Created At' },
]

const sortIndicators: Record<'asc' | 'desc', string> = {
  asc: ' ^',
  desc: ' v',
}

@Component({
  selector: 'app-root',
  imports: [FlexRender],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly data = signal<Array<Person>>(makeData(1_000))

  readonly table = injectTable<typeof features, Person>(() => ({
    features,
    columns,
    data: this.data(),
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
  }))

  stringifiedState() {
    return JSON.stringify(this.table.store.get(), null, 2)
  }

  refreshData = () => this.data.set(makeData(1_000))
  stressTest = () => this.data.set(makeData(1_000_000))

  getSortTitle(canSort: boolean, nextSortOrder: false | 'asc' | 'desc') {
    if (!canSort) return undefined
    if (nextSortOrder === 'asc') return 'Sort ascending'
    if (nextSortOrder === 'desc') return 'Sort descending'
    return 'Clear sort'
  }

  sortIndicator(sortDirection: false | 'asc' | 'desc') {
    return sortDirection ? sortIndicators[sortDirection] : null
  }
}
