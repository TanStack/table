import {
  aggregationFeature,
  aggregationFn_extent,
  aggregationFn_mean,
  aggregationFn_median,
  aggregationFn_sum,
  columnFilteringFeature,
  columnGroupingFeature,
  createColumnHelper,
  createExpandedRowModel,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
} from '@tanstack/react-table'
import { workerRowModelsFeature } from '@tanstack/react-table/experimental-worker-plugin'
import type { SortFn } from '@tanstack/react-table'
import type { Person } from './makeData'

// Shared between the main thread (main.tsx) and the worker (table.worker.ts).
//
// This is where worker-based row models earn their keep: everything here must
// be thread-portable. Columns use accessorKeys or accessors defined in this
// module, headers/cells are only ever rendered on the main thread, and any
// custom sortFn/filterFn/getGroupingValue must be a plain function declared
// here (not a closure over app state) so BOTH threads resolve the same
// implementation.
//
// The sync filtered/grouped/sorted row models registered here are the ones
// that run inside the worker's shadow table; main.tsx swaps them for
// worker-backed versions. Expanding and pagination stay on the main thread
// (both are cheap, downstream stages). Row selection is pure state and never
// crosses threads at all.

export const sharedFeatures = tableFeatures({
  aggregationFeature,
  rowSortingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  columnGroupingFeature,
  rowExpandingFeature,
  rowSelectionFeature,
  rowPaginationFeature,
  workerRowModelsFeature,
  filteredRowModel: createFilteredRowModel(),
  groupedRowModel: createGroupedRowModel(),
  sortedRowModel: createSortedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
  filterFns: {
    includesString: filterFn_includesString,
  },
  aggregationFns: {
    extent: aggregationFn_extent,
    mean: aggregationFn_mean,
    median: aggregationFn_median,
    sum: aggregationFn_sum,
  },
})

export const columnHelper = createColumnHelper<typeof sharedFeatures, Person>()

// Custom sorting logic for our enum column (single < complicated < relationship).
// Declared here so the worker's shadow table can resolve it by reference.
const sortStatusFn: SortFn<typeof sharedFeatures, Person> = (
  rowA,
  rowB,
  _columnId,
) => {
  const statusOrder = ['single', 'complicated', 'relationship']
  return (
    statusOrder.indexOf(rowA.original.status) -
    statusOrder.indexOf(rowB.original.status)
  )
}

// Multi-aggregation values are keyed objects on grouped rows, so define which
// result controls their order. Leaf rows still sort by their numeric age.
const sortAgeFn: SortFn<typeof sharedFeatures, Person> = (rowA, rowB) => {
  const getAge = (row: typeof rowA) => {
    const value = row.getValue<number | { median: number }>('age')
    return typeof value === 'number' ? value : value.median
  }

  return getAge(rowA) - getAge(rowB)
}

// The sorting example's column defs merged with the grouping example's
// aggregation props, exercising both entirely off the main thread: default
// string/number ordering, a named registry sortFn (alphanumeric),
// sortUndefined, invertSorting, a custom enum sortFn, getGroupingValue
// overrides, and median/sum/mean aggregations with aggregatedCell renderers.
export const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
    // override the value used for row grouping
    getGroupingValue: (row) => `${row.firstName} ${row.lastName}`,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => <span>Last Name</span>,
    sortUndefined: 'last', // force undefined values to the end
    sortDescFirst: false, // ascending first (nullable values confuse auto-detect)
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    sortFn: 'alphanumeric',
    enableGrouping: false,
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    sortFn: sortAgeFn,
    aggregationFn: ['median', { id: 'range', aggregationFn: 'extent' }],
    aggregatedCell: ({ getValue }) => {
      const value = getValue<{
        median: number
        range: [number | undefined, number | undefined]
      }>()
      return `Median ${Math.round(value.median * 100) / 100}; Range ${value.range[0]}–${value.range[1]}`
    },
  }),
  columnHelper.accessor('visits', {
    header: () => <span>Visits</span>,
    sortUndefined: 'last',
    aggregationFn: 'sum',
    aggregatedCell: ({ getValue }) => {
      const value = getValue<number | undefined>()
      return Number.isFinite(value) ? value!.toLocaleString() : '-'
    },
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    sortFn: sortStatusFn, // custom enum ordering, resolved in the worker
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    cell: ({ getValue }) => Math.round(getValue<number>() * 100) / 100 + '%',
    aggregationFn: 'mean',
    aggregatedCell: ({ getValue }) =>
      Math.round(getValue<number>() * 100) / 100 + '%',
  }),
  columnHelper.accessor('rank', {
    header: 'Rank',
    invertSorting: true, // golf-score style: smaller is better
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created At',
    cell: (info) => info.getValue<Date>().toISOString().slice(0, 10),
    enableGrouping: false,
    aggregatedCell: () => null,
  }),
])
