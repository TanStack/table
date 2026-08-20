import Alpine from 'alpinejs'
import {
  FlexRender,
  columnFacetingFeature,
  columnFilteringFeature,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createSortedRowModel,
  createTable,
  filterFn_inNumberRange,
  filterFn_includesString,
  metaHelper,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  tableFeatures,
} from '@tanstack/alpine-table'
import { makeData } from './makeData'
import './index.css'
import type {
  Column,
  ColumnDef,
  FilterFn,
  FilterFnOption,
  SortFnOption,
} from '@tanstack/alpine-table'

// This example builds its columns from the DATA instead of a hard-coded definition.
// The row shape is treated as unknown (a generic Record). For each key we:
//   1. detect the value's data type at runtime,
//   2. pick a sortFn and filterFn that suit that type,
//   3. render a different filter component per type (see the x-if branches in index.html).
// The distinct values / min-max used by the filters come from the column faceting
// feature, not from a hand-rolled scan of the data.

// 1. Treat each row as an object of unknown shape
type DynamicRow = Record<string, unknown>

// The runtime-detected data type for a column, stored in its meta.
type DataType = 'string' | 'number' | 'boolean' | 'date'

// allows us to attach the detected data type to each column
interface DynamicColumnMeta {
  dataType: DataType
}

// 2. New in V9! Tell the table which features, row models, and fn registries we use.
const features = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  columnFacetingFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(), // powers the enum select options
  facetedMinMaxValues: createFacetedMinMaxValues(), // powers the numeric range hints
  // register only the built-in sort fns we reference by name
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
  },
  // register only the built-in filter fns we reference by name
  filterFns: {
    includesString: filterFn_includesString,
    inNumberRange: filterFn_inNumberRange,
  },
  columnMeta: metaHelper<DynamicColumnMeta>(),
})

type DynamicColumn = Column<typeof features, DynamicRow>

// Custom filter fns for the data types that have no suitable built-in.
// Per convention, standalone fns use `any` for TData since they aren't shape-specific.
const booleanFilterFn: FilterFn<typeof features, any> = (
  row,
  columnId,
  filterValue,
) => {
  if (filterValue === '' || filterValue == null) return true
  return String(row.getValue(columnId)) === String(filterValue)
}

const dateRangeFilterFn: FilterFn<typeof features, any> = (
  row,
  columnId,
  filterValue,
) => {
  const [min, max] = (filterValue as [string, string] | undefined) ?? ['', '']
  const value = row.getValue(columnId)
  const time =
    value instanceof Date
      ? value.getTime()
      : new Date(value as string).getTime()
  if (min && time < new Date(min).getTime()) return false
  if (max && time > new Date(max).getTime()) return false
  return true
}

// Turn a data key like "firstName" into a readable header like "First Name"
function formatHeader(key: string) {
  const withSpaces = key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // split camelCase
    .replace(/[_-]+/g, ' ') // split snake_case / kebab-case
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1)
}

// Inspect a sample value for a key and decide its data type.
function detectDataType(data: Array<DynamicRow>, key: string): DataType {
  const sample = data.find((row) => row[key] != null)?.[key]
  if (sample instanceof Date) return 'date'
  if (typeof sample === 'boolean') return 'boolean'
  if (typeof sample === 'number') return 'number'
  return 'string'
}

// Pick a built-in sort fn (by name) based on the data type.
function getSortFn(dataType: DataType): SortFnOption<typeof features, any> {
  switch (dataType) {
    case 'number':
    case 'boolean':
      return 'basic'
    case 'date':
      return 'datetime'
    case 'string':
    default:
      return 'alphanumeric'
  }
}

// Pick a filter fn based on the data type. Mixes built-in fns (by name) with
// the custom fns defined above.
function getFilterFn(dataType: DataType): FilterFnOption<typeof features, any> {
  switch (dataType) {
    case 'number':
      return 'inNumberRange'
    case 'boolean':
      return booleanFilterFn
    case 'date':
      return dateRangeFilterFn
    case 'string':
    default:
      return 'includesString'
  }
}

// Render a cell value based on its data type. Alpine injects the returned string
// via x-html, so cells (and headers) are plain strings here.
function renderValue(value: unknown, dataType: DataType) {
  if (value == null) return ''
  if (dataType === 'date') return (value as Date).toLocaleDateString()
  if (dataType === 'boolean') return (value as boolean) ? '✅' : '❌'
  return String(value)
}

// 3. Derive the columns from the keys of the data instead of hard-coding them.
// The keys and their value types are stable across regenerations, so we only build
// the column defs once from a sample of the data.
function buildColumns(
  data: Array<DynamicRow>,
): Array<ColumnDef<typeof features, DynamicRow>> {
  if (data.length === 0) return []
  return Object.keys(data[0]).map(
    (key): ColumnDef<typeof features, DynamicRow> => {
      const dataType = detectDataType(data, key)
      return {
        accessorKey: key,
        header: formatHeader(key),
        meta: { dataType },
        sortFn: getSortFn(dataType),
        filterFn: getFilterFn(dataType),
        cell: (info) => renderValue(info.getValue(), dataType),
      }
    },
  )
}

// small debounce helper, mirroring the sibling examples' 500ms debounce
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

  const columns = buildColumns(local.data)

  // 4. Create the table instance with the derived columns and data
  const table = createTable({
    features,
    columns,
    get data() {
      return local.data
    },
    debugTable: true,
  })

  const setColumnFilter = debounce(
    (column: DynamicColumn, value: unknown) => column.setFilterValue(value),
    500,
  )

  return {
    table,
    FlexRender,
    // the runtime-detected data type drives which filter control renders
    dataType(column: DynamicColumn): DataType {
      return column.columnDef.meta?.dataType ?? 'string'
    },
    // --- sorting ---
    sortIndicator(column: DynamicColumn) {
      return { asc: ' 🔼', desc: ' 🔽' }[column.getIsSorted() as string] ?? ''
    },
    toggleSort(column: DynamicColumn) {
      column.toggleSorting()
    },
    // --- number: faceted min/max range ---
    facetMin(column: DynamicColumn) {
      return column.getFacetedMinMaxValues()?.[0] ?? ''
    },
    facetMax(column: DynamicColumn) {
      return column.getFacetedMinMaxValues()?.[1] ?? ''
    },
    rangeValue(column: DynamicColumn, index: 0 | 1) {
      return (
        (column.getFilterValue() as [unknown, unknown] | undefined)?.[index] ??
        ''
      )
    },
    onRangeMin(column: DynamicColumn, value: string) {
      setColumnFilter(column, (old: [number, number] | undefined) => [
        value ? Number(value) : undefined,
        old?.[1],
      ])
    },
    onRangeMax(column: DynamicColumn, value: string) {
      setColumnFilter(column, (old: [number, number] | undefined) => [
        old?.[0],
        value ? Number(value) : undefined,
      ])
    },
    // --- date: two date inputs ---
    dateValue(column: DynamicColumn, index: 0 | 1) {
      return (
        (column.getFilterValue() as [string, string] | undefined)?.[index] ?? ''
      )
    },
    onDateMin(column: DynamicColumn, value: string) {
      setColumnFilter(column, (old: [string, string] | undefined) => [
        String(value),
        old?.[1] ?? '',
      ])
    },
    onDateMax(column: DynamicColumn, value: string) {
      setColumnFilter(column, (old: [string, string] | undefined) => [
        old?.[0] ?? '',
        String(value),
      ])
    },
    // --- boolean: All/Yes/No select ---
    booleanValue(column: DynamicColumn) {
      return (column.getFilterValue() ?? '').toString()
    },
    onBooleanFilter(column: DynamicColumn, value: string) {
      column.setFilterValue(value)
    },
    // --- string enum: select of low-cardinality faceted values ---
    isEnum(column: DynamicColumn) {
      const dataType = column.columnDef.meta?.dataType ?? 'string'
      const count = column.getFacetedUniqueValues().size
      return dataType === 'string' && count > 0 && count <= 10
    },
    enumValue(column: DynamicColumn) {
      return (column.getFilterValue() ?? '').toString()
    },
    onEnumFilter(column: DynamicColumn, value: string) {
      column.setFilterValue(value)
    },
    // --- string (high cardinality): debounced text search with datalist ---
    uniqueCount(column: DynamicColumn) {
      return column.getFacetedUniqueValues().size
    },
    uniqueValues(column: DynamicColumn) {
      return Array.from(column.getFacetedUniqueValues().keys())
        .map(String)
        .sort()
        .slice(0, 5000)
    },
    onTextFilter(column: DynamicColumn, value: string) {
      setColumnFilter(column, value)
    },
    // --- data controls ---
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
