import Alpine from 'alpinejs'
import {
  FlexRender,
  createSortedRowModel,
  createTable,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/alpine-table'
import { makeData } from './makeData'
import './index.css'
import type { ColumnDef, SortFn } from '@tanstack/alpine-table'
import type { Person } from './makeData'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const sortStatusFn: SortFn<typeof features, Person> = (
  rowA,
  rowB,
  _columnId,
) => {
  const statusA = rowA.original.status
  const statusB = rowB.original.status
  const statusOrder = ['single', 'complicated', 'relationship']
  return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB)
}

const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    accessorKey: 'firstName',
    cell: (info) => info.getValue(),
    // this column will sort in ascending order by default since it is a string column
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => '<span>Last Name</span>',
    sortUndefined: 'last', // force undefined values to the end
    sortDescFirst: false, // first sort order will be ascending (nullable values can mess up auto detection of sort order)
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
    // this column will sort in descending order by default since it is a number column
  },
  {
    accessorKey: 'visits',
    header: () => '<span>Visits</span>',
    sortUndefined: 'last', // force undefined values to the end
  },
  {
    accessorKey: 'status',
    header: 'Status',
    sortFn: sortStatusFn, // use our custom sorting function for this enum column
  },
  {
    accessorKey: 'progress',
    header: 'Profile Progress',
    // enableSorting: false, //disable sorting for this column
  },
  {
    accessorKey: 'rank',
    header: 'Rank',
    invertSorting: true, // invert the sorting order (golf score-like where smaller is better)
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    // sortFn: 'datetime' //make sure table knows this is a datetime column (usually can detect if no null values)
  },
]

Alpine.data('table', () => {
  const local = Alpine.reactive({ data: makeData(1_000) })

  const table = createTable(
    {
      features,
      columns,
      get data() {
        return local.data
      },
      debugTable: true,
    },
    (state) => state, // default selector
  )

  return {
    table,
    FlexRender,
    // pick the indicator for a column's current sort direction
    sortIndicator(isSorted: false | 'asc' | 'desc') {
      return { asc: ' 🔼', desc: ' 🔽' }[isSorted as string] ?? ''
    },
    refreshData() {
      local.data = makeData(1_000)
    },
    stressTest() {
      local.data = makeData(100_000)
    },
  }
})

window.Alpine = Alpine
Alpine.start()
