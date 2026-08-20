import Alpine from 'alpinejs'
import {
  FlexRender,
  createColumnHelper,
  createPaginatedRowModel,
  createTable,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/alpine-table'
import { makeData } from './makeData'
import './index.css'
import type { Person } from './makeData'

const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'rowNumber',
    header: '#',
    cell: ({ row }) => row.getDisplayIndex() + 1,
  }),
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => '<span>Last Name</span>',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('visits', {
    header: () => '<span>Visits</span>',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    footer: (props) => props.column.id,
  }),
])

Alpine.data('table', () => {
  const local = Alpine.reactive({ data: makeData(1_000) })

  const table = createTable({
    features,
    columns,
    get data() {
      return local.data
    },
    // initialState: { pagination: { pageIndex: 1, pageSize: 20 } }, // set the initial page once
    // atoms: { pagination: paginationAtom }, // preferred: own pagination state with an external atom
    // state: { pagination }, // classic controlled state; pair with onPaginationChange
    // onPaginationChange: setPagination,
    // autoResetPageIndex: false, // keep the current page after page-altering changes; default true
    // autoResetAll: false, // turn off every feature's automatic reset, including page index
    // manualPagination: true, // pass data that is already paginated, for example from a server
    // pageCount: 10, // total pages for manual pagination; use -1 when unknown
    // rowCount: 1_000, // total rows for manual pagination; pageCount is calculated from this and pageSize
    debugTable: true,
  })

  return {
    table,
    FlexRender,
    pageSizes: [10, 20, 30, 40, 50, Infinity],
    goToPage(value: string) {
      table.setPageIndex(value ? Number(value) - 1 : 0)
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
