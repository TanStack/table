---
name: react/compose-with-tanstack-query
description: >
  Server-side / async data flow for `@tanstack/react-table` v9 with
  `@tanstack/react-query`. Canonical pattern: external pagination atom via
  `useCreateAtom<PaginationState>` + `options.atoms` (NOT `state + on*Change`),
  pagination object as part of `queryKey`, `manualPagination: true`,
  `placeholderData: keepPreviousData` to avoid the 0-rows flash, and
  `defaultData = useMemo(() => [], [])` to keep `data` reference stable
  between fetches. `rowCount` from the API response so `getPageCount()` works.
type: composition
library: tanstack-table
framework: react
library_version: '9.0.0-alpha.48'
requires:
  - react/client-to-server
  - pagination
  - react/table-state
sources:
  - TanStack/table:examples/react/with-tanstack-query/src/main.tsx
  - TanStack/table:examples/react/with-tanstack-query/src/fetchData.ts
---

This skill builds on `tanstack-table/state-management`, `tanstack-table/react/table-state`, and `tanstack-table/react/client-to-server`. Read those first — Query composition is `client-to-server` with a specific server.

## Why this pattern

A v9 React table written against TanStack Query has three load-bearing decisions:

1. **External pagination atom**, not `state` + `onPaginationChange`. Cleaner because the table writes to the atom directly; the query's `queryKey` watches the atom; refetches happen automatically.
2. **`placeholderData: keepPreviousData`** so the previous page stays visible while the next page fetches. Without it the table collapses to 0 rows on every page change and the scroll position jumps.
3. **Stable `data` fallback** (`defaultData = useMemo(() => [], [])`). `data: dataQuery.data?.rows ?? []` in JSX produces a new array each render and busts internal memos.

Source: `examples/react/with-tanstack-query/src/main.tsx`.

## Setup

```bash
pnpm add @tanstack/react-table @tanstack/react-query @tanstack/react-store
```

Mount one `<QueryClientProvider>` at the root:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
```

## Core Pattern — canonical server-paginated table

```tsx
import * as React from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useCreateAtom, useSelector } from '@tanstack/react-store'
import {
  useTable,
  tableFeatures,
  rowPaginationFeature,
  createColumnHelper,
} from '@tanstack/react-table'
import type { PaginationState } from '@tanstack/react-table'
import { fetchData } from './fetchData' // returns { rows, rowCount }
import type { Person } from './fetchData'

const features = tableFeatures({ rowPaginationFeature })

const columnHelper = createColumnHelper<typeof features, Person>()
const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (i) => i.getValue(),
  }),
  columnHelper.accessor('lastName', {
    header: 'Last Name',
    cell: (i) => i.getValue(),
  }),
  columnHelper.accessor('age', { header: 'Age' }),
  columnHelper.accessor('visits', { header: 'Visits' }),
  columnHelper.accessor('status', { header: 'Status' }),
  columnHelper.accessor('progress', { header: 'Profile Progress' }),
])

function App() {
  // 1) Pagination atom — stable identity via useCreateAtom.
  const paginationAtom = useCreateAtom<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  // 2) Subscribe so the query refetches on pagination changes.
  const pagination = useSelector(paginationAtom, (s) => s)

  // 3) Query keyed on the pagination object — refetch on every page/size change.
  const dataQuery = useQuery({
    queryKey: ['data', pagination],
    queryFn: () => fetchData(pagination),
    placeholderData: keepPreviousData, // 4) avoid 0-rows flash
  })

  // 5) Stable fallback — fresh `[]` in JSX would bust internal memos.
  const defaultData = React.useMemo(() => [], [])

  // 6) Manual pagination + rowCount; no row model factories needed.
  const table = useTable(
    {
      features,
      columns,
      data: dataQuery.data?.rows ?? defaultData,
      rowCount: dataQuery.data?.rowCount,
      atoms: { pagination: paginationAtom }, // table writes here directly
      manualPagination: true,
    },
    (state) => state,
  )

  return (
    <>
      <table>
        <thead>{/* table.FlexRender header={h} */}</thead>
        <tbody>{/* table.FlexRender cell={c} */}</tbody>
      </table>
      <div className="controls">
        <button
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span>
          Page{' '}
          <strong>
            {pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>
        <select
          value={pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
        >
          {[10, 20, 30, 40, 50].map((s) => (
            <option key={s} value={s}>
              Show {s}
            </option>
          ))}
        </select>
        {dataQuery.isFetching ? 'Loading...' : null}
      </div>
    </>
  )
}
```

Source: `examples/react/with-tanstack-query/src/main.tsx` (this is the canonical example, near-verbatim).

## Adding sort + filter

The same pattern extends to multiple slices. Key the query on each and set the matching `manual*` flag.

```tsx
const paginationAtom = useCreateAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})
const sortingAtom = useCreateAtom<SortingState>([])
const columnFiltersAtom = useCreateAtom<ColumnFiltersState>([])

const pagination = useSelector(paginationAtom)
const sorting = useSelector(sortingAtom)
const columnFilters = useSelector(columnFiltersAtom)

const dataQuery = useQuery({
  queryKey: ['data', { pagination, sorting, columnFilters }],
  queryFn: () => fetchData({ pagination, sorting, columnFilters }),
  placeholderData: keepPreviousData,
})

const table = useTable({
  features: tableFeatures({
    rowPaginationFeature,
    rowSortingFeature,
    columnFilteringFeature,
    // no row model factories — server owns sort/filter/paginate
  }),
  columns,
  data: dataQuery.data?.rows ?? defaultData,
  rowCount: dataQuery.data?.rowCount,
  atoms: {
    pagination: paginationAtom,
    sorting: sortingAtom,
    columnFilters: columnFiltersAtom,
  },
  manualSorting: true,
  manualFiltering: true,
  manualPagination: true,
})
```

## Mutations and invalidation

TanStack Table is a downstream consumer — it has no way to know the server data changed. Call `queryClient.invalidateQueries` after mutations:

```tsx
const queryClient = useQueryClient()
const addPerson = useMutation({
  mutationFn: createPerson,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['data'] }),
})
```

## Common Mistakes

### CRITICAL Forgetting `manualPagination` / `manualSorting` / `manualFiltering`

Wrong:

```tsx
const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(), // factory registered but server already paginated
})
const table = useTable({
  features,
  columns,
  data: query.data?.rows ?? [],
  // missing manualPagination
})
```

Correct:

```tsx
const features = tableFeatures({
  rowPaginationFeature,
  // no paginatedRowModel — server paginates
})
const table = useTable({
  features,
  columns,
  data: query.data?.rows ?? defaultData,
  rowCount: query.data?.rowCount,
  atoms: { pagination: paginationAtom },
  manualPagination: true,
})
```

Without `manualPagination: true`, the table re-paginates the server-already-paginated 10-row "dataset" — `getPageCount()` returns 1, and the pager locks at "Page 1 of 1".
Source: `examples/react/with-tanstack-query/src/main.tsx`.

### CRITICAL Missing `rowCount`

Wrong:

```tsx
const table = useTable({
  features,
  columns,
  data: query.data?.rows ?? defaultData,
  atoms: { pagination: paginationAtom },
  manualPagination: true,
  // missing rowCount
})
```

Correct:

```tsx
const table = useTable({
  features,
  columns,
  data: query.data?.rows ?? defaultData,
  rowCount: query.data?.rowCount, // ← required for accurate pager
  atoms: { pagination: paginationAtom },
  manualPagination: true,
})
```

`getPageCount()` falls back to `Math.ceil(data.length / pageSize)` — which equals 1 when the server returned one page.
Source: `examples/react/with-tanstack-query/src/main.tsx`.

### CRITICAL `queryKey` doesn't include the pagination state

Wrong:

```tsx
useQuery({
  queryKey: ['data'], // never changes
  queryFn: () => fetchData(pagination),
})
```

Correct:

```tsx
useQuery({
  queryKey: ['data', pagination], // refetch on pagination change
  queryFn: () => fetchData(pagination),
  placeholderData: keepPreviousData,
})
```

Query has no way to know its inputs changed unless they're in `queryKey`. Pager button clicks update the atom but the query never refetches.
Source: `examples/react/with-tanstack-query/src/main.tsx`.

### HIGH Skipping `placeholderData: keepPreviousData`

Wrong:

```tsx
useQuery({
  queryKey: ['data', pagination],
  queryFn: () => fetchData(pagination),
})
// Between pages: table renders 0 rows, container collapses, scroll position jumps.
```

Correct:

```tsx
useQuery({
  queryKey: ['data', pagination],
  queryFn: () => fetchData(pagination),
  placeholderData: keepPreviousData, // previous page stays visible while fetching
})
```

The previous page renders during the fetch — no flash, no jump.
Source: `examples/react/with-tanstack-query/src/main.tsx`.

### HIGH Recreating `data: query.data?.rows ?? []` in JSX

Wrong:

```tsx
const table = useTable({
  features,
  columns,
  data: query.data?.rows ?? [], // new identity every render
  // ...
})
```

Correct:

```tsx
const defaultData = React.useMemo(() => [], [])
// or: const EMPTY: Person[] = [] at module scope

const table = useTable({
  features,
  columns,
  data: query.data?.rows ?? defaultData,
  // ...
})
```

`?? []` creates a fresh array reference each render, busting internal memos that depend on `data` identity.
Source: `examples/react/with-tanstack-query/src/main.tsx` (uses `useMemo`).

### HIGH Mixing `state.pagination` + `onPaginationChange` AND `atoms.pagination`

Wrong:

```tsx
useTable({
  features,
  columns,
  data,
  state: { pagination }, // silently ignored
  onPaginationChange: setPagination, // silently ignored
  atoms: { pagination: paginationAtom }, // wins
  manualPagination: true,
})
```

Correct:

```tsx
// Pick one. The atom pattern is canonical for Query.
useTable({
  features,
  columns,
  data,
  atoms: { pagination: paginationAtom },
  manualPagination: true,
})
```

Precedence is `atoms` > `state` > internal. The `state` plumbing is dead.
Source: `examples/react/basic-external-atoms/src/main.tsx`.

### HIGH Forgetting `invalidateQueries` after mutations

Wrong:

```tsx
const addPerson = useMutation({
  mutationFn: createPerson,
  // missing onSuccess invalidation
})
// Table never sees the new row.
```

Correct:

```tsx
const queryClient = useQueryClient()
const addPerson = useMutation({
  mutationFn: createPerson,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['data'] }),
})
```

The table is downstream of Query. Mutations must invalidate the relevant query keys.
Source: docs/framework/react/react-query.

### MEDIUM Leaving `paginatedRowModel` registered when the server paginates

Wrong:

```tsx
const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(), // ships unused code
})
```

Correct:

```tsx
const features = tableFeatures({
  rowPaginationFeature,
  // no paginatedRowModel — server paginates
})
```

Bundle waste plus a foot-gun if `manualPagination` is ever flipped off.
Source: `examples/react/with-tanstack-query/src/main.tsx`.

## See Also

- `tanstack-table/react/client-to-server` — the underlying manual-mode mechanics.
- `tanstack-table/react/compose-with-tanstack-store` — owning state slices via atoms.
- `tanstack-table/react/compose-with-tanstack-virtual` — infinite scroll = Virtual + `useInfiniteQuery`.
- `tanstack-table/react/compose-with-tanstack-pacer` — debounce filter writes that feed the query.
