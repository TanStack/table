import { createRoot, useEffect, useMemo, useRef, useState } from 'octane'
import {
  columnFacetingFeature,
  columnFilteringFeature,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_inNumberRange,
  filterFn_includesString,
  metaHelper,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  tableFeatures,
  useTable,
} from '@tanstack/octane-table'
import { makeData } from './makeData'
import type {
  Column,
  ColumnDef,
  FilterFn,
  FilterFnOption,
  OctaneTable,
  SortFnOption,
} from '@tanstack/octane-table'
import './index.css'

// This example builds its columns from the DATA instead of a hard-coded definition.
// The row shape is treated as unknown (a generic Record). For each key we:
//   1. detect the value's data type at runtime,
//   2. pick a sortFn and filterFn that suit that type,
//   3. render a different filter component per type (see the branches in <Filter>).
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
  sortFns: {
    // register only the built-in sort fns we reference by name
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
  },
  filterFns: {
    // register only the built-in filter fns we reference by name
    includesString: filterFn_includesString,
    inNumberRange: filterFn_inNumberRange,
  },
  columnMeta: metaHelper<DynamicColumnMeta>(),
})

type DynamicTable = OctaneTable<typeof features, DynamicRow>

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
    value instanceof Date ? value.getTime() : new Date(String(value)).getTime()
  if (min && time < new Date(min).getTime()) return false
  if (max && time > new Date(max).getTime()) return false
  return true
}

// Turn a data key like "firstName" into a readable header like "First Name"
function formatHeader(key: string) {
  const withSpaces = key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
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
  if (dataType === 'number' || dataType === 'boolean') return 'basic'
  if (dataType === 'date') return 'datetime'
  return 'alphanumeric'
}

// Pick a filter fn based on the data type. Mixes built-in fns (by name) with
// the custom fns defined above.
function getFilterFn(dataType: DataType): FilterFnOption<typeof features, any> {
  if (dataType === 'number') return 'inNumberRange'
  if (dataType === 'boolean') return booleanFilterFn
  if (dataType === 'date') return dateRangeFilterFn
  return 'includesString'
}

// Render a cell value based on its data type.
function renderValue(value: unknown, dataType: DataType) {
  if (value == null) return ''
  if (dataType === 'date') return (value as Date).toLocaleDateString()
  if (dataType === 'boolean') return value ? '✅' : '❌'
  return String(value)
}

function App() @{
  const [data, setData] = useState<Array<DynamicRow>>(() => makeData(1_000))
  const refreshData = () => setData(makeData(1_000))
  const stressTest = () => setData(makeData(1_000_000))

  // 3. Derive the columns from the keys of the data instead of hard-coding them.
  const columns = useMemo<Array<ColumnDef<typeof features, DynamicRow>>>(() => {
    if (data.length === 0) return []
    return Object.keys(data[0]!).map((key) => {
      const dataType = detectDataType(data, key)
      return {
        accessorKey: key,
        header: formatHeader(key),
        meta: { dataType },
        sortFn: getSortFn(dataType),
        filterFn: getFilterFn(dataType),
        cell: (info) => renderValue(info.getValue(), dataType),
      }
    })
  }, [data])

  // 4. Create the table instance with the derived columns and data
  const table = useTable(
    {
      debugTable: true,
      features,
      columns,
      data,
    },
    (state) => state, // default selector
  )

  <div className="demo-root">
    <p className="demo-note">
      Columns, sort fns, filter fns, and filter components are all derived
      from the data type of each field, not from a hard-coded column definition.
    </p>
    <div className="button-row">
      <button className="demo-button demo-button-sm" onClick={refreshData}>
        Regenerate Data
      </button>
      <button className="demo-button demo-button-sm" onClick={stressTest}>
        Stress Test (1M rows)
      </button>
    </div>
    <div className="spacer-sm" />
    <div className="scroll-container">
      <table>
        <thead>
          @for (const headerGroup of table.getHeaderGroups(); key headerGroup.id) {
            <tr>
              @for (const header of headerGroup.headers; key header.id) {
                <th colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : <>
                    <div
                      className={header.column.getCanSort() ? 'sortable-header' : ''}
                      onClick={header.column.getToggleSortingHandler()}
                      title={header.column.getCanSort() ? 'Toggle sorting' : undefined}
                    >
                      <table.FlexRender header={header} />
                      {header.column.getIsSorted() === 'asc'
                        ? ' 🔼'
                        : header.column.getIsSorted() === 'desc'
                          ? ' 🔽'
                          : null}
                    </div>
                    {header.column.getCanFilter()
                      ? <Filter column={header.column} table={table} />
                      : null}
                  </>}
                </th>
              }
            </tr>
          }
        </thead>
        <tbody>
          @for (const row of table.getRowModel().rows.slice(0, 15); key row.id) {
            <tr>
              @for (const cell of row.getAllCells(); key cell.id) {
                <td><table.FlexRender cell={cell} /></td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
    <div className="spacer-sm" />
    <div>{String(table.getRowModel().rows.length)} Rows</div>
  </div>
}

function Filter({
  column,
  table,
}: {
  column: Column<typeof features, DynamicRow, unknown>
  table: DynamicTable
}) @{
  // A different filter UI per data type. The reactive reads (getFilterValue,
  // faceted values) go through builder-pattern APIs on a stable `column`.
  // `table.Subscribe` re-runs the render prop on column-filter changes so the
  // inputs stay fresh.
  <table.Subscribe selector={(state) => state.columnFilters}>
    {() => <FilterContent column={column} />}
  </table.Subscribe>
}

function FilterContent({
  column,
}: {
  column: Column<typeof features, DynamicRow, unknown>
}) {
  const { dataType } = column.columnDef.meta ?? { dataType: 'string' }
  const filterValue = column.getFilterValue()

  if (dataType === 'number') {
    const [min, max] = column.getFacetedMinMaxValues() ?? []
    return <div className="filter-row">
      <DebouncedInput
        type="number"
        value={(filterValue as [number, number] | undefined)?.[0] ?? ''}
        onChange={(value) => column.setFilterValue((old: [number, number] | undefined) => [value, old?.[1]])}
        placeholder={`Min${min !== undefined ? ` (${min})` : ''}`}
        className="filter-input"
      />
      <DebouncedInput
        type="number"
        value={(filterValue as [number, number] | undefined)?.[1] ?? ''}
        onChange={(value) => column.setFilterValue((old: [number, number] | undefined) => [old?.[0], value])}
        placeholder={`Max${max !== undefined ? ` (${max})` : ''}`}
        className="filter-input"
      />
    </div>
  }

  if (dataType === 'date') {
    return <div className="filter-row">
      <DebouncedInput
        type="date"
        value={(filterValue as [string, string] | undefined)?.[0] ?? ''}
        onChange={(value) => column.setFilterValue((old: [string, string] | undefined) => [String(value), old?.[1] ?? ''])}
        className="filter-input"
      />
      <DebouncedInput
        type="date"
        value={(filterValue as [string, string] | undefined)?.[1] ?? ''}
        onChange={(value) => column.setFilterValue((old: [string, string] | undefined) => [old?.[0] ?? '', String(value)])}
        className="filter-input"
      />
    </div>
  }

  if (dataType === 'boolean') {
    return <select
      className="filter-select"
      value={String(filterValue ?? '')}
      onChange={(event) => column.setFilterValue(event.currentTarget.value)}
    >
      <option value="">All</option>
      <option value="true">Yes</option>
      <option value="false">No</option>
    </select>
  }

  const uniqueValues = Array.from(column.getFacetedUniqueValues().keys())
    .map(String)
    .sort()
  if (uniqueValues.length > 0 && uniqueValues.length <= 10) {
    // string: low-cardinality columns become a select of their faceted values,
    // everything else gets a free-text search.
    return <select
      className="filter-select"
      value={String(filterValue ?? '')}
      onChange={(event) => column.setFilterValue(event.currentTarget.value)}
    >
      <option value="">All</option>
      <EnumOptions values={uniqueValues} />
    </select>
  }

  return <DebouncedInput
    type="text"
    value={String(filterValue ?? '')}
    onChange={(value) => column.setFilterValue(value)}
    placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
    className="filter-input"
  />
}

function EnumOptions({ values }: { values: Array<string> }) @{
  <>
    @for (const value of values; key value) {
      <option value={value}>{value}</option>
    }
  </>
}

// A typical debounced input Octane component implemented with effects/timers,
// so the example exercises only the new table and store adapters.
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  type,
  placeholder,
  className,
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
  type: string
  placeholder?: string
  className?: string
}) @{
  const [value, setValue] = useState(initialValue)
  const onChangeRef = useRef(onChange)
  const timeoutRef = useRef<number | undefined>(undefined)
  onChangeRef.current = onChange

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== undefined) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  <input
    type={type}
    placeholder={placeholder}
    className={className}
    value={value}
    onInput={(event) => {
      const nextValue = event.currentTarget.value
      setValue(nextValue)
      if (timeoutRef.current !== undefined) {
        window.clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = window.setTimeout(
        () => onChangeRef.current(nextValue),
        debounce,
      )
    }}
  />
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')
createRoot(rootElement).render(App)
