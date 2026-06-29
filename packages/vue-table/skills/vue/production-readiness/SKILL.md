---
name: vue/production-readiness
description: >
  Ship-ready optimizations for `@tanstack/vue-table` v9. Tree-shake by listing ONLY the
  `features` you actually render — never default to `stockFeatures`. Keep `features`,
  `columnHelper`, and `columns` at module scope for stable identity (Vue re-evaluates the
  `<script setup>` block per component instance — declare these outside or in a const). Row
  model factories and fn registries live as slots on the `tableFeatures({...})` object, not as
  a separate `rowModels` option. Use the `useTable(opts, selector)` second argument or per-slice
  `computed(() => table.atoms.<slice>.get())` / `useSelector(table.atoms.<slice>)` from
  `@tanstack/vue-store` to narrow re-renders. Vue's reactivity already evaluates only dirty
  computed deps, so `table.Subscribe` is NOT the React-Compiler workaround it is in React;
  reach for fine-grained reads (`computed`, `useSelector`) first.
type: lifecycle
library: tanstack-table
framework: vue
library_version: '9.0.0-alpha.48'
requires:
  - setup
  - state-management
  - vue/table-state
sources:
  - docs/guide/features.md
  - docs/framework/vue/guide/table-state.md
  - packages/vue-table/src/useTable.ts
  - packages/vue-table/src/reactivity.ts
---

# Production Readiness (Vue)

## Dependencies

```bash
pnpm add @tanstack/vue-table @tanstack/vue-store
```

`@tanstack/vue-store` is required if you want to use `useSelector` for per-slice atom
subscriptions outside the table.

## Setup — the production-ready shape

```ts
// table-setup.ts — module scope, stable identity for everyone.
import {
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/vue-table'

export const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns,
})
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useTable } from '@tanstack/vue-table'
import { features } from './table-setup'
import { columns } from './columns'

const props = defineProps<{ data: Person[] }>()
const data = ref(props.data)

// Narrow selector — table.state only carries what we actually render at this level.
const table = useTable({ features, columns, data }, (state) => ({
  pagination: state.pagination,
  sorting: state.sorting,
}))
</script>
```

## Core Patterns

### 1. Tree-shake by listing only the features you render

```ts
// ❌ Ships filtering, faceting, grouping, pinning, expanding, sizing, resizing,
//   visibility, ordering, row-selection, row-pinning code you don't use.
const features = tableFeatures(stockFeatures)

// ✅ A sort-only table ships ~6–7 kb of feature code instead of ~15–20 kb.
const features = tableFeatures({ rowSortingFeature })
```

`stockFeatures` exists for migrations and prototyping. Audit before shipping — if a feature
isn't wired into a column def or UI handler, drop it. v9 is tree-shakeable specifically so you
only pay for what you use.

### 2. Module-scope `features` / `columnHelper` / `columns`

```ts
// ❌ Inside <script setup> — every component instance creates new identities, which churns
//    the table's option-watcher and triggers a `setOptions` on every reactive tick.
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})
const columnHelper = createColumnHelper<typeof features, Person>()
const columns = columnHelper.columns([
  /* ... */
])
```

```ts
// ✅ Module scope — one identity, shared across instances, GC-friendly.
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})
const columnHelper = createColumnHelper<typeof features, Person>()
export const columns = columnHelper.columns([
  /* ... */
])
```

`data` is the exception: a stable `ref` is fine — the adapter watches `.value`. Just don't
write `data: ref([...])` inline in the table options (a fresh ref each render).

### 3. Narrow the `useTable` selector

```ts
// ❌ Default selector — table.state contains every registered slice; any state change re-renders
//    every consumer of table.state.
const table = useTable({ features, columns, data })

// ✅ Project only what THIS component renders. Other slices still drive table internals; you
//    just don't subscribe to them at the component level.
const table = useTable({ features, columns, data }, (state) => ({
  pagination: state.pagination,
  sorting: state.sorting,
}))
```

The selector is a TanStack Store selector — its compare is shallow by default, so identity
stable returns avoid re-evaluation.

### 4. Per-slice subscriptions for nested components

When only a leaf component cares about one slice, subscribe to the atom directly. This is
narrower than `useTable`'s selector (which still touches the full store).

```vue
<!-- SelectedCount.vue -->
<script setup lang="ts">
import { useSelector } from '@tanstack/vue-store'
import type { TableProp } from './types'

const props = defineProps<TableProp>()
// Re-renders only when rowSelection changes.
const selection = useSelector(props.table.atoms.rowSelection)
</script>

<template>
  <span>{{ Object.keys(selection).length }} selected</span>
</template>
```

Or with `computed` (no `vue-store` peer required, but only reactive in a Vue scope):

```ts
const selectedCount = computed(
  () => Object.keys(table.atoms.rowSelection.get()).length,
)
```

### 5. Vue does NOT need `table.Subscribe` the way React does

`table.Subscribe` is a render-prop component primarily useful in React when the React Compiler
can't see through the table closure. Vue's reactivity already re-evaluates dependent reads
automatically — `computed`, `useSelector`, and the `useTable` selector cover the same ground
with less indirection.

Use `table.Subscribe` only for cross-store source subscription (`<table.Subscribe :source="..."
:selector="..."`) — and even then, `useSelector(source, selector)` is usually cleaner.

### 6. Stress patterns

- **Virtualize rows / columns** — pair with `@tanstack/vue-virtual`. Keep `useVirtualizer` in
  the deepest possible component (`TableBody`, not `App`) so unrelated state changes don't
  re-run it. See `tanstack-table/vue/compose-with-tanstack-virtual`.
- **Debounce filter / resize writes** — see `tanstack-table/vue/compose-with-tanstack-pacer`.
- **Hoist heavy column defs out of `<script setup>`** — into a `columns.ts` module.

## Common Mistakes

### Using `stockFeatures` in production without auditing (HIGH)

Defeats the entire reason v9 is tree-shakeable. Replace with an explicit
`tableFeatures({...})` listing only the features your UI renders.

### Re-declaring `features` / `columns` inside `<script setup>` (HIGH)

Vue runs `<script setup>` once per component instance, but that's still per-page-navigation in
SPAs and per-instance in any reusable component. Module scope is cheapest and shared.

### Inline `data: ref([])` or `data: computed(() => something ?? [])` in options (MEDIUM)

The `?? []` pattern creates a fresh array identity on every recompute. Either:

```ts
// ✅ stable empty array
const EMPTY: Person[] = []
const data = computed(() => dataQuery.data.value?.rows ?? EMPTY)

// ✅ or hold a ref that's only updated on real data changes
const data = ref<Person[]>([])
watchEffect(() => {
  const next = dataQuery.data.value?.rows
  if (next && next !== data.value) data.value = next
})
```

### Leaving the default selector when only one slice is rendered (MEDIUM)

```ts
// ❌ Whole table re-evaluates table.state on every keystroke in a column filter.
const table = useTable({ features, columns, data })

// ✅
const table = useTable(opts, (s) => ({ pagination: s.pagination }))
```

### Premature `table.Subscribe` everywhere (MEDIUM)

For a 50-row table, wrapping every header in `<table.Subscribe>` adds complexity without
measurable benefit. Vue's default reactivity is already fine-grained — reach for `Subscribe` /
selectors only when you've measured a hotspot.

Maintainer guidance: advanced state-management patterns are for advanced cases.

### Reading `table.state` in a deep component when only that component cares (MEDIUM)

If only `SelectedCount.vue` cares about `rowSelection`, prefer
`useSelector(table.atoms.rowSelection)` over reading `table.state.rowSelection` at a parent
and prop-drilling.

### Hoisting `useTable` above a virtualizer (HIGH)

If a parent component reads `table.state` reactively, every state change re-renders the
parent, which re-runs `useVirtualizer` and blows away scroll position. Keep
`useVirtualizer` inside the leaf component that needs it; pass `table` (which is stable) as a
prop. See `tanstack-table/vue/compose-with-tanstack-virtual`.

### Hallucinating pre-v9 API names (CRITICAL)

`stockFeatures` exists in v9; `useVueTable` does not; `getCoreRowModel()` is not a valid
option in v9. If you're optimizing v8 code, you're optimizing the wrong codebase — see
`tanstack-table/vue/migrate-v8-to-v9` first.

### "API missing" because feature not registered (CRITICAL — v9-specific)

You can't tree-shake a feature you never added. If `table.setSorting` is `undefined`, the
solution isn't a workaround — it's `tableFeatures({ rowSortingFeature })`. Optimization
follows correctness.

### Reimplementing built-in transitions (CRITICAL — #1 AI tell)

`table.setSorting`, `row.toggleSelected`, `table.nextPage`, `column.setFilterValue` — all
exist for nearly every state transition. Hand-rolled state machines are slower (skip
internal invariants) and harder to maintain (reset APIs, multi-sort, etc. don't apply).

## See Also

- `tanstack-table/vue/table-state` — selector, atoms, FlexRender deep dive
- `tanstack-table/vue/getting-started` — the simple shape you're now optimizing
- `tanstack-table/vue/compose-with-tanstack-virtual` — virtualization for stress cases
- `tanstack-table/vue/compose-with-tanstack-pacer` — debounce filter / throttle resize writes
- `tanstack-table/vue/compose-with-tanstack-store` — external atoms in depth
