---
name: svelte/compose-with-tanstack-query
description: >
  Server-side / async data flow with `@tanstack/svelte-query` and `@tanstack/svelte-table`.
  Key the `createQuery` on the table state that drives the request (pagination + sort +
  filters), pass `placeholderData: keepPreviousData` to avoid a "0 rows flash" between pages,
  set `manualPagination` (and optionally `manualSorting` / `manualFiltering`), supply
  `rowCount`, and feed the query result through reactive getters (`get data()`,
  `get rowCount()`). Own driver state with `$state` or `@tanstack/svelte-store` atoms.
  Svelte 5+ only.
type: composition
library: tanstack-table
framework: svelte
library_version: '9.0.0-alpha.48'
requires:
  - svelte/client-to-server
  - pagination
  - state-management
sources:
  - TanStack/table:examples/svelte/with-tanstack-query/
  - TanStack/table:docs/framework/svelte/guide/table-state.md
---

# Compose with TanStack Query (Svelte)

`@tanstack/svelte-query` and `@tanstack/svelte-table` complement each other naturally:

- **Query** owns server data — fetching, caching, retries, placeholder data.
- **Table** owns view state — pagination, sort, filters, selection.

The integration is short and predictable: drive the query key from the view state, manual-mode
the affected pipeline stages, pipe the result back through reactive getters.

## The pattern in 30 seconds

```svelte
<script lang="ts">
  import { createQuery, keepPreviousData } from '@tanstack/svelte-query'
  import {
    createTable,
    rowPaginationFeature,
    tableFeatures,
    type PaginationState,
  } from '@tanstack/svelte-table'

  const features = tableFeatures({ rowPaginationFeature })

  let pagination: PaginationState = $state({ pageIndex: 0, pageSize: 10 })

  const dataQuery = createQuery<{
    rows: Array<Person>
    rowCount: number
  }>(() => ({
    queryKey: ['people', pagination],
    queryFn: () => fetchPeople(pagination),
    placeholderData: keepPreviousData,
  }))

  const table = createTable({
    features,
    columns,
    get data() {
      return dataQuery.data?.rows ?? []
    },
    get rowCount() {
      return dataQuery.data?.rowCount
    },
    state: {
      get pagination() {
        return pagination
      },
    },
    onPaginationChange: (updater) => {
      pagination = typeof updater === 'function' ? updater(pagination) : updater
    },
    manualPagination: true,
  })
</script>
```

Three things to notice:

1. `queryKey` includes the driver state (`pagination`). Query re-fetches when the page or page
   size changes.
2. `placeholderData: keepPreviousData` keeps the previous page visible while the next page
   loads. Without it, `dataQuery.data?.rows` is `undefined` for one tick on every page change
   and the table flashes empty.
3. `manualPagination: true` tells the table the data is already paged. Without `rowCount` the
   pager has no idea how many pages exist.

## Driver-state ownership choices

You can drive the query from either:

- **Component `$state` + `state` + `on[State]Change`** (shown above) — simplest, mirrors
  what most v8 codebases look like after migration.
- **External `@tanstack/svelte-store` atoms + `atoms`** — preferable when the same state
  drives multiple components (a toolbar, a sidebar, a URL syncer).

```ts
import { createAtom, useSelector } from '@tanstack/svelte-store'

const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})
const pagination = useSelector(paginationAtom)

const dataQuery = createQuery(() => ({
  queryKey: ['people', pagination.current],
  queryFn: () => fetchPeople(pagination.current),
  placeholderData: keepPreviousData,
}))

const table = createTable({
  features,
  columns,
  get data() {
    return dataQuery.data?.rows ?? []
  },
  get rowCount() {
    return dataQuery.data?.rowCount
  },
  atoms: { pagination: paginationAtom },
  manualPagination: true,
})
```

`table.setPageIndex(2)` writes through `paginationAtom`, which invalidates `queryKey`, which
fetches page 3.

## Adding sort and filters

```ts
import type { ColumnFiltersState, SortingState } from '@tanstack/svelte-table'

let sorting: SortingState = $state([])
let filters: ColumnFiltersState = $state([])
let pagination: PaginationState = $state({ pageIndex: 0, pageSize: 10 })

const dataQuery = createQuery(() => ({
  queryKey: ['people', pagination, sorting, filters],
  queryFn: () => fetchPeople({ pagination, sorting, filters }),
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
    return dataQuery.data?.rows ?? []
  },
  get rowCount() {
    return dataQuery.data?.rowCount
  },
  state: {
    get pagination() {
      return pagination
    },
    get sorting() {
      return sorting
    },
    get columnFilters() {
      return filters
    },
  },
  onPaginationChange: (u) =>
    (pagination = typeof u === 'function' ? u(pagination) : u),
  onSortingChange: (u) => (sorting = typeof u === 'function' ? u(sorting) : u),
  onColumnFiltersChange: (u) =>
    (filters = typeof u === 'function' ? u(filters) : u),
  manualPagination: true,
  manualSorting: true,
  manualFiltering: true,
})
```

## Reset page on filter / sort change

Otherwise a user filters from "all 5000 people" to "5 named Alice" and stays on page 12.

```ts
$effect(() => {
  // re-run on identity change
  filters
  sorting
  table.setPageIndex(0)
})
```

## Debounce keystroke-driven filters

Without debouncing, a search input fires one request per character.

```ts
import { createDebouncer } from '@tanstack/svelte-pacer/debouncer'

const debouncedSetGlobalFilter = createDebouncer(
  (value: string) => table.setGlobalFilter(value),
  { wait: 250 },
)
```

```svelte
<input
  oninput={(e) => debouncedSetGlobalFilter.maybeExecute(e.currentTarget.value)}
/>
```

See the `compose-with-tanstack-pacer` skill for the full pacer pattern.

## Loading and empty states

`createQuery` exposes `isFetching`, `isPending`, `isError`, `data`. Use them around the
table, not inside the row loop.

```svelte
{#if dataQuery.isPending}
  <div>Loading…</div>
{:else if dataQuery.isError}
  <div>Failed: {dataQuery.error.message}</div>
{:else}
  <table>...</table>
{/if}

{#if dataQuery.isFetching}
  <small>Refreshing…</small>
{/if}
```

`isFetching` is helpful for the "loading next page" indicator while
`placeholderData: keepPreviousData` still shows the old rows.

## Optimistic updates (when you also mutate)

```ts
import { createMutation, useQueryClient } from '@tanstack/svelte-query'

const queryClient = useQueryClient()

const updatePerson = createMutation(() => ({
  mutationFn: (input: Partial<Person>) =>
    fetch(`/api/people/${input.id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['people'] }),
}))
```

After the mutation succeeds, `invalidateQueries` re-fetches; `placeholderData` keeps the old
rows visible during the refresh.

## SvelteKit `load` integration (a sketch)

If your table is on a SvelteKit page, `+page.ts` can hydrate the query cache with the first
page so SSR renders rows immediately. Subsequent pages still go through `createQuery`.

```ts
// +page.ts
export const load = async ({ fetch }) => {
  const initial = await fetchPeople({ pageIndex: 0, pageSize: 10 }, fetch)
  return { initial }
}
```

```svelte
<script lang="ts">
  let { data } = $props()
  // pass data.initial into placeholderData on first render
</script>
```

## Common failure modes

- **Forgot `rowCount`.** Pager shows zero pages.
- **No `placeholderData: keepPreviousData`.** Empty-table flash on every page change.
- **Forgot `manualPagination: true`.** Table tries to paginate the already-paged window.
  `getPageCount()` returns 1.
- **Driver state in `queryKey` is stale.** Always pass the current value, not a captured one.
- **No reset on filter change.** Stays on dead pages.
- **Plain `data: dataQuery.data?.rows`.** No reactivity — must be a getter.
- **Re-creating `createQuery` inside `$effect`.** It's a one-time call; create it at component init.
- **Reimplementing pagination math against `query.data` instead of calling
  `table.nextPage()`.** Don't.

## Related skills

- `tanstack-table/svelte/client-to-server` — base server-side pattern (without Query).
- `tanstack-table/svelte/compose-with-tanstack-store` — atom-based driver state.
- `tanstack-table/svelte/compose-with-tanstack-pacer` — debounce / throttle high-frequency inputs.
- `tanstack-table/core/pagination` — manual mode semantics.
