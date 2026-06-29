---
name: preact/client-to-server
description: >
  Convert a client-side `@tanstack/preact-table` to server-side (a.k.a. manual)
  modes. Pass server-paginated data, set `manualSorting` / `manualFiltering` /
  `manualPagination` / `manualGrouping` / `manualExpanding` for whatever the
  server owns, supply `rowCount`, key external atoms for pagination/sorting/
  filters and trigger a refetch when they change. Routing keywords: server-side
  pagination, manual pagination, manualSorting, manualFiltering, rowCount,
  remote data preact.
type: lifecycle
library: tanstack-table
framework: preact
library_version: '9.0.0-alpha.48'
requires:
  - state-management
  - pagination
  - filtering
  - sorting
  - preact/table-state
sources:
  - TanStack/table:examples/preact/basic-external-atoms/src/main.tsx
  - TanStack/table:examples/preact/with-tanstack-query/src/main.tsx
  - TanStack/table:examples/preact/with-tanstack-query/src/fetchData.ts
  - TanStack/table:docs/framework/preact/guide/table-state.md
---

Client-side tables run sort/filter/paginate through registered row-model factories. Server-side tables let the server own those stages; the table just renders what the server returned and emits state changes that the app uses to refetch. Same `features`, same APIs — different ownership.

## The Manual Flags

Set the matching flag(s) to `true` to tell the table that the server (not the registered row-model factory) is doing that stage:

| Flag               | Owned by server         |
| ------------------ | ----------------------- |
| `manualPagination` | page slicing            |
| `manualSorting`    | row ordering            |
| `manualFiltering`  | column + global filters |
| `manualGrouping`   | group-by rows           |
| `manualExpanding`  | row expansion           |

The matching `*Feature` should still be in `features` so its state slice exists and its APIs work — you are only telling the row-model pipeline to skip the transform.

For pagination, supply `rowCount` so `table.getPageCount()` is correct. Optional but usually required for a UI.

Source: `examples/preact/with-tanstack-query/src/main.tsx`.

## Standard Pattern

Own the slices that drive the server request with external atoms. Subscribe to them with `useSelector` so the request key is reactive. Pass them through `options.atoms`. Trigger the refetch from the same atoms.

```tsx
import { useMemo } from 'preact/hooks'
import { useCreateAtom, useSelector } from '@tanstack/preact-store'
import {
  rowPaginationFeature,
  tableFeatures,
  useTable,
  type PaginationState,
} from '@tanstack/preact-table'

const features = tableFeatures({ rowPaginationFeature })

function App() {
  const paginationAtom = useCreateAtom<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const pagination = useSelector(paginationAtom)

  // Any data fetcher works — fetch / SWR / preact-query / a Suspense source.
  const { data: rowsPayload } = useSomeServerFetcher({
    queryKey: ['rows', pagination],
    queryFn: () => fetchRows(pagination),
  })

  const defaultData = useMemo(() => [], [])

  const table = useTable(
    {
      features, // no paginatedRowModel factory — server owns the slicing
      columns,
      data: rowsPayload?.rows ?? defaultData,
      rowCount: rowsPayload?.rowCount, // makes getPageCount() correct
      atoms: { pagination: paginationAtom },
      manualPagination: true,
    },
    (state) => state,
  )
  // ...
}
```

Source: `examples/preact/with-tanstack-query/src/main.tsx` (lines 56–86).

## All Three Slices Server-Owned

Same shape, more atoms. Compose `pagination + sorting + columnFilters + globalFilter` into the request key.

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

const { data } = useSomeServerFetcher({
  queryKey: ['rows', pagination, sorting, columnFilters, globalFilter],
  queryFn: () =>
    fetchRows({ pagination, sorting, columnFilters, globalFilter }),
})

const table = useTable({
  features, // no row-model factories — server owns every stage
  columns,
  data: data?.rows ?? EMPTY,
  rowCount: data?.rowCount,
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

When `manualFiltering: true`, both `columnFilters` and the global filter are treated as server-owned.

## Common Mistakes

### CRITICAL Setting `manualPagination` without `rowCount`

Wrong:

```tsx
useTable({
  features,
  columns,
  data: response?.rows ?? [],
  atoms: { pagination: paginationAtom },
  manualPagination: true,
  // no rowCount
})
table.getPageCount() // Infinity / wrong
```

Correct:

```tsx
useTable({
  features,
  columns,
  data: response?.rows ?? [],
  rowCount: response?.rowCount,
  atoms: { pagination: paginationAtom },
  manualPagination: true,
})
```

Without `rowCount` the table cannot know how many pages exist.
Source: `examples/preact/with-tanstack-query/src/main.tsx`.

### HIGH Keeping a client-side row-model factory when the server owns that stage

Wrong:

```tsx
const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(), // still runs; wasted work
})
useTable({ features, data: server.rows, manualPagination: true })
```

Correct:

```tsx
const features = tableFeatures({ rowPaginationFeature }) // no paginatedRowModel
useTable({
  features,
  data: server.rows,
  rowCount: server.rowCount,
  manualPagination: true,
})
```

With `manualPagination`, the paginated row model has nothing useful to do; omit it from `tableFeatures`. Same for `sortedRowModel` under `manualSorting`, `filteredRowModel` under `manualFiltering`.
Source: `examples/preact/with-tanstack-query/src/main.tsx`.

### HIGH Forgetting to key the request on the slices the server owns

Wrong:

```tsx
const { data } = useQuery({
  queryKey: ['rows'], // never changes
  queryFn: () => fetchRows(pagination),
})
```

Correct:

```tsx
const { data } = useQuery({
  queryKey: ['rows', pagination, sorting, columnFilters, globalFilter],
  queryFn: () =>
    fetchRows({ pagination, sorting, columnFilters, globalFilter }),
})
```

The request must vary by the slice values; otherwise the fetcher cache returns stale data when the user sorts or pages.
Source: `examples/preact/with-tanstack-query/src/main.tsx`.

### HIGH Page flashes empty between fetches

Wrong: the request resolves to `undefined` while loading, so the table shows zero rows between pages.

Correct: pass a stable `defaultData` and (with @tanstack/preact-query) `placeholderData: keepPreviousData`. The table re-uses the last page's rows during the fetch.

```tsx
import { keepPreviousData } from '@tanstack/preact-query'

const defaultData = useMemo(() => [], [])

const { data } = useQuery({
  queryKey: ['rows', pagination],
  queryFn: () => fetchRows(pagination),
  placeholderData: keepPreviousData,
})

const table = useTable({
  features,
  columns,
  data: data?.rows ?? defaultData,
  rowCount: data?.rowCount,
  atoms: { pagination: paginationAtom },
  manualPagination: true,
})
```

Source: `examples/preact/with-tanstack-query/src/main.tsx`.

### MEDIUM Removing the matching feature from `features`

Wrong:

```tsx
const features = tableFeatures({}) // dropped rowPaginationFeature
useTable({
  features,
  data: server.rows,
  rowCount: server.rowCount,
  manualPagination: true,
})
table.setPageIndex(0) // type error / no-op
```

Correct: keep the feature registered. `manualPagination: true` only tells the row-model pipeline to skip slicing — you still want the pagination state slice and `setPageIndex` / `nextPage` APIs.

```tsx
const features = tableFeatures({ rowPaginationFeature })
```

Source: `docs/guide/features.md`.

## See Also

- `tanstack-table/preact/compose-with-tanstack-query` — full @tanstack/preact-query recipe with keepPreviousData and refetch ergonomics.
- `tanstack-table/preact/table-state` — atoms vs state, table.Subscribe.
- `tanstack-table/pagination`, `tanstack-table/filtering`, `tanstack-table/sorting` — feature-level state shapes.
