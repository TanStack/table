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
  { accessorKey: 'firstName', cell: (info) => info.getValue() },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => 'Last Name',
    sortUndefined: 'last',
    sortDescFirst: false,
  },
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
    debugTable: true,
  }))

  stringifiedState() {
    return JSON.stringify(this.table.store.get(), null, 2)
  }

  refreshData = () => this.data.set(makeData(1_000))
  stressTest = () => this.data.set(makeData(500_000))
  rerender = () => this.data.update((data) => [...data])

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
