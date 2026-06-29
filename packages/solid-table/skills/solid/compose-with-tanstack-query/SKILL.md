---
name: solid/compose-with-tanstack-query
description: >
  Server-side data flow for `@tanstack/solid-table` with `@tanstack/solid-query`.
  Lift pagination/sort/filter into atoms (`createAtom` + `useSelector`), key
  `useQuery` on those accessors, use `keepPreviousData` to avoid the "0 rows
  flash", set `manualPagination` (etc.) on the table, supply `data.rows` via a
  reactive `get data()` getter, and feed `data.rowCount` via `get rowCount()`.
type: composition
library: tanstack-table
framework: solid
library_version: '9.0.0-alpha.48'
requires:
  - solid/client-to-server
  - pagination
  - state-management
sources:
  - examples/solid/with-tanstack-query/src/App.tsx
  - examples/solid/with-tanstack-query/src/fetchData.ts
  - docs/framework/solid/guide/table-state.md
---

# Compose with `@tanstack/solid-query`

`@tanstack/solid-query` (`useQuery`, `keepPreviousData`) is the canonical async
fetcher for a server-driven Solid table. The Solid example
`examples/solid/with-tanstack-query/` is the reference pattern.

## Install

```bash
pnpm add @tanstack/solid-query @tanstack/solid-store
```

Wrap your app in `<QueryClientProvider>` once at the root. The table itself
never imports from `@tanstack/solid-query` — it just sees the rows.

## Pattern

```tsx
import { keepPreviousData, useQuery } from '@tanstack/solid-query'
import { createAtom, useSelector } from '@tanstack/solid-store'
import {
  createTable,
  createColumnHelper,
  rowPaginationFeature,
  tableFeatures,
  FlexRender,
  type PaginationState,
} from '@tanstack/solid-table'
import { For } from 'solid-js'

const features = tableFeatures({ rowPaginationFeature })
const columnHelper = createColumnHelper<typeof features, Person>()
const columns = columnHelper.columns([
  columnHelper.accessor('firstName', { header: 'First Name' }),
  columnHelper.accessor('lastName', { header: 'Last Name' }),
  columnHelper.accessor('age', { header: 'Age' }),
])

// Module-scope atom — every component that needs pagination subscribes here.
const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})
const defaultRows: Array<Person> = []

function App() {
  const pagination = useSelector(paginationAtom)

  // 1. Query keyed on the atom's accessor. Solid Query re-runs on changes.
  const dataQuery = useQuery(() => ({
    queryKey: ['people', pagination()],
    queryFn: () => fetchData(pagination()),
    placeholderData: keepPreviousData,
  }))

  // 2. Hand server data + rowCount to the table via getters.
  const table = createTable({
    features,
    columns,
    get data() {
      return dataQuery.data?.rows ?? defaultRows
    },
    get rowCount() {
      return dataQuery.data?.rowCount
    },
    atoms: { pagination: paginationAtom },
    manualPagination: true,
  })

  return (
    <div>
      <table>
        <thead>
          <For each={table.getHeaderGroups()}>
            {(hg) => (
              <tr>
                <For each={hg.headers}>
                  {(h) => (
                    <th>
                      <FlexRender header={h} />
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
                  {(c) => (
                    <td>
                      <FlexRender cell={c} />
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>

      <button
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.previousPage()}
      >
        {'<'}
      </button>
      <button
        disabled={!table.getCanNextPage()}
        onClick={() => table.nextPage()}
      >
        {'>'}
      </button>
      <span>
        Page {pagination().pageIndex + 1} of {table.getPageCount()}
      </span>
      {dataQuery.isFetching ? <span>Loading...</span> : null}
    </div>
  )
}
```

## Why each piece is the way it is

- **`queryKey: ['people', pagination()]`** — the function-form `useQuery(() => ({ ... }))` is reactive. Calling `pagination()` inside it tracks the atom. When the user clicks "next page", the table writes to the atom, the query key changes, Solid Query fetches.
- **`placeholderData: keepPreviousData`** — without this, switching pages shows the loading state with zero rows, then "pops" to the next page. With it, the previous page stays visible until the new page resolves.
- **`atoms.pagination`** — sharing the atom between the query (read) and the table (read+write) is what wires the two together. No event bus, no `useEffect`.
- **`manualPagination: true`** — tells the table not to slice rows. The server already did.
- **No `paginatedRowModel`** — no factory needed for the manual slice. Do not register `paginatedRowModel` in `tableFeatures()` when `manualPagination: true`.
- **`rowCount`** — necessary so `table.getPageCount()`, `getCanNextPage()`, and `lastPage()` know the true total. Without it the table only sees one page of rows.

## Adding sorting and filtering

Same pattern. Lift each slice to its own atom, set the matching `manual*`, key
the query on every atom you depend on.

```tsx
const sortingAtom = createAtom<SortingState>([])
const filtersAtom = createAtom<ColumnFiltersState>([])
const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

const sorting = useSelector(sortingAtom)
const filters = useSelector(filtersAtom)
const pagination = useSelector(paginationAtom)

const dataQuery = useQuery(() => ({
  queryKey: [
    'people',
    { sorting: sorting(), filters: filters(), pagination: pagination() },
  ],
  queryFn: () =>
    fetchData({
      sorting: sorting(),
      filters: filters(),
      pagination: pagination(),
    }),
  placeholderData: keepPreviousData,
}))

const table = createTable({
  features: tableFeatures({
    rowPaginationFeature,
    rowSortingFeature,
    columnFilteringFeature,
  }),
  columns,
  get data() {
    return dataQuery.data?.rows ?? defaultRows
  },
  get rowCount() {
    return dataQuery.data?.rowCount
  },
  atoms: {
    sorting: sortingAtom,
    columnFilters: filtersAtom,
    pagination: paginationAtom,
  },
  manualSorting: true,
  manualFiltering: true,
  manualPagination: true,
})
```

## Mutations + cache invalidation

```tsx
import { useMutation, useQueryClient } from '@tanstack/solid-query'

const queryClient = useQueryClient()

const deleteRow = useMutation(() => ({
  mutationFn: (id: string) => fetch(`/api/people/${id}`, { method: 'DELETE' }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['people'] }),
}))
```

The table's atoms don't change; the query simply refetches with the same key.

## Failure modes

### CRITICAL — forgot `rowCount`

Without `rowCount`, `table.getPageCount()` returns 1 (it only sees one page's
worth of rows). Pagination controls misbehave.

### CRITICAL — forgot `manualPagination` (and friends)

If you don't set `manualPagination: true`, the table will try to paginate the
already-paginated server response (slicing the single page further). Same trap
for `manualSorting` / `manualFiltering`.

### HIGH — query key doesn't include the slices that drive the request

If `queryKey: ['people']` is static but pagination changes, the cache returns
the same page forever. Always include every atom value (or the whole filter
object) in the key.

### HIGH — `data: dataQuery.data?.rows ?? []` without a stable empty fallback

A fresh `[]` on every read changes the `data` identity → row models recompute.
Module-scope `const EMPTY: Array<Person> = []` and use `?? EMPTY`.

### HIGH — `placeholderData` left off

Without `keepPreviousData`, every page change blanks the table while the next
page loads. Almost always a regression UX.

### MEDIUM — reading `dataQuery.data?.rows` directly without the getter

```tsx
// ❌ Snapshots once
createTable({ /* ... */ data: dataQuery.data?.rows ?? EMPTY })

// ✅
createTable({
  /* ... */ get data() {
    return dataQuery.data?.rows ?? EMPTY
  },
})
```

### MEDIUM — `autoResetPageIndex` on

Default behavior resets `pageIndex` to 0 when `data` reference changes. With a
server-driven pagination atom you usually don't want that.

```tsx
createTable({ /* ... */ autoResetPageIndex: false })
```

### MEDIUM — calling `useQuery` with a static object

`useQuery({...})` (static form) doesn't track Solid signals. Use the function
form: `useQuery(() => ({...}))`. This is a Solid Query API rule, not a table
issue, but it's the most common breakage.

### LOW — `getSelectedRowModel` only walks loaded rows

Under server-side pagination, the table only knows about the current page.
"Select all" across pages must be tracked separately (e.g. a "select-all-mode"
atom + a list of explicit exclusions).
