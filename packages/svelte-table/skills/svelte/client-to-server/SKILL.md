---
name: svelte/client-to-server
description: >
  Convert a client-side Svelte table to server-side (manual) modes. Toggle `manualPagination`,
  `manualSorting`, `manualFiltering`, `manualGrouping`, `manualExpanding` for whatever the server
  owns, drop the matching row-model factory slots from `tableFeatures` and any `features` you no
  longer need, supply `rowCount` for the pager, then drive the request from `table.atoms.pagination`
  / `table.atoms.sorting` / etc. (or external atoms you own) using rune-aware getters
  (`get data()`, `get rowCount()`) so the table re-syncs in `$effect.pre`. Svelte 5+ only.
type: lifecycle
library: tanstack-table
framework: svelte
library_version: '9.0.0-alpha.48'
requires:
  - state-management
  - pagination
  - filtering
  - sorting
  - svelte/table-state
sources:
  - TanStack/table:examples/svelte/basic-external-atoms/
  - TanStack/table:examples/svelte/basic-external-state/
  - TanStack/table:examples/svelte/with-tanstack-query/
  - TanStack/table:docs/framework/svelte/guide/table-state.md
---

# Client → Server (Svelte)

You have a working client-side table. The dataset is too big to ship to the browser, or it
lives behind an API. You want sorting / filtering / pagination to run on the server while the
table still feels the same in the UI.

## Mental model

Each "manual mode" flag tells the table: **don't run this stage of the pipeline; trust the data
you receive.** You can mix modes freely — manual pagination + client-side sorting on the
already-paged window is perfectly valid for medium datasets.

| Flag               | Meaning                                      | What you must provide                                       |
| ------------------ | -------------------------------------------- | ----------------------------------------------------------- |
| `manualPagination` | Server owns slicing; do not paginate locally | `rowCount` (or `pageCount`)                                 |
| `manualSorting`    | Server owns ordering                         | Sort the server query by `sorting` state                    |
| `manualFiltering`  | Server owns row filtering                    | Filter the server query by `columnFilters` / `globalFilter` |
| `manualGrouping`   | Server returns already-grouped rows          | Pre-shaped data                                             |
| `manualExpanding`  | Server resolves sub-rows                     | Server-provided sub-row tree                                |

When a stage is manual, you can drop its row-model factory slot from `tableFeatures`. `manualPagination: true` does not need `paginatedRowModel: createPaginatedRowModel()` in the features object.

## Step 1 — Identify what's moving server-side

For a typical "search and paginate against a database" screen:

- Pagination → server
- Filtering (column filter inputs + a global search box) → server
- Sorting → server (usually, since a partial page can't be sorted client-side meaningfully)
- Selection / visibility / column ordering → still client

So the table keeps `rowSelectionFeature` etc., drops `columnFilteringFeature` /
`rowPaginationFeature` / `rowSortingFeature` _row models_ but keeps the _features_ so the
state slices and UI APIs still exist.

> Subtle point: keep the **feature** even if you drop the row model. The feature is what gives
> you `column.getCanSort()`, `table.setPageIndex()`, `column.setFilterValue()` — all the
> control-surface APIs. Dropping it kills the UI.

## Step 2 — Own the relevant state with external atoms

External atoms make state portable: the data layer (a fetch / query / store) can read the
same atoms the table writes to. Use `@tanstack/svelte-store`:

```ts
import { createAtom, useSelector } from '@tanstack/svelte-store'
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from '@tanstack/svelte-table'

const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})
const sortingAtom = createAtom<SortingState>([])
const filtersAtom = createAtom<ColumnFiltersState>([])

// For Svelte markup that should react to changes:
const pagination = useSelector(paginationAtom)
const sorting = useSelector(sortingAtom)
const filters = useSelector(filtersAtom)
```

## Step 3 — Configure the table

```svelte
<script lang="ts">
  import {
    columnFilteringFeature,
    createTable,
    rowPaginationFeature,
    rowSortingFeature,
    tableFeatures,
  } from '@tanstack/svelte-table'

  const features = tableFeatures({
    columnFilteringFeature,
    rowPaginationFeature,
    rowSortingFeature,
  })

  // No row-model factories for these — server owns them.
  const table = createTable({
    features,
    columns,
    get data() {
      return query.data?.rows ?? []
    },
    get rowCount() {
      return query.data?.rowCount
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
</script>
```

`rowCount` is what makes `table.getPageCount()` / `table.getCanNextPage()` correct under
manual pagination. Without it the pager has no idea how many pages exist.

## Step 4 — Drive the fetch from those atoms

Wire whatever data layer you use (TanStack Query, a raw `fetch`, SvelteKit `load`, etc.) to
read the atoms. With TanStack Query:

```ts
import { createQuery, keepPreviousData } from '@tanstack/svelte-query'

const dataQuery = createQuery<{ rows: Array<Person>; rowCount: number }>(
  () => ({
    queryKey: ['people', pagination.current, sorting.current, filters.current],
    queryFn: () =>
      fetch('/api/people', {
        method: 'POST',
        body: JSON.stringify({
          pageIndex: pagination.current.pageIndex,
          pageSize: pagination.current.pageSize,
          sorting: sorting.current,
          filters: filters.current,
        }),
      }).then((r) => r.json()),
    placeholderData: keepPreviousData,
  }),
)
```

`placeholderData: keepPreviousData` is what kills the "rows blank for one tick on every
page change" flash.

## Step 5 — Reset behavior

When the user changes a filter, you usually want to jump back to page 0. The table does this
automatically when client-side filtering owns the data, but with manual mode the data layer
controls it. Simplest fix: explicitly reset.

```ts
$effect(() => {
  // re-runs whenever filters.current identity changes
  filters.current
  table.setPageIndex(0)
})
```

Or wrap your filter `onChange` handlers to also call `table.setPageIndex(0)`.

## Step 6 — A note on global filtering

If you also support `globalFilterFeature`, debounce the input. `column.setFilterValue` and
`table.setGlobalFilter` fire per keystroke; without debouncing you fire one request per typed
character. See the `compose-with-tanstack-pacer` skill for the pattern.

## Hybrid example — manual pagination only

Sometimes you only paginate server-side and let the page-sized window sort/filter on the
client.

```ts
const table = createTable({
  features: tableFeatures({
    columnFilteringFeature,
    rowPaginationFeature,
    rowSortingFeature,
    filteredRowModel: createFilteredRowModel(), // client filters the page
    sortedRowModel: createSortedRowModel(), // client sorts the page
    filterFns,
    sortFns,
  }),
  columns,
  get data() {
    return query.data?.rows ?? []
  },
  get rowCount() {
    return query.data?.rowCount
  },
  atoms: { pagination: paginationAtom },
  manualPagination: true,
})
```

Only the manual flag for the stage you're moving server-side.

## Common failure modes

- **Forgot `rowCount`.** `table.getPageCount()` returns `-1`, the pager looks broken.
- **Dropped the feature, not just the row model.** Lost `column.getCanSort()` and friends.
  Keep the feature when you still need its UI APIs; only drop the row-model factory.
- **Both `state.pagination` and `atoms.pagination`.** Atoms silently win; the `on*Change`
  callback never fires.
- **Re-creating atoms inside reactive blocks.** Atoms must be stable across renders. Declare
  them at module / component-init scope, not inside `$derived` or `$effect`.
- **Forgetting to reset page on filter change.** Stay on page 12 of a now-2-page result set.
- **Plain `data: query.data?.rows`.** No getter, no reactivity. Use `get data()`.
- **Reimplementing pagination math.** `table.setPageIndex / nextPage / previousPage /
firstPage / lastPage / setPageSize / getCanNextPage / getCanPreviousPage / getPageCount`
  already exist and respect manual mode.

## Related skills

- `tanstack-table/svelte/compose-with-tanstack-query` — the same flow with a Query data layer.
- `tanstack-table/svelte/compose-with-tanstack-pacer` — debouncing filter inputs.
- `tanstack-table/svelte/compose-with-tanstack-store` — atom interop and per-slice subscription.
- `tanstack-table/core/pagination` / `filtering` / `sorting` — feature deep dives.
