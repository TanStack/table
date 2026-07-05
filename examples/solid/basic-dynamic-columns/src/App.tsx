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
  filterFns,
  metaHelper,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/solid-table'
import { For, Show, createMemo, createSignal } from 'solid-js'
import { makeData } from './makeData'
import ColumnFilter from './ColumnFilter'
import type {
  ColumnDef,
  FilterFn,
  FilterFnOption,
  SortFnOption,
} from '@tanstack/solid-table'

// This example builds its columns from the DATA instead of a hard-coded definition.
// The row shape is treated as unknown (a generic Record). For each key we:
//   1. detect the value's data type at runtime,
//   2. pick a sortFn and filterFn that suit that type,
//   3. render a different filter component per type (see the branches in <ColumnFilter>).
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
  sortFns, // register the built-in sort fns so we can reference them by name
  filterFns, // register the built-in filter fns so we can reference them by name
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

function App() {
  const [data, setData] = createSignal<Array<DynamicRow>>(makeData(1_000))
  const refreshData = () => setData(makeData(1_000))
  const stressTest = () => setData(makeData(1_000_000))

  // 3. Derive the columns from the keys of the data instead of hard-coding them.
  const columns = createMemo<Array<ColumnDef<typeof features, DynamicRow>>>(
    () => {
      const rows = data()
      if (rows.length === 0) return []
      return Object.keys(rows[0]).map(
        (key): ColumnDef<typeof features, DynamicRow> => {
          const dataType = detectDataType(rows, key)
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

  // 4. Create the table instance with the derived columns and data. Solid's
  // fine-grained reactivity keeps the reactive reads fresh, so no Subscribe
  // workaround is needed (unlike the React version).
  const table = createTable({
    features,
    get data() {
      return data()
    },
    get columns() {
      return columns()
    },
    debugTable: true,
  })

  return (
    <div class="demo-root">
      <p class="demo-note">
        Columns, sort fns, filter fns, and filter components are all derived
        from the data type of each field, not from a hard-coded column
        definition.
      </p>
      <div class="button-row">
        <button class="demo-button demo-button-sm" onClick={refreshData}>
          Regenerate Data
        </button>
        <button class="demo-button demo-button-sm" onClick={stressTest}>
          Stress Test (1M rows)
        </button>
      </div>
      <div class="spacer-sm" />
      <div class="scroll-container">
        <table>
          <thead>
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <tr>
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <th colSpan={header.colSpan}>
                        <Show when={!header.isPlaceholder}>
                          <div
                            class={
                              header.column.getCanSort()
                                ? 'sortable-header'
                                : ''
                            }
                            onClick={header.column.getToggleSortingHandler()}
                            title={
                              header.column.getCanSort()
                                ? 'Toggle sorting'
                                : undefined
                            }
                          >
                            <FlexRender header={header} />
                            {{ asc: ' 🔼', desc: ' 🔽' }[
                              header.column.getIsSorted() as string
                            ] ?? null}
                          </div>
                          <Show when={header.column.getCanFilter()}>
                            <ColumnFilter
                              column={header.column}
                              table={table}
                            />
                          </Show>
                        </Show>
                      </th>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </thead>
          <tbody>
            <For each={table.getRowModel().rows.slice(0, 15)}>
              {(row) => (
                <tr>
                  <For each={row.getAllCells()}>
                    {(cell) => (
                      <td>
                        <FlexRender cell={cell} />
                      </td>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
      <div class="spacer-sm" />
      <div>{table.getRowModel().rows.length.toLocaleString()} Rows</div>
    </div>
  )
}

export default App
