import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core'
import {
  FlexRender,
  columnFacetingFeature,
  columnFilteringFeature,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createSortedRowModel,
  createTableHook,
  filterFn_inNumberRange,
  filterFn_includesString,
  isFunction,
  metaHelper,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  tableFeatures,
} from '@tanstack/angular-table'
import { makeData } from './makeData'
import { TableFilter } from './table-filter/table-filter'
import type {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  FilterFnOption,
  SortFnOption,
  Updater,
} from '@tanstack/angular-table'

// This example builds its columns from the DATA instead of a hard-coded definition.
// The row shape is treated as unknown (a generic Record). For each key we:
//   1. detect the value's data type at runtime,
//   2. pick a sortFn and filterFn that suit that type,
//   3. render a different filter component per type (see the @switch in TableFilter).
// The distinct values / min-max used by the filters come from the column faceting
// feature, not from a hand-rolled scan of the data.

// 1. Treat each row as an object of unknown shape
export type DynamicRow = Record<string, unknown>

// The runtime-detected data type for a column, stored in its meta.
export type DataType = 'string' | 'number' | 'boolean' | 'date'

// allows us to attach the detected data type to each column
interface DynamicColumnMeta {
  dataType: DataType
}

// 2. New in V9! Tell the table which features, row models, and fn registries we use.
export const features = tableFeatures({
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

// Render a cell value based on its data type.
function renderValue(value: unknown, dataType: DataType) {
  if (value == null) return ''
  if (dataType === 'date') return (value as Date).toLocaleDateString()
  if (dataType === 'boolean') return (value as boolean) ? '✅' : '❌'
  return String(value)
}

const sortIndicators: Record<'asc' | 'desc', string> = {
  asc: ' 🔼',
  desc: ' 🔽',
}

const { injectAppTable } = createTableHook({
  features,
  debugTable: true,
})

@Component({
  selector: 'app-root',
  imports: [TableFilter, FlexRender],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly columnFilters = signal<ColumnFiltersState>([])
  readonly data = signal<Array<DynamicRow>>(makeData(1_000))

  // 3. Derive the columns from the keys of the data instead of hard-coding them.
  readonly columns = computed<Array<ColumnDef<typeof features, DynamicRow>>>(
    () => {
      const data = this.data()
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
    },
  )

  // 4. Create the table instance with the derived columns and data. Angular's
  // signals + computed keep the reads fresh, so no Subscribe workaround is needed.
  table = injectAppTable(() => ({
    columns: this.columns(),
    data: this.data(),
    state: {
      columnFilters: this.columnFilters(),
    },
    onColumnFiltersChange: (updater: Updater<ColumnFiltersState>) => {
      isFunction(updater)
        ? this.columnFilters.update(updater)
        : this.columnFilters.set(updater)
    },
  }))

  refreshData = () => this.data.set(makeData(1_000))
  stressTest = () => this.data.set(makeData(1_000_000))

  sortIndicator(sortDirection: false | 'asc' | 'desc') {
    return sortDirection ? sortIndicators[sortDirection] : ''
  }
}
