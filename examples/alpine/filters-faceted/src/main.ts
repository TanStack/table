import Alpine from 'alpinejs'
import {
  FlexRender,
  columnFacetingFeature,
  columnFilteringFeature,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createTable,
  filterFns,
  globalFilteringFeature,
  rowPaginationFeature,
  tableFeatures,
} from '@tanstack/alpine-table'
import { makeData } from './makeData'
import './index.css'
import type { Column, ColumnDef } from '@tanstack/alpine-table'
import type { Person } from './makeData'

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  columnFacetingFeature,
  rowPaginationFeature,
  facetedRowModel: createFacetedRowModel(),
  facetedMinMaxValues: createFacetedMinMaxValues(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns,
})

const columns: Array<ColumnDef<typeof features, Person>> = [
  {
    header: 'Name',
    footer: (props) => props.column.id,
    columns: [
      {
        accessorKey: 'firstName',
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
    ],
  },
  {
    header: 'Info',
    footer: (props) => props.column.id,
    columns: [
      {
        accessorKey: 'age',
        header: () => 'Age',
        footer: (props) => props.column.id,
      },
      {
        header: 'More Info',
        columns: [
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
        ],
      },
    ],
  },
]

type PersonColumn = Column<typeof features, Person>

// small debounce helper, mirroring the Lit example's 500ms debounce
function debounce<TArgs extends Array<unknown>>(
  fn: (...args: TArgs) => void,
  wait: number,
) {
  let timer: ReturnType<typeof setTimeout> | undefined
  return (...args: TArgs) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
}

Alpine.data('table', () => {
  const local = Alpine.reactive({ data: makeData(1_000) })

  const table = createTable({
    features,
    columns,
    get data() {
      return local.data
    },
    globalFilterFn: 'includesString',
    debugTable: true,
  })

  const setGlobalFilter = debounce(
    (value: string) => table.setGlobalFilter(value),
    500,
  )
  const setColumnFilter = debounce(
    (column: PersonColumn, value: unknown) => column.setFilterValue(value),
    500,
  )

  return {
    table,
    FlexRender,
    // numeric columns get a faceted min/max range, others a faceted datalist search
    isNumberColumn(column: PersonColumn) {
      const firstValue = table
        .getPreFilteredRowModel()
        .flatRows[0]?.getValue(column.id)
      return typeof firstValue === 'number'
    },
    facetMin(column: PersonColumn) {
      return column.getFacetedMinMaxValues()?.[0] ?? ''
    },
    facetMax(column: PersonColumn) {
      return column.getFacetedMinMaxValues()?.[1] ?? ''
    },
    uniqueCount(column: PersonColumn) {
      return column.getFacetedUniqueValues().size
    },
    uniqueValues(column: PersonColumn) {
      return Array.from(column.getFacetedUniqueValues().keys())
        .sort()
        .slice(0, 5000)
    },
    rangeValue(column: PersonColumn, index: 0 | 1) {
      return (
        (column.getFilterValue() as [unknown, unknown] | undefined)?.[index] ??
        ''
      )
    },
    onGlobalFilter(value: string) {
      setGlobalFilter(value)
    },
    onTextFilter(column: PersonColumn, value: string) {
      setColumnFilter(column, value)
    },
    onRangeMin(column: PersonColumn, value: string) {
      setColumnFilter(column, (old: [number, number] | undefined) => [
        value ? Number(value) : undefined,
        old?.[1],
      ])
    },
    onRangeMax(column: PersonColumn, value: string) {
      setColumnFilter(column, (old: [number, number] | undefined) => [
        old?.[0],
        value ? Number(value) : undefined,
      ])
    },
    goToPage(value: string) {
      table.setPageIndex(value ? Number(value) - 1 : 0)
    },
    pageSizes: [10, 20, 30, 40, 50],
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
