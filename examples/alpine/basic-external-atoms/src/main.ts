import Alpine from 'alpinejs'
import {
  FlexRender,
  createColumnHelper,
  createPaginatedRowModel,
  createSortedRowModel,
  createTable,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/alpine-table'
import { createAtom } from '@tanstack/store'
import { makeData } from './makeData'
import './index.css'
import type { PaginationState, SortingState } from '@tanstack/alpine-table'
import type { Person } from './makeData'

// This example demonstrates managing individual slices of table state via
// external TanStack Store atoms. Each atom is a stand-alone, subscribable
// reactive cell — you can read, write, or subscribe to it from anywhere,
// which makes it convenient for sharing state across components or modules.

const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
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

// Create stable external atoms for the individual state slices you want to
// own. These live at module scope here, but could just as easily be created
// in a shared store module and imported by multiple components.
const sortingAtom = createAtom<SortingState>([])
const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

Alpine.data('table', () => {
  const local = Alpine.reactive({ data: makeData(1_000) })

  // The table creates internal base atoms for every slice, and (because we
  // pass `atoms` below) reads/writes for `sorting` and `pagination` are routed
  // through the external atoms we created instead. Atom changes flow through
  // the derived `table.store`, which the Alpine adapter subscribes to so the
  // template re-renders.
  const table = createTable({
    features,
    columns,
    get data() {
      return local.data
    },
    atoms: {
      sorting: sortingAtom,
      pagination: paginationAtom,
    },
    debugTable: true,
  })

  return {
    table,
    FlexRender,
    // pick the indicator for a column's current sort direction
    sortIndicator(isSorted: false | 'asc' | 'desc') {
      return { asc: ' 🔼', desc: ' 🔽' }[isSorted as string] ?? ''
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
