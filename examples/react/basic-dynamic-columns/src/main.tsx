import * as React from 'react'
import { TanStackDevtools } from '@tanstack/react-devtools'
import ReactDOM from 'react-dom/client'
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
} from '@tanstack/react-table'
import {
  tableDevtoolsPlugin,
  useTanStackTableDevtools,
} from '@tanstack/react-table-devtools'
import { useDebouncedCallback } from '@tanstack/react-pacer/debouncer'
import { makeData } from './makeData'
import type {
  Column,
  ColumnDef,
  FilterFn,
  FilterFnOption,
  ReactTable,
  SortFnOption,
} from '@tanstack/react-table'
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

type DynamicTable = ReactTable<typeof features, DynamicRow>

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

function App() {
  const [data, setData] = React.useState<Array<DynamicRow>>(() =>
    makeData(1_000),
  )
  const refreshData = () => setData(makeData(1_000))
  const stressTest = () => setData(makeData(1_000_000))

  // 3. Derive the columns from the keys of the data instead of hard-coding them.
  const columns = React.useMemo<
    Array<ColumnDef<typeof features, DynamicRow>>
  >(() => {
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
  }, [data])

  // 4. Create the table instance with the derived columns and data
  const table = useTable(
    {
      key: 'basic-dynamic-columns', // needed for devtools, omit if you don't want to use the devtools
      debugTable: true,
      features,
      columns,
      data,
    },
    (state) => state, // default selector
  )

  useTanStackTableDevtools(table)

  return (
    <div className="demo-root">
      <p className="demo-note">
        Columns, sort fns, filter fns, and filter components are all derived
        from the data type of each field, not from a hard-coded column
        definition.
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
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          className={
                            header.column.getCanSort() ? 'sortable-header' : ''
                          }
                          onClick={header.column.getToggleSortingHandler()}
                          title={
                            header.column.getCanSort()
                              ? 'Toggle sorting'
                              : undefined
                          }
                        >
                          <table.FlexRender header={header} />
                          {{ asc: ' 🔼', desc: ' 🔽' }[
                            header.column.getIsSorted() as string
                          ] ?? null}
                        </div>
                        {header.column.getCanFilter() ? (
                          <Filter column={header.column} table={table} />
                        ) : null}
                      </>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table
              .getRowModel()
              .rows.slice(0, 15)
              .map((row) => (
                <tr key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <td key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="spacer-sm" />
      <div>{table.getRowModel().rows.length.toLocaleString()} Rows</div>
    </div>
  )
}

// A different filter UI per data type. The reactive reads (getFilterValue, the
// faceted values) go through builder-pattern APIs on a stable `column`, which the
// React Compiler would otherwise memoize inside this nested component, leaving the
// inputs stale. `table.Subscribe` re-runs the render-prop on column-filter changes
// so the reads stay fresh. See the "Subscribe for React Compiler Compatibility"
// section of the table-state guide.
function Filter({
  column,
  table,
}: {
  column: Column<typeof features, DynamicRow, unknown>
  table: DynamicTable
}) {
  const { dataType } = column.columnDef.meta ?? { dataType: 'string' }

  return (
    <table.Subscribe selector={(state) => state.columnFilters}>
      {() => {
        const filterValue = column.getFilterValue()

        if (dataType === 'number') {
          const [min, max] = column.getFacetedMinMaxValues() ?? []
          return (
            <div className="filter-row">
              <DebouncedInput
                type="number"
                value={(filterValue as [number, number] | undefined)?.[0] ?? ''}
                onChange={(value) =>
                  column.setFilterValue((old: [number, number] | undefined) => [
                    value,
                    old?.[1],
                  ])
                }
                placeholder={`Min${min !== undefined ? ` (${min})` : ''}`}
                className="filter-input"
              />
              <DebouncedInput
                type="number"
                value={(filterValue as [number, number] | undefined)?.[1] ?? ''}
                onChange={(value) =>
                  column.setFilterValue((old: [number, number] | undefined) => [
                    old?.[0],
                    value,
                  ])
                }
                placeholder={`Max${max !== undefined ? ` (${max})` : ''}`}
                className="filter-input"
              />
            </div>
          )
        }

        if (dataType === 'date') {
          return (
            <div className="filter-row">
              <DebouncedInput
                type="date"
                value={(filterValue as [string, string] | undefined)?.[0] ?? ''}
                onChange={(value) =>
                  column.setFilterValue((old: [string, string] | undefined) => [
                    String(value),
                    old?.[1] ?? '',
                  ])
                }
                className="filter-input"
              />
              <DebouncedInput
                type="date"
                value={(filterValue as [string, string] | undefined)?.[1] ?? ''}
                onChange={(value) =>
                  column.setFilterValue((old: [string, string] | undefined) => [
                    old?.[0] ?? '',
                    String(value),
                  ])
                }
                className="filter-input"
              />
            </div>
          )
        }

        if (dataType === 'boolean') {
          return (
            <select
              className="filter-select"
              value={(filterValue ?? '').toString()}
              onChange={(e) => column.setFilterValue(e.target.value)}
            >
              <option value="">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          )
        }

        // string: low-cardinality columns become a select of their faceted values,
        // everything else gets a free-text search.
        const uniqueValues = Array.from(column.getFacetedUniqueValues().keys())
          .map(String)
          .sort()
        const isEnum = uniqueValues.length > 0 && uniqueValues.length <= 10

        if (isEnum) {
          return (
            <select
              className="filter-select"
              value={(filterValue ?? '').toString()}
              onChange={(e) => column.setFilterValue(e.target.value)}
            >
              <option value="">All</option>
              {uniqueValues.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          )
        }

        return (
          <DebouncedInput
            type="text"
            value={(filterValue ?? '') as string}
            onChange={(value) => column.setFilterValue(value)}
            placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
            className="filter-input"
          />
        )
      }}
    </table.Subscribe>
  )
}

// A typical debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const debouncedOnChange = useDebouncedCallback(onChange, { wait: debounce })

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => {
        setValue(e.target.value)
        debouncedOnChange(e.target.value)
      }}
    />
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
    <TanStackDevtools plugins={[tableDevtoolsPlugin()]} />
  </React.StrictMode>,
)
