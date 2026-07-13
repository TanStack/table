import Alpine from 'alpinejs'
import {
  FlexRender,
  createColumnHelper,
  createPaginatedRowModel,
  createSortedRowModel,
  createTable,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
} from '@tanstack/alpine-table'
import { makeData } from './makeData'
import './index.css'
import type { PaginationState, SortingState } from '@tanstack/alpine-table'
import type { Person } from './makeData'

// This example demonstrates managing table state externally (here, in an
// Alpine-reactive object) instead of letting the table manage its own state
// internally. The controlled slices are passed in via `state` and raised back
// up through the `onXxxChange` handlers.

const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
  },
})

const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('lastName', {
    header: 'Last Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('age', {
    header: 'Age',
  }),
  columnHelper.accessor('visits', {
    header: 'Visits',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
  }),
])

Alpine.data('table', () => {
  // Own the controlled state slices in Alpine-reactive state. Reading them via
  // getters inside the table options is what makes the adapter re-apply options
  // when they change.
  const local = Alpine.reactive({
    data: makeData(1_000),
    sorting: [] as SortingState,
    pagination: { pageIndex: 0, pageSize: 10 },
  })

  const table = createTable({
    debugTable: true,
    features,
    columns,
    get data() {
      return local.data
    },
    // connect our external state back down to the table via getters
    state: {
      get sorting() {
        return local.sorting
      },
      get pagination() {
        return local.pagination
      },
    },
    onSortingChange: (updater) => {
      // raise sorting state changes to our own state management
      local.sorting =
        typeof updater === 'function' ? updater(local.sorting) : updater
    },
    onPaginationChange: (updater) => {
      // raise pagination state changes to our own state management
      local.pagination =
        typeof updater === 'function' ? updater(local.pagination) : updater
    },
  })

  return {
    table,
    FlexRender,
    // pick the indicator for a column's current sort direction
    sortIndicator(isSorted: false | 'asc' | 'desc') {
      return { asc: ' 🔼', desc: ' 🔽' }[isSorted as string] ?? ''
    },
    // expose the controlled state to the template for pagination display
    get pagination() {
      return local.pagination
    },
    goToPage(value: string) {
      table.setPageIndex(value ? Number(value) - 1 : 0)
    },
    setPageSize(value: string) {
      table.setPageSize(Number(value))
    },
    refreshData() {
      local.data = makeData(1_000)
    },
    stressTest() {
      local.data = makeData(1_000_000)
    },
  }
})

window.Alpine = Alpine
Alpine.start()
