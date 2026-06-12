import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTable,
  filterFns,
  globalFilteringFeature,
  metaHelper,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/solid-table'
import { createDebouncer } from '@tanstack/solid-pacer/debouncer'
import { compareItems, rankItem } from '@tanstack/match-sorter-utils'
import { For, createEffect, createSignal } from 'solid-js'
import { makeData } from './makeData'
import type { FilterFn, SortFn, TableFeatures } from '@tanstack/solid-table'
import type { Column } from '@tanstack/solid-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import type { Person } from './makeData'

interface FuzzyFilterMeta {
  itemRank?: RankingInfo
}

type FuzzyFeatures = TableFeatures & { filterMeta: FuzzyFilterMeta }

const fuzzyFilter: FilterFn<FuzzyFeatures, any> = (
  row,
  columnId,
  value,
  addMeta,
) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta?.({ itemRank })
  return itemRank.passed
}

const fuzzySort: SortFn<FuzzyFeatures, any> = (rowA, rowB, columnId) => {
  let dir = 0
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId].itemRank!,
      rowB.columnFiltersMeta[columnId].itemRank!,
    )
  }
  return dir === 0 ? sortFns.alphanumeric(rowA, rowB, columnId) : dir
}

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { ...filterFns, fuzzy: fuzzyFilter },
  sortFns: { ...sortFns, fuzzy: fuzzySort },
  filterMeta: metaHelper<FuzzyFilterMeta>(),
})

const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('id', {
    filterFn: 'equalsString',
  }),
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
    filterFn: 'includesStringSensitive',
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => <span>Last Name</span>,
    filterFn: 'includesString',
  }),
  columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
    id: 'fullName',
    header: 'Full Name',
    cell: (info) => info.getValue(),
    filterFn: 'fuzzy',
    sortFn: 'fuzzy',
  }),
])

function App() {
  const [data, setData] = createSignal<Array<Person>>(makeData(5_000))
  const refreshData = () => setData(makeData(5_000))
  const stressTest = () => setData(makeData(200_000))

  const table = createTable<typeof features, Person>({
    features,
    columns,
    get data() {
      return data()
    },
    globalFilterFn: 'fuzzy',
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })

  createEffect(() => {
    if (table.atoms.columnFilters.get()[0]?.id === 'fullName') {
      if (table.atoms.sorting.get()[0]?.id !== 'fullName') {
        table.setSorting([{ id: 'fullName', desc: false }])
      }
    }
  })

  return (
    <div class="demo-root">
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (200k rows)</button>
      </div>
      <div>
        <DebouncedInput
          value={(table.atoms.globalFilter.get() ?? '') as string}
          onChange={(value) => table.setGlobalFilter(String(value))}
          class="summary-panel"
          placeholder="Search all columns..."
        />
      </div>
      <div class="spacer-sm" />
      <table>
        <thead>
          <For each={table.getHeaderGroups()}>
            {(headerGroup) => (
              <tr>
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            class={
                              header.column.getCanSort()
                                ? 'sortable-header'
                                : ''
                            }
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <table.FlexRender header={header} />
                            {(
                              {
                                asc: ' 🔼',
                                desc: ' 🔽',
                              } as Record<string, string>
                            )[header.column.getIsSorted() as string] ?? null}
                          </div>
                          {header.column.getCanFilter() ? (
                            <div>
                              <Filter column={header.column} />
                            </div>
                          ) : null}
                        </>
                      )}
                    </th>
                  )}
                </For>
              </tr>
            )}
          </For>
        </thead>
        <tbody>
          <For each={table.getRowModel().rows}>
            {(row) => (
              <tr>
                <For each={row.getAllCells()}>
                  {(cell) => (
                    <td>
                      <table.FlexRender cell={cell} />
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
      <div class="spacer-sm" />
      <div class="controls">
        <button
          class="demo-button demo-button-sm"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          class="demo-button demo-button-sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          class="demo-button demo-button-sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          class="demo-button demo-button-sm"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span class="inline-controls">
          <div>Page</div>
          <strong>
            {(table.atoms.pagination.get().pageIndex + 1).toLocaleString()} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span class="inline-controls">
          | Go to page:
          <input
            type="number"
            value={table.atoms.pagination.get().pageIndex + 1}
            onInput={(e) => {
              const page = e.currentTarget.value
                ? Number(e.currentTarget.value) - 1
                : 0
              table.setPageIndex(page)
            }}
            class="page-size-input"
          />
        </span>
        <select
          value={table.atoms.pagination.get().pageSize}
          onChange={(e) => table.setPageSize(Number(e.currentTarget.value))}
        >
          <For each={[10, 20, 30, 40, 50]}>
            {(pageSize) => <option value={pageSize}>Show {pageSize}</option>}
          </For>
        </select>
      </div>
      <div>
        {table.getPrePaginatedRowModel().rows.length.toLocaleString()} Rows
      </div>
      <pre>{JSON.stringify(table.store.get(), null, 2)}</pre>
    </div>
  )
}

function Filter({ column }: { column: Column<typeof features, Person> }) {
  const columnFilterValue = () => column.getFilterValue()

  return (
    <DebouncedInput
      type="text"
      value={(columnFilterValue() ?? '') as string}
      onChange={(value) => column.setFilterValue(value)}
      placeholder="Search..."
      class="filter-select"
    />
  )
}

function DebouncedInput(props: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
  type?: string
  placeholder?: string
  class?: string
}) {
  const [value, setValue] = createSignal(props.value)

  createEffect(() => {
    setValue(props.value)
  })

  const onChangeDebouncer = createDebouncer(
    (nextValue: string | number) => props.onChange(nextValue),
    { wait: () => props.debounce ?? 500 },
  )

  createEffect(() => {
    onChangeDebouncer.maybeExecute(value())
  })

  return (
    <input
      type={props.type ?? 'text'}
      value={value()}
      onInput={(e) => setValue(e.currentTarget.value)}
      placeholder={props.placeholder}
      class={props.class}
    />
  )
}

export default App
