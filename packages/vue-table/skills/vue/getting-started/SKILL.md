---
name: vue/getting-started
description: >
  End-to-end first-table walkthrough for `@tanstack/vue-table` v9. Install the adapter, declare
  `features` via `tableFeatures({})` (row model factories and fn registries live here as slots),
  build a column helper with both `TFeatures` and `TData` generics, instantiate
  `useTable(options, selector?)` from a `<script setup>` block, and render with
  `<FlexRender :cell="cell" />` / `:header="header"`. New users land here, not on legacy v8
  names like `useVueTable`.
type: lifecycle
library: tanstack-table
framework: vue
library_version: '9.0.0-alpha.48'
requires:
  - setup
  - column-definitions
  - state-management
  - vue/table-state
sources:
  - docs/installation.md
  - docs/framework/vue/vue-table.md
  - docs/framework/vue/guide/table-state.md
  - examples/vue/basic-use-table/
  - examples/vue/basic-use-app-table/
  - packages/vue-table/src/useTable.ts
---

# Getting Started with @tanstack/vue-table v9

## Dependencies

```bash
pnpm add @tanstack/vue-table vue
# Optional: external atoms / shared state
pnpm add @tanstack/vue-store
```

Vue 3 only. There is no `/legacy` entrypoint for Vue (that exists only for React); migrating
from v8 is a direct rewrite — see `tanstack-table/vue/migrate-v8-to-v9`.

## Setup — minimum viable table

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  FlexRender,
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'

type Person = { firstName: string; lastName: string; age: number }

// Stable identities — declare at module scope (outside <script setup> blocks).
const features = tableFeatures({}) // required — even when no features are used
const columnHelper = createColumnHelper<typeof features, Person>() // note: TWO generics

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', { header: 'First' }),
  columnHelper.accessor('lastName', { header: 'Last' }),
  columnHelper.accessor('age', { header: 'Age' }),
])

const data = ref<Person[]>([
  { firstName: 'tanner', lastName: 'linsley', age: 24 },
  { firstName: 'kevin', lastName: 'vandy', age: 28 },
])

const table = useTable({
  features,
  columns,
  data,
})
</script>

<template>
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
</template>
```

Source: `examples/vue/basic-use-table/src/App.tsx`, `docs/framework/vue/vue-table.md`.

### What's mandatory in v9

- `features` — built via `tableFeatures({...})`. Empty object is fine for a no-features table,
  but the option key must exist. Row model factories and fn registries go here as slots, not
  as a separate `rowModels` option.
- `createColumnHelper<typeof features, Person>()` — two generics, in that order. The v8 single
  generic does not compile.

## Core Patterns

### 1. Add a feature: sorting

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  FlexRender,
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})
const columnHelper = createColumnHelper<typeof features, Person>()
const columns = columnHelper.columns([
  columnHelper.accessor('firstName', { header: 'First' }),
  columnHelper.accessor('age', { header: 'Age' }),
])

const data = ref<Person[]>([])

const table = useTable({
  features,
  columns,
  data,
})
</script>

<template>
  <thead>
    <tr v-for="hg in table.getHeaderGroups()" :key="hg.id">
      <th
        v-for="h in hg.headers"
        :key="h.id"
        :class="{ sortable: h.column.getCanSort() }"
        @click="h.column.getToggleSortingHandler()?.($event)"
      >
        <FlexRender v-if="!h.isPlaceholder" :header="h" />
        <span v-if="h.column.getIsSorted() === 'asc'"> 🔼</span>
        <span v-if="h.column.getIsSorted() === 'desc'"> 🔽</span>
      </th>
    </tr>
  </thead>
</template>
```

Three rules:

1. Register the feature in `features` (`rowSortingFeature`) along with its row model factory
   and fn registry as slots on the same object.
2. The fn registry (`sortFns`) is what makes filter/sort registries tree-shakeable in v9 — do
   not drop it.
3. Wire UI to the built-in API: `column.getToggleSortingHandler()`, `column.getIsSorted()`.
   Do not reimplement sort logic.

Source: `docs/framework/vue/vue-table.md`, `examples/vue/sorting/`.

### 2. Compose features: pagination + filtering on top of sorting

```ts
import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/vue-table'

const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  columnFilteringFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
  filterFns,
})
```

Then use `table.nextPage()`, `table.setPageIndex(0)`, `table.setColumnFilters(...)`,
`table.setSorting(...)`. The library exposes a state-transition API for every feature — use it.

### 3. App-scoped tables with `createTableHook`

If multiple tables in your app share a `features` object (with its row model factories and conventions), prefer
`createTableHook`. The hook factory returns `useAppTable`, `createAppColumnHelper`, plus
context helpers (`useTableContext`, `useCellContext`, `useHeaderContext`).

```ts
// src/hooks/table.ts
import {
  createPaginatedRowModel,
  createSortedRowModel,
  createTableHook,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/vue-table'

const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
})

export const { useAppTable, createAppColumnHelper } = createTableHook({
  features,
})
```

```vue
<script setup lang="ts">
import { useAppTable, createAppColumnHelper } from '@/hooks/table'
import { ref } from 'vue'

const columnHelper = createAppColumnHelper<Person>()
const columns = columnHelper.columns([
  columnHelper.accessor('firstName', { header: 'First' }),
])

const data = ref<Person[]>([])
const table = useAppTable({ columns, data })
</script>

<template>
  <table>
    <thead>
      <tr v-for="hg in table.getHeaderGroups()" :key="hg.id">
        <th v-for="h in hg.headers" :key="h.id">
          <component :is="table.FlexRender" :header="h" />
        </th>
      </tr>
    </thead>
  </table>
</template>
```

Source: `examples/vue/basic-use-app-table/src/App.vue`,
`examples/vue/composable-tables/src/hooks/table.ts`.

### 4. JSX render functions when templates get noisy

Vue's JSX support is fine — pass `cell`/`header` props to `<FlexRender>` and the rest is the same.

```tsx
// App.tsx
import { defineComponent, ref } from 'vue'
import { FlexRender, tableFeatures, useTable } from '@tanstack/vue-table'

const features = tableFeatures({})

export default defineComponent({
  setup() {
    const data = ref<Person[]>([])
    const table = useTable({
      features,
      columns,
      get data() {
        return data.value
      },
    })

    return () => (
      <table>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getAllCells().map((cell) => (
                <td key={cell.id}>
                  <FlexRender cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  },
})
```

Source: `examples/vue/basic-use-table/src/App.tsx`.

## Common Mistakes

### Omitting `features` (CRITICAL)

```ts
// ❌ TS error: Property 'features' is missing in type ...
const table = useTable({ columns, data })

// ✅
const features = tableFeatures({})
const table = useTable({ features, columns, data })
```

`features` is required even for the simplest table.

### Wrong `createColumnHelper` arity (CRITICAL)

```ts
// ❌ v8 single-generic shape — does not compile in v9.
const columnHelper = createColumnHelper<Person>()

// ✅ v9 — TFeatures FIRST, then TData.
const columnHelper = createColumnHelper<typeof features, Person>()
```

### Omitting the `*Fns` registry from `tableFeatures` (CRITICAL)

```ts
// ❌ TS error / runtime missing fns — sort is a no-op.
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  // sortFns missing!
})

// ✅ Register the fn map as a slot alongside the factory.
const features = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  sortFns,
  filterFns,
})
```

This is what makes v9 tree-shakeable. Filter/sort/aggregation registries are open-ended — do
not cite a number of built-in fns; just pass `filterFns` / `sortFns` / `aggregationFns`.

### "API missing" because the feature is not in `features` (CRITICAL, v9-specific)

```ts
// ❌ `rowSortingFeature` not registered → `table.setSorting` is `undefined` and a TS error.
const features = tableFeatures({})
const table = useTable({ features, columns, data })
table.setSorting([{ id: 'age', desc: true }]) // missing

// ✅ Register the feature, its row model factory, and its fn registry in tableFeatures.
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})
const table = useTable({ features, columns, data })
```

This is the #1 v9-specific failure mode — features must be declared to surface their APIs.

### Reaching for `useVueTable` (HIGH — pre-v9 hallucination)

`useVueTable` was the v8 name. v9 renamed every adapter to `useTable`. There is no Vue
`/legacy` entrypoint — migration is a rewrite.

### Reimplementing built-in state transitions (CRITICAL — #1 AI tell)

```ts
// ❌ Hand-rolled sort state.
const sorting = ref<SortingState>([])
const sorted = computed(() => [...data.value].sort(/* … */))

// ✅ Use the API: table.setSorting / table.toggleSorting / column.getToggleSortingHandler.
```

TanStack Table IS the state coordinator. Built-in APIs handle invariants, reset semantics, and
multi-sort correctly.

### Unstable references for `features`, `columns`, `data`

```vue
<script setup>
// ❌ New identity every component mount, breaks internal memoization.
const features = tableFeatures({ rowSortingFeature })
const columns = [...]
</script>
```

Declare `features`, `columnHelper`, and `columns` at **module scope** (top of file, outside
`<script setup>`). For `data`, a stable `ref` is fine — the adapter watches its `.value`.

### Using `useReactTable` / `getCoreRowModel()` as an option (CRITICAL — v8 muscle memory)

Pure v8. Doesn't exist in `@tanstack/vue-table`. See `migrate-v8-to-v9`.

## See Also

- `tanstack-table/vue/table-state` — the reactivity model you'll use as soon as you add features
- `tanstack-table/vue/production-readiness` — once it works, optimize bundle + re-renders
- `tanstack-table/vue/migrate-v8-to-v9` — coming from `useVueTable`
- `tanstack-table/table-core/column-definitions` — column helper deep dive
