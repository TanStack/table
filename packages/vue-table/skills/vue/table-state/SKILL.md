---
name: vue/table-state
description: >
  Vue reactivity for `@tanstack/vue-table` v9. Covers `useTable(options, selector?)`, reactive
  `data`/`columns` via `ref`/`computed` getters, the `vueReactivity()` binding (readonly atoms →
  `computed`, writable → `shallowRef`, subscriptions via `watch({flush:'sync'})`), the three state
  surfaces `table.atoms.<slice>` / `table.store` / `table.state`, selected state via the second
  `useTable` argument, the `<FlexRender>` component, `table.Subscribe` for atom/source subscriptions,
  and composition with `createAtom` / `useSelector` from `@tanstack/vue-store`.
type: framework
library: tanstack-table
framework: vue
library_version: '9.0.0-alpha.48'
requires:
  - state-management
  - setup
sources:
  - docs/framework/vue/guide/table-state.md
  - docs/framework/vue/vue-table.md
  - packages/vue-table/src/useTable.ts
  - packages/vue-table/src/reactivity.ts
  - packages/vue-table/src/FlexRender.ts
  - examples/vue/basic-use-table/
  - examples/vue/basic-external-atoms/
  - examples/vue/basic-external-state/
---

# Vue Table State, Subscribe & createTableHook

## Dependencies

```bash
pnpm add @tanstack/vue-table @tanstack/vue-store
```

`@tanstack/vue-store` is a peer for `createAtom` / `useSelector`. It is only required when you
opt into external atoms — basic tables that use `initialState` or built-in state work without it.

This skill is v9-specific (`9.0.0-alpha.48`). The hook is `useTable` for every framework now; the
v8 name `useVueTable` no longer exists.

## Setup

Every Vue table call requires `features` (built from `tableFeatures({...})`). Row model
factories now live on the features object alongside the feature itself. Core row model is
automatic; only register `paginatedRowModel`, `sortedRowModel`, etc. when you use the matching
feature.

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

type Person = { firstName: string; lastName: string; age: number }

// Stable identity — declare outside the component or at module scope.
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})
const columnHelper = createColumnHelper<typeof features, Person>()
const columns = columnHelper.columns([
  columnHelper.accessor('firstName', { header: 'First' }),
  columnHelper.accessor('lastName', { header: 'Last' }),
  columnHelper.accessor('age', { header: 'Age' }),
])

const data = ref<Person[]>([])

const table = useTable({
  features,
  columns,
  // Reactive data: pass the ref directly OR a getter — the adapter unwraps.
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

### Why this works

The Vue adapter calls `vueReactivity()` and installs it as `coreReactivityFeature` automatically
(see `packages/vue-table/src/useTable.ts`):

- Readonly atoms back onto `computed()` refs.
- Writable atoms back onto `shallowRef()`.
- Subscriptions use `watch(source, cb, { flush: 'sync' })`, so table updates are visible to Vue
  render and computed work immediately.

`useTable` also runs a `watch(() => getReactiveOptionDeps(...))` on every option, so passing a
`ref` or `computed` for `data`, `columns`, `rowCount`, etc. is supported — the table calls
`setOptions` whenever any reactive option changes.

> **Vue note.** `table.Subscribe` exists for parity with React, but you usually do not need it.
> Vue's reactivity re-evaluates template reads automatically — wrap reads in `computed(...)` if
> you need them outside a template. Do not import React-Compiler workarounds.

## Core Patterns

### 1. The three read surfaces

```ts
// (a) Per-slice atom — narrowest, no full state snapshot built
const sorting = table.atoms.sorting.get()

// (b) Flat readonly store — every registered slice as one object
const snapshot = table.state

// (c) Vue selected state — the value returned from useTable's 2nd arg
const table = useTable(
  {
    features,
    columns,
    data,
  },
  (state) => ({ sorting: state.sorting }),
)
table.state.sorting // typed, reactive
```

`table.atoms.<slice>` only contains slices for features registered in `features`. If
`rowSortingFeature` is not registered, `table.atoms.sorting` is `undefined` (and TypeScript
flags it). This is the v9-specific "missing API" gotcha — register the feature first.

Source: `docs/framework/vue/guide/table-state.md` (Feature-based State, Accessing Table State).

### 2. Reactive data with a getter or computed

The adapter accepts a `ref`/`computed` for any option. The idiomatic shapes are:

```ts
// (a) Pass the ref directly — adapter unwraps via `unref()`
const data = ref(makeData(100))
const table = useTable({ features, columns, data })

// (b) Use a getter when `data` is owned by a parent object
const table = useTable({
  features,
  columns,
  get data() {
    return data.value
  },
})

// (c) Computed when filtering/derivation lives on the client
const filtered = computed(() => data.value.filter(/* … */))
const table = useTable({
  features,
  columns,
  get data() {
    return filtered.value
  },
})
```

When `data.value` changes, `useTable` calls `setOptions` synchronously and the table re-derives.
Source: `examples/vue/basic-use-table/src/App.tsx`, `examples/vue/virtualized-rows/src/App.vue`.

### 3. External atoms (recommended for shared state)

Use `createAtom` from `@tanstack/vue-store`; pass through `options.atoms`. Atoms take
precedence over `options.state` — pick one mechanism per slice.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { createAtom, useSelector } from '@tanstack/vue-store'
import {
  createPaginatedRowModel,
  rowPaginationFeature,
  tableFeatures,
  useTable,
  type PaginationState,
} from '@tanstack/vue-table'

const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})
const pagination = useSelector(paginationAtom) // reactive ref-like

const data = ref([] as Person[])
const table = useTable({
  features,
  columns,
  data,
  atoms: { pagination: paginationAtom },
  // NOTE: no `onPaginationChange` — `table.setPageIndex()` writes through to the atom.
})
</script>

<template>
  <button @click="table.nextPage()" :disabled="!table.getCanNextPage()">
    Next
  </button>
  <span>Page {{ pagination.value.pageIndex + 1 }}</span>
</template>
```

Source: `examples/vue/basic-external-atoms/src/App.tsx`.

### 4. External `state` + `on[State]Change` with getters

Still supported and convenient for migration paths. The critical rule: pass each slice as a
**getter** so Vue can track `.value` changes. A raw ref captured in the state object is read
once and never re-tracked.

```ts
const sorting = ref<SortingState>([])
const pagination = ref<PaginationState>({ pageIndex: 0, pageSize: 10 })

const table = useTable({
  features,
  columns,
  data,
  state: {
    get sorting() {
      return sorting.value
    }, // <- getter
    get pagination() {
      return pagination.value
    }, // <- getter
  },
  onSortingChange: (u) => {
    sorting.value = typeof u === 'function' ? u(sorting.value) : u
  },
  onPaginationChange: (u) => {
    pagination.value = typeof u === 'function' ? u(pagination.value) : u
  },
})
```

Source: `examples/vue/basic-external-state/src/App.tsx`,
`docs/framework/vue/guide/table-state.md` (External State).

### 5. `<FlexRender>` and `table.Subscribe`

`<FlexRender>` accepts a `cell`, `header`, or `footer` prop (preferred). The legacy
`:render` / `:props` pattern still works.

```vue
<FlexRender :cell="cell" />
<FlexRender :header="header" />
<FlexRender :footer="header" />

<!-- Legacy form -->
<FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
```

`table.Subscribe` mostly mirrors React. It is rarely the right tool in Vue — prefer
`computed(() => table.atoms.<slice>.get())` or the `useTable` selector. If you do need it
(for cross-store source subscription), it accepts a `source` prop:

```ts
// In a render function or JSX file
return () => (
  <table.Subscribe source={someAtom} selector={(v) => v.someField}>
    {(value) => <span>{value}</span>}
  </table.Subscribe>
)
```

## Common Mistakes

### Passing a `ref` to `state.pagination` without a getter (CRITICAL)

```ts
// ❌ Captures the ref object; later `pagination.value = …` writes are invisible.
const pagination = ref<PaginationState>({ pageIndex: 0, pageSize: 10 })
const table = useTable({
  features,
  columns,
  data,
  state: { pagination },
})

// ✅ Use a getter so Vue tracks `.value`.
const table = useTable({
  features,
  columns,
  data,
  state: {
    get pagination() {
      return pagination.value
    },
  },
  onPaginationChange: (u) => {
    pagination.value = typeof u === 'function' ? u(pagination.value) : u
  },
})
```

Source: `docs/framework/vue/guide/table-state.md` (External State).

### Reading `table.atoms.<slice>.get()` outside a reactive context (HIGH)

```ts
// ❌ One-shot read at component setup — never updates.
const pagination = table.atoms.pagination.get()

// ✅ Wrap in `computed` so Vue tracks the atom.
const pagination = computed(() => table.atoms.pagination.get())
// or
const table = useTable(opts, (s) => ({ pagination: s.pagination }))
// then read `table.state.pagination`
```

### Using the v8 `useVueTable` name (HIGH)

```ts
// ❌ Removed in v9.
import { useVueTable } from '@tanstack/vue-table'

// ✅
import { useTable } from '@tanstack/vue-table'
```

### "API missing" because the feature is not in `features` (CRITICAL, v9-specific)

```ts
// ❌ `rowSortingFeature` not registered → `table.setSorting` and `table.atoms.sorting` do not exist.
const features = tableFeatures({})
const table = useTable({ features, columns, data })
table.setSorting([{ id: 'age', desc: true }]) // TS error / runtime no-op

// ✅ Register the feature and its matching row model factory inside tableFeatures.
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
})
const table = useTable({ features, columns, data })
```

### Reimplementing built-in state transitions (CRITICAL — #1 AI tell)

```ts
// ❌ Hand-rolled sort — bypasses the table's invariants and reset APIs.
const sorting = ref<SortingState>([])
const sorted = computed(() => [...data.value].sort(/* … */))

// ✅ Let the table own it. Use `table.setSorting`, `column.toggleSorting`,
//    `header.column.getToggleSortingHandler()`.
```

The library exposes `setSorting`, `setColumnFilters`, `toggleSelected`, `nextPage`, etc. for
nearly every state transition.

### Hallucinating pre-v9 API names

`useVueTable`, `getCoreRowModel()` as an option, `createColumnHelper<TData>()` (single generic),
`sortingFn` instead of `sortFn` — all v8 shapes that will not compile. See
`migrate-v8-to-v9` for the full rename list.

### Unstable `features` / `columns` / `data` identity

Declare `features`, `columnHelper`, and `columns` **outside** `<script setup>` (at module
scope) or use `computed`. Recreating them every render churns the table's option diff watcher
and triggers a `setOptions` on every render — slow, and external atom slices can flicker.

## See Also

- `tanstack-table/vue/getting-started` — the end-to-end first-table walkthrough
- `tanstack-table/vue/production-readiness` — selectors, tree-shaking, identity
- `tanstack-table/vue/compose-with-tanstack-store` — external atoms in depth
- `tanstack-table/table-core/state-management` (core) — the atom model that drives this skill
- `tanstack-table/vue/migrate-v8-to-v9` — `useVueTable` → `useTable`
