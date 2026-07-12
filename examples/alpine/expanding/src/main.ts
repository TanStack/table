import Alpine from 'alpinejs'
import {
  FlexRender,
  columnFilteringFeature,
  createExpandedRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTable,
  filterFns,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/alpine-table'
import { makeData } from './makeData'
import './index.css'
import type { Column, ColumnDef } from '@tanstack/alpine-table'
import type { Person } from './makeData'

const features = tableFeatures({
  columnFilteringFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSortingFeature,
  rowSelectionFeature,
  expandedRowModel: createExpandedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns,
  sortFns,
})

// The `firstName` column renders an interactive selection checkbox + expander in
// its header and cell. Because Alpine cannot process directives inside `x-html`,
// those controls are rendered directly in `index.html` (special-cased by column
// id), so here the column just exposes the plain value.
const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    id: 'rowNumber',
    header: '#',
    cell: ({ row }) => row.getDisplayIndex() + 1,
  },
  {
    accessorKey: 'firstName',
    header: () => 'First Name',
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => '<span>Last Name</span>',
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'visits',
    header: () => '<span>Visits</span>',
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

type PersonColumn = Column<typeof features, Person>

Alpine.data('table', () => {
  const local = Alpine.reactive({ data: makeData(100, 5, 3) })

  const table = createTable({
    features,
    columns,
    get data() {
      return local.data
    },
    getSubRows: (row) => row.subRows,
    debugTable: true,
  })

  return {
    table,
    FlexRender,
    // the demo filters numeric columns with a min/max range, others with text
    isNumberColumn(column: PersonColumn) {
      const firstValue = table
        .getPreFilteredRowModel()
        .flatRows[0]?.getValue(column.id)
      return typeof firstValue === 'number'
    },
    setTextFilter(column: PersonColumn, value: string) {
      column.setFilterValue(value)
    },
    rangeValue(column: PersonColumn, index: 0 | 1) {
      return (
        (column.getFilterValue() as [unknown, unknown] | undefined)?.[index] ??
        ''
      )
    },
    setRangeMin(column: PersonColumn, value: string) {
      column.setFilterValue((old: [unknown, unknown] | undefined) => [
        value,
        old?.[1],
      ])
    },
    setRangeMax(column: PersonColumn, value: string) {
      column.setFilterValue((old: [unknown, unknown] | undefined) => [
        old?.[0],
        value,
      ])
    },
    goToPage(value: string) {
      table.setPageIndex(value ? Number(value) - 1 : 0)
    },
    refreshData() {
      local.data = makeData(100, 5, 3)
    },
    stressTest() {
      local.data = makeData(1_000, 5, 3)
    },
  }
})

window.Alpine = Alpine
Alpine.start()
