import Alpine from 'alpinejs'
import {
  FlexRender,
  aggregationFns,
  columnFilteringFeature,
  columnGroupingFeature,
  createColumnHelper,
  createExpandedRowModel,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTable,
  filterFns,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/alpine-table'
import { makeData } from './makeData'
import './index.css'
import type { ColumnDef } from '@tanstack/alpine-table'
import type { Person } from './makeData'

const features = tableFeatures({
  columnFilteringFeature,
  columnGroupingFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSortingFeature,
  expandedRowModel: createExpandedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  groupedRowModel: createGroupedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns,
  sortFns,
  aggregationFns,
})

const columnHelper = createColumnHelper<typeof features, Person>()

// Grouping toggle buttons (header) and expander toggles (grouped cells) are
// interactive and rendered directly in `index.html`, because Alpine cannot
// process directives inside `x-html`.
const columns: Array<ColumnDef<typeof features, Person>> = columnHelper.columns(
  [
    columnHelper.accessor('firstName', {
      header: 'First Name',
      cell: (info) => info.getValue(),
      getGroupingValue: (row) => `${row.firstName} ${row.lastName}`,
    }),
    columnHelper.accessor((row) => row.lastName, {
      id: 'lastName',
      header: () => '<span>Last Name</span>',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('age', {
      header: () => 'Age',
      aggregatedCell: ({ getValue }) =>
        Math.round(getValue<number>() * 100) / 100,
      aggregationFn: 'median',
    }),
    columnHelper.accessor('visits', {
      header: () => '<span>Visits</span>',
      aggregationFn: 'sum',
      aggregatedCell: ({ getValue }) => getValue<number>().toLocaleString(),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
    }),
    columnHelper.accessor('progress', {
      header: 'Profile Progress',
      cell: ({ getValue }) => Math.round(getValue<number>() * 100) / 100 + '%',
      aggregationFn: 'mean',
      aggregatedCell: ({ getValue }) =>
        Math.round(getValue<number>() * 100) / 100 + '%',
    }),
  ],
)

Alpine.data('table', () => {
  const local = Alpine.reactive({ data: makeData(10_000) })

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
    cellBackground(cell: any) {
      if (cell.getIsGrouped()) return '#0aff0082'
      if (cell.getIsAggregated()) return '#ffa50078'
      if (cell.getIsPlaceholder()) return '#ff000042'
      return 'white'
    },
    goToPage(value: string) {
      table.setPageIndex(value ? Number(value) - 1 : 0)
    },
    refreshData() {
      local.data = makeData(10_000)
    },
    stressTest() {
      local.data = makeData(200_000)
    },
  }
})

window.Alpine = Alpine
Alpine.start()
