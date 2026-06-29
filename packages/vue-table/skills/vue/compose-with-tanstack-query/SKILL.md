---
name: vue/compose-with-tanstack-query
description: >
  Server-side / async data flow for `@tanstack/vue-table` v9 + `@tanstack/vue-query`. Key the
  `useQuery` query on the table state that drives the request (pagination + sorting + filters).
  Set `manualPagination` / `manualSorting` / `manualFiltering` for slices the server owns.
  Omit the matching row model factory from `tableFeatures` (don't ship `paginatedRowModel` when
  the server paginates). Pass `rowCount` so `table.getPageCount()` works without all rows in
  memory. Pass `placeholderData: keepPreviousData` to avoid a "0 rows flash" between pages. The
  cleanest wiring uses external `createAtom`s + `options.atoms` so the table writes through to
  the atom and the query refetches with no `on[State]Change` plumbing. The canonical Vue example
  is at `examples/vue/with-tanstack-query/`.
type: composition
library: tanstack-table
framework: vue
library_version: '9.0.0-alpha.48'
requires:
  - vue/client-to-server
  - pagination
  - state-management
sources:
  - examples/vue/with-tanstack-query/src/App.tsx
  - examples/vue/with-tanstack-query/src/fetchData.ts
  - examples/vue/with-tanstack-query/src/useService.ts
---

# Compose @tanstack/vue-table with @tanstack/vue-query

## Dependencies

```bash
pnpm add @tanstack/vue-table @tanstack/vue-query @tanstack/vue-store
```

`@tanstack/vue-store` is the recommended way to own server-controlled state slices
(pagination / sorting / global filter). It removes the `on[State]Change` plumbing — the table
writes through to your atom, and the query refetches because the atom drives `queryKey`.

## Setup — paginated server table

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
import { fetchPeople } from './fetchData'

type Person = { firstName: string; lastName: string; age: number }

const features = tableFeatures({ rowPaginationFeature })
const columnHelper = createColumnHelper<typeof features, Person>()
const columns = columnHelper.columns([
  columnHelper.accessor('firstName', { header: 'First' }),
  columnHelper.accessor('age', { header: 'Age' }),
])

// 1) Own pagination state in an atom.
const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})
const pagination = useSelector(paginationAtom)

// 2) Vue Query: function-returning-options form ensures reactivity over pagination.value.
const dataQuery = useQuery(() => ({
  queryKey: ['people', pagination.value],
  queryFn: () => fetchPeople(pagination.value),
  placeholderData: keepPreviousData,
}))

// 3) Stable empty array — avoid `?? []` inline in options.
const EMPTY: Person[] = []
const tableData = computed<Person[]>(() => dataQuery.data.value?.rows ?? EMPTY)

// 4) Hold last known total so the pager doesn't reset during refetches.
const rowCount = ref(0)
watchEffect(() => {
  const next = dataQuery.data.value?.rowCount
  if (next != null) rowCount.value = next
})

// 5) Manual pagination. No paginatedRowModel in features — server paginates.
const table = useTable({
  features,
  columns,
  data: tableData,
  rowCount,
  atoms: { pagination: paginationAtom },
  manualPagination: true,
  // NOTE: no `onPaginationChange` — table.setPageIndex writes through to paginationAtom.
})
</script>

<template>
  <div>
    <table>
      <thead>
        <tr v-for="hg in table.getHeaderGroups()" :key="hg.id">
          <th v-for="h in hg.headers" :key="h.id">
            <FlexRender v-if="!h.isPlaceholder" :header="h" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.getRowModel().rows" :key="row.id">
          <td v-for="cell in row.getAllCells()" :key="cell.id">
            <FlexRender :cell="cell" />
          </td>
        </tr>
      </tbody>
    </table>

    <button
      @click="table.previousPage()"
      :disabled="!table.getCanPreviousPage()"
    >
      ‹
    </button>
    <span
      >Page {{ pagination.pageIndex + 1 }} of {{ table.getPageCount() }}</span
    >
    <button @click="table.nextPage()" :disabled="!table.getCanNextPage()">
      ›
    </button>
    <span v-if="dataQuery.isFetching.value">Loading…</span>
  </div>
</template>
```

Source: `examples/vue/with-tanstack-query/src/App.tsx`.

## Core Patterns

### 1. `useQuery` accepts a getter for reactive keys

```ts
// ✅ The function form re-evaluates whenever its reactive reads (pagination.value) change.
const dataQuery = useQuery(() => ({
  queryKey: ['people', pagination.value],
  queryFn: () => fetchPeople(pagination.value),
  placeholderData: keepPreviousData,
}))

// ❌ Object form with raw value — captured once, never refetches on pagination changes.
const dataQuery = useQuery({
  queryKey: ['people', pagination.value],
  queryFn: () => fetchPeople(pagination.value),
})
```

Vue Query's reactive options require the function form. This is unlike React Query's object
form — a common transcription error from copy-pasting React examples.

### 2. Why external atoms beat `state` + `on*Change` for Query

External atoms collapse two flows into one:

```ts
// Atom flow
table.nextPage()        // table writes to atom
  → paginationAtom.set( ... )
    → useSelector ref updates
      → queryKey changes
        → useQuery refetches
```

```ts
// state + on*Change flow (still supported; works fine)
table.nextPage()
  → onPaginationChange(updater)
    → setLocalPagination(updater)
      → ref updates
        → queryKey changes
          → useQuery refetches
```

Same end-to-end, but the atom version doesn't need `onPaginationChange` plumbing and a
sibling component can `useSelector(paginationAtom)` directly without prop-drilling.

### 3. Multiple server-controlled slices

```ts
const sortingAtom = createAtom<SortingState>([])
const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})
const filtersAtom = createAtom<ColumnFiltersState>([])

const sorting = useSelector(sortingAtom)
const pagination = useSelector(paginationAtom)
const filters = useSelector(filtersAtom)

const dataQuery = useQuery(() => ({
  queryKey: [
    'people',
    {
      sorting: sorting.value,
      pagination: pagination.value,
      filters: filters.value,
    },
  ],
  queryFn: () =>
    fetchPeople({
      sorting: sorting.value,
      pagination: pagination.value,
      filters: filters.value,
    }),
  placeholderData: keepPreviousData,
}))

const table = useTable({
  // server owns all three slices — no row model factories registered
  features: tableFeatures({
    rowSortingFeature,
    rowPaginationFeature,
    columnFilteringFeature,
  }),
  columns,
  data: computed(() => dataQuery.data.value?.rows ?? EMPTY),
  rowCount,
  atoms: {
    sorting: sortingAtom,
    pagination: paginationAtom,
    columnFilters: filtersAtom,
  },
  manualSorting: true,
  manualPagination: true,
  manualFiltering: true,
})
```

### 4. Mutations + `invalidateQueries`

```ts
import { useMutation, useQueryClient } from '@tanstack/vue-query'

const queryClient = useQueryClient()

const addPerson = useMutation({
  mutationFn: (person: Person) => savePerson(person),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['people'] })
  },
})
```

The table is a downstream consumer — it has no way to know the server data changed unless
Query tells it. Always invalidate on writes.

## Common Mistakes

### Omitting `manualPagination` / `manualSorting` / `manualFiltering` (CRITICAL)

```ts
// ❌ Table re-paginates the already-paginated server response.
useTable({
  features,
  columns,
  data: tableData,
  rowCount,
  atoms: { pagination: paginationAtom },
  // missing: manualPagination: true
})
```

The visible symptom is "Page 1 of 1, but I see 10 rows of a 1000-row dataset" — the table
slices the 10-row page locally.

### Missing `rowCount` (CRITICAL)

`getPageCount()` falls back to `Math.ceil(data.length / pageSize)` — which is `1` if the
server already paginated. The pager locks at "Page 1 of 1".

### Leaving `paginatedRowModel` registered with `manualPagination` (HIGH)

```ts
// ❌ Ships the factory for nothing AND it tries to paginate server-paginated data.
const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

// ✅ Omit the factory when the server paginates.
const features = tableFeatures({ rowPaginationFeature })
```

### Forgetting controlled state in `queryKey` (CRITICAL)

```ts
// ❌ Never refetches when the user pages.
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

Between fetches the table collapses to 0 rows, the row container collapses, scroll position
jumps. `keepPreviousData` keeps the previous page visible during the refetch.

### Passing `useQuery({...})` object form with reactive deps (HIGH — Vue-specific)

`@tanstack/vue-query` requires the function form `useQuery(() => ({ ... }))` for reactive
options. The object form snapshots once and never re-evaluates `queryKey`.

### Inline `?? []` in `data` option (MEDIUM)

```ts
// ❌ Fresh array identity every recompute → table option diff churns.
data: computed(() => dataQuery.data.value?.rows ?? [])

// ✅
const EMPTY: Person[] = []
const tableData = computed(() => dataQuery.data.value?.rows ?? EMPTY)
```

### Passing the same slice via both `state` and `atoms` (HIGH)

`atoms` wins; `state` is silently ignored. Pick one mechanism per slice.

### Hallucinating React Query in a Vue project (CRITICAL — top AI tell)

```ts
// ❌ React Query — wrong package for Vue.
import { useQuery, keepPreviousData } from '@tanstack/react-query'

// ✅
import { useQuery, keepPreviousData } from '@tanstack/vue-query'
```

Same hooks names, different reactivity model (function-returning-options instead of object).

### Hallucinating pre-v9 table APIs (CRITICAL)

`useVueTable` + `getCoreRowModel: getCoreRowModel()` is v8. v9 uses `useTable` + `features`
with row model factories as slots. See `tanstack-table/vue/migrate-v8-to-v9`.

### "API missing" because feature not in `features` (CRITICAL — v9-specific)

Server-side pagination still needs `rowPaginationFeature` in `tableFeatures({...})`. The
feature gives you `table.nextPage` / `table.setPageIndex` / `table.getPageCount`. The row
model factory (`paginatedRowModel`) is what you omit; the feature stays.

### Reimplementing pagination loop manually (CRITICAL — #1 AI tell)

```ts
// ❌ Hand-rolled — bypasses table invariants.
const nextPage = () => {
  paginationAtom.set({
    ...paginationAtom.get(),
    pageIndex: paginationAtom.get().pageIndex + 1,
  })
}

// ✅ Built-ins.
table.nextPage()
table.previousPage()
table.setPageIndex(0)
table.setPageSize(25)
```

## See Also

- `tanstack-table/vue/client-to-server` — manual modes + `rowCount`
- `tanstack-table/vue/compose-with-tanstack-store` — external atoms in depth
- `tanstack-table/vue/table-state` — reactivity model
- `tanstack-table/table-core/pagination` — `manualPagination` semantics
