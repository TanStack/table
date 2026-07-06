import Alpine from 'alpinejs'
import {
  FlexRender,
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createTable,
  filterFns,
  metaHelper,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/alpine-table'
import { makeData } from './makeData'
import './index.css'
import type { Column, ColumnDef } from '@tanstack/alpine-table'
import type { Person } from './makeData'

// allows us to define custom properties for our columns
interface MyColumnMeta {
  filterVariant?: 'text' | 'range' | 'select'
}

const features = tableFeatures({
  columnFilteringFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns,
  columnMeta: metaHelper<MyColumnMeta>(),
})

const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    accessorKey: 'firstName',
    cell: (info) => info.getValue(),
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => '<span>Last Name</span>',
  },
  {
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    id: 'fullName',
    header: 'Full Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
    meta: {
      filterVariant: 'range',
    },
  },
  {
    accessorKey: 'visits',
    header: () => '<span>Visits</span>',
    meta: {
      filterVariant: 'range',
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    meta: {
      filterVariant: 'select',
    },
  },
  {
    accessorKey: 'progress',
    header: 'Profile Progress',
    meta: {
      filterVariant: 'range',
    },
  },
]

type PersonColumn = Column<typeof features, Person>

Alpine.data('table', () => {
  const local = Alpine.reactive({ data: makeData(1_000) })

  const table = createTable({
    features,
    columns,
    get data() {
      return local.data
    },
    debugTable: true,
  })

  return {
    table,
    FlexRender,
    // which filter UI a column wants
    filterVariant(column: PersonColumn) {
      return column.columnDef.meta?.filterVariant ?? 'text'
    },
    // text filter
    setTextFilter(column: PersonColumn, value: string) {
      column.setFilterValue(value)
    },
    // range filter (one input per bound)
    rangeValue(column: PersonColumn, index: 0 | 1) {
      return (
        (column.getFilterValue() as [unknown, unknown] | undefined)?.[index] ??
        ''
      )
    },
    setRangeMin(column: PersonColumn, value: string) {
      column.setFilterValue((old: [number, number] | undefined) => [
        value === '' ? undefined : Number(value),
        old?.[1],
      ])
    },
    setRangeMax(column: PersonColumn, value: string) {
      column.setFilterValue((old: [number, number] | undefined) => [
        old?.[0],
        value === '' ? undefined : Number(value),
      ])
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
