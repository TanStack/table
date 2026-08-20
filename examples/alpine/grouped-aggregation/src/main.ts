import Alpine from 'alpinejs'
import {
  FlexRender,
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
  createTable,
  filterFn_inNumberRange,
  filterFn_includesString,
  rowAggregationFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
} from '@tanstack/alpine-table'
import { makeData } from './makeData'
import './index.css'
import type { ColumnDef } from '@tanstack/alpine-table'
import type { Person } from './makeData'

const features = tableFeatures({
  rowAggregationFeature,
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
  filterFns: {
    includesString: filterFn_includesString,
    inNumberRange: filterFn_inNumberRange,
  },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
  },
  aggregationFns: {
    mean: aggregationFn_mean,
    median: aggregationFn_median,
    sum: aggregationFn_sum,
  },
})

const columnHelper = createColumnHelper<typeof features, Person>()

// Grouping toggle buttons (header) and expander toggles (grouped cells) are
// interactive and rendered directly in `index.html`, because Alpine cannot
// process directives inside `x-html`.
const columns: Array<ColumnDef<typeof features, Person>> = columnHelper.columns(
  [
    columnHelper.accessor('firstName', {
      header: 'First Name',
      footer: 'Grand Total',
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
      footer: ({ column }) => {
        const value = column.getAggregationValue<number | undefined>()
        return value === undefined ? '' : Math.round(value * 100) / 100
      },
    }),
    columnHelper.accessor('visits', {
      header: () => '<span>Visits</span>',
      aggregationFn: 'sum',
      aggregatedCell: ({ getValue }) => getValue<number>().toLocaleString(),
      footer: ({ column }) =>
        column.getAggregationValue<number>().toLocaleString(),
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
      footer: ({ column }) => {
        const value = column.getAggregationValue<number | undefined>()
        return value === undefined ? '' : `${Math.round(value * 100) / 100}%`
      },
    }),
  ],
)

Alpine.data('table', () => {
  const local = Alpine.reactive({ data: makeData(10_000) })

  const table = createTable({
    features,
    columns,
    get data() {
      return local.data
    },
    // initialState: { grouping: ['status'] }, // group by a column on first render
    // atoms: { grouping: groupingAtom }, // preferred: own grouping state with an external atom
    // state: { grouping }, // classic controlled state; pair with onGroupingChange
    // onGroupingChange: setGrouping,
    // enableGrouping: false, // disable grouping for every column; default true
    // groupedColumnMode: 'remove', // remove grouped columns instead of moving them to the start; default 'reorder'
    // manualGrouping: true, // pass rows that are already grouped and aggregated, for example from a server
    debugTable: true,
  })

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
      local.data = makeData(1_000_000)
    },
  }
})

window.Alpine = Alpine
Alpine.start()
