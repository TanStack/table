import Alpine from 'alpinejs'
import {
  FlexRender,
  columnFilteringFeature,
  createExpandedRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTable,
  filterFn_inNumberRange,
  filterFn_includesString,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
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
  filterFns: {
    includesString: filterFn_includesString,
    inNumberRange: filterFn_inNumberRange,
  },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
  },
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
    getSubRows: (row) => row.subRows, // tell the table where nested rows live
    // enableRowSelection: row => row.original.age > 18, // enable selection conditionally; default true
    // enableMultiRowSelection: false, // allow only one selected row at a time; default true
    // enableSubRowSelection: false, // disable sub-row selection; default true
    // enableRowRangeSelection: false, // disable shift-click range selection; default true
    // initialState: { expanded: { '0': true } }, // expand rows on first render
    // atoms: { expanded: expandedAtom }, // preferred: own expanded state with an external atom
    // state: { expanded }, // classic controlled state; pair with onExpandedChange
    // onExpandedChange: setExpanded,
    // enableExpanding: false, // disable expanding for every row; default true
    // getRowCanExpand: row => row.original.subRows?.length > 0, // override which rows can expand
    // getIsRowExpanded: row => row.id === '0', // override whether a row is expanded
    // manualExpanding: true, // pass data that is already expanded, for example from a server
    // paginateExpandedRows: false, // keep expanded children on their parent page; default true
    // autoResetExpanded: false, // keep expanded rows after page-altering changes; default true
    // autoResetAll: false, // turn off every feature's automatic reset, including expansion
    // enableFilters: false, // disable all column and global filtering; default true
    // enableColumnFilters: false, // disable per-column filters; default true
    // filterFromLeafRows: true, // with filtering, keep parents whose descendants match
    // maxLeafRowFilterDepth: 0, // with filtering, only filter root rows
    // manualFiltering: true, // pass data that is already filtered, for example from a server
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
