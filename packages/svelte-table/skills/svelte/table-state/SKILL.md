---
name: svelte/table-state
description: >
  Svelte 5 rune-based reactivity for TanStack Table v9. Covers `createTable(options, selector?)`,
  the `table.state` selector projection, fine-grained `subscribeTable(atom, selector?)` with `.current`,
  reading and writing `table.atoms` / `table.baseAtoms`, the `svelteReactivity()` bridge that backs
  readonly atoms with `$derived.by` and writable atoms with `$state`, and the `$effect.pre` option
  sync. State ownership: `initialState`, `state` + `on[State]Change`, or external `atoms` from
  `@tanstack/svelte-store` (`createAtom`, `useSelector`). Svelte 5+ only — no Svelte 3/4 support.
type: framework
library: tanstack-table
framework: svelte
library_version: '9.0.0-alpha.48'
requires:
  - state-management
  - setup
sources:
  - TanStack/table:docs/framework/svelte/svelte-table.md
  - TanStack/table:docs/framework/svelte/guide/table-state.md
  - TanStack/table:packages/svelte-table/src/createTable.svelte.ts
  - TanStack/table:packages/svelte-table/src/createTableHook.svelte.ts
  - TanStack/table:packages/svelte-table/src/reactivity.svelte.ts
  - TanStack/table:packages/svelte-table/src/subscribe.ts
  - TanStack/table:examples/svelte/basic-create-table/
  - TanStack/table:examples/svelte/basic-external-atoms/
  - TanStack/table:examples/svelte/basic-external-state/
---

# Svelte Table State, `subscribeTable` & `createTableHook`

> **TanStack Table is a state-management coordinator for table state.** Understanding how state
> flows through atoms, runes, and selectors is foundational to everything else you do with the
> Svelte adapter.

## Critical: Svelte 5+ only

`@tanstack/svelte-table@9` requires **Svelte 5 or newer**. The adapter is built on runes
(`$state`, `$derived.by`, `$effect.pre`). For Svelte 3/4 projects, stay on
`@tanstack/svelte-table@8` — there is no v9 path that supports the legacy stores API.

## How v9 state is wired in Svelte

A table instance has three (and a half) state surfaces:

- `table.baseAtoms.<slice>` — writable atoms created from the resolved initial state.
- `table.atoms.<slice>` — readonly derived atoms, exposed per registered feature.
- `table.store` — readonly flat TanStack Store, a derived view of all registered atoms.
- `table.state` — the value returned by the optional selector passed as the second argument to
  `createTable`. **Svelte-only surface.**

The Svelte adapter installs `svelteReactivity()` as the `coreReactivityFeature`:

| Core concept  | Svelte binding  |
| ------------- | --------------- |
| readonly atom | `$derived.by()` |
| writable atom | `$state`        |
| subscription  | rune `$effect`  |
| option sync   | `$effect.pre`   |
| batch         | `flushSync`     |

`createTable` reads reactive option getters inside `$effect.pre` so the table sees fresh data,
columns, and controlled state **before** the DOM renders — `getRowModel()` is never a frame behind.

## Feature-based state — registered features only

State slices only exist for the features registered in `features`. Reading
`table.atoms.rowSelection` without `rowSelectionFeature` is a TypeScript error and a runtime
`undefined`. **This is the most common v9 mistake.**

```ts
import {
  createTable,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  createPaginatedRowModel,
  createSortedRowModel,
  sortFns,
} from '@tanstack/svelte-table'

const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  sortFns,
})

const table = createTable({
  features,
  columns,
  get data() {
    return data
  },
})

table.atoms.pagination.get() // ok
table.atoms.sorting.get() // ok
// table.atoms.rowSelection  // TypeScript error
```

## Reading state — pick the right tool for the job

### Current value, no reactivity

Read the atom directly. Cheapest path; only reactive when called inside a rune-tracked context.

```ts
const sorting = table.atoms.sorting.get()
const pagination = table.atoms.pagination.get()
const flat = table.state
```

### Reactive read inside markup — `table.state` selector

Pass a TanStack Store selector as the second argument to `createTable`. The selected value is
exposed as `table.state`. The default selector returns the full registered state.

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
    (state) => ({ pagination: state.pagination }),
  )
</script>

<strong>
  Page {table.state.pagination.pageIndex + 1} of {table.getPageCount()}
</strong>
```

### Fine-grained — `subscribeTable`

`subscribeTable(source, selector?)` wraps a `useSelector` with `shallow` compare and returns an
object whose `.current` is the selected value. Use it when only one block of markup should
re-render on a state change.

```ts
import { subscribeTable } from '@tanstack/svelte-table'

const pageIndex = subscribeTable(table.atoms.pagination, (p) => p.pageIndex)
```

```svelte
<strong>Page {pageIndex.current + 1}</strong>
```

## Setting state — APIs first, atoms last

Use the feature APIs. They handle updaters, external-atom routing, and validation:

```ts
table.nextPage()
table.previousPage()
table.setPageIndex(0)
table.setPageSize(25)
table.setSorting([{ id: 'age', desc: true }])
column.toggleVisibility()
row.toggleSelected()
```

Direct base-atom writes are a last resort:

```ts
table.baseAtoms.pagination.set((old) => ({ ...old, pageIndex: 0 }))
```

When a slice is owned by an external atom (passed through `atoms`), write to the external atom —
`table.atoms.<slice>` will read from it, not from `baseAtoms`.

## State ownership — three patterns

### 1. Initial state only

The default: set starting values, let the table own the rest. `initialState` also drives
`resetSorting()`, `resetPagination()`, etc.

```ts
const table = createTable({
  features,
  columns,
  get data() {
    return data
  },
  initialState: {
    sorting: [{ id: 'age', desc: true }],
    pagination: { pageIndex: 0, pageSize: 25 },
  },
})
```

### 2. External atoms (recommended for shared state)

When the app should own a slice, create a stable atom with `createAtom`, pass it through `atoms`,
and subscribe with `useSelector` or `subscribeTable`. The table writes through the external atom
on `setPageIndex`, `setSorting`, etc.

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
```

When you use `atoms` for a slice, **do not** pair it with the matching `on[State]Change` callback.

### 3. External `state` + `on[State]Change` (migration / simple cases)

Classic pattern, still supported. Use Svelte 5 `$state` and getter properties so the table sees
updates.

```svelte
<script lang="ts">
  import {
    createTable,
    rowPaginationFeature,
    rowSortingFeature,
    tableFeatures,
    type PaginationState,
    type SortingState,
  } from '@tanstack/svelte-table'

  let sorting: SortingState = $state([])
  let pagination: PaginationState = $state({ pageIndex: 0, pageSize: 10 })

  const table = createTable({
    features,
    columns,
    get data() {
      return data
    },
    state: {
      get sorting() {
        return sorting
      },
      get pagination() {
        return pagination
      },
    },
    onSortingChange: (updater) => {
      sorting = updater instanceof Function ? updater(sorting) : updater
    },
    onPaginationChange: (updater) => {
      pagination = updater instanceof Function ? updater(pagination) : updater
    },
  })
</script>
```

> The v8-style monolithic `onStateChange` is gone in v9. Use per-slice `on[State]Change` or, better,
> external atoms.

### Precedence — do not mix sources

External `atoms` win over external `state`. External `state` syncs into the internal base atom.
For any given slice, pick **one** source of truth. Don't pass `initialState.pagination` and
`atoms.pagination` and `state.pagination` together.

## Rendering — `FlexRender`

`FlexRender` handles `header`, `cell`, and `footer` definitions whether they're plain strings,
Svelte components wrapped with `renderComponent`, or snippets wrapped with `renderSnippet`.

```svelte
<script lang="ts">
  import {
    FlexRender,
    renderComponent,
    renderSnippet,
  } from '@tanstack/svelte-table'
</script>

<thead>
  {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
    <tr>
      {#each headerGroup.headers as header (header.id)}
        <th>
          {#if !header.isPlaceholder}
            <FlexRender {header} />
          {/if}
        </th>
      {/each}
    </tr>
  {/each}
</thead>
<tbody>
  {#each table.getRowModel().rows as row (row.id)}
    <tr>
      {#each row.getVisibleCells() as cell (cell.id)}
        <td><FlexRender {cell} /></td>
      {/each}
    </tr>
  {/each}
</tbody>
```

Always key `{#each}` blocks on stable ids (`headerGroup.id`, `header.id`, `row.id`, `cell.id`).

## `createTableHook` — app-wide composition

Create one configured hook per app: shared `features` (including row-model factories), defaults, and pre-bound component registries.

```ts
import {
  createPaginatedRowModel,
  createSortedRowModel,
  createTableHook,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/svelte-table'
import TextCell from './cells/TextCell.svelte'
import SortIndicator from './headers/SortIndicator.svelte'

export const {
  createAppTable,
  createAppColumnHelper,
  useTableContext,
  useCellContext,
  useHeaderContext,
} = createTableHook({
  features: tableFeatures({
    rowPaginationFeature,
    rowSortingFeature,
    paginatedRowModel: createPaginatedRowModel(),
    sortedRowModel: createSortedRowModel(),
    sortFns,
  }),
  cellComponents: { TextCell },
  headerComponents: { SortIndicator },
})
```

In components:

```svelte
<script lang="ts">
  import { createAppTable, createAppColumnHelper } from './hooks/table'

  const columnHelper = createAppColumnHelper<Person>()
  const columns = columnHelper.columns([
    columnHelper.accessor('firstName', { header: 'First' }),
  ])

  const table = createAppTable({
    columns,
    get data() {
      return data
    },
  })
</script>

<table.AppTable>
  {#snippet children()}
    <table>
      <thead>
        {#each table.getHeaderGroups() as group (group.id)}
          <tr>
            {#each group.headers as header (header.id)}
              <table.AppHeader {header}>
                {#snippet children(h)}
                  <th><h.SortIndicator /></th>
                {/snippet}
              </table.AppHeader>
            {/each}
          </tr>
        {/each}
      </thead>
    </table>
  {/snippet}
</table.AppTable>
```

Inside custom `cellComponents` / `headerComponents` / `tableComponents`, use `useCellContext()` /
`useHeaderContext()` / `useTableContext()` instead of prop-drilling.

## Common failure modes

- **Svelte 4 code with v9 adapter.** Will not run. `$state` / `$derived.by` are Svelte 5 syntax.
- **`createSvelteTable` import.** v8 name. v9 uses `createTable`. There is no `useSvelteTable`,
  `getCoreRowModel`, `getSortedRowModel`, etc. — those are v8 names too.
- **Forgetting `tableFeatures()`.** `features` must come from `tableFeatures({...})` for type
  inference; passing a raw object loses the typed state slice keys.
- **Forgetting feature registration.** Calling `table.setSorting(...)` without
  `rowSortingFeature` in `features` is a runtime no-op (the API method won't exist).
- **Mixing ownership.** `atoms.pagination` + `state.pagination` + `initialState.pagination` is
  ambiguous; the table will not "merge" them the way you expect.
- **Reactive getters dropped.** If you pass `data` as a plain value instead of a getter, the
  table won't re-render when `data` changes. Always use `get data() { return data }`.
- **Reimplementing built-ins.** If you're hand-rolling sorting comparators, pagination math, or
  selection toggles, you're skipping `rowSortingFeature` / `rowPaginationFeature` /
  `rowSelectionFeature` and their reset / state APIs. Register the feature instead.

## Related skills

- `tanstack-table/core/state-management` — atom model, slice precedence, base vs derived atoms.
- `tanstack-table/svelte/getting-started` — end-to-end first table.
- `tanstack-table/svelte/compose-with-tanstack-store` — direct atom interop.
- `tanstack-table/svelte/production-readiness` — selector / subscription tuning.
