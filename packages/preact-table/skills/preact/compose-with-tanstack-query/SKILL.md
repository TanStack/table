---
name: preact/compose-with-tanstack-query
description: >
  Server-side / async data flow with `@tanstack/preact-query`. Key the query on
  the table state that drives the request (pagination + sort + filters), pass
  `placeholderData: keepPreviousData` to avoid a "0 rows flash" between pages,
  set `manualPagination` / `manualSorting` / `manualFiltering` for the slices
  the server owns, supply `rowCount`, and let `table.set*` writes to external
  atoms re-key the query. Routing keywords: preact-query, server pagination,
  keepPreviousData, useQuery, manualPagination, rowCount, fetchData.
type: composition
library: tanstack-table
framework: preact
library_version: '9.0.0-alpha.48'
requires:
  - preact/client-to-server
  - pagination
  - state-management
sources:
  - TanStack/table:examples/preact/with-tanstack-query/src/main.tsx
  - TanStack/table:examples/preact/with-tanstack-query/src/fetchData.ts
  - TanStack/table:docs/framework/preact/guide/table-state.md
---

This skill is the @tanstack/preact-query recipe for server-side tables. Read `tanstack-table/preact/client-to-server` first for the manual-mode mechanics; this skill is the Preact Query-specific wiring on top.

## Install

```bash
npm install @tanstack/preact-query @tanstack/preact-table @tanstack/preact-store
```

## The Standard Recipe

Own the slices that drive the request with external atoms. Read them with `useSelector` so the `queryKey` is reactive. Pass them through `options.atoms`. Set `manual*` for the slices the server owns. Use `placeholderData: keepPreviousData` so pagination doesn't flash empty.

```tsx
import { useMemo, useReducer } from 'preact/hooks'
import { render } from 'preact'
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
  useQuery,
} from '@tanstack/preact-query'
import { useCreateAtom, useSelector } from '@tanstack/preact-store'
import {
  createColumnHelper,
  rowPaginationFeature,
  tableFeatures,
  useTable,
  type PaginationState,
} from '@tanstack/preact-table'
import { fetchData } from './fetchData'
import type { Person } from './fetchData'

const queryClient = new QueryClient()
const features = tableFeatures({ rowPaginationFeature })
const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('lastName', { header: 'Last Name' }),
  columnHelper.accessor('age', { header: 'Age' }),
])

function App() {
  const paginationAtom = useCreateAtom<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const pagination = useSelector(paginationAtom)

  const dataQuery = useQuery({
    queryKey: ['data', pagination],
    queryFn: () => fetchData(pagination),
    placeholderData: keepPreviousData, // no "0 rows" flash between pages
  })

  const defaultData = useMemo(() => [], [])

  const table = useTable(
    {
      features,
      columns,
      data: dataQuery.data?.rows ?? defaultData,
      rowCount: dataQuery.data?.rowCount,
      atoms: { pagination: paginationAtom },
      manualPagination: true, // server owns slicing; no row-model factory needed
    },
    (state) => state,
  )

  // table.nextPage() writes to paginationAtom → queryKey changes → refetch.
  return null
}

render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
  document.getElementById('root')!,
)
```

Source: `examples/preact/with-tanstack-query/src/main.tsx`.

## Server `fetchData` Shape

The fetcher returns the page of rows plus the total row count so `table.getPageCount()` is correct.

```ts
// fetchData.ts
import type { PaginationState } from '@tanstack/preact-table'

export type Person = {
  firstName: string
  lastName: string
  age: number /* … */
}

export async function fetchData(pagination: PaginationState): Promise<{
  rows: Person[]
  rowCount: number
}> {
  // server returns the current page and the total count
  const res = await fetch(
    `/api/people?page=${pagination.pageIndex}&size=${pagination.pageSize}`,
  )
  return res.json()
}
```

Source: `examples/preact/with-tanstack-query/src/fetchData.ts`.

## Adding Sorting and Filters

Add more external atoms; include them in the `queryKey`; set the matching `manual*` flag. The server's fetcher accepts whatever shape you forward.

```tsx
const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
})

const paginationAtom = useCreateAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})
const sortingAtom = useCreateAtom<SortingState>([])
const columnFiltersAtom = useCreateAtom<ColumnFiltersState>([])
const globalFilterAtom = useCreateAtom<string>('')

const pagination = useSelector(paginationAtom)
const sorting = useSelector(sortingAtom)
const columnFilters = useSelector(columnFiltersAtom)
const globalFilter = useSelector(globalFilterAtom)

const dataQuery = useQuery({
  queryKey: ['data', pagination, sorting, columnFilters, globalFilter],
  queryFn: () =>
    fetchData({ pagination, sorting, columnFilters, globalFilter }),
  placeholderData: keepPreviousData,
})

const table = useTable({
  features,
  columns,
  data: dataQuery.data?.rows ?? defaultData,
  rowCount: dataQuery.data?.rowCount,
  atoms: {
    pagination: paginationAtom,
    sorting: sortingAtom,
    columnFilters: columnFiltersAtom,
    globalFilter: globalFilterAtom,
  },
  manualPagination: true,
  manualSorting: true,
  manualFiltering: true,
})
```

## Common Mistakes

### CRITICAL `manualPagination` without `rowCount`

Wrong:

```tsx
useTable({
  /* … */,
  data: dataQuery.data?.rows ?? defaultData,
  manualPagination: true,
  atoms: { pagination: paginationAtom },
  // no rowCount
})
table.getPageCount() // Infinity
```

Correct: always pass `rowCount: dataQuery.data?.rowCount`.
Source: `examples/preact/with-tanstack-query/src/main.tsx`.

### CRITICAL `queryKey` that doesn't include reactive table state

Wrong:

```tsx
useQuery({
  queryKey: ['data'],
  queryFn: () => fetchData(pagination),
})
```

Correct:

```tsx
useQuery({
  queryKey: ['data', pagination /* + sorting, filters, etc. */],
  queryFn: () => fetchData(pagination),
})
```

The query cache must vary by the slice values, or you'll fetch once and never refresh on user interaction.
Source: `examples/preact/with-tanstack-query/src/main.tsx`.

### HIGH Missing `placeholderData: keepPreviousData`

Wrong: data goes `undefined` between pages; the table flashes empty.

Correct: include `placeholderData: keepPreviousData` so the table keeps the last page rendered until the new page resolves.
Source: `examples/preact/with-tanstack-query/src/main.tsx`.

### HIGH Inline `data: dataQuery.data?.rows ?? []`

Wrong:

```tsx
useTable({ /* … */, data: dataQuery.data?.rows ?? [] }) // new [] every render
```

Correct:

```tsx
const defaultData = useMemo(() => [], [])
useTable({ /* … */, data: dataQuery.data?.rows ?? defaultData })
```

A new empty array each render busts row-model memos.

### HIGH Keeping a client-side row-model factory when the server owns that stage

Wrong:

```tsx
const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(), // wasted work when manual
})
useTable({ features, /* … */, manualPagination: true })
```

Correct: omit the row-model factory for stages the server owns. With `manualPagination: true`, the server returns the page slice already.

```tsx
const features = tableFeatures({ rowPaginationFeature }) // no paginatedRowModel
useTable({ features, /* … */, manualPagination: true })
```

### MEDIUM Creating a new `paginationAtom` per render

Wrong: `createAtom(...)` inside the component body.

Correct: `useCreateAtom(...)` (or atom at module scope).
Source: `examples/preact/basic-external-atoms/src/main.tsx`.

## See Also

- `tanstack-table/preact/client-to-server` — manual-mode mechanics independent of any specific async lib.
- `tanstack-table/preact/compose-with-tanstack-store` — slice atoms and sharing state.
- `tanstack-table/preact/production-readiness` — narrow selectors, stable refs.
