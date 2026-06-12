---
name: svelte/migrate-v8-to-v9
description: >
  Mechanical migration from `@tanstack/svelte-table@8` to `@tanstack/svelte-table@9`. v9 in Svelte
  is a full rewrite — Svelte 5 runes only (no Svelte 3/4), no `/legacy` adapter (unlike React),
  `createSvelteTable` → `createTable`, `getCoreRowModel` / `getSortedRowModel` factories →
  row-model factories registered as slots inside `tableFeatures({...})`, `flexRender` helper →
  `<FlexRender>` component, writable-store `state` → rune-based getters / external atoms,
  `onStateChange` → per-slice `on[State]Change` or `atoms`. Plan a feature-by-feature audit, not a
  search-and-replace.
type: lifecycle
library: tanstack-table
framework: svelte
library_version: '9.0.0-alpha.48'
requires:
  - setup
  - state-management
  - column-definitions
sources:
  - TanStack/table:docs/framework/svelte/svelte-table.md
  - TanStack/table:docs/framework/svelte/guide/table-state.md
  - TanStack/table:packages/svelte-table/src/
  - TanStack/table:examples/svelte/basic-create-table/
  - TanStack/table:examples/svelte/basic-external-atoms/
  - TanStack/table:examples/svelte/basic-external-state/
---

# Migrate v8 → v9 (Svelte)

## CRITICAL: v9 = Svelte 5

**v9 of the Svelte adapter only supports Svelte 5+.** No backport. No shim. No `/legacy` import.
The v9 adapter is built on Svelte 5 runes (`$state`, `$derived.by`, `$effect.pre`). If your app
is still on Svelte 3/4, you have two real options:

1. Stay on `@tanstack/svelte-table@8`. v8 keeps working with the Svelte 3/4 writable-store API.
2. Migrate the app to Svelte 5 first, then migrate the table.

There is no third option. Trying to install v9 on a Svelte 4 codebase will error at compile.

> This makes the Svelte migration heavier than React's. React has a `/legacy` re-export that
> mirrors the v8 surface; Svelte does not. Plan for a real rewrite of every table screen.

## What changed at the type / API level

| v8                                                 | v9                                                                                    |
| -------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `createSvelteTable(options)`                       | `createTable(options, selector?)`                                                     |
| `getCoreRowModel()`                                | included by default; no factory                                                       |
| `getPaginationRowModel()`                          | `tableFeatures({ paginatedRowModel: createPaginatedRowModel() })`                     |
| `getSortedRowModel()`                              | `tableFeatures({ sortedRowModel: createSortedRowModel(), sortFns })`                  |
| `getFilteredRowModel()`                            | `tableFeatures({ filteredRowModel: createFilteredRowModel(), filterFns })`            |
| `getExpandedRowModel()`                            | `tableFeatures({ expandedRowModel: createExpandedRowModel() })`                       |
| `getGroupedRowModel()`                             | `tableFeatures({ groupedRowModel: createGroupedRowModel(), aggregationFns })`         |
| `getFacetedRowModel()` / `MinMax` / `UniqueValues` | facet APIs auto-derived when `*Facet*Feature` registered                              |
| `flexRender(template, ctx)` helper                 | `<FlexRender header={h} />` / `<FlexRender cell={c} />` / `<FlexRender footer={h} />` |
| `ColumnDef<TData>`                                 | `ColumnDef<TFeatures, TData>` (extra generic)                                         |
| `createColumnHelper<TData>()`                      | `createColumnHelper<TFeatures, TData>()`                                              |
| writable store on the table instance               | `table.atoms.<slice>` + `table.store` + `table.state`                                 |
| `onStateChange` (monolithic)                       | per-slice `on[State]Change`, or external `atoms`                                      |
| `useSvelteTable` (rare)                            | gone                                                                                  |

## What did NOT change

- The data array is still the source of truth; columns are still defined the same way
  shape-wise (`accessorKey` / `accessorFn` / `header` / `cell` / `footer`).
- Filter, sort, aggregation function registries are still `filterFns`, `sortFns`,
  `aggregationFns` — but now passed into row-model factories instead of being auto-resolved.
- Feature APIs (`table.nextPage()`, `column.getCanSort()`, `row.toggleSelected()`) keep the
  same names.

## Migration checklist (per file)

For each Svelte component that uses the table:

1. **Upgrade Svelte.** Ensure the app is on Svelte 5 and the component compiles in runes mode.
2. **Replace store with rune.** `let data = writable([])` → `let data = $state([])`. Reads
   inside markup are no longer `$data` — just `data`.
3. **Import surface.** `import { createSvelteTable, getCoreRowModel, flexRender }` →
   `import { createTable, FlexRender, tableFeatures, ... }`.
4. **Add `features`.** Create `const features = tableFeatures({ ... only the features this
table uses ... })`.
5. **Move row-model factories into `tableFeatures`.** Every `get*RowModel: get*RowModel()` becomes a slot inside `tableFeatures({ ..., create*RowModel() })`. Any `*Fns` registry that was passed as a factory argument is now also a named slot in the same `tableFeatures` call.
6. **Generic columns.** Add `<typeof features, TData>` to `ColumnDef<>` and
   `createColumnHelper<>()`. TypeScript will tell you when you missed one.
7. **`data` as a getter.** `data: data` → `get data() { return data }`. Same for any other
   reactive option (`state.*`, `columns`, `rowCount`).
8. **State.** Pick the new ownership model — see below.
9. **Rendering.** `{flexRender(header.column.columnDef.header, header.getContext())}` →
   `<FlexRender header={header} />`. Same for cells and footers.
10. **Components / snippets in cells.** v8: pass a Svelte component constructor. v9: wrap with
    `renderComponent(MyCell, props)` or `renderSnippet(snippet, args)`.

## State ownership — choose one per slice

### Was: `writable` store + `onStateChange`

```svelte
<script lang="ts">
  // v8
  import { writable } from 'svelte/store'
  const options = writable({ ... })
  $: $options.state = $state
</script>
```

### Now: pick one of three

**Internal (default).** Pass only `initialState` and let the table own it.

```ts
const table = createTable({
  features,
  columns,
  get data() {
    return data
  },
  initialState: {
    pagination: { pageIndex: 0, pageSize: 25 },
  },
})
```

**External `state` + per-slice `on[State]Change`.** Closest to a literal v8 port.

```svelte
<script lang="ts">
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

**External atoms (preferred for shared state).** Atomic, subscribable from anywhere.

```ts
import { createAtom, useSelector } from '@tanstack/svelte-store'

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

**Do not combine** `state.pagination` with `atoms.pagination` — atoms always win, `state` is
discarded silently, you'll think your callbacks aren't firing.

## Rendering migration cheat sheet

```svelte
<!-- v8 -->
<th>
  {#if !header.isPlaceholder}
    <svelte:component
      this={flexRender(header.column.columnDef.header, header.getContext())}
    />
  {/if}
</th>

<!-- v9 -->
<th>
  {#if !header.isPlaceholder}
    <FlexRender {header} />
  {/if}
</th>
```

For cells that render a custom Svelte component:

```svelte
<!-- v8: column def -->
{ cell: () => MyCellComponent }

<!-- v9: column def -->
import { renderComponent } from '@tanstack/svelte-table'
{ cell: ({ row }) => renderComponent(MyCellComponent, { row }) }
```

For inline snippets:

```svelte
<!-- v9 -->
import { renderSnippet } from '@tanstack/svelte-table'

{#snippet myCell(row)}
  <strong>{row.original.firstName}</strong>
{/snippet}

{ cell: ({ row }) => renderSnippet(myCell, row) }
```

## After the rewrite — verify

- `pnpm test:types` (or `svelte-check`) catches missing `<typeof features, TData>` generics,
  missing `features` or row-model factory slots, and feature APIs called on tables that didn't
  register them.
- `pnpm build` should pass with the new `features` set. Bundle should shrink — only the
  features you register are included.
- Click through every table screen. Reset buttons, multi-sort, pagination reset on filter,
  expanded-row count under pagination — these are all the spots where v8 muscle memory
  reaches for an option (`autoResetPageIndex` etc.) that's still named the same in v9 but
  only takes effect if the matching feature is registered.

## Common failure modes during migration

- **Trying to skip the Svelte 5 upgrade.** Will not work.
- **Reaching for `useLegacyTable`.** Doesn't exist in `@tanstack/svelte-table`. That's a
  React-only escape hatch.
- **Importing from `@tanstack/table-core` directly.** Re-exported by the adapter — go through
  the adapter.
- **Plain `data` instead of `get data()` getter.** Largest single source of "but my data
  changed" bugs during migration.
- **Plain `features: { rowPaginationFeature }` instead of `tableFeatures({...})`.** Loses
  inference; you'll get `any` everywhere.
- **Forgetting feature registration after adding the row-model factory slot.** Adding
  `paginatedRowModel: createPaginatedRowModel()` to `tableFeatures` without also including
  `rowPaginationFeature` does nothing.
- **Reimplementing v8 helpers** (`flexRender`-style functions, manual store subscriptions,
  hand-rolled selectors) instead of using `FlexRender` / `subscribeTable` / atom selectors.
  That's the #1 AI tell on this migration.

## Related skills

- `tanstack-table/svelte/getting-started` — clean-slate setup.
- `tanstack-table/svelte/table-state` — the v9 state model in depth.
- `tanstack-table/core/state-management` — atom precedence rules.
- `tanstack-table/svelte/production-readiness` — post-migration tuning.
