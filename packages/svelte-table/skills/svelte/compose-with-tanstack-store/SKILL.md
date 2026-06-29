---
name: svelte/compose-with-tanstack-store
description: >
  TanStack Table v9 is built on TanStack Store. Each state slice (sorting, pagination,
  rowSelection, columnFilters, ...) is a separate atom. In Svelte, `@tanstack/svelte-store`
  exposes `createAtom`, `useSelector`, `shallow`. Read `table.atoms.<slice>` per slice,
  `table.store` flat, or `table.state` for the selector projection. Subscribe with
  `subscribeTable(atom, selector?)` (returns `.current`). Own a slice externally with
  `createAtom` + `atoms: { sorting: sortingAtom }`. Svelte 5+ only — `$state` / `$derived.by` /
  `$effect.pre` reactivity.
type: composition
library: tanstack-table
framework: svelte
library_version: '9.0.0-alpha.48'
requires:
  - state-management
sources:
  - TanStack/table:docs/framework/svelte/guide/table-state.md
  - TanStack/table:packages/svelte-table/src/reactivity.svelte.ts
  - TanStack/table:packages/svelte-table/src/subscribe.ts
  - TanStack/table:examples/svelte/basic-external-atoms/
---

# Compose with TanStack Store (Svelte)

`@tanstack/svelte-store` is the reactive primitive under `@tanstack/svelte-table` v9. The
table doesn't merely _use_ Store — its entire reactivity model is built from Store atoms with
rune backings.

## Mental model — three read surfaces

A registered v9 table exposes:

| Surface               | Shape                       | When to use                                |
| --------------------- | --------------------------- | ------------------------------------------ |
| `table.atoms.<slice>` | `ReadonlyAtom<TSlice>`      | Per-slice subscription / `.get()` snapshot |
| `table.store`         | `ReadonlyStore<FlatState>`  | Flat snapshot across registered slices     |
| `table.state`         | `TSelected` (from selector) | The selector projection (Svelte-only)      |

Plus the writable internals:

- `table.baseAtoms.<slice>` — writable atom for state the table owns.

If a slice is supplied externally via `atoms`, `table.atoms.<slice>` reads from your atom and
`table.baseAtoms.<slice>` is unused for that slice.

## The Svelte bindings (what `svelteReactivity()` actually does)

The Svelte adapter ships `svelteReactivity()` and installs it as `coreReactivityFeature`. It
maps Store primitives to runes:

- Readonly atoms → `$derived.by(fn)`
- Writable atoms → `$state(initialValue)`
- Subscriptions → `$effect.root` + `$effect`
- Batch → `flushSync`

This is why simple atom reads inside `.svelte` components (templates, `$derived`, `$effect`)
participate in reactivity automatically. There is no React-style `useStore` requirement.

## Pattern 1 — Read a slice without subscribing

For event handlers, async work, exports, anything outside of reactive markup. Cheap, no
subscription setup.

```ts
import type { SortingState } from '@tanstack/svelte-table'

function logSort() {
  const sorting: SortingState = table.atoms.sorting.get()
  console.log(sorting)
}
```

`table.state` is the full snapshot equivalent.

## Pattern 2 — Reactive selector via `createTable`

The second argument to `createTable` is a TanStack Store selector. The result is exposed on
`table.state`. The default selector is `(state) => state`.

```svelte
<script lang="ts">
  const table = createTable(
    {
      features,
      columns,
      get data() {
        return data
      },
    },
    (state) => ({
      pageIndex: state.pagination.pageIndex,
      pageSize: state.pagination.pageSize,
    }),
  )
</script>

<strong>Page {table.state.pageIndex + 1}</strong>
```

The narrower the selector, the less your markup re-renders.

## Pattern 3 — Per-block subscription with `subscribeTable`

`subscribeTable(source, selector?)` is the dedicated per-component subscription. It uses
`shallow` compare and exposes a `.current` accessor.

```svelte
<script lang="ts">
  import { subscribeTable } from '@tanstack/svelte-table'

  // whole slice
  const pagination = subscribeTable(table.atoms.pagination)

  // narrowed
  const pageSize = subscribeTable(table.atoms.pagination, (p) => p.pageSize)

  // works on table.store too
  const fullSnapshot = subscribeTable(table.store)
</script>

<span
  >Page {pagination.current.pageIndex + 1} ({pageSize.current} per page)</span
>
```

Inside per-row components, `subscribeTable(table.atoms.rowSelection, (s) => !!s[row.id])` keeps
that row's checkbox reactive without subscribing to the entire selection map.

## Pattern 4 — Own a slice externally with `createAtom`

When the app should own a slice — share across components, sync with URL, persist to storage —
create a stable atom and hand it to the table via `atoms`.

```ts
import { createAtom, useSelector } from '@tanstack/svelte-store'
import {
  createTable,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  type PaginationState,
  type SortingState,
} from '@tanstack/svelte-table'

const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
})

const sortingAtom = createAtom<SortingState>([])
const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

// Optional: a Svelte-reactive view onto each atom for use in markup.
const sorting = useSelector(sortingAtom)
const pagination = useSelector(paginationAtom)

const table = createTable({
  features,
  columns,
  get data() {
    return data
  },
  atoms: {
    sorting: sortingAtom,
    pagination: paginationAtom,
  },
})

// table.setPageIndex(2) writes through paginationAtom.
// paginationAtom.set(...) updates table.atoms.pagination immediately.
```

Atom precedence: external `atoms.<slice>` wins over external `state.<slice>` which writes
into the internal `baseAtoms.<slice>`. **Never combine them on the same slice.**

## Pattern 5 — Cross-component / cross-module state

Because atoms are first-class subscribable values, you can read them outside the table component.

```ts
// stores/table-state.ts
import { createAtom } from '@tanstack/svelte-store'
import type { RowSelectionState } from '@tanstack/svelte-table'

export const rowSelectionAtom = createAtom<RowSelectionState>({})
```

```svelte
<!-- Toolbar.svelte -->
<script lang="ts">
  import { useSelector } from '@tanstack/svelte-store'
  import { rowSelectionAtom } from './stores/table-state'

  const selection = useSelector(rowSelectionAtom)
  const selectedCount = $derived(
    Object.values(selection.current).filter(Boolean).length,
  )
</script>

<button disabled={selectedCount === 0}>Delete {selectedCount}</button>
```

```svelte
<!-- TablePage.svelte -->
<script lang="ts">
  import { rowSelectionAtom } from './stores/table-state'

  const table = createTable({
    features,
    columns,
    get data() {
      return data
    },
    atoms: { rowSelection: rowSelectionAtom },
  })
</script>
```

## Pattern 6 — `useSelector` with custom equality

`useSelector(source, selector, { compare })` lets you switch comparison strategies — useful
for object selectors so you don't re-fire on every reference change.

```ts
import { shallow, useSelector } from '@tanstack/svelte-store'

const filterValues = useSelector(
  table.atoms.columnFilters,
  (filters) => Object.fromEntries(filters.map((f) => [f.id, f.value])),
  { compare: shallow },
)
```

`subscribeTable` already uses `shallow` by default, so prefer it for table sources unless you
need a custom compare.

## Pattern 7 — Direct base-atom writes (last resort)

When a slice is internally owned and you really need to write outside a feature API:

```ts
table.baseAtoms.pagination.set((old) => ({ ...old, pageIndex: 0 }))
```

Do not do this for externally-owned slices — write to your external atom instead. The base
atom is dormant in that case and your write will be silently ignored next sync.

## Common failure modes

- **Reading a slice that wasn't registered.** `table.atoms.rowSelection` is `undefined` if
  `rowSelectionFeature` isn't in `features`. TS will catch it if you used `tableFeatures()`.
- **Creating atoms inside reactive blocks.** Atoms must be stable. Module scope or top-level
  component scope, never inside `$derived` / `$effect`.
- **`useSelector` without `.current`.** `selection.pageIndex` is wrong — `selection.current.pageIndex`.
- **Mixing `atoms.X` and `state.X`.** Atom wins, callback never fires.
- **`tableState` as a plain object.** No reactivity. Use `subscribeTable`, `useSelector`, or
  the `createTable` selector.
- **Reimplementing `useSelector` with `$effect`.** Built-in is more efficient and uses
  shallow compare.

## Related skills

- `tanstack-table/svelte/table-state` — full reactivity model and selector patterns.
- `tanstack-table/core/state-management` — atom precedence rules.
- `tanstack-table/svelte/client-to-server` — atoms as the data-driver for server queries.
- `tanstack-table/svelte/production-readiness` — selector / subscription tuning.
