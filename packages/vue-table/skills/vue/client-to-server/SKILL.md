---
name: vue/client-to-server
description: >
  Convert a client-side `@tanstack/vue-table` to server-side. Set `manualPagination` /
  `manualSorting` / `manualFiltering` / `manualGrouping` / `manualExpanding` for whichever
  slices the server owns; omit the matching row model factory from `tableFeatures` (don't ship
  `paginatedRowModel` when the server paginates); supply `rowCount` so `table.getPageCount()`
  works; own the relevant state slices via either external atoms (`@tanstack/vue-store`
  `createAtom` + `options.atoms`) or `state` + `on[State]Change` with getter wrappers. Key any
  data fetch (TanStack Query / fetch / rxResource alternative) on the controlled state and use
  `placeholderData: keepPreviousData` (or equivalent) to avoid a 0-rows flash between pages.
type: lifecycle
library: tanstack-table
framework: vue
library_version: '9.0.0-alpha.48'
requires:
  - state-management
  - pagination
  - filtering
  - sorting
sources:
  - examples/vue/basic-external-atoms/
  - examples/vue/basic-external-state/
  - examples/vue/with-tanstack-query/
  - docs/framework/vue/guide/table-state.md
---

# Client-to-Server Conversion (Vue)

## Dependencies

```bash
pnpm add @tanstack/vue-table @tanstack/vue-store
# Recommended fetch layer:
pnpm add @tanstack/vue-query
```

External atoms (`@tanstack/vue-store`) are recommended for server-managed slices. They cut the
`on[State]Change` plumbing entirely — the table writes to the atom; the query keys on the atom.

## Setup — minimal server-paginated table

```vue
<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { createAtom, useSelector } from '@tanstack/vue-store'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import {
  FlexRender,
  createColumnHelper,
  rowPaginationFeature,
  tableFeatures,
  useTable,
  type PaginationState,
} from '@tanstack/vue-table'
import { fetchPeople } from './api'

type Person = { firstName: string; lastName: string; age: number }

const features = tableFeatures({ rowPaginationFeature })
const columnHelper = createColumnHelper<typeof features, Person>()
const columns = columnHelper.columns([
  columnHelper.accessor('firstName', { header: 'First' }),
  columnHelper.accessor('lastName', { header: 'Last' }),
  columnHelper.accessor('age', { header: 'Age' }),
])

// 1) Own pagination in an external atom. Cheap for the table to write through.
const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})
const pagination = useSelector(paginationAtom)

// 2) Key the query on the atom value. table.setPageIndex(...) writes to the atom
//    → useSelector re-evaluates → useQuery refetches.
const dataQuery = useQuery(() => ({
  queryKey: ['people', pagination.value],
  queryFn: () => fetchPeople(pagination.value),
  placeholderData: keepPreviousData, // avoid "0 rows" flash between pages
}))

const tableData = computed<Person[]>(() => dataQuery.data.value?.rows ?? [])
const rowCount = ref(0)
watchEffect(() => {
  const next = dataQuery.data.value?.rowCount
  if (next != null) rowCount.value = next // keep last known total for pager UI
})

// 3) Manual pagination + `rowCount`. No paginatedRowModel in features — server paginates.
const table = useTable({
  features,
  columns,
  data: tableData,
  rowCount,
  atoms: { pagination: paginationAtom },
  manualPagination: true,
})
</script>
```

Source: `examples/vue/with-tanstack-query/src/App.tsx`, `examples/vue/basic-external-atoms/`.

## Core Patterns

### 1. The `manual*` flag + factory omission pair

Pick which slices live server-side and flip the matching `manual*` flag. **Also omit the
matching row model factory from `tableFeatures`** — otherwise the table re-processes
server-processed rows.

| Server owns | Set                      | Omit from `tableFeatures` |
| ----------- | ------------------------ | ------------------------- |
| Pagination  | `manualPagination: true` | `paginatedRowModel`       |
| Sorting     | `manualSorting: true`    | `sortedRowModel`          |
| Filtering   | `manualFiltering: true`  | `filteredRowModel`        |
| Grouping    | `manualGrouping: true`   | `groupedRowModel`         |
| Expanding   | `manualExpanding: true`  | `expandedRowModel`        |

Column visibility / ordering / pinning / row selection are client-side state and stay as-is.

### 2. `rowCount` so `getPageCount()` works

Without `rowCount`, `getPageCount()` falls back to `Math.ceil(data.length / pageSize)` — i.e.
`1` if the server already paginated. The pager locks at "Page 1 of 1".

```ts
useTable({
  features,
  columns,
  data: tableData,
  rowCount: dataQuery.data.value?.rowCount, // or a stable ref/computed
  atoms: { pagination: paginationAtom },
  manualPagination: true,
})
```

If `rowCount` isn't immediately available, hold the last known value in a `ref` and update via
`watchEffect` so the pager doesn't reset to 0 during refetches.

### 3. Two state-ownership shapes (pick one per slice)

**External atoms (recommended with Query).** Table writes through to the atom. No
`on[State]Change` needed.

```ts
const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})
useTable({
  features,
  columns,
  data,
  rowCount,
  atoms: { pagination: paginationAtom },
  manualPagination: true,
})
```

**Classic `state` + `on[State]Change` with getters.** Required when migrating from v8 or
integrating with existing Vue ref-based state. Each slice must be a getter so Vue tracks
`.value`.

```ts
const pagination = ref<PaginationState>({ pageIndex: 0, pageSize: 10 })

useTable({
  features,
  columns,
  data,
  rowCount,
  state: {
    get pagination() {
      return pagination.value
    },
  },
  onPaginationChange: (u) => {
    pagination.value = typeof u === 'function' ? u(pagination.value) : u
  },
  manualPagination: true,
})
```

**Precedence:** `atoms[slice]` > `state[slice]` > internal `baseAtoms[slice]`. Don't pass the
same slice through both — the atoms wins silently.

### 4. Cache keys must include controlled state

```ts
const sortingAtom = createAtom<SortingState>([])
const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})
const sorting = useSelector(sortingAtom)
const pagination = useSelector(paginationAtom)

const dataQuery = useQuery(() => ({
  queryKey: [
    'people',
    { sorting: sorting.value, pagination: pagination.value },
  ],
  queryFn: () =>
    fetchPeople({ sorting: sorting.value, pagination: pagination.value }),
  placeholderData: keepPreviousData,
}))
```

If pagination/sort/filter aren't in `queryKey`, Query won't refetch when the user clicks a
pager button — the buttons "do nothing" from the user's POV.

### 5. Mixed client + server features still work

Column visibility, ordering, pinning, and row selection are client state — they don't depend
on the row model and continue to function with `manualPagination`/`manualSorting`/`manualFiltering`.
You can have a server-paginated table where the user pins or hides columns locally.

## Common Mistakes

### Forgetting `manualPagination` / `manualSorting` / `manualFiltering` (CRITICAL)

The table double-processes server-processed rows. If the server returned page 2 of 50,
the table will paginate that 10-row slice again and show "Page 1 of 1".

```ts
// ❌
useTable({
  features,
  columns,
  data: serverPage.rows,
  rowCount,
  atoms: { pagination: paginationAtom },
  // missing: manualPagination: true
})
```

### Leaving `paginatedRowModel` registered when server paginates (CRITICAL)

```ts
// ❌ Factory ships for nothing AND the table re-paginates server-sliced data.
const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

// ✅ Omit the factory when the server paginates; keep the feature for its API.
const features = tableFeatures({ rowPaginationFeature })
```

Same applies to `sortedRowModel`, `filteredRowModel`, `groupedRowModel`, `expandedRowModel`
when the server owns the slice.

### Omitting `rowCount` (CRITICAL)

`getPageCount()` returns `1` if the server already paginated. The pager UI locks at
"Page 1 of 1" and users can't navigate.

### Passing `state.pagination` without `onPaginationChange` (CRITICAL)

```ts
// ❌ table.setPageIndex(2) is a no-op — no writeback handler.
const pagination = ref({ pageIndex: 0, pageSize: 10 })
useTable({
  features,
  columns,
  data,
  rowCount,
  state: {
    get pagination() {
      return pagination.value
    },
  },
  manualPagination: true,
})

// ✅ Either pair `state` with `on[State]Change`, OR use `atoms`.
```

### Mixing `state.pagination` AND `atoms.pagination` for the same slice (HIGH)

```ts
useTable({
  // ...
  state: {
    get pagination() {
      return localPagination.value
    },
  }, // silently ignored
  onPaginationChange: setLocalPagination, // silently ignored
  atoms: { pagination: paginationAtom }, // wins
})
```

Atoms beat `state`; the `state` plumbing is dead but lingering in the code. Pick one mechanism.

### Forgetting to include controlled state in `queryKey` (CRITICAL)

```ts
// ❌ Never refetches when pagination changes.
useQuery(() => ({
  queryKey: ['people'],
  queryFn: () => fetchPeople(pagination.value),
}))

// ✅
useQuery(() => ({
  queryKey: ['people', pagination.value],
  queryFn: () => fetchPeople(pagination.value),
}))
```

### Skipping `placeholderData: keepPreviousData` (HIGH)

Between fetches the table collapses to 0 rows, the row container collapses, and scroll
position jumps. `keepPreviousData` keeps the previous page visible during the refetch.

### Passing a raw `ref` to `state.pagination` without a getter (CRITICAL — Vue-specific)

```ts
// ❌ Vue can't track .value changes on the captured ref object.
state: { pagination: pagination }

// ✅
state: { get pagination() { return pagination.value } }
```

### Hand-rolling sort/page state instead of using the API (CRITICAL — #1 AI tell)

```ts
// ❌ Manual state machine.
const pageIndex = ref(0)
const next = () => {
  pageIndex.value++
  refetch()
}

// ✅ Built-ins.
table.nextPage()
table.setPageIndex(0)
table.setSorting([{ id: 'age', desc: true }])
table.setColumnFilters(/* ... */)
```

### "API missing" because the feature isn't in `features` (CRITICAL — v9-specific)

Server-side pagination still needs `rowPaginationFeature` in `tableFeatures({...})` — that's
what surfaces `table.setPageIndex`, `table.nextPage`, `table.getPageCount`. The row model
factory (`paginatedRowModel`) is what you omit; the feature stays.

```ts
const features = tableFeatures({ rowPaginationFeature }) // ✅ even with manualPagination
```

## See Also

- `tanstack-table/vue/compose-with-tanstack-query` — the Query-specific wiring
- `tanstack-table/vue/compose-with-tanstack-store` — external atoms in depth
- `tanstack-table/vue/table-state` — getter rule, atom precedence
- `tanstack-table/table-core/pagination` — `manualPagination` / `rowCount` semantics
