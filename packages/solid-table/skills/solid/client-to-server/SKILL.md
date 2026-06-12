---
name: solid/client-to-server
description: >
  Convert a client-side `@tanstack/solid-table` to server-side. Lift the
  sort/filter/pagination state into Solid signals or external atoms (`createAtom`
  + `useSelector` from `@tanstack/solid-store`), set the corresponding
  `manual*` options, supply `rowCount`, and skip the matching row-model factory
  (the server already did that work).
type: lifecycle
library: tanstack-table
framework: solid
library_version: '9.0.0-alpha.48'
requires:
  - state-management
  - pagination
  - filtering
  - sorting
  - solid/table-state
sources:
  - docs/framework/solid/guide/table-state.md
  - examples/solid/basic-external-atoms/
  - examples/solid/with-tanstack-query/
---

# Client-to-Server — `@tanstack/solid-table`

When the server (not the browser) owns sort/filter/pagination, you need to
(a) lift those slices out of the table, (b) tell the table not to do that work
itself, and (c) keep the same UI APIs.

## Mental model

Each row-model stage has a `manual*` switch:

| Slice      | `manual*` option         | What the server now owns         |
| ---------- | ------------------------ | -------------------------------- |
| Pagination | `manualPagination: true` | Slicing rows to the current page |
| Sorting    | `manualSorting: true`    | Ordering rows                    |
| Filtering  | `manualFiltering: true`  | Column filters + global filter   |
| Grouping   | `manualGrouping: true`   | Group buckets                    |
| Expanding  | `manualExpanding: true`  | Subrow expansion                 |

When `manual*` is on:

- The matching row-model factory is **not required** — the server already did
  the work. Skip `createPaginatedRowModel()` for a paginated server endpoint.
- The table will not re-derive that slice. It hands you the new state through
  `on[State]Change` / external atoms and trusts the next `data` you give it.
- You typically need to provide `rowCount` so APIs like `table.getPageCount()`
  return the server's totals.

## Recommended pattern: external atoms + `useSelector`

External atoms are the cleanest cross-component pattern in Solid v9 — the
fetcher and the table can both subscribe to the same atoms.

```tsx
import {
  createTable,
  createColumnHelper,
  rowPaginationFeature,
  rowSortingFeature,
  columnFilteringFeature,
  tableFeatures,
  type PaginationState,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/solid-table'
import { createAtom, useSelector } from '@tanstack/solid-store'
import { createResource } from 'solid-js'

const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
  columnFilteringFeature,
})

const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})
const sortingAtom = createAtom<SortingState>([])
const filtersAtom = createAtom<ColumnFiltersState>([])

function ServerTable() {
  // Read each atom as an Accessor for fetcher dependency tracking
  const pagination = useSelector(paginationAtom)
  const sorting = useSelector(sortingAtom)
  const filters = useSelector(filtersAtom)

  const [resource] = createResource(
    () => ({
      pagination: pagination(),
      sorting: sorting(),
      filters: filters(),
    }),
    (params) =>
      fetch('/api/people?' + serialize(params)).then((r) =>
        r.json(),
      ) as Promise<{
        rows: Array<Person>
        rowCount: number
      }>,
  )

  const table = createTable({
    features,
    columns,
    get data() {
      return resource()?.rows ?? []
    },
    get rowCount() {
      return resource()?.rowCount ?? 0
    },
    atoms: {
      pagination: paginationAtom,
      sorting: sortingAtom,
      columnFilters: filtersAtom,
    },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  })

  return /* same JSX as a client table */
}
```

Anywhere else in the app you can also call `useSelector(paginationAtom)` to
read the same state — for a "Reset filters" header button, a URL-sync hook,
etc.

## Alternative: `state` + `on*Change` with `createSignal`

If you prefer not to introduce `@tanstack/solid-store`, use plain Solid signals.
Slightly less ergonomic for cross-component sharing.

```tsx
const [pagination, setPagination] = createSignal<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})
const [sorting, setSorting] = createSignal<SortingState>([])
const [filters, setFilters] = createSignal<ColumnFiltersState>([])

const table = createTable({
  features,
  columns,
  get data() {
    return resource()?.rows ?? []
  },
  get rowCount() {
    return resource()?.rowCount ?? 0
  },
  state: {
    get pagination() {
      return pagination()
    },
    get sorting() {
      return sorting()
    },
    get columnFilters() {
      return filters()
    },
  },
  onPaginationChange: setPagination,
  onSortingChange: setSorting,
  onColumnFiltersChange: setFilters,
  manualPagination: true,
  manualSorting: true,
  manualFiltering: true,
})
```

> Don't mix: providing both `atoms.pagination` and `state.pagination`+`onPaginationChange`
> for the same slice is ambiguous. The atom wins. Pick one.

## Pair with TanStack Query

`@tanstack/solid-query` is the canonical fetcher. See the
`compose-with-tanstack-query` skill for the full pattern — key the query on
your pagination/sort/filter accessors, use `keepPreviousData` to avoid
"0 rows" flashes between pages, and feed `data.rows` / `data.rowCount` into the
table.

## Partial server-side

You don't have to flip every switch. Mixed modes are valid:

- `manualPagination: true` + client-side sort/filter: server slices the page, browser orders + filters that slice (rare — usually fights you, but supported).
- `manualSorting: true` only: full dataset in the browser, but the server already ordered rows. Useful for very large pre-sorted dumps.
- `manualPagination: true` + `manualFiltering: true`, client-side `sortedRowModel`: filter + paginate server-side, sort the visible page in the browser.

When in doubt, flip them all and let the server own everything.

## Failure modes

### CRITICAL — flipped `manualPagination` without auditing filtering/sorting

If you only set `manualPagination: true` but still rely on a client `createFilteredRowModel`, the filter runs against the **current server page**, not the full dataset. Either also set `manualFiltering: true`, or have the server do the filtering and remove the client filter row-model.

### CRITICAL — forgot `rowCount`

Without `rowCount`, `table.getPageCount()` is computed from the local `data`
length, which under `manualPagination: true` is one page. `lastPage()`,
`canNextPage`, the page input — all wrong. Always supply
`get rowCount() { return resource()?.rowCount ?? 0 }`.

### HIGH — mixed ownership of the same slice

Providing both `atoms.pagination` and `state.pagination` / `onPaginationChange`
for the same slice is ambiguous. The atom wins; the `state`/`on*Change` is
silently ignored. Pick one ownership model per slice.

### HIGH — kept the client row-model factory after going manual

If you flipped `manualSorting: true`, keeping `sortedRowModel: createSortedRowModel()` in `tableFeatures()` does no harm but is dead weight in the bundle and confusing to readers. Remove it.

### MEDIUM — `data: data()` instead of `get data()`

Same Solid pitfall as a client table: `data` must be a tracked reactive read.
With a resource: `get data() { return resource()?.rows ?? [] }`.

### MEDIUM — paginating with `manualPagination` but rebuilding `data` reference unnecessarily

If `data` identity changes on every render (e.g. always returning a new `[]`
when loading), expect spurious row-model recomputes. Memoize a stable empty
fallback: `const empty: Array<Person> = []` outside the component, then
`get data() { return resource()?.rows ?? empty }`.

### MEDIUM — `autoResetPageIndex` surprise on data swap

When the underlying `data` reference changes, the paginator may reset
`pageIndex` to 0 by default. With a server-driven `pagination` atom you usually
don't want that — set `autoResetPageIndex: false` on the table options.

### LOW — assuming `getSelectedRowModel()` covers all rows

Under `manualPagination: true`, `getSelectedRowModel()` only walks the currently
loaded rows. If the user "selected all" across pages, the table cannot know
that — track that intent in your own atom and reconcile server-side.
