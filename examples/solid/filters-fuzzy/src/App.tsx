import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTable,
  filterFns,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/solid-table'
import { compareItems, rankItem } from '@tanstack/match-sorter-utils'
import { For, createEffect, createSignal } from 'solid-js'
import { makeData } from './makeData'
import type { Column, FilterFn, SortFn } from '@tanstack/solid-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import type { Person } from './makeData'

const _features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
})

const columnHelper = createColumnHelper<typeof _features, Person>()

const fuzzyFilter: FilterFn<typeof _features, Person> = (
  row,
  columnId,
  value,
  addMeta,
) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta?.({ itemRank })
  return itemRank.passed
}

const fuzzySort: SortFn<typeof _features, Person> = (rowA, rowB, columnId) => {
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

declare module '@tanstack/solid-table' {
  interface FilterFns {
    fuzzy: FilterFn<typeof _features, Person>
  }
  interface FilterMeta {
    itemRank?: RankingInfo
  }
}

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
    sortFn: fuzzySort,
  }),
])

function App() {
  const [data, setData] = createSignal<Array<Person>>(makeData(5_000))
  const refreshData = () => setData(makeData(5_000))
  const stressTest = () => setData(makeData(100_000))

  const table = createTable<typeof _features, Person>({
    _features,
    _rowModels: {
      filteredRowModel: createFilteredRowModel({
        ...filterFns,
        fuzzy: fuzzyFilter,
      }),
      paginatedRowModel: createPaginatedRowModel(),
      sortedRowModel: createSortedRowModel(sortFns),
    },
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
    if (table.store.state.columnFilters[0]?.id === 'fullName') {
      if (table.store.state.sorting[0]?.id !== 'fullName') {
        table.setSorting([{ id: 'fullName', desc: false }])
      }
    }
  })

  return (
    <div class="demo-root">
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (100k rows)</button>
      </div>
      <div>
        <DebouncedInput
          value={(table.store.state.globalFilter ?? '') as string}
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
            {(table.store.state.pagination.pageIndex + 1).toLocaleString()} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span class="inline-controls">
          | Go to page:
          <input
            type="number"
            value={table.store.state.pagination.pageIndex + 1}
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
          value={table.store.state.pagination.pageSize}
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
      <pre>{JSON.stringify(table.store.state, null, 2)}</pre>
    </div>
  )
}

function Filter({ column }: { column: Column<typeof _features, Person> }) {
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

  createEffect(() => {
    const v = value()
    const timeout = setTimeout(() => {
      props.onChange(v)
    }, props.debounce ?? 500)
    return () => clearTimeout(timeout)
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
